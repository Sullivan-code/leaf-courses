"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Volume2, ZoomIn, ZoomOut, Play, Pause, Square, Rewind, FastForward } from "lucide-react";

// ============================================
// CONFIG
// ============================================

const IMAGE_URL =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/Imagem%20do%20Codex%2024%20de%20set.%20de%202026%2C%2015_02_48.png";

const AUDIO_URL =
  "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/L24-OFFSHORE-AUDIO.wav";

// ============================================
// TYPES
// ============================================

interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
}

interface VocabItem {
  term: string;
  definition: string;
  pt: string;
}

interface Paragraph {
  en: string;
  pt: string;
  vocab: VocabItem[];
}

interface OpenQuestion {
  question: string;
  hint: string;
  sampleAnswer: string;
  keywords: string[];
}

interface FillItem {
  sentence: string;
  answer: string;
  acceptedAnswers: string[];
  hint: string;
}

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
    const preferred = voices.filter(
      (v) =>
        v.lang.startsWith("en-US") &&
        (v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("google us english") ||
          v.name.toLowerCase().includes("female"))
    );
    if (preferred.length > 0) utterance.voice = preferred[0];
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
      <Volume2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500" />
    </button>
  );
};

// ============================================
// AUDIO PLAYER
// ============================================

function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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
  };

  const stopAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds));
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 shadow-lg text-white mb-8">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">🎧</span>
        <div>
          <h3 className="font-bold text-lg">Lesson 24 – Audio</h3>
          <p className="text-blue-100 text-xs">Listen and repeat the full text</p>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={AUDIO_URL}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        preload="metadata"
      />

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={togglePlay}
          className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
          type="button"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>

        <button
          onClick={stopAudio}
          className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
          type="button"
          title="Stop"
        >
          <Square size={20} />
        </button>

        <button
          onClick={() => skip(-10)}
          className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
          type="button"
          title="Rewind 10s"
        >
          <Rewind size={20} />
        </button>

        <button
          onClick={() => skip(10)}
          className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors"
          type="button"
          title="Forward 10s"
        >
          <FastForward size={20} />
        </button>

        <div className="flex-1 min-w-[180px] mx-2">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => {
              const audio = audioRef.current;
              if (!audio) return;
              audio.currentTime = Number(e.target.value);
            }}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        <span className="text-xs font-mono bg-white/20 px-2 py-1 rounded">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

// ============================================
// IMAGE WITH ZOOM
// ============================================

function ZoomableImage() {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100">
        <div className="overflow-auto max-h-[420px] flex items-center justify-center">
          <img
            src={IMAGE_URL}
            alt="DP Console – Lesson 24"
            style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}
            className="w-full h-auto object-contain cursor-pointer"
            onClick={() => setFullscreen(true)}
          />
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(3, z + 0.25))}
            className="bg-white/90 hover:bg-white text-blue-700 rounded-full p-2 shadow-md transition-all"
            type="button"
            title="Zoom in"
          >
            <ZoomIn size={18} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
            className="bg-white/90 hover:bg-white text-blue-700 rounded-full p-2 shadow-md transition-all"
            type="button"
            title="Zoom out"
          >
            <ZoomOut size={18} />
          </button>
          <button
            onClick={() => setFullscreen(true)}
            className="bg-white/90 hover:bg-white text-blue-700 rounded-full p-2 shadow-md transition-all text-xs px-3"
            type="button"
            title="Expand"
          >
            ⛶
          </button>
        </div>
      </div>

      {fullscreen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreen(false)}
        >
          <img
            src={IMAGE_URL}
            alt="DP Console – Fullscreen"
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setFullscreen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-3 text-xl"
            type="button"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}

// ============================================
// CORRECTION SYSTEM
// ============================================

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'`´]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function checkAnswer(userAnswer: string, acceptedAnswers: string[]): {
  correct: boolean;
  feedback: string;
} {
  const normalized = normalize(userAnswer);
  if (!normalized) {
    return { correct: false, feedback: "⚠️ Please type an answer before checking." };
  }

  const isMatch = acceptedAnswers.some((a) => normalize(a) === normalized);
  if (isMatch) {
    return { correct: true, feedback: "✅ Excellent! Your answer is correct." };
  }

  const partial = acceptedAnswers.some(
    (a) => normalize(a).includes(normalized) || normalized.includes(normalize(a))
  );
  if (partial) {
    return {
      correct: false,
      feedback: "🟡 Almost! Your answer is close. Check the spelling or the exact term.",
    };
  }

  if (/\bshould of\b/.test(normalized)) {
    return {
      correct: false,
      feedback: "❌ Grammar tip: use 'should have', not 'should of'.",
    };
  }
  if (/\bdidnt\b/.test(normalized)) {
    return {
      correct: false,
      feedback: "❌ Spelling tip: write 'didn't' or 'did not'.",
    };
  }
  if (/\bthe the\b/.test(normalized)) {
    return { correct: false, feedback: "❌ You repeated 'the'. Review your sentence." };
  }

  return {
    correct: false,
    feedback: "❌ Not quite. Read the paragraph again and try the key vocabulary.",
  };
}

// ============================================
// PARAGRAPH WITH TRANSLATION & VOCAB
// ============================================

function ParagraphBlock({ paragraph, index }: { paragraph: Paragraph; index: number }) {
  const [showPt, setShowPt] = useState(false);
  const [showVocab, setShowVocab] = useState(false);

  return (
    <div className="bg-white rounded-2xl border-2 border-blue-200 p-5 mb-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
          Paragraph {index + 1}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPt((v) => !v)}
            className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-3 py-1 rounded-full transition-colors"
            type="button"
          >
            {showPt ? "Hide PT" : "🇧🇷 PT"}
          </button>
          <button
            onClick={() => setShowVocab((v) => !v)}
            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-1 rounded-full transition-colors"
            type="button"
          >
            {showVocab ? "Hide Vocab" : "📖 Vocab"}
          </button>
        </div>
      </div>

      <SpeakText text={paragraph.en} className="block w-full text-gray-800 leading-relaxed">
        {paragraph.en}
      </SpeakText>

      {showPt && (
        <p className="mt-3 text-gray-600 italic border-l-4 border-green-400 pl-3 text-sm">
          🇧🇷 {paragraph.pt}
        </p>
      )}

      {showVocab && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {paragraph.vocab.map((v, i) => (
            <div key={i} className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <SpeakText text={v.term} className="font-bold text-blue-700 block">
                {v.term}
              </SpeakText>
              <p className="text-sm text-gray-700 mt-1">{v.definition}</p>
              <p className="text-xs text-gray-500 mt-1 italic">🇧🇷 {v.pt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// FILL-IN-THE-BLANK WITH CORRECTION
// ============================================

function FillExercise({ items }: { items: FillItem[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [results, setResults] = useState<Record<number, { correct: boolean; feedback: string }>>({});

  const handleCheck = (index: number) => {
    const result = checkAnswer(answers[index] || "", items[index].acceptedAnswers);
    setResults((prev) => ({ ...prev, [index]: result }));
  };

  const handleClear = (index: number) => {
    setAnswers((prev) => ({ ...prev, [index]: "" }));
    setResults((prev) => {
      const copy = { ...prev };
      delete copy[index];
      return copy;
    });
  };

  return (
    <div className="space-y-5">
      {items.map((item, idx) => {
        const result = results[idx];
        return (
          <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-gray-800 mb-3">
              <span className="font-bold text-blue-600">Q{idx + 1}.</span> {item.sentence}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={answers[idx] || ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [idx]: e.target.value }))}
                placeholder="Type your answer..."
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full max-w-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={() => handleCheck(idx)}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-colors"
                type="button"
              >
                Check
              </button>
              <button
                onClick={() => handleClear(idx)}
                className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-full transition-colors"
                type="button"
              >
                Clear
              </button>
            </div>

            {result && (
              <div
                className={`mt-3 p-3 rounded-lg text-sm ${
                  result.correct
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {result.feedback}
                {!result.correct && (
                  <p className="mt-1 text-xs text-gray-600">
                    💡 Hint: {item.hint} — Accepted answer:{" "}
                    <strong>{item.acceptedAnswers[0]}</strong>
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// OPEN QUESTION WITH SELF-CHECK
// ============================================

function OpenQuestionCard({ q, index }: { q: OpenQuestion; index: number }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showSample, setShowSample] = useState(false);

  const checkOpenAnswer = () => {
    const normalized = normalize(userAnswer);
    if (!normalized) {
      setFeedback("⚠️ Write your answer first.");
      return;
    }
    const found = q.keywords.filter((k) => normalized.includes(normalize(k)));
    if (found.length >= Math.ceil(q.keywords.length / 2)) {
      setFeedback(`✅ Good answer! You used key ideas: ${found.join(", ")}.`);
    } else if (found.length > 0) {
      setFeedback(
        `🟡 Partial. You mentioned: ${found.join(", ")}. Try to include: ${q.keywords
          .filter((k) => !found.includes(k))
          .join(", ")}.`
      );
    } else {
      setFeedback(
        `❌ Try to use these key words: ${q.keywords.join(", ")}. Read the sample answer for help.`
      );
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-300 mb-5">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💭</span>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 text-lg mb-1">
            Q{index + 1}. {q.question}
          </p>
          <p className="text-blue-600 text-sm italic mb-3">💡 {q.hint}</p>

          <textarea
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Write your answer in English..."
            className="w-full h-24 p-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-sm"
          />

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={checkOpenAnswer}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full transition-colors"
              type="button"
            >
              Check my answer
            </button>
            <button
              onClick={() => setShowSample((v) => !v)}
              className="text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 px-4 py-1.5 rounded-full transition-colors"
              type="button"
            >
              {showSample ? "Hide sample" : "👀 Sample answer"}
            </button>
          </div>

          {feedback && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200 text-sm text-gray-800">
              {feedback}
            </div>
          )}

          {showSample && (
            <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-xs text-purple-700 font-bold mb-1">🗣️ Sample answer:</p>
              <SpeakText text={q.sampleAnswer} className="text-gray-800 text-sm">
                {q.sampleAnswer}
              </SpeakText>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT – LESSON 24
// ============================================

export default function Lesson24() {
  const router = useRouter();

  const [openSections, setOpenSections] = useState({
    text: true,
    translation: true,
    vocabulary: true,
    fill: true,
    open: true,
    review: true,
  });

  const toggle = (k: keyof typeof openSections) =>
    setOpenSections((p) => ({ ...p, [k]: !p[k] }));

  // ---------- DATA ----------

  const paragraphs: Paragraph[] = [
    {
      en: "The vessel Sea Pioneer was doing DP operations near an offshore platform. The weather was good, and the DP system was in Green status. The DPO was on the bridge, watching the DP console. He was also writing in the logbook, so he was very busy.",
      pt: "A embarcação Sea Pioneer estava realizando operações DP perto de uma plataforma offshore. O tempo estava bom, e o sistema DP estava em status Verde. O DPO estava na ponte, observando o console DP. Ele também estava escrevendo no diário de bordo, então estava muito ocupado.",
      vocab: [
        { term: "vessel", definition: "A ship or boat.", pt: "embarcação / navio" },
        { term: "DP operations", definition: "Dynamic Positioning operations.", pt: "operações de posicionamento dinâmico" },
        { term: "offshore platform", definition: "A structure in the sea for oil/gas.", pt: "plataforma offshore" },
        { term: "Green status", definition: "Normal, safe operating condition.", pt: "status Verde" },
        { term: "DPO", definition: "Dynamic Positioning Operator.", pt: "Operador de DP" },
        { term: "bridge", definition: "The control room of a ship.", pt: "ponte de comando" },
        { term: "logbook", definition: "Official record book.", pt: "diário de bordo" },
      ],
    },
    {
      en: "Suddenly, the alarm sounded. The DP console showed a warning: 'Thruster 2 failure.' The vessel started to drift off position. The DPO quickly called the Captain and the Chief Engineer. He switched to manual override and used thrusters 1 and 3 to hold position.",
      pt: "De repente, o alarme soou. O console DP mostrou um aviso: 'Falha no Propulsor 2.' A embarcação começou a derrapar da posição. O DPO rapidamente chamou o Capitão e o Chefe de Máquinas. Ele mudou para sobrescrita manual e usou os propulsores 1 e 3 para manter a posição.",
      vocab: [
        { term: "alarm", definition: "A sound or signal warning of danger.", pt: "alarme" },
        { term: "warning", definition: "A message about a possible problem.", pt: "aviso" },
        { term: "thruster", definition: "Device that moves/positions the vessel.", pt: "propulsor" },
        { term: "failure", definition: "When something stops working.", pt: "falha" },
        { term: "drift off position", definition: "Move away from the correct location.", pt: "derrapar da posição" },
        { term: "Chief Engineer", definition: "Head of the engine department.", pt: "Chefe de Máquinas" },
        { term: "manual override", definition: "Taking manual control.", pt: "sobrescrita manual" },
        { term: "hold position", definition: "Stay in the same place.", pt: "manter a posição" },
      ],
    },
    {
      en: "The Chief Engineer went to the engine room. The thruster motor was too hot. The Captain ordered the emergency generator to be started as a precaution. The DPO asked the ROV team to stand by.",
      pt: "O Chefe de Máquinas foi para a sala de máquinas. O motor do propulsor estava muito quente. O Capitão ordenou que o gerador de emergência fosse acionado como precaução. O DPO pediu à equipe de ROV para ficar de prontidão.",
      vocab: [
        { term: "engine room", definition: "Room where engines are located.", pt: "sala de máquinas" },
        { term: "motor", definition: "Machine that produces movement.", pt: "motor" },
        { term: "overheated", definition: "Too hot.", pt: "superaquecido" },
        { term: "emergency generator", definition: "Backup power source.", pt: "gerador de emergência" },
        { term: "precaution", definition: "Action to prevent danger.", pt: "precaução" },
        { term: "ROV team", definition: "Remotely Operated Vehicle team.", pt: "equipe de ROV" },
        { term: "stand by", definition: "Be ready to act.", pt: "ficar de prontidão" },
      ],
    },
    {
      en: "After 10 minutes, the engineering team fixed the thruster. Thruster 2 came back online, and the vessel returned to normal DP mode. The position was stable again.",
      pt: "Após 10 minutos, a equipe de engenharia consertou o propulsor. O Propulsor 2 voltou a ficar online, e a embarcação retornou ao modo DP normal. A posição estava estável novamente.",
      vocab: [
        { term: "engineering team", definition: "Technical repair team.", pt: "equipe de engenharia" },
        { term: "fix", definition: "Repair.", pt: "consertar" },
        { term: "come back online", definition: "Start working again.", pt: "voltar a funcionar" },
        { term: "normal DP mode", definition: "Standard operating mode.", pt: "modo DP normal" },
        { term: "stable", definition: "Not moving; secure.", pt: "estável" },
      ],
    },
    {
      en: "The Captain called a meeting. He said: 'The DPO was distracted. He should have focused only on the DP console. We must always maintain situational awareness. We must follow the emergency procedures and never change the DP mode without informing the Master.'",
      pt: "O Capitão convocou uma reunião. Ele disse: 'O DPO estava distraído. Ele deveria ter se concentrado apenas no console DP. Devemos sempre manter a consciência situacional. Devemos seguir os procedimentos de emergência e nunca mudar o modo DP sem informar o Mestre.'",
      vocab: [
        { term: "meeting", definition: "A gathering to discuss something.", pt: "reunião" },
        { term: "distracted", definition: "Not focused.", pt: "distraído" },
        { term: "should have focused", definition: "Past regret – he did not focus.", pt: "deveria ter se concentrado" },
        { term: "situational awareness", definition: "Knowing what is happening around you.", pt: "consciência situacional" },
        { term: "emergency procedures", definition: "Steps to follow in an emergency.", pt: "procedimentos de emergência" },
        { term: "Master", definition: "The Captain.", pt: "Mestre / Capitão" },
      ],
    },
    {
      en: "The crew logged the incident and reviewed the FMEA. Lessons learned: always be prepared for failures, always read the manual after a software update, and always ask questions if you are not sure.",
      pt: "A tripulação registrou o incidente e revisou o FMEA. Lições aprendidas: esteja sempre preparado para falhas, sempre leia o manual após uma atualização de software, e sempre faça perguntas se não tiver certeza.",
      vocab: [
        { term: "log the incident", definition: "Write the event in official records.", pt: "registrar o incidente" },
        { term: "review", definition: "Check again.", pt: "revisar" },
        { term: "FMEA", definition: "Failure Mode and Effects Analysis.", pt: "Análise de Modos de Falha e Efeitos" },
        { term: "lessons learned", definition: "Knowledge from an event.", pt: "lições aprendidas" },
        { term: "prepared", definition: "Ready.", pt: "preparado" },
        { term: "software update", definition: "New version of a program.", pt: "atualização de software" },
      ],
    },
  ];

  const fillItems: FillItem[] = [
    {
      sentence: "The DP system was in __________ status at the beginning.",
      answer: "Green",
      acceptedAnswers: ["green"],
      hint: "The safe, normal status color.",
    },
    {
      sentence: "The DP console showed a warning: 'Thruster 2 __________.'",
      answer: "failure",
      acceptedAnswers: ["failure", "failed"],
      hint: "When something stops working.",
    },
    {
      sentence: "The DPO switched to __________ override.",
      answer: "manual",
      acceptedAnswers: ["manual"],
      hint: "Opposite of automatic.",
    },
    {
      sentence: "The thruster __________ was too hot.",
      answer: "motor",
      acceptedAnswers: ["motor"],
      hint: "Machine that produces movement.",
    },
    {
      sentence: "The Captain ordered the emergency __________ to be started.",
      answer: "generator",
      acceptedAnswers: ["generator"],
      hint: "Backup power source.",
    },
    {
      sentence: "After 10 minutes, the engineering team __________ the thruster.",
      answer: "fixed",
      acceptedAnswers: ["fixed", "repaired"],
      hint: "Past tense of 'fix'.",
    },
    {
      sentence: "The Captain said the DPO was __________.",
      answer: "distracted",
      acceptedAnswers: ["distracted"],
      hint: "Not focused.",
    },
    {
      sentence: "We must never change the DP __________ without informing the Master.",
      answer: "mode",
      acceptedAnswers: ["mode"],
      hint: "Operating setting.",
    },
    {
      sentence: "The crew logged the incident and reviewed the __________.",
      answer: "FMEA",
      acceptedAnswers: ["fmea"],
      hint: "Failure Mode and Effects Analysis.",
    },
    {
      sentence: "Always read the __________ after a software update.",
      answer: "manual",
      acceptedAnswers: ["manual"],
      hint: "Book of instructions.",
    },
  ];

  const openQuestions: OpenQuestion[] = [
    {
      question: "What was the DPO doing when the alarm sounded?",
      hint: "Use 'writing', 'logbook', and 'DP console'.",
      sampleAnswer:
        "The DPO was watching the DP console and also writing in the logbook. He was very busy, so he was distracted.",
      keywords: ["watching", "console", "writing", "logbook", "busy", "distracted"],
    },
    {
      question: "What did the DPO do immediately after the thruster failure?",
      hint: "Use 'called', 'manual override', and 'hold position'.",
      sampleAnswer:
        "He called the Captain and the Chief Engineer. He switched to manual override and used thrusters 1 and 3 to hold position.",
      keywords: ["called", "captain", "chief engineer", "manual", "override", "hold", "position"],
    },
    {
      question: "Why did the Captain say the DPO was distracted?",
      hint: "Use 'focused', 'console', and 'situational awareness'.",
      sampleAnswer:
        "The Captain said the DPO was distracted because he should have focused only on the DP console. He did not maintain situational awareness.",
      keywords: ["focused", "console", "situational", "awareness", "distracted"],
    },
    {
      question: "What are the lessons learned from this incident?",
      hint: "Use 'prepared', 'manual', and 'ask questions'.",
      sampleAnswer:
        "Always be prepared for failures. Always read the manual after a software update. Always ask questions if you are not sure.",
      keywords: ["prepared", "failures", "manual", "software", "update", "ask", "questions"],
    },
    {
      question: "What does 'situational awareness' mean in your own words?",
      hint: "Use 'perceive', 'understand', and 'predict'.",
      sampleAnswer:
        "Situational awareness is the ability to perceive, understand, and predict what is happening around you. It helps you react quickly and safely.",
      keywords: ["perceive", "understand", "predict", "happening", "react", "safely"],
    },
  ];

  // ---------- RENDER ----------

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url(${IMAGE_URL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0c4a6e] mb-4">
            🧠 Lesson 24 — Offshore DP: Situational Awareness & Safe Practices
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            📚 Learn how to manage safety, human factors, and DP emergencies.
          </p>
        </div>

        {/* IMAGE ABOVE AUDIO */}
        <div className="mb-8">
          <ZoomableImage />
          <p className="text-center text-sm text-gray-500 mt-2">
            Maintaining situational awareness on the bridge
          </p>
        </div>

        {/* AUDIO PLAYER */}
        <AudioPlayer />

        {/* ===== TEXT ===== */}
        <section className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">🎧 Part 1 – Text for Repetition</h2>
            <button
              onClick={() => toggle("text")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm"
              type="button"
            >
              {openSections.text ? "Hide" : "Show"}
            </button>
          </div>
          {openSections.text && (
            <div className="p-8">
              {paragraphs.map((p, i) => (
                <ParagraphBlock key={i} paragraph={p} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ===== VOCABULARY SUMMARY ===== */}
        <section className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">📖 Part 2 – Vocabulary (Paragraph by Paragraph)</h2>
            <button
              onClick={() => toggle("vocabulary")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm"
              type="button"
            >
              {openSections.vocabulary ? "Hide" : "Show"}
            </button>
          </div>
          {openSections.vocabulary && (
            <div className="p-8">
              {paragraphs.map((p, i) => (
                <div key={i} className="mb-6">
                  <h3 className="font-bold text-blue-700 mb-3">Paragraph {i + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {p.vocab.map((v, j) => (
                      <div key={j} className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                        <SpeakText text={v.term} className="font-bold text-blue-700 block">
                          {v.term}
                        </SpeakText>
                        <p className="text-sm text-gray-700 mt-1">{v.definition}</p>
                        <p className="text-xs text-gray-500 mt-1 italic">🇧🇷 {v.pt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ===== FILL EXERCISES ===== */}
        <section className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">📝 Part 3 – Fill in the Blanks (Auto-Correction)</h2>
            <button
              onClick={() => toggle("fill")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm"
              type="button"
            >
              {openSections.fill ? "Hide" : "Show"}
            </button>
          </div>
          {openSections.fill && (
            <div className="p-8">
              <p className="text-sm text-gray-600 mb-4">
                ✍️ Type your answer and click <strong>Check</strong>. The system will correct you.
              </p>
              <FillExercise items={fillItems} />
            </div>
          )}
        </section>

        {/* ===== OPEN QUESTIONS ===== */}
        <section className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">💭 Part 4 – Open Questions (Correction System)</h2>
            <button
              onClick={() => toggle("open")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm"
              type="button"
            >
              {openSections.open ? "Hide" : "Show"}
            </button>
          </div>
          {openSections.open && (
            <div className="p-8">
              <p className="text-sm text-gray-600 mb-4">
                ✍️ Write your answer in English. The system checks keywords and gives feedback.
              </p>
              {openQuestions.map((q, i) => (
                <OpenQuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* ===== FINAL REVIEW ===== */}
        <section className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-4 px-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">⭐ Part 5 – Final Review</h2>
            <button
              onClick={() => toggle("review")}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-full text-sm"
              type="button"
            >
              {openSections.review ? "Hide" : "Show"}
            </button>
          </div>
          {openSections.review && (
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-blue-600 mb-2">📋 Key Takeaways</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700">
                  <li>Situational awareness is critical during DP operations.</li>
                  <li>Never change DP mode without informing the Master.</li>
                  <li>Always read the manual after a software update.</li>
                  <li>Familiarization is more important than seniority.</li>
                  <li>FMEA trials verify redundancy arrangements.</li>
                  <li>Log every incident and review lessons learned.</li>
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h3 className="font-bold text-blue-600 mb-2">🇧🇷 Resumo em Português</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 text-sm">
                  <li>A consciência situacional é crítica durante operações DP.</li>
                  <li>Nunca mude o modo DP sem informar o Mestre.</li>
                  <li>Sempre leia o manual após uma atualização de software.</li>
                  <li>A familiarização é mais importante que a senioridade.</li>
                  <li>Os testes do FMEA verificam os arranjos de redundância.</li>
                  <li>Registre cada incidente e revise as lições aprendidas.</li>
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* NAVIGATION */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/offshore/lesson23-offshore")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            ← Previous Lesson (23)
          </button>
          <button
            onClick={() => router.push("/cursos/offshore/lesson25-offshore")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
            type="button"
          >
            Next Lesson (25) →
          </button>
        </div>
      </div>
    </div>
  );
}