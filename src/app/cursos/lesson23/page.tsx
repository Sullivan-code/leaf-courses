"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson23LifestyleWeeklyPlanning() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showPronounExplanation, setShowPronounExplanation] = useState(false);
  const [showSubjectExplanation, setShowSubjectExplanation] = useState(false);
  const [showVerbConjugation, setShowVerbConjugation] = useState(false);

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

  // Image URLs (using Unsplash/Pexels for studying and university)
  const mainImage = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const studyGroupImage = "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const universityImage = "https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const gymImage = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const cookingImage = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const calendarImage = "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const subjectsImage = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 23 data
  const verbs = [
    { english: "to know", portuguese: "saber, conhecer" },
    { english: "to learn", portuguese: "aprender" }
  ];

  const newWords = [
    { english: "subject", portuguese: "assunto, matéria" },
    { english: "biology", portuguese: "biologia" },
    { english: "geography", portuguese: "geografia" },
    { english: "math", portuguese: "matemática" },
    { english: "university", portuguese: "universidade" },
    { english: "gym", portuguese: "academia" },
    { english: "cooking", portuguese: "culinária" },
    { english: "month", portuguese: "mês" },
    { english: "year", portuguese: "ano" },
    { english: "boyfriend", portuguese: "namorado" },
    { english: "girlfriend", portuguese: "namorada" },
    { english: "more", portuguese: "mais" },
    { english: "only", portuguese: "só, somente, apenas" },
    { english: "about", portuguese: "sobre, aproximadamente" }
  ];

  const usefulPhrases = [
    { english: "They stay home all day long.", portuguese: "Eles ficam em casa o dia todo." },
    { english: "I don't work out on weekends.", portuguese: "Eu não faço exercícios nos fins de semana." }
  ];

  const grammarExamples = [
    { english: "He doesn't study biology here.", portuguese: "Ele não estuda biologia aqui." },
    { english: "She doesn't know this word in French.", portuguese: "Ela não sabe essa palavra em francês." },
    { english: "She doesn't have cooking class on Tuesdays.", portuguese: "Ela não tem aula de culinária às terças-feiras." },
    { english: "My boyfriend doesn't come here every day.", portuguese: "Meu namorado não vem aqui todos os dias." },
    { english: "I know how to speak English very well.", portuguese: "Eu sei falar inglês muito bem." },
    { english: "Do you know how to speak Italian?", portuguese: "Você sabe falar italiano?" }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "He wants to know more about this subject.", portuguese: "Ele quer saber mais sobre esta matéria." },
    { english: "He studies biology at the university.", portuguese: "Ele estuda biologia na universidade." },
    { english: "Do you know how to go to the university alone?", portuguese: "Você sabe ir para a universidade sozinho?" },
    { english: "I really want to learn how to cook well.", portuguese: "Eu realmente quero aprender a cozinhar bem." },
    { english: "What do you want to learn this year?", portuguese: "O que você quer aprender este ano?" },
    { english: "She learns Italian at Wizard.", portuguese: "Ela aprende italiano na Wizard." },
    { english: "He sometimes studies all day long.", portuguese: "Ele às vezes estuda o dia todo." },
    { english: "We only work out in the evening.", portuguese: "Nós só fazemos exercícios à noite." },
    { english: "She doesn't get up early on Saturdays.", portuguese: "Ela não acorda cedo aos sábados." },
    { english: "He doesn't want to go to France this month.", portuguese: "Ele não quer ir para a França este mês." }
  ];

  // Assessment Questions
  const assessmentQuestions = [
    { question: "Give examples of what you like to study during the week.", portuguese: "Dê exemplos do que você gosta de estudar durante a semana." },
    { question: "Tell me what you prefer to do on weekends: study or go to the beach?", portuguese: "Diga-me o que você prefere fazer nos fins de semana: estudar ou ir para a praia?" },
    { question: "Do you like to stay home on Sundays?", portuguese: "Você gosta de ficar em casa aos domingos?" },
    { question: 'How can you draw someone\'s attention to what you are looking at? "Take a look at..."', portuguese: 'Como você pode chamar a atenção de alguém para o que está olhando? "Dê uma olhada em..."' }
  ];

  // Fluency Practice
  const fluencyPractice = [
    { original: "She lives alone.", pronoun: "They", answer: "They live alone." },
    { original: "I have a new cell phone.", pronoun: "She", answer: "She has a new cell phone." },
    { original: "We like to stay home on weekends.", pronoun: "They", answer: "They like to stay home on weekends." },
    { original: "We go to work at 8:00 a.m.", pronoun: "He", answer: "He goes to work at 8:00 a.m." },
    { original: "We understand the story.", pronoun: "She", answer: "She understands the story." },
    { original: "They eat pasta on Sundays.", pronoun: "He", answer: "He eats pasta on Sundays." },
    { original: "I clean the house on Saturdays.", pronoun: "She", answer: "She cleans the house on Saturdays." },
    { original: "They need a new house.", pronoun: "He", answer: "He needs a new house." },
    { original: "I get up early during the week.", pronoun: "She", answer: "She gets up early during the week." },
    { original: "I come to the English school on Wednesdays.", pronoun: "She", answer: "She comes to the English school on Wednesdays." }
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            📘 LESSON 23 – Lifestyle & Weekly Planning
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about academic subjects, university life, relationships, and weekly routines.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Group studying together at a table"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e praticar suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Esconder Prática' : 'Mostrar Prática'}
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
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('saber')}>saber</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei')}>Eu sei</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você sabe')}>Você sabe</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele sabe')}>Ele sabe</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela sabe')}>Ela sabe</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Nós não sabemos o seu nome')}>Nós não sabemos o seu nome</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eles não sabem o seu nome')}>Eles</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Vocês não sabem o seu nome')}>Vocês</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu não sei o seu nome')}>Eu</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eles sabem inglês')}>Eles sabem inglês</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você sabe inglês')}>Você</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei inglês')}>Eu</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela quer saber')}>Ela quer saber</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela precisa saber')}>precisa</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela tem que saber')}>tem que</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('conhecer')}>conhecer</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu conheço')}>Eu conheço</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você conhece')}>Você conhece</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('meus pais')}>meus pais</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('professores')}>professores</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('aprender')}>aprender</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu aprendo')}>Eu aprendo</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Nós aprendemos')}>Nós aprendemos</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela aprende')}>Ela aprende</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eles não aprendem alemão')}>Eles não aprendem alemão</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você não aprende alemão')}>Você</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu não aprendo alemão')}>Eu</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Vocês aprendem inglês aqui')}>Vocês aprendem inglês aqui</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Vocês aprendem inglês lá')}>lá</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Vocês aprendem inglês na Wizard')}>na Wizard</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela quer aprender italiano')}>Ela quer aprender italiano</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela precisa aprender italiano')}>precisa</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela prefere aprender italiano')}>prefere</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('O que você quer aprender')}>O que você quer aprender</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('O que você quer saber')}>saber</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('O que você quer estudar')}>estudar</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {word.english}
                  </button> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Elas aprendem geografia na escola')}>Elas aprendem geografia na escola</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Elas aprendem biologia na escola')}>biologia</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Elas aprendem matemática na escola')}>matemática</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu tenho novas matérias na escola')}>Eu tenho novas matérias na escola</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Nós temos novas matérias na escola')}>Nós</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela tem novas matérias na escola')}>Ela</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre rotinas semanais
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {phrase.english}
                  </button> = {phrase.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você estuda o dia todo')}>Você estuda o dia todo</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você cozinha o dia todo')}>cozinha</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você trabalha o dia todo')}>trabalha</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu faço exercícios nos fins de semana')}>Eu faço exercícios nos fins de semana</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Nós fazemos exercícios nos fins de semana')}>Nós</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele faz exercícios nos fins de semana')}>Ele</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você fica em casa o dia todo')}>Você fica em casa o dia todo</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você fica na escola o dia todo')}>na escola</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você fica no trabalho o dia todo')}>no trabalho</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Quando você faz exercícios')}>Quando você faz exercícios</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Onde você faz exercícios')}>Onde</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('A que horas você faz exercícios')}>A que horas</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I work out at the gym')}>I work out at the gym</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu faço exercícios na academia')}>Eu faço exercícios na academia</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu faço exercícios na universidade')}>na universidade</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu faço exercícios na praia')}>na praia</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele faz exercícios o dia todo')}>Ele faz exercícios o dia todo</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele estuda o dia todo')}>estuda</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele lê o dia todo')}>lê</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas negativas com "doesn't" e perguntas com "how to"
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <p key={index}>
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {example.english}
                  </button> = {example.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele fala inglês muito bem')}>Ele fala inglês muito bem</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele fala alemão muito bem')}>alemão</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele fala português muito bem')}>português</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He doesn\'t speak English')}>He doesn't speak English</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não fala inglês')}>Ele não fala inglês</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não fala alemão')}>alemão</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não fala português')}>português</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não mora no Brasil')}>Ele não mora no Brasil</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não mora na Itália')}>na Itália</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não mora na França')}>na França</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não quer aprender francês')}>Ele não quer aprender francês</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não quer aprender matemática')}>matemática</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele não quer aprender idiomas')}>idiomas</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela não tem aula de matemática hoje')}>Ela não tem aula de matemática hoje</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela não tem aula de biologia hoje')}>biologia</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ela não tem aula de geografia hoje')}>geografia</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meu filho não gosta dessa matéria')}>Meu filho não gosta dessa matéria</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meu namorado não gosta dessa matéria')}>Meu namorado</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Meu irmão não gosta dessa matéria')}>Meu irmão</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I know how to speak English')}>I know how to speak English</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei falar inglês')}>Eu sei falar inglês</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei falar espanhol')}>espanhol</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei falar português')}>português</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Eu sei cozinhar muito bem')}>Eu sei cozinhar muito bem</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Nós sabemos cozinhar muito bem')}>Nós</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Ele sabe cozinhar muito bem')}>Ele</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você sabe falar francês')}>Você sabe falar francês</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você sabe falar português')}>português</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você sabe falar italiano')}>italiano</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você quer aprender a cozinhar')}>Você quer aprender a cozinhar</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você quer aprender a falar inglês')}>a falar inglês</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Você quer aprender a falar italiano')}>a falar italiano</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 REAL LIFE</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratique situações reais de estudo, universidade e rotinas semanais
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
                        src={studyGroupImage}
                        alt="Group studying together"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Studying with friends
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={universityImage}
                        alt="University campus"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      University life
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={gymImage}
                        alt="Gym workout"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Working out at the gym
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Assessment */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">📝 ASSESSMENT</h2>
            <p className="mt-2 text-blue-100 italic">
              Answer these questions to practice what you've learned
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-yellow-50 rounded-[20px] p-6 space-y-6">
              {assessmentQuestions.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-5 border border-yellow-200">
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-lg p-3 mr-4">
                      <span className="font-bold text-lg">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.question}</h3>
                      <p className="text-gray-600 text-sm">{item.portuguese}</p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-gray-500 text-sm italic">Write your answer here:</p>
                        <div className="h-20 border border-gray-300 rounded mt-2 p-2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 7 - Fluency Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🗣️ FLUENCY</h2>
            <p className="mt-2 text-blue-100 italic">
              Practice changing sentences from one pronoun to another
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 rounded-[20px] p-6">
              <div className="mb-6 p-4 bg-white rounded-xl border border-green-200">
                <h3 className="text-lg font-bold text-green-800 mb-2">Example:</h3>
                <p className="text-gray-700">I work at home. (He)</p>
                <p className="text-green-600 font-bold">➡️ He works at home.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fluencyPractice.map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-green-200">
                    <div className="mb-3">
                      <p className="text-gray-700">{item.original} ({item.pronoun})</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <p className="text-green-600 font-bold">Answer: {item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 - Check It Out (print style) */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">✅ CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Key grammar points and sentence structures
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Affirmative/Negative */}
            <div className="bg-blue-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <h3 className="font-bold text-lg text-yellow-300 mb-4">AFFIRMATIVE & NEGATIVE</h3>
                
                <div className="space-y-3">
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I speak English.</p>
                        <p className="text-blue-200 text-sm">Eu falo inglês.</p>
                      </div>
                      <div>
                        <p className="font-bold">I don't speak English.</p>
                        <p className="text-blue-200 text-sm">Eu não falo inglês.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">She speaks Spanish.</p>
                        <p className="text-blue-200 text-sm">Ela fala espanhol.</p>
                      </div>
                      <div>
                        <p className="font-bold">She doesn't speak Spanish.</p>
                        <p className="text-blue-200 text-sm">Ela não fala espanhol.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="font-bold">I know how to cook.</p>
                        <p className="text-blue-200 text-sm">Eu sei cozinhar.</p>
                      </div>
                      <div>
                        <p className="font-bold">Do you want to learn how to cook?</p>
                        <p className="text-blue-200 text-sm">Você quer aprender a cozinhar?</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image for grammar */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-800 rounded-lg overflow-hidden">
                  <img
                    src={cookingImage}
                    alt="Cooking class"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">👨‍🍳 Cooking Class</p>
                    <p className="text-blue-200 text-xs">I know how to cook. / Do you want to learn?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Academic Subjects */}
            <div className="bg-blue-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-yellow-300">ACADEMIC SUBJECTS</h3>
                    <button 
                      onClick={() => setShowSubjectExplanation(!showSubjectExplanation)}
                      className="text-xs bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
                    >
                      {showSubjectExplanation ? 'Hide Explanation' : 'Show Explanation'}
                    </button>
                  </div>
                  
                  {showSubjectExplanation && (
                    <div className="mb-4 p-4 bg-blue-900 rounded-lg border border-blue-700">
                      <p className="text-yellow-200 text-sm font-medium mb-2">📚 Subject Study Tips:</p>
                      <ul className="text-blue-200 text-sm list-disc pl-4 space-y-1">
                        <li>Use "study" with academic subjects: study biology, study math</li>
                        <li>Use "have class" for scheduled lessons: have cooking class</li>
                        <li>Use "learn" for acquiring new skills: learn to cook, learn Italian</li>
                        <li>Use "know" for things you already understand: know how to speak</li>
                      </ul>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Biology</p>
                      <p className="text-blue-200 text-sm">biologia</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Geography</p>
                      <p className="text-blue-200 text-sm">geografia</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Math</p>
                      <p className="text-blue-200 text-sm">matemática</p>
                    </div>
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <p className="font-bold text-lg">Cooking</p>
                      <p className="text-blue-200 text-sm">culinária</p>
                    </div>
                  </div>
                </div>
                
                {/* Time Expressions */}
                <div className="pt-6 border-t border-blue-700">
                  <div className="mb-3">
                    <h4 className="font-bold text-lg text-yellow-300">TIME EXPRESSIONS</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-blue-700 rounded-full p-2">
                          <span className="text-lg">📅</span>
                        </div>
                        <div>
                          <p className="font-bold">all day long</p>
                          <p className="text-blue-200 text-sm">o dia todo</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: They stay home all day long.</p>
                    </div>
                    
                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-blue-700 rounded-full p-2">
                          <span className="text-lg">🏫</span>
                        </div>
                        <div>
                          <p className="font-bold">at the university</p>
                          <p className="text-blue-200 text-sm">na universidade</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: He studies at the university.</p>
                    </div>

                    <div className="p-3 bg-blue-900 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="mr-3 bg-blue-700 rounded-full p-2">
                          <span className="text-lg">💪</span>
                        </div>
                        <div>
                          <p className="font-bold">work out</p>
                          <p className="text-blue-200 text-sm">fazer exercícios</p>
                        </div>
                      </div>
                      <p className="text-blue-300 text-xs">Example: I don't work out on weekends.</p>
                    </div>
                  </div>
                </div>
                
                {/* Relationship Vocabulary */}
                <div className="mt-6 pt-6 border-t border-blue-700">
                  <div className="p-4 bg-blue-900 rounded-lg">
                    <h5 className="font-bold text-yellow-200 mb-3">👫 RELATIONSHIPS</h5>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">boyfriend</p>
                        <p className="text-blue-200 text-sm">namorado</p>
                      </div>
                      <div className="p-3 bg-blue-800 rounded">
                        <p className="font-medium">girlfriend</p>
                        <p className="text-blue-200 text-sm">namorada</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-700 rounded-md">
                      <h6 className="font-bold text-yellow-100 mb-2">💬 Useful Sentences:</h6>
                      <div className="flex items-start mb-2">
                        <button 
                          onClick={() => playAudio("My boyfriend doesn't come here every day")}
                          className="mr-2 text-blue-200 hover:text-white transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <p className="font-medium">My boyfriend doesn't come here every day.</p>
                          <p className="text-blue-200 text-sm">Meu namorado não vem aqui todos os dias.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Image for subjects */}
              <div className="mt-6 pt-6 border-t border-blue-700">
                <div className="bg-blue-900 rounded-lg overflow-hidden">
                  <img
                    src={subjectsImage}
                    alt="Academic subjects and books"
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-yellow-200 text-sm font-medium">📚 Academic Life</p>
                    <p className="text-blue-200 text-xs">Biology, geography, math, and university studies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson button */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson22")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (22)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson24")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (24) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}