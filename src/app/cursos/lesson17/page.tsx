"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// SPEECH SYSTEM WITH AMERICAN FEMALE VOICE
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

// Component for individual word pronunciation
const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    const voices = window.speechSynthesis.getVoices();
    
    const americanFemaleVoices = voices.filter(voice => 
      (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
      (voice.name.toLowerCase().includes('samantha') || 
       voice.name.toLowerCase().includes('google us english') ||
       voice.name.toLowerCase().includes('siri') ||
       voice.name.toLowerCase().includes('female') ||
       voice.name === 'Google US English' ||
       voice.name === 'Samantha')
    );
    
    const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
    
    if (americanFemaleVoices.length > 0) {
      utterance.voice = americanFemaleVoices[0];
    } else if (americanVoices.length > 0) {
      utterance.voice = americanVoices[0];
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// Component for pronouncing entire sentences
const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === 'string' ? children : text;
        if (speechText && typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = 'en-US';
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          
          const voices = window.speechSynthesis.getVoices();
          
          const americanFemaleVoices = voices.filter(voice => 
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
            (voice.name.toLowerCase().includes('samantha') || 
             voice.name.toLowerCase().includes('google us english') ||
             voice.name === 'Google US English')
          );
          
          const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
          
          if (americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          } else if (americanVoices.length > 0) {
            utterance.voice = americanVoices[0];
          }
          
          window.speechSynthesis.speak(utterance);
        }
      }}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// Note Modal Component
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

// Pencil Icon Component
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

// CheckItOutHorizontal Component
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
      <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
        {/* COLUMN 1 - Places */}
        <div className="bg-green-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">PLACES IN THE CITY</h3>
          <SpeakSentence text="at the bank" className="block cursor-pointer hover:opacity-70">
            • at the bank
          </SpeakSentence>
          <SpeakSentence text="at the hospital" className="block cursor-pointer hover:opacity-70">
            • at the hospital
          </SpeakSentence>
          <SpeakSentence text="at the office" className="block cursor-pointer hover:opacity-70">
            • at the office
          </SpeakSentence>
          <SpeakSentence text="at the grocery store" className="block cursor-pointer hover:opacity-70">
            • at the grocery store
          </SpeakSentence>
          <SpeakSentence text="at the gas station" className="block cursor-pointer hover:opacity-70">
            • at the gas station
          </SpeakSentence>
          <SpeakSentence text="I work at the bank." className="block cursor-pointer hover:opacity-70 mt-4 pt-4 border-t border-green-600">
            • I work at the bank.
          </SpeakSentence>
          <SpeakSentence text="She works at the hospital." className="block cursor-pointer hover:opacity-70">
            • She works at the hospital.
          </SpeakSentence>
        </div>

        {/* COLUMN 2 - Daily Routine */}
        <div className="bg-red-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">DAILY ROUTINE</h3>
          <SpeakSentence text="wake up early" className="block cursor-pointer hover:opacity-70">
            • wake up early
          </SpeakSentence>
          <SpeakSentence text="go to bed late" className="block cursor-pointer hover:opacity-70">
            • go to bed late
          </SpeakSentence>
          <SpeakSentence text="take a shower" className="block cursor-pointer hover:opacity-70">
            • take a shower
          </SpeakSentence>
          <SpeakSentence text="get up at 6 AM" className="block cursor-pointer hover:opacity-70">
            • get up at 6 AM
          </SpeakSentence>
          <div className="mt-4 pt-4 border-t border-red-600">
            <h4 className="font-bold text-yellow-300 mb-2">QUESTIONS</h4>
            <SpeakSentence text="Do you wake up early?" className="block cursor-pointer hover:opacity-70">
              • Do you wake up early?
            </SpeakSentence>
            <SpeakSentence text="When do you take a shower?" className="block cursor-pointer hover:opacity-70">
              • When do you take a shower?
            </SpeakSentence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson17PersonalInfoRoutine() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
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

  // Initialize voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Images
  const mainImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";
  const cityImage = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";
  const workImage = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3";
  const routineImage = "https://images.unsplash.com/photo-1544717305-99670f9c28f4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3";
  const sleepImage = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3";
  const morningRoutineImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";

  // Lesson 17 data
  const verbs = [
    { english: "to work", portuguese: "trabalhar" },
    { english: "to sleep", portuguese: "dormir" }
  ];

  const newWords = [
    { english: "company", portuguese: "empresa" },
    { english: "office", portuguese: "escritório" },
    { english: "bank", portuguese: "banco" },
    { english: "church", portuguese: "igreja" },
    { english: "drugstore", portuguese: "farmácia" },
    { english: "grocery store", portuguese: "supermercado" },
    { english: "remotely", portuguese: "remotamente, de casa" },
    { english: "part-time job", portuguese: "emprego de meio período" },
    { english: "hospital", portuguese: "hospital" },
    { english: "gas station", portuguese: "posto de gasolina" },
    { english: "job", portuguese: "trabalho, emprego" },
    { english: "early", portuguese: "cedo" },
    { english: "late", portuguese: "tarde, atrasado" },
    { english: "usually", portuguese: "normalmente, geralmente" },
    { english: "now", portuguese: "agora" },
    { english: "when", portuguese: "quando" },
    { english: "but", portuguese: "mas, porém" }
  ];

  const usefulPhrases = [
    { english: "I need to take a shower.", portuguese: "Eu preciso tomar banho." },
    { english: "I get up early every day.", portuguese: "Eu acordo cedo todo dia." },
    { english: "I go to bed late.", portuguese: "Eu vou dormir tarde." },
    { english: "He goes to work early.", portuguese: "Ele vai trabalhar cedo." },
    { english: "She gets up at 6.", portuguese: "Ela acorda às 6." }
  ];

  const grammarExamples = [
    { english: "When does he need to go?", portuguese: "Quando ele precisa ir?" },
    { english: "When does she read the news?", portuguese: "Quando ela lê as notícias?" },
    { english: "When do you have to go to the office?", portuguese: "Quando você tem que ir ao escritório?" },
    { english: "When do they want to go to church?", portuguese: "Quando eles querem ir à igreja?" },
    { english: "I work at the bank.", portuguese: "Eu trabalho no banco." },
    { english: "They don't work at the hospital.", portuguese: "Eles não trabalham no hospital." },
    { english: "We work at the gas station.", portuguese: "Nós trabalhamos no posto de gasolina." },
    { english: "Do you work at the office?", portuguese: "Você trabalha no escritório?" },
    { english: "It opens at 8.", portuguese: "Ele (o estabelecimento) abre às 8." }
  ];

  // Real Life Practice Sentences - EXPANDED
  const realLifeSentences = [
    { english: "I work at the hospital.", portuguese: "Eu trabalho no hospital." },
    { english: "She works at the bank.", portuguese: "Ela trabalha no banco." },
    { english: "He works at the office.", portuguese: "Ele trabalha no escritório." },
    { english: "They work at the grocery store.", portuguese: "Eles trabalham no supermercado." },
    { english: "We work at the gas station.", portuguese: "Nós trabalhamos no posto de gasolina." },
    { english: "Do you work at the bank?", portuguese: "Você trabalha no banco?" },
    { english: "Does she work at the hospital?", portuguese: "Ela trabalha no hospital?" },
    { english: "Does he work at the office?", portuguese: "Ele trabalha no escritório?" },
    { english: "Do they work at the grocery store?", portuguese: "Eles trabalham no supermercado?" },
    { english: "I wake up early every day.", portuguese: "Eu acordo cedo todo dia." },
    { english: "She wakes up at 6 AM.", portuguese: "Ela acorda às 6 da manhã." },
    { english: "He wakes up late on weekends.", portuguese: "Ele acorda tarde nos fins de semana." },
    { english: "Do you wake up early?", portuguese: "Você acorda cedo?" },
    { english: "When do you take a shower?", portuguese: "Quando você toma banho?" },
    { english: "I take a shower in the morning.", portuguese: "Eu tomo banho de manhã." },
    { english: "She takes a shower at night.", portuguese: "Ela toma banho à noite." },
    { english: "He needs to go to the drugstore.", portuguese: "Ele precisa ir à farmácia." },
    { english: "We need to go to the grocery store.", portuguese: "Nós precisamos ir ao supermercado." },
    { english: "Do you have a part-time job?", portuguese: "Você tem um emprego de meio período?" },
    { english: "I work remotely from home.", portuguese: "Eu trabalho remotamente de casa." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📅 Lesson 17 - Personal Information & Routine
          </h1>
          <SpeakSentence text="Learn how to talk about daily routines, places in the city, and work/study habits using the simple present tense." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn how to talk about daily routines, places in the city, and work/study habits using the simple present tense.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Daily routine and work habits"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">🏢 Work, routines, and places in the city</p>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <SpeakText text={verb.english} className="text-blue-600 font-bold">
                    {verb.english}
                  </SpeakText> = {verb.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <SpeakText text="She works" className="text-blue-600 font-bold">She works</SpeakText> / <SpeakText text="He works" className="text-blue-600 font-bold">He works</SpeakText> / <SpeakText text="They work" className="text-blue-600 font-bold">They work</SpeakText> / <SpeakText text="We work" className="text-blue-600 font-bold">We work</SpeakText> / <SpeakText text="I work" className="text-blue-600 font-bold">I work</SpeakText> / <SpeakText text="You work" className="text-blue-600 font-bold">You work</SpeakText>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela trabalha / Ele trabalha / Eles trabalham / Nós trabalhamos / Eu trabalho / Você trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="She sleeps" className="text-blue-600 font-bold">She sleeps</SpeakText> / <SpeakText text="He sleeps" className="text-blue-600 font-bold">He sleeps</SpeakText> / <SpeakText text="They sleep" className="text-blue-600 font-bold">They sleep</SpeakText> / <SpeakText text="We sleep" className="text-blue-600 font-bold">We sleep</SpeakText> / <SpeakText text="I sleep" className="text-blue-600 font-bold">I sleep</SpeakText> / <SpeakText text="You sleep" className="text-blue-600 font-bold">You sleep</SpeakText>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela dorme / Ele dorme / Eles dormem / Nós dormimos / Eu durmo / Você dorme</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="Does she work at the office" className="text-blue-600 font-bold">Does she work at the office</SpeakText>? / <SpeakText text="Does he work at the bank" className="text-blue-600 font-bold">Does he work at the bank</SpeakText>? / <SpeakText text="Do you work from home" className="text-blue-600 font-bold">Do you work from home</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela trabalha no escritório? / Ele trabalha no banco? / Você trabalha em casa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="Does she sleep early" className="text-blue-600 font-bold">Does she sleep early</SpeakText>? / <SpeakText text="Does he sleep late" className="text-blue-600 font-bold">Does he sleep late</SpeakText>? / <SpeakText text="Do you sleep well" className="text-blue-600 font-bold">Do you sleep well</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela dorme cedo? / Ele dorme tarde? / Você dorme bem?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="Where does he work" className="text-blue-600 font-bold">Where does he work</SpeakText>? / <SpeakText text="Where does she work" className="text-blue-600 font-bold">Where does she work</SpeakText>? / <SpeakText text="Where do you work" className="text-blue-600 font-bold">Where do you work</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Onde ele trabalha? / Onde ela trabalha? / Onde você trabalha?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="I work every day" className="text-blue-600 font-bold">I work every day</SpeakText>. / <SpeakText text="She works from Monday to Friday" className="text-blue-600 font-bold">She works from Monday to Friday</SpeakText>. / <SpeakText text="They work only in the morning" className="text-blue-600 font-bold">They work only in the morning</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu trabalho todos os dias / Ela trabalha de segunda a sexta / Eles trabalham apenas pela manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="We sleep eight hours a night" className="text-blue-600 font-bold">We sleep eight hours a night</SpeakText>. / <SpeakText text="She sleeps six hours" className="text-blue-600 font-bold">She sleeps six hours</SpeakText>. / <SpeakText text="He sleeps a little" className="text-blue-600 font-bold">He sleeps a little</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós dormimos oito horas por noite / Ela dorme seis horas / Ele dorme pouco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="Do you work on weekends" className="text-blue-600 font-bold">Do you work on weekends</SpeakText>? / <SpeakText text="Do they work on holidays" className="text-blue-600 font-bold">Do they work on holidays</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você trabalha aos finais de semana? / Eles trabalham em feriados?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <SpeakText text="I don't work on Sundays" className="text-blue-600 font-bold">I don't work on Sundays</SpeakText>. / <SpeakText text="She doesn't sleep during the day" className="text-blue-600 font-bold">She doesn't sleep during the day</SpeakText>. / <SpeakText text="They don't work at night" className="text-blue-600 font-bold">They don't work at night</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu não trabalho aos domingos / Ela não dorme durante o dia / Eles não trabalham à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <SpeakText text="Does she work as a doctor" className="text-blue-600 font-bold">Does she work as a doctor</SpeakText>? / <SpeakText text="Does he work as a teacher" className="text-blue-600 font-bold">Does he work as a teacher</SpeakText>? / <SpeakText text="Do you work as an engineer" className="text-blue-600 font-bold">Do you work as an engineer</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela trabalha como médica? / Ele trabalha como professor? / Você trabalha como engenheiro?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWords.map((word, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.english}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.portuguese}</div>
                </div>
              ))}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <SpeakSentence text="I work at a company." className="text-blue-600 font-bold">
                  I work at a company.
                </SpeakSentence> = Eu trabalho em uma empresa.
              </p>
              <p>
                <SpeakSentence text="She works at the bank." className="text-blue-600 font-bold">
                  She works at the bank.
                </SpeakSentence> = Ela trabalha no banco.
              </p>
              <p>
                <SpeakSentence text="He works at the office." className="text-blue-600 font-bold">
                  He works at the office.
                </SpeakSentence> = Ele trabalha no escritório.
              </p>
              <p>
                <SpeakSentence text="We go to the grocery store." className="text-blue-600 font-bold">
                  We go to the grocery store.
                </SpeakSentence> = Nós vamos ao supermercado.
              </p>
              <p>
                <SpeakSentence text="I usually wake up early." className="text-blue-600 font-bold">
                  I usually wake up early.
                </SpeakSentence> = Eu normalmente acordo cedo.
              </p>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Where do you work" className="text-blue-600 font-bold">Where do you work</SpeakText>? / <SpeakText text="Where does she work" className="text-blue-600 font-bold">Where does she work</SpeakText>? / <SpeakText text="Where does he work" className="text-blue-600 font-bold">Where does he work</SpeakText>? / <SpeakText text="Where do they work" className="text-blue-600 font-bold">Where do they work</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Onde você trabalha? / Onde ela trabalha? / Onde ele trabalha? / Onde eles trabalham?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Does she usually wake up early" className="text-blue-600 font-bold">Does she usually wake up early</SpeakText>? / <SpeakText text="Does he usually wake up early" className="text-blue-600 font-bold">Does he usually wake up early</SpeakText>? / <SpeakText text="Do you usually wake up early" className="text-blue-600 font-bold">Do you usually wake up early</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela normalmente acorda cedo? / Ele normalmente acorda cedo? / Você normalmente acorda cedo?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="I work at the hospital" className="text-blue-600 font-bold">I work at the hospital</SpeakText>. / <SpeakText text="I work at the bank" className="text-blue-600 font-bold">at the bank</SpeakText>. / <SpeakText text="I work at the company" className="text-blue-600 font-bold">at the company</SpeakText>. / <SpeakText text="I work at the office" className="text-blue-600 font-bold">at the office</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu trabalho no hospital / no banco / na empresa / no escritório</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="She goes to church on Sundays" className="text-blue-600 font-bold">She goes to church on Sundays</SpeakText>. / <SpeakText text="She goes to the bank" className="text-blue-600 font-bold">to the bank</SpeakText>. / <SpeakText text="She goes to the grocery store" className="text-blue-600 font-bold">to the grocery store</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela vai à igreja aos domingos / ao banco / ao supermercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="He needs to go to the drugstore" className="text-blue-600 font-bold">He needs to go to the drugstore</SpeakText>. / <SpeakText text="to the gas station" className="text-blue-600 font-bold">to the gas station</SpeakText>. / <SpeakText text="to the hospital" className="text-blue-600 font-bold">to the hospital</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele precisa ir à farmácia / ao posto de gasolina / ao hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="I have a new job" className="text-blue-600 font-bold">I have a new job</SpeakText>. / <SpeakText text="I have a good job" className="text-blue-600 font-bold">a good job</SpeakText>. / <SpeakText text="I have a part-time job" className="text-blue-600 font-bold">a part-time job</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu tenho um novo emprego / um bom emprego / um emprego em tempo parcial</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="She wakes up early" className="text-blue-600 font-bold">She wakes up early</SpeakText>. / <SpeakText text="She gets up early" className="text-blue-600 font-bold">She gets up early</SpeakText>. / <SpeakText text="She goes to bed late" className="text-blue-600 font-bold">She goes to bed late</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela acorda cedo / levanta cedo / vai dormir tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="He arrives late to work" className="text-blue-600 font-bold">He arrives late to work</SpeakText>. / <SpeakText text="to school" className="text-blue-600 font-bold">to school</SpeakText>. / <SpeakText text="to class" className="text-blue-600 font-bold">to class</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele chega tarde ao trabalho / à escola / à aula</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Practice common phrases to talk about daily routines" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about daily routines
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <SpeakSentence text={phrase.english} className="text-blue-600 font-bold cursor-pointer text-lg mb-2 block">
                    {phrase.english}
                  </SpeakSentence>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Do you get up early every day" className="text-blue-600 font-bold">Do you get up early every day</SpeakText>? / <SpeakText text="Does she get up early every day" className="text-blue-600 font-bold">Does she</SpeakText>? / <SpeakText text="Does he get up early every day" className="text-blue-600 font-bold">Does he</SpeakText>? / <SpeakText text="Do they get up early every day" className="text-blue-600 font-bold">Do they</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você acorda cedo todo dia? / Ela acorda cedo todo dia? / Ele acorda cedo todo dia? / Eles acordam cedo todo dia?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Does she go to bed late" className="text-blue-600 font-bold">Does she go to bed late</SpeakText>? / <SpeakText text="Does he go to bed late" className="text-blue-600 font-bold">Does he</SpeakText>? / <SpeakText text="Do they go to bed late" className="text-blue-600 font-bold">Do they</SpeakText>? / <SpeakText text="Do you go to bed late" className="text-blue-600 font-bold">Do you</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela vai dormir tarde? / Ele vai dormir tarde? / Eles vão dormir tarde? / Você vai dormir tarde?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <SpeakText text="do you take a shower" className="text-blue-600 font-bold">do you take a shower</SpeakText>? / <SpeakText text="does she take a shower" className="text-blue-600 font-bold">does she</SpeakText>? / <SpeakText text="does he take a shower" className="text-blue-600 font-bold">does he</SpeakText>? / <SpeakText text="do they take a shower" className="text-blue-600 font-bold">do they</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando você toma banho? / ela toma banho? / ele toma banho? / eles tomam banho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I need to <SpeakText text="go to work" className="text-blue-600 font-bold">go to work</SpeakText> / <SpeakText text="go to school" className="text-blue-600 font-bold">go to school</SpeakText> / <SpeakText text="go to the bank" className="text-blue-600 font-bold">go to the bank</SpeakText> / <SpeakText text="go to the grocery store" className="text-blue-600 font-bold">go to the grocery store</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso ir trabalhar / à escola / ao banco / ao supermercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <SpeakText text="wakes up at 6 AM" className="text-blue-600 font-bold">wakes up at 6 AM</SpeakText> / <SpeakText text="at 7 AM" className="text-blue-600 font-bold">at 7 AM</SpeakText> / <SpeakText text="at 8 AM" className="text-blue-600 font-bold">at 8 AM</SpeakText> / <SpeakText text="at noon" className="text-blue-600 font-bold">at noon</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela acorda às 6 da manhã / às 7 da manhã / às 8 da manhã / ao meio-dia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    They <SpeakText text="go to bed at midnight" className="text-blue-600 font-bold">go to bed at midnight</SpeakText> / <SpeakText text="at 10 PM" className="text-blue-600 font-bold">at 10 PM</SpeakText> / <SpeakText text="at 11 PM" className="text-blue-600 font-bold">at 11 PM</SpeakText> / <SpeakText text="early" className="text-blue-600 font-bold">early</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles vão dormir à meia-noite / às 22h / às 23h / cedo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <SpeakText text="takes a shower in the morning" className="text-blue-600 font-bold">takes a shower in the morning</SpeakText> / <SpeakText text="at night" className="text-blue-600 font-bold">at night</SpeakText> / <SpeakText text="in the afternoon" className="text-blue-600 font-bold">in the afternoon</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele toma banho de manhã / à noite / à tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <SpeakText text="wake up late on weekends" className="text-blue-600 font-bold">wake up late on weekends</SpeakText> / <SpeakText text="on Saturdays" className="text-blue-600 font-bold">on Saturdays</SpeakText> / <SpeakText text="on Sundays" className="text-blue-600 font-bold">on Sundays</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós acordamos tarde nos finais de semana / aos sábados / aos domingos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Do you need to take a shower now" className="text-blue-600 font-bold">Do you need to take a shower now</SpeakText>? / <SpeakText text="later" className="text-blue-600 font-bold">later</SpeakText>? / <SpeakText text="tomorrow" className="text-blue-600 font-bold">tomorrow</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você precisa tomar banho agora? / mais tarde? / amanhã?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Structures for asking questions and making negative statements with do/does" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking questions and making negative statements with do/does
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={example.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {example.english}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{example.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Where does she work" className="text-blue-600 font-bold">Where does she work</SpeakText>? / <SpeakText text="Where does he work" className="text-blue-600 font-bold">Where does he work</SpeakText>? / <SpeakText text="Where do they work" className="text-blue-600 font-bold">Where do they work</SpeakText>? / <SpeakText text="Where do you work" className="text-blue-600 font-bold">Where do you work</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Onde ela trabalha? / Onde ele trabalha? / Onde eles trabalham? / Onde você trabalha?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Does he work at the hospital" className="text-blue-600 font-bold">Does he work at the hospital</SpeakText>? / <SpeakText text="at the bank" className="text-blue-600 font-bold">at the bank</SpeakText>? / <SpeakText text="at the company" className="text-blue-600 font-bold">at the company</SpeakText>? / <SpeakText text="at the office" className="text-blue-600 font-bold">at the office</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele trabalha no hospital? / no banco? / na empresa? / no escritório?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Do they work at the bank" className="text-blue-600 font-bold">Do they work at the bank</SpeakText>? / <SpeakText text="at the office" className="text-blue-600 font-bold">at the office</SpeakText>? / <SpeakText text="at the grocery store" className="text-blue-600 font-bold">at the grocery store</SpeakText>? / <SpeakText text="at the hospital" className="text-blue-600 font-bold">at the hospital</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles trabalham no banco? / no escritório? / no supermercado? / no hospital?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Does she work at an office or at home" className="text-blue-600 font-bold">Does she work at an office or at home</SpeakText>? / <SpeakText text="remotely" className="text-blue-600 font-bold">remotely</SpeakText>? / <SpeakText text="at a hospital" className="text-blue-600 font-bold">at a hospital</SpeakText>? / <SpeakText text="at a school" className="text-blue-600 font-bold">at a school</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela trabalha em um escritório ou em casa? / remotamente? / em um hospital? / em uma escola?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="When does he go to the movies" className="text-blue-600 font-bold">When does he go to the movies</SpeakText>? / <SpeakText text="to the gym" className="text-blue-600 font-bold">to the gym</SpeakText>? / <SpeakText text="to the park" className="text-blue-600 font-bold">to the park</SpeakText>? / <SpeakText text="to the restaurant" className="text-blue-600 font-bold">to the restaurant</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando ele vai ao cinema? / à academia? / ao parque? / ao restaurante?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="When does she see her emails" className="text-blue-600 font-bold">When does she see her emails</SpeakText>? / <SpeakText text="her messages" className="text-blue-600 font-bold">her messages</SpeakText>? / <SpeakText text="her friends" className="text-blue-600 font-bold">her friends</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando ela vê seus emails? / suas mensagens? / seus amigos?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="When does he want to go to Italy" className="text-blue-600 font-bold">When does he want to go to Italy</SpeakText>? / <SpeakText text="to Spain" className="text-blue-600 font-bold">to Spain</SpeakText>? / <SpeakText text="to the USA" className="text-blue-600 font-bold">to the USA</SpeakText>? / <SpeakText text="to Japan" className="text-blue-600 font-bold">to Japan</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando ele quer ir para a Itália? / para a Espanha? / para os EUA? / para o Japão?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="When does she have to go to the hospital" className="text-blue-600 font-bold">When does she have to go to the hospital</SpeakText>? / <SpeakText text="to the doctor" className="text-blue-600 font-bold">to the doctor</SpeakText>? / <SpeakText text="to the dentist" className="text-blue-600 font-bold">to the dentist</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando ela tem que ir ao hospital? / ao médico? / ao dentista?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Does he work at the bank or at the gas station" className="text-blue-600 font-bold">Does he work at the bank or at the gas station</SpeakText>? / <SpeakText text="at the company or at the school" className="text-blue-600 font-bold">at the company or at the school</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele trabalha no banco ou no posto de gasolina? / na empresa ou na escola?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="Do they work at a restaurant" className="text-blue-600 font-bold">Do they work at a restaurant</SpeakText>? / <SpeakText text="at a hotel" className="text-blue-600 font-bold">at a hotel</SpeakText>? / <SpeakText text="at a school" className="text-blue-600 font-bold">at a school</SpeakText>? / <SpeakText text="at a store" className="text-blue-600 font-bold">at a store</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles trabalham em um restaurante? / em um hotel? / em uma escola? / em uma loja?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <SpeakText text="They don't work at the school or at the church" className="text-blue-600 font-bold">They don't work at the school or at the church</SpeakText>. / <SpeakText text="neither at the bank nor at the hospital" className="text-blue-600 font-bold">neither at the bank nor at the hospital</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles não trabalham na escola ou na igreja / nem no banco nem no hospital</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice talking about work and daily routines
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          {index + 1}. {sentence.english}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={cityImage}
                        alt="City and daily routine"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Places in the city and routines
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={workImage}
                        alt="Work and study"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Work and daily habits
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={morningRoutineImage}
                        alt="Morning routine"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Morning routines and schedules
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Check It Out')} />
            </div>
            <p className="text-sm text-blue-100">
              Places in the city & Daily Routine
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Section 7 - Assessment */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 ASSESSMENT</h2>
            <SpeakSentence text="Answer the questions using complete sentences" className="mt-2 text-blue-100 italic">
              📝 Answer the questions using complete sentences
            </SpeakSentence>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">1. Where do you work or study?</p>
                <SpeakSentence text="I work at a company." className="mt-2 text-gray-600 block">
                  (Exemplo: I work at a company. / I study at a university.)
                </SpeakSentence>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">2. What time do you wake up?</p>
                <SpeakSentence text="I wake up at 7 AM." className="mt-2 text-gray-600 block">
                  (Exemplo: I wake up at 7 AM every day. / I usually wake up early.)
                </SpeakSentence>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">3. Where do you usually go during the week?</p>
                <SpeakSentence text="During the week, I go to work." className="mt-2 text-gray-600 block">
                  (Exemplo: During the week, I go to work, to the grocery store, and to the gym.)
                </SpeakSentence>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">4. Do you wake up early or late?</p>
                <SpeakSentence text="I wake up early." className="mt-2 text-gray-600 block">
                  (Exemplo: I wake up early. / I wake up late on weekends.)
                </SpeakSentence>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 - Final Task */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL TASK</h2>
            <SpeakSentence text="Talk about your daily routine:" className="mt-2 text-blue-100 italic">
              🗣️ Talk about your daily routine:
            </SpeakSentence>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 p-6 rounded-2xl space-y-4">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Where you work or study</h3>
                  <SpeakSentence text="I work at a company." className="text-gray-600">
                    (Exemplo: I work at a company. / I study at a university.)
                  </SpeakSentence>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">What time you wake up</h3>
                  <SpeakSentence text="I wake up at 7 AM." className="text-gray-600">
                    (Exemplo: I wake up at 7 AM every day. / I usually wake up early.)
                  </SpeakSentence>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Where you usually go during the week</h3>
                  <SpeakSentence text="I go to work and the grocery store." className="text-gray-600">
                    (Exemplo: During the week, I go to work, to the grocery store, and to the gym.)
                  </SpeakSentence>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-700 italic">💡 Tip: Use the Simple Present Tense to describe your regular routine!</p>
              <SpeakSentence text="I work at a bank. I wake up at 6:30 AM. During the week, I go to the office, to the gym, and sometimes to the grocery store." className="mt-2 text-gray-600 block">
                Exemplo: "I work at a bank. I wake up at 6:30 AM. During the week, I go to the office, to the gym, and sometimes to the grocery store."
              </SpeakSentence>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (16)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson18")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (18) &rarr;
          </button>
        </div>  
      </div>

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}