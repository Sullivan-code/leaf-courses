"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey =
  | "story"
  | "conditionalGrammar"
  | "conditionalExercises"
  | "fillBlanks";

export default function LessonSafetyOfficer() {
  const router = useRouter();

  // Estados para abrir/fechar seções
  const [openSections, setOpenSections] = useState({
    story: true,
    conditionalGrammar: false,
    conditionalExercises: false,
    fillBlanks: false,
  });

  // Estados para tradução da história (cada estrofe tem seu próprio toggle)
  const [showTranslation, setShowTranslation] = useState<Record<number, boolean>>({});

  // Estados para exercícios de condicionais
  const [conditionalAnswers, setConditionalAnswers] = useState<Record<number, string>>({});
  const [conditionalResults, setConditionalResults] = useState<Record<number, boolean>>({});
  const [showConditionalResults, setShowConditionalResults] = useState<Record<number, boolean>>({});

  // Estados para exercícios de preencher lacunas (drag & drop simplificado)
  const [blankAnswers, setBlankAnswers] = useState<Record<number, string>>({});
  const [blankResults, setBlankResults] = useState<Record<number, boolean>>({});
  const [showBlankResults, setShowBlankResults] = useState<Record<number, boolean>>({});

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleTranslation = (index: number) => {
    setShowTranslation((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // ==========================================
  // Native Browser Speech Synthesis (Female American English voice)
  // ==========================================
  const speakText = (text: string) => {
    if (!text) return;

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      const setVoiceAndSpeak = () => {
        const voices = window.speechSynthesis.getVoices();
        const femaleVoice =
          voices.find(
            (voice) =>
              voice.lang === "en-US" &&
              (voice.name.includes("Samantha") ||
                voice.name.includes("Google UK Female") ||
                voice.name.includes("Female") ||
                voice.name.includes("Ellen") ||
                voice.name.includes("Susan"))
          ) || voices.find((voice) => voice.lang === "en-US");

        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
        window.speechSynthesis.speak(utterance);
      };

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setVoiceAndSpeak();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
      }
    }
  };

  // Imagens
  const safetyImage =
    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const offshorePlatformImage =
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const portImage =
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

  // ==========================================
  // HISTÓRIA INTERATIVA (com tradução oculta)
  // ==========================================
  const storyStanzas = [
    {
      english:
        "Every morning, I arrive at the port and put on my PPE. I check my hard hat, safety vest, and steel-toe boots before walking to the main gate.",
      portuguese:
        "Todas as manhãs, chego ao porto e coloco meu EPI. Verifico meu capacete, colete de segurança e botas com biqueira de aço antes de caminhar até o portão principal.",
    },
    {
      english:
        "The first thing I do is conduct a safety inspection of the loading area. I look for hazards such as oil spills, damaged equipment, or unsafe stacking of cargo.",
      portuguese:
        "A primeira coisa que faço é realizar uma inspeção de segurança na área de carga. Procuro por perigos como vazamentos de óleo, equipamentos danificados ou empilhamento inseguro de carga.",
    },
    {
      english:
        "Today, I notice that a crane operator is lifting a container without using the proper slings. This is a serious violation. I immediately stop the operation and talk to the operator.",
      portuguese:
        "Hoje, percebo que um operador de guindaste está levantando um contêiner sem usar as lingas adequadas. Isso é uma violação grave. Imediatamente paro a operação e falo com o operador.",
    },
    {
      english:
        "The operator tells me that he is in a hurry because the ship is about to leave. I understand the pressure, but safety comes first. I explain the risks and show him the correct procedure.",
      portuguese:
        "O operador me diz que está com pressa porque o navio está prestes a partir. Entendo a pressão, mas a segurança vem em primeiro lugar. Explico os riscos e mostro a ele o procedimento correto.",
    },
    {
      english:
        "After that, I conduct a toolbox talk with the whole team. We discuss the importance of following safety procedures and reporting any unsafe conditions immediately.",
      portuguese:
        "Depois disso, realizo um diálogo de segurança com toda a equipe. Discutimos a importância de seguir os procedimentos de segurança e relatar qualquer condição insegura imediatamente.",
    },
    {
      english:
        "Later in the day, I investigate a near miss that was reported by a worker. A pallet fell from a forklift, but no one was hurt. I interview the workers and inspect the forklift to find the root cause.",
      portuguese:
        "Mais tarde, investigo um quase-acidente relatado por um trabalhador. Um palete caiu de uma empilhadeira, mas ninguém se machucou. Entrevisto os trabalhadores e inspeciono a empilhadeira para encontrar a causa raiz.",
    },
    {
      english:
        "At the end of the day, I write my safety report and send it to the supervisor. I also plan the inspections for the next day. I feel proud because I know that my work prevents accidents and saves lives.",
      portuguese:
        "No final do dia, escrevo meu relatório de segurança e o envio ao supervisor. Também planejo as inspeções para o dia seguinte. Sinto orgulho porque sei que meu trabalho previne acidentes e salva vidas.",
    },
  ];

  // ==========================================
  // GRAMÁTICA DOS CONDICIONAIS
  // ==========================================
  const conditionalGrammar = {
    first: {
      title: "First Conditional (Real Possibility)",
      structure: "If + present simple, will + infinitive",
      explanation:
        "We use the First Conditional to talk about real and possible situations in the future. If the condition is met, the result is likely to happen.",
      examples: [
        {
          english: "If you wear your PPE, you will be protected.",
          portuguese: "Se você usar seu EPI, você estará protegido.",
        },
        {
          english: "If the operator stops the crane, we will inspect the slings.",
          portuguese: "Se o operador parar o guindaste, nós inspecionaremos as lingas.",
        },
        {
          english: "If you report the hazard, I will write a report.",
          portuguese: "Se você relatar o perigo, eu escreverei um relatório.",
        },
      ],
    },
    second: {
      title: "Second Conditional (Unreal or Hypothetical)",
      structure: "If + past simple, would + infinitive",
      explanation:
        "We use the Second Conditional to talk about imaginary, hypothetical situations that are unlikely or impossible in the present.",
      examples: [
        {
          english: "If I were the Safety Officer, I would stop that operation.",
          portuguese: "Se eu fosse o Oficial de Segurança, eu pararia essa operação.",
        },
        {
          english: "If we had more time, we would inspect every container.",
          portuguese: "Se tivéssemos mais tempo, inspecionaríamos todos os contêineres.",
        },
        {
          english: "If the weather were better, we would load the cargo faster.",
          portuguese: "Se o clima fosse melhor, carregaríamos a carga mais rápido.",
        },
      ],
    },
    third: {
      title: "Third Conditional (Unreal Past - Missed Opportunities)",
      structure: "If + past perfect, would have + past participle",
      explanation:
        "We use the Third Conditional to talk about past situations that did not happen. It expresses regret or a missed opportunity.",
      examples: [
        {
          english: "If the worker had worn his harness, he wouldn't have fallen.",
          portuguese: "Se o trabalhador tivesse usado seu cinto de segurança, ele não teria caído.",
        },
        {
          english: "If the supervisor had checked the permit, the accident would have been avoided.",
          portuguese: "Se o supervisor tivesse verificado a permissão, o acidente teria sido evitado.",
        },
        {
          english: "If we had inspected the crane yesterday, we would have found the defect.",
          portuguese: "Se tivéssemos inspecionado o guindaste ontem, teríamos encontrado o defeito.",
        },
      ],
    },
  };

  // ==========================================
  // EXERCÍCIOS DE CONDICIONAIS (arrastar/soltar via clique)
  // ==========================================
  const conditionalExercises = [
    {
      id: 1,
      question: "If you ______ your PPE, you will be protected.",
      options: ["wear", "wore", "had worn"],
      correct: "wear",
      type: "first",
    },
    {
      id: 2,
      question: "If I ______ the Safety Officer, I would stop that operation.",
      options: ["am", "were", "had been"],
      correct: "were",
      type: "second",
    },
    {
      id: 3,
      question: "If the operator ______ the crane, we would inspect the slings.",
      options: ["stops", "stopped", "had stopped"],
      correct: "stopped",
      type: "second",
    },
    {
      id: 4,
      question: "If the worker ______ his harness, he wouldn't have fallen.",
      options: ["wore", "had worn", "wear"],
      correct: "had worn",
      type: "third",
    },
    {
      id: 5,
      question: "If we ______ more time, we would inspect every container.",
      options: ["have", "had", "had had"],
      correct: "had",
      type: "second",
    },
    {
      id: 6,
      question: "If you ______ the hazard, I will write a report.",
      options: ["report", "reported", "had reported"],
      correct: "report",
      type: "first",
    },
  ];

  // ==========================================
  // EXERCÍCIO DE PREENCHER LACUNAS (drag & drop simplificado)
  // ==========================================
  const fillBlanksExercises = [
    {
      id: 1,
      sentence:
        "If the Safety Officer _______ a hazard, he must report it immediately.",
      correct: "identifies",
      hint: "Present Simple (he/she/it + s)",
    },
    {
      id: 2,
      sentence:
        "If I _______ the supervisor, I would approve the permit.",
      correct: "were",
      hint: "Use the correct form of 'to be' for Second Conditional",
    },
    {
      id: 3,
      sentence:
        "If the workers _______ their PPE, they would be safe.",
      correct: "wore",
      hint: "Second Conditional - past tense",
    },
    {
      id: 4,
      sentence:
        "If the operator _______ the slings, the accident wouldn't have happened.",
      correct: "had used",
      hint: "Third Conditional - past perfect",
    },
    {
      id: 5,
      sentence:
        "If you _______ to the safety briefing, you will understand the procedures.",
      correct: "listen",
      hint: "First Conditional - present simple",
    },
  ];

  const handleConditionalSelect = (id: number, value: string) => {
    setConditionalAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const checkConditional = (id: number) => {
    const exercise = conditionalExercises.find((ex) => ex.id === id);
    if (!exercise) return;
    const isCorrect = conditionalAnswers[id] === exercise.correct;
    setConditionalResults((prev) => ({ ...prev, [id]: isCorrect }));
    setShowConditionalResults((prev) => ({ ...prev, [id]: true }));
  };

  const handleBlankChange = (id: number, value: string) => {
    setBlankAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const checkBlank = (id: number) => {
    const exercise = fillBlanksExercises.find((ex) => ex.id === id);
    if (!exercise) return;
    const isCorrect = blankAnswers[id]?.toLowerCase().trim() === exercise.correct.toLowerCase();
    setBlankResults((prev) => ({ ...prev, [id]: isCorrect }));
    setShowBlankResults((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${offshorePlatformImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* Título central */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🦺 Safety Officer — Interactive Story & Conditionals
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Read the story, learn about conditionals, and practice with
            interactive exercises. Click on any English text to hear the
            pronunciation.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={safetyImage}
              alt="Safety Officer on site"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            💡 Clique nas estrofes da história para mostrar/ocultar a tradução.
          </p>
        </div>

        {/* ========================================== */}
        {/* SEÇÃO 1: HISTÓRIA INTERATIVA */}
        {/* ========================================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📖 A Day in the Life of a Safety Officer at the Port</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada estrofe para ouvir e ver a tradução
              </p>
            </div>
            <button
              onClick={() => toggleSection("story")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openSections.story ? "Hide Story" : "Show Story"}
            </button>
          </div>

          {openSections.story && (
            <div className="p-8 space-y-6">
              {storyStanzas.map((stanza, index) => (
                <div
                  key={index}
                  className="border border-blue-100 rounded-xl p-5 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => toggleTranslation(index)}
                >
                  <div
                    className="text-lg text-gray-800 leading-relaxed"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(stanza.english);
                    }}
                  >
                    {stanza.english}
                  </div>

                  {/* Botão e tradução oculta */}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-blue-500 font-medium">
                      {showTranslation[index] ? "🔼 Ocultar tradução" : "🔽 Clique para ver tradução"}
                    </span>
                  </div>
                  {showTranslation[index] && (
                    <div className="mt-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 animate-fadeIn">
                      <p className="text-gray-700 text-base">{stanza.portuguese}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SEÇÃO 2: GRAMÁTICA DOS CONDICIONAIS */}
        {/* ========================================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">📘 Conditional Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                First, Second, and Third Conditionals — clique nos exemplos para ouvir
              </p>
            </div>
            <button
              onClick={() => toggleSection("conditionalGrammar")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openSections.conditionalGrammar ? "Hide Grammar" : "Show Grammar"}
            </button>
          </div>

          {openSections.conditionalGrammar && (
            <div className="p-8 space-y-8">
              {/* First Conditional */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-green-700">
                  {conditionalGrammar.first.title}
                </h3>
                <p className="text-sm text-green-600 font-mono mt-1">
                  {conditionalGrammar.first.structure}
                </p>
                <p className="text-gray-700 mt-3">
                  {conditionalGrammar.first.explanation}
                </p>
                <div className="mt-4 space-y-2">
                  {conditionalGrammar.first.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-lg border border-green-200 cursor-pointer hover:bg-green-50 transition-colors"
                      onClick={() => speakText(ex.english)}
                    >
                      <p className="text-green-800 font-medium">{ex.english}</p>
                      <p className="text-sm text-gray-600">{ex.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Conditional */}
              <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                <h3 className="text-xl font-bold text-yellow-700">
                  {conditionalGrammar.second.title}
                </h3>
                <p className="text-sm text-yellow-600 font-mono mt-1">
                  {conditionalGrammar.second.structure}
                </p>
                <p className="text-gray-700 mt-3">
                  {conditionalGrammar.second.explanation}
                </p>
                <div className="mt-4 space-y-2">
                  {conditionalGrammar.second.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-50 transition-colors"
                      onClick={() => speakText(ex.english)}
                    >
                      <p className="text-yellow-800 font-medium">{ex.english}</p>
                      <p className="text-sm text-gray-600">{ex.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Third Conditional */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="text-xl font-bold text-red-700">
                  {conditionalGrammar.third.title}
                </h3>
                <p className="text-sm text-red-600 font-mono mt-1">
                  {conditionalGrammar.third.structure}
                </p>
                <p className="text-gray-700 mt-3">
                  {conditionalGrammar.third.explanation}
                </p>
                <div className="mt-4 space-y-2">
                  {conditionalGrammar.third.examples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                      onClick={() => speakText(ex.english)}
                    >
                      <p className="text-red-800 font-medium">{ex.english}</p>
                      <p className="text-sm text-gray-600">{ex.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SEÇÃO 3: EXERCÍCIOS DE CONDICIONAIS (clique para escolher) */}
        {/* ========================================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✏️ Conditional Exercises</h2>
              <p className="mt-2 text-blue-100 italic">
                Escolha a opção correta para completar cada frase
              </p>
            </div>
            <button
              onClick={() => toggleSection("conditionalExercises")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openSections.conditionalExercises ? "Hide Exercises" : "Show Exercises"}
            </button>
          </div>

          {openSections.conditionalExercises && (
            <div className="p-8 space-y-6">
              {conditionalExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="border border-blue-200 rounded-xl p-5 bg-blue-50/30"
                >
                  <p className="text-gray-800 text-lg font-medium">
                    {ex.question.replace("______", "________")}
                  </p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    {ex.options.map((opt) => (
                      <button
                        key={opt}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          conditionalAnswers[ex.id] === opt
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white border-blue-300 hover:bg-blue-100"
                        }`}
                        onClick={() => handleConditionalSelect(ex.id, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      onClick={() => checkConditional(ex.id)}
                    >
                      Verificar
                    </button>
                    <span className="text-sm text-gray-500">
                      {ex.type === "first" && "🔵 First Conditional"}
                      {ex.type === "second" && "🟡 Second Conditional"}
                      {ex.type === "third" && "🔴 Third Conditional"}
                    </span>
                  </div>
                  {showConditionalResults[ex.id] && (
                    <div
                      className={`mt-3 p-3 rounded-lg border ${
                        conditionalResults[ex.id]
                          ? "bg-green-100 border-green-300"
                          : "bg-red-100 border-red-300"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          conditionalResults[ex.id] ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {conditionalResults[ex.id]
                          ? "✅ Correct!"
                          : `❌ Incorrect. The correct answer is: "${ex.correct}"`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================== */}
        {/* SEÇÃO 4: PREENCHER LACUNAS (digitar resposta) */}
        {/* ========================================== */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">✍️ Fill in the Blanks</h2>
              <p className="mt-2 text-blue-100 italic">
                Digite a palavra correta para completar cada frase
              </p>
            </div>
            <button
              onClick={() => toggleSection("fillBlanks")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openSections.fillBlanks ? "Hide Exercise" : "Show Exercise"}
            </button>
          </div>

          {openSections.fillBlanks && (
            <div className="p-8 space-y-6">
              {fillBlanksExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="border border-blue-200 rounded-xl p-5 bg-blue-50/30"
                >
                  <p className="text-gray-800 text-lg font-medium">
                    {ex.sentence.replace("_______", "________")}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <input
                      type="text"
                      value={blankAnswers[ex.id] || ""}
                      onChange={(e) => handleBlankChange(ex.id, e.target.value)}
                      className="flex-1 min-w-[150px] px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Digite sua resposta..."
                    />
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                      onClick={() => checkBlank(ex.id)}
                    >
                      Verificar
                    </button>
                  </div>
                  <p className="text-sm text-blue-500 mt-2">💡 Dica: {ex.hint}</p>
                  {showBlankResults[ex.id] && (
                    <div
                      className={`mt-3 p-3 rounded-lg border ${
                        blankResults[ex.id]
                          ? "bg-green-100 border-green-300"
                          : "bg-red-100 border-red-300"
                      }`}
                    >
                      <p
                        className={`font-medium ${
                          blankResults[ex.id] ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {blankResults[ex.id]
                          ? "✅ Correct!"
                          : `❌ Incorrect. The correct answer is: "${ex.correct}"`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navegação */}
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
            Next Lesson (15!) &rarr;
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}