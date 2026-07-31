"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

// ============================================
// TEXT-TO-SPEECH FUNCTION - FEMININE VOICE
// ============================================

const speakWithFemaleVoice = (text: string, rate: number = 0.9, pitch: number = 1.1) => {
  if (!window.speechSynthesis) {
    console.warn("Browser doesn't support speech synthesis");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;

  // Try to find a female voice
  const voices = window.speechSynthesis.getVoices();
  
  // List of female voice names (common across browsers)
  const femaleVoicePatterns = [
    'Samantha',    // MacOS
    'Google UK English Female', // Chrome
    'Microsoft Zira', // Windows
    'Microsoft Hazel', // Windows
    'Victoria',    // Some systems
    'Karen',       // Some systems
    'Female',      // Generic
    'Amy',         // Some systems
    'Siri',        // Some systems
    'Allison'      // Some systems
  ];

  let selectedVoice = voices.find(voice => 
    femaleVoicePatterns.some(pattern => 
      voice.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  // If no female voice found, try to find any English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.lang.includes('US')
    );
  }

  // If still no voice found, use the first available
  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices[0];
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
  }

  utterance.onerror = (event) => {
    console.error('Speech error:', event);
  };

  window.speechSynthesis.speak(utterance);
};

// ============================================
// COMPONENTE DE TEXTO COM ÁUDIO
// ============================================

interface SpeakableTextProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

const SpeakableText = ({ text, className = "", children }: SpeakableTextProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (text?.trim()) {
      speakWithFemaleVoice(text);
    }
  };

  return (
    <span 
      onClick={handleClick}
      className={`cursor-pointer hover:text-blue-600 transition-colors duration-200 ${className}`}
      title={`Click to listen: ${text}`}
    >
      {children || text}
    </span>
  );
};

function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-blue-600 rounded-lg overflow-hidden shadow-lg">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white border-b-2 border-blue-800">
        <h2 className="text-xl font-bold tracking-widest">
          🔍 WRAP UP! - IDIOMATIC EXPRESSIONS
        </h2>
        <div className="flex items-center gap-3">
          <span className="cursor-pointer hover:text-blue-200">≡</span>
          <span className="cursor-pointer hover:text-blue-200">✕</span>
          <span className="cursor-pointer hover:text-blue-200">▶</span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 text-sm">
        {/* COLUMN 1 - To turn a blind eye */}
        <div className="bg-blue-50 p-6 space-y-3">
          <p className="font-bold text-blue-800 text-base">
            <SpeakableText text="To turn a blind eye" className="text-blue-800 hover:text-blue-600" />
          </p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To ignore something intentionally</p>
          <p className="text-gray-800 italic">
            "<SpeakableText text="The teacher turned a blind eye to the student chewing gum." className="text-gray-800" />"
          </p>
          <p className="text-gray-600 text-sm">📌 O professor fingiu que não viu o aluno mascando chiclete.</p>
          <hr className="my-2 border-blue-300" />
          <p className="text-gray-800 italic">
            "<SpeakableText text="Sometimes parents turn a blind eye to their children's mistakes." className="text-gray-800" />"
          </p>
          <p className="text-gray-600 text-sm">📌 Às vezes os pais fingem não ver os erros dos filhos.</p>
        </div>

        {/* COLUMN 2 - To bite the bullet */}
        <div className="bg-blue-100 p-6 space-y-3">
          <p className="font-bold text-blue-800 text-base">
            <SpeakableText text="To bite the bullet" className="text-blue-800 hover:text-blue-600" />
          </p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To face a difficult situation bravely</p>
          <p className="text-gray-800 italic">
            "<SpeakableText text="I don't like going to the dentist, but I have to bite the bullet." className="text-gray-800" />"
          </p>
          <p className="text-gray-600 text-sm">📌 Eu não gosto de ir ao dentista, mas tenho que encarar.</p>
          <hr className="my-2 border-blue-400" />
          <p className="text-gray-800 italic">
            "<SpeakableText text="He bit the bullet and apologized for his mistake." className="text-gray-800" />"
          </p>
          <p className="text-gray-600 text-sm">📌 Ele criou coragem e se desculpou pelo erro dele.</p>
        </div>

        {/* COLUMN 3 - To bind watch */}
        <div className="bg-blue-200 p-6 space-y-3">
          <p className="font-bold text-blue-800 text-base">
            <SpeakableText text="To bind watch" className="text-blue-800 hover:text-blue-600" />
          </p>
          <p className="text-gray-700"><span className="font-semibold">Meaning:</span> To wait and be ready for something</p>
          <p className="text-gray-800 italic">
            "<SpeakableText text="The security guard bound watch all night." className="text-gray-800" />"
          </p>
          <p className="text-gray-600 text-sm">📌 O segurança ficou de guarda a noite toda.</p>
          <hr className="my-2 border-blue-400" />
          <p className="text-gray-800 italic">
            "<SpeakableText text="We need to bind watch for any suspicious activity." className="text-gray-800" />"
          </p>
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

  // Load voices on component mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
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
                  parent.style.backgroundColor = '#1e40af';
                  parent.style.backgroundImage = 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop")';
                  parent.style.backgroundSize = 'cover';
                  parent.style.backgroundPosition = 'center';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
              <p className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                🍕 <SpeakableText text="I need to call the restaurant!" className="text-white hover:text-yellow-200" /> 📞
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
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1️⃣ VERBS</h2>
              <p className="mt-2 text-blue-100 italic">Clique nas palavras em inglês para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <SpeakableText text="to call" className="text-blue-600 font-bold text-lg hover:text-blue-800" />
                    <span className="text-gray-600">= chamar / ligar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <SpeakableText text="to wait" className="text-blue-600 font-bold text-lg hover:text-blue-800" />
                    <span className="text-gray-600">= esperar</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – VERBS</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I call." className="text-blue-600 font-medium hover:text-blue-800" />
                  <p className="text-gray-600 text-sm mt-1">Eu chamo.</p>
                  <SpeakableText text="They call." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Eles chamam.</p>
                  <SpeakableText text="We call." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Nós chamamos.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-blue-600 font-medium">
                    <SpeakableText text="She doesn't call." className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="He doesn't call." className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="I don't call." className="text-blue-600 hover:text-blue-800" />
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Ela não liga. / Ele não liga. / Eu não ligo.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-blue-600 font-medium">
                    <SpeakableText text="Do you call?" className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="Do you want to call?" className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="need to" className="text-blue-600 hover:text-blue-800" />
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Você liga? / Você quer ligar? / precisa</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I need to call my father." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu preciso ligar para meu pai.</p>
                  <SpeakableText text="I need to call the manager." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">gerente</p>
                  <SpeakableText text="I need to call the boss." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">chefe</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Do you want to call your friend?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você quer chamar seu amigo?</p>
                  <p className="text-gray-600 text-sm mt-1">colega de trabalho / colega de classe</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I wait." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu espero.</p>
                  <SpeakableText text="They wait." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Eles esperam.</p>
                  <SpeakableText text="She waits." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Ela espera.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-blue-600 font-medium">
                    <SpeakableText text="I don't wait." className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="We" className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="You all" className="text-blue-600 hover:text-blue-800" />
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Eu não espero. / Nós / Vocês</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-blue-600 font-medium">
                    <SpeakableText text="Do you wait?" className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="Does he" className="text-blue-600 hover:text-blue-800" /> / <SpeakableText text="Does she" className="text-blue-600 hover:text-blue-800" />
                  </p>
                  <p className="text-gray-600 text-sm mt-1">Vocês esperam? / Ele / Ela</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Wait for me!" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Espere por mim!</p>
                  <SpeakableText text="Wait for the students." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Espere os alunos.</p>
                  <SpeakableText text="Wait for the bus." className="text-blue-600 font-medium hover:text-blue-800 mt-2 block" />
                  <p className="text-gray-600 text-sm mt-1">Espere o ônibus.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I wait for my friend at the station." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu espero meu amigo na estação.</p>
                  <p className="text-gray-600 text-sm mt-1">no escritório / no curso</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Where do you wait for your husband?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Onde você espera seu marido?</p>
                  <p className="text-gray-600 text-sm mt-1">sua esposa / seus filhos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">2️⃣ NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">Clique nas palavras em inglês para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div><SpeakableText text="beverage" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= bebida</span></div>
              <div><SpeakableText text="bar" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= bar</span></div>
              <div><SpeakableText text="barbecue" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= churrasco</span></div>
              <div><SpeakableText text="chef" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= chefe de cozinha</span></div>
              <div><SpeakableText text="vegetarian" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= vegetariano(a)</span></div>
              <div><SpeakableText text="vegan" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= vegano(a)</span></div>
              <div><SpeakableText text="comfortable" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= confortável</span></div>
              <div><SpeakableText text="almost" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= quase</span></div>
              <div><SpeakableText text="always" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= sempre</span></div>
              <div><SpeakableText text="often" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= frequentemente</span></div>
              <div><SpeakableText text="never" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= nunca</span></div>
              <div><SpeakableText text="somebody" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= alguém</span></div>
              <div><SpeakableText text="anybody" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= alguém, ninguém, qualquer um</span></div>
              <div><SpeakableText text="so" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= então, tão, depois</span></div>
              <div><SpeakableText text="how often" className="text-blue-600 font-bold hover:text-blue-800" /><span className="text-gray-600 ml-1">= com que frequência</span></div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – NEW WORDS</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="This house is very comfortable." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Esta casa é muito confortável.</p>
                  <p className="text-gray-600 text-sm mt-1">Este apartamento / Este restaurante</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I rarely buy beverages here." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu raramente compro bebidas aqui.</p>
                  <p className="text-gray-600 text-sm mt-1">lanches / milk-shake</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="We want to have a snack." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Nós queremos fazer um lanche.</p>
                  <p className="text-gray-600 text-sm mt-1">um churrasco / tomar sorvete</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="How often do you have a barbecue?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Com que frequência você faz um churrasco?</p>
                  <p className="text-gray-600 text-sm mt-1">come sobremesa / toma sorvete</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="How often do you call your parents?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Com que frequência você liga para seus pais?</p>
                  <p className="text-gray-600 text-sm mt-1">avós / parentes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I always go to the bar with my friends." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu sempre vou ao bar com meus amigos.</p>
                  <p className="text-gray-600 text-sm mt-1">frequentemente / às vezes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="He never calls the chef." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Ele nunca chama o chefe de cozinha.</p>
                  <p className="text-gray-600 text-sm mt-1">sempre / às vezes</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I'm a vegan." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu sou vegana.</p>
                  <p className="text-gray-600 text-sm mt-1">vegetariana / Ela é</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I'm a vegan, so I never eat meat." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu sou vegano, então eu nunca como carne.</p>
                  <p className="text-gray-600 text-sm mt-1">Ele é / Ela é</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="She's almost ready." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Ela está quase pronta.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="The dish is almost ready." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">O prato está quase pronto.</p>
                  <p className="text-gray-600 text-sm mt-1">A sobremesa / A pizza</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3️⃣ Speak Like a Native</h2>
              <p className="mt-2 text-blue-100 italic">Clique nas frases em inglês para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-3 mb-6">
              <p>
                <SpeakableText text="I'm in a hurry." className="text-blue-600 hover:text-blue-800" />
                <span className="text-gray-600 ml-2">Estou com pressa.</span>
              </p>
              <p>
                <SpeakableText text="Hurry up! We're late." className="text-blue-600 hover:text-blue-800" />
                <span className="text-gray-600 ml-2">Apresse-se! Nós estamos atrasados.</span>
              </p>
              <p>
                <SpeakableText text="He's always on time." className="text-blue-600 hover:text-blue-800" />
                <span className="text-gray-600 ml-2">Ele está sempre no horário.</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – USEFUL PHRASES</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Are you in a hurry?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você está com pressa?</p>
                  <p className="text-gray-600 text-sm mt-1">Eles / Por quê</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="He isn't in a hurry today." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Ele não está com pressa hoje.</p>
                  <p className="text-gray-600 text-sm mt-1">Nós / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Hurry up! We have to go now." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Apresse-se! Nós temos que ir agora.</p>
                  <p className="text-gray-600 text-sm mt-1">pegar o táxi / o ônibus</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Are you on time?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você está no horário?</p>
                  <p className="text-gray-600 text-sm mt-1">Eles / Eu</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="The chef is always on time." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">O chefe de cozinha está sempre no horário.</p>
                  <p className="text-gray-600 text-sm mt-1">O garçom / O gerente</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I'm in a hurry to go to the airport." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu estou com pressa para ir ao aeroporto.</p>
                  <p className="text-gray-600 text-sm mt-1">escritório / banco</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="He is always on time." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Ele sempre está no horário.</p>
                  <p className="text-gray-600 text-sm mt-1">geralmente / nunca</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">4️⃣ GRAMMAR - Somebody / Anybody</h2>
              <p className="mt-2 text-blue-100 italic">Clique nas frases em inglês para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Examples:</p>
                <p>
                  <SpeakableText text="Somebody is upset about this problem." className="text-blue-600 hover:text-blue-800" />
                  <span className="text-gray-600 ml-2">Alguém está chateado com esse problema.</span>
                </p>
                <p>
                  <SpeakableText text="We need somebody to make their dinner." className="text-blue-600 hover:text-blue-800" />
                  <span className="text-gray-600 ml-2">Nós precisamos de alguém para fazer o jantar deles.</span>
                </p>
                <p>
                  <SpeakableText text="I don't know anybody here." className="text-blue-600 hover:text-blue-800" />
                  <span className="text-gray-600 ml-2">Eu não conheço ninguém aqui.</span>
                </p>
                <p>
                  <SpeakableText text="Does anybody speak English here?" className="text-blue-600 hover:text-blue-800" />
                  <span className="text-gray-600 ml-2">Alguém fala inglês aqui?</span>
                </p>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – GRAMMAR</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Somebody needs to call the chef." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Alguém precisa chamar o chefe de cozinha.</p>
                  <p className="text-gray-600 text-sm mt-1">o gerente / o vendedor</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I want to talk to somebody." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu quero falar com alguém.</p>
                  <p className="text-gray-600 text-sm mt-1">sobre o problema / sobre o relatório</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I have to meet somebody at the airport." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu tenho que encontrar alguém no aeroporto.</p>
                  <p className="text-gray-600 text-sm mt-1">na estação de trem / de metrô</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Do you know anybody there?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você conhece alguém lá?</p>
                  <p className="text-gray-600 text-sm mt-1">nos Estados Unidos / no Reino Unido</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Do you need to visit anybody today?" className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você precisa visitar alguém hoje?</p>
                  <p className="text-gray-600 text-sm mt-1">ver / falar com</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="Is he in a hurry?" className="text-blue-600 font-medium hover:text-blue-800" /> / <SpeakableText text="Is anybody in a hurry?" className="text-blue-600 font-medium hover:text-blue-800" />
                  <p className="text-gray-600 text-sm mt-1">Ele está com pressa? / Alguém está com pressa?</p>
                  <p className="text-gray-600 text-sm mt-1">com sede / com fome</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="I don't know anybody here." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eu não conheço ninguém aqui.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela / Ele</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="He doesn't want to call anybody." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Ele não quer ligar para ninguém.</p>
                  <p className="text-gray-600 text-sm mt-1">Ela / Eles</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="They don't need to wait for anybody." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Eles não precisam esperar ninguém.</p>
                  <p className="text-gray-600 text-sm mt-1">Você / Ela</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <SpeakableText text="You know somebody here, I'm sure." className="text-blue-600 font-medium hover:text-blue-800 block" />
                  <p className="text-gray-600 text-sm mt-1">Você conhece alguém aqui, eu tenho certeza.</p>
                  <p className="text-gray-600 text-sm mt-1">não conhece</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">5️⃣ MAKE IT YOURS</h2>
              <p className="mt-2 text-blue-100 italic">Clique nas frases em inglês para ouvir a pronúncia</p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-blue-800 hover:bg-blue-900 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <SpeakableText text="I need to call my mother now." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Eu preciso ligar para minha mãe agora.</span>
              </div>
              <div>
                <SpeakableText text="She always calls me on my birthday." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Ela sempre me liga no meu aniversário.</span>
              </div>
              <div>
                <SpeakableText text="Call your father. He is worried." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Ligue para seu pai. Ele está preocupado.</span>
              </div>
              <div>
                <SpeakableText text="I have to wait for my brother here." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Eu tenho que esperar pelo meu irmão aqui.</span>
              </div>
              <div>
                <SpeakableText text="I'm late, so don't wait for me." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Eu estou atrasado, então não espere por mim.</span>
              </div>
              <div>
                <SpeakableText text="Dinner is almost ready." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">O jantar está quase pronto.</span>
              </div>
              <div>
                <SpeakableText text="I often read books in English." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Eu frequentemente leio livros em inglês.</span>
              </div>
              <div>
                <SpeakableText text="He is never in a hurry." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Ele nunca está com pressa.</span>
              </div>
              <div>
                <SpeakableText text="How often do you see your cousins?" className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Com que frequência você vê seus primos?</span>
              </div>
              <div>
                <SpeakableText text="Somebody wants to speak with you." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Alguém quer falar com você.</span>
              </div>
              <div>
                <SpeakableText text="She doesn't want to see anybody." className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Ela não quer ver ninguém.</span>
              </div>
              <div>
                <SpeakableText text="Do you know anybody in Germany?" className="text-blue-600 hover:text-blue-800 block" />
                <span className="text-gray-600 block text-sm">Você conhece alguém na Alemanha?</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
            <p className="mt-2 text-blue-100 italic">
              Clique nas expressões em inglês para ouvir a pronúncia
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>

        {/* Credits */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson 47: Eating Out • Restaurant Vocabulary & Real Life Conversations</p>
          <p className="text-xs mt-1">🍽️ <SpeakableText text="I need to call the restaurant!" className="text-gray-500 hover:text-blue-500" /> - Practice real-life dining situations!</p>
        </div>
      </div>
    </div>
  );
}