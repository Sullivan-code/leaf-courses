"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonFoodAndDrink() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  // Função corrigida com tipo explícito para 'section'
  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  // Função para tocar áudio com voz feminina para frases em inglês
  const playAudio = (text: string) => {
    // Usando Web Speech API para voz feminina em inglês
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Cancela qualquer fala anterior
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      
      // Tentar encontrar uma voz feminina
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        (voice.name.toLowerCase().includes('female') || 
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('victoria') ||
         voice.name.toLowerCase().includes('karen'))
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  // Função para áudios locais (mantida como estava)
  const playLocalAudio = (word: string) => {
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
        backgroundImage: `url("/images/lesson1-86.jpg")`,
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
            Lesson 1 - Food & Drink
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn essential vocabulary and expressions to talk about food and drink in English. 🍔🥤
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/first-l1.jpg"
              alt="Lesson intro"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on the verbs to hear the pronunciation and study their conjugations
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playLocalAudio('toeat')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to eat
                </button> = comer
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('todrink')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to drink
                </button> = beber, tomar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("You drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      You drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("He drinks")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      He drinks
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo / Você bebe / Ele bebe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat
                    </button> / 
                    <button 
                      onClick={() => playAudio("You eat")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      You eat
                    </button> / 
                    <button 
                      onClick={() => playAudio("She eats")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      She eats
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como / Você come / Ela come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat bread")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat bread
                    </button> / 
                    <button 
                      onClick={() => playAudio("I like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I like
                    </button> / 
                    <button 
                      onClick={() => playAudio("I want")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I want
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão / Eu gosto / Eu quero</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you drink coffee?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you drink coffee?
                    </button> / 
                    <button 
                      onClick={() => playAudio("Do you like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you like
                    </button> / 
                    <button 
                      onClick={() => playAudio("Do you prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you prefer
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe café? / Você gosta / Você prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("We eat cheese")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We eat cheese
                    </button> / 
                    <button 
                      onClick={() => playAudio("We prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We prefer
                    </button> / 
                    <button 
                      onClick={() => playAudio("We like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We like
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos queijo / Nós preferimos / Nós gostamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("They drink water")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They drink water
                    </button> / 
                    <button 
                      onClick={() => playAudio("They prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They prefer
                    </button> / 
                    <button 
                      onClick={() => playAudio("They need")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They need
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles bebem água / Eles preferem / Eles precisam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("She eats crackers")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      She eats crackers
                    </button> / 
                    <button 
                      onClick={() => playAudio("cookies")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cookies
                    </button> / 
                    <button 
                      onClick={() => playAudio("She wants")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      She wants
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela come biscoitos salgados / biscoitos doces / Ela quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink milk
                    </button> / 
                    <button 
                      onClick={() => playAudio("I need")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I need
                    </button> / 
                    <button 
                      onClick={() => playAudio("I like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I like
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo leite / Eu preciso / Eu gosto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you eat fruit?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you eat fruit?
                    </button> / 
                    <button 
                      onClick={() => playAudio("Do you like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you like
                    </button> / 
                    <button 
                      onClick={() => playAudio("Do you prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you prefer
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come frutas? / Você gosta / Você prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("We drink tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We drink tea
                    </button> / 
                    <button 
                      onClick={() => playAudio("We prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We prefer
                    </button> / 
                    <button 
                      onClick={() => playAudio("We like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We like
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós bebemos chá / Nós preferimos / Nós gostamos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playLocalAudio('water')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  water
                </button> = água
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('coffee')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  coffee
                </button> = café
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('chamomile')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  chamomile tea
                </button> = chá de camomila
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('milk')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  milk
                </button> = leite
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('tea')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  tea
                </button> = chá
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('juice')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  juice
                </button> = suco
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('bread')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  bread
                </button> = pão
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('cracker')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cracker
                </button> = biscoito salgado
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('cookie')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cookie
                </button> = biscoito doce
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('pancake')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pancake
                </button> = panqueca
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('ham')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  ham
                </button> = presunto
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('cheese')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cheese
                </button> = queijo
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('butter')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  butter
                </button> = manteiga
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('I')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I
                </button> = eu
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('you')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  you
                </button> = você
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('and')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  and
                </button> = e
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink water")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink water
                    </button>. / 
                    <button 
                      onClick={() => playAudio("coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo água. / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("You drink milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      You drink milk
                    </button>. / 
                    <button 
                      onClick={() => playAudio("tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      tea
                    </button> / 
                    <button 
                      onClick={() => playAudio("juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      juice
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe leite. / chá / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("You eat crackers")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      You eat crackers
                    </button>. / 
                    <button 
                      onClick={() => playAudio("cookies")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cookies
                    </button> / 
                    <button 
                      onClick={() => playAudio("cheese")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cheese
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come biscoitos salgados. / biscoitos doces / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink tea and water, thank you")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink tea and water, thank you
                    </button>. / 
                    <button 
                      onClick={() => playAudio("juice and coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      juice and coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("coffee and water")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee and water
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo chá e água, obrigado. / suco e café / café e água</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat bread and butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat bread and butter
                    </button>. / 
                    <button 
                      onClick={() => playAudio("cracker")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cracker
                    </button> / 
                    <button 
                      onClick={() => playAudio("pancake")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      pancake
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com manteiga. / biscoito salgado / panqueca</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you prefer cheese or ham?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you prefer cheese or ham?
                    </button> / 
                    <button 
                      onClick={() => playAudio("butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      butter
                    </button> / 
                    <button 
                      onClick={() => playAudio("tea or milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      tea or milk
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere queijo ou presunto? / manteiga / chá ou leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("We drink orange juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We drink orange juice
                    </button>. / 
                    <button 
                      onClick={() => playAudio("coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      tea
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós bebemos suco de laranja. / café / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("They eat pancakes for breakfast")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They eat pancakes for breakfast
                    </button>. / 
                    <button 
                      onClick={() => playAudio("crackers")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      crackers
                    </button> / 
                    <button 
                      onClick={() => playAudio("bread")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      bread
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem panquecas no café da manhã. / biscoitos / pão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I like tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I like tea
                    </button>. / 
                    <button 
                      onClick={() => playAudio("coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de chá. / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you want water or juice?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you want water or juice?
                    </button> / 
                    <button 
                      onClick={() => playAudio("coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer água ou suco? / café / leite</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases and everyday expressions
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playLocalAudio('i_eat_crackers_and_you')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I eat crackers. And you?
                </button> = Eu como biscoitos salgados. E você?
              </li>
              <li>
                <button 
                  onClick={() => playLocalAudio('idrinkcoffeewithmilk')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I drink coffee with milk
                </button> = Eu bebo café com leite.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat crackers. And you?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat crackers. And you?
                    </button> / 
                    <button 
                      onClick={() => playAudio("cookies")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cookies
                    </button> / 
                    <button 
                      onClick={() => playAudio("pancakes")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      pancakes
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como biscoitos salgados. E você? / biscoitos doces / panquecas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink water and juice. And you?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink water and juice. And you?
                    </button> / 
                    <button 
                      onClick={() => playAudio("coffee and juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee and juice
                    </button> / 
                    <button 
                      onClick={() => playAudio("coffee and tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee and tea
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo água e suco. E você? / café e suco / café e chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you want coffee or tea?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you want coffee or tea?
                    </button> / 
                    <button 
                      onClick={() => playAudio("milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk
                    </button> / 
                    <button 
                      onClick={() => playAudio("juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      juice
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer café ou chá? / leite / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I like bread and cheese")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I like bread and cheese
                    </button>. / 
                    <button 
                      onClick={() => playAudio("butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      butter
                    </button> / 
                    <button 
                      onClick={() => playAudio("ham")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      ham
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de pão com queijo. / manteiga / presunto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("We eat rice for lunch")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We eat rice for lunch
                    </button>. / 
                    <button 
                      onClick={() => playAudio("beans")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      beans
                    </button> / 
                    <button 
                      onClick={() => playAudio("french fries")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      french fries
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos arroz no almoço. / feijão / batata frita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you drink chocolate milk?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you drink chocolate milk?
                    </button> / 
                    <button 
                      onClick={() => playAudio("coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      tea
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe leite com chocolate? / café / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I prefer orange juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I prefer orange juice
                    </button>. / 
                    <button 
                      onClick={() => playAudio("apple")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      apple
                    </button> / 
                    <button 
                      onClick={() => playAudio("grape")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      grape
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro suco de laranja. / maçã / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("They drink chamomile tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They drink chamomile tea
                    </button>. / 
                    <button 
                      onClick={() => playAudio("mint")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      mint
                    </button> / 
                    <button 
                      onClick={() => playAudio("anise")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      anise
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles bebem chá de camomila. / hortelã / erva-doce</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat bread and cheese")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat bread and cheese
                    </button>. / 
                    <button 
                      onClick={() => playAudio("ham")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      ham
                    </button> / 
                    <button 
                      onClick={() => playAudio("butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      butter
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com queijo. / presunto / manteiga</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you like pancakes?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you like pancakes?
                    </button> / 
                    <button 
                      onClick={() => playAudio("crackers")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      crackers
                    </button> / 
                    <button 
                      onClick={() => playAudio("bread")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      bread
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de panquecas? / biscoitos / pão</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Observe the sentence structure and practice correct formation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-lg text-gray-700 mb-4">
              See how to use the verbs <button onClick={() => playLocalAudio('eat')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">eat</button> (comer) and <button onClick={() => playLocalAudio('drink')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">drink</button> (beber) in sentences:
            </p>
            
            {/* Nota sutil sobre gramática */}
            <div className="text-sm text-gray-600 mb-4 bg-blue-50/50 p-2 rounded-lg border border-blue-100">
              <p className="font-medium text-gray-700">💡 Grammar Tip:</p>
              <p>Both <span className="text-blue-600 font-medium">"with"</span> and <span className="text-blue-600 font-medium">"and"</span> can be used for "com" (e.g., <span className="italic">bread and butter</span> / <span className="italic">bread with butter</span>).</p>
              <p>Verbs in the infinitive usually have <span className="text-blue-600 font-medium">"to"</span> before them (e.g., <span className="italic">to eat</span>), but without <span className="text-blue-600 font-medium">"to"</span> they are also infinitives (e.g., <span className="italic">eat</span>).</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio("I eat pancakes")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I eat pancakes
                </button> = Eu como panquecas.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("You eat cookies")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  You eat cookies
                </button> = Você come biscoitos doces.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("I eat bread and ham")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I eat bread and ham
                </button> = Eu como pão e presunto.
              </p>
              <p>
                <button 
                  onClick={() => playAudio("I drink coffee")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I drink coffee
                </button> = Eu bebo café.
              </p>
              <p>
                <button 
                  onClick={() => playLocalAudio('you_drink_water')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  You drink water
                </button> = Você bebe água.
              </p>
              <p>
                <button 
                  onClick={() => playLocalAudio('idrinkcoffeewithmilk')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I drink coffee with milk
                </button> = Eu bebo café com leite.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat bread with butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat bread with butter
                    </button>. / 
                    <button 
                      onClick={() => playAudio("ham")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      ham
                    </button> / 
                    <button 
                      onClick={() => playAudio("cheese")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cheese
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com manteiga. / presunto / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("You drink juice and I drink water")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      You drink juice and I drink water
                    </button>. / 
                    <button 
                      onClick={() => playAudio("milk - coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk - coffee
                    </button> / 
                    <button 
                      onClick={() => playAudio("tea - juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      tea - juice
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe suco e eu bebo água. / leite - café / chá - suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I drink coffee. And you?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I drink coffee. And you?
                    </button> / 
                    <button 
                      onClick={() => playAudio("milk")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      milk
                    </button> / 
                    <button 
                      onClick={() => playAudio("juice")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      juice
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo café. E você? / leite / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I eat crackers. And you?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I eat crackers. And you?
                    </button> / 
                    <button 
                      onClick={() => playAudio("cookies")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      cookies
                    </button> / 
                    <button 
                      onClick={() => playAudio("pancakes")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      pancakes
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como biscoitos salgados. E você? / biscoitos doces / panquecas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you eat cheese?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you eat cheese?
                    </button> / 
                    <button 
                      onClick={() => playAudio("drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("prefer")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      prefer
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come queijo? / bebe / prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("We drink tea")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      We drink tea
                    </button>. / 
                    <button 
                      onClick={() => playAudio("eat")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      eat
                    </button> / 
                    <button 
                      onClick={() => playAudio("like")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      like
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós bebemos chá. / comemos / gostamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("She drinks milk with coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      She drinks milk with coffee
                    </button>. / 
                    <button 
                      onClick={() => playAudio("eats")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      eats
                    </button> / 
                    <button 
                      onClick={() => playAudio("wants")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      wants
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela bebe leite com café. / come / quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("They eat bread with butter")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      They eat bread with butter
                    </button>. / 
                    <button 
                      onClick={() => playAudio("drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("need")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      need
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem pão com manteiga. / bebem / precisam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("I like coffee")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      I like coffee
                    </button>. / 
                    <button 
                      onClick={() => playAudio("drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("have")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      have
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de café. / bebo / tomo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button 
                      onClick={() => playAudio("Do you prefer tea or coffee?")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      Do you prefer tea or coffee?
                    </button> / 
                    <button 
                      onClick={() => playAudio("drink")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      drink
                    </button> / 
                    <button 
                      onClick={() => playAudio("have")} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      have
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere chá ou café? / bebe / toma</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice pronunciation in real situations
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura em grandes */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("I eat bread. And you?")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("bread")}
                          >bread</span>. And you?
                        </p>
                        <p className="text-sm text-gray-600">Eu como pão. E você?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("I drink coffee with milk")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I drink <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("coffee")}
                          >coffee</span> with milk
                        </p>
                        <p className="text-sm text-gray-600">Eu bebo café com leite</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("Do you eat ham and cheese?")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Do you eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("ham")}
                          >ham</span> and cheese?
                        </p>
                        <p className="text-sm text-gray-600">Você come presunto e queijo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("We drink juice in the morning")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          We drink <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("juice")}
                          >juice</span> in the morning
                        </p>
                        <p className="text-sm text-gray-600">Nós bebemos suco de manhã</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("Do you prefer tea or coffee?")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Do you prefer <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("tea")}
                          >tea</span> or coffee?
                        </p>
                        <p className="text-sm text-gray-600">Você prefere chá ou café?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("They eat pancakes for breakfast")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          They eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("pancakes")}
                          >pancakes</span> for breakfast
                        </p>
                        <p className="text-sm text-gray-600">Eles comem panquecas no café da manhã</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("I like bread and cheese")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I like <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("bread")}
                          >bread</span> and cheese
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de pão e queijo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("Do you drink water with ice?")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Do you drink water with <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("ice")}
                          >ice</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você bebe água com gelo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("We eat cookies with tea")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          We eat <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("cookies")}
                          >cookies</span> with tea
                        </p>
                        <p className="text-sm text-gray-600">Nós comemos biscoitos com chá</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/reallife-image1.jpg"
                        alt="People talking in a cafe"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Situação real em um café
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/reallife-image2.jpg"
                        alt="People ordering food in a restaurant"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Pedindo comida em um restaurante
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out (estilo print) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <p className="mt-2 text-blue-100 italic">
                Review the main points and essential expressions of the lesson
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Verbos */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p><span className="font-bold">to eat (comer) →</span> I eat</p>
              <p><span className="font-bold">to drink (beber) →</span> you drink</p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/juice-image.jpg"
                alt="Woman drinking juice"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button 
                  onClick={() => playAudio("I drink juice. And you?")}
                  className="font-bold hover:text-blue-600 transition-colors"
                >
                  I drink juice. And you?
                </button>
                <p className="text-sm text-gray-600 mt-1">Eu bebo suco. E você?</p>
              </div>
            </div>

            {/* Coluna direita - Saudações */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playLocalAudio("good_morning")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Good morning! (Bom dia!)</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playLocalAudio("good_afternoon")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Good afternoon! (Boa tarde!)</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playLocalAudio("good_evening")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Good evening! (Boa noite!)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}