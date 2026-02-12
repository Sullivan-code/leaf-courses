"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'pinpoint' | 'activities' | 'assessment' | 'thereAndAround';

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
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [thereAndAroundText, setThereAndAroundText] = useState("");
  
  // Usando o hook de salvamento para o assessment
  const {
    ratings,
    updateRating,
    saveProgress,
    clearProgress,
    progress,
    masteryLevel
  } = useReviewSave("review4", Array(8).fill(2)); // 8 itens no assessment

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    // Mapeamento de áudios para Review 4
    const audioMap: { [key: string]: string } = {
      "I do the dishes at home every day.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-do-the-dishes-at-home-every-day.mp3",
      "We do the laundry on Saturdays.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-do-the-laundry-on-saturdays.mp3",
      "Do you have dinner on the couch?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-have-dinner-on-the-couch.mp3",
      "I cook for my children every day.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-cook-for-my-children-every-day.mp3",
      "I prefer to work out in the morning.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-prefer-to-work-out-in-the-morning.mp3",
      "I have some friends at work.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-have-some-friends-at-work.mp3",
      "I want to eat some pasta for lunch.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-eat-some-pasta-for-lunch.mp3",
      "Do you want more yogurt?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-more-yogurt.mp3",
      "I want more juice, please.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-more-juice-please.mp3",
      "He comes to work at 10:00 a.m. every day.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-comes-to-work-at-10am-every-day.mp3",
      "We study English at 6:00 p.m. at Wizard.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-study-english-at-6pm-at-wizard.mp3",
      "We like to stay home on weekends.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-like-to-stay-home-on-weekends.mp3",
      "I come to the countryside on weekends.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-come-to-the-countryside-on-weekends.mp3",
      "I need to go home. I have to go to bed early.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-need-to-go-home-i-have-to-go-to-bed-early.mp3",
      "I usually go to the gym during the week.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-usually-go-to-the-gym-during-the-week.mp3",
      "Do you know how to cook?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-know-how-to-cook.mp3",
      "Do you know how to speak Italian?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-know-how-to-speak-italian.mp3",
      "I want to learn how to speak German.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-want-to-learn-how-to-speak-german.mp3",
      "I like to read about biology.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-like-to-read-about-biology.mp3",
      "Do you want to learn more about this subject?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/do-you-want-to-learn-more-about-this-subject.mp3",
      "He works at the office all day long.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-works-at-the-office-all-day-long.mp3",
      "She has five brothers.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-has-five-brothers.mp3",
      "My friend studies geography at the university.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my-friend-studies-geography-at-the-university.mp3",
      "She comes home at 5:00 p.m.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-comes-home-at-5pm.mp3",
      "He doesn't have a car.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-doesnt-have-a-car.mp3",
      "He doesn't know how to speak Spanish.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/he-doesnt-know-how-to-speak-spanish.mp3",
      "She doesn't like to eat cheese.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-doesnt-like-to-eat-cheese.mp3",
      "My wife doesn't work until late.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/my-wife-doesnt-work-until-late.mp3",
      "What time is it?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-time-is-it.mp3",
      "It's 5:30.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/its-530.mp3",
      "What day is it today?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/what-day-is-it-today.mp3",
      "It's Wednesday.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/its-wednesday.mp3"
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

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: answer
    }));
  };

  const handleSaveThereAndAround = () => {
    const data = {
      text: thereAndAroundText,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem("review4_thereAndAround", JSON.stringify(data));
    alert("Text saved successfully!");
  };

  const handleLoadThereAndAround = () => {
    const savedData = localStorage.getItem("review4_thereAndAround");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setThereAndAroundText(data.text || "");
        alert("Text loaded from previous session!");
      } catch (error) {
        console.error("Error loading saved text:", error);
      }
    } else {
      alert("No saved text found.");
    }
  };

  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Reading Practice",
      content: [
        { english: "I do the dishes at home every day.", portuguese: "Eu lavo a louça em casa todos os dias." },
        { english: "We do the laundry on Saturdays.", portuguese: "Nós lavamos roupa aos sábados." },
        { english: "Do you have dinner on the couch?", portuguese: "Você janta no sofá?" },
        { english: "I cook for my children every day.", portuguese: "Eu cozinho para meus filhos todos os dias." },
        { english: "I prefer to work out in the morning.", portuguese: "Eu prefiro me exercitar de manhã." },
        { english: "I have some friends at work.", portuguese: "Eu tenho alguns amigos no trabalho." },
        { english: "I want to eat some pasta for lunch.", portuguese: "Eu quero comer um pouco de macarrão no almoço." },
        { english: "Do you want more yogurt?", portuguese: "Você quer mais iogurte?" },
        { english: "I want more juice, please.", portuguese: "Eu quero mais suco, por favor." },
        { english: "He comes to work at 10:00 a.m. every day.", portuguese: "Ele vem trabalhar às 10:00 da manhã todos os dias." },
        { english: "We study English at 6:00 p.m. at Wizard.", portuguese: "Nós estudamos inglês às 18:00 na Wizard." },
        { english: "We like to stay home on weekends.", portuguese: "Nós gostamos de ficar em casa nos finais de semana." },
        { english: "I come to the countryside on weekends.", portuguese: "Eu venho para o interior nos finais de semana." },
        { english: "I need to go home. I have to go to bed early.", portuguese: "Eu preciso ir para casa. Eu tenho que ir para a cama cedo." },
        { english: "I usually go to the gym during the week.", portuguese: "Eu geralmente vou à academia durante a semana." },
        { english: "Do you know how to cook?", portuguese: "Você sabe cozinhar?" },
        { english: "Do you know how to speak Italian?", portuguese: "Você sabe falar italiano?" },
        { english: "I want to learn how to speak German.", portuguese: "Eu quero aprender a falar alemão." },
        { english: "I like to read about biology.", portuguese: "Eu gosto de ler sobre biologia." },
        { english: "Do you want to learn more about this subject?", portuguese: "Você quer aprender mais sobre este assunto?" },
        { english: "He works at the office all day long.", portuguese: "Ele trabalha no escritório o dia todo." },
        { english: "She has five brothers.", portuguese: "Ela tem cinco irmãos." },
        { english: "My friend studies geography at the university.", portuguese: "Meu amigo estuda geografia na universidade." },
        { english: "She comes home at 5:00 p.m.", portuguese: "Ela chega em casa às 17:00." },
        { english: "He doesn't have a car.", portuguese: "Ele não tem um carro." },
        { english: "He doesn't know how to speak Spanish.", portuguese: "Ele não sabe falar espanhol." },
        { english: "She doesn't like to eat cheese.", portuguese: "Ela não gosta de comer queijo." },
        { english: "My wife doesn't work until late.", portuguese: "Minha esposa não trabalha até tarde." },
        { english: "What time is it?", portuguese: "Que horas são?" },
        { english: "It's 5:30.", portuguese: "São 5:30." },
        { english: "What day is it today?", portuguese: "Que dia é hoje?" },
        { english: "It's Wednesday.", portuguese: "É quarta-feira." }
      ]
    },
    activities: {
      title: "🎯 ACTIVITIES - Answer the Questions",
      questions: [
        "Do you usually eat pasta on Sundays?",
        "Do you want to have cooking classes?",
        "Where do you have to go this week?",
        "What time is it now?",
        "What day is it today?",
        "What subjects do you study at school?",
        "Do you exercise on weekends?",
        "Do you prefer cooking or cleaning?",
        "What time do you go to work?",
        "What time do you usually go to sleep during the week?",
        "What time do you usually go to sleep on weekends?",
        "Do you stay home on weekends?",
        "What do you have to study this month?",
        "Do you have to speak English at work?",
        "Do you like sleeping on the couch?",
        "Do you want to learn a new language?",
        "Do you live in an apartment or in a house?",
        "Do you wash clothes on weekends?",
        "What time do you have lunch?",
        "What subjects do you like to study?"
      ]
    },
    assessment: {
      title: "📊 SELF-ASSESSMENT",
      content: [
        "name some parts of a house",
        "ask for and tell the time",
        "say and understand the days of the week",
        "say some things I do during the week",
        "say some things other people do during the week",
        "say and understand the numbers up to 60",
        "talk about things I know and things I want to learn",
        "name more periods of time"
      ]
    },
    thereAndAround: {
      title: "📝 THERE AND AROUND",
      description: "Write about people and places around you."
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📚 REVIEW 4 – Lifestyle & Weekly Planning
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice daily routines, time expressions, and weekly planning in English!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=500&h=500&fit=crop"
                alt="Lifestyle and Weekly Planning Review"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-green-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
                📖 Reading Practice
              </h2>
              <div className="mb-8 p-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl border-2 border-green-300">
                <h3 className="text-xl font-bold text-green-700 mb-3">📌 Classroom Suggestions:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>Read aloud:</strong> Practice pronunciation and intonation</li>
                  <li><strong>Personalize:</strong> Ask students which sentences are true for them</li>
                  <li><strong>Time expressions:</strong> Focus on daily, weekly, and time expressions</li>
                  <li><strong>Negation practice:</strong> Practice positive and negative sentences</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl shadow-lg border-2 border-green-200">
                    <div className="flex items-start space-x-4">
                      <button 
                        onClick={() => playAudio(item.english)}
                        className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors mt-1"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div>
                        <div className="text-xl font-bold text-green-700 mb-2">{item.english}</div>
                        <div className="text-lg text-gray-600">{item.portuguese}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITIES Section */}
          {activeSection === 'activities' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
                🎯 Activities - Answer the Questions
              </h2>
              
              <div className="mb-8 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-700 mb-3">📌 Instructions:</h3>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li>Answer each question in complete sentences</li>
                  <li>Practice speaking and writing your answers</li>
                  <li>Use the vocabulary from the PINPOINT section</li>
                  <li>Be honest about your own routines and preferences</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.activities.questions.map((question, index) => (
                  <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border-2 border-blue-200">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-blue-700 mb-2">{question}</div>
                        <div className="text-sm text-gray-500 mb-3">
                          Practice: Say it aloud, then write your answer
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <textarea
                        value={answers[index] || ""}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                        placeholder="Write your answer here..."
                        className="w-full p-4 border-2 border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                      <div className="text-right text-sm text-gray-500 mt-2">
                        {answers[index]?.length || 0} characters
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-bold text-blue-600 mb-2">💡 Sample Answer:</h4>
                      <p className="text-gray-700 text-sm">
                        {index === 0 && "Yes, I usually eat pasta on Sundays with my family."}
                        {index === 1 && "Yes, I want to have cooking classes to learn new recipes."}
                        {index === 2 && "I have to go to work, the supermarket, and the gym this week."}
                        {index === 3 && "It's [current time] now."}
                        {index === 4 && "Today is [current day]."}
                        {index === 5 && "I study English, Math, and Science at school."}
                        {index === 6 && "Yes, I exercise on weekends. I go for a run on Saturday mornings."}
                        {index === 7 && "I prefer cooking because I enjoy making meals for my family."}
                        {index === 8 && "I go to work at 8:00 a.m."}
                        {index === 9 && "I usually go to sleep at 11:00 p.m. during the week."}
                        {index === 10 && "On weekends, I usually go to sleep at midnight."}
                        {index === 11 && "Yes, I usually stay home on weekends to relax."}
                        {index === 12 && "I have to study for my English exam this month."}
                        {index === 13 && "Yes, I have to speak English at work with international clients."}
                        {index === 14 && "No, I don't like sleeping on the couch. I prefer my bed."}
                        {index === 15 && "Yes, I want to learn Spanish."}
                        {index === 16 && "I live in an apartment in the city."}
                        {index === 17 && "Yes, I wash clothes on Saturdays."}
                        {index === 18 && "I have lunch at 1:00 p.m."}
                        {index === 19 && "I like to study languages and history."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    const allAnswers = Object.values(answers).filter(a => a.trim() !== "");
                    alert(`You have answered ${allAnswers.length} out of 20 questions. Keep going!`);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-xl transition-colors text-lg"
                >
                  Check Progress 📝
                </button>
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

          {/* THERE AND AROUND Section */}
          {activeSection === 'thereAndAround' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
                📝 There and Around
              </h2>
              
              <div className="mb-8 p-6 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl border-2 border-orange-300">
                <h3 className="text-xl font-bold text-orange-700 mb-3">✏️ Writing Exercise:</h3>
                <p className="text-gray-700 mb-4">
                  Write about people and places around you. Describe your daily routine, your family, 
                  your home, your work/school, and places you go during the week.
                </p>
                <ul className="list-disc pl-5 text-gray-700 space-y-2">
                  <li><strong>People:</strong> family, friends, coworkers, classmates</li>
                  <li><strong>Places:</strong> home, work, school, gym, supermarket, park</li>
                  <li><strong>Routines:</strong> daily activities, weekly schedule, weekend plans</li>
                  <li><strong>Preferences:</strong> what you like/dislike doing</li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-bold text-orange-600">Your Writing:</h4>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSaveThereAndAround}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Save Text 💾
                    </button>
                    <button
                      onClick={handleLoadThereAndAround}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                      Load Text 📂
                    </button>
                  </div>
                </div>
                
                <textarea
                  value={thereAndAroundText}
                  onChange={(e) => setThereAndAroundText(e.target.value)}
                  placeholder="Start writing about people and places around you...
                  
Example:
I live in a house with my family. We have three bedrooms, a living room, and a kitchen. My father works at an office and comes home at 6 p.m. My mother is a teacher and works at a school. I have two brothers. We go to school during the week.

On weekends, we like to stay home or visit our grandparents in the countryside. I usually do my homework on Saturday mornings and play video games in the afternoon. On Sundays, we have lunch together and sometimes go to the park.

I want to learn how to cook better. My mother knows how to make delicious pasta. I also want to learn more about geography because I like to travel..."
                  className="w-full h-96 p-6 border-4 border-orange-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg"
                />
                
                <div className="text-right text-gray-500">
                  {thereAndAroundText.length} characters • {thereAndAroundText.split(/\s+/).filter(word => word.length > 0).length} words
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-green-100 to-teal-100 border-2 border-green-400 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-green-700 mb-3">📋 Writing Tips:</h4>
                  <ul className="list-disc pl-5 text-gray-700 space-y-2">
                    <li>Use present simple tense for routines: <em>I work, I study, I go</em></li>
                    <li>Use time expressions: <em>every day, on weekends, in the morning, at 5:00 p.m.</em></li>
                    <li>Describe people: <em>My friend has..., My mother works..., We have...</em></li>
                    <li>Talk about places: <em>I go to..., We stay at..., They work at...</em></li>
                    <li>Express preferences: <em>I like to..., I prefer..., I want to learn...</em></li>
                    <li>Use "some" and "more": <em>I have some friends, I want more juice</em></li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
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
            <p className="text-gray-600">Keep practicing your routine vocabulary!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice time expressions and weekly planning</p>
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
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleSaveProgress}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
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
          <div className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-green-700">
              🌟 Excellent work on your lifestyle vocabulary! 🌟
            </p>
            <p className="text-lg text-gray-600 mt-2">
              You're learning to talk about daily routines, weekly planning, and time expressions in English!
            </p>
            <div className="mt-4 text-sm text-green-600">
              <p>Your progress is automatically saved. Practice regularly to improve!</p>
            </div>
          </div>
        </div>

        {/* Vocabulary Review */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-yellow-300">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center">
            📝 Vocabulary Highlights - Review 4
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">Daily Activities:</span>
              <p className="text-gray-600">do dishes, do laundry, cook, work out, go to bed</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-xl text-center">
              <span className="font-bold text-blue-700">Time Expressions:</span>
              <p className="text-gray-600">every day, on Saturdays, in the morning, at 5:00 p.m., on weekends</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">Food & Drink:</span>
              <p className="text-gray-600">pasta, yogurt, juice, cheese, dinner</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <span className="font-bold text-orange-700">Learning:</span>
              <p className="text-gray-600">know how to, learn, study, subject, geography</p>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-teal-50 p-4 rounded-xl text-center">
              <span className="font-bold text-teal-700">Places:</span>
              <p className="text-gray-600">home, work, university, gym, countryside</p>
            </div>
            <div className="bg-pink-50 p-4 rounded-xl text-center">
              <span className="font-bold text-pink-700">Family:</span>
              <p className="text-gray-600">children, wife, brothers, friend</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl text-center">
              <span className="font-bold text-indigo-700">Quantities:</span>
              <p className="text-gray-600">some, more, five, all day long</p>
            </div>
            <div className="bg-red-50 p-4 rounded-xl text-center">
              <span className="font-bold text-red-700">Negation:</span>
              <p className="text-gray-600">doesn't have, doesn't know, doesn't like, doesn't work</p>
            </div>
          </div>
        </div>

        {/* Time and Days Practice */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            🕒 Time & Days Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Telling Time</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">What time is it?</span>
                  <span className="text-blue-600 font-bold">Que horas são?</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">It's 5:30.</span>
                  <span className="text-blue-600 font-bold">São 5:30.</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">He comes at 10:00 a.m.</span>
                  <span className="text-blue-600 font-bold">Ele vem às 10:00 da manhã.</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">She comes home at 5:00 p.m.</span>
                  <span className="text-blue-600 font-bold">Ela chega em casa às 17:00.</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-200">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Days of the Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">What day is it today?</span>
                  <span className="text-purple-600 font-bold">Que dia é hoje?</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">It's Wednesday.</span>
                  <span className="text-purple-600 font-bold">É quarta-feira.</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">On Saturdays</span>
                  <span className="text-purple-600 font-bold">Aos sábados</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">On weekends</span>
                  <span className="text-purple-600 font-bold">Nos finais de semana</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="font-medium">During the week</span>
                  <span className="text-purple-600 font-bold">Durante a semana</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Practice */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-green-300">
          <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
            🗣️ Conversation Practice Ideas
          </h2>
          <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-700 mb-3">🎯 Practice with a Partner:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-green-600 mb-2">Ask about routines:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• What time do you wake up?</li>
                  <li>• What do you do in the morning?</li>
                  <li>• Do you cook every day?</li>
                  <li>• When do you do laundry?</li>
                  <li>• Do you work out?</li>
                  <li>• What time do you go to bed?</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-green-600 mb-2">Ask about knowledge:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Do you know how to cook?</li>
                  <li>• What languages do you know?</li>
                  <li>• What do you want to learn?</li>
                  <li>• What subjects do you like?</li>
                  <li>• Do you know how to drive?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Data Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your ratings and writing are automatically saved in your browser's local storage.</p>
          <p>You can continue your review anytime by coming back to this page.</p>
        </div>
      </div>
    </div>
  );
}