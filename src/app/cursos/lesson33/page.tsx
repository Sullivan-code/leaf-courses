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
// MAIN COMPONENT – LESSON 33
// ============================================
export default function Lesson33TalkAndWatch() {
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

  // ========== LESSON 33 DATA ==========
  const verbs = [
    { english: "to talk (to)", portuguese: "conversar / falar com" },
    { english: "to watch", portuguese: "assistir" }
  ];

  const newWords = [
    { english: "science", portuguese: "ciência" },
    { english: "religion", portuguese: "religião" },
    { english: "politics", portuguese: "política" },
    { english: "music", portuguese: "música" },
    { english: "sports", portuguese: "esportes" },
    { english: "fashion", portuguese: "moda" },
    { english: "life", portuguese: "vida" },
    { english: "stuff", portuguese: "coisas" },
    { english: "idea", portuguese: "ideia" },
    { english: "opinion", portuguese: "opinião" },
    { english: "problem", portuguese: "problema" },
    { english: "series", portuguese: "série" },
    { english: "movie", portuguese: "filme" },
    { english: "video", portuguese: "vídeo" },
    { english: "it", portuguese: "ele / ela (neutro)" },
    { english: "his", portuguese: "dele" },
    { english: "her", portuguese: "dela" },
  ];

  const grammarExamples = [
    { english: "She likes to talk about sports.", portuguese: "Ela gosta de conversar sobre esportes." },
    { english: "He goes to the company in the morning.", portuguese: "Ele vai para a empresa de manhã." },
    { english: "She needs to clean her house.", portuguese: "Ela precisa limpar a casa dela." },
    { english: "He doesn't understand this subject.", portuguese: "Ele não entende este assunto." },
  ];

  // ========== VERBS SUBSTITUTION (11 drills) ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Conversar, falar / Eu converso. / Nós conversamos. / Eles conversam.",
      options: [
        { label: "Conversar", replacement: "to talk.", pt: "Conversar / falar" },
        { label: "Eu converso", replacement: "I talk.", pt: "Eu converso." },
        { label: "Nós conversamos", replacement: "We talk.", pt: "Nós conversamos." },
        { label: "Eles conversam", replacement: "They talk.", pt: "Eles conversam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu converso com meu pai. / Com meu professor / Com minha mãe.",
      options: [
        { label: "meu pai", replacement: "I talk to my father.", pt: "Eu converso com meu pai." },
        { label: "meu professor", replacement: "I talk to my teacher.", pt: "Eu converso com meu professor." },
        { label: "minha mãe", replacement: "I talk to my mother.", pt: "Eu converso com minha mãe." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu preciso conversar com você. / Eles precisam conversar com você. / Nós precisamos conversar com você.",
      options: [
        { label: "Eu", replacement: "I need to talk to you.", pt: "Eu preciso conversar com você." },
        { label: "Eles", replacement: "They need to talk to you.", pt: "Eles precisam conversar com você." },
        { label: "Nós", replacement: "We need to talk to you.", pt: "Nós precisamos conversar com você." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você quer falar comigo? / Com meu chefe / Com meu vizinho.",
      options: [
        { label: "comigo", replacement: "Do you want to talk to me?", pt: "Você quer falar comigo?" },
        { label: "meu chefe", replacement: "Do you want to talk to my boss?", pt: "Você quer falar com meu chefe?" },
        { label: "meu vizinho", replacement: "Do you want to talk to my neighbor?", pt: "Você quer falar com meu vizinho?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Quando você quer conversar? / Onde? / A que horas?",
      options: [
        { label: "Quando", replacement: "When do you want to talk?", pt: "Quando você quer conversar?" },
        { label: "Onde", replacement: "Where do you want to talk?", pt: "Onde você quer conversar?" },
        { label: "A que horas", replacement: "What time do you want to talk?", pt: "A que horas você quer conversar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Assistir / Eu assisto. / Nós assistimos. / Eles assistem.",
      options: [
        { label: "Assistir", replacement: "to watch.", pt: "Assistir" },
        { label: "Eu assisto", replacement: "I watch.", pt: "Eu assisto." },
        { label: "Nós assistimos", replacement: "We watch.", pt: "Nós assistimos." },
        { label: "Eles assistem", replacement: "They watch.", pt: "Eles assistem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Ela assiste. / Ele assiste.",
      options: [
        { label: "Ela", replacement: "She watches.", pt: "Ela assiste." },
        { label: "Ele", replacement: "He watches.", pt: "Ele assiste." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu não assisto. / Nós não assistimos. / Eles não assistem.",
      options: [
        { label: "Eu", replacement: "I don't watch.", pt: "Eu não assisto." },
        { label: "Nós", replacement: "We don't watch.", pt: "Nós não assistimos." },
        { label: "Eles", replacement: "They don't watch.", pt: "Eles não assistem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Ele não assiste. / Ela não assiste.",
      options: [
        { label: "Ele", replacement: "He doesn't watch.", pt: "Ele não assiste." },
        { label: "Ela", replacement: "She doesn't watch.", pt: "Ela não assiste." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Ele assiste? / Ela assiste? / Eles assistem?",
      options: [
        { label: "Ele", replacement: "Does he watch?", pt: "Ele assiste?" },
        { label: "Ela", replacement: "Does she watch?", pt: "Ela assiste?" },
        { label: "Eles", replacement: "Do they watch?", pt: "Eles assistem?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "O que você quer assistir agora? / Hoje / Esta noite.",
      options: [
        { label: "agora", replacement: "What do you want to watch now?", pt: "O que você quer assistir agora?" },
        { label: "hoje", replacement: "What do you want to watch today?", pt: "O que você quer assistir hoje?" },
        { label: "esta noite", replacement: "What do you want to watch tonight?", pt: "O que você quer assistir esta noite?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION (12 drills) ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Ele gosta de conversar sobre ciência. / Música / Negócios.",
      options: [
        { label: "ciência", replacement: "He likes to talk about science.", pt: "Ele gosta de conversar sobre ciência." },
        { label: "música", replacement: "He likes to talk about music.", pt: "Ele gosta de conversar sobre música." },
        { label: "negócios", replacement: "He likes to talk about business.", pt: "Ele gosta de conversar sobre negócios." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ela gosta de conversar sobre esportes. / Moda / Religião.",
      options: [
        { label: "esportes", replacement: "She likes to talk about sports.", pt: "Ela gosta de conversar sobre esportes." },
        { label: "moda", replacement: "She likes to talk about fashion.", pt: "Ela gosta de conversar sobre moda." },
        { label: "religião", replacement: "She likes to talk about religion.", pt: "Ela gosta de conversar sobre religião." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você gosta de conversar sobre política? / Música / Ciência.",
      options: [
        { label: "política", replacement: "Do you like to talk about politics?", pt: "Você gosta de conversar sobre política?" },
        { label: "música", replacement: "Do you like to talk about music?", pt: "Você gosta de conversar sobre música?" },
        { label: "ciência", replacement: "Do you like to talk about science?", pt: "Você gosta de conversar sobre ciência?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu não quero falar sobre minha vida. / Este problema / Este filme.",
      options: [
        { label: "minha vida", replacement: "I don't want to talk about my life.", pt: "Eu não quero falar sobre minha vida." },
        { label: "este problema", replacement: "I don't want to talk about this problem.", pt: "Eu não quero falar sobre este problema." },
        { label: "este filme", replacement: "I don't want to talk about this movie.", pt: "Eu não quero falar sobre este filme." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu assisto a vídeos no meu celular. / Séries / Filmes.",
      options: [
        { label: "vídeos", replacement: "I watch videos on my phone.", pt: "Eu assisto a vídeos no meu celular." },
        { label: "séries", replacement: "I watch series on my phone.", pt: "Eu assisto a séries no meu celular." },
        { label: "filmes", replacement: "I watch movies on my phone.", pt: "Eu assisto a filmes no meu celular." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você quer assistir a esse filme comigo? / A essa série / A esse vídeo.",
      options: [
        { label: "filme", replacement: "Do you want to watch this movie with me?", pt: "Você quer assistir a esse filme comigo?" },
        { label: "série", replacement: "Do you want to watch this series with me?", pt: "Você quer assistir a essa série comigo?" },
        { label: "vídeo", replacement: "Do you want to watch this video with me?", pt: "Você quer assistir a esse vídeo comigo?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu geralmente compro muitas coisas. / Aqui / No centro.",
      options: [
        { label: "coisas", replacement: "I usually buy a lot of things.", pt: "Eu geralmente compro muitas coisas." },
        { label: "aqui", replacement: "I usually buy a lot of things here.", pt: "Eu geralmente compro muitas coisas aqui." },
        { label: "no centro", replacement: "I usually buy a lot of things downtown.", pt: "Eu geralmente compro muitas coisas no centro." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela quer estudar música na faculdade. / Política / Moda.",
      options: [
        { label: "música", replacement: "She wants to study music in college.", pt: "Ela quer estudar música na faculdade." },
        { label: "política", replacement: "She wants to study politics in college.", pt: "Ela quer estudar política na faculdade." },
        { label: "moda", replacement: "She wants to study fashion in college.", pt: "Ela quer estudar moda na faculdade." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Ele geralmente tem ótimas ideias. / Ela geralmente tem ótimas ideias. / Eles geralmente têm ótimas ideias.",
      options: [
        { label: "Ele", replacement: "He usually has great ideas.", pt: "Ele geralmente tem ótimas ideias." },
        { label: "Ela", replacement: "She usually has great ideas.", pt: "Ela geralmente tem ótimas ideias." },
        { label: "Eles", replacement: "They usually have great ideas.", pt: "Eles geralmente têm ótimas ideias." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu gosto das ideias dela. / Das ideias dele / Das suas ideias.",
      options: [
        { label: "dela", replacement: "I like her ideas.", pt: "Eu gosto das ideias dela." },
        { label: "dele", replacement: "I like his ideas.", pt: "Eu gosto das ideias dele." },
        { label: "suas", replacement: "I like your ideas.", pt: "Eu gosto das suas ideias." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Ela mora com o pai dela. / Com a mãe dela / Com a irmã dela.",
      options: [
        { label: "pai", replacement: "She lives with her father.", pt: "Ela mora com o pai dela." },
        { label: "mãe", replacement: "She lives with her mother.", pt: "Ela mora com a mãe dela." },
        { label: "irmã", replacement: "She lives with her sister.", pt: "Ela mora com a irmã dela." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Ele estuda com os amigos dele. / Com os colegas de classe / Com os primos.",
      options: [
        { label: "amigos", replacement: "He studies with his friends.", pt: "Ele estuda com os amigos dele." },
        { label: "colegas", replacement: "He studies with his classmates.", pt: "Ele estuda com os colegas de classe." },
        { label: "primos", replacement: "He studies with his cousins.", pt: "Ele estuda com os primos." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION (5 drills) ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu quero ir ao restaurante hoje à noite. / Ao cinema / Ao shopping.",
      options: [
        { label: "restaurante", replacement: "I want to go to the restaurant tonight.", pt: "Eu quero ir ao restaurante hoje à noite." },
        { label: "cinema", replacement: "I want to go to the movies tonight.", pt: "Eu quero ir ao cinema hoje à noite." },
        { label: "shopping", replacement: "I want to go to the mall tonight.", pt: "Eu quero ir ao shopping hoje à noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Aonde você quer ir hoje à noite? / Amanhã / Agora?",
      options: [
        { label: "hoje à noite", replacement: "Where do you want to go tonight?", pt: "Aonde você quer ir hoje à noite?" },
        { label: "amanhã", replacement: "Where do you want to go tomorrow?", pt: "Aonde você quer ir amanhã?" },
        { label: "agora", replacement: "Where do you want to go now?", pt: "Aonde você quer ir agora?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ele quer encontrar os amigos dele esta noite. / Esta tarde / Esta manhã.",
      options: [
        { label: "esta noite", replacement: "He wants to meet his friends tonight.", pt: "Ele quer encontrar os amigos dele esta noite." },
        { label: "esta tarde", replacement: "He wants to meet his friends this afternoon.", pt: "Ele quer encontrar os amigos dele esta tarde." },
        { label: "esta manhã", replacement: "He wants to meet his friends this morning.", pt: "Ele quer encontrar os amigos dele esta manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu não tenho uma opinião sobre isso. / Ele não tem uma opinião sobre isso. / Ela não tem uma opinião sobre isso.",
      options: [
        { label: "Eu", replacement: "I don't have an opinion about it.", pt: "Eu não tenho uma opinião sobre isso." },
        { label: "Ele", replacement: "He doesn't have an opinion about it.", pt: "Ele não tem uma opinião sobre isso." },
        { label: "Ela", replacement: "She doesn't have an opinion about it.", pt: "Ela não tem uma opinião sobre isso." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você tem uma opinião sobre este problema? / Sobre este assunto / Sobre este curso?",
      options: [
        { label: "problema", replacement: "Do you have an opinion about this problem?", pt: "Você tem uma opinião sobre este problema?" },
        { label: "assunto", replacement: "Do you have an opinion about this subject?", pt: "Você tem uma opinião sobre este assunto?" },
        { label: "curso", replacement: "Do you have an opinion about this course?", pt: "Você tem uma opinião sobre este curso?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION (11 drills) ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Ela gosta de conversar sobre esportes. / Quer conversar sobre esportes. / Prefere conversar sobre esportes.",
      options: [
        { label: "gosta", replacement: "She likes to talk about sports.", pt: "Ela gosta de conversar sobre esportes." },
        { label: "quer", replacement: "She wants to talk about sports.", pt: "Ela quer conversar sobre esportes." },
        { label: "prefere", replacement: "She prefers to talk about sports.", pt: "Ela prefere conversar sobre esportes." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ele vai para a empresa de manhã. / Ele dirige para a empresa de manhã. / Ele caminha para a empresa de manhã.",
      options: [
        { label: "vai", replacement: "He goes to the company in the morning.", pt: "Ele vai para a empresa de manhã." },
        { label: "dirige", replacement: "He drives to the company in the morning.", pt: "Ele dirige para a empresa de manhã." },
        { label: "caminha", replacement: "He walks to the company in the morning.", pt: "Ele caminha para a empresa de manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ela precisa limpar a casa dela. / Ela quer limpar a casa dela. / Ela tem que limpar a casa dela.",
      options: [
        { label: "precisa", replacement: "She needs to clean her house.", pt: "Ela precisa limpar a casa dela." },
        { label: "quer", replacement: "She wants to clean her house.", pt: "Ela quer limpar a casa dela." },
        { label: "tem que", replacement: "She has to clean her house.", pt: "Ela tem que limpar a casa dela." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ela não mora aqui. / Ela não mora lá. / Ela não mora no centro da cidade.",
      options: [
        { label: "aqui", replacement: "She doesn't live here.", pt: "Ela não mora aqui." },
        { label: "lá", replacement: "She doesn't live there.", pt: "Ela não mora lá." },
        { label: "centro", replacement: "She doesn't live downtown.", pt: "Ela não mora no centro da cidade." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ele não entende este assunto. / Esta palavra / Esta língua.",
      options: [
        { label: "assunto", replacement: "He doesn't understand this subject.", pt: "Ele não entende este assunto." },
        { label: "palavra", replacement: "He doesn't understand this word.", pt: "Ele não entende esta palavra." },
        { label: "língua", replacement: "He doesn't understand this language.", pt: "Ele não entende esta língua." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ela quer aprender mais? / Estudar mais? / Saber mais?",
      options: [
        { label: "aprender", replacement: "Does she want to learn more?", pt: "Ela quer aprender mais?" },
        { label: "estudar", replacement: "Does she want to study more?", pt: "Ela quer estudar mais?" },
        { label: "saber", replacement: "Does she want to know more?", pt: "Ela quer saber mais?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ela fica em casa nos fins de semana? / Aos sábados? / Nas férias?",
      options: [
        { label: "fins de semana", replacement: "Does she stay home on weekends?", pt: "Ela fica em casa nos fins de semana?" },
        { label: "sábados", replacement: "Does she stay home on Saturdays?", pt: "Ela fica em casa aos sábados?" },
        { label: "férias", replacement: "Does she stay home on vacation?", pt: "Ela fica em casa nas férias?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Começa às oito horas. / Às nove horas / Às dez horas.",
      options: [
        { label: "oito", replacement: "It starts at eight o'clock.", pt: "Começa às oito horas." },
        { label: "nove", replacement: "It starts at nine o'clock.", pt: "Começa às nove horas." },
        { label: "dez", replacement: "It starts at ten o'clock.", pt: "Começa às dez horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "O curso começa amanhã. / O projeto começa amanhã. / A série começa amanhã.",
      options: [
        { label: "curso", replacement: "The course starts tomorrow.", pt: "O curso começa amanhã." },
        { label: "projeto", replacement: "The project starts tomorrow.", pt: "O projeto começa amanhã." },
        { label: "série", replacement: "The series starts tomorrow.", pt: "A série começa amanhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Não termina esta semana. / Não termina esta tarde. / Não termina hoje.",
      options: [
        { label: "esta semana", replacement: "It doesn't finish this week.", pt: "Não termina esta semana." },
        { label: "esta tarde", replacement: "It doesn't finish this afternoon.", pt: "Não termina esta tarde." },
        { label: "hoje", replacement: "It doesn't finish today.", pt: "Não termina hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Começa agora? / Em 15 minutos? / Em uma hora?",
      options: [
        { label: "agora", replacement: "Does it start now?", pt: "Começa agora?" },
        { label: "15 minutos", replacement: "Does it start in 15 minutes?", pt: "Começa em 15 minutos?" },
        { label: "uma hora", replacement: "Does it start in an hour?", pt: "Começa em uma hora?" },
      ],
      currentIndex: 0,
    },
  ];

  // Real Life Practice sentences
  const realLifeSentences = [
    { english: "I need to talk to you about the project.", portuguese: "Eu preciso conversar com você sobre o projeto." },
    { english: "She talks to her mother about everything.", portuguese: "Ela conversa com a mãe dela sobre tudo." },
    { english: "What do you want to watch on TV tonight?", portuguese: "O que você quer assistir na TV esta noite?" },
    { english: "They want to watch a movie this weekend.", portuguese: "Eles querem assistir um filme neste fim de semana." },
    { english: "Do you have an opinion about this problem?", portuguese: "Você tem uma opinião sobre este problema?" },
    { english: "I like to talk about science and politics.", portuguese: "Eu gosto de falar sobre ciência e política." },
    { english: "He usually has great ideas.", portuguese: "Ele geralmente tem ótimas ideias." },
    { english: "We watch series on our phones.", portuguese: "Nós assistimos séries nos nossos celulares." },
    { english: "What time does the movie start?", portuguese: "A que horas começa o filme?" },
    { english: "She doesn't want to talk about this subject.", portuguese: "Ela não quer falar sobre este assunto." },
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
            🗣️ Lesson 33 - Talk & Watch
          </h1>
          <SpeakSentence text="Learn to talk about different subjects, watch content and express your opinions." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about different subjects, watch content and express your opinions.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="People talking"
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
            <SpeakSentence text="Practice common phrases for preferences and opinions" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for preferences and opinions
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
                  { en: "I want to go to the restaurant tonight.", pt: "Eu quero ir ao restaurante hoje à noite." },
                  { en: "Where do you want to go tonight?", pt: "Aonde você quer ir hoje à noite?" },
                  { en: "He wants to meet his friends tonight.", pt: "Ele quer encontrar os amigos dele esta noite." },
                  { en: "I don't have an opinion about it.", pt: "Eu não tenho uma opinião sobre isso." },
                  { en: "Do you have an opinion about this problem?", pt: "Você tem uma opinião sobre este problema?" },
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
            <SpeakSentence text="Structures for preferences, routines and schedules" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for preferences, routines and schedules
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
                        src={talkImage}
                        alt="People talking"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Talking and conversation</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={watchImage}
                        alt="Watching movies"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Watching movies and series</p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={opinionImage}
                        alt="Sharing opinions"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Sharing opinions</p>
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
              <SpeakSentence text="Key structures to remember" className="mt-2 text-blue-100 italic">
                📝 Key structures to remember
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">AFFIRMATIVE</h3>
              {[
                { en: "I talk to my father every day.", pt: "Eu converso com meu pai todos os dias." },
                { en: "She watches series on her phone.", pt: "Ela assiste séries no celular dela." },
                { en: "He likes to talk about science.", pt: "Ele gosta de falar sobre ciência." },
                { en: "We usually have great ideas.", pt: "Nós geralmente temos ótimas ideias." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-green-700 rounded-lg">
                  <SpeakSentence text={item.en} className="font-bold text-green-50">{item.en}</SpeakSentence>
                  <p className="text-green-200 text-sm mt-1">{item.pt}</p>
                </div>
              ))}
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">NEGATIVE & QUESTIONS</h3>
              {[
                { en: "I don't want to talk about my life.", pt: "Eu não quero falar sobre minha vida." },
                { en: "She doesn't have an opinion about it.", pt: "Ela não tem uma opinião sobre isso." },
                { en: "Does he watch movies?", pt: "Ele assiste filmes?" },
                { en: "What time does the series start?", pt: "A que horas começa a série?" },
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
                    <p className="text-red-200 text-xs">Talking, watching and sharing opinions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (32)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (34) &rarr;
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