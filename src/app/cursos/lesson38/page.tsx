"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, RotateCcw, Volume2, ChevronDown, ChevronUp,
  Check, X, Download, MessageCircle, Headphones,
  Stethoscope, Pill, Hospital, Thermometer, Activity, Heart,
  User, Users, Calendar, Clock, AlertCircle, CheckCircle, Youtube
} from "lucide-react";

// ==============================
// LESSON CONFIGURATION
// ==============================
const LESSON_NUMBER = 38;
const LESSON_TITLE = "Health & Daily Situations";
const LESSON_SUBTITLE = "Listening, Drilling & Fluency Practice";
const LESSON_THEME_COLOR = "#10b981"; // Emerald-500
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1588776814546-1ffc4725f6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

// ==============================
// LISTEN AND NUMBER IMAGES (coherent with each situation)
// ==============================
const listenAndNumberImages = [
  { id: "A", description: "Couple relaxing on the sofa", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 4, situation: "People feeling well / relaxed" },
  { id: "B", description: "Woman talking to a doctor", imageUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 2, situation: "Medical appointment" },
  { id: "C", description: "Woman sneezing with a tissue", imageUrl: "https://images.unsplash.com/photo-1611867001974-cf6b2c0c0c0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 6, situation: "Cold / flu" },
  { id: "D", description: "Patient at the hospital", imageUrl: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 3, situation: "Hospital care" },
  { id: "E", description: "Woman taking a pill", imageUrl: "https://images.unsplash.com/photo-1584308666744-00d3c9c6c8c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 1, situation: "Taking medicine" },
  { id: "F", description: "Person lying with sleep mask", imageUrl: "https://images.unsplash.com/photo-1484836495779-1f3b2a9d8c2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 5, situation: "Sick / resting" }
];

// ==============================
// DRILLING PRACTICE I - SUBSTITUTION
// ==============================
const drillingPracticeI = [
  {
    id: 1,
    original: "She takes medicine for her headache.",
    portuguese: "She takes medicine for her headache.",
    substitutions: [
      { word: "She", options: ["She", "He", "I"] }
    ],
    currentText: "She takes medicine for her headache."
  },
  {
    id: 2,
    original: "I don't want painkillers, I prefer to drink tea.",
    portuguese: "I don't want painkillers, I prefer to drink tea.",
    substitutions: [
      { word: "drink tea", options: ["drink tea", "go to sleep", "take a shower"] }
    ],
    currentText: "I don't want painkillers, I prefer to drink tea."
  },
  {
    id: 3,
    original: "We prefer to go to the doctor tomorrow.",
    portuguese: "We prefer to go to the doctor tomorrow.",
    substitutions: [
      { word: "tomorrow", options: ["tomorrow", "today", "this morning"] }
    ],
    currentText: "We prefer to go to the doctor tomorrow."
  },
  {
    id: 4,
    original: "Do you feel better now?",
    portuguese: "Do you feel better now?",
    substitutions: [
      { word: "You", options: ["You", "He", "She"] }
    ],
    currentText: "Do you feel better now?"
  },
  {
    id: 5,
    original: "I am a teacher.",
    portuguese: "I am a teacher.",
    substitutions: [
      { word: "teacher", options: ["teacher", "dentist", "doctor"] }
    ],
    currentText: "I am a teacher."
  }
];

// ==============================
// NEGATIVE PRACTICE
// ==============================
const negativePractice = [
  { id: 1, english: "I take these pills in the morning.", portuguese: "I take these pills in the morning." },
  { id: 2, english: "He takes medicine for everything.", portuguese: "He takes medicine for everything." },
  { id: 3, english: "They have to go to the dentist.", portuguese: "They have to go to the dentist." },
  { id: 4, english: "You have a fever.", portuguese: "You have a fever." },
  { id: 5, english: "I have a toothache.", portuguese: "I have a toothache." },
  { id: 6, english: "She needs painkillers.", portuguese: "She needs painkillers." }
];

// ==============================
// DRILLING PRACTICE II - SUBSTITUTION
// ==============================
const drillingPracticeII = [
  {
    id: 1,
    original: "I still need to talk to the doctor.",
    portuguese: "I still need to talk to the doctor.",
    substitutions: [
      { word: "doctor", options: ["doctor", "nurse", "teacher"] }
    ],
    currentText: "I still need to talk to the doctor."
  },
  {
    id: 2,
    original: "She is a great nurse.",
    portuguese: "She is a great nurse.",
    substitutions: [
      { word: "great", options: ["great", "funny", "kind"] }
    ],
    currentText: "She is a great nurse."
  },
  {
    id: 3,
    original: "Do you have a cold?",
    portuguese: "Do you have a cold?",
    substitutions: [
      { word: "a cold", options: ["a cold", "a sore throat", "a toothache"] }
    ],
    currentText: "Do you have a cold?"
  },
  {
    id: 4,
    original: "These are my cousins.",
    portuguese: "These are my cousins.",
    substitutions: [
      { word: "cousins", options: ["cousins", "neighbors", "friends"] }
    ],
    currentText: "These are my cousins."
  },
  {
    id: 5,
    original: "They are at the beach together.",
    portuguese: "They are at the beach together.",
    substitutions: [
      { word: "at the beach", options: ["at the beach", "in the park", "at church"] }
    ],
    currentText: "They are at the beach together."
  }
];

// ==============================
// AFFIRMATIVE PRACTICE (Negative to Affirmative)
// ==============================
const affirmativePractice = [
  { id: 1, negative: "They don't like to read about health.", affirmative: "They like to read about health." },
  { id: 2, negative: "I don't think she has a fever.", affirmative: "I think she has a fever." },
  { id: 3, negative: "You don't have an appointment at the dentist.", affirmative: "You have an appointment at the dentist." },
  { id: 4, negative: "I don't take my children to the doctor.", affirmative: "I take my children to the doctor." },
  { id: 5, negative: "He doesn't need to go to the hospital.", affirmative: "He needs to go to the hospital." },
  { id: 6, negative: "I don't have to read those reports.", affirmative: "I have to read those reports." }
];

// ==============================
// INTERROGATIVE PRACTICE
// ==============================
const interrogativePractice = [
  { id: 1, statement: "My neighbor has a cold.", interrogative: "Does my neighbor have a cold?" },
  { id: 2, statement: "Your friend has to take medicine every day.", interrogative: "Does your friend have to take medicine every day?" },
  { id: 3, statement: "You think it's good for your health.", interrogative: "Do you think it's good for your health?" },
  { id: 4, statement: "She needs a painkiller for her sore throat.", interrogative: "Does she need a painkiller for her sore throat?" },
  { id: 5, statement: "You need to buy this medicine at the drugstore.", interrogative: "Do you need to buy this medicine at the drugstore?" },
  { id: 6, statement: "He needs to take these pills.", interrogative: "Does he need to take these pills?" }
];

// ==============================
// FLUENCY - DEMONSTRATIVES
// ==============================
const fluencyExercises = {
  partA: [
    { id: "a", sentence: "I want to visit that city.", portuguese: "I want to visit that city." },
    { id: "b", sentence: "They need to take this pill.", portuguese: "They need to take this pill." },
    { id: "c", sentence: "I want to read that book.", portuguese: "I want to read that book." },
    { id: "d", sentence: "She wants to buy this backpack.", portuguese: "She wants to buy this backpack." },
    { id: "e", sentence: "We don't like to talk about that subject.", portuguese: "We don't like to talk about that subject." },
    { id: "f", sentence: "Do they have a meeting to talk about this project?", portuguese: "Do they have a meeting to talk about this project?" }
  ],
  partB: [
    { id: "a", sentence: "This is my teacher.", portuguese: "This is my teacher." },
    { id: "b", sentence: "That is my classmate.", portuguese: "That is my classmate." },
    { id: "c", sentence: "This is her friend.", portuguese: "This is her friend." },
    { id: "d", sentence: "That is his cell phone.", portuguese: "That is his cell phone." },
    { id: "e", sentence: "This is my gift.", portuguese: "This is my gift." },
    { id: "f", sentence: "That is her backpack.", portuguese: "That is her backpack." }
  ]
};

// ==============================
// TUNE IN YOUR EARS - VOCAB & QUESTIONS
// ==============================
const tuneInYourEars = {
  videoUrl: "https://www.youtube.com/watch?v=0-GHVzKNCek&list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=23",
  vocabulary: [
    { word: "slowly", meaning: "lentamente" },
    { word: "everyday", meaning: "todo dia" },
    { word: "speaking", meaning: "fala" },
    { word: "to translate", meaning: "traduzir" },
    { word: "why?", meaning: "por que?" },
    { word: "fast", meaning: "rápido" },
    { word: "slower", meaning: "mais lento" },
    { word: "strange", meaning: "estranho" },
    { word: "as well", meaning: "também" },
    { word: "your own language", meaning: "sua própria língua" },
    { word: "learners", meaning: "aprendizes, alunos" },
    { word: "because", meaning: "porque (de resposta)" },
    { word: "rhythm", meaning: "ritmo" },
    { word: "I'm going ...", meaning: "eu estou indo ..." },
    { word: "immediately", meaning: "imediatamente" },
    { word: "around you", meaning: "ao seu redor" },
    { word: "to fold clothes", meaning: "arrumar roupas, dobrar roupas" }
  ],
  questions: [
    "Do you translate sentences all the time?",
    "Do you understand when people speak fast?",
    "Do you put the videos slower to understand them?",
    "How can you train your brain to understand English quickly?",
    "Do you use English when you're doing simple things?"
  ],
  advice: "Describe what you see when you're at home. Use this space here to describe things around you."
};

// ==============================
// COMPONENT: AUDIO PLAYER
// ==============================
interface AudioPlayerProps {
  text: string;
  compact?: boolean;
}

const AudioPlayerSimulated = ({ text, compact = false }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = () => {
    if (utteranceRef.current) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button
        onClick={isPlaying ? stop : speak}
        className={`${compact ? "p-1" : "p-2"} text-white rounded-full hover:opacity-90 transition-all`}
        style={{ backgroundColor: LESSON_THEME_COLOR }}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
    </div>
  );
};

// ==============================
// COMPONENT: SUBSTITUTION DRILL
// ==============================
interface SubstitutionDrillProps {
  exercise: any;
  onUpdate: (id: number, newText: string) => void;
}

const SubstitutionDrill = ({ exercise, onUpdate }: SubstitutionDrillProps) => {
  const [currentText, setCurrentText] = useState(exercise.currentText);
  const [showPortuguese, setShowPortuguese] = useState(false);

  const handleSubstitution = (oldWord: string, newWord: string) => {
    let newText = currentText;
    const regex = new RegExp(`\\b${oldWord}\\b`, 'gi');
    newText = newText.replace(regex, newWord);
    setCurrentText(newText);
    onUpdate(exercise.id, newText);
  };

  const getCurrentWord = (subOption: any) => {
    for (const opt of subOption.options) {
      if (currentText.includes(opt)) {
        return opt;
      }
    }
    return subOption.options[0];
  };

  const resetToOriginal = () => {
    setCurrentText(exercise.original);
    onUpdate(exercise.id, exercise.original);
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷 Show English" : "🇺🇸 Show Portuguese"}
        </button>
        <button
          onClick={resetToOriginal}
          className="text-xs px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition flex items-center gap-1"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="mb-4">
        <p className="text-lg font-bold text-gray-800 mb-2">
          {currentText}
        </p>
        {showPortuguese && (
          <p className="text-md text-gray-600 italic border-l-4 pl-3" 
             style={{ borderColor: LESSON_THEME_COLOR }}>
            {exercise.portuguese}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {exercise.substitutions.map((sub: any, idx: number) => {
          const currentWord = getCurrentWord(sub);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-600">Replace "{currentWord}":</span>
              <div className="flex flex-wrap gap-2">
                {sub.options.map((option: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSubstitution(currentWord, option)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      currentWord === option 
                        ? 'bg-opacity-20 text-white cursor-default' 
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
// COMPONENT: TRANSFORMATION EXERCISE
// ==============================
interface TransformationExerciseProps {
  title: string;
  items: any[];
  transformType: 'negative' | 'affirmative' | 'interrogative';
  onAnswerChange: (id: number, value: string) => void;
  answers: Record<number, string>;
  onCheck: (id: number, userAnswer: string, correctAnswer: string) => void;
  showResults: Record<number, boolean>;
  correctness: Record<number, boolean>;
}

const TransformationExercise = ({ 
  title, items, transformType, onAnswerChange, answers, onCheck, showResults, correctness 
}: TransformationExerciseProps) => {
  const getOriginalText = (item: any) => {
    if (transformType === 'negative') return item.english;
    if (transformType === 'affirmative') return item.negative;
    return item.statement;
  };

  const getCorrectAnswer = (item: any) => {
    if (transformType === 'negative') return `don't/doesn't ${item.english.toLowerCase()}`;
    if (transformType === 'affirmative') return item.affirmative;
    return item.interrogative;
  };

  const getInstruction = () => {
    if (transformType === 'negative') return "Transform into negative using 'do not / don't' or 'does not / doesn't':";
    if (transformType === 'affirmative') return "Transform into affirmative:";
    return "Transform into interrogative (question form):";
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 shadow-md" style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>{title}</h3>
      <p className="text-gray-600 mb-5 italic text-sm">{getInstruction()}</p>
      
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="border-b pb-4 last:border-b-0">
            <p className="font-medium text-gray-800 mb-2">
              {getOriginalText(item)}
            </p>
            <textarea
              value={answers[item.id] || ""}
              onChange={(e) => onAnswerChange(item.id, e.target.value)}
              placeholder="Type your transformed sentence here..."
              className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:outline-none resize-none text-sm"
              style={{ borderColor: `${LESSON_THEME_COLOR}30` }}
              rows={2}
            />
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => onCheck(item.id, answers[item.id] || "", getCorrectAnswer(item))}
                className="text-white px-4 py-1.5 rounded-lg transition font-medium text-sm hover:opacity-90"
                style={{ backgroundColor: LESSON_THEME_COLOR }}
              >
                Check Answer
              </button>
            </div>
            {showResults[item.id] && (
              <div className={`mt-3 p-3 rounded-lg ${correctness[item.id] ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                <div className="flex items-start gap-2">
                  {correctness[item.id] ? (
                    <Check className="text-green-600 flex-shrink-0" size={18} />
                  ) : (
                    <X className="text-red-600 flex-shrink-0" size={18} />
                  )}
                  <div>
                    <p className={`font-medium text-sm ${correctness[item.id] ? 'text-green-700' : 'text-red-700'}`}>
                      {correctness[item.id] ? 'Correct!' : 'Not quite right.'}
                    </p>
                    {!correctness[item.id] && (
                      <p className="text-gray-700 text-xs">
                        <span className="font-medium">Suggested answer:</span> {getCorrectAnswer(item)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ==============================
// COMPONENT: FLUENCY CARD
// ==============================
const FluencyCard = ({ item, index }: { item: any; index: number }) => {
  const [showPortuguese, setShowPortuguese] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${LESSON_THEME_COLOR}20`, color: LESSON_THEME_COLOR }}>
          {index + 1}
        </span>
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-md font-medium text-gray-800">
          {item.sentence}
        </p>
        <AudioPlayerSimulated text={item.sentence} compact />
      </div>
      {showPortuguese && (
        <p className="text-gray-600 italic text-sm mt-2 border-l-4 pl-2" style={{ borderColor: LESSON_THEME_COLOR }}>
          {item.portuguese}
        </p>
      )}
    </div>
  );
};

// ==============================
// MAIN COMPONENT
// ==============================
export default function Lesson38Health() {
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    listenAndNumber: true,
    drilling1: true,
    negative: true,
    drilling2: true,
    affirmative: true,
    interrogative: true,
    fluency: true,
    tuneIn: true
  });

  // Listen and Number state
  const [userNumbers, setUserNumbers] = useState<Record<string, string>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  const [showListenAnswers, setShowListenAnswers] = useState(false);

  // Drilling states
  const [drilling1Texts, setDrilling1Texts] = useState<Record<number, string>>({});
  const [drilling2Texts, setDrilling2Texts] = useState<Record<number, string>>({});
  
  // Transformation states
  const [negativeAnswers, setNegativeAnswers] = useState<Record<number, string>>({});
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<number, string>>({});
  const [interrogativeAnswers, setInterrogativeAnswers] = useState<Record<number, string>>({});
  
  const [negativeResults, setNegativeResults] = useState<Record<number, boolean>>({});
  const [affirmativeResults, setAffirmativeResults] = useState<Record<number, boolean>>({});
  const [interrogativeResults, setInterrogativeResults] = useState<Record<number, boolean>>({});
  const [negativeShow, setNegativeShow] = useState<Record<number, boolean>>({});
  const [affirmativeShow, setAffirmativeShow] = useState<Record<number, boolean>>({});
  const [interrogativeShow, setInterrogativeShow] = useState<Record<number, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleUserNumberChange = (id: string, value: string) => {
    setUserNumbers(prev => ({ ...prev, [id]: value }));
  };

  const checkListenAndNumber = () => {
    const results: Record<string, boolean> = {};
    listenAndNumberImages.forEach(img => {
      const userNum = parseInt(userNumbers[img.id] || "");
      results[img.id] = userNum === img.correctNumber;
    });
    setListenResults(results);
    setShowListenAnswers(true);
  };

  const clearListenAndNumber = () => {
    setUserNumbers({});
    setListenResults({});
    setShowListenAnswers(false);
  };

  const handleDrilling1Update = (id: number, newText: string) => {
    setDrilling1Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleDrilling2Update = (id: number, newText: string) => {
    setDrilling2Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleNegativeAnswerChange = (id: number, value: string) => {
    setNegativeAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleAffirmativeAnswerChange = (id: number, value: string) => {
    setAffirmativeAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleInterrogativeAnswerChange = (id: number, value: string) => {
    setInterrogativeAnswers(prev => ({ ...prev, [id]: value }));
  };

  const checkNegative = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z]/g, '');
    const isCorrect = normalizedUser === normalizedCorrect || 
      (normalizedUser.length > 5 && normalizedCorrect.includes(normalizedUser));
    setNegativeResults(prev => ({ ...prev, [id]: isCorrect }));
    setNegativeShow(prev => ({ ...prev, [id]: true }));
  };

  const checkAffirmative = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z]/g, '');
    const isCorrect = normalizedUser === normalizedCorrect;
    setAffirmativeResults(prev => ({ ...prev, [id]: isCorrect }));
    setAffirmativeShow(prev => ({ ...prev, [id]: true }));
  };

  const checkInterrogative = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    const isCorrect = normalizedUser === normalizedCorrect;
    setInterrogativeResults(prev => ({ ...prev, [id]: isCorrect }));
    setInterrogativeShow(prev => ({ ...prev, [id]: true }));
  };

  const saveAllAnswers = () => {
    const allData = {
      userNumbers,
      drilling1Texts,
      drilling2Texts,
      negativeAnswers,
      affirmativeAnswers,
      interrogativeAnswers,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`lesson${LESSON_NUMBER}_answers`, JSON.stringify(allData));
    alert("All your answers have been saved locally!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers?")) {
      setUserNumbers({});
      setDrilling1Texts({});
      setDrilling2Texts({});
      setNegativeAnswers({});
      setAffirmativeAnswers({});
      setInterrogativeAnswers({});
      setListenResults({});
      setNegativeResults({});
      setAffirmativeResults({});
      setInterrogativeResults({});
      setNegativeShow({});
      setAffirmativeShow({});
      setInterrogativeShow({});
      setShowListenAnswers(false);
      alert("All answers have been cleared.");
    }
  };

  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE} - ${LESSON_SUBTITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  return (
    <div className="min-h-screen py-12 px-4 md:px-6 bg-cover bg-center bg-fixed relative"
         style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      
      <div className="relative max-w-6xl mx-auto bg-white bg-opacity-95 rounded-3xl p-6 md:p-8 shadow-2xl">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-block p-2 rounded-full mb-3" style={{ backgroundColor: `${LESSON_THEME_COLOR}20` }}>
            <Heart size={40} style={{ color: LESSON_THEME_COLOR }} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-gray-800">{LESSON_TITLE}</h2>
          <h3 className="text-lg text-gray-600 mb-3">{LESSON_SUBTITLE}</h3>
          <p className="text-md text-gray-700 max-w-3xl mx-auto">
            Practice listening, substitution drills, transformations, and fluency with demonstratives.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-lg text-sm"
            >
              <Check size={18} /> Save Progress
            </button>
            <button
              onClick={clearAllAnswers}
              className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg text-sm"
            >
              <X size={18} /> Clear All
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-lg text-sm"
            >
              <MessageCircle size={18} /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* PART 1: LISTEN AND NUMBER */}
        <div className="mb-12 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
          <div className="py-3 px-6 flex justify-between items-center"
               style={{ background: `linear-gradient(135deg, ${LESSON_THEME_COLOR}, ${LESSON_THEME_COLOR}dd)` }}>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Headphones size={20} /> PART 1 — LISTEN AND NUMBER
            </h2>
            <button 
              onClick={() => toggleSection('listenAndNumber')}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.listenAndNumber ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.listenAndNumber && (
            <div className="p-6">
              <p className="text-gray-700 mb-4 text-center text-md">
                🎧 Listen to the audio and number the pictures according to what you hear.
              </p>
              <p className="text-center text-xs text-gray-500 mb-6 italic">
                Click the audio button next to each image to hear the situation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {listenAndNumberImages.map((img) => (
                  <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-md border-2" style={{ borderColor: `${LESSON_THEME_COLOR}20` }}>
                    <div className="relative h-40 w-full">
                      <Image
                        src={img.imageUrl}
                        alt={img.description}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-md" style={{ color: LESSON_THEME_COLOR }}>Image {img.id}</span>
                        <AudioPlayerSimulated text={`Situation ${img.correctNumber}: ${img.situation}`} compact />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-gray-600 font-medium text-sm">Number:</label>
                        <select
                          value={userNumbers[img.id] || ""}
                          onChange={(e) => handleUserNumberChange(img.id, e.target.value)}
                          className="w-16 px-2 py-1 border-2 rounded-lg focus:outline-none text-sm"
                          style={{ borderColor: `${LESSON_THEME_COLOR}50` }}
                        >
                          <option value="">—</option>
                          {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        {showListenAnswers && listenResults[img.id] !== undefined && (
                          <span className={`ml-2 ${listenResults[img.id] ? 'text-green-600' : 'text-red-500'}`}>
                            {listenResults[img.id] ? <Check size={16} /> : <X size={16} />}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={checkListenAndNumber}
                  className="px-5 py-2 text-white rounded-full font-medium hover:opacity-90 transition text-sm"
                  style={{ backgroundColor: LESSON_THEME_COLOR }}
                >
                  Check Answers
                </button>
                <button
                  onClick={clearListenAndNumber}
                  className="px-5 py-2 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition text-sm"
                >
                  Clear All Numbers
                </button>
              </div>
              
              {showListenAnswers && (
                <div className="mt-6 p-4 bg-gray-100 rounded-xl border-2 border-gray-300">
                  <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle size={18} style={{ color: LESSON_THEME_COLOR }} /> Correct Answers:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listenAndNumberImages.map((img) => (
                      <div key={img.id} className="flex justify-between items-center p-2 bg-white rounded-lg text-sm">
                        <span className="font-medium">Image {img.id}:</span>
                        <span className="text-emerald-600 font-bold">→ {img.correctNumber}</span>
                        <span className="text-gray-500 text-xs">({img.situation})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* PART 2: DRILLING PRACTICE I */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#3b82f6" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔄 PART 2 — DRILLING PRACTICE I
            </h2>
            <button onClick={() => toggleSection('drilling1')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling1 ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling1 && (
            <div className="p-6">
              <p className="text-gray-600 mb-5 italic text-sm">Substitute the words as indicated:</p>
              <div className="space-y-5">
                {drillingPracticeI.map((ex) => (
                  <SubstitutionDrill key={ex.id} exercise={ex} onUpdate={handleDrilling1Update} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART 3: CHANGE INTO NEGATIVE */}
        <div className="mb-12 bg-gradient-to-br from-red-50 to-rose-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#ef4444" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-red-500 to-rose-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ❌ PART 3 — CHANGE INTO NEGATIVE
            </h2>
            <button onClick={() => toggleSection('negative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.negative ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.negative && (
            <div className="p-6">
              <TransformationExercise
                title="Negative Transformation"
                items={negativePractice}
                transformType="negative"
                onAnswerChange={handleNegativeAnswerChange}
                answers={negativeAnswers}
                onCheck={checkNegative}
                showResults={negativeShow}
                correctness={negativeResults}
              />
              <div className="mt-5 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-xs">💡 Tip: Use "do not / don't" or "does not / doesn't"</p>
              </div>
            </div>
          )}
        </div>

        {/* PART 4: DRILLING PRACTICE II */}
        <div className="mb-12 bg-gradient-to-br from-purple-50 to-violet-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#8b5cf6" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-purple-500 to-violet-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔄 PART 4 — DRILLING PRACTICE II
            </h2>
            <button onClick={() => toggleSection('drilling2')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling2 ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling2 && (
            <div className="p-6">
              <div className="space-y-5">
                {drillingPracticeII.map((ex) => (
                  <SubstitutionDrill key={ex.id} exercise={ex} onUpdate={handleDrilling2Update} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART 5: CHANGE INTO AFFIRMATIVE */}
        <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#10b981" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ➕ PART 5 — CHANGE INTO AFFIRMATIVE
            </h2>
            <button onClick={() => toggleSection('affirmative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.affirmative ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.affirmative && (
            <div className="p-6">
              <TransformationExercise
                title="Affirmative Transformation"
                items={affirmativePractice}
                transformType="affirmative"
                onAnswerChange={handleAffirmativeAnswerChange}
                answers={affirmativeAnswers}
                onCheck={checkAffirmative}
                showResults={affirmativeShow}
                correctness={affirmativeResults}
              />
            </div>
          )}
        </div>

        {/* PART 6: CHANGE INTO INTERROGATIVE */}
        <div className="mb-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f59e0b" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-amber-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ❓ PART 6 — CHANGE INTO INTERROGATIVE
            </h2>
            <button onClick={() => toggleSection('interrogative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.interrogative ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.interrogative && (
            <div className="p-6">
              <TransformationExercise
                title="Interrogative Transformation"
                items={interrogativePractice}
                transformType="interrogative"
                onAnswerChange={handleInterrogativeAnswerChange}
                answers={interrogativeAnswers}
                onCheck={checkInterrogative}
                showResults={interrogativeShow}
                correctness={interrogativeResults}
              />
            </div>
          )}
        </div>

        {/* PART 7: FLUENCY - DEMONSTRATIVES */}
        <div className="mb-12 bg-gradient-to-br from-cyan-50 to-sky-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-sky-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              💬 PART 7 — FLUENCY (Demonstratives)
            </h2>
            <button onClick={() => toggleSection('fluency')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.fluency ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.fluency && (
            <div className="p-6">
              <div className="mb-6 p-3 bg-cyan-100 rounded-lg">
                <p className="text-cyan-800 text-sm">📘 <strong>Model:</strong> I need to talk to that nurse → I need to talk to those nurses / This is my brother → These are my brothers</p>
              </div>
              
              <h3 className="text-lg font-bold text-cyan-700 mb-3">Part A</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {fluencyExercises.partA.map((item, idx) => (
                  <FluencyCard key={item.id} item={item} index={idx} />
                ))}
              </div>
              
              <h3 className="text-lg font-bold text-cyan-700 mb-3">Part B</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {fluencyExercises.partB.map((item, idx) => (
                  <FluencyCard key={item.id} item={item} index={idx} />
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-cyan-100 rounded-lg">
                <h4 className="font-bold text-cyan-800 text-sm mb-1">🎯 Practice Tip:</h4>
                <p className="text-cyan-700 text-sm">Practice saying these sentences out loud. Pay attention to the difference between <strong>this/these</strong> (near) and <strong>that/those</strong> (far).</p>
              </div>
            </div>
          )}
        </div>

        {/* PART 8: TUNE IN YOUR EARS */}
        <div className="mb-12 bg-gradient-to-br from-orange-50 to-amber-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f97316" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-orange-500 to-amber-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Youtube size={20} /> PART 8 — TUNE IN YOUR EARS
            </h2>
            <button onClick={() => toggleSection('tuneIn')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.tuneIn ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.tuneIn && (
            <div className="p-6">
              <div className="mb-5">
                <p className="text-gray-700 mb-3 text-md font-medium">🎬 Watch the video and improve your listening skills:</p>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md">
                  <iframe 
                    src={tuneInYourEars.videoUrl.replace("watch?v=", "embed/")}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-80 md:h-96 rounded-xl"
                  ></iframe>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div className="bg-white p-4 rounded-xl shadow-md border border-orange-200">
                  <h3 className="text-md font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <BookOpen size={16} /> Key Vocabulary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {tuneInYourEars.vocabulary.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-100 py-1">
                        <span className="font-medium text-gray-800">{item.word}</span>
                        <span className="text-gray-500 text-xs">— {item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-md border border-orange-200">
                  <h3 className="text-md font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <HelpCircle size={16} /> Questions to Reflect
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {tuneInYourEars.questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-700 text-sm font-medium">💡 Advice:</p>
                    <p className="text-amber-600 text-sm">{tuneInYourEars.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mt-10 pt-6 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={saveAllAnswers} className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium shadow-md text-sm">
              <Check size={18} /> Save All Answers
            </button>
            <button onClick={clearAllAnswers} className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium shadow-md text-sm">
              <X size={18} /> Clear All
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={() => router.push("/cursos")} className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition font-medium shadow-md text-sm">
              &larr; Back to Courses
            </button>
            <button onClick={() => router.push(`/cursos/lesson${LESSON_NUMBER + 1}`)} className="px-5 py-2 text-white rounded-full transition font-medium shadow-md text-sm" style={{ backgroundColor: LESSON_THEME_COLOR }}>
              Next Lesson &rarr;
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center text-gray-500 text-xs">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} - {LESSON_SUBTITLE} • Interactive English Practice • All answers are saved in your browser</p>
          <p className="mt-1">🩺 Stay healthy and keep practicing English every day!</p>
        </div>
      </div>
    </div>
  );
}

// Missing icons imports
import { BookOpen, HelpCircle } from "lucide-react";