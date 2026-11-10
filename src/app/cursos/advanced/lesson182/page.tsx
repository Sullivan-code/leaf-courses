"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type SectionKey = "openDrills" | "reading" | "realLife";

interface ReadingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface MatchPair {
  left: string;
  right: string;
}

interface UnscrambleSentence {
  id: number;
  words: string[];
  correctSentence: string;
}

type OptionType = string | { label: string; replacement: string; pt?: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  options: OptionType[];
  currentIndex: number;
}

// ============================================
// IMAGES & AUDIO (LESSON 182)
// ============================================
const HERO_IMAGE =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Sobrecarga%20de%20Redes%20Sociais.png";

const NEWS_BACKGROUND =
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

const REAL_LIFE_IMAGE =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/182REALLIFE.png";

const REAL_LIFE_AUDIO =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/182reallife%20(online-audio-converter.com).mp3";

// ============================================
// SPEECH SYSTEM (American Female Voice)
// ============================================
const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const americanFemale = voices.find(
    (v) =>
      (v.lang === "en-US" || v.lang.startsWith("en-US")) &&
      (v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("google us english") ||
        v.name.toLowerCase().includes("siri") ||
        v.name.toLowerCase().includes("female") ||
        v.name === "Google US English" ||
        v.name === "Samantha")
  );
  const american = voices.find(
    (v) => v.lang === "en-US" || v.lang.startsWith("en-US")
  );
  if (americanFemale) utterance.voice = americanFemale;
  else if (american) utterance.voice = american;

  window.speechSynthesis.speak(utterance);
};

// ============================================
// SPEAK BUTTONS
// ============================================
const SpeakBtn = ({
  text,
  children,
  className = "",
  rate = 0.9,
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
  rate?: number;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      speakEnglish(text, rate);
    }}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-slate-200 px-1 rounded transition-colors group text-left ${className}`}
    title="Click to hear American pronunciation"
  >
    <span className="flex-1">{children || text}</span>
    <Volume2
      size={12}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 flex-shrink-0"
    />
  </button>
);

const SpeakSentence = ({
  text,
  children,
  className = "",
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        const speechText =
          children && typeof children === "string" ? children : text;
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-slate-100 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      <span className="inline">{children || text}</span>
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600"
      />
    </button>
  );
};

// ============================================
// AUDIO PLAYER
// ============================================
const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Audio error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-r from-slate-800 to-gray-700 rounded-2xl p-4 shadow-lg">
      <audio ref={audioRef} src={src} preload="auto" />
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 text-slate-800 hover:bg-gray-200 transition flex items-center justify-center shadow-md"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        <button
          onClick={resetAudio}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-900/60 text-gray-200 hover:bg-slate-900 transition flex items-center justify-center"
        >
          <RotateCcw size={16} />
        </button>
        <div className="flex-1">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full accent-gray-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-200 mt-1">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT: SUBSTITUTION OPTIONS
// ============================================
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

  const toggleVisibility = () => setShowEnglish((prev) => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);

  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm mb-4">
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-slate-800 font-semibold text-sm flex-1">
          {exercise.original}
        </p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-slate-600 hover:text-slate-800 flex-shrink-0"
          title={showEnglish ? "Hide English answer" : "Show English answer"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-gray-50 rounded-md border border-gray-200">
          <SpeakSentence
            text={currentSentence}
            className="text-slate-800 font-medium"
          >
            {currentSentence}
          </SpeakSentence>
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-gray-200 pt-1">
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
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
              exercise.currentIndex === index
                ? "bg-gradient-to-r from-slate-800 to-gray-700 text-white shadow"
                : "bg-gray-100 text-slate-700 hover:bg-gray-200 border border-gray-300"
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
// COMPONENT: MATCH BLOCK
// ============================================
const MATCH_PAIRS: MatchPair[] = [
  { left: "The director asked me if the", right: "information was confidential." },
  { left: "Sam asked his brother if he", right: "had ever read glossy magazines." },
  { left: "Riley asked me whether the newspaper", right: "conveyed the information in a clear way." },
  { left: "They asked me what my", right: "point of view was." },
  { left: "Tanya asked me if I had covered", right: "that day's story." },
];

function MatchBlock() {
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [leftItems, setLeftItems] = useState<string[]>(MATCH_PAIRS.map(p => p.left));
  const [rightItems, setRightItems] = useState<string[]>([]); // Starts empty to prevent mismatch
  const [matchedSentences, setMatchedSentences] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle only on client side to avoid hydration errors
    setRightItems([...MATCH_PAIRS].sort(() => Math.random() - 0.5).map(p => p.right));
  }, []);

  const handleLeftClick = (left: string) => {
    setSelectedLeft(left);
    speakEnglish(left);
  };

  const handleRightClick = (right: string) => {
    if (!selectedLeft) return;
    
    const correctPair = MATCH_PAIRS.find(p => p.left === selectedLeft && p.right === right);
    
    if (correctPair) {
      const fullSentence = `${selectedLeft} ${right}`;
      setMatchedSentences(prev => [...prev, fullSentence]);
      
      setLeftItems(prev => prev.filter(item => item !== selectedLeft));
      setRightItems(prev => prev.filter(item => item !== right));
      setSelectedLeft(null);
      speakEnglish(fullSentence);
    } else {
      alert("Incorrect match! Try again.");
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm mb-4">
      <p className="text-slate-800 font-bold mb-4">Match to form sentences.</p>
      
      {matchedSentences.length > 0 && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200 space-y-2">
          {matchedSentences.map((sentence, idx) => (
            <div key={idx} className="text-green-800 font-medium flex items-center gap-2">
              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
              <SpeakBtn text={sentence}>{sentence}</SpeakBtn>
            </div>
          ))}
        </div>
      )}

      {leftItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {leftItems.map(p => (
              <button
                key={p}
                onClick={() => handleLeftClick(p)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                  selectedLeft === p 
                    ? "bg-slate-800 text-white border-slate-900" 
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-slate-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {rightItems.map(r => (
              <button
                key={r}
                onClick={() => handleRightClick(r)}
                className="w-full text-left p-3 rounded-lg border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 text-slate-800 transition-all"
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-6 text-slate-500 font-medium">
          🎉 All sentences matched!
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENT: UNSCRAMBLE BLOCK
// ============================================
const UNSCRAMBLE_SENTENCES: UnscrambleSentence[] = [
  {
    id: 1,
    words: ["the", "headlines.", "asked", "were", "we", "write", "to", "if", "going", "They", "me"],
    correctSentence: "They asked me if we were going to write the headlines."
  },
  {
    id: 2,
    words: ["asked", "scoop", "conveyed", "Abigail", "whether", "the", "news.", "upsetting", "me"],
    correctSentence: "Abigail asked me whether the scoop conveyed upsetting news."
  },
  {
    id: 3,
    words: ["I", "read", "every", "the", "day.", "asked", "They", "news", "me", "if"],
    correctSentence: "They asked me if I read the news every day."
  }
];

function UnscrambleBlock({ data }: { data: UnscrambleSentence }) {
  const [availableWords, setAvailableWords] = useState<{ id: string, text: string }[]>([]);
  const [selectedWords, setSelectedWords] = useState<{ id: string, text: string }[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const dragItem = useRef<{ index: number, from: 'available' | 'selected' } | null>(null);

  useEffect(() => {
    const shuffled = [...data.words].sort(() => Math.random() - 0.5).map((w, i) => ({ id: `avail-${i}-${w}`, text: w }));
    setAvailableWords(shuffled);
    setIsMounted(true);
  }, [data.words]);

  const handleDragStart = (e: React.DragEvent, index: number, from: 'available' | 'selected') => {
    dragItem.current = { index, from };
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropInSelected = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!dragItem.current) return;
    
    const { index, from } = dragItem.current;
    
    if (from === 'selected') {
      const newSelected = [...selectedWords];
      const draggedItem = newSelected[index];
      newSelected.splice(index, 1);
      newSelected.splice(targetIndex, 0, draggedItem);
      setSelectedWords(newSelected);
    } else {
      const itemToMove = availableWords[index];
      const newAvailable = [...availableWords];
      newAvailable.splice(index, 1);
      
      const newSelected = [...selectedWords];
      newSelected.splice(targetIndex, 0, itemToMove);
      
      setAvailableWords(newAvailable);
      setSelectedWords(newSelected);
    }
    
    dragItem.current = null;
    setIsCorrect(null);
  };

  const handleDropInAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem.current) return;
    
    const { index, from } = dragItem.current;
    
    if (from === 'selected') {
      const itemToMove = selectedWords[index];
      const newSelected = [...selectedWords];
      newSelected.splice(index, 1);
      
      setSelectedWords(newSelected);
      setAvailableWords([...availableWords, itemToMove]);
    }
    
    dragItem.current = null;
    setIsCorrect(null);
  };

  const handleDropAtEnd = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragItem.current) return;
    
    const { index, from } = dragItem.current;
    
    if (from === 'available') {
      const itemToMove = availableWords[index];
      const newAvailable = [...availableWords];
      newAvailable.splice(index, 1);
      
      setAvailableWords(newAvailable);
      setSelectedWords([...selectedWords, itemToMove]);
    } else {
      const newSelected = [...selectedWords];
      const itemToMove = newSelected[index];
      newSelected.splice(index, 1);
      newSelected.push(itemToMove);
      setSelectedWords(newSelected);
    }
    
    dragItem.current = null;
    setIsCorrect(null);
  };

  const checkAnswer = () => {
    const userSentence = selectedWords.map(w => w.text).join(" ");
    const correct = userSentence === data.correctSentence;
    setIsCorrect(correct);
    if (correct) speakEnglish(userSentence);
  };

  const clearAll = () => {
    const shuffled = [...data.words].sort(() => Math.random() - 0.5).map((w, i) => ({ id: `avail-${i}-${w}`, text: w }));
    setAvailableWords(shuffled);
    setSelectedWords([]);
    setIsCorrect(null);
  };

  if (!isMounted) return <div className="p-4 text-center text-gray-400 text-sm">Loading exercise...</div>;

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm mb-4">
      <p className="text-slate-800 font-bold mb-4 text-sm">Unscramble the words to form sentences. Drag and drop to arrange them.</p>
      
      <div 
        className="min-h-[80px] p-3 bg-gray-50 border-2 border-dashed border-gray-400 rounded-lg mb-4 flex flex-wrap gap-2 items-start content-start"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropAtEnd}
      >
        {selectedWords.length === 0 && (
          <span className="text-gray-400 text-sm italic pointer-events-none p-1">Drag words here...</span>
        )}
        {selectedWords.map((word, i) => (
          <div
            key={word.id}
            draggable
            onDragStart={(e) => handleDragStart(e, i, 'selected')}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.stopPropagation();
              handleDropInSelected(e, i);
            }}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-sm font-medium cursor-grab active:cursor-grabbing hover:bg-slate-700 transition flex items-center gap-1 shadow-sm"
          >
            {word.text}
          </div>
        ))}
      </div>

      <div 
        className="flex flex-wrap gap-2 mb-6 min-h-[50px] p-2 rounded-lg"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropInAvailable}
      >
        {availableWords.map((word, i) => (
          <div
            key={word.id}
            draggable
            onDragStart={(e) => handleDragStart(e, i, 'available')}
            className="px-3 py-1.5 bg-gray-100 border border-gray-300 text-slate-700 rounded-md text-sm font-medium cursor-grab active:cursor-grabbing hover:bg-gray-200 transition shadow-sm"
          >
            {word.text}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={clearAll}
          className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
        >
          Clear / Reset
        </button>
        <button
          onClick={checkAnswer}
          disabled={availableWords.length > 0}
          className={`px-5 py-2 rounded-lg font-bold text-sm transition ${
            availableWords.length > 0 
              ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
              : "bg-slate-800 text-white hover:bg-slate-900 shadow-md"
          }`}
        >
          Check Answer
        </button>
      </div>

      {isCorrect !== null && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="font-semibold">
            {isCorrect ? "Correct! Perfect order." : "Not quite. Keep swapping the words!"}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// DATA: MCQ & READING
// ============================================
const READING_TEXT = `A well-known soccer player had her visa denied and is not going to play at the World Cup. One of the most important soccer players from the Australian team, Antonia Hinter, said she was really surprised when she received the news and is devastated. She is talking with the authorities, trying to solve the problem as fast as she can. She said to our reporters: "I'm really sad about the news, but I'll try to get a new visa as soon as possible. It is my dream to play at the World Cup and I won't let that stop me!"`;

const READING_QUESTIONS: ReadingQuestion[] = [
  {
    id: 1,
    question: "What is the best headline for this news story?",
    options: [
      "Australian team out of World Cup.",
      "The end of the Australian team in the World Cup.",
      "World Cup: Bad news for Australian fans."
    ],
    correctAnswer: "World Cup: Bad news for Australian fans."
  },
  {
    id: 2,
    question: "Antonia Hinter gave a/an [ ___ ] for the fans.",
    options: [
      "confidential",
      "astonishing",
      "upsetting",
      "testimonial"
    ],
    correctAnswer: "testimonial"
  },
  {
    id: 3,
    question: "What is the most appropriate sensationalist headline?",
    options: [
      "THE END OF A DREAM.",
      "WORLD CUP: IS THIS THE END FOR THE AUSTRALIAN TEAM?",
      "IS THIS THE END OF THE WORLD CUP?"
    ],
    correctAnswer: "WORLD CUP: IS THIS THE END FOR THE AUSTRALIAN TEAM?"
  }
];

// NEW SUBSTITUTION DRILLS FOR LESSON 182
const OPEN_DRILLS_SUBSTITUTION: SubstitutionExercise[] = [
  {
    key: "drill-1",
    original: "Soccer player: visa / passport / ticket",
    options: [
      {
        label: "visa",
        replacement: "A well-known soccer player had her visa denied.",
        pt: "Uma jogadora de futebol conhecida teve seu visto negado.",
      },
      {
        label: "passport",
        replacement: "A well-known soccer player had her passport denied.",
        pt: "Uma jogadora de futebol conhecida teve seu passaporte negado.",
      },
      {
        label: "ticket",
        replacement: "A well-known soccer player had her ticket denied.",
        pt: "Uma jogadora de futebol conhecida teve seu bilhete negado.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-2",
    original: "She was really... surprised / devastated / sad",
    options: [
      {
        label: "surprised",
        replacement: "Antonia said she was really surprised when she received the news.",
        pt: "Antonia disse que ficou muito surpresa quando recebeu a notícia.",
      },
      {
        label: "devastated",
        replacement: "Antonia said she was really devastated when she received the news.",
        pt: "Antonia disse que ficou arrasada quando recebeu a notícia.",
      },
      {
        label: "sad",
        replacement: "Antonia said she was really sad when she received the news.",
        pt: "Antonia disse que ficou muito triste quando recebeu a notícia.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-3",
    original: "Talking with the... authorities / police / reporters",
    options: [
      {
        label: "authorities",
        replacement: "She is talking with the authorities trying to solve the problem.",
        pt: "Ela está conversando com as autoridades tentando resolver o problema.",
      },
      {
        label: "police",
        replacement: "She is talking with the police trying to solve the problem.",
        pt: "Ela está conversando com a polícia tentando resolver o problema.",
      },
      {
        label: "reporters",
        replacement: "She is talking with the reporters trying to solve the problem.",
        pt: "Ela está conversando com os repórteres tentando resolver o problema.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-4",
    original: "It is my... dream / goal / wish",
    options: [
      {
        label: "dream",
        replacement: "It is my dream to play at the World Cup.",
        pt: "É o meu sonho jogar na Copa do Mundo.",
      },
      {
        label: "goal",
        replacement: "It is my goal to play at the World Cup.",
        pt: "É o meu objetivo jogar na Copa do Mundo.",
      },
      {
        label: "wish",
        replacement: "It is my wish to play at the World Cup.",
        pt: "É o meu desejo jogar na Copa do Mundo.",
      },
    ],
    currentIndex: 0,
  },
];

// FILL IN THE BLANKS
const FILL_BLANKS = [
  {
    id: 1,
    sentence: "Owen asked me if I had [ ___ ] the right title for the story.",
    options: ["to pick", "picked", "pick", "picking"],
    correctAnswer: "picked"
  },
  {
    id: 2,
    sentence: "Charlotte wondered whether the man following her was the [ ___ ] from the news.",
    options: ["newspaper", "stalker", "sensationalist", "scoop"],
    correctAnswer: "stalker"
  },
  {
    id: 3,
    sentence: "They asked me [ ___ ] I preferred tabloids to glossy magazines.",
    options: ["what", "in", "who", "if"],
    correctAnswer: "if"
  },
  {
    id: 4,
    sentence: "Ava wanted to know if that newspaper [ ___ ] the truth.",
    options: ["cover", "convey", "conveyed", "picked"],
    correctAnswer: "conveyed"
  }
];

// ============================================
// COMPONENT: MCQ BLOCK
// ============================================
function MCQBlock({ q, onAnswer }: { q: any, onAnswer: (id: number, ans: string, isCorrect: boolean) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm mb-4">
      <div className="flex items-start gap-2 mb-3">
        {q.id && (
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 text-white text-sm font-bold flex items-center justify-center">
            {q.id}
          </span>
        )}
        <SpeakBtn text={q.question || q.sentence} className="text-gray-900 font-medium">
          {q.question || q.sentence}
        </SpeakBtn>
      </div>
      <div className="space-y-2 mt-4">
        {q.options.map((opt: string) => {
          const isCorrect = opt === q.correctAnswer;
          const isSelected = selected === opt;
          
          let btnClass = "bg-gray-100 hover:bg-gray-200 text-slate-800 border-gray-300";
          if (selected) {
            if (isCorrect) btnClass = "bg-green-100 border-green-500 text-green-900 font-bold";
            else if (isSelected) btnClass = "bg-red-100 border-red-500 text-red-900";
            else btnClass = "bg-gray-50 text-gray-400 border-gray-200 opacity-50";
          }

          return (
            <button
              key={opt}
              disabled={selected !== null}
              onClick={() => {
                setSelected(opt);
                onAnswer(q.id, opt, isCorrect);
                speakEnglish(opt);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${selected === q.correctAnswer ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {selected === q.correctAnswer ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="font-semibold">
            {selected === q.correctAnswer ? "Correct!" : `Expected: ${q.correctAnswer}`}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// SECTION WRAPPER
// ============================================
function Section({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 border-2 border-gray-400 bg-gradient-to-br from-gray-50 to-slate-100 rounded-3xl shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-slate-800 via-gray-700 to-slate-900 text-gray-100 py-4 px-6 flex items-center justify-between"
      >
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <span>{icon}</span> {title}
        </h2>
        {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>
      {open && (
        <div className="p-5 md:p-7" style={{ animation: "fadeIn 0.25s ease-out" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson182NewsMedia() {
  const router = useRouter();
  const STORAGE_KEY = "lesson182_news_media_answers_v1";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    openDrills: true,
    reading: true,
    realLife: true,
  });

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [realLifeAnswers, setRealLifeAnswers] = useState<Record<number, string>>({});
  const [drillState, setDrillState] = useState<Record<string, number>>({});

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isRealLifeImageModalOpen, setIsRealLifeImageModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.mcqAnswers) setMcqAnswers(parsed.mcqAnswers);
        if (parsed.realLifeAnswers) setRealLifeAnswers(parsed.realLifeAnswers);
      }
    } catch (err) {
      console.warn("Could not load saved answers:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const payload = {
          mcqAnswers,
          realLifeAnswers,
          lastSaved: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (err) {
        console.warn("Could not save answers:", err);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [mcqAnswers, realLifeAnswers]);

  const handleMcqAnswer = (id: number, ans: string, isCorrect: boolean) => {
    setMcqAnswers((prev) => ({ ...prev, [id]: ans }));
  };

  const handleRealLifeChange = (id: number, value: string) =>
    setRealLifeAnswers((prev) => ({ ...prev, [id]: value }));

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleDrillSelect = (key: string, index: number) =>
    setDrillState((prev) => ({ ...prev, [key]: index }));

  const getDrillIndex = (key: string) => drillState[key] || 0;

  return (
    <div
      className="min-h-screen py-8 md:py-16 px-4 md:px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(40, 40, 40, 0.75), rgba(30, 30, 30, 0.75)), url("${NEWS_BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-6 md:p-10 border-4 border-slate-400/40">
        
        {/* ===================== HERO IMAGE ===================== */}
        <div className="mb-10">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-500/60 group cursor-pointer"
            onClick={() => setIsHeroModalOpen(true)}
          >
            <img
              src={HERO_IMAGE}
              alt="Lesson 182 News & Media"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/30 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-300 text-slate-900 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 182
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-50 drop-shadow-lg">
                  📰 News & Media
                </h1>
                <p className="text-gray-200 text-sm md:text-base mt-2 max-w-2xl">
                  Interactive Practice · Tabloids, Headlines & Reported Speech
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 1. OPEN DRILLS ===================== */}
        <Section title="OPEN DRILLS" icon="🔁" open={openSections.openDrills} onToggle={() => toggleSection("openDrills")}>
          
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Match to form sentences</h3>
            <MatchBlock />
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Choose an option to substitute the words</h3>
            <div className="space-y-4">
              {OPEN_DRILLS_SUBSTITUTION.map((ex) => (
                <SubstitutionOptions
                  key={ex.key}
                  exercise={{ ...ex, currentIndex: getDrillIndex(ex.key) }}
                  onOptionClick={handleDrillSelect}
                />
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Choose the correct option to fill in the blanks</h3>
            {FILL_BLANKS.map((q) => (
              <MCQBlock key={q.id} q={q} onAnswer={handleMcqAnswer} />
            ))}
          </div>

          <div>
            <h3 className="font-bold text-slate-800 text-lg mb-4">Unscramble the words to form sentences</h3>
            {UNSCRAMBLE_SENTENCES.map((q) => (
              <UnscrambleBlock key={q.id} data={q} />
            ))}
          </div>

        </Section>

        {/* ===================== 2. READING TIME ===================== */}
        <Section title="READING TIME" icon="📖" open={openSections.reading} onToggle={() => toggleSection("reading")}>
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-lg">📰 Reading Comprehension</h3>
              <SpeakBtn text={READING_TEXT} className="text-sm font-semibold text-slate-800 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-100">
                🔊 Listen to the text
              </SpeakBtn>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-800 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
              {READING_TEXT}
            </p>

            <h4 className="font-bold text-slate-800 mb-4">Read the text and choose the correct option.</h4>
            {READING_QUESTIONS.map((q) => (
              <MCQBlock key={q.id} q={q} onAnswer={handleMcqAnswer} />
            ))}
          </div>
        </Section>

        {/* ===================== 3. REAL LIFE ===================== */}
        <Section title="REAL LIFE" icon="🔹" open={openSections.realLife} onToggle={() => toggleSection("realLife")}>
          <div className="mb-6">
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-slate-500/60 group cursor-pointer"
              onClick={() => setIsRealLifeImageModalOpen(true)}
            >
              <img
                src={REAL_LIFE_IMAGE}
                alt="Real Life – Lesson 182"
                className="w-full max-h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent flex items-end p-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-gray-300 text-slate-900 text-xs font-extrabold tracking-wider mb-2 shadow">
                    REAL LIFE
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-gray-50 drop-shadow">
                    Real Life Listening
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <AudioPlayer src={REAL_LIFE_AUDIO} />
          </div>

          {/* Real Life Questions (Text Input) */}
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 text-lg mb-1">✍️ Real Life Comprehension</h3>
            <p className="text-sm text-slate-700 mb-5 italic">Answer the questions based on what you heard in the audio.</p>

            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((id) => (
                <div key={id} className="p-4 rounded-xl bg-gray-50 border border-gray-300">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-700 text-white text-sm font-bold flex items-center justify-center">
                      {id}
                    </span>
                    <span className="text-gray-900 font-medium">Question {id}</span>
                  </div>
                  <textarea
                    value={realLifeAnswers[id] || ""}
                    onChange={(e) => handleRealLifeChange(id, e.target.value)}
                    placeholder="Write your answer here…"
                    className="w-full h-20 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 resize-none text-gray-800"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* NAVIGATION */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/cursos")}
            className="bg-slate-800 hover:bg-slate-900 text-gray-50 font-semibold py-3 px-8 rounded-full transition"
          >
            ← Back to Courses
          </button>
          <button
            onClick={() => router.push("/cursos/lesson183")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Next Lesson (183) →
          </button>
        </div>

      </div>

      {/* MODALS FOR IMAGES */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => setIsHeroModalOpen(false)}>
          <div className="relative max-w-6xl max-h-full">
            <img src={HERO_IMAGE} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
            <button className="absolute top-3 right-3 bg-slate-800/80 text-gray-100 rounded-full p-2"><X size={22} /></button>
          </div>
        </div>
      )}

      {isRealLifeImageModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4" onClick={() => setIsRealLifeImageModalOpen(false)}>
          <div className="relative max-w-6xl max-h-full">
            <img src={REAL_LIFE_IMAGE} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
            <button className="absolute top-3 right-3 bg-slate-800/80 text-gray-100 rounded-full p-2"><X size={22} /></button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}