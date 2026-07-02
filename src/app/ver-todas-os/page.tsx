import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

export default async function VerTodasLicoes() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { subscriptionStatus: true }
  });

  const isSubscribed = dbUser?.subscriptionStatus === "active";

  if (!isSubscribed) {
    redirect("/meus-cursos");
  }

  // Organizando as lições em módulos
  const modulos = [
    {
      id: 1,
      titulo: "ENGINE ROOM",
      aulas: [
        { id: "offshore", titulo: "Lesson 1 - Offshore", numero: "1", tipo: "aula" },
        { id: "lesson2", titulo: "Lesson 2", numero: "2", tipo: "aula" },
        { id: "lesson3", titulo: "Lesson 3", numero: "3", tipo: "aula" },
        { id: "lesson4", titulo: "Lesson 4", numero: "4", tipo: "aula" },
        { id: "lesson5", titulo: "Lesson 5", numero: "5", tipo: "aula" },
        { id: "lesson6", titulo: "Lesson 6", numero: "6", tipo: "aula" },
        { id: "review1", titulo: "Review 1", numero: "1", tipo: "revisao" }
      ]
    },
    {
      id: 2,
      titulo: "HSE",
      aulas: [
        { id: "lesson7", titulo: "Lesson 7", numero: "7", tipo: "aula" },
        { id: "lesson8", titulo: "Lesson 8", numero: "8", tipo: "aula" },
        { id: "lesson9", titulo: "Lesson 9", numero: "9", tipo: "aula" },
        { id: "lesson10", titulo: "Lesson 10", numero: "10", tipo: "aula" },
        { id: "lesson11", titulo: "Lesson 11", numero: "11", tipo: "aula" },
        { id: "lesson12", titulo: "Lesson 12", numero: "12", tipo: "aula" },
        { id: "review2", titulo: "Review 2", numero: "2", tipo: "revisao" }
      ]
    },
    {
      id: 3,
      titulo: "Módulo 3",
      aulas: [
        { id: "lesson13", titulo: "Lesson 13", numero: "13", tipo: "aula" },
        { id: "lesson14", titulo: "Lesson 14", numero: "14", tipo: "aula" },
        { id: "lesson15", titulo: "Lesson 15", numero: "15", tipo: "aula" },
        { id: "lesson16", titulo: "Lesson 16", numero: "16", tipo: "aula" },
        { id: "lesson17", titulo: "Lesson 17", numero: "17", tipo: "aula" },
        { id: "lesson18", titulo: "Lesson 18", numero: "18", tipo: "aula" },
        { id: "review3", titulo: "Review 3", numero: "3", tipo: "revisao" }
      ]
    },
    {
      id: 4,
      titulo: "Módulo 4",
      aulas: [
        { id: "lesson19", titulo: "Lesson 19", numero: "19", tipo: "aula" },
        { id: "lesson20", titulo: "Lesson 20", numero: "20", tipo: "aula" },
        { id: "lesson21", titulo: "Lesson 21", numero: "21", tipo: "aula" },
        { id: "lesson22", titulo: "Lesson 22", numero: "22", tipo: "aula" },
        { id: "lesson23", titulo: "Lesson 23", numero: "23", tipo: "aula" },
        { id: "lesson24", titulo: "Lesson 24", numero: "24", tipo: "aula" },
        { id: "review4", titulo: "Review 4", numero: "4", tipo: "revisao" }
      ]
    },
    {
      id: 5,
      titulo: "Módulo 5",
      aulas: [
        { id: "lesson25", titulo: "Lesson 25", numero: "25", tipo: "aula" },
        { id: "lesson26", titulo: "Lesson 26", numero: "26", tipo: "aula" },
        { id: "lesson27", titulo: "Lesson 27", numero: "27", tipo: "aula" },
        { id: "lesson28", titulo: "Lesson 28", numero: "28", tipo: "aula" },
        { id: "lesson29", titulo: "Lesson 29", numero: "29", tipo: "aula" },
        { id: "lesson30", titulo: "Lesson 30", numero: "30", tipo: "aula" },
        { id: "review5", titulo: "Review 5", numero: "5", tipo: "revisao" }
      ]
    },
    {
      id: 6,
      titulo: "Módulo 6",
      aulas: [
        { id: "lesson31", titulo: "Lesson 31", numero: "31", tipo: "aula" },
        { id: "lesson32", titulo: "Lesson 32", numero: "32", tipo: "aula" },
        { id: "lesson33", titulo: "Lesson 33", numero: "33", tipo: "aula" },
        { id: "lesson34", titulo: "Lesson 34", numero: "34", tipo: "aula" },
        { id: "lesson35", titulo: "Lesson 35", numero: "35", tipo: "aula" },
        { id: "lesson36", titulo: "Lesson 36", numero: "36", tipo: "aula" },
        { id: "review6", titulo: "Review 6", numero: "6", tipo: "revisao" }
      ]
    },
    {
      id: 7,
      titulo: "Módulo 7",
      aulas: [
        { id: "lesson37", titulo: "Lesson 37", numero: "37", tipo: "aula" },
        { id: "lesson38", titulo: "Lesson 38", numero: "38", tipo: "aula" },
        { id: "lesson39", titulo: "Lesson 39", numero: "39", tipo: "aula" },
        { id: "lesson40", titulo: "Lesson 40", numero: "40", tipo: "aula" },
        { id: "lesson41", titulo: "Lesson 41", numero: "41", tipo: "aula" },
        { id: "lesson42", titulo: "Lesson 42", numero: "42", tipo: "aula" },
        { id: "review7", titulo: "Review 7", numero: "7", tipo: "revisao" }
      ]
    },
    {
      id: 8,
      titulo: "Módulo 8",
      aulas: [
        { id: "lesson43", titulo: "Lesson 43", numero: "43", tipo: "aula" },
        { id: "lesson44", titulo: "Lesson 44", numero: "44", tipo: "aula" },
        { id: "lesson45", titulo: "Lesson 45", numero: "45", tipo: "aula" },
        { id: "lesson46", titulo: "Lesson 46", numero: "46", tipo: "aula" },
        { id: "lesson47", titulo: "Lesson 47", numero: "47", tipo: "aula" },
        { id: "lesson48", titulo: "Lesson 48", numero: "48", tipo: "aula" },
        { id: "review8", titulo: "Review 8", numero: "8", tipo: "revisao" }
      ]
    },
    {
      id: 9,
      titulo: "Módulo 9",
      aulas: [
        { id: "lesson49", titulo: "Lesson 49", numero: "49", tipo: "aula" },
        { id: "lesson50", titulo: "Lesson 50", numero: "50", tipo: "aula" },
        { id: "lesson51", titulo: "Lesson 51", numero: "51", tipo: "aula" },
        { id: "lesson52", titulo: "Lesson 52", numero: "52", tipo: "aula" },
        { id: "lesson53", titulo: "Lesson 53", numero: "53", tipo: "aula" },
        { id: "lesson54", titulo: "Lesson 54", numero: "54", tipo: "aula" },
        { id: "review9", titulo: "Review 9", numero: "9", tipo: "revisao" }
      ]
    },
    {
      id: 10,
      titulo: "Módulo 10",
      aulas: [
        { id: "lesson55", titulo: "Lesson 55", numero: "55", tipo: "aula" },
        { id: "lesson56", titulo: "Lesson 56", numero: "56", tipo: "aula" },
        { id: "lesson57", titulo: "Lesson 57", numero: "57", tipo: "aula" },
        { id: "lesson58", titulo: "Lesson 58", numero: "58", tipo: "aula" },
        { id: "lesson59", titulo: "Lesson 59", numero: "59", tipo: "aula" },
        { id: "lesson60", titulo: "Lesson 60", numero: "60", tipo: "aula" },
        { id: "review10", titulo: "Review 10", numero: "10", tipo: "revisao" }
      ]
    }
  ];

  // Função para obter as cores - tudo laranja
  const getColorClasses = (tipo: string) => {
    if (tipo === 'revisao') {
      return {
        bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
        iconBg: 'bg-orange-200',
        iconColor: 'text-orange-700',
        textHover: 'group-hover:text-orange-600'
      };
    }
    return {
      bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200',
      iconBg: 'bg-orange-200',
      iconColor: 'text-orange-700',
      textHover: 'group-hover:text-orange-600'
    };
  };

  // Cores do cabeçalho baseado no módulo
  const getHeaderColors = (moduloId: number) => {
    if (moduloId === 1) {
      return 'bg-gradient-to-r from-red-600 to-red-400';
    } else if (moduloId === 2) {
      return 'bg-gradient-to-r from-yellow-600 to-yellow-400';
    }
    return 'bg-gradient-to-r from-orange-500 to-orange-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/meus-cursos">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Meus Cursos
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-center text-gray-800 hidden md:block">
            Todas as Lições
          </h1>
          <div className="w-24"></div>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 md:hidden">
          Todas as Lições
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Selecione qualquer aula para continuar seus estudos
        </p>

        {/* Lista de módulos */}
        <div className="space-y-8">
          {modulos.map((modulo) => (
            <div key={modulo.id} className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-orange-200 hover:shadow-3xl transition-all duration-300">
              {/* Cabeçalho do módulo */}
              <div className={`${getHeaderColors(modulo.id)} p-6`}>
                <h2 className="text-2xl font-bold text-white">
                  {modulo.titulo}
                </h2>
                <p className="text-white/80 mt-2">
                  {modulo.aulas.length} aulas disponíveis
                </p>
              </div>

              {/* Grade de aulas */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {modulo.aulas.map((aula) => {
                    const colors = getColorClasses(aula.tipo);
                    const href = `/cursos/offshore/lesson${aula.numero}-offshore`;
                    
                    return (
                      <Link key={aula.id} href={href}>
                        <div className={`
                          group p-4 rounded-xl transition-all duration-300 cursor-pointer
                          ${colors.bg} border-2
                          hover:shadow-lg transform hover:scale-105
                        `}>
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                              {aula.tipo === 'revisao' ? (
                                <RefreshCw className={`w-5 h-5 ${colors.iconColor}`} />
                              ) : (
                                <BookOpen className={`w-5 h-5 ${colors.iconColor}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className={`font-semibold text-gray-800 ${colors.textHover} transition-colors`}>
                                {aula.titulo}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {aula.tipo === 'revisao' ? 'Revisão' : 'Lição'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso geral */}
        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Progresso Geral do Curso
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Conclusão Total</span>
            <span className="text-orange-600 font-semibold">33%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-orange-500 h-4 rounded-full w-1/3"></div>
          </div>
          <p className="text-sm text-gray-500">
            Continue estudando para completar todos os 10 módulos!
          </p>
        </div>
      </div>
    </div>
  );
}