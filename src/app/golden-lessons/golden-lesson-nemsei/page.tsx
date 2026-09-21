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
// MAIN COMPONENT – MACHINE & VEHICLE SAFETY (DARK MODE)
// ============================================
export default function MachineAndVehicleSafetyDarkMode() {
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
  const mainImage = "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const safetyImage1 = "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const safetyImage2 = "https://images.pexels.com/photos/3862365/pexels-photo-3862365.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO – MACHINE & VEHICLE SAFETY
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu verifico. / ela / nós",
      options: [
        { label: "Eu", replacement: "I check." },
        { label: "Ela", replacement: "She checks." },
        { label: "Nós", replacement: "We check." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você inspeciona. / eles / nós",
      options: [
        { label: "Você", replacement: "You inspect." },
        { label: "Eles", replacement: "They inspect." },
        { label: "Nós", replacement: "We inspect." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele monitora. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He monitors." },
        { label: "Ela", replacement: "She monitors." },
        { label: "Vocês", replacement: "You monitor." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero prevenir. / nós / eles",
      options: [
        { label: "Eu", replacement: "I want to prevent." },
        { label: "Nós", replacement: "We want to prevent." },
        { label: "Eles", replacement: "They want to prevent." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela detecta o problema. / ele / eu",
      options: [
        { label: "Ela", replacement: "She detects the problem." },
        { label: "Ele", replacement: "He detects the problem." },
        { label: "Eu", replacement: "I detect the problem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Nós evitamos acidentes. / eles / eu",
      options: [
        { label: "Nós", replacement: "We avoid accidents." },
        { label: "Eles", replacement: "They avoid accidents." },
        { label: "Eu", replacement: "I avoid accidents." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "O sensor está funcionando. / quebrado / desligado",
      options: [
        { label: "funcionando", replacement: "The sensor is working." },
        { label: "quebrado", replacement: "The sensor is broken." },
        { label: "desligado", replacement: "The sensor is off." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Precisamos de manutenção preditiva. / corretiva / preventiva",
      options: [
        { label: "preditiva", replacement: "We need predictive maintenance." },
        { label: "corretiva", replacement: "We need corrective maintenance." },
        { label: "preventiva", replacement: "We need preventive maintenance." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Os freios estão gastos. / novos / perigosos",
      options: [
        { label: "gastos", replacement: "The brakes are worn out." },
        { label: "novos", replacement: "The brakes are new." },
        { label: "perigosos", replacement: "The brakes are dangerous." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Vamos verificar o sistema elétrico. / hidráulico / mecânico",
      options: [
        { label: "elétrico", replacement: "Let's check the electrical system." },
        { label: "hidráulico", replacement: "Let's check the hydraulic system." },
        { label: "mecânico", replacement: "Let's check the mechanical system." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O alarme está tocando. / sensor / painel",
      options: [
        { label: "alarme", replacement: "The alarm is ringing." },
        { label: "sensor", replacement: "The sensor is beeping." },
        { label: "painel", replacement: "The panel is flashing." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não uso equipamento de proteção. / capacete / luvas",
      options: [
        { label: "equipamento de proteção", replacement: "I don't use protective equipment." },
        { label: "capacete", replacement: "I don't use a helmet." },
        { label: "luvas", replacement: "I don't use gloves." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Esta máquina é muito perigosa. / pesada / antiga",
      options: [
        { label: "perigosa", replacement: "This machine is very dangerous." },
        { label: "pesada", replacement: "This machine is very heavy." },
        { label: "antiga", replacement: "This machine is very old." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Por favor, use o cinto de segurança. / capacete / colete",
      options: [
        { label: "cinto de segurança", replacement: "Please, use the seatbelt." },
        { label: "capacete", replacement: "Please, use the helmet." },
        { label: "colete", replacement: "Please, use the safety vest." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Vamos revisar os procedimentos operacionais. / manuais / de segurança",
      options: [
        { label: "operacionais", replacement: "Let's review the operational procedures." },
        { label: "manuais", replacement: "Let's review the manuals." },
        { label: "de segurança", replacement: "Let's review the safety procedures." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela quer comprar um veículo autônomo. / elétrico / híbrido",
      options: [
        { label: "autônomo", replacement: "She wants to buy an autonomous vehicle." },
        { label: "elétrico", replacement: "She wants to buy an electric vehicle." },
        { label: "híbrido", replacement: "She wants to buy a hybrid vehicle." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Cuidado! A máquina está ligada. / o motor / o sistema",
      options: [
        { label: "máquina", replacement: "Watch out! The machine is on." },
        { label: "motor", replacement: "Watch out! The engine is on." },
        { label: "sistema", replacement: "Watch out! The system is on." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Podemos evitar este acidente? / problema / risco",
      options: [
        { label: "acidente", replacement: "Can we avoid this accident?" },
        { label: "problema", replacement: "Can we avoid this problem?" },
        { label: "risco", replacement: "Can we avoid this risk?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "O sensor detectou uma falha no motor. / no sistema / no freio",
      options: [
        { label: "motor", replacement: "The sensor detected a failure in the engine." },
        { label: "sistema", replacement: "The sensor detected a failure in the system." },
        { label: "freio", replacement: "The sensor detected a failure in the brake." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você tem treinamento de segurança? / certificado / experiência",
      options: [
        { label: "treinamento", replacement: "Do you have safety training?" },
        { label: "certificado", replacement: "Do you have a safety certificate?" },
        { label: "experiência", replacement: "Do you have safety experience?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Nunca opere esta máquina sem supervisão. / sem treinamento / sozinho",
      options: [
        { label: "sem supervisão", replacement: "Never operate this machine without supervision." },
        { label: "sem treinamento", replacement: "Never operate this machine without training." },
        { label: "sozinho", replacement: "Never operate this machine alone." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Desligue o equipamento antes de limpá-lo. / consertá-lo / inspecioná-lo",
      options: [
        { label: "limpá-lo", replacement: "Turn off the equipment before cleaning it." },
        { label: "consertá-lo", replacement: "Turn off the equipment before repairing it." },
        { label: "inspecioná-lo", replacement: "Turn off the equipment before inspecting it." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Tem um extintor de incêndio perto daqui? / alarme / sensor",
      options: [
        { label: "extintor de incêndio", replacement: "Is there a fire extinguisher near here?" },
        { label: "alarme", replacement: "Is there an alarm near here?" },
        { label: "sensor", replacement: "Is there a sensor near here?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Tem muitos sensores nesta máquina. / botões / cabos",
      options: [
        { label: "sensores", replacement: "There are many sensors on this machine." },
        { label: "botões", replacement: "There are many buttons on this machine." },
        { label: "cabos", replacement: "There are many cables on this machine." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Não tem um técnico disponível agora. / engenheiro / supervisor",
      options: [
        { label: "técnico", replacement: "There isn't a technician available now." },
        { label: "engenheiro", replacement: "There isn't an engineer available now." },
        { label: "supervisor", replacement: "There isn't a supervisor available now." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Não tem procedimentos de segurança nesta área. / regras / sinais",
      options: [
        { label: "procedimentos", replacement: "There aren't safety procedures in this area." },
        { label: "regras", replacement: "There aren't safety rules in this area." },
        { label: "sinais", replacement: "There aren't safety signs in this area." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Tem um veículo autônomo na sua empresa? / robô / drone",
      options: [
        { label: "veículo autônomo", replacement: "Is there an autonomous vehicle in your company?" },
        { label: "robô", replacement: "Is there a robot in your company?" },
        { label: "drone", replacement: "Is there a drone in your company?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Quantos sensores tem neste equipamento? / câmeras / alarmes",
      options: [
        { label: "sensores", replacement: "How many sensors are there on this equipment?" },
        { label: "câmeras", replacement: "How many cameras are there on this equipment?" },
        { label: "alarmes", replacement: "How many alarms are there on this equipment?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Tem um programa de manutenção preditiva? / preventiva / corretiva",
      options: [
        { label: "preditiva", replacement: "Is there a predictive maintenance program?" },
        { label: "preventiva", replacement: "Is there a preventive maintenance program?" },
        { label: "corretiva", replacement: "Is there a corrective maintenance program?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Não tem saída de emergência nesta fábrica. / porta / escada",
      options: [
        { label: "saída de emergência", replacement: "There isn't an emergency exit in this factory." },
        { label: "porta", replacement: "There isn't an emergency door in this factory." },
        { label: "escada", replacement: "There isn't an emergency staircase in this factory." }
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
      en: "Watch out! The machine is still running.",
      pt: "Cuidado! A máquina ainda está funcionando.",
      highlight: ["Watch", "machine", "running"]
    },
    {
      en: "The sensor detected a problem in the engine.",
      pt: "O sensor detectou um problema no motor.",
      highlight: ["sensor", "detected", "engine"]
    },
    {
      en: "Always wear protective equipment in this area.",
      pt: "Sempre use equipamento de proteção nesta área.",
      highlight: ["protective", "equipment", "area"]
    },
    {
      en: "Predictive maintenance helps us avoid accidents.",
      pt: "A manutenção preditiva nos ajuda a evitar acidentes.",
      highlight: ["Predictive", "maintenance", "accidents"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-gray-950 bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-purple-800/40">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-purple-300 mb-6">🛡️ Machine & Vehicle Safety</h1>
          <SpeakSentence text="Learn to talk about safety, sensors, and predictive maintenance in English." className="text-xl text-purple-200 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about safety, sensors, and predictive maintenance in English.
          </SpeakSentence>
          
          {/* MAIN IMAGE - LARGE RECTANGULAR */}
          <div className="w-full max-w-4xl mx-auto mb-8">
            <img
              src={mainImage}
              alt="Machine and vehicle safety main image"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-2xl cursor-pointer border border-purple-700/30"
            />
          </div>

          {/* OPEN-ENDED QUESTION */}
          <div className="max-w-3xl mx-auto">
            <OpenEndedQuestion
              question="Why is safety important in factories and on the road?"
              hint="Talk about protecting workers, avoiding accidents, and following procedures."
              sampleAnswer="Safety is important because it protects workers and drivers from accidents. In factories, machines can be dangerous, so we need sensors and protective equipment. On the road, seatbelts and good brakes save lives."
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
              <li><SpeakText text="to check" className="text-purple-300 font-bold">to check</SpeakText> = verificar</li>
              <li><SpeakText text="to inspect" className="text-purple-300 font-bold">to inspect</SpeakText> = inspecionar</li>
              <li><SpeakText text="to monitor" className="text-purple-300 font-bold">to monitor</SpeakText> = monitorar</li>
              <li><SpeakText text="to prevent" className="text-purple-300 font-bold">to prevent</SpeakText> = prevenir</li>
              <li><SpeakText text="to detect" className="text-purple-300 font-bold">to detect</SpeakText> = detectar</li>
              <li><SpeakText text="to avoid" className="text-purple-300 font-bold">to avoid</SpeakText> = evitar</li>
            </ul>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="What do you do to check your car before a long trip?"
                hint="Use verbs like 'to check', 'to inspect', and 'to monitor'."
                sampleAnswer="Before a long trip, I always check the tires, the oil, and the brakes. I also inspect the lights and monitor the engine temperature while driving. It's important to avoid problems on the road."
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
                { en: "sensor", pt: "sensor" },
                { en: "maintenance", pt: "manutenção" },
                { en: "predictive", pt: "preditiva" },
                { en: "preventive", pt: "preventiva" },
                { en: "accident", pt: "acidente" },
                { en: "risk", pt: "risco" },
                { en: "safety", pt: "segurança" },
                { en: "equipment", pt: "equipamento" },
                { en: "helmet", pt: "capacete" },
                { en: "gloves", pt: "luvas" },
                { en: "procedure", pt: "procedimento" },
                { en: "training", pt: "treinamento" },
                { en: "autonomous", pt: "autônomo" },
                { en: "emergency", pt: "emergência" },
                { en: "extinguisher", pt: "extintor" },
              ].map((word, idx) => (
                <div key={idx} className="bg-purple-900/30 p-3 rounded-lg border border-purple-600/50">
                  <SpeakText text={word.en} className="text-purple-200 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-purple-300 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {/* LARGE SAFETY IMAGES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={safetyImage1}
                  alt="Safety illustration 1"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl border border-purple-700/30 hover:shadow-2xl transition-shadow"
                />
              </div>
              <div className="cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                <img
                  src={safetyImage2}
                  alt="Safety illustration 2"
                  className="w-full h-auto object-contain rounded-2xl shadow-xl border border-purple-700/30 hover:shadow-2xl transition-shadow"
                />
              </div>
            </div>
            <p className="text-center text-sm text-purple-400 mb-4">👆 Clique nas imagens para ampliar</p>

            {/* OPEN-ENDED QUESTION */}
            <div className="mb-6">
              <OpenEndedQuestion
                question="What safety equipment do you use at work or when driving?"
                hint="Use words like 'helmet', 'gloves', 'seatbelt', and 'protective equipment'."
                sampleAnswer="At work, I always use a helmet and protective gloves. When I drive, I put on my seatbelt and check the mirrors. Safety equipment is essential to prevent accidents."
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
            <SpeakSentence text="Practice common phrases for safety and maintenance" className="text-md text-purple-300 mb-4 italic">
              💬 Practice common phrases for safety and maintenance
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
                question="Have you ever seen a workplace accident? What happened?"
                hint="Tell a short story using past tense and words like 'sensor', 'machine', and 'prevent'."
                sampleAnswer="Yes, I saw an accident in a factory once. A worker was too close to a machine when it started. Luckily, a sensor detected the problem and stopped the machine. After that, we received more safety training to prevent future accidents."
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
                { en: "There is a fire extinguisher near the entrance.", pt: "Tem um extintor de incêndio perto da entrada." },
                { en: "There are many sensors on this machine.", pt: "Tem muitos sensores nesta máquina." },
                { en: "There isn't a technician in this area.", pt: "Não tem um técnico nesta área." },
                { en: "There aren't any safety signs on this wall.", pt: "Não tem placas de segurança nesta parede." },
                { en: "Is there an emergency exit in this building?", pt: "Tem uma saída de emergência neste prédio?" },
                { en: "How many cameras are there in this factory?", pt: "Quantas câmeras tem nesta fábrica?" },
                { en: "There is a predictive maintenance program in our company.", pt: "Tem um programa de manutenção preditiva na nossa empresa." },
                { en: "There aren't any autonomous vehicles in this plant.", pt: "Não tem veículos autônomos nesta planta." },
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
                question="Describe the safety systems in a place you know (factory, school, or city)."
                hint="Use 'There is', 'There are', and vocabulary like 'sensor', 'alarm', and 'emergency exit'."
                sampleAnswer="In my factory, there are many sensors on the machines. There is an alarm system and a fire extinguisher near every exit. There are also safety signs on the walls, but there aren't enough emergency exits. We are working to improve that."
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
                    { en: "Always check the machine before starting it.", pt: "Sempre verifique a máquina antes de ligá-la." },
                    { en: "Don't touch the equipment without gloves.", pt: "Não toque no equipamento sem luvas." },
                    { en: "Let's inspect the electrical system this morning.", pt: "Vamos inspecionar o sistema elétrico esta manhã." },
                    { en: "Put on your helmet before entering the area.", pt: "Coloque seu capacete antes de entrar na área." },
                    { en: "The sensor detected a problem in the engine.", pt: "O sensor detectou um problema no motor." },
                    { en: "What a risk! We need to fix this immediately.", pt: "Que risco! Precisamos consertar isso imediatamente." },
                    { en: "Why do you need to monitor the temperature?", pt: "Por que você precisa monitorar a temperatura?" },
                    { en: "My company wants to use predictive maintenance.", pt: "Minha empresa quer usar manutenção preditiva." },
                    { en: "The alarm on the dashboard is broken.", pt: "O alarme no painel está quebrado." },
                    { en: "Is there a fire extinguisher near the entrance?", pt: "Tem um extintor de incêndio perto da entrada?" },
                    { en: "There are some safety procedures in this manual.", pt: "Tem alguns procedimentos de segurança neste manual." },
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
                      <img src={readingImage} alt="Safety inspection" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Safety inspection</p>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-4 shadow-md h-full border border-purple-700/30">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Industrial maintenance" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Industrial maintenance</p>
                  </div>
                  <div className="bg-gray-800 rounded-2xl p-4 shadow-md h-full border border-purple-700/30">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Modern safety technology" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-purple-300 italic">Modern safety technology</p>
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
                { en: "I want to prevent accidents.", pt: "Quero prevenir acidentes." },
                { en: "broken sensor", pt: "sensor quebrado" },
                { en: "There is no risk.", pt: "Não há risco." },
                { en: "Let's check the equipment.", pt: "Vamos verificar o equipamento." },
                { en: "safe procedures", pt: "procedimentos seguros" },
                { en: "Is there a fire extinguisher nearby?", pt: "Tem um extintor de incêndio perto?" },
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
                    <li><strong className="text-white">"Check"</strong> and <strong className="text-white">"inspect"</strong> are similar, but "inspect" is more formal.</li>
                    <li><strong className="text-white">"Monitor"</strong> means to watch something over time.</li>
                    <li>Use <strong className="text-white">"prevent"</strong> to talk about avoiding accidents before they happen.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-purple-800/40">
                  <h4 className="font-bold text-purple-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-purple-200">"Watch out!" is a common exclamation to warn about danger at work or on the road.</p>
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

      {/* ===== MODAL FOR ENLARGING SAFETY IMAGES ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={safetyImage1}
              alt="Safety illustration – enlarged"
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
              alt="Main safety image – enlarged"
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