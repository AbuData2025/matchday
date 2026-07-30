import { createContext, useContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Account, Theme, Match, MatchFormInput, NextMatch } from "../types";
import { supabase } from "../lib/supabase";
import { CLUB_PRESETS } from "../utils/themes";

interface AuthContextValue {
  account: Account | null;
  loading: boolean;
  authError: string | null;
  pendingConfirmation: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (input: { name: string; email: string; password: string; theme: Theme; club: string }) => Promise<void>;
  signOut: () => Promise<void>;
  addMatch: (form: MatchFormInput) => Promise<void>;
  updateProfile: (input: { name: string; club: string; position: string; foot: string; height: string; jersey: string; theme: Theme }) => Promise<boolean>;
  updateNextMatch: (input: NextMatch | null) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// --- DB row <-> app model mapping -------------------------------------

type ProfileRow = {
  id: string;
  name: string;
  club: string;
  position: string;
  foot: string;
  height: string;
  jersey: string;
  theme: Theme;
  next_match_opponent: string | null;
  next_match_kickoff: string | null;
};

type MatchRow = {
  id: string;
  user_id: string;
  opponent: string;
  date: string;
  home_team: string;
  home_score: number;
  away_score: number;
  goals: number;
  assists: number;
  clean_sheet: boolean;
  motm: boolean;
  rating: number;
  position: string;
  minutes: number;
  feeling: string;
  notes: string;
};

function rowToMatch(row: MatchRow): Match {
  return {
    id: row.id,
    opponent: row.opponent,
    date: row.date,
    homeTeam: row.home_team,
    homeScore: row.home_score,
    awayScore: row.away_score,
    goals: row.goals,
    assists: row.assists,
    cleanSheet: row.clean_sheet,
    motm: row.motm,
    rating: row.rating,
    position: row.position,
    minutes: row.minutes,
    feeling: row.feeling,
    notes: row.notes,
  };
}

// --- Provider -----------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] = useState(false);

  const loadAccount = useCallback(async (userId: string, email: string, fallbackName?: string) => {
    const [{ data: profile, error: profileError }, { data: matches, error: matchesError }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("matches").select("*").eq("user_id", userId).order("date", { ascending: false }),
    ]);

    let p = profile as ProfileRow | null;

    // First-time OAuth sign-in (e.g. Google): no profile row exists yet, create a default one.
    if ((profileError || !p) && fallbackName !== undefined) {
      const defaultTheme: Theme = CLUB_PRESETS[0];
      const { data: created, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          name: fallbackName || email.split("@")[0],
          club: "The Ballers FC",
          position: "Outfield",
          foot: "Right",
          height: "—",
          jersey: "—",
          theme: defaultTheme,
        })
        .select()
        .single();
      if (!createError && created) p = created as ProfileRow;
    }

    if (!p) {
      setAccount(null);
      return;
    }

    setAccount({
      id: p.id,
      name: p.name,
      email,
      theme: p.theme,
      player: { position: p.position, foot: p.foot, height: p.height, club: p.club, jersey: p.jersey },
      matches: matchesError || !matches ? [] : (matches as MatchRow[]).map(rowToMatch),
      nextMatch: p.next_match_opponent && p.next_match_kickoff ? { opponent: p.next_match_opponent, kickoff: p.next_match_kickoff } : null,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        const u = data.session.user;
        const fallbackName = u.app_metadata?.provider === "google" ? (u.user_metadata?.full_name || u.user_metadata?.name) : undefined;
        loadAccount(u.id, u.email ?? "", fallbackName).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        const u = newSession.user;
        const fallbackName = u.app_metadata?.provider === "google" ? (u.user_metadata?.full_name || u.user_metadata?.name) : undefined;
        loadAccount(u.id, u.email ?? "", fallbackName);
      } else {
        setAccount(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [loadAccount]);

  const signIn = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setAuthError(error.message);
  }, []);

  const signUp = useCallback(
    async ({ name, email, password, theme, club }: { name: string; email: string; password: string; theme: Theme; club: string }) => {
      setAuthError(null);
      setPendingConfirmation(false);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setAuthError(error.message);
        return;
      }
      if (!data.user) {
        setAuthError("Something went wrong creating your account. Please try again.");
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        club,
        position: "Outfield",
        foot: "Right",
        height: "—",
        jersey: "—",
        theme,
      });
      if (profileError) {
        setAuthError(profileError.message);
        return;
      }

      // If email confirmation is required, there's no session yet.
      if (!data.session) {
        setPendingConfirmation(true);
      } else {
        await loadAccount(data.user.id, email);
      }
    },
    [loadAccount]
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setAccount(null);
  }, []);

  const addMatch = useCallback(
    async (form: MatchFormInput) => {
      if (!session || !account) return;

      const insert = {
        user_id: session.user.id,
        opponent: form.opponent || "Unnamed Opponent",
        date: form.date || new Date().toISOString().slice(0, 10),
        home_team: account.player.club,
        home_score: Number(form.homeScore) || 0,
        away_score: Number(form.awayScore) || 0,
        goals: Number(form.goals) || 0,
        assists: Number(form.assists) || 0,
        clean_sheet: form.position === "GK" && Number(form.awayScore) === 0,
        motm: false,
        rating: Number(form.rating) || 0,
        position: form.position || account.player.position,
        minutes: Number(form.minutes) || 90,
        feeling: form.feeling,
        notes: form.notes,
      };

      const { data, error } = await supabase.from("matches").insert(insert).select().single();
      if (error || !data) {
        setAuthError(error?.message ?? "Could not save the match. Please try again.");
        return;
      }

      const newMatch = rowToMatch(data as MatchRow);
      setAccount((prev) => (prev ? { ...prev, matches: [newMatch, ...prev.matches] } : prev));
    },
    [session, account]
  );

  const updateProfile = useCallback(
    async (input: { name: string; club: string; position: string; foot: string; height: string; jersey: string; theme: Theme }) => {
      if (!account) return false;
      setAuthError(null);
      const { error } = await supabase
        .from("profiles")
        .update({
          name: input.name,
          club: input.club,
          position: input.position,
          foot: input.foot,
          height: input.height,
          jersey: input.jersey,
          theme: input.theme,
        })
        .eq("id", account.id);

      if (error) {
        setAuthError(error.message);
        return false;
      }

      setAccount((prev) =>
        prev
          ? {
              ...prev,
              name: input.name,
              theme: input.theme,
              player: { ...prev.player, club: input.club, position: input.position, foot: input.foot, height: input.height, jersey: input.jersey },
            }
          : prev
      );
      return true;
    },
    [account]
  );

  const updateNextMatch = useCallback(
    async (input: NextMatch | null) => {
      if (!account) return false;
      setAuthError(null);
      const { error } = await supabase
        .from("profiles")
        .update({
          next_match_opponent: input?.opponent ?? null,
          next_match_kickoff: input?.kickoff ?? null,
        })
        .eq("id", account.id);

      if (error) {
        setAuthError(error.message);
        return false;
      }

      setAccount((prev) => (prev ? { ...prev, nextMatch: input } : prev));
      return true;
    },
    [account]
  );

  return (
    <AuthContext.Provider
      value={{ account, loading, authError, pendingConfirmation, signIn, signInWithGoogle, signUp, signOut, addMatch, updateProfile, updateNextMatch }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
