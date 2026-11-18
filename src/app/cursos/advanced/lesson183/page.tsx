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
  Edit3,
  FileText,
  Minimize2,
  Maximize2,
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
  | "takeALook"
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
  readTense?: "present" | "past";
}

// ============================================
// IMAGES & AUDIO
// ============================================
const HERO_IMAGE =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Sobrecarga%20de%20Redes%20Sociais.png";

const NEWS_BACKGROUND =
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

// ✅ NOVA IMAGEM DO REAL LIFE
const REAL_LIFE_IMAGE =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Confian%C3%A7a%20Cega%2C%20Not%C3%ADcias%20Falsas.png";

const REAL_LIFE_AUDIO =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L183-reallife%20(online-audio-converter.com).mp3";

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
// READ PRONUNCIATION HELPER
// ============================================
const pronounceRead = (text: string, tense: "present" | "past") => {
  const replacement = tense === "present" ? "reed" : "red";
  return text.replace(/\bread\b/gi, (match) => {
    if (match === "Read")
      return replacement.charAt(0).toUpperCase() + replacement.slice(1);
    if (match === "READ") return replacement.toUpperCase();
    return replacement;
  });
};

// ============================================
// SPEAK BUTTON
// ============================================
const SpeakBtn = ({
  text,
  speech,
  children,
  className = "",
  rate = 0.9,
}: {
  text: string;
  speech?: string;
  children?: React.ReactNode;
  className?: string;
  rate?: number;
}) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      speakEnglish(speech || text, rate);
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
  speech,
  children,
  className = "",
}: {
  text: string;
  speech?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        const speechText =
          speech ||
          (children && typeof children === "string" ? children : text);
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
  const tense = exercise.readTense || "present";

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
            speech={pronounceRead(currentSentence, tense)}
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
              speakEnglish(
                pronounceRead(getOptionReplacement(option), tense),
                0.9
              );
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
// DATA – LESSON 183
// ============================================
const VERBS = [
  { base: "to insist", past: "insisted", participle: "insisted", pt: "insistir" },
  { base: "to suggest", past: "suggested", participle: "suggested", pt: "sugerir" },
  { base: "to recommend", past: "recommended", participle: "recommended", pt: "recomendar" },
];

const NEW_WORDS: VocabularyItem[] = [
  { word: "bias", definition: "prejudice in favor of or against one thing, person, or group" },
  { word: "source", definition: "a place, person, or thing from which something originates" },
  { word: "theory", definition: "a supposition or a system of ideas intended to explain something" },
  { word: "clickbait", definition: "content designed to attract attention and encourage visitors to click" },
  { word: "paparazzi", definition: "photographers who relentlessly pursue celebrities" },
  { word: "fake news", definition: "false stories presented as news to deceive people" },
  { word: "reputation", definition: "the beliefs or opinions generally held about someone or something" },
  { word: "misinformation", definition: "false or inaccurate information, especially intended to deceive" },
  { word: "credible", definition: "able to be believed; convincing" },
  { word: "outdated", definition: "no longer useful or valid because it is old-fashioned" },
];

const NATIVE_PHRASES = [
  {
    en: "I knew it was fake news through an anonymous source.",
    pt: "Eu soube que era fake news através de uma fonte anônima.",
    green: ["fake news", "anonymous source"],
  },
  {
    en: "If you want to avoid reading fake news, be a fact-checker.",
    pt: "Se você quer evitar ler fake news, seja um verificador de fatos.",
    green: ["avoid", "fake news", "fact-checker"],
  },
  {
    en: "Clickbait is eye-catching, but the news may not be good.",
    pt: "O clickbait é atraente, mas a notícia pode não ser boa.",
    green: ["Clickbait", "eye-catching", "good"],
  },
];

const LANGUAGE_FUNCTIONS = [
  {
    direct: "You should accept the invitation.",
    reported: "He said that I should accept the invitation.",
    directTense: "present" as const,
    reportedTense: "past" as const,
  },
  {
    direct: "The accidents are covered only by local media.",
    reported: "He didn't say that the accidents were covered by national media.",
    directTense: "present" as const,
    reportedTense: "past" as const,
  },
  {
    direct: "I always receive information from anonymous sources.",
    reported: "He told me he always received information from anonymous sources.",
    directTense: "present" as const,
    reportedTense: "past" as const,
  },
  {
    direct: "I would not share this information without checking the source first.",
    reported: "He told me he would not share that information without checking the source first.",
    directTense: "present" as const,
    reportedTense: "past" as const,
  },
  {
    direct: "I suggest that you write this report as soon as possible.",
    reported: "He suggested that I write this report as soon as possible.",
    directTense: "present" as const,
    reportedTense: "past" as const,
  },
];

const OPEN_DRILLS: SubstitutionExercise[] = [
  {
    key: "drill-1",
    original: "She said the paparazzi insisted on following her.",
    options: [
      {
        label: "taking pictures of her",
        replacement: "She said the paparazzi insisted on taking pictures of her.",
        pt: "Ela disse que os paparazzi insistiram em tirar fotos dela.",
      },
      {
        label: "interfering with her privacy",
        replacement: "She said the paparazzi insisted on interfering with her privacy.",
        pt: "Ela disse que os paparazzi insistiram em interferir na privacidade dela.",
      },
      {
        label: "harassing her family",
        replacement: "She said the paparazzi insisted on harassing her family.",
        pt: "Ela disse que os paparazzi insistiram em assediar a família dela.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-2",
    original: "Discussion question: eye-catching headlines",
    options: [
      {
        label: "💭 Practice",
        replacement: "To what extent does an eye-catching headline influence your decision to read an article, and do you think this borders on clickbait?",
        pt: "Até que ponto uma manchete atraente influencia sua decisão de ler um artigo, e você acha que isso beira o clickbait?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-3",
    original: "We recommend that you don't share fake news.",
    options: [
      {
        label: "outdated news",
        replacement: "We recommend that you don't share outdated news.",
        pt: "Nós recomendamos que você não compartilhe notícias desatualizadas.",
      },
      {
        label: "the source",
        replacement: "We recommend that you don't share the source.",
        pt: "Nós recomendamos que você não compartilhe a fonte.",
      },
      {
        label: "unverified information",
        replacement: "We recommend that you don't share unverified information.",
        pt: "Nós recomendamos que você não compartilhe informações não verificadas.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-4",
    original: "Discussion question: fact-checkers",
    options: [
      {
        label: "💭 Practice",
        replacement: "How crucial is the role of a fact-checker in modern journalism, and what skills must they possess to be truly effective?",
        pt: "Quão crucial é o papel de um verificador de fatos no jornalismo moderno, e quais habilidades eles devem possuir para serem realmente eficazes?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-5",
    original: "He didn't tell me if his boss had a bias against that story or not.",
    options: [
      {
        label: "report",
        replacement: "He didn't tell me if his boss had a bias against that report or not.",
        pt: "Ele não me disse se seu chefe tinha um viés contra aquele relatório ou não.",
      },
      {
        label: "theory",
        replacement: "He didn't tell me if his boss had a bias against that theory or not.",
        pt: "Ele não me disse se seu chefe tinha um viés contra aquela teoria ou não.",
      },
      {
        label: "investigation",
        replacement: "He didn't tell me if his boss had a bias against that investigation or not.",
        pt: "Ele não me disse se seu chefe tinha um viés contra aquela investigação ou não.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-6",
    original: "Discussion question: fake news",
    options: [
      {
        label: "💭 Practice",
        replacement: "In your opinion, is fake news a mere nuisance, or does it pose a severe threat to democratic societies? Why?",
        pt: "Na sua opinião, as fake news são apenas um incômodo ou representam uma ameaça severa às sociedades democráticas? Por quê?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-7",
    original: "The editor suggested that we verify the data before publishing.",
    options: [
      {
        label: "confirm the theory",
        replacement: "The editor suggested that we confirm the theory before publishing.",
        pt: "O editor sugeriu que confirmássemos a teoria antes de publicar.",
      },
      {
        label: "check the bias",
        replacement: "The editor suggested that we check the bias before publishing.",
        pt: "O editor sugeriu que verificássemos o viés antes de publicar.",
      },
      {
        label: "find a credible source",
        replacement: "The editor suggested that we find a credible source before publishing.",
        pt: "O editor sugeriu que encontrássemos uma fonte confiável antes de publicar.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-8",
    original: "Discussion question: misinformation",
    options: [
      {
        label: "💭 Practice",
        replacement: "Discuss the ethical responsibilities of social media platforms when it comes to spreading misinformation.",
        pt: "Discuta as responsabilidades éticas das plataformas de mídia social quando se trata de espalhar desinformação.",
      },
    ],
    currentIndex: 0,
  },
];

// ============================================
// TAKE A LOOK & CHECK IT OUT
// ============================================
const TAKE_A_LOOK_WORDS: VocabularyItem[] = [
  { word: "willingness", definition: "the state of being prepared to do something" },
  { word: "humble", definition: "not considering yourself or your ideas to be as important as other people's" },
];

const CHECK_IT_OUT_DRILLS: SubstitutionExercise[] = [
  {
    key: "check-1",
    original: "Is there a public scandal to cover today? (Reported)",
    options: [
      {
        label: "Reported Speech",
        replacement: "He asked if there was a public scandal to cover that day.",
        pt: "Ele perguntou se havia um escândalo público para cobrir naquele dia.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "check-2",
    original: "I suggested that she should write an article about bias yesterday. (Reported)",
    options: [
      {
        label: "Reported Speech",
        replacement: "Martha suggested that she should write an article about bias the day before.",
        pt: "Martha sugeriu que ela escrevesse um artigo sobre viés no dia anterior.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "check-3",
    original: "I insist that you cover the interview tonight. (Reported)",
    options: [
      {
        label: "Reported Speech",
        replacement: "She insisted that I covered the interview that night.",
        pt: "Ela insistiu que eu cobrisse a entrevista naquela noite.",
      },
    ],
    currentIndex: 0,
  },
];

// ============================================
// REAL LIFE – TEXT + TITLE
// ============================================
const REAL_LIFE_TITLE = "Overconfident of spotting fake news?";

const REAL_LIFE_TEXT = `If so, you may be more likely to fall victim. Are you certain you've never shared any fake news? People who are most confident about their ability to notice between fact and fiction are also the most likely to fall victim to misinformation, a U.S. survey suggests. Although Americans believe the confusion caused by false news exists everywhere, relatively few indicate having seen or shared something. The researchers insist that many may not only have a hard time identifying false or outdated news, but are not aware of their own bias in doing so. The data showed that those who were immodest were less able to distinguish between credible or invalid claims about current events and reported higher willingness to share false content, especially when it aligned with their political predispositions. The survey also recommends that those who are humble, people who tend to engage in self-monitoring, reflective behaviors, and put more thought into the sources of information and content they share, are likely to be less affected by clickbait, for example.`;

const REAL_LIFE_KEY_WORDS: Record<string, string> = {
  confident: "feeling or showing certainty about something",
  fiction: "invention or fabrication as opposed to fact",
  misinformation: "false or inaccurate information",
  outdated: "no longer useful or valid because it is old-fashioned",
  bias: "prejudice in favor of or against one thing",
  immodest: "lacking humility or decency; overconfident",
  credible: "able to be believed; convincing",
  invalid: "not legally or factually valid",
  willingness: "the state of being prepared to do something",
  predispositions: "inclinations to think or behave in a particular way",
  humble: "having or showing a modest or low estimate of one's own importance",
  clickbait: "content designed to attract attention",
};

const REAL_LIFE_QUESTIONS: ReadingQuestion[] = [
  {
    id: 1,
    question: "According to the survey, what is the paradox regarding people who are most confident in spotting fake news?",
  },
  {
    id: 2,
    question: "What did the data show about people who were 'immodest'?",
  },
  {
    id: 3,
    question: "How does political predisposition affect the sharing of false content?",
  },
  {
    id: 4,
    question: "What behaviors are recommended to avoid being affected by clickbait?",
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
// SECTION WRAPPER WITH NOTES
// ============================================
function Section({
  id,
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const savedNote = localStorage.getItem(`lesson183_note_${id}`);
    if (savedNote) setNote(savedNote);
  }, [id]);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem(`lesson183_note_${id}`, val);
  };

  return (
    <section className="mb-8 border-2 border-red-300 bg-gradient-to-br from-red-50 via-amber-50 to-amber-100 rounded-3xl shadow-lg overflow-hidden relative">
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-red-900 via-red-800 to-amber-700 text-amber-50 py-4 px-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsNoteOpen((prev) => !prev);
            }}
            className="ml-2 p-1.5 bg-amber-500/20 hover:bg-amber-500/40 rounded-full transition-colors"
            title="Toggle Personal Notes"
          >
            <Edit3 size={18} className="text-amber-100" />
          </button>
        </div>
        {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
      </button>

      {isNoteOpen && (
        <div className="bg-amber-100 border-b border-amber-300 p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2 mb-2 text-amber-900 font-semibold text-sm">
            <FileText size={16} /> My Personal Notes (Saved automatically)
          </div>
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Write your notes, questions, or summaries here..."
            className="w-full h-24 p-3 rounded-lg border border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-600 resize-y text-gray-800"
          />
        </div>
      )}

      {open && (
        <div className="p-5 md:p-7" style={{ animation: "fadeIn 0.25s ease-out" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ============================================
// FLOATING STICKY NOTEPAD
// ============================================
function FloatingNotepad() {
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("lesson183_floating_note");
    if (saved) setNote(saved);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem("lesson183_floating_note", val);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      {isOpen && (
        <div className="bg-amber-50 border-2 border-amber-400 rounded-xl shadow-2xl w-72 md:w-80 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-amber-500 text-red-950 px-3 py-2 rounded-t-lg flex items-center justify-between font-bold text-sm">
            <span className="flex items-center gap-1"><FileText size={14} /> Quick Sticky Note</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-red-900">
              <Minimize2 size={16} />
            </button>
          </div>
          <textarea
            value={note}
            onChange={handleChange}
            placeholder="Jot down a thought..."
            className="w-full h-48 p-3 rounded-b-lg bg-transparent focus:outline-none resize-none text-gray-800"
          />
        </div>
      )}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`p-4 rounded-full shadow-2xl transition-transform hover:scale-105 ${
          isOpen ? "bg-red-800 text-amber-100" : "bg-amber-500 text-red-950"
        }`}
        title="Floating Sticky Note"
      >
        {isOpen ? <Minimize2 size={24} /> : <Edit3 size={24} />}
      </button>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson183NewsMedia() {
  const router = useRouter();
  const STORAGE_KEY = "lesson183_news_media_answers_v1";

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    verbs: true,
    newWords: true,
    speakNative: true,
    functions: true,
    openDrills: true,
    takeALook: true,
    realLife: true,
  });

  const [realLifeAnswers, setRealLifeAnswers] = useState<Record<number, string>>({});
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeRealLifeWord, setActiveRealLifeWord] = useState<string | null>(null);

  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showVerbTranslation, setShowVerbTranslation] = useState(true);
  const [drillState, setDrillState] = useState<Record<string, number>>({});
  const [checkItOutState, setCheckItOutState] = useState<Record<string, number>>({});

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isRealLifeImageModalOpen, setIsRealLifeImageModalOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.realLifeAnswers) setRealLifeAnswers(parsed.realLifeAnswers);
        if (parsed.lastSaved) setLastSaved(parsed.lastSaved);
      }
    } catch (err) {
      console.warn("Could not load saved answers:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  const persist = (nextRealLifeAnswers: Record<number, string>) => {
    try {
      const payload = {
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
      persist(realLifeAnswers);
    }, 900);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [realLifeAnswers]);

  const handleRealLifeChange = (id: number, value: string) =>
    setRealLifeAnswers((prev) => ({ ...prev, [id]: value }));

  const clearAll = () => {
    if (confirm("Are you sure you want to delete all your saved answers?")) {
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

  const handleCheckItOutSelect = (key: string, index: number) =>
    setCheckItOutState((prev) => ({ ...prev, [key]: index }));

  const getDrillIndex = (key: string) => drillState[key] || 0;
  const getCheckItOutIndex = (key: string) => checkItOutState[key] || 0;

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
              alt="Social Media Overload – Lesson 183"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-900/20 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 183
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-amber-50 drop-shadow-lg">
                  📰 News & Media
                </h1>
                <p className="text-amber-100 text-sm md:text-base mt-2 max-w-2xl">
                  Fake News, Paparazzi & Reported Speech
                </p>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-red-900/70 text-amber-100 text-xs px-3 py-1 rounded-full backdrop-blur">
              🔍 Click to enlarge
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-red-800 max-w-2xl mx-auto">
              <SpeakBtn text="Learn vocabulary about fake news, biases, and the media. Practice reported questions and reading comprehension.">
                Learn vocabulary about fake news, biases, and the media. Practice
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
              onClick={() => persist(realLifeAnswers)}
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
          id="verbs"
          title="VERBS"
          icon="🔹"
          open={openSections.verbs}
          onToggle={() => toggleSection("verbs")}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <p className="text-red-700 italic">
              <SpeakBtn text="Click on each verb, past form, or participle to hear the pronunciation.">
                🎧 Click on each verb, past form, or participle to hear the
                pronunciation.
              </SpeakBtn>
            </p>
            <button
              onClick={() => setShowVerbTranslation(!showVerbTranslation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-red-800 border border-amber-400 text-sm font-semibold hover:bg-amber-200 transition"
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
                <div className="text-sm text-gray-600 mt-2 space-y-0.5">
                  <div>
                    Past:{" "}
                    <SpeakBtn
                      text={v.past}
                      className="font-semibold text-red-700"
                    >
                      {v.past}
                    </SpeakBtn>
                  </div>
                  <div>
                    Participle:{" "}
                    <SpeakBtn
                      text={v.participle}
                      className="font-semibold text-red-700"
                    >
                      {v.participle}
                    </SpeakBtn>
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
          id="newWords"
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

        {/* ===================== 3. USEFUL PHRASES ===================== */}
        <Section
          id="speakNative"
          title="USEFUL PHRASES"
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
          id="functions"
          title="LANGUAGE FUNCTIONS"
          icon="🔹"
          open={openSections.functions}
          onToggle={() => toggleSection("functions")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Direct sentences and their reported speech versions.">
              🎧 Direct sentences → Reported speech.
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
                    <SpeakBtn
                      text={f.direct}
                      speech={pronounceRead(f.direct, f.directTense)}
                      className="text-gray-800"
                    >
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
                      speech={pronounceRead(f.reported, f.reportedTense)}
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
          id="openDrills"
          title="OPEN DRILLS (Advanced)"
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

        {/* ===================== 6. TAKE A LOOK & CHECK IT OUT ===================== */}
        <Section
          id="takeALook"
          title="TAKE A LOOK & CHECK IT OUT"
          icon="📖"
          open={openSections.takeALook}
          onToggle={() => toggleSection("takeALook")}
        >
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
            <h3 className="font-bold text-red-900 text-lg mb-4">
              ✅ CHECK IT OUT – Reported Speech
            </h3>
            <div className="space-y-4">
              {CHECK_IT_OUT_DRILLS.map((ex) => (
                <SubstitutionOptions
                  key={ex.key}
                  exercise={{ ...ex, currentIndex: getCheckItOutIndex(ex.key) }}
                  onOptionClick={handleCheckItOutSelect}
                />
              ))}
            </div>
          </div>
        </Section>

        {/* ===================== 7. REAL LIFE ===================== */}
        <Section
          id="realLife"
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
                alt="Real Life – Fake News"
                className="w-full max-h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-transparent to-transparent flex items-end p-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-2 shadow">
                    🎧 REAL LIFE
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-amber-50 drop-shadow">
                    Spotting Fake News
                  </h3>
                </div>
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
            <SpeakBtn text="Listen to the audio about spotting fake news. Then answer the questions below. Your answers are saved automatically.">
              🎧 Listen to the audio about spotting fake news. Then answer the
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
              Answer the questions based on what you heard in the audio and read in the text.
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
                onClick={() => persist(realLifeAnswers)}
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
            onClick={() => router.push("/cursos/advanced/lesson184")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition"
          >
            Next Lesson (184) →
          </button>
        </div>

        <footer className="text-center text-xs text-red-800/70 mt-10">
          <p>
            Lesson 183 – News & Media · Answers auto-saved in your browser
            localStorage.
          </p>
        </footer>
      </div>

      {/* ===== FLOATING STICKY NOTEPAD ===== */}
      <FloatingNotepad />

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
              alt="Real Life – Fake News – enlarged"
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