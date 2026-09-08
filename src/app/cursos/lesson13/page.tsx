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
// MAIN COMPONENT – LESSON 13 (with Lesson 19 style)
// ============================================

export default function Lesson13PersonalInfoRoutine() {
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
  const [showAanExplanation, setShowAanExplanation] = useState(false);

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

  // ========== IMAGES (from Lesson 13) ==========
  const mainImage = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const electronicsImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80";
  const personalItemsImage = "https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80";
  const backgroundImage = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  // ========== LESSON 13 DATA ==========
  const verbs = [
    { english: "to need", portuguese: "precisar (de)" },
    { english: "to have", portuguese: "ter" }
  ];

  const newWords = [
    { english: "cell phone", portuguese: "telefone celular" },
    { english: "tablet", portuguese: "tablet" },
    { english: "computer", portuguese: "computador" },
    { english: "car", portuguese: "carro" },
    { english: "shoes", portuguese: "sapatos" },
    { english: "glasses", portuguese: "óculos" },
    { english: "house", portuguese: "casa" },
    { english: "old", portuguese: "velho(a)" },
    { english: "new", portuguese: "novo(a)" },
    { english: "American", portuguese: "americano(a)" },
    { english: "British", portuguese: "britânico(a)" },
    { english: "Brazilian", portuguese: "brasileiro(a)" },
    { english: "really", portuguese: "realmente / muito" },
    { english: "a", portuguese: "um / uma" },
    { english: "an", portuguese: "um / uma (antes de som de vogal)" }
  ];

  const usefulPhrases = [
    { english: "I don't need to go to school today.", portuguese: "Eu não preciso ir à escola hoje." },
    { english: "I need to speak to a school teacher.", portuguese: "Eu preciso falar com um professor da escola." },
    { english: "You speak English very well.", portuguese: "Você fala inglês muito bem." }
  ];

  const grammarExamples = [
    { english: "Do you need a tablet?", portuguese: "Você precisa de um tablet?" },
    { english: "I want an apple.", portuguese: "Eu quero uma maçã." },
    { english: "I like your new shoes.", portuguese: "Eu gosto dos seus sapatos novos." },
    { english: "They have an old car.", portuguese: "Eles têm um carro velho." },
    { english: "We want a new house.", portuguese: "Nós queremos uma casa nova." },
    { english: "I have a Brazilian friend.", portuguese: "Eu tenho um amigo brasileiro." },
    { english: "I like American cookies.", portuguese: "Eu gosto de cookies americanos." },
    { english: "Do you have a British co-worker?", portuguese: "Você tem um colega de trabalho britânico?" }
  ];

  const realLifeSentences = [
    { english: "We need to speak with your husband.", portuguese: "Precisamos falar com seu marido." },
    { english: "I need a new computer.", portuguese: "Eu preciso de um computador novo." },
    { english: "We don't have a Brazilian boss.", portuguese: "Nós não temos um chefe brasileiro." },
    { english: "I really need new shoes.", portuguese: "Eu realmente preciso de sapatos novos." },
    { english: "What do you need to study?", portuguese: "O que você precisa estudar?" },
    { english: "They have an old car.", portuguese: "Eles têm um carro velho." },
    { english: "I have a new cell phone.", portuguese: "Eu tenho um celular novo." },
    { english: "I have to go. Bye.", portuguese: "Eu tenho que ir. Tchau." },
    { english: "We really have to study a new language.", portuguese: "Nós realmente temos que estudar um novo idioma." },
    { english: "Where do you have to go today?", portuguese: "Onde você tem que ir hoje?" }
  ];

  // (Optional) highlight map for "Make It Yours" – we keep the original sentences without highlights,
  // but we add the substitution legend as in Lesson 19.
  // We'll just render the sentences as plain text with SpeakSentence.

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${backgroundImage})`,
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
            📘 Lesson 13 - Personal Information & Routine
          </h1>
          <SpeakSentence text="Learn to talk about personal belongings, daily needs, and routine activities. Master verbs 'to need' and 'to have'." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about personal belongings, daily needs, and routine activities. Master verbs "to need" and "to have".
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img src={mainImage} alt="Personal items and daily routine" className="w-full h-full object-cover rounded-2xl shadow-md" />
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
                    1. I <SpeakText text="need" className="text-blue-600 font-bold">need</SpeakText> to study. / to work / to go
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso estudar. / trabalhar / ir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="Do you need" className="text-blue-600 font-bold">Do you need</SpeakText> a car? / a computer / new shoes
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você precisa de um carro? / um computador / sapatos novos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="They need" className="text-blue-600 font-bold">They need</SpeakText> to eat. / to drink / to sleep
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles precisam comer. / beber / dormir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="We need" className="text-blue-600 font-bold">We need</SpeakText> a new house. / a car / a cell phone
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós precisamos de uma casa nova. / um carro / um celular</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="She needs" className="text-blue-600 font-bold">She needs</SpeakText> glasses. / a tablet / a computer
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela precisa de óculos. / um tablet / um computador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. I <SpeakText text="have" className="text-blue-600 font-bold">have</SpeakText> a car. / a house / a cell phone
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu tenho um carro. / uma casa / um celular</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="Do you have" className="text-blue-600 font-bold">Do you have</SpeakText> a tablet? / a computer / new shoes
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem um tablet? / um computador / sapatos novos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="They have" className="text-blue-600 font-bold">They have</SpeakText> an old car. / a new house / American friends
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles têm um carro velho. / uma casa nova / amigos americanos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <SpeakText text="We have" className="text-blue-600 font-bold">We have</SpeakText> to study. / to work / to go
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós temos que estudar. / trabalhar / ir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <SpeakText text="She has" className="text-blue-600 font-bold">She has</SpeakText> Brazilian shoes. / American glasses / a British boss
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela tem sapatos brasileiros. / óculos americanos / um chefe britânico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. I <SpeakText text="need to have" className="text-blue-600 font-bold">need to have</SpeakText> a cell phone. / a computer / new glasses
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso ter um celular. / um computador / óculos novos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <SpeakText text="Do you have to go" className="text-blue-600 font-bold">Do you have to go</SpeakText> to work? / to school / to the doctor
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem que ir ao trabalho? / à escola / ao médico</p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. I need a new <SpeakText text="cell phone" className="text-blue-600 font-bold">cell phone</SpeakText>. / tablet / computer
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso de um celular novo. / tablet / computador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. Do you have a <SpeakText text="car" className="text-blue-600 font-bold">car</SpeakText>? / house / cell phone
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem um carro? / uma casa / um celular</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. We need <SpeakText text="new shoes" className="text-blue-600 font-bold">new shoes</SpeakText>. / new glasses / a new house
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós precisamos de sapatos novos. / óculos novos / uma casa nova</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. I want a <SpeakText text="tablet" className="text-blue-600 font-bold">tablet</SpeakText>. / computer / car
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu quero um tablet. / computador / carro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. Do you <SpeakText text="really" className="text-blue-600 font-bold">really</SpeakText> need to study? / to work / to go
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você realmente precisa estudar? / trabalhar / ir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. The car is in the <SpeakText text="garage" className="text-blue-600 font-bold">garage</SpeakText>. / house / school
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O carro está na garagem. / na casa / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. Do you want an <SpeakText text="old" className="text-blue-600 font-bold">old</SpeakText> or <SpeakText text="new" className="text-blue-600 font-bold">new</SpeakText> car? / house / computer
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você quer um carro velho ou novo? / uma casa / um computador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="What" className="text-blue-600 font-bold">What</SpeakText> do you need to buy? / to study / to do
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O que você precisa comprar? / estudar / fazer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. I <SpeakText text="have" className="text-blue-600 font-bold">have</SpeakText> a Brazilian friend. / American / British
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu tenho um amigo brasileiro. / americano / britânico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. They <SpeakText text="need" className="text-blue-600 font-bold">need</SpeakText> glasses. / shoes / a house
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles precisam de óculos. / sapatos / uma casa</p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. I don't need to go to <SpeakText text="school" className="text-blue-600 font-bold">school</SpeakText> today. / work / the doctor's
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu não preciso ir à escola hoje. / ao trabalho / ao médico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. I need to speak with a <SpeakText text="teacher" className="text-blue-600 font-bold">teacher</SpeakText> at school. / doctor / boss
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso falar com um professor na escola. / médico / chefe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. You speak <SpeakText text="English" className="text-blue-600 font-bold">English</SpeakText> very well. / Portuguese / Spanish
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você fala inglês muito bem. / português / espanhol</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. I need <SpeakText text="help" className="text-blue-600 font-bold">help</SpeakText> today. / money / time
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu preciso de ajuda hoje. / dinheiro / tempo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. You need <SpeakText text="to study" className="text-blue-600 font-bold">to study</SpeakText> English. / to speak / to listen to
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você precisa estudar inglês. / falar / ouvir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. The cell phone is on the <SpeakText text="table" className="text-blue-600 font-bold">table</SpeakText>. / in the bag / in the car
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O celular está na mesa. / na bolsa / no carro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. Do you want to speak with <SpeakText text="me" className="text-blue-600 font-bold">me</SpeakText>? / him / her
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você quer falar comigo? / com ele / com ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="When" className="text-blue-600 font-bold">When</SpeakText> do you need to go? / to study / to work
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando você precisa ir? / estudar / trabalhar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. I <SpeakText text="have" className="text-blue-600 font-bold">have</SpeakText> to work today. / to study / to go
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu tenho que trabalhar hoje. / estudar / ir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. We <SpeakText text="really" className="text-blue-600 font-bold">really</SpeakText> like English. / Portuguese / Spanish
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós gostamos muito de inglês. / português / espanhol</p>
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
            <SpeakSentence text="Structures for asking about needs and possessions" className="text-md text-gray-600 mb-4 italic">
              📚 Structures for asking about needs and possessions
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
                    1. <SpeakText text="Do you need" className="text-blue-600 font-bold">Do you need</SpeakText> a tablet? / a computer / a car
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você precisa de um tablet? / um computador / um carro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="Do you have" className="text-blue-600 font-bold">Do you have</SpeakText> glasses? / shoes / a house
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem óculos? / sapatos / uma casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="Do you want" className="text-blue-600 font-bold">Do you want</SpeakText> an apple? / an egg / an orange
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você quer uma maçã? / um ovo / uma laranja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="Do you like" className="text-blue-600 font-bold">Do you like</SpeakText> your new shoes? / your old car / your house
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você gosta dos seus sapatos novos? / do seu carro velho / da sua casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="Do they have" className="text-blue-600 font-bold">Do they have</SpeakText> an old car? / a new house / American friends
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles têm um carro velho? / uma casa nova / amigos americanos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="Do we need" className="text-blue-600 font-bold">Do we need</SpeakText> a new computer? / a cell phone / glasses
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós precisamos de um computador novo? / um celular / óculos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="Do you have" className="text-blue-600 font-bold">Do you have</SpeakText> a Brazilian friend? / an American co-worker / a British boss
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem um amigo brasileiro? / um colega americano / um chefe britânico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="Do you want" className="text-blue-600 font-bold">Do you want</SpeakText> soda? / juice / water
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você quer refrigerante? / suco / água</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <SpeakText text="Do you prefer" className="text-blue-600 font-bold">Do you prefer</SpeakText> rice? / beans / salad
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você prefere arroz? / feijão / salada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <SpeakText text="Do you need to study" className="text-blue-600 font-bold">Do you need to study</SpeakText> English? / Portuguese / Spanish
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você precisa estudar inglês? / português / espanhol</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. <SpeakText text="Do you love" className="text-blue-600 font-bold">Do you love</SpeakText> pizza? / chocolate / ice cream
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você ama pizza? / chocolate / sorvete</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <SpeakText text="Do you prefer" className="text-blue-600 font-bold">Do you prefer</SpeakText> coffee or tea? / juice or soda / water or milk
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você prefere café ou chá? / suco ou refrigerante / água ou leite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    13. <SpeakText text="What do you need to study" className="text-blue-600 font-bold">What do you need to study</SpeakText> today? / tomorrow / this week
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O que você precisa estudar hoje? / amanhã / esta semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    14. <SpeakText text="What do you have to do" className="text-blue-600 font-bold">What do you have to do</SpeakText> today? / tomorrow / this week
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O que você tem que fazer hoje? / amanhã / esta semana</p>
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
              Practice personal information and routine
            </div>
          </div>
          <div className="p-8">
            {/* Legenda para substituição – mantida como na Lesson 19, mas sem destaques específicos */}
            <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">💡 Dica:</span> Substitua as palavras destacadas em <span className="text-blue-600 font-bold">azul</span> ou <span className="text-purple-600 font-bold">roxo</span> por outras palavras para criar novas frases. 
                Por exemplo: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">need</span> a <span className="text-purple-600 font-bold">new computer</span>."</span> → 
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">"I <span className="text-blue-600 font-bold">have</span> an <span className="text-purple-600 font-bold">old car</span>."</span>
              </p>
            </div>

            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences – without highlights, but with SpeakSentence for audio */}
                <div className="lg:w-2/3 space-y-4">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-base font-medium">
                          <span className="mr-1">{index + 1}.</span>
                          {sentence.english}
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
                      <img src={electronicsImage} alt="Cell phones, tablets and computers" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cell phones, tablets and computers</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img src={personalItemsImage} alt="Cars, shoes and glasses" className="rounded-xl object-cover w-full h-full" />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">Cars, shoes and glasses</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== SECTION 6 – WRAP UP! ===================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Practice numbers and the use of articles a/an" className="mt-2 text-blue-100 italic">
                📝 Practice numbers and the use of articles a/an
              </SpeakSentence>
            </div>
            <button
              onClick={() => setShowAanExplanation(!showAanExplanation)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showAanExplanation ? 'Hide A/An Explanation' : 'Show A/An Explanation'}
            </button>
          </div>

          {showAanExplanation && (
            <div className="bg-blue-50 p-6 border-b border-blue-200">
              <h3 className="font-bold text-blue-800 text-lg mb-2">Quando usar "a" vs "an":</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Use <strong>"a"</strong> antes de palavras que começam com som de consoante (a car, a house, a friend)</li>
                <li>Use <strong>"an"</strong> antes de palavras que começam com som de vogal (an apple, an egg, an old car)</li>
                <li>Lembre-se: É sobre o SOM, não a letra. Exemplo: "an hour" (h é mudo), "a university" (u soa como "you")</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Left column – Numbers */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-2 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">NUMBERS</h3>
              </div>
              <div className="flex items-center"><SpeakText text="zero" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• zero</p></div>
              <div className="flex items-center"><SpeakText text="one" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 1 - one</p></div>
              <div className="flex items-center"><SpeakText text="two" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 2 - two</p></div>
              <div className="flex items-center"><SpeakText text="three" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 3 - three</p></div>
              <div className="flex items-center"><SpeakText text="four" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 4 - four</p></div>
              <div className="flex items-center"><SpeakText text="five" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 5 - five</p></div>
              <div className="flex items-center"><SpeakText text="six" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 6 - six</p></div>
              <div className="flex items-center"><SpeakText text="seven" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 7 - seven</p></div>
              <div className="flex items-center"><SpeakText text="eight" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 8 - eight</p></div>
              <div className="flex items-center"><SpeakText text="nine" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 9 - nine</p></div>
              <div className="flex items-center"><SpeakText text="ten" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText><p>• 10 - ten</p></div>
            </div>

            {/* Right column – Articles */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <SpeakText text="an apple" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">an apple</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <SpeakText text="an egg" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">an egg</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <SpeakText text="an old car" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">an old car</p>
                  </div>
                  <div className="flex items-center">
                    <SpeakText text="an American teacher" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">an American teacher</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-700">
                  <div className="flex items-center mb-2">
                    <SpeakText text="a car" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">a car</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <SpeakText text="a house" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">a house</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <SpeakText text="a friend" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">a friend</p>
                  </div>
                  <div className="flex items-center">
                    <SpeakText text="a computer" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                    <p className="font-bold">a computer</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-700 mt-4">
                <div className="flex items-center">
                  <SpeakText text="What's your phone number?" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                  <p className="text-yellow-300 font-bold">- What's your phone number?</p>
                </div>
                <div className="flex items-center mt-2">
                  <SpeakText text="It's 523-707-4782" className="mr-2 text-blue-200 hover:text-white"><Volume2 size={16} className="inline" /></SpeakText>
                  <p className="text-yellow-300 font-bold">- It's 523-707-4782.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (12)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (14) &rarr;
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