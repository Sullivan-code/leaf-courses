"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, Download, MessageCircle } from "lucide-react";

// ==============================
// CONFIGURAÇÃO DA LIÇÃO
// ==============================
const LESSON_NUMBER = 24;
const LESSON_TITLE = "Lifestyle & Weekly Planning";
const LESSON_THEME_COLOR = "#0ea5e9"; // Sky-500
const BACKGROUND_IMAGE = "/images/lesson24-bg.jpg"; // Você precisará fornecer esta imagem
const PRONUNCIATION_IMAGE = "/images/lifestyle-weekly-plan.jpg"; // Imagem horizontal para a seção de pronúncia

// ==============================
// DADOS DA LIÇÃO - PRONÚNCIA
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
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE I
// ==============================
const substitutionPracticeI = {
  portuguese: [
    { sentence: "Ela não conhece meu pai.", substitutions: ["professor", "colega de classe"] },
    { sentence: "Ele gosta de aprender sobre biologia.", substitutions: ["geografia", "idiomas"] },
    { sentence: "Eu lavo a louça todos os dias.", substitutions: ["Ele", "Ela"] },
    { sentence: "Ele não vai para a academia de manhã.", substitutions: ["universidade", "escritório"] },
    { sentence: "Ela sabe cozinhar muito bem.", substitutions: ["falar inglês", "espanhol"] },
  ],
  english: [
    { base: "She doesn't know my father.", withSub: "She doesn't know my {substitution}." },
    { base: "He likes to learn about biology.", withSub: "He likes to learn about {substitution}." },
    { base: "I wash the dishes every day.", withSub: "{substitution} washes the dishes every day." },
    { base: "He doesn't go to the gym in the morning.", withSub: "He doesn't go to the {substitution} in the morning." },
    { base: "She knows how to cook very well.", withSub: "She knows how to {substitution} very well." },
  ]
};

// ==============================
// DADOS DA LIÇÃO - CHANGE INTO NEGATIVE
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
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE II
// ==============================
const substitutionPracticeII = {
  portuguese: [
    { sentence: "Eu vejo sua irmã no trabalho.", substitutions: ["esposa", "namorada"] },
    { sentence: "Minha esposa quer aprender alemão este ano.", substitutions: ["Minha namorada", "Minha mãe"] },
    { sentence: "Nós gostamos de falar em italiano.", substitutions: ["espanhol", "francês"] },
    { sentence: "Meus pais preferem comer peixe no almoço.", substitutions: ["frango", "peixe"] },
    { sentence: "Eu não faço exercícios nos fins de semana.", substitutions: ["Ele", "Ela"] },
  ],
  english: [
    { base: "I see your sister at work.", withSub: "I see your {substitution} at work." },
    { base: "My wife wants to learn German this year.", withSub: "{substitution} wants to learn German this year." },
    { base: "We like to speak in Italian.", withSub: "We like to speak in {substitution}." },
    { base: "My parents prefer to eat fish for lunch.", withSub: "My parents prefer to eat {substitution} for lunch." },
    { base: "I don't exercise on weekends.", withSub: "{substitution} doesn't exercise on weekends." },
  ]
};

// ==============================
// DADOS DA LIÇÃO - CHANGE INTO AFFIRMATIVE
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
// DADOS DA LIÇÃO - QUESTIONS
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
// DADOS DA LIÇÃO - TUNE YOUR EARS (VÍDEO)
// ==============================
const tuneYourEarsVideo = {
  title: "A1 English Listening Practice - How to improve English in five months",
  youtubeId: "DWhiLOwb99Y",
  description: "Watch this video to practice your listening skills and learn tips for improving your English.",
  questions: [
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
        className={`${compact ? "p-1" : "p-2"} bg-${LESSON_THEME_COLOR} text-white rounded-full hover:opacity-90`}
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
// COMPONENTE AUXILIAR: RESULTADO DA RESPOSTA
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
// COMPONENTE PRINCIPAL
// ==============================
export default function Lesson24Lifestyle() {
  const router = useRouter();
  
  // Estados para controle de expansão das seções
  const [expandedSections, setExpandedSections] = useState({
    pronunciation: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    questions: true,
    tuneYourEars: true
  });

  // Estados para respostas dos exercícios
  const [negativeAnswers, setNegativeAnswers] = useState<Record<number, string>>({});
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({});
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

  const handleAnswerChange = (type: 'negative' | 'affirmative' | 'question' | 'video', id: number, value: string) => {
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
    }
    
    // Esconder resultado anterior quando o usuário editar
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: false }));
  };

  const checkAnswer = (type: 'negative' | 'affirmative' | 'question' | 'video', id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    
    const isCorrect = normalizedUser === normalizedCorrect;
    
    setAnswerCorrectness(prev => ({ ...prev, [`${type}-${id}`]: isCorrect }));
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: true }));
    
    return isCorrect;
  };

  const clearAnswer = (type: 'negative' | 'affirmative' | 'question' | 'video', id: number) => {
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
    }
    
    setShowResults(prev => ({ ...prev, [`${type}-${id}`]: false }));
  };

  // Função para salvar todas as respostas (simulação)
  const saveAllAnswers = () => {
    const allData = {
      negativeAnswers,
      affirmativeAnswers,
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

  // Função para compartilhar no WhatsApp (simulação)
  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  // ==============================
  // RENDERIZAÇÃO
  // ==============================
  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-3xl p-10 shadow-2xl">
        
        {/* CABEÇALHO DA LIÇÃO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER} – {LESSON_TITLE}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Master pronunciation, practice sentence construction, and improve your listening skills for talking about lifestyle and weekly planning.
          </p>
          
          <div className="flex justify-center gap-4 mt-8">
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

        {/* SEÇÃO 1: IMPROVE YOUR PRONUNCIATION */}
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
              {/* IMAGEM HORIZONTAL GRANDE */}
              <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative w-full h-64 md:h-80">
                  <Image
                    src={PRONUNCIATION_IMAGE}
                    alt="Lifestyle and Weekly Planning"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-6">
                    <h3 className="text-white text-2xl font-bold">Daily Routines & Weekly Plans</h3>
                  </div>
                </div>
              </div>
              
              {/* ITENS DE PRONÚNCIA */}
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
            </div>
          )}
        </div>

        {/* SEÇÃO 2: SUBSTITUTION PRACTICE I */}
        <div className="mb-16 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
            <button 
              onClick={() => toggleSection('substitution1')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.substitution1 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LADO ESQUERDO: PORTUGUÊS */}
                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">Português (Instruções)</h3>
                  <div className="space-y-5">
                    {substitutionPracticeI.portuguese.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-purple-200">
                        <p className="text-purple-800 font-medium mb-2">{item.sentence}</p>
                        <div className="flex gap-2 mt-3">
                          {item.substitutions.map((sub, subIdx) => (
                            <span key={subIdx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* LADO DIREITO: INGLÊS */}
                <div>
                  <h3 className="text-xl font-bold text-purple-700 mb-4">English Practice</h3>
                  <div className="space-y-5">
                    {substitutionPracticeI.english.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-purple-200">
                        <p className="text-gray-700 mb-2">{item.base}</p>
                        <p className="text-purple-600 font-medium">
                          {item.withSub.replace("{substitution}", 
                            substitutionPracticeI.portuguese[idx].substitutions[0])}
                        </p>
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Try with:</span> {
                            substitutionPracticeI.portuguese[idx].substitutions.join(" or ")
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 3: CHANGE INTO NEGATIVE */}
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

        {/* SEÇÃO 4: SUBSTITUTION PRACTICE II */}
        <div className="mb-16 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
            <button 
              onClick={() => toggleSection('substitution2')}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {expandedSections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.substitution2 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* LADO ESQUERDO: PORTUGUÊS */}
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">Português (Instruções)</h3>
                  <div className="space-y-5">
                    {substitutionPracticeII.portuguese.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-green-200">
                        <p className="text-green-800 font-medium mb-2">{item.sentence}</p>
                        <div className="flex gap-2 mt-3">
                          {item.substitutions.map((sub, subIdx) => (
                            <span key={subIdx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* LADO DIREITO: INGLÊS */}
                <div>
                  <h3 className="text-xl font-bold text-green-700 mb-4">English Practice</h3>
                  <div className="space-y-5">
                    {substitutionPracticeII.english.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-xl border border-green-200">
                        <p className="text-gray-700 mb-2">{item.base}</p>
                        <p className="text-green-600 font-medium">
                          {item.withSub.replace("{substitution}", 
                            substitutionPracticeII.portuguese[idx].substitutions[0])}
                        </p>
                        <div className="mt-3 text-sm text-gray-500">
                          <span className="font-medium">Try with:</span> {
                            substitutionPracticeII.portuguese[idx].substitutions.join(" or ")
                          }
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 5: CHANGE INTO AFFIRMATIVE */}
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

        {/* SEÇÃO 6: CONVERSATION QUESTIONS */}
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

        {/* SEÇÃO 7: TUNE YOUR EARS (VÍDEO) */}
        <div className="mb-16 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 TUNE YOUR EARS</h2>
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

        {/* RODAPÉ E NAVEGAÇÃO */}
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
        
        {/* CRÉDITOS */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} • Interactive English Practice • All answers are saved in your browser</p>
        </div>
      </div>
    </div>
  );
}