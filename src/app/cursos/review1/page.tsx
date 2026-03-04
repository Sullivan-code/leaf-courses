"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save } from "lucide-react";

type SectionKey = 'pinpoint' | 'assessment';

interface ReviewLessonData {
  ratings: number[];
  activeSection: SectionKey;
  lastSaved: string | null;
}

export default function ReviewLessonFoodDrink() {
  const router = useRouter();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2, 2, 2, 2]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Função para salvar todos os dados
  const saveAllData = () => {
    try {
      const lessonData: ReviewLessonData = {
        ratings,
        activeSection,
        lastSaved: new Date().toLocaleString()
      };
      
      localStorage.setItem('reviewLessonFoodDrink', JSON.stringify(lessonData));
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
      const savedData = localStorage.getItem('reviewLessonFoodDrink');
      if (savedData) {
        const parsedData: ReviewLessonData = JSON.parse(savedData);
        
        setRatings(parsedData.ratings || [2, 2, 2, 2, 2, 2, 2, 2, 2]);
        setActiveSection(parsedData.activeSection || 'pinpoint');
        setLastSaved(parsedData.lastSaved || null);
        
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
      localStorage.removeItem('reviewLessonFoodDrink');
      
      // Resetar todos os estados
      setRatings([2, 2, 2, 2, 2, 2, 2, 2, 2]);
      setActiveSection('pinpoint');
      setLastSaved(null);
      
      setSaveMessage("✅ Progresso limpo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    // Mapeamento completo de áudios do GitHub
    const audioMap: { [key: string]: string } = {
      "I eat bread and butter.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-eat-bread-and-butter.mp3",
      "She drinks coffee with milk.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-drinks-coffee-with-milk.mp3",
      "He likes crackers.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-likes-crackers.mp3",
      "You like to eat granola.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-like-to-eat-granola.mp3",
      "It tastes good.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/it-tastes-good.mp",
      "I want to drink coffee.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-drink-coffee.mp3",
      "He prefers yogurt.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-prefers-yogurt.mp3",
      "She prefers to eat eggs.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-prefers-to-eat-eggs.mp3",
      "You don't eat chicken.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-don't-eat-chicken.mp3",
      "I don't drink milk.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-don't-drink-milk.mp3",
      "He doesn't like honey.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-doesn't-like honey.mp3",
      "She drinks juice for breakfast.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-drinks-juice-for-breakfas@.mp3",
      "You don't want to eat chicken for lunch.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-dont-want-to-eat-chicken-for-lunch.mp3",
      "He wants to eat beef and salad for dinner.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-wants-to-eat-beef-and-salad-for-dinner.mp3",
      "She wants a slice of apple pie, please.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-wants-a-slice-of-apple-pie-please.mp3",
      "You want to drink a cup of coffee.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-want-to-drink-a-cup-of-coffee.mp3",
      "He doesn't want a glass of water, thanks.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-doesnt-want-a-glass-of-water-thanks.mp3",
      "Do you like pancakes?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-like-pancakes.mp3",
      "Does she like to eat vegetables?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/does-she-like-to-eat-vegetables.mp3.mp3",
      "Does he want to drink soda?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/does-he-want-to-drink-soda.mp3",
      "What do you eat for breakfast?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-do-you-eat-for-breakfast.mp3",
      "What does she like to drink?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-does-she-like-to-drink.mp3",
      "Yes, I do.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/yes-i-do.mp3",
      "No, I don't.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/no-i-dont.mp3",
      "He loves rice and beans. And you?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-loves-rice-and-beans-and you.mp3",
      "She likes to eat tomatoes.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-likes-to-eat-tomatoes.mp3",
      "You want to eat chocolate cookies.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-want-to-eat-chocolate-cookies.mp3",
      "He doesn't want orange juice.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-doesnt-want-orange-juice.mp3",
      "Good morning.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-morning.mp3",
      "Good afternoon.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-afternoon.mp3",
      "Good evening.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-evening.mp3",
      "Good night.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/good-night.mp3",
      "See you later.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/see-you-later.mp3",
      "Bye. See you.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/bye-see-you.mp3"
    };

    // Verifica se existe um áudio específico para esta frase EXATA
    const audioUrl = audioMap[word];
    
    if (audioUrl) {
      console.log("Usando áudio específico:", audioUrl);
      // Adiciona timestamp para evitar cache
      const uniqueUrl = audioUrl + '?t=' + Date.now();
      const audio = new Audio(uniqueUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      return;
    }

    // Comportamento padrão para outros áudios (fallback)
    console.log("Usando áudio padrão para:", word);
    const formattedWord = word
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');

    const defaultAudio = new Audio(`/audios/${formattedWord}.mp3?t=${Date.now()}`);
    defaultAudio.play().catch(e => console.error("Erro ao reproduzir áudio padrão:", e));
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
      title: "📖 PINPOINT - Sentences and Examples",
      content: [
        { english: "I eat bread and butter.", portuguese: "Eu como pão com manteiga" },
        { english: "She drinks coffee with milk.", portuguese: "Ela bebe café com leite" },
        { english: "He likes crackers.", portuguese: "Ele gosta de biscoitos salgados" },
        { english: "You like to eat granola.", portuguese: "Você gosta de comer granola" },
        { english: "It tastes good.", portuguese: "Isso tem um gosto bom" },
        { english: "I want to drink coffee.", portuguese: "Eu quero beber café" },
        { english: "He prefers yogurt.", portuguese: "Ele prefere iogurte" },
        { english: "She prefers to eat eggs.", portuguese: "Ela prefere comer ovos" },
        { english: "You don't eat chicken.", portuguese: "Você não come frango" },
        { english: "I don't drink milk.", portuguese: "Eu não bebo leite" },
        { english: "He doesn't like honey.", portuguese: "Ele não gosta de mel" },
        { english: "She drinks juice for breakfast.", portuguese: "Ela bebe suco no café da manhã" },
        { english: "You don't want to eat chicken for lunch.", portuguese: "Você não quer comer frango no almoço" },
        { english: "He wants to eat beef and salad for dinner.", portuguese: "Ele quer comer carne e salada no jantar" },
        { english: "She wants a slice of apple pie, please.", portuguese: "Ela quer uma fatia de torta de maçã, por favor" },
        { english: "You want to drink a cup of coffee.", portuguese: "Você quer beber uma xícara de café" },
        { english: "He doesn't want a glass of water, thanks.", portuguese: "Ele não quer um copo de água, obrigado" },
        { english: "Do you like pancakes?", portuguese: "Você gosta de panquecas?" },
        { english: "Does she like to eat vegetables?", portuguese: "Ela gosta de comer legumes?" },
        { english: "Does he want to drink soda?", portuguese: "Ele quer beber refrigerante?" },
        { english: "What do you eat for breakfast?", portuguese: "O que você come no café da manhã?" },
        { english: "What does she like to drink?", portuguese: "O que ela gosta de beber?" },
        { english: "Yes, I do.", portuguese: "Sim, eu gosto." },
        { english: "No, I don't.", portuguese: "Não, eu não gosto." },
        { english: "He loves rice and beans. And you?", portuguese: "Ele ama arroz e feijão. E você?" },
        { english: "She likes to eat tomatoes.", portuguese: "Ela gosta de comer tomates." },
        { english: "You want to eat chocolate cookies.", portuguese: "Você quer comer biscoitos de chocolate." },
        { english: "He doesn't want orange juice.", portuguese: "Ele não quer suco de laranja." },
        { english: "Good morning.", portuguese: "Bom dia." },
        { english: "Good afternoon.", portuguese: "Boa tarde." },
        { english: "Good evening.", portuguese: "Boa noite." },
        { english: "Good night.", portuguese: "Boa noite." },
        { english: "See you later.", portuguese: "Até mais tarde." },
        { english: "Bye. See you.", portuguese: "Tchau. Até mais." }
      ]
    },
    assessment: {
      title: "📊 Self-assessment",
      content: [
        "I can use some expressions to say hello.",
        "I can use some expressions to say goodbye.",
        "I can name some kinds of food and drink.",
        "I can say what I prefer to eat and drink for breakfast.",
        "I can say what I want to eat for lunch.",
        "I can say what I love to eat for dinner.",
        "I can ask people what they like to eat.",
        "I can say the kinds of food I don't eat.",
        "I can say what I like to eat and drink."
      ]
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando lição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      {/* Notificação de salvamento */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {saveMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Barra de controle de progresso */}
        <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">💾 Progresso:</h3>
            {lastSaved ? (
              <span className="text-sm text-gray-600">Último save: {lastSaved}</span>
            ) : (
              <span className="text-sm text-gray-600">Nenhum progresso salvo</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveAllData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Save size={18} />
              Salvar Agora
            </button>
            <button
              onClick={loadAllData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Carregar
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📖 REVIEW 1 – Food & Drink
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice and reinforce what you've learned!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co/BHzD06DX/review-main.jpg"
                alt="Food and Drink Review"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-blue-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                📖 Sentences and Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-100 to-green-100 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                    <div className="flex items-start space-x-4">
                      <button 
                        onClick={() => playAudio(item.english)}
                        className="flex-shrink-0 text-blue-600 hover:text-blue-800 transition-colors mt-1"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div>
                        <div className="text-xl font-bold text-blue-700 mb-2">{item.english}</div>
                        <div className="text-lg text-gray-600">{item.portuguese}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                📊 Self-assessment
              </h2>
              
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-lg text-purple-700 mb-6 text-center">
                  <strong>I can... (Eu consigo...)</strong>
                </p>
                
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
                                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                  ratings[index] === rating 
                                    ? getRatingColor(rating) + ' transform scale-110'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                aria-label={`Rate ${rating} for "${item}"`}
                              >
                                {ratings[index] === rating && (
                                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    {rating === 1 ? 'N' : rating === 2 ? 'G' : 'E'}
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
                      <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-red-700 font-medium text-sm">Needs Practice</span>
                    </div>
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-yellow-700 font-medium text-sm">Good</span>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-yellow-300 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-500 h-4 rounded-full" 
                style={{ width: `${(ratings.filter(r => r > 1).length / ratings.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              {Math.round((ratings.filter(r => r > 1).length / ratings.length) * 100)}% Complete
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-blue-600">
              {ratings.filter(r => r === 3).length > 6 ? 'Advanced' : 
               ratings.filter(r => r === 2).length > 4 ? 'Intermediate' : 'Beginner'}
            </div>
            <p className="text-gray-600">Keep practicing!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">
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
              router.push("/cursos/lesson6");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Previous Lesson
          </button>
          <button
            onClick={saveAllData}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg flex items-center gap-2"
          >
            <Save size={20} />
            Save Progress
          </button>
          <button
            onClick={() => {
              router.push("/cursos/lesson7");
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Indicador de último save */}
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>{lastSaved ? `📅 Último save: ${lastSaved}` : '💾 Clique em "Save Progress" para guardar suas respostas'}</p>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-yellow-700">
              🎉 Excellent work! You're mastering Food & Drink vocabulary! 🎉
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