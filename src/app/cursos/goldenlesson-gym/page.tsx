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

// Helper: speaks English text with an American female voice when available.
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
// HIGHLIGHTED PHRASE COMPONENT
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-green-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
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
// MAIN COMPONENT – LESSON 62 GYM & FITNESS
// ============================================
export default function Lesson62GymAndFitness() {
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

  // ===== IMAGENS =====
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2018_42_14.png?raw=true";
  const grammarImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2018_56_53.png?raw=true";
  const readingImage = "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO – BASEADOS NO MATERIAL
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu treino. / ela / nós",
      options: [
        { label: "Eu", replacement: "I work out." },
        { label: "Ela", replacement: "She works out." },
        { label: "Nós", replacement: "We work out." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ele treina. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He trains." },
        { label: "Ela", replacement: "She trains." },
        { label: "Vocês", replacement: "You train." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ela geralmente treina de manhã. / à noite / à tarde",
      options: [
        { label: "de manhã", replacement: "She usually trains in the morning." },
        { label: "à noite", replacement: "She usually trains at night." },
        { label: "à tarde", replacement: "She usually trains in the afternoon." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero ficar mais forte. / saudável / rápido",
      options: [
        { label: "forte", replacement: "I want to become stronger." },
        { label: "saudável", replacement: "I want to become healthier." },
        { label: "rápido", replacement: "I want to become faster." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eles usam máquinas diferentes. / halteres / barras",
      options: [
        { label: "máquinas", replacement: "They use different machines." },
        { label: "halteres", replacement: "They use different dumbbells." },
        { label: "barras", replacement: "They use different barbells." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Ele não gosta de treinar sozinho. / ela / eu",
      options: [
        { label: "Ele", replacement: "He doesn't like training alone." },
        { label: "Ela", replacement: "She doesn't like training alone." },
        { label: "Eu", replacement: "I don't like training alone." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu uso halteres para os ombros. / barra / kettlebell",
      options: [
        { label: "halteres", replacement: "I use dumbbells for my shoulders." },
        { label: "barra", replacement: "I use a barbell for my shoulders." },
        { label: "kettlebell", replacement: "I use a kettlebell for my shoulders." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ele usa o banco para o peito. / máquina / cabo",
      options: [
        { label: "banco", replacement: "He uses the bench for his chest." },
        { label: "máquina", replacement: "He uses the machine for his chest." },
        { label: "cabo", replacement: "He uses the cable for his chest." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu preciso ajustar o banco. / equipamento / peso",
      options: [
        { label: "banco", replacement: "I need to adjust the bench." },
        { label: "equipamento", replacement: "I need to adjust the equipment." },
        { label: "peso", replacement: "I need to adjust the weight." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Esta máquina trabalha as costas. / peito / pernas",
      options: [
        { label: "costas", replacement: "This machine works your back." },
        { label: "peito", replacement: "This machine works your chest." },
        { label: "pernas", replacement: "This machine works your legs." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Ela não usa pesos muito pesados. / leves / novos",
      options: [
        { label: "pesados", replacement: "She doesn't use very heavy weights." },
        { label: "leves", replacement: "She doesn't use very light weights." },
        { label: "novos", replacement: "She doesn't use very new weights." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu geralmente faço três séries de dez repetições. / quatro / cinco",
      options: [
        { label: "três", replacement: "I usually do three sets of ten reps." },
        { label: "quatro", replacement: "I usually do four sets of ten reps." },
        { label: "cinco", replacement: "I usually do five sets of ten reps." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Hoje estou treinando peito e tríceps. / costas / pernas",
      options: [
        { label: "peito e tríceps", replacement: "Today I am training my chest and triceps." },
        { label: "costas e bíceps", replacement: "Today I am training my back and biceps." },
        { label: "pernas e glúteos", replacement: "Today I am training my legs and glutes." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela geralmente treina as pernas às segundas. / costas / ombros",
      options: [
        { label: "pernas", replacement: "She usually trains her legs on Mondays." },
        { label: "costas", replacement: "She usually trains her back on Mondays." },
        { label: "ombros", replacement: "She usually trains her shoulders on Mondays." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu sempre aqueço antes de levantar pesos. / corro / alongo",
      options: [
        { label: "aqueço", replacement: "I always warm up before lifting weights." },
        { label: "corro", replacement: "I always run before lifting weights." },
        { label: "alongo", replacement: "I always stretch before lifting weights." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela caminha na esteira por vinte minutos. / corre / pedala",
      options: [
        { label: "caminha", replacement: "She walks on the treadmill for twenty minutes." },
        { label: "corre", replacement: "She runs on the treadmill for twenty minutes." },
        { label: "pedala", replacement: "She rides the bike for twenty minutes." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Ela consegue fazer dez barras fixas. / flexões / paralelas",
      options: [
        { label: "barras fixas", replacement: "She can do ten pull-ups." },
        { label: "flexões", replacement: "She can do ten push-ups." },
        { label: "paralelas", replacement: "She can do ten dips." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu tento comer proteína suficiente todos os dias. / carboidratos / vegetais",
      options: [
        { label: "proteína", replacement: "I try to eat enough protein every day." },
        { label: "carboidratos", replacement: "I try to eat enough carbohydrates every day." },
        { label: "vegetais", replacement: "I try to eat enough vegetables every day." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Este banco está disponível? / máquina / halteres",
      options: [
        { label: "banco", replacement: "Is this bench available?" },
        { label: "máquina", replacement: "Is this machine available?" },
        { label: "halteres", replacement: "Are these dumbbells available?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Desculpa, ainda estou usando esta máquina. / banco / rack",
      options: [
        { label: "máquina", replacement: "Sorry, I am still using this machine." },
        { label: "banco", replacement: "Sorry, I am still using this bench." },
        { label: "rack", replacement: "Sorry, I am still using this rack." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Posso revezar com você? / treinar / compartilhar",
      options: [
        { label: "revezar", replacement: "Can I work in with you?" },
        { label: "treinar", replacement: "Can I train with you?" },
        { label: "compartilhar", replacement: "Can I share with you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você pode me ajudar no supino? / agachamento / levantamento terra",
      options: [
        { label: "supino", replacement: "Can you spot me on the bench press?" },
        { label: "agachamento", replacement: "Can you spot me on the squat?" },
        { label: "levantamento terra", replacement: "Can you spot me on the deadlift?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Alguém está usando esses halteres? / anilhas / barras",
      options: [
        { label: "halteres", replacement: "Does anyone use these dumbbells?" },
        { label: "anilhas", replacement: "Does anyone use these plates?" },
        { label: "barras", replacement: "Does anyone use these barbells?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Ele sempre limpa o equipamento depois de usá-lo. / ela / eu",
      options: [
        { label: "Ele", replacement: "He always cleans the equipment after using it." },
        { label: "Ela", replacement: "She always cleans the equipment after using it." },
        { label: "Eu", replacement: "I always clean the equipment after using it." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu geralmente treino depois do trabalho. / ela / nós",
      options: [
        { label: "Eu", replacement: "I usually work out after work." },
        { label: "Ela", replacement: "She usually works out after work." },
        { label: "Nós", replacement: "We usually work out after work." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela vai à academia quatro vezes por semana. / ele / eles",
      options: [
        { label: "Ela", replacement: "She goes to the gym four times a week." },
        { label: "Ele", replacement: "He goes to the gym four times a week." },
        { label: "Eles", replacement: "They go to the gym four times a week." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não gosta de treinar sozinho. / ela / eu",
      options: [
        { label: "Ele", replacement: "He doesn't like training alone." },
        { label: "Ela", replacement: "She doesn't like training alone." },
        { label: "Eu", replacement: "I don't like training alone." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ela treina todos os dias? / ele / vocês",
      options: [
        { label: "Ela", replacement: "Does she train every day?" },
        { label: "Ele", replacement: "Does he train every day?" },
        { label: "Vocês", replacement: "Do you train every day?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu tento seguir a mesma rotina. / ela / eles",
      options: [
        { label: "Eu", replacement: "I try to follow the same routine." },
        { label: "Ela", replacement: "She tries to follow the same routine." },
        { label: "Eles", replacement: "They try to follow the same routine." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Meu treino dura cerca de uma hora. / dela / deles",
      options: [
        { label: "Meu", replacement: "My workout takes about one hour." },
        { label: "Dela", replacement: "Her workout takes about one hour." },
        { label: "Deles", replacement: "Their workout takes about one hour." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu quero aumentar meu número de repetições. / diminuir / manter",
      options: [
        { label: "aumentar", replacement: "I want to increase my number of repetitions." },
        { label: "diminuir", replacement: "I want to decrease my number of repetitions." },
        { label: "manter", replacement: "I want to maintain my number of repetitions." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Ele vai tentar um peso maior na próxima semana. / menor / mais leve",
      options: [
        { label: "maior", replacement: "He will try a heavier weight next week." },
        { label: "menor", replacement: "He will try a lighter weight next week." },
        { label: "mais leve", replacement: "He will try a much lighter weight next week." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eu tenho praticado minha técnica de agachamento. / supino / levantamento terra",
      options: [
        { label: "agachamento", replacement: "I have been practicing my squat technique." },
        { label: "supino", replacement: "I have been practicing my bench press technique." },
        { label: "levantamento terra", replacement: "I have been practicing my deadlift technique." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu preciso descansar depois de um treino pesado. / leve / longo",
      options: [
        { label: "pesado", replacement: "I need to rest after a hard workout." },
        { label: "leve", replacement: "I need to rest after a light workout." },
        { label: "longo", replacement: "I need to rest after a long workout." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Ela pratica boxe duas vezes por semana. / Muay Thai / jiu-jítsu",
      options: [
        { label: "boxe", replacement: "She practices boxing twice a week." },
        { label: "Muay Thai", replacement: "She practices Muay Thai twice a week." },
        { label: "jiu-jítsu", replacement: "She practices jiu-jitsu twice a week." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Meu principal objetivo é ganhar mais músculos. / perder gordura / melhorar a força",
      options: [
        { label: "ganhar músculos", replacement: "My main goal is to build more muscle." },
        { label: "perder gordura", replacement: "My main goal is to lose fat." },
        { label: "melhorar a força", replacement: "My main goal is to improve my strength." }
      ],
      currentIndex: 0,
    },
  ];

  // Combine all exercises for the helper function
  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "I usually work out at the gym after work.",
      pt: "Eu geralmente treino na academia depois do trabalho.",
      green: ["work out", "gym"]
    },
    {
      en: "I go to the gym four times a week.",
      pt: "Eu vou à academia quatro vezes por semana.",
      green: ["gym", "four", "times"]
    },
    {
      en: "How often do you go to the gym?",
      pt: "Com que frequência você vai à academia?",
      green: ["How", "often", "gym"]
    },
    {
      en: "Can I work in with you?",
      pt: "Posso revezar com você?",
      green: ["work", "in", "with"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🏋️ Lesson 62 - Fitness &amp; Gym English</h1>
          <SpeakSentence text="Learn to talk about the gym, workouts, equipment, and fitness routines." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about the gym, workouts, equipment, and fitness routines.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Fitness and gym"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
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
              <li><SpeakText text="to work out" className="text-green-600 font-bold">to work out</SpeakText> = treinar</li>
              <li><SpeakText text="to train" className="text-green-600 font-bold">to train</SpeakText> = treinar</li>
              <li><SpeakText text="to lift" className="text-green-600 font-bold">to lift</SpeakText> = levantar</li>
              <li><SpeakText text="to stretch" className="text-green-600 font-bold">to stretch</SpeakText> = alongar</li>
              <li><SpeakText text="to warm up" className="text-green-600 font-bold">to warm up</SpeakText> = aquecer</li>
              <li><SpeakText text="to rest" className="text-green-600 font-bold">to rest</SpeakText> = descansar</li>
              <li><SpeakText text="to improve" className="text-green-600 font-bold">to improve</SpeakText> = melhorar</li>
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
                { en: "gym", pt: "academia" },
                { en: "workout", pt: "treino" },
                { en: "dumbbell", pt: "halter" },
                { en: "barbell", pt: "barra" },
                { en: "plate", pt: "anilha" },
                { en: "bench", pt: "banco" },
                { en: "cable", pt: "cabo" },
                { en: "kettlebell", pt: "kettlebell" },
                { en: "set", pt: "série" },
                { en: "rep", pt: "repetição" },
                { en: "chest", pt: "peito" },
                { en: "back", pt: "costas" },
                { en: "shoulders", pt: "ombros" },
                { en: "legs", pt: "pernas" },
                { en: "squat", pt: "agachamento" },
                { en: "deadlift", pt: "levantamento terra" },
                { en: "bench press", pt: "supino" },
                { en: "treadmill", pt: "esteira" },
                { en: "warm-up", pt: "aquecimento" },
                { en: "protein", pt: "proteína" },
                { en: "rest", pt: "descanso" },
                { en: "injury", pt: "lesão" },
                { en: "boxing", pt: "boxe" },
                { en: "sparring", pt: "treino de combate" },
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
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for real gym situations" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for real gym situations
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

        {/* ===================== SECTION 4 – GRAMMAR (com imagem) ===================== */}
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
            <SpeakSentence text="Present simple, frequency adverbs, and routines for talking about fitness" className="text-md text-gray-600 mb-4 italic">
              📚 Present simple, frequency adverbs, and routines for talking about fitness
            </SpeakSentence>

            {/* ===== IMAGEM DA GRAMMAR (MARTIAL ARTS) ===== */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Fitness & Martial Arts"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
                { en: "I go to the gym four times a week.", pt: "Eu vou à academia quatro vezes por semana." },
                { en: "She usually trains in the morning.", pt: "Ela geralmente treina de manhã." },
                { en: "He works out with his brother.", pt: "Ele treina com o irmão dele." },
                { en: "They use different machines during their workout.", pt: "Eles usam máquinas diferentes durante o treino." },
                { en: "I want to become stronger this year.", pt: "Eu quero ficar mais forte este ano." },
                { en: "My workout usually takes about one hour.", pt: "Meu treino geralmente dura cerca de uma hora." },
                { en: "Does she train every day?", pt: "Ela treina todos os dias?" },
                { en: "He doesn't like training alone.", pt: "Ele não gosta de treinar sozinho." },
                { en: "I try to follow the same routine every week.", pt: "Eu tento seguir a mesma rotina toda semana." },
                { en: "How often do you go to the gym?", pt: "Com que frequência você vai à academia?" },
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
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
                    { en: "She is putting more plates on the barbell.", pt: "Ela está colocando mais anilhas na barra." },
                    { en: "I need to adjust the seat before I start.", pt: "Eu preciso ajustar o banco antes de começar." },
                    { en: "I usually do three sets of ten reps.", pt: "Eu geralmente faço três séries de dez repetições." },
                    { en: "Today I am training my chest and triceps.", pt: "Hoje estou treinando peito e tríceps." },
                    { en: "I always warm up before lifting weights.", pt: "Eu sempre aqueço antes de levantar pesos." },
                    { en: "She can do ten pull-ups without stopping.", pt: "Ela consegue fazer dez barras fixas sem parar." },
                    { en: "I try to eat enough protein every day.", pt: "Eu tento comer proteína suficiente todos os dias." },
                    { en: "I need to rest after a hard workout.", pt: "Eu preciso descansar depois de um treino pesado." },
                    { en: "She practices boxing twice a week.", pt: "Ela pratica boxe duas vezes por semana." },
                    { en: "My main goal is to build more muscle.", pt: "Meu principal objetivo é ganhar mais músculos." },
                    { en: "Is this bench available?", pt: "Este banco está disponível?" },
                  ].map((s, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium">
                          {idx+1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="Lifting weights" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Lifting weights at the gym</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Cardio training" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cardio &amp; endurance training</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Healthy nutrition" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Healthy nutrition &amp; recovery</p>
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
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
                { en: "I go to the gym four times a week.", pt: "Eu vou à academia quatro vezes por semana." },
                { en: "Can I work in with you?", pt: "Posso revezar com você?" },
                { en: "Can you spot me on the bench press?", pt: "Você pode me ajudar no supino?" },
                { en: "My main goal is to build more muscle.", pt: "Meu principal objetivo é ganhar mais músculos." },
                { en: "I need to rest after a hard workout.", pt: "Eu preciso descansar depois de um treino pesado." },
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
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-green-200">
                    <li>Use <strong className="text-white">"usually"</strong> before the main verb: "I usually train..."</li>
                    <li><strong className="text-white">"Work out"</strong> is a verb; <strong className="text-white">"workout"</strong> is a noun.</li>
                    <li>Use <strong className="text-white">"How often...?"</strong> to ask about frequency.</li>
                    <li><strong className="text-white">"Spot me"</strong> means to help someone during an exercise.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">"Can I work in with you?" is the polite way to ask to share equipment at the gym.</p>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <p className="text-green-200 text-sm italic">
                    🌟 <strong>Substitute the words in green</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson61")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (61)
          </button>
          <button onClick={() => router.push("/cursos/lesson63")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (63) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM DA GRAMMAR (MARTIAL ARTS) ===== */}
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

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Fitness and gym – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
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