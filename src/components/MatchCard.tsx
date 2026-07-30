import type { Match, Theme } from "../types";
import { ScoreDigits, Pill } from "./ui";

export function MatchCard({ m, theme }: { m: Match; theme: Theme }) {
  const won = m.homeScore > m.awayScore;
  const lost = m.homeScore < m.awayScore;
  const resultTone = won ? "accent" : lost ? "muted" : "default";
  const resultLabel = won ? "WIN" : lost ? "LOSS" : "DRAW";

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4.5 py-3.5 flex items-center justify-between border-b border-dashed border-border">
        <div>
          <div className="font-body text-sm text-chalk-dim">
            {m.homeTeam} <span className="text-chalk-faint">vs</span> {m.opponent}
          </div>
          <div className="font-mono text-[10.5px] text-chalk-faint mt-0.5">
            {new Date(m.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
        <ScoreDigits
          value={`${m.homeScore}-${m.awayScore}`}
          size={22}
          accent={won ? undefined : lost ? "#7B8890" : "#F2F0E6"}
          theme={theme}
        />
      </div>
      <div className="px-4.5 py-3.5 flex items-center justify-between flex-wrap gap-2.5">
        <div className="flex gap-1.5 flex-wrap">
          <Pill tone={resultTone as any} theme={theme}>{resultLabel}</Pill>
          {m.goals > 0 && <Pill tone="gold" theme={theme}>{m.goals} GOAL{m.goals > 1 ? "S" : ""}</Pill>}
          {m.assists > 0 && <Pill theme={theme}>{m.assists} ASSIST{m.assists > 1 ? "S" : ""}</Pill>}
          {m.cleanSheet && <Pill tone="accent" theme={theme}>CLEAN SHEET</Pill>}
          {m.motm && <Pill tone="gold" theme={theme}>★ MOTM</Pill>}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-chalk-faint">RATING</span>
          <span className="font-display text-lg text-chalk font-semibold">{m.rating.toFixed(1)}</span>
        </div>
      </div>
      {m.notes && (
        <div className="px-4.5 pb-3.5 font-body text-xs text-chalk-dim italic">"{m.notes}"</div>
      )}
    </div>
  );
}
