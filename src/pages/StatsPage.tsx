import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useAuth } from "../hooks/useAuthStore";
import { SectionLabel, EmptyState } from "../components/ui";

export function StatsPage() {
  const { account } = useAuth();
  const matches = account!.matches;
  const theme = account!.theme;

  const wins = matches.filter((m) => m.homeScore > m.awayScore).length;
  const losses = matches.filter((m) => m.homeScore < m.awayScore).length;
  const draws = matches.length - wins - losses;
  const pieData = [
    { name: "Wins", value: wins, color: theme.bright },
    { name: "Draws", value: draws, color: "#E8B23D" },
    { name: "Losses", value: losses, color: "#7B8890" },
  ];

  const byMonth = useMemo(() => {
    const map: Record<string, number> = {};
    matches.forEach((m) => {
      const key = new Date(m.date).toLocaleDateString("en-GB", { month: "short" });
      map[key] = (map[key] || 0) + m.goals;
    });
    return Object.entries(map).map(([month, goals]) => ({ month, goals })).reverse();
  }, [matches]);

  if (matches.length === 0) {
    return <EmptyState title="Nothing to chart yet" hint="Log a few matches and your win rate, goals, and rating trends will appear here." />;
  }

  return (
    <div className="flex flex-col gap-5.5">
      <div>
        <SectionLabel>Results Breakdown</SectionLabel>
        <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-5 flex-wrap">
          <div className="w-40 h-40">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={45} outerRadius={70} paddingAngle={3} stroke="none">
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: d.color }} />
                <span className="font-body text-[13px] text-chalk-dim">{d.name}</span>
                <span className="font-display text-[15px] text-chalk ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Goals per Month</SectionLabel>
        <div className="bg-surface border border-border rounded-2xl py-4 px-2 h-[200px]">
          <ResponsiveContainer>
            <BarChart data={byMonth}>
              <CartesianGrid stroke="#2A2626" vertical={false} />
              <XAxis dataKey="month" stroke="#726C6A" fontSize={11} tickLine={false} axisLine={{ stroke: "#2A2626" }} />
              <YAxis stroke="#726C6A" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: "#0E0E0E", border: "1px solid #2A2626", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#F2F0E6" }} />
              <Bar dataKey="goals" fill={theme.bright} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
