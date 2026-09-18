"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Zap, Wrench, Globe, MessageCircle, Users, Lightbulb, Palmtree, DollarSign } from "lucide-react";

type SectionKey = 'geography' | 'animals' | 'culture' | 'economy' | 'lifestyle' | 'food' | 'grammar';

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
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-emerald-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />}
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
      className={`group cursor-pointer hover:bg-emerald-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
    </button>
  );
};

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-emerald-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-full hover:from-emerald-700 hover:to-emerald-900 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-300 hover:text-white transition-colors focus:outline-none"
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
// SUBSTITUTION EXERCISE COMPONENT
// ============================================
type OptionType = string | { label: string; replacement: string; translation?: string };

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
  const [showTranslation, setShowTranslation] = useState(false);

  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; translation?: string } => {
    return typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;
  };

  const currentOption = exercise.options[exercise.currentIndex];
  let currentSentence: string;
  let currentTranslation: string | undefined;

  if (isObjectOption(currentOption)) {
    currentSentence = currentOption.replacement;
    currentTranslation = currentOption.translation;
  } else {
    currentSentence = String(currentOption);
  }

  const toggleVisibility = () => setShowEnglish(prev => !prev);
  const toggleTranslation = () => setShowTranslation(prev => !prev);

  const getOptionLabel = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.label : String(opt);

  const getOptionReplacement = (opt: OptionType): string =>
    isObjectOption(opt) ? opt.replacement : String(opt);

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-emerald-800 font-semibold block text-sm md:text-base">{exercise.original}</p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentTranslation && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-bold"
              title="Mostrar/esconder tradução"
            >
              {showTranslation ? "🇧🇷 Ocultar" : "🇧🇷 Ver tradução"}
            </button>
          )}
          <button
            onClick={toggleVisibility}
            className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
          >
            {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {showEnglish && (
        <div className="mb-3 p-3 bg-emerald-50 rounded-md border border-emerald-100">
          <SpeakSentence text={currentSentence} className="text-emerald-900 font-semibold" />
          {showTranslation && currentTranslation && (
            <p className="text-gray-600 text-sm mt-2 border-t border-emerald-200 pt-2">🇧🇷 {currentTranslation}</p>
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
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md'
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
// HIGHLIGHTED PHRASE
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-emerald-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border-2 border-emerald-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-base md:text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <button
        onClick={() => setShowTranslation(prev => !prev)}
        className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors font-bold mb-2"
      >
        {showTranslation ? "🇧🇷 Ocultar tradução" : "🇧🇷 Ver tradução"}
      </button>
      {showTranslation && (
        <p className="text-sm text-gray-600 border-t border-emerald-100 pt-2">🇧🇷 {translation}</p>
      )}
    </div>
  );
}

// ============================================
// OPEN-ENDED DISCUSSION CARD
// ============================================
function DiscussionCard({
  question,
  questionPt,
  hint,
  index,
}: {
  question: string;
  questionPt: string;
  hint: string;
  index: number;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-emerald-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-5 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wide mb-1">
              <span className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">
                {index}
              </span>
              Discussion
            </div>
            <SpeakSentence text={question} className="text-white font-semibold text-sm md:text-base">
              {question}
            </SpeakSentence>
            <p className="text-emerald-200 text-xs mt-1 italic">🇧🇷 {questionPt}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <button
          onClick={() => setShowHint(prev => !prev)}
          className="mb-3 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-sm font-bold hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-sm"
        >
          {showHint ? "🙈 Ocultar dica" : "💡 Ver dica de resposta"}
        </button>

        {showHint && (
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="flex items-center gap-2 text-gray-700 text-xs font-bold uppercase tracking-wide mb-2">
              <Lightbulb size={14} className="text-emerald-600" />
              Hint / Useful Language
            </div>
            <p className="text-gray-800 leading-relaxed text-sm md:text-base">{hint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonSouthAfrica() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    geography: false,
    animals: false,
    culture: false,
    economy: false,
    lifestyle: false,
    food: false,
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
  const [isImageModal2Open, setIsImageModal2Open] = useState(false);
  const [isImageModal3Open, setIsImageModal3Open] = useState(false);
  const [isImageModal4Open, setIsImageModal4Open] = useState(false);

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
  const mainImage = "https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const animalsImage = "https://images.pexels.com/photos/247431/pexels-photo-247431.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const capeTownImage = "https://images.pexels.com/photos/259447/pexels-photo-259447.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const beachImage = "https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg?auto=compress&cs=tinysrgb&w=1200";
  const safariImage = "https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=1200";
  const foodImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200";

  // ============================================================
  // GEOGRAPHY – LANDSCAPES
  // ============================================================
  const geographySubstitution: SubstitutionExercise[] = [
    {
      key: "geo-1",
      original: "A paisagem é incrivelmente diversa. / costa / savana",
      options: [
        { label: "paisagem", replacement: "The landscape is incredibly diverse.", translation: "A paisagem é incrivelmente diversa." },
        { label: "costa", replacement: "The coastline is incredibly diverse.", translation: "A costa é incrivelmente diversa." },
        { label: "savana", replacement: "The savanna is incredibly diverse.", translation: "A savana é incrivelmente diversa." }
      ],
      currentIndex: 0,
    },
    {
      key: "geo-2",
      original: "A Cidade do Cabo tem praias lindas. / Durban / Gqeberha",
      options: [
        { label: "Cidade do Cabo", replacement: "Cape Town has beautiful beaches.", translation: "A Cidade do Cabo tem praias lindas." },
        { label: "Durban", replacement: "Durban has beautiful beaches.", translation: "Durban tem praias lindas." },
        { label: "Gqeberha", replacement: "Gqeberha has beautiful beaches.", translation: "Gqeberha tem praias lindas." }
      ],
      currentIndex: 0,
    },
    {
      key: "geo-3",
      original: "Eu quero visitar a Montanha da Mesa. / o Parque Kruger / o Deserto do Kalahari",
      options: [
        { label: "Montanha da Mesa", replacement: "I want to visit Table Mountain.", translation: "Eu quero visitar a Montanha da Mesa." },
        { label: "Parque Kruger", replacement: "I want to visit Kruger National Park.", translation: "Eu quero visitar o Parque Nacional Kruger." },
        { label: "Deserto do Kalahari", replacement: "I want to visit the Kalahari Desert.", translation: "Eu quero visitar o Deserto do Kalahari." }
      ],
      currentIndex: 0,
    },
    {
      key: "geo-4",
      original: "A África do Sul tem mais de 2.500 km de litoral. / montanhas / reservas de vida selvagem",
      options: [
        { label: "litoral", replacement: "South Africa has over 2,500 km of coastline.", translation: "A África do Sul tem mais de 2.500 km de litoral." },
        { label: "montanhas", replacement: "South Africa has many beautiful mountains.", translation: "A África do Sul tem muitas montanhas bonitas." },
        { label: "reservas", replacement: "South Africa has many wildlife reserves.", translation: "A África do Sul tem muitas reservas de vida selvagem." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // ANIMALS & SAFARI
  // ============================================================
  const animalsSubstitution: SubstitutionExercise[] = [
    {
      key: "ani-1",
      original: "Eu quero ver um leão na savana. / elefante / rinoceronte",
      options: [
        { label: "leão", replacement: "I want to see a lion in the savanna.", translation: "Eu quero ver um leão na savana." },
        { label: "elefante", replacement: "I want to see an elephant in the savanna.", translation: "Eu quero ver um elefante na savana." },
        { label: "rinoceronte", replacement: "I want to see a rhino in the savanna.", translation: "Eu quero ver um rinoceronte na savana." }
      ],
      currentIndex: 0,
    },
    {
      key: "ani-2",
      original: "Os Cinco Grandes são leão, leopardo, elefante, rinoceronte e búfalo. / girafa / zebra",
      options: [
        { label: "Cinco Grandes", replacement: "The Big Five are lion, leopard, elephant, rhino, and buffalo.", translation: "Os Cinco Grandes são leão, leopardo, elefante, rinoceronte e búfalo." },
        { label: "girafa", replacement: "The giraffe is the tallest animal in the world.", translation: "A girafa é o animal mais alto do mundo." },
        { label: "zebra", replacement: "The zebra has black and white stripes.", translation: "A zebra tem listras preto e branco." }
      ],
      currentIndex: 0,
    },
    {
      key: "ani-3",
      original: "Eu vi um guepardo correndo atrás de uma gazela. / leão / hipopótamo",
      options: [
        { label: "guepardo", replacement: "I saw a cheetah running after a gazelle.", translation: "Eu vi um guepardo correndo atrás de uma gazela." },
        { label: "leão", replacement: "I saw a lion running after a gazelle.", translation: "Eu vi um leão correndo atrás de uma gazela." },
        { label: "hipopótamo", replacement: "I saw a hippo swimming in the river.", translation: "Eu vi um hipopótamo nadando no rio." }
      ],
      currentIndex: 0,
    },
    {
      key: "ani-4",
      original: "Os pinguins vivem na costa da África do Sul. / avestruzes / suricates",
      options: [
        { label: "pinguins", replacement: "Penguins live on the coast of South Africa.", translation: "Os pinguins vivem na costa da África do Sul." },
        { label: "avestruzes", replacement: "Ostriches live in the savanna of South Africa.", translation: "Os avestruzes vivem na savana da África do Sul." },
        { label: "suricates", replacement: "Meerkats live in the desert of South Africa.", translation: "Os suricates vivem no deserto da África do Sul." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // CULTURE & CITIES
  // ============================================================
  const cultureSubstitution: SubstitutionExercise[] = [
    {
      key: "cul-1",
      original: "A África do Sul é chamada de Nação Arco-Íris. / diversa / multicultural",
      options: [
        { label: "Nação Arco-Íris", replacement: "South Africa is called the Rainbow Nation.", translation: "A África do Sul é chamada de Nação Arco-Íris." },
        { label: "diversa", replacement: "South Africa is a very diverse country.", translation: "A África do Sul é um país muito diverso." },
        { label: "multicultural", replacement: "South Africa is a multicultural country.", translation: "A África do Sul é um país multicultural." }
      ],
      currentIndex: 0,
    },
    {
      key: "cul-2",
      original: "Nelson Mandela lutou contra o apartheid. / pela igualdade / pela liberdade",
      options: [
        { label: "apartheid", replacement: "Nelson Mandela fought against apartheid.", translation: "Nelson Mandela lutou contra o apartheid." },
        { label: "igualdade", replacement: "Nelson Mandela fought for equality.", translation: "Nelson Mandela lutou pela igualdade." },
        { label: "liberdade", replacement: "Nelson Mandela fought for freedom.", translation: "Nelson Mandela lutou pela liberdade." }
      ],
      currentIndex: 0,
    },
    {
      key: "cul-3",
      original: "A filosofia Ubuntu significa 'eu sou porque nós somos'. / comunidade / humanidade",
      options: [
        { label: "Ubuntu", replacement: "The philosophy of Ubuntu means 'I am because we are'.", translation: "A filosofia Ubuntu significa 'eu sou porque nós somos'." },
        { label: "comunidade", replacement: "The philosophy of community means we support each other.", translation: "A filosofia de comunidade significa que apoiamos uns aos outros." },
        { label: "humanidade", replacement: "The philosophy of humanity connects all people.", translation: "A filosofia de humanidade conecta todas as pessoas." }
      ],
      currentIndex: 0,
    },
    {
      key: "cul-4",
      original: "A África do Sul tem 11 línguas oficiais. / culturas / tradições",
      options: [
        { label: "11 línguas", replacement: "South Africa has 11 official languages.", translation: "A África do Sul tem 11 línguas oficiais." },
        { label: "culturas", replacement: "South Africa has many different cultures.", translation: "A África do Sul tem muitas culturas diferentes." },
        { label: "tradições", replacement: "South Africa has rich cultural traditions.", translation: "A África do Sul tem ricas tradições culturais." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // ECONOMY & DAILY LIFE
  // ============================================================
  const economySubstitution: SubstitutionExercise[] = [
    {
      key: "eco-1",
      original: "A mineração é importante para a economia. / o turismo / a agricultura",
      options: [
        { label: "mineração", replacement: "Mining is important for the economy.", translation: "A mineração é importante para a economia." },
        { label: "turismo", replacement: "Tourism is important for the economy.", translation: "O turismo é importante para a economia." },
        { label: "agricultura", replacement: "Agriculture is important for the economy.", translation: "A agricultura é importante para a economia." }
      ],
      currentIndex: 0,
    },
    {
      key: "eco-2",
      original: "A África do Sul produz ouro e diamantes. / platina / carvão",
      options: [
        { label: "ouro e diamantes", replacement: "South Africa produces gold and diamonds.", translation: "A África do Sul produz ouro e diamantes." },
        { label: "platina", replacement: "South Africa produces platinum.", translation: "A África do Sul produz platina." },
        { label: "carvão", replacement: "South Africa produces coal.", translation: "A África do Sul produz carvão." }
      ],
      currentIndex: 0,
    },
    {
      key: "eco-3",
      original: "O desemprego é um grande desafio. / a desigualdade / o custo de vida",
      options: [
        { label: "desemprego", replacement: "Unemployment is a big challenge.", translation: "O desemprego é um grande desafio." },
        { label: "desigualdade", replacement: "Inequality is a big challenge.", translation: "A desigualdade é um grande desafio." },
        { label: "custo de vida", replacement: "The cost of living is a big challenge.", translation: "O custo de vida é um grande desafio." }
      ],
      currentIndex: 0,
    },
    {
      key: "eco-4",
      original: "A moeda da África do Sul é o Rand. / o turismo cresce / a infraestrutura melhora",
      options: [
        { label: "Rand", replacement: "The currency of South Africa is the Rand.", translation: "A moeda da África do Sul é o Rand." },
        { label: "turismo", replacement: "Tourism is growing in South Africa.", translation: "O turismo está crescendo na África do Sul." },
        { label: "infraestrutura", replacement: "Infrastructure is improving in South Africa.", translation: "A infraestrutura está melhorando na África do Sul." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // LIFESTYLE, BEACH & EXTREME SPORTS
  // ============================================================
  const lifestyleSubstitution: SubstitutionExercise[] = [
    {
      key: "lif-1",
      original: "Eu adoro dias ensolarados na praia. / surfar / relaxar",
      options: [
        { label: "dias ensolarados", replacement: "I love sunny days at the beach.", translation: "Eu adoro dias ensolarados na praia." },
        { label: "surfar", replacement: "I love surfing at the beach.", translation: "Eu adoro surfar na praia." },
        { label: "relaxar", replacement: "I love relaxing at the beach.", translation: "Eu adoro relaxar na praia." }
      ],
      currentIndex: 0,
    },
    {
      key: "lif-2",
      original: "Eu quero tentar mergulho em gaiola com tubarões. / bungee jumping / parapente",
      options: [
        { label: "mergulho com tubarões", replacement: "I want to try shark cage diving.", translation: "Eu quero tentar mergulho em gaiola com tubarões." },
        { label: "bungee jumping", replacement: "I want to try bungee jumping.", translation: "Eu quero tentar bungee jumping." },
        { label: "parapente", replacement: "I want to try paragliding.", translation: "Eu quero tentar parapente." }
      ],
      currentIndex: 0,
    },
    {
      key: "lif-3",
      original: "Os sul-africanos adoram fazer churrasco (braai). / trilhas / sandboard",
      options: [
        { label: "braai", replacement: "South Africans love having a braai.", translation: "Os sul-africanos adoram fazer um churrasco (braai)." },
        { label: "trilhas", replacement: "South Africans love hiking.", translation: "Os sul-africanos adoram fazer trilhas." },
        { label: "sandboard", replacement: "South Africans love sandboarding.", translation: "Os sul-africanos adoram sandboard." }
      ],
      currentIndex: 0,
    },
    {
      key: "lif-4",
      original: "O estilo de vida é descontraído e ao ar livre. / ativo / saudável",
      options: [
        { label: "descontraído", replacement: "The lifestyle is laid-back and outdoors.", translation: "O estilo de vida é descontraído e ao ar livre." },
        { label: "ativo", replacement: "The lifestyle is active and outdoors.", translation: "O estilo de vida é ativo e ao ar livre." },
        { label: "saudável", replacement: "The lifestyle is healthy and outdoors.", translation: "O estilo de vida é saudável e ao ar livre." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // FOOD & DRINK
  // ============================================================
  const foodSubstitution: SubstitutionExercise[] = [
    {
      key: "foo-1",
      original: "Eu quero experimentar bobotie. / biltong / boerewors",
      options: [
        { label: "bobotie", replacement: "I want to try bobotie.", translation: "Eu quero experimentar bobotie." },
        { label: "biltong", replacement: "I want to try biltong.", translation: "Eu quero experimentar biltong." },
        { label: "boerewors", replacement: "I want to try boerewors.", translation: "Eu quero experimentar boerewors." }
      ],
      currentIndex: 0,
    },
    {
      key: "foo-2",
      original: "O chá de rooibos é famoso na África do Sul. / vinho / chakalaka",
      options: [
        { label: "rooibos", replacement: "Rooibos tea is famous in South Africa.", translation: "O chá de rooibos é famoso na África do Sul." },
        { label: "vinho", replacement: "Wine is famous in South Africa.", translation: "O vinho é famoso na África do Sul." },
        { label: "chakalaka", replacement: "Chakalaka is a famous South African dish.", translation: "Chakalaka é um prato sul-africano famoso." }
      ],
      currentIndex: 0,
    },
    {
      key: "foo-3",
      original: "Um braai é mais que uma refeição, é uma tradição. / celebração / encontro",
      options: [
        { label: "tradição", replacement: "A braai is more than a meal, it's a tradition.", translation: "Um braai é mais que uma refeição, é uma tradição." },
        { label: "celebração", replacement: "A braai is more than a meal, it's a celebration.", translation: "Um braai é mais que uma refeição, é uma celebração." },
        { label: "encontro", replacement: "A braai is more than a meal, it's a gathering.", translation: "Um braai é mais que uma refeição, é um encontro." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // GRAMMAR
  // ============================================================
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "gra-1",
      original: "Eu nunca fui à África do Sul. / ele / nós",
      options: [
        { label: "Eu", replacement: "I have never been to South Africa.", translation: "Eu nunca fui à África do Sul." },
        { label: "Ele", replacement: "He has never been to South Africa.", translation: "Ele nunca foi à África do Sul." },
        { label: "Nós", replacement: "We have never been to South Africa.", translation: "Nós nunca fomos à África do Sul." }
      ],
      currentIndex: 0,
    },
    {
      key: "gra-2",
      original: "Você já viu um leão na natureza? / um elefante / um rinoceronte",
      options: [
        { label: "leão", replacement: "Have you ever seen a lion in the wild?", translation: "Você já viu um leão na natureza?" },
        { label: "elefante", replacement: "Have you ever seen an elephant in the wild?", translation: "Você já viu um elefante na natureza?" },
        { label: "rinoceronte", replacement: "Have you ever seen a rhino in the wild?", translation: "Você já viu um rinoceronte na natureza?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gra-3",
      original: "Eu fui à Cidade do Cabo em 2022. / Joanesburgo / Durban",
      options: [
        { label: "Cidade do Cabo", replacement: "I went to Cape Town in 2022.", translation: "Eu fui à Cidade do Cabo em 2022." },
        { label: "Joanesburgo", replacement: "I went to Johannesburg in 2022.", translation: "Eu fui a Joanesburgo em 2022." },
        { label: "Durban", replacement: "I went to Durban in 2022.", translation: "Eu fui a Durban em 2022." }
      ],
      currentIndex: 0,
    },
    {
      key: "gra-4",
      original: "Eu adoraria visitar a África do Sul um dia. / explorar / voltar",
      options: [
        { label: "visitar", replacement: "I would love to visit South Africa one day.", translation: "Eu adoraria visitar a África do Sul um dia." },
        { label: "explorar", replacement: "I would love to explore South Africa one day.", translation: "Eu adoraria explorar a África do Sul um dia." },
        { label: "voltar", replacement: "I would love to go back to South Africa one day.", translation: "Eu adoraria voltar à África do Sul um dia." }
      ],
      currentIndex: 0,
    },
    {
      key: "gra-5",
      original: "Se eu tivesse dinheiro, eu viajaria para a África do Sul. / tempo / férias",
      options: [
        { label: "dinheiro", replacement: "If I had money, I would travel to South Africa.", translation: "Se eu tivesse dinheiro, eu viajaria para a África do Sul." },
        { label: "tempo", replacement: "If I had time, I would travel to South Africa.", translation: "Se eu tivesse tempo, eu viajaria para a África do Sul." },
        { label: "férias", replacement: "If I had vacation, I would travel to South Africa.", translation: "Se eu tivesse férias, eu viajaria para a África do Sul." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...geographySubstitution,
    ...animalsSubstitution,
    ...cultureSubstitution,
    ...economySubstitution,
    ...lifestyleSubstitution,
    ...foodSubstitution,
    ...grammarSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================================
  // DISCUSSION QUESTIONS DATA
  // ============================================================
  const discussionQA = [
    {
      question: "What do you already know about South Africa?",
      questionPt: "O que você já sabe sobre a África do Sul?",
      hint: "I know that South Africa is... / I have heard that... / I have no idea, but I would like to learn about..."
    },
    {
      question: "When you hear 'South Africa', what is the first thing that comes to your mind?",
      questionPt: "Quando você ouve 'África do Sul', qual é a primeira coisa que vem à sua mente?",
      hint: "The first thing that comes to my mind is... / I immediately think of... / For me, South Africa means..."
    },
    {
      question: "If you could visit one place in South Africa, where would you go and why?",
      questionPt: "Se você pudesse visitar um lugar na África do Sul, onde iria e por quê?",
      hint: "I would go to... because... / I have always wanted to see... / The reason I would choose... is..."
    },
    {
      question: "Which South African animal would you most like to see in person? Why?",
      questionPt: "Qual animal sul-africano você mais gostaria de ver pessoalmente? Por quê?",
      hint: "I would love to see a... because... / The animal I find most fascinating is... / I have always been amazed by..."
    },
    {
      question: "Some people say safaris are ethical tourism. Others disagree. What do you think?",
      questionPt: "Algumas pessoas dizem que safáris são turismo ético. Outras discordam. O que você acha?",
      hint: "In my opinion, safaris are... / I think it depends on... / On one hand... on the other hand..."
    },
    {
      question: "South Africa is called the 'Rainbow Nation'. What does that mean to you?",
      questionPt: "A África do Sul é chamada de 'Nação Arco-Íris'. O que isso significa para você?",
      hint: "To me, the Rainbow Nation means... / I think it represents... / This name suggests that..."
    },
    {
      question: "Nelson Mandela said, 'Education is the most powerful weapon which you can use to change the world.' Do you agree? Why?",
      questionPt: "Nelson Mandela disse: 'A educação é a arma mais poderosa que você pode usar para mudar o mundo.' Você concorda? Por quê?",
      hint: "I completely agree because... / I partially agree... / I think education is important because..."
    },
    {
      question: "The philosophy of Ubuntu means 'I am because we are.' How does this compare to your culture's values?",
      questionPt: "A filosofia Ubuntu significa 'eu sou porque nós somos'. Como isso se compara aos valores da sua cultura?",
      hint: "In my culture, we believe... / This is similar to... / This is different from my culture because..."
    },
    {
      question: "South Africa is rich in gold and diamonds, but has high unemployment. How can a country be rich in resources but poor in opportunities?",
      questionPt: "A África do Sul é rica em ouro e diamantes, mas tem alto desemprego. Como um país pode ser rico em recursos mas pobre em oportunidades?",
      hint: "This happens because... / I think the problem is... / One reason could be..."
    },
    {
      question: "If you were an economic advisor to the South African government, what would you suggest?",
      questionPt: "Se você fosse um conselheiro econômico do governo sul-africano, o que sugeriria?",
      hint: "I would suggest that they... / My first recommendation would be... / I think the government should..."
    },
    {
      question: "Would you try shark cage diving? Why or why not?",
      questionPt: "Você tentaria mergulho em gaiola com tubarões? Por quê ou por que não?",
      hint: "I would definitely try it because... / I would never try it because... / I'm not sure, I think it depends on..."
    },
    {
      question: "What extreme sport would you like to try in South Africa?",
      questionPt: "Qual esporte radical você gostaria de experimentar na África do Sul?",
      hint: "I would love to try... because... / I have always wanted to... / The sport that excites me most is..."
    },
    {
      question: "Do you think people in sunny countries are happier? Why or why not?",
      questionPt: "Você acha que as pessoas em países ensolarados são mais felizes? Por quê ou por que não?",
      hint: "I think there is a connection because... / I don't think weather affects happiness because... / In my opinion..."
    },
    {
      question: "If you could invite three people (alive or dead) to a South African braai, who would you invite and what would you talk about?",
      questionPt: "Se você pudesse convidar três pessoas (vivas ou mortas) para um braai sul-africano, quem convidaria e sobre o que conversariam?",
      hint: "I would invite... because... / We would talk about... / The first question I would ask is..."
    },
    {
      question: "What is the most surprising thing you learned about South Africa today?",
      questionPt: "Qual foi a coisa mais surpreendente que você aprendeu sobre a África do Sul hoje?",
      hint: "The most surprising thing for me was... / I didn't know that... / What impressed me most was..."
    },
    {
      question: "If you could change one thing about South Africa, what would it be?",
      questionPt: "Se você pudesse mudar uma coisa na África do Sul, o que seria?",
      hint: "If I could change one thing, I would... / I think the biggest problem is... / I would focus on improving..."
    },
  ];

  // ============================================================
  // USEFUL PHRASES
  // ============================================================
  const usefulPhrasesData = [
    {
      en: "South Africa is one of the most diverse countries in the world.",
      pt: "A África do Sul é um dos países mais diversos do mundo.",
      green: ["diverse", "countries", "world"]
    },
    {
      en: "The Rainbow Nation represents unity in diversity.",
      pt: "A Nação Arco-Íris representa a unidade na diversidade.",
      green: ["Rainbow", "Nation", "unity"]
    },
    {
      en: "A safari is a once-in-a-lifetime experience.",
      pt: "Um safári é uma experiência única na vida.",
      green: ["safari", "once-in-a-lifetime", "experience"]
    },
    {
      en: "The landscape ranges from beaches to mountains to savanna.",
      pt: "A paisagem varia de praias a montanhas e savana.",
      green: ["landscape", "beaches", "savanna"]
    },
    {
      en: "South Africans are known for their warm and friendly nature.",
      pt: "Os sul-africanos são conhecidos por sua natureza calorosa e amigável.",
      green: ["warm", "friendly", "nature"]
    },
    {
      en: "Extreme sports in South Africa attract adventurers from around the globe.",
      pt: "Esportes radicais na África do Sul atraem aventureiros de todo o mundo.",
      green: ["Extreme", "sports", "adventurers"]
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Globe size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">South Africa • B1–B2</span>
            <Globe size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            🇿🇦 South Africa – A Rainbow Nation
          </h1>
          <SpeakSentence text="Explore the culture, nature, and lifestyle of South Africa. Practice your English, share your opinions, and interact with your classmates." className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🌍 Explore the culture, nature, and lifestyle of South Africa. Practice your English, share your opinions, and interact with your classmates.
          </SpeakSentence>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="South Africa landscape"
              onClick={() => setIsImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
          </div>
        </div>

        {/* ===================== SECTION 1 – GEOGRAPHY ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Globe size={22} /> GEOGRAPHY & LANDSCAPES
              </h2>
              <PencilIcon onClick={() => openNoteModal('Geography')} />
            </div>
            <button
              onClick={() => toggleDrill('geography')}
              className="inline-block rounded-full bg-white text-emerald-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-emerald-100"
            >
              {openDrills.geography ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on the words to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the words to hear the pronunciation and practice their forms
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "landscape", pt: "paisagem" },
                { en: "coastline", pt: "litoral / costa" },
                { en: "savanna", pt: "savana" },
                { en: "Table Mountain", pt: "Montanha da Mesa" },
                { en: "vineyard", pt: "vinhedo" },
                { en: "wildlife reserve", pt: "reserva de vida selvagem" },
                { en: "desert", pt: "deserto" },
                { en: "waterfall", pt: "cachoeira" },
                { en: "sunset", pt: "pôr do sol" },
                { en: "township", pt: "township (bairro histórico)" },
              ].map((word, idx) => (
                <div key={idx} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>

            {openDrills.geography && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {geographySubstitution.map((ex) => {
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

        {/* ===================== SECTION 2 – ANIMALS & SAFARI ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🦁 ANIMALS & SAFARI
              </h2>
              <PencilIcon onClick={() => openNoteModal('Animals & Safari')} />
            </div>
            <button
              onClick={() => toggleDrill('animals')}
              className="inline-block rounded-full bg-white text-emerald-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-emerald-100"
            >
              {openDrills.animals ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on each animal to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each animal to hear its correct pronunciation
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModal2Open(true)}>
              <img
                src={animalsImage}
                alt="Safari animals"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { en: "lion", pt: "leão" },
                { en: "leopard", pt: "leopardo" },
                { en: "elephant", pt: "elefante" },
                { en: "rhinoceros (rhino)", pt: "rinoceronte" },
                { en: "buffalo", pt: "búfalo" },
                { en: "giraffe", pt: "girafa" },
                { en: "zebra", pt: "zebra" },
                { en: "cheetah", pt: "guepardo / chita" },
                { en: "hippopotamus (hippo)", pt: "hipopótamo" },
                { en: "penguin", pt: "pinguim" },
                { en: "wildebeest", pt: "gnus" },
                { en: "meerkat", pt: "suricate" },
                { en: "ostrich", pt: "avestruz" },
                { en: "antelope", pt: "antílope" },
                { en: "crocodile", pt: "crocodilo" },
                { en: "flamingo", pt: "flamingo" },
              ].map((word, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.animals && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {animalsSubstitution.map((ex) => {
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

        {/* ===================== SECTION 3 – CULTURE & CITIES ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🏙️ CULTURE & CITIES
              </h2>
              <PencilIcon onClick={() => openNoteModal('Culture & Cities')} />
            </div>
            <button
              onClick={() => toggleDrill('culture')}
              className="inline-block rounded-full bg-white text-gray-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-gray-100"
            >
              {openDrills.culture ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Discover the cities, history, and cultural diversity of South Africa" className="text-md text-gray-600 mb-4 italic">
              🌍 Discover the cities, history, and cultural diversity of South Africa
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModal3Open(true)}>
              <img
                src={capeTownImage}
                alt="Cape Town"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "Rainbow Nation", pt: "Nação Arco-Íris" },
                { en: "apartheid", pt: "apartheid (regime de segregação racial)" },
                { en: "Nelson Mandela", pt: "Nelson Mandela" },
                { en: "Ubuntu", pt: "Ubuntu (filosofia de humanidade)" },
                { en: "braai", pt: "churrasco sul-africano" },
                { en: "11 official languages", pt: "11 línguas oficiais" },
                { en: "diversity", pt: "diversidade" },
                { en: "heritage", pt: "herança / patrimônio cultural" },
                { en: "township", pt: "township" },
                { en: "Cape Town", pt: "Cidade do Cabo" },
                { en: "Johannesburg", pt: "Joanesburgo" },
                { en: "Durban", pt: "Durban" },
              ].map((word, idx) => (
                <div key={idx} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>

            {openDrills.culture && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {cultureSubstitution.map((ex) => {
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

        {/* ===================== SECTION 4 – ECONOMY ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <DollarSign size={22} /> ECONOMY & DAILY LIFE
              </h2>
              <PencilIcon onClick={() => openNoteModal('Economy')} />
            </div>
            <button
              onClick={() => toggleDrill('economy')}
              className="inline-block rounded-full bg-white text-emerald-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-emerald-100"
            >
              {openDrills.economy ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Learn about South Africa's economy and the challenges people face" className="text-md text-gray-600 mb-4 italic">
              💰 Learn about South Africa's economy and the challenges people face
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "mining", pt: "mineração" },
                { en: "gold", pt: "ouro" },
                { en: "diamond", pt: "diamante" },
                { en: "unemployment", pt: "desemprego" },
                { en: "inequality", pt: "desigualdade" },
                { en: "tourism", pt: "turismo" },
                { en: "infrastructure", pt: "infraestrutura" },
                { en: "load shedding", pt: "cortes de energia programados" },
                { en: "currency (Rand)", pt: "moeda (Rand)" },
                { en: "cost of living", pt: "custo de vida" },
              ].map((word, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.economy && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {economySubstitution.map((ex) => {
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

        {/* ===================== SECTION 5 – LIFESTYLE, BEACH & EXTREME SPORTS ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Palmtree size={22} /> LIFESTYLE, BEACH & EXTREME SPORTS
              </h2>
              <PencilIcon onClick={() => openNoteModal('Lifestyle')} />
            </div>
            <button
              onClick={() => toggleDrill('lifestyle')}
              className="inline-block rounded-full bg-white text-gray-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-gray-100"
            >
              {openDrills.lifestyle ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Explore the outdoor lifestyle, beaches, and adventure sports of South Africa" className="text-md text-gray-600 mb-4 italic">
              🏄 Explore the outdoor lifestyle, beaches, and adventure sports of South Africa
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModal4Open(true)}>
              <img
                src={beachImage}
                alt="South Africa beach"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "sunny days", pt: "dias ensolarados" },
                { en: "outdoor lifestyle", pt: "estilo de vida ao ar livre" },
                { en: "surfing", pt: "surfe" },
                { en: "shark cage diving", pt: "mergulho em gaiola com tubarões" },
                { en: "bungee jumping", pt: "bungee jumping" },
                { en: "hiking", pt: "trilha / caminhada" },
                { en: "paragliding", pt: "parapente" },
                { en: "sandboarding", pt: "sandboard" },
                { en: "braai (barbecue)", pt: "churrasco" },
                { en: "laid-back", pt: "descontraído / relaxado" },
              ].map((word, idx) => (
                <div key={idx} className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>

            {openDrills.lifestyle && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {lifestyleSubstitution.map((ex) => {
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

        {/* ===================== SECTION 6 – FOOD ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🍽️ FOOD & DRINK
              </h2>
              <PencilIcon onClick={() => openNoteModal('Food & Drink')} />
            </div>
            <button
              onClick={() => toggleDrill('food')}
              className="inline-block rounded-full bg-white text-emerald-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-emerald-100"
            >
              {openDrills.food ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Discover South African cuisine and food traditions" className="text-md text-gray-600 mb-4 italic">
              🍲 Discover South African cuisine and food traditions
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={foodImage}
                alt="South African food"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {[
                { en: "bobotie", pt: "bobotie (prato de carne moída com especiarias)" },
                { en: "biltong", pt: "biltong (carne seca)" },
                { en: "boerewors", pt: "boerewors (linguiça sul-africana)" },
                { en: "chakalaka", pt: "chakalaka (relogado picante de legumes)" },
                { en: "malva pudding", pt: "malva pudding (sobremesa doce)" },
                { en: "rooibos tea", pt: "chá de rooibos" },
                { en: "wine", pt: "vinho" },
                { en: "braai", pt: "churrasco" },
              ].map((word, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-emerald-300 transition-colors">
                  <SpeakText text={word.en} className="text-emerald-800 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.food && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {foodSubstitution.map((ex) => {
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

        {/* ===================== SECTION 7 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR IN CONTEXT</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white text-gray-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-gray-100"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Present Perfect for experience, Past Simple for specific moments, and Second Conditional for hypothetical situations" className="text-md text-gray-600 mb-4 italic">
              📚 Present Perfect for experience, Past Simple for specific moments, and Second Conditional for hypothetical situations
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                <h3 className="font-bold text-emerald-800 mb-2">Present Perfect</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>experiência</strong> (sem tempo específico).</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>have never been</strong> to South Africa.</p>
                <p className="text-xs text-gray-500">Eu nunca fui à África do Sul.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Past Simple</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>momentos específicos</strong> no passado.</p>
                <p className="text-xs text-gray-600 italic mb-2">I <strong>went</strong> to Cape Town in 2022.</p>
                <p className="text-xs text-gray-500">Eu fui à Cidade do Cabo em 2022.</p>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200">
                <h3 className="font-bold text-emerald-800 mb-2">Second Conditional</h3>
                <p className="text-sm text-gray-700 mb-2">Use para <strong>situações hipotéticas</strong>.</p>
                <p className="text-xs text-gray-600 italic mb-2">If I <strong>had</strong> money, I <strong>would travel</strong> to South Africa.</p>
                <p className="text-xs text-gray-500">Se eu tivesse dinheiro, eu viajaria para a África do Sul.</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border border-gray-200">
              {[
                { en: "I have never been to South Africa, but I would love to go.", pt: "Eu nunca fui à África do Sul, mas adoraria ir." },
                { en: "She has visited Cape Town three times.", pt: "Ela visitou a Cidade do Cabo três vezes." },
                { en: "We went on a safari last year and saw the Big Five.", pt: "Nós fomos a um safári no ano passado e vimos os Cinco Grandes." },
                { en: "If I had the opportunity, I would try shark cage diving.", pt: "Se eu tivesse a oportunidade, eu tentaria mergulho em gaiola com tubarões." },
                { en: "They have lived in Johannesburg for five years.", pt: "Eles moram em Joanesburgo há cinco anos." },
                { en: "I would visit Table Mountain if I went to Cape Town.", pt: "Eu visitaria a Montanha da Mesa se fosse à Cidade do Cabo." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-l-4 border-emerald-400">
                  <SpeakSentence text={item.en} className="text-emerald-800 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                </div>
              ))}
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-emerald-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 8 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Practice natural expressions about South Africa" className="text-md text-gray-600 mb-4 italic">
              💬 Practice natural expressions about South Africa
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
          </div>
        </div>

        {/* ===================== SECTION 9 – OPEN-ENDED DISCUSSION ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <MessageCircle size={22} /> OPEN-ENDED DISCUSSION
              </h2>
              <p className="text-sm text-emerald-200 mt-1">Speak freely, share your opinion, and practice fluency</p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-5 bg-gray-50">
            <p className="text-sm text-gray-600 italic mb-2">
              👂 Click on each question to hear it. Click "Ver dica de resposta" to see useful language. Then speak for 1–2 minutes!
            </p>
            {discussionQA.map((qa, idx) => (
              <DiscussionCard
                key={idx}
                index={idx + 1}
                question={qa.question}
                questionPt={qa.questionPt}
                hint={qa.hint}
              />
            ))}
          </div>
        </div>

        {/* ===================== SECTION 10 – INTERACTIVE CHALLENGES ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users size={22} /> INTERACTIVE CHALLENGES
            </h2>
            <p className="text-sm text-emerald-100 mt-1">Student A ↔ Student B ↔ Student C ↔ Teacher</p>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {/* Challenge 1 */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <h3 className="font-bold text-emerald-800 text-lg mb-3">🎯 Challenge #1: Animal Story Chain</h3>
              <p className="text-gray-700 mb-3"><strong>Instructions:</strong> Create a story about a safari together.</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-3">
                <li><strong>Student A</strong> starts the story using one animal.</li>
                <li><strong>Student B</strong> continues using a second animal.</li>
                <li><strong>Student C</strong> continues using a third animal.</li>
                <li><strong>Teacher</strong> finishes the story.</li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 italic mb-2">Example:</p>
                <p className="text-gray-800"><strong>A:</strong> "We were driving through the savanna when suddenly we saw a huge elephant blocking the road..."</p>
                <p className="text-gray-800"><strong>B:</strong> "The elephant looked at us, and behind it, a zebra was drinking water from a small lake..."</p>
                <p className="text-gray-800"><strong>C:</strong> "Then, out of nowhere, a cheetah ran past us at incredible speed, chasing a small antelope..."</p>
                <p className="text-gray-800"><strong>T:</strong> "And we realized — we were not just watching nature. We were part of it."</p>
              </div>
              <p className="mt-3 text-sm text-emerald-700 font-bold">Words to use: lion, giraffe, sunset, jeep, camera, fear, laughter</p>
            </div>

            {/* Challenge 2 */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <h3 className="font-bold text-emerald-800 text-lg mb-3">🎯 Challenge #2: Travel Agency Role-Play</h3>
              <p className="text-gray-700 mb-3"><strong>Scenario:</strong> You work at a travel agency. You need to sell a South African holiday package.</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-3">
                <li><strong>Student A:</strong> Travel Agent — Describe the package</li>
                <li><strong>Student B:</strong> Customer — Ask questions, show interest</li>
                <li><strong>Student C:</strong> Customer — Ask difficult questions, compare with other destinations</li>
                <li><strong>Teacher:</strong> Observer — Give feedback at the end</li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 italic mb-2">Useful phrases:</p>
                <p className="text-gray-800">• Have you considered...?</p>
                <p className="text-gray-800">• What's included in the package?</p>
                <p className="text-gray-800">• It's a once-in-a-lifetime experience.</p>
                <p className="text-gray-800">• How does it compare to...?</p>
                <p className="text-gray-800">• I'd highly recommend...</p>
                <p className="text-gray-800">• What about safety?</p>
              </div>
              <p className="mt-3 text-sm text-emerald-700 font-bold">Switch roles and do it again!</p>
            </div>

            {/* Challenge 3 */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <h3 className="font-bold text-emerald-800 text-lg mb-3">🎯 Challenge #3: Sentence Building Chain</h3>
              <p className="text-gray-700 mb-3"><strong>Instructions:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-3">
                <li><strong>Student A</strong> says a sentence about South Africa using <strong>Present Simple</strong>.</li>
                <li><strong>Student B</strong> responds using <strong>Present Perfect</strong>.</li>
                <li><strong>Student C</strong> asks a question about A or B's sentence.</li>
                <li><strong>Teacher</strong> answers the question or adds information.</li>
              </ul>
              <div className="bg-white p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 italic mb-2">Example Round:</p>
                <p className="text-gray-800"><strong>A:</strong> "South Africa has beautiful beaches along the Indian Ocean."</p>
                <p className="text-gray-800"><strong>B:</strong> "I have never seen such beautiful beaches in my life."</p>
                <p className="text-gray-800"><strong>C:</strong> "Have you ever been to any beach outside your country?"</p>
                <p className="text-gray-800"><strong>T:</strong> "I have been to beaches in Brazil, but I would love to see Cape Town's coastline."</p>
              </div>
              <p className="mt-3 text-sm text-emerald-700 font-bold">Topics: Animals → Food → Sports → Economy</p>
            </div>

            {/* Challenge 4 */}
            <div className="bg-emerald-50 rounded-2xl p-6 border-2 border-emerald-200">
              <h3 className="font-bold text-emerald-800 text-lg mb-3">🎯 Challenge #4: "If I Had..." Hypothetical Chain</h3>
              <p className="text-gray-700 mb-3"><strong>Instructions:</strong> Each student completes the sentence with a Second Conditional.</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-3">
                <li><strong>Student A:</strong> "If I had a free plane ticket to South Africa, I would..."</li>
                <li><strong>Student B:</strong> "If I saw a lion in the wild, I would..."</li>
                <li><strong>Student C:</strong> "If I tried shark cage diving, I would..."</li>
                <li><strong>Teacher:</strong> "If I could live anywhere in South Africa, I would..."</li>
              </ul>
              <p className="mt-3 text-sm text-emerald-700 font-bold">Be creative! The more details, the better!</p>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 11 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-emerald-100">Practice real-life situations</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="bg-emerald-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "I have never been to South Africa, but it is at the top of my travel list.", pt: "Eu nunca fui à África do Sul, mas está no topo da minha lista de viagens." },
                    { en: "If I visited South Africa, I would go on a safari in Kruger National Park.", pt: "Se eu visitasse a África do Sul, eu iria a um safári no Parque Nacional Kruger." },
                    { en: "The Rainbow Nation represents unity in diversity.", pt: "A Nação Arco-Íris representa a unidade na diversidade." },
                    { en: "I would love to try shark cage diving, even though it sounds terrifying.", pt: "Eu adoraria tentar mergulho em gaiola com tubarões, mesmo que pareça aterrorizante." },
                    { en: "South Africa's economy depends on mining, tourism, and agriculture.", pt: "A economia da África do Sul depende de mineração, turismo e agricultura." },
                    { en: "Nelson Mandela's legacy continues to inspire people around the world.", pt: "O legado de Nelson Mandela continua a inspirar pessoas ao redor do mundo." },
                    { en: "A braai is more than a meal — it's a way of bringing people together.", pt: "Um braai é mais que uma refeição — é uma forma de unir as pessoas." },
                    { en: "I would ask the travel agent about safety, costs, and the best time to visit.", pt: "Eu perguntaria ao agente de viagens sobre segurança, custos e a melhor época para visitar." },
                    { en: "If I could interview Nelson Mandela, I would ask him about forgiveness and leadership.", pt: "Se eu pudesse entrevistar Nelson Mandela, perguntaria sobre perdão e liderança." },
                    { en: "The most surprising thing I learned is that South Africa has 11 official languages.", pt: "A coisa mais surpreendente que aprendi é que a África do Sul tem 11 línguas oficiais." },
                  ].map((s, idx) => (
                    <div key={idx} className="group bg-white p-3 rounded-lg border-l-4 border-emerald-400">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium text-gray-800">
                          {idx + 1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-5">🇧🇷 {s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={safariImage} alt="Safari" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Safari adventure</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={capeTownImage} alt="Cape Town" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Cape Town & Table Mountain</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <div className="relative h-40 w-full">
                      <img src={beachImage} alt="Beach" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic text-sm">Sunny days & extreme sports</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 12 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-emerald-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-emerald-100 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-800 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-emerald-400">KEY EXPRESSIONS</h3>
              {[
                { en: "I have never been to South Africa, but I would love to go.", pt: "Eu nunca fui à África do Sul, mas adoraria ir." },
                { en: "The Rainbow Nation represents unity in diversity.", pt: "A Nação Arco-Íris representa a unidade na diversidade." },
                { en: "A safari is a once-in-a-lifetime experience.", pt: "Um safári é uma experiência única na vida." },
                { en: "If I had the chance, I would try shark cage diving.", pt: "Se eu tivesse a chance, eu tentaria mergulho em gaiola com tubarões." },
                { en: "South Africa is rich in culture, nature, and history.", pt: "A África do Sul é rica em cultura, natureza e história." },
                { en: "I would ask about safety, costs, and the best time to visit.", pt: "Eu perguntaria sobre segurança, custos e a melhor época para visitar." },
                { en: "Nelson Mandela's legacy continues to inspire the world.", pt: "O legado de Nelson Mandela continua a inspirar o mundo." },
                { en: "A braai is more than a meal — it's a tradition.", pt: "Um braai é mais que uma refeição — é uma tradição." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-emerald-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-emerald-200 text-sm ml-4">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-emerald-700 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">💡 TIPS FOR FLUENCY</h4>
                  <ul className="list-disc pl-5 space-y-2 text-emerald-50">
                    <li>Use <strong className="text-white">Present Perfect</strong> (I have never been...) to talk about experiences.</li>
                    <li>Use <strong className="text-white">Second Conditional</strong> (If I had..., I would...) to talk about hypothetical situations.</li>
                    <li>Give <strong className="text-white">reasons and examples</strong> when you share your opinion.</li>
                    <li>Use <strong className="text-white">linking words</strong>: however, therefore, in addition, on the other hand.</li>
                    <li>Ask <strong className="text-white">follow-up questions</strong> to keep the conversation going.</li>
                    <li>Don't be afraid to make mistakes — <strong className="text-white">fluency comes from practice!</strong></li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-emerald-500">
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-emerald-50">Speak slowly and clearly. Use the vocabulary you learned today. The more you speak, the more confident you become.</p>
                </div>
                <div className="pt-4 border-t border-emerald-500">
                  <p className="text-emerald-50 text-sm italic">
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
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gradient-to-r from-emerald-600 to-emerald-800 hover:from-emerald-700 hover:to-emerald-900 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (62) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL IMAGEM PRINCIPAL ===== */}
      {isImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="South Africa – ampliada"
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

      {/* ===== MODAL IMAGEM ANIMAIS ===== */}
      {isImageModal2Open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModal2Open(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={animalsImage}
              alt="Safari animals – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModal2Open(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGEM CAPE TOWN ===== */}
      {isImageModal3Open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModal3Open(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={capeTownImage}
              alt="Cape Town – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModal3Open(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL IMAGEM PRAIA ===== */}
      {isImageModal4Open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsImageModal4Open(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={beachImage}
              alt="South Africa beach – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsImageModal4Open(false)}
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