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
// MAIN COMPONENT – LESSON 29
// ============================================
export default function Lesson29DrivingWalkingCommands() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showPrepositionsGuide, setShowPrepositionsGuide] = useState(false);

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
  const mainImage = "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const drivingImage = "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const walkingImage = "https://images.unsplash.com/photo-1502904550040-7534597429ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const transportImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cityImage = "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ========== LESSON 29 DATA ==========
  const verbs = [
    { english: "to drive", portuguese: "dirigir" },
    { english: "to walk", portuguese: "andar, caminhar" }
  ];

  const newWords = [
    { english: "street", portuguese: "rua" },
    { english: "avenue", portuguese: "avenida" },
    { english: "block", portuguese: "quarteirão" },
    { english: "station", portuguese: "estação" },
    { english: "airport", portuguese: "aeroporto" },
    { english: "gas station", portuguese: "posto de gasolina" },
    { english: "car", portuguese: "carro" },
    { english: "taxi", portuguese: "táxi" },
    { english: "bus", portuguese: "ônibus" },
    { english: "train", portuguese: "trem" },
    { english: "subway", portuguese: "metrô" },
    { english: "bicycle", portuguese: "bicicleta" },
    { english: "motorcycle", portuguese: "motocicleta" },
    { english: "downtown", portuguese: "centro da cidade" },
    { english: "office", portuguese: "escritório" },
    { english: "address", portuguese: "endereço" },
    { english: "zip code", portuguese: "CEP" },
  ];

  const usefulPhrases = [
    { english: "I go to school by bike.", portuguese: "Eu vou para a escola de bicicleta." },
    { english: "We go to work by subway.", portuguese: "Nós vamos para o trabalho de metrô." },
    { english: "I need to go downtown today.", portuguese: "Eu preciso ir ao centro da cidade hoje." },
    { english: "She drives me to work.", portuguese: "Ela me leva de carro para o trabalho." },
  ];

  const grammarExamples = [
    { english: "Get some food.", portuguese: "Pegue um pouco de comida." },
    { english: "Send this email to your boss.", portuguese: "Envie este e-mail para o seu chefe." },
    { english: "Don't eat here.", portuguese: "Não coma aqui." },
    { english: "Don't go downtown now.", portuguese: "Não vá ao centro da cidade agora." }
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Dirigir / Eu dirijo. / Ela dirige. / Nós dirigimos.",
      options: [
        { label: "Dirigir", replacement: "to drive.", pt: "Dirigir" },
        { label: "Eu dirijo", replacement: "I drive.", pt: "Eu dirijo." },
        { label: "Ela dirige", replacement: "She drives.", pt: "Ela dirige." },
        { label: "Nós dirigimos", replacement: "We drive.", pt: "Nós dirigimos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não dirijo. / Ele não dirige. / Ela não dirige.",
      options: [
        { label: "Eu", replacement: "I don't drive.", pt: "Eu não dirijo." },
        { label: "Ele", replacement: "He doesn't drive.", pt: "Ele não dirige." },
        { label: "Ela", replacement: "She doesn't drive.", pt: "Ela não dirige." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu preciso aprender a dirigir. / Nós precisamos aprender a dirigir.",
      options: [
        { label: "Eu", replacement: "I need to learn how to drive.", pt: "Eu preciso aprender a dirigir." },
        { label: "Nós", replacement: "We need to learn how to drive.", pt: "Nós precisamos aprender a dirigir." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você sabe dirigir? / Ele sabe dirigir? / Ela sabe dirigir?",
      options: [
        { label: "Você", replacement: "Do you know how to drive?", pt: "Você sabe dirigir?" },
        { label: "Ele", replacement: "Does he know how to drive?", pt: "Ele sabe dirigir?" },
        { label: "Ela", replacement: "Does she know how to drive?", pt: "Ela sabe dirigir?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu dirijo para o escritório. / Empresa / Banco.",
      options: [
        { label: "escritório", replacement: "I drive to the office.", pt: "Eu dirijo para o escritório." },
        { label: "empresa", replacement: "I drive to the company.", pt: "Eu dirijo para a empresa." },
        { label: "banco", replacement: "I drive to the bank.", pt: "Eu dirijo para o banco." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Andar / Caminhar / Eu ando. / Ele anda. / Nós andamos.",
      options: [
        { label: "Andar", replacement: "to walk.", pt: "Andar / Caminhar" },
        { label: "Eu ando", replacement: "I walk.", pt: "Eu ando." },
        { label: "Ele anda", replacement: "He walks.", pt: "Ele anda." },
        { label: "Nós andamos", replacement: "We walk.", pt: "Nós andamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu gosto de caminhar no shopping. / No parque / Na praça.",
      options: [
        { label: "shopping", replacement: "I like to walk in the mall.", pt: "Eu gosto de caminhar no shopping." },
        { label: "parque", replacement: "I like to walk in the park.", pt: "Eu gosto de caminhar no parque." },
        { label: "praça", replacement: "I like to walk in the square.", pt: "Eu gosto de caminhar na praça." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu não caminho para a escola. / Trabalho / Igreja.",
      options: [
        { label: "escola", replacement: "I don't walk to school.", pt: "Eu não caminho para a escola." },
        { label: "trabalho", replacement: "I don't walk to work.", pt: "Eu não caminho para o trabalho." },
        { label: "igreja", replacement: "I don't walk to church.", pt: "Eu não caminho para a igreja." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Você caminha para o escritório? / Mercado / Praia.",
      options: [
        { label: "escritório", replacement: "Do you walk to the office?", pt: "Você caminha para o escritório?" },
        { label: "mercado", replacement: "Do you walk to the market?", pt: "Você caminha para o mercado?" },
        { label: "praia", replacement: "Do you walk to the beach?", pt: "Você caminha para a praia?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Você caminha para casa todos os dias? / Fica em casa / Dirige para casa.",
      options: [
        { label: "caminha", replacement: "Do you walk home every day?", pt: "Você caminha para casa todos os dias?" },
        { label: "fica", replacement: "Do you stay home every day?", pt: "Você fica em casa todos os dias?" },
        { label: "dirige", replacement: "Do you drive home every day?", pt: "Você dirige para casa todos os dias?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu moro nesta rua. / Nesta avenida / Neste quarteirão.",
      options: [
        { label: "rua", replacement: "I live on this street.", pt: "Eu moro nesta rua." },
        { label: "avenida", replacement: "I live on this avenue.", pt: "Eu moro nesta avenida." },
        { label: "quarteirão", replacement: "I live in this block.", pt: "Eu moro neste quarteirão." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você mora neste quarteirão? / Trabalha / Estuda.",
      options: [
        { label: "mora", replacement: "Do you live in this block?", pt: "Você mora neste quarteirão?" },
        { label: "trabalha", replacement: "Do you work in this block?", pt: "Você trabalha neste quarteirão?" },
        { label: "estuda", replacement: "Do you study in this block?", pt: "Você estuda neste quarteirão?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ele trabalha perto da estação. / Do aeroporto / Do posto de gasolina.",
      options: [
        { label: "estação", replacement: "He works near the station.", pt: "Ele trabalha perto da estação." },
        { label: "aeroporto", replacement: "He works near the airport.", pt: "Ele trabalha perto do aeroporto." },
        { label: "posto", replacement: "He works near the gas station.", pt: "Ele trabalha perto do posto de gasolina." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Ela dirige um carro. / Um táxi / Um ônibus.",
      options: [
        { label: "carro", replacement: "She drives a car.", pt: "Ela dirige um carro." },
        { label: "táxi", replacement: "She drives a taxi.", pt: "Ela dirige um táxi." },
        { label: "ônibus", replacement: "She drives a bus.", pt: "Ela dirige um ônibus." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu pego o trem de manhã. / Metrô / Ônibus.",
      options: [
        { label: "trem", replacement: "I take the train in the morning.", pt: "Eu pego o trem de manhã." },
        { label: "metrô", replacement: "I take the subway in the morning.", pt: "Eu pego o metrô de manhã." },
        { label: "ônibus", replacement: "I take the bus in the morning.", pt: "Eu pego o ônibus de manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Ela pega um táxi à tarde. / Às 8 horas da manhã / Às 9 horas da noite.",
      options: [
        { label: "tarde", replacement: "She takes a taxi in the afternoon.", pt: "Ela pega um táxi à tarde." },
        { label: "8 da manhã", replacement: "She takes a taxi at 8 in the morning.", pt: "Ela pega um táxi às 8 horas da manhã." },
        { label: "9 da noite", replacement: "She takes a taxi at 9 at night.", pt: "Ela pega um táxi às 9 horas da noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Ele precisa pegar aquele ônibus. / Táxi / Trem.",
      options: [
        { label: "ônibus", replacement: "He needs to take that bus.", pt: "Ele precisa pegar aquele ônibus." },
        { label: "táxi", replacement: "He needs to take that taxi.", pt: "Ele precisa pegar aquele táxi." },
        { label: "trem", replacement: "He needs to take that train.", pt: "Ele precisa pegar aquele trem." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Você quer comprar um carro novo? / Bicicleta / Motocicleta.",
      options: [
        { label: "carro", replacement: "Do you want to buy a new car?", pt: "Você quer comprar um carro novo?" },
        { label: "bicicleta", replacement: "Do you want to buy a new bicycle?", pt: "Você quer comprar uma bicicleta nova?" },
        { label: "motocicleta", replacement: "Do you want to buy a new motorcycle?", pt: "Você quer comprar uma motocicleta nova?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Nós estudamos depois do trabalho. / Cozinhamos / Lemos.",
      options: [
        { label: "estudamos", replacement: "We study after work.", pt: "Nós estudamos depois do trabalho." },
        { label: "cozinhamos", replacement: "We cook after work.", pt: "Nós cozinhamos depois do trabalho." },
        { label: "lemos", replacement: "We read after work.", pt: "Nós lemos depois do trabalho." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu faço exercícios antes das dez horas. / Nove / Oito.",
      options: [
        { label: "dez", replacement: "I exercise before ten o'clock.", pt: "Eu faço exercícios antes das dez horas." },
        { label: "nove", replacement: "I exercise before nine o'clock.", pt: "Eu faço exercícios antes das nove horas." },
        { label: "oito", replacement: "I exercise before eight o'clock.", pt: "Eu faço exercícios antes das oito horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu lavo a louça depois das seis horas. / Tomo um banho / Janto.",
      options: [
        { label: "louça", replacement: "I wash the dishes after six o'clock.", pt: "Eu lavo a louça depois das seis horas." },
        { label: "banho", replacement: "I take a shower after six o'clock.", pt: "Eu tomo um banho depois das seis horas." },
        { label: "janto", replacement: "I have dinner after six o'clock.", pt: "Eu janto depois das seis horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Ele precisa ir à estação de ônibus. / De trem / De metrô.",
      options: [
        { label: "ônibus", replacement: "He needs to go to the bus station.", pt: "Ele precisa ir à estação de ônibus." },
        { label: "trem", replacement: "He needs to go to the train station.", pt: "Ele precisa ir à estação de trem." },
        { label: "metrô", replacement: "He needs to go to the subway station.", pt: "Ele precisa ir à estação de metrô." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu vou para a escola de bicicleta.",
      options: [
        { label: "bicicleta", replacement: "I go to school by bike.", pt: "Eu vou para a escola de bicicleta." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Nós vamos para o trabalho de metrô. / Táxi / Motocicleta.",
      options: [
        { label: "metrô", replacement: "We go to work by subway.", pt: "Nós vamos para o trabalho de metrô." },
        { label: "táxi", replacement: "We go to work by taxi.", pt: "Nós vamos para o trabalho de táxi." },
        { label: "motocicleta", replacement: "We go to work by motorcycle.", pt: "Nós vamos para o trabalho de motocicleta." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Você vai ao shopping de metrô? / Trem / Ônibus.",
      options: [
        { label: "metrô", replacement: "Do you go to the mall by subway?", pt: "Você vai ao shopping de metrô?" },
        { label: "trem", replacement: "Do you go to the mall by train?", pt: "Você vai ao shopping de trem?" },
        { label: "ônibus", replacement: "Do you go to the mall by bus?", pt: "Você vai ao shopping de ônibus?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu preciso ir ao centro da cidade hoje.",
      options: [
        { label: "hoje", replacement: "I need to go downtown today.", pt: "Eu preciso ir ao centro da cidade hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você precisa ir ao centro da cidade à tarde? / De manhã / À noite.",
      options: [
        { label: "tarde", replacement: "Do you need to go downtown in the afternoon?", pt: "Você precisa ir ao centro da cidade à tarde?" },
        { label: "manhã", replacement: "Do you need to go downtown in the morning?", pt: "Você precisa ir ao centro da cidade de manhã?" },
        { label: "noite", replacement: "Do you need to go downtown at night?", pt: "Você precisa ir ao centro da cidade à noite?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Quando você precisa ir ao centro da cidade? / Em que horário?",
      options: [
        { label: "quando", replacement: "When do you need to go downtown?", pt: "Quando você precisa ir ao centro da cidade?" },
        { label: "horário", replacement: "At what time do you need to go downtown?", pt: "Em que horário você precisa ir ao centro da cidade?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Eu estudo downtown. / Trabalho / Encontro meus amigos.",
      options: [
        { label: "estudo", replacement: "I study downtown.", pt: "Eu estudo no centro da cidade." },
        { label: "trabalho", replacement: "I work downtown.", pt: "Eu trabalho no centro da cidade." },
        { label: "encontro", replacement: "I meet my friends downtown.", pt: "Eu encontro meus amigos no centro da cidade." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Ela me leva de carro para o trabalho. / Escola / Igreja.",
      options: [
        { label: "trabalho", replacement: "She drives me to work.", pt: "Ela me leva de carro para o trabalho." },
        { label: "escola", replacement: "She drives me to school.", pt: "Ela me leva de carro para a escola." },
        { label: "igreja", replacement: "She drives me to church.", pt: "Ela me leva de carro para a igreja." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Ele te leva de carro para o mercado? / Escritório / Praia.",
      options: [
        { label: "mercado", replacement: "Does he drive you to the market?", pt: "Ele te leva de carro para o mercado?" },
        { label: "escritório", replacement: "Does he drive you to the office?", pt: "Ele te leva de carro para o escritório?" },
        { label: "praia", replacement: "Does he drive you to the beach?", pt: "Ele te leva de carro para a praia?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Você quer ir para casa agora? / Escola / Aeroporto.",
      options: [
        { label: "casa", replacement: "Do you want to go home now?", pt: "Você quer ir para casa agora?" },
        { label: "escola", replacement: "Do you want to go to school now?", pt: "Você quer ir para a escola agora?" },
        { label: "aeroporto", replacement: "Do you want to go to the airport now?", pt: "Você quer ir para o aeroporto agora?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Pegue um pouco de comida. / Molho / Salada.",
      options: [
        { label: "comida", replacement: "Get some food.", pt: "Pegue um pouco de comida." },
        { label: "molho", replacement: "Get some sauce.", pt: "Pegue um pouco de molho." },
        { label: "salada", replacement: "Get some salad.", pt: "Pegue um pouco de salada." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Envie este e-mail para o seu chefe. / Colega de trabalho / Professor.",
      options: [
        { label: "chefe", replacement: "Send this email to your boss.", pt: "Envie este e-mail para o seu chefe." },
        { label: "colega", replacement: "Send this email to your coworker.", pt: "Envie este e-mail para o seu colega de trabalho." },
        { label: "professor", replacement: "Send this email to your teacher.", pt: "Envie este e-mail para o seu professor." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Compre mais refrigerante, por favor. / Suco / Leite.",
      options: [
        { label: "refrigerante", replacement: "Buy more soda, please.", pt: "Compre mais refrigerante, por favor." },
        { label: "suco", replacement: "Buy more juice, please.", pt: "Compre mais suco, por favor." },
        { label: "leite", replacement: "Buy more milk, please.", pt: "Compre mais leite, por favor." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Durma cedo. / Venha / Levante.",
      options: [
        { label: "durma", replacement: "Sleep early.", pt: "Durma cedo." },
        { label: "venha", replacement: "Come.", pt: "Venha." },
        { label: "levante", replacement: "Get up.", pt: "Levante." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Fique aqui. / Vá / Em casa.",
      options: [
        { label: "aqui", replacement: "Stay here.", pt: "Fique aqui." },
        { label: "vá", replacement: "Go.", pt: "Vá." },
        { label: "em casa", replacement: "Stay home.", pt: "Fique em casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Não coma aqui. / Beba / Durma.",
      options: [
        { label: "coma", replacement: "Don't eat here.", pt: "Não coma aqui." },
        { label: "beba", replacement: "Don't drink here.", pt: "Não beba aqui." },
        { label: "durma", replacement: "Don't sleep here.", pt: "Não durma aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Não fique aqui. / O dia todo / Durante a semana.",
      options: [
        { label: "aqui", replacement: "Don't stay here.", pt: "Não fique aqui." },
        { label: "dia todo", replacement: "Don't stay here all day.", pt: "Não fique aqui o dia todo." },
        { label: "semana", replacement: "Don't stay here during the week.", pt: "Não fique aqui durante a semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Não limpe a cozinha hoje. / O quarto / A sala de estar.",
      options: [
        { label: "cozinha", replacement: "Don't clean the kitchen today.", pt: "Não limpe a cozinha hoje." },
        { label: "quarto", replacement: "Don't clean the bedroom today.", pt: "Não limpe o quarto hoje." },
        { label: "sala", replacement: "Don't clean the living room today.", pt: "Não limpe a sala de estar hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Não vá ao centro da cidade agora. / Ao banco / Ao mercado.",
      options: [
        { label: "centro", replacement: "Don't go downtown now.", pt: "Não vá ao centro da cidade agora." },
        { label: "banco", replacement: "Don't go to the bank now.", pt: "Não vá ao banco agora." },
        { label: "mercado", replacement: "Don't go to the market now.", pt: "Não vá ao mercado agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Não compre esta passagem. / Esta cara / Lembrancinha / Carro.",
      options: [
        { label: "passagem", replacement: "Don't buy this ticket.", pt: "Não compre esta passagem." },
        { label: "cara", replacement: "Don't buy this expensive one.", pt: "Não compre esta cara." },
        { label: "lembrancinha", replacement: "Don't buy this souvenir.", pt: "Não compre esta lembrancinha." },
        { label: "carro", replacement: "Don't buy this car.", pt: "Não compre este carro." },
      ],
      currentIndex: 0,
    },
  ];

  // Assessment data
  const assessmentData = [
    { question: "What's the opposite of early?", answer: "late" },
    { question: "What are the days of the week?", answer: "Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday" },
    { question: "What's the opposite of near?", answer: "far" },
    { question: "What's the opposite of left?", answer: "right" },
  ];

  // Real Life Practice sentences
  const realLifeSentences = [
    { english: "She takes the subway at 7:00 a.m.", portuguese: "Ela pega o metrô às 7:00 da manhã." },
    { english: "We go to work by bicycle.", portuguese: "Nós vamos ao trabalho de bicicleta." },
    { english: "Do we need to go downtown now?", portuguese: "Nós precisamos ir ao centro agora?" },
    { english: "Does she live on this street?", portuguese: "Ela mora nesta rua?" },
    { english: "I don't drive. I usually walk to work.", portuguese: "Eu não dirijo. Eu geralmente ando para o trabalho." },
    { english: "Take a cab to the airport.", portuguese: "Pegue um táxi para o aeroporto." },
    { english: "My address is 123 Main Street.", portuguese: "Meu endereço é Rua Principal, 123." },
    { english: "What's your zip code?", portuguese: "Qual é o seu CEP?" },
    { english: "I need to learn how to drive.", portuguese: "Eu preciso aprender a dirigir." },
    { english: "She walks to work every day.", portuguese: "Ela caminha para o trabalho todos os dias." },
    { english: "Do you take the subway in the morning?", portuguese: "Você pega o metrô de manhã?" },
    { english: "I don't want to drive downtown.", portuguese: "Eu não quero dirigir para o centro da cidade." },
    { english: "He needs to take a taxi to the airport.", portuguese: "Ele precisa pegar um táxi para o aeroporto." },
    { english: "We study after work.", portuguese: "Nós estudamos depois do trabalho." },
    { english: "Don't buy that expensive ticket.", portuguese: "Não compre aquela passagem cara." },
    { english: "Get some food for the trip.", portuguese: "Pegue um pouco de comida para a viagem." },
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
            🚗 Lesson 29 - Driving, Walking & Commands
          </h1>
          <SpeakSentence text="Learn to talk about driving, walking, transport, daily routines and commands." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about driving, walking, transport, daily routines and commands.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Driving and getting around"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* ===================== ASSESSMENT ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 Assessment</h2>
              <SpeakSentence text="Practice opposites and essential vocabulary" className="mt-2 text-blue-100 italic">
                Pratique opostos e vocabulário essencial
              </SpeakSentence>
            </div>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
              {assessmentData.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium">
                    {index + 1}. <SpeakSentence text={item.question} className="inline">{item.question}</SpeakSentence>
                  </p>
                  <p className="text-gray-700 mt-1">
                    ➡ <SpeakSentence text={item.answer} className="font-semibold text-blue-600 inline">{item.answer}</SpeakSentence>
                  </p>
                </div>
              ))}
            </div>
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
            <SpeakSentence text="Practice common phrases for transportation and commuting" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for transportation and commuting
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
            <SpeakSentence text="Structures for giving commands and instructions (Imperatives)" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for giving commands and instructions (Imperatives)
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

        {/* ===================== SECTION 5 – REAL LIFE PRACTICE ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Real Life Practice</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice driving, walking and daily routines
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
                        src={drivingImage}
                        alt="Driving a car"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Driving and commuting
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={walkingImage}
                        alt="Walking around the city"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Walking and daily routine
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={transportImage}
                        alt="Public transportation"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Transport and getting around
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – CHECK IT OUT (Prepositions) ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔵 CHECK IT OUT!</h2>
              <SpeakSentence text="Addresses, prepositions and street types" className="mt-2 text-blue-100 italic">
                Endereços, preposições e tipos de via - tudo o que você precisa para se localizar!
              </SpeakSentence>
            </div>
            <button
              onClick={() => setShowPrepositionsGuide(!showPrepositionsGuide)}
              className="text-sm bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-4 py-2 rounded-full transition-colors shadow-md"
            >
              {showPrepositionsGuide ? 'Ocultar Explicação' : '📘 Explicação'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left Column - Address Essentials */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4">
              <h3 className="text-2xl font-bold mb-4">📍 Address Essentials</h3>

              <div className="space-y-3">
                <div>
                  <SpeakSentence text="What's your address?" className="font-bold text-xl text-blue-100">
                    What's your address?
                  </SpeakSentence>
                  <SpeakSentence text="It's 123 Main Street." className="text-lg text-blue-200 block mt-1">
                    – It's 123 Main Street.
                  </SpeakSentence>
                </div>
                <div>
                  <SpeakSentence text="What's your zip code?" className="font-bold text-xl text-blue-100">
                    What's your zip code?
                  </SpeakSentence>
                  <SpeakSentence text="It's 45870." className="text-lg text-blue-200 block mt-1">
                    – It's 45870.
                  </SpeakSentence>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-700">
                <h4 className="font-bold text-lg mb-2">📝 Abbreviations</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p><span className="font-bold">Street</span> = St.</p>
                    <p><span className="font-bold">Avenue</span> = Ave.</p>
                    <p><span className="font-bold">Boulevard</span> = Blvd.</p>
                  </div>
                  <div>
                    <p><span className="font-bold">Road</span> = Rd.</p>
                    <p><span className="font-bold">Lane</span> = Ln.</p>
                    <p><span className="font-bold">Drive</span> = Dr.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Column - Image and dialogue */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center relative">
              <img
                src={cityImage}
                alt="City address"
                className="rounded-full w-44 h-44 object-cover mb-4 shadow-lg border-4 border-blue-200"
              />
              <div className="bg-yellow-200 text-black px-6 py-3 rounded-xl shadow-md text-center max-w-xs">
                <SpeakSentence text="Excuse me, what's the address?" className="text-lg font-medium">
                  Excuse me, what's the address?
                </SpeakSentence>
                <SpeakSentence text="It's 742 Evergreen Ave." className="text-xl font-bold mt-1 block">
                  It's 742 Evergreen Ave.
                </SpeakSentence>
                <p className="text-sm mt-1 italic">Zip code: 90210</p>
              </div>
            </div>

            {/* Right Column - Prepositions */}
            <div className={`flex-1 p-6 space-y-4 transition-all duration-300 ${showPrepositionsGuide ? 'bg-blue-800' : 'bg-blue-900'}`}>
              {showPrepositionsGuide ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4">📍 Prepositions of Place</h3>
                  <div className="space-y-3 text-white">
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                      <div>
                        <p className="font-bold text-lg">ON</p>
                        <p className="text-blue-200">"I live <span className="text-yellow-300 font-bold">on</span> Main Street."</p>
                        <p className="text-sm text-blue-300">Para ruas, avenidas</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                      <div>
                        <p className="font-bold text-lg">AT</p>
                        <p className="text-blue-200">"Meet me <span className="text-yellow-300 font-bold">at</span> 123 Main St."</p>
                        <p className="text-sm text-blue-300">Para endereços completos</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                      <div>
                        <p className="font-bold text-lg">IN</p>
                        <p className="text-blue-200">"She lives <span className="text-yellow-300 font-bold">in</span> Chicago."</p>
                        <p className="text-sm text-blue-300">Para cidades, países</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <span className="bg-yellow-400 text-blue-900 font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">4</span>
                      <div>
                        <p className="font-bold text-lg">NEAR / BY</p>
                        <p className="text-blue-200">"The station is <span className="text-yellow-300 font-bold">near</span> here."</p>
                        <p className="text-sm text-blue-300">Para proximidade</p>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-blue-700">
                      <p className="text-sm text-blue-300 italic">
                        💡 Dica: "I'm <span className="text-yellow-300 font-bold">on</span> the corner <span className="text-yellow-300 font-bold">of</span> 5th Ave <span className="text-yellow-300 font-bold">and</span> Main St."
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xl font-bold text-center mb-2">Clique em "Explicação"</p>
                  <p className="text-blue-200 text-center">Aprenda as preposições ON, AT, IN e muito mais!</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer chips */}
          <div className="bg-gray-50 p-4 border-t border-blue-200">
            <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-700">
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">On</span> the street</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">At</span> the corner</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">In</span> the city</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">Near</span> the station</span>
              <span className="bg-blue-100 px-3 py-1 rounded-full">📍 <span className="font-bold">By</span> the park</span>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 7 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Affirmative, negative, questions and imperative commands" className="mt-2 text-blue-100 italic">
                📝 Affirmative, negative, questions and imperative commands
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-4 text-yellow-300">AFFIRMATIVE SENTENCES</h3>
              </div>
              <div className="space-y-3">
                {[
                  { en: "I drive to work.", pt: "Eu dirijo para o trabalho." },
                  { en: "She walks to school.", pt: "Ela caminha para a escola." },
                  { en: "We take the subway.", pt: "Nós pegamos o metrô." },
                  { en: "He drives a taxi.", pt: "Ele dirige um táxi." },
                  { en: "I like to walk in the park.", pt: "Eu gosto de caminhar no parque." },
                  { en: "She needs to take the bus.", pt: "Ela precisa pegar o ônibus." },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-green-700 rounded-lg">
                    <SpeakSentence text={item.en} className="font-bold text-lg text-green-50">{item.en}</SpeakSentence>
                    <p className="text-green-200 text-sm">{item.pt}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={cityImage}
                    alt="Getting around the city"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🚗 Positive Situations</p>
                    <p className="text-green-200 text-xs">Talking about transport and daily commute</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">NEGATIVE & COMMANDS</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { en: "I don't drive.", pt: "Eu não dirijo." },
                      { en: "She doesn't walk to work.", pt: "Ela não caminha para o trabalho." },
                      { en: "Don't eat here.", pt: "Não coma aqui." },
                      { en: "Don't go downtown now.", pt: "Não vá ao centro da cidade agora." },
                      { en: "Don't buy this ticket.", pt: "Não compre esta passagem." },
                      { en: "Don't clean the kitchen today.", pt: "Não limpe a cozinha hoje." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-red-700 rounded-lg">
                        <SpeakSentence text={item.en} className="font-bold text-lg text-red-50">{item.en}</SpeakSentence>
                        <p className="text-red-200 text-sm">{item.pt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-red-600">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">QUESTIONS & IMPERATIVES</h4>

                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { en: "Do you know how to drive?", pt: "Você sabe dirigir?" },
                      { en: "Does he take the bus?", pt: "Ele pega o ônibus?" },
                      { en: "Get some food.", pt: "Pegue um pouco de comida." },
                      { en: "Send this email to your boss.", pt: "Envie este e-mail para o seu chefe." },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 bg-red-700 rounded-lg">
                        <SpeakSentence text={item.en} className="font-bold text-red-50">{item.en}</SpeakSentence>
                        <p className="text-red-200 text-sm">{item.pt}</p>
                      </div>
                    ))}
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
                      <p className="text-red-200 text-xs">Practice questions and imperative commands</p>
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
            onClick={() => router.push("/cursos/lesson28")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (28)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (30) &rarr;
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