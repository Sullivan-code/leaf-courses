import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function MeusCursos() {
  const user = await currentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Você precisa estar logado.</p>
      </div>
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (dbUser?.subscriptionStatus !== "active") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold mb-4">
          Você ainda não comprou nenhum curso.
        </h1>

        <Button asChild>
          <Link href="/nossos-cursos">
            Comprar Curso
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-10 text-center">
          Meus Cursos
        </h1>

        <div className="bg-white shadow-xl rounded-2xl p-8 border-2 border-blue-200">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            Inglês Básico ao Intermediário (A1-B1)
          </h2>

          <p className="text-gray-600 mb-6">
            Continue de onde parou.
          </p>

          <Button asChild>
            <Link href="/cursos/lesson1">
              Acessar Curso
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}