"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  Info,
  ChevronDown,
  ChevronRight,
  Languages,
  Pencil,
  Check,
  X,
} from "lucide-react";

// ============================================================
// SPEECH SYSTEM (American Female Voice)
// ============================================================
const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.filter(
    (v) =>
      (v.lang === "en-US" || v.lang.startsWith("en-US")) &&
      (v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("google us english") ||
        v.name.toLowerCase().includes("siri") ||
        v.name.toLowerCase().includes("female"))
  );
  const american = voices.filter(
    (v) => v.lang === "en-US" || v.lang.startsWith("en-US")
  );
  if (preferred.length > 0) utterance.voice = preferred[0];
  else if (american.length > 0) utterance.voice = american[0];
  window.speechSynthesis.speak(utterance);
};

// ============================================================
// CLICKABLE TERM
// ============================================================
function T({ en, pt }: { en: string; pt: string }) {
  const [show, setShow] = useState(false);
  return (
    <span>
      <button
        onClick={() => {
          speakEnglish(en);
          setShow((s) => !s);
        }}
        className="cursor-pointer border-b border-dotted border-amber-400/70 hover:bg-amber-400/20 transition-colors text-left"
        title="Clique para ouvir + ver tradução"
      >
        {en}
      </button>
      {show && (
        <span className="text-amber-600 text-xs font-normal ml-1">= {pt}</span>
      )}
    </span>
  );
}

// ============================================================
// TRANSLATION TOGGLE
// ============================================================
function Translation({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 bg-blue-900/60 hover:bg-blue-800 text-blue-100 text-xs font-semibold px-4 py-2 rounded-full border border-blue-700 transition-all"
      >
        <Languages size={14} />
        {open ? "Ocultar Tradução" : "Ver Tradução em Português"}
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
// EXPLANATION BOX
// ============================================================
function Explanation({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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

// ============================================================
// SECTION LAYOUT
// ============================================================
function Section({
  num,
  title,
  subtitle,
  image,
  imageAlt,
  children,
}: {
  num: number;
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="bg-amber-400 text-slate-900 text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
            {num}
          </span>
          <div>
            <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
            {subtitle && (
              <p className="text-blue-100 text-sm mt-0.5 italic">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {image && (
          <div className="mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={imageAlt || title}
              className="w-full max-h-[420px] object-cover rounded-2xl shadow-md"
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ============================================================
// IDIOM CARD
// ============================================================
function Idiom({
  en,
  pt,
  example,
  examplePt,
}: {
  en: string;
  pt: string;
  example: string;
  examplePt: string;
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-3">
      <div className="flex flex-wrap items-baseline gap-2 mb-2">
        <button
          onClick={() => speakEnglish(en)}
          className="text-blue-700 font-bold text-base hover:text-blue-900 transition-colors flex items-center gap-1"
        >
          <Volume2 size={14} className="opacity-60" />
          {en}
        </button>
        <span className="text-gray-500 text-sm">= {pt}</span>
      </div>
      <p className="text-slate-700 text-sm italic">
        &ldquo;
        <T en={example} pt={examplePt} />
        &rdquo;
      </p>
      <p className="text-slate-500 text-xs mt-1">&rarr; {examplePt}</p>
    </div>
  );
}

// ============================================================
// QUESTION LIST — with pencil editor
// ============================================================
function Questions({ items }: { items: { en: string; pt: string }[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState("");

  const openEditor = (i: number) => {
    setOpenIndex(i);
    setDraft(answers[i] || "");
  };

  const saveAnswer = () => {
    if (openIndex !== null) {
      setAnswers((prev) => ({ ...prev, [openIndex]: draft }));
    }
    setOpenIndex(null);
  };

  const closeEditor = () => {
    setOpenIndex(null);
    setDraft("");
  };

  return (
    <>
      <ol className="list-decimal pl-6 space-y-4 text-slate-800">
        {items.map((q, i) => (
          <li key={i}>
            <div className="flex items-start gap-2">
              <button
                onClick={() => speakEnglish(q.en)}
                className="text-left hover:bg-blue-100 rounded px-1 -mx-1 transition-colors flex-1"
              >
                <span className="font-medium">{q.en}</span>
              </button>
              <button
                onClick={() => openEditor(i)}
                className="flex-shrink-0 p-1.5 rounded-lg hover:bg-amber-100 text-amber-600 hover:text-amber-800 transition-colors border border-amber-200"
                title="Escrever resposta"
                aria-label="Escrever resposta"
              >
                <Pencil size={15} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 italic">{q.pt}</p>
            {answers[i] && answers[i].trim() !== "" && (
              <div className="mt-2 bg-emerald-50 border-l-4 border-emerald-400 rounded-r-lg p-2 flex items-start gap-2">
                <Check
                  size={14}
                  className="text-emerald-600 flex-shrink-0 mt-0.5"
                />
                <p className="text-sm text-emerald-800 whitespace-pre-line">
                  {answers[i]}
                </p>
              </div>
            )}
          </li>
        ))}
      </ol>

      {/* Editor Modal */}
      {openIndex !== null && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={closeEditor}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Pencil size={18} />
                Escreva sua resposta
              </h3>
              <button
                onClick={closeEditor}
                className="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Question preview */}
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-xs uppercase tracking-wider text-blue-600 font-bold mb-1">
                  📌 Pergunta
                </p>
                <p className="font-semibold text-slate-800 text-base">
                  {items[openIndex].en}
                </p>
                <p className="text-sm text-gray-500 mt-1 italic">
                  {items[openIndex].pt}
                </p>
                <button
                  onClick={() => speakEnglish(items[openIndex].en)}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
                >
                  <Volume2 size={12} /> Ouvir a pergunta
                </button>
              </div>

              {/* Answer textarea */}
              <label className="block text-xs uppercase tracking-wider text-gray-500 font-bold mb-2">
                ✍️ Sua resposta em inglês
              </label>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your answer here... / Escreva sua resposta aqui..."
                className="w-full h-44 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none text-slate-800 text-base leading-relaxed"
                autoFocus
              />

              {/* Footer */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={closeEditor}
                  className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-full transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveAnswer}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all shadow-md flex items-center gap-2"
                >
                  <Check size={16} />
                  Salvar resposta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AutomotiveDesignLesson() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ============== HEADER ============== */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl">
          <span className="inline-block bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Conversation English — Lesson 28
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-amber-300">
            🚛 Automotive Design — Marcelo&apos;s World
          </h1>
          <p className="text-amber-200 text-lg italic mb-4">
            Design automotivo — O mundo do Marcelo
          </p>
          <p className="text-blue-100 max-w-3xl mx-auto text-base md:text-lg">
            In this lesson, we dive into the world of <strong>automotive design</strong> — car
            parts, trucks, buses, CATIA, engineering drawings, and the international side of the
            profession. Click any underlined word to <strong>hear it</strong> and{" "}
            <strong>see the translation</strong>. Use the ✏️ <strong>pencil</strong> next to each
            question to write your answer.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs">
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              🔊 Clique para ouvir
            </span>
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              🇧🇷 Tradução em PT
            </span>
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              ✏️ Escreva suas respostas
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 1 — CATIA & TOOLS                                        */}
        {/* ================================================================ */}
        <Section
          num={1}
          title="The Toolbox — CATIA & CAD"
          subtitle="As ferramentas — CATIA & CAD"
        >
          <p className="text-slate-700 mb-4 italic">
            Every automotive designer lives inside a CAD program. Let&apos;s talk about the tools
            of the trade — from CATIA to CAD, from a sketch to a full 3D model.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to have a knack for"
            pt="ter jeito / talento pra"
            example="Marcelo has a knack for turning a rough sketch into a clean 3D model."
            examplePt="O Marcelo tem jeito pra transformar um esboço cru num modelo 3D limpo."
          />
          <Idiom
            en="to get the hang of it"
            pt="pegar o jeito"
            example="CATIA looks intimidating at first, but once you get the hang of it, it flows."
            examplePt="O CATIA assusta no começo, mas depois que você pega o jeito, flui."
          />
          <Idiom
            en="to be on the cutting edge"
            pt="estar na vanguarda / no topo da tecnologia"
            example="Good automotive engineers are always on the cutting edge of simulation tools."
            examplePt="Bons engenheiros automotivos estão sempre na vanguarda das ferramentas de simulação."
          />
          <Idiom
            en="to think outside the box"
            pt="pensar fora da caixa"
            example="You can&apos;t design the next great bumper if you don&apos;t think outside the box."
            examplePt="Você não desenha o próximo grande para-choque se não pensar fora da caixa."
          />
          <Idiom
            en="to reinvent the wheel"
            pt="reinventar a roda (perder tempo com o que já existe)"
            example="Don&apos;t reinvent the wheel — reuse the same bracket from the previous project."
            examplePt="Não reinvente a roda — reaproveite o mesmo suporte do projeto anterior."
          />
          <Idiom
            en="to be a stickler for detail"
            pt="ser obsessivo com detalhes"
            example="Marcelo is a stickler for detail — even a 0.5 mm tolerance bothers him."
            examplePt="O Marcelo é obsessivo com detalhes — até uma tolerância de 0,5 mm o incomoda."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🔧 Key Vocabulary — Tools &amp; Concepts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">CAD</strong> — Desenho Assistido por Computador (CAD)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">CATIA</strong> — o software usado no setor (aqui se fala &quot;Catia&quot; mesmo)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">3D modeling</strong> — modelagem 3D
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">drafting</strong> — desenho técnico / prancheta
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">tolerance</strong> — tolerância
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">blueprint</strong> — planta / projeto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">assembly</strong> — montagem / conjunto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">prototype</strong> — protótipo
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">constraint</strong> — restrição (do modelo)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">sketch</strong> — esboço
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "How did you first get into automotive design, and what made you stick with it?",
                pt: "Como você entrou no design automotivo, e o que te fez continuar na área?",
              },
              {
                en: "What is your daily routine like in CATIA — do you start with a sketch or with an existing model?",
                pt: "Como é sua rotina diária no CATIA — você começa com um esboço ou com um modelo existente?",
              },
              {
                en: "Which CATIA workbench do you use the most, and why — Part Design, Assembly, Generative Shape Design?",
                pt: "Qual workbench do CATIA você mais usa, e por quê — Part Design, Assembly, Generative Shape Design?",
              },
              {
                en: "Have you ever had to redesign a part because of a tolerance error? Tell me the story.",
                pt: "Você já teve que refazer uma peça por causa de erro de tolerância? Me conte a história.",
              },
              {
                en: "Do you prefer working alone on a single part or collaborating on a full assembly?",
                pt: "Você prefere trabalhar sozinho numa peça ou colaborar num conjunto completo?",
              },
              {
                en: "How do you keep up with new versions of CATIA and new simulation tools?",
                pt: "Como você se mantém atualizado com as novas versões do CATIA e novas ferramentas de simulação?",
              },
              {
                en: "If you could automate one boring task in your daily CAD work, what would it be?",
                pt: "Se você pudesse automatizar uma tarefa chata do seu dia a dia no CAD, qual seria?",
              },
              {
                en: "What advice would you give a young engineer who wants to work with automotive design?",
                pt: "Que conselho você daria a um engenheiro jovem que quer trabalhar com design automotivo?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (nível C1):
- to have a knack for = ter jeito / talento pra
- to get the hang of it = pegar o jeito
- to be on the cutting edge = estar na vanguarda
- to think outside the box = pensar fora da caixa
- to reinvent the wheel = reinventar a roda
- to be a stickler for detail = ser obsessivo com detalhes

🔧 Vocabulário técnico:
- CAD = Desenho Assistido por Computador
- CATIA = o software (fala-se "Catia")
- 3D modeling = modelagem 3D
- drafting = desenho técnico
- tolerance = tolerância
- blueprint = planta / projeto
- assembly = montagem / conjunto
- prototype = protótipo
- constraint = restrição
- sketch = esboço

❓ Perguntas:
1. Como você entrou no design automotivo e o que te fez continuar?
2. Como é sua rotina diária no CATIA?
3. Qual workbench do CATIA você mais usa e por quê?
4. Você já refez uma peça por erro de tolerância? Me conte.
5. Você prefere trabalhar sozinho ou em conjunto?
6. Como você se atualiza nas novas versões do CATIA?
7. Se pudesse automatizar uma tarefa chata, qual seria?
8. Que conselho daria a um jovem engenheiro?`}
          </Translation>

          <Explanation title="Por que essa seção importa">
            <p>
              Falar de <em>CATIA</em>, <em>workbenches</em>, <em>constraints</em> e{" "}
              <em>tolerances</em> em inglês é o que separa um designer que só executa de um designer
              que consegue <strong>negociar projetos com clientes internacionais</strong>. Essas
              expressões aparecem em reuniões técnicas, e-mails e entrevistas de emprego no exterior.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 2 — VEHICLE TYPES                                        */}
        {/* ================================================================ */}
        <Section
          num={2}
          title="Vehicle Types — Cars, Trucks & Buses"
          subtitle="Tipos de veículos — Carros, caminhões e ônibus"
        >
          <p className="text-slate-700 mb-4 italic">
            From a compact hatchback to a 40-ton semi-truck to a city bus — each one has its own
            design challenges. Let&apos;s talk about the world you work in.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to be built like a tank"
            pt="ser robusto que nem um tanque"
            example="German semi-trucks are built like tanks — they last decades on the road."
            examplePt="Caminhões alemães são robustos que nem tanque — duram décadas na estrada."
          />
          <Idiom
            en="to be a workhorse"
            pt="ser um cavalo de batalha / pau pra toda obra"
            example="The Volkswagen Kombi was a real workhorse for Brazilian families."
            examplePt="A Kombi era um verdadeiro pau pra toda obra pras famílias brasileiras."
          />
          <Idiom
            en="to have a lot on one's plate"
            pt="estar com muita coisa pra resolver"
            example="The engineering team has a lot on their plate this quarter — three new bus models."
            examplePt="A equipe de engenharia está com muita coisa pra resolver esse trimestre — três ônibus novos."
          />
          <Idiom
            en="to push the envelope"
            pt="empurrar os limites / inovar no limite"
            example="Electric buses are pushing the envelope of what we thought was possible."
            examplePt="Ônibus elétricos estão empurrando os limites do que a gente achava possível."
          />
          <Idiom
            en="to be in the driver's seat"
            pt="estar no controle / no comando"
            example="Marcelo is in the driver's seat on the new truck cabin project."
            examplePt="O Marcelo está no comando do novo projeto da cabine do caminhão."
          />
          <Idiom
            en="to go the extra mile"
            pt="fazer além do esperado"
            example="He always goes the extra mile to make sure the CAD model is flawless."
            examplePt="Ele sempre faz além do esperado pra garantir que o modelo CAD esteja impecável."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🚗 Vehicle Vocabulary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">hatchback</strong> — hatch (carro com porta traseira)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">sedan</strong> — sedã
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">SUV / pickup truck</strong> — SUV / picape
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">semi-truck / tractor-trailer</strong> — carreta / caminhão
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">dump truck</strong> — caminhão basculante
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">tanker</strong> — caminhão-tanque
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">flatbed</strong> — prancha / carreta prancha
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">refrigerated truck</strong> — caminhão frigorífico
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">city bus / coach</strong> — ônibus urbano / rodoviário
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">articulated bus</strong> — ônibus articulado (sanfonado)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">double-decker</strong> — ônibus de dois andares
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">chassis cab</strong> — chassi-cabine
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "Which vehicle type do you find the most challenging to design — cars, trucks or buses? Why?",
                pt: "Qual tipo de veículo você acha mais desafiador de projetar — carros, caminhões ou ônibus? Por quê?",
              },
              {
                en: "How different is the design process for a truck cabin compared to a passenger car?",
                pt: "O quanto o processo de design de uma cabine de caminhão é diferente do de um carro de passeio?",
              },
              {
                en: "What are the unique engineering constraints of a city bus versus a coach?",
                pt: "Quais são as restrições de engenharia únicas de um ônibus urbano em comparação com um rodoviário?",
              },
              {
                en: "Have you ever worked on a project that involved electric or hybrid vehicles?",
                pt: "Você já trabalhou em algum projeto com veículos elétricos ou híbridos?",
              },
              {
                en: "Which market dictates design trends today — Europe, the US or Asia?",
                pt: "Qual mercado hoje dita as tendências de design — Europa, EUA ou Ásia?",
              },
              {
                en: "Do you prefer designing for function (trucks) or for aesthetics (sports cars)?",
                pt: "Você prefere projetar pensando na função (caminhões) ou na estética (esportivos)?",
              },
              {
                en: "If you had total freedom, which vehicle would you redesign from scratch?",
                pt: "Se você tivesse total liberdade, qual veículo você redesenharia do zero?",
              },
              {
                en: "What makes a truck look powerful in a design sense?",
                pt: "O que faz um caminhão parecer potente no sentido de design?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (C1):
- to be built like a tank = ser robusto que nem um tanque
- to be a workhorse = ser pau pra toda obra
- to have a lot on one's plate = estar com muita coisa pra resolver
- to push the envelope = empurrar os limites
- to be in the driver's seat = estar no comando
- to go the extra mile = fazer além do esperado

🚗 Veículos:
- hatchback = hatch
- sedan = sedã
- SUV / pickup truck = SUV / picape
- semi-truck / tractor-trailer = carreta / caminhão
- dump truck = caminhão basculante
- tanker = caminhão-tanque
- flatbed = prancha
- refrigerated truck = caminhão frigorífico
- city bus / coach = ônibus urbano / rodoviário
- articulated bus = ônibus articulado
- double-decker = ônibus de dois andares
- chassis cab = chassi-cabine

❓ Perguntas:
1. Qual tipo de veículo é mais desafiador de projetar?
2. Como o design da cabine do caminhão difere do carro?
3. Quais restrições únicas tem um ônibus urbano?
4. Você já trabalhou com veículos elétricos ou híbridos?
5. Qual mercado dita as tendências hoje?
6. Você prefere função (caminhões) ou estética (esportivos)?
7. Qual veículo você redesenharia do zero?
8. O que faz um caminhão parecer potente?`}
          </Translation>

          <Explanation title="Por que essa seção é estratégica">
            <p>
              Saber dizer <em>dump truck</em>, <em>flatbed</em>, <em>articulated bus</em> em inglês
              é o que te permite <strong>trabalhar com clientes de fora</strong> sem ficar travado.
              Muitas dessas palavras aparecem em datasheets, catálogos e e-mails de fornecedores
              europeus e americanos.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 3 — PARTS & COMPONENTS                                   */}
        {/* ================================================================ */}
        <Section
          num={3}
          title="Parts & Components — What You Design"
          subtitle="Peças e componentes — O que você projeta"
        >
          <p className="text-slate-700 mb-4 italic">
            Under the hood and under the skin, every vehicle is a puzzle of thousands of parts.
            Let&apos;s go through the vocabulary of the parts you actually design in CATIA.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to dot the i's and cross the t's"
            pt="caprichar nos detalhes / não deixar ponta solta"
            example="Before submitting the drawing, we have to dot the i's and cross the t's."
            examplePt="Antes de mandar o desenho, temos que não deixar ponta solta."
          />
          <Idiom
            en="to iron out the kinks"
            pt="resolver os probleminhas"
            example="We spent a week ironing out the kinks in the suspension assembly."
            examplePt="Passamos uma semana resolvendo os probleminhas da suspensão."
          />
          <Idiom
            en="to be a pain in the neck"
            pt="ser um pé no saco"
            example="The wiring harness is a pain in the neck to route around the new dashboard."
            examplePt="O chicote elétrico é um pé no saco pra passar em volta do painel novo."
          />
          <Idiom
            en="to fit like a glove"
            pt="encaixar como uma luva"
            example="The new brake caliper fits like a glove inside the 17-inch wheel."
            examplePt="A nova pinça de freio encaixa como uma luva dentro da roda 17."
          />
          <Idiom
            en="to have a lot of moving parts"
            pt="ter muita coisa envolvida"
            example="The steering system has a lot of moving parts — literally."
            examplePt="O sistema de direção tem muita coisa envolvida — literalmente."
          />
          <Idiom
            en="to be the weakest link"
            pt="ser o elo mais fraco"
            example="A badly designed bracket can be the weakest link in the whole chassis."
            examplePt="Um suporte mal projetado pode ser o elo mais fraco do chassi inteiro."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🔩 Parts Vocabulary — Exterior
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">bumper</strong> — para-choque
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">fender</strong> — para-lama
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">hood</strong> — capô
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">trunk</strong> — porta-malas
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">windshield</strong> — para-brisa
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">grille</strong> — grade (do radiador)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">headlight / taillight</strong> — farol / lanterna
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">side mirror</strong> — retrovisor
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">door panel</strong> — painel da porta
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">roof rack</strong> — bagageiro de teto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">molding / trim</strong> — moldura / acabamento
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">wheel arch</strong> — caixa de roda
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            ⚙️ Parts Vocabulary — Internal / Mechanical
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">chassis</strong> — chassi
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">subframe</strong> — subchassi
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">steering wheel</strong> — volante
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">dashboard</strong> — painel
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">gearbox / transmission</strong> — câmbio
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">clutch</strong> — embreagem
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">brake pad / brake disc</strong> — pastilha / disco de freio
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">brake caliper</strong> — pinça de freio
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">suspension</strong> — suspensão
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">shock absorber</strong> — amortecedor
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">coil spring</strong> — mola helicoidal
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">axle</strong> — eixo
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">differential</strong> — diferencial
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">driveshaft</strong> — cardã
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">exhaust system</strong> — escapamento
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">catalytic converter</strong> — catalisador
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">radiator</strong> — radiador
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">engine mount</strong> — coxim do motor
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">wiring harness</strong> — chicote elétrico
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">fuel tank</strong> — tanque de combustível
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">turbocharger</strong> — turbina
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">intercooler</strong> — intercooler
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🚛 Truck-Specific Parts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">cab / cabin</strong> — cabine
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">sleeper cab</strong> — cabine leito
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">trailer</strong> — carreta / reboque
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">semi-trailer</strong> — semirreboque
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">fifth wheel</strong> — quinta roda
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">kingpin</strong> — pino-rei
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">cargo bed</strong> — carroceria
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">landing gear</strong> — pernas de apoio (do reboque)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">mudflap</strong> — para-barro
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">air brake</strong> — freio a ar
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">air suspension</strong> — suspensão a ar
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">exhaust brake</strong> — freio motor
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🚌 Bus-Specific Parts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">body</strong> — carroceria
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">aisle</strong> — corredor
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">seats</strong> — poltronas / bancos
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">luggage compartment</strong> — bagageiro
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">wheelchair ramp</strong> — rampa para cadeirante
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">handrail</strong> — corrimão
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">fare box</strong> — catraca / cobrador
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">emergency exit</strong> — saída de emergência
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "Which part of a vehicle do you enjoy designing the most, and why?",
                pt: "Qual peça de um veículo você mais gosta de projetar, e por quê?",
              },
              {
                en: "What is the most difficult part you have ever modeled in CATIA? Walk me through it.",
                pt: "Qual foi a peça mais difícil que você já modelou no CATIA? Me explica o processo.",
              },
              {
                en: "How do you balance weight, strength and cost when designing a new component?",
                pt: "Como você equilibra peso, resistência e custo ao projetar um componente novo?",
              },
              {
                en: "Have you ever worked on a part that failed in the field? What did you learn?",
                pt: "Você já trabalhou numa peça que deu problema em campo? O que você aprendeu?",
              },
              {
                en: "What is the role of a wiring harness in a modern vehicle, and how complex is it to design?",
                pt: "Qual é o papel do chicote elétrico num veículo moderno, e o quanto é complexo projetá-lo?",
              },
              {
                en: "Which part of a truck do you think is most underrated by non-engineers?",
                pt: "Qual peça de caminhão você acha mais subestimada por quem não é engenheiro?",
              },
              {
                en: "If you had to redesign a brake caliper for weight reduction, where would you start?",
                pt: "Se você tivesse que redesenhar uma pinça de freio pra reduzir peso, por onde começaria?",
              },
              {
                en: "What is the difference between designing a body panel and a structural part?",
                pt: "Qual é a diferença entre projetar um painel de carroceria e uma peça estrutural?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (C1):
- to dot the i's and cross the t's = caprichar nos detalhes
- to iron out the kinks = resolver os probleminhas
- to be a pain in the neck = ser um pé no saco
- to fit like a glove = encaixar como uma luva
- to have a lot of moving parts = ter muita coisa envolvida
- to be the weakest link = ser o elo mais fraco

🔩 Peças (exterior):
- bumper = para-choque
- fender = para-lama
- hood = capô
- trunk = porta-malas
- windshield = para-brisa
- grille = grade
- headlight / taillight = farol / lanterna
- side mirror = retrovisor
- door panel = painel da porta
- roof rack = bagageiro de teto
- molding / trim = moldura / acabamento
- wheel arch = caixa de roda

⚙️ Peças (internas):
- chassis = chassi
- subframe = subchassi
- steering wheel = volante
- dashboard = painel
- gearbox = câmbio
- clutch = embreagem
- brake pad / disc = pastilha / disco de freio
- brake caliper = pinça de freio
- suspension = suspensão
- shock absorber = amortecedor
- coil spring = mola helicoidal
- axle = eixo
- differential = diferencial
- driveshaft = cardã
- exhaust = escapamento
- catalytic converter = catalisador
- radiator = radiador
- engine mount = coxim do motor
- wiring harness = chicote elétrico
- fuel tank = tanque de combustível
- turbocharger = turbina
- intercooler = intercooler

🚛 Caminhão:
- cab / cabin = cabine
- sleeper cab = cabine leito
- trailer = carreta
- semi-trailer = semirreboque
- fifth wheel = quinta roda
- kingpin = pino-rei
- cargo bed = carroceria
- landing gear = pernas de apoio
- mudflap = para-barro
- air brake = freio a ar
- air suspension = suspensão a ar
- exhaust brake = freio motor

🚌 Ônibus:
- body = carroceria
- aisle = corredor
- seats = poltronas
- luggage compartment = bagageiro
- wheelchair ramp = rampa pra cadeirante
- handrail = corrimão
- fare box = catraca
- emergency exit = saída de emergência

❓ Perguntas:
1. Qual peça você mais gosta de projetar?
2. Qual foi a peça mais difícil de modelar no CATIA?
3. Como você equilibra peso, resistência e custo?
4. Você já trabalhou com uma peça que falhou em campo?
5. Qual o papel do chicote elétrico e a complexidade?
6. Qual peça de caminhão é subestimada?
7. Como redesenhar uma pinça de freio mais leve?
8. Diferença entre painel de carroceria e peça estrutural?`}
          </Translation>

          <Explanation title="Vocabulário que abre portas">
            <p>
              Esse vocabulário é o <strong>coração do seu trabalho</strong>. Quando você consegue
              dizer <em>fifth wheel</em>, <em>kingpin</em>, <em>driveshaft</em> sem pensar, você
              entra em qualquer reunião de engenharia internacional sem travar. Muitas dessas
              palavras aparecem em <strong>desenhos 2D, plant as e datasheets</strong> de
              fornecedores — vale a pena memorizar aos poucos, aos poucos.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 4 — GOING INTERNATIONAL                                  */}
        {/* ================================================================ */}
        <Section
          num={4}
          title="Going International — Working Abroad"
          subtitle="Internacionalização — Trabalhando fora do país"
        >
          <p className="text-slate-700 mb-4 italic">
            Automotive design is one of the most globalized engineering fields. Germany, Japan,
            the US, Sweden, China — every big OEM hires engineers from everywhere. Let&apos;s talk
            about working internationally.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to be cut out for"
            pt="ter perfil pra / nasceu pra"
            example="Not everyone is cut out for moving to another country."
            examplePt="Nem todo mundo nasceu pra se mudar pra outro país."
          />
          <Idiom
            en="to take the plunge"
            pt="dar o passo decisivo / se jogar"
            example="He finally took the plunge and applied for a job in Germany."
            examplePt="Ele finalmente se jogou e aplicou pra uma vaga na Alemanha."
          />
          <Idiom
            en="to be on the same page"
            pt="estar alinhado / na mesma sintonia"
            example="We need to make sure every plant is on the same page about the drawing standards."
            examplePt="Precisamos garantir que toda planta esteja alinhada quanto aos padrões do desenho."
          />
          <Idiom
            en="to bridge the gap"
            pt="fazer a ponte / reduzir a distância"
            example="English bridges the gap between Brazilian engineers and German clients."
            examplePt="O inglês faz a ponte entre engenheiros brasileiros e clientes alemães."
          />
          <Idiom
            en="to wear many hats"
            pt="acumular várias funções"
            example="In a small company, a designer often has to wear many hats."
            examplePt="Numa empresa pequena, o projetista muitas vezes tem que acumular várias funções."
          />
          <Idiom
            en="to be in high demand"
            pt="estar em alta / muito requisitado"
            example="Automotive engineers with CATIA skills are in high demand in Europe."
            examplePt="Engenheiros automotivos com CATIA estão em alta na Europa."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">
            🌍 International Vocabulary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">OEM</strong> — montadora (original equipment manufacturer)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">Tier 1 supplier</strong> — fornecedor nível 1
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">offshore team</strong> — time remoto / offshore
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">cross-functional team</strong> — time multidisciplinar
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">design review</strong> — revisão de projeto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">design freeze</strong> — congelamento do projeto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">engineering change</strong> — alteração de engenharia (ECR/ECN)
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">BOM (bill of materials)</strong> — lista de materiais
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">FMEA</strong> — análise de modos de falha
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">GD&amp;T</strong> — tolerância geométrica
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">PLM</strong> — gestão do ciclo de vida do produto
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <strong className="text-blue-700">benchmarking</strong> — benchmarking
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "If you had the chance to work abroad, which country would you pick and why?",
                pt: "Se você tivesse a chance de trabalhar fora do país, qual país escolheria e por quê?",
              },
              {
                en: "What do you think would be the biggest cultural challenge of working in a German or Japanese company?",
                pt: "Qual você acha que seria o maior desafio cultural de trabalhar numa empresa alemã ou japonesa?",
              },
              {
                en: "How important is English in your daily work, and where do you feel you need to improve?",
                pt: "O quanto o inglês é importante no seu trabalho diário, e onde você sente que precisa melhorar?",
              },
              {
                en: "Have you ever worked remotely with a team from another country? What was it like?",
                pt: "Você já trabalhou remotamente com um time de outro país? Como foi?",
              },
              {
                en: "What is the difference between working for a Brazilian OEM and a European Tier 1 supplier?",
                pt: "Qual é a diferença entre trabalhar numa montadora brasileira e num fornecedor europeu de nível 1?",
              },
              {
                en: "Would you rather relocate permanently or work as a consultant flying in and out?",
                pt: "Você preferiria se mudar de vez ou trabalhar como consultor indo e voltando?",
              },
              {
                en: "What technical vocabulary do you wish you had learned earlier in your career?",
                pt: "Que vocabulário técnico você gostaria de ter aprendido mais cedo na carreira?",
              },
              {
                en: "How would you introduce your job to a foreign engineer in 30 seconds?",
                pt: "Como você apresentaria seu trabalho a um engenheiro estrangeiro em 30 segundos?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (C1):
- to be cut out for = ter perfil pra / nasceu pra
- to take the plunge = dar o passo decisivo
- to be on the same page = estar alinhado
- to bridge the gap = fazer a ponte
- to wear many hats = acumular várias funções
- to be in high demand = estar em alta

🌍 Vocabulário internacional:
- OEM = montadora
- Tier 1 supplier = fornecedor nível 1
- offshore team = time remoto
- cross-functional team = time multidisciplinar
- design review = revisão de projeto
- design freeze = congelamento do projeto
- engineering change = alteração de engenharia
- BOM = lista de materiais
- FMEA = análise de modos de falha
- GD&T = tolerância geométrica
- PLM = gestão do ciclo de vida do produto
- benchmarking = benchmarking

❓ Perguntas:
1. Qual país você escolheria se pudesse trabalhar fora?
2. Maior desafio cultural de trabalhar em empresa alemã ou japonesa?
3. O quanto o inglês é importante e onde você precisa melhorar?
4. Você já trabalhou remotamente com time de outro país?
5. Diferença entre montadora brasileira e fornecedor europeu?
6. Se mudar de vez ou ser consultor?
7. Que vocabulário técnico você gostaria de ter aprendido antes?
8. Como apresentaria seu trabalho em 30 segundos?`}
          </Translation>

          <Explanation title="O inglês técnico como alavanca de carreira">
            <p>
              A diferença entre um engenheiro que ganha R$ 8 mil no Brasil e um que ganha € 5 mil
              na Alemanha, muitas vezes, <strong>é o inglês técnico</strong>. Saber dizer{" "}
              <em>engineering change</em>, <em>design freeze</em> e <em>BOM</em> em uma reunião
              faz toda a diferença na hora de ser promovido ou contratado por uma multinacional.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 5 — PERSONAL LIFE & BALANCE                              */}
        {/* ================================================================ */}
        <Section
          num={5}
          title="Personal Life — The Man Behind the Screen"
          subtitle="Vida pessoal — O homem por trás da tela"
        >
          <p className="text-slate-700 mb-4 italic">
            Engineering is a demanding profession. Long hours, tight deadlines, endless revisions.
            Let&apos;s talk about how you balance work and life.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to burn the midnight oil"
            pt="virar a noite trabalhando"
            example="Before the design freeze, we burned the midnight oil for a whole week."
            examplePt="Antes do congelamento do projeto, viramos a noite por uma semana inteira."
          />
          <Idiom
            en="to be swamped"
            pt="estar atolado de trabalho"
            example="I can&apos;t meet today — I&apos;m swamped with three projects at once."
            examplePt="Não consigo me encontrar hoje — estou atolado com três projetos ao mesmo tempo."
          />
          <Idiom
            en="to recharge one's batteries"
            pt="recarregar as baterias"
            example="A weekend at the beach is exactly what I need to recharge my batteries."
            examplePt="Um fim de semana na praia é exatamente o que eu preciso pra recarregar as baterias."
          />
          <Idiom
            en="to strike a balance"
            pt="achar o equilíbrio"
            example="It took me years to strike a balance between work and family."
            examplePt="Levei anos pra achar o equilíbrio entre trabalho e família."
          />
          <Idiom
            en="to leave work at work"
            pt="deixar o trabalho no trabalho"
            example="I try to leave work at work, but sometimes CATIA follows me home."
            examplePt="Eu tento deixar o trabalho no trabalho, mas às vezes o CATIA me segue pra casa."
          />
          <Idiom
            en="to be glued to the screen"
            pt="ficar grudado na tela"
            example="I spend 9 hours a day glued to the screen — my eyes hurt by Friday."
            examplePt="Passo 9 horas por dia grudado na tela — meus olhos doem na sexta."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "How do you usually unwind after a long day staring at CATIA?",
                pt: "Como você costuma relaxar depois de um dia longo olhando pro CATIA?",
              },
              {
                en: "What is a normal working day like for you — from the moment you sit down to the moment you leave?",
                pt: "Como é um dia normal de trabalho pra você — do momento que senta até o momento que sai?",
              },
              {
                en: "How does your family deal with the tight deadlines that sometimes come with the job?",
                pt: "Como a sua família lida com os prazos apertados que às vezes vêm com o trabalho?",
              },
              {
                en: "Do you have a hobby that is completely unrelated to engineering? What is it?",
                pt: "Você tem um hobby que não tem nada a ver com engenharia? Qual é?",
              },
              {
                en: "What is one thing you do every weekend to disconnect from work?",
                pt: "O que você faz todo fim de semana pra se desconectar do trabalho?",
              },
              {
                en: "How do you deal with the pressure of a project that is behind schedule?",
                pt: "Como você lida com a pressão de um projeto atrasado?",
              },
              {
                en: "If you could take a one-year sabbatical, what would you do?",
                pt: "Se você pudesse tirar um ano sabático, o que faria?",
              },
              {
                en: "What is something people would be surprised to know about you, outside of work?",
                pt: "O que as pessoas ficariam surpresas em saber sobre você, fora do trabalho?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (C1):
- to burn the midnight oil = virar a noite trabalhando
- to be swamped = estar atolado de trabalho
- to recharge one's batteries = recarregar as baterias
- to strike a balance = achar o equilíbrio
- to leave work at work = deixar o trabalho no trabalho
- to be glued to the screen = ficar grudado na tela

❓ Perguntas:
1. Como você relaxa depois de um dia no CATIA?
2. Como é um dia normal de trabalho?
3. Como a família lida com prazos apertados?
4. Você tem um hobby fora da engenharia?
5. O que você faz todo fim de semana pra se desconectar?
6. Como você lida com pressão de projeto atrasado?
7. Se pudesse tirar um ano sabático, o que faria?
8. O que as pessoas ficariam surpresas em saber sobre você?`}
          </Translation>

          <Explanation title="Por que essa seção é importante">
            <p>
              Falar da <strong>vida pessoal</strong> em inglês é o que humaniza a conversa com
              colegas internacionais. Ninguém quer passar horas falando só de <em>tolerance</em> e{" "}
              <em>assembly</em>. Saber falar de <em>hobbies</em>, <em>família</em> e{" "}
              <em>equilíbrio</em> é o que constrói relacionamento profissional de verdade.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 6 — WHAT YOU DON'T LIKE                                  */}
        {/* ================================================================ */}
        <Section
          num={6}
          title="What You Don't Like — Honest Talk"
          subtitle="O que você não gosta — Papo reto"
        >
          <p className="text-slate-700 mb-4 italic">
            Every profession has its dark side. Let&apos;s talk honestly about what frustrates you
            in automotive design — without holding back.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            💡 Idioms &amp; Expressions (C1)
          </h3>

          <Idiom
            en="to be fed up with"
            pt="estar de saco cheio de"
            example="I&apos;m fed up with last-minute change requests from the client."
            examplePt="Estou de saco cheio de pedidos de mudança de última hora do cliente."
          />
          <Idiom
            en="to drive someone up the wall"
            pt="deixar alguém doido"
            example="Endless design reviews without a clear decision drive me up the wall."
            examplePt="Revisões infinitas de projeto sem uma decisão clara me deixam doido."
          />
          <Idiom
            en="to be a necessary evil"
            pt="ser um mal necessário"
            example="Bureaucracy is a necessary evil in the automotive industry."
            examplePt="A burocracia é um mal necessário na indústria automotiva."
          />
          <Idiom
            en="to jump through hoops"
            pt="pular todas as argolas / cumprir mil burocracias"
            example="We had to jump through hoops just to approve a tiny bracket change."
            examplePt="Tivemos que pular mil argolas só pra aprovar uma mudancinha de suporte."
          />
          <Idiom
            en="to be a deal-breaker"
            pt="ser algo que impede tudo"
            example="A bad tolerance stack-up can be a deal-breaker for the whole assembly."
            examplePt="Uma tolerância mal calculada pode ser um impedimento pro conjunto inteiro."
          />
          <Idiom
            en="to hit a wall"
            pt="bater numa parede (chegar no limite)"
            example="We hit a wall when the client kept asking for the same change again and again."
            examplePt="A gente bateu numa parede quando o cliente pediu a mesma mudança mil vezes."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              {
                en: "What is the most frustrating part of your job, honestly?",
                pt: "Qual é a parte mais frustrante do seu trabalho, sinceramente?",
              },
              {
                en: "Is there a specific client or department that makes your life difficult? Without naming names.",
                pt: "Tem algum cliente ou departamento específico que dificulta a sua vida? Sem citar nomes.",
              },
              {
                en: "What is one thing you wish your company would stop doing?",
                pt: "O que você gostaria que a sua empresa parasse de fazer?",
              },
              {
                en: "How do you deal with endless design revisions that never end?",
                pt: "Como você lida com revisões de projeto que nunca acabam?",
              },
              {
                en: "Have you ever had a project that failed completely? What happened?",
                pt: "Você já teve um projeto que fracassou completamente? O que aconteceu?",
              },
              {
                en: "What is the most overrated skill or tool in automotive design today?",
                pt: "Qual é a habilidade ou ferramenta mais superestimada no design automotivo hoje?",
              },
              {
                en: "If you could change one thing about how your industry works, what would it be?",
                pt: "Se pudesse mudar uma coisa em como a sua indústria funciona, o que seria?",
              },
              {
                en: "Have you ever thought about leaving automotive design for a completely different career?",
                pt: "Você já pensou em largar o design automotivo pra uma carreira completamente diferente?",
              },
            ]}
          />

          <Translation>
            {`💡 Expressões (C1):
- to be fed up with = estar de saco cheio de
- to drive someone up the wall = deixar alguém doido
- to be a necessary evil = ser um mal necessário
- to jump through hoops = pular mil argolas / burocracias
- to be a deal-breaker = ser algo que impede tudo
- to hit a wall = bater numa parede / chegar no limite

❓ Perguntas:
1. Qual a parte mais frustrante do seu trabalho?
2. Algum cliente ou departamento que dificulta sua vida?
3. O que você gostaria que sua empresa parasse de fazer?
4. Como lida com revisões infinitas de projeto?
5. Você já teve um projeto que fracassou?
6. Qual habilidade/ferramenta é mais superestimada?
7. O que mudaria em como a indústria funciona?
8. Você já pensou em largar o design automotivo?`}
          </Translation>

          <Explanation title="Falar do que incomoda é catártico">
            <p>
              Falar do que te incomoda <strong>em inglês</strong> é um exercício poderoso — porque
              te obriga a ir além do vocabulário técnico e usar <em>expressões emocionais</em> com
              naturalidade. Além disso, em entrevistas internacionais, quando o recrutador pergunta{" "}
              <em>&quot;what is your biggest frustration at work?&quot;</em>, você precisa ter essa
              resposta na ponta da língua.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 7 — WOULD YOU RATHER                                     */}
        {/* ================================================================ */}
        <Section
          num={7}
          title="Would You Rather...? — Design Edition"
          subtitle="Você preferiria...? — Edição design"
        >
          <p className="text-slate-700 mb-4 italic">
            <em>&quot;Would you rather...?&quot;</em> is a fantastic way to practice English. You
            choose one option, then you explain why — using the vocabulary from this lesson.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">
            🗳️ Choose one and explain your choice
          </h3>

          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                🚛 Would you rather design a full truck chassis from scratch or a small interior
                bracket for the next million-unit car?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria projetar um chassi de caminhão inteiro do zero ou um suporte
                interno pequeno para o próximo carro de um milhão de unidades?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                💻 Would you rather work 10 years at the same OEM with stability, or 10 years as a
                freelance CATIA consultant flying to a different country every project?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria trabalhar 10 anos na mesma montadora com estabilidade, ou 10 anos
                como consultor freelancer de CATIA viajando pra um país diferente a cada projeto?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                ⚙️ Would you rather design parts for electric vehicles or for classic combustion
                engines that will disappear in 20 years?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria projetar peças pra veículos elétricos ou pra motores a combustão
                clássicos que vão desaparecer em 20 anos?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                🎨 Would you rather have a job that pays 3x more but is 100% technical, or one that
                pays less but lets you be creative with body design?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria um trabalho que paga 3x mais mas é 100% técnico, ou um que paga
                menos mas te deixa criativo com design de carroceria?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                🌍 Would you rather work for a giant German OEM with strict rules, or a Brazilian
                startup where you wear every hat?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria trabalhar numa gigante alemã com regras rígidas, ou numa startup
                brasileira onde você faz de tudo?
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Follow-up questions</h3>
          <Questions
            items={[
              { en: "Why?", pt: "Por quê?" },
              { en: "What makes you say that?", pt: "O que te faz dizer isso?" },
              { en: "What would you do first in that scenario?", pt: "O que você faria primeiro nesse cenário?" },
              { en: "Tell me more — give me an example.", pt: "Me conte mais — me dê um exemplo." },
              {
                en: "Have you ever experienced something similar in your career?",
                pt: "Você já viveu algo parecido na sua carreira?",
              },
            ]}
          />

          <Translation>
            {`🗳️ Escolha uma opção e explique:

1. 🚛 Chassi de caminhão inteiro do zero OU um suporte interno pequeno pra um carro de 1 milhão de unidades?
2. 💻 10 anos na mesma montadora com estabilidade OU 10 anos como consultor freelancer de CATIA viajando?
3. ⚙️ Peças pra veículos elétricos OU pra motores a combustão que vão desaparecer?
4. 🎨 Trabalho 3x melhor pago mas 100% técnico OU menos pago mas criativo com carroceria?
5. 🌍 Gigante alemã com regras rígidas OU startup brasileira onde você faz de tudo?

❓ Perguntas de continuação:
- Por quê?
- O que te faz dizer isso?
- O que você faria primeiro?
- Me conte mais — me dê um exemplo.
- Você já viveu algo parecido?`}
          </Translation>

          <Explanation title="Por que essa dinâmica funciona">
            <p>
              <em>&quot;Would you rather&quot;</em> força você a <strong>tomar uma decisão e
              justificar</strong>. É a melhor forma de treinar inglês porque você precisa usar{" "}
              <em>condicional</em>, <em>comparações</em> e <em>opiniões pessoais</em> de uma vez —
              e ainda usa todo o vocabulário técnico que você aprendeu nas seções anteriores.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 8 — TELL ME A STORY                                      */}
        {/* ================================================================ */}
        <Section
          num={8}
          title="Tell Me a Story — Marcelo's Way"
          subtitle="Me conte uma história — Do jeito do Marcelo"
        >
          <p className="text-slate-700 mb-4 italic">
            To close the lesson, tell me a real story from your career. Every good engineer has a
            story that shaped who they are.
          </p>

          <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-4">
            <p className="text-xl md:text-2xl font-bold text-amber-800 mb-2">
              🎤 &ldquo;Tell me the story of the part you are most proud of designing — and why it
              still matters to you.&rdquo;
            </p>
            <p className="text-sm text-amber-700 italic">
              &ldquo;Me conte a história da peça que você mais se orgulha de ter projetado — e por
              que ela ainda é importante pra você.&rdquo;
            </p>
          </div>

          <p className="text-slate-700 mb-2">
            While you tell your story, try to use:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>
              Technical vocabulary from this lesson (<em>chassis, bumper, tolerance, assembly…</em>)
            </li>
            <li>
              Past simple (<em>I designed, I measured, I corrected</em>)
            </li>
            <li>
              Present perfect (<em>I&apos;ve been working, I&apos;ve never…</em>)
            </li>
            <li>At least two of the C1 expressions you learned today</li>
          </ul>

          <Translation>
            {`🎤 "Tell me the story of the part you are most proud of designing — and why it still matters to you."
"Me conte a história da peça que você mais se orgulha de ter projetado — e por que ela ainda é importante pra você."

Durante a história, tente usar:
- Vocabulário técnico desta lição (chassi, para-choque, tolerância, conjunto…)
- Past simple (I designed, I measured, I corrected — eu projetei, eu medi, eu corrigi)
- Present perfect (I've been working, I've never… — eu venho trabalhando, eu nunca…)
- Pelo menos duas das expressões C1 que você aprendeu hoje`}
          </Translation>

          <Explanation title="Por que contar uma história técnica funciona">
            <p>
              Quando você conta uma história <strong>específica</strong> da sua carreira — com
              detalhes de peça, tolerância, cliente e sentimento — você pratica inglês{" "}
              <strong>com propósito real</strong>. Isso ativa a memória emocional e faz o
              vocabulário técnico entrar de verdade. É a forma mais rápida de alcançar fluência em
              inglês técnico sem decorar listas.
            </p>
          </Explanation>
        </Section>

        {/* ============== END ============== */}
        <div className="text-center mt-12 mb-4">
          <button
            onClick={() => router.push("/cursos")}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg"
          >
            ← Voltar para os Cursos
          </button>
        </div>

        {/* ============== NÚMERO 18 PEQUENO ============== */}
        <div className="text-center mt-6 mb-10">
          <span className="text-[10px] text-slate-400 select-none">18</span>
        </div>
      </div>
    </div>
  );
}