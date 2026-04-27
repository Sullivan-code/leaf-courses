"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-amber-600 rounded-lg overflow-hidden shadow-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-amber-600 text-white border-b-2 border-amber-800">
        <h2 className="text-xl font-bold tracking-widest">
          🔍 CHECK IT OUT! - IDIOMATIC EXPRESSIONS
        </h2>
        <div className="flex items-center gap-3">
          <span className="cursor-pointer hover:text-amber-200">≡</span>
          <span className="cursor-pointer hover:text-amber-200">✕</span>
          <span className="cursor-pointer hover:text-amber-200">▶</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 text-sm">
        {/* COLUMN 1 - To turn a blind eye */}
        <div className="bg-amber-100 p-6 space-y-3">
          <p className="font-bold text-amber-800 text-base">👁️ To turn a blind eye</p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To ignore something intentionally</p>
          <p className="text-gray-800 italic">"The teacher turned a blind eye to the student chewing gum."</p>
          <p className="text-gray-600 text-sm">📌 O professor fingiu que não viu o aluno mascando chiclete.</p>
          <hr className="my-2 border-amber-300" />
          <p className="text-gray-800 italic">"Sometimes parents turn a blind eye to their children's mistakes."</p>
          <p className="text-gray-600 text-sm">📌 Às vezes os pais fingem não ver os erros dos filhos.</p>
        </div>

        {/* COLUMN 2 - To bite the bullet */}
        <div className="bg-amber-200 p-6 space-y-3">
          <p className="font-bold text-amber-800 text-base">💪 To bite the bullet</p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To face a difficult situation bravely</p>
          <p className="text-gray-800 italic">"I don't like going to the dentist, but I have to bite the bullet."</p>
          <p className="text-gray-600 text-sm">📌 Eu não gosto de ir ao dentista, mas tenho que encarar.</p>
          <hr className="my-2 border-amber-400" />
          <p className="text-gray-800 italic">"He bit the bullet and apologized for his mistake."</p>
          <p className="text-gray-600 text-sm">📌 Ele criou coragem e se desculpou pelo erro dele.</p>
        </div>

        {/* COLUMN 3 - To bind watch */}
        <div className="bg-amber-300 p-6 space-y-3">
          <p className="font-bold text-amber-800 text-base">⏰ To bind watch</p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To wait and be ready for something</p>
          <p className="text-gray-800 italic">"The security guard bound watch all night."</p>
          <p className="text-gray-600 text-sm">📌 O segurança ficou de guarda a noite toda.</p>
          <hr className="my-2 border-amber-400" />
          <p className="text-gray-800 italic">"We need to bind watch for any suspicious activity."</p>
          <p className="text-gray-600 text-sm">📌 Precisamos ficar atentos para qualquer atividade suspeita.</p>
        </div>
      </div>
    </div>
  );
}

export default function Lesson47() {
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

  const playAudio = (text: string) => {
    const audioMap: Record<string, string> = {
      'to call': 'https://github.com/Sullivan-code/english-audios/raw/main/to-call.mp3',
      'to wait': 'https://github.com/Sullivan-code/english-audios/raw/main/to-wait.mp3',
      'i need to call my father': 'https://github.com/Sullivan-code/english-audios/raw/main/i-need-to-call-my-father.mp3',
      'wait for me': 'https://github.com/Sullivan-code/english-audios/raw/main/wait-for-me.mp3',
      'beverage': 'https://github.com/Sullivan-code/english-audios/raw/main/beverage.mp3',
      'bar': 'https://github.com/Sullivan-code/english-audios/raw/main/bar.mp3',
      'barbecue': 'https://github.com/Sullivan-code/english-audios/raw/main/barbecue.mp3',
      'chef': 'https://github.com/Sullivan-code/english-audios/raw/main/chef.mp3',
      'vegetarian': 'https://github.com/Sullivan-code/english-audios/raw/main/vegetarian.mp3',
      'vegan': 'https://github.com/Sullivan-code/english-audios/raw/main/vegan.mp3',
      'comfortable': 'https://github.com/Sullivan-code/english-audios/raw/main/comfortable.mp3',
      'almost': 'https://github.com/Sullivan-code/english-audios/raw/main/almost.mp3',
      'always': 'https://github.com/Sullivan-code/english-audios/raw/main/always.mp3',
      'often': 'https://github.com/Sullivan-code/english-audios/raw/main/often.mp3',
      'never': 'https://github.com/Sullivan-code/english-audios/raw/main/never.mp3',
      'somebody': 'https://github.com/Sullivan-code/english-audios/raw/main/somebody.mp3',
      'anybody': 'https://github.com/Sullivan-code/english-audios/raw/main/anybody.mp3',
      'how often': 'https://github.com/Sullivan-code/english-audios/raw/main/how-often.mp3',
      "i'm in a hurry": 'https://github.com/Sullivan-code/english-audios/raw/main/im-in-a-hurry.mp3',
      "he's always on time": 'https://github.com/Sullivan-code/english-audios/raw/main/hes-always-on-time.mp3',
      'somebody is upset about this problem': 'https://github.com/Sullivan-code/english-audios/raw/main/somebody-is-upset-about-this-problem.mp3',
      'i need to call my mother now': 'https://github.com/Sullivan-code/english-audios/raw/main/i-need-to-call-my-mother-now.mp3',
      'she always calls me on my birthday': 'https://github.com/Sullivan-code/english-audios/raw/main/she-always-calls-me-on-my-birthday.mp3',
      'i have to wait for my brother here': 'https://github.com/Sullivan-code/english-audios/raw/main/i-have-to-wait-for-my-brother-here.mp3',
      "i'm late so dont wait for me": 'https://github.com/Sullivan-code/english-audios/raw/main/im-late-so-dont-wait-for-me.mp3',
      'dinner is almost ready': 'https://github.com/Sullivan-code/english-audios/raw/main/dinner-is-almost-ready.mp3',
      'i often read books in english': 'https://github.com/Sullivan-code/english-audios/raw/main/i-often-read-books-in-english.mp3',
      'he is never in a hurry': 'https://github.com/Sullivan-code/english-audios/raw/main/he-is-never-in-a-hurry.mp3',
      'how often do you see your cousins': 'https://github.com/Sullivan-code/english-audios/raw/main/how-often-do-you-see-your-cousins.mp3',
      'somebody wants to speak with you': 'https://github.com/Sullivan-code/english-audios/raw/main/somebody-wants-to-speak-with-you.mp3',
      'she doesnt want to see anybody': 'https://github.com/Sullivan-code/english-audios/raw/main/she-doesnt-want-to-see-anybody.mp3',
      'do you know anybody in germany': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-know-anybody-in-germany.mp3',
    };

    const audioUrl = audioMap[text.toLowerCase()];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/restaurant-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Hero Image - Person ordering food delivery */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/images/lesson47-hero.jpg"
              alt="Person ordering food delivery on phone at restaurant table"
              fill
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.backgroundColor = '#f97316';
                  parent.style.backgroundImage = 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop")';
                  parent.style.backgroundSize = 'cover';
                  parent.style.backgroundPosition = 'center';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
              <p className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                🍕 "I need to call the restaurant!" 📞
              </p>
            </div>
          </div>
        </div>

        {/* Título centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🍽️ LESSON 47 – EATING OUT
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a falar sobre restaurantes, fazer pedidos e expressar preferências alimentares! 🍔🥗
          </p>
        </div>

        {/* Seção 1 - Verbs */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1️⃣ VERBS</h2>
              <p className="mt-2 text-orange-100 italic">Clique nos verbos para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-orange-700 hover:bg-orange-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <button onClick={() => playAudio('to call')} className="text-orange-600 font-bold text-lg hover:text-orange-800 transition-colors">
                      to call
                    </button>
                    <span className="text-gray-600">= chamar / ligar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <button onClick={() => playAudio('to wait')} className="text-orange-600 font-bold text-lg hover:text-orange-800 transition-colors">
                      to wait
                    </button>
                    <span className="text-gray-600">= esperar</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl space-y-2">
                <p className="font-medium text-gray-700">Examples:</p>
                <p>
                  <button onClick={() => playAudio('i need to call my father')} className="text-orange-600 hover:text-orange-800">
                    I need to call my father.
                  </button>
                  <span className="text-gray-600 ml-2">Eu preciso ligar para meu pai.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('wait for me')} className="text-orange-600 hover:text-orange-800">
                    Wait for me!
                  </button>
                  <span className="text-gray-600 ml-2">Espere por mim!</span>
                </p>
              </div>
            </div>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-orange-800 mb-4">🔁 PRÁTICA – VERBS</p>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('i call')}>I call.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu chamo.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('they call')}>They call.</p>
                  <p className="text-gray-600 text-sm mt-1">Eles chamam.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('we call')}>We call.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós chamamos.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">She doesn't call. / He doesn't call. / I don't call.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela não liga. / Ele não liga. / Eu não ligo.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">Do you call? / Do you want to call? / need to</p>
                  <p className="text-gray-600 text-sm mt-1">Você liga? / Você quer ligar? / precisa</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('i need to call my father')}>I need to call my father.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu preciso ligar para meu pai.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('i need to call the manager')}>I need to call the manager.</p>
                  <p className="text-gray-600 text-sm mt-1">gerente</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('i need to call the boss')}>I need to call the boss.</p>
                  <p className="text-gray-600 text-sm mt-1">chefe</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">Do you want to call your friend?</p>
                  <p className="text-gray-600 text-sm mt-1">Você quer chamar seu amigo?</p>
                  <p className="text-gray-600 text-sm mt-1">colega de trabalho / colega de classe</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('i wait')}>I wait.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu espero.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('they wait')}>They wait.</p>
                  <p className="text-gray-600 text-sm mt-1">Eles esperam.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('she waits')}>She waits.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela espera.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">I don't wait. / We / You all</p>
                  <p className="text-gray-600 text-sm mt-1">Eu não espero. / Nós / Vocês</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">Do you wait? / Does he / Does she</p>
                  <p className="text-gray-600 text-sm mt-1">Vocês esperam? / Ele / Ela</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('wait for me')}>Wait for me!</p>
                  <p className="text-gray-600 text-sm mt-1">Espere por mim!</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('wait for the students')}>Wait for the students.</p>
                  <p className="text-gray-600 text-sm mt-1">Espere os alunos.</p>
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800 mt-2" onClick={() => playAudio('wait for the bus')}>Wait for the bus.</p>
                  <p className="text-gray-600 text-sm mt-1">Espere o ônibus.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">I wait for my friend at the station.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu espero meu amigo na estação.</p>
                  <p className="text-gray-600 text-sm mt-1">no escritório / no curso</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-blue-600 font-medium">Where do you wait for your husband?</p>
                  <p className="text-gray-600 text-sm mt-1">Onde você espera seu marido?</p>
                  <p className="text-gray-600 text-sm mt-1">sua esposa / seus filhos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">2️⃣ NEW WORDS</h2>
              <p className="mt-2 text-green-100 italic">Clique em cada palavra para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-green-700 hover:bg-green-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><button onClick={() => playAudio('beverage')} className="text-green-600 font-bold hover:text-green-800">beverage</button><span className="text-gray-600 ml-1">= bebida</span></div>
              <div><button onClick={() => playAudio('bar')} className="text-green-600 font-bold hover:text-green-800">bar</button><span className="text-gray-600 ml-1">= bar</span></div>
              <div><button onClick={() => playAudio('barbecue')} className="text-green-600 font-bold hover:text-green-800">barbecue</button><span className="text-gray-600 ml-1">= churrasco</span></div>
              <div><button onClick={() => playAudio('chef')} className="text-green-600 font-bold hover:text-green-800">chef</button><span className="text-gray-600 ml-1">= chefe de cozinha</span></div>
              <div><button onClick={() => playAudio('vegetarian')} className="text-green-600 font-bold hover:text-green-800">vegetarian</button><span className="text-gray-600 ml-1">= vegetariano(a)</span></div>
              <div><button onClick={() => playAudio('vegan')} className="text-green-600 font-bold hover:text-green-800">vegan</button><span className="text-gray-600 ml-1">= vegano(a)</span></div>
              <div><button onClick={() => playAudio('comfortable')} className="text-green-600 font-bold hover:text-green-800">comfortable</button><span className="text-gray-600 ml-1">= confortável</span></div>
              <div><button onClick={() => playAudio('almost')} className="text-green-600 font-bold hover:text-green-800">almost</button><span className="text-gray-600 ml-1">= quase</span></div>
              <div><button onClick={() => playAudio('always')} className="text-green-600 font-bold hover:text-green-800">always</button><span className="text-gray-600 ml-1">= sempre</span></div>
              <div><button onClick={() => playAudio('often')} className="text-green-600 font-bold hover:text-green-800">often</button><span className="text-gray-600 ml-1">= frequentemente</span></div>
              <div><button onClick={() => playAudio('never')} className="text-green-600 font-bold hover:text-green-800">never</button><span className="text-gray-600 ml-1">= nunca</span></div>
              <div><button onClick={() => playAudio('somebody')} className="text-green-600 font-bold hover:text-green-800">somebody</button><span className="text-gray-600 ml-1">= alguém</span></div>
              <div><button onClick={() => playAudio('anybody')} className="text-green-600 font-bold hover:text-green-800">anybody</button><span className="text-gray-600 ml-1">= alguém, ninguém, qualquer um</span></div>
              <div><button onClick={() => playAudio('so')} className="text-green-600 font-bold hover:text-green-800">so</button><span className="text-gray-600 ml-1">= então, tão, depois</span></div>
              <div><button onClick={() => playAudio('how often')} className="text-green-600 font-bold hover:text-green-800">how often</button><span className="text-gray-600 ml-1">= com que frequência</span></div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-green-800 mb-4">🔁 PRÁTICA – NEW WORDS</p>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">This house is very comfortable.</p>
                  <p className="text-gray-600 text-sm mt-1">Esta casa é muito confortável.</p>
                  <p className="text-gray-600 text-sm mt-1">Este apartamento / Este restaurante</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">I rarely buy beverages here.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu raramente compro bebidas aqui.</p>
                  <p className="text-gray-600 text-sm mt-1">lanches / milk-shake</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">We want to have a snack.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós queremos fazer um lanche.</p>
                  <p className="text-gray-600 text-sm mt-1">um churrasco / tomar sorvete</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('how often do you have a barbecue')}>How often do you have a barbecue?</p>
                  <p className="text-gray-600 text-sm mt-1">Com que frequência você faz um churrasco?</p>
                  <p className="text-gray-600 text-sm mt-1">come sobremesa / toma sorvete</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">How often do you call your parents?</p>
                  <p className="text-gray-600 text-sm mt-1">Com que frequência você liga para seus pais?</p>
                  <p className="text-gray-600 text-sm mt-1">avós / parentes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">I always go to the bar with my friends.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu sempre vou ao bar com meus amigos.</p>
                  <p className="text-gray-600 text-sm mt-1">frequentemente / às vezes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">He never calls the chef.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele nunca chama o chefe de cozinha.</p>
                  <p className="text-gray-600 text-sm mt-1">sempre / às vezes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('im a vegan')}>I'm a vegan.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu sou vegana.</p>
                  <p className="text-gray-600 text-sm mt-1">vegetariana / Ela é</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium">I'm a vegan, so I never eat meat.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu sou vegano, então eu nunca como carne.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele é / Ela é</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('shes almost ready')}>She's almost ready.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela está quase pronta.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('dinner is almost ready')}>The dish is almost ready.</p>
                  <p className="text-gray-600 text-sm mt-1">O prato está quase pronto.</p>
                  <p className="text-gray-600 text-sm mt-1">A sobremesa / A pizza</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3️⃣ USEFUL PHRASES</h2>
              <p className="mt-2 text-purple-100 italic">Frases úteis para o dia a dia</p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-purple-700 hover:bg-purple-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio("i'm in a hurry")} className="text-purple-600 hover:text-purple-800">
                  I'm in a hurry.
                </button>
                <span className="text-gray-600 ml-2">Estou com pressa.</span>
              </p>
              <p>
                <button onClick={() => playAudio("hurry up")} className="text-purple-600 hover:text-purple-800">
                  Hurry up! We're late.
                </button>
                <span className="text-gray-600 ml-2">Apresse-se! Nós estamos atrasados.</span>
              </p>
              <p>
                <button onClick={() => playAudio("he's always on time")} className="text-purple-600 hover:text-purple-800">
                  He's always on time.
                </button>
                <span className="text-gray-600 ml-2">Ele está sempre no horário.</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-purple-800 mb-4">🔁 PRÁTICA – USEFUL PHRASES</p>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">Are you in a hurry?</p>
                  <p className="text-gray-600 text-sm mt-1">Você está com pressa?</p>
                  <p className="text-gray-600 text-sm mt-1">Eles / Por quê</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">He isn't in a hurry today.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele não está com pressa hoje.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">Hurry up! We have to go now.</p>
                  <p className="text-gray-600 text-sm mt-1">Apresse-se! Nós temos que ir agora.</p>
                  <p className="text-gray-600 text-sm mt-1">pegar o táxi / o ônibus</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">Are you on time?</p>
                  <p className="text-gray-600 text-sm mt-1">Você está no horário?</p>
                  <p className="text-gray-600 text-sm mt-1">Eles / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">The chef is always on time.</p>
                  <p className="text-gray-600 text-sm mt-1">O chefe de cozinha está sempre no horário.</p>
                  <p className="text-gray-600 text-sm mt-1">O garçom / O gerente</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">I'm in a hurry to go to the airport.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu estou com pressa para ir ao aeroporto.</p>
                  <p className="text-gray-600 text-sm mt-1">escritório / banco</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-blue-600 font-medium">He is always on time.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele sempre está no horário.</p>
                  <p className="text-gray-600 text-sm mt-1">geralmente / nunca</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">4️⃣ GRAMMAR - Somebody / Anybody</h2>
              <p className="mt-2 text-teal-100 italic">somebody = alguém (afirmações) | anybody = alguém/ninguém (perguntas/negativas)</p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-teal-700 hover:bg-teal-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Examples:</p>
                <p>
                  <button onClick={() => playAudio('somebody is upset about this problem')} className="text-teal-600 hover:text-teal-800">
                    Somebody is upset about this problem.
                  </button>
                  <span className="text-gray-600 ml-2">Alguém está chateado com esse problema.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('we need somebody to make dinner')} className="text-teal-600 hover:text-teal-800">
                    We need somebody to make their dinner.
                  </button>
                  <span className="text-gray-600 ml-2">Nós precisamos de alguém para fazer o jantar deles.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('i dont know anybody here')} className="text-teal-600 hover:text-teal-800">
                    I don't know anybody here.
                  </button>
                  <span className="text-gray-600 ml-2">Eu não conheço ninguém aqui.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('does anybody speak english here')} className="text-teal-600 hover:text-teal-800">
                    Does anybody speak English here?
                  </button>
                  <span className="text-gray-600 ml-2">Alguém fala inglês aqui?</span>
                </p>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-teal-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-teal-800 mb-4">🔁 PRÁTICA – GRAMMAR</p>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">Somebody needs to call the chef.</p>
                  <p className="text-gray-600 text-sm mt-1">Alguém precisa chamar o chefe de cozinha.</p>
                  <p className="text-gray-600 text-sm mt-1">o gerente / o vendedor</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">I want to talk to somebody.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu quero falar com alguém.</p>
                  <p className="text-gray-600 text-sm mt-1">sobre o problema / sobre o relatório</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">I have to meet somebody at the airport.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu tenho que encontrar alguém no aeroporto.</p>
                  <p className="text-gray-600 text-sm mt-1">na estação de trem / de metrô</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">Do you know anybody there?</p>
                  <p className="text-gray-600 text-sm mt-1">Você conhece alguém lá?</p>
                  <p className="text-gray-600 text-sm mt-1">nos Estados Unidos / no Reino Unido</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">Do you need to visit anybody today?</p>
                  <p className="text-gray-600 text-sm mt-1">Você precisa visitar alguém hoje?</p>
                  <p className="text-gray-600 text-sm mt-1">ver / falar com</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">Is he in a hurry? / Is anybody in a hurry?</p>
                  <p className="text-gray-600 text-sm mt-1">Ele está com pressa? / Alguém está com pressa?</p>
                  <p className="text-gray-600 text-sm mt-1">com sede / com fome</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium cursor-pointer hover:text-blue-800" onClick={() => playAudio('i dont know anybody here')}>I don't know anybody here.</p>
                  <p className="text-gray-600 text-sm mt-1">Eu não conheço ninguém aqui.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela / Ele</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">He doesn't want to call anybody.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele não quer ligar para ninguém.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela / Eles</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">They don't need to wait for anybody.</p>
                  <p className="text-gray-600 text-sm mt-1">Eles não precisam esperar ninguém.</p>
                  <p className="text-gray-600 text-sm mt-1">Você / Ela</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-teal-200">
                  <p className="text-blue-600 font-medium">You know somebody here, I'm sure.</p>
                  <p className="text-gray-600 text-sm mt-1">Você conhece alguém aqui, eu tenho certeza.</p>
                  <p className="text-gray-600 text-sm mt-1">não conhece</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-rose-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">5️⃣ REAL LIFE</h2>
              <p className="mt-2 text-rose-100 italic">Pratique com situações reais do dia a dia</p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-rose-700 hover:bg-rose-800 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <p>
                <button onClick={() => playAudio('i need to call my mother now')} className="text-rose-600 hover:text-rose-800">
                  I need to call my mother now.
                </button>
                <span className="text-gray-600 block text-sm">Eu preciso ligar para minha mãe agora.</span>
              </p>
              <p>
                <button onClick={() => playAudio('she always calls me on my birthday')} className="text-rose-600 hover:text-rose-800">
                  She always calls me on my birthday.
                </button>
                <span className="text-gray-600 block text-sm">Ela sempre me liga no meu aniversário.</span>
              </p>
              <p>
                <button onClick={() => playAudio('call your father')} className="text-rose-600 hover:text-rose-800">
                  Call your father. He is worried.
                </button>
                <span className="text-gray-600 block text-sm">Ligue para seu pai. Ele está preocupado.</span>
              </p>
              <p>
                <button onClick={() => playAudio('i have to wait for my brother here')} className="text-rose-600 hover:text-rose-800">
                  I have to wait for my brother here.
                </button>
                <span className="text-gray-600 block text-sm">Eu tenho que esperar pelo meu irmão aqui.</span>
              </p>
              <p>
                <button onClick={() => playAudio("i'm late so dont wait for me")} className="text-rose-600 hover:text-rose-800">
                  I'm late, so don't wait for me.
                </button>
                <span className="text-gray-600 block text-sm">Eu estou atrasado, então não espere por mim.</span>
              </p>
              <p>
                <button onClick={() => playAudio('dinner is almost ready')} className="text-rose-600 hover:text-rose-800">
                  Dinner is almost ready.
                </button>
                <span className="text-gray-600 block text-sm">O jantar está quase pronto.</span>
              </p>
              <p>
                <button onClick={() => playAudio('i often read books in english')} className="text-rose-600 hover:text-rose-800">
                  I often read books in English.
                </button>
                <span className="text-gray-600 block text-sm">Eu frequentemente leio livros em inglês.</span>
              </p>
              <p>
                <button onClick={() => playAudio('he is never in a hurry')} className="text-rose-600 hover:text-rose-800">
                  He is never in a hurry.
                </button>
                <span className="text-gray-600 block text-sm">Ele nunca está com pressa.</span>
              </p>
              <p>
                <button onClick={() => playAudio('how often do you see your cousins')} className="text-rose-600 hover:text-rose-800">
                  How often do you see your cousins?
                </button>
                <span className="text-gray-600 block text-sm">Com que frequência você vê seus primos?</span>
              </p>
              <p>
                <button onClick={() => playAudio('somebody wants to speak with you')} className="text-rose-600 hover:text-rose-800">
                  Somebody wants to speak with you.
                </button>
                <span className="text-gray-600 block text-sm">Alguém quer falar com você.</span>
              </p>
              <p>
                <button onClick={() => playAudio('she doesnt want to see anybody')} className="text-rose-600 hover:text-rose-800">
                  She doesn't want to see anybody.
                </button>
                <span className="text-gray-600 block text-sm">Ela não quer ver ninguém.</span>
              </p>
              <p>
                <button onClick={() => playAudio('do you know anybody in germany')} className="text-rose-600 hover:text-rose-800">
                  Do you know anybody in Germany?
                </button>
                <span className="text-gray-600 block text-sm">Você conhece alguém na Alemanha?</span>
              </p>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out Horizontal */}
        <div className="bg-white border-2 border-amber-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
            <p className="mt-2 text-amber-100 italic">
              Aprenda expressões idiomáticas em inglês!
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson46")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson48")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>

        {/* Credits */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson 47: Eating Out • Restaurant Vocabulary & Real Life Conversations</p>
          <p className="text-xs mt-1">🍽️ "I need to call the restaurant!" - Practice real-life dining situations!</p>
        </div>
      </div>
    </div>
  );
}