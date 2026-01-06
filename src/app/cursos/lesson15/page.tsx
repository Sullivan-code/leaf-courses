"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson15PersonalInfoRoutine() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showAssessment, setShowAssessment] = useState(false);

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
  const mainImage = "https://i.ibb.co/tTpRLxNr/l5-main.jpg";
  const readingImage = "https://i.ibb.co/N6P2sn5P/beef-and-fish.jpg";
  const placesImage = "https://i.ibb.co/5xwfgP0Y/drink-and-sandwich.jpg";

  // Lesson 15 data
  const verbs = [
    { english: "to read", portuguese: "ler" },
    { english: "to send", portuguese: "enviar" }
  ];

  const newWords = [
    { english: "coffee shop", portuguese: "café / cafeteria" },
    { english: "restaurant", portuguese: "restaurante" },
    { english: "mall", portuguese: "shopping" },
    { english: "the movies", portuguese: "cinema" },
    { english: "magazine", portuguese: "revista" },
    { english: "book", portuguese: "livro" },
    { english: "story", portuguese: "história" },
    { english: "e-mail", portuguese: "e-mail" },
    { english: "address", portuguese: "endereço" },
    { english: "password", portuguese: "senha" },
    { english: "message", portuguese: "mensagem" },
    { english: "online", portuguese: "online" },
    { english: "big", portuguese: "grande" },
    { english: "small", portuguese: "pequeno(a)" },
    { english: "the", portuguese: "o, a, os, as" }
  ];

  const usefulPhrases = [
    { english: "I read the news every day.", portuguese: "Eu leio as notícias todos os dias." },
    { english: "I read stories every day.", portuguese: "Eu leio histórias todos os dias." },
    { english: "I read my e-mails on my cell phone.", portuguese: "Eu leio meus e-mails no meu telefone celular." }
  ];

  const grammarExamples = [
    { english: "Do you want to go to the restaurant?", portuguese: "Você quer ir ao restaurante?" },
    { english: "Do you want to go to the movies with me?", portuguese: "Você quer ir ao cinema comigo?" },
    { english: "They like to go to the coffee shop in the evening.", portuguese: "Eles gostam de ir ao café à noite." },
    { english: "We don't want to go to the mall today.", portuguese: "Nós não queremos ir ao shopping hoje." },
    { english: "I send e-mails to my boss every day.", portuguese: "Eu envio e-mails para meu chefe todos os dias." },
    { english: "I need to send this message to my friend.", portuguese: "Eu preciso enviar essa mensagem para meu amigo." }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "Read books every day.", portuguese: "Leia livros todos os dias." },
    { english: "Do you read the news online?", portuguese: "Você lê notícias on-line?" },
    { english: "Do you read to your children every day?", portuguese: "Você lê para seus filhos todos os dias?" },
    { english: "Do you read your messages on your cell phone?", portuguese: "Você lê suas mensagens no seu telefone celular?" },
    { english: "We have a small car.", portuguese: "Nós temos um carro pequeno." },
    { english: "Do you have a new e-mail address?", portuguese: "Você tem um novo endereço de e-mail?" },
    { english: "We like to go to the movies.", portuguese: "Nós gostamos de ir ao cinema." },
    { english: "Do they prefer to go to the mall in the afternoon?", portuguese: "Eles preferem ir ao shopping à tarde?" },
    { english: "Do we have to send this message today?", portuguese: "Nós temos que enviar essa mensagem hoje?" },
    { english: "You have to send this book to this address.", portuguese: "Você tem que enviar este livro para este endereço." }
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
            📘 Lesson 15 - Personal Information & Routine
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about daily activities, reading habits, sending messages, and going to different places.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Daily activities and routine"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Assessment Section */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Assessment (2 minutes)</h2>
              <p className="mt-2 text-yellow-100 italic">
                Quick review questions to start the lesson
              </p>
            </div>
            <button 
              onClick={() => setShowAssessment(!showAssessment)}
              className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showAssessment ? 'Hide Questions' : 'Show Questions'}
            </button>
          </div>
          
          {showAssessment && (
            <div className="p-8 bg-yellow-50">
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">1. Give examples of some electronic gadgets you have.</h3>
                  <p className="text-gray-600">Example: I have a cell phone, a tablet, and a computer.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">2. What's the opposite of new?</h3>
                  <p className="text-gray-600">Answer: old</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">3. Give examples of nationalities.</h3>
                  <p className="text-gray-600">Example: American, British, Brazilian, Canadian, etc.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">4. What can you say to express surprise?</h3>
                  <p className="text-gray-600">Example: Really? / Wow! / That's amazing!</p>
                </div>
              </div>
            </div>
          )}
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
                  <p className="text-lg font-medium text-gray-800">1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read')}>read</span> / You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read')}>read</span> / He <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('reads')}>reads</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not read')}>do not read</span> / You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not read')}>do not read</span> / We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not read')}>do not read</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read at night')}>read at night</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read in the afternoon')}>in the afternoon</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read in the morning')}>in the morning</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read to my children')}>read to my children</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read to my teacher')}>my teacher</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read to my friends')}>my friends</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. We like to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read in English')}>read in English</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read in Spanish')}>Spanish</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read in Portuguese')}>Portuguese</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('like it a lot')}>like it a lot</span> / We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('like it')}>like it</span> / You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('like it')}>like it</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('send')}>Send</span> / I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('send')}>send</span> / You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('send')}>send</span> / They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('send')}>send</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not send')}>do not send</span> / You <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not send')}>do not send</span> / I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('do not send')}>do not send</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you send')}>What do you send</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you read')}>read</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you want to send')}>What do you want to send</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you want to read')}>read</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('what do you want to eat')}>eat</span>?</p>
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
                  <p className="text-lg font-medium text-gray-800">1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read the news')}>read the news</span> in the morning / We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read the news')}>read the news</span> / They <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read the news')}>read the news</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Do you like to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read magazines')}>read magazines</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read books')}>books</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read stories')}>stories</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read magazines online')}>read magazines online</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read books online')}>books online</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read news online')}>news online</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Where do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read your e-mails')}>read your e-mails</span>? at work / at home / at school.</p>
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
                  <p className="text-lg font-medium text-gray-800">1. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read e-mails every day')}>read e-mails every day</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read messages every day')}>messages</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read news every day')}>news</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read books on my tablet')}>read books on my tablet</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read stories on my tablet')}>stories</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read magazines on my tablet')}>magazines</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read my e-mails on my cell phone')}>read my e-mails on my cell phone</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read my e-mails on my tablet')}>on my tablet</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read my e-mails on my computer')}>on my computer</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Do you prefer to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read your e-mails at home')}>read your e-mails at home</span> or <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('read your e-mails at work')}>at work</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Is your friend <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('American')}>American</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('British')}>British</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Brazilian')}>Brazilian</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('eat bread with butter every day')}>eat bread with butter every day</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('eat bread with cheese every day')}>with cheese</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('eat bread with ham every day')}>with ham</span>.</p>
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
                Structures for asking about going to places and daily routines
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
                  <p className="text-lg font-medium text-gray-800">1. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the movies')}>go to the movies</span> with my children / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping')}>shopping</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the restaurant')}>restaurant</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the movies')}>go to the movies</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the coffee shop')}>coffee shop</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the restaurant')}>restaurant</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. We <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping in the afternoon')}>go shopping in the afternoon</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the movies in the afternoon')}>to the movies</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the coffee shop in the afternoon')}>to the coffee shop</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping with your husband')}>go shopping with your husband</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping with your wife')}>wife</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping with your family')}>family</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. Do you <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the restaurant alone')}>go to the restaurant alone</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the coffee shop alone')}>coffee shop</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the movies alone')}>movies</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go shopping every day')}>go shopping every day</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the coffee shop every day')}>to the coffee shop</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the restaurant every day')}>to the restaurant</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. I <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to school alone')}>go to school alone</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to work alone')}>to work</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to class alone')}>to class</span>.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. Do you want to <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the movies with me')}>go to the movies with me</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the restaurant with me')}>restaurant</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('go to the coffee shop with me')}>coffee shop</span>?</p>
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
              Practice reading and sending messages in everyday situations
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
                        src={readingImage}
                        alt="Reading books and magazines"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Reading books, magazines and stories
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={placesImage}
                        alt="Coffee shop, restaurant and mall"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Coffee shop, restaurant and mall
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
                Common phrases for technology and communication
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Phrases */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg mb-4 text-yellow-300">COMMON PHRASES</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("on my computer")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">on my computer</p>
                  </div>
                  <p className="text-blue-200 text-sm">no meu computador</p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("on your tablet")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">on your tablet</p>
                  </div>
                  <p className="text-blue-200 text-sm">no seu tablet</p>
                </div>
              </div>
            </div>

            {/* Right column - Email */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("What's your e-mail address")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">What's your e-mail address?</p>
                  </div>
                  <p className="text-blue-200 text-sm">Qual é o seu endereço de e-mail?</p>
                </div>
                
                <div className="pt-4 border-t border-blue-700">
                  <div className="flex items-center mb-2">
                    <button 
                      onClick={() => playAudio("It's elisasullivan at leaf dot com")}
                      className="mr-2 text-blue-200 hover:text-white transition-colors"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                    <p className="font-bold">It's elisasullivan@leaf.com</p>
                  </div>
                  <p className="text-blue-200 text-sm">É elisasullivan@leaf.com</p>
                  <div className="mt-4 p-3 bg-blue-900 rounded-lg">
                    <p className="text-yellow-300 font-mono">elisasullivan@leaf.com</p>
                    <p className="text-blue-200 text-sm mt-1">Format: name@domain.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (14)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (16) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}