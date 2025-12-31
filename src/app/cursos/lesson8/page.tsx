"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle } from "lucide-react";

// Dados atualizados para focar em idiomas e países
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eles estudam inglês na escola. / Nós / Eu",
    base: "{0} study English at school.",
    options: ["They", "We", "I"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Você fala francês também? / alemão / italiano",
    base: "Do you speak {0} too?",
    options: ["French", "German", "Italian"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Ela gosta de estudar com seu amigo. / seu professor / suas amigas",
    base: "She likes to study with {0}.",
    options: ["her friend", "her teacher", "her friends"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Como se escreve 'milk'? / apple / butter",
    base: "How do you spell '{0}'?",
    options: ["milk", "apple", "butter"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Nós preferimos estudar de manhã. / à tarde",
    base: "We prefer to study {0}.",
    options: ["in the morning", "in the afternoon"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "Ele não quer beber suco no café da manhã. /água/leite",
    correctAnswer: "He doesn't want to drink juice for breakfast.",
    options: ["juice", "water", "milk"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Eles preferem comer salada. /Eu/Nós",
    correctAnswer: "They prefer to eat salad.",
    options: ["They", "I", "We"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Nós queremos comer uma fatia de torta. /queijo/pão",
    correctAnswer: "We want to eat a slice of pie.",
    options: ["pie", "cheese", "bread"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Ela ama comer batatas fritas. E você?/torradas/geleia",
    correctAnswer: "She loves to eat french fries. And you?",
    options: ["french fries", "toast", "jam"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "Eu não estudo português aqui. / lá/na escola",
    correctAnswer: "I don't study Portuguese here.",
    options: ["here", "there", "at school"],
    currentIndex: 0
  }
];

const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "She studies French in the afternoon.",
    answer: "She doesn't study French in the afternoon."
  },
  { 
    key: "neg-2", 
    sentence: "He eats bread and butter in the morning.",
    answer: "He doesn't eat bread and butter in the morning."
  },
  { 
    key: "neg-3", 
    sentence: "They want to eat eggs for breakfast.",
    answer: "They don't want to eat eggs for breakfast."
  },
  { 
    key: "neg-4", 
    sentence: "We drink a cup of tea in the afternoon.",
    answer: "We don't drink a cup of tea in the afternoon."
  },
  { 
    key: "neg-5", 
    sentence: "He likes to eat fish.",
    answer: "He doesn't like to eat fish."
  },
  { 
    key: "neg-6", 
    sentence: "She speaks English with her teacher.",
    answer: "She doesn't speak English with her teacher."
  }
];

const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "He doesn't eat sausages for breakfast.",
    answer: "He eats sausages for breakfast."
  },
  { 
    key: "aff-2", 
    sentence: "She doesn't like to drink apple juice.",
    answer: "She likes to drink apple juice."
  },
  { 
    key: "aff-3", 
    sentence: "They don't eat salad for lunch.",
    answer: "They eat salad for lunch."
  },
  { 
    key: "aff-4", 
    sentence: "He doesn't speak Portuguese at school.",
    answer: "He speaks Portuguese at school."
  },
  { 
    key: "aff-5", 
    sentence: "We don't study with your teacher.",
    answer: "We study with your teacher."
  }
];

const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "He speaks Italian with his friend.",
    answer: "Does he speak Italian with his friend?"
  },
  { 
    key: "int-2", 
    sentence: "She prefers to study English.",
    answer: "Does she prefer to study English?"
  },
  { 
    key: "int-3", 
    sentence: "They want to drink a glass of water.",
    answer: "Do they want to drink a glass of water?"
  },
  { 
    key: "int-4", 
    sentence: "We want to study there.",
    answer: "Do we want to study there?"
  },
  { 
    key: "int-5", 
    sentence: "He wants to eat beef.",
    answer: "Does he want to eat beef?"
  }
];

const personalQuestions = [
  {
    id: 1,
    question: "Do you speak English with your friends from other countries?",
    placeholder: "Write about which languages you speak with international friends..."
  },
  {
    id: 2,
    question: "How do you spell the name of your favorite country?",
    placeholder: "Spell the country name here..."
  },
  {
    id: 3,
    question: "Do you prefer to study languages in the morning or afternoon?",
    placeholder: "Write your preference and explain why..."
  },
  {
    id: 4,
    question: "What traditional food from another country do you like?",
    placeholder: "Describe a foreign dish you enjoy..."
  },
  {
    id: 5,
    question: "Do you want to visit Germany or Italy? Why?",
    placeholder: "Explain your choice and reasons..."
  },
  {
    id: 6,
    question: "Which language do you study at school besides Portuguese?",
    placeholder: "Tell about your language studies at school..."
  },
  {
    id: 7,
    question: "What do you like to learn about different cultures?",
    placeholder: "Describe cultural aspects that interest you..."
  },
  {
    id: 8,
    question: "Do you want to speak French with people from France?",
    placeholder: "Share your thoughts about speaking with native speakers..."
  },
  {
    id: 9,
    question: 'How do you spell "Germany" in English?',
    placeholder: "Spell the country name..."
  },
  {
    id: 10,
    question: 'How do you spell "Italy" in English?',
    placeholder: "Spell the country name..."
  }
];

// Perguntas para a seção "TUNE IN YOUR EARS"
const videoQuestions = [
  {
    id: 1,
    question: "What is the importance of listening when learning a second language?",
    isPersonal: false,
    vocabulary: [
      { english: "", portuguese: "" },
      { english: "", portuguese: "" }
    ]
  },
  {
    id: 2,
    question: "How did you learn your first language?",
    isPersonal: false,
    vocabulary: [
      { english: "", portuguese: "" },
      { english: "", portuguese: "" },
      { english: "", portuguese: "" }
    ]
  },
  {
    id: 3,
    question: "How can you use listening to improve your English?",
    isPersonal: false,
    vocabulary: [
      { english: "", portuguese: "" },
      { english: "", portuguese: "" },
      { english: "", portuguese: "" }
    ]
  },
  {
    id: 4,
    question: "What are the advantages of listening?",
    isPersonal: false,
    vocabulary: [
      { english: "", portuguese: "" },
      { english: "", portuguese: "" },
      { english: " ", portuguese: "" }
    ]
  },
  {
    id: 5,
    question: "Learning English can be all about words, but it has a lot to do with feeling. What are you doing to know more about slangs, idioms and so on? ",
    isPersonal: false,
    vocabulary: [
      { english: "", portuguese: "" },
      { english: "", portuguese: "" },
      { english: "", portuguese: "" }
    ]
  },
  {
    id: 6,
    question: "Do you think to understand all the words is important when you are watching something or catching the main idea is what really matters?",
    isPersonal: true,
    vocabulary: [
      { english: "pre-made food", portuguese: "comida pré-feita" },
      { english: "thoughts", portuguese: "pensamentos" },
      { english: "to nap", portuguese: "tirar um cochilo" }
    ]
  },
  {
    id: 7,
    question: "Why is learning english with subtitles so important? ",
    isPersonal: true,
    vocabulary: [
      { english: "pre-made food", portuguese: "comida pré-feita" },
      { english: "thoughts", portuguese: "pensamentos" },
      { english: "to nap", portuguese: "tirar um cochilo" }
    ]
  },
  {
    id: 8,
    question: "What do you need to do to be ready for real life situations like restaurants, ordering food, asking for directions in an-english speaking country?",
    isPersonal: true,
    vocabulary: [
      { english: "pre-made food", portuguese: "comida pré-feita" },
      { english: "thoughts", portuguese: "pensamentos" },
      { english: "to nap", portuguese: "tirar um cochilo" }
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

// Mapeamento de países para idiomas - ATUALIZADO COM AS NOVAS IMAGENS
const countryLanguageMap: Record<string, { language: string; spelling: string; audioSrc: string }> = {
  "https://i.ibb.co/kskr0zmq/german-flag.jpg": {
    language: "German",
    spelling: "G-E-R-M-A-N-Y",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/german.mp3"
  },
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": {
    language: "Portuguese", 
    spelling: "B-R-A-Z-I-L",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/portuguese.mp3"
  },
  "https://i.ibb.co/21VkwN19/spanish-fla.jpg": {
    language: "Spanish",
    spelling: "S-P-A-I-N",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/spanish.mp3"
  },
  "https://i.ibb.co/7xnjGkDN/italian-flag.jpg": {
    language: "Italian",
    spelling: "I-T-A-L-Y",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/italian.mp3"
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

// Mapeamento de comidas para países - ATUALIZADO
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
  "https://i.ibb.co/dwjk9s3S/france-flag.jpg": {
    country: "France",
    food: "croissant",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/croissant.mp3"
  },
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": {
    country: "Brazil",
    food: "feijoada",
    audioSrc: "https://raw.githubusercontent.com/your-repo/audio/main/feijoada.mp3"
  }
};

// Mapeamento de comidas para spelling - MANTIDO COMO ESTAVA
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

export default function LessonLanguagesAndCountries() {
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

  // Estados para as imagens selecionadas
  const [selectedFlag, setSelectedFlag] = useState("https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg");
  const [selectedFood, setSelectedFood] = useState("https://i.ibb.co/8LF0pHjv/yogurt.jpg");
  
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

  // Estado para diálogos dinâmicos baseados na seleção
  const [practiceDialogs, setPracticeDialogs] = useState([
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

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson8Answers");
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
        
        // Restaurar seleções de imagens
        if (data.selectedFlag) setSelectedFlag(data.selectedFlag);
        if (data.selectedFood) setSelectedFood(data.selectedFood);
        
        // Restaurar estado das seções
        if (data.sections) setSections(data.sections);
        
        console.log("Dados carregados do localStorage para Lesson 8");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // Atualizar diálogos quando a bandeira for selecionada
  useEffect(() => {
    const countryInfo = countryLanguageMap[selectedFlag];
    const foodInfo = foodSpellingMap[selectedFood];
    if (countryInfo && foodInfo) {
      setPracticeDialogs([
        {
          question: `Do you want to speak ${countryInfo.language} or French with me?`,
          response: `I want to speak ${countryInfo.language} with you.`,
          highlighted: [countryInfo.language, "French", countryInfo.language]
        },
        {
          question: `How do you spell '${foodInfo.food}'?`,
          response: foodInfo.spelling,
          highlighted: [
            foodInfo.food,
            ...foodInfo.spelling.split(' ')
          ]
        }
      ]);
    }
  }, [selectedFlag, selectedFood]);

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
      
      // Seleções atuais
      selectedFlag,
      selectedFood,
      
      // Estado das seções
      sections,
      
      // Metadados
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 8 - Languages and Countries",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson8Answers", JSON.stringify(data));
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
      setSelectedFlag("https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg");
      setSelectedFood("https://i.ibb.co/8LF0pHjv/yogurt.jpg");
      
      // Limpar do localStorage também
      localStorage.removeItem("lesson8Answers");
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

  // Array de bandeiras para a galeria
  const flagImages = [
    "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg",
    "https://i.ibb.co/7xnjGkDN/italian-flag.jpg",
    "https://i.ibb.co/21VkwN19/spanish-fla.jpg",
    "https://i.ibb.co/kskr0zmq/german-flag.jpg",
    "https://i.ibb.co/qLL8CKv5/american-flag.jpg",
    "https://i.ibb.co/dwjk9s3S/france-flag.jpg"
  ];

  // Array de comidas para a galeria
  const foodImages = [
    "https://i.ibb.co/8LF0pHjv/yogurt.jpg",
    "https://i.ibb.co/99zBTC4q/sandwich.jpg",
    "https://i.ibb.co/W4kNfZ2F/cookies.jpg",
    "https://i.ibb.co/pjYHqBsc/juice.jpg",
    "https://i.ibb.co/jvg8bfKY/orange-juice.jpg",
    "https://i.ibb.co/HfCPk3qD/friends.jpg"
  ];

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/world-map-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🌍 Lesson 8 – Languages and Countries</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practice speaking about languages, countries, and international communication. Improve your grammar skills with diverse pronouns.
          </p>
        </div>

        {/* SPEAK RIGHT NOW */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW</h2>
              <button 
                onClick={() => toggleSection('speakNow')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              {/* Galeria de Bandeiras */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🌍 Countries and Flags - Click to select and change language</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {flagImages.map((src, index) => (
                    <div 
                      key={index} 
                      className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-3 transition-all duration-200 ${
                        selectedFlag === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedFlag(src)}
                    >
                      <Image 
                        src={src} 
                        alt={`Flag ${index + 1}`}
                        fill
                        className="object-cover"
                        quality={85}
                        priority={index < 4}
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmM2YzZjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtc2l6ZT0iMTIiPkZsYWc8L3RleHQ+PC9zdmc+';
                        }}
                      />
                      <div className={`absolute inset-0 transition-opacity duration-200 ${
                        selectedFlag === src ? 'bg-blue-500 bg-opacity-20' : 'bg-black bg-opacity-0 hover:bg-opacity-10'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Diálogos de Prática */}
              <div className="space-y-6 mb-8">
                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* Container de Imagem */}
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className={`relative w-32 h-32 rounded-lg overflow-hidden border-3 mx-auto ${
                        selectedFlag === selectedFlag ? 'border-blue-400 shadow-md' : 'border-gray-300'
                      }`}>
                        <Image 
                          src={selectedFlag} 
                          alt="Selected flag" 
                          fill
                          className="object-cover"
                          quality={90}
                          priority
                          sizes="128px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSIgZm9udC1zaXplPSIxMiI+RmxhZzwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                      </div>
                    </div>

                    {/* Conteúdo do Diálogo */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Practice this dialogue about languages. Click on <span className="text-red-600 font-semibold">red words</span> to hear pronunciation:
                        </p>
                        <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-700">Question:</p>
                            <HighlightedText 
                              text={practiceDialogs[0].question} 
                              highlightedWords={practiceDialogs[0].highlighted}
                              onWordClick={handleWordClick}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-green-700">Response:</p>
                            <HighlightedText 
                              text={practiceDialogs[0].response} 
                              highlightedWords={practiceDialogs[0].highlighted}
                              onWordClick={handleWordClick}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    {/* Container de Imagem */}
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className={`relative w-32 h-32 rounded-lg overflow-hidden border-3 mx-auto ${
                        selectedFood === selectedFood ? 'border-blue-400 shadow-md' : 'border-gray-300'
                      }`}>
                        <Image 
                          src={selectedFood} 
                          alt="Selected food" 
                          fill
                          className="object-cover"
                          quality={90}
                          priority
                          sizes="128px"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSIgZm9udC1zaXplPSIxMiI+Rm9vZDwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                      </div>
                    </div>

                    {/* Conteúdo do Diálogo */}
                    <div className="flex-1 min-w-0">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-600 mb-2">
                          Practice spelling food names. Click on <span className="text-red-600 font-semibold">red words</span> to hear pronunciation:
                        </p>
                        <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-blue-700">Question:</p>
                            <HighlightedText 
                              text={practiceDialogs[1].question} 
                              highlightedWords={practiceDialogs[1].highlighted}
                              onWordClick={handleWordClick}
                            />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-green-700">Response:</p>
                            <div className="text-lg font-mono bg-white p-2 rounded border border-blue-200">
                              {practiceDialogs[1].response.split(' ').map((letter, index) => (
                                <span
                                  key={index}
                                  className="text-red-600 font-bold cursor-pointer hover:bg-yellow-100 px-1 rounded mx-px"
                                  onClick={() => handleWordClick(letter.replace('-', ''))}
                                >
                                  {letter}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Galeria de Comidas */}
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">🍽️ International Foods - Click to select and spell food names</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {foodImages.map((src, index) => (
                    <div 
                      key={index} 
                      className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-3 transition-all duration-200 ${
                        selectedFood === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedFood(src)}
                    >
                      <Image 
                        src={src} 
                        alt={`Food ${index + 1}`}
                        fill
                        className="object-cover"
                        quality={85}
                        sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iODAiIGZpbGw9IiNmM2YzZjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9ImNlbnRyYWwiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTk5OTkiIGZvbnQtc2l6ZT0iMTIiPkZvb2Q8L3RleHQ+PC9zdmc+';
                        }}
                      />
                      <div className={`absolute inset-0 transition-opacity duration-200 ${
                        selectedFood === src ? 'bg-blue-500 bg-opacity-20' : 'bg-black bg-opacity-0 hover:bg-opacity-10'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE 1 */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
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

        {/* SUBSTITUTION PRACTICE 2 */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
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
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-purple-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-purple-50 rounded-md">
                          <p className="text-purple-700 font-medium">{currentSentence}</p>
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
                  Change into Interrogative - 2' - Transform to questions:
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
              <h2 className="text-2xl font-bold">💬 QUESTIONS ABOUT LANGUAGES & COUNTRIES</h2>
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
                  Answer these personal questions about languages and countries:
                </h3>
                <p className="text-indigo-600 mb-6">
                  Practice writing about your international experiences and language preferences.
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
                <h3 className="text-xl font-bold text-indigo-800 mb-4">💡 Writing Tips for International Topics:</h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 text-sm">
                  <li>Use specific country names and language names in your answers</li>
                  <li>Practice using different pronouns: he, she, they, we</li>
                  <li>Describe cultural differences and similarities</li>
                  <li>Mention traditional foods from different countries</li>
                  <li>Talk about your language learning experiences</li>
                  <li>Save your answers to track your progress in international communication</li>
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
                  Watch the video and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/2FdrSYbwbXM"
                      title="English Listening Practice"
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
              onClick={() => router.push("/cursos/lesson7")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson9")}
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