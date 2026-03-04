"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

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

export default function Lesson33() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
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
      // Verbs
      'to talk': 'https://github.com/Sullivan-code/english-audios/raw/main/to-talk.mp3',
      'to talk to': 'https://github.com/Sullivan-code/english-audios/raw/main/to-talk-to.mp3',
      'to talk about': 'https://github.com/Sullivan-code/english-audios/raw/main/to-talk-about.mp3',
      'to watch': 'https://github.com/Sullivan-code/english-audios/raw/main/to-watch.mp3',
      
      // New Words
      'science': 'https://github.com/Sullivan-code/english-audios/raw/main/science.mp3',
      'religion': 'https://github.com/Sullivan-code/english-audios/raw/main/religion.mp3',
      'politics': 'https://github.com/Sullivan-code/english-audios/raw/main/politics.mp3',
      'music': 'https://github.com/Sullivan-code/english-audios/raw/main/music.mp3',
      'sports': 'https://github.com/Sullivan-code/english-audios/raw/main/sports.mp3',
      'fashion': 'https://github.com/Sullivan-code/english-audios/raw/main/fashion.mp3',
      'life': 'https://github.com/Sullivan-code/english-audios/raw/main/life.mp3',
      'stuff': 'https://github.com/Sullivan-code/english-audios/raw/main/stuff.mp3',
      'idea': 'https://github.com/Sullivan-code/english-audios/raw/main/idea.mp3',
      'opinion': 'https://github.com/Sullivan-code/english-audios/raw/main/opinion.mp3',
      'problem': 'https://github.com/Sullivan-code/english-audios/raw/main/problem.mp3',
      'series': 'https://github.com/Sullivan-code/english-audios/raw/main/series.mp3',
      'movie': 'https://github.com/Sullivan-code/english-audios/raw/main/movie.mp3',
      'video': 'https://github.com/Sullivan-code/english-audios/raw/main/video.mp3',
      'it': 'https://github.com/Sullivan-code/english-audios/raw/main/it.mp3',
      'his': 'https://github.com/Sullivan-code/english-audios/raw/main/his.mp3',
      'her': 'https://github.com/Sullivan-code/english-audios/raw/main/her.mp3',

      // Useful Phrases
      'i want to meet my friends tonight': 'https://github.com/Sullivan-code/english-audios/raw/main/i-want-to-meet-my-friends-tonight.mp3',
      'where does he want to go tonight': 'https://github.com/Sullivan-code/english-audios/raw/main/where-does-he-want-to-go-tonight.mp3',
      'he wants to meet his friends tonight': 'https://github.com/Sullivan-code/english-audios/raw/main/he-wants-to-meet-his-friends-tonight.mp3',
      'i don\'t have an opinion about it': 'https://github.com/Sullivan-code/english-audios/raw/main/i-dont-have-an-opinion-about-it.mp3',
      'do you have an opinion about this problem': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-have-an-opinion-about-this-problem.mp3',

      // Grammar Examples
      'he watches videos on his tablet': 'https://github.com/Sullivan-code/english-audios/raw/main/he-watches-videos-on-his-tablet.mp3',
      'she has great ideas': 'https://github.com/Sullivan-code/english-audios/raw/main/she-has-great-ideas.mp3',
      'it starts at ten o\'clock': 'https://github.com/Sullivan-code/english-audios/raw/main/it-starts-at-ten-oclock.mp3',
      'she doesn\'t live with her parents': 'https://github.com/Sullivan-code/english-audios/raw/main/she-doesnt-live-with-her-parents.mp3',
      'he doesn\'t study music at the university': 'https://github.com/Sullivan-code/english-audios/raw/main/he-doesnt-study-music-at-the-university.mp3',
      'it doesn\'t finish this week': 'https://github.com/Sullivan-code/english-audios/raw/main/it-doesnt-finish-this-week.mp3',
      'does she want to learn more about sports': 'https://github.com/Sullivan-code/english-audios/raw/main/does-she-want-to-learn-more-about-sports.mp3',
      'does he like to talk about his life': 'https://github.com/Sullivan-code/english-audios/raw/main/does-he-like-to-talk-about-his-life.mp3',
      'what time does it start': 'https://github.com/Sullivan-code/english-audios/raw/main/what-time-does-it-start.mp3',

      // Real Life
      'i really need to talk to you': 'https://github.com/Sullivan-code/english-audios/raw/main/i-really-need-to-talk-to-you.mp3',
      'she talks to her mother about everything': 'https://github.com/Sullivan-code/english-audios/raw/main/she-talks-to-her-mother-about-everything.mp3',
      'my wife loves to watch series': 'https://github.com/Sullivan-code/english-audios/raw/main/my-wife-loves-to-watch-series.mp3',
      'do you like his ideas': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-like-his-ideas.mp3',
      'she doesn\'t want to talk about this subject': 'https://github.com/Sullivan-code/english-audios/raw/main/she-doesnt-want-to-talk-about-this-subject.mp3',
      'he doesn\'t have a math exam this week': 'https://github.com/Sullivan-code/english-audios/raw/main/he-doesnt-have-a-math-exam-this-week.mp3',
      'it doesn\'t start today': 'https://github.com/Sullivan-code/english-audios/raw/main/it-doesnt-start-today.mp3',
      'does he like to talk about politics': 'https://github.com/Sullivan-code/english-audios/raw/main/does-he-like-to-talk-about-politics.mp3',
      'does it finish in an hour': 'https://github.com/Sullivan-code/english-audios/raw/main/does-it-finish-in-an-hour.mp3',
      'what stuff does he want to buy': 'https://github.com/Sullivan-code/english-audios/raw/main/what-stuff-does-he-want-to-buy.mp3',
      'what time does your class start': 'https://github.com/Sullivan-code/english-audios/raw/main/what-time-does-your-class-start.mp3',
      'how many languages does your sister speak': 'https://github.com/Sullivan-code/english-audios/raw/main/how-many-languages-does-your-sister-speak.mp3',

      // Practice examples
      'i need to talk to you': 'https://github.com/Sullivan-code/english-audios/raw/main/i-need-to-talk-to-you.mp3',
      'she talks to her friends every day': 'https://github.com/Sullivan-code/english-audios/raw/main/she-talks-to-her-friends-every-day.mp3',
      'he likes to talk about sports': 'https://github.com/Sullivan-code/english-audios/raw/main/he-likes-to-talk-about-sports.mp3',
      'we watch videos on our phones': 'https://github.com/Sullivan-code/english-audios/raw/main/we-watch-videos-on-our-phones.mp3',
      'they want to watch a movie tonight': 'https://github.com/Sullivan-code/english-audios/raw/main/they-want-to-watch-a-movie-tonight.mp3',
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
        
        {/* Título centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            📘 LESSON 33 – VERBS & CONVERSATION
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda verbos essenciais para conversar sobre diversos assuntos! 🗣️
          </p>
        </div>

        {/* Seção 1 - Verbs */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1️⃣ VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>
                    <button 
                      onClick={() => playAudio('to talk to')} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      to talk (to)
                    </button> = conversar / falar com
                  </li>

                  <li>
                    <button 
                      onClick={() => playAudio('to watch')} 
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                    >
                      to watch
                    </button> = assistir
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl space-y-2">
                <p className="font-medium text-gray-700">Examples:</p>
                <p>
                  <button onClick={() => playAudio('i need to talk to you')} className="text-blue-600 hover:text-blue-800">
                    I need to talk to you.
                  </button>
                  <span className="text-gray-600 ml-2">Eu preciso conversar com você.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('she talks to her friends every day')} className="text-blue-600 hover:text-blue-800">
                    She talks to her friends every day.
                  </button>
                  <span className="text-gray-600 ml-2">Ela conversa com os amigos todos os dias.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('he likes to talk about sports')} className="text-blue-600 hover:text-blue-800">
                    He likes to talk about sports.
                  </button>
                  <span className="text-gray-600 ml-2">Ele gosta de falar sobre esportes.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('we watch videos on our phones')} className="text-blue-600 hover:text-blue-800">
                    We watch videos on our phones.
                  </button>
                  <span className="text-gray-600 ml-2">Nós assistimos vídeos em nossos celulares.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('they want to watch a movie tonight')} className="text-blue-600 hover:text-blue-800">
                    They want to watch a movie tonight.
                  </button>
                  <span className="text-gray-600 ml-2">Eles querem assistir um filme hoje à noite.</span>
                </p>
              </div>
            </div>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – VERBS</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i need to talk to you')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">1️⃣ Eu preciso conversar com você.</span> / Eles precisam conversar com você. / Nós precisamos conversar com você.
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('what do you want to watch now')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">2️⃣ O que você quer assistir agora?</span> / hoje / esta noite
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('you like to talk to me')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">3️⃣ Você gosta de conversar comigo.</span> / com ele / com ela
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i like to talk about sports')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">4️⃣ Eu gosto de falar sobre esportes.</span> / política / ciência
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('we watch videos on our phones')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">5️⃣ Nós assistimos vídeos no celular.</span> / na TV / no tablet
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to watch this movie with me')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">6️⃣ Você quer assistir esse filme comigo?</span> / essa série / esse vídeo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">2️⃣ NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir a pronúncia
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div>
                <button onClick={() => playAudio('science')} className="text-blue-600 font-bold hover:text-blue-800">science</button> = ciência
              </div>
              <div>
                <button onClick={() => playAudio('religion')} className="text-blue-600 font-bold hover:text-blue-800">religion</button> = religião
              </div>
              <div>
                <button onClick={() => playAudio('politics')} className="text-blue-600 font-bold hover:text-blue-800">politics</button> = política
              </div>
              <div>
                <button onClick={() => playAudio('music')} className="text-blue-600 font-bold hover:text-blue-800">music</button> = música
              </div>
              <div>
                <button onClick={() => playAudio('sports')} className="text-blue-600 font-bold hover:text-blue-800">sports</button> = esportes
              </div>
              <div>
                <button onClick={() => playAudio('fashion')} className="text-blue-600 font-bold hover:text-blue-800">fashion</button> = moda
              </div>
              <div>
                <button onClick={() => playAudio('life')} className="text-blue-600 font-bold hover:text-blue-800">life</button> = vida
              </div>
              <div>
                <button onClick={() => playAudio('stuff')} className="text-blue-600 font-bold hover:text-blue-800">stuff</button> = coisas
              </div>
              <div>
                <button onClick={() => playAudio('idea')} className="text-blue-600 font-bold hover:text-blue-800">idea</button> = ideia
              </div>
              <div>
                <button onClick={() => playAudio('opinion')} className="text-blue-600 font-bold hover:text-blue-800">opinion</button> = opinião
              </div>
              <div>
                <button onClick={() => playAudio('problem')} className="text-blue-600 font-bold hover:text-blue-800">problem</button> = problema
              </div>
              <div>
                <button onClick={() => playAudio('series')} className="text-blue-600 font-bold hover:text-blue-800">series</button> = série
              </div>
              <div>
                <button onClick={() => playAudio('movie')} className="text-blue-600 font-bold hover:text-blue-800">movie</button> = filme
              </div>
              <div>
                <button onClick={() => playAudio('video')} className="text-blue-600 font-bold hover:text-blue-800">video</button> = vídeo
              </div>
              <div>
                <button onClick={() => playAudio('it')} className="text-blue-600 font-bold hover:text-blue-800">it</button> = ele / ela / neutro
              </div>
              <div>
                <button onClick={() => playAudio('his')} className="text-blue-600 font-bold hover:text-blue-800">his</button> = dele
              </div>
              <div>
                <button onClick={() => playAudio('her')} className="text-blue-600 font-bold hover:text-blue-800">her</button> = dela
              </div>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – NEW WORDS</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she likes to talk about sports')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">3️⃣ Ela gosta de conversar sobre esportes.</span> / moda / religião
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i don\'t want to talk about my life')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">4️⃣ Eu não quero falar sobre minha vida.</span> / este problema / este filme
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('i watch videos on my phone')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">5️⃣ Eu assisto vídeos no meu celular.</span> / séries / filmes
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you want to watch this movie with me')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">6️⃣ Você quer assistir esse filme comigo?</span> / essa série / esse vídeo
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Useful Phrases */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3️⃣ USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Frases úteis para o dia a dia
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
            <div className="space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i want to meet my friends tonight')} className="text-blue-600 hover:text-blue-800">
                  I want to meet my friends tonight.
                </button>
                <span className="text-gray-600 ml-2">Eu quero encontrar meus amigos hoje à noite.</span>
              </p>
              <p>
                <button onClick={() => playAudio('where does he want to go tonight')} className="text-blue-600 hover:text-blue-800">
                  Where does he want to go tonight?
                </button>
                <span className="text-gray-600 ml-2">Onde ele quer ir hoje à noite?</span>
              </p>
              <p>
                <button onClick={() => playAudio('he wants to meet his friends tonight')} className="text-blue-600 hover:text-blue-800">
                  He wants to meet his friends tonight.
                </button>
                <span className="text-gray-600 ml-2">Ele quer encontrar os amigos dele hoje à noite.</span>
              </p>
              <p>
                <button onClick={() => playAudio('i don\'t have an opinion about it')} className="text-blue-600 hover:text-blue-800">
                  I don't have an opinion about it.
                </button>
                <span className="text-gray-600 ml-2">Eu não tenho uma opinião sobre isso.</span>
              </p>
              <p>
                <button onClick={() => playAudio('do you have an opinion about this problem')} className="text-blue-600 hover:text-blue-800">
                  Do you have an opinion about this problem?
                </button>
                <span className="text-gray-600 ml-2">Você tem uma opinião sobre esse problema?</span>
              </p>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – USEFUL PHRASES</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">7️⃣ Nós não ficamos em casa durante a semana.</span> / aqui / lá
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">8️⃣ Às vezes eu estudo aos domingos.</span> / lavo a roupa / limpo a casa
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('do you have an opinion about this problem')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">9️⃣ Você tem uma opinião sobre este problema?</span> / assunto / curso
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">4️⃣ GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Present Simple - Examples
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Affirmative:</p>
                <p>
                  <button onClick={() => playAudio('he watches videos on his tablet')} className="text-blue-600 hover:text-blue-800">
                    He watches videos on his tablet.
                  </button>
                  <span className="text-gray-600 ml-2">Ele assiste vídeos no tablet dele.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('she has great ideas')} className="text-blue-600 hover:text-blue-800">
                    She has great ideas.
                  </button>
                  <span className="text-gray-600 ml-2">Ela tem ótimas ideias.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('it starts at ten o\'clock')} className="text-blue-600 hover:text-blue-800">
                    It starts at ten o'clock.
                  </button>
                  <span className="text-gray-600 ml-2">Começa às dez horas.</span>
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="font-medium text-gray-700">Negative:</p>
                <p>
                  <button onClick={() => playAudio('she doesn\'t live with her parents')} className="text-blue-600 hover:text-blue-800">
                    She doesn't live with her parents.
                  </button>
                  <span className="text-gray-600 ml-2">Ela não mora com os pais.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('he doesn\'t study music at the university')} className="text-blue-600 hover:text-blue-800">
                    He doesn't study music at the university.
                  </button>
                  <span className="text-gray-600 ml-2">Ele não estuda música na universidade.</span>
                </p>
                <p>
                  <button onClick={() => playAudio('it doesn\'t finish this week')} className="text-blue-600 hover:text-blue-800">
                    It doesn't finish this week.
                  </button>
                  <span className="text-gray-600 ml-2">Não termina esta semana.</span>
                </p>
              </div>
              
              <div className="space-y-3 md:col-span-2">
                <p className="font-medium text-gray-700">Questions:</p>
                <p>
                  <button onClick={() => playAudio('does she want to learn more about sports')} className="text-blue-600 hover:text-blue-800">
                    Does she want to learn more about sports?
                  </button>
                  <span className="text-gray-600 ml-2">Ela quer aprender mais sobre esportes?</span>
                </p>
                <p>
                  <button onClick={() => playAudio('does he like to talk about his life')} className="text-blue-600 hover:text-blue-800">
                    Does he like to talk about his life?
                  </button>
                  <span className="text-gray-600 ml-2">Ele gosta de falar sobre a vida dele?</span>
                </p>
                <p>
                  <button onClick={() => playAudio('what time does it start')} className="text-blue-600 hover:text-blue-800">
                    What time does it start?
                  </button>
                  <span className="text-gray-600 ml-2">A que horas começa?</span>
                </p>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – GRAMMAR</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('she likes to talk about sports')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">🔟 Ela gosta de conversar sobre esportes.</span> / quer / prefere
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">1️⃣1️⃣ Ele não entende este assunto.</span> / esta palavra / esta língua
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => playAudio('what time does the meeting start')}>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">1️⃣2️⃣ A que horas a reunião começa?</span> / o filme / a aula
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">5️⃣ REAL LIFE</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique com situações reais
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('i really need to talk to you')} className="text-blue-600 hover:text-blue-800">
                  I really need to talk to you.
                </button>
                <span className="text-gray-600 ml-2">Eu realmente preciso conversar com você.</span>
              </p>
              <p>
                <button onClick={() => playAudio('she talks to her mother about everything')} className="text-blue-600 hover:text-blue-800">
                  She talks to her mother about everything.
                </button>
                <span className="text-gray-600 ml-2">Ela conversa com a mãe dela sobre tudo.</span>
              </p>
              <p>
                <button onClick={() => playAudio('my wife loves to watch series')} className="text-blue-600 hover:text-blue-800">
                  My wife loves to watch series.
                </button>
                <span className="text-gray-600 ml-2">Minha esposa adora assistir séries.</span>
              </p>
              <p>
                <button onClick={() => playAudio('do you like his ideas')} className="text-blue-600 hover:text-blue-800">
                  Do you like his ideas?
                </button>
                <span className="text-gray-600 ml-2">Você gosta das ideias dele?</span>
              </p>
              <p>
                <button onClick={() => playAudio('she doesn\'t want to talk about this subject')} className="text-blue-600 hover:text-blue-800">
                  She doesn't want to talk about this subject.
                </button>
                <span className="text-gray-600 ml-2">Ela não quer falar sobre esse assunto.</span>
              </p>
              <p>
                <button onClick={() => playAudio('he doesn\'t have a math exam this week')} className="text-blue-600 hover:text-blue-800">
                  He doesn't have a math exam this week.
                </button>
                <span className="text-gray-600 ml-2">Ele não tem prova de matemática esta semana.</span>
              </p>
              <p>
                <button onClick={() => playAudio('it doesn\'t start today')} className="text-blue-600 hover:text-blue-800">
                  It doesn't start today.
                </button>
                <span className="text-gray-600 ml-2">Não começa hoje.</span>
              </p>
              <p>
                <button onClick={() => playAudio('does he like to talk about politics')} className="text-blue-600 hover:text-blue-800">
                  Does he like to talk about politics?
                </button>
                <span className="text-gray-600 ml-2">Ele gosta de falar sobre política?</span>
              </p>
              <p>
                <button onClick={() => playAudio('does it finish in an hour')} className="text-blue-600 hover:text-blue-800">
                  Does it finish in an hour?
                </button>
                <span className="text-gray-600 ml-2">Termina em uma hora?</span>
              </p>
              <p>
                <button onClick={() => playAudio('what stuff does he want to buy')} className="text-blue-600 hover:text-blue-800">
                  What stuff does he want to buy?
                </button>
                <span className="text-gray-600 ml-2">Que coisas ele quer comprar?</span>
              </p>
              <p>
                <button onClick={() => playAudio('what time does your class start')} className="text-blue-600 hover:text-blue-800">
                  What time does your class start?
                </button>
                <span className="text-gray-600 ml-2">Que horas sua aula começa?</span>
              </p>
              <p>
                <button onClick={() => playAudio('how many languages does your sister speak')} className="text-blue-600 hover:text-blue-800">
                  How many languages does your sister speak?
                </button>
                <span className="text-gray-600 ml-2">Quantos idiomas sua irmã fala?</span>
              </p>
            </div>
            
            {openDrills.realLife && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <p className="text-lg font-medium text-blue-800 mb-4">🔁 PRÁTICA – REAL LIFE</p>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                  <p className="text-lg font-medium text-gray-800">
                    Pratique substituindo as palavras em azul nas frases acima com diferentes termos para criar novas frases!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 6 - Check It Out Horizontal */}
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

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson34")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}