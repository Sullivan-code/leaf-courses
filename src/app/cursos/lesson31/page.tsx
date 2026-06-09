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
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors ${className}`}
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

// CheckItOutHorizontal Component
function CheckItOutHorizontal() {
  return (
    <div className="w-full mx-auto border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg">
      {/* HEADER */}
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

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 text-sm">
        {/* COLUMN 1 - Time Expressions */}
        <div className="bg-green-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">TIME EXPRESSIONS</h3>
          <SpeakSentence text="in a minute" className="block cursor-pointer hover:opacity-70">
            • in a minute
          </SpeakSentence>
          <SpeakSentence text="in an hour" className="block cursor-pointer hover:opacity-70">
            • in an hour
          </SpeakSentence>
          <SpeakSentence text="in five minutes" className="block cursor-pointer hover:opacity-70">
            • in five minutes
          </SpeakSentence>
          <SpeakSentence text="in two hours" className="block cursor-pointer hover:opacity-70">
            • in two hours
          </SpeakSentence>
          <SpeakSentence text="I'll start in a minute." className="block cursor-pointer hover:opacity-70 mt-4 pt-4 border-t border-green-600">
            • I'll start in a minute.
          </SpeakSentence>
          <SpeakSentence text="We finish in two hours." className="block cursor-pointer hover:opacity-70">
            • We finish in two hours.
          </SpeakSentence>
        </div>

        {/* COLUMN 2 - Question Patterns */}
        <div className="bg-red-700 text-white p-6 space-y-3">
          <h3 className="font-bold text-yellow-300 mb-2">QUESTION PATTERNS</h3>
          <SpeakSentence text="What do you want to study?" className="block cursor-pointer hover:opacity-70">
            • What do you want to study?
          </SpeakSentence>
          <SpeakSentence text="When do they start?" className="block cursor-pointer hover:opacity-70">
            • When do they start?
          </SpeakSentence>
          <SpeakSentence text="Where do we have the meeting?" className="block cursor-pointer hover:opacity-70">
            • Where do we have the meeting?
          </SpeakSentence>
          <SpeakSentence text="What time do you finish?" className="block cursor-pointer hover:opacity-70">
            • What time do you finish?
          </SpeakSentence>
          <div className="mt-4 pt-4 border-t border-red-600">
            <h4 className="font-bold text-yellow-300 mb-2">MEETING EXPRESSIONS</h4>
            <SpeakSentence text="to go to the meeting" className="block cursor-pointer hover:opacity-70">
              • to go to the meeting
            </SpeakSentence>
            <SpeakSentence text="to speak at the meeting" className="block cursor-pointer hover:opacity-70">
              • to speak at the meeting
            </SpeakSentence>
            <SpeakSentence text="I need to study for an exam." className="block cursor-pointer hover:opacity-70">
              • I need to study for an exam.
            </SpeakSentence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson31StartFinish() {
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

  // NEW IMAGE: Start/Finish concept - A person starting a race and finishing a project
  const mainImage = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const collegeImage = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const projectImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const meetingImage = "https://images.unsplash.com/photo-1517048676738-d65ab93716d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const deadlineImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 31 data
  const verbs = [
    { english: "to start", portuguese: "começar" },
    { english: "to finish", portuguese: "terminar" }
  ];

  const newWords = [
    { english: "project", portuguese: "projeto" },
    { english: "college", portuguese: "faculdade" },
    { english: "high school", portuguese: "ensino médio" },
    { english: "course", portuguese: "curso" },
    { english: "task", portuguese: "tarefa" },
    { english: "meeting", portuguese: "reunião" },
    { english: "exam", portuguese: "prova" },
    { english: "business", portuguese: "negócios" },
    { english: "semester", portuguese: "semestre" },
    { english: "hour", portuguese: "hora" },
    { english: "minute", portuguese: "minuto" },
    { english: "deadline", portuguese: "prazo" },
    { english: "next", portuguese: "próximo" },
    { english: "everything", portuguese: "tudo" },
    { english: "great", portuguese: "ótimo" }
  ];

  // MODIFIED: New Useful Phrases with Past, Future, and Questions using Do/Does
  const usefulPhrases = [
    { english: "I started a new course yesterday.", portuguese: "Eu comecei um novo curso ontem." },
    { english: "She finished her project last week.", portuguese: "Ela terminou o projeto dela na semana passada." },
    { english: "He will start college next year.", portuguese: "Ele vai começar a faculdade no ano que vem." },
    { english: "We will finish the meeting in an hour.", portuguese: "Nós vamos terminar a reunião em uma hora." },
    { english: "Does he start work at 9 AM?", portuguese: "Ele começa a trabalhar às 9 da manhã?" },
    { english: "Does she finish class at noon?", portuguese: "Ela termina a aula ao meio-dia?" },
    { english: "Does it start on time?", portuguese: "Isso começa na hora certa?" },
    { english: "Let's start!", portuguese: "Vamos começar!" }
  ];

  // MODIFIED: New Grammar Examples with Past, Future, and Questions
  const grammarExamples = [
    { english: "I started this course last month.", portuguese: "Eu comecei este curso no mês passado." },
    { english: "She finished her homework an hour ago.", portuguese: "Ela terminou a lição de casa dela há uma hora." },
    { english: "He will start his new job tomorrow.", portuguese: "Ele vai começar o novo trabalho dele amanhã." },
    { english: "They will finish the project next week.", portuguese: "Eles vão terminar o projeto na próxima semana." },
    { english: "Does she want to start the meeting now?", portuguese: "Ela quer começar a reunião agora?" },
    { english: "Does he need to finish the report today?", portuguese: "Ele precisa terminar o relatório hoje?" },
    { english: "When does the movie start?", portuguese: "Quando começa o filme?" },
    { english: "What time does she finish work?", portuguese: "Que horas ela termina o trabalho?" }
  ];

  // MODIFIED: New Real Life Practice Sentences with Past, Future, and Questions for He/She/It
  const realLifeSentences = [
    { english: "I started a new course last semester.", portuguese: "Eu comecei um novo curso no semestre passado." },
    { english: "She finished the project yesterday.", portuguese: "Ela terminou o projeto ontem." },
    { english: "He will study for the exam tonight.", portuguese: "Ele vai estudar para a prova hoje à noite." },
    { english: "We will finish this task in five minutes.", portuguese: "Nós vamos terminar esta tarefa em cinco minutos." },
    { english: "Does he start work at 8 AM?", portuguese: "Ele começa a trabalhar às 8 da manhã?" },
    { english: "Does she have a deadline this Friday?", portuguese: "Ela tem um prazo nesta sexta-feira?" },
    { english: "Does the meeting start at 3 PM?", portuguese: "A reunião começa às 15 horas?" },
    { english: "When does he finish college?", portuguese: "Quando ele termina a faculdade?" },
    { english: "What time does she start her course?", portuguese: "Que horas ela começa o curso dela?" },
    { english: "Why does it start so late?", portuguese: "Por que isso começa tão tarde?" }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            ⏰ Lesson 31 - START / FINISH
          </h1>
          <SpeakSentence text="Learn to talk about beginnings, endings, deadlines, and daily schedules." className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            📚 Learn to talk about beginnings, endings, deadlines, and daily schedules.
          </SpeakSentence>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Starting and finishing tasks - Race start and project completion"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 italic">🎯 Start strong, finish stronger!</p>
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
                    1. <SpeakText text="start" className="text-blue-600 font-bold">start</SpeakText> / <SpeakText text="I start" className="text-blue-600 font-bold">I start</SpeakText>. / <SpeakText text="You start" className="text-blue-600 font-bold">You start</SpeakText>. / <SpeakText text="We start" className="text-blue-600 font-bold">We start</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 começar / eu começo / você começa / nós começamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="I want to start" className="text-blue-600 font-bold">I want to start</SpeakText>. / <SpeakText text="I need to start" className="text-blue-600 font-bold">need</SpeakText> / <SpeakText text="I have to start" className="text-blue-600 font-bold">have to</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu quero começar / eu preciso começar / eu tenho que começar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="When do you start" className="text-blue-600 font-bold">When do you start</SpeakText>? / <SpeakText text="When does he start" className="text-blue-600 font-bold">does he</SpeakText> / <SpeakText text="When does she start" className="text-blue-600 font-bold">does she</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 quando você começa? / quando ele começa? / quando ela começa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="finish" className="text-blue-600 font-bold">finish</SpeakText> / <SpeakText text="I finish" className="text-blue-600 font-bold">I finish</SpeakText>. / <SpeakText text="You finish" className="text-blue-600 font-bold">You finish</SpeakText>. / <SpeakText text="They finish" className="text-blue-600 font-bold">They finish</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 terminar / eu termino / você termina / eles terminam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="I finish college this year" className="text-blue-600 font-bold">I finish college this year</SpeakText>. / <SpeakText text="I finish high school this year" className="text-blue-600 font-bold">high school</SpeakText> / <SpeakText text="I finish the course this year" className="text-blue-600 font-bold">the course</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu termino a faculdade este ano / o ensino médio / o curso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="Do you finish at five" className="text-blue-600 font-bold">Do you finish at five</SpeakText>? / <SpeakText text="Does he finish at five" className="text-blue-600 font-bold">Does he</SpeakText> / <SpeakText text="Does she finish at five" className="text-blue-600 font-bold">Does she</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você termina às cinco? / ele termina? / ela termina?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="What time do you finish" className="text-blue-600 font-bold">What time do you finish</SpeakText>? / <SpeakText text="What time does he finish" className="text-blue-600 font-bold">he</SpeakText> / <SpeakText text="What time does she finish" className="text-blue-600 font-bold">she</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 que horas você termina? / ele termina? / ela termina?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="I do not start today" className="text-blue-600 font-bold">I don't start today</SpeakText>. / <SpeakText text="You do not start today" className="text-blue-600 font-bold">You</SpeakText> / <SpeakText text="They do not start today" className="text-blue-600 font-bold">They</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu não começo hoje / você não começa / eles não começam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <SpeakText text="He does not finish today" className="text-blue-600 font-bold">He does not finish today</SpeakText>. / <SpeakText text="He does not finish tomorrow" className="text-blue-600 font-bold">tomorrow</SpeakText> / <SpeakText text="He does not finish this week" className="text-blue-600 font-bold">this week</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ele não termina hoje / amanhã / esta semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <SpeakText text="Do you want to start now" className="text-blue-600 font-bold">Do you want to start now</SpeakText>? / <SpeakText text="Do you want to finish now" className="text-blue-600 font-bold">finish</SpeakText> / <SpeakText text="Do you want to study now" className="text-blue-600 font-bold">study</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você quer começar agora? / terminar? / estudar?</p>
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
                    1. <SpeakText text="I start college this year" className="text-blue-600 font-bold">I start college this year</SpeakText>. / <SpeakText text="I start high school this year" className="text-blue-600 font-bold">high school</SpeakText> / <SpeakText text="I start a course this year" className="text-blue-600 font-bold">a course</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu começo a faculdade este ano / o ensino médio / um curso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="We have a meeting" className="text-blue-600 font-bold">We have a meeting</SpeakText>. / <SpeakText text="We have a project" className="text-blue-600 font-bold">a project</SpeakText> / <SpeakText text="We have a task" className="text-blue-600 font-bold">a task</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós temos uma reunião / um projeto / uma tarefa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="The exam is next week" className="text-blue-600 font-bold">The exam is next week</SpeakText>. / <SpeakText text="The exam is next month" className="text-blue-600 font-bold">next month</SpeakText> / <SpeakText text="The exam is next semester" className="text-blue-600 font-bold">next semester</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 a prova é na próxima semana / no próximo mês / no próximo semestre</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="I have one hour" className="text-blue-600 font-bold">I have one hour</SpeakText>. / <SpeakText text="I have one minute" className="text-blue-600 font-bold">one minute</SpeakText> / <SpeakText text="I have a deadline" className="text-blue-600 font-bold">a deadline</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu tenho uma hora / um minuto / um prazo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="I want to study business" className="text-blue-600 font-bold">I want to study business</SpeakText>. / <SpeakText text="I want to study everything" className="text-blue-600 font-bold">everything</SpeakText> / <SpeakText text="That is great" className="text-blue-600 font-bold">That is great</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu quero estudar negócios / tudo / isso é ótimo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="Do you have a deadline this week" className="text-blue-600 font-bold">Do you have a deadline this week</SpeakText>? / <SpeakText text="Do you have a meeting this week" className="text-blue-600 font-bold">a meeting</SpeakText> / <SpeakText text="Do you have an exam this week" className="text-blue-600 font-bold">an exam</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você tem um prazo esta semana? / uma reunião? / uma prova?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="We need to finish the project" className="text-blue-600 font-bold">We need to finish the project</SpeakText>. / <SpeakText text="We need to finish the task" className="text-blue-600 font-bold">the task</SpeakText> / <SpeakText text="We need to finish the course" className="text-blue-600 font-bold">the course</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós precisamos terminar o projeto / a tarefa / o curso</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill - MODIFIED */}
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
            <SpeakSentence text="Practice common phrases to talk about beginnings and endings in past, present, and future." className="text-md text-gray-600 mb-4 italic">
              💬 Practice common phrases to talk about beginnings and endings in past, present, and future.
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
                    1. <SpeakText text="I started a new course yesterday" className="text-blue-600 font-bold">I started a new course yesterday</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu comecei um novo curso ontem.</p> 
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="She finished her project last week" className="text-blue-600 font-bold">She finished her project last week</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela terminou o projeto dela na semana passada.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="He will start college next year" className="text-blue-600 font-bold">He will start college next year</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele vai começar a faculdade no ano que vem.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="We will finish the meeting in an hour" className="text-blue-600 font-bold">We will finish the meeting in an hour</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós vamos terminar a reunião em uma hora.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="Does he start work at 9 AM" className="text-blue-600 font-bold">Does he start work at 9 AM</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele começa a trabalhar às 9 da manhã?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="Does she finish class at noon" className="text-blue-600 font-bold">Does she finish class at noon</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela termina a aula ao meio-dia?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="Does it start on time" className="text-blue-600 font-bold">Does it start on time</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Isso começa na hora certa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="Let's start" className="text-blue-600 font-bold">Let's start</SpeakText>!
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Vamos começar!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar with Drill - MODIFIED */}
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
            <SpeakSentence text="Practice past, future, and questions with Do/Does for He, She, It." className="text-md text-gray-600 mb-4 italic">
              📚 Practice past, future, and questions with Do/Does for He, She, It.
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
                    1. <SpeakText text="I started this course last month" className="text-blue-600 font-bold">I started this course last month</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu comecei este curso no mês passado.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <SpeakText text="She finished her homework an hour ago" className="text-blue-600 font-bold">She finished her homework an hour ago</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela terminou a lição de casa dela há uma hora.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <SpeakText text="He will start his new job tomorrow" className="text-blue-600 font-bold">He will start his new job tomorrow</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele vai começar o novo trabalho dele amanhã.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <SpeakText text="They will finish the project next week" className="text-blue-600 font-bold">They will finish the project next week</SpeakText>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eles vão terminar o projeto na próxima semana.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <SpeakText text="Does she want to start the meeting now" className="text-blue-600 font-bold">Does she want to start the meeting now</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela quer começar a reunião agora?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <SpeakText text="Does he need to finish the report today" className="text-blue-600 font-bold">Does he need to finish the report today</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele precisa terminar o relatório hoje?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <SpeakText text="When does the movie start" className="text-blue-600 font-bold">When does the movie start</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando começa o filme?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <SpeakText text="What time does she finish work" className="text-blue-600 font-bold">What time does she finish work</SpeakText>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Que horas ela termina o trabalho?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice - MODIFIED */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Replace the blue words to practice
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <SpeakSentence text={sentence.english} className="text-lg font-medium">
                          {index + 1}. {sentence.english}
                        </SpeakSentence>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 ml-6">{sentence.portuguese}</p>
                    </div>
                  ))}
                </div>

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={collegeImage}
                        alt="College and education"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Starting college or courses
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={meetingImage}
                        alt="Business meeting"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Meetings and deadlines
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={deadlineImage}
                        alt="Deadline and planning"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Projects and tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out! */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP</h2>
              <PencilIcon onClick={() => openNoteModal('Check It Out')} />
            </div>
            <p className="text-sm text-blue-100">
              Time Expressions & Question Patterns
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Final Activity - Speaking */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL ACTIVITY - SPEAKING</h2>
            <SpeakSentence text="Answer in English:" className="mt-2 text-blue-100 italic">
              🗣️ Answer in English:
            </SpeakSentence>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-8">
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 1. When do you start work or school?</p>
                  <p className="text-gray-600 mt-2">I start at _______ . / I start on _______ .</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 2. What do you want to study?</p>
                  <p className="text-gray-600 mt-2">I want to study _______ .</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 3. Do you have a deadline this week?</p>
                  <p className="text-gray-600 mt-2">Yes, I do. / No, I don't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 4. Do you have a meeting today?</p>
                  <p className="text-gray-600 mt-2">Yes, I do. / No, I don't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 5. What do you want to start this year?</p>
                  <p className="text-gray-600 mt-2">I want to start _______ .</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (30)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (32) &rarr;
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