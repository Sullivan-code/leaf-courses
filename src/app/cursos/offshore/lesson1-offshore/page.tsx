"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonOffshoreOQM() {
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
    // Using Web Speech API for female American English voice
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      // Try to get a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Google US English') ||
         voice.name.includes('Alex') === false)
      );
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
    }
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* TITLE WITH OFFSHORE PLATFORM IMAGE - MAX QUALITY */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 1 - Offshore: Engine Room
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn essential verbs and vocabulary to work as an Officer in Charge of the Engine Room. ⚙️🔧
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Offshore oil platform at sea"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - North Sea</p>
        </div>

        {/* SECTION 1 - VERBS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">Click on the verbs - You need these every day on the ship</p>
            </div>
            <button onClick={() => toggleDrill('verbs')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li><button onClick={() => playAudio("to work")} className="text-blue-600 font-bold hover:underline">to work</button> = trabalhar</li>
              <li><button onClick={() => playAudio("to deal with")} className="text-blue-600 font-bold hover:underline">to deal with</button> = lidar com</li>
              <li><button onClick={() => playAudio("to check")} className="text-blue-600 font-bold hover:underline">to check</button> = verificar, inspecionar</li>
            </ul>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> / You <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> / He <span onClick={() => playAudio("works")} className="text-blue-600 font-bold cursor-pointer">works</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I work, you work, he works")}>Eu trabalho / Você trabalha / Ele trabalha</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "work" with: <span className="text-green-600 font-medium">check</span> | <span className="text-green-600 font-medium">start</span> | <span className="text-green-600 font-medium">stop</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> / You <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> / She <span onClick={() => playAudio("deals with")} className="text-blue-600 font-bold cursor-pointer">deals with</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I deal with, you deal with, she deals with")}>Eu lido com / Você lida com / Ela lida com</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "deal with" with: <span className="text-green-600 font-medium">fix</span> | <span className="text-green-600 font-medium">report</span> | <span className="text-green-600 font-medium">monitor</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I work in the <span onClick={() => playAudio("engine room")} className="text-blue-600 font-bold cursor-pointer">engine room</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I work in the engine room")}>Eu trabalho na casa de máquinas</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "engine room" with: <span className="text-green-600 font-medium">control room</span> | <span className="text-green-600 font-medium">deck</span> | <span className="text-green-600 font-medium">workshop</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <span onClick={() => playAudio("deals with")} className="text-blue-600 font-bold cursor-pointer">deals with</span> the <span onClick={() => playAudio("main engine")} className="text-blue-600 font-bold cursor-pointer">main engine</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("He deals with the main engine")}>Ele lida com o motor principal</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "main engine" with: <span className="text-green-600 font-medium">generator</span> | <span className="text-green-600 font-medium">pump</span> | <span className="text-green-600 font-medium">boiler</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Do you <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> on the <span onClick={() => playAudio("night watch")} className="text-blue-600 font-bold cursor-pointer">night watch</span>?
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Do you work on the night watch?")}>Você trabalha no turno da noite?</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "night watch" with: <span className="text-green-600 font-medium">day watch</span> | <span className="text-green-600 font-medium">evening watch</span> | <span className="text-green-600 font-medium">12-hour shift</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> together to <span onClick={() => playAudio("check")} className="text-blue-600 font-bold cursor-pointer">check</span> the <span onClick={() => playAudio("alarm panel")} className="text-blue-600 font-bold cursor-pointer">alarm panel</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("We work together to check the alarm panel")}>Nós trabalhamos juntos para verificar o painel de alarmes</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "alarm panel" with: <span className="text-green-600 font-medium">pressure gauge</span> | <span className="text-green-600 font-medium">temperature sensor</span> | <span className="text-green-600 font-medium">fuel meter</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <span onClick={() => playAudio("deals with")} className="text-blue-600 font-bold cursor-pointer">deals with</span> <span onClick={() => playAudio("emergency")} className="text-blue-600 font-bold cursor-pointer">emergency</span> situations in the <span onClick={() => playAudio("control room")} className="text-blue-600 font-bold cursor-pointer">control room</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("She deals with emergency situations in the control room")}>Ela lida com situações de emergência na sala de controle</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "control room" with: <span className="text-green-600 font-medium">engine room</span> | <span className="text-green-600 font-medium">bridge</span> | <span className="text-green-600 font-medium">workshop</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    They <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio("fuel leaks")} className="text-blue-600 font-bold cursor-pointer">fuel leaks</span> and <span onClick={() => playAudio("oil spills")} className="text-blue-600 font-bold cursor-pointer">oil spills</span> every day
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("They deal with fuel leaks and oil spills every day")}>Eles lidam com vazamentos de combustível e derramamentos de óleo todos os dias</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "fuel leaks and oil spills" with: <span className="text-green-600 font-medium">high pressure and low temperature</span> | <span className="text-green-600 font-medium">alarms and warnings</span> | <span className="text-green-600 font-medium">pumps and valves</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    During my <span onClick={() => playAudio("watch")} className="text-blue-600 font-bold cursor-pointer">watch</span>, I <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> and I <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> any <span onClick={() => playAudio("abnormal noise")} className="text-blue-600 font-bold cursor-pointer">abnormal noise</span> from the <span onClick={() => playAudio("auxiliary engine")} className="text-blue-600 font-bold cursor-pointer">auxiliary engine</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("During my watch, I work and I deal with any abnormal noise from the auxiliary engine")}>Durante meu turno, eu trabalho e lido com qualquer ruído anormal do motor auxiliar</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "auxiliary engine" with: <span className="text-green-600 font-medium">main engine</span> | <span className="text-green-600 font-medium">generator</span> | <span className="text-green-600 font-medium">cooling system</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2 - NEW WORDS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Words</h2>
              <p className="mt-2 text-blue-100 italic">Words you will see every day on your watch</p>
            </div>
            <button onClick={() => toggleDrill('vocabulary')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="grid grid-cols-2 gap-2 mb-6">
              <li><button onClick={() => playAudio("engine")} className="text-blue-600 font-bold hover:underline">engine</button> = motor</li>
              <li><button onClick={() => playAudio("pump")} className="text-blue-600 font-bold hover:underline">pump</button> = bomba</li>
              <li><button onClick={() => playAudio("generator")} className="text-blue-600 font-bold hover:underline">generator</button> = gerador</li>
              <li><button onClick={() => playAudio("pressure")} className="text-blue-600 font-bold hover:underline">pressure</button> = pressão</li>
              <li><button onClick={() => playAudio("temperature")} className="text-blue-600 font-bold hover:underline">temperature</button> = temperatura</li>
              <li><button onClick={() => playAudio("valve")} className="text-blue-600 font-bold hover:underline">valve</button> = válvula</li>
              <li><button onClick={() => playAudio("alarm")} className="text-blue-600 font-bold hover:underline">alarm</button> = alarme</li>
              <li><button onClick={() => playAudio("leak")} className="text-blue-600 font-bold hover:underline">leak</button> = vazamento</li>
            </ul>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Check the <span onClick={() => playAudio("oil pressure")} className="text-blue-600 font-bold cursor-pointer">oil pressure</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Check the oil pressure")}>Verifique a pressão do óleo</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "oil pressure" with: <span className="text-green-600 font-medium">water pressure</span> | <span className="text-green-600 font-medium">fuel pressure</span> | <span className="text-green-600 font-medium">air pressure</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <span onClick={() => playAudio("temperature")} className="text-blue-600 font-bold cursor-pointer">temperature</span> is high
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("The temperature is high")}>A temperatura está alta</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "temperature" with: <span className="text-green-600 font-medium">pressure</span> | <span className="text-green-600 font-medium">level</span> | <span className="text-green-600 font-medium">flow</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I see a small <span onClick={() => playAudio("leak")} className="text-blue-600 font-bold cursor-pointer">leak</span> in the pipe
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I see a small leak in the pipe")}>Eu vejo um pequeno vazamento no cano</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "leak" with: <span className="text-green-600 font-medium">crack</span> | <span className="text-green-600 font-medium">blockage</span> | <span className="text-green-600 font-medium">noise</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <span onClick={() => playAudio("alarm")} className="text-blue-600 font-bold cursor-pointer">alarm</span> is active on the <span onClick={() => playAudio("generator")} className="text-blue-600 font-bold cursor-pointer">generator</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("The alarm is active on the generator")}>O alarme está ativo no gerador</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "generator" with: <span className="text-green-600 font-medium">main engine</span> | <span className="text-green-600 font-medium">boiler</span> | <span className="text-green-600 font-medium">pump number 2</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Close the <span onClick={() => playAudio("valve")} className="text-blue-600 font-bold cursor-pointer">valve</span> immediately
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Close the valve immediately")}>Feche a válvula imediatamente</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "valve" with: <span className="text-green-600 font-medium">switch</span> | <span className="text-green-600 font-medium">breaker</span> | <span className="text-green-600 font-medium">panel</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Record the <span onClick={() => playAudio("temperature")} className="text-blue-600 font-bold cursor-pointer">temperature</span> and the <span onClick={() => playAudio("pressure")} className="text-blue-600 font-bold cursor-pointer">pressure</span> every hour
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Record the temperature and the pressure every hour")}>Registre a temperatura e a pressão a cada hora</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "temperature and pressure" with: <span className="text-green-600 font-medium">fuel level and oil level</span> | <span className="text-green-600 font-medium">rpm and hours</span> | <span className="text-green-600 font-medium">alarms and warnings</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <span onClick={() => playAudio("leak")} className="text-blue-600 font-bold cursor-pointer">leak</span> in the <span onClick={() => playAudio("fuel pipe")} className="text-blue-600 font-bold cursor-pointer">fuel pipe</span> is near the <span onClick={() => playAudio("valve")} className="text-blue-600 font-bold cursor-pointer">valve</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("The leak in the fuel pipe is near the valve")}>O vazamento no cano de combustível está perto da válvula</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "fuel pipe" with: <span className="text-green-600 font-medium">water pipe</span> | <span className="text-green-600 font-medium">oil line</span> | <span className="text-green-600 font-medium">cooling hose</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3 - USEFUL PHRASES */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like A Native</h2>
              <p className="mt-2 text-blue-100 italic">Common phrases during your watch</p>
            </div>
            <button onClick={() => toggleDrill('usefulPhrases')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li><button onClick={() => playAudio("I work on the watch from 4pm to 8pm")} className="text-blue-600 font-bold hover:underline">I work on the watch from 4pm to 8pm</button></li>
              <li><button onClick={() => playAudio("I need to deal with this problem now")} className="text-blue-600 font-bold hover:underline">I need to deal with this problem now</button></li>
            </ul>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> in the <span onClick={() => playAudio("engine room")} className="text-blue-600 font-bold cursor-pointer">engine room</span> every day
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I work in the engine room every day")}>Eu trabalho na casa de máquinas todos os dias</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "engine room" with: <span className="text-green-600 font-medium">control room</span> | <span className="text-green-600 font-medium">workshop</span> | <span className="text-green-600 font-medium">pump room</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Can you <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio("high temperature")} className="text-blue-600 font-bold cursor-pointer">high temperature</span> alarm?
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Can you deal with the high temperature alarm?")}>Você pode lidar com o alarme de alta temperatura?</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "high temperature" with: <span className="text-green-600 font-medium">low pressure</span> | <span className="text-green-600 font-medium">high vibration</span> | <span className="text-green-600 font-medium">low oil level</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    We need to <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> together to <span onClick={() => playAudio("fix")} className="text-blue-600 font-bold cursor-pointer">fix</span> the <span onClick={() => playAudio("pump")} className="text-blue-600 font-bold cursor-pointer">pump</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("We need to work together to fix the pump")}>Nós precisamos trabalhar juntos para consertar a bomba</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "pump" with: <span className="text-green-600 font-medium">generator</span> | <span className="text-green-600 font-medium">valve</span> | <span className="text-green-600 font-medium">compressor</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I always <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio("fuel leaks")} className="text-blue-600 font-bold cursor-pointer">fuel leaks</span> carefully
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I always deal with fuel leaks carefully")}>Eu sempre lido com vazamentos de combustível com cuidado</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "fuel leaks" with: <span className="text-green-600 font-medium">emergency alarms</span> | <span className="text-green-600 font-medium">oil spills</span> | <span className="text-green-600 font-medium">electrical problems</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span onClick={() => playAudio("Safety")} className="text-blue-600 font-bold cursor-pointer">Safety</span> is my first priority during the <span onClick={() => playAudio("watch")} className="text-blue-600 font-bold cursor-pointer">watch</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Safety is my first priority during the watch")}>Segurança é minha primeira prioridade durante o turno</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "Safety" with: <span className="text-green-600 font-medium">Communication</span> | <span className="text-green-600 font-medium">Teamwork</span> | <span className="text-green-600 font-medium">Procedure</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    Please <span onClick={() => playAudio("report")} className="text-blue-600 font-bold cursor-pointer">report</span> any <span onClick={() => playAudio("abnormal noise")} className="text-blue-600 font-bold cursor-pointer">abnormal noise</span> to the <span onClick={() => playAudio("chief engineer")} className="text-blue-600 font-bold cursor-pointer">chief engineer</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Please report any abnormal noise to the chief engineer")}>Por favor, reporte qualquer ruído anormal ao chefe de máquinas</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "chief engineer" with: <span className="text-green-600 font-medium">watch officer</span> | <span className="text-green-600 font-medium">engine room supervisor</span> | <span className="text-green-600 font-medium">captain</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 4 - GRAMMAR */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">Use "I work" and "I deal with" to talk about your duties</p>
            </div>
            <button onClick={() => toggleDrill('grammar')} className="rounded-full bg-white text-blue-600 px-8 py-3 text-sm font-semibold">
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] space-y-3 mb-6">
              <p>✅ <button onClick={() => playAudio("I work in the engine room")} className="text-blue-600 font-bold hover:underline">I work in the engine room</button> = Eu trabalho na casa de máquinas</p>
              <p>✅ <button onClick={() => playAudio("I deal with alarms")} className="text-blue-600 font-bold hover:underline">I deal with alarms</button> = Eu lido com alarmes</p>
              <p>✅ <button onClick={() => playAudio("Every other day")} className="text-blue-600 font-bold hover:underline">Every other day</button> = Dia sim, dia não</p>
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> from <span onClick={() => playAudio("midnight")} className="text-blue-600 font-bold cursor-pointer">midnight</span> to 6 AM
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I work from midnight to 6 AM")}>Eu trabalho da meia-noite às 6 da manhã</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "midnight to 6 AM" with: <span className="text-green-600 font-medium">6 AM to noon</span> | <span className="text-green-600 font-medium">noon to 6 PM</span> | <span className="text-green-600 font-medium">6 PM to midnight</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio("main engine alarms")} className="text-blue-600 font-bold cursor-pointer">main engine alarms</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("I deal with the main engine alarms")}>Eu lido com os alarmes do motor principal</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "main engine alarms" with: <span className="text-green-600 font-medium">generator alarms</span> | <span className="text-green-600 font-medium">boiler warnings</span> | <span className="text-green-600 font-medium">safety system alerts</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    You <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> on the <span onClick={() => playAudio("generator watch")} className="text-blue-600 font-bold cursor-pointer">generator watch</span>, right?
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("You work on the generator watch, right?")}>Você trabalha no turno do gerador, certo?</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "generator watch" with: <span className="text-green-600 font-medium">pump watch</span> | <span className="text-green-600 font-medium">engine watch</span> | <span className="text-green-600 font-medium">night watch</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio("emergency situations")} className="text-blue-600 font-bold cursor-pointer">emergency situations</span> fast
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("We deal with emergency situations fast")}>Nós lidamos com situações de emergência rapidamente</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "emergency situations" with: <span className="text-green-600 font-medium">daily problems</span> | <span className="text-green-600 font-medium">routine checks</span> | <span className="text-green-600 font-medium">maintenance tasks</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <span onClick={() => playAudio("works")} className="text-blue-600 font-bold cursor-pointer">works</span> in the <span onClick={() => playAudio("control room")} className="text-blue-600 font-bold cursor-pointer">control room</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("She works in the control room")}>Ela trabalha na sala de controle</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "control room" with: <span className="text-green-600 font-medium">engine room</span> | <span className="text-green-600 font-medium">workshop</span> | <span className="text-green-600 font-medium">office</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    They <span onClick={() => playAudio("work")} className="text-blue-600 font-bold cursor-pointer">work</span> together during <span onClick={() => playAudio("emergency drills")} className="text-blue-600 font-bold cursor-pointer">emergency drills</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("They work together during emergency drills")}>Eles trabalham juntos durante os treinos de emergência</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "emergency drills" with: <span className="text-green-600 font-medium">the night shift</span> | <span className="text-green-600 font-medium">maintenance periods</span> | <span className="text-green-600 font-medium">watch changes</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span onClick={() => playAudio("Every other day")} className="text-blue-600 font-bold cursor-pointer">Every other day</span>, I <span onClick={() => playAudio("check")} className="text-blue-600 font-bold cursor-pointer">check</span> the <span onClick={() => playAudio("oil level")} className="text-blue-600 font-bold cursor-pointer">oil level</span> on the main engine
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("Every other day, I check the oil level on the main engine")}>Dia sim, dia não, eu verifico o nível de óleo no motor principal</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "oil level" with: <span className="text-green-600 font-medium">coolant level</span> | <span className="text-green-600 font-medium">fuel level</span> | <span className="text-green-600 font-medium">water level</span></p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    You need to <span onClick={() => playAudio("deal with")} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio("vibration")} className="text-blue-600 font-bold cursor-pointer">vibration</span> problem before the <span onClick={() => playAudio("next watch")} className="text-blue-600 font-bold cursor-pointer">next watch</span> starts
                  </p>
                  <p className="text-sm text-gray-500 mt-1" onClick={() => playAudio("You need to deal with the vibration problem before the next watch starts")}>Você precisa lidar com o problema de vibração antes do próximo turno começar</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace "vibration" with: <span className="text-green-600 font-medium">overheating</span> | <span className="text-green-600 font-medium">noise</span> | <span className="text-green-600 font-medium">pressure drop</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5 - WRAP UP with AM/PM lesson */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">Remember the main verbs for your job as an OQM</p>
          </div>
          
          {/* AM/PM LESSON */}
          <div className="bg-yellow-50 border-b-2 border-yellow-200 p-6">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4">⏰ AM and PM - Understanding Time on the Vessel</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-4xl font-bold text-blue-600">AM</span>
                  <p className="text-gray-600 mt-2"><span className="font-bold">Ante Meridiem</span> (Latin)</p>
                  <p className="text-gray-500">Before noon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p>🌅 <span onClick={() => playAudio("12 AM")} className="text-blue-600 font-bold cursor-pointer">12:00 AM</span> = Midnight (meia-noite)</p>
                  <p>🌄 <span onClick={() => playAudio("6 AM")} className="text-blue-600 font-bold cursor-pointer">6:00 AM</span> = Morning (manhã)</p>
                  <p>☀️ <span onClick={() => playAudio("12 PM")} className="text-blue-600 font-bold cursor-pointer">12:00 PM</span> = Noon (meio-dia)</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">📌 Use AM from <strong>midnight to noon</strong> (00:00 to 11:59)</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="text-center">
                  <span className="text-4xl font-bold text-purple-600">PM</span>
                  <p className="text-gray-600 mt-2"><span className="font-bold">Post Meridiem</span> (Latin)</p>
                  <p className="text-gray-500">After noon</p>
                </div>
                <div className="mt-4 space-y-2">
                  <p>🌤️ <span onClick={() => playAudio("1 PM")} className="text-blue-600 font-bold cursor-pointer">1:00 PM</span> = Afternoon (tarde)</p>
                  <p>🌙 <span onClick={() => playAudio("6 PM")} className="text-blue-600 font-bold cursor-pointer">6:00 PM</span> = Evening (noite)</p>
                  <p>🌃 <span onClick={() => playAudio("11 PM")} className="text-blue-600 font-bold cursor-pointer">11:00 PM</span> = Night (noite)</p>
                </div>
                <p className="text-xs text-gray-400 mt-3">📌 Use PM from <strong>noon to midnight</strong> (12:00 to 23:59)</p>
              </div>
            </div>
            <div className="mt-4 bg-blue-100 rounded-lg p-3 text-center">
              <p className="text-gray-700">💡 <span className="font-bold">Offshore Example:</span> "I work from <span onClick={() => playAudio("8 PM")} className="text-blue-600 font-bold cursor-pointer">8:00 PM</span> to <span onClick={() => playAudio("8 AM")} className="text-blue-600 font-bold cursor-pointer">8:00 AM</span>" = I work the night shift (12 hours)</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO WORK</span> (to do a job)</p>
              <p className="text-sm" onClick={() => playAudio("I work on the night watch")}>I work on the night watch</p>
              <p className="text-sm" onClick={() => playAudio("You work with the generator")}>You work with the generator</p>
              <p className="text-sm" onClick={() => playAudio("We work for safety")}>We work for safety</p>
              <p className="text-sm" onClick={() => playAudio("They work in the engine room")}>They work in the engine room</p>
            </div>
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-blue-200">
              <div className="w-36 h-36 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚢</span>
              </div>
              <p className="text-black font-bold text-lg mt-2">Offshore Vessel</p>
              <p className="text-xs text-gray-500">Your workplace at sea</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">🕐 <span className="font-bold">Watch Schedule:</span></p>
                <p className="text-xs text-gray-600">00:00-04:00 | 04:00-08:00 | 08:00-12:00</p>
                <p className="text-xs text-gray-600">12:00-16:00 | 16:00-20:00 | 20:00-00:00</p>
              </div>
            </div>
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO DEAL WITH</span> (to handle)</p>
              <p className="text-sm" onClick={() => playAudio("I deal with alarms")}>I deal with alarms</p>
              <p className="text-sm" onClick={() => playAudio("He deals with leaks")}>He deals with leaks</p>
              <p className="text-sm" onClick={() => playAudio("She deals with fuel")}>She deals with fuel</p>
              <p className="text-sm" onClick={() => playAudio("They deal with emergencies")}>They deal with emergencies</p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">Remember:</span> 12:00 AM = midnight (start of day) | 12:00 PM = noon (middle of day)</p>
            <p className="text-sm text-gray-600 mt-1">📅 Offshore shifts are usually 12 hours: 6 AM - 6 PM or 6 PM - 6 AM</p>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson2-offshore")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
          >
            Next Lesson → Continue your OQM training
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
      `}</style>
    </div>
  );
}