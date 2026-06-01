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

// Wrap Up Component (formerly Check It Out)
function WrapUp() {
  const playAudio = (text: string) => {
    const audioMap: Record<string, string> = {
      "get well soon": "https://github.com/Sullivan-code/english-audios/raw/main/get-well-soon-female.mp3",
      "bless you": "https://github.com/Sullivan-code/english-audios/raw/main/bless-you-female.mp3",
      "this is": "https://github.com/Sullivan-code/english-audios/raw/main/this-is-female.mp3",
      "these are": "https://github.com/Sullivan-code/english-audios/raw/main/these-are-female.mp3",
      "that is": "https://github.com/Sullivan-code/english-audios/raw/main/that-is-female.mp3",
      "those are": "https://github.com/Sullivan-code/english-audios/raw/main/those-are-female.mp3",
      "what's the matter?": "https://github.com/Sullivan-code/english-audios/raw/main/whats-the-matter-female.mp3",
      "i have a toothache.": "https://github.com/Sullivan-code/english-audios/raw/main/i-have-a-toothache-female.mp3",
      "i want to make an appointment to see a dentist.": "https://github.com/Sullivan-code/english-audios/raw/main/i-want-to-make-an-appointment-female.mp3",
    };
    
    const audioUrl = audioMap[text.toLowerCase()];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  return (
    <div className="flex flex-col md:flex-row rounded-lg overflow-hidden shadow-lg border-2 border-teal-200">
      {/* Left column - Expressions and Grammar */}
      <div className="bg-teal-900 text-white flex-1 p-6 space-y-4">
        <div className="mb-4">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">USEFUL EXPRESSIONS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-800 rounded-lg">
              <button 
                onClick={() => playAudio("Get well soon")}
                className="font-bold text-xl text-yellow-200 hover:text-yellow-100 transition-colors"
              >
                Get well soon.
              </button>
              <p className="text-teal-200 text-sm mt-1">Melhoras.</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <button 
                onClick={() => playAudio("Bless you")}
                className="font-bold text-xl text-yellow-200 hover:text-yellow-100 transition-colors"
              >
                Bless you!
              </button>
              <p className="text-teal-200 text-sm mt-1">Saúde!</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">THIS / THAT vs THESE / THOSE</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-teal-800 rounded-lg">
              <button onClick={() => playAudio("This is")} className="font-bold text-teal-200 hover:text-white transition-colors">
                this is
              </button>
              <p className="text-teal-300 text-sm">isto é / este é</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <button onClick={() => playAudio("These are")} className="font-bold text-teal-200 hover:text-white transition-colors">
                these are
              </button>
              <p className="text-teal-300 text-sm">estes/estas são</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <button onClick={() => playAudio("That is")} className="font-bold text-teal-200 hover:text-white transition-colors">
                that is
              </button>
              <p className="text-teal-300 text-sm">aquilo é / aquele é</p>
            </div>
            <div className="p-3 bg-teal-800 rounded-lg">
              <button onClick={() => playAudio("Those are")} className="font-bold text-teal-200 hover:text-white transition-colors">
                those are
              </button>
              <p className="text-teal-300 text-sm">aqueles/aquelas são</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right column - Contractions and Asking about symptoms */}
      <div className="bg-teal-800 text-white flex-1 p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-yellow-300 mb-3">CONTRACTIONS</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">I'm</p>
              <p className="text-teal-300 text-xs">I am</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">You're</p>
              <p className="text-teal-300 text-xs">You are</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">He's</p>
              <p className="text-teal-300 text-xs">He is</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">She's</p>
              <p className="text-teal-300 text-xs">She is</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">It's</p>
              <p className="text-teal-300 text-xs">It is</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center">
              <p className="font-bold">We're</p>
              <p className="text-teal-300 text-xs">We are</p>
            </div>
            <div className="p-2 bg-teal-700 rounded-lg text-center col-span-2">
              <p className="font-bold">They're</p>
              <p className="text-teal-300 text-xs">They are</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-teal-700">
          <h3 className="font-bold text-lg text-yellow-300 mb-3">ASKING ABOUT SYMPTOMS</h3>
          <div className="space-y-3">
            <div className="p-3 bg-teal-700 rounded-lg">
              <button onClick={() => playAudio("What's the matter?")} className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors">
                What's the matter?
              </button>
              <p className="text-teal-200 text-sm mt-1">O que houve? / Qual é o problema?</p>
            </div>
            <div className="p-3 bg-teal-700 rounded-lg">
              <button onClick={() => playAudio("I have a toothache.")} className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors">
                I have a toothache.
              </button>
              <p className="text-teal-200 text-sm mt-1">Estou com dor de dente.</p>
            </div>
            <div className="p-3 bg-teal-700 rounded-lg">
              <button onClick={() => playAudio("I want to make an appointment to see a dentist.")} className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors text-sm">
                I want to make an appointment to see a dentist.
              </button>
              <p className="text-teal-200 text-sm mt-1">Quero marcar uma consulta para ver um dentista.</p>
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

  const playAudio = (text: string) => {
    // Female American English audio mapping
    const audioMap: Record<string, string> = {
      // Contracted forms (to be)
      "i'm": "https://github.com/Sullivan-code/english-audios/raw/main/im-female.mp3",
      "you're": "https://github.com/Sullivan-code/english-audios/raw/main/youre-female.mp3",
      "he's": "https://github.com/Sullivan-code/english-audios/raw/main/hes-female.mp3",
      "she's": "https://github.com/Sullivan-code/english-audios/raw/main/shes-female.mp3",
      "it's": "https://github.com/Sullivan-code/english-audios/raw/main/its-female.mp3",
      "we're": "https://github.com/Sullivan-code/english-audios/raw/main/were-female.mp3",
      "they're": "https://github.com/Sullivan-code/english-audios/raw/main/theyre-female.mp3",
      
      // Full forms and examples
      "i am a teacher": "https://github.com/Sullivan-code/english-audios/raw/main/i-am-a-teacher-female.mp3",
      "i am a doctor": "https://github.com/Sullivan-code/english-audios/raw/main/i-am-a-doctor-female.mp3",
      "you are": "https://github.com/Sullivan-code/english-audios/raw/main/you-are-female.mp3",
      "we are": "https://github.com/Sullivan-code/english-audios/raw/main/we-are-female.mp3",
      "they are": "https://github.com/Sullivan-code/english-audios/raw/main/they-are-female.mp3",
      "he is": "https://github.com/Sullivan-code/english-audios/raw/main/he-is-female.mp3",
      "she is": "https://github.com/Sullivan-code/english-audios/raw/main/she-is-female.mp3",
      "it is here": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-here-female.mp3",
      "it is there": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-there-female.mp3",
      "it is at home": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-at-home-female.mp3",
      "i am at school": "https://github.com/Sullivan-code/english-audios/raw/main/i-am-at-school-female.mp3",
      "i am at work": "https://github.com/Sullivan-code/english-audios/raw/main/i-am-at-work-female.mp3",
      "i am at church": "https://github.com/Sullivan-code/english-audios/raw/main/i-am-at-church-female.mp3",
      "they are my friends": "https://github.com/Sullivan-code/english-audios/raw/main/they-are-my-friends-female.mp3",
      "they are my classmates": "https://github.com/Sullivan-code/english-audios/raw/main/they-are-my-classmates-female.mp3",
      "they are my neighbors": "https://github.com/Sullivan-code/english-audios/raw/main/they-are-my-neighbors-female.mp3",
      "it is good": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-good-female.mp3",
      "it is bad": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-bad-female.mp3",
      "it is funny": "https://github.com/Sullivan-code/english-audios/raw/main/it-is-funny-female.mp3",
      "i want to be": "https://github.com/Sullivan-code/english-audios/raw/main/i-want-to-be-female.mp3",
      "he wants to be": "https://github.com/Sullivan-code/english-audios/raw/main/he-wants-to-be-female.mp3",
      "what do you want to be": "https://github.com/Sullivan-code/english-audios/raw/main/what-do-you-want-to-be-female.mp3",
      "what do they want to be": "https://github.com/Sullivan-code/english-audios/raw/main/what-do-they-want-to-be-female.mp3",
      "what does he want to be": "https://github.com/Sullivan-code/english-audios/raw/main/what-does-he-want-to-be-female.mp3",
      
      // Vocabulary
      "nurse": "https://github.com/Sullivan-code/english-audios/raw/main/nurse-female.mp3",
      "doctor": "https://github.com/Sullivan-code/english-audios/raw/main/doctor-female.mp3",
      "dentist": "https://github.com/Sullivan-code/english-audios/raw/main/dentist-female.mp3",
      "sick": "https://github.com/Sullivan-code/english-audios/raw/main/sick-female.mp3",
      "headache": "https://github.com/Sullivan-code/english-audios/raw/main/headache-female.mp3",
      "stomachache": "https://github.com/Sullivan-code/english-audios/raw/main/stomachache-female.mp3",
      "sore throat": "https://github.com/Sullivan-code/english-audios/raw/main/sore-throat-female.mp3",
      "toothache": "https://github.com/Sullivan-code/english-audios/raw/main/toothache-female.mp3",
      "cold": "https://github.com/Sullivan-code/english-audios/raw/main/cold-female.mp3",
      "fever": "https://github.com/Sullivan-code/english-audios/raw/main/fever-female.mp3",
      "appointment": "https://github.com/Sullivan-code/english-audios/raw/main/appointment-female.mp3",
      "pill": "https://github.com/Sullivan-code/english-audios/raw/main/pill-female.mp3",
      "painkiller": "https://github.com/Sullivan-code/english-audios/raw/main/painkiller-female.mp3",
      "health": "https://github.com/Sullivan-code/english-audios/raw/main/health-female.mp3",
      "kind": "https://github.com/Sullivan-code/english-audios/raw/main/kind-female.mp3",
      "these": "https://github.com/Sullivan-code/english-audios/raw/main/these-female.mp3",
      "those": "https://github.com/Sullivan-code/english-audios/raw/main/those-female.mp3",
      
      // Useful Phrases
      "take this medicine for your toothache.": "https://github.com/Sullivan-code/english-audios/raw/main/take-this-medicine-female.mp3",
      "i feel better now.": "https://github.com/Sullivan-code/english-audios/raw/main/i-feel-better-now-female.mp3",
      "i still have to go to the dentist.": "https://github.com/Sullivan-code/english-audios/raw/main/i-still-have-to-go-to-dentist-female.mp3",
      "i'm in pain.": "https://github.com/Sullivan-code/english-audios/raw/main/im-in-pain-female.mp3",
      
      // Grammar Examples
      "i'm a teacher.": "https://github.com/Sullivan-code/english-audios/raw/main/im-a-teacher-female.mp3",
      "you're a nurse.": "https://github.com/Sullivan-code/english-audios/raw/main/youre-a-nurse-female.mp3",
      "she's late for her appointment.": "https://github.com/Sullivan-code/english-audios/raw/main/shes-late-female.mp3",
      "he's still in pain.": "https://github.com/Sullivan-code/english-audios/raw/main/hes-still-in-pain-female.mp3",
      "it's early, let's watch a movie.": "https://github.com/Sullivan-code/english-audios/raw/main/its-early-female.mp3",
      "we're friends.": "https://github.com/Sullivan-code/english-audios/raw/main/were-friends-female.mp3",
      "you're great doctors.": "https://github.com/Sullivan-code/english-audios/raw/main/youre-great-doctors-female.mp3",
      "they're at the hospital now.": "https://github.com/Sullivan-code/english-audios/raw/main/theyre-at-hospital-female.mp3",
      
      // Real Life Sentences
      "i have a headache.": "https://github.com/Sullivan-code/english-audios/raw/main/i-have-headache-female.mp3",
      "she has an appointment at the dentist today.": "https://github.com/Sullivan-code/english-audios/raw/main/she-has-appointment-female.mp3",
      "does he have a fever?": "https://github.com/Sullivan-code/english-audios/raw/main/does-he-have-fever-female.mp3",
      "take a painkiller for your toothache.": "https://github.com/Sullivan-code/english-audios/raw/main/take-painkiller-female.mp3",
      "i think she has a stomachache.": "https://github.com/Sullivan-code/english-audios/raw/main/i-think-she-has-stomachache-female.mp3",
      "i still take that medicine every day.": "https://github.com/Sullivan-code/english-audios/raw/main/i-still-take-medicine-female.mp3",
      "i'm in pain. i need to go to the hospital.": "https://github.com/Sullivan-code/english-audios/raw/main/im-in-pain-need-hospital-female.mp3",
      "he is at the train station.": "https://github.com/Sullivan-code/english-audios/raw/main/he-is-at-train-station-female.mp3",
      "drink a lot of water. it's good for your health.": "https://github.com/Sullivan-code/english-audios/raw/main/drink-water-good-health-female.mp3",
      "the children are at home because they're sick.": "https://github.com/Sullivan-code/english-audios/raw/main/children-are-sick-female.mp3",
      "please take those reports to the doctor.": "https://github.com/Sullivan-code/english-audios/raw/main/take-reports-to-doctor-female.mp3",
      "do you have to take these pills?": "https://github.com/Sullivan-code/english-audios/raw/main/do-you-have-to-take-pills-female.mp3",
    };

    const audioUrl = audioMap[text.toLowerCase()];
    
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    } else {
      // Fallback: try to construct URL
      const formattedText = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .trim();
      
      const fallbackUrl = `https://github.com/Sullivan-code/english-audios/raw/main/${formattedText}-female.mp3`;
      const audio = new Audio(fallbackUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
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
    { english: "I feel better now.", portuguese: "Eu me sinto melhor agora." },
    { english: "I still have to go to the dentist.", portuguese: "Eu ainda tenho que ir ao dentista." },
    { english: "I'm in pain.", portuguese: "Eu estou com dor." }
  ];

  const grammarExamples = [
    { english: "I'm a teacher.", portuguese: "Eu sou professor." },
    { english: "You're a nurse.", portuguese: "Você é enfermeira." },
    { english: "She's late for her appointment.", portuguese: "Ela está atrasada para o compromisso." },
    { english: "He's still in pain.", portuguese: "Ele ainda está com dor." },
    { english: "It's early, let's watch a movie.", portuguese: "Está cedo, vamos assistir um filme." },
    { english: "We're friends.", portuguese: "Nós somos amigos." },
    { english: "You're great doctors.", portuguese: "Vocês são ótimos médicos." },
    { english: "They're at the hospital now.", portuguese: "Eles estão no hospital agora." }
  ];

  const realLifeSentences = [
    { english: "I have a headache.", portuguese: "Eu estou com dor de cabeça." },
    { english: "She has an appointment at the dentist today.", portuguese: "Ela tem uma consulta no dentista hoje." },
    { english: "Does he have a fever?", portuguese: "Ele está com febre?" },
    { english: "Take a painkiller for your toothache.", portuguese: "Tome um analgésico para sua dor de dente." },
    { english: "I think she has a stomachache.", portuguese: "Acho que ela está com dor de estômago." },
    { english: "I still take that medicine every day.", portuguese: "Eu ainda tomo aquele remédio todos os dias." },
    { english: "I'm in pain. I need to go to the hospital.", portuguese: "Estou com dor. Preciso ir ao hospital." },
    { english: "He is at the train station.", portuguese: "Ele está na estação de trem." },
    { english: "Drink a lot of water. It's good for your health.", portuguese: "Beba muita água. É bom para sua saúde." },
    { english: "The children are at home because they're sick.", portuguese: "As crianças estão em casa porque estão doentes." },
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the contractions to hear the pronunciation</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(verb.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {verb.english}
                  </button> = {verb.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I am a teacher')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I'm a teacher</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu sou professor.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('You are a nurse')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">You're a nurse</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Você é enfermeiro(a).</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('He is a doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">He's a doctor</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ele é médico.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('She is a dentist')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">She's a dentist</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Ela é dentista.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('It is here')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">It's here</span> / there / at home</p>
                  <p className="text-sm text-gray-500 mt-1">Está aqui / lá / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('We are friends')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">We're friends</span> / classmates / neighbors</p>
                  <p className="text-sm text-gray-500 mt-1">Nós somos amigos / colegas de classe / vizinhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('They are at the hospital')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">They're at the hospital</span> / at work / at school</p>
                  <p className="text-sm text-gray-500 mt-1">Eles estão no hospital / no trabalho / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('It is good for your health')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">It's good</span> / bad / important for your health</p>
                  <p className="text-sm text-gray-500 mt-1">É bom / ruim / importante para sua saúde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('I want to be a doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I want to be</span> / He wants to be / She wants to be</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero ser / Ele quer ser / Ela quer ser</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('What do you want to be')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">What do you want to be</span>? / What does he want to be?</p>
                  <p className="text-sm text-gray-500 mt-1">O que você quer ser? / O que ele quer ser?</p>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on each word to hear its correct pronunciation</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                  >
                    {word.english}
                  </button> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I need to talk to the doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I need to talk to the doctor</span> / nurse / dentist</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso falar com o médico / enfermeiro / dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I have to go to the hospital tomorrow')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have to go to the hospital</span> / to the doctor / to the dentist</p>
                  <p className="text-sm text-gray-500 mt-1">Eu tenho que ir ao hospital / ao médico / ao dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Do you know that doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you know that doctor</span>? / dentist / nurse</p>
                  <p className="text-sm text-gray-500 mt-1">Você conhece aquele médico / dentista / enfermeira</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I have an appointment at the dentist')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have an appointment at the dentist</span> / at the doctor / at the hospital</p>
                  <p className="text-sm text-gray-500 mt-1">Eu tenho uma consulta no dentista / no médico / no hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Do you have an appointment today')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you have an appointment today</span>? / this afternoon / tomorrow</p>
                  <p className="text-sm text-gray-500 mt-1">Você tem um compromisso hoje? / esta tarde / amanhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I do not like to take medicine')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I don't like to take medicine</span> / painkillers / pills</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não gosto de tomar remédio / analgésicos / comprimidos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Do you need to take a painkiller')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you need to take a painkiller</span>? / Does she need / Does he need</p>
                  <p className="text-sm text-gray-500 mt-1">Você precisa tomar um analgésico? / Ela / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I have a headache')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I have a headache</span> / stomachache / toothache</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estou com dor de cabeça / dor de estômago / dor de dente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('My sister has a fever')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">My sister has a fever</span> / sore throat / cold</p>
                  <p className="text-sm text-gray-500 mt-1">Minha irmã está com febre / dor de garganta / resfriada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('He has a toothache')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">He has a toothache</span> / headache / stomachache</p>
                  <p className="text-sm text-gray-500 mt-1">Ele está com dor de dente / dor de cabeça / dor de estômago</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('Do you have a sore throat')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">Do you have a sore throat</span>? / fever / cold</p>
                  <p className="text-sm text-gray-500 mt-1">Você está com dor de garganta? / febre / resfriado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('When do you take these pills')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">When do you take these pills</span>? / painkillers</p>
                  <p className="text-sm text-gray-500 mt-1">Quando você toma estes comprimidos? / analgésicos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                  onClick={() => playAudio('I need to talk to those doctors')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-green-600">I need to talk to those doctors</span> / teachers / nurses</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso conversar com aqueles médicos / professores / enfermeiros</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Speak Like a Native (formerly Useful Phrases) with Drill */}
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
                <li key={index}>
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800 transition-colors"
                  >
                    {phrase.english}
                  </button> = {phrase.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('I prefer to drink tea for my stomachache')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I prefer to drink tea for my stomachache</span> / headache / sore throat</p>
                  <p className="text-sm text-gray-500 mt-1">Eu prefiro beber chá para minha dor de estômago / dor de cabeça / dor de garganta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('I feel better now')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I feel better now</span>. / He feels / We feel</p>
                  <p className="text-sm text-gray-500 mt-1">Eu me sinto melhor agora / Ele se sente / Nós nos sentimos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('I still study in the morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I still study in the morning</span> / in the afternoon / at night</p>
                  <p className="text-sm text-gray-500 mt-1">Eu ainda estudo de manhã / à tarde / à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('He still needs to go to the doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">He still needs to go to the doctor</span> / to the dentist / to the pharmacy</p>
                  <p className="text-sm text-gray-500 mt-1">Ele ainda precisa ir ao médico / ao dentista / à farmácia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('I am in pain')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I am in pain</span>. / She is / They are</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estou com dor / Ela está / Eles estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => playAudio('I am still in pain')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-yellow-600">I am still in pain</span>. / She is / He is</p>
                  <p className="text-sm text-gray-500 mt-1">Eu ainda estou com dor / Ela / Ele</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - GRAMMAR with Drill */}
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
                <p key={index}>
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                  >
                    {example.english}
                  </button> = {example.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('I am a doctor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">I'm a doctor</span> / dentist / nurse</p>
                  <p className="text-sm text-gray-500 mt-1">Eu sou médico / dentista / enfermeiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('She is a teacher')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">She is a teacher</span> / nurse / dentist</p>
                  <p className="text-sm text-gray-500 mt-1">Ela é professora / enfermeira / dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('He is a dentist')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">He is a dentist</span> / teacher / doctor</p>
                  <p className="text-sm text-gray-500 mt-1">Ele é dentista / professor / médico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('It is early')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">It's early</span> / late / new</p>
                  <p className="text-sm text-gray-500 mt-1">Está cedo / tarde / novo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('That class is important')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">That class is important</span> / interesting / great</p>
                  <p className="text-sm text-gray-500 mt-1">Aquela aula é importante / interessante / ótima</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('She is kind')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">She is kind</span> / funny / beautiful</p>
                  <p className="text-sm text-gray-500 mt-1">Ela é gentil / engraçada / bonita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('He is Brazilian')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">He is Brazilian</span> / American / British</p>
                  <p className="text-sm text-gray-500 mt-1">Ele é brasileiro / americano / britânico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('I am sick')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">I am sick</span> / She is / They are</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estou doente / Ela está / Eles estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('They are my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">They are my parents</span> / grandparents / friends</p>
                  <p className="text-sm text-gray-500 mt-1">Eles são meus pais / avós / amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('These are my friends')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">These are my friends</span>. / Those are my teachers</p>
                  <p className="text-sm text-gray-500 mt-1">Estes são meus amigos / Aqueles são meus professores</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('It is good for your health')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">It is good for your health</span> / important / great</p>
                  <p className="text-sm text-gray-500 mt-1">É bom para sua saúde / importante / ótimo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-purple-50 transition-colors"
                  onClick={() => playAudio('We are at home')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-purple-600">We are at home</span> / at the mall / at the beach</p>
                  <p className="text-sm text-gray-500 mt-1">Nós estamos em casa / no shopping / na praia</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Make It Yours (formerly Real Life) */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
              <PencilIcon onClick={() => openNoteModal('Make It Yours')} />
            </div>
            <div className="text-sm text-blue-100">
              Replace the blue words to practice
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="text-lg font-medium">
                            {index + 1}. {sentence.english}
                          </p>
                          <p className="text-sm text-gray-600">{sentence.portuguese}</p>
                        </div>
                      </div>
                    </div>
                  ))}
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