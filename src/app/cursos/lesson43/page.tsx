"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

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
// MAIN COMPONENT – LESSON 43: EATING OUT
// ============================================
export default function Lesson43EatingOut() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkItOut: false,
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

  const mainImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const foodImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "fazer / dar",
      options: [
        { label: "fazer", replacement: "to make", pt: "fazer" },
        { label: "dar", replacement: "to give", pt: "dar" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu faço. / Eu dou.",
      options: [
        { label: "Eu faço", replacement: "I make.", pt: "Eu faço." },
        { label: "Eu dou", replacement: "I give.", pt: "Eu dou." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você faz. / Você dá.",
      options: [
        { label: "Você faz", replacement: "You make.", pt: "Você faz." },
        { label: "Você dá", replacement: "You give.", pt: "Você dá." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ele faz. / Ele dá.",
      options: [
        { label: "Ele faz", replacement: "He makes.", pt: "Ele faz." },
        { label: "Ele dá", replacement: "He gives.", pt: "Ele dá." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Elas não fazem. / Eles não dão.",
      options: [
        { label: "não fazem", replacement: "They don't make.", pt: "Elas não fazem." },
        { label: "não dão", replacement: "They don't give.", pt: "Eles não dão." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Nós fazemos. / Nós damos.",
      options: [
        { label: "Nós fazemos", replacement: "We make.", pt: "Nós fazemos." },
        { label: "Nós damos", replacement: "We give.", pt: "Nós damos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Você faz? / Você dá?",
      options: [
        { label: "Você faz?", replacement: "Do you make?", pt: "Você faz?" },
        { label: "Você dá?", replacement: "Do you give?", pt: "Você dá?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Ela faz? / Ela dá?",
      options: [
        { label: "Ela faz?", replacement: "Does she make?", pt: "Ela faz?" },
        { label: "Ela dá?", replacement: "Does she give?", pt: "Ela dá?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Eu quero fazer um pouco de café. / panquecas / biscoitos",
      options: [
        { label: "café", replacement: "I want to make some coffee.", pt: "Eu quero fazer um pouco de café." },
        { label: "panquecas", replacement: "I want to make some pancakes.", pt: "Eu quero fazer algumas panquecas." },
        { label: "biscoitos", replacement: "I want to make some cookies.", pt: "Eu quero fazer alguns biscoitos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "O que você quer fazer para o jantar? / almoço / café da manhã",
      options: [
        { label: "jantar", replacement: "What do you want to make for dinner?", pt: "O que você quer fazer para o jantar?" },
        { label: "almoço", replacement: "What do you want to make for lunch?", pt: "O que você quer fazer para o almoço?" },
        { label: "café da manhã", replacement: "What do you want to make for breakfast?", pt: "O que você quer fazer para o café da manhã?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "Eu quero dar minha opinião. / Ele / Ela",
      options: [
        { label: "Eu", replacement: "I want to give my opinion.", pt: "Eu quero dar minha opinião." },
        { label: "Ele", replacement: "He wants to give his opinion.", pt: "Ele quer dar a opinião dele." },
        { label: "Ela", replacement: "She wants to give her opinion.", pt: "Ela quer dar a opinião dela." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "Você gosta de dar presentes? / Eles / Ela",
      options: [
        { label: "Você", replacement: "Do you like to give gifts?", pt: "Você gosta de dar presentes?" },
        { label: "Eles", replacement: "Do they like to give gifts?", pt: "Eles gostam de dar presentes?" },
        { label: "Ela", replacement: "Does she like to give gifts?", pt: "Ela gosta de dar presentes?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-13",
      original: "Eu dou presentes para meus filhos. / meu namorado / minha namorada",
      options: [
        { label: "meus filhos", replacement: "I give gifts to my children.", pt: "Eu dou presentes para meus filhos." },
        { label: "meu namorado", replacement: "I give gifts to my boyfriend.", pt: "Eu dou presentes para meu namorado." },
        { label: "minha namorada", replacement: "I give gifts to my girlfriend.", pt: "Eu dou presentes para minha namorada." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-14",
      original: "Eu quero te dar um livro. / uma lembrancinha / um presente",
      options: [
        { label: "um livro", replacement: "I want to give you a book.", pt: "Eu quero te dar um livro." },
        { label: "uma lembrancinha", replacement: "I want to give you a little gift.", pt: "Eu quero te dar uma lembrancinha." },
        { label: "um presente", replacement: "I want to give you a present.", pt: "Eu quero te dar um presente." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Minha mãe faz bolos nos fins de semana. / pizza / pipoca",
      options: [
        { label: "bolos", replacement: "My mother makes cakes on weekends.", pt: "Minha mãe faz bolos nos fins de semana." },
        { label: "pizza", replacement: "My mother makes pizza on weekends.", pt: "Minha mãe faz pizza nos fins de semana." },
        { label: "pipoca", replacement: "My mother makes popcorn on weekends.", pt: "Minha mãe faz pipoca nos fins de semana." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Este é o meu prato favorito. / sorvete / bolo",
      options: [
        { label: "prato", replacement: "This is my favorite dish.", pt: "Este é o meu prato favorito." },
        { label: "sorvete", replacement: "This is my favorite ice cream.", pt: "Este é o meu sorvete favorito." },
        { label: "bolo", replacement: "This is my favorite cake.", pt: "Este é o meu bolo favorito." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Quando você come comida rápida? / pipoca / pizza",
      options: [
        { label: "comida rápida", replacement: "When do you eat fast food?", pt: "Quando você come comida rápida?" },
        { label: "pipoca", replacement: "When do you eat popcorn?", pt: "Quando você come pipoca?" },
        { label: "pizza", replacement: "When do you eat pizza?", pt: "Quando você come pizza?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu não faço pipoca em casa. / hambúrguer / este prato",
      options: [
        { label: "pipoca", replacement: "I don't make popcorn at home.", pt: "Eu não faço pipoca em casa." },
        { label: "hambúrguer", replacement: "I don't make hamburgers at home.", pt: "Eu não faço hambúrguer em casa." },
        { label: "este prato", replacement: "I don't make this dish at home.", pt: "Eu não faço este prato em casa." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O arroz está frio. / O frango / A carne",
      options: [
        { label: "arroz", replacement: "The rice is cold.", pt: "O arroz está frio." },
        { label: "frango", replacement: "The chicken is cold.", pt: "O frango está frio." },
        { label: "carne", replacement: "The meat is cold.", pt: "A carne está fria." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "A sopa está muito quente. / O macarrão / A comida",
      options: [
        { label: "sopa", replacement: "The soup is very hot.", pt: "A sopa está muito quente." },
        { label: "macarrão", replacement: "The macaroni is very hot.", pt: "O macarrão está muito quente." },
        { label: "comida", replacement: "The food is very hot.", pt: "A comida está muito quente." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu quero dar uma gorjeta. / ao garçom / à garçonete",
      options: [
        { label: "uma gorjeta", replacement: "I want to give a tip.", pt: "Eu quero dar uma gorjeta." },
        { label: "ao garçom", replacement: "I want to give a tip to the waiter.", pt: "Eu quero dar uma gorjeta ao garçom." },
        { label: "à garçonete", replacement: "I want to give a tip to the waitress.", pt: "Eu quero dar uma gorjeta à garçonete." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Você geralmente dá gorjetas? / Eles / Ele",
      options: [
        { label: "Você", replacement: "Do you usually give tips?", pt: "Você geralmente dá gorjetas?" },
        { label: "Eles", replacement: "Do they usually give tips?", pt: "Eles geralmente dão gorjetas?" },
        { label: "Ele", replacement: "Does he usually give tips?", pt: "Ele geralmente dá gorjetas?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Nós encontramos nossos amigos no restaurante. / na cafeteria / no shopping",
      options: [
        { label: "restaurante", replacement: "We meet our friends at the restaurant.", pt: "Nós encontramos nossos amigos no restaurante." },
        { label: "cafeteria", replacement: "We meet our friends at the cafeteria.", pt: "Nós encontramos nossos amigos na cafeteria." },
        { label: "shopping", replacement: "We meet our friends at the shopping mall.", pt: "Nós encontramos nossos amigos no shopping." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Este é o meu restaurante favorito. / dele / nosso",
      options: [
        { label: "meu", replacement: "This is my favorite restaurant.", pt: "Este é o meu restaurante favorito." },
        { label: "dele", replacement: "This is his favorite restaurant.", pt: "Este é o restaurante favorito dele." },
        { label: "nosso", replacement: "This is our favorite restaurant.", pt: "Este é o nosso restaurante favorito." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu amo a comida deles. / pizzas / pratos",
      options: [
        { label: "comida", replacement: "I love their food.", pt: "Eu amo a comida deles." },
        { label: "pizzas", replacement: "I love their pizzas.", pt: "Eu amo as pizzas deles." },
        { label: "pratos", replacement: "I love their dishes.", pt: "Eu amo os pratos deles." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu quero falar com o meu gerente. / nosso / deles",
      options: [
        { label: "meu", replacement: "I want to talk to my manager.", pt: "Eu quero falar com o meu gerente." },
        { label: "nosso", replacement: "I want to talk to our manager.", pt: "Eu quero falar com o nosso gerente." },
        { label: "deles", replacement: "I want to talk to their manager.", pt: "Eu quero falar com o gerente deles." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "O que você quer comer de sobremesa? / no almoço / no jantar",
      options: [
        { label: "de sobremesa", replacement: "What do you want to eat for dessert?", pt: "O que você quer comer de sobremesa?" },
        { label: "no almoço", replacement: "What do you want to eat for lunch?", pt: "O que você quer comer no almoço?" },
        { label: "no jantar", replacement: "What do you want to eat for dinner?", pt: "O que você quer comer no jantar?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu quero fruta de sobremesa. / sorvete / um pedaço de bolo",
      options: [
        { label: "fruta", replacement: "I want fruit for dessert.", pt: "Eu quero fruta de sobremesa." },
        { label: "sorvete", replacement: "I want ice cream for dessert.", pt: "Eu quero sorvete de sobremesa." },
        { label: "um pedaço de bolo", replacement: "I want a piece of cake for dessert.", pt: "Eu quero um pedaço de bolo de sobremesa." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ela sabe fazer bolos? / panquecas / sobremesas",
      options: [
        { label: "bolos", replacement: "Does she know how to make cakes?", pt: "Ela sabe fazer bolos?" },
        { label: "panquecas", replacement: "Does she know how to make pancakes?", pt: "Ela sabe fazer panquecas?" },
        { label: "sobremesas", replacement: "Does she know how to make desserts?", pt: "Ela sabe fazer sobremesas?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Este é o melhor restaurante da cidade. / a melhor escola / o melhor shopping",
      options: [
        { label: "restaurante", replacement: "This is the best restaurant in the city.", pt: "Este é o melhor restaurante da cidade." },
        { label: "escola", replacement: "This is the best school in the city.", pt: "Esta é a melhor escola da cidade." },
        { label: "shopping", replacement: "This is the best shopping mall in the city.", pt: "Este é o melhor shopping da cidade." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Este é o melhor prato do restaurante. / a melhor pizza / a melhor torta",
      options: [
        { label: "prato", replacement: "This is the best dish at the restaurant.", pt: "Este é o melhor prato do restaurante." },
        { label: "pizza", replacement: "This is the best pizza at the restaurant.", pt: "Esta é a melhor pizza do restaurante." },
        { label: "torta", replacement: "This is the best pie at the restaurant.", pt: "Esta é a melhor torta do restaurante." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Este é o meu melhor amigo. / nosso / dela",
      options: [
        { label: "meu", replacement: "This is my best friend.", pt: "Este é o meu melhor amigo." },
        { label: "nosso", replacement: "This is our best friend.", pt: "Este é o nosso melhor amigo." },
        { label: "dela", replacement: "This is her best friend.", pt: "Este é o melhor amigo dela." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR (SOME / ANY) ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Ele tem alguns livros em casa. / no escritório / na empresa",
      options: [
        { label: "em casa", replacement: "He has some books at home.", pt: "Ele tem alguns livros em casa." },
        { label: "no escritório", replacement: "He has some books at the office.", pt: "Ele tem alguns livros no escritório." },
        { label: "na empresa", replacement: "He has some books at the company.", pt: "Ele tem alguns livros na empresa." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Meu vizinho tem alguns amigos no exterior. / primos / parentes",
      options: [
        { label: "amigos", replacement: "My neighbor has some friends abroad.", pt: "Meu vizinho tem alguns amigos no exterior." },
        { label: "primos", replacement: "My neighbor has some cousins abroad.", pt: "Meu vizinho tem alguns primos no exterior." },
        { label: "parentes", replacement: "My neighbor has some relatives abroad.", pt: "Meu vizinho tem alguns parentes no exterior." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Algumas pessoas não gostam de comer hambúrguer. / pizza / pipoca",
      options: [
        { label: "hambúrguer", replacement: "Some people don't like to eat hamburgers.", pt: "Algumas pessoas não gostam de comer hambúrguer." },
        { label: "pizza", replacement: "Some people don't like to eat pizza.", pt: "Algumas pessoas não gostam de comer pizza." },
        { label: "pipoca", replacement: "Some people don't like to eat popcorn.", pt: "Algumas pessoas não gostam de comer pipoca." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu não quero nenhum pão, obrigado. / geleia / mel",
      options: [
        { label: "pão", replacement: "I don't want any bread, thanks.", pt: "Eu não quero nenhum pão, obrigado." },
        { label: "geleia", replacement: "I don't want any jam, thanks.", pt: "Eu não quero nenhuma geleia, obrigado." },
        { label: "mel", replacement: "I don't want any honey, thanks.", pt: "Eu não quero nenhum mel, obrigado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu não tenho nenhuma manteiga, me desculpe. / chá / granola",
      options: [
        { label: "manteiga", replacement: "I don't have any butter, I'm sorry.", pt: "Eu não tenho nenhuma manteiga, me desculpe." },
        { label: "chá", replacement: "I don't have any tea, I'm sorry.", pt: "Eu não tenho nenhum chá, me desculpe." },
        { label: "granola", replacement: "I don't have any granola, I'm sorry.", pt: "Eu não tenho nenhuma granola, me desculpe." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eu não conheço nenhuma escola aqui. / cafeteria / restaurante",
      options: [
        { label: "escola", replacement: "I don't know any schools here.", pt: "Eu não conheço nenhuma escola aqui." },
        { label: "cafeteria", replacement: "I don't know any cafeterias here.", pt: "Eu não conheço nenhuma cafeteria aqui." },
        { label: "restaurante", replacement: "I don't know any restaurants here.", pt: "Eu não conheço nenhum restaurante aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ele não conhece nenhuma série boa. / livro / história",
      options: [
        { label: "série", replacement: "He doesn't know any good series.", pt: "Ele não conhece nenhuma série boa." },
        { label: "livro", replacement: "He doesn't know any good books.", pt: "Ele não conhece nenhum livro bom." },
        { label: "história", replacement: "He doesn't know any good stories.", pt: "Ele não conhece nenhuma história boa." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Você tem alguma dica para me dar? / Eles têm / Ela tem",
      options: [
        { label: "Você", replacement: "Do you have any tips to give me?", pt: "Você tem alguma dica para me dar?" },
        { label: "Eles", replacement: "Do they have any tips to give me?", pt: "Eles têm alguma dica para me dar?" },
        { label: "Ela", replacement: "Does she have any tips to give me?", pt: "Ela tem alguma dica para me dar?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Você tem algum amigo nos Estados Unidos? / no Reino Unido / na França",
      options: [
        { label: "EUA", replacement: "Do you have any friends in the United States?", pt: "Você tem algum amigo nos Estados Unidos?" },
        { label: "Reino Unido", replacement: "Do you have any friends in the United Kingdom?", pt: "Você tem algum amigo no Reino Unido?" },
        { label: "França", replacement: "Do you have any friends in France?", pt: "Você tem algum amigo na França?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Você precisa de algum dinheiro? / Ele / Ela",
      options: [
        { label: "Você", replacement: "Do you need any money?", pt: "Você precisa de algum dinheiro?" },
        { label: "Ele", replacement: "Does he need any money?", pt: "Ele precisa de algum dinheiro?" },
        { label: "Ela", replacement: "Does she need any money?", pt: "Ela precisa de algum dinheiro?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Você quer um pouco de suco? / refrigerante / água",
      options: [
        { label: "suco", replacement: "Do you want some juice?", pt: "Você quer um pouco de suco?" },
        { label: "refrigerante", replacement: "Do you want some soda?", pt: "Você quer um pouco de refrigerante?" },
        { label: "água", replacement: "Do you want some water?", pt: "Você quer um pouco de água?" }
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
      en: "This is the best restaurant in the city.",
      pt: "Este é o melhor restaurante da cidade.",
      green: ["best", "restaurant", "city"]
    },
    {
      en: "What do you want for dessert?",
      pt: "O que você quer comer de sobremesa?",
      green: ["want", "dessert"]
    },
    {
      en: "I want fruit for dessert.",
      pt: "Eu quero fruta de sobremesa.",
      green: ["fruit", "dessert"]
    },
    {
      en: "Does she know how to make cakes?",
      pt: "Ela sabe fazer bolos?",
      green: ["know", "make", "cakes"]
    },
    {
      en: "This is the best dish at the restaurant.",
      pt: "Este é o melhor prato do restaurante.",
      green: ["best", "dish"]
    },
    {
      en: "This is my best friend.",
      pt: "Este é o meu melhor amigo.",
      green: ["best", "friend"]
    }
  ];

  // Dados da seção Make it yours com palavras-chave destacadas em azul
  const makeItYoursData = [
    {
      en: "Do you know how to make chocolate popcorn?",
      pt: "Você sabe fazer pipoca de chocolate?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "know", highlight: true },
        { text: " how to ", highlight: false },
        { text: "make", highlight: true },
        { text: " chocolate ", highlight: false },
        { text: "popcorn", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "I want to make your favorite dish tonight.",
      pt: "Eu quero fazer seu prato favorito hoje à noite.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "make", highlight: true },
        { text: " your favorite ", highlight: false },
        { text: "dish", highlight: true },
        { text: " tonight.", highlight: false },
      ]
    },
    {
      en: "We want to give you this book.",
      pt: "Nós queremos te dar este livro.",
      parts: [
        { text: "We ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "give", highlight: true },
        { text: " you this ", highlight: false },
        { text: "book", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I want to give a gift to my mother.",
      pt: "Eu quero dar um presente para minha mãe.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "give", highlight: true },
        { text: " a ", highlight: false },
        { text: "gift", highlight: true },
        { text: " to my mother.", highlight: false },
      ]
    },
    {
      en: "Do you usually give tips to the waiters?",
      pt: "Você costuma dar gorjeta para os garçons?",
      parts: [
        { text: "Do you usually ", highlight: false },
        { text: "give", highlight: true },
        { text: " ", highlight: false },
        { text: "tips", highlight: true },
        { text: " to the ", highlight: false },
        { text: "waiters", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "I love that place! Their food is very good!",
      pt: "Eu amo aquele lugar! A comida deles é muito boa!",
      parts: [
        { text: "I ", highlight: false },
        { text: "love", highlight: true },
        { text: " that place! Their ", highlight: false },
        { text: "food", highlight: true },
        { text: " is very ", highlight: false },
        { text: "good", highlight: true },
        { text: "!", highlight: false },
      ]
    },
    {
      en: "I want some tomato sauce, please.",
      pt: "Eu quero um pouco de molho de tomate, por favor.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " some ", highlight: false },
        { text: "tomato sauce", highlight: true },
        { text: ", please.", highlight: false },
      ]
    },
    {
      en: "Do you want some coffee?",
      pt: "Você quer um pouco de café?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "want", highlight: true },
        { text: " some ", highlight: false },
        { text: "coffee", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "We don't have any food. Let's go to the grocery store.",
      pt: "Nós não temos nenhuma comida. Vamos ao supermercado.",
      parts: [
        { text: "We don't have ", highlight: false },
        { text: "any", highlight: true },
        { text: " ", highlight: false },
        { text: "food", highlight: true },
        { text: ". Let's go to the grocery store.", highlight: false },
      ]
    },
    {
      en: "Do you have any salad?",
      pt: "Você tem alguma salada?",
      parts: [
        { text: "Do you have ", highlight: false },
        { text: "any", highlight: true },
        { text: " ", highlight: false },
        { text: "salad", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "I want to give a tip to the waiter.",
      pt: "Eu quero dar uma gorjeta ao garçom.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "give", highlight: true },
        { text: " a ", highlight: false },
        { text: "tip", highlight: true },
        { text: " to the waiter.", highlight: false },
      ]
    },
    {
      en: "This is the best restaurant in the city.",
      pt: "Este é o melhor restaurante da cidade.",
      parts: [
        { text: "This is the ", highlight: false },
        { text: "best", highlight: true },
        { text: " ", highlight: false },
        { text: "restaurant", highlight: true },
        { text: " in the ", highlight: false },
        { text: "city", highlight: true },
        { text: ".", highlight: false },
      ]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            🍽️ Lesson 43 - Eating Out
          </h1>
          <SpeakSentence text="Learn to talk about food, restaurants, and use the verbs to make and to give with some and any." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍽️ Learn to talk about food, restaurants, and use the verbs "to make" and "to give" with some/any. 🍽️
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Eating out at a restaurant"
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
                <SpeakText text="to make" className="text-blue-600 font-bold">to make</SpeakText> = fazer
              </li>
              <li>
                <SpeakText text="to give" className="text-blue-600 font-bold">to give</SpeakText> = dar
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
                { en: "dish", pt: "prato" },
                { en: "hamburger", pt: "hambúrguer" },
                { en: "pizza", pt: "pizza" },
                { en: "popcorn", pt: "pipoca" },
                { en: "cake", pt: "bolo" },
                { en: "ice cream", pt: "sorvete" },
                { en: "fast food", pt: "comida rápida" },
                { en: "tip", pt: "gorjeta" },
                { en: "waiter", pt: "garçom" },
                { en: "waitress", pt: "garçonete" },
                { en: "favorite", pt: "favorito(a)" },
                { en: "hot", pt: "quente" },
                { en: "cold", pt: "frio" },
                { en: "our", pt: "nosso" },
                { en: "their", pt: "deles" },
                { en: "any", pt: "algum / nenhum" },
                { en: "some", pt: "algum / um pouco" },
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
            <SpeakSentence text="Practice common phrases to talk about restaurants and food" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about restaurants and food
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
                <h2 className="text-2xl font-bold">🔹 GRAMMAR (Some & Any)</h2>
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
            <SpeakSentence text="Some is used in positive sentences. Any is used in negative sentences and questions." className="text-md text-gray-600 mb-4 italic">
              📚 Some = used in positive sentences; Any = used in negative sentences and questions
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I have some water." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I have some water.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu tenho um pouco de água.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I don't have any money." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I don't have any money.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu não tenho nenhum dinheiro.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you have any questions?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you have any questions?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você tem alguma pergunta?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you want some coffee?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you want some coffee?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você quer um pouco de café?</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="We don't have any food." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  We don't have any food.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Nós não temos nenhuma comida.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you have any salad?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you have any salad?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você tem alguma salada?</div>
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
                        src={restaurantImage}
                        alt="Restaurant"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Eating at a restaurant
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={foodImage}
                        alt="Delicious food"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Delicious dishes
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
                  { en: "May I see the menu, please?", pt: "Posso ver o cardápio, por favor?" },
                  { en: "Let's go to a pizza place!", pt: "Vamos a uma pizzaria!" },
                  { en: "I would like to order the steak, please.", pt: "Eu gostaria de pedir o bife, por favor." },
                  { en: "Can I have the bill, please?", pt: "Posso ter a conta, por favor?" },
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
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
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
            onClick={() => router.push("/cursos/lesson42")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson44")}
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
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}