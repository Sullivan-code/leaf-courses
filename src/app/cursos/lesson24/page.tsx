"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, Download, MessageCircle, RefreshCw } from "lucide-react";

// ==============================
// LESSON CONFIGURATION
// ==============================
const LESSON_NUMBER = 24;
const LESSON_TITLE = "Lifestyle & Weekly Planning";
const LESSON_THEME_COLOR = "#0ea5e9"; // Sky-500
const BACKGROUND_IMAGE = "/images/lesson24-bg.jpg"; // You will need to provide this image

// ==============================
// LESSON DATA - PRONUNCIATION
// ==============================
const pronunciationItems = [
  { word: "apple", phrase: "an apple", example: "I want an apple, please.", audio: "/audios/lesson24/apple.mp3" },
  { word: "gym", phrase: "to the gym", example: "Do you go to the gym every day?", audio: "/audios/lesson24/gym.mp3" },
  { word: "want", phrase: "want to", example: "Do you want to see my new tablet?", audio: "/audios/lesson24/want.mp3" },
  { word: "cook", phrase: "how to cook", example: "She knows how to cook.", audio: "/audios/lesson24/cook.mp3" },
  { word: "know", phrase: "know how to", example: "I don't know how to cook.", audio: "/audios/lesson24/know.mp3" },
  { word: "beach", phrase: "to the beach", example: "Do you like to go to the beach?", audio: "/audios/lesson24/beach.mp3" },
  { word: "eat", phrase: "eat beef", example: "We eat beef on weekends.", audio: "/audios/lesson24/eat.mp3" },
  { word: "pancake", phrase: "two pancakes", example: "I want two pancakes, please.", audio: "/audios/lesson24/pancake.mp3" },
];

// ==============================
// LESSON DATA - SUBSTITUTION PRACTICE I
// ==============================
const substitutionPracticeI = {
  portuguese: [
    { sentence: "She doesn't know my father.", substitutions: ["teacher", "classmate"], translations: ["professor(a)", "colega de classe"] },
    { sentence: "He likes to learn about biology.", substitutions: ["geography", "languages"], translations: ["geografia", "idiomas"] },
    { sentence: "I wash the dishes every day.", substitutions: ["He", "She"], translations: ["Ele", "Ela"] },
    { sentence: "He doesn't go to the gym in the morning.", substitutions: ["university", "office"], translations: ["universidade", "escritório"] },
    { sentence: "She knows how to cook very well.", substitutions: ["speak English", "Spanish"], translations: ["falar inglês", "espanhol"] },
  ],
  english: [
    { base: "She doesn't know my father.", withSub: "She doesn't know my {substitution}.", defaultSub: "father" },
    { base: "He likes to learn about biology.", withSub: "He likes to learn about {substitution}.", defaultSub: "biology" },
    { base: "I wash the dishes every day.", withSub: "{substitution} washes the dishes every day.", defaultSub: "I" },
    { base: "He doesn't go to the gym in the morning.", withSub: "He doesn't go to the {substitution} in the morning.", defaultSub: "gym" },
    { base: "She knows how to cook very well.", withSub: "She knows how to {substitution} very well.", defaultSub: "cook" },
  ]
};

// ==============================
// LESSON DATA - CHANGE INTO NEGATIVE
// ==============================
const changeToNegativeExercises = [
  { id: 1, sentence: "She studies English all day long.", answer: "She doesn't study English all day long." },
  { id: 2, sentence: "He knows how to speak Italian.", answer: "He doesn't know how to speak Italian." },
  { id: 3, sentence: "She stays in the countryside during the week.", answer: "She doesn't stay in the countryside during the week." },
  { id: 4, sentence: "He wants to learn how to cook.", answer: "He doesn't want to learn how to cook." },
  { id: 5, sentence: "She cooks pasta on weekends.", answer: "She doesn't cook pasta on weekends." },
  { id: 6, sentence: "He wants to drink a glass of water.", answer: "He doesn't want to drink a glass of water." },
];

// ==============================
// LESSON DATA - SUBSTITUTION PRACTICE II
// ==============================
const substitutionPracticeII = {
  portuguese: [
    { sentence: "I see your sister at work.", substitutions: ["wife", "girlfriend"], translations: ["esposa", "namorada"] },
    { sentence: "My wife wants to learn German this year.", substitutions: ["My girlfriend", "My mother"], translations: ["Minha namorada", "Minha mãe"] },
    { sentence: "We like to speak in Italian.", substitutions: ["Spanish", "French"], translations: ["espanhol", "francês"] },
    { sentence: "My parents prefer to eat fish for lunch.", substitutions: ["chicken", "fish"], translations: ["frango", "peixe"] },
    { sentence: "I don't exercise on weekends.", substitutions: ["He", "She"], translations: ["Ele", "Ela"] },
  ],
  english: [
    { base: "I see your sister at work.", withSub: "I see your {substitution} at work.", defaultSub: "sister" },
    { base: "My wife wants to learn German this year.", withSub: "{substitution} wants to learn German this year.", defaultSub: "My wife" },
    { base: "We like to speak in Italian.", withSub: "We like to speak in {substitution}.", defaultSub: "Italian" },
    { base: "My parents prefer to eat fish for lunch.", withSub: "My parents prefer to eat {substitution} for lunch.", defaultSub: "fish" },
    { base: "I don't exercise on weekends.", withSub: "{substitution} doesn't exercise on weekends.", defaultSub: "I" },
  ]
};

// ==============================
// LESSON DATA - CHANGE INTO AFFIRMATIVE
// ==============================
const changeToAffirmativeExercises = [
  { id: 7, sentence: "My friend doesn't understand your friend.", answer: "My friend understands your friend." },
  { id: 8, sentence: "My co-worker doesn't study at the university.", answer: "My co-worker studies at the university." },
  { id: 9, sentence: "He doesn't like to read about this subject.", answer: "He likes to read about this subject." },
  { id: 10, sentence: "My girlfriend doesn't go home early on Mondays.", answer: "My girlfriend goes home early on Mondays." },
  { id: 11, sentence: "He doesn't have math classes at school.", answer: "He has math classes at school." },
  { id: 12, sentence: "My boyfriend doesn't want to go to the mall.", answer: "My boyfriend wants to go to the mall." },
];

// ==============================
// LESSON DATA - QUESTIONS
// ==============================
const conversationQuestions = [
  "What time do you go to work or to school?",
  "Do you know how to cook?",
  "Do you want to learn how to speak Spanish?",
  "Do you usually go to the beach?",
  "Do you live in a house or in an apartment?",
  "Do you usually stay home on weekends?",
  "Do you like to sleep on the couch?",
  "Do you want to learn more languages?",
  "Do you work out during the week?",
  "What do you want to study this year?",
];

// ==============================
// LESSON DATA - TUNE YOUR EARS (VIDEO)
// ==============================
const tuneYourEarsData = {
  title: "A1 English Listening Practice - How to improve English in five months",
  youtubeId: "DWhiLOwb99Y",
  description: "Watch this video to practice your listening skills and learn tips for improving your English.",
  keyVocabulary: [
    { english: "To write down", portuguese: "Anotar / Escrever" },
    { english: "As soon as ...", portuguese: "Assim que ..." },
    { english: "Throughout", portuguese: "Ao longo" },
    { english: "To speak out loud", portuguese: "Falar em voz alta" },
    { english: "To get used to", portuguese: "Acostumar-se a" },
    { english: "To go back", portuguese: "Voltar" },
    { english: "Feedback", portuguese: "Comentário / Opinião" },
    { english: "Well-rounded", portuguese: "Completo / Habilidoso" },
    { english: "Learning schedule", portuguese: "Agenda de aprendizagem" },
    { english: "Consistent practice", portuguese: "Prática consistente" },
    { english: "Daily routine", portuguese: "Rotina diária" },
    { english: "Make progress", portuguese: "Fazer progresso" },
    { english: "Set goals", portuguese: "Definir metas" },
    { english: "Stay organized", portuguese: "Manter-se organizado" },
    { english: "Track progress", portuguese: "Acompanhar o progresso" },
    { english: "Incorporate into", portuguese: "Incorporar a" },
    { english: "Daily activities", portuguese: "Atividades diárias" },
    { english: "Surround yourself with", portuguese: "Cercar-se de" },
    { english: "Improve fluency", portuguese: "Melhorar a fluência" },
    { english: "Build confidence", portuguese: "Construir confiança" },
  ],
  discussionQuestions: [
    "Why is it good changing sentences with words we've learned?",
    "How do you practice speaking out loud?",
    "Do you like reviewing old lessons?"
  ],
  videoQuestions: [
    {
      id: 1,
      question: "What is one key tip mentioned for improving English?",
      correctAnswer: "Practice speaking every day, even if it's just for a few minutes.",
      vocabulary: [
        { english: "consistent practice", portuguese: "prática consistente" },
        { english: "daily routine", portuguese: "rotina diária" },
        { english: "make progress", portuguese: "fazer progresso" }
      ]
    },
    {
      id: 2,
      question: "How can weekly planning help with language learning?",
      correctAnswer: "It helps you stay organized and set specific goals for each week.",
      vocabulary: [
        { english: "set goals", portuguese: "definir metas" },
        { english: "stay organized", portuguese: "manter-se organizado" },
        { english: "track progress", portuguese: "acompanhar o progresso" }
      ]
    },
    {
      id: 3,
      question: "What lifestyle change can make learning English easier?",
      correctAnswer: "Incorporating English into your daily activities, like listening to music or podcasts.",
      vocabulary: [
        { english: "incorporate into", portuguese: "incorporar a" },
        { english: "daily activities", portuguese: "atividades diárias" },
        { english: "surround yourself with", portuguese: "cercar-se de" }
      ]
    }
  ]
};

// ==============================
// AUXILIARY COMPONENT: AUDIO PLAYER
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
        className={`${compact ? "p-1" : "p-2"} text-white rounded-full hover:opacity-90`}
        style={{ backgroundColor: LESSON_THEME_COLOR }}
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
// AUXILIARY COMPONENT: ANSWER RESULT
// ==============================
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

// ==============================
// SUBSTITUTION COMPONENT (SIMPLIFIED - LEFT SIDE ONLY)
// ==============================
interface SubstitutionItem {
  base: string;
  withSub: string;
  defaultSub: string;
}

interface SubstitutionPracticeProps {
  data: {
    portuguese: Array<{ sentence: string; substitutions: string[]; translations: string[] }>;
    english: SubstitutionItem[];
  };
  title: string;
  colorTheme: string;
  gradientFrom: string;
  gradientTo: string;
  borderColor: string;
  textColor: string;
}

const SubstitutionPractice = ({ 
  data, 
  title, 
  colorTheme,
  gradientFrom,
  gradientTo,
  borderColor,
  textColor 
}: SubstitutionPracticeProps) => {
  const [selectedSubstitutions, setSelectedSubstitutions] = useState<Record<number, string>>({});

  const getCurrentSentence = (index: number) => {
    const selected = selectedSubstitutions[index] || data.english[index].defaultSub;
    return data.english[index].withSub.replace("{substitution}", selected);
  };

  const handleSubstitutionClick = (sentenceIndex: number, substitution: string) => {
    setSelectedSubstitutions(prev => ({
      ...prev,
      [sentenceIndex]: substitution
    }));
  };

  const resetSentence = (sentenceIndex: number) => {
    setSelectedSubstitutions(prev => {
      const newState = { ...prev };
      delete newState[sentenceIndex];
      return newState;
    });
  };

  const resetAll = () => {
    setSelectedSubstitutions({});
  };

  return (
    <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} border-2 ${borderColor} rounded-3xl shadow-lg overflow-hidden`}>
      <div className={`bg-gradient-to-r ${colorTheme} text-white py-5 px-8 flex justify-between items-center`}>
        <h2 className="text-2xl font-bold">🔄 {title}</h2>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition text-sm"
        >
          <RefreshCw size={16} /> Reset All
        </button>
      </div>
      
      <div className="p-8">
        <div className="space-y-6">
          {data.portuguese.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border-2 shadow-md" style={{ borderColor: borderColor.replace('border-', '') }}>
              {/* Portuguese Instruction */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <p className="text-gray-500 text-sm mb-1">🇵🇹 Instrução em Português:</p>
                <p className={`${textColor} font-medium text-lg`}>{item.sentence}</p>
              </div>
              
              {/* English Sentence Display */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm mb-1">🇬🇧 English Sentence:</p>
                <p className="text-gray-800 font-medium text-xl">
                  {getCurrentSentence(idx)}
                </p>
              </div>
              
              {/* Substitution Buttons with Translations */}
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">💡 Click to substitute:</p>
                <div className="flex gap-3 flex-wrap">
                  {item.substitutions.map((sub, subIdx) => (
                    <button
                      key={subIdx}
                      onClick={() => handleSubstitutionClick(idx, sub)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all flex flex-col items-center ${
                        selectedSubstitutions[idx] === sub
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={{ backgroundColor: selectedSubstitutions[idx] === sub ? LESSON_THEME_COLOR : undefined }}
                    >
                      <span className="font-medium">{sub}</span>
                      <span className="text-xs opacity-75">{item.translations[subIdx]}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => resetSentence(idx)}
                    className="px-4 py-2 rounded-lg text-sm bg-gray-200 text-gray-600 hover:bg-gray-300 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              {/* Current Substitution Info */}
              <div className="mt-3 text-xs text-gray-400 pt-2 border-t border-gray-100">
                <span>Current word: </span>
                <strong className="text-blue-600">
                  {selectedSubstitutions[idx] || data.english[idx].defaultSub}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==============================
// MAIN COMPONENT
// ==============================
export default function Lesson24Lifestyle() {
  const router = useRouter();
  
  // State for section expansion control
  const [expandedSections, setExpandedSections] = useState({
    pronunciation: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    questions: true,
    tuneYourEars: true
  });

  // State for exercise answers
  const [negativeAnswers, setNegativeAnswers] = useState<Record<number, string>>({});
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [discussionAnswers, setDiscussionAnswers] = useState<Record<number, string>>({});
  
  // State for check results
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<string, boolean>>({});

  // ==============================
  // HANDLER FUNCTIONS
  // ==============================
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAnswerChange = (type: 'negative' | 'affirmative' | 'question' | 'video' | 'discussion', id: number, value: string) => {
    switch (type) {
      case 'negative':
        setNegativeAnswers(prev => ({ ...prev, [id]: value }));
        break;
      case 'affirmative':
        setAffirmativeAnswers(prev => ({ ...prev, [id]: value }));
        break;
      case 'question':
        setQuestionAnswers(prev => ({ ...prev, [id]: value }));
        break;
      case 'video':
        setVideoAnswers(prev => ({ ...prev, [id]: value }));
        break;
      case 'discussion':
        setDiscussionAnswers(prev => ({ ...prev, [id]: value }));
        break;
    }
    
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: false }));
  };

  const checkAnswer = (type: 'negative' | 'affirmative' | 'video', id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    
    const isCorrect = normalizedUser === normalizedCorrect;
    
    setAnswerCorrectness(prev => ({ ...prev, [`${type}-${id}`]: isCorrect }));
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: true }));
    
    return isCorrect;
  };

  const clearAnswer = (type: 'negative' | 'affirmative' | 'question' | 'video' | 'discussion', id: number) => {
    switch (type) {
      case 'negative':
        setNegativeAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        break;
      case 'affirmative':
        setAffirmativeAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        break;
      case 'question':
        setQuestionAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        break;
      case 'video':
        setVideoAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        break;
      case 'discussion':
        setDiscussionAnswers(prev => {
          const newState = { ...prev };
          delete newState[id];
          return newState;
        });
        break;
    }
    
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: false }));
  };

  const saveAllAnswers = () => {
    const allData = {
      negativeAnswers,
      affirmativeAnswers,
      questionAnswers,
      videoAnswers,
      discussionAnswers,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lesson${LESSON_NUMBER}_answers`, JSON.stringify(allData));
    alert("All your answers have been saved locally!");
  };

  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here. For now, your answers are saved in your browser.");
  };

  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-center bg-fixed" style={{ 
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('${BACKGROUND_IMAGE}')`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-3xl p-10 shadow-2xl backdrop-blur-sm">
        
        {/* LESSON HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER} – {LESSON_TITLE}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Master pronunciation, practice sentence construction, and improve your listening skills for talking about lifestyle and weekly planning.
          </p>
          
          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            >
              <Check size={20} /> Save Progress
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
            >
              <Download size={20} /> Export as PDF
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
            >
              <MessageCircle size={20} /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* SECTION 1: IMPROVE YOUR PRONUNCIATION - COM NOVA IMAGEM DE ACADEMIA */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎯 IMPROVE YOUR PRONUNCIATION</h2>
            <button 
              onClick={() => toggleSection('pronunciation')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.pronunciation ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.pronunciation && (
            <div className="p-8">
              {/* NOVA IMAGEM DE ACADEMIA - PESSOA TREINANDO */}
              <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative w-full h-72 md:h-96">
                  <Image
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=600&fit=crop"
                    alt="Pessoa treinando na academia com halteres - Healthy lifestyle and fitness"
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
                    <div>
                      <h3 className="text-white text-3xl font-bold mb-2">💪 Train Your Body & Your English!</h3>
                      <p className="text-white text-lg opacity-95">Build strength in fitness and language skills together</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Grid de Pronúncia */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pronunciationItems.map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-lg font-bold text-blue-800">{item.word}</h4>
                      <AudioPlayer src={item.audio} compact />
                    </div>
                    <p className="text-blue-600 mb-1">{item.phrase}</p>
                    <p className="text-gray-700 italic text-sm">{item.example}</p>
                  </div>
                ))}
              </div>

              {/* Dica extra sobre estilo de vida saudável */}
              <div className="mt-8 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-300 rounded-xl p-4 text-center">
                <p className="text-blue-700">
                  💪 <span className="font-bold">Fitness & Learning Tip:</span> Just like going to the gym regularly, practice English every day for best results! Consistency is key for both fitness and fluency.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SUBSTITUTION PRACTICE I */}
        <div className="mb-16">
          <SubstitutionPractice
            data={substitutionPracticeI}
            title="SUBSTITUTION PRACTICE I"
            colorTheme="from-purple-500 to-pink-500"
            gradientFrom="from-purple-50 to-pink-50"
            gradientTo=""
            borderColor="border-purple-200"
            textColor="text-purple-700"
          />
        </div>

        {/* SECTION 3: CHANGE INTO NEGATIVE */}
        <div className="mb-16 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
            <button 
              onClick={() => toggleSection('negative')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.negative && (
            <div className="p-8">
              <p className="text-red-700 mb-6 italic">
                Transform the following affirmative sentences into negative sentences.
              </p>
              
              <div className="space-y-6">
                {changeToNegativeExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-5 rounded-xl border border-red-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800 mb-2">{exercise.sentence}</p>
                        <textarea
                          value={negativeAnswers[exercise.id] || ""}
                          onChange={(e) => handleAnswerChange('negative', exercise.id, e.target.value)}
                          placeholder="Write the negative version here..."
                          className="w-full h-20 p-3 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => checkAnswer('negative', exercise.id, negativeAnswers[exercise.id] || "", exercise.answer)}
                          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => clearAnswer('negative', exercise.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    {showResults[`negative-${exercise.id}`] && (
                      <div className="mt-3">
                        <AnswerResult 
                          isCorrect={answerCorrectness[`negative-${exercise.id}`] || false}
                          correctAnswer={exercise.answer}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: SUBSTITUTION PRACTICE II */}
        <div className="mb-16">
          <SubstitutionPractice
            data={substitutionPracticeII}
            title="SUBSTITUTION PRACTICE II"
            colorTheme="from-green-500 to-emerald-500"
            gradientFrom="from-green-50 to-emerald-50"
            gradientTo=""
            borderColor="border-green-200"
            textColor="text-green-700"
          />
        </div>

        {/* SECTION 5: CHANGE INTO AFFIRMATIVE */}
        <div className="mb-16 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
            <button 
              onClick={() => toggleSection('affirmative')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.affirmative && (
            <div className="p-8">
              <p className="text-yellow-700 mb-6 italic">
                Transform the following negative sentences into affirmative sentences.
              </p>
              
              <div className="space-y-6">
                {changeToAffirmativeExercises.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-5 rounded-xl border border-yellow-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-800 mb-2">{exercise.sentence}</p>
                        <textarea
                          value={affirmativeAnswers[exercise.id] || ""}
                          onChange={(e) => handleAnswerChange('affirmative', exercise.id, e.target.value)}
                          placeholder="Write the affirmative version here..."
                          className="w-full h-20 p-3 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => checkAnswer('affirmative', exercise.id, affirmativeAnswers[exercise.id] || "", exercise.answer)}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => clearAnswer('affirmative', exercise.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    
                    {showResults[`affirmative-${exercise.id}`] && (
                      <div className="mt-3">
                        <AnswerResult 
                          isCorrect={answerCorrectness[`affirmative-${exercise.id}`] || false}
                          correctAnswer={exercise.answer}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: CONVERSATION QUESTIONS */}
        <div className="mb-16 bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-indigo-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">💬 CONVERSATION QUESTIONS</h2>
            <button 
              onClick={() => toggleSection('questions')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.questions && (
            <div className="p-8">
              <p className="text-indigo-700 mb-6 italic">
                Practice answering these questions about your lifestyle and weekly planning.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conversationQuestions.map((question, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-xl border border-indigo-200">
                    <h4 className="text-lg font-medium text-indigo-800 mb-3">{question}</h4>
                    <textarea
                      value={questionAnswers[idx] || ""}
                      onChange={(e) => handleAnswerChange('question', idx, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => clearAnswer('question', idx)}
                        className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">💡 Tips for Answering:</h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                  <li>Try to answer in complete sentences</li>
                  <li>Use vocabulary from this lesson when possible</li>
                  <li>Be honest about your own lifestyle and habits</li>
                  <li>Practice saying your answers out loud</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: TUNE IN YOUR EARS */}
        <div className="mb-16 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
            <button 
              onClick={() => toggleSection('tuneYourEars')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.tuneYourEars ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.tuneYourEars && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneYourEarsData.title}
                </h3>
                <p className="text-cyan-600 mb-6">{tuneYourEarsData.description}</p>
                
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneYourEarsData.youtubeId}`}
                      title={tuneYourEarsData.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">📝 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tuneYourEarsData.keyVocabulary.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-white rounded-lg hover:shadow-md transition">
                      <span className="font-medium text-cyan-700">{item.english}</span>
                      <span className="text-cyan-600">{item.portuguese}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">💭 Discussion Questions:</h3>
                <div className="space-y-4">
                  {tuneYourEarsData.discussionQuestions.map((question, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg">
                      <p className="font-medium text-cyan-700 mb-2">{idx + 1}. {question}</p>
                      <textarea
                        value={discussionAnswers[idx] || ""}
                        onChange={(e) => handleAnswerChange('discussion', idx, e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full p-2 border border-cyan-300 rounded-md focus:ring-2 focus:ring-cyan-500"
                        rows={3}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => clearAnswer('discussion', idx)}
                          className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">🎯 Video Comprehension Questions:</h3>
                {tuneYourEarsData.videoQuestions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 border-cyan-200 shadow-md">
                    <h4 className="text-lg font-bold text-cyan-700 mb-3">
                      Question {q.id}: {q.question}
                    </h4>
                    
                    {q.vocabulary && (
                      <div className="mb-4 p-3 bg-cyan-50 rounded-lg">
                        <p className="text-sm font-medium text-cyan-600 mb-1">Vocabulary hints:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-cyan-700 font-medium">{word.english}</span>
                              <span className="text-cyan-600">{word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleAnswerChange('video', q.id, e.target.value)}
                      placeholder="Write your answer based on what you heard..."
                      className="w-full h-32 p-3 border border-cyan-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => checkAnswer('video', q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition font-medium"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => clearAnswer('video', q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
                      >
                        Clear
                      </button>
                    </div>

                    {showResults[`video-${q.id}`] && (
                      <div className="mt-3">
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
                <h3 className="text-xl font-bold text-cyan-800 mb-4">🎯 Listening Tips:</h3>
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

        {/* FOOTER AND NAVIGATION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium"
            >
              <Check size={20} /> Save All Answers
            </button>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to clear all answers?")) {
                  setNegativeAnswers({});
                  setAffirmativeAnswers({});
                  setQuestionAnswers({});
                  setVideoAnswers({});
                  setDiscussionAnswers({});
                  setShowResults({});
                  setAnswerCorrectness({});
                }
              }}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium"
            >
              <X size={20} /> Clear All
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos")}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition font-medium"
            >
              &larr; Back to Courses
            </button>
            <button
              onClick={() => router.push(`/cursos/lesson${LESSON_NUMBER + 1}`)}
              className="px-6 py-3 text-white rounded-full transition font-medium"
              style={{ backgroundColor: LESSON_THEME_COLOR }}
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
        
        {/* CREDITS */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} • Interactive English Practice • All answers are saved in your browser</p>
        </div>
      </div>
    </div>
  );
}