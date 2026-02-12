"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X, Check, XCircle } from "lucide-react";

// Dados da lição 22 - Lifestyle & Weekly Planning
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Ele vem para casa cedo. / tarde / à noite",
    base: "He {0} home early.",
    options: ["comes", "comes", "comes"],
    correctForms: ["comes", "comes", "comes"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Ela quer morar na praia. / Ele / Nós",
    base: "{0} want to live at the beach.",
    options: ["She", "He", "We"],
    correctForms: ["She wants", "He wants", "We want"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Ele precisa estudar português. / espanhol / inglês",
    base: "He needs to study {0}.",
    options: ["Portuguese", "Spanish", "English"],
    correctForms: ["Portuguese", "Spanish", "English"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "Ele às vezes estuda aos domingos. / aos sábados / às terças-feiras",
    base: "He sometimes studies {0}.",
    options: ["on Sundays", "on Saturdays", "on Tuesdays"],
    correctForms: ["on Sundays", "on Saturdays", "on Tuesdays"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Ela vai para a escola às 7:30. / 7:00 / 6:45",
    base: "She goes to school at {0}.",
    options: ["7:30", "7:00", "6:45"],
    correctForms: ["7:30", "7:00", "6:45"],
    currentIndex: 0
  },
  { 
    key: "subs-6", 
    original: "Que dia é hoje? / É segunda-feira. / sexta-feira / quinta-feira",
    base: "What day is today? / It's {0}.",
    options: ["Monday", "Friday", "Thursday"],
    correctForms: ["Monday", "Friday", "Thursday"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "Eu preciso cozinhar hoje. / Nós / Você",
    base: "{0} need to cook today.",
    options: ["I", "We", "You"],
    correctForms: ["I need", "We need", "You need"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "Ele vai para o trabalho às 9:15. / escola / igreja",
    base: "He goes to {0} at 9:15.",
    options: ["work", "school", "church"],
    correctForms: ["work", "school", "church"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "Você trabalha durante a semana? / cozinha / limpa a casa",
    base: "Do you {0} during the week?",
    options: ["work", "cook", "clean the house"],
    correctForms: ["work", "cook", "clean the house"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Nós preferimos ficar em casa aos sábados. / domingos / fins de semana",
    base: "We prefer to stay home {0}.",
    options: ["on Saturdays", "on Sundays", "on weekends"],
    correctForms: ["on Saturdays", "on Sundays", "on weekends"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "Eu estudo às segundas e quartas. / terças e quintas / segundas e sextas",
    base: "I study {0}.",
    options: ["on Mondays and Wednesdays", "on Tuesdays and Thursdays", "on Mondays and Fridays"],
    correctForms: ["on Mondays and Wednesdays", "on Tuesdays and Thursdays", "on Mondays and Fridays"],
    currentIndex: 0
  }
];

const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "We like to go to work early.",
    answer: "We don't like to go to work early."
  },
  { 
    key: "neg-2", 
    sentence: "I like to work on weekends.",
    answer: "I don't like to work on weekends."
  },
  { 
    key: "neg-3", 
    sentence: "We stay home on Sundays.",
    answer: "We don't stay home on Sundays."
  },
  { 
    key: "neg-4", 
    sentence: "I study here during the week.",
    answer: "I don't study here during the week."
  },
  { 
    key: "neg-5", 
    sentence: "They live in a small house.",
    answer: "They don't live in a small house."
  },
  { 
    key: "neg-6", 
    sentence: "You clean the house on weekends.",
    answer: "You don't clean the house on weekends."
  }
];

const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "I don't like to live in the countryside.",
    answer: "I like to live in the countryside."
  },
  { 
    key: "aff-2", 
    sentence: "They don't clean the kitchen every day.",
    answer: "They clean the kitchen every day."
  },
  { 
    key: "aff-3", 
    sentence: "We don't like to stay at the beach.",
    answer: "We like to stay at the beach."
  },
  { 
    key: "aff-4", 
    sentence: "They don't come here on weekends.",
    answer: "They come here on weekends."
  },
  { 
    key: "aff-5", 
    sentence: "I don't cook for my friends.",
    answer: "I cook for my friends."
  },
  { 
    key: "aff-6", 
    sentence: "We don't have an apartment at the beach.",
    answer: "We have an apartment at the beach."
  }
];

const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "You go to the beach in the morning.",
    answer: "Do you go to the beach in the morning?"
  },
  { 
    key: "int-2", 
    sentence: "You want to go to the movies on Friday.",
    answer: "Do you want to go to the movies on Friday?"
  },
  { 
    key: "int-3", 
    sentence: "You sometimes sleep on the couch.",
    answer: "Do you sometimes sleep on the couch?"
  },
  { 
    key: "int-4", 
    sentence: "They usually do the laundry on Saturdays.",
    answer: "Do they usually do the laundry on Saturdays?"
  },
  { 
    key: "int-5", 
    sentence: "You study languages with your co-workers.",
    answer: "Do you study languages with your co-workers?"
  },
  { 
    key: "int-6", 
    sentence: "You want a new job abroad.",
    answer: "Do you want a new job abroad?"
  }
];

const fluencyExercises = [
  {
    key: "flu-1",
    original: "I work at home. (He)",
    base: "I work at home.",
    subject: "He",
    answer: "He works at home."
  },
  {
    key: "flu-2",
    original: "She lives alone. (They)",
    base: "She lives alone.",
    subject: "They",
    answer: "They live alone."
  },
  {
    key: "flu-3",
    original: "I have a new cell phone. (She)",
    base: "I have a new cell phone.",
    subject: "She",
    answer: "She has a new cell phone."
  },
  {
    key: "flu-4",
    original: "We like to stay home on weekends. (They)",
    base: "We like to stay home on weekends.",
    subject: "They",
    answer: "They like to stay home on weekends."
  },
  {
    key: "flu-5",
    original: "We go to work at 8:00 a.m. (He)",
    base: "We go to work at 8:00 a.m.",
    subject: "He",
    answer: "He goes to work at 8:00 a.m."
  },
  {
    key: "flu-6",
    original: "We understand the story. (She)",
    base: "We understand the story.",
    subject: "She",
    answer: "She understands the story."
  },
  {
    key: "flu-7",
    original: "They eat pasta on Sundays. (He)",
    base: "They eat pasta on Sundays.",
    subject: "He",
    answer: "He eats pasta on Sundays."
  },
  {
    key: "flu-8",
    original: "I clean the house on Saturdays. (She)",
    base: "I clean the house on Saturdays.",
    subject: "She",
    answer: "She cleans the house on Saturdays."
  },
  {
    key: "flu-9",
    original: "They need a new house. (He)",
    base: "They need a new house.",
    subject: "He",
    answer: "He needs a new house."
  },
  {
    key: "flu-10",
    original: "I get up early during the week. (She)",
    base: "I get up early during the week.",
    subject: "She",
    answer: "She gets up early during the week."
  },
  {
    key: "flu-11",
    original: "I come to the English school on Wednesdays. (She)",
    base: "I come to the English school on Wednesdays.",
    subject: "She",
    answer: "She comes to the English school on Wednesdays."
  }
];

const personalQuestions = [
  {
    id: 1,
    question: "Quais lugares você vai nos fins de semana?",
    placeholder: "Descreva os lugares que você costuma visitar nos fins de semana...",
    instruction: "Use o pronome na terceira pessoa do singular. Exemplo: He goes to..."
  },
  {
    id: 2,
    question: "O que você faz durante a semana?",
    placeholder: "Descreva suas atividades rotineiras durante a semana...",
    instruction: "Use o pronome na terceira pessoa do singular. Exemplo: She studies..."
  },
  {
    id: 3,
    question: "O que seus amigos fazem durante a semana ou nos fins de semana?",
    placeholder: "Descreva as atividades dos seus amigos...",
    instruction: "Use o pronome na terceira pessoa do singular. Exemplo: He works..."
  },
  {
    id: 4,
    question: "Como você planeja sua semana?",
    placeholder: "Descreva seu processo de planejamento semanal...",
    instruction: "Use o pronome na terceira pessoa do singular. Exemplo: She plans..."
  },
  {
    id: 5,
    question: "Qual é sua parte favorita do fim de semana?",
    placeholder: "Descreva o que você mais gosta de fazer nos fins de semana...",
    instruction: "Use o pronome na terceira pessoa do singular. Exemplo: He likes..."
  }
];

// Sistema de avaliação de respostas
const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
  const normalize = (text: string) => 
    text.toLowerCase().trim().replace(/[.,?!]/g, '');
  
  return normalize(userAnswer) === normalize(correctAnswer);
};

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

const SimpleAudioPlayer = ({ src }: { src: string }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.error("Error playing audio:", err));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={playAudio}
        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600"
      >
        <Volume2 size={14} />
      </button>
      <audio ref={audioRef} src={src} preload="none" />
    </div>
  );
};

// Componente para destaque de palavras
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
        const cleanWord = word.replace('?', '').replace('!', '').replace('.', '').replace('"', '');
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

// Componente para mostrar resultado da avaliação
const AnswerResult = ({ isCorrect, correctAnswer }: { isCorrect: boolean; correctAnswer: string }) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correto!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Resposta esperada:</span> {correctAnswer}
      </span>
    </div>
  );
};

export default function Lesson22LifestylePlanning() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    dialogue: true,
    vocabulary: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    fluency: true,
    unlock: true,
    questions: true
  });

  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  
  // Estados para as respostas escritas
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  
  // Estados para avaliação de respostas
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  // Estados para exercícios de fluência
  const [fluencyAnswers, setFluencyAnswers] = useState<Record<string, string>>({});
  const [fluencyResults, setFluencyResults] = useState<Record<string, boolean>>({});
  const [showFluencyResults, setShowFluencyResults] = useState<Record<string, boolean>>({});

  // Estado para diálogo
  const [dialogueParts, setDialogueParts] = useState({
    rachel: [
      "Hi, Shawn!",
      "Hello, Rachel! How are you?",
      "I'm fine. Hey, do you have plans for the weekend?",
      "No.",
      "My family and I want to go to the beach on Saturday. My brother has an apartment near Santa Monica. Do you want to come?",
      "Yes, please! I really want to go to the beach.",
      "We love to stay at the beach.",
      "Thanks for the invitation.",
      "You're welcome!",
      "Do you want to go on Friday or Saturday?",
      "My father wants to go on Friday in the evening.",
      "Perfect!",
      "See you on Friday then, Shawn.",
      "See you!"
    ],
    currentSpeaker: "Rachel" // Rachel ou Shawn
  });

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson22Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        // Restaurar todos os estados
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
        setFluencyAnswers(data.fluencyAnswers || {});
        setAnswerResults(data.answerResults || {});
        setShowAnswerResults(data.showAnswerResults || {});
        setFluencyResults(data.fluencyResults || {});
        setShowFluencyResults(data.showFluencyResults || {});
        
        // Restaurar estado das seções
        if (data.sections) setSections(data.sections);
        
        console.log("Dados carregados do localStorage para Lesson 22");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // ==============================
  // SISTEMA DE PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = async () => {
    const data = {
      // Dados das práticas de substituição
      subs1Exercises,
      subs2Exercises,
      
      // Respostas escritas
      writtenAnswers,
      fluencyAnswers,
      
      // Resultados de avaliação
      answerResults,
      showAnswerResults,
      fluencyResults,
      showFluencyResults,
      
      // Estado das seções
      sections,
      
      // Metadados
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 22 - Lifestyle & Weekly Planning",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson22Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!\nVocê pode voltar a qualquer momento e elas estarão aqui.");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas. Por favor, tente novamente.");
    }
  };

  // Função para limpar todas as respostas
  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas? Esta ação não pode ser desfeita.")) {
      setSubs1Exercises(substitutionPractice1);
      setSubs2Exercises(substitutionPractice2);
      setWrittenAnswers({});
      setFluencyAnswers({});
      setAnswerResults({});
      setShowAnswerResults({});
      setFluencyResults({});
      setShowFluencyResults({});
      
      // Limpar do localStorage também
      localStorage.removeItem("lesson22Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO DE ESTADOS
  // ==============================
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

  const handleFluencyAnswerChange = (key: string, value: string) => {
    setFluencyAnswers(prev => ({ ...prev, [key]: value }));
  };

  // Função para verificar respostas
  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  // Função para verificar respostas de fluência
  const handleCheckFluencyAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setFluencyResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowFluencyResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  // Função para tocar áudio quando palavras são clicadas
  const handleWordClick = (word: string) => {
    // Aqui você pode adicionar a lógica para tocar áudio específico
    console.log("Word clicked for audio:", word);
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Função para trocar papéis no diálogo
  const toggleDialogueSpeaker = () => {
    setDialogueParts(prev => ({
      ...prev,
      currentSpeaker: prev.currentSpeaker === "Rachel" ? "Shawn" : "Rachel"
    }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/beach-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🏖️ Lesson 22 – Lifestyle & Weekly Planning</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Practice talking about weekend plans, daily routines, and weekly activities. Improve your grammar with different pronouns.
          </p>
        </div>

        {/* DIÁLOGO - TALK TO YOUR FRIEND */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 TALK TO YOUR FRIEND</h2>
              <button 
                onClick={() => toggleSection('dialogue')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.dialogue ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <button
              onClick={toggleDialogueSpeaker}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
            >
              Trocar Papéis ({dialogueParts.currentSpeaker})
            </button>
          </div>

          {sections.dialogue && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Instrução: Leia o diálogo com um colega. Depois, pratique trocando os papéis (Rachel ↔ Shawn).
                </h3>
                
                <div className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">Hi, Shawn!</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">Hello, Rachel! How are you?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">I'm fine. Hey, do you have plans for the weekend?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">No.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">My family and I want to go to the beach on Saturday. My brother has an apartment near Santa Monica. Do you want to come?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">Yes, please! I really want to go to the beach.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">We love to stay at the beach.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">Thanks for the invitation.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">You're welcome!</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">Do you want to go on Friday or Saturday?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">My father wants to go on Friday in the evening.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">Perfect!</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="font-bold text-blue-600">R</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-700 mb-1">Rachel:</p>
                        <p className="text-gray-800">See you on Friday then, Shawn.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="font-bold text-green-600">S</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-700 mb-1">Shawn:</p>
                        <p className="text-gray-800">See you!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* VOCABULÁRIO DE APOIO */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📚 TAKE A LOOK (Vocabulário de apoio)</h2>
              <button 
                onClick={() => toggleSection('vocabulary')}
                className="ml-4 p-2 rounded-full hover:bg-yellow-600 transition"
              >
                {sections.vocabulary ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.vocabulary && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-yellow-800 mb-4">
                  Instrução: Observe as expressões e pratique usando em frases.
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">How are you?</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">Como você está?</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "Hello! How are you today?"</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">I'm fine.</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">Eu estou bem.</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "I'm fine, thank you!"</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">plan</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">plano</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "Do you have plans for the weekend?"</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">for</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">para</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "We're going to the beach for the day."</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">near</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">perto</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "My brother lives near Santa Monica."</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">invitation</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">convite</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "Thanks for the invitation!"</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-xl border-2 border-yellow-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-700">then</span>
                      <span className="text-gray-600">→</span>
                      <span className="font-medium text-gray-800">então</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">Exemplo: "See you on Friday then!"</p>
                  </div>
                </div>
              </div>
              
              {/* Imagem da praia */}
              <div className="mt-6 bg-white p-4 rounded-xl border-2 border-yellow-200">
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center">
                    <div className="text-center text-white p-4">
                      <h4 className="text-xl font-bold mb-2">🏖️ Beach Scene</h4>
                      <p className="text-sm">Representando lazer e fim de semana</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE I */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button 
                onClick={() => toggleSection('substitution1')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.substitution1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution1 && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  ✍️ Substitution Practice I – 3' - Instrução: O professor diz a frase base. Os alunos substituem a parte indicada, mantendo a estrutura.
                </h3>
                
                <div className="space-y-6">
                  {subs1Exercises.map((exercise) => {
                    // Determinar a frase correta baseada na opção selecionada
                    let currentSentence = "";
                    if (exercise.key === "subs-1") {
                      // Para "Ele vem para casa cedo/tarde/à noite"
                      const timeOptions = ["early", "late", "at night"];
                      currentSentence = `He comes home ${timeOptions[exercise.currentIndex]}.`;
                    } else if (exercise.key === "subs-2") {
                      // Para "Ela quer morar na praia. / Ele / Nós"
                      currentSentence = exercise.correctForms[exercise.currentIndex] + " to live at the beach.";
                    } else if (exercise.key === "subs-3") {
                      // Para "Ele precisa estudar português/espanhol/inglês"
                      currentSentence = `He needs to study ${exercise.options[exercise.currentIndex]}.`;
                    } else if (exercise.key === "subs-4") {
                      // Para "Ele às vezes estuda aos domingos/sábados/terças"
                      currentSentence = `He sometimes studies ${exercise.options[exercise.currentIndex]}.`;
                    } else if (exercise.key === "subs-5") {
                      // Para "Ela vai para a escola às 7:30/7:00/6:45"
                      currentSentence = `She goes to school at ${exercise.options[exercise.currentIndex]}.`;
                    } else if (exercise.key === "subs-6") {
                      // Para "Que dia é hoje? / É segunda/sexta/quinta"
                      currentSentence = `What day is today? It's ${exercise.options[exercise.currentIndex]}.`;
                    }
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-green-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-green-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-green-50 rounded-md">
                          <p className="text-green-700 font-medium text-lg">{currentSentence}</p>
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
                              {option}
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
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  ⛔ Change into Negative – 2' - Instrução: Transforme as frases abaixo para a forma negativa.
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          <span className="font-bold text-red-600">Frase:</span> {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Escreva a forma negativa..."
                          value={writtenAnswers[exercise.key] || ""}
                          onChange={(e) => handleWrittenAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(exercise.key, writtenAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition text-sm"
                        >
                          Verificar
                        </button>
                      </div>
                      
                      {showAnswerResults[exercise.key] && (
                        <AnswerResult 
                          isCorrect={answerResults[exercise.key]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SUBSTITUTION PRACTICE II */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  🔄 Substitution Practice II – 3' - Instrução: Substititua apenas a parte indicada, mantendo o restante da frase.
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    // Determinar a frase correta baseada na opção selecionada
                    let currentSentence = "";
                    if (exercise.key === "subs2-1") {
                      // Para "Eu preciso cozinhar hoje. / Nós / Você"
                      currentSentence = exercise.correctForms[exercise.currentIndex] + " to cook today.";
                    } else if (exercise.key === "subs2-2") {
                      // Para "Ele vai para o trabalho às 9:15. / escola / igreja"
                      currentSentence = `He goes to ${exercise.options[exercise.currentIndex]} at 9:15.`;
                    } else if (exercise.key === "subs2-3") {
                      // Para "Você trabalha durante a semana? / cozinha / limpa a casa"
                      currentSentence = `Do you ${exercise.options[exercise.currentIndex]} during the week?`;
                    } else if (exercise.key === "subs2-4") {
                      // Para "Nós preferimos ficar em casa aos sábados. / domingos / fins de semana"
                      currentSentence = `We prefer to stay home ${exercise.options[exercise.currentIndex]}.`;
                    } else if (exercise.key === "subs2-5") {
                      // Para "Eu estudo às segundas e quartas. / terças e quintas / segundas e sextas"
                      currentSentence = `I study ${exercise.options[exercise.currentIndex]}.`;
                    }
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-purple-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-purple-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-purple-50 rounded-md">
                          <p className="text-purple-700 font-medium text-lg">{currentSentence}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {exercise.options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => handleSubs2OptionClick(exercise.key, index)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition ${
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
            </div>
          )}
        </div>

        {/* CHANGE INTO AFFIRMATIVE */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button 
                onClick={() => toggleSection('affirmative')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">
                  Change into Affirmative - 2' - Instrução: Transforme as frases para a forma afirmativa.
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          <span className="font-bold text-teal-600">Frase:</span> {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Escreva a forma afirmativa..."
                          value={writtenAnswers[`aff-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`aff-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`aff-${exercise.key}`, writtenAnswers[`aff-${exercise.key}`] || "", exercise.answer)}
                          className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm"
                        >
                          Verificar
                        </button>
                      </div>
                      
                      {showAnswerResults[`aff-${exercise.key}`] && (
                        <AnswerResult 
                          isCorrect={answerResults[`aff-${exercise.key}`]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CHANGE INTO INTERROGATIVE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">
                  Change into Interrogative - 2' - Instrução: Transforme as frases para a forma interrogativa.
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          <span className="font-bold text-orange-600">Frase:</span> {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Escreva a forma interrogativa..."
                          value={writtenAnswers[`int-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`int-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)}
                          className="bg-orange-500 text-white py-2 px-3 rounded-md hover:bg-orange-600 transition text-sm"
                        >
                          Verificar
                        </button>
                      </div>
                      
                      {showAnswerResults[`int-${exercise.key}`] && (
                        <AnswerResult 
                          isCorrect={answerResults[`int-${exercise.key}`]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FLUENCY */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 FLUENCY</h2>
              <button 
                onClick={() => toggleSection('fluency')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">
                  Instrução: Reescreva as frases, mudando o sujeito conforme indicado.
                </h3>
                
                <div className="space-y-4">
                  {fluencyExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-indigo-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          <span className="font-bold text-indigo-600">Exemplo:</span> {exercise.base} <span className="font-bold">({exercise.subject})</span>
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder={`Escreva a frase com o sujeito "${exercise.subject}"...`}
                          value={fluencyAnswers[exercise.key] || ""}
                          onChange={(e) => handleFluencyAnswerChange(exercise.key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckFluencyAnswer(exercise.key, fluencyAnswers[exercise.key] || "", exercise.answer)}
                          className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 transition text-sm"
                        >
                          Verificar
                        </button>
                      </div>
                      
                      {showFluencyResults[exercise.key] && (
                        <AnswerResult 
                          isCorrect={fluencyResults[exercise.key]} 
                          correctAnswer={exercise.answer}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔓 UNLOCK</h2>
              <button 
                onClick={() => toggleSection('unlock')}
                className="ml-4 p-2 rounded-full hover:bg-pink-600 transition"
              >
                {sections.unlock ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.unlock && (
            <div className="p-8">
              <div className="bg-pink-100 border-2 border-pink-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-800 mb-4">
                  Instrução: Peça aos alunos para dar exemplos de:
                </h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <h4 className="font-bold text-pink-700 mb-2">1. Lugares que eles vão nos fins de semana:</h4>
                    <textarea
                      value={writtenAnswers["unlock-1"] || ""}
                      onChange={(e) => handleWrittenAnswerChange("unlock-1", e.target.value)}
                      placeholder="Exemplo: He goes to the beach on weekends. She visits her family on Sundays..."
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use o pronome na terceira pessoa do singular</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <h4 className="font-bold text-pink-700 mb-2">2. Coisas que eles fazem durante a semana:</h4>
                    <textarea
                      value={writtenAnswers["unlock-2"] || ""}
                      onChange={(e) => handleWrittenAnswerChange("unlock-2", e.target.value)}
                      placeholder="Exemplo: He works from Monday to Friday. She studies English every day..."
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use o pronome na terceira pessoa do singular</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-pink-200">
                    <h4 className="font-bold text-pink-700 mb-2">3. Coisas que parentes, amigos ou conhecidos fazem durante a semana ou nos fins de semana:</h4>
                    <textarea
                      value={writtenAnswers["unlock-3"] || ""}
                      onChange={(e) => handleWrittenAnswerChange("unlock-3", e.target.value)}
                      placeholder="Exemplo: My friend plays soccer on Saturdays. My brother watches movies on weekends..."
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use o pronome na terceira pessoa do singular</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* QUESTIONS */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-cyan-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💭 PERSONAL QUESTIONS</h2>
              <button 
                onClick={() => toggleSection('questions')}
                className="ml-4 p-2 rounded-full hover:bg-cyan-600 transition"
              >
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">
                  Responda estas perguntas pessoais sobre seu estilo de vida e planejamento semanal:
                </h3>
              </div>

              <div className="space-y-6">
                {personalQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-cyan-200 shadow-md">
                    <h4 className="text-lg font-bold text-cyan-700 mb-3">
                      {question.id}. {question.question}
                    </h4>
                    <p className="text-sm text-cyan-600 mb-3">{question.instruction}</p>
                    
                    <textarea
                      value={writtenAnswers[`q-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`q-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-32 p-3 border border-cyan-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4">💡 Dicas para escrever sobre estilo de vida:</h3>
                <ul className="list-disc pl-5 space-y-2 text-cyan-700 text-sm">
                  <li>Use verbos no presente simples para rotinas</li>
                  <li>Pratique usando diferentes pronomes: he, she, they, we</li>
                  <li>Inclua expressões de tempo: on weekends, during the week, every day</li>
                  <li>Descreva atividades específicas que você faz em diferentes dias</li>
                  <li>Mencione lugares que você frequenta regularmente</li>
                  <li>Salve suas respostas para acompanhar seu progresso</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Save Button and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2"
            >
              <span>💾</span> Salvar Todas as Minhas Respostas
            </button>
            <button
              onClick={clearAllAnswers}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300"
            >
              Limpar Tudo
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson21")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Lição Anterior
            </button>
            <button
              onClick={() => router.push("/cursos/lesson23")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Próxima Lição &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}