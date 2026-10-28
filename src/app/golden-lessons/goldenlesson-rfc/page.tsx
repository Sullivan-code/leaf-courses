"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Tipos
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

// Componente de Modal para Anotações
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
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            Cancelar
          </button>
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full hover:opacity-90 transition-all">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}

// Ícone de Lápis
function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="ml-3 text-blue-200 hover:text-white transition-colors" title="Fazer anotações">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
      </svg>
    </button>
  );
}

// Função de Áudio
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

// Componente de Quiz
function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optIndex: number) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  return (
    <div className="space-y-8">
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

export default function EnglishMegaLesson() {
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
        
        {/* Cabeçalho */}
        <div className="text-center bg-white p-8 rounded-[40px] shadow-lg border border-blue-100">
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">Mega Lesson: English Masterclass</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Gramática, leitura, vocabulário e exercícios interativos baseados nas avaliações ETEHL. 
            Estude no seu ritmo e domine o inglês.
          </p>
        </div>

        {/* 1. Simple Present & Continuous */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">1. Simple Present vs Present Continuous</h2>
            <PencilIcon onClick={() => openNoteModal('Grammar 1')} />
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-blue-800 text-xl mb-3">Simple Present</h3>
                <p className="text-gray-700 mb-2">Hábitos, rotinas e fatos gerais.</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600">
                  <li><span className="font-bold">Estrutura:</span> I/You/We/They + verbo | He/She/It + verbo+s/es</li>
                  <li><span className="font-bold">Exemplo:</span> She <span className="text-blue-600 font-bold">studies</span> every day.</li>
                  <li><span className="font-bold">Negativa:</span> He <span className="text-blue-600 font-bold">doesn't like</span> fake news.</li>
                  <li><span className="font-bold">Palavras-chave:</span> always, usually, often, never, every day.</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-purple-800 text-xl mb-3">Present Continuous</h3>
                <p className="text-gray-700 mb-2">Ações acontecendo agora ou neste período.</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-600">
                  <li><span className="font-bold">Estrutura:</span> Sujeito + am/is/are + verbo-ing</li>
                  <li><span className="font-bold">Exemplo:</span> They <span className="text-purple-600 font-bold">are searching</span> for information now.</li>
                  <li><span className="font-bold">Negativa:</span> She <span className="text-purple-600 font-bold">isn't reading</span> at the moment.</li>
                  <li><span className="font-bold">Palavras-chave:</span> now, right now, at the moment, Look!, Listen!</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Noun Phrases */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">2. Noun Phrases & Head Nouns</h2>
            <PencilIcon onClick={() => openNoteModal('Noun Phrases')} />
          </div>
          <div className="p-8">
            <p className="text-gray-700 mb-4">Em inglês, os adjetivos vêm <strong>antes</strong> dos substantivos. O <em>Head Noun</em> (núcleo) é a palavra principal do grupo.</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition" onClick={() => speakText("Plastic pollution")}>
                <p className="font-bold text-blue-700">Plastic <span className="underline decoration-red-500 decoration-2">pollution</span></p>
                <p className="text-sm text-gray-500">Head noun: <strong>pollution</strong></p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl cursor-pointer hover:bg-gray-100 transition" onClick={() => speakText("A useful digital keyboard")}>
                <p className="font-bold text-blue-700">A useful digital <span className="underline decoration-red-500 decoration-2">keyboard</span></p>
                <p className="text-sm text-gray-500">Head noun: <strong>keyboard</strong></p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Textos e Interpretação */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">3. Reading Comprehension</h2>
            <PencilIcon onClick={() => openNoteModal('Reading')} />
          </div>
          <div className="p-8 space-y-10">
            
            {/* Texto 1 */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text 1: An App Is Helping Indigenous Brazilians Stay Connected</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p>For many Indigenous communities in the Brazilian Amazon, getting online is becoming increasingly important. People are using smartphones not only to communicate with friends and relatives but also to protect and share their own languages.</p>
                <p className="mt-2">Brazil has more mobile phones than people, but internet access is not equally available everywhere. In some <strong>far-flung</strong> villages, connections are still slow or unreliable. Even when people have access to smartphones, another <strong>challenge</strong> remains: most keyboards are designed for Portuguese and do not always include the letters, symbols and accents used in Indigenous languages.</p>
                <p className="mt-2">A new app called Linklado is helping to change this situation. The app <strong>allows</strong> users to create their own keyboards and adapt them to their mother tongues. Indigenous users are adding special letters and symbols, making it easier to write messages in languages that traditional keyboards may not support.</p>
                <p className="mt-2">The app was launched in 2022 by two young developers from the Amazon region. Since then, more people are discovering new ways of communicating digitally without having to leave their languages behind. In some communities, younger users are teaching older relatives how to use the technology, while families are using it to keep in touch with people who live far away.</p>
                <p className="mt-2">The technology is particularly useful in the Amazon, a <strong>sprawling</strong> region where villages can be separated by rivers, forests and long distances. Digital communication does not solve every problem, especially where internet access remains limited, but it is creating new possibilities.</p>
              </div>
              
              <Quiz questions={[
                { id: 1, question: "According to the text, what is one of the main difficulties for Indigenous communities using smartphones?", options: ["The devices cannot access communication apps.", "Many keyboards do not have characters for Indigenous languages.", "Indigenous people show no interest in technology.", "Digital communication is banned in some communities."], correctAnswer: 1, explanation: "O texto diz que 'most keyboards are designed for Portuguese and do not always include the letters... used in Indigenous languages'." },
                { id: 2, question: "What is the main function of the app Linklado?", options: ["To translate Portuguese automatically.", "To teach programming to youth.", "To offer free internet access.", "To allow users to adapt keyboards to their languages."], correctAnswer: 3, explanation: "O app 'allows users to create their own keyboards and adapt them to their mother tongues'." },
                { id: 3, question: "The expression 'far-flung villages' refers to:", options: ["Villages with high population density.", "Villages located in very distant or isolated areas.", "Villages that do not use any technology.", "Economically developed villages."], correctAnswer: 1, explanation: "Far-flung significa distante ou remoto." },
                { id: 4, question: "What role are young Indigenous people playing?", options: ["They are helping older people use new technologies.", "They are abandoning their native languages.", "They are creating digital-only languages.", "They are refusing mobile technology."], correctAnswer: 0, explanation: "O texto cita que 'younger users are teaching older relatives how to use the technology'." },
                { id: 5, question: "What can be inferred from 'Digital communication does not solve every problem'?", options: ["The app has completely failed.", "Smartphones create more problems than benefits.", "Technology helps, but issues like limited internet remain.", "Traditional communication has disappeared."], correctAnswer: 2, explanation: "O texto complementa dizendo 'especially where internet access remains limited, but it is creating new possibilities'." }
              ]} />
            </div>

            {/* Texto 2 */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text 2: Plastic Pollution (Cartoon Analysis)</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p><em>Contexto da Prova:</em> No cartum, animais marinhos aparecem cercados por resíduos plásticos. A legenda diz: "The amount of plastic trash in the sea is hard to swallow." (A quantidade de lixo plástico no mar é difícil de engolir).</p>
                <p className="mt-2"><strong>Análise:</strong> A expressão "hard to swallow" é um trocadilho. Literalmente, significa difícil de engolir (pois os animais podem se engasgar com o lixo). Figurativamente, significa algo inaceitável ou difícil de tolerar. O objetivo é denunciar a poluição.</p>
              </div>
              
              <Quiz questions={[
                { id: 6, question: "In the cartoon, the expression 'hard to swallow' is used to:", options: ["Defend the reuse of plastic objects.", "Present plastic waste as an exclusively aesthetic problem.", "Use humor to denounce the excessive presence of plastic in oceans.", "Show that marine animals can live with plastic."], correctAnswer: 2, explanation: "O trocadilho 'hard to swallow' usa o humor para denunciar a presença excessiva de plástico nos oceanos." },
                { id: 7, question: "What does the word 'deforestation' mean?", options: ["The process of cleaning polluted rivers.", "The cutting down of large areas of trees.", "The production of plastic materials.", "The use of renewable energy."], correctAnswer: 1, explanation: "Deforestation = desmatamento (corte de grandes áreas de árvores)." },
                { id: 8, question: "If you store leftovers, you:", options: ["throw away food you do not want.", "cook a completely new meal.", "give all your food to someone else.", "keep the food that remains to eat later."], correctAnswer: 3, explanation: "Leftovers são sobras de comida. Guardá-las significa mantê-las para comer depois." },
                { id: 9, question: "The word 'reusable' means:", options: ["able to be used more than once.", "made only from plastic.", "difficult to carry.", "designed to be thrown away."], correctAnswer: 0, explanation: "Reusable = reutilizável (pode ser usado mais de uma vez)." },
                { id: 10, question: "A 'far-flung' village is a village that is:", options: ["very crowded.", "highly developed.", "close to a large city.", "very far away or remote."], correctAnswer: 3, explanation: "Far-flung = distante, remoto." }
              ]} />
            </div>

            {/* Texto 3 */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text 3: Fake News & The Metaverse (Cartoon Analysis)</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p><em>Contexto:</em> Pinóquio, personagem conhecido por mentir, lê uma notícia sobre "criminalizar fake news". Ele questiona: "So, those news about criminalizing fake news... were fake?!".</p>
                <p className="mt-2"><strong>Análise:</strong> A ironia está no fato de que a própria notícia que tenta combater as fake news pode ser falsa. Isso mostra a dificuldade de distinguir o que é verdadeiro no ambiente digital.</p>
              </div>

              <Quiz questions={[
                { id: 11, question: "The humor and criticism in the Pinocchio cartoon occur mainly through:", options: ["The defense that all news should be considered fake.", "The association between Pinocchio, known for lying, and the difficulty of distinguishing true from false news.", "The idea that criminalizing fake news eliminates false information.", "The use of children's characters in political discussions."], correctAnswer: 1, explanation: "Pinóquio representa a mentira, reforçando a ironia da notícia sobre fake news ser falsa." },
                { id: 12, question: "What is the main idea of the 'Meta'Verse cartoon?", options: ["Online news is always more reliable when linked to social networks.", "The growth of digital platforms has made traditional media unnecessary.", "The reduction or absence of news on certain digital platforms can create an informational 'desert'.", "The population shows little interest in news."], correctAnswer: 2, explanation: "O cartum mostra um deserto com uma placa de 'Online News', representando a escassez de informação confiável ou o esvaziamento do jornalismo tradicional." }
              ]} />
            </div>

          </div>
        </section>

        {/* 4. Grammar Review Exercises (From Test) */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">4. Grammar & Vocabulary Drills</h2>
            <PencilIcon onClick={() => openNoteModal('Drills')} />
          </div>
          <div className="p-8 space-y-8">
            <Quiz questions={[
              { id: 13, question: "In what situation do we normally use the Simple Present?", options: ["To talk only about past actions.", "To describe an action happening exactly now.", "To talk about future plans.", "To express habits, routines, and general facts."], correctAnswer: 3, explanation: "Simple Present é usado para hábitos e verdades universais." },
              { id: 14, question: "Choose the correct sentence.", options: ["Plastic pollution affect marine ecosystems.", "Plastic pollution affects marine ecosystems.", "Plastic pollution affecting marine ecosystems.", "Plastic pollution does affects marine ecosystems."], correctAnswer: 1, explanation: "Sujeito singular (pollution) exige verbo com -s (affects)." },
              { id: 15, question: "Choose the correct negative sentence in the Simple Present.", options: ["Many plastic products not disappear quickly.", "Many plastic products doesn't disappear quickly.", "Many plastic products aren't disappear quickly.", "Many plastic products don't disappear quickly."], correctAnswer: 3, explanation: "Sujeito plural (products) usa 'don't' + verbo base." },
              { id: 16, question: "Complete: Why ______ many Indigenous communities use digital technology?", options: ["do", "does", "are", "is"], correctAnswer: 0, explanation: "Sujeito plural (communities) usa 'do' na pergunta." },
              { id: 17, question: "Regarding the Present Continuous, which alternative is correct?", options: ["We use only the main verb with -ing.", "We use do/does + verb.", "We use the verb to be (am/is/are) + main verb with -ing.", "We use have/has + main verb."], correctAnswer: 2, explanation: "A fórmula é Sujeito + am/is/are + verbo-ing." },
              { id: 18, question: "Which sentence describes an action happening now?", options: ["She uses her smartphone every day.", "She usually reads online newspapers.", "She is reading an online article now.", "She reads the news before breakfast."], correctAnswer: 2, explanation: "A palavra 'now' indica Present Continuous (is reading)." },
              { id: 19, question: "Choose the correct Present Continuous sentence.", options: ["Indigenous teenagers is using new digital tools.", "Indigenous teenagers are using new digital tools.", "Indigenous teenagers are use new digital tools.", "Indigenous teenagers using new digital tools."], correctAnswer: 1, explanation: "Sujeito plural (teenagers) usa 'are' + verbo-ing (using)." },
              { id: 20, question: "Which sentence contains a correctly formed noun phrase?", options: ["communities Indigenous", "a smartphone modern useful", "technology digital new", "a useful digital keyboard"], correctAnswer: 3, explanation: "Em inglês, a ordem correta é Adjetivos + Substantivo (a useful digital keyboard)." },
              { id: 21, question: "In a noun phrase, what is the function of the head noun?", options: ["It is always a verb indicating an action.", "It is the word that determines the time.", "It is the first adjective of the phrase.", "It is the main noun to which other elements add information."], correctAnswer: 3, explanation: "O head noun é o núcleo, a palavra principal do grupo nominal." }
            ]} />
          </div>
        </section>

        {/* Botões de Navegação */}
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