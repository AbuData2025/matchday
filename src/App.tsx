import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuthStore";
import { AuthPage } from "./pages/AuthPage";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { MatchesPage } from "./pages/MatchesPage";
import { LogMatchPage } from "./pages/LogMatchPage";
import { StatsPage } from "./pages/StatsPage";
import { ProfilePage } from "./pages/ProfilePage";

function LoadingScreen() {
  return (
    <div className="bg-bg min-h-screen flex items-center justify-center">
      <span className="font-mono text-xs text-chalk-faint tracking-wide">LOADING…</span>
    </div>
  );
}

function RootRedirect() {
  const { account } = useAuth();
  return <Navigate to={account ? "/dashboard" : "/login"} replace />;
}

function ProtectedRoutes() {
  const { account, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!account) return <Navigate to="/login" replace />;
  return <Layout />;
}

function PublicOnlyAuthPage() {
  const { loading } = useAuth();
  if (loading) return <LoadingScreen />;
  return <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<PublicOnlyAuthPage />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/log" element={<LogMatchPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
