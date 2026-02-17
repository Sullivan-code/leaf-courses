import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/product-list";
import { stripe } from "@/lib/stripe";

export default async function Courses() {
  // 🔥 Busca produtos direto do Stripe (server-side)
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

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

      {/* 🔥 CATÁLOGO DO STRIPE DIRETO AQUI */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center text-[#111827] mb-16">
            Nossos Cursos
          </h1>

          <ProductList products={products.data} />
        </div>
      </section>

      {/* CURSOS ESTÁTICOS (SE QUISER MANTER) */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">

            <div className="bg-white border-2 border-blue-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <Link href="/cursos/lesson1">
                <h2 className="text-2xl font-bold mb-4 text-blue-700 hover:underline cursor-pointer">
                  Inglês Básico (A1-A2)
                </h2>
              </Link>
              <p className="text-lg text-gray-700 mb-4">
                Ideal para iniciantes.
              </p>
            </div>

            <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">
                Inglês Intermediário (B1-B2)
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Para quem quer avançar.
              </p>
            </div>

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
