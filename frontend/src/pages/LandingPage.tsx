import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import SportAnimator from "../components/SportAnimator";

function StatusBadge({ color, label }: { color: string; label: string }) {
  return (
    <span className={`px-4 py-1.5 rounded-full font-bold text-sm ${color}`}>
      {label}
    </span>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />

      <SportAnimator />

      <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="inline-flex items-center gap-2 bg-green-signal/10 border border-green-signal/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-signal animate-pulse" />
            <span className="text-green-signal text-xs font-semibold tracking-wide uppercase">
              Dados em tempo real
            </span>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            SkyRunner
            <span className="text-green-signal"> Analytics</span>
          </h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Sua plataforma inteligente de suporte à decisão para atividades ao
            ar livre. Correlacione condições climáticas em tempo real com seus
            limites de conforto e segurança.
          </p>

          <div className="flex justify-center gap-3 mb-12">
            <StatusBadge
              color="bg-green-signal text-white"
              label="Recomendado"
            />
            <StatusBadge
              color="bg-yellow-signal text-black"
              label="Atenção"
            />
            <StatusBadge
              color="bg-red-signal text-white"
              label="Não Recomendado"
            />
          </div>

          <Link
            to="/signup"
            className="inline-block bg-green-signal text-dark-bg font-bold text-lg px-10 py-4 rounded-xl hover:bg-green-500 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
          >
            Começar Agora
          </Link>
        </div>
      </main>
    </div>
  );
}
