"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, VolumeX } from "lucide-react";

// ============================================
// COMPONENTE DE ÁUDIO POR VOZ NATURAL (Web Speech API)
// ============================================

interface SpeakableTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  language?: string;
}

const SpeakableText = ({ 
  text, 
  children, 
  className = "", 
  showIcon = true, 
  iconPosition = 'right',
  language = 'en-US'
}: SpeakableTextProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Verificar se o navegador suporta a Web Speech API
    if (!window.speechSynthesis) {
      setIsSupported(false);
      console.warn("Web Speech API não é suportada neste navegador");
    }
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta áudio por voz. Tente Chrome, Edge ou Safari.");
      return;
    }

    // Parar qualquer fala em andamento
    window.speechSynthesis.cancel();

    // Criar nova utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9; // Velocidade: 0.1 a 10 (1 é normal)
    utterance.pitch = 1.0; // Tom: 0 a 2
    utterance.volume = 1.0; // Volume: 0 a 1

    // Tentar usar voz feminina americana se disponível
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // Preferir vozes femininas americanas
      const preferredVoice = voices.find(v => 
        v.lang === 'en-US' && (v.name.includes('Google UK') || v.name.includes('Samantha') || v.name.includes('Microsoft') || v.name.includes('Female'))
      ) || voices.find(v => v.lang === 'en-US');
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    };

    // Carregar vozes disponíveis
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }

    // Eventos
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      console.error("Erro ao reproduzir áudio");
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    if (isPlaying) {
      stop();
    } else {
      speak();
    }
  };

  const content = children || text;

  if (!isSupported) {
    return <span className={className}>{content}</span>;
  }

  return (
    <div
      className={`group relative inline-flex items-center gap-2 cursor-pointer rounded-md px-1 transition-all duration-200 ${
        isPlaying ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      title={isPlaying ? "Clique para parar" : "Clique para ouvir a pronúncia"}
    >
      {showIcon && iconPosition === 'left' && (
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">
          {isPlaying ? (
            <VolumeX size={16} className="text-blue-500" />
          ) : (
            <Volume2 size={16} className="text-gray-400" />
          )}
        </span>
      )}
      
      <span className={isPlaying ? 'font-medium' : ''}>
        {content}
      </span>
      
      {showIcon && iconPosition === 'right' && (
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">
          {isPlaying ? (
            <VolumeX size={16} className="text-blue-500 animate-pulse" />
          ) : (
            <Volume2 size={16} className="text-gray-400" />
          )}
        </span>
      )}
    </div>
  );
};

// Componente para falar qualquer frase com botão de áudio
const AudioButton = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta áudio por voz.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`p-2 rounded-full transition-all duration-200 ${
        isPlaying 
          ? 'bg-blue-500 text-white animate-pulse' 
          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      } ${className}`}
      title={isPlaying ? "Parar" : "Ouvir pronúncia"}
    >
      {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
};

// ============================================
// DADOS DA LIÇÃO (mantidos como estavam)
// ============================================

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
    original: "Ele não quer beber suco no café da manhã. / água / leite",
    correctAnswer: "He doesn't want to drink juice for breakfast.",
    options: ["juice", "water", "milk"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Eles preferem comer salada. / Eu / Nós",
    correctAnswer: "They prefer to eat salad.",
    options: ["They", "I", "We"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Nós queremos comer uma fatia de torta. / queijo / pão",
    correctAnswer: "We want to eat a slice of pie.",
    options: ["pie", "cheese", "bread"],
    currentIndex: 0,
    specificSentences: {
      "pie": "We want to eat a slice of pie.",
      "cheese": "We want to eat a slice of cheese.",
      "bread": "We want to eat a slice of bread."
    }
  },
  { 
    key: "subs2-4", 
    original: "Ela ama comer batatas fritas. E você? / torradas / geléia",
    correctAnswer: "She loves to eat french fries. And you?",
    options: ["french fries", "toast", "jam"],
    currentIndex: 0,
    specificSentences: {
      "french fries": "She loves to eat french fries. And you?",
      "toast": "She loves to eat toast. And you?",
      "jam": "She loves to eat jam. And you?"
    }
  },
  { 
    key: "subs2-5", 
    original: "Eu não estudo português aqui. / lá / na escola",
    correctAnswer: "I don't study Portuguese here.",
    options: ["here", "there", "at school"],
    currentIndex: 0,
    specificSentences: {
      "here": "I don't study Portuguese here.",
      "there": "I don't study Portuguese there.",
      "at school": "I don't study Portuguese at school."
    }
  }
];

const negativeExercises = [
  { key: "neg-1", sentence: "She studies French in the afternoon.", answer: "She doesn't study French in the afternoon." },
  { key: "neg-2", sentence: "He eats bread and butter in the morning.", answer: "He doesn't eat bread and butter in the morning." },
  { key: "neg-3", sentence: "They want to eat eggs for breakfast.", answer: "They don't want to eat eggs for breakfast." },
  { key: "neg-4", sentence: "We drink a cup of tea in the afternoon.", answer: "We don't drink a cup of tea in the afternoon." },
  { key: "neg-5", sentence: "He likes to eat fish.", answer: "He doesn't like to eat fish." },
  { key: "neg-6", sentence: "She speaks English with her teacher.", answer: "She doesn't speak English with her teacher." }
];

const affirmativeExercises = [
  { key: "aff-1", sentence: "He doesn't eat sausages for breakfast.", answer: "He eats sausages for breakfast." },
  { key: "aff-2", sentence: "She doesn't like to drink apple juice.", answer: "She likes to drink apple juice." },
  { key: "aff-3", sentence: "They don't eat salad for lunch.", answer: "They eat salad for lunch." },
  { key: "aff-4", sentence: "He doesn't speak Portuguese at school.", answer: "He speaks Portuguese at school." },
  { key: "aff-5", sentence: "We don't study with your teacher.", answer: "We study with your teacher." }
];

const interrogativeExercises = [
  { key: "int-1", sentence: "He speaks Italian with his friend.", answer: "Does he speak Italian with his friend?" },
  { key: "int-2", sentence: "She prefers to study English.", answer: "Does she prefer to study English?" },
  { key: "int-3", sentence: "They want to drink a glass of water.", answer: "Do they want to drink a glass of water?" },
  { key: "int-4", sentence: "We want to study there.", answer: "Do we want to study there?" },
  { key: "int-5", sentence: "He wants to eat beef.", answer: "Does he want to eat beef?" }
];

const personalQuestions = [
  { id: 1, question: "Do you speak English with your friends from other countries?", placeholder: "Write about which languages you speak with international friends..." },
  { id: 2, question: "How do you spell the name of your favorite country?", placeholder: "Spell the country name here..." },
  { id: 3, question: "Do you prefer to study languages in the morning or afternoon?", placeholder: "Write your preference and explain why..." },
  { id: 4, question: "What traditional food from another country do you like?", placeholder: "Describe a foreign dish you enjoy..." },
  { id: 5, question: "Do you want to visit Germany or Italy? Why?", placeholder: "Explain your choice and reasons..." },
  { id: 6, question: "Which language do you study at school besides Portuguese?", placeholder: "Tell about your language studies at school..." },
  { id: 7, question: "What do you like to learn about different cultures?", placeholder: "Describe cultural aspects that interest you..." },
  { id: 8, question: "Do you want to speak French with people from France?", placeholder: "Share your thoughts about speaking with native speakers..." },
  { id: 9, question: 'How do you spell "Germany" in English?', placeholder: "Spell the country name..." },
  { id: 10, question: 'How do you spell "Italy" in English?', placeholder: "Spell the country name..." }
];

const videoQuestions = [
  { id: 1, question: "What is the importance of listening when learning a second language?", isPersonal: false, vocabulary: ["", ""] },
  { id: 2, question: "How did you learn your first language?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 3, question: "How can you use listening to improve your English?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 4, question: "What are the advantages of listening?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 5, question: "Learning English can be all about words, but it has a lot to do with feeling. What are you doing to know more about slangs, idioms and so on? ", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 6, question: "Do you think to understand all the words is important when you are watching something or catching the main idea is what really matters?", isPersonal: true, vocabulary: ["pre-made food", "thoughts", "to nap"] },
  { id: 7, question: "Why is learning english with subtitles so important? ", isPersonal: true, vocabulary: ["pre-made food", "thoughts", "to nap"] },
  { id: 8, question: "What do you need to do to be ready for real life situations like restaurants, ordering food, asking for directions in an-english speaking country?", isPersonal: true, vocabulary: ["pre-made food", "thoughts", "to nap"] }
];

const vocabularyTranslations = {
  "pre-made food": "comida pré-feita",
  "thoughts": "pensamentos",
  "to nap": "tirar um cochilo"
};

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '');
  return normalize(userAnswer) === normalize(correctAnswer);
};

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
      <span className="text-sm text-red-700"><span className="font-medium">Expected:</span> {correctAnswer}</span>
    </div>
  );
};

const countryLanguageMap: Record<string, { language: string; spelling: string }> = {
  "https://i.ibb.co/kskr0zmq/german-flag.jpg": { language: "German", spelling: "G-E-R-M-A-N-Y" },
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": { language: "Portuguese", spelling: "B-R-A-Z-I-L" },
  "https://i.ibb.co/21VkwN19/spanish-fla.jpg": { language: "Spanish", spelling: "S-P-A-I-N" },
  "https://i.ibb.co/7xnjGkDN/italian-flag.jpg": { language: "Italian", spelling: "I-T-A-L-Y" },
  "https://i.ibb.co/qLL8CKv5/american-flag.jpg": { language: "English", spelling: "U-N-I-T-E-D S-T-A-T-E-S" },
  "https://i.ibb.co/dwjk9s3S/france-flag.jpg": { language: "French", spelling: "F-R-A-N-C-E" }
};

const foodSpellingMap: Record<string, { food: string; spelling: string }> = {
  "https://i.ibb.co/8LF0pHjv/yogurt.jpg": { food: "yogurt", spelling: "Y-O-G-U-R-T" },
  "https://i.ibb.co/99zBTC4q/sandwich.jpg": { food: "sandwich", spelling: "S-A-N-D-W-I-C-H" },
  "https://i.ibb.co/W4kNfZ2F/cookies.jpg": { food: "cookies", spelling: "C-O-O-K-I-E-S" },
  "https://i.ibb.co/pjYHqBsc/juice.jpg": { food: "juice", spelling: "J-U-I-C-E" },
  "https://i.ibb.co/jvg8bfKY/orange-juice.jpg": { food: "orange juice", spelling: "O-R-A-N-G-E J-U-I-C-E" },
  "https://i.ibb.co/HfCPk3qD/friends.jpg": { food: "friends", spelling: "F-R-I-E-N-D-S" }
};

// ============================================
// COMPONENTE PRINCIPAL DA LIÇÃO
// ============================================

export default function LessonLanguagesAndCountries() {
  const router = useRouter();
  
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

  const [selectedFlag, setSelectedFlag] = useState("https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg");
  const [selectedFood, setSelectedFood] = useState("https://i.ibb.co/8LF0pHjv/yogurt.jpg");
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [videoAnswerResults, setVideoAnswerResults] = useState<Record<number, boolean>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});
  const [practiceDialogs, setPracticeDialogs] = useState([
    { question: "Do you want to speak Portuguese or Spanish with me?", response: "I want to speak Portuguese with you.", highlighted: ["Portuguese", "Spanish", "Portuguese"] },
    { question: "How do you spell 'yogurt'?", response: "Y-O-G-U-R-T", highlighted: ["yogurt", "Y", "O", "G", "U", "R", "T"] }
  ]);

  // Carregar dados salvos
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson8Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setVideoAnswerResults(data.videoAnswerResults || {});
        setShowVideoAnswerResults(data.showVideoAnswerResults || {});
        if (data.selectedFlag) setSelectedFlag(data.selectedFlag);
        if (data.selectedFood) setSelectedFood(data.selectedFood);
        if (data.sections) setSections(data.sections);
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // Atualizar diálogos
  useEffect(() => {
    const countryInfo = countryLanguageMap[selectedFlag];
    const foodInfo = foodSpellingMap[selectedFood];
    const availableLanguages = Object.values(countryLanguageMap).map(info => info.language).filter(lang => lang !== countryInfo?.language);
    const randomLanguage = availableLanguages.length > 0 ? availableLanguages[Math.floor(Math.random() * availableLanguages.length)] : "Spanish";
    
    if (countryInfo && foodInfo) {
      setPracticeDialogs([
        { question: `Do you want to speak ${countryInfo.language} or ${randomLanguage} with me?`, response: `I want to speak ${countryInfo.language} with you.`, highlighted: [countryInfo.language, randomLanguage, countryInfo.language] },
        { question: `How do you spell '${foodInfo.food}'?`, response: foodInfo.spelling, highlighted: [foodInfo.food, ...foodInfo.spelling.split(' ')] }
      ]);
    }
  }, [selectedFlag, selectedFood]);

  const saveAllAnswers = () => {
    const data = { subs1Exercises, subs2Exercises, writtenAnswers, videoAnswers, answerResults, showAnswerResults, videoAnswerResults, showVideoAnswerResults, selectedFlag, selectedFood, sections, lastUpdated: new Date().toISOString() };
    localStorage.setItem("lesson8Answers", JSON.stringify(data));
    alert("✅ Todas as suas respostas foram salvas com sucesso!");
  };

  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas?")) {
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
      localStorage.removeItem("lesson8Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  const handleSubs1OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs1Exercises(prev => prev.map(exercise => exercise.key === exerciseKey ? { ...exercise, currentIndex: optionIndex } : exercise));
  };

  const handleSubs2OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs2Exercises(prev => prev.map(exercise => exercise.key === exerciseKey ? { ...exercise, currentIndex: optionIndex } : exercise));
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  const handleVideoAnswerChange = (questionId: number, answer: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkVideoAnswer = (questionId: number) => {
    setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getCurrentSubs2Sentence = (exercise: typeof substitutionPractice2[0]): string => {
    const currentOption = exercise.options[exercise.currentIndex];
    if (exercise.specificSentences && exercise.specificSentences[currentOption as keyof typeof exercise.specificSentences]) {
      return exercise.specificSentences[currentOption as keyof typeof exercise.specificSentences];
    }
    const words = exercise.correctAnswer.split(' ');
    const baseWords = words.map(word => {
      const cleanWord = word.replace('.', '').replace(',', '').replace('?', '').replace('!', '');
      const matchingOption = exercise.options.find(opt => opt.toLowerCase() === cleanWord.toLowerCase());
      return matchingOption ? '{0}' : word;
    });
    return baseWords.join(' ').replace('{0}', currentOption);
  };

  const flagImages = [
    "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg",
    "https://i.ibb.co/7xnjGkDN/italian-flag.jpg",
    "https://i.ibb.co/21VkwN19/spanish-fla.jpg",
    "https://i.ibb.co/kskr0zmq/german-flag.jpg",
    "https://i.ibb.co/qLL8CKv5/american-flag.jpg",
    "https://i.ibb.co/dwjk9s3S/france-flag.jpg"
  ];

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
        
        {/* TÍTULO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🌍 Lesson 8 – Languages and Countries</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practice speaking about languages, countries, and international communication. <strong>Click on any text to hear pronunciation!</strong> 🎧
          </p>
        </div>

        {/* SPEAK RIGHT NOW */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW</h2>
              <button onClick={() => toggleSection('speakNow')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              {/* Galeria de Bandeiras */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🌍 Countries and Flags - Click to select</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {flagImages.map((src, index) => (
                    <div key={index} className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedFlag === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setSelectedFlag(src)}>
                      <Image src={src} alt={`Flag ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Diálogos de Prática COM ÁUDIO */}
              <div className="space-y-6 mb-8">
                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 mx-auto">
                        <Image src={selectedFlag} alt="Selected flag" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            Question: <AudioButton text={practiceDialogs[0].question} />
                          </p>
                          <SpeakableText text={practiceDialogs[0].question} className="text-gray-800" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            Response: <AudioButton text={practiceDialogs[0].response} />
                          </p>
                          <SpeakableText text={practiceDialogs[0].response} className="text-green-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 mx-auto">
                        <Image src={selectedFood} alt="Selected food" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            Question: <AudioButton text={practiceDialogs[1].question} />
                          </p>
                          <SpeakableText text={practiceDialogs[1].question} className="text-gray-800" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            Response: <AudioButton text={practiceDialogs[1].response} />
                          </p>
                          <div className="text-lg font-mono bg-white p-2 rounded border border-blue-200">
                            {practiceDialogs[1].response.split(' ').map((letter, index) => (
                              <SpeakableText key={index} text={letter.replace('-', '')} className="text-red-600 font-bold inline-block mx-px" showIcon={false} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Galeria de Comidas */}
              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">🍽️ International Foods - Click to select</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {foodImages.map((src, index) => (
                    <div key={index} className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedFood === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setSelectedFood(src)}>
                      <Image src={src} alt={`Food ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE 1 COM ÁUDIO */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button onClick={() => toggleSection('substitution1')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  ✍️ Substitution Practice I – Click on the options to change the sentences:
                  <AudioButton text="Substitution Practice I - Click on the options to change the sentences" />
                </h3>
                
                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <SpeakableText text={exercise.original} className="text-green-600 font-medium mb-2 block" />
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <SpeakableText text={currentSentence} className="text-green-700 font-medium" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button key={index} onClick={() => handleSubs1OptionClick(exercise.key, index)} className={`px-3 py-1 rounded-md text-sm font-medium transition ${exercise.currentIndex === index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                              <SpeakableText text={option} showIcon={false} />
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

        {/* CHANGE INTO NEGATIVE COM ÁUDIO */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  ⛔ Change into Negative – Transform to negative:
                  <AudioButton text="Change into Negative - Transform to negative" />
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Write negative form..." value={writtenAnswers[exercise.key] || ""} onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)} className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)} className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm">Check</button>
                      </div>
                      {showAnswerResults[exercise.key] && <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE 2 COM ÁUDIO */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button onClick={() => toggleSection('substitution2')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  🔄 Substitution Practice II – Click to substitute:
                  <AudioButton text="Substitution Practice Two - Click to substitute" />
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const currentSentence = getCurrentSubs2Sentence(exercise);
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-purple-200">
                        <SpeakableText text={exercise.original} className="text-purple-600 font-medium mb-2 block" />
                        <div className="mb-3 p-3 bg-purple-50 rounded-md">
                          <SpeakableText text={currentSentence} className="text-purple-700 font-medium" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button key={index} onClick={() => handleSubs2OptionClick(exercise.key, index)} className={`px-3 py-1 rounded-md text-sm font-medium transition ${exercise.currentIndex === index ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                              <SpeakableText text={option} showIcon={false} />
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

        {/* CHANGE INTO AFFIRMATIVE COM ÁUDIO */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                  Change into Affirmative - Transform to affirmative:
                  <AudioButton text="Change into Affirmative - Transform to affirmative" />
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Write affirmative form..." value={writtenAnswers[`aff-${exercise.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`aff-${exercise.key}`, e.target.value)} className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(`aff-${exercise.key}`, writtenAnswers[`aff-${exercise.key}`] || "", exercise.answer)} className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm">Check</button>
                      </div>
                      {showAnswerResults[`aff-${exercise.key}`] && <AnswerResult isCorrect={answerResults[`aff-${exercise.key}`]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE COM ÁUDIO */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  Change into Interrogative - Transform to questions:
                  <AudioButton text="Change into Interrogative - Transform to questions" />
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Write question form..." value={writtenAnswers[`int-${exercise.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`int-${exercise.key}`, e.target.value)} className="flex-1 px-3 py-2 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)} className="bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition text-sm">Check</button>
                      </div>
                      {showAnswerResults[`int-${exercise.key}`] && <AnswerResult isCorrect={answerResults[`int-${exercise.key}`]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUESTIONS COM ÁUDIO */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 QUESTIONS ABOUT LANGUAGES & COUNTRIES</h2>
              <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  Answer these personal questions about languages and countries:
                  <AudioButton text="Answer these personal questions about languages and countries" />
                </h3>
              </div>

              <div className="space-y-6">
                {personalQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-md">
                    <h4 className="text-lg font-bold text-indigo-700 mb-3 flex items-start gap-2">
                      <SpeakableText text={question.question} className="flex-1" />
                      <AudioButton text={question.question} />
                    </h4>
                    <textarea value={writtenAnswers[`q-${question.id}`] || ""} onChange={(e) => handleWrittenAnswerChange(`q-${question.id}`, e.target.value)} placeholder={question.placeholder} className="w-full h-24 p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" />
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
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS COM ÁUDIO */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button onClick={() => toggleSection('tuneIn')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">Watch the video and answer the questions below:</h3>
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe src="https://www.youtube.com/embed/2FdrSYbwbXM" title="English Listening Practice" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-[400px] md:h-[500px]" />
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                  📖 Key Vocabulary from the Video:
                  <AudioButton text="Key Vocabulary from the Video" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {["Trick - Truque / Técnica", "The easiest way - O jeito mais fácil", "Have you ever heard? - Você já ouviu?", "over time - ao passar do tempo", "Habit - Hábito", "To have fun - Se divertir", "Accents - Sotaques", "A mix of accents - Uma mistura de sotaques", "Slangs - Gírias"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <SpeakableText text={item.split(' - ')[0]} className="font-medium text-teal-700" />
                        <span className="text-teal-600">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {["Kind - Tipo", "It's a piece of cake - Isso é muito fácil", "tone and emotion - tom e emoção", "Sarcastic - Sarcástico", "It depends on - Depende de", "You'll be / You will be - Você vai estar", "Probably not - Provavelmente não", "To turn on - Ligar", "To procrastinate - Procrastinar", "A must - algo que você deve fazer"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <SpeakableText text={item.split(' - ')[0]} className="font-medium text-teal-700" />
                        <span className="text-teal-600">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3 flex items-start gap-2">
                      <SpeakableText text={question.question} className="flex-1" />
                      <AudioButton text={question.question} />
                      {question.isPersonal && <span className="text-sm font-normal text-teal-500">(Personal answer)</span>}
                    </h4>
                    <textarea value={videoAnswers[question.id] || ""} onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)} placeholder="Write your answer here..." className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" />
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => checkVideoAnswer(question.id)} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition font-medium">Check Answer</button>
                      <button onClick={() => handleVideoAnswerChange(question.id, "")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition">Clear</button>
                    </div>
                    {showVideoAnswerResults[question.id] && question.isPersonal && (
                      <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
                        <p className="text-sm text-teal-700"><span className="font-medium">Note:</span> This is a personal question. Your answer has been saved for practice.</p>
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
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Salvar e Navegação */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2">💾 Save All My Answers</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300">Clear All</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson7")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">&larr; Previous Lesson</button>
            <button onClick={() => router.push("/cursos/lesson9")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">Next Lesson &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
} 