"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'travel' | 'culture';

export default function WorldCup2026() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    travel: false,
    culture: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    console.log(`🔊 Reproduzindo áudio para: "${text}"`);
    
    const audioEvent = new CustomEvent('playAudio', { 
      detail: { text, timestamp: Date.now() }
    });
    window.dispatchEvent(audioEvent);
    
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('samantha') ||
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('zira')
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log('Áudio será reproduzido pelo sistema externo');
    }
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-green-100 via-yellow-100 to-green-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-green-300/50">
        
        {/* Título */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-4">
            ⚽ World Cup 2026
          </h1>
          <p className="text-2xl text-gray-700 mb-2">
            USA • Canada • Mexico
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Learn English through the beautiful game! 🌎🏆
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://images.pexels.com/photos/47730/ball-soccer-ball-soccer-football-47730.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="World Cup Soccer Ball"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Vocabulário de Futebol */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">⚽ Basic Football Vocabulary</h2>
              <p className="mt-2 text-green-100 italic">
                Click on each word to hear the pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button onClick={() => playAudio('goal')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  goal
                </button> = gol
              </li>
              <li>
                <button onClick={() => playAudio('draw')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  draw
                </button> = empate
              </li>
              <li>
                <button onClick={() => playAudio('striker')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  striker
                </button> = atacante
              </li>
              <li>
                <button onClick={() => playAudio('goalkeeper')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  goalkeeper
                </button> = goleiro
              </li>
              <li>
                <button onClick={() => playAudio('midfielder')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  midfielder
                </button> = meio-campista
              </li>
              <li>
                <button onClick={() => playAudio('defender')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  defender
                </button> = zagueiro/defensor
              </li>
              <li>
                <button onClick={() => playAudio('penalty')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  penalty
                </button> = pênalti
              </li>
              <li>
                <button onClick={() => playAudio('corner kick')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  corner kick
                </button> = escanteio
              </li>
              <li>
                <button onClick={() => playAudio('free kick')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  free kick
                </button> = falta / tiro livre
              </li>
              <li>
                <button onClick={() => playAudio('offside')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  offside
                </button> = impedimento
              </li>
              <li>
                <button onClick={() => playAudio('referee')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  referee
                </button> = árbitro
              </li>
              <li>
                <button onClick={() => playAudio('yellow card')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  yellow card
                </button> = cartão amarelo
              </li>
              <li>
                <button onClick={() => playAudio('red card')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  red card
                </button> = cartão vermelho
              </li>
              <li>
                <button onClick={() => playAudio('extra time')} className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors">
                  extra time
                </button> = prorrogação
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('striker')} className="text-green-600 font-bold hover:text-green-800 transition-colors">striker</button> scored a <button onClick={() => playAudio('goal')} className="text-green-600 font-bold hover:text-green-800 transition-colors">goal</button>!
                  </p>
                  <p className="text-sm text-gray-500">O atacante marcou um gol!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('goalkeeper')} className="text-green-600 font-bold hover:text-green-800 transition-colors">goalkeeper</button> saved a <button onClick={() => playAudio('penalty')} className="text-green-600 font-bold hover:text-green-800 transition-colors">penalty</button>.
                  </p>
                  <p className="text-sm text-gray-500">O goleiro defendeu um pênalti.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The match ended in a <button onClick={() => playAudio('draw')} className="text-green-600 font-bold hover:text-green-800 transition-colors">draw</button>.
                  </p>
                  <p className="text-sm text-gray-500">A partida terminou em empate.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Posições dos Jogadores e Dribles */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">👟 Player Positions & Skills</h2>
              <p className="mt-2 text-green-100 italic">
                Learn about positions, skills, and what women appreciate in players
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-xl text-green-700 mb-3">Positions</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <button onClick={() => playAudio('Goalkeeper')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Goalkeeper
                    </button> - protects the goal
                  </li>
                  <li>
                    <button onClick={() => playAudio('Defender')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Defender
                    </button> - stops the opponents
                  </li>
                  <li>
                    <button onClick={() => playAudio('Midfielder')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Midfielder
                    </button> - connects defense and attack
                  </li>
                  <li>
                    <button onClick={() => playAudio('Striker')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Striker
                    </button> - scores goals
                  </li>
                  <li>
                    <button onClick={() => playAudio('Winger')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Winger
                    </button> - plays on the sides
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-xl text-green-700 mb-3">Dribbles & Skills</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>
                    <button onClick={() => playAudio('dribble')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      dribble
                    </button> - run with the ball
                  </li>
                  <li>
                    <button onClick={() => playAudio('nutmeg')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      nutmeg
                    </button> - pass between opponent's legs
                  </li>
                  <li>
                    <button onClick={() => playAudio('bicycle kick')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      bicycle kick
                    </button> - overhead kick
                  </li>
                  <li>
                    <button onClick={() => playAudio('flick')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      flick
                    </button> - quick touch to pass
                  </li>
                  <li>
                    <button onClick={() => playAudio('step over')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      step over
                    </button> - fake move
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="font-bold text-lg text-gray-700">
                ❤️ What women appreciate in players:
              </h4>
              <ul className="list-disc pl-6 text-gray-600 mt-2">
                <li>
                  <button onClick={() => playAudio('teamwork')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                    teamwork
                  </button> - working well with others
                </li>
                <li>
                  <button onClick={() => playAudio('sportsmanship')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                    sportsmanship
                  </button> - respecting opponents
                </li>
                <li>
                  <button onClick={() => playAudio('passion')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                    passion
                  </button> - loving the game
                </li>
                <li>
                  <button onClick={() => playAudio('humility')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                    humility
                  </button> - being humble after winning
                </li>
              </ul>
            </div>

            {openDrills.verbs && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('midfielder')} className="text-green-600 font-bold hover:text-green-800 transition-colors">midfielder</button> <button onClick={() => playAudio('dribbled')} className="text-green-600 font-bold hover:text-green-800 transition-colors">dribbled</button> past three defenders!
                  </p>
                  <p className="text-sm text-gray-500">O meio-campista driblou três defensores!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('scored')} className="text-green-600 font-bold hover:text-green-800 transition-colors">scored</button> an amazing <button onClick={() => playAudio('bicycle kick')} className="text-green-600 font-bold hover:text-green-800 transition-colors">bicycle kick</button> goal!
                  </p>
                  <p className="text-sm text-gray-500">Ela marcou um gol incrível de bicicleta!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    He showed great <button onClick={() => playAudio('sportsmanship')} className="text-green-600 font-bold hover:text-green-800 transition-colors">sportsmanship</button> after the match.
                  </p>
                  <p className="text-sm text-gray-500">Ele mostrou grande espírito esportivo após a partida.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Viagem e Hospedagem */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✈️ Travel & Accommodation</h2>
              <p className="mt-2 text-green-100 italic">
                Plan your World Cup trip to USA, Canada, or Mexico!
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('travel')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.travel ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-red-600">🇺🇸 USA</h4>
                <p className="text-sm text-gray-600">New York, LA, Miami</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-blue-600">🇨🇦 Canada</h4>
                <p className="text-sm text-gray-600">Toronto, Vancouver, Montreal</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-green-600">🇲🇽 Mexico</h4>
                <p className="text-sm text-gray-600">Mexico City, Guadalajara, Monterrey</p>
              </div>
            </div>

            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button onClick={() => playAudio('book a flight')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  book a flight
                </button> = reservar um voo
              </li>
              <li>
                <button onClick={() => playAudio('reserve a hotel')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  reserve a hotel
                </button> = reservar um hotel
              </li>
              <li>
                <button onClick={() => playAudio('buy match tickets')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  buy match tickets
                </button> = comprar ingressos
              </li>
              <li>
                <button onClick={() => playAudio('rent a car')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  rent a car
                </button> = alugar um carro
              </li>
              <li>
                <button onClick={() => playAudio('pack your suitcase')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  pack your suitcase
                </button> = fazer a mala
              </li>
            </ul>

            {openDrills.travel && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('booked a flight')} className="text-green-600 font-bold hover:text-green-800 transition-colors">booked a flight</button> to Los Angeles for the World Cup.
                  </p>
                  <p className="text-sm text-gray-500">Reservei um voo para Los Angeles para a Copa.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('reserved a hotel')} className="text-green-600 font-bold hover:text-green-800 transition-colors">reserved a hotel</button> near the stadium.
                  </p>
                  <p className="text-sm text-gray-500">Reservamos um hotel perto do estádio.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you buy match tickets?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Did you buy match tickets?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">Você comprou ingressos para a partida?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Comidas Típicas e Encontro Cultural */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🍕 Food & Cultural Exchange</h2>
              <p className="mt-2 text-green-100 italic">
                Try local foods and meet people from different countries!
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('culture')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.culture ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-red-600">🇺🇸 American</h4>
                <p className="text-sm">🍔 Burger, 🍕 Pizza, 🌭 Hot Dog</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-blue-600">🇨🇦 Canadian</h4>
                <p className="text-sm">🍁 Poutine, 🥓 Bacon, 🍁 Maple Syrup</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <h4 className="font-bold text-green-600">🇲🇽 Mexican</h4>
                <p className="text-sm">🌮 Tacos, 🌯 Burrito, 🥑 Guacamole</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6">
              <h4 className="font-bold text-lg text-gray-700">
                🌎 Cultural Exchange - A1 to B1 Level
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="font-bold text-sm text-gray-600">A1 - Beginner</p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('Hello! I am from Brazil.')} className="text-green-600 hover:text-green-800 transition-colors">
                      Hello! I am from Brazil.
                    </button>
                  </p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('I like tacos.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I like tacos.
                    </button>
                  </p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('Do you like soccer?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Do you like soccer?
                    </button>
                  </p>
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-600">B1 - Intermediate</p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('I came to watch the World Cup matches.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I came to watch the World Cup matches.
                    </button>
                  </p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('The Mexican food is delicious!')} className="text-green-600 hover:text-green-800 transition-colors">
                      The Mexican food is delicious!
                    </button>
                  </p>
                  <p className="text-gray-600">
                    <button onClick={() => playAudio('Which team are you supporting?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Which team are you supporting?
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {openDrills.culture && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('tried poutine')} className="text-green-600 font-bold hover:text-green-800 transition-colors">tried poutine</button> in Canada. It's amazing!
                  </p>
                  <p className="text-sm text-gray-500">Eu experimentei poutine no Canadá. É incrível!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('met fans')} className="text-green-600 font-bold hover:text-green-800 transition-colors">met fans</button> from all over the world.
                  </p>
                  <p className="text-sm text-gray-500">Conhecemos fãs de todo o mundo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you try the tacos in Mexico?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Did you try the tacos in Mexico?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500">Você experimentou os tacos no México?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Gramática com foco em empates e perguntas */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📚 Grammar - Draws & Questions</h2>
              <p className="mt-2 text-green-100 italic">
                Talk about draws, results, and ask about matches
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="font-bold text-green-700">Talking about Draws (Empate)</p>
              <p>
                <button onClick={() => playAudio('The match ended in a draw.')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  The match ended in a draw.
                </button> = A partida terminou em empate.
              </p>
              <p>
                <button onClick={() => playAudio('It was a draw.')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  It was a draw.
                </button> = Foi um empate.
              </p>
              <p>
                <button onClick={() => playAudio('Brazil drew with Argentina.')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  Brazil drew with Argentina.
                </button> = Brasil empatou com Argentina.
              </p>
              <p className="font-bold text-green-700 mt-4">Questions about matches</p>
              <p>
                <button onClick={() => playAudio('Did you watch the game?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  Did you watch the game?
                </button> = Você assistiu ao jogo?
              </p>
              <p>
                <button onClick={() => playAudio('Who scored the goal?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  Who scored the goal?
                </button> = Quem marcou o gol?
              </p>
              <p>
                <button onClick={() => playAudio('What was the final score?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  What was the final score?
                </button> = Qual foi o placar final?
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The match <button onClick={() => playAudio('ended in a draw')} className="text-green-600 font-bold hover:text-green-800 transition-colors">ended in a draw</button>.
                  </p>
                  <p className="text-sm text-gray-500">A partida terminou em empate.</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did the match end in a draw?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did the match end in a draw?
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you watch')} className="text-green-600 font-bold hover:text-green-800 transition-colors">Did you watch</button> the final match?
                  </p>
                  <p className="text-sm text-gray-500">Você assistiu à partida final?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio("No, I didn't watch it.")} className="text-green-600 hover:text-green-800 transition-colors">
                      No, I didn't watch it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The final <button onClick={() => playAudio('was a draw')} className="text-green-600 font-bold hover:text-green-800 transition-colors">was a draw</button>.
                  </p>
                  <p className="text-sm text-gray-500">A final foi um empate.</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the final a draw?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the final a draw?
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 6 - Celebrações e Torcida Brasileira */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🎉 Celebrations & Brazilian Fans</h2>
            <p className="mt-2 text-green-100 italic">
              How different countries celebrate victories
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-lg text-gray-700">🌎 How countries celebrate:</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                  <li>
                    <button onClick={() => playAudio('Brazil - samba dancing')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      🇧🇷 Brazil - samba dancing
                    </button>
                  </li>
                  <li>
                    <button onClick={() => playAudio('Argentina - waving flags')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      🇦🇷 Argentina - waving flags
                    </button>
                  </li>
                  <li>
                    <button onClick={() => playAudio('Mexico - shouting and music')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      🇲🇽 Mexico - shouting and music
                    </button>
                  </li>
                  <li>
                    <button onClick={() => playAudio('USA - parades')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      🇺🇸 USA - parades
                    </button>
                  </li>
                  <li>
                    <button onClick={() => playAudio('Canada - fireworks')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      🇨🇦 Canada - fireworks
                    </button>
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-lg text-gray-700">🇧🇷 Brazilian Fans</h4>
                <ul className="list-disc pl-6 text-gray-600 space-y-2 mt-2">
                  <li>
                    <button onClick={() => playAudio('Cheer loudly')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Cheer loudly
                    </button> - torcer alto
                  </li>
                  <li>
                    <button onClick={() => playAudio('Wear yellow and green')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Wear yellow and green
                    </button> - vestir amarelo e verde
                  </li>
                  <li>
                    <button onClick={() => playAudio('Sing the national anthem')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Sing the national anthem
                    </button> - cantar o hino
                  </li>
                  <li>
                    <button onClick={() => playAudio('Do the wave')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Do the wave
                    </button> - fazer a "ola"
                  </li>
                  <li>
                    <button onClick={() => playAudio('Celebrate with fireworks')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Celebrate with fireworks
                    </button> - comemorar com fogos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 7 - Jerseys & Clothing */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">👕 Jerseys & Clothing</h2>
            <p className="mt-2 text-green-100 italic">
              What to wear to the matches
            </p>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 grid grid-cols-1 md:grid-cols-2 gap-2">
              <li>
                <button onClick={() => playAudio('jersey')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  jersey
                </button> = camisa de time
              </li>
              <li>
                <button onClick={() => playAudio('scarf')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  scarf
                </button> = cachecol
              </li>
              <li>
                <button onClick={() => playAudio('hat')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  hat
                </button> = boné
              </li>
              <li>
                <button onClick={() => playAudio('shorts')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  shorts
                </button> = calção
              </li>
              <li>
                <button onClick={() => playAudio('cleats')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  cleats
                </button> = chuteiras
              </li>
              <li>
                <button onClick={() => playAudio('socks')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  socks
                </button> = meias
              </li>
              <li>
                <button onClick={() => playAudio('rain jacket')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  rain jacket
                </button> = jaqueta de chuva
              </li>
              <li>
                <button onClick={() => playAudio('sunglasses')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                  sunglasses
                </button> = óculos de sol
              </li>
            </ul>
          </div>
        </div>

        {/* Seção 8 - WRAP UP */}
        <div className="bg-white border-2 border-green-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🏆 WRAP UP</h2>
              <p className="mt-2 text-green-100 italic">
                Essential phrases for the World Cup experience
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <button onClick={() => playAudio('The match was amazing!')} className="hover:text-green-200 transition-colors">
                  The match was amazing!
                </button>
                <span className="text-sm text-green-300 ml-2">A partida foi incrível!</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('It ended in a draw.')} className="hover:text-green-200 transition-colors">
                  It ended in a draw.
                </button>
                <span className="text-sm text-green-300 ml-2">Terminou em empate.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('I bought a jersey.')} className="hover:text-green-200 transition-colors">
                  I bought a jersey.
                </button>
                <span className="text-sm text-green-300 ml-2">Comprei uma camisa.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Let\'s celebrate!')} className="hover:text-green-200 transition-colors">
                  Let's celebrate!
                </button>
                <span className="text-sm text-green-300 ml-2">Vamos comemorar!</span>
              </p>
            </div>

            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="https://images.pexels.com/photos/1716847/pexels-photo-1716847.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop"
                alt="Soccer fan cheering"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button onClick={() => playAudio('Did you have a good time?')} className="hover:text-green-600 transition-colors">
                  Did you have a good time?
                </button>
                <span className="font-bold"> And you?</span>
                <p className="text-sm text-gray-600 mt-1">Você se divertiu? E você?</p>
              </div>
            </div>

            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Bye! See you.')}
                  className="mr-2 text-green-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Bye! See you.')} className="hover:text-green-200 transition-colors">
                    Bye! See you.
                  </button>
                  <span className="text-sm text-green-300 ml-2">Tchau! Até mais.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('See you at the next match!')}
                  className="mr-2 text-green-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('See you at the next match!')} className="hover:text-green-200 transition-colors">
                    See you at the next match!
                  </button>
                  <span className="text-sm text-green-300 ml-2">Até a próxima partida!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-green-500 to-yellow-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-yellow-500 hover:to-green-600 active:animate-glow"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(34, 197, 94, 0);
          }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}