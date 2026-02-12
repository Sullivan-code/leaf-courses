"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson25GettingAround() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showNegativeExplanation, setShowNegativeExplanation] = useState(false);
  const [showQuestionsExplanation, setShowQuestionsExplanation] = useState(false);

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

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const storeImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const travelImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const shoppingImage = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const passportImage = "https://images.unsplash.com/photo-1559131397-f94da358a2f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 25 data
  const verbs = [
    { english: "to buy", portuguese: "comprar" },
    { english: "to take", portuguese: "pegar, levar" }
  ];

  const newWords = [
    { english: "gift", portuguese: "presente" },
    { english: "souvenir", portuguese: "lembrança" },
    { english: "store", portuguese: "loja" },
    { english: "ticket", portuguese: "bilhete, passagem" },
    { english: "food", portuguese: "comida" },
    { english: "money", portuguese: "dinheiro" },
    { english: "price", portuguese: "preço" },
    { english: "medicine", portuguese: "remédio" },
    { english: "backpack", portuguese: "mochila" },
    { english: "passport", portuguese: "passaporte" },
    { english: "thing", portuguese: "coisa" },
    { english: "good / bad", portuguese: "bom / ruim" },
    { english: "cheap / expensive", portuguese: "barato / caro" },
    { english: "a lot of", portuguese: "muito(a)" }
  ];

  const usefulPhrases = [
    { english: "How much is it?", portuguese: "Quanto custa?" },
    { english: "It's $5.", portuguese: "Custa 5 dólares." },
    { english: "It's cheap.", portuguese: "Está barato." },
    { english: "It's expensive.", portuguese: "Está caro." }
  ];

  const grammarExamples = [
    { english: "Does she eat cheese?", portuguese: "Ela come queijo?" },
    { english: "Does he understand Spanish?", portuguese: "Ele entende espanhol?" },
    { english: "Where does he live?", portuguese: "Onde ele mora?" },
    { english: "When does she go to the gym?", portuguese: "Quando ela vai à academia?" }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I want to learn how to cook.", portuguese: "Eu quero aprender a cozinhar." },
    { english: "She wants to study English.", portuguese: "Ela quer estudar inglês." },
    { english: "He needs to work on Saturday.", portuguese: "Ele precisa trabalhar no sábado." },
    { english: "I don't want to go now.", portuguese: "Eu não quero ir agora." },
    { english: "She doesn't want to buy this.", portuguese: "Ela não quer comprar isso." },
    { english: "I don't understand.", portuguese: "Eu não entendo." },
    { english: "He doesn't speak French.", portuguese: "Ele não fala francês." },
    { english: "They don't have money.", portuguese: "Eles não têm dinheiro." },
    { english: "She doesn't work here.", portuguese: "Ela não trabalha aqui." },
    { english: "We don't need tickets.", portuguese: "Nós não precisamos de bilhetes." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            🛒 Lesson 25 - Getting Around
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to shop, travel, ask about prices, and talk about daily needs.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Shopping and getting around"
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('buy')}>buy</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I buy')}>I buy</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You buy')}>You buy</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We buy')}>We buy</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to buy')}>I want to buy</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to buy')}>need</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have to buy')}>have to</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you want to buy')}>What do you want to buy</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you need to buy')}>need</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you have to buy')}>have to</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('take')}>take</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I take')}>I take</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You take')}>You take</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They take')}>They take</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I take the bus')}>I take the bus</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I take a taxi')}>a taxi</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I take the train')}>the train</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you take the bus')}>Do you take the bus</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he take the bus')}>Does he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she take the bus')}>Does she</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you take the bus')}>When do you take the bus</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does he take the bus')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she take the bus')}>she</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not take the bus')}>I do not take the bus</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not take the bus')}>You</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not take the bus')}>They</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not take the bus')}>He does not take the bus</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not take the taxi')}>the taxi</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not take the train')}>the train</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to take a taxi')}>Do you want to take a taxi</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to take a bus')}>a bus</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to take the train')}>the train</span>.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
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
              {openDrills.vocabulary ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWords.map((word, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {word.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">{word.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to buy a gift')}>I want to buy a gift</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to buy a souvenir')}>a souvenir</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to buy food')}>food</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need medicine')}>I need medicine</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need money')}>money</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need a ticket')}>a ticket</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('This is good')}>This is good</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('This is bad')}>bad</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('This is cheap')}>cheap</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('This is expensive')}>expensive</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have a lot of things')}>I have a lot of things</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have a lot of money')}>money</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have a lot of food')}>food</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where is your passport')}>Where is your passport</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where is your backpack')}>backpack</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where is your ticket')}>ticket</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a lot of money')}>Do you have a lot of money</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a lot of things')}>things</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a lot of food')}>food</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to buy medicine at the store')}>I need to buy medicine at the store</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to buy food at the store')}>food</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to buy a gift at the store')}>a gift</span>.</p>
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
                Pratique frases comuns para fazer compras e perguntar preços
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-lg mb-2"
                  >
                    {phrase.english}
                  </button>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. Quanto custa? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('How much is it')}>How much is it</span>? / Quanto custa isso?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Custa 5 dólares. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is five dollars')}>It is five dollars</span>. / Custa 10 dólares. / Custa 20 dólares.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Está barato. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is cheap')}>It is cheap</span>. / Está muito barato.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Está caro. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is expensive')}>It is expensive</span>. / Está muito caro.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Quanto custa o bilhete? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('How much is the ticket')}>How much is the ticket</span>? / Quanto custa a passagem? / Quanto custa o presente?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. É barato? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is it cheap')}>Is it cheap</span>? / É caro? / É bom?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. Eu quero comprar isso. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to buy this')}>I want to buy this</span>. / Eu preciso comprar isso. / Eu tenho que comprar isso.</p>
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
                Perguntas com Do/Does no Simple Present
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
                <div key={index} className="p-3 bg-white rounded-lg">
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {example.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">{example.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you eat cheese')}>Do you eat cheese</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she eat cheese')}>Does she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he eat cheese')}>Does he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you understand Spanish')}>Do you understand Spanish</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he understand Spanish')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she understand Spanish')}>she</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where do you live')}>Where do you live</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where does he live')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Where does she live')}>she</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you go to the gym')}>When do you go to the gym</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does he go to the gym')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she go to the gym')}>she</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you speak English')}>Do you speak English</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she speak English')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he speak English')}>he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you want')}>What do you want</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does she want')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does he want')}>he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a passport')}>Do you have a passport</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she have a passport')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he have a passport')}>he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you need medicine')}>Do you need medicine</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she need medicine')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he need medicine')}>he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to buy this')}>Do you want to buy this</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she want to buy this')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he want to buy this')}>he</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a lot of money')}>Do you have a lot of money</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she have a lot of money')}>she</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he have a lot of money')}>he</span>.</p>
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
              Pratique situações reais de compras, viagens e necessidades diárias
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
                        src={storeImage}
                        alt="Shopping at store"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Shopping and asking prices
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={travelImage}
                        alt="Travel and tickets"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Travel and transportation
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={passportImage}
                        alt="Documents and passports"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Important documents
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out! (print style) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Afirmativo × Negativo contrastes com Do/Does
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Affirmative Sentences */}
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">AFFIRMATIVE SENTENCES</h3>
                  <button 
                    onClick={() => setShowNegativeExplanation(!showNegativeExplanation)}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNegativeExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showNegativeExplanation && (
                  <div className="mb-4 p-4 bg-green-700 rounded-lg border border-green-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">✅ Formas Afirmativas:</p>
                    <ul className="text-green-200 text-sm list-disc pl-4 space-y-1">
                      <li>I/You/We/They + verb (I buy, You eat, We want)</li>
                      <li>He/She/It + verb + s/es (He buys, She eats, He wants)</li>
                      <li>Para perguntas: Do/Does + sujeito + verb</li>
                      <li>Respostas curtas: Yes, I do. / No, I don't.</li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I buy food.</p>
                    <p className="text-green-200 text-sm">Eu compro comida.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">She buys food.</p>
                    <p className="text-green-200 text-sm">Ela compra comida.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">We have money.</p>
                    <p className="text-green-200 text-sm">Nós temos dinheiro.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">He has money.</p>
                    <p className="text-green-200 text-sm">Ele tem dinheiro.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">They want tickets.</p>
                    <p className="text-green-200 text-sm">Eles querem bilhetes.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">She wants a ticket.</p>
                    <p className="text-green-200 text-sm">Ela quer um bilhete.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I take the bus.</p>
                    <p className="text-green-200 text-sm">Eu pego o ônibus.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">He takes the bus.</p>
                    <p className="text-green-200 text-sm">Ele pega o ônibus.</p>
                  </div>
                </div>
              </div>

              {/* Image for affirmative */}
              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={shoppingImage}
                    alt="Shopping and buying"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🛍️ Positive Situations</p>
                    <p className="text-green-200 text-xs">Talking about what you have and want</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Negative Sentences and Questions */}
            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">NEGATIVE SENTENCES</h3>
                    <button 
                      onClick={() => setShowQuestionsExplanation(!showQuestionsExplanation)}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showQuestionsExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showQuestionsExplanation && (
                    <div className="mb-4 p-4 bg-red-700 rounded-lg border border-red-600">
                      <p className="text-yellow-200 text-sm font-medium mb-2">❌ Formas Negativas:</p>
                      <ul className="text-red-200 text-sm list-disc pl-4 space-y-1">
                        <li>I/You/We/They + don't (do not) + verb</li>
                        <li>He/She/It + doesn't (does not) + verb</li>
                        <li>O verbo fica na forma base (sem -s)</li>
                        <li>Contrações: do not = don't, does not = doesn't</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">I don't want to go.</p>
                      <p className="text-red-200 text-sm">Eu não quero ir.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">She doesn't want to buy this.</p>
                      <p className="text-red-200 text-sm">Ela não quer comprar isso.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">I don't understand.</p>
                      <p className="text-red-200 text-sm">Eu não entendo.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">He doesn't speak French.</p>
                      <p className="text-red-200 text-sm">Ele não fala francês.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">They don't have money.</p>
                      <p className="text-red-200 text-sm">Eles não têm dinheiro.</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">She doesn't work here.</p>
                      <p className="text-red-200 text-sm">Ela não trabalha aqui.</p>
                    </div>
                  </div>
                </div>
                
                {/* Questions Section */}
                <div className="pt-6 border-t border-red-600">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">QUESTIONS WITH DO/DOES</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio("Do you want to buy this")}
                          className="mr-2 text-red-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">Do you want to buy this?</p>
                          <p className="text-red-200 text-sm">Você quer comprar isso?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio("Does she need medicine")}
                          className="mr-2 text-red-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">Does she need medicine?</p>
                          <p className="text-red-200 text-sm">Ela precisa de remédio?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio("Do they have passports")}
                          className="mr-2 text-red-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">Do they have passports?</p>
                          <p className="text-red-200 text-sm">Eles têm passaportes?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio("Does he take the bus")}
                          className="mr-2 text-red-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-bold">Does he take the bus?</p>
                          <p className="text-red-200 text-sm">Ele pega o ônibus?</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Short Answers Practice */}
                <div className="mt-6 pt-6 border-t border-red-600">
                  <div className="p-4 bg-red-700 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">💬 SHORT ANSWERS</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Do you want this? - Yes, I do. / No, I don't.</p>
                        <p className="text-red-200 text-sm">Você quer isso? - Sim, quero. / Não, não quero.</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Does she need it? - Yes, she does. / No, she doesn't.</p>
                        <p className="text-red-200 text-sm">Ela precisa? - Sim, ela precisa. / Não, ela não precisa.</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Do they have money? - Yes, they do. / No, they don't.</p>
                        <p className="text-red-200 text-sm">Eles têm dinheiro? - Sim, eles têm. / Não, eles não têm.</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Does he understand? - Yes, he does. / No, he doesn't.</p>
                        <p className="text-red-200 text-sm">Ele entende? - Sim, ele entende. / Não, ele não entende.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-red-900 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">🎯 Mini Speaking Practice:</h6>
                      <div className="flex items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">Do you want to buy a souvenir?</span></p>
                          <p className="text-red-200 text-xs">Answer: Yes, I do. / No, I don't.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">Does she need a ticket?</span></p>
                          <p className="text-red-200 text-xs">Answer: Yes, she does. / No, she doesn't.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image for grammar */}
              <div className="mt-6 pt-6 border-t border-red-600">
                <div className="bg-red-700 rounded-lg overflow-hidden">
                  <img
                    src={grammarImage}
                    alt="Grammar practice"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">📚 Grammar Focus</p>
                    <p className="text-red-200 text-xs">Practice questions and negative forms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson24")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (24)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson26")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (26) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}