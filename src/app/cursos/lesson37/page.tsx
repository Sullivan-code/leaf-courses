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
            placeholder="Escreva aqui suas anotações...
- Traduções importantes
- Dúvidas para o professor
- Exemplos pessoais
- Dicas de memorização"
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

// Pencil Icon Component
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

// Substitution Component
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
    <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-sm">
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

// Wrap Up Component
function WrapUp() {
  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg border-2 border-teal-200">
      <div className="bg-teal-900 text-white flex-1 p-6 space-y-4">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">USEFUL EXPRESSIONS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="Get well soon" className="font-bold text-xl text-yellow-200">Get well soon.</SpeakText>
              <p className="text-teal-200 text-sm mt-1">Melhoras.</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="Bless you" className="font-bold text-xl text-yellow-200">Bless you!</SpeakText>
              <p className="text-teal-200 text-sm mt-1">Saúde!</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">THIS / THAT vs THESE / THOSE</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="this is" className="font-bold text-teal-200">this is</SpeakText>
              <p className="text-teal-300 text-sm">isto é / este é</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="these are" className="font-bold text-teal-200">these are</SpeakText>
              <p className="text-teal-300 text-sm">estes/estas são</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="that is" className="font-bold text-teal-200">that is</SpeakText>
              <p className="text-teal-300 text-sm">aquilo é / aquele é</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <SpeakText text="those are" className="font-bold text-teal-200">those are</SpeakText>
              <p className="text-teal-300 text-sm">aqueles/aquelas são</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-teal-800 text-white flex-1 p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-yellow-300 mb-3">CONTRACTIONS</h3>
          <div className="grid grid-cols-2 gap-2">
            {["I'm", "You're", "He's", "She's", "It's", "We're"].map((c, i) => (
              <div key={i} className="p-2 bg-teal-700 rounded-lg text-center">
                <SpeakText text={c} className="font-bold">{c}</SpeakText>
              </div>
            ))}
            <div className="p-2 bg-teal-700 rounded-lg text-center col-span-2">
              <SpeakText text="They're" className="font-bold">They're</SpeakText>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">ASKING ABOUT SYMPTOMS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-700 rounded-lg">
              <SpeakText text="What's the matter" className="font-bold text-yellow-200">What's the matter?</SpeakText>
              <p className="text-teal-200 text-sm mt-1">O que houve? / Qual é o problema?</p>
            </div>
            <div className="p-3 bg-teal-700 rounded-lg">
              <SpeakText text="I have a toothache" className="font-bold text-yellow-200">I have a toothache.</SpeakText>
              <p className="text-teal-200 text-sm mt-1">Estou com dor de dente.</p>
            </div>
            <div className="p-3 bg-teal-700 rounded-lg">
              <SpeakText text="I want to make an appointment to see a dentist" className="font-bold text-yellow-200 text-sm">I want to make an appointment to see a dentist.</SpeakText>
              <p className="text-teal-200 text-sm mt-1">Quero marcar uma consulta para ver um dentista.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson37HealthFeelingsProfessions() {
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

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const doctorImage = "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const sickImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const verbs = [
    { english: "I'm", portuguese: "eu sou / estou" },
    { english: "You're", portuguese: "você é / está (singular)" },
    { english: "You're", portuguese: "vocês são / estão (plural)" },
    { english: "He's", portuguese: "ele é / está" },
    { english: "She's", portuguese: "ela é / está" },
    { english: "It's", portuguese: "ele/ela é / está" },
    { english: "We're", portuguese: "nós somos / estamos" },
    { english: "They're", portuguese: "eles/elas são / estão" },
  ];

  const newWords = [
    { english: "nurse", portuguese: "enfermeiro(a)" },
    { english: "doctor", portuguese: "médico(a)" },
    { english: "dentist", portuguese: "dentista" },
    { english: "sick", portuguese: "doente" },
    { english: "headache", portuguese: "dor de cabeça" },
    { english: "stomachache", portuguese: "dor de estômago" },
    { english: "sore throat", portuguese: "dor de garganta" },
    { english: "toothache", portuguese: "dor de dente" },
    { english: "cold", portuguese: "resfriado" },
    { english: "fever", portuguese: "febre" },
    { english: "appointment", portuguese: "compromisso / consulta" },
    { english: "pill", portuguese: "comprimido" },
    { english: "painkiller", portuguese: "analgésico" },
    { english: "health", portuguese: "saúde" },
    { english: "kind", portuguese: "gentil" },
    { english: "these", portuguese: "estes/estas" },
    { english: "those", portuguese: "aqueles/aquelas" },
  ];

  const grammarExamples = [
    { english: "I'm a teacher.", portuguese: "Eu sou professor." },
    { english: "You're a nurse.", portuguese: "Você é enfermeira." },
    { english: "She was late for her appointment.", portuguese: "Ela estava atrasada para o compromisso." },
    { english: "He's still in pain.", portuguese: "Ele ainda está com dor." },
    { english: "It's early, let's watch a movie.", portuguese: "Está cedo, vamos assistir um filme." },
    { english: "We'll be friends.", portuguese: "Nós seremos amigos." },
    { english: "You were great doctors.", portuguese: "Vocês eram ótimos médicos." },
    { english: "They'll be at the hospital the day after tomorrow.", portuguese: "Eles estarão no hospital depois de amanhã." }
  ];

  // Static phrases from the image + Past versions
  const staticUsefulPhrases = [
    { english: "Take this medicine for your toothache.", portuguese: "Tome este remédio para sua dor de dente." },
    { english: "I feel better now.", portuguese: "Eu me sinto melhor agora." },
    { english: "I still have to go to the dentist.", portuguese: "Eu ainda tenho que ir ao dentista." },
    { english: "I'm in pain.", portuguese: "Eu estou com dor." },
    { english: "He took this medicine yesterday.", portuguese: "Ele tomou este remédio ontem." },
    { english: "I felt better yesterday.", portuguese: "Eu me senti melhor ontem." },
  ];

  // Make It Yours: verb to be → past | other verbs → present
  const realLifeSentences = [
    {
      english: "I have a headache today.",
      portuguese: "Eu estou com dor de cabeça hoje.",
      jsx: <>I <span className="text-blue-600 font-bold">have</span> a <span className="text-blue-600 font-bold">headache</span> today.</>
    },
    {
      english: "I prefer to drink tea for my stomachache.",
      portuguese: "Eu prefiro beber chá para minha dor de estômago.",
      jsx: <>I <span className="text-blue-600 font-bold">prefer</span> to drink tea for my <span className="text-blue-600 font-bold">stomachache</span>.</>
    },
    {
      english: "He takes the medicine every morning.",
      portuguese: "Ele toma o remédio toda manhã.",
      jsx: <>He <span className="text-blue-600 font-bold">takes</span> the <span className="text-blue-600 font-bold">medicine</span> every morning.</>
    },
    {
      english: "I was sick yesterday, but I was better later.",
      portuguese: "Eu estava doente ontem, mas eu estava melhor depois.",
      jsx: <>I <span className="text-blue-600 font-bold">was sick</span> yesterday, but I <span className="text-blue-600 font-bold">was better</span> later.</>
    },
    {
      english: "Do you have a fever?",
      portuguese: "Você está com febre?",
      jsx: <><span className="text-blue-600 font-bold">Do</span> you <span className="text-blue-600 font-bold">have</span> a <span className="text-blue-600 font-bold">fever</span>?</>
    },
    {
      english: "She has an appointment at the dentist today.",
      portuguese: "Ela tem uma consulta no dentista hoje.",
      jsx: <>She <span className="text-blue-600 font-bold">has</span> an <span className="text-blue-600 font-bold">appointment</span> at the dentist today.</>
    },
    {
      english: "I still take that medicine every day.",
      portuguese: "Eu ainda tomo aquele remédio todos os dias.",
      jsx: <>I still <span className="text-blue-600 font-bold">take</span> that <span className="text-blue-600 font-bold">medicine</span> every day.</>
    },
    {
      english: "The children were at home because they were sick.",
      portuguese: "As crianças estavam em casa porque estavam doentes.",
      jsx: <>The children <span className="text-blue-600 font-bold">were</span> at home because they <span className="text-blue-600 font-bold">were sick</span>.</>
    },
    {
      english: "Please take those reports to the doctor.",
      portuguese: "Por favor, leve aqueles relatórios ao médico.",
      jsx: <>Please <span className="text-blue-600 font-bold">take</span> those <span className="text-blue-600 font-bold">reports</span> to the doctor.</>
    },
    {
      english: "Do you have to take these pills?",
      portuguese: "Você tem que tomar estes comprimidos?",
      jsx: <><span className="text-blue-600 font-bold">Do</span> you <span className="text-blue-600 font-bold">have</span> to <span className="text-blue-600 font-bold">take</span> these <span className="text-blue-600 font-bold">pills</span>?</>
    },
  ];

  // ========== DRILLS: VERBS ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "ser / estar - Eu sou. / Eu estou.",
      options: [
        { label: "ser", replacement: "to be", pt: "ser" },
        { label: "Eu sou/estou", replacement: "I am.", pt: "Eu sou / Eu estou." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você é. / Vocês são. / Nós somos. / Eles são.",
      options: [
        { label: "Você", replacement: "You are.", pt: "Você é." },
        { label: "Vocês", replacement: "You are.", pt: "Vocês são." },
        { label: "Nós", replacement: "We are.", pt: "Nós somos." },
        { label: "Eles", replacement: "They are.", pt: "Eles são." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele está. / Ela está.",
      options: [
        { label: "Ele", replacement: "He is.", pt: "Ele está." },
        { label: "Ela", replacement: "She is.", pt: "Ela está." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Está aqui. / lá / em casa",
      options: [
        { label: "aqui", replacement: "It is here.", pt: "Está aqui." },
        { label: "lá", replacement: "It is there.", pt: "Está lá." },
        { label: "em casa", replacement: "It is at home.", pt: "Está em casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu estou na escola. / no trabalho / na igreja",
      options: [
        { label: "escola", replacement: "I am at school.", pt: "Eu estou na escola." },
        { label: "trabalho", replacement: "I am at work.", pt: "Eu estou no trabalho." },
        { label: "igreja", replacement: "I am at church.", pt: "Eu estou na igreja." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eles são meus amigos. / colegas de classe / vizinhos",
      options: [
        { label: "amigos", replacement: "They are my friends.", pt: "Eles são meus amigos." },
        { label: "colegas", replacement: "They are my classmates.", pt: "Eles são meus colegas de classe." },
        { label: "vizinhos", replacement: "They are my neighbors.", pt: "Eles são meus vizinhos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "É bom. / ruim / engraçado",
      options: [
        { label: "bom", replacement: "It is good.", pt: "É bom." },
        { label: "ruim", replacement: "It is bad.", pt: "É ruim." },
        { label: "engraçado", replacement: "It is funny.", pt: "É engraçado." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "ser / Eu quero ser. / Ele quer ser.",
      options: [
        { label: "ser", replacement: "to be", pt: "ser" },
        { label: "Eu quero", replacement: "I want to be.", pt: "Eu quero ser." },
        { label: "Ele quer", replacement: "He wants to be.", pt: "Ele quer ser." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "O que você quer ser? / eles / ela",
      options: [
        { label: "você", replacement: "What do you want to be?", pt: "O que você quer ser?" },
        { label: "eles", replacement: "What do they want to be?", pt: "O que eles querem ser?" },
        { label: "ela", replacement: "What does she want to be?", pt: "O que ela quer ser?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Eu sou. / Ela é. / Vocês são.",
      options: [
        { label: "Eu", replacement: "I am.", pt: "Eu sou." },
        { label: "Ela", replacement: "She is.", pt: "Ela é." },
        { label: "Vocês", replacement: "You are.", pt: "Vocês são." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== DRILLS: NEW WORDS ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu preciso falar com o médico. / enfermeiro / dentista",
      options: [
        { label: "médico", replacement: "I need to talk to the doctor.", pt: "Eu preciso falar com o médico." },
        { label: "enfermeiro", replacement: "I need to talk to the nurse.", pt: "Eu preciso falar com o enfermeiro." },
        { label: "dentista", replacement: "I need to talk to the dentist.", pt: "Eu preciso falar com o dentista." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eu tenho que ir ao hospital amanhã. / ao médico / ao dentista",
      options: [
        { label: "hospital", replacement: "I have to go to the hospital tomorrow.", pt: "Eu tenho que ir ao hospital amanhã." },
        { label: "médico", replacement: "I have to go to the doctor tomorrow.", pt: "Eu tenho que ir ao médico amanhã." },
        { label: "dentista", replacement: "I have to go to the dentist tomorrow.", pt: "Eu tenho que ir ao dentista amanhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você conhece aquele médico? / dentista / aquela enfermeira",
      options: [
        { label: "médico", replacement: "Do you know that doctor?", pt: "Você conhece aquele médico?" },
        { label: "dentista", replacement: "Do you know that dentist?", pt: "Você conhece aquele dentista?" },
        { label: "enfermeira", replacement: "Do you know that nurse?", pt: "Você conhece aquela enfermeira?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu tenho uma consulta no dentista. / no médico / no hospital",
      options: [
        { label: "dentista", replacement: "I have an appointment at the dentist.", pt: "Eu tenho uma consulta no dentista." },
        { label: "médico", replacement: "I have an appointment at the doctor.", pt: "Eu tenho uma consulta no médico." },
        { label: "hospital", replacement: "I have an appointment at the hospital.", pt: "Eu tenho uma consulta no hospital." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Você tem um compromisso hoje? / esta tarde / amanhã",
      options: [
        { label: "hoje", replacement: "Do you have an appointment today?", pt: "Você tem um compromisso hoje?" },
        { label: "esta tarde", replacement: "Do you have an appointment this afternoon?", pt: "Você tem um compromisso esta tarde?" },
        { label: "amanhã", replacement: "Do you have an appointment tomorrow?", pt: "Você tem um compromisso amanhã?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu não gosto de tomar remédio. / analgésicos / comprimidos",
      options: [
        { label: "remédio", replacement: "I don't like to take medicine.", pt: "Eu não gosto de tomar remédio." },
        { label: "analgésicos", replacement: "I don't like to take painkillers.", pt: "Eu não gosto de tomar analgésicos." },
        { label: "comprimidos", replacement: "I don't like to take pills.", pt: "Eu não gosto de tomar comprimidos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Você precisa tomar um analgésico? / Ela / Ele",
      options: [
        { label: "Você", replacement: "Do you need to take a painkiller?", pt: "Você precisa tomar um analgésico?" },
        { label: "Ela", replacement: "Does she need to take a painkiller?", pt: "Ela precisa tomar um analgésico?" },
        { label: "Ele", replacement: "Does he need to take a painkiller?", pt: "Ele precisa tomar um analgésico?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Eu estou com dor de cabeça. / dor de estômago / dor de dente",
      options: [
        { label: "cabeça", replacement: "I have a headache.", pt: "Eu estou com dor de cabeça." },
        { label: "estômago", replacement: "I have a stomachache.", pt: "Eu estou com dor de estômago." },
        { label: "dente", replacement: "I have a toothache.", pt: "Eu estou com dor de dente." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Minha irmã está com febre. / dor de garganta / resfriada",
      options: [
        { label: "febre", replacement: "My sister has a fever.", pt: "Minha irmã está com febre." },
        { label: "garganta", replacement: "My sister has a sore throat.", pt: "Minha irmã está com dor de garganta." },
        { label: "resfriada", replacement: "My sister has a cold.", pt: "Minha irmã está resfriada." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Ele está com dor de dente. / dor de cabeça / dor de estômago",
      options: [
        { label: "dente", replacement: "He has a toothache.", pt: "Ele está com dor de dente." },
        { label: "cabeça", replacement: "He has a headache.", pt: "Ele está com dor de cabeça." },
        { label: "estômago", replacement: "He has a stomachache.", pt: "Ele está com dor de estômago." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Você está com dor de garganta? / febre / resfriado",
      options: [
        { label: "garganta", replacement: "Do you have a sore throat?", pt: "Você está com dor de garganta?" },
        { label: "febre", replacement: "Do you have a fever?", pt: "Você está com febre?" },
        { label: "resfriado", replacement: "Do you have a cold?", pt: "Você está resfriado?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Quando você toma estes comprimidos? / analgésicos",
      options: [
        { label: "comprimidos", replacement: "When do you take these pills?", pt: "Quando você toma estes comprimidos?" },
        { label: "analgésicos", replacement: "When do you take these painkillers?", pt: "Quando você toma estes analgésicos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "Eu preciso conversar com aqueles médicos. / professores / enfermeiros",
      options: [
        { label: "médicos", replacement: "I need to talk to those doctors.", pt: "Eu preciso conversar com aqueles médicos." },
        { label: "professores", replacement: "I need to talk to those teachers.", pt: "Eu preciso conversar com aqueles professores." },
        { label: "enfermeiros", replacement: "I need to talk to those nurses.", pt: "Eu preciso conversar com aqueles enfermeiros." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== DRILLS: SPEAK LIKE A NATIVE ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu preferi beber chá para minha dor de estômago. / dor de cabeça / dor de garganta",
      options: [
        { label: "estômago", replacement: "I preferred to drink tea for my stomachache.", pt: "Eu preferi beber chá para minha dor de estômago." },
        { label: "cabeça", replacement: "I preferred to drink tea for my headache.", pt: "Eu preferi beber chá para minha dor de cabeça." },
        { label: "garganta", replacement: "I preferred to drink tea for my sore throat.", pt: "Eu preferi beber chá para minha dor de garganta." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu me sinto melhor agora, obrigado. / Ele se sente / Nós nos sentimos",
      options: [
        { label: "Eu", replacement: "I feel better now, thanks.", pt: "Eu me sinto melhor agora, obrigado." },
        { label: "Ele", replacement: "He feels better now, thanks.", pt: "Ele se sente melhor agora, obrigado." },
        { label: "Nós", replacement: "We feel better now, thanks.", pt: "Nós nos sentimos melhor agora, obrigado." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu ainda estudo de manhã. / à tarde / à noite",
      options: [
        { label: "manhã", replacement: "I still study in the morning.", pt: "Eu ainda estudo de manhã." },
        { label: "tarde", replacement: "I still study in the afternoon.", pt: "Eu ainda estudo à tarde." },
        { label: "noite", replacement: "I still study at night.", pt: "Eu ainda estudo à noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Ele ainda precisa ir ao médico. / ao dentista / à farmácia",
      options: [
        { label: "médico", replacement: "He still needs to go to the doctor.", pt: "Ele ainda precisa ir ao médico." },
        { label: "dentista", replacement: "He still needs to go to the dentist.", pt: "Ele ainda precisa ir ao dentista." },
        { label: "farmácia", replacement: "He still needs to go to the pharmacy.", pt: "Ele ainda precisa ir à farmácia." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Eu estou com dor. / Ela está / Eles estão",
      options: [
        { label: "Eu", replacement: "I am in pain.", pt: "Eu estou com dor." },
        { label: "Ela", replacement: "She is in pain.", pt: "Ela está com dor." },
        { label: "Eles", replacement: "They are in pain.", pt: "Eles estão com dor." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu ainda estou com dor. / Ela / Ele",
      options: [
        { label: "Eu", replacement: "I am still in pain.", pt: "Eu ainda estou com dor." },
        { label: "Ela", replacement: "She is still in pain.", pt: "Ela ainda está com dor." },
        { label: "Ele", replacement: "He is still in pain.", pt: "Ele ainda está com dor." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Eu tive que ir ao dentista ontem. / ao médico / ao hospital",
      options: [
        { label: "dentista", replacement: "I had to go to the dentist yesterday.", pt: "Eu tive que ir ao dentista ontem." },
        { label: "médico", replacement: "I had to go to the doctor yesterday.", pt: "Eu tive que ir ao médico ontem." },
        { label: "hospital", replacement: "I had to go to the hospital yesterday.", pt: "Eu tive que ir ao hospital ontem." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Ele tomou o remédio esta manhã. / analgésico / comprimido",
      options: [
        { label: "remédio", replacement: "He took the medicine this morning.", pt: "Ele tomou o remédio esta manhã." },
        { label: "analgésico", replacement: "He took the painkiller this morning.", pt: "Ele tomou o analgésico esta manhã." },
        { label: "comprimido", replacement: "He took the pill this morning.", pt: "Ele tomou o comprimido esta manhã." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Eu não me senti bem ontem. / Ela não se sentiu / Nós não nos sentimos",
      options: [
        { label: "Eu", replacement: "I didn't feel well yesterday.", pt: "Eu não me senti bem ontem." },
        { label: "Ela", replacement: "She didn't feel well yesterday.", pt: "Ela não se sentiu bem ontem." },
        { label: "Nós", replacement: "We didn't feel well yesterday.", pt: "Nós não nos sentimos bem ontem." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== DRILLS: GRAMMAR ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu sou médico. / dentista / enfermeiro",
      options: [
        { label: "médico", replacement: "I'm a doctor.", pt: "Eu sou médico." },
        { label: "dentista", replacement: "I'm a dentist.", pt: "Eu sou dentista." },
        { label: "enfermeiro", replacement: "I'm a nurse.", pt: "Eu sou enfermeiro." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ela é professora. / enfermeira / dentista",
      options: [
        { label: "professora", replacement: "She is a teacher.", pt: "Ela é professora." },
        { label: "enfermeira", replacement: "She is a nurse.", pt: "Ela é enfermeira." },
        { label: "dentista", replacement: "She is a dentist.", pt: "Ela é dentista." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele é dentista. / professor / médico",
      options: [
        { label: "dentista", replacement: "He is a dentist.", pt: "Ele é dentista." },
        { label: "professor", replacement: "He is a teacher.", pt: "Ele é professor." },
        { label: "médico", replacement: "He is a doctor.", pt: "Ele é médico." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Está cedo. / tarde / novo",
      options: [
        { label: "cedo", replacement: "It's early.", pt: "Está cedo." },
        { label: "tarde", replacement: "It's late.", pt: "Está tarde." },
        { label: "novo", replacement: "It's new.", pt: "É novo." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Aquela aula é importante. / interessante / ótima",
      options: [
        { label: "importante", replacement: "That class is important.", pt: "Aquela aula é importante." },
        { label: "interessante", replacement: "That class is interesting.", pt: "Aquela aula é interessante." },
        { label: "ótima", replacement: "That class is great.", pt: "Aquela aula é ótima." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ela é gentil. / engraçada / bonita",
      options: [
        { label: "gentil", replacement: "She is kind.", pt: "Ela é gentil." },
        { label: "engraçada", replacement: "She is funny.", pt: "Ela é engraçada." },
        { label: "bonita", replacement: "She is beautiful.", pt: "Ela é bonita." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Ele é brasileiro. / americano / britânico",
      options: [
        { label: "brasileiro", replacement: "He is Brazilian.", pt: "Ele é brasileiro." },
        { label: "americano", replacement: "He is American.", pt: "Ele é americano." },
        { label: "britânico", replacement: "He is British.", pt: "Ele é britânico." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Eu estou doente. / Ela está / Eles estão",
      options: [
        { label: "Eu", replacement: "I am sick.", pt: "Eu estou doente." },
        { label: "Ela", replacement: "She is sick.", pt: "Ela está doente." },
        { label: "Eles", replacement: "They are sick.", pt: "Eles estão doentes." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Eles são meus pais. / avós / amigos",
      options: [
        { label: "pais", replacement: "They are my parents.", pt: "Eles são meus pais." },
        { label: "avós", replacement: "They are my grandparents.", pt: "Eles são meus avós." },
        { label: "amigos", replacement: "They are my friends.", pt: "Eles são meus amigos." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Estes são meus amigos. / Aqueles são meus professores",
      options: [
        { label: "Estes", replacement: "These are my friends.", pt: "Estes são meus amigos." },
        { label: "Aqueles", replacement: "Those are my teachers.", pt: "Aqueles são meus professores." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-11",
      original: "É bom para sua saúde. / importante / ótimo",
      options: [
        { label: "bom", replacement: "It's good for your health.", pt: "É bom para sua saúde." },
        { label: "importante", replacement: "It's important for your health.", pt: "É importante para sua saúde." },
        { label: "ótimo", replacement: "It's great for your health.", pt: "É ótimo para sua saúde." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-12",
      original: "Nós estamos em casa. / no shopping / na praia",
      options: [
        { label: "casa", replacement: "We are at home.", pt: "Nós estamos em casa." },
        { label: "shopping", replacement: "We are at the mall.", pt: "Nós estamos no shopping." },
        { label: "praia", replacement: "We are at the beach.", pt: "Nós estamos na praia." },
      ],
      currentIndex: 0,
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            🏥 Lesson 37 - Health, Feelings & Professions
          </h1>
          <SpeakSentence text="Learn to talk about health issues, medical professions, feelings, and making appointments." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            👨‍⚕️🤒💊 Learn to talk about health issues, medical professions, feelings, and making appointments.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Health and medical care"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Section 1 - VERBS (Contracted forms of to be) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS (to be - contracted forms)</h2>
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
              {verbs.map((verb, index) => (
                <li key={index}>
                  <SpeakText text={verb.english} className="text-blue-600 font-bold">
                    {verb.english}
                  </SpeakText> = {verb.portuguese}
                </li>
              ))}
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

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <SpeakText text={word.english} className="text-green-600 font-bold">
                    {word.english}
                  </SpeakText> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Section 3 - Speak Like a Native with Static Phrases + Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <SpeakSentence text="Practice common phrases to talk about health and medical situations" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about health and medical situations (Includes Past Tense Action Verbs)
            </SpeakSentence>
            
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {staticUsefulPhrases.map((phrase, index) => (
                <li key={index}>
                  <SpeakText text={phrase.english} className="text-yellow-600 font-bold">
                    {phrase.english}
                  </SpeakText> = {phrase.portuguese}
                </li>
              ))}
            </ul>

            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Section 4 - GRAMMAR with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <SpeakSentence text="Complete structures with the verb to be in affirmative sentences" className="text-md text-gray-600 mb-4 italic">
              📚 Complete structures with the verb to be in affirmative sentences
            </SpeakSentence>
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index}>
                  <SpeakSentence text={example.english} className="text-purple-600 font-bold">
                    {example.english}
                  </SpeakSentence>
                  <p className="text-sm text-gray-600">= {example.portuguese}</p>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
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

        {/* Section 5 - Make It Yours */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100 text-right">
              Verb to be in the PAST | Other verbs in the PRESENT
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <SpeakSentence text={sentence.english} className="text-lg font-medium">
                        {index + 1}. {sentence.jsx}
                      </SpeakSentence>
                      <p className="text-sm text-gray-600 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={doctorImage}
                        alt="Doctor and patient"
                        className="rounded-xl object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Medical consultation
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={sickImage}
                        alt="Sick person"
                        className="rounded-xl object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Feeling sick at home
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - WRAP UP */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">
              Get well soon, Bless you, This/These, That/Those, Contractions, and Asking about symptoms
            </p>
          </div>
          
          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson38")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* Note Modal */}
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