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
  FileText,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type SectionKey = "openDrills" | "reading" | "expressions";

interface ReadingQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

type OptionType = string | { label: string; replacement: string; pt?: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  options: OptionType[];
  currentIndex: number;
}

// ============================================
// IMAGES & AUDIO
// ============================================
const HERO_IMAGE =
  "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"; // AI/Media Theme

const NEWS_BACKGROUND =
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

// ============================================
// SPEECH SYSTEM
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
}) => (
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
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
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
    if (isPlaying) audio.pause();
    else audio.play().catch((err) => console.error("Audio error:", err));
    setIsPlaying(!isPlaying);
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
          onClick={() => {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              setCurrentTime(0);
            }
          }}
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
// SUBSTITUTION OPTIONS
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

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm mb-4">
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-slate-800 font-semibold text-sm flex-1">
          {exercise.original}
        </p>
        <button
          onClick={() => setShowEnglish(!showEnglish)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-slate-600 hover:text-slate-800 flex-shrink-0"
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
        {exercise.options.map((option, index) => {
          const label = isObjectOption(option) ? option.label : String(option);
          const replacement = isObjectOption(option)
            ? option.replacement
            : String(option);
          return (
            <button
              key={index}
              onClick={() => {
                onOptionClick(exercise.key, index);
                speakEnglish(replacement, 0.9);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                exercise.currentIndex === index
                  ? "bg-gradient-to-r from-slate-800 to-gray-700 text-white shadow"
                  : "bg-gray-100 text-slate-700 hover:bg-gray-200 border border-gray-300"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// DATA: OPEN DRILLS (Contextualized Substitutions)
// ============================================
const OPEN_DRILLS: SubstitutionExercise[] = [
  {
    key: "drill-1",
    original: "The proliferation of deepfakes makes it harder to distinguish fact from fiction.",
    options: [
      {
        label: "the truth",
        replacement: "The proliferation of deepfakes makes it harder to distinguish the truth from fiction.",
        pt: "A proliferação de deepfakes torna mais difícil distinguir a verdade da ficção.",
      },
      {
        label: "reality",
        replacement: "The proliferation of deepfakes makes it harder to distinguish reality from fiction.",
        pt: "A proliferação de deepfakes torna mais difícil distinguir a realidade da ficção.",
      },
      {
        label: "genuine news",
        replacement: "The proliferation of deepfakes makes it harder to distinguish genuine news from fiction.",
        pt: "A proliferação de deepfakes torna mais difícil distinguir notícias genuínas da ficção.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-2",
    original: "Social media algorithms often create echo chambers that reinforce our existing biases.",
    options: [
      {
        label: "filter bubbles",
        replacement: "Social media algorithms often create filter bubbles that reinforce our existing biases.",
        pt: "Os algoritmos das redes sociais geralmente criam bolhas de filtro que reforçam nossos vieses existentes.",
      },
      {
        label: "fake news",
        replacement: "Social media algorithms often create fake news that reinforce our existing biases.",
        pt: "Os algoritmos das redes sociais geralmente criam fake news que reforçam nossos vieses existentes.",
      },
      {
        label: "clickbait",
        replacement: "Social media algorithms often create clickbait that reinforce our existing biases.",
        pt: "Os algoritmos das redes sociais geralmente criam clickbaits que reforçam nossos vieses existentes.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-3",
    original: "The journalist insisted on verifying the anonymous source before publishing the story.",
    options: [
      {
        label: "fact-checking",
        replacement: "The journalist insisted on fact-checking the anonymous source before publishing the story.",
        pt: "O jornalista insistiu em verificar os fatos da fonte anônima antes de publicar a história.",
      },
      {
        label: "authenticating",
        replacement: "The journalist insisted on authenticating the anonymous source before publishing the story.",
        pt: "O jornalista insistiu em autenticar a fonte anônima antes de publicar a história.",
      },
      {
        label: "investigating",
        replacement: "The journalist insisted on investigating the anonymous source before publishing the story.",
        pt: "O jornalista insistiu em investigar a fonte anônima antes de publicar a história.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-4",
    original: "He recommended that we take sensationalist headlines with a grain of salt.",
    options: [
      {
        label: "skeptical",
        replacement: "He recommended that we be skeptical of sensationalist headlines.",
        pt: "Ele recomendou que fôssemos céticos em relação às manchetes sensacionalistas.",
      },
      {
        label: "critical",
        replacement: "He recommended that we be critical of sensationalist headlines.",
        pt: "Ele recomendou que fôssemos críticos em relação às manchetes sensacionalistas.",
      },
      {
        label: "cautious",
        replacement: "He recommended that we be cautious of sensationalist headlines.",
        pt: "Ele recomendou que fôssemos cautelosos em relação às manchetes sensacionalistas.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-5",
    original: "She said she had never seen such a credible source for an investigation.",
    options: [
      {
        label: "reliable",
        replacement: "She said she had never seen such a reliable source for an investigation.",
        pt: "Ela disse que nunca tinha visto uma fonte tão confiável para uma investigação.",
      },
      {
        label: "trustworthy",
        replacement: "She said she had never seen such a trustworthy source for an investigation.",
        pt: "Ela disse que nunca tinha visto uma fonte tão confiável/digna de confiança para uma investigação.",
      },
      {
        label: "valid",
        replacement: "She said she had never seen such a valid source for an investigation.",
        pt: "Ela disse que nunca tinha visto uma fonte tão válida para uma investigação.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-6",
    original: "The authorities are trying to track down the creators of the viral misinformation.",
    options: [
      {
        label: "synthetic media",
        replacement: "The authorities are trying to track down the creators of the viral synthetic media.",
        pt: "As autoridades estão tentando rastrear os criadores da mídia sintética viral.",
      },
      {
        label: "deepfakes",
        replacement: "The authorities are trying to track down the creators of the viral deepfakes.",
        pt: "As autoridades estão tentando rastrear os criadores dos deepfakes virais.",
      },
      {
        label: "disinformation",
        replacement: "The authorities are trying to track down the creators of the viral disinformation.",
        pt: "As autoridades estão tentando rastrear os criadores da desinformação viral.",
      },
    ],
    currentIndex: 0,
  }
];

// ============================================
// DATA: EXPRESSIONS & VOCABULARY
// ============================================
const USEFUL_EXPRESSIONS = [
  {
    en: "Take it with a grain of salt.",
    pt: "Não acredite em tudo o que ouve (com um grão de sal).",
  },
  {
    en: "The line between fact and fiction is blurring.",
    pt: "A linha entre fato e ficção está se tornando tênue.",
  },
  {
    en: "To fact-check a claim.",
    pt: "Verificar a veracidade de uma alegação.",
  },
  {
    en: "To fall victim to misinformation.",
    pt: "Cair vítima de desinformação.",
  },
  {
    en: "An echo chamber of opinions.",
    pt: "Uma câmara de eco de opiniões.",
  },
];

const KEY_WORDS: Record<string, string> = {
  deepfake: "a video, image, or audio recording that has been manipulated using artificial intelligence",
  proliferation: "rapid increase in numbers",
  indistinguishable: "impossible to tell apart",
  authentic: "of undisputed origin; genuine",
  manipulate: "to control or influence unfairly or unscrupulously",
  skepticism: "doubt as to the truth of something",
  algorithm: "a process or set of rules followed by a computer",
  synthetic: "made by chemical synthesis, especially to imitate a natural product",
};

// ============================================
// DATA: READING TEXT & QUESTIONS
// ============================================
const READING_TEXT = `In recent years, the rapid proliferation of artificial intelligence has given rise to a phenomenon known as "deepfakes" — highly realistic synthetic media in which a person's face or voice is manipulated to say or do things they never actually did. While the technology was initially a novelty, it has quickly become a tool for malicious actors seeking to spread disinformation and undermine public trust.

The danger of deepfakes lies in their ability to be virtually indistinguishable from reality. When a convincing video of a political leader making inflammatory remarks surfaces online, it can go viral within minutes, reaching millions before fact-checkers have a chance to debunk it. This creates an environment of deep skepticism, where the public struggles to discern what is authentic and what is fabricated. Paradoxically, this skepticism can also be weaponized; politicians caught in genuine scandals may dismiss legitimate footage as "fake news."

To combat this rising threat, educators and tech companies are emphasizing the importance of media literacy. Audiences are encouraged to verify sources, look for inconsistencies in lighting or audio, and approach sensationalist headlines with a grain of salt. The line between fact and fiction is blurring, and navigating this new landscape requires a collective commitment to truth and critical thinking.`;

const READING_QUESTIONS: ReadingQuestion[] = [
  {
    id: 1,
    question: "What is the main problem associated with the rise of deepfakes according to the text?",
    options: [
      "They are too expensive to produce for the average person.",
      "They are virtually indistinguishable from reality and can spread misinformation rapidly.",
      "They are mainly used to create comedic videos and memes.",
    ],
    correctAnswer: "They are virtually indistinguishable from reality and can spread misinformation rapidly.",
  },
  {
    id: 2,
    question: "How can the skepticism created by deepfakes actually be dangerous?",
    options: [
      "It makes people stop using social media entirely.",
      "It forces tech companies to shut down AI development.",
      "It allows people in real scandals to dismiss authentic footage as 'fake news'.",
    ],
    correctAnswer: "It allows people in real scandals to dismiss authentic footage as 'fake news'.",
  },
  {
    id: 3,
    question: "What does the author recommend to combat the threat of synthetic media?",
    options: [
      "Banning all AI technology immediately.",
      "Only trusting news from a single government source.",
      "Emphasizing media literacy and critical thinking (verifying sources, approaching headlines cautiously).",
    ],
    correctAnswer: "Emphasizing media literacy and critical thinking (verifying sources, approaching headlines cautiously).",
  },
];

// ============================================
// COMPONENT: READING TEXT WITH CLICKABLE WORDS
// ============================================
function ReadingText({
  text,
  keyWords,
  onWordClick,
  activeWord,
}: {
  text: string;
  keyWords: Record<string, string>;
  onWordClick: (word: string | null) => void;
  activeWord: string | null;
}) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className="space-y-4">
      {paragraphs.map((para, pIdx) => {
        const tokens = para.split(/(\s+)/);
        return (
          <p key={pIdx} className="text-lg leading-relaxed text-gray-800">
            {tokens.map((token, tIdx) => {
              const clean = token.replace(/[^a-zA-Z']/g, "").toLowerCase();
              const matchedKey = Object.keys(keyWords).find(
                (kw) =>
                  clean === kw ||
                  clean === kw + "s" ||
                  clean === kw + "ed" ||
                  clean === kw + "ing"
              );
              if (matchedKey) {
                return (
                  <span
                    key={tIdx}
                    onClick={() =>
                      onWordClick(activeWord === matchedKey ? null : matchedKey)
                    }
                    className={`cursor-pointer font-bold transition-colors ${
                      activeWord === matchedKey
                        ? "bg-slate-800 text-white px-1 rounded"
                        : "text-slate-700 hover:bg-slate-200 rounded px-0.5"
                    }`}
                    title="Click to see definition"
                  >
                    {token}
                  </span>
                );
              }
              return <span key={tIdx}>{token}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

// ============================================
// MCQ BLOCK
// ============================================
function MCQBlock({
  q,
  onAnswer,
}: {
  q: ReadingQuestion;
  onAnswer: (id: number, ans: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm mb-4">
      <div className="flex items-start gap-2 mb-3">
        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 text-white text-sm font-bold flex items-center justify-center">
          {q.id}
        </span>
        <SpeakBtn text={q.question} className="text-gray-900 font-medium">
          {q.question}
        </SpeakBtn>
      </div>
      <div className="space-y-2 mt-4">
        {q.options.map((opt) => {
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
                onAnswer(q.id, opt);
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
        <div
          className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
            selected === q.correctAnswer
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {selected === q.correctAnswer ? (
            <CheckCircle size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span className="font-semibold">
            {selected === q.correctAnswer
              ? "Correct!"
              : `Expected: ${q.correctAnswer}`}
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
export default function Lesson184NewsMedia() {
  const router = useRouter();
  const STORAGE_KEY = "lesson184_news_media_answers_v1";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    openDrills: true,
    reading: true,
    expressions: true,
  });

  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [drillState, setDrillState] = useState<Record<string, number>>({});
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.mcqAnswers) setMcqAnswers(parsed.mcqAnswers);
      }
    } catch (err) {
      console.warn("Could not load saved answers:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            mcqAnswers,
            lastSaved: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.warn("Could not save answers:", err);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [mcqAnswers]);

  const handleMcqAnswer = (id: number, ans: string) =>
    setMcqAnswers((prev) => ({ ...prev, [id]: ans }));

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
              alt="Lesson 184 AI & Media"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-800/30 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-300 text-slate-900 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 184
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-50 drop-shadow-lg">
                  📰 AI & The Future of Media
                </h1>
                <p className="text-gray-200 text-sm md:text-base mt-2 max-w-2xl">
                  Deepfakes, Echo Chambers & Navigating Misinformation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== 1. OPEN DRILLS ===================== */}
        <Section
          title="OPEN DRILLS (Advanced)"
          icon="🔁"
          open={openSections.openDrills}
          onToggle={() => toggleSection("openDrills")}
        >
          <p className="text-slate-600 italic mb-6">
            <SpeakBtn text="Choose an option to substitute the words. Click the eye icon to hide or show the English answer and its Portuguese translation.">
              🔄 Choose an option to substitute the words. Click the eye icon to hide or show the English answer and its Portuguese translation.
            </SpeakBtn>
          </p>
          <div className="space-y-4">
            {OPEN_DRILLS.map((ex) => (
              <SubstitutionOptions
                key={ex.key}
                exercise={{ ...ex, currentIndex: getDrillIndex(ex.key) }}
                onOptionClick={handleDrillSelect}
              />
            ))}
          </div>
        </Section>

        {/* ===================== 2. READING TIME ===================== */}
        <Section
          title="READING TIME"
          icon="📖"
          open={openSections.reading}
          onToggle={() => toggleSection("reading")}
        >
          <div className="bg-white rounded-2xl border border-gray-300 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="font-bold text-slate-900 text-xl">
                📰 The Rise of Deepfakes: Navigating the New Era of Disinformation
              </h3>
              <SpeakBtn
                text={READING_TEXT}
                className="text-sm font-semibold text-slate-800 border border-slate-300 rounded-full px-3 py-1 hover:bg-slate-100"
              >
                🔊 Listen to the text
              </SpeakBtn>
            </div>

            <div className="border-l-4 border-slate-500 pl-4 mb-4">
              <p className="text-sm text-gray-600 italic">
                Read the text below. Click any <span className="text-slate-800 font-bold">bold word</span> to see its English definition.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <ReadingText
                text={READING_TEXT}
                keyWords={KEY_WORDS}
                onWordClick={setActiveWord}
                activeWord={activeWord}
              />
            </div>

            {activeWord && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-slate-800 to-gray-700 text-gray-50 shadow-lg animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-300 mb-1">
                      Definition
                    </div>
                    <div className="text-xl font-bold mb-1">{activeWord}</div>
                    <div className="text-sm">{KEY_WORDS[activeWord]}</div>
                  </div>
                  <button
                    onClick={() => setActiveWord(null)}
                    className="text-gray-300 hover:text-white text-2xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            <h4 className="font-bold text-slate-800 mt-8 mb-4 text-lg">
              Read the text and choose the correct option.
            </h4>
            {READING_QUESTIONS.map((q) => (
              <MCQBlock
                key={q.id}
                q={q}
                onAnswer={handleMcqAnswer}
              />
            ))}
          </div>
        </Section>

        {/* ===================== 3. EXPRESSIONS ===================== */}
        <Section
          title="USEFUL EXPRESSIONS"
          icon="💬"
          open={openSections.expressions}
          onToggle={() => toggleSection("expressions")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {USEFUL_EXPRESSIONS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm flex flex-col justify-center"
              >
                <SpeakBtn
                  text={item.en}
                  className="text-slate-800 font-bold text-lg mb-1"
                >
                  {item.en}
                </SpeakBtn>
                <p className="text-sm text-gray-600">🇧🇷 {item.pt}</p>
              </div>
            ))}
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
            onClick={() => router.push("/cursos/advanced/lesson185")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Next Lesson (185) →
          </button>
        </div>

      </div>

      {/* MODALS FOR IMAGES */}
      {isHeroModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setIsHeroModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={HERO_IMAGE}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              alt="Enlarged view"
            />
            <button className="absolute top-3 right-3 bg-slate-800/80 text-gray-100 rounded-full p-2">
              <X size={22} />
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
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