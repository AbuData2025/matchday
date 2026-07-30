import { NavLink, Outlet, Navigate } from "react-router-dom";
import { Home, ListChecks, PlusCircle, BarChart3, User, LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuthStore";

const TABS = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/matches", label: "Matches", icon: ListChecks },
  { to: "/log", label: "Log Match", icon: PlusCircle },
  { to: "/stats", label: "Stats", icon: BarChart3 },
  { to: "/profile", label: "Profile", icon: User },
];

export function Layout() {
  const { account, signOut } = useAuth();

  if (!account) return <Navigate to="/" replace />;
  const theme = account.theme;

  return (
    <div className="min-h-screen bg-bg text-chalk font-body">
      <div className="flex min-h-screen">
        {/* sidebar (desktop) */}
        <div className="hidden md:flex w-[210px] shrink-0 bg-bg-alt border-r border-border p-3.5 flex-col gap-1">
          <div className="flex items-center gap-2 px-2 pb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: theme.bright, boxShadow: `0 0 8px ${theme.bright}` }}
            />
            <span className="font-display text-[19px] tracking-wide text-chalk font-semibold">MATCHDAY</span>
          </div>
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left ${
                  isActive ? "bg-surface" : "bg-transparent"
                }`
              }
              style={({ isActive }) => ({ color: isActive ? theme.bright : undefined })}
            >
              {({ isActive }) => (
                <>
                  <t.icon size={16} className={isActive ? "" : "text-chalk-dim"} />
                  <span className="font-body text-[13.5px] font-medium">{t.label}</span>
                </>
              )}
            </NavLink>
          ))}
          <div className="flex-1" />
          <div className="px-2 pb-2 font-body text-[11.5px] text-chalk-faint truncate">{account.email}</div>
          <button
            onClick={signOut}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left text-chalk-faint hover:text-chalk-dim"
          >
            <LogOut size={16} />
            <span className="font-body text-[13px] font-medium">Sign Out</span>
          </button>
        </div>

        {/* main */}
        <div className="flex-1 min-w-0 px-5 pt-5 pb-24 max-w-[860px] mx-auto w-full">
          <Outlet />
        </div>
      </div>

      {/* mobile bottom nav */}
      <div className="flex md:hidden fixed bottom-0 left-0 right-0 bg-bg-alt border-t border-border justify-around px-1 py-2 z-10">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            className="flex flex-col items-center gap-0.5 px-2 py-1"
            style={({ isActive }) => ({ color: isActive ? theme.bright : "#726C6A" })}
          >
            <t.icon size={18} />
            <span className="font-mono text-[9px]">{t.label}</span>
          </NavLink>
        ))}
        <button onClick={signOut} className="flex flex-col items-center gap-0.5 px-2 py-1 text-chalk-faint">
          <LogOut size={18} />
          <span className="font-mono text-[9px]">Out</span>
        </button>
      </div>
    </div>
  );
}
