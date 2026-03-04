"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson31StartFinish() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showNegativeExplanation, setShowNegativeExplanation] = useState(false);
  const [showQuestionsExplanation, setShowQuestionsExplanation] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\s-]/g, '')
      .replace(/'/g, '')
      .trim();
    
    console.log('Trying to play audio:', `/audios/${formattedText}.mp3`);
    
    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch(e => console.error("Error playing audio:", e));
  };

  // Image URLs
  const mainImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const collegeImage = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const projectImage = "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const meetingImage = "https://images.unsplash.com/photo-1517048676738-d65ab93716d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const deadlineImage = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage = "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 31 data
  const verbs = [
    { english: "to start", portuguese: "começar" },
    { english: "to finish", portuguese: "terminar" }
  ];

  const newWords = [
    { english: "project", portuguese: "projeto" },
    { english: "college", portuguese: "faculdade" },
    { english: "high school", portuguese: "ensino médio" },
    { english: "course", portuguese: "curso" },
    { english: "task", portuguese: "tarefa" },
    { english: "meeting", portuguese: "reunião" },
    { english: "exam", portuguese: "prova" },
    { english: "business", portuguese: "negócios" },
    { english: "semester", portuguese: "semestre" },
    { english: "hour", portuguese: "hora" },
    { english: "minute", portuguese: "minuto" },
    { english: "deadline", portuguese: "prazo" },
    { english: "next", portuguese: "próximo" },
    { english: "everything", portuguese: "tudo" },
    { english: "great", portuguese: "ótimo" }
  ];

  const usefulPhrases = [
    { english: "I start a new course this morning.", portuguese: "Eu começo um novo curso hoje de manhã." },
    { english: "I do my homework on weekends.", portuguese: "Eu faço minha lição de casa nos fins de semana." },
    { english: "Let's start!", portuguese: "Vamos começar!" }
  ];

  const grammarExamples = [
    { english: "I want to start college this year.", portuguese: "Eu quero começar a faculdade este ano." },
    { english: "We have to start the meeting now.", portuguese: "Nós temos que começar a reunião agora." },
    { english: "They want to start the course next semester.", portuguese: "Eles querem começar o curso no próximo semestre." },
    { english: "I don't want to study business in college.", portuguese: "Eu não quero estudar negócios na faculdade." },
    { english: "They don't need to start the project this week.", portuguese: "Eles não precisam começar o projeto esta semana." },
    { english: "Do you have a minute?", portuguese: "Você tem um minuto?" }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I want to start a new course.", portuguese: "Eu quero começar um novo curso." },
    { english: "She needs to finish the project today.", portuguese: "Ela precisa terminar o projeto hoje." },
    { english: "He has to study for the exam.", portuguese: "Ele tem que estudar para a prova." },
    { english: "We don't want to start this task now.", portuguese: "Nós não queremos começar esta tarefa agora." },
    { english: "They don't need to finish this week.", portuguese: "Eles não precisam terminar esta semana." },
    { english: "Do you have a deadline?", portuguese: "Você tem um prazo?" },
    { english: "Does she start high school next year?", portuguese: "Ela começa o ensino médio no próximo ano?" },
    { english: "What time do you finish work?", portuguese: "Que horas você termina o trabalho?" },
    { english: "When does the meeting start?", portuguese: "Quando começa a reunião?" },
    { english: "Everything is great!", portuguese: "Está tudo ótimo!" }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            ⏰ Lesson 31 - START / FINISH
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about beginnings, endings, deadlines, and daily schedules.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Starting and finishing tasks"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Verbs</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e praticar suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(verb.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {verb.english}
                  </button> = {verb.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('start')}>start</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I start')}>I start</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You start')}>You start</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We start')}>We start</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 começar / eu começo / você começa / nós começamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to start')}>I want to start</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to start')}>need</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have to start')}>have to</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu quero começar / eu preciso começar / eu tenho que começar</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When do you start')}>When do you start</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does he start')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('When does she start')}>she</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 quando você começa? / quando ele começa? / quando ela começa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('finish')}>finish</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I finish')}>I finish</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You finish')}>You finish</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They finish')}>They finish</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 terminar / eu termino / você termina / eles terminam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I finish college this year')}>I finish college this year</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I finish high school this year')}>high school</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I finish the course this year')}>the course</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu termino a faculdade este ano / o ensino médio / o curso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you finish at five')}>Do you finish at five</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does he finish at five')}>Does he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Does she finish at five')}>Does she</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você termina às cinco? / ele termina? / ela termina?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time do you finish')}>What time do you finish</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time does he finish')}>he</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What time does she finish')}>she</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 que horas você termina? / ele termina? / ela termina?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do not start today')}>I do not start today</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You do not start today')}>You</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They do not start today')}>They</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu não começo hoje / você não começa / eles não começam</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not finish today')}>He does not finish today</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not finish tomorrow')}>tomorrow</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He does not finish this week')}>this week</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ele não termina hoje / amanhã / esta semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to start now')}>Do you want to start now</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to finish now')}>finish</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you want to study now')}>study</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você quer começar agora? / terminar? / estudar?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 New Words</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWords.map((word, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {word.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">{word.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I start college this year')}>I start college this year</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I start high school this year')}>high school</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I start a course this year')}>a course</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu começo a faculdade este ano / o ensino médio / um curso</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We have a meeting')}>We have a meeting</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We have a project')}>a project</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We have a task')}>a task</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós temos uma reunião / um projeto / uma tarefa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('The exam is next week')}>The exam is next week</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('The exam is next month')}>next month</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('The exam is next semester')}>next semester</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 a prova é na próxima semana / no próximo mês / no próximo semestre</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have one hour')}>I have one hour</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have one minute')}>one minute</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I have a deadline')}>a deadline</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu tenho uma hora / um minuto / um prazo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to study business')}>I want to study business</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to study everything')}>everything</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('That is great')}>That is great</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu quero estudar negócios / tudo / isso é ótimo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a deadline this week')}>Do you have a deadline this week</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a meeting this week')}>a meeting</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have an exam this week')}>an exam</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você tem um prazo esta semana? / uma reunião? / uma prova?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We need to finish the project')}>We need to finish the project</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We need to finish the task')}>the task</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We need to finish the course')}>the course</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós precisamos terminar o projeto / a tarefa / o curso</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Useful Phrases</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre começos e finais
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-lg mb-2"
                  >
                    {phrase.english}
                  </button>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I start a new course this morning')}>I start a new course this morning</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu começo um novo curso hoje de manhã.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I do my homework on weekends')}>I do my homework on weekends</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Eu faço minha lição de casa nos fins de semana.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Let us start')}>Let's start</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Vamos começar!</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have to go downtown this morning')}>Do you have to go downtown this morning</span>?</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Você tem que ir ao centro hoje de manhã?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Let us finish')}>Let's finish</span>! / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Let us study')}>Let's study</span>!</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 Vamos terminar! / Vamos estudar!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 Grammar</h2>
              <p className="mt-2 text-blue-100 italic">
                Want to / Need to / Have to + verb
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Hide Practice' : 'Show Practice'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {example.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">{example.portuguese}</div>
                </div>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I really want to study business')}>I really want to study business</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I really want to study math')}>math</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I really want to study geography')}>geography</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu realmente quero estudar negócios / matemática / geografia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not want to start this task')}>We do not want to start this task</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not want to start next week')}>next week</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We do not want to start next month')}>next month</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 nós não queremos começar esta tarefa / na próxima semana / no próximo mês</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do you have a minute')}>Do you have a minute</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do they have a minute')}>they</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Do we have a minute')}>we</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 você tem um minuto? / eles têm? / nós temos?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to study for an exam')}>I need to study for an exam</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to study for a test')}>a test</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I need to study for a project')}>a project</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eu preciso estudar para uma prova / um teste / um projeto</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She wants to start the course')}>She wants to start the course</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She wants to finish the course')}>finish</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She wants to take the course')}>take</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 ela quer começar o curso / terminar / fazer</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They have to finish the project')}>They have to finish the project</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They have to start the project')}>start</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They have to present the project')}>present</span>.</p>
                  <p className="text-sm text-gray-500 mt-1">🇧🇷 eles têm que terminar o projeto / começar / apresentar</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 Real Life Practice</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratique situações reais sobre começos, finais, prazos e estudos
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <div>
                          <p className="text-lg font-medium">
                            {index + 1}. {sentence.english}
                          </p>
                          <p className="text-sm text-gray-600">{sentence.portuguese}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={collegeImage}
                        alt="College and education"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Starting college or courses
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={meetingImage}
                        alt="Business meeting"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Meetings and deadlines
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={deadlineImage}
                        alt="Deadline and planning"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Projects and tasks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out! (print style) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Time Expressions & Question Patterns
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Time Expressions */}
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">TIME EXPRESSIONS</h3>
                  <button 
                    onClick={() => setShowNegativeExplanation(!showNegativeExplanation)}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNegativeExplanation ? 'Hide Explanation' : 'Show Explanation'}
                  </button>
                </div>
                {showNegativeExplanation && (
                  <div className="mb-4 p-4 bg-green-700 rounded-lg border border-green-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">⏱️ Expressões de Tempo:</p>
                    <ul className="text-green-200 text-sm list-disc pl-4 space-y-1">
                      <li>in a minute = em um minuto</li>
                      <li>in an hour = em uma hora</li>
                      <li>in five minutes = em cinco minutos</li>
                      <li>in two hours = em duas horas</li>
                      <li>next = próximo(a) (next week, next month)</li>
                      <li>this = este/esta (this year, this week)</li>
                    </ul>
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">in a minute</p>
                    <p className="text-green-200 text-sm">em um minuto</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">in an hour</p>
                    <p className="text-green-200 text-sm">em uma hora</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">in five minutes</p>
                    <p className="text-green-200 text-sm">em cinco minutos</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">in two hours</p>
                    <p className="text-green-200 text-sm">em duas horas</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">I'll start in a minute.</p>
                    <p className="text-green-200 text-sm">Eu começo em um minuto.</p>
                  </div>
                  
                  <div className="p-3 bg-green-700 rounded-lg">
                    <p className="font-bold text-lg">We finish in two hours.</p>
                    <p className="text-green-200 text-sm">Nós terminamos em duas horas.</p>
                  </div>
                </div>
              </div>

              {/* Image for time expressions */}
              <div className="mt-6 pt-6 border-t border-green-600">
                <div className="bg-green-700 rounded-lg overflow-hidden">
                  <img
                    src={projectImage}
                    alt="Time management"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">⏰ Talking About Time</p>
                    <p className="text-green-200 text-xs">in a minute, in an hour, next week</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Question Patterns */}
            <div className="bg-red-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">QUESTION PATTERNS</h3>
                    <button 
                      onClick={() => setShowQuestionsExplanation(!showQuestionsExplanation)}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showQuestionsExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  {showQuestionsExplanation && (
                    <div className="mb-4 p-4 bg-red-700 rounded-lg border border-red-600">
                      <p className="text-yellow-200 text-sm font-medium mb-2">❓ Padrões de Perguntas:</p>
                      <ul className="text-red-200 text-sm list-disc pl-4 space-y-1">
                        <li>What do you...? = O que você...?</li>
                        <li>When do they...? = Quando eles...?</li>
                        <li>Where do we...? = Onde nós...?</li>
                        <li>What time do you...? = Que horas você...?</li>
                        <li>Sempre usar do/does para perguntas</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">What do you want to study?</p>
                      <p className="text-red-200 text-sm">O que você quer estudar?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">When do they start?</p>
                      <p className="text-red-200 text-sm">Quando eles começam?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">Where do we have the meeting?</p>
                      <p className="text-red-200 text-sm">Onde nós temos a reunião?</p>
                    </div>
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold text-lg">What time do you finish?</p>
                      <p className="text-red-200 text-sm">Que horas você termina?</p>
                    </div>
                  </div>
                </div>
                
                {/* Meeting Expressions */}
                <div className="pt-6 border-t border-red-600">
                  <h4 className="font-bold text-lg text-yellow-300 mb-3">MEETING EXPRESSIONS</h4>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">to go to the meeting</p>
                      <p className="text-red-200 text-sm">ir para a reunião</p>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">to speak at the meeting</p>
                      <p className="text-red-200 text-sm">falar na reunião</p>
                    </div>
                    
                    <div className="p-3 bg-red-700 rounded-lg">
                      <p className="font-bold">I need to study for an exam.</p>
                      <p className="text-red-200 text-sm">Eu preciso estudar para uma prova.</p>
                    </div>
                  </div>
                </div>
                
                {/* Polite Interaction */}
                <div className="mt-6 pt-6 border-t border-red-600">
                  <div className="p-4 bg-red-700 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">💬 POLITE INTERACTION</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Excuse me! May I come in?</p>
                        <p className="text-red-200 text-sm">Com licença! Posso entrar?</p>
                      </div>
                      <div className="p-3 bg-red-800 rounded">
                        <p className="font-medium">Sure! Come in!</p>
                        <p className="text-red-200 text-sm">Claro! Entre!</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-red-900 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">🎯 Mini Speaking Practice:</h6>
                      <div className="flex items-start mb-2">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">When do you start work?</span></p>
                          <p className="text-red-200 text-xs">Answer: I start at 9 AM.</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div>
                          <p className="font-medium text-sm">Ask: <span className="text-yellow-200">Do you have a deadline?</span></p>
                          <p className="text-red-200 text-xs">Answer: Yes, I do. / No, I don't.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image for grammar */}
              <div className="mt-6 pt-6 border-t border-red-600">
                <div className="bg-red-700 rounded-lg overflow-hidden">
                  <img
                    src={grammarImage}
                    alt="Grammar practice"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">📚 Question Patterns</p>
                    <p className="text-red-200 text-xs">What, When, Where, What time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final Activity - Speaking */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 FINAL ACTIVITY - SPEAKING</h2>
            <p className="mt-2 text-blue-100 italic">
              Responda em inglês:
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-8">
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 1. When do you start work or school?</p>
                  <p className="text-gray-600 mt-2">I start at _______ . / I start on _______ .</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 2. What do you want to study?</p>
                  <p className="text-gray-600 mt-2">I want to study _______ .</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 3. Do you have a deadline this week?</p>
                  <p className="text-gray-600 mt-2">Yes, I do. / No, I don't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 4. Do you have a meeting today?</p>
                  <p className="text-gray-600 mt-2">Yes, I do. / No, I don't.</p>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-xl font-bold text-blue-800">🗣️ 5. What do you want to start this year?</p>
                  <p className="text-gray-600 mt-2">I want to start _______ .</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson30")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (30)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson32")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (32) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}