"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonVerbsAndPlaces() {
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
      'to live': 'https://github.com/Sullivan-code/english-audios/raw/main/to-live.mp3',
      'to understand': 'https://github.com/Sullivan-code/english-audios/raw/main/to-understand.mp3',
      'classmate': 'https://github.com/Sullivan-code/english-audios/raw/main/classmate.mp3',
      'language': 'https://github.com/Sullivan-code/english-audios/raw/main/language.mp3',
      'word': 'https://github.com/Sullivan-code/english-audios/raw/main/word.mp3',
      'city': 'https://github.com/Sullivan-code/english-audios/raw/main/city.mp3',
      'country': 'https://github.com/Sullivan-code/english-audios/raw/main/country.mp3',
      'Brazil': 'https://github.com/Sullivan-code/english-audios/raw/main/brazil.mp3',
      'Spain': 'https://github.com/Sullivan-code/english-audios/raw/main/spain.mp3',
      'Germany': 'https://github.com/Sullivan-code/english-audios/raw/main/germany.mp3',
      'Italy': 'https://github.com/Sullivan-code/english-audios/raw/main/italy.mp3',
      'the United States of America (U.S.A.)': 'https://github.com/Sullivan-code/english-audios/raw/main/the-usa.mp3',
      'alone': 'https://github.com/Sullivan-code/english-audios/raw/main/alone.mp3',
      'where': 'https://github.com/Sullivan-code/english-audios/raw/main/where.mp3',
      'abroad': 'https://github.com/Sullivan-code/english-audios/raw/main/abroad.mp3',
      'this': 'https://github.com/Sullivan-code/english-audios/raw/main/this.mp3',
      'that': 'https://github.com/Sullivan-code/english-audios/raw/main/that.mp3',
      'in': 'https://github.com/Sullivan-code/english-audios/raw/main/in.mp3',
      'i understand that word in english': 'https://github.com/Sullivan-code/english-audios/raw/main/i-understand-that-word-in-english.mp3',
      'i live here what about you': 'https://github.com/Sullivan-code/english-audios/raw/main/i-live-here-what-about-you.mp3',
      'where do you live': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-live.mp3',
      'where do you study': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-study.mp3',
      'where do you want to live': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-want-to-live.mp3',
      'do you understand spanish': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-understand-spanish.mp3',
      'do you want to study portuguese': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-want-to-study-portuguese.mp3',
      'do they live here': 'https://github.com/Sullivan-code/english-audios/raw/main/do-they-live-here.mp3',
      'yes i do no i dont': 'https://github.com/Sullivan-code/english-audios/raw/main/yes-i-do-no-i-dont.mp3',
      'in brazil': 'https://github.com/Sullivan-code/english-audios/raw/main/in-brazil.mp3',
      'in this country': 'https://github.com/Sullivan-code/english-audios/raw/main/in-this-country.mp3',
      'in that city': 'https://github.com/Sullivan-code/english-audios/raw/main/in-that-city.mp3',
      'want to live': 'https://github.com/Sullivan-code/english-audios/raw/main/want-to-live.mp3',
      'do you live': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live.mp3',
      'don-t understand': 'https://github.com/Sullivan-code/english-audios/raw/main/dont-understand.mp3',
      'don-t live': 'https://github.com/Sullivan-code/english-audios/raw/main/dont-live.mp3',
      'we want to live abroad': 'https://github.com/Sullivan-code/english-audios/raw/main/we-want-to-live-abroad.mp3',
      'do you live alone': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-live-alone.mp3',
      'i don-t understand this word': 'https://github.com/Sullivan-code/english-audios/raw/main/i-dont-understand-this-word.mp3',
      'do you want to live in italy': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-want-to-live-in-italy.mp3',
      'they want to live in that country': 'https://github.com/Sullivan-code/english-audios/raw/main/they-want-to-live-in-that-country.mp3',
      'do you want to live in this city': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-want-to-live-in-this-city.mp3',
      'we don-t live here': 'https://github.com/Sullivan-code/english-audios/raw/main/we-dont-live-here.mp3',
      'they don-t understand that language': 'https://github.com/Sullivan-code/english-audios/raw/main/they-dont-understand-that-language.mp3',
      'where do you study english': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-study-english.mp3',
      'where do you want to eat': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-want-to-eat.mp3'
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
  const mainImage = "/images/l9-main.jpg";
  const cityImage = "/images/BARCELONA-ESPANHA.jpg";
  const countryImage = "/images/BERLIN-ALEMANHA.jpg";

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
            Lesson 9 - Languages & Countries
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Aprenda a falar sobre onde mora e expressar compreensão em inglês. 🏠🌎
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="People moving in and understanding different cultures"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">VERBS</h2>
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
                  onClick={() => playAudio('to live')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to live
                </button> = morar, viver
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to understand')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to understand
                </button> = entender
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não moramos aqui</span>. / lá / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles não entendem espanhol</span>. / inglês / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós não queremos estudar português</span>. / inglês / espanhol</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles não querem morar lá</span>. / aqui / no exterior</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você mora?</span> / estuda / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você estuda?</span> / trabalha / mora</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você quer morar?</span> / estudar / trabalhar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro sozinho</span>. / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela entende essa palavra</span>. / aquela / esta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós queremos viver no exterior</span>. / aqui / lá</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">NEW WORDS</h2>
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
                  onClick={() => playAudio('classmate')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  classmate
                </button> = colega de classe
              </li>
              <li>
                <button 
                  onClick={() => playAudio('language')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  language
                </button> = língua, idioma
              </li>
              <li>
                <button 
                  onClick={() => playAudio('word')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  word
                </button> = palavra
              </li>
              <li>
                <button 
                  onClick={() => playAudio('city')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  city
                </button> = cidade
              </li>
              <li>
                <button 
                  onClick={() => playAudio('country')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  country
                </button> = país
              </li>
              <li>
                <button 
                  onClick={() => playAudio('brazil')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Brazil
                </button> = Brasil
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Spain')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Spain
                </button> = Espanha
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Germany')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Germany
                </button> = Alemanha
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Italy')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Italy
                </button> = Itália
              </li>
              <li>
                <button 
                  onClick={() => playAudio('the United States of America (U.S.A.)')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  the United States of America (U.S.A.)
                </button> = Os stados Unidos
              </li>
              <li>
                <button 
                  onClick={() => playAudio('alone')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  alone
                </button> = sozinho(a)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('where')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  where
                </button> = onde
              </li>
              <li>
                <button 
                  onClick={() => playAudio('abroad')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  abroad
                </button> = no exterior / no estrangeiro
              </li>
              <li>
                <button 
                  onClick={() => playAudio('this')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  this
                </button> = este / esta
              </li>
              <li>
                <button 
                  onClick={() => playAudio('that')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  that
                </button> = aquele / aquela
              </li>
              <li>
                <button 
                  onClick={() => playAudio('in')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  in
                </button> = em / dentro
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Meu colega de classe é da Alemanha</span>. / Espanha / Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu falo o idioma daquele país</span>. / desta cidade / do Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu não entendo esta palavra</span>. / aquela / essa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora nesta cidade?</span> / naquela / aqui</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles querem morar naquele país</span>. / neste / no exterior</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro no Brasil</span>. / Espanha / Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora sozinho?</span> / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você estuda?</span> / trabalha / mora</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós queremos morar no exterior</span>. / aqui / lá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro nesta cidade</span>. / naquela / no Brasil</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre onde mora e compreensão
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
                  onClick={() => playAudio('i understand that word in english')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I understand that word in English.
                </button> = Eu entendo aquela palavra em inglês.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i live here what about you')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I live here, what about you?
                </button> = Eu moro aqui, e você?
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu entendo aquela palavra em inglês</span>. / esta / essa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu moro aqui, e você?</span> / lá / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós queremos morar no exterior</span>. / aqui / lá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora sozinho?</span> / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu não entendo essa palavra</span>. / aquela / esta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer morar na Itália?</span> / Espanha / Alemanha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles querem morar naquele país</span>. / neste / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você quer morar nesta cidade?</span> / naquela / aqui</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eu estudo inglês aqui</span>. / lá / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você quer comer?</span> / estudar / morar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas para fazer perguntas e negações com do/does
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
                  onClick={() => playAudio('where do you live')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Where do you live?
                </button> = Onde você mora?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('where do you study')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Where do you study?
                </button> = Onde você estuda?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('where do you want to live')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Where do you want to live?
                </button> = Onde você quer morar?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do you understand spanish')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you understand Spanish?
                </button> = Você entende espanhol?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do you want to study portuguese')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you want to study Portuguese?
                </button> = Você quer estudar português?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do they live here')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do they live here?
                </button> = Eles moram aqui?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde você mora?</span> / estuda / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde ela mora?</span> / estuda / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde eles estudam?</span> / moram / trabalham</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Onde ele estuda?</span> / mora / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você entende inglês?</span> / espanhol / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela entende espanhol?</span> / inglês / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles querem estudar?</span> / morar / trabalhar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ele quer morar aqui?</span> / lá / no exterior</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Nós entendemos esta palavra?</span> / aquela / essa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Isso funciona?</span> / aquilo / este</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Você mora sozinho?</span> / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Ela estuda aqui?</span> / lá / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Eles entendem essa língua?</span> / aquela / esta</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice*/}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">REAL LIFE</h2>
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
                        onClick={() => playAudio('we want to live abroad')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('want to live')}
                          >want to live</span> abroad.
                        </p>
                        <p className="text-sm text-gray-600">Nós queremos morar no exterior.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you live alone')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you live')}
                          >Do you live</span> alone?
                        </p>
                        <p className="text-sm text-gray-600">Você mora sozinho?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i don-t understand this word')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('don-t understand')}
                          >don't understand</span> this word.
                        </p>
                        <p className="text-sm text-gray-600">Eu não entendo essa palavra.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you want to live in italy')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you want to live')}
                          >Do you want to live</span> in Italy?
                        </p>
                        <p className="text-sm text-gray-600">Você quer morar na Itália?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('they want to live in that country')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('want to live')}
                          >want to live</span> in that country.
                        </p>
                        <p className="text-sm text-gray-600">Eles querem morar naquele país.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you want to live in this city')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you want to live')}
                          >Do you want to live</span> in this city?
                        </p>
                        <p className="text-sm text-gray-600">Você quer morar nesta cidade?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('we don-t live here')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('don-t live')}
                          >don't live</span> here.
                        </p>
                        <p className="text-sm text-gray-600">Nós não moramos aqui.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('they don-t understand that language')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('don-t understand')}
                          >don't understand</span> that language.
                        </p>
                        <p className="text-sm text-gray-600">Eles não entendem aquele idioma.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('where do you study english')} 
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
                            onClick={() => playAudio('where do you study')}
                          >Where do you study</span> English?
                        </p>
                        <p className="text-sm text-gray-600">Onde você estuda inglês?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('where do you want to eat')} 
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
                            onClick={() => playAudio('where do you want to eat')}
                          >Where do you want to eat</span>?
                        </p>
                        <p className="text-sm text-gray-600">Onde você quer comer?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={cityImage}
                        alt="Cidades"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cidades e lugares para viver
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={countryImage}
                        alt="Países"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Países e culturas diferentes
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
              <h2 className="text-3xl font-bold">CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique estruturas essenciais para falar sobre onde mora e compreensão
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Perguntas e respostas */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">Respostas Simples:</h3>
                <p className="text-sm text-blue-200 mb-2">
                  Use <span className="font-bold">"Yes, I do"</span> para respostas positivas e 
                  <span className="font-bold"> "No, I don't"</span> para respostas negativas quando a pergunta começa com "Do you...".
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes i do no i dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you live here? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes i do no i dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you understand? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes i do no i dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you want to study? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("yes i do no i dont")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Do you study English? → <span className="font-bold">Yes, I do. / No, I don't.</span></p>
              </div>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <img
                src={mainImage}
                alt="Pessoa em casa"
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                Where do you live? <span className="font-bold">I live in Brazil!</span>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Use <span className="font-bold">"do"</span> para perguntas e respostas simples</p>
                <p>Exemplo: "Do you live here?" → "Yes, I <span className="font-bold">do</span>"</p>
              </div>
            </div>

            {/* Coluna direita - Preposições */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-2">Preposições:</h3>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("in brazil")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">in</span> Brazil</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("in this country")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">in</span> this country</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("in that city")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• <span className="font-bold">in</span> that city</p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("abroad")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• live <span className="font-bold">abroad</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para próxima lição */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson9")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson10")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}