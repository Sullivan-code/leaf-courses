"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  X,
} from "lucide-react";

// ============================================
// TYPES
// ============================================
type SectionKey =
  | "verbs"
  | "newWords"
  | "usefulPhrases"
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
}

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// IMAGES (Placeholders since the exact 185 images were not provided)
// ============================================
const HERO_IMAGE =
  "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

const BACKGROUND =
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

const REAL_LIFE_IMAGE =
  "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

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
}) => (
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

// ============================================
// PENCIL ICON (Lesson 63 Style)
// ============================================
function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-amber-200 hover:text-white transition-colors focus:outline-none"
      aria-label="Make notes"
      title="Click to make notes"
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
// NOTE MODAL (Lesson 63 Style)
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

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(note);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70]"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Notes – {sectionTitle}</h3>
          <p className="text-sm text-amber-100 mt-1">
            Write your observations, questions, or translations.
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full h-64 p-4 border border-amber-300 rounded-xl focus:border-red-700 focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none text-gray-800"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-red-800 hover:text-red-900 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-red-800 to-amber-700 text-white rounded-full hover:from-red-900 hover:to-amber-800 transition-all duration-300 font-semibold"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

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
    <div className="bg-white p-4 rounded-xl border border-amber-300 shadow-sm">
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
// SECTION WRAPPER WITH PENCIL
// ============================================
function Section({
  id,
  title,
  icon,
  open,
  onToggle,
  onOpenNote,
  children,
}: {
  id: string;
  title: string;
  icon: string;
  open: boolean;
  onToggle: () => void;
  onOpenNote: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 border-2 border-amber-300 bg-gradient-to-br from-red-50 via-amber-50 to-amber-100 rounded-3xl shadow-lg overflow-hidden">
      <div className="w-full bg-gradient-to-r from-red-800 via-red-700 to-amber-700 text-amber-50 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span>{icon}</span>
            <h2 className="text-xl md:text-2xl font-bold text-left">{title}</h2>
          </button>
          <PencilIcon onClick={onOpenNote} />
        </div>
        <button onClick={onToggle} className="hover:opacity-80 transition-opacity">
          {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
        </button>
      </div>

      {open && (
        <div className="p-5 md:p-7" style={{ animation: "fadeIn 0.25s ease-out" }}>
          {children}
        </div>
      )}
    </section>
  );
}

// ============================================
// READING TEXT (clickable key words)
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
// DATA – EXACTLY FROM THE IMAGES (LESSON 185)
// ============================================
const VERBS = [
  { base: "to seek", past: "sought", participle: "sought", pt: "procurar, buscar" },
  { base: "to warn", past: "warned", participle: "warned", pt: "avisar, alertar" },
  { base: "to convince", past: "convinced", participle: "convinced", pt: "convencer" },
];

const NEW_WORDS: VocabularyItem[] = [
  { word: "content", definition: "material or information available online or in media" },
  { word: "eyewitness", definition: "a person who saw an event happen" },
  { word: "subscribers", definition: "people who pay or sign up to receive a service or content" },
  { word: "mainstream", definition: "considered normal or conventional" },
  { word: "sensationalism", definition: "presenting stories in an exciting or shocking way" },
  { word: "real-time newsfeed", definition: "a constantly updating stream of news as it happens" },
  { word: "awful", definition: "very bad or unpleasant" },
  { word: "engaging", definition: "charming and attractive; interesting" },
  { word: "successful", definition: "accomplishing a desired aim or purpose" },
];

const USEFUL_PHRASES = [
  {
    en: "She should read the latest news to keep up with the changes.",
    pt: "Ela deveria ler as últimas notícias para se manter atualizada com as mudanças.",
    green: ["keep up with"],
  },
  {
    en: "The teacher told us to filter out everything we read.",
    pt: "O professor nos disse para filtrar tudo o que lemos.",
    green: ["filter out"],
  },
  {
    en: "Any creative content can go viral.",
    pt: "Qualquer conteúdo criativo pode viralizar.",
    green: ["go viral"],
  },
];

const LANGUAGE_FUNCTIONS = [
  { direct: "I'll seek more digital influencers for content.", reported: "He said that he would seek more digital influencers for content." },
  { direct: "I'm sure this content won't go viral.", reported: "She said she was sure that content wouldn't go viral." },
  { direct: "I'll try to convince him it's an awful idea.", reported: "She said she would try to convince him it was an awful idea." },
  { direct: "Will this post attract more subscribers?", reported: "He asked if that post would attract more subscribers." },
  { direct: "She is the first eyewitness to talk about the riot.", reported: "(No reported version provided in image)" },
  { direct: "He was the first person to warn of the dangers of fake news.", reported: "(No reported version provided in image)" },
  { direct: "The manager was the last to arrive.", reported: "(No reported version provided in image)" },
];

const TAKE_A_LOOK_WORDS: VocabularyItem[] = [
  { word: "foreseeable", definition: "for as long as it is possible to know what is likely to happen" },
  { word: "outstrip", definition: "to move faster than someone or something else" },
  { word: "willingness", definition: "the state of being prepared to do something" },
];

const CHECK_IT_OUT_DRILLS: SubstitutionExercise[] = [
  {
    key: "check-1",
    original: "I'll talk to the eyewitness next week.",
    options: [
      {
        label: "Reported Speech",
        replacement: "He said he would talk to the eyewitness the following week.",
        pt: "Ele disse que falaria com a testemunha ocular na semana seguinte.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "check-2",
    original: "We'll be able to change the content tomorrow.",
    options: [
      {
        label: "Reported Speech",
        replacement: "They said they would be able to change the content the next day.",
        pt: "Eles disseram que seriam capazes de mudar o conteúdo no dia seguinte.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "check-3",
    original: "Most businesses will be online shortly.",
    options: [
      {
        label: "Reported Speech",
        replacement: "They said most businesses would be online shortly.",
        pt: "Eles disseram que a maioria das empresas estaria online em breve.",
      },
    ],
    currentIndex: 0,
  },
];

// ============================================
// OPEN DRILLS (B2/C1) - Based on the lesson's theme
// ============================================
const OPEN_DRILLS: SubstitutionExercise[] = [
  {
    key: "drill-1",
    original: "The teacher told us to filter out everything we read.",
    options: [
      {
        label: "verify everything",
        replacement: "The teacher told us to verify everything we read.",
        pt: "O professor nos disse para verificar tudo o que lemos.",
      },
      {
        label: "question everything",
        replacement: "The teacher told us to question everything we read.",
        pt: "O professor nos disse para questionar tudo o que lemos.",
      },
      {
        label: "fact-check everything",
        replacement: "The teacher told us to fact-check everything we read.",
        pt: "O professor nos disse para checar os fatos de tudo o que lemos.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-2",
    original: "Discussion: Mainstream media vs. Sensationalism",
    options: [
      {
        label: "💭 Practice",
        replacement: "To what extent has sensationalism outrun the credibility of mainstream media in recent years?",
        pt: "Até que ponto o sensacionalismo superou a credibilidade da mídia mainstream nos últimos anos?",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-3",
    original: "Any creative content can go viral.",
    options: [
      {
        label: "engaging",
        replacement: "Any engaging content can go viral.",
        pt: "Qualquer conteúdo envolvente pode viralizar.",
      },
      {
        label: "controversial",
        replacement: "Any controversial content can go viral.",
        pt: "Qualquer conteúdo controverso pode viralizar.",
      },
      {
        label: "shocking",
        replacement: "Any shocking content can go viral.",
        pt: "Qualquer conteúdo chocante pode viralizar.",
      },
    ],
    currentIndex: 0,
  },
  {
    key: "drill-4",
    original: "Discussion: The future of truth",
    options: [
      {
        label: "💭 Practice",
        replacement: "In an era of real-time newsfeeds, what skills do we need to develop to ensure we aren't fooled by fake news?",
        pt: "Em uma era de feeds de notícias em tempo real, quais habilidades precisamos desenvolver para garantir que não sejamos enganados por fake news?",
      },
    ],
    currentIndex: 0,
  },
];

// ============================================
// REAL LIFE
// ============================================
const REAL_LIFE_TITLE = "THE FUTURE OF TRUTH AND MISINFORMATION ONLINE";

const REAL_LIFE_TEXT = `In today's digital age, the future of truth and misinformation online is highly uncertain. Mainstream media often struggles to compete with the sensationalism of viral content. As we scroll through our real-time newsfeed, it is crucial to filter out fake news. An eyewitness might report one thing, but without proper verification, an engaging story can quickly become an awful rumor. We must be prepared to seek credible sources and warn others about the dangers of misinformation, for as long as it is foreseeable.`;

const REAL_LIFE_KEY_WORDS: Record<string, string> = {
  misinformation: "false or inaccurate information, especially that which is deliberately intended to deceive",
  mainstream: "considered normal or conventional; the dominant trend",
  sensationalism: "presenting stories in an exciting or shocking way",
  "real-time newsfeed": "a constantly updating stream of news as it happens",
  "filter out": "to remove unwanted things",
  eyewitness: "a person who saw an event happen",
  engaging: "charming and attractive; interesting",
  awful: "very bad or unpleasant",
  seek: "to attempt to find something",
  warn: "to inform someone of a possible danger",
  foreseeable: "for as long as it is possible to know what is likely to happen",
};

const REAL_LIFE_COMPREHENSION: ReadingQuestion[] = [
  {
    id: 1,
    question: "How does mainstream media struggle against sensationalism?",
  },
  {
    id: 2,
    question: "Why is it important to filter out fake news from our real-time newsfeed?",
  },
  {
    id: 3,
    question: "What can happen to an engaging story if it is not verified by an eyewitness?",
  },
];

const REAL_LIFE_OPEN: ReadingQuestion[] = [
  {
    id: 1,
    question: "Do you think mainstream media is losing the battle against independent creators and influencers? Why?",
  },
  {
    id: 2,
    question: "What are the long-term consequences of sensationalism in digital journalism?",
  },
  {
    id: 3,
    question: "How do you personally balance staying informed on a real-time newsfeed without falling for misinformation?",
  },
];

// ============================================
// MAIN COMPONENT – LESSON 185
// ============================================
export default function Lesson185NewsMedia() {
  const router = useRouter();

  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    verbs: true,
    newWords: true,
    usefulPhrases: true,
    functions: true,
    openDrills: true,
    takeALook: true,
    realLife: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [showVerbTranslation, setShowVerbTranslation] = useState(true);
  const [drillState, setDrillState] = useState<Record<string, number>>({});
  const [checkItOutState, setCheckItOutState] = useState<Record<string, number>>({});

  const [realLifeAnswers, setRealLifeAnswers] = useState<Record<number, string>>({});
  const [activeRealLifeWord, setActiveRealLifeWord] = useState<string | null>(null);

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isRealLifeImageModalOpen, setIsRealLifeImageModalOpen] = useState(false);

  // ---- Load persisted data ----
  useEffect(() => {
    try {
      const saved = localStorage.getItem("lesson185_notes");
      if (saved) setSavedNotes(JSON.parse(saved));

      const savedAnswers = localStorage.getItem("lesson185_real_life_answers");
      if (savedAnswers) setRealLifeAnswers(JSON.parse(savedAnswers));
    } catch (err) {
      console.warn("Could not load saved data:", err);
    }
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  // ---- Persist notes ----
  useEffect(() => {
    try {
      localStorage.setItem("lesson185_notes", JSON.stringify(savedNotes));
    } catch (err) {
      console.warn("Could not save notes:", err);
    }
  }, [savedNotes]);

  // ---- Persist real life answers ----
  useEffect(() => {
    try {
      localStorage.setItem("lesson185_real_life_answers", JSON.stringify(realLifeAnswers));
    } catch (err) {
      console.warn("Could not save answers:", err);
    }
  }, [realLifeAnswers]);

  const toggleSection = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

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

  const handleDrillSelect = (key: string, index: number) =>
    setDrillState((prev) => ({ ...prev, [key]: index }));

  const handleCheckItOutSelect = (key: string, index: number) =>
    setCheckItOutState((prev) => ({ ...prev, [key]: index }));

  const getDrillIndex = (key: string) => drillState[key] || 0;
  const getCheckItOutIndex = (key: string) => checkItOutState[key] || 0;

  const handleRealLifeChange = (id: number, value: string) =>
    setRealLifeAnswers((prev) => ({ ...prev, [id]: value }));

  const innerCard = "bg-white border border-amber-300 rounded-xl shadow-sm";

  return (
    <div
      className="min-h-screen py-8 md:py-16 px-4 md:px-6"
      style={{
        backgroundImage: `linear-gradient(rgba(120, 20, 20, 0.55), rgba(120, 20, 20, 0.55)), url("${BACKGROUND}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-6 md:p-10 border-4 border-amber-500/40">
        {/* ===================== HERO ===================== */}
        <div className="mb-10">
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-600/60 group cursor-pointer"
            onClick={() => setIsHeroModalOpen(true)}
            title="Click to enlarge"
          >
            <img
              src={HERO_IMAGE}
              alt="News & Media – Lesson 185"
              className="w-full max-h-[480px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 via-red-900/20 to-transparent flex items-end p-6 md:p-8">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-3 shadow">
                  LESSON 185
                </div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-amber-50 drop-shadow-lg">
                  📰 News, Truth & Misinformation
                </h1>
                <p className="text-amber-100 text-sm md:text-base mt-2 max-w-2xl">
                  Reported Speech, Digital Influencers & The Future of Truth
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-red-800 max-w-2xl mx-auto">
              <SpeakBtn text="Explore the language of news and misinformation. Practice reported speech, new vocabulary, and critical thinking.">
                Explore the language of news and misinformation. Practice reported speech, new vocabulary, and critical thinking.
              </SpeakBtn>
            </p>
          </div>
        </div>

        {/* ===================== 1. VERBS ===================== */}
        <Section
          id="verbs"
          title="VERBS"
          icon="🔹"
          open={openSections.verbs}
          onToggle={() => toggleSection("verbs")}
          onOpenNote={() => openNoteModal("Verbs")}
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
                    <SpeakBtn text={v.past} className="font-semibold text-red-700">
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
          onOpenNote={() => openNoteModal("New Words")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Click on each word to hear its pronunciation.">
              🎧 Click on each word to hear its pronunciation.
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
          id="usefulPhrases"
          title="USEFUL PHRASES"
          icon="🔹"
          open={openSections.usefulPhrases}
          onToggle={() => toggleSection("usefulPhrases")}
          onOpenNote={() => openNoteModal("Useful Phrases")}
        >
          <div className="space-y-3">
            {USEFUL_PHRASES.map((p, i) => (
              <div key={i} className={innerCard + " p-4"}>
                <SpeakBtn
                  text={p.en}
                  className="text-base font-semibold text-gray-800"
                >
                  {p.en.split(/(\s+)/).map((tok, tIdx) => {
                    const clean = tok.replace(/[^a-zA-Z']/g, "").toLowerCase();
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
          onOpenNote={() => openNoteModal("Language Functions")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Direct sentences and their reported speech versions.">
              🎧 Direct sentences and their reported speech versions.
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
                {f.reported !== "(No reported version provided in image)" && (
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
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===================== 5. OPEN DRILLS ===================== */}
        <Section
          id="openDrills"
          title="OPEN DRILLS (B2 / C1)"
          icon="🔁"
          open={openSections.openDrills}
          onToggle={() => toggleSection("openDrills")}
          onOpenNote={() => openNoteModal("Open Drills")}
        >
          <p className="text-red-700 italic mb-4">
            <SpeakBtn text="Choose an option to substitute the words. Discussion prompts are open-ended — speak freely.">
              🔄 Substitute words and answer the discussion prompts.
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
          onOpenNote={() => openNoteModal("Take a Look & Check it Out")}
        >
          <div className="bg-amber-100 border-2 border-amber-400 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-red-900 text-lg mb-1">
              🔍 TAKE A LOOK
            </h4>
            <p className="text-sm text-red-800 mb-4 italic">
              Click each word to hear it.
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
              ✅ CHECK IT OUT
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
          onOpenNote={() => openNoteModal("Real Life")}
        >
          {/* Real life image */}
          <div className="mb-6">
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-red-400/60 group cursor-pointer"
              onClick={() => setIsRealLifeImageModalOpen(true)}
              title="Click to enlarge"
            >
              <img
                src={REAL_LIFE_IMAGE}
                alt="Real Life – Misinformation"
                className="w-full max-h-[340px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/75 via-transparent to-transparent flex items-end p-4">
                <div>
                  <div className="inline-block px-3 py-1 rounded-full bg-amber-500 text-red-950 text-xs font-extrabold tracking-wider mb-2 shadow">
                    🎧 REAL LIFE
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-amber-50 drop-shadow">
                    {REAL_LIFE_TITLE}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
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
                Read the text below or listen to it. Click any{" "}
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
                    <p className="text-sm text-amber-100">
                      {REAL_LIFE_KEY_WORDS[activeRealLifeWord]}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveRealLifeWord(null)}
                    className="text-amber-200 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reading comprehension */}
          <div className="bg-white rounded-2xl border border-amber-300 shadow-sm p-6 mb-6">
            <h4 className="font-bold text-red-900 text-lg mb-3">
              📝 READING COMPREHENSION
            </h4>
            <div className="space-y-3">
              {REAL_LIFE_COMPREHENSION.map((q) => (
                <div key={q.id} className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <p className="text-red-800 font-semibold text-sm mb-2">
                    {q.id}. {q.question}
                  </p>
                  <textarea
                    value={realLifeAnswers[q.id] || ""}
                    onChange={(e) => handleRealLifeChange(q.id, e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full h-20 p-2 text-sm rounded-md border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y text-gray-800"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Open-ended questions */}
          <div className="bg-gradient-to-br from-red-800 to-amber-700 rounded-2xl p-6 shadow-lg text-amber-50">
            <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
              💬 OPEN-ENDED DISCUSSION (B2 / C1)
            </h4>
            <div className="space-y-3">
              {REAL_LIFE_OPEN.map((q) => (
                <div key={q.id} className="bg-white/10 backdrop-blur rounded-lg p-3 border border-amber-300/40">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-amber-300 font-bold">Q{q.id}.</span>
                    <p className="text-sm font-medium flex-1">{q.question}</p>
                    <SpeakBtn
                      text={q.question}
                      className="text-amber-200"
                    >
                      {""}
                    </SpeakBtn>
                  </div>
                  <textarea
                    value={realLifeAnswers[100 + q.id] || ""}
                    onChange={(e) =>
                      handleRealLifeChange(100 + q.id, e.target.value)
                    }
                    placeholder="Type your thoughts here..."
                    className="w-full h-20 p-2 text-sm rounded-md bg-white/90 text-gray-800 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/intermediate/lesson184")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (184)
          </button>
          <button
            onClick={() => router.push("/cursos/intermediate/lesson186")}
            className="bg-gradient-to-r from-red-800 to-amber-700 hover:from-red-900 hover:to-amber-800 text-white font-semibold py-3 px-8 rounded-full transition-all"
          >
            Next Lesson (186) &rarr;
          </button>
        </div>
      </div>

      {/* ===================== FLOATING NOTE BUTTON ===================== */}
      <button
        onClick={() => openNoteModal("General Notes")}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-red-800 to-amber-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-red-900 hover:to-amber-800 transition-all duration-300 z-50 flex items-center justify-center"
        title="Make general notes"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 animate-[spin-slow_4s_linear_infinite]"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      {/* ===================== IMAGE MODALS ===================== */}
      {isHeroModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsHeroModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={HERO_IMAGE}
              alt="Hero – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsHeroModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isRealLifeImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsRealLifeImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={REAL_LIFE_IMAGE}
              alt="Real Life – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsRealLifeImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===================== NOTE MODAL ===================== */}
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
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}