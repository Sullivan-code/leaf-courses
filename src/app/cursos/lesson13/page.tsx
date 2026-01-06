"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson13PersonalInfoRoutine() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showAanExplanation, setShowAanExplanation] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/'/g, '')
      .trim();
    
    console.log('Trying to play audio:', `/audios/${formattedText}.mp3`);
    
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Error playing audio:", e));
  };

  // Image URLs (placeholders - replace with real images)
  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";
  const electronicsImage = "https://i.ibb.co/N6P2sn5P/beef-and-fish.jpg";
  const personalItemsImage = "https://i.ibb.co/5xwfgP0Y/drink-and-sandwich.jpg";

  // Lesson 13 adapted data
  const verbs = [
    { english: "to need", portuguese: "precisar (de)" },
    { english: "to have", portuguese: "ter" }
  ];

  const newWords = [
    { english: "cell phone", portuguese: "telefone celular" },
    { english: "tablet", portuguese: "tablet" },
    { english: "computer", portuguese: "computador" },
    { english: "car", portuguese: "carro" },
    { english: "shoes", portuguese: "sapatos" },
    { english: "glasses", portuguese: "óculos" },
    { english: "house", portuguese: "casa" },
    { english: "old", portuguese: "velho(a)" },
    { english: "new", portuguese: "novo(a)" },
    { english: "American", portuguese: "americano(a)" },
    { english: "British", portuguese: "britânico(a)" },
    { english: "Brazilian", portuguese: "brasileiro(a)" },
    { english: "really", portuguese: "realmente / muito" },
    { english: "a", portuguese: "um / uma" },
    { english: "an", portuguese: "um / uma (before vowel sound)" }
  ];

  const usefulPhrases = [
    { english: "I don't need to go to school today.", portuguese: "Eu não preciso ir à escola hoje." },
    { english: "I need to speak to a school teacher.", portuguese: "Eu preciso falar com um professor da escola." },
    { english: "You speak English very well.", portuguese: "Você fala inglês muito bem." }
  ];

  const grammarExamples = [
    { english: "Do you need a tablet?", portuguese: "Você precisa de um tablet?" },
    { english: "I want an apple.", portuguese: "Eu quero uma maçã." },
    { english: "I like your new shoes.", portuguese: "Eu gosto dos seus sapatos novos." },
    { english: "They have an old car.", portuguese: "Eles têm um carro velho." },
    { english: "We want a new house.", portuguese: "Nós queremos uma casa nova." },
    { english: "I have a Brazilian friend.", portuguese: "Eu tenho um amigo brasileiro." },
    { english: "I like American cookies.", portuguese: "Eu gosto de cookies americanos." },
    { english: "Do you have a British co-worker?", portuguese: "Você tem um colega de trabalho britânico?" }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "We need to speak with your husband.", portuguese: "Precisamos falar com seu marido." },
    { english: "I need a new computer.", portuguese: "Eu preciso de um computador novo." },
    { english: "We don't have a Brazilian boss.", portuguese: "Nós não temos um chefe brasileiro." },
    { english: "I really need new shoes.", portuguese: "Eu realmente preciso de sapatos novos." },
    { english: "What do you need to study?", portuguese: "O que você precisa estudar?" },
    { english: "They have an old car.", portuguese: "Eles têm um carro velho." },
    { english: "I have a new cell phone.", portuguese: "Eu tenho um celular novo." },
    { english: "I have to go. Bye.", portuguese: "Eu tenho que ir. Tchau." },
    { english: "We really have to study a new language.", portuguese: "Nós realmente temos que estudar um novo idioma." },
    { english: "Where do you have to go today?", portuguese: "Onde você tem que ir hoje?" }
  ];

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
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            📘 Lesson 13 - Personal Information & Routine
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about personal belongings, daily needs, and routine activities. Master verbs "to need" and "to have".
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Personal items and daily routine"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on verbs to hear pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
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
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('need')}>need</span> to study. / work / go</p>
                  <p className="text-sm text-gray-600 mt-1">I need to study. / work / go</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you need')}>Do you need</span> a car? / a computer / new shoes</p>
                  <p className="text-sm text-gray-600 mt-1">Do you need a car? / a computer / new shoes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('they need')}>They need</span> to eat. / drink / sleep</p>
                  <p className="text-sm text-gray-600 mt-1">They need to eat. / drink / sleep</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('we need')}>We need</span> a new house. / a car / a cell phone</p>
                  <p className="text-sm text-gray-600 mt-1">We need a new house. / a car / a cell phone</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('she needs')}>She needs</span> glasses. / a tablet / a computer</p>
                  <p className="text-sm text-gray-600 mt-1">She needs glasses. / a tablet / a computer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('have')}>have</span> a car. / a house / a cell phone</p>
                  <p className="text-sm text-gray-600 mt-1">I have a car. / a house / a cell phone</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you have')}>Do you have</span> a tablet? / a computer / new shoes</p>
                  <p className="text-sm text-gray-600 mt-1">Do you have a tablet? / a computer / new shoes</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('they have')}>They have</span> an old car. / a new house / American friends</p>
                  <p className="text-sm text-gray-600 mt-1">They have an old car. / a new house / American friends</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('we have')}>We have</span> to study. / work / go</p>
                  <p className="text-sm text-gray-600 mt-1">We have to study. / work / go</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('she has')}>She has</span> Brazilian shoes. / American glasses / a British boss</p>
                  <p className="text-sm text-gray-600 mt-1">She has Brazilian shoes. / American glasses / a British boss</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('need to have')}>need to have</span> a cell phone. / a computer / new glasses</p>
                  <p className="text-sm text-gray-600 mt-1">I need to have a cell phone. / a computer / new glasses</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you have to go')}>Do you have to go</span> to work today? / to school / to the doctor</p>
                  <p className="text-sm text-gray-600 mt-1">Do you have to go to work today? / to school / to the doctor</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {word.english}
                  </button> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I need a new <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('cell phone')}>cell phone</span>. / tablet / computer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Do you have a <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('car')}>car</span>? / house / cell phone</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. We need <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('new shoes')}>new shoes</span>. / new glasses / a new house</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. I want a <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('tablet')}>tablet</span>. / computer / car</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('really')}>really</span> need to study? / work / go</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. The car is in the <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('garage')}>garage</span>. / house / school</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Do you want an <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('old')}>old</span> or <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('new')}>new</span> car?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what')}>What</span> do you need to buy? / study / do</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('have')}>have</span> a Brazilian friend. / American / British</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('need')}>need</span> glasses. / shoes / a house</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Useful Phrases</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases for daily communication
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {phrase.english}
                  </button> = {phrase.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. I don't need to go to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('school')}>school</span> today. / work / doctor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. I need to speak with a <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('teacher')}>teacher</span> at school. / doctor / boss</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. You speak <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('English')}>English</span> very well. / Portuguese / Spanish</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. I need <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('help')}>help</span> today. / money / time</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('needs')}>need</span> to study English. / work / rest</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. The cell phone is on the <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('table')}>table</span>. / bag / car</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Do you want to speak with <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('me')}>me</span>? / him / her</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('when')}>When</span> do you need to go? / study / work</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('have')}>have</span> to work today. / study / go</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('really')}>really</span> like English. / Portuguese / Spanish</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures for asking about needs and possessions
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <p key={index}>
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {example.english}
                  </button> = {example.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you need')}>Do you need</span> a tablet? / a computer / a car</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you have')}>Do you have</span> glasses? / shoes / a house</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you want')}>Do you want</span> an apple? / an egg / an orange</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you like')}>Do you like</span> your new shoes? / your old car / your house</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do they have')}>Do they have</span> an old car? / a new house / American friends</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do we need')}>Do we need</span> a new computer? / a cell phone / glasses</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you have')}>Do you have</span> a Brazilian friend? / an American co-worker / a British boss</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you want')}>Do you want</span> soda? / juice / water</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer')}>Do you prefer</span> rice? / beans / salad</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you need to study')}>Do you need to study</span> English? / Portuguese / Spanish</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you love')}>Do you love</span> pizza? / chocolate / ice cream</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do you prefer')}>Do you prefer</span> coffee or tea? / juice or soda / water or milk</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">13. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you need to study')}>What do you need to study</span> today? / tomorrow / this week</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">14. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you have to do')}>What do you have to do</span> today? / tomorrow / this week</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Real Life Practice</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice pronunciation in real situations
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
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
                        src={electronicsImage}
                        alt="Electronics and technology"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cell phones, tablets and computers
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={personalItemsImage}
                        alt="Personal items"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cars, shoes and glasses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out (print style) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice numbers and the use of articles a/an
              </p>
            </div>
            <button 
              onClick={() => setShowAanExplanation(!showAanExplanation)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showAanExplanation ? 'Hide A/An Explanation' : 'Show A/An Explanation'}
            </button>
          </div>

          {showAanExplanation && (
            <div className="bg-blue-50 p-6 border-b border-blue-200">
              <h3 className="font-bold text-blue-800 text-lg mb-2">When to use "a" vs "an":</h3>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                <li>Use <strong>"a"</strong> before words that begin with a consonant sound (a car, a house, a friend)</li>
                <li>Use <strong>"an"</strong> before words that begin with a vowel sound (an apple, an egg, an old car)</li>
                <li>Remember: It's about the SOUND, not the letter. Example: "an hour" (h is silent), "a university" (u sounds like "you")</li>
              </ul>
            </div>
          )}

          <div className="flex flex-col md:flex-row">
            {/* Left column - Numbers */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-2 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-2 text-yellow-300">NUMBERS</h3>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("zero")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• zero</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("one")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 1 - one</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("two")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 2 - two</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("three")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 3 - three</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("four")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 4 - four</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("five")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 5 - five</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("six")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 6 - six</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("seven")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 7 - seven</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("eight")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 8 - eight</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("nine")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 9 - nine</p>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => playAudio("ten")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• 10 - ten</p>
              </div>
            </div>

            {/* Right column - Articles */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("an apple")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">an apple</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("an egg")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">an egg</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("an old car")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">an old car</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => playAudio("an American teacher")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">an American teacher</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-blue-700">
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("a car")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">a car</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("a house")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">a house</p>
                  </div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("a friend")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">a friend</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => playAudio("a computer")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">a computer</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-blue-700 mt-4">
                <div className="flex items-center">
                  <button 
                    onClick={() => playAudio("What's your phone number")}
                    className="mr-2 text-blue-200 hover:text-white transition-colors"
                    aria-label="Play audio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                  <p className="text-yellow-300 font-bold">- What's your phone number?</p>
                </div>
                <div className="flex items-center mt-2">
                  <button 
                    onClick={() => playAudio("It's 523-707-4782")}
                    className="mr-2 text-blue-200 hover:text-white transition-colors"
                    aria-label="Play audio"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  </button>
                  <p className="text-yellow-300 font-bold">- It's 523-707-4782.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (12)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (14) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}