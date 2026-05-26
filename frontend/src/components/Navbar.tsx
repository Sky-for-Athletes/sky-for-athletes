import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          SkyRunner
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-gray-300 hover:text-white transition-colors px-4 py-2 text-sm font-medium"
          >
            Entrar
          </Link>
          <Link
            to="/signup"
            className="bg-green-signal text-dark-bg font-semibold px-4 py-2 rounded-lg text-sm hover:bg-green-500 transition-colors"
          >
            Cadastrar-se
          </Link>
        </div>
      </div>
    </nav>
  );
}
