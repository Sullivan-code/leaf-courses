"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'reading' | 'questions';
type AnswerKey = number | null;

export default function LessonOffshoreOQM_Lesson2() {
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

  // Questions data
  const questions = [
    { id: 2, text: "Where does Lucas work?", correct: "He works on an offshore platform." },
    { id: 3, text: "What does Lucas do every morning before his watch starts?", correct: "He drinks a cup of coffee and looks at the sky." },
    { id: 4, text: "Where does Lucas work on the platform?", correct: "He works in the engine room." },
    { id: 5, text: "What three things does Lucas check in the engine room?", correct: "He checks the pressure, the temperature, and the alarm panel." },
    { id: 6, text: "What kind of problems does Lucas sometimes deal with?", correct: "He deals with a small leak or a problem with a pump." },
    { id: 7, text: "Does Lucas like his job?", correct: "Yes, he likes his job." },
    { id: 8, text: "What does Lucas do after work?", correct: "He talks with his friends and enjoys the sea view." }
  ];

  // Full reading text
  const fullReadingText = `My name is Lucas. I work on an offshore platform. Every morning, I drink a cup of coffee and look at the sky before my watch starts. I work in the engine room. I check the pressure, the temperature, and the alarm panel. Sometimes, I deal with a small leak or a problem with a pump. My job is important, but I like it. After work, I talk with my friends and enjoy the sea view.`;

  // --- CORREÇÃO PRINCIPAL: Função para tocar o áudio do GitHub ---
  const playExternalAudio = () => {
    if (audioRef.current) {
      // Se o áudio já estiver tocando, pausa e reinicia
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(0);
        // Opcional: Se quiser continuar a reprodução do ponto atual, remova as linhas acima.
      }
      // Toca o áudio
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
        
        {/* ELEMENTO DE ÁUDIO OCULTO COM O ARQUIVO DO GITHUB */}
        <audio ref={audioRef} src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/readingtext-lesson2-offshore.mp3" preload="metadata" />

        {/* TITLE WITH OFFSHORE PLATFORM IMAGE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 2 - Offshore: My Daily Routine
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Meet Lucas and learn about his daily life on the offshore platform. 🌅☕
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Offshore oil platform at sunrise"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - Morning Shift</p>
        </div>

        {/* SECTION 1 - READING TEXT with Audio Player */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">📖 Reading Text</h2>
              <p className="mt-2 text-orange-100 italic">Listen and read about Lucas&apos;s day on the platform</p>
            </div>
            <button onClick={() => toggleDrill('reading')} className="rounded-full bg-white text-red-600 px-6 py-2 text-sm font-semibold transition-all duration-300 hover:bg-orange-100">
              {openDrills.reading ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          <div className="p-8">
            {/* Audio Player with Progress Bar - MODIFICADO PARA USAR O ÁUDIO EXTERNO */}
            <div className="mb-6 bg-red-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={playExternalAudio}
                  className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:from-red-700 hover:to-orange-600 transition-all duration-300"
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
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
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

            {/* ... TODO O CONTEÚDO DO READING TEXT (frases com onClick para playAudio) permanece IDENTICO ... */}
            <div className="space-y-6">
              {/* Reading Text 1 */}
              <div className="bg-orange-50 p-6 rounded-2xl border-l-8 border-red-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("My name is Lucas. I work on an offshore platform. Every morning, I drink a cup of coffee and look at the sky before my watch starts.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-red-600">My name is Lucas. I work on an offshore platform. Every morning, I drink a cup of coffee and look at the sky before my watch starts.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-orange-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Meu nome é Lucas. Eu trabalho em uma plataforma offshore. Todas as manhãs, eu tomo uma xícara de café e olho para o céu antes do meu turno começar.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 2 */}
              <div className="bg-orange-50 p-6 rounded-2xl border-l-8 border-red-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("I work in the engine room. I check the pressure, the temperature, and the alarm panel. Sometimes, I deal with a small leak or a problem with a pump.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-red-600">I work in the engine room. I check the pressure, the temperature, and the alarm panel. Sometimes, I deal with a small leak or a problem with a pump.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-orange-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Eu trabalho na casa de máquinas. Eu verifico a pressão, a temperatura e o painel de alarmes. Às vezes, eu lido com um pequeno vazamento ou um problema com uma bomba.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 3 */}
              <div className="bg-orange-50 p-6 rounded-2xl border-l-8 border-red-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("My job is important, but I like it. After work, I talk with my friends and enjoy the sea view.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇬🇧 <span className="font-bold text-red-600">My job is important, but I like it. After work, I talk with my friends and enjoy the sea view.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-orange-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Meu trabalho é importante, mas eu gosto dele. Depois do trabalho, eu converso com meus amigos e aprecio a vista do mar.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Questions & Answers inside Reading Text */}
            <div className="mt-8 pt-6 border-t-2 border-red-200">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold">❓ Questions & Answers</h3>
                    <p className="text-sm text-orange-100">Test your understanding of Lucas&apos;s routine</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={showAllCorrectAnswers} className="rounded-full bg-white text-red-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-orange-100">
                      Show All Answers
                    </button>
                    <button onClick={() => toggleDrill('questions')} className="rounded-full bg-white text-red-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-orange-100">
                      {openDrills.questions ? 'Hide Translations' : 'Show Translations'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="bg-red-50 p-5 rounded-xl border border-orange-200 transition-all duration-300 hover:bg-red-100">
                    <p className="text-gray-800 font-bold text-lg mb-3">
                      {q.id}️⃣ <button onClick={() => playAudio(q.text)} className="text-red-600 hover:underline">{q.text}</button>
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Type your answer here..."
                        value={selectedAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                      />
                      <button
                        onClick={() => checkAnswer(q.id, q.correct)}
                        className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-orange-600 transition-all duration-300"
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
                            📝 <span className="font-semibold">Portuguese:</span>{" "}
                            {q.id === 2 && "Onde o Lucas trabalha? → Ele trabalha em uma plataforma offshore."}
                            {q.id === 3 && "O que o Lucas faz toda manhã antes do seu turno começar? → Ele toma uma xícara de café e olha para o céu."}
                            {q.id === 4 && "Onde o Lucas trabalha na plataforma? → Ele trabalha na casa de máquinas."}
                            {q.id === 5 && "Quais três coisas o Lucas verifica na casa de máquinas? → Ele verifica a pressão, a temperatura e o painel de alarmes."}
                            {q.id === 6 && "Que tipo de problemas o Lucas às vezes resolve? → Ele lida com um pequeno vazamento ou um problema com uma bomba."}
                            {q.id === 7 && "O Lucas gosta do seu trabalho? → Sim, ele gosta do seu trabalho."}
                            {q.id === 8 && "O que o Lucas faz depois do trabalho? → Ele conversa com seus amigos e aprecia a vista do mar."}
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

        {/* TODO O RESTO DO COMPONENTE (Tune In Your Ears, Useful Expressions, Wrap Up, Next Lesson) PERMANECE IGUAL, POIS NÃO FOI SOLICITADA ALTERAÇÃO. */}
        {/* SECTION - TUNE IN YOUR EARS with YouTube Video + Key Vocabulary Inside */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎧</span>
              <div>
                <h2 className="text-2xl font-bold">Tune In Your Ears!</h2>
                <p className="mt-1 text-orange-100 italic">Watch the video and practice the dialogue</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg mb-6">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/2YEyT7wFc7o?list=PLnv2Qinw1PxTtlP2Pb_pqIKyweXfK5C_G"
                title="Offshore English Lesson - Key Vocabulary and Dialogue"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-gray-600 mb-6 text-sm">
              🔗 <a 
                href="https://www.youtube.com/watch?v=2YEyT7wFc7o&list=PLnv2Qinw1PxTtlP2Pb_pqIKyweXfK5C_G" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:underline font-semibold"
              >
                Watch on YouTube
              </a> - Practice listening and pronunciation
            </p>

            {/* Key Vocabulary Inside Tune In Your Ears */}
            <div className="border-t-2 border-red-200 pt-6">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔑</span>
                  <div>
                    <h3 className="text-xl font-bold">Key Vocabulary From the Video</h3>
                    <p className="text-sm text-orange-100">Essential words for your daily watch</p>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-red-100">
                      <th className="border border-red-300 p-3 text-left text-red-800 font-bold">English</th>
                      <th className="border border-red-300 p-3 text-left text-red-800 font-bold">Portuguese</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("morning")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">morning</td>
                      <td className="border border-red-200 p-3 text-gray-700">bom dia / manhã</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("situation")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">situation</td>
                      <td className="border border-red-200 p-3 text-gray-700">situação</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("equipment")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">equipment</td>
                      <td className="border border-red-200 p-3 text-gray-700">equipamento</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("equipment status")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">equipment status</td>
                      <td className="border border-red-200 p-3 text-gray-700">status do equipamento</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("normal")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">normal</td>
                      <td className="border border-red-200 p-3 text-gray-700">normal</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("complete")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">complete</td>
                      <td className="border border-red-200 p-3 text-gray-700">concluir / completar</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("compressor")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">compressor</td>
                      <td className="border border-red-200 p-3 text-gray-700">compressor</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("compressor maintenance")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">compressor maintenance</td>
                      <td className="border border-red-200 p-3 text-gray-700">manutenção do compressor</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("ongoing tasks")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">ongoing tasks</td>
                      <td className="border border-red-200 p-3 text-gray-700">tarefas em andamento</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("fuel pump")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">fuel pump</td>
                      <td className="border border-red-200 p-3 text-gray-700">bomba de combustível</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("inspection")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">inspection</td>
                      <td className="border border-red-200 p-3 text-gray-700">inspeção</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("under inspection")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">under inspection</td>
                      <td className="border border-red-200 p-3 text-gray-700">em inspeção</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("night shift")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">night shift</td>
                      <td className="border border-red-200 p-3 text-gray-700">turno da noite</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("write")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">write</td>
                      <td className="border border-red-200 p-3 text-gray-700">escrever</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("logbook")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">logbook</td>
                      <td className="border border-red-200 p-3 text-gray-700">livro de registros / diário de bordo</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("page")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">page</td>
                      <td className="border border-red-200 p-3 text-gray-700">página</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("review")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">review</td>
                      <td className="border border-red-200 p-3 text-gray-700">revisar</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("checklist")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">checklist</td>
                      <td className="border border-red-200 p-3 text-gray-700">lista de verificação</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("start")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">start</td>
                      <td className="border border-red-200 p-3 text-gray-700">iniciar</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("shift")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">shift</td>
                      <td className="border border-red-200 p-3 text-gray-700">turno</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("toolbox talk")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">toolbox talk</td>
                      <td className="border border-red-200 p-3 text-gray-700">diálogo/reunião de segurança</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("forget")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">forget</td>
                      <td className="border border-red-200 p-3 text-gray-700">esquecer</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("got it")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">got it</td>
                      <td className="border border-red-200 p-3 text-gray-700">entendido</td>
                    </tr>
                    <tr className="hover:bg-red-50 cursor-pointer" onClick={() => playAudio("thank you / thanks")}>
                      <td className="border border-red-200 p-3 text-red-600 font-medium">thank you / thanks</td>
                      <td className="border border-red-200 p-3 text-gray-700">obrigado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Dialogue Section */}
            <div className="border-t-2 border-red-200 pt-6 mt-6">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎭</span>
                  <div>
                    <h3 className="text-xl font-bold">Dialogue From the Video</h3>
                    <p className="text-sm text-orange-100">Practice the conversation between Rafael and Lucas</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-xl border-l-8 border-red-500 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Morning! What's the situation?")}>
                  <p className="text-gray-800"><span className="font-bold text-red-700">Rafael:</span> <span className="text-red-600">Morning! What's the situation?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Bom dia! Qual é a situação?</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border-l-8 border-orange-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Morning. The equipment status is normal. We completed the compressor maintenance.")}>
                  <p className="text-gray-800"><span className="font-bold text-orange-700">Lucas:</span> <span className="text-orange-600">Morning. The equipment status is normal. We completed the compressor maintenance.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Bom dia. O status do equipamento está normal. Nós concluímos a manutenção do compressor.</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border-l-8 border-red-500 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Good. Any ongoing tasks?")}>
                  <p className="text-gray-800"><span className="font-bold text-red-700">Rafael:</span> <span className="text-red-600">Good. Any ongoing tasks?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Bom. Há alguma tarefa em andamento?</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border-l-8 border-orange-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Yes, one. The fuel pump is still under inspection.")}>
                  <p className="text-gray-800"><span className="font-bold text-orange-700">Lucas:</span> <span className="text-orange-600">Yes, one. The fuel pump is still under inspection.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Sim, uma. A bomba de combustível ainda está em inspeção.</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border-l-8 border-red-500 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Did the night shift write it in the logbook?")}>
                  <p className="text-gray-800"><span className="font-bold text-red-700">Rafael:</span> <span className="text-red-600">Did the night shift write it in the logbook?</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 O turno da noite escreveu no livro de registros?</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border-l-8 border-orange-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Yes. It's on page 3.")}>
                  <p className="text-gray-800"><span className="font-bold text-orange-700">Lucas:</span> <span className="text-orange-600">Yes. It's on page 3.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Sim. Está na página 3.</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border-l-8 border-red-500 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Okay. I'll review the checklist and start my shift.")}>
                  <p className="text-gray-800"><span className="font-bold text-red-700">Rafael:</span> <span className="text-red-600">Okay. I'll review the checklist and start my shift.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Ok. Vou revisar a lista de verificação e começar meu turno.</p>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border-l-8 border-orange-500 cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Don't forget the toolbox talk at 7 a.m.")}>
                  <p className="text-gray-800"><span className="font-bold text-orange-700">Lucas:</span> <span className="text-orange-600">Don't forget the toolbox talk at 7 a.m.</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Não se esqueça da reunião de segurança às 7 da manhã.</p>
                </div>
                
                <div className="bg-red-50 p-4 rounded-xl border-l-8 border-red-500 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Got it. Thanks!")}>
                  <p className="text-gray-800"><span className="font-bold text-red-700">Rafael:</span> <span className="text-red-600">Got it. Thanks!</span></p>
                  <p className="text-gray-500 text-sm mt-1">🇧🇷 Entendido. Obrigado!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - USEFUL EXPRESSIONS */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h2 className="text-2xl font-bold">Useful Expressions</h2>
                <p className="mt-1 text-orange-100 italic">Phrases you will use every day on the platform</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("What's the situation?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-red-700">What's the situation?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Qual é a situação?</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Equipment status is normal.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-orange-700">Equipment status is normal.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 O status do equipamento está normal.</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Any ongoing tasks?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-red-700">Any ongoing tasks?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Há alguma tarefa em andamento?</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Under inspection.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-orange-700">Under inspection.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Em inspeção.</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("It's on page 3.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-red-700">It's on page 3.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Está na página 3.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("I'll review the checklist.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-orange-700">I'll review the checklist.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Vou revisar a lista de verificação.</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Start my shift.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-red-700">Start my shift.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Começar meu turno.</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Don't forget.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-orange-700">Don't forget.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Não esqueça.</p>
              </div>
              
              <div className="bg-red-50 p-4 rounded-xl cursor-pointer hover:bg-red-100 transition-colors" onClick={() => playAudio("Got it!")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-red-700">Got it!</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Entendido! / Pode deixar!</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl cursor-pointer hover:bg-orange-100 transition-colors" onClick={() => playAudio("Thanks!")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-orange-700">Thanks!</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Obrigado!</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - WRAP UP with Days of the Week */}
        <div className="bg-white border-2 border-red-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-orange-100 italic">Days of the Week + Key vocabulary from Lucas&apos;s routine</p>
          </div>
          
          {/* Days of the Week Section */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 p-6 border-b-2 border-red-200">
            <h3 className="text-2xl font-bold text-red-800 mb-4 text-center">📅 Days of the Week</h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3">
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Sunday")}>
                <p className="text-2xl">🌞</p>
                <p className="font-bold text-red-700">Sunday</p>
                <p className="text-xs text-gray-500">domingo</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Monday")}>
                <p className="text-2xl">🌙</p>
                <p className="font-bold text-red-700">Monday</p>
                <p className="text-xs text-gray-500">segunda-feira</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Tuesday")}>
                <p className="text-2xl">🔥</p>
                <p className="font-bold text-red-700">Tuesday</p>
                <p className="text-xs text-gray-500">terça-feira</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Wednesday")}>
                <p className="text-2xl">💧</p>
                <p className="font-bold text-red-700">Wednesday</p>
                <p className="text-xs text-gray-500">quarta-feira</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Thursday")}>
                <p className="text-2xl">⚡</p>
                <p className="font-bold text-red-700">Thursday</p>
                <p className="text-xs text-gray-500">quinta-feira</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Friday")}>
                <p className="text-2xl">💖</p>
                <p className="font-bold text-red-700">Friday</p>
                <p className="text-xs text-gray-500">sexta-feira</p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center shadow-md cursor-pointer hover:bg-red-50 transition-colors" onClick={() => playAudio("Saturday")}>
                <p className="text-2xl">🎉</p>
                <p className="font-bold text-red-700">Saturday</p>
                <p className="text-xs text-gray-500">sábado</p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">💡 <span className="font-semibold">Tip:</span> All days of the week end with <span className="text-red-600 font-bold">"day"</span> in English!</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="bg-red-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">MORNING ROUTINE</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("drink a cup of coffee")}>☕ drink a cup of coffee</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("look at the sky")}>🌤️ look at the sky</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("before my watch starts")}>⏰ before my watch starts</p>
              <div className="mt-4 p-3 bg-red-800 rounded-lg">
                <p className="text-sm">📅 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("Every Monday, I drink coffee before my watch starts.")}>"Every <span className="text-yellow-300">Monday</span>, I drink coffee before my watch starts."</p>
              </div>
            </div>
            
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-red-200">
              <p className="text-black font-bold text-lg">⚙️ Engine Room</p>
              <p className="text-xs text-gray-500">Lucas&apos;s workplace</p>
              <div className="mt-4 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-gray-700">🔧 <span className="font-bold">Daily Checks:</span></p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-red-600 transition-colors" onClick={() => playAudio("Pressure")}>Pressure</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-red-600 transition-colors" onClick={() => playAudio("Temperature")}>Temperature</p>
                <p className="text-xs text-gray-600 cursor-pointer hover:text-red-600 transition-colors" onClick={() => playAudio("Alarm Panel")}>Alarm Panel</p>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-700">📅 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("On Tuesdays and Thursdays, I check the generator.")}>"On <span className="text-red-600 font-semibold">Tuesdays and Thursdays</span>, I check the generator."</p>
              </div>
            </div>
            
            <div className="bg-red-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">AFTER WORK</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("talk with my friends")}>👥 talk with my friends</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("enjoy the sea view")}>🌊 enjoy the sea view</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("my job is important")}>⭐ my job is important</p>
              <div className="mt-4 p-3 bg-red-800 rounded-lg">
                <p className="text-sm">📅 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("On weekends, I talk with my friends and enjoy the sea view.")}>"On <span className="text-yellow-300">weekends</span>, I talk with my friends and enjoy the sea view."</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">Remember:</span> Lucas works in the engine room. He checks pressure, temperature, and alarms every day.</p>
            <p className="text-sm text-gray-600 mt-1">📝 <span className="font-semibold">Days of the Week Tip:</span> Use "on" before days - <span className="text-red-600">ON Monday, ON Tuesday, etc.</span></p>
            <p className="text-sm text-gray-600 mt-1">🗣️ <span className="font-semibold">Pronunciation:</span> Click on any word or sentence to hear the correct pronunciation!</p>
          </div>
        </div>

        

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/offshore/lesson3-offshore")}
            className="inline-block rounded-full bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-orange-600 hover:to-red-700"
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
          background: #dc2626;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}