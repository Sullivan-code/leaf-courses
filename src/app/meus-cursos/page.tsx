import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function MeusCursos() {
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
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-2xl border-4 border-yellow-400">
          <div className="text-8xl mb-6">📚</div>
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            Você ainda não tem acesso aos cursos
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Adquira nosso curso completo e comece sua jornada no inglês hoje mesmo!
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/nossos-cursos">
                Ver Planos
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/aula-experimental">
                Aula Experimental
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold mb-10 text-center text-gray-800">
          Meus Cursos
        </h1>
        
        <div className="grid gap-8">
          <div className="bg-white shadow-2xl rounded-3xl p-8 border-4 border-blue-300 hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-6xl">🇺🇸</div>
              <div>
                <h2 className="text-3xl font-bold text-blue-700">
                  Inglês Básico ao Intermediário (A1-B1)
                </h2>
                <p className="text-xl text-gray-600 mt-2">
                  Curso completo com 33 lições + revisões
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-2xl mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">Progresso</span>
                <span className="text-lg font-semibold text-blue-600">33%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full w-1/3"></div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button asChild size="lg" className="flex-1 text-lg">
                <Link href="/cursos/lesson1">
                  Continuar de Onde Parei
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link href="/cursos">
                  Ver Todas as Lições
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Informações da assinatura */}
        <div className="mt-12 bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-200">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Informações da Assinatura
          </h3>
          <p className="text-gray-600">
            Status: <span className="text-green-600 font-semibold">Ativa</span>
          </p>
          <p className="text-gray-600 mt-2">
            Próxima cobrança: 15/04/2026
          </p>
        </div>
      </div>
    </div>
  );
}