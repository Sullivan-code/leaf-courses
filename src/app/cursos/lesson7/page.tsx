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
      'bye_see_you': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/bye-see-you.mp3',
      'see_you_later': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/see-you-later.mp3',
      'good_night': 'https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-night.mp3',

      // Alfabeto (A-Z)
      'A': 'https://github.com/Sullivan-code/english-audios/blob/main/A.mp3?raw=true',
      'B': 'https://github.com/Sullivan-code/english-audios/blob/main/B.mp3?raw=true',
      'C': 'https://github.com/Sullivan-code/english-audios/blob/main/C.mp3?raw=true',
      'D': 'https://github.com/Sullivan-code/english-audios/blob/main/D.mp3?raw=true',
      'E': 'https://github.com/Sullivan-code/english-audios/blob/main/E.mp3?raw=true',
      'F': 'https://github.com/Sullivan-code/english-audios/blob/main/F.mp3?raw=true',
      'G': 'https://github.com/Sullivan-code/english-audios/blob/main/G.mp3?raw=true',
      'H': 'https://github.com/Sullivan-code/english-audios/blob/main/H.mp3?raw=true',
      'I': 'https://github.com/Sullivan-code/english-audios/blob/main/I.mp3?raw=true',
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

    // Verifica se existe áudio mapeado
    if (audioMap[word]) {
      const audio = new Audio(audioMap[word]);
      audio.play().catch(e => {
        console.error("Erro ao reproduzir áudio:", e);
        // Fallback: tenta recarregar o áudio
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
            📘 Lesson 7 – Languages & Countries
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a falar sobre idiomas, países e praticar conversas em inglês. 🌍🗣️
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
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e pratique suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Exercício' : 'Mostrar Exercício'}
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
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">falar / <span className="text-blue-600">Eu falo</span>. / Você fala.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">estudar / <span className="text-blue-600">Eu estudo</span>. / Você estuda.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu não falo</span>. / estudo / gosto / quero</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você fala?</span> / estuda / quer / prefere</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">O que você estuda?</span> / fala / prefere / quer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">O que você gosta?</span> / come / bebe</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">O que você gosta de estudar?</span> / beber / comer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">O que você quer estudar?</span> / falar / comer</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Words</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('Portuguese')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Portuguese
                </button> = português
              </li>
              <li>
                <button 
                  onClick={() => playAudio('English')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  English
                </button> = inglês
              </li>
              <li>
                <button 
                  onClick={() => playAudio('French')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  French
                </button> = francês
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Spanish')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Spanish
                </button> = espanhol
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Italian')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Italian
                </button> = italiano
              </li>
              <li>
                <button 
                  onClick={() => playAudio('German')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  German
                </button> = alemão
              </li>
              <li>
                <button 
                  onClick={() => playAudio('friend')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  friend
                </button> = amigo(a)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('teacher')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  teacher
                </button> = professor(a)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('my')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  my
                </button> = meu(s), minha(s)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('your')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  your
                </button> = seu(s), sua(s)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('we')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  we
                </button> = nós
              </li>
              <li>
                <button 
                  onClick={() => playAudio('they')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  they
                </button> = eles, elas
              </li>
              <li>
                <button 
                  onClick={() => playAudio('here')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  here
                </button> = aqui
              </li>
              <li>
                <button 
                  onClick={() => playAudio('there')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  there
                </button> = lá
              </li>
              <li>
                <button 
                  onClick={() => playAudio('too')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  too
                </button> = também
              </li>
              <li>
                <button 
                  onClick={() => playAudio('with')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  with
                </button> = com
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós estudamos inglês de manhã</span>. / à tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles não estudam francês na escola</span>. / italiano</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você fala alemão aqui?</span> / lá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo alemão com meu amigo</span>. / com meu professor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Elas falam português também</span>. / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você gosta de estudar espanhol?</span> / francês / italiano</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós falamos inglês com seus amigos</span>. / com meu professor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu não estudo francês de manhã</span>. / à tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles estudam italiano aqui</span>. / lá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você fala português na escola?</span> / inglês / espanhol</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Useful Phrases</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para conversas sobre idiomas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('I drink coffee in the morning')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I drink coffee in the morning.
                </button> = Eu bebo café de manhã.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('You study English in the afternoon')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  You study English in the afternoon.
                </button> = Você estuda inglês à tarde.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('I study English at school')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I study English at school.
                </button> = Eu estudo inglês na escola.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Do you want to study with me')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you want to study with me?
                </button> = Você quer estudar comigo?
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you want to eat with me?</span> / Você quer comer comigo? / estudar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você gosta de beber café comigo?</span> / chá / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I want to study with you</span>. / Eu quero estudar com você. / falar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de falar com você</span>. / com meus amigos / com meu professor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you want to study English?</span> / Você quer estudar inglês? / espanhol / francês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você gosta de falar inglês aqui?</span> / lá / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">I want to drink coffee in the morning</span>. / Eu quero beber café de manhã. / chá / suco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de estudar português na escola</span>. / inglês / espanhol</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas para falar sobre idiomas com diferentes pessoas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Exercício' : 'Mostrar Exercício'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('We speak Italian at school')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We speak Italian at school.
                </button> = Nós falamos italiano na escola.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('We study Spanish here too')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We study Spanish here, too.
                </button> = Nós estudamos espanhol aqui também.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('They study French there')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  They study French there.
                </button> = Eles estudam francês lá.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('They want to study here')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  They want to study here.
                </button> = Eles querem estudar aqui.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('We want to speak English')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We want to speak English.
                </button> = Nós queremos falar inglês.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('They want to study German')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  They want to study German.
                </button> = Eles querem estudar alemão.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você estuda italiano aqui?</span> / alemão / inglês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">We study French here</span>. / Nós estudamos francês aqui. / italiano / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você fala espanhol na escola?</span> / alemão / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">They study at school in the morning</span>. / Eles estudam na escola de manhã. / aqui / lá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós falamos inglês e alemão</span>. / Eu / Eles</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Elas preferem falar inglês</span>. / querem / adoram</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu gosto de falar com você</span>. / Eles / Nós</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós queremos estudar lá</span>. / aqui / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Elas falam italiano, também</span>. / português / Nós falamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu quero estudar espanhol com você</span>. / gosto / prefiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer estudar com meu amigo?</span> / seu amigo / comigo</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice*/}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Real Life</h2>
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
                        onClick={() => playAudio('I like to speak English with my friends')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 a1 1 0 010-1.415z" clipRule="evenodd" />
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
                        alt="Pessoas estudando idiomas"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Estudando idiomas com amigos
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src="https://i.ibb.co/7xHnG0TG/l7-reallife-2.jpg"
                        alt="Diferentes bandeiras e culturas"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Diversidade de idiomas e culturas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Check It Out (nova versão) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Aprenda o alfabeto e pratique a soletração de palavras em inglês.
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
                    <span>EXPLICAÇÃO</span>
                  </button>
                </div>
              </div>

              {/* Explicação que aparece quando o botão é clicado */}
              {showExplanation && (
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-2xl animate-fadeIn shadow-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 font-['Poppins']">📚 Sobre "me" e "you"</h3>
                    <button 
                      onClick={() => setShowExplanation(false)}
                      className="text-blue-700 hover:text-blue-900 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4 text-gray-800">
                    <p className="text-lg font-['Poppins']">
                      <span className="font-bold text-blue-700">Depois de preposições como "with"</span>, sempre usamos <span className="font-bold text-purple-700">pronomes oblíquos</span> (pronomes objeto).
                    </p>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                      <p className="font-bold text-blue-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">🎯</span> "Me" é a forma objeto de "I":
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li>I speak English. (sujeito: <span className="font-bold text-blue-600">I</span>)</li>
                        <li>You speak with <span className="font-bold text-blue-600">me</span>. (objeto: <span className="font-bold text-blue-600">me</span>)</li>
                        <li>She studies with <span className="font-bold text-blue-600">me</span>.</li>
                        <li>They want to talk to <span className="font-bold text-blue-600">me</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white p-5 rounded-xl border-l-4 border-purple-500 shadow-sm">
                      <p className="font-bold text-purple-700 mb-2 font-['Poppins'] flex items-center">
                        <span className="mr-2">✨</span> "You" permanece igual tanto no sujeito quanto no objeto:
                      </p>
                      <ul className="list-disc pl-6 space-y-2 font-['Poppins']">
                        <li><span className="font-bold text-purple-600">You</span> are my friend. (sujeito: <span className="font-bold text-purple-600">You</span>)</li>
                        <li>I speak with <span className="font-bold text-purple-600">you</span>. (objeto: <span className="font-bold text-purple-600">you</span>)</li>
                        <li>We study with <span className="font-bold text-purple-600">you</span>.</li>
                        <li>She likes to talk to <span className="font-bold text-purple-600">you</span>.</li>
                      </ul>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-5 rounded-xl border border-blue-300 shadow-sm">
                      <p className="font-bold text-blue-800 mb-3 font-['Poppins'] flex items-center">
                        <span className="mr-2">💡</span> Regra importante:
                      </p>
                      <p className="font-['Poppins']">Após preposições (with, to, for, about, etc.) sempre usamos os pronomes objeto: <span className="font-bold">me, you, him, her, it, us, them</span>.</p>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-['Poppins'] italic">Exemplo: "I study English with <span className="font-bold">him</span> and <span className="font-bold">her</span>."</p>
                      </div>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowExplanation(false)}
                        className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg font-['Poppins']"
                      >
                        Fechar Explicação
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson6")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors font-['Poppins']"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors font-['Poppins']"
          >
            Próxima Lição &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}