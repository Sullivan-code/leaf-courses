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
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">She works</span> / <span className="text-blue-600 font-bold">He works</span> / <span className="text-blue-600 font-bold">They work</span> / <span className="text-blue-600 font-bold">We work</span> / <span className="text-blue-600 font-bold">I work</span> / <span className="text-blue-600 font-bold">You work</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela trabalha / Ele trabalha / Eles trabalham / Nós trabalhamos / Eu trabalho / Você trabalha</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => playAudio('she works')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 She works</button>
                    <button onClick={() => playAudio('he works')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 He works</button>
                    <button onClick={() => playAudio('they work')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 They work</button>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">She sleeps</span> / <span className="text-blue-600 font-bold">He sleeps</span> / <span className="text-blue-600 font-bold">They sleep</span> / <span className="text-blue-600 font-bold">We sleep</span> / <span className="text-blue-600 font-bold">I sleep</span> / <span className="text-blue-600 font-bold">You sleep</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela dorme / Ele dorme / Eles dormem / Nós dormimos / Eu durmo / Você dorme</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button onClick={() => playAudio('she sleeps')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 She sleeps</button>
                    <button onClick={() => playAudio('he sleeps')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 He sleeps</button>
                    <button onClick={() => playAudio('they sleep')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🔊 They sleep</button>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she work</span> at the office? / <span className="text-blue-600 font-bold">Does he work</span> at the bank? / <span className="text-blue-600 font-bold">Do you work</span> from home?
                  </p>
                  <p className="text-gray-500 mt-1">Ela trabalha no escritório? / Ele trabalha no banco? / Você trabalha em casa?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she sleep</span> early? / <span className="text-blue-600 font-bold">Does he sleep</span> late? / <span className="text-blue-600 font-bold">Do you sleep</span> well?
                  </p>
                  <p className="text-gray-500 mt-1">Ela dorme cedo? / Ele dorme tarde? / Você dorme bem?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Where does he work</span>? / <span className="text-blue-600 font-bold">Where does she work</span>? / <span className="text-blue-600 font-bold">Where do you work</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Onde ele trabalha? / Onde ela trabalha? / Onde você trabalha?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">I work</span> every day / <span className="text-blue-600 font-bold">She works</span> from Monday to Friday / <span className="text-blue-600 font-bold">They work</span> only in the morning
                  </p>
                  <p className="text-gray-500 mt-1">Eu trabalho todos os dias / Ela trabalha de segunda a sexta / Eles trabalham apenas pela manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">We sleep</span> eight hours a night / <span className="text-blue-600 font-bold">She sleeps</span> six hours / <span className="text-blue-600 font-bold">He sleeps</span> a little
                  </p>
                  <p className="text-gray-500 mt-1">Nós dormimos oito horas por noite / Ela dorme seis horas / Ele dorme pouco</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Do you work</span> on weekends? / <span className="text-blue-600 font-bold">Do they work</span> on holidays?
                  </p>
                  <p className="text-gray-500 mt-1">Você trabalha aos finais de semana? / Eles trabalham em feriados?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">I don't work</span> on Sundays / <span className="text-blue-600 font-bold">She doesn't sleep</span> during the day / <span className="text-blue-600 font-bold">They don't work</span> at night
                  </p>
                  <p className="text-gray-500 mt-1">Eu não trabalho aos domingos / Ela não dorme durante o dia / Eles não trabalham à noite</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she work</span> as a doctor? / <span className="text-blue-600 font-bold">Does he work</span> as a teacher? / <span className="text-blue-600 font-bold">Do you work</span> as an engineer?
                  </p>
                  <p className="text-gray-500 mt-1">Ela trabalha como médica? / Ele trabalha como professor? / Você trabalha como engenheiro?</p>
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
                  onClick={() => playAudio('remotely')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  remotely
                </button> = remotamente, de casa
              </li>
              <li>
                <button 
                  onClick={() => playAudio('part-time job')} 
                  className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                >
                  part-time job
                </button> = emprego de meio período
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
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Where do you work</span>? / <span className="text-blue-600 font-bold">Where does she work</span>? / <span className="text-blue-600 font-bold">Where does he work</span>? / <span className="text-blue-600 font-bold">Where do they work</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Onde você trabalha? / Onde ela trabalha? / Onde ele trabalha? / Onde eles trabalham?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she usually wake up</span> early? / <span className="text-blue-600 font-bold">Does he usually wake up</span> early? / <span className="text-blue-600 font-bold">Do you usually wake up</span> early?
                  </p>
                  <p className="text-gray-500 mt-1">Ela normalmente acorda cedo? / Ele normalmente acorda cedo? / Você normalmente acorda cedo?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    Do they <span className="text-blue-600 font-bold">go to the bank often</span>? / <span className="text-blue-600 font-bold">rarely</span> / <span className="text-blue-600 font-bold">always</span> / <span className="text-blue-600 font-bold">sometimes</span> / <span className="text-blue-600 font-bold">never</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eles vão ao banco frequentemente? / raramente / sempre / às vezes / nunca</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    Does he <span className="text-blue-600 font-bold">work at an office or at home</span>? / <span className="text-blue-600 font-bold">at home</span> / <span className="text-blue-600 font-bold">remotely</span> / <span className="text-blue-600 font-bold">at a hospital</span> / <span className="text-blue-600 font-bold">at a school</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ele trabalha em um escritório ou em casa? / em casa / remotamente / em um hospital / em uma escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span className="text-blue-600 font-bold">work at the hospital / at the bank / at the company / at the school / at the office / at the grocery store</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eu trabalho no hospital / no banco / na empresa / na escola / no escritório / no supermercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <span className="text-blue-600 font-bold">goes to church on Sundays / to the bank / to the grocery store / to the drugstore / to the gas station / to the hospital</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela vai à igreja aos domingos / ao banco / ao supermercado / à farmácia / ao posto de gasolina / ao hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <span className="text-blue-600 font-bold">needs to go to the drugstore / to the gas station / to the hospital / to the bank / to the grocery store / to school</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ele precisa ir à farmácia / ao posto de gasolina / ao hospital / ao banco / ao supermercado / à escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    I have <span className="text-blue-600 font-bold">a new job / a good job / a part-time job / a full-time job / an interesting job</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eu tenho um novo emprego / um bom emprego / um emprego em tempo parcial / um emprego em tempo integral / um emprego interessante</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <span className="text-blue-600 font-bold">wakes up early / gets up early / goes to bed late / wakes up late / gets up late</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela acorda cedo / levanta cedo / vai dormir tarde / acorda tarde / levanta tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <span className="text-blue-600 font-bold">arrives late to work / to school / to class / to the meeting / at home</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ele chega tarde ao trabalho / à escola / à aula / à reunião / em casa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <span className="text-blue-600 font-bold">usually go to the movies / to the park / to the mall / to the restaurant / to the beach</span>
                  </p>
                  <p className="text-gray-500 mt-1">Nós geralmente vamos ao cinema / ao parque / ao shopping / ao restaurante / à praia</p>
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
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Do you get up early every day</span>? / <span className="text-blue-600 font-bold">Does she get up early every day</span>? / <span className="text-blue-600 font-bold">Does he get up early every day</span>? / <span className="text-blue-600 font-bold">Do they get up early every day</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Você acorda cedo todo dia? / Ela acorda cedo todo dia? / Ele acorda cedo todo dia? / Eles acordam cedo todo dia?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she go to bed late</span>? / <span className="text-blue-600 font-bold">Does he go to bed late</span>? / <span className="text-blue-600 font-bold">Do they go to bed late</span>? / <span className="text-blue-600 font-bold">Do you go to bed late</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Ela vai dormir tarde? / Ele vai dormir tarde? / Eles vão dormir tarde? / Você vai dormir tarde?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <span className="text-blue-600 font-bold">do you take a shower</span>? / <span className="text-blue-600 font-bold">does she take a shower</span>? / <span className="text-blue-600 font-bold">does he take a shower</span>? / <span className="text-blue-600 font-bold">do they take a shower</span>? <span className="text-blue-600 font-bold">in the morning</span> / <span className="text-blue-600 font-bold">at night</span> / <span className="text-blue-600 font-bold">in the afternoon</span> / <span className="text-blue-600 font-bold">early in the morning</span>
                  </p>
                  <p className="text-gray-500 mt-1">Quando você toma banho? / ela toma banho? / ele toma banho? / eles tomam banho? de manhã / à noite / à tarde / de madrugada</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    I need to <span className="text-blue-600 font-bold">go to work / go to school / go to the bank / go to the grocery store / go to the drugstore / go to the hospital</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eu preciso ir trabalhar / à escola / ao banco / ao supermercado / à farmácia / ao hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    She <span className="text-blue-600 font-bold">wakes up at 6 AM / at 7 AM / at 8 AM / at noon / at 5 AM</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela acorda às 6 da manhã / às 7 da manhã / às 8 da manhã / ao meio-dia / às 5 da manhã</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    They <span className="text-blue-600 font-bold">go to bed at midnight / at 10 PM / at 11 PM / at 1 AM / early / late</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eles vão dormir à meia-noite / às 22h / às 23h / à 1h da manhã / cedo / tarde</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <span className="text-blue-600 font-bold">takes a shower in the morning / at night / in the afternoon / after work / before sleeping</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ele toma banho de manhã / à noite / à tarde / após o trabalho / antes de dormir</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    We <span className="text-blue-600 font-bold">wake up late on weekends / on Saturdays / on Sundays / during vacation / on holidays</span>
                  </p>
                  <p className="text-gray-500 mt-1">Nós acordamos tarde nos finais de semana / aos sábados / aos domingos / durante as férias / nos feriados</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    He <span className="text-blue-600 font-bold">goes to bed early during the week / on weekdays / from Monday to Friday</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ele vai dormir cedo durante a semana / nos dias úteis / de segunda a sexta</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Do you need to take a shower now</span>? / <span className="text-blue-600 font-bold">later</span> / <span className="text-blue-600 font-bold">tomorrow</span> / <span className="text-blue-600 font-bold">before dinner</span> / <span className="text-blue-600 font-bold">after breakfast</span>
                  </p>
                  <p className="text-gray-500 mt-1">Você precisa tomar banho agora? / mais tarde / amanhã / antes do jantar / após o café</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span className="text-blue-600 font-bold">need to wake up early tomorrow / have to get up early / am going to sleep early tonight</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eu preciso acordar cedo amanhã / tenho que levantar cedo / vou dormir cedo hoje</p>
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
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Where does she work</span>? / <span className="text-blue-600 font-bold">Where does he work</span>? / <span className="text-blue-600 font-bold">Where do they work</span>? / <span className="text-blue-600 font-bold">Where do you work</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Onde ela trabalha? / Onde ele trabalha? / Onde eles trabalham? / Onde você trabalha?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does he work</span> at the hospital? / at the bank / at the company / at the school / at the office / at the grocery store
                  </p>
                  <p className="text-gray-500 mt-1">Ele trabalha no hospital? / no banco / na empresa / na escola / no escritório / no supermercado</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Do they work</span> at the bank? / at the office / at the grocery store / at the church / at the drugstore / at the hospital
                  </p>
                  <p className="text-gray-500 mt-1">Eles trabalham no banco? / no escritório / no supermercado / na igreja / na farmácia / no hospital</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she work at an office or at home</span>? / <span className="text-blue-600 font-bold">at home</span> / <span className="text-blue-600 font-bold">remotely</span> / <span className="text-blue-600 font-bold">at a hospital</span> / <span className="text-blue-600 font-bold">at a school</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela trabalha em um escritório ou em casa? / em casa / remotamente / em um hospital / em uma escola</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <span className="text-blue-600 font-bold">does he go to the movies</span>? / <span className="text-blue-600 font-bold">to the gym</span> / <span className="text-blue-600 font-bold">to the park</span> / <span className="text-blue-600 font-bold">to the restaurant</span> / <span className="text-blue-600 font-bold">to the mall</span> / <span className="text-blue-600 font-bold">to the beach</span>
                  </p>
                  <p className="text-gray-500 mt-1">Quando ele vai ao cinema? / à academia / ao parque / ao restaurante / ao shopping / à praia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <span className="text-blue-600 font-bold">does she see her emails</span>? / <span className="text-blue-600 font-bold">her messages</span> / <span className="text-blue-600 font-bold">her friends</span> / <span className="text-blue-600 font-bold">her family</span> / <span className="text-blue-600 font-bold">her colleagues</span>
                  </p>
                  <p className="text-gray-500 mt-1">Quando ela vê seus emails? / suas mensagens / seus amigos / sua família / seus colegas</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <span className="text-blue-600 font-bold">does he want to go to Italy</span>? / <span className="text-blue-600 font-bold">to Spain</span> / <span className="text-blue-600 font-bold">to the USA</span> / <span className="text-blue-600 font-bold">to Japan</span> / <span className="text-blue-600 font-bold">to France</span>
                  </p>
                  <p className="text-gray-500 mt-1">Quando ele quer ir para a Itália? / para a Espanha / para os EUA / para o Japão / para a França</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    When <span className="text-blue-600 font-bold">does she have to go to the hospital</span>? / <span className="text-blue-600 font-bold">to the doctor</span> / <span className="text-blue-600 font-bold">to the dentist</span> / <span className="text-blue-600 font-bold">to the eye doctor</span> / <span className="text-blue-600 font-bold">to the drugstore</span>
                  </p>
                  <p className="text-gray-500 mt-1">Quando ela tem que ir ao hospital? / ao médico / ao dentista / ao oftalmologista / à farmácia</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    I <span className="text-blue-600 font-bold">have to go to the drugstore in the morning / in the afternoon / at night / tomorrow / today</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eu tenho que ir à farmácia de manhã / à tarde / à noite / amanhã / hoje</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does he work at the bank or at the gas station</span>? / <span className="text-blue-600 font-bold">at the company or at the school</span>? / <span className="text-blue-600 font-bold">at the hospital or at the clinic</span>?
                  </p>
                  <p className="text-gray-500 mt-1">Ele trabalha no banco ou no posto de gasolina? / na empresa ou na escola? / no hospital ou na clínica?</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Do they work at a restaurant? / at a hotel / at a school / at a store / at a company</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eles trabalham em um restaurante? / em um hotel / em uma escola / em uma loja / em uma empresa</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">Does she also work at the hospital? / too / as well / likewise</span>
                  </p>
                  <p className="text-gray-500 mt-1">Ela também trabalha no hospital? / também / igualmente / da mesma forma</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600 font-bold">They don't work at the school or at the church</span> / <span className="text-blue-600 font-bold">neither at the bank nor at the hospital</span>
                  </p>
                  <p className="text-gray-500 mt-1">Eles não trabalham na escola ou na igreja / nem no banco nem no hospital</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seção 5 - Real Life Practice - COM PALAVRAS EM AZUL PARA SUBSTITUIÇÃO */}
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
                          >They work at</span> the <span className="text-blue-600 font-bold">grocery store</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eles trabalham no supermercado.</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('bank')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏦 bank</button>
                          <button onClick={() => playAudio('hospital')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏥 hospital</button>
                          <button onClick={() => playAudio('office')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏢 office</button>
                          <button onClick={() => playAudio('school')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏫 school</button>
                        </div>
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
                          >I usually see</span> my friends at the <span className="text-blue-600 font-bold">coffee shop</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu geralmente vejo meus amigos na cafeteria.</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('restaurant')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🍽️ restaurant</button>
                          <button onClick={() => playAudio('park')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌳 park</button>
                          <button onClick={() => playAudio('mall')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🛍️ mall</button>
                          <button onClick={() => playAudio('beach')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏖️ beach</button>
                        </div>
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
                          >I study</span>, but <span className="text-blue-600 font-bold">I don't work</span>.
                        </p>
                        <p className="text-sm text-gray-600">Eu estudo, mas não trabalho.</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('i work')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">💼 I work</button>
                          <button onClick={() => playAudio('i travel')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">✈️ I travel</button>
                          <button onClick={() => playAudio('i stay home')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏠 I stay home</button>
                        </div>
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
                          >Do you get up</span> <span className="text-blue-600 font-bold">early</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você se levanta cedo?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('late')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">⏰ late</button>
                          <button onClick={() => playAudio('at 6 AM')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕕 at 6 AM</button>
                          <button onClick={() => playAudio('at 7 AM')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕖 at 7 AM</button>
                          <button onClick={() => playAudio('at 8 AM')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕗 at 8 AM</button>
                        </div>
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
                          >Do you have to go</span> to the <span className="text-blue-600 font-bold">drugstore</span> <span className="text-blue-600 font-bold">now</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você tem que ir à farmácia agora?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('bank')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏦 bank</button>
                          <button onClick={() => playAudio('grocery store')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🛒 grocery store</button>
                          <button onClick={() => playAudio('hospital')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏥 hospital</button>
                          <button onClick={() => playAudio('later')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">⏰ later</button>
                          <button onClick={() => playAudio('tomorrow')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📅 tomorrow</button>
                        </div>
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
                          >Do you work</span> at the <span className="text-blue-600 font-bold">hospital</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você trabalha no hospital?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('bank')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏦 bank</button>
                          <button onClick={() => playAudio('office')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏢 office</button>
                          <button onClick={() => playAudio('school')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏫 school</button>
                          <button onClick={() => playAudio('company')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏭 company</button>
                        </div>
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
                          >Do you go to work</span> <span className="text-blue-600 font-bold">late</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você vai trabalhar tarde?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('early')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌅 early</button>
                          <button onClick={() => playAudio('on time')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">⏱️ on time</button>
                          <button onClick={() => playAudio('by bus')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🚌 by bus</button>
                          <button onClick={() => playAudio('by car')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🚗 by car</button>
                        </div>
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
                          >Do you usually go to bed</span> <span className="text-blue-600 font-bold">late</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você geralmente vai dormir tarde?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('early')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌙 early</button>
                          <button onClick={() => playAudio('at 10 PM')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕙 at 10 PM</button>
                          <button onClick={() => playAudio('at 11 PM')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕚 at 11 PM</button>
                          <button onClick={() => playAudio('at midnight')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🕛 at midnight</button>
                        </div>
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
                          >Do you go to the office</span> <span className="text-blue-600 font-bold">in the afternoon</span>?
                        </p>
                        <p className="text-sm text-gray-600">Você vai para o escritório à tarde?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('in the morning')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌄 in the morning</button>
                          <button onClick={() => playAudio('at night')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🌙 at night</button>
                          <button onClick={() => playAudio('every day')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📅 every day</button>
                          <button onClick={() => playAudio('on Mondays')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📆 on Mondays</button>
                        </div>
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
                          >When do you have to go</span> to the <span className="text-blue-600 font-bold">bank</span>?
                        </p>
                        <p className="text-sm text-gray-600">Quando você tem que ir ao banco?</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          <button onClick={() => playAudio('grocery store')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🛒 grocery store</button>
                          <button onClick={() => playAudio('drugstore')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">💊 drugstore</button>
                          <button onClick={() => playAudio('hospital')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">🏥 hospital</button>
                          <button onClick={() => playAudio('today')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📅 today</button>
                          <button onClick={() => playAudio('tomorrow')} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">📅 tomorrow</button>
                        </div>
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