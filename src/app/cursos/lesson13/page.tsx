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
    <div className="bg-white p-4 rounded-lg border border-blue-200">
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

// ============================================
// NOTE MODAL
// ============================================

function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;

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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

const PencilIcon = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none" aria-label="Fazer anotações" title="Clique para fazer anotações">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  </button>
);

// ============================================
// MAIN COMPONENT – LESSON 13 (Updated)
// ============================================

export default function Lesson13PersonalInfoRoutine() {
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
  const [showAanExplanation, setShowAanExplanation] = useState(false);
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || '',
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  const handleOptionClick = (key: string, index: number) => {
    setSubstitutionState(prev => ({ ...prev, [key]: index }));
  };

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  useEffect(() => {
    if (typeof window !== 'undefined') window.speechSynthesis.getVoices();
  }, []);

  // ========== IMAGES ==========
  const mainImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const electronicsImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80";
  const personalItemsImage = "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80";
  const backgroundImage = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  // ========== STATIC DATA ==========
  const verbs = [
    { english: "to need", portuguese: "precisar (de)" },
    { english: "to have", portuguese: "ter" }
  ];

  const newWords = [
    { english: "cell phone", portuguese: "telefone celular" },
    { english: "tablet", portuguese: "tablet" },
    { english: "computer", portuguese: "computador" },
    { english: "car", portuguese: "carro" },
    { english: "shoes", portuguese: "sapatos" },
    { english: "glasses", portuguese: "óculos" },
    { english: "sunglasses", portuguese: "óculos de sol" },
    { english: "clothes", portuguese: "roupas" },
    { english: "house", portuguese: "casa" },
    { english: "old", portuguese: "velho(a)" },
    { english: "new", portuguese: "novo(a)" },
    { english: "American", portuguese: "americano(a)" },
    { english: "British", portuguese: "britânico(a)" },
    { english: "Brazilian", portuguese: "brasileiro(a)" },
    { english: "Italian", portuguese: "italiano(a)" },
    { english: "really", portuguese: "realmente / muito" },
    { english: "boss", portuguese: "chefe" },
    { english: "husband", portuguese: "marido" },
    { english: "wife", portuguese: "esposa" },
    { english: "a", portuguese: "um / uma" },
    { english: "an", portuguese: "um / uma (antes de som de vogal)" }
  ];

  const usefulPhrases = [
    { english: "I don't need to go to school today.", portuguese: "Eu não preciso ir à escola hoje." },
    { english: "I need to speak to a school teacher.", portuguese: "Eu preciso falar com um professor da escola." },
    { english: "You speak English very well.", portuguese: "Você fala inglês muito bem." }
  ];

  const grammarExamples = [
    { english: "Do you need a tablet?", portuguese: "Você precisa de um tablet?" },
    { english: "I want an apple.", portuguese: "Eu quero uma maçã." },
    { english: "I like your new shoes.", portuguese: "Eu gosto dos seus sapatos novos." },
    { english: "They have an old car.", portuguese: "Eles têm um carro velho." },
    { english: "We want a new house.", portuguese: "Nós queremos uma casa nova." },
    { english: "I have a Brazilian friend.", portuguese: "Eu tenho um amigo brasileiro." },
    { english: "I like American cookies.", portuguese: "Eu gosto de cookies americanos." },
    { english: "Do you have a British co-worker?", portuguese: "Você tem um colega de trabalho britânico?" }
  ];

  // ========== MAKE IT YOURS – with blue highlighted words ==========
  const realLifeSentences = [
    {
      english: "We need to speak with your husband.",
      portuguese: "Precisamos falar com seu marido.",
      parts: [
        { text: "We ", h: false },
        { text: "need", h: true },
        { text: " to ", h: false },
        { text: "speak", h: true },
        { text: " with your ", h: false },
        { text: "husband", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "I need a new computer.",
      portuguese: "Eu preciso de um computador novo.",
      parts: [
        { text: "I ", h: false },
        { text: "need", h: true },
        { text: " a ", h: false },
        { text: "new computer", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "We don't have a Brazilian boss.",
      portuguese: "Nós não temos um chefe brasileiro.",
      parts: [
        { text: "We ", h: false },
        { text: "don't have", h: true },
        { text: " a ", h: false },
        { text: "Brazilian boss", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "I really need new shoes.",
      portuguese: "Eu realmente preciso de sapatos novos.",
      parts: [
        { text: "I ", h: false },
        { text: "really", h: true },
        { text: " ", h: false },
        { text: "need", h: true },
        { text: " ", h: false },
        { text: "new shoes", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "What do you need to study?",
      portuguese: "O que você precisa estudar?",
      parts: [
        { text: "What do you ", h: false },
        { text: "need", h: true },
        { text: " to ", h: false },
        { text: "study", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "They have an old car.",
      portuguese: "Eles têm um carro velho.",
      parts: [
        { text: "They ", h: false },
        { text: "have", h: true },
        { text: " an ", h: false },
        { text: "old car", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "I have a new cell phone.",
      portuguese: "Eu tenho um celular novo.",
      parts: [
        { text: "I ", h: false },
        { text: "have", h: true },
        { text: " a ", h: false },
        { text: "new cell phone", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "I have to go. Bye.",
      portuguese: "Eu tenho que ir. Tchau.",
      parts: [
        { text: "I ", h: false },
        { text: "have to go", h: true },
        { text: ". Bye.", h: false },
      ]
    },
    {
      english: "We really have to study a new language.",
      portuguese: "Nós realmente temos que estudar um novo idioma.",
      parts: [
        { text: "We ", h: false },
        { text: "really", h: true },
        { text: " ", h: false },
        { text: "have to", h: true },
        { text: " ", h: false },
        { text: "study", h: true },
        { text: " a ", h: false },
        { text: "new language", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "Where do you have to go today?",
      portuguese: "Onde você tem que ir hoje?",
      parts: [
        { text: "Where do you ", h: false },
        { text: "have to go", h: true },
        { text: " ", h: false },
        { text: "today", h: true },
        { text: "?", h: false },
      ]
    },
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "precisar / Eu preciso. / Você precisa. / Nós precisamos.",
      options: [
        { label: "precisar", replacement: "to need.", pt: "precisar" },
        { label: "Eu preciso", replacement: "I need.", pt: "Eu preciso." },
        { label: "Você precisa", replacement: "You need.", pt: "Você precisa." },
        { label: "Nós precisamos", replacement: "We need.", pt: "Nós precisamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu preciso ir. / comer / estudar.",
      options: [
        { label: "ir", replacement: "I need to go.", pt: "Eu preciso ir." },
        { label: "comer", replacement: "I need to eat.", pt: "Eu preciso comer." },
        { label: "estudar", replacement: "I need to study.", pt: "Eu preciso estudar." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você não precisa falar. / ir / ver.",
      options: [
        { label: "falar", replacement: "You don't need to speak.", pt: "Você não precisa falar." },
        { label: "ir", replacement: "You don't need to go.", pt: "Você não precisa ir." },
        { label: "ver", replacement: "You don't need to see.", pt: "Você não precisa ver." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você precisa ir? / Nós / Eles.",
      options: [
        { label: "Você", replacement: "Do you need to go?", pt: "Você precisa ir?" },
        { label: "Nós", replacement: "Do we need to go?", pt: "Nós precisamos ir?" },
        { label: "Eles", replacement: "Do they need to go?", pt: "Eles precisam ir?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "O que você precisa estudar? / falar / comer.",
      options: [
        { label: "estudar", replacement: "What do you need to study?", pt: "O que você precisa estudar?" },
        { label: "falar", replacement: "What do you need to speak?", pt: "O que você precisa falar?" },
        { label: "comer", replacement: "What do you need to eat?", pt: "O que você precisa comer?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Aonde você precisa ir? / Elas.",
      options: [
        { label: "Você", replacement: "Where do you need to go?", pt: "Aonde você precisa ir?" },
        { label: "Elas", replacement: "Where do they need to go?", pt: "Aonde elas precisam ir?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "ter / Eu tenho. / Elas têm. / Você tem.",
      options: [
        { label: "ter", replacement: "to have.", pt: "ter" },
        { label: "Eu tenho", replacement: "I have.", pt: "Eu tenho." },
        { label: "Elas têm", replacement: "They have.", pt: "Elas têm." },
        { label: "Você tem", replacement: "You have.", pt: "Você tem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "have to go. / Eu tenho que ir. / comer / estudar.",
      options: [
        { label: "go", replacement: "I have to go.", pt: "Eu tenho que ir." },
        { label: "comer", replacement: "I have to eat.", pt: "Eu tenho que comer." },
        { label: "estudar", replacement: "I have to study.", pt: "Eu tenho que estudar." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Você não tem que ir. / Nós / Eles.",
      options: [
        { label: "Você", replacement: "You don't have to go.", pt: "Você não tem que ir." },
        { label: "Nós", replacement: "We don't have to go.", pt: "Nós não temos que ir." },
        { label: "Eles", replacement: "They don't have to go.", pt: "Eles não têm que ir." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Você tem que estudar de manhã? / Eles / Nós.",
      options: [
        { label: "Você", replacement: "Do you have to study in the morning?", pt: "Você tem que estudar de manhã?" },
        { label: "Eles", replacement: "Do they have to study in the morning?", pt: "Eles têm que estudar de manhã?" },
        { label: "Nós", replacement: "Do we have to study in the morning?", pt: "Nós temos que estudar de manhã?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== NEW WORDS SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "I have new shoes. / roupas novas / óculos de sol novos.",
      options: [
        { label: "shoes", replacement: "I have new shoes.", pt: "Eu tenho sapatos novos." },
        { label: "clothes", replacement: "I have new clothes.", pt: "Eu tenho roupas novas." },
        { label: "sunglasses", replacement: "I have new sunglasses.", pt: "Eu tenho óculos de sol novos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você não precisa de roupas novas. / óculos de sol / sapatos.",
      options: [
        { label: "roupas novas", replacement: "You don't need new clothes.", pt: "Você não precisa de roupas novas." },
        { label: "óculos de sol", replacement: "You don't need new sunglasses.", pt: "Você não precisa de óculos de sol novos." },
        { label: "sapatos", replacement: "You don't need new shoes.", pt: "Você não precisa de sapatos novos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu tenho sapatos velhos. / roupas velhas / óculos de sol velhos.",
      options: [
        { label: "sapatos", replacement: "I have old shoes.", pt: "Eu tenho sapatos velhos." },
        { label: "roupas", replacement: "I have old clothes.", pt: "Eu tenho roupas velhas." },
        { label: "óculos", replacement: "I have old sunglasses.", pt: "Eu tenho óculos de sol velhos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "I have a car. / um computador / uma casa.",
      options: [
        { label: "car", replacement: "I have a car.", pt: "Eu tenho um carro." },
        { label: "computer", replacement: "I have a computer.", pt: "Eu tenho um computador." },
        { label: "house", replacement: "I have a house.", pt: "Eu tenho uma casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Você tem um tablet? / computador / celular.",
      options: [
        { label: "tablet", replacement: "Do you have a tablet?", pt: "Você tem um tablet?" },
        { label: "computador", replacement: "Do you have a computer?", pt: "Você tem um computador?" },
        { label: "celular", replacement: "Do you have a cell phone?", pt: "Você tem um celular?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu tenho um chefe. / um marido / uma esposa.",
      options: [
        { label: "chefe", replacement: "I have a boss.", pt: "Eu tenho um chefe." },
        { label: "marido", replacement: "I have a husband.", pt: "Eu tenho um marido." },
        { label: "esposa", replacement: "I have a wife.", pt: "Eu tenho uma esposa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu não quero uma fatia de torta. / de queijo / de presunto.",
      options: [
        { label: "torta", replacement: "I don't want a slice of pie.", pt: "Eu não quero uma fatia de torta." },
        { label: "queijo", replacement: "I don't want a slice of cheese.", pt: "Eu não quero uma fatia de queijo." },
        { label: "presunto", replacement: "I don't want a slice of ham.", pt: "Eu não quero uma fatia de presunto." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I want a new cell phone. / carro / tablet.",
      options: [
        { label: "cell phone", replacement: "I want a new cell phone.", pt: "Eu quero um celular novo." },
        { label: "car", replacement: "I want a new car.", pt: "Eu quero um carro novo." },
        { label: "tablet", replacement: "I want a new tablet.", pt: "Eu quero um tablet novo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eles querem uma casa nova. / carro / computador.",
      options: [
        { label: "casa", replacement: "They want a new house.", pt: "Eles querem uma casa nova." },
        { label: "carro", replacement: "They want a new car.", pt: "Eles querem um carro novo." },
        { label: "computador", replacement: "They want a new computer.", pt: "Eles querem um computador novo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Você precisa de uma casa nova? / tablet / celular.",
      options: [
        { label: "casa", replacement: "Do you need a new house?", pt: "Você precisa de uma casa nova?" },
        { label: "tablet", replacement: "Do you need a new tablet?", pt: "Você precisa de um tablet novo?" },
        { label: "celular", replacement: "Do you need a new cell phone?", pt: "Você precisa de um celular novo?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "I really like this car. / desta casa / deste computador.",
      options: [
        { label: "car", replacement: "I really like this car.", pt: "Eu gosto muito deste carro." },
        { label: "house", replacement: "I really like this house.", pt: "Eu gosto muito desta casa." },
        { label: "computer", replacement: "I really like this computer.", pt: "Eu gosto muito deste computador." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu realmente tenho que ir agora. / comer / estudar.",
      options: [
        { label: "ir", replacement: "I really have to go now.", pt: "Eu realmente tenho que ir agora." },
        { label: "comer", replacement: "I really have to eat now.", pt: "Eu realmente tenho que comer agora." },
        { label: "estudar", replacement: "I really have to study now.", pt: "Eu realmente tenho que estudar agora." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu preciso estudar inglês hoje. / espanhol / francês.",
      options: [
        { label: "inglês", replacement: "I need to study English today.", pt: "Eu preciso estudar inglês hoje." },
        { label: "espanhol", replacement: "I need to study Spanish today.", pt: "Eu preciso estudar espanhol hoje." },
        { label: "francês", replacement: "I need to study French today.", pt: "Eu preciso estudar francês hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu quero falar com você hoje. / com meu professor / colega de trabalho.",
      options: [
        { label: "com você", replacement: "I want to talk to you today.", pt: "Eu quero falar com você hoje." },
        { label: "com meu professor", replacement: "I want to talk to my teacher today.", pt: "Eu quero falar com meu professor hoje." },
        { label: "colega de trabalho", replacement: "I want to talk to my co-worker today.", pt: "Eu quero falar com meu colega de trabalho hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Elas falam inglês muito bem. / Você / Nós.",
      options: [
        { label: "Elas", replacement: "They speak English very well.", pt: "Elas falam inglês muito bem." },
        { label: "Você", replacement: "You speak English very well.", pt: "Você fala inglês muito bem." },
        { label: "Nós", replacement: "We speak English very well.", pt: "Nós falamos inglês muito bem." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você entende italiano muito bem? / inglês / francês.",
      options: [
        { label: "italiano", replacement: "Do you understand Italian very well?", pt: "Você entende italiano muito bem?" },
        { label: "inglês", replacement: "Do you understand English very well?", pt: "Você entende inglês muito bem?" },
        { label: "francês", replacement: "Do you understand French very well?", pt: "Você entende francês muito bem?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você tem que ir à escola hoje? / precisa / quer.",
      options: [
        { label: "tem que", replacement: "Do you have to go to school today?", pt: "Você tem que ir à escola hoje?" },
        { label: "precisa", replacement: "Do you need to go to school today?", pt: "Você precisa ir à escola hoje?" },
        { label: "quer", replacement: "Do you want to go to school today?", pt: "Você quer ir à escola hoje?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu entendo inglês muito bem. / francês / português.",
      options: [
        { label: "inglês", replacement: "I understand English very well.", pt: "Eu entendo inglês muito bem." },
        { label: "francês", replacement: "I understand French very well.", pt: "Eu entendo francês muito bem." },
        { label: "português", replacement: "I understand Portuguese very well.", pt: "Eu entendo português muito bem." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "We have Italian shoes. / americanos / brasileiros.",
      options: [
        { label: "Italian", replacement: "We have Italian shoes.", pt: "Nós temos sapatos italianos." },
        { label: "American", replacement: "We have American shoes.", pt: "Nós temos sapatos americanos." },
        { label: "Brazilian", replacement: "We have Brazilian shoes.", pt: "Nós temos sapatos brasileiros." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Meus amigos americanos moram aqui. / britânicos / brasileiros.",
      options: [
        { label: "americanos", replacement: "My American friends live here.", pt: "Meus amigos americanos moram aqui." },
        { label: "britânicos", replacement: "My British friends live here.", pt: "Meus amigos britânicos moram aqui." },
        { label: "brasileiros", replacement: "My Brazilian friends live here.", pt: "Meus amigos brasileiros moram aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Eu tenho um chefe britânico. / brasileiro / americano.",
      options: [
        { label: "britânico", replacement: "I have a British boss.", pt: "Eu tenho um chefe britânico." },
        { label: "brasileiro", replacement: "I have a Brazilian boss.", pt: "Eu tenho um chefe brasileiro." },
        { label: "americano", replacement: "I have an American boss.", pt: "Eu tenho um chefe americano." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-10",
      original: "Elas querem roupas novas. / sapatos / óculos de sol.",
      options: [
        { label: "roupas", replacement: "They want new clothes.", pt: "Elas querem roupas novas." },
        { label: "sapatos", replacement: "They want new shoes.", pt: "Elas querem sapatos novos." },
        { label: "óculos", replacement: "They want new sunglasses.", pt: "Elas querem óculos de sol novos." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "I want an orange. / uma maçã / um ovo.",
      options: [
        { label: "orange", replacement: "I want an orange.", pt: "Eu quero uma laranja." },
        { label: "apple", replacement: "I want an apple.", pt: "Eu quero uma maçã." },
        { label: "egg", replacement: "I want an egg.", pt: "Eu quero um ovo." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "I have an old cell phone. / computador / carro.",
      options: [
        { label: "cell phone", replacement: "I have an old cell phone.", pt: "Eu tenho um celular velho." },
        { label: "computer", replacement: "I have an old computer.", pt: "Eu tenho um computador velho." },
        { label: "car", replacement: "I have an old car.", pt: "Eu tenho um carro velho." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Nós não temos um computador velho. / tablet / celular.",
      options: [
        { label: "computador", replacement: "We don't have an old computer.", pt: "Nós não temos um computador velho." },
        { label: "tablet", replacement: "We don't have an old tablet.", pt: "Nós não temos um tablet velho." },
        { label: "celular", replacement: "We don't have an old cell phone.", pt: "Nós não temos um celular velho." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu tenho um amigo americano. / colega de trabalho brasileiro / chefe.",
      options: [
        { label: "amigo", replacement: "I have an American friend.", pt: "Eu tenho um amigo americano." },
        { label: "colega", replacement: "I have a Brazilian co-worker.", pt: "Eu tenho um colega de trabalho brasileiro." },
        { label: "chefe", replacement: "I have an American boss.", pt: "Eu tenho um chefe americano." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu não quero um celular velho. / casa / carro.",
      options: [
        { label: "celular", replacement: "I don't want an old cell phone.", pt: "Eu não quero um celular velho." },
        { label: "casa", replacement: "I don't want an old house.", pt: "Eu não quero uma casa velha." },
        { label: "carro", replacement: "I don't want an old car.", pt: "Eu não quero um carro velho." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "We have Italian shoes. / americanos / brasileiros.",
      options: [
        { label: "Italian", replacement: "We have Italian shoes.", pt: "Nós temos sapatos italianos." },
        { label: "American", replacement: "We have American shoes.", pt: "Nós temos sapatos americanos." },
        { label: "Brazilian", replacement: "We have Brazilian shoes.", pt: "Nós temos sapatos brasileiros." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Você entende seus amigos britânicos? / brasileiros / americanos.",
      options: [
        { label: "britânicos", replacement: "Do you understand your British friends?", pt: "Você entende seus amigos britânicos?" },
        { label: "brasileiros", replacement: "Do you understand your Brazilian friends?", pt: "Você entende seus amigos brasileiros?" },
        { label: "americanos", replacement: "Do you understand your American friends?", pt: "Você entende seus amigos americanos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Meus amigos americanos moram aqui. / britânicos / brasileiros.",
      options: [
        { label: "americanos", replacement: "My American friends live here.", pt: "Meus amigos americanos moram aqui." },
        { label: "britânicos", replacement: "My British friends live here.", pt: "Meus amigos britânicos moram aqui." },
        { label: "brasileiros", replacement: "My Brazilian friends live here.", pt: "Meus amigos brasileiros moram aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eu tenho um chefe britânico. / brasileiro / americano.",
      options: [
        { label: "britânico", replacement: "I have a British boss.", pt: "Eu tenho um chefe britânico." },
        { label: "brasileiro", replacement: "I have a Brazilian boss.", pt: "Eu tenho um chefe brasileiro." },
        { label: "americano", replacement: "I have an American boss.", pt: "Eu tenho um chefe americano." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Elas querem roupas novas. / sapatos / óculos de sol.",
      options: [
        { label: "roupas", replacement: "They want new clothes.", pt: "Elas querem roupas novas." },
        { label: "sapatos", replacement: "They want new shoes.", pt: "Elas querem sapatos novos." },
        { label: "óculos", replacement: "They want new sunglasses.", pt: "Elas querem óculos de sol novos." },
      ],
      currentIndex: 0,
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
            📘 Lesson 13 - Personal Information & Routine
          </h1>
          <SpeakSentence text="Learn to talk about personal belongings, daily needs, and routine activities. Master verbs 'to need' and 'to have'." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about personal belongings, daily needs, and routine activities. Master verbs "to need" and "to have".
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img src={mainImage} alt="Personal items and daily routine" className="w-full h-full object-cover rounded-2xl shadow-md" />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
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
                  <SpeakText text={verb.english} className="text-blue-600 font-bold">{verb.english}</SpeakText> = {verb.portuguese}
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

        {/* ===================== SECTION 2 – NEW WORDS ===================== */}
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

        {/* ===================== SECTION 3 – SPEAK LIKE A NATIVE ===================== */}
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
            <SpeakSentence text="Practice common phrases for daily communication" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
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
            <SpeakSentence text="Structures for asking about needs and possessions" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking about needs and possessions
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

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice personal information and routine
            </div>
          </div>
          <div className="p-8">
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">💡 Dica:</span> Substitua apenas as palavras em <span className="text-blue-600 font-bold">azul</span> por outras palavras para criar novas frases.
                Por exemplo: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">need</span> a <span className="text-blue-600 font-bold">new computer</span>."</span> →
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">have</span> an <span className="text-blue-600 font-bold">old car</span>."</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          <span className="mr-1">{index + 1}.</span>
                          {sentence.parts.map((part, pIdx) => (
                            part.h ? (
                              <span key={pIdx} className="text-blue-600 font-bold">{part.text}</span>
                            ) : (
                              <span key={pIdx}>{part.text}</span>
                            )
                          ))}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={electronicsImage} alt="Cell phones, tablets and computers" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cell phones, tablets and computers</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={personalItemsImage} alt="Cars, shoes and glasses" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cars, shoes and glasses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Practice numbers and the use of articles a/an" className="mt-2 text-blue-100 italic">
                📝 Practice numbers and the use of articles a/an
              </SpeakSentence>
            </div>
            <button
              onClick={() => setShowAanExplanation(!showAanExplanation)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showAanExplanation ? 'Hide A/An Explanation' : 'Show A/An Explanation'}
            </button>
          </div>

          {showAanExplanation && (
            <div className="bg-blue-50 p-6 border-b border-blue-200">
              <h3 className="font-bold text-blue-800 text-lg mb-2">Quando usar "a" vs "an":</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Use <strong>"a"</strong> antes de palavras que começam com som de consoante (a car, a house, a friend)</li>
                <li>Use <strong>"an"</strong> antes de palavras que começam com som de vogal (an apple, an egg, an old car)</li>
                <li>Lembre-se: É sobre o SOM, não a letra. Exemplo: "an hour" (h é mudo), "a university" (u soa como "you")</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-2 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">NUMBERS</h3>
              </div>
              {['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].map((num, i) => (
                <div key={i} className="flex items-center">
                  <SpeakText text={num} className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                  <p>• {i === 0 ? 'zero' : `${i} - ${num}`}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  {['an apple', 'an egg', 'an old car', 'an American teacher'].map((item, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <SpeakText text={item} className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                      <p className="font-bold">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-blue-700">
                  {['a car', 'a house', 'a friend', 'a computer'].map((item, i) => (
                    <div key={i} className="flex items-center mb-2">
                      <SpeakText text={item} className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                      <p className="font-bold">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-700 mt-4">
                <div className="flex items-center">
                  <SpeakText text="What's your phone number?" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                  <p className="text-yellow-300 font-bold">- What's your phone number?</p>
                </div>
                <div className="flex items-center mt-2">
                  <SpeakText text="It's 523-707-4782" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                  <p className="text-yellow-300 font-bold">- It's 523-707-4782.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (12)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (14) &rarr;
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}