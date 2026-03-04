import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const STRIPE_BUY_LINK = "https://buy.stripe.com/8x2eVeadW6Qq86RcCBcQU01";

// 🔥 Mesma imagem para A1-A2 e A1-B1
const COURSE_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

export default async function Courses() {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  // 🔐 Verificação de assinatura
  const user = await currentUser();
  let authorized = false;

  if (user) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: { subscriptionStatus: true },
    });

    if (dbUser?.subscriptionStatus === "active") {
      authorized = true;
    }
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">

      {/* HERO SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-4xl font-bold text-[#111827] mb-6">
              Bem-vindo aos cursos da LEAF.
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Descubra os melhores cursos nos melhores preços!
            </p>

            <Button asChild>
              <Link href="/products">Pesquise Todos os Cursos</Link>
            </Button>
          </div>

          {products.data.length > 0 &&
            products.data[0]?.images?.[0] && (
              <Image
                alt="Banner Image"
                width={450}
                height={450}
                className="rounded-2xl shadow-xl"
                src={products.data[0].images[0]}
              />
            )}
        </div>
      </section>

      {/* CATÁLOGO */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 rounded-2xl shadow-xl p-12 mb-16 border-2 border-[#bfdbfe] overflow-hidden">

            <div className="absolute inset-0 opacity-10">
              <Image
                src={COURSE_IMAGE}
                alt="Students collaborating"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10">
              <h1 className="text-5xl font-bold text-center text-[#000000] mb-16">
                Nossos Cursos
              </h1>

              <ProductList products={products.data} />
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS ESTÁTICOS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

            {/* ========================= */}
            {/* CURSO A1-A2 */}
            {/* ========================= */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              
              <Image
                src={COURSE_IMAGE}
                alt="Curso Inglês Básico"
                width={400}
                height={250}
                className="rounded-xl mb-6 object-cover"
              />

              <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Inglês Básico (A1-A2)
              </h2>

              <p className="text-lg text-gray-700 mb-4">
                Ideal para iniciantes.
              </p>

              {!authorized ? (
                <>
                  <p className="text-red-500 mb-4 font-medium">
                    Compre o curso agora e torne-se aluno da LEAF.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button asChild>
                      <a
                        href={STRIPE_BUY_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Comprar Curso
                      </a>
                    </Button>

                    <Button variant="outline" asChild>
                      <Link href="/aula-experimental">
                        Aula Experimental
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Button asChild>
                  <Link href="/cursos/lesson1">
                    Entrar na Lição 1
                  </Link>
                </Button>
              )}
            </div>

            {/* ========================= */}
            {/* CURSO A1-B1 */}
            {/* ========================= */}
            <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              
              <Image
                src={COURSE_IMAGE}
                alt="Curso Inglês Básico ao Intermediário"
                width={400}
                height={250}
                className="rounded-xl mb-6 object-cover"
              />

              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Inglês Básico ao Intermediário (A1-B1)
              </h2>

              <p className="text-lg text-gray-700 mb-4">
                Curso completo do básico ao intermediário.
              </p>

              {!authorized ? (
                <>
                  <p className="text-red-500 mb-4 font-medium">
                    Garanta seu acesso agora mesmo.
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button asChild>
                      <a
                        href={STRIPE_BUY_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Comprar Curso
                      </a>
                    </Button>

                    <Button variant="outline" asChild>
                      <Link href="/aula-experimental">
                        Aula Experimental
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <Button asChild>
                  <Link href="/cursos/lesson1">
                    Entrar na Lição 1
                  </Link>
                </Button>
              )}
            </div>

            {/* AVANÇADO */}
            <div className="bg-white border-2 border-green-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-green-700">
                Inglês Avançado (C1-C2)
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Domine o idioma.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}