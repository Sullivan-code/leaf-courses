"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
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

// Native Browser Speech Synthesis Audio Button (Female American English voice)
function AudioButton({ text }: { text: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = () => {
    // Cancel any ongoing speech to avoid overlapping
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Try to get a female voice (American English)
    const setVoiceAndSpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      // Prefer female voices like Samantha, Google UK Female, or any female-sounding voice
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
      className="inline-flex items-center gap-1 text-blue-500 hover:text-blue-700 transition-colors focus:outline-none"
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

// Wrap Up Component (formerly Check It Out)
function WrapUp() {
  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg border-2 border-teal-200">
      {/* Left column - Expressions and Grammar */}
      <div className="bg-teal-900 text-white flex-1 p-6 space-y-4">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">USEFUL EXPRESSIONS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-xl text-yellow-200">Get well soon.</p>
                <p className="text-teal-200 text-sm mt-1">Melhoras.</p>
              </div>
              <AudioButton text="Get well soon" />
            </div>
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-xl text-yellow-200">Bless you!</p>
                <p className="text-teal-200 text-sm mt-1">Saúde!</p>
              </div>
              <AudioButton text="Bless you" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">THIS / THAT vs THESE / THOSE</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-teal-200">this is</p>
                <p className="text-teal-300 text-sm">isto é / este é</p>
              </div>
              <AudioButton text="this is" />
            </div>
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-teal-200">these are</p>
                <p className="text-teal-300 text-sm">estes/estas são</p>
              </div>
              <AudioButton text="these are" />
            </div>
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-teal-200">that is</p>
                <p className="text-teal-300 text-sm">aquilo é / aquele é</p>
              </div>
              <AudioButton text="that is" />
            </div>
            <div className="p-3 bg-teal-800 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-teal-200">those are</p>
                <p className="text-teal-300 text-sm">aqueles/aquelas são</p>
              </div>
              <AudioButton text="those are" />
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Contractions and Asking about symptoms */}
      <div className="bg-teal-800 text-white flex-1 p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-yellow-300 mb-3">CONTRACTIONS</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">I'm</p>
              <AudioButton text="I'm" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">You're</p>
              <AudioButton text="You're" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">He's</p>
              <AudioButton text="He's" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">She's</p>
              <AudioButton text="She's" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">It's</p>
              <AudioButton text="It's" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center flex items-center justify-between">
              <p className="font-bold">We're</p>
              <AudioButton text="We're" />
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center col-span-2 flex items-center justify-between">
              <p className="font-bold">They're</p>
              <AudioButton text="They're" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">ASKING ABOUT SYMPTOMS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-700 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-200">What's the matter?</p>
                <p className="text-teal-200 text-sm mt-1">O que houve? / Qual é o problema?</p>
              </div>
              <AudioButton text="What's the matter" />
            </div>
            <div className="p-3 bg-teal-700 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-200">I have a toothache.</p>
                <p className="text-teal-200 text-sm mt-1">Estou com dor de dente.</p>
              </div>
              <AudioButton text="I have a toothache" />
            </div>
            <div className="p-3 bg-teal-700 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-bold text-yellow-200 text-sm">I want to make an appointment to see a dentist.</p>
                <p className="text-teal-200 text-sm mt-1">Quero marcar uma consulta para ver um dentista.</p>
              </div>
              <AudioButton text="I want to make an appointment to see a dentist" />
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
  const mainImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const doctorImage = "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const sickImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  const verbs = [
    { english: "I'm", portuguese: "eu sou / estou" },
    { english: "You're", portuguese: "você é / está" },
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

  const usefulPhrases = [
    { english: "Take this medicine for your toothache.", portuguese: "Tome este remédio para sua dor de dente." },
    { english: "I'll feel better on Sunday.", portuguese: "Eu vou me sentir melhor no Domingo." },
    { english: "I had to go to the dentist.", portuguese: "Eu tive que ir ao dentista." },
    { english: "I was in pain.", portuguese: "Eu estava com dor." }
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

  const realLifeSentences = [
    { english: "I had a headache.", portuguese: "Eu estava com dor de cabeça." },
    { english: "She had an appointment at the dentist today.", portuguese: "Ela teve uma consulta no dentista hoje." },
    { english: "Did he have a fever?", portuguese: "Ele estava com febre?" },
    { english: "Take a painkiller for your toothache.", portuguese: "Tome um analgésico para sua dor de dente." },
    { english: "I think she has a stomachache.", portuguese: "Acho que ela está com dor de estômago." },
    { english: "I still take that medicine every day.", portuguese: "Eu ainda tomo aquele remédio todos os dias." },
    { english: "I'm in pain. I need to go to the hospital.", portuguese: "Estou com dor. Preciso ir ao hospital." },
    { english: "He'll be at the train station.", portuguese: "Ele estará na estação de trem." },
    { english: "Drink a lot of water. It's good for your health.", portuguese: "Beba muita água. É bom para sua saúde." },
    { english: "The children were at home because they were sick.", portuguese: "As crianças estavam em casa porque estavam doentes." },
    { english: "Please take those reports to the doctor.", portuguese: "Por favor, leve aqueles relatórios ao médico." },
    { english: "Do you have to take these pills?", portuguese: "Você tem que tomar estes comprimidos?" },
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
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about health issues, medical professions, feelings, and making appointments. 👨‍⚕️🤒💊
          </p>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the speaker icon to hear the pronunciation (Native American English voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
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
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I'm a teacher</span>.</p>
                    <p className="text-sm text-gray-500 mt-1">Eu sou professor.</p>
                  </div>
                  <AudioButton text="I am a teacher" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">You're a nurse</span>.</p>
                    <p className="text-sm text-gray-500 mt-1">Você é enfermeiro(a).</p>
                  </div>
                  <AudioButton text="You are a nurse" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He's a doctor</span>.</p>
                    <p className="text-sm text-gray-500 mt-1">Ele é médico.</p>
                  </div>
                  <AudioButton text="He is a doctor" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She's a dentist</span>.</p>
                    <p className="text-sm text-gray-500 mt-1">Ela é dentista.</p>
                  </div>
                  <AudioButton text="She is a dentist" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">It's here / there / at home</span></p>
                    <p className="text-sm text-gray-500 mt-1">Está aqui / lá / em casa</p>
                  </div>
                  <AudioButton text="it is here" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">We're friends</span> / classmates / neighbors</p>
                    <p className="text-sm text-gray-500 mt-1">Nós somos amigos / colegas de classe / vizinhos</p>
                  </div>
                  <AudioButton text="we are friends" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">They're at the hospital</span> / at work / at school</p>
                    <p className="text-sm text-gray-500 mt-1">Eles estão no hospital / no trabalho / na escola</p>
                  </div>
                  <AudioButton text="they are at the hospital" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">It's good</span> / bad / important for your health</p>
                    <p className="text-sm text-gray-500 mt-1">É bom / ruim / importante para sua saúde</p>
                  </div>
                  <AudioButton text="it is good for your health" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I want to be</span> / He wants to be / She wants to be</p>
                    <p className="text-sm text-gray-500 mt-1">Eu quero ser / Ele quer ser / Ela quer ser</p>
                  </div>
                  <AudioButton text="I want to be" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What do you want to be</span>? / What does he want to be?</p>
                    <p className="text-sm text-gray-500 mt-1">O que você quer ser? / O que ele quer ser?</p>
                  </div>
                  <AudioButton text="What do you want to be" />
                </div>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the speaker icon to hear each word pronounced (Native voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I need to talk to the doctor</span> / nurse / dentist</p>
                    <p className="text-sm text-gray-500 mt-1">Eu preciso falar com o médico / enfermeiro / dentista</p>
                  </div>
                  <AudioButton text="I need to talk to the doctor" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have to go to the hospital</span> / to the doctor / to the dentist</p>
                    <p className="text-sm text-gray-500 mt-1">Eu tenho que ir ao hospital / ao médico / ao dentista</p>
                  </div>
                  <AudioButton text="I have to go to the hospital tomorrow" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you know that doctor</span>? / dentist / nurse</p>
                    <p className="text-sm text-gray-500 mt-1">Você conhece aquele médico / dentista / enfermeira</p>
                  </div>
                  <AudioButton text="Do you know that doctor" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have an appointment at the dentist</span> / at the doctor / at the hospital</p>
                    <p className="text-sm text-gray-500 mt-1">Eu tenho uma consulta no dentista / no médico / no hospital</p>
                  </div>
                  <AudioButton text="I have an appointment at the dentist" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you have an appointment today</span>? / this afternoon / tomorrow</p>
                    <p className="text-sm text-gray-500 mt-1">Você tem um compromisso hoje? / esta tarde / amanhã</p>
                  </div>
                  <AudioButton text="Do you have an appointment today" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I don't like to take medicine</span> / painkillers / pills</p>
                    <p className="text-sm text-gray-500 mt-1">Eu não gosto de tomar remédio / analgésicos / comprimidos</p>
                  </div>
                  <AudioButton text="I do not like to take medicine" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you need to take a painkiller</span>? / Does she need / Does he need</p>
                    <p className="text-sm text-gray-500 mt-1">Você precisa tomar um analgésico? / Ela / Ele</p>
                  </div>
                  <AudioButton text="Do you need to take a painkiller" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have a headache</span> / stomachache / toothache</p>
                    <p className="text-sm text-gray-500 mt-1">Eu estou com dor de cabeça / dor de estômago / dor de dente</p>
                  </div>
                  <AudioButton text="I have a headache" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">My sister has a fever</span> / sore throat / cold</p>
                    <p className="text-sm text-gray-500 mt-1">Minha irmã está com febre / dor de garganta / resfriada</p>
                  </div>
                  <AudioButton text="My sister has a fever" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">He has a toothache</span> / headache / stomachache</p>
                    <p className="text-sm text-gray-500 mt-1">Ele está com dor de dente / dor de cabeça / dor de estômago</p>
                  </div>
                  <AudioButton text="He has a toothache" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you have a sore throat</span>? / fever / cold</p>
                    <p className="text-sm text-gray-500 mt-1">Você está com dor de garganta? / febre / resfriado</p>
                  </div>
                  <AudioButton text="Do you have a sore throat" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">When do you take these pills</span>? / painkillers</p>
                    <p className="text-sm text-gray-500 mt-1">Quando você toma estes comprimidos? / analgésicos</p>
                  </div>
                  <AudioButton text="When do you take these pills" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I need to talk to those doctors</span> / teachers / nurses</p>
                    <p className="text-sm text-gray-500 mt-1">Eu preciso conversar com aqueles médicos / professores / enfermeiros</p>
                  </div>
                  <AudioButton text="I need to talk to those doctors" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Speak Like a Native (formerly Useful Phrases) with Drill + FUTURE & PAST */}
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases to talk about health and medical situations</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-yellow-600 font-bold">{phrase.english}</span> = {phrase.portuguese}
                  </div>
                  <AudioButton text={phrase.english} />
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I preferred to drink tea for my stomachache</span> / headache / sore throat</p>
                    <p className="text-sm text-gray-500 mt-1">Eu preferi beber chá para minha dor de estômago / dor de cabeça / dor de garganta</p>
                  </div>
                  <AudioButton text="I prefer to drink tea for my stomachache" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I feel better now</span>. / He feels / We feel</p>
                    <p className="text-sm text-gray-500 mt-1">Eu me sinto melhor agora / Ele se sente / Nós nos sentimos</p>
                  </div>
                  <AudioButton text="I feel better now" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I still study in the morning</span> / in the afternoon / at night</p>
                    <p className="text-sm text-gray-500 mt-1">Eu ainda estudo de manhã / à tarde / à noite</p>
                  </div>
                  <AudioButton text="I still study in the morning" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">He still needs to go to the doctor</span> / to the dentist / to the pharmacy</p>
                    <p className="text-sm text-gray-500 mt-1">Ele ainda precisa ir ao médico / ao dentista / à farmácia</p>
                  </div>
                  <AudioButton text="He still needs to go to the doctor" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I am in pain</span>. / She is / They are</p>
                    <p className="text-sm text-gray-500 mt-1">Eu estou com dor / Ela está / Eles estão</p>
                  </div>
                  <AudioButton text="I am in pain" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I am still in pain</span>. / She is / He is</p>
                    <p className="text-sm text-gray-500 mt-1">Eu ainda estou com dor / Ela / Ele</p>
                  </div>
                  <AudioButton text="I am still in pain" />
                </div>
                {/* NEW FUTURE & PAST EXAMPLES */}
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-yellow-700">I will call the doctor tomorrow morning.</span></p>
                    <p className="text-sm text-gray-500">Eu ligarei para o médico amanhã de manhã.</p>
                  </div>
                  <AudioButton text="I will call the doctor tomorrow morning" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-yellow-700">She will take these pills after lunch.</span></p>
                    <p className="text-sm text-gray-500">Ela tomará estes comprimidos depois do almoço.</p>
                  </div>
                  <AudioButton text="She will take these pills after lunch" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-yellow-700">Did you have a fever yesterday?</span></p>
                    <p className="text-sm text-gray-500">Você estava com febre ontem?</p>
                  </div>
                  <AudioButton text="Did you have a fever yesterday" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-yellow-700">Did he go to the hospital last week?</span></p>
                    <p className="text-sm text-gray-500">Ele foi ao hospital semana passada?</p>
                  </div>
                  <AudioButton text="Did he go to the hospital last week" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST STATEMENT: <span className="text-yellow-700">I didn't feel well yesterday, but today I'm better.</span></p>
                    <p className="text-sm text-gray-500">Não me senti bem ontem, mas hoje estou melhor.</p>
                  </div>
                  <AudioButton text="I did not feel well yesterday but today I am better" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - GRAMMAR with Drill + FUTURE & PAST */}
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
            <p className="text-md text-gray-600 mb-4 italic">Complete structures with the verb to be in affirmative sentences</p>
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
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">I'm a doctor</span> / dentist / nurse</p>
                    <p className="text-sm text-gray-500 mt-1">Eu sou médico / dentista / enfermeiro</p>
                  </div>
                  <AudioButton text="I'm a doctor" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">She is a teacher</span> / nurse / dentist</p>
                    <p className="text-sm text-gray-500 mt-1">Ela é professora / enfermeira / dentista</p>
                  </div>
                  <AudioButton text="She is a teacher" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">He is a dentist</span> / teacher / doctor</p>
                    <p className="text-sm text-gray-500 mt-1">Ele é dentista / professor / médico</p>
                  </div>
                  <AudioButton text="He is a dentist" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">It's early</span> / late / new</p>
                    <p className="text-sm text-gray-500 mt-1">Está cedo / tarde / novo</p>
                  </div>
                  <AudioButton text="It's early" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">That class is important</span> / interesting / great</p>
                    <p className="text-sm text-gray-500 mt-1">Aquela aula é importante / interessante / ótima</p>
                  </div>
                  <AudioButton text="That class is important" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">She is kind</span> / funny / beautiful</p>
                    <p className="text-sm text-gray-500 mt-1">Ela é gentil / engraçada / bonita</p>
                  </div>
                  <AudioButton text="She is kind" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">He is Brazilian</span> / American / British</p>
                    <p className="text-sm text-gray-500 mt-1">Ele é brasileiro / americano / britânico</p>
                  </div>
                  <AudioButton text="He is Brazilian" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">I am sick</span> / She is / They are</p>
                    <p className="text-sm text-gray-500 mt-1">Eu estou doente / Ela está / Eles estão</p>
                  </div>
                  <AudioButton text="I am sick" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">They are my parents</span> / grandparents / friends</p>
                    <p className="text-sm text-gray-500 mt-1">Eles são meus pais / avós / amigos</p>
                  </div>
                  <AudioButton text="They are my parents" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">These are my friends</span>. / Those are my teachers</p>
                    <p className="text-sm text-gray-500 mt-1">Estes são meus amigos / Aqueles são meus professores</p>
                  </div>
                  <AudioButton text="These are my friends" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">It is good for your health</span> / important / great</p>
                    <p className="text-sm text-gray-500 mt-1">É bom para sua saúde / importante / ótimo</p>
                  </div>
                  <AudioButton text="It is good for your health" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">We are at home</span> / at the mall / at the beach</p>
                    <p className="text-sm text-gray-500 mt-1">Nós estamos em casa / no shopping / na praia</p>
                  </div>
                  <AudioButton text="We are at home" />
                </div>
                {/* NEW FUTURE & PAST GRAMMAR */}
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-purple-700">I will visit the dentist next Monday.</span></p>
                    <p className="text-sm text-gray-500">Visitarei o dentista na próxima segunda-feira.</p>
                  </div>
                  <AudioButton text="I will visit the dentist next Monday" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-purple-700">Did you take your medicine this morning?</span></p>
                    <p className="text-sm text-gray-500">Você tomou seu remédio esta manhã?</p>
                  </div>
                  <AudioButton text="Did you take your medicine this morning" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST: <span className="text-purple-700">He didn't come to the appointment because he was busy.</span></p>
                    <p className="text-sm text-gray-500">Ele não veio à consulta porque estava ocupado.</p>
                  </div>
                  <AudioButton text="He did not come to the appointment because he was busy" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Make It Yours (formerly Real Life) + FUTURE & PAST */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Replace the blue words to practice | Includes Future & Past
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
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
                  {/* NEW FUTURE & PAST examples for Make It Yours */}
                  <div className="group flex items-center justify-between border-t pt-4 border-red-200">
                    <div>
                      <p className="text-lg font-medium">✨ FUTURE: <span className="text-red-600">I will take a painkiller for my toothache.</span></p>
                      <p className="text-sm text-gray-600">Tomarei um analgésico para minha dor de dente.</p>
                    </div>
                    <AudioButton text="I will take a painkiller for my toothache" />
                  </div>
                  <div className="group flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">❓ PAST: <span className="text-red-600">Did you feel sick after the party?</span></p>
                      <p className="text-sm text-gray-600">Você se sentiu mal depois da festa?</p>
                    </div>
                    <AudioButton text="Did you feel sick after the party" />
                  </div>
                  <div className="group flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">📆 PAST: <span className="text-red-600">He didn't go to the doctor because he felt better.</span></p>
                      <p className="text-sm text-gray-600">Ele não foi ao médico porque se sentiu melhor.</p>
                    </div>
                    <AudioButton text="He did not go to the doctor because he felt better" />
                  </div>
                  <div className="group flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">🔮 FUTURE: <span className="text-red-600">They will call us when they arrive at the hospital.</span></p>
                      <p className="text-sm text-gray-600">Eles nos ligarão quando chegarem ao hospital.</p>
                    </div>
                    <AudioButton text="They will call us when they arrive at the hospital" />
                  </div>
                </div>

                {/* Image container - 1/3 width on large */}
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

        {/* Section 6 - WRAP UP (formerly Check It Out) */}
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