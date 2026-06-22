"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'wrapUp';

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
function AudioButton({ text, children }: { text: string; children?: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <span onClick={speakText} className="cursor-pointer inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors">
      {children}
      {isPlaying && <span className="text-xs text-green-500 ml-1">🔊</span>}
    </span>
  );
}

// Audio click wrapper - makes any text clickable for audio
function AudioText({ text, children }: { text: string; children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (e: React.MouseEvent) => {
    e.stopPropagation();
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
    <span onClick={speakText} className="cursor-pointer hover:text-blue-800 transition-colors">
      {children}
      {isPlaying && <span className="text-xs text-green-500 ml-1">🔊</span>}
    </span>
  );
}

// Wrap Up Component - Ordinal Numbers
function WrapUp() {
  const ordinalNumbers = [
    { number: "1st", english: "first", portuguese: "primeiro" },
    { number: "2nd", english: "second", portuguese: "segundo" },
    { number: "3rd", english: "third", portuguese: "terceiro" },
    { number: "4th", english: "fourth", portuguese: "quarto" },
    { number: "5th", english: "fifth", portuguese: "quinto" },
    { number: "6th", english: "sixth", portuguese: "sexto" },
    { number: "7th", english: "seventh", portuguese: "sétimo" },
    { number: "8th", english: "eighth", portuguese: "oitavo" },
    { number: "9th", english: "ninth", portuguese: "nono" },
    { number: "10th", english: "tenth", portuguese: "décimo" },
    { number: "11th", english: "eleventh", portuguese: "décimo primeiro" },
    { number: "12th", english: "twelfth", portuguese: "décimo segundo" },
    { number: "13th", english: "thirteenth", portuguese: "décimo terceiro" },
    { number: "14th", english: "fourteenth", portuguese: "décimo quarto" },
    { number: "15th", english: "fifteenth", portuguese: "décimo quinto" },
  ];

  return (
    <div className="flex flex-col rounded-lg overflow-hidden shadow-lg border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
        <h3 className="font-bold text-xl">🔢 ORDINAL NUMBERS - 1st to 15th</h3>
        <p className="text-blue-100 text-sm mt-1">Números ordinais em inglês do 1º ao 15º</p>
      </div>
      
      <div className="bg-white p-6">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {ordinalNumbers.map((ordinal) => (
            <div key={ordinal.number} className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200 hover:shadow-md transition-all">
              <p className="text-2xl font-bold text-blue-600">{ordinal.number}</p>
              <AudioText text={ordinal.english}>
                <p className="text-lg font-medium text-blue-700 mt-1 hover:text-blue-900">{ordinal.english}</p>
              </AudioText>
              <p className="text-sm text-blue-500">{ordinal.portuguese}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-2">🎯 Examples in context:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <AudioText text="This is my first time at the dentist">
                <p className="text-gray-800">"This is my <span className="font-bold text-blue-600">first</span> time at the dentist."</p>
              </AudioText>
              <p className="text-sm text-gray-500">É minha primeira vez no dentista.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <AudioText text="He is in second place">
                <p className="text-gray-800">"He is in <span className="font-bold text-blue-600">second</span> place."</p>
              </AudioText>
              <p className="text-sm text-gray-500">Ele está em segundo lugar.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <AudioText text="This is the third time I take this medicine">
                <p className="text-gray-800">"This is the <span className="font-bold text-blue-600">third</span> time I take this medicine."</p>
              </AudioText>
              <p className="text-sm text-gray-500">Esta é a terceira vez que tomo este remédio.</p>
            </div>
            <div className="p-3 bg-white rounded-lg border border-blue-200">
              <AudioText text="She lives on the fifth floor">
                <p className="text-gray-800">"She lives on the <span className="font-bold text-blue-600">fifth</span> floor."</p>
              </AudioText>
              <p className="text-sm text-gray-500">Ela mora no quinto andar.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Lesson39HealthFeelingsProfessions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    wrapUp: false,
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
  const sickImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const professionsImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 39 - Verbs (to be) - Extended
  const verbs = [
  { english: "I'm not", portuguese: "eu não sou / estou" },
  { english: "you aren't", portuguese: "você não é / está" },
  { english: "he isn't", portuguese: "ele não é / está" },
  { english: "she isn't", portuguese: "ela não é / está" },
  { english: "it isn't", portuguese: "ele/ela não é / está" },
  { english: "we aren't", portuguese: "nós não somos / estamos" },
  { english: "they aren't", portuguese: "eles/elas não são / estão" }
  ];

  // Lesson 39 - New Words (Extended)
  const newWords = [
    { english: "student", portuguese: "estudante" },
    { english: "manager", portuguese: "gerente" },
    { english: "sales clerk", portuguese: "vendedor" },
    { english: "lawyer", portuguese: "advogado" },
    { english: "engineer", portuguese: "engenheiro" },
    { english: "designer", portuguese: "projetista" },
    { english: "hungry", portuguese: "com fome" },
    { english: "thirsty", portuguese: "com sede" },
    { english: "tired", portuguese: "cansado" },
    { english: "sad", portuguese: "triste" },
    { english: "upset", portuguese: "chateado" },
    { english: "worried", portuguese: "preocupado" },
    { english: "happy", portuguese: "feliz" },
    { english: "smart", portuguese: "inteligente" },
    { english: "pretty", portuguese: "bonito(a)" },
    { english: "healthy", portuguese: "saudável" },
    { english: "busy", portuguese: "ocupado" },
    { english: "very", portuguese: "muito" },
    { english: "sick", portuguese: "doente" },
    { english: "headache", portuguese: "dor de cabeça" },
    { english: "stomachache", portuguese: "dor de estômago" },
    { english: "toothache", portuguese: "dor de dente" },
  ];

  const usefulPhrases = [
    { english: "What do you do?", portuguese: "O que você faz?" },
    { english: "I'm sure", portuguese: "Eu tenho certeza" },
    { english: "I'm worried about the exam", portuguese: "Estou preocupado com a prova" },
    { english: "I'm worried about the project", portuguese: "Estou preocupado com o projeto" },
    { english: "I'm worried about the reports", portuguese: "Estou preocupado com os relatórios" },
    { english: "I'm worried about my friend", portuguese: "Estou preocupado com meu amigo" },
    { english: "I'm worried about my classmate", portuguese: "Estou preocupado com meu colega de classe" },
    { english: "I'm worried about you", portuguese: "Estou preocupado com você" },
  ];

  const grammarExamples = [
    { english: "I'm not hungry now.", portuguese: "Eu não estou com fome agora." },
    { english: "You are not very far from here.", portuguese: "Você não está muito longe daqui." },
    { english: "He is not busy this week.", portuguese: "Ele não está ocupado esta semana." },
    { english: "She is not tired today.", portuguese: "Ela não está cansada hoje." },
    { english: "It is not late to go there.", portuguese: "Não é tarde para ir lá." },
    { english: "We are not lawyers, we're managers.", portuguese: "Nós não somos advogados, somos gerentes." },
    { english: "They are not upset.", portuguese: "Eles não estão chateados." },
    { english: "I'm not a designer.", portuguese: "Eu não sou projetista." },
    { english: "They are not at school now.", portuguese: "Eles não estão na escola agora." },
    { english: "You are not late for class.", portuguese: "Você não está atrasado para a aula." },
    { english: "She is not at home.", portuguese: "Ela não está em casa." },
    { english: "We are not at church now, we're at the park.", portuguese: "Nós não estamos na igreja agora, estamos no parque." },
    { english: "It is not an interesting story.", portuguese: "Não é uma história interessante." },
    { english: "We are not very tired.", portuguese: "Nós não estamos muito cansados." },
    { english: "They are not engineers.", portuguese: "Eles não são engenheiros." },
    { english: "The exam is not very hard.", portuguese: "A prova não é muito difícil." },
    { english: "I think French fries are not healthy.", portuguese: "Eu acho que batatas fritas não são saudáveis." },
    { english: "They are not sad, they're happy.", portuguese: "Eles não estão tristes, estão felizes." },
    { english: "These are not her shoes.", portuguese: "Estes não são os sapatos dela." },
  ];

  // Real Life Practice Sentences (Extended)
  const realLifeSentences = [
    { english: "I am not a designer.", portuguese: "Eu não sou projetista." },
    { english: "They are not at school now.", portuguese: "Eles não estão na escola agora." },
    { english: "You are not late for class.", portuguese: "Você não está atrasado para a aula." },
    { english: "She is not at home.", portuguese: "Ela não está em casa." },
    { english: "We are not at church now, we're at the park.", portuguese: "Nós não estamos na igreja agora, estamos no parque." },
    { english: "It is not an interesting story.", portuguese: "Não é uma história interessante." },
    { english: "We are not very tired.", portuguese: "Nós não estamos muito cansados." },
    { english: "They are not engineers.", portuguese: "Eles não são engenheiros." },
    { english: "The exam is not very hard.", portuguese: "A prova não é muito difícil." },
    { english: "I think French fries are not healthy.", portuguese: "Eu acho que batatas fritas não são saudáveis." },
    { english: "They are not sad, they're happy.", portuguese: "Eles não estão tristes, estão felizes." },
    { english: "These are not her shoes.", portuguese: "Estes não são os sapatos dela." },
    { english: "He is not a doctor, he's a nurse.", portuguese: "Ele não é médico, é enfermeiro." },
    { english: "She is not a teacher, she's a lawyer.", portuguese: "Ela não é professora, é advogada." },
    { english: "I'm not hungry, I'm thirsty.", portuguese: "Eu não estou com fome, estou com sede." },
    { english: "They are not at home, they're at work.", portuguese: "Eles não estão em casa, estão no trabalho." },
  ];

  // Drill exercise data for each section
  const verbDrills = [
    { english: "I am a doctor", portuguese: "Eu sou médico" },
    { english: "I am not a doctor", portuguese: "Eu não sou médico" },
    { english: "I am a dentist", portuguese: "Eu sou dentista" },
    { english: "I am in Brazil", portuguese: "Eu estou no Brasil" },
    { english: "I am not in Brazil", portuguese: "Eu não estou no Brasil" },
    { english: "I am in Italy", portuguese: "Eu estou na Itália" },
    { english: "You are not sick", portuguese: "Você não está doente" },
    { english: "He is not sick", portuguese: "Ele não está doente" },
    { english: "She is not sick", portuguese: "Ela não está doente" },
    { english: "He is not a dentist", portuguese: "Ele não é dentista" },
    { english: "He is a teacher", portuguese: "Ele é professor" },
    { english: "He is a nurse", portuguese: "Ele é enfermeiro" },
    { english: "She is not here", portuguese: "Ela não está aqui" },
    { english: "She is there", portuguese: "Ela está lá" },
    { english: "She is at school", portuguese: "Ela está na escola" },
    { english: "It is not easy", portuguese: "Não é fácil" },
    { english: "It is difficult", portuguese: "É difícil" },
    { english: "It is boring", portuguese: "É chato" },
    { english: "We are not late", portuguese: "Nós não estamos atrasados" },
    { english: "They are not late", portuguese: "Eles não estão atrasados" },
    { english: "You are not late", portuguese: "Vocês não estão atrasados" },
    { english: "They are not my cousins", portuguese: "Eles não são meus primos" },
    { english: "They are my relatives", portuguese: "Eles são meus parentes" },
    { english: "They are my neighbors", portuguese: "Eles são meus vizinhos" },
    { english: "They are not at home", portuguese: "Eles não estão em casa" },
    { english: "They are at the cinema", portuguese: "Eles estão no cinema" },
    { english: "They are at the train station", portuguese: "Eles estão na estação de trem" },
    { english: "What do you do?", portuguese: "O que você faz?" },
    { english: "What does she do?", portuguese: "O que ela faz?" },
    { english: "What does he do?", portuguese: "O que ele faz?" },
    { english: "I'm sure", portuguese: "Eu tenho certeza" },
    { english: "She's sure", portuguese: "Ela tem certeza" },
    { english: "We're sure", portuguese: "Nós temos certeza" },
    { english: "I'm worried about the exam", portuguese: "Estou preocupado com a prova" },
    { english: "I'm worried about the project", portuguese: "Estou preocupado com o projeto" },
    { english: "I'm worried about the reports", portuguese: "Estou preocupado com os relatórios" },
  ];

  const vocabularyDrills = [
    { english: "My brother is a lawyer", portuguese: "Meu irmão é advogado" },
    { english: "My brother is a student", portuguese: "Meu irmão é estudante" },
    { english: "My brother is a sales clerk", portuguese: "Meu irmão é vendedor" },
    { english: "She is not a designer", portuguese: "Ela não é projetista" },
    { english: "She is not a manager", portuguese: "Ela não é gerente" },
    { english: "She is not a nurse", portuguese: "Ela não é enfermeira" },
    { english: "He is an engineer", portuguese: "Ele é engenheiro" },
    { english: "She is an engineer", portuguese: "Ela é engenheira" },
    { english: "I am an engineer", portuguese: "Eu sou engenheiro" },
    { english: "We are tired", portuguese: "Nós estamos cansados" },
    { english: "We are busy", portuguese: "Nós estamos ocupados" },
    { english: "We are upset", portuguese: "Nós estamos chateados" },
    { english: "He is not sad", portuguese: "Ele não está triste" },
    { english: "He is not worried", portuguese: "Ele não está preocupado" },
    { english: "He is not busy", portuguese: "Ele não está ocupado" },
    { english: "Your children are pretty", portuguese: "Seus filhos são bonitos" },
    { english: "Your children are smart", portuguese: "Seus filhos são espertos" },
    { english: "Your children are kind", portuguese: "Seus filhos são gentis" },
    { english: "We are very happy", portuguese: "Nós estamos muito felizes" },
    { english: "We are very tired", portuguese: "Nós estamos muito cansados" },
    { english: "We are very busy", portuguese: "Nós estamos muito ocupados" },
    { english: "I am hungry", portuguese: "Eu estou com fome" },
    { english: "She is hungry", portuguese: "Ela está com fome" },
    { english: "We are hungry", portuguese: "Nós estamos com fome" },
    { english: "I am not thirsty", portuguese: "Eu não estou com sede" },
    { english: "He is not thirsty", portuguese: "Ele não está com sede" },
    { english: "They are not thirsty", portuguese: "Eles não estão com sede" },
    { english: "I know those students", portuguese: "Eu conheço aqueles alunos" },
    { english: "I know those sales clerks", portuguese: "Eu conheço aqueles vendedores" },
    { english: "I know those lawyers", portuguese: "Eu conheço aqueles advogados" },
    { english: "I have a headache", portuguese: "Estou com dor de cabeça" },
    { english: "I have a stomachache", portuguese: "Estou com dor de estômago" },
    { english: "I have a toothache", portuguese: "Estou com dor de dente" },
    { english: "She is healthy", portuguese: "Ela é saudável" },
    { english: "She is sick", portuguese: "Ela está doente" },
    { english: "She is tired", portuguese: "Ela está cansada" },
  ];

  const grammarDrills = [
    { english: "I am not busy this week", portuguese: "Eu não estou ocupado esta semana" },
    { english: "I am not busy tomorrow", portuguese: "Eu não estou ocupado amanhã" },
    { english: "I am not busy next week", portuguese: "Eu não estou ocupado na próxima semana" },
    { english: "He is not my brother", portuguese: "Ele não é meu irmão" },
    { english: "He is not my father", portuguese: "Ele não é meu pai" },
    { english: "He is not my grandfather", portuguese: "Ele não é meu avô" },
    { english: "We are not tired", portuguese: "Nós não estamos cansados" },
    { english: "We are not sad", portuguese: "Nós não estamos tristes" },
    { english: "We are not worried", portuguese: "Nós não estamos preocupados" },
    { english: "They are not upset", portuguese: "Elas não estão chateadas" },
    { english: "They are not hungry", portuguese: "Elas não estão com fome" },
    { english: "They are not thirsty", portuguese: "Elas não estão com sede" },
    { english: "It is not very healthy", portuguese: "Não é muito saudável" },
    { english: "It is not very good", portuguese: "Não é muito bom" },
    { english: "It is not very interesting", portuguese: "Não é muito interessante" },
    { english: "My sister is not a designer", portuguese: "Minha irmã não é projetista" },
    { english: "My sister is not a manager", portuguese: "Minha irmã não é gerente" },
    { english: "My sister is not a sales clerk", portuguese: "Minha irmã não é vendedora" },
    { english: "The book is not boring", portuguese: "O livro não é chato" },
    { english: "The book is not funny", portuguese: "O livro não é engraçado" },
    { english: "The book is not bad", portuguese: "O livro não é ruim" },
    { english: "My boyfriend is not sick", portuguese: "Meu namorado não está doente" },
    { english: "My girlfriend is not sick", portuguese: "Minha namorada não está doente" },
    { english: "My husband is not sick", portuguese: "Meu marido não está doente" },
    { english: "My family is not in Germany", portuguese: "Minha família não está na Alemanha" },
    { english: "My family is not in France", portuguese: "Minha família não está na França" },
    { english: "My family is not in the United States", portuguese: "Minha família não está nos Estados Unidos" },
    { english: "We think he is healthy", portuguese: "Nós achamos que ele está saudável" },
    { english: "We think he is happy", portuguese: "Nós achamos que ele está feliz" },
    { english: "We think he is tired", portuguese: "Nós achamos que ele está cansado" },
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
        
        {/* Instagram Video Embed - Large vertical space */}
        <div className="mb-16 flex justify-center">
          <div className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-xl border-2 border-blue-300 bg-white p-4">
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                  ES
                </div>
                <div>
                  <p className="font-semibold text-gray-800">English Shots</p>
                  <p className="text-xs text-gray-500">@englishshots</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">📱 Instagram</span>
            </div>
            <div className="relative w-full" style={{ minHeight: '600px' }}>
              <iframe 
                src="https://www.instagram.com/p/DZXugHKyL5I/embed" 
                className="absolute inset-0 w-full h-full rounded-lg" 
                frameBorder="0"
                allowFullScreen
                loading="lazy"
                title="English Shots Instagram Video"
                style={{ minHeight: '600px' }}
              />
            </div>
            <p className="text-center text-sm text-gray-600 mt-3">
              🎬 Clique no vídeo para assistir a aula completa no Instagram
            </p>
          </div>
        </div>

        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            🏥 Lesson 39 - Health, Feelings & Professions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about health issues, feelings, professions, and use the verb "to be" in negative and affirmative forms. 👨‍⚕️🤒💊
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

        {/* Section 1 - VERBS (to be) with Drill */}
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
            <p className="text-md text-gray-600 mb-4 italic">Click on any English text to hear the pronunciation (Native American English voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {verbs.map((verb, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <AudioText text={verb.english}>
                      <span className="text-blue-600 font-bold cursor-pointer">{verb.english}</span>
                    </AudioText>
                    <span className="text-gray-600"> = {verb.portuguese}</span>
                  </div>
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {verbDrills.map((drill, index) => (
                  <div key={index} className="p-4 bg-white rounded-xl border border-purple-200 hover:bg-blue-50 transition-colors">
                    <div>
                      <AudioText text={drill.english}>
                        <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">{drill.english}</span></p>
                      </AudioText>
                      <p className="text-sm text-gray-500 mt-1">{drill.portuguese}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <p className="text-md text-gray-600 mb-4 italic">Click on any English word to hear it pronounced (Native voice)</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <AudioText text={word.english}>
                      <span className="text-blue-600 font-bold cursor-pointer">{word.english}</span>
                    </AudioText>
                    <span className="text-gray-600"> = {word.portuguese}</span>
                  </div>
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {vocabularyDrills.map((drill, index) => (
                  <div key={index} className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                    <div>
                      <AudioText text={drill.english}>
                        <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">{drill.english}</span></p>
                      </AudioText>
                      <p className="text-sm text-gray-500 mt-1">{drill.portuguese}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Speak Like a Native (Useful Phrases) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <p className="text-md text-gray-600 mb-4 italic">Click on any English phrase to hear it spoken</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <li key={index} className="flex items-center justify-between">
                  <div>
                    <AudioText text={phrase.english}>
                      <span className="text-blue-600 font-bold cursor-pointer">{phrase.english}</span>
                    </AudioText>
                    <span className="text-gray-600"> = {phrase.portuguese}</span>
                  </div>
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                  <div>
                    <AudioText text="What do you do?">
                      <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">What do you do?</span> / What does he do? / What does she do?</p>
                    </AudioText>
                    <p className="text-sm text-gray-500 mt-1">O que você faz? / O que ele faz? / O que ela faz?</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                  <div>
                    <AudioText text="I'm sure">
                      <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">I'm sure</span> / She's sure / We're sure</p>
                    </AudioText>
                    <p className="text-sm text-gray-500 mt-1">Eu tenho certeza / Ela tem certeza / Nós temos certeza</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                  <div>
                    <AudioText text="I'm worried about the exam">
                      <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">I'm worried about the exam</span> / the project / the reports</p>
                    </AudioText>
                    <p className="text-sm text-gray-500 mt-1">Estou preocupado com a prova / o projeto / os relatórios</p>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                  <div>
                    <AudioText text="I'm worried about my friend">
                      <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">I'm worried about my friend</span> / my classmate / you</p>
                    </AudioText>
                    <p className="text-sm text-gray-500 mt-1">Estou preocupado com meu amigo / meu colega / você</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - GRAMMAR (Negative Form) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Negative Form)</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on any English sentence to hear it spoken</p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.slice(0, 7).map((example, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <AudioText text={example.english}>
                      <span className="text-blue-600 font-bold cursor-pointer">{example.english}</span>
                    </AudioText>
                    <span className="text-gray-600"> = {example.portuguese}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {grammarDrills.map((drill, index) => (
                  <div key={index} className="p-4 bg-white rounded-xl border border-blue-200 hover:bg-blue-50 transition-colors">
                    <div>
                      <AudioText text={drill.english}>
                        <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 cursor-pointer">{drill.english}</span></p>
                      </AudioText>
                      <p className="text-sm text-gray-500 mt-1">{drill.portuguese}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Make It Yours (Real Life) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Click on any English text to hear it
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div>
                        <AudioText text={sentence.english}>
                          <p className="text-lg font-medium">
                            {index + 1}. <span className="text-blue-600 cursor-pointer">{sentence.english}</span>
                          </p>
                        </AudioText>
                        <p className="text-sm text-gray-600">{sentence.portuguese}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={professionsImage}
                        alt="Professions"
                        className="rounded-xl object-cover w-full h-full"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Different professions
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
                      Feeling sick
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - WRAP UP (Ordinal Numbers) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">
              Ordinal Numbers - 1st to 15th
            </p>
          </div>
          
          <div className="p-6">
            <WrapUp />
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson38")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson40")}
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