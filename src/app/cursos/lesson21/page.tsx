"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson21LifestyleWeeklyPlanning() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showPronounExplanation, setShowPronounExplanation] = useState(false);
  const [showDaysExplanation, setShowDaysExplanation] = useState(false);
  const [showVerbConjugation, setShowVerbConjugation] = useState(false);

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

  // Image URLs (using Unsplash/Pexels for lifestyle and weekly planning)
  const mainImage = "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const homeImage = "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const beachImage = "https://images.pexels.com/photos/1125977/pexels-photo-1125977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const countrysideImage = "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const apartmentImage = "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const calendarImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const weekdaysImage = "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // Lesson 21 data
  const verbs = [
    { english: "to stay", portuguese: "ficar" },
    { english: "to come", portuguese: "vir" }
  ];

  const newWords = [
    { english: "home", portuguese: "casa, lar" },
    { english: "apartment", portuguese: "apartamento" },
    { english: "beach", portuguese: "praia" },
    { english: "countryside", portuguese: "campo, interior" },
    { english: "day", portuguese: "dia" },
    { english: "week", portuguese: "semana" },
    { english: "Sunday", portuguese: "domingo" },
    { english: "Monday", portuguese: "segunda-feira" },
    { english: "Tuesday", portuguese: "terça-feira" },
    { english: "Wednesday", portuguese: "quarta-feira" },
    { english: "Thursday", portuguese: "quinta-feira" },
    { english: "Friday", portuguese: "sexta-feira" },
    { english: "Saturday", portuguese: "sábado" },
    { english: "he", portuguese: "ele" },
    { english: "she", portuguese: "ela" }
  ];

  const usefulPhrases = [
    { english: "I sometimes go to the countryside.", portuguese: "Eu às vezes vou para o interior." },
    { english: "Do you clean your house during the week?", portuguese: "Você limpa sua casa durante a semana?" },
    { english: "They go to the beach on weekends.", portuguese: "Eles vão para a praia nos fins de semana." }
  ];

  const grammarExamples = [
    { english: "She works at the bank.", portuguese: "Ela trabalha no banco." },
    { english: "He eats bread and butter every day.", portuguese: "Ele come pão com manteiga todos os dias." },
    { english: "She speaks English and German.", portuguese: "Ela fala inglês e alemão." },
    { english: "He stays home in the evening.", portuguese: "Ele fica em casa à noite." },
    { english: "She sleeps on the couch.", portuguese: "Ela dorme no sofá." },
    { english: "She goes to school in the morning.", portuguese: "Ela vai à escola de manhã." },
    { english: "He has two sisters.", portuguese: "Ele tem duas irmãs." },
    { english: "She studies at home.", portuguese: "Ela estuda em casa." }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I stay home on Mondays.", portuguese: "Eu fico em casa às segundas-feiras." },
    { english: "I sometimes read at night.", portuguese: "Eu às vezes leio à noite." },
    { english: "They come home during the week.", portuguese: "Eles vêm aqui durante a semana." },
    { english: "He goes home on weekends.", portuguese: "Ele vai para casa nos fins de semana." },
    { english: "She goes to work at 8:00 A.M.", portuguese: "Ela vai ao trabalho às 8:00 da manhã." },
    { english: "He wants to live abroad.", portuguese: "Ele quer morar no exterior." },
    { english: "He has a house in the countryside.", portuguese: "Ele tem uma casa no campo." },
    { english: "She works at home on Tuesdays and Thursdays.", portuguese: "Ela trabalha em casa às terças e quintas." },
    { english: "She has a restaurant at the beach.", portuguese: "Ela tem um restaurante na praia." },
    { english: "He studies in the morning.", portuguese: "Ele estuda de manhã." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            📅 Lesson 21 - Lifestyle & Weekly Planning
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about lifestyle choices, weekly routines, days of the week, and living arrangements.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Weekly planning and lifestyle"
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
                Clique nos verbos para ouvir a pronúncia e praticar suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Esconder Prática' : 'Mostrar Prática'}
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('stay')}>stay</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I stay')}>I stay</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You stay')}>You stay</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We stay')}>We stay</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not stay')}>I do not stay</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not stay')}>You</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not stay')}>They</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to stay here')}>Do you want to stay here</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do they want to stay here')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you all want to stay here')}>You all</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not want to stay here')}>I do not want to stay here</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to stay here')}>need</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have to stay here')}>have to</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where do you want to stay')}>Where do you want to stay</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where do you prefer to stay')}>prefer</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where do you have to stay')}>have to</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('come')}>come</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I come')}>I come</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You come')}>You come</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We come')}>We come</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not come')}>I do not come</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not come')}>We</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not come')}>They</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have to come')}>Do you have to come</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do they have to come')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do we have to come')}>We</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you go to the office')}>When do you go to the office</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you go to the company')}>to the company</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you go to the restaurant')}>to the restaurant</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not have to come')}>You do not have to come</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not have to stay')}>stay</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not have to go')}>go</span>.</p>
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
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Esconder Prática' : 'Mostrar Prática'}
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I come home in the evening')}>I come home in the evening</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They come home in the evening')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('My parents come home in the evening')}>My parents</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you come home early')}>Do you come home early</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you come home late')}>late</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you come home at six o clock')}>at six o'clock</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I prefer to stay home')}>I prefer to stay home</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to stay home')}>I want to stay home</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I like to stay home')}>I like to stay home</span>.</p>
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
                Pratique frases comuns para falar sobre rotinas semanais
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Esconder Prática' : 'Mostrar Prática'}
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
                  <p className="text-lg font-medium text-gray-800">1. Eu trabalho durante a semana. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I study during the week')}>I study during the week</span>. / Eu leio livros durante a semana.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Nós não ficamos em casa durante a semana. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not stay here during the week')}>here</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not stay there during the week')}>there</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Eu gosto de ir ao cinema nos fins de semana. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They like to go to the cinema on weekends')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We like to go to the cinema on weekends')}>We</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu não fico em casa nos fins de semana. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not stay home on Sundays')}>on Sundays</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not stay home on Saturdays')}>on Saturdays</span>.</p>
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
                Estruturas com pronomes "he" e "she" para falar sobre outras pessoas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Esconder Prática' : 'Mostrar Prática'}
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
                  <p className="text-lg font-medium text-gray-800">1. Eu como. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She eats')}>She eats</span>. / Ela come. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She drinks')}>drinks</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She works')}>works</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Eu prefiro. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He prefers')}>He prefers</span>. / Ele prefere. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He wants')}>wants</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He comes')}>comes</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Eu falo. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She speaks')}>She speaks</span>. / mora / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She sleeps')}>sleeps</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu preciso. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He needs')}>He needs</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He understands')}>understands</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He cooks')}>cooks</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Ela precisa ficar. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She needs to go')}>go</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She needs to sleep')}>sleep</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. Ele quer trabalhar. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He wants to go')}>go</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He wants to cook')}>cook</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He studies at Wizard')}>He studies at Wizard</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He studies German here')}>He studies German here</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He has two apartments')}>He has two apartments</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He has two jobs')}>jobs</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He has two schools')}>schools</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Ela tem que ir. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She has to come')}>come</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She has to stay here')}>stay here</span>.</p>
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
              Pratique situações reais de planejamento semanal e escolhas de estilo de vida
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
                    <div className="relative h-40 w-full">
                      <img
                        src={homeImage}
                        alt="Home and apartment living"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Home and apartment lifestyle
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={beachImage}
                        alt="Beach weekends"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Weekend beach trips
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={countrysideImage}
                        alt="Countryside living"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Countryside lifestyle
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
                Verb conjugations, pronouns, days of the week, and vocabulary
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Verb Conjugations */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">VERB CONJUGATIONS</h3>
                  <button 
                    onClick={() => setShowVerbConjugation(!showVerbConjugation)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showVerbConjugation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showVerbConjugation && (
                  <div className="mb-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">📚 Verb Conjugation Rules:</p>
                    <p className="text-blue-200 text-sm mb-2">For he/she/it (3rd person singular), add "s" or "es":</p>
                    <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                      <li>Most verbs: add "s" (work → works, stay → stays)</li>
                      <li>Verbs ending in -ch, -sh, -ss, -x, -o: add "es" (go → goes, watch → watches)</li>
                      <li>Verbs ending in consonant + y: change y to i + es (study → studies)</li>
                      <li>Irregular: have → has</li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I go</p>
                        <p className="text-blue-200 text-sm">Eu vou</p>
                      </div>
                      <div>
                        <p className="font-bold">She goes</p>
                        <p className="text-blue-200 text-sm">Ela vai</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I stay</p>
                        <p className="text-blue-200 text-sm">Eu fico</p>
                      </div>
                      <div>
                        <p className="font-bold">She stays</p>
                        <p className="text-blue-200 text-sm">Ela fica</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I have</p>
                        <p className="text-blue-200 text-sm">Eu tenho</p>
                      </div>
                      <div>
                        <p className="font-bold">He has</p>
                        <p className="text-blue-200 text-sm">Ele tem</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I study</p>
                        <p className="text-blue-200 text-sm">Eu estudo</p>
                      </div>
                      <div>
                        <p className="font-bold">He studies</p>
                        <p className="text-blue-200 text-sm">Ele estuda</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image for verb conjugation */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-800 rounded-lg overflow-hidden">
                  <img
                    src={weekdaysImage}
                    alt="Weekly planning and routines"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">📝 Daily Routines</p>
                    <p className="text-blue-200 text-xs">Practice conjugating verbs for daily activities</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Days of Week and Vocabulary */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">DAYS OF THE WEEK</h3>
                    <button 
                      onClick={() => setShowDaysExplanation(!showDaysExplanation)}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showDaysExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showDaysExplanation && (
                    <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-700">
                      <p className="text-yellow-200 text-sm font-medium mb-2">📅 Days of the Week Tips:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                        <li>Days are always capitalized: Monday, Tuesday, etc.</li>
                        <li>Use "on" with days: on Monday, on Tuesday</li>
                        <li>Weekend: Saturday and Sunday</li>
                        <li>Weekdays: Monday to Friday</li>
                        <li>Plural: Sundays, Mondays (for recurring activities)</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Sunday</p>
                      <p className="text-blue-200 text-sm">domingo</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Monday</p>
                      <p className="text-blue-200 text-sm">segunda-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Tuesday</p>
                      <p className="text-blue-200 text-sm">terça-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Wednesday</p>
                      <p className="text-blue-200 text-sm">quarta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Thursday</p>
                      <p className="text-blue-200 text-sm">quinta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Friday</p>
                      <p className="text-blue-200 text-sm">sexta-feira</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg col-span-3">
                      <p className="font-bold text-lg">Saturday</p>
                      <p className="text-blue-200 text-sm">sábado</p>
                    </div>
                  </div>
                </div>
                
                {/* Pronouns Section */}
                <div className="pt-6 border-t border-blue-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-lg text-yellow-300">PRONOUNS</h4>
                    <button 
                      onClick={() => setShowPronounExplanation(!showPronounExplanation)}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showPronounExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  
                  {showPronounExplanation && (
                    <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-700">
                      <p className="text-yellow-200 text-sm font-medium mb-2">👤 Pronouns Usage:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                        <li>He = ele (masculino)</li>
                        <li>She = ela (feminino)</li>
                        <li>It = ele/ela (para coisas, animais, objetos)</li>
                        <li>Use "he" or "she" for people</li>
                        <li>Verbs change with he/she/it (adds -s/-es)</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-blue-700 rounded-full p-2">
                          <span className="text-lg">👨</span>
                        </div>
                        <div>
                          <p className="font-bold">He</p>
                          <p className="text-blue-200 text-sm">ele</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: He works.</p>
                    </div>
                    
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-pink-600 rounded-full p-2">
                          <span className="text-lg">👩</span>
                        </div>
                        <div>
                          <p className="font-bold">She</p>
                          <p className="text-blue-200 text-sm">ela</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: She studies.</p>
                    </div>
                  </div>
                </div>
                
                {/* Vocabulary Support */}
                <div className="mt-6 pt-6 border-t border-blue-700">
                  <div className="p-4 bg-blue-900 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">📋 Vocabulary Support</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">to go home</p>
                        <p className="text-blue-200 text-sm">ir para casa</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">to stay home</p>
                        <p className="text-blue-200 text-sm">ficar em casa</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">at the beach</p>
                        <p className="text-blue-200 text-sm">na praia</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">in the countryside</p>
                        <p className="text-blue-200 text-sm">no campo / interior</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-700 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">💬 Useful Questions:</h6>
                      <div className="flex items-start mb-2">
                        <button 
                          onClick={() => playAudio("What day is it today")}
                          className="mr-2 text-blue-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-medium">What day is it today?</p>
                          <p className="text-blue-200 text-sm">Que dia é hoje?</p>
                          <p className="text-blue-300 text-xs">It's Wednesday. = É quarta-feira.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image for vocabulary */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src={calendarImage}
                    alt="Weekly calendar planning"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🗓️ Weekly Planning</p>
                    <p className="text-blue-200 text-xs">Organize your week with English vocabulary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson20")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (20)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson22")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (22) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}