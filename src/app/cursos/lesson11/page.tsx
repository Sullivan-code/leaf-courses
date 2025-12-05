"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

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
      'to go to': 'https://github.com/Sullivan-code/english-audios/raw/main/to-go-to.mp3',
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
      'France': 'https://github.com/Sullivan-code/english-audios/raw/main/france.mp3',
      'the United Kingdom (U.K.)': 'https://github.com/Sullivan-code/english-audios/raw/main/the-uk.mp3',
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
      'he doesn-t like to go to class in the evening': 'https://github.com/Sullivan-code/english-audios/raw/main/he-doesnt-like-to-go-to-class-in-the-evening.mp3',
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

  // URLs das imagens locais
  const mainImage = "/images/l11-main.jpg";
  const familyImage = "/images/FAMILY.jpg";
  const workImage = "/images/WORK.jpg";

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
            Revise frases sobre membros da família e ocupações. Aprenda verbos "go to" e "see". 👨‍👩‍👧‍👦💼
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Family and work life"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* TEACHER'S GUIDE */}
        <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">📘 TEACHER'S GUIDE — LESSON 11</h2>
            <p className="mt-2 text-blue-100 italic">
              Conteúdo exatamente como na imagem, digitado
            </p>
          </div>
          
          <div className="p-8 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">🔹 LEARNING OBJECTIVES</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Review sentences about members of the family and occupations.</li>
                <li>Introduce:
                  <ul className="list-circle pl-6 mt-1">
                    <li>verbs <span className="font-bold">go to / see</span></li>
                    <li>new words</li>
                    <li>useful phrases</li>
                    <li>grammar:
                      <ul className="list-none pl-4">
                        <li>• subject pronouns <span className="font-bold">we</span> and <span className="font-bold">they</span> in the interrogative</li>
                        <li>• preposition of direction <span className="font-bold">to</span></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">🔹 ASSESSMENT – 2'</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Say five common occupations in English.</li>
                <li>Who are the members of your family?</li>
                <li>What language do you want to speak?</li>
                <li>Where do you want to go?</li>
                <li>What do you like to do in the evening?</li>
              </ul>
            </div>
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
                  onClick={() => playAudio('to go to')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to go to
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
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele não mora nos Estados Unidos</span>. / na França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não falamos italiano</span>. / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero ir para o Brasil</span> / para a França / para o Reino Unido / para a Itália / para o Japão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles moram perto da minha chefe</span> / do meu colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus pais</span> / filhos / colegas de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
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
                  onClick={() => playAudio('France')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  France
                </button> = França
              </li>
              <li>
                <button 
                  onClick={() => playAudio('the United Kingdom (U.K.)')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  the United Kingdom (U.K.)
                </button> = Reino Unido
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro com meu pai</span>. / minha mãe / família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com meus pais</span>. / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu esposo</span> / minha esposa / colega de trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na França</span> / no Brasil / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Rio de Janeiro</span> / no Brasil / em Londres</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda com meus filhos</span> / com meus amigos / com a minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele não mora nos Estados Unidos</span>. / na França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não falamos italiano</span>. / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero ir para o Brasil</span> / para a França / para o Reino Unido / para a Itália / para o Japão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meu vizinho no trabalho</span>. / meu chefe / meu colega</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você estuda em casa?</span> / trabalha / mora</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu vejo meus pais à noite</span>. / de manhã / à tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós estudamos na escola</span>. / na faculdade / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem o professor na escola</span>. / na faculdade / no trabalho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você vê sua família nos fins de semana?</span> / seus pais / seus filhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo com meus colegas</span>. / meus amigos / minha família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles trabalham no escritório</span>. / em casa / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós vamos para a escola de manhã</span>. / à tarde / à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora na França?</span> / no Brasil / nos EUA</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam com a minha família?</span> / meus pais / meus amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para a escola no Reino Unido?</span> / na França / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele vê o meu esposo no trabalho?</span> / minha esposa / meu chefe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles falam francês?</span> / inglês / italiano</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer ir para a França?</span> / Seu professor quer…</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele trabalha na Itália?</span> / no Brasil / na Alemanha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de ir amanhã para…</span> / hoje / na semana que vem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu prefiro ir ao trabalho…</span> / à escola / à faculdade</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles vão para os EUA</span>. / Reino Unido / França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles veem a professora…</span> / o professor / os pais</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                        onClick={() => playAudio('he doesn-t like to go to class in the evening')} 
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
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
                    <div className="relative h-64 w-full">
                      <img
                        src={familyImage}
                        alt="Família"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Membros da família e relacionamentos
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={workImage}
                        alt="Trabalho"
                        className="rounded-xl object-cover w-full h-full"
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

        {/* Seção 6 - Check It Out (estilo print) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique estruturas essenciais com "to go to" e preposições
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Verbos com preposições */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">Verbos + Preposições:</h3>
                <p className="text-sm text-blue-200 mb-2">
                  Use <span className="font-bold">"to go to"</span> para indicar movimento para um lugar.
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("to go to the u.s.a.")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">to go to</span> the U.S.A.</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("to study in the u.s.a.")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">to study in</span> the U.S.A.</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("at work")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">at</span> work</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("at home")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">at</span> home</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("at school")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">at</span> school</p>
              </div>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <img
                src={familyImage}
                alt="Família reunida"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                They live in France! <span className="font-bold">We speak French!</span>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Use <span className="font-bold">"they"</span> para grupos de pessoas</p>
                <p>Exemplo: "My parents <span className="font-bold">live</span> in Brazil"</p>
              </div>
            </div>

            {/* Coluna direita - Pronomes e verbos */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-2">Pronomes + Verbos:</h3>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("they live")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">They live</span>…</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("my parents live")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">My parents live</span>…</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("we speak")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">We speak</span>…</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("my sister and i speak")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">My sister and I speak</span>…</p>
              </div>
              <div className="mt-4 text-sm text-blue-200">
                <p>Use <span className="font-bold">"do they"</span> para perguntas sobre grupos</p>
                <p>Exemplo: "Do they speak English?"</p>
              </div>
            </div>
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