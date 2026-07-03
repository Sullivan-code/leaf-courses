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

// Native Browser Speech Synthesis Audio Button
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
  const mainImage = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const birthdayImage = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const monthsImage = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
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

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "Was I late?", portuguese: "Eu estava atrasado?" },
    { english: "Are you Brazilian?", portuguese: "Você é brasileiro?" },
    { english: "Isn't he a student?", portuguese: "Ele não é estudante?" },
    { english: "Is she a sales clerk?", portuguese: "Ela é vendedora?" },
    { english: "Was it a good book?", portuguese: "Era um bom livro?" },
    { english: "Are we ready to start?", portuguese: "Estamos prontos para começar?" },
    { english: "Are they going to be with you?", portuguese: "Eles vão estar com você?" },
    { english: "Who are you?", portuguese: "Quem é você?" },
    { english: "Who is he?", portuguese: "Quem é ele?" },
    { english: "Who were those people?", portuguese: "Quem eram aquelas pessoas?" },
    { english: "How old is she?", portuguese: "Quantos anos ela tem?" },
    { english: "She's ten years old.", portuguese: "Ela tem 10 anos" },
    { english: "When was your birthday?", portuguese: "Quando foi seu aniversário?" },
    { english: "It's in April.", portuguese: "É em abril" },
    { english: "Is your father a manager?", portuguese: "Seu pai é gerente?" },
    { english: "I will go to the beach in January.", portuguese: "Eu irei à praia em janeiro." },
    { english: "She will be 25 years old next month.", portuguese: "Ela fará 25 anos no próximo mês." },
    { english: "They will start the course in March.", portuguese: "Eles começarão o curso em março." },
    { english: "Will you be at the office tomorrow?", portuguese: "Você estará no escritório amanhã?" },
    { english: "He will arrive at 8 o'clock.", portuguese: "Ele chegará às 8 horas." },
    { english: "We will have a meeting on Friday.", portuguese: "Nós teremos uma reunião na sexta-feira." },
    { english: "I won't be late for the meeting.", portuguese: "Eu não chegarei atrasado para a reunião." },
    { english: "She won't go to the pharmacy today.", portuguese: "Ela não irá à farmácia hoje." },
    { english: "They won't be at the bank tomorrow.", portuguese: "Eles não estarão no banco amanhã." },
    { english: "He won't work in December.", portuguese: "Ele não trabalhará em dezembro." },
    { english: "We won't have class next week.", portuguese: "Nós não teremos aula na próxima semana." },
    { english: "You won't need to bring anything.", portuguese: "Você não precisará trazer nada." },
    { english: "Did you go to the beach in February?", portuguese: "Você foi à praia em fevereiro?" },
    { english: "Did she visit the shopping mall yesterday?", portuguese: "Ela visitou o shopping ontem?" },
    { english: "Did they study for the test?", portuguese: "Eles estudaram para a prova?" },
    { english: "Did your father work at the office?", portuguese: "Seu pai trabalhou no escritório?" },
    { english: "Did you see the new store downtown?", portuguese: "Você viu a nova loja no centro?" },
    { english: "Did we miss the bus?", portuguese: "Nós perdemos o ônibus?" },
    { english: "Did he call you yesterday?", portuguese: "Ele te ligou ontem?" },
    { english: "Did she buy the medicine at the pharmacy?", portuguese: "Ela comprou o remédio na farmácia?" },
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
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to ask questions with the verb "to be", talk about birthdays and months, and use ordinal numbers.
          </p>
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
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Am I Brazilian?</span> / American? / British?</p>
                    <p className="text-sm text-gray-600 mt-1">Eu sou brasileiro? / americano? / britânico?</p>
                  </div>
                  <AudioButton text="Am I Brazilian" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Are you a student?</span> / a teacher? / a doctor?</p>
                    <p className="text-sm text-gray-600 mt-1">Você é estudante? / professor? / médico?</p>
                  </div>
                  <AudioButton text="Are you a student" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Is he your brother?</span> / your father? / your cousin?</p>
                    <p className="text-sm text-gray-600 mt-1">Ele é seu irmão? / pai? / primo?</p>
                  </div>
                  <AudioButton text="Is he your brother" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Is she your wife?</span> / your coworker? / your aunt?</p>
                    <p className="text-sm text-gray-600 mt-1">Ela é sua esposa? / colega de trabalho? / tia?</p>
                  </div>
                  <AudioButton text="Is she your wife" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Is it new?</span> / old? / important?</p>
                    <p className="text-sm text-gray-600 mt-1">É novo? / velho? / importante?</p>
                  </div>
                  <AudioButton text="Is it new" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Will we be late?</span> / Will they be late? / Will we be late?</p>
                    <p className="text-sm text-gray-600 mt-1">Nós estaremos atrasados? / Eles estarão? / Vocês estarão?</p>
                  </div>
                  <AudioButton text="Are we late" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Were you going to the shopping mall?</span> / to the bank? / to the pharmacy?</p>
                    <p className="text-sm text-gray-600 mt-1">Vocês estavam indo para o shopping? / banco? / farmácia?</p>
                  </div>
                  <AudioButton text="Are you at the shopping mall" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Are they here?</span> / there? / downtown?</p>
                    <p className="text-sm text-gray-600 mt-1">Eles estão aqui? / lá? / no centro da cidade?</p>
                  </div>
                  <AudioButton text="Are they here" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - MONTHS & NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 NEW WORDS (Months & Vocabulary)</h2>
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
            
            <h3 className="text-xl font-semibold text-green-700 mb-4">📅 Months of the Year / Meses do Ano</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map((month, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-green-600 font-bold">{month.english}</span> = {month.portuguese}
                  </div>
                  <AudioButton text={month.english} />
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-green-700 mb-4">📚 New Vocabulary / Novo Vocabulário</h3>
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
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">It is January</span>. / February / March.</p>
                    <p className="text-sm text-gray-600 mt-1">É janeiro / fevereiro / março</p>
                  </div>
                  <AudioButton text="It is January" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">My birthday is in April</span>. / May / June.</p>
                    <p className="text-sm text-gray-600 mt-1">Meu aniversário é em abril / maio / junho</p>
                  </div>
                  <AudioButton text="My birthday is in April" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">My vacation is in October</span>. / August / September.</p>
                    <p className="text-sm text-gray-600 mt-1">Minhas férias são em outubro / agosto / setembro</p>
                  </div>
                  <AudioButton text="My vacation is in October" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">We don't go to school in July</span>. / December / January.</p>
                    <p className="text-sm text-gray-600 mt-1">Nós não vamos para a escola em julho / dezembro / janeiro</p>
                  </div>
                  <AudioButton text="We don't go to school in July" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">I usually go to the beach in February</span>. / November / March.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu geralmente vou à praia em fevereiro / novembro / março</p>
                  </div>
                  <AudioButton text="I usually go to the beach in February" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">Do you work in July?</span> / January? / December?</p>
                    <p className="text-sm text-gray-600 mt-1">Você trabalha em julho? / janeiro? / dezembro?</p>
                  </div>
                  <AudioButton text="Do you work in July" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">His birthday is tomorrow</span>. / today / next week.</p>
                    <p className="text-sm text-gray-600 mt-1">O aniversário dele é amanhã / hoje / semana que vem</p>
                  </div>
                  <AudioButton text="His birthday is tomorrow" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">She is very young</span>. / smart / pretty.</p>
                    <p className="text-sm text-gray-600 mt-1">Ela é muito jovem / esperta / bonita</p>
                  </div>
                  <AudioButton text="She is very young" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">We are ready to start</span>. / They are ready / I am ready.</p>
                    <p className="text-sm text-gray-600 mt-1">Nós estamos prontos para começar / Eles estão / Eu estou</p>
                  </div>
                  <AudioButton text="We are ready to start" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-green-600 font-bold">I want to start the course in April</span>. / March / September.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero começar o curso em abril / março / setembro</p>
                  </div>
                  <AudioButton text="I want to start the course in April" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - USEFUL PHRASES with Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native (Useful Phrases)</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases to talk about age and birthdays</p>
            <div className="bg-yellow-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-yellow-600 font-bold">{phrase.english}</span> = {phrase.portuguese}
                  </div>
                  <AudioButton text={phrase.english} />
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">How old are you?</span> / How old are they? / How old are you (plural)?</p>
                    <p className="text-sm text-gray-600 mt-1">Quantos anos você tem? / eles? / vocês?</p>
                  </div>
                  <AudioButton text="How old are you" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">I am 20 years old</span>. / He is 20 / You are 20.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu tenho 20 anos / Ele tem / Vocês têm</p>
                  </div>
                  <AudioButton text="I am 20 years old" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">She is 25 years old</span>. / He is 25.</p>
                    <p className="text-sm text-gray-600 mt-1">Ela tem 25 anos / Ele tem</p>
                  </div>
                  <AudioButton text="She is 25 years old" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">He is young</span>. / He is 15 years old / 12 / 14.</p>
                    <p className="text-sm text-gray-600 mt-1">Ele é jovem / Ele tem 15 anos / 12 / 14</p>
                  </div>
                  <AudioButton text="He is young" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">My father is 65 years old</span>. / 70 / 81.</p>
                    <p className="text-sm text-gray-600 mt-1">Meu pai tem 65 anos / 70 / 81</p>
                  </div>
                  <AudioButton text="My father is 65 years old" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">When is your birthday?</span> / his birthday? / her birthday?</p>
                    <p className="text-sm text-gray-600 mt-1">Quando é seu aniversário? / dele? / dela?</p>
                  </div>
                  <AudioButton text="When is your birthday" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">My birthday is on June 1st</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Meu aniversário é dia primeiro de junho</p>
                  </div>
                  <AudioButton text="My birthday is on June 1st" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600 font-bold">My birthday is on August 10th</span>. / 15th / 12th.</p>
                    <p className="text-sm text-gray-600 mt-1">Meu aniversário é dia 10 de agosto / 15 / 12</p>
                  </div>
                  <AudioButton text="My birthday is on August 10th" />
                </div>
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
            <p className="text-md text-gray-600 mb-4 italic">Complete structures with the verb to be in interrogative sentences</p>
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
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Are you ready?</span> / Is she ready? / Are they ready?</p>
                    <p className="text-sm text-gray-600 mt-1">Você está pronta? / Ela está? / Eles estão?</p>
                  </div>
                  <AudioButton text="Are you ready" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Are they funny?</span> / smart? / kind?</p>
                    <p className="text-sm text-gray-600 mt-1">Eles são engraçados? / espertos? / gentis?</p>
                  </div>
                  <AudioButton text="Are they funny" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Is he at the station?</span> / at the park? / at home?</p>
                    <p className="text-sm text-gray-600 mt-1">Ele está na estação? / no parque? / em casa?</p>
                  </div>
                  <AudioButton text="Is he at the station" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Is it near here?</span> / Is it far?</p>
                    <p className="text-sm text-gray-600 mt-1">É perto daqui? / longe?</p>
                  </div>
                  <AudioButton text="Is it near here" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Is the backpack expensive?</span> / cheap? / good?</p>
                    <p className="text-sm text-gray-600 mt-1">A mochila é cara? / barata? / boa?</p>
                  </div>
                  <AudioButton text="Is the backpack expensive" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Are they lawyers?</span> / designers? / managers?</p>
                    <p className="text-sm text-gray-600 mt-1">Eles são advogados? / projetistas? / gerentes?</p>
                  </div>
                  <AudioButton text="Are they lawyers" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Who are you?</span> / Who are they? / Who is she?</p>
                    <p className="text-sm text-gray-600 mt-1">Quem é você? / Quem são eles? / Quem é ela?</p>
                  </div>
                  <AudioButton text="Who are you" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Who is that person?</span> / that student? / that engineer?</p>
                    <p className="text-sm text-gray-600 mt-1">Quem é aquela pessoa? / aquele aluno? / aquele engenheiro?</p>
                  </div>
                  <AudioButton text="Who is that person" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">Where are you now?</span> / Where are they? / Where is she?</p>
                    <p className="text-sm text-gray-600 mt-1">Onde você está agora? / elas? / ele?</p>
                  </div>
                  <AudioButton text="Where are you now" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-purple-600 font-bold">When is your birthday?</span> / his birthday? / her birthday?</p>
                    <p className="text-sm text-gray-600 mt-1">Quando é seu aniversário? / dele? / dela?</p>
                  </div>
                  <AudioButton text="When is your birthday" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎭 MAKE IT YOURS</h2>
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

              {/* Useful Questions and Answers */}
              {openDrills.realLife && (
                <div className="mt-8 border-t border-red-200 pt-6 animate-fadeIn">
                  <h3 className="text-xl font-bold text-red-700 mb-4">❓ Useful Questions & Answers / Perguntas e Respostas Úteis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">What's your name?</p>
                        <p className="text-sm text-gray-500 mt-1">Qual é o seu nome?</p>
                      </div>
                      <AudioButton text="What's your name" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">Where is your office?</p>
                        <p className="text-sm text-gray-500 mt-1">Onde fica seu escritório?</p>
                      </div>
                      <AudioButton text="Where is your office" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-red-200 flex justify-between items-center">
                      <div>
                        <p className="text-red-600 font-medium">What time is the meeting?</p>
                        <p className="text-sm text-gray-500 mt-1">Que horas é a reunião?</p>
                      </div>
                      <AudioButton text="What time is the meeting" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="text-green-600 font-medium">Yes, I am.</p>
                        <p className="text-sm text-gray-500 mt-1">Sim, eu sou/estou.</p>
                      </div>
                      <AudioButton text="Yes I am" />
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-green-200 flex justify-between items-center">
                      <div>
                        <p className="text-green-600 font-medium">No, I'm not.</p>
                        <p className="text-sm text-gray-500 mt-1">Não, eu não sou/estou.</p>
                      </div>
                      <AudioButton text="No I'm not" />
                    </div>
                  </div>
                </div>
              )}
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
                <div key={ordinal.number} className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200 hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-teal-600">{ordinal.number}</p>
                    <p className="text-lg font-medium text-teal-700 mt-1">{ordinal.english}</p>
                    <p className="text-sm text-teal-500">{ordinal.portuguese}</p>
                  </div>
                  <AudioButton text={ordinal.english} />
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-teal-100 rounded-xl">
              <h4 className="font-bold text-teal-800 mb-2">🎂 Birthday Examples / Exemplos de Aniversário:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                  <div>
                    <p>🎂 "My birthday is <span className="font-bold text-teal-600">in October</span>."</p>
                  </div>
                  <AudioButton text="My birthday is in October" />
                </div>
                <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                  <div>
                    <p>🎂 "My birthday is <span className="font-bold text-teal-600">on October 29th</span>."</p>
                  </div>
                  <AudioButton text="My birthday is on October 29th" />
                </div>
                <div className="p-2 bg-white rounded-lg flex justify-between items-center">
                  <div>
                    <p>📅 "My birthday is on <span className="font-bold text-teal-600">___</span>"</p>
                  </div>
                  <AudioButton text="My birthday is on" />
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