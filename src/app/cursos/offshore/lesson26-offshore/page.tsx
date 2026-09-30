"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Volume2, BookOpen, Info, ChevronDown, ChevronRight, Languages } from "lucide-react";

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
// CLICKABLE TERM (word/phrase) — speaks + reveals translation
// ============================================================
function T({
  en,
  pt,
  block = false,
}: {
  en: string;
  pt: string;
  block?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <span className={block ? "inline-block" : ""}>
      <button
        onClick={() => {
          speakEnglish(en);
          setShow((s) => !s);
        }}
        className="cursor-pointer border-b border-dotted border-amber-400/70 hover:bg-amber-400/20 transition-colors text-left"
        title="Click to hear + see translation"
      >
        {en}
      </button>
      {show && (
        <span
          className={`text-amber-300 text-xs font-normal ml-1 ${
            block ? "block mt-0.5 italic" : ""
          }`}
        >
          {block ? "→ " : "= "}
          {pt}
        </span>
      )}
    </span>
  );
}

// ============================================================
// EXPLANATION BOX (work context in Portuguese)
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
// FULL TRANSLATION TOGGLE
// ============================================================
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
// SECTION CARD
// ============================================================
function Section({
  num,
  title,
  subtitle,
  children,
}: {
  num: number;
  title: string;
  subtitle?: string;
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
      <div className="p-6 md:p-8">{children}</div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT — LESSON 26
// ============================================================
export default function Lesson26DynamicPositioning() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") window.speechSynthesis.getVoices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* ============== HEADER ============== */}
        <div className="text-center mb-10 bg-gradient-to-r from-blue-700 via-blue-800 to-slate-900 text-white rounded-3xl p-8 shadow-2xl">
          <span className="inline-block bg-amber-400 text-slate-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-4">
            Offshore English — Lesson 26
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-amber-300">
            🧭 Dynamic Positioning (DP) — Advanced Systems
          </h1>
          <p className="text-blue-100 max-w-3xl mx-auto text-base md:text-lg">
            Study the exact technical English used on DP vessels. Click on any underlined word or
            phrase to <strong>hear the pronunciation</strong> and <strong>see the translation</strong>.
            Each section has a full Portuguese translation and a work-context explanation.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs">
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              🔊 Click to listen
            </span>
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              🇧🇷 Full translation
            </span>
            <span className="bg-blue-900/70 border border-blue-700 px-3 py-1 rounded-full">
              💼 Work explanation
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* SECTION 1 — OPERATING MODES OF AZIMUTH THRUSTER (BIAS MODE)     */}
        {/* ================================================================ */}
        <Section
          num={1}
          title="Operating Modes of Azimuth Thruster — Bias Mode"
          subtitle="Modos de operação do thruster azimutal — Modo Bias"
        >
          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              <T en="Bias mode" pt="Modo bias (enviesamento)" /> —{" "}
              <T en="Thruster biasing function" pt="função de enviesamento do thruster" /> allows{" "}
              <T en="azimuth thrusters" pt="thrusters azimutais" /> to{" "}
              <T en="counteract" pt="contrapor-se" /> each other in pair so that the{" "}
              <T en="resulting thrust" pt="empuxo resultante" /> is{" "}
              <T en="zero" pt="zero" />.
            </li>
            <li>
              Thrust may be directed either{" "}
              <T en="towards" pt="em direção a" /> (<T en="inward" pt="para dentro" />) or{" "}
              <T en="away" pt="para fora" /> (<T en="outward" pt="para fora" />) from the other
              thruster.
            </li>
            <li>
              The resulting thrust will be zero in{" "}
              <T en="all three degrees of freedom" pt="todos os três graus de liberdade" />,{" "}
              <T en="irrespective of" pt="independentemente de" /> where the two thrusters are
              located on the vessel.
            </li>
            <li>
              <T en="Multiple thruster groups" pt="múltiplos grupos de thrusters" /> can be
              programmed, where each group has either two or three thrusters.
            </li>
            <li>
              Biasing can be programmed for{" "}
              <T en="angle factor" pt="fator de ângulo" /> and{" "}
              <T en="turn factor" pt="fator de rotação" />.
            </li>
          </ul>

          <p className="mt-6 text-slate-800 leading-relaxed">
            This mode offers a good option in certain operational situations:
          </p>
          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed mt-3">
            <li>
              In <T en="very calm weather condition" pt="condições de tempo muito calmo" />{" "}
              necessitating{" "}
              <T en="minimum load on generators" pt="carga mínima nos geradores" /> and reducing{" "}
              <T en="unnecessary movement" pt="movimento desnecessário" /> of the thrusters.
            </li>
            <li>
              It improve the <T en="damping" pt="amortecimento" /> of{" "}
              <T en="horizontal vessel motion" pt="movimento horizontal da embarcação" />.
            </li>
          </ul>

          <FullTranslation>
            {`Bias mode — A função de enviesamento do thruster permite que thrusters azimutais se contraponham em pares, de modo que o empuxo resultante seja zero.

O empuxo pode ser direcionado tanto para dentro (inward) quanto para fora (outward) em relação ao outro thruster.

O empuxo resultante será zero nos três graus de liberdade, independentemente de onde os dois thrusters estejam localizados na embarcação.

Múltiplos grupos de thrusters podem ser programados, onde cada grupo tem dois ou três thrusters.

O enviesamento (biasing) pode ser programado por fator de ângulo (angle factor) e fator de rotação (turn factor).

Este modo oferece uma boa opção em certas situações operacionais:
- Em condições de tempo muito calmo, necessitando carga mínima nos geradores e reduzindo movimento desnecessário dos thrusters.
- Melhora o amortecimento (damping) do movimento horizontal da embarcação.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O <strong>Bias Mode</strong> é muito usado quando o DP está segurando a embarcação em
              posição, mas o mar está tão calmo que os thrusters ficam "caçando" direção
              (hunting) — ou seja, mudando de ângulo toda hora sem necessidade. Ao colocar dois
              thrusters em oposição (um empurrando para dentro, outro para fora), o empuxo líquido
              é zero, mas o sistema continua pronto para reagir rápido. Isso:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Reduz desgaste mecânico dos thrusters;</li>
              <li>Economiza combustível (geradores com carga menor);</li>
              <li>Melhora o amortecimento do movimento horizontal;</li>
              <li>Mantém o sistema em "standby ativo" sem gastar energia desnecessária.</li>
            </ul>
            <p className="mt-2">
              Como DPO, você seleciona esse modo em operações de longa duração com clima bom,
              para reduzir fadiga dos equipamentos e consumo.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 2 — DP SYSTEM COMPONENTS                                 */}
        {/* ================================================================ */}
        <Section
          num={2}
          title="A Dynamic Positioning system consists of the following parts"
          subtitle="Um sistema de Posicionamento Dinâmico é composto pelas seguintes partes"
        >
          <ol className="list-decimal pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              <T en="Control Unit" pt="Unidade de Controle" /> with a{" "}
              <T en="computer" pt="computador" /> and{" "}
              <T en="Kalman Filter" pt="Filtro de Kalman" />
            </li>
            <li>
              <T en="Thrusters" pt="Thrusters (propulsores)" />
            </li>
            <li>
              <T en="Power Supply" pt="Fornecimento de energia" />
            </li>
            <li>
              <T en="Position Reference Systems" pt="Sistemas de referência de posição" />
            </li>
            <li>
              <T en="Sensors" pt="Sensores" />
            </li>
            <li>
              <T en="Instruments & Operator Panels" pt="Instrumentos e painéis do operador" /> —{" "}
              <T en="MMI" pt="MMI (Interface Homem-Máquina)" /> (
              <T en="Man-Machine Interface" pt="Interface Homem-Máquina" />)
            </li>
          </ol>

          <FullTranslation>
            {`1. Unidade de Controle com um computador e um Filtro de Kalman
2. Thrusters (propulsores)
3. Fornecimento de energia (Power Supply)
4. Sistemas de referência de posição (Position Reference Systems)
5. Sensores (Sensors)
6. Instrumentos e painéis do operador — MMI (Interface Homem-Máquina)`}
          </FullTranslation>

          <Explanation title="Visão geral do sistema DP">
            <p>
              O sistema DP é um <strong>sistema em malha fechada</strong>: ele mede a posição
              (PRS), mede as condições externas (sensores), calcula a correção (Control Unit +
              Kalman) e atua (thrusters). A energia elétrica vem dos geradores. O operador
              interage pelo <strong>MMI</strong> — os painéis e telas no console.
            </p>
            <p className="mt-2">
              Se qualquer uma dessas 6 partes falha, o DP perde capacidade. Por isso Classe 2 e 3
              exigem <em>redundância</em> em quase todas elas.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 3 — THRUSTER FIXED AZIMUTH                               */}
        {/* ================================================================ */}
        <Section
          num={3}
          title="Thruster Fixed Azimuth"
          subtitle="Thruster Azimutal Fixo"
        >
          <ul className="list-disc pl-6 space-y-2 text-slate-800 leading-relaxed">
            <li>
              <T en="Recommended" pt="Recomendado" /> when azimuth thruster{" "}
              <T en="continuously hunting" pt="procurando continuamente" /> for direction in{" "}
              <T en="light weather conditions" pt="condições de tempo leve/calmo" />.
            </li>
          </ul>

          <FullTranslation>
            {`Recomendado quando o thruster azimutal está continuamente "caçando" direção em condições de tempo calmo.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              Em mar calmo, os thrusters azimutais ficam girando de um lado para o outro sem
              parar ("hunting"), porque não há força externa suficiente para mantê-los em uma
              direção. Fixar a direção (Fixed Azimuth) <strong>trava</strong> o thruster em um
              ângulo predefinido. Isso:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Reduz desgaste do mecanismo de giro;</li>
              <li>Reduz consumo de energia;</li>
              <li>Diminui ruído e vibração;</li>
              <li>Melhora a estabilidade do controle.</li>
            </ul>
            <p className="mt-2">
              O DPO seleciona esse modo quando o DP continua funcionando, mas o mar está tão
              tranquilo que a rotação constante dos thrusters é desnecessária.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 4 — PROHIBITED / BARRED / EXCLUSION ZONE                 */}
        {/* ================================================================ */}
        <Section
          num={4}
          title="Prohibited / Barred Zone / Exclusion Zone"
          subtitle="Zona Proibida / Zona Barrada / Zona de Exclusão"
        >
          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              A set of <T en="prohibited or barred zone" pt="zona proibida ou barrada" /> for
              azimuth thruster(s) is set to prevent{" "}
              <T en="interference" pt="interferência" /> from other thrusters, the{" "}
              <T en="hull" pt="casco" /> or other equipment.
            </li>
            <li>
              <T en="Multiple azimuth thrusters" pt="Múltiplos thrusters azimutais" /> are fitted
              in <T en="close proximity" pt="proximidade próxima" /> to each other on DP vessel.
            </li>
            <li>
              <T en="DPO" pt="DPO (Operador de DP)" /> can select this function to prevent the{" "}
              <T en="exhaust wash" pt="fluxo de exaustão" /> from one thruster{" "}
              <T en="affect another" pt="afetar outro" />.
            </li>
          </ul>

          <FullTranslation>
            {`Um conjunto de zonas proibidas ou barradas para thruster(s) azimutal(is) é definido para evitar interferência de outros thrusters, do casco ou de outros equipamentos.

Múltiplos thrusters azimutais são instalados em proximidade próxima uns dos outros em embarcações DP.

O DPO pode selecionar essa função para evitar que o fluxo de exaustão (wash) de um thruster afete outro.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              Quando dois thrusters azimutais estão próximos, se um deles aponta para o outro,
              o jato de água (wash) pode causar{" "}
              <strong>perda de eficiência</strong> e até <strong>cavitação</strong> no thruster
              vizinho. A <em>Exclusion Zone</em> bloqueia ângulos específicos para que o thruster
              nunca aponte contra o outro, contra o casco ou contra equipamentos sensíveis
              (como thrusters de túnel, sensores, etc.).
            </p>
            <p className="mt-2">
              Como DPO, você configura essas zonas antes da operação e verifica se o sistema está
              respeitando — o DP pode perder capacidade se uma zona bloquear thrusters
              necessários.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 5 — OPERATIONAL MODES (TABLE)                            */}
        {/* ================================================================ */}
        <Section
          num={5}
          title="Typical List of Operational Modes"
          subtitle="Lista típica de modos operacionais disponíveis"
        >
          <p className="text-slate-700 italic mb-4">
            The following is a typical list of Operational Modes currently available.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-100">
                  <th className="border border-blue-300 px-3 py-2 text-left text-blue-900 font-bold">
                    MODE
                  </th>
                  <th className="border border-blue-300 px-3 py-2 text-left text-blue-900 font-bold">
                    DESCRIPTION
                  </th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="Joystick Manual Heading (JSMH)" pt="Joystick com Rumo Manual (JSMH)" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    The vessel is controlled by the joystick in{" "}
                    <T en="fore/aft" pt="avante/ré" /> and{" "}
                    <T en="port/starboard" pt="bombordo/boreste" /> movement, and rotated by the{" "}
                    <T en="turning control knob" pt="botão de controle de rotação" /> about its{" "}
                    <T en="centre of rotation" pt="centro de rotação" />. This mode is used for{" "}
                    <T en="totally manual vessel maneuvering" pt="manobra totalmente manual da embarcação" />.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="Joystick Auto Heading (JSAH)" pt="Joystick com Rumo Automático (JSAH)" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    The vessel heading is <T en="automatically controlled" pt="controlado automaticamente" />.
                    The joystick controls fore/aft and port/starboard movement. This mode can be
                    used for <T en="close maneuvering" pt="manobra de aproximação" />.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="Independent joystick system (IJS)" pt="Sistema de joystick independente (IJS)" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    A joystick system <T en="independent of the automatic DP control system" pt="independente do sistema DP automático" />{" "}
                    should be arranged. The power supply for the independent joystick system (IJS)
                    is to be independent of the DP control system UPS&apos;s. An{" "}
                    <T en="alarm" pt="alarme" /> should be initiated upon failure of the IJS. The
                    IJS should have <T en="automatic heading control" pt="controle automático de rumo" />.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="DP" pt="DP (Posicionamento Dinâmico)" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    The vessel heading and position are both automatically maintained. This mode is
                    used to maintain a <T en="fixed position" pt="posição fixa" /> in relation to a{" "}
                    <T en="stationary target" pt="alvo estacionário" /> with a fixed heading.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="Min Power / Weathervaning" pt="Potência Mínima / Weathervaning" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    Maintains the heading of the vessel into the{" "}
                    <T en="prevailing weather" pt="tempo predominante" />, while maintaining DP
                    control.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="ROV Follow" pt="Acompanhamento de ROV" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    The vessel&apos;s position is maintained either relative to a{" "}
                    <T en="moving target" pt="alvo em movimento" />, such as a{" "}
                    <T en="Remotely Operated Vehicle (ROV)" pt="Veículo Operado Remotamente (ROV)" />,
                    or maintaining position until the ROV moves outside a{" "}
                    <T en="defined area" pt="área definida" />.
                  </td>
                </tr>
                <tr>
                  <td className="border border-blue-200 px-3 py-2 font-semibold">
                    <T en="Auto Track" pt="Rastreamento Automático" />
                  </td>
                  <td className="border border-blue-200 px-3 py-2">
                    The vessel position is automatically moved along a{" "}
                    <T en="track" pt="trajeto" />, at a{" "}
                    <T en="set low speed" pt="velocidade baixa definida" />, between two or more{" "}
                    <T en="predetermined points (waypoints)" pt="pontos pré-determinados (waypoints)" />{" "}
                    with automatic heading control.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <FullTranslation>
            {`JOYSTICK MANUAL HEADING (JSMH): A embarcação é controlada pelo joystick no movimento avante/ré e bombordo/boreste, e rotacionada pelo botão de controle de rotação em torno de seu centro de rotação. Este modo é usado para manobra totalmente manual da embarcação.

JOYSTICK AUTO HEADING (JSAH): O rumo da embarcação é controlado automaticamente. O joystick controla o movimento avante/ré e bombordo/boreste. Este modo pode ser usado para manobra de aproximação.

INDEPENDENT JOYSTICK SYSTEM (IJS): Um sistema de joystick independente do sistema DP automático deve ser instalado. A fonte de energia do IJS deve ser independente dos UPS do sistema DP. Um alarme deve ser acionado em caso de falha do IJS. O IJS deve ter controle automático de rumo.

DP: Rumo e posição da embarcação são mantidos automaticamente. Este modo é usado para manter uma posição fixa em relação a um alvo estacionário com rumo fixo.

MIN POWER / WEATHERVANING: Mantém o rumo da embarcação de frente para o tempo predominante, mantendo o controle DP.

ROV FOLLOW: A posição da embarcação é mantida em relação a um alvo em movimento, como um ROV, ou mantendo posição até que o ROV se mova para fora de uma área definida.

AUTO TRACK: A posição da embarcação é automaticamente movida ao longo de um trajeto, em velocidade baixa definida, entre dois ou mais pontos pré-determinados (waypoints) com controle automático de rumo.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho — quando usar cada modo">
            <p>
              Cada modo tem uma finalidade específica. Como DPO, você escolhe o modo conforme a
              operação:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>JSMH:</strong> manobra manual pura — usar em emergências ou movimentos
                delicados próximos à instalação.
              </li>
              <li>
                <strong>JSAH:</strong> aproximação final da plataforma — você comanda a posição,
                o DP segura o rumo.
              </li>
              <li>
                <strong>IJS:</strong> backup obrigatório em Class 2/3 — se o DP cair, você assume
                com o joystick independente.
              </li>
              <li>
                <strong>DP:</strong> modo principal de operação — posição e rumo travados.
              </li>
              <li>
                <strong>Min Power:</strong> economia de combustível deixando a proa apontar para
                o vento.
              </li>
              <li>
                <strong>ROV Follow:</strong> operações com ROV em inspeção subsea.
              </li>
              <li>
                <strong>Auto Track:</strong> levantamento sísmico, dragagem e rotas longas
                pré-programadas.
              </li>
            </ul>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 6 — VERTICAL REFERENCE UNIT (VRU)                        */}
        {/* ================================================================ */}
        <Section num={6} title="Vertical Reference Unit (VRU)" subtitle="Unidade de Referência Vertical (VRU)">
          <p className="text-slate-800 leading-relaxed mb-4">
            Although a DP system does not control a vessel in the{" "}
            <T en="pitch, roll and heave axes" pt="eixos de pitch, roll e heave" />, pitch and roll
            must be measured to provide accurate{" "}
            <T en="compensation" pt="compensação" /> for some{" "}
            <T en="position measurement equipment" pt="equipamento de medição de posição" />.
          </p>

          <p className="text-slate-800 leading-relaxed mb-4">
            The VRU on the vessel determines the difference between the{" "}
            <T en={'"local" vertical'} pt="vertical 'local'" /> and{" "}
            <T en="reference plane of vessel" pt="plano de referência da embarcação" />. VRU signals
            are used for <T en="position holding" pt="manutenção de posição" /> rather than{" "}
            <T en="transit" pt="deslocamento/trânsito" />.
          </p>

          <p className="text-slate-800 leading-relaxed mb-2">
            The compensation values of pitch and roll are used for:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-800 leading-relaxed mb-4">
            <li>
              <T en="SBL and USBL acoustics" pt="acústicas SBL e USBL" />.
            </li>
            <li>
              <T en="Inclinometer for slope of taut wire" pt="Inclinômetro para inclinação do taut wire" />.
            </li>
            <li>
              <T en="Inclinometer for slope of riser" pt="Inclinômetro para inclinação do riser" />.
            </li>
            <li>
              <T en="Compensation for aerials" pt="Compensação para antenas" />.
            </li>
          </ul>

          <p className="text-slate-800 leading-relaxed">
            VRUs measure pitch, roll and acceleration. Heave is calculated by the{" "}
            <T en="double integration" pt="dupla integração" /> of the{" "}
            <T en="vertical acceleration" pt="aceleração vertical" /> of the unit. Heave is not
            needed for DP operation, but it is often useful for other purposes, e.g.{" "}
            <T en="advice to helicopters" pt="informação para helicópteros" />.
          </p>

          <FullTranslation>
            {`Embora um sistema DP não controle a embarcação nos eixos de pitch, roll e heave, pitch e roll precisam ser medidos para fornecer compensação precisa para alguns equipamentos de medição de posição.

A VRU na embarcação determina a diferença entre a vertical "local" e o plano de referência da embarcação. Os sinais da VRU são usados para manutenção de posição, e não para trânsito.

Os valores de compensação de pitch e roll são usados para:
- Acústicas SBL e USBL.
- Inclinômetro para inclinação do taut wire.
- Inclinômetro para inclinação do riser.
- Compensação para antenas.

VRUs medem pitch, roll e aceleração. Heave é calculado por dupla integração da aceleração vertical da unidade. Heave não é necessário para a operação de DP, mas é frequentemente útil para outros propósitos, por exemplo, informação para helicópteros.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O DP <strong>não controla</strong> pitch, roll e heave — mas precisa{" "}
              <strong>conhecer</strong> pitch e roll para compensar leituras de sensores. Se a
              embarcação está inclinada, um transdutor acústico apontando para o fundo está, na
              verdade, apontando para o lado — e a medida de distância fica errada. A VRU corrige
              isso em tempo real.
            </p>
            <p className="mt-2">
              O heave (movimento vertical) é calculado por dupla integração, mas <em>não</em> é
              usado pelo DP. É usado para dar informação ao helicóptero sobre a janela segura de
              pouso (quando o helideck está em movimento compatível).
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 7 — INTRODUCTION TO PMEs                                 */}
        {/* ================================================================ */}
        <Section num={7} title="Introduction — Position Measuring Equipment (PME)" subtitle="Introdução — Equipamentos de medição de posição">
          <p className="text-slate-800 leading-relaxed mb-4">
            DP systems depend upon being able to position the vessel in a manner appropriate to
            its role. So, a <T en="drilling platform" pt="plataforma de perfuração" /> will need
            PMEs to maintain it in a <T en="stationary position" pt="posição estacionária" />,
            whereas a <T en="shuttle tanker" pt="navio shuttle (aliviador)" /> will need PMEs to be
            able to position it{" "}
            <T en="relative to a structure or vessel" pt="em relação a uma estrutura ou embarcação" />
            . The accuracy of PMEs depends on their role and the other PMEs with which they are
            used. The reliability of PMEs is usually handled by{" "}
            <T en="presuming that PMEs will fail" pt="presumindo que as PMEs falharão" /> and
            therefore providing{" "}
            <T en="redundancy" pt="redundância" /> both in{" "}
            <T en="similar and alternative PMEs" pt="PMEs similares e alternativas" />.
          </p>

          <p className="text-slate-800 leading-relaxed mb-4">
            There are many different PME systems used for position reference with DP systems. The
            selection of PMEs for a vessel is based on the role of the vessel and the
            characteristics of the PME. It is possible to have a DP system supported by{" "}
            <T en="just one PME" pt="apenas uma PME" /> but for reliability,{" "}
            <T en="two or more PMEs" pt="duas ou mais PMEs" /> are usually used.
          </p>

          <p className="text-slate-800 leading-relaxed mb-2">
            PMEs can be grouped based on the technology used.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-800 leading-relaxed">
            <li>
              <T en="Taut Wire" pt="Arame tensionado (Taut Wire)" />
            </li>
            <li>
              <T en="Radio" pt="Rádio" />
            </li>
            <li>
              <T en="GPS" pt="GPS" />
            </li>
            <li>
              <T en="Hydro Acoustic" pt="Hidro-acústico" />
            </li>
            <li>
              <T en="Laser" pt="Laser" />
            </li>
          </ul>

          <FullTranslation>
            {`Os sistemas DP dependem de conseguir posicionar a embarcação de forma apropriada para o seu papel. Então, uma plataforma de perfuração precisará de PMEs para mantê-la em posição estacionária, enquanto um navio shuttle precisará de PMEs para se posicionar em relação a uma estrutura ou embarcação. A precisão das PMEs depende do seu papel e das outras PMEs com as quais são usadas. A confiabilidade das PMEs geralmente é tratada presumindo que as PMEs falharão e, portanto, fornecendo redundância tanto em PMEs similares quanto alternativas.

Existem muitos sistemas PME diferentes usados para referência de posição em sistemas DP. A seleção de PMEs para uma embarcação é baseada no papel da embarcação e nas características da PME. É possível ter um sistema DP suportado por apenas uma PME, mas por confiabilidade, duas ou mais PMEs são geralmente usadas.

PMEs podem ser agrupadas com base na tecnologia utilizada:
- Taut Wire (arame tensionado)
- Rádio
- GPS
- Hidro-acústico
- Laser`}
          </FullTranslation>

          <Explanation title="Uso no trabalho — o que é PME">
            <p>
              <strong>PME</strong> (Position Measuring Equipment) é qualquer equipamento que
              informa ao DP onde a embarcação está. Cada tipo tem pontos fortes e fracos:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Taut Wire:</strong> preciso até 500m, mas limitado em águas profundas.</li>
              <li><strong>Rádio (Artemis):</strong> longo alcance, mas exige linha de visada.</li>
              <li><strong>GPS/DGPS:</strong> global, mas pode ser afetado por sol.</li>
              <li><strong>Hidro-acústico:</strong> preciso em águas profundas, mas lento.</li>
              <li><strong>Laser (Fanbeam/CyScan):</strong> muito preciso em curto alcance.</li>
            </ul>
            <p className="mt-2">
              Regra prática: <em>PMEs devem usar princípios físicos diferentes</em> (não adianta
              ter 3 DGPS — se o sol afetar, os 3 caem juntos). O ideal é combinar, por exemplo,
              2 DGPS + 1 Fanbeam + 1 Taut Wire.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 8 — POOLING OF PME POSITION REFERENCES                   */}
        {/* ================================================================ */}
        <Section num={8} title="Pooling of PME Position References" subtitle="Agrupamento de referências de posição das PMEs">
          <p className="text-slate-800 leading-relaxed mb-4">
            Where several PME position references are available, their values can be{" "}
            <T en="pooled" pt="agrupados" /> in several ways. The simplest form of pooling is to
            use the <T en="average value" pt="valor médio" />. A more sophisticated method is to{" "}
            <T en="discard" pt="descartar" /> any readings which fall{" "}
            <T en="outside a window" pt="fora de uma janela" /> placed around the average position.
            A further sophistication is to place{" "}
            <T en="weightings" pt="ponderações/pesos" /> on each PME for creating the mean value.
            The pooling of PMEs complements the{" "}
            <T en="individual PME checks for signal reliability" pt="verificações individuais de confiabilidade do sinal de cada PME" />
            , which may cause the PME to be{" "}
            <T en="deselected" pt="desselecionada" />.
          </p>

          <p className="text-slate-800 leading-relaxed mb-4">
            When several PMEs are available, a{" "}
            <T en="voting system" pt="sistema de votação" /> can be used to pool the position
            values, weighting the values as appropriate.
          </p>

          <p className="text-slate-800 leading-relaxed">
            In certain weather conditions, the reference position from the PMEs may vary{" "}
            <T en="rapidly or erratically" pt="rápida ou erraticamente" />. To avoid unnecessary{" "}
            <T en="thruster demands" pt="demandas dos thrusters" />, the operator can alter the{" "}
            <T en="vessel response to PME" pt="resposta da embarcação às PMEs" /> by adjusting the{" "}
            <T en="Kalman filter" pt="Filtro de Kalman" /> in the control system.
          </p>

          <FullTranslation>
            {`Onde várias referências de posição de PMEs estão disponíveis, seus valores podem ser agrupados de várias maneiras. A forma mais simples de agrupamento é usar o valor médio. Um método mais sofisticado é descartar quaisquer leituras que caiam fora de uma janela colocada em torno da posição média. Uma sofisticação ainda maior é colocar ponderações em cada PME para criar o valor médio. O agrupamento de PMEs complementa as verificações individuais de confiabilidade do sinal de cada PME, que podem fazer com que a PME seja desselecionada.

Quando várias PMEs estão disponíveis, um sistema de votação pode ser usado para agrupar os valores de posição, ponderando os valores conforme apropriado.

Em certas condições meteorológicas, a posição de referência das PMEs pode variar rápida ou erraticamente. Para evitar demandas desnecessárias dos thrusters, o operador pode alterar a resposta da embarcação às PMEs ajustando o Filtro de Kalman no sistema de controle.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho — pooling e votação">
            <p>
              O DP não confia em uma única PME. Ele <strong>compara</strong> várias leituras e
              decide qual é a mais confiável. O sistema:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>Faz a média</strong> das PMEs selecionadas;
              </li>
              <li>
                <strong>Descarta</strong> leituras que fogem muito (janela);
              </li>
              <li>
                <strong>Pondera</strong> cada PME conforme sua confiabilidade histórica;
              </li>
              <li>
                <strong>Desseleciona</strong> automaticamente PMEs com sinal ruim.
              </li>
            </ul>
            <p className="mt-2">
              Em mar agitado, uma PME pode oscilar muito — se o DP reagir a tudo, os thrusters
              vão ficar sobrecarregados. O DPO ajusta o <strong>Kalman Filter</strong> para deixar
              a resposta mais suave. Isso é chamado de "heavy weather filter".
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 9 — TAUT WIRE                                            */}
        {/* ================================================================ */}
        <Section num={9} title="Taut Wire" subtitle="Arame Tensionado">
          <p className="text-slate-800 leading-relaxed mb-4">
            A Taut Wire system measures the{" "}
            <T en="variation in the position" pt="variação na posição" /> of a{" "}
            <T en="fixed point on the seabed" pt="ponto fixo no fundo do mar" />. The two points
            are joined by a{" "}
            <T en="constantly tensioned wire" pt="arame constantemente tensionado" />, and it is
            the variation in the <T en="angle of the wire" pt="ângulo do arame" /> which is
            measured.
          </p>

          <p className="text-slate-800 leading-relaxed mb-4">
            The system determines the{" "}
            <T en="horizontal displacement of the vessel" pt="deslocamento horizontal da embarcação" />{" "}
            relative to the fixed point on the seabed using the{" "}
            <T en="length of the wire deployed" pt="comprimento do arame desenrolado" /> and the
            angles of the <T en="inclinometers" pt="inclinômetros" /> attached to the wire.
          </p>

          <p className="text-slate-800 leading-relaxed">
            The mechanical system consists of a{" "}
            <T en="sinker weight" pt="peso de fundeio (sinker)" />, which is lowered to the seabed
            and a <T en="winch" pt="guincho (winch)" /> on the vessel which maintains{" "}
            <T en="tension in the wire" pt="tensão no arame" />.
          </p>

          <FullTranslation>
            {`Um sistema Taut Wire mede a variação na posição de um ponto fixo no fundo do mar. Os dois pontos são unidos por um arame constantemente tensionado, e é a variação no ângulo do arame que é medida.

O sistema determina o deslocamento horizontal da embarcação em relação ao ponto fixo no fundo usando o comprimento do arame desenrolado e os ângulos dos inclinômetros fixados ao arame.

O sistema mecânico consiste em um peso de fundeio (sinker weight), que é baixado até o fundo, e um guincho (winch) na embarcação que mantém a tensão no arame.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O <strong>Taut Wire</strong> é um dos sistemas mais antigos e confiáveis. O princípio
              é simples: você joga um peso no fundo do mar, mantém o arame esticado, e mede como
              o arame se inclina quando a embarcação se move. O ângulo + comprimento = deslocamento.
            </p>
            <p className="mt-2">
              <strong>Vantagens:</strong> independente de GPS/satélite, funciona bem em curtas
              distâncias, muito confiável.
            </p>
            <p className="mt-1">
              <strong>Limitações:</strong> limitado a 500m de profundidade (efeito catenária),
              precisa de espaço físico a bordo, pode arrastar em mar agitado.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 10 — TAUT WIRE ATTENTION                                 */}
        {/* ================================================================ */}
        <Section num={10} title="Taut Wire — ATTENTION" subtitle="Atenção — Arame Tensionado">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-4">
            <p className="text-red-900 font-bold text-lg mb-2">⚠️ ATTENTION</p>
            <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
              <li>
                <T en="Typical accuracy" pt="Precisão típica" /> of a Taut Wire is{" "}
                <T en="±2% of the water depth" pt="±2% da profundidade da água" />, up to{" "}
                <T en="500 meters" pt="500 metros" />.
              </li>
              <li>
                As the depth and/or angle become greater, the{" "}
                <T en="catenary effect" pt="efeito de catenária" /> increases, causing the accuracy
                to decrease due to the effect of{" "}
                <T en="currents and tides" pt="correntes e marés" />. Typically, the{" "}
                <T en="maximum angle allowable" pt="ângulo máximo permitido" /> is{" "}
                <T en="±30°" pt="±30°" /> in either plane. A{" "}
                <T en="service working range" pt="faixa de trabalho operacional" /> is{" "}
                <T en="±15°" pt="±15°" />. Deployment and retrieval of the sinker weight can be a
                problem in <T en="heavy sea conditions" pt="condições de mar agitado" />, as can{" "}
                <T en="dragging of the weight" pt="arrasto do peso" />.
              </li>
            </ul>
          </div>

          <FullTranslation>
            {`ATENÇÃO

A precisão típica de um Taut Wire é de ±2% da profundidade da água, até 500 metros.

À medida que a profundidade e/ou o ângulo aumentam, o efeito de catenária aumenta, causando diminuição da precisão devido ao efeito de correntes e marés. Tipicamente, o ângulo máximo permitido é de ±30° em qualquer plano. A faixa de trabalho operacional é de ±15°. O lançamento e recolhimento do peso de fundeio podem ser um problema em condições de mar agitado, assim como o arrasto do peso.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              Esses números são <strong>críticos</strong> na operação:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>±2% até 500m:</strong> a 400m de profundidade, a precisão é de ±8m — isso
                pode ser aceitável ou não dependendo da operação.
              </li>
              <li>
                <strong>±15° operacional / ±30° máximo:</strong> se o arame passar de 15°, a
                precisão degrada; se passar de 30°, o sistema deve ser <em>desselecionado</em>.
              </li>
              <li>
                <strong>Peso pode arrastar:</strong> se o peso no fundo deslizar, todas as leituras
                ficam erradas — o DPO precisa monitorar.
              </li>
              <li>
                <strong>Recolhimento em mar grosso:</strong> pode ser perigoso pra equipe no
                convés.
              </li>
            </ul>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 11 — RADIO SYSTEMS — ARTEMIS                             */}
        {/* ================================================================ */}
        <Section num={11} title="Radio Systems — Artemis" subtitle="Sistemas de Rádio — Artemis">
          <h3 className="text-lg font-bold text-blue-800 mb-2">1. Artemis</h3>
          <p className="text-slate-800 leading-relaxed">
            A <T en="microwave system" pt="sistema de micro-ondas" /> operating between a{" "}
            <T en="fixed and mobile station" pt="estação fixa e móvel" />, which provides{" "}
            <T en="range and bearing data" pt="dados de distância (range) e direção (bearing)" />{" "}
            relative to the fixed station.
          </p>

          <FullTranslation>
            {`1. Artemis

Um sistema de micro-ondas que opera entre uma estação fixa e uma móvel, fornecendo dados de distância (range) e direção (bearing) relativos à estação fixa.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O <strong>Artemis</strong> funciona a <strong>9.2 GHz</strong> e é um dos sistemas de
              rádio mais usados em DP. Uma antena fica na plataforma (fixa), outra na embarcação
              (móvel). Ela mede:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Range:</strong> distância entre as antenas;</li>
              <li><strong>Bearing:</strong> direção (ângulo).</li>
            </ul>
            <p className="mt-2">
              <strong>Vantagens:</strong> não é afetado por chuva/neblina (usa micro-ondas),
              alcance de 10m a 30km.
            </p>
            <p className="mt-1">
              <strong>Limitação:</strong> exige <em>linha de visada desobstruída</em> — se um
              contêiner ou guindaste bloquear, perde sinal. O DPO precisa monitorar interferências.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 12 — HYDRO ACOUSTICS                                     */}
        {/* ================================================================ */}
        <Section num={12} title="Hydro Acoustics" subtitle="Sistemas Hidro-acústicos">
          <p className="text-slate-800 leading-relaxed mb-4">
            There are <T en="three basic system types" pt="três tipos básicos de sistema" /> and a{" "}
            <T en="fourth" pt="quarto" /> which is a{" "}
            <T en="combination of two of the basic types" pt="combinação de dois dos tipos básicos" />
            . The four types are:
          </p>

          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              <T en="Long Base Line (LBL)" pt="Linha de Base Longa (LBL)" />. Accurate, but
              requires an <T en="array of seabed beacons" pt="conjunto (array) de beacons no fundo" />.
            </li>
            <li>
              <T en="Short Base Line (SBL)" pt="Linha de Base Curta (SBL)" />. Now{" "}
              <T en="superseded" pt="obsoleta/substituída" />.
            </li>
            <li>
              <T en="Ultra Short Base Line (USBL)" pt="Linha de Base Ultra Curta (USBL)" />. Less
              accurate than LBL, uses <T en="one beacon" pt="um beacon" />.
            </li>
            <li>
              <T en="Long and Ultra Short Baseline (LUSBL)" pt="Linha de Base Longa e Ultra Curta (LUSBL)" />
              . <T en="Combines best of both" pt="Combina o melhor dos dois" />.
            </li>
          </ul>

          <FullTranslation>
            {`Existem três tipos básicos de sistema e um quarto que é uma combinação de dois dos tipos básicos. Os quatro tipos são:

- Long Base Line (LBL) — Linha de Base Longa. Precisa, mas requer um array de beacons no fundo do mar.
- Short Base Line (SBL) — Linha de Base Curta. Agora obsoleta/substituída.
- Ultra Short Base Line (USBL) — Linha de Base Ultra Curta. Menos precisa que LBL, usa um único beacon.
- Long and Ultra Short Baseline (LUSBL) — Linha de Base Longa e Ultra Curta. Combina o melhor dos dois.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho — qual usar?">
            <p>
              A escolha entre LBL/SBL/USBL/LUSBL depende da <strong>profundidade</strong> e da{" "}
              <strong>precisão necessária</strong>:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>LBL:</strong> precisa (array de transponders no fundo) — usado em
                operações críticas, mas caro e lento.
              </li>
              <li>
                <strong>SBL:</strong> obsoleto — usava hidrofones no casco.
              </li>
              <li>
                <strong>USBL:</strong> mais simples (1 beacon), mas menos preciso.
              </li>
              <li>
                <strong>LUSBL:</strong> o melhor dos dois mundos — precisão de LBL com
                simplicidade de USBL.
              </li>
            </ul>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 13 — LONG BASE LINE (LBL)                                */}
        {/* ================================================================ */}
        <Section num={13} title="Long Base Line (LBL)" subtitle="Linha de Base Longa (LBL)">
          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              LBL acoustic systems consist of a{" "}
              <T en="single transducer on the vessel" pt="transdutor único na embarcação" />, and
              an <T en="array of at least three transponders" pt="array de pelo menos três transponders" />
              , which are separated by <T en="more than 500 meters" pt="mais de 500 metros" />. It
              is a <T en="range-range measuring system" pt="sistema de medição range-range" />,
              with <T en="no angular measurement" pt="sem medição angular" />. The transponders are
              placed on the seabed and their positions{" "}
              <T en="accurately determined" pt="determinadas com precisão" />.
            </li>
            <li>
              The accuracy of acoustic systems is very dependent upon the{" "}
              <T en="depth of water" pt="profundidade da água" /> and so{" "}
              <T en="generalized figures" pt="números generalizados" /> are of little use. However,
              LBL is <T en="more accurate than either SBL or USBL" pt="mais precisa que SBL ou USBL" />
              . It also has the advantage that the technique used with LBL{" "}
              <T en="does not require a VRU" pt="não requer uma VRU" /> for angle compensation for
              vessel motion.
            </li>
            <li>
              The main <T en="disadvantages" pt="desvantagens" /> of LBL are that{" "}
              <T en="deploying and calibrating the array" pt="lançar e calibrar o array" /> is{" "}
              <T en="expensive" pt="caro" />.
            </li>
          </ul>

          <FullTranslation>
            {`- Sistemas acústicos LBL consistem em um único transdutor na embarcação e um array de pelo menos três transponders, separados por mais de 500 metros. É um sistema de medição range-range, sem medição angular. Os transponders são colocados no fundo do mar e suas posições determinadas com precisão.

- A precisão de sistemas acústicos é muito dependente da profundidade da água, então números generalizados são de pouco uso. No entanto, o LBL é mais preciso que o SBL ou o USBL. Também tem a vantagem de que a técnica usada com LBL não requer uma VRU para compensação angular do movimento da embarcação.

- As principais desvantagens do LBL são que lançar e calibrar o array é caro.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O <strong>LBL</strong> é o "padrão ouro" dos sistemas acústicos — mas é caro e
              demorado. Você precisa:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Posicionar 3+ transponders no fundo com precisão;</li>
              <li>Calibrar as posições deles (leva horas);</li>
              <li>Lançar o transdutor da embarcação;</li>
              <li>Aí sim começar a medir.</li>
            </ol>
            <p className="mt-2">
              <strong>Vantagem única:</strong> como mede apenas distâncias (range-range), não
              precisa de VRU. Isso elimina uma fonte de erro. Mas a 4000m de profundidade, cada
              leitura pode levar <strong>10 segundos</strong> — muito lento.
            </p>
          </Explanation>
        </Section>

        {/* ================================================================ */}
        {/* SECTION 14 — SHORT BASE LINE (SBL)                               */}
        {/* ================================================================ */}
        <Section num={14} title="Short Base Line (SBL)" subtitle="Linha de Base Curta (SBL)">
          <ul className="list-disc pl-6 space-y-3 text-slate-800 leading-relaxed">
            <li>
              SBL uses a{" "}
              <T en="single transponder" pt="transponder único" /> and array of{" "}
              <T en="transducers mounted under the vessel hull" pt="transdutores montados sob o casco da embarcação" />
              . The term <T en="acoustic beacon" pt="beacon acústico" /> is usually used because it
              sends out a <T en="series of pulses" pt="série de pulsos" />, rather than responding
              to an input.
            </li>
            <li>
              Similarly, the transducers are sometimes called{" "}
              <T en="hydrophones" pt="hidrofones" /> as all they need to do is{" "}
              <T en="listen" pt="escutar" />. The{" "}
              <T en="baseline" pt="linha de base" /> for this technique is the{" "}
              <T en="separation of the transducers" pt="separação dos transdutores" /> along the
              vessel bottom. Again, it is a range system but now it needs{" "}
              <T en="compensation for vessel motion" pt="compensação para o movimento da embarcação" />
              , which is provided by the <T en="VRU" pt="VRU" />.
            </li>
            <li>
              The beacon on the seabed emits{" "}
              <T en="short bursts of acoustic energy" pt="curtas rajadas de energia acústica" />{" "}
              with a <T en="known periodicity and frequency" pt="periodicidade e frequência conhecidas" />
              . The <T en="time of arrival" pt="tempo de chegada" /> of a single pulse at three or
              more transducers is measured. Detecting the required sound from the{" "}
              <T en="background noise" pt="ruído de fundo" /> requires hydrophones which reduce
              noise effects. The{" "}
              <T en="minimum distance between hydrophones" pt="distância mínima entre hidrofones" />{" "}
              is <T en="15 m" pt="15 m" />.
            </li>
          </ul>

          <FullTranslation>
            {`- SBL usa um único transponder e um array de transdutores montados sob o casco da embarcação. O termo "acoustic beacon" (beacon acústico) é geralmente usado porque ele emite uma série de pulsos, em vez de responder a um input.

- Da mesma forma, os transdutores às vezes são chamados de "hydrophones" (hidrofones), pois tudo o que precisam fazer é escutar. A linha de base (baseline) para esta técnica é a separação dos transdutores ao longo do fundo da embarcação. Novamente, é um sistema de range, mas agora precisa de compensação para o movimento da embarcação, que é fornecida pela VRU.

- O beacon no fundo do mar emite curtas rajadas de energia acústica com periodicidade e frequência conhecidas. O tempo de chegada de um único pulso em três ou mais transdutores é medido. Detectar o som necessário a partir do ruído de fundo requer hidrofones que reduzem os efeitos de ruído. A distância mínima entre hidrofones é de 15 m.`}
          </FullTranslation>

          <Explanation title="Uso no trabalho">
            <p>
              O <strong>SBL</strong> é considerado obsoleto hoje em dia, mas entender ele ajuda a
              entender USBL e LUSBL. A ideia:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>1 beacon no fundo (emite pulsos);</li>
              <li>3+ hidrofones no casco (escutam);</li>
              <li>Mede o tempo que o pulso leva pra chegar em cada hidrofone;</li>
              <li>Por triangulação, calcula a posição do beacon em relação ao navio.</li>
            </ul>
            <p className="mt-2">
              <strong>Problema:</strong> como os hidrofones estão no casco, o movimento de pitch
              e roll bagunça tudo. Precisa de VRU pra compensar. Além disso, exige 15m de
              separação entre hidrofones — nem toda embarcação tem espaço.
            </p>
          </Explanation>
        </Section>

        {/* ============== END ============== */}
        <div className="text-center mt-12 mb-4">
          <button
            onClick={() => router.push("/cursos/offshore")}
            className="bg-blue-700 hover:bg-blue-600 text-white font-bold px-8 py-3 rounded-full transition-all shadow-lg"
          >
            ← Voltar para Cursos Offshore
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