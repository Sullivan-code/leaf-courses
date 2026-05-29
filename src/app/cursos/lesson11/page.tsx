"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// Componente de Modal para Anotações
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

// Componente de Ícone de Lápis
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

// Componente CheckItOutHorizontal
function CheckItOutHorizontal() {
  const playAudio = (text: string) => {
    const audioMap: Record<string, string> = {
      'to go to the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/to-go-to-the-usa.mp3',
      'to study in the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/to-study-in-the-usa.mp3',
      'at work': 'https://github.com/Sullivan-code/english-audios/raw/main/at-work.mp3',
      'at home': 'https://github.com/Sullivan-code/english-audios/raw/main/at-home.mp3',
      'at school': 'https://github.com/Sullivan-code/english-audios/raw/main/at-school.mp3',
      'they live': 'https://github.com/Sullivan-code/english-audios/raw/main/they-live.mp3',
      'my parents live': 'https://github.com/Sullivan-code/english-audios/raw/main/my-parents-live.mp3',
      'we speak': 'https://github.com/Sullivan-code/english-audios/raw/main/we-speak.mp3',
      'my sister and i speak': 'https://github.com/Sullivan-code/english-audios/raw/main/my-sister-and-i-speak.mp3',
    };
    
    const audioUrl = audioMap[text.toLowerCase()];
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        {/* COLUMN 1 */}
        <div className="bg-cyan-200 p-6 space-y-3">
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('to go to the u.s.a.')}>
            • to go <strong className="text-blue-700">to the U.S.A.</strong>
          </p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('to study in the u.s.a.')}>
            • to study <strong className="text-blue-700">in the U.S.A.</strong>
          </p>
        </div>

        {/* COLUMN 2 */}
        <div className="bg-purple-500 text-white p-6 space-y-3">
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at work')}>• at work</p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at home')}>• at home</p>
          <p className="cursor-pointer hover:opacity-70" onClick={() => playAudio('at school')}>• at school</p>
        </div>

        {/* COLUMN 3 */}
        <div className="bg-white p-6 space-y-3">
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('they live')}>• They live…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('my parents live')}>• My parents live…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('we speak')}>• We speak…</p>
          <p className="text-gray-800 cursor-pointer hover:opacity-70" onClick={() => playAudio('my sister and i speak')}>• My sister and I speak…</p>
        </div>

        {/* COLUMN 4 */}
        <div className="bg-sky-300 p-6 flex items-center justify-center font-semibold text-gray-800">
          class → classes
        </div>
      </div>
    </div>
  );
}

export default function LessonFamilyAndOccupations() {
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
    // Map específico da Lesson 11
    const audioMap: Record<string, string> = {
      'to go': 'https://github.com/Sullivan-code/english-audios/raw/main/to-go.mp3',
      'to see': 'https://github.com/Sullivan-code/english-audios/raw/main/to-see.mp3',
      'father': 'https://github.com/Sullivan-code/english-audios/raw/main/father.mp3',
      'mother': 'https://github.com/Sullivan-code/english-audios/raw/main/mother.mp3',
      'parents': 'https://github.com/Sullivan-code/english-audios/raw/main/parents.mp3',
      'child': 'https://github.com/Sullivan-code/english-audios/raw/main/child.mp3',
      'children': 'https://github.com/Sullivan-code/english-audios/raw/main/children.mp3',
      'husband': 'https://github.com/Sullivan-code/english-audios/raw/main/husband.mp3',
      'wife': 'https://github.com/Sullivan-code/english-audios/raw/main/wife.mp3',
      'family': 'https://github.com/Sullivan-code/english-audios/raw/main/family.mp3',
      'neighbor': 'https://github.com/Sullivan-code/english-audios/raw/main/neighbor.mp3',
      'boss': 'https://github.com/Sullivan-code/english-audios/raw/main/boss.mp3',
      'college': 'https://github.com/Sullivan-code/english-audios/raw/main/college.mp3',
      'home': 'https://github.com/Sullivan-code/english-audios/raw/main/home.mp3',
      'work': 'https://github.com/Sullivan-code/english-audios/raw/main/work.mp3',
      'france': 'https://github.com/Sullivan-code/english-audios/raw/main/france.mp3',
      'the united kingdom': 'https://github.com/Sullivan-code/english-audios/raw/main/the-uk.mp3',
      'i see my neighbor at work': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-neighbor-at-work.mp3',
      'do you study at home': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-study-at-home.mp3',
      'i see my parents in the evening': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-parents-in-the-evening.mp3',
      'we study at school': 'https://github.com/Sullivan-code/english-audios/raw/main/we-study-at-school.mp3',
      'do they live in germany': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-live-in-germany.mp3',
      'do they go to school in the morning': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-go-to-school-in-the-morning.mp3',
      'do they speak italian': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-italian.mp3',
      'where do they want to go': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-they-want-to-go.mp3',
      'we want to go to germany': 'https://github.com/Sullivan-code/english-audios/raw/main/we-want-to-go-to-germany.mp3',
      'we go to school': 'https://github.com/Sullivan-code/english-audios/raw/main/we-go-to-school.mp3',
      'they go to class in the evening': 'https://github.com/Sullivan-code/english-audios/raw/main/they-go-to-class-in-the-evening.mp3',
      'do they want to go to the u.k.': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-want-to-go-to-the-uk.mp3',
      'i go to work in the morning': 'https://github.com/Sullivan-code/english-audios/raw/main/i-go-to-work-in-the-morning.mp3',
      'i go to college in the afternoon': 'https://github.com/Sullivan-code/english-audios/raw/main/i-go-to-college-in-the-afternoon.mp3',
      'they go to school in france': 'https://github.com/Sullivan-code/english-audios/raw/main/they-go-to-school-in-france.mp3',
      'he doesn\'t like to go to class in the evening': 'https://github.com/Sullivan-code/english-audios/raw/main/he-doesnt-like-to-go-to-class-in-the-evening.mp3',
      'i want to go to the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/i-want-to-go-to-the-usa.mp3',
      'i see my husband at 6 a.m.': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-husband-at-6-am.mp3',
      'do they speak english at work': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-english-at-work.mp3',
      'do they speak french': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-french.mp3',
      'do you see your teacher': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-see-your-teacher.mp3',
      'do you live with your family': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live-with-your-family.mp3',
      'do you speak german with your teacher': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-speak-german-with-your-teacher.mp3',
      'go to work': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-work.mp3',
      'go to college': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-college.mp3',
      'go to school': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-school.mp3',
      'go to class': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-class.mp3',
      'see': 'https://github.com/Sullivan-code/english-audios/raw/main/to-see.mp3',
      'english': 'https://github.com/Sullivan-code/english-audios/raw/main/english.mp3',
      'french': 'https://github.com/Sullivan-code/english-audios/raw/main/french.mp3',
      'teacher': 'https://github.com/Sullivan-code/english-audios/raw/main/teacher.mp3',
      'live': 'https://github.com/Sullivan-code/english-audios/raw/main/live.mp3',
      'u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/the-usa.mp3',
      'class': 'https://github.com/Sullivan-code/english-audios/raw/main/class.mp3',
      'italian': 'https://github.com/Sullivan-code/english-audios/raw/main/italian.mp3',
      'germany': 'https://github.com/Sullivan-code/english-audios/raw/main/germany.mp3',
    };

    const audioUrl = audioMap[text.toLowerCase()];
    
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    } else {
      const formattedText = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s*\/\s*/g, '-or-')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .trim();
      
      const fallbackUrl = `https://github.com/Sullivan-code/english-audios/raw/main/${formattedText}.mp3`;
      const audio = new Audio(fallbackUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  // URLs das imagens
  const mainImage = "https://i.ibb.co/ynvwq6jp/family-and-occupation.jpg";
  const familyImage = "https://i.ibb.co/Nfx8nKV/membros-da-familia-e-relacionamentos.jpg";
  const workImage = "https://i.ibb.co/xq0tDFQy/ocupa-es-profissionais.jpg";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l7-bgg.jpg")`,
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
            Lesson 11 - Family & Occupations
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Revise frases sobre membros da família e ocupações. Aprenda verbos "to go" e "to see". 👨‍👩‍👧‍👦💼
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Family and work life"
              className="w-full h-full object-cover rounded-2xl shadow-md"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Click on the verbs to hear the pronunciation and practice their forms</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to go')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to go
                </button> = ir para
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to see')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to see
                </button> = ver
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live with my father')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                  <p className="text-sm text-gray-500 mt-1">I live with my father. / my mother / family</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                  <p className="text-sm text-gray-500 mt-1">They study with my parents. / in Brazil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my husband')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                  <p className="text-sm text-gray-500 mt-1">I see my husband. / my wife / colleague</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he works in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                  <p className="text-sm text-gray-500 mt-1">He works in France. / in Brazil / in Italy</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live in rio de janeiro')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                  <p className="text-sm text-gray-500 mt-1">I live in Rio de Janeiro. / in Brazil / in London</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she studies with my children')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                  <p className="text-sm text-gray-500 mt-1">She studies with my children. / with my friends / with my family</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he doesn\'t live in the united states')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele não mora nos Estados Unidos</span>. / na França</p>
                  <p className="text-sm text-gray-500 mt-1">He doesn't live in the United States. / in France</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we don\'t speak italian')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não falamos italiano</span>. / inglês</p>
                  <p className="text-sm text-gray-500 mt-1">We don't speak Italian. / English</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i want to go to brazil')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero ir para o Brasil</span> / para a França / para o Reino Unido / para a Itália / para o Japão</p>
                  <p className="text-sm text-gray-500 mt-1">I want to go to Brazil. / to France / to the U.K. / to Italy / to Japan</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they live near my boss')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles moram perto da minha chefe</span> / do meu colega de trabalho</p>
                  <p className="text-sm text-gray-500 mt-1">They live near my boss. / my co-worker</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus pais</span> / filhos / colegas de trabalho</p>
                  <p className="text-sm text-gray-500 mt-1">I study with my parents. / children / colleagues</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my wife')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo minha esposa</span> / meu marido / meu pai / minha mãe</p>
                  <p className="text-sm text-gray-500 mt-1">I see my wife. / my husband / my father / my mother</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
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
            <p className="text-md text-gray-600 mb-4 italic">Click on each word to hear its correct pronunciation</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('father')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  father
                </button> = pai
              </li>
              <li>
                <button 
                  onClick={() => playAudio('mother')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  mother
                </button> = mãe
              </li>
              <li>
                <button 
                  onClick={() => playAudio('parents')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  parents
                </button> = pais
              </li>
              <li>
                <button 
                  onClick={() => playAudio('child')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  child
                </button> = criança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('children')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  children
                </button> = filhos, crianças
              </li>
              <li>
                <button 
                  onClick={() => playAudio('husband')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  husband
                </button> = marido
              </li>
              <li>
                <button 
                  onClick={() => playAudio('wife')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  wife
                </button> = esposa
              </li>
              <li>
                <button 
                  onClick={() => playAudio('family')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  family
                </button> = família
              </li>
              <li>
                <button 
                  onClick={() => playAudio('neighbor')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  neighbor
                </button> = vizinho
              </li>
              <li>
                <button 
                  onClick={() => playAudio('boss')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  boss
                </button> = chefe
              </li>
              <li>
                <button 
                  onClick={() => playAudio('college')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  college
                </button> = faculdade
              </li>
              <li>
                <button 
                  onClick={() => playAudio('home')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  home
                </button> = casa
              </li>
              <li>
                <button 
                  onClick={() => playAudio('work')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  work
                </button> = trabalho, emprego
              </li>
              <li>
                <button 
                  onClick={() => playAudio('france')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  France
                </button> = França
              </li>
              <li>
                <button 
                  onClick={() => playAudio('the united kingdom')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  the United Kingdom (U.K.)
                </button> = Reino Unido
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live with my father')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                  <p className="text-sm text-gray-500 mt-1">I live with my father. / my mother / family</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                  <p className="text-sm text-gray-500 mt-1">They study with my parents. / in Brazil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my husband')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                  <p className="text-sm text-gray-500 mt-1">I see my husband. / my wife / colleague</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he works in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                  <p className="text-sm text-gray-500 mt-1">He works in France. / in Brazil / in Italy</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live in rio de janeiro')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                  <p className="text-sm text-gray-500 mt-1">I live in Rio de Janeiro. / in Brazil / in London</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she studies with my children')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                  <p className="text-sm text-gray-500 mt-1">She studies with my children. / with my friends / with my family</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
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
            <p className="text-md text-gray-600 mb-4 italic">Practice common phrases to talk about family and work</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('i see my neighbor at work')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I see my neighbor at work.
                </button> = Vejo meu vizinho no trabalho.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('do you study at home')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you study at home?
                </button> = Você estuda em casa?
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i see my parents in the evening')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I see my parents in the evening.
                </button> = Vejo meus pais à noite.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('we study at school')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We study at school.
                </button> = Estudamos na escola.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my neighbor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu vizinho no trabalho</span>. / meu chefe / meu colega</p>
                  <p className="text-sm text-gray-500 mt-1">I see my neighbor at work. / my boss / my colleague</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você estuda em casa?</span> / trabalha / de noite</p>
                  <p className="text-sm text-gray-500 mt-1">Do you study at home? / work / at night</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my parents in the morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meus pais à noite</span>. / de manhã / à tarde</p>
                  <p className="text-sm text-gray-500 mt-1">I see my parents in the evening. / in the morning / in the afternoon</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we study at college')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós estudamos na escola</span>. / na faculdade / em casa</p>
                  <p className="text-sm text-gray-500 mt-1">We study at school. / at college / at home</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they see the teacher at school')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem o professor na escola</span>. / na faculdade / no trabalho</p>
                  <p className="text-sm text-gray-500 mt-1">They see the teacher at school. / at college / at work</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you see your family on weekends')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você vê sua família nos fins de semana?</span> / seus pais / seus filhos</p>
                  <p className="text-sm text-gray-500 mt-1">Do you see your family on weekends? / your parents / your children</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i study with my colleagues')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus colegas</span>. / meus amigos / minha família</p>
                  <p className="text-sm text-gray-500 mt-1">I study with my colleagues. / my friends / my family</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they work at the office')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles trabalham no escritório</span>. / em casa / na escola</p>
                  <p className="text-sm text-gray-500 mt-1">They work at the office. / at home / at school</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we go to school in the morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós vamos para a escola de manhã</span>. / à tarde / à noite</p>
                  <p className="text-sm text-gray-500 mt-1">We go to school in the morning. / in the afternoon / in the evening</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you live with your parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora com seus pais?</span> / sua família / seus amigos</p>
                  <p className="text-sm text-gray-500 mt-1">Do you live with your parents? / your family / your friends</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
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
            <p className="text-md text-gray-600 mb-4 italic">Structures to ask questions with "they" and "we"</p>
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('do they live in germany')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do they live in Germany?
                </button> = Eles moram na Alemanha?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do they go to school in the morning')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do they go to school in the morning?
                </button> = Eles vão para a escola de manhã?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do they speak italian')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do they speak Italian?
                </button> = Eles falam italiano?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('where do they want to go')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Where do they want to go?
                </button> = Onde eles querem ir?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('we want to go to germany')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We want to go to Germany.
                </button> = Queremos ir para a Alemanha.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('we go to school')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We go to school.
                </button> = Nós vamos para a escola.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('they go to class in the evening')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  They go to class in the evening.
                </button> = Eles vão para aula à noite.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do they want to go to the u.k.')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do they want to go to the U.K.?
                </button> = Eles querem ir para o Reino Unido?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you live in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora na França?</span> / no Brasil / nos EUA</p>
                  <p className="text-sm text-gray-500 mt-1">Do you live in France? / in Brazil / in the U.S.A.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they study with my family')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com a minha família?</span> / meus pais / meus amigos</p>
                  <p className="text-sm text-gray-500 mt-1">Do they study with my family? / my parents / my friends</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they go to school in the uk')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para a escola no Reino Unido?</span> / na França / na Itália</p>
                  <p className="text-sm text-gray-500 mt-1">Do they go to school in the U.K.? / in France / in Italy</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('does he see my husband at work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele vê o meu esposo no trabalho?</span> / minha esposa / meu chefe</p>
                  <p className="text-sm text-gray-500 mt-1">Does he see my husband at work? / my wife / my boss</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they speak french')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles falam francês?</span> / inglês / italiano</p>
                  <p className="text-sm text-gray-500 mt-1">Do they speak French? / English / Italian</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to go to france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer ir para a França?</span> / Seu professor quer…</p>
                  <p className="text-sm text-gray-500 mt-1">Do you want to go to France? / Does your teacher want…</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('does he work in italy')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na Itália?</span> / no Brasil / na Alemanha</p>
                  <p className="text-sm text-gray-500 mt-1">Does he work in Italy? / in Brazil / in Germany</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i like to go tomorrow')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de ir amanhã para…</span> / hoje / na semana que vem</p>
                  <p className="text-sm text-gray-500 mt-1">I like to go tomorrow… / today / next week</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i prefer to go to work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu prefiro ir ao trabalho…</span> / à escola / à faculdade</p>
                  <p className="text-sm text-gray-500 mt-1">I prefer to go to work… / to school / to college</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they go to the usa')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para os EUA</span>. / Reino Unido / França</p>
                  <p className="text-sm text-gray-500 mt-1">They go to the U.S.A. / to the U.K. / to France</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they see the teacher')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem a professora…</span> / o professor / os pais</p>
                  <p className="text-sm text-gray-500 mt-1">They see the teacher… / the professor / the parents</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to go to the uk')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer ir para o Reino Unido?</span> / Estados Unidos? / França?</p>
                  <p className="text-sm text-gray-500 mt-1">Do you want to go to the U.K.? / the U.S.A.? / France?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 REAL LIFE</h2>
              <PencilIcon onClick={() => openNoteModal('Real Life Practice')} />
            </div>
            <div className="text-sm text-blue-100">
              Replace the blue words to practice
            </div>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i go to work in the morning')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go to work')}
                          >go</span> to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('work')}
                          >work</span> in the morning.
                        </p>
                        <p className="text-sm text-gray-600">Vou para o trabalho de manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i go to college in the afternoon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go')}
                          >go</span> to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('college')}
                          >college</span> in the afternoon.
                        </p>
                        <p className="text-sm text-gray-600">Vou para a faculdade à tarde.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('they go to school in france')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go')}
                          >go</span> to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('school')}
                          >school</span> in <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('france')}
                          >France</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eles vão para a escola na França.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('he doesn\'t like to go to class in the evening')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. He doesn't like to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go')}
                          >go</span> to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('class')}
                          >class</span> in the evening.
                        </p>
                        <p className="text-sm text-gray-600">Ele não gosta de ir para a aula à noite.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i want to go to the u.s.a.')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. I want to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go')}
                          >go</span> to the <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('u.s.a.')}
                          >U.S.A.</span>
                        </p>
                        <p className="text-sm text-gray-600">Quero ir para os EUA.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i see my husband at 6 a.m.')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('see')}
                          >see</span> my <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('husband')}
                          >husband</span> at 6 a.m.
                        </p>
                        <p className="text-sm text-gray-600">Vejo meu esposo às 6 da manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do they speak english at work')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Do they speak <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('english')}
                          >English</span> at <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('work')}
                          >work</span>?
                        </p>
                        <p className="text-sm text-gray-600">Eles falam inglês no trabalho?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do they speak french')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Do they speak <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('french')}
                          >French</span>?
                        </p>
                        <p className="text-sm text-gray-600">Eles falam francês?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you see your teacher')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('see')}
                          >see</span> your <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('teacher')}
                          >teacher</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você vê o seu professor?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you live with your family')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('live')}
                          >live</span> with your <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('family')}
                          >family</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você mora com sua família?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={familyImage}
                        alt="Membros da família e relacionamentos"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Membros da família e relacionamentos
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={workImage}
                        alt="Ocupações profissionais"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Trabalho e ocupações profissionais
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
              <PencilIcon onClick={() => openNoteModal('Check It Out')} />
            </div>
            <p className="text-sm text-blue-100">
              Practice essential structures with "to go to" and prepositions
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson10")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* Modal de Anotações */}
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