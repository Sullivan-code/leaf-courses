"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// LISTEN ITEMS - Imagens (EMBARALHADAS NA TELA)
// ORDEM CORRETA: 1. mulher sorrindo → 2. refletindo sobre a vida → 3. casal assistindo tv juntos
// ============================================

// Imagem: Mulher sorrindo - PRIMEIRO NA ORDEM (1)
const image3Url = "/images/3-mulher-sorrindo.jpg";

// Imagem: Refletindo sobre a vida (Homem pensando) - SEGUNDO NA ORDEM (2)
const image1Url = "/images/1-refletindo.jpg";

// Imagem: Casal assistindo TV juntos - TERCEIRO NA ORDEM (3)
const image2Url = "/images/2-casal.jpg";

const listenItemsOriginal = [
  { 
    key: "image3", 
    label: "mulher sorrindo", 
    image: image3Url,
    placeholder: "😊",
    description: "Mulher com um lindo sorriso",
    correctNumber: 1,
    bgColor: "from-pink-100 to-rose-100"
  },
  { 
    key: "image1", 
    label: "refletindo sobre a vida", 
    image: image1Url,
    placeholder: "🤔",
    description: "Homem pensando, refletindo sobre a vida",
    correctNumber: 2,
    bgColor: "from-purple-100 to-blue-100"
  },
  { 
    key: "image2", 
    label: "casal assistindo tv juntos", 
    image: image2Url,
    placeholder: "👫📺",
    description: "Casal assistindo televisão juntos no sofá",
    correctNumber: 3,
    bgColor: "from-indigo-100 to-purple-100"
  },
];

// Função para embaralhar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// DRILLING PRACTICE I - Substitution Practice (PAST TENSE)
// ============================================
const drillingExercises1 = [
  {
    id: 1,
    portuguese: "Ele escreveu coisas engraçadas.",
    english: "He wrote funny things.",
    audio: "",
    substitutions: [
      { word: "interessantes", english: "interesting", phrase: "He wrote interesting things.", audio: "" },
      { word: "importantes", english: "important", phrase: "He wrote important things.", audio: "" }
    ]
  },
  {
    id: 2,
    portuguese: "Eu pensei que era importante estudar inglês.",
    english: "I thought it was important to study English.",
    audio: "",
    substitutions: [
      { word: "aprender", english: "to learn", phrase: "I thought it was important to learn English.", audio: "" },
      { word: "falar", english: "to speak", phrase: "I thought it was important to speak English.", audio: "" }
    ]
  },
  {
    id: 3,
    portuguese: "Você achou que era engraçado?",
    english: "Did you think it was funny?",
    audio: "",
    substitutions: [
      { word: "difícil", english: "difficult", phrase: "Did you think it was difficult?", audio: "" },
      { word: "fácil", english: "easy", phrase: "Did you think it was easy?", audio: "" }
    ]
  }
];

// ============================================
// PAST TENSE EXERCISES - Simple Past
// ============================================
const pastTenseExercises = [
  { id: 1, present: "I think about the problem.", past: "I thought about the problem.", userAnswer: "", audio: "" },
  { id: 2, present: "They study together every day.", past: "They studied together yesterday.", userAnswer: "", audio: "" },
  { id: 3, present: "We need to write a story.", past: "We needed to write a story.", userAnswer: "", audio: "" },
  { id: 4, present: "She has great ideas.", past: "She had great ideas.", userAnswer: "", audio: "" },
  { id: 5, present: "He goes to the office on Thursdays.", past: "He went to the office last Thursday.", userAnswer: "", audio: "" },
  { id: 6, present: "She meets everybody on weekends.", past: "She met everybody last weekend.", userAnswer: "", audio: "" },
];

// ============================================
// PRESENT PERFECT EXERCISES
// ============================================
const presentPerfectExercises = [
  { id: 1, sentence: "I have studied English for five years.", userAnswer: "", audio: "" },
  { id: 2, sentence: "She has never been to London.", userAnswer: "", audio: "" },
  { id: 3, sentence: "They have already finished their homework.", userAnswer: "", audio: "" },
  { id: 4, sentence: "We have just eaten lunch.", userAnswer: "", audio: "" },
  { id: 5, sentence: "He has written three books.", userAnswer: "", audio: "" },
  { id: 6, sentence: "Have you ever visited Paris?", userAnswer: "", audio: "" },
];

// ============================================
// PAST PERFECT EXERCISES
// ============================================
const pastPerfectExercises = [
  { id: 1, sentence: "She had already left when I arrived.", userAnswer: "", audio: "" },
  { id: 2, sentence: "They had never seen such a beautiful place.", userAnswer: "", audio: "" },
  { id: 3, sentence: "He had finished his work before the meeting started.", userAnswer: "", audio: "" },
  { id: 4, sentence: "We had already eaten when they arrived.", userAnswer: "", audio: "" },
  { id: 5, sentence: "I had never thought about that before.", userAnswer: "", audio: "" },
  { id: 6, sentence: "Had you ever tried sushi before that day?", userAnswer: "", audio: "" },
];

// ============================================
// FUTURE TENSE EXERCISES
// ============================================
const futureExercises = [
  { id: 1, sentence: "I will study English tomorrow.", userAnswer: "", audio: "" },
  { id: 2, sentence: "She is going to travel next week.", userAnswer: "", audio: "" },
  { id: 3, sentence: "They will call you later.", userAnswer: "", audio: "" },
  { id: 4, sentence: "We are going to buy a new car.", userAnswer: "", audio: "" },
  { id: 5, sentence: "He will arrive at 8 PM.", userAnswer: "", audio: "" },
  { id: 6, sentence: "Will you come to the party?", userAnswer: "", audio: "" },
];

// ============================================
// QUESTIONS IN THE PAST (DID)
// ============================================
const pastQuestionsExercises = [
  { id: 1, statement: "You went to the movies yesterday.", question: "Did you go to the movies yesterday?", userAnswer: "", audio: "" },
  { id: 2, statement: "She ate pizza for dinner.", question: "Did she eat pizza for dinner?", userAnswer: "", audio: "" },
  { id: 3, statement: "They played soccer last weekend.", question: "Did they play soccer last weekend?", userAnswer: "", audio: "" },
  { id: 4, statement: "He woke up early this morning.", question: "Did he wake up early this morning?", userAnswer: "", audio: "" },
  { id: 5, statement: "We visited our grandparents.", question: "Did we visit our grandparents?", userAnswer: "", audio: "" },
  { id: 6, statement: "She bought a new dress.", question: "Did she buy a new dress?", userAnswer: "", audio: "" },
];

// ============================================
// SPEAK RIGHT NOW CARDS - Questions (All Tenses)
// ============================================
const speakCards = [
  { 
    id: 1, 
    question: "What did you do yesterday?", 
    answer: "Yesterday I studied English and watched a movie.",
    translation: "O que você fez ontem?",
    answerTranslation: "Ontem eu estudei inglês e assisti um filme.",
    audio: ""
  },
  { 
    id: 2, 
    question: "Have you ever traveled abroad?", 
    answer: "Yes, I have traveled to the United States.",
    translation: "Você já viajou para o exterior?",
    answerTranslation: "Sim, eu viajei para os Estados Unidos.",
    audio: ""
  },
  { 
    id: 3, 
    question: "What had you already done before the party started?", 
    answer: "I had already eaten dinner before the party started.",
    translation: "O que você já tinha feito antes da festa começar?",
    answerTranslation: "Eu já tinha jantado antes da festa começar.",
    audio: ""
  },
  { 
    id: 4, 
    question: "What will you do next weekend?", 
    answer: "I will visit my family next weekend.",
    translation: "O que você fará no próximo fim de semana?",
    answerTranslation: "Eu visitarei minha família no próximo fim de semana.",
    audio: ""
  },
  { 
    id: 5, 
    question: "Did you like the movie?", 
    answer: "Yes, I liked the movie very much.",
    translation: "Você gostou do filme?",
    answerTranslation: "Sim, eu gostei muito do filme.",
    audio: ""
  },
  { 
    id: 6, 
    question: "How long have you studied English?", 
    answer: "I have studied English for three years.",
    translation: "Há quanto tempo você estuda inglês?",
    answerTranslation: "Eu estudo inglês há três anos.",
    audio: ""
  },
  { 
    id: 7, 
    question: "What are you going to do tomorrow?", 
    answer: "I am going to work and then go to the gym.",
    translation: "O que você vai fazer amanhã?",
    answerTranslation: "Eu vou trabalhar e depois ir para a academia.",
    audio: ""
  },
  { 
    id: 8, 
    question: "Had you ever seen that before?", 
    answer: "No, I had never seen anything like that.",
    translation: "Você já tinha visto aquilo antes?",
    answerTranslation: "Não, eu nunca tinha visto nada parecido.",
    audio: ""
  },
  { 
    id: 9, 
    question: "Will you help me with this project?", 
    answer: "Yes, I will help you with the project.",
    translation: "Você vai me ajudar com este projeto?",
    answerTranslation: "Sim, eu vou te ajudar com o projeto.",
    audio: ""
  },
  { 
    id: 10, 
    question: "Why did you choose to learn English?", 
    answer: "I chose to learn English because it's important for my career.",
    translation: "Por que você escolheu aprender inglês?",
    answerTranslation: "Eu escolhi aprender inglês porque é importante para minha carreira.",
    audio: ""
  },
];

// ============================================
// KEY VOCABULARY - WEATHER & MOOD THEMED (para TUNE IN YOUR EARS)
// ============================================
const keyVocabulary = [
  { word: "a bit", meaning: "um pouco" },
  { word: "mood", meaning: "temperamento / humor" },
  { word: "kind of", meaning: "meio que" },
  { word: "weather", meaning: "clima, tempo" },
  { word: "walk up someone", meaning: "chegar em alguém" },
  { word: "summer person", meaning: "uma pessoa que curte o verão" },
  { word: "cloudy", meaning: "nublado" },
  { word: "breeze", meaning: "brisa" },
  { word: "rainy weather", meaning: "clima chuvoso" },
  { word: "energetic", meaning: "cheio de energia" },
  { word: "What's the weather like?", meaning: "Como está o tempo? (clima)" },
  { word: "warm", meaning: "quente de forma confortável" },
  { word: "hot", meaning: "quente de forma desconfortável" },
  { word: "autumn", meaning: "outono" },
  { word: "Nothing beats a clear blue sky", meaning: "nada ganha de um céu azul limpo" },
  { word: "fair", meaning: "justo" },
  { word: "It's pouring", meaning: "Está chovendo" },
  { word: "It gets slushy", meaning: "Fica lamacento" },
  { word: "Weather forecast", meaning: "Previsão do tempo" },
  { word: "changing leaves", meaning: "folhas mudando" },
  { word: "Every cloud has a silver lining", meaning: "Não há mal que não traga algum bem" },
];

// ============================================
// VIDEO QUESTIONS ABOUT WEATHER, MOODS, SEASONS
// ============================================
const videoQuestions = [
  { id: "video-1", question: "What's your favorite type of weather? Why?", isPersonal: true },
  { id: "video-2", question: "Are you a summer person or do you prefer colder seasons?", isPersonal: true },
  { id: "video-3", question: "How does rainy weather affect your mood?", isPersonal: true },
  { id: "video-4", question: "Do you prefer warm or hot weather? Explain the difference.", isPersonal: true },
  { id: "video-5", question: "What do you like to do on a cloudy day with a nice breeze?", isPersonal: true },
  { id: "video-6", question: "How do changing leaves in autumn make you feel?", isPersonal: true },
  { id: "video-7", question: "Have you ever walked up to someone on a sunny day? Describe the situation.", isPersonal: true },
  { id: "video-8", question: "What does 'Every cloud has a silver lining' mean to you? Give an example.", isPersonal: true },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
  textToSpeak?: string;
}

const AudioPlayer = ({ src, compact = false, textToSpeak = "" }: AudioPlayerProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakWithWebSpeech = () => {
    const text = textToSpeak;
    if (!text && !src) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Google UK Female') || 
         voice.name.includes('Samantha') ||
         voice.name.includes('Female'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const togglePlayPause = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      speakWithWebSpeech();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button 
        onClick={togglePlayPause} 
        className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600 transition`}
        title="Listen (Text-to-Speech)"
      >
        {isSpeaking ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
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
        <span className="text-sm text-green-700 font-medium">Correct! ✓</span>
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

// Component SpeakSentence para TTS
const SpeakSentence = ({ text, children, className = "" }: { text: string; children?: React.ReactNode; className?: string }) => {
  const speak = () => {
    const speechText = children && typeof children === 'string' ? children : text;
    if (speechText && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <button onClick={speak} className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors ${className}`}>
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// ============================================
// COMPONENTE PRINCIPAL - LESSON 36
// ============================================

export default function Lesson36() {
  const router = useRouter();
  
  // Estados para as respostas do Listen
  const [listenAnswers, setListenAnswers] = useState<Record<string, number | null>>({});
  const [showListenResults, setShowListenResults] = useState<Record<string, boolean>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  
  // Estados para os exercícios de drilling 1
  const [drilling1Sentences, setDrilling1Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de passado
  const [pastTenseEx, setPastTenseEx] = useState(pastTenseExercises);
  const [pastTenseResults, setPastTenseResults] = useState<Record<number, boolean>>({});
  const [showPastTenseResults, setShowPastTenseResults] = useState<Record<number, boolean>>({});
  
  // Estados para present perfect
  const [presentPerfectEx, setPresentPerfectEx] = useState(presentPerfectExercises);
  const [presentPerfectResults, setPresentPerfectResults] = useState<Record<number, boolean>>({});
  const [showPresentPerfectResults, setShowPresentPerfectResults] = useState<Record<number, boolean>>({});
  
  // Estados para past perfect
  const [pastPerfectEx, setPastPerfectEx] = useState(pastPerfectExercises);
  const [pastPerfectResults, setPastPerfectResults] = useState<Record<number, boolean>>({});
  const [showPastPerfectResults, setShowPastPerfectResults] = useState<Record<number, boolean>>({});
  
  // Estados para future
  const [futureEx, setFutureEx] = useState(futureExercises);
  const [futureResults, setFutureResults] = useState<Record<number, boolean>>({});
  const [showFutureResults, setShowFutureResults] = useState<Record<number, boolean>>({});
  
  // Estados para past questions
  const [pastQuestionsEx, setPastQuestionsEx] = useState(pastQuestionsExercises);
  const [pastQuestionsResults, setPastQuestionsResults] = useState<Record<number, boolean>>({});
  const [showPastQuestionsResults, setShowPastQuestionsResults] = useState<Record<number, boolean>>({});
  
  // Estado para o Speak Right Now
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakUserAnswer, setSpeakUserAnswer] = useState("");
  const [showSpeakResult, setShowSpeakResult] = useState(false);
  const [speakResult, setSpeakResult] = useState(false);
  
  // Estados para TUNE IN YOUR EARS
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  
  // Estados para controle de expansão das seções
  const [sections, setSections] = useState({
    listen: true,
    drilling1: true,
    pastTense: true,
    presentPerfect: true,
    pastPerfect: true,
    future: true,
    pastQuestions: true,
    speak: true,
    tuneIn: true
  });

  // Estado para armazenar a sequência de números que o aluno selecionou
  const [imageSequence, setImageSequence] = useState<number[]>([]);
  const [showFinalSequenceResult, setShowFinalSequenceResult] = useState(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState(false);
  
  // Estado para armazenar a lista de itens embaralhados
  const [shuffledListenItems, setShuffledListenItems] = useState(listenItemsOriginal);
  const [isHydrated, setIsHydrated] = useState(false);

  // Embaralhar as imagens
  useEffect(() => {
    setShuffledListenItems(shuffleArray(listenItemsOriginal));
    setIsHydrated(true);
  }, []);

  // Persistência
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson36Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        if (data.listenAnswers) setListenAnswers(data.listenAnswers);
        if (data.showListenResults) setShowListenResults(data.showListenResults);
        if (data.listenResults) setListenResults(data.listenResults);
        if (data.drilling1Sentences) setDrilling1Sentences(data.drilling1Sentences);
        if (data.pastTenseEx) setPastTenseEx(data.pastTenseEx);
        if (data.pastTenseResults) setPastTenseResults(data.pastTenseResults);
        if (data.showPastTenseResults) setShowPastTenseResults(data.showPastTenseResults);
        if (data.presentPerfectEx) setPresentPerfectEx(data.presentPerfectEx);
        if (data.presentPerfectResults) setPresentPerfectResults(data.presentPerfectResults);
        if (data.showPresentPerfectResults) setShowPresentPerfectResults(data.showPresentPerfectResults);
        if (data.pastPerfectEx) setPastPerfectEx(data.pastPerfectEx);
        if (data.pastPerfectResults) setPastPerfectResults(data.pastPerfectResults);
        if (data.showPastPerfectResults) setShowPastPerfectResults(data.showPastPerfectResults);
        if (data.futureEx) setFutureEx(data.futureEx);
        if (data.futureResults) setFutureResults(data.futureResults);
        if (data.showFutureResults) setShowFutureResults(data.showFutureResults);
        if (data.pastQuestionsEx) setPastQuestionsEx(data.pastQuestionsEx);
        if (data.pastQuestionsResults) setPastQuestionsResults(data.pastQuestionsResults);
        if (data.showPastQuestionsResults) setShowPastQuestionsResults(data.showPastQuestionsResults);
        if (data.currentCardIndex !== undefined) setCurrentCardIndex(data.currentCardIndex);
        if (data.speakUserAnswer) setSpeakUserAnswer(data.speakUserAnswer);
        if (data.showSpeakResult !== undefined) setShowSpeakResult(data.showSpeakResult);
        if (data.speakResult !== undefined) setSpeakResult(data.speakResult);
        if (data.sections) setSections(data.sections);
        if (data.imageSequence) setImageSequence(data.imageSequence);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      listenAnswers,
      showListenResults,
      listenResults,
      drilling1Sentences,
      pastTenseEx,
      pastTenseResults,
      showPastTenseResults,
      presentPerfectEx,
      presentPerfectResults,
      showPresentPerfectResults,
      pastPerfectEx,
      pastPerfectResults,
      showPastPerfectResults,
      futureEx,
      futureResults,
      showFutureResults,
      pastQuestionsEx,
      pastQuestionsResults,
      showPastQuestionsResults,
      currentCardIndex,
      speakUserAnswer,
      showSpeakResult,
      speakResult,
      sections,
      imageSequence,
      videoAnswers,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 36 - Past, Present Perfect, Past Perfect, Future",
    };
    
    try {
      localStorage.setItem("lesson36Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas?")) {
      setListenAnswers({});
      setShowListenResults({});
      setListenResults({});
      setDrilling1Sentences(Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english])));
      setPastTenseEx(pastTenseExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setPastTenseResults({});
      setShowPastTenseResults({});
      setPresentPerfectEx(presentPerfectExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setPresentPerfectResults({});
      setShowPresentPerfectResults({});
      setPastPerfectEx(pastPerfectExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setPastPerfectResults({});
      setShowPastPerfectResults({});
      setFutureEx(futureExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setFutureResults({});
      setShowFutureResults({});
      setPastQuestionsEx(pastQuestionsExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setPastQuestionsResults({});
      setShowPastQuestionsResults({});
      setCurrentCardIndex(0);
      setSpeakUserAnswer("");
      setShowSpeakResult(false);
      setSpeakResult(false);
      setImageSequence([]);
      setShowFinalSequenceResult(false);
      setVideoAnswers({});
      setShowVideoResults({});
      localStorage.removeItem("lesson36Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImageClickForSequence = (correctNumber: number) => {
    if (imageSequence.includes(correctNumber)) {
      alert(`⚠️ O número ${correctNumber} já foi adicionado à sua sequência! Escolha uma imagem diferente.`);
      return;
    }
    setImageSequence(prev => [...prev, correctNumber]);
    setShowFinalSequenceResult(false);
  };

  const resetSequence = () => {
    setImageSequence([]);
    setShowFinalSequenceResult(false);
    setIsSequenceCorrect(false);
  };

  const checkSequence = () => {
    const correctSequence = [1, 2, 3];
    
    if (imageSequence.length !== 3) {
      alert(`⚠️ Você precisa selecionar as 3 imagens na ordem correta! Você selecionou ${imageSequence.length} imagem(ns).`);
      return;
    }
    
    let isCorrect = true;
    for (let i = 0; i < 3; i++) {
      if (imageSequence[i] !== correctSequence[i]) {
        isCorrect = false;
        break;
      }
    }
    
    setIsSequenceCorrect(isCorrect);
    setShowFinalSequenceResult(true);
  };

  const handleListenSelect = (key: string, number: number) => {
    setListenAnswers(prev => ({ ...prev, [key]: number }));
    setShowListenResults(prev => ({ ...prev, [key]: false }));
  };

  const handleListenCheck = (key: string, correctNumber: number) => {
    const isCorrect = listenAnswers[key] === correctNumber;
    setListenResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowListenResults(prev => ({ ...prev, [key]: true }));
  };

  const handlePastTenseChange = (id: number, value: string) => {
    setPastTenseEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowPastTenseResults(prev => ({ ...prev, [id]: false }));
  };

  const handlePastTenseCheck = (id: number, correctPast: string) => {
    const exercise = pastTenseEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctPast.toLowerCase().trim();
      setPastTenseResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowPastTenseResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handlePresentPerfectChange = (id: number, value: string) => {
    setPresentPerfectEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowPresentPerfectResults(prev => ({ ...prev, [id]: false }));
  };

  const handlePresentPerfectCheck = (id: number, correctSentence: string) => {
    const exercise = presentPerfectEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctSentence.toLowerCase().trim();
      setPresentPerfectResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowPresentPerfectResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handlePastPerfectChange = (id: number, value: string) => {
    setPastPerfectEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowPastPerfectResults(prev => ({ ...prev, [id]: false }));
  };

  const handlePastPerfectCheck = (id: number, correctSentence: string) => {
    const exercise = pastPerfectEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctSentence.toLowerCase().trim();
      setPastPerfectResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowPastPerfectResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleFutureChange = (id: number, value: string) => {
    setFutureEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowFutureResults(prev => ({ ...prev, [id]: false }));
  };

  const handleFutureCheck = (id: number, correctSentence: string) => {
    const exercise = futureEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctSentence.toLowerCase().trim();
      setFutureResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowFutureResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handlePastQuestionsChange = (id: number, value: string) => {
    setPastQuestionsEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowPastQuestionsResults(prev => ({ ...prev, [id]: false }));
  };

  const handlePastQuestionsCheck = (id: number, correctQuestion: string) => {
    const exercise = pastQuestionsEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctQuestion.toLowerCase().trim();
      setPastQuestionsResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowPastQuestionsResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleSpeakCheck = () => {
    const currentCard = speakCards[currentCardIndex];
    const isCorrect = speakUserAnswer.toLowerCase().includes(currentCard.answer.toLowerCase()) || 
                     speakUserAnswer.length > 15;
    setSpeakResult(isCorrect);
    setShowSpeakResult(true);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % speakCards.length);
    setSpeakUserAnswer("");
    setShowSpeakResult(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + speakCards.length) % speakCards.length);
    setSpeakUserAnswer("");
    setShowSpeakResult(false);
  };

  const handleVideoAnswerChange = (id: string, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
    setShowVideoResults(prev => ({ ...prev, [id]: false }));
  };

  const checkVideoAnswer = (id: string) => {
    setShowVideoResults(prev => ({ ...prev, [id]: true }));
  };

  const currentCard = speakCards[currentCardIndex];

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 36</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 PAST TENSES, PRESENT PERFECT, PAST PERFECT & FUTURE
          </p>
          <p className="text-md text-gray-500 mt-2">Master all tenses with audio! 🎵</p>
        </div>

        {/* ============================================ */}
        {/* LISTEN AND NUMBER - Imagens */}
        {/* ORDEM CORRETA: 1. mulher sorrindo → 2. refletindo sobre a vida → 3. casal assistindo tv juntos */}
        {/* ============================================ */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
              <button onClick={() => toggleSection('listen')} className="ml-4 p-2 rounded-full hover:bg-purple-700 transition">
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <AudioPlayer src="" textToSpeak="Number one: a smiling woman. Number two: a man thinking about life. Number three: a couple watching TV together." />
              <audio id="listenAudio" src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L36listening.mp3" />
              <button 
                onClick={() => {
                  const audio = document.getElementById('listenAudio') as HTMLAudioElement;
                  if (audio) {
                    if (audio.paused) {
                      audio.play();
                    } else {
                      audio.pause();
                      audio.currentTime = 0;
                    }
                  }
                }}
                className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition"
                title="Play Listening Audio"
              >
                <Play size={16} />
              </button>
            </div>
          </div>

          {sections.listen && (
            <div className="p-8">
              <p className="text-purple-700 mb-4 italic">
                👂 Ouça o áudio descrevendo as imagens. Clique nas imagens <strong className="font-bold">NA ORDEM QUE VOCÊ OUVE</strong> (1 → 2 → 3).
              </p>
              
              <p className="text-sm text-purple-600 mb-6 bg-purple-100 p-3 rounded-lg">
                🎯 <strong>Sequência correta:</strong> 1. mulher sorrindo → 2. refletindo sobre a vida → 3. casal assistindo tv juntos
              </p>

              {/* Imagens embaralhadas sem números nos containers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {shuffledListenItems.map((item) => (
                  <div 
                    key={item.key} 
                    className="bg-white rounded-xl shadow-md border-2 border-purple-200 overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:scale-105"
                    onClick={() => handleImageClickForSequence(item.correctNumber)}
                  >
                    <div className={`relative h-64 w-full bg-gradient-to-br ${item.bgColor} flex items-center justify-center overflow-hidden`}>
                      <img
                        src={item.image}
                        alt={item.label}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center bg-white">
                      <p className="text-md font-bold text-purple-700">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                      <div className="mt-2 inline-block bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                        Clique para adicionar à sequência
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exibição da sequência - SEM MOSTRAR A RESPOSTA CORRETA ATÉ VERIFICAR */}
              <div className="bg-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-purple-800 mb-3">📋 Sua sequência (ordem que você clicou):</h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {imageSequence.length === 0 ? (
                    <span className="text-gray-500 italic">Nenhuma imagem selecionada ainda</span>
                  ) : (
                    imageSequence.map((num, idx) => {
                      const item = listenItemsOriginal.find(i => i.correctNumber === num);
                      return (
                        <span key={idx} className="bg-white px-4 py-2 rounded-full shadow-sm border border-purple-300">
                          <span className="font-bold text-purple-700">{idx + 1}º:</span> {item?.label}
                        </span>
                      );
                    })
                  )}
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={checkSequence}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition font-semibold"
                  >
                    ✓ Verificar Sequência Completa
                  </button>
                  <button
                    onClick={resetSequence}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition font-semibold"
                  >
                    🔄 Resetar Sequência
                  </button>
                </div>

                {showFinalSequenceResult && (
                  <div className={`mt-4 p-3 rounded-lg ${isSequenceCorrect ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {isSequenceCorrect ? (
                      <div className="flex items-center gap-2">
                        <Check size={24} />
                        <span className="font-bold">✅ PARABÉNS! Você acertou a sequência correta: 1 → 2 → 3!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircle size={24} />
                        <span className="font-bold">❌ Sequência errada! A ordem correta é: 1. mulher sorrindo → 2. refletindo sobre a vida → 3. casal assistindo tv juntos</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Identificação individual */}
              <div className="border-t-2 border-purple-200 pt-6 mt-4">
                <h3 className="font-bold text-purple-800 mb-4">🎯 Ou identifique cada imagem individualmente:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shuffledListenItems.map((item) => (
                    <div key={`ind-${item.key}`} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="w-full h-32 mb-3 rounded-lg overflow-hidden relative">
                        <img src={item.image} alt={item.label} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium text-gray-700 text-center mb-3">{item.label}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1 text-center">Qual número esta imagem representa?</p>
                        <div className="flex gap-2 justify-center">
                          {[1, 2, 3].map((num) => (
                            <button
                              key={num}
                              onClick={() => handleListenSelect(item.key, num)}
                              className={`w-10 h-10 rounded-full font-bold transition ${
                                listenAnswers[item.key] === num
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-purple-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleListenCheck(item.key, item.correctNumber)}
                          className="flex-1 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
                          disabled={listenAnswers[item.key] === undefined}
                        >
                          Check
                        </button>
                      </div>
                      
                      {showListenResults[item.key] && (
                        <div className="mt-2">
                          <AnswerResult isCorrect={listenResults[item.key] || false} correctAnswer={item.correctNumber.toString()} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 bg-purple-100 rounded-xl p-4">
                <h3 className="font-bold text-purple-800">🎭 Role-play Activity:</h3>
                <p className="text-purple-700 text-sm mt-1">
                  Work in pairs. Based on the images, create a short dialogue about what each person is doing or thinking.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* SUBSTITUTION PRACTICE - PAST TENSE */}
        {/* ============================================ */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Substitution Practice (Past Tense)</h2>
              <button onClick={() => toggleSection('drilling1')} className="ml-4 p-2 rounded-full hover:bg-blue-700 transition">
                {sections.drilling1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling1 && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises1.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-blue-200 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500 mb-1">🇵🇹 Portuguese:</p>
                      <AudioPlayer src="" textToSpeak={exercise.portuguese} compact />
                    </div>
                    <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-500">🇺🇸 English:</p>
                      <AudioPlayer src="" textToSpeak={drilling1Sentences[exercise.id]} compact />
                    </div>
                    <p className="text-lg font-bold text-blue-700 mb-4">{drilling1Sentences[exercise.id]}</p>
                    <div className="flex flex-wrap gap-2">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: sub.phrase }))}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition"
                        >
                          {sub.word} 🔊
                        </button>
                      ))}
                      <button
                        onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: exercise.english }))}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* SIMPLE PAST TENSE EXERCISES */}
        {/* ============================================ */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📝 Simple Past Tense</h2>
              <button onClick={() => toggleSection('pastTense')} className="ml-4 p-2 rounded-full hover:bg-orange-700 transition">
                {sections.pastTense ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.pastTense && (
            <div className="p-8">
              <p className="text-orange-700 mb-4 italic">Convert the present tense sentences to past tense:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastTenseEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-orange-200 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-md font-medium text-gray-700">Present:</p>
                      <AudioPlayer src="" textToSpeak={exercise.present} compact />
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-4">{exercise.present}</p>
                    
                    <p className="text-sm text-gray-500 mb-1">Write the past form:</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handlePastTenseChange(exercise.id, e.target.value)}
                      placeholder="Write the past tense sentence here..."
                      className="w-full h-20 p-3 border border-orange-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handlePastTenseCheck(exercise.id, exercise.past)} className="flex-1 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition">Check</button>
                      <button onClick={() => handlePastTenseChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showPastTenseResults[exercise.id] && <AnswerResult isCorrect={pastTenseResults[exercise.id] || false} correctAnswer={exercise.past} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* PRESENT PERFECT EXERCISES */}
        {/* ============================================ */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">✨ Present Perfect Tense</h2>
              <button onClick={() => toggleSection('presentPerfect')} className="ml-4 p-2 rounded-full hover:bg-green-700 transition">
                {sections.presentPerfect ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.presentPerfect && (
            <div className="p-8">
              <p className="text-green-700 mb-4 italic">Practice the Present Perfect tense (have/has + past participle):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presentPerfectEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-green-200 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500">Example sentence:</p>
                      <AudioPlayer src="" textToSpeak={exercise.sentence} compact />
                    </div>
                    <p className="text-lg font-bold text-green-700 mb-4">{exercise.sentence}</p>
                    
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handlePresentPerfectChange(exercise.id, e.target.value)}
                      placeholder="Write a similar sentence using Present Perfect..."
                      className="w-full h-20 p-3 border border-green-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handlePresentPerfectCheck(exercise.id, exercise.sentence)} className="flex-1 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">Check</button>
                      <button onClick={() => handlePresentPerfectChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showPresentPerfectResults[exercise.id] && (
                      <div className="mt-2 text-sm text-green-600">✓ Keep practicing!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* PAST PERFECT EXERCISES */}
        {/* ============================================ */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">⏪ Past Perfect Tense</h2>
              <button onClick={() => toggleSection('pastPerfect')} className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition">
                {sections.pastPerfect ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.pastPerfect && (
            <div className="p-8">
              <p className="text-indigo-700 mb-4 italic">The Past Perfect shows an action completed before another past action (had + past participle):</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastPerfectEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-indigo-200 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500">Example:</p>
                      <AudioPlayer src="" textToSpeak={exercise.sentence} compact />
                    </div>
                    <p className="text-lg font-bold text-indigo-700 mb-4">{exercise.sentence}</p>
                    
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handlePastPerfectChange(exercise.id, e.target.value)}
                      placeholder="Write a similar sentence using Past Perfect..."
                      className="w-full h-20 p-3 border border-indigo-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handlePastPerfectCheck(exercise.id, exercise.sentence)} className="flex-1 bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition">Check</button>
                      <button onClick={() => handlePastPerfectChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showPastPerfectResults[exercise.id] && (
                      <div className="mt-2 text-sm text-indigo-600">✓ Good job with Past Perfect!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* FUTURE TENSE EXERCISES */}
        {/* ============================================ */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔮 Future Tense</h2>
              <button onClick={() => toggleSection('future')} className="ml-4 p-2 rounded-full hover:bg-yellow-700 transition">
                {sections.future ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.future && (
            <div className="p-8">
              <p className="text-yellow-700 mb-4 italic">Use WILL or GOING TO to talk about the future:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {futureEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-yellow-200 shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-sm text-gray-500">Example:</p>
                      <AudioPlayer src="" textToSpeak={exercise.sentence} compact />
                    </div>
                    <p className="text-lg font-bold text-yellow-700 mb-4">{exercise.sentence}</p>
                    
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleFutureChange(exercise.id, e.target.value)}
                      placeholder="Write a similar sentence about the future..."
                      className="w-full h-20 p-3 border border-yellow-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleFutureCheck(exercise.id, exercise.sentence)} className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition">Check</button>
                      <button onClick={() => handleFutureChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showFutureResults[exercise.id] && (
                      <div className="mt-2 text-sm text-yellow-600">✓ Great! Future tense mastered!</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* QUESTIONS IN THE PAST (DID) */}
        {/* ============================================ */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ Questions in the Past (DID)</h2>
              <button onClick={() => toggleSection('pastQuestions')} className="ml-4 p-2 rounded-full hover:bg-pink-700 transition">
                {sections.pastQuestions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.pastQuestions && (
            <div className="p-8">
              <p className="text-pink-700 mb-4 italic">Transform these statements into questions using DID:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastQuestionsEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-pink-200 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-md font-medium text-gray-700">Statement:</p>
                      <AudioPlayer src="" textToSpeak={exercise.statement} compact />
                    </div>
                    <p className="text-lg font-bold text-gray-900 mb-4">{exercise.statement}</p>
                    
                    <p className="text-sm text-gray-500 mb-1">Write the question form:</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handlePastQuestionsChange(exercise.id, e.target.value)}
                      placeholder="Write the question using DID..."
                      className="w-full h-20 p-3 border border-pink-300 rounded-md resize-none mb-3"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handlePastQuestionsCheck(exercise.id, exercise.question)} className="flex-1 bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition">Check</button>
                      <button onClick={() => handlePastQuestionsChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showPastQuestionsResults[exercise.id] && <AnswerResult isCorrect={pastQuestionsResults[exercise.id] || false} correctAnswer={exercise.question} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* SPEAK RIGHT NOW - All Tenses */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW - All Tenses</h2>
              <button onClick={() => toggleSection('speak')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.speak ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speak && (
            <div className="p-8">
              <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"><ChevronLeft size={24} /></button>
                  <span className="text-sm text-teal-600">Question {currentCardIndex + 1} of {speakCards.length}</span>
                  <button onClick={nextCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"><ChevronRight size={24} /></button>
                </div>
                
                <div className="mb-6 p-4 bg-teal-100 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-teal-700 mb-1">Question:</p>
                      <p className="text-xl font-bold text-teal-800">{currentCard.question}</p>
                      <p className="text-sm text-teal-600 mt-1">{currentCard.translation}</p>
                    </div>
                    <AudioPlayer src="" textToSpeak={currentCard.question} compact />
                  </div>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-700 mb-1">Example answer:</p>
                      <p className="text-lg text-gray-800 italic">{currentCard.answer}</p>
                      <p className="text-xs text-gray-500 mt-1">{currentCard.answerTranslation}</p>
                    </div>
                    <AudioPlayer src="" textToSpeak={currentCard.answer} compact />
                  </div>
                </div>
                
                <textarea
                  value={speakUserAnswer}
                  onChange={(e) => setSpeakUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-24 p-4 border border-teal-300 rounded-md resize-none mb-4"
                />
                
                <div className="flex gap-3">
                  <button onClick={handleSpeakCheck} className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition font-medium">Check Answer</button>
                  <button onClick={() => { setSpeakUserAnswer(""); setShowSpeakResult(false); }} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md transition">Clear</button>
                </div>
                
                {showSpeakResult && <div className="mt-4"><AnswerResult isCorrect={speakResult} correctAnswer={currentCard.answer} /></div>}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE IN YOUR EARS - Weather & Mood Themed */}
        {/* ============================================ */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-700 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <p className="text-xl md:text-2xl font-bold text-teal-700 mb-4">
                  Watch the video and answer the questions below:
                </p>
               
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src="https://www.youtube.com/embed/BBPJCwoxBFE"
                      title="Weather and Mood Vocabulary Lesson"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* KEY VOCABULARY FROM THE VIDEO - WEATHER & MOOD THEMED */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">📖 KEY VOCABULARY FROM THE VIDEO:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {keyVocabulary.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition flex justify-between items-center">
                      <div>
                        <span className="font-bold text-teal-700">{item.word}</span>
                        <p className="text-sm text-gray-600">{item.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Questions - About Weather, Moods, Seasons */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <p className="text-base md:text-lg font-bold text-teal-700 mb-3">
                      {question.question}
                      {question.isPersonal && (
                        <span className="ml-2 text-sm font-normal text-teal-500">(Personal answer)</span>
                      )}
                    </p>

                    <textarea
                      value={videoAnswers[question.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />

                    <div className="flex flex-col sm:flex-row gap-3 mt-3">
                      <button
                        onClick={() => checkVideoAnswer(question.id)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition font-medium"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => handleVideoAnswerChange(question.id, "")}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
                      >
                        Clear
                      </button>
                    </div>

                    {showVideoResults[question.id] && question.isPersonal && (
                      <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
                        <p className="text-sm text-teal-700">
                          <span className="font-medium">Note:</span> This is a personal question. Your answer has been saved for practice.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* LESSON SUMMARY */}
        {/* ============================================ */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="text-white py-4 px-8">
            <h2 className="text-2xl font-bold">✅ LESSON SUMMARY</h2>
          </div>
          <div className="p-8 bg-white rounded-b-[30px]">
            <p className="font-bold text-gray-800 mb-3">You practiced:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Simple Past</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Present Perfect</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Past Perfect</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Future (Will/Going to)</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Questions with DID</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm text-center">✔ Listening & Speaking</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">🎵 <strong>Audio tip:</strong> Click the 🔊 buttons next to each sentence to hear natural American English pronunciation (Text-to-Speech)!</p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SAVE BUTTONS AND NAVIGATION */}
        {/* ============================================ */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2">
              <span>💾</span> Save All My Answers
            </button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300">
              Clear All
            </button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              &larr; Back to Courses
            </button>
            <button onClick={() => router.push("/cursos/lesson37")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}