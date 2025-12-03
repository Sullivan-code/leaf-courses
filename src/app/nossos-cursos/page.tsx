"use client";

import Link from "next/link"; // ← Import necessário

export default function Courses() {
  return (
    <div className="min-h-screen bg-[#f9f9f9] py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-[#111827] mb-16">
          Nossos Cursos de Inglês
        </h1>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {/* Básico */}
          <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <Link href="/cursos/lesson1">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 hover:underline cursor-pointer">
                Inglês Básico (A1-A2)
              </h2>
            </Link>
            <p className="text-lg text-gray-700 mb-4">
              Ideal para quem está começando do zero. Você aprenderá a se apresentar, fazer perguntas simples, e entender frases do dia a dia.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Vocabulário essencial e expressões básicas</li>
              <li>Prática de escuta e fala com áudios reais</li>
              <li>Exercícios interativos e revisões semanais</li>
            </ul>
          </div>

          {/* Intermediário */}
          <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">Inglês Intermediário (B1-B2)</h2>
            <p className="text-lg text-gray-700 mb-4">
              Para quem já se comunica e quer avançar. Melhore sua fluência, compreenda textos mais complexos e participe de conversas naturais.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Conversação com foco em situações reais</li>
              <li>Leitura e interpretação de textos</li>
              <li>Correção de pronúncia e entonação</li>
            </ul>
          </div>

          {/* Avançado */}
          <div className="bg-white border-2 border-green-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Inglês Avançado (C1-C2)</h2>
            <p className="text-lg text-gray-700 mb-4">
              Para quem busca dominar o idioma. Enfrente discussões complexas, refine sua escrita formal e fale com naturalidade em qualquer ambiente.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Debates e apresentações profissionais</li>
              <li>Redação de e-mails e textos avançados</li>
              <li>Simulações de entrevistas e reuniões</li>
            </ul>
          </div>
        </div>

        {/* Curso Especial - Inglês para Programadores */}
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl p-10 shadow-2xl border border-gray-700">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400 text-center">Curso Especial: Inglês para Programadores</h2>
          <p className="text-xl mb-6 text-center text-gray-300 max-w-3xl mx-auto">
            Pensado para desenvolvedores e profissionais de tecnologia. Aprenda o inglês do mundo tech: desde termos técnicos até entrevistas com empresas internacionais.
          </p>
          <div className="grid md:grid-cols-2 gap-8 text-lg text-gray-200">
            <ul className="list-disc pl-6 space-y-3">
              <li>Vocabulário de desenvolvimento web e software</li>
              <li>Prática de leitura com documentações reais (React, Node.js etc.)</li>
              <li>Expressões comuns em reuniões e equipes ágeis</li>
            </ul>
            <ul className="list-disc pl-6 space-y-3">
              <li>Correção de pitch de projetos em inglês</li>
              <li>Preparação para entrevistas técnicas em inglês</li>
              <li>Aulas com materiais autênticos de tecnologia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
