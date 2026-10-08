"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = "verbs" | "vocabulary" | "usefulPhrases" | "grammar";

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// SPEECH SYSTEM — same as Lesson 63
// ============================================
interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const americanFemaleVoices = voices.filter(
    (voice) =>
      (voice.lang === "en-US" || voice.lang.startsWith("en-US")) &&
      (voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("google us english") ||
        voice.name.toLowerCase().includes("siri") ||
        voice.name.toLowerCase().includes("female") ||
        voice.name === "Google US English" ||
        voice.name === "Samantha")
  );
  const americanVoices = voices.filter(
    (voice) => voice.lang === "en-US" || voice.lang.startsWith("en-US")
  );
  if (americanFemaleVoices.length > 0) {
    utterance.voice = americanFemaleVoices[0];
  } else if (americanVoices.length > 0) {
    utterance.voice = americanVoices[0];
  }
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => (
  <button
    onClick={() => speakEnglish(text, 0.9)}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-purple-100 px-1 rounded transition-colors group ${className}`}
    title="Click to hear American pronunciation"
  >
    {children || text}
    {showIcon && (
      <Volume2
        size={12}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-500"
      />
    )}
  </button>
);

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => (
  <button
    onClick={() => {
      const speechText = children && typeof children === "string" ? children : text;
      speakEnglish(speechText, 0.85);
    }}
    className={`group cursor-pointer hover:bg-purple-50 px-1 rounded transition-colors text-left w-full ${className}`}
  >
    {children || text}
    <Volume2
      size={12}
      className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-purple-500"
    />
  </button>
);

// ============================================
// NOTE MODAL
// ============================================
function NoteModal({
  isOpen,
  onClose,
  sectionTitle,
  initialNote,
  onSave,
}: {
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
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-purple-100 mt-1">
            Escreva suas observações, dúvidas ou traduções
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
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
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-white/70 hover:text-white transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// SUBSTITUTION EXERCISE COMPONENT (from Lesson 63)
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

  const isObjectOption = (
    opt: OptionType
  ): opt is { label: string; replacement: string; pt?: string } => {
    return (
      typeof opt === "object" && opt !== null && "label" in opt && "replacement" in opt
    );
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

  const toggleVisibility = () => setShowEnglish((prev) => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);
  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-purple-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-purple-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-purple-700 font-medium" />
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-purple-200 pt-1">
              🇧🇷 {currentPt}
            </p>
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
                ? "bg-purple-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
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
// HIGHLIGHTED PHRASE COMPONENT
// ============================================
function HighlightedPhrase({
  text,
  greenWords,
  translation,
}: {
  text: string;
  greenWords: string[];
  translation: string;
}) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, "");
    if (greenWords.some((gw) => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return (
        <span key={i} className="text-purple-600 font-bold">
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-purple-200">
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
// MAIN COMPONENT — LESSON 49
// ============================================
export default function Lesson49GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || "",
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  const handleOptionClick = (key: string, index: number) => {
    setSubstitutionState((prev) => ({ ...prev, [key]: index }));
  };

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "I wear / You wear / He wears / We wear / They wear",
      options: [
        { label: "I", replacement: "I wear.", pt: "Eu visto." },
        { label: "You", replacement: "You wear.", pt: "Você veste." },
        { label: "He", replacement: "He wears.", pt: "Ele veste." },
        { label: "We", replacement: "We wear.", pt: "Nós vestimos." },
        { label: "They", replacement: "They wear.", pt: "Eles vestem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "She doesn't wear jeans. / a coat / a dress",
      options: [
        {
          label: "jeans",
          replacement: "She doesn't wear jeans.",
          pt: "Ela não veste calça jeans.",
        },
        {
          label: "a coat",
          replacement: "She doesn't wear a coat.",
          pt: "Ela não veste um casaco.",
        },
        {
          label: "a dress",
          replacement: "She doesn't wear a dress.",
          pt: "Ela não veste um vestido.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Does he wear glasses? / a uniform / a suit",
      options: [
        {
          label: "glasses",
          replacement: "Does he wear glasses?",
          pt: "Ele usa óculos?",
        },
        {
          label: "a uniform",
          replacement: "Does he wear a uniform?",
          pt: "Ele usa uniforme?",
        },
        {
          label: "a suit",
          replacement: "Does he wear a suit?",
          pt: "Ele usa terno?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Do you wear a uniform? / a suit / glasses",
      options: [
        {
          label: "a uniform",
          replacement: "Do you wear a uniform?",
          pt: "Você usa uniforme?",
        },
        {
          label: "a suit",
          replacement: "Do you wear a suit?",
          pt: "Você usa terno?",
        },
        {
          label: "glasses",
          replacement: "Do you wear glasses?",
          pt: "Você usa óculos?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Do they wear suits to work? / to school / to the party",
      options: [
        {
          label: "to work",
          replacement: "Do they wear suits to work?",
          pt: "Eles usam terno para o trabalho?",
        },
        {
          label: "to school",
          replacement: "Do they wear suits to school?",
          pt: "Eles usam terno para a escola?",
        },
        {
          label: "to the party",
          replacement: "Do they wear suits to the party?",
          pt: "Eles usam terno para a festa?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "What do you like to wear? / does he / does she",
      options: [
        {
          label: "you",
          replacement: "What do you like to wear?",
          pt: "O que você gosta de usar?",
        },
        {
          label: "he",
          replacement: "What does he like to wear?",
          pt: "O que ele gosta de usar?",
        },
        {
          label: "she",
          replacement: "What does she like to wear?",
          pt: "O que ela gosta de usar?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "I change / You change / He changes / We change / They change",
      options: [
        { label: "I", replacement: "I change.", pt: "Eu troco." },
        { label: "You", replacement: "You change.", pt: "Você troca." },
        { label: "He", replacement: "He changes.", pt: "Ele troca." },
        { label: "We", replacement: "We change.", pt: "Nós trocamos." },
        { label: "They", replacement: "They change.", pt: "Eles trocam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "I don't change my style. / my outfit / my shoes",
      options: [
        {
          label: "my style",
          replacement: "I don't change my style.",
          pt: "Eu não mudo meu estilo.",
        },
        {
          label: "my outfit",
          replacement: "I don't change my outfit.",
          pt: "Eu não troco de roupa.",
        },
        {
          label: "my shoes",
          replacement: "I don't change my shoes.",
          pt: "Eu não troco meus sapatos.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "She doesn't change clothes often. / He / They",
      options: [
        {
          label: "She",
          replacement: "She doesn't change clothes often.",
          pt: "Ela não troca de roupa com frequência.",
        },
        {
          label: "He",
          replacement: "He doesn't change clothes often.",
          pt: "Ele não troca de roupa com frequência.",
        },
        {
          label: "They",
          replacement: "They don't change clothes often.",
          pt: "Eles não trocam de roupa com frequência.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Do you change your outfit? / he / they",
      options: [
        {
          label: "you",
          replacement: "Do you change your outfit?",
          pt: "Você muda sua roupa?",
        },
        {
          label: "he",
          replacement: "Does he change his outfit?",
          pt: "Ele muda a roupa dele?",
        },
        {
          label: "they",
          replacement: "Do they change their outfit?",
          pt: "Eles mudam a roupa deles?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "Do they change the shoes? / the clothes / the style",
      options: [
        {
          label: "the shoes",
          replacement: "Do they change the shoes?",
          pt: "Eles trocam os sapatos?",
        },
        {
          label: "the clothes",
          replacement: "Do they change the clothes?",
          pt: "Eles trocam as roupas?",
        },
        {
          label: "the style",
          replacement: "Do they change the style?",
          pt: "Eles mudam o estilo?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "Does he change his mind often? / she / they",
      options: [
        {
          label: "he",
          replacement: "Does he change his mind often?",
          pt: "Ele muda de ideia com frequência?",
        },
        {
          label: "she",
          replacement: "Does she change her mind often?",
          pt: "Ela muda de ideia com frequência?",
        },
        {
          label: "they",
          replacement: "Do they change their mind often?",
          pt: "Eles mudam de ideia com frequência?",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "I prefer to wear a t-shirt. / a suit / a shirt",
      options: [
        {
          label: "a t-shirt",
          replacement: "I prefer to wear a t-shirt.",
          pt: "Eu prefiro usar uma camiseta.",
        },
        {
          label: "a suit",
          replacement: "I prefer to wear a suit.",
          pt: "Eu prefiro usar um terno.",
        },
        {
          label: "a shirt",
          replacement: "I prefer to wear a shirt.",
          pt: "Eu prefiro usar uma camisa.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "She likes to wear skirts. / dresses / sneakers",
      options: [
        {
          label: "skirts",
          replacement: "She likes to wear skirts.",
          pt: "Ela gosta de usar saias.",
        },
        {
          label: "dresses",
          replacement: "She likes to wear dresses.",
          pt: "Ela gosta de usar vestidos.",
        },
        {
          label: "sneakers",
          replacement: "She likes to wear sneakers.",
          pt: "Ela gosta de usar tênis.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "My sister doesn't like to wear glasses. / coats / jeans",
      options: [
        {
          label: "glasses",
          replacement: "My sister doesn't like to wear glasses.",
          pt: "Minha irmã não gosta de usar óculos.",
        },
        {
          label: "coats",
          replacement: "My sister doesn't like to wear coats.",
          pt: "Minha irmã não gosta de usar casacos.",
        },
        {
          label: "jeans",
          replacement: "My sister doesn't like to wear jeans.",
          pt: "Minha irmã não gosta de usar calças jeans.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "He never wears this jacket. / coat / suit",
      options: [
        {
          label: "this jacket",
          replacement: "He never wears this jacket.",
          pt: "Ele nunca usa esta jaqueta.",
        },
        {
          label: "this coat",
          replacement: "He never wears this coat.",
          pt: "Ele nunca usa este casaco.",
        },
        {
          label: "this suit",
          replacement: "He never wears this suit.",
          pt: "Ele nunca usa este terno.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "I need to take my white sneakers. / blue dress / black jacket",
      options: [
        {
          label: "white sneakers",
          replacement: "I need to take my white sneakers.",
          pt: "Eu preciso levar meus tênis brancos.",
        },
        {
          label: "blue dress",
          replacement: "I need to take my blue dress.",
          pt: "Eu preciso levar meu vestido azul.",
        },
        {
          label: "black jacket",
          replacement: "I need to take my black jacket.",
          pt: "Eu preciso levar minha jaqueta preta.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "I want to change my outfit. / my style / my shorts",
      options: [
        {
          label: "my outfit",
          replacement: "I want to change my outfit.",
          pt: "Eu quero trocar de roupa.",
        },
        {
          label: "my style",
          replacement: "I want to change my style.",
          pt: "Eu quero mudar meu estilo.",
        },
        {
          label: "my shorts",
          replacement: "I want to change my shorts.",
          pt: "Eu quero trocar minha bermuda.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Do you want to buy a new watch? / a new outfit / a new suit",
      options: [
        {
          label: "a new watch",
          replacement: "Do you want to buy a new watch?",
          pt: "Você quer comprar um relógio novo?",
        },
        {
          label: "a new outfit",
          replacement: "Do you want to buy a new outfit?",
          pt: "Você quer comprar um conjunto novo?",
        },
        {
          label: "a new suit",
          replacement: "Do you want to buy a new suit?",
          pt: "Você quer comprar um terno novo?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I want to buy something special. / new / beautiful",
      options: [
        {
          label: "something special",
          replacement: "I want to buy something special.",
          pt: "Eu quero comprar alguma coisa especial.",
        },
        {
          label: "something new",
          replacement: "I want to buy something new.",
          pt: "Eu quero comprar alguma coisa nova.",
        },
        {
          label: "something beautiful",
          replacement: "I want to buy something beautiful.",
          pt: "Eu quero comprar alguma coisa bonita.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "I want that black t-shirt. / jacket / suit",
      options: [
        {
          label: "that black t-shirt",
          replacement: "I want that black t-shirt.",
          pt: "Eu quero aquela camiseta preta.",
        },
        {
          label: "that black jacket",
          replacement: "I want that black jacket.",
          pt: "Eu quero aquela jaqueta preta.",
        },
        {
          label: "that black suit",
          replacement: "I want that black suit.",
          pt: "Eu quero aquele terno preto.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Those pants are beautiful. / jeans / shorts",
      options: [
        {
          label: "Those pants",
          replacement: "Those pants are beautiful.",
          pt: "Aquelas calças são lindas.",
        },
        {
          label: "Those jeans",
          replacement: "Those jeans are beautiful.",
          pt: "Aquelas calças jeans são lindas.",
        },
        {
          label: "Those shorts",
          replacement: "Those shorts are beautiful.",
          pt: "Aquelas bermudas são lindas.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "I want to wear a suit for the meeting. / a jacket / a shirt",
      options: [
        {
          label: "a suit",
          replacement: "I want to wear a suit for the meeting.",
          pt: "Eu quero usar um terno para a reunião.",
        },
        {
          label: "a jacket",
          replacement: "I want to wear a jacket for the meeting.",
          pt: "Eu quero usar uma jaqueta para a reunião.",
        },
        {
          label: "a shirt",
          replacement: "I want to wear a shirt for the meeting.",
          pt: "Eu quero usar uma camisa para a reunião.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "What do you wear for work? / for school",
      options: [
        {
          label: "for work",
          replacement: "What do you wear for work?",
          pt: "O que você veste para o trabalho?",
        },
        {
          label: "for school",
          replacement: "What do you wear for school?",
          pt: "O que você veste para a escola?",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- USEFUL PHRASES ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "What size do you wear? / does he wear? / does she wear?",
      options: [
        {
          label: "do you",
          replacement: "What size do you wear?",
          pt: "Que tamanho você usa?",
        },
        {
          label: "does he",
          replacement: "What size does he wear?",
          pt: "Que tamanho ele usa?",
        },
        {
          label: "does she",
          replacement: "What size does she wear?",
          pt: "Que tamanho ela usa?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Does he wear size small? / medium / large",
      options: [
        {
          label: "small",
          replacement: "Does he wear size small?",
          pt: "Ele usa tamanho pequeno?",
        },
        {
          label: "medium",
          replacement: "Does he wear size medium?",
          pt: "Ele usa tamanho médio?",
        },
        {
          label: "large",
          replacement: "Does he wear size large?",
          pt: "Ele usa tamanho grande?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "I want to try that coat on. / suit / pants",
      options: [
        {
          label: "that coat",
          replacement: "I want to try that coat on.",
          pt: "Eu quero provar aquele casaco.",
        },
        {
          label: "that suit",
          replacement: "I want to try that suit on.",
          pt: "Eu quero provar aquele terno.",
        },
        {
          label: "those pants",
          replacement: "I want to try those pants on.",
          pt: "Eu quero provar aquelas calças.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Do you want to try the dress on? / the t-shirt / the shorts",
      options: [
        {
          label: "the dress",
          replacement: "Do you want to try the dress on?",
          pt: "Você quer provar o vestido?",
        },
        {
          label: "the t-shirt",
          replacement: "Do you want to try the t-shirt on?",
          pt: "Você quer provar a camiseta?",
        },
        {
          label: "the shorts",
          replacement: "Do you want to try the shorts on?",
          pt: "Você quer provar a bermuda?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "I want to buy a pair of shoes. / a pair of jeans / a pair of black pants",
      options: [
        {
          label: "a pair of shoes",
          replacement: "I want to buy a pair of shoes.",
          pt: "Eu quero comprar um par de sapatos.",
        },
        {
          label: "a pair of jeans",
          replacement: "I want to buy a pair of jeans.",
          pt: "Eu quero comprar um par de calças jeans.",
        },
        {
          label: "a pair of black pants",
          replacement: "I want to buy a pair of black pants.",
          pt: "Eu quero comprar um par de calças pretas.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "He needs a pair of socks. / a pair of glasses / a pair of sunglasses",
      options: [
        {
          label: "a pair of socks",
          replacement: "He needs a pair of socks.",
          pt: "Ele precisa de um par de meias.",
        },
        {
          label: "a pair of glasses",
          replacement: "He needs a pair of glasses.",
          pt: "Ele precisa de um par de óculos.",
        },
        {
          label: "a pair of sunglasses",
          replacement: "He needs a pair of sunglasses.",
          pt: "Ele precisa de um par de óculos de sol.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR (Present Continuous) ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "She is making my favorite dish. / his / our",
      options: [
        {
          label: "my",
          replacement: "She is making my favorite dish.",
          pt: "Ela está fazendo meu prato favorito.",
        },
        {
          label: "his",
          replacement: "She is making his favorite dish.",
          pt: "Ela está fazendo o prato favorito dele.",
        },
        {
          label: "our",
          replacement: "She is making our favorite dish.",
          pt: "Ela está fazendo nosso prato favorito.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "He is opening the store. / She is opening / We are opening",
      options: [
        {
          label: "He",
          replacement: "He is opening the store.",
          pt: "Ele está abrindo a loja.",
        },
        {
          label: "She",
          replacement: "She is opening the store.",
          pt: "Ela está abrindo a loja.",
        },
        {
          label: "We",
          replacement: "We are opening the store.",
          pt: "Nós estamos abrindo a loja.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "They are waiting for you. / the sales clerk / the manager",
      options: [
        {
          label: "you",
          replacement: "They are waiting for you.",
          pt: "Eles estão esperando por você.",
        },
        {
          label: "the sales clerk",
          replacement: "They are waiting for the sales clerk.",
          pt: "Eles estão esperando pelo vendedor.",
        },
        {
          label: "the manager",
          replacement: "They are waiting for the manager.",
          pt: "Eles estão esperando pelo gerente.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "He is closing the bar now. / the snack bar / the restaurant",
      options: [
        {
          label: "the bar",
          replacement: "He is closing the bar now.",
          pt: "Ele está fechando o bar agora.",
        },
        {
          label: "the snack bar",
          replacement: "He is closing the snack bar now.",
          pt: "Ele está fechando a lanchonete agora.",
        },
        {
          label: "the restaurant",
          replacement: "He is closing the restaurant now.",
          pt: "Ele está fechando o restaurante agora.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Someone is calling you. / the doctor / the nurse",
      options: [
        {
          label: "you",
          replacement: "Someone is calling you.",
          pt: "Alguém está chamando você.",
        },
        {
          label: "the doctor",
          replacement: "Someone is calling the doctor.",
          pt: "Alguém está chamando o médico.",
        },
        {
          label: "the nurse",
          replacement: "Someone is calling the nurse.",
          pt: "Alguém está chamando a enfermeira.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "She is wearing a dress. / a coat / a pair of jeans",
      options: [
        {
          label: "a dress",
          replacement: "She is wearing a dress.",
          pt: "Ela está usando um vestido.",
        },
        {
          label: "a coat",
          replacement: "She is wearing a coat.",
          pt: "Ela está usando um casaco.",
        },
        {
          label: "a pair of jeans",
          replacement: "She is wearing a pair of jeans.",
          pt: "Ela está usando um par de calças jeans.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "He is talking to his sister. / mother / father",
      options: [
        {
          label: "his sister",
          replacement: "He is talking to his sister.",
          pt: "Ele está falando com a irmã dele.",
        },
        {
          label: "his mother",
          replacement: "He is talking to his mother.",
          pt: "Ele está falando com a mãe dele.",
        },
        {
          label: "his father",
          replacement: "He is talking to his father.",
          pt: "Ele está falando com o pai dele.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "I am trying on the shoes. / the suit / the shirt",
      options: [
        {
          label: "the shoes",
          replacement: "I am trying on the shoes.",
          pt: "Eu estou provando os sapatos.",
        },
        {
          label: "the suit",
          replacement: "I am trying on the suit.",
          pt: "Eu estou provando o terno.",
        },
        {
          label: "the shirt",
          replacement: "I am trying on the shirt.",
          pt: "Eu estou provando a camisa.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "I am changing my clothes. / He is changing / She is changing",
      options: [
        {
          label: "I am",
          replacement: "I am changing my clothes.",
          pt: "Eu estou trocando de roupa.",
        },
        {
          label: "He is",
          replacement: "He is changing his clothes.",
          pt: "Ele está trocando de roupa.",
        },
        {
          label: "She is",
          replacement: "She is changing her clothes.",
          pt: "Ela está trocando de roupa.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "We are having lunch. / dinner / a snack",
      options: [
        {
          label: "lunch",
          replacement: "We are having lunch.",
          pt: "Nós estamos almoçando.",
        },
        {
          label: "dinner",
          replacement: "We are having dinner.",
          pt: "Nós estamos jantando.",
        },
        {
          label: "a snack",
          replacement: "We are having a snack.",
          pt: "Nós estamos fazendo um lanche.",
        },
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...vocabSubstitution,
    ...phrasesSubstitution,
    ...grammarSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "I want to buy a pair of shoes.",
      pt: "Eu quero comprar um par de sapatos.",
      green: ["pair", "shoes"],
    },
    {
      en: "I want to try that dress on.",
      pt: "Eu quero experimentar aquele vestido.",
      green: ["try", "on"],
    },
    {
      en: "What size are you?",
      pt: "Qual é o seu tamanho?",
      green: ["size"],
    },
    {
      en: "I'm changing my outfit before we go.",
      pt: "Estou trocando de roupa antes de irmos.",
      green: ["changing", "outfit"],
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* ============ HEADER ============ */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 49 – GOING SHOPPING
          </h1>
          <SpeakSentence
            text="Learn to talk about clothes, sizes, trying things on, and use the Present Continuous, Present Perfect and Past Perfect in English."
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            🛍️ Aprenda a falar sobre roupas, tamanhos, como experimentar peças e use o{" "}
            <strong>Present Continuous</strong>, <strong>Present Perfect</strong> e{" "}
            <strong>Past Perfect</strong> em inglês!
          </SpeakSentence>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔵 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal("Verbs")} />
            </div>
            <button
              onClick={() => toggleDrill("verbs")}
              className="inline-block rounded-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 text-sm transition-all duration-300"
            >
              {openDrills.verbs ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Click on the verbs to hear the pronunciation and practice their forms"
              className="text-md text-gray-600 mb-4 italic"
            >
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to wear" className="text-purple-600 font-bold">
                  to wear
                </SpeakText>{" "}
                = vestir, usar
              </li>
              <li>
                <SpeakText text="to change" className="text-purple-600 font-bold">
                  to change
                </SpeakText>{" "}
                = trocar, mudar
              </li>
            </ul>
            {openDrills.verbs && (
              <div
                className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
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
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟣 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal("New Words")} />
            </div>
            <button
              onClick={() => toggleDrill("vocabulary")}
              className="inline-block rounded-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 text-sm transition-all duration-300"
            >
              {openDrills.vocabulary ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Click on each word to hear its correct pronunciation"
              className="text-md text-gray-600 mb-4 italic"
            >
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "shirt", pt: "blusa, camisa" },
                { en: "t-shirt", pt: "camiseta" },
                { en: "pants", pt: "calça" },
                { en: "jeans", pt: "calça jeans" },
                { en: "dress", pt: "vestido" },
                { en: "skirt", pt: "saia" },
                { en: "jacket", pt: "jaqueta" },
                { en: "coat", pt: "casaco" },
                { en: "sneakers", pt: "tênis" },
                { en: "suit", pt: "terno" },
                { en: "socks", pt: "meias" },
                { en: "shorts", pt: "bermudas" },
                { en: "watch", pt: "relógio" },
                { en: "glasses", pt: "óculos" },
                { en: "outfit", pt: "roupa, conjunto" },
                { en: "style", pt: "estilo" },
              ].map((word, idx) => (
                <div
                  key={idx}
                  className="bg-purple-50 p-3 rounded-lg border border-purple-200"
                >
                  <SpeakText
                    text={word.en}
                    className="text-purple-600 font-bold cursor-pointer text-left w-full block"
                  >
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div
                className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
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
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟢 SPEAK LIKE A NATIVE</h2>
              <PencilIcon onClick={() => openNoteModal("Useful Phrases")} />
            </div>
            <button
              onClick={() => toggleDrill("usefulPhrases")}
              className="inline-block rounded-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 text-sm transition-all duration-300"
            >
              {openDrills.usefulPhrases ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Practice common phrases for shopping"
              className="text-md text-gray-600 mb-4 italic"
            >
              💬 Practice common phrases for shopping
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
              <div
                className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
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
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                🟡 GRAMMAR – PRESENT CONTINUOUS
              </h2>
              <PencilIcon onClick={() => openNoteModal("Grammar")} />
            </div>
            <button
              onClick={() => toggleDrill("grammar")}
              className="inline-block rounded-full bg-purple-700 hover:bg-purple-800 text-white px-8 py-3 text-sm transition-all duration-300"
            >
              {openDrills.grammar ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <div className="bg-purple-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">
                📚 UNDERSTANDING THE PRESENT CONTINUOUS
              </h3>

              <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500 mb-4">
                <h4 className="text-lg font-bold text-purple-700 mb-2">
                  ✅ STRUCTURE
                </h4>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">
                    Subject + verb to be (am/is/are) + main verb with -ing
                  </span>
                </p>
                <p className="text-gray-600 italic">
                  &quot;I am waiting for the doctor.&quot;
                </p>
                <p className="text-sm text-gray-500">
                  Eu estou esperando pelo médico.
                </p>
                <p className="text-gray-600 italic mt-2">
                  &quot;She is changing her outfit.&quot;
                </p>
                <p className="text-sm text-gray-500">Ela está trocando de roupa.</p>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <h4 className="text-lg font-bold text-yellow-700 mb-2">
                  💡 WHEN TO USE
                </h4>
                <p className="text-gray-700">
                  Actions that are happening{" "}
                  <span className="font-bold">now, at this moment</span>.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I am waiting for the doctor.", pt: "Eu estou esperando pelo médico." },
                { en: "You are wearing a beautiful coat.", pt: "Você está usando um casaco lindo." },
                { en: "She is changing her outfit.", pt: "Ela está trocando de roupa." },
                { en: "He is making a delicious cake.", pt: "Ele está fazendo um bolo delicioso." },
                { en: "The class is starting now.", pt: "A aula está começando agora." },
                { en: "They are watching a movie now.", pt: "Eles estão assistindo a um filme agora." },
                { en: "We are reading a funny story.", pt: "Nós estamos lendo uma história engraçada." },
                { en: "The children are studying in the living room.", pt: "As crianças estão estudando na sala de estar." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence
                    text={item.en}
                    className="text-purple-600 font-bold cursor-pointer text-left w-full block"
                  >
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div
                className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
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
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal("Make it yours!")} />
            </div>
            <div className="text-sm text-purple-100">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-purple-50 rounded-[20px] p-6 space-y-4">
              {[
                { en: "I want to try this shirt on.", pt: "Quero experimentar esta camisa." },
                { en: "Do you want to try the blue pants on?", pt: "Você quer experimentar a calça azul?" },
                { en: "I need to change my clothes before we go.", pt: "Preciso trocar de roupa antes de irmos." },
                { en: "I prefer to wear comfortable clothes to work.", pt: "Prefiro usar roupas confortáveis para o trabalho." },
                { en: "He is always wearing sunglasses.", pt: "Ele está sempre usando óculos de sol." },
                { en: "I really like the suit you're wearing today.", pt: "Eu gosto muito do terno que você está usando hoje." },
                { en: "You're wearing funny socks!", pt: "Você está usando meias engraçadas!" },
                { en: "I'm buying a new pair of pants for my husband.", pt: "Estou comprando uma calça nova para meu marido." },
                { en: "They're waiting for you at the mall.", pt: "Eles estão esperando por você no shopping." },
                { en: "We're changing our outfit to go to the bar.", pt: "Estamos trocando de roupa para ir ao bar." },
                { en: "She is talking to the sales clerk now.", pt: "Ela está falando com o vendedor agora." },
                { en: "They're closing the store now.", pt: "Eles estão fechando a loja agora." },
              ].map((s, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-start">
                    <SpeakSentence text={s.en} className="text-base font-medium">
                      {idx + 1}. {s.en}
                    </SpeakSentence>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-purple-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence
              text="Key expressions and useful vocabulary to remember"
              className="mt-2 text-purple-100 italic"
            >
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-purple-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">
                SIZES & CLOTHES
              </h3>
              {[
                { en: "small / medium / large", pt: "pequeno / médio / grande" },
                { en: "I'm a medium.", pt: "Eu visto médio." },
                { en: "I wear medium.", pt: "Eu uso tamanho médio." },
                { en: "a pair of shoes", pt: "um par de sapatos" },
                { en: "a pair of sneakers", pt: "um par de tênis" },
                { en: "a pair of pants", pt: "um par de calças" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-purple-200 hover:text-white">
                      • {item.en}
                    </SpeakSentence>
                  </div>
                  <p className="text-purple-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-purple-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">
                    ✨ PRESENT PERFECT
                  </h4>
                  <div className="space-y-3">
                    {[
                      { en: "I have bought a new shirt.", pt: "Eu comprei uma camisa nova." },
                      { en: "She has worn that dress before.", pt: "Ela já usou aquele vestido antes." },
                      { en: "We have never tried this store.", pt: "Nós nunca experimentamos esta loja." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-purple-900 rounded-lg">
                        <SpeakSentence text={item.en} className="text-purple-100 font-bold">
                          {item.en}
                        </SpeakSentence>
                        <p className="text-purple-200 text-sm mt-1">{item.pt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">
                    ⏳ PAST PERFECT
                  </h4>
                  <div className="space-y-3">
                    {[
                      { en: "I had already changed my clothes when he arrived.", pt: "Eu já tinha trocado de roupa quando ele chegou." },
                      { en: "She had bought the shoes before the sale ended.", pt: "Ela tinha comprado os sapatos antes da liquidação acabar." },
                      { en: "They had never seen that style before.", pt: "Eles nunca tinham visto aquele estilo antes." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-purple-900 rounded-lg">
                        <SpeakSentence text={item.en} className="text-purple-100 font-bold">
                          {item.en}
                        </SpeakSentence>
                        <p className="text-purple-200 text-sm mt-1">{item.pt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">
                    💡 GRAMMAR NOTES
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-purple-200">
                    <li>
                      <strong className="text-white">Present Perfect:</strong> have/has + past participle
                    </li>
                    <li>
                      <strong className="text-white">Past Perfect:</strong> had + past participle
                    </li>
                    <li>
                      <strong className="text-white">Key words:</strong> already, ever, never, before, yet
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson48")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            ← Previous Lesson (48)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson50")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (50) →
          </button>
        </div>
      </div>

      {/* ===== NOTE MODAL ===== */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
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