"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ArrowLeft, ArrowRight } from "lucide-react";

// ============================================
// LESSON 54 - GOING SHOPPING
// Theme: Present Continuous for actions happening now
// ============================================

// ============================================
// GRAMMAR EXPLANATION - Present Continuous
// ============================================
const grammarExplanation = {
  title: "Present Continuous - Ações acontecendo agora",
  explanation: "Usamos o Present Continuous para falar sobre ações que estão acontecendo no momento da fala.",
  structure: {
    affirmative: "Sujeito + am/is/are + verbo-ing",
    negative: "Sujeito + am/is/are + not + verbo-ing",
    interrogative: "Am/Is/Are + sujeito + verbo-ing?"
  },
  examples: [
    "She is eating a sandwich.",
    "They are looking for new shoes.",
    "He is writing an email.",
    "We are watching TV."
  ],
  timeExpressions: ["now", "right now", "at the moment", "today", "this week"]
};

// ============================================
// PART 1 – FLUENCY (IMPORTANT!)
// Images for What's + verb structure
// ============================================
const fluencyExercises = [
  {
    id: "fluency-a",
    prompt: "what - to write",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1973&auto=format&fit=crop",
    alt: "Person writing on paper",
    suggestedQuestion: "What is she writing?",
    suggestedAnswer: "She's writing a letter."
  },
  {
    id: "fluency-b",
    prompt: "what - to make",
    image: "https://images.unsplash.com/photo-1569058242567-a8a6525d4f07?q=80&w=2070&auto=format&fit=crop",
    alt: "Person making food in kitchen",
    suggestedQuestion: "What is he making?",
    suggestedAnswer: "He's making a salad."
  },
  {
    id: "fluency-c",
    prompt: "what - to look for",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
    alt: "Person shopping for clothes",
    suggestedQuestion: "What is she looking for?",
    suggestedAnswer: "She's looking for a new dress."
  },
  {
    id: "fluency-d",
    prompt: "what - to do",
    image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2060&auto=format&fit=crop",
    alt: "Person sleeping on sofa",
    suggestedQuestion: "What is he doing?",
    suggestedAnswer: "He's sleeping on the sofa."
  },
  {
    id: "fluency-e",
    prompt: "what - to watch",
    image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=2069&auto=format&fit=crop",
    alt: "Family watching TV together",
    suggestedQuestion: "What are they watching?",
    suggestedAnswer: "They're watching a movie."
  },
  {
    id: "fluency-f",
    prompt: "what - to buy",
    image: "https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=2070&auto=format&fit=crop",
    alt: "Person buying a car at dealership",
    suggestedQuestion: "What is he buying?",
    suggestedAnswer: "He's buying a new car."
  }
];

// ============================================
// PART 2 – DRILLING PRACTICE (Substitution)
// ============================================
const substitutionPractice = [
  {
    key: "subs-1",
    original: "Ele usa roupas formais para o trabalho.",
    base: "He wears {0} to work.",
    options: ["formal clothes", "casual clothes", "a suit"],
    currentIndex: 0
  },
  {
    key: "subs-2",
    original: "Seus sapatos estão debaixo da cama.",
    base: "His shoes are under the {0}.",
    options: ["bed", "desk", "coffee table"],
    currentIndex: 0
  },
  {
    key: "subs-3",
    original: "Faça um favor, chame o vendedor.",
    base: "Do me a favor, call the {0}.",
    options: ["salesperson", "attendant", "manager"],
    currentIndex: 0
  },
  {
    key: "subs-4",
    original: "Eu coloco minhas roupas no armário.",
    base: "I put my {0} in the closet.",
    options: ["clothes", "bags", "shoes"],
    currentIndex: 0
  },
  {
    key: "subs-5",
    original: "Ela tem dez minutos para se arrumar.",
    base: "She has {0} minutes to get dressed.",
    options: ["ten", "fifteen", "five"],
    currentIndex: 0
  }
];

// ============================================
// PART 3 – CHANGE INTO NEGATIVE
// ============================================
const negativeExercises = [
  { key: "neg-1", sentence: "He's making a cheese and ham sandwich.", answer: "He isn't making a cheese and ham sandwich." },
  { key: "neg-2", sentence: "You're doing a lot of things this week.", answer: "You aren't doing a lot of things this week." },
  { key: "neg-3", sentence: "He's calling the doctor.", answer: "He isn't calling the doctor." },
  { key: "neg-4", sentence: "We're talking about fashion.", answer: "We aren't talking about fashion." },
  { key: "neg-5", sentence: "She's taking the subway to work.", answer: "She isn't taking the subway to work." },
  { key: "neg-6", sentence: "They're writing a new report.", answer: "They aren't writing a new report." }
];

// ============================================
// PART 4 – CHANGE INTO AFFIRMATIVE
// ============================================
const affirmativeExercises = [
  { key: "aff-1", sentence: "She isn't finishing her homework.", answer: "She is finishing her homework." },
  { key: "aff-2", sentence: "They aren't talking to the dentist.", answer: "They are talking to the dentist." },
  { key: "aff-3", sentence: "Her mother isn't waiting for you.", answer: "Her mother is waiting for you." },
  { key: "aff-4", sentence: "They aren't giving me any money.", answer: "They are giving me some money." },
  { key: "aff-5", sentence: "My boss isn't looking for the attendant.", answer: "My boss is looking for the attendant." },
  { key: "aff-6", sentence: "They aren't working at the office now.", answer: "They are working at the office now." }
];

// ============================================
// PART 5 – CHANGE INTO INTERROGATIVE
// ============================================
const interrogativeExercises = [
  { key: "int-1", sentence: "You are calling your friends.", answer: "Are you calling your friends?" },
  { key: "int-2", sentence: "He is paying by credit card.", answer: "Is he paying by credit card?" },
  { key: "int-3", sentence: "She is taking the children to school.", answer: "Is she taking the children to school?" },
  { key: "int-4", sentence: "They are watching TV series.", answer: "Are they watching TV series?" },
  { key: "int-5", sentence: "They are visiting their grandparents.", answer: "Are they visiting their grandparents?" },
  { key: "int-6", sentence: "He is putting on his favorite shoes.", answer: "Is he putting on his favorite shoes?" }
];

// ============================================
// PART 6 – QUESTIONS (SPEAKING)
// ============================================
const speakingQuestions = [
  { id: 1, question: "What are you wearing today?" },
  { id: 2, question: "What is your teacher wearing today?" },
  { id: 3, question: "Do you wear casual or formal clothes to work?" },
  { id: 4, question: "What do you wear to go out with friends?" },
  { id: 5, question: "Do you prefer tight or loose clothes?" },
  { id: 6, question: "What do you have to do after class?" },
  { id: 7, question: "How much time do you usually need to get dressed?" },
  { id: 8, question: "Where do you usually put your clothes?" },
  { id: 9, question: "Where is your English book now?" },
  { id: 10, question: "What are your classmates doing now?" }
];

// ============================================
// LISTEN AND PRACTICE PHRASES
// ============================================
const listenItems = [
  {
    key: "listen-1",
    phrase: "She is buying a new dress for the party.",
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=2070&auto=format&fit=crop",
    alt: "Woman buying dress",
    correctAnswer: "She is buying a new dress for the party."
  },
  {
    key: "listen-2",
    phrase: "They are looking for a parking spot.",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=2068&auto=format&fit=crop",
    alt: "Car looking for parking",
    correctAnswer: "They are looking for a parking spot."
  },
  {
    key: "listen-3",
    phrase: "He is trying on a pair of jeans.",
    image: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2080&auto=format&fit=crop",
    alt: "Man trying on jeans",
    correctAnswer: "He is trying on a pair of jeans."
  },
  {
    key: "listen-4",
    phrase: "We are waiting for the store to open.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    alt: "People waiting outside store",
    correctAnswer: "We are waiting for the store to open."
  },
  {
    key: "listen-5",
    phrase: "I am paying with my credit card.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop",
    alt: "Person paying with credit card",
    correctAnswer: "I am paying with my credit card."
  },
  {
    key: "listen-6",
    phrase: "They are returning a defective product.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2070&auto=format&fit=crop",
    alt: "Customer service return",
    correctAnswer: "They are returning a defective product."
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

// ============================================
// FLUENCY CARD COMPONENT (Part 1)
// ============================================
const FluencyCard = ({ 
  exercise, 
  onNext, 
  onPrev, 
  currentIndex, 
  totalCards,
  userQuestion,
  userAnswer,
  onQuestionChange,
  onAnswerChange,
  onCheck
}: { 
  exercise: typeof fluencyExercises[0];
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalCards: number;
  userQuestion: string;
  userAnswer: string;
  onQuestionChange: (value: string) => void;
  onAnswerChange: (value: string) => void;
  onCheck: () => void;
}) => {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-pink-300">
        {/* Card Image */}
        <div className="relative h-64 w-full">
          <Image
            src={exercise.image}
            alt={exercise.alt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex justify-between items-center">
              <p className="text-white text-sm font-medium bg-pink-500 inline-block px-3 py-1 rounded-full">
                Card {currentIndex + 1} of {totalCards}
              </p>
              <p className="text-white text-sm font-mono bg-black/50 px-3 py-1 rounded-full">
                {exercise.prompt}
              </p>
            </div>
          </div>
        </div>

        {/* Card Content - Question & Answer Inputs */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-pink-500 mb-1">📝 YOUR QUESTION (Interrogative):</h3>
            <input
              type="text"
              value={userQuestion}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="Example: What is she eating?"
              className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-green-600 mb-1">💬 YOUR ANSWER:</h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Example: She's eating a sandwich."
              className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Hint Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              {showHint ? "Hide hint" : "💡 Show hint"}
            </button>
            {showHint && (
              <div className="mt-2 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
                <p><strong>Suggested Question:</strong> {exercise.suggestedQuestion}</p>
                <p><strong>Suggested Answer:</strong> {exercise.suggestedAnswer}</p>
                <p className="text-xs text-gray-400 mt-1">*These are just suggestions. Your answer can be different!</p>
              </div>
            )}
          </div>

          {/* Check Button */}
          <button
            onClick={onCheck}
            className="w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition font-medium"
          >
            Check My Answers
          </button>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`p-3 rounded-full transition ${
                currentIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
              }`}
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalCards }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? 'bg-pink-500' : 'bg-gray-300'
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
                  : 'bg-pink-100 text-pink-600 hover:bg-pink-200'
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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8">
        <h2 className="text-2xl font-bold text-center">📚 Present Continuous - Gramática</h2>
      </div>
      <div className="p-8">
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
          <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
            <span className="bg-blue-100 p-2 rounded-full mr-2">⏳</span> 
            {grammarExplanation.title}
          </h3>
          <p className="text-gray-700 mb-4">{grammarExplanation.explanation}</p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="font-bold text-green-700">✅ Affirmative</p>
              <p className="text-sm text-gray-600">{grammarExplanation.structure.affirmative}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="font-bold text-red-700">❌ Negative</p>
              <p className="text-sm text-gray-600">{grammarExplanation.structure.negative}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-bold text-blue-700">❓ Interrogative</p>
              <p className="text-sm text-gray-600">{grammarExplanation.structure.interrogative}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">📝 Examples:</p>
            <div className="flex flex-wrap gap-2">
              {grammarExplanation.examples.map((ex, idx) => (
                <div key={idx} className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-700 border border-gray-200">
                  {ex}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-3">
              ⏰ Time expressions: {grammarExplanation.timeExpressions.join(", ")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson54GoingShopping() {
  const router = useRouter();
  
  // ----- SECTION VISIBILITY STATE -----
  const [sections, setSections] = useState({
    grammar: true,
    fluency: true,
    substitution: true,
    negative: true,
    affirmative: true,
    interrogative: true,
    speaking: true,
    listen: true
  });

  // ----- FLUENCY STATE (Part 1) -----
  const [fluencyIndex, setFluencyIndex] = useState(0);
  const [fluencyQuestions, setFluencyQuestions] = useState<Record<string, string>>({});
  const [fluencyAnswers, setFluencyAnswers] = useState<Record<string, string>>({});
  const [fluencyResults, setFluencyResults] = useState<Record<string, { questionOk: boolean; answerOk: boolean }>>({});

  // ----- EXERCISE STATES -----
  const [subsExercises, setSubsExercises] = useState(substitutionPractice);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [speakingAnswers, setSpeakingAnswers] = useState<Record<number, string>>({});

  // ============================================
  // PERSISTENCE - LOAD
  // ============================================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson54Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        setSubsExercises(data.subsExercises || substitutionPractice);
        setWrittenAnswers(data.writtenAnswers || {});
        setFluencyQuestions(data.fluencyQuestions || {});
        setFluencyAnswers(data.fluencyAnswers || {});
        setFluencyResults(data.fluencyResults || {});
        setSpeakingAnswers(data.speakingAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setFluencyIndex(data.fluencyIndex || 0);
        
        if (data.sections) setSections(data.sections);
        
        console.log("✅ Lesson 54 data loaded from localStorage");
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
      subsExercises,
      writtenAnswers,
      fluencyQuestions,
      fluencyAnswers,
      fluencyResults,
      speakingAnswers,
      answerResults,
      showAnswerResults,
      fluencyIndex,
      sections,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 54 - Going Shopping",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson54Answers", JSON.stringify(data));
      alert("✅ All your answers have been saved successfully!");
    } catch (error) {
      console.error("❌ Error saving answers:", error);
      alert("❌ Error saving answers. Please try again.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL your answers? This action cannot be undone.")) {
      setSubsExercises(substitutionPractice);
      setWrittenAnswers({});
      setFluencyQuestions({});
      setFluencyAnswers({});
      setFluencyResults({});
      setSpeakingAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setFluencyIndex(0);
      
      localStorage.removeItem("lesson54Answers");
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

  const handleSubsOptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubsExercises(prev =>
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

  const handleFluencyCheck = (id: string) => {
    const userQuestion = fluencyQuestions[id] || "";
    const userAnswer = fluencyAnswers[id] || "";
    const suggestedQuestion = fluencyExercises.find(ex => ex.id === id)?.suggestedQuestion || "";
    const suggestedAnswer = fluencyExercises.find(ex => ex.id === id)?.suggestedAnswer || "";
    
    // For fluency, we don't strictly check against suggested - just check if they wrote something
    const questionOk = userQuestion.trim().length > 0 && userQuestion.includes("?");
    const answerOk = userAnswer.trim().length > 0 && /(am|is|are|'m|'s|'re)\s+\w+ing/i.test(userAnswer);
    
    setFluencyResults(prev => ({
      ...prev,
      [id]: { questionOk, answerOk }
    }));
  };

  const handleSpeakingAnswerChange = (id: number, value: string) => {
    setSpeakingAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')` }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-pink-900 mb-4">📘 LESSON 54 – GOING SHOPPING</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Learn to ask and answer questions in the <span className="font-bold text-pink-600">Present Continuous</span>.
            Practice actions happening <span className="font-bold text-pink-600">right now</span> in shopping situations.
          </p>
        </div>

        {/* ======================================== */}
        {/* GRAMMAR EXPLANATION */}
        {/* ======================================== */}
        <GrammarExplanation />

        {/* ======================================== */}
        {/* PART 1 – FLUENCY (IMPORTANT!) */}
        {/* ======================================== */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟢 PART 1 – FLUENCY (IMPORTANT!)</h2>
              <button onClick={() => toggleSection('fluency')} className="ml-4 p-2 rounded-full hover:bg-pink-600 transition">
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="text-sm bg-white text-pink-600 px-3 py-1 rounded-full">
              What's + verb → Question + Answer
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-pink-700 font-medium">
                  🎯 Create a question (interrogative) and an answer using Present Continuous for each image.
                </p>
                <p className="text-gray-500 text-sm mt-1">💡 Use he/she/they/we - there's no wrong answer!</p>
              </div>
              
              <FluencyCard
                exercise={fluencyExercises[fluencyIndex]}
                currentIndex={fluencyIndex}
                totalCards={fluencyExercises.length}
                onNext={() => setFluencyIndex(prev => Math.min(prev + 1, fluencyExercises.length - 1))}
                onPrev={() => setFluencyIndex(prev => Math.max(prev - 1, 0))}
                userQuestion={fluencyQuestions[fluencyExercises[fluencyIndex].id] || ""}
                userAnswer={fluencyAnswers[fluencyExercises[fluencyIndex].id] || ""}
                onQuestionChange={(value) => setFluencyQuestions(prev => ({ ...prev, [fluencyExercises[fluencyIndex].id]: value }))}
                onAnswerChange={(value) => setFluencyAnswers(prev => ({ ...prev, [fluencyExercises[fluencyIndex].id]: value }))}
                onCheck={() => handleFluencyCheck(fluencyExercises[fluencyIndex].id)}
              />
              
              {fluencyResults[fluencyExercises[fluencyIndex].id] && (
                <div className="mt-4 p-4 rounded-lg bg-white border border-pink-200">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {fluencyResults[fluencyExercises[fluencyIndex].id].questionOk ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                      <span className={fluencyResults[fluencyExercises[fluencyIndex].id].questionOk ? "text-green-700" : "text-red-700"}>
                        Question: {fluencyResults[fluencyExercises[fluencyIndex].id].questionOk ? "Good! Your question is in interrogative form." : "Make sure your question starts with What/Who/Where and ends with a question mark (?)"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {fluencyResults[fluencyExercises[fluencyIndex].id].answerOk ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <XCircle size={18} className="text-red-600" />
                      )}
                      <span className={fluencyResults[fluencyExercises[fluencyIndex].id].answerOk ? "text-green-700" : "text-red-700"}>
                        Answer: {fluencyResults[fluencyExercises[fluencyIndex].id].answerOk ? "Great! Your answer uses Present Continuous (am/is/are + verb-ing)." : "Use am/is/are + verb-ing (ex: is eating, are looking, am writing)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 2 – DRILLING PRACTICE (Substitution) */}
        {/* ======================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟡 PART 2 – DRILLING PRACTICE</h2>
              <button onClick={() => toggleSection('substitution')} className="ml-4 p-2 rounded-full hover:bg-purple-700 transition">
                {sections.substitution ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 font-medium italic">Substitua as palavras mantendo a estrutura. Click on options to change the sentences:</p>
              <div className="space-y-6">
                {subsExercises.map((exercise) => {
                  const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                  return (
                    <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-purple-200">
                      <p className="text-gray-600 mb-2 text-sm">{exercise.original}</p>
                      <p className="text-purple-700 font-bold text-lg mb-3">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {exercise.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleSubsOptionClick(exercise.key, index)}
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
        {/* PART 3 – CHANGE INTO NEGATIVE */}
        {/* ======================================== */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔴 PART 3 – CHANGE INTO NEGATIVE</h2>
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
        {/* PART 4 – CHANGE INTO AFFIRMATIVE */}
        {/* ======================================== */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔵 PART 4 – CHANGE INTO AFFIRMATIVE</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-green-600 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="space-y-4">
                {affirmativeExercises.map((exercise) => (
                  <div key={exercise.key} className="bg-white p-5 rounded-lg border-2 border-green-200">
                    <p className="font-medium text-gray-800 mb-2">🔹 {exercise.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        placeholder="Write affirmative form..."
                        value={writtenAnswers[exercise.key] || ""}
                        onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-green-300 rounded-md text-sm focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition text-sm"
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
        {/* PART 5 – CHANGE INTO INTERROGATIVE */}
        {/* ======================================== */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟣 PART 5 – CHANGE INTO INTERROGATIVE</h2>
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
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition text-sm"
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
        {/* PART 6 – QUESTIONS (SPEAKING) */}
        {/* ======================================== */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🟠 PART 6 – QUESTIONS (SPEAKING)</h2>
              <button onClick={() => toggleSection('speaking')} className="ml-4 p-2 rounded-full hover:bg-orange-600 transition">
                {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speaking && (
            <div className="p-8">
              <p className="text-orange-700 mb-6 font-medium italic">Answer with complete sentences. Practice speaking out loud!</p>
              <div className="space-y-4">
                {speakingQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-5 rounded-lg border-2 border-orange-200">
                    <p className="font-bold text-orange-700 mb-2">❓ {question.question}</p>
                    <textarea
                      value={speakingAnswers[question.id] || ""}
                      onChange={(e) => handleSpeakingAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full p-3 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 resize-none h-20"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* LISTEN AND PRACTICE */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 LISTEN AND PRACTICE</h2>
              <button onClick={() => toggleSection('listen')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l54_listen.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {listenItems.map((item) => (
                <div key={item.key} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-teal-200">
                  <div className="w-full h-48 relative mb-4 rounded-lg overflow-hidden border-2 border-teal-300 shadow-md">
                    <Image 
                      src={item.image} 
                      alt={item.alt} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="w-full mb-3">
                    <textarea
                      placeholder="Write what you heard..."
                      value={writtenAnswers[item.key] || ""}
                      onChange={(e) => handleWrittenAnswerChange(item.key, e.target.value)}
                      className="w-full h-20 resize-none p-3 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => handleCheckAnswer(item.key, writtenAnswers[item.key] || "", item.correctAnswer)}
                      className="flex-1 bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition font-medium"
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
              onClick={() => router.push("/cursos/lesson53")}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson55")}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md"
            >
              Next Lesson →
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 54 – Going Shopping | Practice Present Continuous for actions happening now</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}