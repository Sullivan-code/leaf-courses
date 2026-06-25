"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonHSE() {
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
        backgroundImage: `url("https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Container principal com fade verde e azul */}
      <div className="max-w-5xl mx-auto bg-gradient-to-br from-green-100 via-blue-100 to-green-50 bg-opacity-95 rounded-[40px] p-10 shadow-lg border-4 border-green-400/50">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 4 - Health, Safety & Environment (HSE) 🛡️🌍
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn essential vocabulary and phrases for workplace safety, health protocols, and environmental protection. 🦺♻️
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Safety helmet and equipment"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS - HSE Actions</h2>
              <p className="mt-2 text-green-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-blue-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to protect')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to protect
                </button> = proteger 🛡️
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to prevent')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to prevent
                </button> = prevenir ⚠️
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to inspect')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to inspect
                </button> = inspecionar 🔍
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to report')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to report
                </button> = reportar 📋
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to wear')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to wear
                </button> = usar (equipamento) 👷
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to follow')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to follow
                </button> = seguir 📏
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to ensure')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  to ensure
                </button> = garantir ✅
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We protected the workers with proper equipment.')} className="text-green-600 hover:text-green-800 transition-colors">
                      We protected the workers with proper equipment.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós protegemos os trabalhadores com equipamento adequado. 🛡️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we protect the workers?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we protect the workers?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't protect them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't protect them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('She prevented the accident by acting quickly.')} className="text-green-600 hover:text-green-800 transition-colors">
                      She prevented the accident by acting quickly.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela preveniu o acidente agindo rapidamente. ⚠️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did she prevent the accident?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did she prevent the accident?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't prevent it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, she didn't prevent it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We inspected the fire extinguishers yesterday.')} className="text-green-600 hover:text-green-800 transition-colors">
                      We inspected the fire extinguishers yesterday.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos os extintores de incêndio ontem. 🔍</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we inspect the fire extinguishers?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we inspect the fire extinguishers?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't inspect them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't inspect them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('They reported the hazard to the supervisor.')} className="text-green-600 hover:text-green-800 transition-colors">
                      They reported the hazard to the supervisor.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles reportaram o perigo ao supervisor. 📋</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did they report the hazard?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did they report the hazard?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't report it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, they didn't report it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('I wore my safety helmet every day.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I wore my safety helmet every day.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu usei meu capacete de segurança todos os dias. 👷</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety helmet?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did you wear your safety helmet?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, I didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We followed the safety procedures strictly.')} className="text-green-600 hover:text-green-800 transition-colors">
                      We followed the safety procedures strictly.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós seguimos os procedimentos de segurança rigorosamente. 📏</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we follow the safety procedures?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we follow the safety procedures?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't follow them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't follow them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('We ensured the workplace was safe.')} className="text-green-600 hover:text-green-800 transition-colors">
                      We ensured the workplace was safe.
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós garantimos que o local de trabalho estava seguro. ✅</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we ensure the workplace was safe?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we ensure the workplace was safe?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't ensure it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't ensure it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 HSE Vocabulary</h2>
              <p className="mt-2 text-green-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-blue-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('safety')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety
                </button> = segurança 🦺
              </li>
              <li>
                <button 
                  onClick={() => playAudio('health')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  health
                </button> = saúde 🏥
              </li>
              <li>
                <button 
                  onClick={() => playAudio('environment')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  environment
                </button> = meio ambiente 🌍
              </li>
              <li>
                <button 
                  onClick={() => playAudio('hazard')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  hazard
                </button> = perigo ⚠️
              </li>
              <li>
                <button 
                  onClick={() => playAudio('risk')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  risk
                </button> = risco 📊
              </li>
              <li>
                <button 
                  onClick={() => playAudio('incident')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  incident
                </button> = incidente 🚨
              </li>
              <li>
                <button 
                  onClick={() => playAudio('accident')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  accident
                </button> = acidente 💥
              </li>
              <li>
                <button 
                  onClick={() => playAudio('PPE - Personal Protective Equipment')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  PPE - Personal Protective Equipment
                </button> = EPI - Equipamento de Proteção Individual 👷
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety helmet')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety helmet
                </button> = capacete de segurança ⛑️
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety goggles')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety goggles
                </button> = óculos de segurança 🥽
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety gloves')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety gloves
                </button> = luvas de segurança 🧤
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety boots')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety boots
                </button> = botas de segurança 🥾
              </li>
              <li>
                <button 
                  onClick={() => playAudio('fire extinguisher')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  fire extinguisher
                </button> = extintor de incêndio 🧯
              </li>
              <li>
                <button 
                  onClick={() => playAudio('first aid kit')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  first aid kit
                </button> = kit de primeiros socorros 🩹
              </li>
              <li>
                <button 
                  onClick={() => playAudio('emergency exit')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  emergency exit
                </button> = saída de emergência 🚪
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety training')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  safety training
                </button> = treinamento de segurança 📚
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    I wore my <button onClick={() => playAudio('safety helmet')} className="text-green-600 font-bold hover:text-green-800 transition-colors">safety helmet</button> yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu usei meu capacete de segurança ontem. ⛑️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did you wear your safety helmet?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did you wear your safety helmet?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't wear it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, I didn't wear it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('fire extinguisher')} className="text-green-600 font-bold hover:text-green-800 transition-colors">fire extinguisher</button> was inspected last week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O extintor de incêndio foi inspecionado na semana passada. 🧯</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the fire extinguisher inspected?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the fire extinguisher inspected?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't inspected.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't inspected.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('emergency exit')} className="text-green-600 font-bold hover:text-green-800 transition-colors">emergency exit</button> was clear and accessible.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A saída de emergência estava desobstruída e acessível. 🚪</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the emergency exit clear?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the emergency exit clear?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't clear.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't clear.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We attended <button onClick={() => playAudio('safety training')} className="text-green-600 font-bold hover:text-green-800 transition-colors">safety training</button> last month.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós participamos do treinamento de segurança no mês passado. 📚</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we attend safety training?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we attend safety training?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't attend it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't attend it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We reported the <button onClick={() => playAudio('hazard')} className="text-green-600 font-bold hover:text-green-800 transition-colors">hazard</button> to the supervisor.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós reportamos o perigo ao supervisor. ⚠️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we report the hazard?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we report the hazard?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't report it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't report it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('first aid kit')} className="text-green-600 font-bold hover:text-green-800 transition-colors">first aid kit</button> was fully stocked.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O kit de primeiros socorros estava completamente abastecido. 🩹</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the first aid kit stocked?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the first aid kit stocked?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't stocked.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't stocked.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    He wore <button onClick={() => playAudio('safety goggles')} className="text-green-600 font-bold hover:text-green-800 transition-colors">safety goggles</button> during the experiment.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ele usou óculos de segurança durante o experimento. 🥽</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did he wear safety goggles?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did he wear safety goggles?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't wear them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, he didn't wear them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('incident')} className="text-green-600 font-bold hover:text-green-800 transition-colors">incident</button> was investigated thoroughly.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O incidente foi investigado minuciosamente. 🚨</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the incident investigated?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the incident investigated?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't investigated.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't investigated.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We used <button onClick={() => playAudio('safety gloves')} className="text-green-600 font-bold hover:text-green-800 transition-colors">safety gloves</button> when handling chemicals.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós usamos luvas de segurança ao manusear produtos químicos. 🧤</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we use safety gloves?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we use safety gloves?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't use them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't use them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The <button onClick={() => playAudio('risk')} className="text-green-600 font-bold hover:text-green-800 transition-colors">risk</button> assessment was completed yesterday.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A avaliação de risco foi concluída ontem. 📊</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the risk assessment completed?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the risk assessment completed?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't completed.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't completed.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Speak Like a Native com Drill */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Native - Interview Questions</h2>
              <p className="mt-2 text-green-100 italic">
                Practice common HSE interview questions and answers 💼
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-blue-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 p-6 rounded-[20px] space-y-4 mb-6">
              <h3 className="text-xl font-bold text-green-700">💼 Common HSE Interview Questions & Answers</h3>
              
              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('What is your experience with health and safety?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: What is your experience with health and safety?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('I have five years of experience in HSE, including risk assessment and safety training.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: I have five years of experience in HSE, including risk assessment and safety training.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Tenho cinco anos de experiência em HSE, incluindo avaliação de risco e treinamento de segurança.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('How do you handle a safety violation?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: How do you handle a safety violation?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('I immediately stop the activity, report to the supervisor, and document the incident for investigation.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: I immediately stop the activity, report to the supervisor, and document the incident for investigation.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Eu paro imediatamente a atividade, reporto ao supervisor e documento o incidente para investigação.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('What is your approach to risk assessment?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: What is your approach to risk assessment?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('I identify hazards, evaluate risks, implement control measures, and monitor their effectiveness.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: I identify hazards, evaluate risks, implement control measures, and monitor their effectiveness.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Eu identifico perigos, avalio riscos, implemento medidas de controle e monitoro sua eficácia.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('How do you promote a safety culture?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: How do you promote a safety culture?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('I encourage reporting near misses, provide regular training, and lead by example in following safety procedures.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: I encourage reporting near misses, provide regular training, and lead by example in following safety procedures.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Eu incentivo o relato de quase acidentes, forneço treinamento regular e dou o exemplo seguindo os procedimentos de segurança.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('What is the most important aspect of workplace safety?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: What is the most important aspect of workplace safety?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('Safety starts with awareness and communication. Every worker must feel empowered to speak up about hazards.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: Safety starts with awareness and communication. Every worker must feel empowered to speak up about hazards.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">A segurança começa com consciência e comunicação. Cada trabalhador deve se sentir capacitado para falar sobre perigos.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-green-200">
                <p className="font-semibold text-gray-800">
                  <button onClick={() => playAudio('Can you describe a situation where you improved safety?')} className="text-green-600 hover:text-green-800 transition-colors">
                    Q: Can you describe a situation where you improved safety?
                  </button>
                </p>
                <p className="text-gray-600 mt-2">
                  <button onClick={() => playAudio('I implemented a new safety signage system that reduced incidents by 40% in six months.')} className="text-green-600 hover:text-green-800 transition-colors">
                    A: I implemented a new safety signage system that reduced incidents by 40% in six months.
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">Eu implementei um novo sistema de sinalização de segurança que reduziu incidentes em 40% em seis meses.</p>
              </div>
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('What is your experience with health and safety programs?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      What is your experience with health and safety programs?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Qual é a sua experiência com programas de saúde e segurança?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I have managed safety programs for 3 years in the manufacturing sector.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I have managed safety programs for 3 years in the manufacturing sector.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('How do you ensure compliance with safety regulations?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      How do you ensure compliance with safety regulations?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Como você garante a conformidade com as regulamentações de segurança?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I conduct regular audits, update policies, and provide continuous training to all staff.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I conduct regular audits, update policies, and provide continuous training to all staff.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('What are your strengths in HSE?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      What are your strengths in HSE?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Quais são seus pontos fortes em HSE?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('My strengths are attention to detail, strong communication skills, and ability to motivate teams.')} className="text-green-600 hover:text-green-800 transition-colors">
                      My strengths are attention to detail, strong communication skills, and ability to motivate teams.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('How do you handle emergency situations?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      How do you handle emergency situations?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Como você lida com situações de emergência?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I stay calm, follow emergency procedures, coordinate with the response team, and document everything.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I stay calm, follow emergency procedures, coordinate with the response team, and document everything.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Why do you want to work in HSE?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Why do you want to work in HSE?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Por que você quer trabalhar em HSE?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I want to protect people and the environment - it gives me great satisfaction to make workplaces safer.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I want to protect people and the environment - it gives me great satisfaction to make workplaces safer.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('How do you stay updated with HSE regulations?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      How do you stay updated with HSE regulations?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Como você se mantém atualizado com as regulamentações de HSE?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I attend seminars, read industry publications, and maintain professional certifications.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I attend seminars, read industry publications, and maintain professional certifications.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Can you give an example of a safety initiative you led?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      Can you give an example of a safety initiative you led?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você pode dar um exemplo de uma iniciativa de segurança que você liderou?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I led a campaign to improve ergonomics that reduced musculoskeletal injuries by 50%.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I led a campaign to improve ergonomics that reduced musculoskeletal injuries by 50%.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('What is your approach to environmental safety?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      What is your approach to environmental safety?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Qual é sua abordagem para a segurança ambiental?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I focus on waste reduction, proper disposal methods, and minimizing environmental impact.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I focus on waste reduction, proper disposal methods, and minimizing environmental impact.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('How do you handle a coworker who doesn\'t follow safety rules?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      How do you handle a coworker who doesn't follow safety rules?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Como você lida com um colega que não segue as regras de segurança?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I approach them respectfully, explain the risks, and escalate to management if necessary.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I approach them respectfully, explain the risks, and escalate to management if necessary.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('What would you do if you noticed an unsafe condition?')} className="text-green-600 font-bold hover:text-green-800 transition-colors">
                      What would you do if you noticed an unsafe condition?
                    </button>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O que você faria se notasse uma condição insegura?</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('I would immediately address it, report it, and follow up to ensure it was corrected.')} className="text-green-600 hover:text-green-800 transition-colors">
                      I would immediately address it, report it, and follow up to ensure it was corrected.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill - Past Tense & Questions */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Past Tense in HSE Context</h2>
              <p className="mt-2 text-green-100 italic">
                Learn to use past tense with safety procedures and incidents
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-blue-500 hover:to-green-600 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p className="font-bold text-green-700">Past Tense - Safety Actions</p>
              <p>
                <button 
                  onClick={() => playAudio('I inspected the fire extinguisher yesterday.')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  I inspected the fire extinguisher yesterday.
                </button> = Eu inspecionei o extintor de incêndio ontem. 🧯
              </p>
              <p>
                <button 
                  onClick={() => playAudio('They reported the incident to the safety officer.')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  They reported the incident to the safety officer.
                </button> = Eles reportaram o incidente ao oficial de segurança. 📋
              </p>
              <p>
                <button 
                  onClick={() => playAudio('The worker did not wear the safety gloves.')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  The worker did not wear the safety gloves.
                </button> = O trabalhador não usou as luvas de segurança. 🧤
              </p>
              <p className="font-bold text-green-700 mt-4">Past Tense - Questions</p>
              <p>
                <button 
                  onClick={() => playAudio('Did you receive safety training?')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  Did you receive safety training?
                </button> = Você recebeu treinamento de segurança? 📚
              </p>
              <p>
                <button 
                  onClick={() => playAudio('Did they follow the emergency procedures?')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  Did they follow the emergency procedures?
                </button> = Eles seguiram os procedimentos de emergência? 🚨
              </p>
              <p className="font-bold text-green-700 mt-4">Past Tense - Negative</p>
              <p>
                <button 
                  onClick={() => playAudio('We did not record the incident correctly.')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  We did not record the incident correctly.
                </button> = Nós não registramos o incidente corretamente. 📝
              </p>
              <p>
                <button 
                  onClick={() => playAudio('She did not check the safety equipment.')} 
                  className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                >
                  She did not check the safety equipment.
                </button> = Ela não verificou o equipamento de segurança. 🔍
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <button onClick={() => playAudio('inspected')} className="text-green-600 font-bold hover:text-green-800 transition-colors">inspected</button> the first aid kit last week.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eu inspecionei o kit de primeiros socorros na semana passada. 🩹</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did you inspect the first aid kit?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did you inspect the first aid kit?
                    </button> - 
                    <button onClick={() => playAudio("No, I didn't inspect it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, I didn't inspect it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The workers <button onClick={() => playAudio('reported')} className="text-green-600 font-bold hover:text-green-800 transition-colors">reported</button> the hazard immediately.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Os trabalhadores reportaram o perigo imediatamente. ⚠️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did the workers report the hazard?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did the workers report the hazard?
                    </button> - 
                    <button onClick={() => playAudio("No, they didn't report it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, they didn't report it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The employee <button onClick={() => playAudio('did not wear')} className="text-green-600 font-bold hover:text-green-800 transition-colors">did not wear</button> safety boots.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">O funcionário não usou botas de segurança. 🥾</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did the employee wear safety boots?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did the employee wear safety boots?
                    </button> - 
                    <button onClick={() => playAudio("No, he didn't wear them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, he didn't wear them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you')} className="text-green-600 font-bold hover:text-green-800 transition-colors">Did you</button> complete the risk assessment?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você completou a avaliação de risco? 📊</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio("No, I didn't complete it.")} className="text-green-600 hover:text-green-800 transition-colors">
                      No, I didn't complete it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did they')} className="text-green-600 font-bold hover:text-green-800 transition-colors">Did they</button> follow the safety protocols?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Eles seguiram os protocolos de segurança? 📏</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio("No, they didn't follow them.")} className="text-green-600 hover:text-green-800 transition-colors">
                      No, they didn't follow them.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <button onClick={() => playAudio('did not')} className="text-green-600 font-bold hover:text-green-800 transition-colors">did not</button> document the incident properly.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós não documentamos o incidente corretamente. 📝</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did we document the incident?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did we document the incident?
                    </button> - 
                    <button onClick={() => playAudio("No, we didn't document it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, we didn't document it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <button onClick={() => playAudio('did not')} className="text-green-600 font-bold hover:text-green-800 transition-colors">did not</button> report the near miss.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Ela não reportou o quase acidente.</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Did she report the near miss?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Did she report the near miss?
                    </button> - 
                    <button onClick={() => playAudio("No, she didn't report it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, she didn't report it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did you')} className="text-green-600 font-bold hover:text-green-800 transition-colors">Did you</button> receive proper safety equipment?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Você recebeu equipamento de segurança adequado? 🛡️</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio("No, I didn't receive it.")} className="text-green-600 hover:text-green-800 transition-colors">
                      No, I didn't receive it.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    The emergency exit <button onClick={() => playAudio('was not')} className="text-green-600 font-bold hover:text-green-800 transition-colors">was not</button> clearly marked.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">A saída de emergência não estava claramente sinalizada. 🚪</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio('Was the emergency exit marked?')} className="text-green-600 hover:text-green-800 transition-colors">
                      Was the emergency exit marked?
                    </button> - 
                    <button onClick={() => playAudio("No, it wasn't marked.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                      No, it wasn't marked.
                    </button>
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    <button onClick={() => playAudio('Did we')} className="text-green-600 font-bold hover:text-green-800 transition-colors">Did we</button> conduct the safety audit?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Nós realizamos a auditoria de segurança? ✅</p>
                  <p className="text-sm text-green-600 mt-1">
                    <button onClick={() => playAudio("No, we didn't conduct it.")} className="text-green-600 hover:text-green-800 transition-colors">
                      No, we didn't conduct it.
                    </button>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-green-100 italic">
              Replace the green words to practice real HSE phrases
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('I inspected the fire extinguisher yesterday.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. I inspected the <button 
                            onClick={() => playAudio('fire extinguisher')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >fire extinguisher</button> yesterday.
                        </p>
                        <p className="text-sm text-gray-600">Eu inspecionei o extintor de incêndio ontem. 🧯</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did you inspect the fire extinguisher?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did you inspect the fire extinguisher?
                          </button> - 
                          <button onClick={() => playAudio("No, I didn't inspect it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, I didn't inspect it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We wore safety helmets on the construction site.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. We wore <button 
                            onClick={() => playAudio('safety helmets')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >safety helmets</button> on the construction site.
                        </p>
                        <p className="text-sm text-gray-600">Nós usamos capacetes de segurança no canteiro de obras. ⛑️</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did we wear safety helmets?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did we wear safety helmets?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't wear them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, we didn't wear them.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The worker reported the hazard to the supervisor.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. The worker reported the <button 
                            onClick={() => playAudio('hazard')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >hazard</button> to the supervisor.
                        </p>
                        <p className="text-sm text-gray-600">O trabalhador reportou o perigo ao supervisor. ⚠️</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did the worker report the hazard?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did the worker report the hazard?
                          </button> - 
                          <button onClick={() => playAudio("No, he didn't report it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, he didn't report it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('She prevented the accident by acting quickly.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. She prevented the <button 
                            onClick={() => playAudio('accident')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >accident</button> by acting quickly.
                        </p>
                        <p className="text-sm text-gray-600">Ela preveniu o acidente agindo rapidamente. 🛡️</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did she prevent the accident?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did she prevent the accident?
                          </button> - 
                          <button onClick={() => playAudio("No, she didn't prevent it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, she didn't prevent it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We ensured the workplace was safe and clean.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. We ensured the <button 
                            onClick={() => playAudio('workplace')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >workplace</button> was safe and clean.
                        </p>
                        <p className="text-sm text-gray-600">Nós garantimos que o local de trabalho estava seguro e limpo. ✅</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did we ensure the workplace was safe?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did we ensure the workplace was safe?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't ensure it.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, we didn't ensure it.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The emergency exit was clearly marked.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. The <button 
                            onClick={() => playAudio('emergency exit')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >emergency exit</button> was clearly marked.
                        </p>
                        <p className="text-sm text-gray-600">A saída de emergência estava claramente sinalizada. 🚪</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Was the emergency exit marked?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Was the emergency exit marked?
                          </button> - 
                          <button onClick={() => playAudio("No, it wasn't marked.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, it wasn't marked.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('Did you attend the safety training session?')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. Did you attend the <button 
                            onClick={() => playAudio('safety training')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >safety training</button> session?
                        </p>
                        <p className="text-sm text-gray-600">Você participou da sessão de treinamento de segurança? 📚</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio("No, I didn't attend the safety training.")} className="text-green-600 hover:text-green-800 transition-colors">
                            No, I didn't attend the safety training.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The first aid kit was fully stocked and ready.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. The <button 
                            onClick={() => playAudio('first aid kit')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >first aid kit</button> was fully stocked and ready.
                        </p>
                        <p className="text-sm text-gray-600">O kit de primeiros socorros estava completamente abastecido e pronto. 🩹</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Was the first aid kit stocked?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Was the first aid kit stocked?
                          </button> - 
                          <button onClick={() => playAudio("No, it wasn't stocked.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, it wasn't stocked.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('We followed all safety procedures during the operation.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. We followed all <button 
                            onClick={() => playAudio('safety procedures')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >safety procedures</button> during the operation.
                        </p>
                        <p className="text-sm text-gray-600">Nós seguimos todos os procedimentos de segurança durante a operação. 📏</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Did we follow the safety procedures?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Did we follow the safety procedures?
                          </button> - 
                          <button onClick={() => playAudio("No, we didn't follow them.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, we didn't follow them.
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('The incident was investigated thoroughly by the committee.')} 
                        className="mr-3 mt-1 text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. The <button 
                            onClick={() => playAudio('incident')}
                            className="text-green-600 font-bold hover:text-green-800 transition-colors"
                          >incident</button> was investigated thoroughly by the committee.
                        </p>
                        <p className="text-sm text-gray-600">O incidente foi investigado minuciosamente pelo comitê. 🚨</p>
                        <p className="text-sm text-green-600 mt-1">
                          <button onClick={() => playAudio('Was the incident investigated?')} className="text-green-600 hover:text-green-800 transition-colors">
                            Was the incident investigated?
                          </button> - 
                          <button onClick={() => playAudio("No, it wasn't investigated.")} className="text-green-600 hover:text-green-800 transition-colors ml-1">
                            No, it wasn't investigated.
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
                        src="https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Safety equipment and helmet"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Safety equipment and protection 🦺
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Engineer with safety helmet"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Safety first in every workplace 👷
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - WRAP UP */}
        <div className="bg-white border-2 border-green-400 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP - HSE Essentials</h2>
              <p className="mt-2 text-green-100 italic">
                Essential phrases for workplace health, safety, and environmental protection
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - HSE Phrases */}
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">
                <button onClick={() => playAudio('Safety first!')} className="hover:text-green-200 transition-colors">
                  Safety first!
                </button>
                <span className="text-sm text-green-300 ml-2">Segurança em primeiro lugar! 🦺</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Always wear your PPE.')} className="hover:text-green-200 transition-colors">
                  Always wear your PPE.
                </button>
                <span className="text-sm text-green-300 ml-2">Sempre use seu EPI. 👷</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Report hazards immediately.')} className="hover:text-green-200 transition-colors">
                  Report hazards immediately.
                </button>
                <span className="text-sm text-green-300 ml-2">Reporte perigos imediatamente. ⚠️</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Follow safety procedures.')} className="hover:text-green-200 transition-colors">
                  Follow safety procedures.
                </button>
                <span className="text-sm text-green-300 ml-2">Siga os procedimentos de segurança. 📏</span>
              </p>
              <p className="font-bold">
                <button onClick={() => playAudio('Protect the environment.')} className="hover:text-green-200 transition-colors">
                  Protect the environment.
                </button>
                <span className="text-sm text-green-300 ml-2">Proteja o meio ambiente. 🌍</span>
              </p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="https://images.pexels.com/photos/2760249/pexels-photo-2760249.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop"
                alt="HSE professional"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                <button onClick={() => playAudio('Did you report the hazard?')} className="hover:text-green-600 transition-colors">
                  Did you report the hazard?
                </button>
                <span className="font-bold"> And you?</span>
                <p className="text-sm text-gray-600 mt-1">Você reportou o perigo? E você? ⚠️</p>
              </div>
            </div>

            {/* Coluna direita - Sign-Off */}
            <div className="bg-green-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Stay safe!')}
                  className="mr-2 text-green-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Stay safe!')} className="hover:text-green-200 transition-colors">
                    Stay safe!
                  </button>
                  <span className="text-sm text-green-300 ml-2">Fique seguro! 🛡️</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('Take care!')}
                  className="mr-2 text-green-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('Take care!')} className="hover:text-green-200 transition-colors">
                    Take care!
                  </button>
                  <span className="text-sm text-green-300 ml-2">Cuide-se! 💚</span>
                </p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio('See you next class!')}
                  className="mr-2 text-green-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>
                  <button onClick={() => playAudio('See you next class!')} className="hover:text-green-200 transition-colors">
                    See you next class!
                  </button>
                  <span className="text-sm text-green-300 ml-2">Até a próxima aula! 📚</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson3")}
            className="inline-block rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-gray-600 hover:to-gray-800 active:animate-glow"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson5")}
            className="inline-block rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-blue-500 hover:to-green-600 active:animate-glow"
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