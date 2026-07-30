import { useAuth } from "../hooks/useAuthStore";
import { SectionLabel, EmptyState } from "../components/ui";
import { MatchCard } from "../components/MatchCard";

export function MatchesPage() {
  const { account } = useAuth();
  const matches = account!.matches;

  return (
    <div>
      <SectionLabel>Match History · {matches.length} played</SectionLabel>
      {matches.length === 0 ? (
        <EmptyState title="Nothing here yet" hint="Your logged matches will show up here as cards, most recent first." />
      ) : (
        <div className="flex flex-col gap-3">
          {matches.map((m) => (
            <MatchCard key={m.id} m={m} theme={account!.theme} />
          ))}
        </div>
      )}
    </div>
  );
}
