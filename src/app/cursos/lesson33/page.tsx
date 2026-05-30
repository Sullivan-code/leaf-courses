"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">
          CHECK IT OUT!
        </h2>

        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        {/* COLUMN 1 */}
        <div className="bg-cyan-200 p-6 space-y-3">
          <p className="text-gray-800">• to go <strong className="text-blue-700">to the U.S.A.</strong></p>
          <p className="text-gray-800">• to study <strong className="text-blue-700">in the U.S.A.</strong></p>
        </div>

        {/* COLUMN 2 */}
        <div className="bg-purple-500 text-white p-6 space-y-3">
          <p>• at work</p>
          <p>• at home</p>
          <p>• at school</p>
        </div>

        {/* COLUMN 3 */}
        <div className="bg-white p-6 space-y-3">
          <p className="text-gray-800">• They live…</p>
          <p className="text-gray-800">• My parents live…</p>
          <p className="text-gray-800">• We speak…</p>
          <p className="text-gray-800">• My sister and I speak…</p>
        </div>

        {/* COLUMN 4 */}
        <div className="bg-sky-300 p-6 flex items-center justify-center font-semibold text-gray-800">
          class → classes
        </div>
      </div>
    </div>
  );
}

export default function Lesson33() {
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

  // Female voice text-to-speech function using browser's SpeechSynthesis API
  const playAudio = (text: string) => {
    if (!text || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    // Try to find a female voice
    const setFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Look for female voices (common patterns)
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Susan') ||
        voice.name.toLowerCase().includes('female') ||
        (voice.lang === 'en-US' && voice.name.includes('Female'))
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    };
    
    // Voices might not be loaded yet
    if (window.speechSynthesis.getVoices().length > 0) {
      setFemaleVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  };

  // Helper to create practice phrase with click handler
  const PracticePhrase = ({ english, variations, onClick }: { english: string; variations?: string; onClick?: () => void }) => (
    <div 
      className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
      onClick={() => playAudio(english)}
    >
      <p className="text-lg font-medium text-gray-800">
        <span className="text-blue-600 font-bold">{english}</span>
        {variations && <span className="text-gray-600 ml-2">{variations}</span>}
      </p>
    </div>
  );

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l7-bgg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 33 – VERBS & CONVERSATION
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda verbos essenciais para conversar sobre diversos assuntos! 🗣️
          </p>
        </div>

        {/* Seção 1 - Verbs */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1️⃣ VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>
                    <button 
                      onClick={() => playAudio('to talk to')} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      to talk (to)
                    </button> = conversar / falar com
                  </li>

                  <li>
                    <button 
                      onClick={() => playAudio('to watch')} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      to watch
                    </button> = assistir
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                <p className="font-medium text-gray-700">Examples:</p>
                <p>
                  <button onClick={() => playAudio('I need to talk to you.')} className="text-blue-600 hover:text-blue-800">
                    I need to talk to you.
                  </button>
                  <span className="text-gray-600 ml-2">Eu preciso conversar com você.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('She talks to her friends every day.')} className="text-blue-600 hover:text-blue-800">
                    She talks to her friends every day.
                  </button>
                  <span className="text-gray-600 ml-2">Ela conversa com os amigos todos os dias.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('He likes to talk about sports.')} className="text-blue-600 hover:text-blue-800">
                    He likes to talk about sports.
                  </button>
                  <span className="text-gray-600 ml-2">Ele gosta de falar sobre esportes.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('We watch videos on our phones.')} className="text-blue-600 hover:text-blue-800">
                    We watch videos on our phones.
                  </button>
                  <span className="text-gray-600 ml-2">Nós assistimos vídeos em nossos celulares.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('They want to watch a movie tonight.')} className="text-blue-600 hover:text-blue-800">
                    They want to watch a movie tonight.
                  </button>
                  <span className="text-gray-600 ml-2">Eles querem assistir um filme hoje à noite.</span>
                </p>
              </div>
            </div>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – VERBS</p>
                
                <PracticePhrase english="I need to talk to you." variations=" / They need to talk to you. / We need to talk to you." />
                <PracticePhrase english="What do you want to watch now?" variations=" / today / tonight" />
                <PracticePhrase english="You like to talk to me." variations=" / with him / with her" />
                <PracticePhrase english="I like to talk about sports." variations=" / politics / science" />
                <PracticePhrase english="We watch videos on our phones." variations=" / on TV / on the tablet" />
                <PracticePhrase english="Do you want to watch this movie with me?" variations=" / this series / this video" />
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">2️⃣ NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir a pronúncia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div><button onClick={() => playAudio('science')} className="text-blue-600 font-bold hover:text-blue-800">science</button> = ciência</div>
              <div><button onClick={() => playAudio('religion')} className="text-blue-600 font-bold hover:text-blue-800">religion</button> = religião</div>
              <div><button onClick={() => playAudio('politics')} className="text-blue-600 font-bold hover:text-blue-800">politics</button> = política</div>
              <div><button onClick={() => playAudio('music')} className="text-blue-600 font-bold hover:text-blue-800">music</button> = música</div>
              <div><button onClick={() => playAudio('sports')} className="text-blue-600 font-bold hover:text-blue-800">sports</button> = esportes</div>
              <div><button onClick={() => playAudio('fashion')} className="text-blue-600 font-bold hover:text-blue-800">fashion</button> = moda</div>
              <div><button onClick={() => playAudio('life')} className="text-blue-600 font-bold hover:text-blue-800">life</button> = vida</div>
              <div><button onClick={() => playAudio('stuff')} className="text-blue-600 font-bold hover:text-blue-800">stuff</button> = coisas</div>
              <div><button onClick={() => playAudio('idea')} className="text-blue-600 font-bold hover:text-blue-800">idea</button> = ideia</div>
              <div><button onClick={() => playAudio('opinion')} className="text-blue-600 font-bold hover:text-blue-800">opinion</button> = opinião</div>
              <div><button onClick={() => playAudio('problem')} className="text-blue-600 font-bold hover:text-blue-800">problem</button> = problema</div>
              <div><button onClick={() => playAudio('series')} className="text-blue-600 font-bold hover:text-blue-800">series</button> = série</div>
              <div><button onClick={() => playAudio('movie')} className="text-blue-600 font-bold hover:text-blue-800">movie</button> = filme</div>
              <div><button onClick={() => playAudio('video')} className="text-blue-600 font-bold hover:text-blue-800">video</button> = vídeo</div>
              <div><button onClick={() => playAudio('it')} className="text-blue-600 font-bold hover:text-blue-800">it</button> = ele / ela / neutro</div>
              <div><button onClick={() => playAudio('his')} className="text-blue-600 font-bold hover:text-blue-800">his</button> = dele</div>
              <div><button onClick={() => playAudio('her')} className="text-blue-600 font-bold hover:text-blue-800">her</button> = dela</div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – NEW WORDS</p>
                
                <PracticePhrase english="She likes to talk about sports." variations=" / fashion / religion" />
                <PracticePhrase english="I don't want to talk about my life." variations=" / this problem / this movie" />
                <PracticePhrase english="I watch videos on my phone." variations=" / series / movies" />
                <PracticePhrase english="Do you want to watch this movie with me?" variations=" / this series / this video" />
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3️⃣ USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Frases úteis para o dia a dia
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-3 mb-6">
              <p><button onClick={() => playAudio('I want to meet my friends tonight.')} className="text-blue-600 hover:text-blue-800">I want to meet my friends tonight.</button><span className="text-gray-600 ml-2">Eu quero encontrar meus amigos hoje à noite.</span></p>
              <p><button onClick={() => playAudio('Where does he want to go tonight?')} className="text-blue-600 hover:text-blue-800">Where does he want to go tonight?</button><span className="text-gray-600 ml-2">Onde ele quer ir hoje à noite?</span></p>
              <p><button onClick={() => playAudio('He wants to meet his friends tonight.')} className="text-blue-600 hover:text-blue-800">He wants to meet his friends tonight.</button><span className="text-gray-600 ml-2">Ele quer encontrar os amigos dele hoje à noite.</span></p>
              <p><button onClick={() => playAudio("I don't have an opinion about it.")} className="text-blue-600 hover:text-blue-800">I don't have an opinion about it.</button><span className="text-gray-600 ml-2">Eu não tenho uma opinião sobre isso.</span></p>
              <p><button onClick={() => playAudio('Do you have an opinion about this problem?')} className="text-blue-600 hover:text-blue-800">Do you have an opinion about this problem?</button><span className="text-gray-600 ml-2">Você tem uma opinião sobre esse problema?</span></p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – USEFUL PHRASES</p>
                
                <PracticePhrase english="We don't stay at home during the week." variations=" / here / there" />
                <PracticePhrase english="Sometimes I study on Sundays." variations=" / do the laundry / clean the house" />
                <PracticePhrase english="Do you have an opinion about this problem?" variations=" / subject / course" />
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">4️⃣ GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Present Simple - Examples
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Affirmative:</p>
                <p><button onClick={() => playAudio('He watches videos on his tablet.')} className="text-blue-600 hover:text-blue-800">He watches videos on his tablet.</button><span className="text-gray-600 ml-2">Ele assiste vídeos no tablet dele.</span></p>
                <p><button onClick={() => playAudio('She has great ideas.')} className="text-blue-600 hover:text-blue-800">She has great ideas.</button><span className="text-gray-600 ml-2">Ela tem ótimas ideias.</span></p>
                <p><button onClick={() => playAudio("It starts at ten o'clock.")} className="text-blue-600 hover:text-blue-800">It starts at ten o'clock.</button><span className="text-gray-600 ml-2">Começa às dez horas.</span></p>
              </div>
              
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Negative:</p>
                <p><button onClick={() => playAudio("She doesn't live with her parents.")} className="text-blue-600 hover:text-blue-800">She doesn't live with her parents.</button><span className="text-gray-600 ml-2">Ela não mora com os pais.</span></p>
                <p><button onClick={() => playAudio("He doesn't study music at the university.")} className="text-blue-600 hover:text-blue-800">He doesn't study music at the university.</button><span className="text-gray-600 ml-2">Ele não estuda música na universidade.</span></p>
                <p><button onClick={() => playAudio("It doesn't finish this week.")} className="text-blue-600 hover:text-blue-800">It doesn't finish this week.</button><span className="text-gray-600 ml-2">Não termina esta semana.</span></p>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <p className="font-medium text-gray-700">Questions:</p>
                <p><button onClick={() => playAudio('Does she want to learn more about sports?')} className="text-blue-600 hover:text-blue-800">Does she want to learn more about sports?</button><span className="text-gray-600 ml-2">Ela quer aprender mais sobre esportes?</span></p>
                <p><button onClick={() => playAudio('Does he like to talk about his life?')} className="text-blue-600 hover:text-blue-800">Does he like to talk about his life?</button><span className="text-gray-600 ml-2">Ele gosta de falar sobre a vida dele?</span></p>
                <p><button onClick={() => playAudio('What time does it start?')} className="text-blue-600 hover:text-blue-800">What time does it start?</button><span className="text-gray-600 ml-2">A que horas começa?</span></p>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – GRAMMAR</p>
                
                <PracticePhrase english="She likes to talk about sports." variations=" / wants / prefers" />
                <PracticePhrase english="He doesn't understand this subject." variations=" / this word / this language" />
                <PracticePhrase english="What time does the meeting start?" variations=" / the movie / the class" />
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">5️⃣ REAL LIFE</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique com situações reais
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-3 mb-6">
              <p><button onClick={() => playAudio('I really need to talk to you.')} className="text-blue-600 hover:text-blue-800">I really need to talk to you.</button><span className="text-gray-600 ml-2">Eu realmente preciso conversar com você.</span></p>
              <p><button onClick={() => playAudio('She talks to her mother about everything.')} className="text-blue-600 hover:text-blue-800">She talks to her mother about everything.</button><span className="text-gray-600 ml-2">Ela conversa com a mãe dela sobre tudo.</span></p>
              <p><button onClick={() => playAudio('My wife loves to watch series.')} className="text-blue-600 hover:text-blue-800">My wife loves to watch series.</button><span className="text-gray-600 ml-2">Minha esposa adora assistir séries.</span></p>
              <p><button onClick={() => playAudio('Do you like his ideas?')} className="text-blue-600 hover:text-blue-800">Do you like his ideas?</button><span className="text-gray-600 ml-2">Você gosta das ideias dele?</span></p>
              <p><button onClick={() => playAudio("She doesn't want to talk about this subject.")} className="text-blue-600 hover:text-blue-800">She doesn't want to talk about this subject.</button><span className="text-gray-600 ml-2">Ela não quer falar sobre esse assunto.</span></p>
              <p><button onClick={() => playAudio("He doesn't have a math exam this week.")} className="text-blue-600 hover:text-blue-800">He doesn't have a math exam this week.</button><span className="text-gray-600 ml-2">Ele não tem prova de matemática esta semana.</span></p>
              <p><button onClick={() => playAudio("It doesn't start today.")} className="text-blue-600 hover:text-blue-800">It doesn't start today.</button><span className="text-gray-600 ml-2">Não começa hoje.</span></p>
              <p><button onClick={() => playAudio('Does he like to talk about politics?')} className="text-blue-600 hover:text-blue-800">Does he like to talk about politics?</button><span className="text-gray-600 ml-2">Ele gosta de falar sobre política?</span></p>
              <p><button onClick={() => playAudio('Does it finish in an hour?')} className="text-blue-600 hover:text-blue-800">Does it finish in an hour?</button><span className="text-gray-600 ml-2">Termina em uma hora?</span></p>
              <p><button onClick={() => playAudio('What stuff does he want to buy?')} className="text-blue-600 hover:text-blue-800">What stuff does he want to buy?</button><span className="text-gray-600 ml-2">Que coisas ele quer comprar?</span></p>
              <p><button onClick={() => playAudio('What time does your class start?')} className="text-blue-600 hover:text-blue-800">What time does your class start?</button><span className="text-gray-600 ml-2">Que horas sua aula começa?</span></p>
              <p><button onClick={() => playAudio('How many languages does your sister speak?')} className="text-blue-600 hover:text-blue-800">How many languages does your sister speak?</button><span className="text-gray-600 ml-2">Quantos idiomas sua irmã fala?</span></p>
            </div>
            
            {openDrills.realLife && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – REAL LIFE</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    Pratique substituindo as palavras em azul nas frases acima com diferentes termos para criar novas frases!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 6 - Check It Out Horizontal */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratique estruturas essenciais com "to go to" e preposições
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}