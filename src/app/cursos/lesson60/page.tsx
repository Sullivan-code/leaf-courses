"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { 
  Pause, Play, RotateCcw, Volume2, ChevronUp, ChevronDown, 
  Check, XCircle, Save, ArrowLeft, ArrowRight 
} from "lucide-react";

// ============================================
// LESSON 60 – EXPRESS YOURSELF
// Theme: Travel planning, destinations, and expressing preferences
// Level: A2-B1 - Intermediate
// ============================================

// ============================================
// DIALOGUE DATA
// ============================================
const dialogueData = {
  travelAgent: "Can I help you?",
  customer: "Yes, please. I want to travel on vacation, but I don't know where to go.",
  travelAgent2: "I see... And what do you like to do when you're on vacation?",
  customer2: "I like to go to the beach and I like to meet new people, too.",
  travelAgent3: "Great! I think I have some good options for you. Do you know anything about Malta?",
  customer3: "No, I don't.",
  travelAgent4: "It's a small country in Europe, and it's a great place to have fun. There are beautiful beaches in Malta, and there are a lot of things to do, too.",
  customer4: "Wow, I like that! Is it an expensive destination?",
  travelAgent5: "No, it's not. We can book a room for you in this beautiful hotel. There are two swimming pools, there is a big fitness center, and there is room service, too.",
  customer5: "But is Malta a safe place?",
  travelAgent6: "Yes, it is. There are many people to help you there, so you can travel alone.",
  customer6: "Do you have any more destinations?",
  travelAgent7: "Yes, I do! What about Rio de Janeiro?",
  customer7: "It's a good idea, too, and Rio is not very expensive.",
  travelAgent8: "And there are many places to visit in Rio.",
  customer8: "But I don't want to stay in a resort in Rio. Can I stay in a hostel?",
  travelAgent9: "Of course! There are many nice hostels in Rio. Guests usually prefer to stay in hostels there.",
  customer9: "OK! So, Rio de Janeiro: here I go. I want to buy a package to Rio.",
  travelAgent10: "Good for you!",
  customer10: "I need to learn some Portuguese now.",
  travelAgent11: "It's easy and Rio is a beautiful city."
};

// ============================================
// SUBSTITUTION PRACTICE I
// ============================================
const substitutionPractice1 = [
  { key: "sub1-1", original: "Ele quer fazer uma viagem com a esposa dele.", base: "He wants to take a trip with his {0}.", options: ["wife", "children", "family"], currentIndex: 0 },
  { key: "sub1-2", original: "Vocês não podem fazer o check in agora.", base: "You can't {0} now.", options: ["check in", "check out", "stay here"], currentIndex: 0 },
  { key: "sub1-3", original: "Qual é a nacionalidade dele? Ele é japonês.", base: "What is his nationality? He is {0}.", options: ["Japanese", "Canadian", "Mexican"], currentIndex: 0 },
  { key: "sub1-4", original: "Há muitos estrangeiros neste hotel.", base: "There are many foreigners in this {0}.", options: ["hotel", "hostel", "park"], currentIndex: 0 },
  { key: "sub1-5", original: "A que hora você tem que chegar ao aeroporto?", base: "What time do you have to get to the {0}?", options: ["airport", "office", "game"], currentIndex: 0 }
];

// ============================================
// CHANGE INTO NEGATIVE
// ============================================
const negativeExercises = [
  { key: "neg-1", sentence: "They come from Japan.", answer: "They don't come from Japan." },
  { key: "neg-2", sentence: "He can study in Argentina.", answer: "He can't study in Argentina." },
  { key: "neg-3", sentence: "She is worried about the hostel.", answer: "She isn't worried about the hostel." },
  { key: "neg-4", sentence: "The rooms are very clean.", answer: "The rooms aren't very clean." },
  { key: "neg-5", sentence: "He can give me a ride.", answer: "He can't give me a ride." },
  { key: "neg-6", sentence: "I think he's a foreigner.", answer: "I don't think he's a foreigner." }
];

// ============================================
// SUBSTITUTION PRACTICE II
// ============================================
const substitutionPractice2 = [
  { key: "sub2-1", original: "Tem um sofá novo na minha sala de estar.", base: "There is a new {0} in my living room.", options: ["sofa", "coffee table", "TV"], currentIndex: 0 },
  { key: "sub2-2", original: "Há um estacionamento em frente ao restaurante.", base: "There is a parking lot in front of the {0}.", options: ["restaurant", "bar", "snack bar"], currentIndex: 0 },
  { key: "sub2-3", original: "Tem internet sem fio grátis aqui.", base: "There is free {0} here.", options: ["Wi-Fi", "room service", "cable TV"], currentIndex: 0 },
  { key: "sub2-4", original: "Tem alguma coisa diferente no meu quarto.", base: "There is something {0} in my room.", options: ["different", "new", "special"], currentIndex: 0 },
  { key: "sub2-5", original: "Há um saguão grande lá.", base: "There is a large {0} there.", options: ["lobby", "swimming pool", "gym"], currentIndex: 0 }
];

// ============================================
// CHANGE INTO AFFIRMATIVE
// ============================================
const affirmativeExercises = [
  { key: "aff-1", sentence: "They can't check in in the morning.", answer: "They can check in in the morning." },
  { key: "aff-2", sentence: "We aren't booking a room now.", answer: "We are booking a room now." },
  { key: "aff-3", sentence: "He doesn't want to stay in a hostel.", answer: "He wants to stay in a hostel." },
  { key: "aff-4", sentence: "This hotel isn't very cozy.", answer: "This hotel is very cozy." },
  { key: "aff-5", sentence: "She can't take this suitcase on the plane.", answer: "She can take this suitcase on the plane." },
  { key: "aff-6", sentence: "We don't have a lot of luggage.", answer: "We have a lot of luggage." }
];

// ============================================
// CHANGE INTO INTERROGATIVE
// ============================================
const interrogativeExercises = [
  { key: "int-1", sentence: "You need a ride to the airport.", answer: "Do you need a ride to the airport?" },
  { key: "int-2", sentence: "They wear shorts to the beach.", answer: "Do they wear shorts to the beach?" },
  { key: "int-3", sentence: "She needs to call the travel agent.", answer: "Does she need to call the travel agent?" },
  { key: "int-4", sentence: "You have to change your passport.", answer: "Do you have to change your passport?" },
  { key: "int-5", sentence: "He arrives home at five o'clock.", answer: "Does he arrive home at five o'clock?" },
  { key: "int-6", sentence: "She needs to leave home early.", answer: "Does she need to leave home early?" }
];

// ============================================
// PHRASAL VERBS FOR TRAVEL
// ============================================
const phrasalVerbs = [
  { verb: "come up with", meaning: "to think of or create an idea/plan", example: "I need to come up with a better travel plan before booking." },
  { verb: "bring up", meaning: "to mention or introduce a topic", example: "The travel agent brought up an interesting destination in Europe." },
  { verb: "figure out", meaning: "to understand or solve something", example: "I'm trying to figure out which country is cheaper." },
  { verb: "keep on", meaning: "to continue doing something", example: "He kept on asking questions about the hotel." },
  { verb: "point out", meaning: "to draw attention to something", example: "She pointed out that the hostel is safer than the resort." },
  { verb: "turn out", meaning: "to result or end in a particular way", example: "The trip turned out to be an amazing experience." },
  { verb: "go over", meaning: "to review or check carefully", example: "Let's go over the travel details again before we confirm." },
  { verb: "look into", meaning: "to investigate or research", example: "I will look into the hotel reviews later." },
  { verb: "run into", meaning: "to meet unexpectedly", example: "I ran into a tourist from Brazil at the airport." },
  { verb: "catch up on", meaning: "to do something that should be done", example: "I need to catch up on my travel plans this week." }
];

// ============================================
// LISTENING DATA - 6 SITUATIONS
// ============================================
const listeningSituations = [
  { id: 1, description: "A person booking a hotel room with a swimming pool", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" },
  { id: 2, description: "Two friends planning a trip to the beach", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop" },
  { id: 3, description: "Someone asking about safety in a foreign country", image: "https://images.unsplash.com/photo-1531210483974-4c8e1f2b0d0f?q=80&w=2073&auto=format&fit=crop" },
  { id: 4, description: "A traveler checking into a hostel", image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?q=80&w=2069&auto=format&fit=crop" },
  { id: 5, description: "Someone buying a travel package", image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop" },
  { id: 6, description: "A person learning a new language for travel", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop" }
];

const listeningAudioUrl = "/audios/l60_listening.mp3";
const listeningTranscript = `Situation 1: "Hello, I'd like to book a room. Does your hotel have a swimming pool?" - "Yes, we have two outdoor pools and a fitness center."
Situation 2: "Let's plan our beach vacation. I love swimming in the ocean." - "Me too! And I want to meet new people there."
Situation 3: "Is it safe to travel alone to this country?" - "Yes, it's very safe. There are many tourists and police in the city center."
Situation 4: "I'd like to check in, please. I have a reservation at the hostel." - "Welcome! Here's your key. Breakfast is from 7 to 10 AM."
Situation 5: "I want to buy a package to Rio de Janeiro. Does it include flights and hotel?" - "Yes, everything is included. Great choice!"
Situation 6: "I need to learn some Portuguese before my trip to Brazil." - "That's a good idea. The locals will appreciate your effort!"`;

// ============================================
// DESTINATION IMAGES FOR SPEAKING PRACTICE
// ============================================
const destinations = [
  { name: "Malta", image: "https://images.unsplash.com/photo-1515239004005-7fa2e8c954b1?q=80&w=2074&auto=format&fit=crop", description: "Small country in Europe with beautiful beaches" },
  { name: "Rio de Janeiro", image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=2070&auto=format&fit=crop", description: "Brazilian city with mountains and beaches" },
  { name: "Bali", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2073&auto=format&fit=crop", description: "Indonesian island with temples and surf" },
  { name: "Barcelona", image: "https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=2070&auto=format&fit=crop", description: "Spanish city with amazing architecture" }
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
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const handleEnded = () => { setIsPlaying(false); setProgress(0); };
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
    isPlaying ? audio.pause() : audio.play().catch(err => console.error("Audio error:", err));
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; setIsPlaying(false); setProgress(0); }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button onClick={togglePlayPause} className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600 transition`}>
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button onClick={resetAudio} className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600 transition`}>
        <RotateCcw size={compact ? 12 : 16} />
      </button>
      {!compact && (
        <div ref={progressBarRef} className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden cursor-pointer" onClick={handleProgressClick}>
          <div className="h-full bg-blue-500 transition-all duration-200" style={{ width: `${progress}%` }} />
        </div>
      )}
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

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
      <span className="text-sm text-red-700"><span className="font-medium">Expected:</span> {correctAnswer}</span>
    </div>
  );
};

// Dialogue Component
const DialogueBox = () => {
  const [currentLine, setCurrentLine] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const lines = Object.entries(dialogueData);

  const nextLine = () => {
    if (currentLine < lines.length - 1) setCurrentLine(currentLine + 1);
  };

  const prevLine = () => {
    if (currentLine > 0) setCurrentLine(currentLine - 1);
  };

  if (showAll) {
    return (
      <div className="bg-white rounded-xl p-6 border-2 border-teal-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-teal-700 text-lg">💬 Complete Dialogue</h3>
          <button onClick={() => setShowAll(false)} className="text-sm bg-gray-200 px-3 py-1 rounded-full">Show Line by Line</button>
        </div>
        <div className="space-y-3">
          {lines.map(([speaker, text], idx) => (
            <div key={idx} className={`p-3 rounded-lg ${speaker.includes('travelAgent') ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-teal-50 border-l-4 border-teal-500'}`}>
              <span className="font-bold">{speaker.includes('travelAgent') ? '✈️ Travel Agent:' : '👤 Customer:'}</span>
              <span className="ml-2">{text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const [currentSpeaker, currentText] = lines[currentLine];
  const isAgent = currentSpeaker.includes('travelAgent');

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-teal-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-teal-700 text-lg">💬 Dialogue Practice</h3>
        <button onClick={() => setShowAll(true)} className="text-sm bg-gray-200 px-3 py-1 rounded-full">Show All</button>
      </div>
      <div className={`p-5 rounded-xl ${isAgent ? 'bg-blue-100 border-l-8 border-blue-500' : 'bg-teal-100 border-l-8 border-teal-500'}`}>
        <p className="font-bold text-lg mb-2">{isAgent ? '✈️ Travel Agent:' : '👤 Customer:'}</p>
        <p className="text-gray-800 text-lg">{currentText}</p>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={prevLine} disabled={currentLine === 0} className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-400 transition">← Previous</button>
        <span className="text-sm text-gray-500">{currentLine + 1} / {lines.length}</span>
        <button onClick={nextLine} disabled={currentLine === lines.length - 1} className="px-4 py-2 bg-teal-500 text-white rounded-lg disabled:opacity-50 hover:bg-teal-600 transition">Next →</button>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson60() {
  const router = useRouter();
  
  // Section visibility
  const [sections, setSections] = useState({
    dialogue: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    phrasalVerbs: true,
    listening: true,
    speaking: true
  });

  // Exercise states
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // Phrasal verbs practice states
  const [phrasalAnswers, setPhrasalAnswers] = useState<Record<number, string>>({});
  const [phrasalResults, setPhrasalResults] = useState<Record<number, boolean>>({});
  
  // Listening states
  const [listeningNumbers, setListeningNumbers] = useState<Record<number, number>>({});
  const [showTranscript, setShowTranscript] = useState(false);

  // Speaking practice states
  const [speakingAnswers, setSpeakingAnswers] = useState<Record<string, string>>({});

  // ============================================
  // PERSISTENCE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem("lesson60Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setPhrasalAnswers(data.phrasalAnswers || {});
        setPhrasalResults(data.phrasalResults || {});
        setListeningNumbers(data.listeningNumbers || {});
        setSpeakingAnswers(data.speakingAnswers || {});
        if (data.sections) setSections(data.sections);
        console.log("✅ Lesson 60 data loaded");
      } catch (error) { console.error("Error loading:", error); }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises, subs2Exercises, writtenAnswers, answerResults, showAnswerResults,
      phrasalAnswers, phrasalResults, listeningNumbers, speakingAnswers, sections,
      lastUpdated: new Date().toISOString(), 
      lessonName: "Lesson 60 - Express Yourself (Travel & Destinations)"
    };
    localStorage.setItem("lesson60Answers", JSON.stringify(data));
    alert("✅ All answers saved!");
  };

  const clearAllAnswers = () => {
    if (confirm("Clear ALL answers?")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setPhrasalAnswers({});
      setPhrasalResults({});
      setListeningNumbers({});
      setSpeakingAnswers({});
      localStorage.removeItem("lesson60Answers");
      alert("✅ All cleared.");
    }
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubsOptionClick = (key: string, optionIndex: number) => {
    setSubs1Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: optionIndex } : ex));
  };

  const handleSubs2OptionClick = (key: string, optionIndex: number) => {
    setSubs2Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: optionIndex } : ex));
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (key: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
  };

  const handlePhrasalAnswerChange = (id: number, value: string) => {
    setPhrasalAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handlePhrasalCheck = (id: number, userAnswer: string, expectedPhrase: string) => {
    const isCorrect = userAnswer.toLowerCase().includes(expectedPhrase.toLowerCase());
    setPhrasalResults(prev => ({ ...prev, [id]: isCorrect }));
  };

  const handleListeningNumber = (id: number, number: number) => {
    setListeningNumbers(prev => ({ ...prev, [id]: number }));
  };

  const handleSpeakingAnswer = (key: string, value: string) => {
    setSpeakingAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')` }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-teal-900 mb-4">🗣️ LESSON 60 – EXPRESS YOURSELF</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Learn to talk about <span className="font-bold text-teal-600">travel plans and destinations</span> using 
            <span className="font-bold text-blue-600"> practical vocabulary and expressions</span> for 
            <span className="font-bold text-green-600"> real-life conversations</span>.
          </p>
          <p className="text-md text-gray-500 mt-2">Level A2-B1 - Intermediate | Theme: Travel & Destinations</p>
        </div>

        {/* ======================================== */}
        {/* PART 1 – DIALOGUE */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 TRAVEL DIALOGUE</h2>
              <button onClick={() => toggleSection('dialogue')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.dialogue ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="text-sm bg-white text-teal-600 px-3 py-1 rounded-full">Practice the conversation</div>
          </div>
          {sections.dialogue && (
            <div className="p-8">
              <p className="text-teal-700 mb-6 italic text-center">🎧 Listen and practice this conversation between a travel agent and a customer:</p>
              <DialogueBox />
              
              {/* Comprehension Questions */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-teal-200">
                <p className="font-bold text-teal-700 mb-3">📝 Comprehension Questions (Answer out loud):</p>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="bg-teal-50 p-3 rounded">1. What does the customer like to do on vacation?</div>
                  <div className="bg-teal-50 p-3 rounded">2. Where is Malta and why is it a good destination?</div>
                  <div className="bg-teal-50 p-3 rounded">3. Is Malta expensive? What facilities does the hotel have?</div>
                  <div className="bg-teal-50 p-3 rounded">4. Why does the customer choose Rio de Janeiro?</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 2 – SUBSTITUTION PRACTICE I */}
        {/* ======================================== */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
            <button onClick={() => toggleSection('substitution1')} className="p-2 rounded-full hover:bg-blue-700">
              {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.substitution1 && (
            <div className="p-8">
              <p className="text-blue-700 mb-6 italic">Substitute the words to create new sentences:</p>
              <div className="space-y-5">
                {subs1Exercises.map((ex) => {
                  const currentSentence = ex.base.replace('{0}', ex.options[ex.currentIndex] as string);
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-blue-200">
                      <p className="text-gray-500 text-sm mb-1">🇧🇷 {ex.original}</p>
                      <p className="text-blue-700 font-bold text-lg mb-2">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {(ex.options as string[]).map((opt, idx) => (
                          <button key={idx} onClick={() => handleSubsOptionClick(ex.key, idx)} className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {opt}
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
            <h2 className="text-2xl font-bold">🚫 CHANGE INTO NEGATIVE</h2>
            <button onClick={() => toggleSection('negative')} className="p-2 rounded-full hover:bg-red-600">
              {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.negative && (
            <div className="p-8">
              <div className="space-y-4">
                {negativeExercises.map((ex) => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-red-200">
                    <p className="font-medium mb-2">🔹 {ex.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input type="text" value={writtenAnswers[ex.key] || ""} onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)} placeholder="Write negative form..." className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm" />
                      <button onClick={() => handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm">Check</button>
                      <button onClick={() => { handleWrittenAnswerChange(ex.key, ex.answer); handleCheckAnswer(ex.key, ex.answer, ex.answer); }} className="bg-gray-200 px-4 py-2 rounded-md text-sm">Show</button>
                    </div>
                    {showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 4 – SUBSTITUTION PRACTICE II */}
        {/* ======================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
            <button onClick={() => toggleSection('substitution2')} className="p-2 rounded-full hover:bg-purple-700">
              {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.substitution2 && (
            <div className="p-8">
              <div className="space-y-5">
                {subs2Exercises.map((ex) => {
                  const currentSentence = ex.base.replace('{0}', ex.options[ex.currentIndex] as string);
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-purple-200">
                      <p className="text-gray-500 text-sm mb-1">🇧🇷 {ex.original}</p>
                      <p className="text-purple-700 font-bold text-lg mb-2">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {(ex.options as string[]).map((opt, idx) => (
                          <button key={idx} onClick={() => handleSubs2OptionClick(ex.key, idx)} className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-purple-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                            {opt}
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
        {/* PART 5 – CHANGE INTO AFFIRMATIVE */}
        {/* ======================================== */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">✅ CHANGE INTO AFFIRMATIVE</h2>
            <button onClick={() => toggleSection('affirmative')} className="p-2 rounded-full hover:bg-green-600">
              {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.affirmative && (
            <div className="p-8">
              <div className="space-y-4">
                {affirmativeExercises.map((ex) => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-green-200">
                    <p className="font-medium mb-2">🔹 {ex.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input type="text" value={writtenAnswers[ex.key] || ""} onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)} placeholder="Write affirmative form..." className="flex-1 px-3 py-2 border border-green-300 rounded-md text-sm" />
                      <button onClick={() => handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)} className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm">Check</button>
                      <button onClick={() => { handleWrittenAnswerChange(ex.key, ex.answer); handleCheckAnswer(ex.key, ex.answer, ex.answer); }} className="bg-gray-200 px-4 py-2 rounded-md text-sm">Show</button>
                    </div>
                    {showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 6 – CHANGE INTO INTERROGATIVE */}
        {/* ======================================== */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
            <button onClick={() => toggleSection('interrogative')} className="p-2 rounded-full hover:bg-yellow-700">
              {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.interrogative && (
            <div className="p-8">
              <div className="space-y-4">
                {interrogativeExercises.map((ex) => (
                  <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-yellow-200">
                    <p className="font-medium mb-2">🔹 {ex.sentence}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input type="text" value={writtenAnswers[ex.key] || ""} onChange={(e) => handleWrittenAnswerChange(ex.key, e.target.value)} placeholder="Write interrogative form..." className="flex-1 px-3 py-2 border border-yellow-300 rounded-md text-sm" />
                      <button onClick={() => handleCheckAnswer(ex.key, writtenAnswers[ex.key] || "", ex.answer)} className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 text-sm">Check</button>
                      <button onClick={() => { handleWrittenAnswerChange(ex.key, ex.answer); handleCheckAnswer(ex.key, ex.answer, ex.answer); }} className="bg-gray-200 px-4 py-2 rounded-md text-sm">Show</button>
                    </div>
                    {showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 7 – PHRASAL VERBS PRACTICE */}
        {/* ======================================== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-700 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">📚 PHRASAL VERBS – TRAVEL CONTEXT</h2>
            <button onClick={() => toggleSection('phrasalVerbs')} className="p-2 rounded-full hover:bg-indigo-800">
              {sections.phrasalVerbs ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.phrasalVerbs && (
            <div className="p-8">
              <p className="text-indigo-700 mb-6 italic">🎯 Learn and practice phrasal verbs in travel situations:</p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {phrasalVerbs.map((pv, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-indigo-200">
                    <div className="font-bold text-indigo-700">{pv.verb}</div>
                    <div className="text-xs text-gray-500">{pv.meaning}</div>
                    <div className="text-sm text-gray-700 mt-1 italic">"{pv.example}"</div>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-indigo-700 text-lg mb-3">📝 Practice: Complete with a phrasal verb</h3>
              <div className="space-y-4">
                {[
                  { id: 1, question: "How do you usually __________ travel ideas?", expected: "come up with" },
                  { id: 2, question: "Have you ever __________ someone you know while traveling?", expected: "run into" },
                  { id: 3, question: "What do you do to __________ the best hotel?", expected: "figure out" },
                  { id: 4, question: "Can you __________ your last trip experience?", expected: "go over" },
                  { id: 5, question: "Did any trip __________ differently than expected?", expected: "turn out" }
                ].map((ex) => (
                  <div key={ex.id} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                    <p className="font-medium mb-2">🔹 {ex.question}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input type="text" value={phrasalAnswers[ex.id] || ""} onChange={(e) => handlePhrasalAnswerChange(ex.id, e.target.value)} placeholder="Write your answer using a phrasal verb..." className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm" />
                      <button onClick={() => handlePhrasalCheck(ex.id, phrasalAnswers[ex.id] || "", ex.expected)} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 text-sm">Check</button>
                    </div>
                    {phrasalResults[ex.id] !== undefined && (
                      <div className={`mt-2 p-2 rounded-md text-sm ${phrasalResults[ex.id] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {phrasalResults[ex.id] ? "✓ Good! Correct phrasal verb usage." : "✗ Try using the correct phrasal verb from the list above."}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 8 – LISTENING (Number the Pictures) */}
        {/* ======================================== */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
            <button onClick={() => toggleSection('listening')} className="p-2 rounded-full hover:bg-pink-700">
              {sections.listening ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.listening && (
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-pink-700 font-medium text-lg">🎧 Listen to the 6 situations and number the pictures in order</p>
                <div className="flex justify-center items-center gap-4 my-4">
                  <AudioPlayer src={listeningAudioUrl} />
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 text-sm"
                  >
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </button>
                </div>
                {showTranscript && (
                  <div className="bg-white p-4 rounded-lg border border-pink-200 text-left max-w-2xl mx-auto">
                    <p className="font-bold text-pink-700 mb-2">📝 Transcript:</p>
                    <p className="text-gray-700 whitespace-pre-line">{listeningTranscript}</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {listeningSituations.map((situation) => (
                  <div key={situation.id} className="bg-white rounded-lg overflow-hidden border-2 border-pink-200">
                    <div className="relative h-40 w-full">
                      <Image src={situation.image} alt={`Situation ${situation.id}`} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-600 mb-2">{situation.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-pink-700">Number:</span>
                        <select 
                          value={listeningNumbers[situation.id] || ""} 
                          onChange={(e) => handleListeningNumber(situation.id, parseInt(e.target.value))}
                          className="border border-pink-300 rounded-md px-3 py-1 text-sm"
                        >
                          <option value="">--</option>
                          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-pink-100 p-4 rounded-lg">
                <p className="text-pink-700 text-sm">💡 Tip: Listen to the audio 2-3 times. First time just listen, second time number the pictures, third time check your answers.</p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 9 – SPEAKING PRACTICE */}
        {/* ======================================== */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🗣️ SPEAKING PRACTICE</h2>
            <button onClick={() => toggleSection('speaking')} className="p-2 rounded-full hover:bg-orange-700">
              {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.speaking && (
            <div className="p-8">
              <p className="text-orange-700 mb-6 italic">🎯 Practice answering these questions using phrasal verbs and travel vocabulary:</p>
              
              {/* Destinations Gallery */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                {destinations.map((dest, idx) => (
                  <div key={idx} className="bg-white rounded-lg overflow-hidden border-2 border-orange-200">
                    <div className="relative h-32 w-full">
                      <Image src={dest.image} alt={dest.name} fill className="object-cover" />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-bold text-orange-700">{dest.name}</h3>
                      <p className="text-xs text-gray-600">{dest.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {[
                  { id: "q1", question: "How do you usually come up with travel ideas?", example: "I usually look at Instagram and travel blogs to come up with ideas." },
                  { id: "q2", question: "What do you do to figure out the best place to stay?", example: "I read reviews online to figure out the best hotel or hostel." },
                  { id: "q3", question: "Can you go over a memorable trip you took?", example: "Let me go over my trip to Italy - it was amazing!" },
                  { id: "q4", question: "Have you ever run into someone you know while traveling?", example: "Yes, I ran into my neighbor at the airport in Paris!" },
                  { id: "q5", question: "What makes a destination turn out to be a great experience?", example: "Good food and friendly people make a trip turn out great." },
                  { id: "q6", question: "Would you prefer a hotel or a hostel? Why?", example: "I prefer hostels because they're cheaper and I can meet new people." }
                ].map((q) => (
                  <div key={q.id} className="bg-white p-4 rounded-lg border-2 border-orange-200">
                    <p className="font-bold text-orange-700 mb-2">💬 {q.question}</p>
                    <textarea
                      value={speakingAnswers[q.id] || ""}
                      onChange={(e) => handleSpeakingAnswer(q.id, e.target.value)}
                      placeholder={`Example: ${q.example}`}
                      className="w-full p-3 border border-orange-300 rounded-md text-sm resize-none"
                      rows={3}
                    />
                    <p className="text-xs text-gray-400 mt-2">💡 Say your answer out loud to practice speaking!</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-orange-100 rounded-lg text-center">
                <p className="text-orange-700 font-medium">🎤 Role-play: Imagine you're the customer from the dialogue</p>
                <p className="text-sm text-orange-600 mt-1">Practice saying: "I want to travel on vacation, but I don't know where to go." → "I like to go to the beach and meet new people." → "I want to buy a package to Rio!"</p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* VOCABULARY SUMMARY */}
        {/* ======================================== */}
        <div className="bg-gray-100 rounded-[30px] p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📖 Key Vocabulary from Lesson 60</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="font-bold text-teal-600">Destinations</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>Malta</li>
                <li>Rio de Janeiro</li>
                <li>resort</li>
                <li>hostel</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-teal-600">Hotel Facilities</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>swimming pool</li>
                <li>fitness center</li>
                <li>room service</li>
                <li>lobby</li>
              </ul>
            </div>
            <div>
              <p className="font-bold text-teal-600">Travel Expressions</p>
              <ul className="list-disc pl-5 text-sm text-gray-700">
                <li>travel package</li>
                <li>safe place</li>
                <li>expensive destination</li>
                <li>here I go!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ======================================== */}
        {/* SAVE & NAVIGATION BUTTONS */}
        {/* ======================================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md flex items-center gap-2">
              <Save size={20} /> Save All Answers
            </button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm shadow-md">
              Clear All
            </button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson59")} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2">
              <ArrowLeft size={18} /> Previous Lesson
            </button>
            <button onClick={() => router.push("/cursos/lesson61")} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2">
              Next Lesson <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 60 – Express Yourself | Travel & Destinations | Level A2-B1</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}