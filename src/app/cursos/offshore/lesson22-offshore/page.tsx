"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

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

// Note Modal Component
function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  const handleSave = () => {
    onSave(note);
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-blue-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// SUBSTITUTION EXERCISE COMPONENT WITH EYE TOGGLE
// ============================================
type OptionType = string | { label: string; replacement: string; pt?: string };

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

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; pt?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentPt: string | undefined;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentPt = currentOption.pt;
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
    <div className="bg-white p-4 rounded-lg border border-blue-200">
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
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <SpeakSentence text={currentSentence} className="text-blue-700 font-medium">
                {currentSentence}
              </SpeakSentence>
            </div>
            {currentPt && (
              <>
                <div className="border-t border-blue-200 my-1"></div>
                <div className="flex items-start gap-2">
                  <p className="text-sm text-gray-600">{currentPt}</p>
                </div>
              </>
            )}
          </div>
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
// OPEN-ENDED QUESTION COMPONENT
// ============================================
function OpenEndedQuestion({
  question,
  hint,
  sampleAnswer
}: {
  question: string;
  hint: string;
  sampleAnswer: string;
}) {
  const [showSample, setShowSample] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-300">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💭</span>
        <div className="flex-1">
          <p className="text-gray-900 font-semibold text-lg mb-1">{question}</p>
          <p className="text-blue-600 text-sm mb-3 italic">💡 {hint}</p>
          <button
            onClick={() => setShowSample(!showSample)}
            className="text-sm px-4 py-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-full transition-colors"
          >
            {showSample ? '🙈 Esconder resposta modelo' : '👀 Ver resposta modelo'}
          </button>
          {showSample && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm mb-1">🗣️ Sample answer:</p>
              <SpeakSentence text={sampleAnswer} className="text-gray-800 font-medium">
                {sampleAnswer}
              </SpeakSentence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
// ============================================
function HighlightedPhrase({ text, highlightWords, translation }: { text: string; highlightWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (highlightWords.some(hw => cleanWord.toLowerCase() === hw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200">
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
// MAIN COMPONENT – LESSON 22: DP CONCEPTS TEST (PART B)
// ============================================
export default function Lesson22DPConceptsTestPartB() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || '',
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));
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

  // ===== IMAGENS (mesmas da lição 21) =====
  const mainImage = "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%2028%20de%20ago.%20de%202026%2C%2018_54_16.png";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================================
  // DIALOGUES – Part B (A2 / B1 level)
  // ============================================================
  const dialogues = [
    {
      title: "Dialogue 1 – A Position Reference Failure",
      level: "B1",
      lines: [
        { speaker: "DPO", en: "Captain, we have lost one position reference. The DP system is now in degraded mode.", pt: "Capitão, perdemos uma referência de posição. O sistema DP está agora em modo degradado." },
        { speaker: "Captain", en: "Which reference did we lose?", pt: "Qual referência perdemos?" },
        { speaker: "DPO", en: "The DGPS. The other references are still working, but I want to reduce operations.", pt: "O DGPS. As outras referências ainda estão funcionando, mas quero reduzir as operações." },
        { speaker: "Captain", en: "Good decision. Inform the client and the ROV team. We will wait until the DGPS is back.", pt: "Boa decisão. Informe o cliente e a equipe do ROV. Vamos esperar até o DGPS voltar." },
        { speaker: "DPO", en: "Yes, Captain. I am also checking the FMEA for the redundancy status.", pt: "Sim, Capitão. Também estou verificando o FMEA para o status de redundância." },
      ],
    },
    {
      title: "Dialogue 2 – A Power Management System Alarm",
      level: "B1",
      lines: [
        { speaker: "Engineer", en: "Bridge, we have a PMS alarm. One generator is offline.", pt: "Ponte, temos um alarme do PMS. Um gerador está offline." },
        { speaker: "DPO", en: "Copy. What is the current power load?", pt: "Entendido. Qual é a carga de energia atual?" },
        { speaker: "Engineer", en: "The load is 85%. If we lose another generator, we will have a blackout.", pt: "A carga é de 85%. Se perdermos outro gerador, teremos um apagão." },
        { speaker: "DPO", en: "Understood. I will reduce the thruster load immediately.", pt: "Entendido. Vou reduzir a carga dos propulsores imediatamente." },
        { speaker: "Engineer", en: "Good. I am starting the standby generator now.", pt: "Bom. Estou ligando o gerador de reserva agora." },
        { speaker: "DPO", en: "Thank you. I will inform the Captain about the situation.", pt: "Obrigado. Vou informar o Capitão sobre a situação." },
      ],
    },
    {
      title: "Dialogue 3 – A Gyro Compass Failure",
      level: "A2",
      lines: [
        { speaker: "DPO", en: "Captain, the number 2 gyro compass has failed.", pt: "Capitão, a giroscópica número 2 falhou." },
        { speaker: "Captain", en: "Is the vessel still holding position?", pt: "A embarcação ainda está mantendo a posição?" },
        { speaker: "DPO", en: "Yes, but the heading is drifting a little. I am switching to the backup gyro.", pt: "Sim, mas o rumo está derivando um pouco. Estou mudando para a giroscópica de reserva." },
        { speaker: "Captain", en: "Okay. Notify the technical department and log the failure.", pt: "Ok. Notifique o departamento técnico e registre a falha." },
        { speaker: "DPO", en: "Yes, Captain. The backup gyro is working now. Position is stable.", pt: "Sim, Capitão. A giroscópica de reserva está funcionando agora. A posição está estável." },
      ],
    },
    {
      title: "Dialogue 4 – A Consequence Analysis Alarm",
      level: "B1",
      lines: [
        { speaker: "DPO", en: "Captain, the Consequence Analysis alarm is active.", pt: "Capitão, o alarme da Análise de Consequências está ativo." },
        { speaker: "Captain", en: "What does it say?", pt: "O que ele diz?" },
        { speaker: "DPO", en: "It says: 'Worst-case failure – insufficient thrust to hold position.'", pt: "Ele diz: 'Falha no pior caso – empuxo insuficiente para manter a posição.'" },
        { speaker: "Captain", en: "Understood. Switch to manual control and reduce operations immediately.", pt: "Entendido. Mude para controle manual e reduza as operações imediatamente." },
        { speaker: "DPO", en: "Yes, Captain. I am also notifying the ROV team to recover the ROV.", pt: "Sim, Capitão. Também estou notificando a equipe do ROV para recolher o ROV." },
      ],
    },
  ];

  // ============================================================
  // STORIES (paragraph by paragraph) – Part B
  // ============================================================
  const stories = [
    {
      title: "Story 1 – The DGPS Failure",
      level: "B1",
      paragraphs: [
        {
          en: "The vessel 'Sea Explorer' was doing DP operations near a drilling rig. The weather was good, and the sea was calm. Suddenly, the DPO saw a warning on his console: 'DGPS 1 – Signal lost.'",
          pt: "A embarcação 'Sea Explorer' estava fazendo operações DP perto de uma sonda de perfuração. O tempo estava bom e o mar estava calmo. De repente, o DPO viu um aviso no console: 'DGPS 1 – Sinal perdido.'"
        },
        {
          en: "The DPO did not panic. He checked the other position references. They were still working. But he knew that losing one reference was a serious problem in DP operations.",
          pt: "O DPO não entrou em pânico. Ele verificou as outras referências de posição. Elas ainda estavam funcionando. Mas ele sabia que perder uma referência era um problema sério nas operações DP."
        },
        {
          en: "He informed the Captain immediately. The Captain decided to reduce operations and inform the client. The DPO also checked the FMEA to understand the consequences of this failure.",
          pt: "Ele informou o Capitão imediatamente. O Capitão decidiu reduzir as operações e informar o cliente. O DPO também verificou o FMEA para entender as consequências desta falha."
        },
        {
          en: "After thirty minutes, the technical team fixed the DGPS. The signal came back. The DPO confirmed the position was stable and returned to normal DP operations.",
          pt: "Depois de trinta minutos, a equipe técnica consertou o DGPS. O sinal voltou. O DPO confirmou que a posição estava estável e voltou às operações DP normais."
        },
        {
          en: "The Captain called a meeting after the operation. He said: 'Today, we saw the importance of redundancy and good procedures. Always check your references, always check the FMEA, and always inform the Captain.'",
          pt: "O Capitão convocou uma reunião após a operação. Ele disse: 'Hoje, vimos a importância da redundância e dos bons procedimentos. Sempre verifiquem suas referências, sempre verifiquem o FMEA e sempre informem o Capitão.'"
        },
      ],
    },
    {
      title: "Story 2 – A Consequence Analysis Warning",
      level: "B1",
      paragraphs: [
        {
          en: "The DPO was on the bridge, monitoring the DP console. Everything was normal. Then, a yellow warning appeared on the screen: 'Consequence Analysis – Worst-case failure detected.'",
          pt: "O DPO estava na ponte, monitorando o console DP. Tudo estava normal. Então, um aviso amarelo apareceu na tela: 'Análise de Consequências – Falha no pior caso detectada.'"
        },
        {
          en: "The warning meant that if a specific component failed, the vessel would not have enough thrust to hold position. This is a critical situation in DP operations.",
          pt: "O aviso significava que se um componente específico falhasse, a embarcação não teria empuxo suficiente para manter a posição. Esta é uma situação crítica nas operações DP."
        },
        {
          en: "The DPO immediately informed the Captain. The Captain ordered him to switch to manual control and reduce operations. The ROV team was told to recover the ROV.",
          pt: "O DPO informou o Capitão imediatamente. O Capitão ordenou que ele mudasse para controle manual e reduzisse as operações. A equipe do ROV foi instruída a recolher o ROV."
        },
        {
          en: "The technical team investigated the problem. It was a sensor failure on one of the thrusters. They replaced the sensor, and the system returned to normal.",
          pt: "A equipe técnica investigou o problema. Era uma falha de sensor em um dos propulsores. Eles substituíram o sensor e o sistema voltou ao normal."
        },
        {
          en: "The DPO logged the incident and reviewed the Consequence Analysis with the crew. 'This warning saved us from a possible drive-off,' he said. 'Always pay attention to the alarms.'",
          pt: "O DPO registrou o incidente e revisou a Análise de Consequências com a tripulação. 'Este aviso nos salvou de uma possível deriva', ele disse. 'Sempre prestem atenção aos alarmes.'"
        },
      ],
    },
    {
      title: "Story 3 – A Blackout in Bad Weather",
      level: "B1",
      paragraphs: [
        {
          en: "It was a dark and stormy night. The vessel 'Ocean Guardian' was doing DP operations in rough seas. Suddenly, the lights went out. It was a blackout.",
          pt: "Era uma noite escura e tempestuosa. A embarcação 'Ocean Guardian' estava fazendo operações DP em mar agitado. De repente, as luzes se apagaram. Foi um apagão."
        },
        {
          en: "The DPO shouted: 'Blackout! Start the emergency generator!' The Chief Engineer was already in the engine room. He started the generator in less than thirty seconds.",
          pt: "O DPO gritou: 'Apagão! Liguem o gerador de emergência!' O Chefe de Máquinas já estava na sala de máquinas. Ele ligou o gerador em menos de trinta segundos."
        },
        {
          en: "The emergency generator gave power to the bridge and the DP console. The DPO could see the position again. The vessel was drifting, but slowly. He used manual override to control the thrusters.",
          pt: "O gerador de emergência deu energia para a ponte e o console DP. O DPO pôde ver a posição novamente. A embarcação estava derivando, mas lentamente. Ele usou a substituição manual para controlar os propulsores."
        },
        {
          en: "After five minutes, the main generators came back online. The vessel returned to normal DP mode. The Captain congratulated the crew for their quick response.",
          pt: "Depois de cinco minutos, os geradores principais voltaram a funcionar. A embarcação retornou ao modo DP normal. O Capitão parabenizou a tripulação pela resposta rápida."
        },
        {
          en: "The next day, the Captain said: 'A blackout in bad weather is one of the worst situations in DP. But with good training and clear procedures, we can handle it.'",
          pt: "No dia seguinte, o Capitão disse: 'Um apagão em mau tempo é uma das piores situações em DP. Mas com bom treinamento e procedimentos claros, podemos lidar com isso.'"
        },
      ],
    },
  ];

  // ============================================================
  // SUBSTITUTION EXERCISES – DP Concepts (Part B)
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu monitoro. / ela / nós",
      options: [
        { label: "Eu", replacement: "I monitor.", pt: "Eu monitoro." },
        { label: "Ela", replacement: "She monitors.", pt: "Ela monitora." },
        { label: "Nós", replacement: "We monitor.", pt: "Nós monitoramos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você controla. / eles / nós",
      options: [
        { label: "Você", replacement: "You control.", pt: "Você controla." },
        { label: "Eles", replacement: "They control.", pt: "Eles controlam." },
        { label: "Nós", replacement: "We control.", pt: "Nós controlamos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele informa. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He informs.", pt: "Ele informa." },
        { label: "Ela", replacement: "She informs.", pt: "Ela informa." },
        { label: "Vocês", replacement: "You inform.", pt: "Vocês informam." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero reduzir. / nós / eles",
      options: [
        { label: "Eu", replacement: "I want to reduce.", pt: "Eu quero reduzir." },
        { label: "Nós", replacement: "We want to reduce.", pt: "Nós queremos reduzir." },
        { label: "Eles", replacement: "They want to reduce.", pt: "Eles querem reduzir." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela registra o incidente. / ele / eu",
      options: [
        { label: "Ela", replacement: "She logs the incident.", pt: "Ela registra o incidente." },
        { label: "Ele", replacement: "He logs the incident.", pt: "Ele registra o incidente." },
        { label: "Eu", replacement: "I log the incident.", pt: "Eu registro o incidente." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Nós verificamos o FMEA. / eles / eu",
      options: [
        { label: "Nós", replacement: "We check the FMEA.", pt: "Nós verificamos o FMEA." },
        { label: "Eles", replacement: "They check the FMEA.", pt: "Eles verificam o FMEA." },
        { label: "Eu", replacement: "I check the FMEA.", pt: "Eu verifico o FMEA." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ele liga o gerador. / ela / nós",
      options: [
        { label: "Ele", replacement: "He starts the generator.", pt: "Ele liga o gerador." },
        { label: "Ela", replacement: "She starts the generator.", pt: "Ela liga o gerador." },
        { label: "Nós", replacement: "We start the generator.", pt: "Nós ligamos o gerador." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu mudo para manual. / nós / eles",
      options: [
        { label: "Eu", replacement: "I switch to manual.", pt: "Eu mudo para manual." },
        { label: "Nós", replacement: "We switch to manual.", pt: "Nós mudamos para manual." },
        { label: "Eles", replacement: "They switch to manual.", pt: "Eles mudam para manual." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "O DGPS falhou. / giroscópica / sensor",
      options: [
        { label: "DGPS", replacement: "The DGPS failed.", pt: "O DGPS falhou." },
        { label: "giroscópica", replacement: "The gyro compass failed.", pt: "A giroscópica falhou." },
        { label: "sensor", replacement: "The sensor failed.", pt: "O sensor falhou." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "O sistema está em modo degradado. / modo manual / modo normal",
      options: [
        { label: "modo degradado", replacement: "The system is in degraded mode.", pt: "O sistema está em modo degradado." },
        { label: "modo manual", replacement: "The system is in manual mode.", pt: "O sistema está em modo manual." },
        { label: "modo normal", replacement: "The system is in normal mode.", pt: "O sistema está em modo normal." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Precisamos de redundância no sistema. / manutenção / treinamento",
      options: [
        { label: "redundância", replacement: "We need redundancy in the system.", pt: "Precisamos de redundância no sistema." },
        { label: "manutenção", replacement: "We need maintenance in the system.", pt: "Precisamos de manutenção no sistema." },
        { label: "treinamento", replacement: "We need training in the system.", pt: "Precisamos de treinamento no sistema." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "A carga de energia está alta. / baixa / normal",
      options: [
        { label: "alta", replacement: "The power load is high.", pt: "A carga de energia está alta." },
        { label: "baixa", replacement: "The power load is low.", pt: "A carga de energia está baixa." },
        { label: "normal", replacement: "The power load is normal.", pt: "A carga de energia está normal." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "O alarme da Análise de Consequências está ativo. / PMS / FMEA",
      options: [
        { label: "Análise de Consequências", replacement: "The Consequence Analysis alarm is active.", pt: "O alarme da Análise de Consequências está ativo." },
        { label: "PMS", replacement: "The PMS alarm is active.", pt: "O alarme do PMS está ativo." },
        { label: "FMEA", replacement: "The FMEA alarm is active.", pt: "O alarme do FMEA está ativo." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "O gerador de reserva está ligado. / desligado / quebrado",
      options: [
        { label: "ligado", replacement: "The standby generator is on.", pt: "O gerador de reserva está ligado." },
        { label: "desligado", replacement: "The standby generator is off.", pt: "O gerador de reserva está desligado." },
        { label: "quebrado", replacement: "The standby generator is broken.", pt: "O gerador de reserva está quebrado." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "A posição está estável. / instável / derivando",
      options: [
        { label: "estável", replacement: "The position is stable.", pt: "A posição está estável." },
        { label: "instável", replacement: "The position is unstable.", pt: "A posição está instável." },
        { label: "derivando", replacement: "The position is drifting.", pt: "A posição está derivando." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "O ROV está pronto. / recolhido / em espera",
      options: [
        { label: "pronto", replacement: "The ROV is ready.", pt: "O ROV está pronto." },
        { label: "recolhido", replacement: "The ROV is recovered.", pt: "O ROV está recolhido." },
        { label: "em espera", replacement: "The ROV is on standby.", pt: "O ROV está em espera." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "O cliente está informado. / esperando / preocupado",
      options: [
        { label: "informado", replacement: "The client is informed.", pt: "O cliente está informado." },
        { label: "esperando", replacement: "The client is waiting.", pt: "O cliente está esperando." },
        { label: "preocupado", replacement: "The client is worried.", pt: "O cliente está preocupado." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Vamos revisar os procedimentos de emergência. / manuais / de segurança",
      options: [
        { label: "de emergência", replacement: "Let's review the emergency procedures.", pt: "Vamos revisar os procedimentos de emergência." },
        { label: "manuais", replacement: "Let's review the manuals.", pt: "Vamos revisar os manuais." },
        { label: "de segurança", replacement: "Let's review the safety procedures.", pt: "Vamos revisar os procedimentos de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "O modo degradado é perigoso. / seguro / normal",
      options: [
        { label: "perigoso", replacement: "Degraded mode is dangerous.", pt: "O modo degradado é perigoso." },
        { label: "seguro", replacement: "Degraded mode is safe.", pt: "O modo degradado é seguro." },
        { label: "normal", replacement: "Degraded mode is normal.", pt: "O modo degradado é normal." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "A equipe técnica está trabalhando. / descansando / esperando",
      options: [
        { label: "trabalhando", replacement: "The technical team is working.", pt: "A equipe técnica está trabalhando." },
        { label: "descansando", replacement: "The technical team is resting.", pt: "A equipe técnica está descansando." },
        { label: "esperando", replacement: "The technical team is waiting.", pt: "A equipe técnica está esperando." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Atenção! Perdemos uma referência de posição. / giroscópica / sensor",
      options: [
        { label: "referência de posição", replacement: "Attention! We lost a position reference.", pt: "Atenção! Perdemos uma referência de posição." },
        { label: "giroscópica", replacement: "Attention! We lost a gyro compass.", pt: "Atenção! Perdemos uma giroscópica." },
        { label: "sensor", replacement: "Attention! We lost a sensor.", pt: "Atenção! Perdemos um sensor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "O sistema está em modo degradado. / manual / normal",
      options: [
        { label: "degradado", replacement: "The system is in degraded mode.", pt: "O sistema está em modo degradado." },
        { label: "manual", replacement: "The system is in manual mode.", pt: "O sistema está em modo manual." },
        { label: "normal", replacement: "The system is in normal mode.", pt: "O sistema está em modo normal." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "A Análise de Consequências detectou uma falha. / PMS / FMEA",
      options: [
        { label: "Análise de Consequências", replacement: "The Consequence Analysis detected a failure.", pt: "A Análise de Consequências detectou uma falha." },
        { label: "PMS", replacement: "The PMS detected a failure.", pt: "O PMS detectou uma falha." },
        { label: "FMEA", replacement: "The FMEA detected a failure.", pt: "O FMEA detectou uma falha." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você tem treinamento em DP? / experiência / certificado",
      options: [
        { label: "treinamento", replacement: "Do you have DP training?", pt: "Você tem treinamento em DP?" },
        { label: "experiência", replacement: "Do you have DP experience?", pt: "Você tem experiência em DP?" },
        { label: "certificado", replacement: "Do you have a DP certificate?", pt: "Você tem certificado em DP?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Nunca ignore um alarme de DP. / PMS / Consequence Analysis",
      options: [
        { label: "alarme de DP", replacement: "Never ignore a DP alarm.", pt: "Nunca ignore um alarme de DP." },
        { label: "PMS", replacement: "Never ignore a PMS alarm.", pt: "Nunca ignore um alarme do PMS." },
        { label: "Consequence Analysis", replacement: "Never ignore a Consequence Analysis alarm.", pt: "Nunca ignore um alarme da Análise de Consequências." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Reduza as operações antes de perder a posição. / o empuxo / a energia",
      options: [
        { label: "perder a posição", replacement: "Reduce operations before losing position.", pt: "Reduza as operações antes de perder a posição." },
        { label: "o empuxo", replacement: "Reduce operations before losing thrust.", pt: "Reduza as operações antes de perder o empuxo." },
        { label: "a energia", replacement: "Reduce operations before losing power.", pt: "Reduza as operações antes de perder a energia." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Verifique o FMEA para entender as consequências. / o manual / o console",
      options: [
        { label: "o FMEA", replacement: "Check the FMEA to understand the consequences.", pt: "Verifique o FMEA para entender as consequências." },
        { label: "o manual", replacement: "Check the manual to understand the consequences.", pt: "Verifique o manual para entender as consequências." },
        { label: "o console", replacement: "Check the console to understand the consequences.", pt: "Verifique o console para entender as consequências." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Informe o capitão imediatamente. / o cliente / a equipe",
      options: [
        { label: "o capitão", replacement: "Inform the captain immediately.", pt: "Informe o capitão imediatamente." },
        { label: "o cliente", replacement: "Inform the client immediately.", pt: "Informe o cliente imediatamente." },
        { label: "a equipe", replacement: "Inform the team immediately.", pt: "Informe a equipe imediatamente." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Tem um alarme no console? / aviso / erro",
      options: [
        { label: "alarme", replacement: "Is there an alarm on the console?", pt: "Tem um alarme no console?" },
        { label: "aviso", replacement: "Is there a warning on the console?", pt: "Tem um aviso no console?" },
        { label: "erro", replacement: "Is there an error on the console?", pt: "Tem um erro no console?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Tem muitos sensores no sistema DP. / botões / cabos",
      options: [
        { label: "sensores", replacement: "There are many sensors in the DP system.", pt: "Tem muitos sensores no sistema DP." },
        { label: "botões", replacement: "There are many buttons in the DP system.", pt: "Tem muitos botões no sistema DP." },
        { label: "cabos", replacement: "There are many cables in the DP system.", pt: "Tem muitos cabos no sistema DP." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Não tem um DPO disponível agora. / engenheiro / técnico",
      options: [
        { label: "DPO", replacement: "There isn't a DPO available now.", pt: "Não tem um DPO disponível agora." },
        { label: "engenheiro", replacement: "There isn't an engineer available now.", pt: "Não tem um engenheiro disponível agora." },
        { label: "técnico", replacement: "There isn't a technician available now.", pt: "Não tem um técnico disponível agora." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Não tem procedimentos de DP nesta área. / regras / sinais",
      options: [
        { label: "procedimentos", replacement: "There aren't DP procedures in this area.", pt: "Não tem procedimentos de DP nesta área." },
        { label: "regras", replacement: "There aren't DP rules in this area.", pt: "Não tem regras de DP nesta área." },
        { label: "sinais", replacement: "There aren't DP signs in this area.", pt: "Não tem sinais de DP nesta área." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Tem um programa de treinamento em DP na sua empresa? / manutenção / segurança",
      options: [
        { label: "treinamento em DP", replacement: "Is there a DP training program in your company?", pt: "Tem um programa de treinamento em DP na sua empresa?" },
        { label: "manutenção", replacement: "Is there a maintenance program in your company?", pt: "Tem um programa de manutenção na sua empresa?" },
        { label: "segurança", replacement: "Is there a safety program in your company?", pt: "Tem um programa de segurança na sua empresa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Quantas referências de posição tem neste sistema? / giroscópicas / sensores",
      options: [
        { label: "referências de posição", replacement: "How many position references are there in this system?", pt: "Quantas referências de posição tem neste sistema?" },
        { label: "giroscópicas", replacement: "How many gyro compasses are there in this system?", pt: "Quantas giroscópicas tem neste sistema?" },
        { label: "sensores", replacement: "How many sensors are there in this system?", pt: "Quantos sensores tem neste sistema?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Tem um gerador de emergência na sala de máquinas? / standby / principal",
      options: [
        { label: "de emergência", replacement: "Is there an emergency generator in the engine room?", pt: "Tem um gerador de emergência na sala de máquinas?" },
        { label: "standby", replacement: "Is there a standby generator in the engine room?", pt: "Tem um gerador de reserva na sala de máquinas?" },
        { label: "principal", replacement: "Is there a main generator in the engine room?", pt: "Tem um gerador principal na sala de máquinas?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Não tem saída de emergência na ponte. / porta / escada",
      options: [
        { label: "saída de emergência", replacement: "There isn't an emergency exit on the bridge.", pt: "Não tem saída de emergência na ponte." },
        { label: "porta", replacement: "There isn't an emergency door on the bridge.", pt: "Não tem porta de emergência na ponte." },
        { label: "escada", replacement: "There isn't an emergency staircase on the bridge.", pt: "Não tem escada de emergência na ponte." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Tem muitos alarmes ativos no console? / avisos / erros",
      options: [
        { label: "alarmes", replacement: "Are there many active alarms on the console?", pt: "Tem muitos alarmes ativos no console?" },
        { label: "avisos", replacement: "Are there many active warnings on the console?", pt: "Tem muitos avisos ativos no console?" },
        { label: "erros", replacement: "Are there many active errors on the console?", pt: "Tem muitos erros ativos no console?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Não tem redundância suficiente para esta operação. / empuxo / energia",
      options: [
        { label: "redundância", replacement: "There isn't enough redundancy for this operation.", pt: "Não tem redundância suficiente para esta operação." },
        { label: "empuxo", replacement: "There isn't enough thrust for this operation.", pt: "Não tem empuxo suficiente para esta operação." },
        { label: "energia", replacement: "There isn't enough power for this operation.", pt: "Não tem energia suficiente para esta operação." }
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
        backgroundImage: `url("https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🧠 Lesson 22 – DP Concepts Test (Part B)</h1>
          <SpeakSentence text="Continue testing your knowledge of Dynamic Positioning with new dialogues, stories, and exercises." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Continue testing your knowledge of Dynamic Positioning with new dialogues, stories, and exercises.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="DP Concepts Test Part B"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – DIALOGUES ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 DIALOGUES – Part B</h2>
              <PencilIcon onClick={() => openNoteModal('Dialogues')} />
            </div>
          </div>
          <div className="p-8 space-y-8">
            <SpeakSentence text="Read and listen to new conversations about DP emergencies." className="text-md text-gray-600 mb-2 italic">
              🎧 Read and listen to new conversations about DP emergencies.
            </SpeakSentence>
            {dialogues.map((d, idx) => (
              <div key={idx} className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-blue-700">{d.title}</h3>
                  <span className="text-xs bg-blue-600/60 text-white px-2 py-0.5 rounded-full">{d.level}</span>
                </div>
                <div className="space-y-3">
                  {d.lines.map((line, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-bold text-blue-600 min-w-[110px] text-sm">{line.speaker}:</span>
                      <div className="flex-1">
                        <SpeakSentence text={line.en} className="text-gray-800 font-medium">
                          {line.en}
                        </SpeakSentence>
                        <p className="text-xs text-gray-500 mt-0.5">🇧🇷 {line.pt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== SECTION 2 – STORIES ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 STORIES – Part B</h2>
              <PencilIcon onClick={() => openNoteModal('Stories')} />
            </div>
          </div>
          <div className="p-8 space-y-10">
            <SpeakSentence text="Click on each paragraph to listen. Practice your reading and comprehension." className="text-md text-gray-600 mb-2 italic">
              📖 Click on each paragraph to listen. Practice your reading and comprehension.
            </SpeakSentence>
            {stories.map((s, idx) => (
              <div key={idx} className="bg-blue-50 p-5 rounded-2xl border border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-blue-700">{s.title}</h3>
                  <span className="text-xs bg-blue-600/60 text-white px-2 py-0.5 rounded-full">{s.level}</span>
                </div>
                <div className="space-y-4">
                  {s.paragraphs.map((p, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-blue-200">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-400 font-bold text-sm min-w-[25px]">{i + 1}.</span>
                        <div className="flex-1">
                          <SpeakSentence text={p.en} className="text-gray-800 leading-relaxed">
                            {p.en}
                          </SpeakSentence>
                          <p className="text-sm text-gray-500 mt-2 border-t border-blue-200 pt-2">🇧🇷 {p.pt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== SECTION 3 – SUBSTITUTION: VERBS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS – Practice (Part B)</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Substitute the words and practice the verbs from Lesson 21." className="text-md text-gray-600 mb-4 italic">
              🎧 Substitute the words and practice the verbs from Lesson 21.
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to monitor" className="text-blue-600 font-bold">to monitor</SpeakText> = monitorar</li>
              <li><SpeakText text="to control" className="text-blue-600 font-bold">to control</SpeakText> = controlar</li>
              <li><SpeakText text="to inform" className="text-blue-600 font-bold">to inform</SpeakText> = informar</li>
              <li><SpeakText text="to reduce" className="text-blue-600 font-bold">to reduce</SpeakText> = reduzir</li>
              <li><SpeakText text="to log" className="text-blue-600 font-bold">to log</SpeakText> = registrar</li>
              <li><SpeakText text="to check" className="text-blue-600 font-bold">to check</SpeakText> = verificar</li>
              <li><SpeakText text="to start" className="text-blue-600 font-bold">to start</SpeakText> = ligar</li>
              <li><SpeakText text="to switch" className="text-blue-600 font-bold">to switch</SpeakText> = mudar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 4 – SUBSTITUTION: NEW WORDS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS – Practice (Part B)</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice new vocabulary about DP systems, alarms, and emergencies." className="text-md text-gray-600 mb-4 italic">
              🎧 Practice new vocabulary about DP systems, alarms, and emergencies.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "degraded mode", pt: "modo degradado" },
                { en: "position reference", pt: "referência de posição" },
                { en: "DGPS", pt: "DGPS" },
                { en: "gyro compass", pt: "giroscópica" },
                { en: "standby generator", pt: "gerador de reserva" },
                { en: "power load", pt: "carga de energia" },
                { en: "Consequence Analysis", pt: "Análise de Consequências" },
                { en: "worst-case failure", pt: "falha no pior caso" },
                { en: "thrust", pt: "empuxo" },
                { en: "ROV", pt: "ROV" },
                { en: "client", pt: "cliente" },
                { en: "technical team", pt: "equipe técnica" },
                { en: "alarm", pt: "alarme" },
                { en: "warning", pt: "aviso" },
                { en: "error", pt: "erro" },
                { en: "procedure", pt: "procedimento" },
                { en: "training", pt: "treinamento" },
                { en: "experience", pt: "experiência" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 5 – SUBSTITUTION: SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 SPEAK LIKE A NATIVE – Practice (Part B)</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases used in real DP situations." className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases used in real DP situations.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { en: "Attention! We lost a position reference.", pt: "Atenção! Perdemos uma referência de posição.", hw: ["Attention", "position", "reference"] },
                { en: "The system is in degraded mode.", pt: "O sistema está em modo degradado.", hw: ["system", "degraded", "mode"] },
                { en: "The Consequence Analysis detected a failure.", pt: "A Análise de Consequências detectou uma falha.", hw: ["Consequence", "Analysis", "failure"] },
                { en: "Never ignore a DP alarm.", pt: "Nunca ignore um alarme de DP.", hw: ["Never", "ignore", "alarm"] },
                { en: "Reduce operations before losing position.", pt: "Reduza as operações antes de perder a posição.", hw: ["Reduce", "operations", "position"] },
                { en: "Check the FMEA to understand the consequences.", pt: "Verifique o FMEA para entender as consequências.", hw: ["Check", "FMEA", "consequences"] },
                { en: "Inform the captain immediately.", pt: "Informe o capitão imediatamente.", hw: ["Inform", "captain", "immediately"] },
                { en: "The ROV is on standby.", pt: "O ROV está em espera.", hw: ["ROV", "standby"] },
              ].map((item, idx) => (
                <HighlightedPhrase
                  key={idx}
                  text={item.en}
                  highlightWords={item.hw}
                  translation={item.pt}
                />
              ))}
            </div>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 6 – SUBSTITUTION: GRAMMAR ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR – Practice (Part B)</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice the structure 'There is / There are' with DP vocabulary." className="text-md text-gray-600 mb-4 italic">
              📚 Practice the structure 'There is / There are' with DP vocabulary.
            </SpeakSentence>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 7 – OPEN-ENDED QUESTIONS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 OPEN-ENDED QUESTIONS – Part B</h2>
              <PencilIcon onClick={() => openNoteModal('Open Questions')} />
            </div>
          </div>
          <div className="p-8 space-y-5">
            <SpeakSentence text="Answer in your own words. Practice speaking and writing." className="text-md text-gray-600 mb-2 italic">
              💭 Answer in your own words. Practice speaking and writing.
            </SpeakSentence>
            <OpenEndedQuestion
              question="What is a position reference and why is it important in DP operations?"
              hint="Use 'DGPS', 'gyro compass', and 'position'."
              sampleAnswer="A position reference is a system that tells the DP system where the vessel is. Examples are DGPS and gyro compass. It is important because the DP system needs accurate position data to hold the vessel in place. If we lose a reference, the system may go into degraded mode."
            />
            <OpenEndedQuestion
              question="What is degraded mode in a DP system?"
              hint="Use 'lost reference', 'redundancy', and 'reduce operations'."
              sampleAnswer="Degraded mode is when the DP system has lost one or more references or components but can still operate. The system is not fully redundant. In degraded mode, the DPO should reduce operations and inform the Captain. It is a warning that the system is weaker than normal."
            />
            <OpenEndedQuestion
              question="What is a Consequence Analysis alarm and what should you do?"
              hint="Use 'worst-case failure', 'thrust', and 'manual control'."
              sampleAnswer="A Consequence Analysis alarm shows that if a specific component fails, the vessel will not have enough thrust to hold position. It is a worst-case failure scenario. If this alarm activates, the DPO should switch to manual control, reduce operations, and inform the Captain immediately."
            />
            <OpenEndedQuestion
              question="How can redundancy prevent DP accidents?"
              hint="Use 'backup', 'generator', 'gyro', and 'position'."
              sampleAnswer="Redundancy means having backup systems that can replace a failed component. For example, if one gyro compass fails, the vessel has a second gyro to use. If one generator stops, there is a standby generator. Redundancy helps the DP system maintain position even after a failure, preventing accidents like drive-offs."
            />
            <OpenEndedQuestion
              question="What should the DPO do after a failure is resolved?"
              hint="Use 'log the incident', 'system check', and 'review'."
              sampleAnswer="After a failure is resolved, the DPO should log the incident in the DP logbook. He should also perform a full system check to make sure everything is working. Finally, the crew should review the FMEA and the procedures to prevent similar problems in the future."
            />
            <OpenEndedQuestion
              question="Why is communication important during a DP emergency?"
              hint="Use 'inform', 'captain', 'engineer', and 'team'."
              sampleAnswer="Communication is essential during a DP emergency. The DPO must inform the Captain about the problem. The Captain informs the client and the ROV team. The Chief Engineer reports the status from the engine room. Good communication helps everyone understand the situation and act quickly."
            />
            <OpenEndedQuestion
              question="What is the difference between an alarm, a warning, and an error?"
              hint="Use 'critical', 'potential problem', and 'system fault'."
              sampleAnswer="An alarm is a critical alert that requires immediate action. A warning is a notification about a potential problem that may need attention. An error is a system fault that prevents normal operation. In DP operations, all three must be taken seriously and logged."
            />
            <OpenEndedQuestion
              question="How would you explain DP operations to a new crew member?"
              hint="Use 'hold position', 'thrusters', 'references', and 'DPO'."
              sampleAnswer="DP means Dynamic Positioning. It is a system that uses thrusters and position references to hold the vessel in one place without anchors. The DPO controls the system from the bridge. DP is used near platforms and in deep water where anchors are not possible. It requires good training, redundancy, and clear procedures."
            />
          </div>
        </div>

        {/* ===================== SECTION 8 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP! – Part B</h2>
              <SpeakSentence text="Key concepts and vocabulary from this lesson to remember." className="mt-2 text-blue-100 italic">
                📝 Key concepts and vocabulary from this lesson to remember.
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY CONCEPTS – PART B</h3>
              {[
                { en: "Degraded mode", pt: "Modo degradado – sistema com falha parcial." },
                { en: "Position reference", pt: "Referência de posição – DGPS, giroscópica." },
                { en: "Standby generator", pt: "Gerador de reserva – backup de energia." },
                { en: "Consequence Analysis", pt: "Análise de Consequências – verifica empuxo." },
                { en: "Worst-case failure", pt: "Falha no pior caso – cenário crítico." },
                { en: "ROV", pt: "ROV – veículo operado remotamente." },
                { en: "Client", pt: "Cliente – empresa contratante da operação." },
                { en: "Technical team", pt: "Equipe técnica – responsável por reparos." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-blue-200">
                    <li>Use <strong className="text-white">"degraded mode"</strong> to describe a system that has lost redundancy but is still working.</li>
                    <li>Use <strong className="text-white">"worst-case failure"</strong> to talk about the most serious possible failure scenario.</li>
                    <li><strong className="text-white">"Reduce operations"</strong> means to make the DP job less demanding to stay safe.</li>
                    <li><strong className="text-white">"Standby"</strong> means ready to start immediately if needed.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-blue-200">In DP operations, communication and redundancy are the keys to safety. Always inform the Captain, always check the FMEA, and always log the incident.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson21")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (21)
          </button>
          <button onClick={() => router.push("/cursos/lesson23")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (23) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="DP Concepts Test Part B – enlarged"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}