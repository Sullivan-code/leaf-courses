"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonLanguagesAndCountries() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (word: string) => {
    // Mapeamento completo com links RAW do GitHub
    const audioMap: { [key: string]: string } = {
      // Verbos
      'to speak': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/to-speak.mp3',
      'to study': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/to-study.mp3',
      
      // Idiomas
      'Portuguese': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/portuguese.mp3',
      'English': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/english.mp3',
      'French': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/french.mp3',
      'Spanish': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/spanish.mp3',
      'Italian': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/italian.mp3',
      'German': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/german.mp3',
      
      // Palavras comuns
      'friend': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/friend.mp3',
      'teacher': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/teacher.mp3',
      'my': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my.mp3',
      'your': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/your.mp3',
      'we': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we.mp3',
      'they': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they.mp3',
      'here': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/here.mp3',
      'there': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there.mp3',
      'too': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/too.mp3',
      'with': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/with.mp3',
      'with me': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/with-me.mp3',
      'in the morning': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/in-the-morning.mp3',
      'in the afternoon': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/in-the-afternoon.mp3',
      
      // Frases úteis
      'I drink coffee in the morning': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-drink-coffee-in-the-morning.mp3',
      'You study English in the afternoon': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-study-english-in-the-afternoon.mp3',
      'I study English at school': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-study-english-at-school.mp3',
      'Do you want to study with me': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-study-with-me.mp3',
      
      // Gramática
      'We speak Italian at school': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-speak-italian-at-school.mp3',
      'We study Spanish here too': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-study-spanish-here-too.mp3',
      'They study French there': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-study-french-there.mp3',
      'They want to study here': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-study-here.mp3',
      'We want to speak English': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-want-to-speak-english.mp3',
      'They want to study German': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-study-german.mp3',
      
      // Frases do Real Life
      'I like to speak English with my friends': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/I-like-to-speak-english-with-my-friends.mp3',
      'They speak Spanish at school': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/theyy-speak-spanish-at-school.mp3',
      'They like to study Portuguese': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-like-to-study-portuguese.mp3',
      'Do you study here or there': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-study-here-or-there.mp3',
      'Do you speak German with your teacher': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-speak-german-with-your-teacher.mp3',
      'I speak Italian with my friend': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-speak-italian-with-my-friend.mp3',
      'We want to study in the morning': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-want-to-study-in-the-morning.mp3',
      'Do you want to study in the afternoon': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-study-in-the-afternoon.mp3',
      
      // Despedidas
      'bye see you': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/bye-see-you.mp3',
      'see you later': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/see-you-later.mp3',
      'good night': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-night.mp3',

      // Alfabeto (A-Z)
      'A': 'https://github.com/Sullivan-code/english-audios/blob/main/A.mp3?raw=true',
      'B': 'https://github.com/Sullivan-code/english-audios/blob/main/B.mp3?raw=true',
      'C': 'https://github.com/Sullivan-code/english-audios/blob/main/C.mp3?raw=true',
      'D': 'https://github.com/Sullivan-code/english-audios/blob/main/D.mp3?raw=true',
      'E': 'https://github.com/Sullivan-code/english-audios/blob/main/E.mp3?raw=true',
      'F': 'https://github.com/Sullivan-code/english-audios/blob/main/F.mp3?raw=true',
      'G': 'https://github.com/Sullivan-code/english-audios/blob/main/G.mp3?raw=true',
      'H': 'https://github.com/Sullivan-code/english-audios/blob/main/H.mp3?raw=true',
      'I': 'https://github.com/Sullivan-code/english-audios/blob/main/I-I.mp3?raw=true',
      'J': 'https://github.com/Sullivan-code/english-audios/blob/main/J.mp3?raw=true',
      'K': 'https://github.com/Sullivan-code/english-audios/blob/main/K.mp3?raw=true',
      'L': 'https://github.com/Sullivan-code/english-audios/blob/main/L.mp3?raw=true',
      'M': 'https://github.com/Sullivan-code/english-audios/blob/main/M.mp3?raw=true',
      'N': 'https://github.com/Sullivan-code/english-audios/blob/main/N.mp3?raw=true',
      'O': 'https://github.com/Sullivan-code/english-audios/blob/main/O.mp3?raw=true',
      'P': 'https://github.com/Sullivan-code/english-audios/blob/main/P.mp3?raw=true',
      'Q': 'https://github.com/Sullivan-code/english-audios/blob/main/Q.mp3?raw=true',
      'R': 'https://github.com/Sullivan-code/english-audios/blob/main/R.mp3?raw=true',
      'S': 'https://github.com/Sullivan-code/english-audios/blob/main/S.mp3?raw=true',
      'T': 'https://github.com/Sullivan-code/english-audios/blob/main/T.mp3?raw=true',
      'U': 'https://github.com/Sullivan-code/english-audios/blob/main/U.mp3?raw=true',
      'V': 'https://github.com/Sullivan-code/english-audios/blob/main/V.mp3?raw=true',
      'W': 'https://github.com/Sullivan-code/english-audios/blob/main/W.mp3?raw=true',
      'X': 'https://github.com/Sullivan-code/english-audios/blob/main/X.mp3?raw=true',
      'Y': 'https://github.com/Sullivan-code/english-audios/blob/main/Y.mp3?raw=true',
      'Z': 'https://github.com/Sullivan-code/english-audios/blob/main/Z.mp3?raw=true'
    };

    if (audioMap[word]) {
      const audio = new Audio(audioMap[word]);
      audio.play().catch(e => {
        console.error("Erro ao reproduzir áudio:", e);
        audio.load();
        audio.play().catch(e2 => console.error("Erro no fallback:", e2));
      });
      return;
    }

    console.warn(`Áudio não encontrado para: ${word}`);
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/lesson3-bg.jpg")`,
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
            Lesson 7 - Languages & Countries
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about languages, countries and practice conversations in English. 🌍🗣️
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src="https://i.ibb.co/nsrGVyhd/l7-main1.jpg"
              alt="Languages and Countries"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to speak')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to speak
                </button> = falar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to study')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to study
                </button> = estudar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I speak Portuguese. / I study / I like</p>
                  <p className="text-sm text-gray-500 mt-1">Eu falo português. / Eu estudo / Eu gosto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you study English? / Do you speak / Do you like</p>
                  <p className="text-sm text-gray-500 mt-1">Você estuda inglês? / Você fala / Você gosta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We speak Spanish at school. / We study / We learn</p>
                  <p className="text-sm text-gray-500 mt-1">Nós falamos espanhol na escola. / Nós estudamos / Nós aprendemos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They study French there. / They speak / They want</p>
                  <p className="text-sm text-gray-500 mt-1">Eles estudam francês lá. / Eles falam / Eles querem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She speaks Italian with her friend. / She studies / She likes</p>
                  <p className="text-sm text-gray-500 mt-1">Ela fala italiano com seu amigo. / Ela estuda / Ela gosta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't speak German. / I don't study / I don't like</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não falo alemão. / Eu não estudo / Eu não gosto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Don't you speak English? / Don't you study / Don't you like</p>
                  <p className="text-sm text-gray-500 mt-1">Você não fala inglês? / Você não estuda / Você não gosta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I like to study languages. / I want / I prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Eu gosto de estudar idiomas. / Eu quero / Eu prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to speak English fluently. / We like / We love</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos falar inglês fluentemente. / Nós gostamos / Nós adoramos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to study with me? / Do you like / Do you prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer estudar comigo? / Você gosta / Você prefere</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button onClick={() => playAudio('Portuguese')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Portuguese</button> = português
              </li>
              <li>
                <button onClick={() => playAudio('English')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">English</button> = inglês
              </li>
              <li>
                <button onClick={() => playAudio('French')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">French</button> = francês
              </li>
              <li>
                <button onClick={() => playAudio('Spanish')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Spanish</button> = espanhol
              </li>
              <li>
                <button onClick={() => playAudio('Italian')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Italian</button> = italiano
              </li>
              <li>
                <button onClick={() => playAudio('German')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">German</button> = alemão
              </li>
              <li>
                <button onClick={() => playAudio('friend')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">friend</button> = amigo(a)
              </li>
              <li>
                <button onClick={() => playAudio('teacher')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">teacher</button> = professor(a)
              </li>
              <li>
                <button onClick={() => playAudio('my')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">my</button> = meu(s), minha(s)
              </li>
              <li>
                <button onClick={() => playAudio('your')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">your</button> = seu(s), sua(s)
              </li>
              <li>
                <button onClick={() => playAudio('we')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">we</button> = nós
              </li>
              <li>
                <button onClick={() => playAudio('they')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">they</button> = eles, elas
              </li>
              <li>
                <button onClick={() => playAudio('here')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">here</button> = aqui
              </li>
              <li>
                <button onClick={() => playAudio('there')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">there</button> = lá
              </li>
              <li>
                <button onClick={() => playAudio('too')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">too</button> = também
              </li>
              <li>
                <button onClick={() => playAudio('with')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">with</button> = com
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I speak <span className="text-blue-600 font-bold">Portuguese</span>. / English / Spanish</p>
                  <p className="text-sm text-gray-500 mt-1">Eu falo português. / inglês / espanhol</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you study <span className="text-blue-600 font-bold">French</span>? / Italian / German</p>
                  <p className="text-sm text-gray-500 mt-1">Você estuda francês? / italiano / alemão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We like to speak <span className="text-blue-600 font-bold">English</span>. / Spanish / French</p>
                  <p className="text-sm text-gray-500 mt-1">Nós gostamos de falar inglês. / espanhol / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They study with their <span className="text-blue-600 font-bold">teacher</span>. / friend / classmates</p>
                  <p className="text-sm text-gray-500 mt-1">Eles estudam com seu professor. / amigo / colegas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I speak Italian with <span className="text-blue-600 font-bold">my</span> friend. / your / our</p>
                  <p className="text-sm text-gray-500 mt-1">Eu falo italiano com meu amigo. / seu / nosso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you study <span className="text-blue-600 font-bold">here</span> or there? / at school / at home</p>
                  <p className="text-sm text-gray-500 mt-1">Você estuda aqui ou lá? / na escola / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We speak English, <span className="text-blue-600 font-bold">too</span>. / also / as well</p>
                  <p className="text-sm text-gray-500 mt-1">Nós falamos inglês também. / também / igualmente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to study <span className="text-blue-600 font-bold">with</span> me? / without / for</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer estudar comigo? / sem / para</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">We</span> study French at school. / They / You</p>
                  <p className="text-sm text-gray-500 mt-1">Nós estudamos francês na escola. / Eles / Você</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">They</span> want to study German. / We / She</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem estudar alemão. / Nós / Ela</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Slangs and Fluency</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases to talk about languages
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button onClick={() => playAudio('I drink coffee in the morning')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I drink coffee in the morning.</button> = Eu bebo café de manhã.
              </li>
              <li>
                <button onClick={() => playAudio('You study English in the afternoon')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">You study English in the afternoon.</button> = Você estuda inglês à tarde.
              </li>
              <li>
                <button onClick={() => playAudio('I study English at school')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">I study English at school.</button> = Eu estudo inglês na escola.
              </li>
              <li>
                <button onClick={() => playAudio('Do you want to study with me')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">Do you want to study with me?</button> = Você quer estudar comigo?
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I drink <span className="text-blue-600 font-bold">coffee</span> in the morning. / tea / juice</p>
                  <p className="text-sm text-gray-500 mt-1">Eu bebo café de manhã. / chá / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">You study <span className="text-blue-600 font-bold">English</span> in the afternoon. / Spanish / French</p>
                  <p className="text-sm text-gray-500 mt-1">Você estuda inglês à tarde. / espanhol / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I study English <span className="text-blue-600 font-bold">at school</span>. / at home / online</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estudo inglês na escola. / em casa / online</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to study <span className="text-blue-600 font-bold">with me</span>? / with us / with her</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer estudar comigo? / conosco / com ela</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I want to speak <span className="text-blue-600 font-bold">English fluently</span>. / Spanish / French</p>
                  <p className="text-sm text-gray-500 mt-1">Eu quero falar inglês fluentemente. / espanhol / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you like to study <span className="text-blue-600 font-bold">languages</span>? / math / science</p>
                  <p className="text-sm text-gray-500 mt-1">Você gosta de estudar idiomas? / matemática / ciências</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We practice <span className="text-blue-600 font-bold">conversation</span> every day. / listening / writing</p>
                  <p className="text-sm text-gray-500 mt-1">Nós praticamos conversação todos os dias. / audição / escrita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She wants to improve her <span className="text-blue-600 font-bold">pronunciation</span>. / vocabulary / grammar</p>
                  <p className="text-sm text-gray-500 mt-1">Ela quer melhorar sua pronúncia. / vocabulário / gramática</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Understand Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures to talk about languages with different people
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button onClick={() => playAudio('We speak Italian at school')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">We speak Italian at school.</button> = Nós falamos italiano na escola.
              </p>
              <p>
                <button onClick={() => playAudio('We study Spanish here too')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">We study Spanish here, too.</button> = Nós estudamos espanhol aqui também.
              </p>
              <p>
                <button onClick={() => playAudio('They study French there')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">They study French there.</button> = Eles estudam francês lá.
              </p>
              <p>
                <button onClick={() => playAudio('They want to study here')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">They want to study here.</button> = Eles querem estudar aqui.
              </p>
              <p>
                <button onClick={() => playAudio('We want to speak English')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">We want to speak English.</button> = Nós queremos falar inglês.
              </p>
              <p>
                <button onClick={() => playAudio('They want to study German')} className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors">They want to study German.</button> = Eles querem estudar alemão.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">We</span> speak Italian at school. / They / You</p>
                  <p className="text-sm text-gray-500 mt-1">Nós falamos italiano na escola. / Eles / Você</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We study Spanish <span className="text-blue-600 font-bold">here</span>, too. / there / at home</p>
                  <p className="text-sm text-gray-500 mt-1">Nós estudamos espanhol aqui também. / lá / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They study French <span className="text-blue-600 font-bold">there</span>. / here / at school</p>
                  <p className="text-sm text-gray-500 mt-1">Eles estudam francês lá. / aqui / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They <span className="text-blue-600 font-bold">want</span> to study here. / need / prefer</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem estudar aqui. / precisam / preferem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to speak <span className="text-blue-600 font-bold">English</span>. / Spanish / French</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos falar inglês. / espanhol / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They want to study <span className="text-blue-600 font-bold">German</span>. / Italian / Portuguese</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem estudar alemão. / italiano / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you speak <span className="text-blue-600 font-bold">Spanish</span> with your friends? / English / French</p>
                  <p className="text-sm text-gray-500 mt-1">Você fala espanhol com seus amigos? / inglês / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Does she study <span className="text-blue-600 font-bold">Italian</span> at school? / German / French</p>
                  <p className="text-sm text-gray-500 mt-1">Ela estuda italiano na escola? / alemão / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We don't speak <span className="text-blue-600 font-bold">German</span> at home. / French / Italian</p>
                  <p className="text-sm text-gray-500 mt-1">Nós não falamos alemão em casa. / francês / italiano</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They don't study <span className="text-blue-600 font-bold">Portuguese</span> at school. / Spanish / English</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não estudam português na escola. / espanhol / inglês</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">Real Life Practice</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice pronunciation in real situations
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
                        onClick={() => playAudio('I like to speak English with my friends')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I like to speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('English')}
                          >English</span> with my friends.
                        </p>
                        <p className="text-sm text-gray-600">Eu gosto de falar inglês com meus amigos.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('They speak Spanish at school')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. They speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Spanish')}
                          >Spanish</span> at school.
                        </p>
                        <p className="text-sm text-gray-600">Eles falam espanhol na escola.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('They like to study Portuguese')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. They like to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Portuguese')}
                          >Portuguese</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eles gostam de estudar português.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you study here or there')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Do you study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('here')}
                          >here</span> or there?
                        </p>
                        <p className="text-sm text-gray-600">Você estuda aqui ou lá?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you want to study with me')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. Do you want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('with me')}
                          >with me</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você quer estudar comigo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you speak German with your teacher')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Do you speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('German')}
                          >German</span> with your teacher?
                        </p>
                        <p className="text-sm text-gray-600">Você fala alemão com seu professor?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I speak Italian with my friend')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. I speak <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('Italian')}
                          >Italian</span> with my friend.
                        </p>
                        <p className="text-sm text-gray-600">Eu falo italiano com meu amigo.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We want to study in the morning')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. We want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('in the morning')}
                          >in the morning</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós queremos estudar de manhã.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Do you want to study in the afternoon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. Do you want to study <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('in the afternoon')}
                          >in the afternoon</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você quer estudar à tarde?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/VcLcyCZk/l7-reallife-1.jpg"
                        alt="People studying languages"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Studying languages with friends
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/7xHnG0TG/l7-reallife-2.jpg"
                        alt="Different flags and cultures"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Diversity of languages and cultures
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
            <div>
              <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Learn the alphabet and practice spelling words in English.
              </p>
            </div>
          </div>

          <div className="w-full mx-auto bg-white p-6 font-sans">
            <div className="border-2 border-blue-300 p-6 mt-4 rounded-2xl bg-blue-50">
              <div className="text-center font-bold mb-8 text-2xl text-blue-700 font-['Poppins']">THE ALPHABET</div>

              {/* Alfabeto em 3 linhas horizontais */}
              <div className="flex flex-col items-center justify-center space-y-8 mb-10">
                {/* Linha 1: A a I */}
                <div className="flex justify-center space-x-6">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((letter) => (
                    <div 
                      key={letter} 
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      onClick={() => playAudio(letter)}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                
                {/* Linha 2: J a R */}
                <div className="flex justify-center space-x-6">
                  {["J", "K", "L", "M", "N", "O", "P", "Q", "R"].map((letter) => (
                    <div 
                      key={letter} 
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      onClick={() => playAudio(letter)}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
                
                {/* Linha 3: S a Z */}
                <div className="flex justify-center space-x-6">
                  {["S", "T", "U", "V", "W", "X", "Y", "Z"].map((letter) => (
                    <div 
                      key={letter} 
                      className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-3xl font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform cursor-pointer"
                      onClick={() => playAudio(letter)}
                    >
                      {letter}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col lg:flex-row mt-8 gap-6">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex-2 text-xl rounded-2xl shadow-md lg:w-2/3">
                  <p className="font-bold mb-2 font-['Poppins']">– How do you spell your name?</p>
                  <p className="font-bold font-['Poppins']">– A-N-A-P-A-U-L-A.</p>
                  <p className="text-blue-100 text-lg mt-3 font-['Poppins']">(Como você soletra seu nome?)</p>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-xl rounded-2xl shadow-md lg:w-1/3 flex flex-col items-center justify-center">
                  <div className="text-white font-bold text-center mb-4 font-['Poppins']">
                    <p className="text-2xl">with me</p>
                    <p className="text-2xl">with you</p>
                  </div>
                  
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 font-['Poppins'] flex items-center space-x-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>EXPLANATION</span>
                  </button>
                </div>
              </div>

              {/* Explicação que aparece quando o botão é clicado */}
              {showExplanation && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl animate-fadeIn shadow-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 font-['Poppins']">📚 About "me" and "you"</h3>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="text-blue-700 hover:text-blue-900 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-gray-800">
                    <p className="text-lg font-['Poppins']">
                      <span className="font-bold text-blue-700">After prepositions like "with"</span>, we always use <span className="font-bold text-purple-700">object pronouns</span>.
                    </p>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <p className="font-bold text-blue-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">🎯</span> "Me" is the object form of "I":
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li>I speak English. (subject: <span className="font-bold text-blue-600">I</span>)</li>
                        <li>You speak with <span className="font-bold text-blue-600">me</span>. (object: <span className="font-bold text-blue-600">me</span>)</li>
                        <li>She studies with <span className="font-bold text-blue-600">me</span>.</li>
                        <li>They want to talk to <span className="font-bold text-blue-600">me</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
                      <p className="font-bold text-purple-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">✨</span> "You" stays the same for both subject and object:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li><span className="font-bold text-purple-600">You</span> are my friend. (subject: <span className="font-bold text-purple-600">You</span>)</li>
                        <li>I speak with <span className="font-bold text-purple-600">you</span>. (object: <span className="font-bold text-purple-600">you</span>)</li>
                        <li>We study with <span className="font-bold text-purple-600">you</span>.</li>
                        <li>She likes to talk to <span className="font-bold text-purple-600">you</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-xl border border-blue-300 shadow-sm">
                      <p className="font-bold text-blue-800 mb-3 font-['Poppins'] flex items-center">
                        <span className="mr-2">💡</span> Important rule:
                      </p>
                      <p className="font-['Poppins']">After prepositions (with, to, for, about, etc.) we always use object pronouns: <span className="font-bold">me, you, him, her, it, us, them</span>.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-['Poppins'] italic">Example: "I study English with <span className="font-bold">him</span> and <span className="font-bold">her</span>."</p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-['Poppins']"
                      >
                        Close Explanation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}