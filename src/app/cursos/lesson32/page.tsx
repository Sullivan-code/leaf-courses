"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

// ============================================
// SPEECH SYSTEM WITH AMERICAN FEMALE VOICE (ZOEY'S VOICE)
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

// Speech component for text-to-speech with American Female voice
const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // American English
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    // American female voices (same as Zoey)
    const americanFemaleVoices = voices.filter(voice => 
      (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
      (voice.name.toLowerCase().includes('samantha') || 
       voice.name.toLowerCase().includes('google us english') ||
       voice.name.toLowerCase().includes('siri') ||
       voice.name.toLowerCase().includes('female') ||
       voice.name === 'Google US English' ||
       voice.name === 'Samantha')
    );
    
    // Fallback to any American voice
    const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
    
    if (americanFemaleVoices.length > 0) {
      utterance.voice = americanFemaleVoices[0];
    } else if (americanVoices.length > 0) {
      utterance.voice = americanVoices[0];
    }
    
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// Component for pronouncing entire sentences with American female voice
const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === 'string' ? children : text;
        if (speechText && typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = 'en-US';
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          
          const voices = window.speechSynthesis.getVoices();
          
          const americanFemaleVoices = voices.filter(voice => 
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
            (voice.name.toLowerCase().includes('samantha') || 
             voice.name.toLowerCase().includes('google us english') ||
             voice.name === 'Google US English')
          );
          
          const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
          
          if (americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          } else if (americanVoices.length > 0) {
            utterance.voice = americanVoices[0];
          }
          
          window.speechSynthesis.speak(utterance);
        }
      }}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// ============================================
// IMAGES FOR LISTEN AND NUMBER (Pexels/Unsplash URLs)
// ============================================

const listenItems = [
  { 
    key: "presentation", 
    label: "Homem apresentando ideias em um quadro cheio de post-its", 
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 3
  },
  { 
    key: "meeting", 
    label: "Pessoas em reunião em uma sala de vidro", 
    image: "https://images.pexels.com/photos/3182763/pexels-photo-3182763.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 1
  },
  { 
    key: "deadline", 
    label: "Relógio com a palavra Deadline", 
    image: "https://images.pexels.com/photos/3930039/pexels-photo-3930039.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 2
  },
  { 
    key: "group-students", 
    label: "Grupo de jovens caminhando juntos (estudantes)", 
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 6
  },
  { 
    key: "learn-spanish", 
    label: "Quadro com Learn Spanish", 
    image: "https://images.pexels.com/photos/4144223/pexels-photo-4144223.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 5
  },
  { 
    key: "studying-tired", 
    label: "Pessoa estudando com muitos livros e parecendo cansada", 
    image: "https://images.pexels.com/photos/4145120/pexels-photo-4145120.jpeg?auto=compress&cs=tinysrgb&w=600", 
    correctNumber: 4
  },
];

// Images for Photo Descriptions
const descriptionPhotos = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Pessoas se formando na faculdade",
    description: "Um grupo de estudantes está usando beca e chapéu de formatura. Eles estão sorrindo e comemorando. Algumas pessoas estão jogando o chapéu para cima. É o dia da formatura.",
    questions: [
      "When do you finish college?",
      "Are you going to graduate this year?",
      "How do you feel about finishing college?"
    ]
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Pessoa organizando metas",
    description: "Uma estudante está olhando para um mural cheio de post-its coloridos. Ela está planejando suas metas para o semestre.",
    questions: [
      "What do you want to start next semester?",
      "Do you have a lot of classes this semester?",
      "Is this semester difficult?"
    ]
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/6863173/pexels-photo-6863173.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Carteira de trabalho",
    description: "Uma carteira de trabalho azul está sobre uma mesa de madeira. Ela representa emprego, trabalho formal e início de carreira.",
    questions: [
      "When do you want to start working?",
      "Do you need a job next year?",
      "Do you want to start a new career?"
    ]
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Estudante com diploma",
    description: "Uma jovem está segurando um diploma e sorrindo. Ela parece orgulhosa e feliz.",
    questions: [
      "When do you want to finish your course?",
      "Do you want to finish it this year?",
      "What do you want to do after that?"
    ]
  }
];

// ============================================
// LESSON DATA
// ============================================

// Drilling Practice 1 - Frases em português com substituição
const drillingExercises1 = [
  {
    id: 1,
    portuguese: "Eu quero aprender mais sobre negócios.",
    english: "I want to learn more about business.",
    substitutions: [
      { word: "biologia", english: "biology", phrase: "I want to learn more about biology." },
      { word: "esse assunto", english: "this subject", phrase: "I want to learn more about this subject." }
    ]
  },
  {
    id: 2,
    portuguese: "Eles têm que terminar esta tarefa.",
    english: "They have to finish this task.",
    substitutions: [
      { word: "este curso", english: "this course", phrase: "They have to finish this course." },
      { word: "este projeto", english: "this project", phrase: "They have to finish this project." }
    ]
  },
  {
    id: 3,
    portuguese: "Nós aprendemos muitas coisas na faculdade.",
    english: "We learn many things in college.",
    substitutions: [
      { word: "no ensino médio", english: "in high school", phrase: "We learn many things in high school." },
      { word: "lá", english: "there", phrase: "We learn many things there." }
    ]
  },
  {
    id: 4,
    portuguese: "Eu tenho uma aula de português em cinco minutos.",
    english: "I have a Portuguese class in five minutes.",
    substitutions: [
      { word: "10", english: "ten", phrase: "I have a Portuguese class in ten minutes." },
      { word: "15", english: "fifteen", phrase: "I have a Portuguese class in fifteen minutes." }
    ]
  },
  {
    id: 5,
    portuguese: "Você tem uma reunião agora?",
    english: "Do you have a meeting now?",
    substitutions: [
      { word: "esta tarde", english: "this afternoon", phrase: "Do you have a meeting this afternoon?" },
      { word: "esta manhã", english: "this morning", phrase: "Do you have a meeting this morning?" }
    ]
  }
];

// Drilling Practice 2 - Frases em inglês com substituição
const drillingExercises2 = [
  {
    id: 1,
    english: "Let's start the class!",
    substitutions: [
      { word: "the meeting", phrase: "Let's start the meeting!" },
      { word: "the project", phrase: "Let's start the project!" }
    ]
  },
  {
    id: 2,
    english: "When do you need to go to the airport?",
    substitutions: [
      { word: "museum", phrase: "When do you need to go to the museum?" },
      { word: "train station", phrase: "When do you need to go to the train station?" }
    ]
  },
  {
    id: 3,
    english: "Where do you want to go on vacation?",
    substitutions: [
      { word: "on Saturday", phrase: "Where do you want to go on Saturday?" },
      { word: "on Sunday", phrase: "Where do you want to go on Sunday?" }
    ]
  },
  {
    id: 4,
    english: "When do they finish high school?",
    substitutions: [
      { word: "college", phrase: "When do they finish college?" },
      { word: "English course", phrase: "When do they finish the English course?" }
    ]
  },
  {
    id: 5,
    english: "They want to start a new business.",
    substitutions: [
      { word: "next month", phrase: "They want to start a new business next month." },
      { word: "next year", phrase: "They want to start a new business next year." }
    ]
  }
];

// Negative Exercises
const negativeExercises = [
  { id: 1, affirmative: "They need to start the course today.", negative: "They don't need to start the course today.", userAnswer: "" },
  { id: 2, affirmative: "I have to finish this task this evening.", negative: "I don't have to finish this task this evening.", userAnswer: "" },
  { id: 3, affirmative: "We want to go to the park this morning.", negative: "We don't want to go to the park this morning.", userAnswer: "" },
  { id: 4, affirmative: "I have a deadline for the project.", negative: "I don't have a deadline for the project.", userAnswer: "" },
  { id: 5, affirmative: "You need to finish everything now.", negative: "You don't need to finish everything now.", userAnswer: "" },
  { id: 6, affirmative: "I do my homework on weekends.", negative: "I don't do my homework on weekends.", userAnswer: "" },
];

// Affirmative Exercises
const affirmativeExercises = [
  { id: 1, affirmative: "I want to stay here after college.", negative: "I don't want to stay here after college.", userAnswer: "" },
  { id: 2, affirmative: "They have money to start the project.", negative: "They don't have money to start the project.", userAnswer: "" },
  { id: 3, affirmative: "We have a lot of friends at school.", negative: "We don't have a lot of friends at school.", userAnswer: "" },
  { id: 4, affirmative: "I have to go to the meeting.", negative: "I don't have to go to the meeting.", userAnswer: "" },
  { id: 5, affirmative: "We need two hours to finish this task.", negative: "We don't need two hours to finish this task.", userAnswer: "" },
  { id: 6, affirmative: "I have to study for the exam.", negative: "I don't have to study for the exam.", userAnswer: "" },
];

// Speak Right Now Cards
const speakCards = [
  { 
    id: 1, 
    question: "When do you finish college?", 
    answer: "I finish college in September.",
    translation: "Quando você termina a faculdade?",
    answerTranslation: "Eu termino a faculdade em setembro."
  },
  { 
    id: 2, 
    question: "When do you finish high school?", 
    answer: "I finish high school next year.",
    translation: "Quando você termina o ensino médio?",
    answerTranslation: "Eu termino o ensino médio no próximo ano."
  },
  { 
    id: 3, 
    question: "When do you finish your English course?", 
    answer: "I finish my English course this semester.",
    translation: "Quando você termina seu curso de inglês?",
    answerTranslation: "Eu termino meu curso de inglês neste semestre."
  },
  { 
    id: 4, 
    question: "When do you finish your master's degree?", 
    answer: "I finish my master's degree in December.",
    translation: "Quando você termina seu mestrado?",
    answerTranslation: "Eu termino meu mestrado em dezembro."
  },
  { 
    id: 5, 
    question: "When do you finish elementary school?", 
    answer: "My son finishes elementary school this year.",
    translation: "Quando você termina o ensino fundamental?",
    answerTranslation: "Meu filho termina o ensino fundamental este ano."
  },
  { 
    id: 6, 
    question: "When do you finish your Spanish course?", 
    answer: "I finish my Spanish course next month.",
    translation: "Quando você termina seu curso de espanhol?",
    answerTranslation: "Eu termino meu curso de espanhol no próximo mês."
  },
];

// Special Words para o Speak Right Now
const specialWords = [
  { word: "college", meaning: "faculdade" },
  { word: "high school", meaning: "ensino médio" },
  { word: "elementary school", meaning: "ensino fundamental" },
  { word: "university", meaning: "universidade" },
  { word: "course", meaning: "curso" },
  { word: "English course", meaning: "curso de inglês" },
  { word: "Spanish course", meaning: "curso de espanhol" },
  { word: "master's degree", meaning: "mestrado" },
  { word: "PhD", meaning: "doutorado" },
  { word: "semester", meaning: "semestre" },
  { word: "term", meaning: "período" },
  { word: "graduate", meaning: "se formar" },
];

// Key Vocabulary from Video for Tune In Your Ears
const keyVocabulary = [
  { word: "tips", meaning: "dicas / conselhos" },
  { word: "improve", meaning: "melhorar" },
  { word: "listening skills", meaning: "habilidades de compreensão auditiva" },
  { word: "native speakers", meaning: "falantes nativos" },
  { word: "perfection", meaning: "perfeição" },
  { word: "goals", meaning: "objetivos" },
  { word: "habits", meaning: "hábitos" },
  { word: "your own words", meaning: "suas próprias palavras" },
  { word: "English-speaking group", meaning: "grupo falante de inglês" },
  { word: "confidence", meaning: "confiança" },
  { word: "a mix of accents", meaning: "uma mistura de sotaques" },
  { word: "slangs", meaning: "gírias" },
  { word: "it's a piece of cake", meaning: "é muito fácil" },
  { word: "tone and emotion", meaning: "tom e emoção" },
  { word: "sarcastic", meaning: "sarcástico" },
  { word: "it depends on", meaning: "depende de" },
  { word: "celebrate your progress", meaning: "celebre o seu progresso" },
  { word: "positive affirmations", meaning: "afirmações positivas" }
];

// Video Questions
const videoQuestions = [
  { id: "video-1", question: "According to the video, what are some practical TIPS to improve your English listening skills?", isPersonal: false },
  { id: "video-2", question: "The speaker mentions that even NATIVE SPEAKERS make mistakes. Why is it important not to focus on PERFECTION when learning English?", isPersonal: false },
  { id: "video-3", question: "What GOALS and HABITS does the speaker suggest for creating a daily English practice routine?", isPersonal: false },
  { id: "video-4", question: "How can you practice English in YOUR OWN WORDS and join an ENGLISH-SPEAKING GROUP to improve your CONFIDENCE?", isPersonal: true },
  { id: "video-5", question: "How can we be exposed to different accents to improve our listening skills?", isPersonal: false },
  { id: "video-6", question: "How can learning expressions like 'piece of cake' help you sound more natural?", isPersonal: false },
  { id: "video-7", question: "How does TONE AND EMOTION in conversations affect meaning?", isPersonal: false },
  { id: "video-8", question: "Why is it important to CELEBRATE YOUR PROGRESS and use POSITIVE AFFIRMATIONS when learning English?", isPersonal: true }
];

// Helper function to check answers
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '');
  return normalize(userAnswer) === normalize(correctAnswer);
};

// Answer result component
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
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

// ============================================
// MAIN LESSON COMPONENT
// ============================================

export default function Lesson32() {
  const router = useRouter();
  
  // Estados para as respostas do Listen
  const [listenAnswers, setListenAnswers] = useState<Record<string, number | null>>({});
  const [showListenResults, setShowListenResults] = useState<Record<string, boolean>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  
  // Estados para os exercícios de drilling 1
  const [drilling1Sentences, setDrilling1Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de drilling 2
  const [drilling2Sentences, setDrilling2Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de negativo
  const [negativeEx, setNegativeEx] = useState(negativeExercises);
  const [negativeResults, setNegativeResults] = useState<Record<number, boolean>>({});
  const [showNegativeResults, setShowNegativeResults] = useState<Record<number, boolean>>({});
  
  // Estados para os exercícios de afirmativo
  const [affirmativeEx, setAffirmativeEx] = useState(affirmativeExercises);
  const [affirmativeResults, setAffirmativeResults] = useState<Record<number, boolean>>({});
  const [showAffirmativeResults, setShowAffirmativeResults] = useState<Record<number, boolean>>({});
  
  // Estado para o Speak Right Now - Card atual
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [speakUserAnswer, setSpeakUserAnswer] = useState("");
  const [showSpeakResult, setShowSpeakResult] = useState(false);
  const [speakResult, setSpeakResult] = useState(false);
  
  // Estados para respostas do vídeo
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  
  // Estados para controle de expansão das seções
  const [sections, setSections] = useState({
    listen: true,
    drilling1: true,
    negative: true,
    drilling2: true,
    affirmative: true,
    speak: true,
    photos: true,
    specialWords: true,
    tuneIn: true
  });

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson32Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        if (data.listenAnswers) setListenAnswers(data.listenAnswers);
        if (data.showListenResults) setShowListenResults(data.showListenResults);
        if (data.listenResults) setListenResults(data.listenResults);
        if (data.drilling1Sentences) setDrilling1Sentences(data.drilling1Sentences);
        if (data.drilling2Sentences) setDrilling2Sentences(data.drilling2Sentences);
        if (data.negativeEx) setNegativeEx(data.negativeEx);
        if (data.negativeResults) setNegativeResults(data.negativeResults);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.affirmativeEx) setAffirmativeEx(data.affirmativeEx);
        if (data.affirmativeResults) setAffirmativeResults(data.affirmativeResults);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.currentCardIndex !== undefined) setCurrentCardIndex(data.currentCardIndex);
        if (data.speakUserAnswer) setSpeakUserAnswer(data.speakUserAnswer);
        if (data.showSpeakResult !== undefined) setShowSpeakResult(data.showSpeakResult);
        if (data.speakResult !== undefined) setSpeakResult(data.speakResult);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
        if (data.sections) setSections(data.sections);
        
        console.log("Dados carregados do localStorage para Lesson 32");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
    
    // Initialize voices
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = () => {
    const data = {
      listenAnswers,
      showListenResults,
      listenResults,
      drilling1Sentences,
      drilling2Sentences,
      negativeEx,
      negativeResults,
      showNegativeResults,
      affirmativeEx,
      affirmativeResults,
      showAffirmativeResults,
      currentCardIndex,
      speakUserAnswer,
      showSpeakResult,
      speakResult,
      videoAnswers,
      sections,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 32 - Output",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson32Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas.");
    }
  };

  // Função para limpar todas as respostas
  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas?")) {
      setListenAnswers({});
      setShowListenResults({});
      setListenResults({});
      setDrilling1Sentences(Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english])));
      setDrilling2Sentences(Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english])));
      setNegativeEx(negativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setNegativeResults({});
      setShowNegativeResults({});
      setAffirmativeEx(affirmativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setAffirmativeResults({});
      setShowAffirmativeResults({});
      setCurrentCardIndex(0);
      setSpeakUserAnswer("");
      setShowSpeakResult(false);
      setSpeakResult(false);
      setVideoAnswers({});
      setShowVideoResults({});
      localStorage.removeItem("lesson32Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================
  
  const handleListenSelect = (key: string, number: number) => {
    setListenAnswers(prev => ({ ...prev, [key]: number }));
    setShowListenResults(prev => ({ ...prev, [key]: false }));
  };

  const handleListenCheck = (key: string, correctNumber: number) => {
    const isCorrect = listenAnswers[key] === correctNumber;
    setListenResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowListenResults(prev => ({ ...prev, [key]: true }));
  };

  const handleNegativeChange = (id: number, value: string) => {
    setNegativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowNegativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleNegativeCheck = (id: number, correctNegative: string) => {
    const exercise = negativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctNegative.toLowerCase().trim();
      setNegativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowNegativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleAffirmativeChange = (id: number, value: string) => {
    setAffirmativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowAffirmativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleAffirmativeCheck = (id: number, correctAffirmative: string) => {
    const exercise = affirmativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctAffirmative.toLowerCase().trim();
      setAffirmativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowAffirmativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleSpeakCheck = () => {
    const currentCard = speakCards[currentCardIndex];
    const isCorrect = speakUserAnswer.toLowerCase().includes(currentCard.answer.toLowerCase()) || 
                     speakUserAnswer.toLowerCase().includes("finish");
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

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const currentCard = speakCards[currentCardIndex];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/4145120/pexels-photo-4145120.jpeg?auto=compress&cs=tinysrgb&w=1200')`,
        }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-50 z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-[40px] p-6 md:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-4 md:mb-6">
            📘 LESSON 32 – OUTPUT
          </h1>
          <SpeakSentence text="Listen, practice speaking, and complete the exercises to improve your English!" className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 Listen, practice speaking, and complete the exercises to improve your English!
          </SpeakSentence>
        </div>

        {/* LISTEN AND NUMBER */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
              <button 
                onClick={() => toggleSection('listen')}
                className="ml-4 p-2 rounded-full hover:bg-purple-700 transition"
              >
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listen && (
            <div className="p-6 md:p-8">
              <SpeakSentence text="Listen and number the images according to the audio. Click buttons 1-6 to select your answer." className="text-purple-700 mb-6 italic">
                Ouça e numere as imagens de acordo com o áudio. Clique nos botões de 1 a 6 para selecionar sua resposta.
              </SpeakSentence>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listenItems.map((item) => (
                  <div key={item.key} className="bg-white rounded-xl shadow-md border border-purple-200 overflow-hidden">
                    <div className="relative h-48 w-full">
                      <Image 
                        src={item.image} 
                        alt={item.label}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.label}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">Select number:</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
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
                        <button
                          onClick={() => {
                            handleListenSelect(item.key, 0);
                            setShowListenResults(prev => ({ ...prev, [item.key]: false }));
                          }}
                          className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Clear
                        </button>
                      </div>
                      
                      {showListenResults[item.key] && (
                        <div className="mt-2">
                          <AnswerResult 
                            isCorrect={listenResults[item.key] || false} 
                            correctAnswer={item.correctNumber.toString()}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-4">
                <h3 className="text-lg font-bold text-purple-800 mb-2">Correct Answers:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-purple-700">
                  <span className="bg-white px-3 py-1 rounded-full text-center">A: 3 (Presentation)</span>
                  <span className="bg-white px-3 py-1 rounded-full text-center">B: 1 (Meeting)</span>
                  <span className="bg-white px-3 py-1 rounded-full text-center">C: 2 (Deadline)</span>
                  <span className="bg-white px-3 py-1 rounded-full text-center">D: 6 (Group of students)</span>
                  <span className="bg-white px-3 py-1 rounded-full text-center">E: 5 (Learn Spanish)</span>
                  <span className="bg-white px-3 py-1 rounded-full text-center">F: 4 (Studying tired)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE 1 */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🗣 DRILLING PRACTICE 1 - Substitution</h2>
              <button 
                onClick={() => toggleSection('drilling1')}
                className="ml-4 p-2 rounded-full hover:bg-blue-700 transition"
              >
                {sections.drilling1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling1 && (
            <div className="p-6 md:p-8">
              <SpeakSentence text="Click on the words below to substitute the highlighted term in the English sentence." className="text-blue-700 mb-4 italic">
                Clique nas palavras abaixo para substituir o termo destacado na frase em inglês.
              </SpeakSentence>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises1.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-blue-200 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">Português:</p>
                    <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                    
                    <p className="text-sm text-gray-500 mb-1">English:</p>
                    <SpeakSentence text={drilling1Sentences[exercise.id]} className="text-lg font-bold text-blue-700 mb-4">
                      {drilling1Sentences[exercise.id]}
                    </SpeakSentence>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDrilling1Sentences(prev => ({
                              ...prev,
                              [exercise.id]: sub.phrase
                            }));
                          }}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition flex items-center gap-1"
                        >
                          <Volume2 size={14} />
                          {sub.word}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setDrilling1Sentences(prev => ({
                            ...prev,
                            [exercise.id]: exercise.english
                          }));
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Click on words to change the sentence and hear pronunciation</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NEGATIVE SENTENCES */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-red-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔹 Change into Negative</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-red-700 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {negativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-red-200 shadow-md">
                    <p className="text-md font-medium text-gray-700 mb-2">Affirmative:</p>
                    <SpeakSentence text={exercise.affirmative} className="text-lg font-bold text-gray-900 mb-4">
                      {exercise.affirmative}
                    </SpeakSentence>
                    
                    <p className="text-md font-medium text-gray-700 mb-2">Your negative:</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleNegativeChange(exercise.id, e.target.value)}
                      placeholder="Write the negative form here..."
                      className="w-full h-20 p-3 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none mb-3"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleNegativeCheck(exercise.id, exercise.negative)}
                        className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition"
                      >
                        Check
                      </button>
                      <button
                        onClick={() => handleNegativeChange(exercise.id, "")}
                        className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        Clear
                      </button>
                    </div>
                    
                    {showNegativeResults[exercise.id] && (
                      <div className="mt-3">
                        <AnswerResult 
                          isCorrect={negativeResults[exercise.id] || false} 
                          correctAnswer={exercise.negative}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE 2 */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🗣 DRILLING PRACTICE 2 - Substitution</h2>
              <button 
                onClick={() => toggleSection('drilling2')}
                className="ml-4 p-2 rounded-full hover:bg-green-700 transition"
              >
                {sections.drilling2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling2 && (
            <div className="p-6 md:p-8">
              <SpeakSentence text="Click on the words below to substitute the highlighted term in the English sentence." className="text-green-700 mb-4 italic">
                Clique nas palavras abaixo para substituir o termo destacado na frase em inglês.
              </SpeakSentence>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises2.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-green-200 shadow-md">
                    <p className="text-sm text-gray-500 mb-1">English:</p>
                    <SpeakSentence text={drilling2Sentences[exercise.id]} className="text-lg font-bold text-green-700 mb-4">
                      {drilling2Sentences[exercise.id]}
                    </SpeakSentence>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDrilling2Sentences(prev => ({
                              ...prev,
                              [exercise.id]: sub.phrase
                            }));
                          }}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition flex items-center gap-1"
                        >
                          <Volume2 size={14} />
                          {sub.word}
                        </button>
                      ))}
                      <button
                        onClick={() => {
                          setDrilling2Sentences(prev => ({
                            ...prev,
                            [exercise.id]: exercise.english
                          }));
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Click on words to change the sentence and hear pronunciation</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* AFFIRMATIVE SENTENCES */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔹 Change into Affirmative</h2>
              <button 
                onClick={() => toggleSection('affirmative')}
                className="ml-4 p-2 rounded-full hover:bg-yellow-700 transition"
              >
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {affirmativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border border-yellow-200 shadow-md">
                    <p className="text-md font-medium text-gray-700 mb-2">Negative:</p>
                    <SpeakSentence text={exercise.negative} className="text-lg font-bold text-gray-900 mb-4">
                      {exercise.negative}
                    </SpeakSentence>
                    
                    <p className="text-md font-medium text-gray-700 mb-2">Your affirmative:</p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)}
                      placeholder="Write the affirmative form here..."
                      className="w-full h-20 p-3 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none mb-3"
                    />
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAffirmativeCheck(exercise.id, exercise.affirmative)}
                        className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
                      >
                        Check
                      </button>
                      <button
                        onClick={() => handleAffirmativeChange(exercise.id, "")}
                        className="px-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                      >
                        Clear
                      </button>
                    </div>
                    
                    {showAffirmativeResults[exercise.id] && (
                      <div className="mt-3">
                        <AnswerResult 
                          isCorrect={affirmativeResults[exercise.id] || false} 
                          correctAnswer={exercise.affirmative}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SPEAK RIGHT NOW */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🎤 SPEAK RIGHT NOW</h2>
              <button 
                onClick={() => toggleSection('speak')}
                className="ml-4 p-2 rounded-full hover:bg-teal-700 transition"
              >
                {sections.speak ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speak && (
            <div className="p-6 md:p-8">
              <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md mb-6">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={prevCard}
                    className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  
                  <div className="text-center">
                    <span className="text-sm text-teal-600">Card {currentCardIndex + 1} of {speakCards.length}</span>
                  </div>
                  
                  <button
                    onClick={nextCard}
                    className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 transition"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
                
                <div className="mb-6 p-4 bg-teal-100 rounded-lg">
                  <p className="text-sm text-teal-700 mb-1">Question:</p>
                  <SpeakSentence text={currentCard.question} className="text-xl font-bold text-teal-800">
                    {currentCard.question}
                  </SpeakSentence>
                  <p className="text-sm text-teal-600 mt-1">{currentCard.translation}</p>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-1">Example answer:</p>
                  <SpeakSentence text={currentCard.answer} className="text-lg text-gray-800 italic">
                    {currentCard.answer}
                  </SpeakSentence>
                  <p className="text-xs text-gray-500 mt-1">{currentCard.answerTranslation}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-md font-medium text-gray-700 mb-2">Your answer:</p>
                  <textarea
                    value={speakUserAnswer}
                    onChange={(e) => setSpeakUserAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    className="w-full h-24 p-4 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSpeakCheck}
                    className="flex-1 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-md transition font-medium"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={() => {
                      setSpeakUserAnswer("");
                      setShowSpeakResult(false);
                    }}
                    className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-md transition"
                  >
                    Clear
                  </button>
                </div>
                
                {showSpeakResult && (
                  <div className="mt-4">
                    <AnswerResult 
                      isCorrect={speakResult} 
                      correctAnswer={currentCard.answer}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* SPECIAL WORDS */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-orange-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">📚 SPECIAL WORDS</h2>
              <button 
                onClick={() => toggleSection('specialWords')}
                className="ml-4 p-2 rounded-full hover:bg-orange-700 transition"
              >
                {sections.specialWords ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.specialWords && (
            <div className="p-6 md:p-8">
              <SpeakSentence text="Specific vocabulary to talk about education and deadlines:" className="text-orange-700 mb-4 italic">
                Vocabulário específico para falar sobre educação e prazos:
              </SpeakSentence>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {specialWords.map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition">
                    <div className="w-full text-left">
                      <SpeakText text={item.word} className="font-bold text-orange-700">
                        {item.word}
                      </SpeakText>
                      <p className="text-sm text-gray-600">{item.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PHOTO DESCRIPTIONS */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">📸 PHOTO DESCRIPTIONS</h2>
              <button 
                onClick={() => toggleSection('photos')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition"
              >
                {sections.photos ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.photos && (
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {descriptionPhotos.map((photo) => (
                  <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="relative h-64 w-full">
                      <Image 
                        src={photo.image} 
                        alt={photo.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">{photo.title}</h3>
                      <p className="text-gray-600 mb-4 italic">{photo.description}</p>
                      
                      <h4 className="font-medium text-gray-800 mb-2">Discussion Questions:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-indigo-600">
                        {photo.questions.map((q, idx) => (
                          <li key={idx}>
                            <SpeakSentence text={q}>{q}</SpeakSentence>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS - With Key Vocabulary Audio */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-700 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <SpeakSentence text="Watch the video and answer the questions below" className="text-xl md:text-2xl font-bold text-teal-700 mb-4">
                  Watch the video and answer the questions below:
                </SpeakSentence>
               
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      src="https://www.youtube.com/embed/q5JxLYzO5k4?list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=40"
                      title="English Listening Practice - Daily Routines & Conversations"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                </div>
              </div>

              {/* KEY VOCABULARY FROM THE VIDEO */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">📖 KEY VOCABULARY FROM THE VIDEO:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {keyVocabulary.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-teal-200 shadow-sm hover:shadow-md transition flex justify-between items-center">
                      <div>
                        <SpeakText text={item.word} className="font-bold text-teal-700">
                          {item.word}
                        </SpeakText>
                        <p className="text-sm text-gray-600">{item.meaning}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Questions */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <SpeakSentence text={question.question} className="text-base md:text-lg font-bold text-teal-700 mb-3">
                      {question.question}
                      {question.isPersonal && (
                        <span className="ml-2 text-sm font-normal text-teal-500">(Personal answer)</span>
                      )}
                    </SpeakSentence>

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

        {/* Save Button and Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 md:px-8 rounded-full text-base md:text-lg transition duration-300 flex items-center justify-center gap-2"
            >
              <span>💾</span> Save All My Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300"
            >
              Clear All
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson31")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors text-sm md:text-base"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson33")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors text-sm md:text-base"
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}