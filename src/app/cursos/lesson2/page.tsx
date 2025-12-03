"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, Volume2, ChevronDown, ChevronUp, X } from "lucide-react";

const listenItems = [
  { 
    key: "pancakes", 
    label: "", 
    image: "/images/pancakes-and-butter.jpg", 
    correctAnswer: "I eat pancakes and butter. And you?" 
  },
  { 
    key: "bread-ham", 
    label: "", 
    image: "/images/breadandham-image.jpg", 
    correctAnswer: "I eat bread and ham. And you?" 
  },
  { 
    key: "cookies", 
    label: "", 
    image: "/images/cookies-image.jpg", 
    correctAnswer: "You eat cookies." 
  },
  { 
    key: "tea", 
    label: "", 
    image: "/images/tea-image.jpg", 
    correctAnswer: "I drink tea." 
  },
  { 
    key: "coffee", 
    label: "", 
    image: "/images/coffeewithmilk-image.jpg", 
    correctAnswer: "I drink coffee with milk." 
  },
  { 
    key: "bread-butter", 
    label: "", 
    image: "/images/breadandbutter-image.jpg", 
    correctAnswer: "I eat bread and butter." 
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

interface DragExercise {
  id: number;
  sentence: string;
  blank: string;
  options: string[];
  correctAnswers: string[];
  userAnswer: string | null;
}

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
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});
  const [videoQuestions, setVideoQuestions] = useState<VideoQuestion[]>([
    {
      id: 1,
      question: "What are the tips to make English more fun?",
      correctAnswer: "You can read interesting books, watch interesting content, and talk with people online.",
      userAnswer: "",
      vocabulary: [
        { english: "brush your teeth", portuguese: "escovar os dentes" },
        { english: "brush your hair", portuguese: "escovar o cabelo" },
        { english: "whenever", portuguese: "sempre que" },
        { english: "it takes time", portuguese: "leva tempo" },
        { english: "it takes effort", portuguese: "requer esforço" }
      ]
    },
    {
      id: 2,
      question: "How can meet friends help you with your English?",
      correctAnswer: "You won't feel shy, and you can use websites like MeetUp to find new friends.",
      userAnswer: "",
      vocabulary: [
        { english: "when you learn another language", portuguese: "quando você aprende outro idioma" },
        { english: "you can meet new people", portuguese: "você pode conhecer novas pessoas" },
        { english: "talk to people around the world", portuguese: "conversar com pessoas ao redor do mundo" },
        { english: "You can talk to people around the world", portuguese: "Você pode conversar com pessoas ao redor do mundo" }
      ]
    },
    {
      id: 3,
      question: "What are the things you can do on a rainy day?",
      correctAnswer: "You can visit friends, watch movies, or go for a quiet drive.",
      userAnswer: "",
      vocabulary: [
        { english: "Maybe you feel shy or scared", portuguese: "Talvez você se sinta tímido ou assustado" },
        { english: "You feel more confident", portuguese: "Você se sente mais confiante" },
        { english: "To improve, you need to make mistakes", portuguese: "Para melhorar, você precisa cometer erros" },
        { english: "I drive slowly", portuguese: "Eu dirijo devagar" },
        { english: "There many nice things you can do", portuguese: "Há muitas coisas legais que você pode fazer" },
        { english: "rainy day", portuguese: "dia chuvoso" }
      ]
    }
  ]);
  const [dragExercises, setDragExercises] = useState<DragExercise[]>([]);
  const [draggedItem, setDraggedItem] = useState<{ id: number; option: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [usedOptions, setUsedOptions] = useState<Set<string>>(new Set());
  const [mobileSelectedOption, setMobileSelectedOption] = useState<string | null>(null);
  
  // Estados para controle de expansão/recolhimento das seções
  const [sections, setSections] = useState({
    listen: true,
    speak: true,
    negative: true,
    pronoun: true,
    tuneIn: true
  });

  // Exercícios de arrastar e soltar para negativas (CORRIGIDOS)
  const negativeExercises: DragExercise[] = [
    {
      id: 1,
      sentence: "I ______ drink coffee.",
      blank: "______",
      options: ["don't", "do not"],
      correctAnswers: ["don't", "do not"],
      userAnswer: null
    },
    {
      id: 2,
      sentence: "He ______ eat meat.",
      blank: "______",
      options: ["doesn't", "does not"],
      correctAnswers: ["doesn't", "does not"],
      userAnswer: null
    },
    {
      id: 3,
      sentence: "We ______ want juice.",
      blank: "______",
      options: ["don't", "do not"],
      correctAnswers: ["don't", "do not"],
      userAnswer: null
    },
    {
      id: 4,
      sentence: "She ______ like tea.",
      blank: "______",
      options: ["doesn't", "does not"],
      correctAnswers: ["doesn't", "does not"],
      userAnswer: null
    }
  ];

  // Exercícios de arrastar e soltar para pronomes
  const pronounExercises: DragExercise[] = [
    {
      id: 6,
      sentence: "My father ______ bread every morning.",
      blank: "______",
      options: ["eats", "has", "enjoys", "loves", "likes", "prefers"],
      correctAnswers: ["eats", "has", "enjoys", "loves", "likes", "prefers"],
      userAnswer: null
    },
    {
      id: 7,
      sentence: "The cat ______ milk.",
      blank: "______",
      options: ["drinks", "loves", "prefers", "enjoys", "likes", "wants"],
      correctAnswers: ["drinks", "loves", "prefers", "enjoys", "likes", "wants"],
      userAnswer: null
    },
    {
      id: 8,
      sentence: "John ______ green tea.",
      blank: "______",
      options: ["prefers", "likes", "drinks", "enjoys", "loves", "has"],
      correctAnswers: ["prefers", "likes", "drinks", "enjoys", "loves", "has"],
      userAnswer: null
    }
  ];

  useEffect(() => {
    // Inicializar exercícios de arrastar
    setDragExercises([...negativeExercises, ...pronounExercises]);
  }, []);

  const handleChange = (key: string, value: string) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheck = (key: string) => {
    setShowAnswers((prev) => ({ ...prev, [key]: true }));
  };

  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoQuestions(prev => 
      prev.map(question => 
        question.id === id ? { ...question, userAnswer: value } : question
      )
    );
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

  // Funções para arrastar e soltar
  const handleDragStart = (id: number, option: string) => {
    setDraggedItem({ id, option });
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (exerciseId: number) => {
    if (draggedItem) {
      const updatedExercises = dragExercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return { ...exercise, userAnswer: draggedItem.option };
        }
        return exercise;
      });
      setDragExercises(updatedExercises);
      
      // Marcar a opção como usada se estiver correta
      const exercise = dragExercises.find(e => e.id === exerciseId);
      if (exercise && exercise.correctAnswers.includes(draggedItem.option)) {
        setUsedOptions(prev => new Set(prev).add(draggedItem.option));
      }
      
      setDraggedItem(null);
      setIsDragging(false);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedItem(null);
  };

  const resetDragExercise = (id: number) => {
    const updatedExercises = dragExercises.map(exercise => {
      if (exercise.id === id) {
        // Remover da lista de opções usadas
        if (exercise.userAnswer) {
          setUsedOptions(prev => {
            const newSet = new Set(prev);
            newSet.delete(exercise.userAnswer!);
            return newSet;
          });
        }
        return { ...exercise, userAnswer: null };
      }
      return exercise;
    });
    setDragExercises(updatedExercises);
  };

  // Função para seleção móvel
  const handleMobileSelect = (option: string) => {
    setMobileSelectedOption(option);
  };

  const handleMobileDrop = (exerciseId: number) => {
    if (mobileSelectedOption) {
      const updatedExercises = dragExercises.map(exercise => {
        if (exercise.id === exerciseId) {
          return { ...exercise, userAnswer: mobileSelectedOption };
        }
        return exercise;
      });
      setDragExercises(updatedExercises);
      
      // Marcar a opção como usada se estiver correta
      const exercise = dragExercises.find(e => e.id === exerciseId);
      if (exercise && exercise.correctAnswers.includes(mobileSelectedOption)) {
        setUsedOptions(prev => new Set(prev).add(mobileSelectedOption));
      }
      
      setMobileSelectedOption(null);
    }
  };

  // Função para alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Dividir a frase em partes para renderização
  const renderSentence = (exercise: DragExercise) => {
    const parts = exercise.sentence.split(exercise.blank);
    return (
      <>
        {parts[0]}
        {exercise.userAnswer ? (
          <span className="font-bold text-purple-600">{exercise.userAnswer}</span>
        ) : (
          <span 
            className="inline-block min-w-[60px] h-8 bg-gray-100 border-2 border-dashed border-gray-300 rounded mx-1 cursor-pointer"
            onClick={() => mobileSelectedOption && handleMobileDrop(exercise.id)}
          >
            {mobileSelectedOption && (
              <span className="text-xs text-gray-400 flex items-center justify-center h-full">
                Clique para soltar
              </span>
            )}
          </span>
        )}
        {parts[1]}
      </>
    );
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/lesson1-86.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">Lesson 2 - Food & Drink</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🎧 Esta lição foi feita para treinar a escuta em inglês. Ouça com atenção e escreva exatamente o que você ouviu.
          </p>
        </div>

        {/* LISTEN AND PRACTICE */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 LISTEN AND PRACTICE</h2>
              <button 
                onClick={() => toggleSection('listen')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l2_listenandpractice.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
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

                  <div className="w-full mb-3">
                    <textarea
                      placeholder="Escreva aqui o que ouviu..."
                      value={notes[item.key] || ""}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      className="w-full h-[80px] resize-none p-3 border border-orange-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
          )}
        </div>

        {/* SPEAK RIGHT NOW */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">SPEAK RIGHT NOW</h2>
              <button 
                onClick={() => toggleSection('speak')}
                className="ml-4 p-2 rounded-full hover:bg-red-600 transition"
              >
                {sections.speak ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.speak && (
            <div className="p-8">
              <div className="mb-6 p-4 rounded-xl bg-white shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-lg">— I eat bread and ham. And you?</p>
                    <AudioPlayer src="/audios/I_eat_bread_and_ham.and_you.mp3" compact />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg">— I eat bread and cheese.</p>
                    <AudioPlayer src="/audios/I_eat_bread_and_cheese.mp3" compact />
                  </div>
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-white shadow">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p className="text-lg">— I eat bread and I drink milk. And you?</p>
                    <AudioPlayer src="/audios/I_eat_bread_and_i_drink_milk.and_you.mp3" compact />
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-lg">— I eat crackers and I drink juice.</p>
                    <AudioPlayer src="/audios/ieatcrackersandidrinkjuice.mp3" compact />
                  </div>
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">Vocabulary Options:</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {[
                    "bread", "crackers", "pancakes", "cheese", "ham",
                    "juice", "water", "milk", "tea", "coffee"
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

        {/* NEGATIVE SENTENCES DRILLS (CORRIGIDO) */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🧠 NEGATIVE SENTENCES DRILLS</h2>
              <button 
                onClick={() => toggleSection('negative')}
                className="ml-4 p-2 rounded-full hover:bg-purple-700 transition"
              >
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <p className="text-purple-700 mb-6 italic">
                Pratique a construção de frases negativas usando "don't" e "doesn't". 
                Arraste as palavras corretas para completar as frases.
              </p>
              
              <div className="mb-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Regras de uso:</h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 text-sm">
                  <li><strong>Don't</strong> = Do not (usado com I, you, we, they)</li>
                  <li><strong>Doesn't</strong> = Does not (usado com he, she, it)</li>
                  <li>Com doesn't, o verbo principal fica na forma base, sem "s"</li>
                  <li>Exemplo: She <span className="font-bold">doesn't eat</span> (não "doesn't eats")</li>
                </ul>
              </div>
              
              {mobileSelectedOption && (
                <div className="mb-4 p-3 bg-purple-200 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-purple-800">Selecionado: {mobileSelectedOption}</span>
                  <button 
                    onClick={() => setMobileSelectedOption(null)}
                    className="p-1 bg-purple-500 text-white rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Opções para arrastar */}
                <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                  <h3 className="text-lg font-bold text-purple-700 mb-3">Opções:</h3>
                  <div className="flex flex-wrap gap-2">
                    {["don't", "do not", "doesn't", "does not"]
                      .filter(option => !usedOptions.has(option))
                      .map((option, idx) => (
                        <div
                          key={`option-${idx}`}
                          className={`px-4 py-2 bg-purple-200 text-purple-800 rounded-lg cursor-move transition-all ${
                            draggedItem?.option === option ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100'
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(0, option)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleMobileSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* Frases para completar */}
                <div className="space-y-4">
                  {dragExercises
                    .filter(ex => ex.id <= 4)
                    .map((exercise) => (
                      <div 
                        key={exercise.id}
                        className="p-4 bg-white rounded-xl border border-purple-200 shadow-sm"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(exercise.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-lg font-medium text-gray-800">
                            {renderSentence(exercise)}
                          </p>
                          {exercise.userAnswer && (
                            <button 
                              onClick={() => resetDragExercise(exercise.id)}
                              className="text-sm text-purple-600 hover:text-purple-800"
                            >
                              Redefinir
                            </button>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {exercise.userAnswer && (
                            <span>
                              {exercise.correctAnswers.includes(exercise.userAnswer) ? (
                                <span className="text-green-600">✅ Correto!</span>
                              ) : (
                                <span className="text-red-600">❌ Respostas corretas: {exercise.correctAnswers.join(' ou ')}</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PRONOUN PRACTICE DRILLS */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 PRONOUN PRACTICE DRILLS</h2>
              <button 
                onClick={() => toggleSection('pronoun')}
                className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition"
              >
                {sections.pronoun ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.pronoun && (
            <div className="p-8">
              <p className="text-indigo-700 mb-6 italic">
                Pratique o uso de pronomes (he, she, it) com verbos no presente simples. 
                Arraste as formas verbais corretas para completar as frases.
              </p>
              
              <div className="mb-6 bg-indigo-100 border-2 border-indigo-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-indigo-800 mb-4">Regras de uso:</h3>
                <ul className="list-disc pl-5 space-y-2 text-indigo-700 text-sm">
                  <li><strong>He/She/It</strong> = Requerem verbo com "s" no final no presente simples</li>
                  <li>Exemplo: He <span className="font-bold">drinks</span>, she <span className="font-bold">eats</span>, it <span className="font-bold">tastes</span></li>
                  <li>Exceções: Verbos terminados em -ss, -sh, -ch, -x, -o → adicionam "es"</li>
                  <li>Exemplo: She <span className="font-bold">goes</span>, he <span className="font-bold">watches</span></li>
                </ul>
              </div>
              
              {mobileSelectedOption && (
                <div className="mb-4 p-3 bg-indigo-200 rounded-lg flex items-center justify-between">
                  <span className="font-medium text-indigo-800">Selecionado: {mobileSelectedOption}</span>
                  <button 
                    onClick={() => setMobileSelectedOption(null)}
                    className="p-1 bg-indigo-500 text-white rounded-full"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Opções para arrastar */}
                <div className="bg-white p-4 rounded-xl border-2 border-indigo-300">
                  <h3 className="text-lg font-bold text-indigo-700 mb-3">Opções:</h3>
                  <div className="flex flex-wrap gap-2">
                    {["drinks", "eats", "prefers", "loves", "enjoys", "has", "likes", "wants"]
                      .filter(option => !usedOptions.has(option))
                      .map((option, idx) => (
                        <div
                          key={`option-${idx}`}
                          className={`px-4 py-2 bg-indigo-200 text-indigo-800 rounded-lg cursor-move transition-all ${
                            draggedItem?.option === option ? 'opacity-50 scale-95 shadow-lg' : 'opacity-100'
                          }`}
                          draggable
                          onDragStart={() => handleDragStart(0, option)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleMobileSelect(option)}
                        >
                          {option}
                        </div>
                      ))}
                  </div>
                </div>
                
                {/* Frases para completar */}
                <div className="space-y-4">
                  {dragExercises
                    .filter(ex => ex.id > 4)
                    .map((exercise) => (
                      <div 
                        key={exercise.id}
                        className="p-4 bg-white rounded-xl border border-indigo-200 shadow-sm"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(exercise.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-lg font-medium text-gray-800">
                            {renderSentence(exercise)}
                          </p>
                          {exercise.userAnswer && (
                            <button 
                              onClick={() => resetDragExercise(exercise.id)}
                              className="text-sm text-indigo-600 hover:text-indigo-800"
                            >
                              Redefinir
                            </button>
                          )}
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          {exercise.userAnswer && (
                            <span>
                              {exercise.correctAnswers.includes(exercise.userAnswer) ? (
                                <span className="text-green-600">✅ Correto!</span>
                              ) : (
                                <span className="text-red-600">❌ Respostas possíveis: {exercise.correctAnswers.join(', ')}</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS - NOVA SEÇÃO NO FINAL COM VÍDEO */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden">
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
                
                {/* Container do vídeo do YouTube */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/zD_KUmTl4jE"
                      title="English Learning Tips"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-teal-600">
                  <p>Video: Tips for Making English Learning Fun and Effective</p>
                </div>
              </div>

              {/* Vocabulary Help */}
              <div className="mb-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">Key Vocabulary from the Video:</h3>
                <div className="space-y-3 text-teal-700">
                  <div className="flex justify-between">
                    <span className="font-medium">brush your teeth</span>
                    <span className="text-teal-600">escovar os dentes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">brush your hair</span>
                    <span className="text-teal-600">escovar o cabelo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">whenever</span>
                    <span className="text-teal-600">sempre que</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">rainy day</span>
                    <span className="text-teal-600">dia chuvoso</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">it takes time</span>
                    <span className="text-teal-600">leva tempo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">it takes effort</span>
                    <span className="text-teal-600"> requer esforço</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">make mistakes</span>
                    <span className="text-teal-600">cometer erros</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">You can talk to people around the world</span>
                    <span className="text-teal-600">Você pode conversar com pessoas ao redor do mundo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">feel shy or scared</span>
                    <span className="text-teal-600">sentir-se tímido ou assustado</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">feel more confident</span>
                    <span className="text-teal-600">sentir-se mais confiante</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">meet new people</span>
                    <span className="text-teal-600">conhecer novas pessoas</span>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6">
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
                              <span className="text-teal-600">{word.portuguese}</span>
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

              <div className="mt-8 bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-teal-800 mb-4">Dicas para Responder:</h3>
                <ul className="list-disc pl-5 space-y-2 text-teal-700 text-sm">
                  <li>Ouça com atenção as ideias principais do vídeo</li>
                  <li>Use as dicas de vocabulário para ajudar a formar suas respostas</li>
                  <li>Escreva frases completas em inglês</li>
                  <li>Não se preocupe com a perfeição</li>
                  <li>Você pode assistir ao vídeo várias vezes, se necessário</li>
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
            onClick={() => router.push("/cursos")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Voltar aos Cursos
          </button>
          <button
            onClick={() => router.push("/cursos/lesson3")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}