"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

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

const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
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
  if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
  else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
  window.speechSynthesis.speak(utterance);
};

// Component for individual word pronunciation
const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => speakEnglish(text, 0.9);

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
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// ============================================
// SUBSTITUTION EXERCISE COMPONENT
// ============================================
type OptionType = string | { label: string; replacement: string; pt?: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  options: OptionType[];
  currentIndex: number;
}

function SubstitutionOptions({
  exercise,
  onOptionClick,
}: {
  exercise: SubstitutionExercise;
  onOptionClick: (key: string, index: number) => void;
}) {
  const [showEnglish, setShowEnglish] = useState(true);

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; pt?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentPt: string | undefined;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentPt = currentOption.pt;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => setShowEnglish(prev => !prev);

  const getOptionLabel = (opt: OptionType): string => isObjectOption(opt) ? opt.label : String(opt);
  const getOptionReplacement = (opt: OptionType): string => isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="text-blue-700 font-medium flex-shrink-0">🇺🇸</span>
              <SpeakSentence text={currentSentence} className="text-blue-700 font-medium">
                {currentSentence}
              </SpeakSentence>
            </div>
            {currentPt && (
              <>
                <div className="border-t border-blue-200 my-1"></div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-sm flex-shrink-0">🇧🇷</span>
                  <p className="text-sm text-gray-600">{currentPt}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              onOptionClick(exercise.key, index);
              speakEnglish(getOptionReplacement(option), 0.9);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

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
            placeholder="Escreva aqui suas anotações..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
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
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

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

  const handleOptionClick = (key: string, index: number) => {
    setSubstitutionState(prev => ({ ...prev, [key]: index }));
  };

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

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

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "trabalhar / Eu trabalho. / Você trabalha. / Eles trabalham.",
      options: [
        { label: "trabalhar", replacement: "to work.", pt: "trabalhar" },
        { label: "Eu trabalho", replacement: "I work.", pt: "Eu trabalho." },
        { label: "Você trabalha", replacement: "You work.", pt: "Você trabalha." },
        { label: "Eles trabalham", replacement: "They work.", pt: "Eles trabalham." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eles não trabalham aqui. / Nós / Eu.",
      options: [
        { label: "Eles", replacement: "They don't work here.", pt: "Eles não trabalham aqui." },
        { label: "Nós", replacement: "We don't work here.", pt: "Nós não trabalhamos aqui." },
        { label: "Eu", replacement: "I don't work here.", pt: "Eu não trabalho aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você quer trabalhar aqui? / prefere / gosta.",
      options: [
        { label: "quer", replacement: "Do you want to work here?", pt: "Você quer trabalhar aqui?" },
        { label: "prefere", replacement: "Do you prefer to work here?", pt: "Você prefere trabalhar aqui?" },
        { label: "gosta", replacement: "Do you like to work here?", pt: "Você gosta de trabalhar aqui?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "dormir / Eu durmo. / Nós dormimos. / Elas dormem.",
      options: [
        { label: "dormir", replacement: "to sleep.", pt: "dormir" },
        { label: "Eu durmo", replacement: "I sleep.", pt: "Eu durmo." },
        { label: "Nós dormimos", replacement: "We sleep.", pt: "Nós dormimos." },
        { label: "Elas dormem", replacement: "They sleep.", pt: "Elas dormem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Nós não dormimos à tarde. / Eles / Eu.",
      options: [
        { label: "Nós", replacement: "We don't sleep in the afternoon.", pt: "Nós não dormimos à tarde." },
        { label: "Eles", replacement: "They don't sleep in the afternoon.", pt: "Eles não dormem à tarde." },
        { label: "Eu", replacement: "I don't sleep in the afternoon.", pt: "Eu não durmo à tarde." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Você gosta de dormir à tarde? / precisa / quer.",
      options: [
        { label: "gosta", replacement: "Do you like to sleep in the afternoon?", pt: "Você gosta de dormir à tarde?" },
        { label: "precisa", replacement: "Do you need to sleep in the afternoon?", pt: "Você precisa dormir à tarde?" },
        { label: "quer", replacement: "Do you want to sleep in the afternoon?", pt: "Você quer dormir à tarde?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Do you work every day? / Vocês trabalham todos os dias? / Eles / Você.",
      options: [
        { label: "Do you", replacement: "Do you work every day?", pt: "Você trabalha todos os dias?" },
        { label: "Do they", replacement: "Do they work every day?", pt: "Eles trabalham todos os dias?" },
        { label: "Do we", replacement: "Do we work every day?", pt: "Nós trabalhamos todos os dias?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Você quer trabalhar em casa? / Vocês / Elas.",
      options: [
        { label: "Você", replacement: "Do you want to work from home?", pt: "Você quer trabalhar em casa?" },
        { label: "Vocês", replacement: "Do you all want to work from home?", pt: "Vocês querem trabalhar em casa?" },
        { label: "Elas", replacement: "Do they want to work from home?", pt: "Elas querem trabalhar em casa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Onde você trabalha? / estuda / dorme.",
      options: [
        { label: "trabalha", replacement: "Where do you work?", pt: "Onde você trabalha?" },
        { label: "estuda", replacement: "Where do you study?", pt: "Onde você estuda?" },
        { label: "dorme", replacement: "Where do you sleep?", pt: "Onde você dorme?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "I sleep early every day. / Eu durmo cedo todos os dias. / Eles / Eu.",
      options: [
        { label: "I", replacement: "I sleep early every day.", pt: "Eu durmo cedo todos os dias." },
        { label: "They", replacement: "They sleep early every day.", pt: "Eles dormem cedo todos os dias." },
        { label: "We", replacement: "We sleep early every day.", pt: "Nós dormimos cedo todos os dias." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu preciso ir ao shopping hoje. / hospital / banco.",
      options: [
        { label: "shopping", replacement: "I need to go to the mall today.", pt: "Eu preciso ir ao shopping hoje." },
        { label: "hospital", replacement: "I need to go to the hospital today.", pt: "Eu preciso ir ao hospital hoje." },
        { label: "banco", replacement: "I need to go to the bank today.", pt: "Eu preciso ir ao banco hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você tem que ir à farmácia agora? / empresa / ao mercado.",
      options: [
        { label: "farmácia", replacement: "Do you have to go to the drugstore now?", pt: "Você tem que ir à farmácia agora?" },
        { label: "empresa", replacement: "Do you have to go to the company now?", pt: "Você tem que ir à empresa agora?" },
        { label: "mercado", replacement: "Do you have to go to the market now?", pt: "Você tem que ir ao mercado agora?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eles precisam ir ao posto de gasolina agora. / mercado / restaurante.",
      options: [
        { label: "posto", replacement: "They need to go to the gas station now.", pt: "Eles precisam ir ao posto de gasolina agora." },
        { label: "mercado", replacement: "They need to go to the market now.", pt: "Eles precisam ir ao mercado agora." },
        { label: "restaurante", replacement: "They need to go to the restaurant now.", pt: "Eles precisam ir ao restaurante agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "I usually go to the bank alone. / escritório / café.",
      options: [
        { label: "bank", replacement: "I usually go to the bank alone.", pt: "Eu geralmente vou ao banco sozinho." },
        { label: "office", replacement: "I usually go to the office alone.", pt: "Eu geralmente vou ao escritório sozinho." },
        { label: "coffee shop", replacement: "I usually go to the coffee shop alone.", pt: "Eu geralmente vou ao café sozinho." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Nós geralmente falamos inglês em casa. / alemão / português.",
      options: [
        { label: "inglês", replacement: "We usually speak English at home.", pt: "Nós geralmente falamos inglês em casa." },
        { label: "alemão", replacement: "We usually speak German at home.", pt: "Nós geralmente falamos alemão em casa." },
        { label: "português", replacement: "We usually speak Portuguese at home.", pt: "Nós geralmente falamos português em casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Você geralmente dorme à tarde? / trabalha / estuda.",
      options: [
        { label: "dorme", replacement: "Do you usually sleep in the afternoon?", pt: "Você geralmente dorme à tarde?" },
        { label: "trabalha", replacement: "Do you usually work in the afternoon?", pt: "Você geralmente trabalha à tarde?" },
        { label: "estuda", replacement: "Do you usually study in the afternoon?", pt: "Você geralmente estuda à tarde?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I go to church in the morning. / à escola / ao trabalho.",
      options: [
        { label: "church", replacement: "I go to church in the morning.", pt: "Eu vou à igreja de manhã." },
        { label: "school", replacement: "I go to school in the morning.", pt: "Eu vou à escola de manhã." },
        { label: "work", replacement: "I go to work in the morning.", pt: "Eu vou ao trabalho de manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Você vai à igreja com sua família? / seus filhos / sua mãe.",
      options: [
        { label: "família", replacement: "Do you go to church with your family?", pt: "Você vai à igreja com sua família?" },
        { label: "filhos", replacement: "Do you go to church with your children?", pt: "Você vai à igreja com seus filhos?" },
        { label: "mãe", replacement: "Do you go to church with your mother?", pt: "Você vai à igreja com sua mãe?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eles vão para a escola de manhã? / igreja / trabalho.",
      options: [
        { label: "escola", replacement: "Do they go to school in the morning?", pt: "Eles vão para a escola de manhã?" },
        { label: "igreja", replacement: "Do they go to church in the morning?", pt: "Eles vão à igreja de manhã?" },
        { label: "trabalho", replacement: "Do they go to work in the morning?", pt: "Eles vão ao trabalho de manhã?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "I work, but I don't study. / Nós / Eles.",
      options: [
        { label: "I", replacement: "I work, but I don't study.", pt: "Eu trabalho, mas eu não estudo." },
        { label: "We", replacement: "We work, but we don't study.", pt: "Nós trabalhamos, mas não estudamos." },
        { label: "They", replacement: "They work, but they don't study.", pt: "Eles trabalham, mas não estudam." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu gosto de panquecas, mas não gosto de mel. / manteiga / chocolate.",
      options: [
        { label: "mel", replacement: "I like pancakes, but I don't like honey.", pt: "Eu gosto de panquecas, mas não gosto de mel." },
        { label: "manteiga", replacement: "I like pancakes, but I don't like butter.", pt: "Eu gosto de panquecas, mas não gosto de manteiga." },
        { label: "chocolate", replacement: "I like pancakes, but I don't like chocolate.", pt: "Eu gosto de panquecas, mas não gosto de chocolate." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Você tem um carro novo? / uma casa nova / um emprego novo.",
      options: [
        { label: "carro", replacement: "Do you have a new car?", pt: "Você tem um carro novo?" },
        { label: "casa", replacement: "Do you have a new house?", pt: "Você tem uma casa nova?" },
        { label: "emprego", replacement: "Do you have a new job?", pt: "Você tem um emprego novo?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "When do you go to the movies? / Quando você vai ao cinema? / escritório / empresa.",
      options: [
        { label: "movies", replacement: "When do you go to the movies?", pt: "Quando você vai ao cinema?" },
        { label: "office", replacement: "When do you go to the office?", pt: "Quando você vai ao escritório?" },
        { label: "company", replacement: "When do you go to the company?", pt: "Quando você vai à empresa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Quando você lê seus e-mails? / mensagens / livros.",
      options: [
        { label: "e-mails", replacement: "When do you read your e-mails?", pt: "Quando você lê seus e-mails?" },
        { label: "mensagens", replacement: "When do you read your messages?", pt: "Quando você lê suas mensagens?" },
        { label: "livros", replacement: "When do you read your books?", pt: "Quando você lê seus livros?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Quando você quer ir para a Itália? / Alemanha / Canadá.",
      options: [
        { label: "Itália", replacement: "When do you want to go to Italy?", pt: "Quando você quer ir para a Itália?" },
        { label: "Alemanha", replacement: "When do you want to go to Germany?", pt: "Quando você quer ir para a Alemanha?" },
        { label: "Canadá", replacement: "When do you want to go to Canada?", pt: "Quando você quer ir para o Canadá?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Quando você tem que ir ao hospital? / banco / farmácia.",
      options: [
        { label: "hospital", replacement: "When do you have to go to the hospital?", pt: "Quando você tem que ir ao hospital?" },
        { label: "banco", replacement: "When do you have to go to the bank?", pt: "Quando você tem que ir ao banco?" },
        { label: "farmácia", replacement: "When do you have to go to the drugstore?", pt: "Quando você tem que ir à farmácia?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Eu tenho que ir à farmácia de manhã. / à tarde / à noite.",
      options: [
        { label: "de manhã", replacement: "I have to go to the drugstore in the morning.", pt: "Eu tenho que ir à farmácia de manhã." },
        { label: "à tarde", replacement: "I have to go to the drugstore in the afternoon.", pt: "Eu tenho que ir à farmácia à tarde." },
        { label: "à noite", replacement: "I have to go to the drugstore at night.", pt: "Eu tenho que ir à farmácia à noite." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "I work at the hospital. / Eu trabalho no hospital. / escritório / mercado.",
      options: [
        { label: "hospital", replacement: "I work at the hospital.", pt: "Eu trabalho no hospital." },
        { label: "escritório", replacement: "I work at the office.", pt: "Eu trabalho no escritório." },
        { label: "mercado", replacement: "I work at the market.", pt: "Eu trabalho no mercado." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Você trabalha no banco? / posto de gasolina / cinema.",
      options: [
        { label: "banco", replacement: "Do you work at the bank?", pt: "Você trabalha no banco?" },
        { label: "posto", replacement: "Do you work at the gas station?", pt: "Você trabalha no posto de gasolina?" },
        { label: "cinema", replacement: "Do you work at the movie theater?", pt: "Você trabalha no cinema?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eles trabalham no restaurante? / cafeteria / shopping.",
      options: [
        { label: "restaurante", replacement: "Do they work at the restaurant?", pt: "Eles trabalham no restaurante?" },
        { label: "cafeteria", replacement: "Do they work at the coffee shop?", pt: "Eles trabalham na cafeteria?" },
        { label: "shopping", replacement: "Do they work at the mall?", pt: "Eles trabalham no shopping?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você trabalha no hospital também? / no posto de gasolina / shopping.",
      options: [
        { label: "no hospital", replacement: "Do you also work at the hospital?", pt: "Você trabalha no hospital também?" },
        { label: "no posto", replacement: "Do you also work at the gas station?", pt: "Você trabalha no posto de gasolina também?" },
        { label: "no shopping", replacement: "Do you also work at the mall?", pt: "Você trabalha no shopping também?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Elas não trabalham na escola. / na igreja / em casa.",
      options: [
        { label: "escola", replacement: "They don't work at the school.", pt: "Elas não trabalham na escola." },
        { label: "igreja", replacement: "They don't work at the church.", pt: "Elas não trabalham na igreja." },
        { label: "casa", replacement: "They don't work at home.", pt: "Elas não trabalham em casa." },
      ],
      currentIndex: 0,
    },
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
                {verbsSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
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
                {vocabSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
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
                {phrasesSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
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
                {grammarSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
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
            Next Lessonn (18) &rarr;
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