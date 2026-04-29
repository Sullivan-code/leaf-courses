"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

export default function Lesson53GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (word: string) => {
    const formattedWord = word
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
    
    const audio = new Audio(`/audios/${formattedWord}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/lesson53-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 53 – GOING SHOPPING (C1 Upgrade Edition)
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🛍️ Aprenda a falar sobre compras, roupas e use o <strong>Present Continuous</strong> em inglês!
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson53-main.jpg"
              alt="Going Shopping"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos (to put / to do) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 VERBS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique nos verbos para ouvir a pronúncia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to_put')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to put
                </button> = colocar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_do')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to do
                </button> = fazer
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I put / You put / He puts / We put / They put</p>
                  <p className="text-sm text-gray-500 mt-1">Eu coloco / Você coloca / Ele coloca / Nós colocamos / Eles colocam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She would put everything away if she had more time.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela guardaria tudo se tivesse mais tempo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I do / You do / He does / We do / They do</p>
                  <p className="text-sm text-gray-500 mt-1">Eu faço / Você faz / Ele faz / Nós fazemos / Eles fazem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I could do the shopping later if you'd rather wait.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu poderia fazer as compras mais tarde se você preferir esperar.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟣 NEW WORDS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique em cada palavra para ouvir
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('closet')} className="text-purple-600 font-bold mt-2">closet</button>
                <p className="text-sm text-gray-600">armário</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('wardrobe')} className="text-purple-600 font-bold mt-2">wardrobe</button>
                <p className="text-sm text-gray-600">guarda-roupa</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('drawer')} className="text-purple-600 font-bold mt-2">drawer</button>
                <p className="text-sm text-gray-600">gaveta</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('shelf')} className="text-purple-600 font-bold mt-2">shelf</button>
                <p className="text-sm text-gray-600">prateleira</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('coffee_table')} className="text-purple-600 font-bold mt-2">coffee table</button>
                <p className="text-sm text-gray-600">mesa de centro</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('casual')} className="text-purple-600 font-bold mt-2">casual</button>
                <p className="text-sm text-gray-600">casual</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('formal')} className="text-purple-600 font-bold mt-2">formal</button>
                <p className="text-sm text-gray-600">formal</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('loose')} className="text-purple-600 font-bold mt-2">loose</button>
                <p className="text-sm text-gray-600">folgado</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('tight')} className="text-purple-600 font-bold mt-2">tight</button>
                <p className="text-sm text-gray-600">apertado</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('under')} className="text-purple-600 font-bold mt-2">under</button>
                <p className="text-sm text-gray-600">embaixo</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('between')} className="text-purple-600 font-bold mt-2">between</button>
                <p className="text-sm text-gray-600">entre</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('outlet')} className="text-purple-600 font-bold mt-2">outlet</button>
                <p className="text-sm text-gray-600">outlet</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('fitting_room')} className="text-purple-600 font-bold mt-2">fitting room</button>
                <p className="text-sm text-gray-600">provador</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <button onClick={() => playAudio('receipt')} className="text-purple-600 font-bold mt-2">receipt</button>
                <p className="text-sm text-gray-600">recibo</p>
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Your old coats are still in the <span className="text-purple-600 font-bold">closet</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She has an elegant <span className="text-purple-600 font-bold">wardrobe</span> for business trips.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I believe the receipt might be in the <span className="text-purple-600 font-bold">drawer</span>.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟢 USEFUL PHRASES</h2>
              <p className="mt-2 text-purple-100 italic">
                Frases comuns para fazer compras
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('put_on_your_shoes')} className="text-purple-600 font-bold cursor-pointer">
                  Put on your shoes now or we'll be late.
                </button>
                <br />
                <span className="text-sm text-gray-500">Calce os sapatos agora ou vamos nos atrasar.</span>
              </p>
              <p>
                <button onClick={() => playAudio('not_ready_yet')} className="text-purple-600 font-bold cursor-pointer">
                  I'm not ready yet, but I would be if you stopped rushing me.
                </button>
                <br />
                <span className="text-sm text-gray-500">Ainda não estou pronto, mas estaria se parasse de me apressar.</span>
              </p>
              <p>
                <button onClick={() => playAudio('check_that_store')} className="text-purple-600 font-bold cursor-pointer">
                  Could we check that store again?
                </button>
                <br />
                <span className="text-sm text-gray-500">Poderíamos verificar aquela loja novamente?</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">You've got <span className="text-purple-600 font-bold">five minutes</span> to get dressed.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I'd rather not buy <span className="text-purple-600 font-bold">anything overpriced</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">If I were you, <span className="text-purple-600 font-bold">I'd choose the cheaper one</span>.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática (Present Continuous) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟡 GRAMMAR - PRESENT CONTINUOUS</h2>
              <p className="mt-2 text-purple-100 italic">
                Ações que estão acontecendo agora
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_am_shopping')} className="text-purple-600 font-bold cursor-pointer">
                  I am shopping because I need a new suit.
                </button>
                <br />
                <span className="text-sm text-gray-500">Estou comprando porque preciso de um terno novo.</span>
              </p>
              <p>
                <button onClick={() => playAudio('she_is_looking_for')} className="text-purple-600 font-bold cursor-pointer">
                  She is looking for something she could wear tonight.
                </button>
                <br />
                <span className="text-sm text-gray-500">Ela está procurando algo que possa vestir hoje à noite.</span>
              </p>
              <p>
                <button onClick={() => playAudio('what_are_you_doing')} className="text-purple-600 font-bold cursor-pointer">
                  What are you doing right now?
                </button>
                <br />
                <span className="text-sm text-gray-500">O que você está fazendo agora?</span>
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Why is she <span className="text-purple-600 font-bold">wearing those boots indoors</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Why are you <span className="text-purple-600 font-bold">changing your clothes again</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Is he <span className="text-purple-600 font-bold">trying to impress someone</span>?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟠 REAL LIFE</h2>
              <p className="mt-2 text-purple-100 italic">
                Diálogos do dia a dia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 rounded-[20px] p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-2">🛍️ At the Mall</h3>
                <p><strong>Emma:</strong> Lucas, what on earth are you doing?</p>
                <p><strong>Lucas:</strong> I'm looking for a jacket I could wear to the conference.</p>
                <p><strong>Emma:</strong> Would you consider this black one? It would suit you perfectly.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-2">🏠 At Home</h3>
                <p><strong>Mom:</strong> Where is your backpack this time?</p>
                <p><strong>Jake:</strong> It could be under the bed, though I'm not entirely sure.</p>
                <p><strong>Mom:</strong> You cannot be serious.</p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-purple-700 mb-2">💬 Shopping Debate</h3>
                <p><strong>Sophia:</strong> Would you rather buy one expensive coat or three cheap ones?</p>
                <p><strong>Daniel:</strong> I'd rather buy one high-quality coat that could last years.</p>
              </div>
            </div>
            
            {openDrills.realLife && (
              <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-purple-200 animate-fadeIn">
                <h3 className="text-xl font-bold text-purple-700 mb-4">📝 More Practice:</h3>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="font-medium">Could I use the <span className="text-purple-600 font-bold">fitting room</span>, please?</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <p className="font-medium">Without the <span className="text-purple-600 font-bold">receipt</span>, returns may be difficult.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 6 - Check It Out! (TO DO x TO MAKE) */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🧩 CHECK IT OUT!</h2>
            <p className="mt-2 text-purple-100 italic">
              TO DO x TO MAKE - Ambos significam "fazer", mas são usados de forma diferente
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-purple-900 text-white flex-1 p-6 space-y-3 text-lg">
              <h3 className="text-xl font-bold text-purple-300 mb-3">✅ TO DO</h3>
              <p>Tarefas, obrigações, rotinas</p>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>do the dishes</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>do the laundry</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>do the homework</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>do me a favor</p>
              </div>
            </div>

            <div className="bg-white flex-1 p-6 space-y-3 text-lg">
              <h3 className="text-xl font-bold text-purple-700 mb-3">✨ TO MAKE</h3>
              <p>Criar, produzir, construir</p>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-2xl">•</span>
                <p>make dinner</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-2xl">•</span>
                <p>make money</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-2xl">•</span>
                <p>make a plan</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-2xl">•</span>
                <p>make a mistake</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-purple-100 border-2 border-purple-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Conjugar os verbos to put e to do</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Vocabulário sobre compras e roupas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar o Present Continuous para ações em andamento</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Diferenciar TO DO e TO MAKE</span>
            </div>
          </div>
        </div>

        {/* Botão próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson54")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}