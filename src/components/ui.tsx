import type { ReactNode, ElementType } from "react";
import type { Theme } from "../types";

export function ScoreDigits({
  value,
  size = 30,
  accent,
  theme,
}: {
  value: string | number;
  size?: number;
  accent?: string;
  theme: Theme;
}) {
  const col = accent || theme.bright;
  const chars = String(value).split("");
  return (
    <div className="flex gap-[3px]">
      {chars.map((ch, i) => (
        <div
          key={i}
          className="bg-[#070707] border border-border rounded flex items-center justify-center font-display font-semibold tabular-nums"
          style={{
            width: /[.:\s]/.test(ch) ? size * 0.4 : size * 0.62,
            height: size * 1.15,
            fontSize: size * 0.72,
            color: col,
            textShadow: `0 0 10px ${col}99, 0 0 2px ${col}`,
          }}
        >
          {ch}
        </div>
      ))}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  theme,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: ElementType;
  accent?: string;
  theme: Theme;
}) {
  const col = accent || theme.bright;
  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-1.5 min-w-0">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-wider text-chalk-faint uppercase">{label}</span>
        {Icon && <Icon size={14} className="text-chalk-faint" />}
      </div>
      <span className="font-display text-3xl text-chalk leading-none font-medium">{value}</span>
      {sub && <span className="font-body text-xs" style={{ color: col }}>{sub}</span>}
    </div>
  );
}

const PILL_TONES = {
  default: { bg: "bg-surface-alt", fg: "text-chalk-dim", bd: "border-border" },
  gold: { bg: "bg-[#332813]", fg: "text-gold", bd: "border-[#5A461C]" },
  muted: { bg: "bg-[#1B2226]", fg: "text-muted", bd: "border-[#333D42]" },
} as const;

export function Pill({
  children,
  tone = "default",
  theme,
}: {
  children: ReactNode;
  tone?: "default" | "accent" | "gold" | "muted";
  theme: Theme;
}) {
  if (tone === "accent") {
    return (
      <span
        className="font-mono text-[10.5px] tracking-wide px-2 py-[3px] rounded-full border"
        style={{ background: theme.dim, color: theme.bright, borderColor: theme.primary }}
      >
        {children}
      </span>
    );
  }
  const t = PILL_TONES[tone];
  return (
    <span className={`font-mono text-[10.5px] tracking-wide px-2 py-[3px] rounded-full border ${t.bg} ${t.fg} ${t.bd}`}>
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 my-1 mb-3.5">
      <span className="font-mono text-[11px] tracking-[0.12em] text-chalk-faint uppercase">{children}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="bg-surface border border-dashed border-border rounded-xl px-5 py-8 text-center">
      <div className="font-display text-lg text-chalk mb-1">{title}</div>
      <div className="font-body text-xs text-chalk-faint">{hint}</div>
    </div>
  );
}

/** Floodlit-stadium feel built from CSS gradients — no photography, tinted per active theme. */
export function StadiumGlow({ theme, intensity = 1 }: { theme: Theme; intensity?: number }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-32 -left-[10%] w-3/5 h-[340px] blur-[10px]"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.bright}55 0%, transparent 70%)`,
          opacity: 0.35 * intensity,
          transform: "rotate(-8deg)",
        }}
      />
      <div
        className="absolute -top-36 -right-[10%] w-3/5 h-[340px] blur-[10px]"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.bright}45 0%, transparent 70%)`,
          opacity: 0.3 * intensity,
          transform: "rotate(8deg)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.09 * intensity,
          backgroundImage: "radial-gradient(#F2F0E6 0.6px, transparent 0.6px)",
          backgroundSize: "10px 10px",
          maskImage: "linear-gradient(to bottom, black, transparent 75%)",
          WebkitMaskImage: "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />
    </div>
  );
}
