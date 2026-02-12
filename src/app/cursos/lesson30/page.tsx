"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  XCircle,
} from "lucide-react";

// ============================================
// DADOS DA LIÇÃO 30 - FLUENCY & IMPERATIVES
// ============================================

// --- PÁGINA 1: FLUENCY (IMAGENS + FRASES ORIGINAIS) ---
const fluencyImages = [
  {
    id: "img-a",
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
    alt: "Friends at school",
    phrase: "Speak with your friends at school.",
    negative: "Don’t speak with your friends at school.",
    variations: ["Speak with your teachers.", "Speak with your parents."],
  },
  {
    id: "img-b",
    src: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
    alt: "Turn sign",
    phrase: "Turn left at the park.",
    negative: "Don’t turn left at the park.",
    variations: ["Turn right at the bank.", "Turn left on this street."],
  },
  {
    id: "img-c",
    src: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
    alt: "Subway",
    phrase: "Take the subway to school.",
    negative: "Don’t take the subway to school.",
    variations: ["Take the bus to work.", "Take a cab to the airport."],
  },
  {
    id: "img-d",
    src: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
    alt: "Work on computer",
    phrase: "Work on your computer today.",
    negative: "Don’t work on your computer today.",
    variations: ["Work at the office.", "Work from home."],
  },
  {
    id: "img-e",
    src: "https://images.unsplash.com/photo-1516550893888-a82f123f2ab0?w=400&q=80",
    alt: "Stay home",
    phrase: "Stay home all day long.",
    negative: "Don’t stay home all day long.",
    variations: ["Stay here with me.", "Stay at school."],
  },
  {
    id: "img-f",
    src: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25?w=400&q=80",
    alt: "Park with children",
    phrase: "Go to the park with your children.",
    negative: "Don’t go to the park with your children.",
    variations: ["Go to the museum.", "Go downtown."],
  },
  {
    id: "img-g",
    src: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
    alt: "Drive to work",
    phrase: "Drive to work.",
    negative: "Don’t drive to work.",
    variations: ["Drive to school.", "Drive downtown."],
  },
];

// --- FLUENCY CARDS (COMBINAÇÕES DINÂMICAS) ---
type FluencyCard = {
  id: string;
  image: string;
  alt: string;
  imperative: string;
  negative: string;
  pronounVariations: {
    person: string;
    sentence: string;
    negative: string;
  }[];
  combinationSuggestions: string[];
};

const generateFluencyCards = (): FluencyCard[] => {
  return [
    {
      id: "fluency-speak",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80",
      alt: "Speak",
      imperative: "Speak with your friends at school.",
      negative: "Don’t speak with your friends at school.",
      pronounVariations: [
        { person: "I", sentence: "I speak with my friends at school.", negative: "I don’t speak with my friends at school." },
        { person: "She", sentence: "She speaks with her friends at school.", negative: "She doesn’t speak with her friends at school." },
        { person: "They", sentence: "They speak with their friends at school.", negative: "They don’t speak with their friends at school." },
        { person: "We", sentence: "We speak with our friends at school.", negative: "We don’t speak with our friends at school." },
      ],
      combinationSuggestions: [
        "Don’t speak. Go to the library.",
        "She speaks with her teachers.",
        "They don’t speak during class.",
      ],
    },
    {
      id: "fluency-turn",
      image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=80",
      alt: "Turn",
      imperative: "Turn left at the park.",
      negative: "Don’t turn left at the park.",
      pronounVariations: [
        { person: "He", sentence: "He turns left at the park.", negative: "He doesn’t turn left at the park." },
        { person: "You", sentence: "You turn left at the park.", negative: "You don’t turn left at the park." },
      ],
      combinationSuggestions: [
        "Turn right after the museum.",
        "Don’t turn left. Turn right.",
        "She turns left every day.",
      ],
    },
    {
      id: "fluency-take",
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&q=80",
      alt: "Take",
      imperative: "Take the subway to school.",
      negative: "Don’t take the subway to school.",
      pronounVariations: [
        { person: "I", sentence: "I take the subway to school.", negative: "I don’t take the subway to school." },
        { person: "She", sentence: "She takes the subway to school.", negative: "She doesn’t take the subway to school." },
        { person: "They", sentence: "They take the subway to school.", negative: "They don’t take the subway to school." },
      ],
      combinationSuggestions: [
        "Take the bus to work.",
        "Don’t take the subway. Take a cab.",
        "He takes the train downtown.",
      ],
    },
    {
      id: "fluency-work",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
      alt: "Work",
      imperative: "Work on your computer today.",
      negative: "Don’t work on your computer today.",
      pronounVariations: [
        { person: "He", sentence: "He works on his computer today.", negative: "He doesn’t work on his computer today." },
        { person: "They", sentence: "They work on their computer today.", negative: "They don’t work on their computer today." },
      ],
      combinationSuggestions: [
        "Work at the office.",
        "Don’t work today. Stay home.",
        "She doesn’t work downtown.",
      ],
    },
    {
      id: "fluency-stay",
      image: "https://images.unsplash.com/photo-1516550893888-a82f123f2ab0?w=400&q=80",
      alt: "Stay",
      imperative: "Stay home all day long.",
      negative: "Don’t stay home all day long.",
      pronounVariations: [
        { person: "I", sentence: "I stay home all day long.", negative: "I don’t stay home all day long." },
        { person: "She", sentence: "She stays home all day long.", negative: "She doesn’t stay home all day long." },
      ],
      combinationSuggestions: [
        "Stay here with me.",
        "Don’t stay home. Go out.",
        "We stay near the park.",
      ],
    },
    {
      id: "fluency-go",
      image: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25?w=400&q=80",
      alt: "Go",
      imperative: "Go to the park with your children.",
      negative: "Don’t go to the park with your children.",
      pronounVariations: [
        { person: "I", sentence: "I go to the park with my children.", negative: "I don’t go to the park with my children." },
        { person: "She", sentence: "She goes to the park with her children.", negative: "She doesn’t go to the park with her children." },
        { person: "They", sentence: "They go to the park with their children.", negative: "They don’t go to the park with their children." },
      ],
      combinationSuggestions: [
        "Go to the museum.",
        "Don’t go alone.",
        "We go downtown by bus.",
      ],
    },
    {
      id: "fluency-drive",
      image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&q=80",
      alt: "Drive",
      imperative: "Drive to work.",
      negative: "Don’t drive to work.",
      pronounVariations: [
        { person: "He", sentence: "He drives to work.", negative: "He doesn’t drive to work." },
        { person: "We", sentence: "We drive to work.", negative: "We don’t drive to work." },
      ],
      combinationSuggestions: [
        "Drive to school.",
        "Don’t drive. Take the bus.",
        "She doesn’t drive a bus.",
      ],
    },
  ];
};

// --- SUBSTITUTION PRACTICE I (PÁGINA 2) ---
const substitutionPractice1 = [
  {
    key: "subs1-1",
    original: "Eu geralmente vou ao centro da cidade de carro. / de ônibus / de metrô",
    base: "I usually go downtown {0}.",
    options: ["by car", "by bus", "by subway"],
    currentIndex: 0,
  },
  {
    key: "subs1-2",
    original: "Eles não querem ir depois do trabalho. / antes",
    base: "They don’t want to go {0} work.",
    options: ["after", "before"],
    currentIndex: 0,
  },
  {
    key: "subs1-3",
    original: "Ela mora perto da praça. / do parque / da estação de metrô",
    base: "She lives near {0}.",
    options: ["the square", "the park", "the subway station"],
    currentIndex: 0,
  },
  {
    key: "subs1-4",
    original: "Eu moro nesta rua. / nesta avenida / neste quarteirão",
    base: "I live on {0}.",
    options: ["this street", "this avenue", "this block"],
    currentIndex: 0,
  },
  {
    key: "subs1-5",
    original: "Ele caminha para o trabalho todos os dias. / escritório / banco",
    base: "He walks to {0} every day.",
    options: ["work", "the office", "the bank"],
    currentIndex: 0,
  },
];

// --- CHANGE INTO NEGATIVE (PÁGINA 2) ---
const negativeExercises = [
  { key: "neg-1", sentence: "Stay here with me.", answer: "Don’t stay here with me." },
  { key: "neg-2", sentence: "Take your passport with you.", answer: "Don’t take your passport with you." },
  { key: "neg-3", sentence: "Turn right on this street.", answer: "Don’t turn right on this street." },
  { key: "neg-4", sentence: "Buy chocolate cookies at the grocery store.", answer: "Don’t buy chocolate cookies at the grocery store." },
  { key: "neg-5", sentence: "Go to the museum by motorcycle.", answer: "Don’t go to the museum by motorcycle." },
  { key: "neg-6", sentence: "Walk two blocks.", answer: "Don’t walk two blocks." },
];

// --- SUBSTITUTION PRACTICE II (PÁGINA 3) ---
const substitutionPractice2 = [
  {
    key: "subs2-1",
    original: "Ele me leva de carro para casa. / centro da cidade / para a estação de trem",
    correctAnswer: "He takes me home by car.",
    options: ["home", "downtown", "the train station"],
    currentIndex: 0,
  },
  {
    key: "subs2-2",
    original: "Pegue um táxi para ir ao shopping. / cinema / aeroporto",
    correctAnswer: "Take a cab to the mall.",
    options: ["the mall", "the cinema", "the airport"],
    currentIndex: 0,
  },
  {
    key: "subs2-3",
    original: "Nós precisamos visitar seu avô. / sua avó / seus avós",
    correctAnswer: "We need to visit your grandfather.",
    options: ["your grandfather", "your grandmother", "your grandparents"],
    currentIndex: 0,
  },
  {
    key: "subs2-4",
    original: "Eles têm uma casa de praia. / perto daqui / longe daqui",
    correctAnswer: "They have a beach house.",
    options: ["a beach house", "near here", "far from here"],
    currentIndex: 0,
  },
  {
    key: "subs2-5",
    original: "Meu primo quer me levar ao aeroporto. / restaurante / cafeteria",
    correctAnswer: "My cousin wants to take me to the airport.",
    options: ["the airport", "the restaurant", "the coffee shop"],
    currentIndex: 0,
  },
];

// --- CHANGE INTO AFFIRMATIVE (PÁGINA 3) ---
const affirmativeExercises = [
  { key: "aff-1", sentence: "My grandparents don’t like to go to the museum.", answer: "My grandparents like to go to the museum." },
  { key: "aff-2", sentence: "Don’t go straight ahead.", answer: "Go straight ahead." },
  { key: "aff-3", sentence: "They don’t work near here.", answer: "They work near here." },
  { key: "aff-4", sentence: "She doesn’t know the price of food there.", answer: "She knows the price of food there." },
  { key: "aff-5", sentence: "They don’t have money to buy the tickets.", answer: "They have money to buy the tickets." },
  { key: "aff-6", sentence: "He doesn’t drive a bus.", answer: "He drives a bus." },
];

// --- QUESTIONS (PÁGINA 4) ---
const personalQuestions = [
  { id: 1, question: "Do you live far from here?", placeholder: "Yes, I live far from here. / No, I live near here." },
  { id: 2, question: "Do you take the bus to go to work / school?", placeholder: "I take the bus to school every day." },
  { id: 3, question: "Do you prefer to drive or to walk?", placeholder: "I prefer to drive because it's faster." },
  { id: 4, question: "Do you take a cab when you have to go to the airport?", placeholder: "Yes, I usually take a cab." },
  { id: 5, question: "Do you need to take a bus to go downtown from here?", placeholder: "No, I can walk downtown." },
  { id: 6, question: "What’s your address?", placeholder: "I live on Main Street, number 123." },
  { id: 7, question: "Does your cousin live on this street?", placeholder: "Yes, my cousin lives on this street." },
  { id: 8, question: "Where do you usually go on vacation?", placeholder: "I usually go to the beach." },
  { id: 9, question: "How much money do you have to go to the museum?", placeholder: "I have 20 dollars." },
  { id: 10, question: "Where do you have to go after class?", placeholder: "I have to go home after class." },
];

// ============================================
// COMPONENTES AUXILIARES
// ============================================
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) =>
    text.toLowerCase().trim().replace(/[.,?!]/g, "");
  return normalize(userAnswer) === normalize(correctAnswer);
};

const AnswerResult = ({
  isCorrect,
  correctAnswer,
}: {
  isCorrect: boolean;
  correctAnswer: string;
}) => {
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
// COMPONENTE PRINCIPAL - LIÇÃO 30
// ============================================
export default function Lesson30Fluency() {
  const router = useRouter();

  // Estados para controle de seções
  const [sections, setSections] = useState({
    fluency: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    questions: true,
  });

  // Estados para os cards de fluência
  const [fluencyCards] = useState<FluencyCard[]>(generateFluencyCards());
  const [activeFluencyCard, setActiveFluencyCard] = useState<string>(fluencyCards[0].id);
  const [showNegative, setShowNegative] = useState<Record<string, boolean>>({});
  const [showPronounVariation, setShowPronounVariation] = useState<Record<string, string>>({});

  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);

  // Estados para respostas escritas e verificação
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  // ==============================
  // PERSISTÊNCIA (LOCALSTORAGE)
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson30Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setSections(data.sections || sections);
        if (data.activeFluencyCard) setActiveFluencyCard(data.activeFluencyCard);
        if (data.showNegative) setShowNegative(data.showNegative);
        if (data.showPronounVariation) setShowPronounVariation(data.showPronounVariation);
      } catch (error) {
        console.error("Erro ao carregar dados salvos:", error);
      }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises,
      subs2Exercises,
      writtenAnswers,
      answerResults,
      showAnswerResults,
      sections,
      activeFluencyCard,
      showNegative,
      showPronounVariation,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 30 - Fluency & Imperatives",
    };
    localStorage.setItem("lesson30Answers", JSON.stringify(data));
    alert("✅ Todas as suas respostas foram salvas!");
  };

  const clearAllAnswers = () => {
    if (confirm("Limpar todas as respostas?")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setShowNegative({});
      setShowPronounVariation({});
      localStorage.removeItem("lesson30Answers");
      alert("Respostas limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================
  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubs1OptionClick = (key: string, index: number) => {
    setSubs1Exercises((prev) =>
      prev.map((ex) => (ex.key === key ? { ...ex, currentIndex: index } : ex))
    );
  };

  const handleSubs2OptionClick = (key: string, index: number) => {
    setSubs2Exercises((prev) =>
      prev.map((ex) => (ex.key === key ? { ...ex, currentIndex: index } : ex))
    );
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (key: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults((prev) => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults((prev) => ({ ...prev, [key]: true }));
  };

  const toggleNegative = (cardId: string) => {
    setShowNegative((prev) => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  const setPronounVariation = (cardId: string, person: string) => {
    setShowPronounVariation((prev) => ({ ...prev, [cardId]: person }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed bg-gradient-to-br from-slate-50 to-blue-100">
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl backdrop-blur-sm">
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-4 flex items-center justify-center gap-3">
            <span className="text-6xl">🗺️</span> Lesson 30 – Fluency & Directions
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Master imperatives, negatives, pronouns, and transportation vocabulary.
            <br />
            <span className="font-semibold text-blue-600">Speak with confidence. Turn, take, go, drive, stay.</span>
          </p>
        </div>

        {/* ========== PÁGINA 1 - FLUENCY ========== */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-orange-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">🔥 FLUENCY PRACTICE</h2>
              <span className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold">PAGE 1</span>
              <button
                onClick={() => toggleSection("fluency")}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              {/* Galeria de Cards de Fluência */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {fluencyCards.map((card) => (
                  <div
                    key={card.id}
                    className={`bg-white rounded-2xl border-4 overflow-hidden shadow-xl transition-all duration-300 cursor-pointer ${
                      activeFluencyCard === card.id
                        ? "border-orange-500 scale-[1.02] ring-4 ring-orange-200"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                    onClick={() => setActiveFluencyCard(card.id)}
                  >
                    <div className="relative h-44 w-full">
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
                          {card.alt}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleNegative(card.id);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                            showNegative[card.id]
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {showNegative[card.id] ? "Negative" : "Affirmative"}
                        </button>
                      </div>

                      <p className="text-lg font-semibold text-gray-800 mb-2">
                        {showNegative[card.id] ? card.negative : card.imperative}
                      </p>

                      {/* Variações de pronomes */}
                      <div className="mt-3 space-y-1">
                        <p className="text-xs text-gray-500 font-medium">Pronouns:</p>
                        <div className="flex flex-wrap gap-1">
                          {card.pronounVariations.map((p) => (
                            <button
                              key={p.person}
                              onClick={(e) => {
                                e.stopPropagation();
                                setPronounVariation(card.id, p.person);
                              }}
                              className={`text-xs px-2 py-1 rounded ${
                                showPronounVariation[card.id] === p.person
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-100 hover:bg-gray-200"
                              }`}
                            >
                              {p.person}
                            </button>
                          ))}
                        </div>
                        {showPronounVariation[card.id] && (
                          <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm text-blue-800 font-medium">
                              {
                                card.pronounVariations.find(
                                  (p) => p.person === showPronounVariation[card.id]
                                )?.sentence
                              }
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                              Negative:{" "}
                              {
                                card.pronounVariations.find(
                                  (p) => p.person === showPronounVariation[card.id]
                                )?.negative
                              }
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Combinações sugeridas */}
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Try this:</p>
                        <div className="space-y-1">
                          {card.combinationSuggestions.slice(0, 2).map((sugg, idx) => (
                            <p key={idx} className="text-sm text-gray-700 bg-gray-50 p-2 rounded-md">
                              💡 {sugg}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dica de Fluência */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <span className="text-2xl">⚡</span> FLUENCY STRATEGY
                </h3>
                <p className="text-lg font-medium">
                  Combine 2 commands | Change to negative | Change to 3rd person | Add transportation | Add frequency
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    ✨ Don’t drive to work. Take the bus.
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    ✨ She doesn’t take the subway. She drives to work.
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    ✨ Go to the museum and speak with your teachers.
                  </div>
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    ✨ Don’t stay home. Go downtown.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== PÁGINA 2 - DRILLING PRACTICE I ========== */}
        <div className="bg-green-50 border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">🔁 DRILLING PRACTICE I</h2>
              <span className="bg-white text-green-700 px-3 py-1 rounded-full text-sm font-bold">PAGE 2</span>
              <button
                onClick={() => toggleSection("substitution1")}
                className="ml-4 p-2 rounded-full hover:bg-green-700 transition"
              >
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-green-800 mb-6">
                🧩 Substitution Practice I – Click to change the sentence
              </h3>
              <div className="space-y-6">
                {subs1Exercises.map((ex) => {
                  const currentSentence = ex.base.replace("{0}", ex.options[ex.currentIndex]);
                  return (
                    <div key={ex.key} className="bg-white p-5 rounded-xl border-2 border-green-200 shadow-md">
                      <p className="text-sm text-green-600 mb-2">{ex.original}</p>
                      <div className="mb-3 p-3 bg-green-100 rounded-lg">
                        <p className="text-green-800 font-semibold text-lg">{currentSentence}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ex.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSubs1OptionClick(ex.key, idx)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                              ex.currentIndex === idx
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Change into Negative */}
              <div className="mt-10 bg-red-50 p-6 rounded-xl border-2 border-red-300">
                <h3 className="text-xl font-bold text-red-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">⛔</span> Change into Negative
                </h3>
                <div className="space-y-4">
                  {negativeExercises.map((ex) => (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <p className="font-medium text-gray-700 mb-2">{ex.sentence}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write negative form..."
                          value={writtenAnswers[ex.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500"
                        />
                        <button
                          onClick={() =>
                            handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)
                          }
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                          Check
                        </button>
                      </div>
                      {showAnswerResults[ex.key] && (
                        <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== PÁGINA 3 - DRILLING PRACTICE II ========== */}
        <div className="bg-purple-50 border-2 border-purple-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">🔁 DRILLING PRACTICE II</h2>
              <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm font-bold">PAGE 3</span>
              <button
                onClick={() => toggleSection("substitution2")}
                className="ml-4 p-2 rounded-full hover:bg-purple-700 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-purple-800 mb-6">
                🧩 Substitution Practice II
              </h3>
              <div className="space-y-6">
                {subs2Exercises.map((ex) => {
                  const baseParts = ex.correctAnswer.split(" ");
                  const targetWord = ex.options[ex.currentIndex];
                  const sentence = ex.correctAnswer.replace(
                    ex.options[0],
                    targetWord
                  );
                  return (
                    <div key={ex.key} className="bg-white p-5 rounded-xl border-2 border-purple-200 shadow-md">
                      <p className="text-sm text-purple-600 mb-2">{ex.original}</p>
                      <div className="mb-3 p-3 bg-purple-100 rounded-lg">
                        <p className="text-purple-800 font-semibold text-lg">{sentence}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {ex.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSubs2OptionClick(ex.key, idx)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                              ex.currentIndex === idx
                                ? "bg-purple-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Change into Affirmative */}
              <div className="mt-10 bg-teal-50 p-6 rounded-xl border-2 border-teal-300">
                <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">✅</span> Change into Affirmative
                </h3>
                <div className="space-y-4">
                  {affirmativeExercises.map((ex) => (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <p className="font-medium text-gray-700 mb-2">{ex.sentence}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write affirmative form..."
                          value={writtenAnswers[ex.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          onClick={() =>
                            handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)
                          }
                          className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600"
                        >
                          Check
                        </button>
                      </div>
                      {showAnswerResults[ex.key] && (
                        <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========== PÁGINA 4 - QUESTIONS ========== */}
        <div className="bg-indigo-50 border-2 border-indigo-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">💬 QUESTIONS & SPEAKING</h2>
              <span className="bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">PAGE 4</span>
              <button
                onClick={() => toggleSection("questions")}
                className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition"
              >
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <h3 className="text-xl font-bold text-indigo-800 mb-6">
                Answer the questions about your routine and city
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {personalQuestions.map((q) => (
                  <div key={q.id} className="bg-white p-5 rounded-xl border-2 border-indigo-200 shadow-md">
                    <h4 className="text-lg font-semibold text-indigo-700 mb-3">{q.question}</h4>
                    <textarea
                      value={writtenAnswers[`q30-${q.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`q30-${q.id}`, e.target.value)}
                      placeholder={q.placeholder}
                      className="w-full h-24 p-3 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-8 bg-indigo-100 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-indigo-800">💡 Speaking Tip</h3>
                <p className="text-indigo-700">
                  Answer out loud! Record yourself and practice the imperatives and negatives.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* BOTÕES DE SALVAR E NAVEGAÇÃO */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-full text-lg transition shadow-lg flex items-center gap-2"
            >
              <span>💾</span> Save My Progress
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full text-sm transition"
            >
              Clear All
            </button>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson29")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition"
            >
              ← Lesson 29
            </button>
            <button
              onClick={() => router.push("/cursos/lesson31")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-full transition shadow-lg"
            >
              Lesson 31 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}