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
  base?: string; // optional, not used when options are objects with replacement
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
    // fallback – should not happen if we use objects
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
            onClick={() => onOptionClick(exercise.key, index)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <SpeakText text={getOptionLabel(option)} showIcon={false} />
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
// MAIN COMPONENT – LESSON 61
// ============================================
export default function Lesson61MyHouseRoutine() {
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

  // Estado para o modal de imagem da Grammar
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
  // MAIN IMAGE ATUALIZADA com a nova URL fornecida
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2023_39_19%20(1).png?raw=true";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2023_04_40.png?raw=true";

  // ============================================================
  // EXERCÍCIOS DE SUBSTITUIÇÃO – BASEADOS NO ARQUIVO VERBS.txt
  // ============================================================

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu coloco, ponho. / ela / nós",
      options: [
        { label: "Eu", replacement: "I put." },
        { label: "Ela", replacement: "She puts." },
        { label: "Nós", replacement: "We put." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você muda. / eles / nós",
      options: [
        { label: "Você", replacement: "You move." },
        { label: "Eles", replacement: "They move." },
        { label: "Nós", replacement: "We move." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele move. / ela / vocês",
      options: [
        { label: "Ele", replacement: "He moves." },
        { label: "Ela", replacement: "She moves." },
        { label: "Vocês", replacement: "You move." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eu quero mudar. / nós / eles",
      options: [
        { label: "Eu", replacement: "I want to move." },
        { label: "Nós", replacement: "We want to move." },
        { label: "Eles", replacement: "They want to move." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela põe. / ele / eu",
      options: [
        { label: "Ela", replacement: "She puts." },
        { label: "Ele", replacement: "He puts." },
        { label: "Eu", replacement: "I put." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu quero colocar uma cadeira aqui. / poltrona / tapete",
      options: [
        { label: "cadeira", replacement: "I want to put a chair here." },
        { label: "poltrona", replacement: "I want to put an armchair here." },
        { label: "tapete", replacement: "I want to put a carpet here." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Meu quarto está bagunçado. / arrumado / sujo",
      options: [
        { label: "bagunçado", replacement: "My bedroom is messy." },
        { label: "arrumado", replacement: "My bedroom is tidy." },
        { label: "sujo", replacement: "My bedroom is dirty." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Esta cadeira está suja. / escrivaninha / cômoda",
      options: [
        { label: "cadeira", replacement: "This chair is dirty." },
        { label: "escrivaninha", replacement: "This desk is dirty." },
        { label: "cômoda", replacement: "This dresser is dirty." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Vamos mover a escrivaninha para a direita. / para a esquerda",
      options: [
        { label: "para a direita", replacement: "Let's move the desk to the right." },
        { label: "para a esquerda", replacement: "Let's move the desk to the left." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Vamos colocar uma cadeira ao lado do meu guarda-roupa. / escrivaninha / poltrona",
      options: [
        { label: "cadeira", replacement: "Let's put a chair next to my closet." },
        { label: "escrivaninha", replacement: "Let's put a desk next to my closet." },
        { label: "poltrona", replacement: "Let's put an armchair next to my closet." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não quero colocar uma poltrona na minha sala. / mesa de centro / tapete",
      options: [
        { label: "poltrona", replacement: "I don't want to put an armchair in my living room." },
        { label: "mesa de centro", replacement: "I don't want to put a coffee table in my living room." },
        { label: "tapete", replacement: "I don't want to put a carpet in my living room." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Este tapete está sujo. / limpo / velho",
      options: [
        { label: "sujo", replacement: "This carpet is dirty." },
        { label: "limpo", replacement: "This carpet is clean." },
        { label: "velho", replacement: "This carpet is old." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Por favor, coloque a cadeira quebrada na outra sala. / escrivaninha / poltrona",
      options: [
        { label: "cadeira", replacement: "Please, put the broken chair in the other room." },
        { label: "escrivaninha", replacement: "Please, put the broken desk in the other room." },
        { label: "poltrona", replacement: "Please, put the broken armchair in the other room." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Vamos mover o sofá para a esquerda. / para a direita",
      options: [
        { label: "para a esquerda", replacement: "Let's move the sofa to the left." },
        { label: "para a direita", replacement: "Let's move the sofa to the right." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ela quer mover esta mesa para sala de estar. / cadeira / poltrona",
      options: [
        { label: "mesa", replacement: "She wants to move this table to the living room." },
        { label: "cadeira", replacement: "She wants to move this chair to the living room." },
        { label: "poltrona", replacement: "She wants to move this armchair to the living room." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "O quarto dela está arrumado. / bagunçado / sujo",
      options: [
        { label: "arrumado", replacement: "Her bedroom is tidy." },
        { label: "bagunçado", replacement: "Her bedroom is messy." },
        { label: "sujo", replacement: "Her bedroom is dirty." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "O guarda-roupa dele está sempre bagunçado. / arrumado / limpo",
      options: [
        { label: "bagunçado", replacement: "His closet is always messy." },
        { label: "arrumado", replacement: "His closet is always tidy." },
        { label: "limpo", replacement: "His closet is always clean." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Que bagunça! Guarde suas roupas, por favor. / livros",
      options: [
        { label: "roupas", replacement: "What a mess! Put your clothes away, please." },
        { label: "livros", replacement: "What a mess! Put your books away, please." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Guarde suas coisas e venha aqui, por favor. / bolsa / sacola",
      options: [
        { label: "coisas", replacement: "Put away your stuff and come here, please." },
        { label: "bolsa", replacement: "Put away your bag and come here, please." },
        { label: "sacola", replacement: "Put away your shopping bag and come here, please." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ela precisa limpar o quarto dela. / carro / guarda-roupa",
      options: [
        { label: "quarto", replacement: "She needs to clean her bedroom." },
        { label: "carro", replacement: "She needs to clean her car." },
        { label: "guarda-roupa", replacement: "She needs to clean her closet." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Que bagunça! Você precisa de ajuda? / quer",
      options: [
        { label: "precisa", replacement: "What a mess! Do you need help?" },
        { label: "quer", replacement: "What a mess! Do you want help?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Não compre esta cadeira. Está quebrada. / mesa / poltrona",
      options: [
        { label: "cadeira", replacement: "Don't buy this chair. It's broken." },
        { label: "mesa", replacement: "Don't buy this table. It's broken." },
        { label: "poltrona", replacement: "Don't buy this armchair. It's broken." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Que bagunça! Tem muitos livros aqui. / pessoas / sacolas",
      options: [
        { label: "livros", replacement: "What a mess! There are many books here." },
        { label: "pessoas", replacement: "What a mess! There are many people here." },
        { label: "sacolas", replacement: "What a mess! There are many bags here." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Tem roupas em cima da cama. Guarde-as, por favor. / bolsas / remédios",
      options: [
        { label: "roupas", replacement: "There are clothes on the bed. Put them away, please." },
        { label: "bolsas", replacement: "There are bags on the bed. Put them away, please." },
        { label: "remédios", replacement: "There are medicines on the bed. Put them away, please." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Não tem uma cadeira para mim. / mesa / lugar",
      options: [
        { label: "cadeira", replacement: "There isn't a chair for me." },
        { label: "mesa", replacement: "There isn't a table for me." },
        { label: "lugar", replacement: "There isn't a place for me." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Não tem mesas de centro nesta loja. / sapatos / camisetas",
      options: [
        { label: "mesas de centro", replacement: "There aren't coffee tables at this store." },
        { label: "sapatos", replacement: "There aren't shoes at this store." },
        { label: "camisetas", replacement: "There aren't t-shirts at this store." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Tem um shopping perto daqui? / praça / museu",
      options: [
        { label: "shopping", replacement: "Is there a shopping mall near here?" },
        { label: "praça", replacement: "Is there a square near here?" },
        { label: "museu", replacement: "Is there a museum near here?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Tem muitos livros na sua mochila? / remédios / coisas",
      options: [
        { label: "livros", replacement: "Are there a lot of books in your backpack?" },
        { label: "remédios", replacement: "Are there a lot of medicines in your backpack?" },
        { label: "coisas", replacement: "Are there a lot of things in your backpack?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Coloque sua bolsa aqui. / sacola / passaporte",
      options: [
        { label: "bolsa", replacement: "Put your bag here." },
        { label: "sacola", replacement: "Put your shopping bag here." },
        { label: "passaporte", replacement: "Put your passport here." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Tem um restaurante aqui? / estacionamento / piscina",
      options: [
        { label: "restaurante", replacement: "Is there a restaurant here?" },
        { label: "estacionamento", replacement: "Is there a parking lot here?" },
        { label: "piscina", replacement: "Is there a swimming pool here?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Não tem muitos estrangeiros na minha cidade. / crianças / igrejas",
      options: [
        { label: "estrangeiros", replacement: "There aren't many foreigners in my city." },
        { label: "crianças", replacement: "There aren't many children in my city." },
        { label: "igrejas", replacement: "There aren't many churches in my city." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Tem um caixa eletrônico aqui? / loja de departamento / outlet",
      options: [
        { label: "caixa eletrônico", replacement: "Is there an ATM here?" },
        { label: "loja de departamento", replacement: "Is there a department store here?" },
        { label: "outlet", replacement: "Is there an outlet here?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Não tem um armário neste quarto. / cômoda / cadeira",
      options: [
        { label: "armário", replacement: "There isn't a closet in this bedroom." },
        { label: "cômoda", replacement: "There isn't a dresser in this bedroom." },
        { label: "cadeira", replacement: "There isn't a chair in this bedroom." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Tem muitos alunos na sua escola? / estrangeiros / professores",
      options: [
        { label: "alunos", replacement: "Are there many students in your school?" },
        { label: "estrangeiros", replacement: "Are there many foreigners in your school?" },
        { label: "professores", replacement: "Are there many teachers in your school?" }
      ],
      currentIndex: 0,
    },
  ];

  // Combine all exercises for the helper function
  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // Dados para a seção "Speak Like a Native" (frases destacadas)
  const usefulPhrasesData = [
    {
      en: "Put away these clothes in the closet, please.",
      pt: "Guarde estas roupas no armário, por favor.",
      green: ["Put away", "clothes", "closet"]
    },
    {
      en: "Don't put this chair here. It's broken.",
      pt: "Não coloque essa cadeira aqui. Ela está quebrada.",
      green: ["put", "chair", "broken"]
    },
    {
      en: "What a mess!",
      pt: "Que bagunça!",
      green: ["mess"]
    },
    {
      en: "I always clean up my desk after work.",
      pt: "Eu sempre limpo minha escrivaninha depois do trabalho.",
      green: ["clean up", "desk"]
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
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">🏠 Lesson 61 - My House & My Routine</h1>
          <SpeakSentence text="Learn to talk about your house, furniture, and daily routine activities." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about your house, furniture, and daily routine activities.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img src={mainImage} alt="House and daily routine" className="w-full h-full object-cover rounded-2xl shadow-md" />
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
              <li><SpeakText text="to move" className="text-green-600 font-bold">to move</SpeakText> = mover, mudar</li>
              <li><SpeakText text="to put" className="text-green-600 font-bold">to put</SpeakText> = colocar, pôr</li>
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
                { en: "armchair", pt: "poltrona" },
                { en: "chair", pt: "cadeira" },
                { en: "desk", pt: "escrivaninha" },
                { en: "carpet", pt: "tapete" },
                { en: "tidy", pt: "arrumado(a)" },
                { en: "broken", pt: "quebrado(a)" },
                { en: "messy", pt: "bagunçado(a)" },
                { en: "dirty", pt: "sujo(a)" },
                { en: "to the left", pt: "para a esquerda" },
                { en: "to the right", pt: "para a direita" },
                { en: "next to", pt: "ao lado de" },
                { en: "closet", pt: "guarda-roupa" },
                { en: "dresser", pt: "cômoda" },
                { en: "coffee table", pt: "mesa de centro" },
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

        {/* ===================== SECTION 4 – GRAMMAR (com imagem) ===================== */}
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

            {/* ===== IMAGEM INSERIDA AQUI ===== */}
            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – There is / There are"
                className="w-full max-h-64 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "There is a closet in this room, too.", pt: "Tem um guarda-roupa neste quarto também." },
                { en: "There are four broken chairs here.", pt: "Tem quatro cadeiras quebradas aqui." },
                { en: "There aren't any carpets in my new house.", pt: "Não tem tapetes na minha casa nova." },
                { en: "There isn't a coffee table in this living room.", pt: "Não tem uma mesa de centro nesta sala de estar." },
                { en: "There aren't any armchairs in the bedroom.", pt: "Não há poltronas no quarto." },
                { en: "There isn't a swimming pool in this hotel.", pt: "Não tem uma piscina neste hotel." },
                { en: "Is there an ATM near here?", pt: "Tem algum caixa eletrônico perto daqui?" },
                { en: "How many shopping malls are there in this city?", pt: "Quantos shoppings têm nesta cidade?" },
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
                    { en: "Move this coffee table to the left, please.", pt: "Mude esta mesa de centro para a esquerda, por favor." },
                    { en: "Don't put the dirty carpets here, please.", pt: "Não coloque os tapetes sujos aqui, por favor." },
                    { en: "Let's move this armchair to the right side.", pt: "Vamos mover esta poltrona para o lado direito." },
                    { en: "Put the desk next to the dresser, please.", pt: "Coloque a escrivaninha ao lado da cômoda, por favor." },
                    { en: "Your bedroom is so tidy. My house is really messy!", pt: "Seu quarto é tão arrumado. Minha casa é muito bagunçada!" },
                    { en: "What a mess! I need to clean up this kitchen.", pt: "Que bagunça! Eu preciso limpar esta cozinha." },
                    { en: "Why do you need to move to New York?", pt: "Por que você precisa se mudar para Nova York?" },
                    { en: "My husband wants to put a new closet in our bedroom.", pt: "Meu marido quer colocar um guarda-roupa novo no nosso quarto." },
                    { en: "The laptop on the desk is broken.", pt: "O notebook em cima da escrivaninha está quebrado." },
                    { en: "Is there a vegan restaurant near here?", pt: "Tem algum restaurante vegano aqui perto?" },
                    { en: "There are some good bookstores in this mall.", pt: "Tem algumas livrarias boas neste shopping." },
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
                { en: "I want to move to the countryside.", pt: "Quero me mudar para o campo." },
                { en: "dirty carpet", pt: "tapete sujo" },
                { en: "There is no problem.", pt: "Não há problema." },
                { en: "Let's put these magazines away.", pt: "Vamos guardar essas revistas." },
                { en: "tidy bedroom", pt: "quarto arrumado" },
                { en: "Is there a bank in this station?", pt: "Tem um banco nesta estação?" },
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
          <button onClick={() => router.push("/cursos/lesson60")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (60)
          </button>
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (62) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM ===== */}
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