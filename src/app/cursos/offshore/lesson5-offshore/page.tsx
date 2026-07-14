"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonEngineRoomPPE() {
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
        backgroundImage: `url("https://github.com/Sullivan-code/english-audios/blob/main/ChatGPT%20Image%201%20de%20jul.%20de%202026%2C%2014_59_42.png?raw=true")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Container principal com fade vermelho e laranja */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-red-100 via-orange-100 to-red-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-red-300/50">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 5 - Engine Room & PPE
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn about Personal Protective Equipment (PPE) and meet the international team working in the engine room! 🛠️⛑️
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Engineer with safety helmet and protective equipment"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Engine Room - Safety First! ⛑️</p>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS - PPE & Safety Actions</h2>
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
                  onClick={() => playAudio('to wear')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to wear
                </button> = vestir / usar (roupas/equipamentos)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to protect')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to protect
                </button> = proteger
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
                  onClick={() => playAudio('to inspect')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to inspect
                </button> = inspecionar
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
                  onClick={() => playAudio('to follow')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to follow
                </button> = seguir (regras/procedimentos)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to ensure')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  to ensure
                </button> = garantir / assegurar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('I wore my safety helmet yesterday.')} className="text-red-600 hover:text-red-800 transition-colors">
                      I wore my safety helmet yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu usei meu capacete de segurança ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety helmet?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you wear your safety helmet?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear my safety helmet.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('She wore safety goggles in the engine room.')} className="text-red-600 hover:text-red-800 transition-colors">
                      She wore safety goggles in the engine room.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela usou óculos de segurança na sala de máquinas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she wear safety goggles?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she wear safety goggles?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't wear safety goggles.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't wear them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We wore ear protection during the test.')} className="text-red-600 hover:text-red-800 transition-colors">
                      We wore ear protection during the test.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós usamos proteção auricular durante o teste.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we wear ear protection?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we wear ear protection?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't wear ear protection.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('They followed all safety procedures.')} className="text-red-600 hover:text-red-800 transition-colors">
                      They followed all safety procedures.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles seguiram todos os procedimentos de segurança.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did they follow all safety procedures?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did they follow all safety procedures?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't follow them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't follow them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('I checked my PPE before entering.')} className="text-red-600 hover:text-red-800 transition-colors">
                      I checked my PPE before entering.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu verifiquei meu EPI antes de entrar.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you check your PPE?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you check your PPE?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't check my PPE.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('He inspected the fire extinguisher yesterday.')} className="text-red-600 hover:text-red-800 transition-colors">
                      He inspected the fire extinguisher yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele inspecionou o extintor de incêndio ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did he inspect the fire extinguisher?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did he inspect the fire extinguisher?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't inspect it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he didn't inspect it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We maintained the safety equipment regularly.')} className="text-red-600 hover:text-red-800 transition-colors">
                      We maintained the safety equipment regularly.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós fizemos manutenção do equipamento de segurança regularmente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we maintain the safety equipment?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we maintain the safety equipment?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't maintain it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't maintain it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('She ensured all workers wore PPE.')} className="text-red-600 hover:text-red-800 transition-colors">
                      She ensured all workers wore PPE.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela garantiu que todos os trabalhadores usassem EPI.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she ensure all workers wore PPE?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she ensure all workers wore PPE?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't ensure it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't ensure it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("I didn't wear my safety boots last week.")} className="text-red-600 hover:text-red-800 transition-colors">
                      I didn't wear my safety boots last week.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu não usei minhas botas de segurança na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety boots?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you wear your safety boots?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't wear them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio("They didn't follow the safety guidelines.")} className="text-red-600 hover:text-red-800 transition-colors">
                      They didn't follow the safety guidelines.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles não seguiram as diretrizes de segurança.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did they follow the safety guidelines?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did they follow the safety guidelines?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't follow them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't follow them.
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
              <h2 className="text-2xl font-bold">🔹 PPE & Engine Room Vocabulary</h2>
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
                  onClick={() => playAudio('PPE')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  PPE
                </button> = EPI (Equipamento de Proteção Individual)
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety helmet')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety helmet
                </button> = capacete de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety goggles')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety goggles
                </button> = óculos de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('ear protection')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  ear protection
                </button> = proteção auricular
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety boots')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety boots
                </button> = botas de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety vest')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety vest
                </button> = colete de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('fire extinguisher')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  fire extinguisher
                </button> = extintor de incêndio
              </li>
              <li>
                <button 
                  onClick={() => playAudio('first aid kit')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  first aid kit
                </button> = kit de primeiros socorros
              </li>
              <li>
                <button 
                  onClick={() => playAudio('engine room')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  engine room
                </button> = sala de máquinas
              </li>
              <li>
                <button 
                  onClick={() => playAudio('main engine')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  main engine
                </button> = motor principal
              </li>
              <li>
                <button 
                  onClick={() => playAudio('auxiliary engine')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  auxiliary engine
                </button> = motor auxiliar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('emergency stop')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  emergency stop
                </button> = parada de emergência
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety sign')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety sign
                </button> = placa de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('warning light')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  warning light
                </button> = luz de aviso
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
                  onClick={() => playAudio('safety procedure')} 
                  className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                >
                  safety procedure
                </button> = procedimento de segurança
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I wore my <button onClick={() => playAudio('safety helmet')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety helmet</button> yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu usei meu capacete de segurança ontem.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety helmet?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you wear your safety helmet?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She checked the <button onClick={() => playAudio('fire extinguisher')} className="text-red-600 font-bold hover:text-red-800 transition-colors">fire extinguisher</button> this morning.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela verificou o extintor de incêndio esta manhã.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she check the fire extinguisher?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she check the fire extinguisher?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't check it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't check it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We used the <button onClick={() => playAudio('first aid kit')} className="text-red-600 font-bold hover:text-red-800 transition-colors">first aid kit</button> last week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós usamos o kit de primeiros socorros na semana passada.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we use the first aid kit?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we use the first aid kit?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't use it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't use it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    He wore <button onClick={() => playAudio('safety goggles')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety goggles</button> in the engine room.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele usou óculos de segurança na sala de máquinas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did he wear safety goggles?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did he wear safety goggles?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't wear them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he didn't wear them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('alarm system')} className="text-red-600 font-bold hover:text-red-800 transition-colors">alarm system</button> activated during the drill.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme ativou durante o treinamento.</p>
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
                    We inspected the <button onClick={() => playAudio('main engine')} className="text-red-600 font-bold hover:text-red-800 transition-colors">main engine</button> on Monday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos o motor principal na segunda-feira.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did we inspect the main engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did we inspect the main engine?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't inspect it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we didn't inspect it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She wore <button onClick={() => playAudio('ear protection')} className="text-red-600 font-bold hover:text-red-800 transition-colors">ear protection</button> during the test.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela usou proteção auricular durante o teste.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did she wear ear protection?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did she wear ear protection?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't wear it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('safety sign')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety sign</button> indicated the exit.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A placa de segurança indicava a saída.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did the safety sign indicate the exit?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did the safety sign indicate the exit?
                    </button> - 
                    <button onClick={() => playAudio("No, it didn't.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, it didn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I wore my <button onClick={() => playAudio('safety vest')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety vest</button> in the engine room.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu usei meu colete de segurança na sala de máquinas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety vest?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did you wear your safety vest?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    They followed the <button onClick={() => playAudio('safety procedure')} className="text-red-600 font-bold hover:text-red-800 transition-colors">safety procedure</button> correctly.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles seguiram o procedimento de segurança corretamente.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Did they follow the safety procedure?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Did they follow the safety procedure?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't follow it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they didn't follow it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - International Team + Frases Úteis com Drill */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 International Engine Room Team</h2>
              <p className="mt-2 text-red-100 italic">
                Meet the crew from different countries! Click to hear their roles and responsibilities.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Lars')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇩🇰 Lars (Denmark)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am the Chief Engineer. I have worked here for 15 years. I always wear my safety helmet and safety goggles.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am the Chief Engineer. I have worked here for 15 years.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou o Engenheiro Chefe. Trabalho aqui há 15 anos.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Lars worked here for 15 years?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Lars worked here for 15 years?
                  </button> - 
                  <button onClick={() => playAudio("Yes, he has worked here for 15 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, he has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Lars worked here for 14 years?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Lars worked here for 14 years?
                  </button> - 
                  <button onClick={() => playAudio("No, he hasn't worked here for 14 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, he hasn't.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Lars worked here since 2015?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Lars worked here since 2015?
                  </button> - 
                  <button onClick={() => playAudio("No, he has worked here since 2011.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, he has worked here since 2011.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Ingrid')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇸🇪 Ingrid (Sweden)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am the First Engineer. I have inspected the main engine today. I always wear ear protection.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am the First Engineer. I have inspected the main engine today.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou a Primeira Engenheira. Inspecionei o motor principal hoje.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Ingrid inspected the main engine today?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Ingrid inspected the main engine today?
                  </button> - 
                  <button onClick={() => playAudio("Yes, she has inspected the main engine today.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, she has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Ingrid inspected the main engine this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Ingrid inspected the main engine this week?
                  </button> - 
                  <button onClick={() => playAudio("No, she hasn't inspected it this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, she hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Anders')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇳🇴 Anders (Norway)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am the Second Engineer. I have maintained the auxiliary engine. I always wear safety boots.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am the Second Engineer. I have maintained the auxiliary engine.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou o Segundo Engenheiro. Fiz manutenção no motor auxiliar.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Anders maintained the auxiliary engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Anders maintained the auxiliary engine?
                  </button> - 
                  <button onClick={() => playAudio("Yes, he has maintained the auxiliary engine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, he has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Anders maintained the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Anders maintained the main engine?
                  </button> - 
                  <button onClick={() => playAudio("No, he hasn't maintained the main engine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, he hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Lena')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇫🇮 Lena (Finland)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am the Third Engineer. I have checked the fire extinguishers. I always wear my safety vest.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am the Third Engineer. I have checked the fire extinguishers.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou a Terceira Engenheira. Verifiquei os extintores de incêndio.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Lena checked the fire extinguishers?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Lena checked the fire extinguishers?
                  </button> - 
                  <button onClick={() => playAudio("Yes, she has checked the fire extinguishers.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, she has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Lena checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Lena checked the alarm system?
                  </button> - 
                  <button onClick={() => playAudio("No, she hasn't checked the alarm system.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, she hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Jose')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇧🇷 José (Brazil)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am a Motorman. I have inspected the valves today. I always wear safety goggles and ear protection.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am a Motorman. I have inspected the valves today.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou um Motorman. Inspecionei as válvulas hoje.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has José inspected the valves today?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has José inspected the valves today?
                  </button> - 
                  <button onClick={() => playAudio("Yes, he has inspected the valves today.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, he has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has José inspected the pipes today?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has José inspected the pipes today?
                  </button> - 
                  <button onClick={() => playAudio("No, he hasn't inspected the pipes today.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, he hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Maria')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇨🇴 María (Colombia)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am a Fitter. I have repaired the pipes this week. I always wear my safety helmet and safety boots.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am a Fitter. I have repaired the pipes this week.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou uma Fitter. Reparei os tubos esta semana.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has María repaired the pipes this week?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has María repaired the pipes this week?
                  </button> - 
                  <button onClick={() => playAudio("Yes, she has repaired the pipes this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, she has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has María repaired the valves this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has María repaired the valves this week?
                  </button> - 
                  <button onClick={() => playAudio("No, she hasn't repaired the valves this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, she hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Carlos')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇲🇽 Carlos (Mexico)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am a Wiper. I have cleaned the engine room. I always wear my safety vest and safety boots.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am a Wiper. I have cleaned the engine room.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou um Wiper. Limpei a sala de máquinas.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Carlos cleaned the engine room?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Carlos cleaned the engine room?
                  </button> - 
                  <button onClick={() => playAudio("Yes, he has cleaned the engine room.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, he has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Carlos cleaned the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Carlos cleaned the main engine?
                  </button> - 
                  <button onClick={() => playAudio("No, he hasn't cleaned the main engine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, he hasn't.
                  </button>
                </p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-2xl border border-orange-200">
                <p className="font-bold text-lg">
                  <button onClick={() => playAudio('Elena')} className="text-red-600 hover:text-red-800 transition-colors">
                    🇦🇷 Elena (Argentina)
                  </button>
                </p>
                <p className="text-gray-700">
                  <button onClick={() => playAudio('I am an Electrician. I have checked the alarm system. I always wear ear protection and safety goggles.')} className="text-red-600 hover:text-red-800 transition-colors">
                    I am an Electrician. I have checked the alarm system.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Sou uma Eletricista. Verifiquei o sistema de alarme.</p>
                <p className="text-sm text-red-600 mt-1">
                  <button onClick={() => playAudio('Has Elena checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors">
                    Has Elena checked the alarm system?
                  </button> - 
                  <button onClick={() => playAudio("Yes, she has checked the alarm system.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    Yes, she has.
                  </button>
                  <br />
                  <button onClick={() => playAudio('Has Elena checked the fire extinguishers?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                    Has Elena checked the fire extinguishers?
                  </button> - 
                  <button onClick={() => playAudio("No, she hasn't checked the fire extinguishers.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                    No, she hasn't.
                  </button>
                </p>
              </div>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Lars has worked here for 15 years.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Lars trabalha aqui há 15 anos.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Lars worked here for 15 years?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Lars worked here for 15 years?
                    </button> - 
                    <button onClick={() => playAudio("Yes, he has worked here for 15 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, he has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Lars worked here for 14 years?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Lars worked here for 14 years?
                    </button> - 
                    <button onClick={() => playAudio("No, he hasn't worked here for 14 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he hasn't.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Lars worked here since 2015?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Lars worked here since 2015?
                    </button> - 
                    <button onClick={() => playAudio("No, he has worked here since 2011.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he has worked here since 2011.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Ingrid has inspected the main engine today.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ingrid inspecionou o motor principal hoje.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Ingrid inspected the main engine today?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Ingrid inspected the main engine today?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has inspected it today.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Ingrid inspected the main engine this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Ingrid inspected the main engine this week?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't inspected it this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Anders has maintained the auxiliary engine.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Anders fez manutenção no motor auxiliar.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Anders maintained the auxiliary engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Anders maintained the auxiliary engine?
                    </button> - 
                    <button onClick={() => playAudio("Yes, he has maintained it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, he has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Anders maintained the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Anders maintained the main engine?
                    </button> - 
                    <button onClick={() => playAudio("No, he hasn't maintained the main engine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Lena has checked the fire extinguishers.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Lena verificou os extintores de incêndio.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Lena checked the fire extinguishers?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Lena checked the fire extinguishers?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has checked them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Lena checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Lena checked the alarm system?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't checked the alarm system.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    José has inspected the valves today.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">José inspecionou as válvulas hoje.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has José inspected the valves today?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has José inspected the valves today?
                    </button> - 
                    <button onClick={() => playAudio("Yes, he has inspected them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, he has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has José inspected the pipes today?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has José inspected the pipes today?
                    </button> - 
                    <button onClick={() => playAudio("No, he hasn't inspected the pipes today.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    María has repaired the pipes this week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">María reparou os tubos esta semana.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has María repaired the pipes this week?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has María repaired the pipes this week?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has repaired them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has María repaired the valves this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has María repaired the valves this week?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't repaired the valves this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Carlos has cleaned the engine room.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Carlos limpou a sala de máquinas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Carlos cleaned the engine room?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Carlos cleaned the engine room?
                    </button> - 
                    <button onClick={() => playAudio("Yes, he has cleaned it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, he has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Carlos cleaned the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Carlos cleaned the main engine?
                    </button> - 
                    <button onClick={() => playAudio("No, he hasn't cleaned the main engine.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    Elena has checked the alarm system.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Elena verificou o sistema de alarme.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has Elena checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has Elena checked the alarm system?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has Elena checked the fire extinguishers?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has Elena checked the fire extinguishers?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't checked the fire extinguishers.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    The team has followed all safety procedures today.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A equipe seguiu todos os procedimentos de segurança hoje.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has the team followed all safety procedures today?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has the team followed all safety procedures today?
                    </button> - 
                    <button onClick={() => playAudio("Yes, they have followed them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, they have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has the team followed all safety procedures yesterday?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has the team followed all safety procedures yesterday?
                    </button> - 
                    <button onClick={() => playAudio("No, they haven't followed them yesterday.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they haven't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We have worn our PPE every day.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós usamos nosso EPI todos os dias.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have you worn your PPE every day?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have you worn your PPE every day?
                    </button> - 
                    <button onClick={() => playAudio("Yes, we have worn it every day.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, we have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you worn your PPE every week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you worn your PPE every week?
                    </button> - 
                    <button onClick={() => playAudio("No, we haven't worn it every week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we haven't.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill - Present Perfect Focus */}
        <div className="bg-white border-2 border-red-300 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Present Perfect</h2>
              <p className="mt-2 text-red-100 italic">
                Learn to talk about past experiences with present relevance
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
              <p className="font-bold text-red-700 text-xl">📚 Present Perfect - Explicação</p>
              <p className="text-gray-700">
                <strong>O que é?</strong> O Present Perfect é usado para falar sobre ações que começaram no passado e têm relação com o presente. 
                Em português, geralmente corresponde ao "ter" + particípio passado.
              </p>
              <p className="text-gray-700">
                <strong>Estrutura:</strong> <span className="font-bold text-red-600">have/has</span> + <span className="font-bold text-red-600">particípio passado</span> (verbos regulares terminam em -ed, verbos irregulares têm forma própria)
              </p>
              
              <div className="bg-white p-4 rounded-xl border-2 border-red-200">
                <p className="font-bold text-red-700">Quando usar:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Experiências de vida:</strong> 
                    <button onClick={() => playAudio('I have worked in many countries.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      I have worked in many countries.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Já trabalhei em muitos países - experiência)</span>
                  </li>
                  <li>
                    <strong>Ações recentes com resultado no presente:</strong>
                    <button onClick={() => playAudio('She has checked the fire extinguisher.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      She has checked the fire extinguisher.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Ela verificou o extintor - e está verificado agora)</span>
                  </li>
                  <li>
                    <strong>Ações que continuam até o presente:</strong>
                    <button onClick={() => playAudio('We have worked here since 2020.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      We have worked here since 2020.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Trabalhamos aqui desde 2020 - ainda trabalhamos)</span>
                  </li>
                  <li>
                    <strong>Com "already" (já) e "yet" (ainda não):</strong>
                    <button onClick={() => playAudio('I have already checked the valves.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      I have already checked the valves.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Já verifiquei as válvulas)</span>
                    <br />
                    <button onClick={() => playAudio('I haven\'t checked the valves yet.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      I haven't checked the valves yet.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Ainda não verifiquei as válvulas)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-2 border-orange-200">
                <p className="font-bold text-orange-700">⚠️ Diferença entre Present Perfect e Simple Past:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>
                    <strong>Present Perfect</strong> - foco no presente, sem tempo específico:
                    <button onClick={() => playAudio('I have inspected the engine.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      I have inspected the engine.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Inspecionei o motor - resultado importa agora)</span>
                  </li>
                  <li>
                    <strong>Simple Past</strong> - foco no passado, com tempo específico:
                    <button onClick={() => playAudio('I inspected the engine yesterday.')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      I inspected the engine yesterday.
                    </button>
                    <span className="text-sm text-gray-500 ml-2">(Inspecionei o motor ontem - tempo específico)</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-4 rounded-xl border-2 border-red-200">
                <p className="font-bold text-red-700">📝 Verbos Irregulares comuns (Past Participle):</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>work → <button onClick={() => playAudio('worked')} className="text-red-600 hover:text-red-800 transition-colors">worked</button> (regular)</li>
                  <li>check → <button onClick={() => playAudio('checked')} className="text-red-600 hover:text-red-800 transition-colors">checked</button> (regular)</li>
                  <li>wear → <button onClick={() => playAudio('worn')} className="text-red-600 hover:text-red-800 transition-colors">worn</button> (irregular)</li>
                  <li>inspect → <button onClick={() => playAudio('inspected')} className="text-red-600 hover:text-red-800 transition-colors">inspected</button> (regular)</li>
                  <li>maintain → <button onClick={() => playAudio('maintained')} className="text-red-600 hover:text-red-800 transition-colors">maintained</button> (regular)</li>
                  <li>repair → <button onClick={() => playAudio('repaired')} className="text-red-600 hover:text-red-800 transition-colors">repaired</button> (regular)</li>
                  <li>follow → <button onClick={() => playAudio('followed')} className="text-red-600 hover:text-red-800 transition-colors">followed</button> (regular)</li>
                  <li>ensure → <button onClick={() => playAudio('ensured')} className="text-red-600 hover:text-red-800 transition-colors">ensured</button> (regular)</li>
                </ul>
              </div>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-red-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('have worked')} className="text-red-600 font-bold hover:text-red-800 transition-colors">have worked</button> here for 10 years.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu trabalho aqui há 10 anos.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have you worked here for 10 years?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have you worked here for 10 years?
                    </button> - 
                    <button onClick={() => playAudio("Yes, I have worked here for 10 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, I have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you worked here for 12 years?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you worked here for 12 years?
                    </button> - 
                    <button onClick={() => playAudio("No, I haven't worked here for 12 years.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I haven't.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you worked here since 2018?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you worked here since 2018?
                    </button> - 
                    <button onClick={() => playAudio("No, I have worked here since 2016.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I have worked here since 2016.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('has checked')} className="text-red-600 font-bold hover:text-red-800 transition-colors">has checked</button> the fire extinguisher.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela verificou o extintor de incêndio.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has she checked the fire extinguisher?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has she checked the fire extinguisher?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has she checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has she checked the alarm system?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('have worn')} className="text-red-600 font-bold hover:text-red-800 transition-colors">have worn</button> our PPE every day.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós usamos nosso EPI todos os dias.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have you worn your PPE every day?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have you worn your PPE every day?
                    </button> - 
                    <button onClick={() => playAudio("Yes, we have worn it every day.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, we have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you worn your PPE every week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you worn your PPE every week?
                    </button> - 
                    <button onClick={() => playAudio("No, we haven't worn it every week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we haven't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    They <button onClick={() => playAudio('have inspected')} className="text-red-600 font-bold hover:text-red-800 transition-colors">have inspected</button> the engine room.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles inspecionaram a sala de máquinas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have they inspected the engine room?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have they inspected the engine room?
                    </button> - 
                    <button onClick={() => playAudio("Yes, they have inspected it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, they have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have they inspected the engine room this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have they inspected the engine room this week?
                    </button> - 
                    <button onClick={() => playAudio("No, they haven't inspected it this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, they haven't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <button onClick={() => playAudio('has maintained')} className="text-red-600 font-bold hover:text-red-800 transition-colors">has maintained</button> the auxiliary engine.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele fez manutenção no motor auxiliar.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has he maintained the auxiliary engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has he maintained the auxiliary engine?
                    </button> - 
                    <button onClick={() => playAudio("Yes, he has maintained it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, he has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has he maintained the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has he maintained the main engine?
                    </button> - 
                    <button onClick={() => playAudio("No, he hasn't maintained it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, he hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('has repaired')} className="text-red-600 font-bold hover:text-red-800 transition-colors">has repaired</button> the pipes this week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela reparou os tubos esta semana.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has she repaired the pipes this week?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has she repaired the pipes this week?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has repaired them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has she repaired the valves this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has she repaired the valves this week?
                    </button> - 
                    <button onClick={() => playAudio("No, she hasn't repaired them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('have already checked')} className="text-red-600 font-bold hover:text-red-800 transition-colors">have already checked</button> the valves.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu já verifiquei as válvulas.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have you checked the valves yet?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have you checked the valves yet?
                    </button> - 
                    <button onClick={() => playAudio("Yes, I have already checked them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, I have.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you checked the pipes yet?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you checked the pipes yet?
                    </button> - 
                    <button onClick={() => playAudio("No, I haven't checked them yet.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, I haven't.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('have not followed')} className="text-red-600 font-bold hover:text-red-800 transition-colors">have not followed</button> the safety procedures yet.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós ainda não seguimos os procedimentos de segurança.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Have you followed the safety procedures?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Have you followed the safety procedures?
                    </button> - 
                    <button onClick={() => playAudio("No, we haven't followed them yet.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, we haven't.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you followed the safety guidelines?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you followed the safety guidelines?
                    </button> - 
                    <button onClick={() => playAudio("Yes, we have followed them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, we have.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('has never worn')} className="text-red-600 font-bold hover:text-red-800 transition-colors">has never worn</button> safety boots before.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela nunca usou botas de segurança antes.</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio('Has she ever worn safety boots?')} className="text-red-600 hover:text-red-800 transition-colors">
                      Has she ever worn safety boots?
                    </button> - 
                    <button onClick={() => playAudio("No, she has never worn them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      No, she hasn't.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Has she ever worn safety goggles?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Has she ever worn safety goggles?
                    </button> - 
                    <button onClick={() => playAudio("Yes, she has worn safety goggles many times.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, she has.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-orange-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Have you ever')} className="text-red-600 font-bold hover:text-red-800 transition-colors">Have you ever</button> worked in an engine room?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você já trabalhou em uma sala de máquinas?</p>
                  <p className="text-sm text-red-600 mt-1">
                    <button onClick={() => playAudio("No, I have never worked in an engine room.")} className="text-red-600 hover:text-red-800 transition-colors">
                      No, I have never worked in an engine room.
                    </button>
                    <br />
                    <button onClick={() => playAudio('Have you ever worked in a factory?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                      Have you ever worked in a factory?
                    </button> - 
                    <button onClick={() => playAudio("Yes, I have worked in a factory.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                      Yes, I have.
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
              Replace the red words to practice real PPE and engine room phrases
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
                        onClick={() => playAudio('I have worn my safety helmet today.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I have worn my <button 
                            onClick={() => playAudio('safety helmet')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >safety helmet</button> today.
                        </p>
                        <p className="text-sm text-gray-600">Eu usei meu capacete de segurança hoje.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Have you worn your safety helmet today?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Have you worn your safety helmet today?
                          </button> - 
                          <button onClick={() => playAudio("Yes, I have worn it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, I have.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have you worn your safety helmet this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have you worn your safety helmet this week?
                          </button> - 
                          <button onClick={() => playAudio("No, I haven't worn it this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, I haven't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('She has checked the fire extinguisher.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. She has checked the <button 
                            onClick={() => playAudio('fire extinguisher')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >fire extinguisher</button>.
                        </p>
                        <p className="text-sm text-gray-600">Ela verificou o extintor de incêndio.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Has she checked the fire extinguisher?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Has she checked the fire extinguisher?
                          </button> - 
                          <button onClick={() => playAudio("Yes, she has checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, she has.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Has she checked the alarm system?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Has she checked the alarm system?
                          </button> - 
                          <button onClick={() => playAudio("No, she hasn't checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, she hasn't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We have inspected the main engine.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. We have inspected the <button 
                            onClick={() => playAudio('main engine')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >main engine</button>.
                        </p>
                        <p className="text-sm text-gray-600">Nós inspecionamos o motor principal.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Have you inspected the main engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Have you inspected the main engine?
                          </button> - 
                          <button onClick={() => playAudio("Yes, we have inspected it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, we have.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have you inspected the auxiliary engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have you inspected the auxiliary engine?
                          </button> - 
                          <button onClick={() => playAudio("No, we haven't inspected it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, we haven't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('He has maintained the auxiliary engine.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. He has maintained the <button 
                            onClick={() => playAudio('auxiliary engine')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >auxiliary engine</button>.
                        </p>
                        <p className="text-sm text-gray-600">Ele fez manutenção no motor auxiliar.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Has he maintained the auxiliary engine?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Has he maintained the auxiliary engine?
                          </button> - 
                          <button onClick={() => playAudio("Yes, he has maintained it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, he has.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Has he maintained the main engine?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Has he maintained the main engine?
                          </button> - 
                          <button onClick={() => playAudio("No, he hasn't maintained it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, he hasn't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The team has followed all safety procedures.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. The team has followed all <button 
                            onClick={() => playAudio('safety procedures')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >safety procedures</button>.
                        </p>
                        <p className="text-sm text-gray-600">A equipe seguiu todos os procedimentos de segurança.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Has the team followed all safety procedures?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Has the team followed all safety procedures?
                          </button> - 
                          <button onClick={() => playAudio("Yes, they have followed them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, they have.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Has the team followed all safety guidelines?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Has the team followed all safety guidelines?
                          </button> - 
                          <button onClick={() => playAudio("No, they haven't followed them.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, they haven't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Have you worn your safety boots today?')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. Have you worn your <button 
                            onClick={() => playAudio('safety boots')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >safety boots</button> today?
                        </p>
                        <p className="text-sm text-gray-600">Você usou suas botas de segurança hoje?</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio("No, I haven't worn them today.")} className="text-red-600 hover:text-red-800 transition-colors">
                            No, I haven't worn them today.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have you worn your safety boots this week?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have you worn your safety boots this week?
                          </button> - 
                          <button onClick={() => playAudio("Yes, I have worn them this week.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, I have.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('She has never worked in an engine room before.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. She has never worked in an <button 
                            onClick={() => playAudio('engine room')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >engine room</button> before.
                        </p>
                        <p className="text-sm text-gray-600">Ela nunca trabalhou em uma sala de máquinas antes.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Has she ever worked in an engine room?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Has she ever worked in an engine room?
                          </button> - 
                          <button onClick={() => playAudio("No, she has never worked in one.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, she hasn't.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Has she ever worked on a ship?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Has she ever worked on a ship?
                          </button> - 
                          <button onClick={() => playAudio("No, she has never worked on a ship.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, she hasn't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We have already checked the alarm system.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. We have already checked the <button 
                            onClick={() => playAudio('alarm system')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >alarm system</button>.
                        </p>
                        <p className="text-sm text-gray-600">Nós já verificamos o sistema de alarme.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Have you checked the alarm system yet?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Have you checked the alarm system yet?
                          </button> - 
                          <button onClick={() => playAudio("Yes, we have already checked it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, we have.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have you checked the fire extinguishers yet?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have you checked the fire extinguishers yet?
                          </button> - 
                          <button onClick={() => playAudio("No, we haven't checked them yet.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, we haven't.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('They have not inspected the auxiliary engine yet.')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. They have not inspected the <button 
                            onClick={() => playAudio('auxiliary engine')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >auxiliary engine</button> yet.
                        </p>
                        <p className="text-sm text-gray-600">Eles ainda não inspecionaram o motor auxiliar.</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio('Have they inspected the auxiliary engine yet?')} className="text-red-600 hover:text-red-800 transition-colors">
                            Have they inspected the auxiliary engine yet?
                          </button> - 
                          <button onClick={() => playAudio("No, they haven't inspected it yet.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, they haven't.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have they inspected the main engine yet?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have they inspected the main engine yet?
                          </button> - 
                          <button onClick={() => playAudio("Yes, they have inspected it.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            Yes, they have.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Have you ever worn ear protection?')} 
                        className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. Have you ever worn <button 
                            onClick={() => playAudio('ear protection')}
                            className="text-red-600 font-bold hover:text-red-800 transition-colors"
                          >ear protection</button>?
                        </p>
                        <p className="text-sm text-gray-600">Você já usou proteção auricular?</p>
                        <p className="text-sm text-red-600 mt-1">
                          <button onClick={() => playAudio("Yes, I have worn ear protection many times.")} className="text-red-600 hover:text-red-800 transition-colors">
                            Yes, I have worn ear protection many times.
                          </button>
                          <br />
                          <button onClick={() => playAudio('Have you ever worn safety goggles?')} className="text-red-600 hover:text-red-800 transition-colors ml-2">
                            Have you ever worn safety goggles?
                          </button> - 
                          <button onClick={() => playAudio("No, I have never worn safety goggles.")} className="text-red-600 hover:text-red-800 transition-colors ml-1">
                            No, I haven't.
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
                        src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Engineer with safety helmet and protective equipment"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Engineer wearing full PPE
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Technician working on engine"
                        fill
                        sizes="(max-width: 400px) 100vw, 400px"
                        className="object-cover rounded-xl"
                        quality={100}
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Technician working on main engine
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
                Essential structures for PPE and engine room communication
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Equipment Status */}
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <button onClick={() => playAudio('I have worn my PPE today.')} className="hover:text-red-200 transition-colors">
                  I have worn my PPE today.
                </button>
                <span className="text-sm text-red-300 ml-2">Eu usei meu EPI hoje.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('She has checked the fire extinguisher.')} className="hover:text-red-200 transition-colors">
                  She has checked the fire extinguisher.
                </button>
                <span className="text-sm text-red-300 ml-2">Ela verificou o extintor.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('We have inspected the engine.')} className="hover:text-red-200 transition-colors">
                  We have inspected the engine.
                </button>
                <span className="text-sm text-red-300 ml-2">Nós inspecionamos o motor.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('They have followed all safety procedures.')} className="hover:text-red-200 transition-colors">
                  They have followed all safety procedures.
                </button>
                <span className="text-sm text-red-300 ml-2">Eles seguiram todos os procedimentos.</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Have you worn your safety boots?')} className="hover:text-red-200 transition-colors">
                  Have you worn your safety boots?
                </button>
                <span className="text-sm text-red-300 ml-2">Você usou suas botas?</span>
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
                <button onClick={() => playAudio('Have you ever worked in an engine room?')} className="hover:text-red-600 transition-colors">
                  Have you ever worked in an engine room?
                </button>
                <span className="font-bold"> And you?</span>
                <p className="text-sm text-gray-600 mt-1">Você já trabalhou em uma sala de máquinas? E você?</p>
              </div>
            </div>

            {/* Coluna direita - Sign-Off */}
            <div className="bg-red-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Stay safe!')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Stay safe!')} className="hover:text-red-200 transition-colors">
                    Stay safe!
                  </button>
                  <span className="text-sm text-red-300 ml-2">Fique seguro!</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Good job!')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Good job!')} className="hover:text-red-200 transition-colors">
                    Good job!
                  </button>
                  <span className="text-sm text-red-300 ml-2">Bom trabalho!</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('See you tomorrow!')}
                  className="mr-2 text-red-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('See you tomorrow!')} className="hover:text-red-200 transition-colors">
                    See you tomorrow!
                  </button>
                  <span className="text-sm text-red-300 ml-2">Até amanhã!</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson4")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson6")}
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