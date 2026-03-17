"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { 
  Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, 
  X, Check, XCircle, Download, MessageCircle, Coffee, 
  BookOpen, Briefcase, Utensils, Home, Tv, Smartphone, Users
} from "lucide-react";

// ==============================
// CONFIGURAÇÃO DA LIÇÃO
// ==============================
const LESSON_NUMBER = 34;
const LESSON_TITLE = "Improve Your Pronunciation";
const LESSON_THEME_COLOR = "#0ea5e9"; // Sky-500
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
const PRONUNCIATION_IMAGE = "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

// ==============================
// DADOS DA LIÇÃO - PRONÚNCIA
// ==============================
const pronunciationItems = [
  { word: "milk", phrase: "I drink coffee with milk.", example: "I drink coffee with milk every morning.", audio: "/audios/lesson34/milk.mp3", icon: Coffee },
  { word: "book", phrase: "I like this book.", example: "I like this book very much.", audio: "/audios/lesson34/book.mp3", icon: BookOpen },
  { word: "homework", phrase: "I have homework today.", example: "I have homework today after school.", audio: "/audios/lesson34/homework.mp3", icon: BookOpen },
  { word: "project", phrase: "I need to finish this project.", example: "I need to finish this project by Friday.", audio: "/audios/lesson34/project.mp3", icon: Briefcase },
  { word: "what", phrase: "What do you want?", example: "What do you want for breakfast?", audio: "/audios/lesson34/what.mp3", icon: null },
  { word: "breakfast", phrase: "What do you eat for breakfast?", example: "What do you eat for breakfast on weekdays?", audio: "/audios/lesson34/breakfast.mp3", icon: Utensils },
  { word: "cup", phrase: "I want a cup of tea.", example: "I want a cup of tea, please.", audio: "/audios/lesson34/cup.mp3", icon: Coffee },
  { word: "soup", phrase: "Do you like soup?", example: "Do you like soup or salad?", audio: "/audios/lesson34/soup.mp3", icon: Utensils },
  { word: "job", phrase: "Do you like your job?", example: "Do you like your job at the hospital?", audio: "/audios/lesson34/job.mp3", icon: Briefcase },
  { word: "cab", phrase: "I need a cab.", example: "I need a cab to go to the airport.", audio: "/audios/lesson34/cab.mp3", icon: null },
  { word: "food", phrase: "We need to buy some food.", example: "We need to buy some food for the party.", audio: "/audios/lesson34/food.mp3", icon: Utensils },
  { word: "good", phrase: "Good job.", example: "Good job on the presentation!", audio: "/audios/lesson34/good.mp3", icon: null },
  { word: "bad", phrase: "It's bad.", example: "The weather is bad today.", audio: "/audios/lesson34/bad.mp3", icon: null },
  { word: "everything", phrase: "I know everything about the project.", example: "I know everything about the project details.", audio: "/audios/lesson34/everything.mp3", icon: null },
  { word: "thing", phrase: "I have to buy one more thing.", example: "I have to buy one more thing at the store.", audio: "/audios/lesson34/thing.mp3", icon: null },
];

// ==============================
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE I
// ==============================
const substitutionPracticeI = [
  {
    id: 1,
    english: "The test starts now.",
    portuguese: "A prova começa agora.",
    substitutions: [
      { word: "The test", options: ["The test", "The movie", "The meeting"] },
      { word: "now", options: ["now", "in a few minutes"] }
    ],
    currentText: "The test starts now."
  },
  {
    id: 2,
    english: "The project ends next week.",
    portuguese: "O projeto termina na próxima semana.",
    substitutions: [
      { word: "next week", options: ["next week", "next month", "next year"] }
    ],
    currentText: "The project ends next week."
  },
  {
    id: 3,
    english: "She works here every day.",
    portuguese: "Ela trabalha aqui todos os dias.",
    substitutions: [
      { word: "every day", options: ["every day", "during the week", "all day"] }
    ],
    currentText: "She works here every day."
  },
  {
    id: 4,
    english: "She wants to know more about this subject.",
    portuguese: "Ela quer saber mais sobre este assunto.",
    substitutions: [
      { word: "know", options: ["know", "learn", "understand"] }
    ],
    currentText: "She wants to know more about this subject."
  },
  {
    id: 5,
    english: "He likes to talk about religion.",
    portuguese: "Ele gosta de falar sobre religião.",
    substitutions: [
      { word: "religion", options: ["religion", "music", "business"] }
    ],
    currentText: "He likes to talk about religion."
  }
];

// ==============================
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE II
// ==============================
const substitutionPracticeII = [
  {
    id: 1,
    english: "Let's talk about fashion!",
    portuguese: "Vamos conversar sobre moda!",
    substitutions: [
      { word: "fashion", options: ["fashion", "sports", "music"] }
    ],
    currentText: "Let's talk about fashion!"
  },
  {
    id: 2,
    english: "He talks with his father about politics.",
    portuguese: "Ele conversa com o pai dele sobre política.",
    substitutions: [
      { word: "politics", options: ["politics", "business", "movies"] }
    ],
    currentText: "He talks with his father about politics."
  },
  {
    id: 3,
    english: "I don't have an opinion about it.",
    portuguese: "Eu não tenho uma opinião sobre isso.",
    substitutions: [
      { word: "it", options: ["it", "this problem", "this subject"] }
    ],
    currentText: "I don't have an opinion about it."
  },
  {
    id: 4,
    english: "What time does your class start?",
    portuguese: "A que horas sua aula começa?",
    substitutions: [
      { word: "your", options: ["your", "his", "her"] }
    ],
    currentText: "What time does your class start?"
  },
  {
    id: 5,
    english: "What do you watch on TV?",
    portuguese: "O que você assiste na TV?",
    substitutions: [
      { word: "on TV", options: ["on TV", "on your cell phone", "on your tablet"] }
    ],
    currentText: "What do you watch on TV?"
  }
];

// ==============================
// DADOS DA LIÇÃO - AFFIRMATIVE PRACTICE
// ==============================
const affirmativePractice = [
  {
    id: 1,
    english: "She doesn't study English.",
    portuguese: "Ela não estuda inglês.",
    affirmative: "She studies English.",
    substitutions: [
      { word: "She", options: ["She", "He"] },
      { word: "English", options: ["English", "Spanish", "French"] }
    ],
    currentText: "She doesn't study English."
  },
  {
    id: 2,
    english: "He doesn't like coffee.",
    portuguese: "Ele não gosta de café.",
    affirmative: "He likes coffee.",
    substitutions: [
      { word: "He", options: ["He", "She"] },
      { word: "coffee", options: ["coffee", "tea", "juice"] }
    ],
    currentText: "He doesn't like coffee."
  },
  {
    id: 3,
    english: "They don't work on weekends.",
    portuguese: "Eles não trabalham nos fins de semana.",
    affirmative: "They work on weekends.",
    substitutions: [
      { word: "on weekends", options: ["on weekends", "on Mondays", "on Fridays"] }
    ],
    currentText: "They don't work on weekends."
  }
];

// ==============================
// DADOS DA LIÇÃO - QUESTIONS
// ==============================
const conversationQuestions = [
  { id: "a", question: "Do you have a minute to talk to me?", icon: Users },
  { id: "b", question: "Do you like to watch sports on TV?", icon: Tv },
  { id: "c", question: "Where do you have to go tonight?", icon: Home },
  { id: "d", question: "What do you usually talk to your friends about?", icon: Users },
  { id: "e", question: "What do you usually watch on your tablet?", icon: Smartphone },
  { id: "f", question: "Do you have to study for an exam this week?", icon: BookOpen },
  { id: "g", question: "What time does your English class start?", icon: BookOpen },
  { id: "h", question: "Does your teacher like to talk about music?", icon: Users },
  { id: "i", question: "Does your father / mother usually meet his / her friends on weekends?", icon: Users },
  { id: "j", question: "Does your wife / husband have to speak English at work?", icon: Briefcase },
];

// ==============================
// DADOS DA LIÇÃO - TUNE YOUR EARS (VÍDEO)
// ==============================
const tuneYourEarsVideo = {
  title: "A1 English Listening Practice - Daily Routines",
  youtubeId: "DWhiLOwb99Y",
  description: "Watch this video to practice your listening skills and learn vocabulary about daily routines.",
  questions: [
    {
      id: 1,
      question: "What time does the person wake up?",
      correctAnswer: "They wake up at 7 AM.",
      vocabulary: [
        { english: "wake up", portuguese: "acordar" },
        { english: "morning routine", portuguese: "rotina matinal" },
        { english: "alarm clock", portuguese: "despertador" }
      ]
    },
    {
      id: 2,
      question: "What do they eat for breakfast?",
      correctAnswer: "They eat cereal and drink coffee.",
      vocabulary: [
        { english: "breakfast", portuguese: "café da manhã" },
        { english: "cereal", portuguese: "cereal" },
        { english: "coffee", portuguese: "café" }
      ]
    },
    {
      id: 3,
      question: "How do they go to work?",
      correctAnswer: "They take the bus to work.",
      vocabulary: [
        { english: "take the bus", portuguese: "pegar o ônibus" },
        { english: "commute", portuguese: "deslocamento" },
        { english: "arrive at", portuguese: "chegar em" }
      ]
    }
  ]
};

// ==============================
// COMPONENTE AUXILIAR: PLAYER DE ÁUDIO
// ==============================
interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button 
        onClick={togglePlayPause} 
        className={`${compact ? "p-1" : "p-2"} text-white rounded-full hover:opacity-90 transition-all`}
        style={{ backgroundColor: LESSON_THEME_COLOR }}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all`}
      >
        <RotateCcw size={compact ? 12 : 16} />
      </button>
      
      {!compact && (
        <div className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-200" 
            style={{ width: `${progress}%`, backgroundColor: LESSON_THEME_COLOR }} 
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ==============================
// COMPONENTE: ANSWER RESULT
// ==============================
interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const AnswerResult = ({ isCorrect, correctAnswer }: AnswerResultProps) => {
  return (
    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border-2`}>
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <Check className="text-green-600 flex-shrink-0" size={24} />
        ) : (
          <XCircle className="text-red-600 flex-shrink-0" size={24} />
        )}
        <div>
          <p className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Correct!' : 'Not quite right'}
          </p>
          {!isCorrect && (
            <p className="text-gray-700">
              <span className="font-medium">Suggested answer:</span> {correctAnswer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE DE SUBSTITUIÇÃO INTERATIVA
// ==============================
interface SubstitutionExerciseProps {
  exercise: any;
  onUpdate: (id: number, newText: string) => void;
}

const SubstitutionExercise = ({ exercise, onUpdate }: SubstitutionExerciseProps) => {
  const [currentText, setCurrentText] = useState(exercise.english);
  const [showPortuguese, setShowPortuguese] = useState(false);

  const handleSubstitution = (oldWord: string, newWord: string) => {
    const newText = currentText.replace(oldWord, newWord);
    setCurrentText(newText);
    onUpdate(exercise.id, newText);
  };

  // Encontrar a palavra atual que pode ser substituída
  const getCurrentWord = (subOption: any) => {
    const words = currentText.split(' ');
    for (const word of words) {
      const cleanWord = word.replace(/[!?.]$/, '');
      if (subOption.options.includes(cleanWord)) {
        return cleanWord;
      }
    }
    return subOption.options[0];
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      {/* Cabeçalho com tradução */}
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"} {showPortuguese ? "Português" : "English"}
        </button>
      </div>

      {/* Frase atual */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-gray-800 mb-2">
          {currentText}
        </p>
        {showPortuguese && (
          <p className="text-lg text-gray-600 italic border-l-4 pl-3" 
             style={{ borderColor: LESSON_THEME_COLOR }}>
            {exercise.portuguese}
          </p>
        )}
      </div>

      {/* Botões de substituição */}
      <div className="space-y-3">
        {exercise.substitutions.map((sub: any, idx: number) => {
          const currentWord = getCurrentWord(sub);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Replace "{currentWord}":</span>
              <div className="flex flex-wrap gap-2">
                {sub.options.map((option: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSubstitution(currentWord, option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      currentWord === option 
                        ? 'bg-opacity-20 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    style={currentWord === option ? { backgroundColor: LESSON_THEME_COLOR, color: 'white' } : {}}
                    disabled={currentWord === option}
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
  );
};

// ==============================
// COMPONENTE DE PERGUNTA INTERATIVA
// ==============================
interface InteractiveQuestionProps {
  id: string;
  question: string;
  icon: any;
  value: string;
  onChange: (id: string, value: string) => void;
  onClear: (id: string) => void;
}

const InteractiveQuestion = ({ id, question, icon: Icon, value, onChange, onClear }: InteractiveQuestionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.borderColor = `${LESSON_THEME_COLOR}30`;
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex items-start gap-3 mb-4">
        {Icon && <Icon className="mt-1" style={{ color: LESSON_THEME_COLOR }} size={24} />}
        <h4 className="text-lg font-medium text-gray-800 flex-1">
          <span className="font-bold mr-2" style={{ color: LESSON_THEME_COLOR }}>{id}.</span>
          {question}
        </h4>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-24 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none transition resize-none"
        style={{ 
          borderColor: `${LESSON_THEME_COLOR}30`
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = LESSON_THEME_COLOR;
          e.currentTarget.style.boxShadow = `0 0 0 2px ${LESSON_THEME_COLOR}20`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = `${LESSON_THEME_COLOR}30`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={() => onClear(id)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
        >
          <X size={16} /> Clear
        </button>
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
export default function Lesson34Pronunciation() {
  const router = useRouter();
  
  // Estados para controle de expansão das seções
  const [expandedSections, setExpandedSections] = useState({
    pronunciation: true,
    substitution1: true,
    substitution2: true,
    affirmative: true,
    questions: true,
    tuneYourEars: true
  });

  // Estados para os exercícios interativos
  const [substitution1Texts, setSubstitution1Texts] = useState<Record<number, string>>({});
  const [substitution2Texts, setSubstitution2Texts] = useState<Record<number, string>>({});
  const [affirmativeTexts, setAffirmativeTexts] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  
  // Estados para resultados das verificações
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<string, boolean>>({});

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubstitution1Update = (id: number, newText: string) => {
    setSubstitution1Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleSubstitution2Update = (id: number, newText: string) => {
    setSubstitution2Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleAffirmativeUpdate = (id: number, newText: string) => {
    setAffirmativeTexts(prev => ({ ...prev, [id]: newText }));
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
  };

  const clearQuestion = (id: string) => {
    setQuestionAnswers(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const clearVideoAnswer = (id: number) => {
    setVideoAnswers(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setShowResults(prev => ({ ...prev, [`video-${id}`]: false }));
  };

  const checkVideoAnswer = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    
    const isCorrect = normalizedUser === normalizedCorrect;
    
    setAnswerCorrectness(prev => ({ ...prev, [`video-${id}`]: isCorrect }));
    setShowResults(prev => ({ ...prev, [`video-${id}`]: true }));
    
    return isCorrect;
  };

  // Função para salvar todas as respostas
  const saveAllAnswers = () => {
    const allData = {
      substitution1Texts,
      substitution2Texts,
      affirmativeTexts,
      questionAnswers,
      videoAnswers,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lesson${LESSON_NUMBER}_answers`, JSON.stringify(allData));
    alert("All your answers have been saved locally!");
  };

  // Função para exportar como PDF (simulação)
  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here. For now, your answers are saved in your browser.");
  };

  // Função para compartilhar no WhatsApp
  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // ==============================
  // RENDERIZAÇÃO
  // ==============================
  return (
    <div className="min-h-screen py-16 px-4 md:px-6 bg-cover bg-center bg-fixed relative"
         style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}>
      
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      
      <div className="relative max-w-6xl mx-auto bg-white bg-opacity-95 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        {/* CABEÇALHO DA LIÇÃO */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: `${LESSON_THEME_COLOR}20` }}>
            <Volume2 size={48} style={{ color: LESSON_THEME_COLOR }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER}
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800">{LESSON_TITLE}</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Master pronunciation, practice sentence substitution, and improve your conversation skills.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-lg"
            >
              <Check size={20} /> Save Progress
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-lg"
            >
              <Download size={20} /> Export as PDF
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-lg"
            >
              <MessageCircle size={20} /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* SEÇÃO 1: IMPROVE YOUR PRONUNCIATION */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
          <div className="py-5 px-8 flex justify-between items-center"
               style={{ background: `linear-gradient(135deg, ${LESSON_THEME_COLOR}, ${LESSON_THEME_COLOR}dd)` }}>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Volume2 size={24} /> IMPROVE YOUR PRONUNCIATION
            </h2>
            <button 
              onClick={() => toggleSection('pronunciation')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.pronunciation ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.pronunciation && (
            <div className="p-8">
              {/* IMAGEM HORIZONTAL GRANDE COM ÍCONES */}
              <div className="mb-10 rounded-2xl overflow-hidden shadow-xl relative">
                <div className="relative w-full h-72 md:h-96">
                  <Image
                    src={PRONUNCIATION_IMAGE}
                    alt="Pronunciation Practice"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-white text-3xl md:text-4xl font-bold mb-2">Practice These Words</h3>
                      <p className="text-white/90 text-lg">Click on the audio buttons to hear the pronunciation</p>
                    </div>
                  </div>
                  
                  {/* Ícones decorativos flutuantes */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Coffee className="text-amber-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><BookOpen className="text-blue-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Utensils className="text-red-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Briefcase className="text-purple-600" size={20} /></span>
                  </div>
                </div>
              </div>
              
              {/* ITENS DE PRONÚNCIA */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pronunciationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-white p-5 rounded-xl border-2 shadow-md hover:shadow-lg transition-all"
                         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={20} style={{ color: LESSON_THEME_COLOR }} />}
                          <h4 className="text-xl font-bold" style={{ color: LESSON_THEME_COLOR }}>{item.word}</h4>
                        </div>
                        <AudioPlayer src={item.audio} compact />
                      </div>
                      <p className="text-gray-700 mb-1 font-medium">{item.phrase}</p>
                      <p className="text-gray-500 italic text-sm border-l-2 pl-2" style={{ borderColor: LESSON_THEME_COLOR }}>
                        {item.example}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 2: SUBSTITUTION PRACTICE I */}
        <div className="mb-16 bg-gradient-to-br from-purple-50 to-pink-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#a855f7" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔄 SUBSTITUTION PRACTICE I
            </h2>
            <button 
              onClick={() => toggleSection('substitution1')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.substitution1 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.substitution1 && (
            <div className="p-8">
              <div className="space-y-6">
                {substitutionPracticeI.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleSubstitution1Update}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 3: SUBSTITUTION PRACTICE II */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#10b981" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔄 SUBSTITUTION PRACTICE II
            </h2>
            <button 
              onClick={() => toggleSection('substitution2')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.substitution2 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.substitution2 && (
            <div className="p-8">
              <div className="space-y-6">
                {substitutionPracticeII.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleSubstitution2Update}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 4: AFFIRMATIVE PRACTICE */}
        <div className="mb-16 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f59e0b" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-amber-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              ➕ AFFIRMATIVE PRACTICE
            </h2>
            <button 
              onClick={() => toggleSection('affirmative')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.affirmative ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.affirmative && (
            <div className="p-8">
              <p className="text-amber-700 mb-6 italic font-medium">
                Transform these negative sentences into affirmative sentences.
              </p>
              <div className="space-y-6">
                {affirmativePractice.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleAffirmativeUpdate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 5: CONVERSATION QUESTIONS */}
        <div className="mb-16 bg-gradient-to-br from-indigo-50 to-violet-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#6366f1" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-violet-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              💬 QUESTIONS
            </h2>
            <button 
              onClick={() => toggleSection('questions')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.questions ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.questions && (
            <div className="p-8">
              <p className="text-indigo-700 mb-6 italic">
                Practice answering these questions to improve your conversation skills.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conversationQuestions.map((item) => (
                  <InteractiveQuestion
                    key={item.id}
                    id={item.id}
                    question={item.question}
                    icon={item.icon}
                    value={questionAnswers[item.id] || ""}
                    onChange={handleQuestionChange}
                    onClear={clearQuestion}
                  />
                ))}
              </div>
              
              <div className="mt-8 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 💡 Tips for Answering:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                  <li>Try to answer in complete sentences</li>
                  <li>Use vocabulary from this lesson when possible</li>
                  <li>Be honest about your own experiences</li>
                  <li>Practice saying your answers out loud</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 6: TUNE YOUR EARS (VÍDEO) */}
        <div className="mb-16 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🎧 TUNE YOUR EARS
            </h2>
            <button 
              onClick={() => toggleSection('tuneYourEars')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.tuneYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.tuneYourEars && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneYourEarsVideo.title}
                </h3>
                <p className="text-cyan-600 mb-6">{tuneYourEarsVideo.description}</p>
                
                {/* VÍDEO DO YOUTUBE */}
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
              
              {/* PERGUNTAS DO VÍDEO */}
              <div className="space-y-8">
                {tuneYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md"
                       style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: LESSON_THEME_COLOR }}>
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
                      style={{ borderColor: `${LESSON_THEME_COLOR}30` }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = LESSON_THEME_COLOR;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${LESSON_THEME_COLOR}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = `${LESSON_THEME_COLOR}30`;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="text-white px-6 py-2 rounded-lg transition font-medium hover:opacity-90"
                        style={{ backgroundColor: LESSON_THEME_COLOR }}
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

                    {showResults[`video-${q.id}`] && (
                      <div className="mt-4">
                        <AnswerResult 
                          isCorrect={answerCorrectness[`video-${q.id}`] || false} 
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

        {/* RODAPÉ E NAVEGAÇÃO */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium shadow-md"
            >
              <Check size={20} /> Save All Answers
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all answers?")) {
                  setSubstitution1Texts({});
                  setSubstitution2Texts({});
                  setAffirmativeTexts({});
                  setQuestionAnswers({});
                  setVideoAnswers({});
                  setShowResults({});
                  setAnswerCorrectness({});
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium shadow-md"
            >
              <X size={20} /> Clear All
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos")}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition font-medium shadow-md"
            >
              &larr; Back to Courses
            </button>
            <button
              onClick={() => router.push(`/cursos/lesson${LESSON_NUMBER + 1}`)}
              className="px-6 py-3 text-white rounded-full transition font-medium shadow-md"
              style={{ backgroundColor: LESSON_THEME_COLOR }}
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
        
        {/* CRÉDITOS */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} • Interactive English Practice • All answers are saved in your browser</p>
        </div>
      </div>
    </div>
  );
}