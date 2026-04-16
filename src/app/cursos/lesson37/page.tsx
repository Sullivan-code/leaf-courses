"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function Lesson37HealthFeelingsProfessions() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
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

  // Lesson 37 - Verbs (to be)
  const verbs = [
    { english: "to be", portuguese: "ser / estar" },
    { english: "I am (I'm)", portuguese: "eu sou / estou" },
    { english: "you are (you're)", portuguese: "você é / está" },
    { english: "he is (he's)", portuguese: "ele é / está" },
    { english: "she is (she's)", portuguese: "ela é / está" },
    { english: "it is (it's)", portuguese: "ele/ela é / está" },
    { english: "we are (we're)", portuguese: "nós somos / estamos" },
    { english: "they are (they're)", portuguese: "eles/elas são / estão" },
  ];

  const newWords = [
    { english: "nurse", portuguese: "enfermeiro(a)" },
    { english: "doctor", portuguese: "médico(a)" },
    { english: "dentist", portuguese: "dentista" },
    { english: "sick", portuguese: "doente" },
    { english: "headache", portuguese: "dor de cabeça" },
    { english: "stomachache", portuguese: "dor de estômago" },
    { english: "sore throat", portuguese: "dor de garganta" },
    { english: "toothache", portuguese: "dor de dente" },
    { english: "cold", portuguese: "resfriado" },
    { english: "fever", portuguese: "febre" },
    { english: "appointment", portuguese: "compromisso / consulta" },
    { english: "pill", portuguese: "comprimido" },
    { english: "painkiller", portuguese: "analgésico" },
    { english: "health", portuguese: "saúde" },
    { english: "kind", portuguese: "gentil" },
    { english: "these", portuguese: "estes/estas" },
    { english: "those", portuguese: "aqueles/aquelas" },
  ];

  const usefulPhrases = [
    { english: "Take this medicine for your toothache.", portuguese: "Tome este remédio para sua dor de dente." },
    { english: "I feel better now.", portuguese: "Eu me sinto melhor agora." },
    { english: "I still have to go to the dentist.", portuguese: "Eu ainda tenho que ir ao dentista." },
    { english: "I'm in pain.", portuguese: "Eu estou com dor." }
  ];

  const grammarExamples = [
    { english: "I'm a teacher.", portuguese: "Eu sou professor." },
    { english: "You're a nurse.", portuguese: "Você é enfermeira." },
    { english: "She's late for her appointment.", portuguese: "Ela está atrasada para o compromisso." },
    { english: "He's still in pain.", portuguese: "Ele ainda está com dor." },
    { english: "It's early, let's watch a movie.", portuguese: "Está cedo, vamos assistir um filme." },
    { english: "We're friends.", portuguese: "Nós somos amigos." },
    { english: "You're great doctors.", portuguese: "Vocês são ótimos médicos." },
    { english: "They're at the hospital now.", portuguese: "Eles estão no hospital agora." }
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I have a headache.", portuguese: "Eu estou com dor de cabeça." },
    { english: "She has an appointment at the dentist today.", portuguese: "Ela tem uma consulta no dentista hoje." },
    { english: "Does he have a fever?", portuguese: "Ele está com febre?" },
    { english: "Take a painkiller for your toothache.", portuguese: "Tome um analgésico para sua dor de dente." },
    { english: "I think she has a stomachache.", portuguese: "Acho que ela está com dor de estômago." },
    { english: "I still take that medicine every day.", portuguese: "Eu ainda tomo aquele remédio todos os dias." },
    { english: "I'm in pain. I need to go to the hospital.", portuguese: "Estou com dor. Preciso ir ao hospital." },
    { english: "He is at the train station.", portuguese: "Ele está na estação de trem." },
    { english: "Drink a lot of water. It's good for your health.", portuguese: "Beba muita água. É bom para sua saúde." },
    { english: "The children are at home because they're sick.", portuguese: "As crianças estão em casa porque estão doentes." },
    { english: "Please take those reports to the doctor.", portuguese: "Por favor, leve aqueles relatórios ao médico." },
    { english: "Do you have to take these pills?", portuguese: "Você tem que tomar estes comprimidos?" },
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
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🏥 Lesson 37 - Health, Feelings & Professions
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about health issues, medical professions, feelings, and making appointments.
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
              <h2 className="text-2xl font-bold">🔹 VERBS (to be)</h2>
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
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am')}>I am</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am a teacher')}>I am a teacher</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am a doctor')}>I am a doctor</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu sou. / Eu sou professor. / Eu sou médico.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You are')}>You are</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('We are')}>We are</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are')}>They are</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você é. / Nós somos. / Eles são.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He is')}>He is</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is')}>She is</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele está. / Ela está.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is here')}>It is here</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is there')}>there</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is at home')}>at home</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Está aqui. / lá / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am at school')}>I am at school</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am at work')}>at work</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am at church')}>at church</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou na escola / no trabalho / na igreja</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are my friends')}>They are my friends</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are my classmates')}>classmates</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('They are my neighbors')}>neighbors</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles são meus amigos / colegas de classe / vizinhos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is good')}>It is good</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is bad')}>bad</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('It is funny')}>funny</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">É bom. / ruim / engraçado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('to be')}>to be</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I want to be')}>I want to be</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('He wants to be')}>He wants to be</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">ser / Eu quero ser. / Ele quer ser.</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do you want to be')}>What do you want to be</span>? / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What do they want to be')}>they</span> / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('What does he want to be')}>he</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">O que você quer ser? / eles / ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('I am')}>I am</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('She is')}>She is</span>. / <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800" onClick={() => playAudio('You are')}>You are</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu sou. / Ela é. / vocês são</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - NEW WORDS with Drill */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-green-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 NEW WORDS</h2>
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    1. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to the doctor')}>I need to talk to the doctor</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to the nurse')}>nurse</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to the dentist')}>dentist</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu preciso falar com o médico / enfermeiro / dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have to go to the hospital tomorrow')}>I have to go to the hospital tomorrow</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have to go to the doctor tomorrow')}>to the doctor</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have to go to the dentist tomorrow')}>to the dentist</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu tenho que ir ao hospital amanhã / ao médico / ao dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you know that doctor')}>Do you know that doctor</span>? / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you know that dentist')}>dentist</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you know that nurse')}>nurse</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você conhece aquele médico / dentista / enfermeira</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have an appointment at the dentist')}>I have an appointment at the dentist</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have an appointment at the doctor')}>at the doctor</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have an appointment at the hospital')}>at the hospital</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu tenho uma consulta no dentista / no médico / no hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have an appointment today')}>Do you have an appointment today</span>? / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have an appointment this afternoon')}>this afternoon</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have an appointment tomorrow')}>tomorrow</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você tem um compromisso hoje? / esta tarde / amanhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I do not like to take medicine')}>I don't like to take medicine</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I do not like to take painkillers')}>painkillers</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I do not like to take pills')}>pills</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu não gosto de tomar remédio / analgésicos / comprimidos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you need to take a painkiller')}>Do you need to take a painkiller</span>? / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Does she need to take a painkiller')}>She</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Does he need to take a painkiller')}>He</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você precisa tomar um analgésico? / Ela / Ele</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a headache')}>I have a headache</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a stomachache')}>stomachache</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I have a toothache')}>toothache</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou com dor de cabeça / dor de estômago / dor de dente</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My sister has a fever')}>My sister has a fever</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My sister has a sore throat')}>sore throat</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('My sister has a cold')}>cold</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Minha irmã está com febre / dor de garganta / está resfriada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He has a toothache')}>He has a toothache</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He has a headache')}>headache</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('He has a stomachache')}>stomachache</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele está com dor de dente / dor de cabeça / dor de estômago</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have a sore throat')}>Do you have a sore throat</span>? / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have a fever')}>fever</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('Do you have a cold')}>cold</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Você está com dor de garganta? / febre / resfriado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('When do you take these pills')}>When do you take these pills</span>? / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('When do you take these painkillers')}>painkillers</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Quando você toma estes comprimidos? / analgésicos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-green-200">
                  <p className="text-lg font-medium text-gray-800">
                    13. <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to those doctors')}>I need to talk to those doctors</span>. / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to those teachers')}>teachers</span> / <span className="text-green-600 font-bold cursor-pointer hover:text-green-800" onClick={() => playAudio('I need to talk to those nurses')}>nurses</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu preciso conversar com aqueles médicos / professores / enfermeiros</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - USEFUL PHRASES with Drill */}
        <div className="bg-white border-2 border-yellow-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-yellow-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 USEFUL PHRASES</h2>
              <p className="mt-2 text-yellow-100 italic">
                Pratique frases comuns para comunicação em situações de saúde
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
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <li key={index}>
                  <button 
                    onClick={() => playAudio(phrase.english)} 
                    className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800 transition-colors"
                  >
                    {phrase.english}
                  </button> = {phrase.portuguese}
                </li>
              ))}
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-yellow-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    1. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I prefer to drink tea for my stomachache')}>I prefer to drink tea for my stomachache</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I prefer to drink tea for my headache')}>headache</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I prefer to drink tea for my sore throat')}>sore throat</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu prefiro beber chá para minha dor de estômago / dor de cabeça / dor de garganta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I feel better now, thank you')}>I feel better now, thank you</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He feels better now')}>He feels</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('We feel better now')}>We feel</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu me sinto melhor agora, obrigado / Ele se sente / Nós nos sentimos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I still study in the morning')}>I still study in the morning</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I still study in the afternoon')}>in the afternoon</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I still study at night')}>at night</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu ainda estudo de manhã / à tarde / à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He still needs to go to the doctor')}>He still needs to go to the doctor</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He still needs to go to the dentist')}>to the dentist</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He still needs to go to the pharmacy')}>to the pharmacy</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele ainda precisa ir ao médico / ao dentista / à farmácia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I am in pain')}>I am in pain</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('She is in pain')}>She is</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('They are in pain')}>They are</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou com dor / Ela está / Eles estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-yellow-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('I am still in pain')}>I am still in pain</span>. / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('She is still in pain')}>She</span> / <span className="text-yellow-600 font-bold cursor-pointer hover:text-yellow-800" onClick={() => playAudio('He is still in pain')}>He</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu ainda estou com dor / Ela / Ele</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4 - GRAMMAR with Drill */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-purple-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 GRAMMAR</h2>
              <p className="mt-2 text-purple-100 italic">
                Estruturas completas com o verbo to be em frases afirmativas
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
                    1. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am a doctor')}>I'm a doctor</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am a dentist')}>dentist</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am a nurse')}>nurse</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu sou médico / dentista / enfermeiro</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    2. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is a teacher')}>She is a teacher</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is a nurse')}>nurse</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is a dentist')}>dentist</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela é professora / enfermeira / dentista</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    3. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is a dentist')}>He is a dentist</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is a teacher')}>teacher</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is a doctor')}>doctor</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele é dentista / professor / médico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    4. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is early')}>It's early</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is late')}>late</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is new')}>new</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Está cedo / tarde / novo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    5. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('That class is important')}>That class is important</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('That class is interesting')}>interesting</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('That class is great')}>great</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Aquela aula é importante / interessante / ótima</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    6. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is kind')}>She is kind</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is funny')}>funny</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is beautiful')}>beautiful</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ela é gentil / engraçada / bonita</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    7. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is Brazilian')}>He is Brazilian</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is American')}>American</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('He is British')}>British</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Ele é brasileiro / americano / britânico</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    8. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('I am sick')}>I am sick</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('She is sick')}>She is</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are sick')}>They are</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eu estou doente / Ela está / Eles estão</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    9. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are my parents')}>They are my parents</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are my grandparents')}>grandparents</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('They are my friends')}>friends</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Eles são meus pais / avós / amigos</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    10. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('These are my friends')}>These are my friends</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('Those are my teachers')}>Those are my teachers</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Estes são meus amigos / Aqueles são meus professores</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    11. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is good for your health')}>It is good for your health</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is important for your health')}>important</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('It is great for your health')}>great</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">É bom para sua saúde / importante / ótimo</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-purple-200">
                  <p className="text-lg font-medium text-gray-800">
                    12. <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are at home')}>We are at home</span>. / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are at the mall')}>at the mall</span> / <span className="text-purple-600 font-bold cursor-pointer hover:text-purple-800" onClick={() => playAudio('We are at the beach')}>at the beach</span>.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Nós estamos em casa / no shopping / na praia</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - REAL LIFE Practice */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-red-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔹 REAL LIFE</h2>
            <p className="mt-2 text-red-100 italic">
              Pratique situações reais sobre saúde, sentimentos e profissões
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-red-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
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

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={doctorImage}
                        alt="Doctor and patient"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Medical consultation
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
                      Feeling sick at home
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - CHECK IT OUT! (Explanatory) */}
        <div className="bg-white border-2 border-teal-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-teal-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🔹 CHECK IT OUT!</h2>
              <p className="mt-2 text-teal-100 italic">
                Get well soon, Bless you, This/These, That/Those, Contractions, and Asking about symptoms
              </p>
            </div>
            <button 
              onClick={() => setShowCheckItOutExplanation(!showCheckItOutExplanation)}
              className="text-sm bg-teal-600 hover:bg-teal-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {showCheckItOutExplanation ? 'Esconder Explicação' : 'Mostrar Explicação'}
            </button>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Expressions and Grammar */}
            <div className="bg-teal-900 text-white flex-1 p-6 space-y-4 text-lg">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">USEFUL EXPRESSIONS</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("Get well soon")}
                      className="font-bold text-xl text-yellow-200 hover:text-yellow-100 transition-colors"
                    >
                      Get well soon.
                    </button>
                    <p className="text-teal-200 text-sm mt-1">Melhoras.</p>
                    {showCheckItOutExplanation && (
                      <p className="text-teal-300 text-xs mt-2">Used when someone is sick to wish them a quick recovery.</p>
                    )}
                  </div>
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("Bless you")}
                      className="font-bold text-xl text-yellow-200 hover:text-yellow-100 transition-colors"
                    >
                      Bless you!
                    </button>
                    <p className="text-teal-200 text-sm mt-1">Saúde!</p>
                    {showCheckItOutExplanation && (
                      <p className="text-teal-300 text-xs mt-2">Said after someone sneezes. In English, we don't say "health" after a sneeze.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-teal-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">THIS / THAT vs THESE / THOSE</h3>
                </div>
                {showCheckItOutExplanation && (
                  <div className="mb-4 p-4 bg-teal-800 rounded-lg border border-teal-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">📚 Demonstratives Explanation:</p>
                    <ul className="text-teal-200 text-sm list-disc pl-4 space-y-1">
                      <li><strong>This</strong> (singular) - something near you: "This pill is for your headache."</li>
                      <li><strong>These</strong> (plural) - things near you: "These are my friends."</li>
                      <li><strong>That</strong> (singular) - something far: "That doctor is very kind."</li>
                      <li><strong>Those</strong> (plural) - things far: "Those are the pills you need."</li>
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("This is")}
                      className="font-bold text-teal-200 hover:text-white transition-colors"
                    >
                      this is
                    </button>
                    <p className="text-teal-300 text-sm">isto é / este é</p>
                  </div>
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("These are")}
                      className="font-bold text-teal-200 hover:text-white transition-colors"
                    >
                      these are
                    </button>
                    <p className="text-teal-300 text-sm">estes/estas são</p>
                  </div>
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("That is")}
                      className="font-bold text-teal-200 hover:text-white transition-colors"
                    >
                      that is
                    </button>
                    <p className="text-teal-300 text-sm">aquilo é / aquele é</p>
                  </div>
                  <div className="p-3 bg-teal-800 rounded-lg">
                    <button 
                      onClick={() => playAudio("Those are")}
                      className="font-bold text-teal-200 hover:text-white transition-colors"
                    >
                      those are
                    </button>
                    <p className="text-teal-300 text-sm">aqueles/aquelas são</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column - Contractions and Asking about symptoms */}
            <div className="bg-teal-800 text-white flex-1 p-6 space-y-4 text-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">CONTRACTIONS</h3>
                </div>
                {showCheckItOutExplanation && (
                  <div className="mb-4 p-4 bg-teal-900 rounded-lg border border-teal-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">📝 Contractions (short forms):</p>
                    <p className="text-teal-200 text-sm">Contractions make speech faster and more natural.</p>
                    <p className="text-teal-200 text-sm mt-1">Examples:</p>
                    <ul className="text-teal-200 text-sm list-disc pl-4">
                      <li>I am → I'm</li>
                      <li>You are → You're</li>
                      <li>He is → He's</li>
                      <li>She is → She's</li>
                      <li>It is → It's</li>
                      <li>We are → We're</li>
                      <li>They are → They're</li>
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">I'm</p>
                    <p className="text-teal-300 text-xs">I am</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">You're</p>
                    <p className="text-teal-300 text-xs">You are</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">He's</p>
                    <p className="text-teal-300 text-xs">He is</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">She's</p>
                    <p className="text-teal-300 text-xs">She is</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">It's</p>
                    <p className="text-teal-300 text-xs">It is</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">We're</p>
                    <p className="text-teal-300 text-xs">We are</p>
                  </div>
                  <div className="p-2 bg-teal-700 rounded-lg text-center">
                    <p className="font-bold">They're</p>
                    <p className="text-teal-300 text-xs">They are</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-teal-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">ASKING ABOUT SYMPTOMS</h3>
                </div>
                {showCheckItOutExplanation && (
                  <div className="mb-4 p-4 bg-teal-900 rounded-lg border border-teal-700">
                    <p className="text-yellow-200 text-sm font-medium mb-2">🩺 How to ask about health:</p>
                    <p className="text-teal-200 text-sm"><strong>"What's the matter?"</strong> = What is the problem?</p>
                    <p className="text-teal-200 text-sm mt-1">Other ways to ask:</p>
                    <ul className="text-teal-200 text-sm list-disc pl-4">
                      <li>What's wrong?</li>
                      <li>Are you okay?</li>
                      <li>How are you feeling?</li>
                    </ul>
                  </div>
                )}
                <div className="space-y-3">
                  <div className="p-3 bg-teal-700 rounded-lg">
                    <button 
                      onClick={() => playAudio("What's the matter?")}
                      className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors"
                    >
                      What's the matter?
                    </button>
                    <p className="text-teal-200 text-sm mt-1">O que houve? / Qual é o problema?</p>
                  </div>
                  <div className="p-3 bg-teal-700 rounded-lg">
                    <button 
                      onClick={() => playAudio("I have a toothache")}
                      className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors"
                    >
                      I have a toothache.
                    </button>
                    <p className="text-teal-200 text-sm mt-1">Estou com dor de dente.</p>
                  </div>
                  <div className="p-3 bg-teal-700 rounded-lg">
                    <button 
                      onClick={() => playAudio("I want to make an appointment to see a dentist")}
                      className="font-bold text-yellow-200 hover:text-yellow-100 transition-colors text-base"
                    >
                      I want to make an appointment to see a dentist.
                    </button>
                    <p className="text-teal-200 text-sm mt-1">Quero marcar uma consulta para ver um dentista.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson36")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (36)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson38")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (38) &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}