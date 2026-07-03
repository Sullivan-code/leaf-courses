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
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-pink-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
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
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-200 resize-none"
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
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
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
      className="ml-3 text-white hover:text-pink-200 transition-colors focus:outline-none"
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
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
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

// Componente Wrap Up
function WrapUp() {
  return (
    <div className="w-full mx-auto border-2 border-pink-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-pink-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">WRAP UP!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        <div className="bg-pink-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to cut my hair')}>
            • to <strong className="text-pink-300">cut</strong> my hair
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to shave my beard')}>
            • to <strong className="text-pink-300">shave</strong> my beard
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to dye my hair')}>
            • to <strong className="text-pink-300">dye</strong> my hair
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to get a haircut')}>
            • to <strong className="text-pink-300">get a haircut</strong>
          </p>
        </div>

        <div className="bg-white p-6 flex flex-col items-center justify-center gap-3">
          <div className="bg-pink-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-pink-700 cursor-pointer" onClick={() => speakText("I need a haircut")}>I need a haircut.</span>
            <p className="text-sm text-gray-500 mt-1">Eu preciso cortar o cabelo.</p>
          </div>
          <div className="bg-purple-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-purple-700 cursor-pointer" onClick={() => speakText('I like your new hairstyle')}>I like your new hairstyle!</span>
            <p className="text-sm text-gray-500 mt-1">Eu gosto do seu novo penteado!</p>
          </div>
          <div className="bg-pink-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-pink-700 cursor-pointer" onClick={() => speakText('You look great')}>You look great!</span>
            <p className="text-sm text-gray-500 mt-1">Você está ótimo(a)!</p>
          </div>
        </div>

        <div className="bg-pink-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('at the salon')}>
            • at the <strong className="text-pink-300">salon</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('at the barbershop')}>
            • at the <strong className="text-pink-300">barbershop</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I got my hair done yesterday')}>
            • I <strong className="text-pink-300">got my hair done</strong> yesterday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I will get a haircut tomorrow')}>
            • I <strong className="text-pink-300">will get a haircut</strong> tomorrow.
          </p>
        </div>

        <div className="bg-purple-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('How often do you go to the salon')}>
            • <strong className="text-purple-300">How often</strong> do you go to the salon?
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I have already made an appointment')}>
            • I have <strong className="text-purple-300">already made</strong> an appointment.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('She has dyed her hair before')}>
            • She has <strong className="text-purple-300">dyed</strong> her hair before.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('Have you ever had a beard')}>
            • <strong className="text-purple-300">Have you ever</strong> had a beard?
          </p>
        </div>
      </div>
      
      <div className="bg-pink-50 p-6 border-t-2 border-pink-200">
        <h3 className="text-xl font-bold text-pink-800 mb-4 text-center">Practice:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I need to <span className="text-pink-600 font-bold">cut/dye/style</span> my hair.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I <span className="text-pink-600 font-bold">cut/dyed/styled</span> my hair yesterday.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I will <span className="text-pink-600 font-bold">cut/dye/style</span> my hair tomorrow.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I have <span className="text-pink-600 font-bold">cut/dyed/styled</span> my hair.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I go to the <span className="text-pink-600 font-bold">salon/barbershop</span> every month.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I went to the <span className="text-pink-600 font-bold">salon/barbershop</span> last week.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I will go to the <span className="text-pink-600 font-bold">salon/barbershop</span> next week.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center"><span className="text-pink-600 font-bold">How often</span> do you get a haircut?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center"><span className="text-pink-600 font-bold">Have you ever</span> dyed your hair?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">You look <span className="text-pink-600 font-bold">great/amazing/fantastic</span>!</div>
        </div>
      </div>
    </div>
  );
}

export default function LessonSelfCare() {
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
  const mainImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const salonImage = "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const barbershopImage = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const haircutImage = "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80";
  const selfCareImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#fdf2f8] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#831843] mb-6">
            💇‍♀️ Self-Care & Self-Esteem
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a falar sobre cuidados pessoais, cabelo, barba, salão de beleza e barbeiro em inglês. 
            Cuide de você e eleve sua auto-estima! ✨💆‍♂️💆‍♀️
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Self-care and self-esteem"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Click on the verbs to hear the pronunciation and practice their forms</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => speakText('to cut')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to cut
                </button> = cortar
              </li>
              <li>
                <button 
                  onClick={() => speakText('to shave')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to shave
                </button> = barbear / raspar
              </li>
              <li>
                <button 
                  onClick={() => speakText('to dye')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to dye
                </button> = tingir / pintar (cabelo)
              </li>
              <li>
                <button 
                  onClick={() => speakText('to style')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to style
                </button> = pentear / estilizar
              </li>
              <li>
                <button 
                  onClick={() => speakText('to wash')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to wash
                </button> = lavar
              </li>
              <li>
                <button 
                  onClick={() => speakText('to dry')} 
                  className="text-pink-600 font-bold cursor-pointer hover:text-pink-800 transition-colors"
                >
                  to dry
                </button> = secar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-pink-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I cut my hair')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">I cut</span> my hair. / You cut / She cuts</p>
                  <p className="text-sm text-gray-500 mt-1">Eu corto meu cabelo. / Você corta / Ela corta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText("He doesn't shave every day")}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">He doesn't shave</span> every day.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele não se barbeia todo dia.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Do you dye your hair')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">Do you dye</span> your hair?</p>
                  <p className="text-sm text-gray-500 mt-1">Você pinta o cabelo?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('She styles her hair every morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">She styles</span> her hair every morning.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela penteia o cabelo toda manhã.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I wash my hair with shampoo')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">I wash</span> my hair with shampoo.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu lavo meu cabelo com shampoo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('She dries her hair with a hair dryer')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600">She dries</span> her hair with a hair dryer.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela seca o cabelo com secador.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Click on each word to hear its correct pronunciation</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-bold text-pink-600 mb-3">💇‍♀️ For Women / Everyone</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><button onClick={() => speakText('hair')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">hair</button> = cabelo</li>
                  <li><button onClick={() => speakText('haircut')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">haircut</button> = corte de cabelo</li>
                  <li><button onClick={() => speakText('hairstyle')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">hairstyle</button> = penteado / estilo de cabelo</li>
                  <li><button onClick={() => speakText('salon')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">salon</button> = salão de beleza</li>
                  <li><button onClick={() => speakText('shampoo')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">shampoo</button> = shampoo</li>
                  <li><button onClick={() => speakText('conditioner')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">conditioner</button> = condicionador</li>
                  <li><button onClick={() => speakText('hair dryer')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">hair dryer</button> = secador de cabelo</li>
                  <li><button onClick={() => speakText('brush')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">brush</button> = escova de cabelo</li>
                  <li><button onClick={() => speakText('comb')} className="text-pink-600 font-bold cursor-pointer hover:text-pink-800">comb</button> = pente</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-purple-600 mb-3">💇‍♂️ For Men / Everyone</h3>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><button onClick={() => speakText('beard')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">beard</button> = barba</li>
                  <li><button onClick={() => speakText('mustache')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">mustache</button> = bigode</li>
                  <li><button onClick={() => speakText('barbershop')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">barbershop</button> = barbearia</li>
                  <li><button onClick={() => speakText('razor')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">razor</button> = navalha / lâmina</li>
                  <li><button onClick={() => speakText('shaving cream')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">shaving cream</button> = creme de barbear</li>
                  <li><button onClick={() => speakText('trim')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">trim</button> = aparar</li>
                  <li><button onClick={() => speakText('sideburns')} className="text-purple-600 font-bold cursor-pointer hover:text-purple-800">sideburns</button> = costeletas</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 bg-pink-50 p-4 rounded-xl">
              <div className="text-center">
                <p className="font-bold text-pink-600">✨ Self-Care Words</p>
                <button onClick={() => speakText('self-care')} className="text-gray-700 cursor-pointer hover:text-pink-600">self-care</button> = autocuidado
                <br />
                <button onClick={() => speakText('self-esteem')} className="text-gray-700 cursor-pointer hover:text-pink-600">self-esteem</button> = autoestima
              </div>
              <div className="text-center">
                <p className="font-bold text-pink-600">🌟 Positive Words</p>
                <button onClick={() => speakText('beautiful')} className="text-gray-700 cursor-pointer hover:text-pink-600">beautiful</button> = bonito(a)
                <br />
                <button onClick={() => speakText('handsome')} className="text-gray-700 cursor-pointer hover:text-pink-600">handsome</button> = bonito (homem)
              </div>
              <div className="text-center">
                <p className="font-bold text-pink-600">💄 Salon Services</p>
                <button onClick={() => speakText('hair coloring')} className="text-gray-700 cursor-pointer hover:text-pink-600">hair coloring</button> = pintura
                <br />
                <button onClick={() => speakText('hair treatment')} className="text-gray-700 cursor-pointer hover:text-pink-600">hair treatment</button> = tratamento
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-pink-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I need to wash my hair with shampoo')}>
                  <p className="text-lg font-medium text-gray-800">I need to wash my <span className="text-pink-600 font-bold">hair</span> with <span className="text-pink-600 font-bold">shampoo</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso lavar meu cabelo com shampoo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('She goes to the salon every month')}>
                  <p className="text-lg font-medium text-gray-800">She goes to the <span className="text-pink-600 font-bold">salon</span> every month.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela vai ao salão todo mês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('He goes to the barbershop to shave his beard')}>
                  <p className="text-lg font-medium text-gray-800">He goes to the <span className="text-purple-600 font-bold">barbershop</span> to shave his <span className="text-purple-600 font-bold">beard</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele vai à barbearia para barbear a barba.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I like your new hairstyle')}>
                  <p className="text-lg font-medium text-gray-800">I like your new <span className="text-pink-600 font-bold">hairstyle</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto do seu novo penteado!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Self-care is important for self-esteem')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">Self-care</span> is important for <span className="text-pink-600 font-bold">self-esteem</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">O autocuidado é importante para a autoestima.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('You look beautiful with that hairstyle')}>
                  <p className="text-lg font-medium text-gray-800">You look <span className="text-pink-600 font-bold">beautiful</span> with that <span className="text-pink-600 font-bold">hairstyle</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">Você está linda com esse penteado!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('He looks handsome with his new beard')}>
                  <p className="text-lg font-medium text-gray-800">He looks <span className="text-purple-600 font-bold">handsome</span> with his new <span className="text-purple-600 font-bold">beard</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">Ele está bonito com a barba nova!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 USEFUL PHRASES</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases for salon and barbershop visits</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-pink-50 p-4 rounded-xl">
                <h3 className="font-bold text-pink-600 mb-3">💇‍♀️ At the Salon</h3>
                <div className="space-y-3">
                  <p>
                    <button onClick={() => speakText('I need a haircut')} className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium">I need a haircut.</button>
                    <br />
                    <span className="text-sm text-gray-500">Eu preciso cortar o cabelo.</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('Can I make an appointment')} className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium">Can I make an appointment?</button>
                    <br />
                    <span className="text-sm text-gray-500">Posso fazer um agendamento?</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('I would like to dye my hair')} className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium">I would like to dye my hair.</button>
                    <br />
                    <span className="text-sm text-gray-500">Eu gostaria de pintar meu cabelo.</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('Just a trim, please')} className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium">Just a trim, please.</button>
                    <br />
                    <span className="text-sm text-gray-500">Só uma aparada, por favor.</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('I want to style my hair')} className="text-gray-700 cursor-pointer hover:text-pink-600 font-medium">I want to style my hair.</button>
                    <br />
                    <span className="text-sm text-gray-500">Quero pentear meu cabelo.</span>
                  </p>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-600 mb-3">💇‍♂️ At the Barbershop</h3>
                <div className="space-y-3">
                  <p>
                    <button onClick={() => speakText('I need to shave my beard')} className="text-gray-700 cursor-pointer hover:text-purple-600 font-medium">I need to shave my beard.</button>
                    <br />
                    <span className="text-sm text-gray-500">Eu preciso barbear minha barba.</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('Can you trim my mustache')} className="text-gray-700 cursor-pointer hover:text-purple-600 font-medium">Can you trim my mustache?</button>
                    <br />
                    <span className="text-sm text-gray-500">Você pode aparar meu bigode?</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('I want to shape my beard')} className="text-gray-700 cursor-pointer hover:text-purple-600 font-medium">I want to shape my beard.</button>
                    <br />
                    <span className="text-sm text-gray-500">Quero dar forma à minha barba.</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('How much for a haircut and shave')} className="text-gray-700 cursor-pointer hover:text-purple-600 font-medium">How much for a haircut and shave?</button>
                    <br />
                    <span className="text-sm text-gray-500">Quanto custa um corte e barba?</span>
                  </p>
                  <p>
                    <button onClick={() => speakText('I like my hair short')} className="text-gray-700 cursor-pointer hover:text-purple-600 font-medium">I like my hair short.</button>
                    <br />
                    <span className="text-sm text-gray-500">Eu gosto do meu cabelo curto.</span>
                  </p>
                </div>
              </div>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-pink-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I need a haircut and a shave')}>
                  <p className="text-lg font-medium text-gray-800">I need a <span className="text-pink-600 font-bold">haircut</span> and a <span className="text-purple-600 font-bold">shave</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso de um corte e uma barba.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Can I make an appointment for tomorrow')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">Can I make an appointment</span> for tomorrow?</p>
                  <p className="text-sm text-gray-500 mt-1">Posso fazer um agendamento para amanhã?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I would like to dye my hair blonde')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">I would like to dye</span> my hair blonde.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gostaria de pintar meu cabelo de loiro.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Just a trim, please. Not too short')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">Just a trim</span>, please. Not too short.</p>
                  <p className="text-sm text-gray-500 mt-1">Só uma aparada, por favor. Não muito curto.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('You look great with your new hairstyle')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">You look great</span> with your new hairstyle!</p>
                  <p className="text-sm text-gray-500 mt-1">Você está ótimo(a) com seu novo penteado!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Taking care of yourself is important')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-pink-600 font-bold">Taking care of yourself</span> is important!</p>
                  <p className="text-sm text-gray-500 mt-1">Cuidar de si mesmo(a) é importante!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">Learn how to talk about self-care routines in different tenses</p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-pink-50 p-4 rounded-xl">
                <h3 className="font-bold text-pink-600 mb-3">⏰ Present Tense</h3>
                <div className="space-y-2">
                  <button onClick={() => speakText('I cut my hair every month')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                    <span className="text-gray-800">I <span className="text-pink-600 font-bold">cut</span> my hair every month.</span>
                    <br />
                    <span className="text-xs text-gray-500">Eu corto meu cabelo todo mês.</span>
                  </button>
                  <button onClick={() => speakText('She goes to the salon on Saturdays')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                    <span className="text-gray-800">She <span className="text-pink-600 font-bold">goes</span> to the salon on Saturdays.</span>
                    <br />
                    <span className="text-xs text-gray-500">Ela vai ao salão aos sábados.</span>
                  </button>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-600 mb-3">⏰ Past Tense</h3>
                <div className="space-y-2">
                  <button onClick={() => speakText('I got a haircut yesterday')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="text-gray-800">I <span className="text-purple-600 font-bold">got</span> a haircut yesterday.</span>
                    <br />
                    <span className="text-xs text-gray-500">Eu cortei o cabelo ontem.</span>
                  </button>
                  <button onClick={() => speakText('He shaved his beard last week')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="text-gray-800">He <span className="text-purple-600 font-bold">shaved</span> his beard last week.</span>
                    <br />
                    <span className="text-xs text-gray-500">Ele barbeou a barba semana passada.</span>
                  </button>
                </div>
              </div>
              <div className="bg-pink-50 p-4 rounded-xl">
                <h3 className="font-bold text-pink-600 mb-3">⏰ Future Tense</h3>
                <div className="space-y-2">
                  <button onClick={() => speakText('I will dye my hair next week')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                    <span className="text-gray-800">I <span className="text-pink-600 font-bold">will dye</span> my hair next week.</span>
                    <br />
                    <span className="text-xs text-gray-500">Eu vou pintar meu cabelo semana que vem.</span>
                  </button>
                  <button onClick={() => speakText('She is going to style her hair tomorrow')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                    <span className="text-gray-800">She <span className="text-pink-600 font-bold">is going to style</span> her hair tomorrow.</span>
                    <br />
                    <span className="text-xs text-gray-500">Ela vai pentear o cabelo amanhã.</span>
                  </button>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <h3 className="font-bold text-purple-600 mb-3">⏰ Present Perfect</h3>
                <div className="space-y-2">
                  <button onClick={() => speakText('I have already made an appointment')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="text-gray-800">I <span className="text-purple-600 font-bold">have already made</span> an appointment.</span>
                    <br />
                    <span className="text-xs text-gray-500">Eu já fiz um agendamento.</span>
                  </button>
                  <button onClick={() => speakText('Have you ever dyed your hair')} className="block w-full text-left p-2 bg-white rounded-lg hover:bg-purple-100 transition-colors">
                    <span className="text-gray-800"><span className="text-purple-600 font-bold">Have you ever</span> dyed your hair?</span>
                    <br />
                    <span className="text-xs text-gray-500">Você já pintou o cabelo?</span>
                  </button>
                </div>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-pink-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('I cut my hair every month. I got a haircut yesterday. I will get a haircut tomorrow. I have already gotten a haircut this month')}>
                  <p className="text-lg font-medium text-gray-800">Present: I <span className="text-pink-600 font-bold">cut</span> my hair every month.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu corto meu cabelo todo mês.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Past: I <span className="text-pink-600 font-bold">got</span> a haircut yesterday.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu cortei o cabelo ontem.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Future: I <span className="text-pink-600 font-bold">will get</span> a haircut tomorrow.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu vou cortar o cabelo amanhã.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Present Perfect: I <span className="text-pink-600 font-bold">have already gotten</span> a haircut this month.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu já cortei o cabelo este mês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('She dyes her hair blonde. She dyed her hair last month. She will dye her hair next month. She has dyed her hair many times')}>
                  <p className="text-lg font-medium text-gray-800">Present: She <span className="text-pink-600 font-bold">dyes</span> her hair blonde.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela pinta o cabelo de loiro.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Past: She <span className="text-pink-600 font-bold">dyed</span> her hair last month.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela pintou o cabelo mês passado.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Future: She <span className="text-pink-600 font-bold">will dye</span> her hair next month.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela vai pintar o cabelo mês que vem.</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Present Perfect: She <span className="text-pink-600 font-bold">has dyed</span> her hair many times.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela já pintou o cabelo muitas vezes.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-pink-200 cursor-pointer hover:bg-pink-50 transition-colors"
                  onClick={() => speakText('Do you shave your beard every day? Did you shave yesterday? Will you shave tomorrow? Have you ever had a beard')}>
                  <p className="text-lg font-medium text-gray-800">Present: <span className="text-pink-600 font-bold">Do you shave</span> your beard every day?</p>
                  <p className="text-sm text-gray-500 mt-1">Você barbeia a barba todo dia?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Past: <span className="text-pink-600 font-bold">Did you shave</span> yesterday?</p>
                  <p className="text-sm text-gray-500 mt-1">Você barbeou ontem?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Future: <span className="text-pink-600 font-bold">Will you shave</span> tomorrow?</p>
                  <p className="text-sm text-gray-500 mt-1">Você vai barbear amanhã?</p>
                  <p className="text-lg font-medium text-gray-800 mt-2">Present Perfect: <span className="text-pink-600 font-bold">Have you ever</span> had a beard?</p>
                  <p className="text-sm text-gray-500 mt-1">Você já teve barba?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Make It Yours */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-pink-100">
              Replace the blue words to practice
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-pink-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('I need to cut my hair')} 
                        className="mr-3 mt-1 text-pink-600 hover:text-pink-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I need to <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('cut')}
                          >cut</span> my hair.
                        </p>
                        <p className="text-sm text-gray-600">Eu preciso cortar meu cabelo. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">I needed to cut my hair yesterday. (passado)</p>
                        <p className="text-md text-gray-500 italic">I will need to cut my hair tomorrow. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('She goes to the salon every month')} 
                        className="mr-3 mt-1 text-pink-600 hover:text-pink-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          She goes to the <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('salon')}
                          >salon</span> every month.
                        </p>
                        <p className="text-sm text-gray-600">Ela vai ao salão todo mês. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">She went to the salon last month. (passado)</p>
                        <p className="text-md text-gray-500 italic">She has gone to the salon many times. (present perfect)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('He shaves his beard every week')} 
                        className="mr-3 mt-1 text-pink-600 hover:text-pink-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          He <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('shaves')}
                          >shaves</span> his <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('beard')}
                          >beard</span> every week.
                        </p>
                        <p className="text-sm text-gray-600">Ele barbeia a barba toda semana. (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">He shaved his beard last week. (passado)</p>
                        <p className="text-md text-gray-500 italic">He will shave his beard next week. (futuro)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('I like your new hairstyle')} 
                        className="mr-3 mt-1 text-pink-600 hover:text-pink-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          I like your new <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('hairstyle')}
                          >hairstyle</span>!
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto do seu novo penteado! (presente)</p>
                        <p className="text-md text-gray-500 mt-1 italic">I liked your old hairstyle too. (passado)</p>
                        <p className="text-md text-gray-500 italic">I have always liked your hairstyle. (present perfect)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => speakText('Taking care of yourself is important for self-esteem')} 
                        className="mr-3 mt-1 text-pink-600 hover:text-pink-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          Taking care of yourself is important for <span className="text-pink-600 font-bold cursor-pointer hover:text-pink-800"
                            onClick={() => speakText('self-esteem')}
                          >self-esteem</span>.
                        </p>
                        <p className="text-sm text-gray-600">Cuidar de si mesmo é importante para a autoestima.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={salonImage}
                        alt="Hair salon"
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      At the hair salon 💇‍♀️
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={barbershopImage}
                        alt="Barbershop"
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      At the barbershop 💇‍♂️
                    </p>
                  </div>
                </div>
              </div>

              {openDrills.wrapUp && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-pink-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-pink-700 mb-4">More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I need to <span className="text-pink-600 font-bold">cut/dye/style</span> my hair.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I <span className="text-pink-600 font-bold">cut/dyed/styled</span> my hair yesterday.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I will <span className="text-pink-600 font-bold">cut/dye/style</span> my hair tomorrow.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I have <span className="text-pink-600 font-bold">cut/dyed/styled</span> my hair.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I go to the <span className="text-pink-600 font-bold">salon/barbershop</span> every month.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I went to the <span className="text-pink-600 font-bold">salon/barbershop</span> last week.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I will go to the <span className="text-pink-600 font-bold">salon/barbershop</span> next week.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center"><span className="text-pink-600 font-bold">How often</span> do you get a haircut?</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center"><span className="text-pink-600 font-bold">Have you ever</span> dyed your hair?</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">You look <span className="text-pink-600 font-bold">great/amazing/fantastic</span>!</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I want a <span className="text-pink-600 font-bold">trim/cut/shape</span> today.</div>
                    <div className="p-3 bg-pink-50 rounded-xl text-center">I like my hair <span className="text-pink-600 font-bold">short/long/medium</span>.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - Wrap Up */}
        <div className="bg-white border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <button 
              onClick={() => toggleDrill('wrapUp')}
              className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.wrapUp ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-pink-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Conjugar os verbos to cut, to shave, to dye, to style</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Vocabulário sobre cabelo, barba, salão e barbearia</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Frases úteis para salão de beleza e barbeiro</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Falar sobre autocuidado e autoestima</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Usar Present Perfect: have/has + past participle</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Formar frases no futuro com will e going to</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Elogiar o visual de alguém em inglês</span></div>
            <div className="flex items-center"><span className="bg-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar sobre frequência: How often...?</span></div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="inline-block rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
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
            box-shadow: 0 0 5px rgba(236,72,153,0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(168,85,247,0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(236,72,153,0.5);
          }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}