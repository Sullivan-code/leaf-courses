"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'pinpoint' | 'assessment';

// Hook para gerenciamento de salvamento
const useReviewSave = (lessonKey: string, initialRatings: number[]) => {
  const [ratings, setRatings] = useState<number[]>(initialRatings);

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem(lessonKey);
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.ratings && Array.isArray(data.ratings)) {
          setRatings(data.ratings);
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
  };

  // Atualizar rating específico
  const updateRating = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
    
    // Auto-save após atualização
    const data = {
      ratings: newRatings,
      lastSaved: new Date().toISOString(),
      progress: calculateProgress(newRatings)
    };
    localStorage.setItem(lessonKey, JSON.stringify(data));
    
    return newRatings;
  };

  // Calcular progresso baseado nas avaliações
  const calculateProgress = (currentRatings: number[]) => {
    if (currentRatings.length === 0) return 0;
    const total = currentRatings.reduce((sum, rating) => sum + rating, 0);
    const maxPossible = currentRatings.length * 3; // 3 = Excelente
    return Math.round((total / maxPossible) * 100);
  };

  // Obter nível de domínio baseado no progresso
  const getMasteryLevel = () => {
    const progress = calculateProgress(ratings);
    if (progress >= 90) return "Advanced";
    if (progress >= 70) return "Intermediate";
    if (progress >= 50) return "Basic";
    return "Beginner";
  };

  return {
    ratings,
    setRatings,
    updateRating,
    saveProgress,
    clearProgress,
    progress: calculateProgress(ratings),
    masteryLevel: getMasteryLevel()
  };
};

export default function ReviewLessonEatingOut() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  
  // Usando o hook de salvamento
  const {
    ratings,
    updateRating,
    saveProgress,
    clearProgress,
    progress,
    masteryLevel
  } = useReviewSave("review8EatingOut", [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    // Mapeamento completo de áudios do GitHub para a Review 8 (Eating Out)
    const audioMap: { [key: string]: string } = {
      "I want to cook some pasta for dinner.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-cook-some-pasta.mp3",
      "Some people don't give tips at restaurants.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/some-people-dont-give-tips.mp3",
      "They still don't have any chefs there.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-dont-have-any-chefs.mp3",
      "She doesn't know any good bars.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-doesnt-know-any-good-bars.mp3",
      "Do you want some milkshake?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-some-milkshake.mp3",
      "I need to eat something after the gym.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-need-to-eat-something-after-gym.mp3",
      "How often do you go to the U.S.A.?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-often-do-you-go-to-usa.mp3",
      "Wait for me at the ice cream parlor.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/wait-for-me-at-ice-cream-parlor.mp3",
      "Do you want something to drink?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-something-to-drink.mp3",
      "I would like to order a salad, please.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-would-like-to-order-a-salad.mp3",
      "I ain't going to that restaurant again.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-aint-going-to-that-restaurant.mp3",
      "Would you travel to Japan next year?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/would-you-travel-to-japan.mp3"
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
    alert(`Progress saved successfully!\n\nProgress: ${savedData.progress}%\nMastery Level: ${masteryLevel}\nLast saved: ${new Date(savedData.lastSaved).toLocaleString()}`);
  };

  const handleClearProgress = () => {
    if (confirm("Are you sure you want to clear all your progress? This action cannot be undone.")) {
      clearProgress();
      alert("All progress has been cleared!");
    }
  };

  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Eating Out & Daily Routine",
      content: [
        { english: "I want to cook some pasta for dinner.", portuguese: "Eu quero cozinhar um pouco de macarrão para o jantar." },
        { english: "Some people don't give tips at restaurants.", portuguese: "Algumas pessoas não dão gorjeta em restaurantes." },
        { english: "They still don't have any chefs there.", portuguese: "Eles ainda não têm nenhum chef lá." },
        { english: "She doesn't know any good bars.", portuguese: "Ela não conhece nenhum bar bom." },
        { english: "Do you want some milkshake?", portuguese: "Você quer um pouco de milk-shake?" },
        { english: "Do you have any napkins?", portuguese: "Você tem alguns guardanapos?" },
        { english: "I need to eat something after the gym.", portuguese: "Preciso comer algo depois da academia." },
        { english: "She wants something for dessert.", portuguese: "Ela quer algo de sobremesa." },
        { english: "We don't know anything about this subject.", portuguese: "Nós não sabemos nada sobre este assunto." },
        { english: "They don't want anything to eat.", portuguese: "Eles não querem nada para comer." },
        { english: "Do you want something to drink?", portuguese: "Você quer algo para beber?" },
        { english: "Do you have anything for me in your bag?", portuguese: "Você tem algo para mim na sua bolsa?" },
        { english: "I want to talk to someone.", portuguese: "Eu quero falar com alguém." },
        { english: "I know somebody in this pizza place.", portuguese: "Eu conheço alguém nesta pizzaria." },
        { english: "Does he know anybody in this city?", portuguese: "Ele conhece alguém nesta cidade?" },
        { english: "We usually meet someone for lunch.", portuguese: "Nós geralmente encontramos alguém para o almoço." },
        { english: "Clara and Todd live here. This is their house.", portuguese: "Clara e Todd moram aqui. Esta é a casa deles." },
        { english: "How often do you go to the U.S.A.?", portuguese: "Com que frequência você vai aos EUA?" },
        { english: "→ I go there once a year.", portuguese: "→ Eu vou lá uma vez por ano." },
        { english: "She sometimes calls me.", portuguese: "Ela às vezes me liga." },
        { english: "He is never home.", portuguese: "Ele nunca está em casa." },
        { english: "They always visit their grandparents.", portuguese: "Eles sempre visitam seus avós." },
        { english: "What time does the store open?", portuguese: "A que horas a loja abre?" },
        { english: "→ It opens at 8:00.", portuguese: "→ Ela abre às 8:00." },
        { english: "The mall closes at 10:00 p.m.", portuguese: "O shopping fecha às 22:00." },
        { english: "Wait for me at the ice cream parlor.", portuguese: "Espere por mim na sorveteria." },
        { english: "Call your mother now.", portuguese: "Ligue para sua mãe agora." },
        { english: "Please, open this can for me.", portuguese: "Por favor, abra esta lata para mim." },
        { english: "Don't close your books.", portuguese: "Não fechem seus livros." },
        { english: "I want to make a hamburger, so I need some bread.", portuguese: "Quero fazer um hambúrguer, então preciso de pão." },
        { english: "I want to give something to my father.", portuguese: "Quero dar algo ao meu pai." },
        { english: "He wants to give you something.", portuguese: "Ele quer te dar algo." },
        { english: "Let's make a cake.", portuguese: "Vamos fazer um bolo." },
        { english: "I need to make some coffee.", portuguese: "Preciso fazer um pouco de café." },
        { english: "She loves to make new friends at school.", portuguese: "Ela adora fazer novos amigos na escola." },
        // Novas frases com WOULD (academia, viagem, comida, países) entre A2 - B1 - B2
        { english: "I would like to work out at the gym more often, but I'm always busy.", portuguese: "Eu gostaria de malhar na academia com mais frequência, mas estou sempre ocupado." },
        { english: "Would you try authentic Japanese sushi if you traveled to Tokyo?", portuguese: "Você experimentaria sushi japonês autêntico se viajasse para Tóquio?" },
        { english: "She would travel to Italy every year if she had the money.", portuguese: "Ela viajaria para a Itália todo ano se tivesse dinheiro." },
        { english: "We would order a traditional French dish at that bistro.", portuguese: "Nós pediríamos um prato tradicional francês naquele bistrô." },
        { english: "Would he prefer to eat a homemade burger or a frozen one?", portuguese: "Ele preferiria comer um hambúrguer caseiro ou um congelado?" },
        { english: "I would need a personal trainer to achieve my gym goals faster.", portuguese: "Eu precisaria de um personal trainer para alcançar meus objetivos na academia mais rápido." },
        { english: "Would you like to visit Germany during Oktoberfest?", portuguese: "Você gostaria de visitar a Alemanha durante a Oktoberfest?" },
        // Frases com AIN'T misturadas naturalmente
        { english: "I ain't got any cash to tip the waiter today.", portuguese: "Eu não tenho dinheiro para dar gorjeta ao garçom hoje." },
        { english: "She ain't coming to the restaurant because she's on a strict diet.", portuguese: "Ela não está vindo ao restaurante porque está em uma dieta rigorosa." },
        { english: "They ain't never been to a Brazilian steakhouse, but they would love to try.", portuguese: "Eles nunca estiveram em uma churrascaria brasileira, mas adorariam experimentar." },
        { english: "He ain't working out at the gym this week; he's traveling to Canada.", portuguese: "Ele não está malhando na academia esta semana; está viajando para o Canadá." },
        { english: "That ain't the way you make a traditional paella, my friend.", portuguese: "Não é assim que se faz uma paella tradicional, meu amigo." },
        { english: "We ain't got no time to cook something fancy, let's just order a pizza.", portuguese: "Não temos tempo para cozinhar algo chique, vamos apenas pedir uma pizza." }
      ]
    },
    assessment: {
      title: "📊 Self-assessment",
      content: [
        "I can name some dishes and food items in English.",
        "I can name kitchen utensils and basic cooking tools.",
        "I can use expressions to order food at a restaurant.",
        "I can use quantity words like some, any, something, anything.",
        "I can talk about things without identifying them exactly (something/anything).",
        "I can talk about people without identifying them (someone/anyone).",
        "I can talk about frequency using always, sometimes, never, once a year.",
        "I can ask and tell the time places open or close.",
        "I can give orders and requests using imperatives.",
        "I can use 'would' to talk about preferences for food, gym, and travel.",
        "I can understand and use 'ain't' in informal spoken English.",
        "I can have a simple conversation about eating out and daily routines."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-orange-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📘 REVIEW 8 – Full Lesson (Eating Out)
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice and reinforce what you've learned about restaurants, food, routines, and more!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co/k2V9LcM/eating-out-review.jpg"
                alt="Eating Out Review"
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
              onClick={() => setActiveSection(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-orange-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-orange-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                📖 Sentences and Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-2xl shadow-lg border-2 border-orange-200">
                    <div className="flex items-start space-x-4">
                      <button 
                        onClick={() => playAudio(item.english)}
                        className="flex-shrink-0 text-orange-600 hover:text-orange-800 transition-colors mt-1"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div>
                        <div className="text-xl font-bold text-orange-700 mb-2">{item.english}</div>
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-orange-300 text-center">
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
            <p className="text-gray-600">Excellent progress!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice ordering food & talking about routines</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson8")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Back to Lesson 8
          </button>
          <button
            onClick={() => router.push("/cursos/lesson9")}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleSaveProgress}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
            >
              Save Progress 💾
            </button>
            <button 
              onClick={handleClearProgress}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-2xl transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 border-4 border-orange-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-orange-700">
              🍽️ Great job! You're getting fluent in Eating Out conversations! 🍔
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Keep practicing to master imperatives, frequency words, and ordering food with confidence!
            </p>
            <div className="mt-4 text-sm text-orange-600">
              <p>Your progress is automatically saved. You can continue anytime!</p>
            </div>
          </div>
        </div>

        {/* Vocabulary Review */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-yellow-300">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
            📝 Key Vocabulary & Phrases
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <span className="font-bold text-yellow-700">Quantity words:</span>
              <p className="text-gray-600">some, any, something, anything</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <span className="font-bold text-blue-700">People:</span>
              <p className="text-gray-600">someone, anyone, somebody, anybody</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">Frequency:</span>
              <p className="text-gray-600">always, sometimes, never, once a year</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">Commands:</span>
              <p className="text-gray-600">Wait, Call, Open, Don't close</p>
            </div>
          </div>
        </div>

        {/* Saved Data Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your ratings are automatically saved in your browser's local storage.</p>
          <p>You can continue your review anytime by coming back to this page.</p>
        </div>
      </div>
    </div>
  );
}