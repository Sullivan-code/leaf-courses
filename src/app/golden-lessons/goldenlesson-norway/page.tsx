"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, Pencil, Check, X } from "lucide-react";

type SectionKey = 'actionSlangs' | 'norwayWords' | 'speakNative' | 'grammar';

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
     voice.name.toLowerCase().includes('female'))
  );
  const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
  if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
  else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: SpeakTextProps) => (
  <button
    onClick={() => speakEnglish(text, 0.9)}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-green-100 px-1 rounded transition-colors group ${className}`}
    title="Click to hear American pronunciation"
  >
    {children || text}
    {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />}
  </button>
);

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => (
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

// ============================================
// NOTE MODAL
// ============================================
function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean; onClose: () => void; sectionTitle: string; initialNote: string; onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ animation: 'fadeIn 0.3s ease-out' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Notes - {sectionTitle}</h3>
          <p className="text-sm text-green-100 mt-1">Write your doubts, translations, or extra examples</p>
        </div>
        <div className="p-6">
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Write your notes here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none" />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full">Save Note</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ANSWER MODAL (open-ended questions)
// ============================================
interface AnswerModalState {
  isOpen: boolean;
  questionEn: string;
  questionPt: string;
  questionKey: string;
  sectionTitle: string;
}

function AnswerModal({ state, initialAnswer, onSave, onClose }: {
  state: AnswerModalState; initialAnswer: string; onSave: (answer: string) => void; onClose: () => void;
}) {
  const [answer, setAnswer] = useState(initialAnswer);
  useEffect(() => { setAnswer(initialAnswer); }, [state.questionKey, state.isOpen, initialAnswer]);
  if (!state.isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4" style={{ animation: 'fadeIn 0.3s ease-out' }} onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2"><Pencil size={18} /> Write your answer</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20"><X size={20} /></button>
        </div>
        <div className="p-6">
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
            <p className="text-[10px] uppercase tracking-wider text-green-600 font-bold mb-1">📌 {state.sectionTitle}</p>
            <SpeakSentence text={state.questionEn} className="text-gray-800 font-semibold text-base">{state.questionEn}</SpeakSentence>
            <p className="text-sm text-gray-500 mt-1 italic">🇧🇷 {state.questionPt}</p>
          </div>
          <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">✍️ Your answer in English (C1 – aim for 40+ seconds of speech)</label>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Type your answer here... / Escreva sua resposta aqui..."
            className="w-full h-44 p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 resize-none text-gray-800 text-base leading-relaxed" autoFocus />
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={onClose} className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-full">Cancel</button>
            <button onClick={() => { onSave(answer); onClose(); }} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold shadow-md flex items-center gap-2">
              <Check size={16} /> Save Answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="ml-3 text-white/70 hover:text-white transition-colors focus:outline-none" aria-label="Take notes" title="Click to take notes">
      <Pencil className="h-5 w-5" />
    </button>
  );
}

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

function SubstitutionOptions({ exercise, onOptionClick }: {
  exercise: SubstitutionExercise;
  onOptionClick: (key: string, index: number) => void;
}) {
  const [showEnglish, setShowEnglish] = useState(true);
  const isObjectOption = (opt: OptionType): opt is { label: string; replacement: string; pt?: string } =>
    typeof opt === 'object' && opt !== null && 'label' in opt && 'replacement' in opt;

  const currentOption = exercise.options[exercise.currentIndex];
  const currentSentence = isObjectOption(currentOption) ? currentOption.replacement : String(currentOption);
  const currentPt = isObjectOption(currentOption) ? currentOption.pt : undefined;

  const getLabel = (o: OptionType) => isObjectOption(o) ? o.label : String(o);
  const getRepl = (o: OptionType) => isObjectOption(o) ? o.replacement : String(o);

  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="flex items-start justify-between mb-2">
        <p className="text-green-600 font-medium block">{exercise.original}</p>
        <button onClick={() => setShowEnglish(p => !p)}
          className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700 ml-2 flex-shrink-0"
          title={showEnglish ? "Hide answer" : "Show answer"}>
          {showEnglish ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showEnglish && (
        <div className="mb-3 p-3 bg-green-50 rounded-md">
          <SpeakSentence text={currentSentence} className="text-green-700 font-medium" />
          {currentPt && <p className="text-sm text-gray-600 mt-1 border-t border-green-200 pt-1">🇧🇷 {currentPt}</p>}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {exercise.options.map((option, index) => (
          <button key={index} onClick={() => { onOptionClick(exercise.key, index); speakEnglish(getRepl(option), 0.9); }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition ${
              exercise.currentIndex === index ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}>
            {getLabel(option)}
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
  const words = text.split(/(\s+)/);
  const parts = words.map((word, i) => {
    const cleanWord = word.replace(/[.,!?;:—-]/g, '');
    if (greenWords.some(gw => cleanWord.toLowerCase() === gw.toLowerCase())) {
      return <span key={i} className="text-green-600 font-bold">{word}</span>;
    }
    return <span key={i}>{word}</span>;
  });
  return (
    <div className="bg-white p-4 rounded-lg border border-green-200">
      <div className="mb-2">
        <SpeakSentence text={text} className="text-lg font-medium text-gray-800">{parts}</SpeakSentence>
      </div>
      <p className="text-sm text-gray-600">🇧🇷 {translation}</p>
    </div>
  );
}

// ============================================
// QUESTION CARD
// ============================================
interface Question { en: string; pt: string; }

function QuestionCard({ question, index, sectionKey, sectionTitle, answer, onOpenAnswer }: {
  question: Question; index: number; sectionKey: string; sectionTitle: string;
  answer?: string;
  onOpenAnswer: (q: Question, key: string, title: string) => void;
}) {
  const [showTranslation, setShowTranslation] = useState(false);
  const questionKey = `${sectionKey}-${index}`;
  return (
    <div className="bg-white rounded-xl border-2 border-green-100 hover:border-green-300 transition-colors p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">{index}</span>
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <SpeakSentence text={question.en} className="text-gray-800 font-medium text-sm md:text-base leading-relaxed">{question.en}</SpeakSentence>
            </div>
            <button onClick={() => onOpenAnswer(question, questionKey, sectionTitle)}
              className="flex-shrink-0 p-1.5 rounded-lg hover:bg-green-100 text-green-600 hover:text-green-800 transition-colors border border-green-200"
              title="Write your answer" aria-label="Write your answer">
              <Pencil size={15} />
            </button>
          </div>
          <button onClick={() => setShowTranslation(p => !p)}
            className="mt-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition-colors font-bold">
            {showTranslation ? "🇧🇷 Hide translation" : "🇧🇷 Show translation"}
          </button>
          {showTranslation && (
            <p className="text-gray-600 text-xs md:text-sm mt-2 italic border-l-2 border-green-300 pl-2">🇧🇷 {question.pt}</p>
          )}
          {answer && answer.trim() !== "" && (
            <div className="mt-2 bg-green-50 border-l-4 border-green-400 rounded-r-lg p-2 flex items-start gap-2">
              <Check size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 whitespace-pre-line">{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonNorwayC1() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    actionSlangs: false, norwayWords: false, speakNative: false, grammar: false,
  });
  const [noteModal, setNoteModal] = useState<NoteModalState>({ isOpen: false, sectionTitle: '', noteContent: '' });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [substitutionState, setSubstitutionState] = useState<Record<string, number>>({});

  const [answerModal, setAnswerModal] = useState<AnswerModalState>({
    isOpen: false, questionEn: '', questionPt: '', questionKey: '', sectionTitle: '',
  });
  const [savedAnswers, setSavedAnswers] = useState<Record<string, string>>({});

  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);
  const [isSeaImageModalOpen, setIsSeaImageModalOpen] = useState(false);

  const toggleDrill = (section: SectionKey) => setOpenDrills(prev => ({ ...prev, [section]: !prev[section] }));
  const openNoteModal = (sectionTitle: string) => setNoteModal({ isOpen: true, sectionTitle, noteContent: savedNotes[sectionTitle] || '' });
  const saveNote = (note: string) => setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));
  const handleOptionClick = (key: string, index: number) => setSubstitutionState(prev => ({ ...prev, [key]: index }));
  const getCurrentIndex = (key: string) => substitutionState[key] || 0;

  const openAnswerModal = (q: Question, questionKey: string, sectionTitle: string) =>
    setAnswerModal({ isOpen: true, questionEn: q.en, questionPt: q.pt, questionKey, sectionTitle });
  const saveAnswer = (answer: string) => setSavedAnswers(prev => ({ ...prev, [answerModal.questionKey]: answer }));

  useEffect(() => { if (typeof window !== 'undefined') window.speechSynthesis.getVoices(); }, []);

  // ===== IMAGES =====
  const mainImage = "https://github.com/Sullivan-code/english-audios/blob/main/norway.png?raw=true";
  const fjordImage = "https://images.pexels.com/photos/208701/pexels-photo-208701.jpeg?auto=compress&cs=tinysrgb&w=800";
  const bergenImage = "https://images.pexels.com/photos/10028354/pexels-photo-10028354.jpeg?auto=compress&cs=tinysrgb&w=800";
  const auroraImage = "https://images.pexels.com/photos/1933316/pexels-photo-1933316.jpeg?auto=compress&cs=tinysrgb&w=800";
  const hikingImage = "https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800";
  const sailingImage = "https://images.pexels.com/photos/3776555/pexels-photo-3776555.jpeg?auto=compress&cs=tinysrgb&w=800";
  const cityImage = "https://images.pexels.com/photos/10841019/pexels-photo-10841019.jpeg?auto=compress&cs=tinysrgb&w=800";
  const snowImage = "https://images.pexels.com/photos/1005417/pexels-photo-1005417.jpeg?auto=compress&cs=tinysrgb&w=800";

  // ============================================================
  // SECTION 1 – ACTION SLANGS
  // ============================================================
  const actionSlangSubstitution: SubstitutionExercise[] = [
    {
      key: "as-1", original: "aventurar-se / Eu me aventuro para fora. / nós / eles",
      options: [
        { label: "aventurar-se", replacement: "to venture out.", pt: "aventurar-se, sair para explorar" },
        { label: "Eu", replacement: "I venture out.", pt: "Eu me aventuro." },
        { label: "Nós", replacement: "We venture out.", pt: "Nós nos aventuramos." },
        { label: "Eles", replacement: "They venture out.", pt: "Eles se aventuram." },
      ], currentIndex: 0,
    },
    {
      key: "as-2", original: "absorver, contemplar / Eu absorvo a paisagem. / ele / nós",
      options: [
        { label: "contemplar", replacement: "to take in.", pt: "absorver, contemplar" },
        { label: "Eu", replacement: "I take in the landscape.", pt: "Eu contemplo a paisagem." },
        { label: "Ele", replacement: "He takes in the view.", pt: "Ele contempla a vista." },
        { label: "Nós", replacement: "We take it all in.", pt: "Nós absorvemos tudo." },
      ], currentIndex: 0,
    },
    {
      key: "as-3", original: "aproveitar ao máximo / Eu aproveito o momento. / eles / ela",
      options: [
        { label: "aproveitar", replacement: "to soak up.", pt: "aproveitar ao máximo, absorver" },
        { label: "Eu", replacement: "I soak up the moment.", pt: "Eu aproveito o momento." },
        { label: "Eles", replacement: "They soak up the atmosphere.", pt: "Eles aproveitam o clima." },
        { label: "Ela", replacement: "She soaks up the sun.", pt: "Ela aproveita o sol." },
      ], currentIndex: 0,
    },
    {
      key: "as-4", original: "navegar, cruzar / Eu navego pelos fiordes. / eles / nós",
      options: [
        { label: "navegar", replacement: "to cruise.", pt: "navegar, cruzar" },
        { label: "Eu", replacement: "I cruise through the fjords.", pt: "Eu navego pelos fiordes." },
        { label: "Eles", replacement: "They cruise along the coast.", pt: "Eles navegam pela costa." },
        { label: "Nós", replacement: "We cruise at sunset.", pt: "Nós navegamos ao pôr do sol." },
      ], currentIndex: 0,
    },
    {
      key: "as-5", original: "abraçar / Eu abraço a cultura. / eles / nós",
      options: [
        { label: "abraçar", replacement: "to embrace.", pt: "abraçar" },
        { label: "Eu", replacement: "I embrace the culture.", pt: "Eu abraço a cultura." },
        { label: "Eles", replacement: "They embrace the local lifestyle.", pt: "Eles abraçam o estilo de vida local." },
        { label: "Nós", replacement: "We embrace the cold.", pt: "Nós abraçamos o frio." },
      ], currentIndex: 0,
    },
    {
      key: "as-6", original: "vagar, afastar-se / Eu vago pelas ruas. / eles / ela",
      options: [
        { label: "vagar", replacement: "to wander off.", pt: "vagar, afastar-se" },
        { label: "Eu", replacement: "I wander off the main road.", pt: "Eu me afasto da estrada principal." },
        { label: "Eles", replacement: "They wander off to explore.", pt: "Eles vagueiam para explorar." },
        { label: "Ela", replacement: "She wanders off alone.", pt: "Ela vagueia sozinha." },
      ], currentIndex: 0,
    },
  ];

  // ============================================================
  // SECTION 2 – NORWAY WORDS
  // ============================================================
  const norwayWordsSubstitution: SubstitutionExercise[] = [
    {
      key: "nw-1", original: "Oslo é a capital da Noruega. / Bergen / Tromsø",
      options: [
        { label: "Oslo", replacement: "Oslo is the capital of Norway.", pt: "Oslo é a capital da Noruega." },
        { label: "Bergen", replacement: "Bergen is a coastal city of Norway.", pt: "Bergen é uma cidade costeira da Noruega." },
        { label: "Tromsø", replacement: "Tromsø is the northernmost city of Norway.", pt: "Tromsø é a cidade mais ao norte da Noruega." },
      ], currentIndex: 0,
    },
    {
      key: "nw-2", original: "A Noruega é famosa pelos seus fiordes. / montanhas / geleiras",
      options: [
        { label: "fiordes", replacement: "Norway is famous for its fjords.", pt: "A Noruega é famosa pelos seus fiordes." },
        { label: "montanhas", replacement: "Norway is famous for its mountains.", pt: "A Noruega é famosa por suas montanhas." },
        { label: "geleiras", replacement: "Norway is famous for its glaciers.", pt: "A Noruega é famosa por suas geleiras." },
      ], currentIndex: 0,
    },
    {
      key: "nw-3", original: "Bergen é a porta de entrada para os fiordes. / Oslo / Stavanger",
      options: [
        { label: "fiordes", replacement: "Bergen is the gateway to the fjords.", pt: "Bergen é a porta de entrada para os fiordes." },
        { label: "norte", replacement: "Bergen is the gateway to the north.", pt: "Bergen é a porta de entrada para o norte." },
        { label: "Arctic", replacement: "Bergen is the gateway to the Arctic.", pt: "Bergen é a porta de entrada para o Ártico." },
      ], currentIndex: 0,
    },
    {
      key: "nw-4", original: "Tromsø é famosa pela Aurora Boreal. / Sol da Meia-Noite / fauna ártica",
      options: [
        { label: "Aurora Boreal", replacement: "Tromsø is famous for the Northern Lights.", pt: "Tromsø é famosa pela Aurora Boreal." },
        { label: "Sol da Meia-Noite", replacement: "Tromsø is famous for the Midnight Sun.", pt: "Tromsø é famosa pelo Sol da Meia-Noite." },
        { label: "fauna ártica", replacement: "Tromsø is famous for its Arctic wildlife.", pt: "Tromsø é famosa por sua fauna ártica." },
      ], currentIndex: 0,
    },
    {
      key: "nw-5", original: "Lofoten é conhecida por suas paisagens dramáticas. / praias / vilas de pescadores",
      options: [
        { label: "paisagens dramáticas", replacement: "Lofoten is known for its dramatic landscapes.", pt: "Lofoten é conhecida por suas paisagens dramáticas." },
        { label: "praias", replacement: "Lofoten is known for its pristine beaches.", pt: "Lofoten é conhecida por suas praias intocadas." },
        { label: "vilas de pescadores", replacement: "Lofoten is known for its fishing villages.", pt: "Lofoten é conhecida por suas vilas de pescadores." },
      ], currentIndex: 0,
    },
    {
      key: "nw-6", original: "O Fiorde de Geiranger é Patrimônio da UNESCO. / Nærøyfjord / Bryggen",
      options: [
        { label: "Geirangerfjord", replacement: "The Geirangerfjord is a UNESCO World Heritage Site.", pt: "O Fiorde de Geiranger é Patrimônio da UNESCO." },
        { label: "Nærøyfjord", replacement: "The Nærøyfjord is a UNESCO World Heritage Site.", pt: "O Fiorde de Nærøy é Patrimônio da UNESCO." },
        { label: "Bryggen", replacement: "Bryggen is a UNESCO World Heritage Site.", pt: "Bryggen é Patrimônio da UNESCO." },
      ], currentIndex: 0,
    },
    {
      key: "nw-7", original: "Preikestolen atrai aventureiros do mundo todo. / Trolltunga / Kjeragbolten",
      options: [
        { label: "Preikestolen", replacement: "Preikestolen attracts adventurers from all over the world.", pt: "Preikestolen atrai aventureiros do mundo todo." },
        { label: "Trolltunga", replacement: "Trolltunga attracts adventurers from all over the world.", pt: "Trolltunga atrai aventureiros do mundo todo." },
        { label: "Kjeragbolten", replacement: "Kjeragbolten attracts adventurers from all over the world.", pt: "Kjeragbolten atrai aventureiros do mundo todo." },
      ], currentIndex: 0,
    },
    {
      key: "nw-8", original: "A Noruega tem uma costa impressionante. / linha costeira / arquipélago",
      options: [
        { label: "costa", replacement: "Norway has a breathtaking coastline.", pt: "A Noruega tem uma costa de tirar o fôlego." },
        { label: "linha costeira", replacement: "Norway has a rugged shoreline.", pt: "A Noruega tem uma linha costeira acidentada." },
        { label: "arquipélago", replacement: "Norway has a vast archipelago.", pt: "A Noruega tem um vasto arquipélago." },
      ], currentIndex: 0,
    },
    {
      key: "nw-9", original: "O povo norueguês tem uma forte ligação com o mar. / tradição marítima / herança Viking",
      options: [
        { label: "o mar", replacement: "The Norwegian people have a deep connection with the sea.", pt: "O povo norueguês tem uma forte ligação com o mar." },
        { label: "tradição marítima", replacement: "The Norwegian people have a rich maritime tradition.", pt: "O povo norueguês tem uma rica tradição marítima." },
        { label: "herança Viking", replacement: "The Norwegian people have a proud Viking heritage.", pt: "O povo norueguês tem uma orgulhosa herança Viking." },
      ], currentIndex: 0,
    },
    {
      key: "nw-10", original: "Os Vikings eram navegadores habilidosos. / pescadores / comerciantes",
      options: [
        { label: "navegadores", replacement: "The Vikings were skilled seafarers.", pt: "Os Vikings eram navegadores habilidosos." },
        { label: "pescadores", replacement: "The Vikings were skilled fishermen.", pt: "Os Vikings eram pescadores habilidosos." },
        { label: "comerciantes", replacement: "The Vikings were skilled traders.", pt: "Os Vikings eram comerciantes habilidosos." },
      ], currentIndex: 0,
    },
    {
      key: "nw-11", original: "A economia norueguesa depende fortemente do petróleo. / pesca / transporte marítimo",
      options: [
        { label: "petróleo", replacement: "The Norwegian economy depends heavily on oil.", pt: "A economia norueguesa depende fortemente do petróleo." },
        { label: "pesca", replacement: "The Norwegian economy depends heavily on fishing.", pt: "A economia norueguesa depende fortemente da pesca." },
        { label: "transporte marítimo", replacement: "The Norwegian economy depends heavily on shipping.", pt: "A economia norueguesa depende fortemente do transporte marítimo." },
      ], currentIndex: 0,
    },
    {
      key: "nw-12", original: "O Sol da Meia-Noite pode ser visto no norte. / nas ilhas / em Tromsø",
      options: [
        { label: "norte", replacement: "The Midnight Sun can be seen in the north.", pt: "O Sol da Meia-Noite pode ser visto no norte." },
        { label: "ilhas", replacement: "The Midnight Sun can be seen on the islands.", pt: "O Sol da Meia-Noite pode ser visto nas ilhas." },
        { label: "Tromsø", replacement: "The Midnight Sun can be seen in Tromsø.", pt: "O Sol da Meia-Noite pode ser visto em Tromsø." },
      ], currentIndex: 0,
    },
  ];

  // ============================================================
  // SECTION 3 – SPEAK LIKE A NATIVE
  // ============================================================
  const speakNativeSubstitution: SubstitutionExercise[] = [
    {
      key: "sn-1", original: "A Noruega é genuinamente fora do caminho comum. / fora do radar / única",
      options: [
        { label: "fora do caminho comum", replacement: "Norway is truly off the beaten path.", pt: "A Noruega é genuinamente fora do caminho comum." },
        { label: "fora do radar", replacement: "Norway is really off the radar.", pt: "A Noruega está realmente fora do radar." },
        { label: "única", replacement: "Norway is truly one of a kind.", pt: "A Noruega é genuinamente única." },
      ], currentIndex: 0,
    },
    {
      key: "sn-2", original: "Os fiordes valem toda a fama. / valem a viagem / não são exagero",
      options: [
        { label: "valem toda a fama", replacement: "The fjords are absolutely worth the hype.", pt: "Os fiordes valem toda a fama." },
        { label: "valem a viagem", replacement: "The fjords are absolutely worth the trip.", pt: "Os fiordes valem a viagem." },
        { label: "não são exagero", replacement: "The fjords are no exaggeration at all.", pt: "Os fiordes não são exagero nenhum." },
      ], currentIndex: 0,
    },
    {
      key: "sn-3", original: "Bergen é uma joia escondida da Escandinávia. / Tromsø / Lofoten",
      options: [
        { label: "Bergen", replacement: "Bergen is a hidden gem of Scandinavia.", pt: "Bergen é uma joia escondida da Escandinávia." },
        { label: "Tromsø", replacement: "Tromsø is a hidden gem of Scandinavia.", pt: "Tromsø é uma joia escondida da Escandinávia." },
        { label: "Lofoten", replacement: "Lofoten is a hidden gem of Scandinavia.", pt: "Lofoten é uma joia escondida da Escandinávia." },
      ], currentIndex: 0,
    },
    {
      key: "sn-4", original: "Absorva tudo do topo do Preikestolen. / Trolltunga / ponto mais alto",
      options: [
        { label: "Preikestolen", replacement: "Take it all in from the top of Preikestolen.", pt: "Absorva tudo do topo do Preikestolen." },
        { label: "Trolltunga", replacement: "Take it all in from the top of Trolltunga.", pt: "Absorva tudo do topo da Trolltunga." },
        { label: "ponto mais alto", replacement: "Take it all in from the highest point.", pt: "Absorva tudo do ponto mais alto." },
      ], currentIndex: 0,
    },
    {
      key: "sn-5", original: "Tromsø parece estar no meio do nada. / Lofoten / o norte",
      options: [
        { label: "Tromsø", replacement: "Tromsø feels like it's in the middle of nowhere.", pt: "Tromsø parece estar no meio do nada." },
        { label: "Lofoten", replacement: "Lofoten feels like it's in the middle of nowhere.", pt: "Lofoten parece estar no meio do nada." },
        { label: "o norte", replacement: "The north feels like it's in the middle of nowhere.", pt: "O norte parece estar no meio do nada." },
      ], currentIndex: 0,
    },
    {
      key: "sn-6", original: "A viagem costeira foi navegação tranquila. / viagem / cruzeiro",
      options: [
        { label: "viagem costeira", replacement: "The coastal voyage was smooth sailing all the way.", pt: "A viagem costeira foi navegação tranquila do começo ao fim." },
        { label: "viagem", replacement: "The trip was smooth sailing all the way.", pt: "A viagem foi tranquila do começo ao fim." },
        { label: "cruzeiro", replacement: "The cruise was smooth sailing all the way.", pt: "O cruzeiro foi tranquilo do começo ao fim." },
      ], currentIndex: 0,
    },
  ];

  const highlightedPhrases = [
    { en: "Norway is truly off the beaten path, and that's what makes it magical.", pt: "A Noruega é genuinamente fora do caminho comum, e é isso que a torna mágica.", green: ["off", "the", "beaten", "path"] },
    { en: "The fjords are absolutely worth the hype — nothing prepares you for them.", pt: "Os fiordes valem toda a fama — nada te prepara para eles.", green: ["worth", "the", "hype"] },
    { en: "Bergen is a hidden gem that most tourists don't fully appreciate.", pt: "Bergen é uma joia escondida que a maioria dos turistas não valoriza de verdade.", green: ["hidden", "gem"] },
    { en: "Take it all in from the top of Preikestolen — it's breathtaking.", pt: "Absorva tudo do topo do Preikestolen — é de tirar o fôlego.", green: ["Take", "it", "all", "in"] },
    { en: "Tromsø feels like it's in the middle of nowhere, but that's the charm.", pt: "Tromsø parece estar no meio do nada, mas esse é o charme.", green: ["middle", "of", "nowhere"] },
    { en: "The coastal voyage was smooth sailing — we didn't hit a single storm.", pt: "A viagem costeira foi navegação tranquila — não enfrentamos uma única tempestade.", green: ["smooth", "sailing"] },
  ];

  // ============================================================
  // SECTION 4 – GRAMMAR (C1)
  // ============================================================
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "gr-1", original: "Não é de admirar que a Noruega seja tão popular. / famosa / única",
      options: [
        { label: "popular", replacement: "It's no wonder that Norway is so popular.", pt: "Não é de admirar que a Noruega seja tão popular." },
        { label: "famosa", replacement: "It's no wonder that Norway is so famous.", pt: "Não é de admirar que a Noruega seja tão famosa." },
        { label: "única", replacement: "It's no wonder that Norway is so unique.", pt: "Não é de admirar que a Noruega seja tão única." },
      ], currentIndex: 0,
    },
    {
      key: "gr-2", original: "Quanto mais você navega, mais você se apaixona. / explora / descobre",
      options: [
        { label: "navega", replacement: "The more you sail, the more you fall in love.", pt: "Quanto mais você navega, mais você se apaixona." },
        { label: "explora", replacement: "The more you explore, the more you fall in love.", pt: "Quanto mais você explora, mais você se apaixona." },
        { label: "descobre", replacement: "The more you discover, the more you fall in love.", pt: "Quanto mais você descobre, mais você se apaixona." },
      ], currentIndex: 0,
    },
    {
      key: "gr-3", original: "Nunca vi uma paisagem tão impressionante. / fiorde / pôr do sol",
      options: [
        { label: "paisagem", replacement: "Never have I seen such a breathtaking landscape.", pt: "Nunca vi uma paisagem tão impressionante." },
        { label: "fiorde", replacement: "Never have I seen such a breathtaking fjord.", pt: "Nunca vi um fiorde tão impressionante." },
        { label: "pôr do sol", replacement: "Never have I seen such a breathtaking sunset.", pt: "Nunca vi um pôr do sol tão impressionante." },
      ], currentIndex: 0,
    },
    {
      key: "gr-4", original: "A Noruega é reconhecida por suas paisagens costeiras. / indústria naval / tradição marítima",
      options: [
        { label: "paisagens costeiras", replacement: "Norway is renowned for its coastal landscapes.", pt: "A Noruega é reconhecida por suas paisagens costeiras." },
        { label: "indústria naval", replacement: "Norway is renowned for its maritime industry.", pt: "A Noruega é reconhecida por sua indústria naval." },
        { label: "tradição marítima", replacement: "Norway is renowned for its seafaring tradition.", pt: "A Noruega é reconhecida por sua tradição marítima." },
      ], currentIndex: 0,
    },
    {
      key: "gr-5", original: "Não apenas a paisagem, mas também a cultura é fascinante. / o povo / a culinária",
      options: [
        { label: "a paisagem", replacement: "Not only the landscape but also the culture is fascinating.", pt: "Não apenas a paisagem, mas também a cultura é fascinante." },
        { label: "o povo", replacement: "Not only the people but also the culture is fascinating.", pt: "Não apenas o povo, mas também a cultura é fascinante." },
        { label: "a culinária", replacement: "Not only the cuisine but also the culture is fascinating.", pt: "Não apenas a culinária, mas também a cultura é fascinante." },
      ], currentIndex: 0,
    },
    {
      key: "gr-6", original: "Tal é a beleza da Noruega que parece irreal. / dos fiordes / da Aurora Boreal",
      options: [
        { label: "Noruega", replacement: "Such is the beauty of Norway that it seems unreal.", pt: "Tal é a beleza da Noruega que parece irreal." },
        { label: "dos fiordes", replacement: "Such is the beauty of the fjords that they seem unreal.", pt: "Tal é a beleza dos fiordes que parecem irreais." },
        { label: "da Aurora Boreal", replacement: "Such is the beauty of the Northern Lights that they seem unreal.", pt: "Tal é a beleza da Aurora Boreal que parece irreal." },
      ], currentIndex: 0,
    },
  ];

  const allExercises = [...actionSlangSubstitution, ...norwayWordsSubstitution, ...speakNativeSubstitution, ...grammarSubstitution];
  const getExerciseWithIndex = (key: string) => {
    const ex = allExercises.find(e => e.key === key);
    if (!ex) return null;
    return { ...ex, currentIndex: getCurrentIndex(key) };
  };

  // ============================================================
  // SECTION 5 – OPEN-ENDED QUESTIONS
  // ============================================================
  const openEndedQuestions: Question[] = [
    { en: "What's the first image that comes to mind when you think of Norway, and what do you think shapes that image the most — geography, culture, or the media?", pt: "Qual é a primeira imagem que vem à sua mente quando você pensa na Noruega, e o que você acha que mais molda essa imagem — a geografia, a cultura ou a mídia?" },
    { en: "Why do you think Norway developed such a deep and enduring connection with the sea, and how does this relationship still shape the country's identity today?", pt: "Por que você acha que a Noruega desenvolveu uma ligação tão profunda e duradoura com o mar, e como essa relação ainda molda a identidade do país hoje?" },
    { en: "If you could only visit one Norwegian city — Oslo, Bergen, Tromsø, or Ålesund — which one would you choose and why? What does each city seem to offer that the others don't?", pt: "Se você pudesse visitar apenas uma cidade norueguesa — Oslo, Bergen, Tromsø ou Ålesund — qual você escolheria e por quê? O que cada cidade parece oferecer que as outras não oferecem?" },
    { en: "Do you think extreme hikes like Trolltunga and Preikestolen are worth the risk and effort, or is the beauty we see in photos enough?", pt: "Você acha que trilhas extremas como Trolltunga e Preikestolen valem o risco e o esforço, ou a beleza que vemos nas fotos já é suficiente?" },
    { en: "Would you rather experience the Midnight Sun in summer or the Northern Lights in winter? What would each experience give you that the other couldn't?", pt: "Você preferiria viver o Sol da Meia-Noite no verão ou a Aurora Boreal no inverno? O que cada experiência te daria que a outra não daria?" },
    { en: "Norway consistently ranks among the happiest and most sustainable countries in the world. To what extent do you think this is due to its relationship with nature and the sea?", pt: "A Noruega consistentemente aparece entre os países mais felizes e sustentáveis do mundo. Até que ponto você acha que isso se deve à sua relação com a natureza e o mar?" },
    { en: "How do the concepts of 'hygge' and 'friluftsliv' reflect Norwegian values, and do you have equivalent concepts in your own culture?", pt: "Como os conceitos de 'hygge' e 'friluftsliv' refletem os valores noruegueses, e você tem conceitos equivalentes na sua própria cultura?" },
    { en: "To what extent do you believe Norway's Viking heritage still influences the modern national character, and why does it continue to fascinate people around the world?", pt: "Até que ponto você acredita que a herança Viking da Noruega ainda influencia o caráter nacional moderno, e por que ela continua a fascinar pessoas ao redor do mundo?" },
    { en: "If you could spend a month living like a local in Norway — fishing, sailing, hiking, and embracing the cold — what do you think you would learn about yourself?", pt: "Se você pudesse passar um mês vivendo como um local na Noruega — pescando, navegando, fazendo trilhas e abraçando o frio — o que você acha que aprenderia sobre si mesmo?" },
    { en: "What can other countries learn from Norway's relationship with the sea and nature, and do you think this model can be replicated, or is it unique to Norway's geography and history?", pt: "O que outros países podem aprender com a relação da Noruega com o mar e a natureza, e você acha que esse modelo pode ser replicado, ou é único para a geografia e a história da Noruega?" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/10028354/pexels-photo-10028354.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0faf5] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <span className="font-bold tracking-wide text-sm uppercase">Norway • Sea • Culture • C1</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-6">🇳🇴 Norway: Land of Fjords & Sea</h1>
          <SpeakSentence text="An advanced C1 English lesson about Norway — its places, cities, tourist attractions, culture, and its deep relationship with the sea." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 An advanced C1 English lesson about Norway — its places, cities, tourist attractions, culture, and its deep relationship with the sea.
          </SpeakSentence>

          {/* ✅ MAIN IMAGE — SMALLER AND CENTERED */}
          <div className="mx-auto max-w-sm">
            <img
              src={mainImage}
              alt="Norway – Land of Fjords & Sea"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full max-h-64 object-contain rounded-2xl shadow-md cursor-pointer hover:shadow-xl transition-shadow bg-white p-2"
            />
            <p className="text-center text-sm text-gray-500 mt-2">👆 Click the image to enlarge</p>
          </div>
        </div>

        {/* ===================== SECTION 1 – ACTION SLANGS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 ACTION SLANGS</h2>
              <PencilIcon onClick={() => openNoteModal('Action Slangs')} />
            </div>
            <button onClick={() => toggleDrill('actionSlangs')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-8 py-3 text-sm transition-all duration-300">
              {openDrills.actionSlangs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on the verbs to hear the pronunciation and practice their forms" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on the verbs to hear the pronunciation and practice their forms
            </SpeakSentence>

            {/* 🌄 NEW IMAGE – FJORD LANDSCAPE */}
            <div className="mb-6 flex justify-center">
              <div className="max-w-md w-full">
                <img src={fjordImage} alt="Norwegian fjord landscape" className="w-full h-40 object-cover rounded-2xl shadow-md" />
                <p className="text-center text-xs text-gray-500 mt-1 italic">Norwegian fjord – the classic landscape</p>
              </div>
            </div>

            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><SpeakText text="to venture out" className="text-green-600 font-bold">to venture out</SpeakText> = aventurar-se</li>
              <li><SpeakText text="to take in" className="text-green-600 font-bold">to take in</SpeakText> = absorver, contemplar</li>
              <li><SpeakText text="to soak up" className="text-green-600 font-bold">to soak up</SpeakText> = aproveitar ao máximo</li>
              <li><SpeakText text="to cruise" className="text-green-600 font-bold">to cruise</SpeakText> = navegar, cruzar</li>
              <li><SpeakText text="to embrace" className="text-green-600 font-bold">to embrace</SpeakText> = abraçar</li>
              <li><SpeakText text="to wander off" className="text-green-600 font-bold">to wander off</SpeakText> = vagar, afastar-se</li>
            </ul>
            {openDrills.actionSlangs && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {actionSlangSubstitution.map(ex => {
                  const c = getExerciseWithIndex(ex.key); if (!c) return null;
                  return <SubstitutionOptions key={ex.key} exercise={c} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2 – NORWAY WORDS ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NORWAY WORDS</h2>
              <PencilIcon onClick={() => openNoteModal('Norway Words')} />
            </div>
            <button onClick={() => toggleDrill('norwayWords')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-8 py-3 text-sm transition-all duration-300">
              {openDrills.norwayWords ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>

            {/* 🏘️ NEW IMAGE – BERGEN / BRYGGEN */}
            <div className="mb-6 flex justify-center">
              <div className="max-w-md w-full">
                <img src={bergenImage} alt="Bergen – colorful Bryggen houses" className="w-full h-40 object-cover rounded-2xl shadow-md" />
                <p className="text-center text-xs text-gray-500 mt-1 italic">Bergen – the colorful Bryggen wharf</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {[
                { en: "fjord", pt: "fiorde" },
                { en: "glacier", pt: "geleira" },
                { en: "midnight sun", pt: "sol da meia-noite" },
                { en: "northern lights", pt: "aurora boreal" },
                { en: "archipelago", pt: "arquipélago" },
                { en: "coastline", pt: "litoral" },
                { en: "rugged", pt: "acidentado" },
                { en: "breathtaking", pt: "de tirar o fôlego" },
                { en: "scenic", pt: "cênico" },
                { en: "cozy (hygge)", pt: "aconchegante" },
                { en: "harbor", pt: "porto" },
                { en: "wharf", pt: "cais" },
                { en: "promenade", pt: "calçadão" },
                { en: "ferry", pt: "balsa" },
                { en: "fisherman", pt: "pescador" },
              ].map((word, idx) => (
                <div key={idx} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <SpeakText text={word.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">{word.en}</SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.norwayWords && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {norwayWordsSubstitution.map(ex => {
                  const c = getExerciseWithIndex(ex.key); if (!c) return null;
                  return <SubstitutionOptions key={ex.key} exercise={c} onOptionClick={handleOptionClick} />;
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
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
            </div>
            <button onClick={() => toggleDrill('speakNative')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-8 py-3 text-sm transition-all duration-300">
              {openDrills.speakNative ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Practice common slang expressions used by native speakers when talking about travel and Norway" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common slang expressions used by native speakers when talking about travel and Norway
            </SpeakSentence>

            {/* 🌌 NEW IMAGE – NORTHERN LIGHTS */}
            <div className="mb-6 flex justify-center">
              <div className="max-w-md w-full">
                <img src={auroraImage} alt="Northern Lights in Norway" className="w-full h-40 object-cover rounded-2xl shadow-md" />
                <p className="text-center text-xs text-gray-500 mt-1 italic">Northern Lights – Aurora Borealis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {highlightedPhrases.map((item, idx) => (
                <HighlightedPhrase key={idx} text={item.en} greenWords={item.green} translation={item.pt} />
              ))}
            </div>
            {openDrills.speakNative && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {speakNativeSubstitution.map(ex => {
                  const c = getExerciseWithIndex(ex.key); if (!c) return null;
                  return <SubstitutionOptions key={ex.key} exercise={c} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 4 – GRAMMAR ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <PencilIcon onClick={() => openNoteModal('Grammar')} />
            </div>
            <button onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-8 py-3 text-sm transition-all duration-300">
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <SpeakSentence text="Advanced C1 structures for describing beauty, wonder and the sea" className="text-md text-gray-600 mb-4 italic">
              📚 Advanced C1 structures for describing beauty, wonder and the sea
            </SpeakSentence>

            {/* 🚣 NEW IMAGE – SAILING / SEA */}
            <div className="mb-6 flex justify-center">
              <div className="max-w-md w-full cursor-pointer" onClick={() => setIsSeaImageModalOpen(true)}>
                <img src={sailingImage} alt="Sea and sailing – Norway" className="w-full h-40 object-cover rounded-2xl shadow-md hover:shadow-xl transition-shadow" />
                <p className="text-center text-xs text-gray-500 mt-1 italic">Sea & sailing – Norway's maritime soul (click to enlarge)</p>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {[
                { en: "It's no wonder that Norway is so popular.", pt: "Não é de admirar que a Noruega seja tão popular." },
                { en: "The more you sail, the more you fall in love.", pt: "Quanto mais você navega, mais você se apaixona." },
                { en: "Never have I seen such a breathtaking landscape.", pt: "Nunca vi uma paisagem tão impressionante." },
                { en: "Norway is renowned for its coastal landscapes.", pt: "A Noruega é reconhecida por suas paisagens costeiras." },
                { en: "Not only the landscape but also the culture is fascinating.", pt: "Não apenas a paisagem, mas também a cultura é fascinante." },
                { en: "Such is the beauty of Norway that it seems unreal.", pt: "Tal é a beleza da Noruega que parece irreal." },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-lg">
                  <SpeakSentence text={item.en} className="text-green-600 font-bold cursor-pointer text-left w-full block">{item.en}</SpeakSentence>
                  <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
                </div>
              ))}
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                {grammarSubstitution.map(ex => {
                  const c = getExerciseWithIndex(ex.key); if (!c) return null;
                  return <SubstitutionOptions key={ex.key} exercise={c} onOptionClick={handleOptionClick} />;
                })}
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS! ===================== */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make it yours! — Open-Ended Questions</h2>
              <PencilIcon onClick={() => openNoteModal('Make it yours!')} />
            </div>
            <div className="text-sm text-green-100">Speak for 40+ seconds each</div>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <p className="text-sm text-gray-600 mb-4 italic">
                🎯 C1 Speaking Practice · Answer each question out loud using at least <strong>two expressions</strong> from this lesson. Then click the ✏️ pencil to write your answer.
              </p>

              {/* 🖼️ IMAGE ROW 1 – HIKING + CITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <img src={hikingImage} alt="Hiking in Norway" className="w-full h-36 object-cover rounded-xl" />
                  <p className="text-center mt-2 text-gray-700 italic text-sm">Hiking – Preikestolen & Trolltunga</p>
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <img src={cityImage} alt="Norwegian coastal city" className="w-full h-36 object-cover rounded-xl" />
                  <p className="text-center mt-2 text-gray-700 italic text-sm">Norwegian coastal cities</p>
                </div>
              </div>

              <div className="space-y-3">
                {openEndedQuestions.map((q, idx) => {
                  const qKey = `norway-open-${idx + 1}`;
                  return (
                    <QuestionCard key={qKey} question={q} index={idx + 1} sectionKey="norway-open"
                      sectionTitle="Make it yours!" answer={savedAnswers[qKey]} onOpenAnswer={openAnswerModal} />
                  );
                })}
              </div>

              {/* 🖼️ IMAGE ROW 2 – SNOW + AURORA + SAILING */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <img src={snowImage} alt="Snowy Norway" className="w-full h-32 object-cover rounded-xl" />
                  <p className="text-center mt-2 text-gray-700 italic text-xs">Winter in Norway</p>
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <img src={auroraImage} alt="Northern Lights" className="w-full h-32 object-cover rounded-xl" />
                  <p className="text-center mt-2 text-gray-700 italic text-xs">Aurora Borealis</p>
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-md">
                  <img src={sailingImage} alt="Sea & maritime tradition" className="w-full h-32 object-cover rounded-xl" />
                  <p className="text-center mt-2 text-gray-700 italic text-xs">Sea & maritime tradition</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP ===================== */}
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
              <h3 className="font-bold text-lg mb-4 text-yellow-300">KEY SLANGS & EXPRESSIONS</h3>
              {[
                { en: "Norway is truly off the beaten path.", pt: "A Noruega é genuinamente fora do caminho comum." },
                { en: "The fjords are absolutely worth the hype.", pt: "Os fiordes valem toda a fama." },
                { en: "Bergen is a hidden gem of Scandinavia.", pt: "Bergen é uma joia escondida da Escandinávia." },
                { en: "Take it all in from the top of Preikestolen.", pt: "Absorva tudo do topo do Preikestolen." },
                { en: "Tromsø feels like it's in the middle of nowhere.", pt: "Tromsø parece estar no meio do nada." },
                { en: "The coastal voyage was smooth sailing.", pt: "A viagem costeira foi navegação tranquila." },
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
                    <li>Use <strong className="text-white">"off the beaten path"</strong> for places few people visit.</li>
                    <li><strong className="text-white">"Worth the hype"</strong> means it lives up to its reputation.</li>
                    <li><strong className="text-white">"Smooth sailing"</strong> = something goes without problems.</li>
                    <li>Use <strong className="text-white">"take it all in"</strong> to describe truly absorbing a view.</li>
                    <li><strong className="text-white">C1 grammar:</strong> invert after "Never have I…" and "Such is…".</li>
                  </ul>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <h4 className="font-bold text-yellow-300 text-lg mb-3">🌊 WHY THE SEA?</h4>
                  <p className="text-green-200">
                    Norway's coastline stretches over <strong>100,000 km</strong> — longer than any other European country. Fishing, Viking exploration, shipbuilding, and later oil & gas have made the sea the backbone of Norwegian identity.
                  </p>
                </div>
                <div className="pt-4 border-t border-green-700">
                  <p className="text-green-200 text-sm italic">
                    🌟 <strong>Challenge:</strong> Record yourself answering 3 of the open-ended questions using at least 5 slangs from this lesson. Listen and repeat!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson62")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            &larr; Previous Lesson (62)
          </button>
          <button onClick={() => router.push("/cursos/lesson64")} className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
            Next Lesson (64) &rarr;
          </button>
        </div>
      </div>

      {/* ===== MODAL: SEA IMAGE ===== */}
      {isSeaImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsSeaImageModalOpen(false)}>
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={sailingImage} alt="Sea enlarged" className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl" />
            <button onClick={() => setIsSeaImageModalOpen(false)} className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300">&times;</button>
          </div>
        </div>
      )}

      {/* ===== MODAL: MAIN IMAGE ===== */}
      {isMainImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={() => setIsMainImageModalOpen(false)}>
          <div className="relative max-w-5xl max-h-full p-4">
            <img src={mainImage} alt="Norway enlarged" className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl" />
            <button onClick={() => setIsMainImageModalOpen(false)} className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300">&times;</button>
          </div>
        </div>
      )}

      <NoteModal isOpen={noteModal.isOpen} onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle} initialNote={noteModal.noteContent} onSave={saveNote} />

      <AnswerModal state={answerModal} initialAnswer={savedAnswers[answerModal.questionKey] || ""}
        onSave={saveAnswer} onClose={() => setAnswerModal(prev => ({ ...prev, isOpen: false }))} />

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}