"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  Eye,
  EyeOff,
  Zap,
  Wrench,
  HardHat,
  ShieldCheck,
  HelpCircle,
  AlertTriangle,
  MessageSquare,
  Cog,
} from "lucide-react";

type SectionKey =
  | "modalForms"
  | "abilityPermission"
  | "obligation"
  | "advice"
  | "possibility"
  | "situations"
  | "openQuestions";

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

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-orange-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && (
        <Volume2
          size={12}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500"
        />
      )}
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === "string" ? children : text;
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-orange-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500"
      />
    </button>
  );
};

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
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-orange-100 mt-1">
            Escreva suas observações, dúvidas ou traduções
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
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
type OptionType = string | { label: string; replacement: string; translation?: string };

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
  const [showTranslation, setShowTranslation] = useState(false);

  const isObjectOption = (
    opt: OptionType
  ): opt is { label: string; replacement: string; translation?: string } => {
    return typeof opt === "object" && opt !== null && "label" in opt && "replacement" in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentTranslation: string | undefined;

  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentTranslation = currentOption.translation;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => setShowEnglish((prev) => !prev);
  const toggleTranslation = () => setShowTranslation((prev) => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);

  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-orange-700 font-semibold block text-sm md:text-base">
          {exercise.original}
        </p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentTranslation && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
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
        <div className="mb-3 p-3 bg-orange-50 rounded-md border border-orange-100">
          <SpeakSentence text={currentSentence} className="text-orange-800 font-semibold" />
          {showTranslation && currentTranslation && (
            <p className="text-gray-600 text-sm mt-2 border-t border-orange-200 pt-2">
              🇧🇷 {currentTranslation}
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
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
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
// HIGHLIGHTED PHRASE
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
        <span key={i} className="text-orange-600 font-bold">
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <button
        onClick={() => setShowTranslation((prev) => !prev)}
        className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold mb-2"
      >
        {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
      </button>
      {showTranslation && (
        <p className="text-sm text-gray-600 border-t border-orange-100 pt-2">🇧🇷 {translation}</p>
      )}
    </div>
  );
}

// ============================================
// OPEN-ENDED QUESTION CARD (para o aluno responder)
// ============================================
function OpenQuestionCard({
  question,
  questionPt,
  hint,
  sampleAnswer,
  sampleAnswerPt,
  index,
}: {
  question: string;
  questionPt: string;
  hint: string;
  sampleAnswer: string;
  sampleAnswerPt: string;
  index: number;
}) {
  const [showSample, setShowSample] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-3">
        <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">
          <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
            {index}
          </span>
          <HelpCircle size={12} />
          Open Question
        </div>
        <SpeakSentence text={question} className="text-white font-semibold text-sm md:text-base">
          {question}
        </SpeakSentence>
        <p className="text-orange-200 text-xs mt-1 italic">🇧🇷 {questionPt}</p>
      </div>
      <div className="p-5">
        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-bold text-yellow-800 uppercase mb-1">💡 Dica / Hint</p>
          <p className="text-sm text-yellow-900">{hint}</p>
        </div>
        <button
          onClick={() => setShowSample((prev) => !prev)}
          className="mb-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
        >
          {showSample ? "🙈 Ocultar resposta modelo" : "👁️ Ver resposta modelo"}
        </button>
        {showSample && (
          <div
            className="bg-orange-50 rounded-xl p-4 border border-orange-100"
            style={{ animation: "fadeIn 0.3s ease-out" }}
          >
            <div className="flex items-center gap-2 text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
              <HardHat size={14} className="text-orange-600" />
              Sample Answer
            </div>
            <SpeakSentence
              text={sampleAnswer}
              className="text-gray-800 leading-relaxed text-sm md:text-base"
            >
              {sampleAnswer}
            </SpeakSentence>
            <button
              onClick={() => setShowTranslation((prev) => !prev)}
              className="mt-3 text-xs px-2 py-1 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors font-bold"
            >
              {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
            </button>
            {showTranslation && (
              <p className="text-gray-600 text-sm mt-2 border-t border-orange-200 pt-2">
                🇧🇷 {sampleAnswerPt}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonModalVerbsSecondEngineer() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    modalForms: false,
    abilityPermission: false,
    obligation: false,
    advice: false,
    possibility: false,
    situations: false,
    openQuestions: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);
  const [isSecondaryImageModalOpen, setIsSecondaryImageModalOpen] = useState(false);
  const [isEquipmentImageModalOpen, setIsEquipmentImageModalOpen] = useState(false);
  const [isEquipmentImage2ModalOpen, setIsEquipmentImage2ModalOpen] = useState(false);

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

  // ===== IMAGENS (do código original) =====
  const mainImage =
    "https://github.com/Sullivan-code/english-audios/blob/main/el%C3%A9trica1.png?raw=true";
  const secondaryImage =
    "https://github.com/Sullivan-code/english-audios/blob/main/EL%C3%89TRICA2.png?raw=true";
  const equipmentImage =
    "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2016%20de%20set.%20de%202026%2C%2010_09_22.png?raw=true";
  const equipmentImage2 =
    "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2016%20de%20set.%20de%202026%2C%2010_19_37.png?raw=true";

  // ============================================================
  // 1. MODAL FORMS – OVERVIEW (Interrogative & Negative)
  // ============================================================
  const modalFormsSubstitution: SubstitutionExercise[] = [
    {
      key: "mf-1",
      original: "ABILITY – Can you operate the generator? (interrogative)",
      options: [
        {
          label: "Can you...?",
          replacement: "Can you operate the generator?",
          translation: "Você consegue operar o gerador?",
        },
        {
          label: "Could you...? (polite)",
          replacement: "Could you operate the generator, please?",
          translation: "Você poderia operar o gerador, por favor?",
        },
        {
          label: "Negative",
          replacement: "I cannot operate the generator.",
          translation: "Eu não consigo operar o gerador.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "mf-2",
      original: "PERMISSION – May I enter the engine room? (interrogative)",
      options: [
        {
          label: "May I...?",
          replacement: "May I enter the engine room?",
          translation: "Posso entrar na sala de máquinas?",
        },
        {
          label: "Can I...? (informal)",
          replacement: "Can I enter the engine room?",
          translation: "Posso entrar na sala de máquinas?",
        },
        {
          label: "Negative",
          replacement: "You may not enter the engine room without PPE.",
          translation: "Você não pode entrar na sala de máquinas sem EPI.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "mf-3",
      original: "OBLIGATION – Must we check the bilge alarm? (interrogative)",
      options: [
        {
          label: "Must we...?",
          replacement: "Must we check the bilge alarm?",
          translation: "Devemos verificar o alarme de porão?",
        },
        {
          label: "Negative",
          replacement: "We must not ignore the bilge alarm.",
          translation: "Não devemos ignorar o alarme de porão.",
        },
        {
          label: "Have to",
          replacement: "Do we have to check the bilge alarm?",
          translation: "Temos que verificar o alarme de porão?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "mf-4",
      original: "ADVICE – Should I replace this filter? (interrogative)",
      options: [
        {
          label: "Should I...?",
          replacement: "Should I replace this filter?",
          translation: "Eu deveria substituir este filtro?",
        },
        {
          label: "Negative",
          replacement: "You should not run the pump dry.",
          translation: "Você não deveria operar a bomba a seco.",
        },
        {
          label: "Suggest",
          replacement: "You should check the oil level first.",
          translation: "Você deveria verificar o nível de óleo primeiro.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "mf-5",
      original: "POSSIBILITY – Might the pump fail under load? (interrogative)",
      options: [
        {
          label: "Might...?",
          replacement: "Might the pump fail under load?",
          translation: "A bomba pode falhar sob carga?",
        },
        {
          label: "May...?",
          replacement: "May the pump fail under load?",
          translation: "A bomba pode falhar sob carga?",
        },
        {
          label: "Negative",
          replacement: "The pump might not start in cold weather.",
          translation: "A bomba pode não partir em clima frio.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "mf-6",
      original: "NEED – Do we need to top up the oil? (interrogative)",
      options: [
        {
          label: "Need to...?",
          replacement: "Do we need to top up the oil?",
          translation: "Precisamos completar o óleo?",
        },
        {
          label: "Negative",
          replacement: "We do not need to top up the oil today.",
          translation: "Não precisamos completar o óleo hoje.",
        },
        {
          label: "Needn't",
          replacement: "We needn't top up the oil today.",
          translation: "Não precisamos completar o óleo hoje.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // 2. ABILITY & PERMISSION – CAN / COULD / MAY
  // ============================================================
  const abilityPermissionSubstitution: SubstitutionExercise[] = [
    {
      key: "ap-1",
      original: "Eu consigo ler diagramas elétricos. / ele / eles",
      options: [
        {
          label: "Eu",
          replacement: "I can read electrical diagrams.",
          translation: "Eu consigo ler diagramas elétricos.",
        },
        {
          label: "Ele",
          replacement: "He can read electrical diagrams.",
          translation: "Ele consegue ler diagramas elétricos.",
        },
        {
          label: "Eles",
          replacement: "They can read electrical diagrams.",
          translation: "Eles conseguem ler diagramas elétricos.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ap-2",
      original: "Você consegue operar o PMS? (interrogative)",
      options: [
        {
          label: "Can you...?",
          replacement: "Can you operate the PMS?",
          translation: "Você consegue operar o PMS?",
        },
        {
          label: "Could you...? (polite)",
          replacement: "Could you operate the PMS, please?",
          translation: "Você poderia operar o PMS, por favor?",
        },
        {
          label: "Negative",
          replacement: "I cannot operate the PMS without training.",
          translation: "Eu não consigo operar o PMS sem treinamento.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ap-3",
      original: "Posso usar o multímetro da oficina? (permission)",
      options: [
        {
          label: "May I...?",
          replacement: "May I use the multimeter from the workshop?",
          translation: "Posso usar o multímetro da oficina?",
        },
        {
          label: "Can I...? (informal)",
          replacement: "Can I use the multimeter from the workshop?",
          translation: "Posso usar o multímetro da oficina?",
        },
        {
          label: "Negative",
          replacement: "You may not use the multimeter without permission.",
          translation: "Você não pode usar o multímetro sem permissão.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ap-4",
      original: "Ele não consegue solucionar a falha sem o diagrama. (negative)",
      options: [
        {
          label: "cannot",
          replacement: "He cannot troubleshoot the fault without the diagram.",
          translation: "Ele não consegue solucionar a falha sem o diagrama.",
        },
        {
          label: "can't (informal)",
          replacement: "He can't troubleshoot the fault without the diagram.",
          translation: "Ele não consegue solucionar a falha sem o diagrama.",
        },
        {
          label: "Interrogative",
          replacement: "Can he troubleshoot the fault without the diagram?",
          translation: "Ele consegue solucionar a falha sem o diagrama?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ap-5",
      original: "Você poderia me ajudar com o painel? (polite request)",
      options: [
        {
          label: "Could you...?",
          replacement: "Could you help me with the panel?",
          translation: "Você poderia me ajudar com o painel?",
        },
        {
          label: "Would you...?",
          replacement: "Would you help me with the panel, please?",
          translation: "Você me ajudaria com o painel, por favor?",
        },
        {
          label: "Negative",
          replacement: "I couldn't finish the inspection yesterday.",
          translation: "Eu não consegui terminar a inspeção ontem.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ap-6",
      original: "Nós podemos entrar na praça de máquinas com EPI. (permission)",
      options: [
        {
          label: "can",
          replacement: "We can enter the engine room with PPE.",
          translation: "Nós podemos entrar na praça de máquinas com EPI.",
        },
        {
          label: "may (formal)",
          replacement: "We may enter the engine room with PPE.",
          translation: "Nós podemos entrar na praça de máquinas com EPI.",
        },
        {
          label: "Negative",
          replacement: "We cannot enter the engine room without PPE.",
          translation: "Nós não podemos entrar na praça de máquinas sem EPI.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // 3. OBLIGATION – MUST / HAVE TO / NEED TO
  // ============================================================
  const obligationSubstitution: SubstitutionExercise[] = [
    {
      key: "ob-1",
      original: "Eu tenho que usar EPI na sala de máquinas. / ele / nós",
      options: [
        {
          label: "have to",
          replacement: "I have to wear PPE in the engine room.",
          translation: "Eu tenho que usar EPI na sala de máquinas.",
        },
        {
          label: "must",
          replacement: "I must wear PPE in the engine room.",
          translation: "Eu devo usar EPI na sala de máquinas.",
        },
        {
          label: "Negative",
          replacement: "I don't have to wear PPE in the control room.",
          translation: "Eu não tenho que usar EPI na sala de controle.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ob-2",
      original: "Temos que verificar o nível de óleo? (interrogative)",
      options: [
        {
          label: "Do we have to...?",
          replacement: "Do we have to check the oil level?",
          translation: "Temos que verificar o nível de óleo?",
        },
        {
          label: "Must we...?",
          replacement: "Must we check the oil level?",
          translation: "Devemos verificar o nível de óleo?",
        },
        {
          label: "Negative",
          replacement: "We don't have to check the oil level now.",
          translation: "Não temos que verificar o nível de óleo agora.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ob-3",
      original: "Você não deve ignorar o alarme de incêndio. (prohibition)",
      options: [
        {
          label: "must not",
          replacement: "You must not ignore the fire alarm.",
          translation: "Você não deve ignorar o alarme de incêndio.",
        },
        {
          label: "mustn't",
          replacement: "You mustn't ignore the fire alarm.",
          translation: "Você não deve ignorar o alarme de incêndio.",
        },
        {
          label: "Interrogative",
          replacement: "Must we report the fire alarm immediately?",
          translation: "Devemos reportar o alarme de incêndio imediatamente?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ob-4",
      original: "Precisamos testar o gerador de emergência. / ela / eles",
      options: [
        {
          label: "need to",
          replacement: "We need to test the emergency generator.",
          translation: "Precisamos testar o gerador de emergência.",
        },
        {
          label: "have to",
          replacement: "We have to test the emergency generator.",
          translation: "Temos que testar o gerador de emergência.",
        },
        {
          label: "Negative",
          replacement: "We don't need to test the emergency generator today.",
          translation: "Não precisamos testar o gerador de emergência hoje.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ob-5",
      original: "O segundo oficial de máquinas deve supervisionar a manutenção. (interrogative)",
      options: [
        {
          label: "Must...?",
          replacement: "Must the Second Engineer supervise the maintenance?",
          translation: "O segundo oficial de máquinas deve supervisionar a manutenção?",
        },
        {
          label: "Have to...?",
          replacement: "Does the Second Engineer have to supervise the maintenance?",
          translation: "O segundo oficial de máquinas tem que supervisionar a manutenção?",
        },
        {
          label: "Negative",
          replacement: "The Second Engineer doesn't have to supervise every task.",
          translation: "O segundo oficial de máquinas não tem que supervisionar cada tarefa.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ob-6",
      original: "Não precisamos substituir o filtro hoje. (no obligation)",
      options: [
        {
          label: "don't have to",
          replacement: "We don't have to replace the filter today.",
          translation: "Não precisamos substituir o filtro hoje.",
        },
        {
          label: "needn't",
          replacement: "We needn't replace the filter today.",
          translation: "Não precisamos substituir o filtro hoje.",
        },
        {
          label: "Interrogative",
          replacement: "Do we have to replace the filter today?",
          translation: "Temos que substituir o filtro hoje?",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // 4. ADVICE – SHOULD / OUGHT TO
  // ============================================================
  const adviceSubstitution: SubstitutionExercise[] = [
    {
      key: "ad-1",
      original: "Você deveria verificar a pressão do óleo. (advice)",
      options: [
        {
          label: "should",
          replacement: "You should check the oil pressure.",
          translation: "Você deveria verificar a pressão do óleo.",
        },
        {
          label: "ought to",
          replacement: "You ought to check the oil pressure.",
          translation: "Você deveria verificar a pressão do óleo.",
        },
        {
          label: "Negative",
          replacement: "You shouldn't run the engine without oil.",
          translation: "Você não deveria operar o motor sem óleo.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ad-2",
      original: "Eu deveria substituir este filtro? (interrogative)",
      options: [
        {
          label: "Should I...?",
          replacement: "Should I replace this filter?",
          translation: "Eu deveria substituir este filtro?",
        },
        {
          label: "Ought I to...? (formal)",
          replacement: "Ought I to replace this filter?",
          translation: "Eu deveria substituir este filtro?",
        },
        {
          label: "Negative",
          replacement: "You shouldn't replace the filter before checking it.",
          translation: "Você não deveria substituir o filtro antes de verificá-lo.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ad-3",
      original: "Nós deveríamos reportar o problema ao chefe de máquinas.",
      options: [
        {
          label: "should",
          replacement: "We should report the problem to the Chief Engineer.",
          translation: "Nós deveríamos reportar o problema ao chefe de máquinas.",
        },
        {
          label: "Negative",
          replacement: "We shouldn't ignore the alarm.",
          translation: "Nós não deveríamos ignorar o alarme.",
        },
        {
          label: "Interrogative",
          replacement: "Should we report the problem to the Chief Engineer?",
          translation: "Deveríamos reportar o problema ao chefe de máquinas?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "ad-4",
      original: "O que eu deveria fazer em caso de vazamento de óleo? (open question)",
      options: [
        {
          label: "What should I...?",
          replacement: "What should I do in case of an oil leak?",
          translation: "O que eu deveria fazer em caso de vazamento de óleo?",
        },
        {
          label: "Advice answer",
          replacement: "You should stop the pump and report it immediately.",
          translation: "Você deveria parar a bomba e reportar imediatamente.",
        },
        {
          label: "Negative",
          replacement: "You shouldn't restart the pump before the leak is fixed.",
          translation: "Você não deveria religar a bomba antes de o vazamento ser corrigido.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // 5. POSSIBILITY & DEDUCTION – MAY / MIGHT / COULD / MUST (deduction)
  // ============================================================
  const possibilitySubstitution: SubstitutionExercise[] = [
    {
      key: "po-1",
      original: "A bomba pode falhar sob carga. (possibility)",
      options: [
        {
          label: "may",
          replacement: "The pump may fail under load.",
          translation: "A bomba pode falhar sob carga.",
        },
        {
          label: "might",
          replacement: "The pump might fail under load.",
          translation: "A bomba pode falhar sob carga.",
        },
        {
          label: "Negative",
          replacement: "The pump may not start in cold weather.",
          translation: "A bomba pode não partir em clima frio.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "po-2",
      original: "Pode ser um problema no sensor de temperatura. (deduction)",
      options: [
        {
          label: "could be",
          replacement: "It could be a problem with the temperature sensor.",
          translation: "Pode ser um problema no sensor de temperatura.",
        },
        {
          label: "might be",
          replacement: "It might be a problem with the temperature sensor.",
          translation: "Pode ser um problema no sensor de temperatura.",
        },
        {
          label: "Negative",
          replacement: "It might not be a sensor problem.",
          translation: "Pode não ser um problema no sensor.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "po-3",
      original: "Deve ser o disjuntor principal. (strong deduction)",
      options: [
        {
          label: "must be",
          replacement: "It must be the main circuit breaker.",
          translation: "Deve ser o disjuntor principal.",
        },
        {
          label: "Negative",
          replacement: "It can't be the main circuit breaker.",
          translation: "Não pode ser o disjuntor principal.",
        },
        {
          label: "Interrogative",
          replacement: "Could it be the main circuit breaker?",
          translation: "Poderia ser o disjuntor principal?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "po-4",
      original: "O gerador pode estar superaquecendo. (interrogative)",
      options: [
        {
          label: "Could the generator...?",
          replacement: "Could the generator be overheating?",
          translation: "O gerador pode estar superaquecendo?",
        },
        {
          label: "Might the generator...?",
          replacement: "Might the generator be overheating?",
          translation: "O gerador pode estar superaquecendo?",
        },
        {
          label: "Negative",
          replacement: "The generator might not be overheating; the sensor may be faulty.",
          translation: "O gerador pode não estar superaquecendo; o sensor pode estar com defeito.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "po-5",
      original: "Pode haver ar no sistema de combustível. (possibility)",
      options: [
        {
          label: "There may be...",
          replacement: "There may be air in the fuel system.",
          translation: "Pode haver ar no sistema de combustível.",
        },
        {
          label: "There might be...",
          replacement: "There might be air in the fuel system.",
          translation: "Pode haver ar no sistema de combustível.",
        },
        {
          label: "Negative",
          replacement: "There might not be any air in the fuel system.",
          translation: "Pode não haver ar no sistema de combustível.",
        },
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // 6. SITUATIONS – USO PRÁTICO DOS MODAIS
  // ============================================================
  const situationsSubstitution: SubstitutionExercise[] = [
    {
      key: "si-1",
      original:
        "O alarme de nível de óleo dispara. O que você diz ao chefe de máquinas?",
      options: [
        {
          label: "must",
          replacement: "Chief, we must stop the engine immediately. The oil level is too low.",
          translation: "Chefe, devemos parar o motor imediatamente. O nível de óleo está muito baixo.",
        },
        {
          label: "should",
          replacement: "Chief, we should check the oil level sensor first.",
          translation: "Chefe, nós deveríamos verificar o sensor de nível de óleo primeiro.",
        },
        {
          label: "might",
          replacement: "Chief, it might be a false alarm, but we must verify.",
          translation: "Chefe, pode ser um alarme falso, mas devemos verificar.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "si-2",
      original:
        "Um marinheiro quer entrar na praça de máquinas sem EPI. Qual é a sua resposta?",
      options: [
        {
          label: "must not",
          replacement: "You must not enter the engine room without PPE. It is a safety rule.",
          translation: "Você não deve entrar na praça de máquinas sem EPI. É uma regra de segurança.",
        },
        {
          label: "cannot",
          replacement: "You cannot enter the engine room without PPE.",
          translation: "Você não pode entrar na praça de máquinas sem EPI.",
        },
        {
          label: "need to",
          replacement: "You need to put on your hard hat and safety shoes first.",
          translation: "Você precisa colocar o capacete e os sapatos de segurança primeiro.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "si-3",
      original:
        "O gerador de emergência não parte. O que você pode fazer?",
      options: [
        {
          label: "can",
          replacement: "We can check the battery voltage first.",
          translation: "Podemos verificar a voltagem da bateria primeiro.",
        },
        {
          label: "could",
          replacement: "We could try to start it manually.",
          translation: "Poderíamos tentar parti-lo manualmente.",
        },
        {
          label: "should",
          replacement: "We should inform the Chief Engineer and follow the emergency procedure.",
          translation: "Deveríamos informar o chefe de máquinas e seguir o procedimento de emergência.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "si-4",
      original:
        "Você precisa de permissão para testar o disjuntor principal. Como pede?",
      options: [
        {
          label: "May I...?",
          replacement: "May I test the main circuit breaker, Chief?",
          translation: "Posso testar o disjuntor principal, chefe?",
        },
        {
          label: "Could I...?",
          replacement: "Could I test the main circuit breaker, please?",
          translation: "Eu poderia testar o disjuntor principal, por favor?",
        },
        {
          label: "Do I have to...?",
          replacement: "Do I have to test the main circuit breaker now?",
          translation: "Eu tenho que testar o disjuntor principal agora?",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "si-5",
      original:
        "Há um cheiro de queimado no painel elétrico. O que você deve fazer?",
      options: [
        {
          label: "must",
          replacement: "We must isolate the panel and report it immediately.",
          translation: "Devemos isolar o painel e reportar imediatamente.",
        },
        {
          label: "should not",
          replacement: "We should not touch the panel without checking the power first.",
          translation: "Não deveríamos tocar no painel sem verificar a energia primeiro.",
        },
        {
          label: "might",
          replacement: "It might be an overload or a loose connection.",
          translation: "Pode ser uma sobrecarga ou uma conexão solta.",
        },
      ],
      currentIndex: 0,
    },
    {
      key: "si-6",
      original:
        "Você não tem certeza se o problema é no sensor ou no painel. Como expressa isso?",
      options: [
        {
          label: "may / might",
          replacement: "It may be the sensor, or it might be the control panel.",
          translation: "Pode ser o sensor, ou pode ser o painel de controle.",
        },
        {
          label: "could",
          replacement: "It could be a wiring problem.",
          translation: "Pode ser um problema na fiação.",
        },
        {
          label: "must be",
          replacement: "It must be the sensor, because the alarm is constant.",
          translation: "Deve ser o sensor, porque o alarme é constante.",
        },
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...modalFormsSubstitution,
    ...abilityPermissionSubstitution,
    ...obligationSubstitution,
    ...adviceSubstitution,
    ...possibilitySubstitution,
    ...situationsSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================================
  // OPEN-ENDED QUESTIONS (para o aluno praticar)
  // ============================================================
  const openQuestions = [
    {
      question: "What can you do if the main engine alarm goes off?",
      questionPt: "O que você pode fazer se o alarme do motor principal disparar?",
      hint: "Use 'can' + action verb. Ex.: I can check..., I can inform..., I can stop...",
      sampleAnswer:
        "I can check the alarm panel first. Then I can inform the Chief Engineer and stop the engine if necessary.",
      sampleAnswerPt:
        "Eu posso verificar o painel de alarmes primeiro. Depois posso informar o chefe de máquinas e parar o motor se necessário.",
    },
    {
      question: "May I enter the engine room without a safety helmet?",
      questionPt: "Posso entrar na praça de máquinas sem capacete de segurança?",
      hint: "Use 'may' for permission and 'must not' for prohibition.",
      sampleAnswer:
        "No, you may not enter the engine room without a safety helmet. You must wear full PPE at all times.",
      sampleAnswerPt:
        "Não, você não pode entrar na praça de máquinas sem capacete. Você deve usar EPI completo o tempo todo.",
    },
    {
      question: "What should you do before starting maintenance on an electrical panel?",
      questionPt: "O que você deveria fazer antes de começar a manutenção em um painel elétrico?",
      hint: "Use 'should' + safety steps. Ex.: isolate, lock out, tag out, test...",
      sampleAnswer:
        "I should isolate the panel, apply lockout/tagout, test the voltage, and wear PPE before starting.",
      sampleAnswerPt:
        "Eu deveria isolar o painel, aplicar bloqueio/etiquetagem, testar a tensão e usar EPI antes de começar.",
    },
    {
      question: "Do you have to report every small alarm to the Chief Engineer?",
      questionPt: "Você tem que reportar cada pequeno alarme ao chefe de máquinas?",
      hint: "Use 'have to' for obligation and 'don't have to' for no obligation.",
      sampleAnswer:
        "I don't have to report every small alarm, but I must report critical alarms immediately.",
      sampleAnswerPt:
        "Eu não tenho que reportar cada pequeno alarme, mas devo reportar alarmes críticos imediatamente.",
    },
    {
      question: "Could you explain how to test a circuit breaker?",
      questionPt: "Você poderia explicar como testar um disjuntor?",
      hint: "Use 'could' for polite request and sequence words: first, then, after that.",
      sampleAnswer:
        "Yes, I could. First, you should isolate the circuit. Then, you can use a multimeter to test the voltage. After that, you must record the result.",
      sampleAnswerPt:
        "Sim, eu poderia. Primeiro, você deveria isolar o circuito. Depois, pode usar um multímetro para testar a tensão. Após isso, deve registrar o resultado.",
    },
    {
      question: "The generator might be overheating. What does that mean?",
      questionPt: "O gerador pode estar superaquecendo. O que isso significa?",
      hint: "Explain 'might' = possibility. What can you check?",
      sampleAnswer:
        "It means it is possible that the generator is overheating. We should check the cooling system and the temperature sensor.",
      sampleAnswerPt:
        "Significa que é possível que o gerador esteja superaquecendo. Deveríamos verificar o sistema de resfriamento e o sensor de temperatura.",
    },
    {
      question: "Can you work under pressure? Why?",
      questionPt: "Você consegue trabalhar sob pressão? Por quê?",
      hint: "Use 'can' + reason. Ex.: I can work under pressure because I...",
      sampleAnswer:
        "Yes, I can work under pressure because I stay calm, follow procedures, and communicate clearly with the team.",
      sampleAnswerPt:
        "Sim, eu consigo trabalhar sob pressão porque mantenho a calma, sigo os procedimentos e me comunico claramente com a equipe.",
    },
    {
      question: "What must you do in case of an oil spill in the engine room?",
      questionPt: "O que você deve fazer em caso de derramamento de óleo na praça de máquinas?",
      hint: "Use 'must' + emergency actions: stop, contain, report, clean.",
      sampleAnswer:
        "I must stop the source, contain the spill, report it immediately to the Chief Engineer, and follow the SOP for oil spills.",
      sampleAnswerPt:
        "Devo parar a fonte, conter o derramamento, reportar imediatamente ao chefe de máquinas e seguir o POP para derramamento de óleo.",
    },
    {
      question: "Would you like to become a Chief Engineer in the future? Why?",
      questionPt: "Você gostaria de se tornar chefe de máquinas no futuro? Por quê?",
      hint: "Use 'would like to' + ambition. Ex.: I would like to become a Chief Engineer because...",
      sampleAnswer:
        "Yes, I would like to become a Chief Engineer because I want more responsibility and I enjoy leading maintenance teams.",
      sampleAnswerPt:
        "Sim, eu gostaria de me tornar chefe de máquinas porque quero mais responsabilidade e gosto de liderar equipes de manutenção.",
    },
    {
      question: "You see a loose wire near the switchboard. What should you do?",
      questionPt: "Você vê um fio solto perto do quadro elétrico. O que você deveria fazer?",
      hint: "Use 'should' and 'must not'. Ex.: I should..., I must not...",
      sampleAnswer:
        "I should isolate the power first. I must not touch the wire while it is live. Then I should report it to my supervisor.",
      sampleAnswerPt:
        "Eu deveria isolar a energia primeiro. Não devo tocar no fio enquanto estiver energizado. Depois deveria reportar ao meu supervisor.",
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/162568/oil-pump-jack-sunset-clouds-sky-162568.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#faf6f0] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">
        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Cog size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">
              Modal Verbs • Second Engineer • A2–B1
            </span>
            <Cog size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            ⚙️ Modal Verbs for the Second Engineer
          </h1>
          <SpeakSentence
            text="Learn how to use can, could, may, might, must, should, have to, and need to in real maritime situations on board."
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            🛠️ Master modal verbs in real engine-room situations: ability, permission, obligation,
            advice, and possibility. Be sharp, safe, and professional in English.
          </SpeakSentence>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="Second Engineer"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              👆 Clique na imagem para ampliar
            </p>
          </div>
        </div>

        {/* ===================== SECTION 1 – MODAL FORMS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap size={22} /> MODAL FORMS – INTERROGATIVE & NEGATIVE
              </h2>
              <PencilIcon onClick={() => openNoteModal("Modal Forms")} />
            </div>
            <button
              onClick={() => toggleDrill("modalForms")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.modalForms ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Practice the interrogative and negative forms of the main modal verbs."
              className="text-md text-gray-600 mb-4 italic"
            >
              🎧 Click each option to hear the pronunciation. Notice how modals change in
              questions and negatives.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "Can you operate the generator?", pt: "Você consegue operar o gerador?" },
                { en: "I cannot operate the generator.", pt: "Eu não consigo operar o gerador." },
                { en: "May I enter the engine room?", pt: "Posso entrar na praça de máquinas?" },
                {
                  en: "You must not ignore the alarm.",
                  pt: "Você não deve ignorar o alarme.",
                },
                {
                  en: "Should I replace this filter?",
                  pt: "Eu deveria substituir este filtro?",
                },
                {
                  en: "The pump might not start.",
                  pt: "A bomba pode não partir.",
                },
                {
                  en: "Do we have to check the oil?",
                  pt: "Temos que verificar o óleo?",
                },
                {
                  en: "We don't have to replace the filter today.",
                  pt: "Não temos que substituir o filtro hoje.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <SpeakText
                    text={item.en}
                    className="text-orange-700 font-bold cursor-pointer text-left w-full block"
                  >
                    {item.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.modalForms && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {modalFormsSubstitution.map((ex) => {
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

        {/* ===================== SECTION 2 – ABILITY & PERMISSION ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wrench size={22} /> ABILITY & PERMISSION – CAN / COULD / MAY
              </h2>
              <PencilIcon onClick={() => openNoteModal("Ability & Permission")} />
            </div>
            <button
              onClick={() => toggleDrill("abilityPermission")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.abilityPermission ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Use can and could for ability, and may/can for permission."
              className="text-md text-gray-600 mb-4 italic"
            >
              💬 Use CAN/COULD for ability and MAY/CAN for permission. Practice asking and
              answering questions.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  en: "I can troubleshoot electrical faults.",
                  pt: "Eu consigo solucionar falhas elétricas.",
                },
                {
                  en: "Can you operate the PMS?",
                  pt: "Você consegue operar o PMS?",
                },
                {
                  en: "May I use the multimeter, Chief?",
                  pt: "Posso usar o multímetro, chefe?",
                },
                {
                  en: "Could you help me with the switchboard?",
                  pt: "Você poderia me ajudar com o quadro elétrico?",
                },
                {
                  en: "You cannot enter the engine room without PPE.",
                  pt: "Você não pode entrar na praça de máquinas sem EPI.",
                },
                {
                  en: "I couldn't finish the inspection yesterday.",
                  pt: "Eu não consegui terminar a inspeção ontem.",
                },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={[
                    "can",
                    "could",
                    "may",
                    "cannot",
                    "couldn't",
                    "PMS",
                    "PPE",
                    "multimeter",
                  ]}
                  translation={item.pt}
                />
              ))}
            </div>

            {openDrills.abilityPermission && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {abilityPermissionSubstitution.map((ex) => {
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

        {/* ===================== SECTION 3 – OBLIGATION ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <ShieldCheck size={22} /> OBLIGATION – MUST / HAVE TO / NEED TO
              </h2>
              <PencilIcon onClick={() => openNoteModal("Obligation")} />
            </div>
            <button
              onClick={() => toggleDrill("obligation")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.obligation ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Use must and have to for obligation, and must not for prohibition."
              className="text-md text-gray-600 mb-4 italic"
            >
              🦺 MUST and HAVE TO show obligation. MUST NOT shows prohibition. DON'T HAVE TO
              shows no obligation.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  en: "We must follow the safety procedures.",
                  pt: "Devemos seguir os procedimentos de segurança.",
                },
                {
                  en: "Do we have to test the emergency generator?",
                  pt: "Temos que testar o gerador de emergência?",
                },
                {
                  en: "You must not smoke in the engine room.",
                  pt: "Você não deve fumar na praça de máquinas.",
                },
                {
                  en: "We don't have to replace the filter today.",
                  pt: "Não temos que substituir o filtro hoje.",
                },
                {
                  en: "The Second Engineer must supervise the maintenance.",
                  pt: "O segundo oficial de máquinas deve supervisionar a manutenção.",
                },
                {
                  en: "Do I need to wear a gas detector?",
                  pt: "Preciso usar um detector de gás?",
                },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={[
                    "must",
                    "have to",
                    "need to",
                    "must not",
                    "don't have to",
                    "safety",
                    "supervise",
                  ]}
                  translation={item.pt}
                />
              ))}
            </div>

            {openDrills.obligation && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {obligationSubstitution.map((ex) => {
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

        {/* ===================== SECTION 4 – ADVICE ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HardHat size={22} /> ADVICE – SHOULD / OUGHT TO
              </h2>
              <PencilIcon onClick={() => openNoteModal("Advice")} />
            </div>
            <button
              onClick={() => toggleDrill("advice")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.advice ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Use should and ought to for advice and recommendations."
              className="text-md text-gray-600 mb-4 italic"
            >
              💡 SHOULD gives advice. SHOULDN'T gives negative advice. Use it to recommend safe
              actions.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  en: "You should check the oil pressure.",
                  pt: "Você deveria verificar a pressão do óleo.",
                },
                {
                  en: "Should I replace this filter?",
                  pt: "Eu deveria substituir este filtro?",
                },
                {
                  en: "You shouldn't run the pump dry.",
                  pt: "Você não deveria operar a bomba a seco.",
                },
                {
                  en: "We should report the problem to the Chief Engineer.",
                  pt: "Deveríamos reportar o problema ao chefe de máquinas.",
                },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={["should", "shouldn't", "oil", "pump", "report"]}
                  translation={item.pt}
                />
              ))}
            </div>

            {openDrills.advice && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {adviceSubstitution.map((ex) => {
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

        {/* ===================== SECTION 5 – POSSIBILITY ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <AlertTriangle size={22} /> POSSIBILITY & DEDUCTION – MAY / MIGHT / COULD / MUST
              </h2>
              <PencilIcon onClick={() => openNoteModal("Possibility")} />
            </div>
            <button
              onClick={() => toggleDrill("possibility")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.possibility ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Use may, might, and could for possibility. Use must for strong deduction."
              className="text-md text-gray-600 mb-4 italic"
            >
              🔍 MAY/MIGHT/COULD = possibility. MUST BE = strong deduction. CAN'T BE = impossible.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                {
                  en: "The pump might fail under load.",
                  pt: "A bomba pode falhar sob carga.",
                },
                {
                  en: "It could be a problem with the sensor.",
                  pt: "Pode ser um problema no sensor.",
                },
                {
                  en: "It must be the main circuit breaker.",
                  pt: "Deve ser o disjuntor principal.",
                },
                {
                  en: "It can't be a wiring problem.",
                  pt: "Não pode ser um problema na fiação.",
                },
                {
                  en: "Could the generator be overheating?",
                  pt: "O gerador pode estar superaquecendo?",
                },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={["might", "could", "must", "can't", "pump", "sensor", "overheating"]}
                  translation={item.pt}
                />
              ))}
            </div>

            {openDrills.possibility && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {possibilitySubstitution.map((ex) => {
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

        {/* ===================== SECTION 6 – SITUATIONS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare size={22} /> REAL SITUATIONS ON BOARD
              </h2>
              <PencilIcon onClick={() => openNoteModal("Situations")} />
            </div>
            <button
              onClick={() => toggleDrill("situations")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.situations ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="What would you say in these real engine-room situations? Choose the best modal."
              className="text-md text-gray-600 mb-4 italic"
            >
              🚨 Choose the best modal for each situation and practice your response out loud.
            </SpeakSentence>

            <div className="mb-6">
              <img
                src={secondaryImage}
                alt="Engine room situation"
                onClick={() => setIsSecondaryImageModalOpen(true)}
                className="w-full max-w-xl mx-auto h-auto object-contain rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                👆 Clique na imagem para ampliar
              </p>
            </div>

            {openDrills.situations && (
              <div
                className="mt-4 bg-orange-50 rounded-2xl p-6 space-y-4"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {situationsSubstitution.map((ex) => {
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

        {/* ===================== SECTION 7 – OPEN-ENDED QUESTIONS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HelpCircle size={22} /> OPEN-ENDED QUESTIONS – SPEAK UP!
              </h2>
              <PencilIcon onClick={() => openNoteModal("Open Questions")} />
            </div>
            <button
              onClick={() => toggleDrill("openQuestions")}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.openQuestions ? "Hide Questions" : "Show Questions"}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Answer these questions out loud. Use the modal verbs you learned."
              className="text-md text-gray-600 mb-4 italic"
            >
              🗣️ These open questions help you think fast and use modals naturally. Try to answer
              in full sentences.
            </SpeakSentence>
            {openDrills.openQuestions && (
              <div
                className="mt-4 space-y-6"
                style={{ animation: "fadeIn 0.3s ease-out" }}
              >
                {openQuestions.map((q, idx) => (
                  <OpenQuestionCard
                    key={idx}
                    index={idx + 1}
                    question={q.question}
                    questionPt={q.questionPt}
                    hint={q.hint}
                    sampleAnswer={q.sampleAnswer}
                    sampleAnswerPt={q.sampleAnswerPt}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== EQUIPMENT IMAGES ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔧 EQUIPMENT & TOOLS</h2>
            <SpeakSentence
              text="Click on the images to enlarge. Use the modal verbs to talk about what you can, must, and should do with each tool."
              className="mt-2 text-orange-100 italic text-sm"
            >
              ⚡ What can you do with each tool? What must you check before using it?
            </SpeakSentence>
          </div>
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={equipmentImage}
                alt="Electrical tools"
                onClick={() => setIsEquipmentImageModalOpen(true)}
                className="w-full h-auto object-contain rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                👆 Clique para ampliar
              </p>
            </div>
            <div>
              <img
                src={equipmentImage2}
                alt="Electrical equipment"
                onClick={() => setIsEquipmentImage2ModalOpen(true)}
                className="w-full h-auto object-contain rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">
                👆 Clique para ampliar
              </p>
            </div>
          </div>
          <div className="px-8 pb-8">
            <div className="bg-orange-50 p-4 rounded-2xl space-y-3">
              <p className="font-bold text-orange-800 mb-2">⚡ Practice with modals:</p>
              {[
                {
                  en: "I can use a multimeter to test voltage.",
                  pt: "Eu consigo usar um multímetro para testar tensão.",
                },
                {
                  en: "You must wear insulated gloves when working on live circuits.",
                  pt: "Você deve usar luvas isolantes ao trabalhar em circuitos energizados.",
                },
                {
                  en: "You should check the calibration before using the tester.",
                  pt: "Você deveria verificar a calibração antes de usar o testador.",
                },
                {
                  en: "The clamp meter might be in the workshop.",
                  pt: "O alicate amperímetro pode estar na oficina.",
                },
                {
                  en: "May I borrow the thermal camera?",
                  pt: "Posso pegar emprestada a câmera termográfica?",
                },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  greenWords={["can", "must", "should", "might", "may", "multimeter", "gloves"]}
                  translation={item.pt}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===================== WRAP UP ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence
              text="Key modal verbs and expressions to remember"
              className="mt-2 text-orange-100 italic"
            >
              📝 Key modal verbs and expressions to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY MODALS</h3>
              {[
                { en: "Can you operate the PMS?", pt: "Você consegue operar o PMS?" },
                { en: "May I enter the engine room?", pt: "Posso entrar na praça de máquinas?" },
                {
                  en: "We must follow the safety procedures.",
                  pt: "Devemos seguir os procedimentos de segurança.",
                },
                {
                  en: "You should check the oil pressure.",
                  pt: "Você deveria verificar a pressão do óleo.",
                },
                {
                  en: "The pump might fail under load.",
                  pt: "A bomba pode falhar sob carga.",
                },
                {
                  en: "It must be the main circuit breaker.",
                  pt: "Deve ser o disjuntor principal.",
                },
                {
                  en: "We don't have to replace the filter today.",
                  pt: "Não temos que substituir o filtro hoje.",
                },
              ].map((item, idx) => (
                <div key={idx}>
                  <SpeakSentence
                    text={item.en}
                    className="text-orange-200 hover:text-white"
                  >
                    • {item.en}
                  </SpeakSentence>
                  <p className="text-orange-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-gray-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-orange-200">
                    <li>
                      <strong className="text-white">Can / Could</strong> = ability or polite
                      request.
                    </li>
                    <li>
                      <strong className="text-white">May</strong> = formal permission.
                    </li>
                    <li>
                      <strong className="text-white">Must</strong> = strong obligation or
                      deduction.
                    </li>
                    <li>
                      <strong className="text-white">Must not</strong> = prohibition.
                    </li>
                    <li>
                      <strong className="text-white">Don't have to</strong> = no obligation.
                    </li>
                    <li>
                      <strong className="text-white">Should</strong> = advice.
                    </li>
                    <li>
                      <strong className="text-white">Might / May / Could</strong> = possibility.
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-gray-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-orange-200 text-sm">
                    Modals are followed by the base form of the verb: "must go", not "must to
                    go". In questions, invert the modal and subject: "Can you...?" In negatives,
                    add "not": "cannot / can't".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson64")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson66")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* IMAGE MODALS */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Second Engineer"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isSecondaryImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsSecondaryImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={secondaryImage}
              alt="Engine room"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsSecondaryImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isEquipmentImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsEquipmentImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={equipmentImage}
              alt="Electrical tools"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsEquipmentImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isEquipmentImage2ModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsEquipmentImage2ModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={equipmentImage2}
              alt="Electrical equipment"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsEquipmentImage2ModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
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