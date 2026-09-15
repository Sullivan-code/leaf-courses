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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-purple-900/40 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />}
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
      className={`group cursor-pointer hover:bg-purple-900/30 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-purple-400" />
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-gray-900 border border-purple-700 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-purple-200 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 bg-gray-800 border border-purple-600 rounded-xl focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none text-white placeholder-purple-300"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-purple-300 hover:text-white transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-full hover:from-fuchsia-600 hover:to-fuchsia-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-purple-400 hover:text-purple-200 transition-colors focus:outline-none"
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
    <div className="bg-gray-800/80 p-4 rounded-lg border border-purple-700/50">
      <div className="flex items-start justify-between mb-2">
        <p className="text-purple-300 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-700 transition-colors text-purple-400 hover:text-purple-200 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      
      {showEnglish && (
        <div className="mb-3 p-3 bg-purple-900/30 rounded-md">
          <SpeakSentence text={currentSentence} className="text-purple-200 font-medium" />
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
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-purple-200 hover:bg-gray-600'
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
// OPEN-ENDED QUESTION COMPONENT
// ============================================
function OpenEndedQuestion({ 
  question, 
  hint, 
  sampleAnswer 
}: { 
  question: string; 
  hint: string; 
  sampleAnswer: string; 
}) {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 p-5 rounded-xl border border-purple-600/40">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💭</span>
        <div className="flex-1">
          <p className="text-white font-semibold text-lg mb-1">{question}</p>
          <p className="text-purple-300 text-sm mb-3 italic">💡 {hint}</p>
          <button
            onClick={() => setShowSample(!showSample)}
            className="text-sm px-4 py-2 bg-purple-700/60 hover:bg-purple-600/80 text-purple-100 rounded-full transition-colors"
          >
            {showSample ? '🙈 Esconder resposta modelo' : '👀 Ver resposta modelo'}
          </button>
          {showSample && (
            <div className="mt-3 p-3 bg-gray-800/80 rounded-lg border border-purple-500/30">
              <p className="text-purple-200 text-sm mb-1">🗣️ Sample answer:</p>
              <SpeakSentence text={sampleAnswer} className="text-white font-medium">
                {sampleAnswer}
              </SpeakSentence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM ROXO
// ============================================
function HighlightedPhrase({ text, highlightWords, translation }: { text: string; highlightWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (highlightWords.some(hw => cleanWord.toLowerCase() === hw.toLowerCase())) {
      return <span key={i} className="text-purple-300 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-gray-800/80 p-4 rounded-lg border border-purple-700/50">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-white">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-purple-300">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – CAR LESSON (DARK MODE)
// ============================================
export default function CarLessonDarkMode() {
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
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2023_01_16.png?raw=true";
  const carLessonImage = "https://github.com/Sullivan-code/english-audios/blob/main/CAR%20LESSON.png?raw=true";
  const carLesson2Image = "https://github.com/Sullivan-code/english-audios/blob/main/carlesson2?raw=true";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO – CAR LESSON
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu dirijo. / ela / nós",
      options: [
        { label: "Eu", replacement: "I drive." },
        { label: "Ela", replacement: "She drives." },
        { label: "Nós", replacement: "We drive." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você estaciona. / eles / nós",
      options: [
        { label: "Você", replacement: "You park." },
        { label: "Eles", replacement: "They park." },
        { label: "Nós", replacement: "We park." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele freia. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He brakes." },
        { label: "Ela", replacement: "She brakes." },
        { label: "Vocês", replacement: "You brake." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero dirigir. / nós / eles",
      options: [
        { label: "Eu", replacement: "I want to drive." },
        { label: "Nós", replacement: "We want to drive." },
        { label: "Eles", replacement: "They want to drive." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela liga o carro. / ele / eu",
      options: [
        { label: "Ela", replacement: "She starts the car." },
        { label: "Ele", replacement: "He starts the car." },
        { label: "Eu", replacement: "I start the car." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu preciso de um carro novo. / usado / elétrico",
      options: [
        { label: "novo", replacement: "I need a new car." },
        { label: "usado", replacement: "I need a used car." },
        { label: "elétrico", replacement: "I need an electric car." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "O volante está sujo. / quebrado / velho",
      options: [
        { label: "sujo", replacement: "The steering wheel is dirty." },
        { label: "quebrado", replacement: "The steering wheel is broken." },
        { label: "velho", replacement: "The steering wheel is old." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Os pneus estão gastos. / novos / cheios",
      options: [
        { label: "gastos", replacement: "The tires are worn out." },
        { label: "novos", replacement: "The tires are new." },
        { label: "cheios", replacement: "The tires are full." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Vamos estacionar o carro aqui. / ali / perto",
      options: [
        { label: "aqui", replacement: "Let's park the car here." },
        { label: "ali", replacement: "Let's park the car there." },
        { label: "perto", replacement: "Let's park the car nearby." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O freio está funcionando? / farol / motor",
      options: [
        { label: "freio", replacement: "Is the brake working?" },
        { label: "farol", replacement: "Is the headlight working?" },
        { label: "motor", replacement: "Is the engine working?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não tenho carteira de motorista. / carro / seguro",
      options: [
        { label: "carteira de motorista", replacement: "I don't have a driver's license." },
        { label: "carro", replacement: "I don't have a car." },
        { label: "seguro", replacement: "I don't have insurance." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Esta rua é muito movimentada. / perigosa / estreita",
      options: [
        { label: "movimentada", replacement: "This street is very busy." },
        { label: "perigosa", replacement: "This street is very dangerous." },
        { label: "estreita", replacement: "This street is very narrow." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Por favor, coloque o cinto de segurança. / retrovisor / GPS",
      options: [
        { label: "cinto de segurança", replacement: "Please, put on your seatbelt." },
        { label: "retrovisor", replacement: "Please, adjust your rearview mirror." },
        { label: "GPS", replacement: "Please, turn on your GPS." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Vamos abastecer o carro. / lavar / vender",
      options: [
        { label: "abastecer", replacement: "Let's fuel up the car." },
        { label: "lavar", replacement: "Let's wash the car." },
        { label: "vender", replacement: "Let's sell the car." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela quer comprar um SUV. / sedan / caminhonete",
      options: [
        { label: "SUV", replacement: "She wants to buy an SUV." },
        { label: "sedan", replacement: "She wants to buy a sedan." },
        { label: "caminhonete", replacement: "She wants to buy a pickup truck." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Cuidado! Tem um carro vindo. / caminhão / moto",
      options: [
        { label: "carro", replacement: "Watch out! There's a car coming." },
        { label: "caminhão", replacement: "Watch out! There's a truck coming." },
        { label: "moto", replacement: "Watch out! There's a motorcycle coming." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Podemos dar uma carona? / pegar um táxi / alugar um carro",
      options: [
        { label: "dar uma carona", replacement: "Can we give you a ride?" },
        { label: "pegar um táxi", replacement: "Can we take a taxi?" },
        { label: "alugar um carro", replacement: "Can we rent a car?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "O carro quebrou no meio da estrada. / na cidade / no estacionamento",
      options: [
        { label: "na estrada", replacement: "The car broke down on the highway." },
        { label: "na cidade", replacement: "The car broke down in the city." },
        { label: "no estacionamento", replacement: "The car broke down in the parking lot." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você tem habilitação? / seguro / GPS",
      options: [
        { label: "habilitação", replacement: "Do you have a driver's license?" },
        { label: "seguro", replacement: "Do you have insurance?" },
        { label: "GPS", replacement: "Do you have a GPS?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Não dirija tão rápido! / perto / devagar",
      options: [
        { label: "rápido", replacement: "Don't drive so fast!" },
        { label: "perto", replacement: "Don't drive so close!" },
        { label: "devagar", replacement: "Don't drive so slowly!" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Tem um posto de gasolina perto daqui? / oficina / estacionamento",
      options: [
        { label: "posto de gasolina", replacement: "Is there a gas station near here?" },
        { label: "oficina", replacement: "Is there a mechanic near here?" },
        { label: "estacionamento", replacement: "Is there a parking lot near here?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Tem muitos carros na rua. / motos / ônibus",
      options: [
        { label: "carros", replacement: "There are many cars on the street." },
        { label: "motos", replacement: "There are many motorcycles on the street." },
        { label: "ônibus", replacement: "There are many buses on the street." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Não tem um posto aqui perto. / oficina / lava-rápido",
      options: [
        { label: "posto", replacement: "There isn't a gas station around here." },
        { label: "oficina", replacement: "There isn't a mechanic around here." },
        { label: "lava-rápido", replacement: "There isn't a car wash around here." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Não tem vagas neste estacionamento. / lugares / carros",
      options: [
        { label: "vagas", replacement: "There aren't any parking spots in this lot." },
        { label: "lugares", replacement: "There aren't any places in this lot." },
        { label: "carros", replacement: "There aren't any cars in this lot." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Tem um carro elétrico na sua garagem? / moto / bicicleta",
      options: [
        { label: "carro", replacement: "Is there an electric car in your garage?" },
        { label: "moto", replacement: "Is there a motorcycle in your garage?" },
        { label: "bicicleta", replacement: "Is there a bicycle in your garage?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Quantos carros tem na sua família? / motos / bicicletas",
      options: [
        { label: "carros", replacement: "How many cars are there in your family?" },
        { label: "motos", replacement: "How many motorcycles are there in your family?" },
        { label: "bicicletas", replacement: "How many bicycles are there in your family?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Tem um seguro barato para carros? / motos / caminhões",
      options: [
        { label: "carros", replacement: "Is there cheap insurance for cars?" },
        { label: "motos", replacement: "Is there cheap insurance for motorcycles?" },
        { label: "caminhões", replacement: "Is there cheap insurance for trucks?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Não tem faixa de pedestres nesta rua. / semáforo / placa",
      options: [
        { label: "faixa de pedestres", replacement: "There isn't a crosswalk on this street." },
        { label: "semáforo", replacement: "There isn't a traffic light on this street." },
        { label: "placa", replacement: "There isn't a sign on this street." }
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

  // Dados para a seção "Speak Like a Native"
  const usefulPhrasesData = [
    {
      en: "Watch out! There's a car coming.",
      pt: "Cuidado! Tem um carro vindo.",
      highlight: ["Watch", "car", "coming"]
    },
    {
      en: "Can you give me a ride to the airport?",
      pt: "Você pode me dar uma carona até o aeroporto?",
      highlight: ["give", "ride", "airport"]
    },
    {
      en: "My car broke down on the highway.",
      pt: "Meu carro quebrou na estrada.",
      highlight: ["broke", "down", "highway"]
    },
    {
      en: "Don't forget to put on your seatbelt.",
      pt: "Não esqueça de colocar o cinto de segurança.",
      highlight: ["seatbelt", "put", "on"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-gray-950 bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-purple-800/40">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-300 mb-6">🚗 Car Lesson – Driving & Vehicles</h1>
          <SpeakSentence text="Learn to talk about cars, driving, and transportation in English." className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about cars, driving, and transportation in English.
          </SpeakSentence>
          
          {/* MAIN IMAGE - LARGE RECTANGULAR */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <img
              src={mainImage}
              alt="Car lesson main image"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-2xl cursor-pointer border border-purple-700/30"
            />
          </div>

          {/* OPEN-ENDED QUESTION */}
          <div className="max-w-3xl mx-auto">
            <OpenEndedQuestion
              question="What kind of car do you drive? Describe it!"
              hint="Talk about the brand, color, size, and what you like about it."
              sampleAnswer="I drive a small white hatchback. It's very economical and easy to park in the city. I love it because it's reliable and has good fuel efficiency."
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-fuchsia-600 hover:to-purple-800"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-purple-300 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-purple-200 space-y-2 mb-6">
              <li><SpeakText text="to drive" className="text-purple-300 font-bold">to drive</SpeakText> = dirigir</li>
              <li><SpeakText text="to park" className="text-purple-300 font-bold">to park</SpeakText> = estacionar</li>
              <li><SpeakText text="to brake" className="text-purple-300 font-bold">to brake</SpeakText> = frear</li>
              <li><SpeakText text="to start" className="text-purple-300 font-bold">to start</SpeakText> = ligar</li>
            </ul>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="Do you prefer driving an automatic or a manual car? Why?"
                hint="Use the verb 'to drive' and give your opinion."
                sampleAnswer="I prefer driving an automatic car because it's much easier in heavy traffic. I don't have to worry about changing gears all the time."
              />
            </div>

            {openDrills.verbs && (
              <div className="mt-4 bg-purple-900/20 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-fuchsia-600 hover:to-purple-800"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-purple-300 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "steering wheel", pt: "volante" },
                { en: "brake", pt: "freio" },
                { en: "tire", pt: "pneu" },
                { en: "engine", pt: "motor" },
                { en: "headlight", pt: "farol" },
                { en: "seatbelt", pt: "cinto de segurança" },
                { en: "rearview mirror", pt: "retrovisor" },
                { en: "gas station", pt: "posto de gasolina" },
                { en: "parking lot", pt: "estacionamento" },
                { en: "driver's license", pt: "carteira de motorista" },
                { en: "insurance", pt: "seguro" },
                { en: "highway", pt: "estrada" },
                { en: "traffic light", pt: "semáforo" },
                { en: "crosswalk", pt: "faixa de pedestres" },
              ].map((word, idx) => (
                <div key={idx} className="bg-purple-900/30 p-3 rounded-lg border border-purple-600/50">
                  <SpeakText text={word.en} className="text-purple-200 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-purple-300 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {/* LARGE CAR LESSON IMAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={carLessonImage}
                  alt="Car lesson illustration 1"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl border border-purple-700/30 hover:shadow-2xl transition-shadow"
                />
              </div>
              <div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={carLesson2Image}
                  alt="Car lesson illustration 2"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl border border-purple-700/30 hover:shadow-2xl transition-shadow"
                />
              </div>
            </div>
            <p className="text-center text-sm text-purple-400 mb-4">👆 Clique nas imagens para ampliar</p>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="What are the most important safety features in a car?"
                hint="Use words like 'seatbelt', 'brake', 'headlight', and 'rearview mirror'."
                sampleAnswer="I think the most important safety features are the seatbelt and the brakes. The seatbelt protects you in an accident, and good brakes help you stop quickly. Headlights are also essential for driving at night."
              />
            </div>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-purple-900/20 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-fuchsia-600 hover:to-purple-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for driving and transportation" className="text-md text-purple-300 mb-4 italic">
              💬 Practice common phrases for driving and transportation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrasesData.map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  highlightWords={item.highlight}
                  translation={item.pt}
                />
              ))}
            </div>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="Have you ever had a car breakdown? What happened?"
                hint="Tell a short story using past tense and vocabulary like 'highway', 'mechanic', and 'broke down'."
                sampleAnswer="Yes, last year my car broke down on the highway. I heard a strange noise and then the engine stopped. I called a mechanic and waited for two hours. It was an expensive repair!"
              />
            </div>

            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-purple-900/20 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-fuchsia-600 hover:to-purple-800"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Structures for talking about existence and location" className="text-md text-purple-300 mb-4 italic">
              📚 Structures for talking about existence and location
            </SpeakSentence>

            <div className="bg-purple-900/20 p-4 rounded-[20px] text-purple-200 space-y-3 mb-6">
              {[
                { en: "There is a gas station near the highway.", pt: "Tem um posto de gasolina perto da estrada." },
                { en: "There are many cars in the parking lot.", pt: "Tem muitos carros no estacionamento." },
                { en: "There isn't a mechanic in this small town.", pt: "Não tem um mecânico nesta cidade pequena." },
                { en: "There aren't any electric cars in this dealership.", pt: "Não tem carros elétricos nesta concessionária." },
                { en: "Is there a car wash near here?", pt: "Tem um lava-rápido aqui perto?" },
                { en: "How many parking spots are there in this mall?", pt: "Quantas vagas de estacionamento tem neste shopping?" },
                { en: "There is a traffic light on the corner.", pt: "Tem um semáforo na esquina." },
                { en: "There aren't any crosswalks on this street.", pt: "Não tem faixas de pedestres nesta rua." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-800/80 rounded-lg">
                  <SpeakSentence text={item.en} className="text-purple-200 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-purple-300 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="Describe the traffic and transportation in your city."
                hint="Use 'There is', 'There are', and vocabulary like 'traffic light', 'highway', and 'parking lot'."
                sampleAnswer="In my city, there are many cars and buses on the streets. There is a big highway that connects the city to the airport, but there aren't enough parking lots downtown. The traffic is very heavy during rush hour."
              />
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-purple-900/20 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-purple-200">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-purple-900/20 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "Move this car to the left, please.", pt: "Mova este carro para a esquerda, por favor." },
                    { en: "Don't park the dirty car here, please.", pt: "Não estacione o carro sujo aqui, por favor." },
                    { en: "Let's drive to the beach this weekend.", pt: "Vamos dirigir até a praia neste fim de semana." },
                    { en: "Put the luggage in the trunk, please.", pt: "Coloque a bagagem no porta-malas, por favor." },
                    { en: "Your car is so clean. Mine is really messy!", pt: "Seu carro é tão limpo. O meu é muito bagunçado!" },
                    { en: "What a mess! I need to clean up this garage.", pt: "Que bagunça! Eu preciso limpar esta garagem." },
                    { en: "Why do you need to buy a new car?", pt: "Por que você precisa comprar um carro novo?" },
                    { en: "My husband wants to put a new stereo in our car.", pt: "Meu marido quer colocar um som novo no nosso carro." },
                    { en: "The GPS on the dashboard is broken.", pt: "O GPS no painel está quebrado." },
                    { en: "Is there a vegan restaurant near the gas station?", pt: "Tem algum restaurante vegano perto do posto de gasolina?" },
                    { en: "There are some good car dealerships in this area.", pt: "Tem algumas concessionárias boas nesta área." },
                  ].map((s, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium text-purple-100">
                          {idx+1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-purple-300 mt-0.5 ml-6">{s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-gray-800 rounded-2xl p-4 shadow-md h-full border border-purple-700/30">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="Car maintenance" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Car maintenance</p>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-4 shadow-md h-full border border-purple-700/30">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Road trip" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Road trip adventures</p>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-4 shadow-md h-full border border-purple-700/30">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Modern driving tech" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Modern driving technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-gray-900 border-2 border-purple-700/60 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-800 to-fuchsia-800 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-purple-200 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-950 text-white flex-1 p-6 space-y-4 text-lg border-r border-purple-800/40">
              <h3 className="font-bold text-lg mb-4 text-purple-300">KEY EXPRESSIONS</h3>
              {[
                { en: "I want to buy a new car.", pt: "Quero comprar um carro novo." },
                { en: "dirty car", pt: "carro sujo" },
                { en: "There is no problem.", pt: "Não há problema." },
                { en: "Let's park the car here.", pt: "Vamos estacionar o carro aqui." },
                { en: "tidy garage", pt: "garagem arrumada" },
                { en: "Is there a gas station nearby?", pt: "Tem um posto de gasolina perto?" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-purple-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-purple-300 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-purple-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-purple-200">
                    <li>Use <strong className="text-white">"There is"</strong> for singular and <strong className="text-white">"There are"</strong> for plural.</li>
                    <li><strong className="text-white">"Park"</strong> can mean to leave a car in a spot or a green public space.</li>
                    <li><strong className="text-white">"Drive"</strong> can be a verb or a noun ("a long drive").</li>
                    <li>Use <strong className="text-white">"next to"</strong> to describe proximity between vehicles.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-purple-800/40">
                  <h4 className="font-bold text-purple-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-purple-200">"Watch out!" is a common exclamation to warn about danger on the road.</p>
                </div>
                <div className="pt-4 border-t border-purple-800/40">
                  <p className="text-purple-300 text-sm italic">
                    🌟 <strong>Substitute the words in purple</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson60")} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (60)
          </button>
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (62) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL FOR ENLARGING CAR LESSON IMAGES ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={carLessonImage}
              alt="Car lesson illustration – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-purple-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL FOR ENLARGING MAIN IMAGE ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Main car lesson image – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-purple-300 transition-colors"
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