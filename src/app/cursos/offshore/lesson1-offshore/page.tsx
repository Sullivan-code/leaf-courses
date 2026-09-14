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

// Helper: speaks English text with an American female voice when available.
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
  const speak = () => {
    speakEnglish(text, 0.9);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />}
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
      className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// ============================================
// SUBSTITUTION EXERCISE COMPONENT WITH EYE TOGGLE
// ============================================
type OptionType = string | { label: string; replacement: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  base?: string;
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
  let currentSentence: string;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.label;
    }
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.replacement;
    }
    return String(opt);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-purple-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium" />
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
                ? 'bg-blue-500 text-white'
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
// MAIN COMPONENT – LESSON 1 OFFSHORE: ENGINE ROOM
// ============================================
export default function LessonOffshoreOQM() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills(prev => ({ ...prev, [section]: !prev[section] }));
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
  // SUBSTITUTION EXERCISES – OFFSHORE ENGINE ROOM
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu trabalho / Você trabalha / Ele trabalha",
      options: [
        { label: "Eu", replacement: "I work." },
        { label: "Você", replacement: "You work." },
        { label: "Ele", replacement: "He works." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu lido com / Você lida com / Ela lida com",
      options: [
        { label: "Eu", replacement: "I deal with." },
        { label: "Você", replacement: "You deal with." },
        { label: "Ela", replacement: "She deals with." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu trabalho na casa de máquinas.",
      options: [
        { label: "casa de máquinas", replacement: "I work in the engine room." },
        { label: "sala de controle", replacement: "I work in the control room." },
        { label: "convés", replacement: "I work on the deck." },
        { label: "oficina", replacement: "I work in the workshop." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ele lida com o motor principal.",
      options: [
        { label: "motor principal", replacement: "He deals with the main engine." },
        { label: "gerador", replacement: "He deals with the generator." },
        { label: "bomba", replacement: "He deals with the pump." },
        { label: "caldeira", replacement: "He deals with the boiler." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Você trabalha no turno da noite?",
      options: [
        { label: "turno da noite", replacement: "Do you work on the night watch?" },
        { label: "turno do dia", replacement: "Do you work on the day watch?" },
        { label: "turno da tarde", replacement: "Do you work on the evening watch?" },
        { label: "turno de 12 horas", replacement: "Do you work on the 12-hour shift?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Nós trabalhamos juntos para verificar o painel de alarmes.",
      options: [
        { label: "painel de alarmes", replacement: "We work together to check the alarm panel." },
        { label: "manômetro", replacement: "We work together to check the pressure gauge." },
        { label: "sensor de temperatura", replacement: "We work together to check the temperature sensor." },
        { label: "medidor de combustível", replacement: "We work together to check the fuel meter." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ela lida com situações de emergência na sala de controle.",
      options: [
        { label: "sala de controle", replacement: "She deals with emergency situations in the control room." },
        { label: "casa de máquinas", replacement: "She deals with emergency situations in the engine room." },
        { label: "passadiço", replacement: "She deals with emergency situations on the bridge." },
        { label: "oficina", replacement: "She deals with emergency situations in the workshop." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eles lidam com vazamentos de combustível e derramamentos de óleo todos os dias.",
      options: [
        { label: "vazamentos de combustível e derramamentos de óleo", replacement: "They deal with fuel leaks and oil spills every day." },
        { label: "alta pressão e baixa temperatura", replacement: "They deal with high pressure and low temperature every day." },
        { label: "alarmes e avisos", replacement: "They deal with alarms and warnings every day." },
        { label: "bombas e válvulas", replacement: "They deal with pumps and valves every day." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Durante meu turno, eu trabalho e lido com qualquer ruído anormal do motor auxiliar.",
      options: [
        { label: "motor auxiliar", replacement: "During my watch, I work and I deal with any abnormal noise from the auxiliary engine." },
        { label: "motor principal", replacement: "During my watch, I work and I deal with any abnormal noise from the main engine." },
        { label: "gerador", replacement: "During my watch, I work and I deal with any abnormal noise from the generator." },
        { label: "sistema de resfriamento", replacement: "During my watch, I work and I deal with any abnormal noise from the cooling system." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Verifique a pressão do óleo.",
      options: [
        { label: "pressão do óleo", replacement: "Check the oil pressure." },
        { label: "pressão da água", replacement: "Check the water pressure." },
        { label: "pressão do combustível", replacement: "Check the fuel pressure." },
        { label: "pressão do ar", replacement: "Check the air pressure." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "A temperatura está alta.",
      options: [
        { label: "temperatura", replacement: "The temperature is high." },
        { label: "pressão", replacement: "The pressure is high." },
        { label: "nível", replacement: "The level is high." },
        { label: "fluxo", replacement: "The flow is high." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu vejo um pequeno vazamento no cano.",
      options: [
        { label: "vazamento", replacement: "I see a small leak in the pipe." },
        { label: "rachadura", replacement: "I see a small crack in the pipe." },
        { label: "bloqueio", replacement: "I see a small blockage in the pipe." },
        { label: "ruído", replacement: "I see a small noise in the pipe." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "O alarme está ativo no gerador.",
      options: [
        { label: "gerador", replacement: "The alarm is active on the generator." },
        { label: "motor principal", replacement: "The alarm is active on the main engine." },
        { label: "caldeira", replacement: "The alarm is active on the boiler." },
        { label: "bomba número 2", replacement: "The alarm is active on the pump number 2." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Feche a válvula imediatamente.",
      options: [
        { label: "válvula", replacement: "Close the valve immediately." },
        { label: "interruptor", replacement: "Close the switch immediately." },
        { label: "disjuntor", replacement: "Close the breaker immediately." },
        { label: "painel", replacement: "Close the panel immediately." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Registre a temperatura e a pressão a cada hora.",
      options: [
        { label: "temperatura e pressão", replacement: "Record the temperature and the pressure every hour." },
        { label: "nível de combustível e nível de óleo", replacement: "Record the fuel level and oil level every hour." },
        { label: "rpm e horas", replacement: "Record the rpm and hours every hour." },
        { label: "alarmes e avisos", replacement: "Record the alarms and warnings every hour." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "O vazamento no cano de combustível está perto da válvula.",
      options: [
        { label: "cano de combustível", replacement: "The leak in the fuel pipe is near the valve." },
        { label: "cano de água", replacement: "The leak in the water pipe is near the valve." },
        { label: "linha de óleo", replacement: "The leak in the oil line is near the valve." },
        { label: "mangueira de resfriamento", replacement: "The leak in the cooling hose is near the valve." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- USEFUL PHRASES ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu trabalho na casa de máquinas todos os dias.",
      options: [
        { label: "casa de máquinas", replacement: "I work in the engine room every day." },
        { label: "sala de controle", replacement: "I work in the control room every day." },
        { label: "oficina", replacement: "I work in the workshop every day." },
        { label: "sala de bombas", replacement: "I work in the pump room every day." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Você pode lidar com o alarme de alta temperatura?",
      options: [
        { label: "alta temperatura", replacement: "Can you deal with the high temperature alarm?" },
        { label: "baixa pressão", replacement: "Can you deal with the low pressure alarm?" },
        { label: "alta vibração", replacement: "Can you deal with the high vibration alarm?" },
        { label: "baixo nível de óleo", replacement: "Can you deal with the low oil level alarm?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Nós precisamos trabalhar juntos para consertar a bomba.",
      options: [
        { label: "bomba", replacement: "We need to work together to fix the pump." },
        { label: "gerador", replacement: "We need to work together to fix the generator." },
        { label: "válvula", replacement: "We need to work together to fix the valve." },
        { label: "compressor", replacement: "We need to work together to fix the compressor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu sempre lido com vazamentos de combustível com cuidado.",
      options: [
        { label: "vazamentos de combustível", replacement: "I always deal with fuel leaks carefully." },
        { label: "alarmes de emergência", replacement: "I always deal with emergency alarms carefully." },
        { label: "derramamentos de óleo", replacement: "I always deal with oil spills carefully." },
        { label: "problemas elétricos", replacement: "I always deal with electrical problems carefully." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Segurança é minha primeira prioridade durante o turno.",
      options: [
        { label: "Segurança", replacement: "Safety is my first priority during the watch." },
        { label: "Comunicação", replacement: "Communication is my first priority during the watch." },
        { label: "Trabalho em equipe", replacement: "Teamwork is my first priority during the watch." },
        { label: "Procedimento", replacement: "Procedure is my first priority during the watch." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Por favor, reporte qualquer ruído anormal ao chefe de máquinas.",
      options: [
        { label: "chefe de máquinas", replacement: "Please report any abnormal noise to the chief engineer." },
        { label: "oficial de quarto", replacement: "Please report any abnormal noise to the watch officer." },
        { label: "supervisor da casa de máquinas", replacement: "Please report any abnormal noise to the engine room supervisor." },
        { label: "capitão", replacement: "Please report any abnormal noise to the captain." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu trabalho da meia-noite às 6 da manhã.",
      options: [
        { label: "da meia-noite às 6 da manhã", replacement: "I work from midnight to 6 AM." },
        { label: "das 6 da manhã ao meio-dia", replacement: "I work from 6 AM to noon." },
        { label: "do meio-dia às 6 da tarde", replacement: "I work from noon to 6 PM." },
        { label: "das 6 da tarde à meia-noite", replacement: "I work from 6 PM to midnight." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eu lido com os alarmes do motor principal.",
      options: [
        { label: "motor principal", replacement: "I deal with the main engine alarms." },
        { label: "gerador", replacement: "I deal with the generator alarms." },
        { label: "caldeira", replacement: "I deal with the boiler warnings." },
        { label: "sistema de segurança", replacement: "I deal with the safety system alerts." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Você trabalha no turno do gerador, certo?",
      options: [
        { label: "turno do gerador", replacement: "You work on the generator watch, right?" },
        { label: "turno da bomba", replacement: "You work on the pump watch, right?" },
        { label: "turno do motor", replacement: "You work on the engine watch, right?" },
        { label: "turno da noite", replacement: "You work on the night watch, right?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Nós lidamos com situações de emergência rapidamente.",
      options: [
        { label: "situações de emergência", replacement: "We deal with emergency situations fast." },
        { label: "problemas diários", replacement: "We deal with daily problems fast." },
        { label: "verificações de rotina", replacement: "We deal with routine checks fast." },
        { label: "tarefas de manutenção", replacement: "We deal with maintenance tasks fast." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ela trabalha na sala de controle.",
      options: [
        { label: "sala de controle", replacement: "She works in the control room." },
        { label: "casa de máquinas", replacement: "She works in the engine room." },
        { label: "oficina", replacement: "She works in the workshop." },
        { label: "escritório", replacement: "She works in the office." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eles trabalham juntos durante os treinos de emergência.",
      options: [
        { label: "treinos de emergência", replacement: "They work together during emergency drills." },
        { label: "o turno da noite", replacement: "They work together during the night shift." },
        { label: "períodos de manutenção", replacement: "They work together during maintenance periods." },
        { label: "trocas de turno", replacement: "They work together during watch changes." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Dia sim, dia não, eu verifico o nível de óleo no motor principal.",
      options: [
        { label: "nível de óleo", replacement: "Every other day, I check the oil level on the main engine." },
        { label: "nível de líquido de arrefecimento", replacement: "Every other day, I check the coolant level on the main engine." },
        { label: "nível de combustível", replacement: "Every other day, I check the fuel level on the main engine." },
        { label: "nível de água", replacement: "Every other day, I check the water level on the main engine." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Você precisa lidar com o problema de vibração antes do próximo turno começar.",
      options: [
        { label: "vibração", replacement: "You need to deal with the vibration problem before the next watch starts." },
        { label: "superaquecimento", replacement: "You need to deal with the overheating problem before the next watch starts." },
        { label: "ruído", replacement: "You need to deal with the noise problem before the next watch starts." },
        { label: "queda de pressão", replacement: "You need to deal with the pressure drop problem before the next watch starts." }
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

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%2014%20de%20set.%20de%202026%2C%2012_57_25.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* TITLE WITH OFFSHORE PLATFORM IMAGE - MAX QUALITY */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 1 - Offshore: Engine Room
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn essential verbs and vocabulary to work as an Officer in Charge of the Engine Room. ⚙️🔧
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
          <p className="text-base text-blue-700 font-bold mt-2">
            🏭 Engine Room = Praça de Máquinas
          </p>
        </div>

        {/* SECTION 1 - VERBS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">Click on the verbs - You need these every day on the ship</p>
            </div>
            <button onClick={() => toggleDrill('verbs')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to work" className="text-blue-600 font-bold">to work</SpeakText> = trabalhar</li>
              <li><SpeakText text="to deal with" className="text-blue-600 font-bold">to deal with</SpeakText> = lidar com</li>
              <li><SpeakText text="to check" className="text-blue-600 font-bold">to check</SpeakText> = verificar, inspecionar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* SECTION 2 - NEW WORDS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Words</h2>
              <p className="mt-2 text-blue-100 italic">Words you will see every day on your watch</p>
            </div>
            <button onClick={() => toggleDrill('vocabulary')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="grid grid-cols-2 gap-2 mb-6">
              <li><SpeakText text="engine" className="text-blue-600 font-bold">engine</SpeakText> = motor</li>
              <li><SpeakText text="engine room" className="text-blue-600 font-bold">engine room</SpeakText> = <span className="font-bold text-blue-700">praça de máquinas</span></li>
              <li><SpeakText text="pump" className="text-blue-600 font-bold">pump</SpeakText> = bomba</li>
              <li><SpeakText text="generator" className="text-blue-600 font-bold">generator</SpeakText> = gerador</li>
              <li><SpeakText text="pressure" className="text-blue-600 font-bold">pressure</SpeakText> = pressão</li>
              <li><SpeakText text="temperature" className="text-blue-600 font-bold">temperature</SpeakText> = temperatura</li>
              <li><SpeakText text="valve" className="text-blue-600 font-bold">valve</SpeakText> = válvula</li>
              <li><SpeakText text="alarm" className="text-blue-600 font-bold">alarm</SpeakText> = alarme</li>
              <li><SpeakText text="leak" className="text-blue-600 font-bold">leak</SpeakText> = vazamento</li>
            </ul>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* SECTION 3 - USEFUL PHRASES */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like A Native</h2>
              <p className="mt-2 text-blue-100 italic">Common phrases during your watch</p>
            </div>
            <button onClick={() => toggleDrill('usefulPhrases')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><SpeakSentence text="I work on the watch from 4pm to 8pm" className="text-blue-600 font-bold">I work on the watch from 4pm to 8pm</SpeakSentence></li>
              <li><SpeakSentence text="I need to deal with this problem now" className="text-blue-600 font-bold">I need to deal with this problem now</SpeakSentence></li>
            </ul>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* SECTION 4 - GRAMMAR */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">Use "I work" and "I deal with" to talk about your duties</p>
            </div>
            <button onClick={() => toggleDrill('grammar')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] space-y-3 mb-6">
              <p>✅ <SpeakSentence text="I work in the engine room" className="text-blue-600 font-bold">I work in the engine room</SpeakSentence> = Eu trabalho na casa de máquinas</p>
              <p>✅ <SpeakSentence text="I deal with alarms" className="text-blue-600 font-bold">I deal with alarms</SpeakSentence> = Eu lido com alarmes</p>
              <p>✅ <SpeakSentence text="Every other day" className="text-blue-600 font-bold">Every other day</SpeakSentence> = Dia sim, dia não</p>
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* SECTION 5 - WRAP UP with AM/PM lesson */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">Remember the main verbs for your job as an OQM</p>
          </div>

          {/* AM/PM LESSON */}
          <div className="bg-yellow-50 border-b-2 border-yellow-200 p-6">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">⏰ AM and PM - Understanding Time on the Vessel</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-4xl font-bold text-blue-600">AM</span>
                  <p className="text-gray-600 mt-2"><span className="font-bold">Ante Meridiem</span> (Latin)</p>
                  <p className="text-gray-500">Before noon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p>🌅 <SpeakText text="12 AM" className="text-blue-600 font-bold">12:00 AM</SpeakText> = Midnight (meia-noite)</p>
                  <p>🌄 <SpeakText text="6 AM" className="text-blue-600 font-bold">6:00 AM</SpeakText> = Morning (manhã)</p>
                  <p>☀️ <SpeakText text="12 PM" className="text-blue-600 font-bold">12:00 PM</SpeakText> = Noon (meio-dia)</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">📌 Use AM from <strong>midnight to noon</strong> (00:00 to 11:59)</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-4xl font-bold text-purple-600">PM</span>
                  <p className="text-gray-600 mt-2"><span className="font-bold">Post Meridiem</span> (Latin)</p>
                  <p className="text-gray-500">After noon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p>🌤️ <SpeakText text="1 PM" className="text-blue-600 font-bold">1:00 PM</SpeakText> = Afternoon (tarde)</p>
                  <p>🌙 <SpeakText text="6 PM" className="text-blue-600 font-bold">6:00 PM</SpeakText> = Evening (noite)</p>
                  <p>🌃 <SpeakText text="11 PM" className="text-blue-600 font-bold">11:00 PM</SpeakText> = Night (noite)</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">📌 Use PM from <strong>noon to midnight</strong> (12:00 to 23:59)</p>
              </div>
            </div>
            <div className="mt-4 bg-blue-100 rounded-lg p-3 text-center">
              <p className="text-gray-700">💡 <span className="font-bold">Offshore Example:</span> "I work from <SpeakText text="8 PM" className="text-blue-600 font-bold">8:00 PM</SpeakText> to <SpeakText text="8 AM" className="text-blue-600 font-bold">8:00 AM</SpeakText>" = I work the night shift (12 hours)</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO WORK</span> (to do a job)</p>
              <p className="text-sm"><SpeakSentence text="I work on the night watch" className="text-blue-100">I work on the night watch</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="You work with the generator" className="text-blue-100">You work with the generator</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="We work for safety" className="text-blue-100">We work for safety</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="They work in the engine room" className="text-blue-100">They work in the engine room</SpeakSentence></p>
            </div>
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-blue-200">
              <div className="w-36 h-36 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚢</span>
              </div>
              <p className="text-black font-bold text-lg mt-2">Offshore Vessel</p>
              <p className="text-xs text-gray-500">Your workplace at sea</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">🕐 <span className="font-bold">Watch Schedule:</span></p>
                <p className="text-xs text-gray-600">00:00-04:00 | 04:00-08:00 | 08:00-12:00</p>
                <p className="text-xs text-gray-600">12:00-16:00 | 16:00-20:00 | 20:00-00:00</p>
              </div>
            </div>
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO DEAL WITH</span> (to handle)</p>
              <p className="text-sm"><SpeakSentence text="I deal with alarms" className="text-blue-100">I deal with alarms</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="He deals with leaks" className="text-blue-100">He deals with leaks</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="She deals with fuel" className="text-blue-100">She deals with fuel</SpeakSentence></p>
              <p className="text-sm"><SpeakSentence text="They deal with emergencies" className="text-blue-100">They deal with emergencies</SpeakSentence></p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">Remember:</span> 12:00 AM = midnight (start of day) | 12:00 PM = noon (middle of day)</p>
            <p className="text-sm text-gray-600 mt-1">📅 Offshore shifts are usually 12 hours: 6 AM - 6 PM or 6 PM - 6 AM</p>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/offshore/lesson2-offshore")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
          >
            Next Lesson
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
      `}</style>
    </div>
  );
}