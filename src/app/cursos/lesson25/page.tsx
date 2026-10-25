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
    <div className="bg-white p-4 rounded-lg border border-purple-200">
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
// MAIN COMPONENT – LESSON 25
// ============================================
export default function Lesson25GettingAround() {
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
  const mainImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const storeImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const travelImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const shoppingImage = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const passportImage = "https://images.unsplash.com/photo-1559131397-f94da358a2f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ========== LESSON 25 DATA ==========
  const verbs = [
    { english: "to buy", portuguese: "comprar" },
    { english: "to take", portuguese: "pegar, levar" }
  ];

  const newWords = [
    { english: "gift", portuguese: "presente" },
    { english: "souvenir", portuguese: "lembrança" },
    { english: "store", portuguese: "loja" },
    { english: "ticket", portuguese: "bilhete, passagem" },
    { english: "food", portuguese: "comida" },
    { english: "money", portuguese: "dinheiro" },
    { english: "price", portuguese: "preço" },
    { english: "medicine", portuguese: "remédio" },
    { english: "backpack", portuguese: "mochila" },
    { english: "passport", portuguese: "passaporte" },
    { english: "thing", portuguese: "coisa" },
    { english: "good", portuguese: "bom" },
    { english: "bad", portuguese: "ruim" },
    { english: "cheap", portuguese: "barato" },
    { english: "expensive", portuguese: "caro" },
    { english: "a lot of", portuguese: "muito(a)" }
  ];

  const usefulPhrases = [
    { english: "How much is it?", portuguese: "Quanto custa?" },
    { english: "It's $5.", portuguese: "Custa 5 dólares." },
    { english: "It's cheap.", portuguese: "Está barato." },
    { english: "It's expensive.", portuguese: "Está caro." }
  ];

  const grammarExamples = [
    { english: "Does she eat cheese?", portuguese: "Ela come queijo?" },
    { english: "Does he understand Spanish?", portuguese: "Ele entende espanhol?" },
    { english: "Where does he live?", portuguese: "Onde ele mora?" },
    { english: "When does she go to the gym?", portuguese: "Quando ela vai à academia?" }
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Comprar / Eu compro. / Ele compra. / Nós compramos.",
      options: [
        { label: "Comprar", replacement: "to buy.", pt: "Comprar" },
        { label: "Eu compro", replacement: "I buy.", pt: "Eu compro." },
        { label: "Ele compra", replacement: "He buys.", pt: "Ele compra." },
        { label: "Nós compramos", replacement: "We buy.", pt: "Nós compramos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não compro. / Eles / Vocês.",
      options: [
        { label: "Eu", replacement: "I don't buy.", pt: "Eu não compro." },
        { label: "Eles", replacement: "They don't buy.", pt: "Eles não compram." },
        { label: "Vocês", replacement: "You all don't buy.", pt: "Vocês não compram." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele não compra. / precisa / quer.",
      options: [
        { label: "não compra", replacement: "He doesn't buy.", pt: "Ele não compra." },
        { label: "precisa", replacement: "He needs to buy.", pt: "Ele precisa comprar." },
        { label: "quer", replacement: "He wants to buy.", pt: "Ele quer comprar." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você compra? / Você quer comprar? / saber / aprender.",
      options: [
        { label: "compra", replacement: "Do you buy?", pt: "Você compra?" },
        { label: "quer", replacement: "Do you want to buy?", pt: "Você quer comprar?" },
        { label: "sabe", replacement: "Do you know how to buy?", pt: "Você sabe comprar?" },
        { label: "aprende", replacement: "Do you learn to buy?", pt: "Você aprende a comprar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ele quer comprar uma casa. / um carro / um celular.",
      options: [
        { label: "uma casa", replacement: "He wants to buy a house.", pt: "Ele quer comprar uma casa." },
        { label: "um carro", replacement: "He wants to buy a car.", pt: "Ele quer comprar um carro." },
        { label: "um celular", replacement: "He wants to buy a cell phone.", pt: "Ele quer comprar um celular." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu não preciso comprar um sofá. / Ele / Ela.",
      options: [
        { label: "Eu", replacement: "I don't need to buy a couch.", pt: "Eu não preciso comprar um sofá." },
        { label: "Ele", replacement: "He doesn't need to buy a couch.", pt: "Ele não precisa comprar um sofá." },
        { label: "Ela", replacement: "She doesn't need to buy a couch.", pt: "Ela não precisa comprar um sofá." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Pegar, levar, tomar / Eu pego. / Nós levamos. / Ele toma.",
      options: [
        { label: "Pegar", replacement: "to take.", pt: "Pegar, levar, tomar" },
        { label: "Eu pego", replacement: "I take.", pt: "Eu pego." },
        { label: "Nós levamos", replacement: "We take.", pt: "Nós levamos." },
        { label: "Ele toma", replacement: "He takes.", pt: "Ele toma." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu não levo. / Ele / Ela.",
      options: [
        { label: "Eu", replacement: "I don't take.", pt: "Eu não levo." },
        { label: "Ele", replacement: "He doesn't take.", pt: "Ele não leva." },
        { label: "Ela", replacement: "She doesn't take.", pt: "Ela não leva." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Você pega? / Eles / Nós.",
      options: [
        { label: "Você", replacement: "Do you take?", pt: "Você pega?" },
        { label: "Eles", replacement: "Do they take?", pt: "Eles pegam?" },
        { label: "Nós", replacement: "Do we take?", pt: "Nós pegamos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "O que você quer levar? / eles / nós.",
      options: [
        { label: "você", replacement: "What do you want to take?", pt: "O que você quer levar?" },
        { label: "eles", replacement: "What do they want to take?", pt: "O que eles querem levar?" },
        { label: "nós", replacement: "What do we want to take?", pt: "O que nós queremos levar?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu quero comprar um presente. / uma lembrancinha / um ingresso.",
      options: [
        { label: "um presente", replacement: "I want to buy a gift.", pt: "Eu quero comprar um presente." },
        { label: "uma lembrancinha", replacement: "I want to buy a souvenir.", pt: "Eu quero comprar uma lembrancinha." },
        { label: "um ingresso", replacement: "I want to buy a ticket.", pt: "Eu quero comprar um ingresso." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu tenho que comprar remédio. / comida / roupas.",
      options: [
        { label: "remédio", replacement: "I have to buy medicine.", pt: "Eu tenho que comprar remédio." },
        { label: "comida", replacement: "I have to buy food.", pt: "Eu tenho que comprar comida." },
        { label: "roupas", replacement: "I have to buy clothes.", pt: "Eu tenho que comprar roupas." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ela precisa comprar uma mochila nova. / grande / boa.",
      options: [
        { label: "nova", replacement: "She needs to buy a new backpack.", pt: "Ela precisa comprar uma mochila nova." },
        { label: "grande", replacement: "She needs to buy a big backpack.", pt: "Ela precisa comprar uma mochila grande." },
        { label: "boa", replacement: "She needs to buy a good backpack.", pt: "Ela precisa comprar uma mochila boa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu não preciso de um passaporte novo. / Ele / Ela.",
      options: [
        { label: "Eu", replacement: "I don't need a new passport.", pt: "Eu não preciso de um passaporte novo." },
        { label: "Ele", replacement: "He doesn't need a new passport.", pt: "Ele não precisa de um passaporte novo." },
        { label: "Ela", replacement: "She doesn't need a new passport.", pt: "Ela não precisa de um passaporte novo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu compro muitas coisas. / Você compra na loja.",
      options: [
        { label: "muitas coisas", replacement: "I buy a lot of things.", pt: "Eu compro muitas coisas." },
        { label: "na loja", replacement: "You buy at the store.", pt: "Você compra na loja." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não tenho muito dinheiro hoje. / tempo.",
      options: [
        { label: "dinheiro", replacement: "I don't have a lot of money today.", pt: "Eu não tenho muito dinheiro hoje." },
        { label: "tempo", replacement: "I don't have a lot of time today.", pt: "Eu não tenho muito tempo hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Você precisa comprar muitas coisas? / lembrancinhas / presentes.",
      options: [
        { label: "muitas coisas", replacement: "Do you need to buy a lot of things?", pt: "Você precisa comprar muitas coisas?" },
        { label: "lembrancinhas", replacement: "Do you need to buy souvenirs?", pt: "Você precisa comprar lembrancinhas?" },
        { label: "presentes", replacement: "Do you need to buy gifts?", pt: "Você precisa comprar presentes?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eu compro presentes para minha mãe. / meu marido / minha esposa.",
      options: [
        { label: "minha mãe", replacement: "I buy gifts for my mother.", pt: "Eu compro presentes para minha mãe." },
        { label: "meu marido", replacement: "I buy gifts for my husband.", pt: "Eu compro presentes para meu marido." },
        { label: "minha esposa", replacement: "I buy gifts for my wife.", pt: "Eu compro presentes para minha esposa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Você compra presentes para seu professor? / sua família / seus amigos.",
      options: [
        { label: "seu professor", replacement: "Do you buy gifts for your teacher?", pt: "Você compra presentes para seu professor?" },
        { label: "sua família", replacement: "Do you buy gifts for your family?", pt: "Você compra presentes para sua família?" },
        { label: "seus amigos", replacement: "Do you buy gifts for your friends?", pt: "Você compra presentes para seus amigos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu levo minha mochila para a escola. / meus livros / meu celular.",
      options: [
        { label: "minha mochila", replacement: "I take my backpack to school.", pt: "Eu levo minha mochila para a escola." },
        { label: "meus livros", replacement: "I take my books to school.", pt: "Eu levo meus livros para a escola." },
        { label: "meu celular", replacement: "I take my cell phone to school.", pt: "Eu levo meu celular para a escola." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "O que você leva para o trabalho? / para o escritório / para o banco.",
      options: [
        { label: "trabalho", replacement: "What do you take to work?", pt: "O que você leva para o trabalho?" },
        { label: "escritório", replacement: "What do you take to the office?", pt: "O que você leva para o escritório?" },
        { label: "banco", replacement: "What do you take to the bank?", pt: "O que você leva para o banco?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Você sabe o preço da passagem? / da mochila / do computador.",
      options: [
        { label: "passagem", replacement: "Do you know the price of the ticket?", pt: "Você sabe o preço da passagem?" },
        { label: "mochila", replacement: "Do you know the price of the backpack?", pt: "Você sabe o preço da mochila?" },
        { label: "computador", replacement: "Do you know the price of the computer?", pt: "Você sabe o preço do computador?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Quanto custa?",
      options: [
        { label: "Quanto custa?", replacement: "How much is it?", pt: "Quanto custa?" },
        { label: "Quanto custa a mochila?", replacement: "How much is the backpack?", pt: "Quanto custa a mochila?" },
        { label: "Quanto custa o ingresso?", replacement: "How much is the ticket?", pt: "Quanto custa o ingresso?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "São dois dólares. / dez / trinta.",
      options: [
        { label: "dois", replacement: "It's two dollars.", pt: "São dois dólares." },
        { label: "dez", replacement: "It's ten dollars.", pt: "São dez dólares." },
        { label: "trinta", replacement: "It's thirty dollars.", pt: "São trinta dólares." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Quanto custa a mochila? / o ingresso / o refrigerante.",
      options: [
        { label: "mochila", replacement: "How much is the backpack?", pt: "Quanto custa a mochila?" },
        { label: "ingresso", replacement: "How much is the ticket?", pt: "Quanto custa o ingresso?" },
        { label: "refrigerante", replacement: "How much is the soda?", pt: "Quanto custa o refrigerante?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "É caro. / É bom. / É ruim.",
      options: [
        { label: "caro", replacement: "It's expensive.", pt: "É caro." },
        { label: "bom", replacement: "It's good.", pt: "É bom." },
        { label: "ruim", replacement: "It's bad.", pt: "É ruim." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "É grande. / pequeno / novo / velho.",
      options: [
        { label: "grande", replacement: "It's big.", pt: "É grande." },
        { label: "pequeno", replacement: "It's small.", pt: "É pequeno." },
        { label: "novo", replacement: "It's new.", pt: "É novo." },
        { label: "velho", replacement: "It's old.", pt: "É velho." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Ela compra. / Ela não compra.",
      options: [
        { label: "compra", replacement: "She buys.", pt: "Ela compra." },
        { label: "não compra", replacement: "She doesn't buy.", pt: "Ela não compra." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela compra? / quer / precisa.",
      options: [
        { label: "compra", replacement: "Does she buy?", pt: "Ela compra?" },
        { label: "quer", replacement: "Does she want?", pt: "Ela quer?" },
        { label: "precisa", replacement: "Does she need?", pt: "Ela precisa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ela tem um passaporte? / um tablet / uma mochila.",
      options: [
        { label: "passaporte", replacement: "Does she have a passport?", pt: "Ela tem um passaporte?" },
        { label: "tablet", replacement: "Does she have a tablet?", pt: "Ela tem um tablet?" },
        { label: "mochila", replacement: "Does she have a backpack?", pt: "Ela tem uma mochila?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ela tem dinheiro? / tempo / muitos amigos.",
      options: [
        { label: "dinheiro", replacement: "Does she have money?", pt: "Ela tem dinheiro?" },
        { label: "tempo", replacement: "Does she have time?", pt: "Ela tem tempo?" },
        { label: "amigos", replacement: "Does she have many friends?", pt: "Ela tem muitos amigos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ela trabalha o dia todo? / estuda / cozinha.",
      options: [
        { label: "trabalha", replacement: "Does she work all day?", pt: "Ela trabalha o dia todo?" },
        { label: "estuda", replacement: "Does she study all day?", pt: "Ela estuda o dia todo?" },
        { label: "cozinha", replacement: "Does she cook all day?", pt: "Ela cozinha o dia todo?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ela limpa a casa nos fins de semana? / aos sábados / aos domingos.",
      options: [
        { label: "fins de semana", replacement: "Does she clean the house on weekends?", pt: "Ela limpa a casa nos fins de semana?" },
        { label: "sábados", replacement: "Does she clean the house on Saturdays?", pt: "Ela limpa a casa aos sábados?" },
        { label: "domingos", replacement: "Does she clean the house on Sundays?", pt: "Ela limpa a casa aos domingos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ela gosta de comprar lembrancinhas? / livros / sapatos.",
      options: [
        { label: "lembrancinhas", replacement: "Does she like to buy souvenirs?", pt: "Ela gosta de comprar lembrancinhas?" },
        { label: "livros", replacement: "Does she like to buy books?", pt: "Ela gosta de comprar livros?" },
        { label: "sapatos", replacement: "Does she like to buy shoes?", pt: "Ela gosta de comprar sapatos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "O que ela precisa comprar? / estudar / aprender.",
      options: [
        { label: "comprar", replacement: "What does she need to buy?", pt: "O que ela precisa comprar?" },
        { label: "estudar", replacement: "What does she need to study?", pt: "O que ela precisa estudar?" },
        { label: "aprender", replacement: "What does she need to learn?", pt: "O que ela precisa aprender?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Quando ela vai à praia? / ao cinema / à loja.",
      options: [
        { label: "praia", replacement: "When does she go to the beach?", pt: "Quando ela vai à praia?" },
        { label: "cinema", replacement: "When does she go to the movies?", pt: "Quando ela vai ao cinema?" },
        { label: "loja", replacement: "When does she go to the store?", pt: "Quando ela vai à loja?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Onde ela mora? / estuda / dorme.",
      options: [
        { label: "mora", replacement: "Where does she live?", pt: "Onde ela mora?" },
        { label: "estuda", replacement: "Where does she study?", pt: "Onde ela estuda?" },
        { label: "dorme", replacement: "Where does she sleep?", pt: "Onde ela dorme?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Onde ele quer ficar? / ir / comer.",
      options: [
        { label: "ficar", replacement: "Where does he want to stay?", pt: "Onde ele quer ficar?" },
        { label: "ir", replacement: "Where does he want to go?", pt: "Onde ele quer ir?" },
        { label: "comer", replacement: "Where does he want to eat?", pt: "Onde ele quer comer?" },
      ],
      currentIndex: 0,
    },
  ];

  const realLifeSentences = [
    { english: "I want to learn how to cook.", portuguese: "Eu quero aprender a cozinhar." },
    { english: "She wants to study English.", portuguese: "Ela quer estudar inglês." },
    { english: "He needs to work on Saturday.", portuguese: "Ele precisa trabalhar no sábado." },
    { english: "I don't want to go now.", portuguese: "Eu não quero ir agora." },
    { english: "She doesn't want to buy this.", portuguese: "Ela não quer comprar isso." },
    { english: "I don't understand.", portuguese: "Eu não entendo." },
    { english: "He doesn't speak French.", portuguese: "Ele não fala francês." },
    { english: "They don't have money.", portuguese: "Eles não têm dinheiro." },
    { english: "She doesn't work here.", portuguese: "Ela não trabalha aqui." },
    { english: "We don't need tickets.", portuguese: "Nós não precisamos de bilhetes." }
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

        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🛒 Lesson 25 - Getting Around
          </h1>
          <SpeakSentence text="Learn to shop, travel, ask about prices, and talk about daily needs." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to shop, travel, ask about prices, and talk about daily needs.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Shopping and getting around"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
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

        {/* Section 2 - Vocabulary with Drill */}
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

        {/* Section 3 - Useful Phrases with Drill */}
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
            <SpeakSentence text="Practice common phrases for shopping and asking about prices" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for shopping and asking about prices
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <SpeakSentence text={phrase.english} className="text-blue-600 font-bold cursor-pointer text-lg mb-2 block">
                    {phrase.english}
                  </SpeakSentence>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>

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
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
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
            <SpeakSentence text="Structures for asking questions with do/does" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking questions with do/does
            </SpeakSentence>
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

        {/* Section 5 - Make It Yours */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice shopping, travel, and daily needs
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
                          {index + 1}. {sentence.english}
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
                        src={storeImage}
                        alt="Shopping at store"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Shopping and asking prices
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={travelImage}
                        alt="Travel and tickets"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Travel and transportation
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={passportImage}
                        alt="Documents and passports"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Important documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Wrap Up */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Affirmative, negative and question contrasts with Do/Does" className="mt-2 text-blue-100 italic">
                📝 Affirmative, negative and question contrasts with Do/Does
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-4 text-yellow-300">AFFIRMATIVE SENTENCES</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">I buy food.</p>
                  <p className="text-green-200 text-sm">Eu compro comida.</p>
                </div>
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">She buys food.</p>
                  <p className="text-green-200 text-sm">Ela compra comida.</p>
                </div>
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">We have money.</p>
                  <p className="text-green-200 text-sm">Nós temos dinheiro.</p>
                </div>
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">He has money.</p>
                  <p className="text-green-200 text-sm">Ele tem dinheiro.</p>
                </div>
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">They want tickets.</p>
                  <p className="text-green-200 text-sm">Eles querem bilhetes.</p>
                </div>
                <div className="p-3 bg-green-700 rounded-lg">
                  <p className="font-bold text-lg">She wants a ticket.</p>
                  <p className="text-green-200 text-sm">Ela quer um bilhete.</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={shoppingImage}
                    alt="Shopping and buying"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🛍️ Positive Situations</p>
                    <p className="text-green-200 text-xs">Talking about what you have and want</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">NEGATIVE SENTENCES</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">I don't want to go.</p>
                      <p className="text-red-200 text-sm">Eu não quero ir.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">She doesn't want to buy this.</p>
                      <p className="text-red-200 text-sm">Ela não quer comprar isso.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">I don't understand.</p>
                      <p className="text-red-200 text-sm">Eu não entendo.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">He doesn't speak French.</p>
                      <p className="text-red-200 text-sm">Ele não fala francês.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">They don't have money.</p>
                      <p className="text-red-200 text-sm">Eles não têm dinheiro.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">She doesn't work here.</p>
                      <p className="text-red-200 text-sm">Ela não trabalha aqui.</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-red-600">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">QUESTIONS WITH DO/DOES</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">Do you want to buy this?</p>
                      <p className="text-red-200 text-sm">Você quer comprar isso?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">Does she need medicine?</p>
                      <p className="text-red-200 text-sm">Ela precisa de remédio?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">Do they have passports?</p>
                      <p className="text-red-200 text-sm">Eles têm passaportes?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">Does he take the bus?</p>
                      <p className="text-red-200 text-sm">Ele pega o ônibus?</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-red-600">
                  <div className="bg-red-700 rounded-lg overflow-hidden">
                    <img
                      src={grammarImage}
                      alt="Grammar practice"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-yellow-200 text-sm font-medium">📚 Grammar Focus</p>
                      <p className="text-red-200 text-xs">Practice questions and negative forms</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson24")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (24)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson26")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (26) &rarr;
          </button>
        </div>
      </div>

      {/* Botão de Lápis Flutuante */}
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