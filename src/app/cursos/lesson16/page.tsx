"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, RefreshCw } from "lucide-react";

// ==============================================
// STATIC EXAMPLES FOR SPEAK RIGHT NOW SECTION
// ==============================================
const speakNowExamples = [
  {
    id: 1,
    name: "Cell Phone",
    description: "Reading news on mobile device",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    question: "Do you like to read the news on your cell phone?",
    answer: "Yes, I do. I like to read the news on my cell phone every morning."
  },
  {
    id: 2,
    name: "Coffee Shop",
    description: "Going to coffee shop",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    question: "Do you want to go to the coffee shop?",
    answer: "Yes, I do. I want to go to the coffee shop to meet my friends."
  },
  {
    id: 3,
    name: "Movies",
    description: "Going to the movies",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    question: "Do you need to go to the movies?",
    answer: "No, I don't. I don't need to go to the movies today. I prefer to stay home."
  }
];

// Dados para WHERE DO YOU WANT TO GO? - TODAS DO UNSPLASH
const places = [
  {
    id: 1,
    name: "Movies",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to the movies.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/movies.mp3",
    verbPairs: [
      { question: "want to go to", response: "want to go to" },
      { question: "like to go to", response: "like to go to" },
      { question: "need to go to", response: "need to go to" }
    ],
    questions: [
      "Do you want to go to the movies?",
      "Do you like to go to the movies?",
      "Do you need to go to the movies?"
    ]
  },
  {
    id: 2,
    name: "Coffee Shop",
    image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to the coffee shop.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/coffee-shop.mp3",
    verbPairs: [
      { question: "like to drink at", response: "like to drink at" },
      { question: "want to meet at", response: "want to meet at" },
      { question: "need to work at", response: "need to work at" }
    ],
    questions: [
      "Do you like to drink at the coffee shop?",
      "Do you want to meet at the coffee shop?",
      "Do you need to work at the coffee shop?"
    ]
  },
  {
    id: 3,
    name: "Another Country",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to another country.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/another-country.mp3",
    verbPairs: [
      { question: "want to visit", response: "want to visit" },
      { question: "like to travel to", response: "like to travel to" },
      { question: "need to explore", response: "need to explore" }
    ],
    questions: [
      "Do you want to visit another country?",
      "Do you like to travel to another country?",
      "Do you need to explore another country?"
    ]
  },
  {
    id: 4,
    name: "Restaurant",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to a restaurant.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/restaurant.mp3",
    verbPairs: [
      { question: "like to eat at", response: "like to eat at" },
      { question: "want to try", response: "want to try" },
      { question: "need to celebrate at", response: "need to celebrate at" }
    ],
    questions: [
      "Do you like to eat at the restaurant?",
      "Do you want to try the restaurant?",
      "Do you need to celebrate at the restaurant?"
    ]
  },
  {
    id: 5,
    name: "School",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to school.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/school.mp3",
    verbPairs: [
      { question: "need to go to", response: "need to go to" },
      { question: "want to learn at", response: "want to learn at" },
      { question: "like to attend", response: "like to attend" }
    ],
    questions: [
      "Do you need to go to school?",
      "Do you want to learn at school?",
      "Do you like to attend school?"
    ]
  },
  {
    id: 6,
    name: "Work",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
    sentence: "I want to go to work.",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/work.mp3",
    verbPairs: [
      { question: "need to go to", response: "need to go to" },
      { question: "want to go to", response: "want to go to" },
      { question: "like to go to", response: "like to go to" }
    ],
    questions: [
      "Do you need to go to work?",
      "Do you want to go to work?",
      "Do you like to go to work?"
    ]
  }
];

// SUBSTITUTION PRACTICE I - Verbos da lição (CORRECTED)
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    base: "{0} the news in the morning.",
    options: ["I read", "She reads", "We read"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    base: "They like to go to the {0}.",
    options: ["coffee shop", "restaurant", "movies"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    base: "I want to go to the movies {0}.",
    options: ["today", "tomorrow", "this weekend"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    base: "We need to study {0}.",
    options: ["English", "Portuguese", "math"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    base: "She reads books every {0}.",
    options: ["night", "morning", "afternoon"],
    currentIndex: 0
  }
];

// SUBSTITUTION PRACTICE II - Pronúncia /θ/ e /ð/ (CORRECTED)
const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    base: "Thank you for {0}.",
    options: ["your help", "the cake", "the glass of water"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    base: "They need to go {0}.",
    options: ["now", "this way", "that way"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    base: "I live with my {0}.",
    options: ["mother", "father", "brother"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    base: "I have three {0}.",
    options: ["sisters", "brothers", "friends"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    base: "I understand {0} words.",
    options: ["these", "a few", "some"],
    currentIndex: 0
  }
];

// CHANGE INTO NEGATIVE
const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "I read the news every day.",
    answer: "I don't read the news every day."
  },
  { 
    key: "neg-2", 
    sentence: "They like coffee.",
    answer: "They don't like coffee."
  },
  { 
    key: "neg-3", 
    sentence: "We go to the coffee shop.",
    answer: "We don't go to the coffee shop."
  },
  { 
    key: "neg-4", 
    sentence: "I need to work today.",
    answer: "I don't need to work today."
  },
  { 
    key: "neg-5", 
    sentence: "She wants to study now.",
    answer: "She doesn't want to study now."
  },
  { 
    key: "neg-6", 
    sentence: "He goes to work early.",
    answer: "He doesn't go to work early."
  }
];

// CHANGE INTO AFFIRMATIVE
const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "I don't read the news every day.",
    answer: "I read the news every day."
  },
  { 
    key: "aff-2", 
    sentence: "We don't go to school in the evening.",
    answer: "We go to school in the evening."
  },
  { 
    key: "aff-3", 
    sentence: "They don't study at home.",
    answer: "They study at home."
  },
  { 
    key: "aff-4", 
    sentence: "I don't need help.",
    answer: "I need help."
  },
  { 
    key: "aff-5", 
    sentence: "She doesn't like coffee.",
    answer: "She likes coffee."
  }
];

// CHANGE INTO INTERROGATIVE
const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "You need to send messages to your family.",
    answer: "Do you need to send messages to your family?"
  },
  { 
    key: "int-2", 
    sentence: "She wants to go to the restaurant.",
    answer: "Does she want to go to the restaurant?"
  },
  { 
    key: "int-3", 
    sentence: "You like to study Portuguese.",
    answer: "Do you like to study Portuguese?"
  },
  { 
    key: "int-4", 
    sentence: "He understands English well.",
    answer: "Does he understand English well?"
  },
  { 
    key: "int-5", 
    sentence: "You have an American friend.",
    answer: "Do you have an American friend?"
  }
];

// PERSONAL QUESTIONS
const personalQuestions = [
  {
    id: 1,
    question: "Do you like to read the news on your cell phone or computer? Why?",
    placeholder: "Write about your preferred way to read news and explain why..."
  },
  {
    id: 2,
    question: "Where do you usually get information from?",
    placeholder: "Describe your sources of information (newspapers, websites, TV, etc.)..."
  },
  {
    id: 3,
    question: "Where do you want to go this weekend?",
    placeholder: "Tell about your plans for the weekend..."
  },
  {
    id: 4,
    question: "What time do you usually read the news?",
    placeholder: "Describe your daily routine regarding news consumption..."
  },
  {
    id: 5,
    question: "Do you prefer to go to the movies or stay at home? Why?",
    placeholder: "Explain your preference for entertainment..."
  },
  {
    id: 6,
    question: "What do you need to do today?",
    placeholder: "List your tasks and responsibilities for today..."
  },
  {
    id: 7,
    question: "How often do you go to coffee shops?",
    placeholder: "Describe your coffee shop habits..."
  },
  {
    id: 8,
    question: "Do you like to read books? What kind?",
    placeholder: "Talk about your reading preferences..."
  },
  {
    id: 9,
    question: "What time do you go to work or school?",
    placeholder: "Describe your daily schedule..."
  },
  {
    id: 10,
    question: "Do you have friends from other countries?",
    placeholder: "Share your experiences with international friendships..."
  }
];

// TUNE IN YOUR EARS - Vídeo sobre rotinas
const videoQuestions = [
  {
    id: 1,
    question: "What are the benefits of having a daily routine?",
    isPersonal: false,
    vocabulary: [
      { english: "structure", portuguese: "estrutura" },
      { english: "productivity", portuguese: "produtividade" },
      { english: "consistency", portuguese: "consistência" }
    ]
  },
  {
    id: 2,
    question: "How do you start your day?",
    isPersonal: true,
    vocabulary: [
      { english: "wake up", portuguese: "acordar" },
      { english: "breakfast", portuguese: "café da manhã" },
      { english: "morning routine", portuguese: "rotina matinal" }
    ]
  },
  {
    id: 3,
    question: "What time management tips did you learn from the video?",
    isPersonal: false,
    vocabulary: [
      { english: "schedule", portuguese: "agenda" },
      { english: "prioritize", portuguese: "priorizar" },
      { english: "deadline", portuguese: "prazo final" }
    ]
  },
  {
    id: 4,
    question: "How can a routine help with language learning?",
    isPersonal: false,
    vocabulary: [
      { english: "practice", portuguese: "prática" },
      { english: "regular study", portuguese: "estudo regular" },
      { english: "improvement", portuguese: "melhoria" }
    ]
  },
  {
    id: 5,
    question: "What part of your routine would you like to change?",
    isPersonal: true,
    vocabulary: [
      { english: "habit", portuguese: "hábito" },
      { english: "change", portuguese: "mudança" },
      { english: "goal", portuguese: "objetivo" }
    ]
  },
  {
    id: 6,
    question: "Do you think routines are boring or helpful? Why?",
    isPersonal: true,
    vocabulary: [
      { english: "monotonous", portuguese: "monótono" },
      { english: "efficient", portuguese: "eficiente" },
      { english: "balance", portuguese: "equilíbrio" }
    ]
  }
];

// Sistema de avaliação de respostas
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase().trim().replace(/[.,?!]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

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

// Componente para destaque de palavras
const HighlightedText = ({ 
  text, 
  highlightedWords, 
  onWordClick 
}: { 
  text: string; 
  highlightedWords: string[];
  onWordClick?: (word: string) => void;
}) => {
  const words = text.split(' ');
  
  return (
    <p className="text-gray-800">
      {words.map((word, index) => {
        const cleanWord = word.replace('?', '').replace('!', '').replace('.', '').replace('"', '').replace(',', '');
        const isHighlighted = highlightedWords.includes(cleanWord);
        
        return (
          <span
            key={index}
            className={isHighlighted ? "text-red-600 font-semibold cursor-pointer hover:bg-yellow-100 px-1 rounded" : ""}
            onClick={isHighlighted && onWordClick ? () => onWordClick(cleanWord) : undefined}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
};

// Componente para mostrar resultado da avaliação
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
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

// Mapeamento de palavras para áudio
const wordAudioMap: Record<string, string> = {
  "read": "https://raw.githubusercontent.com/your-repo/audio/main/read.mp3",
  "go": "https://raw.githubusercontent.com/your-repo/audio/main/go.mp3",
  "want": "https://raw.githubusercontent.com/your-repo/audio/main/want.mp3",
  "need": "https://raw.githubusercontent.com/your-repo/audio/main/need.mp3",
  "like": "https://raw.githubusercontent.com/your-repo/audio/main/like.mp3",
  "movies": "https://raw.githubusercontent.com/your-repo/audio/main/movies.mp3",
  "coffee": "https://raw.githubusercontent.com/your-repo/audio/main/coffee.mp3",
  "shop": "https://raw.githubusercontent.com/your-repo/audio/main/shop.mp3",
  "restaurant": "https://raw.githubusercontent.com/your-repo/audio/main/restaurant.mp3",
  "school": "https://raw.githubusercontent.com/your-repo/audio/main/school.mp3",
  "work": "https://raw.githubusercontent.com/your-repo/audio/main/work.mp3",
  "thank": "https://raw.githubusercontent.com/your-repo/audio/main/thank.mp3",
  "three": "https://raw.githubusercontent.com/your-repo/audio/main/three.mp3",
  "bathroom": "https://raw.githubusercontent.com/your-repo/audio/main/bathroom.mp3",
  "they": "https://raw.githubusercontent.com/your-repo/audio/main/they.mp3",
  "that": "https://raw.githubusercontent.com/your-repo/audio/main/that.mp3",
  "this": "https://raw.githubusercontent.com/your-repo/audio/main/this.mp3",
  "mother": "https://raw.githubusercontent.com/your-repo/audio/main/mother.mp3",
  "father": "https://raw.githubusercontent.com/your-repo/audio/main/father.mp3",
  "brother": "https://raw.githubusercontent.com/your-repo/audio/main/brother.mp3",
  "yes": "https://raw.githubusercontent.com/your-repo/audio/main/yes.mp3",
  "no": "https://raw.githubusercontent.com/your-repo/audio/main/no.mp3",
  "don't": "https://raw.githubusercontent.com/your-repo/audio/main/dont.mp3",
  "do": "https://raw.githubusercontent.com/your-repo/audio/main/do.mp3",
  "prefer": "https://raw.githubusercontent.com/your-repo/audio/main/prefer.mp3",
  "check": "https://raw.githubusercontent.com/your-repo/audio/main/check.mp3",
  "browse": "https://raw.githubusercontent.com/your-repo/audio/main/browse.mp3",
  "buy": "https://raw.githubusercontent.com/your-repo/audio/main/buy.mp3",
  "watch": "https://raw.githubusercontent.com/your-repo/audio/main/watch.mp3",
  "drink": "https://raw.githubusercontent.com/your-repo/audio/main/drink.mp3",
  "meet": "https://raw.githubusercontent.com/your-repo/audio/main/meet.mp3",
  "visit": "https://raw.githubusercontent.com/your-repo/audio/main/visit.mp3",
  "travel": "https://raw.githubusercontent.com/your-repo/audio/main/travel.mp3",
  "eat": "https://raw.githubusercontent.com/your-repo/audio/main/eat.mp3",
  "try": "https://raw.githubusercontent.com/your-repo/audio/main/try.mp3",
  "study": "https://raw.githubusercontent.com/your-repo/audio/main/study.mp3",
  "learn": "https://raw.githubusercontent.com/your-repo/audio/main/learn.mp3",
  "earn": "https://raw.githubusercontent.com/your-repo/audio/main/earn.mp3"
};

export default function LessonPersonalInfoRoutine() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    speakNow: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    questions: true,
    tuneIn: true
  });

  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  
  // Estados para as respostas escritas
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  
  // Estados para avaliação de respostas
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  // Estado para respostas do vídeo
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [videoAnswerResults, setVideoAnswerResults] = useState<Record<number, boolean>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson16Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        // Restaurar todos os estados
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setVideoAnswerResults(data.videoAnswerResults || {});
        setShowVideoAnswerResults(data.showVideoAnswerResults || {});
        
        // Restaurar estado das seções
        if (data.sections) setSections(data.sections);
        
        console.log("Dados carregados do localStorage para Lesson 16");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = async () => {
    const data = {
      // Dados das práticas de substituição
      subs1Exercises,
      subs2Exercises,
      
      // Respostas escritas
      writtenAnswers,
      videoAnswers,
      
      // Resultados de avaliação
      answerResults,
      showAnswerResults,
      videoAnswerResults,
      showVideoAnswerResults,
      
      // Estado das seções
      sections,
      
      // Metadados
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 16 - Personal Information & Routine",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson16Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!\nVocê pode voltar a qualquer momento e elas estarão aqui.");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas. Por favor, tente novamente.");
    }
  };

  // Função para limpar todas as respostas
  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas? Esta ação não pode ser desfeita.")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setVideoAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setVideoAnswerResults({});
      setShowVideoAnswerResults({});
      
      // Limpar do localStorage também
      localStorage.removeItem("lesson16Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO DE ESTADOS
  // ==============================
  const handleSubs1OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs1Exercises(prev => 
      prev.map(exercise => 
        exercise.key === exerciseKey 
          ? { ...exercise, currentIndex: optionIndex }
          : exercise
      )
    );
  };

  const handleSubs2OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs2Exercises(prev => 
      prev.map(exercise => 
        exercise.key === exerciseKey 
          ? { ...exercise, currentIndex: optionIndex }
          : exercise
      )
    );
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Função para verificar respostas
  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  // Função para tocar áudio quando palavras são clicadas
  const handleWordClick = (word: string) => {
    const audioSrc = wordAudioMap[word.toLowerCase()];
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(err => console.error("Error playing word audio:", err));
    }
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Funções para a seção TUNE IN YOUR EARS
  const handleVideoAnswerChange = (questionId: number, answer: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkVideoAnswer = (questionId: number) => {
    const question = videoQuestions.find(q => q.id === questionId);
    if (question?.isPersonal) {
      setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
      return;
    }
    
    setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/routine-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📱 Lesson 16 – Personal Information & Routine</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Talk about daily routines, practice common verbs in simple present, and improve your pronunciation of 'th' sounds.
          </p>
        </div>

        {/* SPEAK RIGHT NOW - REDESIGNED WITH 3 STATIC EXAMPLES */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-[30px] shadow-2xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-2 rounded-full">
                <Volume2 size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW</h2>
                <p className="text-blue-100 text-sm mt-1">Practice with real-life examples</p>
              </div>
            </div>
            <button 
              onClick={() => toggleSection('speakNow')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {speakNowExamples.map((example) => (
                  <div key={example.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={example.image} 
                        alt={example.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{example.name}</h3>
                        <p className="text-blue-100 text-sm">{example.description}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm font-semibold text-blue-700 mb-1">Question:</p>
                        <p className="text-gray-800 font-medium">"{example.question}"</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm font-semibold text-green-700 mb-1">Answer:</p>
                        <HighlightedText 
                          text={example.answer} 
                          highlightedWords={["Yes", "No", "like", "want", "need", "read", "go"]}
                          onWordClick={handleWordClick}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>Click red words to hear pronunciation</span>
                        </div>
                        <SimpleAudioPlayer src={`https://raw.githubusercontent.com/your-repo/audio/main/${example.name.toLowerCase().replace(' ', '-')}.mp3`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 text-white p-1 rounded-full">
                    <Volume2 size={16} />
                  </span>
                  Practice Instructions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <h4 className="font-bold text-blue-700">1. Read Aloud</h4>
                    </div>
                    <p className="text-sm text-gray-600">Practice reading the questions and answers out loud to improve your speaking fluency.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h4 className="font-bold text-green-700">2. Listen & Repeat</h4>
                    </div>
                    <p className="text-sm text-gray-600">Click the audio buttons to hear the correct pronunciation and repeat after.</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-red-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <h4 className="font-bold text-red-700">3. Click Words</h4>
                    </div>
                    <p className="text-sm text-gray-600">Click on red words in the answers to hear their individual pronunciation.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE I - Verbos */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I - VERBS</h2>
              <button 
                onClick={() => toggleSection('substitution1')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  ✍️ Substitution Practice – Click on the options to change the sentences:
                </h3>
                
                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <p className="text-green-700 font-medium text-lg">{currentSentence}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs1OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                exercise.currentIndex === index
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO NEGATIVE */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  ⛔ Change into Negative – Transform to negative:
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write negative form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[exercise.key] && (
                        <AnswerResult 
                          isCorrect={answerResults[exercise.key]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE II - Pronúncia */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔤 SUBSTITUTION PRACTICE II - PRONUNCIATION</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  🔊 Improve Your Pronunciation – /θ/ and /ð/ sounds – Click to substitute:
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    const audioKey = exercise.options[exercise.currentIndex].toLowerCase().replace(/ /g, '-');
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="mb-3 p-3 bg-purple-50 rounded-md">
                          <p className="text-purple-700 font-medium text-lg">{currentSentence}</p>
                          <div className="mt-2">
                            <SimpleAudioPlayer src={wordAudioMap[exercise.options[exercise.currentIndex].toLowerCase().split(' ')[0]] || ""} />
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs2OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                exercise.currentIndex === index
                                  ? 'bg-purple-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button 
                onClick={() => toggleSection('affirmative')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">
                  Change into Affirmative - Transform to affirmative:
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write affirmative form..."
                          value={writtenAnswers[`aff-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`aff-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`aff-${exercise.key}`, writtenAnswers[`aff-${exercise.key}`] || "", exercise.answer)}
                          className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[`aff-${exercise.key}`] && (
                        <AnswerResult 
                          isCorrect={answerResults[`aff-${exercise.key}`]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">
                  Change into Interrogative - Transform to questions:
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write question form..."
                          value={writtenAnswers[`int-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`int-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)}
                          className="bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[`int-${exercise.key}`] && (
                        <AnswerResult 
                          isCorrect={answerResults[`int-${exercise.key}`]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUESTIONS */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-indigo-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 QUESTIONS ABOUT ROUTINE & INFORMATION</h2>
              <button 
                onClick={() => toggleSection('questions')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">
                  Answer these personal questions about your routine and information habits:
                </h3>
                <p className="text-indigo-600 mb-6">
                  Practice writing about your daily life, preferences, and habits.
                </p>
              </div>

              <div className="space-y-6">
                {personalQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-md">
                    <h4 className="text-lg font-bold text-indigo-700 mb-3">
                      {question.question}
                    </h4>
                    
                    <textarea
                      value={writtenAnswers[`q-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`q-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-24 p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">💡 Writing Tips for Personal Information:</h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 text-sm">
                  <li>Use simple present tense for routines and habits</li>
                  <li>Include time expressions: every day, in the morning, on weekends</li>
                  <li>Practice using different verbs: read, go, want, need, like</li>
                  <li>Describe your preferences and reasons</li>
                  <li>Talk about your sources of information and entertainment</li>
                  <li>Save your answers to track your progress in personal expression</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">
                  Watch the video about daily routines and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/yWDcmPYP-r8"
                      title="English Listening Practice - Daily Routines"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: English Listening Practice - Daily Routines & Conversations</p>
                </div>
              </div>

              {/* Vocabulary Help */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Daily routine</span>
                      <span className="text-teal-600">Rotina diária</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Wake up</span>
                      <span className="text-teal-600">Acordar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Breakfast</span>
                      <span className="text-teal-600">Café da manhã</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Go to work</span>
                      <span className="text-teal-600">Ir trabalhar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Lunch break</span>
                      <span className="text-teal-600">Intervalo para almoço</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Come home</span>
                      <span className="text-teal-600">Voltar para casa</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Dinner</span>
                      <span className="text-teal-600">Jantar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Relax</span>
                      <span className="text-teal-600">Relaxar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Go to bed</span>
                      <span className="text-teal-600">Ir dormir</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Weekend</span>
                      <span className="text-teal-600">Fim de semana</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Free time</span>
                      <span className="text-teal-600">Tempo livre</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Hobbies</span>
                      <span className="text-teal-600">Hobbies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3">
                      {question.question}
                      {question.isPersonal && (
                        <span className="ml-2 text-sm font-normal text-teal-500">(Personal answer)</span>
                      )}
                    </h4>
                   
                    {question.vocabulary && (
                      <div className="mb-3 p-3 bg-teal-50 rounded-lg">
                        <p className="text-sm font-medium text-teal-600 mb-1">Vocabulary hints:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-teal-700 font-medium">{word.english}</span>
                              <span className="text-teal-600">- {word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={videoAnswers[question.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => checkVideoAnswer(question.id)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition font-medium"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => handleVideoAnswerChange(question.id, "")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
                      >
                        Clear
                      </button>
                    </div>

                    {showVideoAnswerResults[question.id] && question.isPersonal && (
                      <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
                        <p className="text-sm text-teal-700">
                          <span className="font-medium">Note:</span> This is a personal question. Your answer has been saved for practice.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">🎯 Listening Practice Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li>Watch the video at least twice - first for general understanding, then for details</li>
                  <li>Pay attention to daily routine vocabulary and expressions</li>
                  <li>Note down phrases you can use in your own conversations</li>
                  <li>Practice repeating the sentences to improve pronunciation</li>
                  <li>Try to describe your own routine using the vocabulary from the video</li>
                  <li>Focus on understanding the main ideas rather than every single word</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Save Button and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2"
            >
              <span>💾</span> Save All My Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300"
            >
              Clear All
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson15")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson17")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}