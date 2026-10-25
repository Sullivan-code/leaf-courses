"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Save, Check, XCircle, Speaker, Headphones, Eye, EyeOff, ZoomIn } from "lucide-react";

// ============================================
// LESSON 44 – EATING OUT
// ============================================

// Fluency Practice sentences
const fluencyItems = [
  { key: "a", english: "We love that cake.", expected: "That's our favorite cake." },
  { key: "b", english: "I really like this book.", expected: "This is my favorite book." },
  { key: "c", english: "I love that TV series.", expected: "That's my favorite TV series." },
  { key: "d", english: "You love this pizza place.", expected: "This is your favorite pizza place." },
  { key: "e", english: "Suzanne really likes that movie.", expected: "That's her favorite movie." },
  { key: "f", english: "Lynda and George really like that museum.", expected: "That's their favorite museum." },
  { key: "g", english: "My father loves this hamburger.", expected: "This is his favorite hamburger." },
  { key: "h", english: "Jeremy and I love that store.", expected: "That's our favorite store." },
  { key: "i", english: "Connor and Josh love that dish.", expected: "That's their favorite dish." },
  { key: "j", english: "Wendy loves this dessert.", expected: "This is her favorite dessert." },
];

// ============================================
// SUBSTITUTION MODULE TYPES (from Lesson 61 style)
// ============================================
type OptionType = string | { label: string; replacement: string; pt?: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  options: OptionType[];
}

// Substitution Practice I (button module)
const substitutionPracticeI: SubstitutionExercise[] = [
  {
    key: "sub1-1",
    original: "The children like to make popcorn.",
    options: [
      { label: "popcorn", replacement: "The children like to make popcorn.", pt: "As crianças gostam de fazer pipoca." },
      { label: "desserts", replacement: "The children like to make desserts.", pt: "As crianças gostam de fazer sobremesas." },
      { label: "cakes", replacement: "The children like to make cakes.", pt: "As crianças gostam de fazer bolos." },
    ],
  },
  {
    key: "sub1-2",
    original: "My grandmother makes a very good cake.",
    options: [
      { label: "cake", replacement: "My grandmother makes a very good cake.", pt: "Minha avó faz um bolo muito bom." },
      { label: "pizza", replacement: "My grandmother makes a very good pizza.", pt: "Minha avó faz uma pizza muito boa." },
      { label: "sandwich", replacement: "My grandmother makes a very good sandwich.", pt: "Minha avó faz um sanduíche muito bom." },
    ],
  },
  {
    key: "sub1-3",
    original: "It's cold. Do you want some soup?",
    options: [
      { label: "soup", replacement: "It's cold. Do you want some soup?", pt: "Está frio. Você quer um pouco de sopa?" },
      { label: "coffee", replacement: "It's cold. Do you want some coffee?", pt: "Está frio. Você quer um pouco de café?" },
      { label: "tea", replacement: "It's cold. Do you want some tea?", pt: "Está frio. Você quer um pouco de chá?" },
    ],
  },
  {
    key: "sub1-4",
    original: "It's hot. I want to buy some ice cream.",
    options: [
      { label: "ice cream", replacement: "It's hot. I want to buy some ice cream.", pt: "Está quente. Eu quero comprar um pouco de sorvete." },
      { label: "soda", replacement: "It's hot. I want to buy some soda.", pt: "Está quente. Eu quero comprar um pouco de refrigerante." },
      { label: "juice", replacement: "It's hot. I want to buy some juice.", pt: "Está quente. Eu quero comprar um pouco de suco." },
    ],
  },
  {
    key: "sub1-5",
    original: "Do you give gifts to your wife?",
    options: [
      { label: "your wife", replacement: "Do you give gifts to your wife?", pt: "Você dá presentes para a sua esposa?" },
      { label: "your husband", replacement: "Do you give gifts to your husband?", pt: "Você dá presentes para o seu marido?" },
      { label: "your children", replacement: "Do you give gifts to your children?", pt: "Você dá presentes para os seus filhos?" },
    ],
  },
];

// Substitution Practice II (button module)
const substitutionPracticeII: SubstitutionExercise[] = [
  {
    key: "sub2-1",
    original: "What is your favorite dish?",
    options: [
      { label: "your", replacement: "What is your favorite dish?", pt: "Qual é o seu prato favorito?" },
      { label: "his", replacement: "What is his favorite dish?", pt: "Qual é o prato favorito dele?" },
      { label: "their", replacement: "What is their favorite dish?", pt: "Qual é o prato favorito deles?" },
    ],
  },
  {
    key: "sub2-2",
    original: "This is the best restaurant in the city.",
    options: [
      { label: "restaurant", replacement: "This is the best restaurant in the city.", pt: "Este é o melhor restaurante da cidade." },
      { label: "coffee shop", replacement: "This is the best coffee shop in the city.", pt: "Esta é a melhor cafeteria da cidade." },
      { label: "school", replacement: "This is the best school in the city.", pt: "Esta é a melhor escola da cidade." },
    ],
  },
  {
    key: "sub2-3",
    original: "Who is your best friend?",
    options: [
      { label: "Who is your best friend?", replacement: "Who is your best friend?", pt: "Quem é o seu melhor amigo?" },
      { label: "Where is he?", replacement: "Where is he?", pt: "Onde ele está?" },
      { label: "How old is he?", replacement: "How old is he?", pt: "Quantos anos ele tem?" },
    ],
  },
  {
    key: "sub2-4",
    original: "I really like this dish.",
    options: [
      { label: "dish", replacement: "I really like this dish.", pt: "Eu realmente gosto deste prato." },
      { label: "hamburger", replacement: "I really like this hamburger.", pt: "Eu realmente gosto deste hambúrguer." },
      { label: "ice cream", replacement: "I really like this ice cream.", pt: "Eu realmente gosto deste sorvete." },
    ],
  },
  {
    key: "sub2-5",
    original: "How many slices of pizza do you want?",
    options: [
      { label: "pizza", replacement: "How many slices of pizza do you want?", pt: "Quantas fatias de pizza você quer?" },
      { label: "pie", replacement: "How many slices of pie do you want?", pt: "Quantas fatias de torta você quer?" },
      { label: "cheese", replacement: "How many slices of cheese do you want?", pt: "Quantas fatias de queijo você quer?" },
    ],
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

// ============================================
// CHANGE INTO THE PAST EXERCISES (B1 LEVEL, EATING OUT)
// ============================================
const pastExercises = [
  {
    id: "past1",
    sentence: "My mother makes a delicious chocolate cake for my birthday.",
    pt: "Minha mãe faz um delicioso bolo de chocolate para o meu aniversário.",
    correctAnswer: "My mother made a delicious chocolate cake for my birthday."
  },
  {
    id: "past2",
    sentence: "We give a nice tip to the waiter.",
    pt: "Nós damos uma boa gorjeta ao garçom.",
    correctAnswer: "We gave a nice tip to the waiter."
  },
  {
    id: "past3",
    sentence: "The chef makes a special sauce for the steak.",
    pt: "O chef faz um molho especial para o bife.",
    correctAnswer: "The chef made a special sauce for the steak."
  },
  {
    id: "past4",
    sentence: "I give my friend some Italian recipes.",
    pt: "Eu dou ao meu amigo algumas receitas italianas.",
    correctAnswer: "I gave my friend some Italian recipes."
  },
  {
    id: "past5",
    sentence: "They make homemade pizza on Friday nights.",
    pt: "Eles fazem pizza caseira nas noites de sexta-feira.",
    correctAnswer: "They made homemade pizza on Friday nights."
  },
  {
    id: "past6",
    sentence: "She gives her children some cookies after dinner.",
    pt: "Ela dá alguns biscoitos aos filhos dela depois do jantar.",
    correctAnswer: "She gave her children some cookies after dinner."
  },
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
  { id: "video1", question: "How do you think you can put English in your routine?", isPersonal: true },
  { id: "video2", question: "Why is it good to study English every single day?", isPersonal: false },
  { id: "video3", question: "What's the most challenging thing in your opinion in English?", isPersonal: true },
  { id: "video4", question: "How do you try to think in English?", isPersonal: true },
  { id: "video5", question: "How do you make speaking happen automatically?", isPersonal: true },
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

// Transform the Sentences image URL
const transformImageUrl = "https://github.com/Sullivan-code/english-audios/blob/main/l44-transform.png?raw=true";

// ============================================
// TEXT-TO-SPEECH FUNCTION - FEMININE VOICE
// ============================================

const speakWithFemaleVoice = (text: string, rate: number = 0.9, pitch: number = 1.1) => {
  if (!window.speechSynthesis) {
    alert("Your browser doesn't support speech synthesis. Please use Chrome, Safari, or Edge.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;

  const voices = window.speechSynthesis.getVoices();

  const femaleVoicePatterns = [
    'Samantha',
    'Google UK English Female',
    'Microsoft Zira',
    'Microsoft Hazel',
    'Victoria',
    'Karen',
    'Female',
    'Amy'
  ];

  let selectedVoice = voices.find(voice =>
    femaleVoicePatterns.some(pattern =>
      voice.name.toLowerCase().includes(pattern.toLowerCase())
    )
  );

  if (!selectedVoice) {
    selectedVoice = voices.find(voice =>
      voice.lang.includes('en') && voice.lang.includes('US')
    );
  }

  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices[0];
  }

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  utterance.onerror = (event) => {
    console.error('Speech error:', event);
  };

  window.speechSynthesis.speak(utterance);
};

// ============================================
// SUBSTITUTION MODULE COMPONENT (Lesson 61 style)
// ============================================
function SubstitutionModule({
  exercise,
  currentIndex,
  onOptionClick,
  accentColor = "blue",
}: {
  exercise: SubstitutionExercise;
  currentIndex: number;
  onOptionClick: (key: string, index: number) => void;
  accentColor?: "blue" | "teal";
}) {
  const [showEnglish, setShowEnglish] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; pt?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[currentIndex];
  let currentSentence: string;
  let currentPt: string | undefined;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentPt = currentOption.pt;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.label;
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.replacement;
    return String(opt);
  };

  const handleSpeak = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    setIsSpeaking(true);
    speakWithFemaleVoice(text, 0.9);
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(check);
      }
    }, 100);
  };

  const accentText = accentColor === "blue" ? "text-blue-600" : "text-teal-600";
  const accentBorder = accentColor === "blue" ? "border-blue-200" : "border-teal-200";
  const accentBg = accentColor === "blue" ? "bg-blue-50" : "bg-teal-50";
  const accentBgStrong = accentColor === "blue" ? "bg-blue-500" : "bg-teal-500";
  const accentBgSoft = accentColor === "blue" ? "bg-blue-100" : "bg-teal-100";

  return (
    <div className={`bg-white p-4 rounded-lg border ${accentBorder}`}>
      <div className="flex items-start justify-between mb-2">
        <p className={`${accentText} font-medium block`}>{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Hide English answer" : "Show English answer"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className={`mb-3 p-3 ${accentBg} rounded-md`}>
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className={`${accentText} font-medium flex-shrink-0`}>🇺🇸</span>
              <button
                onClick={() => handleSpeak(currentSentence)}
                className={`${accentText} font-medium text-left hover:underline cursor-pointer flex-1`}
                title="Click to hear"
              >
                {currentSentence}
              </button>
              <button
                onClick={() => handleSpeak(currentSentence)}
                className={`${isSpeaking ? 'text-red-500 animate-pulse' : 'text-blue-500'} flex-shrink-0`}
              >
                <Volume2 size={16} />
              </button>
            </div>
            {currentPt && (
              <>
                <div className={`border-t ${accentBorder} my-1`}></div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-sm flex-shrink-0">🇧🇷</span>
                  <p className="text-sm text-gray-600">{currentPt}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              onOptionClick(exercise.key, index);
              speakWithFemaleVoice(getOptionReplacement(option), 0.9);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              currentIndex === index
                ? `${accentBgStrong} text-white`
                : `${accentBgSoft} text-gray-700 hover:bg-gray-300`
            }`}
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTS
// ============================================

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

// ============================================
// AUDIO BUTTON COMPONENT
// ============================================

interface SpeakButtonProps {
  text: string;
  label?: string;
  compact?: boolean;
  className?: string;
}

const SpeakButton = ({ text, label = "🔊", compact = false, className = "" }: SpeakButtonProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    speakWithFemaleVoice(text);

    const checkSpeaking = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsSpeaking(false);
        clearInterval(checkSpeaking);
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1 transition-all duration-200 ${className} ${
        isSpeaking ? 'text-red-500 animate-pulse' : 'text-blue-600 hover:text-blue-800'
      }`}
      title={`Listen to: ${text}`}
    >
      {isSpeaking ? (
        <>
          <Volume2 size={compact ? 16 : 20} className="animate-pulse" />
          <span className={`${compact ? 'text-xs' : 'text-sm'}`}>🔊</span>
        </>
      ) : (
        <>
          <Volume2 size={compact ? 16 : 20} />
          <span className={`${compact ? 'text-xs' : 'text-sm'}`}>{label}</span>
        </>
      )}
    </button>
  );
};

// ============================================
// MAIN LESSON COMPONENT
// ============================================

export default function Lesson44() {
  const router = useRouter();

  // State for the image modal (Transform the Sentences infographic)
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // States for Fluency Practice (Transform the Sentences)
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  // States for Substitution Practice I (button module)
  const [substitutionICurrent, setSubstitutionICurrent] = useState<Record<string, number>>({});

  // States for Substitution Practice II (button module)
  const [substitutionIICurrent, setSubstitutionIICurrent] = useState<Record<string, number>>({});

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

  // States for PAST Exercises
  const [pastAnswers, setPastAnswers] = useState<Record<string, string>>({});
  const [showPastResults, setShowPastResults] = useState<Record<string, boolean>>({});
  const [pastAnswerResults, setPastAnswerResults] = useState<Record<string, boolean>>({});

  // States for Speaking Questions
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});

  // States for Tune In Your Ears
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});

  // States for section collapse/expand
  const [sections, setSections] = useState({
    fluency: true,
    past: true,
    substitutionI: true,
    substitutionII: true,
    negative: true,
    affirmative: true,
    interrogative: true,
    speaking: true,
    tuneIn: true
  });

  const [savedAnswers, setSavedAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImageModalOpen(false);
    };
    if (imageModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [imageModalOpen]);

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

        if (data.substitutionICurrent) setSubstitutionICurrent(data.substitutionICurrent);
        if (data.substitutionIICurrent) setSubstitutionIICurrent(data.substitutionIICurrent);

        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.negativeAnswerResults) setNegativeAnswerResults(data.negativeAnswerResults);

        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.affirmativeAnswerResults) setAffirmativeAnswerResults(data.affirmativeAnswerResults);

        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.showInterrogativeResults) setShowInterrogativeResults(data.showInterrogativeResults);
        if (data.interrogativeAnswerResults) setInterrogativeAnswerResults(data.interrogativeAnswerResults);

        if (data.pastAnswers) setPastAnswers(data.pastAnswers);
        if (data.showPastResults) setShowPastResults(data.showPastResults);
        if (data.pastAnswerResults) setPastAnswerResults(data.pastAnswerResults);

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
      substitutionICurrent,
      substitutionIICurrent,
      negativeAnswers,
      showNegativeResults,
      negativeAnswerResults,
      affirmativeAnswers,
      showAffirmativeResults,
      affirmativeAnswerResults,
      interrogativeAnswers,
      showInterrogativeResults,
      interrogativeAnswerResults,
      pastAnswers,
      showPastResults,
      pastAnswerResults,
      questionAnswers,
      videoAnswers,
      sections,
      savedAnswers: {
        fluency: notes,
        substitutionPracticeI: substitutionICurrent,
        substitutionPracticeII: substitutionIICurrent,
        negativeExercises: negativeAnswers,
        affirmativeExercises: affirmativeAnswers,
        interrogativeExercises: interrogativeAnswers,
        pastExercises: pastAnswers,
        speakingQuestions: questionAnswers,
        tuneInYourEars: videoAnswers,
        timestamp: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 44 – Eating Out",
      version: "2.0"
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
      setSubstitutionICurrent({});
      setSubstitutionIICurrent({});
      setNegativeAnswers({});
      setShowNegativeResults({});
      setNegativeAnswerResults({});
      setAffirmativeAnswers({});
      setShowAffirmativeResults({});
      setAffirmativeAnswerResults({});
      setInterrogativeAnswers({});
      setShowInterrogativeResults({});
      setInterrogativeAnswerResults({});
      setPastAnswers({});
      setShowPastResults({});
      setPastAnswerResults({});
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
        if (data.substitutionICurrent) setSubstitutionICurrent(data.substitutionICurrent);
        if (data.substitutionIICurrent) setSubstitutionIICurrent(data.substitutionIICurrent);
        if (data.negativeAnswers) setNegativeAnswers(data.negativeAnswers);
        if (data.affirmativeAnswers) setAffirmativeAnswers(data.affirmativeAnswers);
        if (data.interrogativeAnswers) setInterrogativeAnswers(data.interrogativeAnswers);
        if (data.pastAnswers) setPastAnswers(data.pastAnswers);
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

  const handleSubstitutionIOptionClick = (key: string, index: number) => {
    setSubstitutionICurrent(prev => ({ ...prev, [key]: index }));
  };

  const handleSubstitutionIIOptionClick = (key: string, index: number) => {
    setSubstitutionIICurrent(prev => ({ ...prev, [key]: index }));
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

  const handlePastChange = (key: string, value: string) => {
    setPastAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handlePastCheck = (id: string) => {
    const exercise = pastExercises.find(ex => ex.id === id);
    if (!exercise) return;
    const userAnswer = pastAnswers[id]?.trim();
    const isCorrect = checkAnswer(userAnswer || "", exercise.correctAnswer);
    setPastAnswerResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowPastResults(prev => ({ ...prev, [id]: true }));
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

  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    const normalize = (text: string) =>
      text.toLowerCase().trim().replace(/[.,?!]/g, '');
    return normalize(userAnswer) === normalize(correctAnswer);
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 44 – EATING OUT</h1>
          <h2 className="text-2xl font-semibold text-orange-600 mb-4">🗣️ FLUENCY</h2>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-4">
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
        {/* TRANSFORM THE SENTENCES */}
        {/* ============================================ */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">✍️ TRANSFORM THE SENTENCES</h2>
              <button onClick={() => toggleSection('fluency')} className="ml-4 p-2 rounded-full hover:bg-orange-600 transition">
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="mb-6 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">

                {/* ===== EXAMPLES BOX ===== */}
                <div className="mb-8 p-5 bg-white rounded-xl border-2 border-orange-300 shadow-sm">
                  <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center gap-2">
                    📌 Examples
                  </h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <SpeakButton text="They love that restaurant. That's their favorite restaurant." compact />
                      <span className="text-gray-700">They love <b className="text-orange-600">that</b> restaurant.</span>
                      <span className="text-orange-500 font-bold text-lg">→</span>
                      <span className="text-orange-700 font-medium"><b>That's</b> their favorite restaurant.</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <SpeakButton text="We love this mall. This is our favorite mall." compact />
                      <span className="text-gray-700">We love <b className="text-orange-600">this</b> mall.</span>
                      <span className="text-orange-500 font-bold text-lg">→</span>
                      <span className="text-orange-700 font-medium"><b>This is</b> our favorite mall.</span>
                    </div>
                  </div>
                  <p className="text-sm text-orange-600 mt-3 italic text-center">
                    💡 Rule: <b>that</b> → <b>That's...</b> &nbsp;|&nbsp; <b>this</b> → <b>This is...</b>
                  </p>
                </div>

                {/* ===== IMAGE ===== */}
                <div className="mb-8 flex justify-center">
                  <button
                    onClick={() => setImageModalOpen(true)}
                    className="group relative w-full max-w-4xl focus:outline-none"
                    aria-label="Open infographic in fullscreen"
                    title="Click to enlarge the infographic"
                  >
                    <img
                      src={transformImageUrl}
                      alt="Infográfico de transformação de frases: that / this → That's / This is"
                      className="w-full h-auto rounded-xl shadow-md transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-xl cursor-zoom-in"
                    />
                    <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} />
                      Click to zoom
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fluencyItems.map((item) => (
                    <div key={item.key} className="flex flex-col bg-white p-5 rounded-xl shadow-md border border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-500">Transform {item.key.toUpperCase()}</span>
                        <SpeakButton text={item.english} label="🔊 Listen" compact />
                      </div>
                      <p className="text-orange-700 font-medium mb-2">📝 {item.english}</p>
                      <textarea
                        placeholder="Type your answer here..."
                        value={notes[item.key] || ""}
                        onChange={(e) => handleChange(item.key, e.target.value)}
                        className="w-full h-[80px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                      />
                      <div className="flex gap-3 mt-3 flex-wrap">
                        <button onClick={() => handleCheck(item.key)} disabled={!notes[item.key]?.trim()} className={`flex-1 py-2 px-4 rounded-md transition font-medium ${!notes[item.key]?.trim() ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
                          Check Answer
                        </button>
                        <button onClick={() => { handleChange(item.key, ""); setShowAnswerResults(prev => ({ ...prev, [item.key]: false })); }} className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
                          Clear
                        </button>
                        {notes[item.key]?.trim() && (
                          <SpeakButton text={notes[item.key]} label="🎤 Listen Answer" compact />
                        )}
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
        {/* CHANGE INTO THE PAST */}
        {/* ============================================ */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">⏪ CHANGE INTO THE PAST</h2>
              <button onClick={() => toggleSection('past')} className="ml-4 p-2 rounded-full hover:bg-amber-700 transition">
                {sections.past ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.past && (
            <div className="p-8">
              <div className="bg-amber-100 border-2 border-amber-300 rounded-xl p-6">

                <div className="mb-6 p-5 bg-white rounded-xl border-2 border-amber-200">
                  <h3 className="text-lg font-bold text-amber-800 mb-3">
                    📚 Review: The past forms of "to make" and "to give"
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <SpeakButton text="to make" compact label="🔊" />
                        <span>to make → <span className="text-red-600">made</span></span>
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                        <li>I <b>made</b> a cake.</li>
                        <li>You <b>made</b> dinner.</li>
                        <li>He / She <b>made</b> pizza.</li>
                        <li>We / They <b>made</b> cookies.</li>
                        <li className="text-red-700">Negative: I <b>didn't make</b> a cake.</li>
                        <li className="text-purple-700">Question: <b>Did</b> you <b>make</b> a cake?</li>
                      </ul>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                      <p className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                        <SpeakButton text="to give" compact label="🔊" />
                        <span>to give → <span className="text-red-600">gave</span></span>
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                        <li>I <b>gave</b> a tip.</li>
                        <li>You <b>gave</b> a gift.</li>
                        <li>He / She <b>gave</b> a present.</li>
                        <li>We / They <b>gave</b> a souvenir.</li>
                        <li className="text-red-700">Negative: I <b>didn't give</b> a tip.</li>
                        <li className="text-purple-700">Question: <b>Did</b> you <b>give</b> a tip?</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-sm text-amber-700 mt-4 text-center italic">
                    💡 Now rewrite the sentences below in the <b>simple past</b>. Pay attention to the verb forms of "to make" and "to give".
                  </p>
                </div>

                <div className="space-y-4">
                  {pastExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-white p-4 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-amber-800">{exercise.sentence}</p>
                            <SpeakButton text={exercise.sentence} compact />
                          </div>
                          {/* Portuguese translation below the English sentence */}
                          <p className="text-sm text-gray-600 italic mb-2">🇧🇷 {exercise.pt}</p>
                          <input
                            type="text"
                            value={pastAnswers[exercise.id] || ""}
                            onChange={(e) => handlePastChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-amber-300 rounded-md"
                            placeholder="Write the sentence in the past..."
                          />
                          {pastAnswers[exercise.id]?.trim() && (
                            <div className="mt-1">
                              <SpeakButton text={pastAnswers[exercise.id]} label="🎤 Listen Answer" compact />
                            </div>
                          )}
                          {showPastResults[exercise.id] && <div className="mt-2"><AnswerResult isCorrect={pastAnswerResults[exercise.id]} correctAnswer={exercise.correctAnswer} /></div>}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => handlePastCheck(exercise.id)} className="bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition">Check</button>
                          <button onClick={() => { handlePastChange(exercise.id, ""); setShowPastResults(prev => ({ ...prev, [exercise.id]: false })); }} className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition">Clear</button>
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
        {/* DRILLING PRACTICE - SUBSTITUTION I */}
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
                <h3 className="text-xl font-bold text-blue-800 mb-2">Click on the options to substitute the words:</h3>
                <p className="text-sm text-blue-600 mb-4">
                  👁️ Use the eye icon to hide/show the English answer. 🔊 Click to hear the pronunciation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {substitutionPracticeI.map((exercise) => (
                    <SubstitutionModule
                      key={exercise.key}
                      exercise={exercise}
                      currentIndex={substitutionICurrent[exercise.key] || 0}
                      onOptionClick={handleSubstitutionIOptionClick}
                      accentColor="blue"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE - SUBSTITUTION II */}
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
                <h3 className="text-xl font-bold text-teal-800 mb-2">Click on the options to substitute the words:</h3>
                <p className="text-sm text-teal-600 mb-4">
                  👁️ Use the eye icon to hide/show the English answer. 🔊 Click to hear the pronunciation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {substitutionPracticeII.map((exercise) => (
                    <SubstitutionModule
                      key={exercise.key}
                      exercise={exercise}
                      currentIndex={substitutionIICurrent[exercise.key] || 0}
                      onOptionClick={handleSubstitutionIIOptionClick}
                      accentColor="teal"
                    />
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
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-red-700">{exercise.sentence}</p>
                            <SpeakButton text={exercise.sentence} compact />
                          </div>
                          <input
                            type="text"
                            value={negativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleNegativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-red-300 rounded-md"
                            placeholder="Write the negative form"
                          />
                          {negativeAnswers[exercise.id]?.trim() && (
                            <div className="mt-1">
                              <SpeakButton text={negativeAnswers[exercise.id]} label="🎤 Listen Answer" compact />
                            </div>
                          )}
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
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-green-700">{exercise.sentence}</p>
                            <SpeakButton text={exercise.sentence} compact />
                          </div>
                          <input
                            type="text"
                            value={affirmativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-green-300 rounded-md"
                            placeholder="Write the affirmative form"
                          />
                          {affirmativeAnswers[exercise.id]?.trim() && (
                            <div className="mt-1">
                              <SpeakButton text={affirmativeAnswers[exercise.id]} label="🎤 Listen Answer" compact />
                            </div>
                          )}
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
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-purple-700">{exercise.sentence}</p>
                            <SpeakButton text={exercise.sentence} compact />
                          </div>
                          <input
                            type="text"
                            value={interrogativeAnswers[exercise.id] || ""}
                            onChange={(e) => handleInterrogativeChange(exercise.id, e.target.value)}
                            className="w-full p-2 border border-purple-300 rounded-md"
                            placeholder="Write the question form"
                          />
                          {interrogativeAnswers[exercise.id]?.trim() && (
                            <div className="mt-1">
                              <SpeakButton text={interrogativeAnswers[exercise.id]} label="🎤 Listen Answer" compact />
                            </div>
                          )}
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
                      <div className="flex items-center justify-between mb-3">
                        <p className="font-medium text-yellow-700">{question}</p>
                        <SpeakButton text={question} label="🔊 Listen Question" compact />
                      </div>
                      <textarea
                        value={questionAnswers[`q${index}`] || ""}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="w-full h-24 p-3 border border-yellow-300 rounded-md resize-none"
                        placeholder="Write your answer here..."
                      />
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {questionAnswers[`q${index}`] && (
                          <SpeakButton text={questionAnswers[`q${index}`]} label="🎤 Listen Answer" compact />
                        )}
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

              <div className="bg-white/70 backdrop-blur-md border border-indigo-200 rounded-2xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">📖 Key Vocabulary from Video</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {videoVocabulary.map((word, i) => (
                    <div key={i} className="bg-white rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition flex items-center gap-2 text-sm">
                      <span className="font-medium text-indigo-700">{word.english}</span>
                      <span className="text-indigo-400">→</span>
                      <span className="text-indigo-600">{word.portuguese}</span>
                      <SpeakButton text={word.english} compact label="🔊" className="ml-auto" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-indigo-700">
                        {question.question}
                        {question.isPersonal && <span className="ml-2 text-sm text-indigo-500">(Personal)</span>}
                      </h4>
                      <SpeakButton text={question.question} label="🔊 Listen" compact />
                    </div>
                    <textarea
                      value={videoAnswers[question.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer..."
                      className="w-full h-24 p-3 border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                    />
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {videoAnswers[question.id]?.trim() && (
                        <SpeakButton text={videoAnswers[question.id]} label="🎤 Listen to your answer" compact />
                      )}
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

      {/* ============================================ */}
      {/* IMAGE MODAL — Transform the Sentences Infographic */}
      {/* ============================================ */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.2s ease-out' }}
          onClick={() => setImageModalOpen(false)}
        >
          <button
            onClick={() => setImageModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-3 transition z-10"
            aria-label="Close image"
            title="Close (Esc)"
          >
            <X size={24} />
          </button>
          <img
            src={transformImageUrl}
            alt="Infográfico de transformação de frases: that / this → That's / This is"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}