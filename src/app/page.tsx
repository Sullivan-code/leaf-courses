"use client";

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="relative w-full min-h-screen bg-[#ffffff]">
      {/* Header Section */}
      <div className="relative z-10 pt-24 pb-16 px-4 text-center">
        <h1 className="text-5xl font-bold mb-8 text-[#000000]">
          Eric Sullivan - Fundador da LEAF - Inglês para Fluência Real.
        </h1>
        <p className="text-2xl text-[#333] max-w-3xl mx-auto mb-8">
          Bem-vindo ao curso que vai transformar sua relação com o inglês!
          Você está preparado para finalmente mudar a sua vida com o inglês ou
          vai apenas assistir a gente mudando a nossa?
        </p>
        
        {/* Container do Botão/Avatar */}
        <div className="inline-flex items-center justify-center">
          <SignedIn>
            <div className="relative group">
              {/* Container redondo para a imagem do perfil */}
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                {user?.imageUrl ? (
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <Image
                      src={user.imageUrl}
                      alt="Foto do perfil"
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      {user?.firstName?.[0] || user?.username?.[0] || "U"}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Badge de usuário online */}
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              
              {/* Tooltip com nome do usuário */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {user?.firstName || user?.username || "Usuário"}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"></div>
              </div>
            </div>
          </SignedIn>
          
          <SignedOut>
            <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-40 transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow">
              <SignInButton />
            </div>
          </SignedOut>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* About Section with subtle background image */}
        <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
              alt="Students collaborating"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">Quem Sou</h2>
            <p className="text-xl mb-6 text-[#000000]">
              Sou professor de inglês com formação em Letras - Inglês e Engenharia de Software, unindo teoria acadêmica a uma sólida experiência prática em ambientes técnicos e profissionais. Como fundador da LEAF, minha missão é fazer com que cada aluno alcance a fluência real, independentemente do âmbito profissional ou turístico. Estou aqui para guiar você nessa jornada de transformação através do idioma. Ao longo dos anos, lecionei tanto presencialmente quanto online, atendendo profissionais das áreas de T.I., turismo, administração e comércio exterior. Meu maior propósito é transformar a trajetória de cada aluno por meio do inglês, impulsionando suas carreiras, ampliando suas oportunidades e contribuindo diretamente para seu crescimento profissional e sucesso financeiro.
            </p>
          </div>
        </section>

        {/* Why Our Course Section with subtle background image */}
        <section className="relative bg-white rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Digital learning"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">
              Por Que Escolher Nosso Curso?
            </h2>
            <p className="text-xl mb-6 text-[#000000] text-center max-w-3xl mx-auto">
              Aqui, o inglês não é apenas estudado, é vivido. Desde o primeiro mês, nossos alunos ganham confiança para se comunicar no dia a dia e no ambiente profissional, graças a uma metodologia que vai além do tradicional. Usamos metodologias ativas, tecnologia de ponta e aplicativos que acompanham você durante toda a semana, com técnicas de memorização, prática constante e ferramentas digitais que geram resultados reais. Nosso objetivo é que você pense em inglês, se comunique com naturalidade e alcance a fluência. Você não está apenas começando um curso — está dando o primeiro passo para uma transformação na sua vida pessoal e profissional.
            </p>
          </div>
        </section>

        {/* Tools Section with subtle background image */}
        <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Technology in education"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">
              Ferramentas que Potencializam o Aprendizado
            </h2>
            <div className="text-xl text-[#000000] max-w-4xl mx-auto space-y-5">
              <p>📱 Aplicativos de memorização com revisão espaçada (Spaced Repetition)</p>
              <p>🤖 Chatbots com IA para praticar conversação a qualquer hora</p>
              <p>🌍 Plataformas de intercâmbio linguístico para falar com nativos</p>
              <p>🎧 Podcasts e vídeos interativos com transcrição e glossário</p>
              <p>🧠 Jogos e desafios semanais para testar e fixar o conteúdo</p>
            </div>
          </div>
        </section>

        {/* Public & Methodology with subtle background images */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border-2 border-[#bfdbfe] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Diverse professionals"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Meu Público</h2>
              <ul className="list-disc pl-6 text-xl space-y-4">
                <li>Profissionais de T.I</li>
                <li>Engenheiros de Software</li>
                <li>Profissionais de Saúde</li>
                <li>Engenheiros e Técnicos</li>
                <li>Comissários de Bordo</li>
                <li>Profissionais Offshore</li>
                <li>Advogados e Empreendedores</li>
                <li>Estudantes Internacionais</li>
              </ul>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 border-2 border-[#bfdbfe] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Learning methodology"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8">Metodologia LEAF</h2>
              <div className="space-y-5 text-xl">
                <p>✅ Foco em conversação e fluência</p>
                <p>✅ Situações reais do ambiente profissional</p>
                <p>✅ Vocabulário técnico por área de atuação</p>
                <p>✅ Aulas 100% online com flexibilidade</p>
                <p>✅ Ferramentas digitais de memorização</p>
                <p>✅ Contato com falantes nativos</p>
                <p>✅ Material didático personalizado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Planos Section with subtle background images */}
        <section className="relative bg-white rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Study plans"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-[#000000] text-center">Planos de Estudo</h2>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* Plano Turma */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:scale-105 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Group class"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Turma</h3>
                  <div className="text-4xl font-bold mb-6">R$ 200/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>2 horas semanais em grupo</li>
                    <li>Material didático digital</li>
                    <li>simulações de conversas reais para praticar a fluência</li>
                    <li>Aplicativos de memorização</li>
                    <li>Atividades de conversação com estrangeiros</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-xl transition-all duration-300 group-hover:bg-yellow-300 group-hover:text-black mt-auto relative z-10">
                  Inscreva-se
                </button>
              </div>

              {/* Plano Individual */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:scale-105 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Individual class"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Individual</h3>
                  <div className="text-4xl font-bold mb-6">R$ 300/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>Todos benefícios do Plano Turma</li>
                    <li>Aulas 1:1 personalizadas</li>
                    <li>Atividades de conversação com estrangeiros</li>
                    <li>Conteúdos com filmes, séries & Podcasts</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-xl transition-all duration-300 group-hover:bg-green-300 group-hover:text-black mt-auto relative z-10">
                  Inscreva-se
                </button>
              </div>

              {/* Plano Diamante */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white hover:scale-105 transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Premium class"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Diamante</h3>
                  <div className="text-4xl font-bold mb-6">R$ 500/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>4 horas semanais individuais (2 horas cada aula)</li>
                    <li>Materiais premium internacionais</li>
                    <li>Atividades de conversação com estrangeiros</li>
                    <li>Mentoria e suporte prioritário</li>
                    <li>Conteúdo extra para estudar durante a semana</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-blue-600 py-4 rounded-xl font-bold text-xl transition-all duration-300 group-hover:bg-sky-300 group-hover:text-black mt-auto relative z-10">
                  Inscreva-se
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}