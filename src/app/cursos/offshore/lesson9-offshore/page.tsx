"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey =
  | "verbs"
  | "vocabulary"
  | "reading"
  | "skills"
  | "education"
  | "grammar"
  | "conversation"
  | "practice";

export default function LessonSafetyOfficer() {
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
      [section]: !openDrills[section],
    });
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

  // Imagens (segurança offshore)
  const safetyImage =
    "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const offshorePlatformImage =
    "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const inspectionImage =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const ppeImage =
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const controlRoomImage =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
  const constructionImage =
    "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

  // Verbos
  const verbs = [
    {
      english: "inspect",
      portuguese: "inspecionar",
      example: "Safety officers inspect the work area daily.",
    },
    {
      english: "monitor",
      portuguese: "monitorar",
      example: "They monitor compliance with safety procedures.",
    },
    {
      english: "enforce",
      portuguese: "fazer cumprir",
      example: "Officers enforce safety rules on site.",
    },
    {
      english: "investigate",
      portuguese: "investigar",
      example: "They investigate incidents and near misses.",
    },
    {
      english: "report",
      portuguese: "relatar",
      example: "Safety officers report unsafe conditions immediately.",
    },
    {
      english: "prevent",
      portuguese: "prevenir",
      example: "Good training helps prevent accidents.",
    },
    {
      english: "assess",
      portuguese: "avaliar",
      example: "They assess risks before starting any operation.",
    },
    {
      english: "control",
      portuguese: "controlar",
      example: "Officers control hazards with protective measures.",
    },
    {
      english: "train",
      portuguese: "treinar",
      example: "They train workers on emergency procedures.",
    },
    {
      english: "document",
      portuguese: "documentar",
      example: "All safety inspections must be documented.",
    },
    {
      english: "audit",
      portuguese: "auditar",
      example: "External auditors review the safety management system.",
    },
    {
      english: "respond",
      portuguese: "responder",
      example: "The team responds quickly to any emergency.",
    },
  ];

  // Vocabulário
  const vocabulary = [
    { english: "hazard", portuguese: "perigo / risco" },
    { english: "risk assessment", portuguese: "avaliação de risco" },
    { english: "PPE (Personal Protective Equipment)", portuguese: "EPI" },
    { english: "safety procedure", portuguese: "procedimento de segurança" },
    { english: "work permit", portuguese: "permissão de trabalho" },
    { english: "toolbox talk", portuguese: "diálogo de segurança (DDS)" },
    { english: "incident", portuguese: "incidente" },
    { english: "near miss", portuguese: "quase-acidente" },
    { english: "emergency drill", portuguese: "simulado de emergência" },
    { english: "muster point", portuguese: "ponto de encontro" },
    { english: "unsafe condition", portuguese: "condição insegura" },
    { english: "unsafe act", portuguese: "ato inseguro" },
    { english: "fire extinguisher", portuguese: "extintor de incêndio" },
    { english: "first aid", portuguese: "primeiros socorros" },
    { english: "Lockout/Tagout (LOTO)", portuguese: "bloqueio e etiquetagem" },
    { english: "confined space", portuguese: "espaço confinado" },
    { english: "working at height", portuguese: "trabalho em altura" },
    { english: "hot work", portuguese: "trabalho a quente" },
    { english: "environmental protection", portuguese: "proteção ambiental" },
    { english: "safety culture", portuguese: "cultura de segurança" },
  ];

  // Speak Like a Native
  const speakLikeNative = [
    {
      incorrect: "I check if everything is safe.",
      correct: "I conduct regular safety inspections to identify hazards.",
    },
    {
      incorrect: "The worker didn't use the equipment.",
      correct: "The worker failed to wear the required PPE.",
    },
    {
      incorrect: "There was a small accident.",
      correct: "We recorded a near miss and investigated the root cause.",
    },
    {
      incorrect: "I told them to be careful.",
      correct: "I delivered a toolbox talk on working at height.",
    },
    {
      incorrect: "The operation is risky.",
      correct: "We performed a risk assessment and implemented control measures.",
    },
  ];

  const usefulExpressions = [
    "Let's begin the safety inspection.",
    "Please wear your PPE at all times.",
    "This area requires a work permit.",
    "Stop all operations immediately.",
    "We need to conduct a risk assessment.",
    "Report any unsafe condition to the supervisor.",
    "The muster point is near the main gate.",
    "Emergency drills are mandatory every month.",
    "Safety is everyone's responsibility.",
    "We must follow the LOTO procedure before maintenance.",
  ];

  // Gramática - Present Simple
  const presentSimpleExamples = [
    {
      english: "I inspect the work area every morning.",
      portuguese: "Eu inspeciono a área de trabalho toda manhã.",
    },
    {
      english: "She monitors the workers' compliance.",
      portuguese: "Ela monitora a conformidade dos trabalhadores.",
    },
    {
      english: "The team reports incidents immediately.",
      portuguese: "A equipe relata incidentes imediatamente.",
    },
    {
      english: "Safety officers enforce the company's rules.",
      portuguese: "Os oficiais de segurança fazem cumprir as regras da empresa.",
    },
  ];

  const presentSimpleNegative = [
    {
      english: "The officer doesn't ignore safety violations.",
      portuguese: "O oficial não ignora violações de segurança.",
    },
    {
      english: "Workers don't enter confined spaces without a permit.",
      portuguese: "Os trabalhadores não entram em espaços confinados sem permissão.",
    },
  ];

  const presentSimpleQuestions = [
    {
      english: "Do you conduct daily inspections?",
      portuguese: "Você realiza inspeções diárias?",
    },
    {
      english: "Does the supervisor approve all work permits?",
      portuguese: "O supervisor aprova todas as permissões de trabalho?",
    },
  ];

  const mustExamples = [
    {
      english: "Safety officers must follow strict procedures.",
      portuguese: "Os oficiais de segurança devem seguir procedimentos rigorosos.",
    },
    {
      english: "Workers must wear PPE at all times.",
      portuguese: "Os trabalhadores devem usar EPI o tempo todo.",
    },
    {
      english: "You must report any near miss immediately.",
      portuguese: "Você deve relatar qualquer quase-acidente imediatamente.",
    },
    {
      english: "Everyone must attend the emergency drills.",
      portuguese: "Todos devem participar dos simulados de emergência.",
    },
  ];

  // Conversa
  const conversation = [
    {
      speaker: "Safety Officer:",
      line: "Good morning. I'm here to conduct a routine inspection.",
      translation: "Bom dia. Estou aqui para realizar uma inspeção de rotina.",
    },
    {
      speaker: "Worker:",
      line: "Good morning. Everything is fine here.",
      translation: "Bom dia. Está tudo bem aqui.",
    },
    {
      speaker: "Safety Officer:",
      line: "I noticed some equipment left in the walkway. That's a tripping hazard.",
      translation: "Notei alguns equipamentos deixados na passarela. Isso é um risco de tropeço.",
    },
    {
      speaker: "Worker:",
      line: "I'm sorry. I'll move it right away.",
      translation: "Desculpe. Vou mover imediatamente.",
    },
    {
      speaker: "Safety Officer:",
      line: "And make sure you wear your hard hat and safety glasses.",
      translation: "E certifique-se de usar seu capacete e óculos de segurança.",
    },
    {
      speaker: "Worker:",
      line: "Yes, sir. I'll follow all the safety procedures.",
      translation: "Sim, senhor. Seguirei todos os procedimentos de segurança.",
    },
  ];

  // Exercícios
  const practiceFillBlanks = [
    {
      sentence: "Safety officers __________ the work area daily.",
      answer: "inspect",
    },
    {
      sentence: "Workers __________ wear PPE at all times.",
      answer: "must",
    },
    {
      sentence: "The team __________ incidents and near misses.",
      answer: "investigates",
    },
    {
      sentence: "We __________ a risk assessment before starting work.",
      answer: "conduct",
    },
    {
      sentence: "Good training __________ accidents.",
      answer: "prevents",
    },
  ];

  const practiceTranslate = [
    {
      english: "I inspect the work area every morning.",
      portuguese: "Eu inspeciono a área de trabalho toda manhã.",
    },
    {
      english: "Workers must wear PPE at all times.",
      portuguese: "Os trabalhadores devem usar EPI o tempo todo.",
    },
    {
      english: "We report unsafe conditions to the supervisor.",
      portuguese: "Nós relatamos condições inseguras ao supervisor.",
    },
    {
      english: "They conduct toolbox talks every day.",
      portuguese: "Eles realizam diálogos de segurança todos os dias.",
    },
    {
      english: "Safety is everyone's responsibility.",
      portuguese: "A segurança é responsabilidade de todos.",
    },
  ];

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
        {/* Título central com imagem */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🦺 Lesson: The Safety Officer — Roles & Responsibilities
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about the daily duties of a Safety Officer in the
            offshore industry, construction, and more. Master professional HSE
            vocabulary and communication skills.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={safetyImage}
              alt="Safety Officer on site"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
          <p className="text-sm text-gray-500 mt-4 italic">
            💡 Clique em qualquer texto em inglês para ouvir a pronúncia com voz feminina nativa.
          </p>
        </div>

        {/* Seção 1 - Verbos */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Essential verbs for Safety Officers — clique nos verbos e exemplos para ouvir
              </p>
            </div>
            <button
              onClick={() => toggleDrill("verbs")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-3 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {verbs.map((verb, index) => (
                <li key={index} className="flex flex-col">
                  <div>
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:underline"
                      onClick={() => speakText(verb.english)}
                    >
                      {verb.english}
                    </span>{" "}
                    = {verb.portuguese}
                  </div>
                  <span
                    className="text-sm italic text-gray-500 ml-4 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                    onClick={() => speakText(verb.example)}
                  >
                    "{verb.example}"
                  </span>
                </li>
              ))}
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {verbs.map((verb, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => speakText(verb.example)}
                  >
                    <p className="text-lg font-medium text-gray-800">
                      {index + 1}. <span className="text-blue-600 font-bold">{verb.english}</span> — {verb.example}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{verb.portuguese}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Vocabulary</h2>
              <p className="mt-2 text-blue-100 italic">
                Technical HSE terms every Safety Officer must know — clique nas palavras em inglês
              </p>
            </div>
            <button
              onClick={() => toggleDrill("vocabulary")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
              {vocabulary.map((word, index) => (
                <li key={index}>
                  <span
                    className="text-blue-600 font-bold cursor-pointer hover:underline"
                    onClick={() => speakText(word.english)}
                  >
                    {word.english}
                  </span>{" "}
                  = {word.portuguese}
                </li>
              ))}
            </ul>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                {vocabulary.map((word, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-xl border border-blue-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => speakText(word.english)}
                  >
                    <p className="text-lg font-medium text-gray-800">
                      <span className="text-blue-600 font-bold">{word.english}</span> — {word.portuguese}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Reading (REALINHADO) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Reading</h2>
              <p className="mt-2 text-blue-100 italic">
                What does a Safety Officer actually do? — clique nos parágrafos para ouvir
              </p>
            </div>
            <button
              onClick={() => toggleDrill("reading")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.reading ? "Hide Translation" : "Show Translation"}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-6">
                <h3 className="text-xl font-bold text-blue-600 mb-4">
                  The Safety Officer's Daily Routine
                </h3>

                <p
                  className="text-lg text-gray-700 leading-relaxed cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "A Safety Officer starts the day by conducting a walk-through inspection of the work area. They identify hazards, check if workers are wearing the correct PPE, and ensure all equipment is safe to use."
                    )
                  }
                >
                  A <span className="text-blue-600 font-bold">Safety Officer</span> starts the day by conducting a
                  walk-through inspection of the work area. They identify{" "}
                  <span className="text-blue-600 font-bold">hazards</span>, check if workers are wearing the correct{" "}
                  <span className="text-blue-600 font-bold">PPE</span>, and ensure all equipment is safe to use.
                </p>

                <p
                  className="text-lg text-gray-700 leading-relaxed cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "During the day, they monitor operations, conduct toolbox talks, and review work permits for high-risk activities like hot work or confined space entry."
                    )
                  }
                >
                  During the day, they <span className="text-blue-600 font-bold">monitor</span> operations,{" "}
                  <span className="text-blue-600 font-bold">conduct toolbox talks</span>, and review{" "}
                  <span className="text-blue-600 font-bold">work permits</span> for high-risk activities like hot work
                  or confined space entry.
                </p>

                <p
                  className="text-lg text-gray-700 leading-relaxed cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "If an incident occurs, the Safety Officer investigates the cause, writes a report, and recommends corrective actions. They also train workers on emergency procedures and enforce the company's safety rules."
                    )
                  }
                >
                  If an incident occurs, the Safety Officer <span className="text-blue-600 font-bold">investigates</span>{" "}
                  the cause, writes a report, and recommends corrective actions. They also{" "}
                  <span className="text-blue-600 font-bold">train</span> workers on emergency procedures and{" "}
                  <span className="text-blue-600 font-bold">enforce</span> the company's safety rules.
                </p>
              </div>

              <div className="md:w-1/2">
                <div className="relative h-64 w-full">
                  <img
                    src={inspectionImage}
                    alt="Safety inspection"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  Safety Officer inspecting a work site
                </p>
                {openDrills.reading && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-3">
                      <p>
                        Um Oficial de Segurança começa o dia realizando uma inspeção de caminhada na área de trabalho.
                        Ele identifica perigos, verifica se os trabalhadores estão usando o EPI correto e garante que
                        todos os equipamentos estejam seguros para uso.
                      </p>
                      <p>
                        Durante o dia, ele monitora as operações, realiza diálogos de segurança e revisa as permissões
                        de trabalho para atividades de alto risco, como trabalho a quente ou entrada em espaços
                        confinados.
                      </p>
                      <p>
                        Se ocorrer um incidente, o Oficial de Segurança investiga a causa, escreve um relatório e
                        recomenda ações corretivas. Ele também treina os trabalhadores em procedimentos de emergência e
                        faz cumprir as regras de segurança da empresa.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 4 - Skills */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Skills for Safety Officers</h2>
              <p className="mt-2 text-blue-100 italic">
                What does it take to become a great Safety Officer? — clique nas habilidades
              </p>
            </div>
            <button
              onClick={() => toggleDrill("skills")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.skills ? "Hide Translation" : "Show Translation"}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="relative h-64 w-full">
                  <img
                    src={ppeImage}
                    alt="PPE and safety equipment"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  PPE and safety equipment inspection
                </p>
              </div>
              <div className="md:w-1/2">
                <h3 className="text-xl font-bold text-blue-600 mb-4">
                  Key Skills & Qualities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "Excellent communication",
                    "Good English (offshore standard)",
                    "Knowledge of safety regulations (NRs, ISO, etc.)",
                    "Risk assessment skills",
                    "Leadership and authority",
                    "Problem-solving ability",
                    "Calm under pressure",
                    "Teamwork",
                    "Attention to detail",
                    "Empathy and patience",
                  ].map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 hover:bg-blue-100 p-2 rounded-lg text-sm transition-colors cursor-pointer"
                      onClick={() => speakText(skill)}
                    >
                      ✅ {skill}
                    </div>
                  ))}
                </div>
                {openDrills.skills && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-1">
                      <p>Excelente comunicação</p>
                      <p>Bom inglês (padrão offshore)</p>
                      <p>Conhecimento de normas de segurança (NRs, ISO, etc.)</p>
                      <p>Habilidade em avaliação de riscos</p>
                      <p>Liderança e autoridade</p>
                      <p>Capacidade de resolver problemas</p>
                      <p>Calma sob pressão</p>
                      <p>Trabalho em equipe</p>
                      <p>Atenção aos detalhes</p>
                      <p>Empatia e paciência</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 5 - Education & Companies */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Education, Certifications & Companies</h2>
              <p className="mt-2 text-blue-100 italic">
                How to start and where to work in Brazil
              </p>
            </div>
            <button
              onClick={() => toggleDrill("education")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.education ? "Hide Translation" : "Show Translation"}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-2/3">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-600 text-lg mb-2">📘 Education & Certifications</h4>
                  <ul className="space-y-2 text-gray-700 list-disc pl-6">
                    <li>
                      <span className="font-bold">Technical course</span> in
                      Occupational Safety (Técnico em Segurança do Trabalho) —
                      mandatory for most roles.
                    </li>
                    <li>
                      <span className="font-bold">Higher education</span> in
                      Engineering, Safety Engineering, or related fields
                      (differential).
                    </li>
                    <li>
                      <span className="font-bold">Offshore certifications</span>:{" "}
                      BOSIET, HUET, medical certificate.
                    </li>
                    <li>
                      <span className="font-bold">NR-10</span> (Electrical
                      Safety), <span className="font-bold">NR-35</span> (Working
                      at Height), <span className="font-bold">NR-33</span>{" "}
                      (Confined Space).
                    </li>
                    <li>
                      <span className="font-bold">English proficiency</span> —
                      intermediate to advanced for offshore and multinational
                      companies.
                    </li>
                  </ul>

                  <h4 className="font-bold text-blue-600 text-lg mt-6 mb-2">🏢 Major Companies in Brazil</h4>
                  <ul className="space-y-2 text-gray-700 list-disc pl-6">
                    <li>
                      <span className="font-bold">Petrobras</span> — the largest
                      oil & gas company in Brazil, with many offshore
                      opportunities.
                    </li>
                    <li>
                      <span className="font-bold">SBM Offshore</span> — FPSO
                      operator with a strong presence in Brazilian waters.
                    </li>
                    <li>
                      <span className="font-bold">Modec</span> — another major
                      FPSO operator.
                    </li>
                    <li>
                      <span className="font-bold">TechnipFMC</span> — subsea
                      engineering and construction.
                    </li>
                    <li>
                      <span className="font-bold">Baker Hughes, Halliburton, Schlumberger</span>{" "}
                      — service companies that hire Safety Officers.
                    </li>
                    <li>
                      <span className="font-bold">Construction & civil</span> —{" "}
                      large infrastructure projects (ports, bridges, tunnels)
                      also need Safety Officers.
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={offshorePlatformImage}
                    alt="Offshore platform"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  Offshore platforms are major employers of Safety Officers
                </p>
                {openDrills.education && (
                  <div className="mt-4 bg-blue-50 rounded-2xl p-6 animate-fadeIn">
                    <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                    <div className="text-gray-700 space-y-2 text-sm">
                      <p>
                        <span className="font-bold">Educação e Certificações</span>
                      </p>
                      <ul className="list-disc pl-4">
                        <li>
                          Curso técnico em Segurança do Trabalho — obrigatório
                          para a maioria das funções.
                        </li>
                        <li>
                          Graduação em Engenharia, Engenharia de Segurança ou
                          áreas afins (diferencial).
                        </li>
                        <li>Certificações offshore: BOSIET, HUET, atestado médico.</li>
                        <li>NR-10, NR-35, NR-33.</li>
                        <li>
                          Inglês intermediário a avançado para empresas
                          offshore e multinacionais.
                        </li>
                      </ul>
                      <p className="mt-2">
                        <span className="font-bold">Empresas no Brasil</span>
                      </p>
                      <ul className="list-disc pl-4">
                        <li>Petrobras, SBM Offshore, Modec, TechnipFMC, Baker Hughes, Halliburton, Schlumberger.</li>
                        <li>Construção civil: grandes projetos de infraestrutura (portos, pontes, túneis).</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Speak Like a Native */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Speak Like a Native</h2>
            <p className="mt-2 text-blue-100 italic">
              Professional HSE communication — clique nas frases para ouvir
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-4 rounded-xl">
                <h4 className="font-bold text-red-600 mb-2">❌ Instead of saying...</h4>
                <div className="space-y-3 text-gray-700">
                  {speakLikeNative.map((item, index) => (
                    <p
                      key={index}
                      className="text-red-600 font-bold cursor-pointer hover:underline"
                      onClick={() => speakText(item.incorrect)}
                    >
                      {item.incorrect}
                    </p>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <h4 className="font-bold text-green-600 mb-2">✅ Say:</h4>
                <div className="space-y-3 text-gray-700">
                  {speakLikeNative.map((item, index) => (
                    <p
                      key={index}
                      className="text-green-600 font-bold cursor-pointer hover:underline"
                      onClick={() => speakText(item.correct)}
                    >
                      {item.correct}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-bold text-blue-600 mb-4">Useful HSE Expressions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {usefulExpressions.map((expr, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-left transition-colors text-blue-700 font-medium cursor-pointer"
                    onClick={() => speakText(expr)}
                  >
                    {expr}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Seção 7 - Grammar */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Present Simple for routines & Modal Verb Must — clique nos exemplos
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setShowGrammarExplanation(!showGrammarExplanation)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
              >
                {showGrammarExplanation ? "Hide Present Simple" : "Show Present Simple"}
              </button>
              <button
                onClick={() => setShowMustExplanation(!showMustExplanation)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
              >
                {showMustExplanation ? "Hide Must" : "Show Must"}
              </button>
            </div>
          </div>

          <div className="p-8">
            {showGrammarExplanation && (
              <div className="bg-blue-50 p-6 rounded-xl mb-6 animate-fadeIn">
                <h3 className="font-bold text-blue-600 text-lg mb-3">📘 Present Simple — Routines & Responsibilities</h3>
                <p className="text-gray-700 mb-4">
                  We use the Present Simple to describe daily routines, facts, and responsibilities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-blue-600">Structure</h4>
                    <p className="text-gray-700">Subject + Verb + Complement</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleExamples.map((ex, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => speakText(ex.english)}
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-600">Negative</h4>
                    <p className="text-gray-700">Subject + do/does + not + verb</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleNegative.map((ex, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => speakText(ex.english)}
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </div>
                      ))}
                    </div>
                    <h4 className="font-bold text-blue-600 mt-4">Questions</h4>
                    <p className="text-gray-700">Do/Does + Subject + Verb?</p>
                    <div className="mt-2 space-y-2">
                      {presentSimpleQuestions.map((ex, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => speakText(ex.english)}
                        >
                          <span className="text-blue-600 font-bold">{ex.english}</span>
                          <br />
                          <span className="text-sm text-gray-600">{ex.portuguese}</span>
                        </div>
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
                  <span className="font-bold text-blue-600">Must</span> expresses strong obligation or necessity.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mustExamples.map((ex, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-xl hover:bg-blue-50 transition-colors border border-blue-200 cursor-pointer"
                      onClick={() => speakText(ex.english)}
                    >
                      <span className="text-blue-600 font-bold">{ex.english}</span>
                      <br />
                      <span className="text-sm text-gray-600">{ex.portuguese}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => toggleDrill("grammar")}
              className="mt-4 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              {openDrills.grammar ? "Hide Practice" : "Show Practice"}
            </button>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Complete the sentences with the correct verb form:</p>
                  <div className="space-y-2 mt-2">
                    {practiceFillBlanks.map((item, index) => (
                      <p key={index}>
                        <span className="text-gray-700">{item.sentence.replace("__________", "________")}</span>
                        <span className="text-green-600 font-bold ml-2">→ {item.answer}</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Translate into English (clique na tradução para ouvir):</p>
                  <div className="space-y-2 mt-2">
                    {practiceTranslate.map((item, index) => (
                      <div
                        key={index}
                        className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                        onClick={() => speakText(item.english)}
                      >
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

        {/* Seção 8 - Conversation */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Conversation</h2>
              <p className="mt-2 text-blue-100 italic">
                Safety Officer × Worker — clique nas falas em inglês para ouvir
              </p>
            </div>
            <button
              onClick={() => toggleDrill("conversation")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.conversation ? "Hide Translation" : "Show Translation"}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-2/3 space-y-4">
                {conversation.map((line, index) => (
                  <div
                    key={index}
                    className="cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    onClick={() => speakText(line.line)}
                  >
                    <p className="text-lg font-medium">
                      <span className="font-bold text-blue-600">{line.speaker}</span> {line.line}
                    </p>
                    {openDrills.conversation && (
                      <p className="text-sm text-gray-600">{line.translation}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="lg:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={controlRoomImage}
                    alt="Safety Officer and worker"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  Safety Officer talking to a worker on site
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 9 - Key Takeaway + Career Tips */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">⭐ Key Takeaway & Career Tips</h2>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="md:w-1/3">
                <div className="relative h-48 w-full">
                  <img
                    src={constructionImage}
                    alt="Construction site safety"
                    className="rounded-xl object-cover w-full h-full"
                  />
                </div>
                <p className="text-center mt-2 text-gray-700 italic">
                  Safety in construction and civil projects
                </p>
              </div>
              <div className="md:w-2/3 space-y-3">
                <p
                  className="text-lg text-gray-700 leading-relaxed cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "A Safety Officer is essential in any industry from offshore oil and gas to construction and civil engineering. The role requires a mix of technical knowledge, leadership, communication, and empathy."
                    )
                  }
                >
                  A <span className="font-bold text-blue-600">Safety Officer</span> is essential in any industry — from
                  offshore oil & gas to construction and civil engineering. The role requires a mix of{" "}
                  <span className="font-bold text-blue-600">
                    technical knowledge, leadership, communication, and empathy
                  </span>
                  .
                </p>
                <p
                  className="text-md text-gray-600 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "For beginners start with a technical course in Occupational Safety, get certified in NRs (10, 33, 35), and invest in English. Look for internships or junior roles in construction."
                    )
                  }
                >
                  <span className="font-bold text-blue-600">For beginners:</span> start with a technical course in
                  Occupational Safety, get certified in NRs (10, 33, 35), and invest in English. Look for internships or
                  junior roles in construction — it's a great entry point.
                </p>
                <p
                  className="text-md text-gray-600 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "For experienced professionals pursue a university degree, gain offshore certifications (BOSIET, HUET), and consider specializing in areas like environmental safety or risk management."
                    )
                  }
                >
                  <span className="font-bold text-blue-600">For experienced professionals:</span> pursue a university
                  degree, gain offshore certifications (BOSIET, HUET), and consider specializing in areas like
                  environmental safety or risk management. Networking and staying updated on regulations are key.
                </p>
                <p
                  className="text-md text-gray-600 cursor-pointer hover:bg-blue-50 p-2 rounded transition-colors"
                  onClick={() =>
                    speakText(
                      "Opportunities in construction large civil projects (bridges, tunnels, ports, high-rise buildings) constantly need Safety Officers."
                    )
                  }
                >
                  <span className="font-bold text-blue-600">Opportunities in construction:</span> large civil projects
                  (bridges, tunnels, ports, high-rise buildings) constantly need Safety Officers. It's a solid career
                  path with good stability and room for growth.
                </p>
              </div>
            </div>
          </div>
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
            Next Lesson (15) &rarr;
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
      `}</style>
    </div>
  );
}