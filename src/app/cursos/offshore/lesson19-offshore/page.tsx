"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey =
    | "vocabulary"
    | "reading"
    | "questions"
    | "degrees"
    | "grammar"
    | "conversation"
    | "practice"
    | "speaking";

export default function LessonDynamicPositioning() {
    const router = useRouter();

    const [openDrills, setOpenDrills] = useState<Record<SectionKey, boolean>>({
        vocabulary: false,
        reading: false,
        questions: false,
        degrees: false,
        grammar: false,
        conversation: false,
        practice: false,
        speaking: false,
    });

    const [showGrammarExplanation, setShowGrammarExplanation] = useState(false);
    const [showMustExplanation, setShowMustExplanation] = useState(false);
    const [showUsefulTranslations, setShowUsefulTranslations] = useState(false);

    // Estado para o carrossel de imagens
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const toggleDrill = (section: SectionKey) => {
        setOpenDrills((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    // Audio playback using Web Speech API
    const playAudio = (text: string) => {
        const msg = new SpeechSynthesisUtterance(text);
        msg.lang = "en-US";
        msg.rate = 0.85;
        msg.pitch = 1;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(msg);
        console.log("🔊 Speaking:", text);
    };

    // --- Image URLs ---
    const vesselImage =
        "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2013_11_20.png";
    const offshoreImage =
        "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2013_11_20.png";
    const controlRoomImage =
        "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2013_11_20.png";
    const vesselAtSeaImage =
        "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2013_11_20.png";
    const shipImage =
        "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%207%20de%20set.%20de%202026%2C%2013_11_20.png";

    // --- Imagens do carrossel (Six Degrees of Freedom) ---
    const degreeImages = [
        "https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/6MVMTS.1.png",
        "https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/6MVMTS.2.png",
    ];

    const goToPrevious = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? degreeImages.length - 1 : prev - 1
        );
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) =>
            prev === degreeImages.length - 1 ? 0 : prev + 1
        );
    };

    const goToImage = (index: number) => {
        setCurrentImageIndex(index);
    };

    const openLightbox = () => {
        setIsLightboxOpen(true);
    };

    const closeLightbox = () => {
        setIsLightboxOpen(false);
    };

    // --- Vocabulary Data with contextual sentences ---
    const vocabulary = [
        { english: "vessel", portuguese: "embarcação / navio" },
        { english: "position", portuguese: "posição" },
        { english: "heading", portuguese: "rumo / direção" },
        { english: "thrust", portuguese: "empuxo / força de propulsão" },
        { english: "thruster", portuguese: "propulsor" },
        { english: "system", portuguese: "sistema" },
        { english: "control", portuguese: "controlar / controle" },
        { english: "maintain", portuguese: "manter" },
        { english: "fixed", portuguese: "fixo" },
        { english: "automatically", portuguese: "automaticamente" },
        { english: "active", portuguese: "ativo" },
        { english: "purpose", portuguese: "objetivo / finalidade" },
        { english: "movement", portuguese: "movimento" },
        { english: "degree", portuguese: "grau" },
        { english: "freedom", portuguese: "liberdade" },
    ];

    // Frases de contexto para cada palavra (mesmo índice)
    const vocabularySentences = [
        "The vessel is sailing in the Atlantic Ocean.",
        "The DP system maintains the vessel's position.",
        "The captain changed the heading to 180 degrees.",
        "The thrusters produce thrust to move the ship.",
        "A thruster is used for active propulsion.",
        "The DP system automatically controls the vessel.",
        "The pilot controls the thrusters manually.",
        "The vessel must maintain its position and heading.",
        "The vessel stays in a fixed position during operations.",
        "The system automatically corrects any drift.",
        "Active thrust is essential for DP.",
        "The main purpose of DP is to hold position.",
        "Any movement is quickly corrected by the system.",
        "Each degree of freedom is monitored.",
        "The system gives the vessel six degrees of freedom."
    ];

    // --- Basic Questions ---
    const basicQuestions = [
        {
            question: "What is Dynamic Positioning?",
            answer:
                "Dynamic Positioning is a system that controls a vessel's position and heading.",
            translation:
                "O Posicionamento Dinâmico é um sistema que controla a posição e o rumo de uma embarcação.",
        },
        {
            question: "What does a DP system control?",
            answer: "It controls the vessel's position and heading.",
            translation:
                "Ele controla a posição e o rumo da embarcação.",
        },
        {
            question: "What does a thruster do?",
            answer: "A thruster produces thrust and helps control the vessel.",
            translation:
                "Um propulsor produz empuxo e ajuda a controlar a embarcação.",
        },
        {
            question: "What does the vessel need to maintain?",
            answer: "The vessel needs to maintain its position and heading.",
            translation:
                "A embarcação precisa manter sua posição e seu rumo.",
        },
        {
            question: "How does the DP system control the vessel?",
            answer: "By using active thrust.",
            translation: "Usando empuxo ativo.",
        },
        {
            question: "What is the main purpose of Dynamic Positioning?",
            answer:
                "To allow a vessel to maintain a fixed position and heading exclusively by means of active thrust.",
            translation:
                "Permitir que uma embarcação mantenha uma posição e um rumo fixos exclusivamente por meio de empuxo ativo.",
        },
    ];

    // --- Reading Text ---
    const readingText = {
        title: "A DP Vessel",
        paragraphs: [
            "A vessel is working at sea. The vessel needs to stay in one position. It also needs to maintain its heading.",
            "The Dynamic Positioning system helps the vessel. The DP system uses active thrust.",
            "Thrusters produce thrust and help control the vessel. The DP system automatically controls the vessel's position and heading.",
        ],
        translation: [
            "Uma embarcação está trabalhando no mar. A embarcação precisa permanecer em uma posição. Ela também precisa manter seu rumo.",
            "O sistema de Posicionamento Dinâmico ajuda a embarcação. O sistema DP usa empuxo ativo.",
            "Os propulsores produzem empuxo e ajudam a controlar a embarcação. O sistema DP controla automaticamente a posição e o rumo da embarcação.",
        ],
        mainPurpose:
            "To allow a vessel to maintain a fixed position and heading exclusively by means of active thrust.",
        mainPurposeTranslation:
            "Permitir que uma embarcação mantenha uma posição e um rumo fixos exclusivamente por meio de empuxo ativo.",
    };

    // --- Degrees of Freedom (atualizado) ---
    const degreesData = {
        linear: [
            {
                name: "SURGE",
                portuguese: "Avanço e recuo",
                description: "Movimento para frente e para trás, ao longo do eixo longitudinal do navio."
            },
            {
                name: "SWAY",
                portuguese: "Deriva / deslocamento lateral",
                description: "Movimento de um lado para o outro, entre bombordo e boreste."
            },
            {
                name: "HEAVE",
                portuguese: "Movimento vertical",
                description: "Movimento de subida e descida vertical da embarcação, sem inclinação."
            }
        ],
        rotational: [
            {
                name: "ROLL",
                portuguese: "Rolamento",
                description: "Inclinação da embarcação de bombordo para boreste e de boreste para bombordo."
            },
            {
                name: "PITCH",
                portuguese: "Arfagem",
                description: "Movimento de proa para cima e para baixo; a proa sobe enquanto a popa desce, e vice-versa."
            },
            {
                name: "YAW",
                portuguese: "Guinada",
                description: "Rotação da embarcação em torno do eixo vertical, fazendo a proa apontar para uma direção diferente."
            }
        ]
    };

    // --- Grammar: Present Simple ---
    const presentSimpleExamples = [
        { english: "I operate the DP system every day.", portuguese: "Eu opero o sistema DP todos os dias." },
        { english: "The vessel maintains its position.", portuguese: "A embarcação mantém sua posição." },
        { english: "Thrusters produce active thrust.", portuguese: "Os propulsores produzem empuxo ativo." },
        { english: "The pilot controls the vessel automatically.", portuguese: "O piloto controla a embarcação automaticamente." },
    ];

    const presentSimpleNegative = [
        { english: "The DP system doesn't use anchors.", portuguese: "O sistema DP não usa âncoras." },
        { english: "ROVs don't need oxygen.", portuguese: "ROVs não precisam de oxigênio." },
    ];

    const presentSimpleQuestions = [
        { english: "Do you operate the DP system?", portuguese: "Você opera o sistema DP?" },
        { english: "Does the vessel maintain its heading?", portuguese: "A embarcação mantém seu rumo?" },
    ];

    const mustExamples = [
        { english: "ROV pilots must follow safety procedures.", portuguese: "Pilotos de ROV devem seguir procedimentos de segurança." },
        { english: "You must wear protective equipment.", portuguese: "Você deve usar equipamento de proteção." },
        { english: "Workers must communicate clearly during operations.", portuguese: "Os trabalhadores devem se comunicar claramente durante as operações." },
        { english: "Pilots must stay calm during emergencies.", portuguese: "Os pilotos devem manter a calma durante emergências." },
    ];

    // --- Conversation ---
    const conversation = [
        { speaker: "Supervisor:", line: "Are you ready to deploy the ROV?", translation: "Você está pronto para lançar o ROV?" },
        { speaker: "Pilot:", line: "Yes. I've completed all the system checks.", translation: "Sim. Completei todas as verificações do sistema." },
        { speaker: "Supervisor:", line: "How deep is today's inspection?", translation: "Qual é a profundidade da inspeção de hoje?" },
        { speaker: "Pilot:", line: "Approximately 1,500 meters.", translation: "Aproximadamente 1.500 metros." },
        { speaker: "Supervisor:", line: "Any technical issues?", translation: "Algum problema técnico?" },
        { speaker: "Pilot:", line: "Everything is working normally.", translation: "Está tudo funcionando normalmente." },
    ];

    // --- Practice Exercises ---
    const fillBlanks = [
        { sentence: "A __________ is a ship or boat.", answer: "vessel" },
        { sentence: "The vessel must maintain its __________.", answer: "position" },
        { sentence: "A thruster produces __________.", answer: "thrust" },
        { sentence: "The DP system controls the vessel __________.", answer: "automatically" },
        { sentence: "__________ is the direction of the vessel.", answer: "Heading" },
    ];

    const translateToEnglish = [
        { portuguese: "A embarcação mantém sua posição.", english: "The vessel maintains its position." },
        { portuguese: "A embarcação mantém seu rumo.", english: "The vessel maintains its heading." },
        { portuguese: "O sistema DP controla a embarcação.", english: "The DP system controls the vessel." },
        { portuguese: "O propulsor produz empuxo.", english: "The thruster produces thrust." },
        { portuguese: "Qual é o principal objetivo do Posicionamento Dinâmico?", english: "What is the main purpose of Dynamic Positioning?" },
    ];

    // --- Speaking Practice ---
    const speakingPractice = [
        { question: "What is a vessel?", answer: "A vessel is a ship." },
        { question: "What is position?", answer: "Position is where the vessel is." },
        { question: "What is heading?", answer: "Heading is the direction of the vessel." },
        { question: "What does a thruster produce?", answer: "A thruster produces thrust." },
        { question: "What does the DP system control?", answer: "It controls the vessel's position and heading." },
        { question: "What is the main purpose of Dynamic Positioning?", answer: "To maintain the vessel's position and heading using active thrust." },
        { question: "How is heading controlled in Auto-DP mode?", answer: "Automatically by the system." },
        { question: "Which three degrees of freedom are controlled by DP?", answer: "Surge, Sway and Yaw." },
    ];

    // --- Useful Expressions (com traduções) ---
    const usefulExpressions = [
        { english: "The vessel maintains its position.", portuguese: "A embarcação mantém sua posição." },
        { english: "The vessel maintains its heading.", portuguese: "A embarcação mantém seu rumo." },
        { english: "The DP system controls the vessel automatically.", portuguese: "O sistema DP controla a embarcação automaticamente." },
        { english: "Thrusters produce active thrust.", portuguese: "Os propulsores produzem empuxo ativo." },
        { english: "The vessel is in Auto-DP mode.", portuguese: "A embarcação está em modo Auto-DP." },
        { english: "We have visual contact.", portuguese: "Temos contato visual." },
        { english: "Maintain your heading.", portuguese: "Mantenha seu rumo." },
        { english: "The mission has been completed successfully.", portuguese: "A missão foi concluída com sucesso." },
        { english: "The thrusters are working properly.", portuguese: "Os propulsores estão funcionando corretamente." },
        { english: "The vessel is at sea.", portuguese: "A embarcação está no mar." },
    ];

    return (
        <div
            className="min-h-screen rounded-2xl py-16 px-4 sm:px-6 bg-fixed"
            style={{
                backgroundImage: `url(${vesselImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-6 sm:p-10 shadow-2xl">

                {/* ===== HEADER ===== */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0c4a6e] mb-4">
                        ⚓ Lesson 19 — Dynamic Positioning
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
                        Learn the basics of <strong>Dynamic Positioning (DP)</strong> — how vessels maintain position and heading using active thrust.
                    </p>
                    <div className="w-64 h-48 sm:h-56 mx-auto mt-6 rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src={offshoreImage}
                            alt="Offshore vessel"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">A DP vessel working at sea</p>
                </div>

                {/* ===== SECTION 1 — VOCABULARY ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Key Vocabulary</h2>
                            <p className="text-sm text-blue-100 italic">Click any word to hear pronunciation</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("vocabulary")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.vocabulary ? "Hide Practice" : "Show Practice"}
                        </button>
                    </div>
                    <div className="p-6">
                        <ul className="list-disc pl-6 text-gray-700 space-y-1.5 grid grid-cols-1 sm:grid-cols-2 gap-1">
                            {vocabulary.map((item, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => playAudio(item.english)}
                                        className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                                    >
                                        {item.english}
                                    </button> = {item.portuguese}
                                </li>
                            ))}
                        </ul>

                        {openDrills.vocabulary && (
                            <div className="mt-6 bg-blue-50 rounded-2xl p-5 space-y-3 animate-fadeIn">
                                {vocabulary.map((item, index) => (
                                    <div key={index} className="p-3 bg-white rounded-xl border border-blue-200">
                                        <p className="text-lg font-medium text-gray-800">
                                            <span
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                                                onClick={() => playAudio(item.english)}
                                            >
                                                {item.english}
                                            </span> — {item.portuguese}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            📝 {vocabularySentences[index]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== SECTION 2 — READING ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Reading</h2>
                            <p className="text-sm text-blue-100 italic">What is Dynamic Positioning?</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("reading")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.reading ? "Hide Translation" : "Show Translation"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/2">
                                <h3 className="text-xl font-bold text-blue-600 mb-3">A DP Vessel</h3>
                                <div className="text-gray-700 space-y-4 text-base leading-relaxed">
                                    {readingText.paragraphs.map((p, i) => (
                                        <p key={i}>
                                            {p.split(" ").map((word, j) => {
                                                const clean = word.replace(/[^a-zA-Z]/g, "");
                                                const isKey = ["vessel", "position", "heading", "thrust", "thruster", "DP", "system", "active", "control"].includes(clean.toLowerCase());
                                                return isKey ? (
                                                    <span
                                                        key={j}
                                                        onClick={() => playAudio(clean)}
                                                        className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                                                    >
                                                        {word}{" "}
                                                    </span>
                                                ) : (
                                                    <span key={j}>{word} </span>
                                                );
                                            })}
                                        </p>
                                    ))}
                                </div>
                                <div className="mt-4 bg-blue-50 p-4 rounded-xl">
                                    <p className="text-sm font-semibold text-blue-700">💡 The Main Purpose</p>
                                    <p className="text-gray-700 font-medium">
                                        {readingText.mainPurpose}
                                    </p>
                                </div>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative h-56 w-full rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={vesselAtSeaImage}
                                        alt="DP vessel at sea"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">A DP vessel operating offshore</p>

                                {openDrills.reading && (
                                    <div className="mt-4 bg-blue-50 rounded-2xl p-5 animate-fadeIn">
                                        <h4 className="font-bold text-blue-600 mb-2">📝 Tradução</h4>
                                        <div className="text-gray-700 space-y-3 text-sm">
                                            {readingText.translation.map((t, i) => (
                                                <p key={i}>{t}</p>
                                            ))}
                                            <p className="font-bold text-blue-700 mt-2">
                                                Objetivo principal: {readingText.mainPurposeTranslation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 3 — BASIC QUESTIONS ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Basic Questions</h2>
                            <p className="text-sm text-blue-100 italic">Learn to ask and answer about DP</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("questions")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.questions ? "Hide Answers" : "Show Answers"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {basicQuestions.map((q, idx) => (
                                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="font-semibold text-gray-700">{q.question}</p>
                                    {openDrills.questions && (
                                        <div className="mt-2 text-blue-600 font-medium animate-fadeIn">
                                            {q.answer}
                                            <br />
                                            <span className="text-sm text-gray-600">{q.translation}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 4 — 6 DEGREES OF FREEDOM (COM CARROSSEL DE IMAGENS) ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 6 Degrees of Freedom — Movimentos da Embarcação</h2>
                            <p className="text-sm text-blue-100 italic">Os seis movimentos que uma embarcação pode ter</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("degrees")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.degrees ? "Hide Details" : "Show Details"}
                        </button>
                    </div>
                    <div className="p-6">
                        {/* Movimentos Lineares */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-green-700 mb-3">📏 Lineares (deslocamento)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {degreesData.linear.map((item) => (
                                    <div key={item.name} className="bg-green-50 border-2 border-green-300 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                onClick={() => playAudio(item.name)}
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 text-lg"
                                            >
                                                {item.name}
                                            </button>
                                            <span className="text-gray-600 text-sm">({item.portuguese})</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Movimentos Rotacionais */}
                        <div>
                            <h3 className="text-lg font-bold text-yellow-700 mb-3">🔄 Rotacionais (inclinação/rotação)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {degreesData.rotational.map((item) => (
                                    <div key={item.name} className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <button
                                                onClick={() => playAudio(item.name)}
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 text-lg"
                                            >
                                                {item.name}
                                            </button>
                                            <span className="text-gray-600 text-sm">({item.portuguese})</span>
                                        </div>
                                        <p className="text-sm text-gray-700">{item.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Carrossel de imagens */}
                        <div className="mt-8">
                            <h4 className="text-lg font-bold text-blue-700 mb-4 text-center">
                                🖼️ Visualização dos Movimentos
                            </h4>
                            <div className="relative bg-gray-100 rounded-2xl p-4 shadow-inner">
                                {/* Container da imagem com navegação */}
                                <div className="relative flex items-center justify-center">
                                    {/* Botão anterior */}
                                    <button
                                        onClick={goToPrevious}
                                        className="absolute left-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
                                        aria-label="Imagem anterior"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>

                                    {/* Imagem */}
                                    <div
                                        className="cursor-pointer rounded-xl overflow-hidden shadow-md max-w-3xl mx-auto"
                                        onClick={openLightbox}
                                    >
                                        <img
                                            src={degreeImages[currentImageIndex]}
                                            alt={`Six Degrees of Freedom - ${currentImageIndex + 1}`}
                                            className="w-full h-auto max-h-96 object-contain transition-transform hover:scale-[1.01]"
                                        />
                                    </div>

                                    {/* Botão próximo */}
                                    <button
                                        onClick={goToNext}
                                        className="absolute right-2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
                                        aria-label="Próxima imagem"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Indicadores de página */}
                                <div className="flex justify-center gap-2 mt-4">
                                    {degreeImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => goToImage(index)}
                                            className={`h-2.5 rounded-full transition-all ${
                                                currentImageIndex === index
                                                    ? "w-8 bg-blue-600"
                                                    : "w-2.5 bg-gray-400 hover:bg-gray-500"
                                            }`}
                                            aria-label={`Ir para imagem ${index + 1}`}
                                        />
                                    ))}
                                </div>

                                {/* Legenda e botão expandir */}
                                <div className="flex justify-between items-center mt-3 px-2">
                                    <span className="text-sm text-gray-500">
                                        Imagem {currentImageIndex + 1} de {degreeImages.length}
                                    </span>
                                    <button
                                        onClick={openLightbox}
                                        className="text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-1.5 rounded-full transition-colors flex items-center gap-1"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
                                        </svg>
                                        Expandir
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Resumo e vídeo do YouTube incorporado */}
                        <div className="mt-6 bg-blue-50 p-4 rounded-xl">
                            <p className="text-sm text-gray-700">
                                💡 <strong>Resumo:</strong> <br />
                                <strong>SURGE + SWAY + HEAVE</strong> = deslocamento linear (frente/trás, lateral, vertical).<br />
                                <strong>ROLL + PITCH + YAW</strong> = rotação/inclinação (lateral, proa/popa, eixo vertical).
                            </p>
                            <div className="mt-4 aspect-w-16 aspect-h-9 w-full max-w-2xl mx-auto">
                                <iframe
                                    className="w-full h-64 rounded-xl shadow-lg"
                                    src="https://www.youtube.com/embed/5yRKj-At5ps?start=94"
                                    title="Six Degrees of Freedom explained"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>

                        {openDrills.degrees && (
                            <div className="mt-4 bg-blue-50 p-4 rounded-xl animate-fadeIn">
                                <p className="text-sm text-gray-700">
                                    📌 <strong>Dica de memorização:</strong> <br />
                                    • <strong>Lineares:</strong> SURGE (frente/trás), SWAY (esquerda/direita), HEAVE (cima/baixo).<br />
                                    • <strong>Rotacionais:</strong> ROLL (inclina lateral), PITCH (proa sobe/desce), YAW (gira para mudar o rumo).
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== LIGHTBOX (TELA CHEIA) ===== */}
                {isLightboxOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
                        onClick={closeLightbox}
                        style={{ animation: "fadeIn 0.3s ease-out" }}
                    >
                        <div
                            className="relative max-w-6xl w-full mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Botão fechar */}
                            <button
                                onClick={closeLightbox}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors text-3xl"
                                aria-label="Fechar"
                            >
                                ✕
                            </button>

                            {/* Imagem em tela cheia */}
                            <img
                                src={degreeImages[currentImageIndex]}
                                alt={`Six Degrees of Freedom - ${currentImageIndex + 1}`}
                                className="w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-2xl"
                            />

                            {/* Navegação na lightbox */}
                            <div className="flex justify-between items-center mt-4 px-4">
                                <button
                                    onClick={goToPrevious}
                                    className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                                    aria-label="Anterior"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <span className="text-white text-sm">
                                    {currentImageIndex + 1} / {degreeImages.length}
                                </span>
                                <button
                                    onClick={goToNext}
                                    className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors"
                                    aria-label="Próximo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Indicadores da lightbox */}
                            <div className="flex justify-center gap-2 mt-3">
                                {degreeImages.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => goToImage(index)}
                                        className={`h-2 rounded-full transition-all ${
                                            currentImageIndex === index
                                                ? "w-6 bg-white"
                                                : "w-2 bg-white/40 hover:bg-white/60"
                                        }`}
                                        aria-label={`Ir para imagem ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== SECTION 5 — GRAMMAR ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Grammar</h2>
                            <p className="text-sm text-blue-100 italic">Present Simple & Modal verb MUST</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setShowGrammarExplanation(!showGrammarExplanation)}
                                className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                            >
                                {showGrammarExplanation ? "Hide Present Simple" : "Show Present Simple"}
                            </button>
                            <button
                                onClick={() => setShowMustExplanation(!showMustExplanation)}
                                className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                            >
                                {showMustExplanation ? "Hide Must" : "Show Must"}
                            </button>
                        </div>
                    </div>
                    <div className="p-6">
                        {showGrammarExplanation && (
                            <div className="bg-blue-50 p-5 rounded-xl mb-6 animate-fadeIn">
                                <h3 className="font-bold text-blue-600 text-lg mb-3">📘 Present Simple — Job Responsibilities</h3>
                                <p className="text-gray-700 mb-4">Use the Present Simple to describe routines, responsibilities, and facts.</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-bold text-blue-600">Structure</p>
                                        <p className="text-sm text-gray-600">Subject + Verb + Complement</p>
                                        <div className="mt-2 space-y-2">
                                            {presentSimpleExamples.map((ex, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => playAudio(ex.english)}
                                                    className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100"
                                                >
                                                    <span className="text-blue-600 font-bold">{ex.english}</span>
                                                    <br />
                                                    <span className="text-sm text-gray-600">{ex.portuguese}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-bold text-blue-600">Negative (usando <span className="text-red-600">don't</span> e <span className="text-red-600">doesn't</span>)</p>
                                        <p className="text-sm text-gray-600">Subject + don't/doesn't + verb</p>
                                        <div className="mt-2 space-y-2">
                                            {presentSimpleNegative.map((ex, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => playAudio(ex.english)}
                                                    className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100"
                                                >
                                                    <span className="text-blue-600 font-bold">{ex.english}</span>
                                                    <br />
                                                    <span className="text-sm text-gray-600">{ex.portuguese}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="font-bold text-blue-600 mt-4">Questions</p>
                                        <p className="text-sm text-gray-600">Do/Does + Subject + Verb?</p>
                                        <div className="mt-2 space-y-2">
                                            {presentSimpleQuestions.map((ex, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => playAudio(ex.english)}
                                                    className="block w-full text-left bg-white p-2 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100"
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
                            <div className="bg-blue-50 p-5 rounded-xl mb-6 animate-fadeIn">
                                <h3 className="font-bold text-blue-600 text-lg mb-3">📘 Modal Verb "MUST" — Obligation</h3>
                                <p className="text-gray-700 mb-4">
                                    <span className="font-bold text-blue-600">Must</span> expresses obligation or necessity.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {mustExamples.map((ex, i) => (
                                        <button
                                            key={i}
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
                            onClick={() => toggleDrill("grammar")}
                            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition-colors"
                        >
                            {openDrills.grammar ? "Hide Practice" : "Show Practice"}
                        </button>

                        {openDrills.grammar && (
                            <div className="mt-4 bg-blue-50 rounded-2xl p-5 space-y-4 animate-fadeIn">
                                <div className="p-4 bg-white rounded-xl border border-blue-200">
                                    <p className="text-lg font-medium text-gray-800">Complete with the correct word:</p>
                                    <div className="space-y-2 mt-2">
                                        {fillBlanks.map((item, i) => (
                                            <p key={i}>
                                                <span className="text-gray-700">{item.sentence.replace("__________", "________")}</span>
                                                <span className="text-green-600 font-bold ml-2">→ {item.answer}</span>
                                            </p>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-white rounded-xl border border-blue-200">
                                    <p className="text-lg font-medium text-gray-800">Translate into English:</p>
                                    <div className="space-y-2 mt-2">
                                        {translateToEnglish.map((item, i) => (
                                            <div key={i}>
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

                {/* ===== SECTION 6 — CONVERSATION ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Conversation</h2>
                            <p className="text-sm text-blue-100 italic">DP operation briefing</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("conversation")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.conversation ? "Hide Translation" : "Show Translation"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="lg:w-2/3 space-y-4">
                                {conversation.map((line, idx) => (
                                    <div key={idx} className="flex items-start">
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
                                <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={controlRoomImage}
                                        alt="Control room"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">Control room during DP operation</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 7 — USEFUL EXPRESSIONS ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Useful Expressions</h2>
                            <p className="text-sm text-blue-100 italic">Professional offshore communication</p>
                        </div>
                        <button
                            onClick={() => setShowUsefulTranslations(!showUsefulTranslations)}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {showUsefulTranslations ? "Hide Translations" : "Show Translations"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {usefulExpressions.map((expr, index) => (
                                <button
                                    key={index}
                                    onClick={() => playAudio(expr.english)}
                                    className="bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-left transition-colors text-blue-700 font-medium border border-blue-200"
                                >
                                    {expr.english}
                                    {showUsefulTranslations && (
                                        <div className="text-sm text-gray-600 font-normal mt-1">
                                            {expr.portuguese}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 8 — SPEAKING PRACTICE ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 Speaking Practice</h2>
                            <p className="text-sm text-blue-100 italic">Practice these questions and answers</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("speaking")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.speaking ? "Hide Answers" : "Show Answers"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {speakingPractice.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="font-semibold text-gray-700">{item.question}</p>
                                    {openDrills.speaking && (
                                        <p className="text-blue-600 font-medium mt-1">{item.answer}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 9 — FINAL REVIEW ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6">
                        <h2 className="text-2xl font-bold">⭐ Final Review — Lesson 1</h2>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/2">
                                <h3 className="font-bold text-blue-600 mb-3">📝 Key Takeaways</h3>
                                <ul className="space-y-2 text-gray-700">
                                    <li>✅ <strong>Vessel</strong> = ship or boat</li>
                                    <li>✅ <strong>Position</strong> = where the vessel is</li>
                                    <li>✅ <strong>Heading</strong> = which way the vessel points</li>
                                    <li>✅ <strong>Thrust</strong> = force that moves/controls the vessel</li>
                                    <li>✅ <strong>Thruster</strong> = equipment that produces thrust</li>
                                    <li>✅ <strong>DP System</strong> = controls position and heading automatically</li>
                                    <li>✅ <strong>Main Purpose</strong> = maintain fixed position and heading using active thrust</li>
                                    <li>✅ <strong>Linear movements</strong> = SURGE (forward/back), SWAY (side), HEAVE (up/down)</li>
                                    <li>✅ <strong>Rotational movements</strong> = ROLL (side tilt), PITCH (bow up/down), YAW (turn)</li>
                                </ul>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-md">
                                    <img
                                        src={shipImage}
                                        alt="Offshore vessel"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-center text-sm text-gray-500 mt-2">A DP vessel maintaining position at sea</p>
                                <div className="mt-4 bg-blue-50 p-4 rounded-xl text-center">
                                    <p className="text-blue-700 font-medium italic">
                                        "The vessel maintains its position and heading using active thrust."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== NAVIGATION ===== */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <button
                        onClick={() => router.push("/cursos/lesson0")}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                    >
                        &larr; Previous Lesson
                    </button>
                    <button
                        onClick={() => alert("🏁 End of Lesson 1 — Dynamic Positioning")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
                    >
                        Next Lesson &rarr;
                    </button>
                </div>

            </div>
        </div>
    );
}