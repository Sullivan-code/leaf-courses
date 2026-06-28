"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

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

export default function Lesson45EatingOut() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
  });

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
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 45 – EATING OUT
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            🍽️ Aprenda a falar sobre restaurantes, horários de funcionamento, utensílios de mesa e como usar <strong>something</strong> e <strong>anything</strong> em inglês!
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
              alt="Eating out - Restaurant"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos (to open / to close) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS (to open / to close)</h2>
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
              <li className="flex items-center justify-between">
                <div>
                  <span className="text-blue-600 font-bold">to open</span> = abrir
                </div>
                <AudioButton text="to open" />
              </li>
              <li className="flex items-center justify-between">
                <div>
                  <span className="text-blue-600 font-bold">to close</span> = fechar
                </div>
                <AudioButton text="to close" />
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I open</span> / You open / He opens / We open / They open</p>
                    <p className="text-sm text-gray-600 mt-1">Eu abro / Você abre / Ele abre / Nós abrimos / Eles abrem</p>
                  </div>
                  <AudioButton text="I open" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">It opens at seven o'clock</span></p>
                    <p className="text-sm text-gray-600 mt-1">Abre às sete horas</p>
                  </div>
                  <AudioButton text="It opens at seven o'clock" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">It doesn't open</span></p>
                    <p className="text-sm text-gray-600 mt-1">Não abre</p>
                  </div>
                  <AudioButton text="It doesn't open" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">What time does it open?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Que horas abre?</p>
                  </div>
                  <AudioButton text="What time does it open" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">It opens at 6 a.m.</span> / It opens at 8 a.m. / It opens at night</p>
                    <p className="text-sm text-gray-600 mt-1">Abre às 6 da manhã / Abre às 8 da manhã / Abre à noite</p>
                  </div>
                  <AudioButton text="It opens at 6 a.m." />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">It doesn't open on Sundays</span></p>
                    <p className="text-sm text-gray-600 mt-1">Não abre aos domingos</p>
                  </div>
                  <AudioButton text="It doesn't open on Sundays" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">It closes at 10 p.m.</span> / It closes early</p>
                    <p className="text-sm text-gray-600 mt-1">Fecha às 22h / Fecha cedo</p>
                  </div>
                  <AudioButton text="It closes at 10 p.m." />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">What time does the store open?</span> / What time does the bank close?</p>
                    <p className="text-sm text-gray-600 mt-1">Que horas a loja abre? / Que horas o banco fecha?</p>
                  </div>
                  <AudioButton text="What time does the store open" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">I close</span> / You close / He closes / We close / They close</p>
                    <p className="text-sm text-gray-600 mt-1">Eu fecho / Você fecha / Ele fecha / Nós fechamos / Eles fecham</p>
                  </div>
                  <AudioButton text="I close" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 flex justify-between items-center cursor-pointer hover:bg-blue-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Close your books.</span> / Open your books.</p>
                    <p className="text-sm text-gray-600 mt-1">Fechem seus livros. / Abram seus livros.</p>
                  </div>
                  <AudioButton text="Close your books" />
                </div>
                {/* NEW FUTURE & PAST */}
                <div className="p-4 bg-white rounded-xl border border-blue-300 bg-blue-50 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-blue-600 font-bold">The restaurant will open at 8 a.m. tomorrow.</span></p>
                    <p className="text-sm text-gray-600 mt-1">O restaurante abrirá às 8h amanhã.</p>
                  </div>
                  <AudioButton text="The restaurant will open at 8 a.m. tomorrow" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-300 bg-blue-50 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-blue-600 font-bold">They will close the store early today.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eles fecharão a loja mais cedo hoje.</p>
                  </div>
                  <AudioButton text="They will close the store early today" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-300 bg-blue-50 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST: <span className="text-blue-600 font-bold">The bank opened at 9 a.m. yesterday.</span></p>
                    <p className="text-sm text-gray-600 mt-1">O banco abriu às 9h ontem.</p>
                  </div>
                  <AudioButton text="The bank opened at 9 a.m. yesterday" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-300 bg-blue-50 flex justify-between items-center cursor-pointer hover:bg-blue-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-blue-600 font-bold">Did the supermarket close early yesterday?</span></p>
                    <p className="text-sm text-gray-600 mt-1">O supermercado fechou mais cedo ontem?</p>
                  </div>
                  <AudioButton text="Did the supermarket close early yesterday" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário (Utensílios e Comidas) */}
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {['bottle', 'can', 'spoon', 'fork', 'knife', 'napkin', 'straw', 'milkshake', 'snack', 'ice cream parlor', 'delicious', 'different'].map((word) => (
                <div key={word} className="bg-green-50 rounded-xl p-4 text-center border border-green-200 flex flex-col items-center justify-between h-full">
                  <div className="text-4xl mb-2">
                    {word === 'bottle' && '🍾'}
                    {word === 'can' && '🥫'}
                    {word === 'spoon' && '🥄'}
                    {word === 'fork' && '🍴'}
                    {word === 'knife' && '🔪'}
                    {word === 'napkin' && '🧻'}
                    {word === 'straw' && '🥤'}
                    {word === 'milkshake' && '🥛'}
                    {word === 'snack' && '🍿'}
                    {word === 'ice cream parlor' && '🍦'}
                    {word === 'delicious' && '😋'}
                    {word === 'different' && '🔄'}
                  </div>
                  <div>
                    <p className="text-green-600 font-bold">{word}</p>
                    <p className="text-sm text-gray-500">
                      {word === 'bottle' && 'garrafa'}
                      {word === 'can' && 'lata'}
                      {word === 'spoon' && 'colher'}
                      {word === 'fork' && 'garfo'}
                      {word === 'knife' && 'faca'}
                      {word === 'napkin' && 'guardanapo'}
                      {word === 'straw' && 'canudo'}
                      {word === 'milkshake' && 'milk-shake'}
                      {word === 'snack' && 'lanche'}
                      {word === 'ice cream parlor' && 'sorveteria'}
                      {word === 'delicious' && 'delicioso'}
                      {word === 'different' && 'diferente'}
                    </p>
                  </div>
                  <AudioButton text={word} />
                </div>
              ))}
            </div>

            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <h3 className="text-lg font-bold text-green-800 mb-3">📝 Examples:</h3>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p>🍾 I want <span className="text-green-600 font-bold">a bottle of water</span></p>
                  </div>
                  <AudioButton text="I want a bottle of water" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🥤 I prefer <span className="text-green-600 font-bold">a can of soda</span></p>
                  </div>
                  <AudioButton text="I prefer a can of soda" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🍴 I need <span className="text-green-600 font-bold">a fork and a knife</span></p>
                  </div>
                  <AudioButton text="I need a fork and a knife" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🧻 Do you have <span className="text-green-600 font-bold">a napkin</span>?</p>
                  </div>
                  <AudioButton text="Do you have a napkin" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🥤 I want <span className="text-green-600 font-bold">a straw</span></p>
                  </div>
                  <AudioButton text="I want a straw" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🥤 <span className="text-green-600 font-bold">This milkshake</span> is delicious</p>
                  </div>
                  <AudioButton text="This milkshake is delicious" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>🍽️ I want <span className="text-green-600 font-bold">something different</span></p>
                  </div>
                  <AudioButton text="I want something different" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p>❓ Do you want <span className="text-green-600 font-bold">anything</span>?</p>
                  </div>
                  <AudioButton text="Do you want anything" />
                </div>
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you want <span className="text-green-600 font-bold">a glass of water</span>? / soda / juice</p>
                    <p className="text-sm text-gray-600 mt-1">Você quer um copo de água? / refrigerante / suco</p>
                  </div>
                  <AudioButton text="Do you want a glass of water" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I want <span className="text-green-600 font-bold">a bottle of soda</span>, please. / water / juice</p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero uma garrafa de refrigerante, por favor. / de água / de suco</p>
                  </div>
                  <AudioButton text="I want a bottle of soda please" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">We prefer to buy <span className="text-green-600 font-bold">a can of soda</span>. / a glass / a bottle</p>
                    <p className="text-sm text-gray-600 mt-1">Nós preferimos comprar uma lata de refrigerante. / um copo / uma garrafa</p>
                  </div>
                  <AudioButton text="We prefer to buy a can of soda" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">He needs <span className="text-green-600 font-bold">a knife</span>. / a fork / a spoon</p>
                    <p className="text-sm text-gray-600 mt-1">Ele precisa de uma faca. / de um garfo / de uma colher</p>
                  </div>
                  <AudioButton text="He needs a knife" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Excuse me, do you have <span className="text-green-600 font-bold">a spoon</span>? / a napkin / a straw</p>
                    <p className="text-sm text-gray-600 mt-1">Com licença, você tem uma colher? / um guardanapo / um canudo</p>
                  </div>
                  <AudioButton text="Excuse me do you have a spoon" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you need <span className="text-green-600 font-bold">a napkin</span>? / a straw / a fork</p>
                    <p className="text-sm text-gray-600 mt-1">Você precisa de algum guardanapo? / canudo / garfo</p>
                  </div>
                  <AudioButton text="Do you need a napkin" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I love to have <span className="text-green-600 font-bold">ice cream</span>. / soup / milkshake</p>
                    <p className="text-sm text-gray-600 mt-1">Eu adoro tomar sorvete / sopa / milk-shake</p>
                  </div>
                  <AudioButton text="I love to have ice cream" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I want to have <span className="text-green-600 font-bold">a snack</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero fazer um lanche.</p>
                  </div>
                  <AudioButton text="I want to have a snack" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">This dish is <span className="text-green-600 font-bold">delicious</span>. / dessert / snack</p>
                    <p className="text-sm text-gray-600 mt-1">Este prato está delicioso. / sobremesa / lanche</p>
                  </div>
                  <AudioButton text="This dish is delicious" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200 flex justify-between items-center cursor-pointer hover:bg-green-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">That is our favorite <span className="text-green-600 font-bold">snack bar</span>. / ice cream parlor / cafeteria</p>
                    <p className="text-sm text-gray-600 mt-1">Aquela é nossa lanchonete favorita. / sorveteria / cafeteria</p>
                  </div>
                  <AudioButton text="That is our favorite snack bar" />
                </div>
                {/* NEW FUTURE & PAST */}
                <div className="p-4 bg-white rounded-xl border border-green-300 bg-green-50 flex justify-between items-center cursor-pointer hover:bg-green-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-green-600 font-bold">I will buy a bottle of water tomorrow.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu comprarei uma garrafa de água amanhã.</p>
                  </div>
                  <AudioButton text="I will buy a bottle of water tomorrow" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-300 bg-green-50 flex justify-between items-center cursor-pointer hover:bg-green-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST: <span className="text-green-600 font-bold">She ordered a milkshake yesterday.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Ela pediu um milk-shake ontem.</p>
                  </div>
                  <AudioButton text="She ordered a milkshake yesterday" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-300 bg-green-50 flex justify-between items-center cursor-pointer hover:bg-green-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-green-600 font-bold">Did you try the delicious cake?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você experimentou o bolo delicioso?</p>
                  </div>
                  <AudioButton text="Did you try the delicious cake" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis */}
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases for eating out</p>
            <div className="bg-yellow-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-yellow-600 font-bold">I want to go out tonight.</span>
                  <p className="text-sm text-gray-500">Eu quero sair hoje à noite</p>
                </div>
                <AudioButton text="I want to go out tonight" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-yellow-600 font-bold">We work out every other day.</span>
                  <p className="text-sm text-gray-500">Nós fazemos exercícios dia sim, dia não</p>
                </div>
                <AudioButton text="We work out every other day" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-yellow-600 font-bold">What do you want to order?</span>
                  <p className="text-sm text-gray-500">O que você quer pedir?</p>
                </div>
                <AudioButton text="What do you want to order" />
              </div>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I want to go out <span className="text-yellow-600 font-bold">tomorrow</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu quero sair amanhã</p>
                  </div>
                  <AudioButton text="I want to go out tomorrow" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">We work out <span className="text-yellow-600 font-bold">every day</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Nós treinamos todo dia</p>
                  </div>
                  <AudioButton text="We work out every day" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">What do you want to <span className="text-yellow-600 font-bold">eat</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">O que você quer comer?</p>
                  </div>
                  <AudioButton text="What do you want to eat" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">What do you want to <span className="text-yellow-600 font-bold">drink</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">O que você quer beber?</p>
                  </div>
                  <AudioButton text="What do you want to drink" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you want to <span className="text-yellow-600 font-bold">order now</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">Você quer pedir agora?</p>
                  </div>
                  <AudioButton text="Do you want to order now" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">They go out together on <span className="text-yellow-600 font-bold">weekends</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Eles saem juntos aos finais de semana.</p>
                  </div>
                  <AudioButton text="They go out together on weekends" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you prefer to go out or <span className="text-yellow-600 font-bold">stay at home</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">Você prefere sair ou ficar em casa?</p>
                  </div>
                  <AudioButton text="Do you prefer to go out or stay at home" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200 flex justify-between items-center cursor-pointer hover:bg-yellow-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">They eat fast food <span className="text-yellow-600 font-bold">every other day</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Eles comem comida rápida dia sim, dia não.</p>
                  </div>
                  <AudioButton text="They eat fast food every other day" />
                </div>
                {/* NEW FUTURE & PAST */}
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-yellow-600 font-bold">I will go out with my friends next weekend.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu sairei com meus amigos no próximo fim de semana.</p>
                  </div>
                  <AudioButton text="I will go out with my friends next weekend" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST: <span className="text-yellow-600 font-bold">We ordered pizza last night.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Nós pedimos pizza ontem à noite.</p>
                  </div>
                  <AudioButton text="We ordered pizza last night" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-300 bg-yellow-50 flex justify-between items-center cursor-pointer hover:bg-yellow-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-yellow-600 font-bold">Did you go out yesterday?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você saiu ontem?</p>
                  </div>
                  <AudioButton text="Did you go out yesterday" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática (Something / Anything) */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 GRAMMAR (Something / Anything)</h2>
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
            <div className="bg-purple-100 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">📚 UNDERSTANDING SOMETHING AND ANYTHING</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 border-l-4 border-green-500">
                  <h4 className="text-lg font-bold text-green-700 mb-2">✅ SOMETHING (algo / alguma coisa)</h4>
                  <p className="text-gray-700 mb-2">Usado em <span className="font-bold text-green-600">frases afirmativas</span>:</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 italic">"I need <span className="text-green-600 font-bold">something</span> to eat."</p>
                      <p className="text-sm text-gray-500">Eu preciso de <span className="font-bold">algo</span> para comer.</p>
                    </div>
                    <AudioButton text="I need something to eat" />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-gray-600 italic">"She wants <span className="text-green-600 font-bold">something</span> to drink."</p>
                      <p className="text-sm text-gray-500">Ela quer <span className="font-bold">alguma coisa</span> para beber.</p>
                    </div>
                    <AudioButton text="She wants something to drink" />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border-l-4 border-red-500">
                  <h4 className="text-lg font-bold text-red-700 mb-2">❌ ANYTHING (nada / alguma coisa)</h4>
                  <p className="text-gray-700 mb-2">Usado em <span className="font-bold text-red-600">frases negativas e interrogativas</span>:</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 italic">"I don't want <span className="text-red-600 font-bold">anything</span> to drink."</p>
                      <p className="text-sm text-gray-500">Eu não quero <span className="font-bold">nada</span> para beber.</p>
                    </div>
                    <AudioButton text="I don't want anything to drink" />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-gray-600 italic">"Do you want <span className="text-red-600 font-bold">anything</span> to eat?"</p>
                      <p className="text-sm text-gray-500">Você quer <span className="font-bold">alguma coisa</span> para comer?</p>
                    </div>
                    <AudioButton text="Do you want anything to eat" />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-center text-yellow-800">
                  💡 <span className="font-bold">DICA IMPORTANTE:</span> Em frases negativas, <span className="text-red-600 font-bold">anything</span> significa <span className="font-bold">"nada"</span>.<br />
                  Em perguntas, <span className="text-red-600 font-bold">anything</span> significa <span className="font-bold">"alguma coisa"</span>.
                </p>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-600 font-bold">I need to eat something.</span>
                  <p className="text-sm text-gray-500">Eu preciso comer alguma coisa</p>
                </div>
                <AudioButton text="I need to eat something" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-600 font-bold">We want to give you something for your birthday.</span>
                  <p className="text-sm text-gray-500">Nós queremos te dar algo</p>
                </div>
                <AudioButton text="We want to give you something for your birthday" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-600 font-bold">I don't want anything to drink.</span>
                  <p className="text-sm text-gray-500">Eu não quero nada para beber</p>
                </div>
                <AudioButton text="I don't want anything to drink" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-600 font-bold">She doesn't want to buy anything.</span>
                  <p className="text-sm text-gray-500">Ela não quer comprar nada</p>
                </div>
                <AudioButton text="She doesn't want to buy anything" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-purple-600 font-bold">Do you have anything to study today?</span>
                  <p className="text-sm text-gray-500">Você tem algo para estudar hoje?</p>
                </div>
                <AudioButton text="Do you have anything to study today" />
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I need <span className="text-purple-600 font-bold">something</span> to eat now.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu preciso comer alguma coisa agora.</p>
                  </div>
                  <AudioButton text="I need something to eat now" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">He needs <span className="text-purple-600 font-bold">something</span> to open the can.</p>
                    <p className="text-sm text-gray-600 mt-1">Ele precisa de algo para abrir a lata.</p>
                  </div>
                  <AudioButton text="He needs something to open the can" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you want <span className="text-purple-600 font-bold">anything</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">Você quer alguma coisa?</p>
                  </div>
                  <AudioButton text="Do you want anything" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you want to buy <span className="text-purple-600 font-bold">anything</span>?</p>
                    <p className="text-sm text-gray-600 mt-1">Você quer comprar alguma coisa?</p>
                  </div>
                  <AudioButton text="Do you want to buy anything" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">Do you have to study <span className="text-purple-600 font-bold">anything</span> today?</p>
                    <p className="text-sm text-gray-600 mt-1">Você tem que estudar alguma coisa hoje?</p>
                  </div>
                  <AudioButton text="Do you have to study anything today" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">They don't want <span className="text-purple-600 font-bold">anything</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Eles não querem nada.</p>
                  </div>
                  <AudioButton text="They don't want anything" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I don't want <span className="text-purple-600 font-bold">anything</span> to drink.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu não quero nada para beber.</p>
                  </div>
                  <AudioButton text="I don't want anything to drink" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">He doesn't want to order <span className="text-purple-600 font-bold">anything</span>.</p>
                    <p className="text-sm text-gray-600 mt-1">Ele não quer pedir nada.</p>
                  </div>
                  <AudioButton text="He doesn't want to order anything" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 flex justify-between items-center cursor-pointer hover:bg-purple-50 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">I don't have <span className="text-purple-600 font-bold">anything different</span> here.</p>
                    <p className="text-sm text-gray-600 mt-1">Eu não tenho nada diferente aqui.</p>
                  </div>
                  <AudioButton text="I don't have anything different here" />
                </div>
                {/* NEW FUTURE & PAST */}
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">🔮 FUTURE: <span className="text-purple-600 font-bold">I will order something different tonight.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Eu pedirei algo diferente hoje à noite.</p>
                  </div>
                  <AudioButton text="I will order something different tonight" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">❓ PAST QUESTION: <span className="text-purple-600 font-bold">Did you buy anything at the store?</span></p>
                    <p className="text-sm text-gray-600 mt-1">Você comprou alguma coisa na loja?</p>
                  </div>
                  <AudioButton text="Did you buy anything at the store" />
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-300 bg-purple-50 flex justify-between items-center cursor-pointer hover:bg-purple-100 transition-colors">
                  <div>
                    <p className="text-lg font-medium text-gray-800">📆 PAST: <span className="text-purple-600 font-bold">She didn't eat anything at lunch.</span></p>
                    <p className="text-sm text-gray-600 mt-1">Ela não comeu nada no almoço.</p>
                  </div>
                  <AudioButton text="She didn't eat anything at lunch" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🎭 MAKE IT YOURS!</h2>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">The snack bar opens at <span className="text-red-600 font-bold">noon</span>.</p>
                      <p className="text-sm text-gray-600">A lanchonete abre ao meio-dia.</p>
                    </div>
                    <AudioButton text="The snack bar opens at noon" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">Does it open on <span className="text-red-600 font-bold">weekends</span>?</p>
                      <p className="text-sm text-gray-600">Abre nos fins de semana?</p>
                    </div>
                    <AudioButton text="Does it open on weekends" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">The school opens at <span className="text-red-600 font-bold">9:00 a.m.</span></p>
                      <p className="text-sm text-gray-600">A escola abre às 9h.</p>
                    </div>
                    <AudioButton text="The school opens at 9 a.m." />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">The gym doesn't close on <span className="text-red-600 font-bold">Sundays</span>.</p>
                      <p className="text-sm text-gray-600">A academia não fecha aos domingos.</p>
                    </div>
                    <AudioButton text="The gym doesn't close on Sundays" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">Do they close the museum <span className="text-red-600 font-bold">early</span>?</p>
                      <p className="text-sm text-gray-600">Eles fecham o museu cedo?</p>
                    </div>
                    <AudioButton text="Do they close the museum early" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">What time does it <span className="text-red-600 font-bold">open</span>?</p>
                      <p className="text-sm text-gray-600">Que horas abre?</p>
                    </div>
                    <AudioButton text="What time does it open" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">Do you need <span className="text-red-600 font-bold">anything</span>?</p>
                      <p className="text-sm text-gray-600">Você precisa de alguma coisa?</p>
                    </div>
                    <AudioButton text="Do you need anything" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">I don't need anything, <span className="text-red-600 font-bold">thanks</span>.</p>
                      <p className="text-sm text-gray-600">Eu não preciso de nada, obrigado.</p>
                    </div>
                    <AudioButton text="I don't need anything thanks" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">I'm hungry. I want <span className="text-red-600 font-bold">something to eat</span>.</p>
                      <p className="text-sm text-gray-600">Estou com fome. Quero algo para comer.</p>
                    </div>
                    <AudioButton text="I'm hungry I want something to eat" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">Are you thirsty? Do you want <span className="text-red-600 font-bold">something to drink</span>?</p>
                      <p className="text-sm text-gray-600">Está com sede? Quer algo para beber?</p>
                    </div>
                    <AudioButton text="Are you thirsty do you want something to drink" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">Open this bottle for me, <span className="text-red-600 font-bold">please</span>.</p>
                      <p className="text-sm text-gray-600">Abra essa garrafa pra mim, por favor.</p>
                    </div>
                    <AudioButton text="Open this bottle for me please" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-medium">I need a fork to eat my <span className="text-red-600 font-bold">cake</span>.</p>
                      <p className="text-sm text-gray-600">Eu preciso de um garfo para comer meu bolo.</p>
                    </div>
                    <AudioButton text="I need a fork to eat my cake" />
                  </div>
                </div>

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Restaurant interior"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <p className="text-center mt-2 text-gray-700 italic">Restaurant interior</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <img
                      src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                      alt="Delicious food"
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <p className="text-center mt-2 text-gray-700 italic">Delicious dishes</p>
                  </div>
                </div>
              </div>

              {openDrills.realLife && (
                <div className="mt-6 bg-white rounded-2xl p-6 space-y-4 border-2 border-red-200 animate-fadeIn">
                  <h3 className="text-xl font-bold text-red-700 mb-4">📝 More Practice:</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">The restaurant opens at <span className="text-red-600 font-bold">noon / 7 p.m.</span></p>
                      </div>
                      <AudioButton text="The restaurant opens at noon" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">Does it open on <span className="text-red-600 font-bold">Sundays / holidays</span>?</p>
                      </div>
                      <AudioButton text="Does it open on Sundays" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">The store closes at <span className="text-red-600 font-bold">10 p.m. / 6 p.m.</span></p>
                      </div>
                      <AudioButton text="The store closes at 10 p.m." />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">What time does the <span className="text-red-600 font-bold">bank / supermarket</span> open?</p>
                      </div>
                      <AudioButton text="What time does the bank open" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">Do you need <span className="text-red-600 font-bold">anything</span> to eat/drink?</p>
                      </div>
                      <AudioButton text="Do you need anything to eat" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">I want <span className="text-red-600 font-bold">something</span> sweet / salty / cold</p>
                      </div>
                      <AudioButton text="I want something sweet" />
                    </div>
                    {/* NEW FUTURE & PAST in Real Life */}
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">🔮 FUTURE: I <span className="text-red-600 font-bold">will go</span> to the new restaurant tomorrow.</p>
                      </div>
                      <AudioButton text="I will go to the new restaurant tomorrow" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">📆 PAST: We <span className="text-red-600 font-bold">ate</span> at a fantastic place yesterday.</p>
                      </div>
                      <AudioButton text="We ate at a fantastic place yesterday" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">❓ PAST: <span className="text-red-600 font-bold">Did you like</span> the food at the party?</p>
                      </div>
                      <AudioButton text="Did you like the food at the party" />
                    </div>
                    <div className="p-3 bg-red-50 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-medium">🔮 FUTURE NEGATIVE: I <span className="text-red-600 font-bold">won't eat</span> fast food this week.</p>
                      </div>
                      <AudioButton text="I won't eat fast food this week" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção 6 - Wrap Up! */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-3xl font-bold">✅ WRAP UP!</h2>
              <PencilIcon onClick={() => openNoteModal('Wrap Up')} />
            </div>
            <p className="text-sm text-blue-100">
              Revise os pontos principais da lição
            </p>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-teal-900 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">breakfast</span></p>
                </div>
                <AudioButton text="to have breakfast" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">lunch</span></p>
                </div>
                <AudioButton text="to have lunch" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">dinner</span></p>
                </div>
                <AudioButton text="to have dinner" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">a snack</span></p>
                </div>
                <AudioButton text="to have a snack" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">dessert</span></p>
                </div>
                <AudioButton text="to have dessert" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">some soup</span></p>
                </div>
                <AudioButton text="to have some soup" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">a milkshake</span></p>
                </div>
                <AudioButton text="to have a milkshake" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• to have <span className="font-bold text-yellow-300">ice cream</span></p>
                </div>
                <AudioButton text="to have ice cream" />
              </div>
            </div>

            <div className="bg-teal-50 flex-1 p-6 flex flex-col items-center justify-center gap-3">
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full flex items-center justify-between">
                <div>
                  <span className="font-bold text-teal-700">I want to go out tonight.</span>
                  <p className="text-sm text-gray-500 mt-1">Eu quero sair hoje à noite.</p>
                </div>
                <AudioButton text="I want to go out tonight" />
              </div>
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full flex items-center justify-between">
                <div>
                  <span className="font-bold text-green-700">Do you need anything?</span>
                  <p className="text-sm text-gray-500 mt-1">Você precisa de alguma coisa?</p>
                </div>
                <AudioButton text="Do you need anything" />
              </div>
              <div className="bg-white text-gray-800 px-5 py-3 rounded-xl shadow-md text-center w-full flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-700">I don't need anything, thanks.</span>
                  <p className="text-sm text-gray-500 mt-1">Não preciso de nada, obrigado.</p>
                </div>
                <AudioButton text="I don't need anything thanks" />
              </div>
            </div>

            <div className="bg-teal-800 text-white flex-1 p-6 space-y-3 text-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• What time does <span className="font-bold text-yellow-300">it open</span>?</p>
                </div>
                <AudioButton text="What time does it open" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• It opens at <span className="font-bold text-yellow-300">7 a.m.</span></p>
                </div>
                <AudioButton text="It opens at 7 a.m." />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• It doesn't open on <span className="font-bold text-yellow-300">Sundays</span></p>
                </div>
                <AudioButton text="It doesn't open on Sundays" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• I need <span className="font-bold text-yellow-300">something to eat</span></p>
                </div>
                <AudioButton text="I need something to eat" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• I don't want <span className="font-bold text-yellow-300">anything to drink</span></p>
                </div>
                <AudioButton text="I don't want anything to drink" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-300">• Do you want <span className="font-bold text-yellow-300">anything</span>?</p>
                </div>
                <AudioButton text="Do you want anything" />
              </div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-blue-100 border-2 border-blue-300 rounded-[30px] p-6 mb-10">
          <h3 className="text-2xl font-bold text-blue-800 mb-4">✓ LEARNING OBJECTIVES</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Conjugar os verbos to open e to close</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Vocabulário sobre utensílios de mesa e comidas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar something em frases afirmativas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Usar anything em frases negativas e interrogativas</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Perguntar e responder sobre horários de funcionamento</span>
            </div>
            <div className="flex items-center">
              <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">✓</span>
              <span className="text-gray-800">Fazer pedidos em restaurantes</span>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson44")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson46")}
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