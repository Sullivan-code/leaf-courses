"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// LISTEN ITEMS - Imagem 1, 2, 3 (EMBARALHADAS NA TELA, MAS ORDEM CORRETA É 1,2,3)
// ============================================
const listenItemsOriginal = [
  { 
    key: "image1", 
    label: "1. refletindo sobre a vida", 
    image: "/images/1. refletindo sobre a vida.jpg",
    placeholder: "🤔",
    description: "refletindo sobre a vida",
    correctNumber: 1
  },
  { 
    key: "image2", 
    label: "2. casal assistindo tv juntos", 
    image: "/images/2. casal assistindo tv juntos.jpg",
    placeholder: "👫📺",
    description: "casal assistindo tv juntos",
    correctNumber: 2
  },
  { 
    key: "image3", 
    label: "3. mulher sorrindo", 
    image: "/images/3. mulher sorrindo.jpg",
    placeholder: "😊",
    description: "mulher sorrindo",
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
// DRILLING PRACTICE I - Substitution Practice
// ============================================
const drillingExercises1 = [
  {
    id: 1,
    portuguese: "Ele escreve coisas engraçadas.",
    english: "He writes funny things.",
    substitutions: [
      { word: "interessantes", english: "interesting", phrase: "He writes interesting things." },
      { word: "importantes", english: "important", phrase: "He writes important things." }
    ]
  },
  {
    id: 2,
    portuguese: "Eu acho que é importante estudar inglês.",
    english: "I think it's important to study English.",
    substitutions: [
      { word: "aprender", english: "to learn", phrase: "I think it's important to learn English." },
      { word: "falar", english: "to speak", phrase: "I think it's important to speak English." }
    ]
  },
  {
    id: 3,
    portuguese: "Você acha que é engraçado?",
    english: "Do you think it's funny?",
    substitutions: [
      { word: "difícil", english: "difficult", phrase: "Do you think it's difficult?" },
      { word: "fácil", english: "easy", phrase: "Do you think it's easy?" }
    ]
  },
  {
    id: 4,
    portuguese: "Elas geralmente não escrevem e-mails.",
    english: "They usually don't write emails.",
    substitutions: [
      { word: "redações", english: "essays", phrase: "They usually don't write essays." },
      { word: "relatórios", english: "reports", phrase: "They usually don't write reports." }
    ]
  },
  {
    id: 5,
    portuguese: "Vamos para a escola juntos?",
    english: "Shall we go to school together?",
    substitutions: [
      { word: "ao trabalho", english: "to work", phrase: "Shall we go to work together?" },
      { word: "ao shopping", english: "to the mall", phrase: "Shall we go to the mall together?" }
    ]
  },
  {
    id: 6,
    portuguese: "Por que você precisa ir?",
    english: "Why do you need to go?",
    substitutions: [
      { word: "ficar", english: "to stay", phrase: "Why do you need to stay?" },
      { word: "vir", english: "to come", phrase: "Why do you need to come?" }
    ]
  }
];

// ============================================
// NEGATIVE EXERCISES - Change into Negative
// ============================================
const negativeExercises = [
  { id: 1, affirmative: "I think it's hard.", negative: "I don't think it's hard.", userAnswer: "" },
  { id: 2, affirmative: "They study together.", negative: "They don't study together.", userAnswer: "" },
  { id: 3, affirmative: "We need to write a story.", negative: "We don't need to write a story.", userAnswer: "" },
  { id: 4, affirmative: "Taylor has great ideas.", negative: "Taylor doesn't have great ideas.", userAnswer: "" },
  { id: 5, affirmative: "He goes to the office on Thursdays.", negative: "He doesn't go to the office on Thursdays.", userAnswer: "" },
  { id: 6, affirmative: "She meets everybody on weekends.", negative: "She doesn't meet everybody on weekends.", userAnswer: "" },
];

// ============================================
// DRILLING PRACTICE II - Substitution Practice
// ============================================
const drillingExercises2 = [
  {
    id: 1,
    english: "How do you say 'casa' in German?",
    substitutions: [
      { word: "italiano", phrase: "How do you say 'casa' in Italian?" },
      { word: "espanhol", phrase: "How do you say 'casa' in Spanish?" }
    ]
  },
  {
    id: 2,
    english: "What does this word mean?",
    substitutions: [
      { word: "stuff", phrase: "What does 'stuff' mean?" },
      { word: "deadline", phrase: "What does 'deadline' mean?" }
    ]
  },
  {
    id: 3,
    english: "We don't have an opinion about this.",
    substitutions: [
      { word: "Eles", phrase: "They don't have an opinion about this." },
      { word: "Ela", phrase: "She doesn't have an opinion about this." }
    ]
  },
  {
    id: 4,
    english: "What do you think about that movie?",
    substitutions: [
      { word: "vídeo", phrase: "What do you think about that video?" },
      { word: "livro", phrase: "What do you think about that book?" }
    ]
  },
  {
    id: 5,
    english: "I think it's boring.",
    substitutions: [
      { word: "engraçado", phrase: "I think it's funny." },
      { word: "interessante", phrase: "I think it's interesting." }
    ]
  },
  {
    id: 6,
    english: "I need to go because it's late.",
    substitutions: [
      { word: "Ele", phrase: "He needs to go because it's late." },
      { word: "Ela", phrase: "She needs to go because it's late." }
    ]
  }
];

// ============================================
// AFFIRMATIVE EXERCISES - Change into Affirmative
// ============================================
const affirmativeExercises = [
  { id: 1, affirmative: "We need to talk about the problem.", negative: "We don't need to talk about the problem.", userAnswer: "" },
  { id: 2, affirmative: "I like to start new projects.", negative: "I don't like to start new projects.", userAnswer: "" },
  { id: 3, affirmative: "They know everything.", negative: "They don't know everything.", userAnswer: "" },
  { id: 4, affirmative: "You go to college with your neighbor.", negative: "You don't go to college with your neighbor.", userAnswer: "" },
  { id: 5, affirmative: "He talks to everybody.", negative: "He doesn't talk to everybody.", userAnswer: "" },
  { id: 6, affirmative: "She studies with her brother.", negative: "She doesn't study with her brother.", userAnswer: "" },
];

// ============================================
// INTERROGATIVE EXERCISES - Change into Interrogative
// ============================================
const interrogativeExercises = [
  { id: 1, statement: "You need to write a message to your friends.", interrogative: "Do you need to write a message to your friends?", userAnswer: "" },
  { id: 2, statement: "They want to start a new course.", interrogative: "Do they want to start a new course?", userAnswer: "" },
  { id: 3, statement: "He knows that person.", interrogative: "Does he know that person?", userAnswer: "" },
  { id: 4, statement: "She talks about sports and music.", interrogative: "Does she talk about sports and music?", userAnswer: "" },
  { id: 5, statement: "You need to write a composition.", interrogative: "Do you need to write a composition?", userAnswer: "" },
  { id: 6, statement: "We have an exam today.", interrogative: "Do we have an exam today?", userAnswer: "" },
];

// ============================================
// SPEAK RIGHT NOW CARDS - Questions
// ============================================
const speakCards = [
  { 
    id: 1, 
    question: "Why do you study English?", 
    answer: "I study English because I need it for my career.",
    translation: "Por que você estuda inglês?",
    answerTranslation: "Eu estudo inglês porque preciso para minha carreira."
  },
  { 
    id: 2, 
    question: "Do you think it's easy to learn this language?", 
    answer: "No, I don't think it's easy, but it's possible.",
    translation: "Você acha que é fácil aprender este idioma?",
    answerTranslation: "Não, não acho que seja fácil, mas é possível."
  },
  { 
    id: 3, 
    question: "What's the meaning of 'early'?", 
    answer: "Early means 'cedo' or 'antecipado' in Portuguese.",
    translation: "Qual é o significado de 'early'?",
    answerTranslation: "Early significa 'cedo' ou 'antecipado' em português."
  },
  { 
    id: 4, 
    question: "How do you say 'faculdade' in English?", 
    answer: "You say 'college' or 'university'.",
    translation: "Como se diz 'faculdade' em inglês?",
    answerTranslation: "Você diz 'college' ou 'university'."
  },
  { 
    id: 5, 
    question: "Do you usually have to write a lot of emails at work every day?", 
    answer: "Yes, I write many emails every day.",
    translation: "Você geralmente tem que escrever muitos e-mails no trabalho todos os dias?",
    answerTranslation: "Sim, eu escrevo muitos e-mails todos os dias."
  },
  { 
    id: 6, 
    question: "How many books do you read every year?", 
    answer: "I read about ten books every year.",
    translation: "Quantos livros você lê por ano?",
    answerTranslation: "Eu leio cerca de dez livros por ano."
  },
  { 
    id: 7, 
    question: "Do you have to go to a meeting today?", 
    answer: "Yes, I have a meeting at 3 PM.",
    translation: "Você tem que ir a uma reunião hoje?",
    answerTranslation: "Sim, tenho uma reunião às 15h."
  },
  { 
    id: 8, 
    question: "Do you like to watch movies on weekends?", 
    answer: "Yes, I love watching movies on weekends.",
    translation: "Você gosta de assistir filmes nos fins de semana?",
    answerTranslation: "Sim, adoro assistir filmes nos fins de semana."
  },
  { 
    id: 9, 
    question: "Do you think it's important to learn about science and politics?", 
    answer: "Yes, I think it's very important.",
    translation: "Você acha importante aprender sobre ciência e política?",
    answerTranslation: "Sim, acho muito importante."
  },
  { 
    id: 10, 
    question: "Why do you have to study Portuguese today?", 
    answer: "I have to study Portuguese because I have a test tomorrow.",
    translation: "Por que você tem que estudar português hoje?",
    answerTranslation: "Tenho que estudar português porque tenho uma prova amanhã."
  },
];

// ============================================
// THERE AND AROUND - Useful Phrases
// ============================================
const usefulPhrases = [
  { english: "How can I find out more about the course?", portuguese: "Como eu faço para saber mais sobre o curso?" },
  { english: "Take this brochure.", portuguese: "Leve este panfleto." },
  { english: "Take your time.", portuguese: "Leve o tempo que precisar." },
  { english: "It sounds great!", portuguese: "Parece ótimo!" },
  { english: "What do I need to do to enroll?", portuguese: "O que eu preciso fazer para me matricular?" },
  { english: "You can do it online.", portuguese: "Você pode fazer isso pela internet." },
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
        className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600`}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600`}
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
// COMPONENTE PRINCIPAL - LESSON 36
// ============================================

export default function Lesson36() {
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
  
  // Estado para o Speak Right Now
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakUserAnswer, setSpeakUserAnswer] = useState("");
  const [showSpeakResult, setShowSpeakResult] = useState(false);
  const [speakResult, setSpeakResult] = useState(false);
  
  // Estados para controle de expansão das seções
  const [sections, setSections] = useState({
    listen: true,
    drilling1: true,
    negative: true,
    drilling2: true,
    affirmative: true,
    interrogative: true,
    speak: true,
    usefulPhrases: true
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
    const savedAnswers = localStorage.getItem("lesson36Answers");
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
        if (data.speakUserAnswer) setSpeakUserAnswer(data.speakUserAnswer);
        if (data.showSpeakResult !== undefined) setShowSpeakResult(data.showSpeakResult);
        if (data.speakResult !== undefined) setSpeakResult(data.speakResult);
        if (data.sections) setSections(data.sections);
        if (data.imageSequence) setImageSequence(data.imageSequence);
        
        console.log("Dados carregados do localStorage para Lesson 36");
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
      speakUserAnswer,
      showSpeakResult,
      speakResult,
      sections,
      imageSequence,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 36 - Listen, Number, and Role-play",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson36Answers", JSON.stringify(data));
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
      setSpeakUserAnswer("");
      setShowSpeakResult(false);
      setSpeakResult(false);
      setImageSequence([]);
      setShowFinalSequenceResult(false);
      localStorage.removeItem("lesson36Answers");
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
    // Verifica se o número já foi adicionado à sequência
    if (imageSequence.includes(correctNumber)) {
      alert(`⚠️ O número ${correctNumber} já foi adicionado à sua sequência! Escolha uma imagem diferente.`);
      return;
    }
    
    // Adiciona o número à sequência
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

  // Listen functions (para os números individuais de cada imagem)
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

  // Speak functions
  const handleSpeakCheck = () => {
    const currentCard = speakCards[currentCardIndex];
    const isCorrect = speakUserAnswer.toLowerCase().includes(currentCard.answer.toLowerCase()) || 
                     speakUserAnswer.toLowerCase().includes("i") && speakUserAnswer.length > 10;
    setSpeakResult(isCorrect);
    setShowSpeakResult(true);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % speakCards.length);
    setSpeakUserAnswer("");
    setShowSpeakResult(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + speakCards.length) % speakCards.length);
    setSpeakUserAnswer("");
    setShowSpeakResult(false);
  };

  const currentCard = speakCards[currentCardIndex];

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
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 36</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 LISTEN, NUMBER, AND ROLE-PLAY
          </p>
          <p className="text-md text-gray-500 mt-2">Listen to short dialogues, number the images, and practice speaking!</p>
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
            <AudioPlayer src="/audios/listen.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8">
              <p className="text-purple-700 mb-4 italic">
                👂 Listen to the audio. The images below are <strong className="font-bold">SHUFFLED</strong>. 
                Click on the images <strong className="font-bold">IN THE ORDER YOU HEAR</strong> (1 → 2 → 3).
              </p>
              
              <p className="text-sm text-purple-600 mb-6 bg-purple-100 p-3 rounded-lg">
                🎯 <strong>Correct sequence to find:</strong> 1. refletindo sobre a vida → 2. casal assistindo tv juntos → 3. mulher sorrindo
              </p>

              {/* Imagens embaralhadas - cada imagem é clicável para construir a sequência */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {shuffledListenItems.map((item) => (
                  <div 
                    key={item.key} 
                    className="bg-white rounded-xl shadow-md border-2 border-purple-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
                    onClick={() => handleImageClickForSequence(item.correctNumber)}
                  >
                    <div className="relative h-64 w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={300}
                        height={250}
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

              {/* Exibição da sequência que o aluno está construindo */}
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
                        <span className="font-bold">✅ PARABÉNS! Você acertou a sequência correta: 1 → 2 → 3!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle size={24} />
                        <span className="font-bold">❌ Sequência errada! A ordem correta é: 1. refletindo sobre a vida → 2. casal assistindo tv juntos → 3. mulher sorrindo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Seção para número individual de cada imagem (opcional) */}
              <div className="border-t-2 border-purple-200 pt-6 mt-4">
                <h3 className="font-bold text-purple-800 mb-4">🎯 Ou identifique cada imagem individualmente:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shuffledListenItems.map((item) => (
                    <div key={`ind-${item.key}`} className="bg-white p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-medium text-gray-700 text-center mb-3">{item.label}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1 text-center">Qual número esta imagem representa?</p>
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleListenSelect(item.key, num)}
                              className={`w-10 h-10 rounded-full font-bold transition ${
                                listenAnswers[item.key] === num
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-purple-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleListenCheck(item.key, item.correctNumber)}
                          className="flex-1 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
                          disabled={listenAnswers[item.key] === undefined}
                        >
                          Check
                        </button>
                      </div>
                      
                      {showListenResults[item.key] && (
                        <div className="mt-2">
                          <AnswerResult isCorrect={listenResults[item.key] || false} correctAnswer={item.correctNumber.toString()} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 bg-purple-100 rounded-xl p-4">
                <h3 className="font-bold text-purple-800">🎭 Role-play Activity:</h3>
                <p className="text-purple-700 text-sm mt-1">
                  Work in pairs. Based on the dialogue you heard and the images, create a short dialogue and role-play it.
                </p>
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
        {/* SPEAK RIGHT NOW - Questions */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ QUESTIONS</h2>
              <button onClick={() => toggleSection('speak')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.speak ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speak && (
            <div className="p-8">
              <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"><ChevronLeft size={24} /></button>
                  <span className="text-sm text-teal-600">Question {currentCardIndex + 1} of {speakCards.length}</span>
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
                  value={speakUserAnswer}
                  onChange={(e) => setSpeakUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-24 p-4 border border-teal-300 rounded-md resize-none mb-4"
                />
                
                <div className="flex gap-3">
                  <button onClick={handleSpeakCheck} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition font-medium">Check Answer</button>
                  <button onClick={() => { setSpeakUserAnswer(""); setShowSpeakResult(false); }} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md transition">Clear</button>
                </div>
                
                {showSpeakResult && <div className="mt-4"><AnswerResult isCorrect={speakResult} correctAnswer={currentCard.answer} /></div>}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* THERE AND AROUND - Useful Phrases */}
        {/* ============================================ */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🧭 THERE AND AROUND</h2>
              <button onClick={() => toggleSection('usefulPhrases')} className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition">
                {sections.usefulPhrases ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.usefulPhrases && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {usefulPhrases.map((phrase, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-indigo-200">
                    <p className="font-bold text-indigo-700">{phrase.english}</p>
                    <p className="text-gray-600 text-sm">{phrase.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE IN YOUR EARS - Final Listening */}
        {/* ============================================ */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-cyan-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
          </div>
          <div className="p-8">
            <p className="text-cyan-700 mb-4">Listen to short conversations and identify:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Opinions</strong> (I think... / I don't think...)</li>
              <li><strong>Necessity</strong> (need to / have to)</li>
              <li><strong>Questions</strong> (Do you...? / Why do you...?)</li>
            </ul>
            <div className="mt-4 p-4 bg-white rounded-lg border border-cyan-200">
              <AudioPlayer src="/audios/tune-in.mp3" />
            </div>
          </div>
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
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Substitution</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Negative sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Affirmative sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Questions (Interrogative)</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Speaking (Role-play)</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Listening</span>
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
            <button onClick={() => router.push("/cursos/lesson37")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}