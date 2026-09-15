// app/cursos/intermediate/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { ArrowLeft, BookOpen, RefreshCw } from "lucide-react";

type Aula = {
  id: string;
  titulo: string;
  numero: string;
  tipo: "aula" | "revisao";
};

type Modulo = {
  id: number;
  titulo: string;
  aulas: Aula[];
};

export default async function VerTodasLicoesIntermediate() {
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

  // Intermediate: 60 lições (61 a 120) + 10 reviews (11 a 20)
  // Reviews a cada 6 lições.
  const modulos: Modulo[] = Array.from({ length: 10 }, (_, i) => {
    const moduloNumero = i + 11; // 11 a 20
    const reviewNumero = i + 11; // 11 a 20
    const primeiraLicao = 61 + i * 6; // 61, 67, 73, ...

    const aulas: Aula[] = Array.from({ length: 6 }, (_, j) => {
      const numeroLicao = primeiraLicao + j;
      return {
        id: `lesson${numeroLicao}`,
        titulo: `Lesson ${numeroLicao}`,
        numero: String(numeroLicao),
        tipo: "aula",
      };
    });

    aulas.push({
      id: `review${reviewNumero}`,
      titulo: `Review ${reviewNumero}`,
      numero: String(reviewNumero),
      tipo: "revisao",
    });

    return {
      id: moduloNumero,
      titulo: `Módulo ${moduloNumero} - Intermediate (Lessons ${primeiraLicao}-${primeiraLicao + 5})`,
      aulas,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header com botão voltar */}
        <div className="mb-8 flex items-center justify-between">
          <Button
            asChild
            variant="outline"
            className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
          >
            <Link href="/meus-cursos">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Meus Cursos
            </Link>
          </Button>
          <h1 className="text-4xl font-bold text-center text-gray-800 hidden md:block">
            Todas as Lições - Intermediate
          </h1>
          <div className="w-24"></div>
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4 md:hidden">
          Todas as Lições - Intermediate
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Selecione qualquer aula para continuar seus estudos
        </p>

        {/* Lista de módulos */}
        <div className="space-y-8">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200 hover:shadow-3xl transition-all duration-300"
            >
              {/* Cabeçalho do módulo */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6">
                <h2 className="text-2xl font-bold text-white">
                  {modulo.titulo}
                </h2>
                <p className="text-green-100 mt-2">
                  {modulo.aulas.length} aulas disponíveis
                </p>
              </div>

              {/* Grade de aulas */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {modulo.aulas.map((aula) => (
                    <Link
                      key={aula.id}
                      href={`/cursos/intermediate/${aula.id}`}
                    >
                      <div
                        className={`
                          group p-4 rounded-xl transition-all duration-300 cursor-pointer
                          ${
                            aula.tipo === "revisao"
                              ? "bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200"
                              : "bg-green-50 hover:bg-green-100 border-2 border-green-200"
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
                                  ? "bg-emerald-200"
                                  : "bg-green-200"
                              }
                            `}
                          >
                            {aula.tipo === "revisao" ? (
                              <RefreshCw className="w-5 h-5 text-emerald-700" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-green-700" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                              {aula.titulo}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {aula.tipo === "revisao" ? "Revisão" : "Lição"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progresso geral */}
        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Progresso Geral do Curso
          </h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Conclusão Total</span>
            <span className="text-green-600 font-semibold">33%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div className="bg-green-500 h-4 rounded-full w-1/3"></div>
          </div>
          <p className="text-sm text-gray-500">
            Continue estudando para completar todos os 10 módulos!
          </p>
        </div>
      </div>
    </div>
  );
}