"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'wrapUp';

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
// NOTE MODAL & PENCIL ICON
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-blue-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações...\n- Traduções importantes\n- Dúvidas para o professor\n- Exemplos pessoais\n- Dicas de memorização"
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

const speakText = (text: string) => speakEnglish(text, 0.9);

// ============================================
// WRAP UP COMPONENT
// ============================================
function WrapUp() {
  return (
    <div className="w-full mx-auto border-2 border-blue-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-blue-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">WRAP UP!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        <div className="bg-blue-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to talk to')}>
            • to talk <strong className="text-blue-300">to</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to speak with')}>
            • to speak <strong className="text-blue-300">with</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('to talk about')}>
            • to talk <strong className="text-blue-300">about</strong> / speak <strong className="text-blue-300">about</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70 mt-4 pt-3 border-t border-blue-700" onClick={() => speakText('I have already finished my report')}>
            • I have <strong className="text-blue-300">already finished</strong> my report
          </p>
        </div>

        <div className="bg-white p-6 flex flex-col items-center justify-center gap-3">
          <div className="bg-yellow-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-blue-700 cursor-pointer" onClick={() => speakText("Sorry, I'm late")}>Sorry, I'm late.</span>
            <p className="text-sm text-gray-500 mt-1">Desculpe, estou atrasado.</p>
          </div>
          <div className="bg-green-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-green-700 cursor-pointer" onClick={() => speakText('No problem')}>No problem. / That's OK.</span>
            <p className="text-sm text-gray-500 mt-1">Não há problema. / Tudo bem.</p>
          </div>
          <div className="bg-purple-100 text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full">
            <span className="font-bold text-purple-700 cursor-pointer" onClick={() => speakText('I have written a report')}>I have written a report.</span>
            <p className="text-sm text-gray-500 mt-1">Eu escrevi um relatório.</p>
          </div>
        </div>

        <div className="bg-blue-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('on the tablet')}>
            • on the <strong className="text-blue-300">tablet</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('on the phone')}>
            • on the <strong className="text-blue-300">phone</strong>
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting starts at 3:00')}>
            • The meeting <strong className="text-blue-300">starts</strong> at 3:00.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting started at 3:00 yesterday')}>
            • The meeting <strong className="text-blue-300">started</strong> at 3:00 yesterday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('The meeting will start at 3:00 tomorrow')}>
            • The meeting <strong className="text-blue-300">will start</strong> at 3:00 tomorrow.
          </p>
        </div>

        <div className="bg-indigo-900 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('What time does it start')}>
            • What time <strong className="text-indigo-300">does it start</strong>?
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I wrote an email yesterday')}>
            • I <strong className="text-indigo-300">wrote</strong> an email yesterday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('I will write a book someday')}>
            • I <strong className="text-indigo-300">will write</strong> a book someday.
          </p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => speakText('They have studied together')}>
            • They <strong className="text-indigo-300">have studied</strong> together.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-6 border-t-2 border-blue-200">
        <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">Practice:</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I talk to my <span className="text-blue-600 font-bold">boss/friend/teacher</span>.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I spoke to my <span className="text-blue-600 font-bold">boss/friend/teacher</span> yesterday.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I will talk to my <span className="text-blue-600 font-bold">boss/friend/teacher</span> tomorrow.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">I have talked to my <span className="text-blue-600 font-bold">boss/friend/teacher</span>.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">Sorry, I'm late. → <span className="text-green-600 font-bold">No problem / That's OK</span></div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class starts at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span></div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class started at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span> yesterday.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">The class will start at <span className="text-blue-600 font-bold">8:00/9:00/10:00</span> tomorrow.</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time does it <span className="text-blue-600 font-bold">start/finish</span>?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time did it <span className="text-blue-600 font-bold">start/finish</span> yesterday?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">What time will it <span className="text-blue-600 font-bold">start/finish</span> tomorrow?</div>
          <div className="p-3 bg-white rounded-xl shadow-sm text-center">Have you ever <span className="text-blue-600 font-bold">written/thought/talked</span> about it?</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 35
// ============================================
export default function Lesson35StudiesIdeasOpinions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    wrapUp: false,
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

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "escrever / Eu escrevo. / Vocês escrevem. / Nós escrevemos.",
      options: [
        { label: "escrever", replacement: "to write.", pt: "escrever" },
        { label: "Eu escrevo", replacement: "I write.", pt: "Eu escrevo." },
        { label: "Vocês escrevem", replacement: "You write.", pt: "Vocês escrevem." },
        { label: "Nós escrevemos", replacement: "We write.", pt: "Nós escrevemos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Ele não escreve. / Ela / Você",
      options: [
        { label: "Ele", replacement: "He doesn't write.", pt: "Ele não escreve." },
        { label: "Ela", replacement: "She doesn't write.", pt: "Ela não escreve." },
        { label: "Você", replacement: "You don't write.", pt: "Você não escreve." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Elas escrevem? / Você / Ele",
      options: [
        { label: "Elas", replacement: "Do they write?", pt: "Elas escrevem?" },
        { label: "Você", replacement: "Do you write?", pt: "Você escreve?" },
        { label: "Ele", replacement: "Does he write?", pt: "Ele escreve?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "O que ela escreve? / Quando / Onde",
      options: [
        { label: "O que", replacement: "What does she write?", pt: "O que ela escreve?" },
        { label: "Quando", replacement: "When does she write?", pt: "Quando ela escreve?" },
        { label: "Onde", replacement: "Where does she write?", pt: "Onde ela escreve?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Você gosta de escrever? / prefere / quer",
      options: [
        { label: "gosta", replacement: "Do you like to write?", pt: "Você gosta de escrever?" },
        { label: "prefere", replacement: "Do you prefer to write?", pt: "Você prefere escrever?" },
        { label: "quer", replacement: "Do you want to write?", pt: "Você quer escrever?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "pensar, achar / Eu penso. / Ele pensa. / Nós pensamos.",
      options: [
        { label: "pensar, achar", replacement: "to think.", pt: "pensar, achar" },
        { label: "Eu penso", replacement: "I think.", pt: "Eu penso." },
        { label: "Ele pensa", replacement: "He thinks.", pt: "Ele pensa." },
        { label: "Nós pensamos", replacement: "We think.", pt: "Nós pensamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eles não acham. / Eu / Ele",
      options: [
        { label: "Eles", replacement: "They don't think.", pt: "Eles não acham." },
        { label: "Eu", replacement: "I don't think.", pt: "Eu não acho." },
        { label: "Ele", replacement: "He doesn't think.", pt: "Ele não acha." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Você acha? / Eles / Ela",
      options: [
        { label: "Você", replacement: "Do you think?", pt: "Você acha?" },
        { label: "Eles", replacement: "Do they think?", pt: "Eles acham?" },
        { label: "Ela", replacement: "Does she think?", pt: "Ela acha?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "O que você pensa? / sobre esse assunto / sobre esse problema",
      options: [
        { label: "O que", replacement: "What do you think?", pt: "O que você pensa?" },
        { label: "assunto", replacement: "What do you think about this subject?", pt: "O que você pensa sobre esse assunto?" },
        { label: "problema", replacement: "What do you think about this problem?", pt: "O que você pensa sobre esse problema?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "O que você pensa sobre a opinião dele? / dela",
      options: [
        { label: "dele", replacement: "What do you think about his opinion?", pt: "O que você pensa sobre a opinião dele?" },
        { label: "dela", replacement: "What do you think about her opinion?", pt: "O que você pensa sobre a opinião dela?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "We don't live together. / study / work (Presente)",
      options: [
        { label: "live", replacement: "We don't live together.", pt: "Nós não moramos juntos." },
        { label: "study", replacement: "We don't study together.", pt: "Nós não estudamos juntos." },
        { label: "work", replacement: "We don't work together.", pt: "Nós não trabalhamos juntos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "They didn't live together. / study / eat (Passado)",
      options: [
        { label: "live", replacement: "They didn't live together.", pt: "Eles não moraram juntos." },
        { label: "study", replacement: "They didn't study together.", pt: "Eles não estudaram juntos." },
        { label: "eat", replacement: "They didn't eat together.", pt: "Eles não comeram juntos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-13",
      original: "O que você pensa sobre esta aula? / relatório / redação",
      options: [
        { label: "aula", replacement: "What do you think about this class?", pt: "O que você pensa sobre esta aula?" },
        { label: "relatório", replacement: "What do you think about this report?", pt: "O que você pensa sobre este relatório?" },
        { label: "redação", replacement: "What do you think about this composition?", pt: "O que você pensa sobre esta redação?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-14",
      original: "I think it's good. / Eu acho que é boa. / chata / interessante",
      options: [
        { label: "good", replacement: "I think it's good.", pt: "Eu acho que é boa." },
        { label: "boring", replacement: "I think it's boring.", pt: "Eu acho que é chata." },
        { label: "interesting", replacement: "I think it's interesting.", pt: "Eu acho que é interessante." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-15",
      original: "Eu acho que é fácil aprender inglês. / difícil / importante",
      options: [
        { label: "fácil", replacement: "I think it's easy to learn English.", pt: "Eu acho que é fácil aprender inglês." },
        { label: "difícil", replacement: "I think it's hard to learn English.", pt: "Eu acho que é difícil aprender inglês." },
        { label: "importante", replacement: "I think it's important to learn English.", pt: "Eu acho que é importante aprender inglês." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-16",
      original: "O que você acha sobre este livro? / vídeo / filme",
      options: [
        { label: "livro", replacement: "What do you think about this book?", pt: "O que você acha sobre este livro?" },
        { label: "vídeo", replacement: "What do you think about this video?", pt: "O que você acha sobre este vídeo?" },
        { label: "filme", replacement: "What do you think about this movie?", pt: "O que você acha sobre este filme?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-17",
      original: "Eu acho que é chato. / bonito / engraçado",
      options: [
        { label: "chato", replacement: "I think it's boring.", pt: "Eu acho que é chato." },
        { label: "bonito", replacement: "I think it's beautiful.", pt: "Eu acho que é bonito." },
        { label: "engraçado", replacement: "I think it's funny.", pt: "Eu acho que é engraçado." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-18",
      original: "She talks to everybody. / Ela conversa com todo mundo. / Ele / Nós",
      options: [
        { label: "She", replacement: "She talks to everybody.", pt: "Ela conversa com todo mundo." },
        { label: "He", replacement: "He talks to everybody.", pt: "Ele conversa com todo mundo." },
        { label: "We", replacement: "We talk to everybody.", pt: "Nós conversamos com todo mundo." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-19",
      original: "Você conversa com todos no trabalho? / na escola / na igreja",
      options: [
        { label: "trabalho", replacement: "Do you talk to everybody at work?", pt: "Você conversa com todos no trabalho?" },
        { label: "escola", replacement: "Do you talk to everybody at school?", pt: "Você conversa com todos na escola?" },
        { label: "igreja", replacement: "Do you talk to everybody at church?", pt: "Você conversa com todos na igreja?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-20",
      original: "Everybody speaks English here. / Todos falam inglês aqui. / português / espanhol",
      options: [
        { label: "English", replacement: "Everybody speaks English here.", pt: "Todos falam inglês aqui." },
        { label: "Portuguese", replacement: "Everybody speaks Portuguese here.", pt: "Todos falam português aqui." },
        { label: "Spanish", replacement: "Everybody speaks Spanish here.", pt: "Todos falam espanhol aqui." },
      ],
      currentIndex: 0,
    }
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "He wanted to write a composition. / a book / a story",
      options: [
        { label: "composition", replacement: "He wanted to write a composition.", pt: "Ele queria escrever uma redação." },
        { label: "book", replacement: "He wanted to write a book.", pt: "Ele queria escrever um livro." },
        { label: "story", replacement: "He wanted to write a story.", pt: "Ele queria escrever uma história." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "She wants to watch a good movie. / funny / beautiful",
      options: [
        { label: "good", replacement: "She wants to watch a good movie.", pt: "Ela quer assistir um filme bom." },
        { label: "funny", replacement: "She wants to watch a funny movie.", pt: "Ela quer assistir um filme engraçado." },
        { label: "beautiful", replacement: "She wants to watch a beautiful movie.", pt: "Ela quer assistir um filme bonito." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "I needed to write an important report. / an e-mail / a message",
      options: [
        { label: "report", replacement: "I needed to write an important report.", pt: "Eu precisava escrever um relatório importante." },
        { label: "e-mail", replacement: "I needed to write an e-mail.", pt: "Eu precisava escrever um e-mail." },
        { label: "message", replacement: "I needed to write a message.", pt: "Eu precisava escrever uma mensagem." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "I have an important meeting today. / interesting / boring",
      options: [
        { label: "important", replacement: "I have an important meeting today.", pt: "Eu tenho uma reunião importante hoje." },
        { label: "interesting", replacement: "I have an interesting meeting today.", pt: "Eu tenho uma reunião interessante hoje." },
        { label: "boring", replacement: "I have a boring meeting today.", pt: "Eu tenho uma reunião chata hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "You work with a great person. / funny / important",
      options: [
        { label: "great", replacement: "You work with a great person.", pt: "Você trabalha com uma pessoa ótima." },
        { label: "funny", replacement: "You work with a funny person.", pt: "Você trabalha com uma pessoa engraçada." },
        { label: "important", replacement: "You work with an important person.", pt: "Você trabalha com uma pessoa importante." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "What do you think about this class? / report / composition",
      options: [
        { label: "class", replacement: "What do you think about this class?", pt: "O que você pensa sobre esta aula?" },
        { label: "report", replacement: "What do you think about this report?", pt: "O que você pensa sobre este relatório?" },
        { label: "composition", replacement: "What do you think about this composition?", pt: "O que você pensa sobre esta redação?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "I think it's good. / boring / interesting",
      options: [
        { label: "good", replacement: "I think it's good.", pt: "Eu acho que é boa." },
        { label: "boring", replacement: "I think it's boring.", pt: "Eu acho que é chata." },
        { label: "interesting", replacement: "I think it's interesting.", pt: "Eu acho que é interessante." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "I think it's easy to learn English. / hard / important",
      options: [
        { label: "easy", replacement: "I think it's easy to learn English.", pt: "Eu acho que é fácil aprender inglês." },
        { label: "hard", replacement: "I think it's hard to learn English.", pt: "Eu acho que é difícil aprender inglês." },
        { label: "important", replacement: "I think it's important to learn English.", pt: "Eu acho que é importante aprender inglês." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "What did you think about this book? / video / movie",
      options: [
        { label: "book", replacement: "What did you think about this book?", pt: "O que você achou sobre este livro?" },
        { label: "video", replacement: "What did you think about this video?", pt: "O que você achou sobre este vídeo?" },
        { label: "movie", replacement: "What did you think about this movie?", pt: "O que você achou sobre este filme?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "I thought it's boring. / beautiful / funny",
      options: [
        { label: "boring", replacement: "I thought it's boring.", pt: "Eu achei que era chato." },
        { label: "beautiful", replacement: "I thought it's beautiful.", pt: "Eu achei que era bonito." },
        { label: "funny", replacement: "I thought it's funny.", pt: "Eu achei que era engraçado." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "She talks to everybody. / He / We",
      options: [
        { label: "She", replacement: "She talks to everybody.", pt: "Ela conversa com todo mundo." },
        { label: "He", replacement: "He talks to everybody.", pt: "Ele conversa com todo mundo." },
        { label: "We", replacement: "We talk to everybody.", pt: "Nós conversamos com todo mundo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Do you talk to everybody at work? / at school / at church",
      options: [
        { label: "work", replacement: "Do you talk to everybody at work?", pt: "Você conversa com todos no trabalho?" },
        { label: "school", replacement: "Do you talk to everybody at school?", pt: "Você conversa com todos na escola?" },
        { label: "church", replacement: "Do you talk to everybody at church?", pt: "Você conversa com todos na igreja?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Everybody speaks English here. / Portuguese / Spanish",
      options: [
        { label: "English", replacement: "Everybody speaks English here.", pt: "Todos falam inglês aqui." },
        { label: "Portuguese", replacement: "Everybody speaks Portuguese here.", pt: "Todos falam português aqui." },
        { label: "Spanish", replacement: "Everybody speaks Spanish here.", pt: "Todos falam espanhol aqui." },
      ],
      currentIndex: 0,
    }
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "How do you say \"casa\" in German? / French / English",
      options: [
        { label: "German", replacement: "How do you say \"casa\" in German?", pt: "Como se diz \"casa\" em alemão?" },
        { label: "French", replacement: "How do you say \"casa\" in French?", pt: "Como se diz \"casa\" em francês?" },
        { label: "English", replacement: "How do you say \"casa\" in English?", pt: "Como se diz \"casa\" em inglês?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "How do you say \"difícil\" in English? / easy / together",
      options: [
        { label: "difícil", replacement: "How do you say \"difícil\" in English?", pt: "Como se diz \"difícil\" em inglês?" },
        { label: "easy", replacement: "How do you say \"easy\" in English?", pt: "Como se diz \"easy\" em inglês?" },
        { label: "together", replacement: "How do you say \"together\" in English?", pt: "Como se diz \"together\" em inglês?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "What's the meaning of \"funny\"? / deadline / composition",
      options: [
        { label: "funny", replacement: "What's the meaning of \"funny\"?", pt: "O que significa \"funny\"?" },
        { label: "deadline", replacement: "What's the meaning of \"deadline\"?", pt: "O que significa \"deadline\"?" },
        { label: "composition", replacement: "What's the meaning of \"composition\"?", pt: "O que significa \"composition\"?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "What's the meaning of \"together\"? / everything / everybody",
      options: [
        { label: "together", replacement: "What's the meaning of \"together\"?", pt: "O que significa \"together\"?" },
        { label: "everything", replacement: "What's the meaning of \"everything\"?", pt: "O que significa \"everything\"?" },
        { label: "everybody", replacement: "What's the meaning of \"everybody\"?", pt: "O que significa \"everybody\"?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Did you need to study more? / he / she",
      options: [
        { label: "you", replacement: "Did you need to study more?", pt: "Você precisava estudar mais?" },
        { label: "he", replacement: "Did he need to study more?", pt: "Ele precisava estudar mais?" },
        { label: "she", replacement: "Did she need to study more?", pt: "Ela precisava estudar mais?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "I think so. / I don't think so.",
      options: [
        { label: "I think so", replacement: "I think so.", pt: "Eu acho que sim." },
        { label: "I don't think so", replacement: "I don't think so.", pt: "Eu acho que não." },
      ],
      currentIndex: 0,
    }
  ];

  // ========== GRAMMAR SUBSTITUTION (9 drills) ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Why do you study English? / Spanish / French (Because I want to live in the United States)",
      options: [
        { label: "English", replacement: "Why do you study English? Because I want to live in the United States.", pt: "Por que você estuda inglês? Porque eu quero morar nos Estados Unidos." },
        { label: "Spanish", replacement: "Why do you study Spanish? Because I want to live in Spain.", pt: "Por que você estuda espanhol? Porque eu quero morar na Espanha." },
        { label: "French", replacement: "Why do you study French? Because I want to live in France.", pt: "Por que você estuda francês? Porque eu quero morar na França." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Why does he live in Italy? / in Germany / in the UK (Because he studies there)",
      options: [
        { label: "Italy", replacement: "Why does he live in Italy? Because he studies there.", pt: "Por que ele mora na Itália? Porque ele estuda lá." },
        { label: "Germany", replacement: "Why does he live in Germany? Because he works there.", pt: "Por que ele mora na Alemanha? Porque ele trabalha lá." },
        { label: "UK", replacement: "Why does he live in the UK? Because he has a project there.", pt: "Por que ele mora no Reino Unido? Porque ele tem um projeto lá." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Why do you need to study more? / read / write (Because I have a test tomorrow)",
      options: [
        { label: "study", replacement: "Why do you need to study more? Because I have a test tomorrow.", pt: "Por que você precisa estudar mais? Porque eu tenho uma prova amanhã." },
        { label: "read", replacement: "Why do you need to read more? Because I have a test this week.", pt: "Por que você precisa ler mais? Porque eu tenho uma prova esta semana." },
        { label: "write", replacement: "Why do you need to write more? Because I have a test this month.", pt: "Por que você precisa escrever mais? Porque eu tenho uma prova este mês." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Why does he need to go now? / does she / do you (I need to go now because it's late)",
      options: [
        { label: "he", replacement: "Why does he need to go now? Because it's late.", pt: "Por que ele precisa ir agora? Porque está tarde." },
        { label: "she", replacement: "Why does she need to go now? Because it's late.", pt: "Por que ela precisa ir agora? Porque está tarde." },
        { label: "you", replacement: "Why do you need to go now? Because it's late.", pt: "Por que você precisa ir agora? Porque está tarde." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Why do you want to read this book? / this story / this report (Because it's interesting)",
      options: [
        { label: "book", replacement: "Why do you want to read this book? Because it's interesting.", pt: "Por que você quer ler este livro? Porque é interessante." },
        { label: "story", replacement: "Why do you want to read this story? Because it's important.", pt: "Por que você quer ler esta história? Porque é importante." },
        { label: "report", replacement: "Why do you want to read this report? Because it's good.", pt: "Por que você quer ler este relatório? Porque é bom." },
      ],
      currentIndex: 0,
    },
    // 6) BECAUSE – presente / passado / futuro
    {
      key: "grammar-6",
      original: "Porque é engraçado. / Porque foi engraçado. / Porque vai ser engraçado.",
      options: [
        { label: "é", replacement: "Because it's funny.", pt: "Porque é engraçado." },
        { label: "foi", replacement: "Because it was funny.", pt: "Porque foi engraçado." },
        { label: "vai ser", replacement: "Because it will be funny.", pt: "Porque vai ser engraçado." },
      ],
      currentIndex: 0,
    },
    // 7) DID card 1 – study / read / write
    {
      key: "grammar-7",
      original: "Por que você precisou estudar mais? / ler mais / escrever mais. (Porque eu tenho uma prova amanhã.)",
      options: [
        { label: "estudar", replacement: "Why did you need to study more? Because I have a test tomorrow.", pt: "Por que você precisou estudar mais? Porque eu tenho uma prova amanhã." },
        { label: "ler", replacement: "Why did you need to read more? Because I have a test tomorrow.", pt: "Por que você precisou ler mais? Porque eu tenho uma prova amanhã." },
        { label: "escrever", replacement: "Why did you need to write more? Because I have a test tomorrow.", pt: "Por que você precisou escrever mais? Porque eu tenho uma prova amanhã." },
      ],
      currentIndex: 0,
    },
    // 8) DID card 2 – he / she / you
    {
      key: "grammar-8",
      original: "Por que ele precisou ir agora? / ela / você. (Porque estava tarde.)",
      options: [
        { label: "ele", replacement: "Why did he need to go now? Because it was late.", pt: "Por que ele precisou ir agora? Porque estava tarde." },
        { label: "ela", replacement: "Why did she need to go now? Because it was late.", pt: "Por que ela precisou ir agora? Porque estava tarde." },
        { label: "você", replacement: "Why did you need to go now? Because it was late.", pt: "Por que você precisou ir agora? Porque estava tarde." },
      ],
      currentIndex: 0,
    },
    // 9) DID card 3 – book / story / report
    {
      key: "grammar-9",
      original: "Por que você quis ler este livro? / esta história / este relatório. (Porque era interessante.)",
      options: [
        { label: "livro", replacement: "Why did you want to read this book? Because it was interesting.", pt: "Por que você quis ler este livro? Porque era interessante." },
        { label: "história", replacement: "Why did you want to read this story? Because it was interesting.", pt: "Por que você quis ler esta história? Porque era interessante." },
        { label: "relatório", replacement: "Why did you want to read this report? Because it was interesting.", pt: "Por que você quis ler este relatório? Porque era interessante." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== MAKE IT YOURS – grupos por tipo ==========
  const presentAffirmative = [
    {
      english: "I really need to talk to you.",
      portuguese: "Eu preciso muito conversar com você.",
      jsx: <>I really <span className="text-blue-600 font-bold">need</span> to <span className="text-blue-600 font-bold">talk</span> to you.</>,
    },
    {
      english: "She talks to her mother about everything.",
      portuguese: "Ela conversa com a mãe dela sobre tudo.",
      jsx: <>She <span className="text-blue-600 font-bold">talks</span> to her <span className="text-blue-600 font-bold">mother</span> about everything.</>,
    },
    {
      english: "My wife loves to watch series.",
      portuguese: "Minha esposa ama assistir séries.",
      jsx: <>My wife <span className="text-blue-600 font-bold">loves</span> to <span className="text-blue-600 font-bold">watch</span> <span className="text-blue-600 font-bold">series</span>.</>,
    },
    {
      english: "I like this show because it's funny.",
      portuguese: "Eu gosto deste programa porque é engraçado.",
      jsx: <>I <span className="text-blue-600 font-bold">like</span> this show <span className="text-blue-600 font-bold">because</span> it's <span className="text-blue-600 font-bold">funny</span>.</>,
    },
  ];

  const pastAffirmative = [
    {
      english: "I really needed to talk to you yesterday.",
      portuguese: "Eu precisei muito conversar com você ontem.",
      jsx: <>I really <span className="text-blue-600 font-bold">needed</span> to <span className="text-blue-600 font-bold">talk</span> to you yesterday.</>,
    },
    {
      english: "She talked to her mother yesterday.",
      portuguese: "Ela conversou com a mãe dela ontem.",
      jsx: <>She <span className="text-blue-600 font-bold">talked</span> to her <span className="text-blue-600 font-bold">mother</span> yesterday.</>,
    },
    {
      english: "I liked this show because it was funny.",
      portuguese: "Eu gostei deste programa porque foi engraçado.",
      jsx: <>I <span className="text-blue-600 font-bold">liked</span> this show <span className="text-blue-600 font-bold">because</span> it was <span className="text-blue-600 font-bold">funny</span>.</>,
    },
  ];

  const presentQuestions = [
    {
      english: "Do you like his ideas?",
      portuguese: "Você gosta das ideias dele?",
      jsx: <><span className="text-blue-600 font-bold">Do</span> you <span className="text-blue-600 font-bold">like</span> his <span className="text-blue-600 font-bold">ideas</span>?</>,
    },
    {
      english: "Does he like to talk about politics?",
      portuguese: "Ele gosta de falar sobre política?",
      jsx: <><span className="text-blue-600 font-bold">Does</span> he <span className="text-blue-600 font-bold">like</span> to <span className="text-blue-600 font-bold">talk</span> about <span className="text-blue-600 font-bold">politics</span>?</>,
    },
    {
      english: "What time does your class start?",
      portuguese: "Que horas sua aula começa?",
      jsx: <>What time <span className="text-blue-600 font-bold">does</span> your <span className="text-blue-600 font-bold">class</span> <span className="text-blue-600 font-bold">start</span>?</>,
    },
  ];

  const pastQuestions = [
    {
      english: "Did you like his ideas?",
      portuguese: "Você gostou das ideias dele?",
      jsx: <><span className="text-blue-600 font-bold">Did</span> you <span className="text-blue-600 font-bold">like</span> his <span className="text-blue-600 font-bold">ideas</span>?</>,
    },
    {
      english: "Did he like to talk about politics?",
      portuguese: "Ele gostou de falar sobre política?",
      jsx: <><span className="text-blue-600 font-bold">Did</span> he <span className="text-blue-600 font-bold">like</span> to <span className="text-blue-600 font-bold">talk</span> about <span className="text-blue-600 font-bold">politics</span>?</>,
    },
    {
      english: "What time did your class start yesterday?",
      portuguese: "Que horas sua aula começou ontem?",
      jsx: <>What time <span className="text-blue-600 font-bold">did</span> your <span className="text-blue-600 font-bold">class</span> <span className="text-blue-600 font-bold">start</span> yesterday?</>,
    },
  ];

  // URLs das imagens
  const mainImage = "https://i.ibb.co/ynvwq6jp/family-and-occupation.jpg";
  const writingImage = "https://i.ibb.co/Nfx8nKV/membros-da-familia-e-relacionamentos.jpg";
  const discussionImage = "https://i.ibb.co/xq0tDFQy/ocupa-es-profissionais.jpg";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l7-bgg.jpg")`,
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
            Lesson 35 - Studies, Ideas & Opinions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a expressar suas opiniões, falar sobre estudos e usar conectores como "why" e "because" em inglês. ✍️💡🗣️
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Studies and ideas"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the verbs to hear the pronunciation and practice their forms</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <SpeakText text="to write" className="text-blue-600 font-bold">
                  to write
                </SpeakText> = escrever
              </li>
              <li>
                <SpeakText text="to think" className="text-blue-600 font-bold">
                  to think
                </SpeakText> = pensar, achar
              </li>
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Seção 2 - Vocabulário */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on each word to hear its correct pronunciation</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li><button onClick={() => speakText('report')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">report</button> = relatório</li>
              <li><button onClick={() => speakText('composition')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">composition</button> = redação</li>
              <li><button onClick={() => speakText('person')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">person</button> = pessoa</li>
              <li><button onClick={() => speakText('boring')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">boring</button> = chato</li>
              <li><button onClick={() => speakText('beautiful')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">beautiful</button> = bonito, bonita</li>
              <li><button onClick={() => speakText('easy')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">easy</button> = fácil</li>
              <li><button onClick={() => speakText('hard')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">hard</button> = difícil</li>
              <li><button onClick={() => speakText('important')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">important</button> = importante</li>
              <li><button onClick={() => speakText('interesting')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">interesting</button> = interessante</li>
              <li><button onClick={() => speakText('funny')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">funny</button> = engraçado</li>
              <li><button onClick={() => speakText('together')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">together</button> = juntos</li>
              <li><button onClick={() => speakText('everybody')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">everybody</button> = todos, todo mundo</li>
              <li><button onClick={() => speakText('why')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">why</button> = por quê</li>
              <li><button onClick={() => speakText('because')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800">because</button> = porque</li>
            </ul>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Seção 3 - Speak Like a Native */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases to express opinions and ask for help</p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-4 mb-6">
              <p>
                <button
                  onClick={() => speakText('How do you say banana in English')}
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  How do you say "banana" in English?
                </button>
                <br />
                <span className="text-sm text-gray-500">Como se diz "banana" em inglês?</span>
              </p>
              <p>
                <button
                  onClick={() => speakText("What's the meaning of boring")}
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  What's the meaning of "boring"?
                </button>
                <br />
                <span className="text-sm text-gray-500">O que significa "boring"?</span>
              </p>
              <p>
                <button
                  onClick={() => speakText('I think so')}
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que sim.</span>
              </p>
              <p>
                <button
                  onClick={() => speakText("I don't think so")}
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I don't think so.
                </button>
                <br />
                <span className="text-sm text-gray-500">Eu acho que não.</span>
              </p>
            </div>

            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {phrasesSubstitution.map((ex) => (
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

        {/* Seção 4 - Gramática */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Learn how to use WHY (por quê) and BECAUSE (porque) in different tenses</p>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 p-4 rounded-[20px] border border-green-200">
                <h3 className="text-lg font-bold text-green-700 mb-3">WHY? (Por quê?)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><button onClick={() => speakText('Why do you want to watch this movie')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why do you want to watch this movie?</button> <span className="text-xs text-gray-500">(presente)</span></li>
                  <li><button onClick={() => speakText('Why did you watch that movie yesterday')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why did you watch that movie yesterday?</button> <span className="text-xs text-gray-500">(passado)</span></li>
                  <li><button onClick={() => speakText('Why have you watched this movie three times')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why have you watched this movie three times?</button> <span className="text-xs text-gray-500">(present perfect)</span></li>
                  <li><button onClick={() => speakText('Why will you watch that movie tomorrow')} className="text-blue-600 cursor-pointer hover:text-blue-800">Why will you watch that movie tomorrow?</button> <span className="text-xs text-gray-500">(futuro)</span></li>
                </ul>
              </div>
              <div className="bg-orange-50 p-4 rounded-[20px] border border-orange-200">
                <h3 className="text-lg font-bold text-orange-700 mb-3">BECAUSE (Porque)</h3>
                <ul className="space-y-2 text-gray-700">
                  <li><button onClick={() => speakText("Because it's funny")} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it's funny.</button> <span className="text-xs text-gray-500">(presente)</span></li>
                  <li><button onClick={() => speakText('Because it was funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it was funny.</button> <span className="text-xs text-gray-500">(passado)</span></li>
                  <li><button onClick={() => speakText('Because it has been funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it has been funny.</button> <span className="text-xs text-gray-500">(present perfect)</span></li>
                  <li><button onClick={() => speakText('Because it will be funny')} className="text-blue-600 cursor-pointer hover:text-blue-800">Because it will be funny.</button> <span className="text-xs text-gray-500">(futuro)</span></li>
                </ul>
              </div>
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Seção 5 - Make It Yours (reorganizada em 4 grupos) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Present · Past · Questions · Because
            </div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">

                  {/* Present Affirmative */}
                  <div>
                    <h3 className="text-green-700 font-bold text-sm uppercase tracking-wide mb-2">
                      ✅ Present — Affirmative
                    </h3>
                    <div className="space-y-2">
                      {presentAffirmative.map((s, i) => (
                        <div key={i} className="group">
                          <SpeakSentence text={s.english} className="text-base font-medium">
                            {i + 1}. {s.jsx}
                          </SpeakSentence>
                          <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.portuguese}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Affirmative */}
                  <div>
                    <h3 className="text-blue-700 font-bold text-sm uppercase tracking-wide mb-2">
                      ⏪ Past — Affirmative
                    </h3>
                    <div className="space-y-2">
                      {pastAffirmative.map((s, i) => (
                        <div key={i} className="group">
                          <SpeakSentence text={s.english} className="text-base font-medium">
                            {i + 1}. {s.jsx}
                          </SpeakSentence>
                          <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.portuguese}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Present Questions */}
                  <div>
                    <h3 className="text-yellow-700 font-bold text-sm uppercase tracking-wide mb-2">
                      ❓ Present — Questions
                    </h3>
                    <div className="space-y-2">
                      {presentQuestions.map((s, i) => (
                        <div key={i} className="group">
                          <SpeakSentence text={s.english} className="text-base font-medium">
                            {i + 1}. {s.jsx}
                          </SpeakSentence>
                          <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.portuguese}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Questions */}
                  <div>
                    <h3 className="text-orange-700 font-bold text-sm uppercase tracking-wide mb-2">
                      ❓ Past — Questions (Did)
                    </h3>
                    <div className="space-y-2">
                      {pastQuestions.map((s, i) => (
                        <div key={i} className="group">
                          <SpeakSentence text={s.english} className="text-base font-medium">
                            {i + 1}. {s.jsx}
                          </SpeakSentence>
                          <p className="text-sm text-gray-600 mt-0.5 ml-6">{s.portuguese}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={writingImage}
                        alt="Student writing a report"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Writing an important report
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={discussionImage}
                        alt="People discussing ideas"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Sharing ideas and opinions
                    </p>
                  </div>
                </div>
              </div>

              {openDrills.wrapUp && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-blue-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-blue-700 mb-4">More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I need to talk to <span className="text-blue-600 font-bold">you/her/him</span>.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I needed to talk to <span className="text-blue-600 font-bold">you/her/him</span> yesterday.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">I will need to talk to <span className="text-blue-600 font-bold">you/her/him</span> tomorrow.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She talks to her <span className="text-blue-600 font-bold">father/mother/friend</span>.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She talked to her <span className="text-blue-600 font-bold">father/mother/friend</span> yesterday.</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Do you like this <span className="text-blue-600 font-bold">idea/book/plan</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Did you like this <span className="text-blue-600 font-bold">idea/book/plan</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">Have you ever <span className="text-blue-600 font-bold">written/thought/talked</span> about it?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time does your class <span className="text-blue-600 font-bold">finish/start/begin</span>?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time did your class <span className="text-blue-600 font-bold">finish/start/begin</span> yesterday?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">What time will your class <span className="text-blue-600 font-bold">finish/start/begin</span> tomorrow?</div>
                    <div className="p-3 bg-blue-50 rounded-xl text-center">She has <span className="text-blue-600 font-bold">already finished/written/thought</span> about it.</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - WRAP UP */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <button
              onClick={() => toggleDrill('wrapUp')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.wrapUp ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>

          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Conjugar os verbos to write e to think</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Vocabulário sobre estudos e opiniões</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar e responder com Why e Because no presente, passado, present perfect e futuro</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Expressar opiniões com I think so / I don't think so</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar significados: What's the meaning of...?</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Perguntar como se diz algo: How do you say...?</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Usar Present Perfect: have/has + past participle</span></div>
            <div className="flex items-center"><span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span><span className="text-gray-800">Formar frases no futuro com will e going to</span></div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson36")}
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

      <style jsx>{`
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

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(59,130,246,0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(139,92,246,0.8);
          }
          100% {
            box-shadow: 0 0 5px rgba(59,130,246,0.5);
          }
        }

        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}