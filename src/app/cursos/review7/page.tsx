"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'pinpoint' | 'grammar' | 'assessment';

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
    const maxPossible = currentRatings.length * 3;
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

export default function Review7() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  
  // 15 itens de autoavaliação (baseado no conteúdo fornecido)
  const selfAssessmentItems = [
    "name some health problems and symptoms",
    "ask how people are feeling",
    "name some professions",
    "ask someone what their job is",
    "say how I feel using simple words",
    "say my nationality",
    "name the months of the year",
    "ask and say birthdays and ages"
  ];

  // Usando o hook de salvamento
  const {
    ratings,
    updateRating,
    saveProgress,
    clearProgress,
    progress,
    masteryLevel
  } = useReviewSave("review7HealthFeelingsProfessions", [2, 2, 2, 2, 2, 2, 2, 2]);

  const playAudio = (text: string) => {
    console.log("Tentando reproduzir áudio para:", text);
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
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

  // Conteúdo das seções
  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Key Vocabulary from Lessons 37-42",
      content: [
        { category: "Health Problems & Symptoms", items: ["headache", "toothache", "painkillers", "appointment", "doctor"] },
        { category: "Feelings", items: ["tired", "worried", "happy", "sad", "hungry", "thirsty", "busy"] },
        { category: "Professions", items: ["engineer", "nurse", "manager", "salesperson", "designer", "teacher", "boss"] },
        { category: "Months & Dates", items: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
        { category: "Nationalities", items: ["Brazilian", "American", "British", "German", "Italian", "French"] }
      ]
    },
    grammar: {
      title: "📗 LANGUAGE REVIEW (Grammar + Structures)",
      content: {
        affirmative: [
          { english: "I'm her husband.", portuguese: "Eu sou o marido dela." },
          { english: "You're a college student!", portuguese: "Você é um estudante universitário!" },
          { english: "He's my cousin. His name is Jack.", portuguese: "Ele é meu primo. O nome dele é Jack." },
          { english: "Carrie works here. She's a doctor.", portuguese: "Carrie trabalha aqui. Ela é médica." },
          { english: "Morgan and I live together. We're friends.", portuguese: "Morgan e eu moramos juntos. Somos amigos." },
          { english: "They're brother and sister.", portuguese: "Eles são irmão e irmã." },
          { english: "I think I want to be an engineer.", portuguese: "Acho que quero ser engenheiro." }
        ],
        negative: [
          { english: "I'm not her boss.", portuguese: "Eu não sou o chefe dela." },
          { english: "You're not a designer.", portuguese: "Você não é designer." },
          { english: "He's not a sales clerk.", portuguese: "Ele não é vendedor." },
          { english: "She's not sad. She's tired.", portuguese: "Ela não está triste. Ela está cansada." },
          { english: "We're not hungry. We're thirsty.", portuguese: "Não estamos com fome. Estamos com sede." },
          { english: "They're not my children.", portuguese: "Eles não são meus filhos." }
        ],
        yesNoQuestions: [
          { english: "Are you a dentist?", portuguese: "Você é dentista?" },
          { english: "Is he your brother?", portuguese: "Ele é seu irmão?" },
          { english: "Is she a manager at the mall?", portuguese: "Ela é gerente no shopping?" },
          { english: "Is it new?", portuguese: "É novo?" },
          { english: "Are they your relatives?", portuguese: "Eles são seus parentes?" }
        ],
        whQuestions: [
          { english: "Who is that person?", portuguese: "Quem é aquela pessoa?" },
          { english: "Who are you?", portuguese: "Quem é você?" },
          { english: "What do you want to be?", portuguese: "O que você quer ser?" },
          { english: "What do you do?", portuguese: "O que você faz?" },
          { english: "Where is your school?", portuguese: "Onde fica sua escola?" },
          { english: "What time is your class?", portuguese: "Que horas é sua aula?" },
          { english: "How many pills do you need to take?", portuguese: "Quantos comprimidos você precisa tomar?" }
        ],
        demonstratives: [
          { english: "These are my friends Julie and Ryan.", portuguese: "Estes são meus amigos Julie e Ryan." },
          { english: "Those are my funny neighbors.", portuguese: "Aqueles são meus vizinhos engraçados." }
        ],
        still: [
          { english: "I still need to talk to you.", portuguese: "Ainda preciso falar com você." },
          { english: "She is still at the office.", portuguese: "Ela ainda está no escritório." }
        ],
        datesAndAge: [
          { english: "When is your birthday? → It's in May.", portuguese: "Quando é seu aniversário? → É em maio." },
          { english: "How old are you? → I'm 32 years old.", portuguese: "Quantos anos você tem? → Tenho 32 anos." },
          { english: "How old is he? → He's 40 years old.", portuguese: "Quantos anos ele tem? → Ele tem 40 anos." }
        ]
      }
    },
    assessment: {
      title: "🟢 SELF-ASSESSMENT",
      subtitle: "I can… / I'm not sure if I can…",
      content: selfAssessmentItems
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-emerald-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📘 REVIEW 7 – Health, Feelings & Professions
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Review and reinforce what you've learned in Lessons 37-42!
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co/jPzWQkM9/review2-img.jpg"
                alt="Health Feelings Professions Review"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setActiveSection('pinpoint')}
            className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeSection === 'pinpoint'
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📖 PINPOINT
          </button>
          <button
            onClick={() => setActiveSection('grammar')}
            className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeSection === 'grammar'
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📗 GRAMMAR REVIEW
          </button>
          <button
            onClick={() => setActiveSection('assessment')}
            className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
              activeSection === 'assessment'
                ? 'bg-emerald-500 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🟢 SELF-ASSESSMENT
          </button>
        </div>

        {/* PINPOINT Section */}
        {activeSection === 'pinpoint' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-emerald-200">
            <h2 className="text-3xl font-bold text-emerald-600 mb-6 text-center">
              📖 PINPOINT - Key Vocabulary from Lessons 37-42
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sections.pinpoint.content.map((category, idx) => (
                <div key={idx} className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl shadow-lg border-2 border-emerald-200">
                  <h3 className="text-xl font-bold text-emerald-700 mb-3">{category.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, i) => (
                      <span key={i} className="bg-white px-3 py-1 rounded-full text-emerald-600 font-medium shadow-sm">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Months Grid */}
            <div className="mt-8 bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl shadow-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-blue-700 mb-3 text-center">📅 Months of the Year</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, i) => (
                  <div key={i} className="bg-white text-center py-2 rounded-lg text-blue-600 font-medium shadow-sm">
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GRAMMAR REVIEW Section */}
        {activeSection === 'grammar' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-indigo-200">
            <h2 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
              📗 LANGUAGE REVIEW (Grammar + Structures)
            </h2>
            
            {/* Affirmative Sentences */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-green-600 mb-4 flex items-center gap-2">
                <span>✅</span> Affirmative Sentences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.affirmative.map((item, idx) => (
                  <div key={idx} className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <button onClick={() => playAudio(item.english)} className="text-green-600 hover:text-green-800 mr-2">🔊</button>
                    <span className="font-bold text-green-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Negative Sentences */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                <span>❌</span> Negative Sentences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.negative.map((item, idx) => (
                  <div key={idx} className="bg-red-50 p-4 rounded-xl border border-red-200">
                    <button onClick={() => playAudio(item.english)} className="text-red-600 hover:text-red-800 mr-2">🔊</button>
                    <span className="font-bold text-red-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Yes/No Questions */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-blue-600 mb-4 flex items-center gap-2">
                <span>❓</span> Yes/No Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.yesNoQuestions.map((item, idx) => (
                  <div key={idx} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <button onClick={() => playAudio(item.english)} className="text-blue-600 hover:text-blue-800 mr-2">🔊</button>
                    <span className="font-bold text-blue-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* WH-Questions */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-purple-600 mb-4 flex items-center gap-2">
                <span>❓</span> Information Questions (WH-)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.whQuestions.map((item, idx) => (
                  <div key={idx} className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                    <button onClick={() => playAudio(item.english)} className="text-purple-600 hover:text-purple-800 mr-2">🔊</button>
                    <span className="font-bold text-purple-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Demonstratives */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-yellow-600 mb-4 flex items-center gap-2">
                <span>👉</span> Demonstratives
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.demonstratives.map((item, idx) => (
                  <div key={idx} className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                    <button onClick={() => playAudio(item.english)} className="text-yellow-600 hover:text-yellow-800 mr-2">🔊</button>
                    <span className="font-bold text-yellow-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Use of "Still" */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                <span>⏳</span> Use of "Still"
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.still.map((item, idx) => (
                  <div key={idx} className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                    <button onClick={() => playAudio(item.english)} className="text-orange-600 hover:text-orange-800 mr-2">🔊</button>
                    <span className="font-bold text-orange-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates and Age */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-pink-600 mb-4 flex items-center gap-2">
                <span>🎂</span> Dates and Age
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.grammar.content.datesAndAge.map((item, idx) => (
                  <div key={idx} className="bg-pink-50 p-4 rounded-xl border border-pink-200">
                    <button onClick={() => playAudio(item.english)} className="text-pink-600 hover:text-pink-800 mr-2">🔊</button>
                    <span className="font-bold text-pink-800">{item.english}</span>
                    <p className="text-gray-600 text-sm mt-1">{item.portuguese}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SELF-ASSESSMENT Section */}
        {activeSection === 'assessment' && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-teal-200">
            <h2 className="text-3xl font-bold text-teal-600 mb-2 text-center">
              🟢 SELF-ASSESSMENT
            </h2>
            <p className="text-center text-gray-500 mb-8 text-lg">
              I can… / I'm not sure if I can…
            </p>
            
            <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200">
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg text-teal-700">
                  <strong>I can... (Eu consigo...)</strong>
                </p>
                <div className="text-sm text-teal-600 bg-teal-100 px-3 py-1 rounded-full">
                  Auto-save enabled
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.assessment.content.map((item, index) => (
                  <div key={index} className="bg-white p-6 rounded-xl border-2 border-teal-100 shadow-sm">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <span className="text-teal-800 font-medium">{item}</span>
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
                              aria-label={`Rate ${rating} for "${item}"`}
                            >
                              {ratings[index] === rating && (
                                <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                  {rating === 1 ? '?' : rating === 2 ? '✓' : '✓✓'}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                        
                        <div className="text-sm text-gray-500 font-medium">
                          {ratings[index] === 1 && 'Not yet'}
                          {ratings[index] === 2 && 'I can'}
                          {ratings[index] === 3 && 'Very well'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-teal-100 to-emerald-100 border-2 border-teal-400 rounded-xl p-6">
                <div className="text-center mb-4">
                  <p className="text-teal-800 font-bold text-lg">
                    🎯 Rating Guide
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                    <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-red-700 font-medium text-sm">1 - Not yet</span>
                    <p className="text-xs text-red-600">Not confident</p>
                  </div>
                  <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                    <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-yellow-700 font-medium text-sm">2 - I can</span>
                    <p className="text-xs text-yellow-600">Confident</p>
                  </div>
                  <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                    <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
                    <span className="text-green-700 font-medium text-sm">3 - Very well</span>
                    <p className="text-xs text-green-600">Very confident</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-emerald-300 text-center">
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

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-teal-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-teal-600">{masteryLevel}</div>
            <p className="text-gray-600">Keep improving!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-cyan-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice real conversations about health and work</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson37")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Back to Lesson 37
          </button>
          <button
            onClick={handleSaveProgress}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Save Progress 💾
          </button>
          <button
            onClick={handleClearProgress}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-base"
          >
            Clear All
          </button>
          <button
            onClick={() => router.push("/cursos/lesson43")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 border-4 border-emerald-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-emerald-700">
              🌟 Fantastic work! You're mastering Health, Feelings & Professions! 🌟
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Keep practicing to become fluent in conversations about health, work, and daily life!
            </p>
            <div className="mt-4 text-sm text-emerald-600">
              <p>Your progress is automatically saved. You can continue anytime!</p>
            </div>
          </div>
        </div>

        {/* Quick Reference Cards */}
        <div className="mt-8 bg-white rounded-3xl shadow-lg p-8 border-4 border-amber-300">
          <h2 className="text-3xl font-bold text-amber-600 mb-6 text-center">
            📝 Quick Reference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 p-4 rounded-xl text-center">
              <span className="font-bold text-amber-700">🤒 Health Problems:</span>
              <p className="text-gray-600">headache, toothache, fever, cough, cold</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <span className="font-bold text-green-700">😊 Feelings:</span>
              <p className="text-gray-600">happy, sad, tired, worried, hungry, thirsty</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl text-center">
              <span className="font-bold text-purple-700">💼 Professions:</span>
              <p className="text-gray-600">doctor, nurse, engineer, teacher, manager</p>
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