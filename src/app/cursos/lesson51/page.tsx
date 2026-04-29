"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = "verbs" | "vocabulary" | "usefulPhrases" | "grammar" | "realLife";

export default function Lesson51GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // gradient button class
  const gradientBtn =
    "inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-base transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow font-semibold shadow-md";

  return (
    <div
      className="min-h-screen py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `radial-gradient(circle at 30% 20%, rgba(0, 40, 60, 0.7), rgba(0, 10, 25, 0.9)), url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTIwIDEyMCI+PGNpcmNsZSBjeD0iNjAiIGN5PSI2MCIgcj0iMTAiIGZpbGw9IiNmZmQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4xNSIvPjxwYXRoIGQ9Ik02MCAzMEw1NSA0NWgxMHoiIGZpbGw9IiNmZmQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PGxpbmUgeDE9IjYwIiB5MT0iMzAiIHgyPSI2MCIgeTI9IjUwIiBzdHJva2U9IiNmZmQ3MDAiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2Utb3BhY2l0eT0iMC4yIi8+PC9zdmc+')`,
        backgroundSize: "cover, 80px",
        backgroundRepeat: "no-repeat, repeat",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-4">
            🛍️ LESSON 51 — GOING SHOPPING
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto backdrop-blur-sm bg-black/20 rounded-2xl p-3">
            Present Continuous · Present Perfect · Past Perfect · Slang: wanna/gotta/could
          </p>
        </div>

        {/* ========== VERBS (blue container) ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">🔵 VERBS</h2>
              <p className="text-blue-100 text-sm mt-1">to sell · to pay — conjugação e prática</p>
            </div>
            <button onClick={() => toggleDrill("verbs")} className={gradientBtn}>
              {openDrills.verbs ? "Ocultar Exercício" : "Mostrar Exercício"}
            </button>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <p className="text-2xl font-bold text-blue-700">to sell</p>
                <p className="text-gray-600">vender</p>
                <ul className="mt-3 space-y-1 text-gray-700">
                  <li>✨ I sell clothes online.</li>
                  <li>✨ They sell electronics here.</li>
                  <li>✨ He sells shoes at the mall.</li>
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <p className="text-2xl font-bold text-blue-700">to pay</p>
                <p className="text-gray-600">pagar</p>
                <ul className="mt-3 space-y-1 text-gray-700">
                  <li>✨ She pays in cash.</li>
                  <li>✨ We pay with a credit card.</li>
                  <li>✨ Do you pay by card?</li>
                </ul>
              </div>
            </div>
            {openDrills.verbs && (
              <div className="mt-8 bg-blue-100 rounded-2xl p-6 space-y-3 animate-fadeIn">
                <div className="bg-white p-4 rounded-xl">I sell / You sell / He sells → Eu vendo / Você vende / Ele vende</div>
                <div className="bg-white p-4 rounded-xl">They pay with card → Eles pagam com cartão</div>
                <div className="bg-white p-4 rounded-xl">She doesn't sell used items → Ela não vende itens usados</div>
              </div>
            )}
          </div>
        </div>

        {/* ========== NEW WORDS (blue container) — only text + translation, no images ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">🟣 NEW WORDS</h2>
              <p className="text-blue-100 text-sm">clique no texto para ouvir · vocabulário de compras</p>
            </div>
            <button onClick={() => toggleDrill("vocabulary")} className={gradientBtn}>
              {openDrills.vocabulary ? "Ocultar Exercício" : "Mostrar Exercício"}
            </button>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["customer", "cliente"],
                ["attendant", "atendente"],
                ["wallet", "carteira"],
                ["purse", "bolsa"],
                ["bag", "bolsa/saco"],
                ["cash", "dinheiro"],
                ["credit card", "cartão de crédito"],
                ["receipt", "recibo"],
                ["change", "troco"],
                ["ATM", "caixa eletrônico"],
                ["discount", "desconto"],
                ["product", "produto"],
                ["item", "item"],
                ["fitting room", "provador"],
                ["department store", "loja de departamento"],
                ["outlet mall", "outlet"],
                ["garage sale", "venda de garagem"],
              ].map(([eng, pt]) => (
                <div
                  key={eng}
                  onClick={() => playAudio(eng)}
                  className="bg-white rounded-xl p-3 cursor-pointer hover:bg-blue-100 transition border border-blue-200 shadow-sm"
                >
                  <div className="font-bold text-blue-800 text-lg">{eng}</div>
                  <div className="text-gray-600 text-sm">{pt}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-100 rounded-2xl p-5">
              <p className="font-semibold">📌 Exemplos:</p>
              <p>I have money in my wallet. / Do you have cash? / I need a receipt.</p>
              <p>Where is the fitting room? / This store gives discounts.</p>
            </div>
            {openDrills.vocabulary && (
              <div className="mt-6 bg-blue-100 rounded-2xl p-6 space-y-3">
                <div className="bg-white p-3 rounded-lg">The customer is waiting → O cliente está esperando</div>
                <div className="bg-white p-3 rounded-lg">The attendant is helping me → O atendente está me ajudando</div>
                <div className="bg-white p-3 rounded-lg">I need change for twenty → Preciso de troco para vinte</div>
              </div>
            )}
          </div>
        </div>

        {/* ========== USEFUL PHRASES ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">🟢 USEFUL PHRASES</h2>
              <p className="text-blue-100">frases comuns para compras</p>
            </div>
            <button onClick={() => toggleDrill("usefulPhrases")} className={gradientBtn}>
              {openDrills.usefulPhrases ? "Ocultar Exercício" : "Mostrar Exercício"}
            </button>
          </div>
          <div className="p-8">
            <div className="space-y-3 text-gray-800 text-lg">
              <p>🛒 Do you want to go shopping with me? <span className="text-gray-500">(Você quer ir às compras comigo?)</span></p>
              <p>🧥 I’m looking for a brown jacket. <span className="text-gray-500">(Estou procurando jaqueta marrom)</span></p>
              <p>🏷️ I always get a discount at that store.</p>
              <p>👟 Are the shoes on sale, too? <span className="text-gray-500">(Os sapatos também estão em promoção?)</span></p>
              <p>Let’s go shopping tomorrow. / He is looking for a gift.</p>
            </div>
            {openDrills.usefulPhrases && (
              <div className="mt-6 bg-blue-100 rounded-2xl p-6 space-y-3">
                <div className="bg-white p-3 rounded-lg">I’m looking for my wallet → Estou procurando minha carteira</div>
                <div className="bg-white p-3 rounded-lg">They aren’t talking to the customer → Eles não estão falando com o cliente</div>
                <div className="bg-white p-3 rounded-lg">She isn’t wearing her favorite shoes → Ela não está usando os sapatos favoritos</div>
              </div>
            )}
          </div>
        </div>

        {/* ========== GRAMMAR — Present Continuous + Present Perfect + Past Perfect ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">🟡 GRAMMAR</h2>
              <p className="text-blue-100">Present Continuous (negativo) · Present Perfect · Past Perfect</p>
            </div>
            <button onClick={() => toggleDrill("grammar")} className={gradientBtn}>
              {openDrills.grammar ? "Ocultar Exercício" : "Mostrar Exercício"}
            </button>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-md border-l-8 border-blue-500">
                <h3 className="text-xl font-bold text-blue-700">📘 Present Continuous (Negative)</h3>
                <p>I’m not doing my homework now.</p>
                <p>You aren’t studying alone.</p>
                <p>She isn’t calling the attendant.</p>
                <p>He isn’t paying with his credit card.</p>
                <p className="mt-2 text-gray-500">(ações que NÃO estão acontecendo agora)</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border-l-8 border-green-500">
                <h3 className="text-xl font-bold text-green-700">✨ PRESENT PERFECT</h3>
                <p>✔️ I have already bought a new wallet.</p>
                <p>✔️ She has worn that dress before.</p>
                <p>✔️ We have never tried this outlet mall.</p>
                <p className="text-sm text-gray-500">have/has + past participle (experiências / ações recentes)</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border-l-8 border-purple-500">
                <h3 className="text-xl font-bold text-purple-700">⏳ PAST PERFECT</h3>
                <p>✔️ I had already changed my clothes when he arrived.</p>
                <p>✔️ She had bought the shoes before the sale ended.</p>
                <p>✔️ They had never seen that style before.</p>
                <p className="text-sm text-gray-500">had + past participle (ação anterior a outra no passado)</p>
              </div>
            </div>
            {openDrills.grammar && (
              <div className="mt-8 bg-blue-100 rounded-2xl p-6 space-y-2">
                <div className="bg-white p-3 rounded-lg">I ________ (already/finish) my shopping when you called. → <strong>had already finished</strong></div>
                <div className="bg-white p-3 rounded-lg">She ________ (not/try) this credit card yet. → <strong>hasn't tried</strong></div>
                <div className="bg-white p-3 rounded-lg">We ________ (sell) our old furniture online. → <strong>have sold</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* ========== REAL LIFE section ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8 flex justify-between items-center flex-wrap gap-3">
            <div>
              <h2 className="text-3xl font-bold">🟠 REAL LIFE</h2>
              <p className="text-blue-100">situações do cotidiano em lojas</p>
            </div>
            <button onClick={() => toggleDrill("realLife")} className={gradientBtn}>
              {openDrills.realLife ? "Ocultar Prática" : "Mostrar Prática"}
            </button>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p>🧾 Do you need a receipt? <em>(Você precisa de recibo?)</em></p>
                <p>👗 I’m still looking for a blue dress.</p>
                <p>🏠 My neighbors are having a garage sale today.</p>
                <p>💰 I get a discount when I buy three items.</p>
                <p>👩‍💼 My mother works at a department store.</p>
              </div>
              <div className="space-y-3">
                <p>🛍️ I’m selling my stuff to my neighbors.</p>
                <p>👔 He’s not trying on the black suit.</p>
                <p>💳 They aren’t watching that movie you like.</p>
                <p>🍽️ We’re not having lunch now.</p>
              </div>
            </div>
            {openDrills.realLife && (
              <div className="mt-6 bg-blue-100 rounded-2xl p-6">
                <p>💬 Here’s your change. → Aqui está seu troco.</p>
                <p>💬 Do you have change for a 20? → Você tem troco para 20?</p>
                <p>💬 The attendant is helping me. → O atendente está me ajudando.</p>
              </div>
            )}
          </div>
        </div>

        {/* ========== CHECKOUT: wanna / gotta / could ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-5 px-8">
            <h2 className="text-3xl font-bold">🧾 CHECKOUT · Slang & Reduções</h2>
            <p className="text-indigo-100">wanna · gotta · could — fale como um nativo!</p>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <p className="text-2xl font-bold text-indigo-600">wanna</p>
                <p className="text-gray-500">= want to (querer)</p>
                <p className="mt-2">✨ I <strong>wanna</strong> buy this jacket.</p>
                <p>✨ Do you <strong>wanna</strong> go shopping?</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <p className="text-2xl font-bold text-indigo-600">gotta</p>
                <p className="text-gray-500">= got to / have to (ter que)</p>
                <p className="mt-2">✨ I <strong>gotta</strong> go to the ATM now.</p>
                <p>✨ She&apos;s <strong>gotta</strong> find the fitting room.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md">
                <p className="text-2xl font-bold text-indigo-600">could</p>
                <p className="text-gray-500">= poderia (educado / possibilidade)</p>
                <p className="mt-2">✨ <strong>Could</strong> you give me a discount?</p>
                <p>✨ We <strong>could</strong> pay with credit card.</p>
              </div>
            </div>
            <div className="mt-6 bg-indigo-50 rounded-2xl p-5 text-center">
              <p className="text-lg">🎯 Exemplos práticos: <em>“I wanna get a receipt”</em> · <em>“You gotta try this product”</em> · <em>“Could you help me?”</em></p>
            </div>
          </div>
        </div>

        {/* ========== CHECK IT OUT — revisão Present Perfect / Past Perfect ========== */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">📌 CHECK IT OUT!</h2>
            <p className="text-blue-100">Present Perfect · Past Perfect · Troco · Expressões</p>
          </div>
          <div className="grid md:grid-cols-3 gap-0">
            <div className="bg-blue-900 text-white p-6">
              <p className="font-bold text-xl">🔄 Present Perfect</p>
              <p className="mt-2">I have bought a new shirt.</p>
              <p>She has worn that dress before.</p>
              <p>We have never tried this store.</p>
              <p className="mt-4 font-bold">⏳ Past Perfect</p>
              <p>I had already changed my clothes.</p>
              <p>She had bought the shoes before the sale.</p>
            </div>
            <div className="bg-blue-800 text-white p-6">
              <p className="font-bold text-xl">💵 Change & Receipt</p>
              <p>I have US$20 in change.</p>
              <p>Here’s your change.</p>
              <p>Do you have change for a 20?</p>
              <p className="mt-4 font-bold">📝 Negative forms</p>
              <p>I’m not / You aren’t / He isn’t / We aren’t / They aren’t</p>
            </div>
            <div className="bg-blue-700 text-white p-6">
              <p className="font-bold text-xl">🎯 Extra vocab</p>
              <p>to buy for = comprar para</p>
              <p>to sell to = vender para</p>
              <p>to give a discount = dar desconto</p>
              <p>to be 10% off = estar 10% mais barato</p>
            </div>
          </div>
        </div>

        {/* Homework + Skills check */}
        <div className="bg-blue-50 rounded-3xl shadow-2xl mb-8 overflow-hidden border border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-8">
            <h2 className="text-3xl font-bold">📋 SKILLS CHECK + HOMEWORK</h2>
            <p className="text-blue-100">vocabulary · grammar · structure · listening · speaking</p>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-8">
            <div className="bg-white p-5 rounded-2xl">
              <p className="font-bold text-xl">📝 Write in English:</p>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Eu preciso de troco para vinte → <em>I need change for twenty.</em></li>
                <li>Eles estão vendendo itens usados → <em>They are selling used items.</em></li>
                <li>Ela nunca tinha comprado um relógio antes → <em>She had never bought a watch before.</em></li>
              </ul>
            </div>
            <div className="bg-white p-5 rounded-2xl">
              <p className="font-bold text-xl">🔊 Unscramble / Listening</p>
              <p>1. store / gives / this / discounts → <em>This store gives discounts.</em></p>
              <p>2. gotta / I / go / now → <em>I gotta go now.</em></p>
              <p>3. could / you / help / me? → <em>Could you help me?</em></p>
            </div>
          </div>
        </div>

        {/* Lesson summary */}
        <div className="bg-blue-100/80 backdrop-blur-sm rounded-3xl p-6 text-center mb-10">
          <p className="text-xl font-bold text-blue-900">✅ RESUMO DA LIÇÃO</p>
          <p className="text-gray-800">✓ vocabulário de compras ✓ present continuous negativo ✓ present perfect & past perfect ✓ pedir troco/recibo ✓ wanna/gotta/could ✓ falar de promoções</p>
        </div>

        {/* next button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson52")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 text-xl font-bold transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow shadow-xl"
          >
            Next Lesson → 52
          </button>
        </div>
      </div>
    </div>
  );
}