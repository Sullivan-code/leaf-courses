"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff } from "lucide-react";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

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

export default function Lesson41HealthFeelingsProfessions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkItOut: false,
  });
  const [showCheckItOutExplanation, setShowCheckItOutExplanation] = useState(false);
  
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
  const mainImage = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const birthdayImage = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const shoppingImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 41 - Verbs (to be - questions)
  const verbs = [
    { english: "Am I?", portuguese: "Eu sou / estou?" },
    { english: "Are you?", portuguese: "Você é / está?" },
    { english: "Is he?", portuguese: "Ele é / está?" },
    { english: "Is she?", portuguese: "Ela é / está?" },
    { english: "Is it?", portuguese: "Ele/ela (coisa) é / está?" },
    { english: "Are we?", portuguese: "Nós somos / estamos?" },
    { english: "Are you? (plural)", portuguese: "Vocês são / estão?" },
    { english: "Are they?", portuguese: "Eles são / estão?" },
    { english: "I am / I'm", portuguese: "Eu sou / estou" },
    { english: "I am not", portuguese: "Eu não sou / estou" },
    { english: "You are / You're", portuguese: "Você é / está" },
    { english: "You are not / You aren't", portuguese: "Você não é / está" },
  ];

  // Months of the Year
  const months = [
    { english: "January", portuguese: "janeiro" },
    { english: "February", portuguese: "fevereiro" },
    { english: "March", portuguese: "março" },
    { english: "April", portuguese: "abril" },
    { english: "May", portuguese: "maio" },
    { english: "June", portuguese: "junho" },
    { english: "July", portuguese: "julho" },
    { english: "August", portuguese: "agosto" },
    { english: "September", portuguese: "setembro" },
    { english: "October", portuguese: "outubro" },
    { english: "November", portuguese: "novembro" },
    { english: "December", portuguese: "dezembro" },
  ];

  // New Words
  const newWords = [
    { english: "birthday", portuguese: "aniversário" },
    { english: "young", portuguese: "jovem" },
    { english: "ready", portuguese: "pronto(a)" },
    { english: "who", portuguese: "quem" },
    { english: "old", portuguese: "velho" },
    { english: "important", portuguese: "importante" },
    { english: "late", portuguese: "atrasado" },
    { english: "early", portuguese: "cedo" },
    { english: "vacation / holidays", portuguese: "férias" },
    { english: "beach", portuguese: "praia" },
    { english: "downtown", portuguese: "centro da cidade" },
    { english: "station", portuguese: "estação" },
    { english: "pharmacy", portuguese: "farmácia" },
    { english: "bank", portuguese: "banco" },
    { english: "shopping mall", portuguese: "shopping" },
    { english: "office", portuguese: "escritório" },
    { english: "store / shop", portuguese: "loja" },
    { english: "near", portuguese: "perto" },
    { english: "far", portuguese: "longe" },
  ];

  const usefulPhrases = [
    { english: "How old are you?", portuguese: "Quantos anos você tem?" },
    { english: "I'm 20 years old.", portuguese: "Eu tenho 20 anos" },
    { english: "When is your birthday?", portuguese: "Quando é seu aniversário?" },
    { english: "It's in May.", portuguese: "É em maio" },
    { english: "My birthday is on June 1st.", portuguese: "Meu aniversário é dia primeiro de junho" },
    { english: "I usually go to the beach in February.", portuguese: "Eu geralmente vou à praia em fevereiro" },
    { english: "We don't go to school in July.", portuguese: "Nós não vamos para a escola em julho" },
    { english: "His birthday is tomorrow.", portuguese: "O aniversário dele é amanhã" },
  ];

  const grammarExamples = [
    { english: "Are you ready?", portuguese: "Você está pronto?" },
    { english: "Is she Brazilian?", portuguese: "Ela é brasileira?" },
    { english: "Are they at the office?", portuguese: "Eles estão no escritório?" },
    { english: "Is your father a manager?", portuguese: "Seu pai é gerente?" },
    { english: "Is the movie bad?", portuguese: "O filme é ruim?" },
    { english: "Are the students there?", portuguese: "Os alunos estão lá?" },
    { english: "Who is he?", portuguese: "Quem é ele?" },
    { english: "Who are you?", portuguese: "Quem é você?" },
    { english: "Who are those people?", portuguese: "Quem são aquelas pessoas?" },
    { english: "Is it near here?", portuguese: "É perto daqui?" },
    { english: "Is the backpack expensive?", portuguese: "A mochila é cara?" },
    { english: "Are they funny?", portuguese: "Eles são engraçados?" },
    { english: "Is she at home?", portuguese: "Ela está em casa?" },
    { english: "Are we late?", portuguese: "Nós estamos atrasados?" },
  ];

  // Make It Yours Sentences (Todas no Presente e com Palavras Chaves Destacadas)
  const realLifeSentences = [
    {
      english: "Am I late?",
      portuguese: "Eu estou atrasado?",
      jsx: <> <span className="text-blue-600 font-bold">Am</span> I <span className="text-blue-600 font-bold">late</span>? </>
    },
    {
      english: "Are you Brazilian?",
      portuguese: "Você é brasileiro?",
      jsx: <> <span className="text-blue-600 font-bold">Are</span> you <span className="text-blue-600 font-bold">Brazilian</span>? </>
    },
    {
      english: "Isn't he a student?",
      portuguese: "Ele não é estudante?",
      jsx: <> <span className="text-blue-600 font-bold">Isn't</span> he a <span className="text-blue-600 font-bold">student</span>? </>
    },
    {
      english: "Is she a sales clerk?",
      portuguese: "Ela é vendedora?",
      jsx: <> <span className="text-blue-600 font-bold">Is</span> she a <span className="text-blue-600 font-bold">sales clerk</span>? </>
    },
    {
      english: "Is it a good book?",
      portuguese: "É um bom livro?",
      jsx: <> <span className="text-blue-600 font-bold">Is</span> it a <span className="text-blue-600 font-bold">good book</span>? </>
    },
    {
      english: "Are we ready to start?",
      portuguese: "Estamos prontos para começar?",
      jsx: <> <span className="text-blue-600 font-bold">Are</span> we <span className="text-blue-600 font-bold">ready</span> to start? </>
    },
    {
      english: "Are they with you?",
      portuguese: "Eles estão com você?",
      jsx: <> <span className="text-blue-600 font-bold">Are</span> they <span className="text-blue-600 font-bold">with you</span>? </>
    },
    {
      english: "Who are you?",
      portuguese: "Quem é você?",
      jsx: <> <span className="text-blue-600 font-bold">Who are</span> you? </>
    },
    {
      english: "Who is he?",
      portuguese: "Quem é ele?",
      jsx: <> <span className="text-blue-600 font-bold">Who is</span> he? </>
    },
    {
      english: "Who are those people?",
      portuguese: "Quem são aquelas pessoas?",
      jsx: <> <span className="text-blue-600 font-bold">Who are</span> those <span className="text-blue-600 font-bold">people</span>? </>
    },
    {
      english: "How old is she?",
      portuguese: "Quantos anos ela tem?",
      jsx: <> <span className="text-blue-600 font-bold">How old is</span> she? </>
    },
    {
      english: "She's ten years old.",
      portuguese: "Ela tem 10 anos",
      jsx: <> She's <span className="text-blue-600 font-bold">ten years old</span>. </>
    },
    {
      english: "When is your birthday?",
      portuguese: "Quando é seu aniversário?",
      jsx: <> <span className="text-blue-600 font-bold">When is</span> your <span className="text-blue-600 font-bold">birthday</span>? </>
    },
    {
      english: "It's in April.",
      portuguese: "É em abril",
      jsx: <> It's in <span className="text-blue-600 font-bold">April</span>. </>
    },
    {
      english: "Is your father a manager?",
      portuguese: "Seu pai é gerente?",
      jsx: <> <span className="text-blue-600 font-bold">Is</span> your father a <span className="text-blue-600 font-bold">manager</span>? </>
    },
    {
      english: "I go to the beach in January.",
      portuguese: "Eu vou à praia em janeiro.",
      jsx: <> I <span className="text-blue-600 font-bold">go</span> to the <span className="text-blue-600 font-bold">beach</span> in <span className="text-blue-600 font-bold">January</span>. </>
    },
    {
      english: "She is 25 years old.",
      portuguese: "Ela tem 25 anos.",
      jsx: <> She <span className="text-blue-600 font-bold">is</span> <span className="text-blue-600 font-bold">25 years old</span>. </>
    },
    {
      english: "They start the course in March.",
      portuguese: "Eles começam o curso em março.",
      jsx: <> They <span className="text-blue-600 font-bold">start</span> the <span className="text-blue-600 font-bold">course</span> in <span className="text-blue-600 font-bold">March</span>. </>
    },
    {
      english: "Are you at the office today?",
      portuguese: "Você está no escritório hoje?",
      jsx: <> <span className="text-blue-600 font-bold">Are</span> you at the <span className="text-blue-600 font-bold">office</span> today? </>
    },
    {
      english: "He arrives at 8 o'clock.",
      portuguese: "Ele chega às 8 horas.",
      jsx: <> He <span className="text-blue-600 font-bold">arrives</span> at <span className="text-blue-600 font-bold">8 o'clock</span>. </>
    },
    {
      english: "We have a meeting on Friday.",
      portuguese: "Nós temos uma reunião na sexta-feira.",
      jsx: <> We <span className="text-blue-600 font-bold">have</span> a <span className="text-blue-600 font-bold">meeting</span> on <span className="text-blue-600 font-bold">Friday</span>. </>
    },
    {
      english: "I am not late for the meeting.",
      portuguese: "Eu não estou atrasado para a reunião.",
      jsx: <> I <span className="text-blue-600 font-bold">am not</span> <span className="text-blue-600 font-bold">late</span> for the <span className="text-blue-600 font-bold">meeting</span>. </>
    },
    {
      english: "She doesn't go to the pharmacy today.",
      portuguese: "Ela não vai à farmácia hoje.",
      jsx: <> She <span className="text-blue-600 font-bold">doesn't go</span> to the <span className="text-blue-600 font-bold">pharmacy</span> today. </>
    },
    {
      english: "They aren't at the bank today.",
      portuguese: "Eles não estão no banco hoje.",
      jsx: <> They <span className="text-blue-600 font-bold">aren't</span> at the <span className="text-blue-600 font-bold">bank</span> today. </>
    },
    {
      english: "He doesn't work in December.",
      portuguese: "Ele não trabalha em dezembro.",
      jsx: <> He <span className="text-blue-600 font-bold">doesn't work</span> in <span className="text-blue-600 font-bold">December</span>. </>
    },
    {
      english: "We don't have class today.",
      portuguese: "Nós não temos aula hoje.",
      jsx: <> We <span className="text-blue-600 font-bold">don't have</span> <span className="text-blue-600 font-bold">class</span> today. </>
    },
    {
      english: "You don't need to bring anything.",
      portuguese: "Você não precisa trazer nada.",
      jsx: <> You <span className="text-blue-600 font-bold">don't need</span> to <span className="text-blue-600 font-bold">bring</span> anything. </>
    },
    {
      english: "Do you go to the beach in February?",
      portuguese: "Você vai à praia em fevereiro?",
      jsx: <> <span className="text-blue-600 font-bold">Do</span> you <span className="text-blue-600 font-bold">go</span> to the <span className="text-blue-600 font-bold">beach</span> in <span className="text-blue-600 font-bold">February</span>? </>
    },
    {
      english: "Does she visit the shopping mall?",
      portuguese: "Ela visita o shopping?",
      jsx: <> <span className="text-blue-600 font-bold">Does</span> she <span className="text-blue-600 font-bold">visit</span> the <span className="text-blue-600 font-bold">shopping mall</span>? </>
    },
    {
      english: "Do they study for the test?",
      portuguese: "Eles estudam para a prova?",
      jsx: <> <span className="text-blue-600 font-bold">Do</span> they <span className="text-blue-600 font-bold">study</span> for the <span className="text-blue-600 font-bold">test</span>? </>
    },
    {
      english: "Does your father work at the office?",
      portuguese: "Seu pai trabalha no escritório?",
      jsx: <> <span className="text-blue-600 font-bold">Does</span> your father <span className="text-blue-600 font-bold">work</span> at the <span className="text-blue-600 font-bold">office</span>? </>
    },
    {
      english: "Do you see the new store downtown?",
      portuguese: "Você vê a nova loja no centro?",
      jsx: <> <span className="text-blue-600 font-bold">Do</span> you <span className="text-blue-600 font-bold">see</span> the <span className="text-blue-600 font-bold">new store</span> downtown? </>
    },
    {
      english: "Do we miss the bus?",
      portuguese: "Nós perdemos o ônibus?",
      jsx: <> <span className="text-blue-600 font-bold">Do</span> we <span className="text-blue-600 font-bold">miss</span> the <span className="text-blue-600 font-bold">bus</span>? </>
    },
    {
      english: "Does he call you every day?",
      portuguese: "Ele te liga todos os dias?",
      jsx: <> <span className="text-blue-600 font-bold">Does</span> he <span className="text-blue-600 font-bold">call</span> you every day? </>
    },
    {
      english: "Does she buy the medicine at the pharmacy?",
      portuguese: "Ela compra o remédio na farmácia?",
      jsx: <> <span className="text-blue-600 font-bold">Does</span> she <span className="text-blue-600 font-bold">buy</span> the <span className="text-blue-600 font-bold">medicine</span> at the <span className="text-blue-600 font-bold">pharmacy</span>? </>
    },
  ];

  // Ordinal Numbers (16th to 31st)
  const ordinalNumbers = [
    { number: "16th", english: "sixteenth", portuguese: "décimo sexto" },
    { number: "17th", english: "seventeenth", portuguese: "décimo sétimo" },
    { number: "18th", english: "eighteenth", portuguese: "décimo oitavo" },
    { number: "19th", english: "nineteenth", portuguese: "décimo nono" },
    { number: "20th", english: "twentieth", portuguese: "vigésimo" },
    { number: "21st", english: "twenty-first", portuguese: "vigésimo primeiro" },
    { number: "22nd", english: "twenty-second", portuguese: "vigésimo segundo" },
    { number: "23rd", english: "twenty-third", portuguese: "vigésimo terceiro" },
    { number: "24th", english: "twenty-fourth", portuguese: "vigésimo quarto" },
    { number: "25th", english: "twenty-fifth", portuguese: "vigésimo quinto" },
    { number: "30th", english: "thirtieth", portuguese: "trigésimo" },
    { number: "31st", english: "thirty-first", portuguese: "trigésimo primeiro" },
  ];

  // ==========================================
  // SUBSTITUTION DRILLS DATA
  // ==========================================

  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu sou brasileiro? / americano? / britânico?",
      options: [
        { label: "brasileiro", replacement: "Am I Brazilian?", pt: "Eu sou brasileiro?" },
        { label: "americano", replacement: "Am I American?", pt: "Eu sou americano?" },
        { label: "britânico", replacement: "Am I British?", pt: "Eu sou britânico?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Você é estudante? / professor? / médico?",
      options: [
        { label: "estudante", replacement: "Are you a student?", pt: "Você é estudante?" },
        { label: "professor", replacement: "Are you a teacher?", pt: "Você é professor?" },
        { label: "médico", replacement: "Are you a doctor?", pt: "Você é médico?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Ele é seu irmão? / pai? / primo?",
      options: [
        { label: "irmão", replacement: "Is he your brother?", pt: "Ele é seu irmão?" },
        { label: "pai", replacement: "Is he your father?", pt: "Ele é seu pai?" },
        { label: "primo", replacement: "Is he your cousin?", pt: "Ele é seu primo?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "Ela é sua esposa? / colega de trabalho? / tia?",
      options: [
        { label: "esposa", replacement: "Is she your wife?", pt: "Ela é sua esposa?" },
        { label: "colega", replacement: "Is she your coworker?", pt: "Ela é sua colega de trabalho?" },
        { label: "tia", replacement: "Is she your aunt?", pt: "Ela é sua tia?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "É novo? / velho? / importante?",
      options: [
        { label: "novo", replacement: "Is it new?", pt: "É novo?" },
        { label: "velho", replacement: "Is it old?", pt: "É velho?" },
        { label: "importante", replacement: "Is it important?", pt: "É importante?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Nós estaremos atrasados? / Eles estarão? / Vocês estarão?",
      options: [
        { label: "Nós", replacement: "Will we be late?", pt: "Nós estaremos atrasados?" },
        { label: "Eles", replacement: "Will they be late?", pt: "Eles estarão atrasados?" },
        { label: "Vocês", replacement: "Will you be late?", pt: "Vocês estarão atrasados?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "Vocês estavam indo para o shopping? / banco? / farmácia?",
      options: [
        { label: "shopping", replacement: "Were you going to the shopping mall?", pt: "Vocês estavam indo para o shopping?" },
        { label: "banco", replacement: "Were you going to the bank?", pt: "Vocês estavam indo para o banco?" },
        { label: "farmácia", replacement: "Were you going to the pharmacy?", pt: "Vocês estavam indo para a farmácia?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eles estão aqui? / lá? / no centro da cidade?",
      options: [
        { label: "aqui", replacement: "Are they here?", pt: "Eles estão aqui?" },
        { label: "lá", replacement: "Are they there?", pt: "Eles estão lá?" },
        { label: "no centro", replacement: "Are they downtown?", pt: "Eles estão no centro da cidade?" },
      ],
      currentIndex: 0,
    },
  ];

  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "É janeiro. / fevereiro / março",
      options: [
        { label: "janeiro", replacement: "It is January.", pt: "É janeiro." },
        { label: "fevereiro", replacement: "It is February.", pt: "É fevereiro." },
        { label: "março", replacement: "It is March.", pt: "É março." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Meu aniversário é em abril. / maio / junho",
      options: [
        { label: "abril", replacement: "My birthday is in April.", pt: "Meu aniversário é em abril." },
        { label: "maio", replacement: "My birthday is in May.", pt: "Meu aniversário é em maio." },
        { label: "junho", replacement: "My birthday is in June.", pt: "Meu aniversário é em junho." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Minhas férias são em outubro. / agosto / setembro",
      options: [
        { label: "outubro", replacement: "My vacation is in October.", pt: "Minhas férias são em outubro." },
        { label: "agosto", replacement: "My vacation is in August.", pt: "Minhas férias são em agosto." },
        { label: "setembro", replacement: "My vacation is in September.", pt: "Minhas férias são em setembro." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Nós não vamos para a escola em julho. / dezembro / janeiro",
      options: [
        { label: "julho", replacement: "We don't go to school in July.", pt: "Nós não vamos para a escola em julho." },
        { label: "dezembro", replacement: "We don't go to school in December.", pt: "Nós não vamos para a escola em dezembro." },
        { label: "janeiro", replacement: "We don't go to school in January.", pt: "Nós não vamos para a escola em janeiro." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu geralmente vou à praia em fevereiro. / novembro / março",
      options: [
        { label: "fevereiro", replacement: "I usually go to the beach in February.", pt: "Eu geralmente vou à praia em fevereiro." },
        { label: "novembro", replacement: "I usually go to the beach in November.", pt: "Eu geralmente vou à praia em novembro." },
        { label: "março", replacement: "I usually go to the beach in March.", pt: "Eu geralmente vou à praia em março." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você trabalha em julho? / janeiro? / dezembro?",
      options: [
        { label: "julho", replacement: "Do you work in July?", pt: "Você trabalha em julho?" },
        { label: "janeiro", replacement: "Do you work in January?", pt: "Você trabalha em janeiro?" },
        { label: "dezembro", replacement: "Do you work in December?", pt: "Você trabalha em dezembro?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "O aniversário dele é amanhã. / hoje / semana que vem",
      options: [
        { label: "amanhã", replacement: "His birthday is tomorrow.", pt: "O aniversário dele é amanhã." },
        { label: "hoje", replacement: "His birthday is today.", pt: "O aniversário dele é hoje." },
        { label: "semana que vem", replacement: "His birthday is next week.", pt: "O aniversário dele é semana que vem." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Ela é muito jovem. / esperta / bonita",
      options: [
        { label: "jovem", replacement: "She is very young.", pt: "Ela é muito jovem." },
        { label: "esperta", replacement: "She is very smart.", pt: "Ela é muito esperta." },
        { label: "bonita", replacement: "She is very pretty.", pt: "Ela é muito bonita." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Nós estamos prontos para começar. / Eles estão / Eu estou",
      options: [
        { label: "Nós", replacement: "We are ready to start.", pt: "Nós estamos prontos para começar." },
        { label: "Eles", replacement: "They are ready to start.", pt: "Eles estão prontos para começar." },
        { label: "Eu", replacement: "I am ready to start.", pt: "Eu estou pronto para começar." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Eu quero começar o curso em abril. / março / setembro",
      options: [
        { label: "abril", replacement: "I want to start the course in April.", pt: "Eu quero começar o curso em abril." },
        { label: "março", replacement: "I want to start the course in March.", pt: "Eu quero começar o curso em março." },
        { label: "setembro", replacement: "I want to start the course in September.", pt: "Eu quero começar o curso em setembro." },
      ],
      currentIndex: 0,
    },
  ];

  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Quantos anos você tem? / eles? / vocês?",
      options: [
        { label: "você", replacement: "How old are you?", pt: "Quantos anos você tem?" },
        { label: "eles", replacement: "How old are they?", pt: "Quantos anos eles têm?" },
        { label: "vocês", replacement: "How old are you (plural)?", pt: "Quantos anos vocês têm?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Eu tenho 20 anos. / Ele tem / Vocês têm",
      options: [
        { label: "Eu", replacement: "I am 20 years old.", pt: "Eu tenho 20 anos." },
        { label: "Ele", replacement: "He is 20 years old.", pt: "Ele tem 20 anos." },
        { label: "Vocês", replacement: "You are 20 years old.", pt: "Vocês têm 20 anos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Ela tem 25 anos. / Ele tem",
      options: [
        { label: "Ela", replacement: "She is 25 years old.", pt: "Ela tem 25 anos." },
        { label: "Ele", replacement: "He is 25 years old.", pt: "Ele tem 25 anos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Ele é jovem. / Ele tem 15 anos / 12 / 14",
      options: [
        { label: "jovem", replacement: "He is young.", pt: "Ele é jovem." },
        { label: "15 anos", replacement: "He is 15 years old.", pt: "Ele tem 15 anos." },
        { label: "12 anos", replacement: "He is 12 years old.", pt: "Ele tem 12 anos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Meu pai tem 65 anos. / 70 / 81",
      options: [
        { label: "65 anos", replacement: "My father is 65 years old.", pt: "Meu pai tem 65 anos." },
        { label: "70 anos", replacement: "My father is 70 years old.", pt: "Meu pai tem 70 anos." },
        { label: "81 anos", replacement: "My father is 81 years old.", pt: "Meu pai tem 81 anos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Quando é seu aniversário? / dele? / dela?",
      options: [
        { label: "seu", replacement: "When is your birthday?", pt: "Quando é seu aniversário?" },
        { label: "dele", replacement: "When is his birthday?", pt: "Quando é o aniversário dele?" },
        { label: "dela", replacement: "When is her birthday?", pt: "Quando é o aniversário dela?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Meu aniversário é dia primeiro de junho.",
      options: [
        { label: "1º de junho", replacement: "My birthday is on June 1st.", pt: "Meu aniversário é dia primeiro de junho." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Meu aniversário é dia 10 de agosto. / 15 / 12",
      options: [
        { label: "10 de agosto", replacement: "My birthday is on August 10th.", pt: "Meu aniversário é dia 10 de agosto." },
        { label: "15 de agosto", replacement: "My birthday is on August 15th.", pt: "Meu aniversário é dia 15 de agosto." },
        { label: "12 de agosto", replacement: "My birthday is on August 12th.", pt: "Meu aniversário é dia 12 de agosto." },
      ],
      currentIndex: 0,
    },
  ];

  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Você está pronto? / Ela está / Eles estão",
      options: [
        { label: "Você", replacement: "Are you ready?", pt: "Você está pronto?" },
        { label: "Ela", replacement: "Is she ready?", pt: "Ela está pronta?" },
        { label: "Eles", replacement: "Are they ready?", pt: "Eles estão prontos?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eles são engraçados? / espertos? / gentis?",
      options: [
        { label: "engraçados", replacement: "Are they funny?", pt: "Eles são engraçados?" },
        { label: "espertos", replacement: "Are they smart?", pt: "Eles são espertos?" },
        { label: "gentis", replacement: "Are they kind?", pt: "Eles são gentis?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Ele está na estação? / no parque? / em casa?",
      options: [
        { label: "na estação", replacement: "Is he at the station?", pt: "Ele está na estação?" },
        { label: "no parque", replacement: "Is he at the park?", pt: "Ele está no parque?" },
        { label: "em casa", replacement: "Is he at home?", pt: "Ele está em casa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "É perto daqui? / É longe?",
      options: [
        { label: "perto", replacement: "Is it near here?", pt: "É perto daqui?" },
        { label: "longe", replacement: "Is it far?", pt: "É longe?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "A mochila é cara? / barata? / boa?",
      options: [
        { label: "cara", replacement: "Is the backpack expensive?", pt: "A mochila é cara?" },
        { label: "barata", replacement: "Is the backpack cheap?", pt: "A mochila é barata?" },
        { label: "boa", replacement: "Is the backpack good?", pt: "A mochila é boa?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Eles são advogados? / projetistas? / gerentes?",
      options: [
        { label: "advogados", replacement: "Are they lawyers?", pt: "Eles são advogados?" },
        { label: "projetistas", replacement: "Are they designers?", pt: "Eles são projetistas?" },
        { label: "gerentes", replacement: "Are they managers?", pt: "Eles são gerentes?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "Quem é você? / Quem são eles? / Quem é ela?",
      options: [
        { label: "você", replacement: "Who are you?", pt: "Quem é você?" },
        { label: "eles", replacement: "Who are they?", pt: "Quem são eles?" },
        { label: "ela", replacement: "Who is she?", pt: "Quem é ela?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Quem é aquela pessoa? / aquele aluno? / aquele engenheiro?",
      options: [
        { label: "pessoa", replacement: "Who is that person?", pt: "Quem é aquela pessoa?" },
        { label: "aluno", replacement: "Who is that student?", pt: "Quem é aquele aluno?" },
        { label: "engenheiro", replacement: "Who is that engineer?", pt: "Quem é aquele engenheiro?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "Onde você está agora? / elas? / ele?",
      options: [
        { label: "você", replacement: "Where are you now?", pt: "Onde você está agora?" },
        { label: "elas", replacement: "Where are they now?", pt: "Onde elas estão agora?" },
        { label: "ele", replacement: "Where is he now?", pt: "Onde ele está agora?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Quando é seu aniversário? / dele? / dela?",
      options: [
        { label: "seu", replacement: "When is your birthday?", pt: "Quando é seu aniversário?" },
        { label: "dele", replacement: "When is his birthday?", pt: "Quando é o aniversário dele?" },
        { label: "dela", replacement: "When is her birthday?", pt: "Quando é o aniversário dela?" },
      ],
      currentIndex: 0,
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            📘 Lesson 41 - Health, Feelings & Professions
          </h1>
          <SpeakSentence text="Learn to ask questions with the verb to be, talk about birthdays and months, and use ordinal numbers." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to ask questions with the verb "to be", talk about birthdays and months, and use ordinal numbers.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Calendar and birthday concept"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - VERBS with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS (to be - Questions)</h2>
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

        {/* Section 2 - MONTHS & NEW WORDS with Drill */}
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
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">📅 Months of the Year / Meses do Ano</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map((month, index) => (
                <li key={index}>
                  <SpeakText text={month.english} className="text-green-600 font-bold">
                    {month.english}
                  </SpeakText> = {month.portuguese}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-green-700 mb-4">📚 New Vocabulary / Novo Vocabulário</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Section 3 - USEFUL PHRASES with Drill */}
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
            <SpeakSentence text="Practice common phrases to talk about age and birthdays" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about age and birthdays
            </SpeakSentence>
            <div className="bg-yellow-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index}>
                  <SpeakText text={phrase.english} className="text-yellow-600 font-bold">
                    {phrase.english}
                  </SpeakText> = {phrase.portuguese}
                </div>
              ))}
            </div>
            
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
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Questions with To Be)</h2>
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
            <SpeakSentence text="Complete structures with the verb to be in interrogative sentences" className="text-md text-gray-600 mb-4 italic">
              📚 Complete structures with the verb to be in interrogative sentences
            </SpeakSentence>
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index}>
                  <SpeakText text={example.english} className="text-purple-600 font-bold">
                    {example.english}
                  </SpeakText> = {example.portuguese}
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

        {/* Section 5 - REAL LIFE Practice (Make It Yours) */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎭 MAKE IT YOURS</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100 font-semibold">
              Objetivo: Substituir as palavras azuis
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <SpeakSentence text={sentence.english} className="text-lg font-medium text-black">
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
                        src={birthdayImage}
                        alt="Birthday celebration"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Happy birthday!
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={shoppingImage}
                        alt="Shopping"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      At the shopping mall
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - WRAP UP! (Ordinal Numbers 16-31) */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔢 WRAP UP! Ordinal Numbers 16th - 31st</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <button 
              onClick={() => setShowCheckItOutExplanation(!showCheckItOutExplanation)}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {showCheckItOutExplanation ? 'Hide Explanation' : 'Show Explanation'}
            </button>
          </div>

          <div className="p-8">
            {showCheckItOutExplanation && (
              <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200 animate-fadeIn">
                <p className="text-teal-800 text-sm">📚 <strong>Ordinal numbers</strong> indicate position, order, or rank. For numbers 20, 30, etc., change -y to -ieth (twenty → twentieth, thirty → thirtieth). For compound numbers (21, 22, etc.), only the last number is ordinal (twenty-first, twenty-second).</p>
                <p className="text-teal-800 text-sm mt-1">💡 Use ordinal numbers for dates: <strong>June 1st</strong>, <strong>August 10th</strong>, <strong>December 25th</strong>.</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {ordinalNumbers.map((ordinal) => (
                <div key={ordinal.number} className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200 hover:shadow-md transition-all flex flex-col justify-center items-center">
                  <p className="text-2xl font-bold text-teal-600">{ordinal.number}</p>
                  <SpeakText text={ordinal.english} className="text-lg font-medium text-teal-700 mt-1">
                    {ordinal.english}
                  </SpeakText>
                  <p className="text-sm text-teal-500">{ordinal.portuguese}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-teal-100 rounded-xl">
              <h4 className="font-bold text-teal-800 mb-2">🎂 Birthday Examples / Exemplos de Aniversário:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-lg border border-teal-200">
                  <SpeakSentence text="My birthday is in October" className="text-black">
                    🎂 "My birthday is <span className="text-blue-600 font-bold">in October</span>."
                  </SpeakSentence>
                </div>
                <div className="p-3 bg-white rounded-lg border border-teal-200">
                  <SpeakSentence text="My birthday is on October 29th" className="text-black">
                    🎂 "My birthday is <span className="text-blue-600 font-bold">on October 29th</span>."
                  </SpeakSentence>
                </div>
                <div className="p-3 bg-white rounded-lg border border-teal-200">
                  <SpeakSentence text="My birthday is on" className="text-black">
                    📅 "My birthday is on <span className="text-blue-600 font-bold">___</span>"
                  </SpeakSentence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson40")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson42")}
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