"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'newWords' | 'speakLikeNative' | 'grammar';

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
// SUBSTITUTION EXERCISE COMPONENT
// ============================================
type OptionType = string | { label: string; replacement: string };

interface SubstitutionExercise {
  key: string;
  portuguese: string;
  english: string;
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
    if (isObjectOption(opt)) return opt.label;
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.replacement;
    return String(opt);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-600 font-medium block">{exercise.portuguese}</p>
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
// HIGHLIGHTED PHRASE
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
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
// MAKE IT YOURS – SENTENCE WITH BLUE HIGHLIGHTS
// ============================================
function MakeItYoursSentence({
  number,
  en,
  pt,
  blueWords,
}: {
  number: number;
  en: string;
  pt: string;
  blueWords: string[];
}) {
  const tokens = en.split(/(\s+)/);
  const parts = tokens.map((token, i) => {
    const clean = token.replace(/[.,!?;:]/g, '').toLowerCase();
    const isBlue = blueWords.some(bw => clean === bw.toLowerCase());
    if (isBlue) {
      return <span key={i} className="text-blue-600 font-bold">{token}</span>;
    }
    return <span key={i}>{token}</span>;
  });

  return (
    <div className="group">
      <div className="flex items-start">
        <SpeakSentence text={en} className="text-base font-medium">
          {number}. {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600 mt-0.5 ml-6">{pt}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 9
// ============================================
export default function Lesson9LanguagesAndCountries() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    newWords: false,
    speakLikeNative: false,
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

  // ===== IMAGENS =====
  const mainImage = "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const cityImage = "https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const countryImage = "https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%2012%20de%20set.%20de%202026%2C%2015_58_57.png?raw=true";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      portuguese: "Eu moro aqui. / Nós moramos. / Eles moram.",
      english: "I live here.",
      options: [
        { label: "Eu", replacement: "I live here." },
        { label: "Nós", replacement: "We live here." },
        { label: "Eles", replacement: "They live here." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      portuguese: "Eu não moro aqui. / Você não mora",
      english: "I don't live here.",
      options: [
        { label: "Eu", replacement: "I don't live here." },
        { label: "Você", replacement: "You don't live here." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      portuguese: "Ela não mora aqui / Nós / Ele",
      english: "She doesn't live here.",
      options: [
        { label: "Ela", replacement: "She doesn't live here." },
        { label: "Nós", replacement: "We don't live here." },
        { label: "Ele", replacement: "He doesn't live here." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      portuguese: "Você mora aqui? / lá",
      english: "Do you live here?",
      options: [
        { label: "aqui", replacement: "Do you live here?" },
        { label: "lá", replacement: "Do you live there?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      portuguese: "Eu entendo inglês. / Nós entendemos / Eles entendem.",
      english: "I understand English.",
      options: [
        { label: "Eu", replacement: "I understand English." },
        { label: "Nós", replacement: "We understand English." },
        { label: "Eles", replacement: "They understand English." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      portuguese: "Eu não entendo alemão. / falo / estudo",
      english: "I don't understand German.",
      options: [
        { label: "alemão", replacement: "I don't understand German." },
        { label: "falo", replacement: "I don't speak German." },
        { label: "estudo", replacement: "I don't study German." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      portuguese: "Eu quero entender espanhol. / Nós / Elas",
      english: "I want to understand Spanish.",
      options: [
        { label: "Eu", replacement: "I want to understand Spanish." },
        { label: "Nós", replacement: "We want to understand Spanish." },
        { label: "Elas", replacement: "They want to understand Spanish." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      portuguese: "Eles preferem morar aqui. / Ela / Nós",
      english: "They prefer to live here.",
      options: [
        { label: "Eles", replacement: "They prefer to live here." },
        { label: "Ela", replacement: "She prefers to live here." },
        { label: "Nós", replacement: "We prefer to live here." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      portuguese: "Você prefere morar aqui ou lá? / quer / gosta",
      english: "Do you prefer to live here or there?",
      options: [
        { label: "prefere", replacement: "Do you prefer to live here or there?" },
        { label: "quer", replacement: "Do you want to live here or there?" },
        { label: "gosta", replacement: "Do you like to live here or there?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      portuguese: "Eu entendo meu professor. / amigo / você",
      english: "I understand my teacher.",
      options: [
        { label: "professor", replacement: "I understand my teacher." },
        { label: "amigo", replacement: "I understand my friend." },
        { label: "você", replacement: "I understand you." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS (Substitution Drill) ----------
  const newWordsSubstitution: SubstitutionExercise[] = [
    {
      key: "newword-1",
      portuguese: "Eu entendo esse idioma. / falo / estudo",
      english: "I understand this language.",
      options: [
        { label: "entendo", replacement: "I understand this language." },
        { label: "falo", replacement: "I speak this language." },
        { label: "estudo", replacement: "I study this language." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-2",
      portuguese: "Você fala esse idioma? / estuda / entende",
      english: "Do you speak this language?",
      options: [
        { label: "fala", replacement: "Do you speak this language?" },
        { label: "estuda", replacement: "Do you study this language?" },
        { label: "entende", replacement: "Do you understand this language?" }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-3",
      portuguese: "Eu não entendo aquela palavra. / língua / aquele professor",
      english: "I don't understand that word.",
      options: [
        { label: "palavra", replacement: "I don't understand that word." },
        { label: "língua", replacement: "I don't understand that language." },
        { label: "professor", replacement: "I don't understand that teacher." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-4",
      portuguese: "Nós adoramos aquele país. / aquela cidade / escola",
      english: "We love that country.",
      options: [
        { label: "país", replacement: "We love that country." },
        { label: "cidade", replacement: "We love that city." },
        { label: "escola", replacement: "We love that school." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-5",
      portuguese: "Eu moro na Itália. / na Espanha / no Brasil",
      english: "I live in Italy.",
      options: [
        { label: "Itália", replacement: "I live in Italy." },
        { label: "Espanha", replacement: "I live in Spain." },
        { label: "Brasil", replacement: "I live in Brazil." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-6",
      portuguese: "Você mora na Alemanha? / no Brasil / nos Estados Unidos",
      english: "Do you live in Germany?",
      options: [
        { label: "Alemanha", replacement: "Do you live in Germany?" },
        { label: "Brasil", replacement: "Do you live in Brazil?" },
        { label: "Estados Unidos", replacement: "Do you live in the United States?" }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-7",
      portuguese: "Eu moro no exterior. / Nós / Eles",
      english: "I live abroad.",
      options: [
        { label: "Eu", replacement: "I live abroad." },
        { label: "Nós", replacement: "We live abroad." },
        { label: "Eles", replacement: "They live abroad." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-8",
      portuguese: "Você estuda no exterior? / mora",
      english: "Do you study abroad?",
      options: [
        { label: "estuda", replacement: "Do you study abroad?" },
        { label: "mora", replacement: "Do you live abroad?" }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-9",
      portuguese: "Eu estudo com meu professor. / colega de classe / amigo",
      english: "I study with my teacher.",
      options: [
        { label: "professor", replacement: "I study with my teacher." },
        { label: "colega de classe", replacement: "I study with my classmate." },
        { label: "amigo", replacement: "I study with my friend." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-10",
      portuguese: "Eu prefiro morar sozinha. / estudar / comer",
      english: "I prefer to live alone.",
      options: [
        { label: "morar", replacement: "I prefer to live alone." },
        { label: "estudar", replacement: "I prefer to study alone." },
        { label: "comer", replacement: "I prefer to eat alone." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-11",
      portuguese: "Eu moro neste país. / nesta cidade",
      english: "I live in this country.",
      options: [
        { label: "país", replacement: "I live in this country." },
        { label: "cidade", replacement: "I live in this city." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-12",
      portuguese: "Eu quero morar neste país. / nesta cidade / Nós queremos",
      english: "I want to live in this country.",
      options: [
        { label: "Eu", replacement: "I want to live in this country." },
        { label: "cidade", replacement: "I want to live in this city." },
        { label: "Nós", replacement: "We want to live in this country." }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-13",
      portuguese: "Você estuda naquele país? / naquela cidade / escola",
      english: "Do you study in that country?",
      options: [
        { label: "país", replacement: "Do you study in that country?" },
        { label: "cidade", replacement: "Do you study in that city?" },
        { label: "escola", replacement: "Do you study in that school?" }
      ],
      currentIndex: 0,
    },
    {
      key: "newword-14",
      portuguese: "Eu gosto de estudar naquela cidade. / Nós gostamos / Elas gostam",
      english: "I like to study in that city.",
      options: [
        { label: "Eu", replacement: "I like to study in that city." },
        { label: "Nós", replacement: "We like to study in that city." },
        { label: "Elas", replacement: "They like to study in that city." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      portuguese: "Eu gosto de francês, e você? / italiano / espanhol",
      english: "I like French, and you?",
      options: [
        { label: "francês", replacement: "I like French, and you?" },
        { label: "italiano", replacement: "I like Italian, and you?" },
        { label: "espanhol", replacement: "I like Spanish, and you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      portuguese: "Eu moro aqui, e você? / no exterior / sozinha",
      english: "I live here, and you?",
      options: [
        { label: "aqui", replacement: "I live here, and you?" },
        { label: "no exterior", replacement: "I live abroad, and you?" },
        { label: "sozinha", replacement: "I live alone, and you?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      portuguese: "Eles adoram morar na Alemanha. / Brasil / Espanha",
      english: "They love to live in Germany.",
      options: [
        { label: "Alemanha", replacement: "They love to live in Germany." },
        { label: "Brasil", replacement: "They love to live in Brazil." },
        { label: "Espanha", replacement: "They love to live in Spain." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      portuguese: "Eu entendo esta palavra em inglês. / espanhol / francês",
      english: "I understand this word in English.",
      options: [
        { label: "inglês", replacement: "I understand this word in English." },
        { label: "espanhol", replacement: "I understand this word in Spanish." },
        { label: "francês", replacement: "I understand this word in French." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      portuguese: "Ela entende esta palavra em Francês / Nós / Eu",
      english: "She understands this word in French.",
      options: [
        { label: "Ela", replacement: "She understands this word in French." },
        { label: "Nós", replacement: "We understand this word in French." },
        { label: "Eu", replacement: "I understand this word in French." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      portuguese: "Desculpe, eu não entendo este idioma. / Com licença",
      english: "Sorry, I don't understand this language.",
      options: [
        { label: "Desculpe", replacement: "Sorry, I don't understand this language." },
        { label: "Com licença", replacement: "Excuse me, I don't understand this language." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      portuguese: "Você entende esta palavra em inglês? / alemão / italiano",
      english: "Do you understand this word in English?",
      options: [
        { label: "inglês", replacement: "Do you understand this word in English?" },
        { label: "alemão", replacement: "Do you understand this word in German?" },
        { label: "italiano", replacement: "Do you understand this word in Italian?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      portuguese: "Eu moro no Brasil. / Nós / Eles",
      english: "I live in Brazil.",
      options: [
        { label: "Eu", replacement: "I live in Brazil." },
        { label: "Nós", replacement: "We live in Brazil." },
        { label: "Eles", replacement: "They live in Brazil." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      portuguese: "Eles não moram aqui. / lá / no Brasil",
      english: "They don't live here.",
      options: [
        { label: "here", replacement: "They don't live here." },
        { label: "lá", replacement: "They don't live there." },
        { label: "Brasil", replacement: "They don't live in Brazil." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      portuguese: "Elas não entendem esta palavra. / aquela / este idioma",
      english: "They don't understand this word.",
      options: [
        { label: "esta palavra", replacement: "They don't understand this word." },
        { label: "aquela", replacement: "They don't understand that word." },
        { label: "este idioma", replacement: "They don't understand this language." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      portuguese: "Ela não entende este idioma. / Ele / Nós",
      english: "She doesn't understand this language.",
      options: [
        { label: "Ela", replacement: "She doesn't understand this language." },
        { label: "Ele", replacement: "He doesn't understand this language." },
        { label: "Nós", replacement: "We don't understand this language." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      portuguese: "Nós não entendemos italiano. / alemão / espanhol",
      english: "We don't understand Italian.",
      options: [
        { label: "italiano", replacement: "We don't understand Italian." },
        { label: "alemão", replacement: "We don't understand German." },
        { label: "espanhol", replacement: "We don't understand Spanish." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      portuguese: "Nós não moramos no exterior. / Eles / Eu",
      english: "We don't live abroad.",
      options: [
        { label: "Nós", replacement: "We don't live abroad." },
        { label: "Eles", replacement: "They don't live abroad." },
        { label: "Eu", replacement: "I don't live abroad." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      portuguese: "Elas não moram na Itália. / Espanha / nos Estados Unidos",
      english: "They don't live in Italy.",
      options: [
        { label: "Itália", replacement: "They don't live in Italy." },
        { label: "Espanha", replacement: "They don't live in Spain." },
        { label: "Estados Unidos", replacement: "They don't live in the United States." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      portuguese: "Onde você mora? / estuda",
      english: "Where do you live?",
      options: [
        { label: "mora", replacement: "Where do you live?" },
        { label: "estuda", replacement: "Where do you study?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      portuguese: "Onde você quer morar? / gosta / prefere",
      english: "Where do you want to live?",
      options: [
        { label: "quer", replacement: "Where do you want to live?" },
        { label: "gosta", replacement: "Where do you like to live?" },
        { label: "prefere", replacement: "Where do you prefer to live?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      portuguese: "Nós preferimos morar nesta cidade. / neste país / lá",
      english: "We prefer to live in this city.",
      options: [
        { label: "nesta cidade", replacement: "We prefer to live in this city." },
        { label: "neste país", replacement: "We prefer to live in this country." },
        { label: "lá", replacement: "We prefer to live there." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      portuguese: "Eles adoram morar aqui. / lá / naquele país",
      english: "They love to live here.",
      options: [
        { label: "aqui", replacement: "They love to live here." },
        { label: "lá", replacement: "They love to live there." },
        { label: "naquele país", replacement: "They love to live in that country." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...verbsSubstitution, ...newWordsSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "I understand that word in English.",
      pt: "Eu entendo aquela palavra em inglês.",
      green: ["understand", "word", "English"]
    },
    {
      en: "I live here, what about you?",
      pt: "Eu moro aqui, e você?",
      green: ["live", "here"]
    }
  ];

  // New Words - lista de vocabulário
  const newWordsList = [
    { en: "classmate", pt: "colega de classe" },
    { en: "language", pt: "língua, idioma" },
    { en: "word", pt: "palavra" },
    { en: "city", pt: "cidade" },
    { en: "country", pt: "país" },
    { en: "Brazil", pt: "Brasil" },
    { en: "Spain", pt: "Espanha" },
    { en: "Germany", pt: "Alemanha" },
    { en: "Italy", pt: "Itália" },
    { en: "the United States of America (U.S.A.)", pt: "Os Estados Unidos" },
    { en: "alone", pt: "sozinho(a)" },
    { en: "where", pt: "onde" },
    { en: "abroad", pt: "no exterior / no estrangeiro" },
    { en: "this", pt: "este / esta" },
    { en: "that", pt: "aquele / aquela" },
    { en: "in", pt: "em / dentro" },
  ];

  // Grammar - estrutura base
  const grammarBaseExamples = [
    { en: "Where do you live?", pt: "Onde você mora?" },
    { en: "Where do you study?", pt: "Onde você estuda?" },
    { en: "Where do you want to live?", pt: "Onde você quer morar?" },
    { en: "Do you understand Spanish?", pt: "Você entende espanhol?" },
    { en: "Do you want to study Portuguese?", pt: "Você quer estudar português?" },
    { en: "Do they live here?", pt: "Eles moram aqui?" },
  ];

  // Make It Yours - frases com pronomes em azul e estrutura com does / he / she
  const makeItYoursSentences = [
    { en: "We want to live abroad.", pt: "Nós queremos morar no exterior.", blue: ["We"] },
    { en: "Do you live alone?", pt: "Você mora sozinho?", blue: ["you"] },
    { en: "I don't understand this word.", pt: "Eu não entendo esta palavra.", blue: ["I"] },
    { en: "Do you want to live in Italy?", pt: "Você quer morar na Itália?", blue: ["you"] },
    { en: "They want to live in that country.", pt: "Eles querem morar naquele país.", blue: ["They"] },
    { en: "Do you want to live in this city?", pt: "Você quer morar nesta cidade?", blue: ["you"] },
    { en: "We don't live here.", pt: "Nós não moramos aqui.", blue: ["We"] },
    { en: "They don't understand that language.", pt: "Eles não entendem aquele idioma.", blue: ["They"] },
    { en: "Where do you study English?", pt: "Onde você estuda inglês?", blue: ["you"] },
    { en: "Where do you want to eat?", pt: "Onde você quer comer?", blue: ["you"] },
    { en: "She lives in Germany.", pt: "Ela mora na Alemanha.", blue: ["She"] },
    { en: "He doesn't understand this language.", pt: "Ele não entende este idioma.", blue: ["He"] },
    { en: "Does she live abroad?", pt: "Ela mora no exterior?", blue: ["she"] },
    { en: "Does he want to study Italian?", pt: "Ele quer estudar italiano?", blue: ["he"] },
    { en: "She doesn't live in this city.", pt: "Ela não mora nesta cidade.", blue: ["She"] },
    { en: "He lives in that country.", pt: "Ele mora naquele país.", blue: ["He"] },
  ];

  // Wrap Up - perguntas com respostas separadas para áudio
  const wrapUpQA = [
    { question: "Do you live here?", answer: "Yes, I do. / No, I don't.", pt: "Você mora aqui? → Sim. / Não." },
    { question: "Do you understand?", answer: "Yes, I do. / No, I don't.", pt: "Você entende? → Sim. / Não." },
    { question: "Do you want to study?", answer: "Yes, I do. / No, I don't.", pt: "Você quer estudar? → Sim. / Não." },
    { question: "Do you study English?", answer: "Yes, I do. / No, I don't.", pt: "Você estuda inglês? → Sim. / Não." },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🌎 Lesson 9 - Languages & Countries
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Aprenda a falar sobre onde você mora e a expressar compreensão em inglês. 🏠🌎
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Moving to another house / new country"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-shadow"
            />
            <p className="text-center text-xs text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">
              🎧 Clique nos verbos para ouvir a pronúncia e praticar suas formas.
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to live" className="text-blue-600 font-bold">to live</SpeakText> = morar, viver
              </li>
              <li>
                <SpeakText text="to understand" className="text-blue-600 font-bold">to understand</SpeakText> = entender
              </li>
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

        {/* ===================== SECTION 2 – NEW WORDS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('newWords')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.newWords ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">
              🎧 Clique em cada palavra para ouvir a pronúncia correta.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWordsList.map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.newWords && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {newWordsSubstitution.map((ex) => {
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
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
            </div>
            <button
              onClick={() => toggleDrill('speakLikeNative')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.speakLikeNative ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">
              💬 Pratique frases comuns para falar sobre onde você mora e compreensão.
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
            {openDrills.speakLikeNative && (
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">
              📚 Estruturas para fazer perguntas e negações com do/does.
            </p>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Languages & Countries"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarBaseExamples.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
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

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
          </div>
          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">
              💡 Substituir as palavras em azul para praticar a fluência. Substitua as palavras em azul por outras palavras para praticar a fluência.
            </p>
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {makeItYoursSentences.map((s, idx) => (
                    <MakeItYoursSentence
                      key={idx}
                      number={idx + 1}
                      en={s.en}
                      pt={s.pt}
                      blueWords={s.blue}
                    />
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={cityImage} alt="Cities and places to live" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cities and places to live</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={countryImage} alt="Countries and different cultures" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Countries and different cultures</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <p className="mt-2 text-blue-100 italic">
                📝 Expressões-chave e vocabulário útil para lembrar.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">SIMPLE ANSWERS</h3>
              {wrapUpQA.map((item, idx) => (
                <div key={idx}>
                  <div className="flex flex-wrap items-center gap-1 mb-1">
                    <button
                      onClick={() => speakEnglish(item.question, 0.85)}
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                      title="Click to hear the question"
                    >
                      • {item.question}
                    </button>
                    <span className="text-blue-200">→</span>
                    <button
                      onClick={() => speakEnglish(item.answer, 0.85)}
                      className="text-blue-200 hover:text-white transition-colors cursor-pointer"
                      title="Click to hear the answer"
                    >
                      {item.answer}
                    </button>
                  </div>
                  <p className="text-blue-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 PREPOSITIONS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-blue-200">
                    <li>
                      <button onClick={() => speakEnglish("in Brazil", 0.9)} className="hover:text-white transition-colors cursor-pointer">
                        <strong className="text-white">in</strong> Brazil
                      </button>
                    </li>
                    <li>
                      <button onClick={() => speakEnglish("in this country", 0.9)} className="hover:text-white transition-colors cursor-pointer">
                        <strong className="text-white">in</strong> this country
                      </button>
                    </li>
                    <li>
                      <button onClick={() => speakEnglish("in that city", 0.9)} className="hover:text-white transition-colors cursor-pointer">
                        <strong className="text-white">in</strong> that city
                      </button>
                    </li>
                    <li>
                      <button onClick={() => speakEnglish("live abroad", 0.9)} className="hover:text-white transition-colors cursor-pointer">
                        live <strong className="text-white">abroad</strong>
                      </button>
                    </li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-blue-200">Use <strong className="text-white">"do"</strong> para perguntas e respostas simples com I, you, we, they. Use <strong className="text-white">"does"</strong> para he, she, it.</p>
                </div>
                <div className="pt-4 border-t border-blue-700">
                  <p className="text-blue-200 text-sm italic">
                    🌟 <strong>Clique nas frases para ouvir a pronúncia americana.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson8")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (8)
          </button>
          <button onClick={() => router.push("/cursos/lesson10")} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (10) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM DA GRAMMAR ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={grammarImage}
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

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Moving to another house – ampliada"
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