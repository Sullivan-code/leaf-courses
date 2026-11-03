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
  if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
  else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => speakEnglish(text, 0.9);

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
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
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
    </button>
  );
};

// ============================================
// SUBSTITUTION EXERCISE COMPONENT
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PENCIL ICON
// ============================================
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
// MAIN COMPONENT – LESSON 49
// ============================================
export default function Lesson49GoingShopping() {
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

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || '',
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes(prev => ({
      ...prev,
      [noteModal.sectionTitle]: note,
    }));
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

  // Images
  const mainImage = "https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const talkImage = "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const watchImage = "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const opinionImage = "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ========== LESSON 49 DATA ==========
  const verbs = [
    { english: "to wear", portuguese: "vestir, usar" },
    { english: "to change", portuguese: "trocar, mudar" }
  ];

  const newWords = [
    { english: "shirt", portuguese: "blusa, camisa" },
    { english: "t-shirt", portuguese: "camiseta" },
    { english: "pants", portuguese: "calça" },
    { english: "jeans", portuguese: "calça jeans" },
    { english: "dress", portuguese: "vestido" },
    { english: "skirt", portuguese: "saia" },
    { english: "jacket", portuguese: "jaqueta" },
    { english: "coat", portuguese: "casaco" },
    { english: "sneakers", portuguese: "tênis" },
    { english: "suit", portuguese: "terno" },
    { english: "socks", portuguese: "meias" },
    { english: "shorts", portuguese: "bermudas" },
    { english: "watch", portuguese: "relógio" },
    { english: "glasses", portuguese: "óculos" },
    { english: "outfit", portuguese: "roupa, conjunto" },
    { english: "style", portuguese: "estilo" },
  ];

  const grammarExamples = [
    { english: "I am waiting for the doctor.", portuguese: "Eu estou esperando pelo médico." },
    { english: "You are wearing a beautiful coat.", portuguese: "Você está usando um casaco lindo." },
    { english: "She is changing her outfit.", portuguese: "Ela está trocando de roupa." },
    { english: "He is making a delicious cake.", portuguese: "Ele está fazendo um bolo delicioso." },
    { english: "The class is starting now.", portuguese: "A aula está começando agora." },
    { english: "They are watching a movie now.", portuguese: "Eles estão assistindo a um filme agora." },
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "I wear / You wear / He wears / We wear / They wear",
      options: [
        { label: "I", replacement: "I wear.", pt: "Eu visto." },
        { label: "You", replacement: "You wear.", pt: "Você veste." },
        { label: "He", replacement: "He wears.", pt: "Ele veste." },
        { label: "We", replacement: "We wear.", pt: "Nós vestimos." },
        { label: "They", replacement: "They wear.", pt: "Eles vestem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "She doesn't wear jeans. / a coat / a dress",
      options: [
        { label: "jeans", replacement: "She doesn't wear jeans.", pt: "Ela não veste calça jeans." },
        { label: "a coat", replacement: "She doesn't wear a coat.", pt: "Ela não veste um casaco." },
        { label: "a dress", replacement: "She doesn't wear a dress.", pt: "Ela não veste um vestido." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Does he wear glasses? / a uniform / a suit",
      options: [
        { label: "glasses", replacement: "Does he wear glasses?", pt: "Ele usa óculos?" },
        { label: "a uniform", replacement: "Does he wear a uniform?", pt: "Ele usa uniforme?" },
        { label: "a suit", replacement: "Does he wear a suit?", pt: "Ele usa terno?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Do you wear a uniform? / a suit / glasses",
      options: [
        { label: "a uniform", replacement: "Do you wear a uniform?", pt: "Você usa uniforme?" },
        { label: "a suit", replacement: "Do you wear a suit?", pt: "Você usa terno?" },
        { label: "glasses", replacement: "Do you wear glasses?", pt: "Você usa óculos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "I change / You change / He changes / We change / They change",
      options: [
        { label: "I", replacement: "I change.", pt: "Eu troco." },
        { label: "You", replacement: "You change.", pt: "Você troca." },
        { label: "He", replacement: "He changes.", pt: "Ele troca." },
        { label: "We", replacement: "We change.", pt: "Nós trocamos." },
        { label: "They", replacement: "They change.", pt: "Eles trocam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "I don't change my style. / my outfit / my shoes",
      options: [
        { label: "my style", replacement: "I don't change my style.", pt: "Eu não mudo meu estilo." },
        { label: "my outfit", replacement: "I don't change my outfit.", pt: "Eu não troco de roupa." },
        { label: "my shoes", replacement: "I don't change my shoes.", pt: "Eu não troco meus sapatos." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "I prefer to wear a t-shirt. / a suit / a shirt",
      options: [
        { label: "a t-shirt", replacement: "I prefer to wear a t-shirt.", pt: "Eu prefiro usar uma camiseta." },
        { label: "a suit", replacement: "I prefer to wear a suit.", pt: "Eu prefiro usar um terno." },
        { label: "a shirt", replacement: "I prefer to wear a shirt.", pt: "Eu prefiro usar uma camisa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "She likes to wear skirts. / dresses / sneakers",
      options: [
        { label: "skirts", replacement: "She likes to wear skirts.", pt: "Ela gosta de usar saias." },
        { label: "dresses", replacement: "She likes to wear dresses.", pt: "Ela gosta de usar vestidos." },
        { label: "sneakers", replacement: "She likes to wear sneakers.", pt: "Ela gosta de usar tênis." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "My sister doesn't like to wear glasses. / coats / jeans",
      options: [
        { label: "glasses", replacement: "My sister doesn't like to wear glasses.", pt: "Minha irmã não gosta de usar óculos." },
        { label: "coats", replacement: "My sister doesn't like to wear coats.", pt: "Minha irmã não gosta de usar casacos." },
        { label: "jeans", replacement: "My sister doesn't like to wear jeans.", pt: "Minha irmã não gosta de usar calças jeans." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "He never wears this jacket. / coat / suit",
      options: [
        { label: "this jacket", replacement: "He never wears this jacket.", pt: "Ele nunca usa esta jaqueta." },
        { label: "this coat", replacement: "He never wears this coat.", pt: "Ele nunca usa este casaco." },
        { label: "this suit", replacement: "He never wears this suit.", pt: "Ele nunca usa este terno." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "I need to take my white sneakers. / blue dress / black jacket",
      options: [
        { label: "white sneakers", replacement: "I need to take my white sneakers.", pt: "Eu preciso levar meus tênis brancos." },
        { label: "blue dress", replacement: "I need to take my blue dress.", pt: "Eu preciso levar meu vestido azul." },
        { label: "black jacket", replacement: "I need to take my black jacket.", pt: "Eu preciso levar minha jaqueta preta." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "I want to change my outfit. / my style / my shorts",
      options: [
        { label: "my outfit", replacement: "I want to change my outfit.", pt: "Eu quero trocar de roupa." },
        { label: "my style", replacement: "I want to change my style.", pt: "Eu quero mudar meu estilo." },
        { label: "my shorts", replacement: "I want to change my shorts.", pt: "Eu quero trocar minha bermuda." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "What size do you wear? / does he wear? / does she wear?",
      options: [
        { label: "do you", replacement: "What size do you wear?", pt: "Que tamanho você usa?" },
        { label: "does he", replacement: "What size does he wear?", pt: "Que tamanho ele usa?" },
        { label: "does she", replacement: "What size does she wear?", pt: "Que tamanho ela usa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Does he wear size small? / medium / large",
      options: [
        { label: "small", replacement: "Does he wear size small?", pt: "Ele usa tamanho pequeno?" },
        { label: "medium", replacement: "Does he wear size medium?", pt: "Ele usa tamanho médio?" },
        { label: "large", replacement: "Does he wear size large?", pt: "Ele usa tamanho grande?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "I want to try that coat on. / suit / pants",
      options: [
        { label: "that coat", replacement: "I want to try that coat on.", pt: "Eu quero provar aquele casaco." },
        { label: "that suit", replacement: "I want to try that suit on.", pt: "Eu quero provar aquele terno." },
        { label: "those pants", replacement: "I want to try those pants on.", pt: "Eu quero provar aquelas calças." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Do you want to try the dress on? / the t-shirt / the shorts",
      options: [
        { label: "the dress", replacement: "Do you want to try the dress on?", pt: "Você quer provar o vestido?" },
        { label: "the t-shirt", replacement: "Do you want to try the t-shirt on?", pt: "Você quer provar a camiseta?" },
        { label: "the shorts", replacement: "Do you want to try the shorts on?", pt: "Você quer provar a bermuda?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "I want to buy a pair of shoes. / a pair of jeans / a pair of black pants",
      options: [
        { label: "a pair of shoes", replacement: "I want to buy a pair of shoes.", pt: "Eu quero comprar um par de sapatos." },
        { label: "a pair of jeans", replacement: "I want to buy a pair of jeans.", pt: "Eu quero comprar um par de calças jeans." },
        { label: "a pair of black pants", replacement: "I want to buy a pair of black pants.", pt: "Eu quero comprar um par de calças pretas." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "He needs a pair of socks. / a pair of glasses / a pair of sunglasses",
      options: [
        { label: "a pair of socks", replacement: "He needs a pair of socks.", pt: "Ele precisa de um par de meias." },
        { label: "a pair of glasses", replacement: "He needs a pair of glasses.", pt: "Ele precisa de um par de óculos." },
        { label: "a pair of sunglasses", replacement: "He needs a pair of sunglasses.", pt: "Ele precisa de um par de óculos de sol." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "She is making my favorite dish. / his / our",
      options: [
        { label: "my", replacement: "She is making my favorite dish.", pt: "Ela está fazendo meu prato favorito." },
        { label: "his", replacement: "She is making his favorite dish.", pt: "Ela está fazendo o prato favorito dele." },
        { label: "our", replacement: "She is making our favorite dish.", pt: "Ela está fazendo nosso prato favorito." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "He is opening the store. / She is opening / We are opening",
      options: [
        { label: "He", replacement: "He is opening the store.", pt: "Ele está abrindo a loja." },
        { label: "She", replacement: "She is opening the store.", pt: "Ela está abrindo a loja." },
        { label: "We", replacement: "We are opening the store.", pt: "Nós estamos abrindo a loja." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "They are waiting for you. / the sales clerk / the manager",
      options: [
        { label: "you", replacement: "They are waiting for you.", pt: "Eles estão esperando por você." },
        { label: "the sales clerk", replacement: "They are waiting for the sales clerk.", pt: "Eles estão esperando pelo vendedor." },
        { label: "the manager", replacement: "They are waiting for the manager.", pt: "Eles estão esperando pelo gerente." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "He is closing the bar now. / the snack bar / the restaurant",
      options: [
        { label: "the bar", replacement: "He is closing the bar now.", pt: "Ele está fechando o bar agora." },
        { label: "the snack bar", replacement: "He is closing the snack bar now.", pt: "Ele está fechando a lanchonete agora." },
        { label: "the restaurant", replacement: "He is closing the restaurant now.", pt: "Ele está fechando o restaurante agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Someone is calling you. / the doctor / the nurse",
      options: [
        { label: "you", replacement: "Someone is calling you.", pt: "Alguém está chamando você." },
        { label: "the doctor", replacement: "Someone is calling the doctor.", pt: "Alguém está chamando o médico." },
        { label: "the nurse", replacement: "Someone is calling the nurse.", pt: "Alguém está chamando a enfermeira." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "She is wearing a dress. / a coat / a pair of jeans",
      options: [
        { label: "a dress", replacement: "She is wearing a dress.", pt: "Ela está usando um vestido." },
        { label: "a coat", replacement: "She is wearing a coat.", pt: "Ela está usando um casaco." },
        { label: "a pair of jeans", replacement: "She is wearing a pair of jeans.", pt: "Ela está usando um par de calças jeans." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== REAL LIFE PRACTICE (MAKE IT YOURS) – B1 LEVEL & BLUE KEYWORDS ==========
  const realLifeSentences = [
    {
      english: "I want to try this shirt on before buying it.",
      portuguese: "Quero experimentar esta camisa.",
      jsx: <>I <span className="text-blue-600 font-bold">want to try</span> this <span className="text-blue-600 font-bold">shirt</span> on before buying it.</>,
    },
    {
      english: "Do you want to try the blue pants on?",
      portuguese: "Você quer experimentar a calça azul?",
      jsx: <>Do you <span className="text-blue-600 font-bold">want to try</span> the <span className="text-blue-600 font-bold">blue pants</span> on?</>,
    },
    {
      english: "I need to change my clothes before we go out.",
      portuguese: "Preciso trocar de roupa antes de irmos.",
      jsx: <>I <span className="text-blue-600 font-bold">need to change</span> my <span className="text-blue-600 font-bold">clothes</span> before we go out.</>,
    },
    {
      english: "I prefer to wear comfortable clothes when I go to work.",
      portuguese: "Prefiro usar roupas confortáveis para o trabalho.",
      jsx: <>I <span className="text-blue-600 font-bold">prefer to wear</span> comfortable <span className="text-blue-600 font-bold">clothes</span> when I go to work.</>,
    },
    {
      english: "He is always wearing sunglasses, even inside.",
      portuguese: "Ele está sempre usando óculos de sol.",
      jsx: <>He is <span className="text-blue-600 font-bold">always wearing</span> <span className="text-blue-600 font-bold">sunglasses</span>, even inside.</>,
    },
    {
      english: "I really like the suit you're wearing today.",
      portuguese: "Eu gosto muito do terno que você está usando hoje.",
      jsx: <>I <span className="text-blue-600 font-bold">really like</span> the <span className="text-blue-600 font-bold">suit</span> you're wearing today.</>,
    },
    {
      english: "You're wearing very funny socks!",
      portuguese: "Você está usando meias engraçadas!",
      jsx: <>You're <span className="text-blue-600 font-bold">wearing</span> very funny <span className="text-blue-600 font-bold">socks</span>!</>,
    },
    {
      english: "I'm buying a new pair of pants for my husband.",
      portuguese: "Estou comprando uma calça nova para meu marido.",
      jsx: <>I'm <span className="text-blue-600 font-bold">buying</span> a new <span className="text-blue-600 font-bold">pair of pants</span> for my husband.</>,
    },
    {
      english: "They're waiting for you at the mall right now.",
      portuguese: "Eles estão esperando por você no shopping.",
      jsx: <>They're <span className="text-blue-600 font-bold">waiting</span> for you at the <span className="text-blue-600 font-bold">mall</span> right now.</>,
    },
    {
      english: "We're changing our outfit to go to the bar.",
      portuguese: "Estamos trocando de roupa para ir ao bar.",
      jsx: <>We're <span className="text-blue-600 font-bold">changing</span> our <span className="text-blue-600 font-bold">outfit</span> to go to the bar.</>,
    },
    {
      english: "She is talking to the sales clerk about the price.",
      portuguese: "Ela está falando com o vendedor agora.",
      jsx: <>She is <span className="text-blue-600 font-bold">talking</span> to the <span className="text-blue-600 font-bold">sales clerk</span> about the price.</>,
    },
    {
      english: "They're closing the store now, so let's go.",
      portuguese: "Eles estão fechando a loja agora.",
      jsx: <>They're <span className="text-blue-600 font-bold">closing</span> the <span className="text-blue-600 font-bold">store</span> now, so let's go.</>,
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🛍️ Lesson 49 - Going Shopping
          </h1>
          <SpeakSentence text="Learn to talk about clothes, sizes, trying things on, and use the Present Continuous." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about clothes, sizes, trying things on, and use the Present Continuous.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="People shopping"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
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
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <SpeakText text={verb.english} className="text-blue-600 font-bold">
                    {verb.english}
                  </SpeakText> = {verb.portuguese}
                </li>
              ))}
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {verbsSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
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
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWords.map((word, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.english}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.portuguese}</div>
                </div>
              ))}
            </div>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {vocabSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 3 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <SpeakSentence text="Practice common phrases for shopping" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for shopping
            </SpeakSentence>

            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {phrasesSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
              </div>
            )}

            {!openDrills.usefulPhrases && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { en: "I want to buy a pair of shoes.", pt: "Eu quero comprar um par de sapatos." },
                  { en: "I want to try that dress on.", pt: "Eu quero experimentar aquele vestido." },
                  { en: "What size are you?", pt: "Qual é o seu tamanho?" },
                  { en: "I'm changing my outfit before we go.", pt: "Estou trocando de roupa antes de irmos." },
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-lg mb-2 block">
                      {item.en}
                    </SpeakSentence>
                    <div className="text-gray-600">{item.pt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR – PRESENT CONTINUOUS</h2>
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
            <div className="bg-blue-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                📚 UNDERSTANDING THE PRESENT CONTINUOUS
              </h3>
              <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500 mb-4">
                <h4 className="text-lg font-bold text-blue-700 mb-2">✅ STRUCTURE</h4>
                <p className="text-gray-700 mb-2">
                  <span className="font-bold">Subject + verb to be (am/is/are) + main verb with -ing</span>
                </p>
                <p className="text-gray-600 italic">"I am waiting for the doctor."</p>
                <p className="text-sm text-gray-500">Eu estou esperando pelo médico.</p>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
                <h4 className="text-lg font-bold text-yellow-700 mb-2">💡 WHEN TO USE</h4>
                <p className="text-gray-700">
                  Actions that are happening <span className="font-bold">now, at this moment</span>.
                </p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={example.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {example.english}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{example.portuguese}</div>
                </div>
              ))}
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {grammarSubstitution.map((ex) => (
                  <SubstitutionOptions
                    key={ex.key}
                    exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }}
                    onOptionClick={handleOptionClick}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice real-life situations
            </div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          {index + 1}. {sentence.jsx || sentence.english}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={talkImage}
                        alt="People talking"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Trying clothes on</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={watchImage}
                        alt="Watching movies"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Shopping with friends</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={opinionImage}
                        alt="Sharing opinions"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Talking to the sales clerk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP ===================== */}
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
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">SIZES & CLOTHES</h3>
              {[
                { en: "small / medium / large", pt: "pequeno / médio / grande" },
                { en: "I'm a medium.", pt: "Eu visto médio." },
                { en: "I wear medium.", pt: "Eu uso tamanho médio." },
                { en: "a pair of shoes", pt: "um par de sapatos" },
                { en: "a pair of sneakers", pt: "um par de tênis" },
                { en: "a pair of pants", pt: "um par de calças" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-green-700 rounded-lg">
                  <SpeakSentence text={item.en} className="font-bold text-green-50">{item.en}</SpeakSentence>
                  <p className="text-green-200 text-sm mt-1">{item.pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">PRESENT PERFECT & PAST PERFECT</h3>
              {[
                { en: "I have bought a new shirt.", pt: "Eu comprei uma camisa nova." },
                { en: "She has worn that dress before.", pt: "Ela já usou aquele vestido antes." },
                { en: "I had already changed my clothes when he arrived.", pt: "Eu já tinha trocado de roupa quando ele chegou." },
                { en: "They had never seen that style before.", pt: "Eles nunca tinham visto aquele estilo antes." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-red-700 rounded-lg">
                  <SpeakSentence text={item.en} className="font-bold text-red-50">{item.en}</SpeakSentence>
                  <p className="text-red-200 text-sm mt-1">{item.pt}</p>
                </div>
              ))}

              <div className="pt-4 border-t border-red-600 mt-4">
                <div className="bg-red-700 rounded-lg overflow-hidden">
                  <img src={grammarImage} alt="Grammar practice" className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="text-yellow-200 text-sm font-medium">📚 Grammar Focus</p>
                    <p className="text-red-200 text-xs">Present Continuous, Present Perfect, Past Perfect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson48")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (48)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson50")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (50) &rarr;
          </button>
        </div>
      </div>

      {/* Floating Pencil Button */}
      <button
        onClick={() => openNoteModal('Anotações Globais')}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
        title="Fazer anotações em qualquer momento"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      {/* Note Modal */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}