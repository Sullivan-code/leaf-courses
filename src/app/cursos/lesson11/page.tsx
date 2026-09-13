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

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
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

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Clique para ouvir a pronúncia americana"
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
        if (speechText && typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = 'en-US';
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          const voices = window.speechSynthesis.getVoices();
          const americanFemaleVoices = voices.filter(voice =>
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
            (voice.name.toLowerCase().includes('samantha') ||
             voice.name.toLowerCase().includes('google us english') ||
             voice.name === 'Google US English')
          );
          const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
          if (americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          } else if (americanVoices.length > 0) {
            utterance.voice = americanVoices[0];
          }
          window.speechSynthesis.speak(utterance);
        }
      }}
      className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// ============================================
// SPEAK PORTUGUESE – apenas para instruções
// ============================================
const SpeakPortuguese = ({ text, children, className = "" }: { text: string; children?: React.ReactNode; className?: string }) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const ptBrVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR');
    const anyPtVoice = voices.find(v => v.lang.toLowerCase().startsWith('pt'));
    if (ptBrVoice) utterance.voice = ptBrVoice;
    else if (anyPtVoice) utterance.voice = anyPtVoice;
    window.speechSynthesis.speak(utterance);
  };
  return (
    <button
      onClick={speak}
      className={`group inline-flex items-center gap-2 cursor-pointer hover:bg-blue-100/40 px-2 py-1 rounded-lg transition-colors text-left ${className}`}
      title="Clique para ouvir a instrução em português"
    >
      <span>{children || text}</span>
      <Volume2 size={16} className="opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0" />
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
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
type OptionType = string | { label: string; replacement: string; speak?: string };

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

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; speak?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => setShowEnglish(prev => !prev);

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.label;
    return String(opt);
  };

  const getOptionSpeakText = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.speak || opt.label;
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
          <SpeakSentence text={currentSentence} className="text-blue-700 font-medium" />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onOptionClick(exercise.key, index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <SpeakText text={getOptionSpeakText(option)} showIcon={false}>
              {getOptionLabel(option)}
            </SpeakText>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HighlightedPhrase
// ============================================
function HighlightedPhrase({ text, blueWords, translation }: { text: string; blueWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (blueWords.some(bw => cleanWord.toLowerCase() === bw.toLowerCase())) {
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
// MakeItYoursPhrase
// ============================================
function MakeItYoursPhrase({
  text,
  translation,
  blueWords,
}: {
  text: string;
  translation: string;
  blueWords: string[];
}) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    if (blueWords.some(bw => cleanWord === bw.toLowerCase())) {
      return (
        <span
          key={i}
          className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 hover:bg-blue-50 rounded px-0.5 transition-colors"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(word.replace(/[.,!?;:]/g, ''));
              utterance.lang = 'en-US';
              utterance.rate = 0.9;
              utterance.pitch = 1.0;
              const voices = window.speechSynthesis.getVoices();
              const female = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Female')));
              const anyUS = voices.find(v => v.lang.startsWith('en-US'));
              if (female) utterance.voice = female;
              else if (anyUS) utterance.voice = anyUS;
              window.speechSynthesis.speak(utterance);
            }
          }}
        >
          {word}
        </span>
      );
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="group">
      <div className="flex items-start">
        <SpeakSentence text={text} className="text-base font-medium">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600 mt-0.5 ml-6">{translation}</p>
    </div>
  );
}

// ============================================
// WrapUpHorizontal
// ============================================
function WrapUpHorizontal() {
  const items1 = [
    { label: "to go to the U.S.A.", speak: "to go to the U.S.A." },
    { label: "to study in the U.S.A.", speak: "to study in the U.S.A." },
  ];
  const items2 = [
    { label: "at work", speak: "at work" },
    { label: "at home", speak: "at home" },
    { label: "at school", speak: "at school" },
  ];
  const items3 = [
    { label: "They live…", speak: "They live" },
    { label: "My parents live…", speak: "My parents live" },
    { label: "We speak…", speak: "We speak" },
    { label: "My sister and I speak…", speak: "My sister and I speak" },
  ];

  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">WRAP UP!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        <div className="bg-cyan-200 p-6 space-y-3">
          {items1.map((it, i) => (
            <SpeakText key={i} text={it.speak} className="text-gray-800 text-left w-full block">
              <span className="cursor-pointer hover:opacity-70">
                {i === 0 ? <>• to go <strong className="text-blue-700">to the U.S.A.</strong></> : <>• to study <strong className="text-blue-700">in the U.S.A.</strong></>}
              </span>
            </SpeakText>
          ))}
        </div>

        <div className="bg-purple-500 text-white p-6 space-y-3">
          {items2.map((it, i) => (
            <SpeakText key={i} text={it.speak} className="text-white text-left w-full block">
              <span className="cursor-pointer hover:opacity-70">• {it.label.replace(/\.$/, '')}</span>
            </SpeakText>
          ))}
        </div>

        <div className="bg-white p-6 space-y-3">
          {items3.map((it, i) => (
            <SpeakText key={i} text={it.speak} className="text-gray-800 text-left w-full block">
              <span className="cursor-pointer hover:opacity-70">• {it.label}</span>
            </SpeakText>
          ))}
        </div>

        <div className="bg-sky-300 p-6 flex items-center justify-center font-semibold text-gray-800">
          class → classes
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 11
// ============================================
export default function LessonFamilyAndOccupations() {
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

  // ===== IMAGENS =====
  const mainImage = "https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800";
  const familyImage = "https://images.pexels.com/photos/1648385/pexels-photo-1648385.jpeg?auto=compress&cs=tinysrgb&w=800";
  const workImage = "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800";
  const backgroundImage = "/images/l7-bgg.jpg";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu vou / Nós vamos / Eles vão",
      options: [
        { label: "Eu vou", replacement: "I go.", speak: "I go" },
        { label: "Nós vamos", replacement: "We go.", speak: "We go" },
        { label: "Eles vão", replacement: "They go.", speak: "They go" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você não vai / Elas não vão / Eu não vou",
      options: [
        { label: "Você não vai", replacement: "You don't go.", speak: "You don't go" },
        { label: "Elas não vão", replacement: "They don't go.", speak: "They don't go" },
        { label: "Eu não vou", replacement: "I don't go.", speak: "I don't go" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você vai? / quer ir / gosta de ir",
      options: [
        { label: "vai?", replacement: "Do you go?", speak: "Do you go" },
        { label: "quer ir", replacement: "Do you want to go?", speak: "Do you want to go" },
        { label: "gosta de ir", replacement: "Do you like to go?", speak: "Do you like to go" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu vejo / Nós vemos / Eles veem",
      options: [
        { label: "Eu vejo", replacement: "I see.", speak: "I see" },
        { label: "Nós vemos", replacement: "We see.", speak: "We see" },
        { label: "Eles veem", replacement: "They see.", speak: "They see" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ele não vê / Ela não vê / Eu não vejo",
      options: [
        { label: "Ele não vê", replacement: "He doesn't see.", speak: "He doesn't see" },
        { label: "Ela não vê", replacement: "She doesn't see.", speak: "She doesn't see" },
        { label: "Eu não vejo", replacement: "I don't see.", speak: "I don't see" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Você vê? / quer ver / prefere ver",
      options: [
        { label: "vê?", replacement: "Do you see?", speak: "Do you see" },
        { label: "quer ver", replacement: "Do you want to see?", speak: "Do you want to see" },
        { label: "prefere ver", replacement: "Do you prefer to see?", speak: "Do you prefer to see" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "O que você vê? / come / bebe",
      options: [
        { label: "vê", replacement: "What do you see?", speak: "What do you see" },
        { label: "come", replacement: "What do you eat?", speak: "What do you eat" },
        { label: "bebe", replacement: "What do you drink?", speak: "What do you drink" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Aonde você vai? / quer ir / adora ir",
      options: [
        { label: "vai", replacement: "Where do you go?", speak: "Where do you go" },
        { label: "quer ir", replacement: "Where do you want to go?", speak: "Where do you want to go" },
        { label: "adora ir", replacement: "Where do you love to go?", speak: "Where do you love to go" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Eu quero ir lá / Nós queremos / Elas querem",
      options: [
        { label: "Eu", replacement: "I want to go there.", speak: "I want to go there" },
        { label: "Nós", replacement: "We want to go there.", speak: "We want to go there" },
        { label: "Elas", replacement: "They want to go there.", speak: "They want to go there" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Você quer ir comigo? / estudar / falar",
      options: [
        { label: "ir comigo", replacement: "Do you want to go with me?", speak: "Do you want to go with me" },
        { label: "estudar", replacement: "Do you want to study with me?", speak: "Do you want to study with me" },
        { label: "falar", replacement: "Do you want to speak with me?", speak: "Do you want to speak with me" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu moro com meu pai / minha mãe / família",
      options: [
        { label: "meu pai", replacement: "I live with my father.", speak: "my father" },
        { label: "minha mãe", replacement: "I live with my mother.", speak: "my mother" },
        { label: "família", replacement: "I live with my family.", speak: "my family" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eles estudam com meus filhos / amigos / colegas de classe",
      options: [
        { label: "meus filhos", replacement: "They study with my children.", speak: "my children" },
        { label: "amigos", replacement: "They study with my friends.", speak: "my friends" },
        { label: "colegas de classe", replacement: "They study with my classmates.", speak: "my classmates" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Nós estudamos com sua esposa / colega de trabalho / chefe",
      options: [
        { label: "esposa", replacement: "We study with his wife.", speak: "his wife" },
        { label: "colega de trabalho", replacement: "We study with his coworker.", speak: "his coworker" },
        { label: "chefe", replacement: "We study with his boss.", speak: "his boss" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Você prefere ir com seu irmão? / sua irmã / seus pais",
      options: [
        { label: "irmão", replacement: "Do you prefer to go with your brother?", speak: "Do you prefer to go with your brother" },
        { label: "irmã", replacement: "Do you prefer to go with your sister?", speak: "Do you prefer to go with your sister" },
        { label: "seus pais", replacement: "Do you prefer to go with your parents?", speak: "Do you prefer to go with your parents" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Aonde você vai com sua família? / seus filhos / sua esposa",
      options: [
        { label: "família", replacement: "Where do you go with your family?", speak: "Where do you go with your family" },
        { label: "filhos", replacement: "Where do you go with your children?", speak: "Where do you go with your children" },
        { label: "esposa", replacement: "Where do you go with your wife?", speak: "Where do you go with your wife" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu vejo meu chefe de manhã / vizinho / colega de trabalho",
      options: [
        { label: "chefe", replacement: "I see my boss in the morning.", speak: "my boss" },
        { label: "vizinho", replacement: "I see my neighbor in the morning.", speak: "my neighbor" },
        { label: "colega de trabalho", replacement: "I see my coworker in the morning.", speak: "my coworker" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Nós moramos nos Estados Unidos / no Reino Unido / no Japão",
      options: [
        { label: "Estados Unidos", replacement: "We live in the United States.", speak: "the United States" },
        { label: "Reino Unido", replacement: "We live in the United Kingdom.", speak: "the United Kingdom" },
        { label: "Japão", replacement: "We live in Japan.", speak: "Japan" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Você mora na Alemanha? / na França / no Brasil",
      options: [
        { label: "Alemanha", replacement: "Do you live in Germany?", speak: "Do you live in Germany" },
        { label: "França", replacement: "Do you live in France?", speak: "Do you live in France" },
        { label: "Brasil", replacement: "Do you live in Brazil?", speak: "Do you live in Brazil" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Ele mora em Londres / no Japão / no Rio de Janeiro",
      options: [
        { label: "Londres", replacement: "He lives in London.", speak: "He lives in London" },
        { label: "Japão", replacement: "He lives in Japan.", speak: "He lives in Japan" },
        { label: "Rio de Janeiro", replacement: "He lives in Rio de Janeiro.", speak: "He lives in Rio de Janeiro" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu gosto da minha aula de inglês / francês / espanhol",
      options: [
        { label: "inglês", replacement: "I like my English class.", speak: "English" },
        { label: "francês", replacement: "I like my French class.", speak: "French" },
        { label: "espanhol", replacement: "I like my Spanish class.", speak: "Spanish" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu adoro aquela aula / aquele professor / professor de inglês",
      options: [
        { label: "aquela aula", replacement: "I love that class.", speak: "that class" },
        { label: "aquele professor", replacement: "I love that teacher.", speak: "that teacher" },
        { label: "professor de inglês", replacement: "I love the English teacher.", speak: "the English teacher" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Você fala inglês com seu chefe? / seu colega de trabalho / seus pais",
      options: [
        { label: "chefe", replacement: "Do you speak English with your boss?", speak: "Do you speak English with your boss" },
        { label: "colega de trabalho", replacement: "Do you speak English with your coworker?", speak: "Do you speak English with your coworker" },
        { label: "seus pais", replacement: "Do you speak English with your parents?", speak: "Do you speak English with your parents" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Eu não moro com a minha família / meu pai / minha mãe",
      options: [
        { label: "família", replacement: "I don't live with my family.", speak: "my family" },
        { label: "meu pai", replacement: "I don't live with my father.", speak: "my father" },
        { label: "minha mãe", replacement: "I don't live with my mother.", speak: "my mother" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu falo inglês no trabalho / em casa / na escola",
      options: [
        { label: "no trabalho", replacement: "I speak English at work.", speak: "at work" },
        { label: "em casa", replacement: "I speak English at home.", speak: "at home" },
        { label: "na escola", replacement: "I speak English at school.", speak: "at school" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu não falo português em casa / na escola / no trabalho",
      options: [
        { label: "em casa", replacement: "I don't speak Portuguese at home.", speak: "at home" },
        { label: "na escola", replacement: "I don't speak Portuguese at school.", speak: "at school" },
        { label: "no trabalho", replacement: "I don't speak Portuguese at work.", speak: "at work" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Você vê seus amigos no trabalho? / seu colega de classe / vizinho",
      options: [
        { label: "seus amigos", replacement: "Do you see your friends at work?", speak: "Do you see your friends at work" },
        { label: "colega de classe", replacement: "Do you see your classmate at work?", speak: "Do you see your classmate at work" },
        { label: "vizinho", replacement: "Do you see your neighbor at work?", speak: "Do you see your neighbor at work" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu prefiro estudar de manhã / à tarde / à noite",
      options: [
        { label: "de manhã", replacement: "I prefer to study in the morning.", speak: "in the morning" },
        { label: "à tarde", replacement: "I prefer to study in the afternoon.", speak: "in the afternoon" },
        { label: "à noite", replacement: "I prefer to study in the evening.", speak: "in the evening" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você vê seus amigos à noite? / de manhã",
      options: [
        { label: "à noite", replacement: "Do you see your friends in the evening?", speak: "Do you see your friends in the evening" },
        { label: "de manhã", replacement: "Do you see your friends in the morning?", speak: "Do you see your friends in the morning" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eles estudam comigo de manhã / à tarde / à noite",
      options: [
        { label: "de manhã", replacement: "They study with me in the morning.", speak: "in the morning" },
        { label: "à tarde", replacement: "They study with me in the afternoon.", speak: "in the afternoon" },
        { label: "à noite", replacement: "They study with me in the evening.", speak: "in the evening" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu vejo / Nós vemos / Nós vemos?",
      options: [
        { label: "Eu vejo", replacement: "I see.", speak: "I see" },
        { label: "Nós vemos", replacement: "We see.", speak: "We see" },
        { label: "Nós vemos?", replacement: "Do we see?", speak: "Do we see" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Entendemos / moramos / falamos",
      options: [
        { label: "entendemos", replacement: "We understand.", speak: "We understand" },
        { label: "moramos", replacement: "We live.", speak: "We live" },
        { label: "falamos", replacement: "We speak.", speak: "We speak" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu vou / Eles vão / Eles vão?",
      options: [
        { label: "Eu vou", replacement: "I go.", speak: "I go" },
        { label: "Eles vão", replacement: "They go.", speak: "They go" },
        { label: "Eles vão?", replacement: "Do they go?", speak: "Do they go" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Veem / falam / entendem",
      options: [
        { label: "veem", replacement: "They see.", speak: "They see" },
        { label: "falam", replacement: "They speak.", speak: "They speak" },
        { label: "entendem", replacement: "They understand.", speak: "They understand" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eles falam português? / entendem / estudam",
      options: [
        { label: "falam português", replacement: "Do they speak Portuguese?", speak: "Do they speak Portuguese" },
        { label: "entendem", replacement: "Do they understand?", speak: "Do they understand" },
        { label: "estudam", replacement: "Do they study?", speak: "Do they study" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eles moram no Brasil? / França / Alemanha",
      options: [
        { label: "Brasil", replacement: "Do they live in Brazil?", speak: "Do they live in Brazil" },
        { label: "França", replacement: "Do they live in France?", speak: "Do they live in France" },
        { label: "Alemanha", replacement: "Do they live in Germany?", speak: "Do they live in Germany" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eles entendem inglês? / português / italiano",
      options: [
        { label: "inglês", replacement: "Do they understand English?", speak: "Do they understand English" },
        { label: "português", replacement: "Do they understand Portuguese?", speak: "Do they understand Portuguese" },
        { label: "italiano", replacement: "Do they understand Italian?", speak: "Do they understand Italian" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Onde eles estudam? / moram / querem ir",
      options: [
        { label: "estudam", replacement: "Where do they study?", speak: "Where do they study" },
        { label: "moram", replacement: "Where do they live?", speak: "Where do they live" },
        { label: "querem ir", replacement: "Where do they want to go?", speak: "Where do they want to go" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Onde eles querem ir? / estudar / morar",
      options: [
        { label: "ir", replacement: "Where do they want to go?", speak: "Where do they want to go" },
        { label: "estudar", replacement: "Where do they want to study?", speak: "Where do they want to study" },
        { label: "morar", replacement: "Where do they want to live?", speak: "Where do they want to live" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu quero ir para a Alemanha / Nós / Elas",
      options: [
        { label: "Eu", replacement: "I want to go to Germany.", speak: "I want to go to Germany" },
        { label: "Nós", replacement: "We want to go to Germany.", speak: "We want to go to Germany" },
        { label: "Elas", replacement: "They want to go to Germany.", speak: "They want to go to Germany" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Você quer ir para o Brasil? / França / Espanha",
      options: [
        { label: "Brasil", replacement: "Do you want to go to Brazil?", speak: "Do you want to go to Brazil" },
        { label: "França", replacement: "Do you want to go to France?", speak: "Do you want to go to France" },
        { label: "Espanha", replacement: "Do you want to go to Spain?", speak: "Do you want to go to Spain" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Eu vou para a escola sozinho / trabalho / aula",
      options: [
        { label: "escola sozinho", replacement: "I go to school alone.", speak: "I go to school alone" },
        { label: "trabalho sozinho", replacement: "I go to work alone.", speak: "I go to work alone" },
        { label: "aula sozinho", replacement: "I go to class alone.", speak: "I go to class alone" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-13",
      original: "Você vai para o trabalho com seu amigo? / vizinho / colega de trabalho",
      options: [
        { label: "amigo", replacement: "Do you go to work with your friend?", speak: "Do you go to work with your friend" },
        { label: "vizinho", replacement: "Do you go to work with your neighbor?", speak: "Do you go to work with your neighbor" },
        { label: "colega de trabalho", replacement: "Do you go to work with your coworker?", speak: "Do you go to work with your coworker" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-14",
      original: "Eu prefiro ir aos Estados Unidos / Reino Unido",
      options: [
        { label: "Estados Unidos", replacement: "I prefer to go to the United States.", speak: "I prefer to go to the United States" },
        { label: "Reino Unido", replacement: "I prefer to go to the United Kingdom.", speak: "I prefer to go to the United Kingdom" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-15",
      original: "Você quer ir ao Reino Unido? / Estados Unidos",
      options: [
        { label: "Reino Unido", replacement: "Do you want to go to the U.K.?", speak: "Do you want to go to the U.K." },
        { label: "Estados Unidos", replacement: "Do you want to go to the U.S.A.?", speak: "Do you want to go to the U.S.A." }
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
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* Título centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            👨‍👩‍👧‍👦 Lesson 11 - Family & Occupations
          </h1>
          <div className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            <SpeakPortuguese text="Revise frases sobre membros da família e ocupações. Aprenda verbos to go e to see." className="text-xl text-gray-700">
              📚 Revise frases sobre membros da família e ocupações. Aprenda verbos "to go" e "to see". 👨‍👩‍👧‍👦💼
            </SpeakPortuguese>
          </div>
          <div
            className="w-64 h-64 mx-auto cursor-pointer"
            onClick={() => setIsMainImageModalOpen(true)}
          >
            <img
              src={mainImage}
              alt="Family and work life"
              className="w-full h-full object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              loading="lazy"
              decoding="async"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
        </div>

        {/* ============ SEÇÃO 1 – VERBS ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Clique nos verbos para ouvir a pronúncia e praticar suas formas" className="text-gray-600 italic">
                🎧 Clique nos verbos para ouvir a pronúncia e praticar suas formas
              </SpeakPortuguese>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to go" className="text-blue-600 font-bold">to go</SpeakText> = ir para</li>
              <li><SpeakText text="to see" className="text-blue-600 font-bold">to see</SpeakText> = ver</li>
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

        {/* ============ SEÇÃO 2 – NEW WORDS ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Clique em cada palavra para ouvir a pronúncia correta. O áudio é sempre em inglês." className="text-gray-600 italic">
                🎧 Clique em cada palavra para ouvir a pronúncia correta (o áudio é sempre em inglês)
              </SpeakPortuguese>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li><SpeakText text="father" className="text-blue-600 font-bold">father</SpeakText> = pai</li>
              <li><SpeakText text="mother" className="text-blue-600 font-bold">mother</SpeakText> = mãe</li>
              <li><SpeakText text="parents" className="text-blue-600 font-bold">parents</SpeakText> = pais</li>
              <li><SpeakText text="child" className="text-blue-600 font-bold">child</SpeakText> = criança</li>
              <li><SpeakText text="children" className="text-blue-600 font-bold">children</SpeakText> = filhos, crianças</li>
              <li><SpeakText text="husband" className="text-blue-600 font-bold">husband</SpeakText> = marido</li>
              <li><SpeakText text="wife" className="text-blue-600 font-bold">wife</SpeakText> = esposa</li>
              <li><SpeakText text="family" className="text-blue-600 font-bold">family</SpeakText> = família</li>
              <li><SpeakText text="neighbor" className="text-blue-600 font-bold">neighbor</SpeakText> = vizinho</li>
              <li><SpeakText text="boss" className="text-blue-600 font-bold">boss</SpeakText> = chefe</li>
              <li><SpeakText text="coworker" className="text-blue-600 font-bold">coworker</SpeakText> = colega de trabalho</li>
              <li><SpeakText text="college" className="text-blue-600 font-bold">college</SpeakText> = faculdade</li>
              <li><SpeakText text="home" className="text-blue-600 font-bold">home</SpeakText> = casa</li>
              <li><SpeakText text="work" className="text-blue-600 font-bold">work</SpeakText> = trabalho, emprego</li>
              <li><SpeakText text="France" className="text-blue-600 font-bold">France</SpeakText> = França</li>
              <li><SpeakText text="the United Kingdom" className="text-blue-600 font-bold">the United Kingdom (U.K.)</SpeakText> = Reino Unido</li>
              <li><SpeakText text="Japan" className="text-blue-600 font-bold">Japan</SpeakText> = Japão</li>
              <li><SpeakText text="London" className="text-blue-600 font-bold">London</SpeakText> = Londres</li>
              <li><SpeakText text="Rio de Janeiro" className="text-blue-600 font-bold">Rio de Janeiro</SpeakText> = Rio de Janeiro</li>
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

        {/* ============ SEÇÃO 3 – SPEAK LIKE A NATIVE ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Pratique frases comuns para falar sobre família e trabalho" className="text-gray-600 italic">
                💬 Pratique frases comuns para falar sobre família e trabalho
              </SpeakPortuguese>
            </div>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakSentence text="I see my neighbor at work." className="text-blue-600 font-bold">
                  I see my neighbor at work.
                </SpeakSentence> = Vejo meu vizinho no trabalho.
              </li>
              <li>
                <SpeakSentence text="Do you study at home?" className="text-blue-600 font-bold">
                  Do you study at home?
                </SpeakSentence> = Você estuda em casa?
              </li>
              <li>
                <SpeakSentence text="I see my parents in the evening." className="text-blue-600 font-bold">
                  I see my parents in the evening.
                </SpeakSentence> = Vejo meus pais à noite.
              </li>
              <li>
                <SpeakSentence text="We study at school." className="text-blue-600 font-bold">
                  We study at school.
                </SpeakSentence> = Estudamos na escola.
              </li>
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

        {/* ============ SEÇÃO 4 – GRAMMAR ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="text-md text-gray-600 mb-4 italic">
              <SpeakPortuguese text="Estruturas para fazer perguntas com they e we" className="text-gray-600 italic">
                📚 Estruturas para fazer perguntas com "they" e "we"
              </SpeakPortuguese>
            </div>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p><SpeakSentence text="Do they live in Germany?" className="text-blue-600 font-bold">Do they live in Germany?</SpeakSentence> = Eles moram na Alemanha?</p>
              <p><SpeakSentence text="Do they go to school in the morning?" className="text-blue-600 font-bold">Do they go to school in the morning?</SpeakSentence> = Eles vão para a escola de manhã?</p>
              <p><SpeakSentence text="Do they speak Italian?" className="text-blue-600 font-bold">Do they speak Italian?</SpeakSentence> = Eles falam italiano?</p>
              <p><SpeakSentence text="Where do they want to go?" className="text-blue-600 font-bold">Where do they want to go?</SpeakSentence> = Onde eles querem ir?</p>
              <p><SpeakSentence text="We want to go to Germany." className="text-blue-600 font-bold">We want to go to Germany.</SpeakSentence> = Queremos ir para a Alemanha.</p>
              <p><SpeakSentence text="We go to school." className="text-blue-600 font-bold">We go to school.</SpeakSentence> = Nós vamos para a escola.</p>
              <p><SpeakSentence text="They go to class in the evening." className="text-blue-600 font-bold">They go to class in the evening.</SpeakSentence> = Eles vão para aula à noite.</p>
              <p><SpeakSentence text="Do they want to go to the U.K.?" className="text-blue-600 font-bold">Do they want to go to the U.K.?</SpeakSentence> = Eles querem ir para o Reino Unido?</p>
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

        {/* ============ SEÇÃO 5 – MAKE IT YOURS ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">Pratique situações da vida real</div>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="text-center mb-4">
                <SpeakPortuguese text="Pratique situações da vida real substituindo as palavras em azul." className="text-blue-700 font-medium italic">
                  👉 Pratique situações da vida real substituindo as palavras em <span className="text-blue-600 font-bold">azul</span>.
                </SpeakPortuguese>
              </div>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "I go to work in the morning.", pt: "Vou para o trabalho de manhã.", blue: ["work", "morning"] },
                    { en: "I go to college in the afternoon.", pt: "Vou para a faculdade à tarde.", blue: ["college", "afternoon"] },
                    { en: "They go to school in France.", pt: "Eles vão para a escola na França.", blue: ["school", "France"] },
                    { en: "He doesn't like to go to class in the evening.", pt: "Ele não gosta de ir para a aula à noite.", blue: ["class", "evening"] },
                    { en: "I want to go to the U.S.A.", pt: "Quero ir para os EUA.", blue: ["U.S.A."] },
                    { en: "I see my husband at 6 a.m.", pt: "Vejo meu esposo às 6 da manhã.", blue: ["husband"] },
                    { en: "Do they speak English at work?", pt: "Eles falam inglês no trabalho?", blue: ["English", "work"] },
                    { en: "Do they speak French?", pt: "Eles falam francês?", blue: ["French"] },
                    { en: "Do you see your teacher?", pt: "Você vê o seu professor?", blue: ["teacher"] },
                    { en: "Do you live with your family?", pt: "Você mora com sua família?", blue: ["family"] },
                  ].map((s, idx) => (
                    <MakeItYoursPhrase
                      key={idx}
                      text={`${idx + 1}. ${s.en}`}
                      translation={s.pt}
                      blueWords={s.blue}
                    />
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full flex flex-col">
                    <div className="relative w-full flex-1 min-h-[20rem] overflow-hidden">
                      <img
                        src={familyImage}
                        alt="Membros da família e relacionamentos"
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Membros da família e relacionamentos</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full flex flex-col">
                    <div className="relative w-full flex-1 min-h-[20rem] overflow-hidden">
                      <img
                        src={workImage}
                        alt="Ocupações profissionais"
                        className="w-full h-full object-cover rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Trabalho e ocupações profissionais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ SEÇÃO 6 – WRAP UP ============ */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">Practice essential structures with "to go to" and prepositions</p>
          </div>
          <div className="p-6">
            <WrapUpHorizontal />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson10")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL DA IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Family and work life – ampliada"
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
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(59,130,246,0.5); }
          50% { box-shadow: 0 0 20px rgba(139,92,246,0.8); }
          100% { box-shadow: 0 0 5px rgba(59,130,246,0.5); }
        }
        .active\\:animate-glow:active { animation: glow 0.5s ease-out; }
      `}</style>
    </div>
  );
}