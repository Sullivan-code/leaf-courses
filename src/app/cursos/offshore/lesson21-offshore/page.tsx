"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Volume2 } from "lucide-react";

// ============================================
// TIPAGENS FORTES
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

interface OptionType {
  letter: string;
  text: string;
  textPt?: string;
}

interface QuestionType {
  id: number;
  question: string;
  pt: string;
  answer: string;
  answerPt?: string;
  options?: OptionType[];
}

// Tipos para os exercícios de prática
interface FillItem {
  sentence: string;
  answer: string;
}
interface TranslateItem {
  pt: string;
  en: string;
}
type PracticeItem = FillItem | TranslateItem;

// ============================================
// SPEECH SYSTEM
// ============================================

const SpeakText = ({ text, children, className = "" }: SpeakTextProps) => {
  const speak = useCallback(() => {
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
  }, [text]);

  return (
    <button
      onClick={speak}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-yellow-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
      type="button"
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
  const speak = useCallback(() => {
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
  }, [text, children]);

  return (
    <button
      onClick={speak}
      className={`group cursor-pointer hover:bg-yellow-50 px-1 rounded transition-colors text-left w-full ${className}`}
      type="button"
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

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ animation: "fadeIn 0.3s ease-out" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            type="button"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onSave(note);
              onClose();
            }}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-800 transition-all duration-300"
            type="button"
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
      type="button"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// ============================================
// SUBCOMPONENTE QUESTION ITEM (tipado)
// ============================================

function QuestionItem({
  q,
  index,
  showTranslation,
}: {
  q: QuestionType;
  index: number;
  showTranslation: boolean;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showCorrect, setShowCorrect] = useState(false);

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

  const isCorrect =
    selectedOption === correctLetter ||
    typedAnswer.trim().toUpperCase() === correctLetter;

  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 transition-colors">
      <div className="flex items-start gap-2">
        <span className="text-blue-600 font-bold text-sm min-w-[30px]">
          Q{index + 1}.
        </span>
        <div className="flex-1">
          <SpeakSentence
            text={q.question}
            className="text-gray-800 font-medium cursor-pointer block hover:text-blue-700"
          >
            {q.question}
          </SpeakSentence>
          {showTranslation && q.pt && (
            <p className="text-gray-500 text-sm mt-0.5">{q.pt}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1 rounded-full transition-colors"
              type="button"
            >
              {showOptions ? "Ocultar opções" : "Mostrar opções"}
            </button>
          </div>

          {showOptions && q.options && (
            <div className="mt-3 space-y-2">
              {q.options.map((opt: OptionType) => (
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
                  <span className="font-bold text-gray-600 min-w-[20px]">
                    {opt.letter}.
                  </span>
                  <div>
                    <SpeakText text={opt.text} className="text-gray-700 cursor-pointer hover:text-blue-600">
                      {opt.text}
                    </SpeakText>
                    {showTranslation && opt.textPt && (
                      <span className="text-gray-400 text-xs ml-2">
                        ({opt.textPt})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

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
              type="button"
            >
              Verificar
            </button>
            <button
              onClick={handleClear}
              className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-full transition-colors"
              type="button"
            >
              Limpar
            </button>
          </div>

          {showCorrect && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-start gap-2">
                <span className="text-green-600 font-bold text-sm">✓</span>
                <div>
                  <SpeakSentence
                    text={correctText}
                    className="text-green-700 font-medium cursor-pointer hover:text-green-900"
                  >
                    {correctText}
                  </SpeakSentence>
                  {showTranslation && q.answerPt && (
                    <p className="text-gray-500 text-sm">{q.answerPt}</p>
                  )}
                  {selectedOption || typedAnswer ? (
                    <p
                      className={`text-sm font-medium ${
                        isCorrect ? "text-green-600" : "text-red-500"
                      }`}
                    >
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
// COMPONENTE DE SEÇÃO REUTILIZÁVEL
// ============================================

function Section({
  title,
  open,
  showTranslation,
  onToggle,
  onToggleTranslation,
  onNote,
  children,
}: {
  title: string;
  open: boolean;
  showTranslation: boolean;
  onToggle: () => void;
  onToggleTranslation: () => void;
  onNote: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center">
          <h2 className="text-2xl font-bold">{title}</h2>
          <PencilIcon onClick={onNote} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onToggleTranslation}
            className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 text-sm transition-all duration-300"
            type="button"
          >
            {showTranslation ? "Ocultar traduções" : "Mostrar traduções"}
          </button>
          <button
            onClick={onToggle}
            className="inline-block rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 text-sm transition-all duration-300"
            type="button"
          >
            {open ? "Ocultar" : "Mostrar"}
          </button>
        </div>
      </div>
      {open && (
        <div className="p-8" style={{ animation: "fadeIn 0.3s ease-out" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT – Lesson 21
// ============================================

export default function Lesson21() {
  const router = useRouter();

  // Estado das seções (aberto/fechado)
  const [openSections, setOpenSections] = useState({
    vocabulary: true,
    reading: true,
    conversation: true,
    grammar: true,
    practice: true,
    speaking: true,
    questions: true,
    review: true,
  });

  // Estado das traduções (mostrar/ocultar)
  const [showTranslations, setShowTranslations] = useState<
    Record<keyof typeof openSections, boolean>
  >({
    vocabulary: false,
    reading: false,
    conversation: false,
    grammar: false,
    practice: false,
    speaking: false,
    questions: false,
    review: false,
  });

  // Notas
  const [noteModal, setNoteModal] = useState({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  // Toggles
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleTranslation = (section: keyof typeof showTranslations) => {
    setShowTranslations((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || "",
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  // Carregar vozes ao montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ============================================
  // DATA
  // ============================================

  const imageUrl =
    "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%2028%20de%20ago.%20de%202026%2C%2018_54_16.png";

  // --- VOCABULARY ---
  const vocabulary = [
    {
      term: "Blackout",
      definition: "Complete loss of electrical power on the vessel.",
      pt: "Apagão: perda total de energia elétrica na embarcação.",
    },
    {
      term: "Drive-off",
      definition: "Uncontrolled movement of the vessel away from its intended position.",
      pt: "Deriva incontrolável: movimento não controlado da embarcação para fora de sua posição.",
    },
    {
      term: "Thruster failure",
      definition: "Loss of thrust from one or more thrusters.",
      pt: "Falha de propulsor: perda de empuxo de um ou mais propulsores.",
    },
    {
      term: "Power Management System (PMS)",
      definition:
        "System that manages power generation and distribution to prevent blackouts.",
      pt: "Sistema de Gerenciamento de Energia (PMS): gerencia a geração e distribuição de energia para evitar apagões.",
    },
    {
      term: "Emergency generator",
      definition: "Backup generator that starts automatically during a power failure.",
      pt: "Gerador de emergência: gerador reserva que liga automaticamente durante uma falha de energia.",
    },
    {
      term: "Manual override",
      definition: "Manual control that bypasses the automatic system.",
      pt: "Substituição manual: controle manual que contorna o sistema automático.",
    },
    {
      term: "Alarm",
      definition: "Audible and visual warning to indicate a problem.",
      pt: "Alarme: aviso sonoro e visual para indicar um problema.",
    },
    {
      term: "Warning",
      definition: "Indication of a potential issue that may require attention.",
      pt: "Advertência: indicação de um problema potencial que pode exigir atenção.",
    },
    {
      term: "Bridge",
      definition: "The command center of the vessel where navigation and DP are controlled.",
      pt: "Ponte: centro de comando da embarcação onde a navegação e o DP são controlados.",
    },
    {
      term: "Engine room",
      definition: "The compartment containing the main engines and generators.",
      pt: "Sala de máquinas: compartimento que contém os motores principais e geradores.",
    },
    {
      term: "Thruster room",
      definition: "The space housing the thrusters and their control equipment.",
      pt: "Sala de propulsores: espaço que abriga os propulsores e seus equipamentos de controle.",
    },
    {
      term: "DP console",
      definition: "The control panel from which the DPO operates the DP system.",
      pt: "Console DP: painel de controle a partir do qual o DPO opera o sistema DP.",
    },
    {
      term: "Redundancy",
      definition:
        "Duplication of critical components to ensure continued operation after a failure.",
      pt: "Redundância: duplicação de componentes críticos para garantir operação contínua após uma falha.",
    },
    {
      term: "FMEA",
      definition:
        "Failure Modes and Effects Analysis – a document detailing potential failures and their consequences.",
      pt: "FMEA: Análise de Modos e Efeitos de Falha – documento que detalha falhas potenciais e suas consequências.",
    },
    {
      term: "Consequence Analysis",
      definition:
        "Software function that verifies if sufficient thrust is available after a single point failure.",
      pt: "Análise de Consequências: função de software que verifica se há empuxo suficiente após uma falha de ponto único.",
    },
  ];

  // --- READING ---
  const reading = {
    title: "A DP Emergency",
    paragraphs: [
      "The vessel 'Sea Pioneer' is conducting DP operations near an offshore platform. Suddenly, the alarm sounds. The DP console shows a warning: 'Thruster 2 failure – loss of azimuth control.' The vessel begins to drift off position.",
      "The DPO immediately calls the Chief Engineer and the Captain. He initiates manual override and tries to maintain position using the remaining thrusters. Meanwhile, the Chief Engineer goes to the engine room to assess the problem.",
      "The Captain orders the emergency generator to be started as a precaution. The DPO reduces the setpoint and requests the ROV team to stand by. After 10 minutes, the engineering team restores the thruster, and the vessel returns to normal DP mode.",
      "The incident is logged, and the crew reviews the FMEA to ensure all redundancy measures are in place. Lessons learned: always be prepared for failures and have clear emergency procedures.",
    ],
    pt: [
      "A embarcação 'Sea Pioneer' está realizando operações de DP perto de uma plataforma offshore. De repente, o alarme soa. O console DP mostra um aviso: 'Falha no Propulsor 2 – perda de controle de azimute.' A embarcação começa a derivar da posição.",
      "O DPO imediatamente chama o Chefe de Máquinas e o Capitão. Ele inicia a substituição manual e tenta manter a posição usando os propulsores restantes. Enquanto isso, o Chefe de Máquinas vai à sala de máquinas para avaliar o problema.",
      "O Capitão ordena que o gerador de emergência seja ligado como precaução. O DPO reduz o setpoint e solicita que a equipe do ROV fique em espera. Após 10 minutos, a equipe de engenharia restaura o propulsor e a embarcação retorna ao modo DP normal.",
      "O incidente é registrado e a tripulação revisa o FMEA para garantir que todas as medidas de redundância estejam em vigor. Lições aprendidas: esteja sempre preparado para falhas e tenha procedimentos de emergência claros.",
    ],
  };

  // --- CONVERSATION ---
  const conversation = [
    {
      speaker: "DPO:",
      line: "Captain, we have a thruster failure on thruster 2. The vessel is drifting.",
      pt: "Capitão, temos uma falha no propulsor 2. A embarcação está derivando.",
    },
    {
      speaker: "Captain:",
      line: "Understood. Start the emergency generator and switch to manual override if necessary.",
      pt: "Entendido. Ligue o gerador de emergência e mude para substituição manual se necessário.",
    },
    {
      speaker: "DPO:",
      line: "I am already in manual override. I'm using thrusters 1 and 3 to hold position.",
      pt: "Já estou em substituição manual. Estou usando os propulsores 1 e 3 para segurar a posição.",
    },
    {
      speaker: "Chief Engineer:",
      line: "I'm in the engine room. The thruster motor overheated. I'm resetting the breaker.",
      pt: "Estou na sala de máquinas. O motor do propulsor superaqueceu. Estou resetando o disjuntor.",
    },
    {
      speaker: "DPO:",
      line: "Copy. We have a 5-degree heading error. Please hurry.",
      pt: "Entendido. Temos um erro de rumo de 5 graus. Por favor, apresse-se.",
    },
    {
      speaker: "Chief Engineer:",
      line: "Breaker reset. Trying to re-engage the thruster now.",
      pt: "Disjuntor resetado. Tentando reengajar o propulsor agora.",
    },
    {
      speaker: "DPO:",
      line: "Thruster 2 is back online. Position recovering. We are stable.",
      pt: "Propulsor 2 está de volta. Posição recuperando. Estamos estáveis.",
    },
    {
      speaker: "Captain:",
      line: "Good work, everyone. Log the incident and conduct a full system check.",
      pt: "Bom trabalho, todos. Registrem o incidente e façam uma verificação completa do sistema.",
    },
  ];

  // --- GRAMMAR ---
  const grammarPoints = [
    {
      title: "Conditional Sentences (If...then)",
      examples: [
        {
          en: "If a thruster fails, the system will compensate with the remaining thrusters.",
          pt: "Se um propulsor falhar, o sistema compensará com os propulsores restantes.",
        },
        {
          en: "If we lose power, we must start the emergency generator immediately.",
          pt: "Se perdermos energia, devemos ligar o gerador de emergência imediatamente.",
        },
        {
          en: "If the DPO switches to manual override, he can control the thrusters directly.",
          pt: "Se o DPO mudar para substituição manual, ele pode controlar os propulsores diretamente.",
        },
      ],
    },
    {
      title: "Modal Verbs (Must, Should, Have to)",
      examples: [
        {
          en: "You must inform the captain of any system failure.",
          pt: "Você deve informar o capitão sobre qualquer falha do sistema.",
        },
        {
          en: "You should reduce the load on the generators during a blackout.",
          pt: "Você deve reduzir a carga nos geradores durante um apagão.",
        },
        {
          en: "The crew has to follow the emergency procedures.",
          pt: "A tripulação tem que seguir os procedimentos de emergência.",
        },
      ],
    },
  ];

  // --- PRACTICE EXERCISES (tipados corretamente) ---
  const practiceExercises: {
    type: "fill" | "translate";
    instruction: string;
    items: PracticeItem[];
  }[] = [
    {
      type: "fill",
      instruction: "Complete the sentences with the correct term from the vocabulary list.",
      items: [
        { sentence: "A complete loss of electrical power is called a __________.", answer: "blackout" },
        { sentence: "Uncontrolled movement of the vessel is known as a __________.", answer: "drive-off" },
        { sentence: "The __________ is the command center of the vessel.", answer: "bridge" },
        {
          sentence: "The __________ system manages power to prevent blackouts.",
          answer: "Power Management",
        },
        {
          sentence: "In case of failure, the DPO can use __________ to bypass automatic control.",
          answer: "manual override",
        },
      ] as FillItem[],
    },
    {
      type: "translate",
      instruction: "Translate the following sentences into English.",
      items: [
        { pt: "O propulsor 2 falhou.", en: "Thruster 2 has failed." },
        { pt: "Devemos ligar o gerador de emergência.", en: "We must start the emergency generator." },
        { pt: "O DPO está na ponte.", en: "The DPO is on the bridge." },
        { pt: "A embarcação está derivando.", en: "The vessel is drifting." },
        { pt: "Verifique o FMEA para procedimentos de falha.", en: "Check the FMEA for failure procedures." },
      ] as TranslateItem[],
    },
  ];

  // --- SPEAKING PRACTICE ---
  const speakingPractice = [
    {
      role: "DPO",
      scenario: "You are on the DP console. An alarm indicates a loss of heading reference. What do you do?",
      pt: "Você está no console DP. Um alarme indica perda de referência de rumo. O que você faz?",
    },
    {
      role: "Chief Engineer",
      scenario: "You receive a call from the DPO about a thruster failure. You go to the engine room. Describe your actions.",
      pt: "Você recebe uma chamada do DPO sobre uma falha de propulsor. Você vai à sala de máquinas. Descreva suas ações.",
    },
    {
      role: "Captain",
      scenario: "You are informed of a drive-off situation. Give orders to the DPO and the crew.",
      pt: "Você é informado sobre uma situação de deriva. Dê ordens ao DPO e à tripulação.",
    },
    {
      role: "ROV Pilot",
      scenario: "You are about to deploy the ROV when the DPO tells you to stand by due to a power issue. How do you respond?",
      pt: "Você está prestes a lançar o ROV quando o DPO lhe diz para aguardar devido a um problema de energia. Como você responde?",
    },
  ];

  // --- EXAM QUESTIONS (tipadas) ---
  const questions: QuestionType[] = [
    {
      id: 1,
      question: "What is a blackout in the context of DP operations?",
      pt: "O que é um apagão no contexto das operações DP?",
      answer: "Complete loss of electrical power on the vessel.",
      answerPt: "Perda total de energia elétrica na embarcação.",
      options: [
        { letter: "A", text: "A failure of the position reference system.", textPt: "Uma falha do sistema de referência de posição." },
        { letter: "B", text: "Complete loss of electrical power.", textPt: "Perda total de energia elétrica." },
        { letter: "C", text: "A malfunction of the thrusters.", textPt: "Um mau funcionamento dos propulsores." },
        { letter: "D", text: "Loss of heading control.", textPt: "Perda de controle de rumo." },
      ],
    },
    {
      id: 2,
      question: "What is the primary function of the Power Management System (PMS)?",
      pt: "Qual é a função principal do Sistema de Gerenciamento de Energia (PMS)?",
      answer: "To prevent blackouts by managing power generation and distribution.",
      answerPt: "Prevenir apagões gerenciando a geração e distribuição de energia.",
      options: [
        { letter: "A", text: "To control thrusters.", textPt: "Controlar os propulsores." },
        { letter: "B", text: "To manage the position reference systems.", textPt: "Gerenciar os sistemas de referência de posição." },
        { letter: "C", text: "To prevent blackouts.", textPt: "Prevenir apagões." },
        { letter: "D", text: "To calculate the vessel's position.", textPt: "Calcular a posição da embarcação." },
      ],
    },
    {
      id: 3,
      question: "What should a DPO do immediately upon receiving a thruster failure alarm?",
      pt: "O que um DPO deve fazer imediatamente ao receber um alarme de falha de propulsor?",
      answer: "Inform the Captain and Chief Engineer, and consider manual override.",
      answerPt: "Informar o Capitão e o Chefe de Máquinas, e considerar a substituição manual.",
      options: [
        { letter: "A", text: "Ignore the alarm and continue operations.", textPt: "Ignorar o alarme e continuar as operações." },
        {
          letter: "B",
          text: "Inform the Captain and Chief Engineer, and consider manual override.",
          textPt: "Informar o Capitão e o Chefe de Máquinas, e considerar a substituição manual.",
        },
        { letter: "C", text: "Immediately stop all operations.", textPt: "Parar imediatamente todas as operações." },
        { letter: "D", text: "Reset the thruster without checking.", textPt: "Resetar o propulsor sem verificar." },
      ],
    },
    {
      id: 4,
      question: "What is a drive-off?",
      pt: "O que é uma deriva (drive-off)?",
      answer: "Uncontrolled movement of the vessel away from its intended position.",
      answerPt: "Movimento não controlado da embarcação para fora de sua posição pretendida.",
      options: [
        { letter: "A", text: "A controlled movement to a new position.", textPt: "Um movimento controlado para uma nova posição." },
        { letter: "B", text: "Uncontrolled movement away from position.", textPt: "Movimento não controlado para fora da posição." },
        { letter: "C", text: "Failure of the gyro compass.", textPt: "Falha da giroscópica." },
        { letter: "D", text: "A power failure.", textPt: "Uma falha de energia." },
      ],
    },
    {
      id: 5,
      question: "Which document contains details of a vessel's redundancy arrangements?",
      pt: "Qual documento contém detalhes dos arranjos de redundância de uma embarcação?",
      answer: "The FMEA (Failure Modes and Effects Analysis) document.",
      answerPt: "O documento FMEA (Análise de Modos e Efeitos de Falha).",
      options: [
        { letter: "A", text: "The DP system user manual.", textPt: "O manual do usuário do sistema DP." },
        { letter: "B", text: "The FMEA document.", textPt: "O documento FMEA." },
        { letter: "C", text: "The vessel's operational manual.", textPt: "O manual operacional da embarcação." },
        { letter: "D", text: "The thruster control manual.", textPt: "O manual de controle do propulsor." },
      ],
    },
    {
      id: 6,
      question: "What is the purpose of Consequence Analysis in a DP system?",
      pt: "Qual é o propósito da Análise de Consequências em um sistema DP?",
      answer: "To verify that sufficient thrust is available after a single point failure.",
      answerPt: "Verificar se há empuxo suficiente disponível após uma falha de ponto único.",
      options: [
        { letter: "A", text: "To calculate fuel consumption.", textPt: "Calcular o consumo de combustível." },
        { letter: "B", text: "To monitor the vessel's position.", textPt: "Monitorar a posição da embarcação." },
        { letter: "C", text: "To verify thrust availability after a failure.", textPt: "Verificar a disponibilidade de empuxo após uma falha." },
        { letter: "D", text: "To control the power management system.", textPt: "Controlar o sistema de gerenciamento de energia." },
      ],
    },
    {
      id: 7,
      question: "What action should be taken if a thruster fails to full force?",
      pt: "Que ação deve ser tomada se um propulsor falhar com força total?",
      answer: "Activate the emergency stop for that thruster.",
      answerPt: "Ativar a parada de emergência para esse propulsor.",
      options: [
        { letter: "A", text: "Increase the gain on other thrusters.", textPt: "Aumentar o ganho em outros propulsores." },
        { letter: "B", text: "Activate the emergency stop for that thruster.", textPt: "Ativar a parada de emergência para esse propulsor." },
        { letter: "C", text: "Switch to manual mode.", textPt: "Mudar para o modo manual." },
        { letter: "D", text: "Notify the captain.", textPt: "Notificar o capitão." },
      ],
    },
    {
      id: 8,
      question: "In the event of a blackout, which system should be started immediately?",
      pt: "No caso de um apagão, qual sistema deve ser ligado imediatamente?",
      answer: "The emergency generator.",
      answerPt: "O gerador de emergência.",
      options: [
        { letter: "A", text: "The main engines.", textPt: "Os motores principais." },
        { letter: "B", text: "The emergency generator.", textPt: "O gerador de emergência." },
        { letter: "C", text: "The backup thrusters.", textPt: "Os propulsores de backup." },
        { letter: "D", text: "The DP computer.", textPt: "O computador DP." },
      ],
    },
    {
      id: 9,
      question: "What is the role of the Chief Engineer during a thruster failure?",
      pt: "Qual é o papel do Chefe de Máquinas durante uma falha de propulsor?",
      answer: "To go to the engine room and diagnose/fix the problem.",
      answerPt: "Ir à sala de máquinas e diagnosticar/consertar o problema.",
      options: [
        { letter: "A", text: "To stay on the bridge and monitor the DP console.", textPt: "Ficar na ponte e monitorar o console DP." },
        { letter: "B", text: "To go to the engine room and diagnose/fix the problem.", textPt: "Ir à sala de máquinas e diagnosticar/consertar o problema." },
        { letter: "C", text: "To inform the client about the delay.", textPt: "Informar o cliente sobre o atraso." },
        { letter: "D", text: "To reset the DP computer.", textPt: "Resetar o computador DP." },
      ],
    },
    {
      id: 10,
      question: "What does 'manual override' allow the DPO to do?",
      pt: "O que a 'substituição manual' permite que o DPO faça?",
      answer: "Bypass the automatic system and control thrusters manually.",
      answerPt: "Contornar o sistema automático e controlar os propulsores manualmente.",
      options: [
        { letter: "A", text: "Increase the setpoint automatically.", textPt: "Aumentar o setpoint automaticamente." },
        { letter: "B", text: "Bypass automatic control and manually control thrusters.", textPt: "Contornar o controle automático e controlar os propulsores manualmente." },
        { letter: "C", text: "Reset all alarms.", textPt: "Resetar todos os alarmes." },
        { letter: "D", text: "Switch off the DP system.", textPt: "Desligar o sistema DP." },
      ],
    },
    {
      id: 11,
      question: "What is a potential cause of a thruster failure?",
      pt: "Qual é uma causa potencial de falha de propulsor?",
      answer: "Overheating of the thruster motor.",
      answerPt: "Superaquecimento do motor do propulsor.",
      options: [
        { letter: "A", text: "Overheating of the thruster motor.", textPt: "Superaquecimento do motor do propulsor." },
        { letter: "B", text: "Low wind conditions.", textPt: "Condições de vento baixo." },
        { letter: "C", text: "Calm seas.", textPt: "Mar calmo." },
        { letter: "D", text: "High fuel level.", textPt: "Alto nível de combustível." },
      ],
    },
    {
      id: 12,
      question: "What should the DPO do if the vessel starts to drift off position?",
      pt: "O que o DPO deve fazer se a embarcação começar a derivar da posição?",
      answer: "Inform the Captain, use remaining thrusters, and consider manual override.",
      answerPt: "Informar o Capitão, usar os propulsores restantes e considerar a substituição manual.",
      options: [
        { letter: "A", text: "Ignore the drift and wait.", textPt: "Ignorar a deriva e esperar." },
        { letter: "B", text: "Inform the Captain, use remaining thrusters, and consider manual override.", textPt: "Informar o Capitão, usar os propulsores restantes e considerar a substituição manual." },
        { letter: "C", text: "Abandon the DP operation immediately.", textPt: "Abandonar a operação DP imediatamente." },
        { letter: "D", text: "Increase the setpoint.", textPt: "Aumentar o setpoint." },
      ],
    },
    {
      id: 13,
      question: "Which of the following is NOT a component of the DP system that can fail?",
      pt: "Qual dos seguintes NÃO é um componente do sistema DP que pode falhar?",
      answer: "The anchor.",
      answerPt: "A âncora.",
      options: [
        { letter: "A", text: "Thruster.", textPt: "Propulsor." },
        { letter: "B", text: "Gyro compass.", textPt: "Giroscópica." },
        { letter: "C", text: "Position reference system.", textPt: "Sistema de referência de posição." },
        { letter: "D", text: "Anchor.", textPt: "Âncora." },
      ],
    },
    {
      id: 14,
      question: "What is the first step after a failure is resolved?",
      pt: "Qual é o primeiro passo após uma falha ser resolvida?",
      answer: "Log the incident and perform a system check.",
      answerPt: "Registrar o incidente e fazer uma verificação do sistema.",
      options: [
        { letter: "A", text: "Resume normal operations immediately.", textPt: "Retomar as operações normais imediatamente." },
        { letter: "B", text: "Log the incident and perform a system check.", textPt: "Registrar o incidente e fazer uma verificação do sistema." },
        { letter: "C", text: "Notify the client.", textPt: "Notificar o cliente." },
        { letter: "D", text: "Increase the control gain.", textPt: "Aumentar o ganho de controle." },
      ],
    },
    {
      id: 15,
      question: "What is the importance of redundancy in a DP system?",
      pt: "Qual é a importância da redundância em um sistema DP?",
      answer: "It ensures the vessel can maintain position after a single point failure.",
      answerPt: "Garante que a embarcação possa manter a posição após uma falha de ponto único.",
      options: [
        { letter: "A", text: "It reduces fuel consumption.", textPt: "Reduz o consumo de combustível." },
        { letter: "B", text: "It ensures position maintenance after a failure.", textPt: "Garante a manutenção da posição após uma falha." },
        { letter: "C", text: "It increases the vessel's speed.", textPt: "Aumenta a velocidade da embarcação." },
        { letter: "D", text: "It simplifies the DP system.", textPt: "Simplifica o sistema DP." },
      ],
    },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-4">
            ⚓ Lesson 21 — Beyond Failure: Troubleshooting DP Emergencies
          </h1>
          <SpeakSentence
            text="Learn how to handle failures and emergencies in Dynamic Positioning operations."
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            📚 Learn how to handle failures and emergencies in Dynamic Positioning operations.
          </SpeakSentence>
          <div className="w-64 h-48 sm:h-56 mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
            <img src={imageUrl} alt="Offshore workers" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Offshore crew responding to an emergency</p>
        </div>

        {/* ===== VOCABULARY ===== */}
        <Section
          title="🔹 Key Vocabulary – Failure & Response"
          open={openSections.vocabulary}
          showTranslation={showTranslations.vocabulary}
          onToggle={() => toggleSection("vocabulary")}
          onToggleTranslation={() => toggleTranslation("vocabulary")}
          onNote={() => openNoteModal("Vocabulary")}
        >
          <p className="text-sm text-gray-600 mb-4">🎧 Click on any term to hear pronunciation.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vocabulary.map((item, idx) => (
              <div key={idx} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <SpeakText text={item.term} className="text-blue-700 font-bold text-lg block">
                  {item.term}
                </SpeakText>
                <p className="text-sm text-gray-700 mt-1">{item.definition}</p>
                {showTranslations.vocabulary && (
                  <p className="text-sm text-gray-500 mt-1 italic">🇧🇷 {item.pt}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== READING ===== */}
        <Section
          title="🔹 Reading – A DP Emergency"
          open={openSections.reading}
          showTranslation={showTranslations.reading}
          onToggle={() => toggleSection("reading")}
          onToggleTranslation={() => toggleTranslation("reading")}
          onNote={() => openNoteModal("Reading")}
        >
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold text-blue-600 mb-3">{reading.title}</h3>
              <div className="space-y-3 text-gray-700">
                {reading.paragraphs.map((p, i) => (
                  <p key={i}>
                    <SpeakSentence text={p} className="block w-full">
                      {p}
                    </SpeakSentence>
                    {showTranslations.reading && (
                      <span className="block text-sm text-gray-500 mt-1">🇧🇷 {reading.pt[i]}</span>
                    )}
                  </p>
                ))}
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md">
                <img src={imageUrl} alt="Bridge of a vessel" className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Bridge during an emergency</p>
            </div>
          </div>
        </Section>

        {/* ===== CONVERSATION ===== */}
        <Section
          title="🔹 Conversation – Dealing with a Thruster Failure"
          open={openSections.conversation}
          showTranslation={showTranslations.conversation}
          onToggle={() => toggleSection("conversation")}
          onToggleTranslation={() => toggleTranslation("conversation")}
          onNote={() => openNoteModal("Conversation")}
        >
          <div className="space-y-4">
            {conversation.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="font-bold text-blue-600 min-w-[120px]">{line.speaker}</span>
                <div className="flex-1">
                  <SpeakSentence text={line.line} className="block w-full text-gray-800">
                    {line.line}
                  </SpeakSentence>
                  {showTranslations.conversation && (
                    <p className="text-sm text-gray-500">🇧🇷 {line.pt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <div className="relative w-full max-w-md h-48 rounded-xl overflow-hidden shadow-md">
              <img src={imageUrl} alt="Emergency response" className="w-full h-full object-cover" />
            </div>
          </div>
        </Section>

        {/* ===== GRAMMAR ===== */}
        <Section
          title="🔹 Grammar – Conditionals & Modal Verbs"
          open={openSections.grammar}
          showTranslation={showTranslations.grammar}
          onToggle={() => toggleSection("grammar")}
          onToggleTranslation={() => toggleTranslation("grammar")}
          onNote={() => openNoteModal("Grammar")}
        >
          {grammarPoints.map((point, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <h3 className="text-lg font-bold text-blue-600 mb-2">{point.title}</h3>
              <div className="space-y-2">
                {point.examples.map((ex, i) => (
                  <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <SpeakSentence text={ex.en} className="block w-full text-gray-800 font-medium">
                      {ex.en}
                    </SpeakSentence>
                    {showTranslations.grammar && (
                      <p className="text-sm text-gray-500">🇧🇷 {ex.pt}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        {/* ===== PRACTICE (CORRIGIDO) ===== */}
        <Section
          title="🔹 Practice Exercises"
          open={openSections.practice}
          showTranslation={showTranslations.practice}
          onToggle={() => toggleSection("practice")}
          onToggleTranslation={() => toggleTranslation("practice")}
          onNote={() => openNoteModal("Practice")}
        >
          {practiceExercises.map((exercise, idx) => (
            <div key={idx} className="mb-8 last:mb-0">
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                {exercise.type === "fill" ? "📝 Fill in the Blanks" : "🔄 Translation Practice"}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{exercise.instruction}</p>
              <div className="space-y-3">
                {exercise.items.map((item, i) => {
                  // Type guard para saber se é FillItem ou TranslateItem
                  const isFill = (item: PracticeItem): item is FillItem => {
                    return (item as FillItem).sentence !== undefined;
                  };

                  if (isFill(item)) {
                    // Item é do tipo FillItem
                    return (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-gray-800">
                          {item.sentence.replace(/__________/g, "________")}
                          <span className="text-green-600 font-bold ml-2">→ {item.answer}</span>
                        </p>
                        {showTranslations.practice && (
                          <p className="text-sm text-gray-500">
                            🇧🇷 {item.sentence.replace(/__________/g, "________")} → {item.answer}
                          </p>
                        )}
                      </div>
                    );
                  } else {
                    // Item é do tipo TranslateItem
                    return (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-gray-600">🇧🇷 {item.pt}</p>
                        <p className="text-blue-600 font-bold">→ {item.en}</p>
                        {showTranslations.practice && (
                          <p className="text-sm text-gray-500">🇧🇷 Tradução: {item.pt} → {item.en}</p>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          ))}
        </Section>

        {/* ===== SPEAKING ===== */}
        <Section
          title="🔹 Speaking Practice – Role Play"
          open={openSections.speaking}
          showTranslation={showTranslations.speaking}
          onToggle={() => toggleSection("speaking")}
          onToggleTranslation={() => toggleTranslation("speaking")}
          onNote={() => openNoteModal("Speaking")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {speakingPractice.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="font-bold text-blue-600">👤 {item.role}</p>
                <p className="text-gray-800">{item.scenario}</p>
                {showTranslations.speaking && (
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 {item.pt}</p>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* ===== EXAM QUESTIONS ===== */}
        <Section
          title={`🔹 Exam Questions – Failures & Emergencies (${questions.length})`}
          open={openSections.questions}
          showTranslation={showTranslations.questions}
          onToggle={() => toggleSection("questions")}
          onToggleTranslation={() => toggleTranslation("questions")}
          onNote={() => openNoteModal("Questions")}
        >
          <p className="text-sm text-gray-600 mb-4">
            🎧 Click on each question to hear it. Use the options or type your answer.
          </p>
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <QuestionItem key={q.id} q={q} index={idx} showTranslation={showTranslations.questions} />
            ))}
          </div>
        </Section>

        {/* ===== FINAL REVIEW ===== */}
        <Section
          title="⭐ Final Review – Key Takeaways"
          open={openSections.review}
          showTranslation={showTranslations.review}
          onToggle={() => toggleSection("review")}
          onToggleTranslation={() => toggleTranslation("review")}
          onNote={() => openNoteModal("Review")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-blue-600 mb-2">📋 What we learned</h3>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Vocabulary for failures and vessel parts</li>
                <li>How to respond to thruster failures and blackouts</li>
                <li>Role of DPO, Captain, and Chief Engineer in emergencies</li>
                <li>Use of conditionals and modal verbs in procedures</li>
                <li>Importance of FMEA and Consequence Analysis</li>
              </ul>
              {showTranslations.review && (
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-500 mt-2">
                  <li>🇧🇷 Vocabulário para falhas e partes do navio</li>
                  <li>🇧🇷 Como responder a falhas de propulsores e apagões</li>
                  <li>🇧🇷 Papel do DPO, Capitão e Chefe de Máquinas em emergências</li>
                  <li>🇧🇷 Uso de condicionais e verbos modais em procedimentos</li>
                  <li>🇧🇷 Importância do FMEA e da Análise de Consequências</li>
                </ul>
              )}
            </div>
            <div>
              <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md">
                <img src={imageUrl} alt="Offshore platform" className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Always be prepared for failures</p>
            </div>
          </div>
        </Section>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson20")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            &larr; Previous Lesson
          </button>
          <button
            onClick={() => alert("🏁 End of Lesson 21 – Beyond Failure")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            Next Lesson &rarr;
          </button>
        </div>
      </div>

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