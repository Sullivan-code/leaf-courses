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
} from "lucide-react";

type SectionKey = 
  | "rolePlay"
  | "substitutionI" 
  | "affirmative" 
  | "substitutionII" 
  | "past" 
  | "interrogative" 
  | "tuneIn";

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// SPEECH SYSTEM – AMERICAN VOICES
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
    <div className="bg-white p-5 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <p className="text-green-700 font-medium text-lg block">{exercise.original}</p>
        <button
          onClick={() => setShowEnglish((v) => !v)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-4 p-4 bg-green-50 rounded-md border border-green-100">
          <SpeakSentence text={currentSentence} className="text-green-800 text-lg font-semibold" />
          {currentPt && (
            <p className="text-base text-gray-600 mt-2 border-t border-green-200 pt-2">
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
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? "bg-green-600 text-white shadow-md transform scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
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
// AUDIO PLAYER (RADIO/RECORDER STYLE)
// ============================================
const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = src;
    audio.load();

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
    <div className="flex flex-wrap items-center justify-center gap-3 bg-white/90 rounded-full px-6 py-3 shadow-md border-2 border-emerald-300">
      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          if (isPlaying) a.pause();
          else a.play().catch((err) => console.error("Audio error:", err));
          setIsPlaying(!isPlaying);
        }}
        className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition shadow-lg"
        title={isPlaying ? "Pausar" : "Play"}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
      </button>

      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          a.currentTime = Math.max(0, a.currentTime - 5);
        }}
        className="p-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
        title="Voltar 5 segundos"
      >
        <Rewind size={18} />
      </button>

      <div
        ref={progressBarRef}
        className="w-full md:w-64 h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
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
          className="h-full bg-emerald-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          a.currentTime = Math.min(a.duration || 0, a.currentTime + 5);
        }}
        className="p-2.5 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition"
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
        className="p-2.5 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition"
        title="Reiniciar"
      >
        <RotateCcw size={16} />
      </button>

      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ============================================
// TUNE IN QUESTIONS
// ============================================
const TUNE_IN_QUESTIONS = [
  "Do you live near the school?",
  "Are there any parks, squares, and stores near your house?",
  "Do you live in a detached house?",
  "Are there many rooms where you live?",
  "Do you own your house or pay rent?",
  "Does anybody share the space with you?",
  "Do you think you have plenty of space?",
  "Do you share your bedroom?",
  "Is your bedroom large or tiny, tidy, or messy?",
  "Do you want to move out to another place?"
];

// ============================================
// MAIN COMPONENT – LESSON 64
// ============================================
export default function Lesson64() {
  const router = useRouter();

  const [openDrills, setOpenDrills] = useState({
    rolePlay: true,
    substitutionI: true,
    affirmative: true,
    substitutionII: true,
    past: true,
    interrogative: true,
    tuneIn: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const [affAnswers, setAffAnswers] = useState<Record<string, string>>({});
  const [affChecked, setAffChecked] = useState<Record<string, boolean>>({});
  const [affResults, setAffResults] = useState<Record<string, boolean>>({});

  const [pastAnswers, setPastAnswers] = useState<Record<string, string>>({});
  const [pastChecked, setPastChecked] = useState<Record<string, boolean>>({});
  const [pastResults, setPastResults] = useState<Record<string, boolean>>({});

  const [intAnswers, setIntAnswers] = useState<Record<string, string>>({});
  const [intChecked, setIntChecked] = useState<Record<string, boolean>>({});
  const [intResults, setIntResults] = useState<Record<string, boolean>>({});

  const [tuneInAnswers, setTuneInAnswers] = useState<Record<string, string>>({});

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState<string>("");

  // Diálogo estático do Role-Play
  const rolePlayDialogue = [
    { character: "Real estate agent", text: "Hello. How can I help you?" },
    { character: "Client", text: "Hi. I'm looking for a place to rent." },
    { character: "Real estate agent", text: "Right. What kind of place are you looking for?" },
    { character: "Client", text: "Well, I need a large place, but I prefer a house." },
    { character: "Real estate agent", text: "How many people are sharing this place?" },
    { character: "Client", text: "Four people." },
    { character: "Real estate agent", text: "I have some townhouses, two-story houses, and detached houses." },
    { character: "Client", text: "I need two bedrooms and two bathrooms." },
    { character: "Real estate agent", text: "I guess the townhouse could be perfect for you." },
    { character: "Client", text: "Is there a good kitchen?" },
    { character: "Real estate agent", text: "Yes, there is. And there is a large living room, too." },
    { character: "Client", text: "How much is it for the rent?" },
    { character: "Real estate agent", text: "This one is $700." },
    { character: "Client", text: "Are there any stores near it?" },
    { character: "Real estate agent", text: "Yes, there are. Do you want to take a look?" },
    { character: "Client", text: "Yes, please." },
  ];

  // ============ LOAD SAVED ============
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    const saved = localStorage.getItem("lesson64Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSubstitutionState(data.substitutionState || {});
        setAffAnswers(data.affAnswers || {});
        setAffChecked(data.affChecked || {});
        setAffResults(data.affResults || {});
        setPastAnswers(data.pastAnswers || {});
        setPastChecked(data.pastChecked || {});
        setPastResults(data.pastResults || {});
        setIntAnswers(data.intAnswers || {});
        setIntChecked(data.intChecked || {});
        setIntResults(data.intResults || {});
        setSavedNotes(data.savedNotes || {});
        if (data.tuneInAnswers) setTuneInAnswers(data.tuneInAnswers);
      } catch (e) {
        console.error("Erro ao carregar:", e);
      }
    }
  }, []);

  const saveAll = () => {
    try {
      localStorage.setItem(
        "lesson64Answers",
        JSON.stringify({
          substitutionState,
          affAnswers,
          affChecked,
          affResults,
          pastAnswers,
          pastChecked,
          pastResults,
          intAnswers,
          intChecked,
          intResults,
          savedNotes,
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
      setSubstitutionState({});
      setAffAnswers({});
      setAffChecked({});
      setAffResults({});
      setPastAnswers({});
      setPastChecked({});
      setPastResults({});
      setIntAnswers({});
      setIntChecked({});
      setIntResults({});
      setTuneInAnswers({});
      localStorage.removeItem("lesson64Answers");
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

  // ============ SUBSTITUTION I (B1/B2 Level) ============
  const substitutionIExercises: SubstitutionExercise[] = [
    {
      key: "sub1-1",
      original: "I am looking for someone to share a spacious apartment with. / room / studio apartment",
      options: [
        { label: "apartment", replacement: "I am looking for someone to share a spacious apartment with.", pt: "Estou procurando alguém para dividir um apartamento espaçoso." },
        { label: "room", replacement: "I am looking for someone to share a spacious room with.", pt: "Estou procurando alguém para dividir um quarto espaçoso." },
        { label: "studio apartment", replacement: "I am looking for someone to share a spacious studio apartment with.", pt: "Estou procurando alguém para dividir uma quitinete espaçosa." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-2",
      original: "Is there anybody at home right now, or did everyone leave? / school / university",
      options: [
        { label: "home", replacement: "Is there anybody at home right now, or did everyone leave?", pt: "Tem alguém em casa agora, ou todos saíram?" },
        { label: "school", replacement: "Is there anybody at school right now, or did everyone leave?", pt: "Tem alguém na escola agora, ou todos saíram?" },
        { label: "university", replacement: "Is there anybody at university right now, or did everyone leave?", pt: "Tem alguém na universidade agora, ou todos saíram?" },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-3",
      original: "Hardly anybody works on Sundays in my hometown. / study / travel",
      options: [
        { label: "works", replacement: "Hardly anybody works on Sundays in my hometown.", pt: "Quase ninguém trabalha aos domingos na minha cidade natal." },
        { label: "study", replacement: "Hardly anybody studies on Sundays in my hometown.", pt: "Quase ninguém estuda aos domingos na minha cidade natal." },
        { label: "travel", replacement: "Hardly anybody travels on Sundays in my hometown.", pt: "Quase ninguém viaja aos domingos na minha cidade natal." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-4",
      original: "Everybody usually stays in on Monday nights to relax. / Tuesdays / Wednesdays",
      options: [
        { label: "Mondays", replacement: "Everybody usually stays in on Monday nights to relax.", pt: "Todos geralmente ficam em casa nas noites de segunda-feira para relaxar." },
        { label: "Tuesdays", replacement: "Everybody usually stays in on Tuesday nights to relax.", pt: "Todos geralmente ficam em casa nas noites de terça-feira para relaxar." },
        { label: "Wednesdays", replacement: "Everybody usually stays in on Wednesday nights to relax.", pt: "Todos geralmente ficam em casa nas noites de quarta-feira para relaxar." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-5",
      original: "I can't see anybody in the waiting room. / talk to / travel with",
      options: [
        { label: "see", replacement: "I can't see anybody in the waiting room.", pt: "Não consigo ver ninguém na sala de espera." },
        { label: "talk to", replacement: "I can't talk to anybody in the waiting room.", pt: "Não consigo falar com ninguém na sala de espera." },
        { label: "travel with", replacement: "I can't travel with anybody in the waiting room.", pt: "Não consigo viajar com ninguém na sala de espera." },
      ],
      currentIndex: 0,
    },
  ];

  const handleOptionClick = (key: string, index: number) =>
    setSubstitutionState((prev) => ({ ...prev, [key]: index }));

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  const getExerciseWithIndex = (key: string) => {
    const ex = substitutionIExercises.find((e) => e.key === key) || 
               substitutionIIExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============ SUBSTITUTION II (B1/B2 Level) ============
  const substitutionIIExercises: SubstitutionExercise[] = [
    {
      key: "sub2-1",
      original: "There is a breathtaking view of the park from this apartment. / downtown / beach",
      options: [
        { label: "park", replacement: "There is a breathtaking view of the park from this apartment.", pt: "Há uma vista de tirar o fôlego do parque deste apartamento." },
        { label: "downtown", replacement: "There is a breathtaking view of downtown from this apartment.", pt: "Há uma vista de tirar o fôlego do centro deste apartamento." },
        { label: "beach", replacement: "There is a breathtaking view of the beach from this apartment.", pt: "Há uma vista de tirar o fôlego da praia deste apartamento." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-2",
      original: "Please, take the elevator up to the second floor. / third / fourth",
      options: [
        { label: "second", replacement: "Please, take the elevator up to the second floor.", pt: "Por favor, pegue o elevador até o segundo andar." },
        { label: "third", replacement: "Please, take the elevator up to the third floor.", pt: "Por favor, pegue o elevador até o terceiro andar." },
        { label: "fourth", replacement: "Please, take the elevator up to the fourth floor.", pt: "Por favor, pegue o elevador até o quarto andar." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-3",
      original: "I don't own a house yet; I am currently paying rent. / apartment / studio apartment",
      options: [
        { label: "house", replacement: "I don't own a house yet; I am currently paying rent.", pt: "Ainda não tenho uma casa própria; atualmente estou pagando aluguel." },
        { label: "apartment", replacement: "I don't own an apartment yet; I am currently paying rent.", pt: "Ainda não tenho um apartamento próprio; atualmente estou pagando aluguel." },
        { label: "studio apartment", replacement: "I don't own a studio apartment yet; I am currently paying rent.", pt: "Ainda não tenho uma quitinete própria; atualmente estou pagando aluguel." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-4",
      original: "I haven't had the chance to meet your roommate yet. / teacher / boyfriend",
      options: [
        { label: "roommate", replacement: "I haven't had the chance to meet your roommate yet.", pt: "Ainda não tive a chance de conhecer seu colega de quarto." },
        { label: "teacher", replacement: "I haven't had the chance to meet your teacher yet.", pt: "Ainda não tive a chance de conhecer seu professor." },
        { label: "boyfriend", replacement: "I haven't had the chance to meet your boyfriend yet.", pt: "Ainda não tive a chance de conhecer seu namorado." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-5",
      original: "She is looking to rent a detached house with a big backyard. / townhouse / two-story house",
      options: [
        { label: "detached house", replacement: "She is looking to rent a detached house with a big backyard.", pt: "Ela está querendo alugar uma casa isolada com um quintal grande." },
        { label: "townhouse", replacement: "She is looking to rent a townhouse with a big backyard.", pt: "Ela está querendo alugar uma casa geminada com um quintal grande." },
        { label: "two-story house", replacement: "She is looking to rent a two-story house with a big backyard.", pt: "Ela está querendo alugar um sobrado com um quintal grande." },
      ],
      currentIndex: 0,
    },
  ];

  // ============ CHECK FUNCTION ============
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

  // ============ CHANGE INTO AFFIRMATIVE ============
  const affirmativeExercises = [
    { id: "aff1", sentence: "There isn't anybody here.", correctAnswer: "There is somebody here.", pt: "Tem alguém aqui." },
    { id: "aff2", sentence: "She doesn't have anybody to talk to.", correctAnswer: "She has somebody to talk to.", pt: "Ela tem alguém para conversar." },
    { id: "aff3", sentence: "I don't travel with anybody.", correctAnswer: "I travel with somebody.", pt: "Eu viajo com alguém." },
    { id: "aff4", sentence: "They don't know anybody here.", correctAnswer: "They know somebody here.", pt: "Eles conhecem alguém aqui." },
    { id: "aff5", sentence: "I don't want to meet anybody now.", correctAnswer: "I want to meet somebody now.", pt: "Eu quero conhecer alguém agora." },
  ];

  const handleAffChange = (id: string, value: string) =>
    setAffAnswers((prev) => ({ ...prev, [id]: value }));

  const checkAff = (id: string) => {
    const ex = affirmativeExercises.find((e) => e.id === id);
    if (!ex) return;
    setAffResults((prev) => ({ ...prev, [id]: checkAnswer(affAnswers[id] || "", ex.correctAnswer) }));
    setAffChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ CHANGE INTO PAST (TO SHARE / TO RENT) ============
  const pastExercises = [
    { id: "past1", present: "I share a room with my sister.", correctAnswer: "I shared a room with my sister.", pt: "Eu dividia/dividi um quarto com minha irmã." },
    { id: "past2", present: "We rent a two-story house.", correctAnswer: "We rented a two-story house.", pt: "Nós alugamos um sobrado." },
    { id: "past3", present: "She doesn't share her food.", correctAnswer: "She didn't share her food.", pt: "Ela não dividia/compartilhava a comida dela." },
    { id: "past4", present: "Do they rent a studio apartment?", correctAnswer: "Did they rent a studio apartment?", pt: "Eles alugaram uma quitinete?" },
    { id: "past5", present: "He shares the bill with his friends.", correctAnswer: "He shared the bill with his friends.", pt: "Ele dividiu a conta com os amigos dele." },
    { id: "past6", present: "They rent a townhouse every year.", correctAnswer: "They rented a townhouse last year.", pt: "Eles alugaram uma casa geminada no ano passado." },
  ];

  const handlePastChange = (id: string, value: string) =>
    setPastAnswers((prev) => ({ ...prev, [id]: value }));

  const checkPast = (id: string) => {
    const ex = pastExercises.find((e) => e.id === id);
    if (!ex) return;
    setPastResults((prev) => ({ ...prev, [id]: checkAnswer(pastAnswers[id] || "", ex.correctAnswer) }));
    setPastChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ CHANGE INTO INTERROGATIVE ============
  const interrogativeExercises = [
    { id: "int1", sentence: "Everybody pays rent in this building.", correctAnswer: "Does everybody pay rent in this building?", pt: "Todo mundo paga aluguel neste prédio?" },
    { id: "int2", sentence: "Everybody shares a room in college.", correctAnswer: "Does everybody share a room in college?", pt: "Todo mundo divide um quarto na faculdade?" },
    { id: "int3", sentence: "There is nobody on the second floor.", correctAnswer: "Is there anybody on the second floor?", pt: "Tem alguém no segundo andar?" },
    { id: "int4", sentence: "There is somebody calling you.", correctAnswer: "Is there anybody calling me?", pt: "Tem alguém me ligando?" },
    { id: "int5", sentence: "Everybody wants to stay here.", correctAnswer: "Does everybody want to stay here?", pt: "Todo mundo quer ficar aqui?" },
  ];

  const handleIntChange = (id: string, value: string) =>
    setIntAnswers((prev) => ({ ...prev, [id]: value }));

  const checkInt = (id: string) => {
    const ex = interrogativeExercises.find((e) => e.id === id);
    if (!ex) return;
    setIntResults((prev) => ({ ...prev, [id]: checkAnswer(intAnswers[id] || "", ex.correctAnswer) }));
    setIntChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ TUNE IN HANDLERS ============
  const updateTuneInAnswer = (key: string, value: string) =>
    setTuneInAnswers((prev) => ({ ...prev, [key]: value }));

  const legoImage =
    "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%2027%20de%20set.%20de%202026%2C%2000_46_46.png";

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
            🏠 Lesson 64 – My House & My Routine
          </h1>
          <SpeakSentence
            text="Let's practice the real estate vocabulary, sharing places, and renting houses in the past tense."
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            📚 Practice real estate vocabulary, sharing places, and renting houses.
          </SpeakSentence>

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
        {/* SEÇÃO 1 – READ AND ROLE-PLAY */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎭 Read and Role-Play</h2>
              <PencilIcon onClick={() => openNoteModal("Read and Role-Play")} />
            </div>
            <button
              onClick={() => toggleDrill("rolePlay")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.rolePlay ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.rolePlay && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              
              {/* ÁUDIO DA SEÇÃO – URL RAW CORRIGIDA ✅ */}
              <div className="flex justify-center mb-8 bg-green-50 p-6 rounded-2xl border-2 border-green-200 shadow-sm">
                <div className="text-center w-full">
                  <p className="text-green-800 font-semibold mb-4 text-lg">🎧 Listen to the full dialogue:</p>
                  <div className="flex justify-center">
                    <AudioPlayer src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l64-readandroleplay.wav" />
                  </div>
                </div>
              </div>

              {/* DIÁLOGO ESTILO CHAT */}
              <div className="bg-green-50 rounded-2xl p-6 space-y-4 max-h-[600px] overflow-y-auto border border-green-200 shadow-inner">
                {rolePlayDialogue.map((line, index) => {
                  const isClient = line.character.toLowerCase().includes("client");
                  return (
                    <div
                      key={index}
                      className={`flex ${isClient ? "justify-end" : "justify-start"} mb-4`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm border-2 ${
                          isClient
                            ? "bg-pink-100 border-pink-300 rounded-tr-none text-pink-900"
                            : "bg-blue-100 border-blue-300 rounded-tl-none text-blue-900"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1 opacity-75">
                          <span className="text-xs font-bold uppercase tracking-wider">
                            {line.character}
                          </span>
                        </div>
                        <p className="text-lg font-medium leading-relaxed">
                          {line.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 2 – SUBSTITUTION PRACTICE I */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice I</h2>
              <PencilIcon onClick={() => openNoteModal("Substitution Practice I")} />
            </div>
            <button
              onClick={() => toggleDrill("substitutionI")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.substitutionI ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.substitutionI && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Click on each option to hear the pronunciation and practice the substitution."
                className="text-md text-gray-600 mb-4 italic"
              >
                🎧 Click on each option to hear the pronunciation and practice the substitution.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {substitutionIExercises.map((ex) => {
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
        {/* SEÇÃO 3 – CHANGE INTO AFFIRMATIVE */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Affirmative</h2>
              <PencilIcon onClick={() => openNoteModal("Change into Affirmative")} />
            </div>
            <button
              onClick={() => toggleDrill("affirmative")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.affirmative ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.affirmative && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Transform the negative sentences into affirmative. Use 'somebody' or 'somewhere'."
                className="text-md text-gray-600 mb-4 italic"
              >
                📝 Transform the negative sentences into affirmative.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {affirmativeExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-4 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-red-500 mb-1">
                      {exercise.sentence}
                    </p>
                    <div className="flex items-start gap-3">
                      <input
                        type="text"
                        value={affAnswers[exercise.id] || ""}
                        onChange={(e) => handleAffChange(exercise.id, e.target.value)}
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Write the affirmative form"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => checkAff(exercise.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleAffChange(exercise.id, "");
                            setAffChecked((prev) => ({ ...prev, [exercise.id]: false }));
                            setAffResults((prev) => {
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
                    {affChecked[exercise.id] && (
                      <div className="mt-2">
                        {affResults[exercise.id] ? (
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
        {/* SEÇÃO 4 – SUBSTITUTION PRACTICE II */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice II</h2>
              <PencilIcon onClick={() => openNoteModal("Substitution Practice II")} />
            </div>
            <button
              onClick={() => toggleDrill("substitutionII")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.substitutionII ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.substitutionII && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Click on each option to hear the pronunciation and practice the substitution."
                className="text-md text-gray-600 mb-4 italic"
              >
                🎧 Click on each option to hear the pronunciation and practice the substitution.
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {substitutionIIExercises.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key) || { ...ex, currentIndex: 0 };
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
        {/* SEÇÃO 5 – CHANGE INTO THE PAST (TO SHARE / TO RENT) */}
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
              <SpeakSentence
                text="Change the following sentences into the past. Focus on the verbs 'to share' and 'to rent'."
                className="text-md text-gray-600 mb-6 italic"
              >
                📝 Change the following sentences into the past. Focus on the verbs 'to share' and 'to rent'.
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
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 6 – CHANGE INTO INTERROGATIVE */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Interrogative</h2>
              <PencilIcon onClick={() => openNoteModal("Change into Interrogative")} />
            </div>
            <button
              onClick={() => toggleDrill("interrogative")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.interrogative ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.interrogative && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence
                text="Transform the sentences into interrogative (questions)."
                className="text-md text-gray-600 mb-4 italic"
              >
                📝 Transform the sentences into interrogative (questions).
              </SpeakSentence>

              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {interrogativeExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-4 rounded-lg border border-green-200"
                  >
                    <p className="font-medium text-green-700 mb-1">
                      {exercise.sentence}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      🇧🇷 {exercise.pt}
                    </p>
                    <div className="flex items-start gap-3">
                      <input
                        type="text"
                        value={intAnswers[exercise.id] || ""}
                        onChange={(e) => handleIntChange(exercise.id, e.target.value)}
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        placeholder="Write the question"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => checkInt(exercise.id)}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleIntChange(exercise.id, "");
                            setIntChecked((prev) => ({ ...prev, [exercise.id]: false }));
                            setIntResults((prev) => {
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
                    {intChecked[exercise.id] && (
                      <div className="mt-2">
                        {intResults[exercise.id] ? (
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
        {/* SEÇÃO 7 – TUNE IN YOUR EARS (QUESTIONS) */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 Questions</h2>
              <PencilIcon onClick={() => openNoteModal("Questions")} />
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
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h4 className="font-bold text-purple-800 text-xl">
                    ❓ Questions for Discussion
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
                            {String.fromCharCode(97 + idx)}) {question}
                          </span>
                          <button
                            onClick={() => speakEnglish(question, 0.85, "female")}
                            className="p-1 text-purple-500 hover:bg-purple-100 rounded transition flex-shrink-0 ml-2"
                            title="Ouvir pergunta"
                          >
                            <Volume2 size={16} />
                          </button>
                        </div>
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
                  <li>Read the questions out loud to practice your intonation.</li>
                  <li>Answer the questions using the vocabulary you learned today (rent, share, apartment, etc.).</li>
                  <li>Click 🔊 to hear the full question or your own answer.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============ NAVEGAÇÃO ============ */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson63")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (63)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson65")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (65) &rarr;
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