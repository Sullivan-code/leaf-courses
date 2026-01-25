"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, CheckCircle, X } from "lucide-react";

// Dados da Lição 14 - Personal Information & Routine

// Dados do diálogo EXPRESS YOURSELF
const expressYourselfDialogue = [
  { speaker: "Adam", text: "Excuse me. Hi, my name is Adam." },
  { speaker: "Angela", text: "Hi, Adam. Nice to meet you. My name is Angela." },
  { speaker: "Adam", text: "Nice to meet you, too, Angela." },
  { speaker: "Angela", text: "Welcome to your new school! We have a computer for you here." },
  { speaker: "Adam", text: "Oh, thanks." },
  { speaker: "Angela", text: "I need your full name and your phone number, please." },
  { speaker: "Adam", text: "Sure. It's Adam Brook." },
  { speaker: "Angela", text: "How do you spell that, please?" },
  { speaker: "Adam", text: "A-D-A-M B-R-O-O-K." },
  { speaker: "Angela", text: "And what's your phone number?" },
  { speaker: "Adam", text: "It's 433-756-176." },
  { speaker: "Angela", text: "OK. Thanks, Adam. Look, you have a new lesson." },
  { speaker: "Adam", text: "Thanks, Angela!" },
  { speaker: "Angela", text: "You're welcome." }
];

// DRILLING PRACTICE - SUBSTITUTION PRACTICE I (ATUALIZADO)
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu preciso estudar com você. / falar com você / falar com seu chefe",
    base: "I need to {0}.",
    options: ["study with you", "talk to you", "talk with your boss"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Nós temos um amigo brasileiro. / britânico / americano",
    base: "We have a {0} friend.",
    options: ["Brazilian", "British", "American"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Você realmente precisa de um celular novo? / tablet / computador",
    base: "Do you really need a new {0}?",
    options: ["cell phone", "tablet", "computer"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Qual é o seu número de telefone? / número de celular",
    base: "What's your {0}?",
    options: ["phone number", "cell phone number"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Eles não querem ir para a França. / Espanha / Reino Unido",
    base: "They don't want to go to {0}.",
    options: ["France", "Spain", "the United Kingdom"],
    currentIndex: 0
  }
];

// DRILLING PRACTICE - SUBSTITUTION PRACTICE II
const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "Nós estudamos inglês de manhã. / espanhol / português",
    base: "We study {0} in the morning.",
    options: ["English", "Spanish", "Portuguese"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "O que você entende em francês? / alemão / italiano",
    base: "What do you understand in {0}?",
    options: ["French", "German", "Italian"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Aonde eles vão à tarde? / de manhã / à noite",
    base: "Where do they go {0}?",
    options: ["in the afternoon", "in the morning", "at night"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Eu como arroz, feijão e frango no almoço. / Nós / Elas",
    base: "{0} eat rice, beans, and chicken for lunch.",
    options: ["I", "We", "They"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "Elas gostam da minha casa velha. / carro / computador",
    base: "They like my old {0}.",
    options: ["house", "car", "computer"],
    currentIndex: 0
  }
];

// CHANGE INTO NEGATIVE
const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "I have old sunglasses.",
    answer: "I don't have old sunglasses."
  },
  { 
    key: "neg-2", 
    sentence: "We want a glass of orange juice.",
    answer: "We don't want a glass of orange juice."
  },
  { 
    key: "neg-3", 
    sentence: "They have an old tablet.",
    answer: "They don't have an old tablet."
  },
  { 
    key: "neg-4", 
    sentence: "I eat an apple for breakfast.",
    answer: "I don't eat an apple for breakfast."
  },
  { 
    key: "neg-5", 
    sentence: "They have two cars.",
    answer: "They don't have two cars."
  },
  { 
    key: "neg-6", 
    sentence: "I have an American friend.",
    answer: "I don't have an American friend."
  }
];

// CHANGE INTO AFFIRMATIVE
const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "They don't have old clothes.",
    answer: "They have old clothes."
  },
  { 
    key: "aff-2", 
    sentence: "I don't want an old cell phone.",
    answer: "I want an old cell phone."
  },
  { 
    key: "aff-3", 
    sentence: "I don't have your phone number.",
    answer: "I have your phone number."
  },
  { 
    key: "aff-4", 
    sentence: "We don't like this tablet.",
    answer: "We like this tablet."
  },
  { 
    key: "aff-5", 
    sentence: "They don't live in Italy.",
    answer: "They live in Italy."
  },
  { 
    key: "aff-6", 
    sentence: "We don't understand your co-worker.",
    answer: "We understand your co-worker."
  }
];

// QUESTIONS - UNLOCK SECTION
const unlockQuestions = [
  {
    id: 1,
    question: "Do you need new clothes?",
    placeholder: "Answer yes or no and explain..."
  },
  {
    id: 2,
    question: "Do you need a new cell phone?",
    placeholder: "Answer and explain why or why not..."
  },
  {
    id: 3,
    question: "Do you have a new or an old computer?",
    placeholder: "Describe your computer..."
  },
  {
    id: 4,
    question: "Do you have an old car?",
    placeholder: "Describe your car or transportation..."
  },
  {
    id: 5,
    question: "Do you want an apple?",
    placeholder: "Answer and talk about fruits you like..."
  },
  {
    id: 6,
    question: "Do you have brothers and sisters?",
    placeholder: "Talk about your family..."
  },
  {
    id: 7,
    question: "What do you need to study today?",
    placeholder: "List what you need for studying..."
  },
  {
    id: 8,
    question: "Where do you have to go today?",
    placeholder: "Describe your plans for today..."
  },
  {
    id: 9,
    question: "What do you really like to eat for breakfast?",
    placeholder: "Describe your favorite breakfast..."
  },
  {
    id: 10,
    question: "What's your phone number?",
    placeholder: "Write your phone number..."
  }
];

// TUNE IN YOUR EARS - Questions
const videoQuestions = [
  {
    id: 1,
    question: "What is the main topic of the video?",
    isPersonal: false,
    vocabulary: [
      { english: "To achieve", portuguese: "Alcançar" },
      { english: "Pride", portuguese: "Orgulho" },
      { english: "Career growth", portuguese: "Crescimento profissional" }
    ]
  },
  {
    id: 2,
    question: "According to the video, how can English help you in your career?",
    isPersonal: false,
    vocabulary: [
      { english: "Job market", portuguese: "Mercado de trabalho" },
      { english: "Asset", portuguese: "Diferencial" },
      { english: "Promotions", portuguese: "Promoções" }
    ]
  },
  {
    id: 3,
    question: "How does the video suggest English can improve your personal life?",
    isPersonal: false,
    vocabulary: [
      { english: "To interact", portuguese: "Interagir" },
      { english: "To deepen relationships", portuguese: "Aprofundar relacionamentos" },
      { english: "Across borders", portuguese: "Através das fronteiras" }
    ]
  },
  {
    id: 4,
    question: "What is one way English can help you travel?",
    isPersonal: false,
    vocabulary: [
      { english: "Global", portuguese: "Global" },
      { english: "To participate", portuguese: "Participar" },
      { english: "Experience", portuguese: "Experiência" }
    ]
  },
  {
    id: 5,
    question: "How can English help you in education?",
    isPersonal: false,
    vocabulary: [
      { english: "Background", portuguese: "História de vida" },
      { english: "To share ideas", portuguese: "Compartilhar ideias" },
      { english: "Presentations", portuguese: "Apresentações" }
    ]
  },
  {
    id: 6,
    question: "How do you think learning English can help you in your life? (Personal answer)",
    isPersonal: true,
    vocabulary: [
      { english: "To build confidence", portuguese: "Construir confiança" },
      { english: "To open doors", portuguese: "Abrir portas" },
      { english: "Self-confidence", portuguese: "Autoconfiança" }
    ]
  },
  {
    id: 7,
    question: "What is one goal you have for learning English? (Personal answer)",
    isPersonal: true,
    vocabulary: [
      { english: "To be proud of", portuguese: "Ficar orgulhoso de" },
      { english: "Opportunity", portuguese: "Oportunidade" },
      { english: "To thrive", portuguese: "Prosperar" }
    ]
  }
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

export default function Lesson14PersonalInformationRoutine() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    expressYourself: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    tuneIn: true,
    unlock: true
  });
  
  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  
  // Estados para as respostas escritas
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  
  // Estados para avaliação de respostas
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  // Estado para áudio principal
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Estados para TUNE IN YOUR EARS
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});

  // Formatar tempo em minutos:segundos
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Inicializar áudio principal (ALTERADO: Agora usa L-14-express.mp3)
  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio("https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L-14-express.mp3");
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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    // Carregar respostas salvas do localStorage
    const savedAnswers = localStorage.getItem("lesson14Answers");
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
    
    localStorage.setItem("lesson14Answers", JSON.stringify(data));
    alert("All answers saved successfully to your browser!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers? This cannot be undone.")) {
      localStorage.removeItem("lesson14Answers");
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setVideoAnswers({});
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

  // Funções para TUNE IN YOUR EARS
  const handleVideoAnswerChange = (questionId: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const checkVideoAnswer = (questionId: number) => {
    const question = videoQuestions.find(q => q.id === questionId);
    if (question && !question.isPersonal) {
      // Para perguntas não pessoais, podemos verificar se a resposta contém palavras-chave
      // Por simplicidade, apenas marcamos como respondido
      setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
    } else {
      // Para perguntas pessoais, apenas mostramos que foi salvo
      setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
    }
  };

  // Função para verificar respostas dos exercícios
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
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 14 – Personal Information & Routine</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Learn how to introduce yourself, share personal information, and talk about daily routines. Practice conversations about personal details and daily activities.
          </p>
        </div>

        {/* EXPRESS YOURSELF - DIALOGUE (ATUALIZADO - Com áudio L-14-express.mp3) */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔴 EXPRESS YOURSELF</h2>
              <button 
                onClick={() => toggleSection('expressYourself')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.expressYourself ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.expressYourself && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-blue-800 mb-4">
                  Dialogue - Listen and practice the conversation
                </h3>
                
                {/* CONTROLES DE ÁUDIO DO DIÁLOGO - COM ÁUDIO L-14-express.mp3 */}
                <div className="flex flex-col items-center justify-center mb-8 p-6 bg-white border-2 border-blue-300 rounded-2xl shadow-md">
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={togglePlayPause}
                      className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition"
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={20} />
                          <span className="font-semibold">Pause Dialogue</span>
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          <span className="font-semibold">Play Full Dialogue</span>
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
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
                      />
                      <span className="text-xs font-medium text-gray-600">{formatTime(duration)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Drag to seek</span>
                      <span>Total: {formatTime(duration)}</span>
                    </div>
                  </div>
                  
                  {/* Informação sobre o áudio */}
                  <div className="text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="font-medium">Audio:</span> Lesson 14 - Express Yourself Dialogue (L-14-express.mp3)
                  </div>
                </div>

                {/* TRANSCRIÇÃO DO DIÁLOGO (SEM BOTÕES INDIVIDUAIS) */}
                <div className="bg-white border-2 border-blue-300 rounded-xl p-6 shadow-md">
                  <h4 className="text-lg font-bold text-blue-700 mb-4">Dialogue Transcription:</h4>
                  <div className="space-y-4">
                    {expressYourselfDialogue.map((line, index) => (
                      <div key={index} className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg">
                        <div className={`min-w-20 font-bold ${line.speaker === "Adam" ? "text-blue-600" : "text-pink-600"}`}>
                          {line.speaker}:
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800">{line.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* PERGUNTAS DE COMPREENSÃO */}
                  <div className="mt-6 p-4 bg-blue-100 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Comprehension Questions:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-blue-700">
                      <li>Who are the people?</li>
                      <li>Where are they?</li>
                      <li>What information is Angela asking for?</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I (ATUALIZADO) */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟡 DRILLING PRACTICE - SUBSTITUTION PRACTICE I</h2>
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
              <h2 className="text-2xl font-bold">🟠 CHANGE INTO NEGATIVE</h2>
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
                  Change into Negative - Transform to negative form:
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
              <h2 className="text-2xl font-bold">🟡 DRILLING PRACTICE - SUBSTITUTION PRACTICE II</h2>
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
              <h2 className="text-2xl font-bold">🟢 CHANGE INTO AFFIRMATIVE</h2>
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
                  Change into Affirmative - Transform to affirmative form:
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

        {/* TUNE IN YOUR EARS - COM NOVO LINK DO YOUTUBE */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS - English Conversation Practice</h2>
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
                  Watch the video "English Conversation Practice - Listening & Speaking Skills" and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube - COM NOVO LINK */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/s6x3WwIfbvY"
                      title="English Conversation Practice - Listening & Speaking Skills"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: English Conversation Practice - Listening & Speaking Skills (30 Minutes)</p>
                </div>
              </div>

              {/* Vocabulary Help - ATUALIZADO PARA O NOVO VÍDEO */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Listening skills</span>
                      <span className="text-teal-600">Habilidades de audição</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Speaking skills</span>
                      <span className="text-teal-600">Habilidades de fala</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Conversation</span>
                      <span className="text-teal-600">Conversa</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Daily routines</span>
                      <span className="text-teal-600">Rotinas diárias</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Practice</span>
                      <span className="text-teal-600">Prática</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Dialogue</span>
                      <span className="text-teal-600">Diálogo</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Comprehension</span>
                      <span className="text-teal-600">Compreensão</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Pronunciation</span>
                      <span className="text-teal-600">Pronúncia</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Fluency</span>
                      <span className="text-teal-600">Fluência</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Communication</span>
                      <span className="text-teal-600">Comunicação</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Repeat</span>
                      <span className="text-teal-600">Repetir</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Shadowing</span>
                      <span className="text-teal-600">Repetição simultânea</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Improvement</span>
                      <span className="text-teal-600">Melhoria</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Confidence</span>
                      <span className="text-teal-600">Confiança</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section - ATUALIZADO PARA O NOVO VÍDEO */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3">
                      {question.id}. {question.question}
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
                      className="w-full h-32 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
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

                    {showVideoAnswerResults[question.id] && (
                      <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
                        {question.isPersonal ? (
                          <p className="text-sm text-teal-700">
                            <span className="font-medium">Note:</span> This is a personal question. Your answer has been saved for practice. 
                            There's no right or wrong answer - focus on expressing your thoughts in English!
                          </p>
                        ) : (
                          <div>
                            <p className="text-sm text-teal-700">
                              <span className="font-medium">Note:</span> Your answer has been checked and saved.
                            </p>
                            <p className="text-xs text-teal-500 mt-2">
                              Tip: Use the vocabulary provided above to improve your answer.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">🎯 Listening Practice Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li><span className="font-medium">Active Listening:</span> Focus on understanding the main ideas and key details</li>
                  <li><span className="font-medium">Repeat & Shadow:</span> Try to repeat phrases immediately after hearing them</li>
                  <li><span className="font-medium">Take Notes:</span> Write down new vocabulary and expressions</li>
                  <li><span className="font-medium">Watch Multiple Times:</span> First for general understanding, then for details</li>
                  <li><span className="font-medium">Practice Speaking:</span> Try to answer questions out loud</li>
                  <li><span className="font-medium">Use Subtitles:</span> Start with subtitles, then try without</li>
                  <li><span className="font-medium">Imitate Pronunciation:</span> Copy the speakers' intonation and rhythm</li>
                  <li><span className="font-medium">Daily Practice:</span> Even 15-20 minutes daily makes a big difference</li>
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
              onClick={() => router.push("/cursos/lesson13")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson15")}
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