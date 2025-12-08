"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, Check, XCircle } from "lucide-react";

// Dados da Lição 12 - Atualizados com o conteúdo fornecido
const substitutionPractice1 = [
  { 
    key: "subs-1", 
    original: "Eu vivo (minha casa / minha mãe / irmã)",
    base: "I live {0}.",
    options: ["at my house", "with my mother", "with my sister"],
    currentIndex: 0
  },
  { 
    key: "subs-2", 
    original: "Eu como comida com (meu irmão / chefe / meus filhos)",
    base: "I eat food with {0}.",
    options: ["my brother", "my boss", "my children"],
    currentIndex: 0
  },
  { 
    key: "subs-3", 
    original: "Eu quero ir para os Estados Unidos com (minha esposa / meu marido / minha família)",
    base: "I want to go to the U.S.A. with {0}.",
    options: ["my wife", "my husband", "my family"],
    currentIndex: 0
  },
  { 
    key: "subs-4", 
    original: "O que você quer comer? (carne / verdura / batata)",
    base: "What do you want to eat? {0}",
    options: ["meat", "vegetables", "potatoes"],
    currentIndex: 0
  },
  { 
    key: "subs-5", 
    original: "Aonde você quer ir amanhã? (à tarde / à noite)",
    base: "Where do you want to go tomorrow? {0}",
    options: ["in the afternoon", "at night"],
    currentIndex: 0
  }
];

const substitutionPractice2 = [
  { 
    key: "subs2-1", 
    original: "O que você quer preferir? (ler / beber)",
    base: "What do you prefer to {0}?",
    options: ["read", "drink"],
    currentIndex: 0
  },
  { 
    key: "subs2-2", 
    original: "O que você quer comer amanhã? (arroz / salada / batata)",
    base: "What do you want to eat tomorrow? {0}",
    options: ["rice", "salad", "potatoes"],
    currentIndex: 0
  },
  { 
    key: "subs2-3", 
    original: "O que você quer estudar? (gostar / preferir / morar)",
    base: "What do you want to {0}?",
    options: ["like", "prefer", "live"],
    currentIndex: 0
  },
  { 
    key: "subs2-4", 
    original: "Você gosta de falar com (minha professora / meu primo / minha avó)",
    base: "Do you like to talk with {0}?",
    options: ["my teacher", "my cousin", "my grandmother"],
    currentIndex: 0
  },
  { 
    key: "subs2-5", 
    original: "O que você quer aprender? (morar / estudar / comer)",
    base: "What do you want to learn? {0}",
    options: ["to live", "to study", "to eat"],
    currentIndex: 0
  }
];

const negativeExercises = [
  { 
    key: "neg-1", 
    sentence: "I want to go to the U.S.A.",
    answer: "I don't want to go to the U.S.A."
  },
  { 
    key: "neg-2", 
    sentence: "We go to school.",
    answer: "We don't go to school."
  },
  { 
    key: "neg-3", 
    sentence: "They live in that country.",
    answer: "They don't live in that country."
  },
  { 
    key: "neg-4", 
    sentence: "I like to speak English.",
    answer: "I don't like to speak English."
  },
  { 
    key: "neg-5", 
    sentence: "She speaks very well with her English teacher.",
    answer: "She doesn't speak very well with her English teacher."
  },
  { 
    key: "neg-6", 
    sentence: "I understand my children.",
    answer: "I don't understand my children."
  }
];

const affirmativeExercises = [
  { 
    key: "aff-1", 
    sentence: "They don't want to go there.",
    answer: "They want to go there."
  },
  { 
    key: "aff-2", 
    sentence: "I don't speak English at home.",
    answer: "I speak English at home."
  },
  { 
    key: "aff-3", 
    sentence: "We don't like that country.",
    answer: "We like that country."
  },
  { 
    key: "aff-4", 
    sentence: "She doesn't want that language.",
    answer: "She wants that language."
  },
  { 
    key: "aff-5", 
    sentence: "I don't want to live in Brazil.",
    answer: "I want to live in Brazil."
  }
];

const interrogativeExercises = [
  { 
    key: "int-1", 
    sentence: "They like to speak German at school.",
    answer: "Do they like to speak German at school?"
  },
  { 
    key: "int-2", 
    sentence: "You speak to teachers.",
    answer: "Do you speak to teachers?"
  },
  { 
    key: "int-3", 
    sentence: "He wants to live in the U.K. with my family.",
    answer: "Does he want to live in the U.K. with my family?"
  },
  { 
    key: "int-4", 
    sentence: "They like to study in this country.",
    answer: "Do they like to study in this country?"
  },
  { 
    key: "int-5", 
    sentence: "I see my children at home in the evening.",
    answer: "Do I see my children at home in the evening?"
  }
];

const listenPracticeSentences = [
  { 
    key: "listen-1", 
    sentence: "Do you speak German with your co-worker?",
    audioSrc: ""
  },
  { 
    key: "listen-2", 
    sentence: "I want to go to the U.S.A.",
    audioSrc: ""
  },
  { 
    key: "listen-3", 
    sentence: "My husband and I want to live in France.",
    audioSrc: ""
  },
  { 
    key: "listen-4", 
    sentence: "I see my children at home in the evening.",
    audioSrc: ""
  },
  { 
    key: "listen-5", 
    sentence: "Do you speak English with your friends at school?",
    audioSrc: ""
  },
  { 
    key: "listen-6", 
    sentence: "They want to study in the U.K.",
    audioSrc: ""
  }
];

const unlockQuestions = [
  {
    id: 1,
    question: "What languages do you want to speak?",
    placeholder: "Write about the languages you want to speak..."
  },
  {
    id: 2,
    question: "Do you speak English at home, too?",
    placeholder: "Answer yes or no and explain..."
  },
  {
    id: 3,
    question: "Do you want to go to the U.S.A.?",
    placeholder: "Explain why or why not..."
  },
  {
    id: 4,
    question: "What's your first and last name?",
    placeholder: "Write your full name..."
  },
  {
    id: 5,
    question: "Where do you live?",
    placeholder: "Describe where you live..."
  },
  {
    id: 6,
    question: "Do you live at home, with friends, or with your family?",
    placeholder: "Explain your living situation..."
  },
  {
    id: 7,
    question: "Do your co-workers speak English?",
    placeholder: "Answer and give details..."
  },
  {
    id: 8,
    question: "Do you want to live abroad?",
    placeholder: "Explain where and why..."
  },
  {
    id: 9,
    question: "Where do you see your friends and family?",
    placeholder: "Describe where you meet them..."
  },
  {
    id: 10,
    question: "Do you want to study in the U.K.?",
    placeholder: "Explain your answer..."
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

// Componente para mostrar resultado da avaliação
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

// Diálogo "There and Around"
const thereAndAroundDialogue = [
  { speaker: "A", text: "I want to book a flight, please.", audioSrc: "" },
  { speaker: "B", text: "Sure! Please, take a seat.", audioSrc: "" },
  { speaker: "A", text: "Do you want a round-trip ticket or a one-way ticket?", audioSrc: "" },
  { speaker: "B", text: "A one-way ticket, please.", audioSrc: "" },
  { speaker: "A", text: "Thank you very much.", audioSrc: "" },
  { speaker: "B", text: "It's my pleasure.", audioSrc: "" }
];

export default function Lesson12LanguagesAndCountries() {
  const router = useRouter();
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    listenAndPractice: true,
    substitution1: true,
    negative: true,
    substitution2: true,
    affirmative: true,
    interrogative: true,
    thereAndAround: true,
    unlock: true
  });
  
  // Estados para as práticas de substituição
  const [subs1Exercises, setSubs1Exercises] = useState(substitutionPractice1);
  const [subs2Exercises, setSubs2Exercises] = useState(substitutionPractice2);
  
  // Estados para as respostas escritas
  const [writtenAnswers, setWrittenAnswers] = useState<Record<string, string>>({});
  
  // Estados para avaliação de respostas
  const [answerResults, setAnswerResults] = useState<Record<string, boolean>>({});
  const [showAnswerResults, setShowAnswerResults] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Carregar respostas salvas do localStorage
    const savedAnswers = localStorage.getItem("lesson12Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        setSubs1Exercises(data.subs1Exercises || substitutionPractice1);
        setSubs2Exercises(data.subs2Exercises || substitutionPractice2);
        setWrittenAnswers(data.writtenAnswers || {});
      } catch (error) {
        console.error("Error loading saved answers:", error);
      }
    }
  }, []);

  const saveAllAnswers = async () => {
    const data = {
      subs1Exercises,
      subs2Exercises,
      writtenAnswers,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem("lesson12Answers", JSON.stringify(data));
    alert("All answers saved successfully to your browser!");
  };

  // Funções para manipular as práticas de substituição
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

  // Função para verificar respostas
  const handleCheckAnswer = (exerciseKey: string, userAnswer: string, correctAnswer: string) => {
    const isCorrect = checkAnswer(userAnswer, correctAnswer);
    setAnswerResults(prev => ({ ...prev, [exerciseKey]: isCorrect }));
    setShowAnswerResults(prev => ({ ...prev, [exerciseKey]: true }));
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/world-map-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🌍 LESSON 12 – Languages & Countries</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Listen and Practice conversations about travel, family, and daily activities. Improve your communication skills.
          </p>
        </div>

        {/* LISTEN AND PRACTICE */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">👂 LISTEN AND PRACTICE</h2>
              <button 
                onClick={() => toggleSection('listenAndPractice')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.listenAndPractice ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listenAndPractice && (
            <div className="p-8">
              <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  Practice these sentences:
                </h3>
                
                <div className="space-y-4 bg-white p-6 rounded-lg border border-blue-200">
                  {listenPracticeSentences.map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <p className="text-gray-800 font-medium">{item.sentence}</p>
                      {item.audioSrc && <SimpleAudioPlayer src={item.audioSrc} />}
                    </div>
                  ))}
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
                  Substitution Practice I - Click on the options to change the sentences:
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
                          <p className="text-green-700 font-medium">{currentSentence}</p>
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
                  Change into Negative - Transform to negative:
                </h3>
                
                <div className="space-y-4">
                  {negativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-red-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
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

        {/* DRILLING PRACTICE - SUBSTITUTION PRACTICE II */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button 
                onClick={() => toggleSection('substitution2')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.substitution2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.substitution2 && (
            <div className="p-8">
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">
                  Substitution Practice II - Click to substitute:
                </h3>
                
                <div className="space-y-6">
                  {subs2Exercises.map((exercise) => {
                    const currentSentence = exercise.base.replace('{0}', exercise.options[exercise.currentIndex]);
                    
                    return (
                      <div key={exercise.key} className="bg-white p-4 rounded-lg border border-orange-200">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                          <p className="font-medium text-gray-700 flex-1">
                            <span className="text-orange-600">{exercise.original}</span>
                          </p>
                        </div>
                        
                        <div className="mb-3 p-3 bg-orange-50 rounded-md">
                          <p className="text-orange-700 font-medium">{currentSentence}</p>
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
                  Change into Affirmative - Transform to affirmative:
                </h3>
                
                <div className="space-y-4">
                  {affirmativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-teal-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write affirmative form..."
                          value={writtenAnswers[`aff-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`aff-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`aff-${exercise.key}`, writtenAnswers[`aff-${exercise.key}`] || "", exercise.answer)}
                          className="bg-teal-500 text-white py-2 px-3 rounded-md hover:bg-teal-600 transition text-sm"
                        >
                          Check
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
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-indigo-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button 
                onClick={() => toggleSection('interrogative')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-600 transition"
              >
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <div className="bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">
                  Change into Interrogative - Transform to questions:
                </h3>
                
                <div className="space-y-4">
                  {interrogativeExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-indigo-200">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                        <p className="font-medium text-gray-700 flex-1">
                          {exercise.sentence}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          placeholder="Write question form..."
                          value={writtenAnswers[`int-${exercise.key}`] || ""}
                          onChange={(e) => handleWrittenAnswerChange(`int-${exercise.key}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-indigo-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => handleCheckAnswer(`int-${exercise.key}`, writtenAnswers[`int-${exercise.key}`] || "", exercise.answer)}
                          className="bg-indigo-500 text-white py-2 px-3 rounded-md hover:bg-indigo-600 transition text-sm"
                        >
                          Check
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

        {/* THERE AND AROUND */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🛫 THERE AND AROUND</h2>
              <button 
                onClick={() => toggleSection('thereAndAround')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.thereAndAround ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.thereAndAround && (
            <div className="p-8">
              <div className="bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">
                  Practice this dialogue about booking a flight:
                </h3>
                
                <div className="space-y-4 bg-white p-6 rounded-lg border border-purple-200">
                  {thereAndAroundDialogue.map((line, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className={`min-w-8 font-bold ${
                        line.speaker === "A" ? "text-blue-600" : "text-green-600"
                      }`}>
                        {line.speaker}:
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{line.text}</p>
                        {line.audioSrc && <SimpleAudioPlayer src={line.audioSrc} />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNLOCK */}
        <div className="bg-pink-50 border-2 border-pink-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-pink-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔓 UNLOCK - QUESTIONS</h2>
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
              <div className="mb-6">
                <h3 className="text-xl font-bold text-pink-800 mb-4">
                  Questions - Practice writing answers:
                </h3>
                <p className="text-pink-600 mb-6">
                  Answer these questions to practice your communication skills.
                </p>
              </div>

              <div className="space-y-6">
                {unlockQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-pink-200 shadow-md">
                    <h4 className="text-lg font-bold text-pink-700 mb-3">
                      {question.id}. {question.question}
                    </h4>
                    
                    <textarea
                      value={writtenAnswers[`unlock-${question.id}`] || ""}
                      onChange={(e) => handleWrittenAnswerChange(`unlock-${question.id}`, e.target.value)}
                      placeholder={question.placeholder}
                      className="w-full h-24 p-3 border border-pink-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-pink-100 border-2 border-pink-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-pink-800 mb-4">💡 Writing Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-pink-700 text-sm">
                  <li>Use complete sentences to practice grammar</li>
                  <li>Be specific about your preferences and reasons</li>
                  <li>Describe your daily routines and habits</li>
                  <li>Talk about your family and living situation</li>
                  <li>Practice different ways to express preferences</li>
                  <li>Save your answers to track your progress</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Save Button and Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <button
            onClick={saveAllAnswers}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300"
          >
            💾 Save All My Answers
          </button>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos/lesson11")}
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              &larr; Previous Lesson
            </button>
            <button
              onClick={() => router.push("/cursos/lesson13")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}