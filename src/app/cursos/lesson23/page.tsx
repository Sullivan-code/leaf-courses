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
// MAIN COMPONENT – LESSON 23: LIFESTYLE & WEEKLY PLANNING
// ============================================
export default function Lesson23LifestyleWeeklyPlanning() {
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

  const mainImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const studyGroupImage = "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const universityImage = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const gymImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cookingImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const calendarImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const subjectsImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "saber / Eu sei. / Você sabe. / Ele sabe. / Ela sabe.",
      options: [
        { label: "saber", replacement: "to know.", pt: "saber" },
        { label: "Eu sei", replacement: "I know.", pt: "Eu sei." },
        { label: "Você sabe", replacement: "You know.", pt: "Você sabe." },
        { label: "Ele sabe", replacement: "He knows.", pt: "Ele sabe." },
        { label: "Ela sabe", replacement: "She knows.", pt: "Ela sabe." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Nós não sabemos o seu nome. / Eles / Você / Eu",
      options: [
        { label: "Nós", replacement: "We don't know your name.", pt: "Nós não sabemos o seu nome." },
        { label: "Eles", replacement: "They don't know your name.", pt: "Eles não sabem o seu nome." },
        { label: "Você", replacement: "You don't know your name.", pt: "Você não sabe o seu nome." },
        { label: "Eu", replacement: "I don't know your name.", pt: "Eu não sei o seu nome." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eles sabem inglês? / Você / Eu",
      options: [
        { label: "Eles", replacement: "Do they know English?", pt: "Eles sabem inglês?" },
        { label: "Você", replacement: "Do you know English?", pt: "Você sabe inglês?" },
        { label: "Eu", replacement: "Do I know English?", pt: "Eu sei inglês?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ele quer saber. / precisa / tem que",
      options: [
        { label: "quer", replacement: "He wants to know.", pt: "Ele quer saber." },
        { label: "precisa", replacement: "He needs to know.", pt: "Ele precisa saber." },
        { label: "tem que", replacement: "He has to know.", pt: "Ele tem que saber." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "conhecer / Eu conheço. / Você conhece? / meus pais / professores",
      options: [
        { label: "conhecer", replacement: "to know.", pt: "conhecer" },
        { label: "Eu conheço", replacement: "I know.", pt: "Eu conheço." },
        { label: "Você conhece", replacement: "Do you know?", pt: "Você conhece?" },
        { label: "meus pais", replacement: "Do you know my parents?", pt: "Você conhece meus pais?" },
        { label: "professores", replacement: "Do you know the teachers?", pt: "Você conhece os professores?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "aprender / Eu aprendo. / Nós aprendemos. / Ela aprende.",
      options: [
        { label: "aprender", replacement: "to learn.", pt: "aprender" },
        { label: "Eu aprendo", replacement: "I learn.", pt: "Eu aprendo." },
        { label: "Nós aprendemos", replacement: "We learn.", pt: "Nós aprendemos." },
        { label: "Ela aprende", replacement: "She learns.", pt: "Ela aprende." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eles não aprendem alemão. / Você / Eu",
      options: [
        { label: "Eles", replacement: "They don't learn German.", pt: "Eles não aprendem alemão." },
        { label: "Você", replacement: "You don't learn German.", pt: "Você não aprende alemão." },
        { label: "Eu", replacement: "I don't learn German.", pt: "Eu não aprendo alemão." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Vocês aprendem inglês aqui? / lá / na Wizard",
      options: [
        { label: "aqui", replacement: "Do you learn English here?", pt: "Vocês aprendem inglês aqui?" },
        { label: "lá", replacement: "Do you learn English there?", pt: "Vocês aprendem inglês lá?" },
        { label: "na Wizard", replacement: "Do you learn English at Wizard?", pt: "Vocês aprendem inglês na Wizard?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Ela quer aprender italiano. / precisa / prefere",
      options: [
        { label: "quer", replacement: "She wants to learn Italian.", pt: "Ela quer aprender italiano." },
        { label: "precisa", replacement: "She needs to learn Italian.", pt: "Ela precisa aprender italiano." },
        { label: "prefere", replacement: "She prefers to learn Italian.", pt: "Ela prefere aprender italiano." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "O que você quer aprender? / saber / estudar",
      options: [
        { label: "aprender", replacement: "What do you want to learn?", pt: "O que você quer aprender?" },
        { label: "saber", replacement: "What do you want to know?", pt: "O que você quer saber?" },
        { label: "estudar", replacement: "What do you want to study?", pt: "O que você quer estudar?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Elas aprendem geografia na escola. / biologia / matemática",
      options: [
        { label: "geografia", replacement: "They learn geography at school.", pt: "Elas aprendem geografia na escola." },
        { label: "biologia", replacement: "They learn biology at school.", pt: "Elas aprendem biologia na escola." },
        { label: "matemática", replacement: "They learn math at school.", pt: "Elas aprendem matemática na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu tenho novas matérias na escola. / Nós / Ela",
      options: [
        { label: "Eu", replacement: "I have new subjects at school.", pt: "Eu tenho novas matérias na escola." },
        { label: "Nós", replacement: "We have new subjects at school.", pt: "Nós temos novas matérias na escola." },
        { label: "Ela", replacement: "She has new subjects at school.", pt: "Ela tem novas matérias na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você tem aula de matemática esta semana? / biologia / geografia",
      options: [
        { label: "matemática", replacement: "Do you have math class this week?", pt: "Você tem aula de matemática esta semana?" },
        { label: "biologia", replacement: "Do you have biology class this week?", pt: "Você tem aula de biologia esta semana?" },
        { label: "geografia", replacement: "Do you have geography class this week?", pt: "Você tem aula de geografia esta semana?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "O que você quer aprender este ano? / este mês / esta semana",
      options: [
        { label: "este ano", replacement: "What do you want to learn this year?", pt: "O que você quer aprender este ano?" },
        { label: "este mês", replacement: "What do you want to learn this month?", pt: "O que você quer aprender este mês?" },
        { label: "esta semana", replacement: "What do you want to learn this week?", pt: "O que você quer aprender esta semana?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "A que horas você vai para o escritório? / universidade / academia",
      options: [
        { label: "escritório", replacement: "What time do you go to the office?", pt: "A que horas você vai para o escritório?" },
        { label: "universidade", replacement: "What time do you go to the university?", pt: "A que horas você vai para a universidade?" },
        { label: "academia", replacement: "What time do you go to the gym?", pt: "A que horas você vai para a academia?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu estudo inglês com meu namorado. / marido / minha namorada",
      options: [
        { label: "namorado", replacement: "I study English with my boyfriend.", pt: "Eu estudo inglês com meu namorado." },
        { label: "marido", replacement: "I study English with my husband.", pt: "Eu estudo inglês com meu marido." },
        { label: "namorada", replacement: "I study English with my girlfriend.", pt: "Eu estudo inglês com minha namorada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu tenho aproximadamente 40 livros em casa. / 50 / 60",
      options: [
        { label: "40", replacement: "I have about 40 books at home.", pt: "Eu tenho aproximadamente 40 livros em casa." },
        { label: "50", replacement: "I have about 50 books at home.", pt: "Eu tenho aproximadamente 50 livros em casa." },
        { label: "60", replacement: "I have about 60 books at home.", pt: "Eu tenho aproximadamente 60 livros em casa." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eu só estudo de manhã. / à tarde / à noite",
      options: [
        { label: "de manhã", replacement: "I only study in the morning.", pt: "Eu só estudo de manhã." },
        { label: "à tarde", replacement: "I only study in the afternoon.", pt: "Eu só estudo à tarde." },
        { label: "à noite", replacement: "I only study in the evening.", pt: "Eu só estudo à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu tenho apenas um celular. / tablet / computador",
      options: [
        { label: "celular", replacement: "I only have one cell phone.", pt: "Eu tenho apenas um celular." },
        { label: "tablet", replacement: "I only have one tablet.", pt: "Eu tenho apenas um tablet." },
        { label: "computador", replacement: "I only have one computer.", pt: "Eu tenho apenas um computador." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Você estuda o dia todo? / cozinha / trabalha",
      options: [
        { label: "estuda", replacement: "Do you study all day long?", pt: "Você estuda o dia todo?" },
        { label: "cozinha", replacement: "Do you cook all day long?", pt: "Você cozinha o dia todo?" },
        { label: "trabalha", replacement: "Do you work all day long?", pt: "Você trabalha o dia todo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu faço exercícios nos fins de semana. / Nós / Ele",
      options: [
        { label: "Eu", replacement: "I work out on weekends.", pt: "Eu faço exercícios nos fins de semana." },
        { label: "Nós", replacement: "We work out on weekends.", pt: "Nós fazemos exercícios nos fins de semana." },
        { label: "Ele", replacement: "He works out on weekends.", pt: "Ele faz exercícios nos fins de semana." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Você fica em casa o dia todo? / na escola / no trabalho",
      options: [
        { label: "em casa", replacement: "Do you stay home all day long?", pt: "Você fica em casa o dia todo?" },
        { label: "na escola", replacement: "Do you stay at school all day long?", pt: "Você fica na escola o dia todo?" },
        { label: "no trabalho", replacement: "Do you stay at work all day long?", pt: "Você fica no trabalho o dia todo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Quando você faz exercícios? / Onde / A que horas",
      options: [
        { label: "Quando", replacement: "When do you work out?", pt: "Quando você faz exercícios?" },
        { label: "Onde", replacement: "Where do you work out?", pt: "Onde você faz exercícios?" },
        { label: "A que horas", replacement: "What time do you work out?", pt: "A que horas você faz exercícios?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Eu faço exercícios na academia. / na universidade / na praia",
      options: [
        { label: "na academia", replacement: "I work out at the gym.", pt: "Eu faço exercícios na academia." },
        { label: "na universidade", replacement: "I work out at the university.", pt: "Eu faço exercícios na universidade." },
        { label: "na praia", replacement: "I work out at the beach.", pt: "Eu faço exercícios na praia." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Ele faz exercícios o dia todo. / estuda / lê",
      options: [
        { label: "faz exercícios", replacement: "He works out all day long.", pt: "Ele faz exercícios o dia todo." },
        { label: "estuda", replacement: "He studies all day long.", pt: "Ele estuda o dia todo." },
        { label: "lê", replacement: "He reads all day long.", pt: "Ele lê o dia todo." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Ele fala inglês muito bem. / alemão / português",
      options: [
        { label: "inglês", replacement: "He speaks English very well.", pt: "Ele fala inglês muito bem." },
        { label: "alemão", replacement: "He speaks German very well.", pt: "Ele fala alemão muito bem." },
        { label: "português", replacement: "He speaks Portuguese very well.", pt: "Ele fala português muito bem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ele não fala inglês. / alemão / português",
      options: [
        { label: "inglês", replacement: "He doesn't speak English.", pt: "Ele não fala inglês." },
        { label: "alemão", replacement: "He doesn't speak German.", pt: "Ele não fala alemão." },
        { label: "português", replacement: "He doesn't speak Portuguese.", pt: "Ele não fala português." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não mora no Brasil. / na Itália / na França",
      options: [
        { label: "no Brasil", replacement: "He doesn't live in Brazil.", pt: "Ele não mora no Brasil." },
        { label: "na Itália", replacement: "He doesn't live in Italy.", pt: "Ele não mora na Itália." },
        { label: "na França", replacement: "He doesn't live in France.", pt: "Ele não mora na França." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ele não quer aprender francês. / matemática / idiomas",
      options: [
        { label: "francês", replacement: "He doesn't want to learn French.", pt: "Ele não quer aprender francês." },
        { label: "matemática", replacement: "He doesn't want to learn math.", pt: "Ele não quer aprender matemática." },
        { label: "idiomas", replacement: "He doesn't want to learn languages.", pt: "Ele não quer aprender idiomas." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ela não tem aula de matemática hoje. / biologia / geografia",
      options: [
        { label: "matemática", replacement: "She doesn't have math class today.", pt: "Ela não tem aula de matemática hoje." },
        { label: "biologia", replacement: "She doesn't have biology class today.", pt: "Ela não tem aula de biologia hoje." },
        { label: "geografia", replacement: "She doesn't have geography class today.", pt: "Ela não tem aula de geografia hoje." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Meu filho não gosta dessa matéria. / Meu namorado / Meu irmão",
      options: [
        { label: "Meu filho", replacement: "My son doesn't like this subject.", pt: "Meu filho não gosta dessa matéria." },
        { label: "Meu namorado", replacement: "My boyfriend doesn't like this subject.", pt: "Meu namorado não gosta dessa matéria." },
        { label: "Meu irmão", replacement: "My brother doesn't like this subject.", pt: "Meu irmão não gosta dessa matéria." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu sei falar inglês. / espanhol / português",
      options: [
        { label: "inglês", replacement: "I know how to speak English.", pt: "Eu sei falar inglês." },
        { label: "espanhol", replacement: "I know how to speak Spanish.", pt: "Eu sei falar espanhol." },
        { label: "português", replacement: "I know how to speak Portuguese.", pt: "Eu sei falar português." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Eu sei cozinhar muito bem. / Nós / Ele",
      options: [
        { label: "Eu", replacement: "I know how to cook very well.", pt: "Eu sei cozinhar muito bem." },
        { label: "Nós", replacement: "We know how to cook very well.", pt: "Nós sabemos cozinhar muito bem." },
        { label: "Ele", replacement: "He knows how to cook very well.", pt: "Ele sabe cozinhar muito bem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Você sabe falar francês? / português / italiano",
      options: [
        { label: "francês", replacement: "Do you know how to speak French?", pt: "Você sabe falar francês?" },
        { label: "português", replacement: "Do you know how to speak Portuguese?", pt: "Você sabe falar português?" },
        { label: "italiano", replacement: "Do you know how to speak Italian?", pt: "Você sabe falar italiano?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Você quer aprender a cozinhar? / falar inglês / falar italiano",
      options: [
        { label: "cozinhar", replacement: "Do you want to learn how to cook?", pt: "Você quer aprender a cozinhar?" },
        { label: "falar inglês", replacement: "Do you want to learn how to speak English?", pt: "Você quer aprender a falar inglês?" },
        { label: "falar italiano", replacement: "Do you want to learn how to speak Italian?", pt: "Você quer aprender a falar italiano?" }
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
      en: "They stay home all day long.",
      pt: "Eles ficam em casa o dia todo.",
      green: ["stay", "home", "all day long"]
    },
    {
      en: "I don't work out on weekends.",
      pt: "Eu não faço exercícios nos fins de semana.",
      green: ["work out", "weekends"]
    },
    {
      en: "He wants to know more about this subject.",
      pt: "Ele quer saber mais sobre esta matéria.",
      green: ["wants", "know", "more", "subject"]
    },
    {
      en: "She learns Italian at Wizard.",
      pt: "Ela aprende italiano na Wizard.",
      green: ["learns", "Italian", "Wizard"]
    }
  ];

  // Dados da seção Make it yours com palavras-chave destacadas em azul
  const makeItYoursData = [
    {
      en: "I want to learn how to speak English very well.",
      pt: "Eu quero aprender a falar inglês muito bem.",
      parts: [
        { text: "I ", highlight: false },
        { text: "want", highlight: true },
        { text: " to ", highlight: false },
        { text: "learn", highlight: true },
        { text: " how to ", highlight: false },
        { text: "speak", highlight: true },
        { text: " English very well.", highlight: false },
      ]
    },
    {
      en: "She studies biology and math at the university.",
      pt: "Ela estuda biologia e matemática na universidade.",
      parts: [
        { text: "She ", highlight: false },
        { text: "studies", highlight: true },
        { text: " ", highlight: false },
        { text: "biology", highlight: true },
        { text: " and ", highlight: false },
        { text: "math", highlight: true },
        { text: " at the university.", highlight: false },
      ]
    },
    {
      en: "We work out at the gym on weekends.",
      pt: "Nós fazemos exercícios na academia nos fins de semana.",
      parts: [
        { text: "We ", highlight: false },
        { text: "work out", highlight: true },
        { text: " at the ", highlight: false },
        { text: "gym", highlight: true },
        { text: " on ", highlight: false },
        { text: "weekends", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "He doesn't want to learn French this year.",
      pt: "Ele não quer aprender francês este ano.",
      parts: [
        { text: "He ", highlight: false },
        { text: "doesn't want", highlight: true },
        { text: " to ", highlight: false },
        { text: "learn", highlight: true },
        { text: " ", highlight: false },
        { text: "French", highlight: true },
        { text: " this year.", highlight: false },
      ]
    },
    {
      en: "Do you know how to cook Italian food?",
      pt: "Você sabe cozinhar comida italiana?",
      parts: [
        { text: "Do you ", highlight: false },
        { text: "know", highlight: true },
        { text: " how to ", highlight: false },
        { text: "cook", highlight: true },
        { text: " ", highlight: false },
        { text: "Italian food", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "I only study in the morning and work in the afternoon.",
      pt: "Eu só estudo de manhã e trabalho à tarde.",
      parts: [
        { text: "I ", highlight: false },
        { text: "only study", highlight: true },
        { text: " in the ", highlight: false },
        { text: "morning", highlight: true },
        { text: " and ", highlight: false },
        { text: "work", highlight: true },
        { text: " in the afternoon.", highlight: false },
      ]
    },
    {
      en: "What time do you go to the university?",
      pt: "A que horas você vai para a universidade?",
      parts: [
        { text: "What time do you ", highlight: false },
        { text: "go", highlight: true },
        { text: " to the ", highlight: false },
        { text: "university", highlight: true },
        { text: "?", highlight: false },
      ]
    },
    {
      en: "They have new subjects at school this semester.",
      pt: "Eles têm novas matérias na escola neste semestre.",
      parts: [
        { text: "They ", highlight: false },
        { text: "have", highlight: true },
        { text: " new ", highlight: false },
        { text: "subjects", highlight: true },
        { text: " at school this ", highlight: false },
        { text: "semester", highlight: true },
        { text: ".", highlight: false },
      ]
    },
    {
      en: "I don't have biology class today.",
      pt: "Eu não tenho aula de biologia hoje.",
      parts: [
        { text: "I ", highlight: false },
        { text: "don't have", highlight: true },
        { text: " ", highlight: false },
        { text: "biology class", highlight: true },
        { text: " today.", highlight: false },
      ]
    },
    {
      en: "My boyfriend works out every day.",
      pt: "Meu namorado faz exercícios todos os dias.",
      parts: [
        { text: "My ", highlight: false },
        { text: "boyfriend", highlight: true },
        { text: " ", highlight: false },
        { text: "works out", highlight: true },
        { text: " every ", highlight: false },
        { text: "day", highlight: true },
        { text: ".", highlight: false },
      ]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            📘 LESSON 23 – Lifestyle & Weekly Planning
          </h1>
          <SpeakSentence text="Learn to talk about academic subjects, university life, relationships, and weekly routines." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🎓📚 Learn to talk about academic subjects, university life, relationships, and weekly routines. 🎓📚
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Group studying together at a table"
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
                <SpeakText text="to know" className="text-blue-600 font-bold">to know</SpeakText> = saber, conhecer
              </li>
              <li>
                <SpeakText text="to learn" className="text-blue-600 font-bold">to learn</SpeakText> = aprender
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
                { en: "subject", pt: "assunto, matéria" },
                { en: "biology", pt: "biologia" },
                { en: "geography", pt: "geografia" },
                { en: "math", pt: "matemática" },
                { en: "university", pt: "universidade" },
                { en: "gym", pt: "academia" },
                { en: "cooking", pt: "culinária" },
                { en: "month", pt: "mês" },
                { en: "year", pt: "ano" },
                { en: "boyfriend", pt: "namorado" },
                { en: "girlfriend", pt: "namorada" },
                { en: "more", pt: "mais" },
                { en: "only", pt: "só, somente, apenas" },
                { en: "about", pt: "sobre, aproximadamente" },
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
            <SpeakSentence text="Practice common phrases to talk about weekly routines and studies" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about weekly routines and studies
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
            <SpeakSentence text="Negative structures with doesn't and questions with how to" className="text-md text-gray-600 mb-4 italic">
              📚 Negative structures with "doesn't" and questions with "how to"
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="He doesn't study biology here." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  He doesn't study biology here.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Ele não estuda biologia aqui.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="She doesn't know this word in French." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  She doesn't know this word in French.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Ela não sabe essa palavra em francês.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I know how to speak English very well." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I know how to speak English very well.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu sei falar inglês muito bem.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Do you know how to speak Italian?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Do you know how to speak Italian?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Você sabe falar italiano?</div>
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
                        src={studyGroupImage}
                        alt="Group studying together"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Studying with friends
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={universityImage}
                        alt="University campus"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      University life
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={gymImage}
                        alt="Gym workout"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Working out at the gym
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
                  { en: "I want to learn...", pt: "Eu quero aprender..." },
                  { en: "She studies... at the university.", pt: "Ela estuda... na universidade." },
                  { en: "He doesn't speak...", pt: "Ele não fala..." },
                  { en: "Do you know how to...?", pt: "Você sabe...?" },
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
                src={subjectsImage}
                alt="Academic subjects and books"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <SpeakSentence text="What do you want to learn this year? I want to learn English!">
                  What do you want to learn this year? <span className="font-bold">I want to learn English!</span>
                </SpeakSentence>
                <p className="text-sm text-gray-600 mt-1">O que você quer aprender este ano? Eu quero aprender inglês!</p>
              </div>
            </div>

            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">TIME EXPRESSIONS</h3>
              <div className="space-y-4">
                {[
                  { en: "all day long", pt: "o dia todo" },
                  { en: "on weekends", pt: "nos fins de semana" },
                  { en: "in the morning / afternoon / evening", pt: "de manhã / à tarde / à noite" },
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
            onClick={() => router.push("/cursos/lesson22")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson (22)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson24")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson (24) &rarr;
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