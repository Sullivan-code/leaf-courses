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
        backgroundImage: `url("https://images.pexels.com/photos/380656/pexels-photo-380656.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 3 - Machinery & Equipment
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about industrial machines, tools, and equipment in English. 🔧⚙️
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://images.pexels.com/photos/159298/gear-wheels-cogs-mechanical-159298.jpeg?auto=compress&cs=tinysrgb&w=256&h=256&fit=crop"
              alt="Industrial machinery gears"
              width={256}
              height={256}
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS - Actions with Equipment</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on the verbs to hear the pronunciation and practice their forms
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.verbs ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('tooperate')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to operate
                </button> = operar / manusear
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tocheck')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to check
                </button> = verificar / checar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tomaintain')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to maintain
                </button> = fazer manutenção
              </li>
              <li>
                <button 
                  onClick={() => playAudio('toinspect')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to inspect
                </button> = inspecionar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('torepair')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to repair
                </button> = reparar / consertar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tostart')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to start
                </button> = ligar / iniciar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('tostop')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to stop
                </button> = desligar / parar
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I operate the machine. / I check / I inspect</p>
                  <p className="text-sm text-gray-500 mt-1">Eu opero a máquina. / Eu verifico / Eu inspeciono</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you check the pressure? / Do you inspect / Do you maintain</p>
                  <p className="text-sm text-gray-500 mt-1">Você verifica a pressão? / Você inspeciona / Você faz manutenção</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We maintain the equipment daily. / We check / We inspect</p>
                  <p className="text-sm text-gray-500 mt-1">Nós fazemos manutenção do equipamento diariamente. / Nós verificamos / Nós inspecionamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">They repair the pump. / They operate / They start</p>
                  <p className="text-sm text-gray-500 mt-1">Eles consertam a bomba. / Eles operam / Eles ligam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">She starts the generator. / She stops / She checks</p>
                  <p className="text-sm text-gray-500 mt-1">Ela liga o gerador. / Ela desliga / Ela verifica</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I don't operate heavy machinery. / I don't use / I don't touch</p>
                  <p className="text-sm text-gray-500 mt-1">Eu não opero máquinas pesadas. / Eu não uso / Eu não toco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Don't you inspect the valves? / Don't you check / Don't you test</p>
                  <p className="text-sm text-gray-500 mt-1">Você não inspeciona as válvulas? / Você não verifica / Você não testa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I need to repair the conveyor belt. / I want to check / I have to inspect</p>
                  <p className="text-sm text-gray-500 mt-1">Eu preciso consertar a esteira transportadora. / Eu quero verificar / Eu tenho que inspecionar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We want to start the compressor. / We need to stop / We have to check</p>
                  <p className="text-sm text-gray-500 mt-1">Nós queremos ligar o compressor. / Nós precisamos desligar / Nós temos que verificar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you know how to operate this equipment? / Do you know how to start / Do you know how to stop</p>
                  <p className="text-sm text-gray-500 mt-1">Você sabe como operar este equipamento? / Você sabe como ligar / Você sabe como desligar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Machinery & Equipment Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Click on each word to hear its correct pronunciation
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.vocabulary ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('machine')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  machine
                </button> = máquina
              </li>
              <li>
                <button 
                  onClick={() => playAudio('equipment')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  equipment
                </button> = equipamento
              </li>
              <li>
                <button 
                  onClick={() => playAudio('engine')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  engine
                </button> = motor
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pump')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pump
                </button> = bomba
              </li>
              <li>
                <button 
                  onClick={() => playAudio('compressor')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  compressor
                </button> = compressor
              </li>
              <li>
                <button 
                  onClick={() => playAudio('generator')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  generator
                </button> = gerador
              </li>
              <li>
                <button 
                  onClick={() => playAudio('valve')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  valve
                </button> = válvula
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pipe')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pipe
                </button> = tubo / cano
              </li>
              <li>
                <button 
                  onClick={() => playAudio('pressure_gauge')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  pressure gauge
                </button> = manômetro
              </li>
              <li>
                <button 
                  onClick={() => playAudio('temperature_sensor')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  temperature sensor
                </button> = sensor de temperatura
              </li>
              <li>
                <button 
                  onClick={() => playAudio('conveyor_belt')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  conveyor belt
                </button> = esteira transportadora
              </li>
              <li>
                <button 
                  onClick={() => playAudio('control_panel')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  control panel
                </button> = painel de controle
              </li>
              <li>
                <button 
                  onClick={() => playAudio('alarm_system')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  alarm system
                </button> = sistema de alarme
              </li>
              <li>
                <button 
                  onClick={() => playAudio('safety_valve')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  safety valve
                </button> = válvula de segurança
              </li>
              <li>
                <button 
                  onClick={() => playAudio('hydraulic_system')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  hydraulic system
                </button> = sistema hidráulico
              </li>
              <li>
                <button 
                  onClick={() => playAudio('cooling_tower')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  cooling tower
                </button> = torre de resfriamento
              </li>
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">I check the <span className="text-blue-600">pressure gauge</span>. / temperature sensor / valve</p>
                  <p className="text-sm text-gray-500 mt-1">Eu verifico o manômetro. / sensor de temperatura / válvula</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you operate this <span className="text-blue-600">machine</span>? / equipment / engine</p>
                  <p className="text-sm text-gray-500 mt-1">Você opera esta máquina? / equipamento / motor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We maintain the <span className="text-blue-600">compressor</span>. / generator / pump</p>
                  <p className="text-sm text-gray-500 mt-1">Nós fazemos manutenção do compressor. / gerador / bomba</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">alarm system</span> is working. / control panel / safety valve</p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme está funcionando. / painel de controle / válvula de segurança</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We need to inspect the <span className="text-blue-600">hydraulic system</span>. / cooling tower / pipes</p>
                  <p className="text-sm text-gray-500 mt-1">Nós precisamos inspecionar o sistema hidráulico. / torre de resfriamento / tubos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">conveyor belt</span> is stopped. / engine / generator</p>
                  <p className="text-sm text-gray-500 mt-1">A esteira transportadora está parada. / motor / gerador</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Check the <span className="text-blue-600">temperature sensor</span>. / pressure gauge / valves</p>
                  <p className="text-sm text-gray-500 mt-1">Verifique o sensor de temperatura. / manômetro / válvulas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">safety valve</span> is important. / alarm system / control panel</p>
                  <p className="text-sm text-gray-500 mt-1">A válvula de segurança é importante. / sistema de alarme / painel de controle</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We start the <span className="text-blue-600">generator</span> every morning. / compressor / pump</p>
                  <p className="text-sm text-gray-500 mt-1">Nós ligamos o gerador toda manhã. / compressor / bomba</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">pipes</span> need inspection. / valves / fittings</p>
                  <p className="text-sm text-gray-500 mt-1">Os tubos precisam de inspeção. / válvulas / conexões</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Speak Like a Technician</h2>
              <p className="mt-2 text-blue-100 italic">
                Practice common phrases for equipment operation and maintenance
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.usefulPhrases ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('check_the_pressure_gauge')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Check the pressure gauge before starting.
                </button> = Verifique o manômetro antes de ligar.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('the_equipment_is_working_normally')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  The equipment is working normally.
                </button> = O equipamento está funcionando normalmente.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('we_need_to_repair_the_pump')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We need to repair the pump.
                </button> = Nós precisamos consertar a bomba.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('stop_the_machine_immediately')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Stop the machine immediately!
                </button> = Desligue a máquina imediatamente!
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Check the <span className="text-blue-600">temperature sensor</span> before starting. / pressure gauge / safety valve</p>
                  <p className="text-sm text-gray-500 mt-1">Verifique o sensor de temperatura antes de ligar. / manômetro / válvula de segurança</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">compressor</span> is working normally. / generator / engine</p>
                  <p className="text-sm text-gray-500 mt-1">O compressor está funcionando normalmente. / gerador / motor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We need to repair the <span className="text-blue-600">hydraulic system</span>. / conveyor belt / valve</p>
                  <p className="text-sm text-gray-500 mt-1">Nós precisamos consertar o sistema hidráulico. / esteira transportadora / válvula</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Stop the <span className="text-blue-600">engine</span> immediately! / machine / pump</p>
                  <p className="text-sm text-gray-500 mt-1">Desligue o motor imediatamente! / máquina / bomba</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We inspect the <span className="text-blue-600">equipment</span> every day. / machine / system</p>
                  <p className="text-sm text-gray-500 mt-1">Nós inspecionamos o equipamento todos os dias. / máquina / sistema</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">alarm system</span> is activated. / safety valve / control panel</p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme está ativado. / válvula de segurança / painel de controle</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you know how to operate the <span className="text-blue-600">control panel</span>? / machine / equipment</p>
                  <p className="text-sm text-gray-500 mt-1">Você sabe como operar o painel de controle? / máquina / equipamento</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We need to replace the <span className="text-blue-600">pipe</span>. / valve / fitting</p>
                  <p className="text-sm text-gray-500 mt-1">Nós precisamos substituir o tubo. / válvula / conexão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">cooling tower</span> requires maintenance. / generator / compressor</p>
                  <p className="text-sm text-gray-500 mt-1">A torre de resfriamento requer manutenção. / gerador / compressor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Don't forget to check the <span className="text-blue-600">safety valve</span>. / pressure gauge / alarm system</p>
                  <p className="text-sm text-gray-500 mt-1">Não esqueça de verificar a válvula de segurança. / manômetro / sistema de alarme</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR - Instructions & Procedures</h2>
              <p className="mt-2 text-blue-100 italic">
                Structures to give instructions and talk about equipment status
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-sm transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
            >
              {openDrills.grammar ? 'Hide Exercise' : 'Show Exercise'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('check_the_valve_before_operation')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Check the valve before operation.
                </button> = Verifique a válvula antes da operação.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('the_machine_is_running')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  The machine is running.
                </button> = A máquina está funcionando.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('the_pump_is_not_working')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  The pump is not working.
                </button> = A bomba não está funcionando.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('we_have_to_inspect_the_system')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We have to inspect the system.
                </button> = Nós temos que inspecionar o sistema.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('you_must_follow_the_safety_procedures')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  You must follow the safety procedures.
                </button> = Você deve seguir os procedimentos de segurança.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('the_equipment_needs_maintenance')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  The equipment needs maintenance.
                </button> = O equipamento precisa de manutenção.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Check the <span className="text-blue-600">pressure gauge</span> before operation. / temperature / safety valve</p>
                  <p className="text-sm text-gray-500 mt-1">Verifique o manômetro antes da operação. / temperatura / válvula de segurança</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">compressor</span> is running. / generator / engine</p>
                  <p className="text-sm text-gray-500 mt-1">O compressor está funcionando. / gerador / motor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">conveyor belt</span> is not working. / pump / valve</p>
                  <p className="text-sm text-gray-500 mt-1">A esteira transportadora não está funcionando. / bomba / válvula</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We have to inspect the <span className="text-blue-600">hydraulic system</span>. / cooling tower / pipes</p>
                  <p className="text-sm text-gray-500 mt-1">Nós temos que inspecionar o sistema hidráulico. / torre de resfriamento / tubos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">You must follow the <span className="text-blue-600">safety procedures</span>. / maintenance schedule / operation manual</p>
                  <p className="text-sm text-gray-500 mt-1">Você deve seguir os procedimentos de segurança. / cronograma de manutenção / manual de operação</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">alarm system</span> needs maintenance. / generator / compressor</p>
                  <p className="text-sm text-gray-500 mt-1">O sistema de alarme precisa de manutenção. / gerador / compressor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Do you know how to <span className="text-blue-600">stop the machine</span> in an emergency? / operate / start</p>
                  <p className="text-sm text-gray-500 mt-1">Você sabe como desligar a máquina em uma emergência? / operar / ligar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">We need to <span className="text-blue-600">replace the pipe</span>. / repair the valve / inspect the system</p>
                  <p className="text-sm text-gray-500 mt-1">Nós precisamos substituir o tubo. / consertar a válvula / inspecionar o sistema</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">Don't forget to <span className="text-blue-600">record the readings</span>. / check the pressure / log the data</p>
                  <p className="text-sm text-gray-500 mt-1">Não esqueça de registrar as leituras. / verificar a pressão / registrar os dados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">The <span className="text-blue-600">temperature sensor</span> shows normal readings. / pressure gauge / control panel</p>
                  <p className="text-sm text-gray-500 mt-1">O sensor de temperatura mostra leituras normais. / manômetro / painel de controle</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Make It Yours</h2>
            <p className="mt-2 text-blue-100 italic">
              Replace the blue words to practice real equipment operation phrases
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('check_the_pressure_gauge_before_starting')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. Check the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('pressure_gauge')}
                          >pressure gauge</span> before starting.
                        </p>
                        <p className="text-sm text-gray-600">Verifique o manômetro antes de ligar.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('the_engine_is_running_normally')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. The <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('engine')}
                          >engine</span> is running normally.
                        </p>
                        <p className="text-sm text-gray-600">O motor está funcionando normalmente.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('we_need_to_repair_the_pump')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. We need to repair the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('pump')}
                          >pump</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós precisamos consertar a bomba.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('stop_the_conveyor_belt_immediately')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. Stop the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('conveyor_belt')}
                          >conveyor belt</span> immediately!
                        </p>
                        <p className="text-sm text-gray-600">Desligue a esteira transportadora imediatamente!</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('the_alarm_system_is_activated')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. The <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('alarm_system')}
                          >alarm system</span> is activated.
                        </p>
                        <p className="text-sm text-gray-600">O sistema de alarme está ativado.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('we_have_to_inspect_the_cooling_tower')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. We have to inspect the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('cooling_tower')}
                          >cooling tower</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós temos que inspecionar a torre de resfriamento.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('you_must_check_the_safety_valve')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. You must check the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('safety_valve')}
                          >safety valve</span>.
                        </p>
                        <p className="text-sm text-gray-600">Você deve verificar a válvula de segurança.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do_you_know_how_to_operate_the_control_panel')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. Do you know how to operate the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('control_panel')}
                          >control panel</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você sabe como operar o painel de controle?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('the_temperature_sensor_is_malfunctioning')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. The <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('temperature_sensor')}
                          >temperature sensor</span> is malfunctioning.
                        </p>
                        <p className="text-sm text-gray-600">O sensor de temperatura está com defeito.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('we_need_to_record_the_readings_in_the_logbook')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. We need to record the readings in the <span 
                            className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('logbook')}
                          >logbook</span>.
                        </p>
                        <p className="text-sm text-gray-600">Nós precisamos registrar as leituras no livro de registro.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/159298/gear-wheels-cogs-mechanical-159298.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Industrial gears and machinery"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Industrial machinery and gears
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <Image
                        src="https://images.pexels.com/photos/2681319/pexels-photo-2681319.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                        alt="Engineer checking control panel"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-xl"
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
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
              <p className="mt-2 text-blue-100 italic">
                Essential structures for equipment operation and maintenance
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Coluna esquerda - Equipment Status */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <p className="font-bold">The machine is running. <span className="text-sm text-blue-300 ml-2">A máquina está funcionando.</span></p>
              <p className="font-bold">The pump needs repair. <span className="text-sm text-blue-300 ml-2">A bomba precisa de conserto.</span></p>
              <p className="font-bold">Check the pressure gauge. <span className="text-sm text-blue-300 ml-2">Verifique o manômetro.</span></p>
              <p className="font-bold">Stop the equipment. <span className="text-sm text-blue-300 ml-2">Desligue o equipamento.</span></p>
              <p className="font-bold">Follow safety procedures. <span className="text-sm text-blue-300 ml-2">Siga os procedimentos de segurança.</span></p>
            </div>

            {/* Coluna central - Imagem e balão */}
            <div className="bg-white flex-1 p-6 flex flex-col items-center justify-center text-xl relative">
              <Image
                src="https://images.pexels.com/photos/3862132/pexels-photo-3862132.jpeg?auto=compress&cs=tinysrgb&w=160&h=160&fit=crop"
                alt="Engineer with safety helmet"
                width={160}
                height={160}
                className="rounded-full w-40 h-40 object-cover mb-4"
              />
              <div className="bg-yellow-200 text-black px-4 py-2 rounded-xl shadow-md text-center">
                Check the safety valve. <span className="font-bold">And you?</span>
                <p className="text-sm text-gray-600 mt-1">Verifique a válvula de segurança. E você?</p>
              </div>
            </div>

            {/* Coluna direita - Sign-Off */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-xl">
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("bye_see_you")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Bye! See you. <span className="text-sm text-blue-300 ml-2">Tchau! Até mais.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("see_you_later")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• See you later. <span className="text-sm text-blue-300 ml-2">Até mais tarde.</span></p>
              </div>
              <div className="flex items-center group">
                <button 
                  onClick={() => playAudio("good_night")}
                  className="mr-2 text-blue-200 hover:text-white transition-colors"
                  aria-label="Play audio"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
                <p>• Good night! <span className="text-sm text-blue-300 ml-2">Boa noite!</span></p>
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
            className="inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-purple-600 hover:to-purple-800 active:animate-glow"
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
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        .active\\:animate-glow:active {
          animation: glow 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}