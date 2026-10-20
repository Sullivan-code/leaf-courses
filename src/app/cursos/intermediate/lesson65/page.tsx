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
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    if (greenWords.some(gw => cleanWord === gw.toLowerCase())) {
      return <span key={i} className="text-green-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-3 rounded-lg border border-green-200 shadow-sm">
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
// MAIN COMPONENT – LESSON 65
// ============================================
export default function Lesson65LostAndFound() {
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

  // IMAGENS
  const mainImage = "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l65-imgg.png";
  const readingImage = "https://images.pexels.com/photos/7147017/pexels-photo-7147017.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/8386403/pexels-photo-8386403.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://images.pexels.com/photos/6980691/pexels-photo-6980691.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "perder / Eu perco. / nós / eles",
      options: [
        { label: "perder", replacement: "to lose.", pt: "perder" },
        { label: "Eu", replacement: "I lose.", pt: "Eu perco." },
        { label: "Nós", replacement: "We lose.", pt: "Nós perdemos." },
        { label: "Eles", replacement: "They lose.", pt: "Eles perdem." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ela nunca perde as coisas. / ele / nós",
      options: [
        { label: "ela", replacement: "She never loses things.", pt: "Ela nunca perde as coisas." },
        { label: "ele", replacement: "He never loses things.", pt: "Ele nunca perde as coisas." },
        { label: "nós", replacement: "We never lose things.", pt: "Nós nunca perdemos as coisas." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "encontrar, achar / Eu encontro. / ele / ela",
      options: [
        { label: "encontrar", replacement: "to find.", pt: "encontrar, achar" },
        { label: "Eu", replacement: "I find.", pt: "Eu encontro." },
        { label: "Ele", replacement: "He finds.", pt: "Ele encontra." },
        { label: "Ela", replacement: "She finds.", pt: "Ela encontra." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Elas querem encontrar meu passaporte. / documentos / carteira",
      options: [
        { label: "passaporte", replacement: "They want to find my passport.", pt: "Elas querem encontrar meu passaporte." },
        { label: "documentos", replacement: "They want to find my documents.", pt: "Elas querem encontrar meus documentos." },
        { label: "carteira", replacement: "They want to find my wallet.", pt: "Elas querem encontrar minha carteira." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "She finds math easy. / inglês / francês",
      options: [
        { label: "math", replacement: "She finds math easy.", pt: "Ela acha matemática fácil." },
        { label: "inglês", replacement: "She finds English easy.", pt: "Ela acha inglês fácil." },
        { label: "francês", replacement: "She finds French easy.", pt: "Ela acha francês fácil." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu não posso perder minhas coisas. / dinheiro / remédio",
      options: [
        { label: "coisas", replacement: "I can't lose my things.", pt: "Eu não posso perder minhas coisas." },
        { label: "dinheiro", replacement: "I can't lose my money.", pt: "Eu não posso perder meu dinheiro." },
        { label: "remédio", replacement: "I can't lose my medicine.", pt: "Eu não posso perder meu remédio." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu preciso encontrar minhas chaves. / identidade / fone de ouvido",
      options: [
        { label: "chaves", replacement: "I need to find my keys.", pt: "Eu preciso encontrar minhas chaves." },
        { label: "identidade", replacement: "I need to find my ID.", pt: "Eu preciso encontrar minha identidade." },
        { label: "fone", replacement: "I need to find my headphone.", pt: "Eu preciso encontrar meu fone de ouvido." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu não posso perder meu carregador. / senha / identidade",
      options: [
        { label: "carregador", replacement: "I can't lose my charger.", pt: "Eu não posso perder meu carregador." },
        { label: "senha", replacement: "I can't lose my password.", pt: "Eu não posso perder minha senha." },
        { label: "identidade", replacement: "I can't lose my ID.", pt: "Eu não posso perder minha identidade." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Qual é seu nome? Eu não encontro seu crachá. / carteira de habilitação",
      options: [
        { label: "crachá", replacement: "What is your name? I can't find your name tag.", pt: "Qual é seu nome? Eu não encontro seu crachá." },
        { label: "carteira", replacement: "What is your name? I can't find your driver's license.", pt: "Qual é seu nome? Eu não encontro sua carteira de habilitação." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Não perca a paciência. Ele é um bom menino. / menina",
      options: [
        { label: "menino", replacement: "Don't lose patience. He's a good boy.", pt: "Não perca a paciência. Ele é um bom menino." },
        { label: "menina", replacement: "Don't lose patience. She's a good girl.", pt: "Não perca a paciência. Ela é uma boa menina." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu sempre perco a cabeça com meu irmão. / irmã / tio",
      options: [
        { label: "irmão", replacement: "I always lose my temper with my brother.", pt: "Eu sempre perco a cabeça com meu irmão." },
        { label: "irmã", replacement: "I always lose my temper with my sister.", pt: "Eu sempre perco a cabeça com minha irmã." },
        { label: "tio", replacement: "I always lose my temper with my uncle.", pt: "Eu sempre perco a cabeça com meu tio." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Os sapatos estão embaixo da cama. / atrás / sobre",
      options: [
        { label: "embaixo", replacement: "The shoes are under the bed.", pt: "Os sapatos estão embaixo da cama." },
        { label: "atrás", replacement: "The shoes are behind the bed.", pt: "Os sapatos estão atrás da cama." },
        { label: "sobre", replacement: "The shoes are on the bed.", pt: "Os sapatos estão sobre a cama." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Tem uma igreja atrás da minha casa. / shopping / posto de gasolina",
      options: [
        { label: "igreja", replacement: "There is a church behind my house.", pt: "Tem uma igreja atrás da minha casa." },
        { label: "shopping", replacement: "There is a mall behind my house.", pt: "Tem um shopping atrás da minha casa." },
        { label: "posto", replacement: "There is a gas station behind my house.", pt: "Tem um posto de gasolina atrás da minha casa." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Sua identidade está em cima da mesa. / carteira de habilitação / dinheiro",
      options: [
        { label: "identidade", replacement: "Your ID is on the table.", pt: "Sua identidade está em cima da mesa." },
        { label: "carteira", replacement: "Your driver's license is on the table.", pt: "Sua carteira de habilitação está em cima da mesa." },
        { label: "dinheiro", replacement: "Your money is on the table.", pt: "Seu dinheiro está em cima da mesa." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu não consigo achar meus óculos. / carregador / carteira de habilitação",
      options: [
        { label: "óculos", replacement: "I can't find my glasses.", pt: "Eu não consigo achar meus óculos." },
        { label: "carregador", replacement: "I can't find my charger.", pt: "Eu não consigo achar meu carregador." },
        { label: "carteira", replacement: "I can't find my driver's license.", pt: "Eu não consigo achar minha carteira de habilitação." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Você sempre perde sua chave? / celular / crachá",
      options: [
        { label: "chave", replacement: "Do you always lose your key?", pt: "Você sempre perde sua chave?" },
        { label: "celular", replacement: "Do you always lose your cell phone?", pt: "Você sempre perde seu celular?" },
        { label: "crachá", replacement: "Do you always lose your name tag?", pt: "Você sempre perde seu crachá?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu acho francês fácil. / italiano / espanhol",
      options: [
        { label: "francês", replacement: "I find French easy.", pt: "Eu acho francês fácil." },
        { label: "italiano", replacement: "I find Italian easy.", pt: "Eu acho italiano fácil." },
        { label: "espanhol", replacement: "I find Spanish easy.", pt: "Eu acho espanhol fácil." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Tem um setor de achados e perdidos aqui? Eu não acho minha chave. / celular / identidade",
      options: [
        { label: "chave", replacement: "Is there a lost and found section here? I can't find my key.", pt: "Tem um setor de achados e perdidos aqui? Eu não acho minha chave." },
        { label: "celular", replacement: "Is there a lost and found section here? I can't find my cell phone.", pt: "Tem um setor de achados e perdidos aqui? Eu não acho meu celular." },
        { label: "identidade", replacement: "Is there a lost and found section here? I can't find my ID.", pt: "Tem um setor de achados e perdidos aqui? Eu não acho minha identidade." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "I always get lost when I go downtown. / Eu sempre me perco quando eu vou ao centro. / shopping / museu",
      options: [
        { label: "centro", replacement: "I always get lost when I go downtown.", pt: "Eu sempre me perco quando eu vou ao centro." },
        { label: "shopping", replacement: "I always get lost when I go to that mall.", pt: "Eu sempre me perco quando eu vou àquele shopping." },
        { label: "museu", replacement: "I always get lost when I go to that museum.", pt: "Eu sempre me perco quando eu vou àquele museu." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "I got lost downtown again. / Eu me perdi no centro de novo. / no shopping / no museu",
      options: [
        { label: "centro", replacement: "I got lost downtown again.", pt: "Eu me perdi no centro de novo." },
        { label: "shopping", replacement: "I got lost at the mall again.", pt: "Eu me perdi no shopping de novo." },
        { label: "museu", replacement: "I got lost at the museum again.", pt: "Eu me perdi no museu de novo." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "I don't want to lose my mind. / Eu não quero perder a cabeça. / ela / ele",
      options: [
        { label: "Eu", replacement: "I don't want to lose my mind.", pt: "Eu não quero perder a cabeça." },
        { label: "ela", replacement: "She doesn't want to lose her mind.", pt: "Ela não quer perder a cabeça." },
        { label: "ele", replacement: "He doesn't want to lose his mind.", pt: "Ele não quer perder a cabeça." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "I lost my mind but not hope. / Eu perdi a cabeça, mas não a esperança. / fé",
      options: [
        { label: "esperança", replacement: "I lost my mind but not hope.", pt: "Eu perdi a cabeça, mas não a esperança." },
        { label: "fé", replacement: "I lost my mind but not faith.", pt: "Eu perdi a cabeça, mas não a fé." }
      ],
      currentIndex: 0,
    }
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Você quer dividir essa pizza comigo antes de limparmos a casa? / ele / ela",
      options: [
        { label: "comigo", replacement: "Do you want to share this pizza with me before we clean the house?", pt: "Você quer dividir essa pizza comigo antes de limparmos a casa?" },
        { label: "com ele", replacement: "Do you want to share this pizza with him before we clean the house?", pt: "Você quer dividir essa pizza com ele antes de limparmos a casa?" },
        { label: "com ela", replacement: "Do you want to share this pizza with her before we clean the house?", pt: "Você quer dividir essa pizza com ela antes de limparmos a casa?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eu perco a paciência com meu colega de quarto todos os dias porque ele nunca arruma as coisas. / com eles / com ela",
      options: [
        { label: "com ele", replacement: "I lose my patience with my roommate every day because he never cleans up.", pt: "Eu perco a paciência com meu colega de quarto todos os dias porque ele nunca arruma as coisas." },
        { label: "com eles", replacement: "I lose my patience with them every day because they never clean up.", pt: "Eu perco a paciência com eles todos os dias porque eles nunca arrumam as coisas." },
        { label: "com ela", replacement: "I lose my patience with her every day because she never cleans up.", pt: "Eu perco a paciência com ela todos os dias porque ela nunca arruma as coisas." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Onde está a chave da porta da frente? Não consigo encontrá-la em lugar nenhum na minha bolsa. / carregador / fone",
      options: [
        { label: "chave", replacement: "Where is the front door key? I can't find it anywhere in my bag.", pt: "Onde está a chave da porta da frente? Não consigo encontrá-la em lugar nenhum na minha bolsa." },
        { label: "carregador", replacement: "Where is my charger? I can't find it anywhere in my bag.", pt: "Onde está meu carregador? Não consigo encontrá-lo em lugar nenhum na minha bolsa." },
        { label: "fone", replacement: "Where is my headphone? I can't find it anywhere in my bag.", pt: "Onde está meu fone? Não consigo encontrá-lo em lugar nenhum na minha bolsa." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Estas são minhas calças novas para a festa da casa nova. Eu amo elas. / óculos / shorts",
      options: [
        { label: "calças", replacement: "These are my new pants for the housewarming party. I love them.", pt: "Estas são minhas calças novas para a festa da casa nova. Eu amo elas." },
        { label: "óculos", replacement: "These are my new glasses for the housewarming party. I love them.", pt: "Estes são meus óculos novos para a festa da casa nova. Eu amo eles." },
        { label: "shorts", replacement: "These are my new shorts for the housewarming party. I love them.", pt: "Estes são meus shorts novos para a festa da casa nova. Eu amo eles." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Aqui está sua camiseta limpa. Você tem que usá-la no jantar em família hoje à noite. / casaco / crachá",
      options: [
        { label: "camiseta", replacement: "Here is your clean shirt. You have to wear it for the family dinner tonight.", pt: "Aqui está sua camiseta limpa. Você tem que usá-la no jantar em família hoje à noite." },
        { label: "casaco", replacement: "Here is your clean coat. You have to wear it for the family dinner tonight.", pt: "Aqui está seu casaco limpo. Você tem que usá-lo no jantar em família hoje à noite." },
        { label: "crachá", replacement: "Here is your name tag. You have to wear it for the family dinner tonight.", pt: "Aqui está seu crachá. Você tem que usá-lo no jantar em família hoje à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Onde está o carregador do seu celular? Não consigo vê-lo em lugar nenhum perto do sofá da sala. / celular / carteira",
      options: [
        { label: "carregador", replacement: "Where is your phone charger? I don't see it anywhere near the living room couch.", pt: "Onde está o carregador do seu celular? Não consigo vê-lo em lugar nenhum perto do sofá da sala." },
        { label: "celular", replacement: "Where is your cell phone? I don't see it anywhere near the living room couch.", pt: "Onde está seu celular? Não consigo vê-lo em lugar nenhum perto do sofá da sala." },
        { label: "carteira", replacement: "Where is your wallet? I don't see it anywhere near the living room couch.", pt: "Onde está sua carteira? Não consigo vê-la em lugar nenhum perto do sofá da sala." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "As chaves reservas estão na gaveta da cozinha, logo ao lado da pia. / remédios / passaportes",
      options: [
        { label: "chaves", replacement: "The spare keys are in the kitchen drawer, right next to the sink.", pt: "As chaves reservas estão na gaveta da cozinha, logo ao lado da pia." },
        { label: "remédios", replacement: "The medicines are in the kitchen drawer, right next to the sink.", pt: "Os remédios estão na gaveta da cozinha, logo ao lado da pia." },
        { label: "passaportes", replacement: "The passports are in the kitchen drawer, right next to the sink.", pt: "Os passaportes estão na gaveta da cozinha, logo ao lado da pia." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Seu casaco de inverno está pendurado atrás da porta do quarto. / jaqueta / camisa",
      options: [
        { label: "casaco", replacement: "Your winter coat is hanging behind the bedroom door.", pt: "Seu casaco de inverno está pendurado atrás da porta do quarto." },
        { label: "jaqueta", replacement: "Your jacket is hanging behind the bedroom door.", pt: "Sua jaqueta está pendurada atrás da porta do quarto." },
        { label: "camisa", replacement: "Your shirt is hanging behind the bedroom door.", pt: "Sua camisa está pendurada atrás da porta do quarto." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Todos os livros estão na prateleira da sala de estar, acima da televisão. / mesa / cadeira",
      options: [
        { label: "prateleira", replacement: "All the books are on the living room shelf, above the TV.", pt: "Todos os livros estão na prateleira da sala de estar, acima da televisão." },
        { label: "mesa", replacement: "All the books are on the living room table, above the TV.", pt: "Todos os livros estão na mesa da sala de estar, acima da televisão." },
        { label: "cadeira", replacement: "All the books are on the living room chair, above the TV.", pt: "Todos os livros estão na cadeira da sala de estar, acima da televisão." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Estes são meus novos colegas de quarto. Você os conhece do prédio? / professores / advogados",
      options: [
        { label: "colegas", replacement: "These are my new roommates. Do you know them from the building?", pt: "Estes são meus novos colegas de quarto. Você os conhece do prédio?" },
        { label: "professores", replacement: "These are my new teachers. Do you know them from the building?", pt: "Estes são meus novos professores. Você os conhece do prédio?" },
        { label: "advogados", replacement: "These are my new lawyers. Do you know them from the building?", pt: "Estes são meus novos advogados. Você os conhece do prédio?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Eu realmente amo este sobrado, mas eu preciso vendê-lo e me mudar para o centro. / quitinete / casa isolada",
      options: [
        { label: "sobrado", replacement: "I really love this two-story house, but I need to sell it and move downtown.", pt: "Eu realmente amo este sobrado, mas eu preciso vendê-lo e me mudar para o centro." },
        { label: "quitinete", replacement: "I really love this studio apartment, but I need to sell it and move downtown.", pt: "Eu realmente amo esta quitinete, mas eu preciso vendê-la e me mudar para o centro." },
        { label: "casa isolada", replacement: "I really love this detached house, but I need to sell it and move downtown.", pt: "Eu realmente amo esta casa isolada, mas eu preciso vendê-la e me mudar para o centro." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Eu me perdi completamente na França quando estava tentando encontrar meu hotel. / na Europa / nos Estados Unidos",
      options: [
        { label: "França", replacement: "I got completely lost in France when I was trying to find my hotel.", pt: "Eu me perdi completamente na França quando estava tentando encontrar meu hotel." },
        { label: "Europa", replacement: "I got completely lost in Europe when I was trying to find my hotel.", pt: "Eu me perdi completamente na Europa quando estava tentando encontrar meu hotel." },
        { label: "Estados Unidos", replacement: "I got completely lost in the United States when I was trying to find my hotel.", pt: "Eu me perdi completamente nos Estados Unidos quando estava tentando encontrar meu hotel." }
      ],
      currentIndex: 0,
    }
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "There is a lost and found section in this station.",
      pt: "Tem um setor de achados e perdidos nesta estação.",
      green: ["lost", "found", "section"]
    },
    {
      en: "I always get lost in big cities.",
      pt: "Eu sempre me perco em cidades grandes.",
      green: ["get", "lost"]
    },
    {
      en: "I really don't want to lose my mind.",
      pt: "Eu realmente não quero perder a cabeça.",
      green: ["lose", "mind"]
    },
    {
      en: "I never lose faith in people.",
      pt: "Eu nunca perco a fé nas pessoas.",
      green: ["lose", "faith"]
    }
  ];

  const makeItYoursData = [
    { en: "Can you help me? I can't find my ID, and I need it for the exam.", pt: "Você pode me ajudar? Não consigo encontrar minha identidade, e eu preciso dela para a prova.", green: ["you", "me", "I", "ID", "it", "exam"] },
    { en: "He needs to talk to you this afternoon. It's about the lost and found section.", pt: "Ele precisa falar com você esta tarde. É sobre o setor de achados e perdidos.", green: ["He", "you", "lost", "found", "section"] },
    { en: "My teacher never loses patience. I love her.", pt: "Meu professor nunca perde a paciência. Eu amo ele.", green: ["teacher", "patience", "I", "her"] },
    { en: "Let's help him find his keys. He's been looking everywhere.", pt: "Vamos ajudá-lo a encontrar as chaves dele. Ele tem procurado por toda parte.", green: ["him", "keys", "He", "everywhere"] },
    { en: "Your charger is here, can I see it? I want to make sure it's mine.", pt: "Seu carregador está aqui, posso dar uma olhada? Quero ter certeza de que é o meu.", green: ["charger", "I", "it", "I", "it", "mine"] },
    { en: "Do you want to come with us? We are going to the lost and found.", pt: "Você quer vir com a gente? Nós estamos indo para os achados e perdidos.", green: ["you", "us", "We", "lost", "found"] },
    { en: "Where are my keys? I can't find them anywhere.", pt: "Onde estão minhas chaves? Não consigo encontrá-las em nenhum lugar.", green: ["keys", "I", "them"] },
    { en: "I left my name tag behind. I need to track it down.", pt: "Eu deixei meu crachá para trás. Eu preciso rastreá-lo.", green: ["I", "name", "tag", "I", "it"] },
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
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🎒 Lesson 65 - Lost & Found</h1>
          <SpeakSentence text="Learn how to talk about losing and finding things, and everyday vocabulary for daily life." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn how to talk about losing and finding things, and everyday vocabulary.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Lost and Found"
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
              <li><SpeakText text="to lose" className="text-green-600 font-bold">to lose</SpeakText> = perder</li>
              <li><SpeakText text="to find" className="text-green-600 font-bold">to find</SpeakText> = encontrar, achar</li>
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
                { en: "ID", pt: "identidade" },
                { en: "driver's license", pt: "carteira de habilitação" },
                { en: "headphone", pt: "fone de ouvido" },
                { en: "charger", pt: "carregador" },
                { en: "key", pt: "chave" },
                { en: "name tag", pt: "crachá" },
                { en: "temper", pt: "temperamento, calma" },
                { en: "control", pt: "controle" },
                { en: "patience", pt: "paciência" },
                { en: "hope", pt: "esperança" },
                { en: "behind", pt: "atrás" },
                { en: "lost and found", pt: "achados e perdidos" },
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
            <SpeakSentence text="Structures for talking about daily situations at a B1/B2 level" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for talking about daily situations at a B1/B2 level
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Lost and Found"
                className="w-full max-h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "Could you give me a hand? I can't seem to find my ID.", pt: "Você pode me dar uma mão? Eu não consigo encontrar minha identidade." },
                { en: "I must have left my charger behind. Let me track it down.", pt: "Eu devo ter deixado meu carregador para trás. Deixe-me rastreá-lo." },
                { en: "Let's help him track down his keys before he loses his mind.", pt: "Vamos ajudá-lo a rastrear as chaves dele antes que ele perca a cabeça." },
                { en: "I'm trying really hard not to lose my temper.", pt: "Eu estou me esforçando muito para não perder a paciência." },
                { en: "Where are my keys? They are nowhere to be found.", pt: "Onde estão minhas chaves? Elas não estão em lugar nenhum." },
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
              <p className="text-green-800 font-bold mb-4 text-lg">
                🌟 Substitute the green words to create your own version and practice fluency.
              </p>
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-3">
                  {makeItYoursData.map((s, idx) => (
                    <HighlightedPhrase key={idx} text={`${idx+1}. ${s.en}`} greenWords={s.green} translation={s.pt} />
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="Looking for lost items" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Looking for lost items</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Lost and found section" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Lost and found section</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Keeping track of belongings" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Keeping track of belongings</p>
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
                { en: "I can't find my ID.", pt: "Eu não consigo encontrar minha identidade." },
                { en: "Could you give me a hand?", pt: "Você pode me dar uma mão?" },
                { en: "I must have left it behind.", pt: "Eu devo ter deixado isso para trás." },
                { en: "Let's track it down.", pt: "Vamos rastreá-lo (encontrá-lo)." },
                { en: "I'm trying not to lose my temper.", pt: "Estou tentando não perder a paciência." },
                { en: "They are nowhere to be found.", pt: "Eles não estão em lugar nenhum." },
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
                    <li>Use <strong className="text-white">"must have left"</strong> to speculate about something you forgot.</li>
                    <li><strong className="text-white">"Track down"</strong> is a great phrasal verb for "find after searching".</li>
                    <li>Remember to use <strong className="text-white">"give me a hand"</strong> instead of just "help me" for a more natural daily English.</li>
                    <li>We use <strong className="text-white">"lose my temper"</strong> when we get angry suddenly.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">The phrase "lost and found" is the standard term in the US for the place where missing items are kept.</p>
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
          <button onClick={() => router.push("/cursos/lesson64")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (64)
          </button>
          <button onClick={() => router.push("/cursos/lesson66")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (66) &rarr;
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
              alt="Lost and Found – ampliada"
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