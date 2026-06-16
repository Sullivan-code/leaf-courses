"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// Componente de Modal para Anotações
function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-blue-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações...
- Traduções importantes
- Dúvidas para o professor
- Exemplos pessoais
- Dicas de memorização"
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>
        
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

// Componente de Ícone de Lápis
function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// Componente CheckItOutHorizontal
function CheckItOutHorizontal() {
  const playAudio = (text: string) => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    const setFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Victoria')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    };
    if (window.speechSynthesis.getVoices().length > 0) {
      setFemaleVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">WRAP UP!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        <div className="bg-cyan-200 p-6 space-y-3">
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('to go to the u.s.a.')}>
            • to go <strong className="text-blue-700">to the U.S.A.</strong>
          </p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('to study in the u.s.a.')}>
            • to study <strong className="text-blue-700">in the U.S.A.</strong>
          </p>
        </div>

        <div className="bg-purple-500 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at work')}>• at work</p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at home')}>• at home</p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at school')}>• at school</p>
        </div>

        <div className="bg-white p-6 space-y-3">
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('they live')}>• They live…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('my parents live')}>• My parents live…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('we speak')}>• We speak…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('my sister and i speak')}>• My sister and I speak…</p>
        </div>

        <div className="bg-sky-300 p-6 flex flex-col items-center justify-center font-semibold text-gray-800">
          <p className="mb-2">class → classes</p>
          <p className="text-xs font-normal mt-1 text-center">A regra do plural em palavras como "classes" aplica-se a substantivos e adjetivos terminados em -s, -z, -x, -sch ou -ch. Nesses casos, acrescenta-se -es ao final para formar o plural.</p>
          <div className="mt-3 text-xs font-normal text-center">
            <p>box → boxes</p>
            <p>buzz → buzzes</p>
            <p>church → churches</p>
            <p>wish → wishes</p>
          </div>
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
  
  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || '',
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes(prev => ({
      ...prev,
      [noteModal.sectionTitle]: note,
    }));
  };

  // Female voice text-to-speech function
  const playAudio = (text: string) => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    const setFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('Google UK English Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.name.includes('Victoria')
      );
      if (femaleVoice) utterance.voice = femaleVoice;
    };
    if (window.speechSynthesis.getVoices().length > 0) {
      setFemaleVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setFemaleVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&q=80")`,
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
            Lesson 33 - Verbs & Conversation
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda verbos essenciais para conversar sobre diversos assuntos! 🗣️
          </p>
        </div>

        {/* Seção 1 - Verbs */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Click on the verbs to hear the pronunciation and practice their forms</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
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
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I need to talk to you.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I need to talk to you.</span> / to her / to your grandmother</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso conversar com você.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('She talks to her friends every day.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She talks to her friends every day.</span> / her teachers / her relatives</p>
                  <p className="text-sm text-gray-500 mt-1">Ela conversa com os amigos todos os dias.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('He likes to talk about sports.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He likes to talk about sports.</span> / health / subjects</p>
                  <p className="text-sm text-gray-500 mt-1">Ele gosta de falar sobre esportes.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('We watch videos on our phones.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">We watch videos on our phones.</span> / our tablet / her cellphone </p>
                  <p className="text-sm text-gray-500 mt-1">Nós assistimos vídeos em nossos celulares.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('They want to watch a movie tonight.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">They want to watch a movie tonight.</span> / tomorrow / on Tuesdays</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem assistir um filme hoje à noite.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('What do you want to watch now?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What do you want to watch now?</span> / today / tonight</p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer assistir agora?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('You like to talk to me.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">You like to talk to me.</span> / to him / to her</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de conversar comigo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I like to talk about sports.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I like to talk about sports.</span> / politics / science</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de falar sobre esportes.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Do you want to watch this movie with me?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you want to watch this movie with me?</span> / this series / this video</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer assistir este filme comigo?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Click on each word to hear its correct pronunciation</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li><button onClick={() => playAudio('science')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">science</button> = ciência</li>
              <li><button onClick={() => playAudio('religion')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">religion</button> = religião</li>
              <li><button onClick={() => playAudio('politics')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">politics</button> = política</li>
              <li><button onClick={() => playAudio('music')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">music</button> = música</li>
              <li><button onClick={() => playAudio('sports')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">sports</button> = esportes</li>
              <li><button onClick={() => playAudio('fashion')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">fashion</button> = moda</li>
              <li><button onClick={() => playAudio('life')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">life</button> = vida</li>
              <li><button onClick={() => playAudio('stuff')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">stuff</button> = coisas</li>
              <li><button onClick={() => playAudio('idea')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">idea</button> = ideia</li>
              <li><button onClick={() => playAudio('opinion')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">opinion</button> = opinião</li>
              <li><button onClick={() => playAudio('problem')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">problem</button> = problema</li>
              <li><button onClick={() => playAudio('series')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">series</button> = série</li>
              <li><button onClick={() => playAudio('movie')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">movie</button> = filme</li>
              <li><button onClick={() => playAudio('video')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">video</button> = vídeo</li>
              <li><button onClick={() => playAudio('it')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">it</button> = ele / ela / neutro</li>
              <li><button onClick={() => playAudio('his')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">his</button> = dele</li>
              <li><button onClick={() => playAudio('her')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">her</button> = dela</li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('She likes to talk about sports.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She likes to talk about sports.</span> / fashion / religion</p>
                  <p className="text-sm text-gray-500 mt-1">Ela gosta de falar sobre esportes.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("I don't want to talk about my life.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I don't want to talk about my life.</span> / this problem / this movie</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não quero falar sobre minha vida.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I watch videos on my phone.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I watch videos on my phone.</span> / series / movies</p>
                  <p className="text-sm text-gray-500 mt-1">Eu assisto vídeos no meu celular.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Do you want to watch this movie with me?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you want to watch this movie with me?</span> / this series / this video</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer assistir este filme comigo?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases for everyday conversations</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button onClick={() => playAudio('I want to meet my friends tonight.')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I want to meet my friends tonight.
                </button>
                <span className="text-gray-600 ml-2">= Eu quero encontrar meus amigos hoje à noite.</span>
              </li>
              <li>
                <button onClick={() => playAudio('Where does he want to go tonight?')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  Where does he want to go tonight?
                </button>
                <span className="text-gray-600 ml-2">= Onde ele quer ir hoje à noite?</span>
              </li>
              <li>
                <button onClick={() => playAudio('He wants to meet his friends tonight.')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  He wants to meet his friends tonight.
                </button>
                <span className="text-gray-600 ml-2">= Ele quer encontrar os amigos dele hoje à noite.</span>
              </li>
              <li>
                <button onClick={() => playAudio("I don't have an opinion about it.")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  I don't have an opinion about it.
                </button>
                <span className="text-gray-600 ml-2">= Eu não tenho uma opinião sobre isso.</span>
              </li>
              <li>
                <button onClick={() => playAudio('Do you have an opinion about this problem?')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  Do you have an opinion about this problem?
                </button>
                <span className="text-gray-600 ml-2">= Você tem uma opinião sobre esse problema?</span>
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("We don't stay at home during the week.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">We don't stay at home during the week.</span> / here / there</p>
                  <p className="text-sm text-gray-500 mt-1">Nós não ficamos em casa durante a semana.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Sometimes I study on Sundays.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Sometimes I study on Sundays.</span> / do the laundry / clean the house</p>
                  <p className="text-sm text-gray-500 mt-1">Às vezes eu estudo aos domingos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Do you have an opinion about this problem?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you have an opinion about this problem?</span> / subject / course</p>
                  <p className="text-sm text-gray-500 mt-1">Você tem uma opinião sobre esse problema?</p>
                </div>
                {/* Future and Past Tense Exercises with Will and Didn't */}
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Will you talk to her about the classes tomorrow?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Will you talk to her about the classes tomorrow?</span> (Future - Question)</p>
                  <p className="text-sm text-gray-500 mt-1">Você vai falar com ela sobre as aulas amanhã?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I will watch the boxes carefully.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I will watch the boxes carefully.</span> (Future - Affirmative)</p>
                  <p className="text-sm text-gray-500 mt-1">Eu vou observar as caixas cuidadosamente.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => playAudio('She didn\'t go to the churches last Sunday.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-red-600">She didn't go to the churches last Sunday.</span> (Past - Negative)</p>
                  <p className="text-sm text-gray-500 mt-1">Ela não foi às igrejas no domingo passado.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => playAudio('Didn\'t you understand the buzzes from the crowd?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-red-600">Didn't you understand the buzzes from the crowd?</span> (Past - Negative Question)</p>
                  <p className="text-sm text-gray-500 mt-1">Você não entendeu os zumbidos da multidão?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Present Simple - Affirmative, Negative, and Questions</p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="font-medium text-blue-800">Affirmative:</p>
              <p>
                <button onClick={() => playAudio('He watches videos on his tablet.')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  He watches videos on his tablet.
                </button>
                <span className="text-gray-600 ml-2">= Ele assiste vídeos no tablet dele.</span>
              </p>
              <p>
                <button onClick={() => playAudio('She has great ideas.')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  She has great ideas.
                </button>
                <span className="text-gray-600 ml-2">= Ela tem ótimas ideias.</span>
              </p>
              <p>
                <button onClick={() => playAudio("It starts at ten o'clock.")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  It starts at ten o'clock.
                </button>
                <span className="text-gray-600 ml-2">= Começa às dez horas.</span>
              </p>
              
              <p className="font-medium text-blue-800 mt-4">Negative:</p>
              <p>
                <button onClick={() => playAudio("She doesn't live with her parents.")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  She doesn't live with her parents.
                </button>
                <span className="text-gray-600 ml-2">= Ela não mora com os pais.</span>
              </p>
              <p>
                <button onClick={() => playAudio("He doesn't study music at the university.")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  He doesn't study music at the university.
                </button>
                <span className="text-gray-600 ml-2">= Ele não estuda música na universidade.</span>
              </p>
              <p>
                <button onClick={() => playAudio("It doesn't finish this week.")} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  It doesn't finish this week.
                </button>
                <span className="text-gray-600 ml-2">= Não termina esta semana.</span>
              </p>
              
              <p className="font-medium text-blue-800 mt-4">Questions:</p>
              <p>
                <button onClick={() => playAudio('Does she want to learn more about sports?')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  Does she want to learn more about sports?
                </button>
                <span className="text-gray-600 ml-2">= Ela quer aprender mais sobre esportes?</span>
              </p>
              <p>
                <button onClick={() => playAudio('Does he like to talk about his life?')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  Does he like to talk about his life?
                </button>
                <span className="text-gray-600 ml-2">= Ele gosta de falar sobre a vida dele?</span>
              </p>
              <p>
                <button onClick={() => playAudio('What time does it start?')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">
                  What time does it start?
                </button>
                <span className="text-gray-600 ml-2">= A que horas começa?</span>
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('She likes to talk about sports.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She likes to talk about sports.</span> / wants / prefers</p>
                  <p className="text-sm text-gray-500 mt-1">Ela gosta de falar sobre esportes.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("He doesn't understand this subject.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He doesn't understand this subject.</span> / this word / this language</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não entende este assunto.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('What time does the meeting start?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What time does the meeting start?</span> / the movie / the class</p>
                  <p className="text-sm text-gray-500 mt-1">A que horas a reunião começa?</p>
                </div>
                {/* Future and Past Tense Exercises with Will and Didn't */}
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Will she discuss the matches with the coaches?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Will she discuss the matches with the coaches?</span> (Future - Question)</p>
                  <p className="text-sm text-gray-500 mt-1">Ela vai discutir as partidas com os treinadores?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('They will not finish the courses this month.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">They will not finish the courses this month.</span> (Future - Negative)</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não vão terminar os cursos este mês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => playAudio('He didn\'t like the speeches at the conferences.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-red-600">He didn't like the speeches at the conferences.</span> (Past - Negative)</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não gostou dos discursos nas conferências.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                  onClick={() => playAudio('Didn\'t you see the flashes from the cameras?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-red-600">Didn't you see the flashes from the cameras?</span> (Past - Negative Question)</p>
                  <p className="text-sm text-gray-500 mt-1">Você não viu os flashes das câmeras?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS </h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice with real-life situations
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I really need to talk to you.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I'm gonna need to talk to you.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Eu vou precisar conversar com você.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('She talks to her mother about everything.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She'll talk to her mother about everything.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela conversará com a mãe dela sobre tudo.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('My wife loves to watch series.')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">My wife loved to watch series.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Minha esposa adorava assistir séries.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Do you like his ideas?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Did you like his ideas?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você gostou das ideias dele?</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("She doesn't want to talk about this subject.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She didn't want to talk about this subject.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ela não queria falar sobre esse assunto.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("He doesn't have a math exam this week.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He doesn't have a math exam this week.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ele não tem prova de matemática esta semana.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio("It doesn't start today.")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">It doesn't start today.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Não começa hoje.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Does he like to talk about politics?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does he like to talk about politics?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Ele gosta de falar sobre política?</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('Does it finish in an hour?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does it finish in an hour?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Termina em uma hora?</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('What stuff does he want to buy?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What stuff does he want to buy?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Que coisas ele quer comprar?</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('What time does your class start?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What time does your class start?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Que horas sua aula começa?</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('How many languages does your sister speak?')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">How many languages does your sister speak?</span></p>
                  <p className="text-sm text-gray-500 mt-1">Quantos idiomas sua irmã fala?</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Check It Out')} />
            </div>
            <p className="text-sm text-blue-100">
              Practice essential structures with "to go to" and prepositions
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
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* Modal de Anotações */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

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
          0% {
            box-shadow: 0 0 5px rgba(59,130,246,0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(139,92,246,0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59,130,246,0.5);
          }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}