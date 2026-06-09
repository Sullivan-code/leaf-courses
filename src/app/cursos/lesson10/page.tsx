"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle } from "lucide-react";

// ============================================
// SPEECH SYSTEM WITH AMERICAN VOICES
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  voiceType?: "female" | "male";
}

// Speech component for text-to-speech with AMERICAN accent
const SpeakText = ({ text, children, className = "", voiceType = "female" }: SpeakTextProps) => {
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
    
    // American female voices
    const americanFemaleVoices = voices.filter(voice => 
      (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
      (voice.name.toLowerCase().includes('samantha') || 
       voice.name.toLowerCase().includes('google us english') ||
       voice.name.toLowerCase().includes('siri') ||
       voice.name.toLowerCase().includes('female') ||
       voice.name === 'Google US English' ||
       voice.name === 'Samantha')
    );
    
    // American male voices
    const americanMaleVoices = voices.filter(voice => 
      (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
      (voice.name.toLowerCase().includes('google us english male') ||
       voice.name.toLowerCase().includes('male') ||
       voice.name === 'Google US English Male')
    );
    
    // Fallback to any American voice
    const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
    
    if (voiceType === "female" && americanFemaleVoices.length > 0) {
      utterance.voice = americanFemaleVoices[0];
    } else if (voiceType === "male" && americanMaleVoices.length > 0) {
      utterance.voice = americanMaleVoices[0];
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

// Component for pronouncing entire sentences with American accent
const SpeakSentence = ({ text, children, className = "", voiceType = "female" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === 'string' ? children : text;
        if (speechText && typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = 'en-US'; // American English
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          
          const voices = window.speechSynthesis.getVoices();
          
          // American female voices
          const americanFemaleVoices = voices.filter(voice => 
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
            (voice.name.toLowerCase().includes('samantha') || 
             voice.name.toLowerCase().includes('google us english') ||
             voice.name === 'Google US English')
          );
          
          // American male voices
          const americanMaleVoices = voices.filter(voice => 
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
            (voice.name.toLowerCase().includes('google us english male') ||
             voice.name === 'Google US English Male')
          );
          
          const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
          
          if (voiceType === "female" && americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          } else if (voiceType === "male" && americanMaleVoices.length > 0) {
            utterance.voice = americanMaleVoices[0];
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
// LESSON DATA
// ============================================

// Vocabulary with audio (American accent)
const vocabulary = [
  { word: "a little", translation: "um pouco" },
  { word: "I get", translation: "eu entendo" },
  { word: "understand", translation: "entender" },
  { word: "prefer", translation: "preferir" },
  { word: "abroad", translation: "no exterior" },
  { word: "alone", translation: "sozinho" },
  { word: "classmate", translation: "colega de classe" },
  { word: "teacher", translation: "professor" },
  { word: "friend", translation: "amigo" }
];

// Main dialogue with American voices (Zoey - female American, Mike - male American)
const mainDialogue = [
  { speaker: "Zoey", text: "Hi, Mike.", voiceType: "female" as const },
  { speaker: "Mike", text: "Hello, Zoey. What's up?", voiceType: "male" as const },
  { speaker: "Zoey", text: "Mike, do you speak Spanish?", voiceType: "female" as const },
  { speaker: "Mike", text: "A little.", voiceType: "male" as const },
  { speaker: "Zoey", text: "I don't understand this word. Queso?", voiceType: "female" as const },
  { speaker: "Mike", text: "Ah, queso is cheese.", voiceType: "male" as const },
  { speaker: "Zoey", text: "Got it! Thank you. Where do you study Spanish?", voiceType: "female" as const },
  { speaker: "Mike", text: "I study Spanish at LEAF. What about you?", voiceType: "male" as const },
  { speaker: "Zoey", text: "I study alone. I want to live in Spain.", voiceType: "female" as const },
  { speaker: "Mike", text: "Do you want to study Spanish with me?", voiceType: "male" as const },
  { speaker: "Zoey", text: "Yes!", voiceType: "female" as const },
  { speaker: "Mike", text: "Great! See you later!", voiceType: "male" as const },
  { speaker: "Zoey", text: "See you!", voiceType: "female" as const }
];

// Substitution practice 1
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu entendo meu colega de classe. / meu amigo / professor",
    base: "I understand my {0}.",
    options: ["classmate", "friend", "teacher"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Nós moramos aqui. / neste país / nesta cidade",
    base: "We live {0}.",
    options: ["here", "in this country", "in this city"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Eles preferem estudar sozinhos. / com você / comigo",
    base: "They prefer to study {0}.",
    options: ["alone", "with you", "with me"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Eu quero estudar inglês no exterior. / Nós / Eles",
    base: "{0} want to study English abroad.",
    options: ["I", "We", "They"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Elas falam italiano. E você? / alemão / português",
    base: "They speak {0}. And you?",
    options: ["Italian", "German", "Portuguese"],
    currentIndex: 0
  }
];

// Substitution practice 2
const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "Nós preferimos beber leite no café da manhã. / Eles / Eu",
    correctAnswer: "We prefer to drink milk for breakfast.",
    options: ["We", "They", "I"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Qual é o seu nome? / sobrenome / nome completo",
    correctAnswer: "What's {0}?",
    options: ["your name", "your last name", "your full name"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Elas não estudam na escola de manhã. / Nós / Eu",
    correctAnswer: "They don't study at school in the morning.",
    options: ["They", "We", "I"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Onde você mora? / estuda / quer estudar",
    correctAnswer: "Where do you {0}?",
    options: ["live", "study", "want to study"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "Você gosta de estudar nos Estados Unidos? / na Alemanha / no Brasil",
    correctAnswer: "Do you like to study {0}?",
    options: ["in the United States", "in Germany", "in Brazil"],
    currentIndex: 0
  }
];

// Negative exercises
const negativeExercises = [
  { key: "neg-1", sentence: "I want to live in this country.", answer: "I don't want to live in this country." },
  { key: "neg-2", sentence: "We speak Spanish at school.", answer: "We don't speak Spanish at school." },
  { key: "neg-3", sentence: "I understand that word.", answer: "I don't understand that word." },
  { key: "neg-4", sentence: "They like this city.", answer: "They don't like this city." },
  { key: "neg-5", sentence: "We want to live in the U.S.A.", answer: "We don't want to live in the U.S.A." },
  { key: "neg-6", sentence: "I speak this language.", answer: "I don't speak this language." }
];

// Affirmative exercises
const affirmativeExercises = [
  { key: "aff-1", sentence: "She doesn't understand that word.", answer: "She understands that word." },
  { key: "aff-2", sentence: "He doesn't study Italian in the afternoon.", answer: "He studies Italian in the afternoon." },
  { key: "aff-3", sentence: "They don't eat chicken sandwiches.", answer: "They eat chicken sandwiches." },
  { key: "aff-4", sentence: "We don't speak Spanish with our classmates.", answer: "We speak Spanish with our classmates." },
  { key: "aff-5", sentence: "It doesn't work properly.", answer: "It works properly." },
  { key: "aff-6", sentence: "You don't study German with your teacher.", answer: "You study German with your teacher." }
];

// Interrogative exercises
const interrogativeExercises = [
  { key: "int-1", sentence: "She lives in Brazil with her friend.", answer: "Does she live in Brazil with her friend?" },
  { key: "int-2", sentence: "They understand Spanish and Italian.", answer: "Do they understand Spanish and Italian?" },
  { key: "int-3", sentence: "He prefers to study in the morning.", answer: "Does he prefer to study in the morning?" },
  { key: "int-4", sentence: "You like to eat vegetables for lunch.", answer: "Do you like to eat vegetables for lunch?" },
  { key: "int-5", sentence: "We want to speak with your teacher.", answer: "Do we want to speak with your teacher?" },
  { key: "int-6", sentence: "It works very well.", answer: "Does it work very well?" }
];

// Unlock questions
const unlockQuestions = [
  { id: 1, question: "Where do you want to live?", placeholder: "Write about places where you want to live..." },
  { id: 2, question: "Which languages don't you understand?", placeholder: "List languages you don't understand and explain why..." },
  { id: 3, question: "How do you greet your friends?", placeholder: "Describe different ways you greet friends..." },
  { id: 4, question: "What do you like to eat for lunch and dinner?", placeholder: "Describe your favorite lunch and dinner foods..." }
];

// Video questions
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

// Dialogue line component with individual audio buttons
const DialogueLine = ({ speaker, text, voiceType }: { speaker: string; text: string; voiceType: "female" | "male" }) => {
  const speakLine = () => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
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
      
      const americanMaleVoices = voices.filter(voice => 
        (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) && 
        (voice.name.toLowerCase().includes('google us english male') ||
         voice.name === 'Google US English Male')
      );
      
      const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
      
      if (voiceType === "female" && americanFemaleVoices.length > 0) {
        utterance.voice = americanFemaleVoices[0];
      } else if (voiceType === "male" && americanMaleVoices.length > 0) {
        utterance.voice = americanMaleVoices[0];
      } else if (americanVoices.length > 0) {
        utterance.voice = americanVoices[0];
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`font-bold min-w-[70px] ${speaker === "Zoey" ? "text-pink-600" : "text-blue-600"}`}>
        {speaker}:
      </div>
      <div className="flex-1 flex items-center gap-3 flex-wrap">
        <span className="text-gray-800">{text}</span>
        <button
          onClick={speakLine}
          className="flex items-center gap-1 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors text-blue-700 text-sm"
        >
          <Volume2 size={14} />
          <span>Hear {speaker}</span>
        </button>
      </div>
    </div>
  );
};

// ============================================
// MAIN LESSON COMPONENT
// ============================================

export default function Lesson10LanguagesAndCountries() {
  const router = useRouter();
  
  // State for sections
  const [sections, setSections] = useState({
    talkToFriend: true,
    vocabulary: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    unlock: true,
    tuneIn: true
  });
  
  // State for exercises
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<string, string>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<string, boolean>>({});

  // Load saved answers
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson10Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setVideoAnswers(data.videoAnswers || {});
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    }
    
    // Initialize voices
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises,
      subs2Exercises,
      writtenAnswers,
      videoAnswers,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("lesson10Answers", JSON.stringify(data));
    alert("All answers saved successfully to your browser!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all your answers?")) {
      setWrittenAnswers({});
      setVideoAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setShowVideoAnswerResults({});
      localStorage.removeItem("lesson10Answers");
      alert("All answers cleared!");
    }
  };

  // Handlers
  const handleSubs1OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs1Exercises(prev => prev.map(exercise => 
      exercise.key === exerciseKey ? { ...exercise, currentIndex: optionIndex } : exercise
    ));
  };

  const handleSubs2OptionClick = (exerciseKey: string, optionIndex: number) => {
    setSubs2Exercises(prev => prev.map(exercise => 
      exercise.key === exerciseKey ? { ...exercise, currentIndex: optionIndex } : exercise
    ));
  };

  const handleWrittenAnswerChange = (key: string, value: string) => {
    setWrittenAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleVideoAnswerChange = (key: string, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
    
    // Pronounce the correct answer with American accent
    if (typeof window !== 'undefined' && !isCorrect) {
      const utterance = new SpeechSynthesisUtterance(correctAnswer);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      
      const voices = window.speechSynthesis.getVoices();
      const americanVoice = voices.find(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
      if (americanVoice) utterance.voice = americanVoice;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const checkVideoAnswer = (questionId: string) => {
    setShowVideoAnswerResults(prev => ({ ...prev, [questionId]: true }));
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2833&q=80')`,
        }}
      />
      <div className="fixed inset-0 bg-black bg-opacity-50 z-0" />
      
      <div className="relative z-10 max-w-5xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-[40px] p-6 md:p-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-4 md:mb-6">
            🌍 Lesson 10 – Languages & Countries
          </h1>
          <SpeakSentence text="Talk to your friend and practice conversations about languages, countries, and daily life. Improve your communication skills." voiceType="female">
            Talk to your friend and practice conversations about languages, countries, and daily life. Improve your communication skills.
          </SpeakSentence>
        </div>

        {/* TALK TO YOUR FRIEND - WITH INDIVIDUAL AMERICAN VOICES FOR MIKE AND ZOEY */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">💬 TALK TO YOUR FRIEND</h2>
              <button 
                onClick={() => toggleSection('talkToFriend')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.talkToFriend ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.talkToFriend && (
            <div className="p-6 md:p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-4">
                  Practice this conversation between Zoey and Mike:
                </h3>
                <p className="text-purple-600 text-sm mb-4 flex items-center gap-2">
                  <Volume2 size={14} /> Click the "Hear" button next to each line to listen to the American pronunciation
                </p>
                
                <div className="space-y-2 bg-white p-4 md:p-6 rounded-lg border border-purple-200">
                  {mainDialogue.map((line, index) => (
                    <DialogueLine 
                      key={index}
                      speaker={line.speaker}
                      text={line.text}
                      voiceType={line.voiceType}
                    />
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-700 flex items-center gap-2">
                    <span className="font-semibold">🎤 Voice Actors:</span>
                    <span className="text-pink-600">Zoey (American Female)</span>
                    <span> & </span>
                    <span className="text-blue-600">Mike (American Male)</span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VOCABULARY SECTION */}
        <div className="bg-blue-50/80 border-2 border-blue-200 rounded-xl shadow-sm mb-8 md:mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-3 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-lg font-bold">📘 VOCABULARY</h2>
              <button 
                onClick={() => toggleSection('vocabulary')}
                className="ml-3 p-1 rounded-full hover:bg-blue-600 transition"
              >
                {sections.vocabulary ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {sections.vocabulary && (
            <div className="p-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-3">
                  {vocabulary.map((item, index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg border border-blue-100 flex justify-between items-center">
                      <div>
                        <SpeakText text={item.word} voiceType="female" className="font-medium text-blue-700 text-sm">
                          {item.word}
                        </SpeakText>
                        <p className="text-gray-600 text-xs">{item.translation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE I */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button 
                onClick={() => toggleSection('substitution1')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-6 md:p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-green-800 mb-4">
                  ✍️ Substitution Practice I – Click on the options to change the sentences:
                </h3>
                
                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-green-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <SpeakSentence text={currentSentence} voiceType="female" className="text-green-700 font-medium">
                            {currentSentence}
                          </SpeakSentence>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs1OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                exercise.currentIndex === index
                                  ? 'bg-green-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <SpeakText text={option} voiceType="female">{option}</SpeakText>
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
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-6 md:p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-red-800 mb-4">
                  ⛔ Change into Negative – Transform to negative:
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <SpeakSentence text={exercise.sentence} voiceType="female" className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </SpeakSentence>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write negative form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[exercise.key] && (
                        <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE II */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-6 md:p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-orange-800 mb-4">
                  🔄 Substitution Practice II – Click to substitute:
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const baseSentence = exercise.correctAnswer.split(' ').map(word => {
                      const cleanWord = word.replace('.', '').replace('?', '');
                      return exercise.options.includes(cleanWord) ? '{0}' : word;
                    }).join(' ');
                    const currentSentence = baseSentence.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-orange-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-orange-50 rounded-md">
                          <SpeakSentence text={currentSentence} voiceType="female" className="text-orange-700 font-medium">
                            {currentSentence}
                          </SpeakSentence>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs2OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
                                exercise.currentIndex === index
                                  ? 'bg-orange-500 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <SpeakText text={option} voiceType="female">{option}</SpeakText>
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
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button 
                onClick={() => toggleSection('affirmative')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-6 md:p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-teal-800 mb-4">
                  Change into Affirmative – Transform to affirmative:
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <SpeakSentence text={exercise.sentence} voiceType="female" className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </SpeakSentence>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write affirmative form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[exercise.key] && (
                        <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-8 md:mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-6 md:p-8">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-indigo-800 mb-4">
                  Change into Interrogative – Transform to questions:
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-indigo-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <SpeakSentence text={exercise.sentence} voiceType="female" className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </SpeakSentence>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write question form..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 transition text-sm"
                        >
                          Check
                        </button>
                      </div>
                      
                      {showAnswerResults[exercise.key] && (
                        <AnswerResult isCorrect={answerResults[exercise.key]} correctAnswer={exercise.answer} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg overflow-hidden mb-8 md:mb-10">
          <div className="bg-pink-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🔓 UNLOCK</h2>
              <button 
                onClick={() => toggleSection('unlock')}
                className="ml-4 p-2 rounded-full hover:bg-pink-600 transition"
              >
                {sections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.unlock && (
            <div className="p-6 md:p-8">
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-bold text-pink-800 mb-4">
                  Unlock – Give examples of:
                </h3>
              </div>

              <div className="space-y-6">
                {unlockQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-pink-200 shadow-md">
                    <SpeakSentence text={question.question} voiceType="female" className="text-base md:text-lg font-bold text-pink-700 mb-3">
                      {question.question}
                    </SpeakSentence>
                    
                    <textarea
                      value={writtenAnswers[`unlock-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`unlock-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-pink-100 border-2 border-pink-300 rounded-xl p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-pink-800 mb-4">💡 Writing Tips for Communication:</h3>
                <ul className="list-disc pl-5 space-y-2 text-pink-700 text-sm">
                  <li>Be specific about places, languages, and foods</li>
                  <li>Use complete sentences to practice grammar</li>
                  <li>Describe your preferences and reasons</li>
                  <li>Practice different ways to greet people</li>
                  <li>Talk about your daily routines and habits</li>
                  <li>Save your answers to track your progress in communication</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-8 md:mb-10">
          <div className="bg-teal-500 text-white py-4 px-6 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl md:text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-6 md:p-8">
              <div className="mb-8 text-center">
                <SpeakSentence text="Watch the video and answer the questions below" voiceType="female" className="text-xl md:text-2xl font-bold text-teal-700 mb-4">
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

              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-4 md:p-6 rounded-xl border-2 border-teal-200 shadow-md">
                    <SpeakSentence text={question.question} voiceType="female" className="text-base md:text-lg font-bold text-teal-700 mb-3">
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

                    {showVideoAnswerResults[question.id] && question.isPersonal && (
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
              onClick={() => router.push("/cursos/lesson9")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 md:px-8 rounded-full transition-colors text-sm md:text-base"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson11")}
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