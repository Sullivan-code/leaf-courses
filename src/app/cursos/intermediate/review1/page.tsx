"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Volume2, MessageSquare, CheckSquare, BookOpen } from "lucide-react";

type SectionKey = 'pinpoint' | 'conversation' | 'assessment';

interface ReviewLessonData {
  ratings: number[];
  activeSection: SectionKey;
  lastSaved: string | null;
  reflectionText: string;
}

export default function ReviewLessonHomeAndRoutine() {
  const router = useRouter();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  
  // 6 statements from Image 1
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2]);
  const [reflectionText, setReflectionText] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Função para salvar todos os dados
  const saveAllData = () => {
    try {
      const lessonData: ReviewLessonData = {
        ratings,
        activeSection,
        lastSaved: new Date().toLocaleString(),
        reflectionText
      };
      
      localStorage.setItem('reviewLessonHomeUpdated', JSON.stringify(lessonData));
      setLastSaved(new Date().toLocaleString());
      setSaveMessage("✅ Progresso salvo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      
      console.log("Dados salvos:", lessonData);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveMessage("❌ Erro ao salvar progresso");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  // Função para carregar todos os dados
  const loadAllData = () => {
    try {
      setIsLoading(true);
      const savedData = localStorage.getItem('reviewLessonHomeUpdated');
      if (savedData) {
        const parsedData: ReviewLessonData = JSON.parse(savedData);
        
        setRatings(parsedData.ratings || [2, 2, 2, 2, 2, 2]);
        setActiveSection(parsedData.activeSection || 'pinpoint');
        setLastSaved(parsedData.lastSaved || null);
        setReflectionText(parsedData.reflectionText || "");
        
        setSaveMessage("✅ Progresso carregado com sucesso!");
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
        
        console.log("Dados carregados:", parsedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      setSaveMessage("❌ Erro ao carregar progresso");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      setIsLoading(false);
    }
  };

  // Função para limpar todos os dados
  const clearAllData = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o progresso?")) {
      localStorage.removeItem('reviewLessonHomeUpdated');
      
      // Resetar todos os estados
      setRatings([2, 2, 2, 2, 2, 2]);
      setActiveSection('pinpoint');
      setLastSaved(null);
      setReflectionText("");
      
      setSaveMessage("✅ Progresso limpo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  // Função de áudio para usar SpeechSynthesis
  const playAudio = (text: string) => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleRatingClick = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
  };

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };

  const sections = {
    pinpoint: {
      title: "📖 PINPOINT",
      icon: <BookOpen size={20} />,
      content: [
        { english: "There are a couple of broken desks in this room that need repairing.", portuguese: "Há algumas carteiras quebradas nesta sala que precisam ser consertadas." },
        { english: "There aren't any carpets installed in my new house yet.", portuguese: "Não há nenhum carpete instalado na minha casa nova ainda." },
        { english: "Could you tell me if there is an ATM near here?", portuguese: "Você poderia me dizer se há um caixa eletrônico aqui perto?" },
        { english: "Could you please move this coffee table to the left?", portuguese: "Você poderia, por favor, mover esta mesa de centro para a esquerda?" },
        { english: "Make sure to put the bed right next to the closet.", portuguese: "Certifique-se de colocar a cama bem ao lado do armário." },
        { english: "My bedroom is always very tidy because I really can't stand messy rooms!", portuguese: "Meu quarto está sempre muito arrumado porque eu realmente não suporto salas bagunçadas!" },
        { english: "Most people believe that everybody needs to own their own house.", portuguese: "A maioria das pessoas acredita que todo mundo precisa ter a própria casa." },
        { english: "Somebody is finally moving into that empty apartment.", portuguese: "Alguém está finalmente se mudando para aquele apartamento vazio." },
        { english: "Is there anybody waiting to see the doctor?", portuguese: "Tem alguém esperando para ver o médico?" },
        { english: "Nobody is currently inside the elevator.", portuguese: "Ninguém está atualmente dentro do elevador." },
        { english: "We currently live in a tiny studio apartment, but we want to move to a two-story house.", portuguese: "Nós atualmente moramos em uma quitinete minúscula, mas queremos nos mudar para uma casa de dois andares." },
        { english: "There is a large detached house available for rent near here.", portuguese: "Há uma grande casa isolada disponível para alugar aqui perto." },
        { english: "There is plenty of space in my office, so I need somebody to share it with.", portuguese: "Há bastante espaço no meu escritório, então preciso de alguém para dividi-lo." },
        { english: "The cottage has a truly beautiful view overlooking the lake.", portuguese: "A casa de campo tem uma vista verdadeiramente linda com vista para o lago." },
        { english: "My brother really wants to start and run his own business.", portuguese: "Meu irmão realmente quer iniciar e administrar seu próprio negócio." },
        { english: "Your ID is lying under the books, I can see it clearly.", portuguese: "Sua identidade está debaixo dos livros, eu consigo vê-la claramente." },
        { english: "My father never loses his temper with anyone, which is why I love him.", portuguese: "Meu pai nunca perde a paciência com ninguém, e é por isso que eu o amo." },
        { english: "Would you like to share this sandwich with us?", portuguese: "Você gostaria de dividir este sanduíche conosco?" },
        { english: "You should never lose faith in people, no matter what happens.", portuguese: "Você nunca deve perder a fé nas pessoas, não importa o que aconteça." },
        { english: "Do you always get lost when you go downtown, or is it just me?", portuguese: "Você sempre se perde quando vai ao centro, ou sou só eu?" },
        { english: "Could you please put away these T-shirts in the closet?", portuguese: "Você poderia, por favor, guardar essas camisetas no armário?" },
        { english: "Don't put these armchairs here because they are completely broken.", portuguese: "Não coloque estas poltronas aqui porque elas estão completamente quebradas." },
        { english: "I always make sure to clean up my room on weekends.", portuguese: "Eu sempre faço questão de limpar meu quarto nos fins de semana." },
        { english: "They want to have their own separate space to work in.", portuguese: "Eles querem ter seu próprio espaço separado para trabalhar." },
        { english: "They don't want to pay rent because it's too expensive.", portuguese: "Eles não querem pagar aluguel porque é muito caro." },
        { english: "Excuse me, is there a lost and found section here?", portuguese: "Com licença, há um setor de achados e perdidos aqui?" },
        { english: "Could I see your ID, please?", portuguese: "Eu poderia ver sua identidade, por favor?" },
        { english: "I tend to lose my temper when I have to talk to them.", portuguese: "Eu costumo perder a paciência quando tenho que falar com eles." }
      ]
    },
    conversation: {
      title: "🗣️ CONVERSATION PRACTICE",
      icon: <MessageSquare size={20} />,
      questions: [
        "Do you want to move to another city?",
        "Where do you want to move to?",
        "Do you usually keep broken things? If so, why?",
        "Is your room tidy or messy?",
        "Who cleans up your bedroom?",
        "Are there carpets in your house?",
        "Do you live in a house or in an apartment? Is it large or tiny?",
        "Do you own your place or do you pay rent?",
        "What view do you have from your house?",
        "Do you prefer a gated community or a cottage in the countryside?",
        "Who do you usually lose your temper with?",
        "What makes you lose control?",
        "Do you like to share food with other people?",
        "Do you like languages? Do you find it easy to learn?",
        "What do you do when you get lost?",
        "What makes you lose faith?",
        "How do you like to have your name on your name tags?",
        "Do you have your charger in your backpack / bag?",
        "What is there in your living room?",
        "What is there behind your house?"
      ]
    },
    assessment: {
      title: "📊 SELF-ASSESSMENT",
      icon: <CheckSquare size={20} />,
      statements: [
        "... talk about the rooms in a house and some pieces of furniture. (L64)",
        "... describe the rooms in a house. (L61)",
        "... talk about the place I live. (L67)",
        "... talk about possible ways to have a house. (L63)",
        "... describe objects I may lose or find. (L65)",
        "... talk about my mood and reactions to events. (L66)"
      ],
      quickQuestions: [
        "How do you say Moto para a esquerda in English?",
        "How can you ask if there is a grocery store near where you are?",
        "Who cleans up the kitchen in your house?",
        "Are your drawers messy?",
        "How do you say pager doce in English?",
        "How do you say pegar elevador in English?",
        "What's your favorite view in your city?",
        "Are there plenty of buildings in your city?"
      ]
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Carregando revisão...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4 font-sans">
      {/* Notificação de salvamento */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in font-medium">
          {saveMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Barra de controle de progresso */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-lg gap-4">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">💾 Progresso:</h3>
            {lastSaved ? (
              <span className="text-sm text-gray-600">Último save: {lastSaved}</span>
            ) : (
              <span className="text-sm text-gray-600">Nenhum progresso salvo</span>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={saveAllData}
              className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium"
            >
              <Save size={18} />
              Salvar
            </button>
            <button
              onClick={loadAllData}
              className="flex-1 md:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Carregar
            </button>
            <button
              onClick={clearAllData}
              className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              🏠 REVIEW – Home & Routine
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6">
              Practice and reinforce what you've learned!
            </p>
            <div className="w-48 h-48 mx-auto relative rounded-2xl overflow-hidden shadow-lg border-2 border-gray-200">
              <Image
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Home and Routine Review"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key as SectionKey)}
              className={`py-4 px-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                activeSection === key
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
              }`}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.title}</span>
              <span className="sm:hidden">{section.title.split(' ')[1] || section.title}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border-4 border-blue-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                📖 Sentences and Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-50 to-green-50 p-5 rounded-2xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <button 
                        onClick={() => playAudio(item.english)}
                        className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors mt-1 bg-blue-100 p-2 rounded-full hover:bg-blue-200"
                        aria-label="Play audio"
                      >
                        <Volume2 size={20} />
                      </button>
                      <div>
                        <div className="text-lg font-bold text-gray-800 mb-2 leading-snug">{item.english}</div>
                        <div className="text-md text-gray-600 italic">{item.portuguese}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONVERSATION Section */}
          {activeSection === 'conversation' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                🗣️ Conversation Practice
              </h2>
              <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                Practice these questions. Click the audio icon to listen and practice your pronunciation. Try to answer them using the vocabulary from lessons 61-67.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.conversation.questions.map((question, index) => (
                  <div key={index} className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
                    <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 text-indigo-800 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div className="flex-grow">
                      <p className="text-gray-800 font-medium text-lg leading-snug">{question}</p>
                    </div>
                    <button 
                      onClick={() => playAudio(question)}
                      className="flex-shrink-0 text-indigo-600 hover:text-indigo-800 bg-white p-2 rounded-full shadow-sm hover:shadow-md transition-all"
                      aria-label="Play audio"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSESSMENT Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-3xl font-bold text-purple-600 mb-2 text-center">
                📊 Self-assessment
              </h2>
              
              {/* Part 1: Checkbox Statements */}
              <div className="bg-purple-50 rounded-2xl p-4 md:p-6 border-2 border-purple-200">
                <p className="text-lg text-purple-800 mb-4 font-semibold">
                  I can... (Eu consigo...)
                </p>
                <div className="grid grid-cols-1 gap-4">
                  {sections.assessment.statements.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border-2 border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm mt-0.5">
                          {index + 1}
                        </div>
                        <span className="text-purple-900 font-medium leading-tight text-lg">{item}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 bg-purple-50 p-2 rounded-lg self-end sm:self-center border border-purple-100">
                        {[1, 2, 3].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleRatingClick(index, rating)}
                            className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                              ratings[index] === rating 
                                ? getRatingColor(rating) + ' transform scale-110 shadow-md'
                                : 'bg-gray-200 hover:bg-gray-300 text-gray-500'
                            }`}
                            title={rating === 1 ? 'Needs Practice' : rating === 2 ? 'Good' : 'Excellent'}
                          >
                            <span className={ratings[index] === rating ? "text-white font-bold" : "font-bold"}>
                              {rating === 1 ? 'N' : rating === 2 ? 'G' : 'E'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part 2: Reflection Text Area */}
              <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-xl font-bold text-blue-800 mb-4">📝 Reflection</h3>
                <p className="text-blue-900 font-medium mb-3">
                  How did Lessons 61 to 66 help you with your personal, professional, and academic needs and wishes for studying English?
                </p>
                <textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-32 p-4 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm resize-none text-gray-700"
                />
              </div>

              {/* Part 3: Quick Self-Assessment Questions */}
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-4">💡 Quick Check</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.assessment.quickQuestions.map((item, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-green-200 shadow-sm flex items-start gap-3">
                       <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-gray-800 font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Legend */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-4 md:p-6">
                <div className="text-center mb-4">
                  <p className="text-yellow-800 font-bold text-lg">
                    🎯 Rating Guide
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-2 md:p-3">
                    <div className="w-6 h-6 bg-red-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">N</div>
                    <span className="text-red-700 font-medium text-xs md:text-sm">Needs Practice</span>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 md:p-3">
                    <div className="w-6 h-6 bg-yellow-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">G</div>
                    <span className="text-yellow-700 font-medium text-xs md:text-sm">Good</span>
                  </div>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-2 md:p-3">
                    <div className="w-6 h-6 bg-green-400 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs">E</div>
                    <span className="text-green-700 font-medium text-xs md:text-sm">Excellent</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-yellow-300 text-center flex flex-col justify-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
              <div 
                className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${(ratings.filter(r => r > 1).length / ratings.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600 font-medium">
              {Math.round((ratings.filter(r => r > 1).length / ratings.length) * 100)}% Complete
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center flex flex-col justify-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-blue-600">
              {ratings.filter(r => r === 3).length > 4 ? 'Advanced' : 
               ratings.filter(r => r === 2).length > 2 ? 'Intermediate' : 'Beginner'}
            </div>
            <p className="text-gray-600 mt-2">Keep practicing!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center flex flex-col justify-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600 font-medium">
              {ratings.filter(r => r === 1).length > 0 
                ? 'Practice what needs work' 
                : 'Ready for next lesson!'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => {
              router.push("/cursos/intermediate/lesson65");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg shadow-md"
          >
            ↞ Previous Lesson
          </button>
          <button
            onClick={saveAllData}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2 shadow-md"
          >
            <Save size={20} />
            Save Progress
          </button>
          <button
            onClick={() => {
              router.push("/cursos/intermediate/lesson67");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg shadow-md"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Indicador de último save */}
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>{lastSaved ? `📅 Último save: ${lastSaved}` : '💾 Clique em "Save Progress" para guardar suas respostas'}</p>
        </div>

        {/* Celebration Message */}
        <div className="text-center pb-12">
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-3xl p-6 inline-block shadow-lg">
            <p className="text-xl md:text-2xl font-bold text-yellow-700">
              🎉 Excellent work! You're mastering Home & Routine vocabulary! 🎉
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}