"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Zap, Wrench, HardHat, ShieldCheck } from "lucide-react";

type SectionKey = 'verbs' | 'equipment' | 'phrases' | 'grammar';

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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-orange-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />}
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
      className={`group cursor-pointer hover:bg-orange-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
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
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-orange-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full hover:from-orange-600 hover:to-orange-800 transition-all duration-300">Salvar Anotação</button>
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
    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-orange-700 font-semibold block text-sm md:text-base">{exercise.original}</p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentTranslation && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
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
        <div className="mb-3 p-3 bg-orange-50 rounded-md border border-orange-100">
          <SpeakSentence text={currentSentence} className="text-orange-800 font-semibold" />
          {showTranslation && currentTranslation && (
            <p className="text-gray-600 text-sm mt-2 border-t border-orange-200 pt-2">🇧🇷 {currentTranslation}</p>
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
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
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
      return <span key={i} className="text-orange-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <button
        onClick={() => setShowTranslation(prev => !prev)}
        className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold mb-2"
      >
        {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
      </button>
      {showTranslation && (
        <p className="text-sm text-gray-600 border-t border-orange-100 pt-2">🇧🇷 {translation}</p>
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
    <div className="bg-white rounded-2xl border-2 border-orange-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wide mb-1">
              <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {index}
              </span>
              Interviewer
            </div>
            <SpeakSentence text={question} className="text-white font-semibold text-sm md:text-base">
              {question}
            </SpeakSentence>
            <p className="text-orange-200 text-xs mt-1 italic">🇧🇷 {questionPt}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={() => setShowAnswer(prev => !prev)}
          className="mb-3 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full text-sm font-bold hover:from-orange-600 hover:to-orange-700 transition-all shadow-sm"
        >
          {showAnswer ? "🙈 Ocultar resposta modelo" : "👁️ Ver resposta modelo"}
        </button>

        {showAnswer && (
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="flex items-center gap-2 text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
              <HardHat size={14} className="text-orange-600" />
              Candidate
            </div>
            <SpeakSentence text={answer} className="text-gray-800 leading-relaxed text-sm md:text-base">
              {answer}
            </SpeakSentence>
            <button
              onClick={() => setShowTranslation(prev => !prev)}
              className="mt-3 text-xs px-2 py-1 rounded-full bg-orange-200 text-orange-800 hover:bg-orange-300 transition-colors font-bold"
            >
              {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
            </button>
            {showTranslation && (
              <p className="text-gray-600 text-sm mt-2 border-t border-orange-200 pt-2">🇧🇷 {answerPt}</p>
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
export default function LessonOffshoreElectricianInterview() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    equipment: false,
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
  const [isEquipmentImageModalOpen, setIsEquipmentImageModalOpen] = useState(false);

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
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/el%C3%A9trica1.png?raw=true";
  const secondaryImage = "https://github.com/Sullivan-code/english-audios/blob/main/EL%C3%89TRICA2.png?raw=true";
  const equipmentImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2016%20de%20set.%20de%202026%2C%2010_09_22.png?raw=true";

  // ============================================================
  // VERBS – ELECTRICAL / OFFSHORE
  // ============================================================
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu inspeciono sistemas elétricos. / ele / nós",
      options: [
        { label: "Eu", replacement: "I inspect electrical systems.", translation: "Eu inspeciono sistemas elétricos." },
        { label: "Ele", replacement: "He inspects electrical systems.", translation: "Ele inspeciona sistemas elétricos." },
        { label: "Nós", replacement: "We inspect electrical systems.", translation: "Nós inspecionamos sistemas elétricos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu faço manutenção em geradores. / ela / eles",
      options: [
        { label: "Eu", replacement: "I maintain generators.", translation: "Eu faço manutenção em geradores." },
        { label: "Ela", replacement: "She maintains generators.", translation: "Ela faz manutenção em geradores." },
        { label: "Eles", replacement: "They maintain generators.", translation: "Eles fazem manutenção em geradores." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu soluciono falhas elétricas. / ele / vocês",
      options: [
        { label: "Eu", replacement: "I troubleshoot electrical faults.", translation: "Eu soluciono falhas elétricas." },
        { label: "Ele", replacement: "He troubleshoots electrical faults.", translation: "Ele soluciona falhas elétricas." },
        { label: "Vocês", replacement: "You troubleshoot electrical faults.", translation: "Vocês solucionam falhas elétricas." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu testei o disjuntor ontem. / ela / nós",
      options: [
        { label: "Eu", replacement: "I tested the circuit breaker yesterday.", translation: "Eu testei o disjuntor ontem." },
        { label: "Ela", replacement: "She tested the circuit breaker yesterday.", translation: "Ela testou o disjuntor ontem." },
        { label: "Nós", replacement: "We tested the circuit breaker yesterday.", translation: "Nós testamos o disjuntor ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu substituí o cabo danificado. / ele / eles",
      options: [
        { label: "Eu", replacement: "I replaced the damaged cable.", translation: "Eu substituí o cabo danificado." },
        { label: "Ele", replacement: "He replaced the damaged cable.", translation: "Ele substituiu o cabo danificado." },
        { label: "Eles", replacement: "They replaced the damaged cable.", translation: "Eles substituíram o cabo danificado." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu tenho trabalhado offshore por 10 anos. / ele / nós",
      options: [
        { label: "Eu", replacement: "I have worked offshore for 10 years.", translation: "Eu tenho trabalhado offshore por 10 anos." },
        { label: "Ele", replacement: "He has worked offshore for 10 years.", translation: "Ele tem trabalhado offshore por 10 anos." },
        { label: "Nós", replacement: "We have worked offshore for 10 years.", translation: "Nós temos trabalhado offshore por 10 anos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu monitoro o desempenho do sistema. / ela / eles",
      options: [
        { label: "Eu", replacement: "I monitor the system performance.", translation: "Eu monitoro o desempenho do sistema." },
        { label: "Ela", replacement: "She monitors the system performance.", translation: "Ela monitora o desempenho do sistema." },
        { label: "Eles", replacement: "They monitor the system performance.", translation: "Eles monitoram o desempenho do sistema." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu sigo todos os procedimentos de segurança. / ele / nós",
      options: [
        { label: "Eu", replacement: "I follow all safety procedures.", translation: "Eu sigo todos os procedimentos de segurança." },
        { label: "Ele", replacement: "He follows all safety procedures.", translation: "Ele segue todos os procedimentos de segurança." },
        { label: "Nós", replacement: "We follow all safety procedures.", translation: "Nós seguimos todos os procedimentos de segurança." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // EQUIPMENT / TOOLS
  // ============================================================
  const equipmentSubstitution: SubstitutionExercise[] = [
    {
      key: "eq-1",
      original: "Eu uso um multímetro todos os dias. / alicate amperímetro / testador de tensão",
      options: [
        { label: "multímetro", replacement: "I use a multimeter every day.", translation: "Eu uso um multímetro todos os dias." },
        { label: "alicate amperímetro", replacement: "I use a clamp meter every day.", translation: "Eu uso um alicate amperímetro todos os dias." },
        { label: "testador de tensão", replacement: "I use a voltage tester every day.", translation: "Eu uso um testador de tensão todos os dias." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-2",
      original: "O gerador está funcionando normalmente. / painel elétrico / transformador",
      options: [
        { label: "gerador", replacement: "The generator is operating normally.", translation: "O gerador está operando normalmente." },
        { label: "painel elétrico", replacement: "The electrical panel is operating normally.", translation: "O painel elétrico está operando normalmente." },
        { label: "transformador", replacement: "The transformer is operating normally.", translation: "O transformador está operando normalmente." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-3",
      original: "Ela testa disjuntores regularmente. / painéis elétricos / motores",
      options: [
        { label: "disjuntores", replacement: "She tests circuit breakers regularly.", translation: "Ela testa disjuntores regularmente." },
        { label: "painéis elétricos", replacement: "She tests electrical panels regularly.", translation: "Ela testa painéis elétricos regularmente." },
        { label: "motores", replacement: "She tests motors regularly.", translation: "Ela testa motores regularmente." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-4",
      original: "Eu trabalho com sistemas de Posicionamento Dinâmico (DP). / PMS / AMS",
      options: [
        { label: "DP", replacement: "I work with Dynamic Positioning systems.", translation: "Eu trabalho com sistemas de Posicionamento Dinâmico." },
        { label: "PMS", replacement: "I work with Power Management Systems.", translation: "Eu trabalho com Sistemas de Gerenciamento de Energia." },
        { label: "AMS", replacement: "I work with Alarm Management Systems.", translation: "Eu trabalho com Sistemas de Gerenciamento de Alarmes." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-5",
      original: "Nós substituímos cabos danificados. / disjuntores / componentes defeituosos",
      options: [
        { label: "cabos danificados", replacement: "We replace damaged cables.", translation: "Nós substituímos cabos danificados." },
        { label: "disjuntores", replacement: "We replace circuit breakers.", translation: "Nós substituímos disjuntores." },
        { label: "componentes defeituosos", replacement: "We replace faulty components.", translation: "Nós substituímos componentes defeituosos." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-6",
      original: "Tem um multímetro na oficina? / megômetro / câmera termográfica",
      options: [
        { label: "multímetro", replacement: "Is there a multimeter in the workshop?", translation: "Tem um multímetro na oficina?" },
        { label: "megômetro", replacement: "Is there an insulation resistance tester in the workshop?", translation: "Tem um megômetro na oficina?" },
        { label: "câmera termográfica", replacement: "Is there a thermal camera in the workshop?", translation: "Tem uma câmera termográfica na oficina?" }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-7",
      original: "Precisamos inspecionar o quadro de distribuição. / painel de controle / sistema UPS",
      options: [
        { label: "quadro de distribuição", replacement: "We need to inspect the distribution panel.", translation: "Precisamos inspecionar o quadro de distribuição." },
        { label: "painel de controle", replacement: "We need to inspect the control panel.", translation: "Precisamos inspecionar o painel de controle." },
        { label: "sistema UPS", replacement: "We need to inspect the UPS system.", translation: "Precisamos inspecionar o sistema UPS." }
      ],
      currentIndex: 0,
    },
    {
      key: "eq-8",
      original: "O sistema de baterias está com falha. / alarme / emergência",
      options: [
        { label: "baterias", replacement: "The battery system has a fault.", translation: "O sistema de baterias está com falha." },
        { label: "alarme", replacement: "The alarm system has a fault.", translation: "O sistema de alarme está com falha." },
        { label: "emergência", replacement: "The emergency system has a fault.", translation: "O sistema de emergência está com falha." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // SPEAK LIKE A NATIVE – INTERVIEW PHRASES
  // ============================================================
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "ph-1",
      original: "Eu tenho experiência com geradores. / painéis elétricos / motores",
      options: [
        { label: "geradores", replacement: "I have experience with generators.", translation: "Eu tenho experiência com geradores." },
        { label: "painéis elétricos", replacement: "I have experience with electrical panels.", translation: "Eu tenho experiência com painéis elétricos." },
        { label: "motores", replacement: "I have experience with motors.", translation: "Eu tenho experiência com motores." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-2",
      original: "Eu sigo procedimentos de segurança. / uso EPI / faço análises de risco",
      options: [
        { label: "sigo procedimentos", replacement: "I follow safety procedures.", translation: "Eu sigo procedimentos de segurança." },
        { label: "uso EPI", replacement: "I wear the required PPE.", translation: "Eu uso os EPIs necessários." },
        { label: "faço análises", replacement: "I perform risk assessments.", translation: "Eu faço análises de risco." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-3",
      original: "Eu trabalho bem em equipe. / sob pressão / em turnos",
      options: [
        { label: "em equipe", replacement: "I work well in a team.", translation: "Eu trabalho bem em equipe." },
        { label: "sob pressão", replacement: "I work well under pressure.", translation: "Eu trabalho bem sob pressão." },
        { label: "em turnos", replacement: "I work well in shifts.", translation: "Eu trabalho bem em turnos." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-4",
      original: "Eu posso ler diagramas elétricos. / plantas técnicas / P&IDs",
      options: [
        { label: "diagramas elétricos", replacement: "I can read electrical diagrams.", translation: "Eu consigo ler diagramas elétricos." },
        { label: "plantas técnicas", replacement: "I can read blueprints.", translation: "Eu consigo ler plantas técnicas." },
        { label: "P&IDs", replacement: "I can read P&IDs.", translation: "Eu consigo ler P&IDs." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-5",
      original: "Segurança vem em primeiro lugar. / Qualidade / Trabalho em equipe",
      options: [
        { label: "Segurança", replacement: "Safety comes first.", translation: "Segurança vem em primeiro lugar." },
        { label: "Qualidade", replacement: "Quality comes first.", translation: "Qualidade vem em primeiro lugar." },
        { label: "Trabalho em equipe", replacement: "Teamwork comes first.", translation: "Trabalho em equipe vem em primeiro lugar." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-6",
      original: "Eu me mantenho calmo sob pressão. / focado / organizado",
      options: [
        { label: "calmo", replacement: "I stay calm under pressure.", translation: "Eu me mantenho calmo sob pressão." },
        { label: "focado", replacement: "I stay focused under pressure.", translation: "Eu me mantenho focado sob pressão." },
        { label: "organizado", replacement: "I stay organized under pressure.", translation: "Eu me mantenho organizado sob pressão." }
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
      original: "Eu já trabalhei offshore antes. / ele / nós",
      options: [
        { label: "Eu", replacement: "I have worked offshore before.", translation: "Eu já trabalhei offshore antes." },
        { label: "Ele", replacement: "He has worked offshore before.", translation: "Ele já trabalhou offshore antes." },
        { label: "Nós", replacement: "We have worked offshore before.", translation: "Nós já trabalhamos offshore antes." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-2",
      original: "Você já trabalhou com geradores? / sistemas de DP / painéis elétricos",
      options: [
        { label: "geradores", replacement: "Have you worked with generators?", translation: "Você já trabalhou com geradores?" },
        { label: "sistemas de DP", replacement: "Have you worked with DP systems?", translation: "Você já trabalhou com sistemas de DP?" },
        { label: "painéis elétricos", replacement: "Have you worked with electrical panels?", translation: "Você já trabalhou com painéis elétricos?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-3",
      original: "Eu trabalho offshore há 10 anos. / 5 anos / 15 anos",
      options: [
        { label: "10 anos", replacement: "I have worked offshore for 10 years.", translation: "Eu trabalho offshore há 10 anos." },
        { label: "5 anos", replacement: "I have worked offshore for 5 years.", translation: "Eu trabalho offshore há 5 anos." },
        { label: "15 anos", replacement: "I have worked offshore for 15 years.", translation: "Eu trabalho offshore há 15 anos." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-4",
      original: "Ele concluiu o treinamento de segurança. / ela / eles",
      options: [
        { label: "Ele", replacement: "He has completed the safety training.", translation: "Ele concluiu o treinamento de segurança." },
        { label: "Ela", replacement: "She has completed the safety training.", translation: "Ela concluiu o treinamento de segurança." },
        { label: "Eles", replacement: "They have completed the safety training.", translation: "Eles concluíram o treinamento de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-5",
      original: "Eu faço manutenção preventiva. / corretiva / inspeções diárias",
      options: [
        { label: "preventiva", replacement: "I perform preventive maintenance.", translation: "Eu realizo manutenção preventiva." },
        { label: "corretiva", replacement: "I perform corrective maintenance.", translation: "Eu realizo manutenção corretiva." },
        { label: "inspeções", replacement: "I perform daily inspections.", translation: "Eu realizo inspeções diárias." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-6",
      original: "Você consegue solucionar falhas elétricas? / ler diagramas / operar o PMS",
      options: [
        { label: "solucionar falhas", replacement: "Can you troubleshoot electrical faults?", translation: "Você consegue solucionar falhas elétricas?" },
        { label: "ler diagramas", replacement: "Can you read electrical diagrams?", translation: "Você consegue ler diagramas elétricos?" },
        { label: "operar o PMS", replacement: "Can you operate the PMS?", translation: "Você consegue operar o PMS?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-7",
      original: "Eu preciso usar EPI nesta área. / permissão de trabalho / bloqueio e etiquetagem",
      options: [
        { label: "EPI", replacement: "I need to wear PPE in this area.", translation: "Eu preciso usar EPI nesta área." },
        { label: "permissão de trabalho", replacement: "I need a permit-to-work in this area.", translation: "Eu preciso de uma permissão de trabalho nesta área." },
        { label: "bloqueio e etiquetagem", replacement: "I need to apply lockout/tagout in this area.", translation: "Eu preciso aplicar bloqueio e etiquetagem nesta área." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-8",
      original: "Existe um procedimento de segurança para isso? / risco / bloqueio",
      options: [
        { label: "procedimento", replacement: "Is there a safety procedure for this?", translation: "Existe um procedimento de segurança para isso?" },
        { label: "risco", replacement: "Is there a risk assessment for this?", translation: "Existe uma análise de risco para isso?" },
        { label: "bloqueio", replacement: "Is there a lockout/tagout procedure for this?", translation: "Existe um procedimento de bloqueio e etiquetagem para isso?" }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...equipmentSubstitution,
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
      answer: "Good morning. My name is Paulo, and I am an offshore electrician with 12 years of experience in the oil and gas industry. During my career, I have worked on offshore vessels, drilling rigs, and production units. I have experience maintaining and troubleshooting electrical systems, including generators, switchboards, and DP systems. I am responsible, safety-oriented, and I enjoy working as a team.",
      answerPt: "Bom dia. Meu nome é Paulo e sou eletricista offshore com 12 anos de experiência na indústria de óleo e gás. Durante minha carreira, trabalhei em embarcações offshore, sondas de perfuração e unidades de produção. Tenho experiência em manutenção e solução de problemas em sistemas elétricos, incluindo geradores, quadros de distribuição e sistemas de DP. Sou responsável, focado em segurança e gosto de trabalhar em equipe."
    },
    {
      question: "What are your main responsibilities on board?",
      questionPt: "Quais são suas principais responsabilidades a bordo?",
      answer: "My main responsibilities include inspecting electrical systems, performing preventive and corrective maintenance, troubleshooting electrical faults, repairing equipment, and ensuring that all electrical systems operate safely and efficiently. I also complete maintenance reports and follow all safety procedures.",
      answerPt: "Minhas principais responsabilidades incluem inspecionar sistemas elétricos, realizar manutenção preventiva e corretiva, diagnosticar falhas elétricas, reparar equipamentos e garantir que todos os sistemas elétricos funcionem de forma segura e eficiente. Também preencho relatórios de manutenção e sigo todos os procedimentos de segurança."
    },
    {
      question: "What types of equipment do you usually work with?",
      questionPt: "Com quais tipos de equipamentos você costuma trabalhar?",
      answer: "I usually work with generators, electrical panels, switchboards, transformers, motors, circuit breakers, UPS systems, batteries, navigation systems, Dynamic Positioning systems, alarm systems, and emergency electrical equipment.",
      answerPt: "Normalmente trabalho com geradores, painéis elétricos, quadros de distribuição, transformadores, motores, disjuntores, sistemas UPS, baterias, sistemas de navegação, sistemas de Posicionamento Dinâmico, sistemas de alarme e equipamentos elétricos de emergência."
    },
    {
      question: "Do you have experience with Dynamic Positioning (DP) systems?",
      questionPt: "Você tem experiência com sistemas de Posicionamento Dinâmico (DP)?",
      answer: "Yes, I do. I have experience working with Dynamic Positioning systems during offshore operations. My role includes inspecting electrical components, supporting maintenance activities, checking alarms, and ensuring that the systems are operating properly and safely.",
      answerPt: "Sim, tenho. Tenho experiência trabalhando com sistemas de Posicionamento Dinâmico durante operações offshore. Minha função inclui inspecionar componentes elétricos, dar suporte às atividades de manutenção, verificar alarmes e garantir que os sistemas estejam funcionando corretamente e com segurança."
    },
    {
      question: "How do you ensure safety while working?",
      questionPt: "Como você garante a segurança durante o trabalho?",
      answer: "Safety is always my top priority. I strictly follow permit-to-work procedures, lockout/tagout requirements, risk assessments, and company safety policies. I also wear the required PPE at all times and make sure the area is safe before starting any task.",
      answerPt: "A segurança é sempre minha prioridade. Eu sigo rigorosamente os procedimentos de permissão de trabalho, bloqueio e etiquetagem, análises de risco e políticas de segurança da empresa. Também uso os EPIs necessários o tempo todo e garanto que a área esteja segura antes de iniciar qualquer tarefa."
    },
    {
      question: "Can you describe a difficult electrical problem you solved?",
      questionPt: "Você pode descrever um problema elétrico difícil que resolveu?",
      answer: "While working offshore, we experienced intermittent failures in a generator control system. After analyzing alarms and electrical diagrams, I identified a faulty module in the control panel. After replacing the component, the system returned to normal operation.",
      answerPt: "Enquanto trabalhava offshore, tivemos falhas intermitentes em um sistema de controle de gerador. Após analisar alarmes e diagramas elétricos, identifiquei um módulo defeituoso no painel de controle. Após substituir o componente, o sistema voltou à operação normal."
    },
    {
      question: "Are you familiar with electrical diagrams and blueprints?",
      questionPt: "Você está familiarizado com diagramas elétricos e plantas?",
      answer: "Yes. I regularly work with electrical schematics, single-line diagrams, P&IDs, and technical documentation to troubleshoot problems and perform maintenance safely.",
      answerPt: "Sim. Trabalho regularmente com esquemas elétricos, diagramas unifilares, P&IDs e documentação técnica para solucionar problemas e executar manutenções com segurança."
    },
    {
      question: "How do you handle working under pressure?",
      questionPt: "Como você lida com trabalho sob pressão?",
      answer: "I stay calm and focused. I prioritize safety, communicate clearly with the team, and follow procedures to resolve issues efficiently.",
      answerPt: "Eu mantenho a calma e o foco. Priorizo a segurança, me comunico claramente com a equipe e sigo os procedimentos para resolver os problemas de forma eficiente."
    },
    {
      question: "Why do you want to work for our company?",
      questionPt: "Por que você quer trabalhar em nossa empresa?",
      answer: "Your company is known for its commitment to safety, operational excellence, and professional development. I believe my experience can add value to your team, and I would like to continue developing my offshore career here.",
      answerPt: "Sua empresa é conhecida por seu compromisso com a segurança, excelência operacional e desenvolvimento profissional. Acredito que minha experiência pode agregar valor à equipe e gostaria de continuar desenvolvendo minha carreira offshore aqui."
    },
    {
      question: "Do you have any questions for us?",
      questionPt: "Você tem alguma pergunta para nós?",
      answer: "Yes, I do. Could you tell me more about the rotation schedule, training opportunities, and career development programs available within the company?",
      answerPt: "Sim. Você poderia me falar mais sobre a escala de embarque, oportunidades de treinamento e programas de desenvolvimento de carreira disponíveis na empresa?"
    },
  ];

  // ============================================================
  // SPEAK LIKE A NATIVE DATA
  // ============================================================
  const usefulPhrasesData = [
    {
      en: "I have extensive experience with electrical systems on offshore vessels.",
      pt: "Tenho ampla experiência com sistemas elétricos em embarcações offshore.",
      green: ["extensive", "electrical", "offshore"]
    },
    {
      en: "I always follow permit-to-work and lockout/tagout procedures.",
      pt: "Eu sempre sigo os procedimentos de permissão de trabalho e bloqueio/etiquetagem.",
      green: ["permit-to-work", "lockout/tagout", "procedures"]
    },
    {
      en: "My main responsibilities include preventive and corrective maintenance.",
      pt: "Minhas principais responsabilidades incluem manutenção preventiva e corretiva.",
      green: ["responsibilities", "preventive", "corrective"]
    },
    {
      en: "I stay calm and focused when I work under pressure.",
      pt: "Eu mantenho a calma e o foco quando trabalho sob pressão.",
      green: ["calm", "focused", "pressure"]
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
      <div className="max-w-5xl mx-auto bg-[#faf6f0] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Zap size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">Offshore English • B1–B2</span>
            <Zap size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            ⚡ Offshore Electrician Interview
          </h1>
          <SpeakSentence text="Prepare for an offshore electrician job interview. Learn the vocabulary, equipment, and answers that recruiters expect from you." className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🛠️ Prepare for an offshore electrician job interview. Learn the vocabulary, equipment, and answers that recruiters expect from you.
          </SpeakSentence>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="Offshore electrician"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Wrench size={22} /> VERBS
              </h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
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
                { en: "to inspect", pt: "inspecionar" },
                { en: "to troubleshoot", pt: "solucionar falhas / diagnosticar" },
                { en: "to maintain", pt: "fazer manutenção" },
                { en: "to repair", pt: "reparar / consertar" },
                { en: "to test", pt: "testar" },
                { en: "to replace", pt: "substituir" },
                { en: "to monitor", pt: "monitorar" },
                { en: "to ensure", pt: "garantir / assegurar" },
                { en: "to follow", pt: "seguir" },
                { en: "to comply with", pt: "cumprir / estar em conformidade" },
                { en: "to perform", pt: "realizar / executar" },
                { en: "to check", pt: "verificar" },
              ].map((word, idx) => (
                <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-orange-700 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>
            {openDrills.verbs && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 2 – EQUIPMENT & TOOLS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap size={22} /> EQUIPMENT & TOOLS
              </h2>
              <PencilIcon onClick={() => openNoteModal('Equipment & Tools')} />
            </div>
            <button
              onClick={() => toggleDrill('equipment')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.equipment ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>

            {/* Equipment image */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsEquipmentImageModalOpen(true)}>
              <img
                src={equipmentImage}
                alt="Offshore electrical equipment"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "generator", pt: "gerador" },
                { en: "electrical panel", pt: "painel elétrico" },
                { en: "switchboard", pt: "quadro de distribuição" },
                { en: "transformer", pt: "transformador" },
                { en: "circuit breaker", pt: "disjuntor" },
                { en: "motor", pt: "motor" },
                { en: "UPS system", pt: "sistema UPS (energia ininterrupta)" },
                { en: "battery", pt: "bateria" },
                { en: "multimeter", pt: "multímetro" },
                { en: "insulation resistance tester", pt: "megômetro" },
                { en: "clamp meter", pt: "alicate amperímetro" },
                { en: "voltage tester", pt: "testador de tensão" },
                { en: "thermal camera", pt: "câmera termográfica" },
                { en: "DP system", pt: "sistema de Posicionamento Dinâmico" },
                { en: "PMS", pt: "Sistema de Gerenciamento de Energia" },
                { en: "AMS", pt: "Sistema de Gerenciamento de Alarmes" },
                { en: "PPE", pt: "EPI (Equipamento de Proteção Individual)" },
                { en: "permit-to-work", pt: "permissão de trabalho" },
                { en: "lockout/tagout", pt: "bloqueio e etiquetagem" },
                { en: "electrical diagram", pt: "diagrama elétrico" },
                { en: "blueprint", pt: "planta técnica" },
              ].map((word, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors">
                  <SpeakText text={word.en} className="text-orange-700 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.equipment && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {equipmentSubstitution.map((ex) => {
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <SpeakSentence text="Practice common interview phrases for offshore electricians" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common interview phrases for offshore electricians
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
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
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
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <h3 className="font-bold text-orange-700 mb-2 flex items-center gap-1">
                  <ShieldCheck size={16} /> Present Perfect
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>experiência</strong> (sem tempo específico).</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>have worked</strong> offshore for 10 years.</p>
                <p className="text-xs text-gray-500">Eu trabalho offshore há 10 anos.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-1">
                  <Wrench size={16} /> Present Simple
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>rotinas</strong> e <strong>responsabilidades</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>inspect</strong> electrical systems every day.</p>
                <p className="text-xs text-gray-500">Eu inspeciono sistemas elétricos todos os dias.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <h3 className="font-bold text-orange-700 mb-2 flex items-center gap-1">
                  <Zap size={16} /> Modal Verbs
                </h3>
                <p className="text-sm text-gray-700 mb-2">Use <strong>can</strong> para <strong>habilidade</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>can</strong> read electrical diagrams.</p>
                <p className="text-xs text-gray-500">Eu consigo ler diagramas elétricos.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border border-gray-200">
              {[
                { en: "I have worked offshore for more than 12 years.", pt: "Eu trabalho offshore há mais de 12 anos." },
                { en: "I have completed several safety training courses.", pt: "Eu concluí vários cursos de treinamento de segurança." },
                { en: "I inspect electrical systems every day.", pt: "Eu inspeciono sistemas elétricos todos os dias." },
                { en: "She troubleshoots electrical faults on the vessel.", pt: "Ela soluciona falhas elétricas na embarcação." },
                { en: "I can read electrical schematics and P&IDs.", pt: "Eu consigo ler esquemas elétricos e P&IDs." },
                { en: "We follow all safety procedures on board.", pt: "Nós seguimos todos os procedimentos de segurança a bordo." },
                { en: "He has experience with Dynamic Positioning systems.", pt: "Ele tem experiência com sistemas de Posicionamento Dinâmico." },
                { en: "They perform preventive maintenance regularly.", pt: "Eles realizam manutenção preventiva regularmente." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-l-4 border-orange-400">
                  <SpeakSentence text={item.en} className="text-orange-700 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <HardHat size={22} /> INTERVIEW QUESTIONS & ANSWERS
              </h2>
              <p className="text-sm text-orange-200 mt-1">Real questions recruiters ask offshore electricians</p>
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-orange-100">Practice real-life situations</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="bg-orange-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "My name is Paulo, and I am an offshore electrician with 12 years of experience.", pt: "Meu nome é Paulo e sou eletricista offshore com 12 anos de experiência." },
                    { en: "I perform maintenance on electrical systems and troubleshoot equipment failures.", pt: "Eu realizo manutenção em sistemas elétricos e soluciono falhas em equipamentos." },
                    { en: "I follow all safety procedures and use the required PPE.", pt: "Eu sigo todos os procedimentos de segurança e uso os EPIs necessários." },
                    { en: "I have experience with generators, DP systems, motors, and switchboards.", pt: "Tenho experiência com geradores, sistemas de DP, motores e quadros de distribuição." },
                    { en: "I stay calm and focused when I work under pressure.", pt: "Eu me mantenho calmo e focado quando trabalho sob pressão." },
                    { en: "I regularly work with electrical schematics, single-line diagrams, and P&IDs.", pt: "Trabalho regularmente com esquemas elétricos, diagramas unifilares e P&IDs." },
                    { en: "While working offshore, we experienced intermittent failures in a generator control system.", pt: "Enquanto trabalhávamos offshore, tivemos falhas intermitentes em um sistema de controle de gerador." },
                    { en: "I would respectfully remind the coworker about the safety requirements.", pt: "Eu lembraria respeitosamente o colega sobre os requisitos de segurança." },
                    { en: "Could you tell me more about the rotation schedule and training opportunities?", pt: "Você poderia me falar mais sobre a escala de embarque e oportunidades de treinamento?" },
                    { en: "Safety is always my top priority on board.", pt: "A segurança é sempre minha prioridade máxima a bordo." },
                  ].map((s, idx) => (
                    <div key={idx} className="group bg-white p-3 rounded-lg border-l-4 border-orange-400">
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
                      <img src={secondaryImage} alt="Offshore electrical work" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Offshore electrical maintenance</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={mainImage} alt="Safety first" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Safety first on board</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={equipmentImage} alt="Electrical equipment" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Electrical equipment & tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-orange-100 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-800 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-orange-400">KEY EXPRESSIONS</h3>
              {[
                { en: "I have worked offshore for 12 years.", pt: "Eu trabalho offshore há 12 anos." },
                { en: "I perform preventive and corrective maintenance.", pt: "Eu realizo manutenção preventiva e corretiva." },
                { en: "Safety is always my top priority.", pt: "A segurança é sempre minha prioridade máxima." },
                { en: "I have experience with DP systems.", pt: "Tenho experiência com sistemas de DP." },
                { en: "I can read electrical schematics and P&IDs.", pt: "Eu consigo ler esquemas elétricos e P&IDs." },
                { en: "I stay calm and focused under pressure.", pt: "Eu me mantenho calmo e focado sob pressão." },
                { en: "Your company is known for operational excellence.", pt: "Sua empresa é conhecida pela excelência operacional." },
                { en: "Could you tell me more about the rotation schedule?", pt: "Você poderia me falar mais sobre a escala de embarque?" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-orange-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-orange-200 text-sm ml-4">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-orange-600 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">💡 TIPS FOR YOUR INTERVIEW</h4>
                  <ul className="list-disc pl-5 space-y-2 text-orange-50">
                    <li>Use <strong className="text-white">Present Perfect</strong> (I have worked...) to talk about experience <em>without</em> a specific time.</li>
                    <li>Use <strong className="text-white">Present Simple</strong> (I inspect, I maintain...) to describe routines and responsibilities.</li>
                    <li>Use <strong className="text-white">can</strong> and <strong className="text-white">have experience with</strong> to describe your skills.</li>
                    <li>Always mention <strong className="text-white">safety procedures</strong> (PPE, permit-to-work, lockout/tagout) — recruiters love this.</li>
                    <li>Give a <strong className="text-white">short example</strong> when describing a difficult problem you solved.</li>
                    <li>Ask <strong className="text-white">smart questions</strong> at the end (rotation, training, career growth).</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-orange-400">
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-orange-50">Speak slowly and clearly. Use the technical vocabulary you already know. The interviewer wants to see your experience and your safety mindset.</p>
                </div>
                <div className="pt-4 border-t border-orange-400">
                  <p className="text-orange-50 text-sm italic">
                    🌟 <strong>Substitute the words in orange</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson60")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (60)
          </button>
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (62) &rarr;
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
              alt="Offshore electrician – ampliada"
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

      {/* ===== MODAL IMAGEM EQUIPAMENTOS ===== */}
      {isEquipmentImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsEquipmentImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={equipmentImage}
              alt="Electrical equipment – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsEquipmentImageModalOpen(false)}
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