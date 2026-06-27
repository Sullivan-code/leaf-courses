"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, RotateCcw, Volume2, ChevronDown, ChevronUp,
  Check, X, Download, MessageCircle, Headphones,
  Stethoscope, Pill, Hospital, Thermometer, Activity, Heart,
  User, Users, Calendar, Clock, AlertCircle, CheckCircle, Youtube,
  BookOpen, HelpCircle, GripVertical
} from "lucide-react";

// ==============================
// LESSON CONFIGURATION
// ==============================
const LESSON_NUMBER = 38;
const LESSON_TITLE = "Health & Daily Situations";
const LESSON_SUBTITLE = "Listening, Drilling & Fluency Practice";
const LESSON_THEME_COLOR = "#10b981";
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1600&q=80";

// ==============================
// LISTEN AND NUMBER IMAGES
// ==============================
const listenAndNumberImages = [
  {
    id: "A",
    description: "Couple on the sofa watching TV",
    imageUrl: "/images/L38IMGA.png",
    correctNumber: 4,
    situation: "People feeling well / relaxed"
  },
  {
    id: "B",
    description: "Woman talking to a doctor",
    imageUrl: "/images/L38IMGB.png",
    correctNumber: 2,
    situation: "Medical appointment"
  },
  {
    id: "C",
    description: "Woman sneezing with a tissue",
    imageUrl: "/images/L38IMGC.png",
    correctNumber: 6,
    situation: "Cold / flu"
  },
  {
    id: "D",
    description: "Patient at the hospital",
    imageUrl: "/images/L38IMGD.png",
    correctNumber: 3,
    situation: "Hospital care"
  },
  {
    id: "E",
    description: "Woman taking a pill",
    imageUrl: "/images/L38IMGE.png",
    correctNumber: 1,
    situation: "Taking medicine"
  },
  {
    id: "F",
    description: "Person lying with sleep mask",
    imageUrl: "/images/L38IMGF.png",
    correctNumber: 5,
    situation: "Sick / resting"
  }
];

const AUDIO_SRC = "https://github.com/Sullivan-code/english-audios/raw/main/l38-listenandnumber.mp3";
const AUDIO_START_OFFSET = 10;

// ==============================
// DRILLING PRACTICE I - SUBSTITUTION
// ==============================
const drillingPracticeI = [
  {
    id: 1,
    original: "Eric takes medicine for his headache.",
    portuguese: "Eric toma remédio para dor de cabeça.",
    substitutions: [
      { word: "Eric", options: ["Eric", "He", "Bruno"] }
    ],
    currentText: "She takes medicine for her headache."
  },
  {
    id: 2,
    original: "I don't want painkillers, I prefer to drink tea.",
    portuguese: "Eu não quero analgésicos, eu prefiro beber chá.",
    substitutions: [
      { word: "drink tea", options: ["drink tea", "go to sleep", "take a shower"] }
    ],
    currentText: "I don't want painkillers, I prefer to drink tea."
  },
  {
    id: 3,
    original: "We prefer to go to the doctor tomorrow.",
    portuguese: "Nós preferimos ir ao médico amanhã.",
    substitutions: [
      { word: "tomorrow", options: ["tomorrow", "today", "this morning"] }
    ],
    currentText: "We prefer to go to the doctor tomorrow."
  },
  {
    id: 4,
    original: "Do you feel better now?",
    portuguese: "Você se sente melhor agora?",
    substitutions: [
      { word: "You", options: ["You", "He", "She"] }
    ],
    currentText: "Do you feel better now?"
  },
  {
    id: 5,
    original: "I was a teacher.",
    portuguese: "Eu era professor.",
    substitutions: [
      { word: "teacher", options: ["teacher", "dentist", "doctor"] }
    ],
    currentText: "I was a teacher."
  }
];

// ==============================
// NEGATIVE PRACTICE
// ==============================
const negativePractice = [
  { id: 1, english: "I take these pills in the morning.", portuguese: "Eu tomo estes comprimidos pela manhã." },
  { id: 2, english: "He takes medicine for everything.", portuguese: "Ele toma remédio para tudo." },
  { id: 3, english: "They have to go to the dentist.", portuguese: "Eles têm que ir ao dentista." },
  { id: 4, english: "You have a fever.", portuguese: "Você tem febre." },
  { id: 5, english: "I have a toothache.", portuguese: "Eu tenho dor de dente." },
  { id: 6, english: "She needs painkillers.", portuguese: "Ela precisa de analgésicos." }
];

// ==============================
// DRILLING PRACTICE II - SUBSTITUTION
// ==============================
const drillingPracticeII = [
  {
    id: 1,
    original: "I'll need to talk to the doctor.",
    portuguese: "Eu precisarei falar com o médico.",
    substitutions: [
      { word: "doctor", options: ["doctor", "nurse", "teacher"] }
    ],
    currentText: "I'll need to talk to the doctor."
  },
  {
    id: 2,
    original: "She is a great nurse.",
    portuguese: "Ela é uma ótima enfermeira.",
    substitutions: [
      { word: "great", options: ["great", "funny", "kind"] }
    ],
    currentText: "She is a great nurse."
  },
  {
    id: 3,
    original: "Did you have a cold?",
    portuguese: "Você estava com resfriado?",
    substitutions: [
      { word: "a cold", options: ["a cold", "a sore throat", "a toothache"] }
    ],
    currentText: "Did you have a cold?"
  },
  {
    id: 4,
    original: "These are my cousins.",
    portuguese: "Estes são meus primos.",
    substitutions: [
      { word: "cousins", options: ["cousins", "neighbors", "friends"] }
    ],
    currentText: "These are my cousins."
  },
  {
    id: 5,
    original: "They are at the beach together.",
    portuguese: "Eles estão na praia juntos.",
    substitutions: [
      { word: "at the beach", options: ["at the beach", "in the park", "at church"] }
    ],
    currentText: "They are at the beach together."
  }
];

// ==============================
// AFFIRMATIVE PRACTICE
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
    { id: "a", sentence: "I want to visit that city.", portuguese: "Eu quero visitar aquela cidade." },
    { id: "b", sentence: "They need to take this pill.", portuguese: "Eles precisam tomar este comprimido." },
    { id: "c", sentence: "I want to read that book.", portuguese: "Eu quero ler aquele livro." },
    { id: "d", sentence: "She wants to buy this backpack.", portuguese: "Ela quer comprar esta mochila." },
    { id: "e", sentence: "We don't like to talk about that subject.", portuguese: "Nós não gostamos de falar sobre aquele assunto." },
    { id: "f", sentence: "Do they have a meeting to talk about this project?", portuguese: "Eles têm uma reunião para falar sobre este projeto?" }
  ],
  partB: [
    { id: "a", sentence: "This is my teacher.", portuguese: "Esta é minha professora." },
    { id: "b", sentence: "That is my classmate.", portuguese: "Aquele é meu colega de classe." },
    { id: "c", sentence: "This is her friend.", portuguese: "Esta é amiga dela." },
    { id: "d", sentence: "That is his cell phone.", portuguese: "Aquele é o celular dele." },
    { id: "e", sentence: "This is my gift.", portuguese: "Este é meu presente." },
    { id: "f", sentence: "That is her backpack.", portuguese: "Aquela é a mochila dela." }
  ]
};

// ==============================
// TUNE IN YOUR EARS
// ==============================
const tuneInYourEars = {
  videoUrl: "https://www.youtube.com/watch?v=0-GHVzKNCek&t=66s",
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
// WRAP UP - PLURAL RULE
// ==============================
const wrapUpContent = {
  rule: "A regra do plural em palavras como 'classes' aplica-se a substantivos e adjetivos terminados em -s, -z, -x, -sch ou -ch. Nesses casos, acrescenta-se -es ao final para formar o plural.",
  examples: [
    { singular: "class", plural: "classes" },
    { singular: "box", plural: "boxes" },
    { singular: "buzz", plural: "buzzes" },
    { singular: "church", plural: "churches" },
    { singular: "wish", plural: "wishes" },
    { singular: "bus", plural: "buses" },
    { singular: "quiz", plural: "quizzes" },
    { singular: "tax", plural: "taxes" }
  ]
};

// ==============================
// COMPONENT: CENTRALIZED AUDIO PLAYER
// ==============================
interface AudioPlayerProps {
  audioSrc: string;
  startOffset?: number;
}

const CentralizedAudioPlayer = ({ audioSrc, startOffset = 0 }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(audioSrc);
      audioRef.current = audio;

      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
        if (startOffset > 0 && !hasStarted && audio.duration > startOffset) {
          audio.currentTime = startOffset;
          setProgress((startOffset / audio.duration) * 100);
          setHasStarted(true);
        }
      };

      const handleTimeUpdate = () => {
        if (!isDragging) {
          setProgress((audio.currentTime / audio.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setHasStarted(false);
      };

      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
        audio.src = '';
      };
    }
  }, [audioSrc, startOffset, hasStarted]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.currentTime === audioRef.current.duration) {
        audioRef.current.currentTime = startOffset > 0 ? Math.min(startOffset, audioRef.current.duration) : 0;
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
      }
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const newTime = x * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(x * 100);
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleDragMove = (e: MouseEvent) => {
    if (!isDragging || !audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    const newTime = x * audioRef.current.duration;
    
    audioRef.current.currentTime = newTime;
    setProgress(x * 100);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border-2 border-emerald-200 max-w-md mx-auto">
      <div className="flex items-center gap-5">
        <button
          onClick={togglePlayPause}
          className="p-4 text-white rounded-full hover:opacity-85 transition-all shadow-md flex-shrink-0"
          style={{ backgroundColor: LESSON_THEME_COLOR }}
        >
          {isPlaying ? <Pause size={28} /> : <Play size={28} />}
        </button>

        <div className="flex-1">
          <div 
            ref={progressRef}
            className="relative h-3 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleProgressClick}
          >
            <div
              className="absolute h-full rounded-full transition-all duration-100"
              style={{ 
                width: `${progress}%`,
                backgroundColor: LESSON_THEME_COLOR
              }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 shadow-md cursor-grab active:cursor-grabbing"
              style={{ 
                left: `calc(${progress}% - 10px)`,
                borderColor: LESSON_THEME_COLOR,
                display: progress > 0 ? 'block' : 'none'
              }}
              onMouseDown={handleDragStart}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500 font-mono">
              {formatTime(audioRef.current?.currentTime || 0)}
            </span>
            <span className="text-sm text-gray-500 font-mono">
              {formatTime(duration)}
            </span>
          </div>
          {startOffset > 0 && (
            <div className="text-sm text-emerald-600 mt-1 text-center font-medium">
              ⏱ Inicia em {startOffset}s
            </div>
          )}
        </div>
      </div>
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
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex justify-between items-start mb-4">
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-sm px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷 Show English" : "🇺🇸 Show Portuguese"}
        </button>
        <button
          onClick={resetToOriginal}
          className="text-sm px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition flex items-center gap-1"
        >
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div className="mb-5">
        <p className="text-xl font-bold text-gray-800 mb-2">
          {currentText}
        </p>
        {showPortuguese && (
          <p className="text-lg text-gray-600 italic border-l-4 pl-3" 
             style={{ borderColor: LESSON_THEME_COLOR }}>
            {exercise.portuguese}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {exercise.substitutions.map((sub: any, idx: number) => {
          const currentWord = getCurrentWord(sub);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Replace "{currentWord}":</span>
              <div className="flex flex-wrap gap-2">
                {sub.options.map((option: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSubstitution(currentWord, option)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
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
    if (transformType === 'negative') {
      const correctAnswers: Record<number, string> = {
        1: "I don't take these pills in the morning.",
        2: "He doesn't take medicine for everything.",
        3: "They don't have to go to the dentist.",
        4: "You don't have a fever.",
        5: "I don't have a toothache.",
        6: "She doesn't need painkillers."
      };
      return correctAnswers[item.id] || `don't/doesn't ${item.english.toLowerCase()}`;
    }
    if (transformType === 'affirmative') return item.affirmative;
    return item.interrogative;
  };

  const getInstruction = () => {
    if (transformType === 'negative') return "Transform into negative using 'do not / don't' or 'does not / doesn't':";
    if (transformType === 'affirmative') return "Transform into affirmative:";
    return "Transform into interrogative (question form):";
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 shadow-md" style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <h3 className="text-2xl font-bold mb-5" style={{ color: LESSON_THEME_COLOR }}>{title}</h3>
      <p className="text-gray-600 mb-6 italic text-base">{getInstruction()}</p>
      
      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="border-b pb-5 last:border-b-0">
            <p className="text-lg font-medium text-gray-800 mb-2">
              {getOriginalText(item)}
            </p>
            <p className="text-base text-gray-500 mb-3 italic">
              🇧🇷 {item.portuguese}
            </p>
            <textarea
              value={answers[item.id] || ""}
              onChange={(e) => onAnswerChange(item.id, e.target.value)}
              placeholder="Type your transformed sentence here..."
              className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:outline-none resize-none text-base"
              style={{ borderColor: `${LESSON_THEME_COLOR}30` }}
              rows={2}
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => onCheck(item.id, answers[item.id] || "", getCorrectAnswer(item))}
                className="text-white px-5 py-2 rounded-lg transition font-medium text-base hover:opacity-90"
                style={{ backgroundColor: LESSON_THEME_COLOR }}
              >
                Check Answer
              </button>
            </div>
            {showResults[item.id] && (
              <div className={`mt-4 p-4 rounded-lg ${correctness[item.id] ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'} border`}>
                <div className="flex items-start gap-3">
                  {correctness[item.id] ? (
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                  ) : (
                    <X className="text-red-600 flex-shrink-0" size={20} />
                  )}
                  <div>
                    <p className={`font-medium text-base ${correctness[item.id] ? 'text-green-700' : 'text-red-700'}`}>
                      {correctness[item.id] ? 'Correct!' : 'Not quite right.'}
                    </p>
                    {!correctness[item.id] && (
                      <div>
                        <p className="text-gray-700 text-sm">
                          <span className="font-medium">Suggested answer:</span> {getCorrectAnswer(item)}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          <span className="font-medium">Also accepted:</span> {getCorrectAnswer(item).replace("don't", "do not").replace("doesn't", "does not")}
                        </p>
                      </div>
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
    <div className="bg-white p-5 rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <div className="absolute -top-10 -right-10 w-20 h-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
           style={{ backgroundColor: LESSON_THEME_COLOR }} />
      
      <div className="flex justify-between items-start mb-2 relative">
        <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: `${LESSON_THEME_COLOR}20`, color: LESSON_THEME_COLOR }}>
          {index + 1}
        </span>
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"}
        </button>
      </div>
      
      <div className="relative">
        <p className="text-lg font-medium text-gray-800 mb-2 leading-relaxed">
          {item.sentence}
        </p>
        {showPortuguese && (
          <p className="text-base text-gray-600 italic mt-1 border-l-4 pl-3" style={{ borderColor: LESSON_THEME_COLOR }}>
            {item.portuguese}
          </p>
        )}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Volume2 size={16} className="text-gray-400" />
        <span className="text-sm text-gray-400">Click play to listen</span>
      </div>
    </div>
  );
};

// ==============================
// COMPONENT: FLUENCY DEMONSTRATIVE EXPLANATION
// ==============================
const FluencyDemonstrativeExplanation = () => {
  return (
    <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-6 border-2 border-cyan-200 shadow-inner">
      <h4 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
        <BookOpen size={20} /> Understanding <span className="text-emerald-600">This</span> & <span className="text-orange-500">That</span>
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-cyan-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👆</span>
            <h5 className="font-bold text-cyan-700">THIS / THESE</h5>
            <span className="text-sm bg-cyan-100 text-cyan-700 px-3 py-0.5 rounded-full">Near</span>
          </div>
          <p className="text-base text-gray-600 mb-2">Use for things <strong>close</strong> to the speaker:</p>
          <ul className="space-y-1 text-base">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">•</span>
              <span><span className="font-bold text-emerald-600">This</span> is my book. (I'm holding it)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">•</span>
              <span><span className="font-bold text-emerald-600">These</span> are my keys. (They're in my hand)</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">👉</span>
            <h5 className="font-bold text-orange-600">THAT / THOSE</h5>
            <span className="text-sm bg-orange-100 text-orange-700 px-3 py-0.5 rounded-full">Far</span>
          </div>
          <p className="text-base text-gray-600 mb-2">Use for things <strong>far</strong> from the speaker:</p>
          <ul className="space-y-1 text-base">
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              <span><span className="font-bold text-orange-500">That</span> is my car. (It's across the street)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-orange-500">•</span>
              <span><span className="font-bold text-orange-500">Those</span> are my neighbors. (They're far away)</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-5 p-4 bg-cyan-100 rounded-lg border border-cyan-300">
        <p className="text-cyan-800 text-base flex items-start gap-2">
          <span className="text-lg">💡</span>
          <span><strong>Memory trick:</strong> <span className="text-emerald-600 font-bold">This/These</span> have a <span className="text-emerald-600">'t'</span> for <span className="text-emerald-600">"touch"</span> (near). 
          <span className="text-orange-500 font-bold ml-2">That/Those</span> have a <span className="text-orange-500">'t'</span> for <span className="text-orange-500">"there"</span> (far).</span>
        </p>
      </div>
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
    tuneIn: true,
    wrapUp: true
  });

  const [userNumbers, setUserNumbers] = useState<Record<string, string>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  const [showListenAnswers, setShowListenAnswers] = useState(false);

  const [drilling1Texts, setDrilling1Texts] = useState<Record<number, string>>({});
  const [drilling2Texts, setDrilling2Texts] = useState<Record<number, string>>({});
  
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
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    
    const fullFormCorrect = correctAnswer.replace("don't", "do not").replace("doesn't", "does not");
    const normalizedFullCorrect = fullFormCorrect.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    
    const isCorrect = normalizedUser === normalizedCorrect || normalizedUser === normalizedFullCorrect;
    setNegativeResults(prev => ({ ...prev, [id]: isCorrect }));
    setNegativeShow(prev => ({ ...prev, [id]: true }));
  };

  const checkAffirmative = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    const isCorrect = normalizedUser === normalizedCorrect;
    setAffirmativeResults(prev => ({ ...prev, [id]: isCorrect }));
    setAffirmativeShow(prev => ({ ...prev, [id]: true }));
  };

  const checkInterrogative = (id: number, userAnswer: string, correctAnswer: string) => {
    const normalizedUser = userAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/[^a-z\s']/g, '').trim();
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

  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:[&?]|$)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : '';
    
    const timestampMatch = url.match(/[?&]t=(\d+)s/);
    const timestamp = timestampMatch ? timestampMatch[1] : '';
    
    return `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ''}`;
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

        {/* LISTEN AND NUMBER */}
        <div className="mb-12 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
          <div className="py-4 px-6 flex justify-between items-center"
               style={{ background: `linear-gradient(135deg, ${LESSON_THEME_COLOR}, ${LESSON_THEME_COLOR}dd)` }}>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Headphones size={24} /> LISTEN AND NUMBER
            </h2>
            <button 
              onClick={() => toggleSection('listenAndNumber')}
              className="p-1 rounded-full hover:bg-white/20 transition"
            >
              {expandedSections.listenAndNumber ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.listenAndNumber && (
            <div className="p-6">
              <p className="text-gray-700 mb-4 text-center text-lg">
                🎧 Listen to the audio and number the pictures according to what you hear.
              </p>
              <p className="text-center text-sm text-gray-500 mb-6 italic">
                Use the player below to listen. O áudio inicia em {AUDIO_START_OFFSET} segundos. 
                Arraste a barra de progresso para rewind ou fast-forward.
              </p>
              
              <div className="mb-8">
                <CentralizedAudioPlayer audioSrc={AUDIO_SRC} startOffset={AUDIO_START_OFFSET} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {listenAndNumberImages.map((img) => (
                  <div key={img.id} className="bg-white rounded-xl overflow-hidden shadow-md border-2" style={{ borderColor: `${LESSON_THEME_COLOR}20` }}>
                    <div className="relative h-48 w-full">
                      <Image
                        src={img.imageUrl}
                        alt={img.description}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg" style={{ color: LESSON_THEME_COLOR }}>Image {img.id}</span>
                        <span className="text-sm text-gray-400">{img.situation}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-gray-600 font-medium text-base">Number:</label>
                        <select
                          value={userNumbers[img.id] || ""}
                          onChange={(e) => handleUserNumberChange(img.id, e.target.value)}
                          className="w-20 px-3 py-2 border-2 rounded-lg focus:outline-none text-base"
                          style={{ borderColor: `${LESSON_THEME_COLOR}50` }}
                        >
                          <option value="">—</option>
                          {[1,2,3,4,5,6].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                        {showListenAnswers && listenResults[img.id] !== undefined && (
                          <span className={`ml-2 ${listenResults[img.id] ? 'text-green-600' : 'text-red-500'}`}>
                            {listenResults[img.id] ? <Check size={20} /> : <X size={20} />}
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
                  className="px-6 py-3 text-white rounded-full font-medium hover:opacity-90 transition text-base"
                  style={{ backgroundColor: LESSON_THEME_COLOR }}
                >
                  Check Answers
                </button>
                <button
                  onClick={clearListenAndNumber}
                  className="px-6 py-3 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition text-base"
                >
                  Clear All Numbers
                </button>
              </div>
              
              {showListenAnswers && (
                <div className="mt-6 p-4 bg-gray-100 rounded-xl border-2 border-gray-300">
                  <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <CheckCircle size={20} style={{ color: LESSON_THEME_COLOR }} /> Correct Answers:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {listenAndNumberImages.map((img) => (
                      <div key={img.id} className="flex justify-between items-center p-2 bg-white rounded-lg text-base">
                        <span className="font-medium">Image {img.id}:</span>
                        <span className="text-emerald-600 font-bold">→ {img.correctNumber}</span>
                        <span className="text-gray-500 text-sm">({img.situation})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE I */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#3b82f6" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔄</span> DRILLING PRACTICE I
            </h2>
            <button onClick={() => toggleSection('drilling1')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling1 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling1 && (
            <div className="p-6">
              <p className="text-gray-600 mb-5 italic text-base">Substitute the words as indicated:</p>
              <div className="space-y-5">
                {drillingPracticeI.map((ex) => (
                  <SubstitutionDrill key={ex.id} exercise={ex} onUpdate={handleDrilling1Update} />
                ))}
              </div>
              <div className="mt-6 p-5 bg-blue-100 rounded-xl border border-blue-300">
                <h4 className="font-bold text-blue-800 mb-3 text-lg">➕ EXTRA: Future & Past with WILL and DIDN'T</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">🔮 <strong>Future (WILL):</strong></p>
                    <p className="text-green-600 text-base">• I will take these pills tomorrow morning.</p>
                    <p className="text-green-600 text-base">• She will talk to the doctor about her symptoms.</p>
                    <p className="text-green-600 text-base">• Will you go to the hospital if the pain continues?</p>
                    <p className="text-red-500 text-base">• He won't (will not) forget to take his medicine.</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">📅 <strong>Past (DIDN'T - Negative):</strong></p>
                    <p className="text-red-500 text-base">• I didn't take my vitamins yesterday.</p>
                    <p className="text-red-500 text-base">• She didn't feel well after eating that.</p>
                    <p className="text-blue-600 text-base">❓ Didn't you see the doctor last week?</p>
                    <p className="text-blue-600 text-base">❓ Why didn't he call the nurse?</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO NEGATIVE */}
        <div className="mb-12 bg-gradient-to-br from-red-50 to-rose-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#ef4444" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-red-500 to-rose-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">❌</span> CHANGE INTO NEGATIVE
            </h2>
            <button onClick={() => toggleSection('negative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.negative ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
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
              <div className="mt-5 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-sm">💡 Tip: Use "do not / don't" or "does not / doesn't"</p>
              </div>
              <div className="mt-6 p-5 bg-red-100 rounded-xl border border-red-300">
                <h4 className="font-bold text-red-800 mb-3 text-lg">➕ EXTRA: Future & Past with WILL and DIDN'T</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">🔮 <strong>Future (WILL):</strong></p>
                    <p className="text-green-600 text-base">• I will take these pills in the morning tomorrow.</p>
                    <p className="text-green-600 text-base">• She will go to the dentist next Monday.</p>
                    <p className="text-green-600 text-base">• Will they have to take medicine every day?</p>
                    <p className="text-red-500 text-base">• He won't need painkillers after the treatment.</p>
                    <p className="text-blue-600 text-base">❓ Will you feel better after resting?</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">📅 <strong>Past (DIDN'T - Negative):</strong></p>
                    <p className="text-red-500 text-base">• I didn't take these pills yesterday morning.</p>
                    <p className="text-red-500 text-base">• She didn't have a fever last night.</p>
                    <p className="text-red-500 text-base">• They didn't go to the dentist last month.</p>
                    <p className="text-blue-600 text-base">❓ Didn't you have a toothache last week?</p>
                    <p className="text-blue-600 text-base">❓ Why didn't she need painkillers after surgery?</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE II */}
        <div className="mb-12 bg-gradient-to-br from-purple-50 to-violet-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#8b5cf6" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-purple-500 to-violet-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🔄</span> DRILLING PRACTICE II
            </h2>
            <button onClick={() => toggleSection('drilling2')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling2 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling2 && (
            <div className="p-6">
              <div className="space-y-5">
                {drillingPracticeII.map((ex) => (
                  <SubstitutionDrill key={ex.id} exercise={ex} onUpdate={handleDrilling2Update} />
                ))}
              </div>
              <div className="mt-6 p-5 bg-purple-100 rounded-xl border border-purple-300">
                <h4 className="font-bold text-purple-800 mb-3 text-lg">➕ EXTRA: Future & Past with WILL and DIDN'T</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">🔮 <strong>Future (WILL):</strong></p>
                    <p className="text-green-600 text-base">• I will still need to talk to the doctor next week.</p>
                    <p className="text-green-600 text-base">• She will be a great nurse one day.</p>
                    <p className="text-green-600 text-base">• Will you have a cold if you go outside without a coat?</p>
                    <p className="text-red-500 text-base">• These won't be my cousins after the wedding.</p>
                    <p className="text-blue-600 text-base">❓ Will they be at the beach together next summer?</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">📅 <strong>Past (DIDN'T - Negative):</strong></p>
                    <p className="text-red-500 text-base">• I didn't need to talk to the doctor yesterday.</p>
                    <p className="text-red-500 text-base">• She wasn't a great nurse at that hospital.</p>
                    <p className="text-red-500 text-base">• You didn't have a cold last winter.</p>
                    <p className="text-blue-600 text-base">❓ Didn't you say these were your cousins?</p>
                    <p className="text-blue-600 text-base">❓ Why didn't they go to the beach together?</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#10b981" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">➕</span> CHANGE INTO AFFIRMATIVE
            </h2>
            <button onClick={() => toggleSection('affirmative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.affirmative ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
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

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="mb-12 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f59e0b" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-amber-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">❓</span> CHANGE INTO INTERROGATIVE
            </h2>
            <button onClick={() => toggleSection('interrogative')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.interrogative ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
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

        {/* FLUENCY (Demonstratives) */}
        <div className="mb-12 bg-gradient-to-br from-cyan-50 to-sky-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-sky-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">💬</span> FLUENCY (Demonstratives)
            </h2>
            <button onClick={() => toggleSection('fluency')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.fluency ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {expandedSections.fluency && (
            <div className="p-6">
              <FluencyDemonstrativeExplanation />
              
              <div className="mt-6 p-4 bg-cyan-100 rounded-lg border border-cyan-300">
                <p className="text-cyan-800 text-base">📘 <strong>Model:</strong> I need to talk to that nurse → I need to talk to those nurses / This is my brother → These are my brothers</p>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                    <span className="text-emerald-500">❶</span> Part A
                  </h3>
                  <div className="space-y-3">
                    {fluencyExercises.partA.map((item, idx) => (
                      <FluencyCard key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                    <span className="text-orange-500">❷</span> Part B
                  </h3>
                  <div className="space-y-3">
                    {fluencyExercises.partB.map((item, idx) => (
                      <FluencyCard key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-cyan-100 rounded-lg border border-cyan-300">
                <h4 className="font-bold text-cyan-800 text-base mb-1">🎯 Practice Tip:</h4>
                <p className="text-cyan-700 text-base">Practice saying these sentences out loud. Pay attention to the difference between <span className="font-bold text-emerald-600">this/these</span> (near) and <span className="font-bold text-orange-500">that/those</span> (far).</p>
              </div>
              <div className="mt-6 p-5 bg-cyan-100 rounded-xl border border-cyan-300">
                <h4 className="font-bold text-cyan-800 mb-3 text-lg">➕ EXTRA: Future & Past with WILL and DIDN'T</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">🔮 <strong>Future (WILL):</strong></p>
                    <p className="text-green-600 text-base">• I will visit that city next year.</p>
                    <p className="text-green-600 text-base">• They will need to take this pill after surgery.</p>
                    <p className="text-green-600 text-base">• Will you read that book about health?</p>
                    <p className="text-red-500 text-base">• She won't buy this backpack for the trip.</p>
                    <p className="text-blue-600 text-base">❓ Will we talk about that subject in class?</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <p className="font-medium text-gray-800 text-base">📅 <strong>Past (DIDN'T - Negative):</strong></p>
                    <p className="text-red-500 text-base">• I didn't visit that city last summer.</p>
                    <p className="text-red-500 text-base">• They didn't need to take this pill yesterday.</p>
                    <p className="text-red-500 text-base">• She didn't read that book last month.</p>
                    <p className="text-blue-600 text-base">❓ Didn't you buy this backpack last year?</p>
                    <p className="text-blue-600 text-base">❓ Why didn't they talk about that subject?</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS */}
        <div className="mb-12 bg-gradient-to-br from-orange-50 to-amber-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f97316" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-orange-500 to-amber-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Youtube size={24} /> TUNE IN YOUR EARS
            </h2>
            <button onClick={() => toggleSection('tuneIn')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.tuneIn ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {expandedSections.tuneIn && (
            <div className="p-6">
              <div className="mb-5">
                <p className="text-gray-700 mb-3 text-lg font-medium">🎬 Watch the video and improve your listening skills:</p>
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-md">
                  <iframe 
                    src={getYouTubeEmbedUrl(tuneInYourEars.videoUrl)}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-80 md:h-96 rounded-xl"
                  ></iframe>
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  ⏱ O vídeo inicia em 1:06 (66 segundos)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div className="bg-white p-5 rounded-xl shadow-md border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <BookOpen size={18} /> Key Vocabulary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-base">
                    {tuneInYourEars.vocabulary.map((item, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-100 py-1">
                        <span className="font-medium text-gray-800">{item.word}</span>
                        <span className="text-gray-500 text-sm">— {item.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl shadow-md border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-600 mb-3 flex items-center gap-2">
                    <HelpCircle size={18} /> Questions to Reflect
                  </h3>
                  <ul className="space-y-2 text-base">
                    {tuneInYourEars.questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <p className="text-amber-700 text-base font-medium">💡 Advice:</p>
                    <p className="text-amber-600 text-base">{tuneInYourEars.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* WRAP UP */}
        <div className="mb-12 bg-gradient-to-br from-pink-50 to-rose-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#ec4899" }}>
          <div className="py-4 px-6 flex justify-between items-center bg-gradient-to-r from-pink-500 to-rose-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">📝</span> WRAP UP!
            </h2>
            <button onClick={() => toggleSection('wrapUp')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.wrapUp ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {expandedSections.wrapUp && (
            <div className="p-6">
              <div className="bg-white rounded-xl p-6 shadow-md border-2" style={{ borderColor: "#ec489930" }}>
                <div className="text-center mb-4">
                  <div className="inline-block p-2 rounded-full bg-pink-100 mb-2">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Plural Rule: Words ending in -s, -z, -x, -sch, -ch</h3>
                </div>
                
                <p className="text-gray-700 text-center text-base mb-4">
                  {wrapUpContent.rule}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                  {wrapUpContent.examples.map((ex, idx) => (
                    <div key={idx} className="bg-pink-50 rounded-lg p-3 text-center border border-pink-200">
                      <p className="font-bold text-pink-700 text-base">{ex.singular}</p>
                      <p className="text-gray-600 text-base">→</p>
                      <p className="font-bold text-emerald-600 text-base">{ex.plural}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-700 text-sm">💡 <strong>Memory Tip:</strong> Add -ES to words ending in S, Z, X, CH, SH (like "buzz" → "buzzes" or "church" → "churches")</p>
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
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} - {LESSON_SUBTITLE} • Interactive English Practice • All answers are saved in your browser</p>
          <p className="mt-1">🩺 Stay healthy and keep practicing English every day!</p>
        </div>
      </div>
    </div>
  );
}