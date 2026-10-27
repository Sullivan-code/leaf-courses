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
// CHECK IT OUT HORIZONTAL
// ============================================
function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">CHECK IT OUT!</h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
        <div className="bg-green-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">TIME EXPRESSIONS</h3>
          {[
            "in a minute",
            "in an hour",
            "in five minutes",
            "in two hours",
            "I'll start in a minute.",
            "We finish in two hours.",
          ].map((item, idx) => (
            <SpeakSentence key={idx} text={item} className="block cursor-pointer hover:opacity-70">
              • {item}
            </SpeakSentence>
          ))}
        </div>

        <div className="bg-red-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">QUESTION PATTERNS</h3>
          {[
            "What do you want to study?",
            "When do they start?",
            "Where do we have the meeting?",
            "What time do you finish?",
          ].map((item, idx) => (
            <SpeakSentence key={idx} text={item} className="block cursor-pointer hover:opacity-70">
              • {item}
            </SpeakSentence>
          ))}
          <div className="mt-4 pt-4 border-t border-red-600">
            <h4 className="font-bold text-yellow-300 mb-2">MEETING EXPRESSIONS</h4>
            {[
              "to go to the meeting",
              "to speak at the meeting",
              "I need to study for an exam.",
            ].map((item, idx) => (
              <SpeakSentence key={idx} text={item} className="block cursor-pointer hover:opacity-70">
                • {item}
              </SpeakSentence>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 31
// ============================================
export default function Lesson31StartFinish() {
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
  const mainImage = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const collegeImage = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const projectImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const meetingImage = "https://images.unsplash.com/photo-1517048676738-d65ab93716d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const deadlineImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // ========== LESSON 31 DATA ==========
  const verbs = [
    { english: "to start", portuguese: "começar" },
    { english: "to finish", portuguese: "terminar" }
  ];

  const newWords = [
    { english: "project", portuguese: "projeto" },
    { english: "college", portuguese: "faculdade" },
    { english: "high school", portuguese: "ensino médio" },
    { english: "course", portuguese: "curso" },
    { english: "task", portuguese: "tarefa" },
    { english: "meeting", portuguese: "reunião" },
    { english: "exam", portuguese: "prova" },
    { english: "business", portuguese: "negócios" },
    { english: "semester", portuguese: "semestre" },
    { english: "hour", portuguese: "hora" },
    { english: "minute", portuguese: "minuto" },
    { english: "deadline", portuguese: "prazo" },
    { english: "next", portuguese: "próximo" },
    { english: "everything", portuguese: "tudo" },
    { english: "great", portuguese: "ótimo" },
  ];

  const grammarExamples = [
    { english: "You need to go to the office now.", portuguese: "Você precisa ir ao escritório agora." },
    { english: "We have to speak English at the meeting.", portuguese: "Nós temos que falar inglês na reunião." },
    { english: "I really want to study business.", portuguese: "Eu realmente quero estudar negócios." },
    { english: "They know great restaurants here.", portuguese: "Eles conhecem ótimos restaurantes aqui." },
  ];

  // Assessment
  const assessmentData = [
    { en: "When and where do you study English?", pt: "Quando e onde você estuda inglês?" },
    { en: "What are some places you want to visit on your next vacation?", pt: "Quais são alguns lugares que você quer visitar nas próximas férias?" },
    { en: "What is your phone number?", pt: "Qual é o seu número de telefone?" },
    { en: "What are some things you want to buy the next time you go to the mall?", pt: "Quais são algumas coisas que você quer comprar na próxima vez que for ao shopping?" },
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Começar / Eu começo. / Você começa. / Nós começamos.",
      options: [
        { label: "Começar", replacement: "to start.", pt: "Começar" },
        { label: "Eu começo", replacement: "I start.", pt: "Eu começo." },
        { label: "Você começa", replacement: "You start.", pt: "Você começa." },
        { label: "Nós começamos", replacement: "We start.", pt: "Nós começamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não começo. / Eles não começam. / Nós não começamos.",
      options: [
        { label: "Eu", replacement: "I don't start.", pt: "Eu não começo." },
        { label: "Eles", replacement: "They don't start.", pt: "Eles não começam." },
        { label: "Nós", replacement: "We don't start.", pt: "Nós não começamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você começa? / Nós começamos? / Vocês começam?",
      options: [
        { label: "Você", replacement: "Do you start?", pt: "Você começa?" },
        { label: "Nós", replacement: "Do we start?", pt: "Nós começamos?" },
        { label: "Vocês", replacement: "Do you all start?", pt: "Vocês começam?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Quando você começa? / Quando eles começam? / Quando nós começamos?",
      options: [
        { label: "você", replacement: "When do you start?", pt: "Quando você começa?" },
        { label: "eles", replacement: "When do they start?", pt: "Quando eles começam?" },
        { label: "nós", replacement: "When do we start?", pt: "Quando nós começamos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "O que você quer começar? / O que eles querem começar? / O que nós queremos começar?",
      options: [
        { label: "você", replacement: "What do you want to start?", pt: "O que você quer começar?" },
        { label: "eles", replacement: "What do they want to start?", pt: "O que eles querem começar?" },
        { label: "nós", replacement: "What do we want to start?", pt: "O que nós queremos começar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Terminar / Eu termino. / Eles terminam. / Nós terminamos.",
      options: [
        { label: "Terminar", replacement: "to finish.", pt: "Terminar" },
        { label: "Eu termino", replacement: "I finish.", pt: "Eu termino." },
        { label: "Eles terminam", replacement: "They finish.", pt: "Eles terminam." },
        { label: "Nós terminamos", replacement: "We finish.", pt: "Nós terminamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Eu não termino. / Você não termina. / Nós não terminamos.",
      options: [
        { label: "Eu", replacement: "I don't finish.", pt: "Eu não termino." },
        { label: "Você", replacement: "You don't finish.", pt: "Você não termina." },
        { label: "Nós", replacement: "We don't finish.", pt: "Nós não terminamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Você termina? / Eles terminam? / Nós terminamos?",
      options: [
        { label: "Você", replacement: "Do you finish?", pt: "Você termina?" },
        { label: "Eles", replacement: "Do they finish?", pt: "Eles terminam?" },
        { label: "Nós", replacement: "Do we finish?", pt: "Nós terminamos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Eu não quero terminar. / Eles não querem terminar. / Nós não queremos terminar.",
      options: [
        { label: "Eu", replacement: "I don't want to finish.", pt: "Eu não quero terminar." },
        { label: "Eles", replacement: "They don't want to finish.", pt: "Eles não querem terminar." },
        { label: "Nós", replacement: "We don't want to finish.", pt: "Nós não queremos terminar." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "A que horas você termina? / A que horas eles terminam? / A que horas nós terminamos?",
      options: [
        { label: "você", replacement: "What time do you finish?", pt: "A que horas você termina?" },
        { label: "eles", replacement: "What time do they finish?", pt: "A que horas eles terminam?" },
        { label: "nós", replacement: "What time do we finish?", pt: "A que horas nós terminamos?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu quero começar um curso. / Este mês / Esta semana.",
      options: [
        { label: "curso", replacement: "I want to start a course.", pt: "Eu quero começar um curso." },
        { label: "este mês", replacement: "I want to start a course this month.", pt: "Eu quero começar um curso este mês." },
        { label: "esta semana", replacement: "I want to start a course this week.", pt: "Eu quero começar um curso esta semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eles começam a faculdade na próxima semana. / No próximo mês / No próximo ano.",
      options: [
        { label: "próxima semana", replacement: "They start college next week.", pt: "Eles começam a faculdade na próxima semana." },
        { label: "próximo mês", replacement: "They start college next month.", pt: "Eles começam a faculdade no próximo mês." },
        { label: "próximo ano", replacement: "They start college next year.", pt: "Eles começam a faculdade no próximo ano." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você termina o ensino médio no próximo semestre? / No próximo mês / No próximo ano.",
      options: [
        { label: "semestre", replacement: "Do you finish high school next semester?", pt: "Você termina o ensino médio no próximo semestre?" },
        { label: "mês", replacement: "Do you finish high school next month?", pt: "Você termina o ensino médio no próximo mês?" },
        { label: "ano", replacement: "Do you finish high school next year?", pt: "Você termina o ensino médio no próximo ano?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Nós temos uma reunião às três horas da tarde. / Às quatro horas / Às cinco horas.",
      options: [
        { label: "três", replacement: "We have a meeting at 3 PM.", pt: "Nós temos uma reunião às três horas da tarde." },
        { label: "quatro", replacement: "We have a meeting at 4 PM.", pt: "Nós temos uma reunião às quatro horas da tarde." },
        { label: "cinco", replacement: "We have a meeting at 5 PM.", pt: "Nós temos uma reunião às cinco horas da tarde." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu preciso estudar para as provas. / Para o projeto / Para o trabalho.",
      options: [
        { label: "provas", replacement: "I need to study for the exams.", pt: "Eu preciso estudar para as provas." },
        { label: "projeto", replacement: "I need to study for the project.", pt: "Eu preciso estudar para o projeto." },
        { label: "trabalho", replacement: "I need to study for work.", pt: "Eu preciso estudar para o trabalho." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu tenho um bom professor. / Vários professores / Um professor excelente.",
      options: [
        { label: "bom", replacement: "I have a good teacher.", pt: "Eu tenho um bom professor." },
        { label: "vários", replacement: "I have several teachers.", pt: "Eu tenho vários professores." },
        { label: "excelente", replacement: "I have an excellent teacher.", pt: "Eu tenho um professor excelente." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Quanto tempo você tem? / Quer? / Precisa?",
      options: [
        { label: "tem", replacement: "How much time do you have?", pt: "Quanto tempo você tem?" },
        { label: "quer", replacement: "How much time do you want?", pt: "Quanto tempo você quer?" },
        { label: "precisa", replacement: "How much time do you need?", pt: "Quanto tempo você precisa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Nós precisamos de duas horas. / Três horas / Quatro horas.",
      options: [
        { label: "duas", replacement: "We need two hours.", pt: "Nós precisamos de duas horas." },
        { label: "três", replacement: "We need three hours.", pt: "Nós precisamos de três horas." },
        { label: "quatro", replacement: "We need four hours.", pt: "Nós precisamos de quatro horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu tenho uma hora para terminar a tarefa. / A prova / O projeto.",
      options: [
        { label: "tarefa", replacement: "I have one hour to finish the task.", pt: "Eu tenho uma hora para terminar a tarefa." },
        { label: "prova", replacement: "I have one hour to finish the exam.", pt: "Eu tenho uma hora para terminar a prova." },
        { label: "projeto", replacement: "I have one hour to finish the project.", pt: "Eu tenho uma hora para terminar o projeto." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Nós temos duas horas para estudar. / Para ir ao banco / Para ir ao mercado.",
      options: [
        { label: "estudar", replacement: "We have two hours to study.", pt: "Nós temos duas horas para estudar." },
        { label: "banco", replacement: "We have two hours to go to the bank.", pt: "Nós temos duas horas para ir ao banco." },
        { label: "mercado", replacement: "We have two hours to go to the market.", pt: "Nós temos duas horas para ir ao mercado." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eles estudam negócios na faculdade. / Meus primos / Meus colegas de trabalho.",
      options: [
        { label: "eles", replacement: "They study business in college.", pt: "Eles estudam negócios na faculdade." },
        { label: "meus primos", replacement: "My cousins study business in college.", pt: "Meus primos estudam negócios na faculdade." },
        { label: "meus colegas", replacement: "My coworkers study business in college.", pt: "Meus colegas de trabalho estudam negócios na faculdade." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Nós temos ótimos professores na faculdade. / Ótimos amigos / Ótimos colegas de classe.",
      options: [
        { label: "professores", replacement: "We have great teachers in college.", pt: "Nós temos ótimos professores na faculdade." },
        { label: "amigos", replacement: "We have great friends in college.", pt: "Nós temos ótimos amigos na faculdade." },
        { label: "colegas", replacement: "We have great classmates in college.", pt: "Nós temos ótimos colegas de classe na faculdade." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Você sabe tudo sobre esse assunto? / Sobre biologia / Sobre matemática.",
      options: [
        { label: "assunto", replacement: "Do you know everything about this subject?", pt: "Você sabe tudo sobre esse assunto?" },
        { label: "biologia", replacement: "Do you know everything about biology?", pt: "Você sabe tudo sobre biologia?" },
        { label: "matemática", replacement: "Do you know everything about math?", pt: "Você sabe tudo sobre matemática?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu tenho duas reuniões esta manhã. / Esta tarde / Esta noite.",
      options: [
        { label: "manhã", replacement: "I have two meetings this morning.", pt: "Eu tenho duas reuniões esta manhã." },
        { label: "tarde", replacement: "I have two meetings this afternoon.", pt: "Eu tenho duas reuniões esta tarde." },
        { label: "noite", replacement: "I have two meetings tonight.", pt: "Eu tenho duas reuniões esta noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "A que horas você tem que ir ao centro hoje? / De manhã / À tarde / À noite.",
      options: [
        { label: "hoje", replacement: "What time do you have to go downtown today?", pt: "A que horas você tem que ir ao centro hoje?" },
        { label: "de manhã", replacement: "What time do you have to go downtown in the morning?", pt: "A que horas você tem que ir ao centro de manhã?" },
        { label: "à tarde", replacement: "What time do you have to go downtown in the afternoon?", pt: "A que horas você tem que ir ao centro à tarde?" },
        { label: "à noite", replacement: "What time do you have to go downtown at night?", pt: "A que horas você tem que ir ao centro à noite?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu faço minha lição de casa aos sábados. / Aos domingos / Nos fins de semana.",
      options: [
        { label: "sábados", replacement: "I do my homework on Saturdays.", pt: "Eu faço minha lição de casa aos sábados." },
        { label: "domingos", replacement: "I do my homework on Sundays.", pt: "Eu faço minha lição de casa aos domingos." },
        { label: "fins de semana", replacement: "I do my homework on weekends.", pt: "Eu faço minha lição de casa nos fins de semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Você faz sua lição de casa na escola? / Em casa / No trabalho.",
      options: [
        { label: "escola", replacement: "Do you do your homework at school?", pt: "Você faz sua lição de casa na escola?" },
        { label: "casa", replacement: "Do you do your homework at home?", pt: "Você faz sua lição de casa em casa?" },
        { label: "trabalho", replacement: "Do you do your homework at work?", pt: "Você faz sua lição de casa no trabalho?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Vamos começar. / Terminar / Estudar.",
      options: [
        { label: "começar", replacement: "Let's start.", pt: "Vamos começar." },
        { label: "terminar", replacement: "Let's finish.", pt: "Vamos terminar." },
        { label: "estudar", replacement: "Let's study.", pt: "Vamos estudar." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Vamos ficar em casa. / Cozinhar / Limpar a casa.",
      options: [
        { label: "ficar", replacement: "Let's stay home.", pt: "Vamos ficar em casa." },
        { label: "cozinhar", replacement: "Let's cook.", pt: "Vamos cozinhar." },
        { label: "limpar", replacement: "Let's clean the house.", pt: "Vamos limpar a casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Vamos lá! / Vamos ao shopping / À praia / À academia.",
      options: [
        { label: "Vamos lá", replacement: "Let's go!", pt: "Vamos lá!" },
        { label: "shopping", replacement: "Let's go to the mall.", pt: "Vamos ao shopping." },
        { label: "praia", replacement: "Let's go to the beach.", pt: "Vamos à praia." },
        { label: "academia", replacement: "Let's go to the gym.", pt: "Vamos à academia." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Você precisa ir ao escritório agora. / À reunião / À empresa.",
      options: [
        { label: "escritório", replacement: "You need to go to the office now.", pt: "Você precisa ir ao escritório agora." },
        { label: "reunião", replacement: "You need to go to the meeting now.", pt: "Você precisa ir à reunião agora." },
        { label: "empresa", replacement: "You need to go to the company now.", pt: "Você precisa ir à empresa agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Nós temos que falar inglês na reunião. / Espanhol / Francês.",
      options: [
        { label: "inglês", replacement: "We have to speak English at the meeting.", pt: "Nós temos que falar inglês na reunião." },
        { label: "espanhol", replacement: "We have to speak Spanish at the meeting.", pt: "Nós temos que falar espanhol na reunião." },
        { label: "francês", replacement: "We have to speak French at the meeting.", pt: "Nós temos que falar francês na reunião." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu realmente quero estudar negócios. / Matemática / Geografia.",
      options: [
        { label: "negócios", replacement: "I really want to study business.", pt: "Eu realmente quero estudar negócios." },
        { label: "matemática", replacement: "I really want to study math.", pt: "Eu realmente quero estudar matemática." },
        { label: "geografia", replacement: "I really want to study geography.", pt: "Eu realmente quero estudar geografia." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eles conhecem ótimos restaurantes aqui. / Escolas / Faculdades.",
      options: [
        { label: "restaurantes", replacement: "They know great restaurants here.", pt: "Eles conhecem ótimos restaurantes aqui." },
        { label: "escolas", replacement: "They know great schools here.", pt: "Eles conhecem ótimas escolas aqui." },
        { label: "faculdades", replacement: "They know great colleges here.", pt: "Eles conhecem ótimas faculdades aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu preciso começar a reunião em uma hora. / Em 15 minutos / Em 10 minutos.",
      options: [
        { label: "uma hora", replacement: "I need to start the meeting in one hour.", pt: "Eu preciso começar a reunião em uma hora." },
        { label: "15 min", replacement: "I need to start the meeting in 15 minutes.", pt: "Eu preciso começar a reunião em 15 minutos." },
        { label: "10 min", replacement: "I need to start the meeting in 10 minutes.", pt: "Eu preciso começar a reunião em 10 minutos." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eu tenho que terminar esta tarefa em duas horas. / Em três horas.",
      options: [
        { label: "duas", replacement: "I have to finish this task in two hours.", pt: "Eu tenho que terminar esta tarefa em duas horas." },
        { label: "três", replacement: "I have to finish this task in three hours.", pt: "Eu tenho que terminar esta tarefa em três horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Nós não queremos começar esta tarefa. / Na próxima semana / No próximo mês.",
      options: [
        { label: "agora", replacement: "We don't want to start this task.", pt: "Nós não queremos começar esta tarefa." },
        { label: "próxima semana", replacement: "We don't want to start this task next week.", pt: "Nós não queremos começar esta tarefa na próxima semana." },
        { label: "próximo mês", replacement: "We don't want to start this task next month.", pt: "Nós não queremos começar esta tarefa no próximo mês." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Nós não sabemos tudo. / Eles não sabem tudo / Eu não sei tudo.",
      options: [
        { label: "nós", replacement: "We don't know everything.", pt: "Nós não sabemos tudo." },
        { label: "eles", replacement: "They don't know everything.", pt: "Eles não sabem tudo." },
        { label: "eu", replacement: "I don't know everything.", pt: "Eu não sei tudo." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "A que horas você quer começar este curso? / Este projeto / Esta tarefa.",
      options: [
        { label: "curso", replacement: "What time do you want to start this course?", pt: "A que horas você quer começar este curso?" },
        { label: "projeto", replacement: "What time do you want to start this project?", pt: "A que horas você quer começar este projeto?" },
        { label: "tarefa", replacement: "What time do you want to start this task?", pt: "A que horas você quer começar esta tarefa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "A que horas você quer terminar esta tarefa? / Este projeto / Este curso.",
      options: [
        { label: "tarefa", replacement: "What time do you want to finish this task?", pt: "A que horas você quer terminar esta tarefa?" },
        { label: "projeto", replacement: "What time do you want to finish this project?", pt: "A que horas você quer terminar este projeto?" },
        { label: "curso", replacement: "What time do you want to finish this course?", pt: "A que horas você quer terminar este curso?" },
      ],
      currentIndex: 0,
    },
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
            ⏰ Lesson 31 - START / FINISH
          </h1>
          <SpeakSentence text="Learn to talk about beginnings, endings, deadlines, and daily schedules." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about beginnings, endings, deadlines, and daily schedules.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Starting and finishing tasks"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">🎯 Start strong, finish stronger!</p>
        </div>

        {/* ===================== ASSESSMENT ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 Assessment</h2>
              <SpeakSentence text="Answer these review questions in English" className="mt-2 text-blue-100 italic">
                Responda estas perguntas de revisão em inglês
              </SpeakSentence>
            </div>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-2xl p-6 space-y-4">
              {assessmentData.map((item, index) => (
                <div key={index} className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium">
                    {index + 1}. <SpeakSentence text={item.en} className="inline text-blue-700 font-semibold">{item.en}</SpeakSentence>
                  </p>
                  <p className="text-sm text-gray-600 mt-1 ml-6">🇧🇷 {item.pt}</p>
                </div>
              ))}
            </div>
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
            <SpeakSentence text="Practice common phrases to talk about beginnings, endings and daily routines" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about beginnings, endings and daily routines
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
              <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3">
                {[
                  { en: "I have two meetings this morning.", pt: "Eu tenho duas reuniões esta manhã." },
                  { en: "What time do you have to go downtown today?", pt: "A que horas você tem que ir ao centro hoje?" },
                  { en: "I do my homework on Saturdays.", pt: "Eu faço minha lição de casa aos sábados." },
                  { en: "Let's start!", pt: "Vamos começar!" },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg">
                    <SpeakSentence text={item.en} className="text-blue-600 font-bold cursor-pointer text-left w-full block">
                      {item.en}
                    </SpeakSentence>
                    <div className="text-gray-600 text-sm mt-1">{item.pt}</div>
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
            <SpeakSentence text="Structures for talking about obligations, plans and time" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for talking about obligations, plans and time
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
                  {[
                    { en: "I started a new course last semester.", pt: "Eu comecei um novo curso no semestre passado." },
                    { en: "She finished the project yesterday.", pt: "Ela terminou o projeto ontem." },
                    { en: "He will start college next year.", pt: "Ele vai começar a faculdade no ano que vem." },
                    { en: "We will finish this task in five minutes.", pt: "Nós vamos terminar esta tarefa em cinco minutos." },
                    { en: "Does he start work at 8 AM?", pt: "Ele começa a trabalhar às 8 da manhã?" },
                    { en: "Does she have a deadline this Friday?", pt: "Ela tem um prazo nesta sexta-feira?" },
                    { en: "Does the meeting start at 3 PM?", pt: "A reunião começa às 15 horas?" },
                    { en: "When does he finish college?", pt: "Quando ele termina a faculdade?" },
                    { en: "What time does she start her course?", pt: "Que horas ela começa o curso dela?" },
                    { en: "Why does it start so late?", pt: "Por que isso começa tão tarde?" },
                  ].map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.en} className="text-base font-medium">
                          {index + 1}. {sentence.en}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.pt}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={collegeImage} alt="College" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Starting college or courses</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={meetingImage} alt="Meetings" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Meetings and deadlines</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={deadlineImage} alt="Projects" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Projects and tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – CHECK IT OUT ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
              <PencilIcon onClick={() => openNoteModal('Check It Out')} />
            </div>
            <p className="text-sm text-blue-100">Time Expressions & Question Patterns</p>
          </div>
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* ===================== SECTION 7 – FINAL SPEAKING ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL ACTIVITY - SPEAKING</h2>
            <SpeakSentence text="Answer in English:" className="mt-2 text-blue-100 italic">
              🗣️ Answer in English:
            </SpeakSentence>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-8 space-y-6">
              {[
                { q: "When do you start work or school?", a: "I start at _______ . / I start on _______ ." },
                { q: "What do you want to study?", a: "I want to study _______ ." },
                { q: "Do you have a deadline this week?", a: "Yes, I do. / No, I don't." },
                { q: "Do you have a meeting today?", a: "Yes, I do. / No, I don't." },
                { q: "What do you want to start this year?", a: "I want to start _______ ." },
              ].map((item, idx) => (
                <div key={idx} className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ {idx + 1}. {item.q}</p>
                  <p className="text-gray-600 mt-2">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== WRAP UP ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
            <SpeakSentence text="Key expressions to remember" className="mt-2 text-blue-100 italic">
              📝 Key expressions to remember
            </SpeakSentence>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4">
              <h3 className="font-bold text-lg mb-4 text-yellow-300">AFFIRMATIVE</h3>
              {[
                { en: "I start work at 8 AM.", pt: "Eu começo a trabalhar às 8 da manhã." },
                { en: "She finishes at 5 PM.", pt: "Ela termina às 5 da tarde." },
                { en: "We start college next month.", pt: "Nós começamos a faculdade no próximo mês." },
                { en: "They finish the project next week.", pt: "Eles terminam o projeto na próxima semana." },
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
                { en: "I don't want to finish now.", pt: "Eu não quero terminar agora." },
                { en: "She doesn't start until next week.", pt: "Ela não começa até a próxima semana." },
                { en: "When do you start?", pt: "Quando você começa?" },
                { en: "What time does she finish?", pt: "Que horas ela termina?" },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-red-700 rounded-lg">
                  <SpeakSentence text={item.en} className="font-bold text-red-50">{item.en}</SpeakSentence>
                  <p className="text-red-200 text-sm mt-1">{item.pt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (30)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (32) &rarr;
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