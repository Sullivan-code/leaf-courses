"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  Eye,
  EyeOff,
  Play,
  Pause,
  Rewind,
  FastForward,
  RotateCcw,
  CheckCircle,
  XCircle,
  Languages,
  Mic,
} from "lucide-react";

type SectionKey = "listen" | "sub1" | "affirmative" | "sub2" | "negative" | "talk" | "tune";

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// SPEECH SYSTEM
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
          v.name.includes("Samantha") ||
          v.name.includes("Google US English"))
    ) || voices.find((v) => v.lang === "en-US");

  const maleVoice =
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Microsoft Guy") ||
          v.name.includes("Microsoft Davis") ||
          v.name.includes("Alex") ||
          v.name.includes("Daniel"))
    ) || voices.find((v) => v.lang === "en-US" && v !== femaleVoice);

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
    className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left inline-flex items-center gap-1 ${className}`}
  >
    {children || text}
    <Volume2
      size={12}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500 flex-shrink-0"
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
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
      className="ml-3 text-gray-400 hover:text-white transition-colors focus:outline-none"
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
  globalShowPt = true,
}: {
  exercise: SubstitutionExercise;
  onOptionClick: (key: string, index: number) => void;
  globalShowPt?: boolean;
}) {
  const [showEnglish, setShowEnglish] = useState(true);
  const [showPt, setShowPt] = useState(globalShowPt);

  useEffect(() => {
    setShowPt(globalShowPt);
  }, [globalShowPt]);

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
    <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPt((v) => !v)}
            className={`p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0 ${
              showPt ? "text-gray-500" : "text-gray-300"
            }`}
            title={showPt ? "Ocultar tradução em português" : "Mostrar tradução em português"}
          >
            <Languages size={18} />
          </button>
          <button
            onClick={() => setShowEnglish((v) => !v)}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 flex-shrink-0"
            title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
          >
            {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-green-700 font-medium" />
          {showPt && currentPt && (
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
                ? "bg-green-500 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
    <div className="flex items-center gap-3 bg-white px-4 py-2 shadow-lg border-2 border-green-400 rounded-full">
      <button
        onClick={() => {
          const a = audioRef.current;
          if (!a) return;
          if (isPlaying) a.pause();
          else a.play().catch((err) => console.error("Audio error:", err));
          setIsPlaying(!isPlaying);
        }}
        className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-md"
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
        <Rewind size={16} />
      </button>

      <div
        ref={progressBarRef}
        className="w-32 md:w-48 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
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
        <FastForward size={16} />
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
// MAIN COMPONENT – LESSON 66
// ============================================
export default function Lesson66() {
  const router = useRouter();

  const [openDrills, setOpenDrills] = useState({
    listen: true,
    sub1: true,
    affirmative: true,
    sub2: true,
    negative: true,
    talk: true,
    tune: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});
  const [showAllPt, setShowAllPt] = useState(true); // Global toggle for PT translations

  // Listen and Answer State
  const [listenAnswers, setListenAnswers] = useState<Record<string, number>>({});
  const [listenChecked, setListenChecked] = useState<Record<string, boolean>>({});

  // Affirmative State
  const [affAnswers, setAffAnswers] = useState<Record<string, string>>({});
  const [affChecked, setAffChecked] = useState<Record<string, boolean>>({});
  const [affResults, setAffResults] = useState<Record<string, boolean>>({});

  // Negative State
  const [negAnswers, setNegAnswers] = useState<Record<string, string>>({});
  const [negChecked, setNegChecked] = useState<Record<string, boolean>>({});
  const [negResults, setNegResults] = useState<Record<string, boolean>>({});

  // Talk to your friend (Fill in the blanks)
  const [talkAnswers, setTalkAnswers] = useState<Record<number, string>>({});
  const [talkChecked, setTalkChecked] = useState(false);
  const [talkResults, setTalkResults] = useState<Record<number, boolean>>({});

  // Tune in Your Ears State (Quiz)
  const [tuneAnswers, setTuneAnswers] = useState<Record<string, number>>({});
  const [tuneChecked, setTuneChecked] = useState<Record<string, boolean>>({});

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

  const handleOptionClick = (key: string, index: number) =>
    setSubstitutionState((prev) => ({ ...prev, [key]: index }));

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  // ============ LISTEN AND ANSWER DATA ============
  const listenQuestions = [
    { id: "q1", question: "a. What can't Matt find?", options: ["his headphones", "his name tag", "his car keys"], correct: 2 },
    { id: "q2", question: "b. Where does Matt usually put his key?", options: ["on the desk", "on the coffee table", "on the table"], correct: 0 },
    { id: "q3", question: "c. Matt needs to go to a ______ meeting.", options: ["sales", "rental", "manager's"], correct: 0 },
    { id: "q4", question: "d. How late is Matt?", options: ["5 minutes", "10 minutes", "15 minutes"], correct: 1 },
    { id: "q5", question: "e. Why is Matt losing his temper?", options: ["He hates losing things.", "He is late.", "He has a test."], correct: 1 },
    { id: "q6", question: "f. What time is the appointment?", options: ["at 9:00", "at 9:05", "at 9:45"], correct: 2 },
    { id: "q7", question: "g. Where does Linda find the keys?", options: ["on the desk", "under the chair", "on the coffee table"], correct: 2 },
    { id: "q8", question: "h. What does Matt need to do after Linda finds the keys?", options: ["He needs to make a phone call.", "He needs to run for his appointment.", "He needs to change his appointment."], correct: 1 },
  ];

  const checkListenAnswer = (id: string) => {
    setListenChecked((prev) => ({ ...prev, [id]: true }));
  };

  // ============ SUBSTITUTION PRACTICE 1 ============
  const substitutionExercises: SubstitutionExercise[] = [
    {
      key: "sub1-1",
      original: "Onde estão minhas chaves? Não consigo encontrá-las.",
      options: [
        { label: "chaves", replacement: "I've been looking everywhere, but I still can't find my keys.", pt: "Eu procurei por toda parte, mas ainda não consigo encontrar minhas chaves." },
        { label: "óculos", replacement: "I've been looking everywhere, but I still can't find my glasses.", pt: "Eu procurei por toda parte, mas ainda não consigo encontrar meus óculos." },
        { label: "documentos", replacement: "I've been looking everywhere, but I still can't find my documents.", pt: "Eu procurei por toda parte, mas ainda não consigo encontrar meus documentos." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-2",
      original: "Não fale com ele. Ele está cansado.",
      options: [
        { label: "cansado", replacement: "I'd advise you not to talk to him right now because he was working all day and is exhausted.", pt: "Eu aconselharia você a não falar com ele agora porque ele trabalhou o dia todo e está exausto." },
        { label: "triste", replacement: "I'd advise you not to talk to him right now because he received bad news and is sad.", pt: "Eu aconselharia você a não falar com ele agora porque ele recebeu uma má notícia e está triste." },
        { label: "chateado", replacement: "I'd advise you not to talk to him right now because he lost his wallet and is upset.", pt: "Eu aconselharia você a não falar com ele agora porque ele perdeu a carteira e está chateado." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-3",
      original: "O casaco está atrás da porta.",
      options: [
        { label: "casaco", replacement: "When I arrived, I hung my heavy winter coat behind the wooden door.", pt: "Quando cheguei, pendurei meu casaco pesado de inverno atrás da porta de madeira." },
        { label: "jaqueta", replacement: "When I arrived, I hung my denim jacket behind the wooden door.", pt: "Quando cheguei, pendurei minha jaqueta jeans atrás da porta de madeira." },
        { label: "guarda-chuva", replacement: "When I arrived, I left my wet umbrella behind the wooden door.", pt: "Quando cheguei, deixei meu guarda-chuva molhado atrás da porta de madeira." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-4",
      original: "Onde está minha identidade? Eu não consigo encontrá-la.",
      options: [
        { label: "identidade", replacement: "I urgently need to find my ID because the police officer asked for it.", pt: "Eu preciso urgentemente encontrar minha identidade porque o policial pediu por ela." },
        { label: "habilitação", replacement: "I urgently need to find my driver's license because the police officer asked for it.", pt: "Eu preciso urgentemente encontrar minha habilitação porque o policial pediu por ela." },
        { label: "passaporte", replacement: "I urgently need to find my passport because the immigration officer asked for it.", pt: "Eu preciso urgentemente encontrar meu passaporte porque o oficial de imigração pediu por ele." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub1-5",
      original: "Não perca a calma com ele.",
      options: [
        { label: "calma", replacement: "Despite the difficult situation, you must try not to lose your temper with him.", pt: "Apesar da situação difícil, você deve tentar não perder a calma com ele." },
        { label: "controle", replacement: "Despite the difficult situation, you must try not to lose control with him.", pt: "Apesar da situação difícil, você deve tentar não perder o controle com ele." },
        { label: "paciência", replacement: "Despite the difficult situation, you must try not to lose patience with him.", pt: "Apesar da situação difícil, você deve tentar não perder a paciência com ele." },
      ],
      currentIndex: 0,
    },
  ];

  // ============ CHANGE INTO AFFIRMATIVE ============
  const affirmativeExercises = [
    { id: "aff1", negative: "I didn't need to talk to her about the project yesterday.", correct: "I needed to talk to her about the project yesterday." },
    { id: "aff2", negative: "I don't like to travel with them because they complain too much.", correct: "I like to travel with them because they complain too much." },
    { id: "aff3", negative: "I didn't want to meet him at the mall, but I got stuck in traffic.", correct: "I wanted to meet him at the mall, but I got stuck in traffic." },
    { id: "aff4", negative: "She didn't want to talk to us before the meeting started.", correct: "She wanted to talk to us before the meeting started." },
    { id: "aff5", negative: "Even though she was late, I didn't lose my temper with her.", correct: "Even though she was late, I lost my temper with her." },
  ];

  const checkTextAnswer = (userAnswer: string, correctAnswer: string) => {
    const normalize = (t: string) => t.toLowerCase().trim().replace(/[.,?!]/g, "").replace(/\s+/g, " ");
    return normalize(userAnswer) === normalize(correctAnswer);
  };

  const handleAffCheck = (id: string, correct: string) => {
    const isCorrect = checkTextAnswer(affAnswers[id] || "", correct);
    setAffResults(prev => ({ ...prev, [id]: isCorrect }));
    setAffChecked(prev => ({ ...prev, [id]: true }));
  };

  // ============ SUBSTITUTION PRACTICE 2 ============
  const substitutionExercises2: SubstitutionExercise[] = [
    {
      key: "sub2-1",
      original: "Tem alguém em casa? / na escola? / na universidade?",
      options: [
        { label: "em casa", replacement: "Is anyone at home?", pt: "Tem alguém em casa?" },
        { label: "na escola", replacement: "Is anyone at school?", pt: "Tem alguém na escola?" },
        { label: "na universidade", replacement: "Is anyone at university?", pt: "Tem alguém na universidade?" },
        { label: "em casa (formal)", replacement: "Do you know whether anyone is at home?", pt: "Você sabe se tem alguém em casa?" },
        { label: "na escola (formal)", replacement: "Do you know whether anyone is at school?", pt: "Você sabe se tem alguém na escola?" },
        { label: "na universidade (formal)", replacement: "Do you know whether anyone is at university?", pt: "Você sabe se tem alguém na universidade?" },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-2",
      original: "Eu não quero falar com ele / ela / eles.",
      options: [
        { label: "ele", replacement: "I don't want to talk to him.", pt: "Eu não quero falar com ele." },
        { label: "ela", replacement: "I don't want to talk to her.", pt: "Eu não quero falar com ela." },
        { label: "eles", replacement: "I don't want to talk to them.", pt: "Eu não quero falar com eles." },
        { label: "ele (formal)", replacement: "I'd rather not speak to him.", pt: "Eu preferiria não conversar com ele." },
        { label: "ela (formal)", replacement: "I'd rather not speak to her.", pt: "Eu preferiria não conversar com ela." },
        { label: "eles (formal)", replacement: "I'd rather not speak to them.", pt: "Eu preferiria não conversar com eles." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-3",
      original: "Vamos dividir / compartilhar este carregador / estes fones de ouvido / este closet.",
      options: [
        { label: "carregador", replacement: "Let's share this charger.", pt: "Vamos dividir este carregador." },
        { label: "fones", replacement: "Let's share these headphones.", pt: "Vamos dividir estes fones de ouvido." },
        { label: "closet", replacement: "Let's share this closet.", pt: "Vamos dividir este closet." },
        { label: "carregador (formal)", replacement: "Why don't we share this charger?", pt: "Por que não compartilhamos este carregador?" },
        { label: "fones (formal)", replacement: "Why don't we share these headphones?", pt: "Por que não compartilhamos estes fones de ouvido?" },
        { label: "closet (formal)", replacement: "Why don't we share this closet?", pt: "Por que não compartilhamos este closet?" },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-4",
      original: "Eu sempre me perco aqui / ali / nesta cidade.",
      options: [
        { label: "aqui", replacement: "I always get lost here.", pt: "Eu sempre me perco aqui." },
        { label: "ali", replacement: "I always get lost there.", pt: "Eu sempre me perco ali." },
        { label: "nesta cidade", replacement: "I always get lost in this city.", pt: "Eu sempre me perco nesta cidade." },
        { label: "aqui (formal)", replacement: "I always seem to lose my way around here.", pt: "Eu sempre acabo me perdendo por aqui." },
        { label: "ali (formal)", replacement: "I always seem to lose my way around there.", pt: "Eu sempre acabo me perdendo por ali." },
        { label: "nesta cidade (formal)", replacement: "I always seem to lose my way in this city.", pt: "Eu sempre acabo me perdendo nesta cidade." },
      ],
      currentIndex: 0,
    },
    {
      key: "sub2-5",
      original: "Não perca a fé no seu trabalho / país / cidade.",
      options: [
        { label: "trabalho", replacement: "Don't lose faith in your work.", pt: "Não perca a fé no seu trabalho." },
        { label: "país", replacement: "Don't lose faith in your country.", pt: "Não perca a fé no seu país." },
        { label: "cidade", replacement: "Don't lose faith in your city.", pt: "Não perca a fé na sua cidade." },
        { label: "trabalho (formal)", replacement: "Whatever happens, don't lose faith in your work.", pt: "Independentemente do que aconteça, não perca a fé no seu trabalho." },
        { label: "país (formal)", replacement: "Whatever happens, don't lose faith in your country.", pt: "Independentemente do que aconteça, não perca a fé no seu país." },
        { label: "cidade (formal)", replacement: "Whatever happens, don't lose faith in your city.", pt: "Independentemente do que aconteça, não perca a fé na sua cidade." },
      ],
      currentIndex: 0,
    },
  ];

  // Unindo todos os exercícios para o sistema conseguir buscar os index corretamente
  const allExercises = [...substitutionExercises, ...substitutionExercises2];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Extra Speaking Challenge Data
  const extraSpeakingQuestions = [
    { en: "Have you ever lost faith in something you were working hard to achieve? Why?", pt: "Você já perdeu a fé em algo que estava se esforçando muito para alcançar? Por quê?" },
    { en: "Is there anyone you'd rather not work with? Explain your reasons.", pt: "Existe alguém com quem você preferiria não trabalhar? Explique seus motivos." },
    { en: "Do you think people should share their personal belongings with friends or family members?", pt: "Você acha que as pessoas deveriam compartilhar seus pertences pessoais com amigos ou familiares?" },
    { en: "Have you ever gotten lost in a city you didn't know? What happened?", pt: "Você já se perdeu em uma cidade que não conhecia? O que aconteceu?" },
    { en: "Is there anyone in your family who is currently studying at university?", pt: "Existe alguém na sua família que está estudando na universidade atualmente?" }
  ];

  // ============ CHANGE INTO NEGATIVE ============
  const negativeExercises = [
    { id: "neg1", affirmative: "As a teacher, I can lose my temper with my students sometimes.", correct: "As a teacher, I can't lose my temper with my students." },
    { id: "neg2", affirmative: "I checked the entire building, and there is a Lost and Found section.", correct: "I checked the entire building, and there isn't a Lost and Found section." },
    { id: "neg3", affirmative: "Whatever you do, give your password to her.", correct: "Whatever you do, don't give your password to her." },
    { id: "neg4", affirmative: "He could rent the car because he has his driver's license with him.", correct: "He couldn't rent the car because he doesn't have his driver's license with him." },
    { id: "neg5", affirmative: "I noticed that she is sharing her food with them.", correct: "I noticed that she isn't sharing her food with them." },
  ];

  const handleNegCheck = (id: string, correct: string) => {
    const isCorrect = checkTextAnswer(negAnswers[id] || "", correct);
    setNegResults(prev => ({ ...prev, [id]: isCorrect }));
    setNegChecked(prev => ({ ...prev, [id]: true }));
  };

  // ============ TALK TO YOUR FRIEND (FILL IN THE BLANKS) ============
  const talkBlanks = [
    { word: "name tag", pt: "crachá" },
    { word: "it", pt: "isto/ele/ela" },
    { word: "dresser", pt: "cômoda" },
    { word: "charger", pt: "carregador" },
    { word: "it", pt: "isto/ele/ela" },
    { word: "next to", pt: "ao lado de" },
    { word: "coffee table", pt: "mesa de centro" },
    { word: "keys", pt: "chaves" },
    { word: "under", pt: "embaixo de" },
    { word: "armchair", pt: "poltrona" },
  ];

  const checkTalk = () => {
    const results: Record<number, boolean> = {};
    talkBlanks.forEach((blank, idx) => {
      const isCorrect = checkTextAnswer(talkAnswers[idx] || "", blank.word);
      results[idx] = isCorrect;
    });
    setTalkResults(results);
    setTalkChecked(true);
  };

  const speakTalkDialogue = () => {
    const text = "Hey, did you happen to see my name tag earlier? I've been searching for it everywhere. Did you check the dresser in the bedroom? Yes, I looked there, but I couldn't find it. What about my charger? I left it in my bag, but now it's gone. Oh, I think I saw it next to the coffee table. Great! And where did I leave my keys? I think you left them under the armchair in the living room.";
    speakEnglish(text, 0.85, "female");
  };

  // ============ TUNE IN YOUR EARS ============
  const tuneInText = "Today, I got the keys to my studio apartment. It's great. Studio apartment? What's that? And why are you so tired, busy darling? Because I'm moving in today, and the place is a real mess. Excuse me again, Adam. There is a passport under that desk. Oh, thank you. I got my passport, Mom.";

  const tuneQuestions = [
    { id: "tq1", question: "1. What did the person get today?", options: ["Keys to a new car", "Keys to a studio apartment", "A new passport"], correct: 1 },
    { id: "tq2", question: "2. Why is the person so tired?", options: ["Because they worked all day", "Because they are moving in and the place is a mess", "Because they lost their passport"], correct: 1 },
    { id: "tq3", question: "3. What was under the desk?", options: ["A name tag", "A charger", "A passport"], correct: 2 },
    { id: "tq4", question: "4. Who is the person talking to at the end?", options: ["Adam", "Mom", "A friend"], correct: 1 },
  ];

  const checkTuneAnswer = (id: string) => {
    setTuneChecked((prev) => ({ ...prev, [id]: true }));
  };

  // Function to scroll to specific question on number click
  const scrollToQuestion = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -120;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

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
        
        {/* CABEÇALHO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🏠 Lesson 66 – My House & My Routine
          </h1>
          <SpeakSentence
            text="Practice listening, substitutions, and filling in the blanks."
            className="text-xl text-gray-700 max-w-3xl mx-auto mb-8"
          >
            📚 Practice listening, substitutions, and filling in the blanks.
          </SpeakSentence>
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 1 – LISTEN AND ANSWER (STICKY PLAYER) */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center rounded-t-[28px]">
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
            <div className="relative" style={{ animation: "fadeIn 0.3s ease-out" }}>
              
              {/* STICKY AUDIO PLAYER AND BUTTONS */}
              <div className="sticky top-0 z-50 flex flex-col items-center gap-4 py-4 pointer-events-none">
                <div className="pointer-events-auto">
                  <AudioPlayer src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l66-listenandnumber.mp3" />
                </div>
                
                {/* Number Buttons */}
                <div className="flex flex-wrap justify-center gap-2 pointer-events-auto bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-md border border-green-200">
                  {listenQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToQuestion(q.id)}
                      className="w-10 h-10 rounded-full bg-green-100 text-green-800 font-bold hover:bg-green-500 hover:text-white transition-colors border border-green-300 shadow-sm flex items-center justify-center"
                      title={`Ir para a questão ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8">
                <SpeakSentence
                  text="Listen to the audio and answer the questions."
                  className="text-md text-gray-600 mb-6 italic"
                >
                  🎧 Listen to the audio and answer the questions.
                </SpeakSentence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listenQuestions.map((q) => (
                    <div key={q.id} id={q.id} className="bg-green-50 p-5 rounded-2xl border border-green-200 scroll-mt-40">
                      <p className="font-bold text-green-800 mb-3">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-green-100 rounded-lg transition">
                            <input
                              type="radio"
                              name={q.id}
                              checked={listenAnswers[q.id] === idx}
                              onChange={() => setListenAnswers({ ...listenAnswers, [q.id]: idx })}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <button
                          onClick={() => checkListenAnswer(q.id)}
                          disabled={listenAnswers[q.id] === undefined}
                          className={`px-4 py-2 rounded-lg font-medium transition text-sm ${
                            listenAnswers[q.id] === undefined
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          Check Answer
                        </button>
                      </div>

                      {listenChecked[q.id] && (
                        <div className="mt-3">
                          {listenAnswers[q.id] === q.correct ? (
                            <div className="p-2 bg-green-100 border border-green-300 rounded-md text-sm text-green-800 font-medium flex items-center gap-2">
                              <CheckCircle size={16} /> Correct!
                            </div>
                          ) : (
                            <div className="p-2 bg-red-50 border border-red-300 rounded-md text-sm text-red-700 flex items-center gap-2">
                              <XCircle size={16} /> Incorrect. The right answer is: {q.options[q.correct]}
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
        {/* SEÇÃO 2 – SUBSTITUTION PRACTICE 1 */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice I</h2>
              <PencilIcon onClick={() => openNoteModal("Substitution Practice I")} />
            </div>
            <button
              onClick={() => toggleDrill("sub1")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.sub1 ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.sub1 && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {substitutionExercises.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                      globalShowPt={showAllPt}
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
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {affirmativeExercises.map((ex) => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <p className="font-medium text-green-700 mb-2">{ex.negative}</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={affAnswers[ex.id] || ""}
                        onChange={(e) => setAffAnswers({ ...affAnswers, [ex.id]: e.target.value })}
                        placeholder="Write the affirmative form..."
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                      <button
                        onClick={() => handleAffCheck(ex.id, ex.correct)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                      >
                        Check
                      </button>
                    </div>
                    {affChecked[ex.id] && (
                      <div className="mt-2">
                        {affResults[ex.id] ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> Correct!</span>
                        ) : (
                          <span className="text-red-600 text-sm flex items-center gap-1"><XCircle size={14}/> Expected: {ex.correct}</span>
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
        {/* SEÇÃO 4 – SUBSTITUTION PRACTICE 2 */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice II</h2>
              <PencilIcon onClick={() => openNoteModal("Substitution Practice II")} />
              
              {/* Global PT toggle */}
              <button
                onClick={() => setShowAllPt(!showAllPt)}
                className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-medium transition flex items-center gap-1"
                title={showAllPt ? "Ocultar todas as traduções" : "Mostrar todas as traduções"}
              >
                {showAllPt ? <EyeOff size={14} /> : <Eye size={14} />}
                {showAllPt ? "Ocultar PT" : "Mostrar PT"}
              </button>
            </div>
            <button
              onClick={() => toggleDrill("sub2")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.sub2 ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.sub2 && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {substitutionExercises2.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                      globalShowPt={showAllPt}
                    />
                  );
                })}
              </div>

              {/* EXTRA SPEAKING CHALLENGE */}
              <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-2 mb-4">
                  <Mic className="text-blue-600" size={24} />
                  <h3 className="text-xl font-bold text-blue-800">Extra speaking challenge</h3>
                </div>
                <p className="text-sm text-blue-700 mb-4 font-medium">Responda às perguntas usando as estruturas que acabou de aprender.</p>
                <div className="space-y-4">
                  {extraSpeakingQuestions.map((q, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
                      <p className="font-medium text-gray-800 mb-1">
                        {idx + 1}. <SpeakSentence text={q.en} className="text-blue-700" />
                      </p>
                      <p className="text-sm text-gray-600 italic">🇧🇷 {q.pt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 5 – CHANGE INTO NEGATIVE */}
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
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
                {negativeExercises.map((ex) => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                    <p className="font-medium text-green-700 mb-2">{ex.affirmative}</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={negAnswers[ex.id] || ""}
                        onChange={(e) => setNegAnswers({ ...negAnswers, [ex.id]: e.target.value })}
                        placeholder="Write the negative form..."
                        className="flex-1 p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none text-sm"
                      />
                      <button
                        onClick={() => handleNegCheck(ex.id, ex.correct)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition text-sm"
                      >
                        Check
                      </button>
                    </div>
                    {negChecked[ex.id] && (
                      <div className="mt-2">
                        {negResults[ex.id] ? (
                          <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14}/> Correct!</span>
                        ) : (
                          <span className="text-red-600 text-sm flex items-center gap-1"><XCircle size={14}/> Expected: {ex.correct}</span>
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
        {/* SEÇÃO 6 – TALK TO YOUR FRIEND */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Talk to Your Friend</h2>
              <PencilIcon onClick={() => openNoteModal("Talk to Your Friend")} />
            </div>
            <button
              onClick={() => toggleDrill("talk")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.talk ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.talk && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="bg-green-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-green-800">Complete the dialogue with the correct vocabulary:</h3>
                  <button
                    onClick={speakTalkDialogue}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition text-sm flex items-center gap-2 shadow-md"
                  >
                    <Volume2 size={16} /> Listen to the Dialogue
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm text-lg leading-relaxed space-y-4">
                  <p>
                    <strong>Person A:</strong> Hey, did you happen to see my{" "}
                    <input type="text" value={talkAnswers[0] || ""} onChange={e => setTalkAnswers({...talkAnswers, 0: e.target.value})} className={`inline-block w-28 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[0] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(1)" />? 
                    I've been searching for{" "}
                    <input type="text" value={talkAnswers[1] || ""} onChange={e => setTalkAnswers({...talkAnswers, 1: e.target.value})} className={`inline-block w-16 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[1] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(2)" />{" "}
                    everywhere.
                  </p>
                  <p>
                    <strong>Person B:</strong> Did you check the{" "}
                    <input type="text" value={talkAnswers[2] || ""} onChange={e => setTalkAnswers({...talkAnswers, 2: e.target.value})} className={`inline-block w-24 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[2] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(3)" />{" "}
                    in the bedroom?
                  </p>
                  <p>
                    <strong>Person A:</strong> Yes, I looked there, but I couldn't find it. What about my{" "}
                    <input type="text" value={talkAnswers[3] || ""} onChange={e => setTalkAnswers({...talkAnswers, 3: e.target.value})} className={`inline-block w-24 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[3] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(4)" />? 
                    I left{" "}
                    <input type="text" value={talkAnswers[4] || ""} onChange={e => setTalkAnswers({...talkAnswers, 4: e.target.value})} className={`inline-block w-16 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[4] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(5)" />{" "}
                    in my bag.
                  </p>
                  <p>
                    <strong>Person B:</strong> Oh, I think I saw it{" "}
                    <input type="text" value={talkAnswers[5] || ""} onChange={e => setTalkAnswers({...talkAnswers, 5: e.target.value})} className={`inline-block w-24 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[5] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(6)" />{" "}
                    the{" "}
                    <input type="text" value={talkAnswers[6] || ""} onChange={e => setTalkAnswers({...talkAnswers, 6: e.target.value})} className={`inline-block w-28 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[6] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(7)" />.
                  </p>
                  <p>
                    <strong>Person A:</strong> Great! And where did I leave my{" "}
                    <input type="text" value={talkAnswers[7] || ""} onChange={e => setTalkAnswers({...talkAnswers, 7: e.target.value})} className={`inline-block w-20 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[7] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(8)" />?
                  </p>
                  <p>
                    <strong>Person B:</strong> I think you left them{" "}
                    <input type="text" value={talkAnswers[8] || ""} onChange={e => setTalkAnswers({...talkAnswers, 8: e.target.value})} className={`inline-block w-20 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[8] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(9)" />{" "}
                    the{" "}
                    <input type="text" value={talkAnswers[9] || ""} onChange={e => setTalkAnswers({...talkAnswers, 9: e.target.value})} className={`inline-block w-24 border-b-2 focus:outline-none text-center ${talkChecked ? (talkResults[9] ? "border-green-500 text-green-700" : "border-red-500 text-red-700") : "border-gray-400"}`} placeholder="(10)" />{" "}
                    in the living room.
                  </p>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={checkTalk}
                    className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition font-medium shadow-md"
                  >
                    Check Answers
                  </button>
                </div>

                <div className="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-2">💡 Vocabulary Bank:</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {["ID", "charger", "driver's license", "name tag", "headphones", "keys", "coffee table", "armchair", "carpet", "chair", "desk", "dresser", "it", "them", "on", "under", "behind", "next to"].map(v => (
                      <span key={v} className="bg-white px-2 py-1 rounded border border-blue-200 text-blue-700 font-medium">{v}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================== */}
        {/* SEÇÃO 7 – TUNE IN YOUR EARS */}
        {/* ============================================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Tune in Your Ears</h2>
              <PencilIcon onClick={() => openNoteModal("Tune in Your Ears")} />
            </div>
            <button
              onClick={() => toggleDrill("tune")}
              className="inline-block rounded-full bg-white/20 text-white px-6 py-2 text-sm transition-all duration-300 hover:bg-white/30"
            >
              {openDrills.tune ? "Minimize" : "Open"}
            </button>
          </div>

          {openDrills.tune && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <div className="bg-green-50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-green-800">Listen to the text:</h3>
                  <AudioPlayer src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L66-tuneinyourears.mp4" />
                </div>

                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm text-lg leading-relaxed mb-8 italic text-gray-700">
                  <p>{tuneInText}</p>
                </div>

                {/* QUIZ ABOUT THE TEXT */}
                <h3 className="text-lg font-bold text-green-800 mb-4">Questions about the text:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tuneQuestions.map((q) => (
                    <div key={q.id} className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                      <p className="font-bold text-green-700 mb-2">{q.question}</p>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => (
                          <label key={idx} className="flex items-center gap-2 cursor-pointer p-1 hover:bg-green-50 rounded">
                            <input
                              type="radio"
                              name={q.id}
                              checked={tuneAnswers[q.id] === idx}
                              onChange={() => setTuneAnswers({ ...tuneAnswers, [q.id]: idx })}
                              className="w-4 h-4 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{opt}</span>
                          </label>
                        ))}
                      </div>
                      
                      <div className="mt-3">
                        <button
                          onClick={() => checkTuneAnswer(q.id)}
                          disabled={tuneAnswers[q.id] === undefined}
                          className={`px-3 py-1 rounded text-xs font-medium transition ${
                            tuneAnswers[q.id] === undefined
                              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700"
                          }`}
                        >
                          Check
                        </button>
                      </div>

                      {tuneChecked[q.id] && (
                        <div className="mt-2">
                          {tuneAnswers[q.id] === q.correct ? (
                            <span className="text-green-600 text-xs font-medium flex items-center gap-1"><CheckCircle size={12}/> Correct!</span>
                          ) : (
                            <span className="text-red-600 text-xs flex items-center gap-1"><XCircle size={12}/> Incorrect.</span>
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

        {/* NAVEGAÇÃO */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson65")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (65)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson67")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (67) &rarr;
          </button>
        </div>

      </div>

      <NoteModal
        key={noteModal.sectionTitle}
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
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