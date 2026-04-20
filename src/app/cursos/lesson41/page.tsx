"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar' | 'realLife' | 'checkItOut';

export default function Lesson41HealthFeelingsProfessions() {
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
  const mainImage = "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const birthdayImage = "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const monthsImage = "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const shoppingImage = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 41 - Verbs (to be - questions)
  const verbs = [
    { english: "Am I?", portuguese: "Eu sou / estou?" },
    { english: "Are you?", portuguese: "Você é / está?" },
    { english: "Is he?", portuguese: "Ele é / está?" },
    { english: "Is she?", portuguese: "Ela é / está?" },
    { english: "Is it?", portuguese: "Ele/ela (coisa) é / está?" },
    { english: "Are we?", portuguese: "Nós somos / estamos?" },
    { english: "Are you? (plural)", portuguese: "Vocês são / estão?" },
    { english: "Are they?", portuguese: "Eles são / estão?" },
    { english: "I am / I'm", portuguese: "Eu sou / estou" },
    { english: "I am not", portuguese: "Eu não sou / estou" },
    { english: "You are / You're", portuguese: "Você é / está" },
    { english: "You are not / You aren't", portuguese: "Você não é / está" },
  ];

  // Months of the Year
  const months = [
    { english: "January", portuguese: "janeiro" },
    { english: "February", portuguese: "fevereiro" },
    { english: "March", portuguese: "março" },
    { english: "April", portuguese: "abril" },
    { english: "May", portuguese: "maio" },
    { english: "June", portuguese: "junho" },
    { english: "July", portuguese: "julho" },
    { english: "August", portuguese: "agosto" },
    { english: "September", portuguese: "setembro" },
    { english: "October", portuguese: "outubro" },
    { english: "November", portuguese: "novembro" },
    { english: "December", portuguese: "dezembro" },
  ];

  // New Words
  const newWords = [
    { english: "birthday", portuguese: "aniversário" },
    { english: "young", portuguese: "jovem" },
    { english: "ready", portuguese: "pronto(a)" },
    { english: "who", portuguese: "quem" },
    { english: "old", portuguese: "velho" },
    { english: "important", portuguese: "importante" },
    { english: "late", portuguese: "atrasado" },
    { english: "early", portuguese: "cedo" },
    { english: "vacation / holidays", portuguese: "férias" },
    { english: "beach", portuguese: "praia" },
    { english: "downtown", portuguese: "centro da cidade" },
    { english: "station", portuguese: "estação" },
    { english: "pharmacy", portuguese: "farmácia" },
    { english: "bank", portuguese: "banco" },
    { english: "shopping mall", portuguese: "shopping" },
    { english: "office", portuguese: "escritório" },
    { english: "store / shop", portuguese: "loja" },
    { english: "near", portuguese: "perto" },
    { english: "far", portuguese: "longe" },
  ];

  const usefulPhrases = [
    { english: "How old are you?", portuguese: "Quantos anos você tem?" },
    { english: "I'm 20 years old.", portuguese: "Eu tenho 20 anos" },
    { english: "When is your birthday?", portuguese: "Quando é seu aniversário?" },
    { english: "It's in May.", portuguese: "É em maio" },
    { english: "My birthday is on June 1st.", portuguese: "Meu aniversário é dia primeiro de junho" },
    { english: "I usually go to the beach in February.", portuguese: "Eu geralmente vou à praia em fevereiro" },
    { english: "We don't go to school in July.", portuguese: "Nós não vamos para a escola em julho" },
    { english: "His birthday is tomorrow.", portuguese: "O aniversário dele é amanhã" },
  ];

  const grammarExamples = [
    { english: "Are you ready?", portuguese: "Você está pronto?" },
    { english: "Is she Brazilian?", portuguese: "Ela é brasileira?" },
    { english: "Are they at the office?", portuguese: "Eles estão no escritório?" },
    { english: "Is your father a manager?", portuguese: "Seu pai é gerente?" },
    { english: "Is the movie bad?", portuguese: "O filme é ruim?" },
    { english: "Are the students there?", portuguese: "Os alunos estão lá?" },
    { english: "Who is he?", portuguese: "Quem é ele?" },
    { english: "Who are you?", portuguese: "Quem é você?" },
    { english: "Who are those people?", portuguese: "Quem são aquelas pessoas?" },
    { english: "Is it near here?", portuguese: "É perto daqui?" },
    { english: "Is the backpack expensive?", portuguese: "A mochila é cara?" },
    { english: "Are they funny?", portuguese: "Eles são engraçados?" },
    { english: "Is she at home?", portuguese: "Ela está em casa?" },
    { english: "Are we late?", portuguese: "Nós estamos atrasados?" },
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "Am I late?", portuguese: "Eu estou atrasado?" },
    { english: "Are you Brazilian?", portuguese: "Você é brasileiro?" },
    { english: "Is he a student?", portuguese: "Ele é estudante?" },
    { english: "Is she a sales clerk?", portuguese: "Ela é vendedora?" },
    { english: "Is it a good book?", portuguese: "É um bom livro?" },
    { english: "Are we ready to start?", portuguese: "Estamos prontos para começar?" },
    { english: "Are they with you?", portuguese: "Eles estão com você?" },
    { english: "Who are you?", portuguese: "Quem é você?" },
    { english: "Who is he?", portuguese: "Quem é ele?" },
    { english: "Who are those people?", portuguese: "Quem são aquelas pessoas?" },
    { english: "How old is she?", portuguese: "Quantos anos ela tem?" },
    { english: "She's ten years old.", portuguese: "Ela tem 10 anos" },
    { english: "When is your birthday?", portuguese: "Quando é seu aniversário?" },
    { english: "It's in April.", portuguese: "É em abril" },
    { english: "Is your father a manager?", portuguese: "Seu pai é gerente?" },
  ];

  // Ordinal Numbers (16th to 31st)
  const ordinalNumbers = [
    { number: "16th", english: "sixteenth", portuguese: "décimo sexto" },
    { number: "17th", english: "seventeenth", portuguese: "décimo sétimo" },
    { number: "18th", english: "eighteenth", portuguese: "décimo oitavo" },
    { number: "19th", english: "nineteenth", portuguese: "décimo nono" },
    { number: "20th", english: "twentieth", portuguese: "vigésimo" },
    { number: "21st", english: "twenty-first", portuguese: "vigésimo primeiro" },
    { number: "22nd", english: "twenty-second", portuguese: "vigésimo segundo" },
    { number: "23rd", english: "twenty-third", portuguese: "vigésimo terceiro" },
    { number: "24th", english: "twenty-fourth", portuguese: "vigésimo quarto" },
    { number: "25th", english: "twenty-fifth", portuguese: "vigésimo quinto" },
    { number: "30th", english: "thirtieth", portuguese: "trigésimo" },
    { number: "31st", english: "thirty-first", portuguese: "trigésimo primeiro" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
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
            📘 Lesson 41 - Health, Feelings & Professions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to ask questions with the verb "to be", talk about birthdays and months, and use ordinal numbers.
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Calendar and birthday concept"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - VERBS (to be - questions) with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 1. VERBS (to be - ser/estar - Questions)</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e praticar perguntas
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
                    1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Am I Brazilian')}>Am I Brazilian?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Am I American')}>American?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Am I British')}>British?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu sou brasileiro? / americano? / britânico?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you a student')}>Are you a student?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you a teacher')}>a teacher?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you a doctor')}>a doctor?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você é estudante? / professor? / médico?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is he your brother')}>Is he your brother?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is he your father')}>your father?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is he your cousin')}>your cousin?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele é seu irmão? / pai? / primo?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is she your wife')}>Is she your wife?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is she your coworker')}>your coworker?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is she your aunt')}>your aunt?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela é sua esposa? / colega de trabalho? / tia?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is it new')}>Is it new?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is it old')}>old?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Is it important')}>important?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">É novo? / velho? / importante?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are we late')}>Are we late?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are they late')}>Are they late?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you late')}>Are you late?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós estamos atrasados? / Eles estão? / Vocês estão?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are you at the shopping mall')}>Are you at the shopping mall?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('At the bank')}>at the bank?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('At the pharmacy')}>at the pharmacy?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Vocês estão no shopping? / no banco? / na farmácia?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are they here')}>Are they here?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are they there')}>there?</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('Are they downtown')}>downtown?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles estão aqui? / lá? / no centro da cidade?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - MONTHS & NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 2. MONTHS & NEW WORDS (Meses e Vocabulário)</h2>
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
            <h3 className="text-xl font-semibold text-green-700 mb-4">📅 Months of the Year / Meses do Ano</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {months.map((month, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(month.english)} 
                    className="text-green-600 font-bold cursor-pointer hover:text-green-800 transition-colors"
                  >
                    {month.english}
                  </button> = {month.portuguese}
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-semibold text-green-700 mb-4">📚 New Vocabulary / Novo Vocabulário</h3>
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
                    1. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('It is January')}>It is January</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('It is February')}>February</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('It is March')}>March</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">É janeiro / fevereiro / março</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My birthday is in April')}>My birthday is in April</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My birthday is in May')}>May</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My birthday is in June')}>June</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu aniversário é em abril / maio / junho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My vacation is in October')}>My vacation is in October</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In August')}>August</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In September')}>September</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Minhas férias são em outubro / agosto / setembro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We do not go to school in July')}>We don't go to school in July</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In December')}>December</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In January')}>January</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós não vamos para a escola em julho / dezembro / janeiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I usually go to the beach in February')}>I usually go to the beach in February</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In November')}>November</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In March')}>March</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu geralmente vou à praia em fevereiro / novembro / março</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you work in July')}>Do you work in July?</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In January')}>January?</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In December')}>December?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você trabalha em julho? / janeiro? / dezembro?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('His birthday is tomorrow')}>His birthday is tomorrow</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Today')}>today</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Next week')}>next week</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">O aniversário dele é amanhã / hoje / semana que vem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('She is very young')}>She is very young</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Smart')}>smart</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Pretty')}>pretty</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela é muito jovem / esperta / bonita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('We are ready to start')}>We are ready to start</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('They are ready')}>They are ready</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I am ready')}>I am ready</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós estamos prontos para começar / Eles estão / Eu estou</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I want to start the course in April')}>I want to start the course in April</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In March')}>March</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('In September')}>September</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu quero começar o curso em abril / março / setembro</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - USEFUL PHRASES with Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 3. USEFUL PHRASES (Frases Úteis)</h2>
              <p className="mt-2 text-yellow-100 italic">
                Perguntas e respostas sobre idade e aniversários
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Esconder Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-yellow-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <p key={index}>
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800 transition-colors"
                  >
                    {phrase.english}
                  </button> = {phrase.portuguese}
                </p>
              ))}
            </div>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('How old are you')}>How old are you?</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('How old are they')}>How old are they?</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('How old are you all')}>How old are you (plural)?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quantos anos você tem? / eles? / vocês?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I am 20 years old')}>I am 20 years old</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is 20')}>He is 20</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('You are 20')}>You are 20</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu tenho 20 anos / Ele tem / Vocês têm</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('She is 25 years old')}>She is 25 years old</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is 25')}>He is 25</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela tem 25 anos / Ele tem</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is young')}>He is young</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is 15 years old')}>He is 15 years old</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is 12')}>12</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is 14')}>14</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele é jovem / Ele tem 15 anos / 12 / 14</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('My father is 65 years old')}>My father is 65 years old</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('70')}>70</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('81')}>81</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu pai tem 65 anos / 70 / 81</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('When is your birthday')}>When is your birthday?</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('His birthday')}>his birthday?</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('Her birthday')}>her birthday?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quando é seu aniversário? / dele? / dela?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('My birthday is on June 1st')}>My birthday is on June 1st</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu aniversário é dia primeiro de junho</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('My birthday is on August 10th')}>My birthday is on August 10th</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('15th')}>15th</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('12th')}>12th</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Meu aniversário é dia 10 de agosto / 15 / 12</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - GRAMMAR with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 4. GRAMMAR (Questions with To Be)</h2>
              <p className="mt-2 text-purple-100 italic">
                Estruturas interrogativas com o verbo to be
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
              {grammarExamples.map((example, index) => (
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
                    1. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are you ready')}>Are you ready?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Is she ready')}>Is she ready?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are they ready')}>Are they ready?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você está pronta? / Ela está? / Eles estão?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are they funny')}>Are they funny?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are they smart')}>smart?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are they kind')}>kind?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles são engraçados? / espertos? / gentis?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Is he at the station')}>Is he at the station?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('At the park')}>at the park?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('At home')}>at home?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele está na estação? / no parque? / em casa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Is it near here')}>Is it near here?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Is it far')}>Is it far?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">É perto daqui? / longe?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Is the backpack expensive')}>Is the backpack expensive?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Cheap')}>cheap?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Good')}>good?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">A mochila é cara? / barata? / boa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Are they lawyers')}>Are they lawyers?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Designers')}>designers?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Managers')}>managers?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles são advogados? / projetistas? / gerentes?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Who are you')}>Who are you?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Who are they')}>Who are they?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Who is she')}>Who is she?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quem é você? / Quem são eles? / Quem é ela?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Who is that person')}>Who is that person?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('That student')}>that student?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('That engineer')}>that engineer?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quem é aquela pessoa? / aquele aluno? / aquele engenheiro?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Where are you now')}>Where are you now?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Where are they')}>Where are they?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Where is she')}>Where is she?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Onde você está agora? / elas? / ele?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('When is your birthday')}>When is your birthday?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('His birthday')}>his birthday?</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Her birthday')}>her birthday?</span>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quando é seu aniversário? / dele? / dela?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🎭 5. REAL LIFE (Uso no dia a dia)</h2>
              <p className="mt-2 text-red-100 italic">
                Pratique perguntas e respostas com o verbo to be
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
                        src={birthdayImage}
                        alt="Birthday celebration"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Happy birthday!
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={shoppingImage}
                        alt="Shopping"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      At the shopping mall
                    </p>
                  </div>
                </div>
              </div>

              {/* Useful Questions and Answers */}
              <div className="mt-8 border-t border-red-200 pt-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">❓ Useful Questions & Answers / Perguntas e Respostas Úteis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <button 
                      onClick={() => playAudio("What's your name")}
                      className="text-red-600 font-medium hover:text-red-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      What's your name?
                    </button>
                    <p className="text-sm text-gray-500 mt-1">Qual é o seu nome?</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <button 
                      onClick={() => playAudio("Where is your office")}
                      className="text-red-600 font-medium hover:text-red-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      Where is your office?
                    </button>
                    <p className="text-sm text-gray-500 mt-1">Onde fica seu escritório?</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-red-200">
                    <button 
                      onClick={() => playAudio("What time is the meeting")}
                      className="text-red-600 font-medium hover:text-red-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      What time is the meeting?
                    </button>
                    <p className="text-sm text-gray-500 mt-1">Que horas é a reunião?</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <button 
                      onClick={() => playAudio("Yes I am")}
                      className="text-green-600 font-medium hover:text-green-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      Yes, I am.
                    </button>
                    <p className="text-sm text-gray-500 mt-1">Sim, eu sou/estou.</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-200">
                    <button 
                      onClick={() => playAudio("No I'm not")}
                      className="text-green-600 font-medium hover:text-green-800 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      No, I'm not.
                    </button>
                    <p className="text-sm text-gray-500 mt-1">Não, eu não sou/estou.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - CHECK IT OUT! (Ordinal Numbers 16-31) */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔢 CHECK IT OUT! - Ordinal Numbers 16th - 31st</h2>
              <p className="mt-2 text-teal-100 italic">
                Números ordinais em inglês do 16º ao 31º
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
                <p className="text-teal-800 text-sm">📚 <strong>Ordinal numbers</strong> indicate position, order, or rank. For numbers 20, 30, etc., change -y to -ieth (twenty → twentieth, thirty → thirtieth). For compound numbers (21, 22, etc.), only the last number is ordinal (twenty-first, twenty-second).</p>
                <p className="text-teal-800 text-sm mt-1">💡 Use ordinal numbers for dates: <strong>June 1st</strong>, <strong>August 10th</strong>, <strong>December 25th</strong>.</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
              <h4 className="font-bold text-teal-800 mb-2">🎂 Birthday Examples / Exemplos de Aniversário:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => playAudio("My birthday is in October")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  🎂 "My birthday is <span className="font-bold text-teal-600">in October</span>."
                </button>
                <button onClick={() => playAudio("My birthday is on October 29th")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  🎂 "My birthday is <span className="font-bold text-teal-600">on October 29th</span>."
                </button>
                <button onClick={() => playAudio("My birthday is on ___")} className="text-left p-2 bg-white rounded-lg hover:bg-teal-50 transition-colors">
                  📅 "My birthday is on <span className="font-bold text-teal-600">___</span>"
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson40")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (40)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson42")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (42) &rarr;
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-8">
          <p>Lesson 41 - Health, Feelings & Professions | Verb "to be" - Questions, Months, Birthdays & Ordinal Numbers</p>
        </div>
      </div>
    </div>
  );
}