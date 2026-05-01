"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle, ArrowLeft, ArrowRight, Send } from "lucide-react";

// ============================================
// LESSON 56 - ABILITIES & COMPARISONS (CAN / CAN'T / DOES / DOESN'T / WOULD)
// Theme: Expressing abilities, preferences, and hypothetical situations
// Level: B1 - Intermediate
// ============================================

// ============================================
// KEY VOCABULARY
// ============================================
const keyVocabulary = [
  { english: "Ability", portuguese: "habilidade" },
  { english: "Skill", portuguese: "competência" },
  { english: "Talent", portuguese: "talento" },
  { english: "To be able to", portuguese: "ser capaz de" },
  { english: "Preference", portuguese: "preferência" },
  { english: "Hypothetical situation", portuguese: "situação hipotética" },
  { english: "Polite offer", portuguese: "oferta educada" },
  { english: "Routine", portuguese: "rotina" },
  { english: "Habit", portuguese: "hábito" },
  { english: "Comparison", portuguese: "comparação" },
  { english: "Cuisine", portuguese: "culinária" },
  { english: "Instrument", portuguese: "instrumento" },
  { english: "Outdoor activity", portuguese: "atividade ao ar livre" },
  { english: "Barista", portuguese: "barista" },
  { english: "Culture", portuguese: "cultura" },
  { english: "polite", portuguese: "educado(a)" },
  { english: "Please, leave", portuguese: "Por favor, saia" },
  { english: "beginning", portuguese: "começo" },
  { english: "request", portuguese: "solicitação" },
  { english: "warning", portuguese: "aviso" },
  { english: "hallway", portuguese: "corredor" },
  { english: "Greetings", portuguese: "saudações" },
  { english: "Politeness", portuguese: "educação" },
  { english: "reply", portuguese: "comentário" },
  { english: "grateful", portuguese: "grato(a)" },
  { english: "kind action", portuguese: "ação gentil" },
  { english: "speech", portuguese: "fala" }
];

// ============================================
// GRAMMAR EXPLANATION - Can / Can't / Does / Doesn't / Would
// ============================================
const grammarExplanation = {
  title: "Expressing Abilities, Preferences & Hypothetical Situations",
  explanation: "Use CAN/CAN'T to talk about abilities, DOES/DOESN'T for third-person routines, and WOULD for polite offers and hypothetical situations.",
  structures: [
    { name: "Ability (Present)", pattern: "Subject + can/can't + verb", example: "She can cook Italian food." },
    { name: "Third Person Routine", pattern: "Subject + does/doesn't + verb", example: "He doesn't play basketball on Sundays." },
    { name: "Hypothetical / Polite", pattern: "Would you like to...? / I would + verb", example: "Would you like to go for a walk?" }
  ],
  examples: [
    "I can swim, but I can't play the guitar.",
    "She doesn't eat meat on Fridays.",
    "He does his homework every evening.",
    "Would you like to join us for dinner?",
    "I would travel more if I had time."
  ]
};

// ============================================
// FLUENCY IMAGES - 15 IMAGES WITH DESCRIPTIONS
// ============================================
const fluencyImages = [
  { id: 1, prompt: "cook / swim", image: "https://images.unsplash.com/photo-1556910104-6d2b6a8c9a5a?q=80&w=2070&auto=format&fit=crop", alt: "Person cooking food", keyword: "cooking", action: "cook", contrast: "swim" },
  { id: 2, prompt: "play basketball / ride bike", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=2090&auto=format&fit=crop", alt: "Person playing basketball", keyword: "basketball", action: "play basketball", contrast: "ride a bike" },
  { id: 3, prompt: "eat sushi / cook it", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=2070&auto=format&fit=crop", alt: "Sushi on plate", keyword: "sushi", action: "eat sushi", contrast: "cook it" },
  { id: 4, prompt: "run / play guitar", image: "https://images.unsplash.com/photo-1486218119243-13883505764c?q=80&w=2072&auto=format&fit=crop", alt: "Person running", keyword: "running", action: "run", contrast: "play the guitar" },
  { id: 5, prompt: "speak Italian / speak Spanish", image: "https://images.unsplash.com/photo-1524230572898-12dfef0b9786?q=80&w=1974&auto=format&fit=crop", alt: "Italian flag", keyword: "Italian", action: "speak Italian", contrast: "speak Spanish" },
  { id: 6, prompt: "play drums / play guitar", image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=2070&auto=format&fit=crop", alt: "Person playing drums", keyword: "drums", action: "play the drums", contrast: "play the guitar" },
  { id: 7, prompt: "make coffee / make tea", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1974&auto=format&fit=crop", alt: "Barista making coffee", keyword: "coffee", action: "make coffee", contrast: "make tea" },
  { id: 8, prompt: "swim / play soccer", image: "https://images.unsplash.com/photo-1438029071396-1e831a7fa6d8?q=80&w=2073&auto=format&fit=crop", alt: "Person swimming", keyword: "swimming", action: "swim", contrast: "play soccer" },
  { id: 9, prompt: "eat hamburger / eat salad", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1899&auto=format&fit=crop", alt: "Hamburger and fries", keyword: "hamburger", action: "eat hamburgers", contrast: "eat salad" },
  { id: 10, prompt: "walk in nature / run in city", image: "https://images.unsplash.com/photo-1445308394109-4ec2920981b1?q=80&w=1974&auto=format&fit=crop", alt: "Person walking in nature", keyword: "walking", action: "walk in nature", contrast: "run in the city" },
  { id: 11, prompt: "play guitar / sing", image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop", alt: "Person playing guitar", keyword: "guitar", action: "play the guitar", contrast: "sing" },
  { id: 12, prompt: "hang out with friends / stay home", image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop", alt: "Friends outdoor activity", keyword: "friends", action: "hang out with friends", contrast: "stay at home" },
  { id: 13, prompt: "cook pasta / cook rice", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2065&auto=format&fit=crop", alt: "Table with food", keyword: "cooking", action: "cook pasta", contrast: "cook rice" },
  { id: 14, prompt: "speak Spanish / speak French", image: "https://images.unsplash.com/photo-1520962922320-2038eebab146?q=80&w=2076&auto=format&fit=crop", alt: "Spanish flag", keyword: "Spanish", action: "speak Spanish", contrast: "speak French" },
  { id: 15, prompt: "play tennis / play volleyball", image: "https://images.unsplash.com/photo-1622279458906-4050f6c6b2e9?q=80&w=1974&auto=format&fit=crop", alt: "People playing tennis", keyword: "tennis", action: "play tennis", contrast: "play volleyball" }
];

// ============================================
// SUBSTITUTION PRACTICE I - WITH TRANSLATIONS
// ============================================
const substitutionPractice1 = [
  { key: "sub1-1", original: "Ele está tocando violão com o irmão dele.", base: "He is playing the {0} with his brother.", options: ["guitar", "flute", "piano"], currentIndex: 0 },
  { key: "sub1-2", original: "Elas estão jogando vôlei no parque.", base: "They are playing {0} at the park.", options: ["volleyball", "soccer", "basketball"], currentIndex: 0 },
  { key: "sub1-3", original: "Nós não corremos de manhã.", base: "We don't run in the {0}.", options: ["morning", "evening", "afternoon"], currentIndex: 0 },
  { key: "sub1-4", original: "Ela toca flauta e piano.", base: "She plays the {0} and the {1}.", options: [["flute", "piano"], ["drums", "keyboard"], ["violin", "guitar"]], currentIndex: 0, isMulti: true },
  { key: "sub1-5", original: "Ele pode jogar vôlei na escola.", base: "He can play volleyball {0}.", options: ["at school", "at the park", "on the street"], currentIndex: 0 }
];

// ============================================
// SUBSTITUTION PRACTICE II - WITH MODALS (CAN / CAN'T / WOULD)
// ============================================
const substitutionPractice2 = [
  { key: "sub2-1", original: "Nós podemos vender algumas roupas na venda de garagem.", base: "We can sell some {0} at the garage sale.", options: ["clothes", "shoes", "items"], currentIndex: 0 },
  { key: "sub2-2", original: "Ela não pode limpar a casa na sexta-feira.", base: "She can't clean the house on {0}.", options: ["Friday", "Saturday", "Sunday"], currentIndex: 0 },
  { key: "sub2-3", original: "Elas não conseguem correr juntas.", base: "They can't {0} together.", options: ["run", "swim", "ride a bike"], currentIndex: 0 },
  { key: "sub2-4", original: "Eu não consigo jogar este jogo.", base: "I can't {0}.", options: ["play this game", "play this instrument", "do yoga"], currentIndex: 0 },
  { key: "sub2-5", original: "Eu prefiro conversar sobre política.", base: "I prefer to talk about {0}.", options: ["politics", "music", "sports"], currentIndex: 0 }
];

// ============================================
// CHANGE INTO NEGATIVE (Present Continuous)
// ============================================
const negativeExercises = [
  { key: "neg-1", sentence: "He's speaking Spanish with his father.", answer: "He isn't speaking Spanish with his father." },
  { key: "neg-2", sentence: "We're studying French at school.", answer: "We aren't studying French at school." },
  { key: "neg-3", sentence: "They're playing the keyboard.", answer: "They aren't playing the keyboard." },
  { key: "neg-4", sentence: "She's reading a great story.", answer: "She isn't reading a great story." },
  { key: "neg-5", sentence: "I'm sending you the message now.", answer: "I'm not sending you the message now." },
  { key: "neg-6", sentence: "He's talking to his teacher about his hobbies.", answer: "He isn't talking to his teacher about his hobbies." }
];

// ============================================
// CHANGE INTO INTERROGATIVE
// ============================================
const interrogativeExercises = [
  { key: "int-1", sentence: "Tom is learning how to play the guitar.", answer: "Is Tom learning how to play the guitar?" },
  { key: "int-2", sentence: "Your friend is playing soccer at the park.", answer: "Is your friend playing soccer at the park?" },
  { key: "int-3", sentence: "Her husband is cleaning the car.", answer: "Is her husband cleaning the car?" },
  { key: "int-4", sentence: "Our parents are talking about religion.", answer: "Are our parents talking about religion?" },
  { key: "int-5", sentence: "They are cooking healthy food for lunch.", answer: "Are they cooking healthy food for lunch?" },
  { key: "int-6", sentence: "The children are making cookies.", answer: "Are the children making cookies?" }
];

// ============================================
// CHANGE INTO AFFIRMATIVE (CAN / CAN'T)
// ============================================
const affirmativeExercises = [
  { key: "aff-1", sentence: "My friend can't run a marathon this year.", answer: "My friend can run a marathon this year." },
  { key: "aff-2", sentence: "Our brother can't ride a bike to work.", answer: "Our brother can ride a bike to work." },
  { key: "aff-3", sentence: "You can't run on this treadmill.", answer: "You can run on this treadmill." },
  { key: "aff-4", sentence: "She doesn't have a lot of fun with her friends.", answer: "She has a lot of fun with her friends." },
  { key: "aff-5", sentence: "Their teacher doesn't have any free time on weekends.", answer: "Their teacher has some free time on weekends." },
  { key: "aff-6", sentence: "He doesn't play basketball very well.", answer: "He plays basketball very well." }
];

// ============================================
// IMPROVE YOUR PRONUNCIATION
// ============================================
const pronunciationItems = [
  { word: "skirt", phrase: "She's wearing a blue skirt." },
  { word: "store", phrase: "Is that store on this street?" },
  { word: "sports", phrase: "What sports do you like to play?" },
  { word: "sleep", phrase: "How many hours do you sleep every night?" },
  { word: "smart", phrase: "He is very smart." },
  { word: "close", phrase: "I have to close the bottle." },
  { word: "visit", phrase: "They want to visit me tomorrow." },
  { word: "busy", phrase: "Are you busy today?" },
  { word: "please", phrase: "Open it for me, please." }
];

// ============================================
// EXTRA B1 EXERCISES (Future, Does/Doesn't, Would)
// ============================================
const b1ExtraExercises = {
  doesDoesnt: [
    { key: "b1-1", question: "What __________ your sister like to do on weekends?", options: ["do", "does"], correct: "does", answer: "What does your sister like to do on weekends?" },
    { key: "b1-2", question: "She __________ eat breakfast before 9 AM.", options: ["don't", "doesn't"], correct: "doesn't", answer: "She doesn't eat breakfast before 9 AM." },
    { key: "b1-3", question: "__________ your parents speak English at home?", options: ["Do", "Does"], correct: "Do", answer: "Do your parents speak English at home?" }
  ],
  would: [
    { key: "b1-4", prompt: "Would you like to go to the cinema?", answer: "Yes, I would love to go to the cinema.", type: "affirmative" },
    { key: "b1-5", prompt: "Would you like to try some Italian food?", answer: "No, I would prefer to eat something else.", type: "negative" },
    { key: "b1-6", prompt: "What would you do if you won the lottery?", answer: "I would travel around the world.", type: "hypothetical" },
    { key: "b1-7", prompt: "Make a polite offer using 'would'", answer: "Would you like me to help you with that?" }
  ],
  future: [
    { key: "b1-8", sentence: "I (to go) to the beach next summer.", correct: "I will go to the beach next summer.", answer: "I will go to the beach next summer." },
    { key: "b1-9", sentence: "She (to start / not) her new job until Monday.", correct: "She won't start her new job until Monday.", answer: "She won't start her new job until Monday." },
    { key: "b1-10", sentence: "__________ you __________ (to call) me tomorrow?", correct: "Will you call me tomorrow?", answer: "Will you call me tomorrow?" }
  ]
};

// ============================================
// TUNE IN YOUR EARS - VIDEO DATA (Greetings & Politeness)
// ============================================
const tuneInYourEarsVideo = {
  youtubeId: "Nsxxw9_vTnY",
  playlistIndex: 12,
  title: "Greetings, Politeness & Questions Explained Simply",
  description: "Watch this video about greetings, politeness, and how people react to polite behavior in everyday situations.",
  keyVocabulary: [
    { english: "polite", portuguese: "educado(a)" },
    { english: "Please, leave", portuguese: "Por favor, saia" },
    { english: "beginning", portuguese: "começo" },
    { english: "request", portuguese: "solicitação" },
    { english: "warning", portuguese: "aviso" },
    { english: "hallway", portuguese: "corredor" },
    { english: "Greetings", portuguese: "saudações" },
    { english: "Politeness", portuguese: "educação" },
    { english: "reply", portuguese: "comentário" },
    { english: "grateful", portuguese: "grato(a)" },
    { english: "kind action", portuguese: "ação gentil" },
    { english: "speech", portuguese: "fala" }
  ],
  questions: [
    { id: 1, question: "How do people react when someone is polite to them?", instructions: "Listen for examples of reactions to polite behavior.", correctAnswer: "People usually smile and respond kindly when someone is polite to them." },
    { id: 2, question: "What are common greetings mentioned in the video?", instructions: "Pay attention to different ways of greeting people.", correctAnswer: "Common greetings include 'Hello', 'Good morning', 'Hi', and 'How are you?'" },
    { id: 3, question: "Why is politeness important in daily conversations?", instructions: "Listen for the reasons politeness matters.", correctAnswer: "Politeness shows respect and makes other people feel comfortable and valued." },
    { id: 4, question: "What do people consider rude behavior?", instructions: "Listen for examples of impolite actions mentioned.", correctAnswer: "Interrupting someone while they are speaking is considered rude behavior." },
    { id: 5, question: "How can you make a polite request in English?", instructions: "Listen for polite request phrases.", correctAnswer: "You can say 'Could you please help me?' or 'Would you mind opening the door?'" },
    { id: 6, question: "What is the difference between a request and a warning?", instructions: "Listen for the distinction between these speech acts.", correctAnswer: "A request asks someone to do something politely, while a warning tells someone about possible danger." },
    { id: 7, question: "How do people show they are grateful for a kind action?", instructions: "Listen for expressions of gratitude.", correctAnswer: "People say 'Thank you', 'I appreciate it', or 'That's very kind of you'." },
    { id: 8, question: "What does the video say about greetings in different situations?", instructions: "Pay attention to formal vs informal greetings.", correctAnswer: "Formal greetings are used in professional settings, while informal greetings are used with friends and family." }
  ],
  discussionQuestions: [
    "In your culture, what are the most important polite expressions?",
    "How do you greet someone older than you in your country?",
    "What do you do when someone is rude to you?",
    "Is it important to say 'please' and 'thank you' in your native language?",
    "How would you politely ask for help in a store?",
    "What would you say if you need to interrupt a conversation politely?",
    "How do you show respect to teachers or authority figures?",
    "What is considered polite at the dinner table in your culture?"
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

// ============================================
// FLUENCY CARD COMPONENT (With I can / I can't structure)
// ============================================
interface FluencySentence {
  id: number;
  userSentence: string;
  checked: boolean;
  isValid: boolean;
}

const FluencyGallery = ({ images, onSentencesChange }: { images: typeof fluencyImages; onSentencesChange: (sentences: FluencySentence[]) => void }) => {
  const [sentences, setSentences] = useState<FluencySentence[]>(
    images.map((img) => ({ id: img.id, userSentence: "", checked: false, isValid: false }))
  );

  const updateSentence = (id: number, value: string) => {
    const newSentences = sentences.map(s => s.id === id ? { ...s, userSentence: value, checked: false, isValid: false } : s);
    setSentences(newSentences);
    onSentencesChange(newSentences);
  };

  const checkSentence = (id: number, sentence: string, prompt: string) => {
    const pattern = /I can\s+\w+\s*,\s*but\s+I can't\s+\w+/i;
    const isValid = pattern.test(sentence);
    const newSentences = sentences.map(s => s.id === id ? { ...s, checked: true, isValid } : s);
    setSentences(newSentences);
    onSentencesChange(newSentences);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div key={img.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-pink-200">
          <div className="relative h-48 w-full">
            <Image src={img.image} alt={img.alt} fill className="object-cover" />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {img.prompt}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-2">📝 Write: I can ___, but I can't ___</p>
            <textarea
              value={sentences.find(s => s.id === img.id)?.userSentence || ""}
              onChange={(e) => updateSentence(img.id, e.target.value)}
              placeholder={`Example: I can ${img.action}, but I can't ${img.contrast}.`}
              className="w-full h-24 p-2 border border-pink-300 rounded-md text-sm focus:ring-2 focus:ring-pink-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <button
                onClick={() => checkSentence(img.id, sentences.find(s => s.id === img.id)?.userSentence || "", img.prompt)}
                className="bg-pink-500 text-white px-4 py-1 rounded-md text-sm hover:bg-pink-600 transition"
              >
                Check
              </button>
              {sentences.find(s => s.id === img.id)?.checked && (
                <span className={`text-sm ${sentences.find(s => s.id === img.id)?.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {sentences.find(s => s.id === img.id)?.isValid ? "✓ Valid sentence!" : "✗ Use: I can X, but I can't Y"}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function Lesson56Abilities() {
  const router = useRouter();
  
  const [sections, setSections] = useState({
    grammar: true,
    fluency: true,
    substitution1: true,
    substitution2: true,
    negative: true,
    interrogative: true,
    affirmative: true,
    pronunciation: true,
    b1Extra: true,
    tuneInYourEars: true
  });

  // Exercise states
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});
  const [b1Answers, setB1Answers] = useState<Record<string, string>>({});
  const [b1Results, setB1Results] = useState<Record<string, boolean>>({});
  const [fluencySentences, setFluencySentences] = useState<FluencySentence[]>([]);
  
  // Video states
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [videoResults, setVideoResults] = useState<Record<string, boolean>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  const [discussionAnswers, setDiscussionAnswers] = useState<Record<number, string>>({});

  // Pronunciation audio
  const [pronunciationAudio] = useState("/audios/l56_pronunciation.mp3");

  // ============================================
  // PERSISTENCE
  // ============================================
  useEffect(() => {
    const saved = localStorage.getItem("lesson56Answers");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setB1Answers(data.b1Answers || {});
        setB1Results(data.b1Results || {});
        setFluencySentences(data.fluencySentences || []);
        setVideoAnswers(data.videoAnswers || {});
        setVideoResults(data.videoResults || {});
        setShowVideoResults(data.showVideoResults || {});
        setDiscussionAnswers(data.discussionAnswers || {});
        if (data.sections) setSections(data.sections);
        console.log("✅ Lesson 56 data loaded");
      } catch (error) { console.error("Error loading:", error); }
    }
  }, []);

  const saveAllAnswers = () => {
    const data = {
      subs1Exercises, subs2Exercises, writtenAnswers, answerResults, showAnswerResults,
      b1Answers, b1Results, fluencySentences, videoAnswers, videoResults, showVideoResults,
      discussionAnswers, sections, lastUpdated: new Date().toISOString(), 
      lessonName: "Lesson 56 - Abilities & Comparisons - Greetings & Politeness"
    };
    localStorage.setItem("lesson56Answers", JSON.stringify(data));
    alert("✅ All answers saved!");
  };

  const clearAllAnswers = () => {
    if (confirm("Clear ALL answers?")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setB1Answers({});
      setB1Results({});
      setFluencySentences([]);
      setVideoAnswers({});
      setVideoResults({});
      setShowVideoResults({});
      setDiscussionAnswers({});
      localStorage.removeItem("lesson56Answers");
      alert("✅ All cleared.");
    }
  };

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSubsOptionClick = (key: string, optionIndex: number, isMulti: boolean = false) => {
    if (isMulti) {
      setSubs1Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: optionIndex } : ex));
    } else {
      setSubs1Exercises(prev => prev.map(ex => ex.key === key ? { ...ex, currentIndex: optionIndex } : ex));
    }
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

  const handleB1AnswerChange = (key: string, value: string) => {
    setB1Answers(prev => ({ ...prev, [key]: value }));
  };

  const handleB1Check = (key: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setB1Results(prev => ({ ...prev, [key]: isCorrect }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [id]: value }));
  };

  const checkVideoAnswer = (id: number, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setVideoResults(prev => ({ ...prev, [`video-${id}`]: isCorrect }));
    setShowVideoResults(prev => ({ ...prev, [`video-${id}`]: true }));
  };

  const handleDiscussionChange = (id: number, value: string) => {
    setDiscussionAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="min-h-screen py-16 px-6 bg-cover bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop')` }}>
      <div className="max-w-7xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-2xl border border-gray-200">
        
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-pink-900 mb-4">🎸 LESSON 56 – ABILITIES & COMPARISONS</h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Learn to express <span className="font-bold text-pink-600">abilities (can/can't)</span>, 
            <span className="font-bold text-blue-600"> routines (does/doesn't)</span>, 
            <span className="font-bold text-green-600"> hypothetical situations (would)</span>, and
            <span className="font-bold text-yellow-600"> politeness & greetings</span>.
          </p>
          <p className="text-md text-gray-500 mt-2">Level B1 - Intermediate</p>
        </div>

        {/* GRAMMAR EXPLANATION */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold text-center">📚 Grammar - Can, Can't, Does, Doesn't, Would</h2>
          </div>
          <div className="p-8">
            <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
              <h3 className="text-xl font-bold text-blue-700 mb-3">{grammarExplanation.title}</h3>
              <p className="text-gray-700 mb-4">{grammarExplanation.explanation}</p>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {grammarExplanation.structures.map((struct, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg border">
                    <p className="font-bold text-blue-700">{struct.name}</p>
                    <p className="text-sm text-gray-600">{struct.pattern}</p>
                    <p className="text-sm text-gray-500 italic">"{struct.example}"</p>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm font-semibold">📝 Examples with the structure "I can X, but I can't Y":</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {grammarExplanation.examples.map((ex, idx) => (
                    <span key={idx} className="bg-white px-2 py-1 rounded text-sm border">{ex}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================== */}
        {/* PART 1 – FLUENCY GALLERY (15 IMAGES) */}
        {/* ======================================== */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🖼️ PART 1 – FLUENCY GALLERY</h2>
              <button onClick={() => toggleSection('fluency')} className="ml-4 p-2 rounded-full hover:bg-pink-600 transition">
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="text-sm bg-white text-pink-600 px-3 py-1 rounded-full">15 images • I can ___ , but I can't ___</div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-pink-700 font-medium text-lg">🎯 Create sentences following the model:</p>
                <p className="text-gray-700 text-md mt-1">✨ <span className="font-bold">I can speak English, but I can't speak French.</span></p>
                <p className="text-gray-500 text-sm mt-2">👉 Write one sentence for each image using "I can ___ , but I can't ___"</p>
              </div>
              
              <FluencyGallery images={fluencyImages} onSentencesChange={setFluencySentences} />
              
              <div className="mt-6 p-4 bg-pink-100 rounded-lg">
                <h3 className="font-bold text-pink-800">📊 Progress: {fluencySentences.filter(s => s.isValid).length} / 15 sentences completed</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-pink-500 h-2 rounded-full transition-all" style={{ width: `${(fluencySentences.filter(s => s.isValid).length / 15) * 100}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 2 – SUBSTITUTION PRACTICE I */}
        {/* ======================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟡 PART 2 – SUBSTITUTION PRACTICE I</h2>
            <button onClick={() => toggleSection('substitution1')} className="p-2 rounded-full hover:bg-purple-700">
              {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.substitution1 && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 italic">Substitute the words to create new sentences:</p>
              <div className="space-y-5">
                {subs1Exercises.map((ex) => {
                  let currentSentence = ex.base;
                  if (ex.isMulti) {
                    const options = ex.options[ex.currentIndex] as string[];
                    currentSentence = currentSentence.replace('{0}', options[0]).replace('{1}', options[1]);
                  } else {
                    currentSentence = currentSentence.replace('{0}', (ex.options[ex.currentIndex] as string));
                  }
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-purple-200">
                      <p className="text-gray-500 text-sm mb-1">🇧🇷 {ex.original}</p>
                      <p className="text-purple-700 font-bold text-lg mb-2">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {ex.isMulti ? 
                          (ex.options[ex.currentIndex] as string[]).map((opt, idx) => <span key={idx} className="bg-purple-100 px-3 py-1 rounded-full text-sm">{opt}</span>) :
                          (ex.options as string[]).map((opt, idx) => (
                            <button key={idx} onClick={() => handleSubsOptionClick(ex.key, idx, ex.isMulti)} className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-purple-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
                              {opt}
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 3 – SUBSTITUTION PRACTICE II */}
        {/* ======================================== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟢 PART 3 – SUBSTITUTION PRACTICE II (Can / Can't / Would)</h2>
            <button onClick={() => toggleSection('substitution2')} className="p-2 rounded-full hover:bg-indigo-700">
              {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.substitution2 && (
            <div className="p-8">
              <div className="space-y-5">
                {subs2Exercises.map((ex) => {
                  const currentSentence = ex.base.replace('{0}', ex.options[ex.currentIndex] as string);
                  return (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-indigo-200">
                      <p className="text-gray-500 text-sm mb-1">🇧🇷 {ex.original}</p>
                      <p className="text-indigo-700 font-bold text-lg mb-2">➡️ {currentSentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {(ex.options as string[]).map((opt, idx) => (
                          <button key={idx} onClick={() => handleSubs2OptionClick(ex.key, idx)} className={`px-3 py-1 rounded-md text-sm transition ${ex.currentIndex === idx ? 'bg-indigo-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
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
        {/* PART 4 – CHANGE INTO NEGATIVE */}
        {/* ======================================== */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔴 PART 4 – CHANGE INTO NEGATIVE</h2>
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
        {/* PART 5 – CHANGE INTO INTERROGATIVE */}
        {/* ======================================== */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🟠 PART 5 – CHANGE INTO INTERROGATIVE</h2>
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
        {/* PART 6 – CHANGE INTO AFFIRMATIVE */}
        {/* ======================================== */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔵 PART 6 – CHANGE INTO AFFIRMATIVE</h2>
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
        {/* PART 7 – IMPROVE YOUR PRONUNCIATION */}
        {/* ======================================== */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">🔊 PART 7 – IMPROVE YOUR PRONUNCIATION</h2>
            <button onClick={() => toggleSection('pronunciation')} className="p-2 rounded-full hover:bg-teal-700">
              {sections.pronunciation ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.pronunciation && (
            <div className="p-8">
              <div className="flex justify-end mb-4">
                <AudioPlayer src={pronunciationAudio} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pronunciationItems.map((item, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-lg border border-teal-200 shadow-sm">
                    <p className="text-teal-600 font-bold text-lg">{item.word}</p>
                    <p className="text-gray-700">→ {item.phrase}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 8 – B1 EXTRA (Does/Doesn't / Would / Future) */}
        {/* ======================================== */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">⭐ PART 8 – B1 EXTRA (DOES/DOESN'T / WOULD / WILL)</h2>
            <button onClick={() => toggleSection('b1Extra')} className="p-2 rounded-full hover:bg-cyan-700">
              {sections.b1Extra ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </button>
          </div>
          {sections.b1Extra && (
            <div className="p-8">
              {/* Does/Doesn't Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-cyan-700 mb-4">📌 A. Complete with DO or DOES:</h3>
                <div className="space-y-4">
                  {b1ExtraExercises.doesDoesnt.map((ex) => (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-cyan-200">
                      <p className="font-medium mb-2">{ex.question}</p>
                      <div className="flex gap-3 mb-3">
                        {ex.options.map((opt, idx) => (
                          <button key={idx} onClick={() => { handleB1AnswerChange(ex.key, opt); handleB1Check(ex.key, opt, ex.correct); }} className={`px-4 py-2 rounded-md transition ${b1Answers[ex.key] === opt ? 'bg-cyan-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{opt}</button>
                        ))}
                      </div>
                      {b1Results[ex.key] !== undefined && <AnswerResult isCorrect={b1Results[ex.key]} correctAnswer={ex.answer} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Would Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-cyan-700 mb-4">📌 B. Answer with WOULD:</h3>
                <div className="space-y-4">
                  {b1ExtraExercises.would.map((ex) => (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-cyan-200">
                      <p className="font-medium mb-2">💭 {ex.prompt}</p>
                      <textarea value={b1Answers[ex.key] || ""} onChange={(e) => handleB1AnswerChange(ex.key, e.target.value)} placeholder="Write your answer here..." className="w-full p-2 border border-cyan-300 rounded-md h-20 resize-none" />
                      <button onClick={() => handleB1Check(ex.key, b1Answers[ex.key] || "", ex.answer)} className="mt-2 bg-cyan-500 text-white px-4 py-1 rounded-md text-sm hover:bg-cyan-600">Check</button>
                      {b1Results[ex.key] !== undefined && <AnswerResult isCorrect={b1Results[ex.key]} correctAnswer={ex.answer} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Future with Will */}
              <div>
                <h3 className="text-xl font-bold text-cyan-700 mb-4">📌 C. Future with WILL:</h3>
                <div className="space-y-4">
                  {b1ExtraExercises.future.map((ex) => (
                    <div key={ex.key} className="bg-white p-4 rounded-lg border-2 border-cyan-200">
                      <p className="font-medium mb-2">🔹 Complete: {ex.sentence}</p>
                      <input type="text" value={b1Answers[ex.key] || ""} onChange={(e) => handleB1AnswerChange(ex.key, e.target.value)} placeholder="Write the complete sentence..." className="w-full px-3 py-2 border border-cyan-300 rounded-md" />
                      <button onClick={() => handleB1Check(ex.key, b1Answers[ex.key] || "", ex.correct)} className="mt-2 bg-cyan-500 text-white px-4 py-1 rounded-md text-sm hover:bg-cyan-600">Check</button>
                      {b1Results[ex.key] !== undefined && <AnswerResult isCorrect={b1Results[ex.key]} correctAnswer={ex.correct} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* PART 9 – TUNE IN YOUR EARS (Greetings & Politeness Video) */}
        {/* ======================================== */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-3xl shadow-lg mb-10 overflow-hidden">
          <div className="py-5 px-8 bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">🎧 PART 9 – TUNE IN YOUR EARS</h2>
            <button onClick={() => toggleSection('tuneInYourEars')} className="p-2 rounded-full hover:bg-white/20">
              {sections.tuneInYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          {sections.tuneInYourEars && (
            <div className="p-8">
              {/* Key Vocabulary Section */}
              <div className="bg-white rounded-xl p-6 shadow-md border border-yellow-200 mb-6">
                <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 📚 KEY VOCABULARY FROM THE VIDEO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tuneInYourEarsVideo.keyVocabulary.map((vocab, idx) => (
                    <div key={idx} className="bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                      <p className="font-bold text-yellow-800 text-sm">{vocab.english}</p>
                      <p className="text-xs text-yellow-600">{vocab.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Player */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-yellow-700 mb-4">{tuneInYourEarsVideo.title}</h3>
                <p className="text-yellow-600 mb-6">{tuneInYourEarsVideo.description}</p>
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneInYourEarsVideo.youtubeId}?list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=12`}
                      title={tuneInYourEarsVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>

              {/* Comprehension Questions from the video */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-bold text-yellow-700 mb-4 flex items-center gap-2">🎯 Video Comprehension Questions:</h3>
                {tuneInYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 border-yellow-200 shadow-md">
                    <h4 className="text-lg font-bold text-yellow-700 mb-2">📝 Question {q.id}: {q.question}</h4>
                    <p className="text-sm text-gray-500 mb-3 italic">🎧 {q.instructions}</p>
                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer based on what you heard from the video..."
                      className="w-full h-28 p-4 border-2 border-yellow-200 rounded-lg resize-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => { setVideoAnswers(prev => ({ ...prev, [q.id]: "" })); setShowVideoResults(prev => ({ ...prev, [`video-${q.id}`]: false })); }}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition font-medium"
                      >
                        Clear
                      </button>
                    </div>
                    {showVideoResults[`video-${q.id}`] && (
                      <AnswerResult isCorrect={videoResults[`video-${q.id}`] || false} correctAnswer={q.correctAnswer} />
                    )}
                  </div>
                ))}
              </div>

              {/* Discussion Questions - Politeness & Greetings in Daily Life */}
              <div className="mt-8 bg-yellow-100 border-2 border-yellow-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  💬 Discussion Questions - Politeness in Daily Life
                </h3>
                <p className="text-yellow-700 mb-4 italic">Answer the following questions about greetings, politeness, and daily situations:</p>
                <div className="space-y-4">
                  {tuneInYourEarsVideo.discussionQuestions.map((q, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-yellow-200">
                      <p className="font-bold text-yellow-700 mb-2">🗣️ {idx + 1}. {q}</p>
                      <textarea
                        value={discussionAnswers[idx] || ""}
                        onChange={(e) => handleDiscussionChange(idx, e.target.value)}
                        placeholder="Write your answer here in English..."
                        className="w-full p-3 border border-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 resize-none h-24"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Listening Tips */}
              <div className="mt-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 🎯 Listening & Politeness Tips:
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-yellow-700">
                  <li>Listen first without looking at the questions to get the general idea</li>
                  <li>Pay attention to <strong>polite expressions</strong> like "please", "thank you", "excuse me"</li>
                  <li>Notice how tone of voice affects politeness</li>
                  <li>Watch for <strong>body language</strong> and facial expressions that show politeness</li>
                  <li>Identify the difference between <strong>formal and informal greetings</strong></li>
                  <li>Practice saying the polite phrases out loud with correct intonation</li>
                  <li>Think about how politeness works in your own culture compared to English-speaking countries</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ======================================== */}
        {/* SAVE & NAVIGATION BUTTONS */}
        {/* ======================================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t-2 border-gray-200">
          <div className="flex gap-4">
            <button onClick={saveAllAnswers} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-md flex items-center gap-2">💾 Save All Answers</button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm shadow-md">Clear All</button>
          </div>
          <div className="flex gap-4">
            <button onClick={() => router.push("/cursos/lesson55")} className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-full shadow-md">← Previous Lesson</button>
            <button onClick={() => router.push("/cursos/lesson57")} className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-full shadow-md">Next Lesson →</button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>Lesson 56 – Abilities & Comparisons | I can ___, but I can't ___ | Greetings & Politeness | Level B1</p>
          <p className="mt-1">© 2025 - English Learning Platform</p>
        </div>
      </div>
    </div>
  );
}