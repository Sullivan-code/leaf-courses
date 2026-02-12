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

export default function ReviewLesson() {
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
  } = useReviewSave("review3", [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    // Mapeamento de áudios para Review 3
    const audioMap: { [key: string]: string } = {
      "I don't want to eat an apple.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-want-to-eat-an-apple.mp3",
      "We have an office at home.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-have-an-office-at-home.mp3",
      "I want to read a magazine online.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-read-a-magazine-online.mp3",
      "Do you need the tablet now?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-need-the-tablet-now.mp3",
      "Do you want to have a big house?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-have-a-big-house.mp3",
      "They have a small car.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-have-a-small-car.mp3",
      "I don't have an old computer.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-have-an-old-computer.mp3",
      "I have a new job now.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-have-a-new-job-now.mp3",
      "We have an American friend.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-have-an-american-friend.mp3",
      "They go to school in the morning.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-go-to-school-in-the-morning.mp3",
      "We want to go to church in the evening.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-want-to-go-to-church-in-the-evening.mp3",
      "I have to go to class today.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-have-to-go-to-class-today.mp3",
      "I don't have to go to bed early.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-have-to-go-to-bed-early.mp3",
      "Do you need to go to work now?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-need-to-go-to-work-now.mp3",
      "Do you want to go to the movies with me?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-go-to-the-movies-with-me.mp3",
      "I have to go to the mall today.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-have-to-go-to-the-mall-today.mp3",
      "You need to go to the hospital now.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-need-to-go-to-the-hospital-now.mp3",
      "I work at the company with my father.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-work-at-the-company-with-my-father.mp3",
      "They work at the grocery store.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-work-at-the-grocery-store.mp3",
      "Do you work at the bank?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-work-at-the-bank.mp3",
      "I don't study with my classmates at the coffee shop.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-dont-study-with-my-classmates-at-the-coffee-shop.mp3",
      "I have to send this message to my wife.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-have-to-send-this-message-to-my-wife.mp3",
      "We need to send this book to the teacher.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-need-to-send-this-book-to-the-teacher.mp3",
      "I send e-mails to my boss every day.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-send-emails-to-my-boss-every-day.mp3",
      "Do you usually read the news on your cell phone?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-usually-read-the-news-on-your-cell-phone.mp3",
      "I read my e-mails on my tablet.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-read-my-emails-on-my-tablet.mp3",
      "Do you read your lessons on the computer?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-read-your-lessons-on-the-computer.mp3",
      "I like to read to my children.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-like-to-read-to-my-children.mp3",
      "You speak French very well.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-speak-french-very-well.mp3",
      "I really have to go.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-really-have-to-go.mp3",
      "I study English, but I don't study Spanish.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-study-english-but-i-dont-study-spanish.mp3",
      "We usually work in the evenings.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-usually-work-in-the-evenings.mp3",
      "Do you speak English at work every day?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-speak-english-at-work-every-day.mp3",
      "I get up early.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-get-up-early.mp3",
      "I go to bed late.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-go-to-bed-late.mp3",
      "When do you go to church?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/when-do-you-go-to-church.mp3",
      "When do you have to go to the office?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/when-do-you-have-to-go-to-the-office.mp3"
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
      title: "📖 PINPOINT - Reading and Comprehension",
      content: [
        { english: "I don't want to eat an apple.", portuguese: "Eu não quero comer uma maçã." },
        { english: "We have an office at home.", portuguese: "Nós temos um escritório em casa." },
        { english: "I want to read a magazine online.", portuguese: "Eu quero ler uma revista online." },
        { english: "Do you need the tablet now?", portuguese: "Você precisa do tablet agora?" },
        { english: "Do you want to have a big house?", portuguese: "Você quer ter uma casa grande?" },
        { english: "They have a small car.", portuguese: "Eles têm um carro pequeno." },
        { english: "I don't have an old computer.", portuguese: "Eu não tenho um computador velho." },
        { english: "I have a new job now.", portuguese: "Eu tenho um emprego novo agora." },
        { english: "We have an American friend.", portuguese: "Nós temos um amigo americano." },
        { english: "They go to school in the morning.", portuguese: "Eles vão para a escola de manhã." },
        { english: "We want to go to church in the evening.", portuguese: "Nós queremos ir à igreja à noite." },
        { english: "I have to go to class today.", portuguese: "Eu tenho que ir para a aula hoje." },
        { english: "I don't have to go to bed early.", portuguese: "Eu não tenho que ir para a cama cedo." },
        { english: "Do you need to go to work now?", portuguese: "Você precisa ir para o trabalho agora?" },
        { english: "Do you want to go to the movies with me?", portuguese: "Você quer ir ao cinema comigo?" },
        { english: "I have to go to the mall today.", portuguese: "Eu tenho que ir ao shopping hoje." },
        { english: "You need to go to the hospital now.", portuguese: "Você precisa ir ao hospital agora." },
        { english: "I work at the company with my father.", portuguese: "Eu trabalho na empresa com meu pai." },
        { english: "They work at the grocery store.", portuguese: "Eles trabalham no mercado." },
        { english: "Do you work at the bank?", portuguese: "Você trabalha no banco?" },
        { english: "I don't study with my classmates at the coffee shop.", portuguese: "Eu não estudo com meus colegas na cafeteria." },
        { english: "I have to send this message to my wife.", portuguese: "Eu tenho que enviar esta mensagem para minha esposa." },
        { english: "We need to send this book to the teacher.", portuguese: "Nós precisamos enviar este livro para o professor." },
        { english: "I send e-mails to my boss every day.", portuguese: "Eu envio e-mails para meu chefe todos os dias." },
        { english: "Do you usually read the news on your cell phone?", portuguese: "Você geralmente lê as notícias no seu celular?" },
        { english: "I read my e-mails on my tablet.", portuguese: "Eu leio meus e-mails no meu tablet." },
        { english: "Do you read your lessons on the computer?", portuguese: "Você lê suas lições no computador?" },
        { english: "I like to read to my children.", portuguese: "Eu gosto de ler para meus filhos." },
        { english: "You speak French very well.", portuguese: "Você fala francês muito bem." },
        { english: "I really have to go.", portuguese: "Eu realmente tenho que ir." },
        { english: "I study English, but I don't study Spanish.", portuguese: "Eu estudo inglês, mas não estudo espanhol." },
        { english: "We usually work in the evenings.", portuguese: "Nós geralmente trabalhamos à noite." },
        { english: "Do you speak English at work every day?", portuguese: "Você fala inglês no trabalho todos os dias?" },
        { english: "I get up early.", portuguese: "Eu acordo cedo." },
        { english: "I go to bed late.", portuguese: "Eu vou para a cama tarde." },
        { english: "When do you go to church?", portuguese: "Quando você vai à igreja?" },
        { english: "When do you have to go to the office?", portuguese: "Quando você tem que ir ao escritório?" }
      ]
    },
    assessment: {
      title: "📊 Self-assessment",
      content: [
        "Ask for and give a phone number.",
        "Ask for and give an e-mail address.",
        "Name a few places in the city.",
        "Talk about some objects I have.",
        "Talk about my routine in simple sentences.",
        "Say the numbers from 1 to 29.",
        "Give examples of places where I work.",
        "Give examples of places where I like to go with friends and family.",
        "Give examples of old and new things I have.",
        "Give examples of what I prefer to read on my cell phone.",
        "Say things I need to do every day.",
        "Say how many friends I have at school or how many coworkers I have.",
        "Talk about my daily activities.",
        "Describe my workplace or study place.",
        "Ask and answer about personal information.",
        "Express my preferences about reading and studying."
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-blue-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📚 REVIEW 3 – Daily Life & Communication
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice reading, comprehension, and conversation about daily routines and personal information!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co.com/6JQjLkYF/review3-img.jpg"
                alt="Daily Life and Communication Review"
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
                📖 Reading and Comprehension Practice
              </h2>
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-700 mb-3">📌 Classroom Suggestions:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Read aloud:</strong> Students should read and practice the sentences below</li>
                  <li><strong>Personalize:</strong> Ask which sentences are true for the student</li>
                  <li><strong>Word swap:</strong> Exchange words (work / study / read / go)</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-blue-100 to-purple-100 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
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
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center">
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

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-purple-600">{masteryLevel}</div>
            <p className="text-gray-600">Keep up the great work!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice conversation questions</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Back to Lessons
          </button>
          <button
            onClick={() => router.push("/cursos")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
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
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-4 border-blue-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-blue-700">
              🌟 Excellent progress! You're improving your daily communication skills! 🌟
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Keep practicing to become more confident in conversations about your routine and personal information!
            </p>
            <div className="mt-4 text-sm text-blue-600">
              <p>Your progress is automatically saved. You can continue anytime!</p>
            </div>
          </div>
        </div>

        {/* Conversation Practice Info */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-green-300">
          <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
            🗣️ Conversation Practice
          </h2>
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-700 mb-3">🎯 Objective:</h3>
            <p className="text-gray-700 mb-4">
              Assess students orally through simple questions about routine and personal information.
            </p>
            
            <h3 className="text-xl font-bold text-green-700 mb-3">📌 Important:</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-2 mb-4">
              <li>Questions should be read in Portuguese</li>
              <li>Students answer in English</li>
              <li>Encourage complete answers (Yes, I do / No, I don't + complement)</li>
            </ul>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-600 mb-2">Sample Questions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Do you live in a big house?</li>
                  <li>• Do you need a new cell phone?</li>
                  <li>• What is your telephone number?</li>
                  <li>• What is your e-mail?</li>
                  <li>• Where do you live?</li>
                  <li>• Where do you work?</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-xl border border-green-100">
                <h4 className="font-bold text-green-600 mb-2">More Questions:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• When do you go to work?</li>
                  <li>• Do you usually go to bed late?</li>
                  <li>• Do you want a new computer?</li>
                  <li>• Do you have a new cell phone?</li>
                  <li>• Do you need to study tomorrow?</li>
                  <li>• Do you read news on your cell phone?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Vocabulary Review */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-yellow-300">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
            📝 Vocabulary Highlights
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <span className="font-bold text-blue-700">Places:</span>
              <p className="text-gray-600">office, church, class, mall, hospital</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">Objects:</span>
              <p className="text-gray-600">apple, tablet, computer, cell phone</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">Activities:</span>
              <p className="text-gray-600">read, work, study, go, send</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl text-center">
              <span className="font-bold text-yellow-700">Time:</span>
              <p className="text-gray-600">morning, evening, today, now, every day</p>
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