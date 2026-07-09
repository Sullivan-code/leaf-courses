"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'reading' | 'questions';
type AnswerKey = number | null;

export default function LessonOffshoreOQM_Lesson4() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    reading: false,
    questions: false,
  });
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<Record<number, boolean>>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTextRef = useRef<string>("");

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section]
    });
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const checkAnswer = (questionId: number, correctAnswer: string) => {
    const userAnswer = selectedAnswers[questionId];
    if (userAnswer && userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
      setShowAnswerFeedback(prev => ({
        ...prev,
        [questionId]: true
      }));
    } else {
      alert(`Incorrect! The correct answer is: "${correctAnswer}"`);
    }
  };

  const showAllCorrectAnswers = () => {
    setShowAllAnswers(true);
  };

  // Audio playback with progress tracking
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      
      // Also stop audio element if playing
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Google US English'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Play long text with audio element for progress bar
  const playLongText = (text: string) => {
    // Stop any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    // Create audio element with TTS (using Web Speech API with synthetic approach)
    // For progress bar, we'll simulate with a timer based on text length
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    // Use speech synthesis and simulate progress
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Samantha') || 
         voice.name.includes('Google US English'))
      );
      if (femaleVoice) utterance.voice = femaleVoice;
      
      // Estimate duration based on text length (approx 2.5 chars per second)
      const estimatedDuration = text.length / 2.5;
      setDuration(estimatedDuration);
      setCurrentTime(0);
      setIsPlaying(true);
      
      utterance.onend = () => {
        setIsPlaying(false);
        setCurrentTime(estimatedDuration);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
      };
      
      // Simulate progress
      const startTime = Date.now();
      const interval = setInterval(() => {
        if (!isPlaying) {
          clearInterval(interval);
          return;
        }
        const elapsed = (Date.now() - startTime) / 1000;
        if (elapsed >= estimatedDuration) {
          clearInterval(interval);
          setIsPlaying(false);
          setCurrentTime(estimatedDuration);
        } else {
          setCurrentTime(elapsed);
        }
      }, 100);
      
      utterance.onend = () => {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentTime(estimatedDuration);
      };
      
      window.speechSynthesis.speak(utterance);
      currentTextRef.current = text;
    }
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    // Restart speech at new position
    if (isPlaying) {
      window.speechSynthesis.cancel();
      const remainingText = currentTextRef.current.substring(Math.floor(newTime * 2.5));
      if (remainingText) {
        playLongText(remainingText);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Questions data for Lesson 4 - "My Last Days Offshore"
  const questions = [
    { id: 1, text: "What is the name of the person in the text?", correct: "Daniel" },
    { id: 2, text: "How many days does Daniel work offshore?", correct: "Fourteen days" },
    { id: 3, text: "How many days does Daniel stay at home?", correct: "Fourteen days" },
    { id: 4, text: "What day is today for Daniel?", correct: "Thirteenth day" },
    { id: 5, text: "What three things does Daniel need to check before leaving?", correct: "Pressure, temperature, and alarm panel" },
    { id: 6, text: "What does Daniel inspect before leaving?", correct: "A pump" },
    { id: 7, text: "Where does Daniel write everything?", correct: "In the logbook" },
    { id: 8, text: "What does Daniel do after his shift?", correct: "He talks with his friends and enjoys the sea view" },
    { id: 9, text: "What will Daniel do tomorrow?", correct: "Go home and spend time with his family" },
    { id: 10, text: "Is Daniel happy or sad to go home?", correct: "He is happy" }
  ];

  // Full reading text for Lesson 4
  const fullReadingText = `My name is Daniel. I work on an offshore platform. I work fourteen days offshore and fourteen days at home. Today is my thirteenth day offshore. I am happy because I will go home soon.

Before I leave, I need to check the pressure, the temperature, and the alarm panel. I also inspect a pump and write everything in the logbook. My job is important, so I must finish all my work before the next crew arrives.

After my shift, I talk with my friends and enjoy the sea view. Tomorrow, I will go home and spend time with my family. I can't wait!`;

  // --- Função para tocar o áudio do GitHub ---
  const playExternalAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
      }
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setDuration(audioRef.current?.duration || 0);
        })
        .catch(error => {
          console.error("Erro ao reproduzir o áudio:", error);
          alert("Não foi possível reproduzir o áudio. Verifique sua conexão ou tente novamente.");
        });
    }
  };

  // Atualiza a barra de progresso enquanto o áudio toca
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setCurrentTime(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    const handleEnd = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', handleEnd);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', handleEnd);
    };
  }, []);

  // Controle manual da barra de progresso
  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Carrega as vozes para o TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1600")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* ELEMENTO DE ÁUDIO OCULTO COM O ARQUIVO DO GITHUB - LESSON 4 */}
        <audio ref={audioRef} src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/readingtext-lesson4-offshore.mp3" preload="metadata" />

        {/* TITLE WITH OFFSHORE PLATFORM IMAGE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 4 - Offshore: My Last Days Offshore
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Meet Daniel and learn about his last days on the offshore platform. 🏠🌊
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Offshore oil platform at sunset"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - Last Days</p>
        </div>

        {/* SECTION 1 - READING TEXT with Audio Player */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">📖 Reading Text</h2>
              <p className="mt-2 text-blue-100 italic">Listen and read about Daniel&apos;s last days on the platform</p>
            </div>
            <button onClick={() => toggleDrill('reading')} className="rounded-full bg-white text-blue-600 px-6 py-2 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
              {openDrills.reading ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          <div className="p-8">
            {/* Audio Player with Progress Bar */}
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={playExternalAudio}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                >
                  {isPlaying ? "🔊 Playing..." : "🔊 Play Full Text (Audio Original)"}
                </button>
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleAudioSeek}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    disabled={!duration}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">💡 Clique no botão para ouvir o áudio original da lição. Clique em qualquer frase abaixo para ouvir a pronúncia individual.</p>
            </div>

            {/* Reading Text Content */}
            <div className="space-y-6">
              {/* Reading Text 1 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("My name is Daniel. I work on an offshore platform. I work fourteen days offshore and fourteen days at home.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-blue-600">My name is Daniel. I work on an offshore platform. I work fourteen days offshore and fourteen days at home.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Meu nome é Daniel. Eu trabalho em uma plataforma offshore. Eu trabalho quatorze dias offshore e quatorze dias em casa.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 2 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Today is my thirteenth day offshore. I am happy because I will go home soon.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-blue-600">Today is my thirteenth day offshore. I am happy because I will go home soon.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Hoje é o meu décimo terceiro dia offshore. Estou feliz porque vou para casa em breve.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 3 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Before I leave, I need to check the pressure, the temperature, and the alarm panel. I also inspect a pump and write everything in the logbook.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-blue-600">Before I leave, I need to check the pressure, the temperature, and the alarm panel. I also inspect a pump and write everything in the logbook.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Antes de eu sair, preciso verificar a pressão, a temperatura e o painel de alarmes. Também inspeciono uma bomba e escrevo tudo no livro de registros.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 4 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("My job is important, so I must finish all my work before the next crew arrives.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-blue-600">My job is important, so I must finish all my work before the next crew arrives.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Meu trabalho é importante, então devo terminar todo o meu trabalho antes da próxima equipe chegar.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 5 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("After my shift, I talk with my friends and enjoy the sea view. Tomorrow, I will go home and spend time with my family. I can't wait!")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-blue-600">After my shift, I talk with my friends and enjoy the sea view. Tomorrow, I will go home and spend time with my family. I can't wait!</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Depois do meu turno, converso com meus amigos e aprecio a vista do mar. Amanhã, vou para casa e passo tempo com minha família. Mal posso esperar!</span>
                  </p>
                )}
              </div>
            </div>

            {/* Questions & Answers inside Reading Text */}
            <div className="mt-8 pt-6 border-t-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold">❓ Questions & Answers</h3>
                    <p className="text-sm text-blue-100">Test your understanding of Daniel&apos;s routine</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={showAllCorrectAnswers} className="rounded-full bg-white text-blue-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
                      Show All Answers
                    </button>
                    <button onClick={() => toggleDrill('questions')} className="rounded-full bg-white text-blue-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
                      {openDrills.questions ? 'Hide Translations' : 'Show Translations'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="bg-blue-50 p-5 rounded-xl border border-blue-200 transition-all duration-300 hover:bg-blue-100">
                    <p className="text-gray-800 font-bold text-lg mb-3">
                      {q.id}️⃣ <button onClick={() => playAudio(q.text)} className="text-blue-600 hover:underline">{q.text}</button>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={selectedAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button
                        onClick={() => checkAnswer(q.id, q.correct)}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                      >
                        Check Answer ✓
                      </button>
                    </div>
                    
                    {(showAllAnswers || showAnswerFeedback[q.id]) && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg border-l-4 border-green-500 animate-fadeIn">
                        <p className="text-green-800 font-semibold">✅ Correct Answer:</p>
                        <p className="text-gray-700">{q.correct}</p>
                        {openDrills.questions && (
                          <p className="text-gray-500 mt-2 text-sm pt-2 border-t border-green-200">
                            📝 <span className="font-semibold">Portuguese:</span> {q.id === 1 && "Qual é o nome da pessoa no texto? → Daniel."}
                            {q.id === 2 && "Quantos dias Daniel trabalha offshore? → Quatorze dias."}
                            {q.id === 3 && "Quantos dias Daniel fica em casa? → Quatorze dias."}
                            {q.id === 4 && "Que dia é hoje para Daniel? → O décimo terceiro dia."}
                            {q.id === 5 && "Quais três coisas Daniel precisa verificar antes de sair? → Pressão, temperatura e painel de alarmes."}
                            {q.id === 6 && "O que Daniel inspeciona antes de sair? → Uma bomba."}
                            {q.id === 7 && "Onde Daniel escreve tudo? → No livro de registros."}
                            {q.id === 8 && "O que Daniel faz depois do turno? → Ele conversa com seus amigos e aprecia a vista do mar."}
                            {q.id === 9 && "O que Daniel fará amanhã? → Ir para casa e passar tempo com sua família."}
                            {q.id === 10 && "Daniel está feliz ou triste por ir para casa? → Ele está feliz."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - TUNE IN YOUR EARS with YouTube Video + Key Vocabulary Inside */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎧</span>
              <div>
                <h2 className="text-2xl font-bold">Tune In Your Ears!</h2>
                <p className="mt-1 text-blue-100 italic">Watch the video and practice the dialogue</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/jCrP37SN8LQ?list=PLnv2Qinw1PxTtlP2Pb_pqIKyweXfK5C_G&index=13"
                title="Offshore English Lesson - Key Vocabulary and Dialogue"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mb-6 text-sm">
              🔗 <a 
                href="https://www.youtube.com/watch?v=jCrP37SN8LQ&list=PLnv2Qinw1PxTtlP2Pb_pqIKyweXfK5C_G&index=13" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline font-semibold"
              >
                Watch on YouTube
              </a> - Practice listening and pronunciation
            </p>

            {/* Key Vocabulary Inside Tune In Your Ears */}
            <div className="border-t-2 border-blue-200 pt-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <h3 className="text-xl font-bold">Key Vocabulary From the Video</h3>
                    <p className="text-sm text-blue-100">Essential words for your daily watch</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="border border-blue-300 p-3 text-left text-blue-800 font-bold">English</th>
                      <th className="border border-blue-300 p-3 text-left text-blue-800 font-bold">Portuguese</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("offshore platform")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">offshore platform</td>
                      <td className="border border-blue-200 p-3 text-gray-700">plataforma offshore</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("fourteen days")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">fourteen days</td>
                      <td className="border border-blue-200 p-3 text-gray-700">quatorze dias</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("thirteenth day")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">thirteenth day</td>
                      <td className="border border-blue-200 p-3 text-gray-700">décimo terceiro dia</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("pressure")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">pressure</td>
                      <td className="border border-blue-200 p-3 text-gray-700">pressão</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("temperature")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">temperature</td>
                      <td className="border border-blue-200 p-3 text-gray-700">temperatura</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("alarm panel")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">alarm panel</td>
                      <td className="border border-blue-200 p-3 text-gray-700">painel de alarmes</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("inspect")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">inspect</td>
                      <td className="border border-blue-200 p-3 text-gray-700">inspecionar</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("pump")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">pump</td>
                      <td className="border border-blue-200 p-3 text-gray-700">bomba</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("logbook")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">logbook</td>
                      <td className="border border-blue-200 p-3 text-gray-700">livro de registros</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("crew")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">crew</td>
                      <td className="border border-blue-200 p-3 text-gray-700">equipe / tripulação</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("shift")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">shift</td>
                      <td className="border border-blue-200 p-3 text-gray-700">turno</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("sea view")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">sea view</td>
                      <td className="border border-blue-200 p-3 text-gray-700">vista do mar</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("family")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">family</td>
                      <td className="border border-blue-200 p-3 text-gray-700">família</td>
                    </tr>
                    <tr className="hover:bg-blue-50 cursor-pointer" onClick={() => playAudio("can't wait")}>
                      <td className="border border-blue-200 p-3 text-blue-600 font-medium">can't wait</td>
                      <td className="border border-blue-200 p-3 text-gray-700">mal posso esperar</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dialogue Section */}
            <div className="border-t-2 border-blue-200 pt-6 mt-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h3 className="text-xl font-bold">Dialogue From the Video</h3>
                    <p className="text-sm text-blue-100">Practice the conversation about the last days offshore</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Hey Daniel! How are you today?")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">Hey Daniel! How are you today?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Ei Daniel! Como você está hoje?</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I'm great! Today is my thirteenth day. I'm going home tomorrow!")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">I'm great! Today is my thirteenth day. I'm going home tomorrow!</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Estou ótimo! Hoje é meu décimo terceiro dia. Vou para casa amanhã!</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("That's wonderful! Did you finish all your work?")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">That's wonderful! Did you finish all your work?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Isso é maravilhoso! Você terminou todo o seu trabalho?</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("Almost. I need to check the pressure, temperature, and alarm panel one more time.")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">Almost. I need to check the pressure, temperature, and alarm panel one more time.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Quase. Preciso verificar a pressão, temperatura e painel de alarmes mais uma vez.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("And the pump? Did you inspect it?")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">And the pump? Did you inspect it?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 E a bomba? Você a inspecionou?</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("Yes, I already inspected the pump. I also wrote everything in the logbook.")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">Yes, I already inspected the pump. I also wrote everything in the logbook.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Sim, já inspecionei a bomba. Também escrevi tudo no livro de registros.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Great! The next crew will be happy with your work.")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">Great! The next crew will be happy with your work.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Ótimo! A próxima equipe ficará feliz com o seu trabalho.</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("Thanks! My job is important, so I must finish everything before I leave.")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">Thanks! My job is important, so I must finish everything before I leave.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Obrigado! Meu trabalho é importante, então devo terminar tudo antes de sair.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("What will you do after work today?")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">What will you do after work today?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 O que você vai fazer depois do trabalho hoje?</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I'll talk with my friends and enjoy the sea view one last time.")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">I'll talk with my friends and enjoy the sea view one last time.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Vou conversar com meus amigos e apreciar a vista do mar pela última vez.</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Enjoy it! Tomorrow you'll be home with your family.")}>
                  <p className="text-gray-800"><span className="font-bold text-blue-700">Rafael:</span> <span className="text-blue-600">Enjoy it! Tomorrow you'll be home with your family.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Aproveite! Amanhã você estará em casa com sua família.</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I can't wait! See you next rotation!")}>
                  <p className="text-gray-800"><span className="font-bold text-cyan-700">Daniel:</span> <span className="text-cyan-600">I can't wait! See you next rotation!</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Mal posso esperar! Vejo você na próxima rotação!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - USEFUL EXPRESSIONS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h2 className="text-2xl font-bold">Useful Expressions</h2>
                <p className="mt-1 text-blue-100 italic">Phrases you will use every day on the platform</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("How are you today?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">How are you today?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Como você está hoje?</p>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-xl cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I'm going home tomorrow.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-cyan-700">I'm going home tomorrow.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Vou para casa amanhã.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Did you finish all your work?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">Did you finish all your work?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Você terminou todo o seu trabalho?</p>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-xl cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I must finish everything before I leave.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-cyan-700">I must finish everything before I leave.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Devo terminar tudo antes de sair.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("I already inspected the pump.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">I already inspected the pump.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Já inspecionei a bomba.</p>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-xl cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("I wrote everything in the logbook.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-cyan-700">I wrote everything in the logbook.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Escrevi tudo no livro de registros.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("I can't wait!")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">I can't wait!</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Mal posso esperar!</p>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-xl cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("See you next rotation!")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-cyan-700">See you next rotation!</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Vejo você na próxima rotação!</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - WRAP UP with Key Vocabulary */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">Key vocabulary from Daniel&apos;s last days on the platform</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">DAYS OFFSHORE</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("fourteen days offshore")}>🗓️ fourteen days offshore</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("fourteen days at home")}>🏠 fourteen days at home</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("thirteenth day")}>📅 thirteenth day</p>
              <div className="mt-4 p-3 bg-blue-800 rounded-lg">
                <p className="text-sm">📝 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("Today is my thirteenth day offshore. I will go home soon.")}>"Today is my <span className="text-yellow-300">thirteenth</span> day offshore. I will go home soon."</p>
              </div>
            </div>
            
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-blue-200">
              <p className="text-black font-bold text-lg">⚙️ Daily Tasks</p>
              <p className="text-xs text-gray-500">Before leaving the platform</p>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">🔧 <span className="font-bold">Must Do:</span></p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("Check pressure")}>Check pressure</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("Check temperature")}>Check temperature</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("Check alarm panel")}>Check alarm panel</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("Inspect pump")}>Inspect pump</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("Write in logbook")}>Write in logbook</p>
              </div>
              <div className="mt-4 p-3 bg-cyan-50 rounded-lg">
                <p className="text-sm text-gray-700">💡 <span className="font-bold">Why?</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("My job is important, so I must finish all my work.")}>"My job is <span className="text-blue-600 font-semibold">important</span>, so I must finish all my work."</p>
              </div>
            </div>
            
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">AFTER WORK</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("talk with my friends")}>👥 talk with my friends</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("enjoy the sea view")}>🌊 enjoy the sea view</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("go home")}>🏠 go home</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("spend time with my family")}>👨‍👩‍👧‍👦 spend time with my family</p>
              <div className="mt-4 p-3 bg-blue-800 rounded-lg">
                <p className="text-sm">📝 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("Tomorrow, I will go home and spend time with my family. I can't wait!")}>"Tomorrow, I will <span className="text-yellow-300">go home</span> and <span className="text-yellow-300">spend time with my family</span>. <span className="text-yellow-300">I can't wait!</span>"</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">Remember:</span> Daniel works 14 days offshore and 14 days at home. He always finishes his work before leaving.</p>
            <p className="text-sm text-gray-600 mt-1">📝 <span className="font-semibold">Key Phrase:</span> <span className="text-blue-600 font-bold">"I can't wait!"</span> - Use this to express excitement!</p>
            <p className="text-sm text-gray-600 mt-1">🗣️ <span className="font-semibold">Pronunciation:</span> Click on any word or sentence to hear the correct pronunciation!</p>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/offshore/lesson5-offshore")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-cyan-600 hover:to-blue-700"
          >
            Next Lesson
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}