"use client";

import { useCartStore } from "@/../../store/cart-store";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const { clearCart } = useCartStore();
  
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
      <h1 className="text-4xl font-bold mb-6 text-green-600">
        Pagamento Realizado com Sucesso! 🎉
      </h1>
      
      <p className="text-lg text-gray-700 mb-6">
        Agradecemos pela sua compra. Sua vaga já está sendo processada!
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8 text-left">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Próximos passos para acessar o curso:
        </h2>
        <ol className="list-decimal list-inside space-y-3 text-gray-700">
          <li>
            <strong>Entre com a sua conta do Google:</strong> Para ser mais rápido e agilizar o seu acesso, faça login utilizando a sua conta do Google no botão "Entrar" no topo da página.
          </li>
          <li>
            <strong>Aguarde a confirmação de matrícula:</strong> Nossa equipe irá validar o seu pagamento e liberar o acesso à plataforma. Isso pode levar alguns minutos. Você receberá uma notificação assim que estiver tudo pronto.
          </li>
        </ol>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
        <p className="text-gray-700 mb-4 font-medium">
          Ficou com alguma dúvida ou precisa de ajuda?
        </p>
        <a 
          href="https://wa.me/5521987297947" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors shadow-md"
        >
          Falar no WhatsApp
        </a>
      </div>

      <Link href="/products" className="text-blue-600 hover:underline font-medium">
        Continuar navegando pelos cursos
      </Link>
    </div>
  );
}