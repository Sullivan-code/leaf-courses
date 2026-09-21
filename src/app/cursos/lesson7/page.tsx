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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
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
        speakEnglish(speechText, 0.85);
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

  const toggleVisibility = () => {
    setShowEnglish(prev => !prev);
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
          title={showEnglish ? "Ocultar resposta em inglês" : "Mostrar resposta em inglês"}
        >
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showEnglish && (
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
// COMPONENTE PARA EXIBIR FRASE COM PALAVRAS DESTACADAS
// ============================================
function HighlightedPhrase({ text, greenWords, translation }: { text: string; greenWords: string[]; translation: string }) {
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
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
// MAIN COMPONENT – LESSON 7: LANGUAGES & COUNTRIES
// ============================================
export default function LessonLanguagesAndCountries() {
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

  // ============================================
  // ALPHABET AUDIO MAP - Using speechSynthesis system
  // ============================================
  const playAlphabetLetter = (letter: string) => {
    // Uses the same American female voice system as other phrases
    speakEnglish(letter, 0.8);
  };

  const playAudio = (word: string) => {
    const audioMap: { [key: string]: string } = {
      'to speak': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/to-speak.mp3',
      'to study': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/to-study.mp3',
      'Portuguese': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/portuguese.mp3',
      'English': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/english.mp3',
      'French': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/french.mp3',
      'Spanish': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/spanish.mp3',
      'Italian': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/italian.mp3',
      'German': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/german.mp3',
      'friend': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/friend.mp3',
      'teacher': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/teacher.mp3',
      'my': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my.mp3',
      'your': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/your.mp3',
      'we': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we.mp3',
      'they': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they.mp3',
      'here': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/here.mp3',
      'there': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there.mp3',
      'too': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/too.mp3',
      'with': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/with.mp3',
      'with me': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/with-me.mp3',
      'in the morning': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/in-the-morning.mp3',
      'in the afternoon': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/in-the-afternoon.mp3',
      'I drink coffee in the morning': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-drink-coffee-in-the-morning.mp3',
      'You study English in the afternoon': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-study-english-in-the-afternoon.mp3',
      'I study English at school': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-study-english-at-school.mp3',
      'Do you want to study with me': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-study-with-me.mp3',
      'We speak Italian at school': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-speak-italian-at-school.mp3',
      'We study Spanish here too': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-study-spanish-here-too.mp3',
      'They study French there': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-study-french-there.mp3',
      'They want to study here': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-study-here.mp3',
      'We want to speak English': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-want-to-speak-english.mp3',
      'They want to study German': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-study-german.mp3',
      'bye see you': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/bye-see-you.mp3',
      'see you later': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/see-you-later.mp3',
      'good night': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-night.mp3',
    };

    if (audioMap[word]) {
      const audio = new Audio(audioMap[word]);
      audio.play().catch(e => {
        console.error("Erro ao reproduzir áudio:", e);
        audio.load();
        audio.play().catch(e2 => console.error("Erro no fallback:", e2));
      });
      return;
    }

    console.warn(`Áudio não encontrado para: ${word}`);
  };

  // ---------- VERBS ----------
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu falo. / Você fala.",
      options: [
        { label: "Eu falo", replacement: "I speak.", pt: "Eu falo." },
        { label: "Você fala", replacement: "You speak.", pt: "Você fala." },
        { label: "Ela fala", replacement: "She speaks.", pt: "Ela fala." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu estudo. / Você estuda.",
      options: [
        { label: "Eu estudo", replacement: "I study.", pt: "Eu estudo." },
        { label: "Você estuda", replacement: "You study.", pt: "Você estuda." },
        { label: "Ele estuda", replacement: "He studies.", pt: "Ele estuda." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Eu não falo. / estudo / gosto / quero.",
      options: [
        { label: "não falo", replacement: "I don't speak.", pt: "Eu não falo." },
        { label: "não estudo", replacement: "I don't study.", pt: "Eu não estudo." },
        { label: "não gosto", replacement: "I don't like.", pt: "Eu não gosto." },
        { label: "não quero", replacement: "I don't want.", pt: "Eu não quero." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você fala? / estuda / quer / prefere.",
      options: [
        { label: "fala", replacement: "Do you speak?", pt: "Você fala?" },
        { label: "estuda", replacement: "Do you study?", pt: "Você estuda?" },
        { label: "quer", replacement: "Do you want?", pt: "Você quer?" },
        { label: "prefere", replacement: "Do you prefer?", pt: "Você prefere?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "O que você estuda? / fala / prefere / quer.",
      options: [
        { label: "estuda", replacement: "What do you study?", pt: "O que você estuda?" },
        { label: "fala", replacement: "What do you speak?", pt: "O que você fala?" },
        { label: "prefere", replacement: "What do you prefer?", pt: "O que você prefere?" },
        { label: "quer", replacement: "What do you want?", pt: "O que você quer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "O que você gosta? / come / bebe.",
      options: [
        { label: "gosta", replacement: "What do you like?", pt: "O que você gosta?" },
        { label: "come", replacement: "What do you eat?", pt: "O que você come?" },
        { label: "bebe", replacement: "What do you drink?", pt: "O que você bebe?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "O que você gosta de estudar? / beber / comer.",
      options: [
        { label: "estudar", replacement: "What do you like to study?", pt: "O que você gosta de estudar?" },
        { label: "beber", replacement: "What do you like to drink?", pt: "O que você gosta de beber?" },
        { label: "comer", replacement: "What do you like to eat?", pt: "O que você gosta de comer?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "O que você quer estudar? / falar / comer.",
      options: [
        { label: "estudar", replacement: "What do you want to study?", pt: "O que você quer estudar?" },
        { label: "falar", replacement: "What do you want to speak?", pt: "O que você quer falar?" },
        { label: "comer", replacement: "What do you want to eat?", pt: "O que você quer comer?" }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- NEW WORDS ----------
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu falo. / Eu estudo.",
      options: [
        { label: "Eu falo", replacement: "I speak.", pt: "Eu falo." },
        { label: "Eu estudo", replacement: "I study.", pt: "Eu estudo." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu falo inglês. / francês / italiano.",
      options: [
        { label: "inglês", replacement: "I speak English.", pt: "Eu falo inglês." },
        { label: "francês", replacement: "I speak French.", pt: "Eu falo francês." },
        { label: "italiano", replacement: "I speak Italian.", pt: "Eu falo italiano." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Eu estudo inglês. / alemão / português.",
      options: [
        { label: "inglês", replacement: "I study English.", pt: "Eu estudo inglês." },
        { label: "alemão", replacement: "I study German.", pt: "Eu estudo alemão." },
        { label: "português", replacement: "I study Portuguese.", pt: "Eu estudo português." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu estudo espanhol. / aqui / lá.",
      options: [
        { label: "espanhol", replacement: "I study Spanish.", pt: "Eu estudo espanhol." },
        { label: "aqui", replacement: "I study here.", pt: "Eu estudo aqui." },
        { label: "lá", replacement: "I study there.", pt: "Eu estudo lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Você estuda português aqui? / alemão / inglês.",
      options: [
        { label: "português", replacement: "Do you study Portuguese here?", pt: "Você estuda português aqui?" },
        { label: "alemão", replacement: "Do you study German here?", pt: "Você estuda alemão aqui?" },
        { label: "inglês", replacement: "Do you study English here?", pt: "Você estuda inglês aqui?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você fala espanhol? / italiano / francês.",
      options: [
        { label: "espanhol", replacement: "Do you speak Spanish?", pt: "Você fala espanhol?" },
        { label: "italiano", replacement: "Do you speak Italian?", pt: "Você fala italiano?" },
        { label: "francês", replacement: "Do you speak French?", pt: "Você fala francês?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu falo inglês com meu amigo. / meu professor / minha amiga.",
      options: [
        { label: "meu amigo", replacement: "I speak English with my friend.", pt: "Eu falo inglês com meu amigo." },
        { label: "meu professor", replacement: "I speak English with my teacher.", pt: "Eu falo inglês com meu professor." },
        { label: "minha amiga", replacement: "I speak English with my friend.", pt: "Eu falo inglês com minha amiga." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Você estuda com seu amigo? / fala / espanhol.",
      options: [
        { label: "estuda", replacement: "Do you study with your friend?", pt: "Você estuda com seu amigo?" },
        { label: "fala", replacement: "Do you speak with your friend?", pt: "Você fala com seu amigo?" },
        { label: "espanhol", replacement: "Do you study Spanish with your friend?", pt: "Você estuda espanhol com seu amigo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu quero falar com meu professor. / minha amiga / seus amigos.",
      options: [
        { label: "meu professor", replacement: "I want to speak with my teacher.", pt: "Eu quero falar com meu professor." },
        { label: "minha amiga", replacement: "I want to speak with my friend.", pt: "Eu quero falar com minha amiga." },
        { label: "seus amigos", replacement: "I want to speak with your friends.", pt: "Eu quero falar com seus amigos." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu falo francês também. / italiano / alemão.",
      options: [
        { label: "francês", replacement: "I speak French too.", pt: "Eu falo francês também." },
        { label: "italiano", replacement: "I speak Italian too.", pt: "Eu falo italiano também." },
        { label: "alemão", replacement: "I speak German too.", pt: "Eu falo alemão também." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu estudo aqui também. / lá.",
      options: [
        { label: "aqui", replacement: "I study here too.", pt: "Eu estudo aqui também." },
        { label: "lá", replacement: "I study there too.", pt: "Eu estudo lá também." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- SPEAK LIKE A NATIVE ----------
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu estudo espanhol de manhã. / à tarde.",
      options: [
        { label: "de manhã", replacement: "I study Spanish in the morning.", pt: "Eu estudo espanhol de manhã." },
        { label: "à tarde", replacement: "I study Spanish in the afternoon.", pt: "Eu estudo espanhol à tarde." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Você não estuda à tarde. / de manhã.",
      options: [
        { label: "à tarde", replacement: "You don't study in the afternoon.", pt: "Você não estuda à tarde." },
        { label: "de manhã", replacement: "You don't study in the morning.", pt: "Você não estuda de manhã." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Você bebe café à tarde? / chá / suco.",
      options: [
        { label: "café", replacement: "Do you drink coffee in the afternoon?", pt: "Você bebe café à tarde?" },
        { label: "chá", replacement: "Do you drink tea in the afternoon?", pt: "Você bebe chá à tarde?" },
        { label: "suco", replacement: "Do you drink juice in the afternoon?", pt: "Você bebe suco à tarde?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu estudo português na escola. / inglês / espanhol.",
      options: [
        { label: "português", replacement: "I study Portuguese at school.", pt: "Eu estudo português na escola." },
        { label: "inglês", replacement: "I study English at school.", pt: "Eu estudo inglês na escola." },
        { label: "espanhol", replacement: "I study Spanish at school.", pt: "Eu estudo espanhol na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Eu falo inglês na escola. / aqui / lá.",
      options: [
        { label: "na escola", replacement: "I speak English at school.", pt: "Eu falo inglês na escola." },
        { label: "aqui", replacement: "I speak English here.", pt: "Eu falo inglês aqui." },
        { label: "lá", replacement: "I speak English there.", pt: "Eu falo inglês lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Você quer estudar comigo? / falar.",
      options: [
        { label: "estudar", replacement: "Do you want to study with me?", pt: "Você quer estudar comigo?" },
        { label: "falar", replacement: "Do you want to speak with me?", pt: "Você quer falar comigo?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Você gosta de estudar comigo? / com seu professor / seus amigos.",
      options: [
        { label: "comigo", replacement: "Do you like to study with me?", pt: "Você gosta de estudar comigo?" },
        { label: "com seu professor", replacement: "Do you like to study with your teacher?", pt: "Você gosta de estudar com seu professor?" },
        { label: "seus amigos", replacement: "Do you like to study with your friends?", pt: "Você gosta de estudar com seus amigos?" }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Eu quero falar com você. / estudar.",
      options: [
        { label: "falar", replacement: "I want to speak with you.", pt: "Eu quero falar com você." },
        { label: "estudar", replacement: "I want to study with you.", pt: "Eu quero estudar com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Eu gosto de estudar com você. / com meus amigos / meu professor.",
      options: [
        { label: "com você", replacement: "I like to study with you.", pt: "Eu gosto de estudar com você." },
        { label: "com meus amigos", replacement: "I like to study with my friends.", pt: "Eu gosto de estudar com meus amigos." },
        { label: "meu professor", replacement: "I like to study with my teacher.", pt: "Eu gosto de estudar com meu professor." }
      ],
      currentIndex: 0,
    },
  ];

  // ---------- GRAMMAR ----------
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Você estuda italiano aqui? / alemão / inglês.",
      options: [
        { label: "italiano", replacement: "Do you study Italian here?", pt: "Você estuda italiano aqui?" },
        { label: "alemão", replacement: "Do you study German here?", pt: "Você estuda alemão aqui?" },
        { label: "inglês", replacement: "Do you study English here?", pt: "Você estuda inglês aqui?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Nós estudamos francês aqui. / italiano / português.",
      options: [
        { label: "francês", replacement: "We study French here.", pt: "Nós estudamos francês aqui." },
        { label: "italiano", replacement: "We study Italian here.", pt: "Nós estudamos italiano aqui." },
        { label: "português", replacement: "We study Portuguese here.", pt: "Nós estudamos português aqui." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Você fala espanhol na escola? / alemão / português.",
      options: [
        { label: "espanhol", replacement: "Do you speak Spanish at school?", pt: "Você fala espanhol na escola?" },
        { label: "alemão", replacement: "Do you speak German at school?", pt: "Você fala alemão na escola?" },
        { label: "português", replacement: "Do you speak Portuguese at school?", pt: "Você fala português na escola?" }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eles estudam na escola de manhã. / aqui / lá.",
      options: [
        { label: "na escola de manhã", replacement: "They study at school in the morning.", pt: "Eles estudam na escola de manhã." },
        { label: "aqui", replacement: "They study here.", pt: "Eles estudam aqui." },
        { label: "lá", replacement: "They study there.", pt: "Eles estudam lá." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Nós falamos inglês e alemão. / Eu / Eles.",
      options: [
        { label: "Nós", replacement: "We speak English and German.", pt: "Nós falamos inglês e alemão." },
        { label: "Eu", replacement: "I speak English and German.", pt: "Eu falo inglês e alemão." },
        { label: "Eles", replacement: "They speak English and German.", pt: "Eles falam inglês e alemão." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Elas preferem falar inglês. / querem / adoram.",
      options: [
        { label: "preferem", replacement: "They prefer to speak English.", pt: "Elas preferem falar inglês." },
        { label: "querem", replacement: "They want to speak English.", pt: "Elas querem falar inglês." },
        { label: "adoram", replacement: "They love to speak English.", pt: "Elas adoram falar inglês." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Eu gosto de falar com você. / Eles / Nós.",
      options: [
        { label: "Eu", replacement: "I like to speak with you.", pt: "Eu gosto de falar com você." },
        { label: "Eles", replacement: "They like to speak with you.", pt: "Eles gostam de falar com você." },
        { label: "Nós", replacement: "We like to speak with you.", pt: "Nós gostamos de falar com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Nós queremos estudar lá. / aqui / na escola.",
      options: [
        { label: "lá", replacement: "We want to study there.", pt: "Nós queremos estudar lá." },
        { label: "aqui", replacement: "We want to study here.", pt: "Nós queremos estudar aqui." },
        { label: "na escola", replacement: "We want to study at school.", pt: "Nós queremos estudar na escola." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Elas falam italiano também. / português / Nós falamos.",
      options: [
        { label: "italiano", replacement: "They speak Italian too.", pt: "Elas falam italiano também." },
        { label: "português", replacement: "They speak Portuguese too.", pt: "Elas falam português também." },
        { label: "Nós falamos", replacement: "We speak Italian too.", pt: "Nós falamos italiano também." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Eu quero estudar espanhol com você. / gosto / prefiro.",
      options: [
        { label: "quero", replacement: "I want to study Spanish with you.", pt: "Eu quero estudar espanhol com você." },
        { label: "gosto", replacement: "I like to study Spanish with you.", pt: "Eu gosto de estudar espanhol com você." },
        { label: "prefiro", replacement: "I prefer to study Spanish with you.", pt: "Eu prefiro estudar espanhol com você." }
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "Você quer estudar com meu amigo? / seu amigo / comigo.",
      options: [
        { label: "meu amigo", replacement: "Do you want to study with my friend?", pt: "Você quer estudar com meu amigo?" },
        { label: "seu amigo", replacement: "Do you want to study with your friend?", pt: "Você quer estudar com seu amigo?" },
        { label: "comigo", replacement: "Do you want to study with me?", pt: "Você quer estudar comigo?" }
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
    { en: "I drink coffee in the morning.", pt: "Eu bebo café de manhã." },
    { en: "You study English in the afternoon.", pt: "Você estuda inglês à tarde." },
    { en: "I study English at school.", pt: "Eu estudo inglês na escola." },
    { en: "Do you want to study with me?", pt: "Você quer estudar comigo?" },
  ];

  const grammarSentences = [
    { en: "We speak Italian at school.", pt: "Nós falamos italiano na escola." },
    { en: "We study Spanish here too.", pt: "Nós estudamos espanhol aqui também." },
    { en: "They study French there.", pt: "Eles estudam francês lá." },
    { en: "They want to study here.", pt: "Eles querem estudar aqui." },
    { en: "We want to speak English.", pt: "Nós queremos falar inglês." },
    { en: "They want to study German.", pt: "Eles querem estudar alemão." },
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
            Lesson 7 - Languages & Countries
          </h1>
          <SpeakSentence text="Learn to talk about languages, countries and practice conversations in English." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🌍🗣️ Learn to talk about languages, countries and practice conversations in English. 🌍🗣️
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src="https://i.ibb.co/nsrGVyhd/l7-main1.jpg"
              alt="Languages and Countries"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Verbs')} />
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to speak" className="text-blue-600 font-bold">to speak</SpeakText> = falar
              </li>
              <li>
                <SpeakText text="to study" className="text-blue-600 font-bold">to study</SpeakText> = estudar
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

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 New Words</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('New Words')} />
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
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
                { en: "Portuguese", pt: "português" },
                { en: "English", pt: "inglês" },
                { en: "French", pt: "francês" },
                { en: "Spanish", pt: "espanhol" },
                { en: "Italian", pt: "italiano" },
                { en: "German", pt: "alemão" },
                { en: "friend", pt: "amigo(a)" },
                { en: "teacher", pt: "professor(a)" },
                { en: "my", pt: "meu(s), minha(s)" },
                { en: "your", pt: "seu(s), sua(s)" },
                { en: "their", pt: "deles, delas" },
                { en: "our", pt: "nosso, nossa" },
                { en: "we", pt: "nós" },
                { en: "they", pt: "eles, elas" },
                { en: "here", pt: "aqui" },
                { en: "there", pt: "lá" },
                { en: "too", pt: "também" },
                { en: "with", pt: "com" },
              ].map((word, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakText text={word.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                    {word.en}
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

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Useful Phrases')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Practice common phrases to talk about languages" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about languages
            </SpeakSentence>

            <div className="space-y-2 mb-6">
              {speakLikeNativeSentences.map((s, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakSentence text={s.en} className="text-base font-medium text-gray-800">
                    {s.en}
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

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              </div>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Structures to talk about languages with different people" className="text-md text-gray-600 mb-4 italic">
              📚 Structures to talk about languages with different people
            </SpeakSentence>

            <div className="space-y-2 mb-6">
              {grammarSentences.map((s, idx) => (
                <div key={idx} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <SpeakSentence text={s.en} className="text-base font-medium text-gray-800">
                    {s.en}
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

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">MAKE IT YOURS!</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice pronunciation in real situations
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I like to speak English with my friends')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I like to speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('English')}
                          >English</span> with my friends.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de falar inglês com meus amigos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('They speak Spanish at school')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. They speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Spanish')}
                          >Spanish</span> at school.
                        </p>
                        <p className="text-sm text-gray-600">Eles falam espanhol na escola.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('They like to study Portuguese')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. They like to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Portuguese')}
                          >Portuguese</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eles gostam de estudar português.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you study here or there')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Do you study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('here')}
                          >here</span> or there?
                        </p>
                        <p className="text-sm text-gray-600">Você estuda aqui ou lá?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you want to study with me')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. Do you want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('with me')}
                          >with me</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você quer estudar comigo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you speak German with your teacher')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Do you speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('German')}
                          >German</span> with your teacher?
                        </p>
                        <p className="text-sm text-gray-600">Você fala alemão com seu professor?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I speak Italian with my friend')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. I speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Italian')}
                          >Italian</span> with my friend.
                        </p>
                        <p className="text-sm text-gray-600">Eu falo italiano com meu amigo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We want to study in the morning')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. We want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('in the morning')}
                          >in the morning</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós queremos estudar de manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you want to study in the afternoon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Do you want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('in the afternoon')}
                          >in the afternoon</span>?
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
                        alt="People studying languages"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Studying languages with friends
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/7xHnG0TG/l7-reallife-2.jpg"
                        alt="Different flags and cultures"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Diversity of languages and cultures
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
              <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
              <SpeakSentence text="Learn the alphabet and practice spelling words in English." className="mt-2 text-blue-100 italic">
                🔤 Learn the alphabet and practice spelling words in English.
              </SpeakSentence>
            </div>
          </div>

          <div className="w-full mx-auto bg-white p-6 font-sans">
            <div className="border-2 border-blue-300 p-6 mt-4 rounded-2xl bg-blue-50">
              <div className="text-center font-bold mb-8 text-2xl text-blue-700 font-['Poppins']">THE ALPHABET</div>

              <div className="flex flex-col items-center justify-center space-y-8 mb-10">
                <div className="flex justify-center space-x-6">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((letter) => (
                    <button 
                      key={letter} 
                      onClick={() => playAlphabetLetter(letter)}
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      title={`Click to hear letter ${letter}`}
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
                      title={`Click to hear letter ${letter}`}
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
                      title={`Click to hear letter ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row mt-8 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex-2 text-xl rounded-2xl shadow-md lg:w-2/3">
                  <p className="font-bold mb-2 font-['Poppins']">– How do you spell your name?</p>
                  <p className="font-bold font-['Poppins']">– A-N-A-P-A-U-L-A.</p>
                  <p className="text-blue-100 text-lg mt-3 font-['Poppins']">(Como você soletra seu nome?)</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-xl rounded-2xl shadow-md lg:w-1/3 flex flex-col items-center justify-center">
                  <div className="text-white font-bold text-center mb-4 font-['Poppins']">
                    <p className="text-2xl">with me</p>
                    <p className="text-2xl">with you</p>
                  </div>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-['Poppins'] flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>EXPLANATION</span>
                  </button>
                </div>
              </div>

              {showExplanation && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl animate-fadeIn shadow-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 font-['Poppins']">📚 About "me" and "you"</h3>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="text-blue-700 hover:text-blue-900 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-gray-800">
                    <p className="text-lg font-['Poppins']">
                      <span className="font-bold text-blue-700">After prepositions like "with"</span>, we always use <span className="font-bold text-purple-700">object pronouns</span>.
                    </p>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <p className="font-bold text-blue-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">🎯</span> "Me" is the object form of "I":
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li>I speak English. (subject: <span className="font-bold text-blue-600">I</span>)</li>
                        <li>You speak with <span className="font-bold text-blue-600">me</span>. (object: <span className="font-bold text-blue-600">me</span>)</li>
                        <li>She studies with <span className="font-bold text-blue-600">me</span>.</li>
                        <li>They want to talk to <span className="font-bold text-blue-600">me</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
                      <p className="font-bold text-purple-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">✨</span> "You" stays the same for both subject and object:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li><span className="font-bold text-purple-600">You</span> are my friend. (subject: <span className="font-bold text-purple-600">You</span>)</li>
                        <li>I speak with <span className="font-bold text-purple-600">you</span>. (object: <span className="font-bold text-purple-600">you</span>)</li>
                        <li>We study with <span className="font-bold text-purple-600">you</span>.</li>
                        <li>She likes to talk to <span className="font-bold text-purple-600">you</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-xl border border-blue-300 shadow-sm">
                      <p className="font-bold text-blue-800 mb-3 font-['Poppins'] flex items-center">
                        <span className="mr-2">💡</span> Important rule:
                      </p>
                      <p className="font-['Poppins']">After prepositions (with, to, for, about, etc.) we always use object pronouns: <span className="font-bold">me, you, him, her, it, us, them</span>.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-['Poppins'] italic">Example: "I study English with <span className="font-bold">him</span> and <span className="font-bold">her</span>."</p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-['Poppins']"
                      >
                        Close Explanation
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
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
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