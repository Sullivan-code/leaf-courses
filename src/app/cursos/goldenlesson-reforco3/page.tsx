"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
};

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
          <p className="text-sm text-blue-100 mt-1">Suas dúvidas, traduções e dicas</p>
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">Cancelar</button>
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full hover:opacity-90 transition-all">Salvar</button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="ml-3 text-blue-200 hover:text-white transition-colors" title="Fazer anotações">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

const speakText = (text: string) => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Samantha') || v.name.includes('Google US English') || v.name.includes('Microsoft Zira')));
      if (femaleVoice) utterance.voice = femaleVoice;
    };
    setVoice();
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
};

function Quiz({ questions, levelLabel }: { questions: QuizQuestion[]; levelLabel?: string }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  return (
    <div className="space-y-8">
      {levelLabel && (
        <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
          {levelLabel}
        </div>
      )}
      {questions.map((q, index) => (
        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</p>
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswers[q.id] === i;
              const isCorrect = i === q.correctAnswer;
              let btnClass = "w-full text-left p-3 rounded-xl border-2 transition-all ";
              if (showResults) {
                if (isCorrect) btnClass += "border-green-500 bg-green-50";
                else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-50";
                else btnClass += "border-gray-200 opacity-70";
              } else {
                btnClass += isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300";
              }
              return (
                <button key={i} onClick={() => handleSelect(q.id, i)} className={btnClass}>
                  <span className="font-bold mr-2">{String.fromCharCode(65 + i)})</span>
                  {opt}
                </button>
              );
            })}
          </div>
          {showResults && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-sm border border-yellow-200">
              <span className="font-bold text-yellow-800">Explicação: </span>
              {q.explanation}
            </div>
          )}
        </div>
      ))}
      <div className="text-center">
        <button
          onClick={() => setShowResults(true)}
          disabled={showResults}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {showResults ? "Resultados Exibidos" : "Verificar Respostas"}
        </button>
        {showResults && (
          <button onClick={() => { setShowResults(false); setSelectedAnswers({}); }} className="ml-4 px-6 py-3 text-blue-600 font-bold hover:underline">
            Tentar Novamente
          </button>
        )}
      </div>
    </div>
  );
}

export default function VerbToBePresentContinuousLesson() {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [noteModal, setNoteModal] = useState<NoteModalState>({ isOpen: false, sectionTitle: '', noteContent: '' });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const toggleSection = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  const openNoteModal = (title: string) => setNoteModal({ isOpen: true, sectionTitle: title, noteContent: savedNotes[title] || '' });
  const saveNote = (note: string) => setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));

  return (
    <div className="min-h-screen bg-[#f0f8ff] py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-12">

        {/* Header */}
        <div className="text-center bg-white p-8 rounded-[40px] shadow-lg border border-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
            Verb To Be & Present Continuous
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aula completa com teoria, tabelas, dicas e <strong>40 exercícios</strong> de múltipla escolha
            organizados por nível crescente de dificuldade.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">AM / IS / ARE</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">VERBO + ING</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Negativa</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Interrogativa</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Contrações</span>
          </div>
        </div>

        {/* Section 1 – Verb To Be */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">1. Verb TO BE – Presente Simples</h2>
            <PencilIcon onClick={() => openNoteModal('Verb To Be')} />
          </div>
          <div className="p-8 space-y-6">
            <p className="text-gray-700">
              O verbo <strong>TO BE</strong> significa <strong>SER ou ESTAR</strong>. No presente, ele tem três formas: <strong>AM</strong>, <strong>IS</strong> e <strong>ARE</strong>.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl">
              <p className="font-bold text-yellow-800">🧠 Macete para memorizar:</p>
              <p className="text-gray-700 mt-1"><strong>AM</strong> → I</p>
              <p className="text-gray-700"><strong>IS</strong> → He / She / It</p>
              <p className="text-gray-700"><strong>ARE</strong> → You / We / They</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left">Pronome</th>
                    <th className="p-3 text-left">Português</th>
                    <th className="p-3 text-left">TO BE</th>
                    <th className="p-3 text-left">Contração</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {[
                    ["I", "Eu", "AM", "I'm"],
                    ["You", "Você", "ARE", "You're"],
                    ["He", "Ele", "IS", "He's"],
                    ["She", "Ela", "IS", "She's"],
                    ["It", "Ele/Ela (coisa/animal)", "IS", "It's"],
                    ["We", "Nós", "ARE", "We're"],
                    ["You", "Vocês", "ARE", "You're"],
                    ["They", "Eles/Elas", "ARE", "They're"],
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                      {row.map((cell, j) => <td key={j} className="p-3 border-b border-blue-100">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">✅ Afirmativa</h4>
                <p className="text-sm text-gray-700">I <strong>am</strong> happy. / She <strong>is</strong> tired. / They <strong>are</strong> friends.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-800 mb-2">❌ Negativa (NOT)</h4>
                <p className="text-sm text-gray-700">I am <strong>not</strong> happy. / She <strong>isn't</strong> tired. / They <strong>aren't</strong> friends.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">❓ Interrogativa</h4>
                <p className="text-sm text-gray-700"><strong>Am</strong> I late? / <strong>Is</strong> she tired? / <strong>Are</strong> they married?</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800 mb-2">🔊 Pronúncia</h4>
                <button onClick={() => speakText("I am happy. She is tired. They are friends.")} className="text-sm text-purple-700 hover:underline">
                  Ouvir exemplos →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 – Present Continuous */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">2. Present Continuous – Presente Contínuo</h2>
            <PencilIcon onClick={() => openNoteModal('Present Continuous')} />
          </div>
          <div className="p-8 space-y-6">
            <p className="text-gray-700">
              Usado para ações que estão acontecendo <strong>neste momento</strong>.
            </p>
            <div className="bg-pink-50 border border-pink-200 p-5 rounded-xl text-center">
              <p className="text-lg font-bold text-pink-800">
                FÓRMULA: AM / IS / ARE + VERBO + ING
              </p>
              <p className="text-gray-700 mt-2">Exemplo: <strong>I am studying.</strong> (Eu estou estudando.)</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800 mb-2">✅ Afirmativa</h4>
                <p className="text-sm text-gray-700">I <strong>am working</strong>.<br />She <strong>is reading</strong>.<br />They <strong>are playing</strong>.</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <h4 className="font-bold text-red-800 mb-2">❌ Negativa</h4>
                <p className="text-sm text-gray-700">I <strong>am not working</strong>.<br />She <strong>isn't reading</strong>.<br />They <strong>aren't playing</strong>.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-2">❓ Interrogativa</h4>
                <p className="text-sm text-gray-700"><strong>Am</strong> I working?<br /><strong>Is</strong> she reading?<br /><strong>Are</strong> they playing?</p>
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mt-4">Regras do -ING:</h4>
            <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
              <li>Verbos terminados em <strong>E</strong>: remove o E → write → <strong>writing</strong>; make → <strong>making</strong></li>
              <li>Verbos curtos CVC (consoante-vogal-consoante): dobra a consoante → run → <strong>running</strong>; swim → <strong>swimming</strong>; sit → <strong>sitting</strong></li>
              <li>Verbos terminados em <strong>IE</strong>: troca por Y → lie → <strong>lying</strong>; die → <strong>dying</strong></li>
              <li>Demais verbos: apenas +ING → study → <strong>studying</strong>; play → <strong>playing</strong></li>
            </ul>
          </div>
        </section>

        {/* Section 3 – To Be vs Present Continuous */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">3. TO BE sozinho vs PRESENT CONTINUOUS</h2>
            <PencilIcon onClick={() => openNoteModal('Diferença To Be vs Present Continuous')} />
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800 text-lg mb-3">TO BE sozinho</h4>
                <p className="text-sm text-gray-600 mb-2">Indica <strong>estado, característica, identidade ou localização</strong>.</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>I <strong>am</strong> happy. (estado)</li>
                  <li>She <strong>is</strong> beautiful. (característica)</li>
                  <li>He <strong>is</strong> a teacher. (identidade)</li>
                  <li>We <strong>are</strong> at home. (localização)</li>
                </ul>
              </div>
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-200">
                <h4 className="font-bold text-pink-800 text-lg mb-3">PRESENT CONTINUOUS</h4>
                <p className="text-sm text-gray-600 mb-2">Indica uma <strong>ação acontecendo agora</strong>.</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>I <strong>am studying</strong>. (ação)</li>
                  <li>She <strong>is working</strong>. (ação)</li>
                  <li>He <strong>is sleeping</strong>. (ação)</li>
                  <li>We <strong>are traveling</strong>. (ação)</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <p className="font-bold text-yellow-800">🏆 Regra de Ouro:</p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>AM/IS/ARE</strong> → SER ou ESTAR.<br />
                <strong>AM/IS/ARE + VERBO ING</strong> → ação acontecendo AGORA.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 – Level 1: Básico */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">4. Exercícios Nível 1 – Básico (Q1–10)</h2>
            <PencilIcon onClick={() => openNoteModal('Exercícios Básicos')} />
          </div>
          <div className="p-8">
            <Quiz levelLabel="🟢 NÍVEL 1 – BÁSICO" questions={[
              { id: 1, question: "Complete: I _____ a student.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 0, explanation: "O pronome I sempre usa AM no verbo TO BE." },
              { id: 2, question: "Complete: She _____ my sister.", options: ["AM", "IS", "ARE", "BE", "DOES"], correctAnswer: 1, explanation: "She (ela) → IS." },
              { id: 3, question: "Complete: They _____ at school now.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 2, explanation: "They (eles) → ARE." },
              { id: 4, question: "Complete: He _____ tired today.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 1, explanation: "He (ele) → IS." },
              { id: 5, question: "Complete: We _____ happy.", options: ["AM", "IS", "ARE", "BE", "DOES"], correctAnswer: 2, explanation: "We (nós) → ARE." },
              { id: 6, question: "Complete: It _____ cold today.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 1, explanation: "It (coisa/animal) → IS." },
              { id: 7, question: "Complete: You _____ a good student.", options: ["AM", "IS", "ARE", "BE", "DOES"], correctAnswer: 2, explanation: "You (você/vocês) → ARE." },
              { id: 8, question: "Complete: I _____ studying English.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 0, explanation: "Present Continuous com I: AM + verbo + ING." },
              { id: 9, question: "Complete: She _____ cooking dinner.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 1, explanation: "Present Continuous com she: IS + verbo + ING." },
              { id: 10, question: "Complete: They _____ playing soccer.", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 2, explanation: "Present Continuous com they: ARE + verbo + ING." },
            ]} />
          </div>
        </section>

        {/* Section 5 – Level 2: Básico+ */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">5. Exercícios Nível 2 – Básico+ (Q11–17)</h2>
            <PencilIcon onClick={() => openNoteModal('Exercícios Nível 2')} />
          </div>
          <div className="p-8">
            <Quiz levelLabel="🔵 NÍVEL 2 – BÁSICO+" questions={[
              { id: 11, question: "Complete (negativa): I _____ not hungry.", options: ["AM", "IS", "ARE", "BE", "DOES"], correctAnswer: 0, explanation: "I am not = eu não sou/estou. 'I' sempre usa AM." },
              { id: 12, question: "Choose the correct contracted negative: She _____ sleeping.", options: ["isn't", "aren't", "amn't", "don't", "doesn't"], correctAnswer: 0, explanation: "She → IS. Contração negativa: ISN'T (= is not)." },
              { id: 13, question: "Complete the question: _____ you working?", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 2, explanation: "Pergunta com you: ARE + pronome + verbo ING? → Are you working?" },
              { id: 14, question: "Complete the question: _____ he a doctor?", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 1, explanation: "Pergunta com he: IS + he...? → Is he a doctor?" },
              { id: 15, question: "Complete: He is _____ TV right now.", options: ["watch", "watches", "watching", "watched", "to watch"], correctAnswer: 2, explanation: "Present Continuous: IS + verbo + ING → is watching." },
              { id: 16, question: "Complete: I am _____ water.", options: ["drink", "drinks", "drinking", "drank", "to drink"], correctAnswer: 2, explanation: "Present Continuous: AM + verbo + ING → am drinking." },
              { id: 17, question: "Complete the negative: They are not _____ .", options: ["study", "studies", "studying", "studied", "to study"], correctAnswer: 2, explanation: "Present Continuous negativo: ARE + NOT + verbo ING → are not studying." },
            ]} />
          </div>
        </section>

        {/* Section 6 – Level 3: Intermediário */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">6. Exercícios Nível 3 – Intermediário (Q18–25)</h2>
            <PencilIcon onClick={() => openNoteModal('Exercícios Intermediários')} />
          </div>
          <div className="p-8">
            <Quiz levelLabel="🟡 NÍVEL 3 – INTERMEDIÁRIO" questions={[
              { id: 18, question: "What is the correct -ING form of the verb RUN?", options: ["runing", "running", "runnning", "runeing", "runin"], correctAnswer: 1, explanation: "RUN termina em CVC (consoante-vogal-consoante): dobra a consoante → RUNNING." },
              { id: 19, question: "What is the correct -ING form of the verb WRITE?", options: ["writeing", "writting", "writing", "writting", "writin"], correctAnswer: 2, explanation: "WRITE termina em E: remove o E antes de ING → WRITING." },
              { id: 20, question: "Choose the correct negative form: She _____ studying right now.", options: ["isn't", "aren't", "amn't", "don't", "not is"], correctAnswer: 0, explanation: "She → IS. Negativa contraída: ISN'T (= is not)." },
              { id: 21, question: "Complete the question: _____ they sleeping?", options: ["AM", "IS", "ARE", "BE", "DO"], correctAnswer: 2, explanation: "They → ARE. Pergunta: Are they sleeping?" },
              { id: 22, question: "Which sentence is grammatically correct?", options: ["He is study English.", "He is studying English.", "He studying English.", "He are studying English.", "He am studying English."], correctAnswer: 1, explanation: "Present Continuous com He: IS + studying. A opção B está correta." },
              { id: 23, question: "Which sentence uses TO BE alone (state/characteristic)?", options: ["I am studying for the test.", "I am happy today.", "They are playing soccer.", "She is cooking dinner.", "He is working now."], correctAnswer: 1, explanation: "'I am happy' usa TO BE sozinho para indicar ESTADO. As demais indicam AÇÕES (Present Continuous)." },
              { id: 24, question: "Complete: We _____ not ready for the exam.", options: ["am", "is", "are", "be", "do"], correctAnswer: 2, explanation: "We → ARE. Negativa: We are not ready." },
              { id: 25, question: "What is the correct NEGATIVE of 'She is cooking'?", options: ["She isn't cooking.", "She aren't cooking.", "She am not cooking.", "She not cooking.", "She don't cooking."], correctAnswer: 0, explanation: "She → IS. Negativa contraída: ISN'T cooking." },
            ]} />
          </div>
        </section>

        {/* Section 7 – Level 4: Avançado */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">7. Exercícios Nível 4 – Avançado (Q26–32)</h2>
            <PencilIcon onClick={() => openNoteModal('Exercícios Avançados')} />
          </div>
          <div className="p-8">
            <Quiz levelLabel="🔴 NÍVEL 4 – AVANÇADO" questions={[
              { id: 26, question: "Choose the correct sentence.", options: ["She are working at the hospital.", "She is work at the hospital.", "She is working at the hospital.", "She working at the hospital.", "She am working at the hospital."], correctAnswer: 2, explanation: "She → IS + verbo ING → She is working." },
              { id: 27, question: "Which sentence is INCORRECT?", options: ["I am reading a book.", "They are playing outside.", "He is studying for the exam.", "We is watching a movie.", "She is cooking dinner."], correctAnswer: 3, explanation: "We → ARE, não IS. O correto seria 'We are watching a movie'." },
              { id: 28, question: "What is the correct -ING form of TRAVEL (American English)?", options: ["travelling", "traveling", "traveing", "travelling", "travelin"], correctAnswer: 1, explanation: "Em inglês americano, TRAVEL → TRAVELING (sem dobrar o L). Em inglês britânico: travelling." },
              { id: 29, question: "Which sentence expresses an ACTION happening now?", options: ["I am tired.", "She is beautiful.", "They are students.", "He is sleeping in his bedroom.", "We are at home."], correctAnswer: 3, explanation: "'He is sleeping' é ação acontecendo agora (Present Continuous). As outras usam TO BE sozinho (estado/característica/localização)." },
              { id: 30, question: "Complete the mini-dialogue: — Where is Maria? — She _____ in the kitchen. She _____ dinner.", options: ["is / is cooking", "are / are cooking", "am / am cooking", "is / cooks", "are / cook"], correctAnswer: 0, explanation: "She → IS (localização) + IS COOKING (ação acontecendo)." },
              { id: 31, question: "Which sentence is grammatically INCORRECT?", options: ["I am not studying today.", "She isn't working now.", "They aren't playing soccer.", "He not is sleeping.", "We aren't ready."], correctAnswer: 3, explanation: "A ordem correta é: pronome + verbo TO BE + NOT. 'He not is sleeping' está errado; o correto é 'He is not sleeping' ou 'He isn't sleeping'." },
              { id: 32, question: "What is the correct -ING form of the verb SWIM?", options: ["swiming", "swimming", "swimeing", "swimning", "swimin"], correctAnswer: 1, explanation: "SWIM termina em CVC (s-w-i-m): dobra a consoante M → SWIMMING." },
            ]} />
          </div>
        </section>

        {/* Section 8 – Level 5: Desafio */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-800 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">8. Exercícios Nível 5 – Desafio (Q33–40)</h2>
            <PencilIcon onClick={() => openNoteModal('Exercícios Desafio')} />
          </div>
          <div className="p-8">
            <Quiz levelLabel="🟣 NÍVEL 5 – DESAFIO" questions={[
              { id: 33, question: "Combine with a relative pronoun: 'The woman _____ is cooking is my mother.'", options: ["which", "who", "whose", "where", "whom"], correctAnswer: 1, explanation: "WHO refere-se a pessoas. 'The woman WHO is cooking' = a mulher QUE está cozinhando." },
              { id: 34, question: "Complete with IF + verb: 'If she _____ studying, she will pass the exam.'", options: ["are", "is", "am", "be", "do"], correctAnswer: 1, explanation: "She → IS. 'If she is studying, she will pass' = SE ela está estudando, ela vai passar." },
              { id: 35, question: "Which sentence combines TO BE (state) and PRESENT CONTINUOUS (action) correctly?", options: ["She is happy because she is winning the game.", "She happy because winning the game.", "She is happy because she winning the game.", "She are happy because she is winning the game.", "She is happy because is winning the game."], correctAnswer: 0, explanation: "TO BE (is happy = estado) + PRESENT CONTINUOUS (is winning = ação) combinados corretamente." },
              { id: 36, question: "Complete with WHOSE + TO BE: 'The artist _____ paintings are famous _____ living in Brazil now.'", options: ["who / is", "whose / is", "which / are", "whose / are", "who / are"], correctAnswer: 1, explanation: "WHOSE indica posse (as pinturas DELE) + IS (Present Continuous com 'the artist' → is living)." },
              { id: 37, question: "Complete the question: '_____ they _____ (work) right now?'", options: ["Is / working", "Are / working", "Am / working", "Are / work", "Do / working"], correctAnswer: 1, explanation: "They → ARE. Present Continuous interrogativo: ARE + they + verbo ING → Are they working?" },
              { id: 38, question: "Find the error: 'She are working now.'", options: ["'She' should be 'They'.", "'are' should be 'is'.", "'working' should be 'work'.", "'now' should be removed.", "No error."], correctAnswer: 1, explanation: "She → IS, não ARE. O correto é 'She is working now'." },
              { id: 39, question: "Which sentence uses BOTH TO BE and PRESENT CONTINUOUS correctly?", options: ["We is studying because we are having a test tomorrow.", "We are studying because we have a test tomorrow.", "We are studying because we is having a test tomorrow.", "We am studying because we are having a test tomorrow.", "We studying because we are having a test tomorrow."], correctAnswer: 1, explanation: "We → ARE (both verbs). 'We are studying' (ação) + 'we have' (fato geral). A opção B está correta." },
              { id: 40, question: "Complete: 'The students _____ in the classroom. They _____ for the test. The teacher _____ them.'", options: ["is / are studying / is helping", "are / are studying / is helping", "are / is studying / are helping", "am / are studying / is helping", "are / are studying / are helping"], correctAnswer: 1, explanation: "The students (plural) → ARE; studying (ação) → ARE STUDYING; The teacher (singular) → IS HELPING." },
            ]} />
          </div>
        </section>

        {/* Section 9 – Produção / Speaking */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">9. Prática Extra – Speaking & Listening</h2>
            <PencilIcon onClick={() => openNoteModal('Speaking Practice')} />
          </div>
          <div className="p-8 space-y-4">
            <p className="text-gray-700">Clique em cada frase para ouvir a pronúncia e pratique em voz alta:</p>
            {[
              "I am a student.",
              "She is cooking dinner.",
              "They are playing soccer.",
              "He is not sleeping.",
              "We are learning English.",
              "Are you working right now?",
              "The woman who is cooking is my mother.",
              "If she is studying, she will pass the exam.",
            ].map((phrase, i) => (
              <button key={i} onClick={() => speakText(phrase)} className="block w-full text-left bg-blue-50 hover:bg-blue-100 transition p-4 rounded-xl border border-blue-200">
                <span className="text-blue-800 font-semibold">🔊 {phrase}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Navigation */}
        <div className="flex justify-center gap-4 mt-8 pb-12">
          <button onClick={() => router.push("/cursos")} className="px-8 py-3 bg-white text-blue-700 font-bold border-2 border-blue-600 rounded-full shadow hover:bg-blue-50 transition-all">
            Voltar para Cursos
          </button>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold rounded-full shadow-lg hover:opacity-90 transition-all">
            Voltar ao Topo
          </button>
        </div>
      </div>

      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal(prev => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}