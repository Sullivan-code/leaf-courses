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
  const speak = () => {
    speakEnglish(text, 0.9);
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
        speakEnglish(speechText, 0.85);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
type OptionType = string | { label: string; replacement: string; pt?: string };

interface SubstitutionExercise {
  key: string;
  original: string;
  base?: string;
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
  const [showPt, setShowPt] = useState(true);

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

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.label;
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.replacement;
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
          {currentPt && (
            <div className="flex items-center justify-between mt-1 border-t border-green-200 pt-1">
              {showPt ? (
                <>
                  <p className="text-sm text-gray-600">🇧🇷 {currentPt}</p>
                  <button 
                    onClick={() => setShowPt(false)} 
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    title="Ocultar tradução em português"
                  >
                    <EyeOff size={12} /> Ocultar
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setShowPt(true)} 
                  className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 ml-auto"
                  title="Mostrar tradução em português"
                >
                  <Eye size={12} /> Mostrar tradução
                </button>
              )}
            </div>
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
                ? 'bg-green-500 text-white'
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
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
// MAIN COMPONENT – LESSON 67
// ============================================
export default function Lesson67MyStory() {
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);
  const [showMakeItYoursPt, setShowMakeItYoursPt] = useState(true);

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

  const mainImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const grammarImage = "https://github.com/Sullivan-code/leaf-courses/blob/main/l63-grammar?raw=true"; 

  // ---------- VERBS (TO BE - PAST) - COM PROGRESSÃO B1/B2+ ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu estava animado com a prova. / project / trip",
      options: [
        { label: "prova", replacement: "I was excited about the exam.", pt: "Eu estava animado com a prova." },
        { label: "project", replacement: "I was excited about the new project.", pt: "Eu estava animado com o novo projeto." },
        { label: "trip", replacement: "I was excited about the trip, but I had to cancel it.", pt: "Eu estava animado com a viagem, mas tive que cancelá-la." } // B1+
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eles estavam entediados em casa. / excited / embarrassed",
      options: [
        { label: "entediados", replacement: "They were bored at home.", pt: "Eles estavam entediados em casa." },
        { label: "excited", replacement: "They were excited at home because their friends arrived.", pt: "Eles estavam animados em casa porque seus amigos chegaram." }, // B1+
        { label: "embarrassed", replacement: "They were embarrassed at home after the incident.", pt: "Eles estavam com vergonha em casa depois do incidente." } // B1+
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "O verão passado foi ótimo. / fall / winter",
      options: [
        { label: "verão", replacement: "Last summer was great.", pt: "O verão passado foi ótimo." },
        { label: "fall", replacement: "Last fall was amazing, especially the colors of the leaves.", pt: "O outono passado foi incrível, especialmente as cores das folhas." }, // B2
        { label: "winter", replacement: "Last winter was freezing, but we managed to enjoy it.", pt: "O inverno passado foi congelante, mas conseguimos aproveitar." } // B2
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Eles estavam frustrados com as férias de inverno. / summer / fall",
      options: [
        { label: "inverno", replacement: "They were frustrated with the winter vacation.", pt: "Eles estavam frustrados com as férias de inverno." },
        { label: "summer", replacement: "They were frustrated with the summer vacation because it rained every day.", pt: "Eles estavam frustrados com as férias de verão porque choveu todos os dias." }, // B2
        { label: "fall", replacement: "They were frustrated with the fall trip due to the terrible weather.", pt: "Eles estavam frustrados com a viagem de outono devido ao tempo terrível." } // B2+
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "She was embarrassed to talk about sports. / politics / religion",
      options: [
        { label: "sports", replacement: "She was embarrassed to talk about sports in front of the professionals.", pt: "Ela estava com vergonha de falar sobre esportes na frente dos profissionais." },
        { label: "politics", replacement: "She was embarrassed to talk about politics during the family dinner.", pt: "Ela estava com vergonha de falar sobre política durante o jantar em família." },
        { label: "religion", replacement: "She was embarrassed to talk about religion at the international conference.", pt: "Ela estava com vergonha de falar sobre religião na conferência internacional." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Estes chalés eram ótimos. / two-story houses / townhouses",
      options: [
        { label: "chalés", replacement: "These cottages were great for a quiet weekend.", pt: "Estes chalés eram ótimos para um fim de semana tranquilo." },
        { label: "two-story houses", replacement: "These two-story houses were perfect for large families.", pt: "Estas casas de dois andares eram perfeitas para famílias grandes." },
        { label: "townhouses", replacement: "These townhouses were modern and very well located.", pt: "Estas casas geminadas eram modernas e muito bem localizadas." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "O dentista foi muito cuidadoso. / engineer / artist",
      options: [
        { label: "dentista", replacement: "The dentist was very careful during the procedure.", pt: "O dentista foi muito cuidadoso durante o procedimento." },
        { label: "engineer", replacement: "The engineer was extremely careful with the calculations.", pt: "O engenheiro foi extremamente cuidadoso com os cálculos." },
        { label: "artist", replacement: "The artist was very careful not to ruin the painting.", pt: "O artista foi muito cuidadoso para não arruinar a pintura." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "A reunião foi constrangedora. / article / report",
      options: [
        { label: "reunião", replacement: "The meeting was extremely awkward for everyone involved.", pt: "A reunião foi extremamente constrangedora para todos os envolvidos." },
        { label: "article", replacement: "The article was controversial and caused a huge debate.", pt: "O artigo foi polêmico e causou um enorme debate." },
        { label: "report", replacement: "The report was confusing and lacked concrete data.", pt: "O relatório foi confuso e faltou com dados concretos." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "O filho estava entediado esta manhã. / animado / desapontado",
      options: [
        { label: "entediado", replacement: "The child was bored this morning.", pt: "O filho estava entediado esta manhã." },
        { label: "animado", replacement: "The child was excited this morning.", pt: "O filho estava animado esta manhã." },
        { label: "desapontado", replacement: "The child was disappointed this morning.", pt: "O filho estava desapontado esta manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu me senti envergonhado naquela situação. / assustado / frustrado",
      options: [
        { label: "envergonhado", replacement: "I felt embarrassed in that situation.", pt: "Eu me senti envergonhado naquela situação." },
        { label: "assustado", replacement: "I felt scared in that situation.", pt: "Eu me senti assustado naquela situação." },
        { label: "frustrado", replacement: "I felt frustrated in that situation.", pt: "Eu me senti frustrado naquela situação." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ela é muito cuidadosa com o seu trabalho. / descuidada",
      options: [
        { label: "cuidadosa", replacement: "She is very careful with her work.", pt: "Ela é muito cuidadosa com o seu trabalho." },
        { label: "descuidada", replacement: "She is very careless with her work.", pt: "Ela é muito descuidada com o seu trabalho." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Nós viajamos no verão passado. / primavera / outono",
      options: [
        { label: "verão", replacement: "We traveled last summer.", pt: "Nós viajamos no verão passado." },
        { label: "primavera", replacement: "We traveled last spring.", pt: "Nós viajamos na primavera passada." },
        { label: "outono", replacement: "We traveled last fall.", pt: "Nós viajamos no outono passado." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE (Open Drills) ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "He is amazing. You can rely on him. / great / careful",
      options: [
        { label: "amazing", replacement: "He is amazing. You can rely on him to finish the project.", pt: "Ele é incrível. Você pode contar com ele para terminar o projeto." },
        { label: "great", replacement: "He is great. You can rely on him during the crisis.", pt: "Ele é ótimo. Você pode contar com ele durante a crise." },
        { label: "careful", replacement: "He is careful. You can rely on him with the delicate equipment.", pt: "Ele é cuidadoso. Você pode contar com ele com o equipamento delicado." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Be careful! This trip is dangerous. / avenue / station",
      options: [
        { label: "dangerous", replacement: "Be careful! This trip is dangerous because of the heavy snow.", pt: "Tome cuidado! Esta viagem é perigosa por causa da neve pesada." },
        { label: "avenue", replacement: "Be careful! This avenue is dangerous at night.", pt: "Tome cuidado! Esta avenida é perigosa à noite." },
        { label: "station", replacement: "Be careful! This station is dangerous late at night.", pt: "Tome cuidado! Esta estação é perigosa tarde da noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ela estava na praia dois dias atrás. / week / months",
      options: [
        { label: "dois dias", replacement: "She was at the beach two days ago.", pt: "Ela estava na praia dois dias atrás." },
        { label: "week", replacement: "She was at the beach a week ago, enjoying the sun.", pt: "Ela estava na praia uma semana atrás, aproveitando o sol." },
        { label: "months", replacement: "She was at the beach two months ago during the holiday.", pt: "Ela estava na praia dois meses atrás durante o feriado." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eles estavam desapontados com o curso. / happy / frustrated",
      options: [
        { label: "desapontados", replacement: "They were disappointed with the course because of the lack of practice.", pt: "Eles estavam desapontados com o curso por falta de prática." },
        { label: "happy", replacement: "They were happy with the course and learned a lot.", pt: "Eles estavam felizes com o curso e aprenderam muito." },
        { label: "frustrated", replacement: "They were frustrated with the course, so they asked for a refund.", pt: "Eles estavam frustrados com o curso, então pediram reembolso." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Ele estava entediado, mas ela estava animada. / they / we",
      options: [
        { label: "Ele / ela", replacement: "He was bored, but she was excited.", pt: "Ele estava entediado, mas ela estava animada." },
        { label: "They / we", replacement: "They were bored, but we were excited about the new place.", pt: "Eles estavam entediados, mas nós estávamos animados com o novo lugar." }
      ],
      currentIndex: 0,
    },
    // NOVOS EXERCÍCIOS SOLICITADOS
    {
      key: "phrase-6",
      original: "We're under control over here. (Estamos sob controle por aqui.)",
      options: [
        { label: "We're", replacement: "We're under control over here, so you don't need to worry.", pt: "Estamos sob controle por aqui, então você não precisa se preocupar." },
        { label: "The situation is", replacement: "The situation is under control over here, despite the chaos.", pt: "A situação está sob controle por aqui, apesar do caos." },
        { label: "Everything is", replacement: "Everything is under control over here, we just need to wait.", pt: "Tudo está sob controle por aqui, só precisamos esperar." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "It was in a summer abroad. / winter / spring",
      options: [
        { label: "summer", replacement: "It was in a summer abroad that I learned to speak French.", pt: "Foi em um verão no exterior que eu aprendi a falar francês." },
        { label: "winter", replacement: "It was in a winter abroad, freezing and beautiful.", pt: "Foi em um inverno no exterior, congelante e bonito." },
        { label: "spring", replacement: "It was in a spring abroad, when the flowers were blooming.", pt: "Foi em uma primavera no exterior, quando as flores estavam desabrochando." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR (OPEN DRILLS - COMPLETO) ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu estava no cinema ontem. / park / museum",
      options: [
        { label: "cinema", replacement: "I was at the movies yesterday.", pt: "Eu estava no cinema ontem." },
        { label: "park", replacement: "I was at the park yesterday afternoon.", pt: "Eu estava no parque ontem à tarde." },
        { label: "museum", replacement: "I was at the museum yesterday for an exhibition.", pt: "Eu estava no museu ontem para uma exposição." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "I wasn't excited about my summer vacation. / fall / winter",
      options: [
        { label: "summer", replacement: "I wasn't excited about my summer vacation because I had to work.", pt: "Eu não estava animado com as minhas férias de verão porque eu tive que trabalhar." },
        { label: "fall", replacement: "I wasn't excited about my fall trip because the weather forecast was bad.", pt: "Eu não estava animado com a minha viagem de outono porque a previsão do tempo era ruim." },
        { label: "winter", replacement: "I wasn't excited about my winter vacation because I hate the cold.", pt: "Eu não estava animado com as minhas férias de inverno porque eu odeio o frio." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele não estava no chalé ontem à noite. / apartment / two-story house",
      options: [
        { label: "chalé", replacement: "He wasn't at the cottage last night.", pt: "Ele não estava no chalé ontem à noite." },
        { label: "apartamento", replacement: "He wasn't at the apartment last night.", pt: "Ele não estava no apartamento ontem à noite." },
        { label: "sobrado", replacement: "He wasn't at the two-story house last night.", pt: "Ele não estava no sobrado ontem à noite." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "She wasn't careful with her kids. / parents / students",
      options: [
        { label: "kids", replacement: "She wasn't careful with her kids.", pt: "Ela não foi cuidadosa com as crianças dela." },
        { label: "parents", replacement: "She wasn't careful with her parents' advice.", pt: "Ela não foi cuidadosa com o conselho dos pais dela." },
        { label: "students", replacement: "She wasn't careful with her students during the experiment.", pt: "Ela não foi cuidadosa com os alunos dela durante o experimento." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "It wasn't cold at the beach yesterday. / last week / three days ago",
      options: [
        { label: "yesterday", replacement: "It wasn't cold at the beach yesterday.", pt: "Não estava frio na praia ontem." },
        { label: "last week", replacement: "It wasn't cold at the beach last week.", pt: "Não estava frio na praia na semana passada." },
        { label: "three days ago", replacement: "It wasn't cold at the beach three days ago.", pt: "Não estava frio na praia três dias atrás." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Minha avó era muito bonita. / aunt / mother",
      options: [
        { label: "avó", replacement: "My grandmother was very beautiful.", pt: "Minha avó era muito bonita." },
        { label: "tia", replacement: "My aunt was very beautiful.", pt: "Minha tia era muito bonita." },
        { label: "mãe", replacement: "My mother was very beautiful.", pt: "Minha mãe era muito bonita." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "We weren't in Italy last January. / February / July",
      options: [
        { label: "January", replacement: "We weren't in Italy last January.", pt: "Nós não estávamos na Itália em janeiro passado." },
        { label: "February", replacement: "We weren't in Italy last February.", pt: "Nós não estávamos na Itália em fevereiro passado." },
        { label: "July", replacement: "We weren't in Italy last July.", pt: "Nós não estávamos na Itália em julho passado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Vocês não estavam ocupados no final de semana passado. / tired / upset",
      options: [
        { label: "ocupados", replacement: "You weren't busy last weekend.", pt: "Vocês não estavam ocupados no final de semana passado." },
        { label: "tired", replacement: "You weren't tired last weekend.", pt: "Vocês não estavam cansados no final de semana passado." },
        { label: "upset", replacement: "You weren't upset last weekend.", pt: "Vocês não estavam chateados no final de semana passado." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eles não estavam no escritório no sábado passado. / last week / two days ago",
      options: [
        { label: "sábado passado", replacement: "They weren't at the office last Saturday.", pt: "Eles não estavam no escritório no sábado passado." },
        { label: "last week", replacement: "They weren't at the office last week.", pt: "Eles não estavam no escritório na semana passada." },
        { label: "two days ago", replacement: "They weren't at the office two days ago.", pt: "Eles não estavam no escritório dois dias atrás." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Seu quarto estava bagunçado ontem. / tidy / dirty",
      options: [
        { label: "bagunçado", replacement: "Your room was messy yesterday.", pt: "Seu quarto estava bagunçado ontem." },
        { label: "tidy", replacement: "Your room was tidy yesterday.", pt: "Seu quarto estava arrumado ontem." },
        { label: "dirty", replacement: "Your room was dirty yesterday.", pt: "Seu quarto estava sujo ontem." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Seu crachá não estava na gaveta. / ID / driver's license",
      options: [
        { label: "crachá", replacement: "Your name tag wasn't in the drawer.", pt: "Seu crachá não estava na gaveta." },
        { label: "ID", replacement: "Your ID wasn't in the drawer.", pt: "Seu documento não estava na gaveta." },
        { label: "driver's license", replacement: "Your driver's license wasn't in the drawer.", pt: "Sua habilitação não estava na gaveta." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Os sapatos estavam embaixo da cama. / desk / armchair",
      options: [
        { label: "cama", replacement: "The shoes were under the bed.", pt: "Os sapatos estavam embaixo da cama." },
        { label: "desk", replacement: "The shoes were under the desk.", pt: "Os sapatos estavam embaixo da mesa." },
        { label: "armchair", replacement: "The shoes were under the armchair.", pt: "Os sapatos estavam embaixo da poltrona." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [...verbsSubstitution, ...vocabSubstitution, ...phrasesSubstitution, ...grammarSubstitution];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  const usefulPhrasesData = [
    {
      en: "You can rely on me.",
      pt: "Você pode contar comigo.",
      green: ["rely", "me"]
    },
    {
      en: "We're under control over here.",
      pt: "Estamos sob controle por aqui.",
      green: ["under control", "over here"]
    },
    {
      en: "Be careful! This trip is dangerous.",
      pt: "Tome cuidado! Esta viagem é perigosa.",
      green: ["careful", "dangerous"]
    },
    {
      en: "I was there last week.",
      pt: "Eu estive lá na semana passada.",
      green: ["was", "last week"]
    },
    {
      en: "It was in a summer abroad.",
      pt: "Foi em um verão no exterior.",
      green: ["summer", "abroad"]
    },
    {
      en: "My parents were in Europe five days ago.",
      pt: "Meus pais estavam na Europa cinco dias atrás.",
      green: ["were", "five days ago"]
    }
  ];

  // ---------- MAKE IT YOURS DATA ----------
  const makeItYoursData = [
    { en: "I was very excited about the trip, but my brother was a bit scared of flying.", pt: "Eu estava muito animado com a viagem, mas meu irmão estava um pouco assustado de voar.", green: ["excited", "scared"] },
    { en: "They were disappointed with the hotel because it wasn't clean.", pt: "Eles estavam desapontados com o hotel porque não estava limpo.", green: ["disappointed", "wasn't clean"] },
    { en: "We were in the countryside last spring, and the view was amazing.", pt: "Nós estávamos no campo na primavera passada, e a vista era incrível.", green: ["last spring", "amazing"] },
    { en: "The meeting was really frustrating yesterday, so I was exhausted afterwards.", pt: "A reunião foi muito frustrante ontem, então eu estava exausto depois.", green: ["frustrating", "exhausted"] },
    { en: "She was embarrassed because she forgot her lines during the presentation.", pt: "Ela estava envergonhada porque esqueceu suas falas durante a apresentação.", green: ["embarrassed", "forgot"] },
    { en: "You can rely on him; he is a very careful and responsible person.", pt: "Você pode contar com ele; ele é uma pessoa muito cuidadosa e responsável.", green: ["rely on", "careful"] },
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
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📖 Lesson 67 - My Story</h1>
          <SpeakSentence text="Learn to talk about past events, feelings, and experiences." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about past events, feelings, and experiences.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="My story"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
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
            
            <div className="bg-green-50 p-6 rounded-2xl mb-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-4 text-xl">Verb "to be" (past)</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-3 mb-2 text-lg">
                <li><SpeakText text="to be" className="text-green-600 font-bold">to be</SpeakText> = ser ou estar</li>
                <li><SpeakText text="I was" className="text-green-600 font-bold">I was</SpeakText> = eu era, fui, estava, estive / <strong className="text-gray-500">he / she / it</strong></li>
                <li><SpeakText text="We were" className="text-green-600 font-bold">We were</SpeakText> = nós éramos, fomos, estávamos / <strong className="text-gray-500">they / you</strong></li>
                <li><SpeakText text="I wasn't" className="text-green-600 font-bold">I wasn't</SpeakText> = eu não era, não fui, não estava / <strong className="text-gray-500">he / she</strong></li>
                <li><SpeakText text="You weren't" className="text-green-600 font-bold">You weren't</SpeakText> = você não era, não foi, não estava / <strong className="text-gray-500">they / we</strong></li>
              </ul>
            </div>

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
                { en: "bored", pt: "entediado" },
                { en: "excited", pt: "animado" },
                { en: "disappointed", pt: "desapontado" },
                { en: "embarrassed", pt: "envergonhado" },
                { en: "frustrated", pt: "frustrado" },
                { en: "amazing", pt: "incrível" },
                { en: "careful", pt: "cuidadoso" },
                { en: "careless", pt: "descuidado" },
                { en: "scared", pt: "assustado" },
                { en: "spring", pt: "primavera" },
                { en: "summer", pt: "verão" },
                { en: "fall", pt: "outono" },
                { en: "winter", pt: "inverno" },
                { en: "yesterday", pt: "ontem" },
                { en: "last", pt: "último / passado" },
                { en: "ago", pt: "atrás" },
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

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Open Drills)</h2>
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
            <SpeakSentence text="Structures for talking about the past and expressing feelings" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for talking about the past and expressing feelings
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Past tense"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "The children were bored this morning.", pt: "As crianças estavam entediadas esta manhã." },
                { en: "He wasn't very careful about the problem.", pt: "Ele não foi muito cuidadoso com o problema." },
                { en: "What an awkward situation!", pt: "Que situação estranha/embaraçosa!" },
                { en: "It wasn't hot at the beach yesterday.", pt: "Não estava quente na praia ontem." },
                { en: "They were frustrated during the trip.", pt: "Eles estavam frustrados durante a viagem." },
                { en: "John was very disappointed with the food.", pt: "John estava muito desapontado com a comida." },
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
            <div className="flex items-center gap-4">
              <div className="text-sm text-green-100 hidden md:block">Practice real-life situations</div>
              <button
                onClick={() => setShowMakeItYoursPt(!showMakeItYoursPt)}
                className="p-1 rounded hover:bg-white/20 transition-colors text-white"
                title={showMakeItYoursPt ? "Ocultar tradução em português" : "Mostrar tradução em português"}
              >
                {showMakeItYoursPt ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              
              <div className="mb-6 p-4 bg-white/60 border border-green-200 rounded-xl flex items-start gap-3">
                <span className="text-xl">💡</span>
                <p className="text-gray-700 font-medium">
                  <strong className="text-green-600">Instructions:</strong> Substitute the words highlighted in <span className="text-green-600 font-bold">green</span> with words of your choice to create new sentences in English. Use the eye button at the top to hide the Portuguese translation.
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-5">
                  {makeItYoursData.map((s, idx) => (
                    <div key={idx} className="group bg-white p-4 rounded-xl shadow-sm border border-green-100">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-lg font-medium leading-relaxed">
                          {idx+1}. {s.en.split(/(\s+)/).map((word, i) => {
                            const cleanWord = word.replace(/[.,!?;:]/g, '');
                            if (s.green.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
                              return <span key={i} className="text-green-600 font-bold">{word}</span>;
                            }
                            return <span key={i}>{word}</span>;
                          })}
                        </SpeakSentence>
                      </div>
                      
                      {showMakeItYoursPt && (
                        <p className="text-base text-gray-600 mt-1 ml-6 border-t border-gray-100 pt-2">🇧🇷 {s.pt}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src="https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Organizing your space" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Memories and feelings</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src="https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Daily routine at home" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Reflecting on the past</p>
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
                { en: "You can rely on me.", pt: "Você pode contar comigo." },
                { en: "We're under control over here.", pt: "Estamos sob controle por aqui." },
                { en: "I was there last week.", pt: "Eu estive lá na semana passada." },
                { en: "The children were bored this morning.", pt: "As crianças estavam entediadas esta manhã." },
                { en: "They were frustrated during the trip.", pt: "Eles estavam frustrados durante a viagem." },
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
                    <li>Use <strong className="text-white">"was"</strong> for I, he, she, it.</li>
                    <li>Use <strong className="text-white">"were"</strong> for you, we, they.</li>
                    <li><strong className="text-white">"Ago"</strong> is used for past time (e.g., two days ago).</li>
                    <li><strong className="text-white">"Last"</strong> is used before time words (e.g., last week, last summer).</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-green-200">"What an awkward situation!" is a common exclamation to express embarrassment or discomfort.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/intermediate/lesson66")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (66)
          </button>
          <button onClick={() => router.push("/cursos/intermediate/lesson68")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (68) &rarr;
          </button>
        </div>
      </div>

      {/* ===== BOTÃO FLUTUANTE DE ANOTAÇÕES ===== */}
      <button
        onClick={() => openNoteModal('Anotações Gerais')}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-800 transition-all duration-300 z-50 flex items-center justify-center"
        title="Fazer anotações gerais"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-[spin-slow_4s_linear_infinite]" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
      </button>

      {/* ===== MODAL PARA AMPLIAR A IMAGEM DA GRAMMAR ===== */}
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

      {/* ===== MODAL PARA AMPLIAR A IMAGEM PRINCIPAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="My story – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
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
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}