"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle } from "lucide-react";

// Dados da Lição 10 - Atualizados com o conteúdo fornecido
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu entendo meu colega de classe. / meu amigo / professor",
    base: "I understand my {0}.",
    options: ["classmate", "friend", "teacher"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Nós moramos aqui. / neste país / nesta cidade",
    base: "We live {0}.",
    options: ["here", "in this country", "in this city"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Eles preferem estudar sozinhos. / com você / comigo",
    base: "They prefer to study {0}.",
    options: ["alone", "with you", "with me"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Eu quero estudar inglês no exterior. / Nós / Eles",
    base: "{0} want to study English abroad.",
    options: ["I", "We", "They"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Elas falam italiano. E você? / alemão / português",
    base: "They speak {0}. And you?",
    options: ["Italian", "German", "Portuguese"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "Nós preferimos beber leite no café da manhã. / Eles / Eu",
    correctAnswer: "We prefer to drink milk for breakfast.",
    options: ["We", "They", "I"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Qual é o seu nome? / sobrenome / nome completo",
    correctAnswer: "What's {0}?",
    options: ["your name", "your last name", "your full name"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Elas não estudam na escola de manhã. / Nós / Eu",
    correctAnswer: "They don't study at school in the morning.",
    options: ["They", "We", "I"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Onde você mora? / estuda / quer estudar",
    correctAnswer: "Where do you {0}?",
    options: ["live", "study", "want to study"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "Você gosta de estudar nos Estados Unidos? / na Alemanha / no Brasil",
    correctAnswer: "Do you like to study {0}?",
    options: ["in the United States", "in Germany", "in Brazil"],
    currentIndex: 0
  }
];

const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "I want to live in this country.",
    answer: "I don't want to live in this country."
  },
  { 
    key: "neg-2", 
    sentence: "We speak Spanish at school.",
    answer: "We don't speak Spanish at school."
  },
  { 
    key: "neg-3", 
    sentence: "I understand that word.",
    answer: "I don't understand that word."
  },
  { 
    key: "neg-4", 
    sentence: "They like this city.",
    answer: "They don't like this city."
  },
  { 
    key: "neg-5", 
    sentence: "We want to live in the U.S.A.",
    answer: "We don't want to live in the U.S.A."
  },
  { 
    key: "neg-6", 
    sentence: "I speak this language.",
    answer: "I don't speak this language."
  }
];

const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "She doesn't understand that word.",
    answer: "She understands that word."
  },
  { 
    key: "aff-2", 
    sentence: "He doesn't study Italian in the afternoon.",
    answer: "He studies Italian in the afternoon."
  },
  { 
    key: "aff-3", 
    sentence: "They don't eat chicken sandwiches.",
    answer: "They eat chicken sandwiches."
  },
  { 
    key: "aff-4", 
    sentence: "We don't speak Spanish with our classmates.",
    answer: "We speak Spanish with our classmates."
  },
  { 
    key: "aff-5", 
    sentence: "It doesn't work properly.",
    answer: "It works properly."
  },
  { 
    key: "aff-6", 
    sentence: "You don't study German with your teacher.",
    answer: "You study German with your teacher."
  }
];

const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "She lives in Brazil with her friend.",
    answer: "Does she live in Brazil with her friend?"
  },
  { 
    key: "int-2", 
    sentence: "They understand Spanish and Italian.",
    answer: "Do they understand Spanish and Italian?"
  },
  { 
    key: "int-3", 
    sentence: "He prefers to study in the morning.",
    answer: "Does he prefer to study in the morning?"
  },
  { 
    key: "int-4", 
    sentence: "You like to eat vegetables for lunch.",
    answer: "Do you like to eat vegetables for lunch?"
  },
  { 
    key: "int-5", 
    sentence: "We want to speak with your teacher.",
    answer: "Do we want to speak with your teacher?"
  },
  { 
    key: "int-6", 
    sentence: "It works very well.",
    answer: "Does it work very well?"
  }
];

const unlockQuestions = [
  {
    id: 1,
    question: "Where do you want to live?",
    placeholder: "Write about places where you want to live..."
  },
  {
    id: 2,
    question: "Which languages don't you understand?",
    placeholder: "List languages you don't understand and explain why..."
  },
  {
    id: 3,
    question: "How do you greet your friends?",
    placeholder: "Describe different ways you greet friends..."
  },
  {
    id: 4,
    question: "What do you like to eat for lunch and dinner?",
    placeholder: "Describe your favorite lunch and dinner foods..."
  }
];

// Video questions for Tune In Your Ears section
const videoQuestions = [
  {
    id: "video-1",
    question: "What is the 'easiest way' to practice English according to the video?",
    isPersonal: false,
    vocabulary: [
      { english: "easiest way", portuguese: "jeito mais fácil" },
      { english: "according to", portuguese: "de acordo com" },
      { english: "practice", portuguese: "praticar" }
    ]
  },
  {
    id: "video-2",
    question: "What are some tips mentioned to improve your listening skills?",
    isPersonal: false,
    vocabulary: [
      { english: "tips", portuguese: "dicas" },
      { english: "mentioned", portuguese: "mencionadas" },
      { english: "improve", portuguese: "melhorar" },
      { english: "listening skills", portuguese: "habilidades de compreensão auditiva" }
    ]
  },
  {
    id: "video-3",
    question: "What does the speaker say about 'accents' and 'slangs'?",
    isPersonal: false,
    vocabulary: [
      { english: "accents", portuguese: "sotaques" },
      { english: "slangs", portuguese: "gírias" },
      { english: "a mix of", portuguese: "uma mistura de" }
    ]
  },
  {
    id: "video-4",
    question: "What is your daily routine for practicing English?",
    isPersonal: true,
    vocabulary: [
      { english: "daily routine", portuguese: "rotina diária" },
      { english: "to have fun", portuguese: "se divertir" },
      { english: "habit", portuguese: "hábito" }
    ]
  },
  {
    id: "video-5",
    question: "What does 'it's a piece of cake' mean? Can you use it in a sentence?",
    isPersonal: false,
    vocabulary: [
      { english: "it's a piece of cake", portuguese: "é muito fácil" },
      { english: "meaning", portuguese: "significado" }
    ]
  },
  {
    id: "video-6",
    question: "How can watching movies and series help with your English?",
    isPersonal: true,
    vocabulary: [
      { english: "movies", portuguese: "filmes" },
      { english: "series", portuguese: "séries" },
      { english: "tone and emotion", portuguese: "tom e emoção" }
    ]
  },
  {
    id: "video-7",
    question: "What does the speaker mean by 'the more you listen, the better you'll get'?",
    isPersonal: false,
    vocabulary: [
      { english: "the more you listen", portuguese: "quanto mais você ouve" },
      { english: "the better you'll get", portuguese: "melhor você vai ficar" }
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
        const cleanWord = word.replace('?', '').replace('!', '').replace('.', '').replace('"', '');
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

// Mapeamento de países para idiomas
const countryLanguageMap: Record<string, { language: string; spelling: string; audioSrc: string }> = {
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": {
    language: "Portuguese", 
    spelling: "B-R-A-Z-I-L",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/portuguese.mp3"
  },
  "https://i.ibb.co/7xnjGkDN/italian-flag.jpg": {
    language: "Italian",
    spelling: "I-T-A-L-Y",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/italian.mp3"
  },
  "https://i.ibb.co/21VkwN19/spanish-fla.jpg": {
    language: "Spanish",
    spelling: "S-P-A-I-N",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/spanish.mp3"
  },
  "https://i.ibb.co/kskr0zmq/german-flag.jpg": {
    language: "German",
    spelling: "G-E-R-M-A-N-Y",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/german.mp3"
  },
  "https://i.ibb.co/qLL8CKv5/american-flag.jpg": {
    language: "English",
    spelling: "U-N-I-T-E-D S-T-A-T-E-S",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/english.mp3"
  },
  "https://i.ibb.co/dwjk9s3S/france-flag.jpg": {
    language: "French",
    spelling: "F-R-A-N-C-E",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/french.mp3"
  }
};

// Mapeamento de comidas para países
const foodCountryMap: Record<string, { country: string; food: string; audioSrc: string }> = {
  "https://i.ibb.co/kskr0zmq/german-flag.jpg": {
    country: "Germany",
    food: "sausages",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/sausages.mp3"
  },
  "https://i.ibb.co/7xnjGkDN/italian-flag.jpg": {
    country: "Italy", 
    food: "pizza",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/pizza.mp3"
  },
  "https://i.ibb.co/21VkwN19/spanish-fla.jpg": {
    country: "Spain",
    food: "paella",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/paella.mp3"
  },
  "https://i.ibb.co/qLL8CKv5/american-flag.jpg": {
    country: "United States",
    food: "hamburger",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/hamburger.mp3"
  },
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": {
    country: "Brazil",
    food: "feijoada",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/feijoada.mp3"
  },
  "https://i.ibb.co/dwjk9s3S/france-flag.jpg": {
    country: "France",
    food: "croissant",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/croissant.mp3"
  }
};

// Mapeamento de comidas para spelling
const foodSpellingMap: Record<string, { food: string; spelling: string; audioSrc: string }> = {
  "https://i.ibb.co/8LF0pHjv/yogurt.jpg": {
    food: "yogurt",
    spelling: "Y-O-G-U-R-T",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/yogurt.mp3"
  },
  "https://i.ibb.co/99zBTC4q/sandwich.jpg": {
    food: "sandwich",
    spelling: "S-A-N-D-W-I-C-H",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/sandwich.mp3"
  },
  "https://i.ibb.co/W4kNfZ2F/cookies.jpg": {
    food: "cookies",
    spelling: "C-O-O-K-I-E-S",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/cookies.mp3"
  },
  "https://i.ibb.co/pjYHqBsc/juice.jpg": {
    food: "juice",
    spelling: "J-U-I-C-E",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/juice.mp3"
  },
  "https://i.ibb.co/jvg8bfKY/orange-juice.jpg": {
    food: "orange juice",
    spelling: "O-R-A-N-G-E J-U-I-C-E",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/orange_juice.mp3"
  },
  "https://i.ibb.co/HfCPk3qD/friends.jpg": {
    food: "friends",
    spelling: "F-R-I-E-N-D-S",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/friends.mp3"
  }
};

export default function Lesson10LanguagesAndCountries() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    talkToFriend: true,
    vocabulary: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    unlock: true,
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

  // Estados para as respostas do vídeo
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<string, boolean>>({});

  // Estado para diálogos dinâmicos baseados na seleção
  const [practiceDialogs] = useState([
    {
      question: "Do you want to speak Portuguese or French with me?",
      response: "I want to speak Portuguese with you.",
      highlighted: ["Portuguese", "French", "Portuguese"]
    },
    {
      question: "How do you spell 'yogurt'?",
      response: "Y-O-G-U-R-T",
      highlighted: ["yogurt", "Y", "O", "G", "U", "R", "T"]
    }
  ]);

  // Diálogo principal da lição
  const mainDialogue = [
    { speaker: "Zoey", text: "Hi, Mike.", audioSrc: "" },
    { speaker: "Mike", text: "Hello, Zoey. What's up?", audioSrc: "" },
    { speaker: "Zoey", text: "Mike, do you speak Spanish?", audioSrc: "" },
    { speaker: "Mike", text: "A little.", audioSrc: "" },
    { speaker: "Zoey", text: "I don't understand this word. Queso?", audioSrc: "" },
    { speaker: "Mike", text: "Ah, queso is cheese.", audioSrc: "" },
    { speaker: "Zoey", text: "Got it! Thank you. Where do you study Spanish?", audioSrc: "" },
    { speaker: "Mike", text: "I study Spanish at LEAF. What about you?", audioSrc: "" },
    { speaker: "Zoey", text: "I study alone. I want to live in Spain.", audioSrc: "" },
    { speaker: "Mike", text: "Do you want to study Spanish with me?", audioSrc: "" },
    { speaker: "Zoey", text: "Yes!", audioSrc: "" },
    { speaker: "Mike", text: "Great! See you later!", audioSrc: "" },
    { speaker: "Zoey", text: "See you!", audioSrc: "" }
  ];

  // Vocabulário
  const vocabulary = [
    { word: "a little", translation: "um pouco", audioSrc: "" },
    { word: "I get", translation: "eu entendo", audioSrc: "" }
  ];

  useEffect(() => {
    // Carregar respostas salvas do localStorage
    const savedAnswers = localStorage.getItem("lesson10Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    }
  }, []);

  const saveAllAnswers = async () => {
    const data = {
      subs1Exercises,
      subs2Exercises,
      writtenAnswers,
      videoAnswers,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem("lesson10Answers", JSON.stringify(data));
    alert("All answers saved successfully to your browser!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all your answers?")) {
      setWrittenAnswers({});
      setVideoAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setShowVideoAnswerResults({});
      localStorage.removeItem("lesson10Answers");
      alert("All answers cleared!");
    }
  };

  // Funções para manipular as práticas de substituição
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

  const handleVideoAnswerChange = (key: string, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Função para verificar respostas
  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  const checkVideoAnswer = (questionId: string) => {
    setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
  };

  // Função para tocar áudio quando palavras são clicadas
  const handleWordClick = (word: string) => {
    // Buscar o áudio correspondente à palavra
    const audioSrc = getAudioForWord(word);
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch(err => console.error("Error playing word audio:", err));
    }
  };

  // Função auxiliar para obter áudio baseado na palavra
  const getAudioForWord = (word: string): string | null => {
    // Verificar se é um idioma
    const countryEntry = Object.values(countryLanguageMap).find(
      info => info.language.toLowerCase() === word.toLowerCase()
    );
    if (countryEntry) return countryEntry.audioSrc;

    // Verificar se é um país
    const countrySpelling = Object.values(countryLanguageMap).find(
      info => info.spelling.replace(/-/g, '') === word.toUpperCase()
    );
    if (countrySpelling) return countrySpelling.audioSrc;

    // Verificar se é uma comida do spelling
    const foodSpellingEntry = Object.values(foodSpellingMap).find(
      info => info.food.toLowerCase() === word.toLowerCase() || 
             info.spelling.replace(/-/g, ' ').includes(word.toUpperCase())
    );
    if (foodSpellingEntry) return foodSpellingEntry.audioSrc;

    // Verificar se é uma comida tradicional
    const foodEntry = Object.values(foodCountryMap).find(
      info => info.food.toLowerCase() === word.toLowerCase()
    );
    if (foodEntry) return foodEntry.audioSrc;

    return null;
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Image com overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2833&q=80')`,
        }}
      />
      {/* Overlay escuro para melhor legibilidade */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-[40px] p-6 md:p-10 shadow-2xl">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-4 md:mb-6">🌍 Lesson 10 – Languages & Countries</h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Talk to your friend and practice conversations about languages, countries, and daily life. Improve your communication skills.
          </p>
        </div>

        {/* TALK TO YOUR FRIEND */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">💬 TALK TO YOUR FRIEND</h2>
              <button 
                onClick={() => toggleSection('talkToFriend')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.talkToFriend ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.talkToFriend && (
            <div className="p-6 md:p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 md:p-6 mb-6">
                <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-4">
                  Practice this conversation between Zoey and Mike:
                </h3>
                
                <div className="space-y-4 bg-white p-4 md:p-6 rounded-lg border border-purple-200">
                  {mainDialogue.map((line, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                      <div className={`font-bold ${
                        line.speaker === "Zoey" ? "text-pink-600" : "text-blue-600"
                      }`}>
                        {line.speaker}:
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{line.text}</p>
                        {line.audioSrc && <SimpleAudioPlayer src={line.audioSrc} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TAKE A LOOK - VOCABULARY */}
        <div className="bg-blue-50/80 border-2 border-blue-200 rounded-xl shadow-sm mb-8 md:mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-3 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">📘 VOCABULARY</h2>
              <button 
                onClick={() => toggleSection('vocabulary')}
                className="ml-3 p-1 rounded-full hover:bg-blue-600 transition"
              >
                {sections.vocabulary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {sections.vocabulary && (
            <div className="p-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <h3 className="text-md font-semibold text-blue-800 mb-3">
                  Essential vocabulary for this lesson:
                </h3>
                
                <div className="grid md:grid-cols-2 gap-3">
                  {vocabulary.map((item, index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                      <div>
                        <p className="font-medium text-blue-700 text-sm">{item.word}</p>
                        <p className="text-gray-600 text-xs">{item.translation}</p>
                      </div>
                      {item.audioSrc && <SimpleAudioPlayer src={item.audioSrc} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button 
                onClick={() => toggleSection('substitution1')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-6 md:p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">
                  ✍️ Substitution Practice I – 3' - Click on the options to change the sentences:
                </h3>
                
                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-green-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <p className="text-green-700 font-medium">{currentSentence}</p>
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
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-6 md:p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-red-800 mb-4">
                  ⛔ Change into Negative – 2' - Transform to negative:
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
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

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE II */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-6 md:p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-orange-800 mb-4">
                  🔄 Substitution Practice II – 3' - Click to substitute:
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const baseSentence = exercise.correctAnswer.split(' ').map(word => {
                      const cleanWord = word.replace('.', '').replace('?', '');
                      return exercise.options.includes(cleanWord) ? '{0}' : word;
                    }).join(' ');
                    
                    const currentSentence = baseSentence.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-orange-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-orange-50 rounded-md">
                          <p className="text-orange-700 font-medium">{currentSentence}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs2OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                exercise.currentIndex === index
                                  ? 'bg-orange-500 text-white'
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
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button 
                onClick={() => toggleSection('affirmative')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-6 md:p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">
                  Change into Affirmative - 2' - Transform to affirmative:
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write affirmative form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm"
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

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-6 md:p-8">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-4">
                  Change into Interrogative - 2' - Transform to questions:
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-indigo-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write question form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 transition text-sm"
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

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg overflow-hidden mb-8 md:mb-10">
          <div className="bg-pink-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔓 UNLOCK</h2>
              <button 
                onClick={() => toggleSection('unlock')}
                className="ml-4 p-2 rounded-full hover:bg-pink-600 transition"
              >
                {sections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.unlock && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-bold text-pink-800 mb-4">
                  Unlock - 3' - Give examples of:
                </h3>
                <p className="text-pink-600 mb-6">
                  Practice writing about different topics to improve your communication skills.
                </p>
              </div>

              <div className="space-y-6">
                {unlockQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-pink-200 shadow-md">
                    <h4 className="text-base md:text-lg font-bold text-pink-700 mb-3">
                      {question.question}
                    </h4>
                    
                    <textarea
                      value={writtenAnswers[`unlock-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`unlock-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-pink-100 border-2 border-pink-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-pink-800 mb-4">💡 Writing Tips for Communication:</h3>
                <ul className="list-disc pl-5 space-y-2 text-pink-700 text-sm">
                  <li>Be specific about places, languages, and foods</li>
                  <li>Use complete sentences to practice grammar</li>
                  <li>Describe your preferences and reasons</li>
                  <li>Practice different ways to greet people</li>
                  <li>Talk about your daily routines and habits</li>
                  <li>Save your answers to track your progress in communication</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS - NOVA SEÇÃO COM VÍDEO */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-8 md:mb-10">
          <div className="bg-teal-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-teal-700 mb-4">
                  Watch the video and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src="https://www.youtube.com/embed/q5JxLYzO5k4?list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=40"
                      title="English Listening Practice - Daily Routines & Conversations"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: English Listening Practice - Daily Routines & Conversations</p>
                </div>
              </div>

              {/* Vocabulary Help */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Trick</span>
                      <span className="text-teal-600">Truque / Técnica</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">The easiest way</span>
                      <span className="text-teal-600">O jeito mais fácil</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Have you ever heard?</span>
                      <span className="text-teal-600">Você já ouviu?</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">over time</span>
                      <span className="text-teal-600">ao passar do tempo</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Habit</span>
                      <span className="text-teal-600">Hábito</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To have fun</span>
                      <span className="text-teal-600">Se divertir</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Accents</span>
                      <span className="text-teal-600">Sotaques</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">A mix of accents</span>
                      <span className="text-teal-600">Uma mistura de sotaques</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Slangs</span>
                      <span className="text-teal-600">Gírias</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Kind</span>
                      <span className="text-teal-600">Tipo</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">It's a piece of cake</span>
                      <span className="text-teal-600">Isso é muito fácil</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">tone and emotion</span>
                      <span className="text-teal-600">tom e emoção</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Sarcastic</span>
                      <span className="text-teal-600">Sarcástico</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">It depends on</span>
                      <span className="text-teal-600">Depende de</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">You'll be / You will be</span>
                      <span className="text-teal-600">Você vai estar / Você estará</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Probably not</span>
                      <span className="text-teal-600">Provavelmente não</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To turn on</span>
                      <span className="text-teal-600">Ligar (um aparelho)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To procrastinate</span>
                      <span className="text-teal-600">Procrastinar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">A must</span>
                      <span className="text-teal-600">algo que você deve fazer</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">maybe you're ordering food</span>
                      <span className="text-teal-600">Talvez você esteja pedindo comida</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">So, let's sum it all up</span>
                      <span className="text-teal-600">Então, para resumir ...</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">The more you listen, the better you'll get</span>
                      <span className="text-teal-600">Quanto mais você ouve, melhor você vai ficar.</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Daily routine</span>
                      <span className="text-teal-600">Rotina diária.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-base md:text-lg font-bold text-teal-700 mb-3">
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

                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
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

              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">🎯 Listening Practice Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li>Watch the video at least twice - first for general understanding, then for details</li>
                  <li>Pause the video to repeat phrases you hear</li>
                  <li>Pay attention to pronunciation and intonation patterns</li>
                  <li>Note down new vocabulary while watching</li>
                  <li>Try to answer the questions without looking at the subtitles first</li>
                  <li>Practice speaking your answers out loud to improve fluency</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Save Button and Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-8 rounded-full text-base md:text-lg transition duration-300 flex items-center justify-center gap-2"
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
              onClick={() => router.push("/cursos/lesson9")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors text-sm md:text-base"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson11")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors text-sm md:text-base"
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}