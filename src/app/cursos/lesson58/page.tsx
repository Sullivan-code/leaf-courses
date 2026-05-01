"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { 
  Pause, Play, RotateCcw, Volume2, ChevronUp, ChevronDown, 
  Check, XCircle, Save, ArrowLeft, ArrowRight 
} from "lucide-react";

// ============================================
// LESSON 58 – HOBBIES & TRAVELING (CAN / CAN'T)
// Theme: Expressing abilities and possibilities using CAN / CAN'T
// Level: A2-B1 - Intermediate
// ============================================

// ============================================
// SPEAK RIGHT NOW - IMAGES FOR CAN/CAN'T PRACTICE
// ============================================
const speakNowImages = [
  { id: 1, action: "run a marathon", image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2070&auto=format&fit=crop", cant: false },
  { id: 2, action: "play the guitar", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop", cant: false },
  { id: 3, action: "swim", image: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=2073&auto=format&fit=crop", cant: false },
  { id: 4, action: "speak Chinese", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2069&auto=format&fit=crop", cant: true },
  { id: 5, action: "cook", image: "https://images.unsplash.com/photo-1556910104-6d2b6a8c9a5a?q=80&w=2070&auto=format&fit=crop", cant: false },
  { id: 6, action: "play basketball", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop", cant: false },
  { id: 7, action: "drive a car", image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop", cant: true, cross: true },
  { id: 8, action: "sing", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop", cant: false },
  { id: 9, action: "dance", image: "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?q=80&w=2070&auto=format&fit=crop", cant: false },
  { id: 10, action: "climb a mountain", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop", cant: true }
];

// ============================================
// SUBSTITUTION PRACTICE I
// ============================================
const substitutionPractice1 = [
  { key: "sub1-1", original: "Eles estão viajando de trem.", base: "They are traveling by {0}.", options: ["train", "bus", "plane"], currentIndex: 0 },
  { key: "sub1-2", original: "Nós estamos esperando perto da farmácia.", base: "We are waiting near the {0}.", options: ["pharmacy", "bank", "market"], currentIndex: 0 },
  { key: "sub1-3", original: "Eu estou procurando pela minha mala.", base: "I am looking for my {0}.", options: ["suitcase", "passport", "ticket"], currentIndex: 0 },
  { key: "sub1-4", original: "Você pode ligar para o médico?", base: "Can you call the {0}?", options: ["doctor", "travel agent", "manager"], currentIndex: 0 },
  { key: "sub1-5", original: "Você pode cozinhar para as crianças?", base: "Can you cook for {0}?", options: ["the children", "your friends", "your relatives"], currentIndex: 0 }
];

// ============================================
// SUBSTITUTION PRACTICE II
// ============================================
const substitutionPractice2 = [
  { key: "sub2-1", original: "Divirta-se no resort!", base: "Have fun at the {0}!", options: ["resort", "game", "museum"], currentIndex: 0 },
  { key: "sub2-2", original: "Ele não pode usar roupas casuais aqui.", base: "{0} can't wear casual clothes here.", options: ["He", "She", "They"], currentIndex: 0 },
  { key: "sub2-3", original: "É seguro visitar os pontos turísticos aqui?", base: "{0} safe to visit the tourist attractions here?", options: ["Is it", "It is not", "Is it?"], currentIndex: 0 },
  { key: "sub2-4", original: "Ela está conversando com os passageiros?", base: "Is she talking to the {0}?", options: ["passengers", "tourists", "travel agent"], currentIndex: 0 },
  { key: "sub2-5", original: "Onde está sua mala?", base: "Where is your {0}?", options: ["suitcase", "baggage", "tag"], currentIndex: 0 }
];

// ============================================
// CHANGE INTO NEGATIVE
// ============================================
const negativeExercises = [
  { key: "neg-1", sentence: "He can play the drums.", answer: "He can't play the drums." },
  { key: "neg-2", sentence: "They are watching a movie on TV.", answer: "They aren't watching a movie on TV." },
  { key: "neg-3", sentence: "She is reading a good book.", answer: "She isn't reading a good book." },
  { key: "neg-4", sentence: "We can come on Thursday.", answer: "We can't come on Thursday." },
  { key: "neg-5", sentence: "I am studying German now.", answer: "I am not studying German now." },
  { key: "neg-6", sentence: "They can take pictures here.", answer: "They can't take pictures here." }
];

// ============================================
// CHANGE INTO AFFIRMATIVE
// ============================================
const affirmativeExercises = [
  { key: "aff-1", sentence: "My mother can't run a marathon.", answer: "My mother can run a marathon." },
  { key: "aff-2", sentence: "Your friend doesn't like to play volleyball.", answer: "Your friend likes to play volleyball." },
  { key: "aff-3", sentence: "His friend doesn't want to go on a tour.", answer: "His friend wants to go on a tour." },
  { key: "aff-4", sentence: "Their neighbors aren't playing the guitar.", answer: "Their neighbors are playing the guitar." },
  { key: "aff-5", sentence: "Our uncle never travels on business.", answer: "Our uncle travels on business." },
  { key: "aff-6", sentence: "She doesn't come from the U.S.A.", answer: "She comes from the U.S.A." }
];

// ============================================
// UNLOCK - FREE PRODUCTION
// ============================================
const unlockTopics = {
  places: ["Paris", "New York", "Tokyo", "Rome", "London", "Rio de Janeiro"],
  clothes: ["t-shirt", "shorts", "jacket", "swimsuit", "sunglasses", "hat"],
  activities: ["sightseeing", "hiking", "shopping", "swimming", "taking pictures", "trying local food"]
};

// ============================================
// TUNE IN YOUR EARS - LISTENING DATA
// ============================================
const listeningData = {
  audioUrl: "/audios/l58_listening.mp3",
  transcript: `Person 1: Can you play the guitar?
Person 2: No, I can't. But I can play the drums.
Person 1: That's cool! Can you teach me?
Person 2: Sure! Can you come to my house tomorrow?
Person 1: Yes, I can. What time?
Person 2: Can you come at 3 PM?
Person 1: No, I can't. I'm working until 5 PM.
Person 2: OK, can you come at 6 PM?
Person 1: Yes, I can. See you then!`,
  questions: [
    { id: 1, question: "Can person 2 play the guitar?", correctAnswer: "No, he can't" },
    { id: 2, question: "What can person 2 play?", correctAnswer: "He can play the drums" },
    { id: 3, question: "Can person 1 come at 3 PM?", correctAnswer: "No, he can't" },
    { id: 4, question: "What time can person 1 come?", correctAnswer: "At 6 PM" }
  ]
};

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

// SpeakNow Component for CAN/CAN'T practice
const SpeakNowCard = ({ image, action, cant, onAnswer }: { image: string; action: string; cant: boolean; onAnswer: (action: string, canDo: boolean) => void }) => {
  const [answered, setAnswered] = useState(false);
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (answer: boolean) => {
    setUserAnswer(answer);
    setAnswered(true);
    onAnswer(action, answer === !cant);
    setShowExplanation(true);
  };

  const isCorrect = userAnswer === !cant;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-teal-200">
      <div className="relative h-48 w-full">
        <Image src={image} alt={action} fill className="object-cover" />
        {cant && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-2xl font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg">
            ❌
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-bold text-teal-700 text-center mb-3">Can they {action}?</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => handleAnswer(true)}
            disabled={answered}
            className={`px-4 py-2 rounded-lg font-semibold transition ${answered ? (userAnswer === true ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300') : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            Yes, they can
          </button>
          <button
            onClick={() => handleAnswer(false)}
            disabled={answered}
            className={`px-4 py-2 rounded-lg font-semibold transition ${answered ? (userAnswer === false ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300') : 'bg-red-500 hover:bg-red-600 text-white'}`}
          >
            No, they can't
          </button>
        </div>
        {showExplanation && (
          <div className={`mt-3 p-2 rounded-md text-center text-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isCorrect ? "✓ Correct!" : `✗ The correct answer is: ${!cant ? 'Yes, they can' : 'No, they cannot'}`}
            <button onClick={() => setShowExplanation(false)} className="ml-2 text-xs underline">Hide</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson58() {
  const router = useRouter();
  
  // Section visibility
  const [sections, setSections] = useState({
    speakNow: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    unlock: true,
    listening: true
  });

  // Exercise states
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  
  // Speak Now states
  const [speakNowResults, setSpeakNowResults] = useState<Record<string, boolean>>({});
  
  // Unlock states
  const [unlockAnswers, setUnlockAnswers] = useState({
    places: "",
    clothes: "",
    activities: ""
  });
  
  // Listening states
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({});
  const [listeningResults, setListeningResults] = useState<Record<number, boolean>>({});
  const [showTranscript, setShowTranscript] = useState(false);

  // Pronunciation audio
  const [pronunciationAudio] = useState("/audios/l58_pronunciation.mp3");

  // ============================================
  // PERSISTENCE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem("lesson58Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setSpeakNowResults(data.speakNowResults || {});
        setUnlockAnswers(data.unlockAnswers || { places: "", clothes: "", activities: "" });
        setListeningAnswers(data.listeningAnswers || {});
        setListeningResults(data.listeningResults || {});
        if (data.sections) setSections(data.sections);
        console.log("✅ Lesson 58 data loaded");
      } catch (error) { console.error("Error loading:", error); }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises, subs2Exercises, writtenAnswers, answerResults, showAnswerResults,
      speakNowResults, unlockAnswers, listeningAnswers, listeningResults, sections,
      lastUpdated: new Date().toISOString(), 
      lessonName: "Lesson 58 - Hobbies & Traveling (Can/Can't)"
    };
    localStorage.setItem("lesson58Answers", JSON.stringify(data));
    alert("✅ All answers saved!");
  };

  const clearAllAnswers = () => {
    if (confirm("Clear ALL answers?")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setSpeakNowResults({});
      setUnlockAnswers({ places: "", clothes: "", activities: "" });
      setListeningAnswers({});
      setListeningResults({});
      localStorage.removeItem("lesson58Answers");
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

  const handleSpeakNowAnswer = (action: string, isCorrect: boolean) => {
    setSpeakNowResults(prev => ({ ...prev, [action]: isCorrect }));
  };

  const handleListeningAnswerChange = (id: number, value: string) => {
    setListeningAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleListeningCheck = (id: number, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setListeningResults(prev => ({ ...prev, [id]: isCorrect }));
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')` }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-teal-900 mb-4">✈️ LESSON 58 – HOBBIES & TRAVELING</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Learn to talk about <span className="font-bold text-teal-600">abilities and possibilities</span> using 
            <span className="font-bold text-blue-600"> CAN / CAN'T</span>, and practice 
            <span className="font-bold text-green-600"> present continuous</span> structures.
          </p>
          <p className="text-md text-gray-500 mt-2">Level A2-B1 - Intermediate</p>
        </div>

        {/* ======================================== */}
        {/* PART 1 – SPEAK RIGHT NOW (CAN/CAN'T) */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAK RIGHT NOW</h2>
              <button onClick={() => toggleSection('speakNow')} className="ml-4 p-2 rounded-full hover:bg-teal-700 transition">
                {sections.speakNow ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="text-sm bg-white text-teal-600 px-3 py-1 rounded-full">10 images • Can they...?</div>
          </div>

          {sections.speakNow && (
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-teal-700 font-medium text-lg">🎯 Ask and answer: <span className="font-bold">"Can they [action]?"</span></p>
                <p className="text-gray-700 text-md mt-1">✨ <span className="font-bold">Yes, they can.</span> or <span className="font-bold">No, they can't.</span></p>
                <p className="text-gray-500 text-sm mt-2">👉 If the image has ❌, the answer is <span className="font-bold text-red-600">No, they can't</span>. Otherwise, answer <span className="font-bold text-green-600">Yes, they can</span>.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {speakNowImages.map((img) => (
                  <SpeakNowCard
                    key={img.id}
                    image={img.image}
                    action={img.action}
                    cant={img.cant}
                    onAnswer={handleSpeakNowAnswer}
                  />
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-teal-100 rounded-lg">
                <h3 className="font-bold text-teal-800">📊 Progress: {Object.keys(speakNowResults).filter(k => speakNowResults[k] === true).length} / 10 correct answers</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${(Object.keys(speakNowResults).filter(k => speakNowResults[k] === true).length / 10) * 100}%` }} />
                </div>
              </div>

              {/* Expansion Questions */}
              <div className="mt-6 bg-white p-4 rounded-lg border border-teal-200">
                <p className="font-bold text-teal-700 mb-2">💡 Expansion Questions (Answer out loud):</p>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">Why can/can't they do this?</div>
                  <div className="bg-gray-50 p-2 rounded">When do people usually do this?</div>
                  <div className="bg-gray-50 p-2 rounded">Where can you learn this activity?</div>
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
        {/* PART 6 – UNLOCK (FREE PRODUCTION) */}
        {/* ======================================== */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔓 UNLOCK – FREE PRODUCTION</h2>
            <button onClick={() => toggleSection('unlock')} className="p-2 rounded-full hover:bg-orange-600">
              {sections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.unlock && (
            <div className="p-8">
              <p className="text-orange-700 mb-6">🎯 Create your own sentences about travel and hobbies:</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {/* Places */}
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200">
                  <h3 className="font-bold text-orange-700 text-lg mb-3">🌍 Places you want to visit</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unlockTopics.places.map((place, idx) => (
                      <span key={idx} className="bg-orange-100 px-2 py-1 rounded-full text-sm">{place}</span>
                    ))}
                  </div>
                  <textarea
                    value={unlockAnswers.places}
                    onChange={(e) => setUnlockAnswers(prev => ({ ...prev, places: e.target.value }))}
                    placeholder="Example: I want to visit Paris because I love French food and culture."
                    className="w-full h-24 p-2 border border-orange-300 rounded-md text-sm resize-none"
                  />
                </div>

                {/* Clothes */}
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200">
                  <h3 className="font-bold text-orange-700 text-lg mb-3">👕 Clothes you wear on trips</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unlockTopics.clothes.map((item, idx) => (
                      <span key={idx} className="bg-orange-100 px-2 py-1 rounded-full text-sm">{item}</span>
                    ))}
                  </div>
                  <textarea
                    value={unlockAnswers.clothes}
                    onChange={(e) => setUnlockAnswers(prev => ({ ...prev, clothes: e.target.value }))}
                    placeholder="Example: On beach trips, I wear shorts, a t-shirt, and sunglasses."
                    className="w-full h-24 p-2 border border-orange-300 rounded-md text-sm resize-none"
                  />
                </div>

                {/* Activities */}
                <div className="bg-white p-5 rounded-xl border-2 border-orange-200">
                  <h3 className="font-bold text-orange-700 text-lg mb-3">🎯 Leisure activities you enjoy</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unlockTopics.activities.map((activity, idx) => (
                      <span key={idx} className="bg-orange-100 px-2 py-1 rounded-full text-sm">{activity}</span>
                    ))}
                  </div>
                  <textarea
                    value={unlockAnswers.activities}
                    onChange={(e) => setUnlockAnswers(prev => ({ ...prev, activities: e.target.value }))}
                    placeholder="Example: I love sightseeing and trying local food when I travel."
                    className="w-full h-24 p-2 border border-orange-300 rounded-md text-sm resize-none"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-orange-100 rounded-lg text-center">
                <p className="text-orange-700 text-sm">💡 Read your answers out loud to practice speaking!</p>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 7 – TUNE IN YOUR EARS (LISTENING) */}
        {/* ======================================== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
            <button onClick={() => toggleSection('listening')} className="p-2 rounded-full hover:bg-indigo-700">
              {sections.listening ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.listening && (
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-indigo-700 font-medium text-lg">🎧 Listen carefully and answer the questions</p>
                <div className="flex justify-center items-center gap-4 my-4">
                  <AudioPlayer src={listeningData.audioUrl} />
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 text-sm"
                  >
                    {showTranscript ? "Hide Transcript" : "Show Transcript"}
                  </button>
                </div>
                {showTranscript && (
                  <div className="bg-white p-4 rounded-lg border border-indigo-200 text-left max-w-2xl mx-auto">
                    <p className="font-bold text-indigo-700 mb-2">📝 Transcript:</p>
                    <p className="text-gray-700 whitespace-pre-line">{listeningData.transcript}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-indigo-700 mb-4">📝 Listening Comprehension Questions:</h3>
                {listeningData.questions.map((q) => (
                  <div key={q.id} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                    <p className="font-medium mb-2">🔹 Question {q.id}: {q.question}</p>
                    <div className="flex flex-col md:flex-row gap-2">
                      <input
                        type="text"
                        value={listeningAnswers[q.id] || ""}
                        onChange={(e) => handleListeningAnswerChange(q.id, e.target.value)}
                        placeholder="Write your answer based on what you heard..."
                        className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm"
                      />
                      <button
                        onClick={() => handleListeningCheck(q.id, listeningAnswers[q.id] || "", q.correctAnswer)}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 text-sm"
                      >
                        Check
                      </button>
                      <button
                        onClick={() => { handleListeningAnswerChange(q.id, q.correctAnswer); handleListeningCheck(q.id, q.correctAnswer, q.correctAnswer); }}
                        className="bg-gray-200 px-4 py-2 rounded-md text-sm"
                      >
                        Show
                      </button>
                    </div>
                    {listeningResults[q.id] !== undefined && (
                      <AnswerResult isCorrect={listeningResults[q.id]} correctAnswer={q.correctAnswer} />
                    )}
                  </div>
                ))}
              </div>

              {/* Listening Tips */}
              <div className="mt-8 bg-indigo-100 border-2 border-indigo-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 🎯 Listening & Pronunciation Tips:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                  <li>Notice the difference between <strong>"can"</strong> (quick, unstressed) and <strong>"can't"</strong> (strong, stressed)</li>
                  <li>In fast speech, "can" sounds like /kən/ while "can't" sounds like /kænt/</li>
                  <li>Practice saying: <span className="font-mono bg-white px-2 py-1 rounded">"Yes, I can"</span> and <span className="font-mono bg-white px-2 py-1 rounded">"No, I can't"</span></li>
                  <li>Listen for the <strong>final 't' sound</strong> in "can't" - it's very important!</li>
                  <li>Repeat after the audio to improve your pronunciation</li>
                </ul>
                <div className="mt-4 p-3 bg-white rounded-lg">
                  <p className="font-bold text-indigo-700">🎤 Practice saying these minimal pairs:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-center">
                    <div className="p-2 bg-indigo-50 rounded">can /kən/ → I can swim.</div>
                    <div className="p-2 bg-indigo-50 rounded">can't /kænt/ → I can't swim.</div>
                    <div className="p-2 bg-indigo-50 rounded">can /kən/ → You can go.</div>
                    <div className="p-2 bg-indigo-50 rounded">can't /kænt/ → You can't go.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
            <button onClick={() => router.push("/cursos/lesson57")} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2">
              <ArrowLeft size={18} /> Previous Lesson
            </button>
            <button onClick={() => router.push("/cursos/lesson59")} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-full shadow-md flex items-center gap-2">
              Next Lesson <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 58 – Hobbies & Traveling | CAN / CAN'T | Present Continuous | Level A2-B1</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}