"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Definindo tipos para as seções
type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonFoodAndDrinkFrench() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTextRef = useRef<string>("");

  // Função para tocar áudio com TTS em francês
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancela qualquer fala em andamento
      window.speechSynthesis.cancel();
      
      // Também pausa o elemento de áudio se estiver tocando
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Busca uma voz feminina francesa
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Google Français') ||
         voice.name.includes('Samantha'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      window.speechSynthesis.speak(utterance);
      currentTextRef.current = text;
    }
  };

  // Função para tocar áudio com progresso (para textos longos)
  const playLongText = (text: string) => {
    // Cancela qualquer fala em andamento
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Google Français') ||
         voice.name.includes('Samantha'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      // Estima a duração baseada no tamanho do texto
      const estimatedDuration = text.length / 2.5;
      setDuration(estimatedDuration);
      setCurrentTime(0);
      setIsPlaying(true);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(estimatedDuration);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      // Simula o progresso
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(interval);
          return;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= estimatedDuration) {
          clearInterval(interval);
          setIsPlaying(false);
          setCurrentTime(estimatedDuration);
        } else {
          setCurrentTime(elapsed);
        }
      }, 100);
      
      utterance.onend = () => {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentTime(estimatedDuration);
      };
      
      window.speechSynthesis.speak(utterance);
      currentTextRef.current = text;
    }
  };

  // Função para tocar o áudio do GitHub (exemplo)
  const playExternalAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setDuration(audioRef.current?.duration || 0);
        })
        .catch(error => {
          console.error("Erro ao reproduzir o áudio:", error);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const remainingText = currentTextRef.current.substring(Math.floor(newTime * 2.5));
      if (remainingText) {
        playLongText(remainingText);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  // Carrega as vozes para o TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

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
        
        {/* ELEMENTO DE ÁUDIO OCULTO */}
        <audio ref={audioRef} src="/audios/french-lesson1.mp3" preload="metadata" />

        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Leçon 1 - Nourriture & Boisson
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Apprenez le vocabulaire essentiel pour parler de la nourriture et des boissons en français. 🍔🥤
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="/images/first-l1-french.jpg"
              alt="French lesson intro"
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
              <h2 className="text-2xl font-bold">🔹 Verbes</h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur les verbes pour entendre la prononciation et étudier les conjugaisons
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio("manger")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  manger
                </button> = comer
              </li>
              <li>
                <button 
                  onClick={() => playAudio("boire")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  boire
                </button> = beber, tomar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois</button> / 
                    <button onClick={() => playAudio("tu bois")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu bois</button> / 
                    <button onClick={() => playAudio("il boit")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Il boit</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo / Você bebe / Ele bebe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange</button> / 
                    <button onClick={() => playAudio("tu manges")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu manges</button> / 
                    <button onClick={() => playAudio("elle mange")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Elle mange</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como / Você come / Ela come</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange du pain")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange du pain</button> / 
                    <button onClick={() => playAudio("j'aime")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> J'aime</button> / 
                    <button onClick={() => playAudio("je veux")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Je veux</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão / Eu gosto / Eu quero</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu bois du café")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu bois du café</button> ? / 
                    <button onClick={() => playAudio("tu aimes")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu aimes</button> ? / 
                    <button onClick={() => playAudio("tu préfères")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu préfères</button> ?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe café? / Você gosta / Você prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("nous mangeons du fromage")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Nous mangeons du fromage</button> / 
                    <button onClick={() => playAudio("nous préférons")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Nous préférons</button> / 
                    <button onClick={() => playAudio("nous aimons")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Nous aimons</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos queijo / Nós preferimos / Nós gostamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("ils boivent de l'eau")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Ils boivent de l'eau</button> / 
                    <button onClick={() => playAudio("ils préfèrent")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Ils préfèrent</button> / 
                    <button onClick={() => playAudio("ils ont besoin")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Ils ont besoin</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles bebem água / Eles preferem / Eles precisam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("elle mange des biscuits")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Elle mange des biscuits</button> / 
                    <button onClick={() => playAudio("elle veut")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Elle veut</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela come biscoitos / Ela quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois du lait")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois du lait</button> / 
                    <button onClick={() => playAudio("j'ai besoin")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> J'ai besoin</button> / 
                    <button onClick={() => playAudio("j'aime")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> J'aime</button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo leite / Eu preciso / Eu gosto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu manges des fruits")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu manges des fruits</button> ? / 
                    <button onClick={() => playAudio("tu aimes")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu aimes</button> ? / 
                    <button onClick={() => playAudio("tu préfères")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Tu préfères</button> ?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come frutas? / Você gosta / Você prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("nous buvons du thé")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Nous buvons du thé</button> / 
                    <button onClick={() => playAudio("nous préférons")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Nous préférons</button> / 
                    <button onClick={() => playAudio("nous aimons")} className="text-blue-600 hover:text-blue-800 cursor-pointer"> Nous aimons</button>
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
              <h2 className="text-2xl font-bold">🔹 Nouveau Vocabulaire</h2>
              <p className="mt-2 text-blue-100 italic">
                Cliquez sur chaque mot pour entendre sa prononciation correcte
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button onClick={() => playAudio("l'eau")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  l'eau
                </button> = água
              </li>
              <li>
                <button onClick={() => playAudio("le café")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le café
                </button> = café
              </li>
              <li>
                <button onClick={() => playAudio("la tisane")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  la tisane
                </button> = chá de camomila
              </li>
              <li>
                <button onClick={() => playAudio("le lait")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le lait
                </button> = leite
              </li>
              <li>
                <button onClick={() => playAudio("le thé")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le thé
                </button> = chá
              </li>
              <li>
                <button onClick={() => playAudio("le jus")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le jus
                </button> = suco
              </li>
              <li>
                <button onClick={() => playAudio("le pain")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le pain
                </button> = pão
              </li>
              <li>
                <button onClick={() => playAudio("le biscuit")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le biscuit
                </button> = biscoito salgado
              </li>
              <li>
                <button onClick={() => playAudio("le cookie")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le cookie
                </button> = biscoito doce
              </li>
              <li>
                <button onClick={() => playAudio("la crêpe")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  la crêpe
                </button> = panqueca
              </li>
              <li>
                <button onClick={() => playAudio("le jambon")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le jambon
                </button> = presunto
              </li>
              <li>
                <button onClick={() => playAudio("le fromage")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le fromage
                </button> = queijo
              </li>
              <li>
                <button onClick={() => playAudio("le beurre")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  le beurre
                </button> = manteiga
              </li>
              <li>
                <button onClick={() => playAudio("je")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  je
                </button> = eu
              </li>
              <li>
                <button onClick={() => playAudio("tu")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  tu
                </button> = você
              </li>
              <li>
                <button onClick={() => playAudio("et")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  et
                </button> = e
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois de l'eau")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois de l'eau</button> / café / lait
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo água. / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu bois du lait")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu bois du lait</button> / thé / jus
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe leite. / chá / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu manges des biscuits")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu manges des biscuits</button> / cookies / fromage
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come biscoitos salgados. / biscoitos doces / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois du thé et de l'eau")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois du thé et de l'eau</button>, merci. / jus et café / café et eau
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo chá e água, obrigado. / suco e café / café e água</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange du pain et du beurre")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange du pain et du beurre</button> / biscuit / crêpe
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com manteiga. / biscoito salgado / panqueca</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu préfères du fromage ou du jambon")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu préfères du fromage ou du jambon</button> ? / beurre / thé ou lait
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você prefere queijo ou presunto? / manteiga / chá ou leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("nous buvons du jus d'orange")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Nous buvons du jus d'orange</button> / café / thé
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós bebemos suco de laranja. / café / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("ils mangent des crêpes au petit-déjeuner")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Ils mangent des crêpes au petit-déjeuner</button> / biscuits / pain
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem panquecas no café da manhã. / biscoitos / pão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("j'aime le thé")} className="text-blue-600 hover:text-blue-800 cursor-pointer">J'aime le thé</button> / café / lait
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de chá. / café / leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu veux de l'eau ou du jus")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu veux de l'eau ou du jus</button> ? / café / lait
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
              <h2 className="text-2xl font-bold">🔹 Parlez Comme un Natif</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratiquez des phrases courantes et des expressions du quotidien
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio("je mange des biscuits et toi")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je mange des biscuits. Et toi ?
                </button> = Eu como biscoitos salgados. E você?
              </li>
              <li>
                <button 
                  onClick={() => playAudio("je bois du café avec du lait")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Je bois du café avec du lait
                </button> = Eu bebo café com leite.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange des biscuits et toi")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange des biscuits</button>. Et toi ? / cookies / crêpes
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como biscoitos salgados. E você? / biscoitos doces / panquecas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois de l'eau et du jus et toi")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois de l'eau et du jus</button>. Et toi ? / café et jus / café et thé
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo água e suco. E você? / café e suco / café e chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu veux du café ou du thé")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu veux du café ou du thé</button> ? / lait / jus
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você quer café ou chá? / leite / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("j'aime le pain et le fromage")} className="text-blue-600 hover:text-blue-800 cursor-pointer">J'aime le pain et le fromage</button> / beurre / jambon
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de pão com queijo. / manteiga / presunto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("nous mangeons du riz au déjeuner")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Nous mangeons du riz au déjeuner</button> / haricots / frites
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós comemos arroz no almoço. / feijão / batata frita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu bois du chocolat chaud")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu bois du chocolat chaud</button> ? / café / thé
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe chocolate quente? / café / chá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je préfère le jus d'orange")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je préfère le jus d'orange</button> / pomme / raisin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro suco de laranja. / maçã / uva</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("ils boivent de la tisane")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Ils boivent de la tisane</button> / menthe / anis
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles bebem chá de camomila. / hortelã / erva-doce</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange du pain avec du fromage")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange du pain avec du fromage</button> / jambon / beurre
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com queijo. / presunto / manteiga</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu aimes les crêpes")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu aimes les crêpes</button> ? / biscuits / pain
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
              <h2 className="text-2xl font-bold">🔹 GRAMMAIRE</h2>
              <p className="mt-2 text-blue-100 italic">
                Observez la structure des phrases et pratiquez la formation correcte
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Cacher l\'exercice' : 'Montrer l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-lg text-gray-700 mb-4">
              Voyez comment utiliser les verbes <button onClick={() => playAudio("manger")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">manger</button> (comer) et <button onClick={() => playAudio("boire")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">boire</button> (beber) dans des phrases :
            </p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio("je mange des crêpes")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Je mange des crêpes
                </button> = Eu como panquecas.
              </p>
              <p>
                <button onClick={() => playAudio("tu manges des cookies")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Tu manges des cookies
                </button> = Você come biscoitos doces.
              </p>
              <p>
                <button onClick={() => playAudio("je mange du pain et du jambon")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Je mange du pain et du jambon
                </button> = Eu como pão e presunto.
              </p>
              <p>
                <button onClick={() => playAudio("je bois du café")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Je bois du café
                </button> = Eu bebo café.
              </p>
              <p>
                <button onClick={() => playAudio("tu bois de l'eau")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Tu bois de l'eau
                </button> = Você bebe água.
              </p>
              <p>
                <button onClick={() => playAudio("je bois du café avec du lait")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">
                  Je bois du café avec du lait
                </button> = Eu bebo café com leite.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange du pain avec du beurre")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange du pain avec du beurre</button> / jambon / fromage
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como pão com manteiga. / presunto / queijo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu bois du jus et je bois de l'eau")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu bois du jus</button> et <button onClick={() => playAudio("je bois de l'eau")} className="text-blue-600 hover:text-blue-800 cursor-pointer">je bois de l'eau</button> / lait - café / thé - jus
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você bebe suco e eu bebo água. / leite - café / chá - suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je bois du café et toi")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je bois du café</button>. Et toi ? / lait / jus
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo café. E você? / leite / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("je mange des biscuits et toi")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Je mange des biscuits</button>. Et toi ? / cookies / crêpes
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu como biscoitos salgados. E você? / biscoitos doces / panquecas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu manges du fromage")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu manges du fromage</button> ? / bois / préfères
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você come queijo? / bebe / prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("nous buvons du thé")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Nous buvons du thé</button> / mangeons / aimons
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós bebemos chá. / comemos / gostamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("elle boit du lait avec du café")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Elle boit du lait avec du café</button> / mange / veut
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela bebe leite com café. / come / quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("ils mangent du pain avec du beurre")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Ils mangent du pain avec du beurre</button> / boivent / ont besoin
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles comem pão com manteiga. / bebem / precisam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("j'aime le café")} className="text-blue-600 hover:text-blue-800 cursor-pointer">J'aime le café</button> / bois / prends
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de café. / bebo / tomo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("tu préfères le thé ou le café")} className="text-blue-600 hover:text-blue-800 cursor-pointer">Tu préfères le thé ou le café</button> ? / bois / prends
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
            <h2 className="text-2xl font-bold">🔹 Mettez en Pratique</h2>
            <p className="mt-2 text-blue-100 italic">
              Remplacez les mots en bleu pour pratiquer la prononciation dans des situations réelles
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
                        onClick={() => playAudio("je mange du pain et toi")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Je mange <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("du pain")}
                          >du pain</span>. Et toi ?
                        </p>
                        <p className="text-sm text-gray-600">Eu como pão. E você?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("je bois du café avec du lait")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Je bois <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("du café")}
                          >du café</span> avec du lait
                        </p>
                        <p className="text-sm text-gray-600">Eu bebo café com leite</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("tu manges du jambon et du fromage")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Tu manges <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("du jambon")}
                          >du jambon</span> et du fromage ?
                        </p>
                        <p className="text-sm text-gray-600">Você come presunto e queijo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("nous buvons du jus le matin")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Nous buvons <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("du jus")}
                          >du jus</span> le matin
                        </p>
                        <p className="text-sm text-gray-600">Nós bebemos suco de manhã</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("tu préfères le thé ou le café")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Tu préfères <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("le thé")}
                          >le thé</span> ou le café ?
                        </p>
                        <p className="text-sm text-gray-600">Você prefere chá ou café?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("ils mangent des crêpes au petit-déjeuner")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Ils mangent <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("des crêpes")}
                          >des crêpes</span> au petit-déjeuner
                        </p>
                        <p className="text-sm text-gray-600">Eles comem panquecas no café da manhã</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("j'aime le pain et le fromage")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          J'aime <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("le pain")}
                          >le pain</span> et le fromage
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de pão e queijo</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("tu bois de l'eau avec des glaçons")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Tu bois de l'eau avec <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("des glaçons")}
                          >des glaçons</span> ?
                        </p>
                        <p className="text-sm text-gray-600">Você bebe água com gelo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio("nous mangeons des cookies avec du thé")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Nous mangeons <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("des cookies")}
                          >des cookies</span> avec du thé
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
                        src="/images/reallife-french1.jpg"
                        alt="French cafe scene"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Situation réelle dans un café français
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/reallife-french2.jpg"
                        alt="French restaurant scene"
                        width={300}
                        height={400}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Commander dans un restaurant français
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
              <h2 className="text-3xl font-bold">🔹 RÉCAPITULATIF</h2>
              <p className="mt-2 text-blue-100 italic">
                Révisez les points principaux et les expressions essentielles de la leçon
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Verbos */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p><span className="font-bold">manger (comer) →</span> je mange</p>
              <p><span className="font-bold">boire (beber) →</span> tu bois</p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/juice-french.jpg"
                alt="French woman drinking juice"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button onClick={() => playAudio("je bois du jus et toi")} className="hover:text-blue-600 transition-colors">
                  Je bois du jus. <span className="font-bold">Et toi ?</span>
                </button>
                <p className="text-sm text-gray-600 mt-1">Eu bebo suco. E você?</p>
              </div>
            </div>

            {/* Coluna direita - Saudações */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bonjour")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bonjour ! (Bom dia!)</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bonsoir")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bonsoir ! (Boa noite - chegada)</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bonne nuit")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bonne nuit ! (Boa noite - ao dormir)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/frances/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Prochaine Leçon &rarr;
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
          50% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.8); }
          100% { box-shadow: 0 0 5px rgba(99, 102, 241, 0.5); }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-in-out;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}