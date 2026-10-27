"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'professionals' | 'bridgeVocab' | 'commands' | 'vhfRadio' | 'dpVocab' | 'dpoCareer';

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
  const speak = () => speakEnglish(text, 0.9);
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
  const handleSave = () => { onSave(note); onClose(); };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6">
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
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-full hover:from-teal-600 hover:to-teal-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-300 hover:text-blue-200 transition-colors focus:outline-none"
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

  const toggleVisibility = () => setShowEnglish(prev => !prev);

  const getOptionLabel = (opt: OptionType): string => isObjectOption(opt) ? opt.label : String(opt);
  const getOptionReplacement = (opt: OptionType): string => isObjectOption(opt) ? opt.replacement : String(opt);

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
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium" />
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-blue-200 pt-1">🇧🇷 {currentPt}</p>
          )}
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
                ? 'bg-blue-600 text-white'
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
// HIGHLIGHTED PHRASE COMPONENT
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    if (greenWords.some(gw => cleanWord === gw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
      <div className="mb-1">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800 leading-snug">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600 ml-1">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – MARITIME ENGLISH: BRIDGE & DP
// ============================================
export default function MaritimeEnglishBridgeDP() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    professionals: false,
    bridgeVocab: false,
    commands: false,
    vhfRadio: false,
    dpVocab: false,
    dpoCareer: false,
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
    setNoteModal({ isOpen: true, sectionTitle, noteContent: savedNotes[sectionTitle] || '' });
  };

  const saveNote = (note: string) => {
    setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  const handleOptionClick = (key: string, index: number) => {
    setSubstitutionState(prev => ({ ...prev, [key]: index }));
  };

  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  useEffect(() => {
    if (typeof window !== 'undefined') window.speechSynthesis.getVoices();
  }, []);

  // IMAGES
  const mainImage = "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const bridgeImage = "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const radioImage = "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const dpImage = "https://images.pexels.com/photos/162568/oil-pump-jack-sunset-clouds-silhouette-162568.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const careerImage = "https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ---------- PROFESSIONALS ----------
  const professionalsSubstitution: SubstitutionExercise[] = [
    {
      key: "prof-1",
      original: "O comandante / está no passadiço / no convés",
      options: [
        { label: "passadiço", replacement: "The Master is on the bridge.", pt: "O comandante está no passadiço." },
        { label: "convés", replacement: "The Master is on deck.", pt: "O comandante está no convés." },
      ],
      currentIndex: 0,
    },
    {
      key: "prof-2",
      original: "O imediato está verificando o plano de viagem. / checando o radar / conferindo a posição",
      options: [
        { label: "plano", replacement: "The Chief Officer is checking the passage plan.", pt: "O imediato está verificando o plano de viagem." },
        { label: "radar", replacement: "The Chief Officer is checking the radar.", pt: "O imediato está verificando o radar." },
        { label: "posição", replacement: "The Chief Officer is checking the position.", pt: "O imediato está conferindo a posição." },
      ],
      currentIndex: 0,
    },
    {
      key: "prof-3",
      original: "O DPO está monitorando o sistema DP. / as referências / os alarmes",
      options: [
        { label: "sistema", replacement: "The DPO is monitoring the DP system.", pt: "O DPO está monitorando o sistema DP." },
        { label: "referências", replacement: "The DPO is monitoring the position references.", pt: "O DPO está monitorando as referências de posição." },
        { label: "alarmes", replacement: "The DPO is monitoring the alarms.", pt: "O DPO está monitorando os alarmes." },
      ],
      currentIndex: 0,
    },
    {
      key: "prof-4",
      original: "O vigia avistou uma embarcação por bombordo. / por boreste / à proa",
      options: [
        { label: "bombordo", replacement: "The lookout has sighted a vessel on the port side.", pt: "O vigia avistou uma embarcação por bombordo." },
        { label: "boreste", replacement: "The lookout has sighted a vessel on the starboard side.", pt: "O vigia avistou uma embarcação por boreste." },
        { label: "proa", replacement: "The lookout has sighted a vessel ahead.", pt: "O vigia avistou uma embarcação à proa." },
      ],
      currentIndex: 0,
    },
    {
      key: "prof-5",
      original: "O chefe de máquinas está verificando o sistema de propulsão. / geradores / quadros elétricos",
      options: [
        { label: "propulsão", replacement: "The Chief Engineer is checking the propulsion system.", pt: "O chefe de máquinas está verificando o sistema de propulsão." },
        { label: "geradores", replacement: "The Chief Engineer is checking the generators.", pt: "O chefe de máquinas está verificando os geradores." },
        { label: "quadros", replacement: "The Chief Engineer is checking the switchboards.", pt: "O chefe de máquinas está verificando os quadros elétricos." },
      ],
      currentIndex: 0,
    },
    {
      key: "prof-6",
      original: "O timoneiro está governando a embarcação. / o timoneiro está mantendo o rumo / o timoneiro está a meio leme",
      options: [
        { label: "governando", replacement: "The helmsman is steering the vessel.", pt: "O timoneiro está governando a embarcação." },
        { label: "rumo", replacement: "The helmsman is keeping the course.", pt: "O timoneiro está mantendo o rumo." },
        { label: "meio leme", replacement: "The helmsman is keeping the wheel amidships.", pt: "O timoneiro está mantendo o leme a meio." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- BRIDGE VOCABULARY ----------
  const bridgeVocabSubstitution: SubstitutionExercise[] = [
    {
      key: "bv-1",
      original: "A embarcação está aproada para o norte. / sul / leste",
      options: [
        { label: "norte", replacement: "The vessel is on a northerly heading.", pt: "A embarcação está aproada para o norte." },
        { label: "sul", replacement: "The vessel is on a southerly heading.", pt: "A embarcação está aproada para o sul." },
        { label: "leste", replacement: "The vessel is on an easterly heading.", pt: "A embarcação está aproada para o leste." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-2",
      original: "Há uma embarcação à nossa proa de bombordo. / popa / alheta",
      options: [
        { label: "proa", replacement: "There is a vessel on our port bow.", pt: "Há uma embarcação à nossa proa de bombordo." },
        { label: "popa", replacement: "There is a vessel on our port quarter.", pt: "Há uma embarcação à nossa alheta de bombordo." },
        { label: "alheta", replacement: "There is a vessel on our starboard quarter.", pt: "Há uma embarcação à nossa alheta de boreste." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-3",
      original: "Verifique a posição da embarcação no ECDIS. / no radar / no GPS",
      options: [
        { label: "ECDIS", replacement: "Check the vessel's position on the ECDIS.", pt: "Verifique a posição da embarcação no ECDIS." },
        { label: "radar", replacement: "Check the vessel's position on the radar.", pt: "Verifique a posição da embarcação no radar." },
        { label: "GPS", replacement: "Check the vessel's position on the GPS.", pt: "Verifique a posição da embarcação no GPS." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-4",
      original: "Mantenha uma vigilância adequada. / o radar sob observação / escuta no canal 16",
      options: [
        { label: "vigilância", replacement: "Maintain a proper lookout.", pt: "Mantenha uma vigilância adequada." },
        { label: "radar", replacement: "Keep the radar under observation.", pt: "Mantenha o radar sob observação." },
        { label: "canal", replacement: "Keep a listening watch on channel 16.", pt: "Mantenha escuta no canal 16." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-5",
      original: "A visibilidade está restrita. / boa / moderada",
      options: [
        { label: "restrita", replacement: "The visibility is restricted.", pt: "A visibilidade está restrita." },
        { label: "boa", replacement: "The visibility is good.", pt: "A visibilidade está boa." },
        { label: "moderada", replacement: "The visibility is moderate.", pt: "A visibilidade está moderada." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-6",
      original: "A embarcação está seguindo para o próximo ponto de passagem. / waypoint / porto",
      options: [
        { label: "ponto", replacement: "The vessel is proceeding to the next waypoint.", pt: "A embarcação está seguindo para o próximo ponto de passagem." },
        { label: "porto", replacement: "The vessel is proceeding to the next port.", pt: "A embarcação está seguindo para o próximo porto." },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-7",
      original: "Qual é a nossa posição atual? / nosso aproamento / nosso rumo",
      options: [
        { label: "posição", replacement: "What is our present position?", pt: "Qual é a nossa posição atual?" },
        { label: "aproamento", replacement: "What is our present heading?", pt: "Qual é o nosso aproamento atual?" },
        { label: "rumo", replacement: "What is our present course?", pt: "Qual é o nosso rumo atual?" },
      ],
      currentIndex: 0,
    },
    {
      key: "bv-8",
      original: "O alvo está se aproximando pelo lado de boreste. / bombordo / popa",
      options: [
        { label: "boreste", replacement: "The target is approaching from the starboard side.", pt: "O alvo está se aproximando pelo lado de boreste." },
        { label: "bombordo", replacement: "The target is approaching from the port side.", pt: "O alvo está se aproximando pelo lado de bombordo." },
        { label: "popa", replacement: "The target is approaching from astern.", pt: "O alvo está se aproximando pela popa." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- BRIDGE COMMANDS ----------
  const commandsSubstitution: SubstitutionExercise[] = [
    {
      key: "cmd-1",
      original: "Fique a postos. / para manobra / para atracação",
      options: [
        { label: "postos", replacement: "Stand by.", pt: "Fique a postos." },
        { label: "manobra", replacement: "Stand by for maneuvering.", pt: "Fique a postos para manobra." },
        { label: "atracação", replacement: "Stand by for mooring.", pt: "Fique a postos para atracação." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-2",
      original: "Leme a bombordo, dez graus. / boreste / meio",
      options: [
        { label: "bombordo", replacement: "Port ten.", pt: "Leme a bombordo, dez graus." },
        { label: "boreste", replacement: "Starboard ten.", pt: "Leme a boreste, dez graus." },
        { label: "meio", replacement: "Midships.", pt: "Leme a meio." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-3",
      original: "Todo o leme a bombordo. / a boreste / a meio",
      options: [
        { label: "bombordo", replacement: "Hard to port.", pt: "Todo o leme a bombordo." },
        { label: "boreste", replacement: "Hard to starboard.", pt: "Todo o leme a boreste." },
        { label: "meio", replacement: "Wheel amidships.", pt: "Leme a meio." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-4",
      original: "Mantenha o rumo atual. / reduza a velocidade / pare o motor",
      options: [
        { label: "rumo", replacement: "Steady as she goes.", pt: "Mantenha o rumo atual." },
        { label: "velocidade", replacement: "Reduce speed.", pt: "Reduza a velocidade." },
        { label: "motor", replacement: "Stop the engine.", pt: "Pare o motor." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-5",
      original: "Informe o comandante. / o chefe de máquinas / o imediato",
      options: [
        { label: "comandante", replacement: "Inform the Master.", pt: "Informe o comandante." },
        { label: "chefe", replacement: "Call the Chief Engineer.", pt: "Chame o chefe de máquinas." },
        { label: "imediato", replacement: "Inform the Chief Officer.", pt: "Informe o imediato." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-6",
      original: "Verifique o radar. / o aproamento / a posição",
      options: [
        { label: "radar", replacement: "Check the radar.", pt: "Verifique o radar." },
        { label: "aproamento", replacement: "Check the heading.", pt: "Verifique o aproamento." },
        { label: "posição", replacement: "Check the position.", pt: "Verifique a posição." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-7",
      original: "Informe quando estiver pronto. / quando estiver na posição / quando chegar ao waypoint",
      options: [
        { label: "pronto", replacement: "Report when ready.", pt: "Informe quando estiver pronto." },
        { label: "posição", replacement: "Report when in position.", pt: "Informe quando estiver na posição." },
        { label: "waypoint", replacement: "Report when at the waypoint.", pt: "Informe quando chegar ao ponto de passagem." },
      ],
      currentIndex: 0,
    },
    {
      key: "cmd-8",
      original: "Confirme o aproamento. / a prontidão / a distância",
      options: [
        { label: "aproamento", replacement: "Confirm the heading.", pt: "Confirme o aproamento." },
        { label: "prontidão", replacement: "Confirm readiness.", pt: "Confirme a prontidão." },
        { label: "distância", replacement: "Report the distance.", pt: "Informe a distância." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- VHF RADIO ----------
  const vhfRadioSubstitution: SubstitutionExercise[] = [
    {
      key: "vhf-1",
      original: "Aqui é a embarcação Alpha chamando a Bravo no VHF. / no canal 16 / no canal 12",
      options: [
        { label: "VHF", replacement: "This is vessel Alpha calling vessel Bravo on VHF.", pt: "Aqui é a embarcação Alpha chamando a embarcação Bravo no VHF." },
        { label: "canal 16", replacement: "This is vessel Alpha calling vessel Bravo on channel 16.", pt: "Aqui é a embarcação Alpha chamando a embarcação Bravo no canal 16." },
        { label: "canal 12", replacement: "This is vessel Alpha calling vessel Bravo on channel 12.", pt: "Aqui é a embarcação Alpha chamando a embarcação Bravo no canal 12." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-2",
      original: "Recebido. Continuaremos monitorando o movimento de vocês. / a posição / o tráfego",
      options: [
        { label: "movimento", replacement: "Roger. We will continue to monitor your movement.", pt: "Recebido. Continuaremos monitorando o movimento de vocês." },
        { label: "posição", replacement: "Roger. We will continue to monitor your position.", pt: "Recebido. Continuaremos monitorando a posição de vocês." },
        { label: "tráfego", replacement: "Roger. We will continue to monitor the traffic.", pt: "Recebido. Continuaremos monitorando o tráfego." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-3",
      original: "Por favor, informe suas intenções. / sua posição / seu rumo",
      options: [
        { label: "intenções", replacement: "Please advise your intentions.", pt: "Por favor, informe suas intenções." },
        { label: "posição", replacement: "Please advise your position.", pt: "Por favor, informe sua posição." },
        { label: "rumo", replacement: "Please advise your course.", pt: "Por favor, informe seu rumo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-4",
      original: "Mudando para o canal 12. / 16 / 06",
      options: [
        { label: "12", replacement: "Changing to channel 12.", pt: "Mudando para o canal 12." },
        { label: "16", replacement: "Changing to channel 16.", pt: "Mudando para o canal 16." },
        { label: "06", replacement: "Changing to channel 06.", pt: "Mudando para o canal 06." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-5",
      original: "Não estou conseguindo entender sua transmissão. / sinal fraco / repita por favor",
      options: [
        { label: "não entendo", replacement: "I cannot copy you.", pt: "Não estou conseguindo entender sua transmissão." },
        { label: "sinal fraco", replacement: "Weak signal.", pt: "Sinal fraco." },
        { label: "repita", replacement: "Say again, please.", pt: "Repita, por favor." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-6",
      original: "Recebido, entendido e será cumprido. / recebido / afirmativo",
      options: [
        { label: "wilco", replacement: "Wilco.", pt: "Recebido, entendido e será cumprido." },
        { label: "roger", replacement: "Roger.", pt: "Recebido." },
        { label: "afirmativo", replacement: "Affirmative.", pt: "Afirmativo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-7",
      original: "Estamos mantendo nosso rumo e velocidade atuais, observadas as regras de prevenção de abalroamento. / nossa posição / nossa intenção",
      options: [
        { label: "rumo", replacement: "We intend to maintain our present course and speed, subject to the applicable collision regulations.", pt: "Pretendemos manter nosso rumo e velocidade atuais, observadas as regras de prevenção de abalroamento aplicáveis." },
        { label: "posição", replacement: "We intend to maintain our present position, subject to the applicable regulations.", pt: "Pretendemos manter nossa posição atual, observadas as regras aplicáveis." },
      ],
      currentIndex: 0,
    },
    {
      key: "vhf-8",
      original: "Qual é a sua posição atual e o seu rumo? / sua velocidade / sua intenção",
      options: [
        { label: "posição", replacement: "What is your present position and course?", pt: "Qual é a sua posição atual e o seu rumo?" },
        { label: "velocidade", replacement: "What is your present speed?", pt: "Qual é a sua velocidade atual?" },
        { label: "intenção", replacement: "What are your intentions?", pt: "Quais são as suas intenções?" },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- DP VOCABULARY ----------
  const dpVocabSubstitution: SubstitutionExercise[] = [
    {
      key: "dp-1",
      original: "A embarcação está no modo DP. / em modo manual / em modo joystick",
      options: [
        { label: "DP", replacement: "The vessel is in DP mode.", pt: "A embarcação está no modo DP." },
        { label: "manual", replacement: "The vessel is in manual mode.", pt: "A embarcação está em modo manual." },
        { label: "joystick", replacement: "The vessel is in joystick mode.", pt: "A embarcação está em modo joystick." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-2",
      original: "O sistema DP está mantendo a posição. / o aproamento / a posição e o aproamento",
      options: [
        { label: "posição", replacement: "The DP system is maintaining position.", pt: "O sistema DP está mantendo a posição." },
        { label: "aproamento", replacement: "The DP system is maintaining heading.", pt: "O sistema DP está mantendo o aproamento." },
        { label: "ambos", replacement: "The DP system is maintaining position and heading.", pt: "O sistema DP está mantendo a posição e o aproamento." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-3",
      original: "A velocidade do vento está aumentando. / a direção do vento mudou / a corrente está aumentando",
      options: [
        { label: "velocidade", replacement: "The wind speed is increasing.", pt: "A velocidade do vento está aumentando." },
        { label: "direção", replacement: "The wind direction has changed.", pt: "A direção do vento mudou." },
        { label: "corrente", replacement: "The current is increasing.", pt: "A corrente está aumentando." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-4",
      original: "Um sistema de referência de posição está indisponível. / o DGPS / o laser",
      options: [
        { label: "referência", replacement: "One position reference system is unavailable.", pt: "Um sistema de referência de posição está indisponível." },
        { label: "DGPS", replacement: "The DGPS reference is unavailable.", pt: "A referência DGPS está indisponível." },
        { label: "laser", replacement: "The laser reference is unavailable.", pt: "A referência a laser está indisponível." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-5",
      original: "O operador de DP está verificando as referências de posição. / os propulsores / a potência",
      options: [
        { label: "referências", replacement: "The DP operator is checking the position references.", pt: "O operador de DP está verificando as referências de posição." },
        { label: "propulsores", replacement: "The DP operator is checking the thrusters.", pt: "O operador de DP está verificando os propulsores." },
        { label: "potência", replacement: "The DP operator is checking the available power.", pt: "O operador de DP está verificando a potência disponível." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-6",
      original: "A distribuição de esforço dos propulsores mudou. / a potência disponível / o status do sistema",
      options: [
        { label: "distribuição", replacement: "The thruster allocation has changed.", pt: "A distribuição de esforço dos propulsores mudou." },
        { label: "potência", replacement: "The available power has changed.", pt: "A potência disponível mudou." },
        { label: "status", replacement: "The system status has changed.", pt: "O status do sistema mudou." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-7",
      original: "Perdemos uma referência de posição. / o sinal DGPS / o giro",
      options: [
        { label: "referência", replacement: "We have a loss of position reference.", pt: "Perdemos uma referência de posição." },
        { label: "DGPS", replacement: "We have a loss of DGPS signal.", pt: "Perdemos o sinal DGPS." },
        { label: "giro", replacement: "We have a loss of gyro signal.", pt: "Perdemos o sinal do giro." },
      ],
      currentIndex: 0,
    },
    {
      key: "dp-8",
      original: "A embarcação está se aproximando do limite operacional. / do limite de alarme / do limite de potência",
      options: [
        { label: "operacional", replacement: "The vessel is approaching the operational limit.", pt: "A embarcação está se aproximando do limite operacional." },
        { label: "alarme", replacement: "The vessel is approaching the alarm limit.", pt: "A embarcação está se aproximando do limite de alarme." },
        { label: "potência", replacement: "The vessel is approaching the power limit.", pt: "A embarcação está se aproximando do limite de potência." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- DPO CAREER ----------
  const dpoCareerSubstitution: SubstitutionExercise[] = [
    {
      key: "dpo-1",
      original: "Quero me tornar um operador de posicionamento dinâmico. / um oficial de serviço / um imediato",
      options: [
        { label: "DPO", replacement: "I want to become a Dynamic Positioning Operator.", pt: "Quero me tornar um operador de posicionamento dinâmico." },
        { label: "OOW", replacement: "I want to become an Officer of the Watch.", pt: "Quero me tornar um oficial de serviço no passadiço." },
        { label: "imediato", replacement: "I want to become a Chief Officer.", pt: "Quero me tornar um imediato." },
      ],
      currentIndex: 0,
    },
    {
      key: "dpo-2",
      original: "Estou estudando inglês marítimo para melhorar minhas habilidades de comunicação. / meu inglês técnico / minha fluência",
      options: [
        { label: "comunicação", replacement: "I am studying maritime English to improve my communication skills.", pt: "Estou estudando inglês marítimo para melhorar minhas habilidades de comunicação." },
        { label: "técnico", replacement: "I am studying maritime English to improve my technical English.", pt: "Estou estudando inglês marítimo para melhorar meu inglês técnico." },
        { label: "fluência", replacement: "I am studying maritime English to improve my fluency.", pt: "Estou estudando inglês marítimo para melhorar minha fluência." },
      ],
      currentIndex: 0,
    },
    {
      key: "dpo-3",
      original: "Entendo a importância da consciência situacional no passadiço. / da comunicação clara / do trabalho em equipe",
      options: [
        { label: "situacional", replacement: "I understand the importance of situational awareness on the bridge.", pt: "Entendo a importância da consciência situacional no passadiço." },
        { label: "comunicação", replacement: "I understand the importance of clear communication on the bridge.", pt: "Entendo a importância da comunicação clara no passadiço." },
        { label: "equipe", replacement: "I understand the importance of teamwork on the bridge.", pt: "Entendo a importância do trabalho em equipe no passadiço." },
      ],
      currentIndex: 0,
    },
    {
      key: "dpo-4",
      original: "Preciso entender os alarmes do DP e os procedimentos operacionais. / os limites operacionais / as referências de posição",
      options: [
        { label: "alarmes", replacement: "I need to understand the DP alarms and operating procedures.", pt: "Preciso entender os alarmes do DP e os procedimentos operacionais." },
        { label: "limites", replacement: "I need to understand the operational limits.", pt: "Preciso entender os limites operacionais." },
        { label: "referências", replacement: "I need to understand the position references.", pt: "Preciso entender as referências de posição." },
      ],
      currentIndex: 0,
    },
    {
      key: "dpo-5",
      original: "Estou praticando a comunicação radiotelefônica marítima padronizada. / a comunicação VHF / a comunicação de bordo",
      options: [
        { label: "radiotelefônica", replacement: "I am practicing standard maritime radio communication.", pt: "Estou praticando a comunicação radiotelefônica marítima padronizada." },
        { label: "VHF", replacement: "I am practicing standard VHF communication.", pt: "Estou praticando a comunicação VHF padronizada." },
        { label: "bordo", replacement: "I am practicing standard onboard communication.", pt: "Estou praticando a comunicação de bordo padronizada." },
      ],
      currentIndex: 0,
    },
    {
      key: "dpo-6",
      original: "Meu objetivo é trabalhar com segurança e profissionalismo em operações offshore. / em operações DP / em embarcações de apoio",
      options: [
        { label: "offshore", replacement: "My goal is to work safely and professionally in offshore operations.", pt: "Meu objetivo é trabalhar com segurança e profissionalismo em operações offshore." },
        { label: "DP", replacement: "My goal is to work safely and professionally in DP operations.", pt: "Meu objetivo é trabalhar com segurança e profissionalismo em operações DP." },
        { label: "apoio", replacement: "My goal is to work safely and professionally on support vessels.", pt: "Meu objetivo é trabalhar com segurança e profissionalismo em embarcações de apoio." },
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...professionalsSubstitution, ...bridgeVocabSubstitution, ...commandsSubstitution, ...vhfRadioSubstitution, ...dpVocabSubstitution, ...dpoCareerSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const bridgePhrasesData = [
    { en: "The Master is on the bridge.", pt: "O comandante está no passadiço.", green: ["Master", "bridge"] },
    { en: "Maintain a proper lookout.", pt: "Mantenha uma vigilância adequada.", green: ["Maintain", "lookout"] },
    { en: "What is our present position?", pt: "Qual é a nossa posição atual?", green: ["present", "position"] },
    { en: "The vessel is proceeding to the next waypoint.", pt: "A embarcação está seguindo para o próximo ponto de passagem.", green: ["proceeding", "waypoint"] },
  ];

  const vhfPhrasesData = [
    { en: "This is offshore vessel Alpha calling vessel Bravo on VHF.", pt: "Aqui é a embarcação Alpha chamando a embarcação Bravo no VHF.", green: ["calling", "VHF"] },
    { en: "Roger. We will continue to monitor your movement.", pt: "Recebido. Continuaremos monitorando o movimento de vocês.", green: ["Roger", "monitor"] },
    { en: "Please advise your intentions.", pt: "Por favor, informe suas intenções.", green: ["advise", "intentions"] },
    { en: "Say again, please.", pt: "Repita, por favor.", green: ["Say", "again"] },
  ];

  const dpoPhrasesData = [
    { en: "The vessel is in DP mode.", pt: "A embarcação está no modo DP.", green: ["DP", "mode"] },
    { en: "The DP system is maintaining position.", pt: "O sistema DP está mantendo a posição.", green: ["maintaining", "position"] },
    { en: "One position reference system is unavailable.", pt: "Um sistema de referência de posição está indisponível.", green: ["reference", "unavailable"] },
    { en: "The wind speed is increasing.", pt: "A velocidade do vento está aumentando.", green: ["wind", "increasing"] },
  ];

  const makeItYoursData = [
    { en: "Captain, we have a contact on the starboard bow. CPA is 0.7 nautical miles.", pt: "Comandante, temos um alvo à proa de boreste. O CPA é de 0,7 milha náutica.", green: ["Captain", "starboard", "CPA"] },
    { en: "I want to become a DPO because I am interested in offshore operations and safety.", pt: "Quero me tornar DPO porque tenho interesse em operações offshore e segurança.", green: ["DPO", "offshore", "safety"] },
    { en: "The Chief Engineer is checking the propulsion system and the generators.", pt: "O chefe de máquinas está verificando o sistema de propulsão e os geradores.", green: ["Chief", "Engineer", "propulsion"] },
    { en: "Please inform me of any change in thruster availability.", pt: "Por favor, informe-me qualquer alteração na disponibilidade dos propulsores.", green: ["inform", "thruster", "availability"] },
    { en: "We need to verify the DP operating limits before continuing.", pt: "Precisamos verificar os limites operacionais do DP antes de continuar.", green: ["verify", "operating", "limits"] },
    { en: "The lookout has sighted a vessel on the port side.", pt: "O vigia avistou uma embarcação por bombordo.", green: ["lookout", "vessel", "port"] },
    { en: "Installation control room, this is Alpha. We are monitoring our position and heading.", pt: "Sala de controle da unidade, aqui é a Alpha. Estamos monitorando nossa posição e nosso aproamento.", green: ["installation", "monitoring", "heading"] },
    { en: "My goal is to work safely and professionally in offshore operations.", pt: "Meu objetivo é trabalhar com segurança e profissionalismo em operações offshore.", green: ["goal", "safely", "offshore"] },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1117210/pexels-photo-1117210.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f5fa] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c2a4a] mb-6">🚢 Maritime English - Bridge & DP</h1>
          <SpeakSentence text="Learn maritime English for the bridge, VHF radio and dynamic positioning operations." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            ⚓ Learn maritime English for the bridge, VHF radio and dynamic positioning.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Maritime Bridge"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – PROFESSIONALS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">👨‍✈️ CREW ROLES</h2>
              <PencilIcon onClick={() => openNoteModal('Crew Roles')} />
            </div>
            <button
              onClick={() => toggleDrill('professionals')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.professionals ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on each role to hear the pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each role to hear the pronunciation
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="Master" className="text-blue-600 font-bold">Master / Captain</SpeakText> = Comandante</li>
              <li><SpeakText text="Chief Officer" className="text-blue-600 font-bold">Chief Officer / Chief Mate</SpeakText> = Imediato</li>
              <li><SpeakText text="DPO" className="text-blue-600 font-bold">DPO</SpeakText> = Operador de Posicionamento Dinâmico</li>
              <li><SpeakText text="Chief Engineer" className="text-blue-600 font-bold">Chief Engineer</SpeakText> = Chefe de máquinas</li>
              <li><SpeakText text="Lookout" className="text-blue-600 font-bold">Lookout</SpeakText> = Vigia</li>
              <li><SpeakText text="Helmsman" className="text-blue-600 font-bold">Helmsman</SpeakText> = Timoneiro</li>
            </ul>
            {openDrills.professionals && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {professionalsSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2 – BRIDGE VOCABULARY ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🧭 BRIDGE VOCABULARY</h2>
              <PencilIcon onClick={() => openNoteModal('Bridge Vocabulary')} />
            </div>
            <button
              onClick={() => toggleDrill('bridgeVocab')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.bridgeVocab ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "Bridge", pt: "Passadiço" },
                { en: "Port side", pt: "Bombordo" },
                { en: "Starboard side", pt: "Boreste" },
                { en: "Bow", pt: "Proa" },
                { en: "Stern", pt: "Popa" },
                { en: "Heading", pt: "Aproamento" },
                { en: "Course", pt: "Rumo" },
                { en: "Bearing", pt: "Marcação" },
                { en: "Waypoint", pt: "Ponto de passagem" },
                { en: "Passage plan", pt: "Plano de viagem" },
                { en: "ECDIS", pt: "Cartas náuticas eletrônicas" },
                { en: "AIS", pt: "Identificação automática" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.bridgeVocab && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {bridgeVocabSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 3 – BRIDGE COMMANDS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📢 BRIDGE COMMANDS</h2>
              <PencilIcon onClick={() => openNoteModal('Bridge Commands')} />
            </div>
            <button
              onClick={() => toggleDrill('commands')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.commands ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice traditional helm orders and bridge commands" className="text-md text-gray-600 mb-4 italic">
              💬 Practice traditional helm orders and bridge commands
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {bridgePhrasesData.map((item, idx) => (
                <HighlightedPhrase key={idx} text={item.en} greenWords={item.green} translation={item.pt} />
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "Stand by for maneuvering.", pt: "Fique a postos para manobra." },
                { en: "Port ten. / Starboard ten.", pt: "Leme a bombordo, dez graus. / Leme a boreste, dez graus." },
                { en: "Midships.", pt: "Leme a meio." },
                { en: "Steady as she goes.", pt: "Mantenha o rumo atual." },
                { en: "Inform the Master.", pt: "Informe o comandante." },
                { en: "Confirm readiness.", pt: "Confirme a prontidão." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.commands && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {commandsSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 4 – VHF RADIO ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">📻 VHF RADIO COMMUNICATION</h2>
              <PencilIcon onClick={() => openNoteModal('VHF Radio')} />
            </div>
            <button
              onClick={() => toggleDrill('vhfRadio')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.vhfRadio ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Learn standard radiotelephony phrases for vessel-to-vessel communication" className="text-md text-gray-600 mb-4 italic">
              📡 Learn standard radiotelephony phrases for vessel-to-vessel communication
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {vhfPhrasesData.map((item, idx) => (
                <HighlightedPhrase key={idx} text={item.en} greenWords={item.green} translation={item.pt} />
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="text-blue-800 font-bold mb-2">📘 Essential radio terms:</p>
              {[
                { en: "Over — Câmbio (aguarda resposta)", pt: "Indica que se espera resposta." },
                { en: "Out — Terminado (sem esperar resposta)", pt: "Encerrar a transmissão." },
                { en: "Roger — Recebido", pt: "Confirma recebimento da mensagem." },
                { en: "Wilco — Recebido e será cumprido", pt: "Confirma entendimento e intenção de cumprir." },
                { en: "Mayday — Perigo grave e iminente", pt: "Situação de perigo que exige assistência imediata." },
                { en: "Pan-Pan — Urgência", pt: "Situação de urgência que não atinge Mayday." },
                { en: "Sécurité — Segurança marítima", pt: "Mensagens de segurança marítima." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.vhfRadio && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {vhfRadioSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – DP VOCABULARY ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">⚓ DP VOCABULARY</h2>
              <PencilIcon onClick={() => openNoteModal('DP Vocabulary')} />
            </div>
            <button
              onClick={() => toggleDrill('dpVocab')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.dpVocab ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Dynamic Positioning terminology for future DPOs" className="text-md text-gray-600 mb-4 italic">
              🎯 Dynamic Positioning terminology for future DPOs
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {dpoPhrasesData.map((item, idx) => (
                <HighlightedPhrase key={idx} text={item.en} greenWords={item.green} translation={item.pt} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "DP console", pt: "Console de DP" },
                { en: "Position reference", pt: "Referência de posição" },
                { en: "Thruster", pt: "Propulsor" },
                { en: "Thrust", pt: "Empuxo" },
                { en: "Setpoint", pt: "Valor de referência" },
                { en: "Offset", pt: "Deslocamento" },
                { en: "Drift-off", pt: "Afastamento não controlado" },
                { en: "Redundancy", pt: "Redundância" },
                { en: "ASOG", pt: "Diretrizes operacionais" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.dpVocab && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {dpVocabSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 6 – DPO CAREER ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎯 DPO CAREER PHRASES</h2>
              <PencilIcon onClick={() => openNoteModal('DPO Career')} />
            </div>
            <button
              onClick={() => toggleDrill('dpoCareer')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-teal-600 hover:to-teal-800"
            >
              {openDrills.dpoCareer ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Phrases for interviews, training and professional communication" className="text-md text-gray-600 mb-4 italic">
              🎤 Phrases for interviews, training and professional communication
            </SpeakSentence>

            <div className="bg-blue-50 rounded-[20px] p-6 mb-6">
              <p className="text-blue-800 font-bold mb-4 text-lg">🌟 Substitute the blue words to create your own version!</p>
              <div className="space-y-3">
                {makeItYoursData.map((s, idx) => (
                  <HighlightedPhrase key={idx} text={`${idx + 1}. ${s.en}`} greenWords={s.green} translation={s.pt} />
                ))}
              </div>
            </div>

            {openDrills.dpoCareer && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {dpoCareerSubstitution.map((ex) => {
                  const currentEx = getExerciseWithIndex(ex.key);
                  if (!currentEx) return null;
                  return <SubstitutionOptions key={ex.key} exercise={currentEx} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== WRAP UP ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-blue-100 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "The Master is on the bridge.", pt: "O comandante está no passadiço." },
                { en: "Maintain a proper lookout.", pt: "Mantenha uma vigilância adequada." },
                { en: "Stand by for maneuvering.", pt: "Fique a postos para manobra." },
                { en: "This is vessel Alpha calling vessel Bravo.", pt: "Aqui é a embarcação Alpha chamando a embarcação Bravo." },
                { en: "The vessel is in DP mode.", pt: "A embarcação está no modo DP." },
                { en: "One position reference is unavailable.", pt: "Uma referência de posição está indisponível." },
                { en: "I want to become a DPO.", pt: "Quero me tornar um operador de posicionamento dinâmico." },
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
                    <li><strong className="text-white">"Roger"</strong> confirms reception, not execution.</li>
                    <li><strong className="text-white">"Wilco"</strong> means it will be complied with.</li>
                    <li><strong className="text-white">"Over"</strong> expects a reply; <strong className="text-white">"Out"</strong> ends transmission.</li>
                    <li><strong className="text-white">"CPA / TCPA"</strong> help assess collision risk.</li>
                    <li><strong className="text-white">"Drift-off"</strong> = uncontrolled position loss.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-blue-200 text-sm">All examples are for study. Real operations must follow vessel procedures, Master's instructions, and applicable radiotelephony rules.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson64")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson
          </button>
          <button onClick={() => router.push("/cursos/lesson66")} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* IMAGE MODAL */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsImageModalOpen(false)}>
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={bridgeImage} alt="Bridge" className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl" />
            <button onClick={() => setIsImageModalOpen(false)} className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300">&times;</button>
          </div>
        </div>
      )}

      {/* MAIN IMAGE MODAL */}
      {isMainImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsMainImageModalOpen(false)}>
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={mainImage} alt="Maritime" className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl" />
            <button onClick={() => setIsMainImageModalOpen(false)} className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300">&times;</button>
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