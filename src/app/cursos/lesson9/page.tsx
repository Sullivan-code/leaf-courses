"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'newWords' | 'speakLikeNative' | 'grammar';

export default function Lesson9LanguagesAndCountries() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    newWords: false,
    speakLikeNative: false,
    grammar: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    // Map específico de textos para URLs do GitHub (igual ao da lição antiga)
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

    const audioUrl = audioMap[text.toLowerCase()];
    
    if (audioUrl) {
      console.log('Tentando reproduzir áudio:', audioUrl);
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
      console.log('Usando fallback URL:', fallbackUrl);
      
      const audio = new Audio(fallbackUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  // URLs das imagens da lição antiga
  const mainImage = "/images/l9-main.jpg";
  const cityImage = "/images/BARCELONA-ESPANHA.jpg";
  const countryImage = "/images/BERLIN-ALEMANHA.jpg";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/l9-main.jpg")`,
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
            Learn to talk about where you live and express understanding in English. 🏠🌎
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src={mainImage}
              alt="People moving in and understanding different cultures"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbs */}
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I live in Brazil. / in Spain / in Italy</p>
                  <p className="text-sm text-gray-500 mt-1">Eu moro no Brasil. / na Espanha / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you understand English? / Spanish / Portuguese</p>
                  <p className="text-sm text-gray-500 mt-1">Você entende inglês? / espanhol / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She lives in Germany. / in France / in Japan</p>
                  <p className="text-sm text-gray-500 mt-1">Ela mora na Alemanha. / na França / no Japão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They don't understand that word. / this phrase / the question</p>
                  <p className="text-sm text-gray-500 mt-1">Eles não entendem aquela palavra. / esta frase / a pergunta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to live abroad. / in the USA / in Canada</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos morar no exterior. / nos EUA / no Canadá</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Does he understand this language? / that dialect / the teacher</p>
                  <p className="text-sm text-gray-500 mt-1">Ele entende este idioma? / aquele dialeto / o professor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't live alone. / with my family / with friends</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não moro sozinho. / com minha família / com amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you live in this city? / in that country / here</p>
                  <p className="text-sm text-gray-500 mt-1">Você mora nesta cidade? / naquele país / aqui</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We understand English very well. / a little / perfectly</p>
                  <p className="text-sm text-gray-500 mt-1">Nós entendemos inglês muito bem. / um pouco / perfeitamente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Where do you live? / study / work</p>
                  <p className="text-sm text-gray-500 mt-1">Onde você mora? / estuda / trabalha</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - New Words */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">New Words</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('newWords')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.newWords ? 'Hide Exercise' : 'Show Exercise'}
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
                  onClick={() => playAudio('Brazil')} 
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
                </button> = Os Estados Unidos
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
            
            {openDrills.newWords && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">My <span className="text-blue-600">classmate</span> is from Germany.</p>
                  <p className="text-sm text-gray-500 mt-1">Meu colega de classe é da Alemanha.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I speak the <span className="text-blue-600">language</span> of that country.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu falo o idioma daquele país.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't understand this <span className="text-blue-600">word</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não entendo esta palavra.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you live in this <span className="text-blue-600">city</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você mora nesta cidade?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They want to live in that <span className="text-blue-600">country</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem morar naquele país.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I live in <span className="text-blue-600">Brazil</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu moro no Brasil.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you live <span className="text-blue-600">alone</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">Você mora sozinho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Where</span> do you study?</p>
                  <p className="text-sm text-gray-500 mt-1">Onde você estuda?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to live <span className="text-blue-600">abroad</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos morar no exterior.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I live <span className="text-blue-600">in</span> this city.</p>
                  <p className="text-sm text-gray-500 mt-1">Eu moro nesta cidade.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Speak Like a Native */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Speak Like a Native</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases to talk about where you live and understanding
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('speakLikeNative')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.speakLikeNative ? 'Hide Exercise' : 'Show Exercise'}
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
            
            {openDrills.speakLikeNative && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I understand <span className="text-blue-600">that word in English</span>. / this phrase / the question</p>
                  <p className="text-sm text-gray-500 mt-1">Eu entendo aquela palavra em inglês. / esta frase / a pergunta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I live <span className="text-blue-600">here</span>, what about you? / in Brazil / abroad</p>
                  <p className="text-sm text-gray-500 mt-1">Eu moro aqui, e você? / no Brasil / no exterior</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to live <span className="text-blue-600">abroad</span>. / here / in Italy</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos morar no exterior. / aqui / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you live <span className="text-blue-600">alone</span>? / with friends / with family</p>
                  <p className="text-sm text-gray-500 mt-1">Você mora sozinho? / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't understand <span className="text-blue-600">this word</span>. / that phrase / the teacher</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não entendo esta palavra. / aquela frase / o professor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to live in <span className="text-blue-600">Italy</span>? / Spain / Germany</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer morar na Itália? / Espanha / Alemanha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They want to live in <span className="text-blue-600">that country</span>. / this city / Brazil</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem morar naquele país. / nesta cidade / no Brasil</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you want to live in <span className="text-blue-600">this city</span>? / that country / here</p>
                  <p className="text-sm text-gray-500 mt-1">Você quer morar nesta cidade? / naquele país / aqui</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I study English <span className="text-blue-600">here</span>. / at school / online</p>
                  <p className="text-sm text-gray-500 mt-1">Eu estudo inglês aqui. / na escola / online</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Where do you want to <span className="text-blue-600">eat</span>? / study / live</p>
                  <p className="text-sm text-gray-500 mt-1">Onde você quer comer? / estudar / morar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures to make questions and negations with do/does
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
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Where do you live</span>? / study / work</p>
                  <p className="text-sm text-gray-500 mt-1">Onde você mora? / estuda / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Where does she live</span>? / study / work</p>
                  <p className="text-sm text-gray-500 mt-1">Onde ela mora? / estuda / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Where do they study</span>? / live / work</p>
                  <p className="text-sm text-gray-500 mt-1">Onde eles estudam? / moram / trabalham</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Where does he study</span>? / live / work</p>
                  <p className="text-sm text-gray-500 mt-1">Onde ele estuda? / mora / trabalha</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you understand English</span>? / Spanish / Portuguese</p>
                  <p className="text-sm text-gray-500 mt-1">Você entende inglês? / espanhol / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does she understand Spanish</span>? / English / Portuguese</p>
                  <p className="text-sm text-gray-500 mt-1">Ela entende espanhol? / inglês / português</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do they want to study</span>? / live / work</p>
                  <p className="text-sm text-gray-500 mt-1">Eles querem estudar? / morar / trabalhar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does he want to live here</span>? / there / abroad</p>
                  <p className="text-sm text-gray-500 mt-1">Ele quer morar aqui? / lá / no exterior</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do we understand this word</span>? / that / the phrase</p>
                  <p className="text-sm text-gray-500 mt-1">Nós entendemos esta palavra? / aquela / a frase</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does this work</span>? / that / it</p>
                  <p className="text-sm text-gray-500 mt-1">Isso funciona? / aquilo / isto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do you live alone</span>? / with friends / with family</p>
                  <p className="text-sm text-gray-500 mt-1">Você mora sozinho? / com amigos / com família</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Does she study here</span>? / there / at school</p>
                  <p className="text-sm text-gray-500 mt-1">Ela estuda aqui? / lá / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600">Do they understand this language</span>? / that / the dialect</p>
                  <p className="text-sm text-gray-500 mt-1">Eles entendem este idioma? / aquele / o dialeto</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Make It Yours */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">Make It Yours</h2>
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
                        onClick={() => playAudio('we want to live abroad')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. We <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. I <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('don-t understand')}
                          >don't understand</span> this word.
                        </p>
                        <p className="text-sm text-gray-600">Eu não entendo esta palavra.</p>
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. They <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. We <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. They <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
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
                      <Image
                        src={cityImage}
                        alt="Cities and places to live"
                        width={300}
                        height={256}
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cities and places to live
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src={countryImage}
                        alt="Countries and different cultures"
                        width={300}
                        height={256}
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Countries and different cultures
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - WRAP-UP */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">WRAP-UP</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice essential structures to talk about where you live and understanding
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Questions and answers */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">Simple Answers:</h3>
                <p className="text-sm text-blue-200 mb-2">
                  Use <span className="font-bold">"Yes, I do"</span> for positive answers and 
                  <span className="font-bold"> "No, I don't"</span> for negative answers when the question starts with "Do you...".
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
              <Image
                src={mainImage}
                alt="Person at home"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                Where do you live? <span className="font-bold">I live in Brazil!</span>
              </div>
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Use <span className="font-bold">"do"</span> for questions and simple answers</p>
                <p>Example: "Do you live here?" → "Yes, I <span className="font-bold">do</span>"</p>
              </div>
            </div>

            {/* Coluna direita - Prepositions */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <h3 className="font-bold text-lg mb-2 text-yellow-300">Prepositions:</h3>
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

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson10")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}