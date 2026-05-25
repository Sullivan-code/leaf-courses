"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  Volume2,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  XCircle,
  Repeat,
  ArrowRight,
  Headphones,
  BookOpen,
} from "lucide-react";

// ==============================================
// TIPOS E INTERFACES
// ==============================================

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

interface SubstitutionExercise {
  id: string;
  baseSentence: string;
  baseTranslation: string;
  substitutions: {
    value: string;
    label: string;
  }[];
  currentSubstitution: string;
}

interface TransformationExercise {
  id: string;
  original: string;
  translation?: string;
  type: "negative" | "affirmative" | "interrogative";
  correctAnswer: string;
  userAnswer: string;
  isCompleted: boolean;
  isCorrect: boolean;
}

interface FluencySentence {
  id: string;
  affirmative: string;
  negative: string;
  interrogative: string;
  translation: string;
  currentMode: "affirmative" | "negative" | "interrogative";
}

interface OutputQuestion {
  id: string;
  question: string;
  translation: string;
}

// ==============================================
// COMPONENTE DE ÁUDIO
// ==============================================

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
        className={`${
          compact ? "p-1" : "p-2"
        } bg-blue-500 text-white rounded-full hover:bg-blue-600 transition`}
      >
        {isPlaying ? (
          <Pause size={compact ? 12 : 16} />
        ) : (
          <Play size={compact ? 12 : 16} />
        )}
      </button>
      <button
        onClick={resetAudio}
        className={`${
          compact ? "p-1" : "p-2"
        } bg-gray-500 text-white rounded-full hover:bg-gray-600 transition`}
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

// ==============================================
// COMPONENTE DE RESULTADO
// ==============================================

const AnswerResult = ({
  isCorrect,
  correctAnswer,
  isReflection = false,
}: {
  isCorrect: boolean;
  correctAnswer: string;
  isReflection?: boolean;
}) => {
  if (isCorrect && !isReflection) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct! ✓</span>
      </div>
    );
  }

  if (isReflection) {
    return (
      <div className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
        <Check size={16} className="text-blue-600" />
        <span className="text-sm text-blue-700 font-medium">
          Great reflection! Keep thinking about your English journey.
        </span>
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

// ==============================================
// COMPONENTE PRINCIPAL
// ==============================================

export default function Lesson26GettingAround() {
  const router = useRouter();

  // ==============================================
  // ESTADOS
  // ==============================================

  // Controle de seções (expandir/recolher)
  const [sections, setSections] = useState({
    fluency: true,
    substitutionOne: true,
    negativeDrill: true,
    substitutionTwo: true,
    affirmativeDrill: true,
    interrogativeDrill: true,
    output: true,
    tuneYourEars: true,
  });

  // Dados do vídeo Tune Your Ears
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});
  const [answerCorrectness, setAnswerCorrectness] = useState<
    Record<string, boolean>
  >({});

  const LESSON_THEME_COLOR = "#0891b2"; // cyan-600
  const LESSON_NUMBER = 26;
  const LESSON_TITLE = "GETTING AROUND";
  const LESSON_SUBTITLE = "Locomotion & Daily Routines";

  const tuneYourEarsVideo = {
    title: "🎧 Tune Your Ears: A Childhood Story",
    description:
      "Listen to this fascinating story about growing up and discovering nature. Practice your listening skills and learn new vocabulary!",
    youtubeId: "q81l6BEHPGo",
    shadowingExplanation:
      "Shadowing is a powerful language learning technique where you listen to native speech and repeat it immediately, trying to match the rhythm, intonation, and pronunciation as closely as possible.",
    questions: [
      {
        id: 1,
        question: "What did you do when you were a kid?",
        correctAnswer: "",
        reflectionType: "personal",
      },
      {
        id: 2,
        question: "Are you afraid of bugs?",
        correctAnswer: "",
        reflectionType: "personal",
      },
      {
        id: 3,
        question: "What games did you play as a kid?",
        correctAnswer: "",
        reflectionType: "personal",
      },
      {
        id: 4,
        question: "Did you watch Pokemon as a kid? If so, what was your favorite Pokemon?",
        correctAnswer: "",
        reflectionType: "personal",
      },
      {
        id: 5,
        question: "Did you use to read when you were younger?",
        correctAnswer: "",
        reflectionType: "personal",
      },
    ],
  };

  const keyVocabulary = [
    { english: "Cards", portuguese: "Cartas", icon: Volume2 },
    { english: "Might", portuguese: "Pode, Podem", icon: Volume2 },
    { english: "Outside", portuguese: "Do lado de fora", icon: Volume2 },
    { english: "To put in", portuguese: "Colocar dentro", icon: Volume2 },
    { english: "I fed them", portuguese: "Eu alimentava eles", icon: Volume2 },
    { english: "Caterpillars", portuguese: "Lagartas", icon: Volume2 },
    { english: "Cantaloupe", portuguese: "Melão", icon: Volume2 },
    { english: "Where I grew up...", portuguese: "Onde eu cresci...", icon: Volume2 },
    { english: "Bones", portuguese: "Ossos", icon: Volume2 },
    { english: "Squirrels", portuguese: "Esquilos", icon: Volume2 },
    { english: "Snake skeleton", portuguese: "Esqueleto de cobra", icon: Volume2 },
    { english: "Gross", portuguese: "Nojento", icon: Volume2 },
    { english: "Paper airplanes", portuguese: "Aviões de papel", icon: Volume2 },
    { english: "To try", portuguese: "Experimentar", icon: Volume2 },
    { english: "To choose", portuguese: "Escolher", icon: Volume2 },
    { english: "Either", portuguese: "também", icon: Volume2 },
    { english: "Usually", portuguese: "Geralmente", icon: Volume2 },
    { english: "Basketball", portuguese: "Basquetebol", icon: Volume2 },
    { english: "I stopped playing", portuguese: "Eu parei de jogar", icon: Volume2 },
  ];

  // Frases da seção de Fluência
  const [fluencySentences, setFluencySentences] = useState<
    FluencySentence[]
  >([
    {
      id: "flu-1",
      affirmative: "She lives alone in France.",
      negative: "She doesn't live alone in France.",
      interrogative: "Does she live alone in France?",
      translation: "Ela mora sozinha na França.",
      currentMode: "affirmative",
    },
    {
      id: "flu-2",
      affirmative: "He wants to take my tablet.",
      negative: "He doesn't want to take my tablet.",
      interrogative: "Does he want to take my tablet?",
      translation: "Ele quer pegar meu tablet.",
      currentMode: "affirmative",
    },
    {
      id: "flu-3",
      affirmative: "My brother goes to the beach on Saturdays.",
      negative: "My brother doesn't go to the beach on Saturdays.",
      interrogative: "Does my brother go to the beach on Saturdays?",
      translation: "Meu irmão vai à praia aos sábados.",
      currentMode: "affirmative",
    },
    {
      id: "flu-4",
      affirmative: "He has five sisters.",
      negative: "He doesn't have five sisters.",
      interrogative: "Does he have five sisters?",
      translation: "Ele tem cinco irmãs.",
      currentMode: "affirmative",
    },
    {
      id: "flu-5",
      affirmative: "She has to go to the bank at 3:00 p.m.",
      negative: "She doesn't have to go to the bank at 3:00 p.m.",
      interrogative: "Does she have to go to the bank at 3:00 p.m.?",
      translation: "Ela tem que ir ao banco às 15:00.",
      currentMode: "affirmative",
    },
    {
      id: "flu-6",
      affirmative: "My father wants to buy a cheap car.",
      negative: "My father doesn't want to buy a cheap car.",
      interrogative: "Does my father want to buy a cheap car?",
      translation: "Meu pai quer comprar um carro barato.",
      currentMode: "affirmative",
    },
    {
      id: "flu-7",
      affirmative: "James needs a new backpack.",
      negative: "James doesn't need a new backpack.",
      interrogative: "Does James need a new backpack?",
      translation: "James precisa de uma mochila nova.",
      currentMode: "affirmative",
    },
    {
      id: "flu-8",
      affirmative: "Susan wants to live in Spain.",
      negative: "Susan doesn't want to live in Spain.",
      interrogative: "Does Susan want to live in Spain?",
      translation: "Susan quer morar na Espanha.",
      currentMode: "affirmative",
    },
    {
      id: "flu-9",
      affirmative: "She has to learn German.",
      negative: "She doesn't have to learn German.",
      interrogative: "Does she have to learn German?",
      translation: "Ela tem que aprender alemão.",
      currentMode: "affirmative",
    },
    {
      id: "flu-10",
      affirmative: "He works at the mall.",
      negative: "He doesn't work at the mall.",
      interrogative: "Does he work at the mall?",
      translation: "Ele trabalha no shopping.",
      currentMode: "affirmative",
    },
  ]);

  // Exercícios de substituição - PRÁTICA I (com "work" alterado)
  const [substitutionExercisesOne, setSubstitutionExercisesOne] = useState<
    SubstitutionExercise[]
  >([
    {
      id: "sub1-1",
      baseSentence: "I take a lot of things to school.",
      baseTranslation: "Eu levo muitas coisas para a escola.",
      substitutions: [
        { value: "school", label: "school 🎒" },
        { value: "work", label: "work 💼" },
        { value: "the gym", label: "the gym 🏋️" },
      ],
      currentSubstitution: "school",
    },
    {
      id: "sub1-2",
      baseSentence: "You need to buy a new computer.",
      baseTranslation: "Você precisa comprar um computador novo.",
      substitutions: [
        { value: "computer", label: "computer 💻" },
        { value: "cell phone", label: "cell phone 📱" },
        { value: "car", label: "car 🚗" },
      ],
      currentSubstitution: "computer",
    },
    {
      id: "sub1-3",
      baseSentence: "We want to go to the beach on Saturday.",
      baseTranslation: "Nós queremos ir à praia no sábado.",
      substitutions: [
        { value: "Saturday", label: "Saturday 📅" },
        { value: "Sunday", label: "Sunday ☀️" },
        { value: "this week", label: "this week 📆" },
      ],
      currentSubstitution: "Saturday",
    },
    {
      id: "sub1-4",
      baseSentence: "How much is it?",
      baseTranslation: "Quanto custa?",
      substitutions: [
        { value: "How much is it?", label: "How much is it? 💵" },
        { value: "It's 20 dollars.", label: "It's 20 dollars. 💲" },
        { value: "It's 80.", label: "It's 80. 💰" },
      ],
      currentSubstitution: "How much is it?",
    },
  ]);

  // Exercícios de substituição - PRÁTICA II (com "work" alterado)
  const [substitutionExercisesTwo, setSubstitutionExercisesTwo] = useState<
    SubstitutionExercise[]
  >([
    {
      id: "sub2-1",
      baseSentence: "I don't exercise on weekends.",
      baseTranslation: "Eu não faço exercícios nos fins de semana.",
      substitutions: [
        { value: "weekends", label: "weekends 📆" },
        { value: "work days", label: "work days 💼" },
        { value: "Sundays", label: "Sundays ☀️" },
      ],
      currentSubstitution: "weekends",
    },
    {
      id: "sub2-2",
      baseSentence: "We don't want to stay here during the week.",
      baseTranslation: "Nós não queremos ficar aqui durante a semana.",
      substitutions: [
        { value: "here", label: "here 📍" },
        { value: "there", label: "there 🗺️" },
        { value: "home", label: "home 🏠" },
      ],
      currentSubstitution: "here",
    },
    {
      id: "sub2-3",
      baseSentence: "When do you cook?",
      baseTranslation: "Quando você cozinha?",
      substitutions: [
        { value: "cook", label: "cook 🍳" },
        { value: "wash the dishes", label: "wash the dishes 🍽️" },
        { value: "do laundry", label: "do laundry 🧺" },
      ],
      currentSubstitution: "cook",
    },
    {
      id: "sub2-4",
      baseSentence: "Does he understand Spanish?",
      baseTranslation: "Ele entende espanhol?",
      substitutions: [
        { value: "Spanish", label: "Spanish 🇪🇸" },
        { value: "Portuguese", label: "Portuguese 🇧🇷" },
        { value: "this language", label: "this language 🗣️" },
      ],
      currentSubstitution: "Spanish",
    },
    {
      id: "sub2-5",
      baseSentence: "It's expensive.",
      baseTranslation: "É caro.",
      substitutions: [
        { value: "expensive", label: "expensive 💰" },
        { value: "cheap", label: "cheap 🏷️" },
        { value: "good", label: "good 👍" },
        { value: "bad", label: "bad 👎" },
      ],
      currentSubstitution: "expensive",
    },
  ]);

  // Exercícios de transformação (negativo, afirmativo, interrogativo)
  const [transformationExercises, setTransformationExercises] = useState<
    TransformationExercise[]
  >([
    // Negative drill exercises
    {
      id: "neg-1",
      original: "I buy a lot of books for my children.",
      translation: "Eu compro muitos livros para meus filhos.",
      type: "negative",
      correctAnswer: "I don't buy a lot of books for my children.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "neg-2",
      original: "He needs a new passport.",
      translation: "Ele precisa de um passaporte novo.",
      type: "negative",
      correctAnswer: "He doesn't need a new passport.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "neg-3",
      original: "She likes to cook all day long.",
      translation: "Ela gosta de cozinhar o dia todo.",
      type: "negative",
      correctAnswer: "She doesn't like to cook all day long.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "neg-4",
      original: "I take my tablet to the office.",
      translation: "Eu levo meu tablet para o escritório.",
      type: "negative",
      correctAnswer: "I don't take my tablet to the office.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "neg-5",
      original: "We have to buy tickets for the movies.",
      translation: "Nós temos que comprar ingressos para o cinema.",
      type: "negative",
      correctAnswer: "We don't have to buy tickets for the movies.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "neg-6",
      original: "I know your name and address.",
      translation: "Eu sei seu nome e endereço.",
      type: "negative",
      correctAnswer: "I don't know your name and address.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    // Affirmative drill exercises
    {
      id: "aff-1",
      original: "I don't need to learn Italian.",
      translation: "Eu não preciso aprender italiano.",
      type: "affirmative",
      correctAnswer: "I need to learn Italian.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "aff-2",
      original: "We don't like to go to that drugstore.",
      translation: "Nós não gostamos de ir àquela farmácia.",
      type: "affirmative",
      correctAnswer: "We like to go to that drugstore.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "aff-3",
      original: "My boss doesn't read e-mails in the morning.",
      translation: "Meu chefe não lê e-mails pela manhã.",
      type: "affirmative",
      correctAnswer: "My boss reads e-mails in the morning.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "aff-4",
      original: "She doesn't understand your sister.",
      translation: "Ela não entende sua irmã.",
      type: "affirmative",
      correctAnswer: "She understands your sister.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "aff-5",
      original: "They don't have biology class this week.",
      translation: "Eles não têm aula de biologia esta semana.",
      type: "affirmative",
      correctAnswer: "They have biology class this week.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "aff-6",
      original: "My family doesn't like that restaurant.",
      translation: "Minha família não gosta daquele restaurante.",
      type: "affirmative",
      correctAnswer: "My family likes that restaurant.",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    // Interrogative drill exercises
    {
      id: "int-1",
      original: "He eats an apple for breakfast.",
      translation: "Ele come uma maçã no café da manhã.",
      type: "interrogative",
      correctAnswer: "Does he eat an apple for breakfast?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "int-2",
      original: "She wants to live abroad this year.",
      translation: "Ela quer morar no exterior este ano.",
      type: "interrogative",
      correctAnswer: "Does she want to live abroad this year?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "int-3",
      original: "Your teacher loves to buy books.",
      translation: "Seu professor adora comprar livros.",
      type: "interrogative",
      correctAnswer: "Does your teacher love to buy books?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "int-4",
      original: "My father wants to buy a new car.",
      translation: "Meu pai quer comprar um carro novo.",
      type: "interrogative",
      correctAnswer: "Does my father want to buy a new car?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "int-5",
      original: "He prefers to study in the living room.",
      translation: "Ele prefere estudar na sala de estar.",
      type: "interrogative",
      correctAnswer: "Does he prefer to study in the living room?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
    {
      id: "int-6",
      original: "She works at the gas station.",
      translation: "Ela trabalha no posto de gasolina.",
      type: "interrogative",
      correctAnswer: "Does she work at the gas station?",
      userAnswer: "",
      isCompleted: false,
      isCorrect: false,
    },
  ]);

  // Perguntas da seção OUTPUT
  const [outputQuestions] = useState<OutputQuestion[]>([
    {
      id: "out-1",
      question: "Do you like to buy souvenirs for your friends?",
      translation: "Você gosta de comprar lembrancinhas para seus amigos?",
    },
    {
      id: "out-2",
      question: "Where do you usually buy clothes?",
      translation: "Onde você costuma comprar roupas?",
    },
    {
      id: "out-3",
      question: "What do you usually take to work/school with you?",
      translation: "O que você costuma levar para o trabalho/escola?",
    },
    {
      id: "out-4",
      question: "What does she like to buy at the mall?",
      translation: "O que ela gosta de comprar no shopping?",
    },
    {
      id: "out-5",
      question: "Do you need to clean your house today?",
      translation: "Você precisa limpar sua casa hoje?",
    },
    {
      id: "out-6",
      question: "Does he need a new passport?",
      translation: "Ele precisa de um passaporte novo?",
    },
    {
      id: "out-7",
      question: "What do you need to buy at the grocery store?",
      translation: "O que você precisa comprar no supermercado?",
    },
    {
      id: "out-8",
      question: "Does your co-worker buy gifts for you?",
      translation: "Seu colega de trabalho compra presentes para você?",
    },
    {
      id: "out-9",
      question: "How much is the ticket for the movies?",
      translation: "Quanto custa o ingresso para o cinema?",
    },
    {
      id: "out-10",
      question: "What time do you usually take your children to school?",
      translation: "Que horas você costuma levar seus filhos para a escola?",
    },
  ]);

  // Respostas do usuário para as perguntas OUTPUT
  const [outputAnswers, setOutputAnswers] = useState<Record<string, string>>(
    {}
  );

  // ==============================================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================================

  // Alternar expansão de seções
  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Alternar modo da frase (afirmativa/negativa/interrogativa)
  const toggleSentenceMode = (
    id: string,
    mode: "affirmative" | "negative" | "interrogative"
  ) => {
    setFluencySentences((prev) =>
      prev.map((sentence) =>
        sentence.id === id ? { ...sentence, currentMode: mode } : sentence
      )
    );
  };

  // Alterar substituição - Prática I
  const changeSubstitutionOne = (id: string, value: string) => {
    setSubstitutionExercisesOne((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, currentSubstitution: value } : ex
      )
    );
  };

  // Alterar substituição - Prática II
  const changeSubstitutionTwo = (id: string, value: string) => {
    setSubstitutionExercisesTwo((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, currentSubstitution: value } : ex
      )
    );
  };

  // Atualizar resposta do exercício de transformação
  const handleTransformationChange = (id: string, value: string) => {
    setTransformationExercises((prev) =>
      prev.map((ex) =>
        ex.id === id ? { ...ex, userAnswer: value, isCompleted: false } : ex
      )
    );
  };

  // Verificar exercício de transformação
  const checkTransformation = (id: string) => {
    setTransformationExercises((prev) =>
      prev.map((ex) => {
        if (ex.id === id) {
          const isCorrect =
            ex.userAnswer.toLowerCase().trim().replace(/[.,?!]/g, "") ===
            ex.correctAnswer.toLowerCase().trim().replace(/[.,?!]/g, "");
          return { ...ex, isCompleted: true, isCorrect };
        }
        return ex;
      })
    );
  };

  // Resetar exercício de transformação
  const resetTransformation = (id: string) => {
    setTransformationExercises((prev) =>
      prev.map((ex) =>
        ex.id === id
          ? { ...ex, userAnswer: "", isCompleted: false, isCorrect: false }
          : ex
      )
    );
  };

  // Atualizar resposta do OUTPUT
  const handleOutputAnswerChange = (id: string, value: string) => {
    setOutputAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Funções para o Tune Your Ears
  const handleVideoAnswerChange = (id: number, value: string) => {
    setVideoAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const checkVideoAnswer = (id: number, answer: string, correctAnswer: string, isReflection: boolean) => {
    const key = `video-${id}`;
    
    if (isReflection) {
      setAnswerCorrectness((prev) => ({
        ...prev,
        [key]: true,
      }));
      setShowResults((prev) => ({
        ...prev,
        [key]: true,
      }));
      return;
    }

    const isCorrect = answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    
    setAnswerCorrectness((prev) => ({
      ...prev,
      [key]: isCorrect,
    }));
    
    setShowResults((prev) => ({
      ...prev,
      [key]: true,
    }));
  };

  const clearVideoAnswer = (id: number) => {
    setVideoAnswers((prev) => ({
      ...prev,
      [id]: "",
    }));
    setShowResults((prev) => ({
      ...prev,
      [`video-${id}`]: false,
    }));
  };

  const saveAllAnswers = () => {
    localStorage.setItem("lesson26_fluency", JSON.stringify(fluencySentences));
    localStorage.setItem("lesson26_substitutionOne", JSON.stringify(substitutionExercisesOne));
    localStorage.setItem("lesson26_substitutionTwo", JSON.stringify(substitutionExercisesTwo));
    localStorage.setItem("lesson26_transformations", JSON.stringify(transformationExercises));
    localStorage.setItem("lesson26_output", JSON.stringify(outputAnswers));
    localStorage.setItem("lesson26_video", JSON.stringify(videoAnswers));
    alert("✅ All answers saved successfully!");
  };

  const clearAllAnswers = () => {
    if (confirm("Are you sure you want to clear all answers?")) {
      setFluencySentences((prev) =>
        prev.map((s) => ({ ...s, currentMode: "affirmative" }))
      );
      setSubstitutionExercisesOne((prev) =>
        prev.map((ex) => ({ ...ex, currentSubstitution: ex.substitutions[0].value }))
      );
      setSubstitutionExercisesTwo((prev) =>
        prev.map((ex) => ({ ...ex, currentSubstitution: ex.substitutions[0].value }))
      );
      setTransformationExercises((prev) =>
        prev.map((ex) => ({ ...ex, userAnswer: "", isCompleted: false, isCorrect: false }))
      );
      setOutputAnswers({});
      setVideoAnswers({});
      setShowResults({});
      setAnswerCorrectness({});
      alert("🗑️ All answers cleared!");
    }
  };

  // ==============================================
  // FUNÇÕES DE RENDERIZAÇÃO
  // ==============================================

  // Obter frase atual da fluência
  const getCurrentSentence = (sentence: FluencySentence) => {
    switch (sentence.currentMode) {
      case "affirmative":
        return sentence.affirmative;
      case "negative":
        return sentence.negative;
      case "interrogative":
        return sentence.interrogative;
      default:
        return sentence.affirmative;
    }
  };

  // Renderizar frase de substituição
  const renderSubstitutionSentence = (exercise: SubstitutionExercise) => {
    return exercise.baseSentence.replace(
      new RegExp(
        exercise.substitutions
          .map((s) => s.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|"),
        "g"
      ),
      exercise.currentSubstitution
    );
  };

  // ==============================================
  // RENDERIZAÇÃO PRINCIPAL
  // ==============================================

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url('/images/lesson-transport-bg.jpg')` }}
    >
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-4">
            🚗 LESSON 26 – GETTING AROUND
          </h1>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto">
            Aprenda a falar sobre locomoção, rotinas e necessidades do dia a
            dia. Pratique afirmativas, negativas e interrogativas.
          </p>
        </div>

        {/* ==============================================
            SEÇÃO 1: FLUENCY PRACTICE
            ============================================== */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🗣️ FLUENCY PRACTICE</h2>
              <button
                onClick={() => toggleSection("fluency")}
                className="ml-4 p-2 rounded-full hover:bg-blue-700 transition"
              >
                {sections.fluency ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.fluency && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fluencySentences.map((sentence) => (
                  <div
                    key={sentence.id}
                    className="bg-white p-5 rounded-xl shadow-md border border-blue-200 hover:shadow-lg transition"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-3">
                        <p className="text-lg font-medium text-gray-800">
                          {getCurrentSentence(sentence)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {sentence.translation}
                        </p>
                      </div>

                      <div className="mt-auto">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              toggleSentenceMode(sentence.id, "affirmative")
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                              sentence.currentMode === "affirmative"
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            (+) Affirmative
                          </button>
                          <button
                            onClick={() =>
                              toggleSentenceMode(sentence.id, "negative")
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                              sentence.currentMode === "negative"
                                ? "bg-red-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            (-) Negative
                          </button>
                          <button
                            onClick={() =>
                              toggleSentenceMode(sentence.id, "interrogative")
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                              sentence.currentMode === "interrogative"
                                ? "bg-purple-500 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            (?) Interrogative
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 2: SUBSTITUTION PRACTICE I
            ============================================== */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE I</h2>
              <button
                onClick={() => toggleSection("substitutionOne")}
                className="ml-4 p-2 rounded-full hover:bg-amber-700 transition"
              >
                {sections.substitutionOne ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.substitutionOne && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {substitutionExercisesOne.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-5 rounded-xl shadow-md border border-amber-200"
                  >
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-800">
                        {renderSubstitutionSentence(exercise)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exercise.baseTranslation}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {exercise.substitutions.map((sub) => (
                        <button
                          key={sub.value}
                          onClick={() =>
                            changeSubstitutionOne(exercise.id, sub.value)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            exercise.currentSubstitution === sub.value
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 3: CHANGE INTO NEGATIVE
            ============================================== */}
        <div className="bg-red-50 border-2 border-red-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-red-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➖ CHANGE INTO NEGATIVE</h2>
              <button
                onClick={() => toggleSection("negativeDrill")}
                className="ml-4 p-2 rounded-full hover:bg-red-700 transition"
              >
                {sections.negativeDrill ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.negativeDrill && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformationExercises
                  .filter((ex) => ex.type === "negative")
                  .map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-white p-5 rounded-xl shadow-md border border-red-200"
                    >
                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600">
                          Original:
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {exercise.original}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {exercise.translation}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600 mb-1">
                          Negative form:
                        </p>
                        <textarea
                          value={exercise.userAnswer}
                          onChange={(e) =>
                            handleTransformationChange(exercise.id, e.target.value)
                          }
                          placeholder="Type the negative sentence here..."
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none h-20"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => checkTransformation(exercise.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition text-sm font-medium"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => resetTransformation(exercise.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition text-sm"
                        >
                          Reset
                        </button>
                      </div>

                      {exercise.isCompleted && (
                        <div className="mt-3">
                          <AnswerResult
                            isCorrect={exercise.isCorrect}
                            correctAnswer={exercise.correctAnswer}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 4: SUBSTITUTION PRACTICE II
            ============================================== */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-emerald-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔄 SUBSTITUTION PRACTICE II</h2>
              <button
                onClick={() => toggleSection("substitutionTwo")}
                className="ml-4 p-2 rounded-full hover:bg-emerald-700 transition"
              >
                {sections.substitutionTwo ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.substitutionTwo && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {substitutionExercisesTwo.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="bg-white p-5 rounded-xl shadow-md border border-emerald-200"
                  >
                    <div className="mb-4">
                      <p className="text-lg font-bold text-gray-800">
                        {renderSubstitutionSentence(exercise)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {exercise.baseTranslation}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {exercise.substitutions.map((sub) => (
                        <button
                          key={sub.value}
                          onClick={() =>
                            changeSubstitutionTwo(exercise.id, sub.value)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            exercise.currentSubstitution === sub.value
                              ? "bg-emerald-500 text-white"
                              : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 5: CHANGE INTO AFFIRMATIVE
            ============================================== */}
        <div className="bg-green-50 border-2 border-green-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-green-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">➕ CHANGE INTO AFFIRMATIVE</h2>
              <button
                onClick={() => toggleSection("affirmativeDrill")}
                className="ml-4 p-2 rounded-full hover:bg-green-700 transition"
              >
                {sections.affirmativeDrill ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.affirmativeDrill && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformationExercises
                  .filter((ex) => ex.type === "affirmative")
                  .map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-white p-5 rounded-xl shadow-md border border-green-200"
                    >
                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600">
                          Negative:
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {exercise.original}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {exercise.translation}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600 mb-1">
                          Affirmative form:
                        </p>
                        <textarea
                          value={exercise.userAnswer}
                          onChange={(e) =>
                            handleTransformationChange(exercise.id, e.target.value)
                          }
                          placeholder="Type the affirmative sentence here..."
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none h-20"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => checkTransformation(exercise.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition text-sm font-medium"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => resetTransformation(exercise.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition text-sm"
                        >
                          Reset
                        </button>
                      </div>

                      {exercise.isCompleted && (
                        <div className="mt-3">
                          <AnswerResult
                            isCorrect={exercise.isCorrect}
                            correctAnswer={exercise.correctAnswer}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 6: CHANGE INTO INTERROGATIVE
            ============================================== */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-purple-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">❓ CHANGE INTO INTERROGATIVE</h2>
              <button
                onClick={() => toggleSection("interrogativeDrill")}
                className="ml-4 p-2 rounded-full hover:bg-purple-700 transition"
              >
                {sections.interrogativeDrill ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.interrogativeDrill && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {transformationExercises
                  .filter((ex) => ex.type === "interrogative")
                  .map((exercise) => (
                    <div
                      key={exercise.id}
                      className="bg-white p-5 rounded-xl shadow-md border border-purple-200"
                    >
                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600">
                          Affirmative:
                        </p>
                        <p className="text-lg font-bold text-gray-800">
                          {exercise.original}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {exercise.translation}
                        </p>
                      </div>

                      <div className="mb-3">
                        <p className="text-md font-medium text-gray-600 mb-1">
                          Interrogative form:
                        </p>
                        <textarea
                          value={exercise.userAnswer}
                          onChange={(e) =>
                            handleTransformationChange(exercise.id, e.target.value)
                          }
                          placeholder="Type the question here..."
                          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none h-20"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => checkTransformation(exercise.id)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md transition text-sm font-medium"
                        >
                          Check
                        </button>
                        <button
                          onClick={() => resetTransformation(exercise.id)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition text-sm"
                        >
                          Reset
                        </button>
                      </div>

                      {exercise.isCompleted && (
                        <div className="mt-3">
                          <AnswerResult
                            isCorrect={exercise.isCorrect}
                            correctAnswer={exercise.correctAnswer}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 7: TUNE IN YOUR EARS
            ============================================== */}
        <div className="bg-cyan-50 border-2 border-cyan-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎧 TUNE IN YOUR EARS</h2>
              <button
                onClick={() => toggleSection("tuneYourEars")}
                className="ml-4 p-2 rounded-full hover:bg-cyan-700 transition"
              >
                {sections.tuneYourEars ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>
            </div>
          </div>

          {sections.tuneYourEars && (
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneYourEarsVideo.title}
                </h3>
                <p className="text-cyan-600 mb-6">{tuneYourEarsVideo.description}</p>
                
                {/* SHADOWING EXPLANATION */}
                <div className="bg-cyan-100 border-2 border-cyan-300 rounded-xl p-6 mb-8 text-left">
                  <h4 className="text-lg font-bold text-cyan-800 mb-2 flex items-center gap-2">
                    <Headphones size={20} /> What is Shadowing?
                  </h4>
                  <p className="text-cyan-700">{tuneYourEarsVideo.shadowingExplanation}</p>
                  <p className="text-cyan-600 text-sm mt-2 italic">
                    How to practice: Listen to a short phrase → Pause the video → Repeat exactly what you heard → Focus on rhythm and intonation
                  </p>
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
                          <span className="font-medium text-cyan-700">{item.english}</span>
                        </div>
                        <span className="text-cyan-600 text-sm">{item.portuguese}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* REFLECTION QUESTIONS - CHILDHOOD THEMED */}
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-center text-cyan-700">Childhood Reflection Questions</h3>
                <p className="text-center text-gray-600 -mt-4">
                  Reflect on your childhood memories and share your thoughts in English.
                </p>
                
                {tuneYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 shadow-md"
                       style={{ borderColor: `${LESSON_THEME_COLOR}30` }}>
                    <h4 className="text-lg font-bold mb-3" style={{ color: LESSON_THEME_COLOR }}>
                      Question {q.id}: {q.question}
                    </h4>

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer here... (Share your childhood memories!)"
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
                      >
                        Reflect & Save
                      </button>
                      <button
                        onClick={() => clearVideoAnswer(q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition font-medium"
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
                  <li>Listen first without looking at the questions</li>
                  <li>Practice shadowing: pause after each sentence and repeat</li>
                  <li>Use your mistakes as fuel - learn from them</li>
                  <li>Set a timer for daily practice (15-25 minutes is enough)</li>
                  <li>Remember: progress happens step by step, not overnight</li>
                  <li>Write down new vocabulary and review it regularly</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            SEÇÃO 8: OUTPUT - SPEAKING & WRITING PRACTICE
            ============================================== */}
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
          <div className="bg-indigo-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">💬 OUTPUT - SPEAKING & WRITING</h2>
              <button
                onClick={() => toggleSection("output")}
                className="ml-4 p-2 rounded-full hover:bg-indigo-700 transition"
              >
                {sections.output ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.output && (
            <div className="p-8">
              <div className="mb-6">
                <p className="text-indigo-700 italic">
                  Answer the following questions in complete sentences. Practice
                  speaking out loud or write your answers.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {outputQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="bg-white p-5 rounded-xl shadow-md border border-indigo-200"
                  >
                    <div className="mb-3">
                      <p className="text-md font-bold text-indigo-800">
                        {q.question}
                      </p>
                      <p className="text-sm text-gray-500 mt-1 italic">
                        {q.translation}
                      </p>
                    </div>

                    <textarea
                      value={outputAnswers[q.id] || ""}
                      onChange={(e) =>
                        handleOutputAnswerChange(q.id, e.target.value)
                      }
                      placeholder="Your answer..."
                      className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
                    />

                    <div className="mt-2 flex justify-end">
                      <button
                        onClick={() => {
                          if (outputAnswers[q.id]) {
                            alert(
                              `Your answer: ${outputAnswers[q.id]}\n\nGreat job! Keep practicing.`
                            );
                          } else {
                            alert("Please write an answer first.");
                          }
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                      >
                        Check answer <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==============================================
            RODAPÉ E NAVEGAÇÃO
            ============================================== */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={saveAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition font-medium shadow-md"
            >
              <Check size={20} /> Save All Answers
            </button>
            <button
              onClick={clearAllAnswers}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium shadow-md"
            >
              <X size={20} /> Clear All
            </button>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/cursos")}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full transition font-medium shadow-md"
            >
              &larr; Back to Courses
            </button>
            <button
              onClick={() => router.push(`/cursos/lesson${LESSON_NUMBER + 1}`)}
              className="px-6 py-3 text-white rounded-full transition font-medium shadow-md"
              style={{ backgroundColor: LESSON_THEME_COLOR }}
            >
              Next Lesson &rarr;
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Lesson {LESSON_NUMBER}: {LESSON_TITLE} - {LESSON_SUBTITLE} • Interactive English Practice • All answers are saved in your browser</p>
          <p className="mt-1">🎧 Remember: Tune your ears, practice shadowing, and keep going step by step!</p>
        </div>
      </div>
    </div>
  );
}