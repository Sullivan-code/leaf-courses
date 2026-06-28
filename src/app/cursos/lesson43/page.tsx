"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

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

// Native Browser Speech Synthesis Audio Button (Female American English voice)
function AudioButton({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        (voice.lang === 'en-US' && (voice.name.includes('Samantha') || voice.name.includes('Google UK Female') || voice.name.includes('Female') || voice.name.includes('Ellen') || voice.name.includes('Susan')))
      ) || voices.find(voice => voice.lang === 'en-US');
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      window.speechSynthesis.speak(utterance);
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
    };
    
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      setVoiceAndSpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
  };

  return (
    <button
      onClick={speakText}
      className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors focus:outline-none flex-shrink-0"
      aria-label={`Ouvir: ${text}`}
      title="Clique para ouvir (voz nativa americana)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isPlaying ? 'text-green-500 animate-pulse' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
      </svg>
      {isPlaying && <span className="text-xs text-green-600">🔊</span>}
    </button>
  );
}

export default function Lesson43EatingOut() {
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
  
  const [noteModal, setNoteModal] = useState({
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

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const restaurantImage = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const foodImage = "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 43 - Verbs (to make, to give)
  const verbs = [
    { english: "to make", portuguese: "fazer" },
    { english: "to give", portuguese: "dar" },
  ];

  // Lesson 43 - New Words
  const newWords = [
    { english: "dish", portuguese: "prato" },
    { english: "hamburger", portuguese: "hambúrguer" },
    { english: "pizza", portuguese: "pizza" },
    { english: "popcorn", portuguese: "pipoca" },
    { english: "cake", portuguese: "bolo" },
    { english: "ice cream", portuguese: "sorvete" },
    { english: "fast food", portuguese: "comida rápida" },
    { english: "tip", portuguese: "gorjeta" },
    { english: "waiter", portuguese: "garçom" },
    { english: "waitress", portuguese: "garçonete" },
    { english: "favorite", portuguese: "favorito(a)" },
    { english: "hot", portuguese: "quente" },
    { english: "cold", portuguese: "frio" },
    { english: "our", portuguese: "nosso" },
    { english: "their", portuguese: "deles" },
    { english: "any", portuguese: "algum / nenhum" },
  ];

  const usefulPhrases = [
    { english: "This is the best restaurant in the city.", portuguese: "Este é o melhor restaurante da cidade." },
    { english: "I want a slice of pie for dessert.", portuguese: "Eu quero uma fatia de torta de sobremesa." },
    { english: "What do you want for dessert?", portuguese: "O que você quer comer de sobremesa?" },
    { english: "I want fruit for dessert / ice cream / a piece of cake.", portuguese: "Eu quero fruta de sobremesa / sorvete / um pedaço de bolo." },
    { english: "Does she know how to make cakes? / pancakes / desserts", portuguese: "Ela sabe fazer bolos? / panquecas / sobremesas" },
    { english: "This is the best restaurant in the city / best mall", portuguese: "Este é o melhor restaurante da cidade / melhor shopping" },
    { english: "This is the best dish in the restaurant / pizza / pie", portuguese: "Este é o melhor prato do restaurante / pizza / torta" },
    { english: "This is my best friend.", portuguese: "Este é o meu melhor amigo" },
  ];

  const grammarExamples = [
    { english: "I have some friends in Germany.", portuguese: "Eu tenho alguns amigos na Alemanha." },
    { english: "Some people don't like to eat fast food.", portuguese: "Algumas pessoas não gostam de comida rápida." },
    { english: "I don't have any money here.", portuguese: "Eu não tenho dinheiro aqui." },
    { english: "He still doesn't have any children.", portuguese: "Ele ainda não tem filhos." },
    { english: "Do you have any tips?", portuguese: "Você tem alguma dica?" },
    { english: "Do you know any good TV series?", portuguese: "Você conhece alguma série boa?" },
    { english: "Do you want some popcorn?", portuguese: "Você quer um pouco de pipoca?" },
  ];

  // Real Life Sentences (MISTURADAS com Future, Negative, Have Been, I've, What have you, Have you ever)
  const realLifeSentences = [
    { english: "Do you know how to make chocolate popcorn?", portuguese: "Você sabe fazer pipoca de chocolate?" },
    { english: "I want to make your favorite dish tonight.", portuguese: "Eu quero fazer seu prato favorito hoje à noite." },
    { english: "We want to give you this book.", portuguese: "Nós queremos te dar este livro." },
    { english: "I want to give a gift to my mother.", portuguese: "Eu quero dar um presente para minha mãe." },
    { english: "Do you usually give tips to the waiters?", portuguese: "Você costuma dar gorjeta para os garçons?" },
    { english: "This is the best restaurant in the city.", portuguese: "Este é o melhor restaurante da cidade." },
    { english: "I love that place! Their food is very good!", portuguese: "Eu amo aquele lugar! A comida deles é muito boa!" },
    { english: "We clean our house every Friday.", portuguese: "Nós limpamos nossa casa toda sexta-feira." },
    { english: "I want some tomato sauce, please.", portuguese: "Eu quero um pouco de molho de tomate, por favor." },
    { english: "Do you want some coffee?", portuguese: "Você quer um pouco de café?" },
    { english: "We don't have any food. Let's go to the grocery store.", portuguese: "Nós não temos nenhuma comida. Vamos ao supermercado." },
    { english: "Do you have any salad?", portuguese: "Você tem alguma salada?" },
    { english: "I will make a special dinner for my family tonight.", portuguese: "Eu farei um jantar especial para minha família hoje à noite." },
    { english: "She will give a big tip to the waiter.", portuguese: "Ela dará uma grande gorjeta ao garçom." },
    { english: "They will order pizza for dinner.", portuguese: "Eles pedirão pizza para o jantar." },
    { english: "I won't eat fast food anymore.", portuguese: "Eu não comerei comida rápida nunca mais." },
    { english: "He won't give any tips at that restaurant.", portuguese: "Ele não dará gorjeta naquele restaurante." },
    { english: "We won't have dessert tonight.", portuguese: "Nós não teremos sobremesa hoje à noite." },
    { english: "I've been to this restaurant before.", portuguese: "Eu já estive neste restaurante antes." },
    { english: "She has been cooking since 5 o'clock.", portuguese: "Ela está cozinhando desde as 5 horas." },
    { english: "We have been waiting for our food for 30 minutes.", portuguese: "Nós estamos esperando nossa comida há 30 minutos." },
    { english: "What have you ordered for dinner?", portuguese: "O que você pediu para o jantar?" },
    { english: "Have you ever tried this dish before?", portuguese: "Você já experimentou este prato antes?" },
    { english: "Have you ever been to a Michelin star restaurant?", portuguese: "Você já foi a um restaurante com estrela Michelin?" },
  ];

  // Check it out practice items
  const checkItOutItems = [
    { item: "a cake", verb: "to make" },
    { item: "popcorn", verb: "to make" },
    { item: "a dessert", verb: "to make" },
    { item: "some coffee", verb: "to make" },
    { item: "cookies", verb: "to make" },
    { item: "soup", verb: "to make" },
    { item: "friends", verb: "to make" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            🍽️ Lesson 43 - Eating Out
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about food, restaurants, and use the verbs "to make" and "to give" with some/any.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Eating out at a restaurant"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - VERBS (to make, to give) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS (to make / fazer, to give / dar)</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the speaker icon to hear the pronunciation (Native American English voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {verbs.map((verb, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-blue-600 font-bold">{verb.english}</span> = {verb.portuguese}
                  </div>
                  <AudioButton text={verb.english} />
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I make</span> / You make / He makes</p>
                    <p className="text-sm text-gray-600 mt-1">Eu faço / Você faz / Ele faz</p>
                  </div>
                  <AudioButton text="I make" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">They do not make</span> / We make</p>
                    <p className="text-sm text-gray-600 mt-1">Eles não fazem / Nós fazemos</p>
                  </div>
                  <AudioButton text="They do not make" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Do you make?</span> / Does he make? / Do they make?</p>
                    <p className="text-sm text-gray-600 mt-1">Você faz? / Ele faz? / Eles fazem?</p>
                  </div>
                  <AudioButton text="Do you make" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I want to make some coffee</span> / pancakes / cookies</p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero fazer um pouco de café / panquecas / biscoitos</p>
                  </div>
                  <AudioButton text="I want to make some coffee" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">What do you want to make for dinner?</span> / lunch / breakfast</p>
                    <p className="text-sm text-gray-600 mt-1">O que você quer fazer para o jantar? / almoço / café da manhã</p>
                  </div>
                  <AudioButton text="What do you want to make for dinner" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I give</span> / We give / They give</p>
                    <p className="text-sm text-gray-600 mt-1">Eu dou / Nós damos / Eles dão</p>
                  </div>
                  <AudioButton text="I give" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I want to give my opinion</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero dar minha opinião</p>
                  </div>
                  <AudioButton text="I want to give my opinion" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Do you like to give gifts?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você gosta de dar presentes?</p>
                  </div>
                  <AudioButton text="Do you like to give gifts" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I give gifts to my children</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu dou presentes para meus filhos</p>
                  </div>
                  <AudioButton text="I give gifts to my children" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I want to give you a book</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero te dar um livro</p>
                  </div>
                  <AudioButton text="I want to give you a book" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS (Vocabulary)</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the speaker icon to hear each word pronounced (Native voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newWords.map((word, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-green-600 font-bold">{word.english}</span> = {word.portuguese}
                  </div>
                  <AudioButton text={word.english} />
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🍕 <span className="text-green-600 font-bold">pizza</span> / hamburger / fast food</p>
                    <p className="text-sm text-gray-600 mt-1">pizza / hambúrguer / comida rápida</p>
                  </div>
                  <AudioButton text="pizza" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🍰 <span className="text-green-600 font-bold">cake</span> / ice cream / popcorn</p>
                    <p className="text-sm text-gray-600 mt-1">bolo / sorvete / pipoca</p>
                  </div>
                  <AudioButton text="cake" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">👨‍🍳 <span className="text-green-600 font-bold">waiter</span> / waitress / tip</p>
                    <p className="text-sm text-gray-600 mt-1">garçom / garçonete / gorjeta</p>
                  </div>
                  <AudioButton text="waiter" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔥 <span className="text-green-600 font-bold">hot</span> / cold / favorite</p>
                    <p className="text-sm text-gray-600 mt-1">quente / frio / favorito(a)</p>
                  </div>
                  <AudioButton text="hot" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">👥 <span className="text-green-600 font-bold">our</span> / their / any</p>
                    <p className="text-sm text-gray-600 mt-1">nosso / deles / algum/nenhum</p>
                  </div>
                  <AudioButton text="our" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🍽️ <span className="text-green-600 font-bold">dish</span> / ice cream / popcorn</p>
                    <p className="text-sm text-gray-600 mt-1">prato / sorvete / pipoca</p>
                  </div>
                  <AudioButton text="dish" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - GRAMMAR (Some/Any) with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native (Some / Any)</h2>
              <PencilIcon onClick={() => openNoteModal('Speak Like a Native')} />
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-100 p-4 rounded-xl border border-purple-300 mb-6">
              <h3 className="font-bold text-purple-800 text-lg mb-2">📚 Some vs Any - Explanation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-purple-800">
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="font-bold text-green-600">✅ SOME</p>
                  <p className="text-sm">Usado em frases <strong>afirmativas</strong></p>
                  <p className="text-sm mt-1">Ex: <span className="font-bold">I have <span className="text-green-600">some</span> friends.</span></p>
                  <p className="text-xs text-gray-500">Eu tenho alguns amigos.</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-purple-200">
                  <p className="font-bold text-red-600">❌ ANY</p>
                  <p className="text-sm">Usado em frases <strong>negativas</strong> e <strong>interrogativas</strong></p>
                  <p className="text-sm mt-1">Ex: <span className="font-bold">I don't have <span className="text-red-600">any</span> money.</span></p>
                  <p className="text-xs text-gray-500">Eu não tenho dinheiro.</p>
                </div>
              </div>
            </div>

            <p className="text-md text-gray-600 mb-4 italic">Some = affirmative / Any = negative and interrogative</p>
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-purple-600 font-bold">{example.english}</span> = {example.portuguese}
                  </div>
                  <AudioButton text={example.english} />
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">She has some books at home</span> / at the office / at the company</p>
                    <p className="text-sm text-gray-600 mt-1">Ela tem alguns livros em casa / no escritório / na empresa</p>
                  </div>
                  <AudioButton text="She has some books at home" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">My neighbor has some friends abroad</span> / cousins / relatives</p>
                    <p className="text-sm text-gray-600 mt-1">Meu vizinho tem alguns amigos no exterior / primos / parentes</p>
                  </div>
                  <AudioButton text="My neighbor has some friends abroad" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Some people do not like to eat hamburgers</span> / pizza / popcorn</p>
                    <p className="text-sm text-gray-600 mt-1">Algumas pessoas não gostam de comer hambúrguer / pizza / pipoca</p>
                  </div>
                  <AudioButton text="Some people do not like to eat hamburgers" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">I don't want any bread, thanks</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu não quero nenhum pão, obrigado</p>
                  </div>
                  <AudioButton text="I don't want any bread thanks" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">I don't have any butter</span> / jam / honey</p>
                    <p className="text-sm text-gray-600 mt-1">Eu não tenho nenhuma manteiga / geleia / mel</p>
                  </div>
                  <AudioButton text="I don't have any butter" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">I don't know any schools here</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu não conheço nenhuma escola aqui</p>
                  </div>
                  <AudioButton text="I don't know any schools here" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">He doesn't know any good TV series</span> / books / stories</p>
                    <p className="text-sm text-gray-600 mt-1">Ele não conhece nenhuma série boa / livro / história</p>
                  </div>
                  <AudioButton text="He doesn't know any good TV series" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Do you have any tips to give me?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você tem alguma dica para me dar?</p>
                  </div>
                  <AudioButton text="Do you have any tips to give me" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Do you want some popcorn?</span> / chips / candy</p>
                    <p className="text-sm text-gray-600 mt-1">Você quer um pouco de pipoca? / batatas fritas / doce</p>
                  </div>
                  <AudioButton text="Do you want some popcorn" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Did you have any problems at the restaurant?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você teve algum problema no restaurante?</p>
                  </div>
                  <AudioButton text="Did you have any problems at the restaurant" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">I will bring some dessert to the party</span> / drinks / snacks</p>
                    <p className="text-sm text-gray-600 mt-1">Eu trarei alguma sobremesa para a festa / bebidas / petiscos</p>
                  </div>
                  <AudioButton text="I will bring some dessert to the party" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - USEFUL PHRASES with Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 USEFUL PHRASES (Frases Úteis)</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Useful phrases for eating out and at the restaurant</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-center justify-between">
                  <div>
                    <p className="text-yellow-700 font-bold">{phrase.english}</p>
                    <p className="text-sm text-gray-600 mt-1">{phrase.portuguese}</p>
                  </div>
                  <AudioButton text={phrase.english} />
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📝 <span className="text-yellow-600 font-bold">May I see the menu, please?</span> → Sure, here you are.</p>
                    <p className="text-sm text-gray-600 mt-1">Posso ver o cardápio, por favor? → Claro, aqui está.</p>
                  </div>
                  <AudioButton text="May I see the menu please" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🍕 <span className="text-yellow-600 font-bold">Let's go to a pizza place!</span></p>
                    <p className="text-sm text-gray-600 mt-1">Vamos a uma pizzaria!</p>
                  </div>
                  <AudioButton text="Let's go to a pizza place" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🍽️ <span className="text-yellow-600 font-bold">I would like to order the steak, please.</span> / fish / chicken</p>
                    <p className="text-sm text-gray-600 mt-1">Eu gostaria de pedir o bife, por favor. / peixe / frango</p>
                  </div>
                  <AudioButton text="I would like to order the steak please" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">💵 <span className="text-yellow-600 font-bold">Can I have the bill, please?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Posso ter a conta, por favor?</p>
                  </div>
                  <AudioButton text="Can I have the bill please" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🥤 <span className="text-yellow-600 font-bold">I would like some water, please.</span> / juice / soda</p>
                    <p className="text-sm text-gray-600 mt-1">Eu gostaria de um pouco de água, por favor. / suco / refrigerante</p>
                  </div>
                  <AudioButton text="I would like some water please" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">👨‍🍳 <span className="text-yellow-600 font-bold">The waiter was very attentive.</span> / friendly / helpful</p>
                    <p className="text-sm text-gray-600 mt-1">O garçom foi muito atencioso. / simpático / prestativo</p>
                  </div>
                  <AudioButton text="The waiter was very attentive" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎭 MAKE IT YOURS (Real Life Practice)</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.realLife ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group flex items-center justify-between">
                      <div>
                        <p className="text-lg font-medium">
                          {index + 1}. {sentence.english}
                        </p>
                        <p className="text-sm text-gray-600">{sentence.portuguese}</p>
                      </div>
                      <AudioButton text={sentence.english} />
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-48 w-full">
                      <img
                        src={restaurantImage}
                        alt="Restaurant"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Eating at a restaurant
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-48 w-full">
                      <img
                        src={foodImage}
                        alt="Delicious food"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Delicious dishes
                    </p>
                  </div>
                </div>
              </div>

              {/* Useful Questions and Answers */}
              {openDrills.realLife && (
                <div className="mt-8 border-t border-red-200 pt-6 animate-fadeIn">
                  <h3 className="text-xl font-bold text-red-700 mb-4">❓ Useful Questions & Answers / Perguntas e Respostas Úteis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">What's your favorite dish?</p>
                        <p className="text-sm text-gray-500 mt-1">Qual é o seu prato favorito?</p>
                      </div>
                      <AudioButton text="What's your favorite dish" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">Can I have the bill, please?</p>
                        <p className="text-sm text-gray-500 mt-1">Posso ter a conta, por favor?</p>
                      </div>
                      <AudioButton text="Can I have the bill please" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="text-green-600 font-medium">Yes, I would like some water.</p>
                        <p className="text-sm text-gray-500 mt-1">Sim, eu gostaria de um pouco de água.</p>
                      </div>
                      <AudioButton text="Yes I would like some water" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="text-green-600 font-medium">No, thank you. I'm full.</p>
                        <p className="text-sm text-gray-500 mt-1">Não, obrigado. Estou satisfeito.</p>
                      </div>
                      <AudioButton text="No thank you I'm full" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">What do you recommend?</p>
                        <p className="text-sm text-gray-500 mt-1">O que você recomenda?</p>
                      </div>
                      <AudioButton text="What do you recommend" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="text-green-600 font-medium">I'll have the pasta, please.</p>
                        <p className="text-sm text-gray-500 mt-1">Eu vou querer a massa, por favor.</p>
                      </div>
                      <AudioButton text="I'll have the pasta please" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 6 - WRAP UP! (Practice "to make") */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">✅ WRAP UP! - Practice "to make"</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <button 
              onClick={() => setShowCheckItOutExplanation(!showCheckItOutExplanation)}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {showCheckItOutExplanation ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>

          <div className="p-8">
            {showCheckItOutExplanation && (
              <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200 animate-fadeIn">
                <p className="text-teal-800 text-sm">📚 <strong>Practice:</strong> Use the verb "to make" (fazer) with the words below. Click on each item to hear the pronunciation.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                  {checkItOutItems.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 text-center border border-teal-200 flex items-center justify-between">
                      <div>
                        <p className="text-teal-600 font-medium">{item.item}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.verb}</p>
                      </div>
                      <AudioButton text={`to make ${item.item}`} />
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-white rounded-lg border border-teal-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">✨ <strong>Example:</strong> I want to make a cake</p>
                    <p className="text-sm text-gray-500">Eu quero fazer um bolo</p>
                  </div>
                  <AudioButton text="I want to make a cake" />
                </div>
                <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">✨ <strong>Example:</strong> She made a delicious dinner</p>
                    <p className="text-sm text-gray-500">Ela fez um jantar delicioso</p>
                  </div>
                  <AudioButton text="She made a delicious dinner" />
                </div>
                <div className="mt-3 p-3 bg-white rounded-lg border border-teal-200 flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">✨ <strong>Example:</strong> They will make popcorn for the movie</p>
                    <p className="text-sm text-gray-500">Eles farão pipoca para o filme</p>
                  </div>
                  <AudioButton text="They will make popcorn for the movie" />
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-teal-600">🍽️ "May I see the menu, please?"</p>
                  <p className="text-sm text-gray-600 mt-2">→ Sure, here you are.</p>
                </div>
                <AudioButton text="May I see the menu please" />
              </div>
              <div className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200 flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-teal-600">🍕 "Let's go to a pizza place!"</p>
                </div>
                <AudioButton text="Let's go to a pizza place" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson42")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson44")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>Lesson 43 - Eating Out | Verbs: to make, to give | Grammar: Some / Any</p>
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