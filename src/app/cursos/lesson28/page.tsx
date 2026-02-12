"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

// ============================================
// LESSON 28 - GETTING AROUND (TRANSPORT & TRAVEL)
// ============================================

// ============================================
// GRAMMAR EXPLANATION - HOW MUCH vs HOW MANY
// ============================================
const grammarExplanation = {
  howMuch: {
    title: "HOW MUCH - Substantivos Incontáveis (Uncountable Nouns)",
    explanation: "Usamos 'How much' para perguntar sobre quantidades de coisas que NÃO podemos contar individualmente.",
    examples: [
      "How much money? (dinheiro)",
      "How much cheese? (queijo)",
      "How much bread? (pão)",
      "How much milk? (leite)",
      "How much juice? (suco)",
      "How much time? (tempo)",
      "How much rice? (arroz)",
      "How much soup? (sopa)"
    ],
    structure: "How much + substantivo incontável + verbo?",
    answer: "Resposta: I have / There is + quantidade + substantivo"
  },
  howMany: {
    title: "HOW MANY - Substantivos Contáveis (Countable Nouns)",
    explanation: "Usamos 'How many' para perguntar sobre quantidades de coisas que PODEMOS contar individualmente.",
    examples: [
      "How many tickets? (ingressos)",
      "How many suitcases? (malas)",
      "How many bananas? (bananas)",
      "How many glasses of water? (copos de água)",
      "How many souvenirs? (lembranças)",
      "How many slices of cheese? (fatias de queijo)",
      "How many bottles? (garrafas)",
      "How many friends? (amigos)"
    ],
    structure: "How many + substantivo contável (plural) + verbo?",
    answer: "Resposta: I have / There are + número + substantivo"
  }
};

// ----- HOW MUCH (Uncountable Nouns) - EXERCISES -----
const howMuchExercises = [
  { key: "hm-1", question: "How much money do you have?", answer: "I have $150." },
  { key: "hm-2", question: "How much money do you have to buy food?", answer: "I have $200 to buy food." },
  { key: "hm-3", question: "How much cheese do you have?", answer: "I have 500 grams of cheese." },
  { key: "hm-4", question: "How much cheese do we need?", answer: "We need 1 kilo of cheese." },
  { key: "hm-5", question: "How much bread do you want?", answer: "I want two loaves of bread." },
  { key: "hm-6", question: "How much milk is there in the fridge?", answer: "There are 2 liters of milk in the fridge." },
  { key: "hm-7", question: "How much juice do you drink every day?", answer: "I drink one liter of juice every day." },
  { key: "hm-8", question: "How much time do we have?", answer: "We have 30 minutes." },
  { key: "hm-9", question: "How much rice do you eat for lunch?", answer: "I eat one cup of rice." },
  { key: "hm-10", question: "How much soup is there?", answer: "There are three bowls of soup." }
];

// ----- HOW MANY (Countable Nouns) - EXERCISES -----
const howManyExercises = [
  { key: "hmm-1", question: "How many slices of cheese do you have?", answer: "I have 30 slices of cheese." },
  { key: "hmm-2", question: "How many souvenirs do we have to buy?", answer: "We have to buy six souvenirs." },
  { key: "hmm-3", question: "How many glasses of water do we have to buy?", answer: "We have to buy seven glasses of water." },
  { key: "hmm-4", question: "How many bottles of water do you have?", answer: "I have five bottles of water." },
  { key: "hmm-5", question: "How many bananas are there?", answer: "There are twelve bananas." },
  { key: "hmm-6", question: "How many clocks are there in your house?", answer: "There are four clocks in my house." },
  { key: "hmm-7", question: "How many suitcases do they have?", answer: "They have three suitcases." },
  { key: "hmm-8", question: "How many friends are at the party?", answer: "There are fifteen friends at the party." },
  { key: "hmm-9", question: "How many tickets do you need?", answer: "I need two tickets." },
  { key: "hmm-10", question: "How many relatives do you visit on weekends?", answer: "I visit five relatives on weekends." }
];

// ----- SPEAK RIGHT NOW - CARDS (PRACTICE WITH CARDS) -----
const speakRightNowCards = {
  part1: [
    {
      id: "srn-1-1",
      question: "How much money do you have to buy souvenirs?",
      answer: "I have $100 to buy souvenirs.",
      image: "https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?q=80&w=1974&auto=format&fit=crop",
      alt: "Souvenirs and money"
    },
    {
      id: "srn-1-2",
      question: "How much cheese do you need for the party?",
      answer: "I need 2 kilograms of cheese for the party.",
      image: "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?q=80&w=2070&auto=format&fit=crop",
      alt: "Cheese"
    },
    {
      id: "srn-1-3",
      question: "How much bread do you buy per week?",
      answer: "I buy three loaves of bread per week.",
      image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop",
      alt: "Bread"
    },
    {
      id: "srn-1-4",
      question: "How much milk is in the refrigerator?",
      answer: "There are 2 liters of milk in the refrigerator.",
      image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=2025&auto=format&fit=crop",
      alt: "Milk"
    },
    {
      id: "srn-1-5",
      question: "How much juice do you drink daily?",
      answer: "I drink one glass of orange juice daily.",
      image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=1974&auto=format&fit=crop",
      alt: "Orange juice"
    }
  ],
  part2: [
    {
      id: "srn-2-1",
      question: "How many tickets do you need for the museum?",
      answer: "I need two tickets for the museum.",
      image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2070&auto=format&fit=crop",
      alt: "Museum tickets"
    },
    {
      id: "srn-2-2",
      question: "How many suitcases are you taking?",
      answer: "I am taking three suitcases.",
      image: "https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?q=80&w=2034&auto=format&fit=crop",
      alt: "Suitcases"
    },
    {
      id: "srn-2-3",
      question: "How many bananas do you want?",
      answer: "I want six bananas, please.",
      image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=2080&auto=format&fit=crop",
      alt: "Bananas"
    },
    {
      id: "srn-2-4",
      question: "How many glasses of water do you drink per day?",
      answer: "I drink eight glasses of water per day.",
      image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=2035&auto=format&fit=crop",
      alt: "Glass of water"
    },
    {
      id: "srn-2-5",
      question: "How many souvenirs did you buy?",
      answer: "I bought five souvenirs.",
      image: "https://images.unsplash.com/photo-1511407397940-d57f68e81203?q=80&w=1974&auto=format&fit=crop",
      alt: "Souvenirs"
    }
  ]
};

// ----- SUBSTITUTION PRACTICE I (Near/Far Places) -----
const substitutionPractice1 = [
  {
    key: "subs1-1",
    original: "Meu primo mora perto do posto de gasolina. / da farmácia / do mercado",
    base: "My cousin lives near the {0}.",
    options: ["gas station", "drugstore", "supermarket"],
    currentIndex: 0
  },
  {
    key: "subs1-2",
    original: "Elas gostam de ir à praia nas férias. / ao parque / ao campo",
    base: "They like to go to the {0} on vacation.",
    options: ["beach", "park", "countryside"],
    currentIndex: 0
  },
  {
    key: "subs1-3",
    original: "Ele não quer visitar o museu hoje. / amanhã / este mês",
    base: "He doesn't want to visit the museum {0}.",
    options: ["today", "tomorrow", "this month"],
    currentIndex: 0
  },
  {
    key: "subs1-4",
    original: "Quantos filhos você tem? / irmãos e irmãs / tios e tias",
    base: "How many {0} do you have?",
    options: ["children", "brothers and sisters", "uncles and aunts"],
    currentIndex: 0
  },
  {
    key: "subs1-5",
    original: "Eu quero encontrar meus amigos amanhã. / parentes / primos",
    base: "I want to meet my {0} tomorrow.",
    options: ["friends", "relatives", "cousins"],
    currentIndex: 0
  }
];

// ----- NEGATIVE TRANSFORMATION EXERCISES -----
const negativeExercises = [
  { key: "neg-1", sentence: "He lives far from here.", answer: "He doesn't live far from here." },
  { key: "neg-2", sentence: "They want to buy a lot of fruit.", answer: "They don't want to buy a lot of fruit." },
  { key: "neg-3", sentence: "We want to visit Brazil on vacation.", answer: "We don't want to visit Brazil on vacation." },
  { key: "neg-4", sentence: "She goes to the movies on weekends.", answer: "She doesn't go to the movies on weekends." },
  { key: "neg-5", sentence: "You need to take a lot of money.", answer: "You don't need to take a lot of money." },
  { key: "neg-6", sentence: "I have to buy a gift for my uncle.", answer: "I don't have to buy a gift for my uncle." }
];

// ----- SUBSTITUTION PRACTICE II (Possessions & Actions) -----
const substitutionPractice2 = [
  {
    key: "subs2-1",
    original: "Meu tio tem uma casa grande. / um apartamento / um carro",
    base: "My uncle has {0}.",
    options: ["a big house", "an apartment", "a car"],
    currentIndex: 0
  },
  {
    key: "subs2-2",
    original: "Eu não encontro meus professores no sábado. / vejo / visito",
    base: "I don't {0} my teachers on Saturday.",
    options: ["meet", "see", "visit"],
    currentIndex: 0
  },
  {
    key: "subs2-3",
    original: "Quando você visita seus parentes? / seus pais / seus amigos",
    base: "When do you visit {0}?",
    options: ["your relatives", "your parents", "your friends"],
    currentIndex: 0
  },
  {
    key: "subs2-4",
    original: "Eu leio aproximadamente três livros nas férias. / cinco / sete",
    base: "I read approximately {0} books on vacation.",
    options: ["three", "five", "seven"],
    currentIndex: 0
  },
  {
    key: "subs2-5",
    original: "Você mora perto ou longe daqui? / Eles / Ela",
    base: "{0} live near or far from here?",
    options: ["Do you", "Do they", "Does she"],
    currentIndex: 0
  }
];

// ----- AFFIRMATIVE TRANSFORMATION EXERCISES -----
const affirmativeExercises = [
  { key: "aff-1", sentence: "She doesn't buy expensive things.", answer: "She buys expensive things." },
  { key: "aff-2", sentence: "My husband doesn't need a new passport.", answer: "My husband needs a new passport." },
  { key: "aff-3", sentence: "We don't want to go to the park on Sunday.", answer: "We want to go to the park on Sunday." },
  { key: "aff-4", sentence: "I don't visit my grandparents on weekends.", answer: "I visit my grandparents on weekends." },
  { key: "aff-5", sentence: "I don't want to meet you today.", answer: "I want to meet you today." },
  { key: "aff-6", sentence: "We don't know your cousins.", answer: "We know your cousins." }
];

// ----- LISTEN AND PRACTICE PHRASES (WITH CONTEXTUAL IMAGES - NO TEXT OVERLAY) -----
const listenItems = [
  {
    key: "listen-1",
    phrase: "I love to meet my friends at the coffee shop.",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop",
    alt: "Coffee shop with friends",
    correctAnswer: "I love to meet my friends at the coffee shop."
  },
  {
    key: "listen-2",
    phrase: "She prefers to stay home on vacation.",
    image: "https://images.unsplash.com/photo-1584101762561-0673ad59e4f4?q=80&w=1974&auto=format&fit=crop",
    alt: "Woman relaxing at home on vacation",
    correctAnswer: "She prefers to stay home on vacation."
  },
  {
    key: "listen-3",
    phrase: "My uncle and my aunt live in the U.K.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop",
    alt: "London - United Kingdom",
    correctAnswer: "My uncle and my aunt live in the U.K."
  },
  {
    key: "listen-4",
    phrase: "Do you visit your relatives on weekends?",
    image: "https://images.unsplash.com/photo-1581006852262-55c632039a8e?q=80&w=2070&auto=format&fit=crop",
    alt: "Happy family gathering",
    correctAnswer: "Do you visit your relatives on weekends?"
  },
  {
    key: "listen-5",
    phrase: "Do you have money to buy that?",
    image: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?q=80&w=2071&auto=format&fit=crop",
    alt: "US Dollar money",
    correctAnswer: "Do you have money to buy that?"
  },
  {
    key: "listen-6",
    phrase: "Two tickets for the museum, please.",
    image: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=2070&auto=format&fit=crop",
    alt: "Museum tickets",
    correctAnswer: "Two tickets for the museum, please."
  }
];

// ----- PERSONAL QUESTIONS (Getting Around & Travel) -----
const personalQuestions = [
  {
    id: 1,
    question: "How much money do you usually take on vacation?",
    placeholder: "Write about how much money you take on trips..."
  },
  {
    id: 2,
    question: "How many suitcases do you take on a long trip?",
    placeholder: "Describe how many bags you travel with..."
  },
  {
    id: 3,
    question: "How much time do you spend planning a vacation?",
    placeholder: "Write about your trip planning habits..."
  },
  {
    id: 4,
    question: "How many souvenirs do you usually buy when you travel?",
    placeholder: "Tell about souvenirs you like to buy..."
  },
  {
    id: 5,
    question: "How many countries do you want to visit in the future?",
    placeholder: "List the countries you dream of visiting..."
  },
  {
    id: 6,
    question: "How much cheese do you eat per week?",
    placeholder: "Describe your cheese consumption..."
  },
  {
    id: 7,
    question: "How many glasses of water do you drink every day?",
    placeholder: "Write about your daily water intake..."
  },
  {
    id: 8,
    question: "How much bread do you buy per week?",
    placeholder: "Tell about how much bread you consume..."
  },
  {
    id: 9,
    question: "How many relatives live near your house?",
    placeholder: "Describe how many family members live close to you..."
  },
  {
    id: 10,
    question: "How much juice do you drink in the morning?",
    placeholder: "Write about your morning juice habits..."
  }
];

// ----- VIDEO QUESTIONS (TUNE IN YOUR EARS) -----
const videoQuestions = [
  {
    id: 1,
    question: "What is the importance of listening when learning a second language?",
    isPersonal: false,
    vocabulary: [
      { english: "listening comprehension", portuguese: "compreensão auditiva" },
      { english: "pronunciation", portuguese: "pronúncia" },
      { english: "intonation", portuguese: "entonação" }
    ]
  },
  {
    id: 2,
    question: "How did you learn your first language?",
    isPersonal: true,
    vocabulary: [
      { english: "by listening", portuguese: "ouvindo" },
      { english: "repetition", portuguese: "repetição" },
      { english: "imitation", portuguese: "imitação" }
    ]
  },
  {
    id: 3,
    question: "How can you use listening to improve your English?",
    isPersonal: false,
    vocabulary: [
      { english: "podcasts", portuguese: "podcasts" },
      { english: "movies with subtitles", portuguese: "filmes com legendas" },
      { english: "music lyrics", portuguese: "letras de música" }
    ]
  },
  {
    id: 4,
    question: "What are the advantages of listening?",
    isPersonal: false,
    vocabulary: [
      { english: "improve accent", portuguese: "melhorar o sotaque" },
      { english: "learn vocabulary", portuguese: "aprender vocabulário" },
      { english: "understand native speakers", portuguese: "entender falantes nativos" }
    ]
  },
  {
    id: 5,
    question: "Learning English can be all about words, but it has a lot to do with feeling. What are you doing to know more about slangs, idioms and so on?",
    isPersonal: true,
    vocabulary: [
      { english: "slangs", portuguese: "gírias" },
      { english: "idioms", portuguese: "expressões idiomáticas" },
      { english: "cultural expressions", portuguese: "expressões culturais" }
    ]
  },
  {
    id: 6,
    question: "Do you think to understand all the words is important when you are watching something or catching the main idea is what really matters?",
    isPersonal: true,
    vocabulary: [
      { english: "main idea", portuguese: "ideia principal" },
      { english: "details", portuguese: "detalhes" },
      { english: "context", portuguese: "contexto" }
    ]
  },
  {
    id: 7,
    question: "Why is learning English with subtitles so important?",
    isPersonal: false,
    vocabulary: [
      { english: "subtitles", portuguese: "legendas" },
      { english: "visual reinforcement", portuguese: "reforço visual" },
      { english: "spelling", portuguese: "ortografia" }
    ]
  },
  {
    id: 8,
    question: "What do you need to do to be ready for real life situations like restaurants, ordering food, asking for directions in an English-speaking country?",
    isPersonal: true,
    vocabulary: [
      { english: "asking for directions", portuguese: "pedir informações" },
      { english: "ordering food", portuguese: "pedir comida" },
      { english: "polite expressions", portuguese: "expressões educadas" }
    ]
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) =>
    text.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

// ============================================
// COMPONENTS
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

const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
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

const HighlightedText = ({
  text,
  highlightedWords,
  onWordClick
}: {
  text: string;
  highlightedWords: string[];
  onWordClick?: (word: string) => void;
}) => {
  const words = text.split(' ');
  
  return (
    <p className="text-gray-800">
      {words.map((word, index) => {
        const cleanWord = word.replace('?', '').replace('!', '').replace('.', '').replace(',', '');
        const isHighlighted = highlightedWords.includes(cleanWord);
        
        return (
          <span
            key={index}
            className={isHighlighted ? "text-red-600 font-semibold cursor-pointer hover:bg-yellow-100 px-1 rounded" : ""}
            onClick={isHighlighted && onWordClick ? () => onWordClick(cleanWord) : undefined}
          >
            {word}
            {index < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </p>
  );
};

// ============================================
// SPEAK RIGHT NOW CARD COMPONENT
// ============================================
const SpeakRightNowCard = ({ 
  card, 
  onNext, 
  onPrev, 
  currentIndex, 
  totalCards 
}: { 
  card: typeof speakRightNowCards.part1[0];
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-orange-300">
        {/* Card Image */}
        <div className="relative h-56 w-full">
          <Image
            src={card.image}
            alt={card.alt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-sm font-medium bg-orange-500 inline-block px-3 py-1 rounded-full">
              Card {currentIndex + 1} of {totalCards}
            </p>
          </div>
        </div>

        {/* Card Content - Question & Answer */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-orange-500 mb-1">QUESTION:</h3>
            <p className="text-lg font-bold text-gray-800">{card.question}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-green-600 mb-1">ANSWER:</h3>
            <p className="text-lg font-bold text-gray-800">{card.answer}</p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalCards }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={onNext}
              disabled={currentIndex === totalCards - 1}
              className={`p-3 rounded-full transition ${
                currentIndex === totalCards - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GRAMMAR EXPLANATION COMPONENT
// ============================================
const GrammarExplanation = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white py-4 px-8">
        <h2 className="text-2xl font-bold text-center">📚 HOW MUCH vs HOW MANY - Gramática</h2>
      </div>
      <div className="p-8 grid md:grid-cols-2 gap-8">
        {/* HOW MUCH */}
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-2">🔵</span> 
            {grammarExplanation.howMuch.title}
          </h3>
          <p className="text-gray-700 mb-4">{grammarExplanation.howMuch.explanation}</p>
          <div className="bg-blue-50 p-3 rounded-lg mb-3">
            <p className="text-sm font-semibold text-blue-800">📌 Estrutura:</p>
            <p className="text-blue-700 font-medium">{grammarExplanation.howMuch.structure}</p>
            <p className="text-blue-600 text-sm mt-1">{grammarExplanation.howMuch.answer}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">📝 Exemplos:</p>
            <div className="grid grid-cols-2 gap-2">
              {grammarExplanation.howMuch.examples.map((ex, idx) => (
                <div key={idx} className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  {ex}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* HOW MANY */}
        <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
          <h3 className="text-xl font-bold text-green-700 mb-3 flex items-center">
            <span className="bg-green-100 p-2 rounded-full mr-2">🟢</span> 
            {grammarExplanation.howMany.title}
          </h3>
          <p className="text-gray-700 mb-4">{grammarExplanation.howMany.explanation}</p>
          <div className="bg-green-50 p-3 rounded-lg mb-3">
            <p className="text-sm font-semibold text-green-800">📌 Estrutura:</p>
            <p className="text-green-700 font-medium">{grammarExplanation.howMany.structure}</p>
            <p className="text-green-600 text-sm mt-1">{grammarExplanation.howMany.answer}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">📝 Exemplos:</p>
            <div className="grid grid-cols-2 gap-2">
              {grammarExplanation.howMany.examples.map((ex, idx) => (
                <div key={idx} className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  {ex}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function Lesson28GettingAround() {
  const router = useRouter();
  
  // ----- SECTION VISIBILITY STATE -----
  const [sections, setSections] = useState({
    grammar: true,
    speakNow: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    listen: true,
    questions: true,
    tuneIn: true
  });

  // ----- EXERCISE STATES -----
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});

  // ----- SPEAK RIGHT NOW CARD STATES -----
  const [speakRightNowPart1Index, setSpeakRightNowPart1Index] = useState(0);
  const [speakRightNowPart2Index, setSpeakRightNowPart2Index] = useState(0);

  // ============================================
  // PERSISTENCE - LOAD
  // ============================================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson28Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setShowVideoAnswerResults(data.showVideoAnswerResults || {});
        setSpeakRightNowPart1Index(data.speakRightNowPart1Index || 0);
        setSpeakRightNowPart2Index(data.speakRightNowPart2Index || 0);
        
        if (data.sections) setSections(data.sections);
        
        console.log("✅ Lesson 28 data loaded from localStorage");
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
      videoAnswers,
      answerResults,
      showAnswerResults,
      showVideoAnswerResults,
      speakRightNowPart1Index,
      speakRightNowPart2Index,
      sections,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 28 - Getting Around",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson28Answers", JSON.stringify(data));
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
      setVideoAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setShowVideoAnswerResults({});
      setSpeakRightNowPart1Index(0);
      setSpeakRightNowPart2Index(0);
      
      localStorage.removeItem("lesson28Answers");
      alert("✅ All answers have been cleared.");
    }
  };

  // ============================================
  // HANDLER FUNCTIONS
  // ============================================
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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

  const handleWordClick = (word: string) => {
    console.log(`🔊 Playing audio for: ${word}`);
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072')` }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">📘 LESSON 28 – GETTING AROUND</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Learn to ask and answer questions about quantities, distances, and travel plans. 
            Practice <span className="font-bold text-blue-600">How much</span> (uncountable) and 
            <span className="font-bold text-blue-600"> How many</span> (countable) with real-life travel situations.
          </p>
        </div>

        {/* ======================================== */}
        {/* GRAMMAR EXPLANATION - HOW MUCH vs HOW MANY */}
        {/* ======================================== */}
        <GrammarExplanation />

        {/* ======================================== */}
        {/* SPEAK RIGHT NOW - PRACTICE WITH CARDS */}
        {/* ======================================== */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW - Practice with Cards</h2>
              <span className="ml-3 text-sm bg-white text-orange-600 px-3 py-1 rounded-full">YouTube: Speak Right Now - Lesson 28</span>
              <button onClick={() => toggleSection('speakNow')} className="ml-4 p-2 rounded-full hover:bg-orange-600 transition">
                {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              {/* HOW MUCH - CARDS */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold mr-3">HOW MUCH</span>
                    <h3 className="text-xl font-bold text-blue-800">Substantivos Incontáveis</h3>
                  </div>
                  <div className="bg-orange-100 px-4 py-2 rounded-full">
                    <span className="text-orange-700 font-medium">Card {speakRightNowPart1Index + 1} of {speakRightNowCards.part1.length}</span>
                  </div>
                </div>
                
                <SpeakRightNowCard
                  card={speakRightNowCards.part1[speakRightNowPart1Index]}
                  currentIndex={speakRightNowPart1Index}
                  totalCards={speakRightNowCards.part1.length}
                  onNext={() => setSpeakRightNowPart1Index(prev => Math.min(prev + 1, speakRightNowCards.part1.length - 1))}
                  onPrev={() => setSpeakRightNowPart1Index(prev => Math.max(prev - 1, 0))}
                />
              </div>

              {/* HOW MANY - CARDS */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <span className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold mr-3">HOW MANY</span>
                    <h3 className="text-xl font-bold text-green-800">Substantivos Contáveis</h3>
                  </div>
                  <div className="bg-green-100 px-4 py-2 rounded-full">
                    <span className="text-green-700 font-medium">Card {speakRightNowPart2Index + 1} of {speakRightNowCards.part2.length}</span>
                  </div>
                </div>
                
                <SpeakRightNowCard
                  card={speakRightNowCards.part2[speakRightNowPart2Index]}
                  currentIndex={speakRightNowPart2Index}
                  totalCards={speakRightNowCards.part2.length}
                  onNext={() => setSpeakRightNowPart2Index(prev => Math.min(prev + 1, speakRightNowCards.part2.length - 1))}
                  onPrev={() => setSpeakRightNowPart2Index(prev => Math.max(prev - 1, 0))}
                />
              </div>

              <div className="mt-8 p-5 bg-gradient-to-r from-orange-100 to-amber-100 rounded-xl border border-orange-300 text-center">
                <p className="text-orange-800 font-medium text-lg">
                  💡 Clique nas setas para navegar entre os cards. Pratique falando a pergunta e a resposta em voz alta!
                </p>
                <p className="text-orange-700 mt-2">
                  🔵 HOW MUCH = coisas que você NÃO pode contar individualmente (dinheiro, queijo, leite)
                </p>
                <p className="text-green-700">
                  🟢 HOW MANY = coisas que você PODE contar individualmente (ingressos, malas, bananas)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* SUBSTITUTION PRACTICE I */}
        {/* ======================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button onClick={() => toggleSection('substitution1')} className="ml-4 p-2 rounded-full hover:bg-purple-700 transition">
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 font-medium italic">Substitua conforme o modelo. Click on options to change the sentences:</p>
              <div className="space-y-6">
                {subs1Exercises.map((exercise) => {
                  const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                  return (
                    <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-purple-200">
                      <p className="text-gray-600 mb-2 text-sm">{exercise.original}</p>
                      <p className="text-purple-700 font-bold text-lg mb-3">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleSubs1OptionClick(exercise.key, index)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                              exercise.currentIndex === index
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
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
          )}
        </div>

        {/* ======================================== */}
        {/* CHANGE INTO NEGATIVE */}
        {/* ======================================== */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">⛔ CHANGE INTO NEGATIVE</h2>
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
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button onClick={() => toggleSection('substitution2')} className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition">
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <p className="text-indigo-700 mb-6 font-medium italic">Click on options to change the sentences:</p>
              <div className="space-y-6">
                {subs2Exercises.map((exercise) => {
                  const baseSentence = exercise.base;
                  const currentSentence = baseSentence.replace('{0}', exercise.options[exercise.currentIndex]);
                  return (
                    <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-indigo-200">
                      <p className="text-gray-600 mb-2 text-sm">{exercise.original}</p>
                      <p className="text-indigo-700 font-bold text-lg mb-3">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleSubs2OptionClick(exercise.key, index)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                              exercise.currentIndex === index
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
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
        {/* LISTEN AND PRACTICE - WITH CONTEXTUAL IMAGES (NO TEXT OVERLAY) */}
        {/* ======================================== */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 LISTEN AND PRACTICE</h2>
              <button onClick={() => toggleSection('listen')} className="ml-4 p-2 rounded-full hover:bg-orange-600 transition">
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l28_listenandpractice.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {listenItems.map((item) => (
                <div key={item.key} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-orange-200">
                  {/* Imagem contextual que faz sentido com a frase - SEM TEXTO */}
                  <div className="w-[220px] h-[160px] relative mb-4 rounded-lg overflow-hidden border-2 border-orange-300 shadow-md">
                    <Image 
                      src={item.image} 
                      alt={item.alt} 
                      fill 
                      className="object-cover"
                    />
                    {/* SEM OVERLAY DE TEXTO - Apenas a imagem pura */}
                  </div>
                  
                  <div className="w-full mb-3">
                    <textarea
                      placeholder="Write what you heard..."
                      value={writtenAnswers[item.key] || ""}
                      onChange={(e) => handleWrittenAnswerChange(item.key, e.target.value)}
                      className="w-full h-[80px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => handleCheckAnswer(item.key, writtenAnswers[item.key] || "", item.correctAnswer)}
                      className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition font-medium"
                    >
                      Check
                    </button>
                    <button
                      onClick={() => {
                        handleWrittenAnswerChange(item.key, "");
                        setShowAnswerResults(prev => ({ ...prev, [item.key]: false }));
                      }}
                      className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                    >
                      Clear
                    </button>
                  </div>
                  {showAnswerResults[item.key] && (
                    <AnswerResult isCorrect={answerResults[item.key]} correctAnswer={item.correctAnswer} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PERSONAL QUESTIONS */}
        {/* ======================================== */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 PERSONAL QUESTIONS – Getting Around & Travel</h2>
              <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-blue-700 transition">
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="space-y-6">
                {personalQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
                    <h4 className="text-lg font-bold text-blue-700 mb-3">❓ {question.question}</h4>
                    <textarea
                      value={writtenAnswers[`q-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`q-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-24 p-3 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">💡 Travel Vocabulary Tips:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🛄 suitcase</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🎫 ticket</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🧀 cheese</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🥖 bread</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🥛 milk</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🧃 juice</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">⏰ time</span>
                  <span className="bg-white px-3 py-2 rounded-full text-blue-700 font-medium">🍚 rice</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* TUNE IN YOUR EARS - VIDEO SECTION */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button onClick={() => toggleSection('tuneIn')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">Watch the video and answer the questions:</h3>
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/2FdrSYbwbXM"
                      title="English Listening Practice"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3">
                      {question.question}
                      {question.isPersonal && <span className="ml-2 text-sm font-normal text-teal-500">(Personal answer)</span>}
                    </h4>
                    {question.vocabulary && (
                      <div className="mb-3 p-3 bg-teal-50 rounded-lg">
                        <p className="text-sm font-medium text-teal-600 mb-1">Vocabulary help:</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          {question.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-teal-700 font-medium">{word.english}</span>
                              <span className="text-teal-600">- {word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <textarea
                      value={videoAnswers[question.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 resize-none"
                    />
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => checkVideoAnswer(question.id)}
                        className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md transition font-medium"
                      >
                        Save Answer
                      </button>
                    </div>
                  </div>
                ))}
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
              onClick={() => router.push("/cursos/lesson27")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson29")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 28 – Getting Around | Complete answers with How much / How many</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}