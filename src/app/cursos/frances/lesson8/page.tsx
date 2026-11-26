"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, VolumeX } from "lucide-react";

// ============================================
// SISTEMA DE VOZ – FRANCÊS (fr-FR) COM VOZ FEMININA
// ============================================

interface SpeakableTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  language?: string;
}

const speakFrench = (text: string, rate = 0.9) => {
  if (!text || typeof window === 'undefined') return;
  if (!window.speechSynthesis) {
    alert("Seu navegador não suporta áudio por voz. Tente Chrome, Edge ou Safari.");
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const frenchFemaleVoices = voices.filter(voice =>
    (voice.lang === 'fr-FR' || voice.lang.startsWith('fr-FR') || voice.lang === 'fr-CA') &&
    (voice.name.toLowerCase().includes('amelie') ||
     voice.name.toLowerCase().includes('amélie') ||
     voice.name.toLowerCase().includes('google français') ||
     voice.name.toLowerCase().includes('siri') ||
     voice.name.toLowerCase().includes('female') ||
     voice.name.toLowerCase().includes('audrey') ||
     voice.name.toLowerCase().includes('virginie') ||
     voice.name.toLowerCase().includes('thomas') === false)
  );
  const frenchVoices = voices.filter(voice => voice.lang === 'fr-FR' || voice.lang.startsWith('fr-FR') || voice.lang === 'fr-CA');

  if (frenchFemaleVoices.length > 0) {
    utterance.voice = frenchFemaleVoices[0];
  } else if (frenchVoices.length > 0) {
    utterance.voice = frenchVoices[0];
  }
  window.speechSynthesis.speak(utterance);
};

const SpeakableText = ({
  text,
  children,
  className = "",
  showIcon = true,
  iconPosition = 'right',
  language = 'fr-FR'
}: SpeakableTextProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false);
      console.warn("Web Speech API não é suportada neste navegador");
    }
  }, []);

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta áudio por voz. Tente Chrome, Edge ou Safari.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const frenchFemaleVoices = voices.filter(v =>
        (v.lang === 'fr-FR' || v.lang.startsWith('fr-FR') || v.lang === 'fr-CA') &&
        (v.name.toLowerCase().includes('amelie') ||
         v.name.toLowerCase().includes('amélie') ||
         v.name.toLowerCase().includes('google français') ||
         v.name.toLowerCase().includes('siri') ||
         v.name.toLowerCase().includes('female') ||
         v.name.toLowerCase().includes('audrey') ||
         v.name.toLowerCase().includes('virginie'))
      );
      const frenchVoices = voices.filter(v => v.lang === 'fr-FR' || v.lang.startsWith('fr-FR') || v.lang === 'fr-CA');
      if (frenchFemaleVoices.length > 0) utterance.voice = frenchFemaleVoices[0];
      else if (frenchVoices.length > 0) utterance.voice = frenchVoices[0];
    };

    if (window.speechSynthesis.getVoices().length > 0) setVoice();
    else window.speechSynthesis.onvoiceschanged = setVoice;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const handleClick = () => (isPlaying ? stop() : speak());
  const content = children || text;

  if (!isSupported) return <span className={className}>{content}</span>;

  return (
    <div
      className={`group relative inline-flex items-center gap-2 cursor-pointer rounded-md px-1 transition-all duration-200 ${
        isPlaying ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
      } ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      title={isPlaying ? "Clique para parar" : "Clique para ouvir a pronúncia em francês"}
    >
      {showIcon && iconPosition === 'left' && (
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">
          {isPlaying ? <VolumeX size={16} className="text-blue-500" /> : <Volume2 size={16} className="text-gray-400" />}
        </span>
      )}
      <span className={isPlaying ? 'font-medium' : ''}>{content}</span>
      {showIcon && iconPosition === 'right' && (
        <span className="opacity-60 group-hover:opacity-100 transition-opacity">
          {isPlaying ? <VolumeX size={16} className="text-blue-500 animate-pulse" /> : <Volume2 size={16} className="text-gray-400" />}
        </span>
      )}
    </div>
  );
};

const AudioButton = ({ text, className = "" }: { text: string; className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = () => {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta áudio por voz.");
      return;
    }
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    speakFrench(text, 0.9);
    setIsPlaying(true);
    const checkEnd = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setIsPlaying(false);
        clearInterval(checkEnd);
      }
    }, 200);
  };

  return (
    <button
      onClick={speak}
      className={`p-2 rounded-full transition-all duration-200 ${
        isPlaying ? 'bg-blue-500 text-white animate-pulse' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
      } ${className}`}
      title={isPlaying ? "Parar" : "Ouvir pronúncia em francês"}
    >
      {isPlaying ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </button>
  );
};

// ============================================
// DADOS DA LIÇÃO – FRANCÊS
// ============================================

const substitutionPractice1 = [
  {
    key: "subs-1",
    original: "Eles estudam francês na escola. / Nós / Eu",
    base: "{0} étudions le français à l'école.",
    options: ["Ils", "Nous", "J'"],
    currentIndex: 0
  },
  {
    key: "subs-2",
    original: "Você fala alemão também? / italiano / espanhol",
    base: "Parlez-vous {0} aussi ?",
    options: ["allemand", "italien", "espagnol"],
    currentIndex: 0
  },
  {
    key: "subs-3",
    original: "Ela gosta de estudar com seu amigo. / seu professor / suas amigas",
    base: "Elle aime étudier avec {0}.",
    options: ["son ami", "son professeur", "ses amies"],
    currentIndex: 0
  },
  {
    key: "subs-4",
    original: "Como se escreve 'lait'? / pomme / beurre",
    base: "Comment épelle-t-on « {0} » ?",
    options: ["lait", "pomme", "beurre"],
    currentIndex: 0
  },
  {
    key: "subs-5",
    original: "Nós preferimos estudar de manhã. / à tarde",
    base: "Nous préférons étudier {0}.",
    options: ["le matin", "l'après-midi"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  {
    key: "subs2-1",
    original: "Ele não quer beber suco no café da manhã. / água / leite",
    correctAnswer: "Il ne veut pas boire de jus au petit-déjeuner.",
    options: ["jus", "eau", "lait"],
    currentIndex: 0,
    specificSentences: {
      "jus": "Il ne veut pas boire de jus au petit-déjeuner.",
      "eau": "Il ne veut pas boire d'eau au petit-déjeuner.",
      "lait": "Il ne veut pas boire de lait au petit-déjeuner."
    }
  },
  {
    key: "subs2-2",
    original: "Eles preferem comer salada. / Eu / Nós",
    correctAnswer: "Ils préfèrent manger de la salade.",
    options: ["Ils", "Je", "Nous"],
    currentIndex: 0,
    specificSentences: {
      "Ils": "Ils préfèrent manger de la salade.",
      "Je": "Je préfère manger de la salade.",
      "Nous": "Nous préférons manger de la salade."
    }
  },
  {
    key: "subs2-3",
    original: "Nós queremos comer uma fatia de torta. / queijo / pão",
    correctAnswer: "Nous voulons manger une part de tarte.",
    options: ["tarte", "fromage", "pain"],
    currentIndex: 0,
    specificSentences: {
      "tarte": "Nous voulons manger une part de tarte.",
      "fromage": "Nous voulons manger une part de fromage.",
      "pain": "Nous voulons manger une part de pain."
    }
  },
  {
    key: "subs2-4",
    original: "Ela adora comer batatas fritas. E você? / torradas / geleia",
    correctAnswer: "Elle adore manger des frites. Et toi ?",
    options: ["frites", "toasts", "confiture"],
    currentIndex: 0,
    specificSentences: {
      "frites": "Elle adore manger des frites. Et toi ?",
      "toasts": "Elle adore manger des toasts. Et toi ?",
      "confiture": "Elle adore manger de la confiture. Et toi ?"
    }
  },
  {
    key: "subs2-5",
    original: "Eu não estudo português aqui. / lá / na escola",
    correctAnswer: "Je n'étudie pas le portugais ici.",
    options: ["ici", "là-bas", "à l'école"],
    currentIndex: 0,
    specificSentences: {
      "ici": "Je n'étudie pas le portugais ici.",
      "là-bas": "Je n'étudie pas le portugais là-bas.",
      "à l'école": "Je n'étudie pas le portugais à l'école."
    }
  }
];

const negativeExercises = [
  { key: "neg-1", sentence: "Elle étudie le français l'après-midi.", answer: "Elle n'étudie pas le français l'après-midi." },
  { key: "neg-2", sentence: "Il mange du pain et du beurre le matin.", answer: "Il ne mange pas de pain et de beurre le matin." },
  { key: "neg-3", sentence: "Ils veulent manger des œufs au petit-déjeuner.", answer: "Ils ne veulent pas manger d'œufs au petit-déjeuner." },
  { key: "neg-4", sentence: "Nous buvons une tasse de thé l'après-midi.", answer: "Nous ne buvons pas de tasse de thé l'après-midi." },
  { key: "neg-5", sentence: "Il aime manger du poisson.", answer: "Il n'aime pas manger de poisson." },
  { key: "neg-6", sentence: "Elle parle français avec son professeur.", answer: "Elle ne parle pas français avec son professeur." }
];

const affirmativeExercises = [
  { key: "aff-1", sentence: "Il ne mange pas de saucisses au petit-déjeuner.", answer: "Il mange des saucisses au petit-déjeuner." },
  { key: "aff-2", sentence: "Elle n'aime pas boire de jus de pomme.", answer: "Elle aime boire du jus de pomme." },
  { key: "aff-3", sentence: "Ils ne mangent pas de salade au déjeuner.", answer: "Ils mangent de la salade au déjeuner." },
  { key: "aff-4", sentence: "Il ne parle pas portugais à l'école.", answer: "Il parle portugais à l'école." },
  { key: "aff-5", sentence: "Nous n'étudions pas avec ton professeur.", answer: "Nous étudions avec ton professeur." }
];

const interrogativeExercises = [
  { key: "int-1", sentence: "Il parle italien avec son ami.", answer: "Parle-t-il italien avec son ami ?" },
  { key: "int-2", sentence: "Elle préfère étudier le français.", answer: "Préfère-t-elle étudier le français ?" },
  { key: "int-3", sentence: "Ils veulent boire un verre d'eau.", answer: "Veulent-ils boire un verre d'eau ?" },
  { key: "int-4", sentence: "Nous voulons étudier là-bas.", answer: "Voulons-nous étudier là-bas ?" },
  { key: "int-5", sentence: "Il veut manger du bœuf.", answer: "Veut-il manger du bœuf ?" }
];

const personalQuestions = [
  { id: 1, question: "Parlez-vous français avec vos amis d'autres pays ?", placeholder: "Écrivez quelles langues vous parlez avec vos amis internationaux..." },
  { id: 2, question: "Comment épelle-t-on le nom de votre pays préféré ?", placeholder: "Épelez le nom du pays ici..." },
  { id: 3, question: "Préférez-vous étudier les langues le matin ou l'après-midi ?", placeholder: "Écrivez votre préférence et expliquez pourquoi..." },
  { id: 4, question: "Quel plat traditionnel d'un autre pays aimez-vous ?", placeholder: "Décrivez un plat étranger que vous aimez..." },
  { id: 5, question: "Voulez-vous visiter l'Allemagne ou l'Italie ? Pourquoi ?", placeholder: "Expliquez votre choix et vos raisons..." },
  { id: 6, question: "Quelle langue étudiez-vous à l'école à part le portugais ?", placeholder: "Parlez de vos études de langues à l'école..." },
  { id: 7, question: "Qu'aimez-vous apprendre sur les différentes cultures ?", placeholder: "Décrivez les aspects culturels qui vous intéressent..." },
  { id: 8, question: "Voulez-vous parler français avec des gens de France ?", placeholder: "Partagez vos pensées sur le fait de parler avec des locuteurs natifs..." },
  { id: 9, question: "Comment épelle-t-on « Allemagne » en français ?", placeholder: "Épelez le nom du pays..." },
  { id: 10, question: "Comment épelle-t-on « Italie » en français ?", placeholder: "Épelez le nom du pays..." }
];

const videoQuestions = [
  { id: 1, question: "Quelle est l'importance de l'écoute dans l'apprentissage d'une langue seconde ?", isPersonal: false, vocabulary: ["", ""] },
  { id: 2, question: "Comment avez-vous appris votre première langue ?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 3, question: "Comment pouvez-vous utiliser l'écoute pour améliorer votre français ?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 4, question: "Quels sont les avantages de l'écoute ?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 5, question: "Apprendre le français peut être une question de mots, mais cela a beaucoup à voir avec le ressenti. Que faites-vous pour connaître les argots, les expressions idiomatiques, etc. ?", isPersonal: false, vocabulary: ["", "", ""] },
  { id: 6, question: "Pensez-vous qu'il est important de comprendre tous les mots quand vous regardez quelque chose, ou que saisir l'idée principale est ce qui compte vraiment ?", isPersonal: true, vocabulary: ["plats préparés", "pensées", "faire une sieste"] },
  { id: 7, question: "Pourquoi apprendre le français avec des sous-titres est-il si important ?", isPersonal: true, vocabulary: ["plats préparés", "pensées", "faire une sieste"] },
  { id: 8, question: "Que devez-vous faire pour être prêt aux situations de la vie réelle, comme les restaurants, commander à manger, demander votre chemin dans un pays francophone ?", isPersonal: true, vocabulary: ["plats préparés", "pensées", "faire une sieste"] }
];

const vocabularyTranslations = {
  "plats préparés": "comida pré-feita",
  "pensées": "pensamentos",
  "faire une sieste": "tirar um cochilo"
};

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[.,?!;:'"«»]/g, '')
      .replace(/\s+/g, ' ');
  return normalize(userAnswer) === normalize(correctAnswer);
};

const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct !</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700"><span className="font-medium">Attendu :</span> {correctAnswer}</span>
    </div>
  );
};

// ============================================
// DADOS – PAÍSES, LÍNGUAS E COMIDAS (FRANCÊS)
// ============================================

const countryLanguageMap: Record<string, { language: string; spelling: string }> = {
  "https://i.ibb.co/kskr0zmq/german-flag.jpg": { language: "allemand", spelling: "A-L-L-E-M-A-G-N-E" },
  "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg": { language: "portugais", spelling: "B-R-É-S-I-L" },
  "https://i.ibb.co/21VkwN19/spanish-fla.jpg": { language: "espagnol", spelling: "E-S-P-A-G-N-E" },
  "https://i.ibb.co/7xnjGkDN/italian-flag.jpg": { language: "italien", spelling: "I-T-A-L-I-E" },
  "https://i.ibb.co/qLL8CKv5/american-flag.jpg": { language: "anglais", spelling: "É-T-A-T-S-U-N-I-S" },
  "https://i.ibb.co/dwjk9s3S/france-flag.jpg": { language: "français", spelling: "F-R-A-N-C-E" }
};

const foodSpellingMap: Record<string, { food: string; spelling: string }> = {
  "https://i.ibb.co/8LF0pHjv/yogurt.jpg": { food: "yaourt", spelling: "Y-A-O-U-R-T" },
  "https://i.ibb.co/99zBTC4q/sandwich.jpg": { food: "sandwich", spelling: "S-A-N-D-W-I-C-H" },
  "https://i.ibb.co/W4kNfZ2F/cookies.jpg": { food: "cookies", spelling: "C-O-O-K-I-E-S" },
  "https://i.ibb.co/pjYHqBsc/juice.jpg": { food: "jus", spelling: "J-U-S" },
  "https://i.ibb.co/jvg8bfKY/orange-juice.jpg": { food: "jus d'orange", spelling: "J-U-S-D-O-R-A-N-G-E" },
  "https://i.ibb.co/HfCPk3qD/friends.jpg": { food: "amis", spelling: "A-M-I-S" }
};

// ============================================
// COMPONENTE PRINCIPAL – LIÇÃO 8 FRANCÊS
// ============================================

export default function LessonLanguagesAndCountriesFrench() {
  const router = useRouter();

  const [sections, setSections] = useState({
    speakNow: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    questions: true,
    tuneIn: true
  });

  const [selectedFlag, setSelectedFlag] = useState("https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg");
  const [selectedFood, setSelectedFood] = useState("https://i.ibb.co/8LF0pHjv/yogurt.jpg");
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [videoAnswerResults, setVideoAnswerResults] = useState<Record<number, boolean>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});
  const [practiceDialogs, setPracticeDialogs] = useState([
    { question: "Voulez-vous parler portugais ou espagnol avec moi ?", response: "Je veux parler portugais avec vous.", highlighted: ["portugais", "espagnol", "portugais"] },
    { question: "Comment épelle-t-on « yaourt » ?", response: "Y-A-O-U-R-T", highlighted: ["yaourt", "Y", "A", "O", "U", "R", "T"] }
  ]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson8FrenchAnswers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setVideoAnswerResults(data.videoAnswerResults || {});
        setShowVideoAnswerResults(data.showVideoAnswerResults || {});
        if (data.selectedFlag) setSelectedFlag(data.selectedFlag);
        if (data.selectedFood) setSelectedFood(data.selectedFood);
        if (data.sections) setSections(data.sections);
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    const countryInfo = countryLanguageMap[selectedFlag];
    const foodInfo = foodSpellingMap[selectedFood];
    const availableLanguages = Object.values(countryLanguageMap)
      .map(info => info.language)
      .filter(lang => lang !== countryInfo?.language);
    const randomLanguage = availableLanguages.length > 0
      ? availableLanguages[Math.floor(Math.random() * availableLanguages.length)]
      : "espagnol";

    if (countryInfo && foodInfo) {
      setPracticeDialogs([
        {
          question: `Voulez-vous parler ${countryInfo.language} ou ${randomLanguage} avec moi ?`,
          response: `Je veux parler ${countryInfo.language} avec vous.`,
          highlighted: [countryInfo.language, randomLanguage, countryInfo.language]
        },
        {
          question: `Comment épelle-t-on « ${foodInfo.food} » ?`,
          response: foodInfo.spelling,
          highlighted: [foodInfo.food, ...foodInfo.spelling.split('-')]
        }
      ]);
    }
  }, [selectedFlag, selectedFood]);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises, subs2Exercises, writtenAnswers, videoAnswers,
      answerResults, showAnswerResults, videoAnswerResults, showVideoAnswerResults,
      selectedFlag, selectedFood, sections, lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("lesson8FrenchAnswers", JSON.stringify(data));
    alert("✅ Toutes vos réponses ont été enregistrées avec succès ! / Todas as suas respostas foram salvas com sucesso!");
  };

  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas ?")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setVideoAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setVideoAnswerResults({});
      setShowVideoAnswerResults({});
      setSelectedFlag("https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg");
      setSelectedFood("https://i.ibb.co/8LF0pHjv/yogurt.jpg");
      localStorage.removeItem("lesson8FrenchAnswers");
      alert("Toutes les réponses ont été effacées. / Todas as respostas foram limpas.");
    }
  };

  const handleSubs1OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs1Exercises(prev => prev.map(ex => ex.key === exerciseKey ? { ...ex, currentIndex: optionIndex } : ex));
  };

  const handleSubs2OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs2Exercises(prev => prev.map(ex => ex.key === exerciseKey ? { ...ex, currentIndex: optionIndex } : ex));
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  const handleVideoAnswerChange = (questionId: number, answer: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const checkVideoAnswer = (questionId: number) => {
    setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getCurrentSubs2Sentence = (exercise: typeof substitutionPractice2[0]): string => {
    const currentOption = exercise.options[exercise.currentIndex];
    if (exercise.specificSentences) {
      const sentenceKey = currentOption as keyof typeof exercise.specificSentences;
      const sentence = exercise.specificSentences[sentenceKey];
      if (sentence && typeof sentence === 'string') return sentence;
    }
    const words = exercise.correctAnswer.split(' ');
    const baseWords = words.map(word => {
      const cleanWord = word.replace(/[.,?!«»]/g, '');
      const matchingOption = exercise.options.find(opt => opt.toLowerCase() === cleanWord.toLowerCase());
      return matchingOption ? '{0}' : word;
    });
    return baseWords.join(' ').replace('{0}', currentOption);
  };

  const flagImages = [
    "https://i.ibb.co/fVR6hwYb/brazilian-portuguese-flag.jpg",
    "https://i.ibb.co/7xnjGkDN/italian-flag.jpg",
    "https://i.ibb.co/21VkwN19/spanish-fla.jpg",
    "https://i.ibb.co/kskr0zmq/german-flag.jpg",
    "https://i.ibb.co/qLL8CKv5/american-flag.jpg",
    "https://i.ibb.co/dwjk9s3S/france-flag.jpg"
  ];

  const foodImages = [
    "https://i.ibb.co/8LF0pHjv/yogurt.jpg",
    "https://i.ibb.co/99zBTC4q/sandwich.jpg",
    "https://i.ibb.co/W4kNfZ2F/cookies.jpg",
    "https://i.ibb.co/pjYHqBsc/juice.jpg",
    "https://i.ibb.co/jvg8bfKY/orange-juice.jpg",
    "https://i.ibb.co/HfCPk3qD/friends.jpg"
  ];

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/world-map-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* TÍTULO */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🌍 Leçon 8 – Langues et Pays</h1>
          <SpeakableText text="Pratiquez le français en parlant des langues, des pays et de la communication internationale. Cliquez sur n'importe quel texte en français pour entendre la prononciation !" className="text-xl text-gray-700 max-w-3xl mx-auto" showIcon={false}>
            Pratiquez le français en parlant des langues, des pays et de la communication internationale. <strong>Cliquez sur n'importe quel texte en français pour entendre la prononciation !</strong> 🎧
          </SpeakableText>
        </div>

        {/* SPEAK RIGHT NOW */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ PARLEZ TOUT DE SUITE</h2>
              <button onClick={() => toggleSection('speakNow')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🌍 Pays et drapeaux – Cliquez pour sélectionner</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
                  {flagImages.map((src, index) => (
                    <div key={index} className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedFlag === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setSelectedFlag(src)}>
                      <Image src={src} alt={`Drapeau ${index + 1}`} fill className="object-cover" sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 mx-auto">
                        <Image src={selectedFlag} alt="Drapeau sélectionné" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            Question : <AudioButton text={practiceDialogs[0].question} />
                          </p>
                          <SpeakableText text={practiceDialogs[0].question} className="text-gray-800" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            Réponse : <AudioButton text={practiceDialogs[0].response} />
                          </p>
                          <SpeakableText text={practiceDialogs[0].response} className="text-green-700" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border-2 border-blue-200 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-4 items-start">
                    <div className="w-full md:w-32 flex-shrink-0">
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 mx-auto">
                        <Image src={selectedFood} alt="Plat sélectionné" fill className="object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="space-y-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                            Question : <AudioButton text={practiceDialogs[1].question} />
                          </p>
                          <SpeakableText text={practiceDialogs[1].question} className="text-gray-800" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                            Réponse : <AudioButton text={practiceDialogs[1].response} />
                          </p>
                          <div className="text-lg font-mono bg-white p-3 rounded border border-blue-200 flex flex-wrap gap-1 justify-center">
                            {practiceDialogs[1].response.split('-').map((letter, index) => (
                              <SpeakableText key={index} text={letter.trim()} className="text-red-600 font-bold inline-block px-1.5 py-0.5 bg-red-50 rounded border border-red-200 min-w-[24px] text-center" showIcon={false} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-800 mb-4">🍽️ Plats internationaux – Cliquez pour sélectionner</h3>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {foodImages.map((src, index) => (
                    <div key={index} className={`relative w-full aspect-[3/2] bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selectedFood === src ? 'border-blue-500 shadow-md scale-105' : 'border-gray-300 hover:border-blue-300'}`} onClick={() => setSelectedFood(src)}>
                      <Image src={src} alt={`Plat ${index + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE 1 */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 EXERCICE DE SUBSTITUTION I</h2>
              <button onClick={() => toggleSection('substitution1')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  ✍️ Exercice de substitution I – Cliquez sur les options pour changer les phrases :
                  <AudioButton text="Exercice de substitution un - Cliquez sur les options pour changer les phrases" />
                </h3>

                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <p className="text-green-600 font-medium mb-2 block">{exercise.original}</p>
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <SpeakableText text={currentSentence} className="text-green-700 font-medium" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button key={index} onClick={() => handleSubs1OptionClick(exercise.key, index)} className={`px-3 py-1 rounded-md text-sm font-medium transition ${exercise.currentIndex === index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                              <SpeakableText text={option} showIcon={false} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO NEGATIVE */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➖ METTEZ À LA FORME NÉGATIVE</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
                  ⛔ Mettez à la forme négative – Transformez à la forme négative :
                  <AudioButton text="Mettez à la forme négative - Transformez à la forme négative" />
                </h3>

                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Écrivez la forme négative..." value={writtenAnswers[exercise.key] || ""} onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)} className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)} className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm">Vérifier</button>
                      </div>
                      {showAnswerResults[exercise.key] && <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE 2 */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 EXERCICE DE SUBSTITUTION II</h2>
              <button onClick={() => toggleSection('substitution2')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
                  🔄 Exercice de substitution II – Cliquez pour substituer :
                  <AudioButton text="Exercice de substitution deux - Cliquez pour substituer" />
                </h3>

                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const currentSentence = getCurrentSubs2Sentence(exercise);
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-purple-200">
                        <p className="text-purple-600 font-medium mb-2 block">{exercise.original}</p>
                        <div className="mb-3 p-3 bg-purple-50 rounded-md">
                          <SpeakableText text={currentSentence} className="text-purple-700 font-medium" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button key={index} onClick={() => handleSubs2OptionClick(exercise.key, index)} className={`px-3 py-1 rounded-md text-sm font-medium transition ${exercise.currentIndex === index ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                              <SpeakableText text={option} showIcon={false} />
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ METTEZ À LA FORME AFFIRMATIVE</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                  Mettez à la forme affirmative – Transformez à la forme affirmative :
                  <AudioButton text="Mettez à la forme affirmative - Transformez à la forme affirmative" />
                </h3>

                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Écrivez la forme affirmative..." value={writtenAnswers[`aff-${exercise.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`aff-${exercise.key}`, e.target.value)} className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(`aff-${exercise.key}`, writtenAnswers[`aff-${exercise.key}`] || "", exercise.answer)} className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm">Vérifier</button>
                      </div>
                      {showAnswerResults[`aff-${exercise.key}`] && <AnswerResult isCorrect={answerResults[`aff-${exercise.key}`]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ METTEZ À LA FORME INTERROGATIVE</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center gap-2">
                  Mettez à la forme interrogative – Transformez en questions :
                  <AudioButton text="Mettez à la forme interrogative - Transformez en questions" />
                </h3>

                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                      <SpeakableText text={exercise.sentence} className="text-gray-700 mb-2 block" />
                      <div className="flex gap-2 mb-2">
                        <input type="text" placeholder="Écrivez la forme interrogative..." value={writtenAnswers[`int-${exercise.key}`] || ""} onChange={(e) => handleWrittenAnswerChange(`int-${exercise.key}`, e.target.value)} className="flex-1 px-3 py-2 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />
                        <button onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)} className="bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition text-sm">Vérifier</button>
                      </div>
                      {showAnswerResults[`int-${exercise.key}`] && <AnswerResult isCorrect={answerResults[`int-${exercise.key}`]} correctAnswer={exercise.answer} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUESTIONS */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 QUESTIONS SUR LES LANGUES ET LES PAYS</h2>
              <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  Répondez à ces questions personnelles sur les langues et les pays :
                  <AudioButton text="Répondez à ces questions personnelles sur les langues et les pays" />
                </h3>
              </div>

              <div className="space-y-6">
                {personalQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-indigo-200 shadow-md">
                    <h4 className="text-lg font-bold text-indigo-700 mb-3 flex items-start gap-2">
                      <SpeakableText text={question.question} className="flex-1" />
                      <AudioButton text={question.question} />
                    </h4>
                    <textarea value={writtenAnswers[`q-${question.id}`] || ""} onChange={(e) => handleWrittenAnswerChange(`q-${question.id}`, e.target.value)} placeholder={question.placeholder} className="w-full h-24 p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none" />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">💡 Conseils d'écriture pour les sujets internationaux :</h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 text-sm">
                  <li>Utilisez des noms de pays et de langues spécifiques dans vos réponses</li>
                  <li>Entraînez-vous à utiliser différents pronoms : il, elle, ils, elles, nous</li>
                  <li>Décrivez les différences et les similitudes culturelles</li>
                  <li>Mentionnez des plats traditionnels de différents pays</li>
                  <li>Parlez de vos expériences d'apprentissage des langues</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 ENTRAÎNEZ VOS OREILLES</h2>
              <button onClick={() => toggleSection('tuneIn')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">Regardez la vidéo et répondez aux questions ci-dessous :</h3>
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe src="https://www.youtube.com/embed/2FdrSYbwbXM" title="Pratique d'écoute en français" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-[400px] md:h-[500px]" />
                  </div>
                </div>
              </div>

              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center gap-2">
                  📖 Vocabulaire clé de la vidéo :
                  <AudioButton text="Vocabulaire clé de la vidéo" />
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    {["Astuce - Truque / Técnica", "La façon la plus simple - O jeito mais fácil", "Avez-vous déjà entendu ? - Você já ouviu?", "au fil du temps - ao passar do tempo", "Habitude - Hábito", "S'amuser - Se divertir", "Accents - Sotaques", "Un mélange d'accents - Uma mistura de sotaques", "Argots - Gírias"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <SpeakableText text={item.split(' - ')[0]} className="font-medium text-teal-700" />
                        <span className="text-teal-600">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {["Genre - Tipo", "C'est du gâteau - Isso é muito fácil", "ton et émotion - tom e emoção", "Sarcastique - Sarcástico", "Ça dépend de - Depende de", "Vous serez - Você vai estar", "Probablement pas - Provavelmente não", "Allumer - Ligar", "Procrastiner - Procrastinar", "Un must - algo que você deve fazer"].map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-white rounded-lg">
                        <SpeakableText text={item.split(' - ')[0]} className="font-medium text-teal-700" />
                        <span className="text-teal-600">{item.split(' - ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3 flex items-start gap-2">
                      <SpeakableText text={question.question} className="flex-1" />
                      <AudioButton text={question.question} />
                      {question.isPersonal && <span className="text-sm font-normal text-teal-500">(Réponse personnelle)</span>}
                    </h4>
                    <textarea value={videoAnswers[question.id] || ""} onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)} placeholder="Écrivez votre réponse ici..." className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" />
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => checkVideoAnswer(question.id)} className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition font-medium">Vérifier la réponse</button>
                      <button onClick={() => handleVideoAnswerChange(question.id, "")} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition">Effacer</button>
                    </div>
                    {showVideoAnswerResults[question.id] && question.isPersonal && (
                      <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-md">
                        <p className="text-sm text-teal-700"><span className="font-medium">Note :</span> C'est une question personnelle. Votre réponse a été enregistrée pour la pratique.</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">🎯 Conseils de pratique d'écoute :</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li>Regardez la vidéo au moins deux fois – d'abord pour la compréhension générale, puis pour les détails</li>
                  <li>Mettez la vidéo en pause pour répéter les phrases que vous entendez</li>
                  <li>Faites attention à la prononciation et aux schémas d'intonation</li>
                  <li>Notez le nouveau vocabulaire pendant que vous regardez</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Botões de Salvar e Navegação */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2">💾 Enregistrer toutes mes réponses</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300">Tout effacer</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson7")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">&larr; Leçon précédente</button>
            <button onClick={() => router.push("/cursos/lesson9")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">Leçon suivante &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
}