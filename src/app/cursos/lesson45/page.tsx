"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

export default function Lesson45EatingOut() {
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
        backgroundImage: `url("/images/lesson45-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 45 – EATING OUT
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍽️ Aprenda a falar sobre restaurantes, horários de funcionamento, utensílios de mesa e como usar <strong>something</strong> e <strong>anything</strong> em inglês!
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson45-main.jpg"
              alt="Eating out - Restaurant"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos (to open / to close) */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e estude suas conjugações
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to_open')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to open
                </button> = abrir
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_close')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to close
                </button> = fechar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I open / You open / He opens / We open / They open</p>
                  <p className="text-sm text-gray-500 mt-1">Eu abro / Você abre / Ele abre / Nós abrimos / Eles abrem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">It opens at seven o'clock.</p>
                  <p className="text-sm text-gray-500 mt-1">Abre às sete horas.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">It doesn't open.</p>
                  <p className="text-sm text-gray-500 mt-1">Não abre.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">What time does it open?</p>
                  <p className="text-sm text-gray-500 mt-1">Que horas abre?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">It opens at 6 a.m. / It opens at 8 a.m. / It opens at night.</p>
                  <p className="text-sm text-gray-500 mt-1">Abre às 6 da manhã / Abre às 8 da manhã / Abre à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">It doesn't open on Sundays.</p>
                  <p className="text-sm text-gray-500 mt-1">Não abre aos domingos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">It closes at 10 p.m. / It closes early.</p>
                  <p className="text-sm text-gray-500 mt-1">Fecha às 22h / Fecha cedo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">What time does the store open? / What time does the bank close?</p>
                  <p className="text-sm text-gray-500 mt-1">Que horas a loja abre? / Que horas o banco fecha?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I close / You close / He closes / We close / They close</p>
                  <p className="text-sm text-gray-500 mt-1">Eu fecho / Você fecha / Ele fecha / Nós fechamos / Eles fecham</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Close your books. / Open your books.</p>
                  <p className="text-sm text-gray-500 mt-1">Fechem seus livros. / Abram seus livros.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário (Utensílios e Comidas) */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟢 NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/bottle.jpg" alt="bottle" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('bottle')} className="text-blue-600 font-bold mt-2">bottle</button>
                <p className="text-sm text-gray-600">garrafa</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/can.jpg" alt="can" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('can')} className="text-blue-600 font-bold mt-2">can</button>
                <p className="text-sm text-gray-600">lata</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/spoon.jpg" alt="spoon" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('spoon')} className="text-blue-600 font-bold mt-2">spoon</button>
                <p className="text-sm text-gray-600">colher</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/fork.jpg" alt="fork" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('fork')} className="text-blue-600 font-bold mt-2">fork</button>
                <p className="text-sm text-gray-600">garfo</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/knife.jpg" alt="knife" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('knife')} className="text-blue-600 font-bold mt-2">knife</button>
                <p className="text-sm text-gray-600">faca</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/napkin.jpg" alt="napkin" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('napkin')} className="text-blue-600 font-bold mt-2">napkin</button>
                <p className="text-sm text-gray-600">guardanapo</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/straw.jpg" alt="straw" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('straw')} className="text-blue-600 font-bold mt-2">straw</button>
                <p className="text-sm text-gray-600">canudo</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/milkshake.jpg" alt="milkshake" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('milkshake')} className="text-blue-600 font-bold mt-2">milkshake</button>
                <p className="text-sm text-gray-600">milk-shake</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/snack.jpg" alt="snack" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('snack')} className="text-blue-600 font-bold mt-2">snack</button>
                <p className="text-sm text-gray-600">lanche</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/icecream-parlor.jpg" alt="ice cream parlor" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('ice_cream_parlor')} className="text-blue-600 font-bold mt-2">ice cream parlor</button>
                <p className="text-sm text-gray-600">sorveteria</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/delicious.jpg" alt="delicious" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('delicious')} className="text-blue-600 font-bold mt-2">delicious</button>
                <p className="text-sm text-gray-600">delicioso</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <Image src="/images/different.jpg" alt="different" width={80} height={80} className="mx-auto rounded-lg object-cover" />
                <button onClick={() => playAudio('different')} className="text-blue-600 font-bold mt-2">different</button>
                <p className="text-sm text-gray-600">diferente</p>
              </div>
            </div>

            <div className="bg-blue-100 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-blue-800 mb-3">📝 Examples:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <p>🍾 I want <span className="text-blue-600 font-bold">a bottle of water</span></p>
                <p>🥤 I prefer <span className="text-blue-600 font-bold">a can of soda</span></p>
                <p>🍴 I need <span className="text-blue-600 font-bold">a fork and a knife</span></p>
                <p>🧻 Do you have <span className="text-blue-600 font-bold">a napkin</span>?</p>
                <p>🥤 I want <span className="text-blue-600 font-bold">a straw</span></p>
                <p>🥤 <span className="text-blue-600 font-bold">This milkshake</span> is delicious</p>
                <p>🍽️ I want <span className="text-blue-600 font-bold">something different</span></p>
                <p>❓ Do you want <span className="text-blue-600 font-bold">anything</span>?</p>
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you want <span className="text-blue-600 font-bold">a glass of water</span>? / soda / juice</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer um copo de água? / refrigerante / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I want <span className="text-blue-600 font-bold">a bottle of soda</span>, please. / water / juice</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero uma garrafa de refrigerante, por favor. / de água / de suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">We prefer to buy <span className="text-blue-600 font-bold">a can of soda</span>. / a glass / a bottle</p>
                  <p className="text-sm text-gray-500 mt-1">Nós preferimos comprar uma lata de refrigerante. / um copo / uma garrafa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">He needs <span className="text-blue-600 font-bold">a knife</span>. / a fork / a spoon</p>
                  <p className="text-sm text-gray-500 mt-1">Ele precisa de uma faca. / de um garfo / de uma colher</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Excuse me, do you have <span className="text-blue-600 font-bold">a spoon</span>? / a napkin / a straw</p>
                  <p className="text-sm text-gray-500 mt-1">Com licença, você tem uma colher? / um guardanapo / um canudo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you need <span className="text-blue-600 font-bold">a napkin</span>? / a straw / a fork</p>
                  <p className="text-sm text-gray-500 mt-1">Você precisa de algum guardanapo? / canudo / garfo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I love to have <span className="text-blue-600 font-bold">ice cream</span>. / soup / milkshake</p>
                  <p className="text-sm text-gray-500 mt-1">Eu adoro tomar sorvete / sopa / milk-shake</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I want to have <span className="text-blue-600 font-bold">a snack</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero fazer um lanche.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">This dish is <span className="text-blue-600 font-bold">delicious</span>. / dessert / snack</p>
                  <p className="text-sm text-gray-500 mt-1">Este prato está delicioso. / sobremesa / lanche</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">That is our favorite <span className="text-blue-600 font-bold">snack bar</span>. / ice cream parlor / cafeteria</p>
                  <p className="text-sm text-gray-500 mt-1">Aquela é nossa lanchonete favorita. / sorveteria / cafeteria</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">They want to go to a <span className="text-blue-600 font-bold">different restaurant</span>. / today / tomorrow</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem ir a um restaurante diferente. / hoje / amanhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I want to meet my friends at the <span className="text-blue-600 font-bold">snack bar</span>. / ice cream parlor / cafeteria</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero encontrar meus amigos na lanchonete. / sorveteria / cafeteria</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Open this bottle</span> for me, please.</p>
                  <p className="text-sm text-gray-500 mt-1">Abra esta garrafa pra mim, por favor.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟣 USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para comer fora
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_want_to_go_out_tonight')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I want to go out tonight.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu quero sair hoje à noite</span>
              </p>
              <p>
                <button onClick={() => playAudio('we_work_out_every_other_day')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  We work out every other day.
                </button>
                <br />
                <span className="text-sm text-gray-500">Nós fazemos exercícios dia sim, dia não</span>
              </p>
              <p>
                <button onClick={() => playAudio('what_do_you_want_to_order')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  What do you want to order?
                </button>
                <br />
                <span className="text-sm text-gray-500">O que você quer pedir?</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I want to go out <span className="text-blue-600 font-bold">tomorrow</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero sair amanhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">We work out <span className="text-blue-600 font-bold">every day</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Nós treinamos todo dia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">What do you want to <span className="text-blue-600 font-bold">eat</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer comer?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">What do you want to <span className="text-blue-600 font-bold">drink</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer beber?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to <span className="text-blue-600 font-bold">order now</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer pedir agora?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">They go out together on <span className="text-blue-600 font-bold">weekends</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eles saem juntos aos finais de semana.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you prefer to go out or <span className="text-blue-600 font-bold">stay at home</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere sair ou ficar em casa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">They eat fast food <span className="text-blue-600 font-bold">every other day</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem comida rápida dia sim, dia não.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">What do <span className="text-blue-600 font-bold">you want to order</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer pedir?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">She wants to order <span className="text-blue-600 font-bold">a hamburger</span>. / a milkshake / soda</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer pedir um hambúrguer. / um milk-shake / refrigerante</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática (Something / Anything) */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟡 GRAMMAR - SOMETHING / ANYTHING</h2>
              <p className="mt-2 text-blue-100 italic">
                Aprenda a usar SOMETHING (algo/alguma coisa) e ANYTHING (algo/alguma coisa/nada)
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            {/* Explicação em Português */}
            <div className="bg-blue-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">📚 ENTENDENDO SOMETHING E ANYTHING</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                  <h4 className="text-lg font-bold text-green-700 mb-2">✅ SOMETHING (algo / alguma coisa)</h4>
                  <p className="text-gray-700 mb-2">Usado em <span className="font-bold text-green-600">frases afirmativas</span>:</p>
                  <p className="text-gray-600 italic">"I need <span className="text-green-600 font-bold">something</span> to eat."</p>
                  <p className="text-sm text-gray-500">Eu preciso de <span className="font-bold">algo</span> para comer.</p>
                  <p className="text-gray-600 italic mt-2">"She wants <span className="text-green-600 font-bold">something</span> to drink."</p>
                  <p className="text-sm text-gray-500">Ela quer <span className="font-bold">alguma coisa</span> para beber.</p>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-red-500">
                  <h4 className="text-lg font-bold text-red-700 mb-2">❌ ANYTHING (nada / alguma coisa)</h4>
                  <p className="text-gray-700 mb-2">Usado em <span className="font-bold text-red-600">frases negativas e interrogativas</span>:</p>
                  <p className="text-gray-600 italic">"I don't want <span className="text-red-600 font-bold">anything</span> to drink."</p>
                  <p className="text-sm text-gray-500">Eu não quero <span className="font-bold">nada</span> para beber.</p>
                  <p className="text-gray-600 italic mt-2">"Do you want <span className="text-red-600 font-bold">anything</span> to eat?"</p>
                  <p className="text-sm text-gray-500">Você quer <span className="font-bold">alguma coisa</span> para comer?</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-center text-yellow-800">
                  💡 <span className="font-bold">DICA IMPORTANTE:</span> Em frases negativas, <span className="text-red-600 font-bold">anything</span> significa <span className="font-bold">"nada"</span>.<br />
                  Em perguntas, <span className="text-red-600 font-bold">anything</span> significa <span className="font-bold">"alguma coisa"</span>.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_need_to_eat_something')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I need to eat something.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu preciso comer alguma coisa</span>
              </p>
              <p>
                <button onClick={() => playAudio('we_want_to_give_you_something')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  We want to give you something for your birthday.
                </button>
                <br />
                <span className="text-sm text-gray-500">Nós queremos te dar algo</span>
              </p>
              <p>
                <button onClick={() => playAudio('i_dont_want_anything_to_drink')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I don't want anything to drink.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu não quero nada para beber</span>
              </p>
              <p>
                <button onClick={() => playAudio('she_doesnt_want_to_buy_anything')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  She doesn't want to buy anything.
                </button>
                <br />
                <span className="text-sm text-gray-500">Ela não quer comprar nada</span>
              </p>
              <p>
                <button onClick={() => playAudio('do_you_have_anything_to_study')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  Do you have anything to study today?
                </button>
                <br />
                <span className="text-sm text-gray-500">Você tem algo para estudar hoje?</span>
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I need <span className="text-blue-600 font-bold">something</span> to eat now.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso comer alguma coisa agora.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">He needs <span className="text-blue-600 font-bold">something</span> to open the can.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele precisa de algo para abrir a lata.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you want <span className="text-blue-600 font-bold">anything</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer alguma coisa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to buy <span className="text-blue-600 font-bold">anything</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer comprar alguma coisa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Do you have to study <span className="text-blue-600 font-bold">anything</span> today?</p>
                  <p className="text-sm text-gray-500 mt-1">Você tem que estudar alguma coisa hoje?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">They don't want <span className="text-blue-600 font-bold">anything</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não querem nada.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I don't want <span className="text-blue-600 font-bold">anything</span> to drink.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero nada para beber.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">He doesn't want to order <span className="text-blue-600 font-bold">anything</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não quer pedir nada.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">I don't have <span className="text-blue-600 font-bold">anything different</span> here.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não tenho nada diferente aqui.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 REAL LIFE</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique com situações do dia a dia em restaurantes
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('the_snack_bar_opens_at_noon')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">The snack bar opens at <span className="text-blue-600 font-bold">noon</span>.</p>
                        <p className="text-sm text-gray-600">A lanchonete abre ao meio-dia.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('does_it_open_on_weekends')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Does it open on <span className="text-blue-600 font-bold">weekends</span>?</p>
                        <p className="text-sm text-gray-600">Abre nos fins de semana?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('the_school_opens_at_900_am')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">The school opens at <span className="text-blue-600 font-bold">9:00 a.m.</span></p>
                        <p className="text-sm text-gray-600">A escola abre às 9h.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('the_gym_doesnt_close_on_sundays')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">The gym doesn't close on <span className="text-blue-600 font-bold">Sundays</span>.</p>
                        <p className="text-sm text-gray-600">A academia não fecha aos domingos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_they_close_the_museum_early')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Do they close the museum <span className="text-blue-600 font-bold">early</span>?</p>
                        <p className="text-sm text-gray-600">Eles fecham o museu cedo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('what_time_does_it_open')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">What time does it <span className="text-blue-600 font-bold">open</span>?</p>
                        <p className="text-sm text-gray-600">Que horas abre?</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_you_need_anything')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Do you need <span className="text-blue-600 font-bold">anything</span>?</p>
                        <p className="text-sm text-gray-600">Você precisa de alguma coisa?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_dont_need_anything_thanks')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I don't need anything, <span className="text-blue-600 font-bold">thanks</span>.</p>
                        <p className="text-sm text-gray-600">Eu não preciso de nada, obrigado.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('im_hungry_i_want_something_to_eat')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I'm hungry. I want <span className="text-blue-600 font-bold">something to eat</span>.</p>
                        <p className="text-sm text-gray-600">Estou com fome. Quero algo para comer.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('are_you_thirsty_do_you_want_something_to_drink')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Are you thirsty? Do you want <span className="text-blue-600 font-bold">something to drink</span>?</p>
                        <p className="text-sm text-gray-600">Está com sede? Quer algo para beber?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('open_this_bottle_for_me_please')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Open this bottle for me, <span className="text-blue-600 font-bold">please</span>.</p>
                        <p className="text-sm text-gray-600">Abra essa garrafa pra mim, por favor.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_need_a_fork_to_eat_my_cake')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I need a fork to eat my <span className="text-blue-600 font-bold">cake</span>.</p>
                        <p className="text-sm text-gray-600">Eu preciso de um garfo para comer meu bolo.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/restaurant-interior.jpg"
                        alt="Restaurant interior"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Restaurant interior</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/ice-cream-parlor.jpg"
                        alt="Ice cream parlor"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Ice cream parlor</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/snack-bar.jpg"
                        alt="Snack bar"
                        width={200}
                        height={200}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Snack bar</p>
                  </div>
                </div>
              </div>

              {/* Prática extra do REAL LIFE que aparece quando clica em Mostrar Prática */}
              {openDrills.realLife && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-blue-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">📝 More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">The restaurant opens at <span className="text-blue-600 font-bold">noon / 7 p.m. / 8 a.m.</span></p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">Does it open on <span className="text-blue-600 font-bold">Sundays / holidays / weekends</span>?</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">The store closes at <span className="text-blue-600 font-bold">10 p.m. / 6 p.m. / midnight</span></p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">What time does the <span className="text-blue-600 font-bold">bank / supermarket / school</span> open?</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">Do you need <span className="text-blue-600 font-bold">anything</span> to eat/drink?</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">I want <span className="text-blue-600 font-bold">something</span> sweet / salty / cold</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">I don't want <span className="text-blue-600 font-bold">anything</span> right now, thanks.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <p className="font-medium">Can you open this <span className="text-blue-600 font-bold">bottle / can / jar</span> for me?</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out! */}
        <div className="bg-white border-2 border-blue-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🟣 CHECK IT OUT!</h2>
            <p className="mt-2 text-blue-100 italic">
              Revise os pontos principais e expressões essenciais da lição
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">breakfast</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">lunch</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">dinner</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">a snack</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">dessert</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">some soup</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">a milkshake</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>to have <span className="font-bold text-blue-300">ice cream</span></p>
              </div>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center gap-3">
              <div className="bg-yellow-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-blue-700">I want to go out tonight.</span>
                <p className="text-sm text-gray-500 mt-1">Eu quero sair hoje à noite.</p>
              </div>
              <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-green-700">Do you need anything?</span>
                <p className="text-sm text-gray-500 mt-1">Você precisa de alguma coisa?</p>
              </div>
              <div className="bg-blue-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-blue-700">I don't need anything, thanks.</span>
                <p className="text-sm text-gray-500 mt-1">Não preciso de nada, obrigado.</p>
              </div>
            </div>

            <div className="bg-blue-900 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>What time does <span className="font-bold text-blue-300">it open</span>?</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>It opens at <span className="font-bold text-blue-300">7 a.m.</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>It doesn't open on <span className="font-bold text-blue-300">Sundays</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>I need <span className="font-bold text-blue-300">something to eat</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>I don't want <span className="font-bold text-blue-300">anything to drink</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-300 text-2xl">•</span>
                <p>Do you want <span className="font-bold text-blue-300">anything</span>?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-blue-100 border-2 border-blue-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Conjugar os verbos to open e to close</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Vocabulário sobre utensílios de mesa e comidas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar something em frases afirmativas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar anything em frases negativas e interrogativas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar e responder sobre horários de funcionamento</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Fazer pedidos em restaurantes</span>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson46")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}