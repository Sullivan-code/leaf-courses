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

// Modal de Anotações
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

export default function Review1EnglishAssessment() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">Review 1: English Assessment</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Cambridge Style · Level B1+ · Reading Comprehension, Vocabulary and Grammar · 60 Questions + Extra Exercises
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">Reading</span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full">Vocabulary</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">Linking Words</span>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full">Relative Pronouns</span>
            <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full">Grammar Rules</span>
          </div>
        </div>

        {/* PART 1 – Reading Comprehension */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">PART 1 – Reading Comprehension (Questions 1–15)</h2>
            <PencilIcon onClick={() => openNoteModal('Reading Comprehension')} />
          </div>
          <div className="p-8 space-y-10">

            {/* Text I – Gilberto Gil */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text I – Gilberto Gil</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p>Gilberto Gil is a Brazilian singer, songwriter and musician who was born in Salvador, Bahia, in 1942. He became <strong>internationally recognised</strong> for his <strong>contributions</strong> to Brazilian popular music. His musical style combines different influences, including rock, reggae and traditional Brazilian rhythms. Throughout his career, he has received important awards, including a Latin Grammy. His music reflects cultural diversity and artistic innovation.</p>
              </div>
              <Quiz questions={[
                { id: 1, question: "De acordo com o texto, qual característica melhor descreve a produção musical de Gilberto Gil?", options: ["A utilização exclusiva de ritmos tradicionais brasileiros.", "A preferência por estilos musicais europeus.", "A combinação de diferentes influências musicais.", "A rejeição de elementos internacionais.", "A produção de músicas exclusivamente instrumentais."], correctAnswer: 2, explanation: "O texto afirma que 'His musical style combines different influences, including rock, reggae and traditional Brazilian rhythms'." },
                { id: 2, question: "A expressão 'internationally recognised' indica que Gilberto Gil:", options: ["alcançou reconhecimento além das fronteiras brasileiras.", "desenvolveu sua carreira exclusivamente no exterior.", "abandonou a música brasileira.", "recebeu prêmios apenas de instituições europeias.", "passou a cantar somente em inglês."], correctAnswer: 0, explanation: "Internationally recognised = reconhecido internacionalmente, ou seja, além das fronteiras do Brasil." },
                { id: 3, question: "No contexto apresentado, a palavra 'contributions' refere-se:", options: ["aos instrumentos utilizados pelo músico.", "aos países visitados durante sua carreira.", "aos contratos assinados internacionalmente.", "às apresentações realizadas na juventude.", "à importância de seu trabalho para a música brasileira."], correctAnswer: 4, explanation: "Contributions = contribuições, referindo-se à importância do trabalho dele para a música brasileira." },
              ]} />
            </div>

            {/* Text II – Ingrid Silva */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text II – Ingrid Silva</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p>Ingrid Silva is a Brazilian professional ballet dancer who was born in Rio de Janeiro in 1988. She moved to New York when she was nineteen to develop her career. She became a <strong>lead performer</strong> with the Dance Theatre of Harlem. Besides her achievements in ballet, Ingrid has developed a strong <strong>presence</strong> on social media and has appeared on magazine covers. She inspires young dancers through her talent, determination and representation.</p>
              </div>
              <Quiz questions={[
                { id: 4, question: "A trajetória de Ingrid Silva demonstra que:", options: ["o sucesso profissional depende exclusivamente das redes sociais.", "sua carreira combina conquistas artísticas e representatividade.", "ela abandonou o balé para trabalhar como influenciadora.", "seu reconhecimento ocorreu somente no Brasil.", "a dança deixou de ser sua principal atividade profissional."], correctAnswer: 1, explanation: "O texto mostra que ela teve conquistas no balé (lead performer) e também representatividade (inspira jovens dançarinos)." },
                { id: 5, question: "A expressão 'lead performer' significa:", options: ["uma profissional responsável exclusivamente pelo figurino.", "uma estudante que está começando a carreira.", "uma pessoa que administra uma companhia de dança.", "uma artista que ocupa uma posição de destaque nas apresentações.", "uma profissional que trabalha apenas nos bastidores."], correctAnswer: 3, explanation: "Lead performer = artista principal, em posição de destaque nas apresentações." },
              ]} />
            </div>

            {/* Text III – Joseca Yanomami */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text III – Joseca Yanomami</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p>Joseca Yanomami is an Indigenous Brazilian visual artist who lives in the Amazon rainforest. His drawings represent the daily lives, traditions and relationship of the Yanomami people with nature. Through his artwork, he communicates the importance of protecting forests, rivers and Indigenous culture. Joseca believes that environmental protection is a responsibility shared by everyone. He emphasises that future generations depend on the decisions people make today.</p>
              </div>
              <Quiz questions={[
                { id: 6, question: "What is the main purpose of Joseca's artwork?", options: ["To advertise modern technology.", "To encourage people to move to large cities.", "To promote international tourism.", "To replace traditional Indigenous practices.", "To represent Indigenous life and environmental awareness."], correctAnswer: 4, explanation: "O texto diz que seus desenhos representam a vida diária, tradições e a relação do povo Yanomami com a natureza, além de comunicar a importância de proteger florestas." },
                { id: 7, question: "According to the text, who is responsible for protecting the environment?", options: ["Indigenous communities alone.", "Everyone, regardless of their background.", "Only government institutions.", "Professional artists and musicians.", "People who live in the Amazon exclusively."], correctAnswer: 1, explanation: "O texto afirma que 'environmental protection is a responsibility shared by everyone'." },
                { id: 8, question: "What can be inferred from Joseca's message about future generations?", options: ["Environmental problems have already been solved.", "Future generations do not depend on natural resources.", "Artistic activities are more important than conservation.", "Present actions can affect the future of the planet.", "Forest preservation is unnecessary outside Brazil."], correctAnswer: 3, explanation: "Ele enfatiza que 'future generations depend on the decisions people make today' — ou seja, ações presentes afetam o futuro." },
              ]} />
            </div>

            {/* Text IV – Brazilian Artists */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Text IV – Brazilian Artists</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p><strong>Vik Muniz</strong> is a Brazilian visual artist who uses unexpected materials and <strong>everyday objects</strong> in his work. His creations are inspired by popular culture and history. <strong>Adriana Varejão</strong> is an artist whose work explores themes such as colonialism, politics and cultural identity. <strong>Beatriz Milhazes</strong> creates colourful abstract paintings which combine energetic compositions and contrasting elements. <strong>Criola</strong> is a Brazilian artist whose paintings celebrate Black women, cultural heritage and ancestral knowledge.</p>
              </div>
              <Quiz questions={[
                { id: 9, question: "Which artist is especially known for using ordinary objects in unusual ways?", options: ["Vik Muniz.", "Adriana Varejão.", "Beatriz Milhazes.", "Criola.", "Ingrid Silva."], correctAnswer: 0, explanation: "Vik Muniz 'uses unexpected materials and everyday objects in his work'." },
                { id: 10, question: "What is a central theme in Adriana Varejão's work?", options: ["Professional ballet.", "Competitive sports.", "Colonial history and cultural identity.", "Musical composition.", "Environmental technology."], correctAnswer: 2, explanation: "O texto diz que seu trabalho explora 'colonialism, politics and cultural identity'." },
                { id: 11, question: "What distinguishes Beatriz Milhazes's paintings?", options: ["The exclusive use of black and white.", "Their focus on realistic portraits.", "Their representation of professional athletes.", "Their absence of contrasting elements.", "Their colourful and energetic abstract compositions."], correctAnswer: 4, explanation: "Ela cria 'colourful abstract paintings which combine energetic compositions and contrasting elements'." },
                { id: 12, question: "Criola's artwork particularly celebrates:", options: ["European architectural traditions.", "Black women's heritage and cultural identity.", "Modern scientific discoveries.", "International sporting competitions.", "Classical ballet performances."], correctAnswer: 1, explanation: "Criola 'celebrates Black women, cultural heritage and ancestral knowledge'." },
                { id: 13, question: "What do the four visual artists have in common?", options: ["They all work with identical materials.", "They were all born in the same city.", "They exclusively produce realistic portraits.", "Their artistic work communicates ideas about culture or society.", "They have abandoned traditional artistic expression."], correctAnswer: 3, explanation: "Todos os artistas usam sua arte para comunicar ideias sobre cultura, sociedade, história ou identidade." },
                { id: 14, question: "Which statement best expresses the relationship between art and society presented in the texts?", options: ["Art can communicate cultural identities and encourage reflection.", "Art should avoid controversial subjects.", "Artistic production has no connection with history.", "Only internationally recognised artists can influence society.", "Art is valuable only when it produces financial profit."], correctAnswer: 0, explanation: "Os textos mostram que a arte comunica identidades culturais e provoca reflexão sobre temas sociais." },
                { id: 15, question: "What is the most suitable title for the collection of texts?", options: ["The History of International Sports.", "Modern Technology in Brazil.", "Brazilian Artists and Their Cultural Contributions.", "Famous European Musicians.", "Traditional Careers in Science."], correctAnswer: 2, explanation: "Todos os textos tratam de artistas brasileiros e suas contribuições culturais." },
              ]} />
            </div>
          </div>
        </section>

        {/* PART 2 – Vocabulary in Context */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">PART 2 – Vocabulary in Context (Questions 16–25)</h2>
            <PencilIcon onClick={() => openNoteModal('Vocabulary')} />
          </div>
          <div className="p-8">
            <Quiz questions={[
              { id: 16, question: "In the sentence 'Ingrid became a popular presence on social media', the word presence is closest in meaning to:", options: ["absence.", "visibility.", "disappearance.", "competition.", "disagreement."], correctAnswer: 1, explanation: "Presence, nesse contexto, significa visibilidade — ela se tornou uma figura visível e popular nas redes sociais." },
              { id: 17, question: "What does the word heritage mean in the expression 'cultural heritage'?", options: ["A temporary fashion trend.", "A new technological invention.", "An individual financial investment.", "A form of international transportation.", "Traditions and values passed down through generations."], correctAnswer: 4, explanation: "Heritage = herança cultural, tradições e valores transmitidos entre gerações." },
              { id: 18, question: "Choose the word that best completes the sentence. 'Gilberto Gil has received several important ______ for his contributions to music.'", options: ["challenges", "arguments", "instruments", "awards", "journeys"], correctAnswer: 3, explanation: "Awards = prêmios. A frase fala sobre prêmios recebidos por contribuições musicais." },
              { id: 19, question: "The expression rise to stardom means:", options: ["to become famous or successful.", "to travel to another country.", "to change professional careers.", "to lose public recognition.", "to begin formal education."], correctAnswer: 0, explanation: "Rise to stardom = tornar-se famoso ou bem-sucedido (alcançar o estrelato)." },
              { id: 20, question: "Choose the correct meaning of infused in the sentence 'His music is infused with rock and reggae.'", options: ["Completely separated from.", "Replaced by.", "Enriched or combined with.", "Criticised because of.", "Unrelated to."], correctAnswer: 2, explanation: "Infused = enriquecido ou combinado com. A música dele é enriquecida com rock e reggae." },
              { id: 21, question: "Choose the best word to complete the sentence. 'Joseca's drawings ______ the importance of preserving the rainforest.'", options: ["refuse", "emphasise", "prevent", "forget", "remove"], correctAnswer: 1, explanation: "Emphasise = enfatizar. Os desenhos dele enfatizam a importância de preservar a floresta." },
              { id: 22, question: "The expression everyday objects refers to objects that are:", options: ["extremely expensive.", "difficult to manufacture.", "used exclusively by artists.", "found in museums only.", "commonly used in daily life."], correctAnswer: 4, explanation: "Everyday objects = objetos comuns usados no dia a dia." },
              { id: 23, question: "Choose the correct word formation. 'Her achievements have made her an ______ figure for young dancers.'", options: ["inspiration", "inspired", "inspire", "inspiring", "inspires"], correctAnswer: 3, explanation: "Inspiring = inspiradora. É um adjetivo que descreve a figura que inspira os jovens dançarinos." },
              { id: 24, question: "In the sentence 'Criola's paintings challenge social boundaries', the word boundaries is closest in meaning to:", options: ["limitations.", "opportunities.", "celebrations.", "achievements.", "discoveries."], correctAnswer: 0, explanation: "Boundaries = limites, fronteiras. Social boundaries = limites sociais." },
              { id: 25, question: "Which expression best replaces protect in 'We must protect the environment'?", options: ["Take advantage of.", "Get rid of.", "Take care of.", "Look down on.", "Give up on."], correctAnswer: 2, explanation: "Protect = proteger. Take care of = cuidar de. São expressões equivalentes nesse contexto." },
            ]} />
          </div>
        </section>

        {/* PART 3 – Linking Words */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-green-600 to-teal-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">PART 3 – Linking Words (Questions 26–35): AND, SO, IF, THEN</h2>
            <PencilIcon onClick={() => openNoteModal('Linking Words')} />
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800">AND</h4>
                <p className="text-sm text-gray-600">Adiciona informações ou ações.</p>
                <p className="text-sm mt-1 italic">She sings <strong>and</strong> plays guitar.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800">SO</h4>
                <p className="text-sm text-gray-600">Indica consequência ou resultado.</p>
                <p className="text-sm mt-1 italic">He worked hard, <strong>so</strong> he passed.</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <h4 className="font-bold text-yellow-800">IF</h4>
                <p className="text-sm text-gray-600">Introduz uma condição.</p>
                <p className="text-sm mt-1 italic"><strong>If</strong> it rains, we stay home.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800">THEN</h4>
                <p className="text-sm text-gray-600">Indica sequência ou consequência após IF.</p>
                <p className="text-sm mt-1 italic">If you study, <strong>then</strong> you learn.</p>
              </div>
            </div>
            <Quiz questions={[
              { id: 26, question: "Choose the correct linking word. 'Gilberto Gil is a talented singer, ______ he is also an accomplished songwriter.'", options: ["then", "if", "so", "whose", "and"], correctAnswer: 4, explanation: "AND adiciona uma informação: ele é cantor E também compositor." },
              { id: 27, question: "Complete the sentence. '______ people respect nature, the environment benefits.'", options: ["Then", "If", "And", "So", "Which"], correctAnswer: 1, explanation: "IF introduz a condição: SE as pessoas respeitarem a natureza, o meio ambiente se beneficia." },
              { id: 28, question: "Choose the correct alternative. 'Ingrid worked hard to develop her career, ______ she became a successful dancer.'", options: ["if", "then", "and", "so", "whose"], correctAnswer: 3, explanation: "SO indica consequência: ela trabalhou duro, ENTÃO se tornou bem-sucedida." },
              { id: 29, question: "Which sentence correctly uses IF to introduce a condition?", options: ["If the artist has enough time, she creates new drawings.", "The artist if creates new drawings every day.", "If the artist is talented, so she creates drawings.", "The artist creates if new drawings.", "If the artist whose paintings are famous."], correctAnswer: 0, explanation: "A opção A usa IF corretamente no início, seguido de vírgula e da consequência." },
              { id: 30, question: "Complete the sentence. 'Vik Muniz uses everyday objects ______ creates unusual works of art.'", options: ["if", "so", "and", "then", "whose"], correctAnswer: 2, explanation: "AND conecta duas ações: ele USA objetos E CRIA obras." },
              { id: 31, question: "Choose the correct linking word. '______ people destroy forests, animals lose their natural habitats.'", options: ["And", "Then", "So", "Whose", "If"], correctAnswer: 4, explanation: "IF introduz a condição: SE as pessoas destroem as florestas, os animais perdem seu habitat." },
              { id: 32, question: "Choose the sentence that correctly expresses a result using SO.", options: ["The artist so worked hard she became successful.", "The artist worked hard, so she became successful.", "So the artist worked hard if she became successful.", "The artist worked so hard, if she became successful.", "The artist worked hard and so if she became successful."], correctAnswer: 1, explanation: "A estrutura correta é: oração + vírgula + SO + consequência." },
              { id: 33, question: "Complete the sentence. 'First, the artist chooses the materials, and ______ she begins creating her artwork.'", options: ["if", "so", "whose", "then", "who"], correctAnswer: 3, explanation: "THEN indica sequência: primeiro ela escolhe os materiais, ENTÃO começa a criar." },
              { id: 34, question: "Choose the grammatically correct sentence.", options: ["Joseca creates drawings and shares important environmental messages.", "Joseca creates drawings so shares important environmental messages.", "Joseca creates drawings if shares important environmental messages.", "Joseca creates drawings then shares important environmental messages without a subject or appropriate punctuation.", "Joseca creates drawings whose shares important environmental messages."], correctAnswer: 0, explanation: "AND conecta corretamente dois verbos (creates and shares) com o mesmo sujeito." },
              { id: 35, question: "Which sentence correctly expresses a condition?", options: ["The dancer if performs every day.", "The artist creates paintings if and drawings.", "If people value Indigenous culture, they respect its traditions.", "The singer is famous if successful and.", "If the artist whose creates colourful paintings."], correctAnswer: 2, explanation: "IF introduz a condição: SE as pessoas valorizam a cultura indígena, elas respeitam suas tradições." },
            ]} />
          </div>
        </section>

        {/* PART 4 – Relative Pronouns */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">PART 4 – Relative Pronouns (Questions 36–50): WHO, WHICH, THAT, WHOSE</h2>
            <PencilIcon onClick={() => openNoteModal('Relative Pronouns')} />
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <h4 className="font-bold text-orange-800">WHO</h4>
                <p className="text-sm text-gray-600">Refere-se a pessoas.</p>
                <p className="text-sm mt-1 italic">The artist <strong>who</strong> painted this is Brazilian.</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h4 className="font-bold text-blue-800">WHICH</h4>
                <p className="text-sm text-gray-600">Refere-se a coisas/animais.</p>
                <p className="text-sm mt-1 italic">The painting <strong>which</strong> she made is beautiful.</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <h4 className="font-bold text-green-800">THAT</h4>
                <p className="text-sm text-gray-600">Pode substituir WHO ou WHICH em orações restritivas.</p>
                <p className="text-sm mt-1 italic">The book <strong>that</strong> I read was great.</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <h4 className="font-bold text-purple-800">WHOSE</h4>
                <p className="text-sm text-gray-600">Indica posse.</p>
                <p className="text-sm mt-1 italic">The artist <strong>whose</strong> paintings are famous lives here.</p>
              </div>
            </div>
            <Quiz questions={[
              { id: 36, question: "Choose the correct relative pronoun. 'Joseca is an Indigenous artist ______ lives in the Amazon rainforest.'", options: ["which", "who", "whose", "where", "whom"], correctAnswer: 1, explanation: "WHO refere-se a pessoas. Joseca é uma pessoa." },
              { id: 37, question: "Complete the sentence. 'Adriana Varejão is an artist ______ paintings explore Brazilian history.'", options: ["which", "who", "that", "whose", "whom"], correctAnswer: 3, explanation: "WHOSE indica posse: as pinturas DELA (da artista)." },
              { id: 38, question: "Choose the correct alternative. 'The paintings ______ Beatriz Milhazes creates are internationally recognised.'", options: ["whose", "whom", "where", "who", "which"], correctAnswer: 4, explanation: "WHICH refere-se a coisas (paintings)." },
              { id: 39, question: "In which sentence is WHOSE used correctly?", options: ["Ingrid is a dancer whose performances inspire young people.", "Ingrid is a dancer whose performs internationally.", "Ingrid is a dancer whose she works in New York.", "Ingrid is a dancer whose was born in Brazil.", "Ingrid is a dancer whose people admire her."], correctAnswer: 0, explanation: "WHOSE + substantivo (performances) indica posse: as performances DELA inspiram." },
              { id: 40, question: "Choose the correct relative pronoun. 'The museum, ______ opened last year, displays contemporary Brazilian art.'", options: ["who", "whose", "which", "that", "whom"], correctAnswer: 2, explanation: "WHICH refere-se a coisas (museum) em oração explicativa (non-defining)." },
              { id: 41, question: "Which sentence correctly combines the two ideas? 'Vik Muniz is a Brazilian artist. He uses unusual materials.'", options: ["Vik Muniz is a Brazilian artist which uses unusual materials.", "Vik Muniz is a Brazilian artist whose uses unusual materials.", "Vik Muniz is a Brazilian artist whom uses unusual materials.", "Vik Muniz is a Brazilian artist who he uses unusual materials.", "Vik Muniz is a Brazilian artist who uses unusual materials."], correctAnswer: 4, explanation: "WHO substitui 'he' e conecta as duas ideias corretamente." },
              { id: 42, question: "Complete the sentence. 'The artist ______ paintings I admired yesterday has exhibited her work internationally.'", options: ["which", "whose", "that", "who", "whom"], correctAnswer: 1, explanation: "WHOSE indica posse: as pinturas DELA (da artista) que eu admirei." },
              { id: 43, question: "Which sentence contains a defining relative clause?", options: ["Ingrid Silva, who was born in Rio de Janeiro, is a dancer.", "Gilberto Gil, who is Brazilian, is a musician.", "The Amazon, which covers a vast area, is environmentally important.", "The artist who painted this mural lives in Belo Horizonte.", "Joseca, whose drawings depict forest life, is an Indigenous artist."], correctAnswer: 3, explanation: "Oração restritiva (defining) não tem vírgulas e é essencial ao sentido: 'The artist who painted this mural'." },
              { id: 44, question: "In which sentence can the relative pronoun be omitted without changing the basic meaning?", options: ["The painting that we saw yesterday was impressive.", "The artist who created the painting is Brazilian.", "The dancer who performed last night received an award.", "The musician who inspired me is famous.", "The trees that grow in the rainforest are important."], correctAnswer: 0, explanation: "O pronome pode ser omitido quando é objeto do verbo: 'The painting [that] we saw yesterday...' — 'that' é objeto de 'saw'." },
              { id: 45, question: "Choose the correct sentence.", options: ["The singer, that won the award, is Brazilian.", "The singer, which won the award, is Brazilian.", "The singer, who won the award, is Brazilian.", "The singer, whose won the award, is Brazilian.", "The singer, who he won the award, is Brazilian."], correctAnswer: 2, explanation: "WHO refere-se a pessoas em oração explicativa (com vírgulas). THAT não é usado após vírgula." },
              { id: 46, question: "Choose the correct alternative. 'The Amazon is a region ______ importance to biodiversity is internationally recognised.'", options: ["who", "which", "that", "whom", "whose"], correctAnswer: 4, explanation: "WHOSE indica posse: a importância DELA (da região) para a biodiversidade." },
              { id: 47, question: "Which relative pronoun expresses possession?", options: ["Who.", "Whose.", "Which.", "That.", "None of these."], correctAnswer: 1, explanation: "WHOSE é o pronome relativo que expressa posse." },
              { id: 48, question: "Choose the correct sentence.", options: ["The paintings who represent nature are beautiful.", "The artist which lives in Brazil is talented.", "The dancer whose performs internationally is famous.", "The paintings that represent nature are beautiful.", "The artist whose created the mural is Brazilian."], correctAnswer: 3, explanation: "THAT pode referir-se a coisas (paintings) em oração restritiva." },
              { id: 49, question: "What is the grammatical function of WHO in the sentence 'The woman who created the mural is Brazilian'?", options: ["It introduces a relative clause and functions as its subject.", "It expresses possession.", "It introduces a conditional clause.", "It replaces an adverb of time.", "It functions as the direct object of the main verb."], correctAnswer: 0, explanation: "WHO introduz a oração relativa e é o sujeito do verbo 'created'." },
              { id: 50, question: "Which statement about relative pronouns is correct?", options: ["WHOSE can only refer to objects.", "WHICH must always refer to people.", "WHO and WHICH are always interchangeable.", "THAT is normally used after a comma in non-defining relative clauses.", "WHO generally refers to people, while WHICH generally refers to things."], correctAnswer: 4, explanation: "WHO = pessoas; WHICH = coisas/animais. Essa é a regra geral." },
            ]} />
          </div>
        </section>

        {/* PART 5 – Grammar Rules (Portuguese) */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">PART 5 – Grammar Rules (Questions 51–60)</h2>
            <PencilIcon onClick={() => openNoteModal('Grammar Rules')} />
          </div>
          <div className="p-8">
            <Quiz questions={[
              { id: 51, question: "Em relação aos pronomes relativos WHO e WHICH, assinale a alternativa correta.", options: ["WHO é utilizado exclusivamente para objetos, enquanto WHICH se refere a pessoas.", "Ambos são utilizados apenas para indicar posse.", "WHO geralmente se refere a pessoas, enquanto WHICH geralmente se refere a animais e coisas.", "WHICH é utilizado exclusivamente em frases interrogativas.", "WHO e WHICH são conectores de consequência."], correctAnswer: 2, explanation: "WHO = pessoas; WHICH = animais e coisas." },
              { id: 52, question: "Na frase 'The artist whose paintings are famous lives in Brazil', o pronome WHOSE tem a função de:", options: ["indicar uma consequência.", "estabelecer uma condição.", "acrescentar uma informação independente.", "estabelecer uma relação de posse entre o artista e suas pinturas.", "indicar uma sequência temporal."], correctAnswer: 3, explanation: "WHOSE estabelece posse: as pinturas pertencem ao artista." },
              { id: 53, question: "Sobre o uso do pronome relativo THAT, assinale a alternativa correta.", options: ["THAT é utilizado exclusivamente para indicar posse.", "THAT pode substituir WHO ou WHICH em determinadas orações relativas restritivas.", "THAT é utilizado apenas para indicar uma consequência.", "THAT é obrigatório em todas as orações relativas.", "THAT é empregado exclusivamente em perguntas."], correctAnswer: 1, explanation: "THAT pode substituir WHO ou WHICH em orações restritivas (defining)." },
              { id: 54, question: "Na frase 'Joseca creates drawings and shares important messages', a palavra AND estabelece uma relação de:", options: ["adição de informações ou ações.", "consequência obrigatória.", "condição hipotética.", "posse.", "contraste."], correctAnswer: 0, explanation: "AND adiciona ações: ele cria desenhos E compartilha mensagens." },
              { id: 55, question: "Na frase 'The artist was talented, so she became successful', o conector SO indica:", options: ["uma condição necessária.", "uma sequência sem relação lógica.", "uma relação de posse.", "uma característica da artista.", "uma consequência ou resultado."], correctAnswer: 4, explanation: "SO indica consequência: ela era talentosa, ENTÃO se tornou bem-sucedida." },
              { id: 56, question: "Em relação ao uso de IF, assinale a alternativa correta.", options: ["É utilizado exclusivamente para acrescentar informações.", "Indica obrigatoriamente uma ação concluída no passado.", "Introduz uma condição da qual uma situação pode depender.", "Substitui os pronomes relativos WHO e WHICH.", "É empregado exclusivamente para indicar posse."], correctAnswer: 2, explanation: "IF introduz uma condição: SE algo acontecer, outra coisa depende disso." },
              { id: 57, question: "Na frase 'If we protect the forest, then animals have a safer environment', a função dos conectores IF e THEN é, respectivamente:", options: ["consequência e adição.", "posse e condição.", "sequência e contraste.", "condição e consequência.", "adição e posse."], correctAnswer: 3, explanation: "IF = condição (SE protegermos); THEN = consequência (ENTÃO os animais terão)." },
              { id: 58, question: "Sobre o uso do conector IF, assinale a alternativa correta.", options: ["IF é utilizado exclusivamente para indicar uma sequência de acontecimentos.", "IF introduz uma condição e pode ser utilizado em frases que expressam situações gerais.", "IF deve ser sempre acompanhado do conector SO.", "IF é um pronome relativo utilizado para substituir pessoas.", "IF indica obrigatoriamente uma consequência, nunca uma condição."], correctAnswer: 1, explanation: "IF introduz condição e pode ser usado em situações gerais (zero conditional)." },
              { id: 59, question: "Observe a frase 'The artist who created the mural is Brazilian'. Qual é a função do pronome WHO?", options: ["Retomar o substantivo 'artist' e introduzir uma informação que identifica esse artista.", "Indicar posse entre o artista e o mural.", "Introduzir uma consequência da criação do mural.", "Substituir o verbo 'created'.", "Estabelecer uma condição para a nacionalidade do artista."], correctAnswer: 0, explanation: "WHO retoma 'artist' e introduz a oração relativa que identifica qual artista." },
              { id: 60, question: "Sobre as regras de utilização dos pronomes relativos e dos conectores estudados, assinale a alternativa correta.", options: ["WHOSE indica condição, enquanto IF expressa posse.", "WHICH é utilizado exclusivamente para pessoas, enquanto AND indica consequência.", "SO é utilizado para expressar posse, enquanto WHO introduz uma condição.", "THAT não pode ser utilizado para retomar pessoas em nenhuma circunstância.", "WHOSE expressa posse, IF introduz condição e SO indica consequência."], correctAnswer: 4, explanation: "WHOSE = posse; IF = condição; SO = consequência. Essa é a combinação correta." },
            ]} />
          </div>
        </section>

        {/* EXTRA EXERCISES */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">EXTRA EXERCISES – Mixed Practice</h2>
            <PencilIcon onClick={() => openNoteModal('Extra Exercises')} />
          </div>
          <div className="p-8 space-y-10">

            {/* Extra 1 – Vocabulary Matching */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Extra 1 – Vocabulary Expansion</h3>
              <p className="text-gray-600 mb-4">Practice the vocabulary from the review with new contexts.</p>
              <Quiz questions={[
                { id: 61, question: "Choose the word that best completes: 'The ______ of the rainforest is essential for maintaining biodiversity.'", options: ["destruction", "preservation", "construction", "pollution", "abandonment"], correctAnswer: 1, explanation: "Preservation = preservação. A preservação da floresta é essencial." },
                { id: 62, question: "What does the word 'achievement' mean?", options: ["A failure or defeat.", "Something accomplished successfully.", "A type of musical instrument.", "A form of transportation.", "A temporary feeling."], correctAnswer: 1, explanation: "Achievement = conquista, algo realizado com sucesso." },
                { id: 63, question: "Choose the correct word: 'The artist's work ______ cultural identity and history.'", options: ["ignores", "reflects", "destroys", "forgets", "removes"], correctAnswer: 1, explanation: "Reflects = reflete. O trabalho do artista reflete identidade cultural e história." },
                { id: 64, question: "The word 'determination' is closest in meaning to:", options: ["laziness.", "fear.", "persistence and willpower.", "confusion.", "indifference."], correctAnswer: 2, explanation: "Determination = determinação, persistência e força de vontade." },
                { id: 65, question: "In the phrase 'cultural diversity', the word diversity means:", options: ["uniformity.", "variety and difference.", "simplicity.", "isolation.", "silence."], correctAnswer: 1, explanation: "Diversity = diversidade, variedade e diferença." },
              ]} />
            </div>

            {/* Extra 2 – Grammar Mixed */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Extra 2 – Grammar Mixed Practice</h3>
              <p className="text-gray-600 mb-4">Combine all grammar topics from this review.</p>
              <Quiz questions={[
                { id: 66, question: "Choose the correct sentence combining AND + relative pronoun: 'Gilberto Gil is a musician. He combines different styles.'", options: ["Gilberto Gil is a musician and he combines different styles.", "Gilberto Gil is a musician who combines different styles.", "Gilberto Gil is a musician whose combines different styles.", "Gilberto Gil is a musician which combines different styles.", "Gilberto Gil is a musician so combines different styles."], correctAnswer: 1, explanation: "WHO substitui 'he' e conecta as ideias: músico QUE combina diferentes estilos." },
                { id: 67, question: "Complete with the correct connector: '______ you visit the exhibition, you will see amazing artworks.'", options: ["So", "And", "If", "Whose", "Which"], correctAnswer: 2, explanation: "IF introduz a condição: SE você visitar a exposição, verá obras incríveis." },
                { id: 68, question: "Choose the correct relative pronoun: 'The dancer ______ performance amazed everyone is from Brazil.'", options: ["who", "which", "whose", "that", "whom"], correctAnswer: 2, explanation: "WHOSE indica posse: a performance DELA (da dançarina)." },
                { id: 69, question: "Which sentence correctly uses SO to express a result?", options: ["She practised every day, so she improved quickly.", "She practised every day if she improved quickly.", "She practised so every day and she improved.", "So she practised every day she improved quickly.", "She practised every day whose she improved quickly."], correctAnswer: 0, explanation: "SO após vírgula indica resultado: ela praticou todos os dias, ENTÃO melhorou rapidamente." },
                { id: 70, question: "Complete: 'Joseca Yanomami is an artist ______ drawings represent Indigenous life.'", options: ["who", "which", "whose", "that", "whom"], correctAnswer: 2, explanation: "WHOSE indica posse: os desenhos DELA (do artista)." },
              ]} />
            </div>

            {/* Extra 3 – Reading + Grammar Integration */}
            <div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 border-b pb-2">Extra 3 – Integrated Reading & Grammar</h3>
              <div className="bg-blue-50 p-5 rounded-xl text-gray-700 text-sm leading-relaxed mb-4">
                <p><strong>Text V – Brazilian Street Art</strong></p>
                <p className="mt-2">Street art is an artistic expression <strong>that</strong> has transformed urban spaces in Brazil. Artists <strong>who</strong> create murals often use public walls as their canvas. <strong>If</strong> cities invest in cultural projects, <strong>then</strong> communities benefit from more colourful and meaningful environments. Many street artists <strong>whose</strong> work addresses social issues have gained international recognition. They use art <strong>and</strong> creativity to communicate important messages, <strong>so</strong> their impact goes beyond aesthetics.</p>
              </div>
              <Quiz questions={[
                { id: 71, question: "In the text, 'that has transformed urban spaces' is a:", options: ["conditional clause.", "relative clause referring to 'an artistic expression'.", "main clause.", "adverb clause of time.", "noun phrase."], correctAnswer: 1, explanation: "THAT introduz uma oração relativa que descreve 'an artistic expression'." },
                { id: 72, question: "According to the text, what happens IF cities invest in cultural projects?", options: ["Artists stop working.", "Communities benefit from more colourful environments.", "Street art disappears.", "Museums close down.", "Nothing changes."], correctAnswer: 1, explanation: "O texto diz: 'If cities invest... then communities benefit from more colourful and meaningful environments'." },
                { id: 73, question: "The word 'whose' in 'Many street artists whose work addresses social issues' indicates:", options: ["condition.", "consequence.", "possession.", "addition.", "contrast."], correctAnswer: 2, explanation: "WHOSE indica posse: o trabalho DELES (dos artistas)." },
                { id: 74, question: "What is the function of SO in 'their impact goes beyond aesthetics'?", options: ["It introduces a condition.", "It indicates a consequence/result.", "It adds extra information.", "It indicates possession.", "It expresses contrast."], correctAnswer: 1, explanation: "SO indica consequência: eles usam arte E criatividade, ENTÃO o impacto vai além da estética." },
                { id: 75, question: "Which sentence best summarizes the main idea of the text?", options: ["Street art is only about aesthetics.", "Brazilian street art communicates social messages and benefits communities.", "Street artists should not be recognised internationally.", "Urban spaces should not be transformed.", "Cultural projects are unnecessary."], correctAnswer: 1, explanation: "O texto mostra que a arte de rua comunica mensagens sociais e beneficia comunidades." },
              ]} />
            </div>

          </div>
        </section>

        {/* Navigation Buttons */}
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