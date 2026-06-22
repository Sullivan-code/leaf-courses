"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Play, Pause, RotateCcw, Volume2, ChevronDown, ChevronUp,
  Check, X, Download, MessageCircle, Headphones,
  Stethoscope, Pill, Hospital, Thermometer, Activity, Heart,
  User, Users, Calendar, Clock, AlertCircle, CheckCircle, Youtube,
  BookOpen, HelpCircle
} from "lucide-react";

// ==============================
// LESSON CONFIGURATION
// ==============================
const LESSON_NUMBER = 40;
const LESSON_TITLE = "Health, Feelings & Professions";
const LESSON_SUBTITLE = "Verb To Be (am/is/are) | Affirmative & Negative | Speaking Fluency";
const LESSON_THEME_COLOR = "#10b981";
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1588776814546-1ffc4725f6a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";

// ==============================
// LISTEN AND NUMBER IMAGES
// ==============================
const listenAndNumberImages = [
  { id: "A", description: "Two women walking quickly", imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 4, situation: "We are late / We are not late" },
  { id: "B", description: "Woman feeling very hungry", imageUrl: "https://images.unsplash.com/photo-1600486913826-f7f2b5b9cbf4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 2, situation: "Maria is very hungry" },
  { id: "C", description: "Upset person with children", imageUrl: "https://images.unsplash.com/photo-1544717305-996b815c338b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 6, situation: "You are upset with the children" },
  { id: "D", description: "Tired man resting", imageUrl: "https://images.unsplash.com/photo-1484836495779-1f3b2a9d8c2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 3, situation: "My cousin Jack is tired" },
  { id: "E", description: "Elderly people drinking water", imageUrl: "https://images.unsplash.com/photo-1556741533-6e6a3bd8e8d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 1, situation: "My grandparents are thirsty" },
  { id: "F", description: "Worried student with books", imageUrl: "https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", correctNumber: 5, situation: "You are worried about the exam" }
];

// ==============================
// DRILLING PRACTICE I
// ==============================
const drillingPracticeI = [
  {
    id: 1,
    original: "Maria is very hungry.",
    portuguese: "Maria está com muita fome.",
    future: "Maria will be very hungry.",
    futurePortuguese: "Maria estará com muita fome.",
    substitutions: [
      { word: "Maria", options: ["Maria", "John", "My sister"] },
      { word: "hungry", options: ["hungry", "tired", "sick"] }
    ],
    currentText: "Maria is very hungry."
  },
  {
    id: 2,
    original: "You are upset with the children.",
    portuguese: "Você está chateado com as crianças.",
    future: "You will be upset with the children.",
    futurePortuguese: "Você estará chateado com as crianças.",
    substitutions: [
      { word: "upset", options: ["upset", "angry", "worried"] },
      { word: "children", options: ["children", "students", "employees"] }
    ],
    currentText: "You are upset with the children."
  },
  {
    id: 3,
    original: "My cousin Jack is tired.",
    portuguese: "Meu primo Jack está cansado.",
    future: "My cousin Jack will be tired.",
    futurePortuguese: "Meu primo Jack estará cansado.",
    substitutions: [
      { word: "tired", options: ["tired", "sick", "busy"] },
      { word: "Jack", options: ["Jack", "Peter", "Mike"] }
    ],
    currentText: "My cousin Jack is tired."
  },
  {
    id: 4,
    original: "My grandparents are thirsty.",
    portuguese: "Meus avós estão com sede.",
    future: "My grandparents will be thirsty.",
    futurePortuguese: "Meus avós estarão com sede.",
    substitutions: [
      { word: "grandparents", options: ["grandparents", "parents", "friends"] },
      { word: "thirsty", options: ["thirsty", "hungry", "tired"] }
    ],
    currentText: "My grandparents are thirsty."
  },
  {
    id: 5,
    original: "You are worried about the exam.",
    portuguese: "Você está preocupado com a prova.",
    future: "You will be worried about the exam.",
    futurePortuguese: "Você estará preocupado com a prova.",
    substitutions: [
      { word: "exam", options: ["exam", "meeting", "interview"] },
      { word: "worried", options: ["worried", "nervous", "anxious"] }
    ],
    currentText: "You are worried about the exam."
  },
  {
    id: 6,
    original: "Adam is a kind teacher.",
    portuguese: "Adam é um professor gentil.",
    future: "Adam will be a kind teacher.",
    futurePortuguese: "Adam será um professor gentil.",
    substitutions: [
      { word: "kind", options: ["kind", "strict", "patient"] },
      { word: "teacher", options: ["teacher", "doctor", "lawyer"] }
    ],
    currentText: "Adam is a kind teacher."
  },
  {
    id: 7,
    original: "His brother and sister are very smart.",
    portuguese: "O irmão e a irmã dele são muito inteligentes.",
    future: "His brother and sister will be very smart.",
    futurePortuguese: "O irmão e a irmã dele serão muito inteligentes.",
    substitutions: [
      { word: "smart", options: ["smart", "funny", "creative"] },
      { word: "brother", options: ["brother", "cousin", "friend"] }
    ],
    currentText: "His brother and sister are very smart."
  },
  {
    id: 8,
    original: "You are very tired this week.",
    portuguese: "Você está muito cansado esta semana.",
    future: "You will be very tired this week.",
    futurePortuguese: "Você estará muito cansado esta semana.",
    substitutions: [
      { word: "week", options: ["week", "month", "day"] },
      { word: "tired", options: ["tired", "busy", "stressed"] }
    ],
    currentText: "You are very tired this week."
  },
  {
    id: 9,
    original: "This computer is very good.",
    portuguese: "Este computador é muito bom.",
    future: "This computer will be very good.",
    futurePortuguese: "Este computador será muito bom.",
    substitutions: [
      { word: "computer", options: ["computer", "phone", "tablet"] },
      { word: "good", options: ["good", "fast", "expensive"] }
    ],
    currentText: "This computer is very good."
  },
  {
    id: 10,
    original: "My brothers and I are busy today.",
    portuguese: "Meus irmãos e eu estamos ocupados hoje.",
    future: "My brothers and I will be busy today.",
    futurePortuguese: "Meus irmãos e eu estaremos ocupados hoje.",
    substitutions: [
      { word: "busy", options: ["busy", "free", "tired"] },
      { word: "today", options: ["today", "tomorrow", "this week"] }
    ],
    currentText: "My brothers and I are busy today."
  }
];

// ==============================
// NEGATIVE PRACTICE
// ==============================
const negativePractice = [
  { id: 1, english: "They are at the hospital.", portuguese: "Eles estão no hospital.", future: "They will be at the hospital.", futurePortuguese: "Eles estarão no hospital." },
  { id: 2, english: "He is an engineer.", portuguese: "Ele é engenheiro.", future: "He will be an engineer.", futurePortuguese: "Ele será engenheiro." },
  { id: 3, english: "He is a manager at the mall.", portuguese: "Ele é gerente no shopping.", future: "He will be a manager at the mall.", futurePortuguese: "Ele será gerente no shopping." },
  { id: 4, english: "I am late for class.", portuguese: "Estou atrasado para a aula.", future: "I will be late for class.", futurePortuguese: "Estarei atrasado para a aula." },
  { id: 5, english: "It is five o'clock.", portuguese: "São cinco horas.", future: "It will be five o'clock.", futurePortuguese: "Serão cinco horas." },
  { id: 6, english: "They are very busy today.", portuguese: "Eles estão muito ocupados hoje.", future: "They will be very busy today.", futurePortuguese: "Eles estarão muito ocupados hoje." },
  { id: 7, english: "This is my second day at school.", portuguese: "Este é meu segundo dia na escola.", future: "This will be my second day at school.", futurePortuguese: "Este será meu segundo dia na escola." }
];

// ==============================
// AFFIRMATIVE PRACTICE
// ==============================
const affirmativePractice = [
  { id: 1, negative: "I am not his friend.", affirmative: "I am his friend.", portuguese: "Eu não sou amigo dele.", future: "I will be his friend.", futurePortuguese: "Eu serei amigo dele." },
  { id: 2, negative: "He is not a kind person.", affirmative: "He is a kind person.", portuguese: "Ele não é uma pessoa gentil.", future: "He will be a kind person.", futurePortuguese: "Ele será uma pessoa gentil." },
  { id: 3, negative: "They are not Spanish.", affirmative: "They are Spanish.", portuguese: "Eles não são espanhóis.", future: "They will be Spanish.", futurePortuguese: "Eles serão espanhóis." },
  { id: 4, negative: "We are not doctors.", affirmative: "We are doctors.", portuguese: "Nós não somos médicos.", future: "We will be doctors.", futurePortuguese: "Nós seremos médicos." },
  { id: 5, negative: "She is not upset today.", affirmative: "She is upset today.", portuguese: "Ela não está chateada hoje.", future: "She will be upset today.", futurePortuguese: "Ela estará chateada hoje." },
  { id: 6, negative: "These are not my reports.", affirmative: "These are my reports.", portuguese: "Estes não são meus relatórios.", future: "These will be my reports.", futurePortuguese: "Estes serão meus relatórios." },
  { id: 7, negative: "Those are not my sunglasses.", affirmative: "Those are my sunglasses.", portuguese: "Aqueles não são meus óculos de sol.", future: "Those will be my sunglasses.", futurePortuguese: "Aqueles serão meus óculos de sol." }
];

// ==============================
// DRILLING PRACTICE II
// ==============================
const drillingPracticeII = [
  {
    id: 1,
    original: "My boss is in the office.",
    portuguese: "Meu chefe está no escritório.",
    future: "My boss will be in the office.",
    futurePortuguese: "Meu chefe estará no escritório.",
    substitutions: [
      { word: "boss", options: ["boss", "coworker", "friend"] },
      { word: "office", options: ["office", "meeting room", "restaurant"] }
    ],
    currentText: "My boss is in the office."
  },
  {
    id: 2,
    original: "It is late.",
    portuguese: "Está tarde.",
    future: "It will be late.",
    futurePortuguese: "Estará tarde.",
    substitutions: [
      { word: "late", options: ["late", "early", "easy", "difficult"] }
    ],
    currentText: "It is late."
  },
  {
    id: 3,
    original: "My children are in the living room.",
    portuguese: "Meus filhos estão na sala de estar.",
    future: "My children will be in the living room.",
    futurePortuguese: "Meus filhos estarão na sala de estar.",
    substitutions: [
      { word: "living room", options: ["living room", "bedroom", "kitchen"] },
      { word: "children", options: ["children", "students", "guests"] }
    ],
    currentText: "My children are in the living room."
  },
  {
    id: 4,
    original: "My sister is at school now.",
    portuguese: "Minha irmã está na escola agora.",
    future: "My sister will be at school now.",
    futurePortuguese: "Minha irmã estará na escola agora.",
    substitutions: [
      { word: "school", options: ["school", "university", "company"] },
      { word: "sister", options: ["sister", "brother", "friend"] }
    ],
    currentText: "My sister is at school now."
  },
  {
    id: 5,
    original: "The designers are worried.",
    portuguese: "Os projetistas estão preocupados.",
    future: "The designers will be worried.",
    futurePortuguese: "Os projetistas estarão preocupados.",
    substitutions: [
      { word: "worried", options: ["worried", "tired", "happy"] },
      { word: "designers", options: ["designers", "engineers", "managers"] }
    ],
    currentText: "The designers are worried."
  },
  {
    id: 6,
    original: "This is my first job.",
    portuguese: "Este é meu primeiro emprego.",
    future: "This will be my first job.",
    futurePortuguese: "Este será meu primeiro emprego.",
    substitutions: [
      { word: "job", options: ["job", "report", "book"] },
      { word: "first", options: ["first", "second", "last"] }
    ],
    currentText: "This is my first job."
  },
  {
    id: 7,
    original: "She is not sick.",
    portuguese: "Ela não está doente.",
    future: "She will not be sick.",
    futurePortuguese: "Ela não estará doente.",
    substitutions: [
      { word: "She", options: ["She", "Mariela"] },
      { word: "sick", options: ["sick", "tired", "worried"] }
    ],
    currentText: "She is not sick."
  },
  {
    id: 8,
    original: "I think he is a doctor.",
    portuguese: "Eu acho que ele é médico.",
    future: "I think he will be a doctor.",
    futurePortuguese: "Eu acho que ele será médico.",
    substitutions: [
      { word: "doctor", options: ["doctor", "lawyer", "teacher"] },
      { word: "he", options: ["he", "she"] }
    ],
    currentText: "I think he is a doctor."
  },
  {
    id: 9,
    original: "He is her husband.",
    portuguese: "Ele é marido dela.",
    future: "He will be her husband.",
    futurePortuguese: "Ele será marido dela.",
    substitutions: [
      { word: "husband", options: ["husband", "boyfriend", "friend"] },
      { word: "her", options: ["her", "my", "his"] }
    ],
    currentText: "He is her husband."
  },
  {
    id: 10,
    original: "This is my wife.",
    portuguese: "Esta é minha esposa.",
    future: "This will be my wife.",
    futurePortuguese: "Esta será minha esposa.",
    substitutions: [
      { word: "wife", options: ["wife", "mother", "girlfriend"] },
      { word: "my", options: ["my", "your", "his"] }
    ],
    currentText: "This is my wife."
  },
  {
    id: 11,
    original: "I am worried about my appointment.",
    portuguese: "Eu estou preocupado com meu compromisso.",
    future: "I will be worried about my appointment.",
    futurePortuguese: "Eu estarei preocupado com meu compromisso.",
    substitutions: [
      { word: "appointment", options: ["appointment", "project", "meeting"] },
      { word: "worried", options: ["worried", "nervous", "excited"] }
    ],
    currentText: "I am worried about my appointment."
  },
  {
    id: 12,
    original: "Those are not my shoes.",
    portuguese: "Aqueles não são meus sapatos.",
    future: "Those will not be my shoes.",
    futurePortuguese: "Aqueles não serão meus sapatos.",
    substitutions: [
      { word: "shoes", options: ["shoes", "pills", "books"] },
      { word: "Those", options: ["Those", "These", "They"] }
    ],
    currentText: "Those are not my shoes."
  }
];

// ==============================
// FLUENCY EXERCISES
// ==============================
const fluencyExercises = {
  partA: [
    { id: "a", sentence: "I am at home right now.", portuguese: "Estou em casa agora.", future: "I will be at home right now.", futurePortuguese: "Estarei em casa agora." },
    { id: "b", sentence: "My parents are at work.", portuguese: "Meus pais estão no trabalho.", future: "My parents will be at work.", futurePortuguese: "Meus pais estarão no trabalho." },
    { id: "c", sentence: "I am a little tired, but I am not stressed.", portuguese: "Estou um pouco cansado, mas não estou estressado.", future: "I will be a little tired, but I will not be stressed.", futurePortuguese: "Estarei um pouco cansado, mas não estarei estressado." },
    { id: "d", sentence: "My week is busy, but my classes are very good.", portuguese: "Minha semana é ocupada, mas minhas aulas são muito boas.", future: "My week will be busy, but my classes will be very good.", futurePortuguese: "Minha semana será ocupada, mas minhas aulas serão muito boas." }
  ],
  speakingQuestions: [
    { id: 1, question: "What do you do?", portuguese: "O que você faz (profissão/estudo)?" },
    { id: 2, question: "What does your brother/sister do?", portuguese: "O que seu irmão/irmã faz?" },
    { id: 3, question: "Do you usually have very busy weeks?", portuguese: "Você costuma ter semanas muito ocupadas?" },
    { id: 4, question: "What do you think about your teacher?", portuguese: "O que você acha do seu professor?" },
    { id: 5, question: "What do you think about your English classes?", portuguese: "O que você acha das suas aulas de inglês?" },
    { id: 6, question: "How are you today?", portuguese: "Como você está hoje?" },
    { id: 7, question: "What's the matter with your friend?", portuguese: "O que há com seu amigo?" },
    { id: 8, question: "Why do you need to see a doctor this week?", portuguese: "Por que você precisa ver um médico esta semana?" },
    { id: 9, question: "Do you eat healthy food every day?", portuguese: "Você come comida saudável todos os dias?" },
    { id: 10, question: "Do you usually take a painkiller when you have a headache?", portuguese: "Você costuma tomar analgésico quando está com dor de cabeça?" }
  ]
};

// ==============================
// TUNE IN YOUR EARS
// ==============================
const tuneInYourEars = {
  videoUrl: "https://www.youtube.com/watch?v=5xVUO7b1hPo",
  vocabulary: [
    { word: "2 hours away", meaning: "2 horas de distância" },
    { word: "hiking trail", meaning: "trilha de caminhada" },
    { word: "twists and turns", meaning: "reviravoltas e curvas" },
    { word: "weird", meaning: "estranho/constrangedor" },
    { word: "The dogs must be on a leash", meaning: "Os cachorros devem ficar na coleira." },
    { word: "on a leash", meaning: "na coleira" },
    { word: "I figured", meaning: "Eu imaginei / entendi" },
    { word: "sharp left turn", meaning: "curva acentuada à esquerda" },
    { word: "The dog is panting", meaning: "O cachorro está ofegante" },
    { word: "anti anxiety medication", meaning: "Medicação anti ansiedade" },
    { word: "water bottle", meaning: "garrafa de água" },
    { word: "Gabriel has been there", meaning: "Gabriel esteve lá" },
    { word: "car sick", meaning: "enjoada de andar de carro" },
    { word: "To look straight ahead", meaning: "Olhar com atenção pra frente" },
    { word: "To scan the QR Code", meaning: "Escanear o QR code" },
    { word: "Day pass", meaning: "passe do dia" },
    { word: "pine trees", meaning: "pinheiros" }
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
  const [showFuture, setShowFuture] = useState(false);

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

  const applyFuture = () => {
    setCurrentText(exercise.future);
    setShowFuture(true);
    onUpdate(exercise.id, exercise.future);
  };

  const applyPresent = () => {
    setCurrentText(exercise.original);
    setShowFuture(false);
    onUpdate(exercise.id, exercise.original);
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
        <div className="flex flex-wrap gap-2">
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
        <div className="flex gap-2">
          <button
            onClick={applyPresent}
            className={`text-xs px-3 py-1 rounded-full transition ${!showFuture ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            Present
          </button>
          <button
            onClick={applyFuture}
            className={`text-xs px-3 py-1 rounded-full transition ${showFuture ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            Future (will)
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-lg font-bold text-gray-800 mb-2">
          {currentText}
        </p>
        {showPortuguese && (
          <>
            <p className="text-md text-gray-600 italic border-l-4 pl-3" 
               style={{ borderColor: LESSON_THEME_COLOR }}>
              {exercise.portuguese}
            </p>
            {showFuture && exercise.futurePortuguese && (
              <p className="text-md text-gray-600 italic border-l-4 pl-3 mt-1 text-emerald-600" 
                 style={{ borderColor: "#10b981" }}>
                🔮 {exercise.futurePortuguese}
              </p>
            )}
          </>
        )}
        {showFuture && (
          <p className="text-xs text-emerald-600 font-medium mt-1">✨ Future tense (will be)</p>
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
  transformType: 'negative' | 'affirmative';
  onAnswerChange: (id: number, value: string) => void;
  answers: Record<number, string>;
  onCheck: (id: number, userAnswer: string, correctAnswer: string) => void;
  showResults: Record<number, boolean>;
  correctness: Record<number, boolean>;
  // These are the functions that were missing - now passed as props
  setCorrectness: (id: number, value: boolean) => void;
  setShowResults: (id: number, value: boolean) => void;
}

const TransformationExercise = ({ 
  title, items, transformType, onAnswerChange, answers, onCheck, showResults, correctness,
  setCorrectness, setShowResults
}: TransformationExerciseProps) => {
  const [showFuture, setShowFuture] = useState<Record<number, boolean>>({});

  const getOriginalText = (item: any) => {
    if (transformType === 'negative') return item.english;
    return item.negative;
  };

  const getAllNegativeForms = (text: string): string[] => {
    const forms: string[] = [];
    if (text.includes('am')) {
      forms.push(text.replace('am', 'am not'));
    }
    if (text.includes('is')) {
      forms.push(text.replace('is', 'is not'));
      forms.push(text.replace('is', "isn't"));
    }
    if (text.includes('are')) {
      forms.push(text.replace('are', 'are not'));
      forms.push(text.replace('are', "aren't"));
    }
    if (text.includes("'re")) {
      forms.push(text.replace("'re", " are not"));
      forms.push(text.replace("'re", " aren't"));
    }
    if (text.includes("'s")) {
      forms.push(text.replace("'s", " is not"));
      forms.push(text.replace("'s", " isn't"));
    }
    if (text.includes("I'm")) {
      forms.push("I am not");
      forms.push("I'm not");
    }
    const verbPatterns = ['am', 'is', 'are'];
    for (const verb of verbPatterns) {
      if (text.includes(verb)) {
        forms.push(text.replace(verb, `${verb} not`));
      }
    }
    return forms;
  };

  const getCorrectAnswer = (item: any) => {
    if (transformType === 'negative') {
      const original = item.english;
      if (original.includes("am")) return original.replace("am", "am not");
      if (original.includes("is")) return original.replace("is", "is not");
      if (original.includes("are")) return original.replace("are", "are not");
      return `not ${original}`;
    }
    return item.affirmative;
  };

  const getFutureCorrectAnswer = (item: any) => {
    if (transformType === 'negative') {
      const future = item.future;
      if (future.includes("will be")) {
        return future.replace("will be", "will not be");
      }
      return future.replace("will be", "will not be");
    }
    return item.future;
  };

  const getInstruction = () => {
    if (transformType === 'negative') return "Transform into negative using the verb TO BE + NOT (isn't / aren't / am not / 're not / 's not):";
    return "Transform into affirmative:";
  };

  const toggleFuture = (id: number) => {
    setShowFuture(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckClick = (item: any, correctAnswer: string, isFuture: boolean) => {
    const userAns = answers[item.id] || "";
    const normalizedUser = userAns.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedCorrect = correctAnswer.toLowerCase().replace(/\s+/g, ' ').trim();
    
    // Get all possible negative forms
    const allForms = isFuture ? [normalizedCorrect] : getAllNegativeForms(normalizedCorrect);
    allForms.push(normalizedCorrect);
    
    // Check if user answer matches any possible form
    const isCorrect = allForms.some(form => {
      const normalizedForm = form.toLowerCase().replace(/\s+/g, ' ').trim();
      return normalizedUser === normalizedForm || 
             (normalizedUser.length > 5 && normalizedForm.includes(normalizedUser));
    });
    
    // Clean version
    const userClean = normalizedUser.replace(/[^a-zA-Z\s']/g, '');
    const isCorrectClean = allForms.some(form => {
      const clean = form.toLowerCase().replace(/[^a-zA-Z\s']/g, '');
      return userClean === clean;
    });
    
    const finalResult = isCorrect || isCorrectClean;
    
    // Update parent state using the passed functions
    setCorrectness(item.id, finalResult);
    setShowResults(item.id, true);
    
    // Also call the onCheck for compatibility
    onCheck(item.id, userAns, correctAnswer);
  };

  return (
    <div className="bg-white p-5 rounded-xl border-2 shadow-md" style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <h3 className="text-xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>{title}</h3>
      <p className="text-gray-600 mb-5 italic text-sm">{getInstruction()}</p>
      <p className="text-xs text-gray-500 mb-4">✅ Accepted forms: isn't / is not / aren't / are not / 're not / 's not / am not / I'm not</p>
      
      <div className="space-y-5">
        {items.map((item) => {
          const isFuture = showFuture[item.id] || false;
          const displayText = isFuture ? item.future : getOriginalText(item);
          const correctAnswer = isFuture ? getFutureCorrectAnswer(item) : getCorrectAnswer(item);
          const possibleForms = isFuture ? [] : getAllNegativeForms(correctAnswer);
          
          return (
            <div key={item.id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <p className="font-medium text-gray-800">
                  {displayText}
                </p>
                <button
                  onClick={() => toggleFuture(item.id)}
                  className={`text-xs px-2 py-0.5 rounded-full transition ${isFuture ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                >
                  {isFuture ? "Future" : "Present"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-2 italic">
                🇧🇷 {isFuture && item.futurePortuguese ? item.futurePortuguese : item.portuguese}
              </p>
              
              {!isFuture && transformType === 'negative' && possibleForms.length > 0 && (
                <div className="text-xs text-gray-400 mb-2">
                  <span className="font-medium">Accepted forms:</span> {possibleForms.slice(0, 4).join(', ')}
                  {possibleForms.length > 4 && ` + ${possibleForms.length - 4} more`}
                </div>
              )}
              
              <textarea
                value={answers[item.id] || ""}
                onChange={(e) => onAnswerChange(item.id, e.target.value)}
                placeholder={`Type your transformed ${isFuture ? 'future ' : ''}sentence here...`}
                className="w-full p-2 border-2 rounded-lg focus:ring-2 focus:outline-none resize-none text-sm"
                style={{ borderColor: `${LESSON_THEME_COLOR}30` }}
                rows={2}
              />
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => handleCheckClick(item, correctAnswer, isFuture)}
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
                        <div>
                          <p className="text-gray-700 text-xs">
                            <span className="font-medium">Suggested answers:</span>
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {!isFuture && transformType === 'negative' ? 
                              getAllNegativeForms(correctAnswer).slice(0, 3).map((form, idx) => (
                                <span key={idx} className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{form}</span>
                              ))
                              :
                              <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{correctAnswer}</span>
                            }
                          </div>
                        </div>
                      )}
                      {isFuture && (
                        <p className="text-emerald-600 text-xs mt-1">✨ Future tense used</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==============================
// COMPONENT: FLUENCY CARD
// ==============================
const FluencyCard = ({ item, index }: { item: any; index: number }) => {
  const [showPortuguese, setShowPortuguese] = useState(false);
  const [showFuture, setShowFuture] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${LESSON_THEME_COLOR}20`, color: LESSON_THEME_COLOR }}>
            {index + 1}
          </span>
          <button
            onClick={() => setShowFuture(!showFuture)}
            className={`text-xs px-2 py-0.5 rounded-full transition ${showFuture ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            {showFuture ? "Future" : "Present"}
          </button>
        </div>
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-xs px-2 py-0.5 bg-gray-100 hover:bg-gray-200 rounded-full transition"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"}
        </button>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-md font-medium text-gray-800">
          {showFuture && item.future ? item.future : item.sentence}
        </p>
        <AudioPlayerSimulated text={showFuture && item.future ? item.future : item.sentence} compact />
      </div>
      {showPortuguese && (
        <p className="text-gray-600 italic text-sm mt-2 border-l-4 pl-2" style={{ borderColor: LESSON_THEME_COLOR }}>
          {showFuture && item.futurePortuguese ? item.futurePortuguese : item.portuguese}
        </p>
      )}
      {showFuture && (
        <p className="text-xs text-emerald-600 font-medium mt-1">✨ Future tense (will be)</p>
      )}
    </div>
  );
};

// ==============================
// COMPONENT: SPEAKING CARD
// ==============================
const SpeakingCard = ({ item, index }: { item: any; index: number }) => {
  const [showPortuguese, setShowPortuguese] = useState(false);
  
  return (
    <div className="bg-white p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${LESSON_THEME_COLOR}20`, color: LESSON_THEME_COLOR }}>
          Q{index + 1}
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
          {item.question}
        </p>
        <AudioPlayerSimulated text={item.question} compact />
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
export default function Lesson40HealthFeelingsProfessions() {
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    listenAndNumber: true,
    drilling1: true,
    negative: true,
    affirmative: true,
    drilling2: true,
    fluency: true,
    speaking: true,
    tuneIn: true
  });

  const [userNumbers, setUserNumbers] = useState<Record<string, string>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  const [showListenAnswers, setShowListenAnswers] = useState(false);

  const [drilling1Texts, setDrilling1Texts] = useState<Record<number, string>>({});
  const [drilling2Texts, setDrilling2Texts] = useState<Record<number, string>>({});
  
  const [negativeAnswers, setNegativeAnswers] = useState<Record<number, string>>({});
  const [affirmativeAnswers, setAffirmativeAnswers] = useState<Record<number, string>>({});
  
  const [negativeResults, setNegativeResults] = useState<Record<number, boolean>>({});
  const [affirmativeResults, setAffirmativeResults] = useState<Record<number, boolean>>({});
  const [negativeShow, setNegativeShow] = useState<Record<number, boolean>>({});
  const [affirmativeShow, setAffirmativeShow] = useState<Record<number, boolean>>({});

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

  const checkNegative = (id: number, userAnswer: string, correctAnswer: string) => {
    setNegativeShow(prev => ({ ...prev, [id]: true }));
  };

  const checkAffirmative = (id: number, userAnswer: string, correctAnswer: string) => {
    setAffirmativeShow(prev => ({ ...prev, [id]: true }));
  };

  // Wrapper functions to update state from child component
  const setNegativeCorrectness = (id: number, value: boolean) => {
    setNegativeResults(prev => ({ ...prev, [id]: value }));
  };

  const setNegativeShowResult = (id: number, value: boolean) => {
    setNegativeShow(prev => ({ ...prev, [id]: value }));
  };

  const setAffirmativeCorrectness = (id: number, value: boolean) => {
    setAffirmativeResults(prev => ({ ...prev, [id]: value }));
  };

  const setAffirmativeShowResult = (id: number, value: boolean) => {
    setAffirmativeShow(prev => ({ ...prev, [id]: value }));
  };

  const saveAllAnswers = () => {
    const allData = {
      userNumbers,
      drilling1Texts,
      drilling2Texts,
      negativeAnswers,
      affirmativeAnswers,
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
      setListenResults({});
      setNegativeResults({});
      setAffirmativeResults({});
      setNegativeShow({});
      setAffirmativeShow({});
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
            Practice verb TO BE (am/is/are) in affirmative and negative forms. Talk about feelings, professions and daily situations.
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

        {/* GRAMMAR REFERENCE */}
        <div className="mb-12 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
          <div className="py-3 px-6 text-center" style={{ background: `linear-gradient(135deg, ${LESSON_THEME_COLOR}, ${LESSON_THEME_COLOR}dd)` }}>
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <CheckCircle size={20} /> GRAMMAR FOCUS – VERB TO BE
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-green-600 mb-3">✔️ Affirmative</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">I am</span> (I'm)</li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">You / We / They are</span> (You're / We're / They're)</li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">He / She / It is</span> (He's / She's / It's)</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-red-600 mb-3">❌ Negative</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">I am not</span> (I'm not)</li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">You / We / They are not</span> (aren't / 're not)</li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">He / She / It is not</span> (isn't / 's not)</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-md border-2 border-emerald-200">
                <h3 className="text-lg font-bold text-emerald-600 mb-3">🔮 Future (will)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">I will be</span></li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">You / We / They will be</span></li>
                  <li><span className="font-mono bg-gray-100 px-2 py-1 rounded">He / She / It will be</span></li>
                  <li className="text-xs text-gray-500 mt-1">Negative: <span className="font-mono bg-gray-100 px-2 py-1 rounded">will not be</span> (won't be)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: DRILLING PRACTICE I */}
        <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#3b82f6" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔄 WARM-UP DRILLING (Complete orally)
            </h2>
            <button onClick={() => toggleSection('drilling1')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling1 ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling1 && (
            <div className="p-6">
              <p className="text-gray-600 mb-5 italic text-sm">Practice: Maria is very hungry → Maria is not very hungry 🔮 → Maria will be very hungry (click Future to practice)</p>
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
              ❌ CHANGE INTO NEGATIVE
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
                setCorrectness={setNegativeCorrectness}
                setShowResults={setNegativeShowResult}
              />
              <div className="mt-5 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-700 text-xs">💡 Tip: Use verb TO BE + NOT (am not / is not / are not / isn't / aren't / 're not / 's not) or WILL NOT BE for future</p>
              </div>
            </div>
          )}
        </div>

        {/* PART 4: CHANGE INTO AFFIRMATIVE */}
        <div className="mb-12 bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#10b981" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              ➕ CHANGE INTO AFFIRMATIVE
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
                setCorrectness={setAffirmativeCorrectness}
                setShowResults={setAffirmativeShowResult}
              />
            </div>
          )}
        </div>

        {/* PART 5: DRILLING PRACTICE II */}
        <div className="mb-12 bg-gradient-to-br from-purple-50 to-violet-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#8b5cf6" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-purple-500 to-violet-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🔄 PART 5 — EXERCISES 3 & 4: SUBSTITUTION PRACTICE
            </h2>
            <button onClick={() => toggleSection('drilling2')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.drilling2 ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.drilling2 && (
            <div className="p-6">
              <p className="text-gray-600 mb-5 italic text-sm">Substitute the words as indicated. Click "Future" to practice future tense.</p>
              <div className="space-y-5">
                {drillingPracticeII.map((ex) => (
                  <SubstitutionDrill key={ex.id} exercise={ex} onUpdate={handleDrilling2Update} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART 6: FLUENCY */}
        <div className="mb-12 bg-gradient-to-br from-cyan-50 to-sky-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-sky-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              💬 PART 6 — FLUENCY PRODUCTION (Model)
            </h2>
            <button onClick={() => toggleSection('fluency')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.fluency ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.fluency && (
            <div className="p-6">
              <div className="mb-6 p-4 bg-cyan-100 rounded-lg">
                <p className="text-cyan-800 text-sm font-medium mb-2">📘 <strong>Production Model (1-2 minutes):</strong></p>
                <p className="text-cyan-800 text-sm italic">"I am at home right now. My parents are at work. I am a little tired, but I am not stressed. My week is busy, but my classes are very good."</p>
                <p className="text-cyan-800 text-sm italic mt-2">🔮 <strong>Future:</strong> "I will be at home right now. My parents will be at work. I will be a little tired, but I will not be stressed. My week will be busy, but my classes will be very good."</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fluencyExercises.partA.map((item, idx) => (
                  <FluencyCard key={item.id} item={item} index={idx} />
                ))}
              </div>
              <div className="mt-6 p-3 bg-cyan-100 rounded-lg">
                <h4 className="font-bold text-cyan-800 text-sm mb-1">🎯 Speaking Task:</h4>
                <p className="text-cyan-700 text-sm">Talk for 1-2 minutes about: where your family is now, how you feel today, if you are busy or not, what you think about your job/studies. Also talk about the future using "will be".</p>
              </div>
            </div>
          )}
        </div>

        {/* PART 7: SPEAKING QUESTIONS */}
        <div className="mb-12 bg-gradient-to-br from-orange-50 to-amber-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f97316" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-orange-500 to-amber-500">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              🗣️ PART 7 — SPEAKING QUESTIONS
            </h2>
            <button onClick={() => toggleSection('speaking')} className="p-1 rounded-full hover:bg-white/20">
              {expandedSections.speaking ? <ChevronUp size={20} className="text-white" /> : <ChevronDown size={20} className="text-white" />}
            </button>
          </div>
          {expandedSections.speaking && (
            <div className="p-6">
              <p className="text-gray-600 mb-5 italic text-sm">Answer orally or in writing:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fluencyExercises.speakingQuestions.map((item, idx) => (
                  <SpeakingCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PART 8: TUNE IN YOUR EARS */}
        <div className="mb-12 bg-gradient-to-br from-pink-50 to-rose-50 border-2 rounded-2xl shadow-lg overflow-hidden"
             style={{ borderColor: "#ec4899" }}>
          <div className="py-3 px-6 flex justify-between items-center bg-gradient-to-r from-pink-500 to-rose-500">
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
                <div className="bg-white p-4 rounded-xl shadow-md border border-pink-200">
                  <h3 className="text-md font-bold text-pink-600 mb-3 flex items-center gap-2">
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

                <div className="bg-white p-4 rounded-xl shadow-md border border-pink-200">
                  <h3 className="text-md font-bold text-pink-600 mb-3 flex items-center gap-2">
                    <HelpCircle size={16} /> Questions to Reflect
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {tuneInYourEars.questions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-pink-500 font-bold">•</span>
                        <span className="text-gray-700">{q}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 p-3 bg-pink-50 rounded-lg border border-pink-200">
                    <p className="text-pink-700 text-sm font-medium">💡 Advice:</p>
                    <p className="text-pink-600 text-sm">{tuneInYourEars.advice}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TEACHER TIP */}
        <div className="mb-10 p-5 bg-yellow-50 border-2 border-yellow-300 rounded-2xl">
          <h3 className="text-lg font-bold text-yellow-700 flex items-center gap-2 mb-2">
            <AlertCircle size={20} /> 👩‍🏫 TEACHER TIP (Important)
          </h3>
          <p className="text-yellow-700 text-sm">
            Always emphasize: Affirmative → Negative / Negative → Affirmative. Have students repeat out loud (drilling). Correct using: ✔️ correct model / ❌ repeat error directly. <strong>NEW:</strong> Practice Future tense with "will be" to expand students' fluency and timeline understanding. <strong>Multiple negative forms accepted:</strong> isn't, is not, aren't, are not, 're not, 's not, am not, I'm not.
          </p>
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
          <p className="mt-1">🩺 Stay healthy, express your feelings, and keep practicing English every day!</p>
          <p className="mt-1 text-emerald-600">🔮 New: Future tense with "will be" added for extra practice!</p>
          <p className="mt-1 text-blue-600">✅ Multiple negative forms accepted: isn't, is not, aren't, are not, 're not, 's not, am not, I'm not</p>
        </div>
      </div>
    </div>
  );
}