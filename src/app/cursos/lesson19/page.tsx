"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson19LifestyleWeeklyPlanning() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showNumberExplanation, setShowNumberExplanation] = useState(false);
  const [showTimeFormatExplanation, setShowTimeFormatExplanation] = useState(false);
  const [showTellingTimeExplanation, setShowTellingTimeExplanation] = useState(false);

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

  // Image URLs (using Unsplash/Pexels for planning theme)
  const mainImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cookingImage = "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const cleaningImage = "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";

  // Lesson 19 data
  const verbs = [
    { english: "to cook", portuguese: "cozinhar" },
    { english: "to clean", portuguese: "limpar" }
  ];

  const newWords = [
    { english: "soup", portuguese: "sopa" },
    { english: "pasta", portuguese: "massa, macarrão" },
    { english: "sauce", portuguese: "molho" },
    { english: "bedroom", portuguese: "quarto" },
    { english: "bathroom", portuguese: "banheiro" },
    { english: "living room", portuguese: "sala de estar" },
    { english: "kitchen", portuguese: "cozinha" },
    { english: "table", portuguese: "mesa" },
    { english: "couch", portuguese: "sofá" },
    { english: "time", portuguese: "tempo, hora" },
    { english: "noon", portuguese: "meio-dia" },
    { english: "midnight", portuguese: "meia-noite" },
    { english: "until", portuguese: "até" },
    { english: "some", portuguese: "algum(a), alguns(as), um pouco" }
  ];

  const usefulPhrases = [
    { english: "What time is it?", portuguese: "Que horas são?" },
    { english: "It's two o'clock.", portuguese: "São duas horas." },
    { english: "I have lunch at noon.", portuguese: "Eu almoço ao meio-dia." },
    { english: "I do the dishes every day.", portuguese: "Eu lavo a louça todos os dias." },
    { english: "I need to do the laundry.", portuguese: "Eu preciso lavar roupa." }
  ];

  const grammarExamples = [
    { english: "What time do you go to bed?", portuguese: "A que horas você vai dormir?" },
    { english: "I go to bed at 10:00 p.m.", portuguese: "Eu vou dormir às 22:00." },
    { english: "What time do you get up?", portuguese: "A que horas você se levanta?" },
    { english: "I get up at 8:00 a.m.", portuguese: "Eu me levanto às 8:00." },
    { english: "They have class at seven o'clock.", portuguese: "Eles têm aula às sete horas." },
    { english: "We work until six o'clock.", portuguese: "Nós trabalhamos até as seis horas." }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I cook lunch for my family.", portuguese: "Eu cozinho o almoço para minha família." },
    { english: "Do you want some tomato sauce?", portuguese: "Você quer um pouco de molho de tomate?" },
    { english: "I like to sleep in the living room.", portuguese: "Eu gosto de dormir na sala de estar." },
    { english: "You don't have to do the laundry today.", portuguese: "Você não precisa lavar roupa hoje." },
    { english: "Do they study until noon?", portuguese: "Eles estudam até o meio-dia?" },
    { english: "I need to clean my bedroom today.", portuguese: "Eu preciso limpar meu quarto hoje." },
    { english: "I don't have time to clean the kitchen now.", portuguese: "Eu não tenho tempo para limpar a cozinha agora." },
    { english: "We have to sleep on the couch.", portuguese: "Nós temos que dormir no sofá." },
    { english: "What time do you go to work?", portuguese: "A que horas você vai trabalhar?" },
    { english: "I usually go to work at 7:00 a.m.", portuguese: "Eu geralmente vou trabalhar às 7:00 da manhã." }
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
            🕒 Lesson 19 - Lifestyle & Weekly Planning
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about daily routines, house chores, telling time, and weekly planning.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Weekly planning calendar"
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('cook')}>cook</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cook')}>I cook</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We cook')}>We cook</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They cook')}>They cook</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not cook at home')}>I do not cook at home</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not cook')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not cook')}>We</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you cook')}>Do you cook</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you cook')}>What do you cook</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you cook')}>When</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you like to cook')}>What do you like to cook</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you want to cook')}>want</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you prefer to cook')}>prefer</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cook for my wife')}>I cook for my wife</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cook for my mother')}>my mother</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cook for my children')}>my children</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I like to cook for you')}>I like to cook for you</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We like to cook for you')}>We</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They like to cook for you')}>They</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('clean')}>clean</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I clean')}>I clean</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We clean')}>We</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They clean')}>They</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not clean')}>I do not clean</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not clean')}>We</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not clean')}>They</span>.</p>
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I love to eat pasta for dinner')}>I love to eat pasta for dinner</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I love to eat chicken for dinner')}>chicken</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I love to eat fish for dinner')}>fish</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They want to cook pasta today')}>They want to cook pasta today</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They want to cook vegetables today')}>vegetables</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They want to cook beans today')}>beans</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want some sauce')}>Do you want some sauce</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want some coffee')}>coffee</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want some tea')}>tea</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu quero um pouco de sopa, por favor. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want some water please')}>I want some water, please</span>. / Eu quero um pouco de batatas fritas, por favor.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Eu tenho alguns amigos no Reino Unido. / Eu tenho alguns amigos nos Estados Unidos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have time to study')}>Do you have time to study</span>? / Você tem tempo para ir ao restaurante? / Você tem tempo para ir ao shopping?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Eu não quero limpar o banheiro agora. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not want to clean the kitchen now')}>I do not want to clean the kitchen now</span>. / Eu não quero limpar a mesa agora.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. Quando você limpa seu quarto? / Quando você limpa sua cozinha? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you clean your couch')}>When do you clean your couch</span>?</p>
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
                Pratique frases comuns para comunicação diária e dizer as horas
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time is it')}>What time is it</span>? / São três horas. / São cinco horas. / São nove horas.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is two o clock')}>It's two o'clock</span>. / É meio-dia. / É meia-noite.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Eu almoço com meus colegas de trabalho. / Eu almoço com meus amigos.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Eu janto em casa. / Eu janto no trabalho. / Eu janto no restaurante.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Você toma café da manhã sozinho?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do the dishes every day')}>I do the dishes every day</span>. / Eu lavo a louça de manhã. / Eu lavo a louça à noite.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Você precisa lavar roupa hoje? / Você precisa lavar roupa agora? / Você precisa lavar roupa à tarde?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. Eu não gosto de lavar louça. / E você? / Eles não gostam de lavar louça. / Nós não gostamos de lavar louça.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. Eu não quero lavar roupa agora. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not want to have lunch now')}>I do not want to have lunch now</span>. / Eu não quero jantar agora.</p>
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
                Estruturas para perguntar sobre rotinas diárias e horários
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time do you go to bed')}>What time do you go to bed</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. A que horas você toma banho? / A que horas você lê seus emails? / A que horas você estuda inglês?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. A que horas você quer ir ao shopping? / A que horas você quer ir ao restaurante? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time do you want to go to the hospital')}>What time do you want to go to the hospital</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I go to school at seven o clock')}>I go to school at seven o'clock</span>. / Eu vou para a escola às seis horas. / Eu vou para a escola às oito horas.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Eu não vou dormir às onze horas. / Eu não vou dormir às dez horas. / Eu não vou dormir à meia-noite.</p>
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
              Pratique rotinas diárias, tarefas domésticas e gerenciamento de tempo em situações cotidianas
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
                        src={cookingImage}
                        alt="Cooking and meal preparation"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cooking meals and preparing food
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={cleaningImage}
                        alt="Cleaning and house chores"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Cleaning and house maintenance
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
                Numbers, telling time, and daily routines
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Numbers and Time */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">NUMBERS</h3>
                  <button 
                    onClick={() => setShowNumberExplanation(!showNumberExplanation)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNumberExplanation ? 'Esconder Explicação' : 'Mostrar Explicação'}
                  </button>
                </div>
                {showNumberExplanation && (
                  <div className="mb-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">📚 Numbers Explanation:</p>
                    <p className="text-blue-200 text-sm mb-2">Numbers in English follow patterns:</p>
                    <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                      <li>30-39: thirty + one, two, three... (thirty-one, thirty-two)</li>
                      <li>40-49: forty + one, two, three... (forty-one, forty-two)</li>
                      <li>50-59: fifty + one, two, three... (fifty-one, fifty-two)</li>
                      <li>60-69: sixty + one, two, three... (sixty-one, sixty-two)</li>
                    </ul>
                    <p className="text-blue-200 text-sm mt-2">For time: Use "o'clock" only with exact hours: 3:00 = three o'clock</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-800 rounded-lg">
                  <p className="font-bold text-xl">30</p>
                  <p className="text-blue-200">thirty</p>
                </div>
                <div className="p-3 bg-blue-800 rounded-lg">
                  <p className="font-bold text-xl">40</p>
                  <p className="text-blue-200">forty</p>
                </div>
                <div className="p-3 bg-blue-800 rounded-lg">
                  <p className="font-bold text-xl">50</p>
                  <p className="text-blue-200">fifty</p>
                </div>
                <div className="p-3 bg-blue-800 rounded-lg">
                  <p className="font-bold text-xl">60</p>
                  <p className="text-blue-200">sixty</p>
                </div>
              </div>

              {/* Telling Time Section */}
              <div className="mt-8 pt-6 border-t border-blue-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg text-yellow-300">TELLING TIME</h4>
                  <button 
                    onClick={() => setShowTellingTimeExplanation(!showTellingTimeExplanation)}
                    className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showTellingTimeExplanation ? 'Esconder Explicação' : 'Mostrar Explicação'}
                  </button>
                </div>
                
                {showTellingTimeExplanation && (
                  <div className="mb-4 p-4 bg-blue-800 rounded-lg border border-blue-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">⏰ Telling Time Rules:</p>
                    <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                      <li>4:00 = "four o'clock" (exact hour)</li>
                      <li>4:15 = "four fifteen" or "quarter past four"</li>
                      <li>4:30 = "four thirty" or "half past four"</li>
                      <li>4:45 = "four forty-five" or "quarter to five"</li>
                      <li>4:50 = "four fifty" or "ten to five"</li>
                    </ul>
                    <p className="text-blue-200 text-sm mt-2">Use "past" for minutes 1-30, "to" for minutes 31-59</p>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="flex items-center mb-2">
                      <button 
                        onClick={() => playAudio("four o clock")}
                        className="mr-2 text-blue-200 hover:text-white transition-colors"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div>
                        <p className="font-bold">4:00</p>
                        <p className="text-blue-200 text-sm">It's four o'clock</p>
                      </div>
                    </div>
                  </div>
                  
                  {showTellingTimeExplanation && (
                    <>
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <button 
                            onClick={() => playAudio("four fifteen")}
                            className="mr-2 text-blue-200 hover:text-white transition-colors"
                            aria-label="Play audio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <div>
                            <p className="font-bold">4:15</p>
                            <p className="text-blue-200 text-sm">It's four fifteen</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <button 
                            onClick={() => playAudio("four thirty")}
                            className="mr-2 text-blue-200 hover:text-white transition-colors"
                            aria-label="Play audio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <div>
                            <p className="font-bold">4:30</p>
                            <p className="text-blue-200 text-sm">It's four thirty</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <button 
                            onClick={() => playAudio("four fifty")}
                            className="mr-2 text-blue-200 hover:text-white transition-colors"
                            aria-label="Play audio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <div>
                            <p className="font-bold">4:50</p>
                            <p className="text-blue-200 text-sm">It's four fifty</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-800 rounded-lg">
                        <div className="flex items-center mb-2">
                          <button 
                            onClick={() => playAudio("ten to five")}
                            className="mr-2 text-blue-200 hover:text-white transition-colors"
                            aria-label="Play audio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                          <div>
                            <p className="font-bold">4:50</p>
                            <p className="text-blue-200 text-sm">It's ten to five</p>
                            <p className="text-blue-300 text-xs">(forma alternativa)</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right column - AM/PM and Meal Times */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">TIME FORMATS</h3>
                    <button 
                      onClick={() => setShowTimeFormatExplanation(!showTimeFormatExplanation)}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showTimeFormatExplanation ? 'Esconder Explicação' : 'Mostrar Explicação'}
                    </button>
                  </div>
                  {showTimeFormatExplanation && (
                    <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-700">
                      <p className="text-yellow-200 text-sm font-medium mb-2">🕐 Time Formats Explained:</p>
                      <p className="text-blue-200 text-sm mb-2">12-hour format uses AM/PM:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                        <li>AM = Ante Meridiem (before noon) = 00:00 - 11:59</li>
                        <li>PM = Post Meridiem (after noon) = 12:00 - 23:59</li>
                      </ul>
                      <p className="text-blue-200 text-sm mt-2">Examples:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4">
                        <li>8:00 AM = oito da manhã</li>
                        <li>3:00 PM = três da tarde</li>
                        <li>9:00 PM = nove da noite</li>
                      </ul>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-xl">A.M.</p>
                      <p className="text-blue-200 text-sm">00:00 – 11:59</p>
                      <p className="text-blue-300 text-xs">manhã</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-xl">P.M.</p>
                      <p className="text-blue-200 text-sm">12:00 – 23:59</p>
                      <p className="text-blue-300 text-xs">tarde/noite</p>
                    </div>
                  </div>
                </div>
                
                {/* Meal Times Section */}
                <div className="pt-6 border-t border-blue-700">
                  <div className="flex items-center mb-3">
                    <h4 className="font-bold text-lg text-yellow-300">MEAL TIMES</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <button 
                          onClick={() => playAudio("to have breakfast")}
                          className="mr-2 text-blue-200 hover:text-white transition-colors"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">to have breakfast</p>
                          <p className="text-blue-200 text-sm">tomar café da manhã</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <button 
                          onClick={() => playAudio("to have dinner")}
                          className="mr-2 text-blue-200 hover:text-white transition-colors"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">to have dinner</p>
                          <p className="text-blue-200 text-sm">jantar</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <button 
                          onClick={() => playAudio("to have lunch")}
                          className="mr-2 text-blue-200 hover:text-white transition-colors"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">to have lunch</p>
                          <p className="text-blue-200 text-sm">almoçar</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-700 rounded-lg border border-blue-600">
                      <h5 className="font-bold text-yellow-200 mb-3">📋 Horários das Refeições</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Café da manhã</span>
                          <span className="text-blue-200 text-sm">6:00 - 9:00 a.m.</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Almoço</span>
                          <span className="text-blue-200 text-sm">11:30 - 1:30 p.m.</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-800 rounded">
                          <span className="font-medium">Jantar</span>
                          <span className="text-blue-200 text-sm">6:00 - 9:00 p.m.</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-blue-900 rounded-md">
                        <p className="text-yellow-100 text-sm font-medium">💡 Lembre-se:</p>
                        <p className="text-blue-200 text-sm">Em inglês, usamos "have" com refeições:</p>
                        <p className="text-blue-200 text-sm">• <span className="cursor-pointer hover:text-blue-100" onClick={() => playAudio("I have breakfast at 7 a.m.")}>I have breakfast at 7 a.m.</span></p>
                        <p className="text-blue-200 text-sm">• We have lunch at noon.</p>
                        <p className="text-blue-200 text-sm">• They have dinner at 8 p.m.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson18")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (18)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson20")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (20) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}