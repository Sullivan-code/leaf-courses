"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Volume2, BookOpen, Info, ChevronDown, ChevronRight, Languages, Play, Pause, RotateCcw } from "lucide-react";

// ============================================================
// CONFIGURAÇÕES E CONTEÚDO DA LIÇÃO
// ============================================================

// URL da Imagem (substitua pela sua URL raw do GitHub se necessário)
const IMAGE_URL =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%208%20de%20out.%20de%202026%2C%2019_46_13.png";

// URL do Áudio (substitua pela sua URL raw do GitHub se necessário)
const AUDIO_URL =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Record%20(online-voice-recorder.com)%20(5).mp3";

// Título e Subtítulo
const lessonTitle = "THE CRANE IS DOWN";
const lessonSubtitle = "Offshore English Lesson";

// ============================================================
// CONTEÚDO DO TEXTO
// ============================================================
const lessonText = [
  {
    en: "It was the end of a long working day at the port. A vessel was being loaded with containers, and everything was going according to plan. The operators were working normally, and the maintenance team was monitoring the equipment.",
    pt: "Era o fim de um longo dia de trabalho no porto. Um navio estava sendo carregado com contêineres, e tudo estava correndo conforme o planejado. Os operadores trabalhavam normalmente, e a equipe de manutenção monitorava os equipamentos.",
    terms: [
      { en: "vessel", pt: "navio" },
      { en: "loaded", pt: "carregado" },
      { en: "maintenance team", pt: "equipe de manutenção" },
      { en: "monitoring", pt: "monitorando" },
    ],
  },
  {
    en: "Suddenly, one of the container cranes started making an unusual noise. A few seconds later, the crane lost hydraulic pressure and stopped working.",
    pt: "De repente, um dos guindastes de contêineres começou a fazer um barulho incomum. Poucos segundos depois, o guindaste perdeu pressão hidráulica e parou de funcionar.",
    terms: [
      { en: "cranes", pt: "guindastes" },
      { en: "unusual noise", pt: "barulho incomum" },
      { en: "hydraulic pressure", pt: "pressão hidráulica" },
    ],
  },
  {
    en: "The operator immediately stopped the operation and reported the problem to the maintenance team. The crane was carrying a heavy container at the time, so continuing the operation could create a serious safety risk.",
    pt: "O operador imediatamente parou a operação e reportou o problema à equipe de manutenção. O guindaste estava carregando um contêiner pesado no momento, então continuar a operação poderia criar um sério risco de segurança.",
    terms: [
      { en: "reported", pt: "reportou" },
      { en: "safety risk", pt: "risco de segurança" },
    ],
  },
  {
    en: "The maintenance supervisor arrived at the area and decided to isolate the equipment before starting the inspection. The team checked the hydraulic system, electrical components, cables, and other critical parts of the crane.",
    pt: "O supervisor de manutenção chegou à área e decidiu isolar o equipamento antes de iniciar a inspeção. A equipe verificou o sistema hidráulico, componentes elétricos, cabos e outras partes críticas do guindaste.",
    terms: [
      { en: "supervisor", pt: "supervisor" },
      { en: "isolate", pt: "isolar" },
      { en: "inspection", pt: "inspeção" },
      { en: "electrical components", pt: "componentes elétricos" },
    ],
  },
  {
    en: "At first, they thought the problem was related to a hydraulic component. However, after a more detailed inspection, they discovered that the component had been showing signs of wear for several weeks.",
    pt: "No início, pensaram que o problema estava relacionado a um componente hidráulico. No entanto, após uma inspeção mais detalhada, descobriram que o componente vinha apresentando sinais de desgaste há várias semanas.",
    terms: [
      { en: "detailed inspection", pt: "inspeção detalhada" },
      { en: "signs of wear", pt: "sinais de desgaste" },
    ],
  },
  {
    en: "The problem was not only the damaged component. The maintenance records showed that the previous inspection had been delayed because the crane had been operating under a heavy workload.",
    pt: "O problema não era apenas o componente danificado. Os registros de manutenção mostraram que a inspeção anterior havia sido adiada porque o guindaste estava operando sob uma carga de trabalho pesada.",
    terms: [
      { en: "damaged", pt: "danificado" },
      { en: "maintenance records", pt: "registros de manutenção" },
      { en: "delayed", pt: "adiada" },
      { en: "heavy workload", pt: "carga de trabalho pesada" },
    ],
  },
  {
    en: "The operations manager wanted to put the crane back into service as quickly as possible because the vessel was already behind schedule. However, the maintenance supervisor knew that rushing the repair could create an even bigger problem.",
    pt: "O gerente de operações queria colocar o guindaste de volta em serviço o mais rápido possível porque o navio já estava atrasado. No entanto, o supervisor de manutenção sabia que apressar o reparo poderia criar um problema ainda maior.",
    terms: [
      { en: "operations manager", pt: "gerente de operações" },
      { en: "behind schedule", pt: "atrasado" },
      { en: "rushing", pt: "apressar" },
      { en: "repair", pt: "reparo" },
    ],
  },
  {
    en: "The team replaced the damaged component, tested the hydraulic system, and performed a complete safety inspection. Only after confirming that the equipment was operating normally did they release the crane for operation.",
    pt: "A equipe substituiu o componente danificado, testou o sistema hidráulico e realizou uma inspeção de segurança completa. Somente após confirmar que o equipamento estava operando normalmente, eles liberaram o guindaste para operação.",
    terms: [
      { en: "replaced", pt: "substituiu" },
      { en: "performed", pt: "realizou" },
      { en: "release", pt: "liberar" },
    ],
  },
  {
    en: "The incident caused some operational delays, but no one was injured.",
    pt: "O incidente causou alguns atrasos operacionais, mas ninguém se feriu.",
    terms: [
      { en: "incident", pt: "incidente" },
      { en: "delays", pt: "atrasos" },
      { en: "injured", pt: "ferido" },
    ],
  },
  {
    en: "After the incident, the company decided to review its preventive maintenance program. The maintenance team also started paying more attention to early signs of equipment failure.",
    pt: "Após o incidente, a empresa decidiu revisar seu programa de manutenção preventiva. A equipe de manutenção também começou a prestar mais atenção aos primeiros sinais de falha dos equipamentos.",
    terms: [
      { en: "review", pt: "revisar" },
      { en: "preventive maintenance", pt: "manutenção preventiva" },
      { en: "equipment failure", pt: "falha de equipamento" },
    ],
  },
  {
    en: "And the main lesson was clear: production is important, but safety cannot be sacrificed to save time. A small maintenance problem can become a very serious problem.",
    pt: "E a principal lição foi clara: a produção é importante, mas a segurança não pode ser sacrificada para economizar tempo. Um pequeno problema de manutenção pode se tornar um problema muito sério.",
    terms: [
      { en: "main lesson", pt: "lição principal" },
      { en: "production", pt: "produção" },
      { en: "safety", pt: "segurança" },
      { en: "sacrificed", pt: "sacrificada" },
    ],
  },
];

// ============================================================
// PERGUNTAS DE COMPREENSÃO
// ============================================================
const questions = [
  {
    question: "1. What happened to the crane?",
    options: [
      "A) It caught fire",
      "B) It lost hydraulic pressure and stopped working",
      "C) It fell into the sea",
      "D) It was hit by a container",
    ],
    answer: 1,
  },
  {
    question: "2. Why did the operator stop the operation immediately?",
    options: [
      "A) Because it was lunch time",
      "B) Because the crane was carrying a heavy container and continuing could create a safety risk",
      "C) Because the supervisor told him to",
      "D) Because the vessel was leaving",
    ],
    answer: 1,
  },
  {
    question: "3. What did the maintenance team discover after a detailed inspection?",
    options: [
      "A) The crane was new",
      "B) The component had been showing signs of wear for several weeks",
      "C) The problem was caused by the weather",
      "D) The crane was fine",
    ],
    answer: 1,
  },
  {
    question: "4. Why had the previous inspection been delayed?",
    options: [
      "A) Because of a holiday",
      "B) Because the crane had been operating under a heavy workload",
      "C) Because the team was on strike",
      "D) Because of budget cuts",
    ],
    answer: 1,
  },
  {
    question: "5. What was the main lesson from the incident?",
    options: [
      "A) Production is more important than safety",
      "B) Safety cannot be sacrificed to save time",
      "C) Maintenance is not necessary",
      "D) Cranes are dangerous",
    ],
    answer: 1,
  },
];

// ============================================================
// EXERCÍCIOS DE SUBSTITUIÇÃO
// ============================================================
const substitutionExercises = [
  {
    original: "The crane lost hydraulic pressure and stopped working.",
    substitutes: [
      { word: "hydraulic pressure", replacement: "electrical power" },
      { word: "stopped working", replacement: "shut down" },
    ],
  },
  {
    original: "The operator immediately stopped the operation and reported the problem.",
    substitutes: [
      { word: "immediately", replacement: "quickly" },
      { word: "reported", replacement: "informed the team about" },
    ],
  },
  {
    original: "The team replaced the damaged component and tested the hydraulic system.",
    substitutes: [
      { word: "damaged", replacement: "broken" },
      { word: "tested", replacement: "checked" },
    ],
  },
];

// ============================================================
// COMPONENTES AUXILIARES
// ============================================================

// Componente para o player de áudio com controle de velocidade
function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = Number(e.target.value);
      audio.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-4 shadow-lg mb-6 text-white">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Barra de Progresso e Tempo */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-mono w-10 text-right">{formatTime(progress)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={progress}
          onChange={handleSeek}
          className="flex-1 h-1.5 accent-amber-400 cursor-pointer"
        />
        <span className="text-xs font-mono w-10">{formatTime(duration)}</span>
      </div>

      {/* Controles Principais */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleRestart}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            title="Reiniciar"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="p-3 bg-amber-400 text-slate-900 hover:bg-amber-300 rounded-full transition-colors shadow-lg"
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
        </div>

        {/* Controle de Velocidade */}
        <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2 py-1">
          <span className="text-[10px] font-bold uppercase opacity-70 mr-1">Velocidade:</span>
          {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`text-xs px-2 py-1 rounded-full transition-all ${
                playbackRate === rate
                  ? "bg-amber-400 text-slate-900 font-bold shadow"
                  : "hover:bg-white/20"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Componente para termos clicáveis com tradução
function T({ en, pt }: { en: string; pt: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setShow((s) => !s)}
        className="cursor-pointer border-b border-dotted border-amber-400/70 hover:bg-amber-400/20 transition-colors text-left text-blue-800 font-medium"
        title="Clique para ver a tradução"
      >
        {en}
      </button>
      {show && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-amber-100 text-amber-900 text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 border border-amber-300">
          {pt}
        </span>
      )}
    </span>
  );
}

// Componente para caixa de explicação
function Explanation({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold px-4 py-2 rounded-full border border-emerald-700 transition-all"
      >
        <Info size={14} />
        {open ? "Ocultar Explicação" : `Explicação: ${title}`}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="mt-3 bg-emerald-950/40 border-l-4 border-emerald-500 p-4 rounded-r-xl text-emerald-100 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

// Componente para tradução completa
function FullTranslation({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-blue-900/60 hover:bg-blue-800 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full border border-blue-700 transition-all"
      >
        <Languages size={14} />
        {open ? "Ocultar Tradução Completa" : "Ver Tradução Completa em Português"}
      </button>
      {open && (
        <div className="mt-3 bg-blue-950/60 border-l-4 border-blue-400 p-4 rounded-r-xl text-blue-100 text-sm leading-relaxed whitespace-pre-line">
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function CraneLessonPage() {
  const [activeTab, setActiveTab] = useState<"text" | "questions" | "substitution">("text");
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [substitutionRevealed, setSubstitutionRevealed] = useState<{ [key: number]: boolean }>({});

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubstitutionToggle = (index: number) => {
    setSubstitutionRevealed((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ============== HEADER ============== */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="relative z-10">
            <span className="inline-block bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
              Offshore English — Lesson
            </span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-amber-300">
              🔧 {lessonTitle}
            </h1>
            <p className="text-amber-200 text-lg italic mb-4">{lessonSubtitle}</p>
            <p className="text-blue-100 max-w-3xl mx-auto text-base md:text-lg">
              Ouça o áudio, clique nas palavras sublinhadas para ver a tradução e teste seus
              conhecimentos com as perguntas e exercícios.
            </p>
          </div>
        </div>

        {/* ============== IMAGEM E AUDIO ============== */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 md:h-80 w-full">
            <Image
              src={IMAGE_URL}
              alt={lessonTitle}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400?text=Imagem+Indisponível";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">{lessonTitle}</h2>
            </div>
          </div>
          <div className="p-4">
            <AudioPlayer src={AUDIO_URL} />
          </div>
        </div>

        {/* ============== ABAS ============== */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="flex border-b">
            {[
              { key: "text" as const, label: "📖 Texto" },
              { key: "questions" as const, label: "❓ Perguntas" },
              { key: "substitution" as const, label: "🔄 Substituição" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {/* ======================== */}
            {/* ABA: TEXTO */}
            {/* ======================== */}
            {activeTab === "text" && (
              <div className="space-y-6">
                {lessonText.map((para, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-gray-800 leading-relaxed">
                      {para.en.split(" ").map((word, wIndex) => {
                        const cleanWord = word.replace(/[.,!?;:]/g, "");
                        const term = para.terms.find(
                          (t) => t.en.toLowerCase() === cleanWord.toLowerCase()
                        );
                        return term ? (
                          <span key={wIndex}>
                            <T en={word} pt={term.pt} />{" "}
                          </span>
                        ) : (
                          <span key={wIndex}>{word} </span>
                        );
                      })}
                    </p>
                    <FullTranslation>{para.pt}</FullTranslation>
                  </div>
                ))}
              </div>
            )}

            {/* ======================== */}
            {/* ABA: PERGUNTAS */}
            {/* ======================== */}
            {activeTab === "questions" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">❓ Perguntas de Compreensão</h2>
                {questions.map((q, qIndex) => (
                  <div key={qIndex} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="font-semibold text-gray-800 mb-3">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((option, oIndex) => {
                        const isSelected = selectedAnswers[qIndex] === oIndex;
                        const isCorrect = oIndex === q.answer;
                        const showResult = selectedAnswers[qIndex] !== undefined;

                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleAnswerSelect(qIndex, oIndex)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              showResult
                                ? isCorrect
                                  ? "bg-green-50 border-green-400 text-green-800"
                                  : isSelected
                                  ? "bg-red-50 border-red-400 text-red-800"
                                  : "bg-white border-gray-200 text-gray-600"
                                : "bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                            }`}
                          >
                            {option}
                            {showResult && isCorrect && " ✅"}
                            {showResult && isSelected && !isCorrect && " ❌"}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ======================== */}
            {/* ABA: SUBSTITUIÇÃO */}
            {/* ======================== */}
            {activeTab === "substitution" && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-800">🔄 Exercícios de Substituição</h2>
                <p className="text-gray-600">
                  Substitua a parte destacada pela alternativa e diga a nova frase em voz alta.
                </p>

                {substitutionExercises.map((exercise, index) => (
                  <div key={index} className="p-5 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="bg-white p-4 rounded-lg border mb-4">
                      <p className="text-gray-800 leading-relaxed">
                        {exercise.original.split(new RegExp(`(${exercise.substitutes.map((s) => s.word).join("|")})`, "gi")).map((part, i) => {
                          const isTarget = exercise.substitutes.some((s) =>
                            part.toLowerCase().includes(s.word.toLowerCase())
                          );
                          return (
                            <span key={i} className={isTarget ? "bg-yellow-200 font-semibold px-1 rounded" : ""}>
                              {part}
                            </span>
                          );
                        })}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {exercise.substitutes.map((sub, sIndex) => (
                        <button
                          key={sIndex}
                          onClick={() => handleSubstitutionToggle(index)}
                          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          {sub.word} → {sub.replacement}
                        </button>
                      ))}
                    </div>

                    {substitutionRevealed[index] && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm font-medium text-green-800 mb-1">✅ Resposta Possível:</p>
                        <p className="text-green-900">
                          {exercise.original
                            .replace(new RegExp(exercise.substitutes[0].word, "gi"), exercise.substitutes[0].replacement)
                            .replace(new RegExp(exercise.substitutes[1].word, "gi"), exercise.substitutes[1].replacement)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTÃO VOLTAR */}
        <div className="mt-8 text-center">
          <Link
            href="/cursos/offshore"
            className="inline-block bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg"
          >
            ← Voltar para Cursos Offshore
          </Link>
        </div>
      </div>
    </div>
  );
}