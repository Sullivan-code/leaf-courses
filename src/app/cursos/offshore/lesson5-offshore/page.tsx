"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'team' | 'grammar';

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
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-red-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />}
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
      className={`group cursor-pointer hover:bg-red-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
    </button>
  );
};

// ============================================
// NOTE MODAL
// ============================================
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
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-red-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full hover:from-orange-500 hover:to-red-600 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-300 hover:text-white transition-colors focus:outline-none"
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
// SUBSTITUTION EXERCISE COMPONENT
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
    <div className="bg-white p-4 rounded-lg border-2 border-red-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-red-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-red-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-red-700 font-medium" />
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
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
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
// HIGHLIGHTED PHRASE
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-red-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-red-200">
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
// MAIN COMPONENT – LESSON 5
// ============================================
export default function LessonEngineRoomPPE() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    team: false,
    grammar: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});
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
  const mainImage = "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=512&h=512&fit=crop";
  const teamImage = "https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
  const workImage = "https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";

  // ============================================================
  // VERBS – PPE & Safety Actions
  // ============================================================
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu uso meu capacete de segurança. / ela / eles",
      options: [
        { label: "Eu", replacement: "I wear my safety helmet." },
        { label: "Ela", replacement: "She wears her safety helmet." },
        { label: "Eles", replacement: "They wear their safety helmets." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ele protege a equipe dele. / ela / nós",
      options: [
        { label: "Ele", replacement: "He protects his team." },
        { label: "Ela", replacement: "She protects her team." },
        { label: "Nós", replacement: "We protect our team." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Nós verificamos os equipamentos todos os dias. / eles / eu",
      options: [
        { label: "Nós", replacement: "We check the equipment every day." },
        { label: "Eles", replacement: "They check the equipment every day." },
        { label: "Eu", replacement: "I check the equipment every day." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ela inspeciona o motor principal. / ele / nós",
      options: [
        { label: "Ela", replacement: "She inspects the main engine." },
        { label: "Ele", replacement: "He inspects the main engine." },
        { label: "Nós", replacement: "We inspect the main engine." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eles fazem manutenção no motor auxiliar. / nós / ela",
      options: [
        { label: "Eles", replacement: "They maintain the auxiliary engine." },
        { label: "Nós", replacement: "We maintain the auxiliary engine." },
        { label: "Ela", replacement: "She maintains the auxiliary engine." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu sigo os procedimentos de segurança. / ele / eles",
      options: [
        { label: "Eu", replacement: "I follow the safety procedures." },
        { label: "Ele", replacement: "He follows the safety procedures." },
        { label: "Eles", replacement: "They follow the safety procedures." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ela garante que todos os trabalhadores usem EPI. / ele / nós",
      options: [
        { label: "Ela", replacement: "She ensures all workers wear PPE." },
        { label: "Ele", replacement: "He ensures all workers wear PPE." },
        { label: "Nós", replacement: "We ensure all workers wear PPE." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // VOCABULARY – PPE & Engine Room
  // ============================================================
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu usei meu capacete de segurança ontem. / óculos / botas",
      options: [
        { label: "capacete", replacement: "I wore my safety helmet yesterday." },
        { label: "óculos", replacement: "I wore my safety goggles yesterday." },
        { label: "botas", replacement: "I wore my safety boots yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ela verificou o extintor de incêndio. / alarme / kit de primeiros socorros",
      options: [
        { label: "extintor", replacement: "She checked the fire extinguisher." },
        { label: "alarme", replacement: "She checked the alarm system." },
        { label: "kit", replacement: "She checked the first aid kit." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ele usou óculos de segurança na sala de máquinas. / capacete / colete",
      options: [
        { label: "óculos", replacement: "He wore safety goggles in the engine room." },
        { label: "capacete", replacement: "He wore a safety helmet in the engine room." },
        { label: "colete", replacement: "He wore a safety vest in the engine room." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Nós usamos proteção auricular durante o teste. / óculos / botas",
      options: [
        { label: "proteção auricular", replacement: "We wore ear protection during the test." },
        { label: "óculos", replacement: "We wore safety goggles during the test." },
        { label: "botas", replacement: "We wore safety boots during the test." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O sistema de alarme ativou durante o treinamento. / luz de aviso / parada de emergência",
      options: [
        { label: "sistema de alarme", replacement: "The alarm system activated during the drill." },
        { label: "luz de aviso", replacement: "The warning light activated during the drill." },
        { label: "parada de emergência", replacement: "The emergency stop activated during the drill." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Nós inspecionamos o motor principal na segunda-feira. / motor auxiliar / válvulas",
      options: [
        { label: "motor principal", replacement: "We inspected the main engine on Monday." },
        { label: "motor auxiliar", replacement: "We inspected the auxiliary engine on Monday." },
        { label: "válvulas", replacement: "We inspected the valves on Monday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "A placa de segurança indicava a saída. / luz de aviso / procedimento",
      options: [
        { label: "placa de segurança", replacement: "The safety sign indicated the exit." },
        { label: "luz de aviso", replacement: "The warning light indicated the exit." },
        { label: "procedimento", replacement: "The safety procedure indicated the exit." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eles seguiram o procedimento de segurança corretamente. / diretrizes / regras",
      options: [
        { label: "procedimento", replacement: "They followed the safety procedure correctly." },
        { label: "diretrizes", replacement: "They followed the safety guidelines correctly." },
        { label: "regras", replacement: "They followed the safety rules correctly." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // TEAM – International Engine Room Team
  // ============================================================
  const teamSubstitution: SubstitutionExercise[] = [
    {
      key: "team-1",
      original: "Lars trabalha aqui há 15 anos. / Ingrid / Anders",
      options: [
        { label: "Lars", replacement: "Lars has worked here for 15 years." },
        { label: "Ingrid", replacement: "Ingrid has worked here for 15 years." },
        { label: "Anders", replacement: "Anders has worked here for 15 years." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-2",
      original: "Ingrid inspecionou o motor principal hoje. / Lars / Lena",
      options: [
        { label: "Ingrid", replacement: "Ingrid has inspected the main engine today." },
        { label: "Lars", replacement: "Lars has inspected the main engine today." },
        { label: "Lena", replacement: "Lena has inspected the main engine today." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-3",
      original: "Anders fez manutenção no motor auxiliar. / José / Carlos",
      options: [
        { label: "Anders", replacement: "Anders has maintained the auxiliary engine." },
        { label: "José", replacement: "José has maintained the auxiliary engine." },
        { label: "Carlos", replacement: "Carlos has maintained the auxiliary engine." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-4",
      original: "Lena verificou os extintores de incêndio. / Elena / María",
      options: [
        { label: "Lena", replacement: "Lena has checked the fire extinguishers." },
        { label: "Elena", replacement: "Elena has checked the fire extinguishers." },
        { label: "María", replacement: "María has checked the fire extinguishers." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-5",
      original: "José inspecionou as válvulas hoje. / Lars / Carlos",
      options: [
        { label: "José", replacement: "José has inspected the valves today." },
        { label: "Lars", replacement: "Lars has inspected the valves today." },
        { label: "Carlos", replacement: "Carlos has inspected the valves today." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-6",
      original: "María reparou os tubos esta semana. / Elena / Lena",
      options: [
        { label: "María", replacement: "María has repaired the pipes this week." },
        { label: "Elena", replacement: "Elena has repaired the pipes this week." },
        { label: "Lena", replacement: "Lena has repaired the pipes this week." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-7",
      original: "Carlos limpou a sala de máquinas. / José / Anders",
      options: [
        { label: "Carlos", replacement: "Carlos has cleaned the engine room." },
        { label: "José", replacement: "José has cleaned the engine room." },
        { label: "Anders", replacement: "Anders has cleaned the engine room." }
      ],
      currentIndex: 0,
    },
    {
      key: "team-8",
      original: "Elena verificou o sistema de alarme. / Lena / Ingrid",
      options: [
        { label: "Elena", replacement: "Elena has checked the alarm system." },
        { label: "Lena", replacement: "Lena has checked the alarm system." },
        { label: "Ingrid", replacement: "Ingrid has checked the alarm system." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // GRAMMAR – Present Perfect
  // ============================================================
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu trabalho aqui há 10 anos. / ela / nós",
      options: [
        { label: "Eu", replacement: "I have worked here for 10 years." },
        { label: "Ela", replacement: "She has worked here for 10 years." },
        { label: "Nós", replacement: "We have worked here for 10 years." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela verificou o extintor de incêndio. / ele / eles",
      options: [
        { label: "Ela", replacement: "She has checked the fire extinguisher." },
        { label: "Ele", replacement: "He has checked the fire extinguisher." },
        { label: "Eles", replacement: "They have checked the fire extinguisher." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Nós usamos nosso EPI todos os dias. / eles / eu",
      options: [
        { label: "Nós", replacement: "We have worn our PPE every day." },
        { label: "Eles", replacement: "They have worn their PPE every day." },
        { label: "Eu", replacement: "I have worn my PPE every day." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eles inspecionaram a sala de máquinas. / nós / ela",
      options: [
        { label: "Eles", replacement: "They have inspected the engine room." },
        { label: "Nós", replacement: "We have inspected the engine room." },
        { label: "Ela", replacement: "She has inspected the engine room." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ele fez manutenção no motor auxiliar. / ela / eles",
      options: [
        { label: "Ele", replacement: "He has maintained the auxiliary engine." },
        { label: "Ela", replacement: "She has maintained the auxiliary engine." },
        { label: "Eles", replacement: "They have maintained the auxiliary engine." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ela reparou os tubos esta semana. / ele / nós",
      options: [
        { label: "Ela", replacement: "She has repaired the pipes this week." },
        { label: "Ele", replacement: "He has repaired the pipes this week." },
        { label: "Nós", replacement: "We have repaired the pipes this week." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu já verifiquei as válvulas. / ele / eles",
      options: [
        { label: "Eu", replacement: "I have already checked the valves." },
        { label: "Ele", replacement: "He has already checked the valves." },
        { label: "Eles", replacement: "They have already checked the valves." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Nós ainda não seguimos os procedimentos de segurança. / eles / ela",
      options: [
        { label: "Nós", replacement: "We have not followed the safety procedures yet." },
        { label: "Eles", replacement: "They have not followed the safety procedures yet." },
        { label: "Ela", replacement: "She has not followed the safety procedures yet." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...teamSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "I always wear my safety helmet and safety goggles in the engine room.",
      pt: "Eu sempre uso meu capacete de segurança e óculos de segurança na sala de máquinas.",
      green: ["wear", "safety helmet", "safety goggles"]
    },
    {
      en: "Safety is always my top priority on board.",
      pt: "A segurança é sempre minha prioridade máxima a bordo.",
      green: ["Safety", "priority", "board"]
    },
    {
      en: "We follow all safety procedures before starting any task.",
      pt: "Nós seguimos todos os procedimentos de segurança antes de começar qualquer tarefa.",
      green: ["follow", "safety procedures", "task"]
    },
    {
      en: "Have you ever worn ear protection during a drill?",
      pt: "Você já usou proteção auricular durante um treinamento?",
      green: ["ever", "ear protection", "drill"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%201%20de%20jul.%20de%202026%2C%2014_59_42.png?raw=true")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-100 via-orange-100 to-red-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-red-300/50">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 5 - Engine Room & PPE
          </h1>
          <SpeakSentence text="Learn about Personal Protective Equipment (PPE) and meet the international team working in the engine room." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🛠️⛑️ Learn about Personal Protective Equipment (PPE) and meet the international team working in the engine room!
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src={mainImage}
              alt="Engineer with safety helmet and protective equipment"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-shadow"
              quality={100}
              priority
              onClick={() => setIsMainImageModalOpen(true)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar — 📍 Engine Room - Safety First! ⛑️</p>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS - PPE & Safety Actions</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-white text-red-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-red-100"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "to wear", pt: "vestir / usar (roupas/equipamentos)" },
                { en: "to protect", pt: "proteger" },
                { en: "to check", pt: "verificar / checar" },
                { en: "to inspect", pt: "inspecionar" },
                { en: "to maintain", pt: "fazer manutenção" },
                { en: "to follow", pt: "seguir (regras/procedimentos)" },
                { en: "to ensure", pt: "garantir / assegurar" },
              ].map((word, idx) => (
                <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-red-700 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>
            {openDrills.verbs && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 2 – VOCABULARY ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 PPE & Engine Room Vocabulary</h2>
              <PencilIcon onClick={() => openNoteModal('Vocabulary')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-white text-red-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-red-100"
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
                { en: "PPE", pt: "EPI (Equipamento de Proteção Individual)" },
                { en: "safety helmet", pt: "capacete de segurança" },
                { en: "safety goggles", pt: "óculos de segurança" },
                { en: "ear protection", pt: "proteção auricular" },
                { en: "safety boots", pt: "botas de segurança" },
                { en: "safety vest", pt: "colete de segurança" },
                { en: "fire extinguisher", pt: "extintor de incêndio" },
                { en: "first aid kit", pt: "kit de primeiros socorros" },
                { en: "engine room", pt: "sala de máquinas" },
                { en: "main engine", pt: "motor principal" },
                { en: "auxiliary engine", pt: "motor auxiliar" },
                { en: "emergency stop", pt: "parada de emergência" },
                { en: "safety sign", pt: "placa de segurança" },
                { en: "warning light", pt: "luz de aviso" },
                { en: "alarm system", pt: "sistema de alarme" },
                { en: "safety procedure", pt: "procedimento de segurança" },
              ].map((word, idx) => (
                <div key={idx} className="bg-red-50 p-3 rounded-lg border border-red-200">
                  <SpeakText text={word.en} className="text-red-700 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 3 – INTERNATIONAL TEAM ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 International Engine Room Team</h2>
              <PencilIcon onClick={() => openNoteModal('International Team')} />
            </div>
            <button
              onClick={() => toggleDrill('team')}
              className="inline-block rounded-full bg-white text-red-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-red-100"
            >
              {openDrills.team ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Meet the crew from different countries. Click to hear their roles and responsibilities." className="text-md text-gray-600 mb-4 italic">
              🌍 Meet the crew from different countries. Click to hear their roles and responsibilities.
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Lars" className="text-red-600">🇩🇰 Lars (Denmark)</SpeakText>
                </p>
                <SpeakSentence text="I am the Chief Engineer. I have worked here for 15 years. I always wear my safety helmet and safety goggles." className="text-gray-700 mt-1">
                  I am the Chief Engineer. I have worked here for 15 years.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou o Engenheiro Chefe. Trabalho aqui há 15 anos.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Ingrid" className="text-red-600">🇸🇪 Ingrid (Sweden)</SpeakText>
                </p>
                <SpeakSentence text="I am the First Engineer. I have inspected the main engine today. I always wear ear protection." className="text-gray-700 mt-1">
                  I am the First Engineer. I have inspected the main engine today.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou a Primeira Engenheira. Inspecionei o motor principal hoje.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Anders" className="text-red-600">🇳🇴 Anders (Norway)</SpeakText>
                </p>
                <SpeakSentence text="I am the Second Engineer. I have maintained the auxiliary engine. I always wear safety boots." className="text-gray-700 mt-1">
                  I am the Second Engineer. I have maintained the auxiliary engine.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou o Segundo Engenheiro. Fiz manutenção no motor auxiliar.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Lena" className="text-red-600">🇫🇮 Lena (Finland)</SpeakText>
                </p>
                <SpeakSentence text="I am the Third Engineer. I have checked the fire extinguishers. I always wear my safety vest." className="text-gray-700 mt-1">
                  I am the Third Engineer. I have checked the fire extinguishers.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou a Terceira Engenheira. Verifiquei os extintores de incêndio.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="José" className="text-red-600">🇧🇷 José (Brazil)</SpeakText>
                </p>
                <SpeakSentence text="I am a Motorman. I have inspected the valves today. I always wear safety goggles and ear protection." className="text-gray-700 mt-1">
                  I am a Motorman. I have inspected the valves today.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou um Motorman. Inspecionei as válvulas hoje.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="María" className="text-red-600">🇨🇴 María (Colombia)</SpeakText>
                </p>
                <SpeakSentence text="I am a Fitter. I have repaired the pipes this week. I always wear my safety helmet and safety boots." className="text-gray-700 mt-1">
                  I am a Fitter. I have repaired the pipes this week.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou uma Fitter. Reparei os tubos esta semana.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Carlos" className="text-red-600">🇲🇽 Carlos (Mexico)</SpeakText>
                </p>
                <SpeakSentence text="I am a Wiper. I have cleaned the engine room. I always wear my safety vest and safety boots." className="text-gray-700 mt-1">
                  I am a Wiper. I have cleaned the engine room.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou um Wiper. Limpei a sala de máquinas.</p>
              </div>

              <div className="bg-red-50 p-4 rounded-2xl border-2 border-red-200">
                <p className="font-bold text-lg">
                  <SpeakText text="Elena" className="text-red-600">🇦🇷 Elena (Argentina)</SpeakText>
                </p>
                <SpeakSentence text="I am an Electrician. I have checked the alarm system. I always wear ear protection and safety goggles." className="text-gray-700 mt-1">
                  I am an Electrician. I have checked the alarm system.
                </SpeakSentence>
                <p className="text-sm text-gray-500 mt-1">Sou uma Eletricista. Verifiquei o sistema de alarme.</p>
              </div>
            </div>

            {openDrills.team && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {teamSubstitution.map((ex) => {
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

        {/* ===================== SECTION 4 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for safety communication in the engine room" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for safety communication in the engine room
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {usefulPhrasesData.map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={item.green}
                  translation={item.pt}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===================== SECTION 5 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Present Perfect</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white text-red-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-red-100"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Learn to talk about past experiences with present relevance" className="text-md text-gray-600 mb-4 italic">
              📚 Learn to talk about past experiences with present relevance
            </SpeakSentence>

            <div className="bg-red-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border-2 border-red-200">
              <p className="font-bold text-red-700 text-xl">📚 Present Perfect - Explicação</p>
              <p className="text-gray-700">
                <strong>O que é?</strong> O Present Perfect é usado para falar sobre ações que começaram no passado e têm relação com o presente.
                Em português, geralmente corresponde ao "ter" + particípio passado.
              </p>
              <p className="text-gray-700">
                <strong>Estrutura:</strong> <span className="font-bold text-red-600">have/has</span> + <span className="font-bold text-red-600">particípio passado</span>
              </p>

              <div className="bg-white p-4 rounded-xl border-2 border-red-200">
                <p className="font-bold text-red-700">Quando usar:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Experiências de vida:</strong>{" "}
                    <SpeakText text="I have worked in many countries." className="text-red-600">I have worked in many countries.</SpeakText>
                  </li>
                  <li>
                    <strong>Ações recentes com resultado no presente:</strong>{" "}
                    <SpeakText text="She has checked the fire extinguisher." className="text-red-600">She has checked the fire extinguisher.</SpeakText>
                  </li>
                  <li>
                    <strong>Ações que continuam até o presente:</strong>{" "}
                    <SpeakText text="We have worked here since 2020." className="text-red-600">We have worked here since 2020.</SpeakText>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-orange-200">
                <p className="font-bold text-orange-700">⚠️ Diferença entre Present Perfect e Simple Past:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Present Perfect</strong> - sem tempo específico:{" "}
                    <SpeakText text="I have inspected the engine." className="text-red-600">I have inspected the engine.</SpeakText>
                  </li>
                  <li>
                    <strong>Simple Past</strong> - com tempo específico:{" "}
                    <SpeakText text="I inspected the engine yesterday." className="text-red-600">I inspected the engine yesterday.</SpeakText>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-4 rounded-xl border-2 border-red-200">
                <p className="font-bold text-red-700">📝 Verbos Irregulares comuns (Past Participle):</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>wear → <SpeakText text="worn" className="text-red-600">worn</SpeakText> (irregular)</li>
                  <li>check → <SpeakText text="checked" className="text-red-600">checked</SpeakText> (regular)</li>
                  <li>inspect → <SpeakText text="inspected" className="text-red-600">inspected</SpeakText> (regular)</li>
                  <li>maintain → <SpeakText text="maintained" className="text-red-600">maintained</SpeakText> (regular)</li>
                  <li>repair → <SpeakText text="repaired" className="text-red-600">repaired</SpeakText> (regular)</li>
                  <li>follow → <SpeakText text="followed" className="text-red-600">followed</SpeakText> (regular)</li>
                  <li>ensure → <SpeakText text="ensured" className="text-red-600">ensured</SpeakText> (regular)</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border-2 border-red-200">
              {[
                { en: "I have worked here for more than 10 years.", pt: "Eu trabalho aqui há mais de 10 anos." },
                { en: "I have completed several safety training courses.", pt: "Eu concluí vários cursos de treinamento de segurança." },
                { en: "She has checked the fire extinguisher.", pt: "Ela verificou o extintor de incêndio." },
                { en: "We have worn our PPE every day.", pt: "Nós usamos nosso EPI todos os dias." },
                { en: "They have followed all safety procedures.", pt: "Eles seguiram todos os procedimentos de segurança." },
                { en: "He has maintained the auxiliary engine.", pt: "Ele fez manutenção no motor auxiliar." },
                { en: "I have already checked the valves.", pt: "Eu já verifiquei as válvulas." },
                { en: "She has never worked in an engine room before.", pt: "Ela nunca trabalhou em uma sala de máquinas antes." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-l-4 border-red-400">
                  <SpeakSentence text={item.en} className="text-red-700 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 6 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-red-100">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "I have worn my safety helmet today.", pt: "Eu usei meu capacete de segurança hoje." },
                    { en: "She has checked the fire extinguisher.", pt: "Ela verificou o extintor de incêndio." },
                    { en: "We have inspected the main engine.", pt: "Nós inspecionamos o motor principal." },
                    { en: "He has maintained the auxiliary engine.", pt: "Ele fez manutenção no motor auxiliar." },
                    { en: "The team has followed all safety procedures.", pt: "A equipe seguiu todos os procedimentos de segurança." },
                    { en: "Have you worn your safety boots today?", pt: "Você usou suas botas de segurança hoje?" },
                    { en: "She has never worked in an engine room before.", pt: "Ela nunca trabalhou em uma sala de máquinas antes." },
                    { en: "We have already checked the alarm system.", pt: "Nós já verificamos o sistema de alarme." },
                    { en: "They have not inspected the auxiliary engine yet.", pt: "Eles ainda não inspecionaram o motor auxiliar." },
                    { en: "Have you ever worn ear protection?", pt: "Você já usou proteção auricular?" },
                  ].map((s, idx) => (
                    <div key={idx} className="group bg-white p-3 rounded-lg border-l-4 border-red-400">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium">
                          {idx + 1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-5">🇧🇷 {s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <Image src={teamImage} alt="Engineer with PPE" fill sizes="400px" className="rounded-xl object-cover" quality={100} />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Engineer wearing full PPE</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <Image src={workImage} alt="Technician working on engine" fill sizes="400px" className="rounded-xl object-cover" quality={100} />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Technician working on main engine</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Essential structures for PPE and engine room communication" className="mt-2 text-red-100 italic">
              📝 Essential structures for PPE and engine room communication
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "I have worn my PPE today.", pt: "Eu usei meu EPI hoje." },
                { en: "She has checked the fire extinguisher.", pt: "Ela verificou o extintor." },
                { en: "We have inspected the engine.", pt: "Nós inspecionamos o motor." },
                { en: "They have followed all safety procedures.", pt: "Eles seguiram todos os procedimentos." },
                { en: "Have you worn your safety boots?", pt: "Você usou suas botas?" },
                { en: "Safety is always my top priority.", pt: "A segurança é sempre minha prioridade máxima." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-red-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-red-200 text-sm ml-4">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-red-700 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-red-50">
                    <li>Use <strong className="text-white">Present Perfect</strong> (I have worn...) to talk about experience <em>without</em> a specific time.</li>
                    <li>Use <strong className="text-white">Simple Past</strong> (I wore yesterday...) with specific times.</li>
                    <li>Always mention <strong className="text-white">PPE</strong> in safety-related answers.</li>
                    <li>Use <strong className="text-white">"Have you ever..."</strong> to ask about life experiences.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-red-500">
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-red-50">Speak slowly and clearly. Safety vocabulary is essential in every offshore interview.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (4)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-orange-500 hover:to-red-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (6) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Engine Room PPE – ampliada"
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