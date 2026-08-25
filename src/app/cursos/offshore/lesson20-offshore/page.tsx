"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

// ============================================
// SPEECH SYSTEM
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = () => {
    if (!text || typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const americanFemaleVoices = voices.filter(
      (voice) =>
        (voice.lang === "en-US" || voice.lang.startsWith("en-US")) &&
        (voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("google us english") ||
          voice.name.toLowerCase().includes("siri") ||
          voice.name.toLowerCase().includes("female") ||
          voice.name === "Google US English" ||
          voice.name === "Samantha")
    );
    if (americanFemaleVoices.length > 0) {
      utterance.voice = americanFemaleVoices[0];
    }
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      <Volume2
        size={12}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500"
      />
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText = children && typeof children === "string" ? children : text;
        if (speechText && typeof window !== "undefined") {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = "en-US";
          utterance.rate = 0.85;
          utterance.pitch = 1.0;
          const voices = window.speechSynthesis.getVoices();
          const americanFemaleVoices = voices.filter(
            (voice) =>
              (voice.lang === "en-US" || voice.lang.startsWith("en-US")) &&
              (voice.name.toLowerCase().includes("samantha") ||
                voice.name.toLowerCase().includes("google us english") ||
                voice.name === "Google US English")
          );
          if (americanFemaleVoices.length > 0) {
            utterance.voice = americanFemaleVoices[0];
          }
          window.speechSynthesis.speak(utterance);
        }
      }}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-green-500"
      />
    </button>
  );
};

// ============================================
// NOTE MODAL
// ============================================

function NoteModal({
  isOpen,
  onClose,
  sectionTitle,
  initialNote,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-blue-100 mt-1">Escreva suas observações, dúvidas ou traduções</p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva aqui suas anotações..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => { onSave(note); onClose(); }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
          >
            Salvar Anotação
          </button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-gray-400 hover:text-blue-500 transition-colors focus:outline-none"
      aria-label="Fazer anotações"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function DPCoursePage() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState({ definitions: true, questions: false });
  const [noteModal, setNoteModal] = useState({ isOpen: false, sectionTitle: "", noteContent: "" });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const toggleSection = (section: "definitions" | "questions") => {
    setOpenSections({ ...openSections, [section]: !openSections[section] });
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({ isOpen: true, sectionTitle, noteContent: savedNotes[sectionTitle] || "" });
  };

  const saveNote = (note: string) => {
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ============================================
  // DEFINITIONS DATA
  // ============================================

  const definitions = [
    {
      term: "Dead Reckoning Mode (Model Control)",
      english:
        "A software function that maintains thruster output settings when there is a severe system failure, such as total loss of position or heading input to the system. The system continues to estimate the vessel's position based on the last known position, speed, and heading.",
      portuguese:
        "Uma função de software que mantém as configurações de saída do propulsor quando há uma falha grave do sistema, como a perda total da posição ou da entrada de rumo no sistema. O sistema continua estimando a posição da embarcação com base na última posição conhecida, velocidade e rumo.",
    },
    {
      term: "Provision of Redundancy",
      english:
        "The ability of a DP system to maintain position and heading subsequent to a single point failure. This is achieved by duplicating critical components (thrusters, power supplies, sensors, etc.) so that if one fails, another can take over.",
      portuguese:
        "A capacidade de um sistema DP de manter a posição e o rumo após uma falha de ponto único. Isso é alcançado duplicando componentes críticos (propulsores, fontes de alimentação, sensores, etc.) para que, se um falhar, outro possa assumir.",
    },
    {
      term: "DP Class 1 Vessel",
      english:
        "A vessel with a DP system that has no redundancy. If a single component in the DP system fails, the vessel may lose position and/or heading. No single failure is required to be withstood.",
      portuguese:
        "Uma embarcação com um sistema DP que não possui redundância. Se um único componente no sistema DP falhar, a embarcação pode perder posição e/ou rumo. Nenhuma falha única é necessária para ser suportada.",
    },
    {
      term: "Consequence Analysis (online)",
      english:
        "A software function that verifies continued thruster and power redundancy for DP Class 2 and 3 vessels. It performs calculations to verify that sufficient thrust is available to maintain position even after a single point failure.",
      portuguese:
        "Uma função de software que verifica a continuidade do propulsor e da redundância de energia para embarcações DP Classe 2 e 3. Ela realiza cálculos para verificar se há empuxo suficiente disponível para manter a posição mesmo após uma falha de ponto único.",
    },
    {
      term: "DGNSS / DGPS",
      english:
        "Differential Global Navigation Satellite System / Differential Global Positioning System. A position reference system that provides the DP system with a global position (latitude, longitude, or UTM coordinates). It uses ground-based reference stations to correct GPS signals, improving accuracy.",
      portuguese:
        "Sistema Global de Navegação por Satélite Diferencial / Sistema de Posicionamento Global Diferencial. Um sistema de referência de posição que fornece ao sistema DP uma posição global (latitude, longitude ou coordenadas UTM). Ele usa estações de referência terrestres para corrigir sinais GPS, melhorando a precisão.",
    },
    {
      term: "Severe System Failure / Total Loss",
      english:
        "A catastrophic failure in the DP system, such as total loss of position or heading input. When this occurs, the system enters Dead Reckoning mode, where the software maintains thruster output settings based on the mathematical model until the operator takes action.",
      portuguese:
        "Uma falha catastrófica no sistema DP, como a perda total da posição ou da entrada de rumo. Quando isso ocorre, o sistema entra no modo Dead Reckoning, onde o software mantém as configurações de saída do propulsor com base no modelo matemático até que o operador tome uma ação.",
    },
    {
      term: "FMEA (Failure Modes and Effects Analysis)",
      english:
        "A document which highlights failure modes of the DP system and their effects on operation. It is a systematic method for identifying potential failures in a system and assessing their impact. For DP vessels, it is used to design redundant systems and to train operators.",
      portuguese:
        "Um documento que destaca os modos de falha do sistema DP e seus efeitos na operação. É um método sistemático para identificar falhas potenciais em um sistema e avaliar seu impacto. Para embarcações DP, é usado para projetar sistemas redundantes e treinar operadores.",
    },
    {
      term: "Capability Diagram",
      english:
        "A tool for estimating the position-keeping capability of the ship under various environmental conditions (wind, waves, current). It shows the maximum environmental forces the vessel can withstand while maintaining position.",
      portuguese:
        "Uma ferramenta para estimar a capacidade de manutenção de posição do navio sob várias condições ambientais (vento, ondas, corrente). Mostra as forças ambientais máximas que a embarcação pode suportar enquanto mantém a posição.",
    },
    {
      term: "Power Management System (PMS)",
      english:
        "A system that manages the electrical power on a DP vessel. Its main function is to prevent blackouts by automatically starting and stopping generators, managing load, and shedding non-essential loads when necessary.",
      portuguese:
        "Um sistema que gerencia a energia elétrica em uma embarcação DP. Sua principal função é prevenir apagões iniciando e parando geradores automaticamente, gerenciando carga e descartando cargas não essenciais quando necessário.",
    },
    {
      term: "USBL (Ultra Short Baseline)",
      english:
        "An acoustic positioning system that determines position by measuring the range and bearing of a single transponder beacon from a vessel-mounted transducer array. The transducer array has a known geometry (short baseline) and measures the angle and distance to the beacon.",
      portuguese:
        "Um sistema de posicionamento acústico que determina a posição medindo o alcance e o rumo de um único transponder a partir de um conjunto de transdutores montado na embarcação. O conjunto de transdutores tem uma geometria conhecida (linha de base curta) e mede o ângulo e a distância até o beacon.",
    },
    {
      term: "LBL (Long Baseline)",
      english:
        "An acoustic positioning system that uses a single transducer on the vessel and a calibrated array of transponders located on the sea floor. The vessel measures distances to multiple transponders to determine its position relative to the array.",
      portuguese:
        "Um sistema de posicionamento acústico que utiliza um único transdutor na embarcação e um conjunto calibrado de transponders localizados no fundo do mar. A embarcação mede distâncias para múltiplos transponders para determinar sua posição em relação ao conjunto.",
    },
    {
      term: "HPR (Hydroacoustic Position Reference)",
      english:
        "An underwater acoustic positioning system that uses sound waves to determine the position of a vessel relative to a subsea beacon or transponder. Performance can be limited by acoustic conditions such as noise from thrusters, temperature layers, and bubbles.",
      portuguese:
        "Um sistema de posicionamento acústico subaquático que usa ondas sonoras para determinar a posição de uma embarcação em relação a um beacon ou transponder subaquático. O desempenho pode ser limitado por condições acústicas, como ruído de propulsores, camadas de temperatura e bolhas.",
    },
    {
      term: "Auto Position Mode",
      english:
        "A DP system mode where the system automatically controls the vessel's position and heading to maintain them as closely as possible to the set-point values. The system uses thrusters to counteract environmental forces and maintain the desired position.",
      portuguese:
        "Um modo do sistema DP onde o sistema controla automaticamente a posição e o rumo da embarcação para mantê-los o mais próximo possível dos valores de set-point. O sistema usa propulsores para neutralizar forças ambientais e manter a posição desejada.",
    },
    {
      term: "Control Gain",
      english:
        "A parameter in the DP control system that determines how aggressively the system responds to position errors. Increasing the gain makes the system respond faster but can cause instability. It is often increased when encountering higher wind or current conditions.",
      portuguese:
        "Um parâmetro no sistema de controle DP que determina quão agressivamente o sistema responde a erros de posição. Aumentar o ganho faz o sistema responder mais rapidamente, mas pode causar instabilidade. Geralmente é aumentado ao encontrar condições de vento ou corrente mais fortes.",
    },
    {
      term: "Sway, Surge, Yaw",
      english:
        "Three of the six degrees of freedom of a vessel. Sway is the lateral (side-to-side) movement. Surge is the longitudinal (forward-backward) movement. Yaw is the rotation around the vertical axis (heading). These three are controlled by the DP system.",
      portuguese:
        "Três dos seis graus de liberdade de uma embarcação. Sway é o movimento lateral (de um lado para o outro). Surge é o movimento longitudinal (para frente e para trás). Yaw é a rotação em torno do eixo vertical (rumo). Esses três são controlados pelo sistema DP.",
    },
  ];

  // ============================================
  // QUESTIONS DATA (all from the document)
  // ============================================

  interface Question {
    id: number | string;
    question: string;
    questionPt: string;
    answer: string;
    answerPt?: string;
    options?: { letter: string; text: string; textPt?: string }[];
  }

  const questions: Question[] = [
    // Q1
    {
      id: 1,
      question:
        "Dynamic positioning can be defined as a system which?",
      questionPt: "O posicionamento dinâmico pode ser definido como um sistema que?",
      answer: "C - Automatically controls a vessel's position and heading exclusively by means of active thrust.",
      answerPt: "Controla automaticamente a posição e o rumo de uma embarcação exclusivamente por meio de thrust.",
      options: [
        { letter: "A", text: "Manually controls a vessel's position using anchors.", textPt: "Controla manualmente a posição de uma embarcação usando âncoras." },
        { letter: "B", text: "Automatically controls a vessel's speed and course.", textPt: "Controla automaticamente a velocidade e o curso de uma embarcação." },
        { letter: "C", text: "Automatically controls a vessel's position and heading exclusively by means of active thrust.", textPt: "Controla automaticamente a posição e o rumo de uma embarcação exclusivamente por meio de thrust." },
        { letter: "D", text: "Manually controls a vessel's thrusters for positioning.", textPt: "Controla manualmente os propulsores de uma embarcação para posicionamento." },
      ],
    },
    // Q2
    {
      id: 2,
      question: "Which of the following include 4 of the 7 main elements of a DP system?",
      questionPt: "Qual dos seguintes inclui 4 dos 7 elementos principais de um sistema DP?",
      answer: "B - Thrusters, power supply, position reference system and sensors.",
      answerPt: "Thrusters, fonte de alimentação, sistema de referência de posição e sensores.",
      options: [
        { letter: "A", text: "Thrusters, power supply, gyro compass and DP computer.", textPt: "Thrusters, fonte de alimentação, giroscópica e computador DP." },
        { letter: "B", text: "Thrusters, power supply, position reference system and sensors.", textPt: "Thrusters, fonte de alimentação, sistema de referência de posição e sensores." },
        { letter: "C", text: "DP computer, sensors, thrusters and joystick.", textPt: "Computador DP, sensores, thrusters e joystick." },
        { letter: "D", text: "Position reference, sensors, power supply and alarms.", textPt: "Referência de posição, sensores, fonte de alimentação e alarmes." },
      ],
    },
    // Q3
    {
      id: 3,
      question: "The Sway is determined from data from?",
      questionPt: "O SWAY é determinada a partir de dados de:",
      answer: "A - Position Reference systems (PRS).",
      answerPt: "Sistemas de referência de posição (PRS).",
      options: [
        { letter: "A", text: "Position Reference systems (PRS).", textPt: "Sistemas de referência de posição (PRS)." },
        { letter: "B", text: "Gyro Compass.", textPt: "Giroscópica." },
        { letter: "C", text: "Wind sensors.", textPt: "Sensores de vento." },
        { letter: "D", text: "Thruster feedback.", textPt: "Retorno do propulsor." },
      ],
    },
    // Q4
    {
      id: 4,
      question: "Which of the '6 degrees of freedom' for movements of a ship are controlled by the DP system?",
      questionPt: "Quais dos '6 graus de liberdade' para movimentos de um navio são controlados pelo sistema DP?",
      answer: "D - Sway, Yaw and Surge.",
      answerPt: "Sway, Yaw e Surge.",
      options: [
        { letter: "A", text: "Surge, Heave and Sway.", textPt: "Surge, Heave e Sway." },
        { letter: "B", text: "Sway, Pitch and Yaw.", textPt: "Sway, Pitch e Yaw." },
        { letter: "C", text: "Surge, Roll and Yaw.", textPt: "Surge, Roll e Yaw." },
        { letter: "D", text: "Sway, Yaw and Surge.", textPt: "Sway, Yaw e Surge." },
      ],
    },
    // Q5
    {
      id: 5,
      question: "With the DP system set to the 'Auto Position' mode, the system will?",
      questionPt: "Com o sistema DP configurado para o modo 'Posição Automática', o sistema irá?",
      answer: "B - Maintain the vessel's position and heading as closely as possible to the set-point values.",
      answerPt: "Manter a posição e o rumo da embarcação o mais próximo possível dos set-point de ajuste.",
      options: [
        { letter: "A", text: "Maintain the vessel's position only, heading is manual.", textPt: "Manter apenas a posição da embarcação, o rumo é manual." },
        { letter: "B", text: "Maintain the vessel's position and heading as closely as possible to the set-point values.", textPt: "Manter a posição e o rumo da embarcação o mais próximo possível dos set-point de ajuste." },
        { letter: "C", text: "Allow the vessel to drift within a 10m radius.", textPt: "Permitir que a embarcação deriva dentro de um raio de 10m." },
        { letter: "D", text: "Follow a pre-defined track automatically.", textPt: "Seguir uma trilha pré-definida automaticamente." },
      ],
    },
    // Q6
    {
      id: 6,
      question: "Under which of the following conditions may positioning be improved by increasing 'Control Gain'?",
      questionPt: "Sob quais das seguintes condições o posicionamento pode ser melhorado aumentando o 'Ganho de Controle'?",
      answer: "C - When encountering increased wind or current conditions.",
      answerPt: "Ao encontrar aumento de vento ou condições atuais.",
      options: [
        { letter: "A", text: "When the vessel is in calm conditions.", textPt: "Quando a embarcação está em condições calmas." },
        { letter: "B", text: "When the position reference system is unstable.", textPt: "Quando o sistema de referência de posição está instável." },
        { letter: "C", text: "When encountering increased wind or current conditions.", textPt: "Ao encontrar aumento de vento ou condições atuais." },
        { letter: "D", text: "When the gyro compass has a heading error.", textPt: "Quando a giroscópica tem um erro de rumo." },
      ],
    },
    // Q7
    {
      id: 7,
      question: "The DP current is determined by:",
      questionPt: "A corrente DP é determinada por:",
      answer: "A - Calculation using the mathematical model.",
      answerPt: "Cálculo utilizando o modelo matemático.",
      options: [
        { letter: "A", text: "Calculation using the mathematical model.", textPt: "Cálculo utilizando o modelo matemático." },
        { letter: "B", text: "The current meter on the vessel.", textPt: "O medidor de corrente na embarcação." },
        { letter: "C", text: "The position reference system.", textPt: "O sistema de referência de posição." },
        { letter: "D", text: "The wind sensor reading.", textPt: "A leitura do sensor de vento." },
      ],
    },
    // Q8
    {
      id: 8,
      question: "A DP system is divided into seven major hardware elements. The user interface for the DPO is?",
      questionPt: "Um sistema DP é dividido em sete elementos principais de hardware. A interface do usuário para o DPO é?",
      answer: "A - DP Operator Station.",
      answerPt: "Estação Operação DP.",
      options: [
        { letter: "A", text: "DP Operator Station.", textPt: "Estação Operação DP." },
        { letter: "B", text: "DP Computer Console.", textPt: "Console do Computador DP." },
        { letter: "C", text: "Joystick Control Panel.", textPt: "Painel de Controle Joystick." },
        { letter: "D", text: "Thruster Control Interface.", textPt: "Interface de Controle do Propulsor." },
      ],
    },
    // Q9
    {
      id: 9,
      question: "A DP system is considered to have 'redundancy' when the vessel has?",
      questionPt: "Um sistema DP é considerado como tendo 'redundância' quando a embarcação possui?",
      answer: "D - The ability to maintain position and heading subsequent to a single point failure.",
      answerPt: "Capacidade de manter a posição e o rumo após uma falha de simples ponto.",
      options: [
        { letter: "A", text: "Two independent DP computers.", textPt: "Dois computadores DP independentes." },
        { letter: "B", text: "Three gyro compasses.", textPt: "Três giroscópicas." },
        { letter: "C", text: "Multiple position reference systems.", textPt: "Múltiplos sistemas de referência de posição." },
        { letter: "D", text: "The ability to maintain position and heading subsequent to a single point failure.", textPt: "Capacidade de manter a posição e o rumo após uma falha de simples ponto." },
      ],
    },
    // Q10
    {
      id: 10,
      question: "To understand the consequences of failure in any redundant part of a DP system onboard a DP 2 or 3 vessel, the DP operator should be familiar with?",
      questionPt: "Para compreender as consequências da falha em qualquer parte redundante de um sistema DP a bordo de uma embarcação DP 2 ou 3, o operador DP deve estar familiarizado com?",
      answer: "D - The failure modes and Effects Analysis (FMEA) document.",
      answerPt: "O documento de modos de falha e análise de efeitos (FMEA).",
      options: [
        { letter: "A", text: "The vessel's operational manual.", textPt: "O manual operacional da embarcação." },
        { letter: "B", text: "The DP system's user guide.", textPt: "O guia do usuário do sistema DP." },
        { letter: "C", text: "The thruster control manual.", textPt: "O manual de controle do propulsor." },
        { letter: "D", text: "The failure modes and Effects Analysis (FMEA) document.", textPt: "O documento de modos de falha e análise de efeitos (FMEA)." },
      ],
    },
    // Q11
    {
      id: 11,
      question: "What is an FMEA with respect to a DP vessel?",
      questionPt: "O que é um FMEA em relação a uma embarcação DP?",
      answer: "B - A document which highlights failure modes of the DP system and their effects on operation.",
      answerPt: "Um documento que destaca os modos de falha do sistema DP e seus efeitos na operação.",
      options: [
        { letter: "A", text: "A list of all spare parts for the DP system.", textPt: "Uma lista de todas as peças de reposição para o sistema DP." },
        { letter: "B", text: "A document which highlights failure modes of the DP system and their effects on operation.", textPt: "Um documento que destaca os modos de falha do sistema DP e seus efeitos na operação." },
        { letter: "C", text: "The training manual for DP operators.", textPt: "O manual de treinamento para operadores DP." },
        { letter: "D", text: "The electrical schematic of the DP system.", textPt: "O esquema elétrico do sistema DP." },
      ],
    },
    // Q12
    {
      id: 12,
      question: "Should there be a severe system failure, such as the total loss of position or heading input to the system, a software function will maintain thruster output settings. This function is called?",
      questionPt: "Caso haja uma falha grave do sistema, como a perda total da posição ou da entrada de rumo no sistema, uma função do software manterá as configurações de saída do propulsor. Esta função é chamada:",
      answer: "B - Model control or Dead Reckoning mode (PRS).",
      answerPt: "Controle de modelo ou modo Dead Reckoning (PRS).",
      options: [
        { letter: "A", text: "Auto Position mode.", textPt: "Modo Posição Automática." },
        { letter: "B", text: "Model control or Dead Reckoning mode (PRS).", textPt: "Controle de modelo ou modo Dead Reckoning (PRS)." },
        { letter: "C", text: "Emergency Stop mode.", textPt: "Modo Parada de Emergência." },
        { letter: "D", text: "Manual Override mode.", textPt: "Modo Substituição Manual." },
      ],
    },
    // Q13
    {
      id: 13,
      question: "If a DP system component fails, the loss of position and/or heading can be prevented by?",
      questionPt: "Se um componente do sistema DP falhar, a perda de posição e/ou rumo pode ser evitada por?",
      answer: "A - The provision of redundancy.",
      answerPt: "A provisão de redundância.",
      options: [
        { letter: "A", text: "The provision of redundancy.", textPt: "A provisão de redundância." },
        { letter: "B", text: "Switching to manual control.", textPt: "Mudando para controle manual." },
        { letter: "C", text: "Reducing the environmental load.", textPt: "Reduzindo a carga ambiental." },
        { letter: "D", text: "Increasing the control gain.", textPt: "Aumentando o ganho de controle." },
      ],
    },
    // Q14
    {
      id: 14,
      question: "A DP Class 1 vessel?",
      questionPt: "Uma embarcação DP Classe 1?",
      answer: "D - May lose position and/or heading if a single component in the DP system fails.",
      answerPt: "Pode perder posição e/ou rumo se um único componente no sistema DP falhar.",
      options: [
        { letter: "A", text: "Has full redundancy for all components.", textPt: "Tem redundância total para todos os componentes." },
        { letter: "B", text: "Can withstand any single point failure.", textPt: "Pode suportar qualquer falha de ponto único." },
        { letter: "C", text: "Is not required to have a DP operator.", textPt: "Não é necessário ter um operador DP." },
        { letter: "D", text: "May lose position and/or heading if a single component in the DP system fails.", textPt: "Pode perder posição e/ou rumo se um único componente no sistema DP falhar." },
      ],
    },
    // Q15
    {
      id: 15,
      question: "The online Consequence Analysis function?",
      questionPt: "A função on-line de Análise de Consequências:",
      answer: "B - Verifies continued thruster and power redundancy for DP Class 2 and 3 vessels.",
      answerPt: "Verifica a continuidade do propulsor e da redundância de energia para embarcações DP Classe 2 e 3.",
      options: [
        { letter: "A", text: "Calculates the optimum heading for fuel efficiency.", textPt: "Calcula o melhor rumo para eficiência de combustível." },
        { letter: "B", text: "Verifies continued thruster and power redundancy for DP Class 2 and 3 vessels.", textPt: "Verifica a continuidade do propulsor e da redundância de energia para embarcações DP Classe 2 e 3." },
        { letter: "C", text: "Monitors the position of the vessel at all times.", textPt: "Monitora a posição da embarcação o tempo todo." },
        { letter: "D", text: "Controls the power management system.", textPt: "Controla o sistema de gerenciamento de energia." },
      ],
    },
    // Q16
    {
      id: 16,
      question: "Under which DP vessel Equipment Class is it possible that loss of position may occur in the event of a single fault?",
      questionPt: "Sob qual classe de equipamento da embarcação DP é possível que ocorra perda de posição no caso de uma única falha?",
      answer: "A - Class 1.",
      answerPt: "Classe 1.",
      options: [
        { letter: "A", text: "Class 1.", textPt: "Classe 1." },
        { letter: "B", text: "Class 2.", textPt: "Classe 2." },
        { letter: "C", text: "Class 3.", textPt: "Classe 3." },
        { letter: "D", text: "All classes.", textPt: "Todas as classes." },
      ],
    },
    // Q17
    {
      id: 17,
      question: "Which Position Reference System provides the DP system with a global position (i.e. Latitude and Longitude or UTM co-ordinates)?",
      questionPt: "Qual sistema de referência de posição fornece ao sistema DP uma posição global (ou seja, latitude e longitude ou coordenadas UTM)?",
      answer: "D - DGNSS / DGPS.",
      answerPt: "DGNSS / DGPS.",
      options: [
        { letter: "A", text: "Taut Wire.", textPt: "Fio tenso." },
        { letter: "B", text: "Artemis.", textPt: "Artemis." },
        { letter: "C", text: "HPR (Hydroacoustic).", textPt: "HPR (Hidroacústico)." },
        { letter: "D", text: "DGNSS / DGPS.", textPt: "DGNSS / DGPS." },
      ],
    },
    // Q18
    {
      id: 18,
      question: "What does the DP System use to calculate weighting (or confidence) for each Position Reference System?",
      questionPt: "O que o Sistema DP usa para calcular a ponderação (ou confiança) para cada Sistema de Referência de Posição?",
      answer: "D - Relative spread of fixes.",
      answerPt: "Distribuição relativa de correções.",
      options: [
        { letter: "A", text: "The age of the data.", textPt: "A idade dos dados." },
        { letter: "B", text: "The number of satellites.", textPt: "O número de satélites." },
        { letter: "C", text: "The signal strength.", textPt: "A intensidade do sinal." },
        { letter: "D", text: "Relative spread of fixes.", textPt: "Distribuição relativa de correções." },
      ],
    },
    // Q19
    {
      id: 19,
      question: "A local Positioning Reference System is measuring from a local Reference Origin. Examples are:",
      questionPt: "Um Sistema de Referência de Posicionamento local está medindo a partir de uma Origem de Referência local. Exemplos são:",
      answer: "B - Artemis, Taut wire, Radius and Fanbeam.",
      answerPt: "Artemis, fio tenso, raio e fanbeam.",
      options: [
        { letter: "A", text: "DGPS, HPR and Gyro.", textPt: "DGPS, HPR e Giro." },
        { letter: "B", text: "Artemis, Taut wire, Radius and Fanbeam.", textPt: "Artemis, fio tenso, raio e fanbeam." },
        { letter: "C", text: "DGNSS, USBL and LBL.", textPt: "DGNSS, USBL e LBL." },
        { letter: "D", text: "GPS, Glonass and Galileo.", textPt: "GPS, Glonass e Galileo." },
      ],
    },
    // Q20
    {
      id: 20,
      question: "In a Hydroacoustic Position Reference (HPR) system, a response beacon is a device which?",
      questionPt: "Em um sistema de referência de posição hidroacústica (HPR), um sinalizador de resposta é um dispositivo que?",
      answer: "C - Is interrogated by electrical signal through cable, replying through-water.",
      answerPt: "É interrogado por sinal elétrico através de cabo, respondendo através da água.",
      options: [
        { letter: "A", text: "Transmits continuously without being interrogated.", textPt: "Transmite continuamente sem ser interrogado." },
        { letter: "B", text: "Is interrogated acoustically and replies through cable.", textPt: "É interrogado acusticamente e responde através de cabo." },
        { letter: "C", text: "Is interrogated by electrical signal through cable, replying through-water.", textPt: "É interrogado por sinal elétrico através de cabo, respondendo através da água." },
        { letter: "D", text: "Is a passive device that does not reply.", textPt: "É um dispositivo passivo que não responde." },
      ],
    },
    // Q21
    {
      id: 21,
      question: "What has a major negative effect on sound propagation in water when using a Hydroacoustic Position Reference (HPR) system?",
      questionPt: "O que tem um grande efeito negativo na propagação do som na água quando se utiliza um sistema de referência de posição hidroacústica (HPR)?",
      answer: "C - Thruster noise.",
      answerPt: "Ruído do propulsor.",
      options: [
        { letter: "A", text: "Heavy rain.", textPt: "Chuva forte." },
        { letter: "B", text: "Strong currents.", textPt: "Correntes fortes." },
        { letter: "C", text: "Thruster noise.", textPt: "Ruído do propulsor." },
        { letter: "D", text: "High waves.", textPt: "Ondas altas." },
      ],
    },
    // Q22
    {
      id: 22,
      question: "When using a Hydroacoustic Position Reference (HPR), acoustic reception is not adversely affected by?",
      questionPt: "Ao usar uma Referência de Posição Hidroacústica (HPR), a recepção acústica não é afetada negativamente por?",
      answer: "B - Heavy snowfall.",
      answerPt: "Forte chuvas / condições meteorológicas.",
      options: [
        { letter: "A", text: "Thruster noise.", textPt: "Ruído do propulsor." },
        { letter: "B", text: "Heavy snowfall.", textPt: "Forte chuvas / condições meteorológicas." },
        { letter: "C", text: "Bubbles from thrusters.", textPt: "Bolhas de propulsores." },
        { letter: "D", text: "Temperature layers in the water.", textPt: "Camadas de temperatura na água." },
      ],
    },
    // Q23
    {
      id: 23,
      question: "Ultra Short Baseline (USBL) Hydroacoustic positioning is determined by?",
      questionPt: "O posicionamento hidroacústico da linha de base ultra curta (USBL) é determinado por?",
      answer: "B - Range and bearing of a single transponder beacon.",
      answerPt: "Alcance e rumo de um único transponder.",
      options: [
        { letter: "A", text: "Distance to multiple transponders on the sea floor.", textPt: "Distância para múltiplos transponders no fundo do mar." },
        { letter: "B", text: "Range and bearing of a single transponder beacon.", textPt: "Alcance e rumo de um único transponder." },
        { letter: "C", text: "GPS satellite signals.", textPt: "Sinais de satélite GPS." },
        { letter: "D", text: "Wire angle and length.", textPt: "Ângulo e comprimento do fio." },
      ],
    },
    // Q24
    {
      id: 24,
      question: "Which is the system that uses a single transducer and a calibrated array of transponders located on the sea floor?",
      questionPt: "Qual é o sistema que utiliza um único transdutor e um conjunto calibrado de transponders localizados no fundo do mar?",
      answer: "A - Long Baseline acoustic positioning (LBL).",
      answerPt: "Posicionamento acústico de linha de base longa (LBL).",
      options: [
        { letter: "A", text: "Long Baseline acoustic positioning (LBL).", textPt: "Posicionamento acústico de linha de base longa (LBL)." },
        { letter: "B", text: "Ultra Short Baseline (USBL).", textPt: "Linha de base ultra curta (USBL)." },
        { letter: "C", text: "Short Baseline (SBL).", textPt: "Linha de base curta (SBL)." },
        { letter: "D", text: "DGPS.", textPt: "DGPS." },
      ],
    },
    // Q25
    {
      id: 25,
      question: "A DP system using the 'preferred' method of sensor allocation is fitted with two Gyro Compasses. Both are selected into the DP system and one is chosen as the 'preferred' Gyro. The system alerts you that there is a 'heading difference error' between the two Gyros. What would you do?",
      questionPt: "Um sistema DP usando o método 'preferencial' de alocação de sensores é equipado com duas giroscópicas. Ambas são selecionadas no sistema DP e uma é escolhida como o giro 'preferida'. O sistema alerta que há um erro de diferença de 'direção' entre as duas giros. O que você faria?",
      answer: "Investigate the gyro difference, check for heading discrepancies, and determine which gyro is correct. If necessary, switch the preferred gyro to the one that is accurate.",
      answerPt: "Investigue a diferença da giroscópica, verifique discrepâncias de rumo e determine qual giroscópica está correta. Se necessário, alterne a giroscópica preferida para a que está precisa.",
      options: [
        { letter: "A", text: "Ignore the error and continue.", textPt: "Ignorar o erro e continuar." },
        { letter: "B", text: "Reset both gyros.", textPt: "Reiniciar ambas as giroscópicas." },
        { letter: "C", text: "Switch to manual heading control.", textPt: "Mudar para controle manual de rumo." },
        { letter: "D", text: "Investigate and correct as necessary.", textPt: "Investigar e corrigir conforme necessário." },
      ],
    },
    // Q26
    {
      id: 26,
      question: "What is a Capability Diagram?",
      questionPt: "O que é um diagrama de capacidade?",
      answer: "D - A tool for estimating the position-keeping capability of the ship.",
      answerPt: "Uma ferramenta para estimar a capacidade de manutenção de posição do navio.",
      options: [
        { letter: "A", text: "A diagram showing the vessel's electrical system.", textPt: "Um diagrama mostrando o sistema elétrico da embarcação." },
        { letter: "B", text: "A chart of the vessel's maximum speed.", textPt: "Um gráfico da velocidade máxima da embarcação." },
        { letter: "C", text: "A map of the seabed around the vessel.", textPt: "Um mapa do fundo do mar ao redor da embarcação." },
        { letter: "D", text: "A tool for estimating the position-keeping capability of the ship.", textPt: "Uma ferramenta para estimar a capacidade de manutenção de posição do navio." },
      ],
    },
    // Q27
    {
      id: 27,
      question: "What is one disadvantage of a ship working using its DP system compared to being anchored?",
      questionPt: "Qual é a desvantagem de um navio trabalhar com seu sistema DP em comparação com estar ancorado?",
      answer: "C - Continually running thrusters are hazards for divers and ROV's.",
      answerPt: "Propulsores/Thrusters em funcionamento contínuo são perigos para mergulhadores e ROV's.",
      options: [
        { letter: "A", text: "Higher fuel consumption.", textPt: "Maior consumo de combustível." },
        { letter: "B", text: "More complex setup.", textPt: "Configuração mais complexa." },
        { letter: "C", text: "Continually running thrusters are hazards for divers and ROV's.", textPt: "Propulsores em funcionamento contínuo são perigos para mergulhadores e ROV's." },
        { letter: "D", text: "Limited positioning accuracy.", textPt: "Precisão de posicionamento limitada." },
      ],
    },
    // Q28
    {
      id: 28,
      question: "For DP operations, how much setting time in Auto Position mode should normally be allowed before commencing work?",
      questionPt: "Para operações de DP, quanto tempo de configuração no modo de Posição Automática normalmente deve ser permitido antes de iniciar o trabalho?",
      answer: "B - 30 MINUTES.",
      answerPt: "30 MINUTOS.",
      options: [
        { letter: "A", text: "15 MINUTES.", textPt: "15 MINUTOS." },
        { letter: "B", text: "30 MINUTES.", textPt: "30 MINUTOS." },
        { letter: "C", text: "60 MINUTES.", textPt: "60 MINUTOS." },
        { letter: "D", text: "10 MINUTES.", textPt: "10 MINUTOS." },
      ],
    },
    // Q29
    {
      id: 29,
      question: "In the Universal Transverse Mercator (UTM) system, how many Zones are there?",
      questionPt: "No sistema Universal Transverso de Mercator (UTM), quantas Zonas existem?",
      answer: "D - 60.",
      answerPt: "60.",
      options: [
        { letter: "A", text: "30.", textPt: "30." },
        { letter: "B", text: "40.", textPt: "40." },
        { letter: "C", text: "50.", textPt: "50." },
        { letter: "D", text: "60.", textPt: "60." },
      ],
    },
    // Q30
    {
      id: 30,
      question: "On a Class I vessel, if the DP Console has a total loss of power while a vessel is on Auto DP, the DPO can control the vessel's thrusters by switching to?",
      questionPt: "Em uma embarcação Classe I, se o Console DP tem uma perda total de energia enquanto uma embarcação está no Auto DP, o DPO pode controlar os propulsores da embarcação alternando para:",
      answer: "B - Independent Joystick control.",
      answerPt: "Independent Joystick control.",
      options: [
        { letter: "A", text: "Manual control from the bridge.", textPt: "Controle manual da ponte." },
        { letter: "B", text: "Independent Joystick control.", textPt: "Independent Joystick control." },
        { letter: "C", text: "The backup DP computer.", textPt: "O computador DP de backup." },
        { letter: "D", text: "Emergency thrust control.", textPt: "Controle de empuxo de emergência." },
      ],
    },
    // Q31
    {
      id: 31,
      question: "When planning a DP operation for a location close to a fixed structure, one of the most important considerations is to:",
      questionPt: "Ao planejar uma operação de DP para um local próximo a uma estrutura fixa, uma das considerações mais importantes é:",
      answer: "C - Plan a reliable vessel escape route from the location.",
      answerPt: "Planeje uma rota de fuga confiável da embarcação.",
      options: [
        { letter: "A", text: "Ensure the vessel has enough fuel.", textPt: "Garantir que a embarcação tenha combustível suficiente." },
        { letter: "B", text: "Confirm the position reference systems are working.", textPt: "Confirmar que os sistemas de referência de posição estão funcionando." },
        { letter: "C", text: "Plan a reliable vessel escape route from the location.", textPt: "Planeje uma rota de fuga confiável da embarcação." },
        { letter: "D", text: "Check the weather forecast.", textPt: "Verificar a previsão do tempo." },
      ],
    },
    // Q33
    {
      id: 33,
      question: "The thruster on a DP vessel controls:",
      questionPt: "O propulsor em um controle de navio DP:",
      answer: "C - Surge, Sway and Yaw.",
      answerPt: "Surge, Sway e Yaw.",
      options: [
        { letter: "A", text: "Surge and Sway only.", textPt: "Surge e Sway apenas." },
        { letter: "B", text: "Heave and Pitch.", textPt: "Heave e Pitch." },
        { letter: "C", text: "Surge, Sway and Yaw.", textPt: "Surge, Sway e Yaw." },
        { letter: "D", text: "Roll and Pitch.", textPt: "Roll e Pitch." },
      ],
    },
    // Q34
    {
      id: 34,
      question: "If a Thruster (which is not connected to a shaft generator/alternator) fails to full force, the DPO should immediately:",
      questionPt: "Se um propulsor (que não está conectado a um gerador/alternador de eixo) falhar em força total, o DPO deve imediatamente:",
      answer: "B - Activate the Emergency stop for the failed thruster.",
      answerPt: "Ative a parada de emergência para o propulsor com falha.",
      options: [
        { letter: "A", text: "Increase the gain on the remaining thrusters.", textPt: "Aumentar o ganho nos propulsores restantes." },
        { letter: "B", text: "Activate the Emergency stop for the failed thruster.", textPt: "Ative a parada de emergência para o propulsor com falha." },
        { letter: "C", text: "Switch to manual control.", textPt: "Mudar para controle manual." },
        { letter: "D", text: "Notify the captain.", textPt: "Notificar o capitão." },
      ],
    },
    // Q35
    {
      id: 35,
      question: "Why may 'Prohibited Azimuth Zones' or 'Azimuth Barring' still be required when only one Azimuth Thruster is fitted?",
      questionPt: "Por que 'Zonas de Azimute Proibidas' ou 'Azimute Barreira' ainda podem ser exigidas quando apenas um Propulsor de Azimute é instalado?",
      answer: "B - To prevent interference with acoustic devices on the hull such as Echo Sounder and Doppler Log transducers.",
      answerPt: "Para evitar interferência com dispositivos acústicos no casco, como sonda de eco e transdutores de log Doppler.",
      options: [
        { letter: "A", text: "To avoid collision with other vessels.", textPt: "Para evitar colisão com outras embarcações." },
        { letter: "B", text: "To prevent interference with acoustic devices on the hull such as Echo Sounder and Doppler Log transducers.", textPt: "Para evitar interferência com dispositivos acústicos no casco, como sonda de eco e transdutores de log Doppler." },
        { letter: "C", text: "To improve fuel efficiency.", textPt: "Para melhorar a eficiência de combustível." },
        { letter: "D", text: "To reduce thruster noise.", textPt: "Para reduzir o ruído do propulsor." },
      ],
    },
    // Q36
    {
      id: 36,
      question: "What determines the amount of thruster force used while operating in the joystick mode of operation?",
      questionPt: "O que determina a quantidade de força do propulsor usada durante a operação no modo joystick?",
      answer: "C - Joystick deflection and settings.",
      answerPt: "Deflexão do joystick e configurações.",
      options: [
        { letter: "A", text: "The environmental forces.", textPt: "As forças ambientais." },
        { letter: "B", text: "The position set-point.", textPt: "O ponto de ajuste de posição." },
        { letter: "C", text: "Joystick deflection and settings.", textPt: "Deflexão do joystick e configurações." },
        { letter: "D", text: "The vessel's speed.", textPt: "A velocidade da embarcação." },
      ],
    },
    // Q37
    {
      id: 37,
      question: "Which of the following affects the amount of thruster force used while maintaining station in the auto-position mode?",
      questionPt: "Qual dos itens a seguir afeta a quantidade de força do propulsor usada durante a manutenção da estação no modo auto-position?",
      answer: "A - Environmental forces acting on the vessel and excursion from set point, if any.",
      answerPt: "Forças ambientais atuando sobre a embarcação e excursão a partir de ponto fixo, se houver.",
      options: [
        { letter: "A", text: "Environmental forces acting on the vessel and excursion from set point, if any.", textPt: "Forças ambientais atuando sobre a embarcação e excursão a partir de ponto fixo, se houver." },
        { letter: "B", text: "The joystick deflection.", textPt: "A deflexão do joystick." },
        { letter: "C", text: "The heading set-point.", textPt: "O ponto de ajuste de rumo." },
        { letter: "D", text: "The number of thrusters available.", textPt: "O número de propulsores disponíveis." },
      ],
    },
    // Q38
    {
      id: 38,
      question: "A Thruster Bias mode can be selected:",
      questionPt: "Um modo Thruster Bias pode ser selecionado:",
      answer: "B - When azimuth thrusters continuously hunt for direction in low environmental conditions.",
      answerPt: "Quando os propulsores de azimute caçam continuamente a direção em baixas condições ambientais.",
      options: [
        { letter: "A", text: "When the vessel is in high wind conditions.", textPt: "Quando a embarcação está em condições de vento forte." },
        { letter: "B", text: "When azimuth thrusters continuously hunt for direction in low environmental conditions.", textPt: "Quando os propulsores de azimute caçam continuamente a direção em baixas condições ambientais." },
        { letter: "C", text: "When the position reference system fails.", textPt: "Quando o sistema de referência de posição falha." },
        { letter: "D", text: "When the vessel is in shallow water.", textPt: "Quando a embarcação está em águas rasas." },
      ],
    },
    // Q39
    {
      id: 39,
      question: "What is the minimum number of Thrusters required for a DP Class 2 vessel?",
      questionPt: "Qual é o número mínimo de propulsores necessários para uma embarcação DP Classe 2?",
      answer: "C - Two bow and two stern Thrusters.",
      answerPt: "Dois propulsores de proa e dois de popa.",
      options: [
        { letter: "A", text: "One bow and one stern Thruster.", textPt: "Um propulsor de proa e um de popa." },
        { letter: "B", text: "Two bow and one stern Thruster.", textPt: "Dois propulsores de proa e um de popa." },
        { letter: "C", text: "Two bow and two stern Thrusters.", textPt: "Dois propulsores de proa e dois de popa." },
        { letter: "D", text: "Three thrusters total.", textPt: "Três propulsores no total." },
      ],
    },
    // Q40
    {
      id: 40,
      question: "How do you increase thrust with a Fixed Pitch Propeller?",
      questionPt: "Como aumentar o empuxo com uma hélice de passo fixo?",
      answer: "A - By increasing the RPM.",
      answerPt: "Aumentando a RPM.",
      options: [
        { letter: "A", text: "By increasing the RPM.", textPt: "Aumentando a RPM." },
        { letter: "B", text: "By changing the propeller pitch.", textPt: "Alterando o passo da hélice." },
        { letter: "C", text: "By changing the gear ratio.", textPt: "Alterando a relação de transmissão." },
        { letter: "D", text: "By reducing the RPM.", textPt: "Reduzindo a RPM." },
      ],
    },
    // Q41
    {
      id: 41,
      question: "During DP operations, you receive a warning message which indicates that there will be insufficient thrust if you lose a certain thruster group. Which of the following options would be best in this situation?",
      questionPt: "Durante as operações de DP, você recebe uma mensagem de aviso que indica que haverá impulso insuficiente se você perder um determinado grupo de propulsores. Qual das seguintes opções seria melhor na situação?",
      answer: "B - Evaluate the prevailing environmental forces and change heading position if possible.",
      answerPt: "Avalie as forças ambientais predominantes e mude de posição se possível.",
      options: [
        { letter: "A", text: "Ignore the warning and continue operations.", textPt: "Ignorar o aviso e continuar as operações." },
        { letter: "B", text: "Evaluate the prevailing environmental forces and change heading position if possible.", textPt: "Avalie as forças ambientais predominantes e mude de posição se possível." },
        { letter: "C", text: "Increase the gain on all thrusters.", textPt: "Aumentar o ganho em todos os propulsores." },
        { letter: "D", text: "Stop operations immediately.", textPt: "Parar as operações imediatamente." },
      ],
    },
    // Q42
    {
      id: 42,
      question: "During ROV operations, which of the DP Position Reference Systems could the ROV interact and possibly interfere with?",
      questionPt: "Durante as operações do ROV, qual dos Sistemas de Referência de Posição DP o ROV poderia interagir e possivelmente interferir?",
      answer: "C - HPR & Tautwire.",
      answerPt: "HPR e fio tensor.",
      options: [
        { letter: "A", text: "DGPS & DGNSS.", textPt: "DGPS e DGNSS." },
        { letter: "B", text: "Artemis & Fanbeam.", textPt: "Artemis e Fanbeam." },
        { letter: "C", text: "HPR & Tautwire.", textPt: "HPR e fio tensor." },
        { letter: "D", text: "Gyro & Wind sensors.", textPt: "Sensores de giro e vento." },
      ],
    },
    // Q43
    {
      id: 43,
      question: "Details of the vessel's DP system redundancy arrangements are contained in?",
      questionPt: "Os detalhes dos arranjos de redundância do sistema DP da embarcação estão contidos em?",
      answer: "C - The vessel's Failure Modes and Effects Analysis (FMEA) document.",
      answerPt: "Documento de Análise de Modos e Efeitos de Falha (FMEA) da embarcação.",
      options: [
        { letter: "A", text: "The vessel's operational manual.", textPt: "O manual operacional da embarcação." },
        { letter: "B", text: "The DP system's user guide.", textPt: "O guia do usuário do sistema DP." },
        { letter: "C", text: "The vessel's Failure Modes and Effects Analysis (FMEA) document.", textPt: "Documento de Análise de Modos e Efeitos de Falha (FMEA) da embarcação." },
        { letter: "D", text: "The thruster control manual.", textPt: "O manual de controle do propulsor." },
      ],
    },
    // Q44
    {
      id: 44,
      question: "Before entering the 500m platform exclusion zone in order to conduct DP operations, it is important that?",
      questionPt: "Antes de entrar na zona de exclusão da plataforma de 500m para realizar operações de DP, é importante que:",
      answer: "A - Contingency planning to establish vessel escape routes has been completed.",
      answerPt: "O planejamento de contingência para estabelecer rotas de fuga das embarcações foi concluído.",
      options: [
        { letter: "A", text: "Contingency planning to establish vessel escape routes has been completed.", textPt: "O planejamento de contingência para estabelecer rotas de fuga das embarcações foi concluído." },
        { letter: "B", text: "The vessel's position is accurately known.", textPt: "A posição da embarcação é conhecida com precisão." },
        { letter: "C", text: "All thrusters are fully operational.", textPt: "Todos os propulsores estão totalmente operacionais." },
        { letter: "D", text: "The weather forecast is favorable.", textPt: "A previsão do tempo é favorável." },
      ],
    },
    // Q45
    {
      id: 45,
      question: "Performance of an HPR system is often limited by acoustic conditions in the water. What would be an example of such a condition?",
      questionPt: "O desempenho de um sistema HPR é frequentemente limitado por condições acústicas na água. O que seria um exemplo de tal condição?",
      answer: "D - Noise from vessel thrusters.",
      answerPt: "Ruído dos propulsores da embarcação.",
      options: [
        { letter: "A", text: "Strong wind on the surface.", textPt: "Vento forte na superfície." },
        { letter: "B", text: "Heavy rain.", textPt: "Chuva forte." },
        { letter: "C", text: "High waves.", textPt: "Ondas altas." },
        { letter: "D", text: "Noise from vessel thrusters.", textPt: "Ruído dos propulsores da embarcação." },
      ],
    },
    // Q46
    {
      id: 46,
      question: "Redundancy, with respect to vessel heading input can be achieved by fitting?",
      questionPt: "A redundância em relação à entrada do rumo da embarcação pode ser alcançada ajustando-se?",
      answer: "D - 3 or more gyro compasses.",
      answerPt: "3 ou mais giroscópicas.",
      options: [
        { letter: "A", text: "1 gyro compass.", textPt: "1 giroscópica." },
        { letter: "B", text: "2 gyro compasses.", textPt: "2 giroscópicas." },
        { letter: "C", text: "3 gyro compasses.", textPt: "3 giroscópicas." },
        { letter: "D", text: "3 or more gyro compasses.", textPt: "3 ou mais giroscópicas." },
      ],
    },
    // Q47
    {
      id: 47,
      question: "One of the main functions of the Power Management System (PMS) is to?",
      questionPt: "Uma das principais funções do Sistema de Gerenciamento de Energia (PMS) é?",
      answer: "A - Prevent Blackouts.",
      answerPt: "Prevenir apagões.",
      options: [
        { letter: "A", text: "Prevent Blackouts.", textPt: "Prevenir apagões." },
        { letter: "B", text: "Control thrusters.", textPt: "Controlar propulsores." },
        { letter: "C", text: "Manage the position reference systems.", textPt: "Gerenciar os sistemas de referência de posição." },
        { letter: "D", text: "Calculate the vessel's position.", textPt: "Calcular a posição da embarcação." },
      ],
    },
    // Q48
    {
      id: 48,
      question: "Catastrophic failures within a DP system are avoided by?",
      questionPt: "Falhas catastróficas em um sistema DP são evitadas por?",
      answer: "A - Ensuring system redundancy to equipment Class 2 or 3.",
      answerPt: "Garantindo a redundância do sistema para equipamentos Classe 2 ou 3.",
      options: [
        { letter: "A", text: "Ensuring system redundancy to equipment Class 2 or 3.", textPt: "Garantindo a redundância do sistema para equipamentos Classe 2 ou 3." },
        { letter: "B", text: "Using only Class 1 equipment.", textPt: "Usando apenas equipamentos Classe 1." },
        { letter: "C", text: "Reducing the number of thrusters.", textPt: "Reduzindo o número de propulsores." },
        { letter: "D", text: "Operating only in calm conditions.", textPt: "Operando apenas em condições calmas." },
      ],
    },
    // Q49
    {
      id: 49,
      question: "Catastrophic failures within a DP system are avoided through:",
      questionPt: "Falhas catastróficas em um sistema DP são evitadas através de:",
      answer: "A - The provision of redundancy.",
      answerPt: "A provisão de redundância.",
      options: [
        { letter: "A", text: "The provision of redundancy.", textPt: "A provisão de redundância." },
        { letter: "B", text: "Better maintenance.", textPt: "Melhor manutenção." },
        { letter: "C", text: "Using more powerful thrusters.", textPt: "Usando propulsores mais potentes." },
        { letter: "D", text: "Reducing the operation time.", textPt: "Reduzindo o tempo de operação." },
      ],
    },
    // Q50
    {
      id: 50,
      question: "Certain DP class notation require a program that monitors the directional necessary to maintain position under the prevailing environmental conditions, performing calculations to verify that sufficient thrust is available to maintain position in the event of a single point failure. This program is called:",
      questionPt: "Certas notações de classe DP requerem um programa que monitore o direcional necessário para manter a posição sob as condições ambientais predominantes, realizando cálculos para verificar se há empuxo suficiente disponível para manter a posição no evento de falha de um único ponto. O programa é chamado:",
      answer: "B - Consequence Analysis, and is required on class 2 or 3.",
      answerPt: "Análise de Consequências, e é obrigatório nas aulas 2 ou 3.",
      options: [
        { letter: "A", text: "Power Management System (PMS).", textPt: "Sistema de Gerenciamento de Energia (PMS)." },
        { letter: "B", text: "Consequence Analysis, and is required on class 2 or 3.", textPt: "Análise de Consequências, e é obrigatório nas aulas 2 ou 3." },
        { letter: "C", text: "Capability Diagram.", textPt: "Diagrama de Capacidade." },
        { letter: "D", text: "Dead Reckoning.", textPt: "Dead Reckoning." },
      ],
    },
    // Q51
    {
      id: 51,
      question: "DP vessels are particularly vulnerable to power shortages and blackout conditions. To guard against these events resulting in a vessel drift-off, vessels of Equipment Class 2 and 3 must be fitted with:",
      questionPt: "As embarcações DP são particularmente vulneráveis a faltas de energia e condições de apagão. Para se proteger contra estes eventos que resultem no afastamento da embarcação, as embarcações das Classes de Equipamento 2 e 3 devem estar equipadas com:",
      answer: "C - Power Management systems (PMS) and D - Consequence Analysis.",
      answerPt: "Sistemas de gerenciamento de energia (PMS) e Análise de Consequências.",
      options: [
        { letter: "A", text: "Only extra generators.", textPt: "Apenas geradores extras." },
        { letter: "B", text: "Only backup thrusters.", textPt: "Apenas propulsores de backup." },
        { letter: "C", text: "Power Management systems (PMS).", textPt: "Sistemas de gerenciamento de energia (PMS)." },
        { letter: "D", text: "Consequence Analysis.", textPt: "Análise de Consequências." },
      ],
    },
    // Q52
    {
      id: 52,
      question: "A DP mode which allows a vessel to automatically follow an ROV is called:",
      questionPt: "Um modo DP que permite que uma embarcação siga automaticamente um ROV é chamado:",
      answer: "C - Follow-target or Follow-Sub.",
      answerPt: "Follow-target ou Follow-Sub.",
      options: [
        { letter: "A", text: "Auto-track mode.", textPt: "Modo Auto-track." },
        { letter: "B", text: "Position-hold mode.", textPt: "Modo Position-hold." },
        { letter: "C", text: "Follow-target or Follow-Sub.", textPt: "Follow-target ou Follow-Sub." },
        { letter: "D", text: "ROV-follow mode.", textPt: "Modo ROV-follow." },
      ],
    },
    // Q53
    {
      id: 53,
      question: "When the DP system is in full automatic control of the vessel, the DP current is:",
      questionPt: "Quando o sistema DP está no controle automático total da embarcação, a corrente DP é:",
      answer: "A - Determined from the mathematical model.",
      answerPt: "Determinado a partir do modelo matemático.",
      options: [
        { letter: "A", text: "Determined from the mathematical model.", textPt: "Determinado a partir do modelo matemático." },
        { letter: "B", text: "Measured by a current meter.", textPt: "Medido por um medidor de corrente." },
        { letter: "C", text: "Calculated from wind data.", textPt: "Calculado a partir de dados de vento." },
        { letter: "D", text: "Input manually by the DPO.", textPt: "Inserido manualmente pelo DPO." },
      ],
    },
    // Q54
    {
      id: 54,
      question: "Which component is the most important part of a DP system?",
      questionPt: "Qual componente é a parte mais importante de um sistema de DP?",
      answer: "C - The Gyrocompass.",
      answerPt: "Giroscópica.",
      options: [
        { letter: "A", text: "The DP computer.", textPt: "O computador DP." },
        { letter: "B", text: "The position reference system.", textPt: "O sistema de referência de posição." },
        { letter: "C", text: "The Gyrocompass.", textPt: "Giroscópica." },
        { letter: "D", text: "The thrusters.", textPt: "Os propulsores." },
      ],
    },
    // Q55
    {
      id: 55,
      question: "What information found on a DP system would a DPO use to determine the best heading to take to minimize power consumption and thruster loads?",
      questionPt: "Quais informações encontradas em um sistema de DP um DPO usaria para determinar o melhor título a ser tomado para minimizar consumo de energia e cargas do propulsor?",
      answer: "C - Wind/DP current speed and direction.",
      answerPt: "Velocidade e direção da corrente de vento/DP.",
      options: [
        { letter: "A", text: "The gyro heading.", textPt: "O rumo da giroscópica." },
        { letter: "B", text: "The vessel's speed.", textPt: "A velocidade da embarcação." },
        { letter: "C", text: "Wind/DP current speed and direction.", textPt: "Velocidade e direção da corrente de vento/DP." },
        { letter: "D", text: "The position reference accuracy.", textPt: "A precisão da referência de posição." },
      ],
    },
    // Q56
    {
      id: 56,
      question: "What is a vessel model?",
      questionPt: "O que é um modelo de embarcação?",
      answer: "C - A mathematical description of how the vessel reacts to the forces acting upon it.",
      answerPt: "Uma descrição matemática de como o navio reage às forças que agem sobre ele.",
      options: [
        { letter: "A", text: "A 3D representation of the vessel.", textPt: "Uma representação 3D da embarcação." },
        { letter: "B", text: "A physical scale model of the vessel.", textPt: "Um modelo físico em escala da embarcação." },
        { letter: "C", text: "A mathematical description of how the vessel reacts to the forces acting upon it.", textPt: "Uma descrição matemática de como o navio reage às forças que agem sobre ele." },
        { letter: "D", text: "A diagram of the vessel's structure.", textPt: "Um diagrama da estrutura da embarcação." },
      ],
    },
    // Q57
    {
      id: 57,
      question: "What is the purpose of the 'Wind Feed Forward' facility?",
      questionPt: "Qual é o objetivo da instalação 'Wind Feed Forward'?",
      answer: "B - Detecting rapid changes in wind force and providing an immediate opposing thrust.",
      answerPt: "Detectar mudanças rápidas na força do vento e fornecer um impulso oposto imediato.",
      options: [
        { letter: "A", text: "To measure wind speed and direction for weather forecasting.", textPt: "Para medir a velocidade e direção do vento para previsão do tempo." },
        { letter: "B", text: "Detecting rapid changes in wind force and providing an immediate opposing thrust.", textPt: "Detectar mudanças rápidas na força do vento e fornecer um impulso oposto imediato." },
        { letter: "C", text: "To reduce fuel consumption by optimizing heading.", textPt: "Para reduzir o consumo de combustível otimizando o rumo." },
        { letter: "D", text: "To calibrate the wind sensors.", textPt: "Para calibrar os sensores de vento." },
      ],
    },
    // Q58
    {
      id: 58,
      question: "As a general rule, control of what axis will receive priority for thrust allocation when in DP mode?",
      questionPt: "Como regra geral, o controle de qual eixo receberá prioridade para alocação de empuxo quando no modo DP?",
      answer: "C - Yaw.",
      answerPt: "Yaw.",
      options: [
        { letter: "A", text: "Surge.", textPt: "Surge." },
        { letter: "B", text: "Sway.", textPt: "Sway." },
        { letter: "C", text: "Yaw.", textPt: "Yaw." },
        { letter: "D", text: "All axes equally.", textPt: "Todos os eixos igualmente." },
      ],
    },
    // Q59
    {
      id: 59,
      question: "Which of the following are sensors that may be used in a DP system?",
      questionPt: "Quais dos seguintes sensores podem ser usados em um sistema DP?",
      answer: "A - Gyro compass.",
      answerPt: "Giroscópica.",
      options: [
        { letter: "A", text: "Gyro compass.", textPt: "Giroscópica." },
        { letter: "B", text: "Barometer.", textPt: "Barômetro." },
        { letter: "C", text: "Thermometer.", textPt: "Termômetro." },
        { letter: "D", text: "Hygrometer.", textPt: "Hidrômetro." },
      ],
    },
    // Q60
    {
      id: 60,
      question: "Which of the following statements is correct with respect to a vessel under Auto-DP control?",
      questionPt: "Qual das afirmações a seguir está correta em relação a uma embarcação sob controle Auto-DP?",
      answer: "A - The DPO can use the DP system to achieve automatic change of position or heading.",
      answerPt: "O DPO pode usar o sistema DP para conseguir a mudança automática de posição ou cabeçalho.",
      options: [
        { letter: "A", text: "The DPO can use the DP system to achieve automatic change of position or heading.", textPt: "O DPO pode usar o sistema DP para conseguir a mudança automática de posição ou cabeçalho." },
        { letter: "B", text: "The DPO cannot change the heading in Auto-DP mode.", textPt: "O DPO não pode mudar o rumo no modo Auto-DP." },
        { letter: "C", text: "The vessel cannot change position automatically.", textPt: "A embarcação não pode mudar de posição automaticamente." },
        { letter: "D", text: "The system only maintains heading, not position.", textPt: "O sistema mantém apenas o rumo, não a posição." },
      ],
    },
    // Q61
    {
      id: 61,
      question: "What is required to enable auto-heading control while in Joystick mode?",
      questionPt: "O que é necessário para ativar o controle de direção automática no modo Joystick?",
      answer: "C - Gyrocompass input.",
      answerPt: "Entrada da giroscópica.",
      options: [
        { letter: "A", text: "Wind sensor input.", textPt: "Entrada do sensor de vento." },
        { letter: "B", text: "Position reference input.", textPt: "Entrada de referência de posição." },
        { letter: "C", text: "Gyrocompass input.", textPt: "Entrada da giroscópica." },
        { letter: "D", text: "Speed log input.", textPt: "Entrada do speed log." },
      ],
    },
    // Q62
    {
      id: 62,
      question: "Which one of the following degrees of freedom is monitored (but NOT controlled) by the DP system?",
      questionPt: "Qual dos seguintes graus de liberdade é monitorado (mas NÃO controlado) pelo sistema DP?",
      answer: "A - Pitch.",
      answerPt: "Pitch.",
      options: [
        { letter: "A", text: "Pitch.", textPt: "Pitch." },
        { letter: "B", text: "Yaw.", textPt: "Yaw." },
        { letter: "C", text: "Sway.", textPt: "Sway." },
        { letter: "D", text: "Surge.", textPt: "Surge." },
      ],
    },
    // Q63
    {
      id: 63,
      question: "When a vessel is operating in Auto-DP mode, how is the vessel's heading controlled?",
      questionPt: "Quando uma embarcação está operando no modo Auto-DP, como a direção da embarcação é controlada?",
      answer: "D - Automatically by the system.",
      answerPt: "Automaticamente pelo sistema.",
      options: [
        { letter: "A", text: "Manually by the DPO.", textPt: "Manualmente pelo DPO." },
        { letter: "B", text: "By the wind sensor.", textPt: "Pelo sensor de vento." },
        { letter: "C", text: "By the position reference system.", textPt: "Pelo sistema de referência de posição." },
        { letter: "D", text: "Automatically by the system.", textPt: "Automaticamente pelo sistema." },
      ],
    },
    // Q64
    {
      id: 64,
      question: "About what point does a DP vessel rotate when changing heading?",
      questionPt: "Em que ponto um navio DP gira ao mudar de direção?",
      answer: "C - The vessel's Centre of Rotation.",
      answerPt: "Centro de Rotação da embarcação.",
      options: [
        { letter: "A", text: "The vessel's centre of gravity.", textPt: "O centro de gravidade da embarcação." },
        { letter: "B", text: "The vessel's centre of buoyancy.", textPt: "O centro de flutuação da embarcação." },
        { letter: "C", text: "The vessel's Centre of Rotation.", textPt: "Centro de Rotação da embarcação." },
        { letter: "D", text: "The DP reference point.", textPt: "O ponto de referência DP." },
      ],
    },
    // Q65
    {
      id: 65,
      question: "The value of the DP Current as shown on the DP screen may be inaccurate. A possible reason for this is:",
      questionPt: "O valor da corrente DP conforme mostrado na tela DP pode ser impreciso. Uma possível razão para isso é:",
      answer: "B - An unknown external force acting on the vessel and/or an unmeasured error within the DP System.",
      answerPt: "Uma força externa desconhecida atuando sobre o navio e/ou um erro não medido dentro do sistema DP.",
      options: [
        { letter: "A", text: "The wind sensor is faulty.", textPt: "O sensor de vento está com defeito." },
        { letter: "B", text: "An unknown external force acting on the vessel and/or an unmeasured error within the DP System.", textPt: "Uma força externa desconhecida atuando sobre o navio e/ou um erro não medido dentro do sistema DP." },
        { letter: "C", text: "The gyro compass is drifting.", textPt: "A giroscópica está derivando." },
        { letter: "D", text: "The position reference system is inaccurate.", textPt: "O sistema de referência de posição está impreciso." },
      ],
    },
    // Q66
    {
      id: 66,
      question: "What is the main purpose of Dynamic Positioning?",
      questionPt: "Qual o principal objetivo do Posicionamento Dinâmico?",
      answer: "B - To allow a vessel to maintain a fixed position and heading exclusively by means of active thrust.",
      answerPt: "Permitir que uma embarcação mantenha uma posição e direção fixas exclusivamente por meio de thrust.",
      options: [
        { letter: "A", text: "To navigate the vessel from one point to another.", textPt: "Para navegar a embarcação de um ponto a outro." },
        { letter: "B", text: "To allow a vessel to maintain a fixed position and heading exclusively by means of active thrust.", textPt: "Permitir que uma embarcação mantenha uma posição e direção fixas exclusivamente por meio de thrust." },
        { letter: "C", text: "To anchor the vessel in deep water.", textPt: "Para ancorar a embarcação em águas profundas." },
        { letter: "D", text: "To avoid collisions with other vessels.", textPt: "Para evitar colisões com outras embarcações." },
      ],
    },
    // Q67
    {
      id: 67,
      question: "A floating vessel has six degrees of freedom, three of which can be controlled by a Dynamic Positioning system. One of these three does not depend on the input of a position reference system (PRS). Which is it?",
      questionPt: "Uma embarcação flutuante tem seis graus de liberdade, três dos quais podem ser controlados por um sistema de Posicionamento Dinâmico. Um desses três não depende da entrada de um sistema de referência de posição (PRS). Qual é?",
      answer: "C - Yaw.",
      answerPt: "Yaw.",
      options: [
        { letter: "A", text: "Surge.", textPt: "Surge." },
        { letter: "B", text: "Sway.", textPt: "Sway." },
        { letter: "C", text: "Yaw.", textPt: "Yaw." },
        { letter: "D", text: "Heave.", textPt: "Heave." },
      ],
    },
    // Q68
    {
      id: 68,
      question: "What would be a disadvantage of a DP system over anchored vessel control?",
      questionPt: "Qual seria a desvantagem de um sistema de DP em relação ao controle de embarcações ancoradas?",
      answer: "C - Continually running thrusters are hazards for divers and ROVs.",
      answerPt: "Propulsores em funcionamento contínuo são perigos para mergulhadores e ROVs.",
      options: [
        { letter: "A", text: "Higher fuel consumption.", textPt: "Maior consumo de combustível." },
        { letter: "B", text: "More complex setup.", textPt: "Configuração mais complexa." },
        { letter: "C", text: "Continually running thrusters are hazards for divers and ROVs.", textPt: "Propulsores em funcionamento contínuo são perigos para mergulhadores e ROVs." },
        { letter: "D", text: "Limited positioning accuracy.", textPt: "Precisão de posicionamento limitada." },
      ],
    },
    // Q69
    {
      id: 69,
      question: "Some DP vessels are fitted with draught sensors, enabling continuous draught feedback to the DP system. This is to allow:",
      questionPt: "Alguns navios DP são equipados com sensores de calado, permitindo o feedback contínuo do calado para o sistema DP. Isso é para permitir:",
      answer: "B - Continuous update of the vessel model regarding changes to vessel mass.",
      answerPt: "Atualização contínua do modelo do navio quanto às alterações na massa do navio.",
      options: [
        { letter: "A", text: "Accurate cargo loading calculations.", textPt: "Cálculos precisos de carga." },
        { letter: "B", text: "Continuous update of the vessel model regarding changes to vessel mass.", textPt: "Atualização contínua do modelo do navio quanto às alterações na massa do navio." },
        { letter: "C", text: "Better fuel efficiency.", textPt: "Melhor eficiência de combustível." },
        { letter: "D", text: "Improved position reference accuracy.", textPt: "Precisão aprimorada da referência de posição." },
      ],
    },
    // Q70
    {
      id: 70,
      question: "A vessel is preparing to commence DP operations in shallow water. A number of additional considerations arise. Which of the following is NOT a significant factor in shallow-water operations?",
      questionPt: "Uma embarcação se prepara para iniciar as operações do DP em águas rasas. Algumas considerações adicionais surgem. Qual dos seguintes fatores NÃO é significativo em operações em águas rasas?",
      answer: "A - Hydro acoustic Position references have increased horizontal range in shallow water.",
      answerPt: "As referências de posição hidroacústica têm alcance horizontal aumentado em águas rasas.",
      options: [
        { letter: "A", text: "Hydro acoustic Position references have increased horizontal range in shallow water.", textPt: "As referências de posição hidroacústica têm alcance horizontal aumentado em águas rasas." },
        { letter: "B", text: "Thruster efficiency may be reduced due to shallow water effects.", textPt: "A eficiência do propulsor pode ser reduzida devido a efeitos de águas rasas." },
        { letter: "C", text: "Increased risk of grounding.", textPt: "Aumento do risco de encalhe." },
        { letter: "D", text: "Position reference systems may have limited accuracy.", textPt: "Os sistemas de referência de posição podem ter precisão limitada." },
      ],
    },
    // Q71
    {
      id: 71,
      question: "A DP-capable drilling rig is engaged in drilling operations in deep water. The DP system is selected into the 'Riser Angle Mode' for positioning. Position reference is from dual DGPS and an acoustic system. Riser angle data is provided:",
      questionPt: "Uma sonda de perfuração com capacidade de DP está envolvida em operações de perfuração em águas profundas. O sistema DP é selecionado no 'Modo de ângulo de riser' para posicionamento. A referência de posição é a partir de DGPS duplo e um sistema acústico. Dados de ângulo do riser são fornecidos:",
      answer: "B - By angle sensors located at the wellhead.",
      answerPt: "Por sensores angulares localizados na cabeça do poço.",
      options: [
        { letter: "A", text: "By the DP computer.", textPt: "Pelo computador DP." },
        { letter: "B", text: "By angle sensors located at the wellhead.", textPt: "Por sensores angulares localizados na cabeça do poço." },
        { letter: "C", text: "By the acoustic positioning system.", textPt: "Pelo sistema de posicionamento acústico." },
        { letter: "D", text: "By the DPO manually.", textPt: "Manualmente pelo DPO." },
      ],
    },
    // Q72
    {
      id: 72,
      question: "A vessel has completed her approach to a worksite which is close alongside a fixed platform. She is in her final working position. Before giving the 'green light' allowing commencement of ROV operations it is essential that:",
      questionPt: "Uma embarcação completou sua aproximação a um canteiro de obras que fica próximo a uma plataforma fixa. Ela está em sua posição final de trabalho. Antes de dar a 'luz verde' que permite o início das operações de ROV, é essencial que:",
      answer: "C - 30 minutes settling time be allowed.",
      answerPt: "Tempo de assentamento de 30 minutos.",
      options: [
        { letter: "A", text: "The thrusters are fully operational.", textPt: "Os propulsores estão totalmente operacionais." },
        { letter: "B", text: "The position reference systems are calibrated.", textPt: "Os sistemas de referência de posição estão calibrados." },
        { letter: "C", text: "30 minutes settling time be allowed.", textPt: "Tempo de assentamento de 30 minutos." },
        { letter: "D", text: "The wind speed is below 15 knots.", textPt: "A velocidade do vento está abaixo de 15 nós." },
      ],
    },
    // Q73
    {
      id: 73,
      question: "A cable vessel is engaged in ploughing operations, and is following a pre-determined track. The vessel under the control of the DP system is selected into 'Auto-track' mode. If feedback data from the plough hawser tension sensor becomes inaccurate, then the probable result will be:",
      questionPt: "Uma embarcação de cabo está envolvida em operações de aração e está seguindo uma trilha pré-determinada. O navio sob o controle do sistema DP é selecionado no modo 'Auto-track'. Se os dados de feedback do sensor de tensão do arado se tornarem imprecisos, o resultado provável será:",
      answer: "D - Plough tension will be displayed by the system as current.",
      answerPt: "A tensão do arado será exibida pelo sistema como corrente.",
      options: [
        { letter: "A", text: "The vessel will stop operations.", textPt: "A embarcação parará as operações." },
        { letter: "B", text: "The system will switch to manual mode.", textPt: "O sistema mudará para o modo manual." },
        { letter: "C", text: "The plough will be damaged.", textPt: "O arado será danificado." },
        { letter: "D", text: "Plough tension will be displayed by the system as current.", textPt: "A tensão do arado será exibida pelo sistema como corrente." },
      ],
    },
    // Q74
    {
      id: 74,
      question: "When conducting diving operations from a vessel on DP, the lengths of the divers' umbilicals must be:",
      questionPt: "Ao realizar operações de mergulho a partir de uma embarcação em DP, os comprimentos dos umbilicais dos mergulhadores devem ser:",
      answer: "D - No greater than 5m less than the distance of the nearest thruster from the umbilical tending-point.",
      answerPt: "Não superior a 5m inferior à distância do propulsor mais próximo do ponto de tenda umbilical.",
      options: [
        { letter: "A", text: "As long as possible for safety.", textPt: "O mais longo possível por segurança." },
        { letter: "B", text: "At least 10m.", textPt: "Pelo menos 10m." },
        { letter: "C", text: "No greater than 10m.", textPt: "Não superior a 10m." },
        { letter: "D", text: "No greater than 5m less than the distance of the nearest thruster from the umbilical tending-point.", textPt: "Não superior a 5m inferior à distância do propulsor mais próximo do ponto de tenda umbilical." },
      ],
    },
    // Q75
    {
      id: 75,
      question: "A vessel is on DP close to a platform structure. The Windsensor input is selected and wind compensation is active. How will the vessel react if the hull and superstructure is in wind shadow and the wind sensor is suddenly exposed to the full force of the wind?",
      questionPt: "Uma embarcação está na DP perto de uma estrutura de plataforma. A entrada do sensor de vento é selecionada e a compensação de vento está ativo. Como a embarcação reagirá se o casco e a superestrutura estiverem na sombra do vento e o sensor de vento estiver de repente exposto a toda a força do vento?",
      answer: "A - The system will apply thrust and move against the wind.",
      answerPt: "O sistema aplicará empuxo e se moverá contra o vento.",
      options: [
        { letter: "A", text: "The system will apply thrust and move against the wind.", textPt: "O sistema aplicará empuxo e se moverá contra o vento." },
        { letter: "B", text: "The system will ignore the wind reading.", textPt: "O sistema ignorará a leitura do vento." },
        { letter: "C", text: "The vessel will drift with the wind.", textPt: "A embarcação derivará com o vento." },
        { letter: "D", text: "The system will enter Dead Reckoning mode.", textPt: "O sistema entrará no modo Dead Reckoning." },
      ],
    },
  ];

  // ============================================
  // QUESTION ITEM COMPONENT
  // ============================================

  function QuestionItem({ q, index }: { q: Question; index: number }) {
    const [showOptions, setShowOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [typedAnswer, setTypedAnswer] = useState("");
    const [showCorrect, setShowCorrect] = useState(false);
    const [showTranslation, setShowTranslation] = useState(false); // <-- estado local para tradução

    const correctLetter = q.answer ? q.answer.charAt(0) : "";
    const correctText = q.answer;

    const handleOptionClick = (letter: string) => {
      setSelectedOption(letter);
      setTypedAnswer("");
    };

    const handleTypedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTypedAnswer(e.target.value);
      setSelectedOption(null);
    };

    const handleCheck = () => {
      setShowCorrect(true);
    };

    const handleClear = () => {
      setSelectedOption(null);
      setTypedAnswer("");
      setShowCorrect(false);
    };

    const isCorrect = selectedOption === correctLetter || typedAnswer.trim().toUpperCase() === correctLetter;

    return (
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-bold text-sm min-w-[30px]">Q{index+1}.</span>
          <div className="flex-1">
            {/* Pergunta em inglês com áudio */}
            <SpeakSentence text={q.question} className="text-gray-800 font-medium cursor-pointer block hover:text-blue-700">
              {q.question}
            </SpeakSentence>
            {/* Pergunta em português - condicional com base no estado local */}
            {showTranslation && q.questionPt && (
              <p className="text-gray-500 text-sm mt-0.5">{q.questionPt}</p>
            )}

            {/* Botões de ação: mostrar opções e tradução */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1 rounded-full transition-colors"
              >
                {showOptions ? "Ocultar opções" : "Mostrar opções"}
              </button>
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`text-sm px-4 py-1 rounded-full transition-colors ${
                  showTranslation
                    ? "bg-purple-200 hover:bg-purple-300 text-purple-800"
                    : "bg-green-100 hover:bg-green-200 text-green-700"
                }`}
              >
                {showTranslation ? "Ocultar tradução" : "Mostrar tradução"}
              </button>
            </div>

            {showOptions && q.options && (
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => (
                  <div
                    key={opt.letter}
                    onClick={() => handleOptionClick(opt.letter)}
                    className={`flex items-start gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedOption === opt.letter
                        ? "bg-blue-100 border-blue-400 border"
                        : "hover:bg-gray-100 border border-transparent"
                    } ${
                      showCorrect && opt.letter === correctLetter
                        ? "bg-green-100 border-green-400 border"
                        : ""
                    }`}
                  >
                    <span className="font-bold text-gray-600 min-w-[20px]">{opt.letter}.</span>
                    <div>
                      <SpeakText text={opt.text} className="text-gray-700 cursor-pointer hover:text-blue-600">
                        {opt.text}
                      </SpeakText>
                      {/* Tradução da opção - condicional com base no estado local */}
                      {showTranslation && opt.textPt && (
                        <span className="text-gray-400 text-xs ml-2">({opt.textPt})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Campo para digitar resposta */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={typedAnswer}
                onChange={handleTypedChange}
                placeholder="Digite sua resposta (A, B, C, D)..."
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-48 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={handleCheck}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full transition-colors"
              >
                Verificar
              </button>
              <button
                onClick={handleClear}
                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-full transition-colors"
              >
                Limpar
              </button>
            </div>

            {/* Exibição da resposta correta */}
            {showCorrect && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                  <div>
                    <SpeakSentence text={correctText} className="text-green-700 font-medium cursor-pointer hover:text-green-900">
                      {correctText}
                    </SpeakSentence>
                    {/* Tradução da resposta - condicional com base no estado local */}
                    {showTranslation && q.answerPt && (
                      <p className="text-gray-500 text-sm">{q.answerPt}</p>
                    )}
                    {selectedOption || typedAnswer ? (
                      <p className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-500"}`}>
                        {isCorrect ? "✅ Correta!" : "❌ Incorreta. Tente novamente."}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("/images/lesson1-86.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* Título */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-4">
            ⚓ Lesson 20 - Dynamic Positioning (DP)
          </h1>
          <SpeakSentence text="Dynamic Positioning system definitions and exam questions for DP operators." className="text-xl text-gray-700 max-w-3xl mx-auto">
            📚 Dynamic Positioning system definitions and exam questions for DP operators.
          </SpeakSentence>
        </div>

        {/* ===== SEÇÃO DEFINIÇÕES ===== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 KEY DEFINITIONS!</h2>
              <PencilIcon onClick={() => openNoteModal("Definitions")} />
            </div>
            <button
              onClick={() => toggleSection("definitions")}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
            >
              {openSections.definitions ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {openSections.definitions && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence text="Click on any term to hear its pronunciation in English." className="text-md text-gray-600 mb-4 italic">
                🎧 Click on any term to hear its pronunciation in English.
              </SpeakSentence>

              <div className="space-y-6">
                {definitions.map((def, idx) => (
                  <div key={idx} className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 font-bold text-lg">#{idx + 1}</span>
                      <div className="flex-1">
                        <SpeakText text={def.term} className="text-blue-700 font-bold text-lg cursor-pointer block">
                          {def.term}
                        </SpeakText>
                        <div className="mt-2 text-gray-700">
                          <p className="font-medium">🇺🇸 English:</p>
                          <p className="text-sm italic">{def.english}</p>
                        </div>
                        <div className="mt-1 text-gray-700">
                          <p className="font-medium">🇧🇷 Português:</p>
                          <p className="text-sm italic">{def.portuguese}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== SEÇÃO QUESTÕES ===== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold">🔹 EXAM QUESTIONS ({questions.length})</h2>
              <PencilIcon onClick={() => openNoteModal("All Questions")} />
            </div>
            <button
              onClick={() => toggleSection("questions")}
              className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-6 py-2 text-sm transition-all duration-300"
            >
              {openSections.questions ? "Ocultar" : "Mostrar todas"}
            </button>
          </div>

          {openSections.questions && (
            <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
              <SpeakSentence text="Click on each question to hear it spoken. Use the options or type your answer." className="text-md text-gray-600 mb-4 italic">
                🎧 Click on each question to hear it spoken. Use the options or type your answer.
              </SpeakSentence>

              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <QuestionItem key={idx} q={q} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson14")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

      {/* Modal de anotações */}
      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}