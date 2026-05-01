"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife';

export default function Lesson55HobbiesTraveling() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
  });
  const [showCanExplanation, setShowCanExplanation] = useState(false);
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
  const mainImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const sportsImage = "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const musicImage = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const runningImage = "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const bikeImage = "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 55 data - Verbs
  const verbs = [
    { english: "to play", portuguese: "jogar, tocar, brincar" },
    { english: "to run", portuguese: "correr" }
  ];

  // New Words - Hobbies & Instruments
  const newWords = [
    { english: "guitar", portuguese: "violão" },
    { english: "electric guitar", portuguese: "guitarra" },
    { english: "piano", portuguese: "piano" },
    { english: "keyboard", portuguese: "teclado" },
    { english: "drums", portuguese: "bateria" },
    { english: "flute", portuguese: "flauta" },
    { english: "violin", portuguese: "violino" },
    { english: "instrument", portuguese: "instrumento" },
    { english: "game", portuguese: "jogo" },
    { english: "soccer", portuguese: "futebol" },
    { english: "basketball", portuguese: "basquete" },
    { english: "volleyball", portuguese: "vôlei" },
    { english: "hobby", portuguese: "passatempo" },
    { english: "yoga", portuguese: "yoga" },
    { english: "marathon", portuguese: "maratona" },
    { english: "treadmill", portuguese: "esteira" }
  ];

  const usefulPhrases = [
    { english: "I ride a bike every day.", portuguese: "Eu ando de bicicleta todos os dias." },
    { english: "Have fun at the game!", portuguese: "Divirta-se no jogo!" },
    { english: "I go running and swimming.", portuguese: "Eu vou correr e nadar." },
    { english: "What do you do in your free time?", portuguese: "O que você faz no seu tempo livre?" }
  ];

  const grammarExamples = [
    { english: "I can play the piano very well.", portuguese: "Eu consigo tocar piano muito bem." },
    { english: "She can play soccer and basketball.", portuguese: "Ela consegue jogar futebol e basquete." },
    { english: "He can speak Italian and German.", portuguese: "Ele consegue falar italiano e alemão." },
    { english: "Yes, Maria can drink milk.", portuguese: "Sim, Maria consegue beber leite." },
    { english: "I can't play this instrument.", portuguese: "Eu não consigo tocar este instrumento." },
    { english: "He can't talk to you now.", portuguese: "Ele não pode falar com você agora." },
    { english: "They can't run in this place.", portuguese: "Eles não podem correr neste lugar." },
    { english: "She still can't run a marathon.", portuguese: "Ela ainda não consegue correr uma maratona." }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I think he plays soccer at the university.", portuguese: "Eu acho que ele joga futebol na universidade." },
    { english: "He usually rides his bike on weekends.", portuguese: "Ele costuma andar de bicicleta nos fins de semana." },
    { english: "How often do you run?", portuguese: "Com que frequência você corre?" },
    { english: "How many instruments do you play?", portuguese: "Quantos instrumentos você toca?" },
    { english: "Does she play the drums?", portuguese: "Ela toca bateria?" },
    { english: "Our children love to play with their grandfather.", portuguese: "Nossos filhos adoram brincar com o avô deles." },
    { english: "I can improve my English this year.", portuguese: "Eu posso melhorar meu inglês este ano." },
    { english: "We can start the classes next week.", portuguese: "Nós podemos começar as aulas na próxima semana." }
  ];

  // Check It Out sentences
  const checkItOutSentences = [
    { english: "I play soccer after work.", portuguese: "Eu jogo futebol depois do trabalho." },
    { english: "I play the flute in my free time.", portuguese: "Eu toco flauta no meu tempo livre." },
    { english: "I run in the street in the morning.", portuguese: "Eu corro na rua de manhã." },
    { english: "I do yoga to relax.", portuguese: "Eu faço yoga para relaxar." },
    { english: "I go swimming on weekends.", portuguese: "Eu vou nadar nos fins de semana." },
    { english: "Sometimes I wanna start running.", portuguese: "Às vezes eu quero começar a correr." }
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
            🎸 Lesson 55 - HOBBIES & TRAVELING
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about hobbies, sports, musical instruments, and free time activities.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Hobbies and activities"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 VERBS</h2>
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I play soccer')}>I play soccer</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We play')}>We play</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They play')}>They play</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu jogo futebol. / Nós jogamos. / Eles jogam.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ I<span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have played soccer before')}>'ve played soccer before</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We have played together')}>We've played together</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They have played a lot')}>They've played a lot</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I will play tomorrow')}>I will play tomorrow</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are gonna play later')}>We're gonna play later</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They will play soon')}>They will play soon</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is running')}>He is running</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is not running')}>He isn't running</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is he running')}>Is he running</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ele está correndo. / Ele não está correndo. / Ele está correndo?</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He has been running')}>He has been running</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He has not been running')}>He hasn't been running</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He was running yesterday')}>He was running yesterday</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He went running yesterday')}>He went running yesterday</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you like to run')}>Do you like to run</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you like to play')}>play</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you like to study')}>study</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Vocês gostam de correr? / brincar? / estudar?</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Have you liked running lately')}>Have you liked running lately</span>?</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you gonna run or study today')}>Are you gonna run or study today</span>?</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she run')}>When does she run</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she play')}>play</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she study')}>study</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Quando ela corre? / brinca? / estuda?</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When has she been running')}>When has she been running</span>?</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When will she study')}>When will she study</span>?</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not play video games during the week')}>I don't play video games during the week</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu não jogo videogame durante a semana.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have not played video games this week')}>I haven't played video games this week</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I did not play last week')}>I didn't play last week</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am not playing during the week')}>I ain't playing during the week</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I would like to run a marathon')}>I would like to run a marathon</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu gostaria de correr uma maratona.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I wanna run a marathon')}>I wanna run a marathon</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am gonna run a marathon')}>I'm gonna run a marathon</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I will run a marathon someday')}>I will run a marathon someday</span>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 NEW WORDS</h2>
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is playing soccer with her friends')}>She is playing soccer with her friends</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is playing basketball with her friends')}>basketball</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is playing volleyball with her friends')}>volleyball</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Ela está jogando futebol com os amigos dela. / basquete / vôlei</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She has played soccer with them before')}>She has played soccer with them before</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She played soccer yesterday')}>She played soccer yesterday</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What is your favorite sport')}>What is your favorite sport</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What is your favorite game')}>game</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What is your favorite instrument')}>instrument</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Qual é o seu esporte favorito? / jogo / instrumento</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What has been your favorite lately')}>What has been your favorite lately</span>?</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What will be your next hobby')}>What will be your next hobby</span>?</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We like to play the flute')}>We like to play the flute</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We like to play the violin')}>violin</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We like to play the guitar')}>guitar</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Nós gostamos de tocar flauta. / violino / violão</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We have played the flute before')}>We've played the flute before</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We will play together again')}>We will play together again</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I wanna learn the guitar')}>I wanna learn the guitar</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu quero aprender violão.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I would like to learn the guitar')}>I would like to learn the guitar</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have not learned it yet')}>I haven't learned it yet</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am gonna learn it soon')}>I'm gonna learn it soon</span>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre hobbies e tempo livre
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I drive to work')}>I drive to work</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I take the bus')}>I take the bus</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I ride a bike')}>I ride a bike</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu dirijo para o trabalho. / pego o ônibus / ando de bicicleta</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have driven to work many times')}>I've driven to work many times</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I went by bus yesterday')}>I went by bus yesterday</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am gonna ride my bike tomorrow')}>I'm gonna ride my bike tomorrow</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you do in your free time')}>What do you do in your free time</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do they do in their free time')}>What do they do</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does she do in her free time')}>What does she do</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 O que você faz no seu tempo livre? / o que eles fazem? / o que ela faz?</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What have you been doing lately')}>What have you been doing lately</span>?</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What will you do later')}>What will you do later</span>?</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I go running after work')}>I go running after work</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu vou correr depois do trabalho.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I went running yesterday')}>I went running yesterday</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have gone running many times')}>I've gone running many times</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am gonna run later')}>I'm gonna run later</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Sometimes I just wanna relax')}>Sometimes I just wanna relax</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Às vezes eu só quero relaxar.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I would like to relax more')}>I would like to relax more</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have not relaxed much lately')}>I haven't relaxed much lately</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am not doing anything today')}>I ain't doing anything today</span>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar (Can / Can't) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 GRAMMAR (Can / Can't)</h2>
              <p className="mt-2 text-blue-100 italic">
                Capacidade e possibilidade
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I can run a marathon')}>I can run a marathon</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He can run a marathon')}>He can</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They can run a marathon')}>They can</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu consigo correr uma maratona. / Ele consegue / Elas conseguem</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have been able to run before')}>I've been able to run before</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I will be able to run someday')}>I will be able to run someday</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I cannot play any instrument')}>I can't play any instrument</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He cannot play any instrument')}>He can't</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We cannot play any instrument')}>We can't</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu não consigo tocar nenhum instrumento. / Ele / Nós</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have not been able to play yet')}>I haven't been able to play yet</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I could not play before')}>I couldn't play before</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am not good at instruments')}>I ain't good at instruments</span>.</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Can you help me')}>Can you help me</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você consegue me ajudar?</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Will you be able to help me')}>Will you be able to help me</span>?</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Have you helped me before')}>Have you helped me before</span>?</p>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I would like to speak English fluently')}>I would like to speak English fluently</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu gostaria de falar inglês fluentemente.</p>
                  <div className="mt-2 text-gray-600">
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I wanna speak English fluently')}>I wanna speak English fluently</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I will speak English fluently')}>I will speak English fluently</span>.</p>
                    <p>→ <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have not reached that level yet')}>I haven't reached that level yet</span>.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔵 REAL LIFE</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique situações reais sobre hobbies e atividades
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
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

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={sportsImage}
                        alt="Sports activities"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Playing sports with friends
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={musicImage}
                        alt="Musical instruments"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Playing musical instruments
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={runningImage}
                        alt="Running and exercise"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Running and fitness
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out! */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔵 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Play vs. Play the | Run vs. Go running | Do vs. Go
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">PLAY vs. PLAY THE</h3>
                  <button 
                    onClick={() => setShowCanExplanation(!showCanExplanation)}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showCanExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showCanExplanation && (
                  <div className="mb-4 p-4 bg-green-700 rounded-lg border border-green-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">🎯 Regras:</p>
                    <ul className="text-green-200 text-sm list-disc pl-4 space-y-1">
                      <li><strong>play + sport</strong> = sem artigo (play soccer, play basketball)</li>
                      <li><strong>play the + instrument</strong> = com artigo (play the guitar, play the piano)</li>
                      <li><strong>play + game</strong> = sem artigo (play video games, play chess)</li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I play soccer.</p>
                    <p className="text-green-200 text-sm">Eu jogo futebol.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I play the flute.</p>
                    <p className="text-green-200 text-sm">Eu toco flauta.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-green-600">
                <h3 className="font-bold text-lg text-yellow-300 mb-3">RUN vs. GO RUNNING</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">to run → on the treadmill / in the street</p>
                    <p className="text-green-200 text-sm">correr → na esteira / na rua</p>
                  </div>
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">to go running</p>
                    <p className="text-green-200 text-sm">ir correr</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={bikeImage}
                    alt="Biking activity"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🚴 DO vs. GO</p>
                    <p className="text-green-200 text-xs">do yoga / go swimming / go running</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">DAILY ACTIVITIES</h3>
                    <button 
                      onClick={() => setShowQuestionsExplanation(!showQuestionsExplanation)}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showQuestionsExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showQuestionsExplanation && (
                    <div className="mb-4 p-4 bg-red-700 rounded-lg border border-red-600">
                      <p className="text-yellow-200 text-sm font-medium mb-2">📌 Expressões Úteis:</p>
                      <ul className="text-red-200 text-sm list-disc pl-4 space-y-1">
                        <li>every day = todos os dias</li>
                        <li>on weekends = nos fins de semana</li>
                        <li>in the morning = de manhã</li>
                        <li>after work = depois do trabalho</li>
                        <li>in my free time = no meu tempo livre</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    {checkItOutSentences.map((sentence, idx) => (
                      <div key={idx} className="p-3 bg-red-700 rounded-lg">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="font-bold text-lg text-left w-full hover:text-yellow-200 transition-colors"
                        >
                          {sentence.english}
                        </button>
                        <p className="text-red-200 text-sm">{sentence.portuguese}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-6 border-t border-red-600">
                  <div className="p-4 bg-red-700 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">💬 EXTRA PHRASES</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">I ride a bike every day.</p>
                        <p className="text-red-200 text-sm">Eu ando de bicicleta todos os dias.</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Have fun at the game!</p>
                        <p className="text-red-200 text-sm">Divirta-se no jogo!</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">I go running and swimming.</p>
                        <p className="text-red-200 text-sm">Eu vou correr e nadar.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-red-600">
                <div className="bg-red-700 rounded-lg overflow-hidden">
                  <img
                    src={grammarImage}
                    alt="Grammar practice"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">🎯 DO vs. GO vs. PLAY</p>
                    <p className="text-red-200 text-xs">do yoga / go swimming / play soccer</p>
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
                  <p className="text-xl font-bold text-blue-800">🗣️ 1. What do you do in your free time?</p>
                  <p className="text-gray-600 mt-2">In my free time, I like to _______.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 2. How often do you exercise?</p>
                  <p className="text-gray-600 mt-2">I exercise _______ times a week.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 3. Can you play a musical instrument?</p>
                  <p className="text-gray-600 mt-2">Yes, I can play _______. / No, I can't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 4. What sports do you like to play?</p>
                  <p className="text-gray-600 mt-2">I like to play _______.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 5. What do you wanna learn in the future?</p>
                  <p className="text-gray-600 mt-2">I wanna learn _______.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson54")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (54)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson56")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (56) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}