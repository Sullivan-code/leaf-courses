"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Eye, EyeOff, BookOpen, HelpCircle, Award, CheckCircle, XCircle, Languages, RefreshCw, Shuffle } from "lucide-react";

// ============================================
// TIPOS
// ============================================
type SectionKey = 'pre' | 'quiz' | 'post' | 'gabarito';

interface Question {
  id: number;
  question: string;
  questionPt: string;
  options: string[];
  optionsPt: string[];
  correct: number;
  explanation: string;
  explanationPt: string;
}

interface ShuffledQuestion extends Question {
  originalId: number;
  correct: number;
}

// ============================================
// SISTEMA DE VOZ (American Female)
// ============================================
const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.filter(v =>
    (v.lang === 'en-US' || v.lang.startsWith('en-US')) &&
    (v.name.toLowerCase().includes('samantha') ||
     v.name.toLowerCase().includes('google us english') ||
     v.name.toLowerCase().includes('siri') ||
     v.name.toLowerCase().includes('female'))
  );
  const american = voices.filter(v => v.lang === 'en-US' || v.lang.startsWith('en-US'));
  if (preferred.length > 0) utterance.voice = preferred[0];
  else if (american.length > 0) utterance.voice = american[0];
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({ text, children, className = "", showIcon = true }: {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}) => (
  <button
    onClick={() => speakEnglish(text, 0.9)}
    className={`inline-flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 rounded transition-colors group ${className}`}
    title="Click to hear American pronunciation"
  >
    {children || text}
    {showIcon && <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />}
  </button>
);

const SpeakSentence = ({ text, children, className = "" }: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={() => {
      const speechText = children && typeof children === 'string' ? children : text;
      speakEnglish(speechText, 0.85);
    }}
    className={`group cursor-pointer hover:bg-blue-50 px-1 rounded transition-colors text-left w-full ${className}`}
  >
    {children || text}
    <Volume2 size={12} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
  </button>
);

// ============================================
// FUNÇÕES DE EMBARALHAMENTO
// ============================================
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ============================================
// BANCO DE QUESTÕES – BASEADO NO PDF DP COURSE
// ============================================
const RAW_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is Dynamic Positioning (DP), according to the formal definition in the course material?",
    questionPt: "O que é Dynamic Positioning (DP), de acordo com a definição formal do material?",
    options: [
      "A type of anchor system that uses multiple cables to keep the vessel in one place at any water depth",
      "A vessel capability that automatically controls position and heading exclusively by means of active thrust",
      "A passive capability that keeps the vessel in place using tensioned wires and anchors connected to the seabed",
      "A navigation software that calculates the vessel's position and sends the data to the operator for manual decisions"
    ],
    optionsPt: [
      "Um tipo de sistema de ancoragem que usa múltiplos cabos para manter a embarcação no lugar em qualquer profundidade",
      "Uma capacidade da embarcação que controla automaticamente posição e rumo exclusivamente por meio de propulsão ativa",
      "Uma capacidade passiva que mantém a embarcação no lugar usando cabos tensionados e âncoras conectadas ao fundo",
      "Um software de navegação que calcula a posição da embarcação e envia os dados para o operador decidir manualmente"
    ],
    correct: 1,
    explanation: "The formal definition states: 'Dynamic positioning is a vessel capability provided through the integration of a variety of individual systems and functions... a system that automatically controls a vessel's position and heading exclusively by means of active thrust.'",
    explanationPt: "A definição formal afirma: 'Dynamic positioning é uma capacidade da embarcação obtida pela integração de vários sistemas e funções individuais... um sistema que controla automaticamente a posição e o rumo de uma embarcação exclusivamente por meio de propulsão ativa.'"
  },
  {
    id: 2,
    question: "Which three axes does the DP system control in the horizontal plane?",
    questionPt: "Quais três eixos o sistema DP controla no plano horizontal?",
    options: [
      "Heave, Roll and Pitch — vertical movement, longitudinal rotation and transverse rotation",
      "Surge, Sway and Yaw — longitudinal movement, transverse movement and rotation around the vertical axis",
      "Surge, Heave and Pitch — combining longitudinal movement with vertical and angular oscillations",
      "Sway, Roll and Yaw — combining transverse movement with longitudinal and vertical rotations"
    ],
    optionsPt: [
      "Heave, Roll e Pitch — movimento vertical, rotação longitudinal e rotação transversal",
      "Surge, Sway e Yaw — movimento longitudinal, movimento transversal e rotação em torno do eixo vertical",
      "Surge, Heave e Pitch — combinando movimento longitudinal com oscilações verticais e angulares",
      "Sway, Roll e Yaw — combinando movimento transversal com rotações longitudinal e vertical"
    ],
    correct: 1,
    explanation: "The DP system controls Surge (X), Sway (Y) and Yaw (N). Heave, Roll and Pitch are measured for sensor compensation, but are NOT controlled by DP.",
    explanationPt: "O sistema DP controla Surge (X), Sway (Y) e Yaw (N). Heave, Roll e Pitch são medidos para compensação de sensores, mas NÃO são controlados pelo DP."
  },
  {
    id: 3,
    question: "What is the function of the Kalman Filter in a DP system?",
    questionPt: "Qual é a função do Kalman Filter em um sistema DP?",
    options: [
      "To store the vessel's position history and generate operational performance reports for the client",
      "To estimate motion and current parameters, filtering noise and predicting the future state of the vessel",
      "To directly control thruster power based on the wind speed measured instantaneously by the sensors",
      "To replace the vessel's mathematical model when it cannot adapt to the environmental conditions"
    ],
    optionsPt: [
      "Armazenar o histórico de posições da embarcação e gerar relatórios de desempenho operacional para o cliente",
      "Estimar parâmetros de movimento e corrente, filtrando ruídos e prevendo o estado futuro da embarcação",
      "Controlar diretamente a potência dos thrusters com base na velocidade do vento medida instantaneamente",
      "Substituir o modelo matemático da embarcação quando este não consegue se adaptar às condições ambientais"
    ],
    correct: 1,
    explanation: "The Kalman Filter uses the mathematical model to predict measurements, weighs sensor data according to their noise levels, and generates an optimal estimate of motion and current parameters.",
    explanationPt: "O Kalman Filter usa o modelo matemático para prever medições, pondera os dados dos sensores de acordo com seus níveis de ruído e gera uma estimativa ótima dos parâmetros de movimento e corrente."
  },
  {
    id: 4,
    question: "How long does the DP mathematical model typically take to fully adapt to the vessel and environment?",
    questionPt: "Quanto tempo o modelo matemático do DP leva, tipicamente, para se adaptar completamente à embarcação e ao ambiente?",
    options: [
      "About 5 minutes, and most manufacturers have already reduced this period to 2 minutes",
      "About 30 minutes, although some manufacturers have shortened it to 10–20 minutes in recent systems",
      "About 2 hours, and it is necessary to wait for this period before any critical operation",
      "About 15 minutes, regardless of the environmental conditions or the type of vessel"
    ],
    optionsPt: [
      "Cerca de 5 minutos, e a maioria dos fabricantes já reduziu esse período para 2 minutos",
      "Cerca de 30 minutos, embora alguns fabricantes tenham reduzido para 10–20 minutos em sistemas recentes",
      "Cerca de 2 horas, sendo necessário aguardar esse período antes de qualquer operação crítica",
      "Cerca de 15 minutos, independentemente das condições ambientais ou do tipo de embarcação"
    ],
    correct: 1,
    explanation: "The material states: 'It is normal to allow 30 minutes as a model-building period, or settling time... In safety critical operations 30 minutes is still recognized as a standard settling period.'",
    explanationPt: "O material afirma: 'É normal permitir 30 minutos como período de construção do modelo, ou settling time... Em operações críticas de segurança, 30 minutos ainda é reconhecido como período padrão de estabilização.'"
  },
  {
    id: 5,
    question: "What is the normal startup cycle of a gyrocompass and what is the effect of the slew control?",
    questionPt: "Qual é o ciclo normal de startup de um gyrocompass e qual é o efeito do slew control?",
    options: [
      "Startup of 2 hours; the slew control allows override after 30 minutes",
      "Startup of 6 hours; the slew control can override the automatic cycle after 5 minutes",
      "Startup of 12 hours; the slew control does not interfere with the automatic cycle",
      "Startup of 4 hours; the slew control allows override after 1 hour"
    ],
    optionsPt: [
      "Startup de 2 horas; o slew control permite override após 30 minutos",
      "Startup de 6 horas; o slew control pode override o ciclo automático após 5 minutos",
      "Startup de 12 horas; o slew control não interfere no ciclo automático",
      "Startup de 4 horas; o slew control permite override após 1 hora"
    ],
    correct: 1,
    explanation: "The material says: 'The normal startup cycle of a gyrocompass is 6 hrs. However, slew controls can override the automatic starting cycle after 5 mins.'",
    explanationPt: "O material diz: 'O ciclo normal de startup de um gyrocompass é de 6 horas. No entanto, os slew controls podem override o ciclo automático após 5 minutos.'"
  },
  {
    id: 6,
    question: "What is the typical accuracy of a Taut Wire system and what is its maximum range?",
    questionPt: "Qual é a precisão típica de um sistema Taut Wire e qual é o seu alcance máximo?",
    options: [
      "Accuracy of ±0.5% of depth, with a maximum range of 2,000 meters",
      "Accuracy of ±2% of depth, with a maximum range of 500 meters",
      "Accuracy of ±5% of depth, with a maximum range of 300 meters",
      "Accuracy of ±1% of depth, with a maximum range of 1,000 meters"
    ],
    optionsPt: [
      "Precisão de ±0,5% da profundidade, com alcance máximo de 2.000 metros",
      "Precisão de ±2% da profundidade, com alcance máximo de 500 metros",
      "Precisão de ±5% da profundidade, com alcance máximo de 300 metros",
      "Precisão de ±1% da profundidade, com alcance máximo de 1.000 metros"
    ],
    correct: 1,
    explanation: "The material states: 'Typical accuracy of a Taut Wire is ±2% of the water depth, up to 500 meters.'",
    explanationPt: "O material afirma: 'A precisão típica de um Taut Wire é de ±2% da profundidade da água, até 500 metros.'"
  },
  {
    id: 7,
    question: "What is the operating frequency of the Artemis system and what is its main limitation?",
    questionPt: "Qual é a frequência de operação do sistema Artemis e qual é a sua principal limitação?",
    options: [
      "It operates at 9.2 GHz, being affected by rain and fog, which limits its use in tropical regions",
      "It operates at 9.2 GHz, being unaffected by rain or fog, but requiring an unobstructed line of sight",
      "It operates at 2.4 GHz, being immune to atmospheric interference but limited to 5 km range",
      "It operates at 5.8 GHz, being affected by reflections from metallic structures and requiring constant calibration"
    ],
    optionsPt: [
      "Opera a 9.2 GHz, sendo afetado por chuva e nevoeiro, o que limita seu uso em regiões tropicais",
      "Opera a 9.2 GHz, não sendo afetado por chuva ou nevoeiro, mas exigindo linha de visada desobstruída",
      "Opera a 2.4 GHz, sendo imune a interferências atmosféricas mas limitado a 5 km de alcance",
      "Opera a 5.8 GHz, sendo afetado por reflexões em estruturas metálicas e exigindo calibração constante"
    ],
    correct: 1,
    explanation: "The material says: 'Artemis operates at 9.2GHz and is therefore unaffected by rain, fog or haze. It does, however, require an unobstructed line of sight.'",
    explanationPt: "O material diz: 'Artemis opera a 9,2 GHz e, portanto, não é afetado por chuva, nevoeiro ou névoa. No entanto, requer uma linha de visada desobstruída.'"
  },
  {
    id: 8,
    question: "What is the main difference between DP Class 1, Class 2 and Class 3?",
    questionPt: "Qual é a principal diferença entre DP Class 1, Class 2 e Class 3?",
    options: [
      "Class 1 has no redundancy; Class 2 tolerates a single active fault; Class 3 tolerates a single fault plus fire/flooding in one compartment",
      "Class 1 has full redundancy; Class 2 has partial redundancy; Class 3 is only a quality certification with no additional technical requirements",
      "Class 1 and Class 2 are technically identical, differing only in the number of sensors; Class 3 adds a second operator",
      "Class 1 is for small vessels; Class 2 for medium ones; Class 3 for large ones, with no relation to system redundancy"
    ],
    optionsPt: [
      "Class 1 não tem redundância; Class 2 tolera falha única ativa; Class 3 tolera falha única e incêndio/inundação em um compartimento",
      "Class 1 tem redundância total; Class 2 tem redundância parcial; Class 3 é apenas uma certificação de qualidade sem requisitos técnicos adicionais",
      "Class 1 e Class 2 são tecnicamente idênticas, diferindo apenas no número de sensores; Class 3 adiciona um segundo operador",
      "Class 1 é para embarcações pequenas; Class 2 para médias; Class 3 para grandes, sem relação com redundância de sistemas"
    ],
    correct: 0,
    explanation: "Class 1: loss of position may occur with a single fault. Class 2: loss of position will not occur with a single fault in any active component. Class 3: includes failure of static components, fire and flooding in one compartment.",
    explanationPt: "Class 1: perda de posição pode ocorrer com falha única. Class 2: perda de posição não ocorre com falha única em componente ativo. Class 3: inclui falha de componentes estáticos, incêndio e inundação em um compartimento."
  },
  {
    id: 9,
    question: "What is FMEA (Failure Modes and Effects Analysis) in the context of DP?",
    questionPt: "O que é FMEA (Failure Modes and Effects Analysis) no contexto de DP?",
    options: [
      "A financial report that analyzes the maintenance costs of dynamic positioning systems",
      "A systematic analysis that identifies failure modes and their consequences, mandatory for DP Class 2 and 3",
      "A mandatory training for DP operators, focused on emergency procedures and evacuation",
      "A simulation software that recreates extreme environmental conditions to test the vessel in real time"
    ],
    optionsPt: [
      "Um relatório financeiro que analisa os custos de manutenção dos sistemas de posicionamento dinâmico",
      "Uma análise sistemática que identifica modos de falha e suas consequências, obrigatória para DP Class 2 e 3",
      "Um treinamento obrigatório para operadores de DP, focado em procedimentos de emergência e evacuação",
      "Um software de simulação que recria condições ambientais extremas para testar a embarcação em tempo real"
    ],
    correct: 1,
    explanation: "FMEA is a systematic analysis of systems and subsystems to identify all potential failure modes and their consequences. It is mandatory for Class 2 and 3.",
    explanationPt: "FMEA é uma análise sistemática de sistemas e subsistemas para identificar todos os modos de falha potenciais e suas consequências. É obrigatória para Class 2 e 3."
  },
  {
    id: 10,
    question: "What is the difference between WCFDI (Worst-Case Failure Design Intent) and WCF (Worst-Case Failure)?",
    questionPt: "Qual é a diferença entre WCFDI (Worst-Case Failure Design Intent) e WCF (Worst-Case Failure)?",
    options: [
      "WCFDI is the real failure identified in the FMEA; WCF is the design intention defined in the contract",
      "WCFDI is the design intention defined in the contract; WCF is the single failure identified in the FMEA with maximum detrimental effect",
      "WCFDI and WCF are synonyms and can be used interchangeably in all technical documents",
      "WCFDI applies only to Class 3; WCF applies only to Class 2, with no overlap between the concepts"
    ],
    optionsPt: [
      "WCFDI é a falha real identificada no FMEA; WCF é a intenção de projeto definida no contrato",
      "WCFDI é a intenção de projeto definida no contrato; WCF é a falha única identificada no FMEA com máximo efeito detrimental",
      "WCFDI e WCF são sinônimos e podem ser usados indistintamente em todos os documentos técnicos",
      "WCFDI aplica-se apenas a Class 3; WCF aplica-se apenas a Class 2, sem sobreposição entre os conceitos"
    ],
    correct: 1,
    explanation: "WCFDI is the basis for design (defined in the contract); WCF is the single failure identified in the FMEA that results in the maximum detrimental effect on DP capability.",
    explanationPt: "WCFDI é a base para o projeto (definida no contrato); WCF é a falha única identificada no FMEA que resulta no máximo efeito detrimental na capacidade de DP."
  },
  {
    id: 11,
    question: "In JSAH mode (Joystick Auto Heading), how does the operator control the vessel?",
    questionPt: "No modo JSAH (Joystick Auto Heading), como o operador controla a embarcação?",
    options: [
      "The joystick controls Surge and Sway; the heading is automatically maintained by the gyrocompass",
      "The joystick controls Surge, Sway and Yaw; the operator has total control over all axes",
      "The joystick controls only the heading; the position is automatically maintained by the DP system",
      "The joystick controls the speed; the heading and position are maintained by pre-programmed waypoints"
    ],
    optionsPt: [
      "O joystick controla Surge e Sway; o rumo é mantido automaticamente pelo gyrocompass",
      "O joystick controla Surge, Sway e Yaw; o operador tem controle total sobre todos os eixos",
      "O joystick controla apenas o rumo; a posição é mantida automaticamente pelo sistema DP",
      "O joystick controla a velocidade; o rumo e a posição são mantidos por waypoints pré-programados"
    ],
    correct: 0,
    explanation: "In JSAH mode, the joystick controls fore/aft and port/starboard movement, while the heading is automatically maintained by the gyrocompass.",
    explanationPt: "No modo JSAH, o joystick controla o movimento fore/aft e port/starboard, enquanto o heading é mantido automaticamente pelo gyrocompass."
  },
  {
    id: 12,
    question: "What characterizes the Minimum Power / Weathervaning mode?",
    questionPt: "O que caracteriza o modo Minimum Power / Weathervaning?",
    options: [
      "The vessel maintains a fixed position and the heading is adjusted to minimize thruster power consumption",
      "The vessel turns off all thrusters and uses only anchors to maintain position",
      "The vessel automatically reduces speed to zero and waits for better weather conditions",
      "The vessel alternates between DP and manual control to save fuel in adverse conditions"
    ],
    optionsPt: [
      "A embarcação mantém posição fixa e o rumo é ajustado para minimizar o consumo de potência dos thrusters",
      "A embarcação desliga todos os thrusters e utiliza apenas âncoras para manter a posição",
      "A embarcação reduz automaticamente a velocidade para zero e aguarda melhores condições climáticas",
      "A embarcação alterna entre DP e controle manual para economizar combustível em condições adversas"
    ],
    correct: 0,
    explanation: "In Minimum Power / Weathervaning mode, the position is maintained fixed while the heading is controlled to minimize the use of thruster power.",
    explanationPt: "No modo Minimum Power / Weathervaning, a posição é mantida fixa enquanto o rumo é controlado para minimizar o uso de potência pelos thrusters."
  },
  {
    id: 13,
    question: "What is the purpose of Riser Follow mode on drilling rigs?",
    questionPt: "Qual é o propósito do modo Riser Follow em sondas de perfuração?",
    options: [
      "To control the vessel's position to keep the riser angle close to zero",
      "To control the drill bit descent speed during well drilling",
      "To keep the vessel aligned with the wind direction to reduce fuel consumption",
      "To track the movement of an ROV during subsea inspection operations"
    ],
    optionsPt: [
      "Controlar a posição da embarcação para manter o ângulo do riser próximo de zero",
      "Controlar a velocidade de descida da broca durante a perfuração do poço",
      "Manter a embarcação alinhada com a direção do vento para reduzir o consumo de combustível",
      "Acompanhar o movimento de um ROV durante operações de inspeção subsea"
    ],
    correct: 0,
    explanation: "Riser Follow controls the vessel's position to keep the riser angle (between the drillstring and the wellhead) close to zero, using inclinometer and position signals.",
    explanationPt: "Riser Follow controla a posição da embarcação para manter o ângulo do riser (entre o drillstring e o wellhead) próximo de zero, usando sinais de inclinômetros e posição."
  },
  {
    id: 14,
    question: "What is Model Control mode and when is it activated?",
    questionPt: "O que é o modo Model Control e quando ele é ativado?",
    options: [
      "It is a simulation mode for operator training, activated manually by the DPO",
      "It is an emergency mode automatically activated when all PRS fail, allowing control for a limited time",
      "It is a computer-assisted manual control mode, activated when the joystick fails",
      "It is an energy-saving mode that automatically turns off the least efficient thrusters"
    ],
    optionsPt: [
      "É um modo de simulação para treinamento de operadores, ativado manualmente pelo DPO",
      "É um modo de emergência ativado automaticamente quando todos os PRS falham, permitindo controle por tempo limitado",
      "É um modo de controle manual assistido por computador, ativado quando o joystick falha",
      "É um modo de economia de energia que desliga os thrusters menos eficientes automaticamente"
    ],
    correct: 1,
    explanation: "Model Control is automatically activated if all reference systems fail. It allows the vessel to be controlled for 1 to 10 minutes (or longer) using the conditions prevailing at the time of failure.",
    explanationPt: "Model Control é automaticamente ativado se todos os reference systems falharem. Permite controlar a embarcação por 1 a 10 minutos (ou mais) usando as condições prevalecentes no momento da falha."
  },
  {
    id: 15,
    question: "What is the main function of the VRU (Vertical Reference Unit) in a DP system?",
    questionPt: "Qual é a principal função do VRU (Vertical Reference Unit) em um sistema DP?",
    options: [
      "To measure pitch, roll and acceleration to compensate sensors and PRS that depend on inclination",
      "To directly control the thrusters to compensate for the effects of heave, roll and pitch",
      "To provide the vessel's geographic position in latitude/longitude coordinates",
      "To measure the vessel's speed relative to the seabed using the Doppler effect"
    ],
    optionsPt: [
      "Medir pitch, roll e aceleração para compensar sensores e PRS que dependem de inclinação",
      "Controlar diretamente os thrusters para compensar os efeitos de heave, roll e pitch",
      "Fornecer a posição geográfica da embarcação em coordenadas latitude/longitude",
      "Medir a velocidade da embarcação em relação ao fundo do mar usando efeito Doppler"
    ],
    correct: 0,
    explanation: "The VRU measures pitch, roll and acceleration. Heave is calculated by double integration. The signals are used to compensate SBL/USBL acoustics, taut wire and riser inclinometers, and aerials.",
    explanationPt: "O VRU mede pitch, roll e aceleração. Heave é calculado por dupla integração. Os sinais são usados para compensar SBL/USBL acoustics, inclinômetros de taut wire e riser, e aeriais."
  },
  {
    id: 16,
    question: "What is the typical accuracy of a VRU for pitch and roll?",
    questionPt: "Qual é a precisão típica de um VRU para pitch e roll?",
    options: [
      "±30° range with 0.1° accuracy",
      "±10° range with 1° accuracy",
      "±45° range with 0.5° accuracy",
      "±60° range with 2° accuracy"
    ],
    optionsPt: [
      "Alcance de ±30° com precisão de 0,1°",
      "Alcance de ±10° com precisão de 1°",
      "Alcance de ±45° com precisão de 0,5°",
      "Alcance de ±60° com precisão de 2°"
    ],
    correct: 0,
    explanation: "The material states: 'A typical VRU provides heave readings in the range ±10m with an accuracy of 5cm or 5% and pitch and roll readings to ±30° down to accuracy 0.1°.'",
    explanationPt: "O material afirma: 'Um VRU típico fornece leituras de heave na faixa de ±10m com precisão de 5cm ou 5% e leituras de pitch e roll até ±30° com precisão de 0,1°.'"
  },
  {
    id: 17,
    question: "What is the maximum range and accuracy of the CyScan system?",
    questionPt: "Qual é o alcance máximo e a precisão do sistema CyScan?",
    options: [
      "Range of 250 m and accuracy of 20 cm, with bearing accuracy of 0.01°",
      "Range of 500 m and accuracy of 10 cm, with bearing accuracy of 0.05°",
      "Range of 100 m and accuracy of 50 cm, with bearing accuracy of 0.1°",
      "Range of 1,000 m and accuracy of 5 cm, with bearing accuracy of 0.02°"
    ],
    optionsPt: [
      "Alcance de 250 m e precisão de 20 cm, com bearing accuracy de 0,01°",
      "Alcance de 500 m e precisão de 10 cm, com bearing accuracy de 0,05°",
      "Alcance de 100 m e precisão de 50 cm, com bearing accuracy de 0,1°",
      "Alcance de 1.000 m e precisão de 5 cm, com bearing accuracy de 0,02°"
    ],
    correct: 0,
    explanation: "The material says: 'The CyScan has a range of 250m+ with an accuracy of 20cm and a bearing accuracy of 0.01°.'",
    explanationPt: "O material diz: 'O CyScan tem um alcance de 250m+ com precisão de 20cm e bearing accuracy de 0,01°.'"
  },
  {
    id: 18,
    question: "What is the difference between LBL, SBL and USBL in acoustic systems?",
    questionPt: "Qual é a diferença entre LBL, SBL e USBL em sistemas acústicos?",
    options: [
      "LBL uses an array of transponders on the seabed; SBL uses hull-mounted transducers; USBL uses one transponder and measures range and angles",
      "LBL is the least accurate; SBL is the most accurate; USBL is used only for ROVs",
      "LBL, SBL and USBL are identical in accuracy, differing only in the number of transducers",
      "LBL is used only in shallow water; SBL in deep water; USBL at any depth"
    ],
    optionsPt: [
      "LBL usa array de transponders no fundo; SBL usa transdutores no casco; USBL usa um transponder e mede range e ângulos",
      "LBL é o menos preciso; SBL é o mais preciso; USBL é usado apenas para ROVs",
      "LBL, SBL e USBL são idênticos em precisão, diferindo apenas no número de transdutores",
      "LBL é usado apenas em águas rasas; SBL em águas profundas; USBL em qualquer profundidade"
    ],
    correct: 0,
    explanation: "LBL: transponders on the seabed, range-range, more accurate. SBL: hull-mounted transducers, beacon on the seabed. USBL: one transponder, measures range and angles (slant range and direction).",
    explanationPt: "LBL: transponders no fundo, range-range, mais preciso. SBL: transdutores no casco, beacon no fundo. USBL: um transponder, mede range e ângulos (slant range e direção)."
  },
  {
    id: 19,
    question: "What is the main disadvantage of the LBL system in deep water?",
    questionPt: "Qual é a principal desvantagem do sistema LBL em águas profundas?",
    options: [
      "Low update rate (data rate), which can reach 10 seconds or more",
      "Range limited to 500 meters of depth",
      "Need for a VRU for motion compensation",
      "Impossibility of using multiple transponders"
    ],
    optionsPt: [
      "Baixa taxa de atualização (data rate), podendo chegar a 10 segundos ou mais",
      "Alcance limitado a 500 metros de profundidade",
      "Necessidade de VRU para compensação de movimento",
      "Impossibilidade de uso com múltiplos transponders"
    ],
    correct: 0,
    explanation: "The material states: 'At 4000m, the effective data rate can be over 10secs.' In addition, deploying and calibrating the array is expensive.",
    explanationPt: "O material afirma: 'A 4000m, a taxa de dados efetiva pode ser superior a 10 segundos.' Além disso, o deploy e a calibração do array são caros."
  },
  {
    id: 20,
    question: "What is the DGPS system and what is its main advantage over standard GPS?",
    questionPt: "O que é o sistema DGPS e qual é a sua principal vantagem sobre o GPS padrão?",
    options: [
      "DGPS uses fixed reference stations to correct errors, improving accuracy to 1–5 meters",
      "DGPS uses additional satellites to triple global coverage and eliminate shadow zones",
      "DGPS completely eliminates the need for onboard receivers, transmitting the position directly to the DP",
      "DGPS is immune to ionospheric and solar interference, working perfectly at all latitudes"
    ],
    optionsPt: [
      "DGPS usa estações de referência fixas para corrigir erros, melhorando a precisão para 1–5 metros",
      "DGPS usa satélites adicionais para triplicar a cobertura global e eliminar zonas de sombra",
      "DGPS elimina completamente a necessidade de receptores a bordo, transmitindo a posição diretamente para o DP",
      "DGPS é imune a interferências ionosféricas e solares, funcionando perfeitamente em todas as latitudes"
    ],
    correct: 0,
    explanation: "DGPS uses fixed reference stations that calculate corrections and transmit them to the vessel, improving SPS accuracy from 100 m to 1–5 m.",
    explanationPt: "DGPS usa estações de referência fixas que calculam correções e as transmitem para a embarcação, melhorando a precisão do SPS de 100 m para 1–5 m."
  },
  {
    id: 21,
    question: "What is 'common-mode failure' in the context of DGPS?",
    questionPt: "O que é 'common-mode failure' no contexto de DGPS?",
    options: [
      "It is the simultaneous loss of all DGPS systems due to a common cause, such as solar activity",
      "It is the failure of a single DGPS receiver that does not affect the other systems on the vessel",
      "It is the interference caused by other radio equipment on board the vessel",
      "It is the gradual degradation of the DGPS signal over time, requiring periodic recalibration"
    ],
    optionsPt: [
      "É a perda simultânea de todos os sistemas DGPS devido a uma causa comum, como atividade solar",
      "É a falha de um único receptor DGPS que não afeta os demais sistemas da embarcação",
      "É a interferência causada por outros equipamentos de rádio a bordo da embarcação",
      "É a degradação gradual do sinal DGPS ao longo do tempo, exigindo recalibração periódica"
    ],
    correct: 0,
    explanation: "The material mentions: 'it is possible for all DGPS to be lost simultaneously (the aforementioned common-mode-failure syndrome), leaving the vessel reliant upon a possibly low accuracy acoustic system.'",
    explanationPt: "O material menciona: 'é possível que todos os DGPS sejam perdidos simultaneamente (a síndrome de common-mode-failure mencionada), deixando a embarcação dependente de um sistema acústico possivelmente de baixa precisão.'"
  },
  {
    id: 22,
    question: "What is the purpose of the Fanbeam system?",
    questionPt: "Qual é o propósito do sistema Fanbeam?",
    options: [
      "To provide high-precision relative position (range and bearing) for short-range operations",
      "To provide global absolute position using low-orbit satellites",
      "To measure the vessel's speed relative to the seabed using the Doppler effect",
      "To detect subsea obstacles using high-frequency acoustic waves"
    ],
    optionsPt: [
      "Fornecer posição relativa de alta precisão (range e bearing) para operações de curto alcance",
      "Fornecer posição absoluta global usando satélites de órbita baixa",
      "Medir a velocidade da embarcação em relação ao fundo usando efeito Doppler",
      "Detectar obstáculos subsea usando ondas acústicas de alta frequência"
    ],
    correct: 0,
    explanation: "Fanbeam is a short-range laser system that provides range and bearing to a fixed reflector. Practical range for DP: 200–250 m; accuracy of 20 cm and 0.02°.",
    explanationPt: "Fanbeam é um sistema laser de curto alcance que fornece range e bearing para um refletor fixo. Alcance prático para DP: 200–250 m; precisão de 20 cm e 0,02°."
  },
  {
    id: 23,
    question: "What is the function of the anemometer in a DP system?",
    questionPt: "Qual é a função do anemômetro em um sistema DP?",
    options: [
      "To measure wind speed and direction for compensation of external forces and feed-forward",
      "To measure the vessel's speed relative to the water and the seabed",
      "To measure the vessel's inclination in pitch and roll for sensor compensation",
      "To measure the water depth under the keel to avoid grounding"
    ],
    optionsPt: [
      "Medir velocidade e direção do vento para compensação de forças externas e feed-forward",
      "Medir a velocidade da embarcação em relação à água e ao fundo",
      "Medir a inclinação da embarcação em pitch e roll para compensação de sensores",
      "Medir a profundidade da água sob a quilha para evitar encalhe"
    ],
    correct: 0,
    explanation: "The anemometer measures wind speed and direction. The data is used for compensation via the mathematical model and feed-forward, essential for rapid response to gusts.",
    explanationPt: "O anemômetro mede velocidade e direção do vento. Os dados são usados para compensação via modelo matemático e feed-forward, essencial para resposta rápida a rajadas."
  },
  {
    id: 24,
    question: "What is 'feed-forward' in the context of wind compensation?",
    questionPt: "O que é 'feed-forward' no contexto de compensação de vento?",
    options: [
      "It is a direct and immediate compensation for rapid wind changes, which bypasses the mathematical model",
      "It is a backup system that takes control when the mathematical model fails",
      "It is an algorithm that learns from wind history to predict future gusts",
      "It is a sensor calibration method that eliminates systematic measurement errors"
    ],
    optionsPt: [
      "É uma compensação direta e imediata para mudanças rápidas de vento, que bypassa o modelo matemático",
      "É um sistema de backup que assume o controle quando o modelo matemático falha",
      "É um algoritmo que aprende com o histórico de vento para prever rajadas futuras",
      "É um método de calibração de sensores que elimina erros sistemáticos de medição"
    ],
    correct: 0,
    explanation: "Feed-forward is a direct compensation for rapid wind changes, acting directly on the thruster controller, without going through the mathematical model.",
    explanationPt: "O feed-forward é uma compensação direta para mudanças rápidas de vento, atuando diretamente no controlador dos thrusters, sem passar pelo modelo matemático."
  },
  {
    id: 25,
    question: "What is the main risk of operating a DP in a 'blow-off' location relative to a platform?",
    questionPt: "Qual é o principal risco de operar um DP em uma localização 'blow-off' em relação a uma plataforma?",
    options: [
      "The wind sensor may be in the platform's wind shadow, causing erroneous readings and position degradation",
      "The vessel cannot move away from the platform in an emergency",
      "The thrusters cannot generate enough force against the wind",
      "The DP system automatically shuts down for safety"
    ],
    optionsPt: [
      "O sensor de vento pode estar na sombra da plataforma, causando leituras errôneas e degradação da posição",
      "A embarcação não consegue se afastar da plataforma em caso de emergência",
      "Os thrusters não conseguem gerar força suficiente contra o vento",
      "O sistema DP desliga automaticamente por segurança"
    ],
    correct: 0,
    explanation: "In a blow-off location, the wind sensor may be in the wind shadow of platform structures, reading only a few knots while the hull feels the full force of the wind, causing position degradation.",
    explanationPt: "Em localização blow-off, o sensor de vento pode estar na sombra de estruturas da plataforma, lendo apenas alguns nós enquanto o casco sente a força total do vento, causando degradação da posição."
  },
  {
    id: 26,
    question: "Why can platform generator exhaust cause a DP incident?",
    questionPt: "Por que a exaustão de um gerador de plataforma pode causar um incidente de DP?",
    options: [
      "Because the hot exhaust wind can 'poison' the wind sensor, causing a false storm reading",
      "Because the exhaust vibration interferes with the vessel's acoustic sensors",
      "Because the exhaust heat melts the thruster cables",
      "Because the smoke blocks the laser system's line of sight"
    ],
    optionsPt: [
      "Porque o vento quente da exaustão pode 'envenenar' o sensor de vento, causando uma leitura falsa de tempestade",
      "Porque a vibração da exaustão interfere nos sensores acústicos da embarcação",
      "Porque o calor da exaustão derrete os cabos dos thrusters",
      "Porque a fumaça bloqueia a linha de visada do sistema laser"
    ],
    correct: 0,
    explanation: "The material reports a case where platform generator exhaust was directed at the vessel's wind sensor, causing 'spool-up' and making the DP react as if it were a storm.",
    explanationPt: "O material relata um caso em que a exaustão de um gerador de plataforma foi direcionada para o sensor de vento da embarcação, causando 'spool-up' e fazendo o DP reagir como se fosse uma tempestade."
  },
  {
    id: 27,
    question: "What is the correct procedure when approaching an offshore installation in DP?",
    questionPt: "Qual é o procedimento correto ao se aproximar de uma instalação offshore em DP?",
    options: [
      "Approach in short steps with decreasing speed, making checks and waiting for settling time",
      "Approach quickly and engage DP as close as possible to the installation to save time",
      "Always approach with the wind from astern, regardless of the installation's direction",
      "Approach at constant speed and only reduce when 10 meters from the installation"
    ],
    optionsPt: [
      "Aproximar-se em etapas curtas com velocidade decrescente, fazendo verificações e aguardando settling time",
      "Aproximar-se rapidamente e engatar o DP o mais próximo possível da instalação para economizar tempo",
      "Aproximar-se sempre com o vento pela popa, independentemente da direção da instalação",
      "Aproximar-se em velocidade constante e só reduzir quando estiver a 10 metros da instalação"
    ],
    correct: 0,
    explanation: "The material recommends moving the vessel in short steps with a few minutes of settle time between each move. The last 50 meters may be done in a series of 10 m moves, with the last 2–3 moves not exceeding 5 m.",
    explanationPt: "O material recomenda mover a embarcação em passos curtos com alguns minutos de settle time entre cada movimento. Os últimos 50 metros podem ser feitos em séries de movimentos de 10 m, com os últimos 2–3 movimentos não excedendo 5 m."
  },
  {
    id: 28,
    question: "What is the typical final approach speed recommended for DP operations?",
    questionPt: "Qual é a velocidade típica de aproximação final recomendada para operações de DP?",
    options: [
      "0.25 m/s (0.5 knot), progressively reducing to 0.2 m/s and then 0.1 m/s",
      "1.0 m/s (2 knots), kept constant until visual contact with the installation",
      "0.05 m/s (0.1 knot), from the beginning of the approach to the final position",
      "0.5 m/s (1 knot), with a sudden reduction to zero upon reaching the position"
    ],
    optionsPt: [
      "0,25 m/s (0,5 knot), reduzindo progressivamente para 0,2 m/s e depois 0,1 m/s",
      "1,0 m/s (2 knots), mantida constante até o contato visual com a instalação",
      "0,05 m/s (0,1 knot), desde o início da aproximação até a posição final",
      "0,5 m/s (1 knot), com redução brusca para zero ao atingir a posição"
    ],
    correct: 0,
    explanation: "The material states: 'a typical approach velocity may be 0.25 meters/sec (0.5 knot), reduced progressively to 0.2m/sec (0.4 knot) then 0.1m/sec (0.2 knot) for the last few moves.'",
    explanationPt: "O material afirma: 'uma velocidade típica de aproximação pode ser 0,25 m/s (0,5 knot), reduzida progressivamente para 0,2 m/s (0,4 knot) e depois 0,1 m/s (0,2 knot) para os últimos movimentos.'"
  },
  {
    id: 29,
    question: "What is ASOG (Activity Specific Operating Guidelines)?",
    questionPt: "O que é ASOG (Activity Specific Operating Guidelines)?",
    options: [
      "A document that defines operational, environmental and equipment limits for a specific activity",
      "A simulation software that recreates failure conditions for operator training",
      "An annual audit report that evaluates the vessel's compliance with DP classes",
      "A preventive maintenance checklist for thrusters and generators"
    ],
    optionsPt: [
      "Um documento que define limites operacionais, ambientais e de equipamento para uma atividade específica",
      "Um software de simulação que recria condições de falha para treinamento de operadores",
      "Um relatório anual de auditoria que avalia a conformidade da embarcação com as classes de DP",
      "Um checklist de manutenção preventiva dos thrusters e geradores"
    ],
    correct: 0,
    explanation: "ASOG defines the operational, environmental and equipment limits for a specific activity, using the color system Green / Blue / Yellow / Red.",
    explanationPt: "ASOG define os limites operacionais, ambientais e de equipamento para uma atividade específica, usando o sistema de cores Verde / Azul / Amarelo / Vermelho."
  },
  {
    id: 30,
    question: "In the ASOG color system, what does YELLOW status mean?",
    questionPt: "No sistema de cores do ASOG, o que significa o status AMARELO?",
    options: [
      "Degraded condition: redundancy has been compromised; prepare to suspend operations in a controlled manner",
      "Normal operation: all systems are functioning within established limits",
      "Emergency: the vessel has lost position and immediate actions must be taken",
      "Advisory status: a minor failure occurred, but it does not affect system redundancy"
    ],
    optionsPt: [
      "Condição degradada: a redundância foi comprometida; preparar para suspender operações de forma controlada",
      "Operação normal: todos os sistemas estão funcionando dentro dos limites estabelecidos",
      "Emergência: a embarcação perdeu posição e ações imediatas devem ser tomadas",
      "Status advisory: uma falha menor ocorreu, mas não afeta a redundância do sistema"
    ],
    correct: 0,
    explanation: "Yellow indicates a degraded condition: a failure has occurred leaving the DP operational but with compromised redundancy. The vessel still maintains position but should prepare to suspend operations.",
    explanationPt: "Amarelo indica condição degradada: uma falha ocorreu deixando o DP operacional mas com redundância comprometida. A embarcação ainda mantém posição, mas deve se preparar para suspender operações."
  },
  {
    id: 31,
    question: "What is CAM (Critical Activity Mode)?",
    questionPt: "O que é o CAM (Critical Activity Mode)?",
    options: [
      "The most fault-tolerant configuration of the DP system for a critical activity",
      "The most economical operating mode, which reduces fuel consumption",
      "The emergency mode activated when all PRS fail",
      "The simulation mode used for training new operators"
    ],
    optionsPt: [
      "A configuração mais tolerante a falhas do sistema DP para uma atividade crítica",
      "O modo de operação mais econômico, que reduz o consumo de combustível",
      "O modo de emergência ativado quando todos os PRS falham",
      "O modo de simulação usado para treinamento de novos operadores"
    ],
    correct: 0,
    explanation: "CAM defines the most fault-tolerant configuration of the DP system, ensuring that the Worst-Case Failure Design Intent (WCFDI) is not exceeded.",
    explanationPt: "CAM define a configuração mais tolerante a falhas do sistema DP, garantindo que o Worst-Case Failure Design Intent (WCFDI) não seja excedido."
  },
  {
    id: 32,
    question: "What is TAM (Task Appropriate Mode)?",
    questionPt: "O que é o TAM (Task Appropriate Mode)?",
    options: [
      "A risk-based mode that accepts that a failure may exceed the WCF, as long as the risks are assessed as acceptable",
      "An automatic operation mode that adjusts the thrusters for specific weather conditions",
      "A training mode that simulates equipment failures in real time",
      "An energy-saving mode that turns off non-essential systems"
    ],
    optionsPt: [
      "Um modo baseado em risco que aceita que uma falha possa exceder o WCF, desde que os riscos sejam avaliados como aceitáveis",
      "Um modo de operação automática que ajusta os thrusters para condições climáticas específicas",
      "Um modo de treinamento que simula falhas de equipamento em tempo real",
      "Um modo de economia de energia que desliga sistemas não essenciais"
    ],
    correct: 0,
    explanation: "TAM is a risk-based mode in which the vessel can be configured accepting that a failure has the potential to exceed the identified WCF, as long as a risk assessment demonstrates that the consequences are acceptable.",
    explanationPt: "TAM é um modo baseado em risco no qual a embarcação pode ser configurada aceitando que uma falha tem o potencial de exceder o WCF identificado, desde que uma avaliação de risco demonstre que as consequências são aceitáveis."
  },
  {
    id: 33,
    question: "What is the correct categorization of a 'DP Undesired Event' according to IMCA?",
    questionPt: "Qual é a categorização correta de um 'DP Undesired Event' segundo o IMCA?",
    options: [
      "Loss of position-keeping stability that resulted or should have resulted in a Yellow Alert",
      "Loss of automatic DP control that resulted in a Red Alert",
      "A positioning problem that does not warrant an alert but causes a stand-down for investigation",
      "An occurrence that had a detrimental effect but did not escalate to incident or downtime"
    ],
    optionsPt: [
      "Perda de estabilidade de posicionamento que resultou ou deveria ter resultado em Yellow Alert",
      "Perda de controle automático do DP que resultou em Red Alert",
      "Problema de posicionamento que não justifica alerta, mas causa stand-down para investigação",
      "Ocorrência que teve efeito detrimental mas não escalou para incidente ou downtime"
    ],
    correct: 0,
    explanation: "DP Undesired Event: loss of position-keeping stability or another unexpected event that resulted or should have resulted in a Yellow Alert.",
    explanationPt: "DP Undesired Event: perda de estabilidade de posicionamento ou outro evento inesperado que resultou ou deveria ter resultado em Yellow Alert."
  },
  {
    id: 34,
    question: "What is a 'DP Near-Miss'?",
    questionPt: "O que é um 'DP Near-Miss'?",
    options: [
      "An occurrence that had a detrimental effect on DP performance but did not escalate to Incident, Undesired Event or Downtime",
      "Total loss of DP control that resulted in a collision with the installation",
      "Failure of a single thruster that did not affect positioning capability",
      "An event that resulted in Red Alert and required evacuation of the vessel"
    ],
    optionsPt: [
      "Ocorrência que teve efeito detrimental na performance do DP mas não escalou para Incidente, Undesired Event ou Downtime",
      "Perda total de controle do DP que resultou em colisão com a instalação",
      "Falha de um único thruster que não afetou a capacidade de posicionamento",
      "Evento que resultou em Red Alert e exigiu evacuação da embarcação"
    ],
    correct: 0,
    explanation: "DP Near-Miss is an occurrence that had a detrimental effect on DP performance, reliability or redundancy but did not escalate to 'DP Incident', 'Undesired Event' or 'Downtime'.",
    explanationPt: "DP Near-Miss é uma ocorrência que teve efeito detrimental na performance, confiabilidade ou redundância do DP, mas não escalou para 'DP Incident', 'Undesired Event' ou 'Downtime'."
  },
  {
    id: 35,
    question: "Why does Taut Wire lose accuracy in deep water?",
    questionPt: "Por que o Taut Wire perde precisão em águas profundas?",
    options: [
      "Due to the catenary effect and wire bending caused by currents and tides",
      "Because the sinker weight cannot reach the bottom at depths greater than 300 m",
      "Because the winch electrical system cannot support the necessary tension at great depths",
      "Because deep water absorbs the acoustic signal emitted by the Taut Wire"
    ],
    optionsPt: [
      "Devido ao efeito de catenária e à curvatura do arame causada por correntes e marés",
      "Porque o peso do sinker não consegue atingir o fundo em profundidades maiores que 300 m",
      "Porque o sistema elétrico do winch não suporta a tensão necessária em grandes profundidades",
      "Porque a água profunda absorve o sinal acústico emitido pelo Taut Wire"
    ],
    correct: 0,
    explanation: "The material states: 'As the depth and/or angle become greater, the catenary effect increases, causing the accuracy to decrease due to the effect of currents and tides.'",
    explanationPt: "O material afirma: 'À medida que a profundidade e/ou o ângulo aumentam, o efeito de catenária aumenta, causando a diminuição da precisão devido ao efeito de correntes e marés.'"
  },
  {
    id: 36,
    question: "What is the maximum angle and the recommended operational angle for a Taut Wire?",
    questionPt: "Qual é o ângulo máximo e o ângulo operacional recomendado para um Taut Wire?",
    options: [
      "Maximum of ±30° in any plane; operational of ±15°",
      "Maximum of ±45° in any plane; operational of ±30°",
      "Maximum of ±60° in any plane; operational of ±45°",
      "Maximum of ±20° in any plane; operational of ±10°"
    ],
    optionsPt: [
      "Máximo de ±30° em qualquer plano; operacional de ±15°",
      "Máximo de ±45° em qualquer plano; operacional de ±30°",
      "Máximo de ±60° em qualquer plano; operacional de ±45°",
      "Máximo de ±20° em qualquer plano; operacional de ±10°"
    ],
    correct: 0,
    explanation: "The material says: 'Typically, the maximum angle allowable is ±30° in either plane. A service working range is ±15°.'",
    explanationPt: "O material diz: 'Tipicamente, o ângulo máximo permitido é de ±30° em qualquer plano. A faixa de trabalho operacional é de ±15°.'"
  },
  {
    id: 37,
    question: "What is the main advantage of the LUSBL (Long and Ultra Short Base Line) system?",
    questionPt: "Qual é a principal vantagem do sistema LUSBL (Long and Ultra Short Base Line)?",
    options: [
      "It combines LBL accuracy with USBL ease of deployment, with accuracy better than 1 meter independent of depth",
      "It completely eliminates the need for a VRU for motion compensation",
      "It works without the need to calibrate transponders on the seabed",
      "It has unlimited range and does not suffer interference from thruster noise"
    ],
    optionsPt: [
      "Combina a precisão do LBL com a facilidade de deploy do USBL, com precisão inferior a 1 metro independente da profundidade",
      "Elimina completamente a necessidade de VRU para compensação de movimento",
      "Funciona sem a necessidade de calibração de transponders no fundo",
      "Tem alcance ilimitado e não sofre interferência de ruído dos thrusters"
    ],
    correct: 0,
    explanation: "LUSBL calibrates transponders using USBL. With baselines of 30–50% of water depth, accuracy of less than 1 meter is achievable, independent of depth.",
    explanationPt: "LUSBL calibra transponders usando USBL. Com baselines de 30–50% da profundidade, precisão de menos de 1 metro é alcançável, independente da profundidade."
  },
  {
    id: 38,
    question: "What is the function of the DARPS (DiffStar Absolute and Relative Positioning System)?",
    questionPt: "Qual é a função do sistema DARPS (DiffStar Absolute and Relative Positioning System)?",
    options: [
      "To provide high-precision relative position between a vessel and a floating installation (e.g., FPSO and shuttle tanker)",
      "To provide global absolute position using geostationary satellites",
      "To measure wind speed at different altitudes for DP compensation",
      "To detect subsea obstacles using side-scan sonar"
    ],
    optionsPt: [
      "Fornecer posição relativa de alta precisão entre uma embarcação e uma instalação flutuante (ex.: FPSO e shuttle tanker)",
      "Fornecer posição absoluta global usando satélites geoestacionários",
      "Medir a velocidade do vento em diferentes altitudes para compensação de DP",
      "Detectar obstáculos subsea usando sonar de varredura lateral"
    ],
    correct: 0,
    explanation: "DARPS is used for relative positioning between moving vessels, such as a shuttle tanker and an FPSO that weathervanes. The shuttle tanker receives GPS data from the FPSO via UHF link and calculates range and bearing.",
    explanationPt: "DARPS é usado para posicionamento relativo entre embarcações em movimento, como uma shuttle tanker e um FPSO que weathervanes. O shuttle tanker recebe dados GPS do FPSO via link UHF e calcula range e bearing."
  },
  {
    id: 39,
    question: "What is the main characteristic of Auto Track mode?",
    questionPt: "Qual é a principal característica do modo Auto Track?",
    options: [
      "The vessel automatically follows a route defined by two or more waypoints",
      "The vessel maintains a fixed position while the operator controls the heading manually",
      "The vessel automatically adjusts the heading to minimize energy consumption",
      "The vessel performs automatic evasive maneuvers in case of imminent collision"
    ],
    optionsPt: [
      "A embarcação segue automaticamente uma rota definida por dois ou mais waypoints",
      "A embarcação mantém posição fixa enquanto o operador controla o rumo manualmente",
      "A embarcação ajusta automaticamente o rumo para minimizar o consumo de energia",
      "A embarcação realiza manobras evasivas automáticas em caso de colisão iminente"
    ],
    correct: 0,
    explanation: "Auto Track (or Track Follow) moves the vessel along a route defined by waypoints. Speed is generally slow and the mode uses PME for position and gyrocompass for heading.",
    explanationPt: "Auto Track (ou Track Follow) move a embarcação ao longo de uma rota definida por waypoints. A velocidade é geralmente lenta e o modo usa PME para posição e gyrocompass para rumo."
  },
  {
    id: 40,
    question: "What is the 'reaction radius' in ROV Follow mode (Fixed Position Reference)?",
    questionPt: "O que é o 'reaction radius' no modo ROV Follow (Fixed Position Reference)?",
    options: [
      "A circular radius around the ROV within which the vessel remains stationary",
      "The minimum distance the vessel must keep from the ROV to avoid collision",
      "The maximum time the vessel can wait before moving to follow the ROV",
      "The maximum speed at which the ROV can move away before the mode is deactivated"
    ],
    optionsPt: [
      "Um raio circular ao redor do ROV dentro do qual a embarcação permanece estacionária",
      "A distância mínima que a embarcação deve manter do ROV para evitar colisão",
      "O tempo máximo que a embarcação pode aguardar antes de se mover para acompanhar o ROV",
      "A velocidade máxima que o ROV pode se afastar antes que o modo seja desativado"
    ],
    correct: 0,
    explanation: "In Fixed Position Reference mode, the vessel remains stationary while the ROV moves within the reaction radius. When the ROV leaves this area, the vessel moves to reposition the center of the area over the ROV.",
    explanationPt: "No modo Fixed Position Reference, a embarcação permanece estacionária enquanto o ROV se move dentro do reaction radius. Quando o ROV sai dessa área, a embarcação se move para reposicionar o centro da área sobre o ROV."
  },
  {
    id: 41,
    question: "What is the main difference between Shuttle Tanker Approach and Loading mode?",
    questionPt: "Qual é a principal diferença entre o modo Shuttle Tanker Approach e Loading?",
    options: [
      "Approach takes the vessel from the perimeter to a selection position; Loading holds the vessel in position for offloading",
      "Approach is used only in OLS fields; Loading is used only in ALP fields",
      "Approach maintains a fixed heading; Loading allows unrestricted weathervaning",
      "Approach is for loading; Loading is for unloading"
    ],
    optionsPt: [
      "Approach leva a embarcação da periferia para uma posição de seleção; Loading mantém a embarcação em posição para offloading",
      "Approach é usado apenas em campos OLS; Loading é usado apenas em campos ALP",
      "Approach mantém o rumo fixo; Loading permite weathervaning irrestrito",
      "Approach é para carregamento; Loading é para descarregamento"
    ],
    correct: 0,
    explanation: "Approach takes the vessel from the perimeter of the controlled area to a position to select Pickup or Loading. Loading positions and holds the vessel in a suitable position for offloading.",
    explanationPt: "Approach leva a embarcação da periferia da área controlada até uma posição para selecionar Pickup ou Loading. Loading posiciona e mantém a embarcação em posição adequada para offloading."
  },
  {
    id: 42,
    question: "What is the STL (Submerged Turret Loading) system?",
    questionPt: "O que é o sistema STL (Submerged Turret Loading)?",
    options: [
      "A loading system in which the vessel maneuvers over a submerged turret and couples it to a docking cone in the hull bottom",
      "An anchoring system that completely replaces DP in deep water",
      "An azimuthal propulsion system that allows 360° rotation of the vessel",
      "A long-range acoustic positioning system for ultra-deep water"
    ],
    optionsPt: [
      "Um sistema de carregamento no qual a embarcação manobra sobre um turret submerso e o acopla a um cone de docking no fundo do casco",
      "Um sistema de ancoragem que substitui completamente o DP em águas profundas",
      "Um sistema de propulsão azimutal que permite rotação de 360° da embarcação",
      "Um sistema de posicionamento acústico de longo alcance para águas ultraprofundas"
    ],
    correct: 0,
    explanation: "In STL, loading is carried out from a conical subsea turret anchored below keel level. The vessel maneuvers over the turret, picks up a messenger line, and the turret is hauled up and locked into the docking cone.",
    explanationPt: "No STL, o carregamento é feito a partir de um turret cônico subsea ancorado abaixo do nível da quilha. A embarcação manobra sobre o turret, captura uma linha mensageira, e o turret é içado e travado no cone de docking."
  },
  {
    id: 43,
    question: "What is the main concern when operating a DP in shallow water?",
    questionPt: "Qual é a principal preocupação ao operar um DP em águas rasas?",
    options: [
      "The proximity of thrusters to divers and the reduced efficiency of acoustic systems",
      "The excessive increase in available generator power due to shallow depth",
      "The impossibility of using DGPS at depths less than 50 meters",
      "The increase in wind speed due to the coastal compression effect"
    ],
    optionsPt: [
      "A proximidade dos thrusters com os mergulhadores e a redução da eficiência dos sistemas acústicos",
      "O aumento excessivo da potência disponível dos geradores devido à baixa profundidade",
      "A impossibilidade de usar DGPS em profundidades menores que 50 metros",
      "O aumento da velocidade do vento devido ao efeito de compressão costeira"
    ],
    correct: 0,
    explanation: "In shallow water, thrusters represent a greater risk to divers, and acoustic systems (HPR) suffer from noise, turbulence and low vertical separation between transducer and transponder.",
    explanationPt: "Em águas rasas, os thrusters representam um risco maior para mergulhadores, e os sistemas acústicos (HPR) sofrem com ruído, turbulência e pouca separação vertical entre transdutor e transponder."
  },
  {
    id: 44,
    question: "Why is the HPR (Hydro Acoustic Position Reference) particularly vulnerable in shallow water?",
    questionPt: "Por que o HPR (Hydro Acoustic Position Reference) é particularmente vulnerável em águas rasas?",
    options: [
      "Due to the reduced vertical separation between transducer and transponder, and increased noise and turbulence",
      "Because the transducer cannot operate at depths less than 100 meters",
      "Because fresh water from rivers and estuaries absorbs the acoustic signal differently",
      "Because HPR uses radio frequencies that are blocked by water"
    ],
    optionsPt: [
      "Devido à reduzida separação vertical entre transdutor e transponder, e ao aumento de ruído e turbulência",
      "Porque o transdutor não consegue operar em profundidades menores que 100 metros",
      "Porque a água doce de rios e estuários absorve o sinal acústico de forma diferente",
      "Porque o HPR usa frequências de rádio que são bloqueadas pela água"
    ],
    correct: 0,
    explanation: "The material explains that the HPR transducer protrudes 4–5 m below the keel and the transponder is up to 5 m above the seabed, reducing vertical separation. Additionally, there is more noise and turbulence from the thrusters.",
    explanationPt: "O material explica que o transdutor HPR protrai 4–5 m abaixo da quilha e o transponder fica a até 5 m acima do fundo, reduzindo a separação vertical. Além disso, há mais ruído e turbulência dos thrusters."
  },
  {
    id: 45,
    question: "What is 'added mass' in DP operations in shallow water with strong currents?",
    questionPt: "O que é o 'added mass' em operações de DP em águas rasas com fortes correntes?",
    options: [
      "Water dragged along with the vessel that effectively becomes part of the mass, requiring more power",
      "The increase in vessel weight due to sediment accumulation on the hull",
      "The additional mass of diving equipment on board for subsea operations",
      "The extra weight of cables and umbilicals connected to the ROV during operations"
    ],
    optionsPt: [
      "Água arrastada junto com a embarcação que efetivamente se torna parte da massa, exigindo mais potência",
      "O aumento de peso da embarcação devido ao acúmulo de sedimentos no casco",
      "A massa adicional de equipamentos de mergulho embarcados para operações subsea",
      "O peso extra dos cabos e umbilicais conectados ao ROV durante operações"
    ],
    correct: 0,
    explanation: "In strong currents, a considerable amount of water is dragged with the vessel, effectively becoming part of the mass. This added mass must be accelerated and decelerated, requiring more power and thrust.",
    explanationPt: "Em correntes fortes, uma quantidade considerável de água é arrastada com a embarcação, efetivamente se tornando parte da massa. Essa massa adicional deve ser acelerada e desacelerada, exigindo mais potência e thrust."
  },
  {
    id: 46,
    question: "What is the purpose of the 'consequence analysis' system in a DP Class 2 or 3?",
    questionPt: "Qual é o propósito do sistema de 'consequence analysis' em um DP Class 2 ou 3?",
    options: [
      "To continuously verify that the vessel will remain in position even after the worst-case failure",
      "To calculate the vessel's operating cost under different thruster configurations",
      "To predict future weather conditions based on historical data",
      "To analyze the environmental impact of a loss of position in sensitive areas"
    ],
    optionsPt: [
      "Verificar continuamente se a embarcação permanecerá em posição mesmo após o worst-case failure",
      "Calcular o custo operacional da embarcação em diferentes configurações de thrusters",
      "Prever as condições meteorológicas futuras com base em dados históricos",
      "Analisar o impacto ambiental de uma perda de posição em áreas sensíveis"
    ],
    correct: 0,
    explanation: "The consequence analysis continuously verifies that the remaining thrusters after the worst-case failure can generate the same resultant force and moment required before the failure.",
    explanationPt: "O consequence analysis verifica continuamente que os thrusters remanescentes após o worst-case failure podem gerar a mesma força e momento resultantes necessários antes da falha."
  },
  {
    id: 47,
    question: "What is the 'thruster emergency stop system' and where should it be located?",
    questionPt: "O que é o 'thruster emergency stop system' e onde ele deve estar localizado?",
    options: [
      "A system that allows any thruster to be stopped from the DP control center, without using the DP computer",
      "An emergency button located on each thruster for manual shutdown in case of fire",
      "An automatic system that turns off all thrusters when the vessel loses position",
      "An audible alarm that alerts the operator when a thruster exceeds maximum power"
    ],
    optionsPt: [
      "Um sistema que permite parar qualquer thruster do centro de controle de DP, sem usar o computador de DP",
      "Um botão de emergência localizado em cada thruster para desligamento manual em caso de incêndio",
      "Um sistema automático que desliga todos os thrusters quando a embarcação perde posição",
      "Um alarme sonoro que alerta o operador quando um thruster excede a potência máxima"
    ],
    correct: 0,
    explanation: "The thruster emergency stop system should be arranged in the DP control station and allow any thruster to be stopped without using the DP computer to generate the command.",
    explanationPt: "O thruster emergency stop system deve ser organizado na estação de controle de DP e permitir parar qualquer thruster sem usar o computador de DP para gerar o comando."
  },
  {
    id: 48,
    question: "What is the axis priority when thruster demand cannot be met in all axes?",
    questionPt: "Qual é a prioridade de eixos quando a demanda dos thrusters não pode ser atendida em todos os eixos?",
    options: [
      "1st priority: Heading; 2nd priority: Sway",
      "1st priority: Surge; 2nd priority: Sway",
      "1st priority: Sway; 2nd priority: Heading",
      "1st priority: Yaw; 2nd priority: Surge"
    ],
    optionsPt: [
      "1ª prioridade: Heading; 2ª prioridade: Sway",
      "1ª prioridade: Surge; 2ª prioridade: Sway",
      "1ª prioridade: Sway; 2ª prioridade: Heading",
      "1ª prioridade: Yaw; 2ª prioridade: Surge"
    ],
    correct: 0,
    explanation: "The material states: 'If the thruster demand cannot be fulfilled in all axes, the priority given to the axes is usually: 1st priority: Heading; 2nd priority: Sway.'",
    explanationPt: "O material afirma: 'Se a demanda dos thrusters não puder ser atendida em todos os eixos, a prioridade dada aos eixos é geralmente: 1ª prioridade: Heading; 2ª prioridade: Sway.'"
  },
  {
    id: 49,
    question: "What characterizes the 'Bias' mode of thruster operation?",
    questionPt: "O que caracteriza o modo 'Bias' de operação de thrusters?",
    options: [
      "Thrusters or groups of thrusters are placed in opposition to each other for fine control",
      "All thrusters operate in the same direction and with the same power",
      "Thrusters are alternately turned off to save energy",
      "Thrusters operate only in pre-defined barred zones"
    ],
    optionsPt: [
      "Thrusters ou grupos de thrusters são colocados em oposição uns aos outros para controle fino",
      "Todos os thrusters operam na mesma direção e com a mesma potência",
      "Os thrusters são desligados alternadamente para economizar energia",
      "Os thrusters operam apenas em zonas barradas pré-definidas"
    ],
    correct: 0,
    explanation: "In Bias mode, thrusters or groups of thrusters are placed in opposition to each other. The mode generally applies to azimuthal thrusters.",
    explanationPt: "No modo Bias, thrusters ou grupos de thrusters são colocados em oposição uns aos outros. O modo geralmente se aplica a thrusters azimutais."
  },
  {
    id: 50,
    question: "What is the 'Push/Pull' mode of thruster operation?",
    questionPt: "O que é o modo 'Push/Pull' de operação de thrusters?",
    options: [
      "A mode that uses propellers and rudders to generate lateral thrust, with one propeller ahead and the other astern",
      "A mode that alternates thruster direction to create oscillating movement",
      "A mode that uses only tunnel thrusters for lateral movement",
      "A mode that turns off the main thrusters and uses only azimuthal ones"
    ],
    optionsPt: [
      "Um modo que usa propulsores e lemes para gerar empuxo lateral, com um propulsor à frente e outro à ré",
      "Um modo que alterna a direção dos thrusters para criar movimento oscilatório",
      "Um modo que usa apenas thrusters de túnel para movimento lateral",
      "Um modo que desliga os thrusters principais e usa apenas azimutais"
    ],
    correct: 0,
    explanation: "Push/pull modes apply only to propellers and rudders. One propeller runs ahead and the other runs astern, with the rudder behind the ahead propeller creating side forces.",
    explanationPt: "Push/pull modes aplicam-se apenas a propulsores e lemes. Um propulsor opera à frente e o outro à ré, com o leme atrás do propulsor à frente criando forças laterais."
  },
  {
    id: 51,
    question: "What is the main disadvantage of a Controllable Pitch Propeller (CPP) compared to a Fixed Pitch Propeller (FPP)?",
    questionPt: "Qual é a principal desvantagem de um propulsor de passo controlável (CPP) em relação a um de passo fixo (FPP)?",
    options: [
      "The pitch variation mechanism is complex and susceptible to failure",
      "The CPP cannot reverse the thrust direction",
      "The CPP consumes significantly more fuel in all conditions",
      "The CPP cannot be used in DP systems"
    ],
    optionsPt: [
      "O mecanismo de variação de passo é complexo e suscetível a falhas",
      "O CPP não consegue reverter a direção do empuxo",
      "O CPP consome significativamente mais combustível em todas as condições",
      "O CPP não pode ser usado em sistemas DP"
    ],
    correct: 0,
    explanation: "The material states: 'Controllable pitch propellers have a variety of methods to vary the pitch of the blades. These can be fairly complex and are therefore liable to fail at some time.'",
    explanationPt: "O material afirma: 'Hélices de passo controlável têm uma variedade de métodos para variar o passo das pás. Estes podem ser bastante complexos e, portanto, estão sujeitos a falhas em algum momento.'"
  },
  {
    id: 52,
    question: "What is the efficiency of a propeller in reverse compared to ahead?",
    questionPt: "Qual é a eficiência de um propulsor em marcha à ré comparada à marcha à frente?",
    options: [
      "Only 40–60% of the thrust available ahead",
      "About 80–90% of the thrust available ahead",
      "Exactly the same thrust, regardless of direction",
      "Only 10–20% of the thrust available ahead"
    ],
    optionsPt: [
      "Apenas 40–60% do empuxo disponível à frente",
      "Cerca de 80–90% do empuxo disponível à frente",
      "Exatamente o mesmo empuxo, independentemente da direção",
      "Apenas 10–20% do empuxo disponível à frente"
    ],
    correct: 0,
    explanation: "The material states: 'Propellers provide thrust in both directions, but due shape of the blades and to the effect of the hull the amount of thrust in the reverse direction is only 40-60% of that available in the forward direction.'",
    explanationPt: "O material afirma: 'Os propulsores fornecem empuxo em ambas as direções, mas devido ao formato das pás e ao efeito do casco, a quantidade de empuxo na direção reversa é apenas 40-60% da disponível na direção de avanço.'"
  },
  {
    id: 53,
    question: "What is the recommended depth for installing a tunnel thruster below the waterline?",
    questionPt: "Qual é a profundidade recomendada para instalação de um tunnel thruster abaixo da linha d'água?",
    options: [
      "1.5 times its diameter below the waterline",
      "3 times its diameter below the waterline",
      "0.5 times its diameter below the waterline",
      "2.5 times its diameter below the waterline"
    ],
    optionsPt: [
      "1,5 vezes o seu diâmetro abaixo da linha d'água",
      "3 vezes o seu diâmetro abaixo da linha d'água",
      "0,5 vezes o seu diâmetro abaixo da linha d'água",
      "2,5 vezes o seu diâmetro abaixo da linha d'água"
    ],
    correct: 0,
    explanation: "The material states: 'They should be placed 1½ times their diameter below the water line.'",
    explanationPt: "O material afirma: 'Eles devem ser colocados a 1½ vezes o seu diâmetro abaixo da linha d'água.'"
  },
  {
    id: 54,
    question: "What is the main characteristic of azimuthal thrusters?",
    questionPt: "Qual é a principal característica dos thrusters azimutais?",
    options: [
      "They can rotate 360° and control both magnitude and direction of thrust",
      "They operate only in a fixed direction, but with high efficiency",
      "They are installed only at the bow of the vessel",
      "They cannot be remotely controlled by the DP system"
    ],
    optionsPt: [
      "Podem girar 360° e controlar magnitude e direção do empuxo",
      "Operam apenas em uma direção fixa, mas com alta eficiência",
      "São instalados apenas na proa da embarcação",
      "Não podem ser controlados remotamente pelo sistema DP"
    ],
    correct: 0,
    explanation: "Azimuthal thrusters can rotate and control both the magnitude and direction of thrust. There are two types: fixed and retractable. They can be controlled by pitch or speed.",
    explanationPt: "Thrusters azimutais podem girar e controlar tanto a magnitude quanto a direção do empuxo. Existem dois tipos: fixos e retráteis. Podem ser controlados por passo ou velocidade."
  },
  {
    id: 55,
    question: "What is the 'Cycloidal Propeller' system?",
    questionPt: "O que é o sistema 'Cycloidal Propeller'?",
    options: [
      "A system with four or more rotating horizontal aerofoil sections that provide directional thrust",
      "A fixed-pitch propeller installed in a tunnel at the vessel's bow",
      "A jet propulsion system that uses pumped water to generate thrust",
      "A retractable azimuthal thruster used only in shallow water"
    ],
    optionsPt: [
      "Um sistema com quatro ou mais aerofólios horizontais rotativos que fornecem empuxo direcional",
      "Um propulsor de passo fixo instalado em um túnel na proa da embarcação",
      "Um sistema de propulsão a jato que usa água bombeada para gerar empuxo",
      "Um propulsor azimutal retrátil usado apenas em águas rasas"
    ],
    correct: 0,
    explanation: "Cycloidal propellers consist of four or more horizontal rotating aerofoil sections that can be controlled about their center of rotation to provide directional thrust.",
    explanationPt: "Cycloidal propellers consistem em quatro ou mais seções de aerofólio horizontais rotativas que podem ser controladas em torno de seu centro de rotação para fornecer empuxo direcional."
  },
  {
    id: 56,
    question: "What is the main disadvantage of the Gill Jet propulsion system?",
    questionPt: "Qual é a principal desvantagem do sistema de propulsão Gill Jet?",
    options: [
      "It is installed on the bottom of the hull, being subject to damage in shallow water",
      "It cannot be controlled by the DP system",
      "It consumes much more fuel than conventional thrusters",
      "It only works at depths greater than 100 meters"
    ],
    optionsPt: [
      "É instalado no fundo do casco, ficando sujeito a danos em águas rasas",
      "Não pode ser controlado pelo sistema DP",
      "Consome muito mais combustível que os propulsores convencionais",
      "Só funciona em profundidades superiores a 100 metros"
    ],
    correct: 0,
    explanation: "The material says: 'The Gill Jet Thruster is a combination of a jet and a rotating deflecting nozzle. The deflector placed under the centre of the vessel...' and cycloidal propellers 'are fitted to the bottom of the hull and therefore subject to damage in shallow water.'",
    explanationPt: "O material diz: 'O Gill Jet Thruster é uma combinação de um jato e um bocal defletor rotativo. O defletor é colocado sob o centro da embarcação...' e os cycloidal propellers 'são instalados no fundo do casco e, portanto, sujeitos a danos em águas rasas.'"
  },
  {
    id: 57,
    question: "What is the main function of the DP Logbook?",
    questionPt: "Qual é a principal função do DP Logbook?",
    options: [
      "To record events related to DP operations, including checklists, excursions, failures and mode changes",
      "To automatically calculate the vessel's fuel consumption during DP operations",
      "To store position data to generate performance reports for the client",
      "To control operator access to the DP system, recording login attempts"
    ],
    optionsPt: [
      "Registrar eventos relacionados a operações de DP, incluindo checklists, excursões, falhas e mudanças de modo",
      "Calcular automaticamente o consumo de combustível da embarcação durante operações de DP",
      "Armazenar os dados de posição para gerar relatórios de desempenho para o cliente",
      "Controlar o acesso dos operadores ao sistema DP, registrando tentativas de login"
    ],
    correct: 0,
    explanation: "The DP Logbook should record: completed checklists, position/heading excursions, system failures, position/heading changes, wind/current changes, other vessels, mode changes, sensor selection/deselection, and thruster mode changes.",
    explanationPt: "O DP Logbook deve registrar: checklists completados, excursões de posição/rumo, falhas de sistema, mudanças de posição/rumo, mudanças de vento/corrente, outras embarcações, mudanças de modo, seleção/deseleção de sensores e mudanças de modo de thruster."
  },
  {
    id: 58,
    question: "What is the correct procedure when taking over the DP watch?",
    questionPt: "Qual é o procedimento correto ao assumir o watch de DP?",
    options: [
      "Arrive 20 minutes early, review the status board, the logbook and weather conditions, and receive verbal information",
      "Take over the station immediately and start operating without a briefing",
      "Wait for the previous operator to leave the room before checking the systems",
      "Read only the last 2 hours of the logbook and take over the station"
    ],
    optionsPt: [
      "Chegar 20 minutos antes, revisar o status board, o logbook e as condições meteorológicas, e receber informações verbais",
      "Assumir imediatamente o posto e começar a operar sem necessidade de briefing",
      "Aguardar que o operador anterior saia da sala para então verificar os sistemas",
      "Ler apenas o logbook das últimas 2 horas e assumir o posto"
    ],
    correct: 0,
    explanation: "The material recommends: 'Arrive at DP control station at least twenty (20) minutes prior to assuming operator duties; Review DP status board; Review DP Logbook (previous 8-12 hours entries); Check present weather and current conditions; Receive verbal information...'",
    explanationPt: "O material recomenda: 'Chegue à estação de controle de DP pelo menos vinte (20) minutos antes de assumir as funções de operador; Revise o status board do DP; Revise o DP Logbook (entradas das últimas 8-12 horas); Verifique as condições meteorológicas e de corrente atuais; Receba informações verbais...'"
  },
  {
    id: 59,
    question: "What is a 'DP Footprint Plot'?",
    questionPt: "O que é um 'DP Footprint Plot'?",
    options: [
      "A record of the vessel's observed movement relative to the desired position over a period of time",
      "A diagram showing the maximum wind capacity the vessel supports in each direction",
      "A graph showing fuel consumption as a function of wind speed",
      "A map of wind shadow areas caused by the vessel's superstructure"
    ],
    optionsPt: [
      "Um registro do movimento observado da embarcação em relação à posição desejada ao longo do tempo",
      "Um diagrama que mostra a máxima capacidade de vento que a embarcação suporta em cada direção",
      "Um gráfico que mostra o consumo de combustível em função da velocidade do vento",
      "Um mapa das áreas de sombra de vento causadas pela superestrutura da embarcação"
    ],
    correct: 0,
    explanation: "A DP Footprint Plot records the vessel's observed movement from the desired position over a period. It is polar, with the bow at 0° and the target position at the center.",
    explanationPt: "Um DP Footprint Plot registra o movimento observado da embarcação a partir da posição desejada ao longo de um período. É polar, com a proa a 0° e a posição alvo no centro."
  },
  {
    id: 60,
    question: "What is the difference between a DP Capability Plot and a DP Footprint Plot?",
    questionPt: "Qual é a diferença entre um DP Capability Plot e um DP Footprint Plot?",
    options: [
      "Capability Plot shows by calculation the maximum conditions; Footprint Plot records the actual observed movement",
      "Capability Plot is used only for Class 3; Footprint Plot is used only for Class 1",
      "Capability Plot is mandatory by regulation; Footprint Plot is optional and has no practical value",
      "Capability Plot shows fuel consumption; Footprint Plot shows the geographic position"
    ],
    optionsPt: [
      "Capability Plot mostra por cálculo as condições máximas; Footprint Plot registra o movimento real observado",
      "Capability Plot é usado apenas para Class 3; Footprint Plot é usado apenas para Class 1",
      "Capability Plot é obrigatório por regulamentação; Footprint Plot é opcional e sem valor prático",
      "Capability Plot mostra o consumo de combustível; Footprint Plot mostra a posição geográfica"
    ],
    correct: 0,
    explanation: "The material states: 'A DP footprint is different to a DP capability plot. A DP capability plot shows by calculation maximum environmental conditions in which a DP vessel should not lose position.' The Footprint Plot records the actual observed movement.",
    explanationPt: "O material afirma: 'Um DP footprint é diferente de um DP capability plot. Um DP capability plot mostra por cálculo as condições ambientais máximas nas quais uma embarcação DP não deve perder posição.' O Footprint Plot registra o movimento real observado."
  }
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function LessonDPQuiz() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('pre');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [verifiedQuestions, setVerifiedQuestions] = useState<Record<number, boolean>>({});
  const [allSubmitted, setAllSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [expandedFeedback, setExpandedFeedback] = useState<Record<number, boolean>>({});
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});
  const [showQuestionTranslation, setShowQuestionTranslation] = useState<Record<number, boolean>>({});
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') window.speechSynthesis.getVoices();
  }, []);

  // Embaralha perguntas e alternativas de forma estável até o reset
  const shuffledQuestions: ShuffledQuestion[] = useMemo(() => {
    const shuffled = shuffleArray(RAW_QUESTIONS);
    return shuffled.map(q => {
      // ✅ CORREÇÃO: substituído [...Array(n).keys()] por Array.from({length}, (_, i) => i)
      // para compatibilidade com target es5 sem downlevelIteration
      const indices = shuffleArray(Array.from({ length: q.options.length }, (_, i) => i));
      const newOptions = indices.map(i => q.options[i]);
      const newOptionsPt = indices.map(i => q.optionsPt[i]);
      const newCorrect = indices.indexOf(q.correct);
      return {
        ...q,
        originalId: q.id,
        options: newOptions,
        optionsPt: newOptionsPt,
        correct: newCorrect,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffleSeed]);

  const handleAnswer = (qId: number, optIndex: number) => {
    // Bloqueia se a questão já foi verificada ou se o quiz todo já foi enviado
    if (verifiedQuestions[qId] || allSubmitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const verifyQuestion = (qId: number) => {
    if (answers[qId] === undefined) return;
    setVerifiedQuestions(prev => ({ ...prev, [qId]: true }));
    setExpandedFeedback(prev => ({ ...prev, [qId]: true }));
  };

  const submitQuiz = () => {
    let correct = 0;
    shuffledQuestions.forEach(q => {
      if (answers[q.originalId] === q.correct) correct++;
    });
    setScore(correct);
    setAllSubmitted(true);
    const all: Record<number, boolean> = {};
    shuffledQuestions.forEach(q => { all[q.originalId] = true; });
    setExpandedFeedback(all);
    const allVerified: Record<number, boolean> = {};
    shuffledQuestions.forEach(q => { allVerified[q.originalId] = true; });
    setVerifiedQuestions(allVerified);
    setTimeout(() => {
      const el = document.getElementById('score-box');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 200);
  };

  const resetQuiz = () => {
    setAnswers({});
    setVerifiedQuestions({});
    setAllSubmitted(false);
    setScore(0);
    setExpandedFeedback({});
    setShowTranslation({});
    setShowQuestionTranslation({});
    setShowAllTranslations(false);
    // NOVO EMBARALHAMENTO
    setShuffleSeed(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reshuffleOnly = () => {
    setAnswers({});
    setVerifiedQuestions({});
    setAllSubmitted(false);
    setScore(0);
    setExpandedFeedback({});
    setShuffleSeed(s => s + 1);
  };

  const toggleFeedback = (qId: number) => {
    setExpandedFeedback(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleOptionTranslation = (qId: number) => {
    setShowTranslation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleQuestionTranslation = (qId: number) => {
    setShowQuestionTranslation(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleAllTranslations = () => {
    const next = !showAllTranslations;
    setShowAllTranslations(next);
    const allOpts: Record<number, boolean> = {};
    const allQ: Record<number, boolean> = {};
    shuffledQuestions.forEach(q => {
      allOpts[q.originalId] = next;
      allQ[q.originalId] = next;
    });
    setShowTranslation(allOpts);
    setShowQuestionTranslation(allQ);
  };

  const progress = Object.keys(answers).length;
  const total = shuffledQuestions.length;
  const progressPct = (progress / total) * 100;
  const verifiedCount = Object.keys(verifiedQuestions).length;

  const sections: { key: SectionKey; label: string; icon: React.ReactNode }[] = [
    { key: 'pre', label: 'Pre-Class', icon: <BookOpen size={14} /> },
    { key: 'quiz', label: 'Quiz', icon: <HelpCircle size={14} /> },
    { key: 'post', label: 'Post-Class', icon: <Award size={14} /> },
    { key: 'gabarito', label: 'Answer Key', icon: <CheckCircle size={14} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-slate-100">
      {/* ===== FIXED NAV ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-blue-800 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2 px-3 py-2">
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => { setActiveSection(s.key); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeSection === s.key
                  ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30'
                  : 'bg-blue-900/60 text-blue-200 hover:bg-blue-800 hover:text-white border border-blue-700/50'
              }`}
            >
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="pt-16 pb-20 px-4 max-w-6xl mx-auto">

        {/* ==================== PRE-CLASS ==================== */}
        {activeSection === 'pre' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-10">
              <span className="inline-block bg-amber-400/20 text-amber-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                Pre-Class Lesson
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
                📘 Dynamic Positioning — Key Concepts
              </h1>
              <p className="text-blue-200 max-w-3xl mx-auto text-lg">
                Before taking the quiz, review the foundations of Dynamic Positioning. This pre-class
                covers the topics that appear in the questions, focusing on the points that usually
                cause confusion.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-10">
              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">1.</span> What is DP?
                </h2>
                <p className="text-blue-100 text-sm leading-relaxed mb-3">
                  DP is <strong>not a piece of equipment</strong>. It is a <em>vessel capability</em>{" "}
                  achieved through the integration of several systems. The formal definition: a system
                  that automatically controls a vessel&apos;s position and heading{" "}
                  <strong>exclusively by means of active thrust</strong>.
                </p>
                <div className="bg-blue-900/60 border-l-4 border-amber-400 p-3 rounded-r-lg">
                  <p className="text-amber-100 text-sm">
                    <strong>Key concept:</strong> DP controls <strong>Surge (X)</strong>,{" "}
                    <strong>Sway (Y)</strong> and <strong>Yaw (N)</strong> — the horizontal plane.
                    Heave, Roll and Pitch are <em>measured</em> for compensation, but{" "}
                    <strong>not controlled</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">2.</span> System Components
                </h2>
                <ul className="text-blue-100 text-sm space-y-2">
                  <li>• <strong>Control Unit:</strong> the heart of the system; processes signals and generates commands.</li>
                  <li>• <strong>Kalman Filter:</strong> estimates motion and current; ~30 min settling time.</li>
                  <li>• <strong>Thrusters:</strong> propellers that execute the commands.</li>
                  <li>• <strong>Power Supply:</strong> power generation and distribution.</li>
                  <li>• <strong>PRS:</strong> DGPS, Artemis, Taut Wire, acoustics, laser.</li>
                  <li>• <strong>Sensors:</strong> gyro, VRU, anemometer, Doppler Log.</li>
                </ul>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">3.</span> Operational Modes
                </h2>
                <ul className="text-blue-100 text-sm space-y-2">
                  <li>• <strong>JSMH:</strong> full manual control (joystick + turning knob).</li>
                  <li>• <strong>JSAH:</strong> joystick controls Surge/Sway; heading automatic by gyro.</li>
                  <li>• <strong>DP:</strong> position and heading automatically maintained.</li>
                  <li>• <strong>Weathervaning:</strong> fixed position; heading minimizes power.</li>
                  <li>• <strong>Auto Track:</strong> follows a route by waypoints.</li>
                  <li>• <strong>ROV Follow:</strong> maintains relative position to an ROV.</li>
                  <li>• <strong>Riser Follow:</strong> keeps riser angle close to zero.</li>
                  <li>• <strong>Model Control:</strong> emergency when all PRS fail.</li>
                </ul>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">4.</span> DP Classes
                </h2>
                <ul className="text-blue-100 text-sm space-y-2">
                  <li>• <strong>Class 1:</strong> loss of position may occur with a single fault. No significant redundancy.</li>
                  <li>• <strong>Class 2:</strong> loss of position will <strong>not occur</strong> with a single active fault. Requires 3 PRS, redundancy in generators, thrusters and computers.</li>
                  <li>• <strong>Class 3:</strong> beyond Class 2, tolerates failure of static components, fire and flooding in one compartment. A-60 physical separation.</li>
                </ul>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6 md:col-span-2">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">5.</span> Sensors and PRS — Key Numbers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">Gyrocompass</p>
                    <p className="text-blue-200">Startup: <strong>6 h</strong>; Slew: 5 min</p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">VRU</p>
                    <p className="text-blue-200">±30° with accuracy of <strong>0.1°</strong></p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">Taut Wire</p>
                    <p className="text-blue-200">±2% up to <strong>500 m</strong></p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">Artemis</p>
                    <p className="text-blue-200"><strong>9.2 GHz</strong>; 10 m to 30 km</p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">DGPS</p>
                    <p className="text-blue-200">Accuracy of <strong>1–5 m</strong></p>
                  </div>
                  <div className="bg-blue-900/50 p-3 rounded-lg">
                    <p className="text-amber-200 font-bold mb-1">CyScan / Fanbeam</p>
                    <p className="text-blue-200">250 m / 200–250 m practical</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6 md:col-span-2">
                <h2 className="text-xl font-bold text-amber-300 mb-3 flex items-center gap-2">
                  <span className="text-2xl">6.</span> FMEA, ASOG and Operations
                </h2>
                <ul className="text-blue-100 text-sm space-y-2">
                  <li>• <strong>FMEA:</strong> systematic failure mode analysis; mandatory for Class 2 and 3.</li>
                  <li>• <strong>WCFDI:</strong> design intent; <strong>WCF:</strong> actual failure identified in the FMEA.</li>
                  <li>• <strong>ASOG:</strong> operational, environmental and equipment limits. Colors: Green / Blue / Yellow / Red.</li>
                  <li>• <strong>CAM:</strong> most fault-tolerant configuration. <strong>TAM:</strong> risk-based mode that accepts exceeding the WCF.</li>
                  <li>• <strong>Approach:</strong> short steps, decreasing speed (0.25 → 0.2 → 0.1 m/s).</li>
                  <li>• <strong>Settling time:</strong> ~30 minutes after positioning.</li>
                  <li>• <strong>Exclusion zone:</strong> 500 m from the installation.</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-400/10 border-2 border-amber-400/40 rounded-2xl p-6 text-center">
              <p className="text-amber-100 text-sm">
                <strong>⚠️ Quiz instructions:</strong> Questions and options are <strong>shuffled</strong>{" "}
                every time. Verify each question individually with the <em>&quot;Verify&quot;</em> button,
                or check everything at the end. Correct answers were written with a <em>medium</em> length
                — don&apos;t trust the longest option.
              </p>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => { setActiveSection('quiz'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-amber-400/30"
              >
                Go to Quiz →
              </button>
            </div>
          </section>
        )}

        {/* ==================== QUIZ ==================== */}
        {activeSection === 'quiz' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-8">
              <span className="inline-block bg-blue-400/20 text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                Assessment
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-3">
                📝 Dynamic Positioning — Quiz
              </h1>
              <p className="text-blue-200 max-w-3xl mx-auto">
                Questions and options are <strong>shuffled</strong>. Select an option and click{" "}
                <strong>&quot;Verify&quot;</strong> on each question to check it individually — or use{" "}
                <strong>&quot;Check All&quot;</strong> at the bottom to check everything at once.
              </p>
            </div>

            {/* Global Controls */}
            <div className="max-w-4xl mx-auto mb-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={toggleAllTranslations}
                className="flex items-center gap-2 bg-blue-800/80 hover:bg-blue-700 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full border border-blue-700 transition-all"
              >
                <Languages size={14} />
                {showAllTranslations ? "Hide all translations" : "Show all translations"}
              </button>
              <button
                onClick={reshuffleOnly}
                className="flex items-center gap-2 bg-purple-800/80 hover:bg-purple-700 text-purple-100 text-xs font-semibold px-4 py-2 rounded-full border border-purple-700 transition-all"
              >
                <Shuffle size={14} />
                Reshuffle Questions
              </button>
            </div>

            {/* Progress */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="w-full h-2 bg-blue-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-blue-300 mt-1">
                <span>Selected: {progress} / {total}</span>
                <span>Verified: {verifiedCount} / {total}</span>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              {shuffledQuestions.map((q, idx) => {
                const selected = answers[q.originalId];
                const isVerified = !!verifiedQuestions[q.originalId];
                const isCorrect = isVerified && selected === q.correct;
                const isWrong = isVerified && selected !== undefined && selected !== q.correct;
                const showFb = isVerified && expandedFeedback[q.originalId];
                const showOptTrans = showTranslation[q.originalId];
                const showQTrans = showQuestionTranslation[q.originalId];

                return (
                  <div
                    key={q.originalId}
                    className={`bg-blue-950/60 border-2 rounded-2xl p-5 transition-all ${
                      isCorrect ? 'border-emerald-500/60 shadow-lg shadow-emerald-500/10' :
                      isWrong ? 'border-red-500/60 shadow-lg shadow-red-500/10' :
                      'border-blue-800'
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <span className="bg-amber-400 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <SpeakSentence text={q.question} className="text-slate-100 font-semibold text-base leading-relaxed">
                          {q.question}
                        </SpeakSentence>
                        <button
                          onClick={() => toggleQuestionTranslation(q.originalId)}
                          className="mt-1 text-[11px] text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                        >
                          <Languages size={11} />
                          {showQTrans ? "Hide translation" : "Show translation"}
                        </button>
                        {showQTrans && (
                          <p className="mt-1 text-xs text-blue-300 italic bg-blue-900/40 p-2 rounded border-l-2 border-blue-500">
                            {q.questionPt}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 mt-3">
                      {q.options.map((opt, i) => {
                        const isSelected = selected === i;
                        const isCorrectOpt = isVerified && i === q.correct;
                        const isWrongOpt = isVerified && isSelected && i !== q.correct;

                        return (
                          <label
                            key={i}
                            className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                              isCorrectOpt ? 'bg-emerald-950/60 border-emerald-500/60' :
                              isWrongOpt ? 'bg-red-950/60 border-red-500/60' :
                              isSelected ? 'bg-blue-900/80 border-amber-400/60' :
                              'bg-blue-900/30 border-blue-800 hover:bg-blue-900/60 hover:border-blue-700'
                            } ${isVerified ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <input
                              type="radio"
                              name={`q-${q.originalId}`}
                              checked={isSelected || false}
                              onChange={() => handleAnswer(q.originalId, i)}
                              disabled={isVerified}
                              className="mt-0.5 accent-amber-400 w-4 h-4 flex-shrink-0 cursor-pointer"
                            />
                            <div className="flex-1">
                              <span className={`text-sm leading-relaxed block ${
                                isCorrectOpt ? 'text-emerald-200' :
                                isWrongOpt ? 'text-red-200' :
                                'text-blue-100'
                              }`}>
                                <strong className="text-amber-300 mr-1">{String.fromCharCode(65 + i)})</strong>
                                {opt}
                              </span>
                              {showOptTrans && (
                                <p className="mt-1 text-[11px] text-blue-300/80 italic">
                                  {q.optionsPt[i]}
                                </p>
                              )}
                            </div>
                            {isCorrectOpt && <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />}
                            {isWrongOpt && <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />}
                          </label>
                        );
                      })}
                    </div>

                    {/* Buttons per question */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {!isVerified ? (
                        <button
                          onClick={() => verifyQuestion(q.originalId)}
                          disabled={selected === undefined}
                          className={`text-xs font-bold px-4 py-1.5 rounded-full transition-all ${
                            selected === undefined
                              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                              : 'bg-amber-400 hover:bg-amber-300 text-slate-900 shadow shadow-amber-400/30'
                          }`}
                        >
                          ✓ Verify
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleFeedback(q.originalId)}
                          className="text-xs font-semibold px-4 py-1.5 rounded-full bg-blue-800 hover:bg-blue-700 text-blue-100 border border-blue-700"
                        >
                          {expandedFeedback[q.originalId] ? "Hide explanation" : "Show explanation"}
                        </button>
                      )}

                      {!isVerified && (
                        <button
                          onClick={() => toggleOptionTranslation(q.originalId)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-900/70 hover:bg-blue-800 text-blue-200 border border-blue-700/60 flex items-center gap-1"
                        >
                          <Languages size={11} />
                          {showOptTrans ? "Hide PT" : "PT"}
                        </button>
                      )}
                    </div>

                    {showFb && (
                      <div className={`mt-3 p-3 rounded-xl text-sm border-l-4 ${
                        isCorrect ? 'bg-emerald-950/40 border-emerald-400 text-emerald-100' :
                        'bg-red-950/40 border-red-400 text-red-100'
                      }`}>
                        <p className="font-bold mb-1">
                          {isCorrect ? '✅ Correct!' : '❌ Incorrect.'}
                          {!isCorrect && selected !== undefined && (
                            <span className="ml-2 font-normal text-xs">
                              (Your answer: {String.fromCharCode(65 + selected)})
                            </span>
                          )}
                        </p>
                        <p className="text-xs leading-relaxed opacity-90 mb-2">{q.explanation}</p>
                        <p className="text-xs leading-relaxed opacity-75 italic border-t border-current/20 pt-2">
                          🇧🇷 {q.explanationPt}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {!allSubmitted ? (
                <>
                  <button
                    onClick={submitQuiz}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-8 py-3 rounded-full transition-all shadow-lg shadow-amber-400/30"
                  >
                    ✅ Check All ({verifiedCount}/{total} verified)
                  </button>
                  <button
                    onClick={reshuffleOnly}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-6 py-3 rounded-full transition-all shadow-lg flex items-center gap-2"
                  >
                    <Shuffle size={16} />
                    Reshuffle
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={resetQuiz}
                    className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg flex items-center gap-2"
                  >
                    <RefreshCw size={16} />
                    Retake Quiz (Reshuffled)
                  </button>
                  <button
                    onClick={reshuffleOnly}
                    className="bg-purple-700 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg flex items-center gap-2"
                  >
                    <Shuffle size={16} />
                    Just Reshuffle
                  </button>
                </>
              )}
            </div>

            {/* Score */}
            {allSubmitted && (
              <div id="score-box" className="max-w-2xl mx-auto mt-10 bg-gradient-to-br from-blue-950 to-slate-900 border-2 border-amber-400 rounded-3xl p-8 text-center shadow-2xl">
                <p className="text-6xl font-extrabold text-amber-400 mb-2">
                  {Math.round((score / total) * 100)}%
                </p>
                <p className="text-blue-200 text-lg mb-4">
                  {score} correct out of {total}
                </p>
                <p className="text-slate-200">
                  {score / total >= 0.9 ? '🏆 Excellent! You master DP concepts.' :
                   score / total >= 0.7 ? '👍 Good job! Review the points you missed in the post-class.' :
                   score / total >= 0.5 ? '📖 You are on the right track, but you need to review the material.' :
                   '🔁 We recommend reviewing the pre-class and trying again.'}
                </p>
                <button
                  onClick={() => { setActiveSection('post'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-6 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-6 py-2.5 rounded-full transition-all"
                >
                  Go to Post-Class →
                </button>
              </div>
            )}
          </section>
        )}

        {/* ==================== POST-CLASS ==================== */}
        {activeSection === 'post' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-10">
              <span className="inline-block bg-emerald-400/20 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                Final Review
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
                📗 Post-Class — Consolidating Knowledge
              </h1>
              <p className="text-blue-200 max-w-3xl mx-auto text-lg">
                Congratulations on completing the quiz! Now let&apos;s review the most important points
                and clarify the traps that appeared in the questions.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3">🔍 Main Quiz Traps</h2>
                <div className="space-y-4">
                  <div className="bg-amber-400/10 border-l-4 border-amber-400 p-4 rounded-r-lg">
                    <p className="text-amber-100 text-sm">
                      <strong>1. Alternative length:</strong> Correct answers were deliberately written
                      with a <em>medium</em> length. Many long alternatives were created as distractors.
                      The intuition that &quot;the longest is right&quot; is a dangerous bias — and it was
                      exploited here.
                    </p>
                  </div>
                  <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-100 text-sm">
                      <strong>2. Shuffle:</strong> Questions and options are reshuffled every time. This
                      prevents memorizing positions and forces you to actually learn the content.
                    </p>
                  </div>
                  <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-100 text-sm">
                      <strong>3. Precise definitions:</strong> DP controls only Surge, Sway and Yaw.
                      Heave, Roll and Pitch are <em>measured</em> for compensation, but not controlled.
                    </p>
                  </div>
                  <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-100 text-sm">
                      <strong>4. Numbers and specifications:</strong> Gyro startup = 6 h; Kalman
                      settling = 30 min; Taut Wire = ±2% up to 500 m; Artemis = 9.2 GHz; CyScan = 250
                      m; Fanbeam = 200–250 m practical.
                    </p>
                  </div>
                  <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-100 text-sm">
                      <strong>5. Class 1 vs 2 vs 3:</strong> Class 1 = no redundancy; Class 2 =
                      tolerates single active fault; Class 3 = tolerates single fault + fire/flooding
                      in one compartment.
                    </p>
                  </div>
                  <div className="bg-blue-900/50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <p className="text-blue-100 text-sm">
                      <strong>6. ASOG:</strong> Green = normal; Blue = advisory; Yellow = degraded
                      (prepare to suspend); Red = emergency (abort immediately).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-4">📌 Summary of the Most Tested Topics</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="text-blue-100 space-y-2">
                    <li>• <strong>DP definition:</strong> automatic position and heading control by active thrust.</li>
                    <li>• <strong>Kalman Filter:</strong> estimates unmeasurable parameters, filters noise. ~30 min adaptation.</li>
                    <li>• <strong>Thrusters:</strong> propellers, tunnel, azimuthal, propellers+rudders.</li>
                    <li>• <strong>PRS:</strong> must be independent and of different principles (e.g., 2 DGPS + 1 Fanbeam).</li>
                    <li>• <strong>FMEA:</strong> mandatory for Class 2 and 3; identifies WCF.</li>
                  </ul>
                  <ul className="text-blue-100 space-y-2">
                    <li>• <strong>WCFDI:</strong> design intent; <strong>WCF:</strong> actual identified failure.</li>
                    <li>• <strong>Approach:</strong> short steps, decreasing speed, 30 min settling.</li>
                    <li>• <strong>Wind sensor:</strong> main cause of drive-off; deselect during helicopters and shadow.</li>
                    <li>• <strong>Deep water:</strong> Taut Wire poor; LBL accurate but slow; DGPS can fail due to sun.</li>
                    <li>• <strong>Shallow water:</strong> HPR poor; Taut Wire limited; thrusters suffer.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-950/60 border border-blue-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-amber-300 mb-3">🧠 Tips for the Exam / Real Operation</h2>
                <ul className="text-blue-100 text-sm space-y-2">
                  <li>• Never trust only the length of an alternative — read the content.</li>
                  <li>• Memorize the key numbers: 6 h (gyro), 30 min (Kalman), 500 m (exclusion zone), 3 PRS (Class 2/3), 2 PRS (Class 1).</li>
                  <li>• Understand the difference between <em>measuring</em> and <em>controlling</em>.</li>
                  <li>• Know that DP is a closed-loop control system.</li>
                  <li>• Remember: ASOG is not a fixed document — it is specific to each activity and location.</li>
                  <li>• FMEA does not deeply analyze software or human error — these are known limitations.</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-amber-400/20 to-emerald-400/20 border-2 border-amber-400/40 rounded-2xl p-6 text-center">
                <p className="text-amber-100 text-sm">
                  <strong>💡 Final message:</strong> DP knowledge saves lives. Deep understanding of
                  systems, limitations and procedures is what separates a competent operator from an
                  operational risk. Study beyond the quiz — read your vessel&apos;s FMEA, practice the
                  manual modes, and always question.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => { setActiveSection('gabarito'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold px-8 py-3 rounded-full transition-all shadow-lg"
              >
                View Full Answer Key →
              </button>
            </div>
          </section>
        )}

        {/* ==================== ANSWER KEY ==================== */}
        {activeSection === 'gabarito' && (
          <section className="animate-fadeIn">
            <div className="text-center mb-10">
              <span className="inline-block bg-emerald-400/20 text-emerald-300 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-3">
                Official Answer Key
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
                ✅ Answer Key — All Answers
              </h1>
              <p className="text-blue-200 max-w-2xl mx-auto">
                Check the official answer key with the explanation for each answer. Note: this list
                shows the ORIGINAL order of questions (not the shuffled order).
              </p>
            </div>

            <div className="space-y-4">
              {RAW_QUESTIONS.map((q) => (
                <div key={q.id} className="bg-blue-950/60 border border-emerald-700/50 rounded-2xl p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="bg-emerald-500 text-slate-900 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                      {q.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-100 font-semibold text-sm leading-relaxed">{q.question}</p>
                      <p className="text-blue-300 text-xs italic mt-1">{q.questionPt}</p>
                    </div>
                  </div>
                  <div className="bg-emerald-950/40 border-l-4 border-emerald-400 p-3 rounded-r-lg">
                    <p className="text-emerald-200 text-sm font-bold mb-1">
                      ✅ {String.fromCharCode(65 + q.correct)}) {q.options[q.correct]}
                    </p>
                    <p className="text-emerald-100/60 text-xs italic mb-2">{q.optionsPt[q.correct]}</p>
                    <p className="text-emerald-100/80 text-xs leading-relaxed">{q.explanation}</p>
                    <p className="text-emerald-100/60 text-xs leading-relaxed italic mt-1 border-t border-emerald-800/50 pt-1">
                      🇧🇷 {q.explanationPt}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={() => router.push("/cursos/offshore")}
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg"
              >
                ← Back to Offshore Courses
              </button>
            </div>
          </section>
        )}

      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        html { scroll-behavior: smooth; }
        body { background: #0f172a; }
      `}</style>
    </div>
  );
}