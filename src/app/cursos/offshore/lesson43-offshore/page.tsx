"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Zap, Wrench, HardHat, ShieldCheck, Compass, Anchor, Radio, Ship, Package } from "lucide-react";

type SectionKey = 'verbs' | 'operations' | 'phrases' | 'grammar';

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
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
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
// NOTE MODAL
// ============================================
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
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6">
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
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-300 hover:text-white transition-colors focus:outline-none"
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
// SUBSTITUTION EXERCISE COMPONENT
// ============================================
type OptionType = string | { label: string; replacement: string; translation?: string };

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
  const [showTranslation, setShowTranslation] = useState(false);

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; translation?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentTranslation: string | undefined;

  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentTranslation = currentOption.translation;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => setShowEnglish(prev => !prev);
  const toggleTranslation = () => setShowTranslation(prev => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);

  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-700 font-semibold block text-sm md:text-base">{exercise.original}</p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentTranslation && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-bold"
              title="Mostrar/esconder tradução"
            >
              {showTranslation ? "🇧🇷 Ocultar" : "🇧🇷 Ver tradução"}
            </button>
          )}
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
          >
            {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100">
          <SpeakSentence text={currentSentence} className="text-blue-800 font-semibold" />
          {showTranslation && currentTranslation && (
            <p className="text-gray-600 text-sm mt-2 border-t border-blue-200 pt-2">🇧🇷 {currentTranslation}</p>
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
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
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
// HIGHLIGHTED PHRASE
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <button
        onClick={() => setShowTranslation(prev => !prev)}
        className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-bold mb-2"
      >
        {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
      </button>
      {showTranslation && (
        <p className="text-sm text-gray-600 border-t border-blue-100 pt-2">🇧🇷 {translation}</p>
      )}
    </div>
  );
}

// ============================================
// INTERVIEW Q&A CARD
// ============================================
function InterviewCard({
  question,
  questionPt,
  answer,
  answerPt,
  index,
}: {
  question: string;
  questionPt: string;
  answer: string;
  answerPt: string;
  index: number;
}) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wide mb-1">
              <span className="bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {index}
              </span>
              Interviewer
            </div>
            <SpeakSentence text={question} className="text-white font-semibold text-sm md:text-base">
              {question}
            </SpeakSentence>
            <p className="text-blue-200 text-xs mt-1 italic">🇧🇷 {questionPt}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={() => setShowAnswer(prev => !prev)}
          className="mb-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
        >
          {showAnswer ? "🙈 Ocultar resposta modelo" : "👁️ Ver resposta modelo"}
        </button>

        {showAnswer && (
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="flex items-center gap-2 text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
              <HardHat size={14} className="text-blue-600" />
              Candidate
            </div>
            <SpeakSentence text={answer} className="text-gray-800 leading-relaxed text-sm md:text-base">
              {answer}
            </SpeakSentence>
            <button
              onClick={() => setShowTranslation(prev => !prev)}
              className="mt-3 text-xs px-2 py-1 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition-colors font-bold"
            >
              {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
            </button>
            {showTranslation && (
              <p className="text-gray-600 text-sm mt-2 border-t border-blue-200 pt-2">🇧🇷 {answerPt}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonOffshoreHSEOperationsLifting() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    operations: false,
    phrases: false,
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
  const [isOperationsImageModalOpen, setIsOperationsImageModalOpen] = useState(false);
  const [isOperationsImage2ModalOpen, setIsOperationsImage2ModalOpen] = useState(false);
  const [isLiftingImageModalOpen, setIsLiftingImageModalOpen] = useState(false);

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

  // ===== IMAGENS =====
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/engenhariaprodu%C3%A7%C3%A3o1.png?raw=true";
  const secondaryImage = "https://github.com/Sullivan-code/english-audios/blob/main/engenhariaprodu%C3%A7%C3%A3o2.png?raw=true";
  const operationsImage = "https://github.com/Sullivan-code/english-audios/blob/main/engenhariaprodu%C3%A7%C3%A3o3.png?raw=true";
  const operationsImage2 = "https://github.com/Sullivan-code/english-audios/blob/main/engenhariaprodu%C3%A7%C3%A3o4.png?raw=true";
  const liftingImage = "https://github.com/Sullivan-code/english-audios/blob/main/engenhariaprodu%C3%A7%C3%A3o3.png?raw=true";

  // ============================================================
  // VERBS – HSE / OPERATIONS / LIFTING
  // ============================================================
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu cumpro os procedimentos de HSE. / ele / nós",
      options: [
        { label: "Eu", replacement: "I comply with HSE procedures.", translation: "Eu cumpro os procedimentos de HSE." },
        { label: "Ele", replacement: "He complies with HSE procedures.", translation: "Ele cumpre os procedimentos de HSE." },
        { label: "Nós", replacement: "We comply with HSE procedures.", translation: "Nós cumprimos os procedimentos de HSE." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu inspeciono o convés antes da operação. / ela / eles",
      options: [
        { label: "Eu", replacement: "I inspect the deck before the operation.", translation: "Eu inspeciono o convés antes da operação." },
        { label: "Ela", replacement: "She inspects the deck before the operation.", translation: "Ela inspeciona o convés antes da operação." },
        { label: "Eles", replacement: "They inspect the deck before the operation.", translation: "Eles inspecionam o convés antes da operação." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu autorizo a operação de içamento. / ele / vocês",
      options: [
        { label: "Eu", replacement: "I authorize the lifting operation.", translation: "Eu autorizo a operação de içamento." },
        { label: "Ele", replacement: "He authorizes the lifting operation.", translation: "Ele autoriza a operação de içamento." },
        { label: "Vocês", replacement: "You authorize the lifting operation.", translation: "Vocês autorizam a operação de içamento." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu coordenei a operação simultânea ontem. / ela / nós",
      options: [
        { label: "Eu", replacement: "I coordinated the simultaneous operation yesterday.", translation: "Eu coordenei a operação simultânea ontem." },
        { label: "Ela", replacement: "She coordinated the simultaneous operation yesterday.", translation: "Ela coordenou a operação simultânea ontem." },
        { label: "Nós", replacement: "We coordinated the simultaneous operation yesterday.", translation: "Nós coordenamos a operação simultânea ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu isolo a área de exclusão antes do içamento. / ele / eles",
      options: [
        { label: "Eu", replacement: "I isolate the exclusion zone before the lift.", translation: "Eu isolo a área de exclusão antes do içamento." },
        { label: "Ele", replacement: "He isolates the exclusion zone before the lift.", translation: "Ele isola a área de exclusão antes do içamento." },
        { label: "Eles", replacement: "They isolate the exclusion zone before the lift.", translation: "Eles isolam a área de exclusão antes do içamento." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu tenho trabalhado com operações de carga por 6 anos. / ele / nós",
      options: [
        { label: "Eu", replacement: "I have worked with cargo operations for 6 years.", translation: "Eu tenho trabalhado com operações de carga por 6 anos." },
        { label: "Ele", replacement: "He has worked with cargo operations for 6 years.", translation: "Ele tem trabalhado com operações de carga por 6 anos." },
        { label: "Nós", replacement: "We have worked with cargo operations for 6 years.", translation: "Nós temos trabalhado com operações de carga por 6 anos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu reviso o plano de içamento antes da operação. / ela / eles",
      options: [
        { label: "Eu", replacement: "I review the lifting plan before the operation.", translation: "Eu reviso o plano de içamento antes da operação." },
        { label: "Ela", replacement: "She reviews the lifting plan before the operation.", translation: "Ela revisa o plano de içamento antes da operação." },
        { label: "Eles", replacement: "They review the lifting plan before the operation.", translation: "Eles revisam o plano de içamento antes da operação." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu reporto quase-acidentes ao supervisor. / incidentes / riscos",
      options: [
        { label: "quase-acidentes", replacement: "I report near misses to the supervisor.", translation: "Eu reporto quase-acidentes ao supervisor." },
        { label: "incidentes", replacement: "I report incidents to the supervisor.", translation: "Eu reporto incidentes ao supervisor." },
        { label: "riscos", replacement: "I report hazards to the supervisor.", translation: "Eu reporto riscos ao supervisor." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Nós mitigamos os riscos antes de começar. / controlamos / avaliamos",
      options: [
        { label: "mitigamos", replacement: "We mitigate the risks before starting.", translation: "Nós mitigamos os riscos antes de começar." },
        { label: "controlamos", replacement: "We control the risks before starting.", translation: "Nós controlamos os riscos antes de começar." },
        { label: "avaliamos", replacement: "We assess the risks before starting.", translation: "Nós avaliamos os riscos antes de começar." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Eu seguro a carga com tagline (cabo guia). / amarro / fixo",
      options: [
        { label: "seguro", replacement: "I secure the load with a tagline.", translation: "Eu seguro a carga com uma tagline (cabo guia)." },
        { label: "amarro", replacement: "I tie the load with a tagline.", translation: "Eu amarro a carga com uma tagline (cabo guia)." },
        { label: "fixo", replacement: "I fasten the load with a tagline.", translation: "Eu fixo a carga com uma tagline (cabo guia)." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // HSE / OPERATIONS / VESSEL PARTS / LIFTING PLAN
  // ============================================================
  const operationsSubstitution: SubstitutionExercise[] = [
    {
      key: "op-1",
      original: "Antes de qualquer içamento, realizamos uma reunião pré-içamento. / análise de risco / toolbox meeting",
      options: [
        { label: "reunião pré-içamento", replacement: "Before any lift, we conduct a pre-lift meeting.", translation: "Antes de qualquer içamento, realizamos uma reunião pré-içamento." },
        { label: "análise de risco", replacement: "Before any lift, we conduct a risk assessment.", translation: "Antes de qualquer içamento, realizamos uma análise de risco." },
        { label: "toolbox meeting", replacement: "Before any lift, we conduct a toolbox meeting.", translation: "Antes de qualquer içamento, realizamos um DDS (diálogo de segurança)." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-2",
      original: "A carga máxima segura é 10 toneladas. / 5 toneladas / 20 toneladas",
      options: [
        { label: "10 toneladas", replacement: "The Safe Working Load is 10 tons.", translation: "A Carga Máxima de Trabalho Segura é 10 toneladas." },
        { label: "5 toneladas", replacement: "The Safe Working Load is 5 tons.", translation: "A Carga Máxima de Trabalho Segura é 5 toneladas." },
        { label: "20 toneladas", replacement: "The Safe Working Load is 20 tons.", translation: "A Carga Máxima de Trabalho Segura é 20 toneladas." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-3",
      original: "O banksman dá sinais manuais para o operador do guindaste. / rigger / supervisor",
      options: [
        { label: "banksman", replacement: "The banksman gives hand signals to the crane operator.", translation: "O banksman dá sinais manuais para o operador do guindaste." },
        { label: "rigger", replacement: "The rigger gives hand signals to the crane operator.", translation: "O rigger dá sinais manuais para o operador do guindaste." },
        { label: "supervisor", replacement: "The supervisor gives hand signals to the crane operator.", translation: "O supervisor dá sinais manuais para o operador do guindaste." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-4",
      original: "SIMOPS significa Operações Simultâneas. / PTW / JSA",
      options: [
        { label: "SIMOPS", replacement: "SIMOPS stands for Simultaneous Operations.", translation: "SIMOPS significa Operações Simultâneas." },
        { label: "PTW", replacement: "PTW stands for Permit To Work.", translation: "PTW significa Permissão de Trabalho." },
        { label: "JSA", replacement: "JSA stands for Job Safety Analysis.", translation: "JSA significa Análise de Segurança da Tarefa." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-5",
      original: "A proa é a parte da frente do navio. / popa / bombordo",
      options: [
        { label: "proa", replacement: "The bow is the front part of the vessel.", translation: "A proa é a parte da frente do navio." },
        { label: "popa", replacement: "The stern is the back part of the vessel.", translation: "A popa é a parte de trás do navio." },
        { label: "bombordo", replacement: "Port is the left side of the vessel.", translation: "Bombordo é o lado esquerdo do navio." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-6",
      original: "O heliponto fica no topo da superestrutura. / o moonpool / o convés principal",
      options: [
        { label: "heliponto", replacement: "The helideck is on top of the superstructure.", translation: "O heliponto fica no topo da superestrutura." },
        { label: "moonpool", replacement: "The moonpool is in the middle of the vessel.", translation: "O moonpool fica no meio da embarcação." },
        { label: "convés principal", replacement: "The main deck is at the lowest level.", translation: "O convés principal fica no nível mais baixo." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-7",
      original: "Nós usamos uma cesta de içamento para cargas pequenas. / um contêiner / um pallet",
      options: [
        { label: "cesta de içamento", replacement: "We use a lifting basket for small loads.", translation: "Nós usamos uma cesta de içamento para cargas pequenas." },
        { label: "contêiner", replacement: "We use a container for small loads.", translation: "Nós usamos um contêiner para cargas pequenas." },
        { label: "pallet", replacement: "We use a pallet for small loads.", translation: "Nós usamos um pallet para cargas pequenas." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-8",
      original: "A zona de exclusão deve estar livre de pessoas. / a área / o convés",
      options: [
        { label: "zona de exclusão", replacement: "The exclusion zone must be clear of people.", translation: "A zona de exclusão deve estar livre de pessoas." },
        { label: "a área", replacement: "The area must be clear of people.", translation: "A área deve estar livre de pessoas." },
        { label: "o convés", replacement: "The deck must be clear of people.", translation: "O convés deve estar livre de pessoas." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-9",
      original: "O centro de gravidade da carga é importante. / o peso / o volume",
      options: [
        { label: "centro de gravidade", replacement: "The center of gravity of the load is important.", translation: "O centro de gravidade da carga é importante." },
        { label: "peso", replacement: "The weight of the load is important.", translation: "O peso da carga é importante." },
        { label: "volume", replacement: "The volume of the load is important.", translation: "O volume da carga é importante." }
      ],
      currentIndex: 0,
    },
    {
      key: "op-10",
      original: "SIMOPS requer coordenação cuidadosa entre os departamentos. / comunicação / planejamento",
      options: [
        { label: "coordenação", replacement: "SIMOPS requires careful coordination between departments.", translation: "SIMOPS requer coordenação cuidadosa entre os departamentos." },
        { label: "comunicação", replacement: "SIMOPS requires careful communication between departments.", translation: "SIMOPS requer comunicação cuidadosa entre os departamentos." },
        { label: "planejamento", replacement: "SIMOPS requires careful planning between departments.", translation: "SIMOPS requer planejamento cuidadoso entre os departamentos." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // SPEAK LIKE A NATIVE – HSE / OPERATIONS / LIFTING
  // ============================================================
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "ph-1",
      original: "Eu tenho experiência com operações de içamento. / operações simultâneas / operações de carga",
      options: [
        { label: "içamento", replacement: "I have experience with lifting operations.", translation: "Eu tenho experiência com operações de içamento." },
        { label: "simultâneas", replacement: "I have experience with simultaneous operations.", translation: "Eu tenho experiência com operações simultâneas." },
        { label: "carga", replacement: "I have experience with cargo operations.", translation: "Eu tenho experiência com operações de carga." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-2",
      original: "Eu sigo todas as regras de HSE. / procedimentos / normas",
      options: [
        { label: "regras", replacement: "I follow all HSE rules.", translation: "Eu sigo todas as regras de HSE." },
        { label: "procedimentos", replacement: "I follow all HSE procedures.", translation: "Eu sigo todos os procedimentos de HSE." },
        { label: "normas", replacement: "I follow all HSE standards.", translation: "Eu sigo todas as normas de HSE." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-3",
      original: "Antes do içamento, fazemos uma reunião de segurança. / uma análise de risco / uma verificação",
      options: [
        { label: "reunião", replacement: "Before the lift, we hold a safety meeting.", translation: "Antes do içamento, fazemos uma reunião de segurança." },
        { label: "análise", replacement: "Before the lift, we perform a risk assessment.", translation: "Antes do içamento, realizamos uma análise de risco." },
        { label: "verificação", replacement: "Before the lift, we do a pre-check.", translation: "Antes do içamento, fazemos uma verificação prévia." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-4",
      original: "O plano de içamento deve ser aprovado pelo supervisor. / engenheiro / gerente",
      options: [
        { label: "supervisor", replacement: "The lifting plan must be approved by the supervisor.", translation: "O plano de içamento deve ser aprovado pelo supervisor." },
        { label: "engenheiro", replacement: "The lifting plan must be approved by the engineer.", translation: "O plano de içamento deve ser aprovado pelo engenheiro." },
        { label: "gerente", replacement: "The lifting plan must be approved by the manager.", translation: "O plano de içamento deve ser aprovado pelo gerente." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-5",
      original: "A segurança vem em primeiro lugar em todas as operações. / A qualidade / A eficiência",
      options: [
        { label: "segurança", replacement: "Safety comes first in all operations.", translation: "A segurança vem em primeiro lugar em todas as operações." },
        { label: "qualidade", replacement: "Quality comes first in all operations.", translation: "A qualidade vem em primeiro lugar em todas as operações." },
        { label: "eficiência", replacement: "Efficiency comes first in all operations.", translation: "A eficiência vem em primeiro lugar em todas as operações." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-6",
      original: "Eu me mantenho atento durante as operações no convés. / focado / alerta",
      options: [
        { label: "atento", replacement: "I stay aware during deck operations.", translation: "Eu me mantenho atento durante as operações no convés." },
        { label: "focado", replacement: "I stay focused during deck operations.", translation: "Eu me mantenho focado durante as operações no convés." },
        { label: "alerta", replacement: "I stay alert during deck operations.", translation: "Eu me mantenho alerta durante as operações no convés." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-7",
      original: "SIMOPS requer comunicação clara entre as equipes. / coordenação / planejamento",
      options: [
        { label: "comunicação", replacement: "SIMOPS requires clear communication between teams.", translation: "SIMOPS requer comunicação clara entre as equipes." },
        { label: "coordenação", replacement: "SIMOPS requires clear coordination between teams.", translation: "SIMOPS requer coordenação clara entre as equipes." },
        { label: "planejamento", replacement: "SIMOPS requires clear planning between teams.", translation: "SIMOPS requer planejamento claro entre as equipes." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-8",
      original: "Nós paramos a operação se as condições mudarem. / o vento aumentar / a visibilidade piorar",
      options: [
        { label: "condições mudarem", replacement: "We stop the operation if conditions change.", translation: "Nós paramos a operação se as condições mudarem." },
        { label: "o vento aumentar", replacement: "We stop the operation if the wind increases.", translation: "Nós paramos a operação se o vento aumentar." },
        { label: "a visibilidade piorar", replacement: "We stop the operation if visibility gets worse.", translation: "Nós paramos a operação se a visibilidade piorar." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // GRAMMAR
  // ============================================================
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "gr-1",
      original: "Eu já participei de operações SIMOPS antes. / ele / nós",
      options: [
        { label: "Eu", replacement: "I have participated in SIMOPS before.", translation: "Eu já participei de operações SIMOPS antes." },
        { label: "Ele", replacement: "He has participated in SIMOPS before.", translation: "Ele já participou de operações SIMOPS antes." },
        { label: "Nós", replacement: "We have participated in SIMOPS before.", translation: "Nós já participamos de operações SIMOPS antes." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-2",
      original: "Você já revisou um plano de içamento? / uma análise de risco / uma permissão de trabalho",
      options: [
        { label: "plano de içamento", replacement: "Have you reviewed a lifting plan?", translation: "Você já revisou um plano de içamento?" },
        { label: "análise de risco", replacement: "Have you reviewed a risk assessment?", translation: "Você já revisou uma análise de risco?" },
        { label: "permissão de trabalho", replacement: "Have you reviewed a permit to work?", translation: "Você já revisou uma permissão de trabalho?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-3",
      original: "Eu trabalho com operações de carga há 6 anos. / 3 anos / 10 anos",
      options: [
        { label: "6 anos", replacement: "I have worked with cargo operations for 6 years.", translation: "Eu trabalho com operações de carga há 6 anos." },
        { label: "3 anos", replacement: "I have worked with cargo operations for 3 years.", translation: "Eu trabalho com operações de carga há 3 anos." },
        { label: "10 anos", replacement: "I have worked with cargo operations for 10 years.", translation: "Eu trabalho com operações de carga há 10 anos." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-4",
      original: "Ele concluiu o treinamento de HSE. / ela / eles",
      options: [
        { label: "Ele", replacement: "He has completed the HSE training.", translation: "Ele concluiu o treinamento de HSE." },
        { label: "Ela", replacement: "She has completed the HSE training.", translation: "Ela concluiu o treinamento de HSE." },
        { label: "Eles", replacement: "They have completed the HSE training.", translation: "Eles concluíram o treinamento de HSE." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-5",
      original: "Eu verifico os equipamentos de içamento todos os dias. / cabos / ganchos",
      options: [
        { label: "equipamentos", replacement: "I check the lifting equipment every day.", translation: "Eu verifico os equipamentos de içamento todos os dias." },
        { label: "cabos", replacement: "I check the slings every day.", translation: "Eu verifico os cabos (lingas) todos os dias." },
        { label: "ganchos", replacement: "I check the hooks every day.", translation: "Eu verifico os ganchos todos os dias." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-6",
      original: "Você consegue operar o guindaste? / o guincho / o guindaste de convés",
      options: [
        { label: "guindaste", replacement: "Can you operate the crane?", translation: "Você consegue operar o guindaste?" },
        { label: "guincho", replacement: "Can you operate the winch?", translation: "Você consegue operar o guincho?" },
        { label: "guindaste de convés", replacement: "Can you operate the deck crane?", translation: "Você consegue operar o guindaste de convés?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-7",
      original: "Eu preciso verificar a permissão de trabalho antes de começar. / a análise de risco / o plano de içamento",
      options: [
        { label: "permissão de trabalho", replacement: "I need to check the permit to work before starting.", translation: "Eu preciso verificar a permissão de trabalho antes de começar." },
        { label: "análise de risco", replacement: "I need to check the risk assessment before starting.", translation: "Eu preciso verificar a análise de risco antes de começar." },
        { label: "plano de içamento", replacement: "I need to check the lifting plan before starting.", translation: "Eu preciso verificar o plano de içamento antes de começar." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-8",
      original: "Existe um procedimento para operações simultâneas? / trabalhos a quente / entrada em espaço confinado",
      options: [
        { label: "operações simultâneas", replacement: "Is there a procedure for simultaneous operations?", translation: "Existe um procedimento para operações simultâneas?" },
        { label: "trabalhos a quente", replacement: "Is there a procedure for hot work?", translation: "Existe um procedimento para trabalhos a quente?" },
        { label: "entrada em espaço confinado", replacement: "Is there a procedure for confined space entry?", translation: "Existe um procedimento para entrada em espaço confinado?" }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...operationsSubstitution,
    ...phrasesSubstitution,
    ...grammarSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================================
  // INTERVIEW Q&A DATA
  // ============================================================
  const interviewQA = [
    {
      question: "Tell me about yourself.",
      questionPt: "Fale um pouco sobre você.",
      answer: "Good morning. My name is Paulo, and I am a production engineering student with offshore experience. During my studies and offshore work, I have learned about HSE procedures, deck operations, vessel parts, and lifting plans. I am responsible, safety-oriented, and I enjoy working as a team.",
      answerPt: "Bom dia. Meu nome é Paulo e sou estudante de engenharia de produção com experiência offshore. Durante meus estudos e trabalho offshore, aprendi sobre procedimentos de HSE, operações no convés, partes de embarcações e planos de içamento. Sou responsável, focado em segurança e gosto de trabalhar em equipe."
    },
    {
      question: "What does HSE mean and why is it important?",
      questionPt: "O que significa HSE e por que é importante?",
      answer: "HSE stands for Health, Safety, and Environment. It is important because it protects people, equipment, and the environment. On board, HSE rules cover PPE, permit to work, risk assessments, toolbox meetings, and emergency procedures. Following HSE procedures prevents accidents and saves lives.",
      answerPt: "HSE significa Saúde, Segurança e Meio Ambiente. É importante porque protege pessoas, equipamentos e o meio ambiente. A bordo, as regras de HSE cobrem EPIs, permissão de trabalho, análises de risco, DDS e procedimentos de emergência. Seguir os procedimentos de HSE evita acidentes e salva vidas."
    },
    {
      question: "What is SIMOPS and why is it challenging?",
      questionPt: "O que é SIMOPS e por que é desafiador?",
      answer: "SIMOPS stands for Simultaneous Operations. It means two or more operations happening at the same time on the vessel, like lifting and drilling, or cargo and helicopter operations. It is challenging because it requires careful planning, clear communication, and coordination between all departments to avoid conflicts and reduce risk.",
      answerPt: "SIMOPS significa Operações Simultâneas. Significa duas ou mais operações acontecendo ao mesmo tempo na embarcação, como içamento e perfuração, ou carga e operações de helicóptero. É desafiador porque requer planejamento cuidadoso, comunicação clara e coordenação entre todos os departamentos para evitar conflitos e reduzir riscos."
    },
    {
      question: "What is a Lifting Plan and what does it include?",
      questionPt: "O que é um Plano de Içamento e o que ele inclui?",
      answer: "A lifting plan is a document that describes how a load will be lifted safely. It includes the weight of the load, the center of gravity, the Safe Working Load (SWL), the type of slings and shackles, the crane capacity, the exclusion zone, the tagline (guide rope) requirements, and the roles of the banksman, rigger, and crane operator.",
      answerPt: "Um plano de içamento é um documento que descreve como uma carga será içada com segurança. Ele inclui o peso da carga, o centro de gravidade, a Carga Máxima de Trabalho Segura (SWL), o tipo de lingas e manilhas, a capacidade do guindaste, a zona de exclusão, os requisitos de tagline (cabo guia) e as funções do banksman, rigger e operador do guindaste."
    },
    {
      question: "Can you name the main parts of a vessel?",
      questionPt: "Você pode citar as principais partes de uma embarcação?",
      answer: "Yes. The main parts are the bow (front), the stern (back), the port side (left), the starboard side (right), the hull, the main deck, the superstructure, the bridge, the engine room, the accommodation block, the moonpool, and the helideck. Other important parts are the forecastle, the poop deck, the bulwark, the bollards, and the fairleads.",
      answerPt: "Sim. As principais partes são a proa (frente), a popa (trás), bombordo (esquerda), estibordo (direita), o casco, o convés principal, a superestrutura, a ponte, a sala de máquinas, o bloco de acomodações, o moonpool e o heliponto. Outras partes importantes são o castelo de proa, o tombadilho, a borda falsa, os cabeços e os escovéns."
    },
    {
      question: "How do you prepare for a lifting operation on deck?",
      questionPt: "Como você se prepara para uma operação de içamento no convés?",
      answer: "First, I review the lifting plan and check the load weight and center of gravity. Then I verify the crane capacity and the SWL of all rigging gear. I hold a pre-lift meeting with the team, establish the exclusion zone, and make sure everyone wears PPE. During the lift, the banksman gives hand signals and the riggers use taglines (guide ropes) to control the load.",
      answerPt: "Primeiro, eu reviso o plano de içamento e verifico o peso da carga e o centro de gravidade. Depois verifico a capacidade do guindaste e a SWL de todo o equipamento de rigging. Faço uma reunião pré-içamento com a equipe, estabeleço a zona de exclusão e garanto que todos usem EPI. Durante o içamento, o banksman dá sinais manuais e os riggers usam taglines (cabos guia) para controlar a carga."
    },
    {
      question: "What is a Permit to Work (PTW)?",
      questionPt: "O que é uma Permissão de Trabalho (PTW)?",
      answer: "A Permit to Work is a formal document that authorizes a specific task under controlled conditions. It lists the hazards, the control measures, the duration of the task, and the people responsible. It is required for high-risk activities such as hot work, confined space entry, working at height, and lifting operations.",
      answerPt: "Uma Permissão de Trabalho é um documento formal que autoriza uma tarefa específica sob condições controladas. Ela lista os perigos, as medidas de controle, a duração da tarefa e as pessoas responsáveis. É exigida para atividades de alto risco como trabalho a quente, entrada em espaço confinado, trabalho em altura e operações de içamento."
    },
    {
      question: "What is a toolbox meeting?",
      questionPt: "O que é um DDS (toolbox meeting)?",
      answer: "A toolbox meeting is a short safety meeting held before a task. The supervisor explains the job, the hazards, the control measures, and the roles of each team member. Everyone has the chance to ask questions and raise concerns. It helps prevent accidents and improves communication.",
      answerPt: "Um DDS (toolbox meeting) é uma reunião curta de segurança realizada antes de uma tarefa. O supervisor explica o trabalho, os perigos, as medidas de controle e as funções de cada membro da equipe. Todos têm a chance de fazer perguntas e levantar preocupações. Ajuda a prevenir acidentes e melhora a comunicação."
    },
    {
      question: "How do you handle a dropped object risk?",
      questionPt: "Como você lida com o risco de queda de objetos?",
      answer: "To prevent dropped objects, we secure all tools with lanyards, use tool bags when working at height, close all barriers and hatches, and never leave loose items on the deck. We also use hard hats and never walk under a suspended load. A dropped object can seriously injure or kill someone.",
      answerPt: "Para prevenir a queda de objetos, fixamos todas as ferramentas com cordões, usamos bolsas de ferramentas ao trabalhar em altura, fechamos todas as barreiras e escotilhas e nunca deixamos itens soltos no convés. Também usamos capacetes e nunca andamos embaixo de uma carga suspensa. Um objeto que cai pode ferir gravemente ou matar alguém."
    },
    {
      question: "Why do you want to work on this project?",
      questionPt: "Por que você quer trabalhar neste projeto?",
      answer: "Because this project combines production engineering and offshore operations, which is exactly what I want to develop. I believe my knowledge of HSE, lifting plans, and vessel operations can add value to the team, and I want to continue learning from experienced professionals on board.",
      answerPt: "Porque este projeto combina engenharia de produção e operações offshore, que é exatamente o que eu quero desenvolver. Acredito que meu conhecimento de HSE, planos de içamento e operações de embarcações pode agregar valor à equipe, e quero continuar aprendendo com profissionais experientes a bordo."
    },
  ];

  // ============================================================
  // SPEAK LIKE A NATIVE DATA
  // ============================================================
  const usefulPhrasesData = [
    {
      en: "Before any lifting operation, we conduct a pre-lift meeting and review the lifting plan.",
      pt: "Antes de qualquer operação de içamento, realizamos uma reunião pré-içamento e revisamos o plano de içamento.",
      green: ["lifting", "pre-lift", "plan"]
    },
    {
      en: "SIMOPS require careful coordination between all departments on board.",
      pt: "SIMOPS requer coordenação cuidadosa entre todos os departamentos a bordo.",
      green: ["SIMOPS", "coordination", "departments"]
    },
    {
      en: "The banksman gives hand signals to the crane operator during the lift.",
      pt: "O banksman dá sinais manuais para o operador do guindaste durante o içamento.",
      green: ["banksman", "signals", "crane"]
    },
    {
      en: "All personnel must wear PPE and comply with HSE procedures.",
      pt: "Todo o pessoal deve usar EPI e cumprir os procedimentos de HSE.",
      green: ["PPE", "comply", "HSE"]
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/162568/oil-pump-jack-sunset-clouds-sky-162568.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f6fa] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Ship size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">Offshore English • B1–B2</span>
            <Ship size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            🚢 HSE, Operations & Lifting Plans
          </h1>
          <SpeakSentence text="Learn HSE vocabulary, simultaneous operations, vessel parts, and lifting plans. Prepare for offshore production engineering work." className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🛠️ Learn HSE vocabulary, simultaneous operations, vessel parts, and lifting plans. Prepare for offshore production engineering work.
          </SpeakSentence>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="Offshore operations"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wrench size={22} /> VERBS
              </h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-white text-blue-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-blue-100"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "to comply with", pt: "cumprir" },
                { en: "to lift", pt: "içar / levantar" },
                { en: "to rig", pt: "montar / cabear" },
                { en: "to secure", pt: "fixar / segurar" },
                { en: "to authorize", pt: "autorizar" },
                { en: "to coordinate", pt: "coordenar" },
                { en: "to isolate", pt: "isolar" },
                { en: "to mitigate", pt: "mitigar" },
                { en: "to report", pt: "reportar" },
                { en: "to review", pt: "revisar" },
                { en: "to approve", pt: "aprovar" },
                { en: "to fasten", pt: "fixar / prender" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-blue-700 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 2 – HSE / OPERATIONS / LIFTING ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Radio size={22} /> HSE, OPERATIONS & LIFTING
              </h2>
              <PencilIcon onClick={() => openNoteModal('HSE, Operations & Lifting')} />
            </div>
            <button
              onClick={() => toggleDrill('operations')}
              className="inline-block rounded-full bg-white text-blue-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-blue-100"
            >
              {openDrills.operations ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>

            {/* Operations image 1 */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsOperationsImageModalOpen(true)}>
              <img
                src={operationsImage}
                alt="Offshore operations – production engineering"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            {/* Operations image 2 */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsOperationsImage2ModalOpen(true)}>
              <img
                src={operationsImage2}
                alt="Deck and cargo operations – production engineering"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            {/* Lifting image */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsLiftingImageModalOpen(true)}>
              <img
                src={liftingImage}
                alt="Lifting operation and lifting plan"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar — Lifting Plan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "HSE (Health, Safety, Environment)", pt: "Saúde, Segurança e Meio Ambiente" },
                { en: "risk assessment", pt: "análise de risco" },
                { en: "toolbox meeting", pt: "DDS (diálogo de segurança)" },
                { en: "JSA (Job Safety Analysis)", pt: "Análise de Segurança da Tarefa" },
                { en: "PTW (Permit to Work)", pt: "Permissão de Trabalho" },
                { en: "PPE", pt: "EPI" },
                { en: "LOTO (Lockout/Tagout)", pt: "Bloqueio e Etiquetagem" },
                { en: "near miss", pt: "quase-acidente" },
                { en: "incident", pt: "incidente" },
                { en: "hazard", pt: "perigo / risco" },
                { en: "safety culture", pt: "cultura de segurança" },
                { en: "emergency response", pt: "resposta a emergências" },
                { en: "muster station", pt: "ponto de reunião" },
                { en: "safe haven", pt: "abrigo seguro" },
                { en: "SIMOPS (Simultaneous Operations)", pt: "Operações Simultâneas" },
                { en: "hot work", pt: "trabalho a quente" },
                { en: "confined space entry", pt: "entrada em espaço confinado" },
                { en: "working at height", pt: "trabalho em altura" },
                { en: "dropped object prevention", pt: "prevenção de queda de objetos" },
                { en: "lifting operation", pt: "operação de içamento" },
                { en: "crane operation", pt: "operação de guindaste" },
                { en: "cargo operation", pt: "operação de carga" },
                { en: "lifting plan", pt: "plano de içamento" },
                { en: "load chart", pt: "tabela de carga" },
                { en: "SWL (Safe Working Load)", pt: "Carga Máxima de Trabalho Segura" },
                { en: "WLL (Working Load Limit)", pt: "Limite de Carga de Trabalho" },
                { en: "rigging", pt: "rigging (montagem de cabos)" },
                { en: "sling", pt: "linga / cabo de aço" },
                { en: "shackle", pt: "manilha" },
                { en: "hook", pt: "gancho" },
                { en: "banksman", pt: "banksman (sinaleiro)" },
                { en: "rigger", pt: "rigger (amarrador)" },
                { en: "tagline", pt: "tagline (cabo guia)" },
                { en: "exclusion zone", pt: "zona de exclusão" },
                { en: "center of gravity", pt: "centro de gravidade" },
                { en: "pre-lift meeting", pt: "reunião pré-içamento" },
              ].map((word, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <SpeakText text={word.en} className="text-blue-700 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {/* Vessel Parts Box */}
            <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200 mb-6">
              <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
                <Anchor size={18} /> VESSEL PARTS — PARTES DA EMBARCAÇÃO
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { en: "Bow — front of the vessel", pt: "Proa — frente da embarcação" },
                  { en: "Stern — back of the vessel", pt: "Popa — parte de trás" },
                  { en: "Port — left side", pt: "Bombordo — lado esquerdo" },
                  { en: "Starboard — right side", pt: "Estibordo — lado direito" },
                  { en: "Hull — the body of the vessel", pt: "Casco — corpo da embarcação" },
                  { en: "Main deck / weather deck", pt: "Convés principal / convés exposto" },
                  { en: "Superstructure", pt: "Superestrutura" },
                  { en: "Bridge — control room", pt: "Ponte — sala de controle" },
                  { en: "Engine room", pt: "Sala de máquinas" },
                  { en: "Accommodation block", pt: "Bloco de acomodações" },
                  { en: "Moonpool — opening in the hull", pt: "Moonpool — abertura no casco" },
                  { en: "Helideck — helicopter landing pad", pt: "Heliponto — pista de pouso de helicóptero" },
                  { en: "Forecastle — front deck area", pt: "Castelo de proa" },
                  { en: "Poop deck — rear deck area", pt: "Tombadilho" },
                  { en: "Bulwark — protective wall", pt: "Borda falsa — parede de proteção" },
                  { en: "Bollard — mooring post", pt: "Cabeço — poste de amarração" },
                  { en: "Fairlead — cable guide", pt: "Escovém — guia de cabo" },
                  { en: "Winch — lifting / pulling machine", pt: "Guincho" },
                  { en: "Pad eye — lifting point", pt: "Olhal de içamento" },
                  { en: "Gangway — boarding ramp", pt: "Prancha de embarque" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-blue-100">
                    <SpeakText text={item.en} className="text-blue-700 font-semibold cursor-pointer text-left w-full block">
                      {item.en}
                    </SpeakText>
                    <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                  </div>
                ))}
              </div>
            </div>

            {openDrills.operations && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {operationsSubstitution.map((ex) => {
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

        {/* ===================== SECTION 3 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('phrases')}
              className="inline-block rounded-full bg-white text-gray-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-gray-100"
            >
              {openDrills.phrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Practice common phrases about HSE, operations, and lifting plans" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases about HSE, operations, and lifting plans
            </SpeakSentence>
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
            {openDrills.phrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white text-blue-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-blue-100"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Present Perfect for experience, Present Simple for routines, and modal verbs for ability" className="text-md text-gray-600 mb-4 italic">
              📚 Present Perfect for experience, Present Simple for routines, and modal verbs for ability
            </SpeakSentence>

            {/* Secondary image */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={secondaryImage}
                alt="Grammar – Present Perfect and Present Simple"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            {/* Grammar explanation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-1">
                  <ShieldCheck size={16} /> Present Perfect
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>experiência</strong> (sem tempo específico).</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>have worked</strong> with cargo operations for 6 years.</p>
                <p className="text-xs text-gray-500">Eu trabalho com operações de carga há 6 anos.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <Wrench size={16} /> Present Simple
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>rotinas</strong> e <strong>responsabilidades</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>comply with</strong> HSE procedures every day.</p>
                <p className="text-xs text-gray-500">Eu cumpro os procedimentos de HSE todos os dias.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                <h3 className="font-bold text-blue-700 mb-2 flex items-center gap-1">
                  <Zap size={16} /> Modal Verbs
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use <strong>can</strong> para <strong>habilidade</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>can</strong> operate the deck crane.</p>
                <p className="text-xs text-gray-500">Eu consigo operar o guindaste de convés.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border border-gray-200">
              {[
                { en: "I have worked with cargo operations for more than 6 years.", pt: "Eu trabalho com operações de carga há mais de 6 anos." },
                { en: "I have completed several HSE training courses.", pt: "Eu concluí vários cursos de treinamento de HSE." },
                { en: "I check the lifting equipment every day.", pt: "Eu verifico os equipamentos de içamento todos os dias." },
                { en: "She reviews the lifting plan before the operation.", pt: "Ela revisa o plano de içamento antes da operação." },
                { en: "I can operate the deck crane and the winch.", pt: "Eu consigo operar o guindaste de convés e o guincho." },
                { en: "We hold a toolbox meeting before every task.", pt: "Nós realizamos um DDS antes de cada tarefa." },
                { en: "He has experience with SIMOPS on board.", pt: "Ele tem experiência com SIMOPS a bordo." },
                { en: "They report near misses to the supervisor.", pt: "Eles reportam quase-acidentes ao supervisor." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-l-4 border-blue-400">
                  <SpeakSentence text={item.en} className="text-blue-700 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 5 – INTERVIEW Q&A ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HardHat size={22} /> INTERVIEW QUESTIONS & ANSWERS
              </h2>
              <p className="text-sm text-blue-200 mt-1">Real questions about HSE, SIMOPS, lifting plans, and vessel parts</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-5 bg-gray-50">
            <p className="text-sm text-gray-600 italic mb-2">
              👂 Click on each question to hear it. Click "Ver resposta modelo" to see a sample answer. Then practice with your own words!
            </p>
            {interviewQA.map((qa, idx) => (
              <InterviewCard
                key={idx}
                index={idx + 1}
                question={qa.question}
                questionPt={qa.questionPt}
                answer={qa.answer}
                answerPt={qa.answerPt}
              />
            ))}
          </div>
        </div>

        {/* ===================== SECTION 6 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-blue-100">Practice real-life situations</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "My name is Paulo, and I am a production engineering student with offshore experience.", pt: "Meu nome é Paulo e sou estudante de engenharia de produção com experiência offshore." },
                    { en: "I have worked with cargo operations for 6 years.", pt: "Eu trabalho com operações de carga há 6 anos." },
                    { en: "Before any lift, we conduct a pre-lift meeting and review the lifting plan.", pt: "Antes de qualquer içamento, realizamos uma reunião pré-içamento e revisamos o plano de içamento." },
                    { en: "SIMOPS require careful coordination between all departments.", pt: "SIMOPS requer coordenação cuidadosa entre todos os departamentos." },
                    { en: "The banksman gives hand signals to the crane operator during the lift.", pt: "O banksman dá sinais manuais para o operador do guindaste durante o içamento." },
                    { en: "All personnel must wear PPE and comply with HSE procedures.", pt: "Todo o pessoal deve usar EPI e cumprir os procedimentos de HSE." },
                    { en: "The bow is the front of the vessel and the stern is the back.", pt: "A proa é a frente da embarcação e a popa é a parte de trás." },
                    { en: "The Safe Working Load must never be exceeded.", pt: "A Carga Máxima de Trabalho Segura nunca deve ser excedida." },
                    { en: "A dropped object can seriously injure or kill someone.", pt: "Um objeto que cai pode ferir gravemente ou matar alguém." },
                    { en: "Safety is always my top priority during any operation.", pt: "A segurança é sempre minha prioridade máxima durante qualquer operação." },
                  ].map((s, idx) => (
                    <div key={idx} className="group bg-white p-3 rounded-lg border-l-4 border-blue-400">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium text-gray-800">
                          {idx + 1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-5">🇧🇷 {s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={secondaryImage} alt="Operations" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Deck operations</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={mainImage} alt="Offshore vessel" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Offshore vessel</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={operationsImage2} alt="Lifting" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Lifting & cargo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-blue-100 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-800 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-blue-400">KEY EXPRESSIONS</h3>
              {[
                { en: "HSE stands for Health, Safety, and Environment.", pt: "HSE significa Saúde, Segurança e Meio Ambiente." },
                { en: "SIMOPS stands for Simultaneous Operations.", pt: "SIMOPS significa Operações Simultâneas." },
                { en: "Before any lift, we conduct a pre-lift meeting.", pt: "Antes de qualquer içamento, realizamos uma reunião pré-içamento." },
                { en: "The Safe Working Load must never be exceeded.", pt: "A Carga Máxima de Trabalho Segura nunca deve ser excedida." },
                { en: "The banksman gives hand signals to the crane operator.", pt: "O banksman dá sinais manuais ao operador do guindaste." },
                { en: "All personnel must comply with HSE procedures.", pt: "Todo o pessoal deve cumprir os procedimentos de HSE." },
                { en: "The bow is the front and the stern is the back.", pt: "A proa é a frente e a popa é a parte de trás." },
                { en: "Safety is always my top priority.", pt: "A segurança é sempre minha prioridade máxima." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm ml-4">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-600 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">💡 TIPS FOR YOUR INTERVIEW</h4>
                  <ul className="list-disc pl-5 space-y-2 text-blue-50">
                    <li>Use <strong className="text-white">Present Perfect</strong> (I have worked...) to talk about experience <em>without</em> a specific time.</li>
                    <li>Use <strong className="text-white">Present Simple</strong> (I comply, I inspect...) to describe routines and responsibilities.</li>
                    <li>Use <strong className="text-white">can</strong> and <strong className="text-white">have experience with</strong> to describe your skills.</li>
                    <li>Always mention <strong className="text-white">HSE procedures</strong> (PPE, PTW, toolbox meetings, risk assessments) — recruiters love this.</li>
                    <li>Show you understand <strong className="text-white">SIMOPS</strong> and <strong className="text-white">lifting plans</strong>.</li>
                    <li>Name <strong className="text-white">vessel parts</strong> (bow, stern, port, starboard, deck) correctly.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-blue-400">
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-blue-50">Speak slowly and clearly. Use the technical vocabulary you already know. The interviewer wants to see your experience with offshore operations and your safety mindset.</p>
                </div>
                <div className="pt-4 border-t border-blue-400">
                  <p className="text-blue-50 text-sm italic">
                    🌟 <strong>Substitute the words in blue</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (62)
          </button>
          <button onClick={() => router.push("/cursos/lesson64")} className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (64) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL IMAGEM SECUNDÁRIA ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={secondaryImage}
              alt="Grammar illustration – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Offshore operations – ampliada"
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

      {/* ===== MODAL IMAGEM OPERAÇÕES 1 ===== */}
      {isOperationsImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsOperationsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={operationsImage}
              alt="Operations – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsOperationsImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGEM OPERAÇÕES 2 ===== */}
      {isOperationsImage2ModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsOperationsImage2ModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={operationsImage2}
              alt="Deck and cargo operations – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsOperationsImage2ModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGEM LIFTING ===== */}
      {isLiftingImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsLiftingImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={liftingImage}
              alt="Lifting plan – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsLiftingImageModalOpen(false)}
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