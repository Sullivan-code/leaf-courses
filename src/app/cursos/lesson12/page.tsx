"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, CheckCircle, X } from "lucide-react";
import Image from "next/image";

// LISTENING EXERCISE DATA
interface ListenItem {
  id: number;
  image: string;
  correctAnswer: string;
}

const listenItems: ListenItem[] = [
  {
    id: 1,
    image: "/images/lesson12/workers.jpg",
    correctAnswer: "Do you speak German with your co-worker?"
  },
  {
    id: 2,
    image: "/images/lesson12/usa.jpg",
    correctAnswer: "I want to go to the U.S.A."
  },
  {
    id: 3,
    image: "/images/lesson12/france.jpg",
    correctAnswer: "My husband and I want to live in France."
  },
  {
    id: 4,
    image: "/images/lesson12/family.jpg",
    correctAnswer: "I see my children at home in the evening."
  },
  {
    id: 5,
    image: "/images/lesson12/friends.jpg",
    correctAnswer: "Do you speak English with your friends at school?"
  },
  {
    id: 6,
    image: "/images/lesson12/uk.jpg",
    correctAnswer: "They want to study in the U.K."
  }
];

// Dados da Lição 12 - Atualizados com o conteúdo fornecido
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu vivo (minha casa / minha mãe / irmã)",
    base: "I live {0}.",
    options: ["at my house", "with my mother", "with my sister"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Eu como comida com (meu irmão / chefe / meus filhos)",
    base: "I eat food with {0}.",
    options: ["my brother", "my boss", "my children"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Eu quero ir para os Estados Unidos com (minha esposa / meu marido / minha família)",
    base: "I want to go to the U.S.A. with {0}.",
    options: ["my wife", "my husband", "my family"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "O que você quer comer? (carne / verdura / batata)",
    base: "What do you want to eat? {0}",
    options: ["meat", "vegetables", "potatoes"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Aonde você quer ir amanhã? (à tarde / à noite)",
    base: "Where do you want to go tomorrow? {0}",
    options: ["in the afternoon", "at night"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "O que você quer preferir? (ler / beber)",
    base: "What do you prefer to {0}?",
    options: ["read", "drink"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "O que você quer comer amanhã? (arroz / salada / batata)",
    base: "What do you want to eat tomorrow? {0}",
    options: ["rice", "salad", "potatoes"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "O que você quer estudar? (gostar / preferir / morar)",
    base: "What do you want to {0}?",
    options: ["like", "prefer", "live"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Você gosta de falar com (minha professora / meu primo / minha avó)",
    base: "Do you like to talk with {0}?",
    options: ["my teacher", "my cousin", "my grandmother"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "O que você quer aprender? (morar / estudar / comer)",
    base: "What do you want to learn? {0}",
    options: ["to live", "to study", "to eat"],
    currentIndex: 0
  }
];

const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "I want to go to the U.S.A.",
    answer: "I don't want to go to the U.S.A."
  },
  { 
    key: "neg-2", 
    sentence: "We go to school.",
    answer: "We don't go to school."
  },
  { 
    key: "neg-3", 
    sentence: "They live in that country.",
    answer: "They don't live in that country."
  },
  { 
    key: "neg-4", 
    sentence: "I like to speak English.",
    answer: "I don't like to speak English."
  },
  { 
    key: "neg-5", 
    sentence: "She speaks very well with her English teacher.",
    answer: "She doesn't speak very well with her English teacher."
  },
  { 
    key: "neg-6", 
    sentence: "I understand my children.",
    answer: "I don't understand my children."
  }
];

const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "They don't want to go there.",
    answer: "They want to go there."
  },
  { 
    key: "aff-2", 
    sentence: "I don't speak English at home.",
    answer: "I speak English at home."
  },
  { 
    key: "aff-3", 
    sentence: "We don't like that country.",
    answer: "We like that country."
  },
  { 
    key: "aff-4", 
    sentence: "She doesn't want that language.",
    answer: "She wants that language."
  },
  { 
    key: "aff-5", 
    sentence: "I don't want to live in Brazil.",
    answer: "I want to live in Brazil."
  }
];

const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "They like to speak German at school.",
    answer: "Do they like to speak German at school?"
  },
  { 
    key: "int-2", 
    sentence: "You speak to teachers.",
    answer: "Do you speak to teachers?"
  },
  { 
    key: "int-3", 
    sentence: "He wants to live in the U.K. with my family.",
    answer: "Does he want to live in the U.K. with my family?"
  },
  { 
    key: "int-4", 
    sentence: "They like to study in this country.",
    answer: "Do they like to study in this country?"
  },
  { 
    key: "int-5", 
    sentence: "I see my children at home in the evening.",
    answer: "Do I see my children at home in the evening?"
  }
];

const listenPracticeSentences = [
  { 
    key: "listen-1", 
    sentence: "Do you speak German with your co-worker?",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  },
  { 
    key: "listen-2", 
    sentence: "I want to go to the U.S.A.",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  },
  { 
    key: "listen-3", 
    sentence: "My husband and I want to live in France.",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  },
  { 
    key: "listen-4", 
    sentence: "I see my children at home in the evening.",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  },
  { 
    key: "listen-5", 
    sentence: "Do you speak English with your friends at school?",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  },
  { 
    key: "listen-6", 
    sentence: "They want to study in the U.K.",
    audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3"
  }
];

const unlockQuestions = [
  {
    id: 1,
    question: "What languages do you want to speak?",
    placeholder: "Write about the languages you want to speak..."
  },
  {
    id: 2,
    question: "Do you speak English at home, too?",
    placeholder: "Answer yes or no and explain..."
  },
  {
    id: 3,
    question: "Do you want to go to the U.S.A.?",
    placeholder: "Explain why or why not..."
  },
  {
    id: 4,
    question: "What's your first and last name?",
    placeholder: "Write your full name..."
  },
  {
    id: 5,
    question: "Where do you live?",
    placeholder: "Describe where you live..."
  },
  {
    id: 6,
    question: "Do you live at home, with friends, or with your family?",
    placeholder: "Explain your living situation..."
  },
  {
    id: 7,
    question: "Do your co-workers speak English?",
    placeholder: "Answer and give details..."
  },
  {
    id: 8,
    question: "Do you want to live abroad?",
    placeholder: "Explain where and why..."
  },
  {
    id: 9,
    question: "Where do you see your friends and family?",
    placeholder: "Describe where you meet them..."
  },
  {
    id: 10,
    question: "Do you want to study in the U.K.?",
    placeholder: "Explain your answer..."
  }
];

// Video questions para TUNE IN YOUR EARS
const videoQuestions = [
  {
    id: 1,
    question: "What is the easiest way to practice listening according to the video?",
    isPersonal: false,
    vocabulary: [
      { english: "easiest way", portuguese: "jeito mais fácil" },
      { english: "practice listening", portuguese: "praticar escuta" },
      { english: "according to", portuguese: "de acordo com" }
    ]
  },
  {
    id: 2,
    question: "What habit does the speaker suggest to improve listening skills?",
    isPersonal: false,
    vocabulary: [
      { english: "habit", portuguese: "hábito" },
      { english: "suggest", portuguese: "sugerir" },
      { english: "improve", portuguese: "melhorar" },
      { english: "skills", portuguese: "habilidades" }
    ]
  },
  {
    id: 3,
    question: "Why is it important to listen to different accents?",
    isPersonal: true,
    vocabulary: [
      { english: "important", portuguese: "importante" },
      { english: "different accents", portuguese: "diferentes sotaques" },
      { english: "understand", portuguese: "entender" }
    ]
  },
  {
    id: 4,
    question: "How can listening help with speaking skills?",
    isPersonal: true,
    vocabulary: [
      { english: "help with", portuguese: "ajudar com" },
      { english: "speaking skills", portuguese: "habilidades de fala" },
      { english: "pronunciation", portuguese: "pronúncia" },
      { english: "intonation", portuguese: "entonação" }
    ]
  },
  {
    id: 5,
    question: "What's your daily routine for practicing English listening?",
    isPersonal: true,
    vocabulary: [
      { english: "daily routine", portuguese: "rotina diária" },
      { english: "practicing", portuguese: "praticando" },
      { english: "specific time", portuguese: "horário específico" }
    ]
  }
];

const thereAndAroundDialogue = [
  { speaker: "A", text: "I want to book a flight, please.", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" },
  { speaker: "B", text: "Sure! Please, take a seat.", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" },
  { speaker: "A", text: "Do you want a round-trip ticket or a one-way ticket?", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" },
  { speaker: "B", text: "A one-way ticket, please.", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" },
  { speaker: "A", text: "Thank you very much.", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" },
  { speaker: "B", text: "It's my pleasure.", audioSrc: "https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3" }
];

// Sistema de avaliação de respostas
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase().trim().replace(/[.,?!]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

const AdvancedAudioPlayer = ({ src, startTime = 0 }: { src: string; startTime?: number }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
  }, [startTime]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Audio error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center gap-4 w-full">
        <button 
          onClick={togglePlayPause}
          className={`p-2 rounded-full ${isPlaying ? 'bg-red-500' : 'bg-green-500'} text-white hover:opacity-90`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        
        <button 
          onClick={resetAudio}
          className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600"
        >
          <RotateCcw size={16} />
        </button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
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
        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center gap-1"
      >
        <Volume2 size={14} />
        <span className="text-xs">Play</span>
      </button>
      <audio ref={audioRef} src={src} preload="none" />
    </div>
  );
};

// Componente para mostrar resultado da avaliação
const AnswerResult = ({ isCorrect, correctAnswer, onClose }: { isCorrect: boolean; correctAnswer: string; onClose?: () => void }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct!</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Expected:</span> {correctAnswer}
      </span>
      {onClose && (
        <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default function Lesson12LanguagesAndCountries() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    listeningExercise: true,
    listenAndPractice: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    thereAndAround: true,
    tuneIn: true,
    unlock: true
  });
  
  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  
  // Estados para as respostas escritas
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  
  // Estados para avaliação de respostas
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});

  // Estados para o Listening Exercise
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({});
  const [listeningResults, setListeningResults] = useState<Record<number, boolean | null>>({});
  
  // Estados para o player de áudio principal
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const normalize = (text: string) =>
    text.toLowerCase().trim().replace(/[?.!,]/g, "");

  const checkListeningAnswer = (id: number, correct: string) => {
    const userAnswer = listeningAnswers[id] || "";
    const isCorrect = normalize(userAnswer) === normalize(correct);
    setListeningResults(prev => ({ ...prev, [id]: isCorrect }));
  };

  const clearListeningResult = (id: number) => {
    setListeningResults(prev => ({ ...prev, [id]: null }));
  };

  const checkVideoAnswer = (id: number) => {
    setShowVideoAnswerResults(prev => ({ ...prev, [id]: true }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
  };

  // Formatar tempo em minutos:segundos
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Inicializar áudio principal
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio("https://github.com/Sullivan-code/english-audios/raw/main/L12-listening.mp3");
      audioRef.current = audio;
      
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });
    }
  }, []);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Audio error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    }
  };

  // Função para arrastar o áudio
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    // Carregar respostas salvas do localStorage
    const savedAnswers = localStorage.getItem("lesson12Answers");
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
    
    localStorage.setItem("lesson12Answers", JSON.stringify(data));
    alert("All answers saved successfully to your browser!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers? This cannot be undone.")) {
      localStorage.removeItem("lesson12Answers");
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setVideoAnswers({});
      setListeningAnswers({});
      setListeningResults({});
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

  // Função para verificar respostas
  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  // Função para fechar resultado
  const handleCloseResult = (exerciseKey: string) => {
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: false }));
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/world-map-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🌍 LESSON 12 – Languages & Countries</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Listen and Practice conversations about travel, family, and daily activities. Improve your communication skills.
          </p>
        </div>

        {/* LISTENING EXERCISE - INTEGRADO NO COMEÇO */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 LISTENING EXERCISE</h2>
              <button 
                onClick={() => toggleSection('listeningExercise')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.listeningExercise ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listeningExercise && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-orange-800 mb-2">
                  Let's Practice Our Listening
                </h3>
                <p className="text-gray-600">
                  Listen to the audio and write what you hear for each image below.
                </p>
              </div>

              {/* CONTROLES DE ÁUDIO - COM SLIDER */}
              <div className="flex flex-col items-center justify-center mb-8 p-6 bg-white border-2 border-orange-300 rounded-2xl shadow-md">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={togglePlayPause}
                    className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={20} />
                        <span className="font-semibold">Pause Audio</span>
                      </>
                    ) : (
                      <>
                        <Play size={20} />
                        <span className="font-semibold">Play Full Audio</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetAudio}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-full hover:bg-gray-600 transition"
                  >
                    <RotateCcw size={20} />
                    <span className="font-semibold">Reset Audio</span>
                  </button>
                </div>
                
                {/* SLIDER DO ÁUDIO */}
                <div className="w-full max-w-md mb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-medium text-gray-600">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <span className="text-xs font-medium text-gray-600">{formatTime(duration)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Drag to seek</span>
                    <span>Total: {formatTime(duration)}</span>
                  </div>
                </div>
                
                <p className="text-center text-gray-600 text-sm max-w-md">
                  <span className="font-medium">Note:</span> This audio contains all 6 sentences. Listen carefully and write what you hear for each corresponding image.
                </p>
              </div>

              {/* EXERCÍCIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {listenItems.map(item => (
                  <div
                    key={item.id}
                    className="border-2 border-orange-200 rounded-2xl p-6 shadow-md bg-white"
                  >
                    <div className="relative w-full h-48 mb-4 rounded-xl overflow-hidden">
                      <Image
                        src={item.image}
                        alt="Listening image"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* INPUT */}
                    <textarea
                      placeholder="Write what you hear for this image..."
                      value={listeningAnswers[item.id] || ""}
                      onChange={e =>
                        setListeningAnswers(prev => ({
                          ...prev,
                          [item.id]: e.target.value
                        }))
                      }
                      className="w-full h-32 border border-orange-300 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />

                    {/* CHECK */}
                    <button
                      onClick={() => checkListeningAnswer(item.id, item.correctAnswer)}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors mb-3"
                    >
                      Check Answer
                    </button>

                    {/* FEEDBACK COM BOTÃO X */}
                    {listeningResults[item.id] !== undefined && listeningResults[item.id] !== null && (
                      <div
                        className={`p-3 rounded-lg flex items-center gap-2 ${
                          listeningResults[item.id]
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        <div className="flex-1 flex items-center gap-2">
                          {listeningResults[item.id] ? (
                            <>
                              <CheckCircle className="text-green-600" size={20} />
                              <span className="font-medium">Correct! Great listening 🎉</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="text-red-600" size={20} />
                              <div>
                                <span className="font-medium">Incorrect. </span>
                                <span>The correct answer is: </span>
                                <span className="font-medium">{item.correctAnswer}</span>
                              </div>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => clearListeningResult(item.id)}
                          className="text-gray-500 hover:text-gray-700 ml-2"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div className="mt-8 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-3">🎯 How to practice:</h3>
                <ol className="list-decimal pl-5 space-y-2 text-orange-700">
                  <li>Click <span className="font-semibold">"Play Full Audio"</span> to listen to all 6 sentences</li>
                  <li>Use the slider to drag left/right and seek specific parts of the audio</li>
                  <li>Listen carefully and identify which sentence corresponds to each image</li>
                  <li>Write what you hear for each image in the text box below it</li>
                  <li>Click <span className="font-semibold">"Check Answer"</span> to see if you're correct</li>
                  <li>Click the <span className="font-semibold">X</span> button to close the answer feedback</li>
                  <li>Use <span className="font-semibold">"Reset Audio"</span> to replay the audio from the beginning</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* LISTEN AND PRACTICE */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">👂 LISTEN AND PRACTICE</h2>
              <button 
                onClick={() => toggleSection('listenAndPractice')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.listenAndPractice ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listenAndPractice && (
            <div className="p-8">
              <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Practice these sentences with audio controls:
                </h3>
                
                <div className="space-y-4 bg-white p-6 rounded-lg border border-blue-200">
                  {listenPracticeSentences.map((item) => (
                    <div key={item.key} className="flex flex-col p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-800 font-medium">{item.sentence}</p>
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Audio:</span> L12-listening.mp3
                        </div>
                      </div>
                      <AdvancedAudioPlayer src={item.audioSrc} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I */}
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
                  Substitution Practice I - Click on the options to change the sentences:
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
                  Change into Negative - Transform to negative:
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
                          onClose={() => handleCloseResult(exercise.key)}
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
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">
                  Substitution Practice II - Click to substitute:
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    
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
                          onClose={() => handleCloseResult(`aff-${exercise.key}`)}
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
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">
                  Change into Interrogative - Transform to questions:
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-indigo-200">
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
                          className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)}
                          className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[`int-${exercise.key}`] && (
                        <AnswerResult 
                          isCorrect={answerResults[`int-${exercise.key}`]} 
                          correctAnswer={exercise.answer}
                          onClose={() => handleCloseResult(`int-${exercise.key}`)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* THERE AND AROUND */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🛫 THERE AND AROUND</h2>
              <button 
                onClick={() => toggleSection('thereAndAround')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.thereAndAround ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.thereAndAround && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  Practice this dialogue about booking a flight with audio:
                </h3>
                
                <div className="space-y-4 bg-white p-6 rounded-lg border border-purple-200">
                  {thereAndAroundDialogue.map((line, index) => (
                    <div key={index} className="flex flex-col p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-start gap-4 mb-2">
                        <div className={`min-w-8 font-bold ${
                          line.speaker === "A" ? "text-blue-600" : "text-green-600"
                        }`}>
                          {line.speaker}:
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{line.text}</p>
                        </div>
                      </div>
                      <div className="ml-12">
                        <AdvancedAudioPlayer src={line.audioSrc} />
                      </div>
                    </div>
                  ))}
                </div>
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

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔓 UNLOCK - QUESTIONS</h2>
              <button 
                onClick={() => toggleSection('unlock')}
                className="ml-4 p-2 rounded-full hover:bg-pink-600 transition"
              >
                {sections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.unlock && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-pink-800 mb-4">
                  Questions - Practice writing answers:
                </h3>
                <p className="text-pink-600 mb-6">
                  Answer these questions to practice your communication skills.
                </p>
              </div>

              <div className="space-y-6">
                {unlockQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-pink-200 shadow-md">
                    <h4 className="text-lg font-bold text-pink-700 mb-3">
                      {question.id}. {question.question}
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

              <div className="mt-8 bg-pink-100 border-2 border-pink-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-800 mb-4">💡 Writing Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-pink-700 text-sm">
                  <li>Use complete sentences to practice grammar</li>
                  <li>Be specific about your preferences and reasons</li>
                  <li>Describe your daily routines and habits</li>
                  <li>Talk about your family and living situation</li>
                  <li>Practice different ways to express preferences</li>
                  <li>Save your answers to track your progress</li>
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
              onClick={() => router.push("/cursos/lesson11")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson13")}
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