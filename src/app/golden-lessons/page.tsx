"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import { Volume2, Eye, EyeOff, X } from "lucide-react";

// ============================================================
// SPEECH SYSTEM WITH AMERICAN FEMALE VOICE
// ============================================================
const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const americanFemaleVoices = voices.filter(
    (voice) =>
      (voice.lang === "en-US" || voice.lang.startsWith("en-US")) &&
      (voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("google us english") ||
        voice.name.toLowerCase().includes("siri") ||
        voice.name.toLowerCase().includes("female") ||
        voice.name === "Google US English" ||
        voice.name === "Samantha")
  );
  const americanVoices = voices.filter(
    (voice) => voice.lang === "en-US" || voice.lang.startsWith("en-US")
  );
  if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
  else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
  window.speechSynthesis.speak(utterance);
};

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => (
  <button
    onClick={() => speakEnglish(text, 0.9)}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-green-100 px-1 rounded transition-colors group ${className}`}
    title="Click to hear American pronunciation"
  >
    {children || text}
    {showIcon && (
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    )}
  </button>
);

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => (
  <button
    onClick={() => {
      const speechText = children && typeof children === "string" ? children : text;
      speakEnglish(speechText, 0.85);
    }}
    className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left w-full ${className}`}
  >
    {children || text}
    <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
  </button>
);

// ============================================================
// NOTE MODAL
// ============================================================
function NoteModal({
  isOpen,
  onClose,
  sectionTitle,
  initialNote,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-green-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
          <button
            onClick={() => {
              onSave(note);
              onClose();
            }}
            className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-800"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-green-500 transition-colors focus:outline-none"
      aria-label="Fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================================
// SUBSTITUTION EXERCISE
// ============================================================
type OptionType = string | { label: string; replacement: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  options: OptionType[];
  currentIndex: number;
}

function SubstitutionOptions({
  exercise,
  onOptionClick,
}: {
  exercise: SubstitutionExercise;
  onOptionClick: (key: string, index: number) => void;
}) {
  const [showEnglish, setShowEnglish] = useState(true);

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string } =>
    typeof opt === "object" && opt !== null && "label" in opt && "replacement" in opt;

  const currentOption = exercise.options[exercise.currentIndex];
  const currentSentence = isObjectOption(currentOption) ? currentOption.replacement : String(currentOption);
  const getOptionLabel = (opt: OptionType) => (isObjectOption(opt) ? opt.label : String(opt));
  const getOptionReplacement = (opt: OptionType) => (isObjectOption(opt) ? opt.replacement : String(opt));

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <button
          onClick={() => setShowEnglish((p) => !p)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-green-700 font-medium" />
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              onOptionClick(exercise.key, index);
              speakEnglish(getOptionReplacement(option), 0.9);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

function HighlightedPhrase({
  text,
  greenWords,
  translation,
}: {
  text: string;
  greenWords: string[];
  translation: string;
}) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, "");
    if (greenWords.some((gw) => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return (
        <span key={i} className="text-green-600 font-bold">
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================================
// GYM LESSON COMPONENT (Lesson 62)
// ============================================================
function GymLesson() {
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [noteModal, setNoteModal] = useState({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

  const toggleDrill = (section: "verbs" | "vocabulary" | "usefulPhrases" | "grammar") =>
    setOpenDrills((prev) => ({ ...prev, [section]: !prev[section] }));

  const openNoteModal = (sectionTitle: string) =>
    setNoteModal({ isOpen: true, sectionTitle, noteContent: savedNotes[sectionTitle] || "" });

  const handleOptionClick = (key: string, index: number) =>
    setSubstitutionState((prev) => ({ ...prev, [key]: index }));

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  const mainImage =
    "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2018_42_14.png?raw=true";
  const grammarImage =
    "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2018_56_53.png?raw=true";
  const readingImage =
    "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage =
    "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage =
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu treino. / ela / nós",
      options: [
        { label: "Eu", replacement: "I work out." },
        { label: "Ela", replacement: "She works out." },
        { label: "Nós", replacement: "We work out." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ele treina. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He trains." },
        { label: "Ela", replacement: "She trains." },
        { label: "Vocês", replacement: "You train." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ela geralmente treina de manhã. / à noite / à tarde",
      options: [
        { label: "de manhã", replacement: "She usually trains in the morning." },
        { label: "à noite", replacement: "She usually trains at night." },
        { label: "à tarde", replacement: "She usually trains in the afternoon." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero ficar mais forte. / saudável / rápido",
      options: [
        { label: "forte", replacement: "I want to become stronger." },
        { label: "saudável", replacement: "I want to become healthier." },
        { label: "rápido", replacement: "I want to become faster." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eles usam máquinas diferentes. / halteres / barras",
      options: [
        { label: "máquinas", replacement: "They use different machines." },
        { label: "halteres", replacement: "They use different dumbbells." },
        { label: "barras", replacement: "They use different barbells." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Ele não gosta de treinar sozinho. / ela / eu",
      options: [
        { label: "Ele", replacement: "He doesn't like training alone." },
        { label: "Ela", replacement: "She doesn't like training alone." },
        { label: "Eu", replacement: "I don't like training alone." },
      ],
      currentIndex: 0,
    },
  ];

  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu uso halteres para os ombros. / barra / kettlebell",
      options: [
        { label: "halteres", replacement: "I use dumbbells for my shoulders." },
        { label: "barra", replacement: "I use a barbell for my shoulders." },
        { label: "kettlebell", replacement: "I use a kettlebell for my shoulders." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ele usa o banco para o peito. / máquina / cabo",
      options: [
        { label: "banco", replacement: "He uses the bench for his chest." },
        { label: "máquina", replacement: "He uses the machine for his chest." },
        { label: "cabo", replacement: "He uses the cable for his chest." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu preciso ajustar o banco. / equipamento / peso",
      options: [
        { label: "banco", replacement: "I need to adjust the bench." },
        { label: "equipamento", replacement: "I need to adjust the equipment." },
        { label: "peso", replacement: "I need to adjust the weight." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Esta máquina trabalha as costas. / peito / pernas",
      options: [
        { label: "costas", replacement: "This machine works your back." },
        { label: "peito", replacement: "This machine works your chest." },
        { label: "pernas", replacement: "This machine works your legs." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Ela não usa pesos muito pesados. / leves / novos",
      options: [
        { label: "pesados", replacement: "She doesn't use very heavy weights." },
        { label: "leves", replacement: "She doesn't use very light weights." },
        { label: "novos", replacement: "She doesn't use very new weights." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu geralmente faço três séries de dez repetições. / quatro / cinco",
      options: [
        { label: "três", replacement: "I usually do three sets of ten reps." },
        { label: "quatro", replacement: "I usually do four sets of ten reps." },
        { label: "cinco", replacement: "I usually do five sets of ten reps." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Hoje estou treinando peito e tríceps. / costas / pernas",
      options: [
        { label: "peito e tríceps", replacement: "Today I am training my chest and triceps." },
        { label: "costas e bíceps", replacement: "Today I am training my back and biceps." },
        { label: "pernas e glúteos", replacement: "Today I am training my legs and glutes." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela geralmente treina as pernas às segundas. / costas / ombros",
      options: [
        { label: "pernas", replacement: "She usually trains her legs on Mondays." },
        { label: "costas", replacement: "She usually trains her back on Mondays." },
        { label: "ombros", replacement: "She usually trains her shoulders on Mondays." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu sempre aqueço antes de levantar pesos. / corro / alongo",
      options: [
        { label: "aqueço", replacement: "I always warm up before lifting weights." },
        { label: "corro", replacement: "I always run before lifting weights." },
        { label: "alongo", replacement: "I always stretch before lifting weights." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela caminha na esteira por vinte minutos. / corre / pedala",
      options: [
        { label: "caminha", replacement: "She walks on the treadmill for twenty minutes." },
        { label: "corre", replacement: "She runs on the treadmill for twenty minutes." },
        { label: "pedala", replacement: "She rides the bike for twenty minutes." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Ela consegue fazer dez barras fixas. / flexões / paralelas",
      options: [
        { label: "barras fixas", replacement: "She can do ten pull-ups." },
        { label: "flexões", replacement: "She can do ten push-ups." },
        { label: "paralelas", replacement: "She can do ten dips." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Eu tento comer proteína suficiente todos os dias. / carboidratos / vegetais",
      options: [
        { label: "proteína", replacement: "I try to eat enough protein every day." },
        { label: "carboidratos", replacement: "I try to eat enough carbohydrates every day." },
        { label: "vegetais", replacement: "I try to eat enough vegetables every day." },
      ],
      currentIndex: 0,
    },
  ];

  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Este banco está disponível? / máquina / halteres",
      options: [
        { label: "banco", replacement: "Is this bench available?" },
        { label: "máquina", replacement: "Is this machine available?" },
        { label: "halteres", replacement: "Are these dumbbells available?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Desculpa, ainda estou usando esta máquina. / banco / rack",
      options: [
        { label: "máquina", replacement: "Sorry, I am still using this machine." },
        { label: "banco", replacement: "Sorry, I am still using this bench." },
        { label: "rack", replacement: "Sorry, I am still using this rack." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Posso revezar com você? / treinar / compartilhar",
      options: [
        { label: "revezar", replacement: "Can I work in with you?" },
        { label: "treinar", replacement: "Can I train with you?" },
        { label: "compartilhar", replacement: "Can I share with you?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você pode me ajudar no supino? / agachamento / levantamento terra",
      options: [
        { label: "supino", replacement: "Can you spot me on the bench press?" },
        { label: "agachamento", replacement: "Can you spot me on the squat?" },
        { label: "levantamento terra", replacement: "Can you spot me on the deadlift?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Alguém está usando esses halteres? / anilhas / barras",
      options: [
        { label: "halteres", replacement: "Does anyone use these dumbbells?" },
        { label: "anilhas", replacement: "Does anyone use these plates?" },
        { label: "barras", replacement: "Does anyone use these barbells?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Ele sempre limpa o equipamento depois de usá-lo. / ela / eu",
      options: [
        { label: "Ele", replacement: "He always cleans the equipment after using it." },
        { label: "Ela", replacement: "She always cleans the equipment after using it." },
        { label: "Eu", replacement: "I always clean the equipment after using it." },
      ],
      currentIndex: 0,
    },
  ];

  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu geralmente treino depois do trabalho. / ela / nós",
      options: [
        { label: "Eu", replacement: "I usually work out after work." },
        { label: "Ela", replacement: "She usually works out after work." },
        { label: "Nós", replacement: "We usually work out after work." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela vai à academia quatro vezes por semana. / ele / eles",
      options: [
        { label: "Ela", replacement: "She goes to the gym four times a week." },
        { label: "Ele", replacement: "He goes to the gym four times a week." },
        { label: "Eles", replacement: "They go to the gym four times a week." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não gosta de treinar sozinho. / ela / eu",
      options: [
        { label: "Ele", replacement: "He doesn't like training alone." },
        { label: "Ela", replacement: "She doesn't like training alone." },
        { label: "Eu", replacement: "I don't like training alone." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ela treina todos os dias? / ele / vocês",
      options: [
        { label: "Ela", replacement: "Does she train every day?" },
        { label: "Ele", replacement: "Does he train every day?" },
        { label: "Vocês", replacement: "Do you train every day?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu tento seguir a mesma rotina. / ela / eles",
      options: [
        { label: "Eu", replacement: "I try to follow the same routine." },
        { label: "Ela", replacement: "She tries to follow the same routine." },
        { label: "Eles", replacement: "They try to follow the same routine." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Meu treino dura cerca de uma hora. / dela / deles",
      options: [
        { label: "Meu", replacement: "My workout takes about one hour." },
        { label: "Dela", replacement: "Her workout takes about one hour." },
        { label: "Deles", replacement: "Their workout takes about one hour." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu quero aumentar meu número de repetições. / diminuir / manter",
      options: [
        { label: "aumentar", replacement: "I want to increase my number of repetitions." },
        { label: "diminuir", replacement: "I want to decrease my number of repetitions." },
        { label: "manter", replacement: "I want to maintain my number of repetitions." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Ele vai tentar um peso maior na próxima semana. / menor / mais leve",
      options: [
        { label: "maior", replacement: "He will try a heavier weight next week." },
        { label: "menor", replacement: "He will try a lighter weight next week." },
        { label: "mais leve", replacement: "He will try a much lighter weight next week." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eu tenho praticado minha técnica de agachamento. / supino / levantamento terra",
      options: [
        { label: "agachamento", replacement: "I have been practicing my squat technique." },
        { label: "supino", replacement: "I have been practicing my bench press technique." },
        { label: "levantamento terra", replacement: "I have been practicing my deadlift technique." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu preciso descansar depois de um treino pesado. / leve / longo",
      options: [
        { label: "pesado", replacement: "I need to rest after a hard workout." },
        { label: "leve", replacement: "I need to rest after a light workout." },
        { label: "longo", replacement: "I need to rest after a long workout." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Ela pratica boxe duas vezes por semana. / Muay Thai / jiu-jítsu",
      options: [
        { label: "boxe", replacement: "She practices boxing twice a week." },
        { label: "Muay Thai", replacement: "She practices Muay Thai twice a week." },
        { label: "jiu-jítsu", replacement: "She practices jiu-jitsu twice a week." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Meu principal objetivo é ganhar mais músculos. / perder gordura / melhorar a força",
      options: [
        { label: "ganhar músculos", replacement: "My main goal is to build more muscle." },
        { label: "perder gordura", replacement: "My main goal is to lose fat." },
        { label: "melhorar a força", replacement: "My main goal is to improve my strength." },
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...vocabSubstitution,
    ...phrasesSubstitution,
    ...grammarSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find((e) => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "I usually work out at the gym after work.",
      pt: "Eu geralmente treino na academia depois do trabalho.",
      green: ["work out", "gym"],
    },
    {
      en: "I go to the gym four times a week.",
      pt: "Eu vou à academia quatro vezes por semana.",
      green: ["gym", "four", "times"],
    },
    {
      en: "How often do you go to the gym?",
      pt: "Com que frequência você vai à academia?",
      green: ["How", "often", "gym"],
    },
    {
      en: "Can I work in with you?",
      pt: "Posso revezar com você?",
      green: ["work", "in", "with"],
    },
  ];

  return (
    <div className="bg-[#f0faf5] rounded-2xl p-4 md:p-8">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-[#0c4a6e] mb-4">
          🏋️ Gym &amp; Fitness
        </h1>
        <SpeakSentence
          text="Learn to talk about the gym, workouts, equipment, and fitness routines."
          className="text-base md:text-xl text-gray-700 max-w-3xl mx-auto mb-6"
        >
          📚 Learn to talk about the gym, workouts, equipment, and fitness routines.
        </SpeakSentence>
        <div className="w-56 h-56 md:w-64 md:h-64 mx-auto">
          <img
            src={mainImage}
            alt="Fitness and gym"
            onClick={() => setIsMainImageModalOpen(true)}
            className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
          />
        </div>
      </div>

      {/* SECTION 1 – VERBS */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">🔹 VERBS</h2>
            <PencilIcon onClick={() => openNoteModal("Verbs")} />
          </div>
          <button
            onClick={() => toggleDrill("verbs")}
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-sm border border-white/40"
          >
            {openDrills.verbs ? "Hide Exercise" : "Show Exercise"}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-md text-gray-600 mb-4 italic">
            🎧 Click on the verbs to hear the pronunciation and practice their forms
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
            <li><SpeakText text="to work out" className="text-green-600 font-bold">to work out</SpeakText> = treinar</li>
            <li><SpeakText text="to train" className="text-green-600 font-bold">to train</SpeakText> = treinar</li>
            <li><SpeakText text="to lift" className="text-green-600 font-bold">to lift</SpeakText> = levantar</li>
            <li><SpeakText text="to stretch" className="text-green-600 font-bold">to stretch</SpeakText> = alongar</li>
            <li><SpeakText text="to warm up" className="text-green-600 font-bold">to warm up</SpeakText> = aquecer</li>
            <li><SpeakText text="to rest" className="text-green-600 font-bold">to rest</SpeakText> = descansar</li>
            <li><SpeakText text="to improve" className="text-green-600 font-bold">to improve</SpeakText> = melhorar</li>
          </ul>
          {openDrills.verbs && (
            <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
              {verbsSubstitution.map((ex) => {
                const currentEx = getExerciseWithIndex(ex.key);
                if (!currentEx) return null;
                return (
                  <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2 – NEW WORDS */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">🔹 NEW WORDS</h2>
            <PencilIcon onClick={() => openNoteModal("New Words")} />
          </div>
          <button
            onClick={() => toggleDrill("vocabulary")}
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-sm border border-white/40"
          >
            {openDrills.vocabulary ? "Hide Exercise" : "Show Exercise"}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-md text-gray-600 mb-4 italic">
            🎧 Click on each word to hear its correct pronunciation
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { en: "gym", pt: "academia" },
              { en: "workout", pt: "treino" },
              { en: "dumbbell", pt: "halter" },
              { en: "barbell", pt: "barra" },
              { en: "plate", pt: "anilha" },
              { en: "bench", pt: "banco" },
              { en: "cable", pt: "cabo" },
              { en: "kettlebell", pt: "kettlebell" },
              { en: "set", pt: "série" },
              { en: "rep", pt: "repetição" },
              { en: "chest", pt: "peito" },
              { en: "back", pt: "costas" },
              { en: "shoulders", pt: "ombros" },
              { en: "legs", pt: "pernas" },
              { en: "squat", pt: "agachamento" },
              { en: "deadlift", pt: "levantamento terra" },
              { en: "bench press", pt: "supino" },
              { en: "treadmill", pt: "esteira" },
              { en: "warm-up", pt: "aquecimento" },
              { en: "protein", pt: "proteína" },
              { en: "rest", pt: "descanso" },
              { en: "injury", pt: "lesão" },
              { en: "boxing", pt: "boxe" },
              { en: "sparring", pt: "treino de combate" },
            ].map((word, idx) => (
              <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                <SpeakText text={word.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">
                  {word.en}
                </SpeakText>
                <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
              </div>
            ))}
          </div>
          {openDrills.vocabulary && (
            <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
              {vocabSubstitution.map((ex) => {
                const currentEx = getExerciseWithIndex(ex.key);
                if (!currentEx) return null;
                return (
                  <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 – SPEAK LIKE A NATIVE */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">🔹 Speak Like a Native</h2>
            <PencilIcon onClick={() => openNoteModal("Useful Phrases")} />
          </div>
          <button
            onClick={() => toggleDrill("usefulPhrases")}
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-sm border border-white/40"
          >
            {openDrills.usefulPhrases ? "Hide Exercise" : "Show Exercise"}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-md text-gray-600 mb-4 italic">
            💬 Practice common phrases for real gym situations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {usefulPhrasesData.map((item, idx) => (
              <HighlightedPhrase
                key={idx}
                text={item.en}
                greenWords={item.green}
                translation={item.pt}
              />
            ))}
          </div>
          {openDrills.usefulPhrases && (
            <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
              {phrasesSubstitution.map((ex) => {
                const currentEx = getExerciseWithIndex(ex.key);
                if (!currentEx) return null;
                return (
                  <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 4 – GRAMMAR */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">🔹 GRAMMAR</h2>
            <PencilIcon onClick={() => openNoteModal("Grammar")} />
          </div>
          <button
            onClick={() => toggleDrill("grammar")}
            className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 text-sm border border-white/40"
          >
            {openDrills.grammar ? "Hide Exercise" : "Show Exercise"}
          </button>
        </div>
        <div className="p-6 md:p-8">
          <p className="text-md text-gray-600 mb-4 italic">
            📚 Present simple, frequency adverbs, and routines for talking about fitness
          </p>
          <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
            <img
              src={grammarImage}
              alt="Grammar illustration"
              className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
          </div>
          <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
            {[
              { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
              { en: "I go to the gym four times a week.", pt: "Eu vou à academia quatro vezes por semana." },
              { en: "She usually trains in the morning.", pt: "Ela geralmente treina de manhã." },
              { en: "He works out with his brother.", pt: "Ele treina com o irmão dele." },
              { en: "They use different machines during their workout.", pt: "Eles usam máquinas diferentes durante o treino." },
              { en: "I want to become stronger this year.", pt: "Eu quero ficar mais forte este ano." },
              { en: "My workout usually takes about one hour.", pt: "Meu treino geralmente dura cerca de uma hora." },
              { en: "Does she train every day?", pt: "Ela treina todos os dias?" },
              { en: "He doesn't like training alone.", pt: "Ele não gosta de treinar sozinho." },
              { en: "I try to follow the same routine every week.", pt: "Eu tento seguir a mesma rotina toda semana." },
              { en: "How often do you go to the gym?", pt: "Com que frequência você vai à academia?" },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <SpeakSentence text={item.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">
                  {item.en}
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
              </div>
            ))}
          </div>
          {openDrills.grammar && (
            <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4">
              {grammarSubstitution.map((ex) => {
                const currentEx = getExerciseWithIndex(ex.key);
                if (!currentEx) return null;
                return (
                  <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 5 – MAKE IT YOURS */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8 flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center">
            <h2 className="text-xl md:text-2xl font-bold">🔹 Make it yours!</h2>
            <PencilIcon onClick={() => openNoteModal("Make it yours!")} />
          </div>
          <div className="text-sm text-green-100">Practice real-life situations</div>
        </div>
        <div className="p-6 md:p-8">
          <div className="bg-green-50 rounded-[20px] p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3 space-y-4">
                {[
                  { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
                  { en: "She is putting more plates on the barbell.", pt: "Ela está colocando mais anilhas na barra." },
                  { en: "I need to adjust the seat before I start.", pt: "Eu preciso ajustar o banco antes de começar." },
                  { en: "I usually do three sets of ten reps.", pt: "Eu geralmente faço três séries de dez repetições." },
                  { en: "Today I am training my chest and triceps.", pt: "Hoje estou treinando peito e tríceps." },
                  { en: "I always warm up before lifting weights.", pt: "Eu sempre aqueço antes de levantar pesos." },
                  { en: "She can do ten pull-ups without stopping.", pt: "Ela consegue fazer dez barras fixas sem parar." },
                  { en: "I try to eat enough protein every day.", pt: "Eu tento comer proteína suficiente todos os dias." },
                  { en: "I need to rest after a hard workout.", pt: "Eu preciso descansar depois de um treino pesado." },
                  { en: "She practices boxing twice a week.", pt: "Ela pratica boxe duas vezes por semana." },
                  { en: "My main goal is to build more muscle.", pt: "Meu principal objetivo é ganhar mais músculos." },
                  { en: "Is this bench available?", pt: "Este banco está disponível?" },
                ].map((s, idx) => (
                  <div key={idx} className="group">
                    <SpeakSentence text={s.en} className="text-base font-medium">
                      {idx + 1}. {s.en}
                    </SpeakSentence>
                    <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                  </div>
                ))}
              </div>
              <div className="lg:w-1/3 flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <img src={readingImage} alt="Lifting weights" className="rounded-xl object-cover w-full h-40" />
                  <p className="text-center mt-2 text-gray-700 italic">Lifting weights at the gym</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <img src={placesImage} alt="Cardio training" className="rounded-xl object-cover w-full h-40" />
                  <p className="text-center mt-2 text-gray-700 italic">Cardio &amp; endurance training</p>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-md">
                  <img src={digitalImage} alt="Healthy nutrition" className="rounded-xl object-cover w-full h-40" />
                  <p className="text-center mt-2 text-gray-700 italic">Healthy nutrition &amp; recovery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6 – WRAP UP */}
      <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold">🔹 WRAP UP!</h2>
          <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-green-100 italic">
            📝 Key expressions and useful vocabulary to remember
          </SpeakSentence>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="bg-green-900 text-white flex-1 p-6 space-y-4">
            <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
            {[
              { en: "I usually work out at the gym after work.", pt: "Eu geralmente treino na academia depois do trabalho." },
              { en: "I go to the gym four times a week.", pt: "Eu vou à academia quatro vezes por semana." },
              { en: "Can I work in with you?", pt: "Posso revezar com você?" },
              { en: "Can you spot me on the bench press?", pt: "Você pode me ajudar no supino?" },
              { en: "My main goal is to build more muscle.", pt: "Meu principal objetivo é ganhar mais músculos." },
              { en: "I need to rest after a hard workout.", pt: "Eu preciso descansar depois de um treino pesado." },
            ].map((item, idx) => (
              <div key={idx}>
                <SpeakSentence text={item.en} className="text-green-200 hover:text-white">
                  • {item.en}
                </SpeakSentence>
                <p className="text-green-200 text-sm">{item.pt}</p>
              </div>
            ))}
          </div>
          <div className="bg-green-800 text-white flex-1 p-6 space-y-6">
            <div>
              <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
              <ul className="list-disc pl-5 space-y-2 text-green-200">
                <li>Use <strong className="text-white">"usually"</strong> before the main verb: "I usually train..."</li>
                <li><strong className="text-white">"Work out"</strong> is a verb; <strong className="text-white">"workout"</strong> is a noun.</li>
                <li>Use <strong className="text-white">"How often...?"</strong> to ask about frequency.</li>
                <li><strong className="text-white">"Spot me"</strong> means to help someone during an exercise.</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-green-700">
              <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
              <p className="text-green-200">"Can I work in with you?" is the polite way to ask to share equipment at the gym.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAIS DA LIÇÃO */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={grammarImage} alt="Grammar ampliada" className="max-w-full max-h-screen object-contain rounded-lg" />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[60]"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={mainImage} alt="Fitness ampliada" className="max-w-full max-h-screen object-contain rounded-lg" />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={(note) =>
          setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }))
        }
      />
    </div>
  );
}

// ============================================================
// PLACEHOLDER LESSON (para as outras lições)
// ============================================================
function PlaceholderLesson({ title }: { title: string }) {
  return (
    <div className="bg-[#f0faf5] rounded-2xl p-10 text-center">
      <h2 className="text-3xl font-bold text-[#0c4a6e] mb-4">🚧 {title}</h2>
      <p className="text-lg text-gray-700">
        Esta lição será adicionada em breve. Edite o código e coloque o conteúdo manualmente aqui.
      </p>
    </div>
  );
}

// ============================================================
// LESSONS DATA (adicionar manualmente novas lições aqui)
// ============================================================
type LessonId = "gym" | "switzerland" | "south-africa" | "cars";

interface LessonMeta {
  id: LessonId;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  level: string;
  badge: string;
  route?: string; // 👈 NOVO: se tiver route, o botão redireciona em vez de abrir modal
}

const LESSONS: LessonMeta[] = [
  {
    id: "gym",
    title: "Gym & Fitness",
    subtitle: "Academia e Fitness",
    description:
      "Learn to talk about the gym, workouts, equipment, and fitness routines. Vocabulary, grammar, and real-life gym situations.",
    image:
      "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2018_42_14.png?raw=true",
    level: "A2 → B1",
    badge: "🏋️ Fitness",
    // sem route → abre o modal com <GymLesson />
  },
  {
    id: "cars",
    title: "Cars & Driving",
    subtitle: "Carros e Direção",
    description:
      "Talk about cars, driving, the automotive world, and road trips. Real-world English for car lovers.",
    image:
      "https://github.com/Sullivan-code/english-audios/blob/main/CAR%20LESSON.png?raw=true",
    level: "A2 → B1",
    badge: "🚗 Automotive",
    route: "/golden-lessons/goldenlesson-car", // 👈 redireciona para essa rota
  },
  {
    id: "switzerland",
    title: "Switzerland",
    subtitle: "Suíça",
    description:
      "Discover Switzerland — culture, mountains, cities, and daily life. Practice English through travel topics.",
    image:
      "https://images.pexels.com/photos/1298969/pexels-photo-1298969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    level: "A2 → B1",
    badge: "🇨🇭 Travel",
  },
  {
    id: "south-africa",
    title: "South Africa",
    subtitle: "África do Sul",
    description:
      "Explore South Africa — wildlife, culture, cuisine, and landscapes. Learn English through cultural discovery.",
    image:
      "https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    level: "A2 → B1",
    badge: "🇿🇦 Culture",
  },
];

// ============================================================
// LESSON MODAL (abre a lição em tela cheia)
// ============================================================
function LessonModal({
  lesson,
  onClose,
}: {
  lesson: LessonMeta;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen py-6 px-3 md:py-10 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white font-bold text-lg md:text-2xl drop-shadow-lg">
              {lesson.badge} {lesson.title} — {lesson.subtitle}
            </h2>
            <button
              onClick={onClose}
              className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-full shadow-lg hover:bg-gray-100 transition"
            >
              <X size={18} /> Fechar
            </button>
          </div>
          <div className="bg-white rounded-[40px] p-3 md:p-6 shadow-2xl">
            {lesson.id === "gym" ? (
              <GymLesson />
            ) : (
              <PlaceholderLesson title={`${lesson.title} (${lesson.subtitle})`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
export default function Home() {
  const { user } = useUser();
  const router = useRouter();
  const [activeLesson, setActiveLesson] = useState<LessonMeta | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  // 👇 NOVO: decide se abre o modal ou navega para a rota da lição
  const handleLessonClick = (lesson: LessonMeta) => {
    if (lesson.route) {
      router.push(lesson.route);
    } else {
      setActiveLesson(lesson);
    }
  };

  return (
    <div className="relative w-full bg-[#ffffff]">
      {/* ===================== HERO SECTION ===================== */}
      <div className="relative w-full min-h-screen">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/images/mainpage.png")' }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-5xl mx-auto mt-32 md:mt-40 lg:mt-48">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-white drop-shadow-lg leading-tight">
              Eric Sullivan - Fundador da LEAF - Inglês para Fluência Real.
            </h1>
          </div>

          <div className="inline-flex items-center justify-center mt-6">
            <SignedIn>
              <div className="relative group">
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 p-0.5">
                  {user?.imageUrl ? (
                    <div className="w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={user.imageUrl}
                        alt="Foto do perfil"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-base md:text-xl font-bold">
                        {user?.firstName?.[0] || user?.username?.[0] || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {user?.firstName || user?.username || "Usuário"}
                </div>
              </div>
            </SignedIn>

            <SignedOut>
              <div className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 text-base md:text-lg font-semibold transition-all duration-300 hover:from-purple-600 hover:to-purple-800 hover:scale-105 cursor-pointer shadow-lg">
                <SignInButton />
              </div>
            </SignedOut>
          </div>

          <div className="text-center max-w-3xl mx-auto mt-8">
            <p className="text-base md:text-lg lg:text-xl text-white drop-shadow-lg">
              Bem-vindo ao curso que vai transformar sua relação com o inglês! Você está
              preparado para finalmente mudar a sua vida com o inglês ou vai apenas assistir
              a gente mudando a nossa?
            </p>
          </div>
        </div>
      </div>

      <div className="h-12 md:h-16 lg:h-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===================== VÍDEO ===================== */}
        <div className="relative flex justify-center items-center my-8 md:my-12">
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat rounded-2xl"
            style={{
              backgroundImage:
                'url("https://github.com/Sullivan-code/english-audios/raw/main/ChatGPT%20Image%209%20de%20set.%20de%202026%2C%2017_01_37.png")',
            }}
          >
            <div className="absolute inset-0 bg-black/30 rounded-2xl"></div>
          </div>
          <div className="relative w-full max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/80 bg-black/50">
            <iframe
              src="https://player.mediadelivery.net/embed/748540/04725aa2-c483-45df-96e1-6fafbdc0814e"
              title="Vídeo de apresentação"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>

        {/* ===================== SEÇÃO DE LIÇÕES ===================== */}
        <section className="relative bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2070&q=80"
              alt="Lessons"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#000000]">
                📚 Lições Disponíveis
              </h2>
              <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
                Escolha uma lição abaixo e clique em <strong>"Exibir lição"</strong> para
                estudar com áudio americano, exercícios de substituição e traduções em português.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {LESSONS.map((lesson) => (
                <div
                  key={lesson.id}
                  className="group bg-white border-2 border-[#bfdbfe] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={lesson.image}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                      {lesson.badge}
                    </div>
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                      {lesson.level}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-[#0c4a6e] mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 italic">{lesson.subtitle}</p>
                    <p className="text-sm text-gray-700 mb-5 flex-1">{lesson.description}</p>
                    <button
                      onClick={() => handleLessonClick(lesson)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 shadow-md"
                    >
                      Exibir lição →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===================== ABOUT ===================== */}
        <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80"
              alt="Students collaborating"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">Quem Sou</h2>
            <p className="text-xl mb-6 text-[#000000]">
              Sou professor de inglês com formação em Letras - Inglês e Engenharia de Software,
              unindo teoria acadêmica a uma sólida experiência prática em ambientes técnicos e
              profissionais. Como fundador da LEAF, minha missão é fazer com que cada aluno
              alcance a fluência real, independentemente do âmbito profissional ou turístico.
              Estou aqui para guiar você nessa jornada de transformação através do idioma. Ao
              longo dos anos, lecionei tanto presencialmente quanto online, atendendo profissionais
              das áreas de T.I., turismo, administração e comércio exterior. Meu maior propósito
              é transformar a trajetória de cada aluno por meio do inglês, impulsionando suas
              carreiras, ampliando suas oportunidades e contribuindo diretamente para seu
              crescimento profissional e sucesso financeiro.
            </p>
          </div>
        </section>

        {/* ===================== WHY OUR COURSE ===================== */}
        <section className="relative bg-white rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Digital learning"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">
              Por Que Escolher Nosso Curso?
            </h2>
            <p className="text-xl mb-6 text-[#000000] text-center max-w-3xl mx-auto">
              Aqui, o inglês não é apenas estudado, é vivido. Desde o primeiro mês, nossos alunos
              ganham confiança para se comunicar no dia a dia e no ambiente profissional, graças
              a uma metodologia que vai além do tradicional. Usamos metodologias ativas, tecnologia
              de ponta e aplicativos que acompanham você durante toda a semana, com técnicas de
              memorização, prática constante e ferramentas digitais que geram resultados reais.
              Nosso objetivo é que você pense em inglês, se comunique com naturalidade e alcance
              a fluência. Você não está apenas começando um curso — está dando o primeiro passo
              para uma transformação na sua vida pessoal e profissional.
            </p>
          </div>
        </section>

        {/* ===================== TOOLS ===================== */}
        <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Technology in education"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-[#000000] text-center">
              Ferramentas que Potencializam o Aprendizado
            </h2>
            <div className="text-xl text-[#000000] max-w-4xl mx-auto space-y-5">
              <p>📱 Aplicativos de memorização com revisão espaçada (Spaced Repetition)</p>
              <p>🤖 Chatbots com IA para praticar conversação a qualquer hora</p>
              <p>🌍 Plataformas de intercâmbio linguístico para falar com nativos</p>
              <p>🎧 Podcasts e vídeos interativos com transcrição e glossário</p>
              <p>🧠 Jogos e desafios semanais para testar e fixar o conteúdo</p>
            </div>
          </div>
        </section>

        {/* ===================== PUBLIC & METHODOLOGY ===================== */}
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="relative bg-white rounded-2xl shadow-xl p-8 border-2 border-[#bfdbfe] hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-600 hover:text-white transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Diverse professionals"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 group-hover:text-white transition-colors duration-300">
                Meu Público
              </h2>
              <ul className="list-disc pl-6 text-xl space-y-4 group-hover:text-white transition-colors duration-300">
                <li>Profissionais de T.I</li>
                <li>Engenheiros de Software</li>
                <li>Profissionais de Saúde</li>
                <li>Engenheiros e Técnicos</li>
                <li>Comissários de Bordo</li>
                <li>Profissionais Offshore</li>
                <li>Advogados e Empreendedores</li>
                <li>Estudantes Internacionais</li>
              </ul>
            </div>
          </div>

          <div className="relative bg-white rounded-2xl shadow-xl p-8 border-2 border-[#bfdbfe] hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-700 hover:text-white transition-all duration-300 overflow-hidden group">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Learning methodology"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 group-hover:text-white transition-colors duration-300">
                Metodologia LEAF
              </h2>
              <div className="space-y-5 text-xl group-hover:text-white transition-colors duration-300">
                <p>✅ Foco em conversação e fluência</p>
                <p>✅ Situações reais do ambiente profissional</p>
                <p>✅ Vocabulário técnico por área de atuação</p>
                <p>✅ Aulas 100% online com flexibilidade</p>
                <p>✅ Ferramentas digitais de memorização</p>
                <p>✅ Contato com falantes nativos</p>
                <p>✅ Material didático personalizado</p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== PLANOS ===================== */}
        <section className="relative bg-white rounded-2xl shadow-xl p-8 mb-16 border-2 border-[#bfdbfe] overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <Image
              src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
              alt="Study plans"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-12 text-[#000000] text-center">Planos de Estudo</h2>
            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {/* TURMA */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Turma</h3>
                  <div className="text-4xl font-bold mb-6">R$ 200/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>2 horas semanais em grupo</li>
                    <li>Material didático digital</li>
                    <li>Simulações de conversas reais</li>
                    <li>Aplicativos de memorização</li>
                    <li>Atividades de conversação com estrangeiros</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-gray-600 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-600 hover:text-white hover:scale-105 mt-auto relative z-10 border-2 border-gray-300">
                  Inscreva-se
                </button>
              </div>

              {/* INDIVIDUAL */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Individual</h3>
                  <div className="text-4xl font-bold mb-6">R$ 300/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>Todos benefícios do Plano Turma</li>
                    <li>Aulas 1:1 personalizadas</li>
                    <li>Atividades de conversação com estrangeiros</li>
                    <li>Conteúdos com filmes, séries &amp; Podcasts</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-amber-600 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-600 hover:text-white hover:scale-105 mt-auto relative z-10 border-2 border-amber-300">
                  Inscreva-se
                </button>
              </div>

              {/* DIAMANTE */}
              <div className="border-2 border-[#bfdbfe] rounded-xl p-8 bg-white hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Diamante</h3>
                  <div className="text-4xl font-bold mb-6">R$ 500/mês</div>
                  <ul className="list-disc pl-6 space-y-4 text-xl mb-8 flex-1">
                    <li>4 horas semanais individuais</li>
                    <li>Materiais premium internacionais</li>
                    <li>Atividades de conversação com estrangeiros</li>
                    <li>Mentoria e suporte prioritário</li>
                    <li>Conteúdo extra para estudar durante a semana</li>
                  </ul>
                </div>
                <button className="w-full bg-white text-sky-500 py-4 rounded-xl font-bold text-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-400 hover:to-blue-500 hover:text-white hover:scale-105 mt-auto relative z-10 border-2 border-sky-300">
                  Inscreva-se
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ===================== LESSON MODAL ===================== */}
      {activeLesson && (
        <LessonModal lesson={activeLesson} onClose={() => setActiveLesson(null)} />
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}