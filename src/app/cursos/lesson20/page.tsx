"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";

const listenItems = [
  {
    key: "pasta",
    label: "Macarrão",
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop",
    audio: "/audios/l20-pasta-dialogue.mp3",
    description: "Pasta",
    correctOrder: 1
  },
  {
    key: "riceBeans",
    label: "Arroz e Feijão",
    image: "https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=400&h=300&fit=crop",
    audio: "/audios/l20-rice-beans-dialogue.mp3",
    description: "Rice and Beans",
    correctOrder: 2
  },
  {
    key: "tomato",
    label: "Tomate",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop",
    audio: "/audios/l20-tomato-sauce-dialogue.mp3",
    description: "Tomato",
    correctOrder: 3
  }
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

interface PracticeItem {
  id: number;
  sentence: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  isNegative?: boolean;
  isInterrogative?: boolean;
  usesThirdPerson?: boolean;
}

interface NumberingAnswer {
  [key: string]: number | null;
}

interface VideoQuestion {
  id: number;
  question: string;
  isPersonal?: boolean;
  vocabulary?: { english: string; portuguese: string }[];
}

export default function Lesson20Lifestyle() {
  const router = useRouter();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [dialogues, setDialogues] = useState([
    { speaker: "Person A", text: "", fixed: false },
    { speaker: "Person B", text: "", fixed: false },
    { speaker: "Person A", text: "", fixed: false },
    { speaker: "Person B", text: "", fixed: false }
  ]);
 
  const [numberingAnswers, setNumberingAnswers] = useState<NumberingAnswer>({
    pasta: null,
    riceBeans: null,
    tomato: null
  });
 
  const [isNumberingChecked, setIsNumberingChecked] = useState(false);
  const [isNumberingCorrect, setIsNumberingCorrect] = useState(false);
 
  const [practiceItems, setPracticeItems] = useState<PracticeItem[]>([
    // Substitution Practice I - ALL IN ENGLISH
    { id: 1, sentence: "We want to eat pasta for lunch.", options: ["vegetables", "rice and beans"], correctAnswer: "vegetables", userAnswer: "" },
    { id: 2, sentence: "They don't like soup.", options: ["yogurt", "tomato sauce"], correctAnswer: "yogurt", userAnswer: "" },
    { id: 3, sentence: "Do you clean the bedroom in the morning?", options: ["the kitchen", "the bathroom"], correctAnswer: "the kitchen", userAnswer: "" },
    { id: 4, sentence: "I don't sleep at midnight.", options: ["at 11:00 p.m.", "at 10:00 p.m."], correctAnswer: "at 11:00 p.m.", userAnswer: "" },
    { id: 5, sentence: "What time is it?", options: ["It's three o'clock.", "7:15", "9:30"], correctAnswer: "It's three o'clock.", userAnswer: "" },
   
    // Change into Negative
    { id: 6, sentence: "I cook for my family.", options: [], correctAnswer: "I don't cook for my family.", userAnswer: "", isNegative: true },
    { id: 7, sentence: "They go to work early.", options: [], correctAnswer: "They don't go to work early.", userAnswer: "", isNegative: true },
    { id: 8, sentence: "I study until five o'clock.", options: [], correctAnswer: "I don't study until five o'clock.", userAnswer: "", isNegative: true },
    { id: 9, sentence: "We do the laundry in the morning.", options: [], correctAnswer: "We don't do the laundry in the morning.", userAnswer: "", isNegative: true },
    { id: 10, sentence: "I take a shower in the morning.", options: [], correctAnswer: "I don't take a shower in the morning.", userAnswer: "", isNegative: true },
    { id: 11, sentence: "They have time to have lunch now.", options: [], correctAnswer: "They don't have time to have lunch now.", userAnswer: "", isNegative: true },
   
    // Substitution Practice II - ALL IN ENGLISH
    { id: 12, sentence: "They have an old table.", options: ["car", "house"], correctAnswer: "car", userAnswer: "" },
    { id: 13, sentence: "Do you need a new sofa?", options: ["tablet", "job"], correctAnswer: "tablet", userAnswer: "" },
    { id: 14, sentence: "When do you clean your house?", options: ["your shoes", "your bathroom"], correctAnswer: "your shoes", userAnswer: "" },
    { id: 15, sentence: "I don't like to wash the dishes.", options: ["to do laundry", "to get up early"], correctAnswer: "to do laundry", userAnswer: "" },
    { id: 16, sentence: "I get up at 7:00 a.m.", options: ["6:00", "5:00"], correctAnswer: "6:00", userAnswer: "" },
   
    // Change into Affirmative
    { id: 17, sentence: "I don't have dinner at eight o'clock.", options: [], correctAnswer: "I have dinner at eight o'clock.", userAnswer: "" },
    { id: 18, sentence: "We don't want to live in Spain.", options: [], correctAnswer: "We want to live in Spain.", userAnswer: "" },
    { id: 19, sentence: "We don't work at the grocery store.", options: [], correctAnswer: "We work at the grocery store.", userAnswer: "" },
    { id: 20, sentence: "I don't work until 6:00 p.m.", options: [], correctAnswer: "I work until 6:00 p.m.", userAnswer: "" },
    { id: 21, sentence: "They don't like to study in the living room.", options: [], correctAnswer: "They like to study in the living room.", userAnswer: "" },
    { id: 22, sentence: "They don't want to go to the bank alone.", options: [], correctAnswer: "They want to go to the bank alone.", userAnswer: "" },
   
    // Change into Interrogative
    { id: 23, sentence: "You want to cook some pasta.", options: [], correctAnswer: "Do you want to cook some pasta?", userAnswer: "", isInterrogative: true },
    { id: 24, sentence: "They have breakfast at 8:00 a.m.", options: [], correctAnswer: "Do they have breakfast at 8:00 a.m?", userAnswer: "", isInterrogative: true },
    { id: 25, sentence: "We have time to read the messages.", options: [], correctAnswer: "Do we have time to read the messages?", userAnswer: "", isInterrogative: true },
    { id: 26, sentence: "You like to sleep on the couch.", options: [], correctAnswer: "Do you like to sleep on the couch?", userAnswer: "", isInterrogative: true },
    { id: 27, sentence: "You have lunch at one o'clock.", options: [], correctAnswer: "Do you have lunch at one o'clock?", userAnswer: "", isInterrogative: true },
    { id: 28, sentence: "They do the dishes every day.", options: [], correctAnswer: "Do they do the dishes every day?", userAnswer: "", isInterrogative: true }
  ]);

  const [questions, setQuestions] = useState([
    { id: 1, question: "What time do you go to work?", userAnswer: "" },
    { id: 2, question: "When do you clean your house?", userAnswer: "" },
    { id: 3, question: "Do you do the laundry in the morning?", userAnswer: "" },
    { id: 4, question: "What time do you have dinner?", userAnswer: "" },
    { id: 5, question: "Do you like to get up early?", userAnswer: "" },
    { id: 6, question: "What time do you usually sleep?", userAnswer: "" },
    { id: 7, question: "Do you have time to exercise?", userAnswer: "" },
    { id: 8, question: "When do you study English?", userAnswer: "" },
    { id: 9, question: "Do you cook for your family?", userAnswer: "" },
    { id: 10, question: "What's your weekly routine?", userAnswer: "" }
  ]);

  const [sections, setSections] = useState({
    listen: true,
    drilling: true,
    questions: true,
    rolePlay: true,
    weeklyPlanning: true,
    tuneIn: true
  });

  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoAnswerResults, setShowVideoAnswerResults] = useState<Record<number, boolean>>({});

  const videoQuestions: VideoQuestion[] = [
    {
      id: 1,
      question: "What time does the person in the video usually wake up?",
      vocabulary: [
        { english: "Wake up", portuguese: "Acordar" },
        { english: "Usually", portuguese: "Geralmente" },
        { english: "Get out of bed", portuguese: "Levantar da cama" }
      ]
    },
    {
      id: 2,
      question: "What does he have for breakfast?",
      vocabulary: [
        { english: "Breakfast", portuguese: "Café da manhã" },
        { english: "Toast", portuguese: "Torrada" },
        { english: "Coffee", portuguese: "Café" },
        { english: "Juice", portuguese: "Suco" }
      ]
    },
    {
      id: 3,
      question: "How does he go to work?",
      vocabulary: [
        { english: "Go to work", portuguese: "Ir trabalhar" },
        { english: "By bus", portuguese: "De ônibus" },
        { english: "By car", portuguese: "De carro" },
        { english: "Walk", portuguese: "Caminhar" }
      ]
    },
    {
      id: 4,
      question: "What time does he have lunch?",
      vocabulary: [
        { english: "Lunch break", portuguese: "Intervalo do almoço" },
        { english: "At noon", portuguese: "Ao meio-dia" },
        { english: "Sandwich", portuguese: "Sanduíche" }
      ]
    },
    {
      id: 5,
      question: "What does he do after work?",
      vocabulary: [
        { english: "After work", portuguese: "Depois do trabalho" },
        { english: "Exercise", portuguese: "Exercitar" },
        { english: "Relax", portuguese: "Relaxar" },
        { english: "Watch TV", portuguese: "Assistir TV" }
      ]
    },
    {
      id: 6,
      question: "What is your ideal morning routine?",
      isPersonal: true,
      vocabulary: [
        { english: "Morning routine", portuguese: "Rotina matinal" },
        { english: "Exercise", portuguese: "Exercício" },
        { english: "Breakfast", portuguese: "Café da manhã" },
        { english: "Read", portuguese: "Ler" }
      ]
    },
    {
      id: 7,
      question: "How is your routine different from the one in the video?",
      isPersonal: true,
      vocabulary: [
        { english: "Different", portuguese: "Diferente" },
        { english: "Similar", portuguese: "Similar" },
        { english: "Wake up earlier/later", portuguese: "Acordar mais cedo/mais tarde" }
      ]
    }
  ];

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleNoteChange = (key: string, value: string) => {
    setNotes(prev => ({ ...prev, [key]: value }));
  };

  const saveNotes = async () => {
    alert("Notas salvas localmente!");
  };

  const handleDialogueChange = (index: number, value: string) => {
    const newDialogues = [...dialogues];
    newDialogues[index] = { ...newDialogues[index], text: value };
    setDialogues(newDialogues);
  };

  const handlePracticeAnswer = (id: number, answer: string) => {
    setPracticeItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, userAnswer: answer } : item
      )
    );
  };

  const handleQuestionAnswer = (id: number, answer: string) => {
    setQuestions(prev =>
      prev.map(q =>
        q.id === id ? { ...q, userAnswer: answer } : q
      )
    );
  };

  const handleNumberingChange = (dishKey: string, order: number) => {
    setNumberingAnswers(prev => ({
      ...prev,
      [dishKey]: order
    }));
    setIsNumberingChecked(false);
  };

  const checkNumbering = () => {
    const isCorrect = listenItems.every(item =>
      numberingAnswers[item.key] === item.correctOrder
    );
   
    setIsNumberingChecked(true);
    setIsNumberingCorrect(isCorrect);
   
    if (isCorrect) {
      alert("✅ Parabéns! Você acertou a ordem correta: 1, 2, 3");
    } else {
      alert("❌ A ordem ainda não está correta. Tente novamente!");
    }
  };

  const resetNumbering = () => {
    setNumberingAnswers({
      pasta: null,
      riceBeans: null,
      tomato: null
    });
    setIsNumberingChecked(false);
    setIsNumberingCorrect(false);
  };

  const handleVideoAnswerChange = (questionId: number, answer: string) => {
    setVideoAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const checkVideoAnswer = (questionId: number) => {
    const answer = videoAnswers[questionId];
    if (!answer) {
      alert("Please write an answer first!");
      return;
    }
    
    setShowVideoAnswerResults(prev => ({
      ...prev,
      [questionId]: true
    }));
    
    // For personal questions, just save the answer
    const question = videoQuestions.find(q => q.id === questionId);
    if (question?.isPersonal) {
      alert("Your personal answer has been saved for practice!");
    } else {
      alert("Answer saved! Check with your teacher for correction.");
    }
  };

  const saveAllAnswers = () => {
    // Save video answers to notes
    Object.entries(videoAnswers).forEach(([key, value]) => {
      handleNoteChange(`video-answer-${key}`, value);
    });
    
    // Save practice answers
    practiceItems.forEach(item => {
      if (item.userAnswer) {
        handleNoteChange(`practice-${item.id}`, item.userAnswer);
      }
    });
    
    alert("All answers have been saved!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers?")) {
      setVideoAnswers({});
      setShowVideoAnswerResults({});
      setPracticeItems(prev => prev.map(item => ({ ...item, userAnswer: "" })));
      setQuestions(prev => prev.map(q => ({ ...q, userAnswer: "" })));
      alert("All answers cleared!");
    }
  };

  const speakIdealWeek = () => {
    const text = notes["ideal-week"] || "";
    if (!text) {
      alert("Please write about your ideal week first!");
      return;
    }

    // Create speech synthesis with female voice
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to set a female voice
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.includes('en') && 
      voice.name.toLowerCase().includes('female')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      // Fallback to any English voice
      const englishVoice = voices.find(voice => voice.lang.includes('en'));
      if (englishVoice) utterance.voice = englishVoice;
    }

    speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1920&q=80')` }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 Lição 20 – Lifestyle & Weekly Planning</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🕒 Aprenda a falar sobre rotinas, planejamento semanal e hábitos de vida com exercícios práticos de conversação.
          </p>
        </div>

        {/* 1. LISTEN, NUMBER AND ROLE-PLAY */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔊 1. Listen, Number and Role-Play</h2>
              <button
                onClick={() => toggleSection('listen')}
                className="ml-4 p-2 rounded-full hover:bg-blue-600 transition"
              >
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <AudioPlayer src="/audios/l20-listen-number-audio.mp3" />
          </div>

          {sections.listen && (
            <div className="p-8">
              <div className="mb-8 bg-blue-100 border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-blue-800 mb-3">🟨 MOSTRAR PRÁTICA</h3>
                <p className="text-blue-700 mb-4 font-medium">
                  <strong>Objetivo da atividade:</strong> Trabalhar listening, estrutura de frases e produção oral.
                </p>
               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Procedimento:</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-blue-700">
                      <li>Mostre as imagens aos alunos e peça que digam o que veem.</li>
                      <li>Explique que eles vão ouvir um diálogo curto.</li>
                      <li>Os alunos devem ouvir e escrever os números nas imagens.</li>
                      <li>Toque o áudio uma vez (somente para ouvir).</li>
                      <li>Toque o áudio novamente para que escrevam os números.</li>
                      <li>Corrija as respostas.</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Como fazer:</h4>
                    <ul className="list-disc pl-5 space-y-2 text-blue-700">
                      <li>Ouça o diálogo completo</li>
                      <li>Numere as imagens na ordem correta</li>
                      <li>Verifique suas respostas</li>
                      <li>Pratique a pronúncia</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Numbering Exercise */}
              <div className="mb-8 flex justify-center">
                <div className="max-w-4xl w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-blue-700">Escute o diálogo e escreva o número correto em cada imagem:</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={checkNumbering}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                      >
                        Verificar Ordem
                      </button>
                      <button
                        onClick={resetNumbering}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                      >
                        Reiniciar
                      </button>
                    </div>
                  </div>
                 
                  {isNumberingChecked && (
                    <div className={`mb-4 p-3 rounded-lg text-center font-bold ${
                      isNumberingCorrect ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'
                    }`}>
                      {isNumberingCorrect ? (
                        <>✅ Parabéns! Ordem correta: 1, 2, 3</>
                      ) : (
                        <>❌ A ordem ainda não está correta. Tente novamente!</>
                      )}
                    </div>
                  )}
                 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {listenItems.map((item) => (
                      <div
                        key={item.key}
                        className={`bg-white p-4 rounded-lg border-2 transition-all ${
                          isNumberingChecked
                            ? (numberingAnswers[item.key] === item.correctOrder
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50')
                            : 'border-blue-300'
                        }`}
                      >
                        <div className="text-center font-bold text-blue-600 mb-3 text-lg">
                          {numberingAnswers[item.key] ? `Nº ${numberingAnswers[item.key]}` : "Escolha o número"}
                        </div>
                        <div className="w-full h-40 relative mb-3 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.label}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-sm text-center text-gray-600 font-medium mb-3">
                          {item.description}
                        </p>
                       
                        <div className="flex justify-center gap-2">
                          {[1, 2, 3].map((number) => (
                            <button
                              key={number}
                              onClick={() => handleNumberingChange(item.key, number)}
                              className={`w-10 h-10 rounded-full font-bold transition-all ${
                                numberingAnswers[item.key] === number
                                  ? 'bg-blue-500 text-white scale-110'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {number}
                            </button>
                          ))}
                        </div>
                       
                        {isNumberingChecked && (
                          <div className="mt-2 text-center text-xs">
                            {numberingAnswers[item.key] === item.correctOrder ? (
                              <span className="text-green-600">✅ Correto: {item.correctOrder}</span>
                            ) : (
                              <span className="text-red-600">❌ Correto seria: {item.correctOrder}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                 
                  <div className="mt-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                    <h4 className="text-lg font-bold text-yellow-800 mb-2">📝 Depois, confira suas respostas com o professor.</h4>
                    <p className="text-yellow-700 text-sm">Use este espaço para anotar suas dúvidas:</p>
                    <textarea
                      value={notes["listening-notes"] || ""}
                      onChange={(e) => handleNoteChange("listening-notes", e.target.value)}
                      placeholder="Anote suas dúvidas ou observações aqui..."
                      className="w-full h-20 p-3 mt-2 border border-yellow-300 rounded-md resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Role-Play Dialogue */}
              <div className="bg-white border-2 border-blue-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-700 mb-4">🎭 Crie seu próprio diálogo:</h3>
                <p className="text-blue-600 mb-4">Use frases sobre rotinas e preferências alimentares.</p>
                <div className="space-y-4 mb-4">
                  {dialogues.map((dialogue, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <input
                        type="text"
                        value={dialogue.speaker}
                        onChange={(e) => {
                          const newDialogues = [...dialogues];
                          newDialogues[index].speaker = e.target.value;
                          setDialogues(newDialogues);
                        }}
                        placeholder="Nome do personagem..."
                        className="w-32 p-2 border border-blue-300 rounded-md bg-blue-50"
                      />
                      <textarea
                        value={dialogue.text}
                        onChange={(e) => handleDialogueChange(index, e.target.value)}
                        placeholder={`O que ${dialogue.speaker} diz sobre rotina ou comida...`}
                        className="flex-1 p-3 border border-blue-300 rounded-md resize-none h-20"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={saveNotes}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  Salvar Diálogo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. DRILLING PRACTICE */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 2. Drilling Practice</h2>
              <button
                onClick={() => toggleSection('drilling')}
                className="ml-4 p-2 rounded-full hover:bg-green-600 transition"
              >
                {sections.drilling ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling && (
            <div className="p-8">
              {/* Substitution Practice I */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🟦 DRILLING PRACTICE - Substitution Practice I (3')</h3>
                <p className="text-green-600 mb-4 italic">Substitua a parte final da frase conforme indicado.</p>
                <div className="space-y-4">
                  {practiceItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {item.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePracticeAnswer(item.id, option)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              item.userAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {item.userAnswer && (
                        <div className={`text-sm ${
                          item.userAnswer === item.correctAnswer ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {item.userAnswer === item.correctAnswer ? '✅ Correto!' : '❌ Tente novamente'}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Negative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🟦 Change into Negative (2')</h3>
                <p className="text-green-600 mb-4 italic">Passe as frases para a forma negativa.</p>
                <div className="space-y-4">
                  {practiceItems.slice(5, 11).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase negativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                      {item.userAnswer && (
                        <div className="mt-2">
                          <button
                            onClick={() => {
                              const isCorrect = item.userAnswer.toLowerCase() === item.correctAnswer.toLowerCase();
                              alert(isCorrect ? '✅ Correto!' : `❌ Resposta correta: ${item.correctAnswer}`);
                            }}
                            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          >
                            Verificar
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher's Guide Note */}
              <div className="mb-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">🟨 MOSTRAR PRÁTICA</h3>
                <p className="text-yellow-700">👉 Go back to the Student's Book after completing this section.</p>
              </div>

              {/* Substitution Practice II */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🟨 Substitution Practice II (3')</h3>
                <p className="text-green-600 mb-4 italic">Substitua conforme indicado.</p>
                <div className="space-y-4">
                  {practiceItems.slice(11, 16).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <div className="flex flex-wrap gap-2">
                        {item.options.map((option, idx) => (
                          <button
                            key={idx}
                            onClick={() => handlePracticeAnswer(item.id, option)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              item.userAnswer === option
                                ? 'bg-green-500 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Affirmative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🟨 Change into Affirmative (2')</h3>
                <p className="text-green-600 mb-4 italic">Passe as frases para a forma afirmativa.</p>
                <div className="space-y-4">
                  {practiceItems.slice(16, 22).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a frase afirmativa..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Change into Interrogative */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-700 mb-4">🟨 Change into Interrogative (2')</h3>
                <p className="text-green-600 mb-4 italic">Passe as frases para a forma interrogativa.</p>
                <div className="space-y-4">
                  {practiceItems.slice(22, 28).map((item) => (
                    <div key={item.id} className="bg-white p-4 rounded-lg border border-green-200">
                      <p className="font-medium text-gray-700 mb-2">{item.sentence}</p>
                      <textarea
                        value={item.userAnswer}
                        onChange={(e) => handlePracticeAnswer(item.id, e.target.value)}
                        placeholder="Escreva a pergunta..."
                        className="w-full p-2 border border-green-300 rounded-md resize-none h-12"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Teacher's Guide Note */}
              <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                <h3 className="text-lg font-bold text-yellow-800 mb-2">🟨 MOSTRAR PRÁTICA</h3>
                <p className="text-yellow-700">👉 Go back to the Student's Book after completing this section.</p>
              </div>
            </div>
          )}
        </div>

        {/* 3. SPEAK RIGHT NOW */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-purple-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ 3. Speak Right Now</h2>
              <button
                onClick={() => toggleSection('questions')}
                className="ml-4 p-2 rounded-full hover:bg-purple-600 transition"
              >
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <div className="mb-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-purple-800 mb-3">Pergunta e resposta modelo:</h3>
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <p className="font-bold text-purple-700 mb-2">What time do you go to work?</p>
                  <p className="text-purple-600">I go to work at 6:00 a.m.</p>
                </div>
              </div>
             
              <p className="text-purple-700 mb-6 italic">
                👉 Responda oralmente às perguntas abaixo sobre sua rotina e hábitos.
              </p>
             
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {questions.map((q) => (
                  <div key={q.id} className="bg-white p-4 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-purple-700 mb-2">{q.question}</h4>
                    <textarea
                      value={q.userAnswer}
                      onChange={(e) => handleQuestionAnswer(q.id, e.target.value)}
                      placeholder="Sua resposta..."
                      className="w-full p-2 border border-purple-300 rounded-md resize-none h-16 text-sm"
                    />
                    <div className="mt-2 flex justify-end">
                      <AudioPlayer src={`/audios/l20-question${q.id}.mp3`} compact />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-purple-100 border-2 border-purple-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-800 mb-3">Dicas para suas respostas:</h3>
                <ul className="list-disc pl-5 space-y-2 text-purple-700 text-sm">
                  <li>Use frases completas com horários específicos</li>
                  <li>Mencione dias da semana quando apropriado</li>
                  <li>Use verbos de rotina: go, have, do, clean, work, study</li>
                  <li>Pratique a pronúncia dos horários em inglês</li>
                  <li>Use expressões de frequência: always, usually, sometimes</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* 4. WEEKLY PLANNING ACTIVITY */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-teal-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📅 4. Weekly Planning Activity</h2>
              <button
                onClick={() => toggleSection('weeklyPlanning')}
                className="ml-4 p-2 rounded-full hover:bg-teal-600 transition"
              >
                {sections.weeklyPlanning ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.weeklyPlanning && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-teal-700 mb-4">Planeje sua semana:</h3>
                <p className="text-teal-600 mb-6">
                  Crie um planejamento semanal com suas atividades. Use o vocabulário aprendido sobre rotinas, tarefas domésticas e horários.
                </p>
               
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                    <div key={day} className="bg-white p-4 rounded-lg border-2 border-teal-200">
                      <h4 className="font-bold text-teal-700 text-center mb-3">{day}</h4>
                      <textarea
                        value={notes[`day-${index}`] || ""}
                        onChange={(e) => handleNoteChange(`day-${index}`, e.target.value)}
                        placeholder={`Your ${day} routine...`}
                        className="w-full h-32 p-2 border border-teal-300 rounded-md resize-none text-sm"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-teal-100 border-2 border-teal-300 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-teal-800 mb-3">Useful phrases for your weekly plan:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="list-disc pl-5 space-y-1 text-teal-700">
                      <li>I wake up at [time]</li>
                      <li>I have breakfast/lunch/dinner at [time]</li>
                      <li>I go to work/school at [time]</li>
                      <li>I finish work at [time]</li>
                      <li>I clean the [room]</li>
                    </ul>
                    <ul className="list-disc pl-5 space-y-1 text-teal-700">
                      <li>I do the laundry/ironing</li>
                      <li>I study English for [time]</li>
                      <li>I exercise/go to the gym</li>
                      <li>I go to bed at [time]</li>
                      <li>On weekends I [activity]</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-teal-300 rounded-xl p-6">
                <h3 className="text-lg font-bold text-teal-700 mb-4">Descreva sua semana ideal:</h3>
                <textarea
                  value={notes["ideal-week"] || ""}
                  onChange={(e) => handleNoteChange("ideal-week", e.target.value)}
                  placeholder="Write about your ideal weekly routine. What would you like to change? What activities would you add?"
                  className="w-full h-40 p-4 border border-teal-300 rounded-md resize-none"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={saveNotes}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition"
                  >
                    Salvar Planejamento
                  </button>
                  <button
                    onClick={speakIdealWeek}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
                  >
                    <span>👩</span> Ouvir Descrição (Voz Feminina)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TUNE IN YOUR EARS */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-[30px] shadow-lg overflow-hidden mb-10">
          <div className="bg-orange-500 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection('tuneIn')}
                className="ml-4 p-2 rounded-full hover:bg-orange-600 transition"
              >
                {sections.tuneIn ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.tuneIn && (
            <div className="p-8">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-orange-700 mb-4">
                  Watch the video about daily routines and answer the questions below:
                </h3>
               
                {/* Container do vídeo do YouTube - ATUALIZADO */}
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.youtube.com/embed/EXlVa3DkUPo?list=PLc0_DKGuWp_2GK_ZyY81hiV_vdMaUmezE&index=33"
                      title="English Listening Practice - Daily Routines"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>

                <div className="mt-4 text-sm text-orange-600">
                  <p>Video: English Listening Practice - Daily Routines & Conversations</p>
                </div>
              </div>

              {/* Vocabulary Help */}
              <div className="mb-8 bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">📖 Key Vocabulary from the Video:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Daily routine</span>
                      <span className="text-orange-600">Rotina diária</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Wake up</span>
                      <span className="text-orange-600">Acordar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Breakfast</span>
                      <span className="text-orange-600">Café da manhã</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Go to work</span>
                      <span className="text-orange-600">Ir trabalhar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Lunch break</span>
                      <span className="text-orange-600">Intervalo para almoço</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Come home</span>
                      <span className="text-orange-600">Voltar para casa</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Dinner</span>
                      <span className="text-orange-600">Jantar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Relax</span>
                      <span className="text-orange-600">Relaxar</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Go to bed</span>
                      <span className="text-orange-600">Ir dormir</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Weekend</span>
                      <span className="text-orange-600">Fim de semana</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Free time</span>
                      <span className="text-orange-600">Tempo livre</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                      <span className="font-medium text-orange-700">Hobbies</span>
                      <span className="text-orange-600">Hobbies</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="space-y-6 mb-8">
                {videoQuestions.map((question) => (
                  <div key={question.id} className="bg-white p-6 rounded-xl border-2 border-orange-200 shadow-md">
                    <h4 className="text-lg font-bold text-orange-700 mb-3">
                      {question.question}
                      {question.isPersonal && (
                        <span className="ml-2 text-sm font-normal text-orange-500">(Personal answer)</span>
                      )}
                    </h4>
                   
                    {question.vocabulary && (
                      <div className="mb-3 p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-600 mb-1">Vocabulary hints:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-orange-700 font-medium">{word.english}</span>
                              <span className="text-orange-600">- {word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={videoAnswers[question.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(question.id, e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-24 p-3 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => checkVideoAnswer(question.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition font-medium"
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
                      <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-md">
                        <p className="text-sm text-orange-700">
                          <span className="font-medium">Note:</span> This is a personal question. Your answer has been saved for practice.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-orange-100 border-2 border-orange-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-orange-800 mb-4">🎯 Listening Practice Tips:</h3>
                <ul className="list-disc pl-5 space-y-2 text-orange-700 text-sm">
                  <li>Watch the video at least twice - first for general understanding, then for details</li>
                  <li>Pay attention to daily routine vocabulary and expressions</li>
                  <li>Note down phrases you can use in your own conversations</li>
                  <li>Practice repeating the sentences to improve pronunciation</li>
                  <li>Try to describe your own routine using the vocabulary from the video</li>
                  <li>Focus on understanding the main ideas rather than every single word</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson19")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={saveAllAnswers}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300"
            >
              Save All Answers
            </button>
            <button
              onClick={saveNotes}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            >
              Salvar Progresso
            </button>
          </div>
          
          <button
            onClick={() => router.push("/cursos/lesson21")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}