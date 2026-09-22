"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey =
  | "verbs"
  | "vocabulary"
  | "reading"
  | "skills"
  | "education"
  | "grammar"
  | "conversation"
  | "practice"
  | "usefulPhrases";

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

const SpeakText = ({
  text,
  children,
  className = "",
  showIcon = true,
}: SpeakTextProps) => {
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
      {showIcon && (
        <Volume2
          size={12}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500"
        />
      )}
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => {
    const speechText = typeof children === "string" ? children : text;
    speakEnglish(speechText, 0.85);
  };

  return (
    <button
      onClick={speak}
      className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500"
      />
    </button>
  );
};

// Note Modal Component
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
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-green-100 mt-1">
            Escreva suas observações, dúvidas ou traduções
          </p>
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300"
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
      className="ml-3 text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
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
// SUBSTITUTION EXERCISE COMPONENT WITH EYE + TRANSLATION TOGGLE
// ============================================
type OptionType =
  | string
  | { label: string; replacement: string; pt?: string };

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

  const isObjectOption = (
    opt: OptionType
  ): opt is { label: string; replacement: string; pt?: string } => {
    return (
      typeof opt === "object" &&
      opt !== null &&
      "label" in opt &&
      "replacement" in opt
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

  const toggleVisibility = () => {
    setShowEnglish((prev) => !prev);
  };

  const toggleTranslation = () => {
    setShowTranslation((prev) => !prev);
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
            title={
              showEnglish
                ? "Ocultar resposta em inglês"
                : "Mostrar resposta em inglês"
            }
          >
            {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence
            text={currentSentence}
            className="text-green-700 font-medium"
          />
          {showTranslation && currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-green-200 pt-1">
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
                ? "bg-green-500 text-white"
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM VERDE
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
  const [showTranslation, setShowTranslation] = useState(false);
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, "");
    if (greenWords.some((gw) => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return (
        <span key={i} className="text-green-600 font-bold">
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="mb-2">
        <SpeakSentence
          text={text}
          className="text-base md:text-lg font-medium text-gray-800"
        >
          {parts}
        </SpeakSentence>
      </div>
      <button
        onClick={() => setShowTranslation((prev) => !prev)}
        className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-bold mb-2"
      >
        {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
      </button>
      {showTranslation && (
        <p className="text-sm text-gray-600 border-t border-green-100 pt-2">
          🇧🇷 {translation}
        </p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 9 SAFETY OFFICER
// ============================================
export default function Lesson9SafetyOfficer() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    reading: false,
    skills: false,
    education: false,
    grammar: false,
    conversation: false,
    practice: false,
    usefulPhrases: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<
    Record<string, number>
  >({});

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

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

  const safetyImage =
    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const offshorePlatformImage =
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const inspectionImage =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const ppeImage =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const controlRoomImage =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const constructionImage =
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu inspeciono a área de trabalho. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I inspect the work area.",
          pt: "Eu inspeciono a área de trabalho.",
        },
        {
          label: "Ela",
          replacement: "She inspects the work area.",
          pt: "Ela inspeciona a área de trabalho.",
        },
        {
          label: "Nós",
          replacement: "We inspect the work area.",
          pt: "Nós inspecionamos a área de trabalho.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu monitoro a conformidade. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I monitor compliance.",
          pt: "Eu monitoro a conformidade.",
        },
        {
          label: "Ele",
          replacement: "He monitors compliance.",
          pt: "Ele monitora a conformidade.",
        },
        {
          label: "Eles",
          replacement: "They monitor compliance.",
          pt: "Eles monitoram a conformidade.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu faço cumprir as regras de segurança. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I enforce safety rules.",
          pt: "Eu faço cumprir as regras de segurança.",
        },
        {
          label: "Ela",
          replacement: "She enforces safety rules.",
          pt: "Ela faz cumprir as regras de segurança.",
        },
        {
          label: "Nós",
          replacement: "We enforce safety rules.",
          pt: "Nós fazemos cumprir as regras de segurança.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu investigo incidentes. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I investigate incidents.",
          pt: "Eu investigo incidentes.",
        },
        {
          label: "Ele",
          replacement: "He investigates incidents.",
          pt: "Ele investiga incidentes.",
        },
        {
          label: "Eles",
          replacement: "They investigate incidents.",
          pt: "Eles investigam incidentes.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu reporto condições inseguras. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I report unsafe conditions.",
          pt: "Eu reporto condições inseguras.",
        },
        {
          label: "Ela",
          replacement: "She reports unsafe conditions.",
          pt: "Ela reporta condições inseguras.",
        },
        {
          label: "Nós",
          replacement: "We report unsafe conditions.",
          pt: "Nós reportamos condições inseguras.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu previno acidentes com treinamento. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I prevent accidents with training.",
          pt: "Eu previno acidentes com treinamento.",
        },
        {
          label: "Ele",
          replacement: "He prevents accidents with training.",
          pt: "Ele previne acidentes com treinamento.",
        },
        {
          label: "Eles",
          replacement: "They prevent accidents with training.",
          pt: "Eles previnem acidentes com treinamento.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu avalio riscos antes de começar. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I assess risks before starting.",
          pt: "Eu avalio riscos antes de começar.",
        },
        {
          label: "Ela",
          replacement: "She assesses risks before starting.",
          pt: "Ela avalia riscos antes de começar.",
        },
        {
          label: "Nós",
          replacement: "We assess risks before starting.",
          pt: "Nós avaliamos riscos antes de começar.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu controlo perigos com medidas protetivas. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I control hazards with protective measures.",
          pt: "Eu controlo perigos com medidas protetivas.",
        },
        {
          label: "Ele",
          replacement: "He controls hazards with protective measures.",
          pt: "Ele controla perigos com medidas protetivas.",
        },
        {
          label: "Eles",
          replacement: "They control hazards with protective measures.",
          pt: "Eles controlam perigos com medidas protetivas.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original:
        "Eu treino trabalhadores em procedimentos de emergência. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I train workers on emergency procedures.",
          pt: "Eu treino trabalhadores em procedimentos de emergência.",
        },
        {
          label: "Ela",
          replacement: "She trains workers on emergency procedures.",
          pt: "Ela treina trabalhadores em procedimentos de emergência.",
        },
        {
          label: "Nós",
          replacement: "We train workers on emergency procedures.",
          pt: "Nós treinamos trabalhadores em procedimentos de emergência.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Eu documento todas as inspeções. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I document all inspections.",
          pt: "Eu documento todas as inspeções.",
        },
        {
          label: "Ele",
          replacement: "He documents all inspections.",
          pt: "Ele documenta todas as inspeções.",
        },
        {
          label: "Eles",
          replacement: "They document all inspections.",
          pt: "Eles documentam todas as inspeções.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "Eu audito o sistema de gestão de segurança. / ela / nós",
      options: [
        {
          label: "Eu",
          replacement: "I audit the safety management system.",
          pt: "Eu audito o sistema de gestão de segurança.",
        },
        {
          label: "Ela",
          replacement: "She audits the safety management system.",
          pt: "Ela audita o sistema de gestão de segurança.",
        },
        {
          label: "Nós",
          replacement: "We audit the safety management system.",
          pt: "Nós auditamos o sistema de gestão de segurança.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "Eu respondo rapidamente a qualquer emergência. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I respond quickly to any emergency.",
          pt: "Eu respondo rapidamente a qualquer emergência.",
        },
        {
          label: "Ele",
          replacement: "He responds quickly to any emergency.",
          pt: "Ele responde rapidamente a qualquer emergência.",
        },
        {
          label: "Eles",
          replacement: "They respond quickly to any emergency.",
          pt: "Eles respondem rapidamente a qualquer emergência.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "O perigo foi identificado. / risco / quase-acidente",
      options: [
        {
          label: "perigo",
          replacement: "The hazard was identified.",
          pt: "O perigo foi identificado.",
        },
        {
          label: "risco",
          replacement: "The risk was identified.",
          pt: "O risco foi identificado.",
        },
        {
          label: "quase-acidente",
          replacement: "The near miss was identified.",
          pt: "O quase-acidente foi identificado.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "A avaliação de risco foi concluída. / a inspeção / a auditoria",
      options: [
        {
          label: "avaliação",
          replacement: "The risk assessment was completed.",
          pt: "A avaliação de risco foi concluída.",
        },
        {
          label: "inspeção",
          replacement: "The inspection was completed.",
          pt: "A inspeção foi concluída.",
        },
        {
          label: "auditoria",
          replacement: "The audit was completed.",
          pt: "A auditoria foi concluída.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Todo trabalhador deve usar EPI. / capacete / luvas",
      options: [
        {
          label: "EPI",
          replacement: "Every worker must wear PPE.",
          pt: "Todo trabalhador deve usar EPI.",
        },
        {
          label: "capacete",
          replacement: "Every worker must wear a hard hat.",
          pt: "Todo trabalhador deve usar capacete.",
        },
        {
          label: "luvas",
          replacement: "Every worker must wear safety gloves.",
          pt: "Todo trabalhador deve usar luvas de segurança.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original:
        "O procedimento de segurança deve ser seguido. / a permissão de trabalho / o DDS",
      options: [
        {
          label: "procedimento",
          replacement: "The safety procedure must be followed.",
          pt: "O procedimento de segurança deve ser seguido.",
        },
        {
          label: "permissão",
          replacement: "The work permit must be followed.",
          pt: "A permissão de trabalho deve ser seguida.",
        },
        {
          label: "DDS",
          replacement: "The toolbox talk must be followed.",
          pt: "O DDS deve ser seguido.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O incidente foi investigado. / o quase-acidente / o acidente",
      options: [
        {
          label: "incidente",
          replacement: "The incident was investigated.",
          pt: "O incidente foi investigado.",
        },
        {
          label: "quase-acidente",
          replacement: "The near miss was investigated.",
          pt: "O quase-acidente foi investigado.",
        },
        {
          label: "acidente",
          replacement: "The accident was investigated.",
          pt: "O acidente foi investigado.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original:
        "O simulado de emergência foi realizado. / o ponto de encontro / o extintor",
      options: [
        {
          label: "simulado",
          replacement: "The emergency drill was conducted.",
          pt: "O simulado de emergência foi realizado.",
        },
        {
          label: "ponto de encontro",
          replacement: "The muster point was checked.",
          pt: "O ponto de encontro foi verificado.",
        },
        {
          label: "extintor",
          replacement: "The fire extinguisher was inspected.",
          pt: "O extintor de incêndio foi inspecionado.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original:
        "A condição insegura foi reportada. / o ato inseguro / o perigo",
      options: [
        {
          label: "condição",
          replacement: "The unsafe condition was reported.",
          pt: "A condição insegura foi reportada.",
        },
        {
          label: "ato",
          replacement: "The unsafe act was reported.",
          pt: "O ato inseguro foi reportado.",
        },
        {
          label: "perigo",
          replacement: "The hazard was reported.",
          pt: "O perigo foi reportado.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original:
        "O kit de primeiros socorros está completo. / o extintor / a saída de emergência",
      options: [
        {
          label: "kit",
          replacement: "The first aid kit is complete.",
          pt: "O kit de primeiros socorros está completo.",
        },
        {
          label: "extintor",
          replacement: "The fire extinguisher is complete.",
          pt: "O extintor de incêndio está completo.",
        },
        {
          label: "saída",
          replacement: "The emergency exit is clear.",
          pt: "A saída de emergência está desobstruída.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original:
        "O procedimento LOTO deve ser seguido. / espaço confinado / trabalho a quente",
      options: [
        {
          label: "LOTO",
          replacement: "The LOTO procedure must be followed.",
          pt: "O procedimento LOTO deve ser seguido.",
        },
        {
          label: "espaço confinado",
          replacement: "The confined space procedure must be followed.",
          pt: "O procedimento de espaço confinado deve ser seguido.",
        },
        {
          label: "trabalho a quente",
          replacement: "The hot work procedure must be followed.",
          pt: "O procedimento de trabalho a quente deve ser seguido.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original:
        "A cultura de segurança é importante. / a proteção ambiental / o treinamento",
      options: [
        {
          label: "cultura",
          replacement: "The safety culture is important.",
          pt: "A cultura de segurança é importante.",
        },
        {
          label: "proteção",
          replacement: "The environmental protection is important.",
          pt: "A proteção ambiental é importante.",
        },
        {
          label: "treinamento",
          replacement: "The safety training is important.",
          pt: "O treinamento de segurança é importante.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original:
        "Eu realizo inspeções regulares de segurança para identificar perigos. / riscos / condições inseguras",
      options: [
        {
          label: "perigos",
          replacement:
            "I conduct regular safety inspections to identify hazards.",
          pt: "Eu realizo inspeções regulares de segurança para identificar perigos.",
        },
        {
          label: "riscos",
          replacement:
            "I conduct regular safety inspections to identify risks.",
          pt: "Eu realizo inspeções regulares de segurança para identificar riscos.",
        },
        {
          label: "condições inseguras",
          replacement:
            "I conduct regular safety inspections to identify unsafe conditions.",
          pt: "Eu realizo inspeções regulares de segurança para identificar condições inseguras.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "O trabalhador deixou de usar o EPI exigido. / capacete / luvas",
      options: [
        {
          label: "EPI",
          replacement: "The worker failed to wear the required PPE.",
          pt: "O trabalhador deixou de usar o EPI exigido.",
        },
        {
          label: "capacete",
          replacement: "The worker failed to wear the required hard hat.",
          pt: "O trabalhador deixou de usar o capacete exigido.",
        },
        {
          label: "luvas",
          replacement: "The worker failed to wear the required safety gloves.",
          pt: "O trabalhador deixou de usar as luvas exigidas.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original:
        "Nós registramos um quase-acidente e investigamos a causa raiz. / incidente / acidente",
      options: [
        {
          label: "quase-acidente",
          replacement:
            "We recorded a near miss and investigated the root cause.",
          pt: "Nós registramos um quase-acidente e investigamos a causa raiz.",
        },
        {
          label: "incidente",
          replacement:
            "We recorded an incident and investigated the root cause.",
          pt: "Nós registramos um incidente e investigamos a causa raiz.",
        },
        {
          label: "acidente",
          replacement:
            "We recorded an accident and investigated the root cause.",
          pt: "Nós registramos um acidente e investigamos a causa raiz.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original:
        "Eu dei um DDS sobre trabalho em altura. / espaço confinado / trabalho a quente",
      options: [
        {
          label: "trabalho em altura",
          replacement: "I delivered a toolbox talk on working at height.",
          pt: "Eu dei um DDS sobre trabalho em altura.",
        },
        {
          label: "espaço confinado",
          replacement: "I delivered a toolbox talk on confined space entry.",
          pt: "Eu dei um DDS sobre entrada em espaço confinado.",
        },
        {
          label: "trabalho a quente",
          replacement: "I delivered a toolbox talk on hot work.",
          pt: "Eu dei um DDS sobre trabalho a quente.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original:
        "Nós realizamos uma avaliação de risco e implementamos medidas de controle. / análise / plano",
      options: [
        {
          label: "avaliação",
          replacement:
            "We performed a risk assessment and implemented control measures.",
          pt: "Nós realizamos uma avaliação de risco e implementamos medidas de controle.",
        },
        {
          label: "análise",
          replacement:
            "We performed a risk analysis and implemented control measures.",
          pt: "Nós realizamos uma análise de risco e implementamos medidas de controle.",
        },
        {
          label: "plano",
          replacement:
            "We performed a risk plan and implemented control measures.",
          pt: "Nós realizamos um plano de risco e implementamos medidas de controle.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Vamos começar a inspeção de segurança. / auditoria / avaliação",
      options: [
        {
          label: "inspeção",
          replacement: "Let's begin the safety inspection.",
          pt: "Vamos começar a inspeção de segurança.",
        },
        {
          label: "auditoria",
          replacement: "Let's begin the safety audit.",
          pt: "Vamos começar a auditoria de segurança.",
        },
        {
          label: "avaliação",
          replacement: "Let's begin the risk assessment.",
          pt: "Vamos começar a avaliação de risco.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Por favor, use seu EPI o tempo todo. / capacete / óculos",
      options: [
        {
          label: "EPI",
          replacement: "Please wear your PPE at all times.",
          pt: "Por favor, use seu EPI o tempo todo.",
        },
        {
          label: "capacete",
          replacement: "Please wear your hard hat at all times.",
          pt: "Por favor, use seu capacete o tempo todo.",
        },
        {
          label: "óculos",
          replacement: "Please wear your safety glasses at all times.",
          pt: "Por favor, use seus óculos de segurança o tempo todo.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original:
        "Pare todas as operações imediatamente. / atividades / trabalhos",
      options: [
        {
          label: "operações",
          replacement: "Stop all operations immediately.",
          pt: "Pare todas as operações imediatamente.",
        },
        {
          label: "atividades",
          replacement: "Stop all activities immediately.",
          pt: "Pare todas as atividades imediatamente.",
        },
        {
          label: "trabalhos",
          replacement: "Stop all work immediately.",
          pt: "Pare todos os trabalhos imediatamente.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original:
        "Eu inspeciono a área de trabalho toda manhã. / todos os dias / semanalmente",
      options: [
        {
          label: "toda manhã",
          replacement: "I inspect the work area every morning.",
          pt: "Eu inspeciono a área de trabalho toda manhã.",
        },
        {
          label: "todos os dias",
          replacement: "I inspect the work area every day.",
          pt: "Eu inspeciono a área de trabalho todos os dias.",
        },
        {
          label: "semanalmente",
          replacement: "I inspect the work area weekly.",
          pt: "Eu inspeciono a área de trabalho semanalmente.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original:
        "Ela monitora a conformidade dos trabalhadores. / a segurança / os procedimentos",
      options: [
        {
          label: "conformidade",
          replacement: "She monitors the workers' compliance.",
          pt: "Ela monitora a conformidade dos trabalhadores.",
        },
        {
          label: "segurança",
          replacement: "She monitors the workers' safety.",
          pt: "Ela monitora a segurança dos trabalhadores.",
        },
        {
          label: "procedimentos",
          replacement: "She monitors the workers' procedures.",
          pt: "Ela monitora os procedimentos dos trabalhadores.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original:
        "A equipe relata incidentes imediatamente. / perigos / quase-acidentes",
      options: [
        {
          label: "incidentes",
          replacement: "The team reports incidents immediately.",
          pt: "A equipe relata incidentes imediatamente.",
        },
        {
          label: "perigos",
          replacement: "The team reports hazards immediately.",
          pt: "A equipe relata perigos imediatamente.",
        },
        {
          label: "quase-acidentes",
          replacement: "The team reports near misses immediately.",
          pt: "A equipe relata quase-acidentes imediatamente.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original:
        "Os oficiais de segurança fazem cumprir as regras da empresa. / os procedimentos / as normas",
      options: [
        {
          label: "regras",
          replacement: "Safety officers enforce the company's rules.",
          pt: "Os oficiais de segurança fazem cumprir as regras da empresa.",
        },
        {
          label: "procedimentos",
          replacement: "Safety officers enforce the company's procedures.",
          pt: "Os oficiais de segurança fazem cumprir os procedimentos da empresa.",
        },
        {
          label: "normas",
          replacement: "Safety officers enforce the company's standards.",
          pt: "Os oficiais de segurança fazem cumprir as normas da empresa.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original:
        "O oficial não ignora violações de segurança. / esconde / tolera",
      options: [
        {
          label: "ignora",
          replacement: "The officer doesn't ignore safety violations.",
          pt: "O oficial não ignora violações de segurança.",
        },
        {
          label: "esconde",
          replacement: "The officer doesn't hide safety violations.",
          pt: "O oficial não esconde violações de segurança.",
        },
        {
          label: "tolera",
          replacement: "The officer doesn't tolerate safety violations.",
          pt: "O oficial não tolera violações de segurança.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original:
        "Os trabalhadores não entram em espaços confinados sem permissão. / trabalhos a quente / áreas de risco",
      options: [
        {
          label: "espaços confinados",
          replacement:
            "Workers don't enter confined spaces without a permit.",
          pt: "Os trabalhadores não entram em espaços confinados sem permissão.",
        },
        {
          label: "trabalhos a quente",
          replacement: "Workers don't perform hot work without a permit.",
          pt: "Os trabalhadores não realizam trabalhos a quente sem permissão.",
        },
        {
          label: "áreas de risco",
          replacement:
            "Workers don't enter hazardous areas without a permit.",
          pt: "Os trabalhadores não entram em áreas de risco sem permissão.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Você realiza inspeções diárias? / auditorias / avaliações",
      options: [
        {
          label: "inspeções",
          replacement: "Do you conduct daily inspections?",
          pt: "Você realiza inspeções diárias?",
        },
        {
          label: "auditorias",
          replacement: "Do you conduct daily audits?",
          pt: "Você realiza auditorias diárias?",
        },
        {
          label: "avaliações",
          replacement: "Do you conduct daily assessments?",
          pt: "Você realiza avaliações diárias?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original:
        "O supervisor aprova todas as permissões de trabalho? / os DDS / as avaliações",
      options: [
        {
          label: "permissões",
          replacement: "Does the supervisor approve all work permits?",
          pt: "O supervisor aprova todas as permissões de trabalho?",
        },
        {
          label: "DDS",
          replacement: "Does the supervisor approve all toolbox talks?",
          pt: "O supervisor aprova todos os DDS?",
        },
        {
          label: "avaliações",
          replacement: "Does the supervisor approve all risk assessments?",
          pt: "O supervisor aprova todas as avaliações de risco?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original:
        "Os oficiais de segurança devem seguir procedimentos rigorosos. / regras / normas",
      options: [
        {
          label: "procedimentos",
          replacement: "Safety officers must follow strict procedures.",
          pt: "Os oficiais de segurança devem seguir procedimentos rigorosos.",
        },
        {
          label: "regras",
          replacement: "Safety officers must follow strict rules.",
          pt: "Os oficiais de segurança devem seguir regras rigorosas.",
        },
        {
          label: "normas",
          replacement: "Safety officers must follow strict standards.",
          pt: "Os oficiais de segurança devem seguir normas rigorosas.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original:
        "Os trabalhadores devem usar EPI o tempo todo. / capacete / luvas",
      options: [
        {
          label: "EPI",
          replacement: "Workers must wear PPE at all times.",
          pt: "Os trabalhadores devem usar EPI o tempo todo.",
        },
        {
          label: "capacete",
          replacement: "Workers must wear hard hats at all times.",
          pt: "Os trabalhadores devem usar capacetes o tempo todo.",
        },
        {
          label: "luvas",
          replacement: "Workers must wear safety gloves at all times.",
          pt: "Os trabalhadores devem usar luvas de segurança o tempo todo.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original:
        "Você deve relatar qualquer quase-acidente imediatamente. / perigo / incidente",
      options: [
        {
          label: "quase-acidente",
          replacement: "You must report any near miss immediately.",
          pt: "Você deve relatar qualquer quase-acidente imediatamente.",
        },
        {
          label: "perigo",
          replacement: "You must report any hazard immediately.",
          pt: "Você deve relatar qualquer perigo imediatamente.",
        },
        {
          label: "incidente",
          replacement: "You must report any incident immediately.",
          pt: "Você deve relatar qualquer incidente imediatamente.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original:
        "Todos devem participar dos simulados de emergência. / treinamentos / DDS",
      options: [
        {
          label: "simulados",
          replacement: "Everyone must attend the emergency drills.",
          pt: "Todos devem participar dos simulados de emergência.",
        },
        {
          label: "treinamentos",
          replacement: "Everyone must attend the safety trainings.",
          pt: "Todos devem participar dos treinamentos de segurança.",
        },
        {
          label: "DDS",
          replacement: "Everyone must attend the toolbox talks.",
          pt: "Todos devem participar dos DDS.",
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
      en: "A Safety Officer starts the day by conducting a walk-through inspection of the work area.",
      pt: "Um Oficial de Segurança começa o dia realizando uma inspeção de caminhada na área de trabalho.",
      green: ["Safety", "Officer", "inspection"],
    },
    {
      en: "They identify hazards and check if workers are wearing the correct PPE.",
      pt: "Eles identificam perigos e verificam se os trabalhadores estão usando o EPI correto.",
      green: ["hazards", "PPE"],
    },
    {
      en: "During the day, they monitor operations and conduct toolbox talks.",
      pt: "Durante o dia, eles monitoram as operações e realizam DDS.",
      green: ["monitor", "toolbox talks"],
    },
    {
      en: "If an incident occurs, the Safety Officer investigates the cause and writes a report.",
      pt: "Se ocorrer um incidente, o Oficial de Segurança investiga a causa e escreve um relatório.",
      green: ["incident", "investigates", "report"],
    },
  ];

  const conversation = [
    {
      speaker: "Safety Officer:",
      line: "Good morning. I'm here to conduct a routine inspection.",
      translation: "Bom dia. Estou aqui para realizar uma inspeção de rotina.",
    },
    {
      speaker: "Worker:",
      line: "Good morning. Everything is fine here.",
      translation: "Bom dia. Está tudo bem aqui.",
    },
    {
      speaker: "Safety Officer:",
      line: "I noticed some equipment left in the walkway. That's a tripping hazard.",
      translation:
        "Notei alguns equipamentos deixados na passarela. Isso é um risco de tropeço.",
    },
    {
      speaker: "Worker:",
      line: "I'm sorry. I'll move it right away.",
      translation: "Desculpe. Vou mover imediatamente.",
    },
    {
      speaker: "Safety Officer:",
      line: "And make sure you wear your hard hat and safety glasses.",
      translation:
        "E certifique-se de usar seu capacete e óculos de segurança.",
    },
    {
      speaker: "Worker:",
      line: "Yes, sir. I'll follow all the safety procedures.",
      translation: "Sim, senhor. Seguirei todos os procedimentos de segurança.",
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("${offshorePlatformImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-6">
            🦺 Lesson 9 - The Safety Officer — Roles & Responsibilities
          </h1>
          <SpeakSentence
            text="Learn to talk about the daily duties of a Safety Officer in the offshore industry, construction, and more. Master professional HSE vocabulary and communication skills."
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            📚 Learn to talk about the daily duties of a Safety Officer in the
            offshore industry, construction, and more. Master professional HSE
            vocabulary and communication skills.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={safetyImage}
              alt="Safety Officer on site"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            💡 Clique em qualquer texto em inglês para ouvir a pronúncia com voz
            feminina nativa.
          </p>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                🔹 VERBS - Safety Officer Actions
              </h2>
              <PencilIcon onClick={() => openNoteModal("Verbs")} />
            </div>
            <button
              onClick={() => toggleDrill("verbs")}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.verbs ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Click on the verbs to hear the pronunciation and practice their forms"
              className="text-md text-gray-600 mb-4 italic"
            >
              🎧 Click on the verbs to hear the pronunciation and practice their
              forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to inspect" className="text-green-600 font-bold">
                  to inspect
                </SpeakText>{" "}
                = inspecionar 🔍
              </li>
              <li>
                <SpeakText text="to monitor" className="text-green-600 font-bold">
                  to monitor
                </SpeakText>{" "}
                = monitorar 📊
              </li>
              <li>
                <SpeakText text="to enforce" className="text-green-600 font-bold">
                  to enforce
                </SpeakText>{" "}
                = fazer cumprir ⚖️
              </li>
              <li>
                <SpeakText
                  text="to investigate"
                  className="text-green-600 font-bold"
                >
                  to investigate
                </SpeakText>{" "}
                = investigar 🔎
              </li>
              <li>
                <SpeakText text="to report" className="text-green-600 font-bold">
                  to report
                </SpeakText>{" "}
                = relatar 📋
              </li>
              <li>
                <SpeakText text="to prevent" className="text-green-600 font-bold">
                  to prevent
                </SpeakText>{" "}
                = prevenir ⚠️
              </li>
              <li>
                <SpeakText text="to assess" className="text-green-600 font-bold">
                  to assess
                </SpeakText>{" "}
                = avaliar 📈
              </li>
              <li>
                <SpeakText text="to control" className="text-green-600 font-bold">
                  to control
                </SpeakText>{" "}
                = controlar 🎯
              </li>
              <li>
                <SpeakText text="to train" className="text-green-600 font-bold">
                  to train
                </SpeakText>{" "}
                = treinar 🎓
              </li>
              <li>
                <SpeakText text="to document" className="text-green-600 font-bold">
                  to document
                </SpeakText>{" "}
                = documentar 📝
              </li>
              <li>
                <SpeakText text="to audit" className="text-green-600 font-bold">
                  to audit
                </SpeakText>{" "}
                = auditar ✅
              </li>
              <li>
                <SpeakText text="to respond" className="text-green-600 font-bold">
                  to respond
                </SpeakText>{" "}
                = responder 🚨
              </li>
            </ul>
            {openDrills.verbs && (
              <div
                className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4"
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                🔹 NEW WORDS - HSE Vocabulary
              </h2>
              <PencilIcon onClick={() => openNoteModal("New Words")} />
            </div>
            <button
              onClick={() => toggleDrill("vocabulary")}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
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
                { en: "hazard", pt: "perigo / risco ⚠️" },
                { en: "risk assessment", pt: "avaliação de risco 📊" },
                { en: "PPE", pt: "EPI 👷" },
                { en: "safety procedure", pt: "procedimento de segurança 📏" },
                { en: "work permit", pt: "permissão de trabalho 📋" },
                { en: "toolbox talk", pt: "DDS (diálogo de segurança) 💬" },
                { en: "incident", pt: "incidente 🚨" },
                { en: "near miss", pt: "quase-acidente ⚡" },
                { en: "emergency drill", pt: "simulado de emergência 🚨" },
                { en: "muster point", pt: "ponto de encontro 📍" },
                { en: "unsafe condition", pt: "condição insegura ⚠️" },
                { en: "unsafe act", pt: "ato inseguro 🚫" },
                { en: "fire extinguisher", pt: "extintor de incêndio 🧯" },
                { en: "first aid", pt: "primeiros socorros 🩹" },
                { en: "LOTO", pt: "bloqueio e etiquetagem 🔒" },
                { en: "confined space", pt: "espaço confinado 🕳️" },
                { en: "working at height", pt: "trabalho em altura 🧗" },
                { en: "hot work", pt: "trabalho a quente 🔥" },
                { en: "environmental protection", pt: "proteção ambiental 🌍" },
                { en: "safety culture", pt: "cultura de segurança 🛡️" },
              ].map((word, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 p-3 rounded-lg border border-green-200"
                >
                  <SpeakText
                    text={word.en}
                    className="text-green-600 font-bold cursor-pointer text-left w-full block"
                  >
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div
                className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4"
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal("Useful Phrases")} />
            </div>
            <button
              onClick={() => toggleDrill("usefulPhrases")}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.usefulPhrases ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Practice professional HSE communication"
              className="text-md text-gray-600 mb-4 italic"
            >
              💬 Practice professional HSE communication
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
                className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4"
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                🔹 GRAMMAR - Present Simple & Must
              </h2>
              <PencilIcon onClick={() => openNoteModal("Grammar")} />
            </div>
            <button
              onClick={() => toggleDrill("grammar")}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.grammar ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Present Simple for routines and responsibilities, and Must for obligation"
              className="text-md text-gray-600 mb-4 italic"
            >
              📚 Present Simple for routines and responsibilities, and Must for
              obligation
            </SpeakSentence>

            <div
              className="mb-6 cursor-pointer"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img
                src={inspectionImage}
                alt="Grammar illustration – Present Simple & Must"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                👆 Clique na imagem para ampliar
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">
                  Present Simple
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Use para <strong>rotinas</strong> e{" "}
                  <strong>responsabilidades</strong>.
                </p>
                <p className="text-xs text-gray-600 italic mb-2">
                  I <strong>inspect</strong> the work area every morning.
                </p>
                <p className="text-xs text-gray-500">
                  Eu inspeciono a área de trabalho toda manhã.
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Negative</h3>
                <p className="text-sm text-gray-700 mb-2">
                  Use <strong>do/does + not</strong>.
                </p>
                <p className="text-xs text-gray-600 italic mb-2">
                  The officer <strong>doesn't ignore</strong> safety violations.
                </p>
                <p className="text-xs text-gray-500">
                  O oficial não ignora violações de segurança.
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">
                  Modal "Must"
                </h3>
                <p className="text-sm text-gray-700 mb-2">
                  Use <strong>must</strong> para{" "}
                  <strong>obrigação forte</strong>.
                </p>
                <p className="text-xs text-gray-600 italic mb-2">
                  Workers <strong>must</strong> wear PPE at all times.
                </p>
                <p className="text-xs text-gray-500">
                  Os trabalhadores devem usar EPI o tempo todo.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border border-gray-200">
              {[
                {
                  en: "I inspect the work area every morning.",
                  pt: "Eu inspeciono a área de trabalho toda manhã.",
                },
                {
                  en: "She monitors the workers' compliance.",
                  pt: "Ela monitora a conformidade dos trabalhadores.",
                },
                {
                  en: "The team reports incidents immediately.",
                  pt: "A equipe relata incidentes imediatamente.",
                },
                {
                  en: "Safety officers enforce the company's rules.",
                  pt: "Os oficiais de segurança fazem cumprir as regras da empresa.",
                },
                {
                  en: "The officer doesn't ignore safety violations.",
                  pt: "O oficial não ignora violações de segurança.",
                },
                {
                  en: "Workers don't enter confined spaces without a permit.",
                  pt: "Os trabalhadores não entram em espaços confinados sem permissão.",
                },
                {
                  en: "Do you conduct daily inspections?",
                  pt: "Você realiza inspeções diárias?",
                },
                {
                  en: "Does the supervisor approve all work permits?",
                  pt: "O supervisor aprova todas as permissões de trabalho?",
                },
                {
                  en: "Safety officers must follow strict procedures.",
                  pt: "Os oficiais de segurança devem seguir procedimentos rigorosos.",
                },
                {
                  en: "Workers must wear PPE at all times.",
                  pt: "Os trabalhadores devem usar EPI o tempo todo.",
                },
                {
                  en: "You must report any near miss immediately.",
                  pt: "Você deve relatar qualquer quase-acidente imediatamente.",
                },
                {
                  en: "Everyone must attend the emergency drills.",
                  pt: "Todos devem participar dos simulados de emergência.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white rounded-lg border-l-4 border-green-400"
                >
                  <SpeakSentence
                    text={item.en}
                    className="text-green-600 font-bold cursor-pointer text-left w-full block"
                  >
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">
                    🇧🇷 {item.pt}
                  </div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div
                className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4"
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

        {/* ===================== SECTION 5 – CONVERSATION ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">
                🔹 Conversation - Safety Officer × Worker
              </h2>
              <PencilIcon onClick={() => openNoteModal("Conversation")} />
            </div>
            <button
              onClick={() => toggleDrill("conversation")}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.conversation ? "Hide Translation" : "Show Translation"}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence
              text="Practice a real conversation between a Safety Officer and a worker"
              className="text-md text-gray-600 mb-4 italic"
            >
              💬 Practice a real conversation between a Safety Officer and a
              worker
            </SpeakSentence>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3 space-y-4">
                {conversation.map((line, index) => (
                  <div
                    key={index}
                    className="bg-green-50 p-4 rounded-xl border border-green-200"
                  >
                    <SpeakSentence
                      text={line.line}
                      className="text-base md:text-lg font-medium text-gray-800"
                    >
                      <span className="font-bold text-green-600">
                        {line.speaker}
                      </span>{" "}
                      {line.line}
                    </SpeakSentence>
                    {openDrills.conversation && (
                      <p className="text-sm text-gray-600 mt-1">
                        🇧🇷 {line.translation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="lg:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={controlRoomImage}
                    alt="Safety Officer and worker"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  Safety Officer talking to a worker on site
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal("Make it yours!")} />
            </div>
            <div className="text-sm text-green-100">
              Practice real-life situations
            </div>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    {
                      en: "A Safety Officer starts the day by conducting a walk-through inspection.",
                      pt: "Um Oficial de Segurança começa o dia realizando uma inspeção de caminhada.",
                    },
                    {
                      en: "They identify hazards and check if workers are wearing the correct PPE.",
                      pt: "Eles identificam perigos e verificam se os trabalhadores estão usando o EPI correto.",
                    },
                    {
                      en: "During the day, they monitor operations and conduct toolbox talks.",
                      pt: "Durante o dia, eles monitoram as operações e realizam DDS.",
                    },
                    {
                      en: "If an incident occurs, the Safety Officer investigates the cause.",
                      pt: "Se ocorrer um incidente, o Oficial de Segurança investiga a causa.",
                    },
                    {
                      en: "They train workers on emergency procedures and enforce safety rules.",
                      pt: "Eles treinam trabalhadores em procedimentos de emergência e fazem cumprir as regras de segurança.",
                    },
                    {
                      en: "Safety is everyone's responsibility.",
                      pt: "A segurança é responsabilidade de todos.",
                    },
                    {
                      en: "We must follow the LOTO procedure before maintenance.",
                      pt: "Devemos seguir o procedimento LOTO antes da manutenção.",
                    },
                    {
                      en: "Emergency drills are mandatory every month.",
                      pt: "Simulados de emergência são obrigatórios todos os meses.",
                    },
                    {
                      en: "The muster point is near the main gate.",
                      pt: "O ponto de encontro é perto do portão principal.",
                    },
                    {
                      en: "Report any unsafe condition to the supervisor.",
                      pt: "Reporte qualquer condição insegura ao supervisor.",
                    },
                  ].map((s, idx) => (
                    <div
                      key={idx}
                      className="group bg-white p-3 rounded-lg border-l-4 border-green-400"
                    >
                      <div className="flex items-start">
                        <SpeakSentence
                          text={s.en}
                          className="text-base font-medium text-gray-800"
                        >
                          {idx + 1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-5">
                        🇧🇷 {s.pt}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img
                        src={ppeImage}
                        alt="PPE and safety equipment"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">
                      PPE and safety equipment 🦺
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img
                        src={inspectionImage}
                        alt="Safety inspection"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">
                      Safety inspection 🔍
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img
                        src={constructionImage}
                        alt="Construction safety"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">
                      Construction safety 🏗️
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">
              🔹 WRAP UP - Safety Officer Essentials
            </h2>
            <SpeakSentence
              text="Key expressions and useful vocabulary to remember"
              className="mt-2 text-green-100 italic"
            >
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">
                KEY EXPRESSIONS
              </h3>
              {[
                {
                  en: "Let's begin the safety inspection.",
                  pt: "Vamos começar a inspeção de segurança. 🔍",
                },
                {
                  en: "Please wear your PPE at all times.",
                  pt: "Por favor, use seu EPI o tempo todo. 👷",
                },
                {
                  en: "This area requires a work permit.",
                  pt: "Esta área requer uma permissão de trabalho. 📋",
                },
                {
                  en: "Stop all operations immediately.",
                  pt: "Pare todas as operações imediatamente. 🛑",
                },
                {
                  en: "We need to conduct a risk assessment.",
                  pt: "Precisamos realizar uma avaliação de risco. 📊",
                },
                {
                  en: "Report any unsafe condition to the supervisor.",
                  pt: "Reporte qualquer condição insegura ao supervisor. ⚠️",
                },
                {
                  en: "The muster point is near the main gate.",
                  pt: "O ponto de encontro é perto do portão principal. 📍",
                },
                {
                  en: "Emergency drills are mandatory every month.",
                  pt: "Simulados de emergência são obrigatórios todos os meses. 🚨",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence
                      text={item.en}
                      className="text-green-200 hover:text-white"
                    >
                      • {item.en}
                    </SpeakSentence>
                  </div>
                  <p className="text-green-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">
                    💡 TIPS
                  </h4>
                  <ul className="list-disc pl-5 space-y-2 text-green-200">
                    <li>
                      Use <strong className="text-white">Present Simple</strong>{" "}
                      (I inspect, she monitors) for routines and
                      responsibilities.
                    </li>
                    <li>
                      Use <strong className="text-white">must</strong> for strong
                      obligation (Workers must wear PPE).
                    </li>
                    <li>
                      Use <strong className="text-white">do/does + not</strong>{" "}
                      for negative statements.
                    </li>
                    <li>
                      Always mention{" "}
                      <strong className="text-white">
                        PPE, PTW, toolbox talks, risk assessments
                      </strong>{" "}
                      — recruiters love this.
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">
                    📌 REMEMBER
                  </h4>
                  <p className="text-green-200">
                    "Safety is everyone's responsibility." Speak slowly and
                    clearly. Use the technical vocabulary you already know. The
                    interviewer wants to see your experience with offshore
                    operations and your safety mindset.
                  </p>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <p className="text-green-200 text-sm italic">
                    🌟 <strong>Substitute the words in green</strong> to create
                    new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/offshore/lesson8-offshore")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (8)
          </button>
          <button
            onClick={() => router.push("/cursos/offshore/lesson10-offshore")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (10) &rarr;
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
              src={inspectionImage}
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
              src={safetyImage}
              alt="Safety Officer – ampliada"
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