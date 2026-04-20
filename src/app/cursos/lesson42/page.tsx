"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, ChevronDown, ChevronUp, Check, XCircle, ChevronLeft, ChevronRight, Volume2 } from "lucide-react";

// ============================================
// LISTEN ITEMS - Imagem 1, 2, 3 (EMBARALHADAS NA TELA, MAS ORDEM CORRETA É 1,2,3)
// ============================================
const listenItemsOriginal = [
  {
    key: "image1",
    label: "1. pessoas sentadas em grupo conversando",
    image: "/images/lesson42/people-working.jpg",
    placeholder: "👥💻",
    description: "pessoas sentadas em grupo conversando e usando laptops",
    correctNumber: 1
  },
  {
    key: "image2",
    label: "2. pessoas tomando café ao fundo",
    image: "/images/lesson42/coffee-break.jpg",
    placeholder: "☕",
    description: "pessoas em pé ao fundo tomando café e interagindo",
    correctNumber: 2
  },
  {
    key: "image3",
    label: "3. estudantes trabalhando em círculo",
    image: "/images/lesson42/students-circle.jpg",
    placeholder: "👨‍🎓📚",
    description: "estudantes sentados em círculo trabalhando juntos",
    correctNumber: 3
  },
];

// Função para embaralhar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// DRILLING PRACTICE I - Substitution Practice (Lesson 42)
// ============================================
const drillingExercises1 = [
  {
    id: 1,
    portuguese: "Você está pronto para começar?",
    english: "Are you ready to start?",
    substitutions: [
      { word: "ir", english: "to go", phrase: "Are you ready to go?" },
      { word: "comer", english: "to eat", phrase: "Are you ready to eat?" }
    ]
  },
  {
    id: 2,
    portuguese: "Ele está com fome?",
    english: "Is he hungry?",
    substitutions: [
      { word: "com sede", english: "thirsty", phrase: "Is he thirsty?" },
      { word: "cansado", english: "tired", phrase: "Is he tired?" }
    ]
  },
  {
    id: 3,
    portuguese: "Eles estão chateados?",
    english: "Are they upset?",
    substitutions: [
      { word: "preocupados", english: "worried", phrase: "Are they worried?" },
      { word: "ocupados", english: "busy", phrase: "Are they busy?" }
    ]
  },
  {
    id: 4,
    portuguese: "Quem é aquele estudante?",
    english: "Who is that student?",
    substitutions: [
      { word: "gerente", english: "manager", phrase: "Who is that manager?" },
      { word: "vendedor", english: "salesperson", phrase: "Who is that salesperson?" }
    ]
  },
  {
    id: 5,
    portuguese: "Qual é o seu nome?",
    english: "What is your name?",
    substitutions: [
      { word: "o nome dele", english: "his name", phrase: "What is his name?" },
      { word: "o nome dela", english: "her name", phrase: "What is her name?" }
    ]
  },
  {
    id: 6,
    portuguese: "Por que ela está triste?",
    english: "Why is she sad?",
    substitutions: [
      { word: "chateada", english: "upset", phrase: "Why is she upset?" },
      { word: "preocupada", english: "worried", phrase: "Why is she worried?" }
    ]
  },
  {
    id: 7,
    portuguese: "É dia primeiro de julho.",
    english: "It's July 1st.",
    substitutions: [
      { word: "quatro", english: "4th", phrase: "It's July 4th." },
      { word: "20", english: "20th", phrase: "It's July 20th." }
    ]
  }
];

// ============================================
// NEGATIVE EXERCISES - Change into Negative (Lesson 42)
// ============================================
const negativeExercises = [
  { id: 1, affirmative: "I work in December.", negative: "I don't work in December.", userAnswer: "" },
  { id: 2, affirmative: "I have a toothache.", negative: "I don't have a toothache.", userAnswer: "" },
  { id: 3, affirmative: "They have an appointment at the doctor.", negative: "They don't have an appointment at the doctor.", userAnswer: "" },
  { id: 4, affirmative: "He takes painkillers for his headaches.", negative: "He doesn't take painkillers for his headaches.", userAnswer: "" },
  { id: 5, affirmative: "We work on December 25th.", negative: "We don't work on December 25th.", userAnswer: "" },
  { id: 6, affirmative: "We know his name.", negative: "We don't know his name.", userAnswer: "" },
];

// ============================================
// DRILLING PRACTICE II - Substitution Practice (Lesson 42)
// ============================================
const drillingExercises2 = [
  {
    id: 1,
    portuguese: "Quantos anos você tem?",
    english: "How old are you?",
    substitutions: [
      { word: "ele", phrase: "How old is he?" },
      { word: "ela", phrase: "How old is she?" }
    ]
  },
  {
    id: 2,
    portuguese: "O vendedor tem 24 anos.",
    english: "The salesperson is 24 years old.",
    substitutions: [
      { word: "19", phrase: "The salesperson is 19 years old." },
      { word: "33", phrase: "The salesperson is 33 years old." }
    ]
  },
  {
    id: 3,
    portuguese: "Nós não estamos atrasados.",
    english: "We are not late.",
    substitutions: [
      { word: "ocupados", phrase: "We are not busy." },
      { word: "tristes", phrase: "We are not sad." }
    ]
  },
  {
    id: 4,
    portuguese: "Ela é uma boa enfermeira.",
    english: "She is a good nurse.",
    substitutions: [
      { word: "gentil", phrase: "She is a kind nurse." },
      { word: "feliz", phrase: "She is a happy nurse." }
    ]
  },
  {
    id: 5,
    portuguese: "Você está atrasado para a aula?",
    english: "Are you late for class?",
    substitutions: [
      { word: "reunião", phrase: "Are you late for the meeting?" },
      { word: "seu compromisso", phrase: "Are you late for your appointment?" }
    ]
  },
  {
    id: 6,
    portuguese: "Meu aniversário é dia 14 de outubro.",
    english: "My birthday is October 14th.",
    substitutions: [
      { word: "30", phrase: "My birthday is October 30th." },
      { word: "18", phrase: "My birthday is October 18th." }
    ]
  }
];

// ============================================
// AFFIRMATIVE EXERCISES - Change into Affirmative (Lesson 42)
// ============================================
const affirmativeExercises = [
  { id: 1, negative: "The designer is not here today.", affirmative: "The designer is here today.", userAnswer: "" },
  { id: 2, negative: "My brothers are not young.", affirmative: "My brothers are young.", userAnswer: "" },
  { id: 3, negative: "My birthday is not in July.", affirmative: "My birthday is in July.", userAnswer: "" },
  { id: 4, negative: "My sister is not ready to go.", affirmative: "My sister is ready to go.", userAnswer: "" },
  { id: 5, negative: "Her vacation is not in January.", affirmative: "Her vacation is in January.", userAnswer: "" },
  { id: 6, negative: "The sunglasses are not expensive.", affirmative: "The sunglasses are expensive.", userAnswer: "" },
];

// ============================================
// INTERROGATIVE EXERCISES - Change into Interrogative (Lesson 42)
// ============================================
const interrogativeExercises = [
  { id: 1, statement: "He is 38 years old.", interrogative: "Is he 38 years old?", userAnswer: "" },
  { id: 2, statement: "She is very pretty.", interrogative: "Is she very pretty?", userAnswer: "" },
  { id: 3, statement: "They are sure about the project.", interrogative: "Are they sure about the project?", userAnswer: "" },
  { id: 4, statement: "The meeting is in September.", interrogative: "Is the meeting in September?", userAnswer: "" },
  { id: 5, statement: "Those students are British.", interrogative: "Are those students British?", userAnswer: "" },
  { id: 6, statement: "The church is far from here.", interrogative: "Is the church far from here?", userAnswer: "" },
];

// ============================================
// QUESTIONS CARDS - Personal Questions (Lesson 42)
// ============================================
const questionCards = [
  {
    id: 1,
    question: "When is your birthday?",
    answer: "My birthday is on [date].",
    translation: "Quando é o seu aniversário?",
    answerTranslation: "Meu aniversário é dia [data]."
  },
  {
    id: 2,
    question: "How old are you?",
    answer: "I am [number] years old.",
    translation: "Quantos anos você tem?",
    answerTranslation: "Eu tenho [número] anos."
  },
  {
    id: 3,
    question: "How old is your mother / father?",
    answer: "My mother/father is [number] years old.",
    translation: "Quantos anos tem sua mãe / seu pai?",
    answerTranslation: "Minha mãe/meu pai tem [número] anos."
  },
  {
    id: 4,
    question: "Are you Brazilian?",
    answer: "Yes, I am Brazilian. / No, I'm not Brazilian.",
    translation: "Você é brasileiro(a)?",
    answerTranslation: "Sim, sou brasileiro(a). / Não, não sou brasileiro(a)."
  },
  {
    id: 5,
    question: "Is your father / mother an engineer?",
    answer: "Yes, he/she is. / No, he/she isn't.",
    translation: "Seu pai / sua mãe é engenheiro(a)?",
    answerTranslation: "Sim, ele/ela é. / Não, ele/ela não é."
  },
  {
    id: 6,
    question: "Is your English teacher Brazilian?",
    answer: "Yes, my teacher is Brazilian. / No, my teacher is not Brazilian.",
    translation: "Seu professor de inglês é brasileiro?",
    answerTranslation: "Sim, meu professor é brasileiro. / Não, meu professor não é brasileiro."
  },
  {
    id: 7,
    question: "Is your boss kind to you?",
    answer: "Yes, my boss is kind to me. / No, my boss is not kind to me.",
    translation: "Seu chefe é gentil com você?",
    answerTranslation: "Sim, meu chefe é gentil comigo. / Não, meu chefe não é gentil comigo."
  },
  {
    id: 8,
    question: "Are you happy today?",
    answer: "Yes, I am happy today. / No, I am not happy today.",
    translation: "Você está feliz hoje?",
    answerTranslation: "Sim, estou feliz hoje. / Não, não estou feliz hoje."
  },
  {
    id: 9,
    question: "Are your classmates hungry?",
    answer: "Yes, they are hungry. / No, they are not hungry.",
    translation: "Seus colegas de classe estão com fome?",
    answerTranslation: "Sim, eles estão com fome. / Não, eles não estão com fome."
  },
  {
    id: 10,
    question: "Are you ready to go home now?",
    answer: "Yes, I am ready to go home. / No, I am not ready to go home.",
    translation: "Você está pronto para ir para casa agora?",
    answerTranslation: "Sim, estou pronto para ir para casa. / Não, não estou pronto para ir para casa."
  },
];

// ============================================
// TUNE YOUR EARS - Video Section (Small Talk)
// ============================================
const tuneYourEarsVideo = {
  title: "🎬 Small Talk: Starting Conversations in English",
  description: "Watch this video to learn how to start short conversations in different places like the gym, cafe, or government office. Practice your listening skills!",
  youtubeId: "w98U_C_9nVs",
  keyVocabulary: [
    { english: "anywhere", portuguese: "qualquer lugar" },
    { english: "clearly", portuguese: "de forma clara" },
    { english: "key ideas", portuguese: "ideias principais" },
    { english: "short chat", portuguese: "conversa curta" },
    { english: "let's get started", portuguese: "vamos começar" },
    { english: "short", portuguese: "curto" },
    { english: "lovely weather", portuguese: "clima perfeito" },
    { english: "simple way", portuguese: "de forma simples" },
    { english: "interest", portuguese: "interesse" },
    { english: "earlier", portuguese: "mais cedo" },
    { english: "I could use", portuguese: "me cairia muito bem (gíria)" },
    { english: "it expresses", portuguese: "isso mostra" },
    { english: "often", portuguese: "frequentemente" },
    { english: "line", portuguese: "fila" },
    { english: "busy place", portuguese: "lugar cheio/lotado" },
    { english: "government office", portuguese: "escritório do governo" }
  ],
  questions: [
    {
      id: 1,
      question: "What is small talk?",
      correctAnswer: "Small talk is a short, light conversation about everyday topics like weather or interests.",
      vocabulary: [
        { english: "small talk", portuguese: "conversa fiada / conversa curta" },
        { english: "light conversation", portuguese: "conversa leve" },
        { english: "everyday topics", portuguese: "assuntos do dia a dia" }
      ]
    },
    {
      id: 2,
      question: "What kind of places do we start short conversations?",
      correctAnswer: "We can start short conversations at the gym, cafe, government office, bus stop, or any busy place.",
      vocabulary: [
        { english: "gym", portuguese: "academia" },
        { english: "cafe", portuguese: "cafeteria" },
        { english: "government office", portuguese: "escritório do governo" },
        { english: "busy place", portuguese: "lugar cheio/lotado" }
      ]
    },
    {
      id: 3,
      question: "How do you ask if a person's project is working or not?",
      correctAnswer: "You can ask: 'How is your project going?' or 'Is everything on track with your project?'",
      vocabulary: [
        { english: "project", portuguese: "projeto" },
        { english: "going", portuguese: "indo / andando" },
        { english: "on track", portuguese: "no caminho certo" }
      ]
    },
    {
      id: 4,
      question: "How can you say you would really like something and it would be perfect for you?",
      correctAnswer: "You can say: 'I could use a coffee right now.' or 'I could use some help.'",
      vocabulary: [
        { english: "I could use", portuguese: "me cairia muito bem (gíria)" },
        { english: "right now", portuguese: "agora mesmo" },
        { english: "perfect", portuguese: "perfeito" }
      ]
    },
    {
      id: 5,
      question: "How would you start a conversation at the gym or at a cafe?",
      correctAnswer: "At the gym: 'Do you come here often?' or 'This machine is great.' At a cafe: 'Is this seat taken?' or 'What do you recommend here?'",
      vocabulary: [
        { english: "gym", portuguese: "academia" },
        { english: "often", portuguese: "frequentemente" },
        { english: "machine", portuguese: "máquina" },
        { english: "seat taken", portuguese: "lugar ocupado" },
        { english: "recommend", portuguese: "recomendar" }
      ]
    }
  ]
};

// ============================================
// TUNE IN YOUR EARS - Final practice phrases
// ============================================
const tuneInPhrases = [
  { english: "I am tired.", portuguese: "Estou cansado(a)." },
  { english: "She is worried.", portuguese: "Ela está preocupada." },
  { english: "They are busy.", portuguese: "Eles estão ocupados." },
  { english: "Are you ready?", portuguese: "Você está pronto(a)?" },
  { english: "Is he hungry?", portuguese: "Ele está com fome?" },
  { english: "We are not late.", portuguese: "Não estamos atrasados." },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current || new Audio(src);
    if (!audioRef.current) audioRef.current = audio;
    else audio.src = src;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
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
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button 
        onClick={togglePlayPause} 
        className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600 transition`}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600 transition`}
      >
        <RotateCcw size={compact ? 12 : 16} />
      </button>
      
      {!compact && (
        <div 
          ref={progressBarRef}
          className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-blue-500 transition-all duration-200" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const AnswerResult = ({ isCorrect, correctAnswer }: AnswerResultProps) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct! ✓</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Expected:</span> {correctAnswer}
      </span>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL - LESSON 42
// ============================================

export default function Lesson42() {
  const router = useRouter();
  
  // Estados para as respostas do Listen
  const [listenAnswers, setListenAnswers] = useState<Record<string, number | null>>({});
  const [showListenResults, setShowListenResults] = useState<Record<string, boolean>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  
  // Estados para os exercícios de drilling 1
  const [drilling1Sentences, setDrilling1Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de drilling 2
  const [drilling2Sentences, setDrilling2Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de negativo
  const [negativeEx, setNegativeEx] = useState(negativeExercises);
  const [negativeResults, setNegativeResults] = useState<Record<number, boolean>>({});
  const [showNegativeResults, setShowNegativeResults] = useState<Record<number, boolean>>({});
  
  // Estados para os exercícios de afirmativo
  const [affirmativeEx, setAffirmativeEx] = useState(affirmativeExercises);
  const [affirmativeResults, setAffirmativeResults] = useState<Record<number, boolean>>({});
  const [showAffirmativeResults, setShowAffirmativeResults] = useState<Record<number, boolean>>({});
  
  // Estados para os exercícios de interrogativo
  const [interrogativeEx, setInterrogativeEx] = useState(interrogativeExercises);
  const [interrogativeResults, setInterrogativeResults] = useState<Record<number, boolean>>({});
  const [showInterrogativeResults, setShowInterrogativeResults] = useState<Record<number, boolean>>({});
  
  // Estado para o Questions section
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [questionsUserAnswer, setQuestionsUserAnswer] = useState("");
  const [showQuestionsResult, setShowQuestionsResult] = useState(false);
  const [questionsResult, setQuestionsResult] = useState(false);
  
  // Estado para o Tune Your Ears video answers
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  const [videoResults, setVideoResults] = useState<Record<string, boolean>>({});
  
  // Estado para o Tune in Your Ears (phrases)
  const [tuneInUserAnswer, setTuneInUserAnswer] = useState("");
  const [showTuneInResult, setShowTuneInResult] = useState(false);
  const [currentTuneInIndex, setCurrentTuneInIndex] = useState(0);
  
  // Estados para controle de expansão das seções
  const [sections, setSections] = useState({
    listen: true,
    drilling1: true,
    negative: true,
    drilling2: true,
    affirmative: true,
    interrogative: true,
    questions: true,
    tuneYourEars: true,
    tuneIn: true
  });

  // Estado para armazenar a sequência de números que o aluno selecionou (ordem das imagens)
  const [imageSequence, setImageSequence] = useState<number[]>([]);
  const [showFinalSequenceResult, setShowFinalSequenceResult] = useState(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState(false);
  
  // Estado para armazenar a lista de itens embaralhados (inicializado no cliente)
  const [shuffledListenItems, setShuffledListenItems] = useState(listenItemsOriginal);
  const [isHydrated, setIsHydrated] = useState(false);

  // Embaralhar as imagens para exibição APENAS no cliente para evitar erro de hidratação
  useEffect(() => {
    setShuffledListenItems(shuffleArray(listenItemsOriginal));
    setIsHydrated(true);
  }, []);

  // ==============================
  // PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson42Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        if (data.listenAnswers) setListenAnswers(data.listenAnswers);
        if (data.showListenResults) setShowListenResults(data.showListenResults);
        if (data.listenResults) setListenResults(data.listenResults);
        if (data.drilling1Sentences) setDrilling1Sentences(data.drilling1Sentences);
        if (data.drilling2Sentences) setDrilling2Sentences(data.drilling2Sentences);
        if (data.negativeEx) setNegativeEx(data.negativeEx);
        if (data.negativeResults) setNegativeResults(data.negativeResults);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.affirmativeEx) setAffirmativeEx(data.affirmativeEx);
        if (data.affirmativeResults) setAffirmativeResults(data.affirmativeResults);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.interrogativeEx) setInterrogativeEx(data.interrogativeEx);
        if (data.interrogativeResults) setInterrogativeResults(data.interrogativeResults);
        if (data.showInterrogativeResults) setShowInterrogativeResults(data.showInterrogativeResults);
        if (data.currentCardIndex !== undefined) setCurrentCardIndex(data.currentCardIndex);
        if (data.questionsUserAnswer) setQuestionsUserAnswer(data.questionsUserAnswer);
        if (data.showQuestionsResult !== undefined) setShowQuestionsResult(data.showQuestionsResult);
        if (data.questionsResult !== undefined) setQuestionsResult(data.questionsResult);
        if (data.sections) setSections(data.sections);
        if (data.imageSequence) setImageSequence(data.imageSequence);
        if (data.currentTuneInIndex !== undefined) setCurrentTuneInIndex(data.currentTuneInIndex);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
        
        console.log("Dados carregados do localStorage para Lesson 42");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // ==============================
  // PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = async () => {
    const data = {
      listenAnswers,
      showListenResults,
      listenResults,
      drilling1Sentences,
      drilling2Sentences,
      negativeEx,
      negativeResults,
      showNegativeResults,
      affirmativeEx,
      affirmativeResults,
      showAffirmativeResults,
      interrogativeEx,
      interrogativeResults,
      showInterrogativeResults,
      currentCardIndex,
      questionsUserAnswer,
      showQuestionsResult,
      questionsResult,
      sections,
      imageSequence,
      currentTuneInIndex,
      videoAnswers,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 42 - Health, Feelings & Professions",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson42Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas?")) {
      setListenAnswers({});
      setShowListenResults({});
      setListenResults({});
      setDrilling1Sentences(Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english])));
      setDrilling2Sentences(Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english])));
      setNegativeEx(negativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setNegativeResults({});
      setShowNegativeResults({});
      setAffirmativeEx(affirmativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setAffirmativeResults({});
      setShowAffirmativeResults({});
      setInterrogativeEx(interrogativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setInterrogativeResults({});
      setShowInterrogativeResults({});
      setCurrentCardIndex(0);
      setQuestionsUserAnswer("");
      setShowQuestionsResult(false);
      setQuestionsResult(false);
      setImageSequence([]);
      setShowFinalSequenceResult(false);
      setCurrentTuneInIndex(0);
      setTuneInUserAnswer("");
      setShowTuneInResult(false);
      setVideoAnswers({});
      setShowVideoResults({});
      setVideoResults({});
      localStorage.removeItem("lesson42Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================
  
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Função para adicionar número à sequência (quando o aluno clica na imagem)
  const handleImageClickForSequence = (correctNumber: number) => {
    if (imageSequence.includes(correctNumber)) {
      alert(`⚠️ O número ${correctNumber} já foi adicionado à sua sequência! Escolha uma imagem diferente.`);
      return;
    }
    
    setImageSequence(prev => [...prev, correctNumber]);
    setShowFinalSequenceResult(false);
  };

  // Função para resetar a sequência
  const resetSequence = () => {
    setImageSequence([]);
    setShowFinalSequenceResult(false);
    setIsSequenceCorrect(false);
  };

  // Função para verificar se a sequência está correta (1,2,3)
  const checkSequence = () => {
    const correctSequence = [1, 2, 3];
    
    if (imageSequence.length !== 3) {
      alert(`⚠️ Você precisa selecionar as 3 imagens na ordem correta! Você selecionou ${imageSequence.length} imagem(ns).`);
      return;
    }
    
    let isCorrect = true;
    for (let i = 0; i < 3; i++) {
      if (imageSequence[i] !== correctSequence[i]) {
        isCorrect = false;
        break;
      }
    }
    
    setIsSequenceCorrect(isCorrect);
    setShowFinalSequenceResult(true);
  };

  // Listen functions
  const handleListenSelect = (key: string, number: number) => {
    setListenAnswers(prev => ({ ...prev, [key]: number }));
    setShowListenResults(prev => ({ ...prev, [key]: false }));
  };

  const handleListenCheck = (key: string, correctNumber: number) => {
    const isCorrect = listenAnswers[key] === correctNumber;
    setListenResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowListenResults(prev => ({ ...prev, [key]: true }));
  };

  // Negative functions
  const handleNegativeChange = (id: number, value: string) => {
    setNegativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowNegativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleNegativeCheck = (id: number, correctNegative: string) => {
    const exercise = negativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctNegative.toLowerCase().trim();
      setNegativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowNegativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // Affirmative functions
  const handleAffirmativeChange = (id: number, value: string) => {
    setAffirmativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowAffirmativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleAffirmativeCheck = (id: number, correctAffirmative: string) => {
    const exercise = affirmativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctAffirmative.toLowerCase().trim();
      setAffirmativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowAffirmativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // Interrogative functions
  const handleInterrogativeChange = (id: number, value: string) => {
    setInterrogativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowInterrogativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleInterrogativeCheck = (id: number, correctInterrogative: string) => {
    const exercise = interrogativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctInterrogative.toLowerCase().trim();
      setInterrogativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowInterrogativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // Questions functions
  const handleQuestionsCheck = () => {
    const currentCard = questionCards[currentCardIndex];
    const userLower = questionsUserAnswer.toLowerCase().trim();
    
    const isCorrect = (currentCard.id === 1 && userLower.includes("birthday")) ||
                     (currentCard.id === 2 && (userLower.includes("years old") || userLower.match(/\d+/))) ||
                     (currentCard.id === 3 && (userLower.includes("years old") || userLower.match(/\d+/))) ||
                     (currentCard.id === 4 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 5 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 6 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 7 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 8 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 9 && (userLower.includes("yes") || userLower.includes("no"))) ||
                     (currentCard.id === 10 && (userLower.includes("yes") || userLower.includes("no")));
    
    setQuestionsResult(isCorrect);
    setShowQuestionsResult(true);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % questionCards.length);
    setQuestionsUserAnswer("");
    setShowQuestionsResult(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + questionCards.length) % questionCards.length);
    setQuestionsUserAnswer("");
    setShowQuestionsResult(false);
  };

  const currentCard = questionCards[currentCardIndex];

  // Video answer functions
  const handleVideoAnswerChange = (questionId: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: false }));
  };

  const checkVideoAnswer = (questionId: number, userAnswer: string, correctAnswer: string) => {
    const isCorrect = userAnswer.toLowerCase().trim().includes(correctAnswer.toLowerCase().replace(/[.,!?]/g, '').split(' ').slice(0, 5).join(' ')) ||
                      (userAnswer.length > 20 && correctAnswer.toLowerCase().split(' ').some(word => userAnswer.toLowerCase().includes(word)));
    setVideoResults(prev => ({ ...prev, [`video-${questionId}`]: isCorrect }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: true }));
  };

  const clearVideoAnswer = (questionId: number) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: "" }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: false }));
  };

  // Tune In functions
  const handleTuneInCheck = () => {
    const currentPhrase = tuneInPhrases[currentTuneInIndex];
    const isCorrect = tuneInUserAnswer.toLowerCase().trim() === currentPhrase.english.toLowerCase();
    setShowTuneInResult(true);
    setTimeout(() => {
      if (isCorrect && currentTuneInIndex < tuneInPhrases.length - 1) {
        setCurrentTuneInIndex(prev => prev + 1);
        setTuneInUserAnswer("");
        setShowTuneInResult(false);
      }
    }, 1500);
  };

  const nextTuneInPhrase = () => {
    if (currentTuneInIndex < tuneInPhrases.length - 1) {
      setCurrentTuneInIndex(prev => prev + 1);
      setTuneInUserAnswer("");
      setShowTuneInResult(false);
    }
  };

  const prevTuneInPhrase = () => {
    if (currentTuneInIndex > 0) {
      setCurrentTuneInIndex(prev => prev - 1);
      setTuneInUserAnswer("");
      setShowTuneInResult(false);
    }
  };

  // Se não estiver hidratado ainda, renderiza um placeholder ou nada
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/background.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 42</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🏥 HEALTH, FEELINGS & PROFESSIONS
          </p>
          <p className="text-md text-gray-500 mt-2">Talk to your friends about health, feelings, work, and appointments!</p>
        </div>

        {/* DIALOGUE SECTION */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">💬 DIALOGUE</h2>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-5 rounded-xl border border-indigo-200">
                <p className="font-bold text-indigo-700 mb-2">Peter:</p>
                <p className="text-gray-700">Hey, Donna, what&apos;s up?</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">I&apos;m tired and I still have to read these projects for next week.</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Peter:</p>
                <p className="text-gray-700">Next week? That&apos;s a lot of work. Are you worried?</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">Yes, I am. I have to work extra hours until I finish it. What about you? Are you busy, too?</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-indigo-200">
                <p className="font-bold text-indigo-700 mb-2">Peter:</p>
                <p className="text-gray-700">Yes, I am, but I&apos;m happy because I have a business lunch with Pam Wilson and Justin Davis tomorrow.</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">Who are they?</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Peter:</p>
                <p className="text-gray-700">They work at an office abroad and they want to talk about the projects for next year and the deadlines.</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">I see. Do they speak English?</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Peter:</p>
                <p className="text-gray-700">Yes, they speak English very well.</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">Good for you! Hey, Peter, I don&apos;t have a lot of time for lunch, but do you want to grab a bite to eat?</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Peter:</p>
                <p className="text-gray-700">Sure! Good idea.</p>
                <p className="font-bold text-indigo-700 mt-3 mb-2">Donna:</p>
                <p className="text-gray-700">Let&apos;s go.</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
              <AudioPlayer src="/audios/lesson42-dialogue.mp3" compact={false} />
              <p className="text-xs text-indigo-600 mt-2">🎧 Listen to the dialogue and practice with a partner</p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* LISTEN AND NUMBER - Imagens 1, 2, 3 (EMBARALHADAS) */}
        {/* ============================================ */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
              <button onClick={() => toggleSection('listen')} className="ml-4 p-2 rounded-full hover:bg-purple-700 transition">
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listen && (
            <div className="p-8">
              <p className="text-purple-700 mb-4 italic">
                👂 The images below are <strong className="font-bold">SHUFFLED</strong>. 
                Click on the images <strong className="font-bold">IN THE ORDER YOU HEAR</strong> (1 → 2 → 3).
              </p>
              
              <p className="text-sm text-purple-600 mb-6 bg-purple-100 p-3 rounded-lg">
                🎯 <strong>Correct sequence to find:</strong> 1. pessoas sentadas em grupo conversando → 2. pessoas tomando café ao fundo → 3. estudantes trabalhando em círculo
              </p>

              {/* Imagens embaralhadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {shuffledListenItems.map((item) => (
                  <div 
                    key={item.key} 
                    className="bg-white rounded-xl shadow-md border-2 border-purple-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
                    onClick={() => handleImageClickForSequence(item.correctNumber)}
                  >
                    <div className="relative h-64 w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'text-center p-4';
                            fallback.innerHTML = `
                              <div class="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <span class="text-5xl">${item.placeholder}</span>
                              </div>
                              <p class="text-sm text-gray-600">${item.label}</p>
                              <p class="text-xs text-gray-400 mt-1">${item.description}</p>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    
                    <div className="p-4 text-center">
                      <p className="text-md font-bold text-purple-700">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to add to sequence</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exibição da sequência */}
              <div className="bg-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-purple-800 mb-3">📋 Sua sequência (ordem que você clicou):</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {imageSequence.length === 0 ? (
                    <span className="text-gray-500 italic">Nenhuma imagem selecionada ainda</span>
                  ) : (
                    imageSequence.map((num, idx) => {
                      const item = listenItemsOriginal.find(i => i.correctNumber === num);
                      return (
                        <span key={idx} className="bg-white px-4 py-2 rounded-full shadow-sm border border-purple-300">
                          <span className="font-bold text-purple-700">{idx + 1}º:</span> {item?.label}
                        </span>
                      );
                    })
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={checkSequence}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    ✓ Verificar Sequência Completa
                  </button>
                  <button
                    onClick={resetSequence}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    🔄 Resetar Sequência
                  </button>
                </div>

                {showFinalSequenceResult && (
                  <div className={`mt-4 p-3 rounded-lg ${isSequenceCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {isSequenceCorrect ? (
                      <div className="flex items-center gap-2">
                        <Check size={24} />
                        <span className="font-bold">✅ PARABÉNS! Você acertou a sequência correta!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle size={24} />
                        <span className="font-bold">❌ Sequência errada! A ordem correta é: 1 → 2 → 3</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE I - Substitution */}
        {/* ============================================ */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice I</h2>
              <button onClick={() => toggleSection('drilling1')} className="ml-4 p-2 rounded-full hover:bg-blue-700 transition">
                {sections.drilling1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling1 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises1.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-blue-200 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">🇵🇹 Portuguese:</p>
                    <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                    <p className="text-sm text-gray-500 mb-1">🇺🇸 English:</p>
                    <p className="text-lg font-bold text-blue-700 mb-4">{drilling1Sentences[exercise.id]}</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: sub.phrase }))}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                        >
                          {sub.word}
                        </button>
                      ))}
                      <button
                        onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: exercise.english }))}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO NEGATIVE */}
        {/* ============================================ */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Negative</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-red-700 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {negativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-red-200 shadow-md">
                    <p className="text-md font-medium text-gray-700 mb-2">Affirmative:</p>
                    <p className="text-lg font-bold text-gray-900 mb-4">{exercise.affirmative}</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleNegativeChange(exercise.id, e.target.value)}
                      placeholder="Write the negative form here..."
                      className="w-full h-20 p-3 border border-red-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleNegativeCheck(exercise.id, exercise.negative)} className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">Check</button>
                      <button onClick={() => handleNegativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showNegativeResults[exercise.id] && <AnswerResult isCorrect={negativeResults[exercise.id] || false} correctAnswer={exercise.negative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE II - Substitution */}
        {/* ============================================ */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice II</h2>
              <button onClick={() => toggleSection('drilling2')} className="ml-4 p-2 rounded-full hover:bg-green-700 transition">
                {sections.drilling2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling2 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises2.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-green-200 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">🇵🇹 Portuguese:</p>
                    <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                    <p className="text-sm text-gray-500 mb-1">🇺🇸 English:</p>
                    <p className="text-lg font-bold text-green-700 mb-4">{drilling2Sentences[exercise.id]}</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDrilling2Sentences(prev => ({ ...prev, [exercise.id]: sub.phrase }))}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition"
                        >
                          {sub.word}
                        </button>
                      ))}
                      <button onClick={() => setDrilling2Sentences(prev => ({ ...prev, [exercise.id]: exercise.english }))} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition">Reset</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO AFFIRMATIVE */}
        {/* ============================================ */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Affirmative</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-yellow-700 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {affirmativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-yellow-200 shadow-md">
                    <p className="text-md font-medium text-gray-700 mb-2">Negative:</p>
                    <p className="text-lg font-bold text-gray-900 mb-4">{exercise.negative}</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)}
                      placeholder="Write the affirmative form here..."
                      className="w-full h-20 p-3 border border-yellow-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleAffirmativeCheck(exercise.id, exercise.affirmative)} className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition">Check</button>
                      <button onClick={() => handleAffirmativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showAffirmativeResults[exercise.id] && <AnswerResult isCorrect={affirmativeResults[exercise.id] || false} correctAnswer={exercise.affirmative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO INTERROGATIVE */}
        {/* ============================================ */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Change into Interrogative</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-pink-700 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interrogativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-pink-200 shadow-md">
                    <p className="text-md font-medium text-gray-700 mb-2">Statement:</p>
                    <p className="text-lg font-bold text-gray-900 mb-4">{exercise.statement}</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleInterrogativeChange(exercise.id, e.target.value)}
                      placeholder="Write the interrogative form here..."
                      className="w-full h-20 p-3 border border-pink-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleInterrogativeCheck(exercise.id, exercise.interrogative)} className="flex-1 bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition">Check</button>
                      <button onClick={() => handleInterrogativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showInterrogativeResults[exercise.id] && <AnswerResult isCorrect={interrogativeResults[exercise.id] || false} correctAnswer={exercise.interrogative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* QUESTIONS */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ QUESTIONS</h2>
              <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"><ChevronLeft size={24} /></button>
                  <span className="text-sm text-teal-600">Question {currentCardIndex + 1} of {questionCards.length}</span>
                  <button onClick={nextCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"><ChevronRight size={24} /></button>
                </div>
                
                <div className="mb-6 p-4 bg-teal-100 rounded-lg">
                  <p className="text-sm text-teal-700 mb-1">Question:</p>
                  <p className="text-xl font-bold text-teal-800">{currentCard.question}</p>
                  <p className="text-sm text-teal-600 mt-1">{currentCard.translation}</p>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">Example answer:</p>
                  <p className="text-lg text-gray-800 italic">{currentCard.answer}</p>
                  <p className="text-xs text-gray-500 mt-1">{currentCard.answerTranslation}</p>
                </div>
                
                <textarea
                  value={questionsUserAnswer}
                  onChange={(e) => setQuestionsUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-24 p-4 border border-teal-300 rounded-md resize-none mb-4"
                />
                
                <div className="flex gap-3">
                  <button onClick={handleQuestionsCheck} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition font-medium">Check Answer</button>
                  <button onClick={() => { setQuestionsUserAnswer(""); setShowQuestionsResult(false); }} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md transition">Clear</button>
                </div>
                
                {showQuestionsResult && <div className="mt-4"><AnswerResult isCorrect={questionsResult} correctAnswer={currentCard.answer} /></div>}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE YOUR EARS (VIDEO SECTION) */}
        {/* ============================================ */}
        <div className="mb-10 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🎧 TUNE YOUR EARS
            </h2>
            <button 
              onClick={() => toggleSection('tuneYourEars')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {sections.tuneYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {sections.tuneYourEars && (
            <div className="p-8">
              {/* Key Vocabulary Section */}
              <div className="mb-8 bg-white rounded-xl p-6 shadow-md border border-cyan-200">
                <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 📚 KEY VOCABULARY FROM THE VIDEO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tuneYourEarsVideo.keyVocabulary.map((vocab, idx) => (
                    <div key={idx} className="bg-cyan-50 p-2 rounded-lg border border-cyan-200">
                      <p className="font-bold text-cyan-800 text-sm">{vocab.english}</p>
                      <p className="text-xs text-cyan-600">{vocab.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Player */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneYourEarsVideo.title}
                </h3>
                <p className="text-cyan-600 mb-6">{tuneYourEarsVideo.description}</p>
                
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneYourEarsVideo.youtubeId}`}
                      title={tuneYourEarsVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Questions from the video */}
              <div className="space-y-8">
                {tuneYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md"
                       style={{ borderColor: "#06b6d430" }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: "#06b6d4" }}>
                      Question {q.id}: {q.question}
                    </h4>
                    
                    {q.vocabulary && (
                      <div className="mb-4 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                        <p className="text-sm font-medium text-cyan-600 mb-2 flex items-center gap-2">
                          <Volume2 size={16} /> Vocabulary hints:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded">
                              <span className="text-cyan-700 font-medium">{word.english}</span>
                              <span className="text-cyan-600">→ {word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer based on what you heard..."
                      className="w-full h-32 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none transition resize-none"
                      style={{ borderColor: "#06b6d430" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#06b6d4";
                        e.currentTarget.style.boxShadow = "0 0 0 2px #06b6d420";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#06b6d430";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="text-white px-6 py-2 rounded-lg transition font-medium hover:opacity-90"
                        style={{ backgroundColor: "#06b6d4" }}
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => clearVideoAnswer(q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition font-medium"
                      >
                        Clear
                      </button>
                    </div>

                    {showVideoResults[`video-${q.id}`] && (
                      <div className="mt-4">
                        <AnswerResult 
                          isCorrect={videoResults[`video-${q.id}`] || false} 
                          correctAnswer={q.correctAnswer}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 🎯 Listening Tips:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-cyan-700">
                  <li>Listen first without looking at the questions</li>
                  <li>Watch a second time while reading the questions</li>
                  <li>Pay attention to keywords and main ideas</li>
                  <li>Don't worry if you don't understand every word</li>
                  <li>You can watch multiple times if needed</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE IN YOUR EARS - Phrases Practice */}
        {/* ============================================ */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS - PHRASES</h2>
              <button onClick={() => toggleSection('tuneIn')} className="ml-4 p-2 rounded-full hover:bg-cyan-700 transition">
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <p className="text-cyan-700 mb-4">🔊 Listen and repeat aloud. Practice your pronunciation!</p>
              
              <div className="bg-white p-6 rounded-xl border-2 border-cyan-200">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevTuneInPhrase} className="p-2 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition" disabled={currentTuneInIndex === 0}>
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-sm text-cyan-600">Phrase {currentTuneInIndex + 1} of {tuneInPhrases.length}</span>
                  <button onClick={nextTuneInPhrase} className="p-2 bg-cyan-100 text-cyan-700 rounded-full hover:bg-cyan-200 transition" disabled={currentTuneInIndex === tuneInPhrases.length - 1}>
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-cyan-100 rounded-lg text-center">
                  <p className="text-sm text-cyan-700 mb-1">Portuguese:</p>
                  <p className="text-xl text-gray-800">{tuneInPhrases[currentTuneInIndex].portuguese}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-700 mb-2">Type the English translation:</p>
                  <textarea
                    value={tuneInUserAnswer}
                    onChange={(e) => setTuneInUserAnswer(e.target.value)}
                    placeholder="Write the English phrase here..."
                    className="w-full h-20 p-3 border border-cyan-300 rounded-md resize-none mb-3"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={handleTuneInCheck} className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-3 rounded-md transition font-medium">Check</button>
                  <button onClick={() => { setTuneInUserAnswer(""); setShowTuneInResult(false); }} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md transition">Clear</button>
                </div>

                {showTuneInResult && (
                  <div className="mt-4">
                    <AnswerResult 
                      isCorrect={tuneInUserAnswer.toLowerCase().trim() === tuneInPhrases[currentTuneInIndex].english.toLowerCase()} 
                      correctAnswer={tuneInPhrases[currentTuneInIndex].english} 
                    />
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-cyan-100 rounded-lg">
                <AudioPlayer src="/audios/lesson42-tunein.mp3" compact={false} />
                <p className="text-xs text-cyan-600 mt-2">🎧 Listen to the correct pronunciation</p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* LESSON SUMMARY */}
        {/* ============================================ */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="text-white py-4 px-8">
            <h2 className="text-2xl font-bold">✅ LESSON SUMMARY</h2>
          </div>
          <div className="p-8 bg-white rounded-b-[30px]">
            <p className="font-bold text-gray-800 mb-3">You practiced:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Substitution Practice</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Negative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Affirmative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Interrogative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Personal Questions</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Listening & Speaking</span>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">💡 <strong>Tip:</strong> Practice as if it were a real conversation — with emotion and natural speed!</p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SAVE BUTTONS AND NAVIGATION */}
        {/* ============================================ */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2">
              <span>💾</span> Save All My Answers
            </button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300">
              Clear All
            </button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              &larr; Back to Courses
            </button>
            <button onClick={() => router.push("/cursos/lesson43")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}