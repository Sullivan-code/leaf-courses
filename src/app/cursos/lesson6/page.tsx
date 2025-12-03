"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check } from "lucide-react";

const listenItems = [
  {
    key: "dish3",
    label: "Prato 3",
    image: "/images/fish-and-salad.png",
    audio: "/audios/dish3.mp3",
    description: "Fish and Salad",
    correctOrder: 3
  },
  {
    key: "dish2",
    label: "Prato 2",
    image: "/images/rice-and-beans-2.png",
    audio: "/audios/dish2.mp3",
    description: "Rice and Beans",
    correctOrder: 2
  },
  {
    key: "dish1",
    label: "Prato 1",
    image: "/images/chicken-sandwich.png",
    audio: "/audios/dish1.mp3",
    description: "Chicken Sandwich",
    correctOrder: 1
  }
];

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
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
        className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600`}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button
        onClick={resetAudio}
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600`}
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

interface PracticeItem {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  isNegative?: boolean;
  isInterrogative?: boolean;
  usesThirdPerson?: boolean;
}

interface NumberingAnswer {
  [key: string]: number | null;
}

interface VideoQuestion {
  id: number;
  question: string;
  userAnswer: string;
  vocabulary?: { english: string; portuguese: string }[];
  isPersonal?: boolean;
}

export default function Lesson6FoodDrink() {
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [dialogues, setDialogues] = useState([
    { speaker: "Customer", text: "", fixed: false },
    { speaker: "Waiter", text: "", fixed: false },
    { speaker: "Customer", text: "", fixed: false },
    { speaker: "Waiter", text: "", fixed: false }
  ]);
 
  const [numberingAnswers, setNumberingAnswers] = useState<NumberingAnswer>({
    dish1: null,
    dish2: null,
    dish3: null
  });
 
  const [isNumberingChecked, setIsNumberingChecked] = useState(false);
  const [isNumberingCorrect, setIsNumberingCorrect] = useState(false);
 
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([
    // Substitution Practice I
    { id: 1, sentence: "I prefer to eat cookies. And you?", options: ["crackers", "soda"], correctAnswer: "crackers", userAnswer: "" },
    { id: 2, sentence: "I like to eat toast with jam.", options: ["butter", "pancakes"], correctAnswer: "butter", userAnswer: "" },
    { id: 3, sentence: "I prefer to drink soda.", options: ["orange juice", "apple pie"], correctAnswer: "orange juice", userAnswer: "" },
    { id: 4, sentence: "I love to eat French fries for lunch.", options: ["yogurt", "vegetables"], correctAnswer: "vegetables", userAnswer: "" },
    { id: 5, sentence: "I want to drink a cup of tea.", options: ["coffee", "yogurt"], correctAnswer: "coffee", userAnswer: "" },
   
    // Change into Negative
    { id: 6, sentence: "I want to eat crackers and jam.", options: [], correctAnswer: "I don't want to eat crackers and jam.", userAnswer: "", isNegative: true },
    { id: 7, sentence: "I like to eat bacon.", options: [], correctAnswer: "I don't like to eat bacon.", userAnswer: "", isNegative: true },
    { id: 8, sentence: "I drink orange juice for breakfast.", options: [], correctAnswer: "I don't drink orange juice for breakfast.", userAnswer: "", isNegative: true },
    { id: 9, sentence: "I eat rice and beans for lunch.", options: [], correctAnswer: "I don't eat rice and beans for lunch.", userAnswer: "", isNegative: true },
    { id: 10, sentence: "I want to eat tomatoes.", options: [], correctAnswer: "I don't want to eat tomatoes.", userAnswer: "", isNegative: true },
    { id: 11, sentence: "I want to drink a glass of water.", options: [], correctAnswer: "I don't want to drink a glass of water.", userAnswer: "", isNegative: true },
   
    // Substitution Practice II - CORRIGIDAS
    { id: 12, sentence: "Do you drink coffee?", options: ["juice", "tea", "milk", "coke"], correctAnswer: "juice", userAnswer: "" },
    { id: 13, sentence: "Do you eat bread?", options: ["rice", "pasta", "pancakes"], correctAnswer: "rice", userAnswer: "" },
    { id: 14, sentence: "Do you like eggs?", options: ["yogurt", "soup", "salad"], correctAnswer: "yogurt", userAnswer: "" },
    { id: 15, sentence: "Do you prefer pizza?", options: ["spaghetti", "burger", "hotdog", "soup"], correctAnswer: "spaghetti", userAnswer: "" },
   
    // Substitution Practice III - Third Person (He/She)
    { id: 16, sentence: "She drinks coffee for breakfast.", options: ["tea", "milk", "juice"], correctAnswer: "tea", userAnswer: "", usesThirdPerson: true },
    { id: 17, sentence: "He eats bread with butter.", options: ["jam", "honey", "cheese"], correctAnswer: "jam", userAnswer: "", usesThirdPerson: true },
    { id: 18, sentence: "She likes to eat pizza.", options: ["pasta", "salad", "soup"], correctAnswer: "pasta", userAnswer: "", usesThirdPerson: true },
    { id: 19, sentence: "He wants to drink soda.", options: ["water", "juice", "coffee"], correctAnswer: "water", userAnswer: "", usesThirdPerson: true },
    { id: 20, sentence: "She prefers sweet cookies.", options: ["savory cookies", "cake", "pie"], correctAnswer: "savory cookies", userAnswer: "", usesThirdPerson: true },
   
    // Change into Affirmative
    { id: 21, sentence: "I don't like to eat rice.", options: [], correctAnswer: "I like to eat rice.", userAnswer: "" },
    { id: 22, sentence: "I don't like chocolate.", options: [], correctAnswer: "I like chocolate.", userAnswer: "" },
    { id: 23, sentence: "I don't like beans.", options: [], correctAnswer: "I like beans.", userAnswer: "" },
    { id: 24, sentence: "I don't want to eat fish for dinner.", options: [], correctAnswer: "I want to eat fish for dinner.", userAnswer: "" },
    { id: 25, sentence: "I don't want to eat sausages.", options: [], correctAnswer: "I want to eat sausages.", userAnswer: "" },
    { id: 26, sentence: "I don't want to eat an egg.", options: [], correctAnswer: "I want to eat an egg.", userAnswer: "" },
   
    // Change into Affirmative - Third Person
    { id: 27, sentence: "She doesn't like coffee.", options: [], correctAnswer: "She likes coffee.", userAnswer: "", usesThirdPerson: true },
    { id: 28, sentence: "He doesn't eat meat.", options: [], correctAnswer: "He eats meat.", userAnswer: "", usesThirdPerson: true },
    { id: 29, sentence: "She doesn't want pizza.", options: [], correctAnswer: "She wants pizza.", userAnswer: "", usesThirdPerson: true },
    { id: 30, sentence: "He doesn't drink soda.", options: [], correctAnswer: "He drinks soda.", userAnswer: "", usesThirdPerson: true },
   
    // Change into Interrogative
    { id: 31, sentence: "You eat rice.", options: [], correctAnswer: "Do you eat rice?", userAnswer: "", isInterrogative: true },
    { id: 32, sentence: "You drink tea for lunch.", options: [], correctAnswer: "Do you drink tea for lunch?", userAnswer: "", isInterrogative: true },
    { id: 33, sentence: "You like to eat eggs for lunch.", options: [], correctAnswer: "Do you like to eat eggs for lunch?", userAnswer: "", isInterrogative: true },
    { id: 34, sentence: "You eat beans for dinner.", options: [], correctAnswer: "Do you eat beans for dinner?", userAnswer: "", isInterrogative: true },
    { id: 35, sentence: "You drink orange juice for breakfast.", options: [], correctAnswer: "Do you drink orange juice for breakfast?", userAnswer: "", isInterrogative: true },
    { id: 36, sentence: "You drink a slice of chocolate pie.", options: [], correctAnswer: "Do you drink a slice of chocolate pie?", userAnswer: "", isInterrogative: true },
   
    // Change into Interrogative - Third Person
    { id: 37, sentence: "She drinks coffee.", options: [], correctAnswer: "Does she drink coffee?", userAnswer: "", isInterrogative: true, usesThirdPerson: true },
    { id: 38, sentence: "He eats bread.", options: [], correctAnswer: "Does he eat bread?", userAnswer: "", isInterrogative: true, usesThirdPerson: true },
    { id: 39, sentence: "She likes pizza.", options: [], correctAnswer: "Does she like pizza?", userAnswer: "", isInterrogative: true, usesThirdPerson: true },
    { id: 40, sentence: "He wants water.", options: [], correctAnswer: "Does he want water?", userAnswer: "", isInterrogative: true, usesThirdPerson: true },
   
    // Change into Negative - Third Person
    { id: 41, sentence: "She likes coffee.", options: [], correctAnswer: "She doesn't like coffee.", userAnswer: "", isNegative: true, usesThirdPerson: true },
    { id: 42, sentence: "He eats meat.", options: [], correctAnswer: "He doesn't eat meat.", userAnswer: "", isNegative: true, usesThirdPerson: true },
    { id: 43, sentence: "She wants pizza.", options: [], correctAnswer: "She doesn't want pizza.", userAnswer: "", isNegative: true, usesThirdPerson: true },
    { id: 44, sentence: "He drinks soda.", options: [], correctAnswer: "He doesn't drink soda.", userAnswer: "", isNegative: true, usesThirdPerson: true }
  ]);

  const [questions, setQuestions] = useState([
    { id: 1, question: "Do you drink coffee?", userAnswer: "" },
    { id: 2, question: "Do you eat beef?", userAnswer: "" },
    { id: 3, question: "Do you love chocolate?", userAnswer: "" },
    { id: 4, question: "Do you want a glass of water?", userAnswer: "" },
    { id: 5, question: "Do you want a slice of apple pie?", userAnswer: "" },
    { id: 6, question: "What do you love to eat?", userAnswer: "" },
    { id: 7, question: "What do you eat and drink for breakfast?", userAnswer: "" },
    { id: 8, question: "What do you prefer to eat for lunch?", userAnswer: "" },
    { id: 9, question: "What do you want to eat for dinner?", userAnswer: "" },
    { id: 10, question: "What do you prefer: French fries or vegetables?", userAnswer: "" },
    // Third Person Questions
    { id: 11, question: "Does she drink coffee?", userAnswer: "" },
    { id: 12, question: "Does he eat beef?", userAnswer: "" },
    { id: 13, question: "Does she love chocolate?", userAnswer: "" },
    { id: 14, question: "Does he want a glass of water?", userAnswer: "" },
    { id: 15, question: "What does she like to eat?", userAnswer: "" },
    { id: 16, question: "What does he eat for breakfast?", userAnswer: "" }
  ]);

  const [videoQuestions, setVideoQuestions] = useState<VideoQuestion[]>([
    {
      id: 1,
      question: "What do you do on the weekend?",
      userAnswer: "",
      isPersonal: true
    },
    {
      id: 2,
      question: "How long does the person in the video run for?",
      userAnswer: "",
      vocabulary: [
        { english: "To go running", portuguese: "Ir correr (exercício)" },
        { english: "About 40 minutes", portuguese: "Cerca de 40 minutos" }
      ]
    },
    {
      id: 3,
      question: "What is the place we can get our nails done?",
      userAnswer: "",
      vocabulary: [
        { english: "To get nails done", portuguese: "Fazer as unhas" },
        { english: "Salon", portuguese: "Salão de beleza" }
      ]
    },
    {
      id: 4,
      question: "What does the person in the video do when she doesn't have much time?",
      userAnswer: "",
      vocabulary: [
        { english: "When", portuguese: "Quando" },
        { english: "To go", portuguese: "Ir" },
        { english: "Supermarket", portuguese: "Supermercado" }
      ]
    },
    {
      id: 5,
      question: "How does the woman describe sushi in the video?",
      userAnswer: "",
      vocabulary: [
        { english: "Sushi", portuguese: "Sushi" },
        { english: "Japanese dish", portuguese: "Prato japonês" },
        { english: "Rice, fish, vegetables", portuguese: "Arroz, peixe, vegetais" },
        { english: "Wrapped in seaweed", portuguese: "Envolto em alga marinha" }
      ]
    },
    {
      id: 6,
      question: "What are frozen meals?",
      userAnswer: "",
      vocabulary: [
        { english: "Frozen meals", portuguese: "Refeições congeladas" },
        { english: "Pre-cooked dishes", portuguese: "Pratos pré-cozidos" },
        { english: "Freezer", portuguese: "Congelador" }
      ]
    },
    {
      id: 7,
      question: "Do you like buying dinner at the supermarket, or do you prefer to cook at home?",
      userAnswer: "",
      isPersonal: true
    },
    {
      id: 8,
      question: "Do you like indoor pets, like birds or fish?",
      userAnswer: "",
      vocabulary: [
        { english: "Indoor pets", portuguese: "Animais de dentro de casa" },
        { english: "Birds or fish", portuguese: "Pássaros ou peixes" },
        { english: "Cockatiel", portuguese: "Calopsita" },
        { english: "Parrot", portuguese: "Papagaio" },
        { english: "Parakeet", portuguese: "Periquito" },
        { english: "Goldfish", portuguese: "Peixe-dourado" },
        { english: "Betta fish", portuguese: "Peixe Betta" },
        { english: "Guppy", portuguese: "Lebiste / Guppy" }
      ],
      isPersonal: true
    }
  ]);

  const [sections, setSections] = useState({
    listen: true,
    drilling: true,
    questions: true,
    tuneIn: true
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNoteChange = (key: string, value: string) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  const saveNotes = async () => {
    alert("Notas salvas localmente!");
    // Função para salvar localmente pode ser implementada posteriormente
  };

  const saveVideoAnswers = async () => {
    alert("Respostas do vídeo salvas localmente!");
    // Função para salvar localmente pode ser implementada posteriormente
  };

  const handleDialogueChange = (index: number, value: string) => {
    const newDialogues = [...dialogues];
    newDialogues[index] = { ...newDialogues[index], text: value };
    setDialogues(newDialogues);
  };

  const handlePracticeAnswer = (id: number, answer: string) => {
    setPracticeItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, userAnswer: answer } : item
      )
    );
  };

  const handleQuestionAnswer = (id: number, answer: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, userAnswer: answer } : q
      )
    );
  };

  const handleNumberingChange = (dishKey: string, order: number) => {
    setNumberingAnswers(prev => ({
      ...prev,
      [dishKey]: order
    }));
    setIsNumberingChecked(false);
  };

  const handleVideoAnswerChange = (id: number, answer: string) => {
    setVideoQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, userAnswer: answer } : q
      )
    );
  };

  const checkNumbering = () => {
    const isCorrect = listenItems.every(item =>
      numberingAnswers[item.key] === item.correctOrder
    );
   
    setIsNumberingChecked(true);
    setIsNumberingCorrect(isCorrect);
   
    if (isCorrect) {
      alert("✅ Parabéns! Você acertou a ordem correta: 3, 2, 1");
    } else {
      alert("❌ A ordem ainda não está correta. Tente novamente!");
    }
  };

  const checkVideoAnswer = (id: number) => {
    const question = videoQuestions.find(q => q.id === id);
    if (!question) return;

    // For personal questions, just acknowledge
    if (question.isPersonal) {
      alert("Ótima resposta pessoal! Continue praticando.");
      return;
    }

    // For factual questions, provide guidance
    const correctAnswers: Record<number, string> = {
      2: "She likes to run about 40 minutes.",
      3: "At the salon.",
      4: "She goes to the supermarket when she doesn't have much time.",
      5: "A Japanese dish made with rice, fish, and sometimes vegetables, wrapped in seaweed.",
      6: "Frozen meals are pre-cooked dishes that are kept in the freezer."
    };

    if (correctAnswers[id]) {
      alert(`Compare sua resposta com esta referência:\n\n"${correctAnswers[id]}"`);
    } else {
      alert("Resposta verificada! Continue praticando.");
    }
  };

  const resetNumbering = () => {
    setNumberingAnswers({
      dish1: null,
      dish2: null,
      dish3: null
    });
    setIsNumberingChecked(false);
    setIsNumberingCorrect(false);
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/l5-orange-juice.jpg')` }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">Lesson 6 – Food & Drink</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 Pratique conversas sobre comida e bebida com exercícios de escuta, substituição e transformação de frases.
          </p>
        </div>

        {/* 1. LISTEN, NUMBER, AND ROLE-PLAY */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 1. Listen, Number, and Role-Play</h2>
              <button
                onClick={() => toggleSection('listen')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l6-listen-and-number-audio.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8">
              <div className="mb-8 bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">Instruções:</h3>
                <p className="text-blue-700 mb-4">
                  Observe as imagens de pratos e ouça o áudio. Numere de acordo com a ordem que ouvir. Depois, crie um diálogo simples sobre pedir/comentar comida usando as frases úteis.
                </p>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Useful Phrases:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-blue-700">
                      <li>I prefer... / I prefer to drink... / I prefer to...</li>
                      <li>I want to eat... / I don't like... / I love...</li>
                      <li>Do you prefer...? / What do you want...?</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Como fazer:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-blue-700">
                      <li>Ouça o áudio completo</li>
                      <li>Numere as imagens na ordem correta</li>
                      <li>Verifique se acertou a sequência</li>
                      <li>Crie um diálogo usando as frases úteis</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Numbering Exercise */}
              <div className="mb-8 flex justify-center">
                <div className="max-w-4xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-700">Numere as imagens na ordem correta:</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={checkNumbering}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Verificar Ordem
                      </button>
                      <button
                        onClick={resetNumbering}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        Reiniciar
                      </button>
                    </div>
                  </div>
                 
                  {isNumberingChecked && (
                    <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
                      isNumberingCorrect ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
                    }`}>
                      {isNumberingCorrect ? (
                        <>✅ Parabéns! Ordem correta: 3, 2, 1</>
                      ) : (
                        <>❌ A ordem ainda não está correta. Tente novamente!</>
                      )}
                    </div>
                  )}
                 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {listenItems.map((item) => (
                      <div
                        key={item.key}
                        className={`bg-white p-4 rounded-lg border-2 transition-all ${
                          isNumberingChecked
                            ? (numberingAnswers[item.key] === item.correctOrder
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50')
                            : 'border-blue-300'
                        }`}
                      >
                        <div className="text-center font-bold text-blue-600 mb-3 text-lg">
                          {numberingAnswers[item.key] ? `Nº ${numberingAnswers[item.key]}` : "Escolha o número"}
                        </div>
                        <div className="w-full h-40 relative mb-3">
                          <Image
                            src={item.image}
                            alt={item.label}
                            fill
                            className="rounded-md object-cover"
                          />
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium mb-3">
                          {item.description}
                        </p>
                       
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3].map((number) => (
                            <button
                              key={number}
                              onClick={() => handleNumberingChange(item.key, number)}
                              className={`w-10 h-10 rounded-full font-bold transition-all ${
                                numberingAnswers[item.key] === number
                                  ? 'bg-blue-500 text-white scale-110'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                        </div>
                       
                        {isNumberingChecked && (
                          <div className="mt-2 text-center text-xs">
                            {numberingAnswers[item.key] === item.correctOrder ? (
                              <span className="text-green-600">✅ Correto: {item.correctOrder}</span>
                            ) : (
                              <span className="text-red-600">❌ Correto seria: {item.correctOrder}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                 
                  <div className="mt-4 text-center text-sm text-blue-600">
                    <p><strong>💡 Sintam-se a vontade para ouvir o audio novamente antes de marcar a resposta correta.</strong></p>
                  </div>
                </div>
              </div>

              {/* Role-Play Dialogue */}
              <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">Crie seu diálogo:</h3>
                <div className="space-y-4 mb-4">
                  {dialogues.map((dialogue, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <input
                        type="text"
                        value={dialogue.speaker}
                        onChange={(e) => {
                          const newDialogues = [...dialogues];
                          newDialogues[index].speaker = e.target.value;
                          setDialogues(newDialogues);
                        }}
                        placeholder="Nome do personagem..."
                        className="w-32 p-2 border border-blue-300 rounded-md bg-blue-50"
                      />
                      <textarea
                        value={dialogue.text}
                        onChange={(e) => handleDialogueChange(index, e.target.value)}
                        placeholder={`O que ${dialogue.speaker} diz...`}
                        className="flex-1 p-3 border border-blue-300 rounded-md resize-none h-20"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveNotes}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Salvar Diálogo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. DRILLING PRACTICE */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 2. Drilling Practice</h2>
              <button
                onClick={() => toggleSection('drilling')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.drilling ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling && (
            <div className="p-8">
              {/* Substitution Practice I */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Substitution Practice I</h3>
                <p className="text-green-600 mb-4 italic">Repita trocando a última palavra pela opção correta.</p>
                <div className="space-y-4">
                  {practiceItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePracticeAnswer(item.id, option)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              item.userAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {item.userAnswer && (
                        <div className={`text-sm ${
                          item.userAnswer === item.correctAnswer ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.userAnswer === item.correctAnswer ? '✅ Correto!' : '❌ Tente novamente'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Negative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Negative</h3>
                <p className="text-green-600 mb-4 italic">Transforme as frases em negativas.</p>
                <div className="space-y-4">
                  {practiceItems.slice(5, 11).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase negativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                      {item.userAnswer && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              const isCorrect = item.userAnswer.toLowerCase() === item.correctAnswer.toLowerCase();
                              alert(isCorrect ? '✅ Correto!' : `❌ Resposta correta: ${item.correctAnswer}`);
                            }}
                            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Verificar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitution Practice II - CORRIGIDAS */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Substitution Practice II</h3>
                <p className="text-green-600 mb-4 italic">Repita substituindo pelas palavras entre parênteses.</p>
                <div className="space-y-4">
                  {practiceItems.slice(11, 15).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePracticeAnswer(item.id, option)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              item.userAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitution Practice III - Third Person */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Substitution Practice III (He/She)</h3>
                <p className="text-green-600 mb-4 italic">Repita substituindo pelas palavras entre parênteses usando he/she.</p>
                <div className="space-y-4">
                  {practiceItems.slice(15, 20).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePracticeAnswer(item.id, option)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              item.userAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Affirmative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Affirmative</h3>
                <p className="text-green-600 mb-4 italic">Transforme em afirmativa.</p>
                <div className="space-y-4">
                  {practiceItems.slice(20, 26).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase afirmativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Affirmative - Third Person */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Affirmative (He/She)</h3>
                <p className="text-green-600 mb-4 italic">Transforme em afirmativa usando he/she.</p>
                <div className="space-y-4">
                  {practiceItems.slice(26, 30).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase afirmativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Interrogative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Interrogative</h3>
                <p className="text-green-600 mb-4 italic">Transforme em pergunta.</p>
                <div className="space-y-4">
                  {practiceItems.slice(30, 36).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a pergunta..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Interrogative - Third Person */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Interrogative (He/She)</h3>
                <p className="text-green-600 mb-4 italic">Transforme em pergunta usando he/she.</p>
                <div className="space-y-4">
                  {practiceItems.slice(36, 40).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a pergunta..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Negative - Third Person */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">👉 Change into Negative (He/She)</h3>
                <p className="text-green-600 mb-4 italic">Transforme em negativa usando he/she.</p>
                <div className="space-y-4">
                  {practiceItems.slice(40, 44).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase negativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. QUESTIONS */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ 3. Questions</h2>
              <button
                onClick={() => toggleSection('questions')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 italic">
                👉 Responda oralmente às perguntas abaixo, usando frases curtas e completas.
              </p>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q) => (
                  <div key={q.id} className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-700 mb-2">{q.question}</h4>
                    <textarea
                      value={q.userAnswer}
                      onChange={(e) => handleQuestionAnswer(q.id, e.target.value)}
                      placeholder="Sua resposta..."
                      className="w-full p-2 border border-purple-300 rounded-md resize-none h-16 text-sm"
                    />
                    <AudioPlayer src={`/audios/question${q.id}.mp3`} compact />
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-3">Dicas para suas respostas:</h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 text-sm">
                  <li>Use frases completas: "Yes, I do" ou "No, I don't"</li>
                  <li>Para terceira pessoa: "Yes, he/she does" ou "No, he/she doesn't"</li>
                  <li>Para perguntas com "What", dê respostas específicas</li>
                  <li>Pratique a pronúncia gravando suas respostas</li>
                  <li>Use o vocabulário aprendido na lição</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS - SEÇÃO COMPLETAMENTE ATUALIZADA */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-teal-700 mb-4">
                  Watch the video and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube ATUALIZADO */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/7mf45HGIMZ0"
                      title="English Listening Practice - Daily Routines"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: English Listening Practice - Daily Routines & Weekend Activities</p>
                </div>
              </div>

              {/* Vocabulary Help - ATUALIZADO */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">A little bit</span>
                      <span className="text-teal-600">Um pouquinho</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To go running</span>
                      <span className="text-teal-600">Ir correr (exercício)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Less</span>
                      <span className="text-teal-600">menos</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Meal</span>
                      <span className="text-teal-600">refeição</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Sauce</span>
                      <span className="text-teal-600">molho</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Toppings</span>
                      <span className="text-teal-600">cobertura</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Early</span>
                      <span className="text-teal-600">cedo</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To wake up</span>
                      <span className="text-teal-600">acordar cedo</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">By car</span>
                      <span className="text-teal-600">de carro</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Nephew</span>
                      <span className="text-teal-600">sobrinho</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Wedding</span>
                      <span className="text-teal-600">casamento</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Weekend</span>
                      <span className="text-teal-600">final de semana</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Chores</span>
                      <span className="text-teal-600">tarefas</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To sweep the floor</span>
                      <span className="text-teal-600">varrer o chão</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Eyelashes</span>
                      <span className="text-teal-600">cílios</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Thoughts</span>
                      <span className="text-teal-600">pensamentos</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Pre-made food</span>
                      <span className="text-teal-600">Comida pré-feita</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">To nap</span>
                      <span className="text-teal-600">tirar um cochilo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section - ATUALIZADA */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <h4 className="text-lg font-bold text-teal-700 mb-3">
                      {question.question}
                      {question.isPersonal && (
                        <span className="ml-2 text-sm font-normal text-teal-500">(Personal answer)</span>
                      )}
                    </h4>
                   
                    {question.vocabulary && (
                      <div className="mb-3 p-3 bg-teal-50 rounded-lg">
                        <p className="text-sm font-medium text-teal-600 mb-1">Vocabulary hints:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                      value={question.userAnswer}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-teal-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    />

                    <div className="flex gap-3 mt-3">
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
                  </div>
                ))}
              </div>

              {/* Learning Tips */}
              <div className="mt-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">💡 Tips for Better Listening:</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li><strong>Concentre-se no vocabulário do dia a dia:</strong> Preste atenção em palavras relacionadas a atividades, comida e planos de fim de semana.</li>
                  <li><strong>Ouça por expressões de tempo:</strong> Note palavras como "fim de semana", "40 minutos" ou "quando não tenho muito tempo".</li>
                  <li><strong>Identifique informações pessoais e factuais:</strong> Algumas perguntas pedem sua opinião, outras pedem informações do conteúdo do vídeo.</li>
                  <li><strong>Use as dicas de vocabulário:</strong> As palavras fornecidas vão te ajudar a entender os conceitos principais.</li>
                  <li><strong>Assista várias vezes, se necessário:</strong> Pause e volte o vídeo para captar todos os detalhes.</li>
                </ul>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={saveVideoAnswers}
                  className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
                >
                  Save My Answers
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson5")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={saveNotes}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Salvar Progresso
          </button>
          <button
            onClick={() => router.push("/cursos/review1")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  ); 
}