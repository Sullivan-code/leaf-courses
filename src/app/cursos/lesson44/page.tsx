"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Save, Check, XCircle } from "lucide-react";

// ============================================
// LESSON 44 – EATING OUT
// ============================================

// Fluency Practice sentences
const fluencyItems = [
  { key: "a", english: "We love that cake.", expected: "That's our favorite cake.", audio: "/audios/lesson44-a.mp3" },
  { key: "b", english: "I really like this book.", expected: "That's my favorite book.", audio: "/audios/lesson44-b.mp3" },
  { key: "c", english: "I love that TV series.", expected: "That's my favorite TV series.", audio: "/audios/lesson44-c.mp3" },
  { key: "d", english: "You love this pizza place.", expected: "That's your favorite pizza place.", audio: "/audios/lesson44-d.mp3" },
  { key: "e", english: "Suzanne really likes that movie.", expected: "That's her favorite movie.", audio: "/audios/lesson44-e.mp3" },
  { key: "f", english: "Lynda and George really like that museum.", expected: "That's their favorite museum.", audio: "/audios/lesson44-f.mp3" },
  { key: "g", english: "My father loves this hamburger.", expected: "That's his favorite hamburger.", audio: "/audios/lesson44-g.mp3" },
  { key: "h", english: "Jeremy and I love that store.", expected: "That's our favorite store.", audio: "/audios/lesson44-h.mp3" },
  { key: "i", english: "Connor and Josh love that dish.", expected: "That's their favorite dish.", audio: "/audios/lesson44-i.mp3" },
  { key: "j", english: "Wendy loves this dessert.", expected: "That's her favorite dessert.", audio: "/audios/lesson44-j.mp3" },
];

// Substitution Practice I (ALL IN ENGLISH NOW)
const substitutionPracticeI = [
  {
    id: "sub1-1",
    original: "The children like to make popcorn.",
    variations: ["desserts", "cakes"],
    correctAnswers: [
      "The children like to make desserts.",
      "The children like to make cakes."
    ],
    hint: "popcorn → desserts / cakes"
  },
  {
    id: "sub1-2",
    original: "My grandmother makes a very good cake.",
    variations: ["pizza", "sandwich"],
    correctAnswers: [
      "My grandmother makes a very good pizza.",
      "My grandmother makes a very good sandwich."
    ],
    hint: "cake → pizza / sandwich"
  },
  {
    id: "sub1-3",
    original: "It's cold. Do you want some soup?",
    variations: ["coffee", "tea"],
    correctAnswers: [
      "It's cold. Do you want some coffee?",
      "It's cold. Do you want some tea?"
    ],
    hint: "soup → coffee / tea"
  },
  {
    id: "sub1-4",
    original: "It's hot. I want to buy some ice cream.",
    variations: ["soda", "juice"],
    correctAnswers: [
      "It's hot. I want to buy some soda.",
      "It's hot. I want to buy some juice."
    ],
    hint: "ice cream → soda / juice"
  },
  {
    id: "sub1-5",
    original: "Do you give gifts to your wife?",
    variations: ["your husband", "your children"],
    correctAnswers: [
      "Do you give gifts to your husband?",
      "Do you give gifts to your children?"
    ],
    hint: "wife → husband / children"
  },
];

// Substitution Practice II (ALL IN ENGLISH NOW)
const substitutionPracticeII = [
  {
    id: "sub2-1",
    original: "What is your favorite dish?",
    variations: ["his", "their"],
    correctAnswers: [
      "What is his favorite dish?",
      "What is their favorite dish?"
    ],
    hint: "your → his / their"
  },
  {
    id: "sub2-2",
    original: "This is the best restaurant in the city.",
    variations: ["cafeteria", "school"],
    correctAnswers: [
      "This is the best cafeteria in the city.",
      "This is the best school in the city."
    ],
    hint: "restaurant → cafeteria / school"
  },
  {
    id: "sub2-3",
    original: "Who is your best friend?",
    variations: ["Where is he?", "How old is he?"],
    correctAnswers: [
      "Where is he?",
      "How old is he?"
    ],
    hint: "Who is → Where is / How old is"
  },
  {
    id: "sub2-4",
    original: "I really like this dish.",
    variations: ["hamburger", "ice cream"],
    correctAnswers: [
      "I really like this hamburger.",
      "I really like this ice cream."
    ],
    hint: "dish → hamburger / ice cream"
  },
  {
    id: "sub2-5",
    original: "How many slices of pizza do you want?",
    variations: ["pie", "cheese"],
    correctAnswers: [
      "How many slices of pie do you want?",
      "How many slices of cheese do you want?"
    ],
    hint: "pizza → pie / cheese"
  },
];

// Change into Negative Exercises
const negativeExercises = [
  { id: "neg1", sentence: "They want to eat fast food this weekend.", correctAnswer: "They don't want to eat fast food this weekend." },
  { id: "neg2", sentence: "We like to make desserts for our children.", correctAnswer: "We don't like to make desserts for our children." },
  { id: "neg3", sentence: "He likes to give souvenirs to his relatives.", correctAnswer: "He doesn't like to give souvenirs to his relatives." },
  { id: "neg4", sentence: "I like to eat popcorn at the movies.", correctAnswer: "I don't like to eat popcorn at the movies." },
  { id: "neg5", sentence: "We like this dish.", correctAnswer: "We don't like this dish." },
  { id: "neg6", sentence: "She has to give a tip to the waiter.", correctAnswer: "She doesn't have to give a tip to the waiter." },
];

// Change into Affirmative Exercises
const affirmativeExercises = [
  { id: "aff1", sentence: "My friend doesn't want any coffee.", correctAnswer: "My friend wants some coffee." },
  { id: "aff2", sentence: "My brother doesn't need any money.", correctAnswer: "My brother needs some money." },
  { id: "aff3", sentence: "We don't have to take any food to the park.", correctAnswer: "We have to take some food to the park." },
  { id: "aff4", sentence: "I don't want any chocolate cake.", correctAnswer: "I want some chocolate cake." },
  { id: "aff5", sentence: "He doesn't have any tips to give me.", correctAnswer: "He has some tips to give me." },
  { id: "aff6", sentence: "I don't need to buy any gifts.", correctAnswer: "I need to buy some gifts." },
];

// Change into Interrogative Exercises
const interrogativeExercises = [
  { id: "int1", sentence: "They have some tomato sauce.", correctAnswer: "Do they have any tomato sauce?" },
  { id: "int2", sentence: "We have some food at home.", correctAnswer: "Do we have any food at home?" },
  { id: "int3", sentence: "She wants to go to a pizza place tonight.", correctAnswer: "Does she want to go to a pizza place tonight?" },
  { id: "int4", sentence: "He wants to buy ice cream for dessert.", correctAnswer: "Does he want to buy ice cream for dessert?" },
  { id: "int5", sentence: "They eat pizza on Thursdays.", correctAnswer: "Do they eat pizza on Thursdays?" },
  { id: "int6", sentence: "He knows how to make cakes.", correctAnswer: "Does he know how to make cakes?" },
];

// Speaking Practice Questions
const speakingQuestions = [
  "What is your favorite dish?",
  "Do you usually eat fast food on weekends?",
  "Is fast food good for your health?",
  "What is your favorite dessert?",
  "What is the best restaurant in your city?",
  "Do you prefer to cook or to go to restaurants on weekends?",
  "What is the best pizza place in your city?",
  "Do you give tips in restaurants?",
  "Do you know how to cook?",
  "What do you want to give to your wife / husband on her / his birthday?"
];

// Tune In Your Ears - Video Questions
const videoQuestions = [
  {
    id: "video1",
    question: "How do you think you can put English in your routine?",
    isPersonal: true,
  },
  {
    id: "video2",
    question: "Why is it good to study English every single day?",
    isPersonal: false,
  },
  {
    id: "video3",
    question: "What's the most challenging thing in your opinion in English?",
    isPersonal: true,
  },
  {
    id: "video4",
    question: "How do you try to think in English?",
    isPersonal: true,
  },
  {
    id: "video5",
    question: "How do you make speaking happen automatically?",
    isPersonal: true,
  },
];

// Vocabulary from video
const videoVocabulary = [
  { english: "Learners", portuguese: "Aprendizes, alunos" },
  { english: "To pass exams", portuguese: "Passar nas provas" },
  { english: "Goal", portuguese: "Objetivo" },
  { english: "To feel", portuguese: "Sentir / Parecer" },
  { english: "Expensive", portuguese: "Caro" },
  { english: "On a bus", portuguese: "Em um ônibus" },
  { english: "Every single day", portuguese: "Todo santo dia" },
  { english: "To find", portuguese: "Encontrar" },
  { english: "A dialogue", portuguese: "Um diálogo" },
  { english: "80% percent", portuguese: "Oitenta porcento" },
  { english: "To wake up", portuguese: "Acordar" },
  { english: "Knowledge", portuguese: "Conhecimento" },
  { english: "Active", portuguese: "Ativo" },
  { english: "Sentences", portuguese: "Frases" },
  { english: "Repeating and reflecting", portuguese: "Repetindo e refletindo" },
  { english: "Felt easy", portuguese: "Pareceu fácil" },
  { english: "To notice", portuguese: "Perceber, notar" },
];

// ============================================
// COMPONENTS
// ============================================

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
        className={`${compact ? "p-1" : "p-2"} bg-orange-500 text-white rounded-full hover:bg-orange-600 transition`}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600 transition`}
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
            className="h-full bg-orange-500 transition-all duration-200" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const AnswerResult = ({ isCorrect, correctAnswer }: AnswerResultProps) => {
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

// Answer checking helper
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase().trim().replace(/[.,?!]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

// ============================================
// MAIN LESSON COMPONENT
// ============================================

export default function Lesson44() {
  const router = useRouter();
  
  // States for Fluency Practice
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Substitution Practice I
  const [substitutionIAnswers, setSubstitutionIAnswers] = useState<Record<string, string>>({});
  const [showSubstitutionIResults, setShowSubstitutionIResults] = useState<Record<string, boolean>>({});
  const [substitutionIAnswerResults, setSubstitutionIAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Substitution Practice II
  const [substitutionIIAnswers, setSubstitutionIIAnswers] = useState<Record<string, string>>({});
  const [showSubstitutionIIResults, setShowSubstitutionIIResults] = useState<Record<string, boolean>>({});
  const [substitutionIIAnswerResults, setSubstitutionIIAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Negative Exercises
  const [negativeAnswers, setNegativeAnswers] = useState<Record<string, string>>({});
  const [showNegativeResults, setShowNegativeResults] = useState<Record<string, boolean>>({});
  const [negativeAnswerResults, setNegativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Affirmative Exercises
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<string, string>>({});
  const [showAffirmativeResults, setShowAffirmativeResults] = useState<Record<string, boolean>>({});
  const [affirmativeAnswerResults, setAffirmativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Interrogative Exercises
  const [interrogativeAnswers, setInterrogativeAnswers] = useState<Record<string, string>>({});
  const [showInterrogativeResults, setShowInterrogativeResults] = useState<Record<string, boolean>>({});
  const [interrogativeAnswerResults, setInterrogativeAnswerResults] = useState<Record<string, boolean>>({});
  
  // States for Speaking Questions
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  
  // States for Tune In Your Ears
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});
  
  // States for section collapse/expand
  const [sections, setSections] = useState({
    fluency: true,
    substitutionI: true,
    substitutionII: true,
    negative: true,
    affirmative: true,
    interrogative: true,
    speaking: true,
    tuneIn: true
  });

  // State for saved answers
  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});

  // ============================================
  // PERSISTENCE SYSTEM - LOAD
  // ============================================
  useEffect(() => {
    const savedData = localStorage.getItem("lesson44Answers");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        
        setNotes(data.notes || {});
        setShowAnswers(data.showAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        
        if (data.substitutionIAnswers) setSubstitutionIAnswers(data.substitutionIAnswers);
        if (data.showSubstitutionIResults) setShowSubstitutionIResults(data.showSubstitutionIResults);
        if (data.substitutionIAnswerResults) setSubstitutionIAnswerResults(data.substitutionIAnswerResults);
        
        if (data.substitutionIIAnswers) setSubstitutionIIAnswers(data.substitutionIIAnswers);
        if (data.showSubstitutionIIResults) setShowSubstitutionIIResults(data.showSubstitutionIIResults);
        if (data.substitutionIIAnswerResults) setSubstitutionIIAnswerResults(data.substitutionIIAnswerResults);
        
        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.negativeAnswerResults) setNegativeAnswerResults(data.negativeAnswerResults);
        
        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.affirmativeAnswerResults) setAffirmativeAnswerResults(data.affirmativeAnswerResults);
        
        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.showInterrogativeResults) setShowInterrogativeResults(data.showInterrogativeResults);
        if (data.interrogativeAnswerResults) setInterrogativeAnswerResults(data.interrogativeAnswerResults);
        
        if (data.questionAnswers) setQuestionAnswers(data.questionAnswers);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
        if (data.sections) setSections(data.sections);
        if (data.savedAnswers) setSavedAnswers(data.savedAnswers);
        
        console.log("Data loaded from localStorage for Lesson 44");
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    }
  }, []);

  // ============================================
  // PERSISTENCE SYSTEM - SAVE
  // ============================================
  const saveAllAnswers = () => {
    const data = {
      notes,
      showAnswers,
      answerResults,
      showAnswerResults,
      substitutionIAnswers,
      showSubstitutionIResults,
      substitutionIAnswerResults,
      substitutionIIAnswers,
      showSubstitutionIIResults,
      substitutionIIAnswerResults,
      negativeAnswers,
      showNegativeResults,
      negativeAnswerResults,
      affirmativeAnswers,
      showAffirmativeResults,
      affirmativeAnswerResults,
      interrogativeAnswers,
      showInterrogativeResults,
      interrogativeAnswerResults,
      questionAnswers,
      videoAnswers,
      sections,
      savedAnswers: {
        fluency: notes,
        substitutionPracticeI: substitutionIAnswers,
        substitutionPracticeII: substitutionIIAnswers,
        negativeExercises: negativeAnswers,
        affirmativeExercises: affirmativeAnswers,
        interrogativeExercises: interrogativeAnswers,
        speakingQuestions: questionAnswers,
        tuneInYourEars: videoAnswers,
        timestamp: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 44 – Eating Out",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson44Answers", JSON.stringify(data));
      setSavedAnswers(data.savedAnswers);
      alert("✅ All your answers have been saved successfully!");
    } catch (error) {
      console.error("Error saving answers:", error);
      alert("❌ Error saving answers. Please try again.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL your answers? This action cannot be undone.")) {
      setNotes({});
      setShowAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setSubstitutionIAnswers({});
      setShowSubstitutionIResults({});
      setSubstitutionIAnswerResults({});
      setSubstitutionIIAnswers({});
      setShowSubstitutionIIResults({});
      setSubstitutionIIAnswerResults({});
      setNegativeAnswers({});
      setShowNegativeResults({});
      setNegativeAnswerResults({});
      setAffirmativeAnswers({});
      setShowAffirmativeResults({});
      setAffirmativeAnswerResults({});
      setInterrogativeAnswers({});
      setShowInterrogativeResults({});
      setInterrogativeAnswerResults({});
      setQuestionAnswers({});
      setVideoAnswers({});
      localStorage.removeItem("lesson44Answers");
      alert("All answers have been cleared.");
    }
  };

  const loadSavedAnswers = () => {
    const saved = localStorage.getItem("lesson44Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.notes) setNotes(data.notes);
        if (data.substitutionIAnswers) setSubstitutionIAnswers(data.substitutionIAnswers);
        if (data.substitutionIIAnswers) setSubstitutionIIAnswers(data.substitutionIIAnswers);
        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.questionAnswers) setQuestionAnswers(data.questionAnswers);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
        if (data.savedAnswers) setSavedAnswers(data.savedAnswers);
        alert("✅ Previous answers loaded successfully!");
      } catch (error) {
        alert("Error loading saved answers.");
      }
    } else {
      alert("No saved answers found.");
    }
  };

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================
  const handleChange = (key: string, value: string) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  const handleCheck = (key: string) => {
    const item = fluencyItems.find(item => item.key === key);
    const isCorrect = checkAnswer(notes[key] || "", item?.expected || "");
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
    setShowAnswers(prev => ({ ...prev, [key]: true }));
  };

  const handleSubstitutionIChange = (key: string, value: string) => {
    setSubstitutionIAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubstitutionICheck = (id: string, correctAnswers: string[]) => {
    let allCorrect = true;
    const variations = substitutionPracticeI.find(ex => ex.id === id)?.variations || [];
    variations.forEach((_, index) => {
      const userAnswer = substitutionIAnswers[`${id}-${index}`]?.trim();
      const correctAnswer = correctAnswers[index];
      const isCorrect = checkAnswer(userAnswer || "", correctAnswer);
      if (!isCorrect) allCorrect = false;
      setSubstitutionIAnswerResults(prev => ({ ...prev, [`${id}-${index}`]: isCorrect }));
    });
    setShowSubstitutionIResults(prev => ({ ...prev, [id]: true }));
    if (allCorrect) alert('✅ All answers are correct!');
  };

  const handleSubstitutionIIChange = (key: string, value: string) => {
    setSubstitutionIIAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubstitutionIICheck = (id: string, correctAnswers: string[]) => {
    let allCorrect = true;
    const variations = substitutionPracticeII.find(ex => ex.id === id)?.variations || [];
    variations.forEach((_, index) => {
      const userAnswer = substitutionIIAnswers[`${id}-${index}`]?.trim();
      const correctAnswer = correctAnswers[index];
      const isCorrect = checkAnswer(userAnswer || "", correctAnswer);
      if (!isCorrect) allCorrect = false;
      setSubstitutionIIAnswerResults(prev => ({ ...prev, [`${id}-${index}`]: isCorrect }));
    });
    setShowSubstitutionIIResults(prev => ({ ...prev, [id]: true }));
    if (allCorrect) alert('✅ All answers are correct!');
  };

  const handleNegativeChange = (key: string, value: string) => {
    setNegativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleNegativeCheck = (id: string) => {
    const exercise = negativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    const userAnswer = negativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    setNegativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowNegativeResults(prev => ({ ...prev, [id]: true }));
  };

  const handleAffirmativeChange = (key: string, value: string) => {
    setAffirmativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleAffirmativeCheck = (id: string) => {
    const exercise = affirmativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    const userAnswer = affirmativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    setAffirmativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowAffirmativeResults(prev => ({ ...prev, [id]: true }));
  };

  const handleInterrogativeChange = (key: string, value: string) => {
    setInterrogativeAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleInterrogativeCheck = (id: string) => {
    const exercise = interrogativeExercises.find(ex => ex.id === id);
    if (!exercise) return;
    const userAnswer = interrogativeAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    setInterrogativeAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowInterrogativeResults(prev => ({ ...prev, [id]: true }));
  };

  const handleQuestionChange = (index: number, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [`q${index}`]: value }));
  };

  const handleVideoAnswerChange = (id: string, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson-bg.jpg')` }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 44 – EATING OUT</h1>
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🗣️ FLUENCY</h2>
          <div className="flex justify-center items-center gap-4 mb-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition flex items-center gap-2">
              <Save size={18} /> Save Progress
            </button>
            <button onClick={loadSavedAnswers} className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition">
              Load Answers
            </button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-full transition">
              Clear All
            </button>
          </div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            🍽️ Let's learn how to talk about food, restaurants, and eating out!
          </p>
        </div>

        {/* ============================================ */}
        {/* FLUENCY PRACTICE - ANSWER THIS ACTIVITY */}
        {/* ============================================ */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 ANSWER THIS ACTIVITY</h2>
              <button onClick={() => toggleSection('fluency')} className="ml-4 p-2 rounded-full hover:bg-orange-600 transition">
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="mb-6 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 text-center">
                  ✍️ Transform the sentences using "That's my/your/his/her/our/their favorite..."
                </h3>
                
                {/* EXAMPLES SECTION */}
                <div className="mb-8 p-4 bg-white rounded-xl border-2 border-orange-200">
                  <h4 className="text-lg font-bold text-orange-700 mb-3">📌 Examples:</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">1.</span>
                      <span className="text-gray-700">They love that restaurant.</span>
                      <span className="text-orange-500 font-bold">→</span>
                      <span className="text-green-700 font-medium">That's their favorite restaurant.</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">2.</span>
                      <span className="text-gray-700">We really like this book.</span>
                      <span className="text-orange-500 font-bold">→</span>
                      <span className="text-green-700 font-medium">That's our favorite book.</span>
                    </div>
                    <div className="flex items-center gap-4 p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">3.</span>
                      <span className="text-gray-700">She loves this dessert.</span>
                      <span className="text-orange-500 font-bold">→</span>
                      <span className="text-green-700 font-medium">That's her favorite dessert.</span>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 mt-3 text-center">
                    💡 Now it's your turn! Transform each sentence below following the same pattern.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fluencyItems.map((item) => (
                    <div key={item.key} className="flex flex-col bg-white p-5 rounded-xl shadow-md border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Transform {item.key.toUpperCase()}</span>
                        <AudioPlayer src={item.audio} compact />
                      </div>
                      <p className="text-orange-700 font-medium mb-2">📝 {item.english}</p>
                      <textarea
                        placeholder={`Type your answer here... (e.g., ${item.expected})`}
                        value={notes[item.key] || ""}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full h-[80px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => handleCheck(item.key)} disabled={!notes[item.key]?.trim()} className={`flex-1 py-2 px-4 rounded-md transition font-medium ${!notes[item.key]?.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                          Check Answer
                        </button>
                        <button onClick={() => { handleChange(item.key, ""); setShowAnswerResults(prev => ({ ...prev, [item.key]: false })); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                          Clear
                        </button>
                      </div>
                      {showAnswerResults[item.key] && <AnswerResult isCorrect={answerResults[item.key]} correctAnswer={item.expected} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE - SUBSTITUTION I (ALL IN ENGLISH) */}
        {/* ============================================ */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION I</h2>
              <button onClick={() => toggleSection('substitutionI')} className="ml-4 p-2 rounded-full hover:bg-blue-600 transition">
                {sections.substitutionI ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitutionI && (
            <div className="p-8">
              <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-2">Substitute the underlined words:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {substitutionPracticeI.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-700 mb-3">{exercise.original}</p>
                      <div className="space-y-3">
                        {exercise.variations.map((variation: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-blue-600 w-28">{variation}:</span>
                            <input type="text" value={substitutionIAnswers[`${exercise.id}-${index}`] || ""} onChange={(e) => handleSubstitutionIChange(`${exercise.id}-${index}`, e.target.value)} className="flex-1 p-2 border border-blue-300 rounded-md text-sm" placeholder="Type the complete sentence" />
                            {showSubstitutionIResults[exercise.id] && substitutionIAnswerResults[`${exercise.id}-${index}`] !== undefined && (
                              <span className={`text-sm font-medium ${substitutionIAnswerResults[`${exercise.id}-${index}`] ? 'text-green-600' : 'text-red-600'}`}>
                                {substitutionIAnswerResults[`${exercise.id}-${index}`] ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleSubstitutionICheck(exercise.id, exercise.correctAnswers)} className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition text-sm">Check All</button>
                        <button onClick={() => { exercise.variations.forEach((_, i) => handleSubstitutionIChange(`${exercise.id}-${i}`, "")); setShowSubstitutionIResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm">Clear All</button>
                      </div>
                      {showSubstitutionIResults[exercise.id] && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"><p className="text-xs text-green-700">💡 Hint: {exercise.hint}</p></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE - SUBSTITUTION II (ALL IN ENGLISH) */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 DRILLING PRACTICE - SUBSTITUTION II</h2>
              <button onClick={() => toggleSection('substitutionII')} className="ml-4 p-2 rounded-full hover:bg-teal-600 transition">
                {sections.substitutionII ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitutionII && (
            <div className="p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-2">Substitute the underlined words:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {substitutionPracticeII.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-teal-200">
                      <p className="font-medium text-teal-700 mb-3">{exercise.original}</p>
                      <div className="space-y-3">
                        {exercise.variations.map((variation: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="text-sm text-teal-600 w-32">{variation}:</span>
                            <input type="text" value={substitutionIIAnswers[`${exercise.id}-${index}`] || ""} onChange={(e) => handleSubstitutionIIChange(`${exercise.id}-${index}`, e.target.value)} className="flex-1 p-2 border border-teal-300 rounded-md text-sm" placeholder="Type the complete sentence" />
                            {showSubstitutionIIResults[exercise.id] && substitutionIIAnswerResults[`${exercise.id}-${index}`] !== undefined && (
                              <span className={`text-sm font-medium ${substitutionIIAnswerResults[`${exercise.id}-${index}`] ? 'text-green-600' : 'text-red-600'}`}>
                                {substitutionIIAnswerResults[`${exercise.id}-${index}`] ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleSubstitutionIICheck(exercise.id, exercise.correctAnswers)} className="bg-teal-500 text-white py-1 px-3 rounded-md hover:bg-teal-600 transition text-sm">Check All</button>
                        <button onClick={() => { exercise.variations.forEach((_, i) => handleSubstitutionIIChange(`${exercise.id}-${i}`, "")); setShowSubstitutionIIResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm">Clear All</button>
                      </div>
                      {showSubstitutionIIResults[exercise.id] && <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md"><p className="text-xs text-green-700">💡 Hint: {exercise.hint}</p></div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO NEGATIVE */}
        {/* ============================================ */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❌ CHANGE INTO NEGATIVE</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-red-600 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-red-700 mb-2">{exercise.sentence}</p>
                          <input type="text" value={negativeAnswers[exercise.id] || ""} onChange={(e) => handleNegativeChange(exercise.id, e.target.value)} className="w-full p-2 border border-red-300 rounded-md" placeholder="Write the negative form" />
                          {showNegativeResults[exercise.id] && <div className="mt-2"><AnswerResult isCorrect={negativeAnswerResults[exercise.id]} correctAnswer={exercise.correctAnswer} /></div>}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleNegativeCheck(exercise.id)} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">Check</button>
                          <button onClick={() => { handleNegativeChange(exercise.id, ""); setShowNegativeResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">Clear</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO AFFIRMATIVE */}
        {/* ============================================ */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">✅ CHANGE INTO AFFIRMATIVE</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-green-600 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-green-700 mb-2">{exercise.sentence}</p>
                          <input type="text" value={affirmativeAnswers[exercise.id] || ""} onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)} className="w-full p-2 border border-green-300 rounded-md" placeholder="Write the affirmative form" />
                          {showAffirmativeResults[exercise.id] && <div className="mt-2"><AnswerResult isCorrect={affirmativeAnswerResults[exercise.id]} correctAnswer={exercise.correctAnswer} /></div>}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleAffirmativeCheck(exercise.id)} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">Check</button>
                          <button onClick={() => { handleAffirmativeChange(exercise.id, ""); setShowAffirmativeResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">Clear</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO INTERROGATIVE */}
        {/* ============================================ */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-purple-600 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="font-medium text-purple-700 mb-2">{exercise.sentence}</p>
                          <input type="text" value={interrogativeAnswers[exercise.id] || ""} onChange={(e) => handleInterrogativeChange(exercise.id, e.target.value)} className="w-full p-2 border border-purple-300 rounded-md" placeholder="Write the question form" />
                          {showInterrogativeResults[exercise.id] && <div className="mt-2"><AnswerResult isCorrect={interrogativeAnswerResults[exercise.id]} correctAnswer={exercise.correctAnswer} /></div>}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handleInterrogativeCheck(exercise.id)} className="bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition">Check</button>
                          <button onClick={() => { handleInterrogativeChange(exercise.id, ""); setShowInterrogativeResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">Clear</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* SPEAKING PRACTICE */}
        {/* ============================================ */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAKING PRACTICE</h2>
              <button onClick={() => toggleSection('speaking')} className="ml-4 p-2 rounded-full hover:bg-yellow-600 transition">
                {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speaking && (
            <div className="p-8">
              <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
                <div className="space-y-6">
                  {speakingQuestions.map((question, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-yellow-200">
                      <p className="font-medium text-yellow-700 mb-3">{question}</p>
                      <textarea value={questionAnswers[`q${index}`] || ""} onChange={(e) => handleQuestionChange(index, e.target.value)} className="w-full h-24 p-3 border border-yellow-300 rounded-md resize-none" placeholder="Write your answer here..." />
                      <div className="flex gap-3 mt-3">
                        <button onClick={() => { const utterance = new SpeechSynthesisUtterance(question); utterance.lang = 'en-US'; window.speechSynthesis.speak(utterance); }} className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">🔊 Listen Question</button>
                        {questionAnswers[`q${index}`] && <button onClick={() => { const utterance = new SpeechSynthesisUtterance(questionAnswers[`q${index}`]); utterance.lang = 'en-US'; window.speechSynthesis.speak(utterance); }} className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">🔊 Listen Answer</button>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE IN YOUR EARS */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200 rounded-2xl shadow-xl overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-wide">🎧 TUNE IN YOUR EARS</h2>
              <button onClick={() => toggleSection('tuneIn')} className="p-2 rounded-full hover:bg-white/20 transition">
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8 space-y-10">
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-bold text-indigo-700">Watch the video and answer the questions:</h3>
                <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-black/10">
                  <div className="aspect-video">
                    <iframe src="https://www.youtube.com/embed/eQbtmufQT0Y?list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=18" title="English Learning Tips" allowFullScreen className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Vocabulary Section */}
              <div className="bg-white/70 backdrop-blur-md border border-indigo-200 rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">📖 Key Vocabulary from Video</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {videoVocabulary.map((word, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition flex items-center gap-2 text-sm">
                      <span className="font-medium text-indigo-700">{word.english}</span>
                      <span className="text-indigo-400">→</span>
                      <span className="text-indigo-600">{word.portuguese}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-200 shadow-sm hover:shadow-md transition">
                    <h4 className="text-lg font-semibold text-indigo-700 mb-3">
                      {question.question}
                      {question.isPersonal && <span className="ml-2 text-sm text-indigo-500">(Personal)</span>}
                    </h4>
                    <textarea value={videoAnswers[question.id] || ""} onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)} placeholder="Write your answer..." className="w-full h-24 p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none" />
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => { if (videoAnswers[question.id]?.trim()) { const utterance = new SpeechSynthesisUtterance(videoAnswers[question.id]); utterance.lang = 'en-US'; window.speechSynthesis.speak(utterance); } else { alert('Please write your answer first.'); } }} className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-xl transition">Listen to your answer</button>
                      <button onClick={() => handleVideoAnswerChange(question.id, "")} className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl transition">Clear</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SAVE PROGRESS SECTION */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-[30px] p-8 mb-10">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">💾 Save Your Progress</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition flex items-center justify-center gap-2"><Save size={20} /> Save All Answers</button>
            <button onClick={loadSavedAnswers} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition">Load Saved Answers</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition">Clear All Answers</button>
          </div>
          {savedAnswers.timestamp && <div className="mt-6 text-center"><p className="text-gray-600">Last saved: {new Date(savedAnswers.timestamp).toLocaleString()}</p></div>}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">&larr; Back to Lessons</button>
          <button onClick={() => router.push("/cursos/lesson45")} className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">Next Lesson &rarr;</button>
        </div>
      </div>
    </div>
  );
}