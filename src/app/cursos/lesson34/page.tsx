"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { 
  Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, 
  X, Check, XCircle, Download, MessageCircle, Coffee, 
  BookOpen, Briefcase, Utensils, Home, Tv, Smartphone, Users,
  Heart, Sun, Car, Music, Headphones, Target, TrendingUp, Clock,
  AlertCircle, Zap
} from "lucide-react";

// ==============================
// CONFIGURAÇÃO DA LIÇÃO
// ==============================
const LESSON_NUMBER = 34;
const LESSON_TITLE = "Tune Your Ears";
const LESSON_SUBTITLE = "Slow Listening & Shadowing Practice";
const LESSON_THEME_COLOR = "#0ea5e9"; // Sky-500
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
const LISTENING_IMAGE = "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

// ==============================
// KEY VOCABULARY FROM THE VIDEO
// ==============================
const keyVocabulary = [
  { english: "to maximize", portuguese: "maximizar", icon: Zap },
  { english: "myths", portuguese: "mitos", icon: AlertCircle },
  { english: "step by step", portuguese: "passo a passo", icon: TrendingUp },
  { english: "shadowing", portuguese: "técnica onde você repete após o professor para praticar estrutura e pronúncia", icon: Headphones },
  { english: "you need time", portuguese: "você precisa de tempo", icon: Clock },
  { english: "to understand", portuguese: "entender", icon: BookOpen },
  { english: "to grow", portuguese: "crescer", icon: TrendingUp },
  { english: "just keep going", portuguese: "apenas continue indo", icon: Target },
  { english: "to write down", portuguese: "escrever, anotar", icon: BookOpen },
  { english: "fuel", portuguese: "combustível", icon: Zap },
  { english: "the perfect time", portuguese: "a hora certa", icon: Clock },
  { english: "mood", portuguese: "humor, temperamento", icon: Sun },
  { english: "to set a timer", portuguese: "colocar um temporizador", icon: Clock }
];

// ==============================
// DADOS DA LIÇÃO - PRONÚNCIA (COM HE/SHE/IT)
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
  { word: "he", phrase: "He works every day.", example: "He works at the hospital.", audio: "/audios/lesson34/he.mp3", icon: Users },
  { word: "she", phrase: "She likes music.", example: "She likes classical music.", audio: "/audios/lesson34/she.mp3", icon: Music },
  { word: "it", phrase: "It is sunny today.", example: "It is sunny and hot.", audio: "/audios/lesson34/it.mp3", icon: Sun },
  { word: "car", phrase: "He drives a car.", example: "He drives a red car.", audio: "/audios/lesson34/car.mp3", icon: Car },
  { word: "loves", phrase: "She loves coffee.", example: "She loves coffee in the morning.", audio: "/audios/lesson34/loves.mp3", icon: Heart },
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
      { word: "every day", options: ["every day", "during the week", "all day"] },
      { word: "She", options: ["She", "He"] }
    ],
    currentText: "She works here every day."
  },
  {
    id: 4,
    english: "She wants to know more about this subject.",
    portuguese: "Ela quer saber mais sobre este assunto.",
    substitutions: [
      { word: "know", options: ["know", "learn", "understand"] },
      { word: "She", options: ["She", "He", "It"] }
    ],
    currentText: "She wants to know more about this subject."
  },
  {
    id: 5,
    english: "He likes to talk about religion.",
    portuguese: "Ele gosta de falar sobre religião.",
    substitutions: [
      { word: "religion", options: ["religion", "music", "business"] },
      { word: "He", options: ["He", "She"] }
    ],
    currentText: "He likes to talk about religion."
  },
  {
    id: 6,
    english: "It is a good idea.",
    portuguese: "É uma boa ideia.",
    substitutions: [
      { word: "good", options: ["good", "great", "excellent"] },
      { word: "It", options: ["It", "This", "That"] }
    ],
    currentText: "It is a good idea."
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
      { word: "politics", options: ["politics", "business", "movies"] },
      { word: "He", options: ["He", "She"] }
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
  },
  {
    id: 6,
    english: "She loves to read books.",
    portuguese: "Ela ama ler livros.",
    substitutions: [
      { word: "She", options: ["She", "He"] },
      { word: "books", options: ["books", "magazines", "novels"] }
    ],
    currentText: "She loves to read books."
  },
  {
    id: 7,
    english: "It rains a lot here.",
    portuguese: "Chove muito aqui.",
    substitutions: [
      { word: "rains", options: ["rains", "snows", "is sunny"] },
      { word: "here", options: ["here", "in winter", "in spring"] }
    ],
    currentText: "It rains a lot here."
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
  },
  {
    id: 4,
    english: "It doesn't work properly.",
    portuguese: "Isso não funciona corretamente.",
    affirmative: "It works properly.",
    substitutions: [
      { word: "properly", options: ["properly", "well", "fast"] }
    ],
    currentText: "It doesn't work properly."
  },
  {
    id: 5,
    english: "She doesn't have a car.",
    portuguese: "Ela não tem carro.",
    affirmative: "She has a car.",
    substitutions: [
      { word: "a car", options: ["a car", "a bike", "a motorcycle"] }
    ],
    currentText: "She doesn't have a car."
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
  { id: "k", question: "Does he like to play soccer?", icon: Users },
  { id: "l", question: "Does she enjoy cooking?", icon: Utensils },
  { id: "m", question: "Is it going to rain today?", icon: Sun },
];

// ==============================
// DADOS DA LIÇÃO - TUNE YOUR EARS (VÍDEO ATUALIZADO COM AS PERGUNTAS SOLICITADAS)
// ==============================
const tuneYourEarsVideo = {
  title: "TUNE IN YOUR EARS - English Listening Practice | Slow Listening & Shadowing",
  youtubeId: "uo-Ds9H_mNs",
  description: "Watch this video to practice slow listening and shadowing. Pay attention to the key vocabulary and answer the reflection questions below.",
  shadowingExplanation: "Shadowing is a technique where you repeat after your teacher to practice structure and pronunciation. Listen, pause, and repeat what you hear to improve your fluency and accent.",
  questions: [
    {
      id: 1,
      question: "How can you use your mistakes as your fuel?",
      correctAnswer: "By learning from them and using them as motivation to improve.",
      reflectionType: "personal"
    },
    {
      id: 2,
      question: "We know we can't wait for the perfect time, but how do you know you're good enough at English?",
      correctAnswer: "When you can communicate and understand without needing to translate everything.",
      reflectionType: "personal"
    },
    {
      id: 3,
      question: "How can you use a timer to help you with English?",
      correctAnswer: "By setting a timer to study for short, focused periods (like 15-25 minutes) every day.",
      reflectionType: "personal"
    },
    {
      id: 4,
      question: "Do you think your progress is slow? Why or why not?",
      correctAnswer: "This is a personal reflection question. Be honest about your learning journey.",
      reflectionType: "personal"
    },
    {
      id: 5,
      question: "Do you think progress is only slow in life, or when it's real progress it's fast?",
      correctAnswer: "Real progress can feel slow because it's steady and consistent. Fast progress often doesn't last.",
      reflectionType: "personal"
    },
    {
      id: 6,
      question: "Do you see learning a language as a journey or a long walk? Explain.",
      correctAnswer: "Both are good metaphors. A journey suggests destinations and goals; a long walk suggests daily effort and patience.",
      reflectionType: "personal"
    },
    {
      id: 7,
      question: "What's your biggest goal with English?",
      correctAnswer: "This is personal. It could be traveling, getting a job, making friends, or understanding movies.",
      reflectionType: "personal"
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
  isReflection?: boolean;
}

const AnswerResult = ({ isCorrect, correctAnswer, isReflection = false }: AnswerResultProps) => {
  return (
    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300'} border-2`}>
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <Check className="text-green-600 flex-shrink-0" size={24} />
        ) : (
          <div className="text-blue-600 flex-shrink-0">💡</div>
        )}
        <div>
          <p className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
            {isCorrect ? 'Great answer!' : 'Reflection Note'}
          </p>
          {!isCorrect && !isReflection && (
            <p className="text-gray-700">
              <span className="font-medium">Suggested answer:</span> {correctAnswer}
            </p>
          )}
          {isReflection && (
            <p className="text-gray-700 text-sm">
              This is a personal reflection. Think about your own experience.
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
  const [lastReplaced, setLastReplaced] = useState<{ oldWord: string, newWord: string } | null>(null);

  const handleSubstitution = (oldWord: string, newWord: string) => {
    let newText = currentText;
    
    if (oldWord === "a car" && (newWord === "a bike" || newWord === "a motorcycle")) {
      newText = newText.replace(/\ba car\b/i, newWord);
    }
    else if (oldWord === "a car" && newWord === "a car") {
      // Do nothing
    }
    else if (oldWord === "a car") {
      const vowelSounds = ['a', 'e', 'i', 'o', 'u'];
      const firstLetter = newWord.toLowerCase().charAt(0);
      const article = vowelSounds.includes(firstLetter) ? 'an' : 'a';
      newText = newText.replace(/\ba car\b/i, `${article} ${newWord.replace(/^(a|an)\s+/i, '')}`);
    }
    else if (oldWord === "on TV" && (newWord === "on your cell phone" || newWord === "on your tablet")) {
      newText = newText.replace(/\bon TV\b/i, newWord);
    }
    else if (oldWord === "your" && (newWord === "his" || newWord === "her")) {
      newText = newText.replace(/\byour\b/i, newWord);
    }
    else if (["He", "She", "It", "This", "That"].includes(oldWord) && ["He", "She", "It", "This", "That"].includes(newWord)) {
      const regex = new RegExp(`\\b${oldWord}\\b`, 'gi');
      newText = newText.replace(regex, (match: string) => {
        if (match === match.toUpperCase()) return newWord.toUpperCase();
        if (match === match.toLowerCase()) return newWord.toLowerCase();
        if (match.charAt(0) === match.charAt(0).toUpperCase()) {
          return newWord.charAt(0).toUpperCase() + newWord.slice(1).toLowerCase();
        }
        return newWord;
      });
    }
    else if (oldWord === "know" && (newWord === "learn" || newWord === "understand")) {
      newText = newText.replace(/\bknow\b/i, newWord);
    }
    else if (oldWord === "religion" && (newWord === "music" || newWord === "business")) {
      newText = newText.replace(/\breligion\b/i, newWord);
    }
    else if (oldWord === "good" && (newWord === "great" || newWord === "excellent")) {
      newText = newText.replace(/\bgood\b/i, newWord);
    }
    else if (oldWord === "books" && (newWord === "magazines" || newWord === "novels")) {
      newText = newText.replace(/\bbooks\b/i, newWord);
    }
    else if (oldWord === "rains" && (newWord === "snows" || newWord === "is sunny")) {
      newText = newText.replace(/\brains\b/i, newWord);
    }
    else if (oldWord === "here" && (newWord === "in winter" || newWord === "in spring")) {
      newText = newText.replace(/\bhere\b/i, newWord);
    }
    else if (oldWord === "properly" && (newWord === "well" || newWord === "fast")) {
      newText = newText.replace(/\bproperly\b/i, newWord);
    }
    else if (oldWord === "on weekends" && (newWord === "on Mondays" || newWord === "on Fridays")) {
      newText = newText.replace(/\bon weekends\b/i, newWord);
    }
    else if (oldWord === "English" && (newWord === "Spanish" || newWord === "French")) {
      newText = newText.replace(/\bEnglish\b/i, newWord);
    }
    else if (oldWord === "coffee" && (newWord === "tea" || newWord === "juice")) {
      newText = newText.replace(/\bcoffee\b/i, newWord);
    }
    else if (oldWord === "every day" && (newWord === "during the week" || newWord === "all day")) {
      newText = newText.replace(/\bevery day\b/i, newWord);
    }
    else if (oldWord === "now" && newWord === "in a few minutes") {
      newText = newText.replace(/\bnow\b/i, newWord);
    }
    else if (oldWord === "next week" && (newWord === "next month" || newWord === "next year")) {
      newText = newText.replace(/\bnext week\b/i, newWord);
    }
    else if (oldWord === "The test" && (newWord === "The movie" || newWord === "The meeting")) {
      newText = newText.replace(/\bThe test\b/i, newWord);
    }
    else if (oldWord === "it" && (newWord === "this problem" || newWord === "this subject")) {
      newText = newText.replace(/\bit\b/gi, newWord);
    }
    else if (oldWord === "fashion" && (newWord === "sports" || newWord === "music")) {
      newText = newText.replace(/\bfashion\b/i, newWord);
    }
    else if (oldWord === "politics" && (newWord === "business" || newWord === "movies")) {
      newText = newText.replace(/\bpolitics\b/i, newWord);
    }
    else {
      const regex = new RegExp(`\\b${oldWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      newText = newText.replace(regex, newWord);
    }

    setCurrentText(newText);
    setLastReplaced({ oldWord, newWord });
    onUpdate(exercise.id, newText);
  };

  const getCurrentWord = (subOption: any) => {
    const words = currentText.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[!?.,;:]$/, '');
      for (const opt of subOption.options) {
        if (cleanWord.toLowerCase() === opt.toLowerCase()) {
          return opt;
        }
      }
    }
    for (const opt of subOption.options) {
      if (currentText.toLowerCase().includes(opt.toLowerCase())) {
        return opt;
      }
    }
    return subOption.options[0];
  };

  const resetToOriginal = () => {
    setCurrentText(exercise.english);
    onUpdate(exercise.id, exercise.english);
    setLastReplaced(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"} {showPortuguese ? "Português" : "English"}
        </button>
        <button
          onClick={resetToOriginal}
          className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition flex items-center gap-1"
          title="Reset to original sentence"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

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
      
      <div className="mt-4 text-xs text-gray-400 border-t pt-2">
        💡 Tip: Click on any option to replace the highlighted word in the sentence.
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
export default function Lesson34TuneYourEars() {
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    pronunciation: true,
    substitution1: true,
    substitution2: true,
    affirmative: true,
    questions: true,
    tuneYourEars: true
  });

  const [substitution1Texts, setSubstitution1Texts] = useState<Record<number, string>>({});
  const [substitution2Texts, setSubstitution2Texts] = useState<Record<number, string>>({});
  const [affirmativeTexts, setAffirmativeTexts] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<string, boolean>>({});

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

  const checkVideoAnswer = (id: number, userAnswer: string, correctAnswer: string, isReflection: boolean = false) => {
    if (isReflection) {
      setAnswerCorrectness(prev => ({ ...prev, [`video-${id}`]: true }));
      setShowResults(prev => ({ ...prev, [`video-${id}`]: true }));
      return true;
    }
    
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    
    const isCorrect = normalizedUser === normalizedCorrect || 
      (normalizedUser.length > 10 && normalizedCorrect.includes(normalizedUser.substring(0, 20)));
    
    setAnswerCorrectness(prev => ({ ...prev, [`video-${id}`]: isCorrect }));
    setShowResults(prev => ({ ...prev, [`video-${id}`]: true }));
    
    return isCorrect;
  };

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

  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here. For now, your answers are saved in your browser.");
  };

  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE} - ${LESSON_SUBTITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers? This action cannot be undone.")) {
      setSubstitution1Texts({});
      setSubstitution2Texts({});
      setAffirmativeTexts({});
      setQuestionAnswers({});
      setVideoAnswers({});
      setShowResults({});
      setAnswerCorrectness({});
      alert("All answers have been cleared.");
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-6 bg-cover bg-center bg-fixed relative"
         style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      
      <div className="relative max-w-6xl mx-auto bg-white bg-opacity-95 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        {/* CABEÇALHO DA LIÇÃO */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: `${LESSON_THEME_COLOR}20` }}>
            <Headphones size={48} style={{ color: LESSON_THEME_COLOR }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER}
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800">{LESSON_TITLE}</h2>
          <h3 className="text-xl text-gray-600 mb-4">{LESSON_SUBTITLE}</h3>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practice slow listening, shadowing technique, and reflect on your English learning journey.
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
              <div className="mb-10 rounded-2xl overflow-hidden shadow-xl relative">
                <div className="relative w-full h-72 md:h-96">
                  <Image
                    src={LISTENING_IMAGE}
                    alt="Listening Practice"
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
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Coffee className="text-amber-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><BookOpen className="text-blue-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Utensils className="text-red-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Briefcase className="text-purple-600" size={20} /></span>
                  </div>
                </div>
              </div>
              
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
                Transform these negative sentences into affirmative sentences by replacing words.
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

        {/* SEÇÃO 6: TUNE IN YOUR EARS */}
        <div className="mb-16 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🎧 TUNE IN YOUR EARS
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
                
                {/* SHADOWING EXPLANATION */}
                <div className="bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6 mb-8 text-left">
                  <h4 className="text-lg font-bold text-cyan-800 mb-2 flex items-center gap-2">
                    <Headphones size={20} /> What is Shadowing?
                  </h4>
                  <p className="text-cyan-700">{tuneYourEarsVideo.shadowingExplanation}</p>
                  <p className="text-cyan-600 text-sm mt-2 italic">
                    How to practice: Listen to a short phrase → Pause the video → Repeat exactly what you heard → Focus on rhythm and intonation
                  </p>
                </div>
                
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

              {/* KEY VOCABULARY FROM THE VIDEO - AGORA DENTRO DO TUNE IN YOUR EARS */}
              <div className="mb-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <BookOpen size={20} /> 📖 Key Vocabulary from the Video:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {keyVocabulary.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={16} style={{ color: LESSON_THEME_COLOR }} />}
                          <span className="font-medium text-cyan-700">{item.english}</span>
                        </div>
                        <span className="text-cyan-600 text-sm">{item.portuguese}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* REFLECTION QUESTIONS */}
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-center text-cyan-700">Reflection Questions</h3>
                <p className="text-center text-gray-600 -mt-4">
                  Answer these questions honestly to reflect on your English learning journey.
                </p>
                
                {tuneYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md"
                       style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: LESSON_THEME_COLOR }}>
                      Question {q.id}: {q.question}
                    </h4>

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your reflection here... (There is no wrong answer - be honest with yourself)"
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
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer, q.reflectionType === "personal")}
                        className="text-white px-6 py-2 rounded-lg transition font-medium hover:opacity-90"
                        style={{ backgroundColor: LESSON_THEME_COLOR }}
                      >
                        Check / Reflect
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
                          isReflection={q.reflectionType === "personal"}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <Headphones size={20} /> 🎯 Listening & Shadowing Tips:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-cyan-700">
                  <li>Listen first without looking at the questions</li>
                  <li>Practice shadowing: pause after each sentence and repeat</li>
                  <li>Use your mistakes as fuel - learn from them</li>
                  <li>Set a timer for daily practice (15-25 minutes is enough)</li>
                  <li>Remember: progress happens step by step, not overnight</li>
                  <li>Write down new vocabulary and review it regularly</li>
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
              onClick={clearAllAnswers}
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
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} - {LESSON_SUBTITLE} • Interactive English Practice • All answers are saved in your browser</p>
          <p className="mt-1">🎧 Remember: Tune your ears, practice shadowing, and keep going step by step!</p>
        </div>
      </div>
    </div>
  );
}