"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";

// ============================================
// TEXT-TO-SPEECH FUNCTION - FEMININE VOICE
// ============================================

const speakWithFemaleVoice = (text: string, rate: number = 0.9, pitch: number = 1.1) => {
  if (!window.speechSynthesis) {
    console.warn("Browser doesn't support speech synthesis");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;

  // Try to find a female voice
  const voices = window.speechSynthesis.getVoices();
  
  // List of female voice names (common across browsers)
  const femaleVoicePatterns = [
    'Samantha',    // MacOS
    'Google UK English Female', // Chrome
    'Microsoft Zira', // Windows
    'Microsoft Hazel', // Windows
    'Victoria',    // Some systems
    'Karen',       // Some systems
    'Female',      // Generic
    'Amy',         // Some systems
    'Siri',        // Some systems
    'Allison'      // Some systems
  ];

  let selectedVoice = voices.find(voice => 
    femaleVoicePatterns.some(pattern => 
      voice.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  // If no female voice found, try to find any English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => 
      voice.lang.includes('en') && voice.lang.includes('US')
    );
  }

  // If still no voice found, use the first available
  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices[0];
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
    console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
  }

  utterance.onerror = (event) => {
    console.error('Speech error:', event);
  };

  window.speechSynthesis.speak(utterance);
};

// ============================================
// SPEAKABLE TEXT COMPONENT
// ============================================

interface SpeakableTextProps {
  text: string;
  className?: string;
  children?: React.ReactNode;
}

const SpeakableText = ({ text, className = "", children }: SpeakableTextProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (text?.trim()) {
      speakWithFemaleVoice(text);
    }
  };

  return (
    <span 
      onClick={handleClick}
      className={`cursor-pointer hover:text-blue-600 transition-colors duration-200 ${className}`}
      title={`Click to listen: ${text}`}
    >
      {children || text}
    </span>
  );
};

// ============================================
// LISTEN AND NUMBER - Items com imagens
// ============================================
const listenItemsOriginal = [
  { 
    key: "image-a", 
    label: "",
    image: "/images/hamburgers.jpg",
    placeholder: "🍔🍔",
    description: "Dois hambúrgueres grandes",
    correctNumber: 3
  },
  { 
    key: "image-b", 
    label: "",
    image: "/images/friends-pizza.jpg",
    placeholder: "👥🍕",
    description: "Amigos comendo pizza",
    correctNumber: 6
  },
  { 
    key: "image-c", 
    label: "",
    image: "/images/restaurant-talk.jpg",
    placeholder: "🗣️🍷",
    description: "",
    correctNumber: 4
  },
  { 
    key: "image-d", 
    label: "",
    image: "/images/pasta.jpg",
    placeholder: "🍝",
    description: "Prato de macarrão",
    correctNumber: 2
  },
  { 
    key: "image-e", 
    label: "",
    image: "/images/salad.jpg",
    placeholder: "🥗👩",
    description: "Mulher comendo salada",
    correctNumber: 1
  },
  { 
    key: "image-f", 
    label: "",
    image: "/images/chef.jpg",
    placeholder: "👨‍🍳",
    description: "Chef preparando comida",
    correctNumber: 5
  },
];

// Embaralhar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// SUBSTITUTION PRACTICE I
// ============================================
const substitutionPractice1 = [
  {
    id: 1,
    portuguese: "Ele precisa ligar para o chefe dele agora.",
    english: "He needs to call his boss now.",
    substitutions: [
      { word: "mãe", english: "mother", phrase: "He needs to call his mother now." },
      { word: "amigo", english: "friend", phrase: "He needs to call his friend now." }
    ]
  },
  {
    id: 2,
    portuguese: "Ela frequentemente sai com os amigos dela.",
    english: "She often goes out with her friends.",
    substitutions: [
      { word: "Ele", english: "He", phrase: "He often goes out with his friends." },
      { word: "Nós", english: "We", phrase: "We often go out with our friends." }
    ]
  },
  {
    id: 3,
    portuguese: "Nós sempre temos que esperar por você.",
    english: "We always have to wait for you.",
    substitutions: [
      { word: "Eu", english: "I", phrase: "I always have to wait for you." },
      { word: "Elas", english: "They", phrase: "They always have to wait for you." }
    ]
  },
  {
    id: 4,
    portuguese: "Este é o melhor chefe de cozinha da cidade.",
    english: "This is the best chef in the city.",
    substitutions: [
      { word: "bar", english: "bar", phrase: "This is the best bar in the city." },
      { word: "pizzaria", english: "pizzeria", phrase: "This is the best pizzeria in the city." }
    ]
  },
  {
    id: 5,
    portuguese: "Com que frequência você vai ao cinema?",
    english: "How often do you go to the cinema?",
    substitutions: [
      { word: "ao dentista", english: "to the dentist", phrase: "How often do you go to the dentist?" },
      { word: "ao banco", english: "to the bank", phrase: "How often do you go to the bank?" }
    ]
  }
];

// ============================================
// NEGATIVE EXERCISES
// ============================================
const negativeExercisesData = [
  { id: 1, sentence: "Wait for me!", answer: "Don't wait for me!" },
  { id: 2, sentence: "I want to have a barbecue on Sunday.", answer: "I don't want to have a barbecue on Sunday." },
  { id: 3, sentence: "He is a vegetarian.", answer: "He isn't a vegetarian." },
  { id: 4, sentence: "Our favorite dish is pasta.", answer: "Our favorite dish isn't pasta." },
  { id: 5, sentence: "Open the can of soda now.", answer: "Don't open the can of soda now." },
  { id: 6, sentence: "We need to call the doctor now.", answer: "We don't need to call the doctor now." }
];

// ============================================
// SUBSTITUTION PRACTICE II
// ============================================
const substitutionPractice2 = [
  {
    id: 1,
    portuguese: "Você é vegetariano?",
    english: "Are you a vegetarian?",
    substitutions: [
      { word: "vegano", english: "vegan", phrase: "Are you a vegan?" },
      { word: "Ele", english: "Is he", phrase: "Is he a vegetarian?" }
    ]
  },
  {
    id: 2,
    portuguese: "Apressem-se, nós estamos atrasados.",
    english: "Hurry up, we're late.",
    substitutions: [
      { word: "Ela", english: "She", phrase: "Hurry up, she's late." },
      { word: "Eu", english: "I", phrase: "Hurry up, I'm late." }
    ]
  },
  {
    id: 3,
    portuguese: "Com que frequência você estuda inglês?",
    english: "How often do you study English?",
    substitutions: [
      { word: "vai ao dentista", english: "go to the dentist", phrase: "How often do you go to the dentist?" },
      { word: "come comida rápida", english: "eat fast food", phrase: "How often do you eat fast food?" }
    ]
  },
  {
    id: 4,
    portuguese: "Eu estudo inglês duas vezes por semana.",
    english: "I study English twice a week.",
    substitutions: [
      { word: "três vezes", english: "three times", phrase: "I study English three times a week." },
      { word: "uma vez", english: "once", phrase: "I study English once a week." }
    ]
  },
  {
    id: 5,
    portuguese: "Este sofá é muito confortável.",
    english: "This sofa is very comfortable.",
    substitutions: [
      { word: "Esta sala de estar", english: "This living room", phrase: "This living room is very comfortable." },
      { word: "Este lugar", english: "This place", phrase: "This place is very comfortable." }
    ]
  }
];

// ============================================
// AFFIRMATIVE EXERCISES
// ============================================
const affirmativeExercisesData = [
  { id: 1, sentence: "I don't know anybody here.", answer: "I know somebody here." },
  { id: 2, sentence: "She isn't a vegetarian.", answer: "She is a vegetarian." },
  { id: 3, sentence: "He doesn't want to call anybody.", answer: "He wants to call somebody." },
  { id: 4, sentence: "They aren't in a hurry.", answer: "They are in a hurry." },
  { id: 5, sentence: "He is never on time.", answer: "He is always on time." },
  { id: 6, sentence: "She doesn't need a painkiller.", answer: "She needs a painkiller." }
];

// ============================================
// INTERROGATIVE EXERCISES
// ============================================
const interrogativeExercisesData = [
  { id: 1, sentence: "You want to visit somebody tomorrow.", answer: "Do you want to visit somebody tomorrow?" },
  { id: 2, sentence: "You need to meet somebody at the station.", answer: "Do you need to meet somebody at the station?" },
  { id: 3, sentence: "He needs to call somebody before the meeting.", answer: "Does he need to call somebody before the meeting?" },
  { id: 4, sentence: "Somebody is hungry.", answer: "Is somebody hungry?" },
  { id: 5, sentence: "Somebody is in a hurry.", answer: "Is somebody in a hurry?" },
  { id: 6, sentence: "Somebody is late.", answer: "Is somebody late?" }
];

// ============================================
// SPEAKING QUESTIONS
// ============================================
const speakingQuestions = [
  { id: "a", question: "How often do you go out with your friends?" },
  { id: "b", question: "Where do you usually go to?" },
  { id: "c", question: "What do you usually order?" },
  { id: "d", question: "How often do you cook at home? If so, what do you cook?" },
  { id: "e", question: "Do you usually eat anything before you go to work/school?" },
  { id: "f", question: "How often do you have a barbecue at home?" },
  { id: "g", question: "Do you know anybody who is a vegan or vegetarian?" },
  { id: "h", question: "Are you usually in a hurry? If so, why?" },
  { id: "i", question: "Does anybody in your family study languages, too?" },
  { id: "j", question: "Are you usually on time for your appointments?" }
];

// Helper to normalize strings for answer checking
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '');
  return normalize(userAnswer) === normalize(correctAnswer);
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

export default function Lesson48EatingOut() {
  const router = useRouter();
  
  // Section expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    listenAndNumber: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    speaking: true,
    turningYourEars: true
  });

  // Listen and Number state
  const [listenItems, setListenItems] = useState(() => shuffleArray(listenItemsOriginal));
  const [userNumbers, setUserNumbers] = useState<Record<string, string>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  const [showListenResults, setShowListenResults] = useState<Record<string, boolean>>({});
  const [allChecked, setAllChecked] = useState(false);

  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Exercise states
  const [subs1Answers, setSubs1Answers] = useState<Record<number, number>>({});
  const [subs2Answers, setSubs2Answers] = useState<Record<number, number>>({});
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // Speaking answers state
  const [speakingAnswers, setSpeakingAnswers] = useState<Record<string, string>>({});

  // Load saved data from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson48Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        if (data.userNumbers) setUserNumbers(data.userNumbers);
        if (data.listenResults) setListenResults(data.listenResults);
        if (data.subs1Answers) setSubs1Answers(data.subs1Answers);
        if (data.subs2Answers) setSubs2Answers(data.subs2Answers);
        if (data.writtenAnswers) setWrittenAnswers(data.writtenAnswers);
        if (data.answerResults) setAnswerResults(data.answerResults);
        if (data.speakingAnswers) setSpeakingAnswers(data.speakingAnswers);
        if (data.expandedSections) setExpandedSections(data.expandedSections);
        console.log("Data loaded for Lesson 48");
      } catch (error) { console.error("Error loading answers:", error); }
    }
  }, []);

  // Save all answers
  const saveAllAnswers = () => {
    const data = { 
      userNumbers, listenResults, subs1Answers, subs2Answers, writtenAnswers, answerResults, speakingAnswers,
      expandedSections, lastUpdated: new Date().toISOString(), 
      lessonName: "Lesson 48 - Eating Out", version: "1.0" 
    };
    try {
      localStorage.setItem("lesson48Answers", JSON.stringify(data));
      alert("✅ All your answers have been saved successfully!");
    } catch (error) { alert("❌ Error saving answers."); }
  };
  
  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL answers?")) {
      setUserNumbers({});
      setListenResults({});
      setShowListenResults({});
      setSubs1Answers({});
      setSubs2Answers({});
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setSpeakingAnswers({});
      localStorage.removeItem("lesson48Answers");
      alert("All answers cleared.");
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => 
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));

  // Audio player functions
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setAudioProgress(0);
      if (!isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress);
    }
  };

  const handleAudioLoadedMetadata = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  // Listen and Number handlers
  const handleNumberChange = (key: string, value: string) => {
    setUserNumbers(prev => ({ ...prev, [key]: value }));
    setShowListenResults(prev => ({ ...prev, [key]: false }));
  };

  const checkListenAnswer = (key: string, userNumber: string, correctNumber: number) => {
    const isCorrect = parseInt(userNumber) === correctNumber;
    setListenResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowListenResults(prev => ({ ...prev, [key]: true }));
  };

  const checkAllListenAnswers = () => {
    const newResults: Record<string, boolean> = {};
    listenItems.forEach(item => {
      const userNumber = userNumbers[item.key];
      newResults[item.key] = parseInt(userNumber) === item.correctNumber;
    });
    setListenResults(newResults);
    const allShown: Record<string, boolean> = {};
    listenItems.forEach(item => { allShown[item.key] = true; });
    setShowListenResults(allShown);
    setAllChecked(true);
  };

  // Substitution Practice I handler
  const handleSubs1Select = (id: number, substitutionIndex: number) => {
    setSubs1Answers(prev => ({ ...prev, [id]: substitutionIndex }));
  };

  const getSubs1CurrentPhrase = (exercise: typeof substitutionPractice1[0]) => {
    const selectedIndex = subs1Answers[exercise.id] ?? 0;
    if (selectedIndex === 0) return exercise.english;
    return exercise.substitutions[selectedIndex - 1]?.phrase || exercise.english;
  };

  // Substitution Practice II handler
  const handleSubs2Select = (id: number, substitutionIndex: number) => {
    setSubs2Answers(prev => ({ ...prev, [id]: substitutionIndex }));
  };

  const getSubs2CurrentPhrase = (exercise: typeof substitutionPractice2[0]) => {
    const selectedIndex = subs2Answers[exercise.id] ?? 0;
    if (selectedIndex === 0) return exercise.english;
    return exercise.substitutions[selectedIndex - 1]?.phrase || exercise.english;
  };

  // Written exercises handlers
  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (key: string, user: string, correct: string) => {
    const isCorrect = checkAnswer(user, correct);
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
  };

  // Speaking handlers
  const handleSpeakingAnswerChange = (id: string, value: string) => {
    setSpeakingAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson48-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🍽️ LESSON 48 – EATING OUT</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Practice restaurant conversations, food vocabulary, and grammar structures!</p>
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2">💾 Save Progress</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full">Clear All</button>
          </div>
        </div>

        {/* ============================================ */}
        {/* LISTEN AND NUMBER SECTION */}
        {/* ============================================ */}
        <div className="bg-blue-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
            <button onClick={() => toggleSection('listenAndNumber')} className="p-2 rounded-full hover:bg-blue-700">
              {expandedSections.listenAndNumber ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.listenAndNumber && (
            <div className="p-8">
              <p className="text-gray-600 mb-6 text-center">🎵 Clique no player abaixo para ouvir o áudio. Depois, numere as imagens de acordo com a ordem em que você ouviu.</p>
              
              {/* Audio Player */}
              <div className="bg-blue-100 rounded-xl p-6 mb-8 shadow-md">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={toggleAudio}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                  <button 
                    onClick={restartAudio}
                    className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw size={24} />
                  </button>
                  <div className="flex-1">
                    <div className="w-full bg-gray-300 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${audioProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>{Math.floor((audioProgress / 100) * audioDuration)}s</span>
                      <span>{Math.floor(audioDuration)}s</span>
                    </div>
                  </div>
                  <Volume2 size={20} className="text-blue-600" />
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">📻 L48 - Listen and Number</p>
              </div>

              {/* Audio element */}
              <audio
                ref={audioRef}
                src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L48listenandnumber.mp3"
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioLoadedMetadata}
                onEnded={handleAudioEnded}
                className="hidden"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {listenItems.map((item) => (
                  <div key={item.key} className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden shadow-sm">
                    <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                      <div className="text-center p-4">
                        <span className="text-6xl">{item.placeholder}</span>
                        <p className="text-sm text-gray-500 mt-2">{item.label}</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2 items-center">
                        <label className="font-medium text-gray-700">Number:</label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={userNumbers[item.key] || ""}
                          onChange={(e) => handleNumberChange(item.key, e.target.value)}
                          className="w-20 px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 text-center"
                          placeholder="1-6"
                        />
                        <button
                          onClick={() => checkListenAnswer(item.key, userNumbers[item.key] || "", item.correctNumber)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                        >
                          Check
                        </button>
                      </div>
                      {showListenResults[item.key] && (
                        <div className="mt-3">
                          <AnswerResult isCorrect={listenResults[item.key] || false} correctAnswer={item.correctNumber.toString()} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-4">
                <button
                  onClick={checkAllListenAnswers}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition"
                >
                  Check All Answers
                </button>
              </div>
              
              {allChecked && (
                <div className="mt-6 p-4 bg-green-100 rounded-xl border border-green-300 text-center">
                  <p className="text-green-700 font-medium">📋 Answer Key:</p>
                  <p className="text-gray-600">1 → Salada (e) | 2 → Macarrão (d) | 3 → Hambúrgueres (a) | 4 → Conversa no bar (c) | 5 → Chef (f) | 6 → Pizza com amigos (b)</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I */}
        {/* ============================================ */}
        <div className="bg-orange-50 border-2 border-orange-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION I</h2>
            <button onClick={() => toggleSection('substitution1')} className="p-2 rounded-full hover:bg-orange-700">
              {expandedSections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.substitution1 && (
            <div className="p-8">
              <p className="text-gray-600 mb-4">Substitua as palavras destacadas:</p>
              <div className="bg-orange-100 rounded-xl p-6 space-y-6">
                {substitutionPractice1.map(ex => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-2 font-medium">{ex.portuguese}</p>
                    <div className="p-3 bg-orange-50 rounded-md mb-2">
                      <SpeakableText text={getSubs1CurrentPhrase(ex)} className="text-orange-700 font-medium text-lg" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        onClick={() => handleSubs1Select(ex.id, 0)}
                        className={`px-3 py-1 rounded-md text-sm transition ${(subs1Answers[ex.id] ?? 0) === 0 ? 'bg-orange-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Original
                      </button>
                      {ex.substitutions.map((sub, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleSubs1Select(ex.id, idx + 1)}
                          className={`px-3 py-1 rounded-md text-sm transition ${(subs1Answers[ex.id] ?? 0) === idx + 1 ? 'bg-orange-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          {sub.word}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO NEGATIVE */}
        {/* ============================================ */}
        <div className="bg-red-50 border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
            <button onClick={() => toggleSection('negative')} className="p-2 rounded-full hover:bg-red-700">
              {expandedSections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.negative && (
            <div className="p-8">
              <p className="text-gray-600 mb-4">Transforme em frases negativas:</p>
              <div className="bg-red-100 rounded-xl p-6 space-y-4">
                {negativeExercisesData.map(ex => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={writtenAnswers[`neg-${ex.id}`] || ""} 
                        onChange={(e) => handleWrittenAnswerChange(`neg-${ex.id}`, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500" 
                        placeholder="Write negative form..." 
                      />
                      <button 
                        onClick={() => handleCheckAnswer(`neg-${ex.id}`, writtenAnswers[`neg-${ex.id}`] || "", ex.answer)} 
                        className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition"
                      >
                        Check
                      </button>
                    </div>
                    {showAnswerResults[`neg-${ex.id}`] && <AnswerResult isCorrect={answerResults[`neg-${ex.id}`]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE II */}
        {/* ============================================ */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION II</h2>
            <button onClick={() => toggleSection('substitution2')} className="p-2 rounded-full hover:bg-purple-700">
              {expandedSections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.substitution2 && (
            <div className="p-8">
              <div className="bg-purple-100 rounded-xl p-6 space-y-6">
                {substitutionPractice2.map(ex => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-2 font-medium">{ex.portuguese}</p>
                    <div className="p-3 bg-purple-50 rounded-md mb-2">
                      <SpeakableText text={getSubs2CurrentPhrase(ex)} className="text-purple-700 font-medium text-lg" />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <button 
                        onClick={() => handleSubs2Select(ex.id, 0)}
                        className={`px-3 py-1 rounded-md text-sm transition ${(subs2Answers[ex.id] ?? 0) === 0 ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                      >
                        Original
                      </button>
                      {ex.substitutions.map((sub, idx) => (
                        <button 
                          key={idx}
                          onClick={() => handleSubs2Select(ex.id, idx + 1)}
                          className={`px-3 py-1 rounded-md text-sm transition ${(subs2Answers[ex.id] ?? 0) === idx + 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                          {sub.word}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO AFFIRMATIVE */}
        {/* ============================================ */}
        <div className="bg-green-50 border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
            <button onClick={() => toggleSection('affirmative')} className="p-2 rounded-full hover:bg-green-700">
              {expandedSections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.affirmative && (
            <div className="p-8">
              <div className="bg-green-100 rounded-xl p-6 space-y-4">
                {affirmativeExercisesData.map(ex => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={writtenAnswers[`aff-${ex.id}`] || ""} 
                        onChange={(e) => handleWrittenAnswerChange(`aff-${ex.id}`, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500" 
                        placeholder="Write affirmative form..." 
                      />
                      <button 
                        onClick={() => handleCheckAnswer(`aff-${ex.id}`, writtenAnswers[`aff-${ex.id}`] || "", ex.answer)} 
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition"
                      >
                        Check
                      </button>
                    </div>
                    {showAnswerResults[`aff-${ex.id}`] && <AnswerResult isCorrect={answerResults[`aff-${ex.id}`]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO INTERROGATIVE */}
        {/* ============================================ */}
        <div className="bg-cyan-50 border-2 border-cyan-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-cyan-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
            <button onClick={() => toggleSection('interrogative')} className="p-2 rounded-full hover:bg-cyan-700">
              {expandedSections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.interrogative && (
            <div className="p-8">
              <div className="bg-cyan-100 rounded-xl p-6 space-y-4">
                {interrogativeExercisesData.map(ex => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg">
                    <p className="mb-2 font-medium text-gray-700">{ex.sentence}</p>
                    <div className="flex gap-2 mb-2">
                      <input 
                        type="text" 
                        value={writtenAnswers[`int-${ex.id}`] || ""} 
                        onChange={(e) => handleWrittenAnswerChange(`int-${ex.id}`, e.target.value)} 
                        className="flex-1 px-3 py-2 border border-cyan-300 rounded-md focus:ring-2 focus:ring-cyan-500" 
                        placeholder="Write interrogative form..." 
                      />
                      <button 
                        onClick={() => handleCheckAnswer(`int-${ex.id}`, writtenAnswers[`int-${ex.id}`] || "", ex.answer)} 
                        className="bg-cyan-600 text-white px-3 py-2 rounded-md hover:bg-cyan-700 transition"
                      >
                        Check
                      </button>
                    </div>
                    {showAnswerResults[`int-${ex.id}`] && <AnswerResult isCorrect={answerResults[`int-${ex.id}`]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* QUESTIONS (Speaking Practice) */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">💬 QUESTIONS - Speaking Practice</h2>
            <button onClick={() => toggleSection('speaking')} className="p-2 rounded-full hover:bg-teal-700">
              {expandedSections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.speaking && (
            <div className="p-8">
              <p className="text-gray-600 mb-6">Responda com frases completas. Clique nas perguntas para ouvir a pronúncia:</p>
              <div className="space-y-4">
                {speakingQuestions.map(q => (
                  <div key={q.id} className="bg-white p-4 rounded-lg border border-teal-200">
                    <SpeakableText text={q.question} className="font-bold text-teal-700 mb-2 block" />
                    <textarea
                      value={speakingAnswers[q.id] || ""}
                      onChange={(e) => handleSpeakingAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"
                      rows={2}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-teal-100 rounded-lg">
                <p className="text-sm text-teal-700">💡 <strong>Suggested sentence starters:</strong> I usually..., I sometimes..., I never..., My favorite dish is..., I often..., Once a week..., Twice a month...</p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TURNING YOUR EARS (Listening & Speaking Extension) */}
        {/* ============================================ */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-amber-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
            <button onClick={() => toggleSection('turningYourEars')} className="p-2 rounded-full hover:bg-amber-700">
              {expandedSections.turningYourEars ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {expandedSections.turningYourEars && (
            <div className="p-8">
              <div className="bg-amber-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-amber-800 mb-4">Extension Activities</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-bold text-amber-700">🗣️ Give examples of:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      <li>Things you do often</li>
                      <li>Your favorite dishes</li>
                      <li>Your eating habits</li>
                      <li>Vegetarians/Vegans you know</li>
                      <li>Beverages and foods you like</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="font-bold text-amber-700">💡 Practice with:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                      <li><SpeakableText text="I usually..." className="font-medium text-amber-600" /> (Eu geralmente...)</li>
                      <li><SpeakableText text="I sometimes..." className="font-medium text-amber-600" /> (Eu às vezes...)</li>
                      <li><SpeakableText text="I never..." className="font-medium text-amber-600" /> (Eu nunca...)</li>
                      <li><SpeakableText text="My favorite dish is..." className="font-medium text-amber-600" /> (Meu prato favorito é...)</li>
                      <li><SpeakableText text="I often..." className="font-medium text-amber-600" /> (Eu frequentemente...)</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-amber-200 rounded-lg text-center">
                  <p className="text-amber-800">💬 <strong>Speaking Challenge:</strong> Record yourself answering the questions above and listen to your pronunciation!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson47")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              ← Previous Lesson
            </button>
            <button onClick={() => router.push("/cursos/lesson49")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson →
            </button>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson 48: Eating Out • Restaurant Conversations & Grammar Practice</p>
          <p className="text-xs mt-1">🍽️ <SpeakableText text="How often do you go out with your friends?" className="text-gray-500 hover:text-blue-500" /> - Practice real-life conversations!</p>
        </div>
      </div>
    </div>
  );
}