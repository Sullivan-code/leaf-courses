"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'wrapUp';

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

// Função para sintetizar voz feminina americana
const speakText = (text: string) => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    // Cancela qualquer fala em andamento
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    // Tenta selecionar uma voz feminina americana
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Samantha') || 
         voice.name.includes('Google US English') ||
         voice.name.includes('Microsoft Zira') ||
         voice.name.includes('Female'))
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
    };
    
    setVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    
    window.speechSynthesis.speak(utterance);
  }
};

// Componente Wrap Up com Present Perfect, Passado e Futuro
function WrapUp() {
  return (
    <div className="w-full mx-auto border-2 border-blue-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-blue-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">WRAP UP!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        <div className="bg-blue-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to talk to')}>
            • to talk <strong className="text-blue-300">to</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to speak with')}>
            • to speak <strong className="text-blue-300">with</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to talk about')}>
            • to talk <strong className="text-blue-300">about</strong> / speak <strong className="text-blue-300">about</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70 mt-4 pt-3 border-t border-blue-700" onClick={() => speakText('I have already finished my report')}>
            • I have <strong className="text-blue-300">already finished</strong> my report
          </p>
        </div>

        <div className="bg-white p-6 flex flex-col items-center justify-center gap-3">
          <div className="bg-yellow-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-blue-700 cursor-pointer" onClick={() => speakText("Sorry, I'm late")}>Sorry, I'm late.</span>
            <p className="text-sm text-gray-500 mt-1">Desculpe, estou atrasado.</p>
          </div>
          <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-green-700 cursor-pointer" onClick={() => speakText('No problem')}>No problem. / That's OK.</span>
            <p className="text-sm text-gray-500 mt-1">Não há problema. / Tudo bem.</p>
          </div>
          <div className="bg-purple-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-purple-700 cursor-pointer" onClick={() => speakText('I have written a report')}>I have written a report.</span>
            <p className="text-sm text-gray-500 mt-1">Eu escrevi um relatório.</p>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('on the tablet')}>
            • on the <strong className="text-blue-300">tablet</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('on the phone')}>
            • on the <strong className="text-blue-300">phone</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting starts at 3:00')}>
            • The meeting <strong className="text-blue-300">starts</strong> at 3:00.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting started at 3:00 yesterday')}>
            • The meeting <strong className="text-blue-300">started</strong> at 3:00 yesterday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting will start at 3:00 tomorrow')}>
            • The meeting <strong className="text-blue-300">will start</strong> at 3:00 tomorrow.
          </p>
        </div>

        <div className="bg-indigo-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('What time does it start')}>
            • What time <strong className="text-indigo-300">does it start</strong>?
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I wrote an email yesterday')}>
            • I <strong className="text-indigo-300">wrote</strong> an email yesterday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I will write a book someday')}>
            • I <strong className="text-indigo-300">will write</strong> a book someday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('They have studied together')}>
            • They <strong className="text-indigo-300">have studied</strong> together.
          </p>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 border-t-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Practice:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I talk to my <span className="text-blue-600 font-bold">boss/friend/teacher</span>.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I spoke to my <span className="text-blue-600 font-bold">boss/friend/teacher</span> yesterday.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I will talk to my <span className="text-blue-600 font-bold">boss/friend/teacher</span> tomorrow.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I have talked to my <span className="text-blue-600 font-bold">boss/friend/teacher</span>.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">Sorry, I'm late. → <span className="text-green-600 font-bold">No problem / That's OK</span></div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class starts at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span></div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class started at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span> yesterday.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class will start at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span> tomorrow.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time does it <span className="text-blue-600 font-bold">start/finish</span>?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time did it <span className="text-blue-600 font-bold">start/finish</span> yesterday?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time will it <span className="text-blue-600 font-bold">start/finish</span> tomorrow?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">Have you ever <span className="text-blue-600 font-bold">written/thought/talked</span> about it?</div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson35StudiesIdeasOpinions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    wrapUp: false,
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

  // URLs das imagens
  const mainImage = "https://i.ibb.co/ynvwq6jp/family-and-occupation.jpg";
  const writingImage = "https://i.ibb.co/Nfx8nKV/membros-da-familia-e-relacionamentos.jpg";
  const discussionImage = "https://i.ibb.co/xq0tDFQy/ocupa-es-profissionais.jpg";

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
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 35 - Studies, Ideas & Opinions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a expressar suas opiniões, falar sobre estudos e usar conectores como "why" e "because" em inglês. ✍️💡🗣️
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Studies and ideas"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
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
                  onClick={() => speakText('to write')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to write
                </button> = escrever
              </li>
              <li>
                <button 
                  onClick={() => speakText('to think')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to think
                </button> = pensar, achar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('I write')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I write</span>. / You write. / We write.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu escrevo. / Você escreve. / Nós escrevemos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("He doesn't write")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He doesn't write</span>. / She / You</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não escreve. / Ela / Você</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Do they write')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do they write?</span> / Do you / Does he</p>
                  <p className="text-sm text-gray-500 mt-1">Elas escrevem? / Você / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('What does she write')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What does she write?</span> / When / Where</p>
                  <p className="text-sm text-gray-500 mt-1">O que ela escreve? / Quando / Onde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Do you like to write')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you like to write?</span> / prefer / want</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de escrever? / prefere / quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('I think')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I think</span>. / He thinks. / We think.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu penso. / Ele pensa. / Nós pensamos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("They don't think")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">They don't think</span>. / I / He</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não acham. / Eu / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Do you think')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you think?</span> / Do they / Does she</p>
                  <p className="text-sm text-gray-500 mt-1">Você acha? / Eles / Ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('What do you think')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What do you think?</span> / about this subject / about this problem</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa? / sobre esse assunto / sobre esse problema</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('What do you think about his opinion')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What do you think about his opinion?</span> / her opinion</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa sobre a opinião dele? / dela</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
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
              <li><button onClick={() => speakText('report')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">report</button> = relatório</li>
              <li><button onClick={() => speakText('composition')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">composition</button> = redação</li>
              <li><button onClick={() => speakText('person')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">person</button> = pessoa</li>
              <li><button onClick={() => speakText('boring')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">boring</button> = chato</li>
              <li><button onClick={() => speakText('beautiful')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">beautiful</button> = bonito, bonita</li>
              <li><button onClick={() => speakText('easy')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">easy</button> = fácil</li>
              <li><button onClick={() => speakText('hard')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">hard</button> = difícil</li>
              <li><button onClick={() => speakText('important')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">important</button> = importante</li>
              <li><button onClick={() => speakText('interesting')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">interesting</button> = interessante</li>
              <li><button onClick={() => speakText('funny')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">funny</button> = engraçado</li>
              <li><button onClick={() => speakText('together')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">together</button> = juntos</li>
              <li><button onClick={() => speakText('everybody')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">everybody</button> = todos, todo mundo</li>
              <li><button onClick={() => speakText('why')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">why</button> = por quê</li>
              <li><button onClick={() => speakText('because')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">because</button> = porque</li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('He wants to write a composition')}>
                  <p className="text-lg font-medium text-gray-800">He wants to write a <span className="text-blue-600 font-bold">composition</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele quer escrever uma redação.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('She wants to watch a funny movie')}>
                  <p className="text-lg font-medium text-gray-800">She wants to watch a <span className="text-blue-600 font-bold">funny</span> movie.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer assistir um filme engraçado.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('I need to write an important report')}>
                  <p className="text-lg font-medium text-gray-800">I need to write an <span className="text-blue-600 font-bold">important report</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso escrever um relatório importante.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('I have an important meeting today')}>
                  <p className="text-lg font-medium text-gray-800">I have an <span className="text-blue-600 font-bold">important</span> meeting today.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu tenho uma reunião importante hoje.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('You work with a great person')}>
                  <p className="text-lg font-medium text-gray-800">You work with a great <span className="text-blue-600 font-bold">person</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Você trabalha com uma pessoa ótima.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("We don't live together")}>
                  <p className="text-lg font-medium text-gray-800">We don't live <span className="text-blue-600 font-bold">together</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Nós não moramos juntos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('What do you think about this class')}>
                  <p className="text-lg font-medium text-gray-800">What do you think about this <span className="text-blue-600 font-bold">class</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você pensa sobre esta aula?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("I think it's good")}>
                  <p className="text-lg font-medium text-gray-800">I think it's <span className="text-blue-600 font-bold">good</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu acho que é boa.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("I think it's easy to learn English")}>
                  <p className="text-lg font-medium text-gray-800">I think it's <span className="text-blue-600 font-bold">easy</span> to learn English.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu acho que é fácil aprender inglês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('What do you think about this book')}>
                  <p className="text-lg font-medium text-gray-800">What do you think about this <span className="text-blue-600 font-bold">book</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você acha sobre este livro?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('She talks to everybody')}>
                  <p className="text-lg font-medium text-gray-800">She talks to <span className="text-blue-600 font-bold">everybody</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela conversa com todo mundo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Do you talk to everybody at work')}>
                  <p className="text-lg font-medium text-gray-800">Do you talk to <span className="text-blue-600 font-bold">everybody</span> at work?</p>
                  <p className="text-sm text-gray-500 mt-1">Você conversa com todos no trabalho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Everybody speaks English here')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Everybody</span> speaks English here.</p>
                  <p className="text-sm text-gray-500 mt-1">Todos falam inglês aqui.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Speak Like a Native */}
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases to express opinions and ask for help</p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-4 mb-6">
              <p>
                <button 
                  onClick={() => speakText('How do you say banana in English')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  How do you say "banana" in English?
                </button>
                <br />
                <span className="text-sm text-gray-500">Como se diz "banana" em inglês?</span>
              </p>
              <p>
                <button 
                  onClick={() => speakText("What's the meaning of boring")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What's the meaning of "boring"?
                </button>
                <br />
                <span className="text-sm text-gray-500">O que significa "boring"?</span>
              </p>
              <p>
                <button 
                  onClick={() => speakText('I think so')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que sim.</span>
              </p>
              <p>
                <button 
                  onClick={() => speakText("I don't think so")} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I don't think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que não.</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('How do you say casa in German')}>
                  <p className="text-lg font-medium text-gray-800">How do you say "casa" in <span className="text-blue-600 font-bold">German</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Como se diz "casa" em alemão?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('How do you say dificil in English')}>
                  <p className="text-lg font-medium text-gray-800">How do you say "difícil" in <span className="text-blue-600 font-bold">English</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Como se diz "difícil" em inglês?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("What's the meaning of funny")}>
                  <p className="text-lg font-medium text-gray-800">What's the meaning of "<span className="text-blue-600 font-bold">funny</span>"?</p>
                  <p className="text-sm text-gray-500 mt-1">O que significa "funny"?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText("What's the meaning of together")}>
                  <p className="text-lg font-medium text-gray-800">What's the meaning of "<span className="text-blue-600 font-bold">together</span>"?</p>
                  <p className="text-sm text-gray-500 mt-1">O que significa "together"?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Do you need to study more? I think so')}>
                  <p className="text-lg font-medium text-gray-800">Do you need to study more? <span className="text-blue-600 font-bold">I think so.</span></p>
                  <p className="text-sm text-gray-500 mt-1">Você precisa estudar mais? Eu acho que sim.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Is it easy? I do not think so')}>
                  <p className="text-lg font-medium text-gray-800">Is it easy? <span className="text-blue-600 font-bold">I don't think so.</span></p>
                  <p className="text-sm text-gray-500 mt-1">É fácil? Eu acho que não.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
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
            <p className="text-md text-gray-600 mb-4 italic">Learn how to use WHY (por quê) and BECAUSE (porque) in different tenses</p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-[20px] border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3">WHY? (Por quê?)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><button onClick={() => speakText('Why do you want to watch this movie')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why do you want to watch this movie?</button> <span className="text-xs text-gray-500">(presente)</span></li>
                  <li><button onClick={() => speakText('Why did you watch that movie yesterday')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why did you watch that movie yesterday?</button> <span className="text-xs text-gray-500">(passado)</span></li>
                  <li><button onClick={() => speakText('Why have you watched this movie three times')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why have you watched this movie three times?</button> <span className="text-xs text-gray-500">(present perfect)</span></li>
                  <li><button onClick={() => speakText('Why will you watch that movie tomorrow')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why will you watch that movie tomorrow?</button> <span className="text-xs text-gray-500">(futuro)</span></li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-[20px] border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3">BECAUSE (Porque)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><button onClick={() => speakText("Because it's funny")} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it's funny.</button> <span className="text-xs text-gray-500">(presente)</span></li>
                  <li><button onClick={() => speakText('Because it was funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it was funny.</button> <span className="text-xs text-gray-500">(passado)</span></li>
                  <li><button onClick={() => speakText('Because it has been funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it has been funny.</button> <span className="text-xs text-gray-500">(present perfect)</span></li>
                  <li><button onClick={() => speakText('Because it will be funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it will be funny.</button> <span className="text-xs text-gray-500">(futuro)</span></li>
                </ul>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why do you study English? Because I want to live in the United States')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> do you study English? (presente)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você estuda inglês?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-blue-600 font-bold">Because</span> I want to live in the United States.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu quero morar nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why did you study English? Because I wanted to live in the United States')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> did you study English? (passado)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você estudou inglês?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-blue-600 font-bold">Because</span> I wanted to live in the United States.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu queria morar nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why have you studied English? Because I have always wanted to live in the United States')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> have you studied English? (present perfect)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você tem estudado inglês?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-blue-600 font-bold">Because</span> I have always wanted to live in the United States.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu sempre quis morar nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why will you study English? Because I will want to live in the United States')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> will you study English? (futuro)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que você vai estudar inglês?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2"><span className="text-blue-600 font-bold">Because</span> I will want to live in the United States.</p>
                  <p className="text-sm text-gray-500 mt-1">Porque eu vou querer morar nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why does he need to go now? Because it is late')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> does he need to go now? (presente)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que ele precisa ir agora?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">He needs to go now <span className="text-blue-600 font-bold">because</span> it's late.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele precisa ir agora porque está tarde.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => speakText('Why did he need to go? Because it was late')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Why</span> did he need to go? (passado)</p>
                  <p className="text-sm text-gray-500 mt-1">Por que ele precisou ir?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">He needed to go <span className="text-blue-600 font-bold">because</span> it was late.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele precisou ir porque estava tarde.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Make It Yours */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Replace the blue words to practice
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('I really need to talk to you')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I really need to talk to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('you')}
                          >you</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu preciso muito conversar com você. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">I really needed to talk to you yesterday. (passado)</p>
                        <p className="text-md text-gray-500 italic">I will really need to talk to you tomorrow. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('She talks to her mother about everything')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          She talks to her <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('mother')}
                          >mother</span> about everything.
                        </p>
                        <p className="text-sm text-gray-600">Ela conversa com a mãe dela sobre tudo. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">She talked to her mother yesterday. (passado)</p>
                        <p className="text-md text-gray-500 italic">She has talked to her mother many times. (present perfect)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('My wife loves to watch series')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          My wife loves to watch <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('series')}
                          >series</span>.
                        </p>
                        <p className="text-sm text-gray-600">Minha esposa ama assistir séries. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">My wife will love to watch this new series. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('Do you like his ideas')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Do you like <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('his ideas')}
                          >his ideas</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você gosta das ideias dele? (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">Did you like his ideas? (passado)</p>
                        <p className="text-md text-gray-500 italic">Have you liked his ideas so far? (present perfect)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText("She doesn't want to talk about this subject")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          She doesn't want to talk about <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('this subject')}
                          >this subject</span>.
                        </p>
                        <p className="text-sm text-gray-600">Ela não quer falar sobre esse assunto. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">She didn't want to talk about that subject. (passado)</p>
                        <p className="text-md text-gray-500 italic">She won't want to talk about this subject. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText("He doesn't have a math exam this week")} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          He doesn't have a math exam <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('this week')}
                          >this week</span>.
                        </p>
                        <p className="text-sm text-gray-600">Ele não tem prova de matemática esta semana. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">He didn't have a math exam last week. (passado)</p>
                        <p className="text-md text-gray-500 italic">He won't have a math exam next week. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('Does he like to talk about politics')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Does he like to talk about <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('politics')}
                          >politics</span>?
                        </p>
                        <p className="text-sm text-gray-600">Ele gosta de falar sobre política? (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">Did he like to talk about politics? (passado)</p>
                        <p className="text-md text-gray-500 italic">Will he like to talk about politics? (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('What time does your class start')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          What time does your class <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => speakText('start')}
                          >start</span>?
                        </p>
                        <p className="text-sm text-gray-600">Que horas sua aula começa? (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">What time did your class start yesterday? (passado)</p>
                        <p className="text-md text-gray-500 italic">What time will your class start tomorrow? (futuro)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={writingImage}
                        alt="Student writing a report"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Writing an important report
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={discussionImage}
                        alt="People discussing ideas"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Sharing ideas and opinions
                    </p>
                  </div>
                </div>
              </div>

              {openDrills.wrapUp && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-blue-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I need to talk to <span className="text-blue-600 font-bold">you/her/him</span>.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I needed to talk to <span className="text-blue-600 font-bold">you/her/him</span> yesterday.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I will need to talk to <span className="text-blue-600 font-bold">you/her/him</span> tomorrow.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She talks to her <span className="text-blue-600 font-bold">father/mother/friend</span>.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She talked to her <span className="text-blue-600 font-bold">father/mother/friend</span> yesterday.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Do you like this <span className="text-blue-600 font-bold">idea/book/plan</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Did you like this <span className="text-blue-600 font-bold">idea/book/plan</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Have you ever <span className="text-blue-600 font-bold">written/thought/talked</span> about it?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time does your class <span className="text-blue-600 font-bold">finish/start/begin</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time did your class <span className="text-blue-600 font-bold">finish/start/begin</span> yesterday?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time will your class <span className="text-blue-600 font-bold">finish/start/begin</span> tomorrow?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She has <span className="text-blue-600 font-bold">already finished/written/thought</span> about it.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <button 
              onClick={() => toggleDrill('wrapUp')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.wrapUp ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Conjugar os verbos to write e to think</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Vocabulário sobre estudos e opiniões</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar e responder com Why e Because no presente, passado, present perfect e futuro</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Expressar opiniões com I think so / I don't think so</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar significados: What's the meaning of...?</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar como se diz algo: How do you say...?</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Usar Present Perfect: have/has + past participle</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Formar frases no futuro com will e going to</span></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

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