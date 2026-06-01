"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { 
  Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, 
  X, Check, XCircle, Download, MessageCircle, Coffee, 
  BookOpen, Briefcase, Utensils, Home, Tv, Smartphone, Users,
  Heart, Sun, Car, Music, Headphones, Target, TrendingUp, Clock,
  AlertCircle, Zap
} from "lucide-react";

// ============================================
// SPEECH SYSTEM WITH AMERICAN FEMALE VOICE (ZOEY'S VOICE)
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  asSpan?: boolean; // New prop to render as span instead of button
  style?: React.CSSProperties; // Added style prop
}

// Speech component for text-to-speech with American Female voice
const SpeakText = ({ text, children, className = "", asSpan = false, style }: SpeakTextProps) => {
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

  if (asSpan) {
    return (
      <span
        onClick={speak}
        className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
        title="Click to hear American pronunciation"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') speak(); }}
        style={style}
      >
        {children || text}
        <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
      </span>
    );
  }

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
      type="button"
      style={style}
    >
      {children || text}
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// Component for pronouncing entire sentences with American female voice
const SpeakSentence = ({ text, children, className = "", asSpan = false, style }: SpeakTextProps) => {
  const speak = () => {
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
  };

  if (asSpan) {
    return (
      <span
        onClick={speak}
        className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors ${className}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') speak(); }}
        style={style}
      >
        {children || text}
        <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
      </span>
    );
  }

  return (
    <button
      onClick={speak}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors ${className}`}
      type="button"
      style={style}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// ==============================
// CONFIGURAÇÃO DA LIÇÃO
// ==============================
const LESSON_NUMBER = 34;
const LESSON_TITLE = "Tune Your Ears";
const LESSON_SUBTITLE = "Slow Listening & Shadowing Practice";
const LESSON_THEME_COLOR = "#0ea5e9"; // Sky-500
const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
const LISTENING_IMAGE = "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

// ==============================
// KEY VOCABULARY FROM THE VIDEO
// ==============================
const keyVocabulary = [
  { english: "to maximize", portuguese: "maximizar", icon: Zap },
  { english: "myths", portuguese: "mitos", icon: AlertCircle },
  { english: "step by step", portuguese: "passo a passo", icon: TrendingUp },
  { english: "shadowing", portuguese: "técnica onde você repete após o professor para praticar estrutura e pronúncia", icon: Headphones },
  { english: "you need time", portuguese: "você precisa de tempo", icon: Clock },
  { english: "to understand", portuguese: "entender", icon: BookOpen },
  { english: "to grow", portuguese: "crescer", icon: TrendingUp },
  { english: "just keep going", portuguese: "apenas continue indo", icon: Target },
  { english: "to write down", portuguese: "escrever, anotar", icon: BookOpen },
  { english: "fuel", portuguese: "combustível", icon: Zap },
  { english: "the perfect time", portuguese: "a hora certa", icon: Clock },
  { english: "mood", portuguese: "humor, temperamento", icon: Sun },
  { english: "to set a timer", portuguese: "colocar um temporizador", icon: Clock }
];

// ==============================
// DADOS DA LIÇÃO - PRONÚNCIA (COM HE/SHE/IT)
// ==============================
const pronunciationItems = [
  { word: "milk", phrase: "I drink coffee with milk every morning.", example: "I have already drunk two cups of coffee today.", audio: "/audios/lesson34/milk.mp3", icon: Coffee },
  { word: "book", phrase: "I have read that book before.", example: "She has never read a book by that author.", audio: "/audios/lesson34/book.mp3", icon: BookOpen },
  { word: "homework", phrase: "I have already finished my homework.", example: "Have you done your homework yet?", audio: "/audios/lesson34/homework.mp3", icon: BookOpen },
  { word: "project", phrase: "We have been working on this project for three weeks.", example: "I will present the project tomorrow morning.", audio: "/audios/lesson34/project.mp3", icon: Briefcase },
  { word: "what", phrase: "What did you do last weekend?", example: "What have you learned so far in this course?", audio: "/audios/lesson34/what.mp3", icon: null },
  { word: "breakfast", phrase: "What did you eat for breakfast this morning?", example: "I have already had breakfast, thank you.", audio: "/audios/lesson34/breakfast.mp3", icon: Utensils },
  { word: "cup", phrase: "I would like a cup of hot tea, please.", example: "She has drunk three cups of coffee today.", audio: "/audios/lesson34/cup.mp3", icon: Coffee },
  { word: "soup", phrase: "Did you like the soup I made yesterday?", example: "I have never tried this type of soup before.", audio: "/audios/lesson34/soup.mp3", icon: Utensils },
  { word: "job", phrase: "Did you enjoy your previous job?", example: "I have worked at this company for five years now.", audio: "/audios/lesson34/job.mp3", icon: Briefcase },
  { word: "cab", phrase: "I took a cab to the airport yesterday.", example: "Have you ever taken a cab alone at night?", audio: "/audios/lesson34/cab.mp3", icon: null },
  { word: "food", phrase: "What kind of food did you eat when you were in Italy?", example: "I have never tasted such delicious food before.", audio: "/audios/lesson34/food.mp3", icon: Utensils },
  { word: "good", phrase: "That was a really good movie we watched last night.", example: "I have had a good feeling about this project since the beginning.", audio: "/audios/lesson34/good.mp3", icon: null },
  { word: "bad", phrase: "The weather was really bad when we arrived in London.", example: "I have never had such a bad experience at a restaurant.", audio: "/audios/lesson34/bad.mp3", icon: null },
  { word: "everything", phrase: "Did you remember to bring everything we need for the trip?", example: "I have already told you everything I know about this situation.", audio: "/audios/lesson34/everything.mp3", icon: null },
  { word: "thing", phrase: "The most important thing I have learned this year is patience.", example: "I will do the right thing when the time comes.", audio: "/audios/lesson34/thing.mp3", icon: null },
  { word: "he", phrase: "He has lived in New York since 2015.", example: "Did he call you back yesterday?", audio: "/audios/lesson34/he.mp3", icon: Users },
  { word: "she", phrase: "She has never traveled outside her country before.", example: "Where did she go after the meeting ended?", audio: "/audios/lesson34/she.mp3", icon: Music },
  { word: "it", phrase: "It has been raining all day long.", example: "Did it snow last winter in your city?", audio: "/audios/lesson34/it.mp3", icon: Sun },
  { word: "car", phrase: "I have never driven such an expensive car before.", example: "Did you sell your old car last month?", audio: "/audios/lesson34/car.mp3", icon: Car },
  { word: "loves", phrase: "She has always loved classical music since she was a child.", example: "Did he love the gift you gave him for his birthday?", audio: "/audios/lesson34/loves.mp3", icon: Heart },
];

// ==============================
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE I (WITH PAST, FUTURE, PRESENT PERFECT)
// ==============================
const substitutionPracticeI = [
  {
    id: 1,
    english: "I have already finished my homework.",
    portuguese: "Eu já terminei minha lição de casa.",
    substitutions: [
      { word: "have already finished", options: ["have already finished", "finished", "will finish"] },
      { word: "my homework", options: ["my homework", "my project", "my assignment"] }
    ],
    currentText: "I have already finished my homework."
  },
  {
    id: 2,
    english: "Did you visit your grandmother last weekend?",
    portuguese: "Você visitou sua avó no fim de semana passado?",
    substitutions: [
      { word: "last weekend", options: ["last weekend", "yesterday", "last month"] },
      { word: "your grandmother", options: ["your grandmother", "your parents", "your best friend"] }
    ],
    currentText: "Did you visit your grandmother last weekend?"
  },
  {
    id: 3,
    english: "She has never been to Europe before.",
    portuguese: "Ela nunca esteve na Europa antes.",
    substitutions: [
      { word: "She", options: ["She", "He", "They"] },
      { word: "Europe", options: ["Europe", "Asia", "South America"] }
    ],
    currentText: "She has never been to Europe before."
  },
  {
    id: 4,
    english: "We will start the meeting as soon as the manager arrives.",
    portuguese: "Nós começaremos a reunião assim que o gerente chegar.",
    substitutions: [
      { word: "the meeting", options: ["the meeting", "the presentation", "the workshop"] },
      { word: "as soon as", options: ["as soon as", "after", "before"] }
    ],
    currentText: "We will start the meeting as soon as the manager arrives."
  },
  {
    id: 5,
    english: "What did you learn in class yesterday?",
    portuguese: "O que você aprendeu na aula ontem?",
    substitutions: [
      { word: "in class", options: ["in class", "at work", "during the training"] },
      { word: "yesterday", options: ["yesterday", "last week", "on Tuesday"] }
    ],
    currentText: "What did you learn in class yesterday?"
  },
  {
    id: 6,
    english: "I will have finished this report by the end of the day.",
    portuguese: "Eu terei terminado este relatório até o final do dia.",
    substitutions: [
      { word: "this report", options: ["this report", "this presentation", "this proposal"] },
      { word: "by the end of the day", options: ["by the end of the day", "by tomorrow morning", "by Friday"] }
    ],
    currentText: "I will have finished this report by the end of the day."
  }
];

// ==============================
// DADOS DA LIÇÃO - SUBSTITUTION PRACTICE II
// ==============================
const substitutionPracticeII = [
  {
    id: 1,
    english: "Have you ever tried Japanese food before?",
    portuguese: "Você já experimentou comida japonesa antes?",
    substitutions: [
      { word: "Japanese food", options: ["Japanese food", "Mexican food", "Italian food"] },
      { word: "Have you ever", options: ["Have you ever", "Did you ever", "Will you ever"] }
    ],
    currentText: "Have you ever tried Japanese food before?"
  },
  {
    id: 2,
    english: "Where did you go after the party ended last Saturday?",
    portuguese: "Onde você foi depois que a festa terminou no sábado passado?",
    substitutions: [
      { word: "after the party ended", options: ["after the party ended", "when the movie finished", "after the game was over"] },
      { word: "last Saturday", options: ["last Saturday", "last Friday", "last Sunday"] }
    ],
    currentText: "Where did you go after the party ended last Saturday?"
  },
  {
    id: 3,
    english: "They will move to a new apartment next month.",
    portuguese: "Eles vão se mudar para um apartamento novo no próximo mês.",
    substitutions: [
      { word: "They", options: ["They", "We", "She and her husband"] },
      { word: "next month", options: ["next month", "next week", "next year"] }
    ],
    currentText: "They will move to a new apartment next month."
  },
  {
    id: 4,
    english: "I have known my best friend since we were in elementary school.",
    portuguese: "Eu conheço meu melhor amigo desde que estávamos no ensino fundamental.",
    substitutions: [
      { word: "my best friend", options: ["my best friend", "my colleague", "my neighbor"] },
      { word: "since we were", options: ["since we were", "since I was", "since she was"] }
    ],
    currentText: "I have known my best friend since we were in elementary school."
  },
  {
    id: 5,
    english: "How long did you wait for the bus this morning?",
    portuguese: "Quanto tempo você esperou pelo ônibus esta manhã?",
    substitutions: [
      { word: "for the bus", options: ["for the bus", "for the train", "for the taxi"] },
      { word: "this morning", options: ["this morning", "yesterday afternoon", "last night"] }
    ],
    currentText: "How long did you wait for the bus this morning?"
  },
  {
    id: 6,
    english: "She will call you back as soon as she finishes her meeting.",
    portuguese: "Ela vai te ligar de volta assim que terminar a reunião dela.",
    substitutions: [
      { word: "She", options: ["She", "my manager"] },
      { word: "her meeting", options: ["her meeting", "her presentation", "her appointment"] }
    ],
    currentText: "She will call you back as soon as she finishes her meeting."
  },
  {
    id: 7,
    english: "I have never seen such a beautiful sunset in my entire life.",
    portuguese: "Eu nunca vi um pôr do sol tão bonito em toda a minha vida.",
    substitutions: [
      { word: "such a beautiful sunset", options: ["such a beautiful sunset", "such an amazing view", "such a wonderful place"] },
      { word: "in my entire life", options: ["in my entire life", "in all my years", "since I was a child"] }
    ],
    currentText: "I have never seen such a beautiful sunset in my entire life."
  }
];

// ==============================
// DADOS DA LIÇÃO - AFFIRMATIVE PRACTICE (NEGATIVE TO AFFIRMATIVE)
// ==============================
const affirmativePractice = [
  {
    id: 1,
    english: "She hasn't finished her homework yet.",
    portuguese: "Ela ainda não terminou a lição de casa dela.",
    affirmative: "She has already finished her homework.",
    substitutions: [
      { word: "She", options: ["She", "Julia"] },
      { word: "her homework", options: ["her homework", "her project", "her assignment"] }
    ],
    currentText: "She hasn't finished her homework yet."
  },
  {
    id: 2,
    english: "They didn't enjoy the movie last night.",
    portuguese: "Eles não gostaram do filme ontem à noite.",
    affirmative: "They really enjoyed the movie last night.",
    substitutions: [
      { word: "They", options: ["They", "We"] },
      { word: "the movie", options: ["the movie", "the concert", "the play"] }
    ],
    currentText: "They didn't enjoy the movie last night."
  },
  {
    id: 3,
    english: "I won't be able to attend the conference tomorrow.",
    portuguese: "Eu não poderei assistir à conferência amanhã.",
    affirmative: "I will be able to attend the conference tomorrow.",
    substitutions: [
      { word: "the conference", options: ["the conference", "the workshop", "the seminar"] },
      { word: "tomorrow", options: ["tomorrow", "next week", "on Monday"] }
    ],
    currentText: "I won't be able to attend the conference tomorrow."
  },
  {
    id: 5,
    english: "We didn't see anything interesting at the museum.",
    portuguese: "Nós não vimos nada interessante no museu.",
    affirmative: "We saw many interesting things at the museum.",
    substitutions: [
      { word: "at the museum", options: ["at the museum", "at the art gallery", "at the exhibition"] },
      { word: "We", options: ["We", "They"] }
    ],
    currentText: "We didn't see anything interesting at the museum."
  }
];

// ==============================
// DADOS DA LIÇÃO - QUESTIONS (COM DID, WILL, PRESENT PERFECT)
// ==============================
const conversationQuestions = [
  { id: "a", question: "What did you do last weekend?", icon: Users },
  { id: "b", question: "Have you ever traveled to another country?", icon: Home },
  { id: "c", question: "Where will you go on your next vacation?", icon: Sun },
  { id: "d", question: "How long have you been studying English?", icon: BookOpen },
  { id: "e", question: "Did you watch any good movies recently?", icon: Tv },
  { id: "f", question: "What will you do after you finish this course?", icon: Target },
  { id: "g", question: "Have you ever met someone famous?", icon: Users },
  { id: "h", question: "What time did you wake up this morning?", icon: Clock },
  { id: "i", question: "Will you work in a different city in the future?", icon: Briefcase },
  { id: "j", question: "How many books have you read this year?", icon: BookOpen },
  { id: "k", question: "Did you enjoy your previous job?", icon: Briefcase },
  { id: "l", question: "What will you have for dinner tonight?", icon: Utensils },
  { id: "m", question: "Have you already finished all your tasks for today?", icon: Check },
];

// ==============================
// DADOS DA LIÇÃO - TUNE YOUR EARS (VÍDEO ATUALIZADO COM AS PERGUNTAS SOLICITADAS)
// ==============================
const tuneYourEarsVideo = {
  title: "TUNE IN YOUR EARS - English Listening Practice | Slow Listening & Shadowing",
  youtubeId: "uo-Ds9H_mNs",
  description: "Watch this video to practice slow listening and shadowing. Pay attention to the key vocabulary and answer the reflection questions below.",
  shadowingExplanation: "Shadowing is a technique where you repeat after your teacher to practice structure and pronunciation. Listen, pause, and repeat what you hear to improve your fluency and accent.",
  questions: [
    {
      id: 1,
      question: "How can you use your mistakes as your fuel?",
      correctAnswer: "By learning from them and using them as motivation to improve.",
      reflectionType: "personal"
    },
    {
      id: 2,
      question: "We know we can't wait for the perfect time, but how do you know you're good enough at English?",
      correctAnswer: "When you can communicate and understand without needing to translate everything.",
      reflectionType: "personal"
    },
    {
      id: 3,
      question: "How can you use a timer to help you with English?",
      correctAnswer: "By setting a timer to study for short, focused periods (like 15-25 minutes) every day.",
      reflectionType: "personal"
    },
    {
      id: 4,
      question: "Do you think your progress is slow? Why or why not?",
      correctAnswer: "This is a personal reflection question. Be honest about your learning journey.",
      reflectionType: "personal"
    },
    {
      id: 5,
      question: "Do you think progress is only slow in life, or when it's real progress it's fast?",
      correctAnswer: "Real progress can feel slow because it's steady and consistent. Fast progress often doesn't last.",
      reflectionType: "personal"
    },
    {
      id: 6,
      question: "Do you see learning a language as a journey or a long walk? Explain.",
      correctAnswer: "Both are good metaphors. A journey suggests destinations and goals; a long walk suggests daily effort and patience.",
      reflectionType: "personal"
    },
    {
      id: 7,
      question: "What's your biggest goal with English?",
      correctAnswer: "This is personal. It could be traveling, getting a job, making friends, or understanding movies.",
      reflectionType: "personal"
    }
  ]
};

// ==============================
// COMPONENTE AUXILIAR: PLAYER DE ÁUDIO
// ==============================
interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

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

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button 
        onClick={togglePlayPause} 
        className={`${compact ? "p-1" : "p-2"} text-white rounded-full hover:opacity-90 transition-all`}
        style={{ backgroundColor: LESSON_THEME_COLOR }}
        type="button"
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-all`}
        type="button"
      >
        <RotateCcw size={compact ? 12 : 16} />
      </button>
      
      {!compact && (
        <div className="w-20 h-1 bg-gray-300 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-200" 
            style={{ width: `${progress}%`, backgroundColor: LESSON_THEME_COLOR }} 
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

// ==============================
// COMPONENTE: ANSWER RESULT
// ==============================
interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
  isReflection?: boolean;
}

const AnswerResult = ({ isCorrect, correctAnswer, isReflection = false }: AnswerResultProps) => {
  return (
    <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border-green-300' : 'bg-blue-100 border-blue-300'} border-2`}>
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <Check className="text-green-600 flex-shrink-0" size={24} />
        ) : (
          <div className="text-blue-600 flex-shrink-0">💡</div>
        )}
        <div>
          <p className={`font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-blue-700'}`}>
            {isCorrect ? 'Great answer!' : 'Reflection Note'}
          </p>
          {!isCorrect && !isReflection && (
            <p className="text-gray-700">
              <span className="font-medium">Suggested answer:</span> {correctAnswer}
            </p>
          )}
          {isReflection && (
            <p className="text-gray-700 text-sm">
              This is a personal reflection. Think about your own experience.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE DE SUBSTITUIÇÃO INTERATIVA
// ==============================
interface SubstitutionExerciseProps {
  exercise: any;
  onUpdate: (id: number, newText: string) => void;
}

const SubstitutionExercise = ({ exercise, onUpdate }: SubstitutionExerciseProps) => {
  const [currentText, setCurrentText] = useState(exercise.currentText || exercise.english);
  const [showPortuguese, setShowPortuguese] = useState(false);

  const handleSubstitution = (oldWord: string, newWord: string) => {
    let newText = currentText;
    
    // Handle specific word replacements
    if (oldWord === "have already finished" && newWord === "finished") {
      newText = newText.replace(/have already finished/i, "finished");
    } else if (oldWord === "have already finished" && newWord === "will finish") {
      newText = newText.replace(/have already finished/i, "will finish");
    } else if (oldWord === "Have you ever" && newWord === "Did you ever") {
      newText = newText.replace(/Have you ever/i, "Did you ever");
    } else if (oldWord === "Have you ever" && newWord === "Will you ever") {
      newText = newText.replace(/Have you ever/i, "Will you ever");
    } else if (oldWord === "since we were" && newWord === "since I was") {
      newText = newText.replace(/since we were/i, "since I was");
    } else if (oldWord === "since we were" && newWord === "since she was") {
      newText = newText.replace(/since we were/i, "since she was");
    } else {
      const regex = new RegExp(`\\b${oldWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      newText = newText.replace(regex, newWord);
    }

    setCurrentText(newText);
    onUpdate(exercise.id, newText);
  };

  const getCurrentWord = (subOption: any) => {
    const words = currentText.split(/\s+/);
    for (const word of words) {
      const cleanWord = word.replace(/[!?.,;:]$/, '');
      for (const opt of subOption.options) {
        if (cleanWord.toLowerCase() === opt.toLowerCase()) {
          return opt;
        }
      }
    }
    for (const opt of subOption.options) {
      if (currentText.toLowerCase().includes(opt.toLowerCase())) {
        return opt;
      }
    }
    return subOption.options[0];
  };

  const resetToOriginal = () => {
    const originalText = exercise.currentText || exercise.english;
    setCurrentText(originalText);
    onUpdate(exercise.id, originalText);
  };

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex justify-between items-start mb-3">
        <button
          onClick={() => setShowPortuguese(!showPortuguese)}
          className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
          type="button"
        >
          {showPortuguese ? "🇧🇷" : "🇺🇸"} {showPortuguese ? "Português" : "English"}
        </button>
        <button
          onClick={resetToOriginal}
          className="text-sm px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition flex items-center gap-1"
          title="Reset to original sentence"
          type="button"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <div className="mb-4">
        {/* Using asSpan=true to avoid button inside button */}
        <SpeakSentence text={currentText} className="text-2xl font-bold text-gray-800 mb-2 block" asSpan>
          {currentText}
        </SpeakSentence>
        {showPortuguese && (
          <p className="text-lg text-gray-600 italic border-l-4 pl-3" 
             style={{ borderColor: LESSON_THEME_COLOR }}>
            {exercise.portuguese}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {exercise.substitutions.map((sub: any, idx: number) => {
          const currentWord = getCurrentWord(sub);
          return (
            <div key={idx} className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-600">Replace "{currentWord}":</span>
              <div className="flex flex-wrap gap-2">
                {sub.options.map((option: string, optIdx: number) => (
                  <button
                    key={optIdx}
                    onClick={() => handleSubstitution(currentWord, option)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                      currentWord === option 
                        ? 'bg-opacity-20 text-white cursor-default' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    style={currentWord === option ? { backgroundColor: LESSON_THEME_COLOR, color: 'white' } : {}}
                    disabled={currentWord === option}
                    type="button"
                  >
                    {/* Using asSpan=true for nested SpeakText */}
                    <SpeakText text={option} className="inline" asSpan>
                      {option}
                    </SpeakText>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-400 border-t pt-2">
        💡 Tip: Click on any option to replace the highlighted word in the sentence.
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE DE PERGUNTA INTERATIVA
// ==============================
interface InteractiveQuestionProps {
  id: string;
  question: string;
  icon: any;
  value: string;
  onChange: (id: string, value: string) => void;
  onClear: (id: string) => void;
}

const InteractiveQuestion = ({ id, question, icon: Icon, value, onChange, onClear }: InteractiveQuestionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.borderColor = `${LESSON_THEME_COLOR}30`;
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border-2 border-opacity-50 shadow-md hover:shadow-lg transition-all"
         style={{ borderColor: `${LESSON_THEME_COLOR}40` }}>
      
      <div className="flex items-start gap-3 mb-4">
        {Icon && <Icon className="mt-1" style={{ color: LESSON_THEME_COLOR }} size={24} />}
        <h4 className="text-lg font-medium text-gray-800 flex-1">
          <span className="font-bold mr-2" style={{ color: LESSON_THEME_COLOR }}>{id}.</span>
          {/* Using asSpan=true to avoid button nesting */}
          <SpeakSentence text={question} asSpan>{question}</SpeakSentence>
        </h4>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder="Type your answer here..."
        className="w-full h-24 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none transition resize-none"
        style={{ 
          borderColor: `${LESSON_THEME_COLOR}30`
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = LESSON_THEME_COLOR;
          e.currentTarget.style.boxShadow = `0 0 0 2px ${LESSON_THEME_COLOR}20`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = `${LESSON_THEME_COLOR}30`;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />

      <div className="flex justify-end mt-3">
        <button
          onClick={() => onClear(id)}
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition flex items-center gap-2"
          type="button"
        >
          <X size={16} /> Clear
        </button>
      </div>
    </div>
  );
};

// ==============================
// COMPONENTE PRINCIPAL
// ==============================
export default function Lesson34TuneYourEars() {
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    pronunciation: true,
    substitution1: true,
    substitution2: true,
    affirmative: true,
    questions: true,
    tuneYourEars: true
  });

  const [substitution1Texts, setSubstitution1Texts] = useState<Record<number, string>>({});
  const [substitution2Texts, setSubstitution2Texts] = useState<Record<number, string>>({});
  const [affirmativeTexts, setAffirmativeTexts] = useState<Record<number, string>>({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, string>>({});
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<Record<string, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubstitution1Update = (id: number, newText: string) => {
    setSubstitution1Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleSubstitution2Update = (id: number, newText: string) => {
    setSubstitution2Texts(prev => ({ ...prev, [id]: newText }));
  };

  const handleAffirmativeUpdate = (id: number, newText: string) => {
    setAffirmativeTexts(prev => ({ ...prev, [id]: newText }));
  };

  const handleQuestionChange = (id: string, value: string) => {
    setQuestionAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
  };

  const clearQuestion = (id: string) => {
    setQuestionAnswers(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const clearVideoAnswer = (id: number) => {
    setVideoAnswers(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
    setShowResults(prev => ({ ...prev, [`video-${id}`]: false }));
  };

  const checkVideoAnswer = (id: number, userAnswer: string, correctAnswer: string, isReflection: boolean = false) => {
    if (isReflection) {
      setAnswerCorrectness(prev => ({ ...prev, [`video-${id}`]: true }));
      setShowResults(prev => ({ ...prev, [`video-${id}`]: true }));
      return true;
    }
    
    const normalizedUser = userAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    const normalizedCorrect = correctAnswer.toLowerCase().trim().replace(/[.,]/g, '');
    
    const isCorrect = normalizedUser === normalizedCorrect || 
      (normalizedUser.length > 10 && normalizedCorrect.includes(normalizedUser.substring(0, 20)));
    
    setAnswerCorrectness(prev => ({ ...prev, [`video-${id}`]: isCorrect }));
    setShowResults(prev => ({ ...prev, [`video-${id}`]: true }));
    
    return isCorrect;
  };

  const saveAllAnswers = () => {
    const allData = {
      substitution1Texts,
      substitution2Texts,
      affirmativeTexts,
      questionAnswers,
      videoAnswers,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem(`lesson${LESSON_NUMBER}_answers`, JSON.stringify(allData));
    alert("All your answers have been saved locally!");
  };

  const exportToPDF = () => {
    alert("PDF export functionality would be implemented here. For now, your answers are saved in your browser.");
  };

  const shareOnWhatsApp = () => {
    const text = `I just completed Lesson ${LESSON_NUMBER}: ${LESSON_TITLE} - ${LESSON_SUBTITLE}! Check out my progress.`;
    const url = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers? This action cannot be undone.")) {
      setSubstitution1Texts({});
      setSubstitution2Texts({});
      setAffirmativeTexts({});
      setQuestionAnswers({});
      setVideoAnswers({});
      setShowResults({});
      setAnswerCorrectness({});
      alert("All answers have been cleared.");
    }
  };

  // Initialize voices on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  return (
    <div className="min-h-screen py-16 px-4 md:px-6 bg-cover bg-center bg-fixed relative"
         style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      
      <div className="relative max-w-6xl mx-auto bg-white bg-opacity-95 rounded-3xl p-6 md:p-10 shadow-2xl">
        
        {/* CABEÇALHO DA LIÇÃO */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 rounded-full mb-4" style={{ backgroundColor: `${LESSON_THEME_COLOR}20` }}>
            <Headphones size={48} style={{ color: LESSON_THEME_COLOR }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: LESSON_THEME_COLOR }}>
            LESSON {LESSON_NUMBER}
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-800">{LESSON_TITLE}</h2>
          <h3 className="text-xl text-gray-600 mb-4">{LESSON_SUBTITLE}</h3>
          <SpeakSentence text="Practice slow listening, shadowing technique, and reflect on your English learning journey." className="text-xl text-gray-700 max-w-3xl mx-auto" asSpan>
            Practice slow listening, shadowing technique, and reflect on your English learning journey.
          </SpeakSentence>
          
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow-lg"
              type="button"
            >
              <Check size={20} /> Save Progress
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-lg"
              type="button"
            >
              <Download size={20} /> Export as PDF
            </button>
            <button
              onClick={shareOnWhatsApp}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition shadow-lg"
              type="button"
            >
              <MessageCircle size={20} /> Share on WhatsApp
            </button>
          </div>
        </div>

        {/* SEÇÃO 1: IMPROVE YOUR PRONUNCIATION */}
        <div className="mb-16 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
          <div className="py-5 px-8 flex justify-between items-center"
               style={{ background: `linear-gradient(135deg, ${LESSON_THEME_COLOR}, ${LESSON_THEME_COLOR}dd)` }}>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Volume2 size={24} /> IMPROVE YOUR PRONUNCIATION
            </h2>
            <button 
              onClick={() => toggleSection('pronunciation')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.pronunciation ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.pronunciation && (
            <div className="p-8">
              <div className="mb-10 rounded-2xl overflow-hidden shadow-xl relative">
                <div className="relative w-full h-72 md:h-96">
                  <Image
                    src={LISTENING_IMAGE}
                    alt="Listening Practice"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-8">
                    <div>
                      <h3 className="text-white text-3xl md:text-4xl font-bold mb-2">Practice These Words</h3>
                      <p className="text-white/90 text-lg">Click on the audio buttons to hear the pronunciation</p>
                    </div>
                  </div>
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Coffee className="text-amber-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><BookOpen className="text-blue-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Utensils className="text-red-600" size={20} /></span>
                    <span className="bg-white/90 p-2 rounded-full shadow-lg"><Briefcase className="text-purple-600" size={20} /></span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pronunciationItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="bg-white p-5 rounded-xl border-2 shadow-md hover:shadow-lg transition-all"
                         style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={20} style={{ color: LESSON_THEME_COLOR }} />}
                          {/* Fixed: style is now passed correctly */}
                          <SpeakText text={item.word} className="text-xl font-bold" asSpan style={{ color: LESSON_THEME_COLOR }}>
                            {item.word}
                          </SpeakText>
                        </div>
                        <AudioPlayer src={item.audio} compact />
                      </div>
                      {/* Using asSpan to avoid button nesting */}
                      <SpeakSentence text={item.phrase} className="text-gray-700 mb-1 font-medium block" asSpan>
                        {item.phrase}
                      </SpeakSentence>
                      <p className="text-gray-500 italic text-sm border-l-2 pl-2 mt-1" style={{ borderColor: LESSON_THEME_COLOR }}>
                        {item.example}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 2: SUBSTITUTION PRACTICE I (WITH PAST, FUTURE, PRESENT PERFECT) */}
        <div className="mb-16 bg-gradient-to-br from-purple-50 to-pink-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#a855f7" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-purple-500 to-pink-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔄 SUBSTITUTION PRACTICE I
            </h2>
            <button 
              onClick={() => toggleSection('substitution1')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.substitution1 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.substitution1 && (
            <div className="p-8">
              <SpeakSentence text="Practice with Present Perfect, Past Simple (DID), and Future (WILL). Click on any option to replace the highlighted word." className="text-purple-700 mb-6 italic block" asSpan>
                Practice with Present Perfect, Past Simple (DID), and Future (WILL). Click on any option to replace the highlighted word.
              </SpeakSentence>
              <div className="space-y-6">
                {substitutionPracticeI.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleSubstitution1Update}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 3: SUBSTITUTION PRACTICE II */}
        <div className="mb-16 bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#10b981" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🔄 SUBSTITUTION PRACTICE II
            </h2>
            <button 
              onClick={() => toggleSection('substitution2')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.substitution2 ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.substitution2 && (
            <div className="p-8">
              <SpeakSentence text="Continue practicing with more complex sentences using different tenses." className="text-green-700 mb-6 italic block" asSpan>
                Continue practicing with more complex sentences using different tenses.
              </SpeakSentence>
              <div className="space-y-6">
                {substitutionPracticeII.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleSubstitution2Update}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 4: AFFIRMATIVE PRACTICE */}
        <div className="mb-16 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#f59e0b" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-yellow-500 to-amber-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              ➕ AFFIRMATIVE PRACTICE
            </h2>
            <button 
              onClick={() => toggleSection('affirmative')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.affirmative ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.affirmative && (
            <div className="p-8">
              <SpeakSentence text="Transform these negative sentences into affirmative sentences by replacing words." className="text-amber-700 mb-6 italic block" asSpan>
                Transform these negative sentences into affirmative sentences by replacing words.
              </SpeakSentence>
              <div className="space-y-6">
                {affirmativePractice.map((exercise) => (
                  <SubstitutionExercise
                    key={exercise.id}
                    exercise={exercise}
                    onUpdate={handleAffirmativeUpdate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 5: CONVERSATION QUESTIONS (WITH DID, WILL, PRESENT PERFECT) */}
        <div className="mb-16 bg-gradient-to-br from-indigo-50 to-violet-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#6366f1" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-indigo-500 to-violet-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              💬 QUESTIONS
            </h2>
            <button 
              onClick={() => toggleSection('questions')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.questions ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.questions && (
            <div className="p-8">
              <SpeakSentence text="Practice answering these questions using Past Simple (DID), Present Perfect, and Future (WILL)." className="text-indigo-700 mb-6 italic block" asSpan>
                Practice answering these questions using Past Simple (DID), Present Perfect, and Future (WILL).
              </SpeakSentence>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conversationQuestions.map((item) => (
                  <InteractiveQuestion
                    key={item.id}
                    id={item.id}
                    question={item.question}
                    icon={item.icon}
                    value={questionAnswers[item.id] || ""}
                    onChange={handleQuestionChange}
                    onClear={clearQuestion}
                  />
                ))}
              </div>
              
              <div className="mt-8 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 💡 Tips for Answering:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700">
                  <li>Use Past Simple (DID) for completed past actions: "I went to the beach last weekend."</li>
                  <li>Use Present Perfect for experiences: "I have visited Japan twice."</li>
                  <li>Use Future (WILL) for predictions and plans: "I will travel to Europe next year."</li>
                  <li>Be honest about your own experiences</li>
                  <li>Practice saying your answers out loud</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* SEÇÃO 6: TUNE IN YOUR EARS */}
        <div className="mb-16 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 rounded-3xl shadow-lg overflow-hidden"
             style={{ borderColor: "#06b6d4" }}>
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🎧 TUNE IN YOUR EARS
            </h2>
            <button 
              onClick={() => toggleSection('tuneYourEars')}
              className="p-2 rounded-full hover:bg-white/20 transition"
              type="button"
            >
              {expandedSections.tuneYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {expandedSections.tuneYourEars && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneYourEarsVideo.title}
                </h3>
                <SpeakSentence text={tuneYourEarsVideo.description} className="text-cyan-600 mb-6 block" asSpan>
                  {tuneYourEarsVideo.description}
                </SpeakSentence>
                
                {/* SHADOWING EXPLANATION */}
                <div className="bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6 mb-8 text-left">
                  <h4 className="text-lg font-bold text-cyan-800 mb-2 flex items-center gap-2">
                    <Headphones size={20} /> What is Shadowing?
                  </h4>
                  <SpeakSentence text={tuneYourEarsVideo.shadowingExplanation} className="text-cyan-700 block" asSpan>
                    {tuneYourEarsVideo.shadowingExplanation}
                  </SpeakSentence>
                  <SpeakSentence text="How to practice: Listen to a short phrase → Pause the video → Repeat exactly what you heard → Focus on rhythm and intonation" className="text-cyan-600 text-sm mt-2 italic block" asSpan>
                    How to practice: Listen to a short phrase → Pause the video → Repeat exactly what you heard → Focus on rhythm and intonation
                  </SpeakSentence>
                </div>
                
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneYourEarsVideo.youtubeId}`}
                      title={tuneYourEarsVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>

              {/* KEY VOCABULARY FROM THE VIDEO */}
              <div className="mb-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <BookOpen size={20} /> 📖 Key Vocabulary from the Video:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {keyVocabulary.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-all">
                        <div className="flex items-center gap-2">
                          {Icon && <Icon size={16} style={{ color: LESSON_THEME_COLOR }} />}
                          <SpeakText text={item.english} className="font-medium text-cyan-700" asSpan>
                            {item.english}
                          </SpeakText>
                        </div>
                        <span className="text-cyan-600 text-sm">{item.portuguese}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* REFLECTION QUESTIONS */}
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-center text-cyan-700">Reflection Questions</h3>
                <SpeakSentence text="Answer these questions honestly to reflect on your English learning journey." className="text-center text-gray-600 -mt-4 block" asSpan>
                  Answer these questions honestly to reflect on your English learning journey.
                </SpeakSentence>
                
                {tuneYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md"
                       style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: LESSON_THEME_COLOR }}>
                      <SpeakSentence text={`Question ${q.id}: ${q.question}`} asSpan>
                        Question {q.id}: {q.question}
                      </SpeakSentence>
                    </h4>

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your reflection here... (There is no wrong answer - be honest with yourself)"
                      className="w-full h-32 p-4 border-2 rounded-lg focus:ring-2 focus:outline-none transition resize-none"
                      style={{ borderColor: `${LESSON_THEME_COLOR}30` }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = LESSON_THEME_COLOR;
                        e.currentTarget.style.boxShadow = `0 0 0 2px ${LESSON_THEME_COLOR}20`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = `${LESSON_THEME_COLOR}30`;
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer, q.reflectionType === "personal")}
                        className="text-white px-6 py-2 rounded-lg transition font-medium hover:opacity-90"
                        style={{ backgroundColor: LESSON_THEME_COLOR }}
                        type="button"
                      >
                        Check / Reflect
                      </button>
                      <button
                        onClick={() => clearVideoAnswer(q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition font-medium"
                        type="button"
                      >
                        Clear
                      </button>
                    </div>

                    {showResults[`video-${q.id}`] && (
                      <div className="mt-4">
                        <AnswerResult 
                          isCorrect={answerCorrectness[`video-${q.id}`] || false} 
                          correctAnswer={q.correctAnswer}
                          isReflection={q.reflectionType === "personal"}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <Headphones size={20} /> 🎯 Listening & Shadowing Tips:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-cyan-700">
                  <SpeakSentence text="Listen first without looking at the questions" className="block" asSpan>Listen first without looking at the questions</SpeakSentence>
                  <SpeakSentence text="Practice shadowing: pause after each sentence and repeat" className="block" asSpan>Practice shadowing: pause after each sentence and repeat</SpeakSentence>
                  <SpeakSentence text="Use your mistakes as fuel - learn from them" className="block" asSpan>Use your mistakes as fuel - learn from them</SpeakSentence>
                  <SpeakSentence text="Set a timer for daily practice (15-25 minutes is enough)" className="block" asSpan>Set a timer for daily practice (15-25 minutes is enough)</SpeakSentence>
                  <SpeakSentence text="Remember: progress happens step by step, not overnight" className="block" asSpan>Remember: progress happens step by step, not overnight</SpeakSentence>
                  <SpeakSentence text="Write down new vocabulary and review it regularly" className="block" asSpan>Write down new vocabulary and review it regularly</SpeakSentence>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ E NAVEGAÇÃO */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium shadow-md"
              type="button"
            >
              <Check size={20} /> Save All Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium shadow-md"
              type="button"
            >
              <X size={20} /> Clear All
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson33")}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition font-medium shadow-md"
              type="button"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push(`/cursos/lesson${LESSON_NUMBER + 1}`)}
              className="px-6 py-3 text-white rounded-full transition font-medium shadow-md"
              style={{ backgroundColor: LESSON_THEME_COLOR }}
              type="button"
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} - {LESSON_SUBTITLE} • Interactive English Practice • All answers are saved in your browser</p>
          <SpeakSentence text="Remember: Tune your ears, practice shadowing, and keep going step by step!" className="mt-1" asSpan>
            🎧 Remember: Tune your ears, practice shadowing, and keep going step by step!
          </SpeakSentence>
        </div>
      </div>
    </div>
  );
}