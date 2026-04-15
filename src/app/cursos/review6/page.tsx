"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'pinpoint' | 'assessment' | 'writing';

export default function ReviewLessonSix() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  const [showTranslationAnswers, setShowTranslationAnswers] = useState(false);
  const [userTranslations, setUserTranslations] = useState<{ [key: string]: string }>({});

  const playAudio = (text: string) => {
    console.log("Reproduzindo áudio para:", text);
    // Using browser speech synthesis for natural TTS since we don't have MP3s for this lesson
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.cancel(); // Clear any ongoing speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Speech synthesis not supported");
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

  // Translation prompts (Portuguese -> English)
  const translationPrompts = [
    { id: "q1", pt: "O que você precisa começar hoje?", en: "What do you need to start today?" },
    { id: "q2", pt: "Você termina a faculdade / ensino médio este ano?", en: "Do you finish college / high school this year?" },
    { id: "q3", pt: "Você tem muitos projetos no trabalho / na escola?", en: "Do you have many projects at work / at school?" },
    { id: "q4", pt: "Quando você faz sua lição de casa?", en: "When do you do your homework?" },
    { id: "q5", pt: "O que você quer estudar na faculdade?", en: "What do you want to study in college?" },
    { id: "q6", pt: "Você tem um minuto para conversar comigo?", en: "Do you have a minute to talk to me?" },
    { id: "q7", pt: "Seu pai sabe tudo sobre esportes?", en: "Does your father know everything about sports?" },
    { id: "q8", pt: "Quando sua reunião começa?", en: "When does your meeting start?" },
    { id: "q9", pt: "Por que você quer aprender inglês?", en: "Why do you want to learn English?" },
    { id: "q10", pt: "Com licença, eu posso entrar?", en: "Excuse me, can I come in?" },
    { id: "q11", pt: "Sua amiga gosta de falar sobre moda?", en: "Does your friend like to talk about fashion?" },
    { id: "q12", pt: "O que você geralmente assiste no seu celular?", en: "What do you usually watch on your phone?" },
    { id: "q13", pt: "Por que você quer assistir este filme?", en: "Why do you want to watch this movie?" },
    { id: "q14", pt: "Ele mora com os pais dele?", en: "Does he live with his parents?" },
    { id: "q15", pt: "O que você pensa sobre a ideia dela?", en: "What do you think about her idea?" },
    { id: "q16", pt: "Vocês querem encontrar seus amigos hoje à noite?", en: "Do you want to meet your friends tonight?" },
    { id: "q17", pt: "A que horas sua aula começa?", en: "What time does your class start?" },
    { id: "q18", pt: "O que significa 'hard'?", en: "What does 'hard' mean?" },
    { id: "q19", pt: "Como se diz 'redação' em inglês?", en: "How do you say 'redação' in English?" },
    { id: "q20", pt: "Por que você precisa ir para casa agora?", en: "Why do you need to go home now?" },
  ];

  const ainTranslationPrompts = [
    { pt: "Eu não vou hoje", en: "I ain't going today" },
    { pt: "Ele não tem tempo", en: "He ain't got time" },
    { pt: "Nós não estamos estudando", en: "We ain't studying" },
    { pt: "Isso não é bom", en: "This ain't good" },
    { pt: "Eu não estou trabalhando hoje", en: "I ain't working today" },
    { pt: "Ela não está falando comigo", en: "She ain't talking to me" },
  ];

  const writingExercises = [
    { subject: "She works in a hospital. She helps people.", answer: "She ain't working today." },
    { subject: "He uses his phone a lot. He likes technology.", answer: "He ain't using his phone now." },
    { subject: "He works in a restaurant. He serves food.", answer: "He ain't working tonight." },
    { subject: "She works with tools. She builds things.", answer: "She ain't working this week." },
  ];

  const mixedSentences = [
    { formal: "I need to start my project this week.", informal: "I ain't starting my project this week." },
    { formal: "You have to finish this task before lunch.", informal: "You ain't finishing this today." },
    { formal: "We like to talk about a lot of subjects.", informal: "We ain't talking about that subject." },
    { formal: "They want to write a book about politics.", informal: "They ain't writing any book." },
    { formal: "We don't start high school this semester.", informal: "We ain't starting this semester." },
    { formal: "I don't think it's a good idea.", informal: "This ain't a good idea." },
    { formal: "They don't watch TV series.", informal: "We ain't watching TV tonight." },
    { formal: "Do you want to study music?", informal: "You ain't studying today, right?" },
    { formal: "Do they have a deadline?", informal: "They ain't got a deadline." },
    { formal: "Do we need to go to this business meeting?", informal: "I ain't going to that meeting." },
    { formal: "He thinks I have to go to college this semester.", informal: "He ain't studying this semester." },
    { formal: "She talks to her friends every day.", informal: "She ain't talking today." },
    { formal: "It starts next week.", informal: "It ain't starting this week." },
    { formal: "She doesn't have an opinion about this subject.", informal: "I ain't got no opinion about that." },
    { formal: "He doesn't write about religion in his books.", informal: "He ain't writing about that." },
    { formal: "The meeting doesn't start at 9:00 AM.", informal: "The meeting ain't starting at 9:00 AM." },
    { formal: "Does he want to talk to you?", informal: "He ain't talking to me." },
    { formal: "Does she need to study for the exams?", informal: "She ain't studying for the exams." },
  ];

  const extraAintUsage = [
    "I ain't meeting them today.",
    "We ain't going this afternoon.",
    "She ain't starting the course tonight.",
    "He ain't got any idea about it.",
    "They ain't ready yet.",
    "That ain't your problem.",
    "I ain't got time today.",
    "He ain't working this week.",
  ];

  const dailyLifeExpressions = [
    { formal: "It's easy to learn a new language.", informal: "It ain't easy sometimes, but it's possible." },
    { formal: "It's hard to understand science.", informal: "It ain't that hard if you practice." },
    { formal: "We need to meet this morning to talk about the project.", informal: "I ain't meeting them this morning." },
    { formal: "Let's meet at the coffee shop this afternoon.", informal: "We ain't going this afternoon." },
    { formal: "My English course starts this evening.", informal: "It ain't starting today." },
    { formal: "Let's go to a restaurant tonight.", informal: "I ain't going out tonight." },
    { formal: "The meeting starts in twenty minutes.", informal: "The meeting ain't starting now." },
    { formal: "I like the idea, but I don't have an opinion about it.", informal: "I like the idea, but I ain't got an opinion about it." },
  ];

  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Mixed Sentences & AIN'T Usage",
      content: mixedSentences
    },
    assessment: {
      title: "📊 Self-Assessment - Points, Ideas & Opinions",
      content: [
        "give examples of words related to education.",
        "name periods of time (morning, evening, etc.).",
        "give topics I talk about with friends.",
        "create sentences expressing my opinion.",
        "ask and answer 'why' questions.",
        "use 'ain't' naturally in conversation.",
        "understand the difference between formal and informal English.",
      ]
    },
    writing: {
      title: "✍️ WRITING - There and Around (Professions)",
      content: writingExercises
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📖 REVIEW 6 – Points, Ideas & Opinions
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Practice formal & informal English • Master "AIN'T" • Express Your Opinions
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
                alt="Review Six - Discussion and Ideas"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200">
          
          {/* PINPOINT Section - Mixed Sentences */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                🗣️ Formal ↔ Informal (Mixed Sentences)
              </h2>
              
              {/* Mixed Sentences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 p-5 rounded-2xl shadow-lg border-2 border-purple-200">
                    <div className="flex items-start space-x-3">
                      <button 
                        onClick={() => playAudio(item.formal)}
                        className="flex-shrink-0 text-purple-600 hover:text-purple-800 transition-colors mt-1"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <div className="flex-1">
                        <div className="text-base font-semibold text-gray-600 mb-1">📝 Formal:</div>
                        <div className="text-lg font-bold text-blue-700 mb-2">{item.formal}</div>
                        <div className="text-base font-semibold text-gray-600 mb-1">💬 Informal (Ain't):</div>
                        <div className="text-lg font-bold text-purple-700">{item.informal}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Extra AIN'T Usage */}
              <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-yellow-400">
                <h3 className="text-2xl font-bold text-yellow-800 mb-4 text-center">🔥 EXTRA – Natural AIN'T Usage (BOOST)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {extraAintUsage.map((phrase, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-white rounded-lg p-3 shadow-sm">
                      <button onClick={() => playAudio(phrase)} className="text-yellow-600 hover:text-yellow-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                      </button>
                      <span className="text-gray-800 font-medium">{phrase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Life Expressions */}
              <div className="mt-8 bg-gradient-to-r from-green-100 to-teal-100 rounded-2xl p-6 border-2 border-green-400">
                <h3 className="text-2xl font-bold text-green-800 mb-4 text-center">💬 Daily Life Expressions</h3>
                <div className="grid grid-cols-1 gap-4">
                  {dailyLifeExpressions.map((expr, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                      <div className="flex items-start space-x-3">
                        <button onClick={() => playAudio(expr.formal)} className="text-green-600 hover:text-green-800 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div className="flex-1">
                          <div className="text-gray-700">{expr.formal}</div>
                          <div className="text-purple-700 font-semibold mt-1">→ {expr.informal}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                📊 Self-Assessment
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
                                aria-label={`Rate ${rating}`}
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

              {/* Questions & Answers Section */}
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">❓ Questions & Answers</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4">
                    <p className="font-semibold text-gray-700">When does it finish?</p>
                    <p className="text-blue-600 mt-1">→ Why do you study business? → Because I want to work at a big company.</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="font-semibold text-gray-700">Why does your father study English?</p>
                    <p className="text-blue-600 mt-1">→ Because he knows it's important.</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="font-semibold text-gray-700">Why do you want to study fashion?</p>
                    <p className="text-blue-600 mt-1">→ Because I like this course.</p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                    <p className="font-semibold text-purple-700">💬 Informal Responses:</p>
                    <p className="text-purple-600 mt-1">→ Because I ain't got many opportunities without English.</p>
                    <p className="text-purple-600 mt-1">→ Because I ain't working in my dream job yet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Writing Section */}
          {activeSection === 'writing' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                ✍️ Writing – There and Around (Professions)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.writing.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-2xl shadow-lg border-2 border-indigo-200">
                    <div className="text-lg font-bold text-indigo-800 mb-3">{item.subject}</div>
                    <div className="bg-white rounded-xl p-4 border-2 border-indigo-300">
                      <p className="text-purple-700 font-semibold">✍️ Write: She/He ___ working today/now/tonight/this week.</p>
                      <div className="mt-3 text-green-700 font-bold">✓ Example: {item.answer}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Translation Practice */}
              <div className="mt-8 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-2xl p-6 border-2 border-teal-400">
                <h3 className="text-2xl font-bold text-teal-800 mb-4 text-center">🟡 TRANSLATION (Portuguese → English)</h3>
                <div className="flex justify-center mb-4">
                  <button
                    onClick={() => setShowTranslationAnswers(!showTranslationAnswers)}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
                  >
                    {showTranslationAnswers ? "Hide Answers" : "Show Answers"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {translationPrompts.map((prompt) => (
                    <div key={prompt.id} className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="font-semibold text-gray-800">{prompt.pt}</p>
                      {showTranslationAnswers && (
                        <p className="text-teal-600 mt-2 font-medium">→ {prompt.en}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* AIN'T Translation Practice */}
              <div className="mt-8 bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl p-6 border-2 border-pink-400">
                <h3 className="text-2xl font-bold text-pink-800 mb-4 text-center">🔥 AIN'T – Translation Practice</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ainTranslationPrompts.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
                      <span className="font-semibold text-gray-800">{item.pt}</span>
                      <span className="text-pink-600 font-bold">→ {item.en}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Tip */}
              <div className="mt-8 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-6 border-2 border-yellow-500 text-center">
                <h3 className="text-2xl font-bold text-yellow-800 mb-3">🚀 FINAL TIP (IMPORTANT)</h3>
                <p className="text-lg text-gray-800 mb-2">👉 Inglês real mistura os dois:</p>
                <div className="flex justify-center gap-8 my-4">
                  <span className="bg-white px-4 py-2 rounded-lg shadow font-semibold text-blue-600">Formal: I am not going</span>
                  <span className="bg-white px-4 py-2 rounded-lg shadow font-semibold text-purple-600">Natural: I ain't going</span>
                </div>
                <p className="text-xl font-bold text-yellow-700">👉 Dominar os dois = fluência de verdade</p>
              </div>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-300 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div className="bg-green-500 h-4 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-gray-600">90% Complete</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-pink-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-purple-600">Advanced</div>
            <p className="text-gray-600">Excellent progress!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">Practice using "ain't" naturally</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => router.push("/cursos/lesson35")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Previous Lesson
          </button>
          <button
            onClick={() => {
              const data = {
                ratings,
                lastUpdated: new Date().toISOString(),
                review: "Review 6 - Points, Ideas & Opinions"
              };
              localStorage.setItem("review6Progress", JSON.stringify(data));
              alert("✅ Progress saved successfully!");
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Save Progress 💾
          </button>
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-purple-100 border-4 border-purple-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-purple-700">
              🎉 Great job! You're mastering formal & informal English with AIN'T! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}