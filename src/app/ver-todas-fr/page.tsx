import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

// Definição dos tipos para melhor organização
type TipoAula = "aula" | "revisao";

interface Aula {
  id: string;
  titulo: string;
  numero: string;
  tipo: TipoAula;
}

interface Modulo {
  id: number;
  titulo: string;
  aulas: Aula[];
}

export default async function VerTodasLicoes() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    select: { subscriptionStatus: true },
  });

  const isSubscribed = dbUser?.subscriptionStatus === "active";

  if (!isSubscribed) {
    redirect("/meus-cursos");
  }

  // Organizando as lições em módulos com títulos em francês
  const modulos: Modulo[] = [
    {
      id: 1,
      titulo: "Module 1 - Nourriture et Boisson",
      aulas: [
        { id: "lesson1", titulo: "Leçon 1", numero: "1", tipo: "aula" },
        { id: "lesson2", titulo: "Leçon 2", numero: "2", tipo: "aula" },
        { id: "lesson3", titulo: "Leçon 3", numero: "3", tipo: "aula" },
        { id: "lesson4", titulo: "Leçon 4", numero: "4", tipo: "aula" },
        { id: "lesson5", titulo: "Leçon 5", numero: "5", tipo: "aula" },
        { id: "lesson6", titulo: "Leçon 6", numero: "6", tipo: "aula" },
        { id: "review1", titulo: "Révision 1", numero: "1", tipo: "revisao" },
      ],
    },
    {
      id: 2,
      titulo: "Module 2 - Langues et Pays",
      aulas: [
        { id: "lesson7", titulo: "Leçon 7", numero: "7", tipo: "aula" },
        { id: "lesson8", titulo: "Leçon 8", numero: "8", tipo: "aula" },
        { id: "lesson9", titulo: "Leçon 9", numero: "9", tipo: "aula" },
        { id: "lesson10", titulo: "Leçon 10", numero: "10", tipo: "aula" },
        { id: "lesson11", titulo: "Leçon 11", numero: "11", tipo: "aula" },
        { id: "lesson12", titulo: "Leçon 12", numero: "12", tipo: "aula" },
        { id: "review2", titulo: "Révision 2", numero: "2", tipo: "revisao" },
      ],
    },
    {
      id: 3,
      titulo: "Module 3 - Informations Personnelles et Routine",
      aulas: [
        { id: "lesson13", titulo: "Leçon 13", numero: "13", tipo: "aula" },
        { id: "lesson14", titulo: "Leçon 14", numero: "14", tipo: "aula" },
        { id: "lesson15", titulo: "Leçon 15", numero: "15", tipo: "aula" },
        { id: "lesson16", titulo: "Leçon 16", numero: "16", tipo: "aula" },
        { id: "lesson17", titulo: "Leçon 17", numero: "17", tipo: "aula" },
        { id: "lesson18", titulo: "Leçon 18", numero: "18", tipo: "aula" },
        { id: "review3", titulo: "Révision 3", numero: "3", tipo: "revisao" },
      ],
    },
    {
      id: 4,
      titulo: "Module 4 - Mode de Vie et Planification Hebdomadaire",
      aulas: [
        { id: "lesson19", titulo: "Leçon 19", numero: "19", tipo: "aula" },
        { id: "lesson20", titulo: "Leçon 20", numero: "20", tipo: "aula" },
        { id: "lesson21", titulo: "Leçon 21", numero: "21", tipo: "aula" },
        { id: "lesson22", titulo: "Leçon 22", numero: "22", tipo: "aula" },
        { id: "lesson23", titulo: "Leçon 23", numero: "23", tipo: "aula" },
        { id: "lesson24", titulo: "Leçon 24", numero: "24", tipo: "aula" },
        { id: "review4", titulo: "Révision 4", numero: "4", tipo: "revisao" },
      ],
    },
    {
      id: 5,
      titulo: "Module 5 - Se Déplacer",
      aulas: [
        { id: "lesson25", titulo: "Leçon 25", numero: "25", tipo: "aula" },
        { id: "lesson26", titulo: "Leçon 26", numero: "26", tipo: "aula" },
        { id: "lesson27", titulo: "Leçon 27", numero: "27", tipo: "aula" },
        { id: "lesson28", titulo: "Leçon 28", numero: "28", tipo: "aula" },
        { id: "lesson29", titulo: "Leçon 29", numero: "29", tipo: "aula" },
        { id: "lesson30", titulo: "Leçon 30", numero: "30", tipo: "aula" },
        { id: "review5", titulo: "Révision 5", numero: "5", tipo: "revisao" },
      ],
    },
    {
      id: 6,
      titulo: "Module 6 - Études, Idées et Opinions",
      aulas: [
        { id: "lesson31", titulo: "Leçon 31", numero: "31", tipo: "aula" },
        { id: "lesson32", titulo: "Leçon 32", numero: "32", tipo: "aula" },
        { id: "lesson33", titulo: "Leçon 33", numero: "33", tipo: "aula" },
        { id: "lesson34", titulo: "Leçon 34", numero: "34", tipo: "aula" },
        { id: "lesson35", titulo: "Leçon 35", numero: "35", tipo: "aula" },
        { id: "lesson36", titulo: "Leçon 36", numero: "36", tipo: "aula" },
        { id: "review6", titulo: "Révision 6", numero: "6", tipo: "revisao" },
      ],
    },
    {
      id: 7,
      titulo: "Module 7 - Santé, Sentiments et Professions",
      aulas: [
        { id: "lesson37", titulo: "Leçon 37", numero: "37", tipo: "aula" },
        { id: "lesson38", titulo: "Leçon 38", numero: "38", tipo: "aula" },
        { id: "lesson39", titulo: "Leçon 39", numero: "39", tipo: "aula" },
        { id: "lesson40", titulo: "Leçon 40", numero: "40", tipo: "aula" },
        { id: "lesson41", titulo: "Leçon 41", numero: "41", tipo: "aula" },
        { id: "lesson42", titulo: "Leçon 42", numero: "42", tipo: "aula" },
        { id: "review7", titulo: "Révision 7", numero: "7", tipo: "revisao" },
      ],
    },
    {
      id: 8,
      titulo: "Module 8 - Restaurant et Cuisine",
      aulas: [
        { id: "lesson43", titulo: "Leçon 43", numero: "43", tipo: "aula" },
        { id: "lesson44", titulo: "Leçon 44", numero: "44", tipo: "aula" },
        { id: "lesson45", titulo: "Leçon 45", numero: "45", tipo: "aula" },
        { id: "lesson46", titulo: "Leçon 46", numero: "46", tipo: "aula" },
        { id: "lesson47", titulo: "Leçon 47", numero: "47", tipo: "aula" },
        { id: "lesson48", titulo: "Leçon 48", numero: "48", tipo: "aula" },
        { id: "review8", titulo: "Révision 8", numero: "8", tipo: "revisao" },
      ],
    },
    {
      id: 9,
      titulo: "Module 9 - Faire du Shopping",
      aulas: [
        { id: "lesson49", titulo: "Leçon 49", numero: "49", tipo: "aula" },
        { id: "lesson50", titulo: "Leçon 50", numero: "50", tipo: "aula" },
        { id: "lesson51", titulo: "Leçon 51", numero: "51", tipo: "aula" },
        { id: "lesson52", titulo: "Leçon 52", numero: "52", tipo: "aula" },
        { id: "lesson53", titulo: "Leçon 53", numero: "53", tipo: "aula" },
        { id: "lesson54", titulo: "Leçon 54", numero: "54", tipo: "aula" },
        { id: "review9", titulo: "Révision 9", numero: "9", tipo: "revisao" },
      ],
    },
    {
      id: 10,
      titulo: "Module 10 - Loisirs et Voyages",
      aulas: [
        { id: "lesson55", titulo: "Leçon 55", numero: "55", tipo: "aula" },
        { id: "lesson56", titulo: "Leçon 56", numero: "56", tipo: "aula" },
        { id: "lesson57", titulo: "Leçon 57", numero: "57", tipo: "aula" },
        { id: "lesson58", titulo: "Leçon 58", numero: "58", tipo: "aula" },
        { id: "lesson59", titulo: "Leçon 59", numero: "59", tipo: "aula" },
        { id: "lesson60", titulo: "Leçon 60", numero: "60", tipo: "aula" },
        { id: "review10", titulo: "Révision 10", numero: "10", tipo: "revisao" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="outline" className="gap-2">
            <Link href="/meus-cursos">
              <ArrowLeft className="w-4 h-4" />
              Retourner à Mes Cours
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-center text-green-700 hidden md:block">
            Toutes les Leçons
          </h1>
          <div className="w-24"></div>
        </div>

        <h1 className="text-4xl font-bold text-center text-green-700 mb-4 md:hidden">
          Toutes les Leçons
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Sélectionnez une leçon pour continuer vos études
        </p>

        {/* Lista de módulos */}
        <div className="space-y-8">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200 hover:shadow-3xl transition-all duration-300"
            >
              {/* Cabeçalho do módulo com cor verde */}
              <div className="bg-gradient-to-r from-green-600 to-green-400 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {modulo.titulo}
                </h2>
                <p className="text-green-100 mt-2">
                  {modulo.aulas.length} leçons disponibles
                </p>
              </div>

              {/* Grade de aulas */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {modulo.aulas.map((aula) => {
                    // Define o caminho correto: /cursos/frances/lessonX ou /cursos/frances/reviewX
                    const path =
                      aula.tipo === "revisao"
                        ? `/cursos/frances/review${aula.numero}`
                        : `/cursos/frances/lesson${aula.numero}`;

                    return (
                      <Link key={aula.id} href={path}>
                        <div
                          className={`
                            group p-4 rounded-xl transition-all duration-300 cursor-pointer
                            ${
                              aula.tipo === "revisao"
                                ? "bg-purple-50 hover:bg-purple-100 border-2 border-purple-200"
                                : "bg-blue-50 hover:bg-blue-100 border-2 border-blue-200"
                            }
                            hover:shadow-lg transform hover:scale-105
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`
                                p-2 rounded-lg
                                ${
                                  aula.tipo === "revisao"
                                    ? "bg-purple-200"
                                    : "bg-blue-200"
                                }
                              `}
                            >
                              {aula.tipo === "revisao" ? (
                                <RefreshCw className="w-5 h-5 text-purple-700" />
                              ) : (
                                <BookOpen className="w-5 h-5 text-blue-700" />
                              )}
                            </div>
                            <div className="flex-1">
                              {/* Título da aula em francês e com cor verde */}
                              <h3 className="font-semibold text-green-600 group-hover:text-green-800 transition-colors">
                                {aula.titulo}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {aula.tipo === "revisao" ? "Révision" : "Leçon"}
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
        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Progrès Général du Cours
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Progression Totale</span>
            <span className="text-green-600 font-semibold">33%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-green-500 h-4 rounded-full w-1/3"></div>
          </div>
          <p className="text-sm text-gray-500">
            Continuez vos études pour terminer les 10 modules !
          </p>
        </div>
      </div>
    </div>
  );
}