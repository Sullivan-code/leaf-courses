"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  if (americanFemaleVoices.length > 0) {
    utterance.voice = americanFemaleVoices[0];
  } else if (americanVoices.length > 0) {
    utterance.voice = americanVoices[0];
  }
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  const speak = () => {
    speakEnglish(text, 0.9);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
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
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
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

// ============================================
// SUBSTITUTION EXERCISE COMPONENT WITH EYE TOGGLE
// ============================================
type OptionType = string | { label: string; replacement: string; pt?: string };

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

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.label;
    }
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.replacement;
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
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium">
            {currentSentence}
          </SpeakSentence>
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-blue-200 pt-1">{currentPt}</p>
          )}
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
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
      <p className="text-sm text-gray-600">{translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 3: FOOD & DRINK
// ============================================
export default function LessonFoodAndDrink() {
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

  const lessonBgImage = "/images/lesson3-bg.jpg";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu quero suco. / Eu gosto / Eu prefiro",
      options: [
        { label: "Eu quero", replacement: "I want juice.", pt: "Eu quero suco." },
        { label: "Eu gosto", replacement: "I like juice.", pt: "Eu gosto de suco." },
        { label: "Eu prefiro", replacement: "I prefer juice.", pt: "Eu prefiro suco." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você gosta de chocolate? / Você quer / Você come",
      options: [
        { label: "Você gosta", replacement: "Do you like chocolate?", pt: "Você gosta de chocolate?" },
        { label: "Você quer", replacement: "Do you want chocolate?", pt: "Você quer chocolate?" },
        { label: "Você come", replacement: "Do you eat chocolate?", pt: "Você come chocolate?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Nós queremos torradas. / Nós gostamos / Nós preferimos",
      options: [
        { label: "Nós queremos", replacement: "We want toast.", pt: "Nós queremos torradas." },
        { label: "Nós gostamos", replacement: "We like toast.", pt: "Nós gostamos de torradas." },
        { label: "Nós preferimos", replacement: "We prefer toast.", pt: "Nós preferimos torradas." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eles gostam de frutas. / Eles querem / Eles comem",
      options: [
        { label: "Eles gostam", replacement: "They like fruit.", pt: "Eles gostam de frutas." },
        { label: "Eles querem", replacement: "They want fruit.", pt: "Eles querem frutas." },
        { label: "Eles comem", replacement: "They eat fruit.", pt: "Eles comem frutas." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela quer iogurte. / Ela gosta / Ela bebe",
      options: [
        { label: "Ela quer", replacement: "She wants yogurt.", pt: "Ela quer iogurte." },
        { label: "Ela gosta", replacement: "She likes yogurt.", pt: "Ela gosta de iogurte." },
        { label: "Ela bebe", replacement: "She drinks yogurt.", pt: "Ela bebe iogurte." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu não quero ovos. / Eu não gosto / Eu não prefiro",
      options: [
        { label: "Eu não quero", replacement: "I don't want eggs.", pt: "Eu não quero ovos." },
        { label: "Eu não gosto", replacement: "I don't like eggs.", pt: "Eu não gosto de ovos." },
        { label: "Eu não prefiro", replacement: "I don't prefer eggs.", pt: "Eu não prefiro ovos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Você não gosta de geleia? / Você não quer / Você não come",
      options: [
        { label: "Você não gosta", replacement: "Don't you like jam?", pt: "Você não gosta de geleia?" },
        { label: "Você não quer", replacement: "Don't you want jam?", pt: "Você não quer geleia?" },
        { label: "Você não come", replacement: "Don't you eat jam?", pt: "Você não come geleia?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu gosto de comer cereal. / Eu quero / Eu prefiro biscoitos salgados",
      options: [
        { label: "Eu gosto de comer", replacement: "I like to eat cereal.", pt: "Eu gosto de comer cereal." },
        { label: "Eu quero comer", replacement: "I want to eat cereal.", pt: "Eu quero comer cereal." },
        { label: "Eu prefiro", replacement: "I prefer crackers.", pt: "Eu prefiro biscoitos salgados." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Nós queremos beber suco. / Nós gostamos / Nós bebemos",
      options: [
        { label: "Nós queremos beber", replacement: "We want to drink juice.", pt: "Nós queremos beber suco." },
        { label: "Nós gostamos de beber", replacement: "We like to drink juice.", pt: "Nós gostamos de beber suco." },
        { label: "Nós bebemos", replacement: "We drink juice.", pt: "Nós bebemos suco." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Você quer uma fatia de torta? / Você gosta / Você come",
      options: [
        { label: "Você quer", replacement: "Do you want a slice of pie?", pt: "Você quer uma fatia de torta?" },
        { label: "Você gosta", replacement: "Do you like a slice of pie?", pt: "Você gosta de uma fatia de torta?" },
        { label: "Você come", replacement: "Do you eat a slice of pie?", pt: "Você come uma fatia de torta?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu como torradas com geleia. / cereal / iogurte",
      options: [
        { label: "torradas com geleia", replacement: "I eat toast with jam.", pt: "Eu como torradas com geleia." },
        { label: "cereal", replacement: "I eat cereal.", pt: "Eu como cereal." },
        { label: "iogurte", replacement: "I eat yogurt.", pt: "Eu como iogurte." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você quer chocolate? / torta / geleia",
      options: [
        { label: "chocolate", replacement: "Do you want chocolate?", pt: "Você quer chocolate?" },
        { label: "torta", replacement: "Do you want pie?", pt: "Você quer torta?" },
        { label: "geleia", replacement: "Do you want jam?", pt: "Você quer geleia?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Nós gostamos de frutas. / iogurte / granola",
      options: [
        { label: "frutas", replacement: "We like fruit.", pt: "Nós gostamos de frutas." },
        { label: "iogurte", replacement: "We like yogurt.", pt: "Nós gostamos de iogurte." },
        { label: "granola", replacement: "We like granola.", pt: "Nós gostamos de granola." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu quero uma fatia de torta. / bolo / pão",
      options: [
        { label: "torta", replacement: "I want a slice of pie.", pt: "Eu quero uma fatia de torta." },
        { label: "bolo", replacement: "I want a slice of cake.", pt: "Eu quero uma fatia de bolo." },
        { label: "pão", replacement: "I want a slice of bread.", pt: "Eu quero uma fatia de pão." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Você gosta de iogurte com mel? / granola / cereal",
      options: [
        { label: "iogurte com mel", replacement: "Do you like yogurt with honey?", pt: "Você gosta de iogurte com mel?" },
        { label: "granola", replacement: "Do you like granola?", pt: "Você gosta de granola?" },
        { label: "cereal", replacement: "Do you like cereal?", pt: "Você gosta de cereal?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não quero ovos. / torradas / cereal",
      options: [
        { label: "ovos", replacement: "I don't want eggs.", pt: "Eu não quero ovos." },
        { label: "torradas", replacement: "I don't want toast.", pt: "Eu não quero torradas." },
        { label: "cereal", replacement: "I don't want cereal.", pt: "Eu não quero cereal." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Nós comemos cereal no café da manhã. / torradas / frutas",
      options: [
        { label: "cereal", replacement: "We eat cereal for breakfast.", pt: "Nós comemos cereal no café da manhã." },
        { label: "torradas", replacement: "We eat toast for breakfast.", pt: "Nós comemos torradas no café da manhã." },
        { label: "frutas", replacement: "We eat fruit for breakfast.", pt: "Nós comemos frutas no café da manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela quer suco de laranja. / maçã / uva",
      options: [
        { label: "suco de laranja", replacement: "She wants orange juice.", pt: "Ela quer suco de laranja." },
        { label: "suco de maçã", replacement: "She wants apple juice.", pt: "Ela quer suco de maçã." },
        { label: "suco de uva", replacement: "She wants grape juice.", pt: "Ela quer suco de uva." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu gosto de mel no meu iogurte. / geleia / granola",
      options: [
        { label: "mel", replacement: "I like honey on my yogurt.", pt: "Eu gosto de mel no meu iogurte." },
        { label: "geleia", replacement: "I like jam on my yogurt.", pt: "Eu gosto de geleia no meu iogurte." },
        { label: "granola", replacement: "I like granola on my yogurt.", pt: "Eu gosto de granola no meu iogurte." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Você quer granola com iogurte? / mel / frutas",
      options: [
        { label: "granola", replacement: "Do you want granola with yogurt?", pt: "Você quer granola com iogurte?" },
        { label: "mel", replacement: "Do you want honey with yogurt?", pt: "Você quer mel com iogurte?" },
        { label: "frutas", replacement: "Do you want fruit with yogurt?", pt: "Você quer frutas com iogurte?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu como cereal no café da manhã. / torradas / iogurte",
      options: [
        { label: "cereal", replacement: "I eat cereal for breakfast.", pt: "Eu como cereal no café da manhã." },
        { label: "torradas", replacement: "I eat toast for breakfast.", pt: "Eu como torradas no café da manhã." },
        { label: "iogurte", replacement: "I eat yogurt for breakfast.", pt: "Eu como iogurte no café da manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu quero um pedaço de queijo, por favor. / chocolate / torta",
      options: [
        { label: "queijo", replacement: "I want a piece of cheese, please.", pt: "Eu quero um pedaço de queijo, por favor." },
        { label: "chocolate", replacement: "I want a piece of chocolate, please.", pt: "Eu quero um pedaço de chocolate, por favor." },
        { label: "torta", replacement: "I want a piece of pie, please.", pt: "Eu quero um pedaço de torta, por favor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu quero uma fatia de torta de maçã. / chocolate / laranja",
      options: [
        { label: "torta de maçã", replacement: "I want a slice of apple pie.", pt: "Eu quero uma fatia de torta de maçã." },
        { label: "torta de chocolate", replacement: "I want a slice of chocolate pie.", pt: "Eu quero uma fatia de torta de chocolate." },
        { label: "torta de laranja", replacement: "I want a slice of orange pie.", pt: "Eu quero uma fatia de torta de laranja." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você quer um pedaço de chocolate? / torta / queijo",
      options: [
        { label: "chocolate", replacement: "Do you want a piece of chocolate?", pt: "Você quer um pedaço de chocolate?" },
        { label: "torta", replacement: "Do you want a piece of pie?", pt: "Você quer um pedaço de torta?" },
        { label: "queijo", replacement: "Do you want a piece of cheese?", pt: "Você quer um pedaço de queijo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Nós comemos torradas com geleia. / mel / manteiga",
      options: [
        { label: "geleia", replacement: "We eat toast with jam.", pt: "Nós comemos torradas com geleia." },
        { label: "mel", replacement: "We eat toast with honey.", pt: "Nós comemos torradas com mel." },
        { label: "manteiga", replacement: "We eat toast with butter.", pt: "Nós comemos torradas com manteiga." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu quero suco de laranja no café da manhã. / leite / chá",
      options: [
        { label: "suco de laranja", replacement: "I want orange juice with breakfast.", pt: "Eu quero suco de laranja no café da manhã." },
        { label: "leite", replacement: "I want milk with breakfast.", pt: "Eu quero leite no café da manhã." },
        { label: "chá", replacement: "I want tea with breakfast.", pt: "Eu quero chá no café da manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Ela quer uma fatia de torta de chocolate. / maçã / morango",
      options: [
        { label: "torta de chocolate", replacement: "She wants a slice of chocolate pie.", pt: "Ela quer uma fatia de torta de chocolate." },
        { label: "torta de maçã", replacement: "She wants a slice of apple pie.", pt: "Ela quer uma fatia de torta de maçã." },
        { label: "torta de morango", replacement: "She wants a slice of strawberry pie.", pt: "Ela quer uma fatia de torta de morango." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Eles comem iogurte com granola. / mel / frutas",
      options: [
        { label: "granola", replacement: "They eat yogurt with granola.", pt: "Eles comem iogurte com granola." },
        { label: "mel", replacement: "They eat yogurt with honey.", pt: "Eles comem iogurte com mel." },
        { label: "frutas", replacement: "They eat yogurt with fruit.", pt: "Eles comem iogurte com frutas." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Eu quero ovos no café da manhã. / torradas / cereal",
      options: [
        { label: "ovos", replacement: "I want eggs for breakfast.", pt: "Eu quero ovos no café da manhã." },
        { label: "torradas", replacement: "I want toast for breakfast.", pt: "Eu quero torradas no café da manhã." },
        { label: "cereal", replacement: "I want cereal for breakfast.", pt: "Eu quero cereal no café da manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-10",
      original: "Você come frutas no café da manhã? / torradas / cereal",
      options: [
        { label: "frutas", replacement: "Do you eat fruit for breakfast?", pt: "Você come frutas no café da manhã?" },
        { label: "torradas", replacement: "Do you eat toast for breakfast?", pt: "Você come torradas no café da manhã?" },
        { label: "cereal", replacement: "Do you eat cereal for breakfast?", pt: "Você come cereal no café da manhã?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu quero maçã e granola. / laranja e mel / banana e iogurte",
      options: [
        { label: "maçã e granola", replacement: "I want apple and granola.", pt: "Eu quero maçã e granola." },
        { label: "laranja e mel", replacement: "I want orange and honey.", pt: "Eu quero laranja e mel." },
        { label: "banana e iogurte", replacement: "I want banana and yogurt.", pt: "Eu quero banana e iogurte." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eu não quero torta de maçã. / chocolate / laranja",
      options: [
        { label: "torta de maçã", replacement: "I don't want apple pie.", pt: "Eu não quero torta de maçã." },
        { label: "torta de chocolate", replacement: "I don't want chocolate pie.", pt: "Eu não quero torta de chocolate." },
        { label: "torta de laranja", replacement: "I don't want orange pie.", pt: "Eu não quero torta de laranja." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu gosto de laranjas. / maçãs / frutas",
      options: [
        { label: "laranjas", replacement: "I like oranges.", pt: "Eu gosto de laranjas." },
        { label: "maçãs", replacement: "I like apples.", pt: "Eu gosto de maçãs." },
        { label: "frutas", replacement: "I like fruit.", pt: "Eu gosto de frutas." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu não gosto de cereal. / ovos / torradas",
      options: [
        { label: "cereal", replacement: "I don't like cereal.", pt: "Eu não gosto de cereal." },
        { label: "ovos", replacement: "I don't like eggs.", pt: "Eu não gosto de ovos." },
        { label: "torradas", replacement: "I don't like toast.", pt: "Eu não gosto de torradas." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu gosto de comer torradas com mel. / geleia / queijo",
      options: [
        { label: "torradas com mel", replacement: "I like to eat toast with honey.", pt: "Eu gosto de comer torradas com mel." },
        { label: "torradas com geleia", replacement: "I like to eat toast with jam.", pt: "Eu gosto de comer torradas com geleia." },
        { label: "torradas com queijo", replacement: "I like to eat toast with cheese.", pt: "Eu gosto de comer torradas com queijo." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eu quero beber suco de maçã. / laranja / uva",
      options: [
        { label: "suco de maçã", replacement: "I want to drink apple juice.", pt: "Eu quero beber suco de maçã." },
        { label: "suco de laranja", replacement: "I want to drink orange juice.", pt: "Eu quero beber suco de laranja." },
        { label: "suco de uva", replacement: "I want to drink grape juice.", pt: "Eu quero beber suco de uva." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Você gosta de iogurte? / granola / mel",
      options: [
        { label: "iogurte", replacement: "Do you like yogurt?", pt: "Você gosta de iogurte?" },
        { label: "granola", replacement: "Do you like granola?", pt: "Você gosta de granola?" },
        { label: "mel", replacement: "Do you like honey?", pt: "Você gosta de mel?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Nós não queremos ovos. / torradas / cereal",
      options: [
        { label: "ovos", replacement: "We don't want eggs.", pt: "Nós não queremos ovos." },
        { label: "torradas", replacement: "We don't want toast.", pt: "Nós não queremos torradas." },
        { label: "cereal", replacement: "We don't want cereal.", pt: "Nós não queremos cereal." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eles gostam de comer frutas. / torta / chocolate",
      options: [
        { label: "frutas", replacement: "They like to eat fruit.", pt: "Eles gostam de comer frutas." },
        { label: "torta", replacement: "They like to eat pie.", pt: "Eles gostam de comer torta." },
        { label: "chocolate", replacement: "They like to eat chocolate.", pt: "Eles gostam de comer chocolate." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Você quer beber leite? / suco / chá",
      options: [
        { label: "leite", replacement: "Do you want to drink milk?", pt: "Você quer beber leite?" },
        { label: "suco", replacement: "Do you want to drink juice?", pt: "Você quer beber suco?" },
        { label: "chá", replacement: "Do you want to drink tea?", pt: "Você quer beber chá?" }
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

  const usefulPhrasesData = [
    {
      en: "I eat toast and jam for breakfast.",
      pt: "Eu como torradas com geleia no café da manhã.",
      green: ["toast", "jam"]
    },
    {
      en: "I want a piece of chocolate, please.",
      pt: "Eu quero um pedaço de chocolate, por favor.",
      green: ["chocolate"]
    },
    {
      en: "I want a slice of pie.",
      pt: "Eu quero uma fatia de torta.",
      green: ["pie"]
    }
  ];

  // Dados da seção Make it yours com palavras-chave destacadas em azul
  // Frases balanceadas com "I", "you", "she", "he"
  const makeItYoursData = [
    {
      en: "I want yogurt and granola.",
      pt: "Eu quero iogurte e granola.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " ", highlight: false },
        { text: "yogurt", highlight: true },
        { text: " and ", highlight: false },
        { text: "granola", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "You want eggs for breakfast.",
      pt: "Você quer ovos no café da manhã.",
      parts: [
        { text: "You ", highlight: false },
        { text: "want", highlight: true },
        { text: " ", highlight: false },
        { text: "eggs", highlight: true },
        { text: " for ", highlight: false },
        { text: "breakfast", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "She likes to drink juice.",
      pt: "Ela gosta de beber suco.",
      parts: [
        { text: "She ", highlight: false },
        { text: "likes", highlight: true },
        { text: " to ", highlight: false },
        { text: "drink", highlight: true },
        { text: " ", highlight: false },
        { text: "juice", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "He wants to drink milk.",
      pt: "Ele quer beber leite.",
      parts: [
        { text: "He ", highlight: false },
        { text: "wants", highlight: true },
        { text: " to ", highlight: false },
        { text: "drink", highlight: true },
        { text: " ", highlight: false },
        { text: "milk", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I want to eat honey.",
      pt: "Eu quero comer mel.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: " ", highlight: false },
        { text: "honey", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "You like oranges.",
      pt: "Você gosta de laranjas.",
      parts: [
        { text: "You ", highlight: false },
        { text: "like", highlight: true },
        { text: " ", highlight: false },
        { text: "oranges", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "She doesn't like apple juice.",
      pt: "Ela não gosta de suco de maçã.",
      parts: [
        { text: "She ", highlight: false },
        { text: "doesn't like", highlight: true },
        { text: " ", highlight: false },
        { text: "apple juice", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "He likes chocolate pie.",
      pt: "Ele gosta de torta de chocolate.",
      parts: [
        { text: "He ", highlight: false },
        { text: "likes", highlight: true },
        { text: " ", highlight: false },
        { text: "chocolate pie", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I want a piece of cheese.",
      pt: "Eu quero um pedaço de queijo.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " a piece of ", highlight: false },
        { text: "cheese", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "You want to eat toast for breakfast.",
      pt: "Você quer comer torradas no café da manhã.",
      parts: [
        { text: "You ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: " ", highlight: false },
        { text: "toast", highlight: true },
        { text: " for ", highlight: false },
        { text: "breakfast", highlight: true },
        { text: ".", highlight: false },
      ]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("${lessonBgImage}")`,
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
            Lesson 3 - Food & Drink
          </h1>
          <SpeakSentence text="Learn to express preferences about food and drinks in English." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍎🍫 Learn to express preferences about food and drinks in English. 🍎🍫
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={lessonBgImage}
              alt="Lesson intro"
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              </div>
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
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to want" className="text-blue-600 font-bold">to want</SpeakText> = querer
              </li>
              <li>
                <SpeakText text="to like" className="text-blue-600 font-bold">to like</SpeakText> = gostar de
              </li>
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

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 New Words</h2>
              </div>
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
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "apple", pt: "maçã" },
                { en: "orange", pt: "laranja" },
                { en: "fruit", pt: "fruta" },
                { en: "toast", pt: "torrada" },
                { en: "jam", pt: "geleia" },
                { en: "cereal", pt: "cereal" },
                { en: "yogurt", pt: "iogurte" },
                { en: "honey", pt: "mel" },
                { en: "granola", pt: "granola" },
                { en: "eggs", pt: "ovos" },
                { en: "pie", pt: "torta" },
                { en: "chocolate", pt: "chocolate" },
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

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              </div>
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
            <SpeakSentence text="Practice common phrases to express preferences" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to express preferences
            </SpeakSentence>
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

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              </div>
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
            <SpeakSentence text="Structures to express likes and preferences" className="text-md text-gray-600 mb-4 italic">
              📚 Structures to express likes and preferences
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I want banana and granola." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I want banana and granola.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu quero banana e granola.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I don't want chocolate pie." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I don't want chocolate pie.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu não quero torta de chocolate.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I like apples." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I like apples.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu gosto de maçãs.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I don't like jam." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I don't like jam.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu não gosto de geleia.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I like to eat cereal and honey." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I like to eat cereal and honey.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu gosto de comer cereal com mel.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I want to drink orange juice." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I want to drink orange juice.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu quero beber suco de laranja.</div>
              </div>
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

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS</h2>
                <p className="mt-2 text-blue-100 italic text-sm">
                  Substitua as palavras em <span className="text-blue-300 font-bold">azul</span> por outras palavras que você já aprendeu para criar novas frases e praticar sua pronúncia.
                </p>
              </div>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {makeItYoursData.map((s, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium">
                          {idx+1}. {s.parts.map((part, pIdx) => (
                            part.highlight ? (
                              <span key={pIdx} className="text-blue-600 font-bold">{part.text}</span>
                            ) : (
                              <span key={pIdx}>{part.text}</span>
                            )
                          ))}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-image-1.jpg"
                        alt="Healthy breakfast"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Café da manhã com frutas e iogurte
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="/images/rl-image-2.jpg"
                        alt="Desserts and pies"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Variedade de sobremesas e tortas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Wrap Up */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-blue-100 italic">
                📝 Key expressions and useful vocabulary to remember
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              <div className="space-y-4">
                {[
                  { en: "I like to eat...", pt: "Eu gosto de comer..." },
                  { en: "I want to drink...", pt: "Eu quero beber..." },
                  { en: "I don't like to eat...", pt: "Eu não gosto de comer..." },
                  { en: "I don't want to drink...", pt: "Eu não quero beber..." },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center mb-1">
                      <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                    </div>
                    <p className="text-blue-200 text-sm">{item.pt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="/images/cio-image-1.jpg"
                alt="Woman choosing food"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <SpeakSentence text="I want chocolate pie. And you?">
                  I want chocolate pie. <span className="font-bold">And you?</span>
                </SpeakSentence>
                <p className="text-sm text-gray-600 mt-1">Eu quero torta de chocolate. E você?</p>
              </div>
            </div>

            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">GOODBYES</h3>
              <div className="space-y-4">
                {[
                  { en: "Bye! See you.", pt: "Tchau! Até mais." },
                  { en: "See you later.", pt: "Até mais tarde." },
                  { en: "Good night!", pt: "Boa noite!" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center mb-1">
                      <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                    </div>
                    <p className="text-blue-200 text-sm">{item.pt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("https://website-english-course.vercel.app/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson4")}
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

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
          50% { box-shadow: 0 0 20px #3b82f6, 0 0 30px #3b82f6; }
          100% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
        }
        .active\:animate-glow:active {
          animation: glow 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}