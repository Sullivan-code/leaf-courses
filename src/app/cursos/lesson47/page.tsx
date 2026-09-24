"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

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
              <span className="text-blue-700 font-medium flex-shrink-0">🇺🇸</span>
              <SpeakSentence text={currentSentence} className="text-blue-700 font-medium">
                {currentSentence}
              </SpeakSentence>
            </div>
            {currentPt && (
              <>
                <div className="border-t border-blue-200 my-1"></div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-600 text-sm flex-shrink-0">🇧🇷</span>
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const [showTranslation, setShowTranslation] = useState(true);
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
      <div className="flex items-start justify-between mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
        <button
          onClick={() => setShowTranslation(prev => !prev)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showTranslation ? "Ocultar tradução" : "Mostrar tradução"}
        >
          {showTranslation ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showTranslation && (
        <p className="text-sm text-gray-600">{translation}</p>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 47: EATING OUT
// ============================================
export default function Lesson47() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

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

  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "to call = chamar / ligar",
      options: [
        { label: "to call", replacement: "I call.", pt: "Eu chamo." },
        { label: "to wait", replacement: "I wait.", pt: "Eu espero." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "I call. / They call. / We call.",
      options: [
        { label: "I", replacement: "I call.", pt: "Eu chamo." },
        { label: "They", replacement: "They call.", pt: "Eles chamam." },
        { label: "We", replacement: "We call.", pt: "Nós chamamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "She doesn't call. / He doesn't call. / I don't call.",
      options: [
        { label: "She", replacement: "She doesn't call.", pt: "Ela não liga." },
        { label: "He", replacement: "He doesn't call.", pt: "Ele não liga." },
        { label: "I", replacement: "I don't call.", pt: "Eu não ligo." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Do you call? / Do you want to call? / need to",
      options: [
        { label: "Do you call?", replacement: "Do you call?", pt: "Você liga?" },
        { label: "Do you want to call?", replacement: "Do you want to call?", pt: "Você quer ligar?" },
        { label: "need to", replacement: "I need to call.", pt: "Eu preciso ligar." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "I need to call my father. / the manager / the boss",
      options: [
        { label: "my father", replacement: "I need to call my father.", pt: "Eu preciso ligar para meu pai." },
        { label: "the manager", replacement: "I need to call the manager.", pt: "Eu preciso ligar para o gerente." },
        { label: "the boss", replacement: "I need to call the boss.", pt: "Eu preciso ligar para o chefe." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Do you want to call your friend? / coworker / classmate",
      options: [
        { label: "your friend", replacement: "Do you want to call your friend?", pt: "Você quer chamar seu amigo?" },
        { label: "your coworker", replacement: "Do you want to call your coworker?", pt: "Você quer chamar seu colega de trabalho?" },
        { label: "your classmate", replacement: "Do you want to call your classmate?", pt: "Você quer chamar seu colega de classe?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "I wait. / They wait. / She waits.",
      options: [
        { label: "I", replacement: "I wait.", pt: "Eu espero." },
        { label: "They", replacement: "They wait.", pt: "Eles esperam." },
        { label: "She", replacement: "She waits.", pt: "Ela espera." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "I don't wait. / We / You all",
      options: [
        { label: "I don't wait", replacement: "I don't wait.", pt: "Eu não espero." },
        { label: "We don't wait", replacement: "We don't wait.", pt: "Nós não esperamos." },
        { label: "You all don't wait", replacement: "You all don't wait.", pt: "Vocês não esperam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Do you wait? / Does he / Does she",
      options: [
        { label: "Do you wait?", replacement: "Do you wait?", pt: "Você espera?" },
        { label: "Does he wait?", replacement: "Does he wait?", pt: "Ele espera?" },
        { label: "Does she wait?", replacement: "Does she wait?", pt: "Ela espera?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Wait for me! / the students / the bus",
      options: [
        { label: "me", replacement: "Wait for me!", pt: "Espere por mim!" },
        { label: "the students", replacement: "Wait for the students.", pt: "Espere os alunos." },
        { label: "the bus", replacement: "Wait for the bus.", pt: "Espere o ônibus." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "I wait for my friend at the station. / at the office / at the course",
      options: [
        { label: "at the station", replacement: "I wait for my friend at the station.", pt: "Eu espero meu amigo na estação." },
        { label: "at the office", replacement: "I wait for my friend at the office.", pt: "Eu espero meu amigo no escritório." },
        { label: "at the course", replacement: "I wait for my friend at the course.", pt: "Eu espero meu amigo no curso." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "Where do you wait for your husband? / your wife / your children",
      options: [
        { label: "your husband", replacement: "Where do you wait for your husband?", pt: "Onde você espera seu marido?" },
        { label: "your wife", replacement: "Where do you wait for your wife?", pt: "Onde você espera sua esposa?" },
        { label: "your children", replacement: "Where do you wait for your children?", pt: "Onde você espera seus filhos?" },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "This house is very comfortable. / apartment / restaurant",
      options: [
        { label: "house", replacement: "This house is very comfortable.", pt: "Esta casa é muito confortável." },
        { label: "apartment", replacement: "This apartment is very comfortable.", pt: "Este apartamento é muito confortável." },
        { label: "restaurant", replacement: "This restaurant is very comfortable.", pt: "Este restaurante é muito confortável." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "I rarely buy beverages here. / snacks / milkshake",
      options: [
        { label: "beverages", replacement: "I rarely buy beverages here.", pt: "Eu raramente compro bebidas aqui." },
        { label: "snacks", replacement: "I rarely buy snacks here.", pt: "Eu raramente compro lanches aqui." },
        { label: "milkshake", replacement: "I rarely buy milkshake here.", pt: "Eu raramente compro milkshake aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "We want to have a snack. / a barbecue / ice cream",
      options: [
        { label: "a snack", replacement: "We want to have a snack.", pt: "Nós queremos fazer um lanche." },
        { label: "a barbecue", replacement: "We want to have a barbecue.", pt: "Nós queremos fazer um churrasco." },
        { label: "ice cream", replacement: "We want to have ice cream.", pt: "Nós queremos tomar sorvete." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "How often do you have a barbecue? / dessert / ice cream",
      options: [
        { label: "a barbecue", replacement: "How often do you have a barbecue?", pt: "Com que frequência você faz um churrasco?" },
        { label: "dessert", replacement: "How often do you have dessert?", pt: "Com que frequência você come sobremesa?" },
        { label: "ice cream", replacement: "How often do you have ice cream?", pt: "Com que frequência você toma sorvete?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "How often do you call your parents? / grandparents / relatives",
      options: [
        { label: "your parents", replacement: "How often do you call your parents?", pt: "Com que frequência você liga para seus pais?" },
        { label: "your grandparents", replacement: "How often do you call your grandparents?", pt: "Com que frequência você liga para seus avós?" },
        { label: "your relatives", replacement: "How often do you call your relatives?", pt: "Com que frequência você liga para seus parentes?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "I always go to the bar with my friends. / often / sometimes",
      options: [
        { label: "always", replacement: "I always go to the bar with my friends.", pt: "Eu sempre vou ao bar com meus amigos." },
        { label: "often", replacement: "I often go to the bar with my friends.", pt: "Eu frequentemente vou ao bar com meus amigos." },
        { label: "sometimes", replacement: "I sometimes go to the bar with my friends.", pt: "Eu às vezes vou ao bar com meus amigos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "He never calls the chef. / always / sometimes",
      options: [
        { label: "never", replacement: "He never calls the chef.", pt: "Ele nunca chama o chefe de cozinha." },
        { label: "always", replacement: "He always calls the chef.", pt: "Ele sempre chama o chefe de cozinha." },
        { label: "sometimes", replacement: "He sometimes calls the chef.", pt: "Ele às vezes chama o chefe de cozinha." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I'm a vegan. / vegetarian / She is a",
      options: [
        { label: "vegan", replacement: "I'm a vegan.", pt: "Eu sou vegano." },
        { label: "vegetarian", replacement: "I'm a vegetarian.", pt: "Eu sou vegetariano." },
        { label: "She is a vegan", replacement: "She is a vegan.", pt: "Ela é vegana." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "I'm a vegan, so I never eat meat. / He is / She is",
      options: [
        { label: "I'm a vegan", replacement: "I'm a vegan, so I never eat meat.", pt: "Eu sou vegano, então eu nunca como carne." },
        { label: "He is a vegan", replacement: "He is a vegan, so he never eats meat.", pt: "Ele é vegano, então ele nunca come carne." },
        { label: "She is a vegan", replacement: "She is a vegan, so she never eats meat.", pt: "Ela é vegana, então ela nunca come carne." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "She's almost ready. / We are / I am",
      options: [
        { label: "She's", replacement: "She's almost ready.", pt: "Ela está quase pronta." },
        { label: "We are", replacement: "We are almost ready.", pt: "Nós estamos quase prontos." },
        { label: "I am", replacement: "I am almost ready.", pt: "Eu estou quase pronto." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "The dish is almost ready. / dessert / pizza",
      options: [
        { label: "dish", replacement: "The dish is almost ready.", pt: "O prato está quase pronto." },
        { label: "dessert", replacement: "The dessert is almost ready.", pt: "A sobremesa está quase pronta." },
        { label: "pizza", replacement: "The pizza is almost ready.", pt: "A pizza está quase pronta." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Are you in a hurry? / They / Why",
      options: [
        { label: "Are you", replacement: "Are you in a hurry?", pt: "Você está com pressa?" },
        { label: "Are they", replacement: "Are they in a hurry?", pt: "Eles estão com pressa?" },
        { label: "Why", replacement: "Why are you in a hurry?", pt: "Por que você está com pressa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "He isn't in a hurry today. / We / I",
      options: [
        { label: "He isn't", replacement: "He isn't in a hurry today.", pt: "Ele não está com pressa hoje." },
        { label: "We aren't", replacement: "We aren't in a hurry today.", pt: "Nós não estamos com pressa hoje." },
        { label: "I'm not", replacement: "I'm not in a hurry today.", pt: "Eu não estou com pressa hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Hurry up! We have to go now. / take a taxi / catch the bus",
      options: [
        { label: "go now", replacement: "Hurry up! We have to go now.", pt: "Apresse-se! Nós temos que ir agora." },
        { label: "take a taxi", replacement: "Hurry up! We have to take a taxi.", pt: "Apresse-se! Nós temos que pegar um táxi." },
        { label: "catch the bus", replacement: "Hurry up! We have to catch the bus.", pt: "Apresse-se! Nós temos que pegar o ônibus." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Are you on time? / They / I",
      options: [
        { label: "Are you", replacement: "Are you on time?", pt: "Você está no horário?" },
        { label: "Are they", replacement: "Are they on time?", pt: "Eles estão no horário?" },
        { label: "Am I", replacement: "Am I on time?", pt: "Eu estou no horário?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "The chef is always on time. / waiter / manager",
      options: [
        { label: "chef", replacement: "The chef is always on time.", pt: "O chefe de cozinha está sempre no horário." },
        { label: "waiter", replacement: "The waiter is always on time.", pt: "O garçom está sempre no horário." },
        { label: "manager", replacement: "The manager is always on time.", pt: "O gerente está sempre no horário." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "I'm in a hurry to go to the airport. / office / bank",
      options: [
        { label: "airport", replacement: "I'm in a hurry to go to the airport.", pt: "Eu estou com pressa para ir ao aeroporto." },
        { label: "office", replacement: "I'm in a hurry to go to the office.", pt: "Eu estou com pressa para ir ao escritório." },
        { label: "bank", replacement: "I'm in a hurry to go to the bank.", pt: "Eu estou com pressa para ir ao banco." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "He is always on time. / usually / never",
      options: [
        { label: "always", replacement: "He is always on time.", pt: "Ele sempre está no horário." },
        { label: "usually", replacement: "He is usually on time.", pt: "Ele geralmente está no horário." },
        { label: "never", replacement: "He is never on time.", pt: "Ele nunca está no horário." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "She is never late. / He / My boss",
      options: [
        { label: "She", replacement: "She is never late.", pt: "Ela nunca se atrasa." },
        { label: "He", replacement: "He is never late.", pt: "Ele nunca se atrasa." },
        { label: "My boss", replacement: "My boss is never late.", pt: "Meu chefe nunca se atrasa." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "They are usually on time. / We / The clients",
      options: [
        { label: "They", replacement: "They are usually on time.", pt: "Eles geralmente chegam no horário." },
        { label: "We", replacement: "We are usually on time.", pt: "Nós geralmente chegamos no horário." },
        { label: "The clients", replacement: "The clients are usually on time.", pt: "Os clientes geralmente chegam no horário." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-10",
      original: "I'm not in a hurry right now. / She / They",
      options: [
        { label: "I'm not", replacement: "I'm not in a hurry right now.", pt: "Eu não estou com pressa agora." },
        { label: "She isn't", replacement: "She isn't in a hurry right now.", pt: "Ela não está com pressa agora." },
        { label: "They aren't", replacement: "They aren't in a hurry right now.", pt: "Eles não estão com pressa agora." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Somebody needs to call the chef. / the manager / the waiter",
      options: [
        { label: "the chef", replacement: "Somebody needs to call the chef.", pt: "Alguém precisa chamar o chefe de cozinha." },
        { label: "the manager", replacement: "Somebody needs to call the manager.", pt: "Alguém precisa chamar o gerente." },
        { label: "the waiter", replacement: "Somebody needs to call the waiter.", pt: "Alguém precisa chamar o garçom." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "I want to talk to somebody. / about the problem / about the report",
      options: [
        { label: "somebody", replacement: "I want to talk to somebody.", pt: "Eu quero falar com alguém." },
        { label: "about the problem", replacement: "I want to talk about the problem.", pt: "Eu quero falar sobre o problema." },
        { label: "about the report", replacement: "I want to talk about the report.", pt: "Eu quero falar sobre o relatório." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "I have to meet somebody at the airport. / train station / subway station",
      options: [
        { label: "airport", replacement: "I have to meet somebody at the airport.", pt: "Eu tenho que encontrar alguém no aeroporto." },
        { label: "train station", replacement: "I have to meet somebody at the train station.", pt: "Eu tenho que encontrar alguém na estação de trem." },
        { label: "subway station", replacement: "I have to meet somebody at the subway station.", pt: "Eu tenho que encontrar alguém na estação de metrô." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Do you know anybody there? / in the USA / in the UK",
      options: [
        { label: "there", replacement: "Do you know anybody there?", pt: "Você conhece alguém lá?" },
        { label: "in the USA", replacement: "Do you know anybody in the USA?", pt: "Você conhece alguém nos Estados Unidos?" },
        { label: "in the UK", replacement: "Do you know anybody in the UK?", pt: "Você conhece alguém no Reino Unido?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Do you need to visit anybody today? / see / talk to",
      options: [
        { label: "visit", replacement: "Do you need to visit anybody today?", pt: "Você precisa visitar alguém hoje?" },
        { label: "see", replacement: "Do you need to see anybody today?", pt: "Você precisa ver alguém hoje?" },
        { label: "talk to", replacement: "Do you need to talk to anybody today?", pt: "Você precisa falar com alguém hoje?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Is he in a hurry? / Is anybody / thirsty / hungry",
      options: [
        { label: "Is he", replacement: "Is he in a hurry?", pt: "Ele está com pressa?" },
        { label: "Is anybody", replacement: "Is anybody in a hurry?", pt: "Alguém está com pressa?" },
        { label: "thirsty", replacement: "Is he thirsty?", pt: "Ele está com sede?" },
        { label: "hungry", replacement: "Is he hungry?", pt: "Ele está com fome?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "I don't know anybody here. / She / He",
      options: [
        { label: "I don't", replacement: "I don't know anybody here.", pt: "Eu não conheço ninguém aqui." },
        { label: "She doesn't", replacement: "She doesn't know anybody here.", pt: "Ela não conhece ninguém aqui." },
        { label: "He doesn't", replacement: "He doesn't know anybody here.", pt: "Ele não conhece ninguém aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "He doesn't want to call anybody. / She / They",
      options: [
        { label: "He doesn't", replacement: "He doesn't want to call anybody.", pt: "Ele não quer ligar para ninguém." },
        { label: "She doesn't", replacement: "She doesn't want to call anybody.", pt: "Ela não quer ligar para ninguém." },
        { label: "They don't", replacement: "They don't want to call anybody.", pt: "Eles não querem ligar para ninguém." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "They don't need to wait for anybody. / You / She",
      options: [
        { label: "They don't", replacement: "They don't need to wait for anybody.", pt: "Eles não precisam esperar ninguém." },
        { label: "You don't", replacement: "You don't need to wait for anybody.", pt: "Você não precisa esperar ninguém." },
        { label: "She doesn't", replacement: "She doesn't need to wait for anybody.", pt: "Ela não precisa esperar ninguém." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "You know somebody here, I'm sure. / don't know",
      options: [
        { label: "know", replacement: "You know somebody here, I'm sure.", pt: "Você conhece alguém aqui, eu tenho certeza." },
        { label: "don't know", replacement: "You don't know somebody here, I'm sure.", pt: "Você não conhece alguém aqui, eu tenho certeza." },
      ],
      currentIndex: 0,
    },
  ];

  // ---------- REAL LIFE ----------
  const realLifeSubstitution: SubstitutionExercise[] = [
    {
      key: "real-1",
      original: "I need to call my mother now. / father / brother",
      options: [
        { label: "mother", replacement: "I need to call my mother now.", pt: "Eu preciso ligar para minha mãe agora." },
        { label: "father", replacement: "I need to call my father now.", pt: "Eu preciso ligar para meu pai agora." },
        { label: "brother", replacement: "I need to call my brother now.", pt: "Eu preciso ligar para meu irmão agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-2",
      original: "She always calls me on my birthday. / He / They",
      options: [
        { label: "She", replacement: "She always calls me on my birthday.", pt: "Ela sempre me liga no meu aniversário." },
        { label: "He", replacement: "He always calls me on my birthday.", pt: "Ele sempre me liga no meu aniversário." },
        { label: "They", replacement: "They always call me on my birthday.", pt: "Eles sempre me ligam no meu aniversário." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-3",
      original: "Call your father. He is worried. / mother / brother",
      options: [
        { label: "father", replacement: "Call your father. He is worried.", pt: "Ligue para seu pai. Ele está preocupado." },
        { label: "mother", replacement: "Call your mother. She is worried.", pt: "Ligue para sua mãe. Ela está preocupada." },
        { label: "brother", replacement: "Call your brother. He is worried.", pt: "Ligue para seu irmão. Ele está preocupado." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-4",
      original: "I have to wait for my brother here. / sister / friend",
      options: [
        { label: "brother", replacement: "I have to wait for my brother here.", pt: "Eu tenho que esperar pelo meu irmão aqui." },
        { label: "sister", replacement: "I have to wait for my sister here.", pt: "Eu tenho que esperar pela minha irmã aqui." },
        { label: "friend", replacement: "I have to wait for my friend here.", pt: "Eu tenho que esperar pelo meu amigo aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-5",
      original: "I'm late, so don't wait for me. / us / them",
      options: [
        { label: "me", replacement: "I'm late, so don't wait for me.", pt: "Eu estou atrasado, então não espere por mim." },
        { label: "us", replacement: "We're late, so don't wait for us.", pt: "Nós estamos atrasados, então não espere por nós." },
        { label: "them", replacement: "They're late, so don't wait for them.", pt: "Eles estão atrasados, então não espere por eles." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-6",
      original: "Dinner is almost ready. / Lunch / Breakfast",
      options: [
        { label: "Dinner", replacement: "Dinner is almost ready.", pt: "O jantar está quase pronto." },
        { label: "Lunch", replacement: "Lunch is almost ready.", pt: "O almoço está quase pronto." },
        { label: "Breakfast", replacement: "Breakfast is almost ready.", pt: "O café da manhã está quase pronto." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-7",
      original: "I often read books in English. / always / sometimes",
      options: [
        { label: "often", replacement: "I often read books in English.", pt: "Eu frequentemente leio livros em inglês." },
        { label: "always", replacement: "I always read books in English.", pt: "Eu sempre leio livros em inglês." },
        { label: "sometimes", replacement: "I sometimes read books in English.", pt: "Eu às vezes leio livros em inglês." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-8",
      original: "He is never in a hurry. / She / They",
      options: [
        { label: "He", replacement: "He is never in a hurry.", pt: "Ele nunca está com pressa." },
        { label: "She", replacement: "She is never in a hurry.", pt: "Ela nunca está com pressa." },
        { label: "They", replacement: "They are never in a hurry.", pt: "Eles nunca estão com pressa." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-9",
      original: "How often do you see your cousins? / uncles / grandparents",
      options: [
        { label: "cousins", replacement: "How often do you see your cousins?", pt: "Com que frequência você vê seus primos?" },
        { label: "uncles", replacement: "How often do you see your uncles?", pt: "Com que frequência você vê seus tios?" },
        { label: "grandparents", replacement: "How often do you see your grandparents?", pt: "Com que frequência você vê seus avós?" },
      ],
      currentIndex: 0,
    },
    {
      key: "real-10",
      original: "Somebody wants to speak with you. / call / see",
      options: [
        { label: "speak with", replacement: "Somebody wants to speak with you.", pt: "Alguém quer falar com você." },
        { label: "call", replacement: "Somebody wants to call you.", pt: "Alguém quer te ligar." },
        { label: "see", replacement: "Somebody wants to see you.", pt: "Alguém quer te ver." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-11",
      original: "She doesn't want to see anybody. / He / They",
      options: [
        { label: "She", replacement: "She doesn't want to see anybody.", pt: "Ela não quer ver ninguém." },
        { label: "He", replacement: "He doesn't want to see anybody.", pt: "Ele não quer ver ninguém." },
        { label: "They", replacement: "They don't want to see anybody.", pt: "Eles não querem ver ninguém." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-12",
      original: "Do you know anybody in Germany? / France / Italy",
      options: [
        { label: "Germany", replacement: "Do you know anybody in Germany?", pt: "Você conhece alguém na Alemanha?" },
        { label: "France", replacement: "Do you know anybody in France?", pt: "Você conhece alguém na França?" },
        { label: "Italy", replacement: "Do you know anybody in Italy?", pt: "Você conhece alguém na Itália?" },
      ],
      currentIndex: 0,
    },
    {
      key: "real-13",
      original: "Did you call your mother yesterday? / father / brother",
      options: [
        { label: "mother", replacement: "Did you call your mother yesterday?", pt: "Você ligou para sua mãe ontem?" },
        { label: "father", replacement: "Did you call your father yesterday?", pt: "Você ligou para seu pai ontem?" },
        { label: "brother", replacement: "Did you call your brother yesterday?", pt: "Você ligou para seu irmão ontem?" },
      ],
      currentIndex: 0,
    },
    {
      key: "real-14",
      original: "She didn't call me last week. / He / They",
      options: [
        { label: "She", replacement: "She didn't call me last week.", pt: "Ela não me ligou na semana passada." },
        { label: "He", replacement: "He didn't call me last week.", pt: "Ele não me ligou na semana passada." },
        { label: "They", replacement: "They didn't call me last week.", pt: "Eles não me ligaram na semana passada." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-15",
      original: "I will call you as soon as I arrive. / leave / get there",
      options: [
        { label: "arrive", replacement: "I will call you as soon as I arrive.", pt: "Eu vou te ligar assim que eu chegar." },
        { label: "leave", replacement: "I will call you as soon as I leave.", pt: "Eu vou te ligar assim que eu sair." },
        { label: "get there", replacement: "I will call you as soon as I get there.", pt: "Eu vou te ligar assim que eu chegar lá." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-16",
      original: "Will you wait for me at the station? / the airport / the restaurant",
      options: [
        { label: "the station", replacement: "Will you wait for me at the station?", pt: "Você vai me esperar na estação?" },
        { label: "the airport", replacement: "Will you wait for me at the airport?", pt: "Você vai me esperar no aeroporto?" },
        { label: "the restaurant", replacement: "Will you wait for me at the restaurant?", pt: "Você vai me esperar no restaurante?" },
      ],
      currentIndex: 0,
    },
    {
      key: "real-17",
      original: "I have been waiting for you for an hour. / two hours / a long time",
      options: [
        { label: "an hour", replacement: "I have been waiting for you for an hour.", pt: "Eu estou esperando por você há uma hora." },
        { label: "two hours", replacement: "I have been waiting for you for two hours.", pt: "Eu estou esperando por você há duas horas." },
        { label: "a long time", replacement: "I have been waiting for you for a long time.", pt: "Eu estou esperando por você há muito tempo." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-18",
      original: "She has been calling you all morning. / all day / all afternoon",
      options: [
        { label: "all morning", replacement: "She has been calling you all morning.", pt: "Ela está te ligando a manhã toda." },
        { label: "all day", replacement: "She has been calling you all day.", pt: "Ela está te ligando o dia todo." },
        { label: "all afternoon", replacement: "She has been calling you all afternoon.", pt: "Ela está te ligando a tarde toda." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-19",
      original: "They have been waiting for the bus since 8am. / since 7am / for an hour",
      options: [
        { label: "since 8am", replacement: "They have been waiting for the bus since 8am.", pt: "Eles estão esperando o ônibus desde as 8h." },
        { label: "since 7am", replacement: "They have been waiting for the bus since 7am.", pt: "Eles estão esperando o ônibus desde as 7h." },
        { label: "for an hour", replacement: "They have been waiting for the bus for an hour.", pt: "Eles estão esperando o ônibus há uma hora." },
      ],
      currentIndex: 0,
    },
    {
      key: "real-20",
      original: "Did you have a barbecue last weekend? / last month / last Sunday",
      options: [
        { label: "last weekend", replacement: "Did you have a barbecue last weekend?", pt: "Você fez um churrasco no fim de semana passado?" },
        { label: "last month", replacement: "Did you have a barbecue last month?", pt: "Você fez um churrasco no mês passado?" },
        { label: "last Sunday", replacement: "Did you have a barbecue last Sunday?", pt: "Você fez um churrasco no domingo passado?" },
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...vocabSubstitution,
    ...phrasesSubstitution,
    ...grammarSubstitution,
    ...realLifeSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "I'm in a hurry.",
      pt: "Estou com pressa.",
      green: ["hurry"]
    },
    {
      en: "Hurry up! We're late.",
      pt: "Apresse-se! Nós estamos atrasados.",
      green: ["Hurry", "late"]
    },
    {
      en: "He's always on time.",
      pt: "Ele está sempre no horário.",
      green: ["always", "time"]
    }
  ];

  const realLifeData = [
    { en: "I need to call my mother now.", pt: "Eu preciso ligar para minha mãe agora.", parts: [{ text: "I ", h: false }, { text: "need", h: true }, { text: " to ", h: false }, { text: "call", h: true }, { text: " my ", h: false }, { text: "mother", h: true }, { text: " now.", h: false }] },
    { en: "She always calls me on my birthday.", pt: "Ela sempre me liga no meu aniversário.", parts: [{ text: "She ", h: false }, { text: "always", h: true }, { text: " ", h: false }, { text: "calls", h: true }, { text: " me on my ", h: false }, { text: "birthday", h: true }, { text: ".", h: false }] },
    { en: "Call your father. He is worried.", pt: "Ligue para seu pai. Ele está preocupado.", parts: [{ text: "Call", h: true }, { text: " your ", h: false }, { text: "father", h: true }, { text: ". He is ", h: false }, { text: "worried", h: true }, { text: ".", h: false }] },
    { en: "I have to wait for my brother here.", pt: "Eu tenho que esperar pelo meu irmão aqui.", parts: [{ text: "I have to ", h: false }, { text: "wait", h: true }, { text: " for my ", h: false }, { text: "brother", h: true }, { text: " here.", h: false }] },
    { en: "I'm late, so don't wait for me.", pt: "Eu estou atrasado, então não espere por mim.", parts: [{ text: "I'm ", h: false }, { text: "late", h: true }, { text: ", so ", h: false }, { text: "don't", h: true }, { text: " ", h: false }, { text: "wait", h: true }, { text: " for me.", h: false }] },
    { en: "Dinner is almost ready.", pt: "O jantar está quase pronto.", parts: [{ text: "Dinner", h: true }, { text: " is ", h: false }, { text: "almost", h: true }, { text: " ", h: false }, { text: "ready", h: true }, { text: ".", h: false }] },
    { en: "I often read books in English.", pt: "Eu frequentemente leio livros em inglês.", parts: [{ text: "I ", h: false }, { text: "often", h: true }, { text: " ", h: false }, { text: "read", h: true }, { text: " books in ", h: false }, { text: "English", h: true }, { text: ".", h: false }] },
    { en: "He is never in a hurry.", pt: "Ele nunca está com pressa.", parts: [{ text: "He is ", h: false }, { text: "never", h: true }, { text: " in a ", h: false }, { text: "hurry", h: true }, { text: ".", h: false }] },
    { en: "How often do you see your cousins?", pt: "Com que frequência você vê seus primos?", parts: [{ text: "How ", h: false }, { text: "often", h: true }, { text: " do you ", h: false }, { text: "see", h: true }, { text: " your ", h: false }, { text: "cousins", h: true }, { text: "?", h: false }] },
    { en: "Somebody wants to speak with you.", pt: "Alguém quer falar com você.", parts: [{ text: "Somebody", h: true }, { text: " wants to ", h: false }, { text: "speak", h: true }, { text: " with you.", h: false }] },
    { en: "She doesn't want to see anybody.", pt: "Ela não quer ver ninguém.", parts: [{ text: "She ", h: false }, { text: "doesn't", h: true }, { text: " want to ", h: false }, { text: "see", h: true }, { text: " ", h: false }, { text: "anybody", h: true }, { text: ".", h: false }] },
    { en: "Do you know anybody in Germany?", pt: "Você conhece alguém na Alemanha?", parts: [{ text: "Do you ", h: false }, { text: "know", h: true }, { text: " ", h: false }, { text: "anybody", h: true }, { text: " in ", h: false }, { text: "Germany", h: true }, { text: "?", h: false }] },
    { en: "Did you call your mother yesterday?", pt: "Você ligou para sua mãe ontem?", parts: [{ text: "Did you ", h: false }, { text: "call", h: true }, { text: " your ", h: false }, { text: "mother", h: true }, { text: " ", h: false }, { text: "yesterday", h: true }, { text: "?", h: false }] },
    { en: "She didn't call me last week.", pt: "Ela não me ligou na semana passada.", parts: [{ text: "She ", h: false }, { text: "didn't", h: true }, { text: " ", h: false }, { text: "call", h: true }, { text: " me ", h: false }, { text: "last week", h: true }, { text: ".", h: false }] },
    { en: "I will call you as soon as I arrive.", pt: "Eu vou te ligar assim que eu chegar.", parts: [{ text: "I ", h: false }, { text: "will", h: true }, { text: " ", h: false }, { text: "call", h: true }, { text: " you as soon as I ", h: false }, { text: "arrive", h: true }, { text: ".", h: false }] },
    { en: "Will you wait for me at the station?", pt: "Você vai me esperar na estação?", parts: [{ text: "Will you ", h: false }, { text: "wait", h: true }, { text: " for me at the ", h: false }, { text: "station", h: true }, { text: "?", h: false }] },
    { en: "I have been waiting for you for an hour.", pt: "Eu estou esperando por você há uma hora.", parts: [{ text: "I have been ", h: false }, { text: "waiting", h: true }, { text: " for you for ", h: false }, { text: "an hour", h: true }, { text: ".", h: false }] },
    { en: "She has been calling you all morning.", pt: "Ela está te ligando a manhã toda.", parts: [{ text: "She has been ", h: false }, { text: "calling", h: true }, { text: " you ", h: false }, { text: "all morning", h: true }, { text: ".", h: false }] },
    { en: "They have been waiting for the bus since 8am.", pt: "Eles estão esperando o ônibus desde as 8h.", parts: [{ text: "They have been ", h: false }, { text: "waiting", h: true }, { text: " for the bus ", h: false }, { text: "since 8am", h: true }, { text: ".", h: false }] },
    { en: "Did you have a barbecue last weekend?", pt: "Você fez um churrasco no fim de semana passado?", parts: [{ text: "Did you have a ", h: false }, { text: "barbecue", h: true }, { text: " ", h: false }, { text: "last weekend", h: true }, { text: "?", h: false }] },
  ];

  const newWordsData = [
    { en: "beverage", pt: "bebida" },
    { en: "bar", pt: "bar" },
    { en: "barbecue", pt: "churrasco" },
    { en: "chef", pt: "chefe de cozinha" },
    { en: "vegetarian", pt: "vegetariano(a)" },
    { en: "vegan", pt: "vegano(a)" },
    { en: "comfortable", pt: "confortável" },
    { en: "almost", pt: "quase" },
    { en: "always", pt: "sempre" },
    { en: "often", pt: "frequentemente" },
    { en: "never", pt: "nunca" },
    { en: "somebody", pt: "alguém" },
    { en: "anybody", pt: "alguém, ninguém, qualquer um" },
    { en: "so", pt: "então, tão, depois" },
    { en: "how often", pt: "com que frequência" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/restaurant-bg.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Hero Image */}
        <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="/images/lesson47-hero.jpg"
              alt="Person ordering food delivery on phone at restaurant table"
              fill
              className="object-cover"
              style={{ objectPosition: "center 40%" }}
              priority
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.style.backgroundColor = '#1e40af';
                  parent.style.backgroundImage = 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=400&fit=crop")';
                  parent.style.backgroundSize = 'cover';
                  parent.style.backgroundPosition = 'center';
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-6">
              <p className="text-white text-xl md:text-2xl font-bold text-center drop-shadow-lg">
                🍕 <SpeakText text="I need to call the restaurant!" className="text-white hover:text-yellow-200">I need to call the restaurant!</SpeakText> 📞
              </p>
            </div>
          </div>
        </div>

        {/* Título centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🍽️ LESSON 47 – EATING OUT
          </h1>
          <SpeakSentence text="Learn to talk about restaurants, make orders and express food preferences." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍔🥗 Learn to talk about restaurants, make orders and express food preferences! 🍔🥗
          </SpeakSentence>
        </div>

        {/* Seção 1 - Verbs */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              </div>
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
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to call" className="text-blue-600 font-bold">to call</SpeakText> = chamar / ligar
              </li>
              <li>
                <SpeakText text="to wait" className="text-blue-600 font-bold">to wait</SpeakText> = esperar
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

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              </div>
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
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWordsData.map((word, idx) => (
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

        {/* Seção 3 - Speak Like a Native */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              </div>
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
            <SpeakSentence text="Practice common phrases used in real restaurants" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases used in real restaurants
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

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 GRAMMAR - Somebody / Anybody</h2>
              </div>
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
            <SpeakSentence text="Grammar structures with somebody / anybody" className="text-md text-gray-600 mb-4 italic">
              📚 Grammar structures with somebody / anybody
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Somebody is upset about this problem." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Somebody is upset about this problem.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Alguém está chateado com esse problema.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="We need somebody to make their dinner." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  We need somebody to make their dinner.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Nós precisamos de alguém para fazer o jantar deles.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="I don't know anybody here." className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  I don't know anybody here.
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Eu não conheço ninguém aqui.</div>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <SpeakSentence text="Does anybody speak English here?" className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                  Does anybody speak English here?
                </SpeakSentence>
                <div className="text-gray-600 text-sm mt-1">Alguém fala inglês aqui?</div>
              </div>
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

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS!</h2>
                <p className="mt-2 text-blue-100 italic text-sm">
                  Substitua as palavras em <span className="text-blue-300 font-bold">azul</span> por outras palavras que você já aprendeu para criar novas frases e praticar sua pronúncia.
                </p>
              </div>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.realLife ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {realLifeData.map((s, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-start">
                      <SpeakSentence text={s.en} className="text-base font-medium">
                        {idx+1}. {s.parts.map((part, pIdx) => (
                          part.h ? (
                            <span key={pIdx} className="text-blue-600 font-bold">{part.text}</span>
                          ) : (
                            <span key={pIdx}>{part.text}</span>
                          )
                        ))}
                      </SpeakSentence>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {openDrills.realLife && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {realLifeSubstitution.map((ex) => {
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

        {/* Seção 6 - Wrap Up */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-blue-100 italic">
                📝 Key expressions and useful vocabulary to remember
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              <div className="space-y-4">
                {[
                  { en: "I'm in a hurry.", pt: "Estou com pressa." },
                  { en: "Hurry up! We're late.", pt: "Apresse-se! Nós estamos atrasados." },
                  { en: "He's always on time.", pt: "Ele está sempre no horário." },
                  { en: "Somebody wants to speak with you.", pt: "Alguém quer falar com você." },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center mb-1">
                      <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                    </div>
                    <p className="text-blue-200 text-sm">{item.pt}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <SpeakSentence text="I need to call the restaurant!">
                  <span className="font-bold">I need to call the restaurant!</span>
                </SpeakSentence>
                <p className="text-sm text-gray-600 mt-1">Eu preciso ligar para o restaurante!</p>
              </div>
            </div>

            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">GOODBYES</h3>
              <div className="space-y-4">
                {[
                  { en: "Bye! See you.", pt: "Tchau! Até mais." },
                  { en: "See you later.", pt: "Até mais tarde." },
                  { en: "Good night!", pt: "Boa noite!" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center mb-1">
                      <SpeakSentence text={item.en} className="text-blue-200 hover:text-white">• {item.en}</SpeakSentence>
                    </div>
                    <p className="text-blue-200 text-sm">{item.pt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson46")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson48")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

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
        @keyframes glow {
          0% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
          50% { box-shadow: 0 0 20px #3b82f6, 0 0 30px #3b82f6; }
          100% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
        }
        .active\:animate-glow:active {
          animation: glow 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}