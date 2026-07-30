import { useMemo, useState } from "react";
import { ListChecks, Trophy, ShieldCheck, Goal, Handshake, Pencil, Check, X } from "lucide-react";
import { useAuth } from "../hooks/useAuthStore";
import { useCountdown } from "../hooks/useCountdown";
import { ScoreDigits, StatCard, SectionLabel, EmptyState, StadiumGlow } from "../components/ui";

// datetime-local inputs use "YYYY-MM-DDTHH:mm" in the browser's local time zone.
function isoToLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatKickoff(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardPage() {
  const { account, updateNextMatch } = useAuth();
  const nextMatch = account!.nextMatch;
  const cd = useCountdown(nextMatch?.kickoff ?? "");
  const matches = account!.matches;
  const theme = account!.theme;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [opponent, setOpponent] = useState(nextMatch?.opponent ?? "");
  const [kickoff, setKickoff] = useState(nextMatch ? isoToLocalInput(nextMatch.kickoff) : "");

  const startEditing = () => {
    setOpponent(nextMatch?.opponent ?? "");
    setKickoff(nextMatch ? isoToLocalInput(nextMatch.kickoff) : "");
    setEditing(true);
  };

  const save = async () => {
    if (!opponent.trim() || !kickoff) return;
    setSaving(true);
    const ok = await updateNextMatch({ opponent: opponent.trim(), kickoff: new Date(kickoff).toISOString() });
    setSaving(false);
    if (ok) setEditing(false);
  };

  const clear = async () => {
    setSaving(true);
    const ok = await updateNextMatch(null);
    setSaving(false);
    if (ok) setEditing(false);
  };

  const stats = useMemo(() => {
    const wins = matches.filter((m) => m.homeScore > m.awayScore).length;
    const losses = matches.filter((m) => m.homeScore < m.awayScore).length;
    const draws = matches.length - wins - losses;
    const goals = matches.reduce((s, m) => s + m.goals, 0);
    const assists = matches.reduce((s, m) => s + m.assists, 0);
    const cs = matches.filter((m) => m.cleanSheet).length;
    const avgRating = matches.length ? (matches.reduce((s, m) => s + m.rating, 0) / matches.length).toFixed(1) : "0.0";
    return { wins, losses, draws, goals, assists, cs, avgRating, played: matches.length };
  }, [matches]);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const inputCls = "w-full bg-[#0F0E0E] border border-border rounded-lg px-2.5 py-2 text-chalk text-[13.5px] outline-none font-body";
  const labelCls = "font-mono text-[10.5px] text-chalk-faint tracking-wide mb-1.5 block";

  return (
    <div className="flex flex-col gap-5.5">
      <div
        className="relative overflow-hidden rounded-2xl border border-border px-6 py-6.5"
        style={{ background: `radial-gradient(120% 140% at 15% 0%, ${theme.heroFrom} 0%, #161515 55%)` }}
      >
        <StadiumGlow theme={theme} />
        <div className="relative">
          <span className="font-mono text-[11.5px] tracking-wide" style={{ color: theme.bright }}>
            {greet.toUpperCase()}
          </span>
          <h1 className="font-display text-[34px] font-semibold text-chalk mt-1">{account!.name}</h1>
          <div className="flex gap-4.5 mt-4.5 flex-wrap">
            <ScoreDigits value={stats.avgRating} size={30} theme={theme} />
            <div className="flex flex-col justify-center">
              <span className="font-mono text-[10.5px] text-chalk-faint tracking-wide">CURRENT RATING</span>
              <span className="font-body text-xs text-chalk-dim">Across {stats.played} matches</span>
            </div>
          </div>
        </div>
      </div>

      {matches.length === 0 ? (
        <EmptyState title="No matches logged yet" hint="Head to Log Match after your next game to start building your season stats." />
      ) : (
        <div>
          <SectionLabel>Season so far</SectionLabel>
          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))" }}>
            <StatCard label="Played" value={stats.played} icon={ListChecks} theme={theme} />
            <StatCard label="Wins" value={stats.wins} icon={Trophy} theme={theme} />
            <StatCard label="Losses" value={stats.losses} icon={ShieldCheck} accent="#7B8890" theme={theme} />
            <StatCard label="Draws" value={stats.draws} icon={ShieldCheck} accent="#A6A19E" theme={theme} />
            <StatCard label="Goals" value={stats.goals} icon={Goal} accent="#E8B23D" theme={theme} />
            <StatCard label="Assists" value={stats.assists} icon={Handshake} theme={theme} />
            <StatCard label="Clean Sheets" value={stats.cs} icon={ShieldCheck} theme={theme} />
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <SectionLabel>Next Match</SectionLabel>
          {!editing && (
            <button onClick={startEditing} className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-full border border-border text-chalk-dim">
              <Pencil size={12} /> {nextMatch ? "Edit" : "Set match"}
            </button>
          )}
        </div>

        <div className="bg-surface border border-border rounded-2xl px-5 py-4.5">
          {editing ? (
            <div className="flex flex-col gap-3.5">
              <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
                <div>
                  <span className={labelCls}>OPPONENT</span>
                  <input className={inputCls} value={opponent} onChange={(e) => setOpponent(e.target.value)} placeholder="e.g. Coastal Rovers" />
                </div>
                <div>
                  <span className={labelCls}>KICKOFF</span>
                  <input type="datetime-local" className={inputCls} value={kickoff} onChange={(e) => setKickoff(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={save}
                  disabled={saving || !opponent.trim() || !kickoff}
                  className="flex items-center gap-1.5 font-display text-[13.5px] font-semibold tracking-wide text-[#F2F0E6] border-none rounded-lg px-3.5 py-2 cursor-pointer disabled:opacity-50"
                  style={{ background: theme.primary }}
                >
                  <Check size={14} /> {saving ? "SAVING…" : "SAVE"}
                </button>
                <button onClick={() => setEditing(false)} disabled={saving} className="flex items-center gap-1.5 font-body text-[13.5px] px-3.5 py-2 rounded-lg border border-border text-chalk-dim">
                  <X size={14} /> Cancel
                </button>
                {nextMatch && (
                  <button onClick={clear} disabled={saving} className="font-body text-[13.5px] px-3.5 py-2 rounded-lg text-[#E27259] ml-auto">
                    Clear
                  </button>
                )}
              </div>
            </div>
          ) : nextMatch ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-display text-xl text-chalk font-medium">vs {nextMatch.opponent}</span>
                <div className="font-body text-xs text-chalk-dim mt-0.5">{formatKickoff(nextMatch.kickoff)}</div>
              </div>
              <div className="flex gap-1.5 items-center">
                <ScoreDigits value={String(cd.days).padStart(2, "0")} size={26} accent="#E8B23D" theme={theme} />
                <span className="font-mono text-chalk-faint text-lg">:</span>
                <ScoreDigits value={String(cd.hours).padStart(2, "0")} size={26} accent="#E8B23D" theme={theme} />
                <span className="font-mono text-chalk-faint text-lg">:</span>
                <ScoreDigits value={String(cd.mins).padStart(2, "0")} size={26} accent="#E8B23D" theme={theme} />
                <span className="font-mono text-chalk-faint text-lg">:</span>
                <ScoreDigits value={String(cd.secs).padStart(2, "0")} size={26} accent="#E8B23D" theme={theme} />
              </div>
            </div>
          ) : (
            <div className="font-body text-[13.5px] text-chalk-dim">No upcoming match set. Click "Set match" to add one and start a countdown.</div>
          )}
        </div>
      </div>
    </div>
  );
}
