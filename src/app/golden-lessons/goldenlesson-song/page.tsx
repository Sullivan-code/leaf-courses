"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Music, Youtube, ExternalLink, BookOpen, Headphones, Heart, Play } from "lucide-react";

type SectionKey = 'lyrics' | 'vocabulary' | 'expressions' | 'grammar';

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
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-orange-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />}
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
      className={`group cursor-pointer hover:bg-orange-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500" />
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
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-orange-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={handleSave} className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full hover:from-orange-600 hover:to-orange-800 transition-all duration-300">Salvar Anotação</button>
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
    <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-orange-700 font-semibold block text-sm md:text-base">{exercise.original}</p>
        <div className="flex items-center gap-1 ml-2 flex-shrink-0">
          {showEnglish && currentTranslation && (
            <button
              onClick={toggleTranslation}
              className="px-2 py-1 text-[10px] md:text-xs rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
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
        <div className="mb-3 p-3 bg-orange-50 rounded-md border border-orange-100">
          <SpeakSentence text={currentSentence} className="text-orange-800 font-semibold" />
          {showTranslation && currentTranslation && (
            <p className="text-gray-600 text-sm mt-2 border-t border-orange-200 pt-2">🇧🇷 {currentTranslation}</p>
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
                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
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
// LYRICS LINE COMPONENT (click to reveal translation & notes)
// ============================================
function LyricLine({
  english,
  portuguese,
  expression,
  expressionMeaning,
}: {
  english: string;
  portuguese: string;
  expression?: string;
  expressionMeaning?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        isOpen ? 'border-orange-400 bg-orange-50 shadow-md' : 'border-gray-200 bg-white hover:border-orange-200'
      }`}
    >
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full text-left px-4 py-3 flex items-start justify-between gap-3 group"
      >
        <div className="flex-1">
          <SpeakSentence text={english} className="text-gray-800 font-medium text-sm md:text-base">
            {english}
          </SpeakSentence>
        </div>
        <span
          className={`mt-0.5 flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full transition-colors ${
            isOpen ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600'
          }`}
        >
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-orange-200" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          <p className="text-gray-600 text-sm mt-3 italic">🇧🇷 {portuguese}</p>
          {expression && (
            <div className="mt-3 bg-white rounded-lg p-3 border border-orange-200">
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1 flex items-center gap-1">
                <BookOpen size={12} /> Expressão / Gíria
              </p>
              <p className="text-sm text-gray-800 font-semibold">{expression}</p>
              {expressionMeaning && (
                <p className="text-xs text-gray-600 mt-1">{expressionMeaning}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonSongIDontWantToTalkAboutIt() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    lyrics: true,
    vocabulary: false,
    expressions: false,
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

  // ============================================================
  // LYRICS DATA
  // ============================================================
  const lyricsData = [
    {
      english: "I can tell by your eyes that you've probably been crying forever",
      portuguese: "Eu posso ver pelos seus olhos que você provavelmente está chorando há muito tempo",
      expression: "I can tell by your eyes",
      expressionMeaning: "Expressão usada para dizer que você consegue perceber algo apenas olhando para a pessoa, sem que ela precise falar."
    },
    {
      english: "And the stars in the sky don't mean nothing to you, they're a mirror",
      portuguese: "E as estrelas no céu não significam nada para você, elas são um espelho",
      expression: "don't mean nothing",
      expressionMeaning: "Uso coloquial de dupla negação (non-standard). O correto gramaticalmente seria 'don't mean anything'. Muito comum em músicas e na fala informal."
    },
    {
      english: "I don't want to talk about it",
      portuguese: "Eu não quero falar sobre isso",
      expression: "I don't want to talk about it",
      expressionMeaning: "Expressão usada quando alguém não se sente confortável ou não quer discutir um assunto doloroso ou delicado."
    },
    {
      english: "How you broke my heart",
      portuguese: "Como você partiu meu coração",
      expression: "broke my heart",
      expressionMeaning: "Literalmente 'quebrou meu coração'. Usado para dizer que alguém causou uma grande tristeza emocional."
    },
    {
      english: "If I stay here just a little bit longer",
      portuguese: "Se eu ficar aqui só mais um pouquinho",
      expression: "just a little bit longer",
      expressionMeaning: "'Só mais um pouquinho' — pedido para prolongar um momento por um curto período de tempo."
    },
    {
      english: "If I stay here, won't you listen to my heart?",
      portuguese: "Se eu ficar aqui, você não vai ouvir meu coração?",
      expression: "listen to my heart",
      expressionMeaning: "Usada de forma figurada para pedir que alguém entenda seus sentimentos verdadeiros."
    },
    {
      english: "If I stand all alone, will the shadows hide the colors of my heart?",
      portuguese: "Se eu ficar sozinho, as sombras vão esconder as cores do meu coração?",
      expression: "stand all alone",
      expressionMeaning: "'Ficar completamente sozinho' — descreve um estado de solidão total."
    },
    {
      english: "Blue for the tears, black for the night's fears",
      portuguese: "Azul pelas lágrimas, preto pelos medos da noite",
      expression: "blue for the tears, black for the night's fears",
      expressionMeaning: "Metáfora poética. 'Blue' (azul) representa tristeza/lágrimas e 'black' (preto) representa medo/ansiedade."
    },
  ];

  // ============================================================
  // VERBS – MUSIC / EMOTIONS
  // ============================================================
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu posso ver pelos seus olhos. / ele / nós",
      options: [
        { label: "Eu", replacement: "I can tell by your eyes.", translation: "Eu posso ver pelos seus olhos." },
        { label: "Ele", replacement: "He can tell by your eyes.", translation: "Ele pode ver pelos seus olhos." },
        { label: "Nós", replacement: "We can tell by your eyes.", translation: "Nós podemos ver pelos seus olhos." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ela estava chorando. / ele / eles",
      options: [
        { label: "Ela", replacement: "She was crying.", translation: "Ela estava chorando." },
        { label: "Ele", replacement: "He was crying.", translation: "Ele estava chorando." },
        { label: "Eles", replacement: "They were crying.", translation: "Eles estavam chorando." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Isso não significa nada para mim. / para ele / para nós",
      options: [
        { label: "para mim", replacement: "It doesn't mean anything to me.", translation: "Isso não significa nada para mim." },
        { label: "para ele", replacement: "It doesn't mean anything to him.", translation: "Isso não significa nada para ele." },
        { label: "para nós", replacement: "It doesn't mean anything to us.", translation: "Isso não significa nada para nós." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Você partiu meu coração. / ele / ela",
      options: [
        { label: "Você", replacement: "You broke my heart.", translation: "Você partiu meu coração." },
        { label: "Ele", replacement: "He broke my heart.", translation: "Ele partiu meu coração." },
        { label: "Ela", replacement: "She broke my heart.", translation: "Ela partiu meu coração." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Se eu ficar aqui mais um pouco. / ele / nós",
      options: [
        { label: "Eu", replacement: "If I stay here a little bit longer.", translation: "Se eu ficar aqui mais um pouco." },
        { label: "Ele", replacement: "If he stays here a little bit longer.", translation: "Se ele ficar aqui mais um pouco." },
        { label: "Nós", replacement: "If we stay here a little bit longer.", translation: "Se nós ficarmos aqui mais um pouco." }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Você não vai ouvir meu coração? / ele / ela",
      options: [
        { label: "Você", replacement: "Won't you listen to my heart?", translation: "Você não vai ouvir meu coração?" },
        { label: "Ele", replacement: "Won't he listen to my heart?", translation: "Ele não vai ouvir meu coração?" },
        { label: "Ela", replacement: "Won't she listen to my heart?", translation: "Ela não vai ouvir meu coração?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "As sombras vão esconder as cores do meu coração? / a luz / a noite",
      options: [
        { label: "sombras", replacement: "Will the shadows hide the colors of my heart?", translation: "As sombras vão esconder as cores do meu coração?" },
        { label: "luz", replacement: "Will the light hide the colors of my heart?", translation: "A luz vai esconder as cores do meu coração?" },
        { label: "noite", replacement: "Will the night hide the colors of my heart?", translation: "A noite vai esconder as cores do meu coração?" }
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu não quero falar sobre isso. / ele / nós",
      options: [
        { label: "Eu", replacement: "I don't want to talk about it.", translation: "Eu não quero falar sobre isso." },
        { label: "Ele", replacement: "He doesn't want to talk about it.", translation: "Ele não quer falar sobre isso." },
        { label: "Nós", replacement: "We don't want to talk about it.", translation: "Nós não queremos falar sobre isso." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // VOCABULARY
  // ============================================================
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Meu coração está partido. / triste / cansado",
      options: [
        { label: "partido", replacement: "My heart is broken.", translation: "Meu coração está partido." },
        { label: "triste", replacement: "My heart is sad.", translation: "Meu coração está triste." },
        { label: "cansado", replacement: "My heart is tired.", translation: "Meu coração está cansado." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu tenho medos noturnos. / medos / sonhos",
      options: [
        { label: "medos noturnos", replacement: "I have night's fears.", translation: "Eu tenho medos da noite." },
        { label: "medos", replacement: "I have fears.", translation: "Eu tenho medos." },
        { label: "sonhos", replacement: "I have dreams.", translation: "Eu tenho sonhos." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ela está chorando. / sorrindo / gritando",
      options: [
        { label: "chorando", replacement: "She is crying.", translation: "Ela está chorando." },
        { label: "sorrindo", replacement: "She is smiling.", translation: "Ela está sorrindo." },
        { label: "gritando", replacement: "She is screaming.", translation: "Ela está gritando." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "As estrelas são um espelho. / a lua / o sol",
      options: [
        { label: "estrelas", replacement: "The stars are a mirror.", translation: "As estrelas são um espelho." },
        { label: "lua", replacement: "The moon is a mirror.", translation: "A lua é um espelho." },
        { label: "sol", replacement: "The sun is a mirror.", translation: "O sol é um espelho." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Ele está sozinho. / triste / perdido",
      options: [
        { label: "sozinho", replacement: "He is alone.", translation: "Ele está sozinho." },
        { label: "triste", replacement: "He is sad.", translation: "Ele está triste." },
        { label: "perdido", replacement: "He is lost.", translation: "Ele está perdido." }
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu quero ouvir seu coração. / sua voz / sua história",
      options: [
        { label: "coração", replacement: "I want to listen to your heart.", translation: "Eu quero ouvir seu coração." },
        { label: "voz", replacement: "I want to listen to your voice.", translation: "Eu quero ouvir sua voz." },
        { label: "história", replacement: "I want to listen to your story.", translation: "Eu quero ouvir sua história." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // SPEAK LIKE A NATIVE – EXPRESSIONS
  // ============================================================
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "ph-1",
      original: "Eu não quero falar sobre isso. / pensar nisso / ouvir sobre isso",
      options: [
        { label: "falar sobre isso", replacement: "I don't want to talk about it.", translation: "Eu não quero falar sobre isso." },
        { label: "pensar nisso", replacement: "I don't want to think about it.", translation: "Eu não quero pensar nisso." },
        { label: "ouvir sobre isso", replacement: "I don't want to hear about it.", translation: "Eu não quero ouvir sobre isso." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-2",
      original: "Você partiu meu coração. / ele / ela",
      options: [
        { label: "Você", replacement: "You broke my heart.", translation: "Você partiu meu coração." },
        { label: "Ele", replacement: "He broke my heart.", translation: "Ele partiu meu coração." },
        { label: "Ela", replacement: "She broke my heart.", translation: "Ela partiu meu coração." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-3",
      original: "Você não vai ouvir meu coração? / minha voz / minha história",
      options: [
        { label: "meu coração", replacement: "Won't you listen to my heart?", translation: "Você não vai ouvir meu coração?" },
        { label: "minha voz", replacement: "Won't you listen to my voice?", translation: "Você não vai ouvir minha voz?" },
        { label: "minha história", replacement: "Won't you listen to my story?", translation: "Você não vai ouvir minha história?" }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-4",
      original: "Eu posso ver pelos seus olhos. / pelo seu rosto / pelo seu jeito",
      options: [
        { label: "seus olhos", replacement: "I can tell by your eyes.", translation: "Eu posso ver pelos seus olhos." },
        { label: "seu rosto", replacement: "I can tell by your face.", translation: "Eu posso ver pelo seu rosto." },
        { label: "seu jeito", replacement: "I can tell by your way.", translation: "Eu posso ver pelo seu jeito." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-5",
      original: "As estrelas não significam nada para você. / a lua / o céu",
      options: [
        { label: "estrelas", replacement: "The stars don't mean anything to you.", translation: "As estrelas não significam nada para você." },
        { label: "lua", replacement: "The moon doesn't mean anything to you.", translation: "A lua não significa nada para você." },
        { label: "céu", replacement: "The sky doesn't mean anything to you.", translation: "O céu não significa nada para você." }
      ],
      currentIndex: 0,
    },
    {
      key: "ph-6",
      original: "Se eu ficar aqui mais um pouco. / ele / nós",
      options: [
        { label: "Eu", replacement: "If I stay here a little bit longer.", translation: "Se eu ficar aqui mais um pouco." },
        { label: "Ele", replacement: "If he stays here a little bit longer.", translation: "Se ele ficar aqui mais um pouco." },
        { label: "Nós", replacement: "If we stay here a little bit longer.", translation: "Se nós ficarmos aqui mais um pouco." }
      ],
      currentIndex: 0,
    },
  ];

  // ============================================================
  // GRAMMAR
  // ============================================================
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "gr-1",
      original: "Eu não quero falar sobre isso. / ele / nós",
      options: [
        { label: "Eu", replacement: "I don't want to talk about it.", translation: "Eu não quero falar sobre isso." },
        { label: "Ele", replacement: "He doesn't want to talk about it.", translation: "Ele não quer falar sobre isso." },
        { label: "Nós", replacement: "We don't want to talk about it.", translation: "Nós não queremos falar sobre isso." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-2",
      original: "Você partiu meu coração. / ele / ela",
      options: [
        { label: "Você", replacement: "You broke my heart.", translation: "Você partiu meu coração." },
        { label: "Ele", replacement: "He broke my heart.", translation: "Ele partiu meu coração." },
        { label: "Ela", replacement: "She broke my heart.", translation: "Ela partiu meu coração." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-3",
      original: "Se eu ficar aqui mais um pouco, você não vai ouvir meu coração? / ele / ela",
      options: [
        { label: "Eu", replacement: "If I stay here a little bit longer, won't you listen to my heart?", translation: "Se eu ficar aqui mais um pouco, você não vai ouvir meu coração?" },
        { label: "Ele", replacement: "If he stays here a little bit longer, won't you listen to his heart?", translation: "Se ele ficar aqui mais um pouco, você não vai ouvir o coração dele?" },
        { label: "Ela", replacement: "If she stays here a little bit longer, won't you listen to her heart?", translation: "Se ela ficar aqui mais um pouco, você não vai ouvir o coração dela?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-4",
      original: "Eu posso ver pelos seus olhos. / ele / nós",
      options: [
        { label: "Eu", replacement: "I can tell by your eyes.", translation: "Eu posso ver pelos seus olhos." },
        { label: "Ele", replacement: "He can tell by your eyes.", translation: "Ele pode ver pelos seus olhos." },
        { label: "Nós", replacement: "We can tell by your eyes.", translation: "Nós podemos ver pelos seus olhos." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-5",
      original: "As estrelas não significam nada para você. / para ele / para nós",
      options: [
        { label: "para você", replacement: "The stars don't mean anything to you.", translation: "As estrelas não significam nada para você." },
        { label: "para ele", replacement: "The stars don't mean anything to him.", translation: "As estrelas não significam nada para ele." },
        { label: "para nós", replacement: "The stars don't mean anything to us.", translation: "As estrelas não significam nada para nós." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-6",
      original: "As sombras vão esconder as cores do meu coração? / a luz / a noite",
      options: [
        { label: "sombras", replacement: "Will the shadows hide the colors of my heart?", translation: "As sombras vão esconder as cores do meu coração?" },
        { label: "luz", replacement: "Will the light hide the colors of my heart?", translation: "A luz vai esconder as cores do meu coração?" },
        { label: "noite", replacement: "Will the night hide the colors of my heart?", translation: "A noite vai esconder as cores do meu coração?" }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-7",
      original: "Eu não quero falar sobre como você partiu meu coração. / ele / ela",
      options: [
        { label: "Você", replacement: "I don't want to talk about how you broke my heart.", translation: "Eu não quero falar sobre como você partiu meu coração." },
        { label: "Ele", replacement: "I don't want to talk about how he broke my heart.", translation: "Eu não quero falar sobre como ele partiu meu coração." },
        { label: "Ela", replacement: "I don't want to talk about how she broke my heart.", translation: "Eu não quero falar sobre como ela partiu meu coração." }
      ],
      currentIndex: 0,
    },
    {
      key: "gr-8",
      original: "Ele está sozinho. / triste / perdido",
      options: [
        { label: "sozinho", replacement: "He is alone.", translation: "Ele está sozinho." },
        { label: "triste", replacement: "He is sad.", translation: "Ele está triste." },
        { label: "perdido", replacement: "He is lost.", translation: "Ele está perdido." }
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

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#faf6f0] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <Music size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">English Through Music</span>
            <Music size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            🎵 I Don't Want to Talk About It
          </h1>
          <p className="text-lg text-gray-600 mb-2">Rod Stewart & Amy Belle</p>
          <p className="text-sm text-gray-500 mb-8">Royal Albert Hall, London — 2004</p>

          <div className="max-w-2xl mx-auto">
            <SpeakSentence text="I don't want to talk about it. How you broke my heart. If I stay here just a little bit longer, won't you listen to my heart?" className="text-xl text-gray-700 italic">
              "I don't want to talk about it. How you broke my heart..."
            </SpeakSentence>
          </div>
        </div>

        {/* ===================== EMBEDDED YOUTUBE PLAYER ===================== */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl p-4 md:p-6 mb-10 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 p-2 rounded-full flex-shrink-0">
                <Play size={20} className="text-white" fill="white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base md:text-lg">Ouça a música enquanto estuda</h3>
                <p className="text-gray-400 text-xs md:text-sm">Rod Stewart — I Don't Want To Talk About It feat. Amy Belle</p>
              </div>
            </div>
            <a
              href="https://www.youtube.com/watch?v=w46bWxS9IjY"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex flex-shrink-0 items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl text-sm"
            >
              <Youtube size={16} />
              Abrir no YouTube
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Embedded YouTube Player */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/w46bWxS9IjY?rel=0&modestbranding=1"
              title="Rod Stewart - I Don't Want To Talk About It feat. Amy Belle"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Mobile fallback link */}
          <div className="mt-4 flex justify-center md:hidden">
            <a
              href="https://www.youtube.com/watch?v=w46bWxS9IjY"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 text-sm"
            >
              <Youtube size={16} />
              Abrir no YouTube
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* ===================== SECTION 1 – LYRICS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Headphones size={22} /> LYRICS & TRANSLATION
              </h2>
              <PencilIcon onClick={() => openNoteModal('Lyrics')} />
            </div>
            <button
              onClick={() => toggleDrill('lyrics')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.lyrics ? 'Hide Lyrics' : 'Show Lyrics'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on each line to see the translation and expressions" className="text-md text-gray-600 mb-6 italic">
              🎧 Clique em cada linha para ver a tradução e as expressões explicadas
            </SpeakSentence>

            {openDrills.lyrics && (
              <div className="space-y-3" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {lyricsData.map((line, idx) => (
                  <LyricLine
                    key={idx}
                    english={line.english}
                    portuguese={line.portuguese}
                    expression={line.expression}
                    expressionMeaning={line.expressionMeaning}
                  />
                ))}
              </div>
            )}

            {/* Full translation toggle */}
            <div className="mt-8 bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <h3 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-wide">🇧🇷 Tradução completa da música</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Eu posso ver pelos seus olhos que você provavelmente está chorando há muito tempo.
                E as estrelas no céu não significam nada para você, elas são um espelho.
                Eu não quero falar sobre isso, como você partiu meu coração.
                Se eu ficar aqui só mais um pouquinho, se eu ficar aqui, você não vai ouvir meu coração?
                Oh, meu coração...
                Se eu ficar sozinho, as sombras vão esconder as cores do meu coração?
                Azul pelas lágrimas, preto pelos medos da noite.
                As estrelas no céu não significam nada para você, elas são apenas um espelho.
                Eu não quero falar sobre isso, como você partiu meu coração.
                Se eu ficar aqui só mais um pouquinho, se eu ficar aqui, você não vai ouvir meu coração?
                Oh, meu coração...
              </p>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 2 – VOCABULARY ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Heart size={22} /> VOCABULARY
              </h2>
              <PencilIcon onClick={() => openNoteModal('Vocabulary')} />
            </div>
            <button
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "heart", pt: "coração" },
                { en: "tears", pt: "lágrimas" },
                { en: "fears", pt: "medos" },
                { en: "shadows", pt: "sombras" },
                { en: "mirror", pt: "espelho" },
                { en: "stars", pt: "estrelas" },
                { en: "crying", pt: "chorando" },
                { en: "broken", pt: "partido / quebrado" },
                { en: "alone", pt: "sozinho" },
                { en: "listen", pt: "ouvir" },
                { en: "stay", pt: "ficar" },
                { en: "hide", pt: "esconder" },
              ].map((word, idx) => (
                <div key={idx} className="bg-orange-50 p-3 rounded-lg border border-orange-200 flex items-center justify-between">
                  <SpeakText text={word.en} className="text-orange-700 font-bold cursor-pointer">
                    {word.en}
                  </SpeakText>
                  <span className="text-gray-600 text-sm">{word.pt}</span>
                </div>
              ))}
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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

        {/* ===================== SECTION 3 – EXPRESSIONS ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Expressions')} />
            </div>
            <button
              onClick={() => toggleDrill('expressions')}
              className="inline-block rounded-full bg-white text-gray-800 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-gray-100"
            >
              {openDrills.expressions ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Practice the key expressions from the song" className="text-md text-gray-600 mb-4 italic">
              💬 Practice the key expressions from the song
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {[
                { en: "I can tell by your eyes...", pt: "Eu posso ver pelos seus olhos...", note: "Perceber algo apenas pelo olhar." },
                { en: "You broke my heart.", pt: "Você partiu meu coração.", note: "Causar grande tristeza emocional." },
                { en: "I don't want to talk about it.", pt: "Eu não quero falar sobre isso.", note: "Evitar discutir algo doloroso." },
                { en: "Won't you listen to my heart?", pt: "Você não vai ouvir meu coração?", note: "Pedir que alguém entenda seus sentimentos." },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border-2 border-orange-200">
                  <SpeakSentence text={item.en} className="text-orange-700 font-bold text-base">
                    {item.en}
                  </SpeakSentence>
                  <p className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</p>
                  <p className="text-xs text-gray-500 mt-2 italic">💡 {item.note}</p>
                </div>
              ))}
            </div>
            {openDrills.expressions && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white text-orange-700 font-bold px-6 py-2 text-sm transition-all duration-300 hover:bg-orange-100"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence text="Present Simple, Past Simple, and First Conditional in the song" className="text-md text-gray-600 mb-4 italic">
              📚 Present Simple, Past Simple, and First Conditional in the song
            </SpeakSentence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <h3 className="font-bold text-orange-700 mb-2">Present Simple</h3>
                <p className="text-sm text-gray-700 mb-2">Rotinas, verdades gerais.</p>
                <p className="text-xs text-gray-600 italic mb-1">I don't want to talk about it.</p>
                <p className="text-xs text-gray-500">Eu não quero falar sobre isso.</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                <h3 className="font-bold text-gray-700 mb-2">Past Simple</h3>
                <p className="text-sm text-gray-700 mb-2">Ações passadas e concluídas.</p>
                <p className="text-xs text-gray-600 italic mb-1">You broke my heart.</p>
                <p className="text-xs text-gray-500">Você partiu meu coração.</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200">
                <h3 className="font-bold text-orange-700 mb-2">First Conditional</h3>
                <p className="text-sm text-gray-700 mb-2">Condição real no futuro.</p>
                <p className="text-xs text-gray-600 italic mb-1">If I stay here, won't you listen to my heart?</p>
                <p className="text-xs text-gray-500">Se eu ficar aqui, você não vai ouvir meu coração?</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6 border border-gray-200">
              {[
                { en: "I don't want to talk about how you broke my heart.", pt: "Eu não quero falar sobre como você partiu meu coração." },
                { en: "She was crying when I saw her.", pt: "Ela estava chorando quando eu a vi." },
                { en: "If I stay here a little bit longer, will you listen to me?", pt: "Se eu ficar aqui mais um pouco, você vai me ouvir?" },
                { en: "The stars don't mean anything to you.", pt: "As estrelas não significam nada para você." },
                { en: "He broke her heart last year.", pt: "Ele partiu o coração dela ano passado." },
                { en: "I can tell by your eyes that something is wrong.", pt: "Eu posso ver pelos seus olhos que algo está errado." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg border-l-4 border-orange-400">
                  <SpeakSentence text={item.en} className="text-orange-700 font-bold cursor-pointer text-left w-full block">
                    {item.en}
                  </SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">🇧🇷 {item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-orange-50 rounded-2xl p-4 md:p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
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
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours!</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-orange-100">Practice real-life situations</div>
          </div>
          <div className="p-6 md:p-8">
            <div className="bg-orange-50 rounded-[20px] p-6">
              <div className="space-y-4">
                {[
                  { en: "I can tell by your eyes that you are sad.", pt: "Eu posso ver pelos seus olhos que você está triste." },
                  { en: "She doesn't want to talk about how he broke her heart.", pt: "Ela não quer falar sobre como ele partiu o coração dela." },
                  { en: "If I stay here a little bit longer, will you listen to me?", pt: "Se eu ficar aqui mais um pouco, você vai me ouvir?" },
                  { en: "The stars don't mean anything to me anymore.", pt: "As estrelas não significam nada para mim mais." },
                  { en: "He was crying when I told him the news.", pt: "Ele estava chorando quando eu contei a notícia para ele." },
                  { en: "I don't want to talk about it right now.", pt: "Eu não quero falar sobre isso agora." },
                  { en: "You broke my heart, but I'm moving on.", pt: "Você partiu meu coração, mas eu estou seguindo em frente." },
                  { en: "If you stay here a little bit longer, I will listen to your heart.", pt: "Se você ficar aqui mais um pouco, eu vou ouvir seu coração." },
                ].map((s, idx) => (
                  <div key={idx} className="group bg-white p-3 rounded-lg border-l-4 border-orange-400">
                    <div className="flex items-start">
                      <SpeakSentence text={s.en} className="text-base font-medium text-gray-800">
                        {idx + 1}. {s.en}
                      </SpeakSentence>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 ml-5">🇧🇷 {s.pt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions and useful vocabulary to remember" className="mt-2 text-orange-100 italic">
              📝 Key expressions and useful vocabulary to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-gray-800 text-white flex-1 p-6 space-y-4 text-lg">
              <h3 className="font-bold text-lg mb-4 text-orange-400">KEY EXPRESSIONS</h3>
              {[
                { en: "I don't want to talk about it.", pt: "Eu não quero falar sobre isso." },
                { en: "You broke my heart.", pt: "Você partiu meu coração." },
                { en: "I can tell by your eyes...", pt: "Eu posso ver pelos seus olhos..." },
                { en: "Won't you listen to my heart?", pt: "Você não vai ouvir meu coração?" },
                { en: "If I stay here a little bit longer...", pt: "Se eu ficar aqui mais um pouquinho..." },
                { en: "The stars don't mean anything to you.", pt: "As estrelas não significam nada para você." },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text={item.en} className="text-orange-200 hover:text-white">• {item.en}</SpeakSentence>
                  </div>
                  <p className="text-orange-200 text-sm ml-4">{item.pt}</p>
                </div>
              ))}
            </div>
            <div className="bg-orange-600 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">💡 TIPS</h4>
                  <ul className="list-disc pl-5 space-y-2 text-orange-50">
                    <li>Use <strong className="text-white">"don't mean nothing"</strong> — dupla negação coloquial (não é gramaticalmente correta, mas é comum em músicas).</li>
                    <li><strong className="text-white">"Broke my heart"</strong> é uma metáfora para tristeza emocional profunda.</li>
                    <li><strong className="text-white">"I can tell by..."</strong> = perceber algo sem que a pessoa fale.</li>
                    <li>O <strong className="text-white">First Conditional</strong> (If + presente, will + verbo) é usado na música para pedir algo.</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-orange-400">
                  <h4 className="font-bold text-yellow-200 text-lg mb-3">📌 REMEMBER</h4>
                  <p className="text-orange-50">A música usa linguagem emocional e poética. Muitas expressões são figurativas e comuns em canções de amor e desilusão.</p>
                </div>
                <div className="pt-4 border-t border-orange-400">
                  <p className="text-orange-50 text-sm italic">
                    🌟 <strong>Clique nas linhas da música</strong> para ver a tradução e as explicações.
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
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (62) &rarr;
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
      `}</style>
    </div>
  );
}