"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ==========================================
// COMPONENT: Native Browser Speech Synthesis Audio Button (Female American English voice)
// ==========================================
function AudioButton({ text, className = "" }: { text: string; className?: string }) {
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
      // Tenta encontrar uma voz feminina americana (Samantha, Google US Female, etc.)
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
      className={`inline-flex items-center justify-center gap-1 text-amber-600 hover:text-amber-800 transition-colors focus:outline-none flex-shrink-0 ${className}`}
      aria-label={`Ouvir: ${text}`}
      title="Clique para ouvir (voz nativa americana)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isPlaying ? 'text-green-500 animate-pulse' : ''}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
      </svg>
      {isPlaying && <span className="text-xs text-green-600 font-bold ml-1">🔊</span>}
    </button>
  );
}

// ==========================================
// COMPONENT: Note Modal (Anotações)
// ==========================================
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
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-amber-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
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
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none"
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
            className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: Pencil Icon (Anotações)
// ==========================================
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

// ==========================================
// LESSON 8 DATA (HSE - Health, Safety & Environment)
// ==========================================

const lessonData = {
  conversations: [
    {
      id: 1,
      title: "Job Interview (HSE Technician)",
      lines: [
        { speaker: "Interviewer", text: "Good morning! Can you tell me about your experience with health and safety?" },
        { speaker: "Candidate", text: "Good morning! I have three years of experience working in industrial safety. I always follow HSE procedures and encourage my team to wear PPE." },
        { speaker: "Interviewer", text: "How do you deal with unsafe situations?" },
        { speaker: "Candidate", text: "First, I stop the activity. Then I report the hazard to my supervisor and make sure everyone is safe before continuing." },
        { speaker: "Interviewer", text: "Have you ever investigated an incident?" },
        { speaker: "Candidate", text: "Yes. We interviewed the workers, inspected the equipment, and found the root cause. After that, we improved the safety procedure." },
        { speaker: "Interviewer", text: "Why do you want to work offshore?" },
        { speaker: "Candidate", text: "I enjoy working in challenging environments. Safety is my priority, and I like working as part of a team." }
      ]
    },
    {
      id: 2,
      title: "Risk On Board",
      lines: [
        { speaker: "Supervisor", text: "Good morning, everyone. Before we start, let's have our toolbox talk." },
        { speaker: "Worker", text: "I noticed an oil spill near the pump." },
        { speaker: "Supervisor", text: "Good job reporting it immediately. Did you isolate the area?" },
        { speaker: "Worker", text: "Yes. We placed warning signs and informed the control room." },
        { speaker: "Supervisor", text: "Excellent. We must prevent slips and environmental contamination." },
        { speaker: "Worker", text: "Should we inspect the equipment before restarting?" },
        { speaker: "Supervisor", text: "Absolutely. Nobody starts work until the area is declared safe." }
      ]
    },
    {
      id: 3,
      title: "Permit to Work (PTW)",
      lines: [
        { speaker: "Supervisor", text: "Do you have the Permit to Work?" },
        { speaker: "Technician", text: "Yes. It has already been approved by the safety officer." },
        { speaker: "Supervisor", text: "Did everyone attend the safety briefing?" },
        { speaker: "Technician", text: "Yes. We reviewed the risks, emergency exits, PPE requirements, and rescue procedures." },
        { speaker: "Supervisor", text: "Great. Is the fire extinguisher nearby?" },
        { speaker: "Technician", text: "Yes. The first aid kit is also ready, and all emergency equipment has been inspected." },
        { speaker: "Supervisor", text: "Excellent. Safety first. Let's begin." }
      ]
    }
  ],
  usefulExpressions: [
    { english: "follow HSE procedures", portuguese: "seguir os procedimentos de HSE" },
    { english: "wear PPE", portuguese: "usar EPI" },
    { english: "report a hazard", portuguese: "reportar um perigo" },
    { english: "unsafe situation", portuguese: "situação insegura" },
    { english: "root cause", portuguese: "causa raiz" },
    { english: "work as part of a team", portuguese: "trabalhar como parte de uma equipe" },
    { english: "oil spill", portuguese: "vazamento de óleo" },
    { english: "warning sign", portuguese: "placa de advertência" },
    { english: "control room", portuguese: "sala de controle" },
    { english: "slip hazard", portuguese: "risco de escorregar" },
    { english: "declare safe", portuguese: "declarar seguro" },
    { english: "restart the operation", portuguese: "reiniciar a operação" },
    { english: "Permit to Work (PTW)", portuguese: "Permissão para Trabalho" },
    { english: "safety briefing", portuguese: "reunião de segurança" },
    { english: "rescue procedure", portuguese: "procedimento de resgate" },
    { english: "emergency equipment", portuguese: "equipamento de emergência" },
    { english: "approved", portuguese: "aprovado" },
    { english: "ready to work", portuguese: "pronto para trabalhar" }
  ],
  idioms: [
    { english: "Safety comes first.", portuguese: "Segurança vem em primeiro lugar." },
    { english: "Better safe than sorry.", portuguese: "Melhor prevenir do que remediar." },
    { english: "Keep your eyes open.", portuguese: "Fique atento." },
    { english: "Speak up if something isn't right.", portuguese: "Fale se perceber algo errado." },
    { english: "No shortcuts.", portuguese: "Nunca pule etapas." },
    { english: "Think before you act.", portuguese: "Pense antes de agir." }
  ],
  offshoreSlang: [
    { term: "Toolbox Talk", definition: "Reunião rápida de segurança antes do início das atividades.", example: "We have a toolbox talk every morning." },
    { term: "Red Zone", definition: "Área de alto risco onde é necessário cuidado extra.", example: "Stay out of the red zone." },
    { term: "Green Hat", definition: "Profissional novo na plataforma, ainda em período de adaptação.", example: "He is a green hat, so help him learn the procedures." }
  ],
  essentialPhrases: [
    "Safety comes first.",
    "Better safe than sorry.",
    "Report hazards immediately.",
    "Stop Work Authority.",
    "Follow the procedure.",
    "Wear your PPE at all times.",
    "Let's have a toolbox talk.",
    "Is the area safe?",
    "We need a risk assessment.",
    "The permit has been approved."
  ]
};

// ==========================================
// VOCABULARY CHALLENGE (Exercises)
// ==========================================
const vocabularyChallenge = [
  { id: 1, question: "Always wear your ______ before entering the work area.", correctAnswer: "PPE" },
  { id: 2, question: "If you see a hazard, you must ______ it immediately.", correctAnswer: "report" },
  { id: 3, question: "Before starting the task, we need a ______ to Work.", correctAnswer: "Permit" },
  { id: 4, question: "The ______ extinguisher is next to the emergency exit.", correctAnswer: "fire" },
  { id: 5, question: "Safety ______ first.", correctAnswer: "comes" }
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Lesson8HSE() {
  const router = useRouter();
  
  const [expandedSections, setExpandedSections] = useState({
    conversation1: true,
    conversation2: true,
    conversation3: true,
    expressions: true,
    idioms: true,
    slang: true,
    challenge: true,
    essential: true
  });

  const [noteModal, setNoteModal] = useState({
    isOpen: false,
    sectionTitle: '',
    noteContent: '',
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [challengeAnswers, setChallengeAnswers] = useState<Record<number, string>>({});
  const [challengeResults, setChallengeResults] = useState<Record<number, boolean>>({});
  const [showChallengeResults, setShowChallengeResults] = useState<Record<number, boolean>>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  const handleChallengeChange = (id: number, value: string) => {
    setChallengeAnswers(prev => ({ ...prev, [id]: value }));
  };

  const checkChallenge = (id: number) => {
    const isCorrect = challengeAnswers[id]?.toLowerCase().trim() === vocabularyChallenge.find(ex => ex.id === id)?.correctAnswer.toLowerCase();
    setChallengeResults(prev => ({ ...prev, [id]: isCorrect }));
    setShowChallengeResults(prev => ({ ...prev, [id]: true }));
  };

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const ppeImage = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const offshoreImage = "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  return (
    <div className="min-h-screen py-16 px-6 bg-fixed" style={{ backgroundImage: `url("https://images.unsplash.com/photo-1504309092620-4d0d726b7f03?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }}>
      <div className="max-w-6xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-600 mb-4">
            🛢️ LEAF English – Lesson 8
          </h1>
          <h2 className="text-3xl font-bold text-[#0c4a6e] mb-3">
            Health, Safety & Environment (HSE)
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Speaking Practice (A2–B1) • Topic: Health, Safety & Environment (HSE)
          </p>
          <div className="w-64 h-64 mx-auto mb-6">
            <img src={mainImage} alt="HSE Concept" className="w-full h-full object-cover rounded-2xl shadow-md" />
          </div>
          <div className="flex justify-center gap-4">
            <button onClick={() => openNoteModal('Geral')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-6 rounded-full flex items-center gap-2 transition">📝 Anotações</button>
          </div>
        </div>

        {/* Conversation 1 */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">🛢️ {lessonData.conversations[0].title} <PencilIcon onClick={() => openNoteModal('Conversation 1')} /></h2>
            <button onClick={() => toggleSection('conversation1')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.conversation1 ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.conversation1 && (
            <div className="p-8 space-y-4 bg-amber-50/30">
              {lessonData.conversations[0].lines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-amber-700 text-sm">{line.speaker}:</p>
                    <p className="text-gray-800 text-lg">{line.text}</p>
                  </div>
                  <AudioButton text={line.text} className="ml-4" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation 2 */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">🚨 {lessonData.conversations[1].title} <PencilIcon onClick={() => openNoteModal('Conversation 2')} /></h2>
            <button onClick={() => toggleSection('conversation2')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.conversation2 ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.conversation2 && (
            <div className="p-8 space-y-4 bg-amber-50/30">
              {lessonData.conversations[1].lines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-amber-700 text-sm">{line.speaker}:</p>
                    <p className="text-gray-800 text-lg">{line.text}</p>
                  </div>
                  <AudioButton text={line.text} className="ml-4" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation 3 */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">⚙️ {lessonData.conversations[2].title} <PencilIcon onClick={() => openNoteModal('Conversation 3')} /></h2>
            <button onClick={() => toggleSection('conversation3')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.conversation3 ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.conversation3 && (
            <div className="p-8 space-y-4 bg-amber-50/30">
              {lessonData.conversations[2].lines.map((line, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex-1">
                    <p className="font-bold text-amber-700 text-sm">{line.speaker}:</p>
                    <p className="text-gray-800 text-lg">{line.text}</p>
                  </div>
                  <AudioButton text={line.text} className="ml-4" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Useful Expressions */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">📚 Useful Expressions <PencilIcon onClick={() => openNoteModal('Useful Expressions')} /></h2>
            <button onClick={() => toggleSection('expressions')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.expressions ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.expressions && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonData.usefulExpressions.map((item, idx) => (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-amber-800 font-bold text-sm">{item.english}</p>
                      <p className="text-gray-600 text-xs mt-1">{item.portuguese}</p>
                    </div>
                    <AudioButton text={item.english} className="ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Idioms */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">💬 Idioms <PencilIcon onClick={() => openNoteModal('Idioms')} /></h2>
            <button onClick={() => toggleSection('idioms')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.idioms ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.idioms && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonData.idioms.map((item, idx) => (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <p className="text-amber-800 font-bold text-base italic">"{item.english}"</p>
                      <p className="text-gray-600 text-xs mt-1">{item.portuguese}</p>
                    </div>
                    <AudioButton text={item.english} className="ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Offshore Slang */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">⚓ Offshore Slang <PencilIcon onClick={() => openNoteModal('Offshore Slang')} /></h2>
            <button onClick={() => toggleSection('slang')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.slang ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.slang && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lessonData.offshoreSlang.map((item, idx) => (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col">
                    <div className="flex justify-between items-start">
                      <p className="text-amber-800 font-bold text-lg">{item.term}</p>
                      <AudioButton text={item.term} className="ml-2" />
                    </div>
                    <p className="text-gray-600 text-sm mt-1 italic">"{item.definition}"</p>
                    <p className="text-amber-600 text-xs mt-2">Example: "{item.example}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vocabulary Challenge */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">⭐ Vocabulary Challenge <PencilIcon onClick={() => openNoteModal('Vocabulary Challenge')} /></h2>
            <button onClick={() => toggleSection('challenge')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.challenge ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.challenge && (
            <div className="p-8">
              <div className="space-y-6">
                {vocabularyChallenge.map((ex) => (
                  <div key={ex.id} className="bg-amber-50 p-5 rounded-xl border border-amber-200">
                    <p className="text-gray-800 text-lg font-medium mb-3">{ex.question}</p>
                    <div className="flex gap-3 mb-2">
                      <input 
                        type="text" 
                        value={challengeAnswers[ex.id] || ""} 
                        onChange={(e) => handleChallengeChange(ex.id, e.target.value)} 
                        className="flex-1 px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none" 
                        placeholder="Type your answer..." 
                      />
                      <button onClick={() => checkChallenge(ex.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition font-medium">Check</button>
                    </div>
                    {showChallengeResults[ex.id] && (
                      <div className={`p-3 rounded-lg border ${challengeResults[ex.id] ? 'bg-green-100 border-green-300' : 'bg-red-100 border-red-300'}`}>
                        <p className={`font-medium ${challengeResults[ex.id] ? 'text-green-700' : 'text-red-700'}`}>
                          {challengeResults[ex.id] ? '✅ Correct!' : `❌ Incorrect. The correct answer is: "${ex.correctAnswer}"`}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Essential Phrases */}
        <div className="bg-white border-2 border-amber-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">💼 Essential Phrases <PencilIcon onClick={() => openNoteModal('Essential Phrases')} /></h2>
            <button onClick={() => toggleSection('essential')} className="p-2 rounded-full hover:bg-white/20 transition">
              {expandedSections.essential ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
            </button>
          </div>
          {expandedSections.essential && (
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lessonData.essentialPhrases.map((phrase, idx) => (
                  <div key={idx} className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex items-center justify-between">
                    <p className="text-amber-800 font-bold text-sm italic">"{phrase}"</p>
                    <AudioButton text={phrase} className="ml-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button onClick={() => router.push("/cursos/lesson7")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md">
            &larr; Previous Lesson
          </button>
          <button onClick={() => router.push("/cursos/lesson9")} className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full transition-colors shadow-md">
            Next Lesson &rarr;
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm border-t border-gray-200 pt-6">
          <p>LEAF English – Lesson 8: Health, Safety & Environment (HSE)</p>
          <p className="text-xs mt-1">🛢️ "Safety comes first." • "Better safe than sorry."</p>
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
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}