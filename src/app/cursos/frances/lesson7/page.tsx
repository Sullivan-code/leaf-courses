"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ============================================
// SYSTÈME AUDIO : VOIX FÉMININE FRANÇAISE NATURELLE
// ============================================

// Voix française féminine prioritaire (qualité naturelle)
const FRENCH_FEMALE_PRIORITY = [
  'Amelie',              // macOS / iOS — voix féminine française naturelle
  'Amélie',
  'Thomas',              // fallback masculin si aucune féminine
  'Google français',     // Chrome — voix féminine française naturelle
  'Google français (France)',
  'Microsoft Julie',     // Windows — voix féminine française
  'Microsoft Julie Online (Natural) - French (France)',
  'Microsoft Denise',
  'Microsoft Denise Online (Natural) - French (France)',
  'Microsoft Vivienne',
  'Microsoft Vivienne Online (Natural) - French (France)',
  'Microsoft Hortense',
  'Audrey',
  'Marie',
  'Céline',
  'Celine',
  'Female',
  'femme',
];

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

// Seleciona a melhor voz feminina francesa disponível
const getBestFrenchFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Filtra vozes francesas (fr-FR, fr-CA, fr-BE, etc.)
  const frenchVoices = voices.filter(v =>
    v.lang && (v.lang.toLowerCase() === 'fr-fr' ||
               v.lang.toLowerCase() === 'fr' ||
               v.lang.toLowerCase().startsWith('fr-'))
  );

  if (frenchVoices.length === 0) return null;

  // 1) Procura por nomes prioritários conhecidos (femininos franceses)
  for (const name of FRENCH_FEMALE_PRIORITY) {
    const found = frenchVoices.find(v =>
      v.name && v.name.toLowerCase().includes(name.toLowerCase())
    );
    if (found) return found;
  }

  // 2) Procura por vozes "Natural" ou "Online" francesas (geralmente femininas e de alta qualidade)
  const naturalFrench = frenchVoices.find(v =>
    v.name && (v.name.toLowerCase().includes('natural') ||
               v.name.toLowerCase().includes('online'))
  );
  if (naturalFrench) return naturalFrench;

  // 3) Prefere vozes fr-FR
  const frFR = frenchVoices.find(v => v.lang.toLowerCase().startsWith('fr-fr'));
  if (frFR) return frFR;

  // 4) Fallback: primeira voz francesa
  return frenchVoices[0];
};

// Fala em francês com voz feminina natural
const speakFrench = (text: string, rate = 0.9, pitch = 1.05) => {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

  // Cancela qualquer fala anterior para evitar sobreposição
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'fr-FR';
  utterance.rate = rate;       // 0.9 = ritmo natural e claro
  utterance.pitch = pitch;     // levemente agudo para timbre feminino
  utterance.volume = 1.0;

  const voice = getBestFrenchFemaleVoice();
  if (voice) {
    utterance.voice = voice;
    // Garante que o lang corresponda à voz escolhida
    utterance.lang = voice.lang || 'fr-FR';
  }

  // Pequeno delay garante que vozes carregadas assincronamente estejam prontas
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => {
  const speak = () => {
    speakFrench(text, 0.88, 1.05);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Cliquez pour écouter la prononciation en français (voix féminine)"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />}
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === 'string' ? children : text;
        speakFrench(speechText, 0.85, 1.05);
      }}
      className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

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
  const [showFrench, setShowFrench] = useState(true);

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
    setShowFrench(prev => !prev);
  };

  const getOptionLabel = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.label;
    }
    return String(opt);
  };

  const getOptionReplacement = (opt: OptionType): string => {
    if (isObjectOption(opt)) {
      return opt.replacement;
    }
    return String(opt);
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-blue-600 font-medium block">{exercise.original}</p>
        <button
          onClick={toggleVisibility}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showFrench ? "Masquer la réponse en français" : "Afficher la réponse en français"}
        >
          {showFrench ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showFrench && (
        <div className="mb-3 p-3 bg-blue-50 rounded-md">
          <div className="flex flex-col gap-1">
            <div className="flex items-start gap-2">
              <SpeakSentence text={currentSentence} className="text-blue-700 font-medium">
                {currentSentence}
              </SpeakSentence>
            </div>
            {currentPt && (
              <>
                <div className="border-t border-blue-200 my-1"></div>
                <div className="flex items-start gap-2">
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
              speakFrench(getOptionReplacement(option), 0.88, 1.05);
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:«»]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-blue-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });

  return (
    <div className="bg-white p-4 rounded-lg border border-blue-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">
          {parts}
        </SpeakSentence>
      </div>
      <p className="text-sm text-gray-600">{translation}</p>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LIÇÃO 7: LÍNGUAS E PAÍSES (FRANCÊS)
// ============================================
export default function LessonLanguagesAndCountriesFrench() {
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

  const [showExplanation, setShowExplanation] = useState(false);

  const voicesLoadedRef = useRef(false);

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

  // Carrega as vozes do sistema (assíncrono em alguns navegadores)
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        voicesLoadedRef.current = true;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // ============================================
  // ALPHABET AUDIO MAP - Using speechSynthesis system
  // ============================================
  const playAlphabetLetter = (letter: string) => {
    speakFrench(letter, 0.8, 1.05);
  };

  // Reproduz uma frase completa com voz feminina francesa natural
  const playAudio = (sentence: string) => {
    speakFrench(sentence, 0.85, 1.05);
  };

  // ---------- VERBES ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Je parle. / Tu parles.",
      options: [
        { label: "Je parle", replacement: "Je parle.", pt: "Eu falo." },
        { label: "Tu parles", replacement: "Tu parles.", pt: "Você fala." },
        { label: "Elle parle", replacement: "Elle parle.", pt: "Ela fala." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "J'étudie. / Tu étudies.",
      options: [
        { label: "J'étudie", replacement: "J'étudie.", pt: "Eu estudo." },
        { label: "Tu étudies", replacement: "Tu étudies.", pt: "Você estuda." },
        { label: "Il étudie", replacement: "Il étudie.", pt: "Ele estuda." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Je ne parle pas. / étudie / aime / veux.",
      options: [
        { label: "ne parle pas", replacement: "Je ne parle pas.", pt: "Eu não falo." },
        { label: "n'étudie pas", replacement: "Je n'étudie pas.", pt: "Eu não estudo." },
        { label: "n'aime pas", replacement: "Je n'aime pas.", pt: "Eu não gosto." },
        { label: "ne veux pas", replacement: "Je ne veux pas.", pt: "Eu não quero." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Tu parles ? / étudies / veux / préfères.",
      options: [
        { label: "parles", replacement: "Tu parles ?", pt: "Você fala?" },
        { label: "étudies", replacement: "Tu étudies ?", pt: "Você estuda?" },
        { label: "veux", replacement: "Tu veux ?", pt: "Você quer?" },
        { label: "préfères", replacement: "Tu préfères ?", pt: "Você prefere?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Qu'est-ce que tu étudies ? / parles / préfères / veux.",
      options: [
        { label: "étudies", replacement: "Qu'est-ce que tu étudies ?", pt: "O que você estuda?" },
        { label: "parles", replacement: "Qu'est-ce que tu parles ?", pt: "O que você fala?" },
        { label: "préfères", replacement: "Qu'est-ce que tu préfères ?", pt: "O que você prefere?" },
        { label: "veux", replacement: "Qu'est-ce que tu veux ?", pt: "O que você quer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Qu'est-ce que tu aimes ? / manges / bois.",
      options: [
        { label: "aimes", replacement: "Qu'est-ce que tu aimes ?", pt: "O que você gosta?" },
        { label: "manges", replacement: "Qu'est-ce que tu manges ?", pt: "O que você come?" },
        { label: "bois", replacement: "Qu'est-ce que tu bois ?", pt: "O que você bebe?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Qu'est-ce que tu aimes étudier ? / boire / manger.",
      options: [
        { label: "étudier", replacement: "Qu'est-ce que tu aimes étudier ?", pt: "O que você gosta de estudar?" },
        { label: "boire", replacement: "Qu'est-ce que tu aimes boire ?", pt: "O que você gosta de beber?" },
        { label: "manger", replacement: "Qu'est-ce que tu aimes manger ?", pt: "O que você gosta de comer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Qu'est-ce que tu veux étudier ? / parler / manger.",
      options: [
        { label: "étudier", replacement: "Qu'est-ce que tu veux étudier ?", pt: "O que você quer estudar?" },
        { label: "parler", replacement: "Qu'est-ce que tu veux parler ?", pt: "O que você quer falar?" },
        { label: "manger", replacement: "Qu'est-ce que tu veux manger ?", pt: "O que você quer comer?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NOUVEAUX MOTS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Je parle. / J'étudie.",
      options: [
        { label: "Je parle", replacement: "Je parle.", pt: "Eu falo." },
        { label: "J'étudie", replacement: "J'étudie.", pt: "Eu estudo." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Je parle anglais. / français / italien.",
      options: [
        { label: "anglais", replacement: "Je parle anglais.", pt: "Eu falo inglês." },
        { label: "français", replacement: "Je parle français.", pt: "Eu falo francês." },
        { label: "italien", replacement: "Je parle italien.", pt: "Eu falo italiano." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "J'étudie l'anglais. / l'allemand / le portugais.",
      options: [
        { label: "l'anglais", replacement: "J'étudie l'anglais.", pt: "Eu estudo inglês." },
        { label: "l'allemand", replacement: "J'étudie l'allemand.", pt: "Eu estudo alemão." },
        { label: "le portugais", replacement: "J'étudie le portugais.", pt: "Eu estudo português." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "J'étudie l'espagnol. / ici / là-bas.",
      options: [
        { label: "l'espagnol", replacement: "J'étudie l'espagnol.", pt: "Eu estudo espanhol." },
        { label: "ici", replacement: "J'étudie ici.", pt: "Eu estudo aqui." },
        { label: "là-bas", replacement: "J'étudie là-bas.", pt: "Eu estudo lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Tu étudies le portugais ici ? / l'allemand / l'anglais.",
      options: [
        { label: "le portugais", replacement: "Tu étudies le portugais ici ?", pt: "Você estuda português aqui?" },
        { label: "l'allemand", replacement: "Tu étudies l'allemand ici ?", pt: "Você estuda alemão aqui?" },
        { label: "l'anglais", replacement: "Tu étudies l'anglais ici ?", pt: "Você estuda inglês aqui?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Tu parles espagnol ? / italien / français.",
      options: [
        { label: "espagnol", replacement: "Tu parles espagnol ?", pt: "Você fala espanhol?" },
        { label: "italien", replacement: "Tu parles italien ?", pt: "Você fala italiano?" },
        { label: "français", replacement: "Tu parles français ?", pt: "Você fala francês?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Je parle anglais avec mon ami. / mon professeur / mon amie.",
      options: [
        { label: "mon ami", replacement: "Je parle anglais avec mon ami.", pt: "Eu falo inglês com meu amigo." },
        { label: "mon professeur", replacement: "Je parle anglais avec mon professeur.", pt: "Eu falo inglês com meu professor." },
        { label: "mon amie", replacement: "Je parle anglais avec mon amie.", pt: "Eu falo inglês com minha amiga." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Tu étudies avec ton ami ? / parles / espagnol.",
      options: [
        { label: "étudies", replacement: "Tu étudies avec ton ami ?", pt: "Você estuda com seu amigo?" },
        { label: "parles", replacement: "Tu parles avec ton ami ?", pt: "Você fala com seu amigo?" },
        { label: "espagnol", replacement: "Tu étudies l'espagnol avec ton ami ?", pt: "Você estuda espanhol com seu amigo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Je veux parler avec mon professeur. / mon amie / tes amis.",
      options: [
        { label: "mon professeur", replacement: "Je veux parler avec mon professeur.", pt: "Eu quero falar com meu professor." },
        { label: "mon amie", replacement: "Je veux parler avec mon amie.", pt: "Eu quero falar com minha amiga." },
        { label: "tes amis", replacement: "Je veux parler avec tes amis.", pt: "Eu quero falar com seus amigos." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Je parle français aussi. / italien / allemand.",
      options: [
        { label: "français", replacement: "Je parle français aussi.", pt: "Eu falo francês também." },
        { label: "italien", replacement: "Je parle italien aussi.", pt: "Eu falo italiano também." },
        { label: "allemand", replacement: "Je parle allemand aussi.", pt: "Eu falo alemão também." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "J'étudie ici aussi. / là-bas.",
      options: [
        { label: "ici", replacement: "J'étudie ici aussi.", pt: "Eu estudo aqui também." },
        { label: "là-bas", replacement: "J'étudie là-bas aussi.", pt: "Eu estudo lá também." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- PARLER COMME UN NATIF ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "J'étudie l'espagnol le matin. / l'après-midi.",
      options: [
        { label: "le matin", replacement: "J'étudie l'espagnol le matin.", pt: "Eu estudo espanhol de manhã." },
        { label: "l'après-midi", replacement: "J'étudie l'espagnol l'après-midi.", pt: "Eu estudo espanhol à tarde." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Tu n'étudies pas l'après-midi. / le matin.",
      options: [
        { label: "l'après-midi", replacement: "Tu n'étudies pas l'après-midi.", pt: "Você não estuda à tarde." },
        { label: "le matin", replacement: "Tu n'étudies pas le matin.", pt: "Você não estuda de manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Tu bois du café l'après-midi ? / du thé / du jus.",
      options: [
        { label: "du café", replacement: "Tu bois du café l'après-midi ?", pt: "Você bebe café à tarde?" },
        { label: "du thé", replacement: "Tu bois du thé l'après-midi ?", pt: "Você bebe chá à tarde?" },
        { label: "du jus", replacement: "Tu bois du jus l'après-midi ?", pt: "Você bebe suco à tarde?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "J'étudie le portugais à l'école. / l'anglais / l'espagnol.",
      options: [
        { label: "le portugais", replacement: "J'étudie le portugais à l'école.", pt: "Eu estudo português na escola." },
        { label: "l'anglais", replacement: "J'étudie l'anglais à l'école.", pt: "Eu estudo inglês na escola." },
        { label: "l'espagnol", replacement: "J'étudie l'espagnol à l'école.", pt: "Eu estudo espanhol na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Je parle anglais à l'école. / ici / là-bas.",
      options: [
        { label: "à l'école", replacement: "Je parle anglais à l'école.", pt: "Eu falo inglês na escola." },
        { label: "ici", replacement: "Je parle anglais ici.", pt: "Eu falo inglês aqui." },
        { label: "là-bas", replacement: "Je parle anglais là-bas.", pt: "Eu falo inglês lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Tu veux étudier avec moi ? / parler.",
      options: [
        { label: "étudier", replacement: "Tu veux étudier avec moi ?", pt: "Você quer estudar comigo?" },
        { label: "parler", replacement: "Tu veux parler avec moi ?", pt: "Você quer falar comigo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Tu aimes étudier avec moi ? / avec ton professeur / tes amis.",
      options: [
        { label: "avec moi", replacement: "Tu aimes étudier avec moi ?", pt: "Você gosta de estudar comigo?" },
        { label: "avec ton professeur", replacement: "Tu aimes étudier avec ton professeur ?", pt: "Você gosta de estudar com seu professor?" },
        { label: "tes amis", replacement: "Tu aimes étudier avec tes amis ?", pt: "Você gosta de estudar com seus amigos?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Je veux parler avec toi. / étudier.",
      options: [
        { label: "parler", replacement: "Je veux parler avec toi.", pt: "Eu quero falar com você." },
        { label: "étudier", replacement: "Je veux étudier avec toi.", pt: "Eu quero estudar com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "J'aime étudier avec toi. / avec mes amis / mon professeur.",
      options: [
        { label: "avec toi", replacement: "J'aime étudier avec toi.", pt: "Eu gosto de estudar com você." },
        { label: "avec mes amis", replacement: "J'aime étudier avec mes amis.", pt: "Eu gosto de estudar com meus amigos." },
        { label: "mon professeur", replacement: "J'aime étudier avec mon professeur.", pt: "Eu gosto de estudar com meu professor." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAIRE ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Tu étudies l'italien ici ? / l'allemand / l'anglais.",
      options: [
        { label: "l'italien", replacement: "Tu étudies l'italien ici ?", pt: "Você estuda italiano aqui?" },
        { label: "l'allemand", replacement: "Tu étudies l'allemand ici ?", pt: "Você estuda alemão aqui?" },
        { label: "l'anglais", replacement: "Tu étudies l'anglais ici ?", pt: "Você estuda inglês aqui?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Nous étudions le français ici. / l'italien / le portugais.",
      options: [
        { label: "le français", replacement: "Nous étudions le français ici.", pt: "Nós estudamos francês aqui." },
        { label: "l'italien", replacement: "Nous étudions l'italien ici.", pt: "Nós estudamos italiano aqui." },
        { label: "le portugais", replacement: "Nous étudions le portugais ici.", pt: "Nós estudamos português aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Tu parles espagnol à l'école ? / allemand / portugais.",
      options: [
        { label: "espagnol", replacement: "Tu parles espagnol à l'école ?", pt: "Você fala espanhol na escola?" },
        { label: "allemand", replacement: "Tu parles allemand à l'école ?", pt: "Você fala alemão na escola?" },
        { label: "portugais", replacement: "Tu parles portugais à l'école ?", pt: "Você fala português na escola?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Ils étudient à l'école le matin. / ici / là-bas.",
      options: [
        { label: "à l'école le matin", replacement: "Ils étudient à l'école le matin.", pt: "Eles estudam na escola de manhã." },
        { label: "ici", replacement: "Ils étudient ici.", pt: "Eles estudam aqui." },
        { label: "là-bas", replacement: "Ils étudient là-bas.", pt: "Eles estudam lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Nous parlons anglais et allemand. / Je / Ils.",
      options: [
        { label: "Nous", replacement: "Nous parlons anglais et allemand.", pt: "Nós falamos inglês e alemão." },
        { label: "Je", replacement: "Je parle anglais et allemand.", pt: "Eu falo inglês e alemão." },
        { label: "Ils", replacement: "Ils parlent anglais et allemand.", pt: "Eles falam inglês e alemão." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Elles préfèrent parler anglais. / veulent / adorent.",
      options: [
        { label: "préfèrent", replacement: "Elles préfèrent parler anglais.", pt: "Elas preferem falar inglês." },
        { label: "veulent", replacement: "Elles veulent parler anglais.", pt: "Elas querem falar inglês." },
        { label: "adorent", replacement: "Elles adorent parler anglais.", pt: "Elas adoram falar inglês." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "J'aime parler avec toi. / Ils / Nous.",
      options: [
        { label: "Je", replacement: "J'aime parler avec toi.", pt: "Eu gosto de falar com você." },
        { label: "Ils", replacement: "Ils aiment parler avec toi.", pt: "Eles gostam de falar com você." },
        { label: "Nous", replacement: "Nous aimons parler avec toi.", pt: "Nós gostamos de falar com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Nous voulons étudier là-bas. / ici / à l'école.",
      options: [
        { label: "là-bas", replacement: "Nous voulons étudier là-bas.", pt: "Nós queremos estudar lá." },
        { label: "ici", replacement: "Nous voulons étudier ici.", pt: "Nós queremos estudar aqui." },
        { label: "à l'école", replacement: "Nous voulons étudier à l'école.", pt: "Nós queremos estudar na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Elles parlent italien aussi. / portugais / Nous parlons.",
      options: [
        { label: "italien", replacement: "Elles parlent italien aussi.", pt: "Elas falam italiano também." },
        { label: "portugais", replacement: "Elles parlent portugais aussi.", pt: "Elas falam português também." },
        { label: "Nous parlons", replacement: "Nous parlons italien aussi.", pt: "Nós falamos italiano também." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Je veux étudier l'espagnol avec toi. / aime / préfère.",
      options: [
        { label: "veux", replacement: "Je veux étudier l'espagnol avec toi.", pt: "Eu quero estudar espanhol com você." },
        { label: "aime", replacement: "J'aime étudier l'espagnol avec toi.", pt: "Eu gosto de estudar espanhol com você." },
        { label: "préfère", replacement: "Je préfère étudier l'espagnol avec toi.", pt: "Eu prefiro estudar espanhol com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Tu veux étudier avec mon ami ? / ton ami / moi.",
      options: [
        { label: "mon ami", replacement: "Tu veux étudier avec mon ami ?", pt: "Você quer estudar com meu amigo?" },
        { label: "ton ami", replacement: "Tu veux étudier avec ton ami ?", pt: "Você quer estudar com seu amigo?" },
        { label: "moi", replacement: "Tu veux étudier avec moi ?", pt: "Você quer estudar comigo?" }
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

  const speakLikeNativeSentences = [
    { fr: "Je bois du café le matin.", pt: "Eu bebo café de manhã." },
    { fr: "Tu étudies l'anglais l'après-midi.", pt: "Você estuda inglês à tarde." },
    { fr: "J'étudie l'anglais à l'école.", pt: "Eu estudo inglês na escola." },
    { fr: "Tu veux étudier avec moi ?", pt: "Você quer estudar comigo?" },
  ];

  const grammarSentences = [
    { fr: "Nous parlons italien à l'école.", pt: "Nós falamos italiano na escola." },
    { fr: "Nous étudions l'espagnol ici aussi.", pt: "Nós estudamos espanhol aqui também." },
    { fr: "Ils étudient le français là-bas.", pt: "Eles estudam francês lá." },
    { fr: "Ils veulent étudier ici.", pt: "Eles querem estudar aqui." },
    { fr: "Nous voulons parler l'anglais.", pt: "Nós queremos falar inglês." },
    { fr: "Ils veulent étudier l'allemand.", pt: "Eles querem estudar alemão." },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Leçon 7 - Langues et Pays
          </h1>
          <SpeakSentence text="Apprenez à parler des langues, des pays et à pratiquer des conversations en français." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🌍🗣️ Apprenez à parler des langues, des pays et à pratiquer des conversations en français. 🌍🗣️
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src="https://i.ibb.co/nsrGVyhd/l7-main1.jpg"
              alt="Langues et Pays"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbes avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 VERBES</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Verbes')} />
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Masquer l\'exercice' : 'Afficher l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Cliquez sur les verbes pour entendre la prononciation et pratiquer leurs formes." className="text-md text-gray-600 mb-4 italic">
              🎧 Cliquez sur les verbes pour entendre la prononciation et pratiquer leurs formes.
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="parler" className="text-blue-600 font-bold">parler</SpeakText> = falar
              </li>
              <li>
                <SpeakText text="étudier" className="text-blue-600 font-bold">étudier</SpeakText> = estudar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* Seção 2 - Vocabulaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 Nouveaux Mots</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Nouveaux Mots')} />
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Masquer l\'exercice' : 'Afficher l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Cliquez sur chaque mot pour entendre sa prononciation correcte." className="text-md text-gray-600 mb-4 italic">
              🎧 Cliquez sur chaque mot pour entendre sa prononciation correcte.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { fr: "portugais", pt: "português" },
                { fr: "anglais", pt: "inglês" },
                { fr: "français", pt: "francês" },
                { fr: "espagnol", pt: "espanhol" },
                { fr: "italien", pt: "italiano" },
                { fr: "allemand", pt: "alemão" },
                { fr: "ami", pt: "amigo(a)" },
                { fr: "professeur", pt: "professor(a)" },
                { fr: "mon", pt: "meu(s), minha(s)" },
                { fr: "ton", pt: "seu(s), sua(s)" },
                { fr: "leur", pt: "deles, delas" },
                { fr: "notre", pt: "nosso, nossa" },
                { fr: "nous", pt: "nós" },
                { fr: "ils", pt: "eles, elas" },
                { fr: "ici", pt: "aqui" },
                { fr: "là-bas", pt: "lá" },
                { fr: "aussi", pt: "também" },
                { fr: "avec", pt: "com" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.fr} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.fr}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* Seção 3 - Phrases Utiles avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 Parler Comme un Natif</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Phrases Utiles')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Masquer l\'exercice' : 'Afficher l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Pratiquez des phrases courantes pour parler des langues." className="text-md text-gray-600 mb-4 italic">
              💬 Pratiquez des phrases courantes pour parler des langues.
            </SpeakSentence>

            <div className="space-y-2 mb-6">
              {speakLikeNativeSentences.map((s, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakSentence text={s.fr} className="text-base font-medium text-gray-800">
                    {s.fr}
                  </SpeakSentence>
                  <p className="text-sm text-gray-600 mt-0.5">{s.pt}</p>
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* Seção 4 - Grammaire avec Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 GRAMMAIRE</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Grammaire')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Masquer l\'exercice' : 'Afficher l\'exercice'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Structures pour parler des langues avec différentes personnes." className="text-md text-gray-600 mb-4 italic">
              📚 Structures pour parler des langues avec différentes personnes.
            </SpeakSentence>

            <div className="space-y-2 mb-6">
              {grammarSentences.map((s, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakSentence text={s.fr} className="text-base font-medium text-gray-800">
                    {s.fr}
                  </SpeakSentence>
                  <p className="text-sm text-gray-600 mt-0.5">{s.pt}</p>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* Seção 5 - Pratique en Situation Réelle */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">À VOUS DE JOUER !</h2>
            <p className="mt-2 text-blue-100 italic">
              Remplacez les mots en bleu pour pratiquer la prononciation dans des situations réelles.
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('J\'aime parler anglais avec mes amis')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. J'aime parler <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('anglais')}
                          >anglais</span> avec mes amis.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de falar inglês com meus amigos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Ils parlent espagnol à l\'école')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. Ils parlent <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('espagnol')}
                          >espagnol</span> à l'école.
                        </p>
                        <p className="text-sm text-gray-600">Eles falam espanhol na escola.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Ils aiment étudier le portugais')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. Ils aiment étudier le <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('portugais')}
                          >portugais</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eles gostam de estudar português.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Tu étudies ici ou là-bas')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Tu étudies <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('ici')}
                          >ici</span> ou là-bas ?
                        </p>
                        <p className="text-sm text-gray-600">Você estuda aqui ou lá?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Tu veux étudier avec moi')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. Tu veux étudier <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('avec moi')}
                          >avec moi</span> ?
                        </p>
                        <p className="text-sm text-gray-600">Você quer estudar comigo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Tu parles allemand avec ton professeur')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Tu parles <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('allemand')}
                          >allemand</span> avec ton professeur ?
                        </p>
                        <p className="text-sm text-gray-600">Você fala alemão com seu professor?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Je parle italien avec mon ami')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Je parle <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('italien')}
                          >italien</span> avec mon ami.
                        </p>
                        <p className="text-sm text-gray-600">Eu falo italiano com meu amigo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Nous voulons étudier le matin')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Nous voulons étudier <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('le matin')}
                          >le matin</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós queremos estudar de manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Tu veux étudier l\'après-midi')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Écouter la phrase"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Tu veux étudier <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio("l'après-midi")}
                          >l'après-midi</span> ?
                        </p>
                        <p className="text-sm text-gray-600">Você quer estudar à tarde?</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/VcLcyCZk/l7-reallife-1.jpg"
                        alt="Pessoas estudando idiomas"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Étudier les langues avec des amis
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/7xHnG0TG/l7-reallife-2.jpg"
                        alt="Bandeiras e culturas diferentes"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Diversité des langues et des cultures
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">DÉCOUVREZ !</h2>
              <SpeakSentence text="Apprenez l'alphabet et entraînez-vous à épeler des mots en français." className="mt-2 text-blue-100 italic">
                🔤 Apprenez l'alphabet et entraînez-vous à épeler des mots en français.
              </SpeakSentence>
            </div>
          </div>

          <div className="w-full mx-auto bg-white p-6 font-sans">
            <div className="border-2 border-blue-300 p-6 mt-4 rounded-2xl bg-blue-50">
              <div className="text-center font-bold mb-8 text-2xl text-blue-700 font-['Poppins']">L'ALPHABET</div>

              <div className="flex flex-col items-center justify-center space-y-8 mb-10">
                <div className="flex justify-center space-x-6">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => playAlphabetLetter(letter)}
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      title={`Cliquez pour écouter la lettre ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-6">
                  {["J", "K", "L", "M", "N", "O", "P", "Q", "R"].map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => playAlphabetLetter(letter)}
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      title={`Cliquez pour écouter la lettre ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-center space-x-6">
                  {["S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => playAlphabetLetter(letter)}
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      title={`Cliquez pour écouter la lettre ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row mt-8 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex-2 text-xl rounded-2xl shadow-md lg:w-2/3">
                  <p className="font-bold mb-2 font-['Poppins']">– Comment est-ce que tu épelles ton nom ?</p>
                  <p className="font-bold font-['Poppins']">– A-N-A-P-A-U-L-A.</p>
                  <p className="text-blue-100 text-lg mt-3 font-['Poppins']">(Como você soletra seu nome?)</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-xl rounded-2xl shadow-md lg:w-1/3 flex flex-col items-center justify-center">
                  <div className="text-white font-bold text-center mb-4 font-['Poppins']">
                    <p className="text-2xl">avec moi</p>
                    <p className="text-2xl">avec toi</p>
                  </div>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-['Poppins'] flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>EXPLICATION</span>
                  </button>
                </div>
              </div>

              {showExplanation && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl animate-fadeIn shadow-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 font-['Poppins']">📚 À propos de « moi » et « toi »</h3>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="text-blue-700 hover:text-blue-900 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-gray-800">
                    <p className="text-lg font-['Poppins']">
                      <span className="font-bold text-blue-700">Après les prépositions comme « avec »</span>, on utilise toujours des <span className="font-bold text-purple-700">pronoms toniques</span> (pronoms objets).
                    </p>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <p className="font-bold text-blue-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">🎯</span> « Moi » est la forme tonique de « je » :
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li>Je parle anglais. (sujet : <span className="font-bold text-blue-600">je</span>)</li>
                        <li>Tu parles avec <span className="font-bold text-blue-600">moi</span>. (objet : <span className="font-bold text-blue-600">moi</span>)</li>
                        <li>Elle étudie avec <span className="font-bold text-blue-600">moi</span>.</li>
                        <li>Ils veulent parler à <span className="font-bold text-blue-600">moi</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
                      <p className="font-bold text-purple-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">✨</span> « Toi » est la forme tonique de « tu » :
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li><span className="font-bold text-purple-600">Tu</span> es mon ami. (sujet : <span className="font-bold text-purple-600">tu</span>)</li>
                        <li>Je parle avec <span className="font-bold text-purple-600">toi</span>. (objet : <span className="font-bold text-purple-600">toi</span>)</li>
                        <li>Nous étudions avec <span className="font-bold text-purple-600">toi</span>.</li>
                        <li>Elle aime parler à <span className="font-bold text-purple-600">toi</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-xl border border-blue-300 shadow-sm">
                      <p className="font-bold text-blue-800 mb-3 font-['Poppins'] flex items-center">
                        <span className="mr-2">💡</span> Règle importante :
                      </p>
                      <p className="font-['Poppins']">Après les prépositions (avec, à, pour, de, etc.) on utilise toujours les pronoms toniques : <span className="font-bold">moi, toi, lui, elle, nous, vous, eux, elles</span>.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-['Poppins'] italic">Exemple : « J'étudie l'anglais avec <span className="font-bold">lui</span> et <span className="font-bold">elle</span>. »</p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-['Poppins']"
                      >
                        Fermer l'explication
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Leçon Précédente
          </button>
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Leçon Suivante &rarr;
          </button>
        </div>
      </div>

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
        @keyframes glow {
          0% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
          50% { box-shadow: 0 0 20px #3b82f6, 0 0 30px #3b82f6; }
          100% { box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6; }
        }
        .active\:animate-glow:active {
          animation: glow 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}