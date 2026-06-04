import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function NavbarAuthenticated() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/dashboard" className="text-xl font-bold text-white tracking-tight">
          SkyRunner
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            Dashboard
          </Link>
          <Link
            to="/settings"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            Preferências
          </Link>
          <Link
            to="/reports"
            className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
          >
            Relatórios
          </Link>

          <div className="h-6 w-px bg-gray-700" />

          <span className="text-gray-400 text-sm">{user?.username || user?.email}</span>
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-signal transition-colors text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
}
