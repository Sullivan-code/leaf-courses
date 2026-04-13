"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

export default function LessonStudiesIdeasOpinions() {
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
        backgroundImage: `url("/images/lesson35-bg.jpg")`,
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
            LESSON 35 – STUDIES, IDEAS & OPINIONS
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a expressar suas opiniões, falar sobre estudos e usar conectores como "why" e "because" em inglês. ✍️💡🗣️
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/lesson35-main.jpg"
              alt="Lesson intro - Studies, Ideas & Opinions"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">VERBS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique nos verbos para ouvir a pronúncia e estude suas conjugações
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
                  onClick={() => playAudio('to_write')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to write
                </button> = escrever
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to_think')} 
                  className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                >
                  to think
                </button> = pensar, achar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-purple-600">escrever</span> / I write. / You write. / We write.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu escrevo. / Vocês escrevem. / Nós escrevemos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">2. He doesn't write. / She / You</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não escreve. / Ela / Você</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">3. Do they write? / Do you / Does he</p>
                  <p className="text-sm text-gray-500 mt-1">Elas escrevem? / Você / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">4. What does she write? / When / Where</p>
                  <p className="text-sm text-gray-500 mt-1">O que ela escreve? / Quando / Onde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">5. Do you like to write? / prefer / want</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de escrever? / prefere / quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-purple-600">pensar, achar</span> / I think. / He thinks. / We think.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu penso. / Ele pensa. / Nós pensamos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">7. They don't think. / I / He</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não acham. / Eu / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">8. Do you think? / Do they / Does she</p>
                  <p className="text-sm text-gray-500 mt-1">Você acha? / Eles / Ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">9. What do you think? / about this subject / about this problem</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa? / sobre esse assunto / sobre esse problema</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">10. What do you think about his opinion? / her opinion</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa sobre a opinião dele? / dela</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">NEW WORDS</h2>
              <p className="mt-2 text-purple-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
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
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <li><button onClick={() => playAudio('report')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">report</button> = relatório</li>
              <li><button onClick={() => playAudio('composition')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">composition</button> = redação</li>
              <li><button onClick={() => playAudio('person')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">person</button> = pessoa</li>
              <li><button onClick={() => playAudio('boring')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">boring</button> = chato</li>
              <li><button onClick={() => playAudio('beautiful')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">beautiful</button> = bonito, bonita</li>
              <li><button onClick={() => playAudio('easy')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">easy</button> = fácil</li>
              <li><button onClick={() => playAudio('hard')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">hard</button> = difícil</li>
              <li><button onClick={() => playAudio('important')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">important</button> = importante</li>
              <li><button onClick={() => playAudio('interesting')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">interesting</button> = interessante</li>
              <li><button onClick={() => playAudio('funny')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">funny</button> = engraçado</li>
              <li><button onClick={() => playAudio('together')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">together</button> = juntos</li>
              <li><button onClick={() => playAudio('everybody')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">everybody</button> = todos, todo mundo</li>
              <li><button onClick={() => playAudio('why')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">why</button> = por quê</li>
              <li><button onClick={() => playAudio('because')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">because</button> = porque</li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">He wants to write a <span className="text-purple-600 font-bold">composition</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele quer escrever uma redação.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She wants to watch a <span className="text-purple-600 font-bold">funny</span> movie.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer assistir um filme engraçado.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I need to write an <span className="text-purple-600 font-bold">important report</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso escrever um relatório importante.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I have an <span className="text-purple-600 font-bold">important</span> meeting today.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu tenho uma reunião importante hoje.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">You work with a great <span className="text-purple-600 font-bold">person</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Vocês trabalham com uma pessoa ótima.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We don't live <span className="text-purple-600 font-bold">together</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Nós não moramos juntos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What do you think about this <span className="text-purple-600 font-bold">class</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa sobre esta aula?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I think it's <span className="text-purple-600 font-bold">good</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu acho que é boa.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I think it's <span className="text-purple-600 font-bold">easy</span> to learn English.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu acho que é fácil aprender inglês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What do you think about this <span className="text-purple-600 font-bold">book</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você acha sobre este livro?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She talks to <span className="text-purple-600 font-bold">everybody</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela conversa com todo mundo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you talk to <span className="text-purple-600 font-bold">everybody</span> at work?</p>
                  <p className="text-sm text-gray-500 mt-1">Você conversa com todos no trabalho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Everybody</span> speaks English here.</p>
                  <p className="text-sm text-gray-500 mt-1">Todos falam inglês aqui.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">USEFUL PHRASES</h2>
              <p className="mt-2 text-purple-100 italic">
                Pratique frases comuns e expressões do dia a dia
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
                <button onClick={() => playAudio('how_do_you_say_banana_in_english')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  How do you say "banana" in English?
                </button>
                <br />
                <span className="text-sm text-gray-500">Como se diz "banana" em inglês?</span>
              </p>
              <p>
                <button onClick={() => playAudio('whats_the_meaning_of_boring')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  What's the meaning of "boring"?
                </button>
                <br />
                <span className="text-sm text-gray-500">O que significa "boring"?</span>
              </p>
              <p>
                <button onClick={() => playAudio('i_think_so')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  I think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que sim.</span>
              </p>
              <p>
                <button onClick={() => playAudio('i_dont_think_so')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">
                  I don't think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que não.</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">How do you say "casa" in <span className="text-purple-600 font-bold">German</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Como se diz "casa" em alemão?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">How do you say "difícil" in <span className="text-purple-600 font-bold">English</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Como se diz "difícil" em inglês?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What's the meaning of "<span className="text-purple-600 font-bold">funny</span>"?</p>
                  <p className="text-sm text-gray-500 mt-1">O que significa "funny"?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">What's the meaning of "<span className="text-purple-600 font-bold">together</span>"?</p>
                  <p className="text-sm text-gray-500 mt-1">O que significa "together"?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you need to study more? <span className="text-purple-600 font-bold">I think so.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você precisa estudar mais? Eu acho que sim.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Is it easy? <span className="text-purple-600 font-bold">I don't think so.</span></p>
                  <p className="text-sm text-gray-500 mt-1">É fácil? Eu acho que não.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill (Why / Because) */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">GRAMMAR</h2>
              <p className="mt-2 text-purple-100 italic">
                Aprenda a usar WHY (por quê) e BECAUSE (porque) para perguntar e responder
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
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-[20px] border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3">WHY? (Por quê?)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Why do you want to watch this movie?</li>
                  <li>Why do they need to work late today?</li>
                  <li>Why does she want to start college next year?</li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-[20px] border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3">BECAUSE (Porque)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Because it's funny.</li>
                  <li>Because they have an important deadline.</li>
                  <li>Because she doesn't have money this year.</li>
                </ul>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Why</span> do you study English?</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você estuda inglês?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-purple-600 font-bold">Because</span> I want to live in the United States.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu quero morar nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Why</span> does he live in Italy?</p>
                  <p className="text-sm text-gray-500 mt-1">Por que ele mora na Itália?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-purple-600 font-bold">Because</span> he studies there.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque ele estuda lá.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Why</span> do you need to study more?</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você precisa estudar mais?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-purple-600 font-bold">Because</span> I have a test tomorrow.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu tenho uma prova amanhã.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Why</span> does he need to go now?</p>
                  <p className="text-sm text-gray-500 mt-1">Por que ele precisa ir agora?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">I need to go now <span className="text-purple-600 font-bold">because</span> it's late.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso ir agora porque está tarde.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Why</span> do you want to read this book?</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você quer ler este livro?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">REAL LIFE PRACTICE</h2>
              <p className="mt-2 text-purple-100 italic">
                Substitua as palavras em azul para praticar em situações reais
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
            <div className="bg-purple-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('i_really_need_to_talk_to_you')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">I really need to talk to <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('you')}>you</span>.</p>
                        <p className="text-sm text-gray-600">Eu preciso muito conversar com você.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('she_talks_to_her_mother_about_everything')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">She talks to her <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('mother')}>mother</span> about everything.</p>
                        <p className="text-sm text-gray-600">Ela conversa com a mãe dela sobre tudo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('my_wife_loves_to_watch_series')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">My wife loves to watch <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('series')}>series</span>.</p>
                        <p className="text-sm text-gray-600">Minha esposa ama assistir séries.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('do_you_like_his_ideas')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Do you like <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('his_ideas')}>his ideas</span>?</p>
                        <p className="text-sm text-gray-600">Você gosta das ideias dele?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('she_doesnt_want_to_talk_about_this_subject')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">She doesn't want to talk about <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('this_subject')}>this subject</span>.</p>
                        <p className="text-sm text-gray-600">Ela não quer falar sobre esse assunto.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('he_doesnt_have_a_math_exam_this_week')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">He doesn't have a math exam <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('this_week')}>this week</span>.</p>
                        <p className="text-sm text-gray-600">Ele não tem prova de matemática esta semana.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('does_he_like_to_talk_about_politics')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">Does he like to talk about <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('politics')}>politics</span>?</p>
                        <p className="text-sm text-gray-600">Ele gosta de falar sobre política?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start">
                      <button onClick={() => playAudio('what_time_does_your_class_start')} className="mr-3 mt-1 text-purple-600 hover:text-purple-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">What time does your class <span className="text-purple-600 font-bold cursor-pointer" onClick={() => playAudio('start')}>start</span>?</p>
                        <p className="text-sm text-gray-600">Que horas sua aula começa?</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/lesson35-reallife1.jpg"
                        alt="Student writing a report"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Writing an important report</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-48 w-full">
                      <Image
                        src="/images/lesson35-reallife2.jpg"
                        alt="People discussing ideas"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Sharing ideas and opinions</p>
                  </div>
                </div>
              </div>

              {/* Prática extra do REAL LIFE que aparece quando clica em Mostrar Prática */}
              {openDrills.realLife && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-purple-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-purple-700 mb-4">More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">I need to talk to <span className="text-purple-600 font-bold">you/her/him</span>.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">She talks to her <span className="text-purple-600 font-bold">father/mother/friend</span>.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">He loves to watch <span className="text-purple-600 font-bold">movies/series/TV</span>.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">Do you like this <span className="text-purple-600 font-bold">idea/book/plan</span>?</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">She doesn't want to talk about <span className="text-purple-600 font-bold">work/school/money</span>.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">He doesn't have a test <span className="text-purple-600 font-bold">today/tomorrow/this week</span>.</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">Does he like to talk about <span className="text-purple-600 font-bold">sports/politics/work</span>?</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">Does it start <span className="text-purple-600 font-bold">now/later/tomorrow</span>?</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">What does he want to <span className="text-purple-600 font-bold">buy/eat/watch</span>?</p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <p className="font-medium">What time does your class <span className="text-purple-600 font-bold">finish/start/begin</span>?</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out! */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
            <p className="mt-2 text-purple-100 italic">
              Revise os pontos principais e expressões essenciais da lição
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-purple-900 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>to talk <span className="font-bold text-purple-300">to</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>to speak <span className="font-bold text-purple-300">with</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>to talk <span className="font-bold text-purple-300">about</span> / speak <span className="font-bold text-purple-300">about</span></p>
              </div>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center gap-3">
              <div className="bg-yellow-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-purple-700">Sorry, I'm late.</span>
                <p className="text-sm text-gray-500 mt-1">Desculpe, estou atrasado.</p>
              </div>
              <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <span className="font-bold text-green-700">No problem. / That's OK.</span>
                <p className="text-sm text-gray-500 mt-1">Não há problema. / Tudo bem.</p>
              </div>
            </div>

            <div className="bg-purple-900 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>on the <span className="font-bold text-purple-300">tablet</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>on the <span className="font-bold text-purple-300">phone</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>The meeting starts at 3:00.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>It starts at 3:00.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-300 text-2xl">•</span>
                <p>What time does it start?</p>
              </div>
            </div>
          </div>

          {/* Prática extra do CHECK IT OUT */}
          <div className="bg-purple-50 p-6 border-t-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">Practice:</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">I talk to my <span className="text-purple-600 font-bold">boss/friend/teacher</span>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">I speak with my <span className="text-purple-600 font-bold">team/manager/client</span>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">We talk about <span className="text-purple-600 font-bold">work/school/life</span>.</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">Sorry, I'm late. → <span className="text-green-600 font-bold">No problem / That's OK</span></p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">The class starts at <span className="text-purple-600 font-bold">8:00/9:00/10:00</span></p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <p className="text-center">What time does it <span className="text-purple-600 font-bold">start/finish</span>?</p>
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
              <span className="text-gray-800">Conjugar os verbos to write e to think</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Vocabulário sobre estudos e opiniões</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar e responder com Why e Because</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Expressar opiniões com I think so / I don't think so</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar significados: What's the meaning of...?</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar como se diz algo: How do you say...?</span>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-lg"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}