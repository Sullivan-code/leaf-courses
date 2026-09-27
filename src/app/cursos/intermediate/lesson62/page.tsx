"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Volume2,
  Eye,
  EyeOff,
  Play,
  Pause,
  Rewind,
  FastForward,
  RotateCcw,
  Plus,
  Trash2,
  User,
  MessageSquare,
  Instagram,
} from "lucide-react";

type SectionKey = "listen" | "substitution" | "negative" | "dialogue" | "past" | "tuneIn";

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

interface DialogueLine {
  id: string;
  character: string;
  text: string;
}

// ============================================
// SPEECH SYSTEM – AMERICAN VOICES (vozes naturais)
// ============================================
const getVoices = () => {
  if (typeof window === "undefined") return { female: null, male: null };
  const voices = window.speechSynthesis.getVoices();

  const femaleVoice =
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Microsoft Aria") ||
          v.name.includes("Microsoft Jenny") ||
          v.name.includes("Microsoft Michelle") ||
          v.name.includes("Microsoft Ana"))
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        v.name.includes("Google US English") &&
        !v.name.toLowerCase().includes("male")
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Samantha") || v.name.includes("Siri"))
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("aria"))
    ) ||
    voices.find((v) => v.lang === "en-US");

  const maleVoice =
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Microsoft Guy") ||
          v.name.includes("Microsoft Davis") ||
          v.name.includes("Microsoft Andrew") ||
          v.name.includes("Microsoft Brian") ||
          v.name.includes("Microsoft Christopher") ||
          v.name.includes("Microsoft Eric") ||
          v.name.includes("Microsoft Roger") ||
          v.name.includes("Microsoft Steffan"))
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        v.name.includes("Google US English") &&
        v.name.toLowerCase().includes("male")
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Alex") ||
          v.name.includes("Daniel") ||
          v.name.includes("Fred") ||
          v.name.includes("Tom") ||
          v.name.includes("Oliver"))
    ) ||
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("james"))
    ) ||
    voices.find((v) => v.lang === "en-US" && v !== femaleVoice);

  return { female: femaleVoice, male: maleVoice };
};

const speakEnglish = (
  text: string,
  rate = 0.9,
  gender: "female" | "male" = "female"
) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = gender === "female" ? 1.05 : 0.95;

  const { female, male } = getVoices();
  const voice = gender === "female" ? female : male;
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};

const speakDialogueAlternating = (
  lines: { character: string; text: string }[],
  rate = 0.88
) => {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();

  const { female, male } = getVoices();
  const valid = lines.filter((l) => l.text.trim());

  valid.forEach((line, index) => {
    const gender: "female" | "male" = index % 2 === 0 ? "female" : "male";
    const voice = gender === "female" ? female : male;

    const utterance = new SpeechSynthesisUtterance(
      `${line.character || "Speaker"}: ${line.text}`
    );
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = gender === "female" ? 1.05 : 0.95;
    if (voice) utterance.voice = voice;

    window.speechSynthesis.speak(utterance);
  });
};

const SpeakSentence = ({
  text,
  children,
  className = "",
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={() => {
      const speechText =
        children && typeof children === "string" ? children : text;
      speakEnglish(speechText, 0.85, "female");
    }}
    className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left w-full ${className}`}
  >
    {children || text}
    <Volume2
      size={12}
      className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500"
    />
  </button>
);

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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
            onClick={() => {
              onSave(note);
              onClose();
            }}
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
// SUBSTITUTION COMPONENT
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

  const isObjectOption = (
    opt: OptionType
  ): opt is { label: string; replacement: string; pt?: string } =>
    typeof opt === "object" && opt !== null && "label" in opt && "replacement" in opt;

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentPt: string | undefined;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentPt = currentOption.pt;
  } else {
    currentSentence = String(currentOption);
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <button
          onClick={() => setShowEnglish((v) => !v)}
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
              const rep = isObjectOption(option) ? option.replacement : String(option);
              speakEnglish(rep, 0.9, "female");
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {isObjectOption(option) ? option.label : String(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// AUDIO PLAYER
// ============================================
const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current || new Audio(src);
    if (!audioRef.current) audioRef.current = audio;
    else audio.src = src;

    const updateProgress = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [src]);

  return (
    <div className="flex items-center gap-3 bg-white/90 rounded-full px-4 py-2 shadow-md border border-green-300">
      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          if (isPlaying) a.pause();
          else a.play().catch((err) => console.error("Audio error:", err));
          setIsPlaying(!isPlaying);
        }}
        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        title={isPlaying ? "Pausar" : "Play"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>

      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          a.currentTime = Math.max(0, a.currentTime - 5);
        }}
        className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
        title="Voltar 5 segundos"
      >
        <Rewind size={18} />
      </button>

      <div
        ref={progressBarRef}
        className="w-32 h-2 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
        onClick={(e) => {
          const a = audioRef.current;
          if (!a || !progressBarRef.current) return;
          const rect = progressBarRef.current.getBoundingClientRect();
          const percent = (e.clientX - rect.left) / rect.width;
          a.currentTime = percent * a.duration;
          setProgress(percent * 100);
        }}
      >
        <div
          className="h-full bg-green-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          a.currentTime = Math.min(a.duration || 0, a.currentTime + 5);
        }}
        className="p-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
        title="Avançar 5 segundos"
      >
        <FastForward size={18} />
      </button>

      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          a.pause();
          a.currentTime = 0;
          setIsPlaying(false);
          setProgress(0);
        }}
        className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
        title="Reiniciar"
      >
        <RotateCcw size={16} />
      </button>

      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ============================================
// TUNE IN TEXT CONSTANTS
// ============================================
const TUNE_IN_TEXT = `There are several rooms in my house, and each room has different furniture. My living room is usually very tidy. There is a comfortable sofa in the middle of the room, and there is an armchair next to the window. There is also a coffee table in front of the sofa. To the left of the sofa, there is a small desk with my laptop on it. There are some books on the desk, and there is a lamp next to the computer. Everything is usually organized, but sometimes my living room gets a little messy. My bedroom is next to the living room. There is a large bed in the bedroom, and there is a dresser to the right of the bed. There is also a closet next to the dresser. My clothes are usually inside the closet, but sometimes there are clothes on the floor! There is a small carpet under the bed, and there are two chairs near the window. One of the chairs is broken, so I need to replace it. In the kitchen, there are several cabinets, a refrigerator, and a large table. There is a beautiful coffee table in the living room, but there isn't one in the kitchen. There are also some chairs around the table. I like keeping my house clean and organized. When everything is in the right place, I feel more comfortable and relaxed.`;

const TUNE_IN_QUESTIONS = [
  "Is the person's living room usually tidy or messy?",
  "What is next to the window?",
  "What is there to the left of the sofa?",
  "What is on the desk?",
  "Is there a coffee table in the living room?",
  "Where is the bedroom?",
  "What is to the right of the bed?",
  "What is next to the dresser?",
  "Are there clothes on the floor?",
  "What is broken?",
  "What is there in the kitchen?",
  "Is there a coffee table in the kitchen?",
  "Why does the person like keeping the house organized?",
  "Is your house usually tidy or messy?",
  "What furniture is there in your bedroom?",
  "Is there a desk in your bedroom?",
  "What is next to your bed?",
  "What is to the left of your sofa?",
];

// ============================================
// MAIN COMPONENT – LESSON 62
// ============================================
export default function Lesson62() {
  const router = useRouter();

  const [openDrills, setOpenDrills] = useState({
    listen: true,
    substitution: true,
    negative: true,
    dialogue: true,
    past: true,
    tuneIn: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const [negAnswers, setNegAnswers] = useState<Record<string, string>>({});
  const [negChecked, setNegChecked] = useState<Record<string, boolean>>({});
  const [negResults, setNegResults] = useState<Record<string, boolean>>({});

  const [pastAnswers, setPastAnswers] = useState<Record<string, string>>({});
  const [pastChecked, setPastChecked] = useState<Record<string, boolean>>({});
  const [pastResults, setPastResults] = useState<Record<string, boolean>>({});

  const [dialogueLines, setDialogueLines] = useState<DialogueLine[]>([
    { id: "line-1", character: "Sullivan", text: "Hello! How are you today?" },
    { id: "line-2", character: "Student", text: "I'm fine, thank you! And you?" },
  ]);

  const [tuneInAnswers, setTuneInAnswers] = useState<Record<string, string>>({});

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string>("");

  // ============ LOAD SAVED ============
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    const saved = localStorage.getItem("lesson62Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setAnswers(data.answers || {});
        setChecked(data.checked || {});
        setResults(data.results || {});
        setSubstitutionState(data.substitutionState || {});
        setNegAnswers(data.negAnswers || {});
        setNegChecked(data.negChecked || {});
        setNegResults(data.negResults || {});
        setPastAnswers(data.pastAnswers || {});
        setPastChecked(data.pastChecked || {});
        setPastResults(data.pastResults || {});
        setSavedNotes(data.savedNotes || {});
        if (data.dialogueLines) setDialogueLines(data.dialogueLines);
        if (data.tuneInAnswers) setTuneInAnswers(data.tuneInAnswers);
      } catch (e) {
        console.error("Erro ao carregar:", e);
      }
    }
  }, []);

  const saveAll = () => {
    try {
      localStorage.setItem(
        "lesson62Answers",
        JSON.stringify({
          answers,
          checked,
          results,
          substitutionState,
          negAnswers,
          negChecked,
          negResults,
          pastAnswers,
          pastChecked,
          pastResults,
          savedNotes,
          dialogueLines,
          tuneInAnswers,
        })
      );
      alert("✅ Progresso salvo!");
    } catch {
      alert("❌ Erro ao salvar.");
    }
  };

  const clearAll = () => {
    if (confirm("Limpar TODAS as respostas?")) {
      setAnswers({});
      setChecked({});
      setResults({});
      setSubstitutionState({});
      setNegAnswers({});
      setNegChecked({});
      setNegResults({});
      setPastAnswers({});
      setPastChecked({});
      setPastResults({});
      setDialogueLines([
        { id: "line-1", character: "Sullivan", text: "Hello! How are you today?" },
        { id: "line-2", character: "Student", text: "I'm fine, thank you! And you?" },
      ]);
      setTuneInAnswers({});
      localStorage.removeItem("lesson62Answers");
    }
  };

  const toggleDrill = (section: SectionKey) =>
    setOpenDrills((prev) => ({ ...prev, [section]: !prev[section] }));

  const openNoteModal = (sectionTitle: string) =>
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || "",
    });

  const saveNote = (note: string) =>
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));

  // ============ LISTEN AND NUMBER ============
  const numberItems = [
    { key: "img1", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-1.png", correctAnswer: 5 },
    { key: "img2", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-2.png", correctAnswer: 7 },
    { key: "img3", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-3.png", correctAnswer: 4 },
    { key: "img4", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-4.png", correctAnswer: 2 },
    { key: "img5", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-5.png", correctAnswer: 6 },
    { key: "img6", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-6.png", correctAnswer: 3 },
    { key: "img7", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-7.png", correctAnswer: 8 },
    { key: "img8", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/img62-8.png", correctAnswer: 1 },
  ];
  const NUMBER_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8];

  const selectNumber = (key: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setChecked((prev) => ({ ...prev, [key]: false }));
    setResults((prev) => {
      const c = { ...prev };
      delete c[key];
      return c;
    });
  };

  const checkNumber = (key: string) => {
    const item = numberItems.find((i) => i.key === key);
    if (!item) return;
    setResults((prev) => ({ ...prev, [key]: answers[key] === item.correctAnswer }));
    setChecked((prev) => ({ ...prev, [key]: true }));
  };

  // ============ SUBSTITUTION ============
  const substitutionExercises: SubstitutionExercise[] = [
    {
      key: "sub-1",
      original: "There are many people here. / bags / chairs",
      options: [
        { label: "people", replacement: "There are many people here.", pt: "Tem muitas pessoas aqui." },
        { label: "bags", replacement: "There are many bags here.", pt: "Tem muitas sacolas aqui." },
        { label: "chairs", replacement: "There are many chairs here.", pt: "Tem muitas cadeiras aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub-2",
      original: "Put your books away, please. / clothes / dresses",
      options: [
        { label: "books", replacement: "Put your books away, please.", pt: "Guarde seus livros, por favor." },
        { label: "clothes", replacement: "Put your clothes away, please.", pt: "Guarde suas roupas, por favor." },
        { label: "dresses", replacement: "Put your dresses away, please.", pt: "Guarde seus vestidos, por favor." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub-3",
      original: "Is there an electronic box near here? / a shopping mall / a garage sale",
      options: [
        { label: "an electronic box", replacement: "Is there an electronic box near here?", pt: "Tem uma caixa eletrônica aqui perto?" },
        { label: "a shopping mall", replacement: "Is there a shopping mall near here?", pt: "Tem um shopping aqui perto?" },
        { label: "a garage sale", replacement: "Is there a garage sale near here?", pt: "Tem um bazar/garagem aqui perto?" },
      ],
      currentIndex: 0,
    },
    {
      key: "sub-4",
      original: "There aren't any chairs in this room. / armchairs",
      options: [
        { label: "chairs", replacement: "There aren't any chairs in this room.", pt: "Não tem cadeiras nesta sala." },
        { label: "armchairs", replacement: "There aren't any armchairs in this room.", pt: "Não tem poltronas nesta sala." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub-5",
      original: "Move the dresser to the right, please. / desk / closet",
      options: [
        { label: "dresser", replacement: "Move the dresser to the right, please.", pt: "Mova a cômoda para a direita, por favor." },
        { label: "desk", replacement: "Move the desk to the right, please.", pt: "Mova a escrivaninha para a direita, por favor." },
        { label: "closet", replacement: "Move the closet to the right, please.", pt: "Mova o guarda-roupa para a direita, por favor." },
      ],
      currentIndex: 0,
    },
  ];

  const handleOptionClick = (key: string, index: number) =>
    setSubstitutionState((prev) => ({ ...prev, [key]: index }));

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  const getExerciseWithIndex = (key: string) => {
    const ex = substitutionExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============ CHANGE INTO NEGATIVE ============
  const negativeExercises = [
    { id: "neg1", sentence: "There is a drugstore near here.", correctAnswer: "There isn't a drugstore near here." },
    { id: "neg2", sentence: "There are many people in the store.", correctAnswer: "There aren't many people in the store." },
    { id: "neg3", sentence: "There is a dresser in my bedroom.", correctAnswer: "There isn't a dresser in my bedroom." },
    { id: "neg4", sentence: "There are some broken tablets in this drawer.", correctAnswer: "There aren't any broken tablets in this drawer." },
    { id: "neg5", sentence: "There is a message for you.", correctAnswer: "There isn't a message for you." },
  ];

  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    const normalize = (text: string) =>
      text
        .toLowerCase()
        .trim()
        .replace(/[.,?!]/g, "")
        .replace(/\bisn't\b/g, "is not")
        .replace(/\baren't\b/g, "are not")
        .replace(/\bdon't\b/g, "do not")
        .replace(/\bdoesn't\b/g, "does not")
        .replace(/\s+/g, " ");
    return normalize(userAnswer) === normalize(correctAnswer);
  };

  const handleNegChange = (id: string, value: string) =>
    setNegAnswers((prev) => ({ ...prev, [id]: value }));

  const checkNeg = (id: string) => {
    const ex = negativeExercises.find((e) => e.id === id);
    if (!ex) return;
    setNegResults((prev) => ({ ...prev, [id]: checkAnswer(negAnswers[id] || "", ex.correctAnswer) }));
    setNegChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ CHANGE INTO THE PAST ============
  const pastImage =
    "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/62-verbsinthepast.png";

  const pastExercises = [
    {
      id: "past1",
      present: "There is a comfortable sofa in the living room.",
      correctAnswer: "There was a comfortable sofa in the living room.",
      pt: "Havia um sofá confortável na sala de estar.",
    },
    {
      id: "past2",
      present: "There are many books on the desk.",
      correctAnswer: "There were many books on the desk.",
      pt: "Havia muitos livros sobre a escrivaninha.",
    },
    {
      id: "past3",
      present: "I move the dresser to the right every week.",
      correctAnswer: "I moved the dresser to the right last week.",
      pt: "Eu movi a cômoda para a direita na semana passada.",
    },
    {
      id: "past4",
      present: "She puts her clothes away in the closet.",
      correctAnswer: "She put her clothes away in the closet.",
      pt: "Ela guardou suas roupas no guarda-roupa.",
    },
    {
      id: "past5",
      present: "There is an armchair next to the window.",
      correctAnswer: "There was an armchair next to the window.",
      pt: "Havia uma poltrona ao lado da janela.",
    },
    {
      id: "past6",
      present: "There are two chairs near the window.",
      correctAnswer: "There were two chairs near the window.",
      pt: "Havia duas cadeiras perto da janela.",
    },
    {
      id: "past7",
      present: "He moves the desk to the left of the sofa.",
      correctAnswer: "He moved the desk to the left of the sofa.",
      pt: "Ele moveu a escrivaninha para a esquerda do sofá.",
    },
    {
      id: "past8",
      present: "They put the books on the coffee table.",
      correctAnswer: "They put the books on the coffee table.",
      pt: "Eles colocaram os livros na mesa de centro.",
    },
    {
      id: "past9",
      present: "There is a small carpet under the bed.",
      correctAnswer: "There was a small carpet under the bed.",
      pt: "Havia um pequeno tapete embaixo da cama.",
    },
    {
      id: "past10",
      present: "We put the chairs around the large table.",
      correctAnswer: "We put the chairs around the large table.",
      pt: "Nós colocamos as cadeiras ao redor da mesa grande.",
    },
  ];

  const handlePastChange = (id: string, value: string) =>
    setPastAnswers((prev) => ({ ...prev, [id]: value }));

  const checkPast = (id: string) => {
    const ex = pastExercises.find((e) => e.id === id);
    if (!ex) return;
    setPastResults((prev) => ({ ...prev, [id]: checkAnswer(pastAnswers[id] || "", ex.correctAnswer) }));
    setPastChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ CREATE A DIALOGUE ============
  const addDialogueLine = () => {
    const newId = `line-${Date.now()}`;
    setDialogueLines((prev) => [...prev, { id: newId, character: "", text: "" }]);
  };

  const removeDialogueLine = (id: string) => {
    if (dialogueLines.length <= 1) return;
    setDialogueLines((prev) => prev.filter((l) => l.id !== id));
  };

  const updateDialogueLine = (
    id: string,
    field: "character" | "text",
    value: string
  ) => {
    setDialogueLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const speakFullDialogue = () => {
    speakDialogueAlternating(
      dialogueLines.map((l) => ({ character: l.character, text: l.text })),
      0.88
    );
  };

  // ============ TUNE IN HANDLERS ============
  const updateTuneInAnswer = (key: string, value: string) =>
    setTuneInAnswers((prev) => ({ ...prev, [key]: value }));

  // ============ IMAGEM DO BONECO LEGO ============
  const legoImage =
    "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%2027%20de%20set.%20de%202026%2C%2000_46_46.png";

  // ============ ÁUDIO DO TUNE IN ============
  const tuneInAudio =
    "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Record%20(online-voice-recorder.com)%20(2).mp3";

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
        {/* ============ CABEÇALHO ============ */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🏠 Lesson 62 – Listen and Number
          </h1>
          <SpeakSentence
            text="Listen to the audio and choose the correct number for each image."
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            📚 Listen to the audio and choose the correct number for each image.
          </SpeakSentence>

          <div className="flex justify-center mb-6">
            <AudioPlayer src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/62listenandnumber%20(online-audio-converter.com).mp3" />
          </div>

          <div className="flex justify-center items-center gap-4 flex-wrap">
            <button
              onClick={saveAll}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full transition"
            >
              💾 Salvar Progresso
            </button>
            <button
              onClick={clearAll}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition"
            >
              🗑️ Limpar Tudo
            </button>
          </div>
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 1 – LISTEN AND NUMBER */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Listen and Number</h2>
              <PencilIcon onClick={() => openNoteModal("Listen and Number")} />
            </div>
            <button
              onClick={() => toggleDrill("listen")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.listen ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.listen && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Listen to the audio and write the correct number for each image."
                className="text-md text-gray-600 mb-6 italic"
              >
                🎧 Listen to the audio and write the correct number for each image.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {numberItems.map((item) => (
                    <div
                      key={item.key}
                      className="bg-white border-2 border-green-200 rounded-2xl shadow-md p-5 flex flex-col"
                    >
                      <div className="w-full h-[200px] relative mb-4 rounded-xl overflow-hidden border border-green-200 cursor-pointer">
                        <Image
                          src={item.image}
                          alt={`Imagem ${item.key}`}
                          fill
                          className="object-contain bg-white"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          onClick={() => {
                            setModalImg(item.image);
                            setIsImageModalOpen(true);
                          }}
                        />
                      </div>

                      <p className="text-sm font-semibold text-green-700 mb-2">
                        Escolha o número:
                      </p>
                      <div className="grid grid-cols-4 gap-2 mb-3">
                        {NUMBER_OPTIONS.map((num) => {
                          const isSelected = answers[item.key] === num;
                          return (
                            <button
                              key={num}
                              onClick={() => selectNumber(item.key, num)}
                              className={`py-2 rounded-lg font-bold border-2 transition ${
                                isSelected
                                  ? "bg-green-600 text-white border-green-700 scale-105"
                                  : "bg-white text-green-700 border-green-300 hover:bg-green-100"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => checkNumber(item.key)}
                          disabled={answers[item.key] === undefined}
                          className={`flex-1 py-2 px-3 rounded-md font-medium transition text-sm ${
                            answers[item.key] === undefined
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          Verificar
                        </button>
                        <button
                          onClick={() => {
                            setAnswers((prev) => {
                              const c = { ...prev };
                              delete c[item.key];
                              return c;
                            });
                            setChecked((prev) => ({ ...prev, [item.key]: false }));
                            setResults((prev) => {
                              const c = { ...prev };
                              delete c[item.key];
                              return c;
                            });
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Limpar
                        </button>
                      </div>

                      {checked[item.key] && (
                        <div className="mt-2">
                          {results[item.key] ? (
                            <div className="p-2 bg-green-50 border border-green-300 rounded-md text-sm text-green-700 font-medium">
                              ✓ Correto! O número é {item.correctAnswer}.
                            </div>
                          ) : (
                            <div className="p-2 bg-red-50 border border-red-300 rounded-md text-sm text-red-700">
                              ✗ Esperado: {item.correctAnswer}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 2 – SUBSTITUTION PRACTICE */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice</h2>
              <PencilIcon onClick={() => openNoteModal("Substitution Practice")} />
            </div>
            <button
              onClick={() => toggleDrill("substitution")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.substitution ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.substitution && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Click on each option to hear the pronunciation and practice the substitution."
                className="text-md text-gray-600 mb-4 italic"
              >
                🎧 Click on each option to hear the pronunciation and practice the substitution.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {substitutionExercises.map((ex) => {
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
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 3 – CHANGE INTO NEGATIVE */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Negative</h2>
              <PencilIcon onClick={() => openNoteModal("Change into Negative")} />
            </div>
            <button
              onClick={() => toggleDrill("negative")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.negative ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.negative && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Transform the affirmative sentences into negative using isn't / aren't."
                className="text-md text-gray-600 mb-4 italic"
              >
                📝 Transform the affirmative sentences into negative using isn't / aren't.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {negativeExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-4 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-green-700 mb-2">
                      {exercise.sentence}
                    </p>
                    <div className="flex items-start gap-3">
                      <input
                        type="text"
                        value={negAnswers[exercise.id] || ""}
                        onChange={(e) => handleNegChange(exercise.id, e.target.value)}
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Write the negative form"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => checkNeg(exercise.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleNegChange(exercise.id, "");
                            setNegChecked((prev) => ({ ...prev, [exercise.id]: false }));
                            setNegResults((prev) => {
                              const c = { ...prev };
                              delete c[exercise.id];
                              return c;
                            });
                          }}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    {negChecked[exercise.id] && (
                      <div className="mt-2">
                        {negResults[exercise.id] ? (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 font-medium">
                            ✓ Correct!
                          </div>
                        ) : (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            <span className="font-medium">Expected:</span>{" "}
                            {exercise.correctAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 4 – CREATE A DIALOGUE */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Create a Dialogue</h2>
              <PencilIcon onClick={() => openNoteModal("Create a Dialogue")} />
            </div>
            <button
              onClick={() => toggleDrill("dialogue")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.dialogue ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.dialogue && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              {/* BONECO LEGO + INSTAGRAM */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-8 bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <div
                  className="relative w-full md:w-72 lg:w-80 bg-white rounded-2xl shadow-lg border-4 border-green-400 cursor-pointer flex-shrink-0 overflow-hidden p-3"
                  onClick={() => {
                    setModalImg(legoImage);
                    setIsImageModalOpen(true);
                  }}
                >
                  <Image
                    src={legoImage}
                    alt="Boneco LEGO do Sullivan"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    sizes="(max-width: 768px) 100vw, 320px"
                    priority
                  />
                </div>

                <div className="text-center md:text-left flex-1">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Hi! I'm Sullivan 👋
                  </h3>
                  <p className="text-green-700 mb-3">
                    Let's create a dialogue together! Add your lines, choose
                    characters, and practice speaking English.
                  </p>
                  <a
                    href="https://instagram.com/Sullivan.teacher"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold py-2 px-5 rounded-full hover:opacity-90 transition"
                  >
                    <Instagram size={18} />
                    @Sullivan.teacher
                  </a>
                </div>
              </div>

              <SpeakSentence
                text="Create your own dialogue with a teacher or another student. Add as many lines as you want."
                className="text-md text-gray-600 mb-6 italic"
              >
                💬 Create your own dialogue with a teacher or another student. Add as many lines as you want.
              </SpeakSentence>

              {/* DIÁLOGO */}
              <div className="bg-green-50 rounded-2xl p-6 space-y-4">
                {dialogueLines.map((line, index) => {
                  const isFemale = index % 2 === 0;
                  return (
                    <div
                      key={line.id}
                      className={`bg-white p-4 rounded-xl border-2 shadow-sm ${
                        isFemale ? "border-pink-200" : "border-blue-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-gray-500">
                          Line {index + 1}
                        </span>
                        <button
                          onClick={() => removeDialogueLine(line.id)}
                          disabled={dialogueLines.length <= 1}
                          className={`p-1 rounded transition ${
                            dialogueLines.length <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                          title="Remover linha"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row gap-3">
                        <div className="md:w-48 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                          <User size={16} className="text-green-600 flex-shrink-0" />
                          <input
                            type="text"
                            value={line.character}
                            onChange={(e) =>
                              updateDialogueLine(line.id, "character", e.target.value)
                            }
                            placeholder="Character name"
                            className="flex-1 bg-transparent outline-none text-sm font-medium text-green-700 placeholder-green-400"
                          />
                        </div>
                        <div className="flex-1 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2">
                          <MessageSquare size={16} className="text-green-600 flex-shrink-0" />
                          <input
                            type="text"
                            value={line.text}
                            onChange={(e) =>
                              updateDialogueLine(line.id, "text", e.target.value)
                            }
                            placeholder="Type the dialogue here..."
                            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
                          />
                        </div>
                        <button
                          onClick={() =>
                            speakEnglish(
                              line.text || "",
                              0.85,
                              isFemale ? "female" : "male"
                            )
                          }
                          disabled={!line.text.trim()}
                          className={`p-2 rounded-lg transition ${
                            line.text.trim()
                              ? isFemale
                                ? "bg-pink-500 text-white hover:bg-pink-600"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                          title="Ouvir esta fala"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={addDialogueLine}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  <Plus size={20} />
                  Add Dialogue Line
                </button>

                <button
                  onClick={speakFullDialogue}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition"
                >
                  <Volume2 size={20} />
                  Listen to Full Dialogue
                </button>
              </div>

              <div className="mt-6 bg-green-100 p-4 rounded-lg border border-green-300">
                <h4 className="font-bold text-green-800 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                  <li>Use "There is / There are" to describe what exists.</li>
                  <li>Practice "Put away", "Move", "Is there...?", "There aren't...".</li>
                  <li>Add at least 4 lines to have a complete dialogue.</li>
                  <li>Click the 🔊 icon to hear each line.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 5 – CHANGE INTO THE PAST */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into the Past</h2>
              <PencilIcon onClick={() => openNoteModal("Change into the Past")} />
            </div>
            <button
              onClick={() => toggleDrill("past")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.past ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.past && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              {/* IMAGEM GRANDE DA TABELA DE VERBOS NO PASSADO */}
              <div
                className="relative w-full mb-8 rounded-2xl overflow-hidden border-4 border-green-400 shadow-lg cursor-pointer bg-white"
                onClick={() => {
                  setModalImg(pastImage);
                  setIsImageModalOpen(true);
                }}
              >
                <Image
                  src={pastImage}
                  alt="Verbos no passado"
                  width={1200}
                  height={800}
                  className="w-full h-auto object-contain"
                  sizes="(max-width: 768px) 100vw, 900px"
                  priority
                />
              </div>

              <SpeakSentence
                text="Change the following sentences into the past. Use the simple past form of the verbs."
                className="text-md text-gray-600 mb-6 italic"
              >
                📝 Change the following sentences into the past. Use the simple past form of the verbs.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {pastExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-4 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-green-700 mb-1">
                      {exercise.present}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      🇧🇷 {exercise.pt}
                    </p>
                    <div className="flex items-start gap-3">
                      <input
                        type="text"
                        value={pastAnswers[exercise.id] || ""}
                        onChange={(e) => handlePastChange(exercise.id, e.target.value)}
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Write the past form"
                      />
                      <button
                        onClick={() =>
                          speakEnglish(
                            pastAnswers[exercise.id] || exercise.correctAnswer,
                            0.85,
                            "female"
                          )
                        }
                        className="p-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition"
                        title="Ouvir"
                      >
                        <Volume2 size={18} />
                      </button>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => checkPast(exercise.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handlePastChange(exercise.id, "");
                            setPastChecked((prev) => ({ ...prev, [exercise.id]: false }));
                            setPastResults((prev) => {
                              const c = { ...prev };
                              delete c[exercise.id];
                              return c;
                            });
                          }}
                          className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    {pastChecked[exercise.id] && (
                      <div className="mt-2">
                        {pastResults[exercise.id] ? (
                          <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 font-medium">
                            ✓ Correct!
                          </div>
                        ) : (
                          <div className="p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            <span className="font-medium">Expected:</span>{" "}
                            {exercise.correctAnswer}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-green-100 p-4 rounded-lg border border-green-300">
                <h4 className="font-bold text-green-800 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                  <li>Use the simple past: <strong>was / were</strong> for "there is / there are".</li>
                  <li>Regular verbs: <strong>move → moved</strong>, <strong>put → put</strong> (irregular, same form).</li>
                  <li>Click 🔊 to hear the sentence in the past.</li>
                  <li>Pay attention to time expressions like <em>last week</em>, <em>yesterday</em>.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 6 – TUNE IN YOUR EARS */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 Tune In Your Ears</h2>
              <PencilIcon onClick={() => openNoteModal("Tune In Your Ears")} />
            </div>
            <button
              onClick={() => toggleDrill("tuneIn")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.tuneIn ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.tuneIn && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <h3 className="text-xl font-bold text-green-800 mb-6">
                🔊 Repetition Practice — My House
              </h3>

              {/* ÁUDIO PRINCIPAL DO TUNE IN */}
              <div className="bg-green-100 rounded-2xl p-6 mb-6 border-2 border-green-300 flex flex-col items-center gap-3">
                <p className="text-sm text-green-800 font-semibold">
                  🎧 Listen to the full audio for this section:
                </p>
                <AudioPlayer src={tuneInAudio} />
              </div>

              {/* TEXTO EM INGLÊS */}
              <div className="bg-green-50 rounded-2xl p-6 mb-6 border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-green-800 text-lg">
                    📖 Read and Listen
                  </h4>
                  <button
                    onClick={() => speakEnglish(TUNE_IN_TEXT, 0.85, "female")}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full transition text-sm flex items-center gap-2"
                  >
                    <Volume2 size={16} /> Listen to Full Text
                  </button>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    There are several rooms in my house, and each room has
                    different furniture. My living room is usually very tidy.
                    There is a comfortable sofa in the middle of the room, and
                    there is an armchair next to the window. There is also a
                    coffee table in front of the sofa.
                  </p>
                  <p>
                    To the left of the sofa, there is a small desk with my
                    laptop on it. There are some books on the desk, and there
                    is a lamp next to the computer. Everything is usually
                    organized, but sometimes my living room gets a little
                    messy.
                  </p>
                  <p>
                    My bedroom is next to the living room. There is a large bed
                    in the bedroom, and there is a dresser to the right of the
                    bed. There is also a closet next to the dresser. My clothes
                    are usually inside the closet, but sometimes there are
                    clothes on the floor!
                  </p>
                  <p>
                    There is a small carpet under the bed, and there are two
                    chairs near the window. One of the chairs is broken, so I
                    need to replace it.
                  </p>
                  <p>
                    In the kitchen, there are several cabinets, a refrigerator,
                    and a large table. There is a beautiful coffee table in the
                    living room, but there isn't one in the kitchen. There are
                    also some chairs around the table.
                  </p>
                  <p>
                    I like keeping my house clean and organized. When
                    everything is in the right place, I feel more comfortable
                    and relaxed.
                  </p>
                </div>
              </div>

              {/* TRADUÇÃO EM PORTUGUÊS */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-6 border border-blue-200">
                <h4 className="font-bold text-blue-800 text-lg mb-4">
                  🇧🇷 Tradução
                </h4>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p>
                    Há vários cômodos na minha casa, e cada cômodo tem móveis
                    diferentes. Minha sala de estar geralmente é bem arrumada.
                    Há um sofá confortável no meio da sala, e há uma poltrona
                    ao lado da janela. Também há uma mesa de centro na frente
                    do sofá.
                  </p>
                  <p>
                    À esquerda do sofá, há uma pequena escrivaninha com meu
                    notebook em cima. Há alguns livros sobre a escrivaninha, e
                    há uma luminária ao lado do computador. Tudo geralmente
                    fica organizado, mas às vezes minha sala fica um pouco
                    bagunçada.
                  </p>
                  <p>
                    Meu quarto fica ao lado da sala. Há uma cama grande no
                    quarto, e há uma cômoda à direita da cama. Também há um
                    guarda-roupa ao lado da cômoda. Minhas roupas geralmente
                    ficam dentro do guarda-roupa, mas às vezes há roupas no
                    chão!
                  </p>
                  <p>
                    Há um pequeno tapete embaixo da cama, e há duas cadeiras
                    perto da janela. Uma das cadeiras está quebrada, então
                    preciso substituí-la.
                  </p>
                  <p>
                    Na cozinha, há vários armários, uma geladeira e uma mesa
                    grande. Há uma mesa de centro bonita na sala, mas não há
                    uma na cozinha. Também há algumas cadeiras ao redor da
                    mesa.
                  </p>
                  <p>
                    Eu gosto de manter minha casa limpa e organizada. Quando
                    tudo está no lugar certo, eu me sinto mais confortável e
                    relaxado.
                  </p>
                </div>
              </div>

              {/* PERGUNTAS */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h4 className="font-bold text-purple-800 text-lg">
                    ❓ Questions
                  </h4>
                  <button
                    onClick={() =>
                      speakEnglish(TUNE_IN_QUESTIONS.join(". "), 0.85, "female")
                    }
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-full transition text-sm flex items-center gap-2"
                  >
                    <Volume2 size={16} /> Listen to All Questions
                  </button>
                </div>

                <div className="space-y-4">
                  {TUNE_IN_QUESTIONS.map((question, idx) => {
                    const key = `tune-${idx}`;
                    return (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border-2 border-purple-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-sm font-bold text-purple-600">
                            Question {idx + 1}
                          </span>
                          <button
                            onClick={() => speakEnglish(question, 0.85, "female")}
                            className="p-1 text-purple-500 hover:bg-purple-100 rounded transition"
                            title="Ouvir pergunta"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
                        <p className="font-medium text-gray-700 mb-3">{question}</p>
                        <textarea
                          value={tuneInAnswers[key] || ""}
                          onChange={(e) => updateTuneInAnswer(key, e.target.value)}
                          placeholder="Write your answer here..."
                          className="w-full h-20 p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none resize-none text-sm"
                        />
                        {tuneInAnswers[key]?.trim() && (
                          <button
                            onClick={() =>
                              speakEnglish(tuneInAnswers[key], 0.85, "female")
                            }
                            className="mt-2 text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full transition flex items-center gap-1"
                          >
                            <Volume2 size={12} /> Listen to your answer
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* DICAS */}
              <div className="mt-6 bg-green-100 p-4 rounded-lg border border-green-300">
                <h4 className="font-bold text-green-800 mb-2">💡 Tips:</h4>
                <ul className="text-sm text-green-700 space-y-1 list-disc pl-5">
                  <li>Read the text out loud to practice pronunciation.</li>
                  <li>Click 🔊 to hear the full text or each individual question.</li>
                  <li>
                    Answer the questions in writing, then click 🔊 to hear your
                    own answer.
                  </li>
                  <li>
                    Use the vocabulary from the text: sofa, armchair, coffee
                    table, dresser, closet, carpet, broken.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============ NAVEGAÇÃO ============ */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson61")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (61)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson63")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (63) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR IMAGEM ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={modalImg}
              alt="Imagem ampliada"
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