"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Check, XCircle } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'mc';

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
      type="button"
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
      type="button"
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
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
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-cyan-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" type="button">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-800 transition-all duration-300" type="button">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-cyan-500 transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// STICKY HIDE/SHOW ENGLISH TOGGLE (SECTION LEVEL)
// ============================================

function StickyHideEnglishToggle({
  hidden,
  onToggle,
}: {
  hidden: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="sticky top-4 z-30 flex justify-end mb-4 pointer-events-none">
      <button
        onClick={onToggle}
        className={`pointer-events-auto inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-lg border-2 ${
          hidden
            ? 'bg-amber-400 hover:bg-amber-500 text-white border-amber-300'
            : 'bg-white/95 backdrop-blur hover:bg-cyan-100 text-cyan-700 border-cyan-300'
        }`}
        type="button"
        title={hidden ? 'Mostrar inglês em todos os cards' : 'Ocultar inglês em todos os cards desta seção'}
      >
        {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
        {hidden ? 'Mostrar Todos' : 'Só PT (todos)'}
      </button>
    </div>
  );
}

// ============================================
// SUBSTITUTION EXERCISE COMPONENT
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
  hideEnglish = false,
  onToggleHide,
}: {
  exercise: SubstitutionExercise;
  onOptionClick: (key: string, index: number) => void;
  hideEnglish?: boolean;
  onToggleHide?: () => void;
}) {
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

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.label;
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) return opt.replacement;
    return String(opt);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-cyan-200">
      <div className="flex items-start justify-between mb-2 gap-2">
        <p className="text-cyan-700 font-medium block flex-1">{exercise.original}</p>
        {onToggleHide && (
          <button
            onClick={onToggleHide}
            className={`flex-shrink-0 p-1.5 rounded-full transition-all border ${
              hideEnglish
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-300'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-600 border-cyan-200'
            }`}
            title={hideEnglish ? "Mostrar inglês deste card" : "Ocultar inglês deste card (só PT)"}
            type="button"
            aria-label={hideEnglish ? "Mostrar inglês deste card" : "Ocultar inglês deste card"}
          >
            {hideEnglish ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
        )}
      </div>

      <div className="mb-3 p-3 bg-cyan-50 rounded-md">
        {!hideEnglish && (
          <SpeakSentence text={currentSentence} className="text-cyan-800 font-medium" />
        )}
        {currentPt && (
          <p className={`text-sm text-gray-600 ${!hideEnglish ? "mt-1 border-t border-cyan-200 pt-1" : ""}`}>
            🇧🇷 {currentPt}
          </p>
        )}
        {hideEnglish && !currentPt && (
          <p className="text-sm text-gray-500 italic">🔒 Inglês oculto — clique na opção para ouvir</p>
        )}
      </div>

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
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            type="button"
          >
            {getOptionLabel(option)}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HIGHLIGHTED PHRASE COMPONENT
// ============================================

function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-cyan-700 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-cyan-200">
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
// MULTIPLE CHOICE COMPONENT
// ============================================

interface MCQItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function MultipleChoice({ items }: { items: MCQItem[] }) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});

  const handleSelect = (qIdx: number, optIdx: number) => {
    if (submitted[qIdx]) return;
    setSelected((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCheck = (qIdx: number) => {
    if (selected[qIdx] === undefined) return;
    setSubmitted((prev) => ({ ...prev, [qIdx]: true }));
  };

  const handleReset = (qIdx: number) => {
    setSelected((prev) => {
      const c = { ...prev };
      delete c[qIdx];
      return c;
    });
    setSubmitted((prev) => {
      const c = { ...prev };
      delete c[qIdx];
      return c;
    });
  };

  const score = Object.entries(submitted).filter(
    ([k]) => selected[Number(k)] === items[Number(k)].correctIndex
  ).length;
  const answered = Object.keys(submitted).length;

  return (
    <div>
      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        📊 Progress: <strong>{answered}</strong> / {items.length} answered •{" "}
        <strong>{score}</strong> correct
      </div>
      <div className="space-y-5">
        {items.map((item, qIdx) => {
          const isSubmitted = submitted[qIdx];
          const userChoice = selected[qIdx];
          const isCorrect = userChoice === item.correctIndex;

          return (
            <div key={qIdx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-800 mb-3 font-medium">
                <span className="font-bold text-cyan-700">Q{qIdx + 1}.</span>{" "}
                {item.question}
              </p>
              <div className="space-y-2">
                {item.options.map((opt, optIdx) => {
                  let cls =
                    "border-gray-300 bg-white hover:border-cyan-500 hover:bg-cyan-50";
                  if (isSubmitted) {
                    if (optIdx === item.correctIndex)
                      cls = "border-green-500 bg-green-100";
                    else if (optIdx === userChoice && !isCorrect)
                      cls = "border-red-500 bg-red-100";
                    else cls = "border-gray-200 bg-gray-50 opacity-60";
                  } else if (userChoice === optIdx) {
                    cls = "border-cyan-600 bg-cyan-100";
                  }
                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelect(qIdx, optIdx)}
                      disabled={isSubmitted}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-2 text-sm ${cls}`}
                      type="button"
                    >
                      <span className="font-bold text-xs">
                        {String.fromCharCode(65 + optIdx)})
                      </span>
                      <span>{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-3">
                {!isSubmitted ? (
                  <button
                    onClick={() => handleCheck(qIdx)}
                    disabled={userChoice === undefined}
                    className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                      userChoice === undefined
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                    type="button"
                  >
                    Check
                  </button>
                ) : (
                  <button
                    onClick={() => handleReset(qIdx)}
                    className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1.5 rounded-full transition-colors"
                    type="button"
                  >
                    Try again
                  </button>
                )}
              </div>

              {isSubmitted && (
                <div
                  className={`mt-3 p-3 rounded-lg text-sm flex items-start gap-2 ${
                    isCorrect
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-red-100 text-red-800 border border-red-300"
                  }`}
                >
                  {isCorrect ? (
                    <Check size={16} className="mt-0.5 flex-shrink-0" />
                  ) : (
                    <XCircle size={16} className="mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-bold">
                      {isCorrect ? "✅ Correct!" : "❌ Incorrect."}
                    </p>
                    <p className="text-xs mt-1">💡 {item.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 27
// ============================================

export default function Lesson27PassengerCommunication() {
  const router = useRouter();

  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    mc: true,
  });

  // Estado por card — a chave é o `exercise.key`
  const [hideEnglishMap, setHideEnglishMap] = useState<Record<string, boolean>>({});

  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);
  const [isGrammarImageModalOpen, setIsGrammarImageModalOpen] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Alterna apenas UM card
  const toggleHideEnglishCard = (exerciseKey: string) => {
    setHideEnglishMap(prev => ({ ...prev, [exerciseKey]: !prev[exerciseKey] }));
  };

  // Alterna TODOS os cards de uma seção
  const toggleHideEnglishSection = (section: SectionKey) => {
    const sectionExercises =
      section === 'verbs' ? verbsSubstitution :
      section === 'vocabulary' ? vocabSubstitution :
      section === 'usefulPhrases' ? phrasesSubstitution :
      section === 'grammar' ? grammarSubstitution : [];

    if (sectionExercises.length === 0) return;

    const allHidden = sectionExercises.every(ex => hideEnglishMap[ex.key]);
    const newValue = !allHidden;

    setHideEnglishMap(prev => {
      const next = { ...prev };
      sectionExercises.forEach(ex => { next[ex.key] = newValue; });
      return next;
    });
  };

  const isSectionAllHidden = (section: SectionKey): boolean => {
    const sectionExercises =
      section === 'verbs' ? verbsSubstitution :
      section === 'vocabulary' ? vocabSubstitution :
      section === 'usefulPhrases' ? phrasesSubstitution :
      section === 'grammar' ? grammarSubstitution : [];
    if (sectionExercises.length === 0) return false;
    return sectionExercises.every(ex => hideEnglishMap[ex.key]);
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

  // ---- IMAGES ----
  const mainImage = "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Imagem%20do%20Codex%2024%20de%20set.%20de%202026%2C%2015_02_48.png";
  const backgroundImage = mainImage;
  const grammarImage = "https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2023_04_40.png?raw=true";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ============================================
  // SECTION 1 – VERBS (Passenger Communication)
  // ============================================

  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "recepcionar / Eu recepciono. / ele / nós",
      options: [
        { label: "recepcionar", replacement: "to welcome.", pt: "recepcionar, dar boas-vindas" },
        { label: "Eu", replacement: "I welcome.", pt: "Eu recepciono." },
        { label: "Ele", replacement: "He welcomes.", pt: "Ele recepciona." },
        { label: "Nós", replacement: "We welcome.", pt: "Nós recepcionamos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "embarcar / Eu embarco. / eles / ela",
      options: [
        { label: "embarcar", replacement: "to board.", pt: "embarcar" },
        { label: "Eu", replacement: "I board.", pt: "Eu embarco." },
        { label: "Eles", replacement: "They board.", pt: "Eles embarcam." },
        { label: "Ela", replacement: "She boards.", pt: "Ela embarca." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "desembarcar / Eu desembarco. / nós / eles",
      options: [
        { label: "desembarcar", replacement: "to disembark.", pt: "desembarcar" },
        { label: "Eu", replacement: "I disembark.", pt: "Eu desembarco." },
        { label: "Nós", replacement: "We disembark.", pt: "Nós desembarcamos." },
        { label: "Eles", replacement: "They disembark.", pt: "Eles desembarcam." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "orientar os passageiros. / ajudar / informar",
      options: [
        { label: "orientar", replacement: "guide the passengers.", pt: "orientar os passageiros" },
        { label: "ajudar", replacement: "assist the passengers.", pt: "ajudar os passageiros" },
        { label: "informar", replacement: "inform the passengers.", pt: "informar os passageiros" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Você pode me ajudar? / ele / ela",
      options: [
        { label: "Você", replacement: "Can you help me?", pt: "Você pode me ajudar?" },
        { label: "Ele", replacement: "Can he help me?", pt: "Ele pode me ajudar?" },
        { label: "Ela", replacement: "Can she help me?", pt: "Ela pode me ajudar?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu recepciono os passageiros no terminal. / embarco / oriento",
      options: [
        { label: "recepciono", replacement: "I welcome the passengers at the terminal.", pt: "Eu recepciono os passageiros no terminal." },
        { label: "embarco", replacement: "I board the passengers at the terminal.", pt: "Eu embarco os passageiros no terminal." },
        { label: "oriento", replacement: "I guide the passengers at the terminal.", pt: "Eu oriento os passageiros no terminal." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================
  // SECTION 2 – NEW WORDS (Passenger / Vessel)
  // ============================================

  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "O passageiro está esperando no portão. / tripulante / comandante",
      options: [
        { label: "passageiro", replacement: "The passenger is waiting at the gate.", pt: "O passageiro está esperando no portão." },
        { label: "tripulante", replacement: "The crew member is waiting at the gate.", pt: "O tripulante está esperando no portão." },
        { label: "comandante", replacement: "The captain is waiting at the gate.", pt: "O comandante está esperando no portão." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "A cabine fica no convés cinco. / corredor / restaurante",
      options: [
        { label: "cabine", replacement: "The cabin is on deck five.", pt: "A cabine fica no convés cinco." },
        { label: "corredor", replacement: "The corridor is on deck five.", pt: "O corredor fica no convés cinco." },
        { label: "restaurante", replacement: "The restaurant is on deck five.", pt: "O restaurante fica no convés cinco." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Por favor, pegue o colete salva-vidas. / bote / extintor",
      options: [
        { label: "colete salva-vidas", replacement: "Please get your life jacket.", pt: "Por favor, pegue o colete salva-vidas." },
        { label: "bote", replacement: "Please get to the lifeboat.", pt: "Por favor, vá para o bote salva-vidas." },
        { label: "extintor", replacement: "Please get the fire extinguisher.", pt: "Por favor, pegue o extintor de incêndio." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Vá para a sua estação de reunião. / ponto de encontro / saída de emergência",
      options: [
        { label: "estação de reunião", replacement: "Go to your muster station.", pt: "Vá para a sua estação de reunião." },
        { label: "ponto de encontro", replacement: "Go to your assembly point.", pt: "Vá para o seu ponto de encontro." },
        { label: "saída de emergência", replacement: "Go to the emergency exit.", pt: "Vá para a saída de emergência." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Cuidado com o vão na passarela. / degrau / piso",
      options: [
        { label: "passarela", replacement: "Mind the gap at the gangway.", pt: "Cuidado com o vão na passarela." },
        { label: "degrau", replacement: "Mind the step.", pt: "Cuidado com o degrau." },
        { label: "piso", replacement: "Mind the floor.", pt: "Cuidado com o piso." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "O embarque começa às nove horas. / desembarque / partida",
      options: [
        { label: "embarque", replacement: "Boarding starts at nine o'clock.", pt: "O embarque começa às nove horas." },
        { label: "desembarque", replacement: "Disembarkation starts at nine o'clock.", pt: "O desembarque começa às nove horas." },
        { label: "partida", replacement: "Departure is at nine o'clock.", pt: "A partida é às nove horas." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "O corredor está cheio de bagagem. / passageiros / cadeiras",
      options: [
        { label: "bagagem", replacement: "The corridor is full of luggage.", pt: "O corredor está cheio de bagagem." },
        { label: "passageiros", replacement: "The corridor is full of passengers.", pt: "O corredor está cheio de passageiros." },
        { label: "cadeiras", replacement: "The corridor is full of chairs.", pt: "O corredor está cheio de cadeiras." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "A tripulação está pronta para o embarque. / equipe / comandante",
      options: [
        { label: "tripulação", replacement: "The crew is ready for boarding.", pt: "A tripulação está pronta para o embarque." },
        { label: "equipe", replacement: "The team is ready for boarding.", pt: "A equipe está pronta para o embarque." },
        { label: "comandante", replacement: "The captain is ready for boarding.", pt: "O comandante está pronto para o embarque." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Use o corrimão ao subir a escada. / degrau / rampa",
      options: [
        { label: "corrimão", replacement: "Use the handrail when going up the stairs.", pt: "Use o corrimão ao subir a escada." },
        { label: "degrau", replacement: "Use the step when going up the stairs.", pt: "Use o degrau ao subir a escada." },
        { label: "rampa", replacement: "Use the ramp when going up the stairs.", pt: "Use a rampa ao subir a escada." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "O briefing de segurança é obrigatório. / treinamento / exercício",
      options: [
        { label: "briefing de segurança", replacement: "The safety briefing is mandatory.", pt: "O briefing de segurança é obrigatório." },
        { label: "treinamento", replacement: "The safety training is mandatory.", pt: "O treinamento de segurança é obrigatório." },
        { label: "exercício", replacement: "The safety drill is mandatory.", pt: "O exercício de segurança é obrigatório." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================
  // SECTION 3 – SPEAK LIKE A NATIVE (Useful Phrases)
  // ============================================

  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Bem-vindo a bordo! / ao terminal / à cabine",
      options: [
        { label: "a bordo", replacement: "Welcome aboard!", pt: "Bem-vindo a bordo!" },
        { label: "ao terminal", replacement: "Welcome to the terminal!", pt: "Bem-vindo ao terminal!" },
        { label: "à cabine", replacement: "Welcome to your cabin!", pt: "Bem-vindo à sua cabine!" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Por aqui, por favor. / Por ali / Siga-me",
      options: [
        { label: "Por aqui", replacement: "This way, please.", pt: "Por aqui, por favor." },
        { label: "Por ali", replacement: "That way, please.", pt: "Por ali, por favor." },
        { label: "Siga-me", replacement: "Follow me, please.", pt: "Siga-me, por favor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Tenha seu cartão de embarque pronto. / passaporte / documento",
      options: [
        { label: "cartão de embarque", replacement: "Please have your boarding pass ready.", pt: "Tenha seu cartão de embarque pronto." },
        { label: "passaporte", replacement: "Please have your passport ready.", pt: "Tenha seu passaporte pronto." },
        { label: "documento", replacement: "Please have your document ready.", pt: "Tenha seu documento pronto." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Cuidado com o vão, por favor. / degrau / porta",
      options: [
        { label: "vão", replacement: "Mind the gap, please.", pt: "Cuidado com o vão, por favor." },
        { label: "degrau", replacement: "Mind the step, please.", pt: "Cuidado com o degrau, por favor." },
        { label: "porta", replacement: "Mind the door, please.", pt: "Cuidado com a porta, por favor." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Permaneça sentado durante a viagem. / calmo / em seu lugar",
      options: [
        { label: "sentado", replacement: "Please remain seated during the trip.", pt: "Permaneça sentado durante a viagem." },
        { label: "calmo", replacement: "Please remain calm during the trip.", pt: "Permaneça calmo durante a viagem." },
        { label: "em seu lugar", replacement: "Please remain in your seat during the trip.", pt: "Permaneça em seu lugar durante a viagem." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Em caso de emergência, siga as instruções da tripulação. / comandante / equipe",
      options: [
        { label: "tripulação", replacement: "In case of emergency, follow the crew's instructions.", pt: "Em caso de emergência, siga as instruções da tripulação." },
        { label: "comandante", replacement: "In case of emergency, follow the captain's instructions.", pt: "Em caso de emergência, siga as instruções do comandante." },
        { label: "equipe", replacement: "In case of emergency, follow the team's instructions.", pt: "Em caso de emergência, siga as instruções da equipe." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Atenção passageiros: vamos iniciar o embarque. / desembarque / briefing",
      options: [
        { label: "embarque", replacement: "Attention passengers: we are starting boarding.", pt: "Atenção passageiros: vamos iniciar o embarque." },
        { label: "desembarque", replacement: "Attention passengers: we are starting disembarkation.", pt: "Atenção passageiros: vamos iniciar o desembarque." },
        { label: "briefing", replacement: "Attention passengers: we are starting the safety briefing.", pt: "Atenção passageiros: vamos iniciar o briefing de segurança." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Obrigado pela sua atenção. Tenha uma boa viagem. / uma boa estadia / um bom dia",
      options: [
        { label: "boa viagem", replacement: "Thank you for your attention. Have a good trip.", pt: "Obrigado pela sua atenção. Tenha uma boa viagem." },
        { label: "boa estadia", replacement: "Thank you for your attention. Have a good stay.", pt: "Obrigado pela sua atenção. Tenha uma boa estadia." },
        { label: "bom dia", replacement: "Thank you for your attention. Have a good day.", pt: "Obrigado pela sua atenção. Tenha um bom dia." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================
  // SECTION 4 – GRAMMAR (Commands & Requests)
  // ============================================

  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Dirija-se ao convés três. / Vá para sua cabine / Coloque o colete",
      options: [
        { label: "convés três", replacement: "Please proceed to deck three.", pt: "Dirija-se ao convés três." },
        { label: "sua cabine", replacement: "Please go to your cabin.", pt: "Vá para a sua cabine." },
        { label: "o colete", replacement: "Please put on your life jacket.", pt: "Coloque o colete salva-vidas." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Você poderia mostrar seu bilhete? / passaporte / cartão",
      options: [
        { label: "bilhete", replacement: "Could you please show your ticket?", pt: "Você poderia mostrar seu bilhete?" },
        { label: "passaporte", replacement: "Could you please show your passport?", pt: "Você poderia mostrar seu passaporte?" },
        { label: "cartão", replacement: "Could you please show your card?", pt: "Você poderia mostrar seu cartão?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Você deve usar o colete salva-vidas. / permanecer sentado / seguir as regras",
      options: [
        { label: "colete", replacement: "You must wear a life jacket.", pt: "Você deve usar o colete salva-vidas." },
        { label: "sentado", replacement: "You must remain seated.", pt: "Você deve permanecer sentado." },
        { label: "regras", replacement: "You must follow the rules.", pt: "Você deve seguir as regras." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Há muitos passageiros a bordo. / algumas cabines / uma tripulação",
      options: [
        { label: "passageiros", replacement: "There are many passengers on board.", pt: "Há muitos passageiros a bordo." },
        { label: "cabines", replacement: "There are some cabins on board.", pt: "Há algumas cabines a bordo." },
        { label: "tripulação", replacement: "There is a crew on board.", pt: "Há uma tripulação a bordo." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Alguém precisa de ajuda? / um colete / um assento",
      options: [
        { label: "ajuda", replacement: "Does anybody need help?", pt: "Alguém precisa de ajuda?" },
        { label: "um colete", replacement: "Does anybody need a life jacket?", pt: "Alguém precisa de um colete?" },
        { label: "um assento", replacement: "Does anybody need a seat?", pt: "Alguém precisa de um assento?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ninguém pode entrar nesta área. / fumar / passar",
      options: [
        { label: "entrar", replacement: "Nobody can enter this area.", pt: "Ninguém pode entrar nesta área." },
        { label: "fumar", replacement: "Nobody can smoke in this area.", pt: "Ninguém pode fumar nesta área." },
        { label: "passar", replacement: "Nobody can pass through this area.", pt: "Ninguém pode passar por esta área." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Todos os passageiros devem ir à estação de reunião. / tripulantes / visitantes",
      options: [
        { label: "passageiros", replacement: "All passengers must go to the muster station.", pt: "Todos os passageiros devem ir à estação de reunião." },
        { label: "tripulantes", replacement: "All crew members must go to the muster station.", pt: "Todos os tripulantes devem ir à estação de reunião." },
        { label: "visitantes", replacement: "All visitors must go to the muster station.", pt: "Todos os visitantes devem ir à estação de reunião." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Não corra na passarela. / no corredor / na escada",
      options: [
        { label: "passarela", replacement: "Do not run on the gangway.", pt: "Não corra na passarela." },
        { label: "corredor", replacement: "Do not run in the corridor.", pt: "Não corra no corredor." },
        { label: "escada", replacement: "Do not run on the stairs.", pt: "Não corra na escada." }
      ],
      currentIndex: 0,
    },
  ];

  const allExercises = [
    ...verbsSubstitution,
    ...vocabSubstitution,
    ...phrasesSubstitution,
    ...grammarSubstitution,
  ];

  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================
  // USEFUL PHRASES DATA (Highlights)
  // ============================================

  const usefulPhrasesData = [
    {
      en: "Welcome aboard! Please have your boarding pass ready.",
      pt: "Bem-vindo a bordo! Por favor, tenha seu cartão de embarque pronto.",
      green: ["Welcome", "boarding", "pass", "ready"]
    },
    {
      en: "This way, please. Mind the gap at the gangway.",
      pt: "Por aqui, por favor. Cuidado com o vão na passarela.",
      green: ["This", "way", "Mind", "gap", "gangway"]
    },
    {
      en: "In case of emergency, follow the crew's instructions.",
      pt: "Em caso de emergência, siga as instruções da tripulação.",
      green: ["emergency", "follow", "crew's", "instructions"]
    },
    {
      en: "Please remain seated until the vessel stops.",
      pt: "Por favor, permaneça sentado até a embarcação parar.",
      green: ["remain", "seated", "vessel", "stops"]
    }
  ];

  // ============================================
  // MULTIPLE CHOICE – 30 QUESTIONS
  // ============================================

  const mcItems: MCQItem[] = [
    {
      question: "What does MAYDAY mean on the VHF radio?",
      options: [
        "A routine safety message.",
        "A distress signal – grave and imminent danger.",
        "A request for a weather report.",
        "An urgency message about a small problem.",
      ],
      correctIndex: 1,
      explanation: "MAYDAY is used only for distress (grave and imminent danger to vessel or life).",
    },
    {
      question: "PAN PAN is used to prefix which type of message?",
      options: [
        "Safety messages.",
        "Distress messages.",
        "Urgency messages.",
        "Weather forecasts.",
      ],
      correctIndex: 2,
      explanation: "PAN PAN is used for urgency – important, but not immediate danger to life.",
    },
    {
      question: "SECURITE is used for:",
      options: [
        "Distress calls.",
        "Urgency calls.",
        "Safety messages such as navigational warnings.",
        "Private conversations.",
      ],
      correctIndex: 2,
      explanation: "SECURITE prefixes safety messages like navigational warnings.",
    },
    {
      question: "When you say 'Correction' on the radio, you mean:",
      options: [
        "You want the other vessel to change course.",
        "You made an error; the correct version follows.",
        "You cannot hear the other vessel.",
        "You are switching to another channel.",
      ],
      correctIndex: 1,
      explanation: "'Correction' is used when an error was made in the transmission.",
    },
    {
      question: "What does 'Stand by' mean?",
      options: [
        "Stop transmitting immediately.",
        "Wait and be ready.",
        "Change to channel 16.",
        "The message is not understood.",
      ],
      correctIndex: 1,
      explanation: "'Stand by' means wait and be ready for the next message.",
    },
    {
      question: "How does the DPO report good radio reception?",
      options: [
        "I read you five.",
        "I read you one.",
        "I read you three.",
        "Say again.",
      ],
      correctIndex: 0,
      explanation: "Readability scale: 1 = bad, 5 = excellent. 'I read you five' = excellent.",
    },
    {
      question: "What does 'Say again' mean?",
      options: [
        "Speak louder.",
        "Repeat your last message.",
        "Change channel.",
        "Stop transmitting.",
      ],
      correctIndex: 1,
      explanation: "'Say again' is the standard phrase for 'repeat your message'.",
    },
    {
      question: "Which VHF channel is the international distress and calling channel?",
      options: ["Channel 6", "Channel 13", "Channel 16", "Channel 70"],
      correctIndex: 2,
      explanation: "VHF Channel 16 is the international distress, safety and calling channel.",
    },
    {
      question: "'Over' on the radio means:",
      options: [
        "The conversation is finished.",
        "I have finished speaking; your turn.",
        "I am in distress.",
        "I have a maintenance request.",
      ],
      correctIndex: 1,
      explanation: "'Over' = I finished speaking, you may reply. 'Out' = conversation finished.",
    },
    {
      question: "'Out' on the radio means:",
      options: [
        "I am still speaking.",
        "The conversation is finished; no reply expected.",
        "I want to change channel.",
        "I need assistance.",
      ],
      correctIndex: 1,
      explanation: "'Out' ends the communication – no further reply is expected.",
    },
    {
      question: "What does the abbreviation SMCP mean?",
      options: [
        "Ship Management Control Program.",
        "Standard Marine Communication Phrases.",
        "Safety Marine Communication Protocol.",
        "Ship Master Control Panel.",
      ],
      correctIndex: 1,
      explanation: "SMCP = Standard Marine Communication Phrases (IMO standard).",
    },
    {
      question: "Positions (latitude and longitude) should be expressed in:",
      options: [
        "Degrees only.",
        "Degrees and minutes (and decimals of a minute if necessary).",
        "Kilometres and metres.",
        "Nautical miles and cables.",
      ],
      correctIndex: 1,
      explanation: "Positions use degrees and minutes, North/South, East/West.",
    },
    {
      question: "Courses and bearings are expressed in:",
      options: [
        "000 to 180 degrees.",
        "000 to 360 degrees from True North.",
        "Relative to the ship's bow only.",
        "Metres per second.",
      ],
      correctIndex: 1,
      explanation: "Courses and bearings use 360-degree notation from True North.",
    },
    {
      question: "Speed of a vessel should be expressed in:",
      options: ["Kilometres per hour.", "Knots.", "Miles per hour.", "Metres per second."],
      correctIndex: 1,
      explanation: "Speed at sea is expressed in knots.",
    },
    {
      question: "How should the number 150 be spoken on the radio?",
      options: ["One hundred and fifty.", "One five zero.", "Fifteen zero.", "Hundred fifty."],
      correctIndex: 1,
      explanation: "Numbers are spoken digit by digit: 'One-Five-Zero' for 150.",
    },
    {
      question: "How should 2.5 be spoken?",
      options: ["Two and a half.", "Two point five.", "Two five.", "Twenty-five."],
      correctIndex: 1,
      explanation: "Decimals: 'Two point five'.",
    },
    {
      question: "Time on the radio should be expressed in:",
      options: [
        "12-hour AM/PM format only.",
        "24-hour notation indicating GMT, zone or local time.",
        "Sunrise/sunset references.",
        "Any format the operator prefers.",
      ],
      correctIndex: 1,
      explanation: "Use 24-hour notation and state GMT, zone time or local time.",
    },
    {
      question: "What does 'fairway' mean?",
      options: [
        "A type of anchor.",
        "The navigable part of a waterway.",
        "A weather condition.",
        "A radio frequency.",
      ],
      correctIndex: 1,
      explanation: "Fairway = the navigable part of a waterway.",
    },
    {
      question: "What does 'draught' mean?",
      options: [
        "Speed of the vessel.",
        "Depth from waterline to vessel's bottom.",
        "Direction of the wind.",
        "Length of the vessel.",
      ],
      correctIndex: 1,
      explanation: "Draught (draft) = depth from waterline to bottom of the vessel.",
    },
    {
      question: "'ETA' means:",
      options: [
        "Emergency Tow Assistance.",
        "Estimated Time of Arrival.",
        "Engine Test Approval.",
        "Electronic Tracking Alarm.",
      ],
      correctIndex: 1,
      explanation: "ETA = Estimated Time of Arrival.",
    },
    {
      question: "'ETD' means:",
      options: [
        "Estimated Time of Departure.",
        "Engine Test Data.",
        "Emergency Towing Device.",
        "External Traffic Data.",
      ],
      correctIndex: 0,
      explanation: "ETD = Estimated Time of Departure.",
    },
    {
      question: "'I am underway' means:",
      options: [
        "I am anchored.",
        "I am not moving.",
        "The vessel is moving and not at anchor or moored.",
        "I am in dry dock.",
      ],
      correctIndex: 2,
      explanation: "'Underway' = the vessel is moving, not at anchor or moored.",
    },
    {
      question: "'I am not under command' means:",
      options: [
        "The vessel is anchored.",
        "The vessel cannot manoeuvre as required due to exceptional circumstances.",
        "The radio is not working.",
        "The vessel is in port.",
      ],
      correctIndex: 1,
      explanation: "'Not under command' = cannot manoeuvre as required.",
    },
    {
      question: "What does DP mean in offshore operations?",
      options: [
        "Deep Propulsion.",
        "Dynamic Positioning.",
        "Direct Pilot.",
        "Docking Procedure.",
      ],
      correctIndex: 1,
      explanation: "DP = Dynamic Positioning – keeping a vessel in position automatically.",
    },
    {
      question: "What does a 'Green status' on the DP console mean?",
      options: [
        "Emergency – abandon operation.",
        "Normal, safe operating condition.",
        "Battery low.",
        "Manual mode only.",
      ],
      correctIndex: 1,
      explanation: "Green = normal safe DP operation. Yellow = degraded. Red = emergency.",
    },
    {
      question: "What is FMEA?",
      options: [
        "Fast Marine Emergency Alarm.",
        "Failure Mode and Effects Analysis.",
        "Fire Management Emergency Action.",
        "Full Maritime Engine Approval.",
      ],
      correctIndex: 1,
      explanation: "FMEA = Failure Mode and Effects Analysis – verifies redundancy.",
    },
    {
      question: "'Thruster 2 failure' means:",
      options: [
        "Thruster 2 is working fine.",
        "Thruster 2 has stopped working.",
        "Thruster 2 needs fuel.",
        "Thruster 2 is overheating slightly.",
      ],
      correctIndex: 1,
      explanation: "'Failure' means it has stopped working or has a fault.",
    },
    {
      question: "Which phrase would the DPO use to call the Captain quickly?",
      options: [
        "Captain to the bridge, please.",
        "Captain, good morning.",
        "Captain, I am going to lunch.",
        "Captain, please check the logbook tomorrow.",
      ],
      correctIndex: 0,
      explanation: "'Captain to the bridge' is the standard urgent call.",
    },
    {
      question: "How would you request repairs from the engine room?",
      options: [
        "Engine room, bridge. We have a hydraulic leak on thruster two. Please send a technician.",
        "Engine room, come here now.",
        "Engine room, the crane is bad.",
        "Engine room, we are broken.",
      ],
      correctIndex: 0,
      explanation: "Standard polite phrase: state the problem and the request clearly.",
    },
    {
      question: "Which phrase correctly asks another vessel to change course?",
      options: [
        "Move away now!",
        "Please alter course to starboard.",
        "Turn right immediately.",
        "Get out of my way.",
      ],
      correctIndex: 1,
      explanation: "'Alter course to starboard' is the standard SMCP phrase.",
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f9ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* ===== HEADER ===== */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-6">
            🧑‍✈️ Lesson 27 – Passenger Communication & Onboard Commands
          </h1>
          <SpeakSentence text="Learn to communicate with passengers, give clear commands on board, and coordinate with the crew about passenger operations." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to communicate with passengers, give clear commands on board, and coordinate with the crew about passenger operations.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Passenger communication on board"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-full object-cover rounded-2xl shadow-md cursor-pointer"
            />
          </div>
          <div className="mt-6 inline-block bg-cyan-100 border border-cyan-300 rounded-full px-6 py-2">
            <p className="text-cyan-800 font-semibold text-sm">
              🎯 Verbs • Vocabulary • Useful Phrases • Grammar • 30 Multiple Choice Questions
            </p>
          </div>
        </div>

        {/* ===================== SECTION 1 – VERBS ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
              type="button"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to welcome" className="text-cyan-700 font-bold">to welcome</SpeakText> = recepcionar, dar boas-vindas</li>
              <li><SpeakText text="to board" className="text-cyan-700 font-bold">to board</SpeakText> = embarcar</li>
              <li><SpeakText text="to disembark" className="text-cyan-700 font-bold">to disembark</SpeakText> = desembarcar</li>
              <li><SpeakText text="to guide" className="text-cyan-700 font-bold">to guide</SpeakText> = orientar, guiar</li>
              <li><SpeakText text="to assist" className="text-cyan-700 font-bold">to assist</SpeakText> = ajudar, auxiliar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-cyan-50 rounded-2xl p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <StickyHideEnglishToggle
                  hidden={isSectionAllHidden('verbs')}
                  onToggle={() => toggleHideEnglishSection('verbs')}
                />
                <div className="space-y-4">
                  {verbsSubstitution.map((ex) => {
                    const currentEx = getExerciseWithIndex(ex.key);
                    if (!currentEx) return null;
                    return (
                      <SubstitutionOptions
                        key={ex.key}
                        exercise={currentEx}
                        onOptionClick={handleOptionClick}
                        hideEnglish={!!hideEnglishMap[ex.key]}
                        onToggleHide={() => toggleHideEnglishCard(ex.key)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2 – NEW WORDS ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
              type="button"
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
                { en: "passenger", pt: "passageiro" },
                { en: "crew", pt: "tripulação" },
                { en: "captain", pt: "comandante" },
                { en: "cabin", pt: "cabine" },
                { en: "deck", pt: "convés" },
                { en: "gangway", pt: "passarela" },
                { en: "terminal", pt: "terminal" },
                { en: "muster station", pt: "estação de reunião" },
                { en: "life jacket", pt: "colete salva-vidas" },
                { en: "lifeboat", pt: "bote salva-vidas" },
                { en: "emergency exit", pt: "saída de emergência" },
                { en: "boarding pass", pt: "cartão de embarque" },
                { en: "luggage", pt: "bagagem" },
                { en: "seat", pt: "assento" },
                { en: "safety briefing", pt: "briefing de segurança" },
                { en: "handrail", pt: "corrimão" },
                { en: "stairway", pt: "escada" },
                { en: "corridor", pt: "corredor" },
              ].map((word, idx) => (
                <div key={idx} className="bg-cyan-50 p-3 rounded-lg border border-cyan-200">
                  <SpeakText text={word.en} className="text-cyan-700 font-bold cursor-pointer text-left w-full block">
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-cyan-50 rounded-2xl p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <StickyHideEnglishToggle
                  hidden={isSectionAllHidden('vocabulary')}
                  onToggle={() => toggleHideEnglishSection('vocabulary')}
                />
                <div className="space-y-4">
                  {vocabSubstitution.map((ex) => {
                    const currentEx = getExerciseWithIndex(ex.key);
                    if (!currentEx) return null;
                    return (
                      <SubstitutionOptions
                        key={ex.key}
                        exercise={currentEx}
                        onOptionClick={handleOptionClick}
                        hideEnglish={!!hideEnglishMap[ex.key]}
                        onToggleHide={() => toggleHideEnglishCard(ex.key)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 3 – SPEAK LIKE A NATIVE ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
              type="button"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common phrases for passenger communication on board" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for passenger communication on board
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
              <div className="mt-4 bg-cyan-50 rounded-2xl p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <StickyHideEnglishToggle
                  hidden={isSectionAllHidden('usefulPhrases')}
                  onToggle={() => toggleHideEnglishSection('usefulPhrases')}
                />
                <div className="space-y-4">
                  {phrasesSubstitution.map((ex) => {
                    const currentEx = getExerciseWithIndex(ex.key);
                    if (!currentEx) return null;
                    return (
                      <SubstitutionOptions
                        key={ex.key}
                        exercise={currentEx}
                        onOptionClick={handleOptionClick}
                        hideEnglish={!!hideEnglishMap[ex.key]}
                        onToggleHide={() => toggleHideEnglishCard(ex.key)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
              type="button"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Imperatives, polite requests, and modals for commands on board" className="text-md text-gray-600 mb-4 italic">
              📚 Imperatives, polite requests, and modals for commands on board
            </SpeakSentence>

            <div className="mb-6 cursor-pointer" onClick={() => setIsGrammarImageModalOpen(true)}>
              <img
                src={grammarImage}
                alt="Grammar illustration – Commands and requests"
                className="w-full h-auto object-contain rounded-2xl shadow-md hover:shadow-xl transition-shadow"
              />
              <p className="text-center text-sm text-gray-500 mt-2">👆 Clique na imagem para ampliar</p>
            </div>

            <div className="bg-cyan-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "Please proceed to deck three.", pt: "Por favor, dirija-se ao convés três." },
                { en: "Could you please show your boarding pass?", pt: "Você poderia mostrar seu cartão de embarque?" },
                { en: "You must wear your life jacket during the drill.", pt: "Você deve usar o colete salva-vidas durante o exercício." },
                { en: "There are many passengers on board today.", pt: "Há muitos passageiros a bordo hoje." },
                { en: "Does anybody need help with the luggage?", pt: "Alguém precisa de ajuda com a bagagem?" },
                { en: "Nobody can enter the bridge area.", pt: "Ninguém pode entrar na área da ponte." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-cyan-700 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-cyan-50 rounded-2xl p-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <StickyHideEnglishToggle
                  hidden={isSectionAllHidden('grammar')}
                  onToggle={() => toggleHideEnglishSection('grammar')}
                />
                <div className="space-y-4">
                  {grammarSubstitution.map((ex) => {
                    const currentEx = getExerciseWithIndex(ex.key);
                    if (!currentEx) return null;
                    return (
                      <SubstitutionOptions
                        key={ex.key}
                        exercise={currentEx}
                        onOptionClick={handleOptionClick}
                        hideEnglish={!!hideEnglishMap[ex.key]}
                        onToggleHide={() => toggleHideEnglishCard(ex.key)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-cyan-100">Practice real-life situations</div>
          </div>
          <div className="p-8">
            <div className="bg-cyan-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {[
                    { en: "Welcome aboard! Please have your boarding pass ready.", pt: "Bem-vindo a bordo! Por favor, tenha seu cartão de embarque pronto." },
                    { en: "This way, please. Mind the gap at the gangway.", pt: "Por aqui, por favor. Cuidado com o vão na passarela." },
                    { en: "Please proceed to your cabin on deck five.", pt: "Por favor, dirija-se à sua cabine no convés cinco." },
                    { en: "In case of emergency, follow the crew's instructions.", pt: "Em caso de emergência, siga as instruções da tripulação." },
                    { en: "Please remain seated until the vessel stops.", pt: "Por favor, permaneça sentado até a embarcação parar." },
                    { en: "Does anybody need help with their luggage?", pt: "Alguém precisa de ajuda com a bagagem?" },
                    { en: "The safety briefing will start in five minutes.", pt: "O briefing de segurança vai começar em cinco minutos." },
                    { en: "Please put on your life jacket and go to your muster station.", pt: "Por favor, coloque o colete salva-vidas e vá para a sua estação de reunião." },
                    { en: "All passengers must remain calm during the drill.", pt: "Todos os passageiros devem permanecer calmos durante o exercício." },
                    { en: "Bridge to deck: passengers are boarding now.", pt: "Ponte para convés: passageiros embarcando agora." },
                    { en: "Crew to bridge: all passengers are on board.", pt: "Tripulação para ponte: todos os passageiros a bordo." },
                    { en: "Thank you for your attention. Have a good trip!", pt: "Obrigado pela sua atenção. Tenha uma boa viagem!" },
                  ].map((s, idx) => (
                    <div key={idx} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={s.en} className="text-base font-medium">
                          {idx+1}. {s.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.pt}</p>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={readingImage} alt="Welcoming passengers" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Welcoming passengers</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={placesImage} alt="Safety briefing on board" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Safety briefing on board</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={digitalImage} alt="Crew coordination" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Crew coordination about passengers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – MULTIPLE CHOICE (Part 3) ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">✅ Part 3 – Multiple Choice (30 Questions)</h2>
              <PencilIcon onClick={() => openNoteModal('Multiple Choice')} />
            </div>
            <button
              onClick={() => toggleDrill('mc')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
              type="button"
            >
              {openDrills.mc ? 'Hide' : 'Show'}
            </button>
          </div>
          {openDrills.mc && (
            <div className="p-8">
              <p className="text-sm text-gray-600 mb-4">
                🎯 Select the correct answer. The system will show you the correct
                answer with a short explanation.
              </p>
              <MultipleChoice items={mcItems} />
            </div>
          )}
        </div>

        {/* ===================== SECTION 7 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-cyan-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-cyan-100 italic">
                📝 Key expressions and useful vocabulary to remember
              </SpeakSentence>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-cyan-900 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY EXPRESSIONS</h3>
              {[
                { en: "Welcome aboard!", pt: "Bem-vindo a bordo!" },
                { en: "This way, please. Mind the gap.", pt: "Por aqui, por favor. Cuidado com o vão." },
                { en: "Please have your boarding pass ready.", pt: "Por favor, tenha seu cartão de embarque pronto." },
                { en: "In case of emergency, follow the crew's instructions.", pt: "Em caso de emergência, siga as instruções da tripulação." },
                { en: "Please remain seated until the vessel stops.", pt: "Por favor, permaneça sentado até a embarcação parar." },
                { en: "Does anybody need help?", pt: "Alguém precisa de ajuda?" },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-cyan-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-cyan-200 text-sm">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-cyan-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-cyan-200">
                    <li>Use <strong className="text-white">"Please"</strong> at the start or end of commands to sound polite.</li>
                    <li>Use <strong className="text-white">imperatives</strong> ("Proceed", "Go", "Put on") for clear instructions.</li>
                    <li>Use <strong className="text-white">"Could you please..."</strong> for polite requests.</li>
                    <li>Use <strong className="text-white">"must"</strong> for safety rules: "You must wear a life jacket."</li>
                    <li>Use <strong className="text-white">"There is/are"</strong> to report the number of passengers or crew.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-cyan-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-cyan-200">Speak slowly and clearly. Repeat key information. Use standard phrases so everyone understands.</p>
                </div>
                <div className="pt-4 border-t border-cyan-700">
                  <p className="text-cyan-200 text-sm italic">
                    🌟 <strong>Substitute the words in green</strong> to create new sentences and practice fluency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/offshore/lesson26-offshore")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            ← Previous Lesson (26)
          </button>
          <button
            onClick={() => router.push("/cursos/offshore/lesson28-offshore")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            Next Lesson (28) →
          </button>
        </div>

        {/* ===================== CREDITS ===================== */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Passenger Communication & Onboard Commands • Commands, Safety & Coordination</p>
          <p className="text-xs mt-1">
            🧑‍✈️ "Clear communication saves lives — on board and on shore."
          </p>
        </div>
      </div>

      {/* ===== MODAL – GRAMMAR IMAGE ===== */}
      {isGrammarImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsGrammarImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={grammarImage}
              alt="Grammar illustration – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsGrammarImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
              type="button"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* ===== MODAL – MAIN IMAGE ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Passenger communication – ampliada"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
              type="button"
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