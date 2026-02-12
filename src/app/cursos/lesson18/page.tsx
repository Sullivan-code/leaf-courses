"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Save, Check, XCircle } from "lucide-react";

// ATUALIZADO: Listen and Practice com imagens atualizadas conforme especificações
const listenItems = [
  { 
    key: "a", 
    label: "", 
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "I get up early every day.",
    audio: "/audios/lesson18-a.mp3"
  },
  { 
    key: "b", 
    label: "", 
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "I really like to work here.",
    audio: "/audios/lesson18-b.mp3"
  },
  { 
    key: "c", 
    label: "", 
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "When do you have to go to the grocery store?",
    audio: "/audios/lesson18-c.mp3"
  },
  { 
    key: "d", 
    label: "", 
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "I really have to take a shower now.",
    audio: "/audios/lesson18-d.mp3"
  },
  { 
    key: "e", 
    label: "", 
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "Do you work at the drugstore?",
    audio: "/audios/lesson18-e.mp3"
  },
  { 
    key: "f", 
    label: "", 
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", 
    correctAnswer: "I usually work in the evenings, too.",
    audio: "/audios/lesson18-f.mp3"
  },
];

// Exercícios de Substitution Practice I (inglês)
const substitutionPracticeI = [
  {
    id: "sub1-1",
    original: "We have to go to sleep early.",
    variations: ["I have", "You have"],
    correctAnswers: [
      "I have to go to sleep early.",
      "You have to go to sleep early."
    ],
    hint: "have to → has to with he/she/it"
  },
  {
    id: "sub1-2",
    original: "I get up late every day.",
    variations: ["We", "They"],
    correctAnswers: [
      "We get up late every day.",
      "They get up late every day."
    ],
    hint: "get up → gets up with he/she/it"
  },
  {
    id: "sub1-3",
    original: "I need a new job.",
    variations: ["car", "tablet"],
    correctAnswers: [
      "I need a new car.",
      "I need a new tablet."
    ],
    hint: "job → car / tablet"
  },
  {
    id: "sub1-4",
    original: "They work at the cinema.",
    variations: ["at the mall", "at the office"],
    correctAnswers: [
      "They work at the mall.",
      "They work at the office."
    ],
    hint: "at the cinema → at the mall / at the office"
  },
  {
    id: "sub1-5",
    original: "When do you go to the market?",
    variations: ["mall", "bank"],
    correctAnswers: [
      "When do you go to the mall?",
      "When do you go to the bank?"
    ],
    hint: "to the market → to the mall / to the bank"
  },
];

// Exercícios Change Into Negative
const negativeExercises = [
  {
    id: "neg1",
    sentence: "They have ten magazines and 20 books.",
    correctAnswer: "They don't have ten magazines and 20 books."
  },
  {
    id: "neg2",
    sentence: "You need to read your e-mails at night.",
    correctAnswer: "You don't need to read your e-mails at night."
  },
  {
    id: "neg3",
    sentence: "We have to go to work early.",
    correctAnswer: "We don't have to go to work early."
  },
  {
    id: "neg4",
    sentence: "I want to go to the grocery store now.",
    correctAnswer: "I don't want to go to the grocery store now."
  },
  {
    id: "neg5",
    sentence: "They work at the coffee shop.",
    correctAnswer: "They don't work at the coffee shop."
  },
  {
    id: "neg6",
    sentence: "I see my parents at home every day.",
    correctAnswer: "I don't see my parents at home every day."
  },
];

// Exercícios de Substitution Practice II (inglês)
const substitutionPracticeII = [
  {
    id: "sub2-1",
    original: "I take a shower in the morning.",
    variations: ["in the afternoon", "at night"],
    correctAnswers: [
      "I take a shower in the afternoon.",
      "I take a shower at night."
    ],
    hint: "in the morning → in the afternoon / at night"
  },
  {
    id: "sub2-2",
    original: "They usually go to the office early.",
    variations: ["late", "in the morning"],
    correctAnswers: [
      "They usually go to the office late.",
      "They usually go to the office in the morning."
    ],
    hint: "early → late / in the morning"
  },
  {
    id: "sub2-3",
    original: "When do you go to the restaurant with your family?",
    variations: ["café", "church"],
    correctAnswers: [
      "When do you go to the café with your family?",
      "When do you go to church with your family?"
    ],
    hint: "to the restaurant → to the café / to church"
  },
  {
    id: "sub2-4",
    original: "We need to read this book at school.",
    variations: ["at home", "at work"],
    correctAnswers: [
      "We need to read this book at home.",
      "We need to read this book at work."
    ],
    hint: "at school → at home / at work"
  },
  {
    id: "sub2-5",
    original: "Where do you study English?",
    variations: ["French", "Spanish"],
    correctAnswers: [
      "Where do you study French?",
      "Where do you study Spanish?"
    ],
    hint: "English → French / Spanish"
  },
];

// Substitution Practice III (novo)
const substitutionPracticeIII = [
  {
    id: "sub3-1",
    original: "I go to work by bus.",
    variations: ["by car", "by subway"],
    correctAnswers: [
      "I go to work by car.",
      "I go to work by subway."
    ],
    hint: "by bus → by car / by subway"
  },
  {
    id: "sub3-2",
    original: "She studies at the library.",
    variations: ["at home", "at the café"],
    correctAnswers: [
      "She studies at home.",
      "She studies at the café."
    ],
    hint: "at the library → at home / at the café"
  },
  {
    id: "sub3-3",
    original: "We have lunch at noon.",
    variations: ["at 1 PM", "at the restaurant"],
    correctAnswers: [
      "We have lunch at 1 PM.",
      "We have lunch at the restaurant."
    ],
    hint: "at noon → at 1 PM / at the restaurant"
  },
];

// Exercícios Change Into Affirmative
const affirmativeExercises = [
  {
    id: "aff1",
    sentence: "I don't like to go to the mall.",
    correctAnswer: "I like to go to the mall."
  },
  {
    id: "aff2",
    sentence: "They don't need to study today.",
    correctAnswer: "They need to study today."
  },
  {
    id: "aff3",
    sentence: "I don't have to take a shower now.",
    correctAnswer: "I have to take a shower now."
  },
  {
    id: "aff4",
    sentence: "We don't want to eat a sandwich for dinner.",
    correctAnswer: "We want to eat a sandwich for dinner."
  },
  {
    id: "aff5",
    sentence: "You don't have to send this e-mail to your boss.",
    correctAnswer: "You have to send this e-mail to your boss."
  },
  {
    id: "aff6",
    sentence: "They don't have to speak Spanish at work.",
    correctAnswer: "They have to speak Spanish at work."
  },
];

// Exercícios Change Into Interrogative
const interrogativeExercises = [
  {
    id: "int1",
    sentence: "You live in Italy with your family.",
    correctAnswer: "Do you live in Italy with your family?"
  },
  {
    id: "int2",
    sentence: "You read your messages at home.",
    correctAnswer: "Do you read your messages at home?"
  },
  {
    id: "int3",
    sentence: "They work at the grocery store.",
    correctAnswer: "Do they work at the grocery store?"
  },
  {
    id: "int4",
    sentence: "You work at a restaurant.",
    correctAnswer: "Do you work at a restaurant?"
  },
  {
    id: "int5",
    sentence: "They prefer to go to the mall in the evening.",
    correctAnswer: "Do they prefer to go to the mall in the evening?"
  },
  {
    id: "int6",
    sentence: "You usually study with your classmate.",
    correctAnswer: "Do you usually study with your classmate?"
  },
];

// Questions para Speaking Practice
const speakingQuestions = [
  "Do you usually get up early or late?",
  "Do you go to bed early or late?",
  "When do you take a shower?",
  "Where do you work or study?",
  "Do you prefer to study alone or with your classmates?",
  "Do you want to have a new job?",
  "What's your e-mail address?",
  "Do you usually go to the movies with your family or friends?",
  "Do you like to study at the coffee shop?",
  "Do you work in an office?"
];

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

const SimpleAudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={playAudio}
        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
      >
        <Volume2 size={14} />
      </button>
      <audio ref={audioRef} src={src} preload="none" />
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
        <span className="text-sm text-green-700 font-medium">Correct!</span>
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

// Sistema de avaliação de respostas
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase().trim().replace(/[.,?!]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

export default function Lesson18() {
  const router = useRouter();
  
  // Estados para Listen and Practice
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios de substituição I
  const [substitutionIAnswers, setSubstitutionIAnswers] = useState<Record<string, string>>({});
  const [showSubstitutionIResults, setShowSubstitutionIResults] = useState<Record<string, boolean>>({});
  const [substitutionIAnswerResults, setSubstitutionIAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios negativos
  const [negativeAnswers, setNegativeAnswers] = useState<Record<string, string>>({});
  const [showNegativeResults, setShowNegativeResults] = useState<Record<string, boolean>>({});
  const [negativeAnswerResults, setNegativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios de substituição II
  const [substitutionIIAnswers, setSubstitutionIIAnswers] = useState<Record<string, string>>({});
  const [showSubstitutionIIResults, setShowSubstitutionIIResults] = useState<Record<string, boolean>>({});
  const [substitutionIIAnswerResults, setSubstitutionIIAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios de substituição III
  const [substitutionIIIAnswers, setSubstitutionIIIAnswers] = useState<Record<string, string>>({});
  const [showSubstitutionIIIResults, setShowSubstitutionIIIResults] = useState<Record<string, boolean>>({});
  const [substitutionIIIAnswerResults, setSubstitutionIIIAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios afirmativos
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<string, string>>({});
  const [showAffirmativeResults, setShowAffirmativeResults] = useState<Record<string, boolean>>({});
  const [affirmativeAnswerResults, setAffirmativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para exercícios interrogativos
  const [interrogativeAnswers, setInterrogativeAnswers] = useState<Record<string, string>>({});
  const [showInterrogativeResults, setShowInterrogativeResults] = useState<Record<string, boolean>>({});
  const [interrogativeAnswerResults, setInterrogativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // Estados para respostas das questões
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    listen: true,
    verbs: true,
    newWords: true,
    usefulPhrases: true,
    speaking: true
  });

  // Estado para salvar todas as respostas
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedData = localStorage.getItem("lesson18Answers");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        // Restaurar respostas de escuta
        setNotes(data.notes || {});
        setShowAnswers(data.showAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        
        // Restaurar exercícios de substituição
        if (data.substitutionIAnswers) setSubstitutionIAnswers(data.substitutionIAnswers);
        if (data.showSubstitutionIResults) setShowSubstitutionIResults(data.showSubstitutionIResults);
        if (data.substitutionIAnswerResults) setSubstitutionIAnswerResults(data.substitutionIAnswerResults);
        
        // Restaurar exercícios negativos
        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.negativeAnswerResults) setNegativeAnswerResults(data.negativeAnswerResults);
        
        // Restaurar exercícios de substituição II
        if (data.substitutionIIAnswers) setSubstitutionIIAnswers(data.substitutionIIAnswers);
        if (data.showSubstitutionIIResults) setShowSubstitutionIIResults(data.showSubstitutionIIResults);
        if (data.substitutionIIAnswerResults) setSubstitutionIIAnswerResults(data.substitutionIIAnswerResults);
        
        // Restaurar exercícios de substituição III
        if (data.substitutionIIIAnswers) setSubstitutionIIIAnswers(data.substitutionIIIAnswers);
        if (data.showSubstitutionIIIResults) setShowSubstitutionIIIResults(data.showSubstitutionIIIResults);
        if (data.substitutionIIIAnswerResults) setSubstitutionIIIAnswerResults(data.substitutionIIIAnswerResults);
        
        // Restaurar exercícios afirmativos
        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.affirmativeAnswerResults) setAffirmativeAnswerResults(data.affirmativeAnswerResults);
        
        // Restaurar exercícios interrogativos
        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.showInterrogativeResults) setShowInterrogativeResults(data.showInterrogativeResults);
        if (data.interrogativeAnswerResults) setInterrogativeAnswerResults(data.interrogativeAnswerResults);
        
        // Restaurar questões de fala
        if (data.questionAnswers) setQuestionAnswers(data.questionAnswers);
        
        // Restaurar estado das seções
        if (data.sections) setSections(data.sections);
        
        // Restaurar dados salvos
        if (data.savedAnswers) setSavedAnswers(data.savedAnswers);
        
        console.log("Dados carregados do localStorage para Lesson 18");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = () => {
    const data = {
      // Listen and Practice
      notes,
      showAnswers,
      answerResults,
      showAnswerResults,
      
      // Substitution Practice I
      substitutionIAnswers,
      showSubstitutionIResults,
      substitutionIAnswerResults,
      
      // Negative Exercises
      negativeAnswers,
      showNegativeResults,
      negativeAnswerResults,
      
      // Substitution Practice II
      substitutionIIAnswers,
      showSubstitutionIIResults,
      substitutionIIAnswerResults,
      
      // Substitution Practice III
      substitutionIIIAnswers,
      showSubstitutionIIIResults,
      substitutionIIIAnswerResults,
      
      // Affirmative Exercises
      affirmativeAnswers,
      showAffirmativeResults,
      affirmativeAnswerResults,
      
      // Interrogative Exercises
      interrogativeAnswers,
      showInterrogativeResults,
      interrogativeAnswerResults,
      
      // Speaking Questions
      questionAnswers,
      
      // Seções
      sections,
      
      // Dados salvos
      savedAnswers: {
        listenAndPractice: notes,
        substitutionPracticeI: substitutionIAnswers,
        negativeExercises: negativeAnswers,
        substitutionPracticeII: substitutionIIAnswers,
        substitutionPracticeIII: substitutionIIIAnswers,
        affirmativeExercises: affirmativeAnswers,
        interrogativeExercises: interrogativeAnswers,
        speakingQuestions: questionAnswers,
        timestamp: new Date().toISOString()
      },
      
      // Metadados
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 18 – Daily Routine & Places",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson18Answers", JSON.stringify(data));
      setSavedAnswers(data.savedAnswers);
      alert("✅ Todas as suas respostas foram salvas com sucesso!\nVocê pode voltar a qualquer momento e elas estarão aqui.");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas. Por favor, tente novamente.");
    }
  };

  // Função para limpar todas as respostas
  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas? Esta ação não pode ser desfeita.")) {
      // Limpar respostas de escuta
      setNotes({});
      setShowAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      
      // Limpar exercícios de substituição I
      setSubstitutionIAnswers({});
      setShowSubstitutionIResults({});
      setSubstitutionIAnswerResults({});
      
      // Limpar exercícios negativos
      setNegativeAnswers({});
      setShowNegativeResults({});
      setNegativeAnswerResults({});
      
      // Limpar exercícios de substituição II
      setSubstitutionIIAnswers({});
      setShowSubstitutionIIResults({});
      setSubstitutionIIAnswerResults({});
      
      // Limpar exercícios de substituição III
      setSubstitutionIIIAnswers({});
      setShowSubstitutionIIIResults({});
      setSubstitutionIIIAnswerResults({});
      
      // Limpar exercícios afirmativos
      setAffirmativeAnswers({});
      setShowAffirmativeResults({});
      setAffirmativeAnswerResults({});
      
      // Limpar exercícios interrogativos
      setInterrogativeAnswers({});
      setShowInterrogativeResults({});
      setInterrogativeAnswerResults({});
      
      // Limpar questões de fala
      setQuestionAnswers({});
      
      // Limpar do localStorage
      localStorage.removeItem("lesson18Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // Função para carregar respostas salvas
  const loadSavedAnswers = () => {
    const saved = localStorage.getItem("lesson18Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        
        // Carregar respostas de cada seção
        if (data.notes) setNotes(data.notes);
        if (data.substitutionIAnswers) setSubstitutionIAnswers(data.substitutionIAnswers);
        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.substitutionIIAnswers) setSubstitutionIIAnswers(data.substitutionIIAnswers);
        if (data.substitutionIIIAnswers) setSubstitutionIIIAnswers(data.substitutionIIIAnswers);
        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.questionAnswers) setQuestionAnswers(data.questionAnswers);
        
        // Carregar dados salvos
        if (data.savedAnswers) setSavedAnswers(data.savedAnswers);
        
        alert("✅ Respostas anteriores carregadas!");
      } catch (error) {
        alert("Erro ao carregar respostas salvas.");
      }
    } else {
      alert("Nenhuma resposta salva encontrada.");
    }
  };

  const handleChange = (key: string, value: string) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  const handleSubstitutionIChange = (key: string, value: string) => {
    setSubstitutionIAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNegativeChange = (key: string, value: string) => {
    setNegativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubstitutionIIChange = (key: string, value: string) => {
    setSubstitutionIIAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubstitutionIIIChange = (key: string, value: string) => {
    setSubstitutionIIIAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleAffirmativeChange = (key: string, value: string) => {
    setAffirmativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleInterrogativeChange = (key: string, value: string) => {
    setInterrogativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [`q${index}`]: value }));
  };

  const handleCheck = (key: string) => {
    const isCorrect = checkAnswer(notes[key] || "", listenItems.find(item => item.key === key)?.correctAnswer || "");
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
    setShowAnswers(prev => ({ ...prev, [key]: true }));
  };

  const handleSubstitutionICheck = (id: string, correctAnswers: string[]) => {
    let allCorrect = true;
    
    // Verificar cada resposta individualmente
    const variations = substitutionPracticeI.find(ex => ex.id === id)?.variations || [];
    variations.forEach((_, index) => {
      const userAnswer = substitutionIAnswers[`${id}-${index}`]?.trim();
      const correctAnswer = correctAnswers[index];
      const isCorrect = checkAnswer(userAnswer || "", correctAnswer);
      
      if (!isCorrect) allCorrect = false;
      
      // Armazenar resultado individual
      setSubstitutionIAnswerResults(prev => ({ 
        ...prev, 
        [`${id}-${index}`]: isCorrect 
      }));
    });
    
    setShowSubstitutionIResults(prev => ({ ...prev, [id]: true }));
    
    if (allCorrect) {
      alert('✅ Todas as respostas estão corretas!');
    }
  };

  const handleNegativeCheck = (id: string) => {
    const exercise = negativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    const userAnswer = negativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    
    setNegativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowNegativeResults(prev => ({ ...prev, [id]: true }));
    
    if (!isCorrect) {
      // Mostrar resposta correta se estiver errado
      alert(`❌ Resposta esperada: ${exercise.correctAnswer}`);
    }
  };

  const handleSubstitutionIICheck = (id: string, correctAnswers: string[]) => {
    let allCorrect = true;
    
    // Verificar cada resposta individualmente
    const variations = substitutionPracticeII.find(ex => ex.id === id)?.variations || [];
    variations.forEach((_, index) => {
      const userAnswer = substitutionIIAnswers[`${id}-${index}`]?.trim();
      const correctAnswer = correctAnswers[index];
      const isCorrect = checkAnswer(userAnswer || "", correctAnswer);
      
      if (!isCorrect) allCorrect = false;
      
      // Armazenar resultado individual
      setSubstitutionIIAnswerResults(prev => ({ 
        ...prev, 
        [`${id}-${index}`]: isCorrect 
      }));
    });
    
    setShowSubstitutionIIResults(prev => ({ ...prev, [id]: true }));
    
    if (allCorrect) {
      alert('✅ Todas as respostas estão corretas!');
    }
  };

  const handleSubstitutionIIICheck = (id: string, correctAnswers: string[]) => {
    let allCorrect = true;
    
    // Verificar cada resposta individualmente
    const variations = substitutionPracticeIII.find(ex => ex.id === id)?.variations || [];
    variations.forEach((_, index) => {
      const userAnswer = substitutionIIIAnswers[`${id}-${index}`]?.trim();
      const correctAnswer = correctAnswers[index];
      const isCorrect = checkAnswer(userAnswer || "", correctAnswer);
      
      if (!isCorrect) allCorrect = false;
      
      // Armazenar resultado individual
      setSubstitutionIIIAnswerResults(prev => ({ 
        ...prev, 
        [`${id}-${index}`]: isCorrect 
      }));
    });
    
    setShowSubstitutionIIIResults(prev => ({ ...prev, [id]: true }));
    
    if (allCorrect) {
      alert('✅ Todas as respostas estão corretas!');
    }
  };

  const handleAffirmativeCheck = (id: string) => {
    const exercise = affirmativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    const userAnswer = affirmativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    
    setAffirmativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowAffirmativeResults(prev => ({ ...prev, [id]: true }));
  };

  const handleInterrogativeCheck = (id: string) => {
    const exercise = interrogativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    
    const userAnswer = interrogativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    
    setInterrogativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowInterrogativeResults(prev => ({ ...prev, [id]: true }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson-bg.jpg')` }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📖 Lesson 18 – Daily Routine & Places</h1>
          <div className="flex justify-center items-center gap-4 mb-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition flex items-center gap-2"
            >
              <Save size={18} />
              Salvar Progresso
            </button>
            <button
              onClick={loadSavedAnswers}
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition"
            >
              Carregar Respostas
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition"
            >
              Limpar Tudo
            </button>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            🎧 Esta lição foi feita para praticar rotinas diárias, lugares na cidade e estruturas gramaticais. Complete os exercícios ouvindo e praticando.
          </p>
        </div>

        {/* LISTEN AND PRACTICE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 LISTEN AND PRACTICE</h2>
              <button 
                onClick={() => toggleSection('listen')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/lesson18_listenandpractice.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8">
              <div className="mb-6 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">
                  Listen to the sentences and write what you hear. Then check your answers.
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listenItems.map((item) => (
                    <div key={item.key} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-orange-200">
                      <div className="w-full h-[180px] relative mb-4">
                        <Image 
                          src={item.image} 
                          alt={item.label} 
                          fill
                          className="rounded-lg object-cover border-2 border-orange-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      <div className="w-full mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Image {item.key.toUpperCase()}</span>
                          <AudioPlayer src={item.audio} compact />
                        </div>
                        <textarea
                          placeholder="Write what you hear here..."
                          value={notes[item.key] || ""}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          className="w-full h-[80px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => handleCheck(item.key)}
                          disabled={!notes[item.key]?.trim()}
                          className={`flex-1 py-2 px-4 rounded-md transition font-medium ${
                            !notes[item.key]?.trim() 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          Check Answer
                        </button>
                        
                        <button
                          onClick={() => {
                            handleChange(item.key, "");
                            setShowAnswers(prev => ({ ...prev, [item.key]: false }));
                            setShowAnswerResults(prev => ({ ...prev, [item.key]: false }));
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Clear
                        </button>
                      </div>

                      {showAnswerResults[item.key] && (
                        <AnswerResult 
                          isCorrect={answerResults[item.key]} 
                          correctAnswer={item.correctAnswer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PRÁTICA DE VERBOS */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📚 PRÁTICA DE VERBOS</h2>
              <button 
                onClick={() => toggleSection('verbs')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.verbs ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.verbs && (
            <div className="p-8">
              {/* SUBSTITUTION PRACTICE I */}
              <div className="mb-8 bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-6">🔹 SUBSTITUTION PRACTICE I</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {substitutionPracticeI.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-700 mb-2">{exercise.original}</p>
                      <div className="space-y-3">
                        {exercise.variations.map((variation: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-blue-600 w-20">{variation}:</span>
                            <input
                              type="text"
                              value={substitutionIAnswers[`${exercise.id}-${index}`] || ""}
                              onChange={(e) => handleSubstitutionIChange(`${exercise.id}-${index}`, e.target.value)}
                              className="flex-1 p-2 border border-blue-300 rounded-md text-sm"
                              placeholder="Type the complete sentence"
                            />
                            {showSubstitutionIResults[exercise.id] && substitutionIAnswerResults[`${exercise.id}-${index}`] !== undefined && (
                              <span className={`text-sm font-medium ${substitutionIAnswerResults[`${exercise.id}-${index}`] ? 'text-green-600' : 'text-red-600'}`}>
                                {substitutionIAnswerResults[`${exercise.id}-${index}`] ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSubstitutionICheck(exercise.id, exercise.correctAnswers)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition text-sm"
                        >
                          Check Answers
                        </button>
                        <button
                          onClick={() => {
                            exercise.variations.forEach((_, index: number) => {
                              handleSubstitutionIChange(`${exercise.id}-${index}`, "");
                            });
                            setShowSubstitutionIResults(prev => ({ ...prev, [exercise.id]: false }));
                          }}
                          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Clear
                        </button>
                      </div>
                      {showSubstitutionIResults[exercise.id] && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-xs text-green-700">
                            💡 <span className="font-medium">Hint:</span> {exercise.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-2">💡 Tip:</h4>
                  <p className="text-sm text-yellow-700">
                    Practice changing the subject and verb conjugation. Remember: "I have", "you have", "he/she/it has", "we have", "they have".
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* NOVAS PALAVRAS */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📖 NOVAS PALAVRAS</h2>
              <button 
                onClick={() => toggleSection('newWords')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.newWords ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.newWords && (
            <div className="p-8">
              {/* CHANGE INTO NEGATIVE */}
              <div className="mb-8 bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-6">🔹 CHANGE INTO NEGATIVE</h3>
                
                <div className="space-y-6">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-green-700 mb-2">{exercise.sentence}</p>
                          <input
                            type="text"
                            value={negativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleNegativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-green-300 rounded-md"
                            placeholder="Write the negative form"
                          />
                          {showNegativeResults[exercise.id] && (
                            <div className="mt-2">
                              <AnswerResult 
                                isCorrect={negativeAnswerResults[exercise.id]} 
                                correctAnswer={exercise.correctAnswer}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleNegativeCheck(exercise.id)}
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                          >
                            Check
                          </button>
                          <button
                            onClick={() => {
                              handleNegativeChange(exercise.id, "");
                              setShowNegativeResults(prev => ({ ...prev, [exercise.id]: false }));
                            }}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SUBSTITUTION PRACTICE II */}
              <div className="mb-8 bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-6">🔹 SUBSTITUTION PRACTICE II</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {substitutionPracticeII.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-green-700 mb-2">{exercise.original}</p>
                      <div className="space-y-3">
                        {exercise.variations.map((variation: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-green-600 w-20">{variation}:</span>
                            <input
                              type="text"
                              value={substitutionIIAnswers[`${exercise.id}-${index}`] || ""}
                              onChange={(e) => handleSubstitutionIIChange(`${exercise.id}-${index}`, e.target.value)}
                              className="flex-1 p-2 border border-green-300 rounded-md text-sm"
                              placeholder="Type the complete sentence"
                            />
                            {showSubstitutionIIResults[exercise.id] && substitutionIIAnswerResults[`${exercise.id}-${index}`] !== undefined && (
                              <span className={`text-sm font-medium ${substitutionIIAnswerResults[`${exercise.id}-${index}`] ? 'text-green-600' : 'text-red-600'}`}>
                                {substitutionIIAnswerResults[`${exercise.id}-${index}`] ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSubstitutionIICheck(exercise.id, exercise.correctAnswers)}
                          className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-green-600 transition text-sm"
                        >
                          Check Answers
                        </button>
                        <button
                          onClick={() => {
                            exercise.variations.forEach((_, index: number) => {
                              handleSubstitutionIIChange(`${exercise.id}-${index}`, "");
                            });
                            setShowSubstitutionIIResults(prev => ({ ...prev, [exercise.id]: false }));
                          }}
                          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Clear
                        </button>
                      </div>
                      {showSubstitutionIIResults[exercise.id] && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-xs text-green-700">
                            💡 <span className="font-medium">Hint:</span> {exercise.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FRASES ÚTEIS */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 FRASES ÚTEIS</h2>
              <button 
                onClick={() => toggleSection('usefulPhrases')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.usefulPhrases ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.usefulPhrases && (
            <div className="p-8">
              {/* SUBSTITUTION PRACTICE III */}
              <div className="mb-8 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-6">🔹 SUBSTITUTION PRACTICE III</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {substitutionPracticeIII.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <p className="font-medium text-purple-700 mb-2">{exercise.original}</p>
                      <div className="space-y-3">
                        {exercise.variations.map((variation: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-purple-600 w-20">{variation}:</span>
                            <input
                              type="text"
                              value={substitutionIIIAnswers[`${exercise.id}-${index}`] || ""}
                              onChange={(e) => handleSubstitutionIIIChange(`${exercise.id}-${index}`, e.target.value)}
                              className="flex-1 p-2 border border-purple-300 rounded-md text-sm"
                              placeholder="Type the complete sentence"
                            />
                            {showSubstitutionIIIResults[exercise.id] && substitutionIIIAnswerResults[`${exercise.id}-${index}`] !== undefined && (
                              <span className={`text-sm font-medium ${substitutionIIIAnswerResults[`${exercise.id}-${index}`] ? 'text-green-600' : 'text-red-600'}`}>
                                {substitutionIIIAnswerResults[`${exercise.id}-${index}`] ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleSubstitutionIIICheck(exercise.id, exercise.correctAnswers)}
                          className="bg-purple-500 text-white py-1 px-3 rounded-md hover:bg-purple-600 transition text-sm"
                        >
                          Check Answers
                        </button>
                        <button
                          onClick={() => {
                            exercise.variations.forEach((_, index: number) => {
                              handleSubstitutionIIIChange(`${exercise.id}-${index}`, "");
                            });
                            setShowSubstitutionIIIResults(prev => ({ ...prev, [exercise.id]: false }));
                          }}
                          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Clear
                        </button>
                      </div>
                      {showSubstitutionIIIResults[exercise.id] && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-xs text-green-700">
                            💡 <span className="font-medium">Hint:</span> {exercise.hint}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CHANGE INTO AFFIRMATIVE */}
              <div className="mb-8 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-6">🔹 CHANGE INTO AFFIRMATIVE</h3>
                
                <div className="space-y-6">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-purple-700 mb-2">{exercise.sentence}</p>
                          <input
                            type="text"
                            value={affirmativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-purple-300 rounded-md"
                            placeholder="Write the affirmative form"
                          />
                          {showAffirmativeResults[exercise.id] && (
                            <div className="mt-2">
                              <AnswerResult 
                                isCorrect={affirmativeAnswerResults[exercise.id]} 
                                correctAnswer={exercise.correctAnswer}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleAffirmativeCheck(exercise.id)}
                            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition"
                          >
                            Check
                          </button>
                          <button
                            onClick={() => {
                              handleAffirmativeChange(exercise.id, "");
                              setShowAffirmativeResults(prev => ({ ...prev, [exercise.id]: false }));
                            }}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CHANGE INTO INTERROGATIVE */}
              <div className="mb-8 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-6">🔹 CHANGE INTO INTERROGATIVE</h3>
                
                <div className="space-y-6">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-purple-700 mb-2">{exercise.sentence}</p>
                          <input
                            type="text"
                            value={interrogativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleInterrogativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-purple-300 rounded-md"
                            placeholder="Write the question form"
                          />
                          {showInterrogativeResults[exercise.id] && (
                            <div className="mt-2">
                              <AnswerResult 
                                isCorrect={interrogativeAnswerResults[exercise.id]} 
                                correctAnswer={exercise.correctAnswer}
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => handleInterrogativeCheck(exercise.id)}
                            className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition"
                          >
                            Check
                          </button>
                          <button
                            onClick={() => {
                              handleInterrogativeChange(exercise.id, "");
                              setShowInterrogativeResults(prev => ({ ...prev, [exercise.id]: false }));
                            }}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SPEAKING PRACTICE */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAKING PRACTICE</h2>
              <button 
                onClick={() => toggleSection('speaking')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speaking && (
            <div className="p-8">
              <div className="mb-8 bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-6">
                  Answer these questions about your daily routine. Practice speaking out loud.
                </h3>
                
                <div className="space-y-6">
                  {speakingQuestions.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-red-200">
                      <p className="font-medium text-red-700 mb-3">{question}</p>
                      <textarea
                        value={questionAnswers[`q${index}`] || ""}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="w-full h-24 p-3 border border-red-300 rounded-md resize-none"
                        placeholder="Write your answer here..."
                      />
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(question);
                            utterance.lang = 'en-US';
                            window.speechSynthesis.speak(utterance);
                          }}
                          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                        >
                          🔊 Listen Question
                        </button>
                        {questionAnswers[`q${index}`] && (
                          <button
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(questionAnswers[`q${index}`]);
                              utterance.lang = 'en-US';
                              window.speechSynthesis.speak(utterance);
                            }}
                            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition"
                          >
                            🔊 Listen Answer
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">🎯 Speaking Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-red-700">
                  <li>Speak slowly and clearly</li>
                  <li>Practice the questions and answers out loud</li>
                  <li>Record yourself and listen back</li>
                  <li>Focus on correct pronunciation</li>
                  <li>Use complete sentences when possible</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Progress Save Section */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-[30px] p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">💾 Save Your Progress</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Save All Answers
            </button>
            <button
              onClick={loadSavedAnswers}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition"
            >
              Load Saved Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition"
            >
              Clear All Answers
            </button>
          </div>
          
          {savedAnswers.timestamp && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Last saved: {new Date(savedAnswers.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Back to Lessons
          </button>
          <button
            onClick={() => router.push("/cursos/review3")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}