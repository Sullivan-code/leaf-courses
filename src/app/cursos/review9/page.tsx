"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'exposure' | 'dialogue' | 'questions' | 'grammar' | 'situations' | 'conversation' | 'production' | 'assessment';

// Hook para gerenciamento de salvamento
const useReviewSave = (lessonKey: string, initialRatings: number[]) => {
  const [ratings, setRatings] = useState<number[]>(initialRatings);
  const [writingAnswers, setWritingAnswers] = useState<Record<string, string>>({});
  const [conversationAnswers, setConversationAnswers] = useState<Record<number, string>>({});

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem(lessonKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.ratings && Array.isArray(data.ratings)) {
          setRatings(data.ratings);
        }
        if (data.writingAnswers) {
          setWritingAnswers(data.writingAnswers);
        }
        if (data.conversationAnswers) {
          setConversationAnswers(data.conversationAnswers);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  }, [lessonKey]);

  // Salvar todos os dados
  const saveProgress = () => {
    const data = {
      ratings,
      writingAnswers,
      conversationAnswers,
      lastSaved: new Date().toISOString(),
      progress: calculateProgress(ratings)
    };
    localStorage.setItem(lessonKey, JSON.stringify(data));
    return data;
  };

  // Limpar todos os dados
  const clearProgress = () => {
    localStorage.removeItem(lessonKey);
    setRatings(initialRatings);
    setWritingAnswers({});
    setConversationAnswers({});
  };

  // Atualizar rating específico
  const updateRating = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
    
    const data = {
      ratings: newRatings,
      writingAnswers,
      conversationAnswers,
      lastSaved: new Date().toISOString(),
      progress: calculateProgress(newRatings)
    };
    localStorage.setItem(lessonKey, JSON.stringify(data));
    
    return newRatings;
  };

  // Atualizar escrita
  const updateWritingAnswer = (key: string, value: string) => {
    const newAnswers = { ...writingAnswers, [key]: value };
    setWritingAnswers(newAnswers);
    
    const data = {
      ratings,
      writingAnswers: newAnswers,
      conversationAnswers,
      lastSaved: new Date().toISOString(),
      progress: calculateProgress(ratings)
    };
    localStorage.setItem(lessonKey, JSON.stringify(data));
  };

  // Atualizar conversation
  const updateConversationAnswer = (index: number, value: string) => {
    const newAnswers = { ...conversationAnswers, [index]: value };
    setConversationAnswers(newAnswers);
    
    const data = {
      ratings,
      writingAnswers,
      conversationAnswers: newAnswers,
      lastSaved: new Date().toISOString(),
      progress: calculateProgress(ratings)
    };
    localStorage.setItem(lessonKey, JSON.stringify(data));
  };

  // Calcular progresso baseado nas avaliações
  const calculateProgress = (currentRatings: number[]) => {
    if (currentRatings.length === 0) return 0;
    const total = currentRatings.reduce((sum, rating) => sum + rating, 0);
    const maxPossible = currentRatings.length * 3;
    return Math.round((total / maxPossible) * 100);
  };

  // Obter nível de domínio
  const getMasteryLevel = () => {
    const progress = calculateProgress(ratings);
    if (progress >= 90) return "Advanced";
    if (progress >= 70) return "Intermediate";
    if (progress >= 50) return "Basic";
    return "Beginner";
  };

  return {
    ratings,
    writingAnswers,
    conversationAnswers,
    updateRating,
    updateWritingAnswer,
    updateConversationAnswer,
    saveProgress,
    clearProgress,
    progress: calculateProgress(ratings),
    masteryLevel: getMasteryLevel()
  };
};

export default function Review9GoingShopping() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('exposure');
  
  const {
    ratings,
    writingAnswers,
    conversationAnswers,
    updateRating,
    updateWritingAnswer,
    updateConversationAnswer,
    saveProgress,
    clearProgress,
    progress,
    masteryLevel
  } = useReviewSave("review9GoingShopping", [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (text: string) => {
    console.log("Playing audio for:", text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleRatingClick = (index: number, rating: number) => {
    updateRating(index, rating);
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };

  const handleSaveProgress = () => {
    const savedData = saveProgress();
    alert(`✅ Progress saved successfully!\n\n📊 Progress: ${savedData.progress}%\n⭐ Mastery Level: ${masteryLevel}\n📅 Last saved: ${new Date(savedData.lastSaved).toLocaleString()}`);
  };

  const handleClearProgress = () => {
    if (confirm("⚠️ Are you sure you want to clear ALL your progress? This action cannot be undone.")) {
      clearProgress();
      alert("🗑️ All progress has been cleared!");
    }
  };

  const sections = {
    exposure: {
      title: "📖 EXPOSURE - Natural Input",
      content: [
        { english: "I am wearing a white T-shirt today, but I have been thinking about changing things up a bit.", portuguese: "Estou usando uma camiseta branca hoje, mas tenho pensado em mudar um pouco as coisas." },
        { english: "She is looking for a new outfit because it turned out that her old clothes are not her thing anymore.", portuguese: "Ela está procurando uma roupa nova porque descobriu que suas roupas velhas não são mais a sua praia." },
        { english: "Right now, I am trying to figure out what to buy.", portuguese: "No momento, estou tentando descobrir o que comprar." },
        { english: "I have looked into some options, but I still need to come up with a better plan.", portuguese: "Eu pesquisei algumas opções, mas ainda preciso criar um plano melhor." },
        { english: "Yesterday, I ran into an old friend at the mall, and we went over some ideas together.", portuguese: "Ontem, encontrei um velho amigo no shopping, e nós revisamos algumas ideias juntos." },
        { english: "He pointed out that there are a ton of discounts in that store.", portuguese: "Ele destacou que há muitas promoções naquela loja." },
        { english: "Some items are on sale — they're 50% off. That's like killing two birds with one stone: saving money and buying good clothes.", portuguese: "Alguns itens estão em promoção — estão com 50% de desconto. É como matar dois coelhos com uma cajadada só: economizar dinheiro e comprar roupas boas." },
        { english: "I have been checking prices all week, and I think I will buy a pair of sneakers.", portuguese: "Tenho verificado os preços a semana toda, e acho que comprarei um par de tênis." },
        { english: "I will look into the quality before I decide.", portuguese: "Vou investigar a qualidade antes de decidir." },
        { english: "The cashier brought up the return policy, which was helpful.", portuguese: "O caixa mencionou a política de devolução, o que foi útil." },
        { english: "I'm tired, but I'll keep on looking until I find something perfect.", portuguese: "Estou cansado, mas continuarei procurando até encontrar algo perfeito." }
      ]
    },
    dialogue: {
      title: "💬 DIALOGUE - Shopping Conversation",
      content: [
        { speaker: "A", text: "What are you doing right now?", portuguese: "O que você está fazendo agora?" },
        { speaker: "B", text: "I'm shopping. I have been looking for a jacket.", portuguese: "Estou fazendo compras. Tenho procurado uma jaqueta." },
        { speaker: "A", text: "Did you find anything?", portuguese: "Você encontrou alguma coisa?" },
        { speaker: "B", text: "Not yet. I'm still trying to figure out what fits me best.", portuguese: "Ainda não. Ainda estou tentando descobrir o que me cai melhor." },
        { speaker: "A", text: "What size are you?", portuguese: "Qual é o seu tamanho?" },
        { speaker: "B", text: "I'm a large.", portuguese: "Sou tamanho grande." },
        { speaker: "A", text: "These items are on sale.", portuguese: "Estes itens estão em promoção." },
        { speaker: "B", text: "Really? That turned out to be a great surprise.", portuguese: "Sério? Isso acabou sendo uma ótima surpresa." },
        { speaker: "A", text: "How much is that jacket?", portuguese: "Quanto custa aquela jaqueta?" },
        { speaker: "B", text: "It's $60, but I think I will wait for a better discount.", portuguese: "Custa $60, mas acho que esperarei por um desconto melhor." },
        { speaker: "A", text: "Good idea.", portuguese: "Boa ideia." },
        { speaker: "B", text: "Yeah, I have been learning to save money.", portuguese: "Sim, tenho aprendido a economizar dinheiro." }
      ]
    },
    questions: {
      title: "❓ NATURAL QUESTIONS",
      content: [
        "What are you wearing today?",
        "Are you looking for anything right now?",
        "Why are you changing your outfit?",
        "Have you ever bought something on sale?",
        "Have you been looking for new clothes recently?",
        "What will you buy next time you go shopping?",
        "Do you usually run into people at the mall?",
        "How do you figure out your style?"
      ]
    },
    grammar: {
      title: "🧩 GRAMMAR STRUCTURES",
      structures: [
        { name: "Present Continuous", pattern: "am/is/are + verb-ing", examples: ["I am looking for a new shirt.", "She is wearing a beautiful dress."] },
        { name: "Present Perfect", pattern: "have/has + past participle", examples: ["I have bought new shoes.", "She has changed her style."] },
        { name: "Have Been (Present Perfect Continuous)", pattern: "have/has been + verb-ing", examples: ["I have been studying prices.", "They have been working all day."] },
        { name: "Future (Will)", pattern: "will + verb", examples: ["I will buy new sneakers.", "We will go shopping tomorrow."] }
      ]
    },
    situations: {
      title: "🛍️ REAL SITUATIONS",
      content: [
        { english: "Do you have change for 100?", portuguese: "Você tem troco para 100?" },
        { english: "I have $10 in change.", portuguese: "Tenho $10 em troco." },
        { english: "Where is the ATM?", portuguese: "Onde fica o caixa eletrônico?" },
        { english: "It is between the coffee shop and the bank.", portuguese: "Fica entre a cafeteria e o banco." },
        { english: "Do you prefer to pay in cash or card?", portuguese: "Você prefere pagar em dinheiro ou cartão?" },
        { english: "I don't do much on weekends, but today I'm shopping.", portuguese: "Não faço muita coisa nos fins de semana, mas hoje estou fazendo compras." }
      ]
    },
    conversation: {
      title: "🗣️ CONVERSATION PRACTICE",
      questions: [
        "Where is your bag?",
        "What are you wearing right now?",
        "What are you doing at this moment?",
        "Have you ever bought something on sale?",
        "Have you been looking for new clothes recently?",
        "What will you buy next time you go shopping?",
        "Have you ever run into someone at the mall?",
        "How do you figure out your style?",
        "Do you prefer to pay in cash or card?",
        "Do you need the receipt?"
      ]
    },
    production: {
      title: "✍️ GUIDED PRODUCTION",
      prompts: [
        { key: "wearing", prompt: "I am wearing __________", placeholder: "a blue jacket and black jeans" },
        { key: "bought", prompt: "I have bought __________", placeholder: "a new pair of sneakers last week" },
        { key: "looking", prompt: "I have been looking for __________", placeholder: "a winter coat for two weeks" },
        { key: "willBuy", prompt: "I will buy __________", placeholder: "a new phone next month" },
        { key: "ranInto", prompt: "Yesterday, I ran into __________", placeholder: "my cousin at the supermarket" },
        { key: "figureOut", prompt: "I need to figure out __________", placeholder: "what size fits me best" },
        { key: "lookInto", prompt: "I will look into __________", placeholder: "the return policy before buying" }
      ]
    },
    assessment: {
      title: "📊 SELF-ASSESSMENT",
      content: [
        "I can use Present Continuous to talk about actions happening now.",
        "I can use Present Perfect to talk about past experiences.",
        "I can use 'have been' to talk about ongoing actions.",
        "I can use 'will' to talk about future plans.",
        "I can understand and use shopping vocabulary.",
        "I can use natural expressions like 'figure out', 'run into', 'look into'.",
        "I can use idioms like 'killing two birds with one stone'.",
        "I can ask and answer questions about clothing and shopping.",
        "I can have a basic conversation about buying things.",
        "I can understand phrasal verbs used in shopping contexts.",
        "I can talk about discounts and prices naturally.",
        "I can express preferences when shopping for clothes."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-indigo-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🛍️ REVIEW 9 – GOING SHOPPING
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice Present Continuous, Present Perfect, Future with will, and shopping vocabulary!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                alt="Going Shopping Review"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Scrollable */}
        <div className="flex overflow-x-auto gap-2 mb-8 pb-2 justify-center flex-wrap">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as SectionKey)}
              className={`py-3 px-4 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                activeSection === key
                  ? 'bg-indigo-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-indigo-200">
          
          {/* EXPOSURE Section */}
          {activeSection === 'exposure' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                📖 Natural Input - Read & Observe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.exposure.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl shadow-lg border-2 border-indigo-200">
                    <div className="flex items-start space-x-4">
                      <button 
                        onClick={() => playAudio(item.english)}
                        className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 transition-colors mt-1"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <div className="text-lg font-bold text-indigo-700 mb-2">{item.english}</div>
                        <div className="text-md text-gray-600">{item.portuguese}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DIALOGUE Section */}
          {activeSection === 'dialogue' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                💬 Shopping Dialogue
              </h2>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-6 border-2 border-green-300">
                {sections.dialogue.content.map((item, index) => (
                  <div key={index} className={`p-3 rounded-lg ${item.speaker === 'A' ? 'bg-blue-100 ml-0 mr-8' : 'bg-green-100 ml-8 mr-0'} mb-3`}>
                    <div className="flex items-start gap-3">
                      <div className={`font-bold w-8 h-8 rounded-full flex items-center justify-center ${item.speaker === 'A' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                        {item.speaker}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.text}</p>
                        <p className="text-gray-500 text-sm mt-1">{item.portuguese}</p>
                      </div>
                      <button onClick={() => playAudio(item.text)} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTIONS Section */}
          {activeSection === 'questions' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                ❓ Natural Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.questions.content.map((question, index) => (
                  <div key={index} className="bg-gradient-to-br from-yellow-100 to-orange-100 p-5 rounded-2xl border-2 border-yellow-300 flex items-center gap-3">
                    <div className="text-2xl">❓</div>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{question}</p>
                    </div>
                    <button onClick={() => playAudio(question)} className="text-gray-500 hover:text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GRAMMAR Section */}
          {activeSection === 'grammar' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                🧩 Grammar Structures
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.grammar.structures.map((struct, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl border-2 border-purple-300">
                    <h3 className="text-xl font-bold text-purple-700 mb-2">{struct.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{struct.pattern}</p>
                    <div className="space-y-1">
                      {struct.examples.map((ex, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className="text-purple-500">→</span>
                          <span className="text-gray-700">{ex}</span>
                          <button onClick={() => playAudio(ex)} className="ml-auto text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REAL SITUATIONS Section */}
          {activeSection === 'situations' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                🛍️ Real Shopping Situations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.situations.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-cyan-100 to-blue-100 p-5 rounded-2xl border-2 border-cyan-300">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🛒</div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{item.english}</p>
                        <p className="text-gray-500 text-sm mt-1">{item.portuguese}</p>
                      </div>
                      <button onClick={() => playAudio(item.english)} className="text-gray-500 hover:text-gray-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONVERSATION PRACTICE Section */}
          {activeSection === 'conversation' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                🗣️ Conversation Practice - Answer in English
              </h2>
              <div className="space-y-4">
                {sections.conversation.questions.map((question, index) => (
                  <div key={index} className="bg-gradient-to-br from-amber-100 to-yellow-100 p-5 rounded-2xl border-2 border-amber-300">
                    <p className="text-lg font-bold text-amber-700 mb-3">❓ {question}</p>
                    <textarea
                      value={conversationAnswers[index] || ""}
                      onChange={(e) => updateConversationAnswer(index, e.target.value)}
                      placeholder="Write your answer in English here..."
                      className="w-full p-4 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-none h-24 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GUIDED PRODUCTION Section */}
          {activeSection === 'production' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                ✍️ Complete with your own ideas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.production.prompts.map((prompt) => (
                  <div key={prompt.key} className="bg-gradient-to-br from-green-100 to-emerald-100 p-5 rounded-2xl border-2 border-green-300">
                    <p className="text-lg font-bold text-green-700 mb-3">{prompt.prompt}</p>
                    <input
                      type="text"
                      value={writingAnswers[prompt.key] || ""}
                      onChange={(e) => updateWritingAnswer(prompt.key, e.target.value)}
                      placeholder={`Example: ${prompt.placeholder}`}
                      className="w-full p-3 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSESSMENT Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                📊 Self-Assessment
              </h2>
              
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-lg text-purple-700">
                    <strong>I can... (Eu consigo...)</strong>
                  </p>
                  <div className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                    Auto-save enabled
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections.assessment.content.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border-2 border-purple-100 shadow-sm">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="text-purple-800 font-medium">{item}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {[1, 2, 3].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => handleRatingClick(index, rating)}
                                className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                  ratings[index] === rating 
                                    ? getRatingColor(rating) + ' transform scale-110 shadow-md'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                aria-label={`Rate ${rating}`}
                              >
                                {ratings[index] === rating && (
                                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    {rating === 1 ? '🔴' : rating === 2 ? '🟡' : '🟢'}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-500 font-medium">
                            {ratings[index] === 1 && 'Needs Practice'}
                            {ratings[index] === 2 && 'Good'}
                            {ratings[index] === 3 && 'Excellent'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <p className="text-yellow-800 font-bold text-lg">
                      🎯 Rating Guide
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <div className="text-2xl mb-1">🔴</div>
                      <span className="text-red-700 font-medium text-sm">Needs Practice</span>
                    </div>
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <div className="text-2xl mb-1">🟡</div>
                      <span className="text-yellow-700 font-medium text-sm">Good</span>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <div className="text-2xl mb-1">🟢</div>
                      <span className="text-green-700 font-medium text-sm">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-indigo-300 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-600">{progress}% Complete</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-cyan-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-cyan-600">{masteryLevel}</div>
            <p className="text-gray-600">Keep practicing!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice shopping conversations & present perfect</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson55")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Back to Lesson 55
          </button>
          <button
            onClick={() => router.push("/cursos/lesson57")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleSaveProgress}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
            >
              💾 Save Progress
            </button>
            <button 
              onClick={handleClearProgress}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-2xl transition-colors text-sm"
            >
              🗑️ Clear All
            </button>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-4 border-indigo-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-indigo-700">
              🛍️ Great job! You're getting fluent in shopping conversations! 👕
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Keep practicing Present Continuous, Present Perfect, and natural shopping expressions!
            </p>
            <div className="mt-4 text-sm text-indigo-600">
              <p>Your progress is automatically saved. You can continue anytime!</p>
            </div>
          </div>
        </div>

        {/* Key Vocabulary Review */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            📝 Key Vocabulary & Expressions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <span className="font-bold text-blue-700">Phrasal Verbs:</span>
              <p className="text-gray-600">figure out, run into, look into, bring up, keep on</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">Shopping Terms:</span>
              <p className="text-gray-600">on sale, discount, return policy, cash, card, receipt</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <span className="font-bold text-yellow-700">Idioms:</span>
              <p className="text-gray-600">killing two birds with one stone, a ton of</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">Grammar Tenses:</span>
              <p className="text-gray-600">Present Continuous, Present Perfect, Have been, Will</p>
            </div>
          </div>
        </div>

        {/* Saved Data Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>💾 Your ratings and written answers are automatically saved in your browser's local storage.</p>
          <p>📚 You can continue your review anytime by coming back to this page.</p>
        </div>
      </div>
    </div>
  );
}