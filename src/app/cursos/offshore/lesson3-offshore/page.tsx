"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

// ============================================
// SPEECH SYSTEM WITH AMERICAN FEMALE VOICE
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const americanFemaleVoices = voices.filter(voice =>
    (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
    (voice.name.toLowerCase().includes('samantha') ||
     voice.name.toLowerCase().includes('google us english') ||
     voice.name.toLowerCase().includes('siri') ||
     voice.name.toLowerCase().includes('female') ||
     voice.name === 'Google US English' ||
     voice.name === 'Samantha')
  );
  const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
  if (americanFemaleVoices.length > 0) {
    utterance.voice = americanFemaleVoices[0];
  } else if (americanVoices.length > 0) {
    utterance.voice = americanVoices[0];
  }
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-red-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />}
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === 'string' ? children : text;
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-red-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-500" />
    </button>
  );
};

// ============================================
// HIGHLIGHTED PHRASE (palavras-chave em vermelho)
// ============================================
function HighlightedPhrase({ text, redWords, translation }: { text: string; redWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (redWords.some(rw => cleanWord.toLowerCase() === rw.toLowerCase())) {
      return <span key={i} className="text-red-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-orange-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// SUBSTITUTION EXERCISE COMPONENT
// ============================================
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

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  const currentSentence = isObjectOption(currentOption) ? currentOption.replacement : String(currentOption);

  const getOptionLabel = (opt: OptionType): string => isObjectOption(opt) ? opt.label : String(opt);
  const getOptionReplacement = (opt: OptionType): string => isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-xl border border-orange-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-red-600 font-medium block">{exercise.original}</p>
        <button
          onClick={() => setShowEnglish(prev => !prev)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-red-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-red-700 font-medium" />
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
                ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 3 MACHINERY & EQUIPMENT
// ============================================
export default function LessonMachineryEquipment() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({ ...openDrills, [section]: !openDrills[section] });
  };

  const handleOptionClick = (key: string, index: number) => {
    setSubstitutionState(prev => ({ ...prev, [key]: index }));
  };

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ============================================================
  // SUBSTITUTION EXERCISES – MACHINERY & EQUIPMENT
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu operei a máquina ontem.",
      options: [
        { label: "operei", replacement: "I operated the machine yesterday." },
        { label: "verifiquei", replacement: "I checked the machine yesterday." },
        { label: "inspecionei", replacement: "I inspected the machine yesterday." },
        { label: "consertei", replacement: "I repaired the machine yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ela verificou o manômetro esta manhã.",
      options: [
        { label: "manômetro", replacement: "She checked the pressure gauge this morning." },
        { label: "sensor de temperatura", replacement: "She checked the temperature sensor this morning." },
        { label: "painel de controle", replacement: "She checked the control panel this morning." },
        { label: "válvula de segurança", replacement: "She checked the safety valve this morning." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Nós fizemos manutenção do equipamento na semana passada.",
      options: [
        { label: "equipamento", replacement: "We maintained the equipment last week." },
        { label: "compressor", replacement: "We maintained the compressor last week." },
        { label: "sistema hidráulico", replacement: "We maintained the hydraulic system last week." },
        { label: "torre de resfriamento", replacement: "We maintained the cooling tower last week." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eles consertaram a bomba na segunda-feira.",
      options: [
        { label: "bomba", replacement: "They repaired the pump on Monday." },
        { label: "gerador", replacement: "They repaired the generator on Monday." },
        { label: "motor", replacement: "They repaired the engine on Monday." },
        { label: "válvula", replacement: "They repaired the valve on Monday." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ele ligou o gerador às 8 da manhã.",
      options: [
        { label: "gerador", replacement: "He started the generator at 8 AM." },
        { label: "máquina", replacement: "He started the machine at 8 AM." },
        { label: "compressor", replacement: "He started the compressor at 8 AM." },
        { label: "motor", replacement: "He started the engine at 8 AM." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu desliguei a esteira transportadora imediatamente.",
      options: [
        { label: "esteira transportadora", replacement: "I stopped the conveyor belt immediately." },
        { label: "máquina", replacement: "I stopped the machine immediately." },
        { label: "motor", replacement: "I stopped the engine immediately." },
        { label: "bomba", replacement: "I stopped the pump immediately." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Nós inspecionamos as válvulas ontem.",
      options: [
        { label: "válvulas", replacement: "We inspected the valves yesterday." },
        { label: "tubos", replacement: "We inspected the pipes yesterday." },
        { label: "sistema de alarme", replacement: "We inspected the alarm system yesterday." },
        { label: "painel de controle", replacement: "We inspected the control panel yesterday." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- VOCABULARY ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu verifiquei o manômetro ontem.",
      options: [
        { label: "manômetro", replacement: "I checked the pressure gauge yesterday." },
        { label: "sensor de temperatura", replacement: "I checked the temperature sensor yesterday." },
        { label: "compressor", replacement: "I checked the compressor yesterday." },
        { label: "sistema hidráulico", replacement: "I checked the hydraulic system yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ele operou a máquina na semana passada.",
      options: [
        { label: "máquina", replacement: "He operated the machine last week." },
        { label: "equipamento", replacement: "He operated the equipment last week." },
        { label: "esteira transportadora", replacement: "He operated the conveyor belt last week." },
        { label: "painel de controle", replacement: "He operated the control panel last week." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Nós fizemos manutenção do compressor na sexta-feira.",
      options: [
        { label: "compressor", replacement: "We maintained the compressor on Friday." },
        { label: "gerador", replacement: "We maintained the generator on Friday." },
        { label: "motor", replacement: "We maintained the engine on Friday." },
        { label: "bomba", replacement: "We maintained the pump on Friday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "O sistema de alarme funcionou ontem.",
      options: [
        { label: "sistema de alarme", replacement: "The alarm system worked yesterday." },
        { label: "válvula de segurança", replacement: "The safety valve worked yesterday." },
        { label: "painel de controle", replacement: "The control panel worked yesterday." },
        { label: "sensor de temperatura", replacement: "The temperature sensor worked yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Nós inspecionamos o sistema hidráulico no mês passado.",
      options: [
        { label: "sistema hidráulico", replacement: "We inspected the hydraulic system last month." },
        { label: "torre de resfriamento", replacement: "We inspected the cooling tower last month." },
        { label: "tubos", replacement: "We inspected the pipes last month." },
        { label: "válvulas", replacement: "We inspected the valves last month." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "A esteira transportadora parou ao meio-dia.",
      options: [
        { label: "esteira transportadora", replacement: "The conveyor belt stopped at noon." },
        { label: "máquina", replacement: "The machine stopped at noon." },
        { label: "bomba", replacement: "The pump stopped at noon." },
        { label: "motor", replacement: "The engine stopped at noon." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Ela verificou o sensor de temperatura esta manhã.",
      options: [
        { label: "sensor de temperatura", replacement: "She checked the temperature sensor this morning." },
        { label: "manômetro", replacement: "She checked the pressure gauge this morning." },
        { label: "painel de controle", replacement: "She checked the control panel this morning." },
        { label: "sistema hidráulico", replacement: "She checked the hydraulic system this morning." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "A válvula de segurança era importante.",
      options: [
        { label: "válvula de segurança", replacement: "The safety valve was important." },
        { label: "válvula", replacement: "The valve was important." },
        { label: "bomba", replacement: "The pump was important." },
        { label: "tubo", replacement: "The pipe was important." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Nós ligamos o gerador às 7 da manhã ontem.",
      options: [
        { label: "gerador", replacement: "We started the generator at 7 AM yesterday." },
        { label: "motor", replacement: "We started the engine at 7 AM yesterday." },
        { label: "compressor", replacement: "We started the compressor at 7 AM yesterday." },
        { label: "bomba", replacement: "We started the pump at 7 AM yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Os tubos precisavam de inspeção.",
      options: [
        { label: "tubos", replacement: "The pipes needed inspection." },
        { label: "válvulas", replacement: "The valves needed inspection." },
        { label: "motores", replacement: "The engines needed inspection." },
        { label: "bombas", replacement: "The pumps needed inspection." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- USEFUL PHRASES ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu verifiquei o sensor de temperatura antes de ligar.",
      options: [
        { label: "sensor de temperatura", replacement: "I checked the temperature sensor before starting." },
        { label: "manômetro", replacement: "I checked the pressure gauge before starting." },
        { label: "sistema hidráulico", replacement: "I checked the hydraulic system before starting." },
        { label: "painel de controle", replacement: "I checked the control panel before starting." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "O compressor funcionou normalmente ontem.",
      options: [
        { label: "compressor", replacement: "The compressor worked normally yesterday." },
        { label: "motor", replacement: "The engine worked normally yesterday." },
        { label: "gerador", replacement: "The generator worked normally yesterday." },
        { label: "equipamento", replacement: "The equipment worked normally yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Nós consertamos o sistema hidráulico na semana passada.",
      options: [
        { label: "sistema hidráulico", replacement: "We repaired the hydraulic system last week." },
        { label: "compressor", replacement: "We repaired the compressor last week." },
        { label: "bomba", replacement: "We repaired the pump last week." },
        { label: "torre de resfriamento", replacement: "We repaired the cooling tower last week." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu desliguei o motor imediatamente.",
      options: [
        { label: "motor", replacement: "I stopped the engine immediately." },
        { label: "máquina", replacement: "I stopped the machine immediately." },
        { label: "bomba", replacement: "I stopped the pump immediately." },
        { label: "compressor", replacement: "I stopped the compressor immediately." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Nós inspecionamos o equipamento todos os dias.",
      options: [
        { label: "equipamento", replacement: "We inspected the equipment every day." },
        { label: "máquina", replacement: "We inspected the machine every day." },
        { label: "válvulas", replacement: "We inspected the valves every day." },
        { label: "tubos", replacement: "We inspected the pipes every day." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "O sistema de alarme ativou às 15h.",
      options: [
        { label: "sistema de alarme", replacement: "The alarm system activated at 3 PM." },
        { label: "válvula de segurança", replacement: "The safety valve activated at 3 PM." },
        { label: "painel de controle", replacement: "The control panel activated at 3 PM." },
        { label: "sensor de temperatura", replacement: "The temperature sensor activated at 3 PM." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Ela operou o painel de controle corretamente.",
      options: [
        { label: "painel de controle", replacement: "She operated the control panel correctly." },
        { label: "máquina", replacement: "She operated the machine correctly." },
        { label: "equipamento", replacement: "She operated the equipment correctly." },
        { label: "esteira transportadora", replacement: "She operated the conveyor belt correctly." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Nós substituímos o tubo na terça-feira.",
      options: [
        { label: "tubo", replacement: "We replaced the pipe on Tuesday." },
        { label: "válvula", replacement: "We replaced the valve on Tuesday." },
        { label: "bomba", replacement: "We replaced the pump on Tuesday." },
        { label: "sensor", replacement: "We replaced the sensor on Tuesday." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "A torre de resfriamento requeria manutenção.",
      options: [
        { label: "torre de resfriamento", replacement: "The cooling tower required maintenance." },
        { label: "sistema hidráulico", replacement: "The hydraulic system required maintenance." },
        { label: "compressor", replacement: "The compressor required maintenance." },
        { label: "gerador", replacement: "The generator required maintenance." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-10",
      original: "Eu não esqueci de verificar a válvula de segurança.",
      options: [
        { label: "válvula de segurança", replacement: "I didn't forget to check the safety valve." },
        { label: "manômetro", replacement: "I didn't forget to check the pressure gauge." },
        { label: "painel de controle", replacement: "I didn't forget to check the control panel." },
        { label: "sistema de alarme", replacement: "I didn't forget to check the alarm system." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR – PAST TENSE ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu verifiquei o manômetro antes da operação.",
      options: [
        { label: "verifiquei", replacement: "I checked the pressure gauge before operation." },
        { label: "não verifiquei", replacement: "I didn't check the pressure gauge before operation." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "O compressor funcionou suavemente.",
      options: [
        { label: "funcionou", replacement: "The compressor ran smoothly." },
        { label: "não funcionou", replacement: "The compressor didn't run smoothly." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "A esteira transportadora não funcionou ontem.",
      options: [
        { label: "não funcionou", replacement: "The conveyor belt didn't work yesterday." },
        { label: "funcionou", replacement: "The conveyor belt worked yesterday." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você inspecionou o sistema hidráulico?",
      options: [
        { label: "inspecionou", replacement: "Did you inspect the hydraulic system?" },
        { label: "não inspecionou", replacement: "You didn't inspect the hydraulic system." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eles seguiram os procedimentos de segurança?",
      options: [
        { label: "seguiram", replacement: "Did they follow the safety procedures?" },
        { label: "não seguiram", replacement: "They didn't follow the safety procedures." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Nós não fizemos manutenção na torre de resfriamento.",
      options: [
        { label: "não fizemos manutenção", replacement: "We didn't maintain the cooling tower." },
        { label: "fizemos manutenção", replacement: "We maintained the cooling tower." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ela não verificou o sensor de temperatura.",
      options: [
        { label: "não verificou", replacement: "She didn't check the temperature sensor." },
        { label: "verificou", replacement: "She checked the temperature sensor." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Você consertou a bomba na semana passada?",
      options: [
        { label: "consertou", replacement: "Did you repair the pump last week?" },
        { label: "não consertou", replacement: "You didn't repair the pump last week." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "O motor não ligou esta manhã.",
      options: [
        { label: "não ligou", replacement: "The engine didn't start this morning." },
        { label: "ligou", replacement: "The engine started this morning." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Nós registramos todas as leituras?",
      options: [
        { label: "registramos", replacement: "Did we record all the readings?" },
        { label: "não registramos", replacement: "We didn't record all the readings." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================================
  // MAKE IT YOURS – frases com palavras-chave em vermelho
  // ============================================================
  const makeItYoursData = [
    {
      en: "I checked the pressure gauge before starting.",
      pt: "Eu verifiquei o manômetro antes de ligar.",
      red: ["pressure", "gauge"]
    },
    {
      en: "The engine ran normally yesterday.",
      pt: "O motor funcionou normalmente ontem.",
      red: ["engine"]
    },
    {
      en: "We repaired the pump last week.",
      pt: "Nós consertamos a bomba na semana passada.",
      red: ["pump"]
    },
    {
      en: "I stopped the conveyor belt immediately.",
      pt: "Eu desliguei a esteira transportadora imediatamente.",
      red: ["conveyor", "belt"]
    },
    {
      en: "The alarm system activated at 2 PM.",
      pt: "O sistema de alarme ativou às 14h.",
      red: ["alarm", "system"]
    },
    {
      en: "We inspected the cooling tower yesterday.",
      pt: "Nós inspecionamos a torre de resfriamento ontem.",
      red: ["cooling", "tower"]
    },
    {
      en: "You checked the safety valve yesterday.",
      pt: "Você verificou a válvula de segurança ontem.",
      red: ["safety", "valve"]
    },
    {
      en: "Did you operate the control panel yesterday?",
      pt: "Você operou o painel de controle ontem?",
      red: ["control", "panel"]
    },
    {
      en: "The temperature sensor malfunctioned yesterday.",
      pt: "O sensor de temperatura apresentou defeito ontem.",
      red: ["temperature", "sensor"]
    },
    {
      en: "We recorded the readings in the logbook yesterday.",
      pt: "Nós registramos as leituras no livro de registro ontem.",
      red: ["logbook"]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%201%20de%20jul.%20de%202026%2C%2014_59_42.png?raw=true")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Container principal com fade vermelho e laranja */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-100 via-orange-100 to-red-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-red-300/50">

        {/* Título centralizado com imagem abaixo - IMAGEM DA PLATAFORMA OFFSHORE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 3 - Machinery & Equipment
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about industrial machines, tools, and equipment in English. 🔧⚙️
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Offshore oil platform at sea"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - North Sea</p>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS - Actions with Equipment</h2>
              <p className="mt-2 text-red-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to operate" className="text-red-600 font-bold">
                  to operate
                </SpeakText> = operar / manusear
              </li>
              <li>
                <SpeakText text="to check" className="text-red-600 font-bold">
                  to check
                </SpeakText> = verificar / checar
              </li>
              <li>
                <SpeakText text="to maintain" className="text-red-600 font-bold">
                  to maintain
                </SpeakText> = fazer manutenção
              </li>
              <li>
                <SpeakText text="to inspect" className="text-red-600 font-bold">
                  to inspect
                </SpeakText> = inspecionar
              </li>
              <li>
                <SpeakText text="to repair" className="text-red-600 font-bold">
                  to repair
                </SpeakText> = reparar / consertar
              </li>
              <li>
                <SpeakText text="to start" className="text-red-600 font-bold">
                  to start
                </SpeakText> = ligar / iniciar
              </li>
              <li>
                <SpeakText text="to stop" className="text-red-600 font-bold">
                  to stop
                </SpeakText> = desligar / parar
              </li>
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {verbsSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Machinery & Equipment Vocabulary</h2>
              <p className="mt-2 text-red-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li><SpeakText text="machine" className="text-red-600 font-bold">machine</SpeakText> = máquina</li>
              <li><SpeakText text="equipment" className="text-red-600 font-bold">equipment</SpeakText> = equipamento</li>
              <li><SpeakText text="engine" className="text-red-600 font-bold">engine</SpeakText> = motor</li>
              <li><SpeakText text="pump" className="text-red-600 font-bold">pump</SpeakText> = bomba</li>
              <li><SpeakText text="compressor" className="text-red-600 font-bold">compressor</SpeakText> = compressor</li>
              <li><SpeakText text="generator" className="text-red-600 font-bold">generator</SpeakText> = gerador</li>
              <li><SpeakText text="valve" className="text-red-600 font-bold">valve</SpeakText> = válvula</li>
              <li><SpeakText text="pipe" className="text-red-600 font-bold">pipe</SpeakText> = tubo / cano</li>
              <li><SpeakText text="pressure gauge" className="text-red-600 font-bold">pressure gauge</SpeakText> = manômetro</li>
              <li><SpeakText text="temperature sensor" className="text-red-600 font-bold">temperature sensor</SpeakText> = sensor de temperatura</li>
              <li><SpeakText text="conveyor belt" className="text-red-600 font-bold">conveyor belt</SpeakText> = esteira transportadora</li>
              <li><SpeakText text="control panel" className="text-red-600 font-bold">control panel</SpeakText> = painel de controle</li>
              <li><SpeakText text="alarm system" className="text-red-600 font-bold">alarm system</SpeakText> = sistema de alarme</li>
              <li><SpeakText text="safety valve" className="text-red-600 font-bold">safety valve</SpeakText> = válvula de segurança</li>
              <li><SpeakText text="hydraulic system" className="text-red-600 font-bold">hydraulic system</SpeakText> = sistema hidráulico</li>
              <li><SpeakText text="cooling tower" className="text-red-600 font-bold">cooling tower</SpeakText> = torre de resfriamento</li>
            </ul>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {vocabSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Technician</h2>
              <p className="mt-2 text-red-100 italic">
                Practice common phrases for equipment operation and maintenance
              </p>
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakSentence text="Check the pressure gauge before starting." className="text-red-600 font-bold">
                  Check the pressure gauge before starting.
                </SpeakSentence> = Verifique o manômetro antes de ligar.
              </li>
              <li>
                <SpeakSentence text="The equipment is working normally." className="text-red-600 font-bold">
                  The equipment is working normally.
                </SpeakSentence> = O equipamento está funcionando normalmente.
              </li>
              <li>
                <SpeakSentence text="We need to repair the pump." className="text-red-600 font-bold">
                  We need to repair the pump.
                </SpeakSentence> = Nós precisamos consertar a bomba.
              </li>
              <li>
                <SpeakSentence text="Stop the machine immediately!" className="text-red-600 font-bold">
                  Stop the machine immediately!
                </SpeakSentence> = Desligue a máquina imediatamente!
              </li>
            </ul>

            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {phrasesSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill - Past Tense Focus */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Past Tense & Questions</h2>
              <p className="mt-2 text-red-100 italic">
                Learn to use past tense with questions and negatives
              </p>
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <div className="bg-red-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="font-bold text-red-700">Past Tense - Regular Verbs</p>
              <p>
                <SpeakSentence text="I checked the valve before operation." className="text-red-600 font-bold">
                  I checked the valve before operation.
                </SpeakSentence> = Eu verifiquei a válvula antes da operação.
              </p>
              <p>
                <SpeakSentence text="The machine ran smoothly." className="text-red-600 font-bold">
                  The machine ran smoothly.
                </SpeakSentence> = A máquina funcionou suavemente.
              </p>
              <p>
                <SpeakSentence text="The pump did not work yesterday." className="text-red-600 font-bold">
                  The pump did not work yesterday.
                </SpeakSentence> = A bomba não funcionou ontem.
              </p>
              <p className="font-bold text-red-700 mt-4">Past Tense - Questions</p>
              <p>
                <SpeakSentence text="Did you inspect the system?" className="text-red-600 font-bold">
                  Did you inspect the system?
                </SpeakSentence> = Você inspecionou o sistema?
              </p>
              <p>
                <SpeakSentence text="Did they follow the safety procedures?" className="text-red-600 font-bold">
                  Did they follow the safety procedures?
                </SpeakSentence> = Eles seguiram os procedimentos de segurança?
              </p>
              <p className="font-bold text-red-700 mt-4">Past Tense - Negative</p>
              <p>
                <SpeakSentence text="We did not maintain the equipment." className="text-red-600 font-bold">
                  We did not maintain the equipment.
                </SpeakSentence> = Nós não fizemos manutenção do equipamento.
              </p>
              <p>
                <SpeakSentence text="She did not check the readings." className="text-red-600 font-bold">
                  She did not check the readings.
                </SpeakSentence> = Ela não verificou as leituras.
              </p>
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {grammarSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return (
                    <SubstitutionOptions
                      key={ex.key}
                      exercise={currentEx}
                      onOptionClick={handleOptionClick}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-red-100 italic">
              Substitute the red words to create new sentences and practice real equipment operation
            </p>
          </div>

          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura */}
                <div className="lg:w-2/3 space-y-4">
                  {makeItYoursData.map((item, idx) => (
                    <HighlightedPhrase
                      key={idx}
                      text={item.en}
                      redWords={item.red}
                      translation={item.pt}
                    />
                  ))}
                </div>

                {/* Container das imagens */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
                        alt="Offshore oil platform at sea"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Offshore Oil Platform - North Sea
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Engineer checking control panel"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Technician checking control panel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - WRAP UP */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <p className="mt-2 text-red-100 italic">
                Essential structures for equipment operation and maintenance
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <SpeakSentence text="The machine ran smoothly." className="hover:text-red-200">
                  The machine ran smoothly.
                </SpeakSentence>
                <span className="text-sm text-red-300 ml-2">A máquina funcionou suavemente.</span>
              </p>
              <p className="font-bold">
                <SpeakSentence text="The pump needed repair." className="hover:text-red-200">
                  The pump needed repair.
                </SpeakSentence>
                <span className="text-sm text-red-300 ml-2">A bomba precisava de conserto.</span>
              </p>
              <p className="font-bold">
                <SpeakSentence text="I checked the pressure gauge." className="hover:text-red-200">
                  I checked the pressure gauge.
                </SpeakSentence>
                <span className="text-sm text-red-300 ml-2">Eu verifiquei o manômetro.</span>
              </p>
              <p className="font-bold">
                <SpeakSentence text="I stopped the equipment." className="hover:text-red-200">
                  I stopped the equipment.
                </SpeakSentence>
                <span className="text-sm text-red-300 ml-2">Eu desliguei o equipamento.</span>
              </p>
              <p className="font-bold">
                <SpeakSentence text="They followed safety procedures." className="hover:text-red-200">
                  They followed safety procedures.
                </SpeakSentence>
                <span className="text-sm text-red-300 ml-2">Eles seguiram os procedimentos de segurança.</span>
              </p>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop"
                alt="Engineer with safety helmet"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
                quality={100}
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <SpeakSentence text="Did you check the safety valve?" className="hover:text-red-600">
                  Did you check the safety valve?
                </SpeakSentence>
                <span className="font-bold"> And you?</span>
                <p className="text-sm text-gray-600 mt-1">Você verificou a válvula de segurança? E você?</p>
              </div>
            </div>

            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <span className="mr-2 text-red-200">
                  <Volume2 size={18} />
                </span>
                <p>
                  <SpeakSentence text="Bye! See you." className="hover:text-red-200">
                    Bye! See you.
                  </SpeakSentence>
                  <span className="text-sm text-red-300 ml-2">Tchau! Até mais.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <span className="mr-2 text-red-200">
                  <Volume2 size={18} />
                </span>
                <p>
                  <SpeakSentence text="See you later." className="hover:text-red-200">
                    See you later.
                  </SpeakSentence>
                  <span className="text-sm text-red-300 ml-2">Até mais tarde.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <span className="mr-2 text-red-200">
                  <Volume2 size={18} />
                </span>
                <p>
                  <SpeakSentence text="Good night!" className="hover:text-red-200">
                    Good night!
                  </SpeakSentence>
                  <span className="text-sm text-red-300 ml-2">Boa noite!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      <style jsx>{`
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }

        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}