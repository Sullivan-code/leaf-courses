"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, SkipBack, SkipForward } from "lucide-react";

// ==========================================
// LESSON 46 DATA (Express Yourself - Eating Out)
// ==========================================

// Dialogue Data
const dialogueData = {
  title: "At the Italian Restaurant",
  parts: [
    { speaker: "Sheila", text: "This is a good restaurant. Do you have lunch in this Italian restaurant every day?" },
    { speaker: "Daniel", text: "I eat here every other day." },
    { speaker: "Sheila", text: "I think I want to order something to eat." },
    { speaker: "Daniel", text: "Sure, go for it!" },
    { speaker: "Waiter", text: "Are you ready to order?" },
    { speaker: "Sheila", text: "Yes, I am. I'll have salad and a slice of margherita pizza." },
    { speaker: "Waiter", text: "Anything to drink?" },
    { speaker: "Sheila", text: "A bottle of water, please." },
    { speaker: "Waiter", text: "What about you, sir?" },
    { speaker: "Daniel", text: "I'll have the chicken pasta and a glass of orange juice, please." },
    { speaker: null, text: "⏱️ Some minutes later...", isTimeDivider: true },
    { speaker: "Waiter", text: "How is everything?" },
    { speaker: "Daniel", text: "The food here is delicious!" },
    { speaker: "Waiter", text: "What about you, ma'am? How is the pizza?" },
    { speaker: "Sheila", text: "Oh, very delicious." },
    { speaker: "Waiter", text: "Good! Any dessert now? We have some delicious ice cream, apple pie, and chocolate cake." },
    { speaker: "Sheila", text: "I don't want anything for dessert, thanks!" },
    { speaker: "Daniel", text: "I'll have a piece of chocolate cake, please." },
    { speaker: "Waiter", text: "Sure! Just a moment." }
  ]
};

// Substitution Practice I (Portuguese to English)
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu quero comprar algumas garrafas de refrigerante.",
    options: ["latas", "copos"],
    correctForms: ["I want to buy some cans of soda.", "I want to buy some glasses of soda."],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Eles querem alguma coisa?",
    options: ["Ela", "Você"],
    correctForms: ["Does she want anything?", "Do you want anything?"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Eu não quero nada hoje, obrigada.",
    options: ["esta tarde", "esta semana"],
    correctForms: ["I don't want anything this afternoon, thanks.", "I don't want anything this week, thanks."],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Abra a lata para mim, por favor.",
    options: ["a garrafa", "a mochila"],
    correctForms: ["Open the bottle for me, please.", "Open the backpack for me, please."],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Você fecha seu escritório à noite?",
    options: ["seu restaurante", "sua casa"],
    correctForms: ["Do you close your restaurant at night?", "Do you close your house at night?"],
    currentIndex: 0
  }
];

// Negative Exercises
const negativeExercises = [
  { key: "neg-1", sentence: "The snack bar opens at five o'clock.", answer: "The snack bar doesn't open at five o'clock." },
  { key: "neg-2", sentence: "I need more straws.", answer: "I don't need more straws." },
  { key: "neg-3", sentence: "They go out together on Fridays.", answer: "They don't go out together on Fridays." },
  { key: "neg-4", sentence: "We want to go to the ice cream parlor.", answer: "We don't want to go to the ice cream parlor." },
  { key: "neg-5", sentence: "I want to have some dessert.", answer: "I don't want to have any dessert." },
  { key: "neg-6", sentence: "He is hungry, he wants a snack.", answer: "He isn't hungry, he doesn't want a snack." }
];

// Substitution Practice II (Portuguese to English)
const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "A loja abre de manhã.",
    options: ["O museu", "O parque"],
    correctForms: ["The museum opens in the morning.", "The park opens in the morning."],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Você tem que estudar alguma coisa esta manhã?",
    options: ["esta tarde", "esta noite"],
    correctForms: ["Do you have to study anything this afternoon?", "Do you have to study anything tonight?"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Nós adoramos aquela sorveteria.",
    options: ["lanchonete", "cafeteria"],
    correctForms: ["We love that snack bar.", "We love that cafeteria."],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "O sorvete está delicioso.",
    options: ["A sobremesa", "Este prato"],
    correctForms: ["The dessert is delicious.", "This dish is delicious."],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "A lanchonete fecha às 11:00 da noite.",
    options: ["às 11:30", ["à meia-noite"]],
    correctForms: ["The snack bar closes at 11:30 PM.", "The snack bar closes at midnight."],
    currentIndex: 0
  }
];

// Affirmative Exercises
const affirmativeExercises = [
  { key: "aff-1", sentence: "She doesn't like to have hot soup.", answer: "She likes to have hot soup." },
  { key: "aff-2", sentence: "They don't clean the kitchen after lunch.", answer: "They clean the kitchen after lunch." },
  { key: "aff-3", sentence: "We don't need anything to open the can.", answer: "We need something to open the can." },
  { key: "aff-4", sentence: "She doesn't want to eat anything different.", answer: "She wants to eat something different." },
  { key: "aff-5", sentence: "I don't want to order anything now.", answer: "I want to order something now." },
  { key: "aff-6", sentence: "We don't need any napkins.", answer: "We need some napkins." }
];

// Interrogative Exercises
const interrogativeExercises = [
  { key: "int-1", sentence: "She wants to have ice cream.", answer: "Does she want to have ice cream?" },
  { key: "int-2", sentence: "You work every other day.", answer: "Do you work every other day?" },
  { key: "int-3", sentence: "They want to have a snack with their friends.", answer: "Do they want to have a snack with their friends?" },
  { key: "int-4", sentence: "He wants to order his favorite dish.", answer: "Does he want to order his favorite dish?" },
  { key: "int-5", sentence: "She goes out with her friends on weekends.", answer: "Does she go out with her friends on weekends?" },
  { key: "int-6", sentence: "They need a fork and a knife.", answer: "Do they need a fork and a knife?" }
];

// Pronunciation Words
const pronunciationWords = [
  { word: "water", phonetic: "/ˈwɔː.tər/", example: "I want a glass of water, please." },
  { word: "butter", phonetic: "/ˈbʌt.ər/", example: "I eat bread and butter for breakfast." },
  { word: "pretty", phonetic: "/ˈprɪt.i/", example: "Sue is a pretty girl." },
  { word: "city", phonetic: "/ˈsɪt.i/", example: "We live in a big city." },
  { word: "waiter", phonetic: "/ˈweɪ.tər/", example: "My brother is a waiter." },
  { word: "computer", phonetic: "/kəmˈpjuː.tər/", example: "I need to buy a new computer." }
];

// Connected Speech Examples
const connectedSpeech = [
  { phrase: "what is", example: "What is your favorite dish?" },
  { phrase: "but I", example: "I'm tired, but I need to work." },
  { phrase: "that is", example: "That is my house." }
];

// TUNE IN YOUR EARS - Video Data
const tuneInYourEarsVideo = {
  youtubeId: "fJaf6LHSGYQ",
  title: "How to Improve Your English Speaking Skills",
  description: "Watch this video to learn powerful tips about improving your English pronunciation and fluency. Pay attention to the secret tips!",
  keyVocabulary: [
    { english: "London", portuguese: "Londres" },
    { english: "To Move", portuguese: "Mudar-se" },
    { english: "To listen to", portuguese: "ouvir" },
    { english: "Slowly", portuguese: "lentamente" },
    { english: "Fluently", portuguese: "fluentemente" },
    { english: "The main question", portuguese: "A pergunta principal" },
    { english: "A lot of time", portuguese: "muito tempo" },
    { english: "The most important step", portuguese: "O passo mais importante" },
    { english: "I listen to English everyday", portuguese: "Eu escuto Inglês todo dia" },
    { english: "Mouth", portuguese: "boca" },
    { english: "Speak out loud", portuguese: "Fale em voz alta" },
    { english: "To the market", portuguese: "Para o mercado" },
    { english: "drinking", portuguese: "bebendo" },
    { english: "To train your tongue", portuguese: "treinar sua língua" },
    { english: "Sky", portuguese: "céu" },
    { english: "I like reading", portuguese: "Eu gosto de ler" },
    { english: "Faster", portuguese: "mais rápido" },
    { english: "clearer", portuguese: "mais claro/transparente" },
    { english: "secret", portuguese: "segredo" }
  ],
  questions: [
    {
      id: 1,
      question: "According to the video, what is the most important step to speak English fluently?",
      instructions: "Assista ao vídeo e responda em INGLÊS: Qual é o passo mais importante para falar inglês fluentemente, de acordo com o vídeo?",
      correctAnswer: "The most important step is to train your tongue / to speak out loud."
    },
    {
      id: 2,
      question: "What does the speaker suggest you should do every day to improve your English?",
      instructions: "O que o apresentador sugere que você faça todos os dias para melhorar seu inglês? Responda em INGLÊS.",
      correctAnswer: "Listen to English every day."
    },
    {
      id: 3,
      question: "What is the 'secret' mentioned in the video to speak faster and clearer?",
      instructions: "Qual é o 'segredo' mencionado no vídeo para falar mais rápido e mais claramente? Responda em INGLÊS.",
      correctAnswer: "To train your tongue / to practice speaking out loud."
    },
    {
      id: 4,
      question: "Do you listen to English every day? Why or why not? (Share your personal experience)",
      instructions: "Você escuta inglês todos os dias? Por quê? Compartilhe sua experiência pessoal. Responda em INGLÊS.",
      correctAnswer: "Open-ended question. Example: Yes, I listen to English every day because it helps my listening skills."
    },
    {
      id: 5,
      question: "What is one activity you like doing in English (reading, listening, speaking, etc.)? Explain.",
      instructions: "Qual é uma atividade que você gosta de fazer em inglês (ler, ouvir, falar, etc.)? Explique. Responda em INGLÊS.",
      correctAnswer: "Open-ended question. Example: I like reading because I learn new words."
    }
  ]
};

// Helper to normalize strings for answer checking
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '');
  return normalize(userAnswer) === normalize(correctAnswer);
};

// Full Featured Audio Player Component
const AudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);
    
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
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

  const handleReset = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleSkipBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (audio && duration) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-3 bg-white/20 rounded-full px-4 py-2">
      <button
        onClick={togglePlayPause}
        className="p-2 bg-white text-cyan-600 rounded-full hover:bg-cyan-100 transition shadow-md"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </button>
      
      <button
        onClick={handleSkipBackward}
        className="p-2 text-white hover:text-cyan-200 transition"
        aria-label="Skip backward 10 seconds"
      >
        <SkipBack size={18} />
      </button>
      
      <button
        onClick={handleSkipForward}
        className="p-2 text-white hover:text-cyan-200 transition"
        aria-label="Skip forward 10 seconds"
      >
        <SkipForward size={18} />
      </button>
      
      <button
        onClick={handleReset}
        className="p-2 text-white hover:text-cyan-200 transition"
        aria-label="Reset"
      >
        <RotateCcw size={16} />
      </button>
      
      <div className="hidden md:block text-white text-sm font-mono">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      
      <div
        ref={progressBarRef}
        className="w-32 md:w-48 h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-white transition-all duration-100"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};

// Result Display Component
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => (
  <div className={`flex items-center gap-2 p-2 rounded-md ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
    {isCorrect ? (
      <>
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct!</span>
      </>
    ) : (
      <>
        <XCircle size={16} className="text-red-600" />
        <span className="text-sm text-red-700"><span className="font-medium">Expected:</span> {correctAnswer}</span>
      </>
    )}
  </div>
);

export default function Lesson46ExpressYourself() {
  const router = useRouter();
  
  // Section expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    dialogue: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    pronunciation: true,
    connectedSpeech: true,
    tuneInYourEars: true
  });

  // Exercise states
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // Video answers state
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  const [videoResults, setVideoResults] = useState<Record<string, boolean>>({});
  
  // Load saved data from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson46Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setVideoAnswers(data.videoAnswers || {});
        setShowVideoResults(data.showVideoResults || {});
        setVideoResults(data.videoResults || {});
        if (data.expandedSections) setExpandedSections(data.expandedSections);
      } catch (error) { console.error("Error loading answers:", error); }
    }
  }, []);

  // Save all answers
  const saveAllAnswers = () => {
    const data = { 
      subs1Exercises, subs2Exercises, writtenAnswers, answerResults, showAnswerResults,
      videoAnswers, showVideoResults, videoResults,
      expandedSections, lastUpdated: new Date().toISOString(), 
      lessonName: "Lesson 46 - Express Yourself", version: "1.0" 
    };
    try {
      localStorage.setItem("lesson46Answers", JSON.stringify(data));
      alert("✅ All your answers have been saved successfully!");
    } catch (error) { alert("❌ Error saving answers."); }
  };
  
  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL answers?")) {
      setSubs1Exercises(substitutionPractice1); 
      setSubs2Exercises(substitutionPractice2); 
      setWrittenAnswers({});
      setAnswerResults({}); 
      setShowAnswerResults({});
      setVideoAnswers({});
      setShowVideoResults({});
      setVideoResults({});
      localStorage.removeItem("lesson46Answers");
      alert("All answers cleared.");
    }
  };

  // Handlers for exercises
  const handleSubs1OptionClick = (key: string, idx: number) => 
    setSubs1Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: idx } : ex));
  
  const handleSubs2OptionClick = (key: string, idx: number) => 
    setSubs2Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: idx } : ex));
  
  const handleWrittenAnswerChange = (key: string, value: string) => 
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  
  const handleCheckAnswer = (key: string, user: string, correct: string) => {
    const isCorrect = checkAnswer(user, correct);
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
  };
  
  // Video handlers
  const handleVideoAnswerChange = (questionId: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const checkVideoAnswer = (questionId: number, userAnswer: string, correctAnswer: string) => {
    let isCorrect = false;
    if (questionId === 4 || questionId === 5) {
      isCorrect = userAnswer.trim().length > 10;
    } else {
      isCorrect = checkAnswer(userAnswer, correctAnswer);
    }
    setVideoResults(prev => ({ ...prev, [`video-${questionId}`]: isCorrect }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: true }));
  };
  
  const clearVideoAnswer = (questionId: number) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: "" }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: false }));
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => 
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  
  const playPronunciationAudio = (word: string) => {
    const audio = new Audio(`/audios/${word}.mp3`);
    audio.play().catch(e => console.error("Audio error:", e));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson46-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🍝 LESSON 46 – EXPRESS YOURSELF</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Practice ordering food, talking about restaurants, and expressing your preferences in English!</p>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2">💾 Save Progress</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full">Clear All</button>
          </div>
        </div>

        {/* LISTEN TO THE CONVERSATION */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <h2 className="text-2xl font-bold">🎧 LISTEN TO THE CONVERSATION</h2>
            <AudioPlayer src="https://github.com/Sullivan-code/english-audios/raw/main/Lesson46audio.mp3" />
          </div>
          <div className="p-8">
            <div className="space-y-6">
              {dialogueData.parts.map((part, index) => {
                // Check if this is a time divider
                if (part.isTimeDivider) {
                  return (
                    <div key={index} className="flex justify-center my-4">
                      <div className="bg-green-100 border border-green-300 rounded-full px-6 py-2 shadow-sm">
                        <p className="text-green-700 text-sm font-medium flex items-center gap-2">
                          <span className="text-base">⏱️</span> {part.text.replace("⏱️ ", "")}
                        </p>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div key={index} className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg flex-shrink-0">
                        {part.speaker === "Sheila" ? "S" : part.speaker === "Daniel" ? "D" : "W"}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-700 mb-1">{part.speaker}</p>
                        <p className="text-gray-800 text-lg">{part.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION I</h2>
            <button onClick={() => toggleSection('substitution1')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.substitution1 && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6 space-y-6">
                {subs1Exercises.map(ex => {
                  const currentAnswer = ex.correctForms[ex.currentIndex];
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-gray-600 mb-2 font-medium">{ex.original}</p>
                      <div className="p-3 bg-blue-50 rounded-md mb-2">
                        <p className="text-blue-700 font-medium text-lg">{currentAnswer}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {ex.options.map((opt, idx) => (
                          <button key={idx} onClick={() => handleSubs1OptionClick(ex.key, idx)} 
                            className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO NEGATIVE */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
            <button onClick={() => toggleSection('negative')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.negative && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6 space-y-4">
                {negativeExercises.map(ex => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={writtenAnswers[ex.key] || ""} onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Write negative form..." />
                      <button onClick={() => handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)} 
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">Check</button>
                    </div>
                    {showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE II */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION II</h2>
            <button onClick={() => toggleSection('substitution2')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.substitution2 && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6 space-y-6">
                {subs2Exercises.map(ex => {
                  const currentAnswer = ex.correctForms[ex.currentIndex];
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-gray-600 mb-2 font-medium">{ex.original}</p>
                      <div className="p-3 bg-blue-50 rounded-md mb-2">
                        <p className="text-blue-700 font-medium text-lg">{currentAnswer}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        {ex.options.map((opt, idx) => (
                          <button key={idx} onClick={() => handleSubs2OptionClick(ex.key, idx)} 
                            className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {Array.isArray(opt) ? opt[0] : opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
            <button onClick={() => toggleSection('affirmative')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.affirmative && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6 space-y-4">
                {affirmativeExercises.map(ex => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={writtenAnswers[`aff-${ex.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`aff-${ex.key}`, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Write affirmative form..." />
                      <button onClick={() => handleCheckAnswer(`aff-${ex.key}`, writtenAnswers[`aff-${ex.key}`] || "", ex.answer)} 
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">Check</button>
                    </div>
                    {showAnswerResults[`aff-${ex.key}`] && <AnswerResult isCorrect={answerResults[`aff-${ex.key}`]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
            <button onClick={() => toggleSection('interrogative')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.interrogative && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6 space-y-4">
                {interrogativeExercises.map(ex => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input type="text" value={writtenAnswers[`int-${ex.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`int-${ex.key}`, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500" placeholder="Write interrogative form..." />
                      <button onClick={() => handleCheckAnswer(`int-${ex.key}`, writtenAnswers[`int-${ex.key}`] || "", ex.answer)} 
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">Check</button>
                    </div>
                    {showAnswerResults[`int-${ex.key}`] && <AnswerResult isCorrect={answerResults[`int-${ex.key}`]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* IMPROVE YOUR PRONUNCIATION */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎤 IMPROVE YOUR PRONUNCIATION</h2>
            <button onClick={() => toggleSection('pronunciation')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.pronunciation ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.pronunciation && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {pronunciationWords.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <button onClick={() => playPronunciationAudio(item.word)} className="text-blue-600 font-bold text-xl hover:text-blue-800 flex items-center gap-2">
                            <Volume2 size={18} /> {item.word}
                          </button>
                          <p className="text-sm text-gray-500">{item.phonetic}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2 italic">"{item.example}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CONNECTED SPEECH */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🗣️ CONNECTED SPEECH</h2>
            <button onClick={() => toggleSection('connectedSpeech')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.connectedSpeech ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.connectedSpeech && (
            <div className="p-8">
              <div className="bg-blue-100 rounded-xl p-6">
                <p className="text-gray-700 mb-4">In natural English, words connect together. Practice these common phrases:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {connectedSpeech.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg text-center shadow-sm">
                      <p className="text-blue-600 font-bold text-lg">{item.phrase}</p>
                      <p className="text-gray-600 text-sm mt-2">"{item.example}"</p>
                      <button onClick={() => playPronunciationAudio(item.phrase.replace(/\s/g, '_'))} className="mt-2 text-blue-500 hover:text-blue-700">
                        <Volume2 size={16} className="inline mr-1" /> Listen
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS (VIDEO SECTION) */}
        <div className="mb-10 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 rounded-3xl shadow-lg overflow-hidden" style={{ borderColor: "#06b6d4" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">🎧 TUNE IN YOUR EARS</h2>
            <button onClick={() => toggleSection('tuneInYourEars')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.tuneInYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.tuneInYourEars && (
            <div className="p-8">
              {/* Key Vocabulary Section */}
              <div className="mb-8 bg-white rounded-xl p-6 shadow-md border border-cyan-200">
                <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 📚 KEY VOCABULARY FROM THE VIDEO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tuneInYourEarsVideo.keyVocabulary.map((vocab, idx) => (
                    <div key={idx} className="bg-cyan-50 p-2 rounded-lg border border-cyan-200">
                      <p className="font-bold text-cyan-800 text-sm">{vocab.english}</p>
                      <p className="text-xs text-cyan-600">{vocab.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Player */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">{tuneInYourEarsVideo.title}</h3>
                <p className="text-cyan-600 mb-6">{tuneInYourEarsVideo.description}</p>
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneInYourEarsVideo.youtubeId}`}
                      title={tuneInYourEarsVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Questions from the video */}
              <div className="space-y-8">
                {tuneInYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md" style={{ borderColor: "#06b6d430" }}>
                    <h4 className="text-lg font-bold mb-2" style={{ color: "#06b6d4" }}>
                      Question {q.id}: {q.question}
                    </h4>
                    <p className="text-sm text-gray-500 mb-3 italic">📝 {q.instructions}</p>
                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer based on what you heard..."
                      className="w-full h-32 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none transition resize-none"
                      style={{ borderColor: "#06b6d430" }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "#06b6d4";
                        e.currentTarget.style.boxShadow = "0 0 0 2px #06b6d420";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "#06b6d430";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="text-white px-6 py-2 rounded-lg transition font-medium hover:opacity-90"
                        style={{ backgroundColor: "#06b6d4" }}
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
                    {showVideoResults[`video-${q.id}`] && (
                      <div className="mt-4">
                        <AnswerResult isCorrect={videoResults[`video-${q.id}`] || false} correctAnswer={q.correctAnswer} />
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
                  <li>Don&apos;t worry if you don&apos;t understand every word</li>
                  <li>You can watch multiple times if needed</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson45")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              ← Previous Lesson
            </button>
            <button onClick={() => router.push("/cursos/lesson47")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson →
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson 46: Express Yourself • Ordering Food & Restaurant Conversations • Interactive English Practice</p>
          <p className="text-xs mt-1">🍕 "The food here is delicious!" - Practice real-life restaurant conversations!</p>
        </div>
      </div>
    </div>
  );
}