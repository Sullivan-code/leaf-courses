"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkout';

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
// MAIN COMPONENT – LESSON 51
// ============================================
export default function Lesson51GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkout: false,
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
  const mainImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const talkImage = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const watchImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const opinionImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ========== LESSON 51 DATA ==========
  const verbs = [
    { english: "to sell, sold", portuguese: "vender, vendeu" },
    { english: "to pay, paid", portuguese: "pagar, pagou" }
  ];

  const newWords = [
    { english: "customer", portuguese: "cliente" },
    { english: "attendant", portuguese: "atendente" },
    { english: "wallet", portuguese: "carteira" },
    { english: "purse", portuguese: "bolsa" },
    { english: "bag", portuguese: "bolsa/saco" },
    { english: "cash", portuguese: "dinheiro" },
    { english: "credit card", portuguese: "cartão de crédito" },
    { english: "receipt", portuguese: "recibo" },
    { english: "change", portuguese: "troco" },
    { english: "ATM", portuguese: "caixa eletrônico" },
    { english: "discount", portuguese: "desconto" },
    { english: "product", portuguese: "produto" },
    { english: "item", portuguese: "item" },
    { english: "fitting room", portuguese: "provador" },
    { english: "department store", portuguese: "loja de departamento" },
    { english: "outlet mall", portuguese: "outlet" },
    { english: "garage sale", portuguese: "venda de garagem" },
  ];

  const grammarExamples = [
    { english: "I'm not doing my homework now.", portuguese: "Eu não estou fazendo minha lição agora." },
    { english: "You aren't studying alone.", portuguese: "Você não está estudando sozinho." },
    { english: "She isn't calling the attendant.", portuguese: "Ela não está chamando o atendente." },
    { english: "He isn't paying with his credit card.", portuguese: "Ele não está pagando com o cartão de crédito." },
    { english: "I have already bought a new wallet.", portuguese: "Eu já comprei uma carteira nova." },
    { english: "She has worn that dress before.", portuguese: "Ela já usou aquele vestido antes." },
    { english: "We have never tried this outlet mall.", portuguese: "Nós nunca experimentamos este outlet." },
    { english: "I had already changed my clothes when he arrived.", portuguese: "Eu já tinha trocado de roupa quando ele chegou." },
    { english: "She had bought the shoes before the sale ended.", portuguese: "Ela tinha comprado os sapatos antes da promoção acabar." },
    { english: "They had never seen that style before.", portuguese: "Eles nunca tinham visto aquele estilo antes." },
  ];

  // ========== VERBS SUBSTITUTION (Image 1 & 2) ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "I sell / We sell / They sell",
      options: [
        { label: "I sell", replacement: "I sell.", pt: "Eu vendo." },
        { label: "We sell", replacement: "We sell.", pt: "Nós vendemos." },
        { label: "They sell", replacement: "They sell.", pt: "Eles vendem." },
        { label: "I sold (past)", replacement: "I sold.", pt: "Eu vendi." },
        { label: "We sold (past)", replacement: "We sold.", pt: "Nós vendemos." },
        { label: "They sold (past)", replacement: "They sold.", pt: "Eles venderam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "I don't sell. / He doesn't sell. / She doesn't sell.",
      options: [
        { label: "I don't sell", replacement: "I don't sell.", pt: "Eu não vendo." },
        { label: "He doesn't sell", replacement: "He doesn't sell.", pt: "Ele não vende." },
        { label: "She doesn't sell", replacement: "She doesn't sell.", pt: "Ela não vende." },
        { label: "I didn't sell (past)", replacement: "I didn't sell.", pt: "Eu não vendi." },
        { label: "He didn't sell (past)", replacement: "He didn't sell.", pt: "Ele não vendeu." },
        { label: "She didn't sell (past)", replacement: "She didn't sell.", pt: "Ela não vendeu." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Do you sell? / Do they sell? / Does he sell?",
      options: [
        { label: "Do you sell?", replacement: "Do you sell?", pt: "Você vende?" },
        { label: "Do they sell?", replacement: "Do they sell?", pt: "Eles vendem?" },
        { label: "Does he sell?", replacement: "Does he sell?", pt: "Ele vende?" },
        { label: "Did you sell? (past)", replacement: "Did you sell?", pt: "Você vendeu?" },
        { label: "Did they sell? (past)", replacement: "Did they sell?", pt: "Eles venderam?" },
        { label: "Did he sell? (past)", replacement: "Did he sell?", pt: "Ele vendeu?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "He sells cars. / clothes / food",
      options: [
        { label: "cars", replacement: "He sells cars.", pt: "Ele vende carros." },
        { label: "clothes", replacement: "He sells clothes.", pt: "Ele vende roupas." },
        { label: "food", replacement: "He sells food.", pt: "Ele vende comida." },
        { label: "cars (past)", replacement: "He sold cars.", pt: "Ele vendeu carros." },
        { label: "clothes (past)", replacement: "He sold clothes.", pt: "Ele vendeu roupas." },
        { label: "food (past)", replacement: "He sold food.", pt: "Ele vendeu comida." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "I sell books to my friends. / clothes / shoes",
      options: [
        { label: "books", replacement: "I sell books to my friends.", pt: "Eu vendo livros para meus amigos." },
        { label: "clothes", replacement: "I sell clothes to my friends.", pt: "Eu vendo roupas para meus amigos." },
        { label: "shoes", replacement: "I sell shoes to my friends.", pt: "Eu vendo sapatos para meus amigos." },
        { label: "books (past)", replacement: "I sold books to my friends.", pt: "Eu vendi livros para meus amigos." },
        { label: "clothes (past)", replacement: "I sold clothes to my friends.", pt: "Eu vendi roupas para meus amigos." },
        { label: "shoes (past)", replacement: "I sold shoes to my friends.", pt: "Eu vendi sapatos para meus amigos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "What do you want to sell? / buy / take",
      options: [
        { label: "sell", replacement: "What do you want to sell?", pt: "O que você quer vender?" },
        { label: "buy", replacement: "What do you want to buy?", pt: "O que você quer comprar?" },
        { label: "take", replacement: "What do you want to take?", pt: "O que você quer levar?" },
        { label: "sell (past)", replacement: "What did you want to sell?", pt: "O que você queria vender?" },
        { label: "buy (past)", replacement: "What did you want to buy?", pt: "O que você queria comprar?" },
        { label: "take (past)", replacement: "What did you want to take?", pt: "O que você queria levar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "I pay. / He pays. / She pays.",
      options: [
        { label: "I pay", replacement: "I pay.", pt: "Eu pago." },
        { label: "He pays", replacement: "He pays.", pt: "Ele paga." },
        { label: "She pays", replacement: "She pays.", pt: "Ela paga." },
        { label: "I paid (past)", replacement: "I paid.", pt: "Eu paguei." },
        { label: "He paid (past)", replacement: "He paid.", pt: "Ele pagou." },
        { label: "She paid (past)", replacement: "She paid.", pt: "Ela pagou." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "I don't pay. / We don't pay. / They don't pay.",
      options: [
        { label: "I don't pay", replacement: "I don't pay.", pt: "Eu não pago." },
        { label: "We don't pay", replacement: "We don't pay.", pt: "Nós não pagamos." },
        { label: "They don't pay", replacement: "They don't pay.", pt: "Eles não pagam." },
        { label: "I didn't pay (past)", replacement: "I didn't pay.", pt: "Eu não paguei." },
        { label: "We didn't pay (past)", replacement: "We didn't pay.", pt: "Nós não pagamos." },
        { label: "They didn't pay (past)", replacement: "They didn't pay.", pt: "Eles não pagaram." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "How much do you pay for this? / for this medicine / for this course",
      options: [
        { label: "this", replacement: "How much do you pay for this?", pt: "Quanto você paga por isso?" },
        { label: "this medicine", replacement: "How much do you pay for this medicine?", pt: "Quanto você paga por este remédio?" },
        { label: "this course", replacement: "How much do you pay for this course?", pt: "Quanto você paga por este curso?" },
        { label: "this (past)", replacement: "How much did you pay for this?", pt: "Quanto você pagou por isso?" },
        { label: "this medicine (past)", replacement: "How much did you pay for this medicine?", pt: "Quanto você pagou por este remédio?" },
        { label: "this course (past)", replacement: "How much did you pay for this course?", pt: "Quanto você pagou por este curso?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "I need to pay my brother. / friend / coworker",
      options: [
        { label: "brother", replacement: "I need to pay my brother.", pt: "Eu preciso pagar meu irmão." },
        { label: "friend", replacement: "I need to pay my friend.", pt: "Eu preciso pagar meu amigo." },
        { label: "coworker", replacement: "I need to pay my coworker.", pt: "Eu preciso pagar meu colega de trabalho." },
        { label: "brother (past)", replacement: "I needed to pay my brother.", pt: "Eu precisei pagar meu irmão." },
        { label: "friend (past)", replacement: "I needed to pay my friend.", pt: "Eu precisei pagar meu amigo." },
        { label: "coworker (past)", replacement: "I needed to pay my coworker.", pt: "Eu precisei pagar meu colega de trabalho." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION (Image 2) ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "The customer wants to buy a new wallet. / backpack / t-shirt",
      options: [
        { label: "wallet", replacement: "The customer wants to buy a new wallet.", pt: "O cliente quer comprar uma carteira nova." },
        { label: "backpack", replacement: "The customer wants to buy a new backpack.", pt: "O cliente quer comprar uma mochila nova." },
        { label: "t-shirt", replacement: "The customer wants to buy a new t-shirt.", pt: "O cliente quer comprar uma camiseta nova." },
        { label: "wallet (past)", replacement: "The customer wanted to buy a new wallet.", pt: "O cliente queria comprar uma carteira nova." },
        { label: "backpack (past)", replacement: "The customer wanted to buy a new backpack.", pt: "O cliente queria comprar uma mochila nova." },
        { label: "t-shirt (past)", replacement: "The customer wanted to buy a new t-shirt.", pt: "O cliente queria comprar uma camiseta nova." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "The attendant doesn't have any change. / salesperson / manager",
      options: [
        { label: "attendant", replacement: "The attendant doesn't have any change.", pt: "O atendente não tem nenhum troco." },
        { label: "salesperson", replacement: "The salesperson doesn't have any change.", pt: "O vendedor não tem nenhum troco." },
        { label: "manager", replacement: "The manager doesn't have any change.", pt: "O gerente não tem nenhum troco." },
        { label: "attendant (past)", replacement: "The attendant didn't have any change.", pt: "O atendente não tinha nenhum troco." },
        { label: "salesperson (past)", replacement: "The salesperson didn't have any change.", pt: "O vendedor não tinha nenhum troco." },
        { label: "manager (past)", replacement: "The manager didn't have any change.", pt: "O gerente não tinha nenhum troco." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "I have some cash in my bag. / wallet / purse",
      options: [
        { label: "bag", replacement: "I have some cash in my bag.", pt: "Eu tenho algum dinheiro na minha bolsa." },
        { label: "wallet", replacement: "I have some cash in my wallet.", pt: "Eu tenho algum dinheiro na minha carteira." },
        { label: "purse", replacement: "I have some cash in my purse.", pt: "Eu tenho algum dinheiro na minha bolsa." },
        { label: "bag (past)", replacement: "I had some cash in my bag.", pt: "Eu tinha algum dinheiro na minha bolsa." },
        { label: "wallet (past)", replacement: "I had some cash in my wallet.", pt: "Eu tinha algum dinheiro na minha carteira." },
        { label: "purse (past)", replacement: "I had some cash in my purse.", pt: "Eu tinha algum dinheiro na minha bolsa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "How many items do you want to buy? / products / shirts",
      options: [
        { label: "items", replacement: "How many items do you want to buy?", pt: "Quantos itens você quer comprar?" },
        { label: "products", replacement: "How many products do you want to buy?", pt: "Quantos produtos você quer comprar?" },
        { label: "shirts", replacement: "How many shirts do you want to buy?", pt: "Quantas camisas você quer comprar?" },
        { label: "items (past)", replacement: "How many items did you want to buy?", pt: "Quantos itens você queria comprar?" },
        { label: "products (past)", replacement: "How many products did you want to buy?", pt: "Quantos produtos você queria comprar?" },
        { label: "shirts (past)", replacement: "How many shirts did you want to buy?", pt: "Quantas camisas você queria comprar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "The receipt is in your bag. / purse / here",
      options: [
        { label: "bag", replacement: "The receipt is in your bag.", pt: "O recibo está na sua sacola." },
        { label: "purse", replacement: "The receipt is in your purse.", pt: "O recibo está na sua bolsa." },
        { label: "here", replacement: "The receipt is here.", pt: "O recibo está aqui." },
        { label: "bag (past)", replacement: "The receipt was in your bag.", pt: "O recibo estava na sua sacola." },
        { label: "purse (past)", replacement: "The receipt was in your purse.", pt: "O recibo estava na sua bolsa." },
        { label: "here (past)", replacement: "The receipt was here.", pt: "O recibo estava aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "I want to pay cash. / He wants / She wants",
      options: [
        { label: "I want", replacement: "I want to pay cash.", pt: "Eu quero pagar em dinheiro." },
        { label: "He wants", replacement: "He wants to pay cash.", pt: "Ele quer pagar em dinheiro." },
        { label: "She wants", replacement: "She wants to pay cash.", pt: "Ela quer pagar em dinheiro." },
        { label: "I wanted (past)", replacement: "I wanted to pay cash.", pt: "Eu queria pagar em dinheiro." },
        { label: "He wanted (past)", replacement: "He wanted to pay cash.", pt: "Ele queria pagar em dinheiro." },
        { label: "She wanted (past)", replacement: "She wanted to pay cash.", pt: "Ela queria pagar em dinheiro." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "I pay by credit card. / She pays / He pays",
      options: [
        { label: "I pay", replacement: "I pay by credit card.", pt: "Eu pago com o cartão de crédito." },
        { label: "She pays", replacement: "She pays by credit card.", pt: "Ela paga com o cartão de crédito." },
        { label: "He pays", replacement: "He pays by credit card.", pt: "Ele paga com o cartão de crédito." },
        { label: "I paid (past)", replacement: "I paid by credit card.", pt: "Eu paguei com o cartão de crédito." },
        { label: "She paid (past)", replacement: "She paid by credit card.", pt: "Ela pagou com o cartão de crédito." },
        { label: "He paid (past)", replacement: "He paid by credit card.", pt: "Ele pagou com o cartão de crédito." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I need to go to the ATM. / department store / mall",
      options: [
        { label: "ATM", replacement: "I need to go to the ATM.", pt: "Eu preciso ir ao caixa eletrônico." },
        { label: "department store", replacement: "I need to go to the department store.", pt: "Eu preciso ir à loja de departamento." },
        { label: "mall", replacement: "I need to go to the mall.", pt: "Eu preciso ir ao shopping." },
        { label: "ATM (past)", replacement: "I needed to go to the ATM.", pt: "Eu precisava ir ao caixa eletrônico." },
        { label: "department store (past)", replacement: "I needed to go to the department store.", pt: "Eu precisava ir à loja de departamento." },
        { label: "mall (past)", replacement: "I needed to go to the mall.", pt: "Eu precisava ir ao shopping." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Where is the fitting room? / department store / outlet",
      options: [
        { label: "fitting room", replacement: "Where is the fitting room?", pt: "Onde é o provador?" },
        { label: "department store", replacement: "Where is the department store?", pt: "Onde é a loja de departamento?" },
        { label: "outlet", replacement: "Where is the outlet?", pt: "Onde é o outlet?" },
        { label: "fitting room (past)", replacement: "Where was the fitting room?", pt: "Onde era o provador?" },
        { label: "department store (past)", replacement: "Where was the department store?", pt: "Onde era a loja de departamento?" },
        { label: "outlet (past)", replacement: "Where was the outlet?", pt: "Onde era o outlet?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Let's have a garage sale! / barbecue / snack",
      options: [
        { label: "garage sale", replacement: "Let's have a garage sale!", pt: "Vamos fazer uma venda de garagem." },
        { label: "barbecue", replacement: "Let's have a barbecue!", pt: "Vamos fazer um churrasco." },
        { label: "snack", replacement: "Let's have a snack!", pt: "Vamos fazer um lanche." },
        { label: "garage sale (past)", replacement: "We had a garage sale!", pt: "Nós fizemos uma venda de garagem." },
        { label: "barbecue (past)", replacement: "We had a barbecue!", pt: "Nós fizemos um churrasco." },
        { label: "snack (past)", replacement: "We had a snack!", pt: "Nós fizemos um lanche." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION (Images 3 & 5) ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Let's go shopping tomorrow! / this afternoon / this weekend",
      options: [
        { label: "tomorrow", replacement: "Let's go shopping tomorrow!", pt: "Vamos fazer compras amanhã!" },
        { label: "this afternoon", replacement: "Let's go shopping this afternoon!", pt: "Vamos fazer compras esta tarde!" },
        { label: "this weekend", replacement: "Let's go shopping this weekend!", pt: "Vamos fazer compras este fim de semana!" },
        { label: "yesterday (past)", replacement: "We went shopping yesterday!", pt: "Fomos fazer compras ontem!" },
        { label: "this afternoon (past)", replacement: "We went shopping this afternoon!", pt: "Fomos fazer compras esta tarde!" },
        { label: "last weekend (past)", replacement: "We went shopping last weekend!", pt: "Fomos fazer compras no fim de semana passado!" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "He is looking for a gift. / for his wife / girlfriend",
      options: [
        { label: "a gift", replacement: "He is looking for a gift.", pt: "Ele está procurando por um presente." },
        { label: "for his wife", replacement: "He is looking for a gift for his wife.", pt: "Ele está procurando por um presente para a esposa dele." },
        { label: "girlfriend", replacement: "He is looking for a gift for his girlfriend.", pt: "Ele está procurando por um presente para a namorada." },
        { label: "a gift (past)", replacement: "He was looking for a gift.", pt: "Ele estava procurando por um presente." },
        { label: "wife (past)", replacement: "He was looking for a gift for his wife.", pt: "Ele estava procurando por um presente para a esposa dele." },
        { label: "girlfriend (past)", replacement: "He was looking for a gift for his girlfriend.", pt: "Ele estava procurando por um presente para a namorada." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "I am looking for my wallet. / purse / sunglasses",
      options: [
        { label: "wallet", replacement: "I am looking for my wallet.", pt: "Eu estou procurando minha carteira." },
        { label: "purse", replacement: "I am looking for my purse.", pt: "Eu estou procurando minha bolsa." },
        { label: "sunglasses", replacement: "I am looking for my sunglasses.", pt: "Eu estou procurando meus óculos de sol." },
        { label: "wallet (past)", replacement: "I was looking for my wallet.", pt: "Eu estava procurando minha carteira." },
        { label: "purse (past)", replacement: "I was looking for my purse.", pt: "Eu estava procurando minha bolsa." },
        { label: "sunglasses (past)", replacement: "I was looking for my sunglasses.", pt: "Eu estava procurando meus óculos de sol." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "I always get a discount there. / sometimes / never",
      options: [
        { label: "always", replacement: "I always get a discount there.", pt: "Eu sempre consigo um desconto lá." },
        { label: "sometimes", replacement: "I sometimes get a discount there.", pt: "Eu às vezes consigo um desconto lá." },
        { label: "never", replacement: "I never get a discount there.", pt: "Eu nunca consigo um desconto lá." },
        { label: "always (past)", replacement: "I always got a discount there.", pt: "Eu sempre conseguia um desconto lá." },
        { label: "sometimes (past)", replacement: "I sometimes got a discount there.", pt: "Eu às vezes conseguia um desconto lá." },
        { label: "never (past)", replacement: "I never got a discount there.", pt: "Eu nunca conseguia um desconto lá." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Those products are on sale. / items / clothes",
      options: [
        { label: "products", replacement: "Those products are on sale.", pt: "Aqueles produtos estão em liquidação." },
        { label: "items", replacement: "Those items are on sale.", pt: "Aqueles itens estão em liquidação." },
        { label: "clothes", replacement: "Those clothes are on sale.", pt: "Aquelas roupas estão em liquidação." },
        { label: "products (past)", replacement: "Those products were on sale.", pt: "Aqueles produtos estavam em liquidação." },
        { label: "items (past)", replacement: "Those items were on sale.", pt: "Aqueles itens estavam em liquidação." },
        { label: "clothes (past)", replacement: "Those clothes were on sale.", pt: "Aquelas roupas estavam em liquidação." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "They aren't talking to the customer. / attendant / manager",
      options: [
        { label: "customer", replacement: "They aren't talking to the customer.", pt: "Eles não estão falando com o cliente." },
        { label: "attendant", replacement: "They aren't talking to the attendant.", pt: "Eles não estão falando com o atendente." },
        { label: "manager", replacement: "They aren't talking to the manager.", pt: "Eles não estão falando com o gerente." },
        { label: "customer (past)", replacement: "They weren't talking to the customer.", pt: "Eles não estavam falando com o cliente." },
        { label: "attendant (past)", replacement: "They weren't talking to the attendant.", pt: "Eles não estavam falando com o atendente." },
        { label: "manager (past)", replacement: "They weren't talking to the manager.", pt: "Eles não estavam falando com o gerente." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "He isn't wearing a suit. / a pair of jeans / a pair of shoes",
      options: [
        { label: "a suit", replacement: "He isn't wearing a suit.", pt: "Ele não está usando um terno." },
        { label: "jeans", replacement: "He isn't wearing a pair of jeans.", pt: "Ele não está usando um par de calças jeans." },
        { label: "shoes", replacement: "He isn't wearing a pair of shoes.", pt: "Ele não está usando um par de sapatos." },
        { label: "a suit (past)", replacement: "He wasn't wearing a suit.", pt: "Ele não estava usando um terno." },
        { label: "jeans (past)", replacement: "He wasn't wearing a pair of jeans.", pt: "Ele não estava usando um par de calças jeans." },
        { label: "shoes (past)", replacement: "He wasn't wearing a pair of shoes.", pt: "Ele não estava usando um par de sapatos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "She isn't wearing her glasses. / favorite shoes / favorite dress",
      options: [
        { label: "glasses", replacement: "She isn't wearing her glasses.", pt: "Ela não está usando os óculos dela." },
        { label: "favorite shoes", replacement: "She isn't wearing her favorite shoes.", pt: "Ela não está usando os sapatos favoritos." },
        { label: "favorite dress", replacement: "She isn't wearing her favorite dress.", pt: "Ela não está usando o vestido favorito." },
        { label: "glasses (past)", replacement: "She wasn't wearing her glasses.", pt: "Ela não estava usando os óculos dela." },
        { label: "favorite shoes (past)", replacement: "She wasn't wearing her favorite shoes.", pt: "Ela não estava usando os sapatos favoritos." },
        { label: "favorite dress (past)", replacement: "She wasn't wearing her favorite dress.", pt: "Ela não estava usando o vestido favorito." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "They aren't looking for the ATM. / for this product / for this item",
      options: [
        { label: "the ATM", replacement: "They aren't looking for the ATM.", pt: "Eles não estão procurando pelo caixa eletrônico." },
        { label: "this product", replacement: "They aren't looking for this product.", pt: "Eles não estão procurando por este produto." },
        { label: "this item", replacement: "They aren't looking for this item.", pt: "Eles não estão procurando por este item." },
        { label: "the ATM (past)", replacement: "They weren't looking for the ATM.", pt: "Eles não estavam procurando pelo caixa eletrônico." },
        { label: "this product (past)", replacement: "They weren't looking for this product.", pt: "Eles não estavam procurando por este produto." },
        { label: "this item (past)", replacement: "They weren't looking for this item.", pt: "Eles não estavam procurando por este item." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-10",
      original: "I'm not changing clothes. / She isn't / He isn't",
      options: [
        { label: "I'm not", replacement: "I'm not changing clothes.", pt: "Eu não estou trocando de roupa." },
        { label: "She isn't", replacement: "She isn't changing clothes.", pt: "Ela não está trocando de roupa." },
        { label: "He isn't", replacement: "He isn't changing clothes.", pt: "Ele não está trocando de roupa." },
        { label: "I wasn't (past)", replacement: "I wasn't changing clothes.", pt: "Eu não estava trocando de roupa." },
        { label: "She wasn't (past)", replacement: "She wasn't changing clothes.", pt: "Ela não estava trocando de roupa." },
        { label: "He wasn't (past)", replacement: "He wasn't changing clothes.", pt: "Ele não estava trocando de roupa." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION (Image 4) ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "I'm not working now. / cleaning the house / watching TV",
      options: [
        { label: "working", replacement: "I'm not working now.", pt: "Eu não estou trabalhando agora." },
        { label: "cleaning", replacement: "I'm not cleaning the house now.", pt: "Eu não estou limpando a casa agora." },
        { label: "watching", replacement: "I'm not watching TV now.", pt: "Eu não estou assistindo TV agora." },
        { label: "working (past)", replacement: "I wasn't working then.", pt: "Eu não estava trabalhando então." },
        { label: "cleaning (past)", replacement: "I wasn't cleaning the house then.", pt: "Eu não estava limpando a casa então." },
        { label: "watching (past)", replacement: "I wasn't watching TV then.", pt: "Eu não estava assistindo TV então." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "She isn't calling the saleswoman. / manager / attendant",
      options: [
        { label: "saleswoman", replacement: "She isn't calling the saleswoman.", pt: "Ela não está chamando a vendedora." },
        { label: "manager", replacement: "She isn't calling the manager.", pt: "Ela não está chamando o gerente." },
        { label: "attendant", replacement: "She isn't calling the attendant.", pt: "Ela não está chamando o atendente." },
        { label: "saleswoman (past)", replacement: "She wasn't calling the saleswoman.", pt: "Ela não estava chamando a vendedora." },
        { label: "manager (past)", replacement: "She wasn't calling the manager.", pt: "Ela não estava chamando o gerente." },
        { label: "attendant (past)", replacement: "She wasn't calling the attendant.", pt: "Ela não estava chamando o atendente." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "He isn't looking for his receipt. / wallet / sneakers",
      options: [
        { label: "receipt", replacement: "He isn't looking for his receipt.", pt: "Ele não está procurando pelo recibo dele." },
        { label: "wallet", replacement: "He isn't looking for his wallet.", pt: "Ele não está procurando pela carteira dele." },
        { label: "sneakers", replacement: "He isn't looking for his sneakers.", pt: "Ele não está procurando pelos tênis dele." },
        { label: "receipt (past)", replacement: "He wasn't looking for his receipt.", pt: "Ele não estava procurando pelo recibo dele." },
        { label: "wallet (past)", replacement: "He wasn't looking for his wallet.", pt: "Ele não estava procurando pela carteira dele." },
        { label: "sneakers (past)", replacement: "He wasn't looking for his sneakers.", pt: "Ele não estava procurando pelos tênis dele." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "I'm not trying on the shirt. / shoes / pants",
      options: [
        { label: "shirt", replacement: "I'm not trying on the shirt.", pt: "Eu não estou provando a camisa." },
        { label: "shoes", replacement: "I'm not trying on the shoes.", pt: "Eu não estou provando os sapatos." },
        { label: "pants", replacement: "I'm not trying on the pants.", pt: "Eu não estou provando as calças." },
        { label: "shirt (past)", replacement: "I wasn't trying on the shirt.", pt: "Eu não estava provando a camisa." },
        { label: "shoes (past)", replacement: "I wasn't trying on the shoes.", pt: "Eu não estava provando os sapatos." },
        { label: "pants (past)", replacement: "I wasn't trying on the pants.", pt: "Eu não estava provando as calças." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "We aren't having lunch now. / dinner / a snack",
      options: [
        { label: "lunch", replacement: "We aren't having lunch now.", pt: "Nós não estamos almoçando agora." },
        { label: "dinner", replacement: "We aren't having dinner now.", pt: "Nós não estamos jantando agora." },
        { label: "a snack", replacement: "We aren't having a snack now.", pt: "Nós não estamos fazendo um lanche agora." },
        { label: "lunch (past)", replacement: "We weren't having lunch then.", pt: "Nós não estávamos almoçando então." },
        { label: "dinner (past)", replacement: "We weren't having dinner then.", pt: "Nós não estávamos jantando então." },
        { label: "a snack (past)", replacement: "We weren't having a snack then.", pt: "Nós não estávamos fazendo um lanche então." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== REAL LIFE PRACTICE ==========
  const realLifeSentences = [
    {
      english: "Do you need a receipt?",
      portuguese: "Você precisa de recibo?",
      jsx: <>Do you <span className="text-blue-600 font-bold">need</span> a <span className="text-blue-600 font-bold">receipt</span>?</>,
    },
    {
      english: "I'm still looking for a blue dress.",
      portuguese: "Ainda estou procurando um vestido azul.",
      jsx: <>I'm still <span className="text-blue-600 font-bold">looking for</span> a <span className="text-blue-600 font-bold">blue dress</span>.</>,
    },
    {
      english: "My neighbors are having a garage sale today.",
      portuguese: "Meus vizinhos estão fazendo uma venda de garagem hoje.",
      jsx: <>My neighbors are <span className="text-blue-600 font-bold">having</span> a <span className="text-blue-600 font-bold">garage sale</span> today.</>,
    },
    {
      english: "I get a discount when I buy three items.",
      portuguese: "Eu ganho desconto quando compro três itens.",
      jsx: <>I <span className="text-blue-600 font-bold">get a discount</span> when I buy <span className="text-blue-600 font-bold">three items</span>.</>,
    },
    {
      english: "My mother works at a department store.",
      portuguese: "Minha mãe trabalha em uma loja de departamento.",
      jsx: <>My mother <span className="text-blue-600 font-bold">works at</span> a <span className="text-blue-600 font-bold">department store</span>.</>,
    },
    {
      english: "He's not trying on the black suit.",
      portuguese: "Ele não está provando o terno preto.",
      jsx: <>He's <span className="text-blue-600 font-bold">not trying on</span> the <span className="text-blue-600 font-bold">black suit</span>.</>,
    },
    {
      english: "Here's your change.",
      portuguese: "Aqui está seu troco.",
      jsx: <>Here's your <span className="text-blue-600 font-bold">change</span>.</>,
    },
    {
      english: "Do you have change for a 20?",
      portuguese: "Você tem troco para 20?",
      jsx: <>Do you have <span className="text-blue-600 font-bold">change</span> for a <span className="text-blue-600 font-bold">20</span>?</>,
    },
    {
      english: "The attendant is helping me.",
      portuguese: "O atendente está me ajudando.",
      jsx: <>The <span className="text-blue-600 font-bold">attendant</span> is <span className="text-blue-600 font-bold">helping</span> me.</>,
    },
    {
      english: "We're not having lunch now.",
      portuguese: "Nós não estamos almoçando agora.",
      jsx: <>We're <span className="text-blue-600 font-bold">not having</span> lunch now.</>,
    },
  ];

  // ========== CHECKOUT – wanna / gotta / could SUBSTITUTION ==========
  const checkoutSubstitution: SubstitutionExercise[] = [
    {
      key: "checkout-1",
      original: "I wanna buy this jacket. / this shirt / these shoes",
      options: [
        { label: "this jacket", replacement: "I wanna buy this jacket.", pt: "Eu quero comprar esta jaqueta." },
        { label: "this shirt", replacement: "I wanna buy this shirt.", pt: "Eu quero comprar esta camisa." },
        { label: "these shoes", replacement: "I wanna buy these shoes.", pt: "Eu quero comprar estes sapatos." },
      ],
      currentIndex: 0,
    },
    {
      key: "checkout-2",
      original: "I gotta go to the ATM now. / the mall / the store",
      options: [
        { label: "the ATM", replacement: "I gotta go to the ATM now.", pt: "Eu tenho que ir ao caixa eletrônico agora." },
        { label: "the mall", replacement: "I gotta go to the mall now.", pt: "Eu tenho que ir ao shopping agora." },
        { label: "the store", replacement: "I gotta go to the store now.", pt: "Eu tenho que ir à loja agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "checkout-3",
      original: "Could you give me a discount? / help me / show me the fitting room",
      options: [
        { label: "give me a discount", replacement: "Could you give me a discount?", pt: "Você poderia me dar um desconto?" },
        { label: "help me", replacement: "Could you help me?", pt: "Você poderia me ajudar?" },
        { label: "show me the fitting room", replacement: "Could you show me the fitting room?", pt: "Você poderia me mostrar o provador?" },
      ],
      currentIndex: 0,
    },
    {
      key: "checkout-4",
      original: "Do you wanna go shopping? / get a receipt / try this product",
      options: [
        { label: "go shopping", replacement: "Do you wanna go shopping?", pt: "Você quer ir às compras?" },
        { label: "get a receipt", replacement: "Do you wanna get a receipt?", pt: "Você quer pegar um recibo?" },
        { label: "try this product", replacement: "Do you wanna try this product?", pt: "Você quer experimentar este produto?" },
      ],
      currentIndex: 0,
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
            🛍️ Lesson 51 - Going Shopping
          </h1>
          <SpeakSentence text="Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect and Past Perfect." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect and Past Perfect.
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

            <div className="bg-blue-100 rounded-2xl p-5 mb-6">
              <p className="font-semibold">📌 Exemplos:</p>
              <p className="text-gray-700">I have money in my wallet. / Do you have cash? / I need a receipt.</p>
              <p className="text-gray-700">Where is the fitting room? / This store gives discounts.</p>
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
              <h2 className="text-2xl font-bold">🔹 SPEAK LIKE A NATIVE</h2>
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
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
                  { en: "Do you want to go shopping with me?", pt: "Você quer ir às compras comigo?" },
                  { en: "I'm looking for a brown jacket.", pt: "Estou procurando uma jaqueta marrom." },
                  { en: "I always get a discount at that store.", pt: "Eu sempre ganho desconto naquela loja." },
                  { en: "Are the shoes on sale, too?", pt: "Os sapatos também estão em promoção?" },
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
            <div className="bg-blue-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                📚 PRESENT CONTINUOUS (NEGATIVE) · PRESENT PERFECT · PAST PERFECT
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                  <h4 className="text-lg font-bold text-blue-700 mb-2">📘 Present Continuous (Negative)</h4>
                  <p className="text-gray-700 text-sm">Subject + am/is/are + not + verb-ing</p>
                  <p className="text-xs text-gray-500 mt-2">Ações que NÃO estão acontecendo agora.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                  <h4 className="text-lg font-bold text-green-700 mb-2">✨ Present Perfect</h4>
                  <p className="text-gray-700 text-sm">have/has + past participle</p>
                  <p className="text-xs text-gray-500 mt-2">Experiências / ações recentes.</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-l-4 border-purple-500">
                  <h4 className="text-lg font-bold text-purple-700 mb-2">⏳ Past Perfect</h4>
                  <p className="text-gray-700 text-sm">had + past participle</p>
                  <p className="text-xs text-gray-500 mt-2">Ação anterior a outra no passado.</p>
                </div>
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

        {/* ===================== SECTION 5 – REAL LIFE ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS (REAL LIFE)</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice real-life shopping situations
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
                      <img src={talkImage} alt="People shopping" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Shopping with friends</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={watchImage} alt="Clothing store" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Trying clothes on</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={opinionImage} alt="Paying at the store" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Talking to the attendant</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – CHECKOUT (Slang) ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 CHECKOUT · Slang & Reduções</h2>
              <PencilIcon onClick={() => openNoteModal('Checkout Slang')} />
            </div>
            <button
              onClick={() => toggleDrill('checkout')}
              className="inline-block rounded-full bg-white text-indigo-700 px-8 py-3 text-sm font-bold transition-all duration-300 hover:bg-indigo-100"
            >
              {openDrills.checkout ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <p className="text-md text-gray-600 mb-4 italic">🗣️ wanna · gotta · could — fale como um nativo!</p>

            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-md border border-indigo-200">
                <p className="text-2xl font-bold text-indigo-600">wanna</p>
                <p className="text-gray-500">= want to (querer)</p>
                <p className="mt-2 text-gray-700">✨ I <strong>wanna</strong> buy this jacket.</p>
                <p className="text-gray-700">✨ Do you <strong>wanna</strong> go shopping?</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border border-indigo-200">
                <p className="text-2xl font-bold text-indigo-600">gotta</p>
                <p className="text-gray-500">= got to / have to (ter que)</p>
                <p className="mt-2 text-gray-700">✨ I <strong>gotta</strong> go to the ATM now.</p>
                <p className="text-gray-700">✨ She&apos;s <strong>gotta</strong> find the fitting room.</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-md border border-indigo-200">
                <p className="text-2xl font-bold text-indigo-600">could</p>
                <p className="text-gray-500">= poderia (educado / possibilidade)</p>
                <p className="mt-2 text-gray-700">✨ <strong>Could</strong> you give me a discount?</p>
                <p className="text-gray-700">✨ We <strong>could</strong> pay with credit card.</p>
              </div>
            </div>

            {openDrills.checkout && (
              <div className="mt-4 bg-indigo-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {checkoutSubstitution.map((ex) => (
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

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
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
              <h3 className="font-bold text-lg mb-4 text-yellow-300">CHANGE & RECEIPT</h3>
              {[
                { en: "I have US$20 in change.", pt: "Eu tenho US$20 em troco." },
                { en: "Here's your change.", pt: "Aqui está seu troco." },
                { en: "Do you have change for a 20?", pt: "Você tem troco para 20?" },
                { en: "Do you need a receipt?", pt: "Você precisa de recibo?" },
                { en: "I get a discount when I buy three items.", pt: "Ganho desconto ao comprar três itens." },
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
                { en: "We have never tried this store.", pt: "Nós nunca experimentamos esta loja." },
                { en: "I had already changed my clothes.", pt: "Eu já tinha trocado de roupa." },
                { en: "She had bought the shoes before the sale.", pt: "Ela tinha comprado os sapatos antes da promoção." },
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
            onClick={() => router.push("/cursos/lesson50")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (50)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson52")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (52) &rarr;
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