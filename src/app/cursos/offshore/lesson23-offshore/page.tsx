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
// SUBCOMPONENTE QUESTION ITEM
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
// MAIN COMPONENT – Lesson 23
// ============================================

export default function Lesson23() {
  const router = useRouter();

  // Estado das seções (aberto/fechado)
  const [openSections, setOpenSections] = useState({
    vocabulary: true,
    dialogue1: true,
    dialogue2: true,
    reading: true,
    grammar: true,
    practice: true,
    openQuestions: true,
    review: true,
  });

  // Estado das traduções (mostrar/ocultar)
  const [showTranslations, setShowTranslations] = useState<
    Record<keyof typeof openSections, boolean>
  >({
    vocabulary: false,
    dialogue1: false,
    dialogue2: false,
    reading: false,
    grammar: false,
    practice: false,
    openQuestions: false,
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
      term: "Situational Awareness",
      definition: "The ability to perceive, understand, and predict what is happening around you.",
      pt: "Consciência Situacional: capacidade de perceber, entender e prever o que está acontecendo ao seu redor.",
    },
    {
      term: "Distraction",
      definition: "Something that takes your attention away from the main task.",
      pt: "Distração: algo que desvia sua atenção da tarefa principal.",
    },
    {
      term: "Checklist",
      definition: "A list of items to be verified or actions to be taken, used to reduce human error.",
      pt: "Lista de verificação: lista de itens a serem verificados ou ações a serem tomadas, usada para reduzir erro humano.",
    },
    {
      term: "Handover",
      definition: "The process of transferring responsibility and information from one operator to another.",
      pt: "Passagem de serviço: processo de transferir responsabilidade e informações de um operador para outro.",
    },
    {
      term: "ASOG (Activity Specific Operating Guidelines)",
      definition: "A matrix that defines what operations are permitted or prohibited based on DP status (Green, Yellow, Red).",
      pt: "ASOG (Diretrizes Operacionais Específicas da Atividade): matriz que define quais operações são permitidas ou proibidas com base no status do DP (Verde, Amarelo, Vermelho).",
    },
    {
      term: "FMEA Trials",
      definition: "Tests conducted to verify that the vessel's redundancy arrangements work as described in the FMEA.",
      pt: "Testes do FMEA: testes realizados para verificar se os arranjos de redundância da embarcação funcionam conforme descrito no FMEA.",
    },
    {
      term: "OEM (Original Equipment Manufacturer)",
      definition: "The company that originally designed and manufactured the DP system.",
      pt: "OEM (Fabricante Original do Equipamento): empresa que originalmente projetou e fabricou o sistema DP.",
    },
    {
      term: "UPS (Uninterruptible Power Supply)",
      definition: "A backup power system that provides emergency power to the DP system if the main power fails.",
      pt: "UPS (Fonte de Alimentação Ininterrupta): sistema de energia reserva que fornece energia de emergência ao sistema DP se a energia principal falhar.",
    },
    {
      term: "Footprint Plot",
      definition: "A graph showing the vessel's exact trajectory during a failure or event, used for incident analysis.",
      pt: "Gráfico de Pegada: gráfico que mostra a trajetória exata da embarcação durante uma falha ou evento, usado para análise de incidentes.",
    },
    {
      term: "DP Status Lights",
      definition: "Color-coded indicators (Green, Yellow, Red) that show the current status of the DP system.",
      pt: "Luzes de Status do DP: indicadores codificados por cores (Verde, Amarelo, Vermelho) que mostram o status atual do sistema DP.",
    },
    {
      term: "Redundant Group",
      definition: "A set of equipment (generators, thrusters, etc.) that can be lost without affecting the vessel's ability to hold position.",
      pt: "Grupo Redundante: conjunto de equipamentos (geradores, propulsores, etc.) que pode ser perdido sem afetar a capacidade da embarcação de manter a posição.",
    },
    {
      term: "Blackout Recovery",
      definition: "The procedure to restore power and DP control after a complete loss of electrical power.",
      pt: "Recuperação de Apagão: procedimento para restaurar a energia e o controle DP após uma perda total de energia elétrica.",
    },
  ];

  // --- DIALOGUE 1 (Human Factor) ---
  const dialogue1 = {
    title: "Dialogue 1 – The Distracted SDPO",
    level: "B1",
    lines: [
      {
        speaker: "SDPO",
        en: "Master, I need to check the DP console. I also have to reply to this email and update the logbook.",
        pt: "Mestre, preciso verificar o console DP. Também tenho que responder este e-mail e atualizar o diário de bordo.",
      },
      {
        speaker: "Captain",
        en: "Stop. You cannot do three things at once during DP operations. What is your priority?",
        pt: "Pare. Você não pode fazer três coisas ao mesmo tempo durante operações DP. Qual é sua prioridade?",
      },
      {
        speaker: "SDPO",
        en: "The DP console, Master. The vessel is in Green status, but I should not leave the console unattended.",
        pt: "O console DP, Mestre. A embarcação está em status Verde, mas eu não deveria deixar o console sem supervisão.",
      },
      {
        speaker: "Captain",
        en: "Correct. The logbook can wait. The email can wait. The DP console cannot. Always maintain your situational awareness.",
        pt: "Correto. O diário de bordo pode esperar. O e-mail pode esperar. O console DP não pode. Sempre mantenha sua consciência situacional.",
      },
      {
        speaker: "SDPO",
        en: "Understood, Master. I will ask the other DPO to assist with the logbook later.",
        pt: "Entendido, Mestre. Vou pedir ao outro DPO para ajudar com o diário de bordo mais tarde.",
      },
    ],
  };

  // --- DIALOGUE 2 (UPS Failure) ---
  const dialogue2 = {
    title: "Dialogue 2 – The UPS Failure",
    level: "B1",
    lines: [
      {
        speaker: "DPO",
        en: "Captain, we have a UPS alarm on the DP console. The main UPS is offline.",
        pt: "Capitão, temos um alarme de UPS no console DP. A UPS principal está offline.",
      },
      {
        speaker: "Captain",
        en: "What is the current DP status?",
        pt: "Qual é o status atual do DP?",
      },
      {
        speaker: "DPO",
        en: "The system is in Yellow status. The backup UPS is working, but I don't know how long it will last.",
        pt: "O sistema está em status Amarelo. A UPS de reserva está funcionando, mas não sei quanto tempo vai durar.",
      },
      {
        speaker: "Captain",
        en: "Switch to the backup DP console immediately. Inform the technical team and reduce operations.",
        pt: "Mude para o console DP de reserva imediatamente. Informe a equipe técnica e reduza as operações.",
      },
      {
        speaker: "DPO",
        en: "Yes, Captain. I am switching now. The backup console is online. Position is stable.",
        pt: "Sim, Capitão. Estou mudando agora. O console de reserva está online. A posição está estável.",
      },
      {
        speaker: "Captain",
        en: "Good. Log the incident and check the ASOG for Yellow status procedures.",
        pt: "Bom. Registre o incidente e verifique o ASOG para procedimentos de status Amarelo.",
      },
    ],
  };

  // --- READING (Case Study: The Uncalibrated Joystick) ---
  const reading = {
    title: "Case Study – The Uncalibrated Joystick",
    paragraphs: [
      "A DP vessel was in the middle of an operation near a platform. The DP system had just received a software update from the OEM. The DPO on watch was experienced, but he had never used this new version of the software.",
      "The DPO noticed that the joystick was not responding correctly. He tried to move the vessel, but the joystick was too sensitive. He thought the problem was with the thrusters, but the thruster status was normal.",
      "He called the Captain and the technical team. The OEM technician on board checked the system and found the problem: the joystick needed to be recalibrated after the software update. This had happened before on another vessel, but the DPO did not know because he had not read the manual.",
      "The technician recalibrated the joystick, and the DP system returned to normal. The Captain called a meeting. He said: 'This incident was not caused by a technical failure. It was caused by a lack of familiarization. We should have checked the manual before the update. We should have conducted a familiarization session with the new software.'",
      "Lessons learned: Always read the manual after a software update. Always conduct a familiarization session with the crew. Always ask questions if you are not sure. Seniority is not the same as familiarity.",
    ],
    pt: [
      "Uma embarcação DP estava no meio de uma operação perto de uma plataforma. O sistema DP acabara de receber uma atualização de software do OEM. O DPO de serviço era experiente, mas nunca havia usado aquela nova versão do software.",
      "O DPO notou que o joystick não estava respondendo corretamente. Ele tentou mover a embarcação, mas o joystick estava muito sensível. Ele pensou que o problema era com os propulsores, mas o status dos propulsores estava normal.",
      "Ele chamou o Capitão e a equipe técnica. O técnico do OEM a bordo verificou o sistema e encontrou o problema: o joystick precisava ser recalibrado após a atualização de software. Isso já havia acontecido antes em outra embarcação, mas o DPO não sabia porque não havia lido o manual.",
      "O técnico recalibrou o joystick e o sistema DP voltou ao normal. O Capitão convocou uma reunião. Ele disse: 'Este incidente não foi causado por uma falha técnica. Foi causado por falta de familiarização. Deveríamos ter verificado o manual antes da atualização. Deveríamos ter realizado uma sessão de familiarização com o novo software.'",
      "Lições aprendidas: Sempre leia o manual após uma atualização de software. Sempre realize uma sessão de familiarização com a tripulação. Sempre faça perguntas se não tiver certeza. Senioridade não é o mesmo que familiaridade.",
    ],
  };

  // --- GRAMMAR ---
  const grammarPoints = [
    {
      title: "Should have / Could have (Past Modals for Regret and Lesson Learned)",
      examples: [
        {
          en: "We should have checked the manual before the update.",
          pt: "Deveríamos ter verificado o manual antes da atualização.",
        },
        {
          en: "We could have avoided the incident if we had conducted a familiarization session.",
          pt: "Poderíamos ter evitado o incidente se tivéssemos realizado uma sessão de familiarização.",
        },
        {
          en: "The DPO should have asked for help instead of doing three tasks at once.",
          pt: "O DPO deveria ter pedido ajuda em vez de fazer três tarefas ao mesmo tempo.",
        },
      ],
    },
    {
      title: "Must / Have to (Non-Negotiable Procedures)",
      examples: [
        {
          en: "You must never change the DP mode without informing the Master.",
          pt: "Você nunca deve mudar o modo do DP sem informar o Mestre.",
        },
        {
          en: "The crew has to follow the ASOG for the current DP status.",
          pt: "A tripulação tem que seguir o ASOG para o status atual do DP.",
        },
        {
          en: "You must maintain your situational awareness at all times during DP operations.",
          pt: "Você deve manter sua consciência situacional o tempo todo durante operações DP.",
        },
      ],
    },
  ];

  // --- PRACTICE EXERCISES ---
  const practiceExercises: {
    type: "fill" | "translate";
    instruction: string;
    items: PracticeItem[];
  }[] = [
    {
      type: "fill",
      instruction: "Complete the sentences with the correct term from the vocabulary list.",
      items: [
        {
          sentence: "The ability to perceive and understand what is happening around you is called __________.",
          answer: "situational awareness",
        },
        {
          sentence: "A __________ is used to reduce human error during critical operations.",
          answer: "checklist",
        },
        {
          sentence: "The __________ defines what operations are permitted based on DP status.",
          answer: "ASOG",
        },
        {
          sentence: "The __________ provides backup power to the DP system if the main power fails.",
          answer: "UPS",
        },
        {
          sentence: "A __________ shows the vessel's exact trajectory during a failure event.",
          answer: "footprint plot",
        },
      ] as FillItem[],
    },
    {
      type: "translate",
      instruction: "Translate the following sentences into English.",
      items: [
        {
          pt: "Deveríamos ter verificado o manual antes da atualização.",
          en: "We should have checked the manual before the update.",
        },
        {
          pt: "Você nunca deve mudar o modo do DP sem informar o Mestre.",
          en: "You must never change the DP mode without informing the Master.",
        },
        {
          pt: "A familiarização é mais importante que a senioridade.",
          en: "Familiarization is more important than seniority.",
        },
        {
          pt: "O sistema está em status Amarelo.",
          en: "The system is in Yellow status.",
        },
        {
          pt: "Devemos reduzir as operações imediatamente.",
          en: "We must reduce operations immediately.",
        },
      ] as TranslateItem[],
    },
  ];

  // --- OPEN-ENDED QUESTIONS ---
  const openQuestions = [
    {
      question: "Why is familiarization more important than seniority?",
      hint: "Use 'new software', 'manual', and 'familiarization session'.",
      sampleAnswer: "Familiarization is more important than seniority because a senior DPO may not know the specific systems on a new vessel or after a software update. Seniority gives experience, but familiarization gives specific knowledge. A senior DPO who has not read the manual may make mistakes. A junior DPO who has completed a familiarization session may be safer. Both experience and familiarization are important, but you should never assume that seniority means you know everything.",
    },
    {
      question: "What would you do if a technician wanted to update the DP system in the middle of an operation?",
      hint: "Use 'reduce operations', 'inform the Master', and 'familiarization'.",
      sampleAnswer: "If a technician wanted to update the DP system in the middle of an operation, I would first inform the Master. I would recommend reducing operations or waiting for a safer time. A software update can change the behavior of the system, and the crew may not be familiar with the new version. We should never update the DP system during a critical operation without a full risk assessment and a familiarization session.",
    },
    {
      question: "What is the difference between a Warning (Yellow) and an Alarm (Red) on the DP console?",
      hint: "Use 'potential issue', 'critical', and 'immediate action'.",
      sampleAnswer: "A Warning (Yellow) indicates a potential issue that may require attention. It is not immediately critical, but the DPO should monitor the situation and be ready to act. An Alarm (Red) indicates a critical problem that requires immediate action. The DPO must follow the ASOG and may need to reduce operations or switch to manual control. Both must be taken seriously and logged.",
    },
    {
      question: "How can a footprint plot help improve DP procedures?",
      hint: "Use 'trajectory', 'incident analysis', and 'lessons learned'.",
      sampleAnswer: "A footprint plot shows the exact trajectory of the vessel during a failure or event. It helps the crew understand what happened and why. By analyzing the footprint plot, we can identify what went wrong and improve our procedures. It is a valuable tool for incident analysis and lessons learned. It can also be used in training to show new DPOs how the vessel behaves in different situations.",
    },
    {
      question: "What should you do if you lose a redundant group of thrusters?",
      hint: "Use 'remaining capacity', 'reduce operations', and 'ASOG'.",
      sampleAnswer: "If I lose a redundant group of thrusters, I should first check the remaining capacity of the DP system. I should inform the Master and consult the ASOG to see what operations are still permitted. I may need to reduce operations or switch to a less demanding mode. I should also inform the technical team and log the incident. The safety of the vessel and the crew is the priority.",
    },
    {
      question: "Why is it important to conduct FMEA trials?",
      hint: "Use 'redundancy', 'verify', and 'FMEA document'.",
      sampleAnswer: "FMEA trials are important because they verify that the vessel's redundancy arrangements work as described in the FMEA document. They test whether the vessel can actually maintain position after a failure. If the trials fail, the FMEA must be updated, and the crew must be informed. FMEA trials are a key part of DP assurance and safety management.",
    },
  ];

  // --- EXAM QUESTIONS ---
  const questions: QuestionType[] = [
    {
      id: 1,
      question: "What is situational awareness in DP operations?",
      pt: "O que é consciência situacional em operações DP?",
      answer: "The ability to perceive, understand, and predict what is happening around you.",
      answerPt: "A capacidade de perceber, entender e prever o que está acontecendo ao seu redor.",
      options: [
        { letter: "A", text: "The ability to control the thrusters manually.", textPt: "A capacidade de controlar os propulsores manualmente." },
        { letter: "B", text: "The ability to perceive, understand, and predict what is happening.", textPt: "A capacidade de perceber, entender e prever o que está acontecendo." },
        { letter: "C", text: "The ability to repair the DP system.", textPt: "A capacidade de reparar o sistema DP." },
        { letter: "D", text: "The ability to read the manual.", textPt: "A capacidade de ler o manual." },
      ],
    },
    {
      id: 2,
      question: "What is the ASOG?",
      pt: "O que é o ASOG?",
      answer: "A matrix that defines permitted operations based on DP status.",
      answerPt: "Uma matriz que define operações permitidas com base no status do DP.",
      options: [
        { letter: "A", text: "A backup power system.", textPt: "Um sistema de energia reserva." },
        { letter: "B", text: "A matrix that defines permitted operations based on DP status.", textPt: "Uma matriz que define operações permitidas com base no status do DP." },
        { letter: "C", text: "A type of thruster.", textPt: "Um tipo de propulsor." },
        { letter: "D", text: "A software update.", textPt: "Uma atualização de software." },
      ],
    },
    {
      id: 3,
      question: "What does a Yellow status light on the DP console mean?",
      pt: "O que significa uma luz de status Amarela no console DP?",
      answer: "A warning – a potential issue that may require attention.",
      answerPt: "Um aviso – um problema potencial que pode exigir atenção.",
      options: [
        { letter: "A", text: "The system is fully operational.", textPt: "O sistema está totalmente operacional." },
        { letter: "B", text: "A warning – a potential issue.", textPt: "Um aviso – um problema potencial." },
        { letter: "C", text: "A critical alarm requiring immediate action.", textPt: "Um alarme crítico que exige ação imediata." },
        { letter: "D", text: "The system is offline.", textPt: "O sistema está offline." },
      ],
    },
    {
      id: 4,
      question: "What is a UPS in a DP system?",
      pt: "O que é uma UPS em um sistema DP?",
      answer: "An Uninterruptible Power Supply that provides backup power.",
      answerPt: "Uma Fonte de Alimentação Ininterrupta que fornece energia reserva.",
      options: [
        { letter: "A", text: "A type of thruster.", textPt: "Um tipo de propulsor." },
        { letter: "B", text: "A backup power system for the DP system.", textPt: "Um sistema de energia reserva para o sistema DP." },
        { letter: "C", text: "A position reference system.", textPt: "Um sistema de referência de posição." },
        { letter: "D", text: "A software update tool.", textPt: "Uma ferramenta de atualização de software." },
      ],
    },
    {
      id: 5,
      question: "What is a footprint plot used for?",
      pt: "Para que serve um gráfico de pegada?",
      answer: "To analyze the vessel's trajectory during a failure or event.",
      answerPt: "Para analisar a trajetória da embarcação durante uma falha ou evento.",
      options: [
        { letter: "A", text: "To calculate fuel consumption.", textPt: "Para calcular o consumo de combustível." },
        { letter: "B", text: "To analyze the vessel's trajectory during an event.", textPt: "Para analisar a trajetória da embarcação durante um evento." },
        { letter: "C", text: "To control the thrusters.", textPt: "Para controlar os propulsores." },
        { letter: "D", text: "To monitor the weather.", textPt: "Para monitorar o tempo." },
      ],
    },
    {
      id: 6,
      question: "What should you do after a software update on the DP system?",
      pt: "O que você deve fazer após uma atualização de software no sistema DP?",
      answer: "Read the manual and conduct a familiarization session.",
      answerPt: "Ler o manual e realizar uma sessão de familiarização.",
      options: [
        { letter: "A", text: "Resume operations immediately.", textPt: "Retomar as operações imediatamente." },
        { letter: "B", text: "Read the manual and conduct a familiarization session.", textPt: "Ler o manual e realizar uma sessão de familiarização." },
        { letter: "C", text: "Ignore the update.", textPt: "Ignorar a atualização." },
        { letter: "D", text: "Turn off the DP system.", textPt: "Desligar o sistema DP." },
      ],
    },
    {
      id: 7,
      question: "What is a redundant group in a DP system?",
      pt: "O que é um grupo redundante em um sistema DP?",
      answer: "A set of equipment that can be lost without affecting position keeping.",
      answerPt: "Um conjunto de equipamentos que pode ser perdido sem afetar a manutenção da posição.",
      options: [
        { letter: "A", text: "A group of DPOs.", textPt: "Um grupo de DPOs." },
        { letter: "B", text: "A set of equipment that can be lost without affecting position keeping.", textPt: "Um conjunto de equipamentos que pode ser perdido sem afetar a manutenção da posição." },
        { letter: "C", text: "A type of alarm.", textPt: "Um tipo de alarme." },
        { letter: "D", text: "A software program.", textPt: "Um programa de software." },
      ],
    },
    {
      id: 8,
      question: "Why should you never change the DP mode without informing the Master?",
      pt: "Por que você nunca deve mudar o modo do DP sem informar o Mestre?",
      answer: "Because it can affect the safety of the vessel and the operation.",
      answerPt: "Porque pode afetar a segurança da embarcação e da operação.",
      options: [
        { letter: "A", text: "Because it is a rule with no reason.", textPt: "Porque é uma regra sem razão." },
        { letter: "B", text: "Because it can affect the safety of the vessel and the operation.", textPt: "Porque pode afetar a segurança da embarcação e da operação." },
        { letter: "C", text: "Because the Master likes to be informed.", textPt: "Porque o Mestre gosta de ser informado." },
        { letter: "D", text: "Because the DPO is not allowed to touch the console.", textPt: "Porque o DPO não tem permissão para tocar no console." },
      ],
    },
    {
      id: 9,
      question: "What is 'should have' used for in incident analysis?",
      pt: "Para que serve 'should have' na análise de incidentes?",
      answer: "To express regret or a lesson learned about the past.",
      answerPt: "Para expressar arrependimento ou uma lição aprendida sobre o passado.",
      options: [
        { letter: "A", text: "To give orders.", textPt: "Para dar ordens." },
        { letter: "B", text: "To express regret or a lesson learned.", textPt: "Para expressar arrependimento ou uma lição aprendida." },
        { letter: "C", text: "To describe the present.", textPt: "Para descrever o presente." },
        { letter: "D", text: "To ask questions.", textPt: "Para fazer perguntas." },
      ],
    },
    {
      id: 10,
      question: "What is the first thing you should do if you lose a redundant group of thrusters?",
      pt: "Qual é a primeira coisa que você deve fazer se perder um grupo redundante de propulsores?",
      answer: "Check the remaining capacity and inform the Master.",
      answerPt: "Verificar a capacidade restante e informar o Mestre.",
      options: [
        { letter: "A", text: "Continue operations as normal.", textPt: "Continuar as operações normalmente." },
        { letter: "B", text: "Check the remaining capacity and inform the Master.", textPt: "Verificar a capacidade restante e informar o Mestre." },
        { letter: "C", text: "Turn off the DP system.", textPt: "Desligar o sistema DP." },
        { letter: "D", text: "Call the client.", textPt: "Ligar para o cliente." },
      ],
    },
    {
      id: 11,
      question: "What is the purpose of FMEA trials?",
      pt: "Qual é o propósito dos testes do FMEA?",
      answer: "To verify that redundancy arrangements work as described.",
      answerPt: "Verificar se os arranjos de redundância funcionam conforme descrito.",
      options: [
        { letter: "A", text: "To test the thrusters only.", textPt: "Testar apenas os propulsores." },
        { letter: "B", text: "To verify that redundancy arrangements work as described.", textPt: "Verificar se os arranjos de redundância funcionam conforme descrito." },
        { letter: "C", text: "To train new DPOs.", textPt: "Treinar novos DPOs." },
        { letter: "D", text: "To calculate fuel consumption.", textPt: "Calcular o consumo de combustível." },
      ],
    },
    {
      id: 12,
      question: "What should you do if a technician wants to update the DP system during an operation?",
      pt: "O que você deve fazer se um técnico quiser atualizar o sistema DP durante uma operação?",
      answer: "Inform the Master and recommend waiting or reducing operations.",
      answerPt: "Informar o Mestre e recomendar esperar ou reduzir as operações.",
      options: [
        { letter: "A", text: "Allow the update immediately.", textPt: "Permitir a atualização imediatamente." },
        { letter: "B", text: "Inform the Master and recommend waiting or reducing operations.", textPt: "Informar o Mestre e recomendar esperar ou reduzir as operações." },
        { letter: "C", text: "Ignore the technician.", textPt: "Ignorar o técnico." },
        { letter: "D", text: "Turn off the DP system.", textPt: "Desligar o sistema DP." },
      ],
    },
    {
      id: 13,
      question: "What does 'handover' mean in DP operations?",
      pt: "O que significa 'passagem de serviço' em operações DP?",
      answer: "Transferring responsibility and information from one operator to another.",
      answerPt: "Transferir responsabilidade e informações de um operador para outro.",
      options: [
        { letter: "A", text: "Turning off the DP system.", textPt: "Desligar o sistema DP." },
        { letter: "B", text: "Transferring responsibility and information from one operator to another.", textPt: "Transferir responsabilidade e informações de um operador para outro." },
        { letter: "C", text: "Repairing the thrusters.", textPt: "Reparar os propulsores." },
        { letter: "D", text: "Updating the software.", textPt: "Atualizar o software." },
      ],
    },
    {
      id: 14,
      question: "What is the main lesson from the uncalibrated joystick case study?",
      pt: "Qual é a principal lição do estudo de caso do joystick descalibrado?",
      answer: "Familiarization is essential, especially after software updates.",
      answerPt: "A familiarização é essencial, especialmente após atualizações de software.",
      options: [
        { letter: "A", text: "Joysticks are unreliable.", textPt: "Joysticks não são confiáveis." },
        { letter: "B", text: "Familiarization is essential after software updates.", textPt: "A familiarização é essencial após atualizações de software." },
        { letter: "C", text: "Software updates are dangerous.", textPt: "Atualizações de software são perigosas." },
        { letter: "D", text: "Seniority is the most important quality.", textPt: "Senioridade é a qualidade mais importante." },
      ],
    },
    {
      id: 15,
      question: "How can you maintain good situational awareness on the bridge?",
      pt: "Como você pode manter uma boa consciência situacional na ponte?",
      answer: "By focusing on the DP console, avoiding distractions, and communicating clearly.",
      answerPt: "Focando no console DP, evitando distrações e comunicando-se claramente.",
      options: [
        { letter: "A", text: "By doing multiple tasks at once.", textPt: "Fazendo múltiplas tarefas ao mesmo tempo." },
        { letter: "B", text: "By focusing on the DP console, avoiding distractions, and communicating clearly.", textPt: "Focando no console DP, evitando distrações e comunicando-se claramente." },
        { letter: "C", text: "By leaving the bridge frequently.", textPt: "Saindo da ponte com frequência." },
        { letter: "D", text: "By ignoring alarms.", textPt: "Ignorando alarmes." },
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
            🧠 Lesson 23 — Beyond the Console: Situational Awareness and Safe DP Practices
          </h1>
          <SpeakSentence
            text="Learn how to manage safety, human factors, and advanced DP systems."
            className="text-xl text-gray-700 max-w-3xl mx-auto"
          >
            📚 Learn how to manage safety, human factors, and advanced DP systems.
          </SpeakSentence>
          <div className="w-64 h-48 sm:h-56 mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
            <img src={imageUrl} alt="DP Console" className="w-full h-full object-cover" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Maintaining situational awareness on the bridge</p>
        </div>

        {/* ===== VOCABULARY ===== */}
        <Section
          title="🔹 Key Vocabulary – Safety & Procedures"
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

        {/* ===== DIALOGUE 1 ===== */}
        <Section
          title={`🔹 ${dialogue1.title}`}
          open={openSections.dialogue1}
          showTranslation={showTranslations.dialogue1}
          onToggle={() => toggleSection("dialogue1")}
          onToggleTranslation={() => toggleTranslation("dialogue1")}
          onNote={() => openNoteModal("Dialogue 1")}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-blue-600/60 text-white px-2 py-0.5 rounded-full">{dialogue1.level}</span>
          </div>
          <div className="space-y-4">
            {dialogue1.lines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="font-bold text-blue-600 min-w-[120px]">{line.speaker}:</span>
                <div className="flex-1">
                  <SpeakSentence text={line.en} className="block w-full text-gray-800">
                    {line.en}
                  </SpeakSentence>
                  {showTranslations.dialogue1 && (
                    <p className="text-sm text-gray-500">🇧🇷 {line.pt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== DIALOGUE 2 ===== */}
        <Section
          title={`🔹 ${dialogue2.title}`}
          open={openSections.dialogue2}
          showTranslation={showTranslations.dialogue2}
          onToggle={() => toggleSection("dialogue2")}
          onToggleTranslation={() => toggleTranslation("dialogue2")}
          onNote={() => openNoteModal("Dialogue 2")}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs bg-blue-600/60 text-white px-2 py-0.5 rounded-full">{dialogue2.level}</span>
          </div>
          <div className="space-y-4">
            {dialogue2.lines.map((line, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="font-bold text-blue-600 min-w-[120px]">{line.speaker}:</span>
                <div className="flex-1">
                  <SpeakSentence text={line.en} className="block w-full text-gray-800">
                    {line.en}
                  </SpeakSentence>
                  {showTranslations.dialogue2 && (
                    <p className="text-sm text-gray-500">🇧🇷 {line.pt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== READING ===== */}
        <Section
          title="🔹 Reading – Case Study"
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
                <img src={imageUrl} alt="DP Console" className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Analyzing a footprint plot</p>
            </div>
          </div>
        </Section>

        {/* ===== GRAMMAR ===== */}
        <Section
          title="🔹 Grammar – Past Modals & Non-Negotiable Procedures"
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

        {/* ===== PRACTICE ===== */}
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
                  const isFill = (item: PracticeItem): item is FillItem => {
                    return (item as FillItem).sentence !== undefined;
                  };

                  if (isFill(item)) {
                    return (
                      <div key={i} className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                        <p className="text-gray-800">
                          {item.sentence}
                          <span className="text-green-600 font-bold ml-2">→ {item.answer}</span>
                        </p>
                        {showTranslations.practice && (
                          <p className="text-sm text-gray-500">
                            🇧🇷 {item.sentence} → {item.answer}
                          </p>
                        )}
                      </div>
                    );
                  } else {
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

        {/* ===== OPEN-ENDED QUESTIONS ===== */}
        <Section
          title="🔹 Open-Ended Questions"
          open={openSections.openQuestions}
          showTranslation={showTranslations.openQuestions}
          onToggle={() => toggleSection("openQuestions")}
          onToggleTranslation={() => toggleTranslation("openQuestions")}
          onNote={() => openNoteModal("Open Questions")}
        >
          <p className="text-sm text-gray-600 mb-4">
            💭 Answer in your own words. Practice speaking and writing.
          </p>
          <div className="space-y-5">
            {openQuestions.map((q, idx) => (
              <div key={idx} className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-xl border border-blue-300">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">💭</span>
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-lg mb-1">{q.question}</p>
                    <p className="text-blue-600 text-sm mb-3 italic">💡 {q.hint}</p>
                    <details className="mt-2">
                      <summary className="text-sm px-4 py-2 bg-blue-600/80 hover:bg-blue-700 text-white rounded-full transition-colors cursor-pointer inline-block">
                        👀 Ver resposta modelo
                      </summary>
                      <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-blue-700 text-sm mb-1">🗣️ Sample answer:</p>
                        <SpeakSentence text={q.sampleAnswer} className="text-gray-800 font-medium">
                          {q.sampleAnswer}
                        </SpeakSentence>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ===== EXAM QUESTIONS ===== */}
        <Section
          title={`🔹 Exam Questions – Safety & Situational Awareness (${questions.length})`}
          open={openSections.openQuestions}
          showTranslation={showTranslations.openQuestions}
          onToggle={() => toggleSection("openQuestions")}
          onToggleTranslation={() => toggleTranslation("openQuestions")}
          onNote={() => openNoteModal("Questions")}
        >
          <p className="text-sm text-gray-600 mb-4">
            🎧 Click on each question to hear it. Use the options or type your answer.
          </p>
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <QuestionItem key={q.id} q={q} index={idx} showTranslation={showTranslations.openQuestions} />
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
                <li>Situational awareness and human factors in DP operations</li>
                <li>DP status lights and the ASOG matrix (Green, Yellow, Red)</li>
                <li>UPS failures and backup console procedures</li>
                <li>Footprint plots for incident analysis</li>
                <li>FMEA trials and redundancy verification</li>
                <li>Past modals (should have / could have) for lessons learned</li>
                <li>The importance of familiarization after software updates</li>
              </ul>
              {showTranslations.review && (
                <ul className="list-disc pl-6 space-y-1 text-sm text-gray-500 mt-2">
                  <li>🇧🇷 Consciência situacional e fatores humanos em operações DP</li>
                  <li>🇧🇷 Luzes de status do DP e a matriz ASOG (Verde, Amarelo, Vermelho)</li>
                  <li>🇧🇷 Falhas de UPS e procedimentos de console de reserva</li>
                  <li>🇧🇷 Gráficos de pegada para análise de incidentes</li>
                  <li>🇧🇷 Testes do FMEA e verificação de redundância</li>
                  <li>🇧🇷 Modais passados (should have / could have) para lições aprendidas</li>
                  <li>🇧🇷 A importância da familiarização após atualizações de software</li>
                </ul>
              )}
            </div>
            <div>
              <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md">
                <img src={imageUrl} alt="DP Console" className="w-full h-full object-cover" />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">Always maintain situational awareness</p>
            </div>
          </div>
        </Section>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson22")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            &larr; Previous Lesson (22)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson24")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            Next Lesson (24) &rarr;
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