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
  showIcon?: boolean;
}

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Clique para ouvir a pronúncia americana"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />}
    </button>
  );
};

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
      className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// ============================================
// SPEAK PORTUGUESE – para instruções em português abaixo dos títulos
// ============================================
const SpeakPortuguese = ({ text, children, className = "" }: { text: string; children?: React.ReactNode; className?: string }) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
    const anyPtVoice = voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (ptBrVoice) utterance.voice = ptBrVoice;
    else if (anyPtVoice) utterance.voice = anyPtVoice;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button
      onClick={speak}
      className={`group inline-flex items-center gap-2 cursor-pointer hover:bg-blue-100/40 px-2 py-1 rounded-lg transition-colors text-left ${className}`}
      title="Clique para ouvir a instrução em português"
    >
      <span>{children || text}</span>
      <Volume2 size={16} className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-300 hover:text-white transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// SUBSTITUTION EXERCISE COMPONENT WITH EYE TOGGLE
// ============================================
type OptionType = string | { label: string; replacement: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  base?: string;
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

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.label;
    }
    return String(opt);
  };

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
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionClick(exercise.key, index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <SpeakText text={getOptionLabel(option)} showIcon={false} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM AZUL
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// COMPONENTE PARA FRASES "MAKE IT YOURS" COM PALAVRAS SUBSTITUÍVEIS EM AZUL
// ============================================
function MakeItYoursPhrase({
  text,
  translation,
  blueWords,
}: {
  text: string;
  translation: string;
  blueWords: string[];
}) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    if (blueWords.some(bw => cleanWord === bw.toLowerCase())) {
      return (
        <span
          key={i}
          className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 hover:bg-blue-50 rounded px-0.5 transition-colors"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(word.replace(/[.,!?;:]/g, ''));
              utterance.lang = 'en-US';
              utterance.rate = 0.9;
              utterance.pitch = 1.0;
              const voices = window.speechSynthesis.getVoices();
              const female = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Female')));
              const anyUS = voices.find(v => v.lang.startsWith('en-US'));
              if (female) utterance.voice = female;
              else if (anyUS) utterance.voice = anyUS;
              window.speechSynthesis.speak(utterance);
            }
          }}
        >
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="group">
      <div className="flex items-start">
        <SpeakSentence text={text} className="text-base font-medium">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600 mt-0.5 ml-6">{translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 1 FOOD & DRINK
// ============================================
export default function Lesson1FoodAndDrink() {
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

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ===== IMAGENS (mesmas de antes) =====
  const mainImage = "/images/first-l1.jpg";
  const readingImage = "/images/reallife-image1.jpg";
  const placesImage = "/images/reallife-image2.jpg";
  const digitalImage = "/images/juice-image.jpg";
  const grammarImage = "/images/first-l1.jpg";
  const backgroundImage = "/images/lesson1-86.jpg";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO – LESSON 1 FOOD & DRINK
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu bebo. / você / ele",
      options: [
        { label: "Eu", replacement: "I drink." },
        { label: "Você", replacement: "You drink." },
        { label: "Ele", replacement: "He drinks." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu como. / você / ela",
      options: [
        { label: "Eu", replacement: "I eat." },
        { label: "Você", replacement: "You eat." },
        { label: "Ela", replacement: "She eats." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu como pão. / gosto / quero",
      options: [
        { label: "como pão", replacement: "I eat bread." },
        { label: "gosto", replacement: "I like." },
        { label: "quero", replacement: "I want." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você bebe café? / gosta / prefere",
      options: [
        { label: "bebe café", replacement: "Do you drink coffee?" },
        { label: "gosta", replacement: "Do you like?" },
        { label: "prefere", replacement: "Do you prefer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Nós comemos queijo. / preferimos / gostamos",
      options: [
        { label: "comemos queijo", replacement: "We eat cheese." },
        { label: "preferimos", replacement: "We prefer." },
        { label: "gostamos", replacement: "We like." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eles bebem água. / preferem / precisam",
      options: [
        { label: "bebem água", replacement: "They drink water." },
        { label: "preferem", replacement: "They prefer." },
        { label: "precisam", replacement: "They need." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ela come biscoitos salgados. / biscoitos doces / ela quer",
      options: [
        { label: "biscoitos salgados", replacement: "She eats crackers." },
        { label: "biscoitos doces", replacement: "She eats cookies." },
        { label: "quer", replacement: "She wants." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu bebo leite. / preciso / gosto",
      options: [
        { label: "bebo leite", replacement: "I drink milk." },
        { label: "preciso", replacement: "I need." },
        { label: "gosto", replacement: "I like." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Você come frutas? / gosta / prefere",
      options: [
        { label: "come frutas", replacement: "Do you eat fruit?" },
        { label: "gosta", replacement: "Do you like?" },
        { label: "prefere", replacement: "Do you prefer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Nós bebemos chá. / preferimos / gostamos",
      options: [
        { label: "bebemos chá", replacement: "We drink tea." },
        { label: "preferimos", replacement: "We prefer." },
        { label: "gostamos", replacement: "We like." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu bebo água. / café / leite",
      options: [
        { label: "água", replacement: "I drink water." },
        { label: "café", replacement: "I drink coffee." },
        { label: "leite", replacement: "I drink milk." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você bebe leite. / chá / suco",
      options: [
        { label: "leite", replacement: "You drink milk." },
        { label: "chá", replacement: "You drink tea." },
        { label: "suco", replacement: "You drink juice." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você come biscoitos salgados. / biscoitos doces / queijo",
      options: [
        { label: "biscoitos salgados", replacement: "You eat crackers." },
        { label: "biscoitos doces", replacement: "You eat cookies." },
        { label: "queijo", replacement: "You eat cheese." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu bebo chá e água, obrigado. / suco e café / café e água",
      options: [
        { label: "chá e água", replacement: "I drink tea and water, thank you." },
        { label: "suco e café", replacement: "I drink juice and coffee, thank you." },
        { label: "café e água", replacement: "I drink coffee and water, thank you." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu como pão com manteiga. / biscoito salgado / panqueca",
      options: [
        { label: "manteiga", replacement: "I eat bread and butter." },
        { label: "biscoito salgado", replacement: "I eat crackers." },
        { label: "panqueca", replacement: "I eat pancakes." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você prefere queijo ou presunto? / manteiga / chá ou leite",
      options: [
        { label: "queijo ou presunto", replacement: "Do you prefer cheese or ham?" },
        { label: "manteiga", replacement: "Do you prefer butter?" },
        { label: "chá ou leite", replacement: "Do you prefer tea or milk?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Nós bebemos suco de laranja. / café / chá",
      options: [
        { label: "suco de laranja", replacement: "We drink orange juice." },
        { label: "café", replacement: "We drink coffee." },
        { label: "chá", replacement: "We drink tea." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eles comem panquecas no café da manhã. / biscoitos / pão",
      options: [
        { label: "panquecas", replacement: "They eat pancakes for breakfast." },
        { label: "biscoitos", replacement: "They eat crackers for breakfast." },
        { label: "pão", replacement: "They eat bread for breakfast." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu gosto de chá. / café / leite",
      options: [
        { label: "chá", replacement: "I like tea." },
        { label: "café", replacement: "I like coffee." },
        { label: "leite", replacement: "I like milk." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Você quer água ou suco? / café / leite",
      options: [
        { label: "água ou suco", replacement: "Do you want water or juice?" },
        { label: "café", replacement: "Do you want coffee?" },
        { label: "leite", replacement: "Do you want milk?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu como biscoitos salgados. E você? / biscoitos doces / panquecas",
      options: [
        { label: "biscoitos salgados", replacement: "I eat crackers. And you?" },
        { label: "biscoitos doces", replacement: "I eat cookies. And you?" },
        { label: "panquecas", replacement: "I eat pancakes. And you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu bebo água e suco. E você? / café e suco / café e chá",
      options: [
        { label: "água e suco", replacement: "I drink water and juice. And you?" },
        { label: "café e suco", replacement: "I drink coffee and juice. And you?" },
        { label: "café e chá", replacement: "I drink coffee and tea. And you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Você quer café ou chá? / leite / suco",
      options: [
        { label: "café ou chá", replacement: "Do you want coffee or tea?" },
        { label: "leite", replacement: "Do you want milk?" },
        { label: "suco", replacement: "Do you want juice?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu gosto de pão com queijo. / manteiga / presunto",
      options: [
        { label: "queijo", replacement: "I like bread and cheese." },
        { label: "manteiga", replacement: "I like bread and butter." },
        { label: "presunto", replacement: "I like bread and ham." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Nós comemos arroz no almoço. / feijão / batata frita",
      options: [
        { label: "arroz", replacement: "We eat rice for lunch." },
        { label: "feijão", replacement: "We eat beans for lunch." },
        { label: "batata frita", replacement: "We eat french fries for lunch." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Você bebe leite com chocolate? / café / chá",
      options: [
        { label: "leite com chocolate", replacement: "Do you drink chocolate milk?" },
        { label: "café", replacement: "Do you drink coffee?" },
        { label: "chá", replacement: "Do you drink tea?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Eu prefiro suco de laranja. / maçã / uva",
      options: [
        { label: "laranja", replacement: "I prefer orange juice." },
        { label: "maçã", replacement: "I prefer apple juice." },
        { label: "uva", replacement: "I prefer grape juice." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Eles bebem chá de camomila. / hortelã / erva-doce",
      options: [
        { label: "camomila", replacement: "They drink chamomile tea." },
        { label: "hortelã", replacement: "They drink mint tea." },
        { label: "erva-doce", replacement: "They drink anise tea." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Você gosta de panquecas? / biscoitos / pão",
      options: [
        { label: "panquecas", replacement: "Do you like pancakes?" },
        { label: "biscoitos", replacement: "Do you like crackers?" },
        { label: "pão", replacement: "Do you like bread?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu como pão com manteiga. / presunto / queijo",
      options: [
        { label: "manteiga", replacement: "I eat bread with butter." },
        { label: "presunto", replacement: "I eat bread with ham." },
        { label: "queijo", replacement: "I eat bread with cheese." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Você bebe suco e eu bebo água. / leite - café / chá - suco",
      options: [
        { label: "suco - água", replacement: "You drink juice and I drink water." },
        { label: "leite - café", replacement: "You drink milk and I drink coffee." },
        { label: "chá - suco", replacement: "You drink tea and I drink juice." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu bebo café. E você? / leite / suco",
      options: [
        { label: "café", replacement: "I drink coffee. And you?" },
        { label: "leite", replacement: "I drink milk. And you?" },
        { label: "suco", replacement: "I drink juice. And you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu como biscoitos salgados. E você? / biscoitos doces / panquecas",
      options: [
        { label: "biscoitos salgados", replacement: "I eat crackers. And you?" },
        { label: "biscoitos doces", replacement: "I eat cookies. And you?" },
        { label: "panquecas", replacement: "I eat pancakes. And you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Você come queijo? / gosta de / prefere",
      options: [
        { label: "come", replacement: "Do you eat cheese?" },
        { label: "gosta de", replacement: "Do you like cheese?" },
        { label: "prefere", replacement: "Do you prefer cheese?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Nós bebemos chá. / comemos pão / precisamos de café",
      options: [
        { label: "bebemos chá", replacement: "We drink tea." },
        { label: "comemos pão", replacement: "We eat bread." },
        { label: "precisamos de café", replacement: "We need coffee." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ela bebe leite com café. / come pão / quer chá de camomila",
      options: [
        { label: "bebe leite com café", replacement: "She drinks milk with coffee." },
        { label: "come pão", replacement: "She eats bread." },
        { label: "quer chá de camomila", replacement: "She wants chamomile tea." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Eles comem pão com manteiga. / bebem café / precisam de água",
      options: [
        { label: "comem pão com manteiga", replacement: "They eat bread and butter." },
        { label: "bebem café", replacement: "They drink coffee." },
        { label: "precisam de água", replacement: "They need water." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eu gosto de café. / bebo / tomo",
      options: [
        { label: "gosto de", replacement: "I like coffee." },
        { label: "bebo", replacement: "I drink coffee." },
        { label: "tomo", replacement: "I have coffee." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Você prefere chá ou café? / bebe / toma",
      options: [
        { label: "prefere", replacement: "Do you prefer tea or coffee?" },
        { label: "bebe", replacement: "Do you drink tea or coffee?" },
        { label: "toma", replacement: "Do you have tea or coffee?" }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "I eat crackers. And you?",
      pt: "Eu como biscoitos salgados. E você?",
      green: ["crackers"]
    },
    {
      en: "I drink coffee with milk.",
      pt: "Eu bebo café com leite.",
      green: ["coffee", "milk"]
    },
    {
      en: "Do you drink water with ice?",
      pt: "Você bebe água com gelo?",
      green: ["water", "ice"]
    },
    {
      en: "We eat cookies with tea.",
      pt: "Nós comemos biscoitos com chá.",
      green: ["cookies", "tea"]
    },
    {
      en: "Do you prefer tea or coffee?",
      pt: "Você prefere chá ou café?",
      green: ["tea", "coffee"]
    },
    {
      en: "I like bread and cheese.",
      pt: "Eu gosto de pão e queijo.",
      green: ["bread", "cheese"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🍔 Lesson 1 - Food & Drink</h1>
          <div className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            <SpeakPortuguese text="Aprenda vocabulário essencial e expressões para falar sobre comida e bebida em inglês." className="text-xl text-gray-700">
              📚 Aprenda vocabulário essencial e expressões para falar sobre comida e bebida em inglês. 🥤
            </SpeakPortuguese>
          </div>
          <div className="w-64 h-64 mx-auto">
            <img src={mainImage} alt="Food and drink" className="w-full h-full object-cover rounded-2xl shadow-md" />
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
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Clique nos verbos para ouvir a pronúncia e estudar suas conjugações" className="text-gray-600 italic">
                🎧 Clique nos verbos para ouvir a pronúncia e estudar suas conjugações
              </SpeakPortuguese>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to eat" className="text-blue-600 font-bold">to eat</SpeakText> = comer</li>
              <li><SpeakText text="to drink" className="text-blue-600 font-bold">to drink</SpeakText> = beber, tomar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {verbsSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
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
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Clique em cada palavra para ouvir a pronúncia correta" className="text-gray-600 italic">
                🎧 Clique em cada palavra para ouvir a pronúncia correta
              </SpeakPortuguese>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "water", pt: "água" },
                { en: "coffee", pt: "café" },
                { en: "chamomile tea", pt: "chá de camomila" },
                { en: "milk", pt: "leite" },
                { en: "tea", pt: "chá" },
                { en: "juice", pt: "suco" },
                { en: "bread", pt: "pão" },
                { en: "cracker", pt: "biscoito salgado" },
                { en: "cookie", pt: "biscoito doce" },
                { en: "pancake", pt: "panqueca" },
                { en: "ham", pt: "presunto" },
                { en: "cheese", pt: "queijo" },
                { en: "butter", pt: "manteiga" },
                { en: "I", pt: "eu" },
                { en: "you", pt: "você" },
                { en: "and", pt: "e" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {vocabSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
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
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Pratique frases comuns e expressões do dia a dia" className="text-gray-600 italic">
                💬 Pratique frases comuns e expressões do dia a dia
              </SpeakPortuguese>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrasesData.map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={item.green}
                  translation={item.pt}
                />
              ))}
            </div>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {phrasesSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
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
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Observe a estrutura das frases e pratique a formação correta" className="text-gray-600 italic">
                📚 Observe a estrutura das frases e pratique a formação correta
              </SpeakPortuguese>
            </div>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – eat and drink"
                className="w-full max-h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            {/* Nota sobre gramática em português */}
            <div className="text-sm text-gray-600 mb-4 bg-blue-50/70 p-3 rounded-lg border border-blue-100">
              <p className="font-medium text-gray-700">💡 Dica de Gramática:</p>
              <p>Tanto <span className="text-blue-600 font-medium">"with"</span> quanto <span className="text-blue-600 font-medium">"and"</span> podem ser usados para "com" (ex: <span className="italic">bread and butter</span> / <span className="italic">bread with butter</span>).</p>
              <p>Verbos no infinitivo geralmente têm <span className="text-blue-600 font-medium">"to"</span> antes deles (ex: <span className="italic">to eat</span>), mas sem o <span className="text-blue-600 font-medium">"to"</span> eles também são infinitivos (ex: <span className="italic">eat</span>).</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I eat pancakes.", pt: "Eu como panquecas." },
                { en: "You eat cookies.", pt: "Você come biscoitos doces." },
                { en: "I eat bread and ham.", pt: "Eu como pão e presunto." },
                { en: "I drink coffee.", pt: "Eu bebo café." },
                { en: "You drink water.", pt: "Você bebe água." },
                { en: "I drink coffee with milk.", pt: "Eu bebo café com leite." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {grammarSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-blue-100">Pratique situações da vida real</div>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="text-center mb-4">
                <SpeakPortuguese text="Pratique situações da vida real substituindo as palavras em azul." className="text-blue-700 font-medium italic">
                  👉 Pratique situações da vida real substituindo as palavras em <span className="text-blue-600 font-bold">azul</span>.
                </SpeakPortuguese>
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    {
                      en: "I eat bread. And you?",
                      pt: "Eu como pão. E você?",
                      blue: ["bread"]
                    },
                    {
                      en: "I drink coffee with milk.",
                      pt: "Eu bebo café com leite.",
                      blue: ["coffee", "milk"]
                    },
                    {
                      en: "Do you eat ham and cheese?",
                      pt: "Você come presunto e queijo?",
                      blue: ["ham", "cheese"]
                    },
                    {
                      en: "We drink juice in the morning.",
                      pt: "Nós bebemos suco de manhã.",
                      blue: ["juice"]
                    },
                    {
                      en: "Do you prefer tea or coffee?",
                      pt: "Você prefere chá ou café?",
                      blue: ["tea", "coffee"]
                    },
                    {
                      en: "They eat pancakes for breakfast.",
                      pt: "Eles comem panquecas no café da manhã.",
                      blue: ["pancakes"]
                    },
                    {
                      en: "I like bread and cheese.",
                      pt: "Eu gosto de pão e queijo.",
                      blue: ["bread", "cheese"]
                    },
                    {
                      en: "Do you drink water with ice?",
                      pt: "Você bebe água com gelo?",
                      blue: ["water", "ice"]
                    },
                    {
                      en: "We eat cookies with tea.",
                      pt: "Nós comemos biscoitos com chá.",
                      blue: ["cookies", "tea"]
                    },
                  ].map((s, idx) => (
                    <MakeItYoursPhrase
                      key={idx}
                      text={`${idx + 1}. ${s.en}`}
                      translation={s.pt}
                      blueWords={s.blue}
                    />
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="People talking in a cafe" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Situação real em um café</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Ordering food in a restaurant" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Pedindo comida em um restaurante</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Woman drinking juice" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Bebendo suco</p>
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
              <div className="mt-2 text-blue-100 italic">
                <SpeakPortuguese text="Revise os pontos principais e as expressões essenciais da lição" className="text-blue-100 italic">
                  📝 Revise os pontos principais e as expressões essenciais da lição
                </SpeakPortuguese>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">EXPRESSÕES-CHAVE</h3>
              {[
                { en: "I drink juice. And you?", pt: "Eu bebo suco. E você?" },
                { en: "I eat crackers. And you?", pt: "Eu como biscoitos salgados. E você?" },
                { en: "I drink coffee with milk.", pt: "Eu bebo café com leite." },
                { en: "to eat (comer) → I eat", pt: "verbo comer → eu como" },
                { en: "to drink (beber) → you drink", pt: "verbo beber → você bebe" },
                { en: "Good morning! / Good afternoon! / Good evening!", pt: "Bom dia! / Boa tarde! / Boa noite!" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 DICAS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-blue-100">
                    <li>Use <strong className="text-white">"I eat"</strong> para dizer "eu como" e <strong className="text-white">"I drink"</strong> para dizer "eu bebo".</li>
                    <li>Na terceira pessoa do singular, adicionamos <strong className="text-white">-s</strong>: <em>he drinks, she eats</em> (ele bebe, ela come).</li>
                    <li>Use <strong className="text-white">"with"</strong> ou <strong className="text-white">"and"</strong> para dizer "com". Ex: <em>bread with butter</em> / <em>bread and butter</em>.</li>
                    <li>Use <strong className="text-white">"Do you...?"</strong> para fazer perguntas. Ex: <em>Do you drink coffee?</em> (Você bebe café?)</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 LEMBRE-SE</h4>
                  <p className="text-blue-100">"And you?" (E você?) é uma forma amigável de continuar a conversa e fazer uma pergunta de volta.</p>
                  <p className="text-blue-100 mt-2">"Thank you" significa "obrigado(a)" e é sempre educado usar quando alguém oferece algo.</p>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <p className="text-blue-100 text-sm italic">
                    🌟 <strong>Substitua as palavras destacadas em azul</strong> para criar novas frases e praticar a fluência!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Voltar aos Cursos
          </button>
          <button onClick={() => router.push("/cursos/lesson2")} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-purple-800 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Próxima Lição (2) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={grammarImage}
              alt="Grammar illustration – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

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