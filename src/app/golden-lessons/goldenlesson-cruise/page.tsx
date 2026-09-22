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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-green-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />}
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
      className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300">Salvar Anotação</button>
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
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
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
                ? 'bg-green-500 text-white'
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
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-green-600 font-bold">{word}</span>;
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

// ============================================
// OPEN-ENDED QUESTION COMPONENT
// ============================================
function OpenQuestion({ question, hint, translation }: { question: string; hint?: string; translation?: string }) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg">
      <div className="flex items-start gap-2">
        <span className="text-amber-600 text-xl flex-shrink-0">💬</span>
        <div className="flex-1">
          <SpeakSentence text={question} className="text-base font-semibold text-amber-900">
            {question}
          </SpeakSentence>
          {translation && (
            <p className="text-sm text-amber-700 mt-1 italic">🇧🇷 {translation}</p>
          )}
          {hint && (
            <div className="mt-2">
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="text-xs px-2 py-1 rounded-full bg-amber-200 text-amber-800 hover:bg-amber-300 transition-colors font-bold"
              >
                {showHint ? "Ocultar dica" : "💡 Ver dica de resposta"}
              </button>
              {showHint && (
                <p className="text-sm text-amber-800 mt-2 bg-white p-2 rounded border border-amber-200">
                  {hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON: CRUISE TRAVEL
// ============================================
export default function LessonCruiseTravel() {
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

  // ===== IMAGENS =====
  const mainImage = "https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const foodImage = "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const drinksImage = "https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const activitiesImage = "https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const cabinImage = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================================
  // SUBSTITUTION EXERCISES
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu embarco no navio. / ela / nós",
      options: [
        { label: "Eu", replacement: "I board the ship." },
        { label: "Ela", replacement: "She boards the ship." },
        { label: "Nós", replacement: "We board the ship." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ele explora as ilhas. / ela / eles",
      options: [
        { label: "Ele", replacement: "He explores the islands." },
        { label: "Ela", replacement: "She explores the islands." },
        { label: "Eles", replacement: "They explore the islands." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu relaxo no deck. / ela / nós",
      options: [
        { label: "Eu", replacement: "I relax on the deck." },
        { label: "Ela", replacement: "She relaxes on the deck." },
        { label: "Nós", replacement: "We relax on the deck." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ela nada na piscina. / ele / eles",
      options: [
        { label: "Ela", replacement: "She swims in the pool." },
        { label: "Ele", replacement: "He swims in the pool." },
        { label: "Eles", replacement: "They swim in the pool." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu provo comidas locais. / ela / nós",
      options: [
        { label: "Eu", replacement: "I try local food." },
        { label: "Ela", replacement: "She tries local food." },
        { label: "Nós", replacement: "We try local food." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Ele dança no show. / ela / eles",
      options: [
        { label: "Ele", replacement: "He dances at the show." },
        { label: "Ela", replacement: "She dances at the show." },
        { label: "Eles", replacement: "They dance at the show." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu como no buffet. / restaurante / jantar",
      options: [
        { label: "buffet", replacement: "I eat at the buffet." },
        { label: "restaurante", replacement: "I eat at the restaurant." },
        { label: "jantar", replacement: "I eat at the dinner." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ela bebe um coquetel no bar. / suco / refrigerante",
      options: [
        { label: "coquetel", replacement: "She drinks a cocktail at the bar." },
        { label: "suco", replacement: "She drinks a juice at the bar." },
        { label: "refrigerante", replacement: "She drinks a soda at the bar." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu janto no restaurante italiano. / japonês / mexicano",
      options: [
        { label: "italiano", replacement: "I have dinner at the Italian restaurant." },
        { label: "japonês", replacement: "I have dinner at the Japanese restaurant." },
        { label: "mexicano", replacement: "I have dinner at the Mexican restaurant." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Ela pede uma sobremesa. / entrada / prato principal",
      options: [
        { label: "sobremesa", replacement: "She orders a dessert." },
        { label: "entrada", replacement: "She orders an appetizer." },
        { label: "prato principal", replacement: "She orders a main course." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu tomo café da manhã no deck. / almoço / jantar",
      options: [
        { label: "café da manhã", replacement: "I have breakfast on the deck." },
        { label: "almoço", replacement: "I have lunch on the deck." },
        { label: "jantar", replacement: "I have dinner on the deck." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Ela bebe água de coco. / vinho / cerveja",
      options: [
        { label: "água de coco", replacement: "She drinks coconut water." },
        { label: "vinho", replacement: "She drinks wine." },
        { label: "cerveja", replacement: "She drinks beer." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu vou ao cassino à noite. / teatro / cinema",
      options: [
        { label: "cassino", replacement: "I go to the casino at night." },
        { label: "teatro", replacement: "I go to the theater at night." },
        { label: "cinema", replacement: "I go to the cinema at night." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela faz uma aula de dança. / ioga / culinária",
      options: [
        { label: "dança", replacement: "She takes a dance class." },
        { label: "ioga", replacement: "She takes a yoga class." },
        { label: "culinária", replacement: "She takes a cooking class." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu assisto ao show no teatro. / concerto / comédia",
      options: [
        { label: "show", replacement: "I watch the show in the theater." },
        { label: "concerto", replacement: "I watch the concert in the theater." },
        { label: "comédia", replacement: "I watch the comedy in the theater." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela participa de um quiz. / jogo / torneio",
      options: [
        { label: "quiz", replacement: "She joins a quiz." },
        { label: "jogo", replacement: "She joins a game." },
        { label: "torneio", replacement: "She joins a tournament." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu faço uma excursão na ilha. / passeio / caminhada",
      options: [
        { label: "excursão", replacement: "I take a shore excursion on the island." },
        { label: "passeio", replacement: "I take a tour on the island." },
        { label: "caminhada", replacement: "I take a hike on the island." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Ela compra lembranças na loja. / presentes / roupas",
      options: [
        { label: "lembranças", replacement: "She buys souvenirs at the shop." },
        { label: "presentes", replacement: "She buys gifts at the shop." },
        { label: "roupas", replacement: "She buys clothes at the shop." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Eu aproveito o pôr do sol no deck. / nascer do sol / a vista",
      options: [
        { label: "pôr do sol", replacement: "I enjoy the sunset on the deck." },
        { label: "nascer do sol", replacement: "I enjoy the sunrise on the deck." },
        { label: "a vista", replacement: "I enjoy the view on the deck." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-14",
      original: "Ela usa o spa à tarde. / academia / sauna",
      options: [
        { label: "spa", replacement: "She uses the spa in the afternoon." },
        { label: "academia", replacement: "She uses the gym in the afternoon." },
        { label: "sauna", replacement: "She uses the sauna in the afternoon." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Este assento está disponível? / mesa / espreguiçadeira",
      options: [
        { label: "assento", replacement: "Is this seat available?" },
        { label: "mesa", replacement: "Is this table available?" },
        { label: "espreguiçadeira", replacement: "Is this lounge chair available?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Você pode me trazer o cardápio? / a conta / um guardanapo",
      options: [
        { label: "cardápio", replacement: "Can you bring me the menu?" },
        { label: "a conta", replacement: "Can you bring me the bill?" },
        { label: "um guardanapo", replacement: "Can you bring me a napkin?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu gostaria de um copo de água. / suco / vinho",
      options: [
        { label: "água", replacement: "I would like a glass of water." },
        { label: "suco", replacement: "I would like a glass of juice." },
        { label: "vinho", replacement: "I would like a glass of wine." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Que horas começa o show? / o jantar / a excursão",
      options: [
        { label: "show", replacement: "What time does the show start?" },
        { label: "jantar", replacement: "What time does the dinner start?" },
        { label: "excursão", replacement: "What time does the excursion start?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Onde fica a piscina? / o restaurante / o spa",
      options: [
        { label: "piscina", replacement: "Where is the pool?" },
        { label: "restaurante", replacement: "Where is the restaurant?" },
        { label: "spa", replacement: "Where is the spa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu gostaria de reservar uma mesa. / uma excursão / um tratamento",
      options: [
        { label: "mesa", replacement: "I would like to reserve a table." },
        { label: "excursão", replacement: "I would like to reserve an excursion." },
        { label: "tratamento", replacement: "I would like to reserve a treatment." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Você recomenda algum prato? / bebida / restaurante",
      options: [
        { label: "prato", replacement: "Do you recommend any dish?" },
        { label: "bebida", replacement: "Do you recommend any drink?" },
        { label: "restaurante", replacement: "Do you recommend any restaurant?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Estou procurando o elevador. / a recepção / o cassino",
      options: [
        { label: "elevador", replacement: "I am looking for the elevator." },
        { label: "recepção", replacement: "I am looking for the reception." },
        { label: "cassino", replacement: "I am looking for the casino." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu geralmente janto às sete. / ela / nós",
      options: [
        { label: "Eu", replacement: "I usually have dinner at seven." },
        { label: "Ela", replacement: "She usually has dinner at seven." },
        { label: "Nós", replacement: "We usually have dinner at seven." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela vai à piscina todas as manhãs. / ele / eles",
      options: [
        { label: "Ela", replacement: "She goes to the pool every morning." },
        { label: "Ele", replacement: "He goes to the pool every morning." },
        { label: "Eles", replacement: "They go to the pool every morning." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não gosta de acordar cedo. / ela / eu",
      options: [
        { label: "Ele", replacement: "He doesn't like waking up early." },
        { label: "Ela", replacement: "She doesn't like waking up early." },
        { label: "Eu", replacement: "I don't like waking up early." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você já viajou em um cruzeiro? / ela / eles",
      options: [
        { label: "Você", replacement: "Have you ever traveled on a cruise?" },
        { label: "Ela", replacement: "Has she ever traveled on a cruise?" },
        { label: "Eles", replacement: "Have they ever traveled on a cruise?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu estou aproveitando a viagem. / ela / nós",
      options: [
        { label: "Eu", replacement: "I am enjoying the trip." },
        { label: "Ela", replacement: "She is enjoying the trip." },
        { label: "Nós", replacement: "We are enjoying the trip." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Nós vamos visitar a ilha amanhã. / eles / eu",
      options: [
        { label: "Nós", replacement: "We are going to visit the island tomorrow." },
        { label: "Eles", replacement: "They are going to visit the island tomorrow." },
        { label: "Eu", replacement: "I am going to visit the island tomorrow." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu prefiro um quarto com varanda. / janela / vista para o mar",
      options: [
        { label: "varanda", replacement: "I prefer a cabin with a balcony." },
        { label: "janela", replacement: "I prefer a cabin with a window." },
        { label: "vista para o mar", replacement: "I prefer a cabin with an ocean view." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Ela costuma pedir sobremesa depois do jantar. / café / chá",
      options: [
        { label: "sobremesa", replacement: "She usually orders dessert after dinner." },
        { label: "café", replacement: "She usually orders coffee after dinner." },
        { label: "chá", replacement: "She usually orders tea after dinner." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eu tenho dançado todas as noites. / cantado / relaxado",
      options: [
        { label: "dançado", replacement: "I have been dancing every night." },
        { label: "cantado", replacement: "I have been singing every night." },
        { label: "relaxado", replacement: "I have been relaxing every night." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu preciso acordar cedo amanhã. / ela / eles",
      options: [
        { label: "Eu", replacement: "I need to wake up early tomorrow." },
        { label: "Ela", replacement: "She needs to wake up early tomorrow." },
        { label: "Eles", replacement: "They need to wake up early tomorrow." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Ela está indo ao cassino agora. / teatro / show",
      options: [
        { label: "cassino", replacement: "She is going to the casino now." },
        { label: "teatro", replacement: "She is going to the theater now." },
        { label: "show", replacement: "She is going to the show now." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Eu gostaria de visitar mais ilhas. / praias / cidades",
      options: [
        { label: "ilhas", replacement: "I would like to visit more islands." },
        { label: "praias", replacement: "I would like to visit more beaches." },
        { label: "cidades", replacement: "I would like to visit more cities." }
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

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "I usually have breakfast on the deck while the ship arrives at the island.",
      pt: "Eu geralmente tomo café da manhã no deck enquanto o navio chega à ilha.",
      green: ["breakfast", "deck", "island"]
    },
    {
      en: "Would you like to try the seafood buffet tonight?",
      pt: "Você gostaria de experimentar o buffet de frutos do mar hoje à noite?",
      green: ["seafood", "buffet", "tonight"]
    },
    {
      en: "What time does the show start in the main theater?",
      pt: "Que horas começa o show no teatro principal?",
      green: ["show", "theater"]
    },
    {
      en: "Can I get a tropical cocktail at the pool bar?",
      pt: "Posso pedir um coquetel tropical no bar da piscina?",
      green: ["cocktail", "pool", "bar"]
    },
    {
      en: "I would like to reserve a table for two at the Italian restaurant.",
      pt: "Eu gostaria de reservar uma mesa para dois no restaurante italiano.",
      green: ["reserve", "table", "restaurant"]
    },
    {
      en: "We are going to join a shore excursion tomorrow morning.",
      pt: "Nós vamos participar de uma excursão em terra amanhã de manhã.",
      green: ["shore", "excursion", "tomorrow"]
    }
  ];

  // Dados das Open-Ended Questions
  const openQuestionsData = [
    {
      question: "Have you ever traveled on a cruise? If yes, where did you go? If not, would you like to?",
      translation: "Você já viajou em um cruzeiro? Se sim, para onde você foi? Se não, você gostaria?",
      hint: "Yes, I have. I traveled to the Caribbean last year. / No, I haven't, but I would love to visit the Bahamas."
    },
    {
      question: "What is your favorite type of food to eat on a cruise ship? Why?",
      translation: "Qual é o seu tipo favorito de comida para comer em um navio de cruzeiro? Por quê?",
      hint: "My favorite type of food is seafood because I love fresh fish and the ocean view."
    },
    {
      question: "What activities would you like to do on a cruise ship during the day?",
      translation: "Quais atividades você gostaria de fazer em um navio de cruzeiro durante o dia?",
      hint: "I would like to swim in the pool, take a yoga class, and relax on the deck."
    },
    {
      question: "What is your favorite drink to have on vacation? Do you prefer cocktails, juice, or something else?",
      translation: "Qual é a sua bebida favorita para tomar nas férias? Você prefere coquetéis, suco ou outra coisa?",
      hint: "I prefer a tropical cocktail with pineapple and coconut. It reminds me of the beach."
    },
    {
      question: "Would you rather explore a new island or stay on the ship and relax? Why?",
      translation: "Você preferiria explorar uma nova ilha ou ficar no navio e relaxar? Por quê?",
      hint: "I would rather explore a new island because I love discovering new places and trying local food."
    },
    {
      question: "What would you pack for a seven-day cruise? Name at least five items.",
      translation: "O que você levaria para um cruzeiro de sete dias? Cite pelo menos cinco itens.",
      hint: "I would pack sunscreen, a swimsuit, sunglasses, a hat, and comfortable shoes."
    },
    {
      question: "Do you prefer a cabin with a balcony or an interior cabin? Why?",
      translation: "Você prefere uma cabine com varanda ou uma cabine interna? Por quê?",
      hint: "I prefer a cabin with a balcony because I love watching the sunset from my room."
    },
    {
      question: "What kind of entertainment do you enjoy the most on a cruise: shows, casinos, or live music?",
      translation: "Que tipo de entretenimento você mais gosta em um cruzeiro: shows, cassinos ou música ao vivo?",
      hint: "I enjoy live music the most because I love dancing with my friends."
    },
    {
      question: "If you could choose any destination for a cruise, where would you go and why?",
      translation: "Se você pudesse escolher qualquer destino para um cruzeiro, para onde você iria e por quê?",
      hint: "I would choose the Greek Islands because of the beautiful beaches and the delicious Mediterranean food."
    },
    {
      question: "What is the best part of traveling by cruise ship compared to traveling by plane?",
      translation: "Qual é a melhor parte de viajar de navio de cruzeiro em comparação com viajar de avião?",
      hint: "The best part is that you can relax, enjoy many activities, and visit different places without packing again."
    }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1167021/pexels-photo-1167021.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🚢 Cruise Travel - Food, Drinks & Activities</h1>
          <SpeakSentence text="Learn to talk about cruise travel: food, drinks, activities on board, and shore excursions." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about cruise travel: food, drinks, activities on board, and shore excursions.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Cruise travel"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS - Cruise Actions</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to board" className="text-green-600 font-bold">to board</SpeakText> = embarcar</li>
              <li><SpeakText text="to explore" className="text-green-600 font-bold">to explore</SpeakText> = explorar</li>
              <li><SpeakText text="to relax" className="text-green-600 font-bold">to relax</SpeakText> = relaxar</li>
              <li><SpeakText text="to swim" className="text-green-600 font-bold">to swim</SpeakText> = nadar</li>
              <li><SpeakText text="to try" className="text-green-600 font-bold">to try</SpeakText> = provar / experimentar</li>
              <li><SpeakText text="to dance" className="text-green-600 font-bold">to dance</SpeakText> = dançar</li>
              <li><SpeakText text="to enjoy" className="text-green-600 font-bold">to enjoy</SpeakText> = aproveitar</li>
              <li><SpeakText text="to reserve" className="text-green-600 font-bold">to reserve</SpeakText> = reservar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS - Food, Drinks & Activities</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-700 mb-2">🍽️ Food</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><SpeakText text="buffet">buffet</SpeakText> = buffet</li>
                  <li><SpeakText text="seafood">seafood</SpeakText> = frutos do mar</li>
                  <li><SpeakText text="dessert">dessert</SpeakText> = sobremesa</li>
                  <li><SpeakText text="appetizer">appetizer</SpeakText> = entrada</li>
                  <li><SpeakText text="main course">main course</SpeakText> = prato principal</li>
                  <li><SpeakText text="steak">steak</SpeakText> = bife</li>
                  <li><SpeakText text="pasta">pasta</SpeakText> = massa</li>
                  <li><SpeakText text="salad">salad</SpeakText> = salada</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-700 mb-2">🥤 Drinks</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><SpeakText text="cocktail">cocktail</SpeakText> = coquetel</li>
                  <li><SpeakText text="juice">juice</SpeakText> = suco</li>
                  <li><SpeakText text="soda">soda</SpeakText> = refrigerante</li>
                  <li><SpeakText text="wine">wine</SpeakText> = vinho</li>
                  <li><SpeakText text="beer">beer</SpeakText> = cerveja</li>
                  <li><SpeakText text="coconut water">coconut water</SpeakText> = água de coco</li>
                  <li><SpeakText text="coffee">coffee</SpeakText> = café</li>
                  <li><SpeakText text="tea">tea</SpeakText> = chá</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h3 className="font-bold text-green-700 mb-2">🎉 Activities</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><SpeakText text="pool">pool</SpeakText> = piscina</li>
                  <li><SpeakText text="spa">spa</SpeakText> = spa</li>
                  <li><SpeakText text="gym">gym</SpeakText> = academia</li>
                  <li><SpeakText text="casino">casino</SpeakText> = cassino</li>
                  <li><SpeakText text="theater">theater</SpeakText> = teatro</li>
                  <li><SpeakText text="shore excursion">shore excursion</SpeakText> = excursão em terra</li>
                  <li><SpeakText text="quiz">quiz</SpeakText> = quiz</li>
                  <li><SpeakText text="dance class">dance class</SpeakText> = aula de dança</li>
                </ul>
              </div>
            </div>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 3 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for real cruise situations" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for real cruise situations
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
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Present Simple, Present Continuous & Present Perfect</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-emerald-600 hover:to-emerald-800"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Present simple for routines, present continuous for actions now, and present perfect for experiences" className="text-md text-gray-600 mb-4 italic">
              📚 Present simple for routines, present continuous for actions now, and present perfect for experiences
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Cruise Travel"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">Present Simple</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>rotinas</strong> e <strong>hábitos</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>usually have</strong> breakfast on the deck.</p>
                <p className="text-xs text-gray-500">Eu geralmente tomo café da manhã no deck.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Present Continuous</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>ações agora</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>am enjoying</strong> the trip.</p>
                <p className="text-xs text-gray-500">Eu estou aproveitando a viagem.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
                <h3 className="font-bold text-green-700 mb-2">Present Perfect</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>experiências</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2"><strong>Have</strong> you ever <strong>traveled</strong> on a cruise?</p>
                <p className="text-xs text-gray-500">Você já viajou em um cruzeiro?</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "I usually have breakfast on the deck.", pt: "Eu geralmente tomo café da manhã no deck." },
                { en: "She goes to the pool every morning.", pt: "Ela vai à piscina todas as manhãs." },
                { en: "He doesn't like waking up early.", pt: "Ele não gosta de acordar cedo." },
                { en: "Have you ever traveled on a cruise?", pt: "Você já viajou em um cruzeiro?" },
                { en: "I am enjoying the trip a lot.", pt: "Eu estou aproveitando muito a viagem." },
                { en: "We are going to visit the island tomorrow.", pt: "Nós vamos visitar a ilha amanhã." },
                { en: "I prefer a cabin with a balcony.", pt: "Eu prefiro uma cabine com varanda." },
                { en: "She usually orders dessert after dinner.", pt: "Ela costuma pedir sobremesa depois do jantar." },
                { en: "I have been dancing every night.", pt: "Eu tenho dançado todas as noites." },
                { en: "I need to wake up early tomorrow.", pt: "Eu preciso acordar cedo amanhã." },
                { en: "She is going to the casino now.", pt: "Ela está indo ao cassino agora." },
                { en: "I would like to visit more islands.", pt: "Eu gostaria de visitar mais ilhas." },
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
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-green-100">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "I usually have breakfast on the deck while the ship arrives at the island.", pt: "Eu geralmente tomo café da manhã no deck enquanto o navio chega à ilha." },
                    { en: "Would you like to try the seafood buffet tonight?", pt: "Você gostaria de experimentar o buffet de frutos do mar hoje à noite?" },
                    { en: "What time does the show start in the main theater?", pt: "Que horas começa o show no teatro principal?" },
                    { en: "Can I get a tropical cocktail at the pool bar?", pt: "Posso pedir um coquetel tropical no bar da piscina?" },
                    { en: "I would like to reserve a table for two at the Italian restaurant.", pt: "Eu gostaria de reservar uma mesa para dois no restaurante italiano." },
                    { en: "We are going to join a shore excursion tomorrow morning.", pt: "Nós vamos participar de uma excursão em terra amanhã de manhã." },
                    { en: "My favorite dessert on the ship is chocolate cake.", pt: "Minha sobremesa favorita no navio é bolo de chocolate." },
                    { en: "She drinks coconut water after her yoga class.", pt: "Ela bebe água de coco depois da aula de ioga." },
                    { en: "I have been relaxing at the spa every afternoon.", pt: "Eu tenho relaxado no spa todas as tardes." },
                    { en: "Have you ever danced at a deck party?", pt: "Você já dançou em uma festa no deck?" },
                    { en: "I prefer a cabin with an ocean view.", pt: "Eu prefiro uma cabine com vista para o mar." },
                    { en: "Is this lounge chair available?", pt: "Esta espreguiçadeira está disponível?" },
                  ].map((s, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium">
                          {idx+1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={foodImage} alt="Cruise food" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Delicious cruise food 🍽️</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={drinksImage} alt="Cruise drinks" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Tropical drinks at the bar 🍹</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={activitiesImage} alt="Cruise activities" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Fun activities on board 🎉</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – OPEN-ENDED QUESTIONS ===================== */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🗣️ OPEN-ENDED QUESTIONS - Let's Talk!</h2>
            <SpeakSentence text="Answer these questions with your own ideas. There is no right or wrong answer!" className="mt-2 text-amber-100 italic">
              💬 Answer these questions with your own ideas. There is no right or wrong answer!
            </SpeakSentence>
          </div>
          <div className="p-8 space-y-4">
            {openQuestionsData.map((q, idx) => (
              <OpenQuestion
                key={idx}
                question={`${idx + 1}. ${q.question}`}
                translation={q.translation}
                hint={q.hint}
              />
            ))}
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-green-100 italic">
                📝 Key expressions and useful vocabulary to remember
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "I usually have breakfast on the deck.", pt: "Eu geralmente tomo café da manhã no deck." },
                { en: "Would you like to try the seafood buffet?", pt: "Você gostaria de experimentar o buffet de frutos do mar?" },
                { en: "Can I get a tropical cocktail at the pool bar?", pt: "Posso pedir um coquetel tropical no bar da piscina?" },
                { en: "What time does the show start?", pt: "Que horas começa o show?" },
                { en: "I would like to reserve a table for two.", pt: "Eu gostaria de reservar uma mesa para dois." },
                { en: "We are going to join a shore excursion.", pt: "Nós vamos participar de uma excursão em terra." },
                { en: "Have you ever traveled on a cruise?", pt: "Você já viajou em um cruzeiro?" },
                { en: "I prefer a cabin with an ocean view.", pt: "Eu prefiro uma cabine com vista para o mar." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-green-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-green-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-green-200">
                    <li>Use <strong className="text-white">"I would like..."</strong> to order politely.</li>
                    <li>Use <strong className="text-white">"Have you ever...?"</strong> to ask about experiences.</li>
                    <li>Use <strong className="text-white">"usually"</strong> before the main verb for routines.</li>
                    <li><strong className="text-white">"Shore excursion"</strong> means a short trip on land during a cruise.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">On a cruise, you can enjoy food, drinks, entertainment, and explore new destinations — all in one trip!</p>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <p className="text-green-200 text-sm italic">
                    🌟 <strong>Substitute the words in green</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson61")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (61)
          </button>
          <button onClick={() => router.push("/cursos/lesson63")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (63) &rarr;
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
              alt="Cruise travel – ampliada"
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