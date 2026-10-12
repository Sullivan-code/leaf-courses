"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, X } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'makeItYours';

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
// SUBSTITUTION EXERCISE COMPONENT (Lesson 63 model, blue color)
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
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium" />
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-blue-200 pt-1">🇧🇷 {currentPt}</p>
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
// HIGHLIGHTED PHRASE COMPONENT
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
// MAIN COMPONENT – LESSON 45: EATING OUT
// ============================================
export default function Lesson45EatingOut() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    makeItYours: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  // Main image modal state
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

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

  // Close main image modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMainImageModalOpen(false);
    };
    if (isMainImageModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isMainImageModalOpen]);

  // ============================================
  // IMAGES
  // ============================================
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/Momento%20tranquilo%20no%20parque%20com%20%C3%A1gua.png?raw=true";
  const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const foodImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ---------- VERBS (to open / to close) ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "abrir / Eu abro. / Você abre. / Ele abre.",
      options: [
        { label: "abrir", replacement: "to open.", pt: "abrir" },
        { label: "Eu abro", replacement: "I open.", pt: "Eu abro." },
        { label: "Você abre", replacement: "You open.", pt: "Você abre." },
        { label: "Ele abre", replacement: "He opens.", pt: "Ele abre." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Nós abrimos. / Eles abrem. / Vocês abrem.",
      options: [
        { label: "Nós abrimos", replacement: "We open.", pt: "Nós abrimos." },
        { label: "Eles abrem", replacement: "They open.", pt: "Eles abrem." },
        { label: "Vocês abrem", replacement: "You all open.", pt: "Vocês abrem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "It opens at seven o'clock. / A loja abre às sete horas. / Não abre / Abre.",
      options: [
        { label: "It opens at seven", replacement: "It opens at seven o'clock.", pt: "Abre às sete horas." },
        { label: "The store opens", replacement: "The store opens at seven o'clock.", pt: "A loja abre às sete horas." },
        { label: "It doesn't open", replacement: "It doesn't open.", pt: "Não abre." },
        { label: "It opens", replacement: "It opens.", pt: "Abre." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "A cafeteria abre às 8:00 da manhã. / A loja / O mercado.",
      options: [
        { label: "A cafeteria", replacement: "The coffee shop opens at 8:00 in the morning.", pt: "A cafeteria abre às 8:00 da manhã." },
        { label: "A loja", replacement: "The store opens at 8:00 in the morning.", pt: "A loja abre às 8:00 da manhã." },
        { label: "O mercado", replacement: "The market opens at 8:00 in the morning.", pt: "O mercado abre às 8:00 da manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "A que horas o banco abre? / a escola / o posto de gasolina.",
      options: [
        { label: "o banco", replacement: "What time does the bank open?", pt: "A que horas o banco abre?" },
        { label: "a escola", replacement: "What time does the school open?", pt: "A que horas a escola abre?" },
        { label: "o posto", replacement: "What time does the gas station open?", pt: "A que horas o posto de gasolina abre?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "fechar / Eu fecho. / Nós fechamos. / Eles fecham.",
      options: [
        { label: "fechar", replacement: "to close.", pt: "fechar" },
        { label: "Eu fecho", replacement: "I close.", pt: "Eu fecho." },
        { label: "Nós fechamos", replacement: "We close.", pt: "Nós fechamos." },
        { label: "Eles fecham", replacement: "They close.", pt: "Eles fecham." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ele fecha. / Ela fecha. / A farmácia fecha.",
      options: [
        { label: "Ele fecha", replacement: "He closes.", pt: "Ele fecha." },
        { label: "Ela fecha", replacement: "She closes.", pt: "Ela fecha." },
        { label: "A farmácia fecha", replacement: "The pharmacy closes.", pt: "A farmácia fecha." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "O museu não fecha cedo. / A estação / A loja.",
      options: [
        { label: "O museu", replacement: "The museum doesn't close early.", pt: "O museu não fecha cedo." },
        { label: "A estação", replacement: "The station doesn't close early.", pt: "A estação não fecha cedo." },
        { label: "A loja", replacement: "The store doesn't close early.", pt: "A loja não fecha cedo." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "A que horas o shopping fecha? / cinema / parque.",
      options: [
        { label: "o shopping", replacement: "What time does the shopping mall close?", pt: "A que horas o shopping fecha?" },
        { label: "o cinema", replacement: "What time does the movie theater close?", pt: "A que horas o cinema fecha?" },
        { label: "o parque", replacement: "What time does the park close?", pt: "A que horas o parque fecha?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Close your books. / Fechem seus livros. / Abram.",
      options: [
        { label: "Close your books", replacement: "Close your books.", pt: "Fechem seus livros." },
        { label: "Open your books", replacement: "Open your books.", pt: "Abram seus livros." }
      ],
      currentIndex: 0,
    },
    // PAST TENSE - IN THE MIDDLE
    {
      key: "verb-past-1",
      original: "⏪ PAST: O restaurante abriu às 8h ontem. / a cafeteria / a loja",
      options: [
        { label: "restaurante", replacement: "The restaurant opened at 8 a.m. yesterday.", pt: "O restaurante abriu às 8h ontem." },
        { label: "cafeteria", replacement: "The coffee shop opened at 8 a.m. yesterday.", pt: "A cafeteria abriu às 8h ontem." },
        { label: "loja", replacement: "The store opened at 8 a.m. yesterday.", pt: "A loja abriu às 8h ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-past-2",
      original: "⏪ PAST: A cafeteria fechou mais cedo ontem à noite. / o restaurante / a loja",
      options: [
        { label: "cafeteria", replacement: "The coffee shop closed earlier than usual last night.", pt: "A cafeteria fechou mais cedo do que o habitual ontem à noite." },
        { label: "restaurante", replacement: "The restaurant closed earlier than usual last night.", pt: "O restaurante fechou mais cedo do que o habitual ontem à noite." },
        { label: "loja", replacement: "The store closed earlier than usual last night.", pt: "A loja fechou mais cedo do que o habitual ontem à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-past-3",
      original: "⏪ PAST QUESTION: O supermercado abriu no domingo? / no sábado / no feriado",
      options: [
        { label: "domingo", replacement: "Did the supermarket open on Sunday?", pt: "O supermercado abriu no domingo?" },
        { label: "sábado", replacement: "Did the supermarket open on Saturday?", pt: "O supermercado abriu no sábado?" },
        { label: "feriado", replacement: "Did the supermarket open on the holiday?", pt: "O supermercado abriu no feriado?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-past-4",
      original: "⏪ PAST NEGATIVE: Eles não abriram a loja porque era feriado. / o restaurante / o mercado",
      options: [
        { label: "loja", replacement: "They didn't open the store because it was a holiday.", pt: "Eles não abriram a loja porque era feriado." },
        { label: "restaurante", replacement: "They didn't open the restaurant because it was a holiday.", pt: "Eles não abriram o restaurante porque era feriado." },
        { label: "mercado", replacement: "They didn't open the market because it was a holiday.", pt: "Eles não abriram o mercado porque era feriado." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS (Utensils & Food) ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Você quer um copo de água? / refrigerante / suco.",
      options: [
        { label: "água", replacement: "Do you want a glass of water?", pt: "Você quer um copo de água?" },
        { label: "refrigerante", replacement: "Do you want a glass of soda?", pt: "Você quer um copo de refrigerante?" },
        { label: "suco", replacement: "Do you want a glass of juice?", pt: "Você quer um copo de suco?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu quero uma garrafa de refrigerante, por favor. / de água / de suco.",
      options: [
        { label: "refrigerante", replacement: "I want a bottle of soda, please.", pt: "Eu quero uma garrafa de refrigerante, por favor." },
        { label: "água", replacement: "I want a bottle of water, please.", pt: "Eu quero uma garrafa de água, por favor." },
        { label: "suco", replacement: "I want a bottle of juice, please.", pt: "Eu quero uma garrafa de suco, por favor." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Nós preferimos comprar uma lata de refrigerante. / um copo / uma garrafa.",
      options: [
        { label: "uma lata", replacement: "We prefer to buy a can of soda.", pt: "Nós preferimos comprar uma lata de refrigerante." },
        { label: "um copo", replacement: "We prefer to buy a glass of soda.", pt: "Nós preferimos comprar um copo de refrigerante." },
        { label: "uma garrafa", replacement: "We prefer to buy a bottle of soda.", pt: "Nós preferimos comprar uma garrafa de refrigerante." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Ele precisa de uma faca. / de um garfo / de uma colher.",
      options: [
        { label: "uma faca", replacement: "He needs a knife.", pt: "Ele precisa de uma faca." },
        { label: "um garfo", replacement: "He needs a fork.", pt: "Ele precisa de um garfo." },
        { label: "uma colher", replacement: "He needs a spoon.", pt: "Ele precisa de uma colher." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Com licença, você tem uma colher? / um guardanapo / um canudo.",
      options: [
        { label: "uma colher", replacement: "Excuse me, do you have a spoon?", pt: "Com licença, você tem uma colher?" },
        { label: "um guardanapo", replacement: "Excuse me, do you have a napkin?", pt: "Com licença, você tem um guardanapo?" },
        { label: "um canudo", replacement: "Excuse me, do you have a straw?", pt: "Com licença, você tem um canudo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você precisa de algum guardanapo? / canudo / garfo.",
      options: [
        { label: "guardanapo", replacement: "Do you need a napkin?", pt: "Você precisa de algum guardanapo?" },
        { label: "canudo", replacement: "Do you need a straw?", pt: "Você precisa de algum canudo?" },
        { label: "garfo", replacement: "Do you need a fork?", pt: "Você precisa de algum garfo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "I love to have ice cream. / sopa / milk-shake.",
      options: [
        { label: "ice cream", replacement: "I love to have ice cream.", pt: "Eu adoro tomar sorvete." },
        { label: "soup", replacement: "I love to have soup.", pt: "Eu adoro tomar sopa." },
        { label: "milkshake", replacement: "I love to have a milkshake.", pt: "Eu adoro tomar milk-shake." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I want to have a snack. / Ele quer / Nós queremos.",
      options: [
        { label: "Eu quero", replacement: "I want to have a snack.", pt: "Eu quero fazer um lanche." },
        { label: "Ele quer", replacement: "He wants to have a snack.", pt: "Ele quer fazer um lanche." },
        { label: "Nós queremos", replacement: "We want to have a snack.", pt: "Nós queremos fazer um lanche." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Este prato está delicioso. / sobremesa / lanche.",
      options: [
        { label: "prato", replacement: "This dish is delicious.", pt: "Este prato está delicioso." },
        { label: "sobremesa", replacement: "This dessert is delicious.", pt: "Esta sobremesa está deliciosa." },
        { label: "lanche", replacement: "This snack is delicious.", pt: "Este lanche está delicioso." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Aquela é nossa lanchonete favorita. / sorveteria / cafeteria.",
      options: [
        { label: "lanchonete", replacement: "That is our favorite snack bar.", pt: "Aquela é nossa lanchonete favorita." },
        { label: "sorveteria", replacement: "That is our favorite ice cream parlor.", pt: "Aquela é nossa sorveteria favorita." },
        { label: "cafeteria", replacement: "That is our favorite coffee shop.", pt: "Aquela é nossa cafeteria favorita." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eles querem ir a um restaurante diferente. / hoje / amanhã.",
      options: [
        { label: "diferente", replacement: "They want to go to a different restaurant.", pt: "Eles querem ir a um restaurante diferente." },
        { label: "hoje", replacement: "They want to go to a restaurant today.", pt: "Eles querem ir a um restaurante hoje." },
        { label: "amanhã", replacement: "They want to go to a restaurant tomorrow.", pt: "Eles querem ir a um restaurante amanhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu quero encontrar meus amigos na lanchonete. / sorveteria / cafeteria.",
      options: [
        { label: "lanchonete", replacement: "I want to meet my friends at the snack bar.", pt: "Eu quero encontrar meus amigos na lanchonete." },
        { label: "sorveteria", replacement: "I want to meet my friends at the ice cream parlor.", pt: "Eu quero encontrar meus amigos na sorveteria." },
        { label: "cafeteria", replacement: "I want to meet my friends at the coffee shop.", pt: "Eu quero encontrar meus amigos na cafeteria." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Open this bottle for me, please. / lata / Feche.",
      options: [
        { label: "garrafa", replacement: "Open this bottle for me, please.", pt: "Abra esta garrafa para mim, por favor." },
        { label: "lata", replacement: "Open this can for me, please.", pt: "Abra esta lata para mim, por favor." },
        { label: "Feche", replacement: "Close this bottle for me, please.", pt: "Feche esta garrafa para mim, por favor." }
      ],
      currentIndex: 0,
    },
    // PAST TENSE - IN THE MIDDLE
    {
      key: "vocab-past-1",
      original: "⏪ PAST: Nós abrimos uma garrafa de água antes do almoço. / vinho / suco",
      options: [
        { label: "água", replacement: "We opened a bottle of water before lunch.", pt: "Nós abrimos uma garrafa de água antes do almoço." },
        { label: "vinho", replacement: "We opened a bottle of wine before lunch.", pt: "Nós abrimos uma garrafa de vinho antes do almoço." },
        { label: "suco", replacement: "We opened a bottle of juice before lunch.", pt: "Nós abrimos uma garrafa de suco antes do almoço." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-past-2",
      original: "⏪ PAST: O garçom abriu a garrafa e serviu as bebidas. / lata / vinho",
      options: [
        { label: "garrafa", replacement: "The waiter opened the bottle and served the drinks.", pt: "O garçom abriu a garrafa e serviu as bebidas." },
        { label: "lata", replacement: "The waiter opened the can and served the drinks.", pt: "O garçom abriu a lata e serviu as bebidas." },
        { label: "vinho", replacement: "The waiter opened the wine and served the drinks.", pt: "O garçom abriu o vinho e serviu as bebidas." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-past-3",
      original: "⏪ PAST: Ela pediu um milk-shake ontem. / uma sopa / um lanche",
      options: [
        { label: "milk-shake", replacement: "She ordered a milkshake yesterday.", pt: "Ela pediu um milk-shake ontem." },
        { label: "sopa", replacement: "She ordered a soup yesterday.", pt: "Ela pediu uma sopa ontem." },
        { label: "lanche", replacement: "She ordered a snack yesterday.", pt: "Ela pediu um lanche ontem." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eles saem juntos aos finais de semana. / Nós / Meus amigos.",
      options: [
        { label: "Eles", replacement: "They go out together on weekends.", pt: "Eles saem juntos aos finais de semana." },
        { label: "Nós", replacement: "We go out together on weekends.", pt: "Nós saímos juntos aos finais de semana." },
        { label: "Meus amigos", replacement: "My friends go out together on weekends.", pt: "Meus amigos saem juntos aos finais de semana." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Você prefere sair ou ficar em casa? / Ela / Ele.",
      options: [
        { label: "Você", replacement: "Do you prefer to go out or stay at home?", pt: "Você prefere sair ou ficar em casa?" },
        { label: "Ela", replacement: "Does she prefer to go out or stay at home?", pt: "Ela prefere sair ou ficar em casa?" },
        { label: "Ele", replacement: "Does he prefer to go out or stay at home?", pt: "Ele prefere sair ou ficar em casa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eles comem comida rápida dia sim, dia não. / essa / salada.",
      options: [
        { label: "comida rápida", replacement: "They eat fast food every other day.", pt: "Eles comem comida rápida dia sim, dia não." },
        { label: "essa comida", replacement: "They eat this food every other day.", pt: "Eles comem essa comida dia sim, dia não." },
        { label: "salada", replacement: "They eat salad every other day.", pt: "Eles comem salada dia sim, dia não." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu estudo inglês dia sim, dia não. / faço exercícios / Eu estudo inglês",
      options: [
        { label: "estudo inglês", replacement: "I study English every other day.", pt: "Eu estudo inglês dia sim, dia não." },
        { label: "faço exercícios", replacement: "I do exercises every other day.", pt: "Eu faço exercícios dia sim, dia não." },
        { label: "estudo", replacement: "I study every other day.", pt: "Eu estudo dia sim, dia não." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "O que você quer pedir? / Eles querem / ela quer.",
      options: [
        { label: "você", replacement: "What do you want to order?", pt: "O que você quer pedir?" },
        { label: "Eles", replacement: "What do they want to order?", pt: "O que eles querem pedir?" },
        { label: "ela", replacement: "What does she want to order?", pt: "O que ela quer pedir?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Ela quer pedir um hambúrguer. / um milk-shake / um refrigerante.",
      options: [
        { label: "hambúrguer", replacement: "She wants to order a hamburger.", pt: "Ela quer pedir um hambúrguer." },
        { label: "milk-shake", replacement: "She wants to order a milkshake.", pt: "Ela quer pedir um milk-shake." },
        { label: "refrigerante", replacement: "She wants to order a soda.", pt: "Ela quer pedir um refrigerante." }
      ],
      currentIndex: 0,
    },
    // PAST TENSE - IN THE MIDDLE
    {
      key: "phrase-past-1",
      original: "⏪ PAST: Nós pedimos pizza ontem à noite. / hambúrguer / sobremesa",
      options: [
        { label: "pizza", replacement: "We ordered pizza last night.", pt: "Nós pedimos pizza ontem à noite." },
        { label: "hambúrguer", replacement: "We ordered a hamburger last night.", pt: "Nós pedimos um hambúrguer ontem à noite." },
        { label: "sobremesa", replacement: "We ordered dessert last night.", pt: "Nós pedimos sobremesa ontem à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-past-2",
      original: "⏪ PAST QUESTION: Você saiu ontem? / no fim de semana / na sexta",
      options: [
        { label: "ontem", replacement: "Did you go out yesterday?", pt: "Você saiu ontem?" },
        { label: "fim de semana", replacement: "Did you go out on the weekend?", pt: "Você saiu no fim de semana?" },
        { label: "sexta", replacement: "Did you go out on Friday?", pt: "Você saiu na sexta?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-past-3",
      original: "⏪ PAST: Eles comeram em um restaurante diferente ontem. / nós / meus amigos",
      options: [
        { label: "Eles", replacement: "They ate at a different restaurant yesterday.", pt: "Eles comeram em um restaurante diferente ontem." },
        { label: "Nós", replacement: "We ate at a different restaurant yesterday.", pt: "Nós comemos em um restaurante diferente ontem." },
        { label: "Meus amigos", replacement: "My friends ate at a different restaurant yesterday.", pt: "Meus amigos comeram em um restaurante diferente ontem." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR (Something / Anything) ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu preciso comer alguma coisa agora. / beber / Ele precisa.",
      options: [
        { label: "comer", replacement: "I need to eat something now.", pt: "Eu preciso comer alguma coisa agora." },
        { label: "beber", replacement: "I need to drink something now.", pt: "Eu preciso beber alguma coisa agora." },
        { label: "Ele precisa", replacement: "He needs to eat something now.", pt: "Ele precisa comer alguma coisa agora." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Nós precisamos de alguma coisa para abrir a lata. / Eles precisam / Eu preciso.",
      options: [
        { label: "Nós", replacement: "We need something to open the can.", pt: "Nós precisamos de alguma coisa para abrir a lata." },
        { label: "Eles", replacement: "They need something to open the can.", pt: "Eles precisam de alguma coisa para abrir a lata." },
        { label: "Eu", replacement: "I need something to open the can.", pt: "Eu preciso de alguma coisa para abrir a lata." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu quero dar alguma coisa para minha mãe. / irmã / tia.",
      options: [
        { label: "mãe", replacement: "I want to give something to my mother.", pt: "Eu quero dar alguma coisa para minha mãe." },
        { label: "irmã", replacement: "I want to give something to my sister.", pt: "Eu quero dar alguma coisa para minha irmã." },
        { label: "tia", replacement: "I want to give something to my aunt.", pt: "Eu quero dar alguma coisa para minha tia." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Do you want anything? / Eles / Ela.",
      options: [
        { label: "Você", replacement: "Do you want anything?", pt: "Você quer alguma coisa?" },
        { label: "Eles", replacement: "Do they want anything?", pt: "Eles querem alguma coisa?" },
        { label: "Ela", replacement: "Does she want anything?", pt: "Ela quer alguma coisa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Você quer comprar alguma coisa? / levar / ver.",
      options: [
        { label: "comprar", replacement: "Do you want to buy anything?", pt: "Você quer comprar alguma coisa?" },
        { label: "levar", replacement: "Do you want to take anything?", pt: "Você quer levar alguma coisa?" },
        { label: "ver", replacement: "Do you want to see anything?", pt: "Você quer ver alguma coisa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Você tem que estudar alguma coisa hoje? / ler / escrever.",
      options: [
        { label: "estudar", replacement: "Do you have to study anything today?", pt: "Você tem que estudar alguma coisa hoje?" },
        { label: "ler", replacement: "Do you have to read anything today?", pt: "Você tem que ler alguma coisa hoje?" },
        { label: "escrever", replacement: "Do you have to write anything today?", pt: "Você tem que escrever alguma coisa hoje?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "They don't want anything. / Eu / Ele.",
      options: [
        { label: "They", replacement: "They don't want anything.", pt: "Eles não querem nada." },
        { label: "Eu", replacement: "I don't want anything.", pt: "Eu não quero nada." },
        { label: "Ele", replacement: "He doesn't want anything.", pt: "Ele não quer nada." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Eu não quero nada para beber. / Ela não quer / Nós não queremos.",
      options: [
        { label: "Eu", replacement: "I don't want anything to drink.", pt: "Eu não quero nada para beber." },
        { label: "Ela", replacement: "She doesn't want anything to drink.", pt: "Ela não quer nada para beber." },
        { label: "Nós", replacement: "We don't want anything to drink.", pt: "Nós não queremos nada para beber." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Ele não quer pedir nada. / Ela / Eles.",
      options: [
        { label: "Ele", replacement: "He doesn't want to order anything.", pt: "Ele não quer pedir nada." },
        { label: "Ela", replacement: "She doesn't want to order anything.", pt: "Ela não quer pedir nada." },
        { label: "Eles", replacement: "They don't want to order anything.", pt: "Eles não querem pedir nada." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu não tenho nada diferente aqui. / antigo / novo / bom.",
      options: [
        { label: "diferente", replacement: "I don't have anything different here.", pt: "Eu não tenho nada diferente aqui." },
        { label: "antigo", replacement: "I don't have anything old here.", pt: "Eu não tenho nada antigo aqui." },
        { label: "novo", replacement: "I don't have anything new here.", pt: "Eu não tenho nada novo aqui." },
        { label: "bom", replacement: "I don't have anything good here.", pt: "Eu não tenho nada bom aqui." }
      ],
      currentIndex: 0,
    },
    // PAST TENSE - IN THE MIDDLE
    {
      key: "grammar-past-1",
      original: "⏪ PAST QUESTION: Você comprou alguma coisa na loja? / no mercado / no shopping",
      options: [
        { label: "loja", replacement: "Did you buy anything at the store?", pt: "Você comprou alguma coisa na loja?" },
        { label: "mercado", replacement: "Did you buy anything at the market?", pt: "Você comprou alguma coisa no mercado?" },
        { label: "shopping", replacement: "Did you buy anything at the shopping mall?", pt: "Você comprou alguma coisa no shopping?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-past-2",
      original: "⏪ PAST NEGATIVE: Ela não comeu nada no almoço. / Eu / Nós",
      options: [
        { label: "Ela", replacement: "She didn't eat anything at lunch.", pt: "Ela não comeu nada no almoço." },
        { label: "Eu", replacement: "I didn't eat anything at lunch.", pt: "Eu não comi nada no almoço." },
        { label: "Nós", replacement: "We didn't eat anything at lunch.", pt: "Nós não comemos nada no almoço." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-past-3",
      original: "⏪ PAST: Eu abri o cardápio, mas não encontrei nada que quisesse pedir. / o menu / a carta",
      options: [
        { label: "cardápio", replacement: "I opened the menu, but I didn't find anything I wanted to order.", pt: "Eu abri o cardápio, mas não encontrei nada que quisesse pedir." },
        { label: "o menu", replacement: "I opened the menu, but I didn't find anything I wanted to order.", pt: "Eu abri o menu, mas não encontrei nada que quisesse pedir." },
        { label: "a carta", replacement: "I opened the wine list, but I didn't find anything I wanted to order.", pt: "Eu abri a carta de vinhos, mas não encontrei nada que quisesse pedir." }
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
      en: "What time does it open?",
      pt: "A que horas abre?",
      green: ["time", "open"]
    },
    {
      en: "It doesn't open on Sundays.",
      pt: "Não abre aos domingos.",
      green: ["open", "Sundays"]
    },
    {
      en: "I want to go out tonight.",
      pt: "Eu quero sair hoje à noite.",
      green: ["go out", "tonight"]
    },
    {
      en: "Do you want anything to eat?",
      pt: "Você quer alguma coisa para comer?",
      green: ["want", "eat"]
    }
  ];

  // ---------- MAKE IT YOURS! (HARDER, LONGER, PAST + FUTURE + QUESTIONS + NEGATIVES) ----------
  const makeItYoursData = [
    {
      en: "Last weekend, my family and I opened a bottle of wine at our favorite restaurant downtown.",
      pt: "No último fim de semana, minha família e eu abrimos uma garrafa de vinho no nosso restaurante favorito no centro.",
      parts: [
        { text: "Last weekend, my family and I ", highlight: false },
        { text: "opened", highlight: true },
        { text: " a ", highlight: false },
        { text: "bottle of wine", highlight: true },
        { text: " at our favorite ", highlight: false },
        { text: "restaurant", highlight: true },
        { text: " downtown.", highlight: false },
      ]
    },
    {
      en: "Did the coffee shop close earlier than usual last night because it was a holiday?",
      pt: "A cafeteria fechou mais cedo do que o habitual ontem à noite porque era feriado?",
      parts: [
        { text: "Did the ", highlight: false },
        { text: "coffee shop", highlight: true },
        { text: " ", highlight: false },
        { text: "close", highlight: true },
        { text: " earlier than usual last night because it was a holiday?", highlight: false },
      ]
    },
    {
      en: "We didn't want to order anything different because we already knew the menu very well.",
      pt: "Nós não queríamos pedir nada diferente porque já conhecíamos muito bem o cardápio.",
      parts: [
        { text: "We ", highlight: false },
        { text: "didn't want", highlight: true },
        { text: " to ", highlight: false },
        { text: "order", highlight: true },
        { text: " ", highlight: false },
        { text: "anything different", highlight: true },
        { text: " because we already knew the menu very well.", highlight: false },
      ]
    },
    {
      en: "Next Saturday, I will open a bottle of champagne to celebrate my birthday at a new Italian restaurant.",
      pt: "No próximo sábado, eu abrirei uma garrafa de champanhe para celebrar meu aniversário em um novo restaurante italiano.",
      parts: [
        { text: "Next Saturday, I ", highlight: false },
        { text: "will open", highlight: true },
        { text: " a ", highlight: false },
        { text: "bottle of champagne", highlight: true },
        { text: " to celebrate my birthday at a new Italian restaurant.", highlight: false },
      ]
    },
    {
      en: "The waiter opened the bottle, but he forgot to bring us the glasses for the soda.",
      pt: "O garçom abriu a garrafa, mas ele esqueceu de nos trazer os copos para o refrigerante.",
      parts: [
        { text: "The waiter ", highlight: false },
        { text: "opened", highlight: true },
        { text: " the ", highlight: false },
        { text: "bottle", highlight: true },
        { text: ", but he ", highlight: false },
        { text: "forgot", highlight: true },
        { text: " to bring us the glasses for the soda.", highlight: false },
      ]
    },
    {
      en: "By the time we arrived at the snack bar, it had already closed for the night.",
      pt: "Quando nós chegamos à lanchonete, ela já tinha fechado para a noite.",
      parts: [
        { text: "By the time we ", highlight: false },
        { text: "arrived", highlight: true },
        { text: " at the ", highlight: false },
        { text: "snack bar", highlight: true },
        { text: ", it ", highlight: false },
        { text: "had already closed", highlight: true },
        { text: " for the night.", highlight: false },
      ]
    },
    {
      en: "I don't have anything to eat at home, so I will order a large pizza with my friends tonight.",
      pt: "Eu não tenho nada para comer em casa, então eu vou pedir uma pizza grande com meus amigos hoje à noite.",
      parts: [
        { text: "I don't have ", highlight: false },
        { text: "anything to eat", highlight: true },
        { text: " at home, so I ", highlight: false },
        { text: "will order", highlight: true },
        { text: " a large ", highlight: false },
        { text: "pizza", highlight: true },
        { text: " with my friends tonight.", highlight: false },
      ]
    },
    {
      en: "Would you like something to drink while you wait for your delicious meal to arrive?",
      pt: "Você gostaria de algo para beber enquanto espera a sua refeição deliciosa chegar?",
      parts: [
        { text: "Would you like ", highlight: false },
        { text: "something to drink", highlight: true },
        { text: " while you ", highlight: false },
        { text: "wait", highlight: true },
        { text: " for your delicious ", highlight: false },
        { text: "meal", highlight: true },
        { text: " to arrive?", highlight: false },
      ]
    },
    {
      en: "She has never tried anything so delicious in her life, so she ordered two desserts.",
      pt: "Ela nunca experimentou nada tão delicioso na vida dela, então ela pediu duas sobremesas.",
      parts: [
        { text: "She ", highlight: false },
        { text: "has never tried", highlight: true },
        { text: " ", highlight: false },
        { text: "anything so delicious", highlight: true },
        { text: " in her life, so she ", highlight: false },
        { text: "ordered", highlight: true },
        { text: " two ", highlight: false },
        { text: "desserts", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "If I had known that the coffee shop closed early, I would have arrived much sooner.",
      pt: "Se eu soubesse que a cafeteria fechava cedo, eu teria chegado muito mais cedo.",
      parts: [
        { text: "If I ", highlight: false },
        { text: "had known", highlight: true },
        { text: " that the ", highlight: false },
        { text: "coffee shop", highlight: true },
        { text: " ", highlight: false },
        { text: "closed early", highlight: true },
        { text: ", I ", highlight: false },
        { text: "would have arrived", highlight: true },
        { text: " much sooner.", highlight: false },
      ]
    },
    {
      en: "Will you open a bottle of soda for me, or should I ask the waiter for a can instead?",
      pt: "Você vai abrir uma garrafa de refrigerante para mim, ou eu deveria pedir uma lata ao garçom?",
      parts: [
        { text: "Will you ", highlight: false },
        { text: "open", highlight: true },
        { text: " a ", highlight: false },
        { text: "bottle of soda", highlight: true },
        { text: " for me, or should I ask the waiter for a ", highlight: false },
        { text: "can", highlight: true },
        { text: " instead?", highlight: false },
      ]
    },
    {
      en: "We will meet our friends at the snack bar tomorrow, and we will share a large pizza together.",
      pt: "Nós encontraremos nossos amigos na lanchonete amanhã, e nós dividiremos uma pizza grande juntos.",
      parts: [
        { text: "We ", highlight: false },
        { text: "will meet", highlight: true },
        { text: " our friends at the ", highlight: false },
        { text: "snack bar", highlight: true },
        { text: " tomorrow, and we ", highlight: false },
        { text: "will share", highlight: true },
        { text: " a large ", highlight: false },
        { text: "pizza", highlight: true },
        { text: " together.", highlight: false },
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

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 45 – EATING OUT</h1>
          <SpeakSentence text="Learn to talk about opening and closing times, table utensils, and use something and anything in English." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍽️ Learn to talk about opening and closing times, table utensils, and use "something" and "anything" in English.
          </SpeakSentence>
          {/* MAIN IMAGE WITH CLICK TO ENLARGE */}
          <div className="w-64 h-64 mx-auto">
            <button
              onClick={() => setIsMainImageModalOpen(true)}
              className="group relative w-full h-full focus:outline-none"
              aria-label="Abrir imagem em tela cheia"
              title="Clique para ampliar"
            >
              <img
                src={mainImage}
                alt="Momento tranquilo no parque com água"
                className="w-full h-full object-cover rounded-2xl shadow-md transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl cursor-zoom-in"
              />
              <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">🔍</span> Ampliar
              </span>
            </button>
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
              <li><SpeakText text="to open" className="text-blue-600 font-bold">to open</SpeakText> = abrir</li>
              <li><SpeakText text="to close" className="text-blue-600 font-bold">to close</SpeakText> = fechar</li>
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
              {[
                { en: "a glass", pt: "um copo" },
                { en: "a bottle", pt: "uma garrafa" },
                { en: "a can", pt: "uma lata" },
                { en: "a knife", pt: "uma faca" },
                { en: "a fork", pt: "um garfo" },
                { en: "a spoon", pt: "uma colher" },
                { en: "a napkin", pt: "um guardanapo" },
                { en: "a straw", pt: "um canudo" },
                { en: "a snack", pt: "um lanche" },
                { en: "a milkshake", pt: "um milk-shake" },
                { en: "delicious", pt: "delicioso" },
                { en: "different", pt: "diferente" },
                { en: "snack bar", pt: "lanchonete" },
                { en: "ice cream parlor", pt: "sorveteria" },
                { en: "coffee shop", pt: "cafeteria" },
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
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for eating out and going out" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for eating out and going out
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Something / Anything)</h2>
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
            <SpeakSentence text="Something is used in affirmative sentences. Anything is used in negative sentences and questions." className="text-md text-gray-600 mb-4 italic">
              📚 Something = affirmative sentences; Anything = negative sentences and questions
            </SpeakSentence>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                <h4 className="text-lg font-bold text-blue-700 mb-2">✅ SOMETHING (algo / alguma coisa)</h4>
                <div className="p-3 bg-white rounded-lg">
                  <SpeakSentence text="I need something to eat." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    I need something to eat.
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">Eu preciso de algo para comer.</div>
                </div>
                <div className="p-3 bg-white rounded-lg mt-2">
                  <SpeakSentence text="She wants something to drink." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    She wants something to drink.
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">Ela quer alguma coisa para beber.</div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                <h4 className="text-lg font-bold text-purple-700 mb-2">❌ ANYTHING (nada / alguma coisa)</h4>
                <div className="p-3 bg-white rounded-lg">
                  <SpeakSentence text="I don't want anything to drink." className="text-purple-600 font-bold cursor-pointer text-left w-full block">
                    I don't want anything to drink.
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">Eu não quero nada para beber.</div>
                </div>
                <div className="p-3 bg-white rounded-lg mt-2">
                  <SpeakSentence text="Do you want anything to eat?" className="text-purple-600 font-bold cursor-pointer text-left w-full block">
                    Do you want anything to eat?
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">Você quer alguma coisa para comer?</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
              <p className="text-center text-yellow-800 text-sm">
                💡 <b>DICA:</b> Em frases negativas, <b>anything</b> significa <b>"nada"</b>. Em perguntas, significa <b>"alguma coisa"</b>.
              </p>
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
              <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-blue-100">B1–B2 · Past · Present · Future</div>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <p className="text-sm text-blue-800 italic mb-4">
                ✍️ Replace the words in <span className="text-blue-600 font-bold">blue</span> with your own ideas.
                Notice how the sentences mix the <b>past</b>, <b>present</b>, and <b>future</b>, and include <b>questions</b> and <b>negatives</b>.
              </p>
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
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">🇧🇷 {s.pt}</p>
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

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
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
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "What time does it open?", pt: "A que horas abre?" },
                { en: "It opens at 7 a.m.", pt: "Abre às 7 da manhã." },
                { en: "It doesn't open on Sundays.", pt: "Não abre aos domingos." },
                { en: "I need something to eat.", pt: "Eu preciso de algo para comer." },
                { en: "I don't want anything to drink.", pt: "Eu não quero nada para beber." },
                { en: "Do you want anything?", pt: "Você quer alguma coisa?" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 flex-1 p-6 flex flex-col items-center justify-center gap-3">
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <SpeakSentence text="Open this bottle for me, please." className="text-blue-700 font-bold">
                  Open this bottle for me, please.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Abra esta garrafa para mim, por favor.</p>
              </div>
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <SpeakSentence text="The restaurant opened at 8 a.m. yesterday." className="text-blue-700 font-bold">
                  The restaurant opened at 8 a.m. yesterday.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">O restaurante abriu às 8h ontem.</p>
              </div>
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
                <SpeakSentence text="She will order something delicious tonight." className="text-blue-700 font-bold">
                  She will order something delicious tonight.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Ela pedirá algo delicioso hoje à noite.</p>
              </div>
            </div>

            <div className="bg-blue-800 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• to <span className="font-bold text-yellow-300">open</span> / to <span className="font-bold text-yellow-300">close</span></p>
                </div>
                <SpeakText text="to open, to close" className="text-blue-200">🔊</SpeakText>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• <span className="font-bold text-yellow-300">opened</span> / <span className="font-bold text-yellow-300">closed</span></p>
                </div>
                <SpeakText text="opened, closed" className="text-blue-200">🔊</SpeakText>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• a <span className="font-bold text-yellow-300">bottle</span> of water</p>
                </div>
                <SpeakText text="a bottle of water" className="text-blue-200">🔊</SpeakText>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• a <span className="font-bold text-yellow-300">can</span> of soda</p>
                </div>
                <SpeakText text="a can of soda" className="text-blue-200">🔊</SpeakText>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• <span className="font-bold text-yellow-300">something</span> / <span className="font-bold text-yellow-300">anything</span></p>
                </div>
                <SpeakText text="something, anything" className="text-blue-200">🔊</SpeakText>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300">• a <span className="font-bold text-yellow-300">napkin</span> / a <span className="font-bold text-yellow-300">straw</span></p>
                </div>
                <SpeakText text="a napkin, a straw" className="text-blue-200">🔊</SpeakText>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson44")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800"
          >
            &larr; Previous Lesson (44)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson46")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
          >
            Next Lesson (46) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <button
            onClick={() => setIsMainImageModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black/90 rounded-full p-3 transition z-10"
            aria-label="Fechar imagem"
            title="Fechar (Esc)"
          >
            <X size={24} />
          </button>
          <img
            src={mainImage}
            alt="Momento tranquilo no parque com água - ampliada"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
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