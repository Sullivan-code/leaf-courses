"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle, Headphones, Send } from "lucide-react";

// ==========================================
// LESSON 22 DATA (Lifestyle & Weekly Planning)
// ==========================================

// Substitution Practice 1
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "He comes home early. / late / at night",
    base: "He comes home {0}.",
    options: ["early", "late", "at night"],
    correctForms: ["early", "late", "at night"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "She wants to live at the beach. / He / We",
    base: "{0} want to live at the beach.",
    options: ["She", "He", "We"],
    correctForms: ["She wants", "He wants", "We want"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "He needs to study Portuguese. / Spanish / English",
    base: "He needs to study {0}.",
    options: ["Portuguese", "Spanish", "English"],
    correctForms: ["Portuguese", "Spanish", "English"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "He sometimes studies on Sundays. / on Saturdays / on Tuesdays",
    base: "He sometimes studies {0}.",
    options: ["on Sundays", "on Saturdays", "on Tuesdays"],
    correctForms: ["on Sundays", "on Saturdays", "on Tuesdays"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "She goes to school at 7:30. / 7:00 / 6:45",
    base: "She goes to school at {0}.",
    options: ["7:30", "7:00", "6:45"],
    correctForms: ["7:30", "7:00", "6:45"],
    currentIndex: 0
  },
  { 
    key: "subs-6", 
    original: "What day is today? / It's Monday. / Friday / Thursday",
    base: "What day is today? / It's {0}.",
    options: ["Monday", "Friday", "Thursday"],
    correctForms: ["Monday", "Friday", "Thursday"],
    currentIndex: 0
  }
];

// Substitution Practice 2
const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "I need to cook today. / We / You",
    base: "{0} need to cook today.",
    options: ["I", "We", "You"],
    correctForms: ["I need", "We need", "You need"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "He goes to work at 9:15. / school / church",
    base: "He goes to {0} at 9:15.",
    options: ["work", "school", "church"],
    correctForms: ["work", "school", "church"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Do you work during the week? / cook / clean the house",
    base: "Do you {0} during the week?",
    options: ["work", "cook", "clean the house"],
    correctForms: ["work", "cook", "clean the house"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "We prefer to stay home on Saturdays. / on Sundays / on weekends",
    base: "We prefer to stay home {0}.",
    options: ["on Saturdays", "on Sundays", "on weekends"],
    correctForms: ["on Saturdays", "on Sundays", "on weekends"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "I study on Mondays and Wednesdays. / Tuesdays and Thursdays / Mondays and Fridays",
    base: "I study {0}.",
    options: ["on Mondays and Wednesdays", "on Tuesdays and Thursdays", "on Mondays and Fridays"],
    correctForms: ["on Mondays and Wednesdays", "on Tuesdays and Thursdays", "on Mondays and Fridays"],
    currentIndex: 0
  }
];

// Negative Exercises
const negativeExercises = [
  { key: "neg-1", sentence: "We like to go to work early.", answer: "We don't like to go to work early." },
  { key: "neg-2", sentence: "I like to work on weekends.", answer: "I don't like to work on weekends." },
  { key: "neg-3", sentence: "We stay home on Sundays.", answer: "We don't stay home on Sundays." },
  { key: "neg-4", sentence: "I study here during the week.", answer: "I don't study here during the week." },
  { key: "neg-5", sentence: "They live in a small house.", answer: "They don't live in a small house." },
  { key: "neg-6", sentence: "You clean the house on weekends.", answer: "You don't clean the house on weekends." }
];

// Affirmative Exercises
const affirmativeExercises = [
  { key: "aff-1", sentence: "I don't like to live in the countryside.", answer: "I like to live in the countryside." },
  { key: "aff-2", sentence: "They don't clean the kitchen every day.", answer: "They clean the kitchen every day." },
  { key: "aff-3", sentence: "We don't like to stay at the beach.", answer: "We like to stay at the beach." },
  { key: "aff-4", sentence: "They don't come here on weekends.", answer: "They come here on weekends." },
  { key: "aff-5", sentence: "I don't cook for my friends.", answer: "I cook for my friends." },
  { key: "aff-6", sentence: "We don't have an apartment at the beach.", answer: "We have an apartment at the beach." }
];

// Interrogative Exercises
const interrogativeExercises = [
  { key: "int-1", sentence: "You go to the beach in the morning.", answer: "Do you go to the beach in the morning?" },
  { key: "int-2", sentence: "You want to go to the movies on Friday.", answer: "Do you want to go to the movies on Friday?" },
  { key: "int-3", sentence: "You sometimes sleep on the couch.", answer: "Do you sometimes sleep on the couch?" },
  { key: "int-4", sentence: "They usually do the laundry on Saturdays.", answer: "Do they usually do the laundry on Saturdays?" },
  { key: "int-5", sentence: "You study languages with your co-workers.", answer: "Do you study languages with your co-workers?" },
  { key: "int-6", sentence: "You want a new job abroad.", answer: "Do you want a new job abroad?" }
];

// Fluency Exercises
const fluencyExercises = [
  { key: "flu-1", original: "I work at home. (He)", base: "I work at home.", subject: "He", answer: "He works at home." },
  { key: "flu-2", original: "She lives alone. (They)", base: "She lives alone.", subject: "They", answer: "They live alone." },
  { key: "flu-3", original: "I have a new cell phone. (She)", base: "I have a new cell phone.", subject: "She", answer: "She has a new cell phone." },
  { key: "flu-4", original: "We like to stay home on weekends. (They)", base: "We like to stay home on weekends.", subject: "They", answer: "They like to stay home on weekends." },
  { key: "flu-5", original: "We go to work at 8:00 a.m. (He)", base: "We go to work at 8:00 a.m.", subject: "He", answer: "He goes to work at 8:00 a.m." },
  { key: "flu-6", original: "We understand the story. (She)", base: "We understand the story.", subject: "She", answer: "She understands the story." },
  { key: "flu-7", original: "They eat pasta on Sundays. (He)", base: "They eat pasta on Sundays.", subject: "He", answer: "He eats pasta on Sundays." },
  { key: "flu-8", original: "I clean the house on Saturdays. (She)", base: "I clean the house on Saturdays.", subject: "She", answer: "She cleans the house on Saturdays." },
  { key: "flu-9", original: "They need a new house. (He)", base: "They need a new house.", subject: "He", answer: "He needs a new house." },
  { key: "flu-10", original: "I get up early during the week. (She)", base: "I get up early during the week.", subject: "She", answer: "She gets up early during the week." },
  { key: "flu-11", original: "I come to the English school on Wednesdays. (She)", base: "I come to the English school on Wednesdays.", subject: "She", answer: "She comes to the English school on Wednesdays." },
  { key: "flu-12", original: "They have breakfast at 7:00 a.m. (He)", base: "They have breakfast at 7:00 a.m.", subject: "He", answer: "He has breakfast at 7:00 a.m." },
  { key: "flu-13", original: "I do my homework in the evening. (She)", base: "I do my homework in the evening.", subject: "She", answer: "She does her homework in the evening." },
  { key: "flu-14", original: "We watch TV at night. (He)", base: "We watch TV at night.", subject: "He", answer: "He watches TV at night." },
  { key: "flu-15", original: "They play soccer on weekends. (She)", base: "They play soccer on weekends.", subject: "She", answer: "She plays soccer on weekends." },
  { key: "flu-16", original: "I study English every day. (He)", base: "I study English every day.", subject: "He", answer: "He studies English every day." }
];

// Personal Questions (English)
const personalQuestions = [
  { id: 1, question: "Where do you go on weekends?", placeholder: "Describe the places you usually visit on weekends...", instruction: "Then rewrite your answer using the third person singular. Example: He goes to the beach." },
  { id: 2, question: "What do you do during the week?", placeholder: "Describe your daily routine activities during the week...", instruction: "Then rewrite your answer using the third person singular. Example: She studies English." },
  { id: 3, question: "What do your friends do during the week or on weekends?", placeholder: "Describe your friends' activities...", instruction: "Then rewrite your answer using the third person singular. Example: He works at an office." },
  { id: 4, question: "How do you plan your week?", placeholder: "Describe your weekly planning process...", instruction: "Then rewrite your answer using the third person singular. Example: She plans her week on Sundays." },
  { id: 5, question: "What is your favorite part of the weekend?", placeholder: "Describe what you enjoy doing most on weekends...", instruction: "Then rewrite your answer using the third person singular. Example: He likes to relax on Sundays." }
];

// --- TUNE YOUR EARS COMPLETE DATA (Video + Key Vocabulary + ONLY Goal Questions - NO Video Questions) ---
const tuneYourEarsData = {
  title: "Learn English with TV Series: Daily Routines & Lifestyle",
  youtubeId: "u2y2w-bE5qY",
  description: "Watch this video to practice your listening skills, learn vocabulary about daily routines, weekly planning, and see examples of 'He', 'She', and 'It' in context.",
  keyVocabulary: [
    { english: "to give up", portuguese: "desistir" },
    { english: "tired", portuguese: "cansado" },
    { english: "never", portuguese: "nunca" },
    { english: "cafes", portuguese: "cafeterias" },
    { english: "she wrote", portuguese: "ela escreveu" },
    { english: "publishers", portuguese: "publicadoras" },
    { english: "famous", portuguese: "famoso(a)" },
    { english: "to face", portuguese: "encarar (enfrentar)" },
    { english: "dreams", portuguese: "sonhos" },
    { english: "artist", portuguese: "artista" },
    { english: "to work hard", portuguese: "trabalhar duro" },
    { english: "don't feel shy", portuguese: "não fique com vergonha" },
    { english: "to reach your goals", portuguese: "alcançar seus objetivos" }
  ],
  // Goal and future vision questions ONLY (Discussion) - NO video comprehension questions
  goalQuestions: [
    { id: 1, question: "Have you ever wanted to give up on something important? What was it?", correctAnswer: "Personal answer - share your experience.", type: "discussion" },
    { id: 2, question: "What is your biggest dream right now? What do you need to do to reach it?", correctAnswer: "Personal answer - describe your dream and plan.", type: "discussion" },
    { id: 3, question: "Where do you see yourself in 5 years? Describe your life, job, and home.", correctAnswer: "Personal answer - describe your future vision.", type: "discussion" },
    { id: 4, question: "Where do you see yourself in 10 years? How is it different from 5 years?", correctAnswer: "Personal answer - describe long-term goals.", type: "discussion" },
    { id: 5, question: "What habits do you need to work hard on to achieve your goals?", correctAnswer: "Personal answer - identify key habits.", type: "discussion" },
    { id: 6, question: "What advice would you give to someone who feels shy about pursuing their dreams?", correctAnswer: "Personal answer - share your advice.", type: "discussion" }
  ]
};

// Helper to normalize strings for answer checking
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '');
  // For personal/discussion questions, we don't enforce exact match - just mark as seen
  if (correctAnswer.startsWith("Personal answer")) return true;
  return normalize(userAnswer) === normalize(correctAnswer);
};

// Audio Player Component
interface AudioPlayerProps { src: string; compact?: boolean; }
const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current || new Audio(src);
    if (!audioRef.current) audioRef.current = audio;
    else audio.src = src;
    const updateProgress = () => { if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100); };
    const handleEnded = () => { setIsPlaying(false); setProgress(100); };
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
    if (isPlaying) audio.pause();
    else audio.play().catch((err) => console.error("Audio error:", err));
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
      <button onClick={togglePlayPause} className={`${compact ? "p-1" : "p-2"} bg-blue-500 text-white rounded-full hover:bg-blue-600`}>
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button onClick={resetAudio} className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600`}>
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

// Result Display Component
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => (
  isCorrect ? (
    <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
      <Check size={16} className="text-green-600" />
      <span className="text-sm text-green-700 font-medium">Great answer!</span>
    </div>
  ) : (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700"><span className="font-medium">Suggested answer:</span> {correctAnswer}</span>
    </div>
  )
);

export default function Lesson22LifestylePlanning() {
  const router = useRouter();
  
  // Section expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    dialogue: true, vocabulary: true, substitution1: true, negative: true, substitution2: true,
    affirmative: true, interrogative: true, fluency: true, aint: true, unlock: true,
    questions: true, tuneYourEars: true
  });

  // Exercise states
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [fluencyAnswers, setFluencyAnswers] = useState<Record<string, string>>({});
  const [fluencyResults, setFluencyResults] = useState<Record<string, boolean>>({});
  const [showFluencyResults, setShowFluencyResults] = useState<Record<string, boolean>>({});
  
  // Tune Your Ears answers state (only goal questions)
  const [tuneAnswers, setTuneAnswers] = useState<Record<number, string>>({});
  const [tuneResults, setTuneResults] = useState<Record<string, boolean>>({});
  const [showTuneResults, setShowTuneResults] = useState<Record<string, boolean>>({});

  // Dialogue state
  const [dialogueParts, setDialogueParts] = useState({
    rachel: [ "Hi, Shawn!", "Hello, Rachel! How are you?", "I'm fine. Hey, do you have plans for the weekend?", "No.",
      "My family and I want to go to the beach on Saturday. My brother has an apartment near Santa Monica. Do you want to come?",
      "Yes, please! I really want to go to the beach.", "We love to stay at the beach.", "Thanks for the invitation.",
      "You're welcome!", "Do you want to go on Friday or Saturday?", "My father wants to go on Friday in the evening.",
      "Perfect!", "See you on Friday then, Shawn.", "See you!" ],
    currentSpeaker: "Rachel"
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson22Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setFluencyAnswers(data.fluencyAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setFluencyResults(data.fluencyResults || {});
        setShowFluencyResults(data.showFluencyResults || {});
        setTuneAnswers(data.tuneAnswers || {});
        setTuneResults(data.tuneResults || {});
        setShowTuneResults(data.showTuneResults || {});
        if (data.expandedSections) setExpandedSections(data.expandedSections);
        console.log("Data loaded for Lesson 22");
      } catch (error) { console.error("Error loading answers:", error); }
    }
  }, []);

  // Save all answers
  const saveAllAnswers = () => {
    const data = { subs1Exercises, subs2Exercises, writtenAnswers, fluencyAnswers, answerResults, showAnswerResults,
      fluencyResults, showFluencyResults, tuneAnswers, tuneResults, showTuneResults, expandedSections,
      lastUpdated: new Date().toISOString(), lessonName: "Lesson 22 - Lifestyle & Weekly Planning", version: "1.0" };
    try {
      localStorage.setItem("lesson22Answers", JSON.stringify(data));
      alert("✅ All your answers have been saved successfully!");
    } catch (error) { alert("❌ Error saving answers."); }
  };
  
  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear ALL answers?")) {
      setSubs1Exercises(substitutionPractice1); setSubs2Exercises(substitutionPractice2); setWrittenAnswers({});
      setFluencyAnswers({}); setAnswerResults({}); setShowAnswerResults({}); setFluencyResults({});
      setShowFluencyResults({}); setTuneAnswers({}); setTuneResults({}); setShowTuneResults({});
      localStorage.removeItem("lesson22Answers");
      alert("All answers cleared.");
    }
  };

  // Handlers for exercises
  const handleSubs1OptionClick = (key: string, idx: number) => setSubs1Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: idx } : ex));
  const handleSubs2OptionClick = (key: string, idx: number) => setSubs2Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: idx } : ex));
  const handleWrittenAnswerChange = (key: string, value: string) => setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  const handleFluencyAnswerChange = (key: string, value: string) => setFluencyAnswers(prev => ({ ...prev, [key]: value }));
  const handleTuneAnswerChange = (id: number, value: string) => setTuneAnswers(prev => ({ ...prev, [id]: value }));
  
  const handleCheckAnswer = (key: string, user: string, correct: string) => {
    const isCorrect = checkAnswer(user, correct);
    setAnswerResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [key]: true }));
  };
  
  const handleCheckFluency = (key: string, user: string, correct: string) => {
    const isCorrect = checkAnswer(user, correct);
    setFluencyResults(prev => ({ ...prev, [key]: isCorrect }));
    setShowFluencyResults(prev => ({ ...prev, [key]: true }));
  };
  
  const checkTuneAnswer = (id: number, user: string, correct: string) => {
    const isCorrect = checkAnswer(user, correct);
    setTuneResults(prev => ({ ...prev, [`tune-${id}`]: isCorrect }));
    setShowTuneResults(prev => ({ ...prev, [`tune-${id}`]: true }));
  };
  
  const clearTuneAnswer = (id: number) => {
    setTuneAnswers(prev => { const newState = { ...prev }; delete newState[id]; return newState; });
    setShowTuneResults(prev => ({ ...prev, [`tune-${id}`]: false }));
  };
  
  const toggleSection = (section: keyof typeof expandedSections) => setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  const toggleDialogueSpeaker = () => setDialogueParts(prev => ({ ...prev, currentSpeaker: prev.currentSpeaker === "Rachel" ? "Shawn" : "Rachel" }));

  // Only goal questions for Tune Your Ears
  const goalQuestions = tuneYourEarsData.goalQuestions;

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/beach-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🏖️ Lesson 22 – Lifestyle & Weekly Planning</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">Practice talking about weekend plans, daily routines, and weekly activities. Improve your grammar with different pronouns.</p>
        </div>

        {/* LISTEN TO THE CONVERSATION */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 LISTEN TO THE CONVERSATION</h2>
              <button onClick={() => toggleSection('dialogue')} className="ml-4 p-2 rounded-full hover:bg-blue-600">
                {expandedSections.dialogue ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <button onClick={toggleDialogueSpeaker} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition">
              Switch Roles ({dialogueParts.currentSpeaker})
            </button>
          </div>
          {expandedSections.dialogue && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">Instruction: Listen to the conversation audio. Then practice reading with a partner.</h3>
                <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-xl">
                  <AudioPlayer src="https://github.com/Sullivan-code/leaf-courses/blob/main/l22_conversation.mp3?raw=true" compact={false} />
                  <span className="text-sm text-gray-600">Click play to listen to Rachel and Shawn's conversation</span>
                </div>
                <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
                  <div className="space-y-4">
                    {dialogueParts.rachel.map((line, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600 font-bold">
                          {idx % 2 === 0 ? 'R' : 'S'}
                        </div>
                        <div className="flex-1"><p className="font-medium text-gray-700 mb-1">{idx % 2 === 0 ? 'Rachel:' : 'Shawn:'}</p><p className="text-gray-800">{line}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TAKE A LOOK (Support Vocabulary) */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">📚 TAKE A LOOK (Support Vocabulary)</h2>
            <button onClick={() => toggleSection('vocabulary')} className="p-2 rounded-full hover:bg-yellow-600">{expandedSections.vocabulary ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button>
          </div>
          {expandedSections.vocabulary && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">How are you?</span> → Como você está?<p className="text-sm">Example: "Hello! How are you today?"</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">I'm fine.</span> → Eu estou bem.<p className="text-sm">Example: "I'm fine, thank you!"</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">plan</span> → plano<p className="text-sm">Example: "Do you have plans for the weekend?"</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">for</span> → para<p className="text-sm">Example: "We're going to the beach for the day."</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">near</span> → perto<p className="text-sm">Example: "My brother lives near Santa Monica."</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">invitation</span> → convite<p className="text-sm">Example: "Thanks for the invitation!"</p></div>
                <div className="bg-white p-4 rounded-xl"><span className="font-bold">then</span> → então<p className="text-sm">Example: "See you on Friday then!"</p></div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE I */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2><button onClick={()=>toggleSection('substitution1')}>{expandedSections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.substitution1 && (<div className="p-8"><div className="bg-green-100 rounded-xl p-6 space-y-6">{subs1Exercises.map(ex => {
            let sentence = "";
            if (ex.key === "subs-1") sentence = `He comes home ${ex.options[ex.currentIndex]}.`;
            else if (ex.key === "subs-2") sentence = ex.correctForms[ex.currentIndex] + " to live at the beach.";
            else if (ex.key === "subs-3") sentence = `He needs to study ${ex.options[ex.currentIndex]}.`;
            else if (ex.key === "subs-4") sentence = `He sometimes studies ${ex.options[ex.currentIndex]}.`;
            else if (ex.key === "subs-5") sentence = `She goes to school at ${ex.options[ex.currentIndex]}.`;
            else sentence = `What day is today? It's ${ex.options[ex.currentIndex]}.`;
            return (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="text-gray-600 mb-2">{ex.original}</p><div className="p-3 bg-green-50 rounded-md mb-2"><p className="text-green-700 font-medium text-lg">{sentence}</p></div><div className="flex gap-2">{ex.options.map((opt, idx) => <button key={idx} onClick={()=>handleSubs1OptionClick(ex.key, idx)} className={`px-3 py-1 rounded-md text-sm ${ex.currentIndex === idx ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>{opt}</button>)}</div></div>);
          })}</div></div>)}
        </div>

        {/* CHANGE INTO NEGATIVE */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2><button onClick={()=>toggleSection('negative')}>{expandedSections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.negative && (<div className="p-8"><div className="bg-red-100 rounded-xl p-6 space-y-4">{negativeExercises.map(ex => (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="mb-2 font-medium">{ex.sentence}</p><div className="flex gap-2 mb-2"><input type="text" value={writtenAnswers[ex.key]||""} onChange={(e)=>handleWrittenAnswerChange(ex.key, e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Write negative form..." /><button onClick={()=>handleCheckAnswer(ex.key, writtenAnswers[ex.key]||"", ex.answer)} className="bg-red-500 text-white px-3 py-2 rounded-md">Check</button></div>{showAnswerResults[ex.key] && <AnswerResult isCorrect={answerResults[ex.key]} correctAnswer={ex.answer} />}</div>))}</div></div>)}
        </div>

        {/* SUBSTITUTION PRACTICE II */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2><button onClick={()=>toggleSection('substitution2')}>{expandedSections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.substitution2 && (<div className="p-8"><div className="bg-purple-100 rounded-xl p-6 space-y-6">{subs2Exercises.map(ex => {
            let sentence = "";
            if (ex.key === "subs2-1") sentence = ex.correctForms[ex.currentIndex] + " to cook today.";
            else if (ex.key === "subs2-2") sentence = `He goes to ${ex.options[ex.currentIndex]} at 9:15.`;
            else if (ex.key === "subs2-3") sentence = `Do you ${ex.options[ex.currentIndex]} during the week?`;
            else if (ex.key === "subs2-4") sentence = `We prefer to stay home ${ex.options[ex.currentIndex]}.`;
            else sentence = `I study ${ex.options[ex.currentIndex]}.`;
            return (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="text-gray-600 mb-2">{ex.original}</p><div className="p-3 bg-purple-50 rounded-md mb-2"><p className="text-purple-700 font-medium">{sentence}</p></div><div className="flex gap-2">{ex.options.map((opt, idx) => <button key={idx} onClick={()=>handleSubs2OptionClick(ex.key, idx)} className={`px-3 py-1 rounded-md text-sm ${ex.currentIndex === idx ? 'bg-purple-500 text-white' : 'bg-gray-200'}`}>{opt}</button>)}</div></div>);
          })}</div></div>)}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2><button onClick={()=>toggleSection('affirmative')}>{expandedSections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.affirmative && (<div className="p-8"><div className="bg-teal-100 rounded-xl p-6 space-y-4">{affirmativeExercises.map(ex => (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="mb-2 font-medium">{ex.sentence}</p><div className="flex gap-2 mb-2"><input type="text" value={writtenAnswers[`aff-${ex.key}`]||""} onChange={(e)=>handleWrittenAnswerChange(`aff-${ex.key}`, e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Write affirmative form..." /><button onClick={()=>handleCheckAnswer(`aff-${ex.key}`, writtenAnswers[`aff-${ex.key}`]||"", ex.answer)} className="bg-teal-500 text-white px-3 py-2 rounded-md">Check</button></div>{showAnswerResults[`aff-${ex.key}`] && <AnswerResult isCorrect={answerResults[`aff-${ex.key}`]} correctAnswer={ex.answer} />}</div>))}</div></div>)}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2><button onClick={()=>toggleSection('interrogative')}>{expandedSections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.interrogative && (<div className="p-8"><div className="bg-orange-100 rounded-xl p-6 space-y-4">{interrogativeExercises.map(ex => (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="mb-2 font-medium">{ex.sentence}</p><div className="flex gap-2 mb-2"><input type="text" value={writtenAnswers[`int-${ex.key}`]||""} onChange={(e)=>handleWrittenAnswerChange(`int-${ex.key}`, e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder="Write interrogative form..." /><button onClick={()=>handleCheckAnswer(`int-${ex.key}`, writtenAnswers[`int-${ex.key}`]||"", ex.answer)} className="bg-orange-500 text-white px-3 py-2 rounded-md">Check</button></div>{showAnswerResults[`int-${ex.key}`] && <AnswerResult isCorrect={answerResults[`int-${ex.key}`]} correctAnswer={ex.answer} />}</div>))}</div></div>)}
        </div>

        {/* FLUENCY */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">💬 FLUENCY</h2><button onClick={()=>toggleSection('fluency')}>{expandedSections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.fluency && (<div className="p-8"><div className="bg-indigo-100 rounded-xl p-6 space-y-4">{fluencyExercises.map(ex => (<div key={ex.key} className="bg-white p-4 rounded-lg"><p className="mb-2 font-medium">{ex.base} <span className="font-bold">({ex.subject})</span></p><div className="flex gap-2 mb-2"><input type="text" value={fluencyAnswers[ex.key]||""} onChange={(e)=>handleFluencyAnswerChange(ex.key, e.target.value)} className="flex-1 px-3 py-2 border rounded-md" placeholder={`Rewrite with ${ex.subject}...`} /><button onClick={()=>handleCheckFluency(ex.key, fluencyAnswers[ex.key]||"", ex.answer)} className="bg-indigo-500 text-white px-3 py-2 rounded-md">Check</button></div>{showFluencyResults[ex.key] && <AnswerResult isCorrect={fluencyResults[ex.key]} correctAnswer={ex.answer} />}</div>))}</div></div>)}
        </div>

        {/* USING AIN'T */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-amber-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">⚠️ USING "AIN'T" IN INFORMAL ENGLISH</h2><button onClick={()=>toggleSection('aint')}>{expandedSections.aint ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.aint && (<div className="p-8"><div className="bg-amber-100 rounded-xl p-6"><p className="mb-3">"Ain't" is an informal contraction for am not, is not, are not, have not, has not. (Avoid in formal writing.)</p><div className="grid md:grid-cols-2 gap-3"><div className="bg-white p-3 rounded">He ain't happy. → He is not happy.</div><div className="bg-white p-3 rounded">She ain't working today. → She is not working.</div><div className="bg-white p-3 rounded">It ain't easy. → It is not easy.</div><div className="bg-white p-3 rounded">He ain't got time. → He hasn't got time.</div></div></div></div>)}
        </div>

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">🔓 UNLOCK</h2><button onClick={()=>toggleSection('unlock')}>{expandedSections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.unlock && (<div className="p-8"><div className="bg-pink-100 rounded-xl p-6 space-y-4"><textarea value={writtenAnswers["unlock-1"]||""} onChange={e=>handleWrittenAnswerChange("unlock-1", e.target.value)} placeholder="Places you go on weekends (use he/she)..." className="w-full p-3 border rounded-md h-24" /><textarea value={writtenAnswers["unlock-2"]||""} onChange={e=>handleWrittenAnswerChange("unlock-2", e.target.value)} placeholder="Things you do during the week (use he/she)..." className="w-full p-3 border rounded-md h-24" /><textarea value={writtenAnswers["unlock-3"]||""} onChange={e=>handleWrittenAnswerChange("unlock-3", e.target.value)} placeholder="Things your friends/relatives do..." className="w-full p-3 border rounded-md h-24" /></div></div>)}
        </div>

        {/* PERSONAL QUESTIONS */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-cyan-500 text-white py-4 px-8 flex justify-between"><h2 className="text-2xl font-bold">💭 PERSONAL QUESTIONS</h2><button onClick={()=>toggleSection('questions')}>{expandedSections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}</button></div>
          {expandedSections.questions && (<div className="p-8"><div className="space-y-6">{personalQuestions.map(q => (<div key={q.id} className="bg-white p-6 rounded-xl border-2 border-cyan-200"><h4 className="text-lg font-bold text-cyan-700 mb-2">{q.id}. {q.question}</h4><p className="text-sm text-cyan-600 mb-3">{q.instruction}</p><textarea value={writtenAnswers[`q-${q.id}`]||""} onChange={e=>handleWrittenAnswerChange(`q-${q.id}`, e.target.value)} placeholder={q.placeholder} className="w-full h-32 p-3 border rounded-md resize-none" /></div>))}</div></div>)}
        </div>

        {/* SECTION: TUNE IN YOUR EARS (Key Vocabulary + Goal/Discussion Questions ONLY - NO Video Questions) */}
        <div className="mb-16 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-5 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
            <button onClick={() => toggleSection('tuneYourEars')} className="p-2 rounded-full hover:bg-white/20">
              {expandedSections.tuneYourEars ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          
          {expandedSections.tuneYourEars && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">{tuneYourEarsData.title}</h3>
                <p className="text-cyan-600 mb-6">{tuneYourEarsData.description}</p>
                
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneYourEarsData.youtubeId}`}
                      title={tuneYourEarsData.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>

              {/* KEY VOCABULARY FROM THE VIDEO */}
              <div className="mb-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">📝 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tuneYourEarsData.keyVocabulary.map((item, idx) => (
                    <div key={idx} className="flex justify-between p-2 bg-white rounded-lg hover:shadow-md transition">
                      <span className="font-medium text-cyan-700">{item.english}</span>
                      <span className="text-cyan-600">{item.portuguese}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* ONLY DISCUSSION/GOAL QUESTIONS (NO VIDEO COMPREHENSION QUESTIONS) */}
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">🎯 Discussion Questions:</h3>
                {goalQuestions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 border-cyan-200 shadow-md">
                    <div className="flex items-center gap-2 mb-3">
                      <h4 className="text-lg font-bold text-cyan-700 flex-1">
                        💭 Question {q.id}: {q.question}
                      </h4>
                    </div>

                    <textarea
                      value={tuneAnswers[q.id] || ""}
                      onChange={(e) => handleTuneAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer based on your own experience and opinion..."
                      className="w-full h-32 p-3 border border-cyan-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => checkTuneAnswer(q.id, tuneAnswers[q.id] || "", q.correctAnswer)}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md transition font-medium"
                      >
                        Save Answer
                      </button>
                      <button
                        onClick={() => clearTuneAnswer(q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition"
                      >
                        Clear
                      </button>
                    </div>

                    {showTuneResults[`tune-${q.id}`] && (
                      <div className="mt-3">
                        <AnswerResult 
                          isCorrect={tuneResults[`tune-${q.id}`] || false} 
                          correctAnswer={q.correctAnswer}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">🎯 Listening & Reflection Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-cyan-700">
                  <li>Watch the video to absorb vocabulary and sentence structures naturally</li>
                  <li>Pay attention to how routines are described using he, she, and it</li>
                  <li>Think about your own goals and how you can achieve them</li>
                  <li>Don't be afraid to express your dreams and aspirations</li>
                  <li>Remember: everyone feels shy sometimes, but your dreams are worth pursuing</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Save and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2"><span>💾</span> Save All My Answers</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full">Clear All</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson21")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full">&larr; Previous Lesson</button>
            <button onClick={() => router.push("/cursos/lesson23")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full">Next Lesson &rarr;</button>
          </div>
        </div>

        {/* CREDITS */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson 22: Lifestyle & Weekly Planning • Interactive English Practice • All answers are saved in your browser</p>
          <p className="text-xs mt-1">🎯 Focus on your goals and never give up on your dreams!</p>
        </div>
      </div>
    </div>
  );
}