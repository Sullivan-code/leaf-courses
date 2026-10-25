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
// CHECK IT OUT HORIZONTAL (adapted for Lesson 19)
// ============================================
function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b-2 border-gray-800">
        <h2 className="text-xl font-bold tracking-widest text-gray-900">
          CHECK IT OUT!
        </h2>
        <div className="flex items-center gap-3 text-gray-600">
          <span className="cursor-pointer hover:text-gray-900">≡</span>
          <span className="cursor-pointer hover:text-gray-900">✕</span>
          <span className="cursor-pointer hover:text-gray-900">▶</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
        <div className="bg-green-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">NUMBERS & TIME</h3>
          <SpeakSentence text="thirty" className="block cursor-pointer hover:opacity-70">
            • thirty (30)
          </SpeakSentence>
          <SpeakSentence text="forty" className="block cursor-pointer hover:opacity-70">
            • forty (40)
          </SpeakSentence>
          <SpeakSentence text="fifty" className="block cursor-pointer hover:opacity-70">
            • fifty (50)
          </SpeakSentence>
          <SpeakSentence text="sixty" className="block cursor-pointer hover:opacity-70">
            • sixty (60)
          </SpeakSentence>
          <div className="mt-4 pt-4 border-t border-green-600">
            <h4 className="font-bold text-yellow-300 mb-2">TELLING TIME</h4>
            <SpeakSentence text="It's four o'clock." className="block cursor-pointer hover:opacity-70">
              • It's four o'clock.
            </SpeakSentence>
            <SpeakSentence text="It's four fifteen." className="block cursor-pointer hover:opacity-70">
              • It's four fifteen.
            </SpeakSentence>
            <SpeakSentence text="It's four thirty." className="block cursor-pointer hover:opacity-70">
              • It's four thirty.
            </SpeakSentence>
            <SpeakSentence text="It's ten to five." className="block cursor-pointer hover:opacity-70">
              • It's ten to five.
            </SpeakSentence>
            <SpeakSentence text="It's noon." className="block cursor-pointer hover:opacity-70">
              • It's noon.
            </SpeakSentence>
            <SpeakSentence text="It's midnight." className="block cursor-pointer hover:opacity-70">
              • It's midnight.
            </SpeakSentence>
          </div>
        </div>

        <div className="bg-red-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">DAILY ROUTINE & CHORES</h3>
          <SpeakSentence text="cook" className="block cursor-pointer hover:opacity-70">
            • cook
          </SpeakSentence>
          <SpeakSentence text="clean" className="block cursor-pointer hover:opacity-70">
            • clean
          </SpeakSentence>
          <SpeakSentence text="do the dishes" className="block cursor-pointer hover:opacity-70">
            • do the dishes
          </SpeakSentence>
          <SpeakSentence text="do the laundry" className="block cursor-pointer hover:opacity-70">
            • do the laundry
          </SpeakSentence>
          <SpeakSentence text="have breakfast" className="block cursor-pointer hover:opacity-70">
            • have breakfast
          </SpeakSentence>
          <SpeakSentence text="have lunch" className="block cursor-pointer hover:opacity-70">
            • have lunch
          </SpeakSentence>
          <SpeakSentence text="have dinner" className="block cursor-pointer hover:opacity-70">
            • have dinner
          </SpeakSentence>
          <div className="mt-4 pt-4 border-t border-red-600">
            <h4 className="font-bold text-yellow-300 mb-2">QUESTIONS</h4>
            <SpeakSentence text="What time is it?" className="block cursor-pointer hover:opacity-70">
              • What time is it?
            </SpeakSentence>
            <SpeakSentence text="What time do you go to bed?" className="block cursor-pointer hover:opacity-70">
              • What time do you go to bed?
            </SpeakSentence>
            <SpeakSentence text="Do you do the dishes every day?" className="block cursor-pointer hover:opacity-70">
              • Do you do the dishes every day?
            </SpeakSentence>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 19
// ============================================
export default function Lesson19LifestyleWeeklyPlanning() {
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

  // ===== IMAGES =====
  const mainImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cookingImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const cleaningImage = "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const bedroomImage = "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1000&q=80";

  // ===== LESSON 19 DATA =====
  const verbs = [
    { english: "to cook", portuguese: "cozinhar" },
    { english: "to clean", portuguese: "limpar" }
  ];

  const newWords = [
    { english: "soup", portuguese: "sopa" },
    { english: "pasta", portuguese: "massa, macarrão" },
    { english: "sauce", portuguese: "molho" },
    { english: "bedroom", portuguese: "quarto" },
    { english: "bathroom", portuguese: "banheiro" },
    { english: "living room", portuguese: "sala de estar" },
    { english: "kitchen", portuguese: "cozinha" },
    { english: "table", portuguese: "mesa" },
    { english: "couch", portuguese: "sofá" },
    { english: "time", portuguese: "tempo, hora" },
    { english: "noon", portuguese: "meio-dia" },
    { english: "midnight", portuguese: "meia-noite" },
    { english: "until", portuguese: "até" },
    { english: "some", portuguese: "algum(a), alguns(as), um pouco" }
  ];

  const usefulPhrases = [
    { english: "What time is it?", portuguese: "Que horas são?" },
    { english: "It's two o'clock.", portuguese: "São duas horas." },
    { english: "I have lunch at noon.", portuguese: "Eu almoço ao meio-dia." },
    { english: "I do the dishes every day.", portuguese: "Eu lavo a louça todos os dias." },
    { english: "I need to do the laundry.", portuguese: "Eu preciso lavar roupa." }
  ];

  const grammarExamples = [
    { english: "What time do you go to bed?", portuguese: "A que horas você vai dormir?" },
    { english: "I go to bed at 10:00 p.m.", portuguese: "Eu vou dormir às 22:00." },
    { english: "What time do you get up?", portuguese: "A que horas você se levanta?" },
    { english: "I get up at 8:00 a.m.", portuguese: "Eu me levanto às 8:00." },
    { english: "They have class at seven o'clock.", portuguese: "Eles têm aula às sete horas." },
    { english: "We work until six o'clock.", portuguese: "Nós trabalhamos até as seis horas." }
  ];

  const realLifeSentences = [
    { english: "I cook lunch for my family.", portuguese: "Eu cozinho o almoço para minha família." },
    { english: "Do you want some tomato sauce?", portuguese: "Você quer um pouco de molho de tomate?" },
    { english: "I like to sleep in the living room.", portuguese: "Eu gosto de dormir na sala de estar." },
    { english: "You don't have to do the laundry today.", portuguese: "Você não precisa lavar roupa hoje." },
    { english: "Do they study until noon?", portuguese: "Eles estudam até o meio-dia?" },
    { english: "I need to clean my bedroom today.", portuguese: "Eu preciso limpar meu quarto hoje." },
    { english: "I don't have time to clean the kitchen now.", portuguese: "Eu não tenho tempo para limpar a cozinha agora." },
    { english: "We have to sleep on the couch.", portuguese: "Nós temos que dormir no sofá." },
    { english: "What time do you go to work?", portuguese: "A que horas você vai trabalhar?" },
    { english: "I usually go to work at 7:00 a.m.", portuguese: "Eu geralmente vou trabalhar às 7:00 da manhã." }
  ];

  // ========== VERBS SUBSTITUTION ==========
  const verbsSubstitution: SubstitutionExercise[] = [
    {
      key: "verb-1",
      original: "Eu cozinho. / Nós cozinhamos. / Eles cozinham.",
      options: [
        { label: "Eu cozinho", replacement: "I cook.", pt: "Eu cozinho." },
        { label: "Nós cozinhamos", replacement: "We cook.", pt: "Nós cozinhamos." },
        { label: "Eles cozinham", replacement: "They cook.", pt: "Eles/elas cozinham." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-2",
      original: "Eu não cozinho em casa. / Eles / Nós.",
      options: [
        { label: "Eu", replacement: "I don't cook at home.", pt: "Eu não cozinho em casa." },
        { label: "Eles", replacement: "They don't cook at home.", pt: "Eles não cozinham em casa." },
        { label: "Nós", replacement: "We don't cook at home.", pt: "Nós não cozinhamos em casa." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-3",
      original: "Você cozinha? / O que você cozinha? / Quando você cozinha?",
      options: [
        { label: "Você cozinha?", replacement: "Do you cook?", pt: "Você cozinha?" },
        { label: "O que?", replacement: "What do you cook?", pt: "O que você cozinha?" },
        { label: "Quando?", replacement: "When do you cook?", pt: "Quando você cozinha?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-4",
      original: "O que você gosta de cozinhar? / quer / prefere.",
      options: [
        { label: "gosta", replacement: "What do you like to cook?", pt: "O que você gosta de cozinhar?" },
        { label: "quer", replacement: "What do you want to cook?", pt: "O que você quer cozinhar?" },
        { label: "prefere", replacement: "What do you prefer to cook?", pt: "O que você prefere cozinhar?" },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-5",
      original: "Eu cozinho para minha esposa. / minha mãe / meus filhos.",
      options: [
        { label: "esposa", replacement: "I cook for my wife.", pt: "Eu cozinho para minha esposa." },
        { label: "mãe", replacement: "I cook for my mother.", pt: "Eu cozinho para minha mãe." },
        { label: "filhos", replacement: "I cook for my children.", pt: "Eu cozinho para meus filhos." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-6",
      original: "Eu gosto de cozinhar para você. / Nós / Eles.",
      options: [
        { label: "você", replacement: "I like to cook for you.", pt: "Eu gosto de cozinhar para você." },
        { label: "Nós", replacement: "We like to cook for you.", pt: "Nós gostamos de cozinhar para você." },
        { label: "Eles", replacement: "They like to cook for you.", pt: "Eles gostam de cozinhar para você." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-7",
      original: "limpar / Eu limpo. / Nós limpamos. / Eles limpam.",
      options: [
        { label: "limpar", replacement: "to clean.", pt: "limpar" },
        { label: "Eu limpo", replacement: "I clean.", pt: "Eu limpo." },
        { label: "Nós limpamos", replacement: "We clean.", pt: "Nós limpamos." },
        { label: "Eles limpam", replacement: "They clean.", pt: "Eles/elas limpam." },
      ],
      currentIndex: 0,
    },
    {
      key: "verb-8",
      original: "Eu não limpo. / Nós / Eles.",
      options: [
        { label: "Eu", replacement: "I don't clean.", pt: "Eu não limpo." },
        { label: "Nós", replacement: "We don't clean.", pt: "Nós não limpamos." },
        { label: "Eles", replacement: "They don't clean.", pt: "Eles não limpam." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== VOCABULARY SUBSTITUTION ==========
  const vocabSubstitution: SubstitutionExercise[] = [
    {
      key: "vocab-1",
      original: "Eu adoro comer macarrão no jantar. / frango / peixe.",
      options: [
        { label: "macarrão", replacement: "I love to eat pasta for dinner.", pt: "Eu adoro comer macarrão no jantar." },
        { label: "frango", replacement: "I love to eat chicken for dinner.", pt: "Eu adoro comer frango no jantar." },
        { label: "peixe", replacement: "I love to eat fish for dinner.", pt: "Eu adoro comer peixe no jantar." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-2",
      original: "Eles querem cozinhar macarrão hoje. / legumes / feijão.",
      options: [
        { label: "macarrão", replacement: "They want to cook pasta today.", pt: "Eles querem cozinhar macarrão hoje." },
        { label: "legumes", replacement: "They want to cook vegetables today.", pt: "Eles querem cozinhar legumes hoje." },
        { label: "feijão", replacement: "They want to cook beans today.", pt: "Eles querem cozinhar feijão hoje." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-3",
      original: "Você quer um pouco de molho? / café / chá.",
      options: [
        { label: "molho", replacement: "Do you want some sauce?", pt: "Você quer um pouco de molho?" },
        { label: "café", replacement: "Do you want some coffee?", pt: "Você quer um pouco de café?" },
        { label: "chá", replacement: "Do you want some tea?", pt: "Você quer um pouco de chá?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-4",
      original: "Eu quero um pouco de sopa, por favor. / água / batatas fritas.",
      options: [
        { label: "sopa", replacement: "I want some soup, please.", pt: "Eu quero um pouco de sopa, por favor." },
        { label: "água", replacement: "I want some water, please.", pt: "Eu quero um pouco de água, por favor." },
        { label: "batatas fritas", replacement: "I want some french fries, please.", pt: "Eu quero um pouco de batatas fritas, por favor." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-5",
      original: "Eu tenho alguns amigos no Reino Unido. / Estados Unidos.",
      options: [
        { label: "Reino Unido", replacement: "I have some friends in the United Kingdom.", pt: "Eu tenho alguns amigos no Reino Unido." },
        { label: "Estados Unidos", replacement: "I have some friends in the United States.", pt: "Eu tenho alguns amigos nos Estados Unidos." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-6",
      original: "Você tem tempo para estudar? / ir ao restaurante? / ir ao shopping?",
      options: [
        { label: "estudar", replacement: "Do you have time to study?", pt: "Você tem tempo para estudar?" },
        { label: "restaurante", replacement: "Do you have time to go to the restaurant?", pt: "Você tem tempo para ir ao restaurante?" },
        { label: "shopping", replacement: "Do you have time to go to the mall?", pt: "Você tem tempo para ir ao shopping?" },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-7",
      original: "Eu não quero limpar o banheiro agora. / cozinha / mesa.",
      options: [
        { label: "banheiro", replacement: "I don't want to clean the bathroom now.", pt: "Eu não quero limpar o banheiro agora." },
        { label: "cozinha", replacement: "I don't want to clean the kitchen now.", pt: "Eu não quero limpar a cozinha agora." },
        { label: "mesa", replacement: "I don't want to clean the table now.", pt: "Eu não quero limpar a mesa agora." },
      ],
      currentIndex: 0,
    },
    {
      key: "vocab-8",
      original: "Quando você limpa seu quarto? / cozinha? / sofá?",
      options: [
        { label: "quarto", replacement: "When do you clean your bedroom?", pt: "Quando você limpa seu quarto?" },
        { label: "cozinha", replacement: "When do you clean your kitchen?", pt: "Quando você limpa sua cozinha?" },
        { label: "sofá", replacement: "When do you clean your couch?", pt: "Quando você limpa seu sofá?" },
      ],
      currentIndex: 0,
    },
  ];

  // ========== USEFUL PHRASES SUBSTITUTION ==========
  const phrasesSubstitution: SubstitutionExercise[] = [
    {
      key: "phrase-1",
      original: "São sete horas. / três horas. / cinco horas. / nove horas.",
      options: [
        { label: "sete", replacement: "It's seven o'clock.", pt: "São sete horas." },
        { label: "três", replacement: "It's three o'clock.", pt: "São três horas." },
        { label: "cinco", replacement: "It's five o'clock.", pt: "São cinco horas." },
        { label: "nove", replacement: "It's nine o'clock.", pt: "São nove horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-2",
      original: "São duas horas. / É meio-dia. / É meia-noite.",
      options: [
        { label: "duas", replacement: "It's two o'clock.", pt: "São duas horas." },
        { label: "meio-dia", replacement: "It's noon.", pt: "É meio-dia." },
        { label: "meia-noite", replacement: "It's midnight.", pt: "É meia-noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-3",
      original: "Eu almoço com meus colegas de trabalho. / meus amigos.",
      options: [
        { label: "colegas", replacement: "I have lunch with my coworkers.", pt: "Eu almoço com meus colegas de trabalho." },
        { label: "amigos", replacement: "I have lunch with my friends.", pt: "Eu almoço com meus amigos." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-4",
      original: "Eu janto em casa. / no trabalho / no restaurante.",
      options: [
        { label: "casa", replacement: "I have dinner at home.", pt: "Eu janto em casa." },
        { label: "trabalho", replacement: "I have dinner at work.", pt: "Eu janto no trabalho." },
        { label: "restaurante", replacement: "I have dinner at the restaurant.", pt: "Eu janto no restaurante." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-5",
      original: "Você toma café da manhã sozinho?",
      options: [
        { label: "sozinho", replacement: "Do you have breakfast alone?", pt: "Você toma café da manhã sozinho?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-6",
      original: "Eu lavo a louça todos os dias. / de manhã / à noite.",
      options: [
        { label: "todos os dias", replacement: "I do the dishes every day.", pt: "Eu lavo a louça todos os dias." },
        { label: "de manhã", replacement: "I do the dishes in the morning.", pt: "Eu lavo a louça de manhã." },
        { label: "à noite", replacement: "I do the dishes at night.", pt: "Eu lavo a louça à noite." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-7",
      original: "Você precisa lavar roupa hoje? / agora? / à tarde?",
      options: [
        { label: "hoje", replacement: "Do you need to do the laundry today?", pt: "Você precisa lavar roupa hoje?" },
        { label: "agora", replacement: "Do you need to do the laundry now?", pt: "Você precisa lavar roupa agora?" },
        { label: "à tarde", replacement: "Do you need to do the laundry in the afternoon?", pt: "Você precisa lavar roupa à tarde?" },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-8",
      original: "Eu não gosto de lavar louça. / E você? / Eles / Nós.",
      options: [
        { label: "Eu", replacement: "I don't like to do the dishes.", pt: "Eu não gosto de lavar louça." },
        { label: "E você?", replacement: "I don't like to do the dishes. And you?", pt: "Eu não gosto de lavar louça. E você?" },
        { label: "Eles", replacement: "They don't like to do the dishes.", pt: "Eles não gostam de lavar louça." },
        { label: "Nós", replacement: "We don't like to do the dishes.", pt: "Nós não gostamos de lavar louça." },
      ],
      currentIndex: 0,
    },
    {
      key: "phrase-9",
      original: "Eu não quero lavar roupa agora. / almoçar agora / jantar agora.",
      options: [
        { label: "lavar roupa", replacement: "I don't want to do the laundry now.", pt: "Eu não quero lavar roupa agora." },
        { label: "almoçar", replacement: "I don't want to have lunch now.", pt: "Eu não quero almoçar agora." },
        { label: "jantar", replacement: "I don't want to have dinner now.", pt: "Eu não quero jantar agora." },
      ],
      currentIndex: 0,
    },
  ];

  // ========== GRAMMAR SUBSTITUTION ==========
  const grammarSubstitution: SubstitutionExercise[] = [
    {
      key: "grammar-1",
      original: "A que horas você vai dormir?",
      options: [
        { label: "vai dormir", replacement: "What time do you go to bed?", pt: "A que horas você vai dormir?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-2",
      original: "A que horas você toma banho? / lê seus e-mails? / estuda inglês?",
      options: [
        { label: "toma banho", replacement: "What time do you take a shower?", pt: "A que horas você toma banho?" },
        { label: "lê e-mails", replacement: "What time do you read your emails?", pt: "A que horas você lê seus e-mails?" },
        { label: "estuda inglês", replacement: "What time do you study English?", pt: "A que horas você estuda inglês?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-3",
      original: "A que horas você quer ir ao shopping? / restaurante? / hospital?",
      options: [
        { label: "shopping", replacement: "What time do you want to go to the mall?", pt: "A que horas você quer ir ao shopping?" },
        { label: "restaurante", replacement: "What time do you want to go to the restaurant?", pt: "A que horas você quer ir ao restaurante?" },
        { label: "hospital", replacement: "What time do you want to go to the hospital?", pt: "A que horas você quer ir ao hospital?" },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-4",
      original: "Eu vou para a escola às sete horas. / seis horas / oito horas.",
      options: [
        { label: "sete", replacement: "I go to school at seven o'clock.", pt: "Eu vou para a escola às sete horas." },
        { label: "seis", replacement: "I go to school at six o'clock.", pt: "Eu vou para a escola às seis horas." },
        { label: "oito", replacement: "I go to school at eight o'clock.", pt: "Eu vou para a escola às oito horas." },
      ],
      currentIndex: 0,
    },
    {
      key: "grammar-5",
      original: "Eu não vou dormir às onze horas. / dez horas / meia-noite.",
      options: [
        { label: "onze", replacement: "I don't go to bed at eleven o'clock.", pt: "Eu não vou dormir às onze horas." },
        { label: "dez", replacement: "I don't go to bed at ten o'clock.", pt: "Eu não vou dormir às dez horas." },
        { label: "meia-noite", replacement: "I don't go to bed at midnight.", pt: "Eu não vou dormir à meia-noite." },
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

        {/* Título central com imagem */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🕒 Lesson 19 - Lifestyle & Weekly Planning
          </h1>
          <SpeakSentence text="Learn to talk about daily routines, house chores, telling time, and weekly planning." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about daily routines, house chores, telling time, and weekly planning.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Lifestyle and weekly planning"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">🕒 Daily routines, chores, and telling time</p>
        </div>

        {/* Section 1 - Verbs */}
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

        {/* Section 2 - Vocabulary */}
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

            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <SpeakSentence text="I have some soup for lunch." className="text-blue-600 font-bold">
                  I have some soup for lunch.
                </SpeakSentence> = Eu tomo um pouco de sopa no almoço.
              </p>
              <p>
                <SpeakSentence text="I need to clean the kitchen." className="text-blue-600 font-bold">
                  I need to clean the kitchen.
                </SpeakSentence> = Eu preciso limpar a cozinha.
              </p>
              <p>
                <SpeakSentence text="She cooks pasta for dinner." className="text-blue-600 font-bold">
                  She cooks pasta for dinner.
                </SpeakSentence> = Ela cozinha macarrão no jantar.
              </p>
              <p>
                <SpeakSentence text="We clean the bathroom on Saturdays." className="text-blue-600 font-bold">
                  We clean the bathroom on Saturdays.
                </SpeakSentence> = Nós limpamos o banheiro aos sábados.
              </p>
              <p>
                <SpeakSentence text="I have lunch at noon." className="text-blue-600 font-bold">
                  I have lunch at noon.
                </SpeakSentence> = Eu almoço ao meio-dia.
              </p>
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

        {/* Section 3 - Useful Phrases */}
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
            <SpeakSentence text="Practice common phrases for daily communication and telling time" className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases for daily communication and telling time
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

        {/* Section 4 - Grammar */}
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
            <SpeakSentence text="Structures for asking about daily routines and schedules" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking about daily routines and schedules
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
              Practice daily routines, house chores, and time management
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
                        src={cookingImage}
                        alt="Cooking and meal preparation"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cooking meals and preparing food
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={cleaningImage}
                        alt="Cleaning and house chores"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cleaning and house maintenance
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={bedroomImage}
                        alt="Bedroom and rest"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Bedroom, rest, and routines
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Wrap Up */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">
              Numbers, telling time, and daily routines
            </p>
          </div>

          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Section 7 - Assessment */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 ASSESSMENT</h2>
            <SpeakSentence text="Answer the questions using complete sentences" className="mt-2 text-blue-100 italic">
              📝 Answer the questions using complete sentences
            </SpeakSentence>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">1. What time do you get up?</p>
                <SpeakSentence text="I get up at 7 AM." className="mt-2 text-gray-600 block">
                  (Example: I get up at 7 AM. / I usually get up early.)
                </SpeakSentence>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">2. What time do you have breakfast?</p>
                <SpeakSentence text="I have breakfast at 8 AM." className="mt-2 text-gray-600 block">
                  (Example: I have breakfast at 8 AM. / I have breakfast at home.)
                </SpeakSentence>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">3. What chores do you do at home?</p>
                <SpeakSentence text="I cook and clean the kitchen." className="mt-2 text-gray-600 block">
                  (Example: I cook and clean the kitchen. / I do the dishes and do the laundry.)
                </SpeakSentence>
              </div>

              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">4. What time do you go to bed?</p>
                <SpeakSentence text="I go to bed at 10 PM." className="mt-2 text-gray-600 block">
                  (Example: I go to bed at 10 PM. / I go to bed late on weekends.)
                </SpeakSentence>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 - Final Task */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL TASK</h2>
            <SpeakSentence text="Talk about your daily routine:" className="mt-2 text-blue-100 italic">
              🗣️ Talk about your daily routine:
            </SpeakSentence>
          </div>

          <div className="p-8">
            <div className="bg-green-50 p-6 rounded-2xl space-y-4">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">What time you get up and have breakfast</h3>
                  <SpeakSentence text="I get up at 7 AM and have breakfast at 8 AM." className="text-gray-600">
                    (Example: I get up at 7 AM and have breakfast at 8 AM.)
                  </SpeakSentence>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">What house chores you do during the week</h3>
                  <SpeakSentence text="I cook and clean the kitchen every day." className="text-gray-600">
                    (Example: I cook and clean the kitchen every day. / I do the dishes and do the laundry.)
                  </SpeakSentence>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">What time you have dinner and go to bed</h3>
                  <SpeakSentence text="I have dinner at 7 PM and go to bed at 10 PM." className="text-gray-600">
                    (Example: I have dinner at 7 PM and go to bed at 10 PM.)
                  </SpeakSentence>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-700 italic">💡 Tip: Use the Simple Present Tense and time expressions (at, in the morning, at night) to describe your routine!</p>
              <SpeakSentence text="I get up at 7 AM. I have breakfast at 8 AM. I cook lunch for my family. I clean the kitchen every day. I go to bed at 10 PM." className="mt-2 text-gray-600 block">
                Example: "I get up at 7 AM. I have breakfast at 8 AM. I cook lunch for my family. I clean the kitchen every day. I go to bed at 10 PM."
              </SpeakSentence>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson18")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (18)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson20")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (20) &rarr;
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