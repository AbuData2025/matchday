import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "../hooks/useAuthStore";
import { CLUB_PRESETS, buildCustomTheme } from "../utils/themes";
import { StadiumGlow } from "../components/ui";

export function AuthPage() {
  const { account, authError, pendingConfirmation, signIn, signInWithGoogle, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [club, setClub] = useState("");
  const [presetId, setPresetId] = useState("mutd");
  const [customHex, setCustomHex] = useState("#3FA34D");
  const [localError, setLocalError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (account) return <Navigate to="/dashboard" replace />;

  const previewTheme =
    presetId === "custom" ? buildCustomTheme(customHex, club) : CLUB_PRESETS.find((p) => p.id === presetId)!;

  const submit = async () => {
    setLocalError("");
    if (!email.trim() || !password) {
      setLocalError("Email and password are required.");
      return;
    }
    setSubmitting(true);
    if (mode === "signin") {
      await signIn(email.trim(), password);
    } else {
      if (!name.trim()) {
        setLocalError("Name is required.");
        setSubmitting(false);
        return;
      }
      if (password.length < 6) {
        setLocalError("Password must be at least 6 characters.");
        setSubmitting(false);
        return;
      }
      await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        theme: previewTheme,
        club: club.trim() || "The Ballers FC",
      });
    }
    setSubmitting(false);
  };

  const error = localError || authError;

  const inputCls =
    "w-full bg-[#0F0E0E] border border-border rounded-lg px-3 py-2.5 text-chalk text-[13.5px] outline-none font-body";
  const labelCls = "font-mono text-[10.5px] text-chalk-faint tracking-wide mb-1.5 block";

  if (pendingConfirmation) {
    return (
      <div className="bg-bg min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-body">
        <StadiumGlow theme={previewTheme} intensity={1.3} />
        <div className="relative w-full max-w-[380px] bg-surface border border-border rounded-2xl p-6 text-center">
          <div className="font-display text-xl text-chalk mb-2">Check your email</div>
          <p className="font-body text-[13.5px] text-chalk-dim">
            We've sent a confirmation link to <span className="text-chalk">{email}</span>. Click it, then come back
            here and sign in.
          </p>
          <button
            onClick={() => setMode("signin")}
            className="font-display text-sm font-semibold text-[#F2F0E6] border-none rounded-[10px] px-4 py-2.5 cursor-pointer mt-4"
            style={{ background: previewTheme.primary }}
          >
            BACK TO SIGN IN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg min-h-screen flex items-center justify-center p-5 relative overflow-hidden font-body">
      <StadiumGlow theme={previewTheme} intensity={1.3} />
      <div className="relative w-full max-w-[380px]">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: previewTheme.bright, boxShadow: `0 0 10px ${previewTheme.bright}` }}
          />
          <span className="font-display text-2xl tracking-wide text-chalk font-semibold">MATCHDAY</span>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex gap-1 bg-bg-alt rounded-[10px] p-1 mb-4.5">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setLocalError("");
                }}
                className="flex-1 font-body text-xs font-semibold py-2 rounded-lg"
                style={{
                  background: mode === m ? previewTheme.dim : "transparent",
                  color: mode === m ? previewTheme.bright : "#726C6A",
                }}
              >
                {m === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
              </button>
            ))}
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2.5 font-body text-[13.5px] font-medium text-chalk bg-[#0F0E0E] border border-border rounded-lg px-4 py-2.5 mb-4 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-3.5z" />
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.7 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34 5.1 29.3 3 24 3 16.1 3 9.3 7.5 6.3 14.7z" />
              <path fill="#4CAF50" d="M24 45c5.2 0 9.9-2 13.5-5.2l-6.2-5.3C29.3 36.5 26.8 37 24 37c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.2 40.5 16 45 24 45z" />
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.3 5.6l6.2 5.3C40.5 36.4 45 30.7 45 24c0-1.4-.1-2.8-.4-3.5z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-border" />
            <span className="font-mono text-[10px] text-chalk-faint">OR</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex flex-col gap-3.5">
            {mode === "signup" && (
              <div>
                <span className={labelCls}>NAME</span>
                <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
            )}
            <div>
              <span className={labelCls}>EMAIL</span>
              <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <span className={labelCls}>PASSWORD</span>
              <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            {mode === "signup" && (
              <>
                <div>
                  <span className={labelCls}>TEAM / CLUB YOU PLAY FOR</span>
                  <input className={inputCls} value={club} onChange={(e) => setClub(e.target.value)} placeholder="The Ballers FC" />
                </div>
                <div>
                  <span className={labelCls}>PICK YOUR COLOURS</span>
                  <div className="flex gap-2 flex-wrap">
                    {CLUB_PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPresetId(p.id)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border"
                        style={{
                          borderColor: presetId === p.id ? p.primary : "#2A2626",
                          background: presetId === p.id ? p.dim : "transparent",
                        }}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-border-bright"
                          style={{ background: p.id === "custom" ? customHex : p.primary }}
                        />
                        <span className="font-body text-[11.5px]" style={{ color: presetId === p.id ? "#F2F0E6" : "#A6A19E" }}>
                          {p.label}
                        </span>
                        {presetId === p.id && <Check size={11} color={p.id === "custom" ? customHex : p.primary} />}
                      </button>
                    ))}
                  </div>
                  {presetId === "custom" && (
                    <div className="flex items-center gap-2.5 mt-2.5">
                      <input
                        type="color"
                        value={customHex}
                        onChange={(e) => setCustomHex(e.target.value)}
                        className="w-9 h-7 rounded-md border border-border bg-transparent p-0 cursor-pointer"
                      />
                      <span className="font-mono text-xs text-chalk-dim">{customHex.toUpperCase()}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {error && <div className="font-body text-xs text-[#E27259]">{error}</div>}

            <button
              onClick={submit}
              disabled={submitting}
              className="font-display text-[15px] font-semibold tracking-wide text-[#F2F0E6] border-none rounded-[10px] px-4.5 py-3 cursor-pointer mt-1 disabled:opacity-50"
              style={{ background: previewTheme.primary }}
            >
              {submitting ? "PLEASE WAIT…" : mode === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
