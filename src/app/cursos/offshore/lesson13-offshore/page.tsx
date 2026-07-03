"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'reading' | 'skills' | 'education' | 'grammar' | 'conversation' | 'practice';

export default function LessonROVPilot() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    reading: false,
    skills: false,
    education: false,
    grammar: false,
    conversation: false,
    practice: false,
  });
  const [showGrammarExplanation, setShowGrammarExplanation] = useState(false);
  const [showMustExplanation, setShowMustExplanation] = useState(false);

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
  const rovImage = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const offshoreImage = "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const controlRoomImage = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const underwaterImage = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";
  const technicianImage = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80";

  // Verb data
  const verbs = [
    { english: "operate", portuguese: "operar", example: "ROV pilots operate underwater robots." },
    { english: "inspect", portuguese: "inspecionar", example: "They inspect pipelines and oil platforms." },
    { english: "control", portuguese: "controlar", example: "The pilot controls the ROV from the control room." },
    { english: "navigate", portuguese: "navegar", example: "The ROV navigates through deep water." },
    { english: "repair", portuguese: "reparar", example: "The robot can repair underwater equipment." },
    { english: "maintain", portuguese: "fazer manutenção", example: "Engineers maintain the ROV every day." },
    { english: "monitor", portuguese: "monitorar", example: "The team monitors the cameras continuously." },
    { english: "communicate", portuguese: "comunicar", example: "Good pilots communicate clearly with the crew." },
    { english: "troubleshoot", portuguese: "resolver problemas técnicos", example: "Pilots troubleshoot equipment failures." },
    { english: "deploy", portuguese: "lançar/colocar em operação", example: "The crew deploys the ROV from the vessel." },
    { english: "recover", portuguese: "recolher", example: "After the mission, they recover the ROV." },
    { english: "calibrate", portuguese: "calibrar", example: "Technicians calibrate the sensors before diving." }
  ];

  // Vocabulary data
  const vocabulary = [
    { english: "offshore", portuguese: "em alto-mar" },
    { english: "vessel", portuguese: "embarcação/navio" },
    { english: "oil rig", portuguese: "plataforma de petróleo" },
    { english: "umbilical cable", portuguese: "cabo umbilical" },
    { english: "thruster", portuguese: "propulsor" },
    { english: "manipulator arm", portuguese: "braço manipulador" },
    { english: "joystick", portuguese: "joystick" },
    { english: "camera system", portuguese: "sistema de câmeras" },
    { english: "sonar", portuguese: "sonar" },
    { english: "control room", portuguese: "sala de controle" },
    { english: "dive", portuguese: "mergulho (da máquina)" },
    { english: "mission", portuguese: "missão" },
    { english: "seabed", portuguese: "fundo do mar" },
    { english: "pipeline", portuguese: "oleoduto/gasoduto" },
    { english: "inspection", portuguese: "inspeção" },
    { english: "maintenance", portuguese: "manutenção" },
    { english: "depth", portuguese: "profundidade" },
    { english: "pressure", portuguese: "pressão" },
    { english: "safety procedures", portuguese: "procedimentos de segurança" },
    { english: "crew", portuguese: "tripulação" }
  ];

  // Speak Like a Native phrases
  const speakLikeNative = [
    { incorrect: "I control the robot.", correct: "I operate the ROV during subsea inspections." },
    { incorrect: "The robot went underwater.", correct: "The ROV was deployed to inspect the pipeline." },
    { incorrect: "I fixed the machine.", correct: "I performed maintenance on the ROV." },
    { incorrect: "We looked at the platform.", correct: "We carried out a detailed inspection of the subsea structure." },
    { incorrect: "There was a problem.", correct: "We experienced a technical issue during the mission." }
  ];

  const usefulExpressions = [
    "We're ready to deploy the ROV.",
    "The vehicle is on the seabed.",
    "We have visual contact.",
    "Maintain your heading.",
    "Check the umbilical tension.",
    "Bring the vehicle back.",
    "The mission has been completed successfully.",
    "The thrusters are working properly.",
    "We're experiencing poor visibility.",
    "The manipulator arm is fully operational."
  ];

  // Grammar - Present Simple examples
  const presentSimpleExamples = [
    { english: "I operate the ROV every day.", portuguese: "Eu opero o ROV todos os dias." },
    { english: "She monitors the cameras.", portuguese: "Ela monitora as câmeras." },
    { english: "The engineers inspect the equipment.", portuguese: "Os engenheiros inspecionam o equipamento." },
    { english: "The pilot communicates with the supervisor.", portuguese: "O piloto se comunica com o supervisor." }
  ];

  const presentSimpleNegative = [
    { english: "The pilot doesn't work alone.", portuguese: "O piloto não trabalha sozinho." },
    { english: "ROVs don't need oxygen.", portuguese: "ROVs não precisam de oxigênio." }
  ];

  const presentSimpleQuestions = [
    { english: "Do you operate the ROV?", portuguese: "Você opera o ROV?" },
    { english: "Does the pilot inspect the pipeline?", portuguese: "O piloto inspeciona o oleoduto?" }
  ];

  const mustExamples = [
    { english: "ROV pilots must follow safety procedures.", portuguese: "Pilotos de ROV devem seguir procedimentos de segurança." },
    { english: "You must wear protective equipment.", portuguese: "Você deve usar equipamento de proteção." },
    { english: "Workers must communicate clearly during operations.", portuguese: "Os trabalhadores devem se comunicar claramente durante as operações." },
    { english: "Pilots must stay calm during emergencies.", portuguese: "Os pilotos devem manter a calma durante emergências." }
  ];

  const conversation = [
    { speaker: "Supervisor:", line: "Are you ready to deploy the ROV?", translation: "Você está pronto para lançar o ROV?" },
    { speaker: "Pilot:", line: "Yes. I've completed all the system checks.", translation: "Sim. Completei todas as verificações do sistema." },
    { speaker: "Supervisor:", line: "How deep is today's inspection?", translation: "Qual é a profundidade da inspeção de hoje?" },
    { speaker: "Pilot:", line: "Approximately 1,500 meters.", translation: "Aproximadamente 1.500 metros." },
    { speaker: "Supervisor:", line: "Any technical issues?", translation: "Algum problema técnico?" },
    { speaker: "Pilot:", line: "Everything is working normally.", translation: "Está tudo funcionando normalmente." }
  ];

  // Practice exercises
  const practiceFillBlanks = [
    { sentence: "ROV pilots __________ underwater robots.", answer: "operate" },
    { sentence: "They __________ pipelines and subsea equipment.", answer: "inspect" },
    { sentence: "Every offshore worker __________ follow safety procedures.", answer: "must" },
    { sentence: "The crew __________ the ROV from the vessel.", answer: "deploys" },
    { sentence: "Good pilots __________ clearly with the team.", answer: "communicate" }
  ];

  const practiceTranslate = [
    { english: "The pilot controls the ROV.", portuguese: "O piloto controla o ROV." },
    { english: "We perform maintenance on the robot.", portuguese: "Nós fazemos manutenção no robô." },
    { english: "They inspect the seabed.", portuguese: "Eles inspecionam o fundo do mar." },
    { english: "You must follow the safety procedures.", portuguese: "Você deve seguir os procedimentos de segurança." },
    { english: "The vehicle is operating in deep water.", portuguese: "O veículo está operando em águas profundas." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${offshoreImage})`,
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
            🚀 Lesson: Becoming an ROV Pilot
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about the offshore industry and ROV (Remotely Operated Vehicle) operations. 
            Master technical vocabulary and professional communication skills.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={rovImage}
              alt="ROV underwater vehicle"
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
                Essential verbs for ROV operations - click to hear pronunciation
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(verb.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {verb.english}
                  </button> = {verb.portuguese}
                  <br />
                  <span className="text-sm italic text-gray-500 ml-4">"{verb.example}"</span>
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('operate')}>Operate</span> - I operate the ROV in the North Sea.</p>
                  <p className="text-sm text-gray-600 mt-1">Eu opero o ROV no Mar do Norte.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('inspect')}>Inspect</span> - We inspect the pipeline every month.</p>
                  <p className="text-sm text-gray-600 mt-1">Nós inspecionamos o oleoduto todo mês.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('control')}>Control</span> - The pilot controls the ROV remotely.</p>
                  <p className="text-sm text-gray-600 mt-1">O piloto controla o ROV remotamente.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('navigate')}>Navigate</span> - The ROV navigates through deep water.</p>
                  <p className="text-sm text-gray-600 mt-1">O ROV navega em águas profundas.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('repair')}>Repair</span> - They repair the equipment underwater.</p>
                  <p className="text-sm text-gray-600 mt-1">Eles reparam o equipamento debaixo d'água.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('maintain')}>Maintain</span> - We maintain the ROV regularly.</p>
                  <p className="text-sm text-gray-600 mt-1">Nós fazemos manutenção no ROV regularmente.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('monitor')}>Monitor</span> - The team monitors all the cameras.</p>
                  <p className="text-sm text-gray-600 mt-1">A equipe monitora todas as câmeras.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('communicate')}>Communicate</span> - Pilots communicate with the crew.</p>
                  <p className="text-sm text-gray-600 mt-1">Os pilotos se comunicam com a tripulação.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('troubleshoot')}>Troubleshoot</span> - We troubleshoot technical problems quickly.</p>
                  <p className="text-sm text-gray-600 mt-1">Nós resolvemos problemas técnicos rapidamente.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('deploy')}>Deploy</span> - The crew deploys the ROV from the vessel.</p>
                  <p className="text-sm text-gray-600 mt-1">A tripulação lança o ROV da embarcação.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('recover')}>Recover</span> - They recover the ROV after the mission.</p>
                  <p className="text-sm text-gray-600 mt-1">Eles recolhem o ROV após a missão.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('calibrate')}>Calibrate</span> - Technicians calibrate the sensors.</p>
                  <p className="text-sm text-gray-600 mt-1">Os técnicos calibram os sensores.</p>
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
                Technical terms used in offshore ROV operations
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {vocabulary.map((word, index) => (
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
                  <p className="text-lg font-medium text-gray-800">1. The ROV is deployed from an <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('offshore')}>offshore</span> <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('vessel')}>vessel</span>.</p>
                  <p className="text-sm text-gray-600 mt-1">O ROV é lançado de uma embarcação em alto-mar.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('oil rig')}>oil rig</span> is inspected regularly.</p>
                  <p className="text-sm text-gray-600 mt-1">A plataforma de petróleo é inspecionada regularmente.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('umbilical cable')}>umbilical cable</span> connects the ROV to the vessel.</p>
                  <p className="text-sm text-gray-600 mt-1">O cabo umbilical conecta o ROV à embarcação.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. The ROV uses <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('thrusters')}>thrusters</span> to move underwater.</p>
                  <p className="text-sm text-gray-600 mt-1">O ROV usa propulsores para se mover debaixo d'água.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('manipulator arm')}>manipulator arm</span> performs maintenance tasks.</p>
                  <p className="text-sm text-gray-600 mt-1">O braço manipulador realiza tarefas de manutenção.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. The pilot uses the <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('joystick')}>joystick</span> to control the vehicle.</p>
                  <p className="text-sm text-gray-600 mt-1">O piloto usa o joystick para controlar o veículo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('camera system')}>camera system</span> provides live video footage.</p>
                  <p className="text-sm text-gray-600 mt-1">O sistema de câmeras fornece imagens ao vivo.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. The ROV mission explores the <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('seabed')}>seabed</span>.</p>
                  <p className="text-sm text-gray-600 mt-1">A missão do ROV explora o fundo do mar.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('pipeline')}>pipeline</span> needs regular inspection.</p>
                  <p className="text-sm text-gray-600 mt-1">O oleoduto precisa de inspeção regular.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. The ROV operates at great <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('depth')}>depth</span>.</p>
                  <p className="text-sm text-gray-600 mt-1">O ROV opera em grande profundidade.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">11. All crew members must follow <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('safety procedures')}>safety procedures</span>.</p>
                  <p className="text-sm text-gray-600 mt-1">Todos os membros da tripulação devem seguir os procedimentos de segurança.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">12. The <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('crew')}>crew</span> works together during the operation.</p>
                  <p className="text-sm text-gray-600 mt-1">A tripulação trabalha em conjunto durante a operação.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Reading with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Reading</h2>
              <p className="mt-2 text-blue-100 italic">
                Learn about the role of an ROV Pilot
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('reading')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.reading ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold text-blue-600 mb-4">What Does an ROV Pilot Do?</h3>
                <div className="text-gray-700 space-y-4">
                  <p className="text-lg">
                    <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('An ROV pilot controls a remotely operated underwater vehicle')}>An ROV pilot</span> controls a remotely operated underwater vehicle from a control room on an offshore vessel. The pilot uses several monitors, cameras, and joysticks to navigate the robot underwater.
                  </p>
                  <p className="text-lg">
                    ROVs are used to inspect oil platforms, underwater pipelines, wind farms, and subsea equipment. They can also perform maintenance tasks using <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('robotic arms')}>robotic arms</span>.
                  </p>
                  <p className="text-lg">
                    Besides operating the vehicle, ROV pilots complete reports, communicate with engineers, and solve technical problems during missions.
                  </p>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="relative h-64 w-full">
                  <img
                    src={controlRoomImage}
                    alt="ROV control room"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  ROV control room with monitors and joysticks
                </p>
                {openDrills.reading && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-3">
                      <p>Um piloto de ROV controla um veículo submarino operado remotamente a partir da sala de controle de um navio offshore. O piloto utiliza diversos monitores, câmeras e joysticks para navegar com o robô debaixo d'água.</p>
                      <p>Os ROVs são utilizados para inspecionar plataformas de petróleo, oleodutos submarinos, parques eólicos e equipamentos submarinos. Eles também podem realizar tarefas de manutenção usando braços robóticos.</p>
                      <p>Além de operar o veículo, os pilotos de ROV fazem relatórios, comunicam-se com engenheiros e resolvem problemas técnicos durante as missões.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 - Skills with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Skills for ROV Pilots</h2>
              <p className="mt-2 text-blue-100 italic">
                What does it take to become an ROV Pilot?
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('skills')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.skills ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="relative h-64 w-full">
                  <img
                    src={technicianImage}
                    alt="ROV technician working"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  ROV technician performing maintenance
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold text-blue-600 mb-4">What Skills Does an ROV Pilot Need?</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Excellent communication skills",
                    "Good English (most offshore operations use English)",
                    "Basic knowledge of electronics",
                    "Mechanical skills",
                    "Computer skills",
                    "Ability to solve problems quickly",
                    "Ability to stay calm under pressure",
                    "Teamwork",
                    "Attention to detail"
                  ].map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => playAudio(skill)}
                      className="text-left bg-blue-50 hover:bg-blue-100 p-2 rounded-lg text-sm transition-colors"
                    >
                      ✅ {skill}
                    </button>
                  ))}
                </div>
                {openDrills.skills && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-1">
                      <p>Excelente comunicação</p>
                      <p>Bom nível de inglês</p>
                      <p>Conhecimento básico de eletrônica</p>
                      <p>Habilidades mecânicas</p>
                      <p>Conhecimentos de informática</p>
                      <p>Capacidade para resolver problemas rapidamente</p>
                      <p>Capacidade de manter a calma sob pressão</p>
                      <p>Trabalho em equipe</p>
                      <p>Atenção aos detalhes</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 - Education with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Education & Certifications</h2>
              <p className="mt-2 text-blue-100 italic">
                The path to becoming an ROV Pilot
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('education')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.education ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <p className="text-gray-700 text-lg">
                    There is no single worldwide requirement to become an ROV pilot, but most companies prefer candidates who have:
                  </p>
                  <ul className="mt-4 space-y-2 text-gray-700 list-disc pl-6">
                    <li>A technical degree in Electronics, Mechanics, Mechatronics, or Electrical Engineering.</li>
                    <li>A university degree in Engineering (optional but valuable).</li>
                    <li>Offshore safety training such as BOSIET.</li>
                    <li>Medical certificate for offshore workers.</li>
                    <li>Practical ROV training from specialized schools.</li>
                    <li>Good English communication skills.</li>
                  </ul>
                  <p className="mt-4 text-blue-600 font-bold">
                    Many pilots begin as ROV Technicians before becoming ROV Pilots.
                  </p>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={underwaterImage}
                    alt="Underwater ROV operation"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  ROV operating underwater
                </p>
                {openDrills.education && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-2 text-sm">
                      <p>Não existe uma exigência única no mundo inteiro para se tornar um piloto de ROV, mas a maioria das empresas prefere candidatos que possuam:</p>
                      <ul className="list-disc pl-4">
                        <li>Curso técnico em Eletrônica, Mecânica, Mecatrônica ou Eletrotécnica.</li>
                        <li>Graduação em Engenharia (opcional, mas valorizada).</li>
                        <li>Treinamento offshore como o BOSIET.</li>
                        <li>Certificado médico para trabalho offshore.</li>
                        <li>Curso prático de operação de ROV.</li>
                        <li>Boa comunicação em inglês.</li>
                      </ul>
                      <p className="font-bold">Muitos pilotos começam como Técnicos de ROV antes de se tornarem Pilotos de ROV.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Speak Like a Native */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
            <p className="mt-2 text-blue-100 italic">
              Professional offshore communication
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="font-bold text-red-600 mb-2">❌ Instead of saying...</h4>
                <div className="space-y-3 text-gray-700">
                  {speakLikeNative.map((item, index) => (
                    <div key={index}>
                      <button 
                        onClick={() => playAudio(item.incorrect)}
                        className="text-red-600 font-bold cursor-pointer hover:text-red-800 transition-colors"
                      >
                        {item.incorrect}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-bold text-green-600 mb-2">✅ Say:</h4>
                <div className="space-y-3 text-gray-700">
                  {speakLikeNative.map((item, index) => (
                    <div key={index}>
                      <button 
                        onClick={() => playAudio(item.correct)}
                        className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                      >
                        {item.correct}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-blue-600 mb-4">Useful Offshore Expressions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {usefulExpressions.map((expr, index) => (
                  <button
                    key={index}
                    onClick={() => playAudio(expr)}
                    className="bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-left transition-colors text-blue-700 font-medium"
                  >
                    {expr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 7 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Present Simple for Job Responsibilities & Modal Verb Must
              </p>
            </div>
            <div className="space-x-2">
              <button 
                onClick={() => setShowGrammarExplanation(!showGrammarExplanation)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
              >
                {showGrammarExplanation ? 'Hide Present Simple' : 'Show Present Simple'}
              </button>
              <button 
                onClick={() => setShowMustExplanation(!showMustExplanation)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
              >
                {showMustExplanation ? 'Hide Must' : 'Show Must'}
              </button>
            </div>
          </div>
          
          <div className="p-8">
            {showGrammarExplanation && (
              <div className="bg-blue-50 p-6 rounded-xl mb-6 animate-fadeIn">
                <h3 className="font-bold text-blue-600 text-lg mb-3">📘 Present Simple - Job Responsibilities</h3>
                <p className="text-gray-700 mb-4">We use the Present Simple to describe routines, responsibilities, and facts.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-blue-600">Structure</h4>
                    <p className="text-gray-700">Subject + Verb + Complement</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleExamples.map((ex, index) => (
                        <button
                          key={index}
                          onClick={() => playAudio(ex.english)}
                          className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-600">Negative</h4>
                    <p className="text-gray-700">Subject + do/does + not + verb</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleNegative.map((ex, index) => (
                        <button
                          key={index}
                          onClick={() => playAudio(ex.english)}
                          className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </button>
                      ))}
                    </div>
                    <h4 className="font-bold text-blue-600 mt-4">Questions</h4>
                    <p className="text-gray-700">Do/Does + Subject + Verb?</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleQuestions.map((ex, index) => (
                        <button
                          key={index}
                          onClick={() => playAudio(ex.english)}
                          className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showMustExplanation && (
              <div className="bg-blue-50 p-6 rounded-xl mb-6 animate-fadeIn">
                <h3 className="font-bold text-blue-600 text-lg mb-3">📘 Modal Verb "Must"</h3>
                <p className="text-gray-700 mb-4">
                  <span className="font-bold text-blue-600">Must</span> expresses obligation or necessity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mustExamples.map((ex, index) => (
                    <button
                      key={index}
                      onClick={() => playAudio(ex.english)}
                      className="block w-full text-left bg-white p-3 rounded-xl hover:bg-blue-50 transition-colors border border-blue-200"
                    >
                      <span className="text-blue-600 font-bold">{ex.english}</span>
                      <br />
                      <span className="text-sm text-gray-600">{ex.portuguese}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => toggleDrill('grammar')}
              className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Hide Practice' : 'Show Practice'}
            </button>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Complete the sentences with the correct verb form:</p>
                  <div className="space-y-2 mt-2">
                    {practiceFillBlanks.map((item, index) => (
                      <p key={index}>
                        <span className="text-gray-700">{item.sentence.replace('__________', '________')}</span>
                        <span className="text-green-600 font-bold ml-2">→ {item.answer}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Translate into English:</p>
                  <div className="space-y-2 mt-2">
                    {practiceTranslate.map((item, index) => (
                      <div key={index}>
                        <p className="text-gray-600">{item.portuguese}</p>
                        <p className="text-blue-600 font-bold">→ {item.english}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 8 - Conversation with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Conversation</h2>
              <p className="mt-2 text-blue-100 italic">
                ROV mission briefing - practice the dialogue
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('conversation')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.conversation ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3 space-y-4">
                {conversation.map((line, index) => (
                  <div key={index} className="flex items-start">
                    <button 
                      onClick={() => playAudio(line.line)} 
                      className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                      aria-label="Play audio"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div>
                      <p className="text-lg font-medium">
                        <span className="font-bold text-blue-600">{line.speaker}</span> {line.line}
                      </p>
                      {openDrills.conversation && (
                        <p className="text-sm text-gray-600">{line.translation}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={controlRoomImage}
                    alt="ROV control room"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  ROV control room during a mission
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 9 - Key Takeaway */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">⭐ Key Takeaway</h2>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={rovImage}
                    alt="ROV vehicle"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <p className="text-lg text-gray-700 leading-relaxed">
                  To become an <span className="font-bold text-blue-600">ROV Pilot</span>, you need a combination of 
                  <span className="font-bold text-blue-600"> technical knowledge</span>, 
                  <span className="font-bold text-blue-600"> problem-solving skills</span>, 
                  <span className="font-bold text-blue-600"> good English</span>, 
                  <span className="font-bold text-blue-600"> offshore safety training</span>, and 
                  <span className="font-bold text-blue-600"> hands-on experience</span>.
                </p>
                <p className="text-md text-gray-600 mt-3">
                  Most professionals start as <span className="font-bold text-blue-600">ROV Technicians</span>, gain practical offshore experience, 
                  and then progress to operating the vehicle during subsea missions. 
                  <span className="font-bold text-blue-600"> Strong communication and teamwork</span> are just as important as technical ability 
                  because ROV operations involve close coordination with engineers, supervisors, and the vessel's crew.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson13")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (13)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson15")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (15) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}