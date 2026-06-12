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

  const playAudio = (word: string) => {
    const formattedWord = word
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
    const audio = new Audio(`/audios/${formattedWord}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
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
        
        {/* TÍTULO COM IMAGEM DE EMBARCAÇÃO OFFSHORE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 1 - Offshore: Engine Room
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn essential verbs and vocabulary to work as an OQM (Officer in Charge of the Engine Room). ⚙️🔧
          </p>
          <div className="w-64 h-64 mx-auto">
            <Image
              src="https://images.pexels.com/photos/163218/oil-platform-oil-platform-in-the-north-sea-marine-oil-industry-163218.jpeg?auto=compress&cs=tinysrgb&w=400"
              alt="Offshore oil platform at sea"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* SEÇÃO 1 - VERBOS PRINCIPAIS com imagem de trabalhadores offshore */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">Click on the verbs - You need these every day on the ship</p>
            </div>
            <button onClick={() => toggleDrill('verbs')} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm">
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <Image
                  src="https://images.pexels.com/photos/2162333/pexels-photo-2162333.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Workers on offshore vessel"
                  width={200}
                  height={150}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="md:w-2/3">
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li><button onClick={() => playAudio('towork')} className="text-blue-600 font-bold">to work</button> = trabalhar</li>
                  <li><button onClick={() => playAudio('todealwith')} className="text-blue-600 font-bold">to deal with</button> = lidar com, resolver</li>
                </ul>
              </div>
            </div>
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> in the <span onClick={() => playAudio('engineroom')} className="text-blue-600 font-bold cursor-pointer">engine room</span></p>
                  <p className="text-sm text-gray-500">Eu trabalho na casa de máquinas</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: control room | deck | offshore vessel</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">You <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> on the <span onClick={() => playAudio('nightwatch')} className="text-blue-600 font-bold cursor-pointer">night watch</span></p>
                  <p className="text-sm text-gray-500">Você trabalha no turno da noite</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: day watch | evening watch | 12-hour shift</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">He <span onClick={() => playAudio('dealswith')} className="text-blue-600 font-bold cursor-pointer">deals with</span> <span onClick={() => playAudio('mainengine')} className="text-blue-600 font-bold cursor-pointer">main engine</span> problems</p>
                  <p className="text-sm text-gray-500">Ele lida com problemas do motor principal</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: auxiliary engine | generator | boiler</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">She <span onClick={() => playAudio('dealswith')} className="text-blue-600 font-bold cursor-pointer">deals with</span> the <span onClick={() => playAudio('fuelsystem')} className="text-blue-600 font-bold cursor-pointer">fuel system</span></p>
                  <p className="text-sm text-gray-500">Ela lida com o sistema de combustível</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: cooling system | lubrication system | hydraulic system</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">We <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> during the <span onClick={() => playAudio('nightshift')} className="text-blue-600 font-bold cursor-pointer">night shift</span></p>
                  <p className="text-sm text-gray-500">Nós trabalhamos durante o turno da noite</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: day shift | emergency | maintenance period</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium">They <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio('emergency')} className="text-blue-600 font-bold cursor-pointer">emergency</span> situations</p>
                  <p className="text-sm text-gray-500">Eles lidam com situações de emergência</p>
                  <p className="text-xs text-gray-400 mt-1">✏️ Replace: alarm situations | fire drills | oil spills</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 2 - VOCABULÁRIO com imagem de painel de controle */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Words</h2>
              <p className="mt-2 text-blue-100 italic">Words you will see every day on your watch</p>
            </div>
            <button onClick={() => toggleDrill('vocabulary')} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm">
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <Image
                  src="https://images.pexels.com/photos/2644484/pexels-photo-2644484.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Engine control room panel"
                  width={200}
                  height={150}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="md:w-2/3">
                <ul className="grid grid-cols-2 gap-2">
                  <li><button onClick={() => playAudio('engine')} className="text-blue-600 font-bold">engine</button> = motor</li>
                  <li><button onClick={() => playAudio('pump')} className="text-blue-600 font-bold">pump</button> = bomba</li>
                  <li><button onClick={() => playAudio('generator')} className="text-blue-600 font-bold">generator</button> = gerador</li>
                  <li><button onClick={() => playAudio('pressure')} className="text-blue-600 font-bold">pressure</button> = pressão</li>
                  <li><button onClick={() => playAudio('temperature')} className="text-blue-600 font-bold">temperature</button> = temperatura</li>
                  <li><button onClick={() => playAudio('oil')} className="text-blue-600 font-bold">oil</button> = óleo</li>
                  <li><button onClick={() => playAudio('fuel')} className="text-blue-600 font-bold">fuel</button> = combustível</li>
                  <li><button onClick={() => playAudio('alarm')} className="text-blue-600 font-bold">alarm</button> = alarme</li>
                  <li><button onClick={() => playAudio('leak')} className="text-blue-600 font-bold">leak</button> = vazamento</li>
                  <li><button onClick={() => playAudio('valve')} className="text-blue-600 font-bold">valve</button> = válvula</li>
                  <li><button onClick={() => playAudio('watch')} className="text-blue-600 font-bold">watch</button> = turno</li>
                  <li><button onClick={() => playAudio('safety')} className="text-blue-600 font-bold">safety</button> = segurança</li>
                </ul>
              </div>
            </div>
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p>Check the <span onClick={() => playAudio('oilpressure')} className="text-blue-600 font-bold cursor-pointer">oil pressure</span> on the <span onClick={() => playAudio('mainengine')} className="text-blue-600 font-bold cursor-pointer">main engine</span></p>
                  <p className="text-sm text-gray-500">Verifique a pressão do óleo no motor principal</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p>The <span onClick={() => playAudio('temperature')} className="text-blue-600 font-bold cursor-pointer">temperature</span> is high on the <span onClick={() => playAudio('generator')} className="text-blue-600 font-bold cursor-pointer">generator</span></p>
                  <p className="text-sm text-gray-500">A temperatura está alta no gerador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p>I see a small <span onClick={() => playAudio('leak')} className="text-blue-600 font-bold cursor-pointer">leak</span> in the <span onClick={() => playAudio('fuelpipe')} className="text-blue-600 font-bold cursor-pointer">fuel pipe</span></p>
                  <p className="text-sm text-gray-500">Eu vejo um pequeno vazamento no cano de combustível</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p>The <span onClick={() => playAudio('alarm')} className="text-blue-600 font-bold cursor-pointer">alarm</span> is active in the <span onClick={() => playAudio('controlroom')} className="text-blue-600 font-bold cursor-pointer">control room</span></p>
                  <p className="text-sm text-gray-500">O alarme está ativo na sala de controle</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 3 - FRASES ÚTEIS com imagem de marinheiro trabalhando */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak like a Native</h2>
              <p className="mt-2 text-blue-100 italic">Common phrases during your watch</p>
            </div>
            <button onClick={() => toggleDrill('usefulPhrases')} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm">
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <Image
                  src="https://images.pexels.com/photos/9376380/pexels-photo-9376380.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Offshore vessel crew working"
                  width={200}
                  height={150}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="md:w-2/3">
                <ul className="list-disc pl-6 space-y-2">
                  <li><button onClick={() => playAudio('iworkonthewatch')} className="text-blue-600 font-bold">I work on the watch from 4pm to 8pm</button></li>
                  <li><button onClick={() => playAudio('idealwiththeproblem')} className="text-blue-600 font-bold">I need to deal with this problem now</button></li>
                </ul>
              </div>
            </div>
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4">
                {[1,2,3,4,5,6,7,8,9,10].map(i => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-purple-200">
                    {i===1 && <p>I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> in the <span onClick={() => playAudio('engineroom')} className="text-blue-600 font-bold cursor-pointer">engine room</span> every day</p>}
                    {i===2 && <p>Can you <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio('hightemperature')} className="text-blue-600 font-bold cursor-pointer">high temperature</span> alarm?</p>}
                    {i===3 && <p>We need to <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> together to fix the <span onClick={() => playAudio('pump')} className="text-blue-600 font-bold cursor-pointer">pump</span></p>}
                    {i===4 && <p>I always <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio('fuelleaks')} className="text-blue-600 font-bold cursor-pointer">fuel leaks</span> carefully</p>}
                    {i===5 && <p><span onClick={() => playAudio('safety')} className="text-blue-600 font-bold cursor-pointer">Safety</span> is my first priority during the <span onClick={() => playAudio('watch')} className="text-blue-600 font-bold cursor-pointer">watch</span></p>}
                    {i===6 && <p>I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> with the <span onClick={() => playAudio('auxiliaryengine')} className="text-blue-600 font-bold cursor-pointer">auxiliary engine</span> today</p>}
                    {i===7 && <p>Please <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio('lowpressure')} className="text-blue-600 font-bold cursor-pointer">low pressure</span> alarm quickly</p>}
                    {i===8 && <p>We <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> as a team to keep the <span onClick={() => playAudio('vessel')} className="text-blue-600 font-bold cursor-pointer">vessel</span> safe</p>}
                    {i===9 && <p>You must <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> any <span onClick={() => playAudio('abnormalnoise')} className="text-blue-600 font-bold cursor-pointer">abnormal noise</span> immediately</p>}
                    {i===10 && <p>During my <span onClick={() => playAudio('watch')} className="text-blue-600 font-bold cursor-pointer">watch</span>, I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> and <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> all alarms</p>}
                    <p className="text-xs text-gray-400 mt-1">✏️ Replace the blue words to practice</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 4 - GRAMÁTICA com imagem de motor industrial */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar: Routine & Responsibility</h2>
              <p className="mt-2 text-blue-100 italic">Use "I work" and "I deal with" to talk about your duties</p>
            </div>
            <button onClick={() => toggleDrill('grammar')} className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm">
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="md:w-1/3">
                <Image
                  src="https://images.pexels.com/photos/102508/industrial-engine-engine-oil-machine-102508.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Industrial marine engine"
                  width={200}
                  height={150}
                  className="rounded-xl object-cover w-full"
                />
              </div>
              <div className="md:w-2/3">
                <div className="bg-blue-50 p-4 rounded-[20px] space-y-3">
                  <p>✅ <button onClick={() => playAudio('iwork')} className="text-blue-600 font-bold">They work with ...</button> = Eles trabalham com</p>
                  <p>✅ <button onClick={() => playAudio('idealwith')} className="text-blue-600 font-bold">We deal with ... </button> = Nós lidamos com</p>
                  <p>✅ <button onClick={() => playAudio('idealwith')} className="text-blue-600 font-bold">Every other day </button> = Dia sim, dia não</p>
                </div>
              </div>
            </div>
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                  <div key={i} className="p-4 bg-white rounded-xl border border-purple-200">
                    {i===1 && <p>I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> from <span onClick={() => playAudio('midnight')} className="text-blue-600 font-bold cursor-pointer">midnight</span> to 6 AM</p>}
                    {i===2 && <p>I <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio('mainenginealarms')} className="text-blue-600 font-bold cursor-pointer">main engine alarms</span></p>}
                    {i===3 && <p>You <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> on the <span onClick={() => playAudio('generatorwatch')} className="text-blue-600 font-bold cursor-pointer">generator watch</span>, right?</p>}
                    {i===4 && <p>We <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio('emergencysituations')} className="text-blue-600 font-bold cursor-pointer">emergency situations</span> fast</p>}
                    {i===5 && <p>She <span onClick={() => playAudio('works')} className="text-blue-600 font-bold cursor-pointer">works</span> in the <span onClick={() => playAudio('controlroom')} className="text-blue-600 font-bold cursor-pointer">control room</span></p>}
                    {i===6 && <p>He <span onClick={() => playAudio('dealswith')} className="text-blue-600 font-bold cursor-pointer">deals with</span> the <span onClick={() => playAudio('coolingsystem')} className="text-blue-600 font-bold cursor-pointer">cooling system</span></p>}
                    {i===7 && <p>They <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> together during <span onClick={() => playAudio('emergencydrills')} className="text-blue-600 font-bold cursor-pointer">emergency drills</span></p>}
                    {i===8 && <p>We <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio('oilspills')} className="text-blue-600 font-bold cursor-pointer">oil spills</span> immediately</p>}
                    {i===9 && <p>I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> on the <span onClick={() => playAudio('daywatch')} className="text-blue-600 font-bold cursor-pointer">day watch</span> this week</p>}
                    {i===10 && <p>You need to <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> the <span onClick={() => playAudio('vibration')} className="text-blue-600 font-bold cursor-pointer">vibration</span> problem</p>}
                    {i===11 && <p>I <span onClick={() => playAudio('work')} className="text-blue-600 font-bold cursor-pointer">work</span> on an <span onClick={() => playAudio('offshorevessel')} className="text-blue-600 font-bold cursor-pointer">offshore vessel</span></p>}
                    {i===12 && <p>We <span onClick={() => playAudio('dealwith')} className="text-blue-600 font-bold cursor-pointer">deal with</span> <span onClick={() => playAudio('maintenance')} className="text-blue-600 font-bold cursor-pointer">maintenance</span> every day</p>}
                    <p className="text-xs text-gray-400 mt-1">✏️ Replace the blue words with your own ideas</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO 5 - REAL LIFE PRACTICE com múltiplas imagens offshore */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Real Life on the Vessel</h2>
            <p className="mt-2 text-blue-100 italic">Practice these phrases with real images</p>
          </div>
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="flex items-start">
                      <button onClick={() => playAudio(`reallife${i}`)} className="mr-3 mt-1 text-blue-600">🔊</button>
                      <div>
                        {i===1 && <p className="text-lg">I <span className="text-blue-600 font-bold">work</span> in the <span className="text-blue-600 font-bold">engine room</span> during my watch</p>}
                        {i===2 && <p className="text-lg">I <span className="text-blue-600 font-bold">deal with</span> <span className="text-blue-600 font-bold">low oil pressure</span> immediately</p>}
                        {i===3 && <p className="text-lg">We <span className="text-blue-600 font-bold">work</span> together to check all <span className="text-blue-600 font-bold">alarms</span></p>}
                        {i===4 && <p className="text-lg">You need to <span className="text-blue-600 font-bold">deal with</span> any <span className="text-blue-600 font-bold">leak</span> for safety</p>}
                        {i===5 && <p className="text-lg">I <span className="text-blue-600 font-bold">work</span> on the <span className="text-blue-600 font-bold">night watch</span> from 8pm to 8am</p>}
                        {i===6 && <p className="text-lg">Can you <span className="text-blue-600 font-bold">deal with</span> the <span className="text-blue-600 font-bold">high temperature</span> on the generator?</p>}
                        {i===7 && <p className="text-lg">We <span className="text-blue-600 font-bold">work</span> hard to keep the <span className="text-blue-600 font-bold">vessel safe</span></p>}
                        {i===8 && <p className="text-lg">I always <span className="text-blue-600 font-bold">deal with</span> <span className="text-blue-600 font-bold">emergency situations</span> calmly</p>}
                        <p className="text-sm text-gray-600 mt-1">
                          {i===1 && "Eu trabalho na casa de máquinas durante meu turno"}
                          {i===2 && "Eu lido com pressão baixa de óleo imediatamente"}
                          {i===3 && "Nós trabalhamos juntos para verificar todos os alarmes"}
                          {i===4 && "Você precisa lidar com qualquer vazamento por segurança"}
                          {i===5 && "Eu trabalho no turno da noite das 20h às 8h"}
                          {i===6 && "Você pode lidar com a alta temperatura no gerador?"}
                          {i===7 && "Nós trabalhamos duro para manter a embarcação segura"}
                          {i===8 && "Eu sempre lido com situações de emergência com calma"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <Image src="https://images.pexels.com/photos/4041177/pexels-photo-4041177.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Engine room pressure gauges" width={300} height={200} className="rounded-xl object-cover w-full" />
                    <p className="text-center text-gray-700 italic mt-2">Checking engine gauges</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <Image src="https://images.pexels.com/photos/163218/oil-platform-oil-platform-in-the-north-sea-marine-oil-industry-163218.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Offshore oil platform" width={300} height={200} className="rounded-xl object-cover w-full" />
                    <p className="text-center text-gray-700 italic mt-2">Offshore platform at sea</p>
                  </div>
                  <div className="bg-white rounded-2xl p-4 shadow-md">
                    <Image src="https://images.pexels.com/photos/2162333/pexels-photo-2162333.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Ship engine room workers" width={300} height={200} className="rounded-xl object-cover w-full" />
                    <p className="text-center text-gray-700 italic mt-2">Engine room team work</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO 6 - WRAP UP com imagem de embarcação offshore */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">Remember the two main verbs for your job as an OQM</p>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO WORK</span> (trabalhar)</p>
              <p className="text-sm">I work on the night watch</p>
              <p className="text-sm">You work with the generator</p>
              <p className="text-sm">We work for safety</p>
              <p className="text-sm">They work in the engine room</p>
            </div>
            <div className="bg-white flex-1 p-6 text-center">
              <Image src="https://images.pexels.com/photos/163218/oil-platform-oil-platform-in-the-north-sea-marine-oil-industry-163218.jpeg?auto=compress&cs=tinysrgb&w=300" width={150} height={150} className="rounded-full mx-auto mb-3 object-cover w-32 h-32" alt="Offshore platform" />
              <p className="text-black font-bold">🚢 Offshore Vessel</p>
              <p className="text-xs text-gray-500">Your workplace at sea</p>
            </div>
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TO DEAL WITH</span> (lidar com)</p>
              <p className="text-sm">I deal with alarms</p>
              <p className="text-sm">He deals with leaks</p>
              <p className="text-sm">She deals with fuel</p>
              <p className="text-sm">They deal with emergencies</p>
            </div>
          </div>
        </div>

        {/* BOTÃO PRÓXIMA LIÇÃO */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/lesson2")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800"
          >
            Next Lesson → Continue your OQM training
          </button>
        </div>
      </div>
    </div>
  );
}