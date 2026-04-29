"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ArrowLeft, ArrowRight, ShoppingBag, CreditCard, Receipt, Shirt, Smartphone } from "lucide-react";

// ============================================
// LESSON 52 - GOING SHOPPING (EXPRESS YOURSELF)
// ============================================

// ============================================
// DIALOGUE DATA
// ============================================
const dialogueData = {
  title: "🗣️ EXPRESS YOURSELF - At the Clothing Store",
  lines: [
    { speaker: "Sales clerk", text: "Hi! Can I help you?", translation: "Olá! Posso ajudar você?" },
    { speaker: "Customer", text: "No, thank you. I'm just looking around.", translation: "Não, obrigado. Estou só olhando." },
    { speaker: "Sales clerk", text: "Do you need anything special?", translation: "Você precisa de algo especial?" },
    { speaker: "Customer", text: "Yes, I need a new pair of sneakers.", translation: "Sim, preciso de um par de tênis novo." },
    { speaker: "Sales clerk", text: "Really? Our sneakers are on sale. 50% off! Also, we have sunglasses, purses, and wallets.", translation: "Sério? Nossos tênis estão em promoção. 50% de desconto! Também temos óculos de sol, bolsas e carteiras." },
    { speaker: "Customer", text: "Great! I really like these black sneakers.", translation: "Ótimo! Eu gosto muito destes tênis pretos." },
    { speaker: "Sales clerk", text: "Do you want to try the sneakers on? What size are you?", translation: "Você quer experimentar os tênis? Qual é o seu tamanho?" },
    { speaker: "Customer", text: "I'm a size 8. What about these blue pants? Do you have them in medium?", translation: "Eu sou tamanho 8. E estas calças azuis? Você tem no tamanho médio?" },
    { speaker: "Sales clerk", text: "Yes, we do. Do you want to try the pants on, too?", translation: "Sim, temos. Você quer experimentar as calças também?" },
    { speaker: "Customer", text: "Sure.", translation: "Claro." },
    { speaker: "Sales clerk", text: "I really like the pants on you.", translation: "Eu gosto muito das calças em você." },
    { speaker: "Customer", text: "Thank you. I'll take these pants and the pair of sneakers, too.", translation: "Obrigado. Vou levar estas calças e o par de tênis também." },
    { speaker: "Sales clerk", text: "Anything else?", translation: "Mais alguma coisa?" },
    { speaker: "Customer", text: "No, that's all.", translation: "Não, é só isso." },
    { speaker: "Sales clerk", text: "OK. Your total is US$99. Cash or credit?", translation: "OK. Seu total é US$99. Dinheiro ou cartão?" },
    { speaker: "Customer", text: "Credit.", translation: "Crédito." },
    { speaker: "Sales clerk", text: "OK! Here is your receipt.", translation: "OK! Aqui está seu recibo." },
    { speaker: "Customer", text: "Thank you. Bye! Have a good day!", translation: "Obrigado. Tchau! Tenha um bom dia!" },
    { speaker: "Sales clerk", text: "Thank you. Bye!", translation: "Obrigado. Tchau!" }
  ]
};

// ============================================
// VOCABULARY (TAKE A LOOK)
// ============================================
const vocabularyList = [
  { term: "Looking around", translation: "olhando sem intenção específica", example: "I'm just looking around.", audio: "looking_around" },
  { term: "On sale", translation: "em promoção", example: "These sneakers are on sale.", audio: "on_sale" },
  { term: "Try on", translation: "experimentar roupa", example: "Do you want to try them on?", audio: "try_on" },
  { term: "Size", translation: "tamanho", example: "What size are you?", audio: "size" },
  { term: "Medium", translation: "tamanho médio", example: "Do you have medium?", audio: "medium" },
  { term: "Anything else?", translation: "mais alguma coisa?", example: "Anything else?", audio: "anything_else" },
  { term: "Total", translation: "valor total", example: "Your total is $99.", audio: "total" },
  { term: "Cash or credit?", translation: "dinheiro ou cartão?", example: "Cash or credit?", audio: "cash_or_credit" },
  { term: "Receipt", translation: "recibo", example: "Here is your receipt.", audio: "receipt" },
  { term: "Pair of sneakers", translation: "par de tênis", example: "I need a new pair of sneakers.", audio: "pair_of_sneakers" }
];

// ============================================
// SUBSTITUTION PRACTICE I
// ============================================
const substitutionPractice1 = [
  {
    key: "sub1-1",
    original: "Ele não está estudando para a prova hoje.",
    base: "{0} isn't studying for the test today.",
    options: ["He", "She", "We"],
    currentIndex: 0,
    translation: ["Ele", "Ela", "Nós"]
  },
  {
    key: "sub1-2",
    original: "Eu quero ir a uma loja de departamento.",
    base: "I want to go to {0}.",
    options: ["a department store", "an outlet mall", "a garage sale"],
    currentIndex: 0,
    translation: ["uma loja de departamento", "um outlet", "uma venda de garagem"]
  },
  {
    key: "sub1-3",
    original: "Nós estamos procurando pelo provador.",
    base: "We are looking for {0}.",
    options: ["the fitting room", "the ATM", "the attendant"],
    currentIndex: 0,
    translation: ["o provador", "o caixa eletrônico", "o atendente"]
  },
  {
    key: "sub1-4",
    original: "Você tem troco para 20?",
    base: "Do you have change for {0}?",
    options: ["20", "50", "100"],
    currentIndex: 0,
    translation: ["20", "50", "100"]
  },
  {
    key: "sub1-5",
    original: "Estes produtos estão em liquidação.",
    base: "{0} are on sale.",
    options: ["These products", "These items", "These wallets"],
    currentIndex: 0,
    translation: ["Estes produtos", "Estes itens", "Estas carteiras"]
  }
];

// ============================================
// CHANGE INTO NEGATIVE EXERCISES
// ============================================
const negativeExercises = [
  { key: "neg-1", sentence: "You are doing your homework.", answer: "You aren't doing your homework." },
  { key: "neg-2", sentence: "He is talking to the sales clerk.", answer: "He isn't talking to the sales clerk." },
  { key: "neg-3", sentence: "We are having breakfast now.", answer: "We aren't having breakfast now." },
  { key: "neg-4", sentence: "She is looking for her purse.", answer: "She isn't looking for her purse." },
  { key: "neg-5", sentence: "They are wearing new clothes.", answer: "They aren't wearing new clothes." },
  { key: "neg-6", sentence: "She is calling her husband.", answer: "She isn't calling her husband." }
];

// ============================================
// SUBSTITUTION PRACTICE II
// ============================================
const substitutionPractice2 = [
  {
    key: "sub2-1",
    original: "Eu quero fazer compras hoje à tarde.",
    base: "I want to go shopping {0}.",
    options: ["this afternoon", "tonight", "tomorrow"],
    currentIndex: 0,
    translation: ["hoje à tarde", "esta noite", "amanhã"]
  },
  {
    key: "sub2-2",
    original: "Ele prefere pagar em dinheiro.",
    base: "He prefers to pay {0}.",
    options: ["in cash", "with a credit card", "with a debit card"],
    currentIndex: 0,
    translation: ["em dinheiro", "com cartão de crédito", "com cartão de débito"]
  },
  {
    key: "sub2-3",
    original: "Por que você quer vender sua casa?",
    base: "Why do you want to sell {0}?",
    options: ["your house", "your apartment", "your things"],
    currentIndex: 0,
    translation: ["sua casa", "seu apartamento", "suas coisas"]
  },
  {
    key: "sub2-4",
    original: "Eu preciso pagar meu amigo.",
    base: "I need to pay {0}.",
    options: ["my friend", "my coworker", "my neighbor"],
    currentIndex: 0,
    translation: ["meu amigo", "meu colega de trabalho", "meu vizinho"]
  },
  {
    key: "sub2-5",
    original: "Você quer o recibo?",
    base: "Do you want {0}?",
    options: ["the receipt", "the change", "a discount"],
    currentIndex: 0,
    translation: ["o recibo", "o troco", "um desconto"]
  }
];

// ============================================
// CHANGE INTO AFFIRMATIVE
// ============================================
const affirmativeExercises = [
  { key: "aff-1", sentence: "I don't pay US$10 for the medicine.", answer: "I pay US$10 for the medicine." },
  { key: "aff-2", sentence: "I never get a discount at this store.", answer: "I always get a discount at this store." },
  { key: "aff-3", sentence: "She doesn't want to change her style.", answer: "She wants to change her style." },
  { key: "aff-4", sentence: "The receipt isn't in my bag.", answer: "The receipt is in my bag." },
  { key: "aff-5", sentence: "The shoes aren't 10% off.", answer: "The shoes are 10% off." },
  { key: "aff-6", sentence: "I don't want to have a garage sale.", answer: "I want to have a garage sale." }
];

// ============================================
// CHANGE INTO INTERROGATIVE
// ============================================
const interrogativeExercises = [
  { key: "int-1", sentence: "He prefers to pay cash.", answer: "Does he prefer to pay cash?" },
  { key: "int-2", sentence: "You want to buy a new wallet.", answer: "Do you want to buy a new wallet?" },
  { key: "int-3", sentence: "You have some cash in your purse.", answer: "Do you have any cash in your purse?" },
  { key: "int-4", sentence: "They want to go shopping today.", answer: "Do they want to go shopping today?" },
  { key: "int-5", sentence: "He sells books to his friends.", answer: "Does he sell books to his friends?" },
  { key: "int-6", sentence: "You want to change your outfit.", answer: "Do you want to change your outfit?" }
];

// ============================================
// FLUENCY EXERCISES (Present Continuous Contrast)
// ============================================
const fluencyExercises = [
  { key: "flu-1", verb: "to eat", negativeItem: "salad", affirmativeItem: "pasta", modelNegative: "She isn't eating salad.", modelAffirmative: "She's eating pasta." },
  { key: "flu-2", verb: "to wear", negativeItem: "shorts", affirmativeItem: "pants", modelNegative: "He isn't wearing shorts.", modelAffirmative: "He's wearing pants." },
  { key: "flu-3", verb: "to study", negativeItem: "Portuguese", affirmativeItem: "French", modelNegative: "He isn't studying Portuguese.", modelAffirmative: "He's studying French." },
  { key: "flu-4", verb: "to read", negativeItem: "a magazine", affirmativeItem: "a book", modelNegative: "", modelAffirmative: "", isStudent: true },
  { key: "flu-5", verb: "to do", negativeItem: "the dishes", affirmativeItem: "the laundry", modelNegative: "", modelAffirmative: "", isStudent: true },
  { key: "flu-6", verb: "to make", negativeItem: "coffee", affirmativeItem: "popcorn", modelNegative: "", modelAffirmative: "", isStudent: true },
  { key: "flu-7", verb: "to open", negativeItem: "a bottle", affirmativeItem: "a can", modelNegative: "", modelAffirmative: "", isStudent: true },
  { key: "flu-8", verb: "to try on", negativeItem: "a jacket", affirmativeItem: "a coat", modelNegative: "", modelAffirmative: "", isStudent: true }
];

// ============================================
// AUDIO PLAYER COMPONENT
// ============================================
const AudioPlayer = ({ src, compact = false }: { src: string; compact?: boolean }) => {
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
      setProgress(0);
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
      audio.play().catch(err => console.error("Audio error:", err));
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
        className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600 transition`}
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
            className="h-full bg-blue-500 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ============================================
// ANSWER RESULT COMPONENT
// ============================================
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md mt-2">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md mt-2">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Expected:</span> {correctAnswer}
      </span>
    </div>
  );
};

// ============================================
// SUBSTITUTION CARD COMPONENT
// ============================================
const SubstitutionCard = ({ 
  exercise, 
  onOptionClick,
  type 
}: { 
  exercise: any; 
  onOptionClick: (key: string, index: number) => void;
  type: string;
}) => {
  const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
  
  return (
    <div className="bg-white p-5 rounded-lg border-2 border-blue-200 shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 mb-2 text-sm italic">📝 {exercise.original}</p>
      <p className="text-blue-700 font-bold text-lg mb-3">➡️ {currentSentence}</p>
      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => onOptionClick(exercise.key, index)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? `bg-${type === 'blue' ? 'blue' : 'purple'}-500 text-white`
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// FLUENCY STUDENT CARD
// ============================================
const FluencyStudentCard = ({ 
  exercise, 
  studentAnswer, 
  onAnswerChange,
  onCheck,
  showResult,
  isCorrect 
}: { 
  exercise: any; 
  studentAnswer: string;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
  showResult: boolean;
  isCorrect: boolean;
}) => {
  return (
    <div className="bg-white p-5 rounded-lg border-2 border-teal-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
          {exercise.verb}
        </span>
        <span className="text-gray-500 text-sm">❌ not {exercise.negativeItem} → ✅ {exercise.affirmativeItem}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm text-gray-600 mb-1">Negative sentence:</p>
          <input
            type="text"
            placeholder={`He isn't ${exercise.negativeItem}...`}
            value={studentAnswer.split('||')[0] || ""}
            onChange={(e) => onAnswerChange(`${e.target.value}||${studentAnswer.split('||')[1] || ""}`)}
            className="w-full px-3 py-2 border border-teal-300 rounded-md text-sm"
          />
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">Affirmative sentence:</p>
          <input
            type="text"
            placeholder={`He's ${exercise.affirmativeItem}...`}
            value={studentAnswer.split('||')[1] || ""}
            onChange={(e) => onAnswerChange(`${studentAnswer.split('||')[0] || ""}||${e.target.value}`)}
            className="w-full px-3 py-2 border border-teal-300 rounded-md text-sm"
          />
        </div>
      </div>
      <button
        onClick={onCheck}
        className="mt-3 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition text-sm"
      >
        Check Answer
      </button>
      {showResult && (
        <div className="mt-2">
          {isCorrect ? (
            <div className="flex items-center gap-2 text-green-600">
              <Check size={16} /> Great job! Perfect contrast!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle size={16} /> Try again! Use: isn't/aren't + -ing for negative, and is/are + -ing for affirmative.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson52GoingShopping() {
  const router = useRouter();
  
  // SECTION VISIBILITY STATE
  const [sections, setSections] = useState({
    dialogue: true,
    vocabulary: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    fluency: true
  });

  // EXERCISE STATES
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [fluencyAnswers, setFluencyAnswers] = useState<Record<string, string>>({});
  const [fluencyResults, setFluencyResults] = useState<Record<string, boolean>>({});
  const [showFluencyResults, setShowFluencyResults] = useState<Record<string, boolean>>({});

  // ============================================
  // PERSISTENCE - LOAD
  // ============================================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson52Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setFluencyAnswers(data.fluencyAnswers || {});
        setFluencyResults(data.fluencyResults || {});
        setShowFluencyResults(data.showFluencyResults || {});
        if (data.sections) setSections(data.sections);
        console.log("✅ Lesson 52 data loaded from localStorage");
      } catch (error) {
        console.error("❌ Error loading saved answers:", error);
      }
    }
  }, []);

  // ============================================
  // PERSISTENCE - SAVE
  // ============================================
  const saveAllAnswers = () => {
    const data = {
      subs1Exercises,
      subs2Exercises,
      writtenAnswers,
      answerResults,
      showAnswerResults,
      fluencyAnswers,
      fluencyResults,
      showFluencyResults,
      sections,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 52 - Going Shopping",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson52Answers", JSON.stringify(data));
      alert("✅ All your answers have been saved successfully!");
    } catch (error) {
      console.error("❌ Error saving answers:", error);
      alert("❌ Error saving answers. Please try again.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL your answers? This action cannot be undone.")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setFluencyAnswers({});
      setFluencyResults({});
      setShowFluencyResults({});
      localStorage.removeItem("lesson52Answers");
      alert("✅ All answers have been cleared.");
    }
  };

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubs1OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs1Exercises(prev =>
      prev.map(exercise =>
        exercise.key === exerciseKey
          ? { ...exercise, currentIndex: optionIndex }
          : exercise
      )
    );
  };

  const handleSubs2OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs2Exercises(prev =>
      prev.map(exercise =>
        exercise.key === exerciseKey
          ? { ...exercise, currentIndex: optionIndex }
          : exercise
      )
    );
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
    const isCorrect = normalize(userAnswer) === normalize(correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  const handleFluencyAnswerChange = (key: string, value: string) => {
    setFluencyAnswers(prev => ({ ...prev, [key]: value }));
  };

  const checkFluencyAnswer = (key: string, userAnswer: string, correctNegative: string, correctAffirmative: string) => {
    const parts = userAnswer.split('||');
    const userNegative = parts[0]?.trim() || "";
    const userAffirmative = parts[1]?.trim() || "";
    const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
    const isCorrect = normalize(userNegative) === normalize(correctNegative) && normalize(userAffirmative) === normalize(correctAffirmative);
    setFluencyResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowFluencyResults(prev => ({ ...prev, [key]: true }));
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div 
      className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-fixed" 
      style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070')` }}
    >
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">📘 LESSON 52 – GOING SHOPPING</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            🗣️ <span className="font-bold text-blue-600">EXPRESS YOURSELF</span> — Aprenda diálogos de compras, vocabulário essencial, 
            e pratique <span className="font-bold">Present Continuous, negativas, afirmativas e interrogativas</span>.
          </p>
        </div>

        {/* ======================================== */}
        {/* DIALOGUE SECTION */}
        {/* ======================================== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 DIALOGUE – At the Clothing Store</h2>
              <button onClick={() => toggleSection('dialogue')} className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition">
                {sections.dialogue ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l52_dialogue.mp3" />
          </div>

          {sections.dialogue && (
            <div className="p-8">
              <div className="space-y-4">
                {dialogueData.lines.map((line, idx) => (
                  <div key={idx} className={`p-4 rounded-xl ${line.speaker === 'Sales clerk' ? 'bg-blue-100 border-l-8 border-blue-500' : 'bg-green-100 border-l-8 border-green-500'}`}>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-lg">
                        {line.speaker === 'Sales clerk' ? '🛍️ ' : '👤 '}
                        {line.speaker}:
                      </p>
                      <button 
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(line.text);
                          utterance.lang = 'en-US';
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="text-gray-500 hover:text-indigo-600"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-800 text-lg mt-1">{line.text}</p>
                    <p className="text-gray-500 text-sm italic mt-1">📖 {line.translation}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-center">
                <p className="text-yellow-700 font-medium">💡 Practice tip: Read the dialogue aloud, alternating roles with a partner!</p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* TAKE A LOOK - VOCABULARY */}
        {/* ======================================== */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔍 TAKE A LOOK – Vocabulary Focus</h2>
              <button onClick={() => toggleSection('vocabulary')} className="ml-4 p-2 rounded-full hover:bg-blue-700 transition">
                {sections.vocabulary ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.vocabulary && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vocabularyList.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-blue-700">{item.term}</h3>
                      <button 
                        onClick={() => {
                          const utterance = new SpeechSynthesisUtterance(item.term);
                          utterance.lang = 'en-US';
                          window.speechSynthesis.cancel();
                          window.speechSynthesis.speak(utterance);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">📖 {item.translation}</p>
                    <p className="text-gray-600 text-sm italic mt-2">✨ "{item.example}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* SUBSTITUTION PRACTICE I */}
        {/* ======================================== */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button onClick={() => toggleSection('substitution1')} className="ml-4 p-2 rounded-full hover:bg-blue-700 transition">
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <p className="text-blue-700 mb-6 font-medium italic">Substitua as partes destacadas clicando nas opções:</p>
              <div className="space-y-6">
                {subs1Exercises.map((exercise) => (
                  <SubstitutionCard 
                    key={exercise.key}
                    exercise={exercise}
                    onOptionClick={handleSubs1OptionClick}
                    type="blue"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* CHANGE INTO NEGATIVE */}
        {/* ======================================== */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">⛔ CHANGE INTO NEGATIVE (Use contrações)</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-red-600 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="space-y-4">
                {negativeExercises.map((exercise) => (
                  <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-red-200">
                    <p className="font-medium text-gray-800 mb-2">🔹 {exercise.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Write negative form..."
                        value={writtenAnswers[exercise.key] || ""}
                        onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleWrittenAnswerChange(exercise.key, exercise.answer);
                            handleCheckAnswer(exercise.key, exercise.answer, exercise.answer);
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Show
                        </button>
                      </div>
                    </div>
                    {showAnswerResults[exercise.key] && (
                      <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* SUBSTITUTION PRACTICE II */}
        {/* ======================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button onClick={() => toggleSection('substitution2')} className="ml-4 p-2 rounded-full hover:bg-purple-700 transition">
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 font-medium italic">Substitua as partes destacadas clicando nas opções:</p>
              <div className="space-y-6">
                {subs2Exercises.map((exercise) => (
                  <SubstitutionCard 
                    key={exercise.key}
                    exercise={exercise}
                    onOptionClick={handleSubs2OptionClick}
                    type="purple"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* CHANGE INTO AFFIRMATIVE */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-teal-600 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="space-y-4">
                {affirmativeExercises.map((exercise) => (
                  <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-teal-200">
                    <p className="font-medium text-gray-800 mb-2">🔹 {exercise.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Write affirmative form..."
                        value={writtenAnswers[exercise.key] || ""}
                        onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleWrittenAnswerChange(exercise.key, exercise.answer);
                            handleCheckAnswer(exercise.key, exercise.answer, exercise.answer);
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Show
                        </button>
                      </div>
                    </div>
                    {showAnswerResults[exercise.key] && (
                      <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* CHANGE INTO INTERROGATIVE */}
        {/* ======================================== */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-yellow-700 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="space-y-4">
                {interrogativeExercises.map((exercise) => (
                  <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-yellow-200">
                    <p className="font-medium text-gray-800 mb-2">🔹 {exercise.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Write interrogative form..."
                        value={writtenAnswers[exercise.key] || ""}
                        onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition text-sm"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => {
                            handleWrittenAnswerChange(exercise.key, exercise.answer);
                            handleCheckAnswer(exercise.key, exercise.answer, exercise.answer);
                          }}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Show
                        </button>
                      </div>
                    </div>
                    {showAnswerResults[exercise.key] && (
                      <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* FLUENCY - SPEAKING PRACTICE */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ FLUENCY – Speaking Practice</h2>
              <button onClick={() => toggleSection('fluency')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="bg-teal-100 p-5 rounded-xl mb-6">
                <h3 className="text-xl font-bold text-teal-800 mb-3">🎯 Present Continuous Contrast</h3>
                <p className="text-teal-700 mb-2">📌 <strong>Model:</strong> She isn't eating salad. She's eating pasta.</p>
                <p className="text-teal-700">👉 Crie frases negativas + afirmativas usando o Present Continuous.</p>
              </div>
              
              <div className="space-y-6">
                {/* Model examples (first 3) */}
                {fluencyExercises.slice(0, 3).map((exercise) => (
                  <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-teal-200">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                        {exercise.verb}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-red-600 font-medium">❌ Negative:</p>
                        <p className="text-gray-800">{exercise.modelNegative}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-green-600 font-medium">✅ Affirmative:</p>
                        <p className="text-gray-800">{exercise.modelAffirmative}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Student practice */}
                {fluencyExercises.slice(3).map((exercise) => (
                  <FluencyStudentCard
                    key={exercise.key}
                    exercise={exercise}
                    studentAnswer={fluencyAnswers[exercise.key] || ""}
                    onAnswerChange={(value) => handleFluencyAnswerChange(exercise.key, value)}
                    onCheck={() => {
                      const parts = fluencyAnswers[exercise.key]?.split('||') || ["", ""];
                      const expectedNegative = `He isn't ${exercise.negativeItem}.`;
                      const expectedAffirmative = `He's ${exercise.affirmativeItem}.`;
                      checkFluencyAnswer(exercise.key, fluencyAnswers[exercise.key] || "", expectedNegative, expectedAffirmative);
                    }}
                    showResult={showFluencyResults[exercise.key] || false}
                    isCorrect={fluencyResults[exercise.key] || false}
                  />
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-teal-100 to-green-100 p-5 rounded-xl border border-teal-300">
                <h4 className="font-bold text-teal-800 mb-2">💡 Objetivo da atividade:</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Desenvolver autonomia na criação de frases</li>
                  <li>Estimular criatividade com situações do dia a dia</li>
                  <li>Praticar Present Continuous (negative + affirmative)</li>
                  <li>Produzir frases reais baseadas em contextos de compras e ações cotidianas</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* SAVE & NAVIGATION BUTTONS */}
        {/* ======================================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2 shadow-md"
            >
              <span>💾</span> Save All My Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300 shadow-md"
            >
              Clear All
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson51")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson53")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 52 – Going Shopping | Express Yourself: Dialogue, Vocabulary, and Present Continuous Practice</p>
          <p className="mt-1">© 2025 - English Learning Platform | Practice makes perfect! 🛍️</p>
        </div>
      </div>
    </div>
  );
}