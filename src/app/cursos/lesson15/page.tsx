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

// Component for individual word pronunciation
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
    
    if (americanFemaleVoices.length > 0) {
      utterance.voice = americanFemaleVoices[0];
    } else if (americanVoices.length > 0) {
      utterance.voice = americanVoices[0];
    }
    
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

// Component for pronouncing entire sentences
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
          
          if (americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          } else if (americanVoices.length > 0) {
            utterance.voice = americanVoices[0];
          }
          
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

export default function Lesson15PersonalInfoRoutine() {
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

  // Initialize voices
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // Images
  const mainImage = "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const readingImage = "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const placesImage = "https://images.pexels.com/photos/3182746/pexels-photo-3182746.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const digitalImage = "https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // Lesson 15 data
  const verbs = [
    { english: "to read", portuguese: "ler" },
    { english: "to send", portuguese: "enviar" }
  ];

  const newWords = [
    { english: "coffee shop", portuguese: "cafeteria" },
    { english: "restaurant", portuguese: "restaurante" },
    { english: "mall", portuguese: "shopping" },
    { english: "the movies", portuguese: "cinema" },
    { english: "magazine", portuguese: "revista" },
    { english: "book", portuguese: "livro" },
    { english: "story", portuguese: "história" },
    { english: "e-mail", portuguese: "e-mail" },
    { english: "address", portuguese: "endereço" },
    { english: "password", portuguese: "senha" },
    { english: "message", portuguese: "mensagem" },
    { english: "online", portuguese: "online" },
    { english: "big", portuguese: "grande" },
    { english: "small", portuguese: "pequeno(a)" },
    { english: "the", portuguese: "o, a, os, as" }
  ];

  const usefulPhrases = [
    { english: "I read the news every day.", portuguese: "Eu leio as notícias todos os dias." },
    { english: "I read stories every day.", portuguese: "Eu leio histórias todos os dias." },
    { english: "I read my e-mails on my cell phone.", portuguese: "Eu leio meus e-mails no meu telefone celular." }
  ];

  const grammarExamples = [
    { english: "Do you want to go to the restaurant?", portuguese: "Você quer ir ao restaurante?" },
    { english: "Do you want to go to the movies with me?", portuguese: "Você quer ir ao cinema comigo?" },
    { english: "They like to go to the coffee shop in the evening.", portuguese: "Eles gostam de ir à cafeteria à noite." },
    { english: "We don't want to go to the mall today.", portuguese: "Nós não queremos ir ao shopping hoje." },
    { english: "I send e-mails to my boss every day.", portuguese: "Eu envio e-mails para meu chefe todos os dias." },
    { english: "I need to send this message to my friend.", portuguese: "Eu preciso enviar essa mensagem para meu amigo." }
  ];

  // Real Life Practice Sentences - EXPANDED with more pronoun variations
  const realLifeSentences = [
    { english: "I read the news in the morning.", portuguese: "Eu leio as notícias de manhã." },
    { english: "We read the news in the morning.", portuguese: "Nós lemos as notícias de manhã." },
    { english: "They read the news in the morning.", portuguese: "Eles leem as notícias de manhã." },
    { english: "Do you like to read magazines?", portuguese: "Você gosta de ler revistas?" },
    { english: "Do you like to read books?", portuguese: "Você gosta de ler livros?" },
    { english: "Do you like to read stories?", portuguese: "Você gosta de ler histórias?" },
    { english: "Do you read magazines online?", portuguese: "Você lê revistas online?" },
    { english: "Do you read books online?", portuguese: "Você lê livros online?" },
    { english: "Do you read news online?", portuguese: "Você lê notícias online?" },
    { english: "Where do you read your e-mails?", portuguese: "Onde você lê seus e-mails?" },
    { english: "I read my e-mails at work.", portuguese: "Eu leio meus e-mails no trabalho." },
    { english: "I read my e-mails at home.", portuguese: "Eu leio meus e-mails em casa." },
    { english: "I read my e-mails at school.", portuguese: "Eu leio meus e-mails na escola." },
    { english: "Do you read your messages on your cell phone?", portuguese: "Você lê suas mensagens no seu telefone celular?" },
    { english: "We have a small car.", portuguese: "Nós temos um carro pequeno." },
    { english: "Do you have a new e-mail address?", portuguese: "Você tem um novo endereço de e-mail?" },
    { english: "We like to go to the movies.", portuguese: "Nós gostamos de ir ao cinema." },
    { english: "Do they prefer to go to the mall in the afternoon?", portuguese: "Eles preferem ir ao shopping à tarde?" },
    { english: "Do we have to send this message today?", portuguese: "Nós temos que enviar essa mensagem hoje?" },
    { english: "You have to send this book to this address.", portuguese: "Você tem que enviar este livro para este endereço." },
    { english: "He reads the newspaper every morning.", portuguese: "Ele lê o jornal toda manhã." },
    { english: "She reads stories to her children.", portuguese: "Ela lê histórias para seus filhos." },
    { english: "It reads the data from the computer.", portuguese: "Ele lê os dados do computador." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
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
            📘 Lesson 15 - Personal Information & Routine
          </h1>
          <SpeakSentence text="Learn to talk about daily activities, reading habits, sending messages, and going to different places." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about daily activities, reading habits, sending messages, and going to different places.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Daily routine and work schedule"
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <SpeakText text="I read" className="text-blue-600 font-bold">I read</SpeakText> / <SpeakText text="You read" className="text-blue-600 font-bold">You read</SpeakText> / <SpeakText text="He reads" className="text-blue-600 font-bold">He reads</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu leio / você lê / ele lê</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="I do not read" className="text-blue-600 font-bold">I don't read</SpeakText> / <SpeakText text="You do not read" className="text-blue-600 font-bold">You don't read</SpeakText> / <SpeakText text="We do not read" className="text-blue-600 font-bold">We don't read</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu não leio / você não lê / nós não lemos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="You read at night" className="text-blue-600 font-bold">You read at night</SpeakText> / <SpeakText text="in the afternoon" className="text-blue-600 font-bold">in the afternoon</SpeakText> / <SpeakText text="in the morning" className="text-blue-600 font-bold">in the morning</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você lê à noite / à tarde / de manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="I read to my children" className="text-blue-600 font-bold">I read to my children</SpeakText> / <SpeakText text="my teacher" className="text-blue-600 font-bold">my teacher</SpeakText> / <SpeakText text="my friends" className="text-blue-600 font-bold">my friends</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu leio para meus filhos / minha professora / meus amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. We like to <SpeakText text="read in English" className="text-blue-600 font-bold">read in English</SpeakText> / <SpeakText text="Spanish" className="text-blue-600 font-bold">Spanish</SpeakText> / <SpeakText text="Portuguese" className="text-blue-600 font-bold">Portuguese</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós gostamos de ler em inglês / espanhol / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="I like it a lot" className="text-blue-600 font-bold">I like it a lot</SpeakText> / <SpeakText text="We like it" className="text-blue-600 font-bold">We like it</SpeakText> / <SpeakText text="You like it" className="text-blue-600 font-bold">You like it</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu gosto muito / nós gostamos / você gosta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="Send" className="text-blue-600 font-bold">Send</SpeakText> / <SpeakText text="I send" className="text-blue-600 font-bold">I send</SpeakText> / <SpeakText text="You send" className="text-blue-600 font-bold">You send</SpeakText> / <SpeakText text="They send" className="text-blue-600 font-bold">They send</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 enviar / eu envio / você envia / eles enviam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="They do not send" className="text-blue-600 font-bold">They don't send</SpeakText> / <SpeakText text="You do not send" className="text-blue-600 font-bold">You don't send</SpeakText> / <SpeakText text="I do not send" className="text-blue-600 font-bold">I don't send</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eles não enviam / você não envia / eu não envio</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <SpeakText text="What do you send" className="text-blue-600 font-bold">What do you send</SpeakText>? / <SpeakText text="What do you read" className="text-blue-600 font-bold">read</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 o que você envia? / o que você lê?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <SpeakText text="What do you want to send" className="text-blue-600 font-bold">What do you want to send</SpeakText> / <SpeakText text="What do you want to read" className="text-blue-600 font-bold">read</SpeakText> / <SpeakText text="What do you want to eat" className="text-blue-600 font-bold">eat</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 o que você quer enviar / ler / comer?</p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <SpeakText text="I read the news in the morning" className="text-blue-600 font-bold">I read the news in the morning</SpeakText>. / <SpeakText text="We read the news" className="text-blue-600 font-bold">We read the news</SpeakText>. / <SpeakText text="They read the news" className="text-blue-600 font-bold">They read the news</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu leio as notícias de manhã / nós lemos / eles leem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. Do you like to <SpeakText text="read magazines" className="text-blue-600 font-bold">read magazines</SpeakText>? / <SpeakText text="read books" className="text-blue-600 font-bold">books</SpeakText>? / <SpeakText text="read stories" className="text-blue-600 font-bold">stories</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você gosta de ler revistas / livros / histórias?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. Do you <SpeakText text="read magazines online" className="text-blue-600 font-bold">read magazines online</SpeakText>? / <SpeakText text="read books online" className="text-blue-600 font-bold">books online</SpeakText>? / <SpeakText text="read news online" className="text-blue-600 font-bold">news online</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você lê revistas online / livros online / notícias online?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. Where do you <SpeakText text="read your e-mails" className="text-blue-600 font-bold">read your e-mails</SpeakText>? at work / at home / at school.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 onde você lê seus e-mails? no trabalho / em casa / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="He reads the newspaper every morning" className="text-blue-600 font-bold">He reads the newspaper every morning</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ele lê o jornal toda manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="She reads stories to her children" className="text-blue-600 font-bold">She reads stories to her children</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ela lê histórias para seus filhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="It reads the data from the computer" className="text-blue-600 font-bold">It reads the data from the computer</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ele lê os dados do computador</p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. Do you <SpeakText text="read e-mails every day" className="text-blue-600 font-bold">read e-mails every day</SpeakText>? / <SpeakText text="read messages every day" className="text-blue-600 font-bold">messages</SpeakText> / <SpeakText text="read news every day" className="text-blue-600 font-bold">news</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você lê e-mails todos os dias / mensagens / notícias?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. I <SpeakText text="read books on my tablet" className="text-blue-600 font-bold">read books on my tablet</SpeakText> / <SpeakText text="read stories on my tablet" className="text-blue-600 font-bold">stories</SpeakText> / <SpeakText text="read magazines on my tablet" className="text-blue-600 font-bold">magazines</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu leio livros no meu tablet / histórias / revistas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. I <SpeakText text="read my e-mails on my cell phone" className="text-blue-600 font-bold">read my e-mails on my cell phone</SpeakText> / <SpeakText text="on my tablet" className="text-blue-600 font-bold">on my tablet</SpeakText> / <SpeakText text="on my computer" className="text-blue-600 font-bold">on my computer</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu leio meus e-mails no celular / no tablet / no computador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. Do you prefer to <SpeakText text="read your e-mails at home" className="text-blue-600 font-bold">read your e-mails at home</SpeakText> or <SpeakText text="read your e-mails at work" className="text-blue-600 font-bold">at work</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você prefere ler seus e-mails em casa ou no trabalho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. Is your friend <SpeakText text="American" className="text-blue-600 font-bold">American</SpeakText> / <SpeakText text="British" className="text-blue-600 font-bold">British</SpeakText> / <SpeakText text="Brazilian" className="text-blue-600 font-bold">Brazilian</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 seu amigo é americano / britânico / brasileiro?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. I <SpeakText text="eat bread and butter every day" className="text-blue-600 font-bold">eat bread and butter every day</SpeakText> / <SpeakText text="and cheese" className="text-blue-600 font-bold">and cheese</SpeakText> / <SpeakText text="and ham" className="text-blue-600 font-bold">and ham</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu como pão com manteiga todos os dias / com queijo / com presunto</p>
                </div>
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. I <SpeakText text="go to the movies" className="text-blue-600 font-bold">go to the movies</SpeakText> with my children / <SpeakText text="go shopping" className="text-blue-600 font-bold">shopping</SpeakText> / <SpeakText text="go to the restaurant" className="text-blue-600 font-bold">restaurant</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu vou ao cinema com meus filhos / fazer compras / ao restaurante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. Do you <SpeakText text="go to the movies" className="text-blue-600 font-bold">go to the movies</SpeakText>? / <SpeakText text="go to the coffee shop" className="text-blue-600 font-bold">coffee shop</SpeakText>? / <SpeakText text="go to the restaurant" className="text-blue-600 font-bold">restaurant</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você vai ao cinema / à cafeteria / ao restaurante?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. We <SpeakText text="go shopping in the afternoon" className="text-blue-600 font-bold">go shopping in the afternoon</SpeakText> / <SpeakText text="go to the movies in the afternoon" className="text-blue-600 font-bold">to the movies</SpeakText> / <SpeakText text="go to the coffee shop in the afternoon" className="text-blue-600 font-bold">to the coffee shop</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós vamos fazer compras à tarde / ao cinema / à cafeteria</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. Do you <SpeakText text="go shopping with your husband" className="text-blue-600 font-bold">go shopping with your husband</SpeakText> / <SpeakText text="go shopping with your wife" className="text-blue-600 font-bold">wife</SpeakText> / <SpeakText text="go shopping with your family" className="text-blue-600 font-bold">family</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você vai fazer compras com seu marido / sua esposa / sua família?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. Do you <SpeakText text="go to the restaurant alone" className="text-blue-600 font-bold">go to the restaurant alone</SpeakText>? / <SpeakText text="go to the coffee shop alone" className="text-blue-600 font-bold">coffee shop</SpeakText> / <SpeakText text="go to the movies alone" className="text-blue-600 font-bold">movies</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você vai ao restaurante sozinho / à cafeteria / ao cinema?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. I <SpeakText text="go shopping every day" className="text-blue-600 font-bold">go shopping every day</SpeakText> / <SpeakText text="go to the coffee shop every day" className="text-blue-600 font-bold">to the coffee shop</SpeakText> / <SpeakText text="go to the restaurant every day" className="text-blue-600 font-bold">to the restaurant</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu vou fazer compras todos os dias / à cafeteria / ao restaurante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. I <SpeakText text="go to school alone" className="text-blue-600 font-bold">go to school alone</SpeakText> / <SpeakText text="go to work alone" className="text-blue-600 font-bold">to work</SpeakText> / <SpeakText text="go to class alone" className="text-blue-600 font-bold">to class</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu vou para a escola sozinho / ao trabalho / para a aula</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. Do you want to <SpeakText text="go to the movies with me" className="text-blue-600 font-bold">go to the movies with me</SpeakText>? / <SpeakText text="go to the restaurant with me" className="text-blue-600 font-bold">restaurant</SpeakText> / <SpeakText text="go to the coffee shop with me" className="text-blue-600 font-bold">coffee shop</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você quer ir ao cinema comigo / ao restaurante / à cafeteria?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice - EXPANDED */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Practice reading and sending messages
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
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

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={readingImage}
                        alt="Reading books and digital content"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Reading books, magazines and digital content
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={placesImage}
                        alt="Work and daily routine"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Daily routine, work and personal information
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={digitalImage}
                        alt="Digital communication"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Digital communication and e-mails
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out (print style) - UPDATED with "on" explanation */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP!</h2>
              <SpeakSentence text="Common phrases, email format, and important English rules" className="mt-2 text-blue-100 italic">
                📝 Common phrases, email format, and important English rules
              </SpeakSentence>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Phrases, "on" explanation, Plural Rules */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-4 text-yellow-300">COMMON PHRASES</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on my computer" className="text-blue-200 hover:text-white">
                      • on my computer
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no meu computador</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on your tablet" className="text-blue-200 hover:text-white">
                      • on your tablet
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no seu tablet</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="on my cell phone" className="text-blue-200 hover:text-white">
                      • on my cell phone
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">no meu celular</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="read the news" className="text-blue-200 hover:text-white">
                      • read the news
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">ler as notícias</p>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="send an e-mail" className="text-blue-200 hover:text-white">
                      • send an e-mail
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">enviar um e-mail</p>
                </div>
              </div>

              {/* NEW: Explanation of "on" with devices, platforms, apps, social media */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <h4 className="font-bold text-lg text-yellow-300 mb-3">📱 USING "ON" WITH DEVICES & APPS</h4>
                <p className="text-blue-200 text-sm mb-2">
                  Em inglês, usamos a preposição <strong className="text-white">"on"</strong> para:
                </p>
                <ul className="text-blue-200 text-sm space-y-1 list-disc pl-4">
                  <li><strong className="text-white">Dispositivos:</strong> on my computer, on my cell phone, on my tablet</li>
                  <li><strong className="text-white">Plataformas e aplicativos:</strong> on Instagram, on WhatsApp, on X (Twitter), on YouTube, on Facebook</li>
                  <li><strong className="text-white">Sites e serviços:</strong> on the website, on Amazon, on Google, on Netflix</li>
                  <li><strong className="text-white">Redes sociais (em geral):</strong> on social media, on LinkedIn</li>
                </ul>
                <p className="text-blue-200 text-sm mt-2">
                  Exemplos: <span className="text-white">"I read the news <strong>on</strong> my phone."</span> — <span className="text-white">"She posts photos <strong>on</strong> Instagram."</span>
                </p>
                <p className="text-blue-200 text-sm mt-1">
                  🔹 <span className="text-white">Atenção:</span> usamos <strong>"in"</strong> para países, cidades e lugares fechados (ex: in Brazil, in the kitchen), mas para dispositivos e plataformas digitais é sempre <strong>"on"</strong>.
                </p>
              </div>

              {/* Plural Formation Section */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-yellow-300">PLURAL FORMATION RULES</h4>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">address → addresses</span>
                    <span className="text-blue-200 text-sm">endereços</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">story → stories</span>
                    <span className="text-blue-200 text-sm">histórias</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-800 rounded-lg">
                    <span className="font-medium">book → books</span>
                    <span className="text-blue-200 text-sm">livros</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Email and Special Characters */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="What's your e-mail address?" className="text-blue-200 hover:text-white font-bold">
                      What's your e-mail address?
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">Qual é o seu endereço de e-mail?</p>
                </div>
                
                <div className="pt-4 border-t border-blue-700">
                  <div className="flex items-center mb-1">
                    <SpeakSentence text="It's elisasullivan@leaf.com" className="text-blue-200 hover:text-white font-bold">
                      It's elisasullivan@leaf.com
                    </SpeakSentence>
                  </div>
                  <p className="text-blue-200 text-sm">É elisasullivan@leaf.com</p>
                  <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                    <p className="text-yellow-300 font-mono">elisasullivan@leaf.com</p>
                    <p className="text-blue-200 text-sm mt-1">Format: name@domain.com</p>
                  </div>
                </div>

                {/* Special Characters Section */}
                <div className="mt-6 pt-6 border-t border-blue-700">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">SPECIAL CHARACTERS</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">@</span>
                        <div>
                          <p className="font-bold">At</p>
                          <p className="text-blue-200 text-sm">Pronounced "at" in emails</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">.</span>
                        <div>
                          <p className="font-bold">Dot</p>
                          <p className="text-blue-200 text-sm">Pronounced "dot" in web addresses</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-1">
                        <span className="font-bold text-yellow-200 text-lg mr-3">_</span>
                        <div>
                          <p className="font-bold">Underscore</p>
                          <p className="text-blue-200 text-sm">Pronounced "underscore"</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (14)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (16) &rarr;
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