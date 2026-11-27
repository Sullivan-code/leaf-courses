"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Pencil, Check, XCircle, ChevronUp, ChevronDown, ArrowLeft, ArrowRight, X } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkout' | 'fluency' | 'drilling' | 'questions';

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

const sanitizeForSpeech = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/[\p{Extended_Pictographic}]/gu, "")
    .replace(/[\u{FE0F}\u{200D}\u{20E3}]/gu, "")
    .replace(/[·—]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === 'undefined') return;
  const cleanText = sanitizeForSpeech(text);
  if (!cleanText) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2 size={14} className="opacity-40 group-hover:opacity-100 transition-opacity text-yellow-600" />
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
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-500" />
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
    <div className="bg-white p-4 rounded-lg border border-yellow-300 shadow-sm">
      <div className="flex items-start justify-between mb-2">
        <p className="text-yellow-800 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-yellow-50 rounded-md border border-yellow-200">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <span className="text-yellow-700 font-medium flex-shrink-0">🇺🇸</span>
              <SpeakSentence text={currentSentence} className="text-yellow-900 font-bold">
                {currentSentence}
              </SpeakSentence>
            </div>
            {currentPt && (
              <>
                <div className="border-t border-yellow-200 my-1"></div>
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
                ? 'bg-yellow-500 text-white shadow-sm'
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
// WRITTEN EXERCISE COMPONENT (Com Check e Show)
// ============================================
function WrittenExercise({ 
  exercise, 
  borderColor = "red" 
}: { 
  exercise: { key: string, sentence: string, answer: string },
  borderColor?: "red" | "green" | "blue" 
}) {
  const [inputValue, setInputValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleCheck = () => {
    const normalize = (text: string) => text.toLowerCase().trim().replace(/[.,?!]/g, '').replace(/\s+/g, ' ');
    setIsCorrect(normalize(inputValue) === normalize(exercise.answer));
    setShowResult(true);
  };

  const handleShow = () => {
    setInputValue(exercise.answer);
    setShowResult(false);
  };

  const colorMap = {
    red: { bg: "bg-red-50", border: "border-red-300", btn: "bg-red-500", focus: "focus:ring-red-500" },
    green: { bg: "bg-green-50", border: "border-green-300", btn: "bg-green-500", focus: "focus:ring-green-500" },
    blue: { bg: "bg-blue-50", border: "border-blue-300", btn: "bg-blue-500", focus: "focus:ring-blue-500" },
  };
  const colors = colorMap[borderColor];

  return (
    <div className={`bg-white p-4 rounded-lg border ${colors.border} shadow-sm`}>
      <p className="font-medium text-gray-800 mb-2">{exercise.sentence}</p>
      <div className="flex flex-col md:flex-row gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Write your answer..."
          className={`flex-1 px-3 py-2 border ${colors.border} rounded-md text-sm focus:ring-2 ${colors.focus}`}
        />
        <div className="flex gap-2">
          <button
            onClick={handleCheck}
            className={`${colors.btn} text-white px-4 py-2 rounded-md hover:opacity-90 transition text-sm`}
          >
            Check
          </button>
          <button
            onClick={handleShow}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition text-sm"
          >
            Show
          </button>
        </div>
      </div>
      {showResult && (
        <div className={`mt-2 p-2 rounded flex items-center gap-2 ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {isCorrect ? <Check size={16} /> : <XCircle size={16} />}
          <span className="text-sm">
            {isCorrect ? "Correct!" : `Expected: ${exercise.answer}`}
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// MAKE IT YOURS EDITOR MODAL
// ============================================
interface EditorSentence {
  originalText: string;
  translation: string;
}

function MakeItYoursModal({ isOpen, onClose, sentenceData }: { isOpen: boolean; onClose: () => void; sentenceData: EditorSentence | null }) {
  const [userText, setUserText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen && sentenceData) {
      setUserText(sentenceData.originalText);
      setIsSaved(false);
    }
  }, [isOpen, sentenceData]);

  if (!isOpen || !sentenceData) return null;

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[110]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">✏️ Make It Yours</h3>
            <p className="text-sm text-yellow-100 mt-1">Edite a frase abaixo com suas próprias palavras.</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Frase Original:</p>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <SpeakSentence text={sentenceData.originalText} className="text-lg font-medium text-yellow-900">
                {sentenceData.originalText}
              </SpeakSentence>
              <p className="text-sm text-gray-600 mt-1">{sentenceData.translation}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Sua Versão:</p>
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              className="w-full h-24 p-3 border-2 border-yellow-300 rounded-lg focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 resize-none text-lg font-medium text-gray-800"
              placeholder="Digite sua frase aqui..."
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => speakEnglish(userText, 0.85)}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors font-medium text-sm"
            >
              <Volume2 size={16} /> Ouvir Minha Frase
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-white font-medium transition-all ${
                isSaved ? 'bg-green-500' : 'bg-yellow-500 hover:bg-yellow-600'
              }`}
            >
              {isSaved ? <><Check size={18} /> Salvo!</> : 'Salvar'}
            </button>
          </div>
        </div>
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
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-yellow-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full hover:from-orange-500 hover:to-orange-600 transition-all duration-300">
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
      className="ml-3 text-yellow-200 hover:text-white transition-colors focus:outline-none"
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
// FLUENCY MODAL (LIGHTBOX)
// ============================================
const FluencyModal = ({ isOpen, onClose, prompt, imageUrl }: { isOpen: boolean, onClose: () => void, prompt: string, imageUrl: string }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[120]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col md:flex-row">
        
        {/* Imagem Grande */}
        <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100 relative">
          <img src={imageUrl} alt={prompt} className="object-cover w-full h-full absolute inset-0" />
          <div className="absolute top-4 left-4 bg-yellow-500 text-white font-bold px-4 py-2 rounded-full shadow-lg">
            {prompt}
          </div>
        </div>

        {/* Área de Input */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition">
            <X size={28} />
          </button>
          
          <h3 className="text-2xl font-bold text-yellow-800 mb-6">Create your Q&A</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-bold text-yellow-700 mb-2 uppercase tracking-wide">Your Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Write your question..."
              className="w-full px-4 py-3 border-2 border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-lg"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-green-700 mb-2 uppercase tracking-wide">Your Answer</label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Write your answer..."
              className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg"
            />
          </div>

          <div className="flex justify-between items-center mt-4">
             <button
                onClick={() => speakEnglish(`${question}. ${answer}`, 0.85)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors font-medium text-sm"
             >
                <Volume2 size={16} /> Listen
             </button>
             <button
                onClick={onClose}
                className="px-8 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors font-bold shadow-md"
             >
                Done
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT – LESSON 54
// ============================================
export default function Lesson54GoingShopping() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState<Record<SectionKey, boolean>>({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkout: false,
    fluency: true,
    drilling: true,
    questions: true,
  });

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });

  const [editorModal, setEditorModal] = useState<{ isOpen: boolean; data: EditorSentence | null }>({
    isOpen: false,
    data: null,
  });

  // Estado do Modal Fluency
  const [fluencyModal, setFluencyModal] = useState<{ isOpen: boolean; prompt: string; image: string }>({
    isOpen: false,
    prompt: "",
    image: ""
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

  // ========== FLUENCY DATA (Imagens do GitHub) ==========
  // Exemplo Fixo usa a imagem 1
  const exampleFluency = { prompt: "what - to eat", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img1.png" };
  
  // 6 Cards para o aluno (Imagens 2 a 7)
  const fluencyCards = [
    { prompt: "what - to write", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img2.png" },
    { prompt: "what - to make", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img3.png" },
    { prompt: "what - to look for", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img4.png" },
    { prompt: "what - to do", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img5.png" },
    { prompt: "what - to watch", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img6.png" },
    { prompt: "what - to buy", image: "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l54-img7.png" },
  ];

  // ========== DRILLING DATA (B1 com Passado) ==========
  const subPractice1 = [
    {
      original: "He wears formal clothes for work. / casual / a suit",
      options: [
        { label: "formal clothes", replacement: "He usually wears formal clothes for work, but yesterday he wore casual clothes.", pt: "Ele geralmente usa roupas formais para o trabalho, mas ontem ele usou roupas casuais." },
        { label: "casual clothes", replacement: "He usually wears casual clothes for work, but he wore a suit for the meeting yesterday.", pt: "Ele geralmente usa roupas casuais para o trabalho, mas ele usou um terno para a reunião ontem." },
        { label: "a suit", replacement: "He usually wears a suit for work, but he found it uncomfortable last week.", pt: "Ele geralmente usa um terno para o trabalho, mas ele achou desconfortável na semana passada." },
      ],
      currentIndex: 0,
    },
    {
      original: "Her shoes are under the bed. / the table / the coffee table",
      options: [
        { label: "under the bed", replacement: "Her shoes are under the bed, but they were in the closet yesterday.", pt: "Os sapatos dela estão debaixo da cama, mas eles estavam no armário ontem." },
        { label: "under the table", replacement: "Her shoes are under the table, but they were in the wardrobe yesterday.", pt: "Os sapatos dela estão debaixo da mesa, mas eles estavam no guarda-roupa ontem." },
        { label: "under the coffee table", replacement: "Her shoes are under the coffee table, but they were in the dresser yesterday.", pt: "Os sapatos dela estão debaixo da mesa de centro, mas eles estavam na cômoda ontem." },
      ],
      currentIndex: 0,
    },
    {
      original: "Please do me a favor and call the salesperson. / the attendant / the manager",
      options: [
        { label: "the salesperson", replacement: "Please do me a favor and call the salesperson; I needed help yesterday too.", pt: "Por favor, me faça um favor e chame o vendedor; eu precisei de ajuda ontem também." },
        { label: "the attendant", replacement: "Please do me a favor and call the attendant; I needed help yesterday too.", pt: "Por favor, me faça um favor e chame o atendente; eu precisei de ajuda ontem também." },
        { label: "the manager", replacement: "Please do me a favor and call the manager; I needed help yesterday too.", pt: "Por favor, me faça um favor e chame o gerente; eu precisei de ajuda ontem também." },
      ],
      currentIndex: 0,
    },
    {
      original: "I put my clothes in the closet. / bags / shoes",
      options: [
        { label: "clothes", replacement: "I put my clothes in the closet, but I put my bags in the wardrobe last week.", pt: "Eu coloco minhas roupas no armário, mas eu coloquei minhas bolsas no guarda-roupa na semana passada." },
        { label: "bags", replacement: "I put my bags in the closet, but I put my clothes in the wardrobe last week.", pt: "Eu coloco minhas bolsas no armário, mas eu coloquei minhas roupas no guarda-roupa na semana passada." },
        { label: "shoes", replacement: "I put my shoes in the closet, but I put my bags in the wardrobe last week.", pt: "Eu coloco meus sapatos no armário, mas eu coloquei minhas bolsas no guarda-roupa na semana passada." },
      ],
      currentIndex: 0,
    },
    {
      original: "She has ten minutes to get dressed. / fifteen / five",
      options: [
        { label: "ten", replacement: "She has ten minutes to get dressed, but she had fifteen minutes yesterday.", pt: "Ela tem dez minutos para se arrumar, mas ela teve quinze minutos ontem." },
        { label: "fifteen", replacement: "She has fifteen minutes to get dressed, but she had ten minutes yesterday.", pt: "Ela tem quinze minutos para se arrumar, mas ela teve dez minutos ontem." },
        { label: "five", replacement: "She has five minutes to get dressed, but she had ten minutes yesterday.", pt: "Ela tem cinco minutos para se arrumar, mas ela teve dez minutos ontem." },
      ],
      currentIndex: 0,
    },
  ];

  const negativeExercises = [
    { key: "neg-1", sentence: "He's making a cheese and ham sandwich right now.", answer: "He isn't making a cheese and ham sandwich right now." },
    { key: "neg-2", sentence: "You're doing a lot of things this week.", answer: "You aren't doing a lot of things this week." },
    { key: "neg-3", sentence: "He's calling the doctor at the moment.", answer: "He isn't calling the doctor at the moment." },
    { key: "neg-4", sentence: "We're talking about fashion and trends.", answer: "We aren't talking about fashion and trends." },
    { key: "neg-5", sentence: "She's taking the subway to work today.", answer: "She isn't taking the subway to work today." },
    { key: "neg-6", sentence: "They're writing a new report for the manager.", answer: "They aren't writing a new report for the manager." },
    { key: "neg-7", sentence: "I saw her at the mall yesterday.", answer: "I didn't see her at the mall yesterday." },
    { key: "neg-8", sentence: "He bought a new pair of shoes last week.", answer: "He didn't buy a new pair of shoes last week." },
  ];

  const subPractice2 = [
    {
      original: "My wallet is in the drawer. / wardrobe / dresser",
      options: [
        { label: "drawer", replacement: "My wallet is in the drawer next to my bed, but I lost it yesterday.", pt: "Minha carteira está na gaveta ao lado da minha cama, mas eu a perdi ontem." },
        { label: "wardrobe", replacement: "My wallet is in the wardrobe with my clothes, but I lost it yesterday.", pt: "Minha carteira está no guarda-roupa com minhas roupas, mas eu a perdi ontem." },
        { label: "dresser", replacement: "My wallet is in the dresser in the bedroom, but I lost it yesterday.", pt: "Minha carteira está na cômoda no quarto, mas eu a perdi ontem." },
      ],
      currentIndex: 0,
    },
    {
      original: "Put the books on the table. / magazines / novels",
      options: [
        { label: "books", replacement: "Put the books on the table, please. I put them there yesterday too.", pt: "Coloque os livros na mesa, por favor. Eu os coloquei lá ontem também." },
        { label: "magazines", replacement: "Put the magazines on the table, please. I put them there yesterday too.", pt: "Coloque as revistas na mesa, por favor. Eu as coloquei lá ontem também." },
        { label: "novels", replacement: "Put the novels on the table, please. I put them there yesterday too.", pt: "Coloque os romances na mesa, por favor. Eu os coloquei lá ontem também." },
      ],
      currentIndex: 0,
    },
    {
      original: "He wants to read the new book. / watch the new film / use this outfit",
      options: [
        { label: "read the new book", replacement: "He wants to read the new book, but he had a lot on his plate last week.", pt: "Ele quer ler o novo livro, mas ele tinha muito o que fazer na semana passada." },
        { label: "watch the new film", replacement: "He wants to watch the new film, but he had a lot on his plate last week.", pt: "Ele quer assistir ao novo filme, mas ele tinha muito o que fazer na semana passada." },
        { label: "use this outfit", replacement: "He wants to use this outfit, but he had a lot on his plate last week.", pt: "Ele quer usar este look, mas ele tinha muito o que fazer na semana passada." },
      ],
      currentIndex: 0,
    },
    {
      original: "What are you doing now? / studying / reading",
      options: [
        { label: "doing", replacement: "What are you doing now? I need some help with the shopping.", pt: "O que você está fazendo agora? Eu preciso de ajuda com as compras." },
        { label: "studying", replacement: "What are you studying now? I need some help with the shopping.", pt: "O que você está estudando agora? Eu preciso de ajuda com as compras." },
        { label: "reading", replacement: "What are you reading now? I need some help with the shopping.", pt: "O que você está lendo agora? Eu preciso de ajuda com as compras." },
      ],
      currentIndex: 0,
    },
    {
      original: "How many items are you taking? / buying / selling",
      options: [
        { label: "taking", replacement: "How many items are you taking to the cashier? I took five yesterday.", pt: "Quantos itens você está levando para o caixa? Eu levei cinco ontem." },
        { label: "buying", replacement: "How many items are you buying at the store? I bought five yesterday.", pt: "Quantos itens você está comprando na loja? Eu comprei cinco ontem." },
        { label: "selling", replacement: "How many items are you selling at the garage sale? I sold five yesterday.", pt: "Quantos itens você está vendendo na venda de garagem? Eu vendi cinco ontem." },
      ],
      currentIndex: 0,
    },
  ];

  const affirmativeExercises = [
    { key: "aff-1", sentence: "She isn't finishing her homework right now.", answer: "She is finishing her homework right now." },
    { key: "aff-2", sentence: "They aren't talking to the dentist.", answer: "They are talking to the dentist." },
    { key: "aff-3", sentence: "Her mother isn't waiting for you at the mall.", answer: "Her mother is waiting for you at the mall." },
    { key: "aff-4", sentence: "They aren't giving me any money for the trip.", answer: "They are giving me some money for the trip." },
    { key: "aff-5", sentence: "My boss isn't looking for the attendant.", answer: "My boss is looking for the attendant." },
    { key: "aff-6", sentence: "They aren't working at the office today.", answer: "They are working at the office today." },
    { key: "aff-7", sentence: "He didn't buy a new jacket yesterday.", answer: "He bought a new jacket yesterday." },
    { key: "aff-8", sentence: "We weren't at the mall last weekend.", answer: "We were at the mall last weekend." },
  ];

  const interrogativeExercises = [
    { key: "int-1", sentence: "You are calling your friends.", answer: "Are you calling your friends?" },
    { key: "int-2", sentence: "He is paying by credit card.", answer: "Is he paying by credit card?" },
    { key: "int-3", sentence: "She is taking the children to school.", answer: "Is she taking the children to school?" },
    { key: "int-4", sentence: "They are watching TV series.", answer: "Are they watching TV series?" },
    { key: "int-5", sentence: "They are visiting their grandparents.", answer: "Are they visiting their grandparents?" },
    { key: "int-6", sentence: "He is putting on his favorite shoes.", answer: "Is he putting on his favorite shoes?" },
    { key: "int-7", sentence: "She bought that dress last week.", answer: "Did she buy that dress last week?" },
    { key: "int-8", sentence: "They went shopping yesterday.", answer: "Did they go shopping yesterday?" },
  ];

  const questionsList = [
    "What are you wearing today? Are you wearing something comfortable for shopping?",
    "Is your teacher wearing something casual or formal today?",
    "Do you usually wear casual or formal clothes when you go to work or school?",
    "What kind of outfit do you like to wear when you go out with your friends?",
    "Do you prefer to wear tight or loose clothes when you go shopping? Why?",
    "What do you have to do after this class? Do you have a lot on your plate?",
    "How much time do you usually need to get dressed for a special occasion?",
    "Where do you usually put your clothes and accessories when you get home?",
    "Where is your English book right now? Is it on the shelf or in your bag?",
    "What are your classmates doing right now? Are they paying attention?",
  ];

  const openEditor = (data: EditorSentence) => {
    setEditorModal({ isOpen: true, data });
  };

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
      <div className="max-w-5xl mx-auto bg-yellow-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-yellow-200">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-yellow-900 mb-6 flex justify-center items-center gap-3">
            🛍️ Lesson 54 - Going Shopping
          </h1>
          <SpeakSentence text="Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect, and Past." className="text-xl text-yellow-800 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect, and Past.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg border-4 border-yellow-300">
            <img src={mainImage} alt="People shopping" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* ===================== SECTION 1 – FLUENCY ===================== */}
        <div className="bg-white border-2 border-yellow-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-yellow-900">🔹 FLUENCY</h2>
              <PencilIcon onClick={() => openNoteModal('Fluency')} />
            </div>
            <button
              onClick={() => toggleDrill('fluency')}
              className="inline-block rounded-full bg-white text-yellow-700 px-8 py-3 text-sm font-bold transition-all duration-300 hover:bg-yellow-100"
            >
              {openDrills.fluency ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            <p className="text-yellow-800 mb-6 font-medium italic text-center">
              🎯 Click on a card to expand it and write your own questions and answers following the example.
            </p>

            {openDrills.fluency && (
              <div className="mt-4">
                
                {/* EXEMPLO FIXO */}
                <div className="bg-yellow-100 p-6 rounded-xl border-2 border-yellow-300 mb-8 max-w-2xl mx-auto shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-yellow-500 text-white font-bold px-3 py-1 rounded-full text-sm">Exemplo</span>
                    <span className="font-mono text-yellow-800 font-bold">{exampleFluency.prompt}</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-full md:w-1/3 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <img src={exampleFluency.image} alt={exampleFluency.prompt} className="object-cover w-full h-full" />
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="mb-2">
                        <p className="text-xs font-bold text-yellow-700 mb-1">QUESTION:</p>
                        <p className="text-lg font-semibold text-gray-800 bg-white p-2 rounded border border-yellow-200">
                          What is she eating?
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-green-700 mb-1">ANSWER:</p>
                        <p className="text-lg font-semibold text-gray-800 bg-white p-2 rounded border border-green-200">
                          She is eating a sandwich.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6 CARDS PARA O ALUNO (Clique para abrir modal) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fluencyCards.map((card, index) => (
                    <div 
                      key={index} 
                      onClick={() => setFluencyModal({ isOpen: true, prompt: card.prompt, image: card.image })}
                      className="bg-white rounded-xl shadow-md border border-yellow-300 overflow-hidden flex flex-col cursor-pointer hover:shadow-xl hover:border-yellow-500 transition-all group"
                    >
                      <div className="relative h-48 w-full bg-gray-100">
                        <img src={card.image} alt={card.prompt} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                          {card.prompt}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex items-center justify-center bg-yellow-50 text-yellow-700 font-medium text-sm">
                        Click to write Q&A
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2 – DRILLING PRACTICE ===================== */}
        <div className="bg-white border-2 border-yellow-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-yellow-900">🔹 DRILLING PRACTICE</h2>
              <PencilIcon onClick={() => openNoteModal('Drilling Practice')} />
            </div>
            <button
              onClick={() => toggleDrill('drilling')}
              className="inline-block rounded-full bg-white text-yellow-700 px-8 py-3 text-sm font-bold transition-all duration-300 hover:bg-yellow-100"
            >
              {openDrills.drilling ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8 space-y-8">
            {openDrills.drilling && (
              <>
                {/* SUBSTITUTION PRACTICE 1 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 bg-yellow-100 p-2 rounded inline-block">Substitution Practice I</h3>
                  <div className="space-y-4">
                    {subPractice1.map((ex, i) => (
                      <SubstitutionOptions key={`sp1-${i}`} exercise={{ ...ex, key: `sp1-${i}` }} onOptionClick={handleOptionClick} />
                    ))}
                  </div>
                </div>

                {/* CHANGE INTO NEGATIVE */}
                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-4 bg-red-50 p-2 rounded inline-block">Change into Negative</h3>
                  <div className="space-y-4">
                    {negativeExercises.map((ex) => (
                      <WrittenExercise key={ex.key} exercise={ex} borderColor="red" />
                    ))}
                  </div>
                </div>

                {/* SUBSTITUTION PRACTICE 2 */}
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4 bg-yellow-100 p-2 rounded inline-block">Substitution Practice II</h3>
                  <div className="space-y-4">
                    {subPractice2.map((ex, i) => (
                      <SubstitutionOptions key={`sp2-${i}`} exercise={{ ...ex, key: `sp2-${i}` }} onOptionClick={handleOptionClick} />
                    ))}
                  </div>
                </div>

                {/* CHANGE INTO AFFIRMATIVE */}
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-4 bg-green-50 p-2 rounded inline-block">Change into Affirmative</h3>
                  <div className="space-y-4">
                    {affirmativeExercises.map((ex) => (
                      <WrittenExercise key={ex.key} exercise={ex} borderColor="green" />
                    ))}
                  </div>
                </div>

                {/* CHANGE INTO INTERROGATIVE */}
                <div>
                  <h3 className="text-xl font-bold text-blue-600 mb-4 bg-blue-50 p-2 rounded inline-block">Change into Interrogative</h3>
                  <div className="space-y-4">
                    {interrogativeExercises.map((ex) => (
                      <WrittenExercise key={ex.key} exercise={ex} borderColor="blue" />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ===================== SECTION 3 – QUESTIONS ===================== */}
        <div className="bg-white border-2 border-yellow-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-yellow-900">🔹 QUESTIONS</h2>
              <PencilIcon onClick={() => openNoteModal('Questions')} />
            </div>
            <button
              onClick={() => toggleDrill('questions')}
              className="inline-block rounded-full bg-white text-yellow-700 px-8 py-3 text-sm font-bold transition-all duration-300 hover:bg-yellow-100"
            >
              {openDrills.questions ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>

          <div className="p-8">
            {openDrills.questions && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {questionsList.map((q, idx) => (
                  <div key={idx} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex items-start gap-3">
                     <span className="text-yellow-600 font-bold">{String.fromCharCode(97 + idx)})</span>
                     <SpeakSentence text={q} className="text-gray-800 font-medium">{q}</SpeakSentence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson53")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (53)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson55")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (55) &rarr;
          </button>
        </div>
      </div>

      {/* Fluency Modal */}
      <FluencyModal 
        isOpen={fluencyModal.isOpen} 
        onClose={() => setFluencyModal(prev => ({ ...prev, isOpen: false }))} 
        prompt={fluencyModal.prompt} 
        imageUrl={fluencyModal.image} 
      />

      {/* Floating Pencil Button */}
      <button
        onClick={() => openNoteModal('Anotações Globais')}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group"
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
    </div>
  );
}