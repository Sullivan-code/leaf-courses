"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Pencil, Check } from "lucide-react";

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
      <Volume2 size={14} className="opacity-40 group-hover:opacity-100 transition-opacity text-blue-500" />
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
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">✏️ Make It Yours</h3>
            <p className="text-sm text-blue-100 mt-1">Edite a frase abaixo com suas próprias palavras.</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl font-bold">&times;</button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-gray-500 mb-1">Frase Original:</p>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <SpeakSentence text={sentenceData.originalText} className="text-lg font-medium text-blue-800">
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
              className="w-full h-24 p-3 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-lg font-medium text-gray-800"
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
                isSaved ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">
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
// MAIN COMPONENT – LESSON 53
// ============================================
export default function Lesson53GoingShopping() {
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

  const [editorModal, setEditorModal] = useState<{ isOpen: boolean; data: EditorSentence | null }>({
    isOpen: false,
    data: null,
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

  // ========== LESSON 53 DATA ==========
  const verbs = [
    {
      label: "to put, put",
      forms: [
        { en: "to put", pt: "pôr, colocar", tense: "Present / Infinitive" },
        { en: "put",    pt: "colocou", tense: "Past" },
      ],
    },
    {
      label: "to do, did, done",
      forms: [
        { en: "to do", pt: "fazer", tense: "Present / Infinitive" },
        { en: "did",   pt: "fez", tense: "Past" },
      ],
    },
  ];

  const newWords = [
    { english: "closet", portuguese: "armário" },
    { english: "wardrobe", portuguese: "guarda-roupa" },
    { english: "dresser", portuguese: "cômoda" },
    { english: "drawer", portuguese: "gaveta" },
    { english: "shelf", portuguese: "prateleira" },
    { english: "coffee table", portuguese: "mesa de centro" },
    { english: "favor", portuguese: "favor" },
    { english: "formal", portuguese: "formal" },
    { english: "casual", portuguese: "casual" },
    { english: "loose", portuguese: "frouxo(a)" },
    { english: "tight", portuguese: "apertado(a)" },
    { english: "on", portuguese: "em cima" },
    { english: "under", portuguese: "sob, debaixo" },
    { english: "between", portuguese: "entre" },
    { english: "again", portuguese: "novamente" },
  ];

  // ===== GRAMMAR EXAMPLES – Incluindo Interrogativas e Key Verbs =====
  const grammarExamples = [
    { english: "Was she working today?", portuguese: "Ela estava trabalhando hoje?" },
    { english: "Is he going to that new outlet mall now?", portuguese: "Ele está indo àquele novo outlet agora?" },
    { english: "Is she looking for a casual outfit?", portuguese: "Ela está procurando um look casual?" },
    { english: "Are you trying on the dress again?", portuguese: "Você está provando o vestido novamente?" },
    { english: "I couldn't afford that formal suit last year.", portuguese: "Eu não tínhamos condições de pagar aquele terno formal ano passado." },
    { english: "She afforded the casual dress yesterday.", portuguese: "Ela teve condições de pagar o vestido casual ontem." },
    { english: "We postponed the trip to the mall.", portuguese: "Nós adiamos a viagem ao shopping." },
    { english: "I have postponed my shopping trip twice.", portuguese: "Eu adiei minha ida às compras duas vezes." },
    { english: "The postponement of the sale was a surprise.", portuguese: "O adiamento da liquidação foi uma surpresa." },
    { english: "Although it was raining, we went shopping.", portuguese: "Embora estivesse chovendo, nós fomos às compras." },
    { english: "Even though the store was crowded, we found a nice dress.", portuguese: "Mesmo que a loja estivesse lotada, encontramos um vestido bonito." },
    { english: "They bought a new coffee table yesterday.", portuguese: "Eles compraram uma mesa de centro nova ontem." },
  ];

  // ========== VERBS SUBSTITUTION (MISTO) ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1-present",
      original: "I put my clothes in the closet. / We put / They put",
      options: [
        { label: "I put", replacement: "I put my clothes in the closet.", pt: "Eu coloco minhas roupas no armário." },
        { label: "We put", replacement: "We put our clothes in the closet.", pt: "Nós colocamos nossas roupas no armário." },
        { label: "They put", replacement: "They put their clothes in the closet.", pt: "Eles colocam as roupas deles no armário." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2-past",
      original: "I didn't do my shopping yesterday. / He didn't / She didn't",
      options: [
        { label: "I didn't", replacement: "I didn't do my shopping yesterday.", pt: "Eu não fiz minhas compras ontem." },
        { label: "He didn't", replacement: "He didn't do his shopping yesterday.", pt: "Ele não fez as compras dele ontem." },
        { label: "She didn't", replacement: "She didn't do her shopping yesterday.", pt: "Ela não fez as compras dela ontem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3-present",
      original: "She doesn't put the shoes on the shelf. / He doesn't / It doesn't",
      options: [
        { label: "She doesn't", replacement: "She doesn't put the shoes on the shelf.", pt: "Ela não coloca os sapatos na prateleira." },
        { label: "He doesn't", replacement: "He doesn't put the shoes on the shelf.", pt: "Ele não coloca os sapatos na prateleira." },
        { label: "It doesn't", replacement: "It doesn't put the shoes on the shelf.", pt: "Isso não coloca os sapatos na prateleira." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4-past",
      original: "I did the shopping last week. / He did / We did",
      options: [
        { label: "I did", replacement: "I did the shopping last week.", pt: "Eu fiz as compras na semana passada." },
        { label: "He did", replacement: "He did the shopping last week.", pt: "Ele fez as compras na semana passada." },
        { label: "We did", replacement: "We did the shopping last week.", pt: "Nós fizemos as compras na semana passada." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5-present",
      original: "Where do you put your wallet? / purse / keys",
      options: [
        { label: "wallet", replacement: "Where do you put your wallet?", pt: "Onde você coloca sua carteira?" },
        { label: "purse", replacement: "Where do you put your purse?", pt: "Onde você coloca sua bolsa?" },
        { label: "keys", replacement: "Where do you put your keys?", pt: "Onde você coloca suas chaves?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6-past",
      original: "I couldn't afford that dress. / He couldn't / She couldn't",
      options: [
        { label: "I couldn't", replacement: "I couldn't afford that dress.", pt: "Eu não podia pagar aquele vestido." },
        { label: "He couldn't", replacement: "He couldn't afford that dress.", pt: "Ele não podia pagar aquele vestido." },
        { label: "She couldn't", replacement: "She couldn't afford that dress.", pt: "Ela não podia pagar aquele vestido." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7-present",
      original: "I can't afford this jacket. / He can't / She can't",
      options: [
        { label: "I can't", replacement: "I can't afford this jacket.", pt: "Eu não posso pagar esta jaqueta." },
        { label: "He can't", replacement: "He can't afford this jacket.", pt: "Ele não pode pagar esta jaqueta." },
        { label: "She can't", replacement: "She can't afford this jacket.", pt: "Ela não pode pagar esta jaqueta." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8-past",
      original: "We postponed the trip to the mall. / They postponed / I postponed",
      options: [
        { label: "We postponed", replacement: "We postponed the trip to the mall.", pt: "Nós adiamos a viagem ao shopping." },
        { label: "They postponed", replacement: "They postponed the trip to the mall.", pt: "Eles adiaram a viagem ao shopping." },
        { label: "I postponed", replacement: "I postponed the trip to the mall.", pt: "Eu adiei a viagem ao shopping." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9-present",
      original: "Do you do your shopping on weekends? / every day / on Fridays",
      options: [
        { label: "on weekends", replacement: "Do you do your shopping on weekends?", pt: "Você faz suas compras nos fins de semana?" },
        { label: "every day", replacement: "Do you do your shopping every day?", pt: "Você faz suas compras todos os dias?" },
        { label: "on Fridays", replacement: "Do you do your shopping on Fridays?", pt: "Você faz suas compras nas sextas?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION (MISTO) ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1-present",
      original: "The closet is between the bed and the door. / the dresser / the window",
      options: [
        { label: "the bed", replacement: "The closet is between the bed and the door.", pt: "O armário está entre a cama e a porta." },
        { label: "the dresser", replacement: "The closet is between the dresser and the door.", pt: "O armário está entre a cômoda e a porta." },
        { label: "the window", replacement: "The closet is between the window and the door.", pt: "O armário está entre a janela e a porta." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2-past",
      original: "I put the coffee table under the window yesterday. / on the floor / near the sofa",
      options: [
        { label: "under the window", replacement: "I put the coffee table under the window yesterday.", pt: "Eu coloquei a mesa de centro debaixo da janela ontem." },
        { label: "on the floor", replacement: "I put the coffee table on the floor yesterday.", pt: "Eu coloquei a mesa de centro no chão ontem." },
        { label: "near the sofa", replacement: "I put the coffee table near the sofa yesterday.", pt: "Eu coloquei a mesa de centro perto do sofá ontem." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3-present",
      original: "He wears casual clothes on Fridays. / formal clothes / loose clothes",
      options: [
        { label: "casual clothes", replacement: "He wears casual clothes on Fridays.", pt: "Ele usa roupas casuais nas sextas." },
        { label: "formal clothes", replacement: "He wears formal clothes on Fridays.", pt: "Ele usa roupas formais nas sextas." },
        { label: "loose clothes", replacement: "He wears loose clothes on Fridays.", pt: "Ele usa roupas frouxas nas sextas." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4-past",
      original: "She wore a tight dress to the party. / a loose dress / a formal suit",
      options: [
        { label: "a tight dress", replacement: "She wore a tight dress to the party.", pt: "Ela usou um vestido apertado para a festa." },
        { label: "a loose dress", replacement: "She wore a loose dress to the party.", pt: "Ela usou um vestido frouxo para a festa." },
        { label: "a formal suit", replacement: "She wore a formal suit to the party.", pt: "Ela usou um terno formal para a festa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5-present",
      original: "Please put the shoes on the shelf. / in the drawer / under the bed",
      options: [
        { label: "on the shelf", replacement: "Please put the shoes on the shelf.", pt: "Por favor, coloque os sapatos na prateleira." },
        { label: "in the drawer", replacement: "Please put the shoes in the drawer.", pt: "Por favor, coloque os sapatos na gaveta." },
        { label: "under the bed", replacement: "Please put the shoes under the bed.", pt: "Por favor, coloque os sapatos debaixo da cama." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6-past",
      original: "I bought a new wardrobe last month. / a new dresser / a new shelf",
      options: [
        { label: "a new wardrobe", replacement: "I bought a new wardrobe last month.", pt: "Eu comprei um guarda-roupa novo no mês passado." },
        { label: "a new dresser", replacement: "I bought a new dresser last month.", pt: "Eu comprei uma cômoda nova no mês passado." },
        { label: "a new shelf", replacement: "I bought a new shelf last month.", pt: "Eu comprei uma prateleira nova no mês passado." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7-present",
      original: "Could you do me a favor? / open the closet / bring the dress",
      options: [
        { label: "a favor", replacement: "Could you do me a favor?", pt: "Você poderia me fazer um favor?" },
        { label: "open the closet", replacement: "Could you open the closet?", pt: "Você poderia abrir o armário?" },
        { label: "bring the dress", replacement: "Could you bring the dress?", pt: "Você poderia trazer o vestido?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8-past",
      original: "I did not put the drawer under the table. / the shelf / the coffee table",
      options: [
        { label: "the drawer", replacement: "I did not put the drawer under the table.", pt: "Eu não coloquei a gaveta debaixo da mesa." },
        { label: "the shelf", replacement: "I did not put the shelf under the table.", pt: "Eu não coloquei a prateleira debaixo da mesa." },
        { label: "the coffee table", replacement: "I did not put the coffee table under the table.", pt: "Eu não coloquei a mesa de centro debaixo da mesa." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION (MISTO) ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1-present",
      original: "Put on your shoes now. / your jacket / your coat",
      options: [
        { label: "your shoes", replacement: "Put on your shoes now.", pt: "Coloque seus sapatos agora." },
        { label: "your jacket", replacement: "Put on your jacket now.", pt: "Coloque sua jaqueta agora." },
        { label: "your coat", replacement: "Put on your coat now.", pt: "Coloque seu casaco agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2-past",
      original: "I put on my shoes five minutes ago. / my jacket / my coat",
      options: [
        { label: "my shoes", replacement: "I put on my shoes five minutes ago.", pt: "Eu coloquei meus sapatos cinco minutos atrás." },
        { label: "my jacket", replacement: "I put on my jacket five minutes ago.", pt: "Eu coloquei minha jaqueta cinco minutos atrás." },
        { label: "my coat", replacement: "I put on my coat five minutes ago.", pt: "Eu coloquei meu casaco cinco minutos atrás." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3-present",
      original: "You have five minutes to get dressed. / to get ready / to finish",
      options: [
        { label: "to get dressed", replacement: "You have five minutes to get dressed.", pt: "Você tem cinco minutos para se arrumar." },
        { label: "to get ready", replacement: "You have five minutes to get ready.", pt: "Você tem cinco minutos para se preparar." },
        { label: "to finish", replacement: "You have five minutes to finish.", pt: "Você tem cinco minutos para terminar." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4-past",
      original: "I had five minutes to get dressed. / to get ready / to finish",
      options: [
        { label: "to get dressed", replacement: "I had five minutes to get dressed.", pt: "Eu tive cinco minutos para me arrumar." },
        { label: "to get ready", replacement: "I had five minutes to get ready.", pt: "Eu tive cinco minutos para me preparar." },
        { label: "to finish", replacement: "I had five minutes to finish.", pt: "Eu tive cinco minutos para terminar." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5-present",
      original: "I have a lot on my plate today. / this week / this month",
      options: [
        { label: "today", replacement: "I have a lot on my plate today.", pt: "Eu tenho muito o que fazer hoje." },
        { label: "this week", replacement: "I have a lot on my plate this week.", pt: "Eu tenho muito o que fazer esta semana." },
        { label: "this month", replacement: "I have a lot on my plate this month.", pt: "Eu tenho muito o que fazer este mês." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6-past",
      original: "I had a lot on my plate last week. / yesterday / last month",
      options: [
        { label: "last week", replacement: "I had a lot on my plate last week.", pt: "Eu tive muito o que fazer na semana passada." },
        { label: "yesterday", replacement: "I had a lot on my plate yesterday.", pt: "Eu tive muito o que fazer ontem." },
        { label: "last month", replacement: "I had a lot on my plate last month.", pt: "Eu tive muito o que fazer no mês passado." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7-present",
      original: "Though it's raining, I'm going shopping. / cold / late",
      options: [
        { label: "raining", replacement: "Though it's raining, I'm going shopping.", pt: "Embora esteja chovendo, eu vou às compras." },
        { label: "cold", replacement: "Though it's cold, I'm going shopping.", pt: "Embora esteja frio, eu vou às compras." },
        { label: "late", replacement: "Though it's late, I'm going shopping.", pt: "Embora seja tarde, eu vou às compras." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8-past",
      original: "Besides the dress, I bought a pair of shoes. / a bag / a jacket",
      options: [
        { label: "a pair of shoes", replacement: "Besides the dress, I bought a pair of shoes.", pt: "Além do vestido, eu comprei um par de sapatos." },
        { label: "a bag", replacement: "Besides the dress, I bought a bag.", pt: "Além do vestido, eu comprei uma bolsa." },
        { label: "a jacket", replacement: "Besides the dress, I bought a jacket.", pt: "Além do vestido, eu comprei uma jaqueta." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION (MISTO) ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1-present-continuous",
      original: "Are you trying on the dress again? / the shirt / the shoes",
      options: [
        { label: "the dress", replacement: "Are you trying on the dress again?", pt: "Você está provando o vestido novamente?" },
        { label: "the shirt", replacement: "Are you trying on the shirt again?", pt: "Você está provando a camisa novamente?" },
        { label: "the shoes", replacement: "Are you trying on the shoes again?", pt: "Você está provando os sapatos novamente?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2-past-simple",
      original: "She worked at the store yesterday. / last week / this morning",
      options: [
        { label: "yesterday", replacement: "She worked at the store yesterday.", pt: "Ela trabalhou na loja ontem." },
        { label: "last week", replacement: "She worked at the store last week.", pt: "Ela trabalhou na loja na semana passada." },
        { label: "this morning", replacement: "She worked at the store this morning.", pt: "Ela trabalhou na loja esta manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3-present-perfect",
      original: "I have already put my clothes in the closet. / in the wardrobe / on the shelf",
      options: [
        { label: "in the closet", replacement: "I have already put my clothes in the closet.", pt: "Eu já coloquei minhas roupas no armário." },
        { label: "in the wardrobe", replacement: "I have already put my clothes in the wardrobe.", pt: "Eu já coloquei minhas roupas no guarda-roupa." },
        { label: "on the shelf", replacement: "I have already put my clothes on the shelf.", pt: "Eu já coloquei minhas roupas na prateleira." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4-present-continuous",
      original: "Is he going to that new outlet mall now? / shopping / to the department store",
      options: [
        { label: "to that new outlet mall", replacement: "Is he going to that new outlet mall now?", pt: "Ele está indo àquele novo outlet agora?" },
        { label: "shopping", replacement: "Is he going shopping now?", pt: "Ele está indo às compras agora?" },
        { label: "to the department store", replacement: "Is he going to the department store now?", pt: "Ele está indo à loja de departamento agora?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5-past-simple",
      original: "I couldn't afford the formal suit. / the casual dress / the tight jeans",
      options: [
        { label: "the formal suit", replacement: "I couldn't afford the formal suit.", pt: "Eu não podia pagar o terno formal." },
        { label: "the casual dress", replacement: "I couldn't afford the casual dress.", pt: "Eu não podia pagar o vestido casual." },
        { label: "the tight jeans", replacement: "I couldn't afford the tight jeans.", pt: "Eu não podia pagar o jeans apertado." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6-although",
      original: "Although it was raining, we went shopping. / cold / late",
      options: [
        { label: "raining", replacement: "Although it was raining, we went shopping.", pt: "Embora estivesse chovendo, nós fomos às compras." },
        { label: "cold", replacement: "Although it was cold, we went shopping.", pt: "Embora estivesse frio, nós fomos às compras." },
        { label: "late", replacement: "Although it was late, we went shopping.", pt: "Embora fosse tarde, nós fomos às compras." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7-even-though",
      original: "Even though the store was crowded, we found a nice dress. / busy / full",
      options: [
        { label: "crowded", replacement: "Even though the store was crowded, we found a nice dress.", pt: "Mesmo que a loja estivesse lotada, encontramos um vestido bonito." },
        { label: "busy", replacement: "Even though the store was busy, we found a nice dress.", pt: "Mesmo que a loja estivesse movimentada, encontramos um vestido bonito." },
        { label: "full", replacement: "Even though the store was full, we found a nice dress.", pt: "Mesmo que a loja estivesse cheia, encontramos um vestido bonito." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8-present-perfect",
      original: "I have postponed my shopping trip twice. / three times / for a week",
      options: [
        { label: "twice", replacement: "I have postponed my shopping trip twice.", pt: "Eu adiei minha ida às compras duas vezes." },
        { label: "three times", replacement: "I have postponed my shopping trip three times.", pt: "Eu adiei minha ida às compras três vezes." },
        { label: "for a week", replacement: "I have postponed my shopping trip for a week.", pt: "Eu adiei minha ida às compras por uma semana." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== MAKE IT YOURS (REAL LIFE) DATA ==========
  // Agora sem as opções, apenas a frase e a tradução
  const makeItYoursData = [
    { originalText: "I think your purse is under your bed.", translation: "Eu acho que sua bolsa está debaixo da cama." },
    { originalText: "I always put my socks in the drawer.", translation: "Eu sempre coloco minhas meias na gaveta." },
    { originalText: "Your watch is on the coffee table.", translation: "Seu relógio está em cima da mesa de centro." },
    { originalText: "Where do you usually put your stuff?", translation: "Onde você geralmente coloca suas coisas?" },
    { originalText: "She puts her dresses in the closet.", translation: "Ela coloca os vestidos dela no armário." },
    { originalText: "Are you doing your homework now?", translation: "Você está fazendo sua lição de casa agora?" },
    { originalText: "Is she having dinner now?", translation: "Ela está jantando agora?" },
    { originalText: "Why are you changing your outfit again?", translation: "Por que você está mudando de roupa novamente?" },
    { originalText: "The postponement of the sale upset many customers.", translation: "O adiamento da liquidação chateou muitos clientes." },
    { originalText: "I can't afford that new wardrobe.", translation: "Eu não posso pagar aquele guarda-roupa novo." },
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
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🛍️ Lesson 53 - Going Shopping
          </h1>
          <SpeakSentence text="Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect, and Past." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about shopping, paying, discounts, and use Present Continuous, Present Perfect, and Past.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img src={mainImage} alt="People shopping" className="w-full h-full object-cover rounded-2xl shadow-md" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {verbs.map((verb, vIndex) => (
                <div key={vIndex} className="bg-blue-50 p-4 rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-xs uppercase tracking-wide text-blue-500 font-semibold mb-3">{verb.label}</p>
                  <div className="flex flex-col gap-2">
                    {verb.forms.map((form, fIndex) => (
                      <div key={fIndex} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 transition-all">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{form.tense}</span>
                          <SpeakText text={form.en} className="text-blue-700 font-bold text-lg">{form.en}</SpeakText>
                        </div>
                        <span className="text-gray-600 text-sm italic whitespace-nowrap">= {form.pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {verbsSubstitution.map((ex) => (
                  <SubstitutionOptions key={ex.key} exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }} onOptionClick={handleOptionClick} />
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
                  <SpeakText text={word.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">{word.english}</SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.portuguese}</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-100 rounded-2xl p-5 mb-6">
              <p className="font-semibold">📌 Exemplos:</p>
              <p className="text-gray-700">I put my clothes in the closet. / She has a lot on her plate.</p>
              <p className="text-gray-700">Besides the dress, I bought a bag. / He couldn't afford the suit.</p>
            </div>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {vocabSubstitution.map((ex) => (
                  <SubstitutionOptions key={ex.key} exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }} onOptionClick={handleOptionClick} />
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
                  <SubstitutionOptions key={ex.key} exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }} onOptionClick={handleOptionClick} />
                ))}
              </div>
            )}

            {!openDrills.usefulPhrases && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { en: "I have a lot on my plate today, so I postponed the shopping.", pt: "Eu tenho muito o que fazer hoje, então adiei as compras." },
                  { en: "Though it's raining, I'm going to the mall.", pt: "Embora esteja chovendo, eu estou indo ao shopping." },
                  { en: "Besides the shoes, she bought a beautiful dress.", pt: "Além dos sapatos, ela comprou um vestido bonito." },
                  { en: "Put on your coat now, please.", pt: "Coloque seu casaco agora, por favor." },
                ].map((item, idx) => (
                  <div key={idx} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-lg mb-2 block">{item.en}</SpeakSentence>
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
                📚 PRESENT CONTINUOUS · PRESENT PERFECT · PAST
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-white rounded-xl p-4 border-l-4 border-blue-500">
                  <h4 className="text-lg font-bold text-blue-700 mb-2">📘 Present Continuous</h4>
                  <p className="text-gray-700 text-sm">Use para coisas que estão acontecendo <strong>agora</strong>.</p>
                  <p className="text-gray-700 text-sm mt-1">👍 <strong>I'm trying on the dress again.</strong></p>
                  <p className="text-gray-700 text-sm">❓ <strong>Is she working today?</strong></p>
                </div>
                <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                  <h4 className="text-lg font-bold text-green-700 mb-2">✨ Present Perfect</h4>
                  <p className="text-gray-700 text-sm">Use para experiências ou coisas que já aconteceram.</p>
                  <p className="text-gray-700 text-sm mt-1">👍 <strong>I have already put my clothes in the closet.</strong></p>
                  <p className="text-gray-700 text-sm">❓ <strong>Have you ever tried this store?</strong></p>
                </div>
              </div>

              {/* KEY VERBS INTEGRATED */}
              <div className="bg-white rounded-xl p-4 border-l-4 border-indigo-500 mb-4">
                <h4 className="text-lg font-bold text-indigo-700 mb-2">🔑 Key Verbs (Present & Past)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <SpeakText text="to afford" className="text-blue-600 font-bold">to afford</SpeakText>
                      <span className="text-sm text-gray-500">(presente) = ter condições</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SpeakText text="afforded" className="text-blue-600 font-bold">afforded</SpeakText>
                      <span className="text-sm text-gray-500">(passado) = teve condições</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <SpeakText text="to postpone" className="text-blue-600 font-bold">to postpone</SpeakText>
                      <span className="text-sm text-gray-500">(presente) = adiar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <SpeakText text="postponed" className="text-blue-600 font-bold">postponed</SpeakText>
                      <span className="text-sm text-gray-500">(passado) = adiou</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* TO BE REMINDER */}
              <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-400 shadow-sm">
                <h4 className="text-lg font-bold text-yellow-700 mb-2 flex items-center gap-2">
                  💡 Reminder: Perguntas com o Verbo "To Be"
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Para fazer perguntas com o verbo <strong>"To Be"</strong> (am, is, are, was, were), você não precisa de um verbo auxiliar como "do" ou "does". 
                  Basta <strong>inverter a ordem</strong>: coloque o verbo "To Be" na frente do sujeito!
                </p>
                <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded border border-yellow-200">
                  <p>👉 <strong>Affirmative:</strong> You <span className="text-blue-600 font-bold">are</span> trying on the dress.</p>
                  <p>👉 <strong>Question:</strong> <span className="text-blue-600 font-bold">Are</span> you trying on the dress?</p>
                  <p>👉 <strong>Affirmative:</strong> She <span className="text-blue-600 font-bold">is</span> working today.</p>
                  <p>👉 <strong>Question:</strong> <span className="text-blue-600 font-bold">Is</span> she working today?</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={example.english} className="text-blue-600 font-bold cursor-pointer text-left w-full block">{example.english}</SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{example.portuguese}</div>
                </div>
              ))}
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {grammarSubstitution.map((ex) => (
                  <SubstitutionOptions key={ex.key} exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }} onOptionClick={handleOptionClick} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 MAKE IT YOURS</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">Practice real-life shopping situations</div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {makeItYoursData.map((sentence, index) => (
                    <div key={index} className="group flex items-start gap-2 bg-white p-3 rounded-lg shadow-sm border border-blue-100 hover:border-blue-300 transition-all">
                      <span className="text-blue-500 font-bold mt-0.5">{index + 1}.</span>
                      <div className="flex-1">
                        <SpeakSentence text={sentence.originalText} className="text-base font-medium text-left w-full text-gray-800">
                          {sentence.originalText}
                        </SpeakSentence>
                        <p className="text-sm text-gray-500 mt-1">{sentence.translation}</p>
                      </div>
                      <button
                        onClick={() => openEditor(sentence)}
                        className="text-gray-400 hover:text-blue-500 transition-colors p-1 mt-1"
                        title="Editar esta frase"
                      >
                        <Pencil size={18} />
                      </button>
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

        {/* ===================== SECTION 6 – CHECKOUT ===================== */}
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
                  <SubstitutionOptions key={ex.key} exercise={{ ...ex, currentIndex: getCurrentIndex(ex.key) }} onOptionClick={handleOptionClick} />
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
              <h3 className="font-bold text-lg mb-4 text-yellow-300">PHRASES & VOCABULARY</h3>
              {[
                { en: "I have a lot on my plate today.", pt: "Eu tenho muito o que fazer hoje." },
                { en: "Though it's raining, I'm going shopping.", pt: "Embora esteja chovendo, eu vou às compras." },
                { en: "Besides the dress, I bought a bag.", pt: "Além do vestido, eu comprei uma bolsa." },
                { en: "I couldn't afford the formal suit.", pt: "Eu não podia pagar o terno formal." },
                { en: "We postponed the trip again.", pt: "Nós adiamos a viagem novamente." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-green-700 rounded-lg">
                  <SpeakSentence text={item.en} className="font-bold text-green-50">{item.en}</SpeakSentence>
                  <p className="text-green-200 text-sm mt-1">{item.pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">GRAMMAR & TENSES</h3>
              {[
                { en: "I'm trying on the dress again.", pt: "Eu estou provando o vestido novamente." },
                { en: "She worked at the store yesterday.", pt: "Ela trabalhou na loja ontem." },
                { en: "I have already put my clothes in the closet.", pt: "Eu já coloquei minhas roupas no armário." },
                { en: "Although it was raining, we went shopping.", pt: "Embora estivesse chovendo, nós fomos às compras." },
                { en: "Even though the store was crowded, we found a nice dress.", pt: "Mesmo que a loja estivesse lotada, encontramos um vestido bonito." },
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
                    <p className="text-red-200 text-xs">Present Continuous, Present Perfect & Past</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CHECK IT OUT SECTION */}
          <div className="bg-[#0c4a6e] text-white p-6 border-t-4 border-yellow-400">
            <h3 className="font-bold text-2xl mb-4 text-yellow-300 flex items-center gap-2">
              <Volume2 className="text-yellow-300" /> CHECK IT OUT! (to do)
            </h3>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <div className="text-3xl font-bold text-white bg-blue-800 px-6 py-3 rounded-xl shadow-inner">
                to do
              </div>
              <div className="text-3xl text-gray-400 font-bold">→</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 max-w-2xl">
                {["the dishes", "the laundry", "the homework", "a favor", "my best"].map((item) => (
                  <div key={item} className="bg-blue-900 bg-opacity-60 p-3 rounded-lg flex items-center shadow-sm">
                    <SpeakText text={item} className="text-lg font-medium text-blue-100 hover:text-white transition-colors w-full justify-start">
                      <span className="flex items-center gap-2">
                        <span className="text-blue-400">✓</span> {item}
                      </span>
                    </SpeakText>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson52")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (52)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson54")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (54) &rarr;
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

      {/* Make It Yours Editor Modal */}
      <MakeItYoursModal
        isOpen={editorModal.isOpen}
        onClose={() => setEditorModal({ isOpen: false, data: null })}
        sentenceData={editorModal.data}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}