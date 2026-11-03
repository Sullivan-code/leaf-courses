"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'wrapUp';

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
        const speechText = text;
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
      className="ml-3 text-white/70 hover:text-white transition-colors focus:outline-none"
      aria-label="Fazer anotações"
      title="Clique para fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// Wrap Up Component - Ordinal Numbers
function WrapUp() {
  const ordinalNumbers = [
    { number: "1st", english: "first", portuguese: "primeiro" },
    { number: "2nd", english: "second", portuguese: "segundo" },
    { number: "3rd", english: "third", portuguese: "terceiro" },
    { number: "4th", english: "fourth", portuguese: "quarto" },
    { number: "5th", english: "fifth", portuguese: "quinto" },
    { number: "6th", english: "sixth", portuguese: "sexto" },
    { number: "7th", english: "seventh", portuguese: "sétimo" },
    { number: "8th", english: "eighth", portuguese: "oitavo" },
    { number: "9th", english: "ninth", portuguese: "nono" },
    { number: "10th", english: "tenth", portuguese: "décimo" },
    { number: "11th", english: "eleventh", portuguese: "décimo primeiro" },
    { number: "12th", english: "twelfth", portuguese: "décimo segundo" },
    { number: "13th", english: "thirteenth", portuguese: "décimo terceiro" },
    { number: "14th", english: "fourteenth", portuguese: "décimo quarto" },
    { number: "15th", english: "fifteenth", portuguese: "décimo quinto" },
  ];

  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
        <h3 className="font-bold text-xl">🔢 ORDINAL NUMBERS - 1st to 15th</h3>
        <p className="text-blue-100 text-sm mt-1">Números ordinais em inglês do 1º ao 15º</p>
      </div>
      
      <div className="bg-white p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {ordinalNumbers.map((ordinal) => (
            <div key={ordinal.number} className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200 hover:shadow-md transition-all">
              <p className="text-2xl font-bold text-blue-600">{ordinal.number}</p>
              <SpeakText text={ordinal.english} className="text-lg font-medium text-blue-700 mt-1 hover:text-blue-900 block w-full justify-center">
                {ordinal.english}
              </SpeakText>
              <p className="text-sm text-blue-500">{ordinal.portuguese}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">🎯 Examples in context:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <SpeakSentence text="This is my first time at the dentist" className="text-gray-800">
                "This is my <span className="font-bold text-blue-600">first</span> time at the dentist."
              </SpeakSentence>
              <p className="text-sm text-gray-500">É minha primeira vez no dentista.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <SpeakSentence text="He is in second place" className="text-gray-800">
                "He is in <span className="font-bold text-blue-600">second</span> place."
              </SpeakSentence>
              <p className="text-sm text-gray-500">Ele está em segundo lugar.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <SpeakSentence text="This is the third time I take this medicine" className="text-gray-800">
                "This is the <span className="font-bold text-blue-600">third</span> time I take this medicine."
              </SpeakSentence>
              <p className="text-sm text-gray-500">Esta é a terceira vez que tomo este remédio.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <SpeakSentence text="She lives on the fifth floor" className="text-gray-800">
                "She lives on the <span className="font-bold text-blue-600">fifth</span> floor."
              </SpeakSentence>
              <p className="text-sm text-gray-500">Ela mora no quinto andar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson39HealthFeelingsProfessions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
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

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const sickImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const professionsImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 39 - Verbs (to be) - Extended
  const verbs = [
    { english: "I'm not", portuguese: "eu não sou / estou" },
    { english: "you aren't", portuguese: "você não é / está" },
    { english: "you aren't", portuguese: "vocês não são / estão (plural)" },
    { english: "he isn't", portuguese: "ele não é / está" },
    { english: "she isn't", portuguese: "ela não é / está" },
    { english: "it isn't", portuguese: "ele/ela não é / está" },
    { english: "we aren't", portuguese: "nós não somos / estamos" },
    { english: "they aren't", portuguese: "eles/elas não são / estão" }
  ];

  // Lesson 39 - New Words
  const newWords = [
    { english: "student", portuguese: "estudante" },
    { english: "manager", portuguese: "gerente" },
    { english: "sales clerk", portuguese: "vendedor" },
    { english: "lawyer", portuguese: "advogado" },
    { english: "engineer", portuguese: "engenheiro" },
    { english: "designer", portuguese: "projetista" },
    { english: "hungry", portuguese: "com fome" },
    { english: "thirsty", portuguese: "com sede" },
    { english: "tired", portuguese: "cansado" },
    { english: "sad", portuguese: "triste" },
    { english: "upset", portuguese: "chateado" },
    { english: "worried", portuguese: "preocupado" },
    { english: "happy", portuguese: "feliz" },
    { english: "smart", portuguese: "inteligente" },
    { english: "pretty", portuguese: "bonito(a)" },
    { english: "healthy", portuguese: "saudável" },
    { english: "busy", portuguese: "ocupado" },
    { english: "very", portuguese: "muito" },
    { english: "sick", portuguese: "doente" },
    { english: "headache", portuguese: "dor de cabeça" },
    { english: "stomachache", portuguese: "dor de estômago" },
    { english: "toothache", portuguese: "dor de dente" },
  ];

  const grammarExamples = [
    { english: "I'm not hungry now.", portuguese: "Eu não estou com fome agora." },
    { english: "You are not very far from here.", portuguese: "Você não está muito longe daqui." },
    { english: "He is not busy this week.", portuguese: "Ele não está ocupado esta semana." },
    { english: "She is not tired today.", portuguese: "Ela não está cansada hoje." },
    { english: "It is not late to go there.", portuguese: "Não é tarde para ir lá." },
    { english: "We are not lawyers, we're managers.", portuguese: "Nós não somos advogados, somos gerentes." },
    { english: "They are not upset.", portuguese: "Eles não estão chateados." },
  ];

  // Make It Yours - to be in Past | other verbs in Present (Updated with Blue Keywords)
  const realLifeSentences = [
    {
      english: "I wasn't a designer.",
      portuguese: "Eu não era projetista.",
      jsx: <>I <span className="text-blue-600 font-bold">wasn't</span> a <span className="text-blue-600 font-bold">designer</span>.</>
    },
    {
      english: "They are not at school now.",
      portuguese: "Eles não estão na escola agora.",
      jsx: <>They <span className="text-blue-600 font-bold">are not</span> at <span className="text-blue-600 font-bold">school</span> now.</>
    },
    {
      english: "You weren't late for class.",
      portuguese: "Você não estava atrasado para a aula.",
      jsx: <>You <span className="text-blue-600 font-bold">weren't</span> <span className="text-blue-600 font-bold">late</span> for class.</>
    },
    {
      english: "She is not at home.",
      portuguese: "Ela não está em casa.",
      jsx: <>She <span className="text-blue-600 font-bold">is not</span> at <span className="text-blue-600 font-bold">home</span>.</>
    },
    {
      english: "We weren't at church yesterday, we were at the park.",
      portuguese: "Nós não estávamos na igreja ontem, estávamos no parque.",
      jsx: <>We <span className="text-blue-600 font-bold">weren't</span> at church yesterday, we <span className="text-blue-600 font-bold">were</span> at the <span className="text-blue-600 font-bold">park</span>.</>
    },
    {
      english: "It is not an interesting story.",
      portuguese: "Não é uma história interessante.",
      jsx: <>It <span className="text-blue-600 font-bold">is not</span> an <span className="text-blue-600 font-bold">interesting</span> story.</>
    },
    {
      english: "We are not very tired.",
      portuguese: "Nós não estamos muito cansados.",
      jsx: <>We <span className="text-blue-600 font-bold">are not</span> very <span className="text-blue-600 font-bold">tired</span>.</>
    },
    {
      english: "They aren't engineers.",
      portuguese: "Eles não são engenheiros.",
      jsx: <>They <span className="text-blue-600 font-bold">aren't</span> <span className="text-blue-600 font-bold">engineers</span>.</>
    },
    {
      english: "The exam wasn't very hard.",
      portuguese: "A prova não era muito difícil.",
      jsx: <>The exam <span className="text-blue-600 font-bold">wasn't</span> very <span className="text-blue-600 font-bold">hard</span>.</>
    },
    {
      english: "I think French fries are not healthy.",
      portuguese: "Eu acho que batatas fritas não são saudáveis.",
      jsx: <>I think French fries <span className="text-blue-600 font-bold">are not</span> <span className="text-blue-600 font-bold">healthy</span>.</>
    },
    {
      english: "They were not sad, they were happy.",
      portuguese: "Eles não estavam tristes, estavam felizes.",
      jsx: <>They <span className="text-blue-600 font-bold">were not</span> <span className="text-blue-600 font-bold">sad</span>, they <span className="text-blue-600 font-bold">were</span> <span className="text-blue-600 font-bold">happy</span>.</>
    },
    {
      english: "These are not her shoes.",
      portuguese: "Estes não são os sapatos dela.",
      jsx: <>These <span className="text-blue-600 font-bold">are not</span> her <span className="text-blue-600 font-bold">shoes</span>.</>
    },
    {
      english: "He is not a doctor, he is a nurse.",
      portuguese: "Ele não é médico, é enfermeiro.",
      jsx: <>He <span className="text-blue-600 font-bold">is not</span> a <span className="text-blue-600 font-bold">doctor</span>, he <span className="text-blue-600 font-bold">is</span> a <span className="text-blue-600 font-bold">nurse</span>.</>
    },
    {
      english: "She was not a teacher, she was a lawyer.",
      portuguese: "Ela não era professora, era advogada.",
      jsx: <>She <span className="text-blue-600 font-bold">was not</span> a <span className="text-blue-600 font-bold">teacher</span>, she <span className="text-blue-600 font-bold">was</span> a <span className="text-blue-600 font-bold">lawyer</span>.</>
    },
    {
      english: "I am not hungry, I am thirsty.",
      portuguese: "Eu não estou com fome, estou com sede.",
      jsx: <>I <span className="text-blue-600 font-bold">am not</span> <span className="text-blue-600 font-bold">hungry</span>, I <span className="text-blue-600 font-bold">am</span> <span className="text-blue-600 font-bold">thirsty</span>.</>
    },
    {
      english: "They aren't at home, they are at work.",
      portuguese: "Eles não estão em casa, estão no trabalho.",
      jsx: <>They <span className="text-blue-600 font-bold">aren't</span> at home, they <span className="text-blue-600 font-bold">are</span> at <span className="text-blue-600 font-bold">work</span>.</>
    },
  ];

  // ==========================================
  // SUBSTITUTION DRILLS DATA (IMAGES MAPPED)
  // ==========================================

  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu sou médico. / não sou / dentista",
      options: [
        { label: "Eu sou", replacement: "I am a doctor.", pt: "Eu sou médico." },
        { label: "Eu não sou", replacement: "I am not a doctor.", pt: "Eu não sou médico." },
        { label: "dentista", replacement: "I am not a dentist.", pt: "Eu não sou dentista." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu estou no Brasil. / não estou / na Itália",
      options: [
        { label: "Brasil", replacement: "I am in Brazil.", pt: "Eu estou no Brasil." },
        { label: "não estou", replacement: "I am not in Brazil.", pt: "Eu não estou no Brasil." },
        { label: "Itália", replacement: "I am not in Italy.", pt: "Eu não estou na Itália." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você não está doente. / Ele / Ela",
      options: [
        { label: "Você", replacement: "You are not sick.", pt: "Você não está doente." },
        { label: "Ele", replacement: "He is not sick.", pt: "Ele não está doente." },
        { label: "Ela", replacement: "She is not sick.", pt: "Ela não está doente." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ele não é dentista. / professor / enfermeiro",
      options: [
        { label: "dentista", replacement: "He is not a dentist.", pt: "Ele não é dentista." },
        { label: "professor", replacement: "He is not a teacher.", pt: "Ele não é professor." },
        { label: "enfermeiro", replacement: "He is not a nurse.", pt: "Ele não é enfermeiro." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Ela não está aqui. / lá / na escola",
      options: [
        { label: "aqui", replacement: "She is not here.", pt: "Ela não está aqui." },
        { label: "lá", replacement: "She is not there.", pt: "Ela não está lá." },
        { label: "na escola", replacement: "She is not at school.", pt: "Ela não está na escola." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Não é fácil. / difícil / chato",
      options: [
        { label: "fácil", replacement: "It is not easy.", pt: "Não é fácil." },
        { label: "difícil", replacement: "It is not difficult.", pt: "Não é difícil." },
        { label: "chato", replacement: "It is not boring.", pt: "Não é chato." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Nós não estamos atrasados. / Eles não estão / Vocês não estão",
      options: [
        { label: "Nós", replacement: "We are not late.", pt: "Nós não estamos atrasados." },
        { label: "Eles", replacement: "They are not late.", pt: "Eles não estão atrasados." },
        { label: "Vocês", replacement: "You are not late.", pt: "Vocês não estão atrasados." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eles não são meus primos. / parentes / vizinhos",
      options: [
        { label: "primos", replacement: "They are not my cousins.", pt: "Eles não são meus primos." },
        { label: "parentes", replacement: "They are not my relatives.", pt: "Eles não são meus parentes." },
        { label: "vizinhos", replacement: "They are not my neighbors.", pt: "Eles não são meus vizinhos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "Elas não estão em casa. / no cinema / na estação de trem",
      options: [
        { label: "em casa", replacement: "They are not at home.", pt: "Elas não estão em casa." },
        { label: "no cinema", replacement: "They are not at the movies.", pt: "Elas não estão no cinema." },
        { label: "na estação", replacement: "They are not at the train station.", pt: "Elas não estão na estação de trem." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "Meu irmão é advogado. / estudante / vendedor",
      options: [
        { label: "advogado", replacement: "My brother is a lawyer.", pt: "Meu irmão é advogado." },
        { label: "estudante", replacement: "My brother is a student.", pt: "Meu irmão é estudante." },
        { label: "vendedor", replacement: "My brother is a sales clerk.", pt: "Meu irmão é vendedor." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-11",
      original: "Ela não é projetista. / gerente / enfermeira",
      options: [
        { label: "projetista", replacement: "She is not a designer.", pt: "Ela não é projetista." },
        { label: "gerente", replacement: "She is not a manager.", pt: "Ela não é gerente." },
        { label: "enfermeira", replacement: "She is not a nurse.", pt: "Ela não é enfermeira." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-12",
      original: "He is an engineer. / Ela é engenheira / Eu sou engenheiro",
      options: [
        { label: "Ele", replacement: "He is an engineer.", pt: "Ele é engenheiro." },
        { label: "Ela", replacement: "She is an engineer.", pt: "Ela é engenheira." },
        { label: "Eu", replacement: "I am an engineer.", pt: "Eu sou engenheiro." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-13",
      original: "Nós estamos cansados. / ocupados / chateados",
      options: [
        { label: "cansados", replacement: "We are tired.", pt: "Nós estamos cansados." },
        { label: "ocupados", replacement: "We are busy.", pt: "Nós estamos ocupados." },
        { label: "chateados", replacement: "We are upset.", pt: "Nós estamos chateados." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-14",
      original: "Ele não está triste. / preocupado / ocupado",
      options: [
        { label: "triste", replacement: "He is not sad.", pt: "Ele não está triste." },
        { label: "preocupado", replacement: "He is not worried.", pt: "Ele não está preocupado." },
        { label: "ocupado", replacement: "He is not busy.", pt: "Ele não está ocupado." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-15",
      original: "Seus filhos são bonitos. / espertos / gentis",
      options: [
        { label: "bonitos", replacement: "Your children are pretty.", pt: "Seus filhos são bonitos." },
        { label: "espertos", replacement: "Your children are smart.", pt: "Seus filhos são espertos." },
        { label: "gentis", replacement: "Your children are kind.", pt: "Seus filhos são gentis." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-16",
      original: "We are very happy. / Nós estamos muito cansados / ocupados",
      options: [
        { label: "felizes", replacement: "We are very happy.", pt: "Nós estamos muito felizes." },
        { label: "cansados", replacement: "We are very tired.", pt: "Nós estamos muito cansados." },
        { label: "ocupados", replacement: "We are very busy.", pt: "Nós estamos muito ocupados." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-17",
      original: "Eu estou com fome. / Ela está / Nós estamos",
      options: [
        { label: "Eu", replacement: "I am hungry.", pt: "Eu estou com fome." },
        { label: "Ela", replacement: "She is hungry.", pt: "Ela está com fome." },
        { label: "Nós", replacement: "We are hungry.", pt: "Nós estamos com fome." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-18",
      original: "Eu não estou com sede. / Ele não está / Eles não estão",
      options: [
        { label: "Eu", replacement: "I am not thirsty.", pt: "Eu não estou com sede." },
        { label: "Ele", replacement: "He is not thirsty.", pt: "Ele não está com sede." },
        { label: "Eles", replacement: "They are not thirsty.", pt: "Eles não estão com sede." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-19",
      original: "Eu conheço aqueles alunos. / vendedores / advogados",
      options: [
        { label: "alunos", replacement: "I know those students.", pt: "Eu conheço aqueles alunos." },
        { label: "vendedores", replacement: "I know those sales clerks.", pt: "Eu conheço aqueles vendedores." },
        { label: "advogados", replacement: "I know those lawyers.", pt: "Eu conheço aqueles advogados." },
      ],
      currentIndex: 0,
    },
  ];

  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu sou estudante. / gerente / advogado",
      options: [
        { label: "estudante", replacement: "I am a student.", pt: "Eu sou estudante." },
        { label: "gerente", replacement: "I am a manager.", pt: "Eu sou gerente." },
        { label: "advogado", replacement: "I am a lawyer.", pt: "Eu sou advogado." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Ela está com fome. / com sede / cansada",
      options: [
        { label: "com fome", replacement: "She is hungry.", pt: "Ela está com fome." },
        { label: "com sede", replacement: "She is thirsty.", pt: "Ela está com sede." },
        { label: "cansada", replacement: "She is tired.", pt: "Ela está cansada." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Ele não está triste. / preocupado / chateado",
      options: [
        { label: "triste", replacement: "He is not sad.", pt: "Ele não está triste." },
        { label: "preocupado", replacement: "He is not worried.", pt: "Ele não está preocupado." },
        { label: "chateado", replacement: "He is not upset.", pt: "Ele não está chateado." },
      ],
      currentIndex: 0,
    },
  ];

  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "O que você faz? / Ele / Ela",
      options: [
        { label: "você", replacement: "What do you do?", pt: "O que você faz?" },
        { label: "Ele", replacement: "What does he do?", pt: "O que ele faz?" },
        { label: "Ela", replacement: "What does she do?", pt: "O que ela faz?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu tenho certeza! / Ela tem certeza / Nós temos certeza",
      options: [
        { label: "Eu", replacement: "I'm sure!", pt: "Eu tenho certeza!" },
        { label: "Ela", replacement: "She's sure!", pt: "Ela tem certeza!" },
        { label: "Nós", replacement: "We're sure!", pt: "Nós temos certeza!" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu estou preocupado com a prova. / com o projeto / com os relatórios",
      options: [
        { label: "prova", replacement: "I'm worried about the exam.", pt: "Eu estou preocupado com a prova." },
        { label: "projeto", replacement: "I'm worried about the project.", pt: "Eu estou preocupado com o projeto." },
        { label: "relatórios", replacement: "I'm worried about the reports.", pt: "Eu estou preocupado com os relatórios." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu estou preocupado com meu amigo. / com meu colega / com você",
      options: [
        { label: "amigo", replacement: "I'm worried about my friend.", pt: "Eu estou preocupado com meu amigo." },
        { label: "colega", replacement: "I'm worried about my classmate.", pt: "Eu estou preocupado com meu colega." },
        { label: "você", replacement: "I'm worried about you.", pt: "Eu estou preocupado com você." },
      ],
      currentIndex: 0,
    },
    // Passado com "DO" - Exercício 1
    {
      key: "phrase-5-past",
      original: "Você fez sua lição de casa ontem? / Ele / Ela",
      options: [
        { label: "Você", replacement: "Did you do your homework yesterday?", pt: "Você fez sua lição de casa ontem?" },
        { label: "Ele", replacement: "Did he do his homework yesterday?", pt: "Ele fez a lição de casa dele ontem?" },
        { label: "Ela", replacement: "Did she do her homework yesterday?", pt: "Ela fez a lição de casa dela ontem?" },
      ],
      currentIndex: 0,
    },
    // Passado com "DO" - Exercício 2
    {
      key: "phrase-6-past",
      original: "Eu não fiz o projeto na semana passada. / Ela / Nós",
      options: [
        { label: "Eu", replacement: "I didn't do the project last week.", pt: "Eu não fiz o projeto na semana passada." },
        { label: "Ela", replacement: "She didn't do the project last week.", pt: "Ela não fez o projeto na semana passada." },
        { label: "Nós", replacement: "We didn't do the project last week.", pt: "Nós não fizemos o projeto na semana passada." },
      ],
      currentIndex: 0,
    },
    // Passado com "DO" - Exercício 3
    {
      key: "phrase-7-past",
      original: "Eles fizeram os exercícios ontem? / Vocês / Nós",
      options: [
        { label: "Eles", replacement: "Did they do the exercises yesterday?", pt: "Eles fizeram os exercícios ontem?" },
        { label: "Vocês", replacement: "Did you do the exercises yesterday?", pt: "Vocês fizeram os exercícios ontem?" },
        { label: "Nós", replacement: "Did we do the exercises yesterday?", pt: "Nós fizemos os exercícios ontem?" },
      ],
      currentIndex: 0,
    }
  ];

  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu não estou ocupado esta semana. / amanhã / na próxima semana",
      options: [
        { label: "esta semana", replacement: "I am not busy this week.", pt: "Eu não estou ocupado esta semana." },
        { label: "amanhã", replacement: "I am not busy tomorrow.", pt: "Eu não estou ocupado amanhã." },
        { label: "próxima semana", replacement: "I am not busy next week.", pt: "Eu não estou ocupado na próxima semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Ele não é meu irmão. / pai / avô",
      options: [
        { label: "irmão", replacement: "He is not my brother.", pt: "Ele não é meu irmão." },
        { label: "pai", replacement: "He is not my father.", pt: "Ele não é meu pai." },
        { label: "avô", replacement: "He is not my grandfather.", pt: "Ele não é meu avô." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Nós não estamos cansados. / tristes / preocupados",
      options: [
        { label: "cansados", replacement: "We are not tired.", pt: "Nós não estamos cansados." },
        { label: "tristes", replacement: "We are not sad.", pt: "Nós não estamos tristes." },
        { label: "preocupados", replacement: "We are not worried.", pt: "Nós não estamos preocupados." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Elas não estão chateadas. / com fome / com sede",
      options: [
        { label: "chateadas", replacement: "They are not upset.", pt: "Elas não estão chateadas." },
        { label: "com fome", replacement: "They are not hungry.", pt: "Elas não estão com fome." },
        { label: "com sede", replacement: "They are not thirsty.", pt: "Elas não estão com sede." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Não é muito saudável. / bom / interessante",
      options: [
        { label: "saudável", replacement: "It is not very healthy.", pt: "Não é muito saudável." },
        { label: "bom", replacement: "It is not very good.", pt: "Não é muito bom." },
        { label: "interessante", replacement: "It is not very interesting.", pt: "Não é muito interessante." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Minha irmã não é projetista. / gerente / vendedora",
      options: [
        { label: "projetista", replacement: "My sister is not a designer.", pt: "Minha irmã não é projetista." },
        { label: "gerente", replacement: "My sister is not a manager.", pt: "Minha irmã não é gerente." },
        { label: "vendedora", replacement: "My sister is not a sales clerk.", pt: "Minha irmã não é vendedora." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "O livro não é chato. / engraçado / ruim",
      options: [
        { label: "chato", replacement: "The book is not boring.", pt: "O livro não é chato." },
        { label: "engraçado", replacement: "The book is not funny.", pt: "O livro não é engraçado." },
        { label: "ruim", replacement: "The book is not bad.", pt: "O livro não é ruim." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Meu namorado não está doente. / Minha namorada / Meu marido",
      options: [
        { label: "namorado", replacement: "My boyfriend is not sick.", pt: "Meu namorado não está doente." },
        { label: "namorada", replacement: "My girlfriend is not sick.", pt: "Minha namorada não está doente." },
        { label: "marido", replacement: "My husband is not sick.", pt: "Meu marido não está doente." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Minha família não está na Alemanha. / na França / nos Estados Unidos",
      options: [
        { label: "Alemanha", replacement: "My family is not in Germany.", pt: "Minha família não está na Alemanha." },
        { label: "França", replacement: "My family is not in France.", pt: "Minha família não está na França." },
        { label: "Estados Unidos", replacement: "My family is not in the United States.", pt: "Minha família não está nos Estados Unidos." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Nós achamos que ele está saudável. / feliz / cansado",
      options: [
        { label: "saudável", replacement: "We think he is healthy.", pt: "Nós achamos que ele está saudável." },
        { label: "feliz", replacement: "We think he is happy.", pt: "Nós achamos que ele está feliz." },
        { label: "cansado", replacement: "We think he is tired.", pt: "Nós achamos que ele está cansado." },
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
        
        {/* Instagram Video Embed */}
        <div className="mb-16 flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl border-2 border-blue-300 bg-white p-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  ES
                </div>
                <div>
                  <p className="font-semibold text-gray-800">English Shots</p>
                  <p className="text-xs text-gray-500">@englishshots</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">📱 Instagram</span>
            </div>
            <div className="relative w-full" style={{ minHeight: '600px' }}>
              <iframe 
                src="https://www.instagram.com/p/DZXugHKyL5I/embed" 
                className="absolute inset-0 w-full h-full rounded-lg" 
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                title="English Shots Instagram Video"
                style={{ minHeight: '600px' }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-3">
              🎬 Clique no vídeo para assistir a aula completa no Instagram
            </p>
          </div>
        </div>

        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🏥 Lesson 39 - Health, Feelings & Professions
          </h1>
          <SpeakSentence text="Learn to talk about health issues, feelings, professions, and use the verb to be in negative and affirmative forms." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            👨‍⚕️🤒💊 Learn to talk about health issues, feelings, professions, and use the verb "to be" in negative and affirmative forms.
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

        {/* Section 1 - VERBS (to be) with Drill */}
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <SpeakSentence text="Click on each word to hear its correct pronunciation" className="text-md text-gray-600 mb-4 italic">
              🎧 Click on each word to hear its correct pronunciation
            </SpeakSentence>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <SpeakText text={word.english} className="text-blue-600 font-bold">
                    {word.english}
                  </SpeakText> = {word.portuguese}
                </li>
              ))}
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

        {/* Section 3 - Speak Like a Native (Useful Phrases) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <SpeakSentence text="Practice common phrases and past tense questions" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases and past tense questions with "Do"
            </SpeakSentence>
            
            {/* Lista fixa com as frases exatas da imagem */}
            <ul className="list-disc pl-6 text-gray-600 space-y-3 mb-6">
              <li>
                <SpeakText text="What do you do?" className="text-blue-600 font-bold">
                  What do you do?
                </SpeakText> — O que você faz?
              </li>
              <li>
                <SpeakText text="I'm sure!" className="text-blue-600 font-bold">
                  I'm sure!
                </SpeakText> — Eu tenho certeza!
              </li>
              <li>
                <SpeakText text="I'm worried about the exam." className="text-blue-600 font-bold">
                  I'm worried about the exam.
                </SpeakText> — Eu estou preocupado com a prova.
              </li>
            </ul>

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

        {/* Section 4 - GRAMMAR (Negative Form) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Negative Form)</h2>
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
            <SpeakSentence text="Complete structures with the verb to be in negative sentences" className="text-md text-gray-600 mb-4 italic">
              📚 Complete structures with the verb to be in negative sentences
            </SpeakSentence>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.slice(0, 5).map((example, index) => (
                <div key={index}>
                  <SpeakSentence text={example.english} className="text-blue-600 font-bold">
                    {example.english}
                  </SpeakSentence>
                  <p className="text-sm text-gray-600">= {example.portuguese}</p>
                </div>
              ))}
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

        {/* Section 5 - Make It Yours (Real Life) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Verb to be in the PAST | Other verbs in the PRESENT
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
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
                        src={professionsImage}
                        alt="Professions"
                        className="rounded-xl object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Different professions
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
                      Feeling sick
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - WRAP UP (Ordinal Numbers) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">
              Ordinal Numbers - 1st to 15th
            </p>
          </div>
          
          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson38")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson40")}
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