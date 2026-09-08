"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

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

const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => {
    if (!text || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
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
        if (speechText && typeof window !== 'undefined') {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = 'en-US';
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          const voices = window.speechSynthesis.getVoices();
          const americanFemaleVoices = voices.filter(voice =>
            (voice.lang === 'en-US' || voice.lang.startsWith('en-US')) &&
            (voice.name.toLowerCase().includes('samantha') ||
             voice.name.toLowerCase().includes('google us english') ||
             voice.name === 'Google US English')
          );
          const americanVoices = voices.filter(voice => voice.lang === 'en-US' || voice.lang.startsWith('en-US'));
          if (americanFemaleVoices.length > 0) utterance.voice = americanFemaleVoices[0];
          else if (americanVoices.length > 0) utterance.voice = americanVoices[0];
          window.speechSynthesis.speak(utterance);
        }
      }}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500" />
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
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300">Salvar Anotação</button>
        </div>
      </div>
    </div>
  );
}

const PencilIcon = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none" aria-label="Fazer anotações" title="Clique para fazer anotações">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  </button>
);

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
  const [showNumberExplanation, setShowNumberExplanation] = useState(false);
  const [showTimeFormatExplanation, setShowTimeFormatExplanation] = useState(false);
  const [showTellingTimeExplanation, setShowTellingTimeExplanation] = useState(false);

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

  useEffect(() => {
    if (typeof window !== 'undefined') window.speechSynthesis.getVoices();
  }, []);

  // Images
  const mainImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cookingImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const cleaningImage = "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // ========== LESSON 19 DATA ==========
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

  // Real Life Practice Sentences
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

  // Define highlight words for each sentence (index -> array of words to highlight)
  const highlightMap: Record<number, string[]> = {
    0: ["cook", "lunch", "family"],
    1: ["some", "sauce"],
    2: ["sleep", "living room"],
    3: ["do the laundry"],
    4: ["study", "noon"],
    5: ["clean", "bedroom"],
    6: ["clean", "kitchen"],
    7: ["sleep", "couch"],
    8: ["go", "work"],
    9: ["go", "work"]
  };

  // Helper to render sentence with highlighted words
  const renderHighlightedSentence = (sentence: string, highlightWords: string[]) => {
    const highlightedSentence = sentence.split(/(\s+)/).map((part, idx) => {
      const trimmed = part.trim();
      if (trimmed.length === 0) return part;
      const match = highlightWords.find(hw => hw.toLowerCase() === trimmed.toLowerCase());
      if (match) {
        return <span key={idx} className="text-blue-600 font-bold">{part}</span>;
      }
      return part;
    });
    return <span>{highlightedSentence}</span>;
  };

  const getHighlightedSentence = (index: number) => {
    const sentence = realLifeSentences[index].english;
    const highlights = highlightMap[index] || [];
    return renderHighlightedSentence(sentence, highlights);
  };

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
            <img src={mainImage} alt="Weekly planning calendar" className="w-full h-full object-cover rounded-2xl shadow-md" />
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
                  <SpeakText text={verb.english} className="text-blue-600 font-bold">{verb.english}</SpeakText> = {verb.portuguese}
                </li>
              ))}
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      1. <SpeakText text="I cook" className="text-blue-600 font-bold">I cook</SpeakText> / <SpeakText text="We cook" className="text-blue-600 font-bold">We cook</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu cozinho / nós cozinhamos</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      2. <SpeakText text="They cook" className="text-blue-600 font-bold">They cook</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eles/elas cozinham</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      3. <SpeakText text="I do not cook at home" className="text-blue-600 font-bold">I do not cook at home</SpeakText> / <SpeakText text="They do not cook" className="text-blue-600 font-bold">They</SpeakText> / <SpeakText text="We do not cook" className="text-blue-600 font-bold">We</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu não cozinho em casa / eles não cozinham / nós não cozinhamos</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      4. <SpeakText text="Do you cook?" className="text-blue-600 font-bold">Do you cook?</SpeakText> / <SpeakText text="What do you cook?" className="text-blue-600 font-bold">What do you cook?</SpeakText> / <SpeakText text="When do you cook?" className="text-blue-600 font-bold">When do you cook?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 você cozinha? / o que você cozinha? / quando?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      5. <SpeakText text="What do you like to cook?" className="text-blue-600 font-bold">What do you like to cook?</SpeakText> / <SpeakText text="What do you want to cook?" className="text-blue-600 font-bold">want?</SpeakText> / <SpeakText text="What do you prefer to cook?" className="text-blue-600 font-bold">prefer?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 o que você gosta de cozinhar? / quer / prefere</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      6. <SpeakText text="I cook for my wife" className="text-blue-600 font-bold">I cook for my wife</SpeakText> / <SpeakText text="my mother" className="text-blue-600 font-bold">my mother</SpeakText> / <SpeakText text="my children" className="text-blue-600 font-bold">my children</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu cozinho para minha esposa / minha mãe / meus filhos</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      7. <SpeakText text="I like to cook for you" className="text-blue-600 font-bold">I like to cook for you</SpeakText> / <SpeakText text="We" className="text-blue-600 font-bold">We</SpeakText> / <SpeakText text="They" className="text-blue-600 font-bold">They</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu gosto de cozinhar para você / nós / eles/elas</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      8. <SpeakText text="clean" className="text-blue-600 font-bold">clean</SpeakText> / <SpeakText text="I clean" className="text-blue-600 font-bold">I clean</SpeakText> / <SpeakText text="We clean" className="text-blue-600 font-bold">We</SpeakText> / <SpeakText text="They clean" className="text-blue-600 font-bold">They</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 limpar / eu limpo / nós limpamos / eles limpam</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      9. <SpeakText text="I do not clean" className="text-blue-600 font-bold">I do not clean</SpeakText> / <SpeakText text="We do not clean" className="text-blue-600 font-bold">We</SpeakText> / <SpeakText text="They do not clean" className="text-blue-600 font-bold">They</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu não limpo / nós não limpamos / eles não limpam</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 2 – VOCABULARY ===================== */}
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      1. <SpeakText text="I love to eat pasta for dinner" className="text-blue-600 font-bold">I love to eat pasta for dinner</SpeakText> / <SpeakText text="chicken" className="text-blue-600 font-bold">chicken</SpeakText> / <SpeakText text="fish" className="text-blue-600 font-bold">fish</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eu adoro comer macarrão no jantar / frango / peixe</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      2. <SpeakText text="They want to cook pasta today" className="text-blue-600 font-bold">They want to cook pasta today</SpeakText> / <SpeakText text="vegetables" className="text-blue-600 font-bold">vegetables</SpeakText> / <SpeakText text="beans" className="text-blue-600 font-bold">beans</SpeakText>.
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 eles querem cozinhar macarrão hoje / legumes / feijão</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      3. <SpeakText text="Do you want some sauce?" className="text-blue-600 font-bold">Do you want some sauce?</SpeakText> / <SpeakText text="Do you want some coffee?" className="text-blue-600 font-bold">coffee?</SpeakText> / <SpeakText text="Do you want some tea?" className="text-blue-600 font-bold">tea?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 você quer um pouco de molho? / café? / chá?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      4. <SpeakText text="I want some soup, please." className="text-blue-600 font-bold">I want some soup, please.</SpeakText> / <SpeakText text="I want some water, please." className="text-blue-600 font-bold">I want some water, please.</SpeakText> / <SpeakText text="I want some french fries, please." className="text-blue-600 font-bold">I want some french fries, please.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu quero um pouco de sopa, por favor. / Eu quero um pouco de água, por favor. / Eu quero um pouco de batatas fritas, por favor.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      5. <SpeakText text="I have some friends in the United Kingdom." className="text-blue-600 font-bold">I have some friends in the United Kingdom.</SpeakText> / <SpeakText text="I have some friends in the United States." className="text-blue-600 font-bold">I have some friends in the United States.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu tenho alguns amigos no Reino Unido. / Eu tenho alguns amigos nos Estados Unidos.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      6. <SpeakText text="Do you have time to study?" className="text-blue-600 font-bold">Do you have time to study?</SpeakText> / <SpeakText text="Do you have time to go to the restaurant?" className="text-blue-600 font-bold">Do you have time to go to the restaurant?</SpeakText> / <SpeakText text="Do you have time to go to the mall?" className="text-blue-600 font-bold">Do you have time to go to the mall?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Você tem tempo para estudar? / Você tem tempo para ir ao restaurante? / Você tem tempo para ir ao shopping?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      7. <SpeakText text="I don't want to clean the bathroom now." className="text-blue-600 font-bold">I don't want to clean the bathroom now.</SpeakText> / <SpeakText text="I don't want to clean the kitchen now." className="text-blue-600 font-bold">I don't want to clean the kitchen now.</SpeakText> / <SpeakText text="I don't want to clean the table now." className="text-blue-600 font-bold">I don't want to clean the table now.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu não quero limpar o banheiro agora. / Eu não quero limpar a cozinha agora. / Eu não quero limpar a mesa agora.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      8. <SpeakText text="When do you clean your bedroom?" className="text-blue-600 font-bold">When do you clean your bedroom?</SpeakText> / <SpeakText text="When do you clean your kitchen?" className="text-blue-600 font-bold">When do you clean your kitchen?</SpeakText> / <SpeakText text="When do you clean your couch?" className="text-blue-600 font-bold">When do you clean your couch?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Quando você limpa seu quarto? / Quando você limpa sua cozinha? / Quando você limpa seu sofá?</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 3 – USEFUL PHRASES ===================== */}
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      1. <SpeakText text="It's seven o'clock." className="text-blue-600 font-bold">It's seven o'clock.</SpeakText> / <SpeakText text="It's three o'clock." className="text-blue-600 font-bold">It's three o'clock.</SpeakText> / <SpeakText text="It's five o'clock." className="text-blue-600 font-bold">It's five o'clock.</SpeakText> / <SpeakText text="It's nine o'clock." className="text-blue-600 font-bold">It's nine o'clock.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 São sete horas. / São três horas. / São cinco horas. / São nove horas.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      2. <SpeakText text="It's two o'clock." className="text-blue-600 font-bold">It's two o'clock.</SpeakText> / <SpeakText text="It's noon." className="text-blue-600 font-bold">It's noon.</SpeakText> / <SpeakText text="It's midnight." className="text-blue-600 font-bold">It's midnight.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 São duas horas. / É meio-dia. / É meia-noite.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      3. <SpeakText text="I have lunch with my coworkers." className="text-blue-600 font-bold">I have lunch with my coworkers.</SpeakText> / <SpeakText text="I have lunch with my friends." className="text-blue-600 font-bold">I have lunch with my friends.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu almoço com meus colegas de trabalho. / Eu almoço com meus amigos.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      4. <SpeakText text="I have dinner at home." className="text-blue-600 font-bold">I have dinner at home.</SpeakText> / <SpeakText text="I have dinner at work." className="text-blue-600 font-bold">I have dinner at work.</SpeakText> / <SpeakText text="I have dinner at the restaurant." className="text-blue-600 font-bold">I have dinner at the restaurant.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu janto em casa. / Eu janto no trabalho. / Eu janto no restaurante.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      5. <SpeakText text="Do you have breakfast alone?" className="text-blue-600 font-bold">Do you have breakfast alone?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Você toma café da manhã sozinho?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      6. <SpeakText text="I do the dishes every day." className="text-blue-600 font-bold">I do the dishes every day.</SpeakText> / <SpeakText text="I do the dishes in the morning." className="text-blue-600 font-bold">I do the dishes in the morning.</SpeakText> / <SpeakText text="I do the dishes at night." className="text-blue-600 font-bold">I do the dishes at night.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu lavo a louça todos os dias. / Eu lavo a louça de manhã. / Eu lavo a louça à noite.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      7. <SpeakText text="Do you need to do the laundry today?" className="text-blue-600 font-bold">Do you need to do the laundry today?</SpeakText> / <SpeakText text="Do you need to do the laundry now?" className="text-blue-600 font-bold">now?</SpeakText> / <SpeakText text="Do you need to do the laundry in the afternoon?" className="text-blue-600 font-bold">in the afternoon?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Você precisa lavar roupa hoje? / Você precisa lavar roupa agora? / Você precisa lavar roupa à tarde?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      8. <SpeakText text="I don't like to do the dishes." className="text-blue-600 font-bold">I don't like to do the dishes.</SpeakText> / <SpeakText text="And you?" className="text-blue-600 font-bold">And you?</SpeakText> / <SpeakText text="They don't like to do the dishes." className="text-blue-600 font-bold">They don't like to do the dishes.</SpeakText> / <SpeakText text="We don't like to do the dishes." className="text-blue-600 font-bold">We don't like to do the dishes.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu não gosto de lavar louça. / E você? / Eles não gostam de lavar louça. / Nós não gostamos de lavar louça.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      9. <SpeakText text="I don't want to do the laundry now." className="text-blue-600 font-bold">I don't want to do the laundry now.</SpeakText> / <SpeakText text="I don't want to have lunch now." className="text-blue-600 font-bold">I don't want to have lunch now.</SpeakText> / <SpeakText text="I don't want to have dinner now." className="text-blue-600 font-bold">I don't want to have dinner now.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu não quero lavar roupa agora. / Eu não quero almoçar agora. / Eu não quero jantar agora.</span>
                  </p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      1. <SpeakText text="What time do you go to bed?" className="text-blue-600 font-bold">What time do you go to bed?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 A que horas você vai dormir?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      2. <SpeakText text="What time do you take a shower?" className="text-blue-600 font-bold">What time do you take a shower?</SpeakText> / <SpeakText text="What time do you read your emails?" className="text-blue-600 font-bold">What time do you read your emails?</SpeakText> / <SpeakText text="What time do you study English?" className="text-blue-600 font-bold">What time do you study English?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 A que horas você toma banho? / A que horas você lê seus e-mails? / A que horas você estuda inglês?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      3. <SpeakText text="What time do you want to go to the mall?" className="text-blue-600 font-bold">What time do you want to go to the mall?</SpeakText> / <SpeakText text="What time do you want to go to the restaurant?" className="text-blue-600 font-bold">What time do you want to go to the restaurant?</SpeakText> / <SpeakText text="What time do you want to go to the hospital?" className="text-blue-600 font-bold">What time do you want to go to the hospital?</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 A que horas você quer ir ao shopping? / A que horas você quer ir ao restaurante? / A que horas você quer ir ao hospital?</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      4. <SpeakText text="I go to school at seven o'clock." className="text-blue-600 font-bold">I go to school at seven o'clock.</SpeakText> / <SpeakText text="I go to school at six o'clock." className="text-blue-600 font-bold">I go to school at six o'clock.</SpeakText> / <SpeakText text="I go to school at eight o'clock." className="text-blue-600 font-bold">I go to school at eight o'clock.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu vou para a escola às sete horas. / Eu vou para a escola às seis horas. / Eu vou para a escola às oito horas.</span>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="block text-xl font-semibold">
                      5. <SpeakText text="I don't go to bed at eleven o'clock." className="text-blue-600 font-bold">I don't go to bed at eleven o'clock.</SpeakText> / <SpeakText text="I don't go to bed at ten o'clock." className="text-blue-600 font-bold">I don't go to bed at ten o'clock.</SpeakText> / <SpeakText text="I don't go to bed at midnight." className="text-blue-600 font-bold">I don't go to bed at midnight.</SpeakText>
                    </span>
                    <span className="block text-sm text-gray-500 mt-1">🇧🇷 Eu não vou dormir às onze horas. / Eu não vou dormir às dez horas. / Eu não vou dormir à meia-noite.</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================== SECTION 5 – MAKE IT YOURS ===================== */}
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
            {/* Legenda para substituição */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">💡 Dica:</span> Substitua as palavras destacadas em <span className="text-blue-600 font-bold">azul</span> ou <span className="text-purple-600 font-bold">roxo</span> por outras palavras para criar novas frases. 
                Por exemplo: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">cook</span> <span className="text-purple-600 font-bold">lunch</span> for my <span className="text-blue-600 font-bold">family</span>."</span> → 
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">clean</span> the <span className="text-purple-600 font-bold">kitchen</span> for my <span className="text-blue-600 font-bold">mother</span>."</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences – with highlighted words */}
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          <span className="mr-1">{index + 1}.</span>
                          {getHighlightedSentence(index)}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                {/* Images */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={cookingImage} alt="Cooking and meal preparation" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cooking meals and preparing food</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={cleaningImage} alt="Cleaning and house chores" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cleaning and house maintenance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Numbers, telling time, and daily routines" className="mt-2 text-blue-100 italic">
                📝 Numbers, telling time, and daily routines
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column – Numbers and Time */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">NUMBERS</h3>
                  <button
                    onClick={() => setShowNumberExplanation(!showNumberExplanation)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNumberExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showNumberExplanation && (
                  <div className="mb-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">📚 Numbers Explanation:</p>
                    <p className="text-blue-200 text-sm mb-2">Numbers in English follow patterns:</p>
                    <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                      <li>30-39: thirty + one, two, three... (thirty-one, thirty-two)</li>
                      <li>40-49: forty + one, two, three... (forty-one, forty-two)</li>
                      <li>50-59: fifty + one, two, three... (fifty-one, fifty-two)</li>
                      <li>60-69: sixty + one, two, three... (sixty-one, sixty-two)</li>
                    </ul>
                    <p className="text-blue-200 text-sm mt-2">For time: Use "o'clock" only with exact hours: 3:00 = three o'clock</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <p className="font-bold text-xl">30</p>
                    <p className="text-blue-200">thirty</p>
                  </div>
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <p className="font-bold text-xl">40</p>
                    <p className="text-blue-200">forty</p>
                  </div>
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <p className="font-bold text-xl">50</p>
                    <p className="text-blue-200">fifty</p>
                  </div>
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <p className="font-bold text-xl">60</p>
                    <p className="text-blue-200">sixty</p>
                  </div>
                </div>
              </div>

              {/* Telling Time Section */}
              <div className="mt-8 pt-6 border-t border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-yellow-300">TELLING TIME</h4>
                  <button
                    onClick={() => setShowTellingTimeExplanation(!showTellingTimeExplanation)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showTellingTimeExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showTellingTimeExplanation && (
                  <div className="mb-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">⏰ Telling Time Rules:</p>
                    <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                      <li>4:00 = "four o'clock" (exact hour)</li>
                      <li>4:15 = "four fifteen" or "quarter past four"</li>
                      <li>4:30 = "four thirty" or "half past four"</li>
                      <li>4:45 = "four forty-five" or "quarter to five"</li>
                      <li>4:50 = "four fifty" or "ten to five"</li>
                    </ul>
                    <p className="text-blue-200 text-sm mt-2">Use "past" for minutes 1-30, "to" for minutes 31-59</p>
                  </div>
                )}
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <SpeakText text="four o'clock" className="mr-2 text-blue-200 hover:text-white">
                        <Volume2 size={16} className="inline" />
                      </SpeakText>
                      <div>
                        <p className="font-bold">4:00</p>
                        <p className="text-blue-200 text-sm">It's four o'clock</p>
                      </div>
                    </div>
                  </div>
                  {showTellingTimeExplanation && (
                    <>
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <SpeakText text="four fifteen" className="mr-2 text-blue-200 hover:text-white">
                            <Volume2 size={16} className="inline" />
                          </SpeakText>
                          <div>
                            <p className="font-bold">4:15</p>
                            <p className="text-blue-200 text-sm">It's four fifteen</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <SpeakText text="four thirty" className="mr-2 text-blue-200 hover:text-white">
                            <Volume2 size={16} className="inline" />
                          </SpeakText>
                          <div>
                            <p className="font-bold">4:30</p>
                            <p className="text-blue-200 text-sm">It's four thirty</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <SpeakText text="four fifty" className="mr-2 text-blue-200 hover:text-white">
                            <Volume2 size={16} className="inline" />
                          </SpeakText>
                          <div>
                            <p className="font-bold">4:50</p>
                            <p className="text-blue-200 text-sm">It's four fifty</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <SpeakText text="ten to five" className="mr-2 text-blue-200 hover:text-white">
                            <Volume2 size={16} className="inline" />
                          </SpeakText>
                          <div>
                            <p className="font-bold">4:50</p>
                            <p className="text-blue-200 text-sm">It's ten to five</p>
                            <p className="text-blue-300 text-xs">(alternate way)</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right column – Time Formats and Meal Times */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">TIME FORMATS</h3>
                    <button
                      onClick={() => setShowTimeFormatExplanation(!showTimeFormatExplanation)}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showTimeFormatExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showTimeFormatExplanation && (
                    <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-700">
                      <p className="text-yellow-200 text-sm font-medium mb-2">🕐 Time Formats Explained:</p>
                      <p className="text-blue-200 text-sm mb-2">12-hour format uses AM/PM:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                        <li>AM = Ante Meridiem (before noon) = 00:00 - 11:59</li>
                        <li>PM = Post Meridiem (after noon) = 12:00 - 23:59</li>
                      </ul>
                      <p className="text-blue-200 text-sm mt-2">Examples:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4">
                        <li>8:00 AM = eight in the morning</li>
                        <li>3:00 PM = three in the afternoon</li>
                        <li>9:00 PM = nine at night</li>
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-xl">A.M.</p>
                      <p className="text-blue-200 text-sm">00:00 – 11:59</p>
                      <p className="text-blue-300 text-xs">morning</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-xl">P.M.</p>
                      <p className="text-blue-200 text-sm">12:00 – 23:59</p>
                      <p className="text-blue-300 text-xs">afternoon/evening</p>
                    </div>
                  </div>
                </div>

                {/* Meal Times Section */}
                <div className="pt-6 border-t border-blue-700">
                  <div className="flex items-center mb-3">
                    <h4 className="font-bold text-lg text-yellow-300">MEAL TIMES</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <SpeakText text="to have breakfast" className="mr-2 text-blue-200 hover:text-white">
                          <Volume2 size={16} className="inline" />
                        </SpeakText>
                        <div>
                          <p className="font-bold">to have breakfast</p>
                          <p className="text-blue-200 text-sm">to have breakfast</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <SpeakText text="to have dinner" className="mr-2 text-blue-200 hover:text-white">
                          <Volume2 size={16} className="inline" />
                        </SpeakText>
                        <div>
                          <p className="font-bold">to have dinner</p>
                          <p className="text-blue-200 text-sm">to have dinner</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <SpeakText text="to have lunch" className="mr-2 text-blue-200 hover:text-white">
                          <Volume2 size={16} className="inline" />
                        </SpeakText>
                        <div>
                          <p className="font-bold">to have lunch</p>
                          <p className="text-blue-200 text-sm">to have lunch</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-4 bg-blue-700 rounded-lg border border-blue-600">
                      <h5 className="font-bold text-yellow-200 mb-3">📋 Meal Times</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Breakfast</span>
                          <span className="text-blue-200 text-sm">6:00 - 9:00 a.m.</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Lunch</span>
                          <span className="text-blue-200 text-sm">11:30 - 1:30 p.m.</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Dinner</span>
                          <span className="text-blue-200 text-sm">6:00 - 9:00 p.m.</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-blue-900 rounded-md">
                        <p className="text-yellow-100 text-sm font-medium">💡 Remember:</p>
                        <p className="text-blue-200 text-sm">In English, we use "have" with meals:</p>
                        <p className="text-blue-200 text-sm">• <span className="cursor-pointer hover:text-blue-100" onClick={() => { const u = new SpeechSynthesisUtterance("I have breakfast at 7 a.m."); u.lang='en-US'; window.speechSynthesis.speak(u); }}>I have breakfast at 7 a.m.</span></p>
                        <p className="text-blue-200 text-sm">• We have lunch at noon.</p>
                        <p className="text-blue-200 text-sm">• They have dinner at 8 p.m.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}