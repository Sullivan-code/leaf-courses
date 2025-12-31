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

export default function ReviewLessonLanguagesCountries() {
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
  } = useReviewSave("review2LanguagesCountries", [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    // Mapeamento completo de áudios do GitHub para Lição 12
    const audioMap: { [key: string]: string } = {
      "We speak German, too.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-speak-german-too.mp3",
      "Do you study here or there?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-study-here-or-there.mp3",
      "I understand this language.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-understand-this-language.mp3",
      "I don't understand that word.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-understand-that-word.mp3",
      "I speak English at school.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-speak-english-at-school.mp3",
      "Do you speak French at work?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-speak-french-at-work.mp3",
      "I study Italian at home.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-study-italian-at-home.mp3",
      "They don't live in France.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-dont-live-in-france.mp3",
      "We don't live in the U.S.A.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-dont-live-in-usa.mp3",
      "We don't want to live in that country.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-dont-want-to-live-in-that-country.mp3",
      "They want to live in this city.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-live-in-this-city.mp3",
      "Do you want to study with me?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-study-with-me.mp3",
      "I want to go there with you.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-go-there-with-you.mp3",
      "I like to go there with my family.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-like-to-go-there-with-my-family.mp3",
      "Do you speak English with your wife?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-speak-english-with-your-wife.mp3",
      "Where do you study?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/where-do-you-study.mp3",
      "Where do you live?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/where-do-you-live.mp3",
      "Where do you want to go?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/where-do-you-want-to-go.mp3",
      "I want to go to the U.K.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-go-to-uk.mp3",
      "They want to go to Germany.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-want-to-go-to-germany.mp3",
      "Do you want to go to school?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-go-to-school.mp3",
      "Do they like to go to class?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-they-like-to-go-to-class.mp3",
      "I study in the morning.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-study-in-the-morning.mp3",
      "They go to school in the afternoon.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-go-to-school-in-the-afternoon.mp3",
      "We study in the evening.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-study-in-the-evening.mp3",
      "I don't eat at night.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-eat-at-night.mp3",
      "I speak Portuguese. What about you?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-speak-portuguese-what-about-you.mp3",
      "How do you spell 'neighbor'?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/how-do-you-spell-neighbor.mp3",
      "N-E-I-G-H-B-O-R.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/n-e-i-g-h-b-o-r.mp3",
      "What's your name?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/whats-your-name.mp3",
      "My name is Jordan.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my-name-is-jordan.mp3",
      "Nice to meet you.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/nice-to-meet-you.mp3",
      "Nice to meet you, too.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/nice-to-meet-you-too.mp3"
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
      title: "📖 PINPOINT - Sentences and Examples",
      content: [
        { english: "We speak German, too.", portuguese: "Nós também falamos alemão." },
        { english: "Do you study here or there?", portuguese: "Você estuda aqui ou ali?" },
        { english: "I understand this language.", portuguese: "Eu entendo esta língua." },
        { english: "I don't understand that word.", portuguese: "Eu não entendo aquela palavra." },
        { english: "I speak English at school.", portuguese: "Eu falo inglês na escola." },
        { english: "Do you speak French at work?", portuguese: "Você fala francês no trabalho?" },
        { english: "I study Italian at home.", portuguese: "Eu estudo italiano em casa." },
        { english: "They don't live in France.", portuguese: "Eles não moram na França." },
        { english: "We don't live in the U.S.A.", portuguese: "Nós não moramos nos EUA." },
        { english: "We don't want to live in that country.", portuguese: "Nós não queremos morar naquele país." },
        { english: "They want to live in this city.", portuguese: "Eles querem morar nesta cidade." },
        { english: "Do you want to study with me?", portuguese: "Você quer estudar comigo?" },
        { english: "I want to go there with you.", portuguese: "Eu quero ir lá com você." },
        { english: "I like to go there with my family.", portuguese: "Eu gosto de ir lá com minha família." },
        { english: "Do you speak English with your wife?", portuguese: "Você fala inglês com sua esposa?" },
        { english: "Where do you study?", portuguese: "Onde você estuda?" },
        { english: "Where do you live?", portuguese: "Onde você mora?" },
        { english: "Where do you want to go?", portuguese: "Para onde você quer ir?" },
        { english: "I want to go to the U.K.", portuguese: "Eu quero ir para o Reino Unido." },
        { english: "They want to go to Germany.", portuguese: "Eles querem ir para a Alemanha." },
        { english: "Do you want to go to school?", portuguese: "Você quer ir para a escola?" },
        { english: "Do they like to go to class?", portuguese: "Eles gostam de ir para a aula?" },
        { english: "I study in the morning.", portuguese: "Eu estudo de manhã." },
        { english: "They go to school in the afternoon.", portuguese: "Eles vão para a escola à tarde." },
        { english: "We study in the evening.", portuguese: "Nós estudamos à noite." },
        { english: "I don't eat at night.", portuguese: "Eu não como à noite." },
        { english: "I speak Portuguese. What about you?", portuguese: "Eu falo português. E você?" },
        { english: "How do you spell 'neighbor'?", portuguese: "Como se soletra 'vizinho'?" },
        { english: "N-E-I-G-H-B-O-R.", portuguese: "N-E-I-G-H-B-O-R." },
        { english: "What's your name?", portuguese: "Qual é o seu nome?" },
        { english: "My name is Jordan.", portuguese: "Meu nome é Jordan." },
        { english: "Nice to meet you.", portuguese: "Prazer em conhecê-lo(a)." },
        { english: "Nice to meet you, too.", portuguese: "Prazer em conhecê-lo(a) também." }
      ]
    },
    assessment: {
      title: "📊 Self-assessment",
      content: [
        "I can talk about languages I speak and understand.",
        "I can ask and tell where I study and live.",
        "I can express where I want to go (countries/cities).",
        "I can talk about daily routines at different times of day.",
        "I can ask and answer questions about language abilities.",
        "I can use basic conversational phrases like greetings.",
        "I can spell words in English when asked.",
        "I can introduce myself and ask for names.",
        "I can express preferences about places to live.",
        "I can talk about studying habits and locations.",
        "I can understand and use time expressions (morning/afternoon/evening/night).",
        "I can have simple conversations about travel plans."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-indigo-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🌍 REVIEW 2 – Languages & Countries
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice and reinforce what you've learned about languages, countries, and daily routines!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co/jPzWQkM9/review2-img.jpg"
                alt="Languages and Countries Review"
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
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
                📖 Sentences and Examples
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-100 to-cyan-100 p-6 rounded-2xl shadow-lg border-2 border-indigo-200">
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
                      <div>
                        <div className="text-xl font-bold text-indigo-700 mb-2">{item.english}</div>
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
            <p className="text-gray-600">Excellent progress!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice conversations about travel</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson12")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Back to Lesson 12
          </button>
          <button
            onClick={() => router.push("/cursos/lesson13")}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
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
          <div className="bg-gradient-to-r from-indigo-100 to-cyan-100 border-4 border-indigo-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-indigo-700">
              🌟 Fantastic work! You're mastering Languages & Countries vocabulary! 🌟
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Keep practicing to become fluent in conversations about travel, study, and daily routines!
            </p>
            <div className="mt-4 text-sm text-indigo-600">
              <p>Your progress is automatically saved. You can continue anytime!</p>
            </div>
          </div>
        </div>

        {/* Vocabulary Review */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-yellow-300">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
            📝 Vocabulary Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <span className="font-bold text-yellow-700">Countries:</span>
              <p className="text-gray-600">France, U.S.A., U.K., Germany</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <span className="font-bold text-blue-700">Languages:</span>
              <p className="text-gray-600">German, English, French, Italian</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">Time:</span>
              <p className="text-gray-600">morning, afternoon, evening, night</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">Places:</span>
              <p className="text-gray-600">school, work, home, class</p>
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