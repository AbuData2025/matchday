import { useState } from "react";
import { Pencil, X, Save, Check } from "lucide-react";
import { useAuth } from "../hooks/useAuthStore";
import { SectionLabel } from "../components/ui";
import { computeBadges } from "../utils/achievements";
import { CLUB_PRESETS, buildCustomTheme } from "../utils/themes";

const labelCls = "font-mono text-[10.5px] text-chalk-faint tracking-wide mb-1.5 block";
const inputCls = "w-full bg-[#0F0E0E] border border-border rounded-lg px-2.5 py-2 text-chalk text-[13.5px] outline-none font-body";

function EditField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col">
      <span className={labelCls}>{label.toUpperCase()}</span>
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function ProfilePage() {
  const { account, updateProfile } = useAuth();
  const theme = account!.theme;
  const p = account!.player;
  const badges = computeBadges(account!.matches);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(account!.name);
  const [club, setClub] = useState(p.club);
  const [position, setPosition] = useState(p.position);
  const [foot, setFoot] = useState(p.foot);
  const [height, setHeight] = useState(p.height === "—" ? "" : p.height);
  const [jersey, setJersey] = useState(p.jersey === "—" ? "" : p.jersey);
  const [presetId, setPresetId] = useState(theme.id);
  const [customHex, setCustomHex] = useState(theme.id === "custom" ? theme.primary : "#3FA34D");
  const [customClubName, setCustomClubName] = useState(theme.id === "custom" ? theme.club : "");

  const startEditing = () => {
    setName(account!.name);
    setClub(p.club);
    setPosition(p.position);
    setFoot(p.foot);
    setHeight(p.height === "—" ? "" : p.height);
    setJersey(p.jersey === "—" ? "" : p.jersey);
    setPresetId(theme.id);
    setCustomHex(theme.id === "custom" ? theme.primary : "#3FA34D");
    setCustomClubName(theme.id === "custom" ? theme.club : "");
    setEditing(true);
  };

  const previewTheme = presetId === "custom" ? buildCustomTheme(customHex, customClubName) : CLUB_PRESETS.find((c) => c.id === presetId)!;

  const save = async () => {
    setSaving(true);
    const ok = await updateProfile({
      name: name.trim() || account!.name,
      club: club.trim() || p.club,
      position: position.trim() || p.position,
      foot: foot.trim() || p.foot,
      height: height.trim() || "—",
      jersey: jersey.trim() || "—",
      theme: previewTheme,
    });
    setSaving(false);
    if (ok) setEditing(false);
  };

  const rows: [string, string][] = [
    ["Position", p.position],
    ["Preferred Foot", p.foot],
    ["Height", p.height === "—" ? "—" : `${p.height} cm`],
    ["Current Club", p.club],
    ["Favourite Number", `#${p.jersey}`],
    ["Supports", theme.club],
  ];

  return (
    <div className="flex flex-col gap-5.5">
      <div className="bg-surface border border-border rounded-2xl p-5.5">
        <div className="flex items-center justify-between mb-4.5">
          <div className="flex items-center gap-3.5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-display text-[22px] font-semibold border"
              style={{ background: (editing ? previewTheme : theme).dim, color: (editing ? previewTheme : theme).bright, borderColor: (editing ? previewTheme : theme).primary }}
            >
              {account!.name[0]}
            </div>
            <div>
              <div className="font-display text-[22px] text-chalk font-medium">{account!.name}</div>
              <div className="font-body text-xs text-chalk-dim">{account!.email}</div>
            </div>
          </div>
          {!editing && (
            <button
              onClick={startEditing}
              className="flex items-center gap-1.5 font-body text-xs px-3 py-1.5 rounded-full border border-border text-chalk-dim"
            >
              <Pencil size={12} /> Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-3.5">
            <div className="grid gap-3.5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
              <EditField label="Name" value={name} onChange={setName} />
              <EditField label="Current club" value={club} onChange={setClub} />
              <EditField label="Position" value={position} onChange={setPosition} placeholder="e.g. Goalkeeper" />
              <EditField label="Preferred foot" value={foot} onChange={setFoot} placeholder="Right / Left" />
              <EditField label="Height (cm)" value={height} onChange={setHeight} placeholder="e.g. 180" />
              <EditField label="Jersey number" value={jersey} onChange={setJersey} placeholder="e.g. 9" />
            </div>

            <div>
              <span className={labelCls}>SUPPORTS</span>
              <div className="flex gap-2 flex-wrap">
                {CLUB_PRESETS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setPresetId(c.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border"
                    style={{
                      borderColor: presetId === c.id ? c.primary : "#2A2626",
                      background: presetId === c.id ? c.dim : "transparent",
                    }}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-border-bright"
                      style={{ background: c.id === "custom" ? customHex : c.primary }}
                    />
                    <span className="font-body text-[11.5px]" style={{ color: presetId === c.id ? "#F2F0E6" : "#A6A19E" }}>
                      {c.id === "custom" ? "Custom" : c.club}
                    </span>
                    {presetId === c.id && <Check size={11} color={c.id === "custom" ? customHex : c.primary} />}
                  </button>
                ))}
              </div>
              {presetId === "custom" && (
                <div className="flex items-center gap-2.5 mt-2.5 flex-wrap">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => setCustomHex(e.target.value)}
                    className="w-9 h-7 rounded-md border border-border bg-transparent p-0 cursor-pointer"
                  />
                  <span className="font-mono text-xs text-chalk-dim">{customHex.toUpperCase()}</span>
                  <input
                    className={`${inputCls} flex-1 min-w-[140px]`}
                    value={customClubName}
                    onChange={(e) => setCustomClubName(e.target.value)}
                    placeholder="Club name, e.g. Barcelona"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2.5 mt-1">
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-1.5 font-display text-[13.5px] font-semibold tracking-wide text-[#F2F0E6] border-none rounded-lg px-3.5 py-2 cursor-pointer disabled:opacity-50"
                style={{ background: previewTheme.primary }}
              >
                <Save size={14} /> {saving ? "SAVING…" : "SAVE"}
              </button>
              <button
                onClick={() => setEditing(false)}
                disabled={saving}
                className="flex items-center gap-1.5 font-body text-[13.5px] px-3.5 py-2 rounded-lg border border-border text-chalk-dim"
              >
                <X size={14} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col">
            {rows.map(([k, v], i) => (
              <div key={k} className={`flex justify-between py-2.5 ${i === 0 ? "" : "border-t border-border"}`}>
                <span className="font-mono text-[11.5px] text-chalk-faint tracking-wide">{k.toUpperCase()}</span>
                <span className="font-body text-[13.5px] text-chalk">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <SectionLabel>Achievements</SectionLabel>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
          {badges.map((b) => (
            <div
              key={b.id}
              className="rounded-xl px-3 py-3.5 flex flex-col items-center gap-2 border"
              style={{
                background: b.earned ? theme.dim : "#161515",
                borderColor: b.earned ? theme.primary : "#2A2626",
                opacity: b.earned ? 1 : 0.4,
              }}
            >
              <span className="font-body text-[11.5px] text-center" style={{ color: b.earned ? "#F2F0E6" : "#726C6A" }}>
                {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
