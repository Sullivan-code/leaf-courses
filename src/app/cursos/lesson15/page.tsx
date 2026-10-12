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

// Component for individual word pronunciation
const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// Component for pronouncing entire sentences
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
              if (typeof window !== 'undefined') {
                window.speechSynthesis.cancel();
                const utterance = new SpeechSynthesisUtterance(getOptionReplacement(option));
                utterance.lang = 'en-US';
                utterance.rate = 0.9;
                utterance.pitch = 1.0;
                const voices = window.speechSynthesis.getVoices();
                const americanFemaleVoices = voices.filter(voice =>
                  (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
                  (voice.name.toLowerCase().includes('samantha') ||
                   voice.name.toLowerCase().includes('google us english') ||
                   voice.name === 'Google US English')
                );
                const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
                if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
                else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
                window.speechSynthesis.speak(utterance);
              }
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

// Pencil Icon Component
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

export default function Lesson15PersonalInfoRoutine() {
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

  // Initialize voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Images
  const mainImage = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // Lesson 15 data
  const verbs = [
    { english: "to read", portuguese: "ler" },
    { english: "to send", portuguese: "enviar" }
  ];

  const newWords = [
    { english: "coffee shop", portuguese: "cafeteria" },
    { english: "restaurant", portuguese: "restaurante" },
    { english: "mall", portuguese: "shopping" },
    { english: "the movies", portuguese: "cinema" },
    { english: "magazine", portuguese: "revista" },
    { english: "book", portuguese: "livro" },
    { english: "story", portuguese: "história" },
    { english: "e-mail", portuguese: "e-mail" },
    { english: "address", portuguese: "endereço" },
    { english: "password", portuguese: "senha" },
    { english: "message", portuguese: "mensagem" },
    { english: "online", portuguese: "online" },
    { english: "big", portuguese: "grande" },
    { english: "small", portuguese: "pequeno(a)" },
    { english: "the", portuguese: "o, a, os, as" }
  ];

  const usefulPhrases = [
    { english: "I read the news every day.", portuguese: "Eu leio as notícias todos os dias." },
    { english: "I read stories every day.", portuguese: "Eu leio histórias todos os dias." },
    { english: "I read my e-mails on my cell phone.", portuguese: "Eu leio meus e-mails no meu telefone celular." }
  ];

  const grammarExamples = [
    { english: "Do you want to go to the restaurant?", portuguese: "Você quer ir ao restaurante?" },
    { english: "Do you want to go to the movies with me?", portuguese: "Você quer ir ao cinema comigo?" },
    { english: "They like to go to the coffee shop in the evening.", portuguese: "Eles gostam de ir à cafeteria à noite." },
    { english: "We don't want to go to the mall today.", portuguese: "Nós não queremos ir ao shopping hoje." },
    { english: "I send e-mails to my boss every day.", portuguese: "Eu envio e-mails para meu chefe todos os dias." },
    { english: "I need to send this message to my friend.", portuguese: "Eu preciso enviar essa mensagem para meu amigo." }
  ];

  // ========== MAKE IT YOURS – with blue highlighted words ==========
  const realLifeSentences = [
    {
      english: "I read the news in the morning.",
      portuguese: "Eu leio as notícias de manhã.",
      parts: [
        { text: "I ", h: false },
        { text: "read", h: true },
        { text: " the ", h: false },
        { text: "news", h: true },
        { text: " in the ", h: false },
        { text: "morning", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "We read the news in the morning.",
      portuguese: "Nós lemos as notícias de manhã.",
      parts: [
        { text: "We ", h: false },
        { text: "read", h: true },
        { text: " the ", h: false },
        { text: "news", h: true },
        { text: " in the ", h: false },
        { text: "morning", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "They read the news in the morning.",
      portuguese: "Eles leem as notícias de manhã.",
      parts: [
        { text: "They ", h: false },
        { text: "read", h: true },
        { text: " the ", h: false },
        { text: "news", h: true },
        { text: " in the ", h: false },
        { text: "morning", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "Do you like to read magazines?",
      portuguese: "Você gosta de ler revistas?",
      parts: [
        { text: "Do you ", h: false },
        { text: "like", h: true },
        { text: " to ", h: false },
        { text: "read", h: true },
        { text: " ", h: false },
        { text: "magazines", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "Do you like to read books?",
      portuguese: "Você gosta de ler livros?",
      parts: [
        { text: "Do you ", h: false },
        { text: "like", h: true },
        { text: " to ", h: false },
        { text: "read", h: true },
        { text: " ", h: false },
        { text: "books", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "Do you like to read stories?",
      portuguese: "Você gosta de ler histórias?",
      parts: [
        { text: "Do you ", h: false },
        { text: "like", h: true },
        { text: " to ", h: false },
        { text: "read", h: true },
        { text: " ", h: false },
        { text: "stories", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "Do you read magazines online?",
      portuguese: "Você lê revistas online?",
      parts: [
        { text: "Do you ", h: false },
        { text: "read", h: true },
        { text: " ", h: false },
        { text: "magazines", h: true },
        { text: " ", h: false },
        { text: "online", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "Where do you read your e-mails?",
      portuguese: "Onde você lê seus e-mails?",
      parts: [
        { text: "Where do you ", h: false },
        { text: "read", h: true },
        { text: " your ", h: false },
        { text: "e-mails", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "I read my e-mails at work.",
      portuguese: "Eu leio meus e-mails no trabalho.",
      parts: [
        { text: "I ", h: false },
        { text: "read", h: true },
        { text: " my ", h: false },
        { text: "e-mails", h: true },
        { text: " at ", h: false },
        { text: "work", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "I read my e-mails at home.",
      portuguese: "Eu leio meus e-mails em casa.",
      parts: [
        { text: "I ", h: false },
        { text: "read", h: true },
        { text: " my ", h: false },
        { text: "e-mails", h: true },
        { text: " at ", h: false },
        { text: "home", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "Do you read your messages on your cell phone?",
      portuguese: "Você lê suas mensagens no seu telefone celular?",
      parts: [
        { text: "Do you ", h: false },
        { text: "read", h: true },
        { text: " your ", h: false },
        { text: "messages", h: true },
        { text: " on your ", h: false },
        { text: "cell phone", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "We have a small car.",
      portuguese: "Nós temos um carro pequeno.",
      parts: [
        { text: "We ", h: false },
        { text: "have", h: true },
        { text: " a ", h: false },
        { text: "small car", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "Do you have a new e-mail address?",
      portuguese: "Você tem um novo endereço de e-mail?",
      parts: [
        { text: "Do you ", h: false },
        { text: "have", h: true },
        { text: " a ", h: false },
        { text: "new e-mail address", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "We like to go to the movies.",
      portuguese: "Nós gostamos de ir ao cinema.",
      parts: [
        { text: "We ", h: false },
        { text: "like", h: true },
        { text: " to go to the ", h: false },
        { text: "movies", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "Do they prefer to go to the mall in the afternoon?",
      portuguese: "Eles preferem ir ao shopping à tarde?",
      parts: [
        { text: "Do they ", h: false },
        { text: "prefer", h: true },
        { text: " to go to the ", h: false },
        { text: "mall", h: true },
        { text: " in the ", h: false },
        { text: "afternoon", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "Do we have to send this message today?",
      portuguese: "Nós temos que enviar essa mensagem hoje?",
      parts: [
        { text: "Do we ", h: false },
        { text: "have to send", h: true },
        { text: " this ", h: false },
        { text: "message", h: true },
        { text: " ", h: false },
        { text: "today", h: true },
        { text: "?", h: false },
      ]
    },
    {
      english: "You have to send this book to this address.",
      portuguese: "Você tem que enviar este livro para este endereço.",
      parts: [
        { text: "You ", h: false },
        { text: "have to send", h: true },
        { text: " this ", h: false },
        { text: "book", h: true },
        { text: " to this ", h: false },
        { text: "address", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "He reads the newspaper every morning.",
      portuguese: "Ele lê o jornal toda manhã.",
      parts: [
        { text: "He ", h: false },
        { text: "reads", h: true },
        { text: " the ", h: false },
        { text: "newspaper", h: true },
        { text: " every ", h: false },
        { text: "morning", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "She reads stories to her children.",
      portuguese: "Ela lê histórias para seus filhos.",
      parts: [
        { text: "She ", h: false },
        { text: "reads", h: true },
        { text: " ", h: false },
        { text: "stories", h: true },
        { text: " to her ", h: false },
        { text: "children", h: true },
        { text: ".", h: false },
      ]
    },
    {
      english: "It reads the data from the computer.",
      portuguese: "Ele lê os dados do computador.",
      parts: [
        { text: "It ", h: false },
        { text: "reads", h: true },
        { text: " the ", h: false },
        { text: "data", h: true },
        { text: " from the ", h: false },
        { text: "computer", h: true },
        { text: ".", h: false },
      ]
    },
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "I go. / Eu vou. / Você vai. / Eles vão.",
      options: [
        { label: "I go", replacement: "I go.", pt: "Eu vou." },
        { label: "You go", replacement: "You go.", pt: "Você vai." },
        { label: "They go", replacement: "They go.", pt: "Eles vão." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não leio à noite. / Elas / Nós.",
      options: [
        { label: "Eu não", replacement: "I don't read at night.", pt: "Eu não leio à noite." },
        { label: "Elas não", replacement: "They don't read at night.", pt: "Elas não leem à noite." },
        { label: "Nós não", replacement: "We don't read at night.", pt: "Nós não lemos à noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você lê à noite? / à tarde / de manhã.",
      options: [
        { label: "à noite", replacement: "Do you read at night?", pt: "Você lê à noite?" },
        { label: "à tarde", replacement: "Do you read in the afternoon?", pt: "Você lê à tarde?" },
        { label: "de manhã", replacement: "Do you read in the morning?", pt: "Você lê de manhã?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "I read to my children. / meu professor / meus amigos.",
      options: [
        { label: "my children", replacement: "I read to my children.", pt: "Eu leio para meus filhos." },
        { label: "my teacher", replacement: "I read to my teacher.", pt: "Eu leio para meu professor." },
        { label: "my friends", replacement: "I read to my friends.", pt: "Eu leio para meus amigos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Nós temos que ler em inglês. / espanhol / português.",
      options: [
        { label: "inglês", replacement: "We have to read in English.", pt: "Nós temos que ler em inglês." },
        { label: "espanhol", replacement: "We have to read in Spanish.", pt: "Nós temos que ler em espanhol." },
        { label: "português", replacement: "We have to read in Portuguese.", pt: "Nós temos que ler em português." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu gosto muito de ler. / Nós / Você.",
      options: [
        { label: "Eu", replacement: "I really like to read.", pt: "Eu gosto muito de ler." },
        { label: "Nós", replacement: "We really like to read.", pt: "Nós gostamos muito de ler." },
        { label: "Você", replacement: "You really like to read.", pt: "Você gosta muito de ler." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "enviar / Eu envio. / Você envia. / Eles enviam.",
      options: [
        { label: "enviar", replacement: "to send.", pt: "enviar" },
        { label: "Eu envio", replacement: "I send.", pt: "Eu envio." },
        { label: "Você envia", replacement: "You send.", pt: "Você envia." },
        { label: "Eles enviam", replacement: "They send.", pt: "Eles enviam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eles não enviam. / Você / Eu.",
      options: [
        { label: "Eles", replacement: "They don't send.", pt: "Eles não enviam." },
        { label: "Você", replacement: "You don't send.", pt: "Você não envia." },
        { label: "Eu", replacement: "I don't send.", pt: "Eu não envio." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Você envia? / Elas / Eu.",
      options: [
        { label: "Você", replacement: "Do you send?", pt: "Você envia?" },
        { label: "Elas", replacement: "Do they send?", pt: "Elas enviam?" },
        { label: "Eu", replacement: "Do I send?", pt: "Eu envio?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "O que você quer enviar? / ler / comer.",
      options: [
        { label: "enviar", replacement: "What do you want to send?", pt: "O que você quer enviar?" },
        { label: "ler", replacement: "What do you want to read?", pt: "O que você quer ler?" },
        { label: "comer", replacement: "What do you want to eat?", pt: "O que você quer comer?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu leio notícias de manhã. / Nós lemos / Eles leem.",
      options: [
        { label: "Eu", replacement: "I read the news in the morning.", pt: "Eu leio as notícias de manhã." },
        { label: "Nós", replacement: "We read the news in the morning.", pt: "Nós lemos as notícias de manhã." },
        { label: "Eles", replacement: "They read the news in the morning.", pt: "Eles leem as notícias de manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você gosta de ler revistas? / livros / histórias.",
      options: [
        { label: "revistas", replacement: "Do you like to read magazines?", pt: "Você gosta de ler revistas?" },
        { label: "livros", replacement: "Do you like to read books?", pt: "Você gosta de ler livros?" },
        { label: "histórias", replacement: "Do you like to read stories?", pt: "Você gosta de ler histórias?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Do you read magazines online? / livros / notícias.",
      options: [
        { label: "magazines", replacement: "Do you read magazines online?", pt: "Você lê revistas online?" },
        { label: "books", replacement: "Do you read books online?", pt: "Você lê livros online?" },
        { label: "news", replacement: "Do you read the news online?", pt: "Você lê as notícias online?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Você lê seus e-mails no trabalho? / em casa / na escola.",
      options: [
        { label: "no trabalho", replacement: "Do you read your e-mails at work?", pt: "Você lê seus e-mails no trabalho?" },
        { label: "em casa", replacement: "Do you read your e-mails at home?", pt: "Você lê seus e-mails em casa?" },
        { label: "na escola", replacement: "Do you read your e-mails at school?", pt: "Você lê seus e-mails na escola?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu leio histórias para meus filhos. / colegas de classe / professores.",
      options: [
        { label: "meus filhos", replacement: "I read stories to my children.", pt: "Eu leio histórias para meus filhos." },
        { label: "colegas de classe", replacement: "I read stories to my classmates.", pt: "Eu leio histórias para meus colegas de classe." },
        { label: "professores", replacement: "I read stories to my teachers.", pt: "Eu leio histórias para meus professores." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "I send messages to my mother. / meu pai / meu amigo.",
      options: [
        { label: "my mother", replacement: "I send messages to my mother.", pt: "Eu envio mensagens para minha mãe." },
        { label: "my father", replacement: "I send messages to my father.", pt: "Eu envio mensagens para meu pai." },
        { label: "my friend", replacement: "I send messages to my friend.", pt: "Eu envio mensagens para meu amigo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Você precisa enviar um e-mail para seu chefe. / colega de trabalho / professor.",
      options: [
        { label: "chefe", replacement: "You need to send an e-mail to your boss.", pt: "Você precisa enviar um e-mail para seu chefe." },
        { label: "colega", replacement: "You need to send an e-mail to your co-worker.", pt: "Você precisa enviar um e-mail para seu colega de trabalho." },
        { label: "professor", replacement: "You need to send an e-mail to your teacher.", pt: "Você precisa enviar um e-mail para seu professor." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eu gosto de enviar mensagens para meus amigos. / colegas de trabalho / minha família.",
      options: [
        { label: "meus amigos", replacement: "I like to send messages to my friends.", pt: "Eu gosto de enviar mensagens para meus amigos." },
        { label: "colegas de trabalho", replacement: "I like to send messages to my co-workers.", pt: "Eu gosto de enviar mensagens para meus colegas de trabalho." },
        { label: "minha família", replacement: "I like to send messages to my family.", pt: "Eu gosto de enviar mensagens para minha família." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "I have a big house. / pequena / nova.",
      options: [
        { label: "big", replacement: "I have a big house.", pt: "Eu tenho uma casa grande." },
        { label: "small", replacement: "I have a small house.", pt: "Eu tenho uma casa pequena." },
        { label: "new", replacement: "I have a new house.", pt: "Eu tenho uma casa nova." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu tenho uma senha nova. / pequena / grande.",
      options: [
        { label: "nova", replacement: "I have a new password.", pt: "Eu tenho uma senha nova." },
        { label: "pequena", replacement: "I have a small password.", pt: "Eu tenho uma senha pequena." },
        { label: "grande", replacement: "I have a big password.", pt: "Eu tenho uma senha grande." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eles têm um carro pequeno. / grande / novo.",
      options: [
        { label: "pequeno", replacement: "They have a small car.", pt: "Eles têm um carro pequeno." },
        { label: "grande", replacement: "They have a big car.", pt: "Eles têm um carro grande." },
        { label: "novo", replacement: "They have a new car.", pt: "Eles têm um carro novo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Qual é o seu número de telefone? / endereço / e-mail.",
      options: [
        { label: "telefone", replacement: "What's your phone number?", pt: "Qual é o seu número de telefone?" },
        { label: "endereço", replacement: "What's your address?", pt: "Qual é o seu endereço?" },
        { label: "e-mail", replacement: "What's your e-mail address?", pt: "Qual é o seu endereço de e-mail?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "I need to speak with the teacher. / as crianças / os americanos.",
      options: [
        { label: "the teacher", replacement: "I need to speak with the teacher.", pt: "Eu preciso falar com o professor." },
        { label: "the children", replacement: "I need to speak with the children.", pt: "Eu preciso falar com as crianças." },
        { label: "the Americans", replacement: "I need to speak with the Americans.", pt: "Eu preciso falar com os americanos." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Você lê e-mails todos os dias? / mensagens / notícias.",
      options: [
        { label: "e-mails", replacement: "Do you read e-mails every day?", pt: "Você lê e-mails todos os dias?" },
        { label: "mensagens", replacement: "Do you read messages every day?", pt: "Você lê mensagens todos os dias?" },
        { label: "notícias", replacement: "Do you read the news every day?", pt: "Você lê as notícias todos os dias?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu leio livros no meu tablet. / histórias / revistas.",
      options: [
        { label: "livros", replacement: "I read books on my tablet.", pt: "Eu leio livros no meu tablet." },
        { label: "histórias", replacement: "I read stories on my tablet.", pt: "Eu leio histórias no meu tablet." },
        { label: "revistas", replacement: "I read magazines on my tablet.", pt: "Eu leio revistas no meu tablet." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu leio meus e-mails no meu celular. / tablet / computador.",
      options: [
        { label: "celular", replacement: "I read my e-mails on my cell phone.", pt: "Eu leio meus e-mails no meu celular." },
        { label: "tablet", replacement: "I read my e-mails on my tablet.", pt: "Eu leio meus e-mails no meu tablet." },
        { label: "computador", replacement: "I read my e-mails on my computer.", pt: "Eu leio meus e-mails no meu computador." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você prefere ler seus e-mails no seu computador? / gosta / quer.",
      options: [
        { label: "prefere", replacement: "Do you prefer to read your e-mails on your computer?", pt: "Você prefere ler seus e-mails no seu computador?" },
        { label: "gosta", replacement: "Do you like to read your e-mails on your computer?", pt: "Você gosta de ler seus e-mails no seu computador?" },
        { label: "quer", replacement: "Do you want to read your e-mails on your computer?", pt: "Você quer ler seus e-mails no seu computador?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você vê seu amigo americano todos os dias? / britânico / brasileiro.",
      options: [
        { label: "americano", replacement: "Do you see your American friend every day?", pt: "Você vê seu amigo americano todos os dias?" },
        { label: "britânico", replacement: "Do you see your British friend every day?", pt: "Você vê seu amigo britânico todos os dias?" },
        { label: "brasileiro", replacement: "Do you see your Brazilian friend every day?", pt: "Você vê seu amigo brasileiro todos os dias?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu como pão com manteiga todos os dias. / com queijo / com presunto.",
      options: [
        { label: "manteiga", replacement: "I eat bread and butter every day.", pt: "Eu como pão com manteiga todos os dias." },
        { label: "queijo", replacement: "I eat bread and cheese every day.", pt: "Eu como pão com queijo todos os dias." },
        { label: "presunto", replacement: "I eat bread and ham every day.", pt: "Eu como pão com presunto todos os dias." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "I go to the movies with my children. / shopping / restaurante.",
      options: [
        { label: "movies", replacement: "I go to the movies with my children.", pt: "Eu vou ao cinema com meus filhos." },
        { label: "shopping", replacement: "I go shopping with my children.", pt: "Eu vou ao shopping com meus filhos." },
        { label: "restaurant", replacement: "I go to the restaurant with my children.", pt: "Eu vou ao restaurante com meus filhos." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Você gosta de ir ao cinema? / cafeteria / restaurante.",
      options: [
        { label: "cinema", replacement: "Do you like to go to the movies?", pt: "Você gosta de ir ao cinema?" },
        { label: "cafeteria", replacement: "Do you like to go to the coffee shop?", pt: "Você gosta de ir à cafeteria?" },
        { label: "restaurante", replacement: "Do you like to go to the restaurant?", pt: "Você gosta de ir ao restaurante?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Nós queremos ir ao shopping à tarde. / cinema / cafeteria.",
      options: [
        { label: "shopping", replacement: "We want to go shopping in the afternoon.", pt: "Nós queremos ir ao shopping à tarde." },
        { label: "cinema", replacement: "We want to go to the movies in the afternoon.", pt: "Nós queremos ir ao cinema à tarde." },
        { label: "cafeteria", replacement: "We want to go to the coffee shop in the afternoon.", pt: "Nós queremos ir à cafeteria à tarde." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Você vai ao shopping com seu marido? / esposa / família.",
      options: [
        { label: "marido", replacement: "Do you go shopping with your husband?", pt: "Você vai ao shopping com seu marido?" },
        { label: "esposa", replacement: "Do you go shopping with your wife?", pt: "Você vai ao shopping com sua esposa?" },
        { label: "família", replacement: "Do you go shopping with your family?", pt: "Você vai ao shopping com sua família?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Você vai ao restaurante sozinho? / cafeteria / cinema.",
      options: [
        { label: "restaurante", replacement: "Do you go to the restaurant alone?", pt: "Você vai ao restaurante sozinho?" },
        { label: "cafeteria", replacement: "Do you go to the coffee shop alone?", pt: "Você vai à cafeteria sozinho?" },
        { label: "cinema", replacement: "Do you go to the movies alone?", pt: "Você vai ao cinema sozinho?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eu vou ao shopping todos os dias. / cafeteria / restaurante.",
      options: [
        { label: "shopping", replacement: "I go shopping every day.", pt: "Eu vou ao shopping todos os dias." },
        { label: "cafeteria", replacement: "I go to the coffee shop every day.", pt: "Eu vou à cafeteria todos os dias." },
        { label: "restaurante", replacement: "I go to the restaurant every day.", pt: "Eu vou ao restaurante todos os dias." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu vou para a escola sozinho. / trabalho / para a aula.",
      options: [
        { label: "escola", replacement: "I go to school alone.", pt: "Eu vou para a escola sozinho." },
        { label: "trabalho", replacement: "I go to work alone.", pt: "Eu vou ao trabalho sozinho." },
        { label: "aula", replacement: "I go to class alone.", pt: "Eu vou para a aula sozinho." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Você quer ir ao cinema comigo? / cafeteria / restaurante.",
      options: [
        { label: "cinema", replacement: "Do you want to go to the movies with me?", pt: "Você quer ir ao cinema comigo?" },
        { label: "cafeteria", replacement: "Do you want to go to the coffee shop with me?", pt: "Você quer ir à cafeteria comigo?" },
        { label: "restaurante", replacement: "Do you want to go to the restaurant with me?", pt: "Você quer ir ao restaurante comigo?" },
      ],
      currentIndex: 0,
    },
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

        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 Lesson 15 - Personal Information & Routine
          </h1>
          <SpeakSentence text="Learn to talk about daily activities, reading habits, sending messages, and going to different places." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about daily activities, reading habits, sending messages, and going to different places.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Daily routine and work schedule"
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
            <SpeakSentence text="Practice common phrases for daily communication" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication
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
            <SpeakSentence text="Structures for asking about going to places and daily routines" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking about going to places and daily routines
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
              Practice reading and sending messages
            </div>
          </div>

          <div className="p-8">
            {/* Tip box – substitute only blue words */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">💡 Dica:</span> Substitua <span className="text-blue-600 font-bold">apenas as palavras em azul</span> por outras palavras para criar novas frases.
                Por exemplo: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">read</span> the <span className="text-blue-600 font-bold">news</span> in the <span className="text-blue-600 font-bold">morning</span>."</span> →
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">send</span> a <span className="text-blue-600 font-bold">message</span> in the <span className="text-blue-600 font-bold">afternoon</span>."</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          <span className="mr-1">{index + 1}.</span>
                          {sentence.parts.map((part, pIdx) => (
                            part.h ? (
                              <span key={pIdx} className="text-blue-600 font-bold">{part.text}</span>
                            ) : (
                              <span key={pIdx}>{part.text}</span>
                            )
                          ))}
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
                        src={readingImage}
                        alt="Reading books and digital content"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Reading books, magazines and digital content
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={placesImage}
                        alt="Work and daily routine"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Daily routine, work and personal information
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={digitalImage}
                        alt="Digital communication"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Digital communication and e-mails
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
              <SpeakSentence text="Common phrases, email format, and important English rules" className="mt-2 text-blue-100 italic">
                📝 Common phrases, email format, and important English rules
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-4 text-yellow-300">COMMON PHRASES</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on my computer" className="text-blue-200 hover:text-white">
                      • on my computer
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no meu computador</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on your tablet" className="text-blue-200 hover:text-white">
                      • on your tablet
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no seu tablet</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on my cell phone" className="text-blue-200 hover:text-white">
                      • on my cell phone
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no meu celular</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="read the news" className="text-blue-200 hover:text-white">
                      • read the news
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">ler as notícias</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="send an e-mail" className="text-blue-200 hover:text-white">
                      • send an e-mail
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">enviar um e-mail</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-700">
                <h4 className="font-bold text-lg text-yellow-300 mb-3">📱 USING "ON" WITH DEVICES & APPS</h4>
                <p className="text-blue-200 text-sm mb-2">
                  Em inglês, usamos a preposição <strong className="text-white">"on"</strong> para:
                </p>
                <ul className="text-blue-200 text-sm space-y-1 list-disc pl-4">
                  <li><strong className="text-white">Dispositivos:</strong> on my computer, on my cell phone, on my tablet</li>
                  <li><strong className="text-white">Plataformas e aplicativos:</strong> on Instagram, on WhatsApp, on X (Twitter), on YouTube, on Facebook</li>
                  <li><strong className="text-white">Sites e serviços:</strong> on the website, on Amazon, on Google, on Netflix</li>
                  <li><strong className="text-white">Redes sociais (em geral):</strong> on social media, on LinkedIn</li>
                </ul>
                <p className="text-blue-200 text-sm mt-2">
                  Exemplos: <span className="text-white">"I read the news <strong>on</strong> my phone."</span> — <span className="text-white">"She posts photos <strong>on</strong> Instagram."</span>
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  🔹 <span className="text-white">Atenção:</span> usamos <strong>"in"</strong> para países, cidades e lugares fechados (ex: in Brazil, in the kitchen), mas para dispositivos e plataformas digitais é sempre <strong>"on"</strong>.
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-yellow-300">PLURAL FORMATION RULES</h4>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">address → addresses</span>
                    <span className="text-blue-200 text-sm">endereços</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">story → stories</span>
                    <span className="text-blue-200 text-sm">histórias</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">book → books</span>
                    <span className="text-blue-200 text-sm">livros</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="What's your e-mail address?" className="text-blue-200 hover:text-white font-bold">
                      What's your e-mail address?
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">Qual é o seu endereço de e-mail?</p>
                </div>

                <div className="pt-4 border-t border-blue-700">
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="It's elisasullivan@leaf.com" className="text-blue-200 hover:text-white font-bold">
                      It's elisasullivan@leaf.com
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">É elisasullivan@leaf.com</p>
                  <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                    <p className="text-yellow-300 font-mono">elisasullivan@leaf.com</p>
                    <p className="text-blue-200 text-sm mt-1">Format: name@domain.com</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-blue-700">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">SPECIAL CHARACTERS</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">@</span>
                        <div>
                          <p className="font-bold">At</p>
                          <p className="text-blue-200 text-sm">Pronounced "at" in emails</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">.</span>
                        <div>
                          <p className="font-bold">Dot</p>
                          <p className="text-blue-200 text-sm">Pronounced "dot" in web addresses</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">_</span>
                        <div>
                          <p className="font-bold">Underscore</p>
                          <p className="text-blue-200 text-sm">Pronounced "underscore"</p>
                        </div>
                      </div>
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
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (14)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (16) &rarr;
          </button>
        </div>
      </div>

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