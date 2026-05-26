import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-white mb-4">Cadastrar-se</h1>
      <p className="text-gray-400 mb-6">Formulário de cadastro em breve</p>
      <Link to="/" className="text-blue-400 hover:underline">
        Voltar
      </Link>
    </div>
  );
}
