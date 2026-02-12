"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'pinpoint' | 'assessment';

export default function ReviewLessonFive() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (word: string) => {
    console.log("Reproduzindo áudio para:", word);
    
    const audioMap: { [key: string]: string } = {
      "How much is this backpack?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-much-is-this-backpack.mp3",
      "How much food do you want to buy?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-much-food-do-you-want-to-buy.mp3",
      "How many cousins do you have?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-many-cousins-do-you-have.mp3",
      "How many books do you read on vacation?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-many-books-do-you-read-on-vacation.mp3",
      "What’s this?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/whats-this.mp3",
      "It’s my new tablet.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/its-my-new-tablet.mp3",
      "I don’t like this cell phone. It’s expensive.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-like-this-cell-phone-its-expensive.mp3",
      "Do you want this computer? It’s good!": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-this-computer-its-good.mp3",
      "My uncle lives near here.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my-uncle-lives-near-here.mp3",
      "Do you live near the school?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-live-near-the-school.mp3",
      "Do they live far from the office?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-they-live-far-from-the-office.mp3",
      "They live far from here.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-live-far-from-here.mp3",
      "I don’t usually visit my grandparents.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-usually-visit-my-grandparents.mp3",
      "I want to visit the museum tomorrow.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-visit-the-museum-tomorrow.mp3",
      "Do you want to visit your cousins on vacation?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-visit-your-cousins-on-vacation.mp3",
      "He wants to buy some gifts.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-wants-to-buy-some-gifts.mp3",
      "I need to buy a lot of things at the grocery store.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-need-to-buy-a-lot-of-things-at-the-grocery-store.mp3",
      "I need to take some food with me.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-need-to-take-some-food-with-me.mp3",
      "What do you need to take to your neighbor?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-do-you-need-to-take-to-your-neighbor.mp3",
      "I usually go to work by bicycle.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-usually-go-to-work-by-bicycle.mp3",
      "Do you want to go by bus?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-go-by-bus.mp3",
      "No, I prefer to go by car.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/no-i-prefer-to-go-by-car.mp3",
      "I walk to the office, and you?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-walk-to-the-office-and-you.mp3",
      "My father drives me to school.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my-father-drives-me-to-school.mp3",
      "Meet me at the coffee shop.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/meet-me-at-the-coffee-shop.mp3",
      "Take a cab downtown and meet me at the park.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/take-a-cab-downtown-and-meet-me-at-the-park.mp3",
      "Don’t take the subway to school.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/dont-take-the-subway-to-school.mp3",
      "Don’t buy expensive souvenirs.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/dont-buy-expensive-souvenirs.mp3",
      "Does he live near here?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/does-he-live-near-here.mp3",
      "Does she work at a restaurant?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/does-she-work-at-a-restaurant.mp3",
      "Does your aunt visit you on Sundays?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/does-your-aunt-visit-you-on-sundays.mp3",
      "What does he need to buy?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-does-he-need-to-buy.mp3",
      "What time does she go to school?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-time-does-she-go-to-school.mp3"
    };

    const audioUrl = audioMap[word];
    
    if (audioUrl) {
      const uniqueUrl = audioUrl + '?t=' + Date.now();
      const audio = new Audio(uniqueUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  const handleRatingClick = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
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
        { english: "How much is this backpack?", portuguese: "Quanto custa esta mochila?" },
        { english: "How much food do you want to buy?", portuguese: "Quanta comida você quer comprar?" },
        { english: "How many cousins do you have?", portuguese: "Quantos primos você tem?" },
        { english: "How many books do you read on vacation?", portuguese: "Quantos livros você lê nas férias?" },
        { english: "What’s this?", portuguese: "O que é isto?" },
        { english: "It’s my new tablet.", portuguese: "É meu novo tablet." },
        { english: "I don’t like this cell phone. It’s expensive.", portuguese: "Eu não gosto deste celular. É caro." },
        { english: "Do you want this computer? It’s good!", portuguese: "Você quer este computador? É bom!" },
        { english: "My uncle lives near here.", portuguese: "Meu tio mora perto daqui." },
        { english: "Do you live near the school?", portuguese: "Você mora perto da escola?" },
        { english: "Do they live far from the office?", portuguese: "Eles moram longe do escritório?" },
        { english: "They live far from here.", portuguese: "Eles moram longe daqui." },
        { english: "I don’t usually visit my grandparents.", portuguese: "Eu não costumo visitar meus avós." },
        { english: "I want to visit the museum tomorrow.", portuguese: "Eu quero visitar o museu amanhã." },
        { english: "Do you want to visit your cousins on vacation?", portuguese: "Você quer visitar seus primos nas férias?" },
        { english: "He wants to buy some gifts.", portuguese: "Ele quer comprar alguns presentes." },
        { english: "I need to buy a lot of things at the grocery store.", portuguese: "Eu preciso comprar muitas coisas no supermercado." },
        { english: "I need to take some food with me.", portuguese: "Eu preciso levar alguma comida comigo." },
        { english: "What do you need to take to your neighbor?", portuguese: "O que você precisa levar para seu vizinho?" },
        { english: "I usually go to work by bicycle.", portuguese: "Eu geralmente vou para o trabalho de bicicleta." },
        { english: "Do you want to go by bus?", portuguese: "Você quer ir de ônibus?" },
        { english: "No, I prefer to go by car.", portuguese: "Não, eu prefiro ir de carro." },
        { english: "I walk to the office, and you?", portuguese: "Eu vou a pé para o escritório, e você?" },
        { english: "My father drives me to school.", portuguese: "Meu pai me leva para a escola de carro." },
        { english: "Meet me at the coffee shop.", portuguese: "Encontre-me na cafeteria." },
        { english: "Take a cab downtown and meet me at the park.", portuguese: "Pegue um táxi para o centro e me encontre no parque." },
        { english: "Don’t take the subway to school.", portuguese: "Não pegue o metrô para a escola." },
        { english: "Don’t buy expensive souvenirs.", portuguese: "Não compre lembranças caras." },
        { english: "Does he live near here?", portuguese: "Ele mora perto daqui?" },
        { english: "Does she work at a restaurant?", portuguese: "Ela trabalha em um restaurante?" },
        { english: "Does your aunt visit you on Sundays?", portuguese: "Sua tia te visita aos domingos?" },
        { english: "What does he need to buy?", portuguese: "O que ele precisa comprar?" },
        { english: "What time does she go to school?", portuguese: "Que horas ela vai para a escola?" }
      ]
    },
    assessment: {
      title: "📊 Self-assessment",
      content: [
        "name more members of the family.",
        "talk about things I do on vacation.",
        "understand prices and quantities.",
        "ask about the price of things.",
        "name some means of transportation.",
        "ask for and give directions.",
        "ask for favors and give commands."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-yellow-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📖 REVIEW 5 – Quantities • Locations • Transportation • Directions
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice and reinforce what you've learned!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80"
                alt="Review Five - Directions and Transportation"
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
                          <span className="text-purple-800 font-medium">I can {item}</span>
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
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-gray-600">85% Complete</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-blue-600">Advanced</div>
            <p className="text-gray-600">Great progress!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice giving directions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Lesson 30
          </button>
          <button
            onClick={() => {
              const data = {
                ratings,
                lastUpdated: new Date().toISOString(),
                review: "Review 5 - Quantities, Directions, Transportation"
              };
              localStorage.setItem("review5Progress", JSON.stringify(data));
              alert("✅ Progress saved successfully!");
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Save Progress 💾
          </button>
          <button
            onClick={() => router.push("/cursos/lesson31")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-yellow-100 border-4 border-yellow-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-yellow-700">
              🎉 Great job! You're mastering quantities, transportation, and directions! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}