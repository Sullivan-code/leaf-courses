"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = 'verbs' | 'vocabulary' | 'usefulPhrases' | 'grammar';

export default function LessonPersonalInfoRoutine() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const playAudio = (text: string) => {
    // Map specific texts to their corresponding GitHub audio URLs
    const audioMap: Record<string, string> = {
      'to work': 'https://github.com/Sullivan-code/english-audios/raw/main/to-work.mp3',
      'to sleep': 'https://github.com/Sullivan-code/english-audios/raw/main/to-sleep.mp3',
      'company': 'https://github.com/Sullivan-code/english-audios/raw/main/company.mp3',
      'office': 'https://github.com/Sullivan-code/english-audios/raw/main/office.mp3',
      'bank': 'https://github.com/Sullivan-code/english-audios/raw/main/bank.mp3',
      'church': 'https://github.com/Sullivan-code/english-audios/raw/main/church.mp3',
      'drugstore': 'https://github.com/Sullivan-code/english-audios/raw/main/drugstore.mp3',
      'grocery store': 'https://github.com/Sullivan-code/english-audios/raw/main/grocery-store.mp3',
      'hospital': 'https://github.com/Sullivan-code/english-audios/raw/main/hospital.mp3',
      'gas station': 'https://github.com/Sullivan-code/english-audios/raw/main/gas-station.mp3',
      'job': 'https://github.com/Sullivan-code/english-audios/raw/main/job.mp3',
      'early': 'https://github.com/Sullivan-code/english-audios/raw/main/early.mp3',
      'late': 'https://github.com/Sullivan-code/english-audios/raw/main/late.mp3',
      'usually': 'https://github.com/Sullivan-code/english-audios/raw/main/usually.mp3',
      'now': 'https://github.com/Sullivan-code/english-audios/raw/main/now.mp3',
      'when': 'https://github.com/Sullivan-code/english-audios/raw/main/when.mp3',
      'but': 'https://github.com/Sullivan-code/english-audios/raw/main/but.mp3',
      'i work every day': 'https://github.com/Sullivan-code/english-audios/raw/main/i-work-every-day.mp3',
      'i sleep early during the week': 'https://github.com/Sullivan-code/english-audios/raw/main/i-sleep-early-during-the-week.mp3',
      'i work at a company': 'https://github.com/Sullivan-code/english-audios/raw/main/i-work-at-a-company.mp3',
      'she works at the bank': 'https://github.com/Sullivan-code/english-audios/raw/main/she-works-at-the-bank.mp3',
      'we go to the grocery store': 'https://github.com/Sullivan-code/english-audios/raw/main/we-go-to-the-grocery-store.mp3',
      'i usually wake up early': 'https://github.com/Sullivan-code/english-audios/raw/main/i-usually-wake-up-early.mp3',
      'i need to take a shower': 'https://github.com/Sullivan-code/english-audios/raw/main/i-need-to-take-a-shower.mp3',
      'i get up early every day': 'https://github.com/Sullivan-code/english-audios/raw/main/i-get-up-early-every-day.mp3',
      'i go to bed late': 'https://github.com/Sullivan-code/english-audios/raw/main/i-go-to-bed-late.mp3',
      'when do you need to go': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-need-to-go.mp3',
      'when do you read the news': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-read-the-news.mp3',
      'when do you have to go to the office': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-have-to-go-to-the-office.mp3',
      'when do they want to go to church': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-they-want-to-go-to-church.mp3',
      'i work at the bank': 'https://github.com/Sullivan-code/english-audios/raw/main/i-work-at-the-bank.mp3',
      'they don-t work at the hospital': 'https://github.com/Sullivan-code/english-audios/raw/main/they-dont-work-at-the-hospital.mp3',
      'we work at the gas station': 'https://github.com/Sullivan-code/english-audios/raw/main/we-work-at-the-gas-station.mp3',
      'do you work at the office': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work-at-the-office.mp3',
      'where do you work': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-work.mp3',
      'do you work every day': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work-every-day.mp3',
      'do you work from home': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work-from-home.mp3',
      'do you usually wake up early': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-usually-wake-up-early.mp3',
      'do you go to the bank often': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-go-to-the-bank-often.mp3',
      'do you get up early every day': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-get-up-early-every-day.mp3',
      'do you go to bed late': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-go-to-bed-late.mp3',
      'when do you take a shower': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-take-a-shower.mp3',
      'when do you go to the movies': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-go-to-the-movies.mp3',
      'when do you see your emails': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-see-your-emails.mp3',
      'when do you want to go to italy': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-want-to-go-to-italy.mp3',
      'when do you have to go to the hospital': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-have-to-go-to-the-hospital.mp3',
      'i have to go to the drugstore in the morning': 'https://github.com/Sullivan-code/english-audios/raw/main/i-have-to-go-to-the-drugstore-in-the-morning.mp3',
      'do you work at the bank or at the gas station': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work-at-the-bank-or-at-the-gas-station.mp3',
      'they work at the grocery store': 'https://github.com/Sullivan-code/english-audios/raw/main/they-work-at-the-grocery-store.mp3',
      'i usually see my friends at the coffee shop': 'https://github.com/Sullivan-code/english-audios/raw/main/i-usually-see-my-friends-at-the-coffee-shop.mp3',
      'i study but i don-t work': 'https://github.com/Sullivan-code/english-audios/raw/main/i-study-but-i-dont-work.mp3',
      'do you get up early': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-get-up-early.mp3',
      'do you have to go to the drugstore now': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-have-to-go-to-the-drugstore-now.mp3',
      'do you work at the hospital': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-work-at-the-hospital.mp3',
      'do you go to work late': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-go-to-work-late.mp3',
      'do you usually go to bed late': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-usually-go-to-bed-late.mp3',
      'do you go to the office in the afternoon': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-go-to-the-office-in-the-afternoon.mp3',
      'when do you have to go to the bank': 'https://github.com/Sullivan-code/english-audios/raw/main/when-do-you-have-to-go-to-the-bank.mp3',
      'where do you usually see your friends': 'https://github.com/Sullivan-code/english-audios/raw/main/where-do-you-usually-see-your-friends.mp3',
      'do you study or work': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-study-or-work.mp3',
      'do you go to bed early or late': 'https://github.com/Sullivan-code/english-audios/raw/main/do-you-go-to-bed-early-or-late.mp3',
      'she sleeps at 7': 'https://github.com/Sullivan-code/english-audios/raw/main/she-sleeps-at-7.mp3',
      'he sleeps at 11': 'https://github.com/Sullivan-code/english-audios/raw/main/he-sleeps-at-11.mp3',
      'we sleep at 11': 'https://github.com/Sullivan-code/english-audios/raw/main/we-sleep-at-11.mp3',
      'he works at the office': 'https://github.com/Sullivan-code/english-audios/raw/main/he-works-at-the-office.mp3',
      'she works at the hospital': 'https://github.com/Sullivan-code/english-audios/raw/main/she-works-at-the-hospital.mp3',
      'it opens at 8': 'https://github.com/Sullivan-code/english-audios/raw/main/it-opens-at-8.mp3',
      'he goes to work early': 'https://github.com/Sullivan-code/english-audios/raw/main/he-goes-to-work-early.mp3',
      'she gets up at 6': 'https://github.com/Sullivan-code/english-audios/raw/main/she-gets-up-at-6.mp3'
    };

    // Check if we have a direct mapping for this text
    const audioUrl = audioMap[text.toLowerCase()];
    
    if (audioUrl) {
      console.log('Tentando reproduzir áudio:', audioUrl);
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    } else {
      // Fallback: try to format the text for the GitHub URL
      const formattedText = text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s*\/\s*/g, '-or-')
        .replace(/'/g, '')
        .replace(/\?/g, '')
        .trim();
      
      const fallbackUrl = `https://github.com/Sullivan-code/english-audios/raw/main/${formattedText}.mp3`;
      console.log('Usando fallback URL:', fallbackUrl);
      
      const audio = new Audio(fallbackUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
    }
  };

  // URLs das imagens (unsplash para alta qualidade)
  const mainImage = "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";
  const cityImage = "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";
  const workImage = "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3";
  const routineImage = "https://images.unsplash.com/photo-1544717305-99670f9c28f4?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3";
  const sleepImage = "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.0.3";
  const morningRoutineImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1508138221679-760a23a2285b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* Título centralizado com imagem abaixo */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            LESSON 17 - Personal Information & Routine
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn how to talk about daily routines, places in the city, and work/study habits using the simple present tense. 📅🏢
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Daily routine and work habits"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Seção 1 - Verbos com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique nos verbos para ouvir a pronúncia e pratique suas formas
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('verbs')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('to work')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to work
                </button> = trabalhar
              </li>
              <li>
                <button 
                  onClick={() => playAudio('to sleep')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  to sleep
                </button> = dormir
              </li>
            </ul>
            
            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ela <span className="text-blue-600 font-bold">trabalha</span> / Ele <span className="text-blue-600 font-bold">trabalha</span> / Eles <span className="text-blue-600 font-bold">trabalham</span> / Nós <span className="text-blue-600 font-bold">trabalhamos</span> / Eu <span className="text-blue-600 font-bold">trabalho</span> / Você <span className="text-blue-600 font-bold">trabalha</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ela <span className="text-blue-600 font-bold">dorme</span> / Ele <span className="text-blue-600 font-bold">dorme</span> / Eles <span className="text-blue-600 font-bold">dormem</span> / Nós <span className="text-blue-600 font-bold">dormimos</span> / Eu <span className="text-blue-600 font-bold">durmo</span> / Você <span className="text-blue-600 font-bold">dorme</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela trabalha</span> no escritório? / <span className="text-blue-600 font-bold">Ele trabalha</span> no banco? / <span className="text-blue-600 font-bold">Você trabalha</span> em casa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela dorme</span> cedo? / <span className="text-blue-600 font-bold">Ele dorme</span> tarde? / <span className="text-blue-600 font-bold">Você dorme</span> bem?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Onde <span className="text-blue-600 font-bold">ele trabalha</span>? / Onde <span className="text-blue-600 font-bold">ela trabalha</span>? / Onde <span className="text-blue-600 font-bold">você trabalha</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Eu trabalho</span> todos os dias / <span className="text-blue-600 font-bold">Ela trabalha</span> de segunda a sexta / <span className="text-blue-600 font-bold">Eles trabalham</span> apenas pela manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Nós dormimos</span> oito horas por noite / <span className="text-blue-600 font-bold">Ela dorme</span> seis horas / <span className="text-blue-600 font-bold">Ele dorme</span> pouco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Você trabalha</span> aos finais de semana? / <span className="text-blue-600 font-bold">Eles trabalham</span> em feriados?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Eu não trabalho</span> aos domingos / <span className="text-blue-600 font-bold">Ela não dorme</span> durante o dia / <span className="text-blue-600 font-bold">Eles não trabalham</span> à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela trabalha</span> como médica? / <span className="text-blue-600 font-bold">Ele trabalha</span> como professor? / <span className="text-blue-600 font-bold">Você trabalha</span> como engenheiro?</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 2 - Vocabulário com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Clique em cada palavra para ouvir sua pronúncia correta
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('vocabulary')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li>
                <button 
                  onClick={() => playAudio('company')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  company
                </button> = empresa
              </li>
              <li>
                <button 
                  onClick={() => playAudio('office')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  office
                </button> = escritório
              </li>
              <li>
                <button 
                  onClick={() => playAudio('bank')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  bank
                </button> = banco
              </li>
              <li>
                <button 
                  onClick={() => playAudio('church')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  church
                </button> = igreja
              </li>
              <li>
                <button 
                  onClick={() => playAudio('drugstore')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  drugstore
                </button> = farmácia
              </li>
              <li>
                <button 
                  onClick={() => playAudio('grocery store')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  grocery store
                </button> = supermercado
              </li>
                            <li>
                <button 
                  onClick={() => playAudio('grocery store')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  remotely
                </button> = remotamente, de casa
              </li>
                                         <li>
                <button 
                  onClick={() => playAudio('grocery store')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  part-time job
                </button> = Emprego de meio período, Trabalho parcial
              </li>
              <li>
                <button 
                  onClick={() => playAudio('hospital')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  hospital
                </button> = hospital
              </li>
              <li>
                <button 
                  onClick={() => playAudio('gas station')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  gas station
                </button> = posto de gasolina
              </li>
              <li>
                <button 
                  onClick={() => playAudio('job')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  job
                </button> = trabalho, emprego
              </li>
              <li>
                <button 
                  onClick={() => playAudio('early')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  early
                </button> = cedo
              </li>
              <li>
                <button 
                  onClick={() => playAudio('late')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  late
                </button> = tarde, atrasado
              </li>
              <li>
                <button 
                  onClick={() => playAudio('usually')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  usually
                </button> = normalmente, geralmente
              </li>
              <li>
                <button 
                  onClick={() => playAudio('now')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  now
                </button> = agora
              </li>
              <li>
                <button 
                  onClick={() => playAudio('when')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  when
                </button> = quando
              </li>
              <li>
                <button 
                  onClick={() => playAudio('but')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  but
                </button> = mas, porém
              </li>
            </ul>
            
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('i work at a company')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I work at a company.
                </button> = Eu trabalho em uma empresa.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('she works at the bank')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  She works at the bank.
                </button> = Ela trabalha no banco.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('he works at the office')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  He works at the office.
                </button> = Ele trabalha no escritório.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('we go to the grocery store')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We go to the grocery store.
                </button> = Nós vamos ao supermercado.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i usually wake up early')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I usually wake up early.
                </button> = Eu normalmente acordo cedo.
              </p>
            </div>
            
            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Onde <span className="text-blue-600 font-bold">você trabalha</span>? / Onde <span className="text-blue-600 font-bold">ela trabalha</span>? / Onde <span className="text-blue-600 font-bold">ele trabalha</span>? / Onde <span className="text-blue-600 font-bold">eles trabalham</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela normalmente acorda</span> cedo? / <span className="text-blue-600 font-bold">Ele normalmente acorda</span> cedo? / <span className="text-blue-600 font-bold">Você normalmente acorda</span> cedo?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eles <span className="text-blue-600 font-bold">vão ao banco frequentemente</span>? / <span className="text-blue-600 font-bold">raramente</span> / <span className="text-blue-600 font-bold">sempre</span> / <span className="text-blue-600 font-bold">às vezes</span> / <span className="text-blue-600 font-bold">nunca</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ele <span className="text-blue-600 font-bold">trabalha em um escritório ou em casa</span>? / <span className="text-blue-600 font-bold">em casa</span> / <span className="text-blue-600 font-bold">remotamente</span> / <span className="text-blue-600 font-bold">em um hospital</span> / <span className="text-blue-600 font-bold">em uma escola</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eu <span className="text-blue-600 font-bold">trabalho no hospital / no banco / na empresa / na escola / no escritório / no supermercado</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ela <span className="text-blue-600 font-bold">vai à igreja aos domingos / ao banco / ao supermercado / à farmácia / ao posto de gasolina / ao hospital</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ele <span className="text-blue-600 font-bold">precisa ir à farmácia / ao posto de gasolina / ao hospital / ao banco / ao supermercado / à escola</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eu <span className="text-blue-600 font-bold">tenho um novo emprego / um bom emprego / um emprego em tempo parcial / um emprego em tempo integral / um emprego interessante</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ela <span className="text-blue-600 font-bold">acorda cedo / levanta cedo / vai dormir tarde / acorda tarde / levanta tarde</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ele <span className="text-blue-600 font-bold">chega tarde ao trabalho / à escola / à aula / à reunião / em casa</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Nós <span className="text-blue-600 font-bold">geralmente vamos ao cinema / ao parque / ao shopping / ao restaurante / à praia</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 3 - Frases Úteis com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Pratique frases comuns para falar sobre rotina diária
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('usefulPhrases')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>
                <button 
                  onClick={() => playAudio('i need to take a shower')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I need to take a shower.
                </button> = Eu preciso tomar banho.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i get up early every day')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I get up early every day.
                </button> = Eu acordo cedo todo dia.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('i go to bed late')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I go to bed late.
                </button> = Eu vou dormir tarde.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('he goes to work early')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  He goes to work early.
                </button> = Ele vai trabalhar cedo.
              </li>
              <li>
                <button 
                  onClick={() => playAudio('she gets up at 6')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  She gets up at 6.
                </button> = Ela acorda às 6.
              </li>
            </ul>
            
            {openDrills.usefulPhrases && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Você acorda cedo todo dia</span>? / <span className="text-blue-600 font-bold">Ela acorda cedo todo dia</span>? / <span className="text-blue-600 font-bold">Ele acorda cedo todo dia</span>? / <span className="text-blue-600 font-bold">Eles acordam cedo todo dia</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela vai dormir tarde</span>? / <span className="text-blue-600 font-bold">Ele vai dormir tarde</span>? / <span className="text-blue-600 font-bold">Eles vão dormir tarde</span>? / <span className="text-blue-600 font-bold">Você vai dormir tarde</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Quando <span className="text-blue-600 font-bold">você toma banho</span>? / <span className="text-blue-600 font-bold">ela toma banho</span>? / <span className="text-blue-600 font-bold">ele toma banho</span>? / <span className="text-blue-600 font-bold">eles tomam banho</span>? <span className="text-blue-600 font-bold">de manhã</span> / <span className="text-blue-600 font-bold">à noite</span> / <span className="text-blue-600 font-bold">à tarde</span> / <span className="text-blue-600 font-bold">de madrugada</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eu preciso <span className="text-blue-600 font-bold">ir trabalhar / à escola / ao banco / ao supermercado / à farmácia / ao hospital</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ela <span className="text-blue-600 font-bold">acorda às 6 da manhã / às 7 da manhã / às 8 da manhã / ao meio-dia / às 5 da manhã</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eles <span className="text-blue-600 font-bold">vão dormir à meia-noite / às 22h / às 23h / à 1h da manhã / cedo / tarde</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ele <span className="text-blue-600 font-bold">toma banho de manhã / à noite / à tarde / após o trabalho / antes de dormir</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Nós <span className="text-blue-600 font-bold">acordamos tarde nos finais de semana / aos sábados / aos domingos / durante as férias / nos feriados</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Ele <span className="text-blue-600 font-bold">vai dormir cedo durante a semana / nos dias úteis / de segunda a sexta</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Você precisa tomar banho agora?</span> / <span className="text-blue-600 font-bold">mais tarde</span> / <span className="text-blue-600 font-bold">amanhã</span> / <span className="text-blue-600 font-bold">antes do jantar</span> / <span className="text-blue-600 font-bold">após o café</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eu <span className="text-blue-600 font-bold">preciso acordar cedo amanhã / tenho que levantar cedo / vou dormir cedo hoje</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 4 - Gramática com Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Grammar - SIMPLE PRESENT (QUESTIONS & STATEMENTS)</h2>
              <p className="mt-2 text-blue-100 italic">
                Estruturas para fazer perguntas e negações com do/does
              </p>
            </div>
            <button 
              onClick={() => toggleDrill('grammar')}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? 'Ocultar Prática' : 'Mostrar Prática'}
            </button>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              <p>
                <button 
                  onClick={() => playAudio('when do you need to go')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  When do you need to go?
                </button> = Quando você precisa ir?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('when do you read the news')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  When do you read the news?
                </button> = Quando você lê as notícias?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('when do you have to go to the office')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  When do you have to go to the office?
                </button> = Quando você tem que ir ao escritório?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('when do they want to go to church')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  When do they want to go to church?
                </button> = Quando eles querem ir à igreja?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('i work at the bank')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  I work at the bank.
                </button> = Eu trabalho no banco.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('they don-t work at the hospital')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  They don't work at the hospital.
                </button> = Eles não trabalham no hospital.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('we work at the gas station')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  We work at the gas station.
                </button> = Nós trabalhamos no posto de gasolina.
              </p>
              <p>
                <button 
                  onClick={() => playAudio('do you work at the office')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  Do you work at the office?
                </button> = Você trabalha no escritório?
              </p>
              <p>
                <button 
                  onClick={() => playAudio('it opens at 8')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  It opens at 8.
                </button> = Ele (o estabelecimento) abre às 8.
              </p>
            </div>
            
            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Onde <span className="text-blue-600 font-bold">ela trabalha</span>? / Onde <span className="text-blue-600 font-bold">ele trabalha</span>? / Onde <span className="text-blue-600 font-bold">eles trabalham</span>? / Onde <span className="text-blue-600 font-bold">você trabalha</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ele trabalha</span> no hospital? / no banco / na empresa / na escola / no escritório / no supermercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Eles trabalham</span> no banco? / no escritório / no supermercado / na igreja / na farmácia / no hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela trabalha em um escritório ou em casa</span>? / <span className="text-blue-600 font-bold">em casa</span> / <span className="text-blue-600 font-bold">remotamente</span> / <span className="text-blue-600 font-bold">em um hospital</span> / <span className="text-blue-600 font-bold">em uma escola</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Quando <span className="text-blue-600 font-bold">ele vai ao cinema</span>? / <span className="text-blue-600 font-bold">à academia</span> / <span className="text-blue-600 font-bold">ao parque</span> / <span className="text-blue-600 font-bold">ao restaurante</span> / <span className="text-blue-600 font-bold">ao shopping</span> / <span className="text-blue-600 font-bold">à praia</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Quando <span className="text-blue-600 font-bold">ela vê seus emails</span>? / <span className="text-blue-600 font-bold">suas mensagens</span> / <span className="text-blue-600 font-bold">seus amigos</span> / <span className="text-blue-600 font-bold">sua família</span> / <span className="text-blue-600 font-bold">seus colegas</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Quando <span className="text-blue-600 font-bold">ele quer ir para a Itália</span>? / <span className="text-blue-600 font-bold">para a Espanha</span> / <span className="text-blue-600 font-bold">para os EUA</span> / <span className="text-blue-600 font-bold">para o Japão</span> / <span className="text-blue-600 font-bold">para a França</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Quando <span className="text-blue-600 font-bold">ela tem que ir ao hospital</span>? / <span className="text-blue-600 font-bold">ao médico</span> / <span className="text-blue-600 font-bold">ao dentista</span> / <span className="text-blue-600 font-bold">ao oftalmologista</span> / <span className="text-blue-600 font-bold">à farmácia</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">Eu <span className="text-blue-600 font-bold">tenho que ir à farmácia de manhã / à tarde / à noite / amanhã / hoje</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ele trabalha no banco ou no posto de gasolina</span>? / <span className="text-blue-600 font-bold">na empresa ou na escola</span>? / <span className="text-blue-600 font-bold">no hospital ou na clínica</span>?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Eles trabalham em um restaurante? / em um hotel / em uma escola / em uma loja / em uma empresa</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Ela também trabalha no hospital? / também / igualmente / da mesma forma</span></p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800"><span className="text-blue-600 font-bold">Eles não trabalham na escola ou na igreja</span> / <span className="text-blue-600 font-bold">nem no banco nem no hospital</span></p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice - CORRIGIDO COM AS FRASES SOLICITADAS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">REAL LIFE</h2>
            <p className="mt-2 text-blue-100 italic">
              Substitua as palavras em azul para praticar a pronúncia em situações reais
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Frases - 2/3 da largura em grandes */}
                <div className="lg:w-2/3 space-y-6">
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('they work at the grocery store')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          1. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('they work at')}
                          >They work at</span> the grocery store.
                        </p>
                        <p className="text-sm text-gray-600">Eles trabalham no supermercado.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i usually see my friends at the coffee shop')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          2. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('i usually see')}
                          >I usually see</span> my friends at the coffee shop.
                        </p>
                        <p className="text-sm text-gray-600">Eu geralmente vejo meus amigos na cafeteria.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('i study but i don-t work')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          3. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('i study')}
                          >I study,</span> but I don't work.
                        </p>
                        <p className="text-sm text-gray-600">Eu estudo, mas não trabalho.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you get up early')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          4. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you get up')}
                          >Do you get up</span> early?
                        </p>
                        <p className="text-sm text-gray-600">Você se levanta cedo?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you have to go to the drugstore now')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          5. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you have to go')}
                          >Do you have to go</span> to the drugstore now?
                        </p>
                        <p className="text-sm text-gray-600">Você tem que ir à farmácia agora?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you work at the hospital')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          6. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you work')}
                          >Do you work</span> at the hospital?
                        </p>
                        <p className="text-sm text-gray-600">Você trabalha no hospital?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you go to work late')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          7. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you go to work')}
                          >Do you go to work</span> late?
                        </p>
                        <p className="text-sm text-gray-600">Você vai trabalhar tarde?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you usually go to bed late')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          8. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you usually go to bed')}
                          >Do you usually go to bed</span> late?
                        </p>
                        <p className="text-sm text-gray-600">Você geralmente vai dormir tarde?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('do you go to the office in the afternoon')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          9. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('do you go to the office')}
                          >Do you go to the office</span> in the afternoon?
                        </p>
                        <p className="text-sm text-gray-600">Você vai para o escritório à tarde?</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start">
                      <button 
                        onClick={() => playAudio('when do you have to go to the bank')} 
                        className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                        aria-label="Play audio"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div>
                        <p className="text-lg font-medium">
                          10. <span className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                            onClick={() => playAudio('when do you have to go')}
                          >When do you have to go</span> to the bank?
                        </p>
                        <p className="text-sm text-gray-600">Quando você tem que ir ao banco?</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Container das imagens - 1/3 da largura em grandes */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={cityImage}
                        alt="Cidades e rotinas"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Lugares na cidade e rotinas diárias
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={workImage}
                        alt="Trabalho e estudo"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Trabalho, estudo e hábitos diários
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={morningRoutineImage}
                        alt="Rotina matinal"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Rotinas matinais e horários
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-64 w-full">
                      <img
                        src={sleepImage}
                        alt="Dormir"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Horários de sono e descanso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 6 - Assessment */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">ASSESSMENT</h2>
            <p className="mt-2 text-blue-100 italic">
              Responda as perguntas usando frases completas
            </p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">1. Give examples of things you read on your phone.</p>
                <p className="mt-2 text-gray-600">(Exemplo: I read news, emails, and messages on my phone.)</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">2. What words can you use to describe objects? (new, old, big, small)</p>
                <p className="mt-2 text-gray-600">(Exemplo: I have a new phone, an old car, a big house, and a small apartment.)</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">3. Give examples of places in the city.</p>
                <p className="mt-2 text-gray-600">(Exemplo: In my city, there is a bank, a hospital, a grocery store, and a gas station.)</p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-lg font-medium text-gray-800">4. What can you say to a waiter when you want to order food but eat at home?</p>
                <p className="mt-2 text-gray-600">(Exemplo: I'd like to order takeout, please. / Can I get this to go?)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 7 - Real Life Practice em Português */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">REAL LIFE</h2>
            <p className="mt-2 text-blue-100 italic">
              Responda oralmente às seguintes perguntas
            </p>
          </div>
          
          <div className="p-8">
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-lg font-medium text-gray-800">1. Onde você normalmente vê seus amigos?</p>
                <p className="text-sm text-gray-600 mt-1">(Exemplo: Eu normalmente vejo meus amigos na cafeteria / no parque / em casa)</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-lg font-medium text-gray-800">2. Você estuda ou trabalha?</p>
                <p className="text-sm text-gray-600 mt-1">(Exemplo: Eu estudo / Eu trabalho / Eu estudo e trabalho)</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-lg font-medium text-gray-800">3. Você vai dormir cedo ou tarde?</p>
                <p className="text-sm text-gray-600 mt-1">(Exemplo: Eu vou dormir cedo / Eu vou dormir tarde / Depende do dia)</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-lg font-medium text-gray-800">4. Quando você vai ao banco?</p>
                <p className="text-sm text-gray-600 mt-1">(Exemplo: Eu vou ao banco às segundas-feiras / quando preciso / uma vez por mês)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 8 - Check It Out - Numbers */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">CHECK IT OUT - NUMBERS</h2>
            <p className="mt-2 text-blue-100 italic">
              Pratique os números de 11 a 22
            </p>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">11</p>
                <p className="text-lg">eleven</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">12</p>
                <p className="text-lg">twelve</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">13</p>
                <p className="text-lg">thirteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">14</p>
                <p className="text-lg">fourteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">15</p>
                <p className="text-lg">fifteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">16</p>
                <p className="text-lg">sixteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">17</p>
                <p className="text-lg">seventeen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">18</p>
                <p className="text-lg">eighteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">19</p>
                <p className="text-lg">nineteen</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">20</p>
                <p className="text-lg">twenty</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">21</p>
                <p className="text-lg">twenty-one</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <p className="text-2xl font-bold text-blue-700">22</p>
                <p className="text-lg">twenty-two</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção 9 - Final Task */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">FINAL TASK</h2>
            <p className="mt-2 text-blue-100 italic">
              Fale sobre sua rotina:
            </p>
          </div>
          
          <div className="p-8">
            <div className="bg-green-50 p-6 rounded-2xl space-y-4">
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">1</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Where you work or study</h3>
                  <p className="text-gray-600">(Exemplo: I work at a company. / I study at a university.)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">2</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">What time you wake up</h3>
                  <p className="text-gray-600">(Exemplo: I wake up at 7 AM every day. / I usually wake up early.)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0">3</div>
                <div>
                  <h3 className="font-bold text-lg text-gray-800">Where you usually go during the week</h3>
                  <p className="text-gray-600">(Exemplo: During the week, I go to work, to the grocery store, and to the gym.)</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-gray-700 italic">💡 Dica: Use o Simple Present Tense para descrever sua rotina habitual!</p>
              <p className="mt-2 text-gray-600">Exemplo: "I work at a bank. I wake up at 6:30 AM. During the week, I go to the office, to the gym, and sometimes to the grocery store."</p>
            </div>
          </div>
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson16")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Lição Anterior
          </button>
          <button
            onClick={() => router.push("/cursos/lesson18")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Próxima Lição &rarr;
          </button>
        </div>  
      </div>
    </div>
  );
}