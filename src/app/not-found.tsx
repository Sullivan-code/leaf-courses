import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative w-full h-full">
      {/* Fundo com imagem e overlay branco */}
      <div
        className="fixed inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/images/raphapsi.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Título */}
        <h1 className="text-6xl font-extrabold text-[#2B2B28] drop-shadow-md mb-6 text-center">
          Não Encontrado
        </h1>

        {/* Subtítulo */}
        <p className="mt-2 text-lg text-gray-700 text-center">
          Não foi possível encontrar o recurso solicitado.
        </p>

        {/* Texto extra */}
        <p className="text-gray-600 mt-2 text-center">
          Esta é a nossa página de erro 404.
        </p>

        {/* Botão estilizado */}
        <Link
          href="/"
          className="mt-8 px-8 py-3 bg-[#2B2B28] hover:bg-[#A9D7D3] text-[#F9F6ED] font-bold rounded-lg transition-all duration-300 transform hover:scale-105 hover:text-[#2B2B28]"
        >
          Voltar para a página inicial
        </Link>

        {/* Caixa de detalhe extra */}
        <div className="mt-12 bg-[#B2E3DC] p-6 rounded-lg shadow-lg border-2 border-[#A9D7D3] max-w-lg text-center">
          <h2 className="text-2xl font-bold text-[#2B2B28] mb-4">
            O que pode ter acontecido?
          </h2>
          <ul className="list-disc list-inside text-left text-gray-700 space-y-2">
            <li>O link que você acessou pode estar incorreto</li>
            <li>A página pode ter sido removida</li>
            <li>Ou talvez nunca tenha existido 🤔</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
