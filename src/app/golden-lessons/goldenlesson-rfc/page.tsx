"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ================= TIPOS =================

type Option = {
  en: string;
  pt: string;
};

type QuizQuestion = {
  id: number;
  question: string;
  questionPt: string;
  options: Option[];
  correctAnswer: number;
  explanation: string;
};

type TextLine = {
  en: string;
  pt: string;
};

interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

// ================= COMPONENTES AUXILIARES =================

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

// Modal de Anotações
function NoteModal({ isOpen, onClose, sectionTitle, initialNote, onSave }: {
  isOpen: boolean; onClose: () => void; sectionTitle: string; initialNote: string; onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Anotações - {sectionTitle}</h3>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Escreva suas dúvidas, traduções e dicas aqui..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancelar</button>
          <button onClick={() => { onSave(note); onClose(); }} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full hover:opacity-90">Salvar</button>
        </div>
      </div>
    </div>
  );
}

// Componente de Texto Interativo (Tradução Linha por Linha)
function InteractiveText({ lines, title }: { lines: TextLine[], title: string }) {
  const [showAll, setShowAll] = useState(false);
  const [visibleLines, setVisibleLines] = useState<Record<number, boolean>>({});

  const toggleLine = (index: number) => {
    setVisibleLines(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h3 className="text-xl font-bold text-blue-900">{title}</h3>
        <button 
          onClick={() => setShowAll(!showAll)} 
          className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors font-semibold"
        >
          {showAll ? "Ocultar Traduções" : "Mostrar Todas as Traduções"}
        </button>
      </div>
      <div className="space-y-4 text-lg text-gray-800 leading-relaxed">
        {lines.map((line, idx) => (
          <div key={idx} className="group cursor-pointer" onClick={() => toggleLine(idx)}>
            <p className="group-hover:bg-blue-50 p-1 rounded transition-colors flex items-start">
              <span className="mr-2 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
              {line.en}
            </p>
            {(showAll || visibleLines[idx]) && (
              <p className="text-sm text-blue-600 pl-6 italic animate-fadeIn mt-1 mb-2">
                {line.pt}
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Clique em qualquer frase para ver a tradução individual</p>
    </div>
  );
}

// Componente de Quiz com Tradução Individual
function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [translatedQ, setTranslatedQ] = useState<Record<number, boolean>>({});
  const [translatedOpts, setTranslatedOpts] = useState<Record<string, boolean>>({});

  const toggleQTrans = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslatedQ(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleOptTrans = (qId: number, optIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTranslatedOpts(prev => ({ ...prev, [`${qId}-${optIndex}`]: !prev[`${qId}-${optIndex}`] }));
  };

  return (
    <div className="space-y-8">
      {questions.map((q, index) => (
        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          
          {/* Pergunta */}
          <div className="mb-4">
            <div className="flex justify-between items-start">
              <p className="font-semibold text-gray-800 text-lg">{index + 1}. {q.question}</p>
              <button onClick={(e) => toggleQTrans(q.id, e)} className="text-blue-500 hover:text-blue-700 text-sm ml-4 flex-shrink-0" title="Traduzir Enunciado">
                🌐
              </button>
            </div>
            {translatedQ[q.id] && <p className="text-sm text-blue-600 mt-1 italic animate-fadeIn">{q.questionPt}</p>}
          </div>

          {/* Opções */}
          <div className="space-y-3">
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswers[q.id] === i;
              const isCorrect = i === q.correctAnswer;
              let btnClass = "w-full text-left p-3 rounded-xl border-2 transition-all flex justify-between items-center group ";
              
              if (showResults) {
                if (isCorrect) btnClass += "border-green-500 bg-green-50";
                else if (isSelected && !isCorrect) btnClass += "border-red-500 bg-red-50";
                else btnClass += "border-gray-200 opacity-70";
              } else {
                btnClass += isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300";
              }

              return (
                <div key={i} className="relative">
                  <button onClick={() => { if(!showResults) setSelectedAnswers(prev => ({...prev, [q.id]: i})) }} className={btnClass}>
                    <span><span className="font-bold mr-2">{String.fromCharCode(65 + i)})</span>{opt.en}</span>
                  </button>
                  <button 
                    onClick={(e) => toggleOptTrans(q.id, i, e)} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 z-10"
                    title="Traduzir Alternativa"
                  >
                    🌐
                  </button>
                  {translatedOpts[`${q.id}-${i}`] && (
                    <div className="text-sm text-blue-600 mt-1 ml-6 italic animate-fadeIn bg-blue-50/50 p-1 rounded">
                      {opt.pt}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explicação */}
          {showResults && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-sm border border-yellow-200">
              <span className="font-bold text-yellow-800">Explicação: </span>
              <span className="text-gray-700">{q.explanation}</span>
            </div>
          )}
        </div>
      ))}
      
      <div className="text-center pt-4">
        <button
          onClick={() => setShowResults(true)}
          disabled={showResults}
          className="px-8 py-3 bg-blue-600 text-white font-bold rounded-full shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {showResults ? "Resultados Exibidos" : "Verificar Respostas"}
        </button>
        {showResults && (
          <button onClick={() => { setShowResults(false); setSelectedAnswers({}); }} className="ml-4 px-6 py-3 text-blue-600 font-bold hover:underline">
            Refazer Exercício
          </button>
        )}
      </div>
    </div>
  );
}

// ================= COMPONENTE PRINCIPAL =================

export default function EnglishMegaLesson() {
  const router = useRouter();
  const [noteModal, setNoteModal] = useState<NoteModalState>({ isOpen: false, sectionTitle: '', noteContent: '' });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});

  const openNoteModal = (title: string) => setNoteModal({ isOpen: true, sectionTitle: title, noteContent: savedNotes[title] || '' });
  const saveNote = (note: string) => setSavedNotes(prev => ({ ...prev, [noteModal.sectionTitle]: note }));

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12 px-4 md:px-8 font-sans text-gray-800">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Cabeçalho */}
        <div className="text-center bg-white p-10 rounded-[40px] shadow-lg border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4 tracking-tight">English Masterclass</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Aprenda no seu ritmo com traduções interativas, textos curtos e exercícios detalhados. Clique nos ícones 🌐 para traduzir os enunciados e alternativas.
          </p>
        </div>

        {/* 1. Textos Curtos para Interpretação */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">1. Short Texts for Interpretation</h2>
            <PencilIcon onClick={() => openNoteModal('Short Texts')} />
          </div>
          <div className="p-8 space-y-10">
            
            {/* Texto A */}
            <div>
              <InteractiveText 
                title="Text A: Technology and Studies"
                lines={[
                  { en: "Many students use digital tools to learn.", pt: "Muitos estudantes usam ferramentas digitais para aprender." },
                  { en: "Today, Ana is searching for information about plastic pollution.", pt: "Hoje, Ana está procurando informações sobre poluição plástica." },
                  { en: "She checks the source before sharing a story because online information is not always reliable.", pt: "Ela verifica a fonte antes de compartilhar uma história porque informações on-line nem sempre são confiáveis." }
                ]}
              />
              <Quiz questions={[
                {
                  id: 1, 
                  question: "What do many students use to learn?", 
                  questionPt: "O que muitos estudantes usam para aprender?",
                  options: [
                    { en: "Books", pt: "Livros" },
                    { en: "Digital tools", pt: "Ferramentas digitais" },
                    { en: "Televisions", pt: "Televisões" },
                    { en: "Newspapers", pt: "Jornais" }
                  ], 
                  correctAnswer: 1, 
                  explanation: "O texto diz explicitamente: 'Many students use digital tools to learn'." 
                },
                {
                  id: 2, 
                  question: "Why does Ana check the source?", 
                  questionPt: "Por que Ana verifica a fonte?",
                  options: [
                    { en: "Because she likes the writer.", pt: "Porque ela gosta do escritor." },
                    { en: "Because online information is not always reliable.", pt: "Porque a informação online nem sempre é confiável." },
                    { en: "Because her teacher asked her to.", pt: "Porque a professora pediu." },
                    { en: "Because she wants to share it quickly.", pt: "Porque ela quer compartilhar rápido." }
                  ], 
                  correctAnswer: 1, 
                  explanation: "A frase final explica: 'because online information is not always reliable'." 
                }
              ]} />
            </div>

            {/* Texto B */}
            <div>
              <InteractiveText 
                title="Text B: Daily Routine"
                lines={[
                  { en: "Lucas usually walks to school every day.", pt: "Lucas geralmente caminha para a escola todos os dias." },
                  { en: "However, right now, he is taking the bus because it is raining.", pt: "No entanto, neste exato momento, ele está pegando o ônibus porque está chovendo." },
                  { en: "He always carries a reusable bottle to avoid plastic waste.", pt: "Ele sempre carrega uma garrafa reutilizável para evitar lixo plástico." }
                ]}
              />
              <Quiz questions={[
                {
                  id: 3, 
                  question: "How does Lucas usually go to school?", 
                  questionPt: "Como Lucas geralmente vai para a escola?",
                  options: [
                    { en: "By bus", pt: "De ônibus" },
                    { en: "By car", pt: "De carro" },
                    { en: "Walking", pt: "Caminhando" },
                    { en: "By bike", pt: "De bicicleta" }
                  ], 
                  correctAnswer: 2, 
                  explanation: "A palavra 'usually' (geralmente) indica o Simple Present, mostrando o hábito dele: 'walks to school'." 
                },
                {
                  id: 4, 
                  question: "What is Lucas doing right now?", 
                  questionPt: "O que Lucas está fazendo agora?",
                  options: [
                    { en: "Walking to school", pt: "Caminhando para a escola" },
                    { en: "Taking the bus", pt: "Pegando o ônibus" },
                    { en: "Drinking water", pt: "Bebendo água" },
                    { en: "Buying a bottle", pt: "Comprando uma garrafa" }
                  ], 
                  correctAnswer: 1, 
                  explanation: "A expressão 'right now' (agora) exige o Present Continuous: 'he is taking the bus'." 
                }
              ]} />
            </div>
          </div>
        </section>

        {/* 2. Gramática e Textos Maiores */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">2. Reading Comprehension (Longer Texts)</h2>
            <PencilIcon onClick={() => openNoteModal('Reading')} />
          </div>
          <div className="p-8 space-y-10">
            
            <InteractiveText 
              title="Text C: An App Is Helping Indigenous Brazilians"
              lines={[
                { en: "For many Indigenous communities in the Brazilian Amazon, getting online is becoming increasingly important.", pt: "Para muitas comunidades indígenas na Amazônia brasileira, ficar on-line está se tornando cada vez mais importante." },
                { en: "People are using smartphones not only to communicate with friends and relatives but also to protect and share their own languages.", pt: "As pessoas estão usando smartphones não apenas para se comunicar com amigos e parentes, mas também para proteger e compartilhar suas próprias línguas." },
                { en: "In some far-flung villages, connections are still slow or unreliable.", pt: "Em algumas aldeias remotas, as conexões ainda são lentas ou não confiáveis." },
                { en: "Another challenge remains: most keyboards are designed for Portuguese and do not always include the letters used in Indigenous languages.", pt: "Outro desafio permanece: a maioria dos teclados é projetada para o português e nem sempre inclui as letras usadas nas línguas indígenas." },
                { en: "A new app called Linklado allows users to create their own keyboards and adapt them to their mother tongues.", pt: "Um novo aplicativo chamado Linklado permite que os usuários criem seus próprios teclados e os adaptem às suas línguas maternas." },
                { en: "In some communities, younger users are teaching older relatives how to use the technology.", pt: "Em algumas comunidades, usuários mais jovens estão ensinando parentes mais velhos a usar a tecnologia." },
                { en: "The technology is particularly useful in the Amazon, a sprawling region where villages can be separated by long distances.", pt: "A tecnologia é particularmente útil na Amazônia, uma região vasta onde as aldeias podem ser separadas por longas distâncias." }
              ]}
            />

            <Quiz questions={[
              {
                id: 5, 
                question: "According to the text, what is one of the main difficulties for Indigenous communities using smartphones?", 
                questionPt: "De acordo com o texto, qual é uma das principais dificuldades para as comunidades indígenas que usam smartphones?",
                options: [
                  { en: "The devices cannot access communication apps.", pt: "Os dispositivos não podem acessar aplicativos de comunicação." },
                  { en: "Many keyboards do not have characters for Indigenous languages.", pt: "Muitos teclados não têm caracteres para línguas indígenas." },
                  { en: "Indigenous people show no interest in technology.", pt: "Os indígenas não demonstram interesse por tecnologia." },
                  { en: "Digital communication is banned in some communities.", pt: "A comunicação digital é proibida em algumas comunidades." }
                ], 
                correctAnswer: 1, 
                explanation: "O texto afirma que 'most keyboards are designed for Portuguese and do not always include the letters... used in Indigenous languages'." 
              },
              {
                id: 6, 
                question: "The expression 'far-flung villages' refers to:", 
                questionPt: "A expressão 'far-flung villages' (aldeias distantes) refere-se a:",
                options: [
                  { en: "Villages with high population density.", pt: "Aldeias com alta densidade populacional." },
                  { en: "Villages located in very distant or isolated areas.", pt: "Aldeias localizadas em áreas muito distantes ou isoladas." },
                  { en: "Villages that do not use any technology.", pt: "Aldeias que não usam nenhuma tecnologia." },
                  { en: "Economically developed villages.", pt: "Aldeias economicamente desenvolvidas." }
                ], 
                correctAnswer: 1, 
                explanation: "Far-flung significa distante, remoto ou isolado." 
              },
              {
                id: 7, 
                question: "What role are young Indigenous people playing?", 
                questionPt: "Qual papel os jovens indígenas estão desempenhando?",
                options: [
                  { en: "They are helping older people use new technologies.", pt: "Eles estão ajudando pessoas mais velhas a usar novas tecnologias." },
                  { en: "They are abandoning their native languages.", pt: "Eles estão abandonando suas línguas nativas." },
                  { en: "They are creating digital-only languages.", pt: "Eles estão criando línguas exclusivamente digitais." },
                  { en: "They are refusing mobile technology.", pt: "Eles estão recusando a tecnologia móvel." }
                ], 
                correctAnswer: 0, 
                explanation: "O texto cita que 'younger users are teaching older relatives how to use the technology'." 
              }
            ]} />
          </div>
        </section>

        {/* 3. Grammar Drills */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">3. Grammar & Vocabulary Drills</h2>
            <PencilIcon onClick={() => openNoteModal('Grammar Drills')} />
          </div>
          <div className="p-8 space-y-8">
            <Quiz questions={[
              {
                id: 8, 
                question: "In what situation do we normally use the Simple Present?", 
                questionPt: "Em qual situação normalmente usamos o Simple Present (Presente Simples)?",
                options: [
                  { en: "To talk only about past actions.", pt: "Para falar apenas sobre ações passadas." },
                  { en: "To describe an action happening exactly now.", pt: "Para descrever uma ação acontecendo exatamente agora." },
                  { en: "To talk about future plans.", pt: "Para falar sobre planos futuros." },
                  { en: "To express habits, routines, and general facts.", pt: "Para expressar hábitos, rotinas e fatos gerais." }
                ], 
                correctAnswer: 3, 
                explanation: "O Simple Present é usado para hábitos, rotinas e verdades universais." 
              },
              {
                id: 9, 
                question: "Choose the correct sentence.", 
                questionPt: "Escolha a frase correta.",
                options: [
                  { en: "Plastic pollution affect marine ecosystems.", pt: "A poluição plástica afetam os ecossistemas marinhos." },
                  { en: "Plastic pollution affects marine ecosystems.", pt: "A poluição plástica afeta os ecossistemas marinhos." },
                  { en: "Plastic pollution affecting marine ecosystems.", pt: "A poluição plástica afetando os ecossistemas marinhos." },
                  { en: "Plastic pollution does affects marine ecosystems.", pt: "A poluição plástica faz afeta os ecossistemas marinhos." }
                ], 
                correctAnswer: 1, 
                explanation: "Sujeito singular (pollution) exige verbo com -s (affects)." 
              },
              {
                id: 10, 
                question: "Choose the correct negative sentence in the Simple Present.", 
                questionPt: "Escolha a frase negativa correta no Simple Present.",
                options: [
                  { en: "Many plastic products not disappear quickly.", pt: "Muitos produtos plásticos não desaparecem rapidamente." },
                  { en: "Many plastic products doesn't disappear quickly.", pt: "Muitos produtos plásticos não desaparece rapidamente." },
                  { en: "Many plastic products aren't disappear quickly.", pt: "Muitos produtos plásticos não estão desaparecer rapidamente." },
                  { en: "Many plastic products don't disappear quickly.", pt: "Muitos produtos plásticos não desaparecem rapidamente." }
                ], 
                correctAnswer: 3, 
                explanation: "Sujeito plural (products) usa 'don't' + verbo base (disappear)." 
              },
              {
                id: 11, 
                question: "Regarding the Present Continuous, which alternative is correct?", 
                questionPt: "Em relação ao Present Continuous (Presente Contínuo), qual alternativa é correta?",
                options: [
                  { en: "We use only the main verb with -ing.", pt: "Usamos apenas o verbo principal com -ing." },
                  { en: "We use do/does + verb.", pt: "Usamos do/does + verbo." },
                  { en: "We use the verb to be (am/is/are) + main verb with -ing.", pt: "Usamos o verbo to be (am/is/are) + verbo principal com -ing." },
                  { en: "We use have/has + main verb.", pt: "Usamos have/has + verbo principal." }
                ], 
                correctAnswer: 2, 
                explanation: "A fórmula do Present Continuous é Sujeito + am/is/are + verbo-ing." 
              },
              {
                id: 12, 
                question: "Which sentence contains a correctly formed noun phrase?", 
                questionPt: "Qual frase contém um grupo nominal (noun phrase) formado corretamente?",
                options: [
                  { en: "communities Indigenous", pt: "comunidades Indígenas" },
                  { en: "a smartphone modern useful", pt: "um smartphone moderno útil" },
                  { en: "technology digital new", pt: "tecnologia digital nova" },
                  { en: "a useful digital keyboard", pt: "um teclado digital útil" }
                ], 
                correctAnswer: 3, 
                explanation: "Em inglês, a ordem correta dos adjetivos é antes do substantivo (Adjetivo + Adjetivo + Substantivo)." 
              },
              {
                id: 13, 
                question: "If you store leftovers, you:", 
                questionPt: "Se você guardar sobras de comida (leftovers), você:",
                options: [
                  { en: "throw away food you do not want.", pt: "joga fora a comida que não quer." },
                  { en: "cook a completely new meal.", pt: "cozinha uma refeição completamente nova." },
                  { en: "give all your food to someone else.", pt: "dá toda a sua comida para outra pessoa." },
                  { en: "keep the food that remains to eat later.", pt: "mantém a comida que sobrou para comer depois." }
                ], 
                correctAnswer: 3, 
                explanation: "Leftovers são sobras. Guardá-las significa mantê-las para comer depois." 
              }
            ]} />
          </div>
        </section>

        {/* 4. Vocabulary with Audio */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">4. Vocabulary & Pronunciation</h2>
            <PencilIcon onClick={() => openNoteModal('Vocabulary')} />
          </div>
          <div className="p-8">
            <p className="text-gray-600 mb-6 italic">Clique nas palavras para ouvir a pronúncia correta.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { word: "deforestation", pt: "desmatamento" },
                { word: "reusable", pt: "reutilizável" },
                { word: "leftovers", pt: "sobras de comida" },
                { word: "wildlife", pt: "vida selvagem" },
                { word: "far-flung", pt: "distante/remoto" },
                { word: "reliable", pt: "confiável" },
                { word: "pollution", pt: "poluição" },
                { word: "source", pt: "fonte" },
                { word: "sprawling", pt: "vasto, espalhado" },
                { word: "mother tongue", pt: "língua materna" },
                { word: "head noun", pt: "núcleo do sujeito" },
                { word: "challenge", pt: "desafio" }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => speakText(item.word)}
                  className="bg-orange-50 p-4 rounded-xl border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors flex justify-between items-center"
                >
                  <span className="font-bold text-orange-800">{item.word}</span>
                  <span className="text-sm text-gray-600">{item.pt}</span>
                </div>
              ))}
            </div>
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
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}