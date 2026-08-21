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

    // --- Image URLs (Unsplash - vessels & offshore) ---
    const vesselImage =
        "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
    const offshoreImage =
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
    const controlRoomImage =
        "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
    const vesselAtSeaImage =
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
    const shipImage =
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
    const offshorePlatformImage =
        "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";

    // --- Vocabulary Data ---
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
        { english: "surge", portuguese: "avanço / recuo" },
        { english: "sway", portuguese: "movimento lateral" },
        { english: "yaw", portuguese: "rotação vertical" },
        { english: "pitch", portuguese: "rotação transversal" },
        { english: "roll", portuguese: "rotação longitudinal" },
        { english: "heave", portuguese: "movimento vertical" },
    ];

    // --- Word Combinations ---
    const wordCombinations = [
        { english: "maintain position", portuguese: "manter a posição" },
        { english: "maintain heading", portuguese: "manter o rumo" },
        { english: "control the vessel", portuguese: "controlar a embarcação" },
        { english: "produce thrust", portuguese: "produzir empuxo" },
        { english: "active thrust", portuguese: "empuxo ativo" },
        { english: "DP system", portuguese: "sistema DP" },
        { english: "DP vessel", portuguese: "embarcação DP" },
        { english: "fixed position", portuguese: "posição fixa" },
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

    // --- Degrees of Freedom ---
    const degreesOfFreedom = {
        controlled: [
            { name: "Surge", description: "forward/backward movement" },
            { name: "Sway", description: "side-to-side movement" },
            { name: "Yaw", description: "rotation around vertical axis" },
        ],
        monitored: [
            { name: "Pitch", description: "rotation around transversal axis" },
            { name: "Roll", description: "rotation around longitudinal axis" },
            { name: "Heave", description: "up/down movement" },
        ],
    };

    // --- Grammar: Present Simple ---
    const presentSimpleExamples = [
        { english: "I operate the DP system every day.", portuguese: "Eu opero o sistema DP todos os dias." },
        { english: "The vessel maintains its position.", portuguese: "A embarcação mantém sua posição." },
        { english: "Thrusters produce active thrust.", portuguese: "Os propulsores produzem empuxo ativo." },
        { english: "The pilot controls the vessel automatically.", portuguese: "O piloto controla a embarcação automaticamente." },
    ];

    const presentSimpleNegative = [
        { english: "The DP system does not use anchors.", portuguese: "O sistema DP não usa âncoras." },
        { english: "ROVs do not need oxygen.", portuguese: "ROVs não precisam de oxigênio." },
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

    // --- Useful Expressions ---
    const usefulExpressions = [
        "The vessel maintains its position.",
        "The vessel maintains its heading.",
        "The DP system controls the vessel automatically.",
        "Thrusters produce active thrust.",
        "The vessel is in Auto-DP mode.",
        "We have visual contact.",
        "Maintain your heading.",
        "The mission has been completed successfully.",
        "The thrusters are working properly.",
        "The vessel is at sea.",
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
                        ⚓ Lesson 1 — Dynamic Positioning
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
                                {vocabulary.slice(0, 12).map((item, index) => (
                                    <div key={index} className="p-3 bg-white rounded-xl border border-blue-200">
                                        <p className="text-lg font-medium text-gray-800">
                                            {index + 1}.{" "}
                                            <span
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                                                onClick={() => playAudio(item.english)}
                                            >
                                                {item.english}
                                            </span> — {item.portuguese}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== SECTION 2 — WORD COMBINATIONS ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6">
                        <h2 className="text-2xl font-bold">🔹 Word Combinations</h2>
                        <p className="text-sm text-blue-100 italic">Learn these phrases together</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {wordCombinations.map((item, index) => (
                                <button
                                    key={index}
                                    onClick={() => playAudio(item.english)}
                                    className="bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-left transition-colors border border-blue-200"
                                >
                                    <span className="text-blue-700 font-bold">{item.english}</span>
                                    <br />
                                    <span className="text-sm text-gray-600">{item.portuguese}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 3 — READING ===== */}
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

                {/* ===== SECTION 4 — BASIC QUESTIONS ===== */}
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

                {/* ===== SECTION 5 — 6 DEGREES OF FREEDOM ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6 flex flex-wrap justify-between items-center gap-3">
                        <div>
                            <h2 className="text-2xl font-bold">🔹 6 Degrees of Freedom</h2>
                            <p className="text-sm text-blue-100 italic">Which movements are controlled by DP?</p>
                        </div>
                        <button
                            onClick={() => toggleDrill("degrees")}
                            className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-1.5 rounded-full transition-colors"
                        >
                            {openDrills.degrees ? "Hide Details" : "Show Details"}
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-green-50 border-2 border-green-300 p-4 rounded-xl">
                                <p className="font-bold text-green-700">✅ Controlled by DP</p>
                                <ul className="mt-2 space-y-1 text-gray-700">
                                    {degreesOfFreedom.controlled.map((item) => (
                                        <li key={item.name}>
                                            •{" "}
                                            <button
                                                onClick={() => playAudio(item.name)}
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                                            >
                                                {item.name}
                                            </button>{" "}
                                            — {item.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded-xl">
                                <p className="font-bold text-yellow-700">👁️ Monitored (not controlled)</p>
                                <ul className="mt-2 space-y-1 text-gray-700">
                                    {degreesOfFreedom.monitored.map((item) => (
                                        <li key={item.name}>
                                            •{" "}
                                            <button
                                                onClick={() => playAudio(item.name)}
                                                className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                                            >
                                                {item.name}
                                            </button>{" "}
                                            — {item.description}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        {openDrills.degrees && (
                            <div className="mt-5 bg-blue-50 p-4 rounded-xl animate-fadeIn">
                                <p className="text-sm text-gray-700">
                                    📌 <strong>Exam Question:</strong>{" "}
                                    <em>Which of the following degrees of freedom is monitored (but NOT controlled) by the DP system?</em>
                                    <br />
                                    <span className="font-bold text-blue-600">Answer: Pitch.</span>
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ===== SECTION 6 — GRAMMAR ===== */}
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
                                        <p className="font-bold text-blue-600">Negative</p>
                                        <p className="text-sm text-gray-600">Subject + do/does + not + verb</p>
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

                {/* ===== SECTION 7 — CONVERSATION ===== */}
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

                {/* ===== SECTION 8 — USEFUL EXPRESSIONS ===== */}
                <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-8 overflow-hidden">
                    <div className="bg-blue-600 text-white py-4 px-6">
                        <h2 className="text-2xl font-bold">🔹 Useful Expressions</h2>
                        <p className="text-sm text-blue-100 italic">Professional offshore communication</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {usefulExpressions.map((expr, index) => (
                                <button
                                    key={index}
                                    onClick={() => playAudio(expr)}
                                    className="bg-blue-50 hover:bg-blue-100 p-3 rounded-xl text-left transition-colors text-blue-700 font-medium border border-blue-200"
                                >
                                    {expr}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ===== SECTION 9 — SPEAKING PRACTICE ===== */}
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

                {/* ===== SECTION 10 — FINAL REVIEW ===== */}
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
                                    <li>✅ <strong>Controlled movements</strong> = Surge, Sway, Yaw</li>
                                    <li>✅ <strong>Monitored movements</strong> = Pitch, Roll, Heave</li>
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