"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  MessageCircle,
  Heart,
  Users,
  Briefcase,
  Plane,
  Globe,
  Utensils,
  Car,
  Star,
  Sun,
  Pencil,
  ChevronDown,
  ChevronUp,
  Compass,
  Sparkles,
  Anchor,
  Target,
  Scale,
  Flame,
  Crown,
  X,
  Check,
  Zap,
  Laugh,
  Smartphone,
  Dumbbell,
  Coffee,
  Music,
  ThumbsUp,
  AlertTriangle,
  Rocket,
  BookOpen,
  Handshake,
  PartyPopper,
} from "lucide-react";

// ============================================
// SPEECH SYSTEM – AMERICAN FEMALE VOICE
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

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => (
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

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => (
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

// ============================================
// NOTE MODAL (section notes)
// ============================================
interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

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
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Notes - {sectionTitle}</h3>
          <p className="text-sm text-orange-100 mt-1">
            Write your doubts, translations, or extra examples
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANSWER MODAL (per-expression / per-question)
// ============================================
interface AnswerModalState {
  isOpen: boolean;
  promptEn: string;
  promptPt: string;
  promptKey: string;
  sectionTitle: string;
  mode: "expression" | "question";
}

function AnswerModal({
  state,
  initialAnswer,
  onSave,
  onClose,
}: {
  state: AnswerModalState;
  initialAnswer: string;
  onSave: (answer: string) => void;
  onClose: () => void;
}) {
  const [answer, setAnswer] = useState(initialAnswer);

  useEffect(() => {
    setAnswer(initialAnswer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.promptKey, state.isOpen]);

  if (!state.isOpen) return null;
  const handleSave = () => {
    onSave(answer);
    onClose();
  };

  const isExpression = state.mode === "expression";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Pencil size={18} />
            {isExpression ? "Write your own example" : "Write your answer"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
            <p className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mb-1">
              📌 {state.sectionTitle}
            </p>
            <SpeakSentence
              text={state.promptEn}
              className="text-gray-800 font-semibold text-base"
            >
              {state.promptEn}
            </SpeakSentence>
            <p className="text-sm text-gray-500 mt-1 italic">🇧🇷 {state.promptPt}</p>
          </div>

          <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
            {isExpression
              ? "✍️ Write a sentence using this expression"
              : "✍️ Your answer in English"}
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder={
              isExpression
                ? "Type your own example here... / Escreva seu próprio exemplo aqui..."
                : "Type your answer here... / Escreva sua resposta aqui..."
            }
            className="w-full h-44 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none text-gray-800 text-base leading-relaxed"
            autoFocus
          />

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={onClose}
              className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-full transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-semibold transition-all shadow-md flex items-center gap-2"
            >
              <Check size={16} />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-white/60 hover:text-white transition-colors focus:outline-none"
      aria-label="Take notes"
      title="Click to take notes"
    >
      <Pencil className="h-5 w-5" />
    </button>
  );
}

// ============================================
// EXPRESSION CARD
// ============================================
interface Expression {
  en: string;
  pt: string;
  level: string;
  example: string;
  examplePt: string;
}

function ExpressionCard({
  expression,
  index,
  sectionKey,
  sectionTitle,
  answer,
  onOpenAnswer,
}: {
  expression: Expression;
  index: number;
  sectionKey: string;
  sectionTitle: string;
  answer?: string;
  onOpenAnswer: (
    expression: Expression,
    promptKey: string,
    sectionTitle: string
  ) => void;
}) {
  const [showExample, setShowExample] = useState(false);
  const promptKey = `${sectionKey}-${index}`;

  const levelColor = (level: string) => {
    if (level.includes("A2")) return "bg-green-100 text-green-700";
    if (level.includes("B1")) return "bg-blue-100 text-blue-700";
    if (level.includes("B2")) return "bg-purple-100 text-purple-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="bg-white rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
          {index}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 flex-wrap">
            <div className="flex-1 min-w-0">
              <SpeakSentence
                text={expression.en}
                className="text-gray-800 font-bold text-base md:text-lg leading-relaxed"
              >
                {expression.en}
              </SpeakSentence>
            </div>
            <span
              className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${levelColor(
                expression.level
              )}`}
            >
              {expression.level}
            </span>
            <button
              onClick={() =>
                onOpenAnswer(expression, promptKey, sectionTitle)
              }
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-orange-100 text-orange-500 hover:text-orange-700 transition-colors border border-orange-200"
              title="Write your own example"
              aria-label="Write your own example"
            >
              <Pencil size={15} />
            </button>
          </div>

          <p className="text-gray-600 text-sm mt-1 italic">
            🇧🇷 {expression.pt}
          </p>

          <button
            onClick={() => setShowExample((p) => !p)}
            className="mt-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
          >
            {showExample ? "🇧🇷 Hide example" : "🇺🇸 Show example"}
          </button>

          {showExample && (
            <div className="mt-2 bg-orange-50 border-l-4 border-orange-400 rounded-r-lg p-2">
              <SpeakSentence
                text={expression.example}
                className="text-gray-800 text-sm font-medium"
              >
                {expression.example}
              </SpeakSentence>
              <p className="text-gray-500 text-xs mt-1 italic">
                🇧🇷 {expression.examplePt}
              </p>
            </div>
          )}

          {answer && answer.trim() !== "" && (
            <div className="mt-2 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-2 flex items-start gap-2">
              <Check
                size={14}
                className="text-green-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-green-800 whitespace-pre-line">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// QUESTION CARD – for open-ended questions
// ============================================
interface Question {
  en: string;
  pt: string;
  usefulExpressions?: string[];
}

function QuestionCard({
  question,
  index,
  sectionKey,
  sectionTitle,
  answer,
  onOpenAnswer,
}: {
  question: Question;
  index: number;
  sectionKey: string;
  sectionTitle: string;
  answer?: string;
  onOpenAnswer: (
    question: Question,
    questionKey: string,
    sectionTitle: string
  ) => void;
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const [showUseful, setShowUseful] = useState(false);
  const questionKey = `${sectionKey}-${index}`;

  return (
    <div className="bg-white rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
          {index}
        </span>
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SpeakSentence
                text={question.en}
                className="text-gray-800 font-medium text-sm md:text-base leading-relaxed"
              >
                {question.en}
              </SpeakSentence>
            </div>
            <button
              onClick={() =>
                onOpenAnswer(question, questionKey, sectionTitle)
              }
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-orange-100 text-orange-500 hover:text-orange-700 transition-colors border border-orange-200"
              title="Write your answer"
              aria-label="Write your answer"
            >
              <Pencil size={15} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setShowTranslation((p) => !p)}
              className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
            >
              {showTranslation ? "🇧🇷 Hide translation" : "🇧🇷 Show translation"}
            </button>
            {question.usefulExpressions &&
              question.usefulExpressions.length > 0 && (
                <button
                  onClick={() => setShowUseful((p) => !p)}
                  className="text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors font-bold"
                >
                  {showUseful ? "💡 Hide useful expressions" : "💡 Useful expressions"}
                </button>
              )}
          </div>

          {showTranslation && (
            <p className="text-gray-600 text-xs md:text-sm mt-2 italic border-l-2 border-orange-300 pl-2">
              🇧🇷 {question.pt}
            </p>
          )}

          {showUseful && question.usefulExpressions && (
            <div className="mt-2 bg-purple-50 border-l-4 border-purple-400 rounded-r-lg p-2">
              <p className="text-[10px] uppercase tracking-wider text-purple-700 font-bold mb-1">
                💡 Try to use these expressions:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {question.usefulExpressions.map((expr, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white border border-purple-200 text-purple-800 px-2 py-0.5 rounded-full"
                  >
                    {expr}
                  </span>
                ))}
              </div>
            </div>
          )}

          {answer && answer.trim() !== "" && (
            <div className="mt-2 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-2 flex items-start gap-2">
              <Check
                size={14}
                className="text-green-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-green-800 whitespace-pre-line">
                {answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonSlangExpressions() {
  const router = useRouter();

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [answerModal, setAnswerModal] = useState<AnswerModalState>({
    isOpen: false,
    promptEn: "",
    promptPt: "",
    promptKey: "",
    sectionTitle: "",
    mode: "expression",
  });
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const openExpressionAnswer = (
    expression: Expression,
    promptKey: string,
    sectionTitle: string
  ) => {
    setAnswerModal({
      isOpen: true,
      promptEn: expression.en,
      promptPt: expression.pt,
      promptKey,
      sectionTitle,
      mode: "expression",
    });
  };

  const openQuestionAnswer = (
    question: Question,
    promptKey: string,
    sectionTitle: string
  ) => {
    setAnswerModal({
      isOpen: true,
      promptEn: question.en,
      promptPt: question.pt,
      promptKey,
      sectionTitle,
      mode: "question",
    });
  };

  const closeAnswerModal = () => {
    setAnswerModal((prev) => ({ ...prev, isOpen: false }));
  };

  const saveAnswer = (answer: string) => {
    setSavedAnswers((prev) => ({ ...prev, [answerModal.promptKey]: answer }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const mainImage =
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200";

  // ============================================================
  // EXPRESSION DATA — 85+ expressions
  // ============================================================

  // ---- SECTION 1: Natural Slang ----
  const naturalSlang: Expression[] = [
    { en: "What's up?", pt: "E aí? / Qual é?", level: "A2", example: "Hey, what's up? How have you been?", examplePt: "E aí? Como você tem passado?" },
    { en: "No biggie.", pt: "Não é nada demais.", level: "A2", example: "Don't worry about it. It's no biggie.", examplePt: "Não se preocupa. Não é nada demais." },
    { en: "I'm down.", pt: "Eu topo!", level: "A2–B1", example: "Wanna grab some food? — I'm down!", examplePt: "Quer comer alguma coisa? — Eu topo!" },
    { en: "Chill.", pt: "Relaxar / tranquilo.", level: "A2", example: "Let's just chill at home tonight.", examplePt: "Vamos só relaxar em casa hoje à noite." },
    { en: "I'm kidding.", pt: "Estou brincando.", level: "A2", example: "Relax, I'm kidding!", examplePt: "Calma, estou brincando!" },
  ];

  // ---- SECTION 2: Reactions & Everyday ----
  const reactionsEveryday: Expression[] = [
    { en: "For real?", pt: "Sério? / É verdade?", level: "A2", example: "For real? You got the job?", examplePt: "Sério? Você conseguiu o emprego?" },
    { en: "No way!", pt: "Não acredito! / Nem ferrando!", level: "A2", example: "No way! That's incredible!", examplePt: "Não acredito! Isso é incrível!" },
    { en: "My bad.", pt: "Foi mal. / Erro meu.", level: "A2", example: "My bad, I forgot to text you.", examplePt: "Foi mal, esqueci de te mandar mensagem." },
    { en: "Fair enough.", pt: "Justo. / Faz sentido.", level: "B1", example: "Fair enough. I understand your point.", examplePt: "Justo. Eu entendo seu ponto." },
    { en: "I feel you.", pt: "Te entendo. / Sei como é.", level: "B1", example: "I feel you. That happened to me too.", examplePt: "Te entendo. Isso aconteceu comigo também." },
    { en: "That's wild!", pt: "Que loucura!", level: "B1", example: "That's wild! I can't believe it.", examplePt: "Que loucura! Não consigo acreditar." },
    { en: "I'm not gonna lie (NGL).", pt: "Não vou mentir.", level: "B1", example: "I'm not gonna lie, that movie was amazing.", examplePt: "Não vou mentir, aquele filme foi incrível." },
    { en: "You got this!", pt: "Você consegue!", level: "A2", example: "Don't worry, you got this!", examplePt: "Não se preocupa, você consegue!" },
    { en: "It is what it is.", pt: "É o que é. / Fazer o quê?", level: "B1", example: "I lost my wallet. It is what it is.", examplePt: "Perdi minha carteira. É o que é." },
    { en: "I'm all ears.", pt: "Sou todo ouvidos.", level: "B1", example: "Go ahead, I'm all ears.", examplePt: "Vai em frente, sou todo ouvidos." },
    { en: "Say less!", pt: "Nem precisa falar mais! / Deixa comigo!", level: "B1", example: "Say less! I'll be there at eight.", examplePt: "Fechou! Estarei lá às oito." },
    { en: "Bet!", pt: "Fechou! / Combinado!", level: "B1", example: "Bet! Let's meet at the mall.", examplePt: "Fechou! Vamos nos encontrar no shopping." },
    { en: "Facts!", pt: "Fato! / Verdade!", level: "B1", example: "Facts! I totally agree with you.", examplePt: "Fato! Concordo totalmente com você." },
    { en: "Low-key.", pt: "Meio que / discretamente.", level: "B1–B2", example: "I'm low-key tired today.", examplePt: "Estou meio cansado hoje." },
    { en: "High-key.", pt: "Muito / sem esconder.", level: "B1–B2", example: "I'm high-key excited about my vacation.", examplePt: "Estou muito animado com minhas férias." },
  ];

  // ---- SECTION 3: Social Media 2026 ----
  const socialMedia: Expression[] = [
    { en: "It's giving…", pt: "Está passando uma vibe de…", level: "B1–B2", example: "That outfit is giving luxury.", examplePt: "Essa roupa está passando uma vibe de luxo." },
    { en: "Slay!", pt: "Arrasou!", level: "B1", example: "Slay! You look amazing!", examplePt: "Arrasou! Você está incrível!" },
    { en: "Ate and left no crumbs.", pt: "Arrasou completamente.", level: "B2", example: "She ate that performance up!", examplePt: "Ela simplesmente arrasou naquela apresentação!" },
    { en: "That's so real.", pt: "Isso é muito real / me identifico.", level: "B1", example: "That's so real. I feel the same way.", examplePt: "Isso é muito real. Sinto o mesmo." },
    { en: "It's giving main character energy.", pt: "Está com energia de protagonista.", level: "B2", example: "She walked in giving main character energy.", examplePt: "Ela entrou com energia de protagonista." },
    { en: "Delulu.", pt: "Delirante / vivendo uma ilusão.", level: "B2", example: "He's delulu if he thinks he can win.", examplePt: "Ele está delirando se acha que pode ganhar." },
    { en: "The vibe is immaculate.", pt: "A vibe está perfeita.", level: "B2", example: "This restaurant — the vibe is immaculate.", examplePt: "Esse restaurante — a vibe está perfeita." },
    { en: "It's a vibe.", pt: "Tem uma vibe boa.", level: "B1", example: "This song is a vibe.", examplePt: "Essa música tem uma vibe boa." },
    { en: "I'm here for it.", pt: "Apoio isso / gosto dessa ideia.", level: "B1", example: "A new season? I'm here for it.", examplePt: "Uma nova temporada? Apoio isso." },
    { en: "Let him cook.", pt: "Deixa o cara mostrar o que sabe.", level: "B2", example: "Let him cook. He knows what he's doing.", examplePt: "Deixa ele mostrar o que sabe. Ele sabe o que está fazendo." },
    { en: "Cooked.", pt: "Acabado / sem saída / em apuros.", level: "B2", example: "Bro is cooked. The exam starts in ten minutes.", examplePt: "O cara está ferrado. A prova começa em dez minutos." },
    { en: "Locked in.", pt: "Totalmente focado.", level: "B2", example: "I'm locked in. Don't distract me.", examplePt: "Estou totalmente focado. Não me distraia." },
    { en: "Touch grass.", pt: "Vai viver fora da internet um pouco.", level: "B2", example: "You need to touch grass, bro.", examplePt: "Você precisa viver fora da internet um pouco, cara." },
    { en: "Rent-free.", pt: "Não sai da cabeça.", level: "B2", example: "That song lives rent-free in my head.", examplePt: "Essa música não sai da minha cabeça." },
    { en: "It's not that deep.", pt: "Não é tão sério assim.", level: "B1–B2", example: "Relax, it's not that deep.", examplePt: "Relaxa, não é tão sério assim." },
    { en: "Cringe.", pt: "Vergonhoso / constrangedor.", level: "B1", example: "That video was so cringe.", examplePt: "Aquele vídeo foi tão vergonhoso." },
    { en: "The ick.", pt: "Algo que faz você perder o interesse por alguém.", level: "B2", example: "He chews with his mouth open. The ick.", examplePt: "Ele mastiga de boca aberta. Que ick." },
    { en: "Main character moment.", pt: "Momento de protagonista.", level: "B2", example: "I had a main character moment walking in the rain.", examplePt: "Tive um momento de protagonista andando na chuva." },
    { en: "Brain rot.", pt: "Conteúdo viciante ou absurdo que parece fritar o cérebro.", level: "B2", example: "I've been watching brain rot all day.", examplePt: "Fiquei assistindo conteúdo absurdo o dia todo." },
    { en: "IYKYK (If you know, you know).", pt: "Quem sabe, sabe.", level: "B1–B2", example: "That feeling when the weekend starts. IYKYK.", examplePt: "Aquela sensação quando o fim de semana começa. Quem sabe, sabe." },
  ];

  // ---- SECTION 4: Gym, Sports & Lifestyle ----
  const gymLifestyle: Expression[] = [
    { en: "Let's get after it.", pt: "Vamos com tudo!", level: "B1", example: "New week, new goals. Let's get after it!", examplePt: "Nova semana, novas metas. Vamos com tudo!" },
    { en: "No pain, no gain.", pt: "Sem esforço, sem resultado.", level: "B1", example: "No pain, no gain. Keep pushing!", examplePt: "Sem esforço, sem resultado. Continue!" },
    { en: "I'm hitting the gym.", pt: "Vou para a academia.", level: "A2", example: "I'm hitting the gym after work.", examplePt: "Vou à academia depois do trabalho." },
    { en: "Beast mode.", pt: "Modo insano de desempenho.", level: "B1", example: "He was in beast mode during the workout.", examplePt: "Ele estava em modo insano durante o treino." },
    { en: "I'm feeling pumped.", pt: "Estou cheio de energia / empolgado.", level: "B1", example: "I'm feeling pumped for the game!", examplePt: "Estou cheio de energia para o jogo!" },
    { en: "To crush it.", pt: "Mandar muito bem.", level: "B1", example: "You crushed that workout!", examplePt: "Você mandou muito bem nesse treino!" },
    { en: "To push through.", pt: "Persistir apesar da dificuldade.", level: "B1–B2", example: "I was tired, but I pushed through.", examplePt: "Estava cansado, mas persisti." },
    { en: "To be wiped out.", pt: "Estar exausto.", level: "B1", example: "I'm wiped out after leg day.", examplePt: "Estou acabado depois do treino de pernas." },
    { en: "To get back on track.", pt: "Voltar aos trilhos.", level: "B1", example: "I missed a few workouts, but I'm getting back on track.", examplePt: "Perdi alguns treinos, mas estou voltando aos trilhos." },
    { en: "Consistency is key.", pt: "Consistência é fundamental.", level: "B1–B2", example: "Consistency is key if you want results.", examplePt: "Consistência é fundamental se você quer resultados." },
  ];

  // ---- SECTION 5: Work, Study & Money ----
  const workMoney: Expression[] = [
    { en: "Let's get down to business.", pt: "Vamos ao que interessa.", level: "B1", example: "Okay, let's get down to business.", examplePt: "Ok, vamos ao que interessa." },
    { en: "I'm swamped.", pt: "Estou atolado de trabalho.", level: "B1", example: "I'm swamped with work this week.", examplePt: "Estou atolado de trabalho esta semana." },
    { en: "To figure something out.", pt: "Descobrir / encontrar uma solução.", level: "B1", example: "I need to figure out this problem.", examplePt: "Preciso resolver esse problema." },
    { en: "To wing it.", pt: "Improvisar.", level: "B1–B2", example: "I didn't study, so I had to wing it.", examplePt: "Não estudei, então tive que improvisar." },
    { en: "To get the hang of it.", pt: "Pegar o jeito.", level: "B1", example: "It took me a while to get the hang of coding.", examplePt: "Levei um tempo para pegar o jeito de programar." },
    { en: "To nail it.", pt: "Acertar em cheio / mandar muito bem.", level: "B1", example: "You nailed that presentation!", examplePt: "Você mandou muito bem naquela apresentação!" },
    { en: "To level up.", pt: "Evoluir / subir de nível.", level: "B1–B2", example: "I want to level up my English this year.", examplePt: "Quero evoluir meu inglês este ano." },
    { en: "To grind.", pt: "Se dedicar intensamente.", level: "B2", example: "She's been grinding all year to open her business.", examplePt: "Ela tem se dedicado intensamente o ano todo para abrir o negócio." },
    { en: "A game changer.", pt: "Algo que muda completamente o jogo.", level: "B2", example: "This new app is a game changer.", examplePt: "Esse novo app muda completamente o jogo." },
    { en: "To pay off.", pt: "Dar resultado / valer a pena.", level: "B1–B2", example: "All those hours of studying are finally paying off.", examplePt: "Todas aquelas horas de estudo finalmente estão dando resultado." },
    { en: "To call it a day.", pt: "Encerrar o expediente ou as atividades.", level: "B1", example: "Let's call it a day. We can finish tomorrow.", examplePt: "Vamos encerrar por hoje. Podemos terminar amanhã." },
    { en: "To be on the same page.", pt: "Estar alinhado / pensar da mesma forma.", level: "B1–B2", example: "Let's make sure we're on the same page.", examplePt: "Vamos garantir que estamos alinhados." },
    { en: "To cut corners.", pt: "Fazer algo de qualquer jeito para economizar tempo ou dinheiro.", level: "B2", example: "Don't cut corners when it comes to safety.", examplePt: "Não faça as coisas de qualquer jeito quando se trata de segurança." },
    { en: "To go the extra mile.", pt: "Fazer um esforço a mais.", level: "B2", example: "She always goes the extra mile for her clients.", examplePt: "Ela sempre faz um esforço a mais pelos clientes." },
    { en: "To be worth it.", pt: "Valer a pena.", level: "B1", example: "The trip was expensive, but it was worth it.", examplePt: "A viagem foi cara, mas valeu a pena." },
  ];

  // ---- SECTION 6: Friendships & Relationships ----
  const relationships: Expression[] = [
    { en: "We're vibing.", pt: "Estamos nos dando bem / curtindo a mesma vibe.", level: "B1", example: "We're vibing. We have so much in common.", examplePt: "Estamos nos dando bem. Temos muito em comum." },
    { en: "We hit it off.", pt: "Tivemos uma conexão imediata.", level: "B1", example: "We hit it off on our first date.", examplePt: "Nós nos demos muito bem no primeiro encontro." },
    { en: "To ghost someone.", pt: "Sumir sem dar explicações.", level: "B1–B2", example: "He ghosted me after two weeks of texting.", examplePt: "Ele sumiu depois de duas semanas de conversa por mensagem." },
    { en: "To catch feelings.", pt: "Começar a desenvolver sentimentos românticos.", level: "B2", example: "I think I'm catching feelings for her.", examplePt: "Acho que estou desenvolvendo sentimentos por ela." },
    { en: "Red flag.", pt: "Sinal de alerta.", level: "B1", example: "He never texts back. That's a red flag.", examplePt: "Ele nunca responde. Isso é um sinal de alerta." },
    { en: "Green flag.", pt: "Sinal positivo.", level: "B1", example: "Being respectful is a green flag.", examplePt: "Ser respeitoso é um sinal positivo." },
    { en: "To shoot your shot.", pt: "Arriscar / tentar conquistar alguém ou aproveitar uma oportunidade.", level: "B2", example: "You should shoot your shot and apply for the job.", examplePt: "Você deveria arriscar e se candidatar à vaga." },
    { en: "To hang out.", pt: "Sair / passar tempo junto.", level: "A2", example: "Do you want to hang out this weekend?", examplePt: "Você quer sair neste fim de semana?" },
    { en: "To be a good sport.", pt: "Saber lidar bem com brincadeiras ou derrotas.", level: "B1", example: "He lost the game but was a good sport about it.", examplePt: "Ele perdeu o jogo mas soube lidar bem com isso." },
    { en: "To have someone's back.", pt: "Apoiar alguém / estar ao lado de alguém.", level: "B1", example: "Don't worry. I've got your back.", examplePt: "Não se preocupa. Estou do seu lado." },
  ];

  // ---- SECTION 7: Extra Expressions ----
  const extraExpressions: Expression[] = [
    { en: "Long story short…", pt: "Resumindo…", level: "B1", example: "Long story short, I got the job.", examplePt: "Resumindo, consegui o emprego." },
    { en: "You do you.", pt: "Faça o que funciona para você.", level: "B1", example: "I don't agree, but you do you.", examplePt: "Não concordo, mas faça o que funciona para você." },
    { en: "I'm just messing with you.", pt: "Só estou te zoando.", level: "B1", example: "Relax, I'm just messing with you.", examplePt: "Relaxa, só estou te zoando." },
    { en: "Give me a heads-up.", pt: "Me avise com antecedência.", level: "B1", example: "Give me a heads-up if you're running late.", examplePt: "Me avise se você for se atrasar." },
    { en: "I'm on my way.", pt: "Estou a caminho.", level: "A2", example: "I'm on my way. Be there in ten.", examplePt: "Estou a caminho. Chego em dez." },
    { en: "That checks out.", pt: "Isso faz sentido / confere.", level: "B1–B2", example: "That checks out. The numbers make sense.", examplePt: "Isso confere. Os números fazem sentido." },
    { en: "It rings a bell.", pt: "Isso me soa familiar.", level: "B1", example: "That name rings a bell.", examplePt: "Esse nome me soa familiar." },
    { en: "I'm broke.", pt: "Estou sem grana.", level: "A2", example: "I'm broke until payday.", examplePt: "Estou sem grana até o dia do pagamento." },
    { en: "I'm up for it.", pt: "Estou a fim / topo.", level: "B1", example: "A movie tonight? I'm up for it.", examplePt: "Um filme hoje à noite? Estou a fim." },
    { en: "That's a solid point.", pt: "Esse é um argumento muito bom.", level: "B1–B2", example: "That's a solid point. I hadn't thought of that.", examplePt: "Esse é um argumento muito bom. Eu não tinha pensado nisso." },
  ];

  // ============================================================
  // OPEN-ENDED QUESTIONS (A2–B2)
  // ============================================================
  const openQuestions: Question[] = [
    {
      en: "What makes someone a good friend, and what are some red flags that make you lose interest in a friendship or relationship?",
      pt: "O que faz alguém ser um bom amigo, e quais são alguns sinais de alerta que fazem você perder o interesse em uma amizade ou relacionamento?",
      usefulExpressions: ["red flag", "green flag", "have someone's back", "I feel you", "hit it off"],
    },
    {
      en: "What's one skill you want to level up this year, and how could improving that skill pay off in your career or personal life?",
      pt: "Qual habilidade você quer desenvolver mais este ano, e como melhorá-la poderia trazer resultados para sua carreira ou vida pessoal?",
      usefulExpressions: ["level up", "grind", "pay off", "game changer", "go the extra mile"],
    },
    {
      en: "When life gets stressful and you're feeling wiped out, what helps you chill, get back on track, and stay consistent with your goals?",
      pt: "Quando a vida fica estressante e você está exausto, o que ajuda você a relaxar, voltar aos trilhos e manter a consistência nos seus objetivos?",
      usefulExpressions: ["chill", "wiped out", "push through", "get back on track", "consistency is key"],
    },
  ];

  // ============================================================
  // LEVEL GROUPS
  // ============================================================
  const levelGroups = [
    {
      level: "A2–B1",
      label: "Essential Everyday Slang",
      badge: "🌱 Basic",
      color: "from-green-500 to-emerald-600",
      headerBg: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      sections: [
        { key: "natural", title: "Natural Slang", emoji: "🔥", icon: Zap, color: "from-orange-500 to-orange-700", expressions: naturalSlang },
        { key: "reactions", title: "Reactions & Everyday", emoji: "💬", icon: MessageCircle, color: "from-rose-500 to-rose-700", expressions: reactionsEveryday },
        { key: "gym", title: "Gym, Sports & Lifestyle", emoji: "🏋️", icon: Dumbbell, color: "from-teal-500 to-teal-700", expressions: gymLifestyle },
        { key: "relationships", title: "Friendships & Relationships", emoji: "❤️", icon: Heart, color: "from-pink-500 to-rose-700", expressions: relationships },
      ],
    },
    {
      level: "B1–B2",
      label: "Modern & Professional Slang",
      badge: "🌿 Intermediate",
      color: "from-blue-500 to-blue-700",
      headerBg: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      sections: [
        { key: "social", title: "Social Media 2026", emoji: "📱", icon: Smartphone, color: "from-purple-500 to-purple-700", expressions: socialMedia },
        { key: "work", title: "Work, Study & Money", emoji: "💼", icon: Briefcase, color: "from-gray-700 to-gray-800", expressions: workMoney },
        { key: "extra", title: "Extra Expressions", emoji: "😎", icon: Sparkles, color: "from-indigo-500 to-indigo-700", expressions: extraExpressions },
      ],
    },
  ];

  const allSections = levelGroups.flatMap((g) => g.sections);
  const totalExpressions = allSections.reduce((sum, s) => sum + s.expressions.length, 0);
  const totalQuestions = openQuestions.length;

  // Initialize open sections (default: first section of each level open)
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    levelGroups.forEach((g) => {
      g.sections.forEach((s, i) => {
        initial[s.key] = i === 0;
      });
    });
    initial["open-questions"] = true;
    setOpenSections(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#faf6f0] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">
        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <MessageCircle size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">
              Slang & Expressions • A2 → B2
            </span>
            <MessageCircle size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            🇺🇸 English Slang & Expressions 2026
          </h1>
          <SpeakSentence
            text="More than fifty expressions, slang words, and natural phrases from contemporary English, used in conversations, social media, work, school, relationships, games, and everyday situations."
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6"
          >
            🗣️ Mais de 50 expressões, gírias e frases naturais do inglês contemporâneo —
            para você soar mais natural e descolado em 2026.
          </SpeakSentence>
          <div className="inline-block bg-orange-100 text-orange-800 font-bold px-5 py-2 rounded-full text-sm mb-8">
            ✨ {totalExpressions} expressions • {allSections.length} topics • {totalQuestions} open questions
          </div>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="People having a conversation"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              👆 Click the image to enlarge
            </p>
          </div>
        </div>

        {/* ===================== INSTRUCTIONS ===================== */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-50 border-2 border-orange-200 rounded-[30px] p-6 md:p-8 mb-10">
          <h3 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
            📢 How to use this class
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              • <strong>Click on any expression</strong> to hear the American pronunciation.
            </li>
            <li>
              • Click <strong>🇺🇸 Show example</strong> to see a real sentence using the expression.
            </li>
            <li>
              • Click the <strong>✏️ pencil</strong> to write your own example sentence.
            </li>
            <li>
              • Use the <strong>📝 pencil in each section header</strong> to save notes about the whole topic.
            </li>
            <li>
              • Expressions are grouped by level — start at A2–B1, then move up to B1–B2.
            </li>
            <li>
              • At the end, answer the <strong>3 open-ended questions</strong> using at least two expressions from the list.
            </li>
          </ul>
        </div>

        {/* ===================== LEVEL GROUPS ===================== */}
        {levelGroups.map((group) => (
          <div key={group.level} className="mb-12">
            <div
              className={`${group.headerBg} border-2 ${group.borderColor} rounded-[30px] p-6 mb-6`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`bg-gradient-to-r ${group.color} text-white font-bold px-5 py-2 rounded-full text-sm shadow-md`}
                >
                  {group.badge}
                </span>
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold ${group.textColor}`}>
                    Level {group.level}
                  </h2>
                  <p className={`text-sm ${group.textColor} opacity-80`}>
                    {group.label} •{" "}
                    {group.sections.reduce((s, x) => s + x.expressions.length, 0)}{" "}
                    expressions
                  </p>
                </div>
              </div>
            </div>

            {group.sections.map((section) => {
              const Icon = section.icon;
              const isOpen = openSections[section.key];
              return (
                <div
                  key={section.key}
                  className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-8 overflow-hidden"
                >
                  <div
                    className={`bg-gradient-to-r ${section.color} text-white py-4 px-6 md:px-8 flex justify-between items-center cursor-pointer`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Icon size={22} />
                      <h3 className="text-lg md:text-2xl font-bold">
                        {section.emoji} {section.title}
                      </h3>
                      <span className="hidden md:inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {section.expressions.length} expressions
                      </span>
                      <div onClick={(e) => e.stopPropagation()}>
                        <PencilIcon onClick={() => openNoteModal(section.title)} />
                      </div>
                    </div>
                    <button
                      className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors flex-shrink-0"
                      aria-label={isOpen ? "Collapse" : "Expand"}
                    >
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {isOpen && (
                    <div
                      className="p-4 md:p-6 space-y-3 bg-orange-50/40"
                      style={{ animation: "fadeIn 0.3s ease-out" }}
                    >
                      {section.expressions.map((expr, idx) => {
                        const eKey = `${section.key}-${idx + 1}`;
                        return (
                          <ExpressionCard
                            key={eKey}
                            expression={expr}
                            index={idx + 1}
                            sectionKey={section.key}
                            sectionTitle={section.title}
                            answer={savedAnswers[eKey]}
                            onOpenAnswer={openExpressionAnswer}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {/* ===================== OPEN-ENDED QUESTIONS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6 md:px-8 flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("open-questions")}
          >
            <div className="flex items-center gap-3 flex-1">
              <MessageCircle size={22} />
              <h3 className="text-lg md:text-2xl font-bold">
                🗣️ Speaking Practice — Open-Ended Questions
              </h3>
              <span className="hidden md:inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                {totalQuestions} questions
              </span>
              <div onClick={(e) => e.stopPropagation()}>
                <PencilIcon onClick={() => openNoteModal("Speaking Practice")} />
              </div>
            </div>
            <button
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors flex-shrink-0"
              aria-label={openSections["open-questions"] ? "Collapse" : "Expand"}
            >
              {openSections["open-questions"] ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
          </div>

          {openSections["open-questions"] && (
            <div
              className="p-4 md:p-6 space-y-3 bg-orange-50/40"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              <p className="text-sm text-gray-600 mb-4 italic">
                Níveis A2–B2 · Responda com frases completas e tente usar pelo menos duas
                expressões da lista em cada resposta. Não existe uma única resposta correta.
              </p>
              {openQuestions.map((q, idx) => {
                const qKey = `open-questions-${idx + 1}`;
                return (
                  <QuestionCard
                    key={qKey}
                    question={q}
                    index={idx + 1}
                    sectionKey="open-questions"
                    sectionTitle="Speaking Practice"
                    answer={savedAnswers[qKey]}
                    onOpenAnswer={openQuestionAnswer}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* ===================== WRAP UP ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🎯 WRAP UP!</h2>
            <SpeakSentence
              text="Keep the conversation going!"
              className="mt-2 text-orange-100 italic"
            >
              🗣️ Keep the conversation going!
            </SpeakSentence>
          </div>
          <div className="bg-orange-50 p-6 md:p-8">
            <h3 className="font-bold text-orange-800 text-lg mb-4">
              💡 Tips for using slang naturally
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Context matters.</strong> Some expressions like &ldquo;slay,&rdquo; &ldquo;delulu,&rdquo; and &ldquo;let him cook&rdquo; are very informal — great with friends, not in formal meetings.
              </li>
              <li>
                <strong>Don&apos;t force it.</strong> Use slang when it feels natural. It&apos;s better to use 5 expressions well than 20 awkwardly.
              </li>
              <li>
                <strong>Listen and repeat.</strong> Click the expressions to hear the pronunciation, then say them out loud.
              </li>
              <li>
                <strong>Write your own examples.</strong> Use the ✏️ pencil to create sentences about your own life.
              </li>
              <li>
                <strong>Pick 5–10 per day.</strong> Choose a few expressions, create examples related to your routine, and try to use them in a real conversation.
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-orange-300">
              <p className="text-orange-800 italic">
                🌟 <strong>Challenge:</strong> Record yourself answering the 3 open-ended questions using at least 5 expressions from this lesson. Listen and repeat — that&apos;s how you improve!
              </p>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson61")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            ← Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson63")}
            className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* ===== IMAGE MODAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Conversation class"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              ×
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

      <AnswerModal
        state={answerModal}
        initialAnswer={savedAnswers[answerModal.promptKey] || ""}
        onSave={saveAnswer}
        onClose={closeAnswerModal}
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