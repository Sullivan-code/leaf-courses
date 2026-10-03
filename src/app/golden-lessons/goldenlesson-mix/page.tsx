"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, Info, ChevronDown, ChevronRight, Languages, Pencil, Check, X } from "lucide-react";

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
  const american = voices.filter((v) => v.lang === "en-US" || v.lang.startsWith("en-US"));
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
      {show && <span className="text-amber-600 text-xs font-normal ml-1">= {pt}</span>}
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
            {subtitle && <p className="text-blue-100 text-sm mt-0.5 italic">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8">
        {image && (
          <div className="mb-6">
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
function Idiom({ en, pt, example, examplePt }: { en: string; pt: string; example: string; examplePt: string }) {
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
        &ldquo;<T en={example} pt={examplePt} />&rdquo;
      </p>
      <p className="text-slate-500 text-xs mt-1">→ {examplePt}</p>
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
              <div className="mt-2 bg-emerald-50 border-l-3 border-emerald-400 rounded-r-lg p-2 flex items-start gap-2">
                <Check size={14} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 whitespace-pre-line">{answers[i]}</p>
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
export default function LifeStoriesLesson() {
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
            Conversation English — Lesson 27
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-3 text-amber-300">
            🗣️ Life Stories — Talking About Your Life
          </h1>
          <p className="text-amber-200 text-lg italic mb-4">
            Histórias de vida — Falando sobre a sua vida
          </p>
          <p className="text-blue-100 max-w-3xl mx-auto text-base md:text-lg">
            In this lesson, you are the expert. I will ask you questions — you tell me your story.
            Click on any underlined word or phrase to <strong>hear the pronunciation</strong> and{" "}
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
        {/* SECTION 1 — CARS                                                 */}
        {/* ================================================================ */}
        <Section
          num={1}
          title="Cars — The Cars We Love"
          subtitle="Carros — Os carros que amamos"
          image="https://github.com/Sullivan-code/english-audios/blob/main/carr.png?raw=true"
          imageAlt="Cars"
        >
          <p className="text-slate-700 mb-4 italic">
            Let&apos;s talk about cars — the ones you&apos;ve driven, the ones you dream about, and the ones you wouldn&apos;t trade for anything.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="It's a beast."
            pt="É uma máquina / um carrão."
            example="That Mustang is a beast — 500 horsepower under the hood."
            examplePt="Aquele Mustang é uma máquina — 500 cavalos debaixo do capô."
          />
          <Idiom
            en="It handles really well."
            pt="Ele tem uma dirigibilidade muito boa."
            example="I love this car — it handles really well on curves."
            examplePt="Amo esse carro — ele tem uma dirigibilidade muito boa nas curvas."
          />
          <Idiom
            en="It's a smooth ride."
            pt="É um carro macio / confortável de dirigir."
            example="The Mercedes is a smooth ride, even on bad roads."
            examplePt="O Mercedes é macio de dirigir, até em estradas ruins."
          />
          <Idiom
            en="It's got some serious power."
            pt="Ele tem uma potência séria / muito forte."
            example="Don't underestimate this truck — it's got some serious power."
            examplePt="Não subestime esse caminhão — ele tem uma potência séria."
          />
          <Idiom
            en="It's a head-turner."
            pt="Chama muita atenção / todo mundo olha."
            example="That red Ferrari is a real head-turner."
            examplePt="Aquela Ferrari vermelha chama muita atenção mesmo."
          />
          <Idiom
            en="I wouldn't trade it for anything."
            pt="Eu não trocaria por nada."
            example="My first car was old, but I wouldn't trade it for anything."
            examplePt="Meu primeiro carro era velho, mas eu não trocaria por nada."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "What's the best car you've ever driven?", pt: "Qual foi o melhor carro que você já dirigiu?" },
              { en: "What's the most overrated car you've ever driven?", pt: "Qual foi o carro mais superestimado que você já dirigiu?" },
              { en: "Would you rather own a classic car or a brand-new luxury car?", pt: "Você preferiria ter um carro clássico ou um carro de luxo zero?" },
              { en: "What's a car you would love to drive before you die?", pt: "Qual carro você adoraria dirigir antes de morrer?" },
              { en: "Do you think cars were better 30 years ago? Why?", pt: "Você acha que os carros eram melhores há 30 anos? Por quê?" },
              { en: "Would you ever buy an electric car?", pt: "Você compraria um carro elétrico?" },
              { en: "What car do you think is the most beautiful?", pt: "Qual carro você acha mais bonito?" },
              { en: "Tell me the story of your first car.", pt: "Me conte a história do seu primeiro carro." },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- It's a beast. = É uma máquina / um carrão.
- It handles really well. = Ele tem uma dirigibilidade muito boa.
- It's a smooth ride. = É um carro macio / confortável de dirigir.
- It's got some serious power. = Ele tem uma potência séria.
- It's a head-turner. = Chama muita atenção.
- I wouldn't trade it for anything. = Eu não trocaria por nada.

❓ Perguntas:
1. Qual foi o melhor carro que você já dirigiu?
2. Qual foi o carro mais superestimado que você já dirigiu?
3. Você preferiria ter um carro clássico ou um carro de luxo zero?
4. Qual carro você adoraria dirigir antes de morrer?
5. Você acha que os carros eram melhores há 30 anos? Por quê?
6. Você compraria um carro elétrico?
7. Qual carro você acha mais bonito?
8. Me conte a história do seu primeiro carro.`}
          </Translation>

          <Explanation title="Como usar essas expressões no trabalho">
            <p>
              Essas expressões são extremamente comuns em conversas casuais — em um bar, no
              trabalho, com amigos. Se você está dirigindo com um colega ou falando de um carro
              novo na empresa, usar <em>&quot;it&apos;s a beast&quot;</em> ou{" "}
              <em>&quot;it&apos;s a smooth ride&quot;</em> soa muito mais natural do que dizer
              &quot;this car has good performance&quot;. Nativos usam essas frases o tempo todo.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 2 — FOOD                                                 */}
        {/* ================================================================ */}
        <Section
          num={2}
          title="Food — Trying New Things"
          subtitle="Comida — Provando coisas novas"
        >
          <p className="text-slate-700 mb-4 italic">
            Have you ever tried something unusual? Crocodile, rabbit, snake meat, lamb? Let&apos;s talk about it.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="It tastes like chicken."
            pt="Tem gosto de frango."
            example="Crocodile meat? Honestly, it tastes like chicken."
            examplePt="Carne de crocodilo? Sinceramente, tem gosto de frango."
          />
          <Idiom
            en="I'm adventurous with food."
            pt="Eu sou aventureiro com comida."
            example="I'll try anything — I'm really adventurous with food."
            examplePt="Eu provo tudo — sou bastante aventureiro com comida."
          />
          <Idiom
            en="It's an acquired taste."
            pt="É um gosto adquirido (não gosta de primeira)."
            example="Snake meat is an acquired taste — not for everyone."
            examplePt="Carne de cobra é um gosto adquirido — não é pra todo mundo."
          />
          <Idiom
            en="I could eat this every day."
            pt="Eu comeria isso todo dia."
            example="This lamb stew is incredible — I could eat this every day."
            examplePt="Esse ensopado de carneiro é incrível — eu comeria todo dia."
          />
          <Idiom
            en="It's not really my thing."
            pt="Não é muito a minha praia."
            example="Rabbit? It's not really my thing."
            examplePt="Coelho? Não é muito a minha praia."
          />
          <Idiom
            en="That hit the spot."
            pt="Isso caiu como uma luva / matou a vontade."
            example="After a long day, that stew really hit the spot."
            examplePt="Depois de um dia longo, aquele cozido caiu como uma luva."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "Have you ever eaten crocodile, rabbit, or snake? What did you think?", pt: "Você já comeu crocodilo, coelho ou cobra? O que achou?" },
              { en: "What's the strangest food you've ever tried?", pt: "Qual foi a comida mais estranha que você já provou?" },
              { en: "Do you like lamb? Where did you eat it for the first time?", pt: "Você gosta de carneiro? Onde você comeu pela primeira vez?" },
              { en: "What's a food from another country you'd love to try?", pt: "Qual comida de outro país você adoraria provar?" },
              { en: "What's your favorite dish from your family's culture?", pt: "Qual é o seu prato favorito da cultura da sua família?" },
              { en: "Do you cook? What's your specialty?", pt: "Você cozinha? Qual é a sua especialidade?" },
              { en: "What's a dish that reminds you of your childhood?", pt: "Qual prato te lembra da sua infância?" },
              { en: "Would you rather eat at a fancy restaurant or a small local place?", pt: "Você preferiria comer num restaurante chique ou num lugar local simples?" },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- It tastes like chicken. = Tem gosto de frango.
- I'm adventurous with food. = Eu sou aventureiro com comida.
- It's an acquired taste. = É um gosto adquirido.
- I could eat this every day. = Eu comeria isso todo dia.
- It's not really my thing. = Não é muito a minha praia.
- That hit the spot. = Isso caiu como uma luva.

❓ Perguntas:
1. Você já comeu crocodilo, coelho ou cobra? O que achou?
2. Qual foi a comida mais estranha que você já provou?
3. Você gosta de carneiro? Onde você comeu pela primeira vez?
4. Qual comida de outro país você adoraria provar?
5. Qual é o seu prato favorito da cultura da sua família?
6. Você cozinha? Qual é a sua especialidade?
7. Qual prato te lembra da sua infância?
8. Você preferiria comer num restaurante chique ou num lugar local simples?`}
          </Translation>

          <Explanation title="Por que essas expressões são poderosas">
            <p>
              Falar de comida abre portas em qualquer conversa. <em>&quot;It tastes like chicken&quot;</em>{" "}
              é uma piada clássica em inglês — usada quando se prova algo exótico. Já{" "}
              <em>&quot;that hit the spot&quot;</em> é uma expressão que nativos usam sempre depois
              de uma refeição satisfatória.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 3 — BEER                                                 */}
        {/* ================================================================ */}
        <Section
          num={3}
          title="Beer — Around the World"
          subtitle="Cerveja — Pelo mundo"
          image="https://github.com/Sullivan-code/english-audios/blob/main/DRINKINGBEER.png?raw=true"
          imageAlt="Beer around the world"
        >
          <p className="text-slate-700 mb-4 italic">
            Beer is culture. Germany, Belgium, Czech Republic, Australia, England, Brazil, Argentina — every country has its own.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="I'm more into..."
            pt="Eu curto mais..."
            example="I'm more into craft beer than regular lager."
            examplePt="Eu curto mais cerveja artesanal do que lager comum."
          />
          <Idiom
            en="It's got a bitter aftertaste."
            pt="Tem um retrogosto amargo."
            example="That IPA is good, but it's got a bitter aftertaste."
            examplePt="Essa IPA é boa, mas tem um retrogosto amargo."
          />
          <Idiom
            en="It's pretty smooth."
            pt="É bem suave."
            example="Czech pilsner? It's pretty smooth — easy to drink."
            examplePt="Pilsner tcheca? É bem suave — fácil de beber."
          />
          <Idiom
            en="I'm not a big fan of..."
            pt="Não sou muito fã de..."
            example="I'm not a big fan of very hoppy beers."
            examplePt="Não sou muito fã de cervejas muito lupuladas."
          />
          <Idiom
            en="Let's grab a cold one."
            pt="Vamos tomar uma gelada."
            example="After work, let's grab a cold one."
            examplePt="Depois do trabalho, vamos tomar uma gelada."
          />
          <Idiom
            en="That beer goes down easy."
            pt="Essa cerveja desce fácil."
            example="On a hot day, that beer goes down easy."
            examplePt="Num dia quente, essa cerveja desce fácil."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "What's the best beer you've ever had? Where was it?", pt: "Qual foi a melhor cerveja que você já tomou? Onde foi?" },
              { en: "Do you prefer a cold beer on a hot day, or a beer with a good meal?", pt: "Você prefere uma cerveja gelada num dia quente, ou uma cerveja acompanhando uma boa refeição?" },
              { en: "Have you ever tried a beer you absolutely hated?", pt: "Você já provou uma cerveja que odiou?" },
              { en: "What makes a beer memorable for you — the taste, the place, or the people?", pt: "O que faz uma cerveja ser memorável — o sabor, o lugar ou as pessoas?" },
              { en: "Do you think beer is part of a country's culture?", pt: "Você acha que a cerveja faz parte da cultura de um país?" },
              { en: "Which country do you think has the best beer culture?", pt: "Qual país você acha que tem a melhor cultura de cerveja?" },
              { en: "Do you have a favorite bar or pub?", pt: "Você tem um bar ou pub favorito?" },
              { en: "What's the best story you have that involves beer?", pt: "Qual é a melhor história que você tem envolvendo cerveja?" },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- I'm more into... = Eu curto mais...
- It's got a bitter aftertaste. = Tem um retrogosto amargo.
- It's pretty smooth. = É bem suave.
- I'm not a big fan of... = Não sou muito fã de...
- Let's grab a cold one. = Vamos tomar uma gelada.
- That beer goes down easy. = Essa cerveja desce fácil.

❓ Perguntas:
1. Qual foi a melhor cerveja que você já tomou? Onde foi?
2. Você prefere uma cerveja gelada num dia quente, ou uma cerveja acompanhando uma boa refeição?
3. Você já provou uma cerveja que odiou?
4. O que faz uma cerveja ser memorável — o sabor, o lugar ou as pessoas?
5. Você acha que a cerveja faz parte da cultura de um país?
6. Qual país você acha que tem a melhor cultura de cerveja?
7. Você tem um bar ou pub favorito?
8. Qual é a melhor história que você tem envolvendo cerveja?`}
          </Translation>

          <Explanation title="Por que cerveja é um ótimo tópico">
            <p>
              Cerveja permite falar de <em>culturas, viagens e memórias</em> ao mesmo tempo. Você
              pode contar sobre uma cerveja que tomou na Alemanha, um pub na Inglaterra, ou uma
              gelada no Brasil. <em>&quot;Let&apos;s grab a cold one&quot;</em> é uma das
              expressões mais usadas por nativos quando convidam alguém pra beber.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 4 — TRAVEL                                               */}
        {/* ================================================================ */}
        <Section
          num={4}
          title="Travel — Places I've Been"
          subtitle="Viagens — Lugares onde já estive"
          image="https://github.com/Sullivan-code/english-audios/blob/main/travel.png?raw=true"
          imageAlt="Travel the world"
        >
          <p className="text-slate-700 mb-4 italic">
            Italy, Australia, Argentina, Chile, Paraguay, Spain, France… Every trip has a story. Let&apos;s tell yours.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="Off the beaten path."
            pt="Fora do caminho comum / pouco turístico."
            example="I love going off the beaten path when I travel."
            examplePt="Eu amo ir para lugares fora do caminho comum quando viajo."
          />
          <Idiom
            en="It took my breath away."
            pt="Tirou meu fôlego (de tão bonito)."
            example="The view of the Alps took my breath away."
            examplePt="A vista dos Alpes tirou meu fôlego."
          />
          <Idiom
            en="I got a taste for it."
            pt="Peguei o gosto por isso."
            example="After my first trip to Europe, I got a taste for traveling."
            examplePt="Depois da primeira viagem à Europa, peguei o gosto por viajar."
          />
          <Idiom
            en="Hit the road."
            pt="Cair na estrada / viajar."
            example="We woke up early and hit the road at 5 a.m."
            examplePt="Acordamos cedo e caímos na estrada às 5 da manhã."
          />
          <Idiom
            en="It was a once-in-a-lifetime experience."
            pt="Foi uma experiência única na vida."
            example="Seeing the Eiffel Tower at night was a once-in-a-lifetime experience."
            examplePt="Ver a Torre Eiffel à noite foi uma experiência única na vida."
          />
          <Idiom
            en="The culture shock was real."
            pt="O choque cultural foi real."
            example="When I first arrived in Australia, the culture shock was real."
            examplePt="Quando cheguei na Austrália, o choque cultural foi real."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "What's the most beautiful place you've ever visited? Why?", pt: "Qual foi o lugar mais bonito que você já visitou? Por quê?" },
              { en: "What surprised you the most when you traveled abroad?", pt: "O que mais te surpreendeu quando você viajou para fora do Brasil?" },
              { en: "If you could go back to one country, which one would you choose and why?", pt: "Se você pudesse voltar para um país, qual escolheria e por quê?" },
              { en: "What was the funniest thing that happened during one of your trips?", pt: "Qual foi a coisa mais engraçada que aconteceu em uma das suas viagens?" },
              { en: "How is traveling in South America different from traveling in Europe?", pt: "Como viajar na América do Sul é diferente de viajar na Europa?" },
              { en: "What country would you love to visit that you haven't yet?", pt: "Qual país você adoraria visitar e ainda não foi?" },
              { en: "Do you prefer traveling alone, with family, or with friends?", pt: "Você prefere viajar sozinho, com a família ou com amigos?" },
              { en: "What do you always take with you when you travel?", pt: "O que você sempre leva quando viaja?" },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- Off the beaten path. = Fora do caminho comum.
- It took my breath away. = Tirou meu fôlego.
- I got a taste for it. = Peguei o gosto por isso.
- Hit the road. = Cair na estrada.
- It was a once-in-a-lifetime experience. = Foi uma experiência única na vida.
- The culture shock was real. = O choque cultural foi real.

❓ Perguntas:
1. Qual foi o lugar mais bonito que você já visitou? Por quê?
2. O que mais te surpreendeu quando viajou para fora?
3. Se você pudesse voltar para um país, qual escolheria e por quê?
4. Qual foi a coisa mais engraçada que aconteceu em uma viagem sua?
5. Como viajar na América do Sul é diferente de viajar na Europa?
6. Qual país você adoraria visitar e ainda não foi?
7. Você prefere viajar sozinho, com a família ou com amigos?
8. O que você sempre leva quando viaja?`}
          </Translation>

          <Explanation title="Dica de conversação">
            <p>
              Quando falar de viagens, sempre conte <strong>uma história específica</strong> com
              detalhes: onde estava, com quem, o que aconteceu, como você se sentiu. Isso treina
              o <em>past simple</em> e o <em>present perfect</em> naturalmente — sem precisar
              pensar em gramática.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 5 — FAMILY ROOTS (BOLIVIA)                               */}
        {/* ================================================================ */}
        <Section
          num={5}
          title="Family — Where I Come From"
          subtitle="Família — De onde eu venho"
          image="https://github.com/Sullivan-code/english-audios/blob/main/goingtobolivia.png?raw=true"
          imageAlt="Bolivia — family roots"
        >
          <p className="text-slate-700 mb-4 italic">
            Our family history shapes who we are. Where does your family come from? What traditions did they bring?
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="Where I come from..."
            pt="De onde eu venho..."
            example="Where I come from, family is everything."
            examplePt="De onde eu venho, a família é tudo."
          />
          <Idiom
            en="It runs in the family."
            pt="Está no sangue / é de família."
            example="My love for travel runs in the family."
            examplePt="Meu amor por viagens está no sangue."
          />
          <Idiom
            en="Pass it down."
            pt="Passar adiante (de geração em geração)."
            example="My father passed down his stories to me, and I'll pass them down to my kids."
            examplePt="Meu pai passou as histórias dele pra mim, e eu vou passar para os meus filhos."
          />
          <Idiom
            en="My roots."
            pt="Minhas raízes."
            example="Even though I live in Brazil, my roots are in Bolivia."
            examplePt="Mesmo morando no Brasil, minhas raízes estão na Bolívia."
          />
          <Idiom
            en="It shaped who I am."
            pt="Isso moldou quem eu sou."
            example="Growing up with two cultures shaped who I am."
            examplePt="Crescer com duas culturas moldou quem eu sou."
          />
          <Idiom
            en="I take after my father."
            pt="Puxei ao meu pai."
            example="People say I take after my father — same personality."
            examplePt="As pessoas dizem que puxei ao meu pai — mesma personalidade."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "What do you know about your father's life in Bolivia?", pt: "O que você sabe sobre a vida do seu pai na Bolívia?" },
              { en: "What did he tell you about Bolivia when you were growing up?", pt: "O que ele te contava sobre a Bolívia quando você era criança?" },
              { en: "What traditions did he bring to your family?", pt: "Que tradições ele trouxe para a sua família?" },
              { en: "Did growing up with a Bolivian father influence your identity?", pt: "Crescer com um pai boliviano influenciou a sua identidade?" },
              { en: "Have you ever visited the place where your father was born?", pt: "Você já visitou o lugar onde seu pai nasceu?" },
              { en: "What would you like to know about your father's childhood?", pt: "O que você gostaria de saber sobre a infância do seu pai?" },
              { en: "What's a family story that you love to tell?", pt: "Qual história de família você ama contar?" },
              { en: "What values did your family teach you that you still carry today?", pt: "Que valores a sua família te ensinou que você ainda carrega hoje?" },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- Where I come from... = De onde eu venho...
- It runs in the family. = Está no sangue / é de família.
- Pass it down. = Passar adiante.
- My roots. = Minhas raízes.
- It shaped who I am. = Isso moldou quem eu sou.
- I take after my father. = Puxei ao meu pai.

❓ Perguntas:
1. O que você sabe sobre a vida do seu pai na Bolívia?
2. O que ele te contava sobre a Bolívia quando você era criança?
3. Que tradições ele trouxe para a sua família?
4. Crescer com um pai boliviano influenciou a sua identidade?
5. Você já visitou o lugar onde seu pai nasceu?
6. O que você gostaria de saber sobre a infância do seu pai?
7. Qual história de família você ama contar?
8. Que valores a sua família te ensinou que você ainda carrega hoje?`}
          </Translation>

          <Explanation title="Falar sobre raízes em inglês">
            <p>
              Expressões como <em>&quot;it runs in the family&quot;</em> e{" "}
              <em>&quot;I take after my father&quot;</em> são muito usadas quando se fala de
              família. Contar histórias de família em inglês é um exercício poderoso porque força
              o uso de <em>past tense</em>, <em>present perfect</em> e vocabulário emocional ao
              mesmo tempo.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 6 — WORK (SOLAR PANELS & CAREER)                         */}
        {/* ================================================================ */}
        <Section
          num={6}
          title="Work — Solar Panels & Career Choices"
          subtitle="Trabalho — Painéis solares & escolhas de carreira"
        >
          <p className="text-slate-700 mb-4 italic">
            Work is a big part of life. Solar panels are the future — renewable energy. Let&apos;s talk about your work and what you&apos;d do if you worked abroad.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Idioms & Expressions</h3>

          <Idiom
            en="I make a living doing..."
            pt="Eu ganho a vida fazendo..."
            example="I make a living installing solar panels."
            examplePt="Eu ganho a vida instalando painéis solares."
          />
          <Idiom
            en="Hands-on work."
            pt="Trabalho prático / manual."
            example="I prefer hands-on work — I don't like sitting at a desk all day."
            examplePt="Prefiro trabalho prático — não gosto de ficar sentado numa mesa o dia todo."
          />
          <Idiom
            en="It's the way of the future."
            pt="É o caminho do futuro."
            example="Renewable energy is the way of the future."
            examplePt="Energia renovável é o caminho do futuro."
          />
          <Idiom
            en="It pays the bills."
            pt="Dá pra pagar as contas."
            example="It's not my dream job, but it pays the bills."
            examplePt="Não é o trabalho dos sonhos, mas dá pra pagar as contas."
          />
          <Idiom
            en="Take a leap of faith."
            pt="Dar um salto de fé."
            example="Moving to another country is a leap of faith."
            examplePt="Mudar para outro país é um salto de fé."
          />
          <Idiom
            en="There's good money in it."
            pt="Dá um bom dinheiro nisso."
            example="People don't realize there's good money in solar installation."
            examplePt="As pessoas não percebem que dá um bom dinheiro em instalação solar."
          />

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Questions</h3>
          <Questions
            items={[
              { en: "What do you like most about working with solar panels?", pt: "O que você mais gosta em trabalhar com painéis solares?" },
              { en: "Why do you think solar energy is important for the future?", pt: "Por que você acha que a energia solar é importante para o futuro?" },
              { en: "If you worked abroad, what country would you choose?", pt: "Se você trabalhasse fora do país, que país escolheria?" },
              { en: "If you could choose any profession today, what would it be?", pt: "Se você pudesse escolher qualquer profissão hoje, qual seria?" },
              { en: "What job do you think makes the most money in the world right now?", pt: "Qual profissão você acha que dá mais dinheiro no mundo hoje?" },
              { en: "Would you rather work for a company or be your own boss?", pt: "Você preferiria trabalhar para uma empresa ou ser seu próprio patrão?" },
              { en: "What was your first job? What did you learn from it?", pt: "Qual foi o seu primeiro trabalho? O que aprendeu com ele?" },
              { en: "If you could go back in time, would you change your career?", pt: "Se você pudesse voltar no tempo, mudaria sua carreira?" },
            ]}
          />

          <Translation>
            {`💡 Expressões:
- I make a living doing... = Eu ganho a vida fazendo...
- Hands-on work. = Trabalho prático / manual.
- It's the way of the future. = É o caminho do futuro.
- It pays the bills. = Dá pra pagar as contas.
- Take a leap of faith. = Dar um salto de fé.
- There's good money in it. = Dá um bom dinheiro nisso.

❓ Perguntas:
1. O que você mais gosta em trabalhar com painéis solares?
2. Por que você acha que a energia solar é importante para o futuro?
3. Se você trabalhasse fora do país, que país escolheria?
4. Se você pudesse escolher qualquer profissão hoje, qual seria?
5. Qual profissão você acha que dá mais dinheiro no mundo hoje?
6. Você preferiria trabalhar para uma empresa ou ser seu próprio patrão?
7. Qual foi o seu primeiro trabalho? O que aprendeu com ele?
8. Se você pudesse voltar no tempo, mudaria sua carreira?`}
          </Translation>

          <Explanation title="Falar sobre trabalho em inglês">
            <p>
              Falar de trabalho é essencial em qualquer conversa de adulto. Expressões como{" "}
              <em>&quot;hands-on&quot;</em> e <em>&quot;there&apos;s good money in it&quot;</em>{" "}
              são comuns em entrevistas e conversas informais. Já{" "}
              <em>&quot;take a leap of faith&quot;</em> é usada quando alguém toma uma decisão
              arriscada, como mudar de país ou de carreira.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 7 — WOULD YOU RATHER                                     */}
        {/* ================================================================ */}
        <Section
          num={7}
          title="Would You Rather...? — Fun Choices"
          subtitle="Você preferiria...? — Escolhas divertidas"
        >
          <p className="text-slate-700 mb-4 italic">
            <em>&quot;Would you rather...?&quot;</em> is a fantastic way to practice English. You choose one option, then you explain why.
          </p>

          <h3 className="text-lg font-bold text-blue-800 mb-3">🗳️ Choose one and explain your choice</h3>

          <div className="space-y-3">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                🚗 Would you rather drive a classic Porsche or a brand-new Ferrari?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria dirigir um Porsche clássico ou uma Ferrari zero?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                ✈️ Would you rather spend a month in Australia or travel around Europe?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria passar um mês na Austrália ou viajar pela Europa?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                🍺 Would you rather drink one amazing beer or try ten different beers?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria tomar uma cerveja incrível ou provar dez cervejas diferentes?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                ⏳ Would you rather be 30 again with everything you know today, or stay your current age with perfect health?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria voltar aos 30 com tudo o que sabe hoje, ou ficar na sua idade atual com saúde perfeita?
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="font-semibold text-slate-800">
                💰 Would you rather have R$10 million or travel anywhere in the world for free for the rest of your life?
              </p>
              <p className="text-sm text-gray-500 italic">
                Você preferiria ter R$10 milhões ou viajar de graça pelo mundo pelo resto da vida?
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-blue-800 mt-6 mb-3">❓ Follow-up questions</h3>
          <Questions
            items={[
              { en: "Why?", pt: "Por quê?" },
              { en: "What makes you say that?", pt: "O que te faz dizer isso?" },
              { en: "What would you do?", pt: "O que você faria?" },
              { en: "Tell me more.", pt: "Me conte mais." },
              { en: "Have you ever experienced something like that?", pt: "Você já viveu algo parecido?" },
            ]}
          />

          <Translation>
            {`🗳️ Escolha uma opção e explique:

1. 🚗 Você preferiria dirigir um Porsche clássico ou uma Ferrari zero?
2. ✈️ Você preferiria passar um mês na Austrália ou viajar pela Europa?
3. 🍺 Você preferiria tomar uma cerveja incrível ou provar dez cervejas diferentes?
4. ⏳ Você preferiria voltar aos 30 com tudo o que sabe hoje, ou ficar na sua idade atual com saúde perfeita?
5. 💰 Você preferiria ter R$10 milhões ou viajar de graça pelo mundo pelo resto da vida?

❓ Perguntas de continuação:
- Por quê?
- O que te faz dizer isso?
- O que você faria?
- Me conte mais.
- Você já viveu algo parecido?`}
          </Translation>

          <Explanation title="Por que &quot;Would you rather&quot; funciona tão bem">
            <p>
              Essa estrutura força o aluno a <strong>tomar uma decisão + justificar</strong>. É a
              melhor forma de praticar inglês de forma natural, porque o aluno precisa usar{" "}
              <em>condicional</em>, <em>comparações</em> e <em>opiniões pessoais</em> de uma vez.
              Além disso, sempre gera conversa — porque você pode discordar e continuar discutindo.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 8 — TELL ME A STORY                                      */}
        {/* ================================================================ */}
        <Section
          num={8}
          title="Tell Me a Story"
          subtitle="Me conte uma história"
        >
          <p className="text-slate-700 mb-4 italic">
            To close every lesson, I&apos;ll ask you one question. The answer might become one of our best classes.
          </p>

          <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-2 border-amber-300 rounded-2xl p-6 mb-4">
            <p className="text-xl md:text-2xl font-bold text-amber-800 mb-2">
              🎤 &ldquo;Tell me one story from your life that you&apos;ve never told me before.&rdquo;
            </p>
            <p className="text-sm text-amber-700 italic">
              &ldquo;Me conte uma história da sua vida que você nunca me contou antes.&rdquo;
            </p>
          </div>

          <p className="text-slate-700 mb-2">
            While you tell your story, try to use:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>Past simple (<em>I went, I saw, I met</em>)</li>
            <li>Present perfect (<em>I&apos;ve been, I&apos;ve never…</em>)</li>
            <li>Descriptive adjectives (<em>amazing, weird, funny, unforgettable</em>)</li>
            <li>Idioms you learned today</li>
          </ul>

          <Translation>
            {`🎤 "Tell me one story from your life that you've never told me before."
"Me conte uma história da sua vida que você nunca me contou antes."

Durante a história, tente usar:
- Past simple (I went, I saw, I met — eu fui, eu vi, eu conheci)
- Present perfect (I've been, I've never… — eu já fui, eu nunca…)
- Adjetivos descritivos (amazing, weird, funny, unforgettable — incrível, estranho, engraçado, inesquecível)
- Expressões que você aprendeu hoje`}
          </Translation>

          <Explanation title="Por que isso funciona">
            <p>
              Quando o aluno conta uma história pessoal, ele pratica inglês{" "}
              <strong>por um motivo real</strong> — não por obrigação. Isso aumenta o engajamento
              e faz com que o cérebro memorize o idioma junto com a emoção da história. É a forma
              mais rápida de alcançar fluência natural.
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

        {/* ============== NÚMERO 17 PEQUENO ============== */}
        <div className="text-center mt-6 mb-10">
          <span className="text-[10px] text-slate-400 select-none">17</span>
        </div>
      </div>
    </div>
  );
}