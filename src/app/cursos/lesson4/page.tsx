"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X } from "lucide-react";

const listenItems = [
  { 
    key: "a-like-coffee", 
    label: "", 
    image: "/images/coffee-image.jpg", 
    correctAnswer: "I like to drink coffee.",
    originalSentence: "I drink coffee. (like)"
  },
  { 
    key: "b-want-bread", 
    label: "", 
    image: "/images/breadandbutter-image.jpg", 
    correctAnswer: "I want to eat bread and butter for breakfast.",
    originalSentence: "I eat bread and butter for breakfast. (want)"
  },
  { 
    key: "c-want-juice", 
    label: "", 
    image: "/images/orange-juice.jpg", 
    correctAnswer: "I want to drink orange juice.",
    originalSentence: "I drink orange juice. (want)"
  },
  { 
    key: "d-like-pancakes", 
    label: "", 
    image: "/images/pancakes-and-butter.jpg", 
    correctAnswer: "I like to eat banana pancakes for breakfast.",
    originalSentence: "I eat banana pancakes for breakfast. (like)"
  },
  { 
    key: "e-like-cereal", 
    label: "", 
    image: "/images/cereal-and-honey.jpg", 
    correctAnswer: "I like to eat cereal and honey.",
    originalSentence: "I eat cereal and honey. (like)"
  },
  { 
    key: "f-want-cereal", 
    label: "", 
    image: "/images/cereal.jpg", 
    correctAnswer: "I want to eat cereal for breakfast.",
    originalSentence: "I eat cereal for breakfast. (want)"
  },
];

const example2Items = [
  { 
    key: "a-eggs", 
    label: "", 
    image: "/images/eggs-breakfast.jpg", 
    correctAnswer: "I don't want to eat eggs for breakfast.",
    originalSentence: "I want to eat eggs for breakfast. (negative)"
  },
  { 
    key: "b-water", 
    label: "", 
    image: "/images/water.jpg", 
    correctAnswer: "I don't want to drink water.",
    originalSentence: "I want to drink water. (negative)"
  },
  { 
    key: "c-chocolate", 
    label: "", 
    image: "/images/chocolate-image.jpg", 
    correctAnswer: "I don't want to eat a piece of chocolate.",
    originalSentence: "I want to eat a piece of chocolate. (negative)"
  },
  { 
    key: "d-pie", 
    label: "", 
    image: "/images/apple-pie-image.jpg", 
    correctAnswer: "I don't want a slice of apple pie.",
    originalSentence: "I want a slice of apple pie. (negative)"
  },
  { 
    key: "e-tea", 
    label: "", 
    image: "/images/apple-tea-image.jpg", 
    correctAnswer: "I don't want to drink apple tea.",
    originalSentence: "I want to drink apple tea. (negative)"
  },
  { 
    key: "f-coffee-milk", 
    label: "", 
    image: "/images/coffeewithmilk-image.jpg", 
    correctAnswer: "I don't want to drink coffee with milk.",
    originalSentence: "I want to drink coffee with milk. (negative)"
  },
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

// Componente simples para tocar áudio
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

interface VideoQuestion {
  id: number;
  question: string;
  correctAnswer: string;
  userAnswer: string;
  vocabulary?: { english: string; portuguese: string }[];
}

export default function LessonFoodAndDrink() {
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [notes2, setNotes2] = useState<Record<string, string>>({});
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [showAnswers2, setShowAnswers2] = useState<Record<string, boolean>>({});
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showPracticeAnswers, setShowPracticeAnswers] = useState<Record<string, boolean>>({});
  const [grammarAnswers, setGrammarAnswers] = useState<Record<string, string>>({});
  const [showGrammarAnswers, setShowGrammarAnswers] = useState<Record<string, boolean>>({});
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    fluency: true,
    grammar: true,
    speaking: true,
    pronunciation: true,
    tuneIn: true
  });

  // Estados para as questões do vídeo - ATUALIZADAS
  const [videoQuestions, setVideoQuestions] = useState<VideoQuestion[]>([
    {
      id: 1,
      question: "Tell a little bit about the countries mentioned in this video.",
      correctAnswer: "The video mentions countries like India, which is in South Asia, Spain, and Wales. They all have rich cultures, traditions, and beautiful places.",
      userAnswer: "",
      vocabulary: [
        { english: "also", portuguese: "também" },
        { english: "Too", portuguese: "também" },
        { english: "Spain", portuguese: "Espanha" },
        { english: "South Africa", portuguese: "Africa do Sul" },
        { english: "India", portuguese: "India" },
        { english: "The USA", portuguese: "Os Estados Unidos" },
      ]
    },
    {
      id: 2,
      question: "What is one of the most spoken languages in India?",
      correctAnswer: "Hindi is one of the most spoken languages in India.",
      userAnswer: "",
      vocabulary: [
        { english: "Cities, mountains and rivers", portuguese: "cidades, montanhas e rios" },
        { english: "India is in South Asia", portuguese: "A Índia fica no sul da Ásia" },
        { english: "To grow up", portuguese: "Crescer" },
        { english: "To miss", portuguese: "Sentir saudade" },
        { english: "To speak", portuguese: "Falar" },
        { english: "People", portuguese: "Pessoas" },
      ]
    },
    {
      id: 3,
      question: "Would you like to visit South Africa?",
      correctAnswer: "On a rainy day, you can visit friends, watch movies, or go for a quiet drive.",
      userAnswer: "",
      vocabulary: [
        { english: "Wonderful", portuguese: "maravilhoso(a)" },
        { english: "A little bit", portuguese: "um pouquinho" },
        { english: "Beaches", portuguese: "Praias" },
        { english: "Summer", portuguese: "Verão" },
        { english: "Great weather", portuguese: "Clima ótimo" },
        { english: "Culture", portuguese: "Cultura" }
      ]
    },
    {
      id: 4,
      question: "What do we need to use when it gets really hot?",
      correctAnswer: "We need an air conditioning or a fan when it gets really hot.",
      userAnswer: "",
      vocabulary: [
        { english: "Fan", portuguese: "Ventilador" },
        { english: "Air conditioning", portuguese: "ar-condicionado" },
        { english: "Fresh air", portuguese: "ar fresco" },
     ]
    }
  ]);

  const handleChange = (key: string, value: string, isExample2 = false) => {
    if (isExample2) {
      setNotes2((prev) => ({ ...prev, [key]: value }));
    } else {
      setNotes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handlePracticeChange = (key: string, value: string) => {
    setPracticeAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleGrammarChange = (key: string, value: string) => {
    setGrammarAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoQuestions(prev => 
      prev.map(question => 
        question.id === id ? { ...question, userAnswer: value } : question
      )
    );
  };

  const handleCheck = (key: string, isExample2 = false) => {
    if (isExample2) {
      setShowAnswers2((prev) => ({ ...prev, [key]: true }));
    } else {
      setShowAnswers((prev) => ({ ...prev, [key]: true }));
    }
  };

  const handlePracticeCheck = (key: string, correctAnswer: string) => {
    setShowPracticeAnswers((prev) => ({ ...prev, [key]: true }));
  };

  const handleGrammarCheck = (key: string, correctAnswer: string) => {
    setShowGrammarAnswers((prev) => ({ ...prev, [key]: true }));
  };

  const saveVideoAnswers = async () => {
    alert("Respostas salvas localmente!");
  };

  const checkVideoAnswer = (id: number) => {
    const question = videoQuestions.find(q => q.id === id);
    if (question) {
      const isCorrect = question.userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase());
      alert(isCorrect ? '✅ Resposta correta!' : `❌ Resposta esperada: ${question.correctAnswer}`);
    }
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const practiceExercises = [
    { key: "practice-1", sentence: "I drink __________. (like)", answer: "I like to drink [bebida]." },
    { key: "practice-2", sentence: "I eat __________ for lunch. (want)", answer: "I want to eat [comida] for lunch." },
    { key: "practice-3", sentence: "I drink __________ in the morning. (want)", answer: "I want to drink [bebida] in the morning." },
    { key: "practice-4", sentence: "I eat __________ for breakfast. (like)", answer: "I like to eat [comida] for breakfast." },
    { key: "practice-5", sentence: "I eat __________ with honey. (like)", answer: "I like to eat [comida] with honey." },
    { key: "practice-6", sentence: "I eat __________ at night. (want)", answer: "I want to eat [comida] at night." }
  ];

  const grammarExercises = [
    { 
      key: "grammar-1", 
      sentence: "I drink tea every day. (like)", 
      correctAnswer: "I like to drink tea every day.",
      audio: "/audios/i-drink-tea-everyday.mp3"
    },
    { 
      key: "grammar-2", 
      sentence: "We eat dinner at 7 PM. (want)", 
      correctAnswer: "We want to eat dinner at 7 PM.",
      audio: "/audios/we-eat-dinner-at-7pm.mp3"
    },
    { 
      key: "grammar-3", 
      sentence: "He wants to eat chocolate. (negative)", 
      correctAnswer: "He doesn't want to eat chocolate.",
      audio: "/audios/he-wants-to-eat-chocolate.mp3"
    }
  ];

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson3-bg.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📖 Lesson 4 – Food & Drink</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 Esta lição foi feita para praticar estruturas com "like" e "want". Complete os exercícios e pratique a pronúncia.
          </p>
        </div>

        {/* FLUENCY */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 FLUENCY</h2>
              <button 
                onClick={() => toggleSection('fluency')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              {/* Exemplo 1 */}
              <div className="mb-8 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">🔹 Exemplo 1</h3>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-orange-700">I drink juice. (like)</p>
                  <p className="text-orange-700 font-bold">➡ I like to drink juice.</p>
                </div>
                
                <h4 className="text-lg font-bold text-gray-800 mb-4">1. Transforme as frases (like / want)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {listenItems.map((item) => (
                    <div key={item.key} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-orange-200">
                      <div className="w-[180px] h-[180px] relative mb-4">
                        <Image 
                          src={item.image} 
                          alt={item.label} 
                          fill
                          className="rounded-lg object-cover border-2 border-orange-300"
                        />
                      </div>

                      <div className="w-full mb-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">{item.originalSentence}</p>
                        <textarea
                          placeholder="Escreva aqui a frase transformada..."
                          value={notes[item.key] || ""}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          className="w-full h-[60px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => handleCheck(item.key)}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition font-medium"
                        >
                          Verificar
                        </button>
                        
                        <button
                          onClick={() => {
                            handleChange(item.key, "");
                            setShowAnswers(prev => ({ ...prev, [item.key]: false }));
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Limpar
                        </button>
                      </div>

                      {showAnswers[item.key] && (
                        <div className="mt-3 w-full p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700">
                            ✅ <span className="font-medium">Resposta correta:</span> {item.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Exemplo 2 - FRASES NEGATIVAS */}
              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">🔹 Exemplo 2 - Frases Negativas</h3>
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-orange-700">I want granola.</p>
                  <p className="text-orange-700 font-bold">➡ I don't want granola.</p>
                </div>
                
                <h4 className="text-lg font-bold text-gray-800 mb-4">2. Transforme as frases em negativas (don't want)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {example2Items.map((item) => (
                    <div key={item.key} className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md border border-orange-200">
                      <div className="w-[180px] h-[180px] relative mb-4">
                        <Image 
                          src={item.image} 
                          alt={item.label} 
                          fill
                          className="rounded-lg object-cover border-2 border-orange-300"
                        />
                      </div>

                      <div className="w-full mb-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">{item.originalSentence}</p>
                        <textarea
                          placeholder="Escreva aqui a frase negativa..."
                          value={notes2[item.key] || ""}
                          onChange={(e) => handleChange(item.key, e.target.value, true)}
                          className="w-full h-[60px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => handleCheck(item.key, true)}
                          className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition font-medium"
                        >
                          Verificar
                        </button>
                        
                        <button
                          onClick={() => {
                            handleChange(item.key, "", true);
                            setShowAnswers2(prev => ({ ...prev, [item.key]: false }));
                          }}
                          className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                        >
                          Limpar
                        </button>
                      </div>

                      {showAnswers2[item.key] && (
                        <div className="mt-3 w-full p-3 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-sm text-green-700">
                            ✅ <span className="font-medium">Resposta correta:</span> {item.correctAnswer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Prática com campos de digitação */}
              <div className="mt-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <h4 className="text-lg font-bold text-blue-800 mb-4">🏋️ Prática para você fazer</h4>
                <p className="text-blue-700 mb-4">Complete as frases substituindo as palavras para praticar:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {practiceExercises.map((exercise) => (
                    <div key={exercise.key} className="bg-white p-4 rounded-lg border border-blue-200">
                      <p className="font-medium text-blue-700 mb-2">{exercise.sentence}</p>
                      <textarea
                        placeholder="Digite sua frase completa aqui..."
                        value={practiceAnswers[exercise.key] || ""}
                        onChange={(e) => handlePracticeChange(exercise.key, e.target.value)}
                        className="w-full h-[60px] resize-none p-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handlePracticeCheck(exercise.key, exercise.answer)}
                          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition text-sm"
                        >
                          Verificar
                        </button>
                        <button
                          onClick={() => handlePracticeChange(exercise.key, "")}
                          className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm"
                        >
                          Limpar
                        </button>
                      </div>
                      
                      {showPracticeAnswers[exercise.key] && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-xs text-green-700">
                            ✅ <span className="font-medium">Exemplo:</span> {exercise.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-green-50 p-3 rounded-lg border border-green-200">
                  <h5 className="font-bold text-green-800 mb-2">💡 Dica:</h5>
                  <p className="text-xs text-green-700">
                    Lembre-se de usar "like to" para gostar de fazer algo e "want to" para querer fazer algo.
                    Exemplo: "I drink tea" + (like) → "I like to drink tea."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* UNDERSTAND GRAMMAR */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📚 UNDERSTAND GRAMMAR</h2>
              <button 
                onClick={() => toggleSection('grammar')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.grammar ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.grammar && (
            <div className="p-8">
              <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-800 mb-4">👉 Como usar dois verbos juntos de forma natural</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="text-lg font-bold text-green-700 mb-3">🔹 LIKE TO + Verbo</h4>
                    <p className="text-gray-700 mb-3">Quando você quer dizer que <strong>gosta de fazer</strong> algo:</p>
                    <div className="bg-green-50 p-3 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">I like to drink coffee.</p>
                        <p className="text-green-600 text-sm">(Eu gosto de beber café)</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-like-to-drink-coffee.mp3" />
                    </div>
                    <div className="bg-green-50 p-3 rounded-md mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">She likes to eat pizza.</p>
                        <p className="text-green-600 text-sm">(Ela gosta de comer pizza)</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/she-likes-to-eat-pizza.mp3" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="text-lg font-bold text-green-700 mb-3">🔹 WANT TO + Verbo</h4>
                    <p className="text-gray-700 mb-3">Quando você quer dizer que <strong>quer fazer</strong> algo:</p>
                    <div className="bg-green-50 p-3 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">I want to eat breakfast.</p>
                        <p className="text-green-600 text-sm">(Eu quero comer café da manhã)</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-want-to-eat-breakfast.mp3" />
                    </div>
                    <div className="bg-green-50 p-3 rounded-md mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-green-700 font-medium">They want to drink juice.</p>
                        <p className="text-green-600 text-sm">(Eles querem beber suco)</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/they-want-to-drink-juice.mp3" />
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-green-200">
                    <h4 className="text-lg font-bold text-green-700 mb-3">🔹 Na fala rápida</h4>
                    <p className="text-gray-700 mb-3">As pessoas geralmente falam de forma mais rápida e natural:</p>
                    <div className="bg-yellow-50 p-3 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-yellow-700 font-medium">I want to → I wanna</p>
                        <p className="text-yellow-600 text-sm">I want to eat → I wanna eat</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-wanna-eat.mp3" />
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-md mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-yellow-700 font-medium">I don't want to → I don't wanna</p>
                        <p className="text-yellow-600 text-sm">I don't want to drink → I don't wanna drink</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-dont-wanna-drink.mp3" />
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-blue-800 mb-3">🎯 Pratique agora:</h4>
                    <div className="space-y-4">
                      {grammarExercises.map((exercise) => (
                        <div key={exercise.key} className="bg-white p-3 rounded-lg border border-blue-200">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium text-blue-700">{exercise.sentence}</p>
                            <SimpleAudioPlayer src={exercise.audio} />
                          </div>
                          <textarea
                            placeholder="Digite sua resposta aqui..."
                            value={grammarAnswers[exercise.key] || ""}
                            onChange={(e) => handleGrammarChange(exercise.key, e.target.value)}
                            className="w-full h-[50px] resize-none p-2 border border-blue-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => handleGrammarCheck(exercise.key, exercise.correctAnswer)}
                              className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition text-sm"
                            >
                              Verificar
                            </button>
                            <button
                              onClick={() => handleGrammarChange(exercise.key, "")}
                              className="bg-gray-200 text-gray-700 py-1 px-3 rounded-md hover:bg-gray-300 transition text-sm"
                            >
                              Limpar
                            </button>
                          </div>
                          
                          {showGrammarAnswers[exercise.key] && (
                            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                              <p className="text-xs text-green-700">
                                ✅ <span className="font-medium">Resposta correta:</span> {exercise.correctAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SPEAKING PRACTICE */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ SPEAKING PRACTICE</h2>
              <button 
                onClick={() => toggleSection('speaking')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.speaking ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speaking && (
            <div className="p-8">
              <div className="mb-8 bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">👉 O objetivo aqui é repetir e substituir palavras para praticar vocabulário e fluência.</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Parte A – Estrutura "I like to..."</h4>
                    <div className="bg-white p-4 rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I like to drink coffee.</p>
                        <p className="text-gray-600 text-sm">➡ troque coffee por: tea / milk / orange juice / lemonade</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-like-to-drink-coffee.mp3" />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200 mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I like to eat cereal and honey.</p>
                        <p className="text-gray-600 text-sm">➡ troque cereal and honey por: bread and butter / eggs / pancakes / fruit</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-like-to-eat-cereal-and-honey.mp3" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Parte B – Estrutura "I want to..."</h4>
                    <div className="bg-white p-4 rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I want to eat bread and butter for breakfast.</p>
                        <p className="text-gray-600 text-sm">➡ troque bread and butter por: chocolate / eggs / a sandwich / pizza</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-want-to-eat-bread-and-butter-for-breakfast.mp3" />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200 mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I want to drink orange juice.</p>
                        <p className="text-gray-600 text-sm">➡ troque orange juice por: water / apple tea / coffee with milk / hot chocolate</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-want-to-drink-orange-juice.mp3" />
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-3">Parte C – Frases Negativas</h4>
                    <div className="bg-white p-4 rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I don't want to eat eggs.</p>
                        <p className="text-gray-600 text-sm">➡ troque eggs por: cereal / pizza / chocolate / bread</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-dont-want-to-eat-eggs.mp3" />
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200 mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-gray-700 mb-2">I don't like to drink coffee.</p>
                        <p className="text-gray-600 text-sm">➡ troque coffee por: tea / milk / juice / water</p>
                      </div>
                      <SimpleAudioPlayer src="/audios/i-dont-like-to-drink-coffee.mp3" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-800 mb-4">Vocabulary Practice:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    "coffee", "tea", "milk", "juice", "water",
                    "bread", "butter", "cereal", "pancakes", "fruit",
                    "chocolate", "eggs", "sandwich", "pizza", "honey"
                  ].map((item) => (
                    <div key={item} className="relative group">
                      <button
                        onClick={() => {
                          const audio = new Audio(`/audios/${item}.mp3`);
                          audio.play().catch(e => console.log("Audio error:", e));
                        }}
                        className="w-full bg-red-200 hover:bg-red-300 text-red-800 py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <Volume2 size={16} />
                        {item}
                      </button>
                      <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        Clique para ouvir
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* IMPROVE YOUR PRONUNCIATION */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎙️ IMPROVE YOUR PRONUNCIATION</h2>
              <button 
                onClick={() => toggleSection('pronunciation')}
                className="ml-4 p-2 rounded-full hover:bg-purple-700 transition"
              >
                {sections.pronunciation ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.pronunciation && (
            <div className="p-8">
              <div className="mb-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">👉 Foque na pronúncia das palavras e expressões. Repita em voz alta:</h3>
                
                <div className="space-y-6">
                  {/* Like to eat */}
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-purple-700">🔹 like to eat</h4>
                      <AudioPlayer src="/audios/like-to-eat.mp3" compact />
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-md">
                      <p className="text-gray-700 font-medium">I like to eat.</p>
                      <AudioPlayer src="/audios/i-like-to-eat.mp3" compact />
                    </div>
                  </div>

                  {/* A piece of bread */}
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-purple-700">🔹 a piece of bread</h4>
                      <AudioPlayer src="/audios/a-piece-of-bread.mp3" compact />
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-md">
                      <p className="text-gray-700 font-medium">I want a piece of bread.</p>
                      <AudioPlayer src="/audios/i-want-a-piece-of-bread.mp3" compact />
                    </div>
                  </div>

                  {/* Orange juice */}
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-purple-700">🔹 orange juice</h4>
                      <AudioPlayer src="/audios/orange-juice.mp3" compact />
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-md">
                      <p className="text-gray-700 font-medium">I want orange juice.</p>
                      <AudioPlayer src="/audios/i-want-orange-juice.mp3" compact />
                    </div>
                  </div>

                  {/* Apple pie */}
                  <div className="bg-white p-4 rounded-lg border border-purple-300">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-purple-700">🔹 apple pie</h4>
                      <AudioPlayer src="/audios/apple-pie.mp3" compact />
                    </div>
                    <div className="flex items-center justify-between bg-purple-50 p-3 rounded-md">
                      <p className="text-gray-700 font-medium">I like apple pie.</p>
                      <AudioPlayer src="/audios/i-like-apple-pie.mp3" compact />
                    </div>
                  </div>
                </div>

                {/* Dicas de Pronúncia */}
                <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-yellow-800 mb-3">💡 Dicas para esta seção:</h4>
                  <ul className="space-y-2 text-yellow-700 text-sm">
                    <li>• <strong>"like to"</strong> - Na fala rápida, soa como "laik tə"</li>
                    <li>• <strong>"a piece of"</strong> - "of" quase desaparece, soando como "ə piːs ə"</li>
                    <li>• <strong>"orange juice"</strong> - Pratique o "j" forte em "juice"</li>
                    <li>• <strong>"apple pie"</strong> - Atenção ao "a" curto em "apple" e "i" longo em "pie"</li>
                    <li>• Repita cada frase várias vezes até soar natural</li>
                  </ul>
                </div>

                {/* Prática Adicional */}
                <div className="mt-6 bg-green-50 border-2 border-green-300 rounded-xl p-4">
                  <h4 className="text-lg font-bold text-green-800 mb-3">🏋️ Prática Extra:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="font-medium text-green-700">I like to eat apple pie.</p>
                      <AudioPlayer src="/audios/i-like-to-eat-apple-pie.mp3" compact />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="font-medium text-green-700">I want a piece of bread.</p>
                      <AudioPlayer src="/audios/i-want-a-piece-of-bread.mp3" compact />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="font-medium text-green-700">I like orange juice.</p>
                      <AudioPlayer src="/audios/i-like-orange-juice.mp3" compact />
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-green-200">
                      <p className="font-medium text-green-700">I want to eat.</p>
                      <AudioPlayer src="/audios/i-want-to-eat.mp3" compact />
                    </div>
                  </div>
                </div>
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
                      src="https://www.youtube.com/embed/w8zHZP2uZZ4"
                      title="English Listening Practice - Countries and Cultures"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: English Listening Practice - Episode 2: Countries and Cultures</p>
                </div>
              </div>

              {/* Vocabulary Help - ATUALIZADO */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">It means</span>
                      <span className="text-teal-600">Isso significa</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Wisdom</span>
                      <span className="text-teal-600">sabedoria</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Fan</span>
                      <span className="text-teal-600">Ventilador</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">also</span>
                      <span className="text-teal-600">também</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">The same name</span>
                      <span className="text-teal-600">o mesmo nome</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Too</span>
                      <span className="text-teal-600">também</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Cities, mountains and rivers</span>
                      <span className="text-teal-600">cidades, montanhas e rios</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">India is in South Asia</span>
                      <span className="text-teal-600">A Índia fica no sul da Ásia</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">I grew up</span>
                      <span className="text-teal-600">Eu cresci (Fui criado(a))</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Coastline</span>
                      <span className="text-teal-600">litoral</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">I really miss India</span>
                      <span className="text-teal-600">Eu sinto muita saudade da Índia</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Wonderful</span>
                      <span className="text-teal-600">maravilhoso(a)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">A little bit</span>
                      <span className="text-teal-600">um pouquinho</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-teal-700">Air Conditioning</span>
                      <span className="text-teal-600">Ar-condicionado</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Vocabulary */}
              <div className="mb-8 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-4">🌍 More Vocabulary About Countries:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">Blonde hair</span>
                      <span className="text-blue-600">cabelo loiro</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">Wales</span>
                      <span className="text-blue-600">País de Gales</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">Spain</span>
                      <span className="text-blue-600">Espanha</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">When she smiles</span>
                      <span className="text-blue-600">quando ela sorri</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">Air conditioning</span>
                      <span className="text-blue-600">ar-condicionado</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-700">Treadmill</span>
                      <span className="text-blue-600">esteira</span>
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
                  <li><strong>Foque nas palavras-chave:</strong> Preste atenção em nomes de países, adjetivos e verbos</li>
                  <li><strong>Ouça o contexto:</strong> Tente entender o significado geral mesmo que você perca algumas palavras</li>
                  <li><strong>Use o vocabulário:</strong> As palavras fornecidas ajudarão você a entender as ideias principais</li>
                  <li><strong>Repita se necessário:</strong> Assista ao vídeo várias vezes para captar todos os detalhes</li>
                  <li><strong>Pratique a pronúncia:</strong> Repita as novas palavras e expressões em voz alta</li>
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

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson3")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson5")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}