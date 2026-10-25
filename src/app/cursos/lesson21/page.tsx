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
// MAIN COMPONENT – LESSON 21
// ============================================
export default function Lesson21LifestyleWeeklyPlanning() {
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
  const mainImage = "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/l21andl22.png";
  const homeImage = "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const beachImage = "https://images.pexels.com/photos/1125977/pexels-photo-1125977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const countrysideImage = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const calendarImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const weekdaysImage = "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ========== LESSON 21 DATA ==========
  const verbs = [
    { english: "to stay", portuguese: "ficar" },
    { english: "to come", portuguese: "vir" }
  ];

  const newWords = [
    { english: "home", portuguese: "casa, lar" },
    { english: "apartment", portuguese: "apartamento" },
    { english: "beach", portuguese: "praia" },
    { english: "countryside", portuguese: "campo, interior" },
    { english: "day", portuguese: "dia" },
    { english: "week", portuguese: "semana" },
    { english: "Sunday", portuguese: "domingo" },
    { english: "Monday", portuguese: "segunda-feira" },
    { english: "Tuesday", portuguese: "terça-feira" },
    { english: "Wednesday", portuguese: "quarta-feira" },
    { english: "Thursday", portuguese: "quinta-feira" },
    { english: "Friday", portuguese: "sexta-feira" },
    { english: "Saturday", portuguese: "sábado" },
    { english: "he", portuguese: "ele" },
    { english: "she", portuguese: "ela" }
  ];

  const usefulPhrases = [
    { english: "I sometimes go to the countryside.", portuguese: "Eu às vezes vou para o interior." },
    { english: "Do you clean your house during the week?", portuguese: "Você limpa sua casa durante a semana?" },
    { english: "They go to the beach on weekends.", portuguese: "Eles vão para a praia nos fins de semana." }
  ];

  const grammarExamples = [
    { english: "She works at the bank.", portuguese: "Ela trabalha no banco." },
    { english: "He eats bread and butter every day.", portuguese: "Ele come pão com manteiga todos os dias." },
    { english: "She speaks English and German.", portuguese: "Ela fala inglês e alemão." },
    { english: "He stays home in the evening.", portuguese: "Ele fica em casa à noite." },
    { english: "She sleeps on the couch.", portuguese: "Ela dorme no sofá." },
    { english: "She goes to school in the morning.", portuguese: "Ela vai à escola de manhã." },
    { english: "He has two sisters.", portuguese: "Ele tem duas irmãs." },
    { english: "She studies at home.", portuguese: "Ela estuda em casa." }
  ];

  const realLifeSentences = [
    { english: "I stay home on Mondays.", portuguese: "Eu fico em casa às segundas-feiras." },
    { english: "I sometimes read at night.", portuguese: "Eu às vezes leio à noite." },
    { english: "They come home during the week.", portuguese: "Eles vêm aqui durante a semana." },
    { english: "He goes home on weekends.", portuguese: "Ele vai para casa nos fins de semana." },
    { english: "She goes to work at 8:00 A.M.", portuguese: "Ela vai ao trabalho às 8:00 da manhã." },
    { english: "He wants to live abroad.", portuguese: "Ele quer morar no exterior." },
    { english: "He has a house in the countryside.", portuguese: "Ele tem uma casa no campo." },
    { english: "She works at home on Tuesdays and Thursdays.", portuguese: "Ela trabalha em casa às terças e quintas." },
    { english: "She has a restaurant at the beach.", portuguese: "Ela tem um restaurante na praia." },
    { english: "He studies in the morning.", portuguese: "Ele estuda de manhã." }
  ];

  // ========== VERBS SUBSTITUTION (Mantido da Lesson 21) ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "stay / I stay. / You stay. / We stay.",
      options: [
        { label: "stay", replacement: "stay.", pt: "ficar" },
        { label: "I stay", replacement: "I stay.", pt: "Eu fico." },
        { label: "You stay", replacement: "You stay.", pt: "Você fica." },
        { label: "We stay", replacement: "We stay.", pt: "Nós ficamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "I don't stay. / You / They.",
      options: [
        { label: "I don't", replacement: "I don't stay.", pt: "Eu não fico." },
        { label: "You don't", replacement: "You don't stay.", pt: "Você não fica." },
        { label: "They don't", replacement: "They don't stay.", pt: "Eles não ficam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Do you want to stay here? / They / You all.",
      options: [
        { label: "Do you", replacement: "Do you want to stay here?", pt: "Você quer ficar aqui?" },
        { label: "Do they", replacement: "Do they want to stay here?", pt: "Eles querem ficar aqui?" },
        { label: "Do you all", replacement: "Do you all want to stay here?", pt: "Vocês querem ficar aqui?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "I don't want to stay here. / need / have to.",
      options: [
        { label: "don't want", replacement: "I don't want to stay here.", pt: "Eu não quero ficar aqui." },
        { label: "need", replacement: "I need to stay here.", pt: "Eu preciso ficar aqui." },
        { label: "have to", replacement: "I have to stay here.", pt: "Eu tenho que ficar aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Where do you want to stay? / prefer / have to.",
      options: [
        { label: "want", replacement: "Where do you want to stay?", pt: "Onde você quer ficar?" },
        { label: "prefer", replacement: "Where do you prefer to stay?", pt: "Onde você prefere ficar?" },
        { label: "have to", replacement: "Where do you have to stay?", pt: "Onde você tem que ficar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "come / I come. / You come. / We come.",
      options: [
        { label: "come", replacement: "come.", pt: "vir" },
        { label: "I come", replacement: "I come.", pt: "Eu venho." },
        { label: "You come", replacement: "You come.", pt: "Você vem." },
        { label: "We come", replacement: "We come.", pt: "Nós vimos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "I don't come. / We / They.",
      options: [
        { label: "I don't", replacement: "I don't come.", pt: "Eu não venho." },
        { label: "We don't", replacement: "We don't come.", pt: "Nós não vimos." },
        { label: "They don't", replacement: "They don't come.", pt: "Eles não vêm." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Do you have to come? / They / We.",
      options: [
        { label: "Do you", replacement: "Do you have to come?", pt: "Você tem que vir?" },
        { label: "Do they", replacement: "Do they have to come?", pt: "Eles têm que vir?" },
        { label: "Do we", replacement: "Do we have to come?", pt: "Nós temos que vir?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-9",
      original: "When do you go to the office? / to the company / to the restaurant.",
      options: [
        { label: "office", replacement: "When do you go to the office?", pt: "Quando você vai ao escritório?" },
        { label: "company", replacement: "When do you go to the company?", pt: "Quando você vai à empresa?" },
        { label: "restaurant", replacement: "When do you go to the restaurant?", pt: "Quando você vai ao restaurante?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-10",
      original: "You don't have to come. / stay / go.",
      options: [
        { label: "come", replacement: "You don't have to come.", pt: "Você não tem que vir." },
        { label: "stay", replacement: "You don't have to stay.", pt: "Você não tem que ficar." },
        { label: "go", replacement: "You don't have to go.", pt: "Você não tem que ir." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== NEW WORDS SUBSTITUTION (Atualizado com o novo texto) ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "I come home in the evening. / Eles / Meus pais.",
      options: [
        { label: "I", replacement: "I come home in the evening.", pt: "Eu venho para casa à noite." },
        { label: "They", replacement: "They come home in the evening.", pt: "Eles vêm para casa à noite." },
        { label: "My parents", replacement: "My parents come home in the evening.", pt: "Meus pais vêm para casa à noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Você vem para casa cedo? / tarde / às seis horas.",
      options: [
        { label: "cedo", replacement: "Do you come home early?", pt: "Você vem para casa cedo?" },
        { label: "tarde", replacement: "Do you come home late?", pt: "Você vem para casa tarde?" },
        { label: "às seis", replacement: "Do you come home at six o'clock?", pt: "Você vem para casa às seis horas?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "I prefer to stay home. / quero / gosto.",
      options: [
        { label: "prefer", replacement: "I prefer to stay home.", pt: "Eu prefiro ficar em casa." },
        { label: "want", replacement: "I want to stay home.", pt: "Eu quero ficar em casa." },
        { label: "like", replacement: "I like to stay home.", pt: "Eu gosto de ficar em casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu trabalho durante a semana. / leio livros.",
      options: [
        { label: "trabalho", replacement: "I work during the week.", pt: "Eu trabalho durante a semana." },
        { label: "leio", replacement: "I read books during the week.", pt: "Eu leio livros durante a semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Nós não ficamos em casa. / aqui / lá.",
      options: [
        { label: "em casa", replacement: "We don't stay home.", pt: "Nós não ficamos em casa." },
        { label: "aqui", replacement: "We don't stay here.", pt: "Nós não ficamos aqui." },
        { label: "lá", replacement: "We don't stay there.", pt: "Nós não ficamos lá." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Eu gosto de ir ao cinema. / Elas / Nós.",
      options: [
        { label: "Eu", replacement: "I like to go to the movies.", pt: "Eu gosto de ir ao cinema." },
        { label: "Elas", replacement: "They like to go to the movies.", pt: "Elas gostam de ir ao cinema." },
        { label: "Nós", replacement: "We like to go to the movies.", pt: "Nós gostamos de ir ao cinema." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu não fico em casa nos fins de semana. / aos domingos / aos sábados.",
      options: [
        { label: "fins de semana", replacement: "I don't stay home on weekends.", pt: "Eu não fico em casa nos fins de semana." },
        { label: "domingos", replacement: "I don't stay home on Sundays.", pt: "Eu não fico em casa aos domingos." },
        { label: "sábados", replacement: "I don't stay home on Saturdays.", pt: "Eu não fico em casa aos sábados." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "ficar / Eu fico. / Você fica. / Nós ficamos.",
      options: [
        { label: "ficar", replacement: "to stay.", pt: "ficar" },
        { label: "Eu fico", replacement: "I stay.", pt: "Eu fico." },
        { label: "Você fica", replacement: "You stay.", pt: "Você fica." },
        { label: "Nós ficamos", replacement: "We stay.", pt: "Nós ficamos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-9",
      original: "Eu não fico. / Você / Elas.",
      options: [
        { label: "Eu", replacement: "I don't stay.", pt: "Eu não fico." },
        { label: "Você", replacement: "You don't stay.", pt: "Você não fica." },
        { label: "Elas", replacement: "They don't stay.", pt: "Elas não ficam." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-10",
      original: "Você quer ficar aqui? / Eles / Vocês.",
      options: [
        { label: "Você", replacement: "Do you want to stay here?", pt: "Você quer ficar aqui?" },
        { label: "Eles", replacement: "Do they want to stay here?", pt: "Eles querem ficar aqui?" },
        { label: "Vocês", replacement: "Do you all want to stay here?", pt: "Vocês querem ficar aqui?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-11",
      original: "Eu não quero ficar aqui. / preciso / tenho que.",
      options: [
        { label: "não quero", replacement: "I don't want to stay here.", pt: "Eu não quero ficar aqui." },
        { label: "preciso", replacement: "I need to stay here.", pt: "Eu preciso ficar aqui." },
        { label: "tenho que", replacement: "I have to stay here.", pt: "Eu tenho que ficar aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-12",
      original: "Onde você quer ficar? / prefere / tem que.",
      options: [
        { label: "quer", replacement: "Where do you want to stay?", pt: "Onde você quer ficar?" },
        { label: "prefere", replacement: "Where do you prefer to stay?", pt: "Onde você prefere ficar?" },
        { label: "tem que", replacement: "Where do you have to stay?", pt: "Onde você tem que ficar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-13",
      original: "vir / Eu venho. / Você vem. / Nós vimos.",
      options: [
        { label: "vir", replacement: "to come.", pt: "vir" },
        { label: "Eu venho", replacement: "I come.", pt: "Eu venho." },
        { label: "Você vem", replacement: "You come.", pt: "Você vem." },
        { label: "Nós vimos", replacement: "We come.", pt: "Nós vimos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-14",
      original: "Eu não venho. / Nós / Eles.",
      options: [
        { label: "Eu", replacement: "I don't come.", pt: "Eu não venho." },
        { label: "Nós", replacement: "We don't come.", pt: "Nós não vimos." },
        { label: "Eles", replacement: "They don't come.", pt: "Eles não vêm." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-15",
      original: "Eu quero ficar em casa com meus amigos. / pais / família.",
      options: [
        { label: "amigos", replacement: "I want to stay home with my friends.", pt: "Eu quero ficar em casa com meus amigos." },
        { label: "pais", replacement: "I want to stay home with my parents.", pt: "Eu quero ficar em casa com meus pais." },
        { label: "família", replacement: "I want to stay home with my family.", pt: "Eu quero ficar em casa com minha família." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-16",
      original: "Você fica em casa de manhã? / à tarde / à noite.",
      options: [
        { label: "de manhã", replacement: "Do you stay home in the morning?", pt: "Você fica em casa de manhã?" },
        { label: "à tarde", replacement: "Do you stay home in the afternoon?", pt: "Você fica em casa à tarde?" },
        { label: "à noite", replacement: "Do you stay home at night?", pt: "Você fica em casa à noite?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-17",
      original: "I work on Mondays. / terças / quartas.",
      options: [
        { label: "Mondays", replacement: "I work on Mondays.", pt: "Eu trabalho às segundas-feiras." },
        { label: "Tuesdays", replacement: "I work on Tuesdays.", pt: "Eu trabalho às terças-feiras." },
        { label: "Wednesdays", replacement: "I work on Wednesdays.", pt: "Eu trabalho às quartas-feiras." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-18",
      original: "Você quer ir ao shopping no sábado? / domingo / sexta-feira.",
      options: [
        { label: "sábado", replacement: "Do you want to go to the mall on Saturday?", pt: "Você quer ir ao shopping no sábado?" },
        { label: "domingo", replacement: "Do you want to go to the mall on Sunday?", pt: "Você quer ir ao shopping no domingo?" },
        { label: "sexta", replacement: "Do you want to go to the mall on Friday?", pt: "Você quer ir ao shopping na sexta-feira?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-19",
      original: "Eu não preciso trabalhar na quarta-feira. / quinta / sexta.",
      options: [
        { label: "quarta", replacement: "I don't need to work on Wednesday.", pt: "Eu não preciso trabalhar na quarta-feira." },
        { label: "quinta", replacement: "I don't need to work on Thursday.", pt: "Eu não preciso trabalhar na quinta-feira." },
        { label: "sexta", replacement: "I don't need to work on Friday.", pt: "Eu não preciso trabalhar na sexta-feira." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-20",
      original: "Nós queremos ir ao cinema no domingo. / à praia / ao campo.",
      options: [
        { label: "cinema", replacement: "We want to go to the movies on Sunday.", pt: "Nós queremos ir ao cinema no domingo." },
        { label: "praia", replacement: "We want to go to the beach on Sunday.", pt: "Nós queremos ir à praia no domingo." },
        { label: "campo", replacement: "We want to go to the countryside on Sunday.", pt: "Nós queremos ir ao campo no domingo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-21",
      original: "Eu moro na cidade. / nos Estados Unidos / no campo.",
      options: [
        { label: "cidade", replacement: "I live in the city.", pt: "Eu moro na cidade." },
        { label: "EUA", replacement: "I live in the United States.", pt: "Eu moro nos Estados Unidos." },
        { label: "campo", replacement: "I live in the countryside.", pt: "Eu moro no campo." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-22",
      original: "Você trabalha no banco? / posto de gasolina / praia.",
      options: [
        { label: "banco", replacement: "Do you work at the bank?", pt: "Você trabalha no banco?" },
        { label: "posto", replacement: "Do you work at the gas station?", pt: "Você trabalha no posto de gasolina?" },
        { label: "praia", replacement: "Do you work at the beach?", pt: "Você trabalha na praia?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-23",
      original: "Nós temos uma casa na praia. / restaurante / cafeteria.",
      options: [
        { label: "casa", replacement: "We have a house at the beach.", pt: "Nós temos uma casa na praia." },
        { label: "restaurante", replacement: "We have a restaurant at the beach.", pt: "Nós temos um restaurante na praia." },
        { label: "cafeteria", replacement: "We have a coffee shop at the beach.", pt: "Nós temos uma cafeteria na praia." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-24",
      original: "I live in an apartment. / Elas / Nós.",
      options: [
        { label: "I", replacement: "I live in an apartment.", pt: "Eu moro em um apartamento." },
        { label: "They", replacement: "They live in an apartment.", pt: "Elas moram em um apartamento." },
        { label: "We", replacement: "We live in an apartment.", pt: "Nós moramos em um apartamento." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-25",
      original: "Eu tenho que ir para casa. / às 6:00 / às 6:30.",
      options: [
        { label: "para casa", replacement: "I have to go home.", pt: "Eu tenho que ir para casa." },
        { label: "às 6:00", replacement: "I have to go home at 6:00.", pt: "Eu tenho que ir para casa às 6:00." },
        { label: "às 6:30", replacement: "I have to go home at 6:30.", pt: "Eu tenho que ir para casa às 6:30." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION (Atualizado com o novo texto) ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "Eu trabalho durante a semana. / estudo / leio livros.",
      options: [
        { label: "trabalho", replacement: "I work during the week.", pt: "Eu trabalho durante a semana." },
        { label: "estudo", replacement: "I study during the week.", pt: "Eu estudo durante a semana." },
        { label: "leio", replacement: "I read books during the week.", pt: "Eu leio livros durante a semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "Nós não ficamos em casa durante a semana. / aqui / lá.",
      options: [
        { label: "em casa", replacement: "We don't stay home during the week.", pt: "Nós não ficamos em casa durante a semana." },
        { label: "aqui", replacement: "We don't stay here during the week.", pt: "Nós não ficamos aqui durante a semana." },
        { label: "lá", replacement: "We don't stay there during the week.", pt: "Nós não ficamos lá durante a semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu gosto de ir ao cinema nos fins de semana. / Elas / Nós.",
      options: [
        { label: "Eu", replacement: "I like to go to the movies on weekends.", pt: "Eu gosto de ir ao cinema nos fins de semana." },
        { label: "Elas", replacement: "They like to go to the movies on weekends.", pt: "Elas gostam de ir ao cinema nos fins de semana." },
        { label: "Nós", replacement: "We like to go to the movies on weekends.", pt: "Nós gostamos de ir ao cinema nos fins de semana." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu não fico em casa nos fins de semana. / aos domingos / aos sábados.",
      options: [
        { label: "fins de semana", replacement: "I don't stay home on weekends.", pt: "Eu não fico em casa nos fins de semana." },
        { label: "domingos", replacement: "I don't stay home on Sundays.", pt: "Eu não fico em casa aos domingos." },
        { label: "sábados", replacement: "I don't stay home on Saturdays.", pt: "Eu não fico em casa aos sábados." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "I sometimes work on Saturdays. / Nós / Eles.",
      options: [
        { label: "I", replacement: "I sometimes work on Saturdays.", pt: "Eu às vezes trabalho aos sábados." },
        { label: "We", replacement: "We sometimes work on Saturdays.", pt: "Nós às vezes trabalhamos aos sábados." },
        { label: "They", replacement: "They sometimes work on Saturdays.", pt: "Eles às vezes trabalham aos sábados." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Às vezes, eu estudo aos domingos. / lavo a roupa / limpo a casa.",
      options: [
        { label: "estudo", replacement: "I sometimes study on Sundays.", pt: "Às vezes, eu estudo aos domingos." },
        { label: "lavo", replacement: "I sometimes do the laundry on Sundays.", pt: "Às vezes, eu lavo a roupa aos domingos." },
        { label: "limpo", replacement: "I sometimes clean the house on Sundays.", pt: "Às vezes, eu limpo a casa aos domingos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Eu como peixe às vezes. / granola / cereal.",
      options: [
        { label: "peixe", replacement: "I eat fish sometimes.", pt: "Eu como peixe às vezes." },
        { label: "granola", replacement: "I eat granola sometimes.", pt: "Eu como granola às vezes." },
        { label: "cereal", replacement: "I eat cereal sometimes.", pt: "Eu como cereal às vezes." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION (Atualizado com o novo texto) ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "Eu como. / She eats. / Ela come. / bebe / trabalha.",
      options: [
        { label: "Eu como", replacement: "I eat.", pt: "Eu como." },
        { label: "She eats", replacement: "She eats.", pt: "Ela come." },
        { label: "bebe", replacement: "She drinks.", pt: "Ela bebe." },
        { label: "trabalha", replacement: "She works.", pt: "Ela trabalha." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "Eu prefiro. / He prefers. / Ele prefere. / quer / vem.",
      options: [
        { label: "Eu prefiro", replacement: "I prefer.", pt: "Eu prefiro." },
        { label: "He prefers", replacement: "He prefers.", pt: "Ele prefere." },
        { label: "quer", replacement: "He wants.", pt: "Ele quer." },
        { label: "vem", replacement: "He comes.", pt: "Ele vem." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "Eu falo. / Ela fala. / mora / dorme.",
      options: [
        { label: "Eu falo", replacement: "I speak.", pt: "Eu falo." },
        { label: "Ela fala", replacement: "She speaks.", pt: "Ela fala." },
        { label: "mora", replacement: "She lives.", pt: "Ela mora." },
        { label: "dorme", replacement: "She sleeps.", pt: "Ela dorme." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu preciso. / Ele precisa. / entende / cozinha.",
      options: [
        { label: "Eu preciso", replacement: "I need.", pt: "Eu preciso." },
        { label: "Ele precisa", replacement: "He needs.", pt: "Ele precisa." },
        { label: "entende", replacement: "He understands.", pt: "Ele entende." },
        { label: "cozinha", replacement: "He cooks.", pt: "Ele cozinha." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Ela precisa ficar. / ler / dormir.",
      options: [
        { label: "ficar", replacement: "She needs to stay.", pt: "Ela precisa ficar." },
        { label: "ler", replacement: "She needs to read.", pt: "Ela precisa ler." },
        { label: "dormir", replacement: "She needs to sleep.", pt: "Ela precisa dormir." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-6",
      original: "Ele quer trabalhar. / ir / cozinhar.",
      options: [
        { label: "trabalhar", replacement: "He wants to work.", pt: "Ele quer trabalhar." },
        { label: "ir", replacement: "He wants to go.", pt: "Ele quer ir." },
        { label: "cozinhar", replacement: "He wants to cook.", pt: "Ele quer cozinhar." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-7",
      original: "He studies at Leaf. / Ela / Minha mãe.",
      options: [
        { label: "He", replacement: "He studies at Leaf.", pt: "Ele estuda na Leaf." },
        { label: "She", replacement: "She studies at Leaf.", pt: "Ela estuda na Leaf." },
        { label: "My mother", replacement: "My mother studies at Leaf.", pt: "Minha mãe estuda na Leaf." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-8",
      original: "Ela estuda alemão aqui. / Meu amigo / colega de trabalho.",
      options: [
        { label: "Ela", replacement: "She studies German here.", pt: "Ela estuda alemão aqui." },
        { label: "Meu amigo", replacement: "My friend studies German here.", pt: "Meu amigo estuda alemão aqui." },
        { label: "colega", replacement: "My coworker studies German here.", pt: "Meu colega de trabalho estuda alemão aqui." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-9",
      original: "He has two apartments. / empregos / escolas.",
      options: [
        { label: "apartments", replacement: "He has two apartments.", pt: "Ele tem dois apartamentos." },
        { label: "jobs", replacement: "He has two jobs.", pt: "Ele tem dois empregos." },
        { label: "schools", replacement: "He has two schools.", pt: "Ele tem duas escolas." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-10",
      original: "Ela tem que ir. / vir / ficar aqui.",
      options: [
        { label: "ir", replacement: "She has to go.", pt: "Ela tem que ir." },
        { label: "vir", replacement: "She has to come.", pt: "Ela tem que vir." },
        { label: "ficar", replacement: "She has to stay here.", pt: "Ela tem que ficar aqui." },
      ],
      currentIndex: 0,
    },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            📅 Lesson 21 - Lifestyle & Weekly Planning
          </h1>
          <SpeakSentence text="Learn to talk about lifestyle choices, weekly routines, days of the week, and living arrangements." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about lifestyle choices, weekly routines, days of the week, and living arrangements.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Weekly planning and lifestyle"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
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

        {/* Section 2 - Vocabulary with Drill */}
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

        {/* Section 3 - Useful Phrases with Drill */}
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
            <SpeakSentence text="Practice common phrases for daily communication" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <SpeakSentence text={phrase.english} className="text-blue-600 font-bold cursor-pointer text-lg mb-2 block">
                    {phrase.english}
                  </SpeakSentence>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>

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
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
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
            <SpeakSentence text="Structures for asking about going to places and daily routines" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking about going to places and daily routines
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

        {/* Section 5 - Make It Yours */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice weekly planning and lifestyle choices
            </div>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          {index + 1}. {sentence.english}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={homeImage}
                        alt="Home and apartment living"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Home and apartment lifestyle
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={beachImage}
                        alt="Beach weekends"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Weekend beach trips
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={countrysideImage}
                        alt="Countryside living"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Countryside lifestyle
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out (print style) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Verb conjugations, pronouns, days of the week, and vocabulary
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Verb Conjugations */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">VERB CONJUGATIONS</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I go</p>
                        <p className="text-blue-200 text-sm">Eu vou</p>
                      </div>
                      <div>
                        <p className="font-bold">She goes</p>
                        <p className="text-blue-200 text-sm">Ela vai</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I stay</p>
                        <p className="text-blue-200 text-sm">Eu fico</p>
                      </div>
                      <div>
                        <p className="font-bold">She stays</p>
                        <p className="text-blue-200 text-sm">Ela fica</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I have</p>
                        <p className="text-blue-200 text-sm">Eu tenho</p>
                      </div>
                      <div>
                        <p className="font-bold">He has</p>
                        <p className="text-blue-200 text-sm">Ele tem</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I study</p>
                        <p className="text-blue-200 text-sm">Eu estudo</p>
                      </div>
                      <div>
                        <p className="font-bold">He studies</p>
                        <p className="text-blue-200 text-sm">Ele estuda</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image for verb conjugation */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-800 rounded-lg overflow-hidden">
                  <img
                    src={weekdaysImage}
                    alt="Weekly planning and routines"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">📝 Daily Routines</p>
                    <p className="text-blue-200 text-xs">Practice conjugating verbs for daily activities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Days of Week and Vocabulary */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">DAYS OF THE WEEK</h3>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Sunday</p>
                      <p className="text-blue-200 text-sm">domingo</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Monday</p>
                      <p className="text-blue-200 text-sm">segunda-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Tuesday</p>
                      <p className="text-blue-200 text-sm">terça-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Wednesday</p>
                      <p className="text-blue-200 text-sm">quarta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Thursday</p>
                      <p className="text-blue-200 text-sm">quinta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Friday</p>
                      <p className="text-blue-200 text-sm">sexta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg col-span-3">
                      <p className="font-bold text-lg">Saturday</p>
                      <p className="text-blue-200 text-sm">sábado</p>
                    </div>
                  </div>
                </div>
                
                {/* Pronouns Section */}
                <div className="pt-6 border-t border-blue-700">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">PRONOUNS</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-blue-700 rounded-full p-2">
                          <span className="text-lg">👨</span>
                        </div>
                        <div>
                          <p className="font-bold">He</p>
                          <p className="text-blue-200 text-sm">ele</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: He works.</p>
                    </div>
                    
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-pink-600 rounded-full p-2">
                          <span className="text-lg">👩</span>
                        </div>
                        <div>
                          <p className="font-bold">She</p>
                          <p className="text-blue-200 text-sm">ela</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: She studies.</p>
                    </div>
                  </div>
                </div>
                
                {/* Vocabulary Support */}
                <div className="mt-6 pt-6 border-t border-blue-700">
                  <div className="p-4 bg-blue-900 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">📋 Vocabulary Support</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">to go home</p>
                        <p className="text-blue-200 text-sm">ir para casa</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">to stay home</p>
                        <p className="text-blue-200 text-sm">ficar em casa</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">at the beach</p>
                        <p className="text-blue-200 text-sm">na praia</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">in the countryside</p>
                        <p className="text-blue-200 text-sm">no campo / interior</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-700 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">💬 Useful Questions:</h6>
                      <div className="flex items-start mb-2">
                        <div>
                          <p className="font-medium">What day is it today?</p>
                          <p className="text-blue-200 text-sm">Que dia é hoje?</p>
                          <p className="text-blue-300 text-xs">It's Wednesday. = É quarta-feira.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image for vocabulary */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src={calendarImage}
                    alt="Weekly calendar planning"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🗓️ Weekly Planning</p>
                    <p className="text-blue-200 text-xs">Organize your week with English vocabulary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson20")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (20)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson22")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (22) &rarr;
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