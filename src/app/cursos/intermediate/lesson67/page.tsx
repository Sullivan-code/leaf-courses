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
  if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
  else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  const speak = () => speakEnglish(text, 0.9);

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-green-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />}
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
      className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left w-full ${className}`}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-green-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
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
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-green-700 font-medium" />
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-green-200 pt-1">🇧🇷 {currentPt}</p>
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
                ? 'bg-green-500 text-white'
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM AZUL
// ============================================
function HighlightedPhrase({ text, blueWords, translation }: { text: string; blueWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    if (blueWords.some(bw => cleanWord === bw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
      <div className="mb-1">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800 leading-snug">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600 ml-1">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 67
// ============================================
export default function Lesson67MyStory() {
  const router = useRouter();
  
  // Inicializa os drills recolhidos
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

  // IMAGENS DA LIÇÃO
  const mainImage = "https://images.pexels.com/photos/7147017/pexels-photo-7147017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const readingImage = "https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/8386403/pexels-photo-8386403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/6980691/pexels-photo-6980691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://images.pexels.com/photos/5905888/pexels-photo-5905888.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "was bored yesterday / you / we",
      options: [
        { label: "I", replacement: "I was bored yesterday.", pt: "Eu estava entediado ontem." },
        { label: "You", replacement: "You were bored yesterday.", pt: "Você estava entediado ontem." },
        { label: "We", replacement: "We were bored yesterday.", pt: "Nós estávamos entediados ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "They were excited about this idea / movie / series",
      options: [
        { label: "idea", replacement: "They were excited about this idea.", pt: "Eles estavam animados com essa ideia." },
        { label: "movie", replacement: "They were excited about this movie.", pt: "Eles estavam animados com esse filme." },
        { label: "series", replacement: "They were excited about this series.", pt: "Eles estavam animados com essa série." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Ela estava decepcionada com ele / happy / sad",
      options: [
        { label: "decepcionada", replacement: "She was disappointed with him.", pt: "Ela estava decepcionada com ele." },
        { label: "feliz", replacement: "She was happy with him.", pt: "Ela estava feliz com ele." },
        { label: "triste", replacement: "She was sad with him.", pt: "Ela estava triste com ele." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "A reunião foi constrangedora / article / report",
      options: [
        { label: "reunião", replacement: "The meeting was awkward.", pt: "A reunião foi constrangedora." },
        { label: "artigo", replacement: "The article was awkward.", pt: "O artigo foi constrangedor." },
        { label: "relatório", replacement: "The report was awkward.", pt: "O relatório foi constrangedor." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "O dentista foi muito cuidadoso / engineer / artist",
      options: [
        { label: "dentista", replacement: "The dentist was very careful.", pt: "O dentista foi muito cuidadoso." },
        { label: "engenheiro", replacement: "The engineer was very careful.", pt: "O engenheiro foi muito cuidadoso." },
        { label: "artista", replacement: "The artist was very careful.", pt: "O artista foi muito cuidadoso." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Estes chalés eram ótimos / two-story houses / townhouses",
      options: [
        { label: "chalés", replacement: "These cottages were great.", pt: "Estes chalés eram ótimos." },
        { label: "sobrados", replacement: "These two-story houses were great.", pt: "Estes sobrados eram ótimos." },
        { label: "casas", replacement: "These townhouses were great.", pt: "Estas casas eram ótimas." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "She was embarrassed to talk about sports / politics / religion",
      options: [
        { label: "sports", replacement: "She was embarrassed to talk about sports.", pt: "Ela estava com vergonha de falar sobre esportes." },
        { label: "politics", replacement: "She was embarrassed to talk about politics.", pt: "Ela estava com vergonha de falar sobre política." },
        { label: "religion", replacement: "She was embarrassed to talk about religion.", pt: "Ela estava com vergonha de falar sobre religião." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eles estavam frustrados com as férias de inverno / summer / fall",
      options: [
        { label: "inverno", replacement: "They were frustrated with the winter vacation.", pt: "Eles estavam frustrados com as férias de inverno." },
        { label: "verão", replacement: "They were frustrated with the summer vacation.", pt: "Eles estavam frustrados com as férias de verão." },
        { label: "outono", replacement: "They were frustrated with the fall vacation.", pt: "Eles estavam frustrados com as férias de outono." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "They were at school two days ago / yesterday / last week",
      options: [
        { label: "two days ago", replacement: "They were at school two days ago.", pt: "Eles estavam na escola dois dias atrás." },
        { label: "yesterday", replacement: "They were at school yesterday.", pt: "Eles estavam na escola ontem." },
        { label: "last week", replacement: "They were at school last week.", pt: "Eles estavam na escola na semana passada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eu estava animado com a prova / project / trip",
      options: [
        { label: "prova", replacement: "I was excited about the exam.", pt: "Eu estava animado com a prova." },
        { label: "projeto", replacement: "I was excited about the project.", pt: "Eu estava animado com o projeto." },
        { label: "viagem", replacement: "I was excited about the trip.", pt: "Eu estava animado com a viagem." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eles estavam entediados em casa / excited / embarrassed",
      options: [
        { label: "entediados", replacement: "They were bored at home.", pt: "Eles estavam entediados em casa." },
        { label: "animados", replacement: "They were excited at home.", pt: "Eles estavam animados em casa." },
        { label: "envergonhados", replacement: "They were embarrassed at home.", pt: "Eles estavam envergonhados em casa." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "O verão passado foi ótimo / fall / winter",
      options: [
        { label: "verão", replacement: "Last summer was great.", pt: "O verão passado foi ótimo." },
        { label: "outono", replacement: "Last fall was great.", pt: "O outono passado foi ótimo." },
        { label: "inverno", replacement: "Last winter was great.", pt: "O inverno passado foi ótimo." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "He is amazing. You can rely on him / great / careful",
      options: [
        { label: "amazing", replacement: "He is amazing. You can rely on him.", pt: "Ele é incrível. Você pode confiar nele." },
        { label: "great", replacement: "He is great. You can rely on him.", pt: "Ele é ótimo. Você pode confiar nele." },
        { label: "careful", replacement: "He is careful. You can rely on him.", pt: "Ele é cuidadoso. Você pode confiar nele." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Be careful! This street is dangerous / avenue / station",
      options: [
        { label: "street", replacement: "Be careful! This street is dangerous.", pt: "Cuidado! Esta rua é perigosa." },
        { label: "avenue", replacement: "Be careful! This avenue is dangerous.", pt: "Cuidado! Esta avenida é perigosa." },
        { label: "station", replacement: "Be careful! This station is dangerous.", pt: "Cuidado! Esta estação é perigosa." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ela estava na praia dois dias atrás / week / months",
      options: [
        { label: "dois dias", replacement: "She was at the beach two days ago.", pt: "Ela estava na praia dois dias atrás." },
        { label: "uma semana", replacement: "She was at the beach a week ago.", pt: "Ela estava na praia uma semana atrás." },
        { label: "meses", replacement: "She was at the beach months ago.", pt: "Ela estava na praia meses atrás." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eles estavam desapontados com o curso / happy / frustrated",
      options: [
        { label: "desapontados", replacement: "They were disappointed with the course.", pt: "Eles estavam desapontados com o curso." },
        { label: "felizes", replacement: "They were happy with the course.", pt: "Eles estavam felizes com o curso." },
        { label: "frustrados", replacement: "They were frustrated with the course.", pt: "Eles estavam frustrados com o curso." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Ele estava entediado, mas ela estava animada / they - we",
      options: [
        { label: "ele / ela", replacement: "He was bored, but she was excited.", pt: "Ele estava entediado, mas ela estava animada." },
        { label: "eles", replacement: "They were bored, but they were excited.", pt: "Eles estavam entediados, mas eles estavam animados." },
        { label: "nós", replacement: "We were bored, but we were excited.", pt: "Nós estávamos entediados, mas nós estávamos animados." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- GRAMMAR (Com frases adicionais no passado e misturadas) ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu estava no cinema ontem / park / museum",
      options: [
        { label: "cinema", replacement: "I was at the movies yesterday.", pt: "Eu estava no cinema ontem." },
        { label: "parque", replacement: "I was at the park yesterday.", pt: "Eu estava no parque ontem." },
        { label: "museu", replacement: "I was at the museum yesterday.", pt: "Eu estava no museu ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "I wasn't excited about my summer vacation / winter / fall",
      options: [
        { label: "summer", replacement: "I wasn't excited about my summer vacation.", pt: "Eu não estava animado com minhas férias de verão." },
        { label: "winter", replacement: "I wasn't excited about my winter vacation.", pt: "Eu não estava animado com minhas férias de inverno." },
        { label: "fall", replacement: "I wasn't excited about my fall vacation.", pt: "Eu não estava animado com minhas férias de outono." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não estava no chalé ontem à noite / apartment / two-story house",
      options: [
        { label: "chalé", replacement: "He wasn't at the cottage last night.", pt: "Ele não estava no chalé ontem à noite." },
        { label: "apartamento", replacement: "He wasn't at the apartment last night.", pt: "Ele não estava no apartamento ontem à noite." },
        { label: "sobrado", replacement: "He wasn't at the two-story house last night.", pt: "Ele não estava no sobrado ontem à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "She wasn't careful with her kids / parents / students",
      options: [
        { label: "kids", replacement: "She wasn't careful with her kids.", pt: "Ela não foi cuidadosa com as crianças." },
        { label: "parents", replacement: "She wasn't careful with her parents.", pt: "Ela não foi cuidadosa com os pais." },
        { label: "students", replacement: "She wasn't careful with her students.", pt: "Ela não foi cuidadosa com os alunos." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "It wasn't cold at the beach yesterday / last week / three days ago",
      options: [
        { label: "yesterday", replacement: "It wasn't cold at the beach yesterday.", pt: "Não estava frio na praia ontem." },
        { label: "last week", replacement: "It wasn't cold at the beach last week.", pt: "Não estava frio na praia na semana passada." },
        { label: "three days ago", replacement: "It wasn't cold at the beach three days ago.", pt: "Não estava frio na praia três dias atrás." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Minha avó era muito bonita / aunt / mother",
      options: [
        { label: "avó", replacement: "My grandmother was very beautiful.", pt: "Minha avó era muito bonita." },
        { label: "tia", replacement: "My aunt was very beautiful.", pt: "Minha tia era muito bonita." },
        { label: "mãe", replacement: "My mother was very beautiful.", pt: "Minha mãe era muito bonita." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "We weren't in Italy last January / February / July",
      options: [
        { label: "January", replacement: "We weren't in Italy last January.", pt: "Nós não estávamos na Itália em janeiro passado." },
        { label: "February", replacement: "We weren't in Italy last February.", pt: "Nós não estávamos na Itália em fevereiro passado." },
        { label: "July", replacement: "We weren't in Italy last July.", pt: "Nós não estávamos na Itália em julho passado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Vocês não estavam ocupadas no final de semana passado / tired / upset",
      options: [
        { label: "ocupadas", replacement: "You weren't busy last weekend.", pt: "Vocês não estavam ocupadas no final de semana passado." },
        { label: "cansadas", replacement: "You weren't tired last weekend.", pt: "Vocês não estavam cansadas no final de semana passado." },
        { label: "chateadas", replacement: "You weren't upset last weekend.", pt: "Vocês não estavam chateadas no final de semana passado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eles não estavam no escritório no sábado passado / last week / two days ago",
      options: [
        { label: "sábado", replacement: "They weren't at the office last Saturday.", pt: "Eles não estavam no escritório no sábado passado." },
        { label: "semana passada", replacement: "They weren't at the office last week.", pt: "Eles não estavam no escritório na semana passada." },
        { label: "dois dias atrás", replacement: "They weren't at the office two days ago.", pt: "Eles não estavam no escritório dois dias atrás." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Seu quarto estava bagunçado ontem / tidy / dirty",
      options: [
        { label: "bagunçado", replacement: "Your room was messy yesterday.", pt: "Seu quarto estava bagunçado ontem." },
        { label: "arrumado", replacement: "Your room was tidy yesterday.", pt: "Seu quarto estava arrumado ontem." },
        { label: "sujo", replacement: "Your room was dirty yesterday.", pt: "Seu quarto estava sujo ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Seu crachá não estava na gaveta / ID / driver's license",
      options: [
        { label: "crachá", replacement: "Your name tag wasn't in the drawer.", pt: "Seu crachá não estava na gaveta." },
        { label: "identidade", replacement: "Your ID wasn't in the drawer.", pt: "Sua identidade não estava na gaveta." },
        { label: "carteira", replacement: "Your driver's license wasn't in the drawer.", pt: "Sua carteira de habilitação não estava na gaveta." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Os sapatos estavam embaixo da cama / desk / armchair",
      options: [
        { label: "cama", replacement: "The shoes were under the bed.", pt: "Os sapatos estavam embaixo da cama." },
        { label: "mesa", replacement: "The shoes were under the desk.", pt: "Os sapatos estavam embaixo da mesa." },
        { label: "poltrona", replacement: "The shoes were under the armchair.", pt: "Os sapatos estavam embaixo da poltrona." }
      ],
      currentIndex: 0,
    },
    // Frases adicionais no passado e misturadas (B1)
    {
      key: "grammar-13",
      original: "I was really surprised when I saw the final price.",
      options: [
        { label: "surpreso", replacement: "I was really surprised when I saw the final price.", pt: "Eu fiquei realmente surpreso quando vi o preço final." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-14",
      original: "We were at the restaurant last night, and the food was amazing.",
      options: [
        { label: "restaurante", replacement: "We were at the restaurant last night, and the food was amazing.", pt: "Nós estávamos no restaurante ontem à noite, e a comida estava incrível." }
      ],
      currentIndex: 0,
    }
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "You can rely on me.",
      pt: "Você pode confiar em mim.",
      blue: ["rely", "me"]
    },
    {
      en: "Be careful, she is old.",
      pt: "Cuidado, ela é idosa.",
      blue: ["careful", "old"]
    },
    {
      en: "I was there last week.",
      pt: "Eu estava lá na semana passada.",
      blue: ["was", "last", "week"]
    },
    {
      en: "My parents were in Europe five days ago.",
      pt: "Meus pais estavam na Europa cinco dias atrás.",
      blue: ["parents", "were", "ago"]
    }
  ];

  // Make It Yours com frases um pouco mais longas e B1, palavras-chave em azul
  const makeItYoursData = [
    { en: "I was completely bored at home yesterday because it rained all day.", pt: "Eu estava completamente entediado em casa ontem porque choveu o dia todo.", blue: ["was", "bored", "yesterday", "rained"] },
    { en: "You were very careful with the fragile items during the move.", pt: "Você foi muito cuidadoso com os itens frágeis durante a mudança.", blue: ["were", "careful", "fragile", "move"] },
    { en: "He wasn't very excited about the new job offer in another city.", pt: "Ele não estava muito animado com a nova oferta de emprego em outra cidade.", blue: ["wasn't", "excited", "job", "offer"] },
    { en: "We were all frustrated and disappointed with the poor customer service.", pt: "Nós estávamos todos frustrados e desapontados com o péssimo atendimento ao cliente.", blue: ["were", "frustrated", "disappointed", "service"] },
    { en: "The meeting was extremely awkward because nobody knew what to say.", pt: "A reunião foi extremamente constrangedora porque ninguém sabia o que dizer.", blue: ["meeting", "was", "awkward", "nobody"] },
    { en: "They weren't at school two days ago because they were sick.", pt: "Eles não estavam na escola dois dias atrás porque estavam doentes.", blue: ["weren't", "school", "ago", "sick"] },
    { en: "She was at the beautiful beach last weekend enjoying the sun.", pt: "Ela estava na bela praia no fim de semana passado aproveitando o sol.", blue: ["was", "beach", "last", "weekend"] },
    { en: "My parents were in Europe five days ago for a business trip.", pt: "Meus pais estavam na Europa cinco dias atrás para uma viagem de negócios.", blue: ["parents", "were", "Europe", "ago"] }
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
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📖 Lesson 67 - My Story</h1>
          <SpeakSentence text="Learn how to tell your story in the past using the verb to be and descriptive adjectives." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn how to tell your story in the past using the verb to be and descriptive adjectives.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="My Story"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to be" className="text-green-600 font-bold">to be</SpeakText> = ser, estar</li>
              <li className="ml-6 mt-2"><SpeakText text="I was at home yesterday." className="text-gray-700 italic">I was at home yesterday.</SpeakText> <span className="text-sm text-gray-500">(Eu estava em casa ontem.)</span></li>
              <li className="ml-6"><SpeakText text="They were happy last week." className="text-gray-700 italic">They were happy last week.</SpeakText> <span className="text-sm text-gray-500">(Eles estavam felizes na semana passada.)</span></li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
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
                { en: "bored", pt: "entediado(a)" },
                { en: "excited", pt: "animado(a)" },
                { en: "disappointed", pt: "desapontado(a) / decepcionado(a)" },
                { en: "awkward", pt: "constrangedor(a)" },
                { en: "careful", pt: "cuidadoso(a)" },
                { en: "amazing", pt: "ótimo(a) / excelente" },
                { en: "embarrassed", pt: "envergonhado(a)" },
                { en: "frustrated", pt: "frustrado(a)" },
                { en: "summer", pt: "verão" },
                { en: "spring", pt: "primavera" },
                { en: "fall", pt: "outono" },
                { en: "winter", pt: "inverno" },
                { en: "yesterday", pt: "ontem" },
                { en: "last", pt: "último(a) / passado(a)" },
                { en: "ago", pt: "atrás" },
              ].map((word, idx) => (
                <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <SpeakText text={word.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for daily communication" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrasesData.map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  blueWords={item.blue}
                  translation={item.pt}
                />
              ))}
            </div>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Structures for telling your story in the past at a B1/B2 level" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for telling your story in the past at a B1/B2 level
            </SpeakSentence>

            <div className="mb-6">
              <img
                src={grammarImage}
                alt="Grammar illustration – My Story"
                className="w-full max-h-64 object-cover rounded-2xl shadow-md"
              />
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I was bored at home yesterday.", pt: "Eu estava entediado em casa ontem." },
                { en: "You were very careful with the fragile items.", pt: "Você foi muito cuidadoso com os itens frágeis." },
                { en: "He wasn't very excited about the new job.", pt: "Ele não estava muito animado com o novo emprego." },
                { en: "She was at the beach last weekend.", pt: "Ela estava na praia no fim de semana passado." },
                { en: "Last summer was amazing.", pt: "O verão passado foi ótimo." },
                { en: "We were all frustrated and disappointed.", pt: "Nós estávamos todos frustrados e desapontados." },
                { en: "The meeting was awkward.", pt: "A reunião foi constrangedora." },
                { en: "They weren't at school two days ago.", pt: "Eles não estavam na escola dois dias atrás." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-green-100">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <p className="text-green-800 font-bold mb-4 text-lg">
                🌟 Substitute the blue words to create your own version and practice fluency.
              </p>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-3">
                  {makeItYoursData.map((s, idx) => (
                    <HighlightedPhrase key={idx} text={`${idx+1}. ${s.en}`} blueWords={s.blue} translation={s.pt} />
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="My story" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Telling your story</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Last weekend" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Last weekend</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Memories" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Memories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-green-100 italic">
                📝 Key expressions and useful vocabulary to remember
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">AFFIRMATIVE</h3>
              {[
                { en: "I was bored yesterday.", pt: "Eu estava entediado ontem." },
                { en: "He was careful.", pt: "Ele foi cuidadoso." },
                { en: "She was disappointed.", pt: "Ela estava desapontada." },
                { en: "We were at the beach.", pt: "Nós estávamos na praia." },
                { en: "They were excited.", pt: "Eles estavam animados." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-green-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-green-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">NEGATIVE & QUESTIONS</h4>
                  <div className="space-y-3">
                    {[
                      { en: "I wasn't bored.", pt: "Eu não estava entediado." },
                      { en: "He wasn't excited.", pt: "Ele não estava animado." },
                      { en: "Were you at school?", pt: "Você estava na escola?" },
                      { en: "Was she happy?", pt: "Ela estava feliz?" },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-green-900 rounded-lg">
                        <SpeakSentence text={item.en} className="text-green-100 font-bold">{item.en}</SpeakSentence>
                        <p className="text-green-200 text-sm mt-1">{item.pt}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-green-200">
                    <li>Use <strong className="text-white">was</strong> for I, he, she, it.</li>
                    <li>Use <strong className="text-white">were</strong> for you, we, they.</li>
                    <li>Use <strong className="text-white">wasn't / weren't</strong> for negative sentences.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson66")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (66)
          </button>
          <button onClick={() => router.push("/cursos/lesson68")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (68) &rarr;
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
      `}</style>
    </div>
  );
}