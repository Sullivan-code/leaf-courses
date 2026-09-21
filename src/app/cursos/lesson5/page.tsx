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
// MAIN COMPONENT – LESSON 5: FOOD & DRINK
// ============================================
export default function Lesson5FoodAndDrink() {
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

  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";
  const beefAndFishImage = "https://i.ibb.co/N6P2sn5P/beef-and-fish.jpg";
  const drinkAndSandwichImage = "https://i.ibb.co/5xwfgP0Y/drink-and-sandwich.jpg";
  const vegetablesImage = "https://i.ibb.co/whTg289T/vegetables.jpg";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu prefiro. / Você prefere. / Ela prefere.",
      options: [
        { label: "Eu prefiro", replacement: "I prefer.", pt: "Eu prefiro." },
        { label: "Você prefere", replacement: "You prefer.", pt: "Você prefere." },
        { label: "Ela prefere", replacement: "She prefers.", pt: "Ela prefere." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não prefiro. / não gosto / não quero.",
      options: [
        { label: "não prefiro", replacement: "I don't prefer.", pt: "Eu não prefiro." },
        { label: "não gosto", replacement: "I don't like.", pt: "Eu não gosto." },
        { label: "não quero", replacement: "I don't want.", pt: "Eu não quero." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu adoro. / Eu amo. / Eu gosto.",
      options: [
        { label: "Eu adoro", replacement: "I love.", pt: "Eu adoro." },
        { label: "Eu amo", replacement: "I love.", pt: "Eu amo." },
        { label: "Eu gosto", replacement: "I like.", pt: "Eu gosto." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu não amo. / não quero / não gosto.",
      options: [
        { label: "não amo", replacement: "I don't love.", pt: "Eu não amo." },
        { label: "não quero", replacement: "I don't want.", pt: "Eu não quero." },
        { label: "não gosto", replacement: "I don't like.", pt: "Eu não gosto." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "I love chocolate. / fruta / café.",
      options: [
        { label: "chocolate", replacement: "I love chocolate.", pt: "Eu amo chocolate." },
        { label: "fruta", replacement: "I love fruit.", pt: "Eu amo fruta." },
        { label: "café", replacement: "I love coffee.", pt: "Eu amo café." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu amo torta de chocolate. / maçã / banana.",
      options: [
        { label: "torta de chocolate", replacement: "I love chocolate pie.", pt: "Eu amo torta de chocolate." },
        { label: "torta de maçã", replacement: "I love apple pie.", pt: "Eu amo torta de maçã." },
        { label: "torta de banana", replacement: "I love banana pie.", pt: "Eu amo torta de banana." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "I love to eat. / panquecas / queijo.",
      options: [
        { label: "comer", replacement: "I love to eat.", pt: "Eu amo comer." },
        { label: "panquecas", replacement: "I love to eat pancakes.", pt: "Eu amo comer panquecas." },
        { label: "queijo", replacement: "I love to eat cheese.", pt: "Eu amo comer queijo." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu amo beber chá. / suco / leite.",
      options: [
        { label: "chá", replacement: "I love to drink tea.", pt: "Eu amo beber chá." },
        { label: "suco", replacement: "I love to drink juice.", pt: "Eu amo beber suco." },
        { label: "leite", replacement: "I love to drink milk.", pt: "Eu amo beber leite." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Eu prefiro café. / suco / água.",
      options: [
        { label: "café", replacement: "I prefer coffee.", pt: "Eu prefiro café." },
        { label: "suco", replacement: "I prefer juice.", pt: "Eu prefiro suco." },
        { label: "água", replacement: "I prefer water.", pt: "Eu prefiro água." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "I prefer to drink. / suco / chá.",
      options: [
        { label: "beber", replacement: "I prefer to drink.", pt: "Eu prefiro beber." },
        { label: "suco", replacement: "I prefer to drink juice.", pt: "Eu prefiro beber suco." },
        { label: "chá", replacement: "I prefer to drink tea.", pt: "Eu prefiro beber chá." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "I prefer water to juice. / café a leite.",
      options: [
        { label: "água a suco", replacement: "I prefer water to juice.", pt: "Eu prefiro água a suco." },
        { label: "café a leite", replacement: "I prefer coffee to milk.", pt: "Eu prefiro café a leite." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "Eu amo. / Eu amo comer.",
      options: [
        { label: "Eu amo", replacement: "I love.", pt: "Eu amo." },
        { label: "Eu amo comer", replacement: "I love to eat.", pt: "Eu amo comer." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-13",
      original: "Eu prefiro. / Eu prefiro beber.",
      options: [
        { label: "Eu prefiro", replacement: "I prefer.", pt: "Eu prefiro." },
        { label: "Eu prefiro beber", replacement: "I prefer to drink.", pt: "Eu prefiro beber." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu adoro batatas fritas. / salada / frango.",
      options: [
        { label: "batatas fritas", replacement: "I love French fries.", pt: "Eu adoro batatas fritas." },
        { label: "salada", replacement: "I love salad.", pt: "Eu adoro salada." },
        { label: "frango", replacement: "I love chicken.", pt: "Eu adoro frango." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu prefiro comer carne. / peixe / frango.",
      options: [
        { label: "carne", replacement: "I prefer to eat beef.", pt: "Eu prefiro comer carne." },
        { label: "peixe", replacement: "I prefer to eat fish.", pt: "Eu prefiro comer peixe." },
        { label: "frango", replacement: "I prefer to eat chicken.", pt: "Eu prefiro comer frango." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu prefiro comer ovos e presunto. / salsicha / queijo.",
      options: [
        { label: "ovos e presunto", replacement: "I prefer to eat eggs and ham.", pt: "Eu prefiro comer ovos e presunto." },
        { label: "salsicha", replacement: "I prefer to eat sausage.", pt: "Eu prefiro comer salsicha." },
        { label: "queijo", replacement: "I prefer to eat cheese.", pt: "Eu prefiro comer queijo." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu como arroz com feijão. / carne com legumes / batatas fritas com bacon.",
      options: [
        { label: "arroz com feijão", replacement: "I eat rice and beans.", pt: "Eu como arroz com feijão." },
        { label: "carne com legumes", replacement: "I eat meat and vegetables.", pt: "Eu como carne com legumes." },
        { label: "batatas fritas com bacon", replacement: "I eat French fries with bacon.", pt: "Eu como batatas fritas com bacon." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu não como carne, obrigado. / peixe / frango.",
      options: [
        { label: "carne", replacement: "I don't eat beef, thank you.", pt: "Eu não como carne, obrigado." },
        { label: "peixe", replacement: "I don't eat fish, thank you.", pt: "Eu não como peixe, obrigado." },
        { label: "frango", replacement: "I don't eat chicken, thank you.", pt: "Eu não como frango, obrigado." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não quero salsicha, obrigada. / como / gosto de.",
      options: [
        { label: "não quero", replacement: "I don't want sausage, thank you.", pt: "Eu não quero salsicha, obrigada." },
        { label: "não como", replacement: "I don't eat sausage, thank you.", pt: "Eu não como salsicha, obrigada." },
        { label: "não gosto de", replacement: "I don't like sausage, thank you.", pt: "Eu não gosto de salsicha, obrigada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu como pão ou panquecas. / banana ou maçã / torrada ou fruta.",
      options: [
        { label: "pão ou panquecas", replacement: "I eat bread or pancakes.", pt: "Eu como pão ou panquecas." },
        { label: "banana ou maçã", replacement: "I eat banana or apple.", pt: "Eu como banana ou maçã." },
        { label: "torrada ou fruta", replacement: "I eat toast or fruit.", pt: "Eu como torrada ou fruta." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I like chicken sandwiches. / queijo / presunto.",
      options: [
        { label: "sanduíche de frango", replacement: "I like chicken sandwiches.", pt: "Eu gosto de sanduíche de frango." },
        { label: "sanduíche de queijo", replacement: "I like cheese sandwiches.", pt: "Eu gosto de sanduíche de queijo." },
        { label: "sanduíche de presunto", replacement: "I like ham sandwiches.", pt: "Eu gosto de sanduíche de presunto." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu não gosto de comer salada. / tomate / peixe.",
      options: [
        { label: "salada", replacement: "I don't like to eat salad.", pt: "Eu não gosto de comer salada." },
        { label: "tomate", replacement: "I don't like to eat tomato.", pt: "Eu não gosto de comer tomate." },
        { label: "peixe", replacement: "I don't like to eat fish.", pt: "Eu não gosto de comer peixe." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu não quero comer carne. / peixe / frango.",
      options: [
        { label: "carne", replacement: "I don't want to eat beef.", pt: "Eu não quero comer carne." },
        { label: "peixe", replacement: "I don't want to eat fish.", pt: "Eu não quero comer peixe." },
        { label: "frango", replacement: "I don't want to eat chicken.", pt: "Eu não quero comer frango." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu quero tomar refrigerante. / amo / gosto de.",
      options: [
        { label: "quero tomar", replacement: "I want to drink soda.", pt: "Eu quero tomar refrigerante." },
        { label: "amo tomar", replacement: "I love to drink soda.", pt: "Eu amo tomar refrigerante." },
        { label: "gosto de tomar", replacement: "I like to drink soda.", pt: "Eu gosto de tomar refrigerante." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu prefiro refrigerante a suco. / água / chá.",
      options: [
        { label: "refrigerante a suco", replacement: "I prefer soda to juice.", pt: "Eu prefiro refrigerante a suco." },
        { label: "refrigerante a água", replacement: "I prefer soda to water.", pt: "Eu prefiro refrigerante a água." },
        { label: "refrigerante a chá", replacement: "I prefer soda to tea.", pt: "Eu prefiro refrigerante a chá." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu quero um copo de água, por favor. / suco / leite",
      options: [
        { label: "água", replacement: "I want a glass of water, please.", pt: "Eu quero um copo de água, por favor." },
        { label: "suco", replacement: "I want a glass of juice, please.", pt: "Eu quero um copo de suco, por favor." },
        { label: "leite", replacement: "I want a glass of milk, please.", pt: "Eu quero um copo de leite, por favor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu prefiro uma xícara de chá. / café / chocolate quente",
      options: [
        { label: "chá", replacement: "I prefer a cup of tea.", pt: "Eu prefiro uma xícara de chá." },
        { label: "café", replacement: "I prefer a cup of coffee.", pt: "Eu prefiro uma xícara de café." },
        { label: "chocolate quente", replacement: "I prefer a cup of hot chocolate.", pt: "Eu prefiro uma xícara de chocolate quente." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Nós adoramos arroz e feijão no almoço. / carne e salada / peixe e legumes",
      options: [
        { label: "arroz e feijão", replacement: "We love rice and beans for lunch.", pt: "Nós adoramos arroz e feijão no almoço." },
        { label: "carne e salada", replacement: "We love meat and salad for lunch.", pt: "Nós adoramos carne e salada no almoço." },
        { label: "peixe e legumes", replacement: "We love fish and vegetables for lunch.", pt: "Nós adoramos peixe e legumes no almoço." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Ela adora pizza no jantar. / massa / comida japonesa",
      options: [
        { label: "pizza", replacement: "She loves pizza for dinner.", pt: "Ela adora pizza no jantar." },
        { label: "massa", replacement: "She loves pasta for dinner.", pt: "Ela adora massa no jantar." },
        { label: "comida japonesa", replacement: "She loves Japanese food for dinner.", pt: "Ela adora comida japonesa no jantar." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "comer / beber / querer / gostar / preferir / amar.",
      options: [
        { label: "comer", replacement: "to eat", pt: "comer" },
        { label: "beber", replacement: "to drink", pt: "beber" },
        { label: "querer", replacement: "to want", pt: "querer" },
        { label: "gostar", replacement: "to like", pt: "gostar" },
        { label: "preferir", replacement: "to prefer", pt: "preferir" },
        { label: "amar", replacement: "to love", pt: "amar" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eu bebo. / como / quero / gosto / prefiro / adoro.",
      options: [
        { label: "bebo", replacement: "I drink.", pt: "Eu bebo." },
        { label: "como", replacement: "I eat.", pt: "Eu como." },
        { label: "quero", replacement: "I want.", pt: "Eu quero." },
        { label: "gosto", replacement: "I like.", pt: "Eu gosto." },
        { label: "prefiro", replacement: "I prefer.", pt: "Eu prefiro." },
        { label: "adoro", replacement: "I love.", pt: "Eu adoro." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Você quer. / gosta / prefere / ama / bebe / come.",
      options: [
        { label: "quer", replacement: "You want.", pt: "Você quer." },
        { label: "gosta", replacement: "You like.", pt: "Você gosta." },
        { label: "prefere", replacement: "You prefer.", pt: "Você prefere." },
        { label: "ama", replacement: "You love.", pt: "Você ama." },
        { label: "bebe", replacement: "You drink.", pt: "Você bebe." },
        { label: "come", replacement: "You eat.", pt: "Você come." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você come? / gosta / prefere / quer / adora.",
      options: [
        { label: "come", replacement: "Do you eat?", pt: "Você come?" },
        { label: "gosta", replacement: "Do you like?", pt: "Você gosta?" },
        { label: "prefere", replacement: "Do you prefer?", pt: "Você prefere?" },
        { label: "quer", replacement: "Do you want?", pt: "Você quer?" },
        { label: "adora", replacement: "Do you love?", pt: "Você adora?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Você come peixe no almoço? / frango / legumes.",
      options: [
        { label: "peixe", replacement: "Do you eat fish for lunch?", pt: "Você come peixe no almoço?" },
        { label: "frango", replacement: "Do you eat chicken for lunch?", pt: "Você come frango no almoço?" },
        { label: "legumes", replacement: "Do you eat vegetables for lunch?", pt: "Você come legumes no almoço?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Do you want beef or fish? / bacon ou linguiça / panquecas ou torradas.",
      options: [
        { label: "carne ou peixe", replacement: "Do you want beef or fish?", pt: "Você quer carne ou peixe?" },
        { label: "bacon ou linguiça", replacement: "Do you want bacon or sausage?", pt: "Você quer bacon ou linguiça?" },
        { label: "panquecas ou torradas", replacement: "Do you want pancakes or toast?", pt: "Você quer panquecas ou torradas?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Você bebe café? / gosta / prefere / quer.",
      options: [
        { label: "bebe", replacement: "Do you drink coffee?", pt: "Você bebe café?" },
        { label: "gosta", replacement: "Do you like coffee?", pt: "Você gosta de café?" },
        { label: "prefere", replacement: "Do you prefer coffee?", pt: "Você prefere café?" },
        { label: "quer", replacement: "Do you want coffee?", pt: "Você quer café?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Do you want to drink soda? / gosta / prefere.",
      options: [
        { label: "quer beber", replacement: "Do you want to drink soda?", pt: "Você quer beber refrigerante?" },
        { label: "gosta de beber", replacement: "Do you like to drink soda?", pt: "Você gosta de beber refrigerante?" },
        { label: "prefere beber", replacement: "Do you prefer to drink soda?", pt: "Você prefere beber refrigerante?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Você quer comer batatas fritas? / salsicha / carne.",
      options: [
        { label: "batatas fritas", replacement: "Do you want to eat French fries?", pt: "Você quer comer batatas fritas?" },
        { label: "salsicha", replacement: "Do you want to eat sausage?", pt: "Você quer comer salsicha?" },
        { label: "carne", replacement: "Do you want to eat beef?", pt: "Você quer comer carne?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Você prefere comer arroz ou salada? / bacon ou legumes / batatas fritas ou tomates.",
      options: [
        { label: "arroz ou salada", replacement: "Do you prefer to eat rice or salad?", pt: "Você prefere comer arroz ou salada?" },
        { label: "bacon ou legumes", replacement: "Do you prefer to eat bacon or vegetables?", pt: "Você prefere comer bacon ou legumes?" },
        { label: "batatas fritas ou tomates", replacement: "Do you prefer to eat French fries or tomatoes?", pt: "Você prefere comer batatas fritas ou tomates?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "What do you eat? / bebe / quer / prefere / ama.",
      options: [
        { label: "come", replacement: "What do you eat?", pt: "O que você come?" },
        { label: "bebe", replacement: "What do you drink?", pt: "O que você bebe?" },
        { label: "quer", replacement: "What do you want?", pt: "O que você quer?" },
        { label: "prefere", replacement: "What do you prefer?", pt: "O que você prefere?" },
        { label: "ama", replacement: "What do you love?", pt: "O que você ama?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "O que você come no café da manhã? / almoço / jantar.",
      options: [
        { label: "café da manhã", replacement: "What do you eat for breakfast?", pt: "O que você come no café da manhã?" },
        { label: "almoço", replacement: "What do you eat for lunch?", pt: "O que você come no almoço?" },
        { label: "jantar", replacement: "What do you eat for dinner?", pt: "O que você come no jantar?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-13",
      original: "O que você quer comer? / prefere / gosta.",
      options: [
        { label: "quer comer", replacement: "What do you want to eat?", pt: "O que você quer comer?" },
        { label: "prefere comer", replacement: "What do you prefer to eat?", pt: "O que você prefere comer?" },
        { label: "gosta de comer", replacement: "What do you like to eat?", pt: "O que você gosta de comer?" }
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
      en: "I want a glass of water, please.",
      pt: "Eu quero um copo de água, por favor.",
      green: ["glass", "water"]
    },
    {
      en: "I prefer a cup of tea.",
      pt: "Eu prefiro uma xícara de chá.",
      green: ["cup", "tea"]
    },
    {
      en: "We love rice and beans for lunch.",
      pt: "Nós adoramos arroz e feijão no almoço.",
      green: ["rice", "beans", "lunch"]
    },
    {
      en: "She loves pizza for dinner.",
      pt: "Ela adora pizza no jantar.",
      green: ["pizza", "dinner"]
    }
  ];

  // Dados da seção Make it yours com palavras-chave destacadas em azul
  const makeItYoursData = [
    {
      en: "I prefer to drink a glass of water.",
      pt: "Eu prefiro beber um copo de água.",
      parts: [
        { text: "I ", highlight: false },
        { text: "prefer", highlight: true },
        { text: " to ", highlight: false },
        { text: "drink", highlight: true },
        { text: " a glass of ", highlight: false },
        { text: "water", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I prefer to eat beef and vegetables.",
      pt: "Eu prefiro comer carne e legumes.",
      parts: [
        { text: "I ", highlight: false },
        { text: "prefer", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: " ", highlight: false },
        { text: "beef", highlight: true },
        { text: " and ", highlight: false },
        { text: "vegetables", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I prefer juice to soda.",
      pt: "Eu prefiro suco a refrigerante.",
      parts: [
        { text: "I ", highlight: false },
        { text: "prefer", highlight: true },
        { text: " ", highlight: false },
        { text: "juice", highlight: true },
        { text: " to ", highlight: false },
        { text: "soda", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I love French fries.",
      pt: "Eu amo batatas fritas.",
      parts: [
        { text: "I ", highlight: false },
        { text: "love", highlight: true },
        { text: " ", highlight: false },
        { text: "French fries", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I prefer to eat chicken and salad for lunch.",
      pt: "Eu prefiro comer frango e salada no almoço.",
      parts: [
        { text: "I ", highlight: false },
        { text: "prefer", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: " ", highlight: false },
        { text: "chicken", highlight: true },
        { text: " and ", highlight: false },
        { text: "salad", highlight: true },
        { text: " for lunch.", highlight: false },
      ]
    },
    {
      en: "Do you like sausages and bacon?",
      pt: "Você gosta de linguiça e bacon?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "like", highlight: true },
        { text: " ", highlight: false },
        { text: "sausages", highlight: true },
        { text: " and ", highlight: false },
        { text: "bacon", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "Do you want to drink juice?",
      pt: "Você quer beber suco?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "drink", highlight: true },
        { text: " ", highlight: false },
        { text: "juice", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "Do you want to eat fish or beef for dinner?",
      pt: "Você quer comer peixe ou carne no jantar?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: " ", highlight: false },
        { text: "fish", highlight: true },
        { text: " or ", highlight: false },
        { text: "beef", highlight: true },
        { text: " for dinner?", highlight: false },
      ]
    },
    {
      en: "What do you like?",
      pt: "Do que você gosta?",
      parts: [
        { text: "What do you ", highlight: false },
        { text: "like", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "What do you want to eat?",
      pt: "O que você quer comer?",
      parts: [
        { text: "What do you ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "eat", highlight: true },
        { text: "?", highlight: false },
      ]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l5-orange-juice.jpg")`,
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
            Lesson 5 - Food & Drink
          </h1>
          <SpeakSentence text="Learn to express preferences about food and drinks in English." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍖🥗 Learn to express preferences about food and drinks in English. 🍖🥗
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Food and drink"
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
                <SpeakText text="to prefer" className="text-blue-600 font-bold">to prefer</SpeakText> = preferir
              </li>
              <li>
                <SpeakText text="to love" className="text-blue-600 font-bold">to love</SpeakText> = amar, adorar
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
                { en: "beef", pt: "carne bovina" },
                { en: "chicken", pt: "frango" },
                { en: "fish", pt: "peixe" },
                { en: "bacon", pt: "bacon" },
                { en: "sausage", pt: "linguiça, salsicha" },
                { en: "tomato", pt: "tomate" },
                { en: "salad", pt: "salada" },
                { en: "French fries", pt: "batatas fritas" },
                { en: "sandwich", pt: "sanduíche" },
                { en: "vegetables", pt: "legumes, verduras" },
                { en: "rice", pt: "arroz" },
                { en: "beans", pt: "feijão" },
                { en: "soda", pt: "refrigerante" },
                { en: "or", pt: "ou" },
                { en: "what", pt: "o que, qual" },
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
            <SpeakSentence text="Practice common phrases to express food preferences" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to express food preferences
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
            <SpeakSentence text="Structures to ask and answer about food preferences" className="text-md text-gray-600 mb-4 italic">
              📚 Structures to ask and answer about food preferences
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you eat fish?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you eat fish?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você come peixe?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you want to eat French fries?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you want to eat French fries?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você quer comer batatas fritas?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you eat bread for breakfast?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you eat bread for breakfast?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você come pão no café da manhã?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="What do you eat for dinner?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  What do you eat for dinner?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">O que você come no jantar?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="What do you want to drink?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  What do you want to drink?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">O que você quer beber?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="What do you like to eat?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  What do you like to eat?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">O que você gosta de comer?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you prefer coffee or tea?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you prefer coffee or tea?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você prefere café ou chá?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you love chocolate?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you love chocolate?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você adora chocolate?</div>
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
                <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS!</h2>
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
                      <img
                        src={beefAndFishImage}
                        alt="Main meals"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Meats, fish and side dishes
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={drinkAndSandwichImage}
                        alt="Drinks and sandwiches"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Drinks and varied sandwiches
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
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
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
              <img
                src={vegetablesImage}
                alt="Person choosing food"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <SpeakSentence text="What do you want to eat? I want chicken!">
                  What do you want to eat? <span className="font-bold">I want chicken!</span>
                </SpeakSentence>
                <p className="text-sm text-gray-600 mt-1">O que você quer comer? Eu quero frango!</p>
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
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
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