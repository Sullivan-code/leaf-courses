"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  MessageCircle,
  Heart,
  Users,
  Baby,
  Briefcase,
  Plane,
  Globe,
  Utensils,
  Cake,
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
// ANSWER MODAL (per-question pencil)
// ============================================
interface AnswerModalState {
  isOpen: boolean;
  questionEn: string;
  questionPt: string;
  questionKey: string;
  sectionTitle: string;
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
  }, [state.questionKey, state.isOpen]);

  if (!state.isOpen) return null;
  const handleSave = () => {
    onSave(answer);
    onClose();
  };
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
            Write your answer
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
          {/* Question at the top */}
          <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
            <p className="text-[10px] uppercase tracking-wider text-orange-600 font-bold mb-1">
              📌 {state.sectionTitle}
            </p>
            <SpeakSentence
              text={state.questionEn}
              className="text-gray-800 font-semibold text-base"
            >
              {state.questionEn}
            </SpeakSentence>
            <p className="text-sm text-gray-500 mt-1 italic">🇧🇷 {state.questionPt}</p>
          </div>

          {/* Answer textarea below */}
          <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
            ✍️ Your answer in English
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here... / Escreva sua resposta aqui..."
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
              Save Answer
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
// QUESTION CARD – with per-question pencil
// ============================================
interface Question {
  en: string;
  pt: string;
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

          <button
            onClick={() => setShowTranslation((p) => !p)}
            className="mt-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
          >
            {showTranslation ? "🇧🇷 Hide translation" : "🇧🇷 Show translation"}
          </button>
          {showTranslation && (
            <p className="text-gray-600 text-xs md:text-sm mt-2 italic border-l-2 border-orange-300 pl-2">
              🇧🇷 {question.pt}
            </p>
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
export default function LessonConversationClass() {
  const router = useRouter();

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [answerModal, setAnswerModal] = useState<AnswerModalState>({
    isOpen: false,
    questionEn: "",
    questionPt: "",
    questionKey: "",
    sectionTitle: "",
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

  const openAnswerModal = (
    question: Question,
    questionKey: string,
    sectionTitle: string
  ) => {
    setAnswerModal({
      isOpen: true,
      questionEn: question.en,
      questionPt: question.pt,
      questionKey,
      sectionTitle,
    });
  };

  const closeAnswerModal = () => {
    setAnswerModal((prev) => ({ ...prev, isOpen: false }));
  };

  const saveAnswer = (answer: string) => {
    setSavedAnswers((prev) => ({ ...prev, [answerModal.questionKey]: answer }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const mainImage =
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200";

  // ============================================================
  // A2–B1 – BASIC SECTIONS
  // ============================================================
  const routineQuestions: Question[] = [
    { en: "What time do you usually wake up?", pt: "A que horas você costuma acordar?" },
    { en: "What's the first thing you do when you wake up?", pt: "Qual é a primeira coisa que você faz quando acorda?" },
    { en: "Do you usually have breakfast? What do you eat?", pt: "Você costuma tomar café da manhã? O que você come?" },
    { en: "How do you usually get to work?", pt: "Como você costuma ir para o trabalho?" },
    { en: "What does a typical day look like for you?", pt: "Como é um dia típico para você?" },
    { en: "What time do you usually finish work?", pt: "A que horas você costuma terminar o trabalho?" },
    { en: "What do you usually do in the evening?", pt: "O que você costuma fazer à noite?" },
    { en: "Do you prefer mornings or evenings? Why?", pt: "Você prefere manhãs ou noites? Por quê?" },
    { en: "How many hours do you sleep on average?", pt: "Quantas horas você dorme em média?" },
    { en: "Do you drink coffee during the day? How many cups?", pt: "Você toma café durante o dia? Quantas xícaras?" },
    { en: "How do you usually relax after work?", pt: "Como você costuma relaxar depois do trabalho?" },
    { en: "Do you have any hobbies during the week?", pt: "Você tem algum hobby durante a semana?" },
    { en: "What's your favorite day of the week? Why?", pt: "Qual é o seu dia favorito da semana? Por quê?" },
    { en: "How often do you exercise or play sports?", pt: "Com que frequência você se exercita ou pratica esportes?" },
    { en: "What time do you usually go to bed?", pt: "A que horas você costuma ir para a cama?" },
  ];

  const familyQuestions: Question[] = [
    { en: "Tell me about your family.", pt: "Fale-me sobre sua família." },
    { en: "How many children do you have?", pt: "Quantos filhos você tem?" },
    { en: "What are your daughters' names and ages?", pt: "Quais são os nomes e as idades das suas filhas?" },
    { en: "What do you love most about being a parent?", pt: "O que você mais ama em ser pai/mãe?" },
    { en: "How would you describe your daughters' personalities?", pt: "Como você descreveria a personalidade das suas filhas?" },
    { en: "What activities do you enjoy doing with your daughters?", pt: "Quais atividades você gosta de fazer com suas filhas?" },
    { en: "How do you balance work and family time?", pt: "Como você equilibra trabalho e tempo com a família?" },
    { en: "What values do you want to teach your daughters?", pt: "Que valores você quer ensinar às suas filhas?" },
    { en: "How has your life changed since becoming a parent?", pt: "Como sua vida mudou desde que se tornou pai/mãe?" },
    { en: "What's the funniest thing your daughter has ever said?", pt: "Qual é a coisa mais engraçada que sua filha já disse?" },
    { en: "Do you have family traditions?", pt: "Vocês têm tradições familiares?" },
    { en: "What makes you proud as a parent?", pt: "O que te deixa orgulhoso(a) como pai/mãe?" },
  ];

  const foodQuestions: Question[] = [
    { en: "What's your favorite meal of the day?", pt: "Qual é sua refeição favorita do dia?" },
    { en: "What did you have for breakfast today?", pt: "O que você tomou no café da manhã hoje?" },
    { en: "Do you like to cook? What's your specialty?", pt: "Você gosta de cozinhar? Qual é a sua especialidade?" },
    { en: "What's your favorite Brazilian dish?", pt: "Qual é seu prato brasileiro favorito?" },
    { en: "Do you prefer salty or sweet food?", pt: "Você prefere comida salgada ou doce?" },
    { en: "What's the best restaurant you've ever been to?", pt: "Qual é o melhor restaurante em que você já esteve?" },
    { en: "Do you eat out often?", pt: "Você come fora com frequência?" },
    { en: "What food reminds you of your childhood?", pt: "Que comida te lembra sua infância?" },
    { en: "Do you like spicy food?", pt: "Você gosta de comida picante?" },
    { en: "What's your favorite snack?", pt: "Qual é seu lanche favorito?" },
    { en: "Are you a picky eater?", pt: "Você é seletivo(a) para comer?" },
    { en: "What's a dish you could eat every single day?", pt: "Qual prato você comeria todos os dias?" },
  ];

  const favoritesQuestions: Question[] = [
    { en: "What's your favorite time of the day?", pt: "Qual é sua hora favorita do dia?" },
    { en: "What's your favorite season of the year?", pt: "Qual é sua estação do ano favorita?" },
    { en: "What's your favorite movie?", pt: "Qual é seu filme favorito?" },
    { en: "What's your favorite song?", pt: "Qual é sua música favorita?" },
    { en: "What's your favorite color?", pt: "Qual é sua cor favorita?" },
    { en: "Who's your favorite person in the world?", pt: "Quem é sua pessoa favorita no mundo?" },
    { en: "What's your favorite place to relax?", pt: "Qual é seu lugar favorito para relaxar?" },
    { en: "What's your favorite holiday?", pt: "Qual é seu feriado favorito?" },
    { en: "What's your favorite smell?", pt: "Qual é seu cheiro favorito?" },
    { en: "What's your favorite book?", pt: "Qual é seu livro favorito?" },
    { en: "What's your favorite city in Brazil?", pt: "Qual é sua cidade favorita no Brasil?" },
    { en: "What's your favorite gift you've ever received?", pt: "Qual foi o melhor presente que você já recebeu?" },
  ];

  const carQuestions: Question[] = [
    { en: "What kind of car do you drive?", pt: "Que tipo de carro você dirige?" },
    { en: "Do you have a favorite car brand?", pt: "Você tem uma marca de carro favorita?" },
    { en: "What's your dream car?", pt: "Qual é seu carro dos sonhos?" },
    { en: "Do you like old cars or modern cars?", pt: "Você gosta de carros antigos ou modernos?" },
    { en: "Do you usually listen to music while driving?", pt: "Você costuma ouvir música enquanto dirige?" },
    { en: "What's your favorite route to drive?", pt: "Qual é seu trajeto favorito de carro?" },
    { en: "Are you a calm or aggressive driver?", pt: "Você é um motorista calmo ou agressivo?" },
    { en: "Do you like driving at night?", pt: "Você gosta de dirigir à noite?" },
    { en: "How often do you wash your car?", pt: "Com que frequência você lava seu carro?" },
    { en: "Do you enjoy long drives?", pt: "Você gosta de viagens longas de carro?" },
    { en: "Do you prefer driving alone or with company?", pt: "Você prefere dirigir sozinho ou acompanhado?" },
    { en: "Do you use a GPS or do you prefer maps?", pt: "Você usa GPS ou prefere mapas?" },
  ];

  // ============================================================
  // B1–B2 – INTERMEDIATE SECTIONS
  // ============================================================
  const childhoodQuestions: Question[] = [
    { en: "Where did you grow up?", pt: "Onde você cresceu?" },
    { en: "What was your childhood like?", pt: "Como foi sua infância?" },
    { en: "Who were you closest to in your family as a child?", pt: "Com quem você era mais próximo na família quando criança?" },
    { en: "What games did you play when you were a child?", pt: "Que jogos você jogava quando era criança?" },
    { en: "What was your favorite toy?", pt: "Qual era seu brinquedo favorito?" },
    { en: "Did you have a best friend in childhood?", pt: "Você teve um melhor amigo na infância?" },
    { en: "What's your earliest memory?", pt: "Qual é sua memória mais antiga?" },
    { en: "What did you want to be when you grew up?", pt: "O que você queria ser quando crescesse?" },
    { en: "What was your favorite subject in school?", pt: "Qual era sua matéria favorita na escola?" },
    { en: "What did you do during summer vacations?", pt: "O que você fazia nas férias de verão?" },
    { en: "Did you have any pets as a child?", pt: "Você teve algum animal de estimação quando criança?" },
    { en: "What's your favorite childhood memory?", pt: "Qual é sua memória de infância favorita?" },
    { en: "Were you a shy or outgoing child?", pt: "Você era uma criança tímida ou extrovertida?" },
    { en: "What's the biggest trouble you got into as a kid?", pt: "Qual foi a maior travessura que você fez quando criança?" },
    { en: "How was discipline handled in your home?", pt: "Como a disciplina era tratada em sua casa?" },
  ];

  const workQuestions: Question[] = [
    { en: "What do you do for a living?", pt: "O que você faz da vida?" },
    { en: "How long have you been working in your current job?", pt: "Há quanto tempo você trabalha no seu emprego atual?" },
    { en: "What made you choose this career?", pt: "O que te fez escolher essa carreira?" },
    { en: "What do you enjoy most about your job?", pt: "O que você mais gosta no seu trabalho?" },
    { en: "What's the most challenging part of your job?", pt: "Qual é a parte mais desafiadora do seu trabalho?" },
    { en: "Can you describe a typical day at work?", pt: "Você pode descrever um dia típico no trabalho?" },
    { en: "Have you ever worked abroad?", pt: "Você já trabalhou no exterior?" },
    { en: "What skills are essential for your job?", pt: "Que habilidades são essenciais para seu trabalho?" },
    { en: "How do you deal with stress at work?", pt: "Como você lida com o estresse no trabalho?" },
    { en: "Have you ever had a difficult coworker? How did you handle it?", pt: "Você já teve um colega difícil? Como lidou com isso?" },
    { en: "What's your biggest professional achievement?", pt: "Qual é sua maior conquista profissional?" },
    { en: "Where do you see yourself in five years?", pt: "Onde você se vê em cinco anos?" },
    { en: "Do you prefer working in a team or alone?", pt: "Você prefere trabalhar em equipe ou sozinho?" },
    { en: "Have you ever changed careers?", pt: "Você já mudou de carreira?" },
    { en: "What advice would you give someone starting in your field?", pt: "Que conselho você daria a alguém começando na sua área?" },
  ];

  const travelQuestions: Question[] = [
    { en: "Do you like to travel?", pt: "Você gosta de viajar?" },
    { en: "What's the most memorable trip you've ever taken?", pt: "Qual é a viagem mais memorável que você já fez?" },
    { en: "Where did you go on your last vacation?", pt: "Onde você foi na sua última viagem?" },
    { en: "Do you prefer beach or mountain trips?", pt: "Você prefere viagens de praia ou montanha?" },
    { en: "Have you ever traveled alone?", pt: "Você já viajou sozinho?" },
    { en: "What's your favorite city in the world?", pt: "Qual é sua cidade favorita no mundo?" },
    { en: "Do you prefer traveling by plane, car, or ship?", pt: "Você prefere viajar de avião, carro ou navio?" },
    { en: "What do you always pack when you travel?", pt: "O que você sempre leva quando viaja?" },
    { en: "Have you ever had a problem during a trip?", pt: "Você já teve algum problema durante uma viagem?" },
    { en: "What's the best food you've had while traveling?", pt: "Qual foi a melhor comida que você comeu viajando?" },
    { en: "Do you prefer planned trips or spontaneous ones?", pt: "Você prefere viagens planejadas ou espontâneas?" },
    { en: "What country would you like to visit next?", pt: "Qual país você gostaria de visitar em seguida?" },
    { en: "Have you ever been on a cruise?", pt: "Você já fez um cruzeiro?" },
    { en: "What's the longest trip you've ever taken?", pt: "Qual foi a viagem mais longa que você já fez?" },
    { en: "What's your dream destination?", pt: "Qual é seu destino dos sonhos?" },
  ];

  const countriesQuestions: Question[] = [
    { en: "Which countries have you visited so far?", pt: "Quais países você já visitou até agora?" },
    { en: "What country would you like to live in? Why?", pt: "Em qual país você gostaria de morar? Por quê?" },
    { en: "Have you ever experienced culture shock?", pt: "Você já experimentou choque cultural?" },
    { en: "What's the most interesting culture you've encountered?", pt: "Qual é a cultura mais interessante que você já conheceu?" },
    { en: "Do you like to try local food when you travel?", pt: "Você gosta de experimentar comida local quando viaja?" },
    { en: "What language would you like to learn?", pt: "Que idioma você gostaria de aprender?" },
    { en: "Have you ever made friends with people from other countries?", pt: "Você já fez amizade com pessoas de outros países?" },
    { en: "Would you like to work in another country?", pt: "Você gostaria de trabalhar em outro país?" },
    { en: "What's the most beautiful place you've ever seen?", pt: "Qual é o lugar mais bonito que você já viu?" },
    { en: "What do you miss most when you're abroad?", pt: "Do que você sente mais falta quando está no exterior?" },
    { en: "What country has the best food in your opinion?", pt: "Qual país tem a melhor comida na sua opinião?" },
    { en: "Would you ever move abroad with your family?", pt: "Você se mudaria para o exterior com sua família?" },
  ];

  // ============================================================
  // C1 – ADVANCED SECTIONS
  // ============================================================
  const philosophyQuestions: Question[] = [
    { en: "If you had to distill your philosophy of life into a single sentence, what would it be?", pt: "Se você tivesse que resumir sua filosofia de vida em uma única frase, qual seria?" },
    { en: "Do you believe meaning is discovered or created? Why?", pt: "Você acredita que o sentido é descoberto ou criado? Por quê?" },
    { en: "What's the difference between living and merely existing?", pt: "Qual é a diferença entre viver e apenas existir?" },
    { en: "Would you rather live a short meaningful life or a long ordinary one?", pt: "Você preferiria viver uma vida curta e significativa ou uma longa e comum?" },
    { en: "If you could know the exact date of your death, would you want to?", pt: "Se você pudesse saber a data exata da sua morte, você gostaria?" },
    { en: "Is happiness a choice, a circumstance, or a byproduct of something else?", pt: "A felicidade é uma escolha, uma circunstância, ou um subproduto de algo mais?" },
    { en: "Do you believe in fate, free will, or something in between?", pt: "Você acredita em destino, livre-arbítrio, ou algo entre os dois?" },
    { en: "What question keeps you up at night?", pt: "Qual pergunta te mantém acordado à noite?" },
    { en: "Is there such a thing as an objectively meaningful life?", pt: "Existe algo como uma vida objetivamente significativa?" },
    { en: "If no one remembered you, would your life still have mattered?", pt: "Se ninguém se lembrasse de você, sua vida ainda teria importado?" },
    { en: "What's the most important thing you've learned about being human?", pt: "Qual é a coisa mais importante que você aprendeu sobre ser humano?" },
    { en: "Do you think the universe has a purpose, or do we invent one?", pt: "Você acha que o universo tem um propósito, ou nós o inventamos?" },
    { en: "Would you rather live in a beautiful lie or an ugly truth?", pt: "Você preferiria viver em uma mentira bonita ou numa verdade feia?" },
    { en: "If you could wake up tomorrow with one existential question answered, what would it be?", pt: "Se você pudesse acordar amanhã com uma pergunta existencial respondida, qual seria?" },
    { en: "What does \"living authentically\" actually mean to you?", pt: "O que \"viver autenticamente\" realmente significa pra você?" },
  ];

  const identityQuestions: Question[] = [
    { en: "Which of your values have shifted the most over the past decade, and why?", pt: "Quais dos seus valores mudaram mais na última década, e por quê?" },
    { en: "How do you reconcile who you are with who you thought you'd become?", pt: "Como você concilia quem você é com quem você pensava que se tornaria?" },
    { en: "Is there a part of your identity you've had to fight to preserve?", pt: "Existe alguma parte da sua identidade que você teve que lutar para preservar?" },
    { en: "When have you felt most authentically yourself?", pt: "Quando você se sentiu mais autenticamente você mesmo?" },
    { en: "What would you refuse to compromise on, even if it cost you everything?", pt: "Com o que você se recusaria a fazer concessões, mesmo que custasse tudo?" },
    { en: "Have you ever had to choose between being liked and being true to yourself?", pt: "Você já teve que escolher entre ser querido e ser fiel a si mesmo?" },
    { en: "What mask do you wear most often, and why?", pt: "Qual máscara você usa com mais frequência, e por quê?" },
    { en: "Do you think people can fundamentally change, or only refine what they already are?", pt: "Você acha que as pessoas podem mudar fundamentalmente, ou apenas refinar o que já são?" },
    { en: "Which of your beliefs did you inherit rather than choose?", pt: "Quais das suas crenças você herdou em vez de escolher?" },
    { en: "What did you have to unlearn to become who you are?", pt: "O que você teve que desaprender para se tornar quem é?" },
    { en: "Do you shape your environment, or does it shape you?", pt: "Você molda seu ambiente, ou ele te molda?" },
    { en: "What does integrity mean to you in practice, not in theory?", pt: "O que integridade significa pra você na prática, não na teoria?" },
  ];

  const regretsQuestions: Question[] = [
    { en: "What's the one decision that, if changed, would have altered your entire life trajectory?", pt: "Qual é a decisão que, se mudada, teria alterado toda a trajetória da sua vida?" },
    { en: "Do you believe in regret, or in lessons? Why?", pt: "Você acredita em arrependimento, ou em lições? Por quê?" },
    { en: "Which \"wrong turn\" turned out to be the right one?", pt: "Qual \"caminho errado\" acabou sendo o certo?" },
    { en: "What would you tell your twenty-year-old self, knowing what you know now?", pt: "O que você diria ao seu eu de vinte anos, sabendo o que sabe hoje?" },
    { en: "Have you ever knowingly made a mistake that you would make again?", pt: "Você já cometeu um erro conscientemente que cometeria de novo?" },
    { en: "Is there a person you wish you had treated differently?", pt: "Existe alguma pessoa que você gostaria de ter tratado diferente?" },
    { en: "What's the smallest decision you've made that had the biggest consequence?", pt: "Qual foi a menor decisão que você tomou que teve a maior consequência?" },
    { en: "Have you ever walked away from something you wanted because it wasn't right for you?", pt: "Você já abriu mão de algo que queria porque não era certo pra você?" },
    { en: "Do you think people regret the things they did, or the things they didn't do, more?", pt: "Você acha que as pessoas se arrependem mais do que fizeram, ou do que não fizeram?" },
    { en: "What would your life look like if you had said \"yes\" instead of \"no\"?", pt: "Como seria sua vida se você tivesse dito \"sim\" em vez de \"não\"?" },
    { en: "Is regret a wasted emotion or a necessary teacher?", pt: "Arrependimento é uma emoção desperdiçada ou um professor necessário?" },
    { en: "What's a decision you're still not sure you made correctly?", pt: "Qual decisão você ainda não tem certeza se tomou corretamente?" },
  ];

  const ambitionQuestions: Question[] = [
    { en: "What does success actually mean to you, stripped of other people's expectations?", pt: "O que sucesso realmente significa pra você, sem as expectativas dos outros?" },
    { en: "Have you ever achieved something you thought would make you happy — and it didn't?", pt: "Você já alcançou algo que pensou que te faria feliz — e não fez?" },
    { en: "Is ambition a virtue or a curse?", pt: "Ambição é uma virtude ou uma maldição?" },
    { en: "What would you attempt if you knew you could not fail?", pt: "O que você tentaria se soubesse que não poderia falhar?" },
    { en: "Where's the line between healthy ambition and self-destruction?", pt: "Onde está a linha entre ambição saudável e autodestruição?" },
    { en: "Do you measure success by what you have, what you've done, or who you've become?", pt: "Você mede sucesso pelo que você tem, pelo que você fez, ou por quem você se tornou?" },
    { en: "Have you ever sacrificed something important for ambition?", pt: "Você já sacrificou algo importante pela ambição?" },
    { en: "What does \"enough\" look like to you?", pt: "Como é \"o suficiente\" pra você?" },
    { en: "Is it possible to be both ambitious and content?", pt: "É possível ser ao mesmo tempo ambicioso e contente?" },
    { en: "Would you rather be remembered or unknown but happy?", pt: "Você preferiria ser lembrado ou desconhecido mas feliz?" },
    { en: "What's the difference between a dream and a delusion?", pt: "Qual é a diferença entre um sonho e um delírio?" },
    { en: "Is success ever truly earned, or is it always partly luck?", pt: "O sucesso é algum dia realmente conquistado, ou é sempre em parte sorte?" },
  ];

  const humanNatureQuestions: Question[] = [
    { en: "Do you believe humans are fundamentally good, bad, or something else?", pt: "Você acredita que os humanos são fundamentalmente bons, maus, ou algo mais?" },
    { en: "In what ways has society shaped your personality without you noticing?", pt: "De que maneiras a sociedade moldou sua personalidade sem você perceber?" },
    { en: "Is true altruism possible, or is everything self-interested at some level?", pt: "O altruísmo verdadeiro é possível, ou tudo é interesseiro em algum nível?" },
    { en: "What would you change about human nature if you could?", pt: "O que você mudaria na natureza humana se pudesse?" },
    { en: "How do you distinguish between justice and revenge?", pt: "Como você distingue justiça de vingança?" },
    { en: "Do you think people are becoming more connected or more isolated?", pt: "Você acha que as pessoas estão ficando mais conectadas ou mais isoladas?" },
    { en: "Is social media a tool for liberation or for control?", pt: "As redes sociais são uma ferramenta de libertação ou de controle?" },
    { en: "What would a truly fair society look like?", pt: "Como seria uma sociedade verdadeiramente justa?" },
    { en: "Are we responsible for problems we didn't cause but benefit from?", pt: "Somos responsáveis por problemas que não causamos mas dos quais nos beneficiamos?" },
    { en: "Is it possible to be moral in an immoral system?", pt: "É possível ser moral em um sistema imoral?" },
    { en: "What do you think is humanity's biggest blind spot?", pt: "Qual você acha que é o maior ponto cego da humanidade?" },
    { en: "Do you think history repeats itself, or just rhymes?", pt: "Você acha que a história se repete, ou apenas rima?" },
  ];

  const riskQuestions: Question[] = [
    { en: "What's the biggest risk you've ever taken, and what did it teach you?", pt: "Qual foi o maior risco que você já correu, e o que ele te ensinou?" },
    { en: "Have you ever been truly afraid? How did you handle it?", pt: "Você já teve medo de verdade? Como você lidou com isso?" },
    { en: "Is courage the absence of fear or the triumph over it?", pt: "Coragem é a ausência de medo ou o triunfo sobre ele?" },
    { en: "What fear have you outgrown, and what fear have you accepted?", pt: "Qual medo você superou, e qual medo você aceitou?" },
    { en: "When is fear a signal to stop — and when is it a signal to go?", pt: "Quando o medo é um sinal para parar — e quando é um sinal para ir?" },
    { en: "Do you think fear is learned or innate?", pt: "Você acha que o medo é aprendido ou inato?" },
    { en: "Have you ever risked a relationship to tell the truth?", pt: "Você já arriscou um relacionamento para dizer a verdade?" },
    { en: "What would you do if you weren't afraid?", pt: "O que você faria se não tivesse medo?" },
    { en: "Have you ever regretted playing it safe?", pt: "Você já se arrependeu de ter jogado pelo seguro?" },
    { en: "Is the fear of failure more paralyzing than failure itself?", pt: "O medo do fracasso é mais paralisante do que o próprio fracasso?" },
    { en: "What's the bravest thing you've ever done that no one knows about?", pt: "Qual é a coisa mais corajosa que você já fez que ninguém sabe?" },
    { en: "Do you think courage is a personality trait or a muscle you can build?", pt: "Você acha que coragem é um traço de personalidade ou um músculo que se desenvolve?" },
  ];

  const loveQuestions: Question[] = [
    { en: "What's the difference between love and attachment?", pt: "Qual é a diferença entre amor e apego?" },
    { en: "Have you ever been betrayed by someone close to you? How did you recover?", pt: "Você já foi traído por alguém próximo? Como se recuperou?" },
    { en: "What do you look for in a true friend that you wouldn't find in anyone else?", pt: "O que você procura em um verdadeiro amigo que não encontraria em mais ninguém?" },
    { en: "Can love survive without trust?", pt: "O amor pode sobreviver sem confiança?" },
    { en: "Is it possible to forgive someone who has never apologized?", pt: "É possível perdoar alguém que nunca se desculpou?" },
    { en: "Do you think love changes over time, or does it just reveal itself more?", pt: "Você acha que o amor muda com o tempo, ou apenas se revela mais?" },
    { en: "Have you ever loved someone you didn't like?", pt: "Você já amou alguém de quem não gostava?" },
    { en: "What's the difference between friendship and intimacy?", pt: "Qual é a diferença entre amizade e intimidade?" },
    { en: "Can a friendship survive a serious betrayal?", pt: "Uma amizade pode sobreviver a uma traição séria?" },
    { en: "Is it possible to love two people at once?", pt: "É possível amar duas pessoas ao mesmo tempo?" },
    { en: "Do you believe in soulmates?", pt: "Você acredita em almas gêmeas?" },
    { en: "What's the most important thing you've learned from a friendship?", pt: "Qual é a coisa mais importante que você aprendeu com uma amizade?" },
    { en: "Have you ever let go of someone you loved? Why?", pt: "Você já deixou ir alguém que amava? Por quê?" },
    { en: "Do you think jealousy is a sign of love or insecurity?", pt: "Você acha que ciúme é sinal de amor ou de insegurança?" },
    { en: "What does loyalty actually mean to you?", pt: "O que lealdade realmente significa pra você?" },
  ];

  const moneyQuestions: Question[] = [
    { en: "Does money change people, or reveal them?", pt: "O dinheiro muda as pessoas, ou as revela?" },
    { en: "What's the moral cost of an easy life?", pt: "Qual é o custo moral de uma vida fácil?" },
    { en: "Have you ever compromised your ethics for practical reasons?", pt: "Você já comprometeu sua ética por razões práticas?" },
    { en: "Is power inherently corrupting, or does it simply reveal?", pt: "O poder é inerentemente corruptor, ou simplesmente revela?" },
    { en: "What's more dangerous: someone who wants power, or someone who doesn't want to give it up?", pt: "O que é mais perigoso: alguém que quer poder, ou alguém que não quer abrir mão dele?" },
    { en: "Would you take a bribe if no one would ever know?", pt: "Você aceitaria um suborno se ninguém nunca soubesse?" },
    { en: "Is it possible to be both rich and ethical?", pt: "É possível ser ao mesmo tempo rico e ético?" },
    { en: "What's the difference between a fair price and an exploitative one?", pt: "Qual é a diferença entre um preço justo e um explorador?" },
    { en: "Do you think capitalism and morality can coexist?", pt: "Você acha que capitalismo e moralidade podem coexistir?" },
    { en: "Is it wrong to be wealthy while others starve?", pt: "É errado ser rico enquanto outros passam fome?" },
    { en: "What would you do if you found a wallet with $10,000 inside?", pt: "O que você faria se encontrasse uma carteira com R$ 50.000 dentro?" },
    { en: "Have you ever been pressured to do something against your values?", pt: "Você já foi pressionado a fazer algo contra seus valores?" },
  ];

  // ============================================================
  // LEVEL GROUPS
  // ============================================================
  const levelGroups = [
    {
      level: "A2–B1",
      label: "Beginner to Pre-Intermediate",
      badge: "🌱 Basic",
      color: "from-green-500 to-emerald-600",
      headerBg: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      sections: [
        { key: "routine", title: "Life & Daily Routine", emoji: "☀️", icon: Sun, color: "from-orange-500 to-orange-700", questions: routineQuestions },
        { key: "family", title: "Family & Children", emoji: "👨‍👩‍👧", icon: Heart, color: "from-rose-500 to-rose-700", questions: familyQuestions },
        { key: "food", title: "Food & Meals", emoji: "🍽️", icon: Utensils, color: "from-red-500 to-red-700", questions: foodQuestions },
        { key: "favorites", title: "Favorite Things", emoji: "⭐", icon: Star, color: "from-yellow-500 to-yellow-700", questions: favoritesQuestions },
        { key: "cars", title: "Cars & Driving Habits", emoji: "🚗", icon: Car, color: "from-zinc-600 to-zinc-800", questions: carQuestions },
      ],
    },
    {
      level: "B1–B2",
      label: "Intermediate",
      badge: "🌿 Intermediate",
      color: "from-blue-500 to-blue-700",
      headerBg: "bg-blue-50",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      sections: [
        { key: "childhood", title: "Childhood Memories", emoji: "🧸", icon: Users, color: "from-amber-500 to-amber-700", questions: childhoodQuestions },
        { key: "work", title: "Work & Career", emoji: "💼", icon: Briefcase, color: "from-gray-700 to-gray-800", questions: workQuestions },
        { key: "travel", title: "Travel & Trips", emoji: "✈️", icon: Plane, color: "from-sky-500 to-sky-700", questions: travelQuestions },
        { key: "countries", title: "Countries & Cultures", emoji: "🌎", icon: Globe, color: "from-emerald-500 to-emerald-700", questions: countriesQuestions },
      ],
    },
    {
      level: "C1",
      label: "Advanced — Abstract & Philosophical",
      badge: "🌳 Advanced",
      color: "from-purple-500 to-purple-700",
      headerBg: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-800",
      sections: [
        { key: "philosophy", title: "Philosophy & Meaning of Life", emoji: "🧭", icon: Compass, color: "from-purple-500 to-purple-700", questions: philosophyQuestions },
        { key: "identity", title: "Identity & Values", emoji: "✨", icon: Sparkles, color: "from-fuchsia-500 to-fuchsia-700", questions: identityQuestions },
        { key: "regrets", title: "Regrets & Turning Points", emoji: "⚓", icon: Anchor, color: "from-slate-600 to-slate-800", questions: regretsQuestions },
        { key: "ambition", title: "Ambition & Success", emoji: "🎯", icon: Target, color: "from-indigo-500 to-indigo-700", questions: ambitionQuestions },
        { key: "humanNature", title: "Human Nature & Society", emoji: "⚖️", icon: Scale, color: "from-teal-500 to-teal-700", questions: humanNatureQuestions },
        { key: "risk", title: "Risk, Fear & Courage", emoji: "🔥", icon: Flame, color: "from-orange-600 to-red-700", questions: riskQuestions },
        { key: "love", title: "Love, Friendship & Betrayal", emoji: "💔", icon: Heart, color: "from-pink-500 to-rose-700", questions: loveQuestions },
        { key: "money", title: "Money, Power & Ethics", emoji: "👑", icon: Crown, color: "from-yellow-600 to-amber-800", questions: moneyQuestions },
      ],
    },
  ];

  const allSections = levelGroups.flatMap((g) => g.sections);
  const totalQuestions = allSections.reduce((sum, s) => sum + s.questions.length, 0);

  // Initialize open sections (default: first section of each level open)
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    levelGroups.forEach((g) => {
      g.sections.forEach((s, i) => {
        initial[s.key] = i === 0;
      });
    });
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
              Conversation Class • A2 → C1
            </span>
            <MessageCircle size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            💬 Let&apos;s Talk About Life!
          </h1>
          <SpeakSentence
            text="A three-level conversation class with over two hundred open-ended questions about life, family, travel, philosophy, identity and much more."
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6"
          >
            🗣️ A three-level conversation class with over 200 open-ended questions
            about life, family, travel, philosophy, identity, and much more.
          </SpeakSentence>
          <div className="inline-block bg-orange-100 text-orange-800 font-bold px-5 py-2 rounded-full text-sm mb-8">
            ✨ {totalQuestions} questions • {allSections.length} topics • 3 levels
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
              • <strong>Click on any question</strong> to hear the American pronunciation.
            </li>
            <li>
              • Click the <strong>✏️ pencil next to a question</strong> to open the answer box —
              the question stays at the top while you write.
            </li>
            <li>
              • Answer <strong>out loud</strong> with full sentences — not just one word.
            </li>
            <li>
              • Try to speak for <strong>at least 30 seconds</strong> on each question.
            </li>
            <li>
              • Use the <strong>📝 pencil in each section header</strong> to save notes about the whole topic.
            </li>
            <li>
              • Questions are grouped by CEFR level — start at A2–B1, then move up.
            </li>
          </ul>
        </div>

        {/* ===================== LEVEL GROUPS ===================== */}
        {levelGroups.map((group) => (
          <div key={group.level} className="mb-12">
            {/* Level header */}
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
                    {group.sections.reduce((s, x) => s + x.questions.length, 0)}{" "}
                    questions
                  </p>
                </div>
              </div>
            </div>

            {/* Sections in this level */}
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
                        {section.questions.length} questions
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
                      {section.questions.map((q, idx) => {
                        const qKey = `${section.key}-${idx + 1}`;
                        return (
                          <QuestionCard
                            key={qKey}
                            question={q}
                            index={idx + 1}
                            sectionKey={section.key}
                            sectionTitle={section.title}
                            answer={savedAnswers[qKey]}
                            onOpenAnswer={openAnswerModal}
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
              💡 Tips for a great conversation
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Answer with full sentences.</strong> Instead of &ldquo;Yes,&rdquo; say &ldquo;Yes, I love traveling with my family.&rdquo;
              </li>
              <li>
                <strong>Give examples.</strong> When you say &ldquo;I like Italian food,&rdquo; add: &ldquo;Last year I went to a wonderful Italian restaurant in São Paulo.&rdquo;
              </li>
              <li>
                <strong>Use linking words:</strong> because, so, but, however, also, actually, honestly.
              </li>
              <li>
                <strong>Ask the question back</strong> to keep the conversation flowing.
              </li>
              <li>
                <strong>Don&apos;t worry about mistakes.</strong> Fluency comes with practice, not perfection.
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-orange-300">
              <p className="text-orange-800 italic">
                🌟 <strong>Challenge:</strong> Pick 10 questions from different levels and record yourself answering them. Listen and repeat — that&apos;s how you improve!
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
        initialAnswer={savedAnswers[answerModal.questionKey] || ""}
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