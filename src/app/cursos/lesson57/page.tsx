"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson57() {
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
  const mainImage = "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const verbsImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const vocabularyImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const phrasesImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 57 data
  const verbs = [
    { english: "to spend", portuguese: "gastar / passar (tempo, dinheiro)" },
    { english: "to travel", portuguese: "viajar" }
  ];

  const newWords = [
    { english: "destination", portuguese: "destino" },
    { english: "tourist", portuguese: "turista" },
    { english: "passenger", portuguese: "passageiro" },
    { english: "suitcase", portuguese: "mala" },
    { english: "luggage", portuguese: "bagagem" },
    { english: "travel agent", portuguese: "agente de viagem" },
    { english: "package", portuguese: "pacote" },
    { english: "resort", portuguese: "resort" },
    { english: "attraction", portuguese: "atração" },
    { english: "airport", portuguese: "aeroporto" },
    { english: "plane", portuguese: "avião" },
    { english: "leisure", portuguese: "lazer" },
    { english: "safe", portuguese: "seguro" }
  ];

  const usefulPhrases = [
    { english: "Where's the baggage claim?", portuguese: "Onde é a retirada de bagagem?" },
    { english: "I want to go on a cruise.", portuguese: "Eu quero fazer um cruzeiro." },
    { english: "I love sightseeing.", portuguese: "Eu amo fazer turismo." },
    { english: "I want to take a lot of pictures.", portuguese: "Eu quero tirar muitas fotos." },
    { english: "Can you call the travel agent?", portuguese: "Você pode ligar para o agente de viagem?" },
    { english: "Can she travel by plane alone?", portuguese: "Ela pode viajar de avião sozinha?" },
    { english: "Can we go on this tour?", portuguese: "Nós podemos ir nessa excursão?" },
    { english: "How much can we spend?", portuguese: "Quanto podemos gastar?" }
  ];

  const grammarExamples = [
    { english: "I want to travel next year.", portuguese: "Eu quero viajar no próximo ano" },
    { english: "She has visited many countries.", portuguese: "Ela tem visitado muitos países" },
    { english: "We are going to spend our vacation at the beach.", portuguese: "Nós vamos passar nossas férias na praia" },
    { english: "I ain't going to travel this month.", portuguese: "Eu não vou viajar este mês" },
    { english: "You should plan your trip earlier.", portuguese: "Você deveria planejar sua viagem antes" },
    { english: "We could visit that attraction tomorrow.", portuguese: "Nós poderíamos visitar aquela atração amanhã" },
    { english: "He has already booked the hotel.", portuguese: "Ele já reservou o hotel" },
    { english: "They are going to take a lot of pictures.", portuguese: "Eles vão tirar muitas fotos" }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "He loves to spend time with his children.", portuguese: "Ele ama passar tempo com os filhos" },
    { english: "She spends her money traveling.", portuguese: "Ela gasta o dinheiro viajando" },
    { english: "He wants to travel to a lot of countries.", portuguese: "Ele quer viajar para muitos países" },
    { english: "We prefer to travel by plane.", portuguese: "Nós preferimos viajar de avião" },
    { english: "Can we travel together?", portuguese: "Nós podemos viajar juntos?" },
    { english: "Can we go sightseeing today?", portuguese: "Nós podemos fazer turismo hoje?" },
    { english: "When can you buy the package?", portuguese: "Quando você pode comprar o pacote?" },
    { english: "How many tourists can you take with you?", portuguese: "Quantos turistas você pode levar?" },
    { english: "What time can we go home?", portuguese: "Que horas podemos ir para casa?" }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            ✈️ Lesson 57 - Hobbies & Traveling
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about traveling, spending time, and making plans for your next adventure.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Traveling and hobbies"
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He spends time at the beach')}>He spends time at the beach</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He spends time in the countryside')}>in the countryside</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He spends time in the city')}>in the city</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele passa tempo na praia. / no campo / na cidade</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are spending a lot of money')}>We are spending a lot of money</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are spending a lot of money')}>They</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am spending a lot of money')}>I</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós estamos gastando muito dinheiro. / Eles / Eu</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are traveling by car')}>We are traveling by car</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are traveling by motorcycle')}>by motorcycle</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are traveling by bus')}>by bus</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós estamos viajando de carro. / de moto / de ônibus</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I can travel today')}>I can travel today</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cannot travel today')}>I cannot travel today</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I can travel tomorrow')}>I can travel tomorrow</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu posso viajar hoje. / não posso / amanhã</p>
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
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to change our destination')}>I want to change our destination</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to change the tour')}>the tour</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to change the ticket')}>the ticket</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu quero mudar nosso destino. / excursão / passagem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You cannot put your luggage here')}>You cannot put your luggage here</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You cannot put your suitcase here')}>suitcase</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You cannot put your bag here')}>bag</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você não pode pôr sua bagagem aqui. / mala / bolsa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I always travel on business')}>I always travel on business</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I always travel for leisure')}>for leisure.</span></p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu sempre viajo a trabalho. / a lazer</p>
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
                Pratique frases comuns para falar sobre viagens e lazer
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
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meet me at the bus station')}>Meet me at the bus station</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meet me at the airport')}>at the airport</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meet me at the baggage claim')}>at the baggage claim</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Me encontre na estação de ônibus. / no aeroporto / na esteira</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He loves taking pictures')}>He loves taking pictures</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He loves sightseeing')}>sightseeing</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He loves traveling by plane')}>traveling by plane</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele adora tirar fotos. / visitar os pontos turísticos / viajar de avião</p>
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
                Modal Verbs: Can, Could, Should, Going to, Present Perfect
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
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can you go shopping today')}>Can you go shopping today</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can you go shopping tomorrow')}>tomorrow</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can you go shopping on the weekend')}>on the weekend</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você pode fazer compras hoje? / amanhã / no fim de semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we take pictures at the museum')}>Can we take pictures at the museum</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we take pictures on the plane')}>on the plane</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we take pictures in this place')}>in this place</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós podemos tirar fotos no museu? / no avião / neste lugar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we change the ticket')}>Can we change the ticket</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we change the tour')}>the tour</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can we change our destination')}>our destination</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós conseguimos mudar a passagem? / a excursão / nosso destino</p>
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
              Pratique situações reais sobre hobbies, viagens e planejamento
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
                        src={verbsImage}
                        alt="Travel and leisure"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Spending time and traveling
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={phrasesImage}
                        alt="Sightseeing and tours"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Asking about tours and destinations
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={grammarImage}
                        alt="Travel planning"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Making travel plans and arrangements
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
                Travel Expressions & Question Patterns
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Travel Expressions */}
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">TRAVEL EXPRESSIONS</h3>
                  <button 
                    onClick={() => setShowNegativeExplanation(!showNegativeExplanation)}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNegativeExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showNegativeExplanation && (
                  <div className="mb-4 p-4 bg-green-700 rounded-lg border border-green-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">✈️ Expressões de Viagem:</p>
                    <ul className="text-green-200 text-sm list-disc pl-4 space-y-1">
                      <li>to travel for leisure = viajar a lazer</li>
                      <li>to travel on business = viajar a trabalho</li>
                      <li>to go on a cruise = fazer um cruzeiro</li>
                      <li>to take a lot of pictures = tirar muitas fotos</li>
                      <li>baggage claim = retirada de bagagem</li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">to travel for leisure</p>
                    <p className="text-green-200 text-sm">viajar a lazer</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">to travel on business</p>
                    <p className="text-green-200 text-sm">viajar a trabalho</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">Where do you come from?</p>
                    <p className="text-green-200 text-sm">De onde você é?</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I come from the U.K.</p>
                    <p className="text-green-200 text-sm">Eu sou do Reino Unido.</p>
                  </div>
                </div>
              </div>

              {/* Image for travel expressions */}
              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={vocabularyImage}
                    alt="Travel destinations"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🌍 Travel Vocabulary</p>
                    <p className="text-green-200 text-xs">destination, tourist, airport, plane</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Question Patterns */}
            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">TRAVEL QUESTIONS</h3>
                    <button 
                      onClick={() => setShowQuestionsExplanation(!showQuestionsExplanation)}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showQuestionsExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showQuestionsExplanation && (
                    <div className="mb-4 p-4 bg-red-700 rounded-lg border border-red-600">
                      <p className="text-yellow-200 text-sm font-medium mb-2">❓ Perguntas sobre Viagem:</p>
                      <ul className="text-red-200 text-sm list-disc pl-4 space-y-1">
                        <li>Where's the baggage claim? = Onde fica a retirada de bagagem?</li>
                        <li>Can we go on this tour? = Podemos ir nessa excursão?</li>
                        <li>How much can we spend? = Quanto podemos gastar?</li>
                        <li>Can you call the travel agent? = Você pode ligar para o agente?</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">Where's the baggage claim?</p>
                      <p className="text-red-200 text-sm">Onde é a retirada de bagagem?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">Can we go on this tour?</p>
                      <p className="text-red-200 text-sm">Nós podemos ir nessa excursão?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">How much can we spend?</p>
                      <p className="text-red-200 text-sm">Quanto podemos gastar?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">Can you call the travel agent?</p>
                      <p className="text-red-200 text-sm">Você pode ligar para o agente de viagem?</p>
                    </div>
                  </div>
                </div>
                
                {/* Travel Agent Expressions */}
                <div className="pt-6 border-t border-red-600">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">TRAVEL AGENT EXPRESSIONS</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">to book a hotel</p>
                      <p className="text-red-200 text-sm">reservar um hotel</p>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">to buy a package</p>
                      <p className="text-red-200 text-sm">comprar um pacote</p>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">to plan a trip</p>
                      <p className="text-red-200 text-sm">planejar uma viagem</p>
                    </div>
                  </div>
                </div>
                
                {/* Mini Dialogue */}
                <div className="mt-6 pt-6 border-t border-red-600">
                  <div className="p-4 bg-red-700 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">💬 AT THE AIRPORT</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Where is the baggage claim?</p>
                        <p className="text-red-200 text-sm">Onde fica a retirada de bagagem?</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">It's on the first floor.</p>
                        <p className="text-red-200 text-sm">Fica no primeiro andar.</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-red-900 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">🎯 Mini Speaking Practice:</h6>
                      <div className="flex items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">Where do you want to travel?</span></p>
                          <p className="text-red-200 text-xs">Answer: I want to travel to Paris.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">Can we go sightseeing today?</span></p>
                          <p className="text-red-200 text-xs">Answer: Yes, we can. / No, we can't.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Activity - Speaking */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL ACTIVITY - SPEAKING</h2>
            <p className="mt-2 text-blue-100 italic">
              Responda em inglês:
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-8">
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 1. Where do you want to travel next year?</p>
                  <p className="text-gray-600 mt-2">I want to travel to _______.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 2. Do you prefer to travel by plane or by car?</p>
                  <p className="text-gray-600 mt-2">I prefer to travel by _______.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 3. What do you like to do on vacation?</p>
                  <p className="text-gray-600 mt-2">I like to _______.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 4. Do you want to go on a cruise?</p>
                  <p className="text-gray-600 mt-2">Yes, I do. / No, I don't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 5. Is this place safe at night?</p>
                  <p className="text-gray-600 mt-2">Yes, it is. / No, it isn't.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson56")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (56)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson58")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (58) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}