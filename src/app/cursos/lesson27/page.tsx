"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonGettingAround() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
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
        backgroundImage: `url("/images/lesson27-bg.jpg")`,
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
            LESSON 27 – GETTING AROUND
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda vocabulário essencial e expressões para falar sobre lugares, visitas e locomoção em inglês. 🗺️🚶‍♀️🏛️
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson27-main.jpg"
              alt="Lesson intro - Getting Around"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e estude suas conjugações
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
                  onClick={() => playAudio('to_meet')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to meet
                </button> = encontrar, conhecer
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_visit')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to visit
                </button> = visitar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600">encontrar, conhecer</span> / Eu encontro. / Você encontra. / Nós encontramos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Eu não <span className="text-blue-600">encontro</span>. / Eles não encontram. / Vocês não encontram.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Ela <span className="text-blue-600">encontra</span>. / Ela não encontra. / Ela encontra?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Você encontra seus <span className="text-blue-600">amigos</span>? / no shopping / na praia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Onde você encontra seus <span className="text-blue-600">vizinhos</span>? / colegas de classe / professores</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I want to meet <span className="text-blue-600">John</span>. / a Lisa / a Kelly</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600">visitar</span> / Eu visito. / Ela visita. / Nós visitamos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. Ela quer <span className="text-blue-600">visitar</span>. / prefere / gosta de</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Eu visito meus amigos aos <span className="text-blue-600">domingos</span>. / sábados / aos fins de semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. Quando você visita sua <span className="text-blue-600">família</span>? / seu pai / sua mãe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. I want to visit <span className="text-blue-600">you</span>. / Ela quer / Nós queremos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">NEW WORDS</h2>
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
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('grandparents')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">grandparents</button> = avós
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('relative')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">relative</button> = parente
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('uncle')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">uncle</button> = tio
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('aunt')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">aunt</button> = tia
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('cousin')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">cousin</button> = primo(a)
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('park')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">park</button> = parque
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('square')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">square</button> = praça
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('museum')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">museum</button> = museu
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('place')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">place</button> = lugar
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('near')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">near</button> = perto
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('far')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">far</button> = longe
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('from')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">from</button> = de, do, da
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('how_many')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">how many</button> = quantos(as)
              </li>
              <li className="list-disc pl-6">
                <button onClick={() => playAudio('how_much')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">how much</button> = quanto(a)
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Eu preciso visitar meus <span className="text-blue-600">parentes</span>. / meus avós / meu tio</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Eu vou ao cinema com meus <span className="text-blue-600">primos</span>. / meu tio / minha tia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Você gosta de ir à <span className="text-blue-600">praia</span>? / ao parque / ao museu</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Ela quer visitar este <span className="text-blue-600">museu</span>. / parque / lugar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Eu gosto muito daquele <span className="text-blue-600">lugar</span>. / daquela praça / daquele parque</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. Você encontra seus amigos no <span className="text-blue-600">escritório</span>? / no parque / na praça</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Você fala com seus <span className="text-blue-600">primos</span> todos os dias? / seus avós / seus tios</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. I live <span className="text-blue-600">near</span> the park. / da praça / do hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Ele mora <span className="text-blue-600">perto</span> do shopping. / do banco / do mercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. She lives <span className="text-blue-600">far</span> from the beach. / do cinema / da academia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. I don't live near <span className="text-blue-600">here</span>. / Ele / Ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. Você mora longe <span className="text-blue-600">daqui</span>? / seus pais / Ela</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns e expressões do dia a dia
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
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i_want_to_meet_my_friends_tomorrow')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I want to meet my friends tomorrow.
                </button> = Eu quero encontrar meus amigos amanhã.
              </p>
              <p>
                <button onClick={() => playAudio('we_like_to_go_to_the_beach_on_vacation')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  We like to go to the beach on vacation.
                </button> = Nós gostamos de ir à praia nas férias.
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Aonde você quer ir nas <span className="text-blue-600">férias</span>? / eles / ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Ela quer ir à <span className="text-blue-600">praia</span> nas férias. / ao parque / ao campo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Ele visita muitos lugares nas <span className="text-blue-600">férias</span>. / nos fins de semana / aos sábados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu preciso ir à <span className="text-blue-600">loja</span> amanhã. / ao museu / à farmácia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Aonde você quer ir <span className="text-blue-600">amanhã</span>? / eles / ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. Eu quero encontrar meus colegas de trabalho <span className="text-blue-600">amanhã</span>. / no sábado / esta semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. É <span className="text-blue-600">caro</span>. / barato / novo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. É <span className="text-blue-600">perto</span>. / longe / velho</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Observe a diferença entre How many e How much
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
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-[20px] border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                  <span className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                  HOW MANY? (Contáveis)
                </h3>
                <ul className="space-y-2">
                  <li><span className="font-bold">How many cousins</span> do you have?</li>
                  <li><span className="font-bold">How many languages</span> do you want to learn?</li>
                  <li><span className="font-bold">How many places</span> does he want to visit?</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-[20px] border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center">
                  <span className="bg-orange-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                  HOW MUCH? (Incontáveis)
                </h3>
                <ul className="space-y-2">
                  <li><span className="font-bold">How much money</span> do you need?</li>
                  <li><span className="font-bold">How much food</span> do you want to take?</li>
                  <li><span className="font-bold">How much time</span> do you have to study?</li>
                </ul>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> primos você tem? / tios / tias</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> irmãos ela tem? / irmãs / colegas de classe</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> lembrancinhas você quer comprar? / presentes / livros</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> lugares você quer visitar? / parentes / amigos</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> tomates você precisa comprar? / maçãs / ovos</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How many</span> panquecas ela quer comer? / biscoitos doces / biscoitos salgados</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How much</span> money do you need? / Quanto dinheiro você quer? / tem</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How much</span> tempo você tem? / precisa / quer</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800">De quanto tempo você precisa para <span className="text-blue-600">tomar um banho</span>? / almoçar / malhar</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How much</span> comida você quer levar? / geleia / chocolate</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How much</span> água ela bebe todos os dias? / café / chá</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-blue-200">
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">How much</span> tempo ele tem para estudar? / ler / dormir</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">REAL LIFE PRACTICE</h2>
            <p className="mt-2 text-blue-100 italic">
              Substitua as palavras em azul para praticar em situações reais
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_usually_visit_my_relatives_on_weekends')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">1. I usually visit my <span onClick={() => playAudio('relatives')} className="text-blue-600 font-bold cursor-pointer">relatives</span> on weekends.</p>
                        <p className="text-sm text-gray-600">Eu geralmente visito meus parentes nos fins de semana.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_meet_my_classmates_every_day')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">2. I meet my <span onClick={() => playAudio('classmates')} className="text-blue-600 font-bold cursor-pointer">classmates</span> every day.</p>
                        <p className="text-sm text-gray-600">Eu encontro meus colegas de classe todos os dias.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('does_he_visit_you_every_month')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">3. Does he visit <span onClick={() => playAudio('you')} className="text-blue-600 font-bold cursor-pointer">you</span> every month?</p>
                        <p className="text-sm text-gray-600">Ele visita você todo mês?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('we_want_to_go_to_the_museum_tomorrow')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">4. We want to go to the <span onClick={() => playAudio('museum')} className="text-blue-600 font-bold cursor-pointer">museum</span> tomorrow.</p>
                        <p className="text-sm text-gray-600">Nós queremos ir ao museu amanhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_you_live_far_from_the_park')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">5. Do you live <span onClick={() => playAudio('far')} className="text-blue-600 font-bold cursor-pointer">far</span> from the park?</p>
                        <p className="text-sm text-gray-600">Você mora longe do parque?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_they_live_near_the_square')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">6. Do they live near the <span onClick={() => playAudio('square')} className="text-blue-600 font-bold cursor-pointer">square</span>?</p>
                        <p className="text-sm text-gray-600">Eles moram perto da praça?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('how_much_money_do_we_need')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">7. How much <span onClick={() => playAudio('money')} className="text-blue-600 font-bold cursor-pointer">money</span> do we need?</p>
                        <p className="text-sm text-gray-600">De quanto dinheiro nós precisamos?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('how_much_time_does_he_have_to_clean_the_house')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">8. How much <span onClick={() => playAudio('time')} className="text-blue-600 font-bold cursor-pointer">time</span> does he have to clean the house?</p>
                        <p className="text-sm text-gray-600">Quanto tempo ele tem para limpar a casa?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('how_many_books_does_she_need')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">9. How many <span onClick={() => playAudio('books')} className="text-blue-600 font-bold cursor-pointer">books</span> does she need?</p>
                        <p className="text-sm text-gray-600">De quantos livros ela precisa?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button onClick={() => playAudio('how_many_countries_do_they_want_to_visit')} className="mr-3 mt-1 text-blue-600 hover:text-blue-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">10. How many <span onClick={() => playAudio('countries')} className="text-blue-600 font-bold cursor-pointer">countries</span> do they want to visit?</p>
                        <p className="text-sm text-gray-600">Quantos países eles querem visitar?</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/lesson27-reallife1.jpg"
                        alt="Família visitando parentes"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Visitando parentes
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/lesson27-reallife2.jpg"
                        alt="Pessoas em um museu"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Visitando um museu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out! */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
            <p className="mt-2 text-blue-100 italic">
              Revise os pontos principais e expressões essenciais da lição
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p><span className="font-bold">• on my vacation</span></p>
              <p><span className="font-bold">• on your vacation</span></p>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/lesson27-check.jpg"
                alt="Mapa e localização"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                It's <span className="font-bold">near</span> here.
              </div>
              <div className="bg-yellow-100 text-black px-4 py-2 rounded-xl shadow-md text-center mt-2">
                It's <span className="font-bold">far</span> from here.
              </div>
            </div>

            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button onClick={() => playAudio('grandmother')} className="mr-2 text-blue-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• grandmother</p>
              </div>
              <div className="flex items-center group">
                <button onClick={() => playAudio('grandfather')} className="mr-2 text-blue-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• grandfather</p>
              </div>
              <div className="flex items-center group">
                <button onClick={() => playAudio('grandparents')} className="mr-2 text-blue-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• grandparents</p>
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
              <span className="text-gray-800">Falar sobre parentes e familiares</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Descrever lugares (parque, museu, praça)</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Expressar distância (near / far from)</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar quantidades com How many / How much</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Conjugar verbos to meet e to visit</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Falar sobre férias e fins de semana</span>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson28")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}