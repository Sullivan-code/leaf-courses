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
          {currentPt && (
            <p className="text-sm text-gray-600 mt-1 border-t border-green-200 pt-1">🇧🇷 {currentPt}</p>
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS EM VERDE
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
// MAIN COMPONENT – LESSON 63
// ============================================
export default function Lesson63MyHouseRoutine() {
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

  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2023_39_19%20(1).png?raw=true";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2023_04_40.png?raw=true";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "dividir, compartilhar / Eu divido, compartilho. / nós / eles",
      options: [
        { label: "dividir", replacement: "to share.", pt: "dividir, compartilhar" },
        { label: "Eu", replacement: "I share.", pt: "Eu divido, compartilho." },
        { label: "Nós", replacement: "We share.", pt: "Nós dividimos, compartilhamos." },
        { label: "Eles", replacement: "They share.", pt: "Eles dividem, compartilham." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "alugar / Eu alugo. / ele / nós",
      options: [
        { label: "alugar", replacement: "to rent.", pt: "alugar" },
        { label: "Eu", replacement: "I rent.", pt: "Eu alugo." },
        { label: "Ele", replacement: "He rents.", pt: "Ele aluga." },
        { label: "Nós", replacement: "We rent.", pt: "Nós alugamos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você quer alugar uma casa? / eles / ela",
      options: [
        { label: "Você", replacement: "Do you want to rent a house?", pt: "Você quer alugar uma casa?" },
        { label: "Eles", replacement: "Do they want to rent a house?", pt: "Eles querem alugar uma casa?" },
        { label: "Ela", replacement: "Does she want to rent a house?", pt: "Ela quer alugar uma casa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu divido meu quarto com minha irmã. / irmão / primo",
      options: [
        { label: "irmã", replacement: "I share my room with my sister.", pt: "Eu divido meu quarto com minha irmã." },
        { label: "irmão", replacement: "I share my room with my brother.", pt: "Eu divido meu quarto com meu irmão." },
        { label: "primo", replacement: "I share my room with my cousin.", pt: "Eu divido meu quarto com meu primo." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela não quer alugar um apartamento. / casa / quitinete",
      options: [
        { label: "apartamento", replacement: "She doesn't want to rent an apartment.", pt: "Ela não quer alugar um apartamento." },
        { label: "casa", replacement: "She doesn't want to rent a house.", pt: "Ela não quer alugar uma casa." },
        { label: "quitinete", replacement: "She doesn't want to rent a studio apartment.", pt: "Ela não quer alugar uma quitinete." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Vamos dividir um sanduíche. / panqueca / pizza",
      options: [
        { label: "sanduíche", replacement: "Let's share a sandwich.", pt: "Vamos dividir um sanduíche." },
        { label: "panqueca", replacement: "Let's share a pancake.", pt: "Vamos dividir uma panqueca." },
        { label: "pizza", replacement: "Let's share a pizza.", pt: "Vamos dividir uma pizza." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu moro em um apartamento em um condomínio fechado. / casa / quitinete",
      options: [
        { label: "apartamento", replacement: "I live in an apartment in a gated community.", pt: "Eu moro em um apartamento em um condomínio fechado." },
        { label: "casa", replacement: "I live in a house in a gated community.", pt: "Eu moro em uma casa em um condomínio fechado." },
        { label: "quitinete", replacement: "I live in a studio apartment in a gated community.", pt: "Eu moro em uma quitinete em um condomínio fechado." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Tem uma tiny house to rent here. / grande / bonita",
      options: [
        { label: "tiny house", replacement: "There is a tiny house to rent here.", pt: "Tem uma tiny house para alugar aqui." },
        { label: "casa grande", replacement: "There is a large house to rent here.", pt: "Tem uma casa grande para alugar aqui." },
        { label: "casa bonita", replacement: "There is a beautiful house to rent here.", pt: "Tem uma casa bonita para alugar aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Esta quitinete é minúscula, eu preciso de mais espaço. / apartamento / casa",
      options: [
        { label: "quitinete", replacement: "This studio apartment is tiny, I need more space.", pt: "Esta quitinete é minúscula, eu preciso de mais espaço." },
        { label: "apartamento", replacement: "This apartment is tiny, I need more space.", pt: "Este apartamento é minúsculo, eu preciso de mais espaço." },
        { label: "casa", replacement: "This house is tiny, I need more space.", pt: "Esta casa é minúscula, eu preciso de mais espaço." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eles não gostam de morar em uma casa geminada. / casa isolada / chalé",
      options: [
        { label: "casa geminada", replacement: "They don't like to live in a townhouse.", pt: "Eles não gostam de morar em uma casa geminada." },
        { label: "casa isolada", replacement: "They don't like to live in a detached house.", pt: "Eles não gostam de morar em uma casa isolada." },
        { label: "chalé", replacement: "They don't like to live in a cottage.", pt: "Eles não gostam de morar em um chalé." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Meu irmão tem amigos no prédio. / um colega de quarto",
      options: [
        { label: "prédio", replacement: "My brother has friends in the building.", pt: "Meu irmão tem amigos no prédio." },
        { label: "colega de quarto", replacement: "My brother has a roommate.", pt: "Meu irmão tem um colega de quarto." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Tem um cômodo para alugar aqui? / casa / quitinete",
      options: [
        { label: "cômodo", replacement: "Is there a room to rent here?", pt: "Tem um cômodo para alugar aqui?" },
        { label: "casa", replacement: "Is there a house to rent here?", pt: "Tem uma casa para alugar aqui?" },
        { label: "quitinete", replacement: "Is there a studio apartment to rent here?", pt: "Tem uma quitinete para alugar aqui?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Vamos alugar um sobrado. / uma casa isolada / uma casa geminada",
      options: [
        { label: "sobrado", replacement: "Let's rent a two-story house.", pt: "Vamos alugar um sobrado." },
        { label: "casa isolada", replacement: "Let's rent a detached house.", pt: "Vamos alugar uma casa isolada." },
        { label: "casa geminada", replacement: "Let's rent a townhouse.", pt: "Vamos alugar uma casa geminada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I live on the first floor. / Eu moro no primeiro andar. / quarto / sexto",
      options: [
        { label: "primeiro andar", replacement: "I live on the first floor.", pt: "Eu moro no primeiro andar." },
        { label: "quarto", replacement: "I live on the fourth floor.", pt: "Eu moro no quarto andar." },
        { label: "sexto", replacement: "I live on the sixth floor.", pt: "Eu moro no sexto andar." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "There isn't an elevator in this building. / Não tem elevador neste prédio. / shopping / aqui",
      options: [
        { label: "prédio", replacement: "There isn't an elevator in this building.", pt: "Não tem elevador neste prédio." },
        { label: "shopping", replacement: "There isn't an elevator in this shopping mall.", pt: "Não tem elevador neste shopping." },
        { label: "aqui", replacement: "There isn't an elevator here.", pt: "Não tem elevador aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "There are plenty of good studio apartments to rent. / Tem muitas quitinetes boas para alugar. / casas geminadas / casas isoladas",
      options: [
        { label: "quitinete", replacement: "There are plenty of good studio apartments to rent.", pt: "Tem muitas quitinetes boas para alugar." },
        { label: "casa geminada", replacement: "There are plenty of good townhouses to rent.", pt: "Tem muitas casas geminadas boas para alugar." },
        { label: "casa isolada", replacement: "There are plenty of good detached houses to rent.", pt: "Tem muitas casas isoladas boas para alugar." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Esta casa isolada tem bastante espaço. / quartos / banheiros",
      options: [
        { label: "espaço", replacement: "This detached house has plenty of space.", pt: "Esta casa isolada tem bastante espaço." },
        { label: "quartos", replacement: "This detached house has plenty of rooms.", pt: "Esta casa isolada tem bastante quartos." },
        { label: "banheiros", replacement: "This detached house has plenty of bathrooms.", pt: "Esta casa isolada tem bastante banheiros." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Ela não gosta de casas com cômodos grandes. / minúsculos",
      options: [
        { label: "grandes", replacement: "She doesn't like houses with large rooms.", pt: "Ela não gosta de casas com cômodos grandes." },
        { label: "minúsculos", replacement: "She doesn't like houses with tiny rooms.", pt: "Ela não gosta de casas com cômodos minúsculos." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE (Useful Phrases) ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Essa quitinete tem vista para o parque. / praça",
      options: [
        { label: "parque", replacement: "This studio apartment has a view of the park.", pt: "Essa quitinete tem vista para o parque." },
        { label: "praça", replacement: "This studio apartment has a view of the square.", pt: "Essa quitinete tem vista para a praça." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu quero morar em São Paulo. / Rio de Janeiro / Salvador",
      options: [
        { label: "São Paulo", replacement: "I want to live in São Paulo.", pt: "Eu quero morar em São Paulo." },
        { label: "Rio de Janeiro", replacement: "I want to live in Rio de Janeiro.", pt: "Eu quero morar no Rio de Janeiro." },
        { label: "Salvador", replacement: "I want to live in Salvador.", pt: "Eu quero morar em Salvador." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "É difícil de pagar. / difícil alugar / caro",
      options: [
        { label: "difícil de pagar", replacement: "It's difficult to pay.", pt: "É difícil de pagar." },
        { label: "difícil alugar", replacement: "It's difficult to rent.", pt: "É difícil alugar." },
        { label: "caro", replacement: "It's expensive.", pt: "É caro." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu quero ter uma casa própria. / não gosto de pagar aluguel. / apartamento / sobrado",
      options: [
        { label: "casa própria", replacement: "I want to own a house.", pt: "Eu quero ter uma casa própria." },
        { label: "não gosto de pagar aluguel", replacement: "I don't like to pay rent.", pt: "Eu não gosto de pagar aluguel." },
        { label: "apartamento", replacement: "I want to own an apartment.", pt: "Eu quero ter um apartamento." },
        { label: "sobrado", replacement: "I want to own a two-story house.", pt: "Eu quero ter um sobrado." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Por favor, compartilhe a conta com todos. / o quarto / o espaço",
      options: [
        { label: "conta", replacement: "Please, share the bill with everyone.", pt: "Por favor, compartilhe a conta com todos." },
        { label: "quarto", replacement: "Please, share the room with everyone.", pt: "Por favor, compartilhe o quarto com todos." },
        { label: "espaço", replacement: "Please, share the space with everyone.", pt: "Por favor, compartilhe o espaço com todos." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu preciso de um apartamento para dividir com alguém. / casa / quitinete",
      options: [
        { label: "apartamento", replacement: "I need an apartment to share with someone.", pt: "Eu preciso de um apartamento para dividir com alguém." },
        { label: "casa", replacement: "I need a house to share with someone.", pt: "Eu preciso de uma casa para dividir com alguém." },
        { label: "quitinete", replacement: "I need a studio apartment to share with someone.", pt: "Eu preciso de uma quitinete para dividir com alguém." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu preciso de alguém para dividir o apartamento comigo. / casa / quarto",
      options: [
        { label: "apartamento", replacement: "I need someone to share the apartment with me.", pt: "Eu preciso de alguém para dividir o apartamento comigo." },
        { label: "casa", replacement: "I need someone to share the house with me.", pt: "Eu preciso de alguém para dividir a casa comigo." },
        { label: "quarto", replacement: "I need someone to share the room with me.", pt: "Eu preciso de alguém para dividir o quarto comigo." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Não tem ninguém em casa agora. / escola / prédio",
      options: [
        { label: "casa", replacement: "There is nobody at home now.", pt: "Não tem ninguém em casa agora." },
        { label: "escola", replacement: "There is nobody at school now.", pt: "Não tem ninguém na escola agora." },
        { label: "prédio", replacement: "There is nobody in the building now.", pt: "Não tem ninguém no prédio agora." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ninguém quer morar nesta casa. / prédio / casa geminada",
      options: [
        { label: "casa", replacement: "Nobody wants to live in this house.", pt: "Ninguém quer morar nesta casa." },
        { label: "prédio", replacement: "Nobody wants to live in this building.", pt: "Ninguém quer morar neste prédio." },
        { label: "casa geminada", replacement: "Nobody wants to live in this townhouse.", pt: "Ninguém quer morar nesta casa geminada." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Todo mundo quer ter uma casa própria. / apartamento / sobrado",
      options: [
        { label: "casa própria", replacement: "Everybody wants to own a house.", pt: "Todo mundo quer ter uma casa própria." },
        { label: "apartamento", replacement: "Everybody wants to own an apartment.", pt: "Todo mundo quer ter um apartamento." },
        { label: "sobrado", replacement: "Everybody wants to own a two-story house.", pt: "Todo mundo quer ter um sobrado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Alguém quer dividir uma pizza conosco? / sanduíche / sobremesa",
      options: [
        { label: "pizza", replacement: "Does anybody want to share a pizza with us?", pt: "Alguém quer dividir uma pizza conosco?" },
        { label: "sanduíche", replacement: "Does anybody want to share a sandwich with us?", pt: "Alguém quer dividir um sanduíche conosco?" },
        { label: "sobremesa", replacement: "Does anybody want to share a dessert with us?", pt: "Alguém quer dividir uma sobremesa conosco?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Todos precisam colocar as mochilas aqui. / embaixo / bolsas",
      options: [
        { label: "mochilas", replacement: "Everybody needs to put the backpacks here.", pt: "Todos precisam colocar as mochilas aqui." },
        { label: "embaixo", replacement: "Everybody needs to put the backpacks down there.", pt: "Todos precisam colocar as mochilas lá embaixo." },
        { label: "bolsas", replacement: "Everybody needs to put the bags here.", pt: "Todos precisam colocar as bolsas aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ninguém vai à escola hoje. / universidade / igreja",
      options: [
        { label: "escola", replacement: "Nobody is going to school today.", pt: "Ninguém vai à escola hoje." },
        { label: "universidade", replacement: "Nobody is going to university today.", pt: "Ninguém vai à universidade hoje." },
        { label: "igreja", replacement: "Nobody is going to church today.", pt: "Ninguém vai à igreja hoje." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Ninguém quer dividir a conta comigo. / quarto / carro",
      options: [
        { label: "conta", replacement: "Nobody wants to share the bill with me.", pt: "Ninguém quer dividir a conta comigo." },
        { label: "quarto", replacement: "Nobody wants to share the room with me.", pt: "Ninguém quer dividir o quarto comigo." },
        { label: "carro", replacement: "Nobody wants to share the car with me.", pt: "Ninguém quer dividir o carro comigo." }
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

  const usefulPhrasesData = [
    {
      en: "This apartment has a view of the city.",
      pt: "Este apartamento tem vista para a cidade.",
      green: ["view", "city"]
    },
    {
      en: "I want to live in a quiet neighborhood.",
      pt: "Eu quero morar em um bairro tranquilo.",
      green: ["live", "neighborhood"]
    },
    {
      en: "It's difficult to pay the rent in this area.",
      pt: "É difícil pagar o aluguel nesta área.",
      green: ["difficult", "rent"]
    },
    {
      en: "I want to own my own house one day.",
      pt: "Eu quero ter minha própria casa um dia.",
      green: ["own", "house"]
    }
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
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🏠 Lesson 63 - My House & My Routine</h1>
          <SpeakSentence text="Learn to talk about your house, furniture, and daily routine activities." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about your house, furniture, and daily routine activities.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="House and daily routine"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
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
              <li><SpeakText text="to share" className="text-green-600 font-bold">to share</SpeakText> = dividir, compartilhar</li>
              <li><SpeakText text="to rent" className="text-green-600 font-bold">to rent</SpeakText> = alugar</li>
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
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "gated community", pt: "condomínio fechado" },
                { en: "studio apartment", pt: "quitinete" },
                { en: "detached house", pt: "casa isolada" },
                { en: "townhouse", pt: "casa geminada" },
                { en: "two-story house", pt: "sobrado" },
                { en: "cottage", pt: "chalé" },
                { en: "building", pt: "prédio" },
                { en: "room", pt: "cômodo" },
                { en: "space", pt: "espaço" },
                { en: "elevator", pt: "elevador" },
                { en: "roommate", pt: "colega de quarto" },
                { en: "first floor", pt: "primeiro andar" },
                { en: "tiny", pt: "minúsculo" },
                { en: "plenty of", pt: "muitos, bastante" },
              ].map((word, idx) => (
                <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <SpeakText text={word.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
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
            <SpeakSentence text="Practice common phrases for daily communication" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication
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
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
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
            <SpeakSentence text="Structures for talking about existence and location" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for talking about existence and location
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – There is / There are"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "There is somebody on the first floor.", pt: "Tem alguém no primeiro andar." },
                { en: "I need somebody to share this house with.", pt: "Eu preciso de alguém para dividir esta casa comigo." },
                { en: "Is there anybody at the door?", pt: "Tem alguém aí?" },
                { en: "There isn't anybody in the elevator.", pt: "Não tem ninguém no elevador." },
                { en: "Everybody wants to own a place.", pt: "Todo mundo quer ter um lugar próprio." },
                { en: "Nobody lives in this two-story house.", pt: "Ninguém mora neste sobrado." },
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
                    { en: "I live in an apartment in a gated community.", pt: "Eu moro em um apartamento em um condomínio fechado." },
                    { en: "There is a tiny house to rent here.", pt: "Tem uma tiny house para alugar aqui." },
                    { en: "This studio apartment is tiny, I need more space.", pt: "Esta quitinete é minúscula, eu preciso de mais espaço." },
                    { en: "They don't like to live in a townhouse.", pt: "Eles não gostam de morar em uma casa geminada." },
                    { en: "My brother has friends in the building.", pt: "Meu irmão tem amigos no prédio." },
                    { en: "Is there a room to rent here?", pt: "Tem um cômodo para alugar aqui?" },
                    { en: "Let's rent a two-story house.", pt: "Vamos alugar um sobrado." },
                    { en: "I live on the first floor.", pt: "Eu moro no primeiro andar." },
                    { en: "There isn't an elevator in this building.", pt: "Não tem elevador neste prédio." },
                    { en: "There are plenty of good studio apartments to rent.", pt: "Tem muitas quitinetes boas para alugar." },
                    { en: "This detached house has plenty of space.", pt: "Esta casa isolada tem bastante espaço." },
                    { en: "She doesn't like houses with large rooms.", pt: "Ela não gosta de casas com cômodos grandes." },
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
                      <img src={readingImage} alt="Organizing your space" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Organizing your space</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Daily routine at home" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Daily routine at home</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Modern living" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Modern living and technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
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
                { en: "I want to live in a quiet neighborhood.", pt: "Eu quero morar em um bairro tranquilo." },
                { en: "It's difficult to pay the rent.", pt: "É difícil pagar o aluguel." },
                { en: "I want to own my own house.", pt: "Eu quero ter minha própria casa." },
                { en: "This apartment has a view of the city.", pt: "Este apartamento tem vista para a cidade." },
                { en: "I need somebody to share this house with.", pt: "Eu preciso de alguém para dividir esta casa comigo." },
                { en: "Is there anybody at the door?", pt: "Tem alguém aí?" },
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
                    <li>Use <strong className="text-white">"There is"</strong> for singular and <strong className="text-white">"There are"</strong> for plural.</li>
                    <li><strong className="text-white">"Put away"</strong> means to store or tidy up.</li>
                    <li><strong className="text-white">"Move"</strong> can mean to change position or to relocate.</li>
                    <li>Use <strong className="text-white">"next to"</strong> to describe proximity.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">"What a mess!" is a common exclamation to express disorder.</p>
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
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (62)
          </button>
          <button onClick={() => router.push("/cursos/lesson64")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (64) &rarr;
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

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL DA LIÇÃO ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="House and daily routine – ampliada"
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