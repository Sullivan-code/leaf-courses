"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

export default function Lesson39HealthFeelingsProfessions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
    realLife: false,
    checkItOut: false,
  });
  const [showCheckItOutExplanation, setShowCheckItOutExplanation] = useState(false);

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
  const mainImage = "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const doctorImage = "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const sickImage = "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const professionsImage = "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 39 - Verbs (to be) - Extended
  const verbs = [
    { english: "to be", portuguese: "ser / estar" },
    { english: "I am (I'm)", portuguese: "eu sou / estou" },
    { english: "you are (you're)", portuguese: "você é / está" },
    { english: "he is (he's)", portuguese: "ele é / está" },
    { english: "she is (she's)", portuguese: "ela é / está" },
    { english: "it is (it's)", portuguese: "ele/ela é / está" },
    { english: "we are (we're)", portuguese: "nós somos / estamos" },
    { english: "they are (they're)", portuguese: "eles/elas são / estão" },
    { english: "I am not", portuguese: "eu não sou / estou" },
    { english: "you are not", portuguese: "você não é / está" },
    { english: "he is not", portuguese: "ele não é / está" },
    { english: "we are not", portuguese: "nós não somos / estamos" },
  ];

  // Lesson 39 - New Words (Extended)
  const newWords = [
    { english: "student", portuguese: "estudante" },
    { english: "manager", portuguese: "gerente" },
    { english: "sales clerk", portuguese: "vendedor" },
    { english: "lawyer", portuguese: "advogado" },
    { english: "engineer", portuguese: "engenheiro" },
    { english: "designer", portuguese: "projetista" },
    { english: "hungry", portuguese: "com fome" },
    { english: "thirsty", portuguese: "com sede" },
    { english: "tired", portuguese: "cansado" },
    { english: "sad", portuguese: "triste" },
    { english: "upset", portuguese: "chateado" },
    { english: "worried", portuguese: "preocupado" },
    { english: "happy", portuguese: "feliz" },
    { english: "smart", portuguese: "inteligente" },
    { english: "pretty", portuguese: "bonito(a)" },
    { english: "healthy", portuguese: "saudável" },
    { english: "busy", portuguese: "ocupado" },
    { english: "very", portuguese: "muito" },
    { english: "sick", portuguese: "doente" },
    { english: "headache", portuguese: "dor de cabeça" },
    { english: "stomachache", portuguese: "dor de estômago" },
    { english: "toothache", portuguese: "dor de dente" },
  ];

  const usefulPhrases = [
    { english: "What do you do?", portuguese: "O que você faz?" },
    { english: "I'm sure", portuguese: "Eu tenho certeza" },
    { english: "I'm worried about the exam", portuguese: "Estou preocupado com a prova" },
    { english: "I'm worried about the project", portuguese: "Estou preocupado com o projeto" },
    { english: "I'm worried about the reports", portuguese: "Estou preocupado com os relatórios" },
    { english: "I'm worried about my friend", portuguese: "Estou preocupado com meu amigo" },
    { english: "I'm worried about my classmate", portuguese: "Estou preocupado com meu colega de classe" },
    { english: "I'm worried about you", portuguese: "Estou preocupado com você" },
  ];

  const grammarExamples = [
    { english: "I'm not hungry now.", portuguese: "Eu não estou com fome agora." },
    { english: "You are not very far from here.", portuguese: "Você não está muito longe daqui." },
    { english: "He is not busy this week.", portuguese: "Ele não está ocupado esta semana." },
    { english: "She is not tired today.", portuguese: "Ela não está cansada hoje." },
    { english: "It is not late to go there.", portuguese: "Não é tarde para ir lá." },
    { english: "We are not lawyers, we're managers.", portuguese: "Nós não somos advogados, somos gerentes." },
    { english: "They are not upset.", portuguese: "Eles não estão chateados." },
    { english: "I'm not a designer.", portuguese: "Eu não sou projetista." },
    { english: "They are not at school now.", portuguese: "Eles não estão na escola agora." },
    { english: "You are not late for class.", portuguese: "Você não está atrasado para a aula." },
    { english: "She is not at home.", portuguese: "Ela não está em casa." },
    { english: "We are not at church now, we're at the park.", portuguese: "Nós não estamos na igreja agora, estamos no parque." },
    { english: "It is not an interesting story.", portuguese: "Não é uma história interessante." },
    { english: "We are not very tired.", portuguese: "Nós não estamos muito cansados." },
    { english: "They are not engineers.", portuguese: "Eles não são engenheiros." },
    { english: "The exam is not very hard.", portuguese: "A prova não é muito difícil." },
    { english: "I think French fries are not healthy.", portuguese: "Eu acho que batatas fritas não são saudáveis." },
    { english: "They are not sad, they're happy.", portuguese: "Eles não estão tristes, estão felizes." },
    { english: "These are not her shoes.", portuguese: "Estes não são os sapatos dela." },
  ];

  // Real Life Practice Sentences (Extended)
  const realLifeSentences = [
    { english: "I am not a designer.", portuguese: "Eu não sou projetista." },
    { english: "They are not at school now.", portuguese: "Eles não estão na escola agora." },
    { english: "You are not late for class.", portuguese: "Você não está atrasado para a aula." },
    { english: "She is not at home.", portuguese: "Ela não está em casa." },
    { english: "We are not at church now, we're at the park.", portuguese: "Nós não estamos na igreja agora, estamos no parque." },
    { english: "It is not an interesting story.", portuguese: "Não é uma história interessante." },
    { english: "We are not very tired.", portuguese: "Nós não estamos muito cansados." },
    { english: "They are not engineers.", portuguese: "Eles não são engenheiros." },
    { english: "The exam is not very hard.", portuguese: "A prova não é muito difícil." },
    { english: "I think French fries are not healthy.", portuguese: "Eu acho que batatas fritas não são saudáveis." },
    { english: "They are not sad, they're happy.", portuguese: "Eles não estão tristes, estão felizes." },
    { english: "These are not her shoes.", portuguese: "Estes não são os sapatos dela." },
    { english: "He is not a doctor, he's a nurse.", portuguese: "Ele não é médico, é enfermeiro." },
    { english: "She is not a teacher, she's a lawyer.", portuguese: "Ela não é professora, é advogada." },
    { english: "I'm not hungry, I'm thirsty.", portuguese: "Eu não estou com fome, estou com sede." },
    { english: "They are not at home, they're at work.", portuguese: "Eles não estão em casa, estão no trabalho." },
  ];

  // Ordinal Numbers
  const ordinalNumbers = [
    { number: "1st", english: "first", portuguese: "primeiro" },
    { number: "2nd", english: "second", portuguese: "segundo" },
    { number: "3rd", english: "third", portuguese: "terceiro" },
    { number: "4th", english: "fourth", portuguese: "quarto" },
    { number: "5th", english: "fifth", portuguese: "quinto" },
    { number: "6th", english: "sixth", portuguese: "sexto" },
    { number: "7th", english: "seventh", portuguese: "sétimo" },
    { number: "8th", english: "eighth", portuguese: "oitavo" },
    { number: "9th", english: "ninth", portuguese: "nono" },
    { number: "10th", english: "tenth", portuguese: "décimo" },
    { number: "11th", english: "eleventh", portuguese: "décimo primeiro" },
    { number: "12th", english: "twelfth", portuguese: "décimo segundo" },
    { number: "13th", english: "thirteenth", portuguese: "décimo terceiro" },
    { number: "14th", english: "fourteenth", portuguese: "décimo quarto" },
    { number: "15th", english: "fifteenth", portuguese: "décimo quinto" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-6xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🏥 Lesson 39 - Health, Feelings & Professions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about health issues, feelings, professions, and use the verb "to be" in negative and affirmative forms.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Health and medical care"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - VERBS (to be) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 1. VERBS (to be - ser / estar)</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e praticar
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-2">
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
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am a doctor')}>I am a doctor</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am not a doctor')}>I am not a doctor</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am a dentist')}>I am a dentist</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu sou médico. / não sou médico / sou dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am in Brazil')}>I am in Brazil</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am not in Brazil')}>I am not in Brazil</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am in Italy')}>I am in Italy</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou no Brasil. / não estou no Brasil / na Itália</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You are not sick')}>You are not sick</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is not sick')}>He is not</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is not sick')}>She is not</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você não está doente. / Ele não está / Ela não está</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is not a dentist')}>He is not a dentist</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is a teacher')}>He is a teacher</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is a nurse')}>He is a nurse</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele não é dentista. / professor / enfermeiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is not here')}>She is not here</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is there')}>there</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is at school')}>at school</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela não está aqui. / lá / na escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is not easy')}>It is not easy</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is difficult')}>difficult</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is boring')}>boring</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Não é fácil. / difícil / chato</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are not late')}>We are not late</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are not late')}>They are not</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You are not late')}>You are not</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós não estamos atrasados. / Eles não estão / vocês não estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are not my cousins')}>They are not my cousins</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are my relatives')}>my relatives</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are my neighbors')}>my neighbors</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles não são meus primos. / parentes / vizinhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are not at home')}>They are not at home</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are at the cinema')}>at the cinema</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are at the train station')}>at the train station</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles não estão em casa. / no cinema / na estação de trem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you do')}>What do you do?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does she do')}>What does she do?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does he do')}>What does he do?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">O que você faz? / O que ela faz? / O que ele faz?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am sure')}>I'm sure</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is sure')}>She's sure</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are sure')}>We're sure</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu tenho certeza. / Ela tem certeza / Nós temos certeza</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am worried about the exam')}>I'm worried about the exam</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am worried about the project')}>the project</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am worried about the reports')}>the reports</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Estou preocupado com a prova / com o projeto / com os relatórios</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 2. NEW WORDS (Vocabulário)</h2>
              <p className="mt-2 text-green-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {newWords.map((word, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(word.english)} 
                    className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                  >
                    {word.english}
                  </button> = {word.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-green-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My brother is a lawyer')}>My brother is a lawyer</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My brother is a student')}>student</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My brother is a sales clerk')}>sales clerk</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu irmão é advogado / estudante / vendedor</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is not a designer')}>She is not a designer</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is not a manager')}>manager</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is not a nurse')}>nurse</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela não é projetista / gerente / enfermeira</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He is an engineer')}>He is an engineer</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is an engineer')}>She is</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I am an engineer')}>I am</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele é um engenheiro. / Ela é / Eu sou</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are tired')}>We are tired</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are busy')}>busy</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are upset')}>upset</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós estamos cansados / ocupados / chateados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He is not sad')}>He is not sad</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He is not worried')}>worried</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He is not busy')}>busy</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele não está triste / preocupado / ocupado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Your children are pretty')}>Your children are pretty</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Your children are smart')}>smart</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Your children are kind')}>kind</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Seus filhos são bonitos / espertos / gentis</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are very happy')}>We are very happy</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are very tired')}>very tired</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are very busy')}>very busy</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós estamos muito felizes / cansados / ocupados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I am hungry')}>I am hungry</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is hungry')}>She is</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are hungry')}>We are</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou com fome / Ela está / Nós estamos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I am not thirsty')}>I am not thirsty</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He is not thirsty')}>He is not</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('They are not thirsty')}>They are not</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não estou com sede. / Ele não está / Eles não estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I know those students')}>I know those students</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I know those sales clerks')}>sales clerks</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I know those lawyers')}>lawyers</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu conheço aqueles alunos / vendedores / advogados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a headache')}>I have a headache</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a stomachache')}>stomachache</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a toothache')}>toothache</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Estou com dor de cabeça / dor de estômago / dor de dente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is healthy')}>She is healthy</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is sick')}>sick</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is tired')}>tired</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela é saudável / está doente / está cansada</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - GRAMMAR with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 3. GRAMMAR (Negative Form)</h2>
              <p className="mt-2 text-purple-100 italic">
                Estruturas negativas com o verbo to be
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-purple-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.slice(0, 7).map((example, index) => (
                <p key={index}>
                  <button 
                    onClick={() => playAudio(example.english)} 
                    className="text-purple-600 font-bold cursor-pointer hover:text-purple-800 transition-colors"
                  >
                    {example.english}
                  </button> = {example.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-purple-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am not busy this week')}>I am not busy this week</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am not busy tomorrow')}>tomorrow</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am not busy next week')}>next week</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não estou ocupado esta semana / amanhã / na próxima semana</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is not my brother')}>He is not my brother</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is not my father')}>father</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is not my grandfather')}>grandfather</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele não é meu irmão / pai / avô</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are not tired')}>We are not tired</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are not sad')}>sad</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are not worried')}>worried</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós não estamos cansados / tristes / preocupados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are not upset')}>They are not upset</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are not hungry')}>hungry</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are not thirsty')}>thirsty</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Elas não estão chateadas / com fome / com sede</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is not very healthy')}>It is not very healthy</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is not very good')}>good</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is not very interesting')}>interesting</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Não é muito saudável / bom / interessante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My sister is not a designer')}>My sister is not a designer</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My sister is not a manager')}>manager</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My sister is not a sales clerk')}>sales clerk</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Minha irmã não é projetista / gerente / vendedora</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('The book is not boring')}>The book is not boring</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('The book is not funny')}>funny</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('The book is not bad')}>bad</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">O livro não é chato / engraçado / ruim</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My boyfriend is not sick')}>My boyfriend is not sick</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My girlfriend is not sick')}>My girlfriend</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My husband is not sick')}>My husband</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu namorado não está doente / Minha namorada / Meu marido</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My family is not in Germany')}>My family is not in Germany</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My family is not in France')}>in France</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('My family is not in the United States')}>in the United States</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Minha família não está na Alemanha / na França / nos Estados Unidos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We think he is healthy')}>We think he is healthy</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We think he is happy')}>happy</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We think he is tired')}>tired</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós achamos que ele está saudável / feliz / cansado</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 4. REAL LIFE (Uso no dia a dia)</h2>
              <p className="mt-2 text-red-100 italic">
                Pratique situações reais sobre saúde, sentimentos e profissões
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('realLife')}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.realLife ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button 
                          onClick={() => playAudio(sentence.english)} 
                          className="mr-3 mt-1 text-red-600 hover:text-red-800 transition-colors flex-shrink-0"
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

                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={professionsImage}
                        alt="Professions"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Different professions
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={sickImage}
                        alt="Sick person"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Feeling sick
                    </p>
                  </div>
                </div>
              </div>

              {/* Useful Phrases Practice inside Real Life */}
              <div className="mt-8 border-t border-red-200 pt-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">📝 USEFUL PHRASES PRACTICE</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {usefulPhrases.map((phrase, idx) => (
                    <div key={idx} className="p-3 bg-white rounded-lg border border-red-200">
                      <button 
                        onClick={() => playAudio(phrase.english)}
                        className="text-red-600 font-medium hover:text-red-800 transition-colors flex items-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                        {phrase.english}
                      </button>
                      <p className="text-sm text-gray-500 mt-1">{phrase.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 - CHECK IT OUT! (Ordinal Numbers) */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔢 CHECK IT OUT! - Ordinal Numbers</h2>
              <p className="mt-2 text-teal-100 italic">
                Números ordinais em inglês do 1º ao 15º
              </p>
            </div>
            <button 
              onClick={() => setShowCheckItOutExplanation(!showCheckItOutExplanation)}
              className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showCheckItOutExplanation ? 'Esconder Explicação' : 'Mostrar Explicação'}
            </button>
          </div>

          <div className="p-8">
            {showCheckItOutExplanation && (
              <div className="mb-6 p-4 bg-teal-50 rounded-xl border border-teal-200">
                <p className="text-teal-800 text-sm">📚 <strong>Ordinal numbers</strong> are used to indicate position, order, or rank. Examples: first place, second floor, third time.</p>
                <p className="text-teal-800 text-sm mt-1">💡 Most ordinal numbers end in <strong>"th"</strong>, except: 1st (first), 2nd (second), 3rd (third).</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {ordinalNumbers.map((ordinal) => (
                <div key={ordinal.number} className="bg-teal-50 rounded-xl p-4 text-center border border-teal-200 hover:shadow-md transition-all">
                  <button
                    onClick={() => playAudio(ordinal.english)}
                    className="text-2xl font-bold text-teal-600 hover:text-teal-800 transition-colors block w-full"
                  >
                    {ordinal.number}
                  </button>
                  <p className="text-lg font-medium text-teal-700 mt-1">{ordinal.english}</p>
                  <p className="text-sm text-teal-500">{ordinal.portuguese}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-teal-100 rounded-xl">
              <h4 className="font-bold text-teal-800 mb-2">🎯 Examples in context:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => playAudio("This is my first time at the dentist")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  🦷 "This is my <span className="font-bold text-teal-600">first</span> time at the dentist."
                </button>
                <button onClick={() => playAudio("He is in second place")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  🏆 "He is in <span className="font-bold text-teal-600">second</span> place."
                </button>
                <button onClick={() => playAudio("This is the third time I take this medicine")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  💊 "This is the <span className="font-bold text-teal-600">third</span> time I take this medicine."
                </button>
                <button onClick={() => playAudio("She lives on the fifth floor")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  🏢 "She lives on the <span className="font-bold text-teal-600">fifth</span> floor."
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson38")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (38)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson40")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (40) &rarr;
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>Lesson 39 - Health, Feelings & Professions | Verb "to be" - Negative and Affirmative Forms</p>
        </div>
      </div>
    </div>
  );
}