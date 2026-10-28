"use client";

import React, { useState } from "react";
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

// Função de Áudio (Text-to-Speech)
const speakText = (text: string) => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // Um pouco mais devagar para iniciantes

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
            Do zero à interpretação de textos. Comece pela base gramatical abaixo, ouça as pronúncias, faça anotações e depois teste seus conhecimentos. Clique nos ícones 🌐 para traduzir os exercícios.
          </p>
        </div>

        {/* SEÇÃO 0 - GRAMÁTICA PARA INICIANTES */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">0. O Alicerce: Gramática Passo a Passo</h2>
            <PencilIcon onClick={() => openNoteModal('Grammar Basics')} />
          </div>
          <div className="p-8 space-y-8">
            <p className="text-gray-700 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
              <strong className="text-yellow-800">Regra de Ouro:</strong> Em inglês, a ordem das palavras é quase sempre <strong>Sujeito (quem faz) + Verbo (ação) + Complemento (o resto)</strong>. Exemplo: <em>She (Ela) + studies (estuda) + English (inglês)</em>.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1: Simple Present */}
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-blue-800 text-xl mb-3">1. Simple Present (Presente Simples)</h3>
                <p className="text-gray-700 mb-2"><strong>Quando usar?</strong> Para hábitos, rotinas e verdades universais. (Ex: Eu estudo todos os dias).</p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-blue-600">Afirmativa:</strong> I / You / We / They + Verbo. <br/>
                    He / She / It + Verbo com <strong>-s</strong> ou <strong>-es</strong>. <br/>
                    <span className="italic text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => speakText("She studies English. He goes to school.")}>Ex: She studies. / He goes.</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-blue-600">Negativa:</strong> Usamos <strong>don't</strong> ou <strong>doesn't</strong>. <br/>
                    <span className="italic text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => speakText("I don't like. She doesn't like.")}>Ex: I don't like. / She doesn't like.</span><br/>
                    <span className="text-xs text-red-500">Cuidado: O verbo depois de doesn't fica sem o -s.</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-blue-600">Pergunta:</strong> Usamos <strong>Do</strong> ou <strong>Does</strong> antes do sujeito. <br/>
                    <span className="italic text-gray-500 cursor-pointer hover:text-blue-500" onClick={() => speakText("Do you study? Does she study?")}>Ex: Do you study? / Does she study?</span>
                  </li>
                </ul>
              </div>

              {/* Card 2: Present Continuous */}
              <div className="bg-purple-50 p-6 rounded-2xl border border-purple-200">
                <h3 className="font-bold text-purple-800 text-xl mb-3">2. Present Continuous (Presente Contínuo)</h3>
                <p className="text-gray-700 mb-2"><strong>Quando usar?</strong> Para ações acontecendo <strong>AGORA</strong>, neste exato momento.</p>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-purple-600">Fórmula:</strong> Sujeito + <strong>am / is / are</strong> + Verbo com <strong>-ing</strong>. <br/>
                    <span className="italic text-gray-500 cursor-pointer hover:text-purple-500" onClick={() => speakText("I am studying. She is reading.")}>Ex: I am studying. / She is reading.</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-purple-600">Palavras-chave:</strong> Now, right now, at the moment, Look!, Listen! <br/>
                    <span className="text-xs text-purple-600">Se ver essas palavras, use o -ing!</span>
                  </li>
                  <li className="bg-white p-3 rounded-lg">
                    <strong className="text-purple-600">Negativa e Pergunta:</strong> O verbo "to be" (am/is/are) manda. <br/>
                    <span className="italic text-gray-500 cursor-pointer hover:text-purple-500" onClick={() => speakText("She is not studying. Are they studying?")}>Ex: She isn't studying. / Are they studying?</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3 e 4 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 3: Noun Phrases */}
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-200">
                <h3 className="font-bold text-emerald-800 text-xl mb-3">3. Noun Phrases (Grupos Nominais)</h3>
                <p className="text-gray-700 mb-2">Em inglês, os adjetivos vêm <strong>ANTES</strong> do substantivo principal (O Núcleo / Head Noun).</p>
                <div className="bg-white p-4 rounded-lg mb-2 text-sm">
                  <p className="mb-1"><strong>Plastic</strong> pollution (Poluição <strong>plástica</strong>)</p>
                  <p className="text-xs text-gray-500">Aqui, "pollution" (poluição) é o núcleo. "Plastic" é o adjetivo.</p>
                </div>
                <div className="bg-white p-4 rounded-lg text-sm">
                  <p className="mb-1">A <strong>useful digital</strong> keyboard (Um teclado <strong>digital útil</strong>)</p>
                  <p className="text-xs text-gray-500">"keyboard" (teclado) é o núcleo. Os outros são características.</p>
                </div>
              </div>

              {/* Card 4: Dicas de Leitura */}
              <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200">
                <h3 className="font-bold text-rose-800 text-xl mb-3">4. Dica de Prova (Interpretação)</h3>
                <p className="text-gray-700 mb-2">Você não precisa traduzir cada palavra do texto. Use estas técnicas:</p>
                <ul className="list-disc pl-5 text-sm space-y-2 text-gray-700">
                  <li><strong>Skimming:</strong> Ler rápido só para saber o assunto geral (título e primeiro parágrafo).</li>
                  <li><strong>Scanning:</strong> Procurar no texto palavras específicas que aparecem na pergunta (nomes, anos).</li>
                  <li><strong>Cognatos:</strong> Palavras parecidas com o português (ex: <em>technology, communication, pollution</em>). Mas cuidado com as falsas (ex: <em>actually</em> não é "atualmente", é "na verdade").</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Textos Inéditos para Interpretação */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">1. Textos de Interpretação (Nível Iniciante)</h2>
            <PencilIcon onClick={() => openNoteModal('New Texts')} />
          </div>
          <div className="p-8 space-y-10">
            
            {/* Texto A */}
            <div>
              <InteractiveText 
                title="Text A: Community Action (Environment)"
                lines={[
                  { en: "Every Saturday, a group of volunteers meets at the local beach.", pt: "Todo sábado, um grupo de voluntários se encontra na praia local." },
                  { en: "They usually collect plastic waste to protect marine wildlife.", pt: "Eles geralmente coletam lixo plástico para proteger a vida selvagem marinha." },
                  { en: "Today, they are building a sign to warn people about pollution.", pt: "Hoje, eles estão construindo uma placa para alertar as pessoas sobre a poluição." },
                  { en: "They say that everyone must use reusable bottles instead of plastic ones.", pt: "Eles dizem que todos devem usar garrafas reutilizáveis em vez de garrafas plásticas." }
                ]}
              />
              <Quiz questions={[
                {
                  id: 1, 
                  question: "What do the volunteers usually do on Saturdays?", 
                  questionPt: "O que os voluntários geralmente fazem aos sábados?",
                  options: [
                    { en: "They build signs.", pt: "Eles constroem placas." },
                    { en: "They collect plastic waste.", pt: "Eles coletam lixo plástico." },
                    { en: "They drink reusable water.", pt: "Eles bebem água reutilizável." },
                    { en: "They go fishing.", pt: "Eles vão pescar." }
                  ], 
                  correctAnswer: 1, 
                  explanation: "O texto diz 'They usually collect plastic waste' (Simple Present, indicando hábito)." 
                },
                {
                  id: 2, 
                  question: "What are they doing TODAY?", 
                  questionPt: "O que eles estão fazendo HOJE?",
                  options: [
                    { en: "Collecting waste", pt: "Coletando lixo" },
                    { en: "Building a sign", pt: "Construindo uma placa" },
                    { en: "Swimming", pt: "Nadando" },
                    { en: "Buying plastic bottles", pt: "Comprando garrafas plásticas" }
                  ], 
                  correctAnswer: 1, 
                  explanation: "A palavra 'Today' neste contexto indica uma ação pontual no Present Continuous: 'they are building a sign'." 
                }
              ]} />
            </div>

            {/* Texto B */}
            <div>
              <InteractiveText 
                title="Text B: The Student's Routine (Technology)"
                lines={[
                  { en: "Lucas usually walks to school every morning.", pt: "Lucas geralmente caminha para a escola todas as manhãs." },
                  { en: "However, right now, he is taking the bus because it is raining heavily.", pt: "No entanto, neste exato momento, ele está pegando o ônibus porque está chovendo forte." },
                  { en: "At school, he uses digital tools to search for information online.", pt: "Na escola, ele usa ferramentas digitais para procurar informações on-line." },
                  { en: "He always checks the source before sharing a story on social media.", pt: "Ele sempre verifica a fonte antes de compartilhar uma história nas redes sociais." }
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
                  question: "Why is he taking the bus right now?", 
                  questionPt: "Por que ele está pegando o ônibus agora?",
                  options: [
                    { en: "Because he is late.", pt: "Porque ele está atrasado." },
                    { en: "Because it is raining.", pt: "Porque está chovendo." },
                    { en: "Because he is tired.", pt: "Porque ele está cansado." },
                    { en: "Because his car broke.", pt: "Porque o carro dele quebrou." }
                  ], 
                  correctAnswer: 1, 
                  explanation: "O texto afirma: 'because it is raining heavily' (porque está chovendo forte)." 
                }
              ]} />
            </div>

            {/* Texto C */}
            <div>
              <InteractiveText 
                title="Text C: Social Media & Fake News"
                lines={[
                  { en: "Social media is a powerful tool for communication.", pt: "As redes sociais são uma ferramenta poderosa para a comunicação." },
                  { en: "Many people use it to share news and express their opinions.", pt: "Muitas pessoas a usam para compartilhar notícias e expressar suas opiniões." },
                  { en: "However, misinformation spreads quickly if users do not check the source.", pt: "No entanto, a desinformação se espalha rapidamente se os usuários não verificarem a fonte." },
                  { en: "A reliable website usually has an author, a date, and verifiable facts.", pt: "Um site confiável geralmente tem um autor, uma data e fatos verificáveis." }
                ]}
              />
              <Quiz questions={[
                {
                  id: 5, 
                  question: "According to the text, what helps to identify a reliable website?", 
                  questionPt: "De acordo com o texto, o que ajuda a identificar um site confiável?",
                  options: [
                    { en: "Having many likes.", pt: "Ter muitas curtidas." },
                    { en: "Being shared by friends.", pt: "Ser compartilhado por amigos." },
                    { en: "Having an author, a date, and facts.", pt: "Ter um autor, uma data e fatos." },
                    { en: "Being visually beautiful.", pt: "Ser visualmente bonito." }
                  ], 
                  correctAnswer: 2, 
                  explanation: "O texto diz explicitamente: 'A reliable website usually has an author, a date, and verifiable facts'." 
                },
                {
                  id: 6, 
                  question: "What happens if users do not check the source?", 
                  questionPt: "O que acontece se os usuários não verificarem a fonte?",
                  options: [
                    { en: "Communication stops.", pt: "A comunicação para." },
                    { en: "Misinformation spreads quickly.", pt: "A desinformação se espalha rapidamente." },
                    { en: "Social media disappears.", pt: "As redes sociais desaparecem." },
                    { en: "The website becomes reliable.", pt: "O site se torna confiável." }
                  ], 
                  correctAnswer: 1, 
                  explanation: "O texto afirma: 'misinformation spreads quickly if users do not check the source'." 
                }
              ]} />
            </div>
          </div>
        </section>

        {/* 2. Textos da Prova (Revisão) */}
        <section className="bg-white rounded-[30px] shadow-md overflow-hidden border border-blue-100">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-bold">2. Revisão: Textos da Prova (ETEHL)</h2>
            <PencilIcon onClick={() => openNoteModal('Exam Texts')} />
          </div>
          <div className="p-8 space-y-10">
            
            <InteractiveText 
              title="Text D: An App Is Helping Indigenous Brazilians"
              lines={[
                { en: "For many Indigenous communities in the Brazilian Amazon, getting online is becoming increasingly important.", pt: "Para muitas comunidades indígenas na Amazônia brasileira, ficar on-line está se tornando cada vez mais importante." },
                { en: "In some far-flung villages, connections are still slow or unreliable.", pt: "Em algumas aldeias remotas, as conexões ainda são lentas ou não confiáveis." },
                { en: "Another challenge remains: most keyboards are designed for Portuguese and do not always include the letters used in Indigenous languages.", pt: "Outro desafio permanece: a maioria dos teclados é projetada para o português e nem sempre inclui as letras usadas nas línguas indígenas." },
                { en: "A new app called Linklado allows users to create their own keyboards and adapt them to their mother tongues.", pt: "Um novo aplicativo chamado Linklado permite que os usuários criem seus próprios teclados e os adaptem às suas línguas maternas." },
                { en: "In some communities, younger users are teaching older relatives how to use the technology.", pt: "Em algumas comunidades, usuários mais jovens estão ensinando parentes mais velhos a usar a tecnologia." }
              ]}
            />

            <Quiz questions={[
              {
                id: 7, 
                question: "According to the text, what is a 'far-flung village'?", 
                questionPt: "De acordo com o texto, o que é uma 'far-flung village'?",
                options: [
                  { en: "A village with high population.", pt: "Uma vila com alta população." },
                  { en: "A village located in very distant or isolated areas.", pt: "Uma vila localizada em áreas muito distantes ou isoladas." },
                  { en: "A village that doesn't use technology.", pt: "Uma vila que não usa tecnologia." },
                  { en: "A developed village.", pt: "Uma vila desenvolvida." }
                ], 
                correctAnswer: 1, 
                explanation: "'Far-flung' significa distante, remoto ou isolado." 
              },
              {
                id: 8, 
                question: "What is the main function of the app Linklado?", 
                questionPt: "Qual é a principal função do aplicativo Linklado?",
                options: [
                  { en: "To translate Portuguese automatically.", pt: "Traduzir português automaticamente." },
                  { en: "To provide free internet.", pt: "Fornecer internet grátis." },
                  { en: "To allow users to create custom keyboards.", pt: "Permitir que os usuários criem teclados personalizados." },
                  { en: "To replace smartphones.", pt: "Substituir smartphones." }
                ], 
                correctAnswer: 2, 
                explanation: "O texto afirma que o app 'allows users to create their own keyboards'." 
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
                id: 9, 
                question: "In what situation do we normally use the Simple Present?", 
                questionPt: "Em qual situação normalmente usamos o Simple Present (Presente Simples)?",
                options: [
                  { en: "To talk only about past actions.", pt: "Para falar apenas sobre ações passadas." },
                  { en: "To describe an action happening exactly now.", pt: "Para descrever uma ação acontecendo exatamente agora." },
                  { en: "To express habits, routines, and general facts.", pt: "Para expressar hábitos, rotinas e fatos gerais." },
                  { en: "To talk about future plans.", pt: "Para falar sobre planos futuros." }
                ], 
                correctAnswer: 2, 
                explanation: "O Simple Present é usado para hábitos, rotinas e verdades universais." 
              },
              {
                id: 10, 
                question: "Choose the correct Present Continuous sentence.", 
                questionPt: "Escolha a frase correta no Present Continuous (Presente Contínuo).",
                options: [
                  { en: "Indigenous teenagers is using new digital tools.", pt: "Adolescentes indígenas está usando novas ferramentas digitais." },
                  { en: "Indigenous teenagers are using new digital tools.", pt: "Adolescentes indígenas estão usando novas ferramentas digitais." },
                  { en: "Indigenous teenagers are use new digital tools.", pt: "Adolescentes indígenas estão usar novas ferramentas digitais." },
                  { en: "Indigenous teenagers using new digital tools.", pt: "Adolescentes indígenas usando novas ferramentas digitais." }
                ], 
                correctAnswer: 1, 
                explanation: "Sujeito plural (teenagers) usa 'are' + verbo-ing (using)." 
              },
              {
                id: 11, 
                question: "Which sentence contains a correctly formed noun phrase?", 
                questionPt: "Qual frase contém um grupo nominal (noun phrase) formado corretamente?",
                options: [
                  { en: "communities Indigenous", pt: "comunidades Indígenas" },
                  { en: "a smartphone modern useful", pt: "um smartphone moderno útil" },
                  { en: "technology digital new", pt: "tecnologia digital nova" },
                  { en: "a useful digital keyboard", pt: "um teclado digital útil" }
                ], 
                correctAnswer: 3, 
                explanation: "Em inglês, os adjetivos vêm antes do substantivo. 'A useful digital keyboard' está na ordem correta." 
              },
              {
                id: 12, 
                question: "If you store leftovers, you:", 
                questionPt: "Se você guardar sobras de comida (leftovers), você:",
                options: [
                  { en: "throw away food you do not want.", pt: "joga fora a comida que não quer." },
                  { en: "cook a completely new meal.", pt: "cozinha uma refeição completamente nova." },
                  { en: "keep the food that remains to eat later.", pt: "mantém a comida que sobrou para comer depois." },
                  { en: "give all your food to someone else.", pt: "dá toda a sua comida para outra pessoa." }
                ], 
                correctAnswer: 2, 
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
            <p className="text-gray-600 mb-6 italic">Clique nas palavras para ouvir a pronúncia correta e treinar seu listening.</p>
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