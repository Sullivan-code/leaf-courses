"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonMachineryEquipment() {
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

  // Função simplificada - apenas dispara o áudio sem buscar arquivos
  // O áudio será fornecido por outro sistema
  const playAudio = (text: string) => {
    // Esta função será substituída pelo sistema de áudio externo
    // Por enquanto, apenas registra que o áudio deve ser reproduzido
    console.log(`🔊 Reproduzindo áudio para: "${text}"`);
    
    // Dispara um evento personalizado que o sistema externo pode capturar
    const audioEvent = new CustomEvent('playAudio', { 
      detail: { text, timestamp: Date.now() }
    });
    window.dispatchEvent(audioEvent);
    
    // Tenta reproduzir via Web Speech API como fallback (voz feminina)
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      // Seleciona uma voz feminina disponível
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
        backgroundImage: `url("https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%201%20de%20jul.%20de%202026%2C%2014_59_42.png?raw=true")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Container principal com fade vermelho e laranja */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-100 via-orange-100 to-red-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-red-300/50">
        
        {/* Título centralizado com imagem abaixo - IMAGEM DA PLATAFORMA OFFSHORE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 3 - Machinery & Equipment
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about industrial machines, tools, and equipment in English. 🔧⚙️
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

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS - Actions with Equipment</h2>
              <p className="mt-2 text-red-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to operate')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to operate
                </button> = operar / manusear
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to check')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to check
                </button> = verificar / checar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to maintain')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to maintain
                </button> = fazer manutenção
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to inspect')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to inspect
                </button> = inspecionar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to repair')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to repair
                </button> = reparar / consertar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to start')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to start
                </button> = ligar / iniciar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to stop')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to stop
                </button> = desligar / parar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('I operated the machine yesterday.')} className="text-red-600 hover:text-red-800 transition-colors">
                      I operated the machine yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu operei a máquina ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you operate the machine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you operate the machine?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't operate the machine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't operate the machine.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('She checked the pressure gauge this morning.')} className="text-red-600 hover:text-red-800 transition-colors">
                      She checked the pressure gauge this morning.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela verificou o manômetro esta manhã.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she check the pressure gauge?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she check the pressure gauge?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We maintained the equipment last week.')} className="text-red-600 hover:text-red-800 transition-colors">
                      We maintained the equipment last week.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós fizemos manutenção do equipamento na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we maintain the equipment?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we maintain the equipment?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't maintain it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't maintain it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('They repaired the pump on Monday.')} className="text-red-600 hover:text-red-800 transition-colors">
                      They repaired the pump on Monday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles consertaram a bomba na segunda-feira.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did they repair the pump?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did they repair the pump?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't repair it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't repair it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('He started the generator at 8 AM.')} className="text-red-600 hover:text-red-800 transition-colors">
                      He started the generator at 8 AM.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele ligou o gerador às 8 da manhã.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did he start the generator?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did he start the generator?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't start it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he didn't start it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('I stopped the conveyor belt immediately.')} className="text-red-600 hover:text-red-800 transition-colors">
                      I stopped the conveyor belt immediately.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu desliguei a esteira transportadora imediatamente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you stop the conveyor belt?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you stop the conveyor belt?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't stop it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't stop it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We inspected the valves yesterday.')} className="text-red-600 hover:text-red-800 transition-colors">
                      We inspected the valves yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos as válvulas ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we inspect the valves?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we inspect the valves?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't inspect them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't inspect them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("I didn't operate heavy machinery last month.")} className="text-red-600 hover:text-red-800 transition-colors">
                      I didn't operate heavy machinery last month.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não opere máquinas pesadas no mês passado.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you operate heavy machinery?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you operate heavy machinery?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("She didn't check the pressure gauge yesterday.")} className="text-red-600 hover:text-red-800 transition-colors">
                      She didn't check the pressure gauge yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela não verificou o manômetro ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she check it?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she check it?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("They didn't repair the pump last week.")} className="text-red-600 hover:text-red-800 transition-colors">
                      They didn't repair the pump last week.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles não consertaram a bomba na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did they repair the pump?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did they repair the pump?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't repair it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't repair it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Machinery & Equipment Vocabulary</h2>
              <p className="mt-2 text-red-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('machine')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  machine
                </button> = máquina
              </li>
              <li>
                <button 
                  onClick={() => playAudio('equipment')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  equipment
                </button> = equipamento
              </li>
              <li>
                <button 
                  onClick={() => playAudio('engine')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  engine
                </button> = motor
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pump')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  pump
                </button> = bomba
              </li>
              <li>
                <button 
                  onClick={() => playAudio('compressor')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  compressor
                </button> = compressor
              </li>
              <li>
                <button 
                  onClick={() => playAudio('generator')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  generator
                </button> = gerador
              </li>
              <li>
                <button 
                  onClick={() => playAudio('valve')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  valve
                </button> = válvula
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pipe')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  pipe
                </button> = tubo / cano
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pressure gauge')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  pressure gauge
                </button> = manômetro
              </li>
              <li>
                <button 
                  onClick={() => playAudio('temperature sensor')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  temperature sensor
                </button> = sensor de temperatura
              </li>
              <li>
                <button 
                  onClick={() => playAudio('conveyor belt')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  conveyor belt
                </button> = esteira transportadora
              </li>
              <li>
                <button 
                  onClick={() => playAudio('control panel')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  control panel
                </button> = painel de controle
              </li>
              <li>
                <button 
                  onClick={() => playAudio('alarm system')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  alarm system
                </button> = sistema de alarme
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety valve')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety valve
                </button> = válvula de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('hydraulic system')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  hydraulic system
                </button> = sistema hidráulico
              </li>
              <li>
                <button 
                  onClick={() => playAudio('cooling tower')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  cooling tower
                </button> = torre de resfriamento
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I checked the <button onClick={() => playAudio('pressure gauge')} className="text-red-600 font-bold hover:text-red-800 transition-colors">pressure gauge</button> yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu verifiquei o manômetro ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you check the pressure gauge?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you check the pressure gauge?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    He operated the <button onClick={() => playAudio('machine')} className="text-red-600 font-bold hover:text-red-800 transition-colors">machine</button> last week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele operou a máquina na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did he operate the machine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did he operate the machine?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't operate it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he didn't operate it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We maintained the <button onClick={() => playAudio('compressor')} className="text-red-600 font-bold hover:text-red-800 transition-colors">compressor</button> on Friday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós fizemos manutenção do compressor na sexta-feira.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we maintain the compressor?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we maintain the compressor?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't maintain it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't maintain it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('alarm system')} className="text-red-600 font-bold hover:text-red-800 transition-colors">alarm system</button> worked yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme funcionou ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the alarm system work?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the alarm system work?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't work.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't work.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We inspected the <button onClick={() => playAudio('hydraulic system')} className="text-red-600 font-bold hover:text-red-800 transition-colors">hydraulic system</button> last month.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos o sistema hidráulico no mês passado.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we inspect the hydraulic system?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we inspect the hydraulic system?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't inspect it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't inspect it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('conveyor belt')} className="text-red-600 font-bold hover:text-red-800 transition-colors">conveyor belt</button> stopped at noon.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A esteira transportadora parou ao meio-dia.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the conveyor belt stop?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the conveyor belt stop?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't stop.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't stop.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She checked the <button onClick={() => playAudio('temperature sensor')} className="text-red-600 font-bold hover:text-red-800 transition-colors">temperature sensor</button> this morning.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela verificou o sensor de temperatura esta manhã.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she check the temperature sensor?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she check the temperature sensor?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('safety valve')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety valve</button> was important.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A válvula de segurança era importante.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Was the safety valve important?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Was the safety valve important?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't important.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it wasn't important.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We started the <button onClick={() => playAudio('generator')} className="text-red-600 font-bold hover:text-red-800 transition-colors">generator</button> at 7 AM yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós ligamos o gerador às 7 da manhã ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we start the generator?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we start the generator?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't start it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't start it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('pipes')} className="text-red-600 font-bold hover:text-red-800 transition-colors">pipes</button> needed inspection.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Os tubos precisavam de inspeção.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the pipes need inspection?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the pipes need inspection?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't need it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't need it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Technician</h2>
              <p className="mt-2 text-red-100 italic">
                Practice common phrases for equipment operation and maintenance
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('Check the pressure gauge before starting.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  Check the pressure gauge before starting.
                </button> = Verifique o manômetro antes de ligar.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('The equipment is working normally.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  The equipment is working normally.
                </button> = O equipamento está funcionando normalmente.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('We need to repair the pump.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  We need to repair the pump.
                </button> = Nós precisamos consertar a bomba.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('Stop the machine immediately!')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  Stop the machine immediately!
                </button> = Desligue a máquina imediatamente!
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I checked the <button onClick={() => playAudio('temperature sensor')} className="text-red-600 font-bold hover:text-red-800 transition-colors">temperature sensor</button> before starting.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu verifiquei o sensor de temperatura antes de ligar.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you check the temperature sensor?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you check the temperature sensor?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('compressor')} className="text-red-600 font-bold hover:text-red-800 transition-colors">compressor</button> worked normally yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O compressor funcionou normalmente ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the compressor work normally?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the compressor work normally?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't work.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't work.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We repaired the <button onClick={() => playAudio('hydraulic system')} className="text-red-600 font-bold hover:text-red-800 transition-colors">hydraulic system</button> last week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós consertamos o sistema hidráulico na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we repair the hydraulic system?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we repair the hydraulic system?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't repair it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't repair it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I stopped the <button onClick={() => playAudio('engine')} className="text-red-600 font-bold hover:text-red-800 transition-colors">engine</button> immediately.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu desliguei o motor imediatamente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you stop the engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you stop the engine?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't stop it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't stop it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We inspected the <button onClick={() => playAudio('equipment')} className="text-red-600 font-bold hover:text-red-800 transition-colors">equipment</button> every day.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos o equipamento todos os dias.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we inspect the equipment?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we inspect the equipment?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't inspect it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't inspect it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('alarm system')} className="text-red-600 font-bold hover:text-red-800 transition-colors">alarm system</button> activated at 3 PM.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme ativou às 15h.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the alarm system activate?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the alarm system activate?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't activate.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't activate.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She operated the <button onClick={() => playAudio('control panel')} className="text-red-600 font-bold hover:text-red-800 transition-colors">control panel</button> correctly.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela operou o painel de controle corretamente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she operate the control panel?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she operate the control panel?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't operate it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't operate it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We replaced the <button onClick={() => playAudio('pipe')} className="text-red-600 font-bold hover:text-red-800 transition-colors">pipe</button> on Tuesday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós substituímos o tubo na terça-feira.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we replace the pipe?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we replace the pipe?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't replace it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't replace it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('cooling tower')} className="text-red-600 font-bold hover:text-red-800 transition-colors">cooling tower</button> required maintenance.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A torre de resfriamento requeria manutenção.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the cooling tower require maintenance?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the cooling tower require maintenance?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I didn't forget to check the <button onClick={() => playAudio('safety valve')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety valve</button>.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não esqueci de verificar a válvula de segurança.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you check the safety valve?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you check the safety valve?
                    </button> - 
                    <button onClick={() => playAudio("Yes, I checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, I checked it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill - Past Tense Focus */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Past Tense & Questions</h2>
              <p className="mt-2 text-red-100 italic">
                Learn to use past tense with questions and negatives
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="font-bold text-red-700">Past Tense - Regular Verbs</p>
              <p>
                <button 
                  onClick={() => playAudio('I checked the valve before operation.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  I checked the valve before operation.
                </button> = Eu verifiquei a válvula antes da operação.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('The machine ran smoothly.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  The machine ran smoothly.
                </button> = A máquina funcionou suavemente.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('The pump did not work yesterday.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  The pump did not work yesterday.
                </button> = A bomba não funcionou ontem.
              </p>
              <p className="font-bold text-red-700 mt-4">Past Tense - Questions</p>
              <p>
                <button 
                  onClick={() => playAudio('Did you inspect the system?')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  Did you inspect the system?
                </button> = Você inspecionou o sistema?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('Did they follow the safety procedures?')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  Did they follow the safety procedures?
                </button> = Eles seguiram os procedimentos de segurança?
              </p>
              <p className="font-bold text-red-700 mt-4">Past Tense - Negative</p>
              <p>
                <button 
                  onClick={() => playAudio('We did not maintain the equipment.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  We did not maintain the equipment.
                </button> = Nós não fizemos manutenção do equipamento.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('She did not check the readings.')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  She did not check the readings.
                </button> = Ela não verificou as leituras.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('checked')} className="text-red-600 font-bold hover:text-red-800 transition-colors">checked</button> the pressure gauge before operation.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu verifiquei o manômetro antes da operação.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you check the pressure gauge?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you check the pressure gauge?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The compressor <button onClick={() => playAudio('ran')} className="text-red-600 font-bold hover:text-red-800 transition-colors">ran</button> smoothly.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O compressor funcionou suavemente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the compressor run smoothly?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the compressor run smoothly?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't run smoothly.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't run smoothly.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The conveyor belt <button onClick={() => playAudio('did not work')} className="text-red-600 font-bold hover:text-red-800 transition-colors">did not work</button> yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A esteira transportadora não funcionou ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the conveyor belt work?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the conveyor belt work?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't work.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't work.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you')} className="text-red-600 font-bold hover:text-red-800 transition-colors">Did you</button> inspect the hydraulic system?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você inspecionou o sistema hidráulico?</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio("No, I didn't inspect the hydraulic system.")} className="text-red-600 hover:text-red-800 transition-colors">
                      No, I didn't inspect the hydraulic system.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did they')} className="text-red-600 font-bold hover:text-red-800 transition-colors">Did they</button> follow the safety procedures?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles seguiram os procedimentos de segurança?</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio("No, they didn't follow the safety procedures.")} className="text-red-600 hover:text-red-800 transition-colors">
                      No, they didn't follow the safety procedures.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('did not')} className="text-red-600 font-bold hover:text-red-800 transition-colors">did not</button> maintain the cooling tower.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós não fizemos manutenção na torre de resfriamento.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we maintain the cooling tower?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we maintain the cooling tower?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't maintain it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't maintain it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('did not')} className="text-red-600 font-bold hover:text-red-800 transition-colors">did not</button> check the temperature sensor.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela não verificou o sensor de temperatura.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she check the temperature sensor?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she check the temperature sensor?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you')} className="text-red-600 font-bold hover:text-red-800 transition-colors">Did you</button> repair the pump last week?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você consertou a bomba na semana passada?</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio("No, I didn't repair the pump last week.")} className="text-red-600 hover:text-red-800 transition-colors">
                      No, I didn't repair the pump last week.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The engine <button onClick={() => playAudio('did not')} className="text-red-600 font-bold hover:text-red-800 transition-colors">did not</button> start this morning.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O motor não ligou esta manhã.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the engine start?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the engine start?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't start.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't start.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did we')} className="text-red-600 font-bold hover:text-red-800 transition-colors">Did we</button> record all the readings?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós registramos todas as leituras?</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio("No, we didn't record all the readings.")} className="text-red-600 hover:text-red-800 transition-colors">
                      No, we didn't record all the readings.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-red-100 italic">
              Replace the red words to practice real equipment operation phrases
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I checked the pressure gauge before starting.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I checked the <button 
                            onClick={() => playAudio('pressure gauge')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >pressure gauge</button> before starting.
                        </p>
                        <p className="text-sm text-gray-600">Eu verifiquei o manômetro antes de ligar.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did you check the pressure gauge?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did you check the pressure gauge?
                          </button> - 
                          <button onClick={() => playAudio("No, I didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, I didn't check it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The engine ran normally yesterday.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. The <button 
                            onClick={() => playAudio('engine')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >engine</button> ran normally yesterday.
                        </p>
                        <p className="text-sm text-gray-600">O motor funcionou normalmente ontem.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did the engine run normally?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did the engine run normally?
                          </button> - 
                          <button onClick={() => playAudio("No, it didn't run.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, it didn't run.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We repaired the pump last week.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. We repaired the <button 
                            onClick={() => playAudio('pump')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >pump</button> last week.
                        </p>
                        <p className="text-sm text-gray-600">Nós consertamos a bomba na semana passada.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did we repair the pump?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did we repair the pump?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't repair it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, we didn't repair it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I stopped the conveyor belt immediately.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. I stopped the <button 
                            onClick={() => playAudio('conveyor belt')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >conveyor belt</button> immediately.
                        </p>
                        <p className="text-sm text-gray-600">Eu desliguei a esteira transportadora imediatamente.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did you stop the conveyor belt?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did you stop the conveyor belt?
                          </button> - 
                          <button onClick={() => playAudio("No, I didn't stop it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, I didn't stop it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The alarm system activated at 2 PM.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. The <button 
                            onClick={() => playAudio('alarm system')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >alarm system</button> activated at 2 PM.
                        </p>
                        <p className="text-sm text-gray-600">O sistema de alarme ativou às 14h.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did the alarm system activate?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did the alarm system activate?
                          </button> - 
                          <button onClick={() => playAudio("No, it didn't activate.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, it didn't activate.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We inspected the cooling tower yesterday.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. We inspected the <button 
                            onClick={() => playAudio('cooling tower')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >cooling tower</button> yesterday.
                        </p>
                        <p className="text-sm text-gray-600">Nós inspecionamos a torre de resfriamento ontem.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did we inspect the cooling tower?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did we inspect the cooling tower?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't inspect it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, we didn't inspect it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('You checked the safety valve yesterday.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. You checked the <button 
                            onClick={() => playAudio('safety valve')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >safety valve</button> yesterday.
                        </p>
                        <p className="text-sm text-gray-600">Você verificou a válvula de segurança ontem.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did you check the safety valve?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did you check the safety valve?
                          </button> - 
                          <button onClick={() => playAudio("Yes, I checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, I checked it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Did you operate the control panel yesterday?')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Did you operate the <button 
                            onClick={() => playAudio('control panel')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >control panel</button> yesterday?
                        </p>
                        <p className="text-sm text-gray-600">Você operou o painel de controle ontem?</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio("No, I didn't operate the control panel.")} className="text-red-600 hover:text-red-800 transition-colors">
                            No, I didn't operate the control panel.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The temperature sensor malfunctioned yesterday.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. The <button 
                            onClick={() => playAudio('temperature sensor')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >temperature sensor</button> malfunctioned yesterday.
                        </p>
                        <p className="text-sm text-gray-600">O sensor de temperatura apresentou defeito ontem.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did the temperature sensor malfunction?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did the temperature sensor malfunction?
                          </button> - 
                          <button onClick={() => playAudio("No, it didn't malfunction.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, it didn't malfunction.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We recorded the readings in the logbook yesterday.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. We recorded the readings in the <button 
                            onClick={() => playAudio('logbook')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >logbook</button> yesterday.
                        </p>
                        <p className="text-sm text-gray-600">Nós registramos as leituras no livro de registro ontem.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Did we record the readings?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Did we record the readings?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't record them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, we didn't record them.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
                        alt="Offshore oil platform at sea"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Offshore Oil Platform - North Sea
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Engineer checking control panel"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Technician checking control panel
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - WRAP UP */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <p className="mt-2 text-red-100 italic">
                Essential structures for equipment operation and maintenance
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Equipment Status */}
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <button onClick={() => playAudio('The machine ran smoothly.')} className="hover:text-red-200 transition-colors">
                  The machine ran smoothly.
                </button>
                <span className="text-sm text-red-300 ml-2">A máquina funcionou suavemente.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('The pump needed repair.')} className="hover:text-red-200 transition-colors">
                  The pump needed repair.
                </button>
                <span className="text-sm text-red-300 ml-2">A bomba precisava de conserto.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('I checked the pressure gauge.')} className="hover:text-red-200 transition-colors">
                  I checked the pressure gauge.
                </button>
                <span className="text-sm text-red-300 ml-2">Eu verifiquei o manômetro.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('I stopped the equipment.')} className="hover:text-red-200 transition-colors">
                  I stopped the equipment.
                </button>
                <span className="text-sm text-red-300 ml-2">Eu desliguei o equipamento.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('They followed safety procedures.')} className="hover:text-red-200 transition-colors">
                  They followed safety procedures.
                </button>
                <span className="text-sm text-red-300 ml-2">Eles seguiram os procedimentos de segurança.</span>
              </p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop"
                alt="Engineer with safety helmet"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
                quality={100}
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button onClick={() => playAudio('Did you check the safety valve?')} className="hover:text-red-600 transition-colors">
                  Did you check the safety valve?
                </button>
                <span className="font-bold"> And you?</span>
                <p className="text-sm text-gray-600 mt-1">Você verificou a válvula de segurança? E você?</p>
              </div>
            </div>

            {/* Coluna direita - Sign-Off */}
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Bye! See you.')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Bye! See you.')} className="hover:text-red-200 transition-colors">
                    Bye! See you.
                  </button>
                  <span className="text-sm text-red-300 ml-2">Tchau! Até mais.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('See you later.')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('See you later.')} className="hover:text-red-200 transition-colors">
                    See you later.
                  </button>
                  <span className="text-sm text-red-300 ml-2">Até mais tarde.</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Good night!')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Good night!')} className="hover:text-red-200 transition-colors">
                    Good night!
                  </button>
                  <span className="text-sm text-red-300 ml-2">Boa noite!</span>
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
            className="inline-block rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-orange-500 hover:to-red-600 active:animate-glow"
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
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}