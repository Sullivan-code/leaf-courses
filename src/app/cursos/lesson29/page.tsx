"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonGettingAround() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showPrepositionsGuide, setShowPrepositionsGuide] = useState(false);

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
        backgroundImage: `url("/images/lesson29-bg.jpg")`,
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
            Lesson 29 - Getting Around
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a se locomover na cidade: direções, transportes e comandos úteis em inglês. 🚖🚇
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson29-main.jpg"
              alt="Pessoa observando mapa da cidade"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* 🔵 ASSESSMENT - Opostos e Dias da Semana */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔵 Assessment</h2>
            <p className="mt-2 text-blue-100 italic">Pratique opostos e vocabulário essencial</p>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
              <div className="p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-lg font-medium">1. What's the opposite of <span className="font-bold text-blue-600">early</span>?</p>
                <p className="text-gray-700">➡ <span className="font-semibold">late</span></p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-lg font-medium">2. What are the days of the week?</p>
                <p className="text-gray-700">➡ Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-lg font-medium">3. What's the opposite of <span className="font-bold text-blue-600">near</span>?</p>
                <p className="text-gray-700">➡ <span className="font-semibold">far</span></p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-blue-200">
                <p className="text-lg font-medium">4. What's the opposite of <span className="font-bold text-blue-600">left</span>?</p>
                <p className="text-gray-700">➡ <span className="font-semibold">right</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e pratique suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to_drive')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to drive
                </button> = dirigir
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_walk')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to walk
                </button> = caminhar / andar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I drive to the <span className="text-blue-600">office</span>. / school / airport / bank</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. She drives to <span className="text-blue-600">work</span>. / downtown / the supermarket / the station</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. I walk to <span className="text-blue-600">school</span>. / church / the park / the office</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. We walk home <span className="text-blue-600">every day</span>. / at night / in the morning / after work</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Do you drive to <span className="text-blue-600">work</span>? / to school / downtown / to the airport</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I don't <span className="text-blue-600">walk</span> to school. / don't drive / don't go / don't work</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('street')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  street
                </button> = rua
              </li>
              <li>
                <button 
                  onClick={() => playAudio('avenue')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  avenue
                </button> = avenida
              </li>
              <li>
                <button 
                  onClick={() => playAudio('block')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  block
                </button> = quarteirão
              </li>
              <li>
                <button 
                  onClick={() => playAudio('station')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  station
                </button> = estação
              </li>
              <li>
                <button 
                  onClick={() => playAudio('airport')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  airport
                </button> = aeroporto
              </li>
              <li>
                <button 
                  onClick={() => playAudio('bus')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  bus
                </button> = ônibus
              </li>
              <li>
                <button 
                  onClick={() => playAudio('subway')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  subway
                </button> = metrô
              </li>
              <li>
                <button 
                  onClick={() => playAudio('train')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  train
                </button> = trem
              </li>
              <li>
                <button 
                  onClick={() => playAudio('cab')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cab / taxi
                </button> = táxi
              </li>
              <li>
                <button 
                  onClick={() => playAudio('motorcycle')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  motorcycle
                </button> = motocicleta
              </li>
              <li>
                <button 
                  onClick={() => playAudio('bicycle')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  bicycle
                </button> = bicicleta
              </li>
              <li>
                <button 
                  onClick={() => playAudio('address')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  address
                </button> = endereço
              </li>
              <li>
                <button 
                  onClick={() => playAudio('zip_code')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  zip code
                </button> = CEP
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I live on this <span className="text-blue-600">street</span>. / avenue / block</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. He works near the <span className="text-blue-600">station</span>. / airport / bus station / subway station</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. She takes the <span className="text-blue-600">bus</span> in the morning. / subway / train / taxi</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. We go to the <span className="text-blue-600">airport</span>. / downtown / the station / the avenue</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. What's your <span className="text-blue-600">address</span>? / zip code / phone number / email</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 Slangs and Fluency</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para se locomover na cidade
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('do_you_want_to_go_downtown')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you want to go downtown?
                </button> = Você quer ir ao centro?
              </li>
              <li>
                <button 
                  onClick={() => playAudio('take_me_to_the_airport_please')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Take me to the airport, please.
                </button> = Leve-me ao aeroporto, por favor.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('walk_two_blocks')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Walk two blocks.
                </button> = Ande dois quarteirões.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('meet_me_at_the_mall')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Meet me at the mall.
                </button> = Encontre-me no shopping.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Take me to the <span className="text-blue-600">airport</span>. / bus station / downtown / school</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Walk <span className="text-blue-600">two blocks</span>. / three blocks / one block / five blocks</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Meet me at the <span className="text-blue-600">mall</span>. / station / park / airport</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Don't take the <span className="text-blue-600">subway</span>. / bus / taxi / train</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 Understand Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Aprenda a dar comandos afirmativos e negativos
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('go_home')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Go home.
                </button> = Vá para casa.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('take_a_cab')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Take a cab.
                </button> = Pegue um táxi.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('dont_go_there')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Don't go there.
                </button> = Não vá lá.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('dont_buy_this_ticket')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Don't buy this ticket.
                </button> = Não compre este ingresso.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Go <span className="text-blue-600">home</span>. / downtown / to school / to the airport</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Take a <span className="text-blue-600">cab</span>. / bus / subway / train</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Don't go <span className="text-blue-600">alone</span>. / don't walk at night / don't drive fast / don't stay late</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Don't buy <span className="text-blue-600">this ticket</span>. / this car / this bicycle / this house</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔵 Real Life Practice</h2>
            <p className="mt-2 text-blue-100 italic">
              Substitua as palavras em azul para praticar a pronúncia em situações reais
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('she_takes_the_subway_at_7_am')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. She takes the <span className="text-blue-600 font-bold">subway</span> at 7:00 a.m.
                        </p>
                        <p className="text-sm text-gray-600">Ela pega o metrô às 7:00 da manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('we_go_to_work_by_bicycle')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. We go to work by <span className="text-blue-600 font-bold">bicycle</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós vamos ao trabalho de bicicleta.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do_we_need_to_go_downtown_now')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. Do we need to go <span className="text-blue-600 font-bold">downtown</span> now?
                        </p>
                        <p className="text-sm text-gray-600">Nós precisamos ir ao centro agora?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('does_she_live_on_this_street')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Does she live on this <span className="text-blue-600 font-bold">street</span>?
                        </p>
                        <p className="text-sm text-gray-600">Ela mora nesta rua?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i_dont_drive_i_usually_walk_to_work')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. I don't drive. I usually <span className="text-blue-600 font-bold">walk</span> to work.
                        </p>
                        <p className="text-sm text-gray-600">Eu não dirijo. Eu geralmente ando para o trabalho.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('take_a_cab_to_the_airport')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Take a <span className="text-blue-600 font-bold">cab</span> to the airport.
                        </p>
                        <p className="text-sm text-gray-600">Pegue um táxi para o aeroporto.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('my_address_is_123_main_street')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. My <span className="text-blue-600 font-bold">address</span> is 123 Main Street.
                        </p>
                        <p className="text-sm text-gray-600">Meu endereço é Rua Principal, 123.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('whats_your_zip_code')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. What's your <span className="text-blue-600 font-bold">zip code</span>?
                        </p>
                        <p className="text-sm text-gray-600">Qual é o seu CEP?</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-city-transport.jpg"
                        alt="Metrô da cidade"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Transporte público na cidade
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-city-walking.jpg"
                        alt="Pessoas caminhando na cidade"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Andar a pé também é uma opção
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out com Guia de Preposições */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔵 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Endereços, preposições e tipos de via - tudo o que você precisa para se localizar!
              </p>
            </div>
            <button 
              onClick={() => setShowPrepositionsGuide(!showPrepositionsGuide)}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-full transition-colors shadow-md"
            >
              {showPrepositionsGuide ? 'Ocultar Explicação' : '📘 Explicação'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Endereços e Abreviações */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4">
              <h3 className="text-2xl font-bold mb-4">📍 Address Essentials</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-xl">What's your address?</p>
                  <p className="text-lg text-blue-200">– It's 123 Main Street.</p>
                </div>
                <div>
                  <p className="font-bold text-xl">What's your zip code?</p>
                  <p className="text-lg text-blue-200">– It's 45870.</p>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-blue-700">
                <h4 className="font-bold text-lg mb-2">📝 Abbreviations</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p><span className="font-bold">Street</span> = St.</p>
                    <p><span className="font-bold">Avenue</span> = Ave.</p>
                    <p><span className="font-bold">Boulevard</span> = Blvd.</p>
                  </div>
                  <div>
                    <p><span className="font-bold">Road</span> = Rd.</p>
                    <p><span className="font-bold">Lane</span> = Ln.</p>
                    <p><span className="font-bold">Drive</span> = Dr.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Coluna central - Imagem e balão de diálogo */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center relative">
              <Image
                src="/images/cio-address.jpg"
                alt="Pessoa escrevendo endereço em um envelope"
                width={180}
                height={180}
                className="rounded-full w-44 h-44 object-cover mb-4 shadow-lg border-4 border-blue-200"
              />
              <div className="bg-yellow-200 text-black px-6 py-3 rounded-xl shadow-md text-center max-w-xs">
                <p className="text-lg font-medium">Excuse me, what's the address?</p>
                <p className="text-xl font-bold mt-1">It's 742 Evergreen Ave.</p>
                <p className="text-sm mt-1 italic">Zip code: 90210</p>
              </div>
            </div>

            {/* Coluna direita - Preposições (visível quando o botão é clicado) */}
            <div className={`flex-1 p-6 space-y-4 transition-all duration-300 ${showPrepositionsGuide ? 'bg-blue-800' : 'bg-blue-900'}`}>
              {showPrepositionsGuide ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4">📍 Prepositions of Place</h3>
                  <div className="space-y-3 text-white">
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                      <div>
                        <p className="font-bold text-lg">ON</p>
                        <p className="text-blue-200">"I live <span className="text-yellow-300 font-bold">on</span> Main Street."</p>
                        <p className="text-sm text-blue-300">Para ruas, avenidas</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                      <div>
                        <p className="font-bold text-lg">AT</p>
                        <p className="text-blue-200">"Meet me <span className="text-yellow-300 font-bold">at</span> 123 Main St."</p>
                        <p className="text-sm text-blue-300">Para endereços completos</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                      <div>
                        <p className="font-bold text-lg">IN</p>
                        <p className="text-blue-200">"She lives <span className="text-yellow-300 font-bold">in</span> Chicago."</p>
                        <p className="text-sm text-blue-300">Para cidades, países</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                      <div>
                        <p className="font-bold text-lg">NEAR / BY</p>
                        <p className="text-blue-200">"The station is <span className="text-yellow-300 font-bold">near</span> here."</p>
                        <p className="text-sm text-blue-300">Para proximidade</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-blue-700">
                      <p className="text-sm text-blue-300 italic">
                        💡 Dica: "I'm <span className="text-yellow-300 font-bold">on</span> the corner <span className="text-yellow-300 font-bold">of</span> 5th Ave <span className="text-yellow-300 font-bold">and</span> Main St."
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-bold text-center mb-2">Clique em "Explicação"</p>
                  <p className="text-blue-200 text-center">Aprenda as preposições ON, AT, IN e muito mais!</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Rodapé com exemplos adicionais */}
          <div className="bg-gray-50 p-4 border-t border-blue-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-700">
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">On</span> the street</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">At</span> the corner</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">In</span> the city</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">Near</span> the station</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">By</span> the park</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("https://website-english-course.vercel.app/cursos/lesson28")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}