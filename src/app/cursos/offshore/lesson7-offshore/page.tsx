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
// SUBSTITUTION EXERCISE COMPONENT WITH EYE + TRANSLATION TOGGLE
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
  const [showTranslation, setShowTranslation] = useState(false);

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

  const toggleTranslation = () => {
    setShowTranslation(prev => !prev);
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
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentPt && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-bold"
              title="Mostrar/esconder tradução"
            >
              {showTranslation ? "🇧🇷 Ocultar" : "🇧🇷 Ver tradução"}
            </button>
          )}
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
          >
            {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-green-700 font-medium" />
          {showTranslation && currentPt && (
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM VERDE
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
// MAIN COMPONENT – LESSON 7 HSE
// ============================================
export default function Lesson7HSE() {
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

  const mainImage = "https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=800";
  const grammarImage = "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=800";
  const readingImage = "https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
  const placesImage = "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
  const digitalImage = "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu protejo os trabalhadores. / ela / nós",
      options: [
        { label: "Eu", replacement: "I protect the workers.", pt: "Eu protejo os trabalhadores." },
        { label: "Ela", replacement: "She protects the workers.", pt: "Ela protege os trabalhadores." },
        { label: "Nós", replacement: "We protect the workers.", pt: "Nós protegemos os trabalhadores." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu previno acidentes. / ele / eles",
      options: [
        { label: "Eu", replacement: "I prevent accidents.", pt: "Eu previno acidentes." },
        { label: "Ele", replacement: "He prevents accidents.", pt: "Ele previne acidentes." },
        { label: "Eles", replacement: "They prevent accidents.", pt: "Eles previnem acidentes." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu inspeciono os extintores. / ela / nós",
      options: [
        { label: "Eu", replacement: "I inspect the fire extinguishers.", pt: "Eu inspeciono os extintores." },
        { label: "Ela", replacement: "She inspects the fire extinguishers.", pt: "Ela inspeciona os extintores." },
        { label: "Nós", replacement: "We inspect the fire extinguishers.", pt: "Nós inspecionamos os extintores." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu reporto perigos ao supervisor. / ele / eles",
      options: [
        { label: "Eu", replacement: "I report hazards to the supervisor.", pt: "Eu reporto perigos ao supervisor." },
        { label: "Ele", replacement: "He reports hazards to the supervisor.", pt: "Ele reporta perigos ao supervisor." },
        { label: "Eles", replacement: "They report hazards to the supervisor.", pt: "Eles reportam perigos ao supervisor." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu uso meu capacete de segurança. / ela / nós",
      options: [
        { label: "Eu", replacement: "I wear my safety helmet.", pt: "Eu uso meu capacete de segurança." },
        { label: "Ela", replacement: "She wears her safety helmet.", pt: "Ela usa seu capacete de segurança." },
        { label: "Nós", replacement: "We wear our safety helmets.", pt: "Nós usamos nossos capacetes de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu sigo os procedimentos de segurança. / ele / eles",
      options: [
        { label: "Eu", replacement: "I follow the safety procedures.", pt: "Eu sigo os procedimentos de segurança." },
        { label: "Ele", replacement: "He follows the safety procedures.", pt: "Ele segue os procedimentos de segurança." },
        { label: "Eles", replacement: "They follow the safety procedures.", pt: "Eles seguem os procedimentos de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu garanto um local de trabalho seguro. / ela / nós",
      options: [
        { label: "Eu", replacement: "I ensure a safe workplace.", pt: "Eu garanto um local de trabalho seguro." },
        { label: "Ela", replacement: "She ensures a safe workplace.", pt: "Ela garante um local de trabalho seguro." },
        { label: "Nós", replacement: "We ensure a safe workplace.", pt: "Nós garantimos um local de trabalho seguro." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu uso meu capacete de segurança todos os dias. / óculos / luvas",
      options: [
        { label: "capacete", replacement: "I wear my safety helmet every day.", pt: "Eu uso meu capacete de segurança todos os dias." },
        { label: "óculos", replacement: "I wear my safety goggles every day.", pt: "Eu uso meus óculos de segurança todos os dias." },
        { label: "luvas", replacement: "I wear my safety gloves every day.", pt: "Eu uso minhas luvas de segurança todos os dias." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "O extintor de incêndio foi inspecionado. / kit de primeiros socorros / saída de emergência",
      options: [
        { label: "extintor", replacement: "The fire extinguisher was inspected.", pt: "O extintor de incêndio foi inspecionado." },
        { label: "kit", replacement: "The first aid kit was inspected.", pt: "O kit de primeiros socorros foi inspecionado." },
        { label: "saída", replacement: "The emergency exit was inspected.", pt: "A saída de emergência foi inspecionada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "O perigo foi reportado ao supervisor. / incidente / risco",
      options: [
        { label: "perigo", replacement: "The hazard was reported to the supervisor.", pt: "O perigo foi reportado ao supervisor." },
        { label: "incidente", replacement: "The incident was reported to the supervisor.", pt: "O incidente foi reportado ao supervisor." },
        { label: "risco", replacement: "The risk was reported to the supervisor.", pt: "O risco foi reportado ao supervisor." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Nós participamos do treinamento de segurança. / da avaliação de risco",
      options: [
        { label: "treinamento", replacement: "We attended the safety training.", pt: "Nós participamos do treinamento de segurança." },
        { label: "avaliação", replacement: "We attended the risk assessment.", pt: "Nós participamos da avaliação de risco." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Todo trabalhador deve usar EPI. / capacete / botas",
      options: [
        { label: "EPI", replacement: "Every worker must wear PPE.", pt: "Todo trabalhador deve usar EPI." },
        { label: "capacete", replacement: "Every worker must wear a helmet.", pt: "Todo trabalhador deve usar capacete." },
        { label: "botas", replacement: "Every worker must wear safety boots.", pt: "Todo trabalhador deve usar botas de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "A avaliação de risco foi concluída. / a inspeção / a auditoria",
      options: [
        { label: "avaliação", replacement: "The risk assessment was completed.", pt: "A avaliação de risco foi concluída." },
        { label: "inspeção", replacement: "The inspection was completed.", pt: "A inspeção foi concluída." },
        { label: "auditoria", replacement: "The audit was completed.", pt: "A auditoria foi concluída." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "A saída de emergência estava desobstruída. / o corredor / a escada",
      options: [
        { label: "saída", replacement: "The emergency exit was clear.", pt: "A saída de emergência estava desobstruída." },
        { label: "corredor", replacement: "The corridor was clear.", pt: "O corredor estava desobstruído." },
        { label: "escada", replacement: "The staircase was clear.", pt: "A escada estava desobstruída." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ele usou óculos de segurança durante o experimento. / luvas / botas",
      options: [
        { label: "óculos", replacement: "He wore safety goggles during the experiment.", pt: "Ele usou óculos de segurança durante o experimento." },
        { label: "luvas", replacement: "He wore safety gloves during the experiment.", pt: "Ele usou luvas de segurança durante o experimento." },
        { label: "botas", replacement: "He wore safety boots during the experiment.", pt: "Ele usou botas de segurança durante o experimento." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu tenho cinco anos de experiência em HSE. / três anos / dez anos",
      options: [
        { label: "cinco anos", replacement: "I have five years of experience in HSE.", pt: "Eu tenho cinco anos de experiência em HSE." },
        { label: "três anos", replacement: "I have three years of experience in HSE.", pt: "Eu tenho três anos de experiência em HSE." },
        { label: "dez anos", replacement: "I have ten years of experience in HSE.", pt: "Eu tenho dez anos de experiência em HSE." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu paro imediatamente a atividade insegura. / reporto / documento",
      options: [
        { label: "paro", replacement: "I immediately stop the unsafe activity.", pt: "Eu paro imediatamente a atividade insegura." },
        { label: "reporto", replacement: "I immediately report the unsafe activity.", pt: "Eu reporto imediatamente a atividade insegura." },
        { label: "documento", replacement: "I immediately document the unsafe activity.", pt: "Eu documento imediatamente a atividade insegura." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu identifico perigos, avalio riscos e implemento controles. / monitoro / reviso",
      options: [
        { label: "implemento", replacement: "I identify hazards, evaluate risks, and implement controls.", pt: "Eu identifico perigos, avalio riscos e implemento controles." },
        { label: "monitoro", replacement: "I identify hazards, evaluate risks, and monitor controls.", pt: "Eu identifico perigos, avalio riscos e monitoro controles." },
        { label: "reviso", replacement: "I identify hazards, evaluate risks, and review controls.", pt: "Eu identifico perigos, avalio riscos e reviso controles." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu incentivo o relato de quase acidentes. / perigos / incidentes",
      options: [
        { label: "quase acidentes", replacement: "I encourage reporting near misses.", pt: "Eu incentivo o relato de quase acidentes." },
        { label: "perigos", replacement: "I encourage reporting hazards.", pt: "Eu incentivo o relato de perigos." },
        { label: "incidentes", replacement: "I encourage reporting incidents.", pt: "Eu incentivo o relato de incidentes." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "A segurança começa com consciência e comunicação. / treinamento / responsabilidade",
      options: [
        { label: "comunicação", replacement: "Safety starts with awareness and communication.", pt: "A segurança começa com consciência e comunicação." },
        { label: "treinamento", replacement: "Safety starts with awareness and training.", pt: "A segurança começa com consciência e treinamento." },
        { label: "responsabilidade", replacement: "Safety starts with awareness and responsibility.", pt: "A segurança começa com consciência e responsabilidade." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu implementei um novo sistema de sinalização de segurança. / treinamento / auditoria",
      options: [
        { label: "sinalização", replacement: "I implemented a new safety signage system.", pt: "Eu implementei um novo sistema de sinalização de segurança." },
        { label: "treinamento", replacement: "I implemented a new safety training system.", pt: "Eu implementei um novo sistema de treinamento de segurança." },
        { label: "auditoria", replacement: "I implemented a new safety audit system.", pt: "Eu implementei um novo sistema de auditoria de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Eu conduzo auditorias regulares de segurança. / inspeções / treinamentos",
      options: [
        { label: "auditorias", replacement: "I conduct regular safety audits.", pt: "Eu conduzo auditorias regulares de segurança." },
        { label: "inspeções", replacement: "I conduct regular safety inspections.", pt: "Eu conduzo inspeções regulares de segurança." },
        { label: "treinamentos", replacement: "I conduct regular safety training sessions.", pt: "Eu conduzo treinamentos regulares de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Eu mantenho a calma e sigo os procedimentos de emergência. / reporto / coordeno",
      options: [
        { label: "sigo", replacement: "I stay calm and follow emergency procedures.", pt: "Eu mantenho a calma e sigo os procedimentos de emergência." },
        { label: "reporto", replacement: "I stay calm and report emergency procedures.", pt: "Eu mantenho a calma e reporto os procedimentos de emergência." },
        { label: "coordeno", replacement: "I stay calm and coordinate emergency procedures.", pt: "Eu mantenho a calma e coordeno os procedimentos de emergência." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu inspecionei o extintor de incêndio ontem. / kit de primeiros socorros / saída de emergência",
      options: [
        { label: "extintor", replacement: "I inspected the fire extinguisher yesterday.", pt: "Eu inspecionei o extintor de incêndio ontem." },
        { label: "kit", replacement: "I inspected the first aid kit yesterday.", pt: "Eu inspecionei o kit de primeiros socorros ontem." },
        { label: "saída", replacement: "I inspected the emergency exit yesterday.", pt: "Eu inspecionei a saída de emergência ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eles reportaram o incidente ao oficial de segurança. / perigo / risco",
      options: [
        { label: "incidente", replacement: "They reported the incident to the safety officer.", pt: "Eles reportaram o incidente ao oficial de segurança." },
        { label: "perigo", replacement: "They reported the hazard to the safety officer.", pt: "Eles reportaram o perigo ao oficial de segurança." },
        { label: "risco", replacement: "They reported the risk to the safety officer.", pt: "Eles reportaram o risco ao oficial de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "O trabalhador não usou as luvas de segurança. / capacete / botas",
      options: [
        { label: "luvas", replacement: "The worker did not wear safety gloves.", pt: "O trabalhador não usou as luvas de segurança." },
        { label: "capacete", replacement: "The worker did not wear a safety helmet.", pt: "O trabalhador não usou o capacete de segurança." },
        { label: "botas", replacement: "The worker did not wear safety boots.", pt: "O trabalhador não usou as botas de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você recebeu treinamento de segurança? / treinamento de HSE / treinamento de emergência",
      options: [
        { label: "segurança", replacement: "Did you receive safety training?", pt: "Você recebeu treinamento de segurança?" },
        { label: "HSE", replacement: "Did you receive HSE training?", pt: "Você recebeu treinamento de HSE?" },
        { label: "emergência", replacement: "Did you receive emergency training?", pt: "Você recebeu treinamento de emergência?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eles seguiram os procedimentos de emergência? / protocolos de segurança / regras de HSE",
      options: [
        { label: "procedimentos", replacement: "Did they follow the emergency procedures?", pt: "Eles seguiram os procedimentos de emergência?" },
        { label: "protocolos", replacement: "Did they follow the safety protocols?", pt: "Eles seguiram os protocolos de segurança?" },
        { label: "regras", replacement: "Did they follow the HSE rules?", pt: "Eles seguiram as regras de HSE?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Nós não registramos o incidente corretamente. / o acidente / o quase acidente",
      options: [
        { label: "incidente", replacement: "We did not record the incident correctly.", pt: "Nós não registramos o incidente corretamente." },
        { label: "acidente", replacement: "We did not record the accident correctly.", pt: "Nós não registramos o acidente corretamente." },
        { label: "quase acidente", replacement: "We did not record the near miss correctly.", pt: "Nós não registramos o quase acidente corretamente." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ela não verificou o equipamento de segurança. / o extintor / o kit de primeiros socorros",
      options: [
        { label: "equipamento", replacement: "She did not check the safety equipment.", pt: "Ela não verificou o equipamento de segurança." },
        { label: "extintor", replacement: "She did not check the fire extinguisher.", pt: "Ela não verificou o extintor de incêndio." },
        { label: "kit", replacement: "She did not check the first aid kit.", pt: "Ela não verificou o kit de primeiros socorros." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "A saída de emergência não estava claramente sinalizada. / o corredor / a escada",
      options: [
        { label: "saída", replacement: "The emergency exit was not clearly marked.", pt: "A saída de emergência não estava claramente sinalizada." },
        { label: "corredor", replacement: "The corridor was not clearly marked.", pt: "O corredor não estava claramente sinalizado." },
        { label: "escada", replacement: "The staircase was not clearly marked.", pt: "A escada não estava claramente sinalizada." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Nós realizamos a auditoria de segurança? / a inspeção / a avaliação de risco",
      options: [
        { label: "auditoria", replacement: "Did we conduct the safety audit?", pt: "Nós realizamos a auditoria de segurança?" },
        { label: "inspeção", replacement: "Did we conduct the safety inspection?", pt: "Nós realizamos a inspeção de segurança?" },
        { label: "avaliação", replacement: "Did we conduct the risk assessment?", pt: "Nós realizamos a avaliação de risco?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "O funcionário não usou botas de segurança. / capacete / luvas",
      options: [
        { label: "botas", replacement: "The employee did not wear safety boots.", pt: "O funcionário não usou botas de segurança." },
        { label: "capacete", replacement: "The employee did not wear a safety helmet.", pt: "O funcionário não usou capacete de segurança." },
        { label: "luvas", replacement: "The employee did not wear safety gloves.", pt: "O funcionário não usou luvas de segurança." }
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
      en: "Safety first! Always wear your PPE.",
      pt: "Segurança em primeiro lugar! Sempre use seu EPI.",
      green: ["Safety", "PPE"]
    },
    {
      en: "Report hazards immediately to your supervisor.",
      pt: "Reporte perigos imediatamente ao seu supervisor.",
      green: ["Report", "hazards", "supervisor"]
    },
    {
      en: "Follow all safety procedures and protocols.",
      pt: "Siga todos os procedimentos e protocolos de segurança.",
      green: ["Follow", "safety", "procedures"]
    },
    {
      en: "Protect the environment and reduce waste.",
      pt: "Proteja o meio ambiente e reduza o desperdício.",
      green: ["Protect", "environment", "waste"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🛡️ Lesson 7 - Health, Safety & Environment (HSE)</h1>
          <SpeakSentence text="Learn essential vocabulary and phrases for workplace safety, health protocols, and environmental protection." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn essential vocabulary and phrases for workplace safety, health protocols, and environmental protection. 🦺♻️
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Safety helmet and equipment"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS - HSE Actions</h2>
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
              <li><SpeakText text="to protect" className="text-green-600 font-bold">to protect</SpeakText> = proteger 🛡️</li>
              <li><SpeakText text="to prevent" className="text-green-600 font-bold">to prevent</SpeakText> = prevenir ⚠️</li>
              <li><SpeakText text="to inspect" className="text-green-600 font-bold">to inspect</SpeakText> = inspecionar 🔍</li>
              <li><SpeakText text="to report" className="text-green-600 font-bold">to report</SpeakText> = reportar 📋</li>
              <li><SpeakText text="to wear" className="text-green-600 font-bold">to wear</SpeakText> = usar (equipamento) 👷</li>
              <li><SpeakText text="to follow" className="text-green-600 font-bold">to follow</SpeakText> = seguir 📏</li>
              <li><SpeakText text="to ensure" className="text-green-600 font-bold">to ensure</SpeakText> = garantir ✅</li>
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
              <h2 className="text-2xl font-bold">🔹 HSE Vocabulary</h2>
              <PencilIcon onClick={() => openNoteModal('HSE Vocabulary')} />
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
                { en: "safety", pt: "segurança 🦺" },
                { en: "health", pt: "saúde 🏥" },
                { en: "environment", pt: "meio ambiente 🌍" },
                { en: "hazard", pt: "perigo ⚠️" },
                { en: "risk", pt: "risco 📊" },
                { en: "incident", pt: "incidente 🚨" },
                { en: "accident", pt: "acidente 💥" },
                { en: "PPE", pt: "EPI 👷" },
                { en: "safety helmet", pt: "capacete de segurança ⛑️" },
                { en: "safety goggles", pt: "óculos de segurança 🥽" },
                { en: "safety gloves", pt: "luvas de segurança 🧤" },
                { en: "safety boots", pt: "botas de segurança 🥾" },
                { en: "fire extinguisher", pt: "extintor de incêndio 🧯" },
                { en: "first aid kit", pt: "kit de primeiros socorros 🩹" },
                { en: "emergency exit", pt: "saída de emergência 🚪" },
                { en: "safety training", pt: "treinamento de segurança 📚" },
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
            <SpeakSentence text="Practice common HSE phrases and interview questions" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common HSE phrases and interview questions
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Past Tense in HSE Context</h2>
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
            <SpeakSentence text="Learn to use past tense with safety procedures and incidents" className="text-md text-gray-600 mb-4 italic">
              📚 Learn to use past tense with safety procedures and incidents
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Past Tense"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I inspected the fire extinguisher yesterday.", pt: "Eu inspecionei o extintor de incêndio ontem. 🧯" },
                { en: "They reported the incident to the safety officer.", pt: "Eles reportaram o incidente ao oficial de segurança. 📋" },
                { en: "The worker did not wear the safety gloves.", pt: "O trabalhador não usou as luvas de segurança. 🧤" },
                { en: "Did you receive safety training?", pt: "Você recebeu treinamento de segurança? 📚" },
                { en: "Did they follow the emergency procedures?", pt: "Eles seguiram os procedimentos de emergência? 🚨" },
                { en: "We did not record the incident correctly.", pt: "Nós não registramos o incidente corretamente. 📝" },
                { en: "She did not check the safety equipment.", pt: "Ela não verificou o equipamento de segurança. 🔍" },
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
                    { en: "I inspected the fire extinguisher yesterday.", pt: "Eu inspecionei o extintor de incêndio ontem." },
                    { en: "We wore safety helmets on the construction site.", pt: "Nós usamos capacetes de segurança no canteiro de obras." },
                    { en: "The worker reported the hazard to the supervisor.", pt: "O trabalhador reportou o perigo ao supervisor." },
                    { en: "She prevented the accident by acting quickly.", pt: "Ela preveniu o acidente agindo rapidamente." },
                    { en: "We ensured the workplace was safe and clean.", pt: "Nós garantimos que o local de trabalho estava seguro e limpo." },
                    { en: "The emergency exit was clearly marked.", pt: "A saída de emergência estava claramente sinalizada." },
                    { en: "Did you attend the safety training session?", pt: "Você participou da sessão de treinamento de segurança?" },
                    { en: "The first aid kit was fully stocked and ready.", pt: "O kit de primeiros socorros estava completamente abastecido e pronto." },
                    { en: "We followed all safety procedures during the operation.", pt: "Nós seguimos todos os procedimentos de segurança durante a operação." },
                    { en: "The incident was investigated thoroughly by the committee.", pt: "O incidente foi investigado minuciosamente pelo comitê." },
                    { en: "Safety is always my top priority.", pt: "A segurança é sempre minha prioridade máxima." },
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
                      <img src={readingImage} alt="Safety equipment" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Safety equipment and protection 🦺</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Engineer with safety helmet" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Safety first in every workplace 👷</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Workplace safety" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">HSE in action 🛡️</p>
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
              <h2 className="text-3xl font-bold">🔹 WRAP UP - HSE Essentials</h2>
              <SpeakSentence text="Essential phrases for workplace health, safety, and environmental protection" className="mt-2 text-green-100 italic">
                📝 Essential phrases for workplace health, safety, and environmental protection
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "Safety first!", pt: "Segurança em primeiro lugar! 🦺" },
                { en: "Always wear your PPE.", pt: "Sempre use seu EPI. 👷" },
                { en: "Report hazards immediately.", pt: "Reporte perigos imediatamente. ⚠️" },
                { en: "Follow safety procedures.", pt: "Siga os procedimentos de segurança. 📏" },
                { en: "Protect the environment.", pt: "Proteja o meio ambiente. 🌍" },
                { en: "Stay safe! Take care!", pt: "Fique seguro! Cuide-se! 🛡️" },
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
                    <li>Use <strong className="text-white">Past Tense</strong> (I inspected, we followed) to talk about completed safety actions.</li>
                    <li>Use <strong className="text-white">"Did you..."</strong> for past questions.</li>
                    <li>Use <strong className="text-white">"did not"</strong> for negative past statements.</li>
                    <li>Always mention <strong className="text-white">PPE, PTW, toolbox meetings</strong> in HSE interviews.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">"Safety starts with awareness and communication." Every worker must feel empowered to speak up about hazards.</p>
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
          <button onClick={() => router.push("/cursos/lesson6")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (6)
          </button>
          <button onClick={() => router.push("/cursos/lesson8")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (8) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM DA GRAMMAR ===== */}
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

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL DA LIÇÃO ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="HSE – ampliada"
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