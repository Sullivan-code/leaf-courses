"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'reading' | 'questions' | 'truefalse' | 'conversation';

export default function LessonOffshoreOQM_Lesson6() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    reading: false,
    questions: false,
    truefalse: false,
    conversation: false,
  });
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showAnswerFeedback, setShowAnswerFeedback] = useState<Record<number, boolean>>({});
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<Record<number, boolean>>({});
  const [trueFalseFeedback, setTrueFalseFeedback] = useState<Record<number, boolean>>({});
  const [showAllTrueFalse, setShowAllTrueFalse] = useState(false);
  
  // State for conversation answers
  const [conversationAnswers, setConversationAnswers] = useState<Record<number, string>>({});
  
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

  const handleTrueFalseSelect = (questionId: number, value: boolean) => {
    setTrueFalseAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const checkTrueFalse = (questionId: number, correct: boolean) => {
    const userAnswer = trueFalseAnswers[questionId];
    if (userAnswer === correct) {
      setTrueFalseFeedback(prev => ({
        ...prev,
        [questionId]: true
      }));
    } else {
      alert(`Incorrect! The correct answer is: ${correct ? "True" : "False"}`);
    }
  };

  const showAllTrueFalseAnswers = () => {
    setShowAllTrueFalse(true);
  };

  // Handler for conversation answers
  const handleConversationChange = (questionId: number, value: string) => {
    setConversationAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
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

  const playLongText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
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

  const comprehensionQuestions = [
    { id: 1, text: "How long was Lucas offshore?", correct: "He was offshore for 14 days." },
    { id: 2, text: "What is Lucas's job?", correct: "He is an electrician." },
    { id: 3, text: "Where does Lucas work on the platform?", correct: "He works in the engine room." },
    { id: 4, text: "What equipment does Lucas inspect?", correct: "He inspects electrical panels, generators, and circuit breakers." },
    { id: 5, text: "Which country did Lucas's team return from?", correct: "They returned from Australia." },
    { id: 6, text: "Which countries are Lucas's coworkers from?", correct: "They are from Denmark and Sweden." },
    { id: 7, text: "Why do they speak English every day?", correct: "Because they work with people from different countries." },
    { id: 8, text: "What did Lucas do before leaving the platform?", correct: "He packed his bag and completed the handover." },
    { id: 9, text: "Who does Lucas miss the most?", correct: "He misses his wife and children." },
    { id: 10, text: "Where does Lucas want to take his wife?", correct: "He wants to take her to Pernambuco." },
    { id: 11, text: "How will the crew return to shore?", correct: "They will return by helicopter." },
    { id: 12, text: "How does Lucas feel at the end of his rotation?", correct: "He feels tired, happy, and excited." }
  ];

  const trueFalseQuestions = [
    { id: 1, text: "Lucas is an offshore electrician.", correct: true },
    { id: 2, text: "He works in the control room.", correct: false },
    { id: 3, text: "His team returned from Australia.", correct: true },
    { id: 4, text: "His coworkers are from Denmark and Sweden.", correct: true },
    { id: 5, text: "Lucas packed his bags before leaving.", correct: true },
    { id: 6, text: "Lucas wants to visit Rio de Janeiro with his wife.", correct: false },
    { id: 7, text: "The crew will leave by helicopter.", correct: true },
    { id: 8, text: "Lucas is happy because he will see his family again.", correct: true }
  ];

  const conversationQuestions = [
    { id: 1, text: "Have you ever been away from your family for many days?" },
    { id: 2, text: "Would you like to work on an offshore platform? Why or why not?" },
    { id: 3, text: "Which country would you like to work in?" },
    { id: 4, text: "What would you do after a 14-day offshore rotation?" },
    { id: 5, text: "Why is English important for international offshore teams?" },
    { id: 6, text: "What do you think is the most difficult part of working offshore?" },
    { id: 7, text: "What would you like to do on a weekend in Pernambuco?" },
    { id: 8, text: "If you worked with people from Denmark and Sweden, what would you ask them about their countries?" }
  ];

  const fullReadingText = `After 14 days offshore, Lucas is finishing his work rotation. He is an electrician who works in the engine room, inspecting electrical panels, checking generators, replacing cables, and testing circuit breakers. Safety is always his priority. His team has returned from a project in Australia. He works with people from Denmark and Sweden, so they speak English every day while solving technical problems. Now, Lucas has finished his work, packed his bag, and completed the handover for the next electrician. He misses his wife and children very much. This weekend, he wants to surprise his wife with a trip to Pernambuco, where they will relax on the beach and spend time together. Soon, the helicopter will arrive at the helideck to take everyone back to shore. Lucas feels tired, happy, and excited to see his family again.`;

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
          console.error("Error playing audio:", error);
          alert("Could not play audio. Please check your connection and try again.");
        });
    }
  };

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
        
        {/* Audio element with correct GitHub link */}
        <audio ref={audioRef} src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/offshore-lesson6-audio.mp3" preload="metadata" />

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Lesson 6 - Offshore: The Last Day
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Follow Lucas on his last day offshore before heading home to his family. 🚁🏖️
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/offshore.jpg"
              alt="Offshore oil platform"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">📍 Offshore Oil Platform - End of Rotation</p>
        </div>

        {/* SECTION 1 - READING TEXT with Audio Player */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">📖 Reading Text</h2>
              <p className="mt-2 text-blue-100 italic">Listen and read about Lucas&apos;s last day offshore</p>
            </div>
            <button onClick={() => toggleDrill('reading')} className="rounded-full bg-white text-blue-600 px-6 py-2 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
              {openDrills.reading ? 'Hide Translation' : 'Show Translation'}
            </button>
          </div>
          <div className="p-8">
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={playExternalAudio}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-cyan-600 transition-all duration-300"
                >
                  {isPlaying ? "🔊 Playing..." : "🔊 Play Full Text"}
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
              <p className="text-xs text-gray-500 mt-3 text-center">💡 Click the button to listen to the full text. Click on any sentence below to hear individual pronunciation.</p>
            </div>

            <div className="space-y-6">
              {/* Paragraph 1 - Engine Room */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("After 14 days offshore, Lucas is finishing his work rotation. He is an electrician who works in the engine room, inspecting electrical panels, checking generators, replacing cables, and testing circuit breakers. Safety is always his priority.")}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      🇬🇧 <span className="font-bold text-blue-600">After 14 days offshore, Lucas is finishing his work rotation. He is an electrician who works in the engine room, inspecting electrical panels, checking generators, replacing cables, and testing circuit breakers. Safety is always his priority.</span>
                    </p>
                    {openDrills.reading && (
                      <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                        🇧🇷 <span className="font-semibold">Após 14 dias offshore, Lucas está terminando seu turno de trabalho. Ele é um eletricista que trabalha na casa de máquinas, inspecionando painéis elétricos, verificando geradores, substituindo cabos e testando disjuntores. A segurança é sempre sua prioridade.</span>
                      </p>
                    )}
                  </div>
                  <div className="w-32 h-32 relative flex-shrink-0">
                  </div>
                </div>
              </div>

              {/* Paragraph 2 - Australia */}
              <div className="bg-cyan-50 p-6 rounded-2xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("His team has returned from a project in Australia. He works with people from Denmark and Sweden, so they speak English every day while solving technical problems.")}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      🇬🇧 <span className="font-bold text-cyan-600">His team has returned from a project in Australia. He works with people from Denmark and Sweden, so they speak English every day while solving technical problems.</span>
                    </p>
                    {openDrills.reading && (
                      <p className="text-gray-600 mt-4 pt-4 border-t border-cyan-200 animate-fadeIn">
                        🇧🇷 <span className="font-semibold">Sua equipe retornou de um projeto na Austrália. Ele trabalha com pessoas da Dinamarca e Suécia, então eles falam inglês todos os dias enquanto resolvem problemas técnicos.</span>
                      </p>
                    )}
                  </div>
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <Image
                      src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/australia.JPG"
                      alt="Australia"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Paragraph 3 - Handover */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Now, Lucas has finished his work, packed his bag, and completed the handover for the next electrician.")}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      🇬🇧 <span className="font-bold text-blue-600">Now, Lucas has finished his work, packed his bag, and completed the handover for the next electrician.</span>
                    </p>
                    {openDrills.reading && (
                      <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                        🇧🇷 <span className="font-semibold">Agora, Lucas terminou seu trabalho, arrumou sua mala e completou o handover para o próximo eletricista.</span>
                      </p>
                    )}
                  </div>
                  <div className="w-32 h-32 relative flex-shrink-0">
                  </div>
                </div>
              </div>

              {/* Paragraph 4 - Beach */}
              <div className="bg-cyan-50 p-6 rounded-2xl border-l-8 border-cyan-500 cursor-pointer hover:bg-cyan-100 transition-colors" onClick={() => playAudio("He misses his wife and children very much. This weekend, he wants to surprise his wife with a trip to Pernambuco, where they will relax on the beach and spend time together.")}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      🇬🇧 <span className="font-bold text-cyan-600">He misses his wife and children very much. This weekend, he wants to surprise his wife with a trip to Pernambuco, where they will relax on the beach and spend time together.</span>
                    </p>
                    {openDrills.reading && (
                      <p className="text-gray-600 mt-4 pt-4 border-t border-cyan-200 animate-fadeIn">
                        🇧🇷 <span className="font-semibold">Ele sente muita falta de sua esposa e filhos. Neste fim de semana, ele quer surpreender sua esposa com uma viagem para Pernambuco, onde eles vão relaxar na praia e passar tempo juntos.</span>
                      </p>
                    )}
                  </div>
                  <div className="w-32 h-32 relative flex-shrink-0">
                  </div>
                </div>
              </div>

              {/* Paragraph 5 - Helicopter */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Soon, the helicopter will arrive at the helideck to take everyone back to shore. Lucas feels tired, happy, and excited to see his family again.")}>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <p className="text-gray-800 text-lg leading-relaxed">
                      🇬🇧 <span className="font-bold text-blue-600">Soon, the helicopter will arrive at the helideck to take everyone back to shore. Lucas feels tired, happy, and excited to see his family again.</span>
                    </p>
                    {openDrills.reading && (
                      <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                        🇧🇷 <span className="font-semibold">Em breve, o helicóptero chegará ao helideck para levar todos de volta à terra. Lucas se sente cansado, feliz e animado para ver sua família novamente.</span>
                      </p>
                    )}
                  </div>
                  <div className="w-32 h-32 relative flex-shrink-0">
                    <Image
                      src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/helicopter.jpg"
                      alt="Helicopter on helideck"
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2 - READING COMPREHENSION QUESTIONS */}
        <div className="bg-white border-2 border-green-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">❓ Reading Comprehension</h2>
              <p className="mt-2 text-green-100 italic">Test your understanding of Lucas&apos;s last day</p>
            </div>
            <div className="flex gap-3">
              <button onClick={showAllCorrectAnswers} className="rounded-full bg-white text-green-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-green-100">
                Show All Answers
              </button>
              <button onClick={() => toggleDrill('questions')} className="rounded-full bg-white text-green-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-green-100">
                {openDrills.questions ? 'Hide Translations' : 'Show Translations'}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {comprehensionQuestions.map((q) => (
                <div key={q.id} className="bg-green-50 p-5 rounded-xl border border-green-200 transition-all duration-300 hover:bg-green-100">
                  <p className="text-gray-800 font-bold text-lg mb-3">
                    {q.id}️⃣ <button onClick={() => playAudio(q.text)} className="text-green-600 hover:underline">{q.text}</button>
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Type your answer..."
                      value={selectedAnswers[q.id] || ''}
                      onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                    />
                    <button
                      onClick={() => checkAnswer(q.id, q.correct)}
                      className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-600 transition-all duration-300"
                    >
                      Check ✓
                    </button>
                  </div>
                  
                  {(showAllAnswers || showAnswerFeedback[q.id]) && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg border-l-4 border-green-500 animate-fadeIn">
                      <p className="text-green-800 font-semibold">✅ Correct Answer:</p>
                      <p className="text-gray-700">{q.correct}</p>
                      {openDrills.questions && (
                        <p className="text-gray-500 mt-2 text-sm pt-2 border-t border-green-200">
                          📝 <span className="font-semibold">Portuguese:</span>{" "}
                          {q.id === 1 && "Quanto tempo Lucas ficou offshore? → Ele ficou offshore por 14 dias."}
                          {q.id === 2 && "Qual é o trabalho de Lucas? → Ele é eletricista."}
                          {q.id === 3 && "Onde Lucas trabalha na plataforma? → Ele trabalha na casa de máquinas."}
                          {q.id === 4 && "Que equipamento Lucas inspeciona? → Ele inspeciona painéis elétricos, geradores e disjuntores."}
                          {q.id === 5 && "De qual país a equipe de Lucas retornou? → Eles retornaram da Austrália."}
                          {q.id === 6 && "De quais países são os colegas de Lucas? → Eles são da Dinamarca e Suécia."}
                          {q.id === 7 && "Por que eles falam inglês todos os dias? → Porque trabalham com pessoas de diferentes países."}
                          {q.id === 8 && "O que Lucas fez antes de sair da plataforma? → Ele arrumou sua mala e completou o handover."}
                          {q.id === 9 && "Quem Lucas sente mais falta? → Ele sente falta de sua esposa e filhos."}
                          {q.id === 10 && "Para onde Lucas quer levar sua esposa? → Ele quer levá-la para Pernambuco."}
                          {q.id === 11 && "Como a equipe vai retornar à terra? → Eles vão retornar de helicóptero."}
                          {q.id === 12 && "Como Lucas se sente no final do seu turno? → Ele se sente cansado, feliz e animado."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3 - TRUE OR FALSE */}
        <div className="bg-white border-2 border-purple-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">✅ True or False</h2>
              <p className="mt-2 text-purple-100 italic">Decide if each statement is true or false</p>
            </div>
            <div className="flex gap-3">
              <button onClick={showAllTrueFalseAnswers} className="rounded-full bg-white text-purple-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-purple-100">
                Show All Answers
              </button>
              <button onClick={() => toggleDrill('truefalse')} className="rounded-full bg-white text-purple-600 px-4 py-2 text-sm font-semibold transition-all duration-300 hover:bg-purple-100">
                {openDrills.truefalse ? 'Hide Translations' : 'Show Translations'}
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {trueFalseQuestions.map((q) => (
                <div key={q.id} className="bg-purple-50 p-5 rounded-xl border border-purple-200 transition-all duration-300 hover:bg-purple-100">
                  <p className="text-gray-800 font-bold text-lg mb-3">
                    {q.id}️⃣ <button onClick={() => playAudio(q.text)} className="text-purple-600 hover:underline">{q.text}</button>
                  </p>
                  
                  <div className="flex gap-3 mb-3">
                    <button
                      onClick={() => handleTrueFalseSelect(q.id, true)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        trueFalseAnswers[q.id] === true 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      True
                    </button>
                    <button
                      onClick={() => handleTrueFalseSelect(q.id, false)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
                        trueFalseAnswers[q.id] === false 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      False
                    </button>
                    <button
                      onClick={() => checkTrueFalse(q.id, q.correct)}
                      className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-600 transition-all duration-300"
                    >
                      Check ✓
                    </button>
                  </div>
                  
                  {(showAllTrueFalse || trueFalseFeedback[q.id]) && (
                    <div className={`mt-3 p-3 rounded-lg border-l-4 animate-fadeIn ${
                      q.correct 
                        ? 'bg-green-100 border-green-500' 
                        : 'bg-red-100 border-red-500'
                    }`}>
                      <p className={`font-semibold ${
                        q.correct ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {q.correct ? '✅ Correct!' : '❌ Incorrect!'}
                      </p>
                      <p className="text-gray-700">
                        The correct answer is: <span className="font-bold">{q.correct ? 'True' : 'False'}</span>
                      </p>
                      {openDrills.truefalse && (
                        <p className="text-gray-500 mt-2 text-sm pt-2 border-t border-gray-200">
                          📝 <span className="font-semibold">Portuguese:</span>{" "}
                          {q.id === 1 && "Lucas é um eletricista offshore."}
                          {q.id === 2 && "Ele trabalha na sala de controle."}
                          {q.id === 3 && "Sua equipe retornou da Austrália."}
                          {q.id === 4 && "Seus colegas são da Dinamarca e Suécia."}
                          {q.id === 5 && "Lucas arrumou suas malas antes de sair."}
                          {q.id === 6 && "Lucas quer visitar o Rio de Janeiro com sua esposa."}
                          {q.id === 7 && "A equipe vai sair de helicóptero."}
                          {q.id === 8 && "Lucas está feliz porque vai ver sua família novamente."}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4 - CONVERSATION QUESTIONS with text areas */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-orange-600 to-amber-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">💬 Conversation Questions</h2>
              <p className="mt-2 text-orange-100 italic">Write your answers to these questions</p>
            </div>
            <button onClick={() => toggleDrill('conversation')} className="rounded-full bg-white text-orange-600 px-6 py-2 text-sm font-semibold transition-all duration-300 hover:bg-orange-100">
              {openDrills.conversation ? 'Hide Translations' : 'Show Translations'}
            </button>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {conversationQuestions.map((q) => (
                <div key={q.id} className="bg-orange-50 p-5 rounded-xl border border-orange-200 transition-all duration-300 hover:bg-orange-100">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🗣️</span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-semibold mb-3" onClick={() => playAudio(q.text)}>
                        {q.id}. {q.text}
                      </p>
                      {openDrills.conversation && (
                        <p className="text-gray-600 text-sm mb-3">
                          🇧🇷 {q.id === 1 && "Você já ficou longe da sua família por muitos dias?"}
                          {q.id === 2 && "Você gostaria de trabalhar em uma plataforma offshore? Por que ou por que não?"}
                          {q.id === 3 && "Em qual país você gostaria de trabalhar?"}
                          {q.id === 4 && "O que você faria após um turno offshore de 14 dias?"}
                          {q.id === 5 && "Por que o inglês é importante para equipes offshore internacionais?"}
                          {q.id === 6 && "Qual você acha que é a parte mais difícil de trabalhar offshore?"}
                          {q.id === 7 && "O que você gostaria de fazer em um fim de semana em Pernambuco?"}
                          {q.id === 8 && "Se você trabalhasse com pessoas da Dinamarca e Suécia, o que você perguntaria sobre seus países?"}
                        </p>
                      )}
                      <textarea
                        rows={3}
                        placeholder="Write your answer here..."
                        value={conversationAnswers[q.id] || ''}
                        onChange={(e) => handleConversationChange(q.id, e.target.value)}
                        className="w-full p-3 border border-orange-300 rounded-lg focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 bg-white resize-y min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5 - WRAP UP with Key Vocabulary */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 WRAP UP</h2>
            <p className="mt-2 text-blue-100 italic">Key vocabulary from Lucas&apos;s last day offshore</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">WORK ROTATION</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("14 days offshore")}>📅 14 days offshore</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("work rotation")}>🔄 work rotation</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("electrician")}>⚡ electrician</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("engine room")}>🏗️ engine room</p>
              <div className="mt-4 p-3 bg-blue-800 rounded-lg">
                <p className="text-sm">📝 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("Lucas is an electrician who works in the engine room.")}>"Lucas is an <span className="text-yellow-300">electrician</span> who works in the <span className="text-yellow-300">engine room</span>."</p>
              </div>
            </div>
            
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-blue-200">
              <p className="text-black font-bold text-lg">🔧 Equipment & Tasks</p>
              <p className="text-xs text-gray-500">What Lucas inspects and does</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("electrical panels")}>⚡ electrical panels</p>
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("generators")}>🔌 generators</p>
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("cables")}>🔗 cables</p>
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("circuit breakers")}>⛔ circuit breakers</p>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-700">📅 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("Lucas inspects electrical panels and checks generators.")}>"Lucas inspects <span className="text-blue-600 font-semibold">electrical panels</span> and checks <span className="text-blue-600 font-semibold">generators</span>."</p>
              </div>
            </div>
            
            <div className="bg-cyan-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">TEAM & RETURN</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("Australia")}>🌏 Australia</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("Denmark")}>🇩🇰 Denmark</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("Sweden")}>🇸🇪 Sweden</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("helicopter")}>🚁 helicopter</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("helideck")}>🛬 helideck</p>
              <div className="mt-4 p-3 bg-cyan-800 rounded-lg">
                <p className="text-sm">📝 <span className="font-bold">Example:</span></p>
                <p className="text-xs cursor-pointer" onClick={() => playAudio("The helicopter will arrive at the helideck.")}>"The <span className="text-yellow-300">helicopter</span> will arrive at the <span className="text-yellow-300">helideck</span>."</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">Remember:</span> Lucas works as an electrician in the engine room. He inspects panels, generators, and circuit breakers.</p>
            <p className="text-sm text-gray-600 mt-1">🗣️ <span className="font-semibold">Pronunciation:</span> Click on any word or sentence to hear the correct pronunciation!</p>
          </div>
        </div>

        {/* SECTION 6 - IMAGE GALLERY with your images */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🖼️ Offshore Gallery</h2>
            <p className="mt-2 text-blue-100 italic">Images related to Lucas&apos;s work and life offshore</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/australia.JPG"
                  alt="Australia"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs text-center">
                  Australia
                </div>
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/helicopter.jpg"
                  alt="Helicopter"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs text-center">
                  Helicopter
                </div>
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/offshore.jpg"
                  alt="Offshore platform"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs text-center">
                  Offshore Platform
                </div>
              </div>
              <div className="relative h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://raw.githubusercontent.com/Sullivan-code/leaf-courses/main/helicopter.jpg"
                  alt="Helicopter on helideck"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs text-center">
                  Helideck
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/offshore/offshore-rw1")}
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