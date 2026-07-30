import { useState, type ChangeEvent, type ReactNode } from "react";
import { Save } from "lucide-react";
import { useAuth } from "../hooks/useAuthStore";
import { SectionLabel } from "../components/ui";
import type { MatchFormInput } from "../types";

const FEELINGS = ["Excellent", "Good", "Average", "Poor"];

const labelCls = "font-mono text-[10.5px] text-chalk-faint tracking-wide mb-1.5 block";

// Defined at module scope (not inside LogMatchPage) so it keeps a stable
// identity across renders — otherwise React remounts its children (the
// inputs) on every keystroke and focus gets dropped after one character.
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <span className={labelCls}>{label.toUpperCase()}</span>
      {children}
    </div>
  );
}

export function LogMatchPage() {
  const { account, addMatch } = useAuth();
  const theme = account!.theme;
  const defaultPosition = account!.player.position === "Goalkeeper" ? "GK" : "ST";

  const [form, setForm] = useState<MatchFormInput>({
    opponent: "", date: "", homeScore: 0, awayScore: 0, goals: 0, assists: 0,
    yellow: 0, red: 0, minutes: 90, position: defaultPosition, rating: 7, feeling: "Good", notes: "",
  });
  const [saved, setSaved] = useState(false);

  const upd = (k: keyof MatchFormInput) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const numeric = ["homeScore", "awayScore", "goals", "assists", "yellow", "red", "minutes", "rating"];
    const v = numeric.includes(k) ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [k]: v as never }));
    setSaved(false);
  };

  const inputCls = "w-full bg-[#0F0E0E] border border-border rounded-lg px-2.5 py-2 text-chalk text-[13.5px] outline-none font-body";

  return (
    <div>
      <SectionLabel>Log a Match</SectionLabel>
      <div className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-4">
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          <Field label="Opponent"><input className={inputCls} value={form.opponent} onChange={upd("opponent")} placeholder="e.g. Eagles FC" /></Field>
          <Field label="Date"><input type="date" className={inputCls} value={form.date} onChange={upd("date")} /></Field>
          <Field label="Your score"><input type="number" className={inputCls} value={form.homeScore} onChange={upd("homeScore")} /></Field>
          <Field label="Their score"><input type="number" className={inputCls} value={form.awayScore} onChange={upd("awayScore")} /></Field>
        </div>
        <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))" }}>
          <Field label="Goals"><input type="number" className={inputCls} value={form.goals} onChange={upd("goals")} /></Field>
          <Field label="Assists"><input type="number" className={inputCls} value={form.assists} onChange={upd("assists")} /></Field>
          <Field label="Yellow cards"><input type="number" className={inputCls} value={form.yellow} onChange={upd("yellow")} /></Field>
          <Field label="Red cards"><input type="number" className={inputCls} value={form.red} onChange={upd("red")} /></Field>
          <Field label="Minutes"><input type="number" className={inputCls} value={form.minutes} onChange={upd("minutes")} /></Field>
          <Field label="Position"><input className={inputCls} value={form.position} onChange={upd("position")} /></Field>
        </div>

        <Field label="Match rating">
          <div className="flex items-center gap-3">
            <input type="range" min={1} max={10} step={0.1} value={form.rating} onChange={upd("rating")} className="flex-1" style={{ accentColor: theme.bright }} />
            <span className="font-display text-xl text-gold min-w-[34px]">{Number(form.rating).toFixed(1)}</span>
          </div>
        </Field>

        <Field label="How did you feel today?">
          <div className="flex gap-2 flex-wrap">
            {FEELINGS.map((f) => (
              <button
                key={f}
                onClick={() => { setForm((s) => ({ ...s, feeling: f })); setSaved(false); }}
                className="font-body text-xs px-3.5 py-1.5 rounded-full border"
                style={{
                  borderColor: form.feeling === f ? theme.primary : "#2A2626",
                  background: form.feeling === f ? theme.dim : "transparent",
                  color: form.feeling === f ? theme.bright : "#A6A19E",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Notes">
          <textarea rows={3} className={`${inputCls} resize-y`} value={form.notes} onChange={upd("notes")} placeholder="Today I made a great save in the final minute." />
        </Field>

        <button
          onClick={async () => { await addMatch(form); setSaved(true); }}
          className="font-display text-[15px] font-semibold tracking-wide text-[#F2F0E6] border-none rounded-[10px] px-4.5 py-3 cursor-pointer flex items-center justify-center gap-2 mt-1"
          style={{ background: theme.primary }}
        >
          <Save size={16} /> {saved ? "SAVED TO HISTORY" : "SAVE MATCH"}
        </button>
      </div>
    </div>
  );
}
