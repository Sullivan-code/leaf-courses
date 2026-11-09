"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  Save,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Trash2,
  Info,
  Eye,
  EyeOff,
  X,
  Play,
  Pause,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type SectionKey =
  | "verbs"
  | "newWords"
  | "speakNative"
  | "functions"
  | "openDrills"
  | "reading"
  | "realLife";

interface VocabularyItem {
  word: string;
  definition: string;
}

interface ReadingQuestion {
  id: number;
  question: string;
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
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Sobrecarga%20de%20Redes%20Sociais.png";

const NEWS_BACKGROUND =
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

const REAL_LIFE_IMAGE =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/181REALLIFE.png";

const REAL_LIFE_AUDIO =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/181reallife%20(online-audio-converter.com).mp3";

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
// SPEAK BUTTON
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
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-amber-100 px-1 rounded transition-colors group text-left ${className}`}
    title="Click to hear American pronunciation"
  >
    <span className="flex-1">{children || text}</span>
    <Volume2
      size={12}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-600 flex-shrink-0"
    />
  </button>
);

// ============================================
// SPEAK SENTENCE
// ============================================
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
      className={`group cursor-pointer hover:bg-red-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      <span className="inline">{children || text}</span>
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-amber-600"
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
    <div className="bg-gradient-to-r from-red-900 to-amber-700 rounded-2xl p-4 shadow-lg">
      <audio ref={audioRef} src={src} preload="auto" />

      <div className="flex items-center gap-3">
        <button
          onClick={togglePlayPause}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 text-red-900 hover:bg-amber-200 transition flex items-center justify-center shadow-md"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>

        <button
          onClick={resetAudio}
          className="flex-shrink-0 w-9 h-9 rounded-full bg-red-900/60 text-amber-100 hover:bg-red-900 transition flex items-center justify-center"
          title="Restart"
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
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-amber-100 mt-1">
            <span>{fmt(currentTime)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>
      </div>

      <div className="mt-2 h-1 bg-red-900/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 transition-all"
          style={{ width: `${progress}%` }}
        />
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

  const toggleVisibility = () => setShowEnglish((prev) => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);

  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-xl border border-red-300 shadow-sm">
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-red-800 font-semibold text-sm flex-1">
          {exercise.original}
        </p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-amber-100 transition-colors text-red-700 hover:text-red-900 flex-shrink-0"
          title={showEnglish ? "Hide English answer" : "Show English answer"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-amber-50 rounded-md border border-red-200">
          <SpeakSentence
            text={currentSentence}
            className="text-red-800 font-medium"
          >
            {currentSentence}
          </SpeakSentence>
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-amber-200 pt-1">
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
                ? "bg-gradient-to-r from-red-800 to-amber-700 text-white shadow"
                : "bg-amber-100 text-red-800 hover:bg-amber-200 border border-amber-300"
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
// DATA – LESSON 1
// ============================================
const VERBS = [
  { base: "to pick", past: "picked", participle: "picked", pt: "escolher, pegar" },
  { base: "to cover", past: "covered", participle: "covered", pt: "cobrir, reportar" },
  { base: "to convey", past: "conveyed", participle: "conveyed", pt: "transmitir, comunicar" },
];

const NEW_WORDS: VocabularyItem[] = [
  { word: "scoop", definition: "an exclusive news story" },
  { word: "stalker", definition: "someone who follows or harasses another person" },
  { word: "tabloid", definition: "a newspaper focused on sensational stories" },
  { word: "headline", definition: "the title of a news article" },
  { word: "testimonial", definition: "a statement recommending or praising someone or something" },
  { word: "glossy magazine", definition: "a high-quality magazine printed on shiny paper" },
  { word: "upsetting", definition: "making someone feel unhappy or worried" },
  { word: "astonishing", definition: "extremely surprising" },
  { word: "confidential", definition: "secret; not to be shared" },
  { word: "sensationalist", definition: "exaggerating facts to shock or excite people" },
];

const NATIVE_PHRASES = [
  {
    en: "From my point of view, this is just one part of the story.",
    pt: "Do meu ponto de vista, isso é apenas uma parte da história.",
    green: ["point", "view", "part", "story"],
  },
  {
    en: "This website is always the first one to bring the latest breaking news.",
    pt: "Este site é sempre o primeiro a trazer as últimas notícias de última hora.",
    green: ["website", "first", "latest", "breaking", "news"],
  },
  {
    en: "They have people waiting for possible news coverage.",
    pt: "Eles têm pessoas esperando por uma possível cobertura jornalística.",
    green: ["people", "waiting", "possible", "coverage"],
  },
];

const LANGUAGE_FUNCTIONS = [
  {
    direct: "Do you prefer tabloids or more serious news?",
    reported: "He asked me if I preferred tabloids or more serious news.",
  },
  {
    direct: "Is the information confidential or not?",
    reported: "They asked me whether the information was confidential or not.",
  },
  {
    direct: "What are the tabloids going to convey?",
    reported: "She wondered what the tabloids were going to convey.",
  },
  {
    direct: "Why do you read such sensationalist news?",
    reported: "She asked me why I read such sensationalist news.",
  },
  {
    direct: "Can you tell who the stalker is?",
    reported: "He wanted to know if I could tell who the stalker was.",
  },
];

const OPEN_DRILLS: SubstitutionExercise[] = [
  {
    key: "drill-1",
    original: "Reported question: story / headline / scoop",
    options: [
      {
        label: "story",
        replacement: "He asked whether the story was true or not.",
        pt: "Ele perguntou se a história era verdadeira ou não.",
      },
      {
        label: "headline",
        replacement: "He asked whether the headline was true or not.",
        pt: "Ele perguntou se a manchete era verdadeira ou não.",
      },
      {
        label: "scoop",
        replacement: "He asked whether the scoop was true or not.",
        pt: "Ele perguntou se o furo de reportagem era verdadeiro ou não.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-2",
    original: "Discussion question: sensationalist news",
    options: [
      {
        label: "💭 Practice",
        replacement: "What do you consider sensationalist news?",
        pt: "O que você considera notícia sensacionalista?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-3",
    original: "Reported question: news / information / testimonial",
    options: [
      {
        label: "news",
        replacement: "She didn't ask where I read the news.",
        pt: "Ela não perguntou onde eu li as notícias.",
      },
      {
        label: "information",
        replacement: "She didn't ask where I read the information.",
        pt: "Ela não perguntou onde eu li a informação.",
      },
      {
        label: "testimonial",
        replacement: "She didn't ask where I read the testimonial.",
        pt: "Ela não perguntou onde eu li o depoimento.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-4",
    original: "Discussion question: headlines today",
    options: [
      {
        label: "💭 Practice",
        replacement: "What headlines have you seen today?",
        pt: "Que manchetes você viu hoje?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-5",
    original: "Reported question: newspapers / magazines / websites",
    options: [
      {
        label: "newspapers",
        replacement: "He wanted to know if I read sensationalist newspapers.",
        pt: "Ele queria saber se eu leio jornais sensacionalistas.",
      },
      {
        label: "magazines",
        replacement: "He wanted to know if I read sensationalist magazines.",
        pt: "Ele queria saber se eu leio revistas sensacionalistas.",
      },
      {
        label: "websites",
        replacement: "He wanted to know if I read sensationalist websites.",
        pt: "Ele queria saber se eu leio sites sensacionalistas.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-6",
    original: "Discussion question: news coverage",
    options: [
      {
        label: "💭 Practice",
        replacement: "Why is news coverage worth having?",
        pt: "Por que a cobertura jornalística vale a pena?",
      },
    ],
    currentIndex: 0,
  },
];

const READING_TEXT = `Last week, a renowned actor was strolling through the bustling downtown district when he became aware that a man had been trailing him for several blocks. The man, later identified as a stalker, had been systematically harassing him and his family, and the situation was profoundly upsetting for all of them. The actor immediately contacted the authorities and requested police protection.

Meanwhile, an ambitious journalist from a tabloid caught wind of the incident. Determined to secure a scoop—an exclusive story that no rival publication had yet obtained—she envisioned an astonishing headline: "Celebrity Assaulted in Broad Daylight!" However, the details of the ongoing police investigation were strictly confidential, and she was explicitly forbidden from publishing them until further notice.

The situation was undeniably serious, yet the journalist was reluctant to resort to sensationalist reporting. From her point of view, the incident was merely one part of the story. She resolved to wait patiently and to convey the truth to her readers, ensuring that the narrative would be surrounded by verified facts rather than baseless rumors.

Approximately a week later, the actor agreed to provide a testimonial for a well-known glossy magazine. He wished to publicly acknowledge the police officers who had assisted him, and the magazine subsequently published a compelling article about urban safety. The tabloid journalist ultimately learned a valuable lesson: sometimes the most powerful story is the one that is simply true.`;

const KEY_WORDS: Record<string, string> = {
  stalker: "someone who follows or harasses another person",
  upsetting: "making someone feel unhappy or worried",
  tabloid: "a newspaper focused on sensational stories",
  scoop: "an exclusive news story",
  headline: "the title of a news article",
  astonishing: "extremely surprising",
  confidential: "secret; not to be shared",
  sensationalist: "exaggerating facts to shock or excite people",
  convey: "to communicate or express something",
  surround: "near or around a particular place",
  testimonial: "a statement recommending or praising someone or something",
  glossy: "printed on shiny, high-quality paper (glossy magazine)",
};

const TAKE_A_LOOK_WORDS: VocabularyItem[] = [
  { word: "surround", definition: "near or around a particular place" },
  { word: "scoop", definition: "an exclusive news story" },
  { word: "headline", definition: "the title of a news article" },
  { word: "coverage", definition: "the reporting of news events" },
  { word: "convey", definition: "to communicate or express something" },
  { word: "confidential", definition: "secret; not to be shared" },
];

const READING_QUESTIONS: ReadingQuestion[] = [
  { id: 1, question: "Who was following the famous actor?" },
  { id: 2, question: "Why was the situation upsetting for the actor and his family?" },
  { id: 3, question: "What did the journalist from the tabloid want to get?" },
  { id: 4, question: "Why couldn't the journalist publish the information about the investigation?" },
  { id: 5, question: "What did the journalist decide to do instead of writing sensationalist news?" },
  { id: 6, question: "What did the actor write for a glossy magazine, and why?" },
  { id: 7, question: "According to the text, what is sometimes 'the best story'?" },
];

// ============================================
// REAL LIFE – TEXT + TITLE
// ============================================
const REAL_LIFE_TITLE =
  "Tabloid Journalism and Its Negative Impact on Society";

const REAL_LIFE_TEXT = `While some people say that tabloid journalism is not gossip, bad news, or fake news, there is still clear evidence of its negative ramifications on society. Scandals provide entertainment, but is it worth the cost of someone's reputation or career? Tabloids are created for the typical middle-class person who does not have the same problems rich people do. However, it's no secret that they are usually negative. They typically consist of scandals, gossip, marriage, and upsetting divorce rumors, especially surrounding the celebrity world. Some headlines are extremely offensive and accuse people of things they may not have done. So, tabloids are not only meant to entertain. The purpose is to convey issues and not to solve problems in society. That's why they are seen as problematic by many people, since they are full of news that is not properly credited. While some people say that tabloid journalism can be a good thing, it refers to astonishing bad news or scandals. That's why, theoretically, there cannot be good tabloid journalism. Otherwise, it would not be called tabloid journalism.`;

// Real-life text key words (highlighted)
const REAL_LIFE_KEY_WORDS: Record<string, string> = {
  tabloid: "a newspaper focused on sensational stories",
  gossip: "casual talk about other people's private lives",
  scandals: "shocking events involving immoral or illegal behavior",
  reputation: "the opinion people have about someone",
  career: "a person's professional life or job path",
  upsetting: "making someone feel unhappy or worried",
  divorce: "the legal ending of a marriage",
  headlines: "the titles of news articles",
  offensive: "rude or insulting",
  convey: "to communicate or express something",
  astonishing: "extremely surprising",
  "ramifications": "the consequences or results of an action",
};

const REAL_LIFE_QUESTIONS: ReadingQuestion[] = [
  {
    id: 1,
    question:
      "According to the audio, what is the main problem with tabloid journalism for society?",
  },
  {
    id: 2,
    question: "Who are tabloids typically created for?",
  },
  {
    id: 3,
    question:
      "What kinds of topics usually appear in tabloids (name at least three)?",
  },
  {
    id: 4,
    question:
      "Why are some tabloid headlines considered extremely offensive?",
  },
  {
    id: 5,
    question:
      "What is the real purpose of tabloids, according to the audio?",
  },
  {
    id: 6,
    question: "Why are tabloids seen as problematic by many people?",
  },
  {
    id: 7,
    question:
      "According to the speaker, can there be 'good tabloid journalism'? Why or why not?",
  },
];

// ============================================
// HIGHLIGHTED READING COMPONENT
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
                  clean === kw + "ing" ||
                  clean === kw + "es"
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
                        ? "bg-red-700 text-white px-1 rounded"
                        : "text-red-600 hover:bg-red-100 rounded px-0.5"
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
    <section className="mb-8 border-2 border-red-300 bg-gradient-to-br from-red-50 via-amber-50 to-amber-100 rounded-3xl shadow-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-red-900 via-red-800 to-amber-700 text-amber-50 py-4 px-6 flex items-center justify-between"
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
export default function Lesson1NewsMedia() {
  const router = useRouter();
  const STORAGE_KEY = "lesson1_news_media_answers_v1";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    verbs: true,
    newWords: true,
    speakNative: true,
    functions: true,
    openDrills: true,
    reading: true,
    realLife: true,
  });

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [realLifeAnswers, setRealLifeAnswers] = useState<Record<number, string>>({});

  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeRealLifeWord, setActiveRealLifeWord] = useState<string | null>(null);

  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showVerbTranslation, setShowVerbTranslation] = useState(true);
  const [drillState, setDrillState] = useState<Record<string, number>>({});

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isRealLifeImageModalOpen, setIsRealLifeImageModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.answers) setAnswers(parsed.answers);
        if (parsed.realLifeAnswers) setRealLifeAnswers(parsed.realLifeAnswers);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      }
    } catch (err) {
      console.warn("Could not load saved answers:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  const persist = (
    nextAnswers: Record<number, string>,
    nextRealLifeAnswers: Record<number, string>
  ) => {
    try {
      const payload = {
        answers: nextAnswers,
        realLifeAnswers: nextRealLifeAnswers,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSaved(payload.lastSaved);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1500);
    } catch (err) {
      console.warn("Could not save answers:", err);
    }
  };

  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setSaveStatus("saving");
      persist(answers, realLifeAnswers);
    }, 900);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, realLifeAnswers]);

  const handleAnswerChange = (id: number, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleRealLifeChange = (id: number, value: string) =>
    setRealLifeAnswers((prev) => ({ ...prev, [id]: value }));

  const clearAll = () => {
    if (confirm("Are you sure you want to delete all your saved answers?")) {
      setAnswers({});
      setRealLifeAnswers({});
      localStorage.removeItem(STORAGE_KEY);
      setLastSaved(null);
      setSaveStatus("idle");
    }
  };

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleDrillSelect = (key: string, index: number) =>
    setDrillState((prev) => ({ ...prev, [key]: index }));

  const getDrillIndex = (key: string) => drillState[key] || 0;

  const btnPrimary =
    "px-5 py-2.5 rounded-full bg-gradient-to-r from-red-800 to-amber-700 text-white font-semibold hover:from-red-900 hover:to-amber-800 transition shadow";
  const btnSecondary =
    "px-5 py-2.5 rounded-full bg-amber-100 text-red-900 border border-amber-400 font-semibold hover:bg-amber-200 transition";
  const innerCard = "bg-white border border-amber-300 rounded-xl shadow-sm";

  return (
    <div
      className="min-h-screen py-8 md:py-16 px-4 md:px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(120, 20, 20, 0.55), rgba(120, 20, 20, 0.55)), url("${NEWS_BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-6 md:p-10 border-4 border-amber-500/40">
        {/* ===================== HERO IMAGE ===================== */}
        <div className="mb-10">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/60 group cursor-pointer"
            onClick={() => setIsHeroModalOpen(true)}
            title="Click to enlarge"
          >
            <img
              src={HERO_IMAGE}
              alt="Social Media Overload – Lesson 1 News & Media"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-900/20 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 1
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-amber-50 drop-shadow-lg">
                  📰 News & Media
                </h1>
                <p className="text-amber-100 text-sm md:text-base mt-2 max-w-2xl">
                  Social Media Overload · Tabloids, Headlines & Reported Speech
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-red-900/70 text-amber-100 text-xs px-3 py-1 rounded-full backdrop-blur">
              🔍 Click to enlarge
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-red-800 max-w-2xl mx-auto">
              <SpeakBtn text="Learn vocabulary about news, tabloids, and the media. Practice reported questions and reading comprehension.">
                Learn vocabulary about news, tabloids, and the media. Practice
                reported questions and reading comprehension.
              </SpeakBtn>
            </p>
          </div>
        </div>

        {/* SAVE STATUS BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-white/70 backdrop-blur border border-amber-300 rounded-2xl px-5 py-3 shadow">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <Save size={16} />
            {saveStatus === "saving" && <span>💾 Saving…</span>}
            {saveStatus === "saved" && (
              <span className="text-green-700 font-semibold">
                ✓ Saved automatically
              </span>
            )}
            {saveStatus === "idle" && (
              <span>
                {lastSaved
                  ? `Last saved: ${new Date(lastSaved).toLocaleString()}`
                  : "Answers are saved automatically in your browser."}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => persist(answers, realLifeAnswers)}
              className={btnPrimary}
            >
              <span className="inline-flex items-center gap-2">
                <Save size={16} /> Save now
              </span>
            </button>
            <button onClick={clearAll} className={btnSecondary}>
              <span className="inline-flex items-center gap-2">
                <Trash2 size={16} /> Clear all
              </span>
            </button>
          </div>
        </div>

        {/* ===================== 1. VERBS ===================== */}
        <Section
          title="VERBS"
          icon="🔹"
          open={openSections.verbs}
          onToggle={() => toggleSection("verbs")}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-red-700 italic">
              <SpeakBtn text="Click on each verb to hear the pronunciation.">
                🎧 Click on each verb to hear the pronunciation.
              </SpeakBtn>
            </p>
            <button
              onClick={() => setShowVerbTranslation(!showVerbTranslation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-red-800 border border-amber-400 text-sm font-semibold hover:bg-amber-200 transition"
              title={
                showVerbTranslation
                  ? "Hide Portuguese translations"
                  : "Show Portuguese translations"
              }
            >
              {showVerbTranslation ? (
                <>
                  <EyeOff size={14} /> Hide translations
                </>
              ) : (
                <>
                  <Eye size={14} /> Show translations
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VERBS.map((v) => (
              <div key={v.base} className={innerCard + " p-4"}>
                <SpeakBtn
                  text={`${v.base}, ${v.past}, ${v.participle}`}
                  className="text-lg font-bold text-red-800"
                >
                  {v.base}
                </SpeakBtn>
                <div className="text-sm text-gray-600 mt-2">
                  <div>
                    Past: <span className="font-semibold">{v.past}</span>
                  </div>
                  <div>
                    Participle:{" "}
                    <span className="font-semibold">{v.participle}</span>
                  </div>
                  {showVerbTranslation && (
                    <div className="mt-1 text-amber-800 italic">{v.pt}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 2. NEW WORDS ===================== */}
        <Section
          title="NEW WORDS"
          icon="🔹"
          open={openSections.newWords}
          onToggle={() => toggleSection("newWords")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Click on each word to hear its pronunciation. Definitions are in English.">
              🎧 Click on each word to hear its pronunciation. Definitions are in
              English.
            </SpeakBtn>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {NEW_WORDS.map((item) => (
              <div key={item.word} className={innerCard + " p-4"}>
                <SpeakBtn
                  text={item.word}
                  className="font-bold text-lg text-red-800"
                >
                  {item.word}
                </SpeakBtn>
                <p className="text-sm text-gray-700 mt-1">{item.definition}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 3. SPEAK LIKE A NATIVE ===================== */}
        <Section
          title="SPEAK LIKE A NATIVE"
          icon="🔹"
          open={openSections.speakNative}
          onToggle={() => toggleSection("speakNative")}
        >
          <div className="space-y-3">
            {NATIVE_PHRASES.map((p, i) => (
              <div key={i} className={innerCard + " p-4"}>
                <SpeakBtn
                  text={p.en}
                  className="text-base font-semibold text-gray-800"
                >
                  {p.en.split(/(\s+)/).map((tok, tIdx) => {
                    const clean = tok
                      .replace(/[^a-zA-Z']/g, "")
                      .toLowerCase();
                    if (p.green.includes(clean)) {
                      return (
                        <span key={tIdx} className="text-red-600 font-bold">
                          {tok}
                        </span>
                      );
                    }
                    return <span key={tIdx}>{tok}</span>;
                  })}
                </SpeakBtn>
                <p className="text-sm text-gray-600 mt-1 italic">🇧🇷 {p.pt}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 4. LANGUAGE FUNCTIONS ===================== */}
        <Section
          title="LANGUAGE FUNCTIONS"
          icon="🔹"
          open={openSections.functions}
          onToggle={() => toggleSection("functions")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Direct questions and their reported speech versions.">
              🎧 Direct questions → Reported speech.
            </SpeakBtn>
          </p>
          <div className="space-y-3">
            {LANGUAGE_FUNCTIONS.map((f, i) => (
              <div key={i} className={innerCard + " p-4"}>
                <div className="mb-2">
                  <span className="text-xs font-bold text-red-700 uppercase">
                    Direct
                  </span>
                  <div>
                    <SpeakBtn text={f.direct} className="text-gray-800">
                      {f.direct}
                    </SpeakBtn>
                  </div>
                </div>
                <div className="border-t border-dashed border-amber-300 pt-2">
                  <span className="text-xs font-bold text-amber-700 uppercase">
                    Reported
                  </span>
                  <div>
                    <SpeakBtn
                      text={f.reported}
                      className="text-red-800 font-semibold"
                    >
                      {f.reported}
                    </SpeakBtn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 5. OPEN DRILLS ===================== */}
        <Section
          title="OPEN DRILLS"
          icon="🔁"
          open={openSections.openDrills}
          onToggle={() => toggleSection("openDrills")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Choose an option to substitute the words. Click the eye icon to hide or show the English answer and its Portuguese translation.">
              🔄 Choose an option to substitute the words. Click the eye icon to
              hide or show the English answer and its Portuguese translation.
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

        {/* ===================== 6. READING TIME ===================== */}
        <Section
          title="READING TIME"
          icon="📖"
          open={openSections.reading}
          onToggle={() => toggleSection("reading")}
        >
          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="font-bold text-red-900 text-lg">
                📰 The Tabloid Story
              </h3>
              <SpeakBtn
                text={READING_TEXT}
                className="text-sm font-semibold text-red-800 border border-red-300 rounded-full px-3 py-1 hover:bg-red-100"
              >
                🔊 Listen to the text
              </SpeakBtn>
            </div>
            <ReadingText
              text={READING_TEXT}
              keyWords={KEY_WORDS}
              onWordClick={setActiveWord}
              activeWord={activeWord}
            />
            <p className="mt-4 text-xs text-gray-500 italic flex items-center gap-1">
              <Info size={12} /> Click on any{" "}
              <span className="text-red-600 font-bold">red word</span> to see its
              English definition.
            </p>

            {activeWord && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-800 to-amber-700 text-amber-50 shadow-lg animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-amber-200 mb-1">
                      Definition
                    </div>
                    <div className="text-xl font-bold mb-1">{activeWord}</div>
                    <div className="text-sm">{KEY_WORDS[activeWord]}</div>
                  </div>
                  <button
                    onClick={() => setActiveWord(null)}
                    className="text-amber-200 hover:text-white text-2xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-red-900 text-lg mb-1">
              🔍 TAKE A LOOK – Key Words
            </h4>
            <p className="text-sm text-red-800 mb-4 italic">
              Click each word to hear it. Definitions are in English.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TAKE_A_LOOK_WORDS.map((item) => (
                <div key={item.word} className={innerCard + " p-3"}>
                  <SpeakBtn
                    text={item.word}
                    className="font-bold text-red-800"
                  >
                    {item.word}
                  </SpeakBtn>
                  <p className="text-sm text-gray-700 mt-1">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6">
            <h3 className="font-bold text-red-900 text-lg mb-1">
              ✍️ Reading Comprehension
            </h3>
            <p className="text-sm text-red-700 mb-5 italic">
              Read the text and answer the questions below. Your answers are
              saved automatically.
            </p>

            <div className="space-y-5">
              {READING_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-red-50 border border-red-200"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-red-800 text-white text-sm font-bold flex items-center justify-center">
                      {q.id}
                    </span>
                    <SpeakBtn
                      text={q.question}
                      className="text-gray-900 font-medium"
                    >
                      {q.question}
                    </SpeakBtn>
                  </div>
                  <textarea
                    value={answers[q.id] || ""}
                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    placeholder="Write your answer here…"
                    className="w-full h-24 p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-800"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {answers[q.id]?.trim().split(/\s+/).filter(Boolean)
                        .length || 0}{" "}
                      words
                    </span>
                    <button
                      onClick={() => handleAnswerChange(q.id, "")}
                      className="text-xs px-2 py-1 rounded bg-amber-200 text-red-800 hover:bg-amber-300 transition"
                    >
                      <span className="inline-flex items-center gap-1">
                        <RotateCcw size={12} /> Clear
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => persist(answers, realLifeAnswers)}
                className={btnPrimary}
              >
                <span className="inline-flex items-center gap-2">
                  <Save size={16} /> Save answers now
                </span>
              </button>
            </div>
            {lastSaved && (
              <p className="text-xs text-right text-gray-500 mt-2">
                ✓ Answers stored locally at{" "}
                {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
        </Section>

        {/* ===================== 7. REAL LIFE ===================== */}
        <Section
          title="REAL LIFE"
          icon="🎧"
          open={openSections.realLife}
          onToggle={() => toggleSection("realLife")}
        >
          {/* Real Life card image */}
          <div className="mb-6">
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-red-400/60 group cursor-pointer"
              onClick={() => setIsRealLifeImageModalOpen(true)}
              title="Click to enlarge"
            >
              <img
                src={REAL_LIFE_IMAGE}
                alt="Real Life – Tabloid Journalism"
                className="w-full max-h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-transparent to-transparent flex items-end p-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-2 shadow">
                    🎧 REAL LIFE
                  </div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-amber-50 drop-shadow">
                    Tabloid Journalism — Good or Bad?
                  </h3>
                </div>
              </div>
              <div className="absolute top-3 right-3 bg-red-900/70 text-amber-100 text-xs px-3 py-1 rounded-full backdrop-blur">
                🔍 Click to enlarge
              </div>
            </div>
          </div>

          {/* ============ REAL LIFE TEXT (TITLE + TEXT) ============ */}
          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
              <h3 className="font-bold text-red-900 text-lg md:text-xl">
                📰 {REAL_LIFE_TITLE}
              </h3>
              <SpeakBtn
                text={`${REAL_LIFE_TITLE}. ${REAL_LIFE_TEXT}`}
                className="text-sm font-semibold text-red-800 border border-red-300 rounded-full px-3 py-1 hover:bg-red-100"
              >
                🔊 Listen to the text
              </SpeakBtn>
            </div>

            <div className="border-l-4 border-amber-500 pl-4 mb-4">
              <p className="text-sm text-gray-600 italic">
                Read the text below, or listen to the audio. Click any{" "}
                <span className="text-red-600 font-bold">red word</span> to see
                its English definition.
              </p>
            </div>

            <ReadingText
              text={REAL_LIFE_TEXT}
              keyWords={REAL_LIFE_KEY_WORDS}
              onWordClick={setActiveRealLifeWord}
              activeWord={activeRealLifeWord}
            />

            {activeRealLifeWord && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-red-800 to-amber-700 text-amber-50 shadow-lg animate-[fadeIn_0.2s_ease-out]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-amber-200 mb-1">
                      Definition
                    </div>
                    <div className="text-xl font-bold mb-1">
                      {activeRealLifeWord}
                    </div>
                    <div className="text-sm">
                      {REAL_LIFE_KEY_WORDS[activeRealLifeWord]}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveRealLifeWord(null)}
                    className="text-amber-200 hover:text-white text-2xl font-bold leading-none"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Instruction */}
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Listen to the audio about tabloid journalism. Then answer the questions below. Your answers are saved automatically.">
              🎧 Listen to the audio about tabloid journalism. Then answer the
              questions below. Your answers are saved automatically.
            </SpeakBtn>
          </p>

          {/* Audio Player */}
          <div className="mb-6">
            <AudioPlayer src={REAL_LIFE_AUDIO} />
          </div>

          {/* Questions */}
          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6">
            <h3 className="font-bold text-red-900 text-lg mb-1">
              ✍️ Real Life Comprehension
            </h3>
            <p className="text-sm text-red-700 mb-5 italic">
              Answer the questions based on what you heard in the audio.
            </p>

            <div className="space-y-5">
              {REAL_LIFE_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl bg-amber-50 border border-amber-300"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-700 text-white text-sm font-bold flex items-center justify-center">
                      {q.id}
                    </span>
                    <SpeakBtn
                      text={q.question}
                      className="text-gray-900 font-medium"
                    >
                      {q.question}
                    </SpeakBtn>
                  </div>
                  <textarea
                    value={realLifeAnswers[q.id] || ""}
                    onChange={(e) =>
                      handleRealLifeChange(q.id, e.target.value)
                    }
                    placeholder="Write your answer here…"
                    className="w-full h-24 p-3 rounded-lg border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-gray-800"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-500">
                      {realLifeAnswers[q.id]
                        ?.trim()
                        .split(/\s+/)
                        .filter(Boolean).length || 0}{" "}
                      words
                    </span>
                    <button
                      onClick={() => handleRealLifeChange(q.id, "")}
                      className="text-xs px-2 py-1 rounded bg-amber-200 text-red-800 hover:bg-amber-300 transition"
                    >
                      <span className="inline-flex items-center gap-1">
                        <RotateCcw size={12} /> Clear
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                onClick={() => persist(answers, realLifeAnswers)}
                className={btnPrimary}
              >
                <span className="inline-flex items-center gap-2">
                  <Save size={16} /> Save answers now
                </span>
              </button>
            </div>
            {lastSaved && (
              <p className="text-xs text-right text-gray-500 mt-2">
                ✓ Answers stored locally at{" "}
                {new Date(lastSaved).toLocaleString()}
              </p>
            )}
          </div>
        </Section>

        {/* NAVIGATION */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
          <button
            onClick={() => router.push("/cursos")}
            className="bg-red-900 hover:bg-red-950 text-amber-50 font-semibold py-3 px-8 rounded-full transition"
          >
            ← Back to Courses
          </button>
          <button
            onClick={() => router.push("/cursos/lesson2")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Next Lesson (2) →
          </button>
        </div>

        <footer className="text-center text-xs text-red-800/70 mt-10">
          <p>
            Lesson 1 – News & Media · Answers auto-saved in your browser
            localStorage.
          </p>
        </footer>
      </div>

      {/* ===== HERO IMAGE MODAL ===== */}
      {isHeroModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setIsHeroModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={HERO_IMAGE}
              alt="Social Media Overload – enlarged"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setIsHeroModalOpen(false)}
              className="absolute top-3 right-3 bg-red-900/80 hover:bg-red-800 text-amber-100 rounded-full p-2 transition"
              aria-label="Close"
            >
              <X size={22} />
            </button>
          </div>
        </div>
      )}

      {/* ===== REAL LIFE IMAGE MODAL ===== */}
      {isRealLifeImageModalOpen && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4"
          onClick={() => setIsRealLifeImageModalOpen(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={REAL_LIFE_IMAGE}
              alt="Real Life – Tabloid Journalism – enlarged"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setIsRealLifeImageModalOpen(false)}
              className="absolute top-3 right-3 bg-red-900/80 hover:bg-red-800 text-amber-100 rounded-full p-2 transition"
              aria-label="Close"
            >
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