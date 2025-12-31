"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

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
      <div className="grid grid-cols-1 md:grid-cols-4 text-sm">
        {/* COLUMN 1 */}
        <div className="bg-cyan-200 p-6 space-y-3">
          <p className="text-gray-800">• to go <strong className="text-blue-700">to the U.S.A.</strong></p>
          <p className="text-gray-800">• to study <strong className="text-blue-700">in the U.S.A.</strong></p>
        </div>

        {/* COLUMN 2 */}
        <div className="bg-purple-500 text-white p-6 space-y-3">
          <p>• at work</p>
          <p>• at home</p>
          <p>• at school</p>
        </div>

        {/* COLUMN 3 */}
        <div className="bg-white p-6 space-y-3">
          <p className="text-gray-800">• They live…</p>
          <p className="text-gray-800">• My parents live…</p>
          <p className="text-gray-800">• We speak…</p>
          <p className="text-gray-800">• My sister and I speak…</p>
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

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    // Map specific texts to their corresponding GitHub audio URLs
    const audioMap: Record<string, string> = {
      'to go to': 'https://github.com/Sullivan-code/english-audios/raw/main/to-go.mp3',
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
      'to go to the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/to-go-to-the-usa.mp3',
      'to study in the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/to-study-in-the-usa.mp3',
      'at work': 'https://github.com/Sullivan-code/english-audios/raw/main/at-work.mp3',
      'at home': 'https://github.com/Sullivan-code/english-audios/raw/main/at-home.mp3',
      'at school': 'https://github.com/Sullivan-code/english-audios/raw/main/at-school.mp3',
      'they live': 'https://github.com/Sullivan-code/english-audios/raw/main/they-live.mp3',
      'my parents live': 'https://github.com/Sullivan-code/english-audios/raw/main/my-parents-live.mp3',
      'we speak': 'https://github.com/Sullivan-code/english-audios/raw/main/we-speak.mp3',
      'my sister and i speak': 'https://github.com/Sullivan-code/english-audios/raw/main/my-sister-and-i-speak.mp3',
      'i live with my father': 'https://github.com/Sullivan-code/english-audios/raw/main/i-live-with-my-father.mp3',
      'they study with my parents': 'https://github.com/Sullivan-code/english-audios/raw/main/they-study-with-my-parents.mp3',
      'i see my husband': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-husband.mp3',
      'he works in france': 'https://github.com/Sullivan-code/english-audios/raw/main/he-works-in-france.mp3',
      'i live in rio de janeiro': 'https://github.com/Sullivan-code/english-audios/raw/main/i-live-in-rio-de-janeiro.mp3',
      'she studies with my children': 'https://github.com/Sullivan-code/english-audios/raw/main/she-studies-with-my-children.mp3',
      'he doesn\'t live in the united states': 'https://github.com/Sullivan-code/english-audios/raw/main/he-doesnt-live-in-the-united-states.mp3',
      'we don\'t speak italian': 'https://github.com/Sullivan-code/english-audios/raw/main/we-dont-speak-italian.mp3',
      'i want to go to brazil': 'https://github.com/Sullivan-code/english-audios/raw/main/i-want-to-go-to-brazil.mp3',
      'they live near my boss': 'https://github.com/Sullivan-code/english-audios/raw/main/they-live-near-my-boss.mp3',
      'i study with my parents': 'https://github.com/Sullivan-code/english-audios/raw/main/i-study-with-my-parents.mp3',
      'i see my wife': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-wife.mp3',
      'do you live in france': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live-in-france.mp3',
      'do they study with my family': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-study-with-my-family.mp3',
      'do they go to school in the uk': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-go-to-school-in-the-uk.mp3',
      'does he see my husband at work': 'https://github.com/Sullivan-code/english-audios/raw/main/does-he-see-my-husband-at-work.mp3',
      'do they speak french': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-french.mp3',
      'do you want to go to france': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-want-to-go-to-france.mp3',
      'does he work in italy': 'https://github.com/Sullivan-code/english-audios/raw/main/does-he-work-in-italy.mp3',
      'i like to go tomorrow': 'https://github.com/Sullivan-code/english-audios/raw/main/i-like-to-go-tomorrow.mp3',
      'i prefer to go to work': 'https://github.com/Sullivan-code/english-audios/raw/main/i-prefer-to-go-to-work.mp3',
      'they go to the usa': 'https://github.com/Sullivan-code/english-audios/raw/main/they-go-to-the-usa.mp3',
      'they see the teacher': 'https://github.com/Sullivan-code/english-audios/raw/main/they-see-the-teacher.mp3',
      'do you want to go to the uk': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-want-to-go-to-the-uk.mp3',
      'i see my neighbor': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-neighbor.mp3',
      'do you work': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work.mp3',
      'i see my parents in the morning': 'https://github.com/Sullivan-code/english-audios/raw/main/i-see-my-parents-in-the-morning.mp3',
      'we study at college': 'https://github.com/Sullivan-code/english-audios/raw/main/we-study-at-college.mp3',
      'they see the teacher at school': 'https://github.com/Sullivan-code/english-audios/raw/main/they-see-the-teacher-at-school.mp3',
      'do you see your family on weekends': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-see-your-family-on-weekends.mp3',
      'i study with my colleagues': 'https://github.com/Sullivan-code/english-audios/raw/main/i-study-with-my-colleagues.mp3',
      'they work at the office': 'https://github.com/Sullivan-code/english-audios/raw/main/they-work-at-the-office.mp3',
      'we go to school in the morning': 'https://github.com/Sullivan-code/english-audios/raw/main/we-go-to-school-in-the-morning.mp3',
      'do you live with your parents': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live-with-your-parents.mp3',
      'go to work': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-work.mp3',
      'go to college': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-college.mp3',
      'go to school': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-school.mp3',
      'go to class': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-class.mp3',
      'go to the u.s.a.': 'https://github.com/Sullivan-code/english-audios/raw/main/go-to-the-usa.mp3',
      'see my husband': 'https://github.com/Sullivan-code/english-audios/raw/main/see-my-husband.mp3',
      'do they speak english': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-english.mp3',
      'do they speak french': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-speak-french.mp3',
      'do you see your teacher': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-see-your-teacher.mp3',
      'do you live with your family': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live-with-your-family.mp3',
    };

    // Check if we have a direct mapping for this text
    const audioUrl = audioMap[text.toLowerCase()];
    
    if (audioUrl) {
      console.log('Tentando reproduzir áudio:', audioUrl);
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    } else {
      // Fallback: try to format the text for the GitHub URL
      const formattedText = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s*\/\s*/g, '-or-')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .trim();
      
      const fallbackUrl = `https://github.com/Sullivan-code/english-audios/raw/main/${formattedText}.mp3`;
      console.log('Usando fallback URL:', fallbackUrl);
      
      const audio = new Audio(fallbackUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  // URLs das imagens com qualidade otimizada
  // Usando parâmetros do IBB para melhor qualidade quando disponível
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
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e pratique suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live with my father')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my husband')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he works in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live in rio de janeiro')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she studies with my children')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he doesn\'t live in the united states')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele não mora nos Estados Unidos</span>. / na França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we don\'t speak italian')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não falamos italiano</span>. / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i want to go to brazil')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero ir para o Brasil</span> / para a França / para o Reino Unido / para a Itália / para o Japão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they live near my boss')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles moram perto da minha chefe</span> / do meu colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus pais</span> / filhos / colegas de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my wife')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo minha esposa</span> / meu marido / meu pai / minha mãe</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
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
                </button> = faculdade / colégio de trabalho
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
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live with my father')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they study with my parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my husband')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he works in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i live in rio de janeiro')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she studies with my children')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('he doesn\'t live in the united states')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele não mora nos Estados Unidos</span>. / na França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we don\'t speak italian')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não falamos italiano</span>. / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i want to go to brazil')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero ir para o Brasil</span> / para a França / para o Reino Unido / para a Itália / para o Japão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they live near my boss')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles moram perto da minha chefe</span> / do meu colega de trabalho</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre família e trabalho
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my neighbor')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu vizinho no trabalho</span>. / meu chefe / meu colega</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você estuda em casa?</span> / trabalha / mora</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i see my parents in the morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meus pais à noite</span>. / de manhã / à tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we study at college')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós estudamos na escola</span>. / na faculdade / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they see the teacher at school')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem o professor na escola</span>. / na faculdade / no trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you see your family on weekends')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você vê sua família nos fins de semana?</span> / seus pais / seus filhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i study with my colleagues')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus colegas</span>. / meus amigos / minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they work at the office')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles trabalham no escritório</span>. / em casa / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we go to school in the morning')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós vamos para a escola de manhã</span>. / à tarde / à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you live with your parents')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora com seus pais?</span> / sua família / seus amigos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas para fazer perguntas com "they" e "we"
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you live in france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora na França?</span> / no Brasil / nos EUA</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they study with my family')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com a minha família?</span> / meus pais / meus amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they go to school in the uk')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para a escola no Reino Unido?</span> / na França / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('does he see my husband at work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele vê o meu esposo no trabalho?</span> / minha esposa / meu chefe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do they speak french')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles falam francês?</span> / inglês / italiano</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to go to france')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer ir para a França?</span> / Seu professor quer…</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('does he work in italy')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na Itália?</span> / no Brasil / na Alemanha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i like to go tomorrow')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de ir amanhã para…</span> / hoje / na semana que vem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i prefer to go to work')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu prefiro ir ao trabalho…</span> / à escola / à faculdade</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they go to the usa')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para os EUA</span>. / Reino Unido / França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('they see the teacher')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem a professora…</span> / o professor / os pais</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to go to the uk')}>
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer ir para o Reino Unido?</span> / Estados Unidos? / França?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 REAL LIFE</h2>
            <p className="mt-2 text-blue-100 italic">
              Substitua as palavras em azul para praticar a pronúncia em situações reais
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura em grandes */}
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
                          >go to work</span> in the morning.
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
                            onClick={() => playAudio('go to college')}
                          >go to college</span> in the afternoon.
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go to school')}
                          >go to school</span> in France.
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. He doesn't like to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go to class')}
                          >go to class</span> in the evening.
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. I want to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('go to the u.s.a.')}
                          >go to the U.S.A.</span>
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('see my husband')}
                          >see my husband</span> at 6 a.m.
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do they speak english')}
                          >Do they speak English</span> at work?
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do they speak french')}
                          >Do they speak French</span>?
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you see your teacher')}
                          >Do you see your teacher</span>?
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you live with your family')}
                          >Do you live with your family</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você mora com sua família?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative w-full h-64 overflow-hidden">
                      <img
                        src={familyImage}
                        alt="Membros da família e relacionamentos"
                        className="w-full h-full object-contain rounded-xl"
                        loading="lazy"
                        decoding="async"
                        style={{
                          imageRendering: 'auto',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
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
                        style={{
                          imageRendering: 'auto',
                          backfaceVisibility: 'hidden',
                          transform: 'translateZ(0)'
                        }}
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

        {/* Seção 6 - Check It Out Horizontal (novo design) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 CHECK IT OUT!</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratique estruturas essenciais com "to go to" e preposições
            </p>
          </div>
          
          <div className="p-6">
            <CheckItOutHorizontal />
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson10")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}