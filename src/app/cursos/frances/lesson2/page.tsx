"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type SectionKey = 'reading' | 'questions';
type AnswerKey = number | null;

export default function LessonFoodDrinks_Lesson2() {
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

  // Audio playback with progress tracking - FRENCH FEMALE VOICE
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
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      
      // Try to find a French female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Amelie') || 
         voice.name.includes('Google français') ||
         voice.name.includes('Samantha'))
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
    
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && 
        (voice.name.includes('Female') || 
         voice.name.includes('Amelie') || 
         voice.name.includes('Google français'))
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

  // Questions data with translations
  const questions = [
    { id: 1, text: "Qu'est-ce que Marie boit le matin?", correct: "Elle boit du café.", translation: "O que Marie bebe de manhã?" },
    { id: 2, text: "Que mange Marie pour le petit-déjeuner?", correct: "Elle mange des croissants.", translation: "O que Marie come no café da manhã?" },
    { id: 3, text: "Où est-ce que Marie va pour déjeuner?", correct: "Elle va au café.", translation: "Onde Marie vai almoçar?" },
    { id: 4, text: "Qu'est-ce que Marie boit au café?", correct: "Elle boit de l'eau.", translation: "O que Marie bebe no café?" },
    { id: 5, text: "Qu'est-ce que Marie commande au restaurant?", correct: "Elle commande une salade.", translation: "O que Marie pede no restaurante?" },
    { id: 6, text: "Avec qui Marie boit du vin?", correct: "Elle boit du vin avec son ami.", translation: "Com quem Marie bebe vinho?" },
    { id: 7, text: "Qu'est-ce que Marie boit le soir?", correct: "Elle boit du thé.", translation: "O que Marie bebe à noite?" },
    { id: 8, text: "Est-ce que Marie aime boire du thé?", correct: "Oui, elle aime boire du thé.", translation: "Marie gosta de beber chá?" }
  ];

  // Full reading text in French with translation
  const fullReadingText = `Marie est une femme française. Elle habite à Paris. Le matin, Marie boit du café. Elle aime le café. Elle mange des croissants. Les croissants sont délicieux. Marie va au café pour déjeuner. Elle boit de l'eau. Elle commande une salade. Le soir, Marie va au restaurant. Elle boit du vin avec son ami. Elle boit du thé après le dîner. Marie aime boire du thé. Marie est heureuse.`;

  const fullReadingTranslation = `Marie é uma mulher francesa. Ela mora em Paris. De manhã, Marie bebe café. Ela gosta de café. Ela come croissants. Os croissants são deliciosos. Marie vai ao café para almoçar. Ela bebe água. Ela pede uma salada. À noite, Marie vai ao restaurante. Ela bebe vinho com seu amigo. Ela bebe chá depois do jantar. Marie gosta de beber chá. Marie está feliz.`;

  // --- Audio function for external audio ---
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
          console.error("Erreur lors de la lecture audio:", error);
          alert("Impossible de lire l'audio. Vérifiez votre connexion ou réessayez.");
        });
    }
  };

  // Update progress bar while audio plays
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
        
        <audio ref={audioRef} src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/french-lesson2-audio.mp3" preload="metadata" />

        {/* TITLE */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">
            Leçon 2 - Nourriture et Boissons
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Apprenez à parler de la nourriture et des boissons en français avec Marie ! 🥐☕
          </p>
          <div className="w-64 h-64 mx-auto relative">
            <Image
              src="https://raw.githubusercontent.com/Sullivan-code/english-audios/main/ChatGPT%20Image%20Jun%2012%2C%202026%2C%2006_28_56%20PM.png"
              alt="Café français traditionnel"
              fill
              sizes="(max-width: 256px) 100vw, 256px"
              className="object-cover rounded-2xl shadow-md"
              quality={100}
              priority
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">☕ Café Traditionnel - Paris</p>
        </div>

        {/* SECTION 1 - READING TEXT with Audio Player */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-4 px-8 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold">📖 Texte de Lecture</h2>
              <p className="mt-2 text-blue-100 italic">Écoutez et lisez l&apos;histoire de Marie</p>
            </div>
            <button onClick={() => toggleDrill('reading')} className="rounded-full bg-white text-blue-600 px-6 py-2 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
              {openDrills.reading ? 'Cacher la Traduction' : 'Montrer la Traduction'}
            </button>
          </div>
          <div className="p-8">
            {/* Audio Player with Progress Bar */}
            <div className="mb-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-4 flex-wrap">
                <button
                  onClick={playExternalAudio}
                  className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-2 rounded-full font-semibold flex items-center gap-2 hover:from-blue-700 hover:to-indigo-600 transition-all duration-300"
                >
                  {isPlaying ? "🔊 Lecture en cours..." : "🔊 Écouter tout le texte"}
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
              <p className="text-xs text-gray-500 mt-3 text-center">💡 Cliquez sur le bouton pour écouter le texte complet. Cliquez sur n&apos;importe quelle phrase pour écouter la prononciation individuelle.</p>
            </div>

            {/* Full Text Display with Translation */}
            <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">📖</span>
                <h3 className="text-lg font-bold text-blue-800">Texte Complet / Texto Completo</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-800 text-lg leading-relaxed cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio(fullReadingText)}>
                  🇫🇷 <span className="font-semibold">{fullReadingText}</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-2 pt-2 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">{fullReadingTranslation}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Reading Text 1 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Marie est une femme française. Elle habite à Paris.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇫🇷 <span className="font-bold text-blue-600">Marie est une femme française. Elle habite à Paris.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Marie é uma mulher francesa. Ela mora em Paris.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 2 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Le matin, Marie boit du café. Elle aime le café. Elle mange des croissants. Les croissants sont délicieux.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇫🇷 <span className="font-bold text-blue-600">Le matin, Marie boit du café. Elle aime le café. Elle mange des croissants. Les croissants sont délicieux.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">De manhã, Marie bebe café. Ela gosta de café. Ela come croissants. Os croissants são deliciosos.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 3 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Marie va au café pour déjeuner. Elle boit de l'eau. Elle commande une salade.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇫🇷 <span className="font-bold text-blue-600">Marie va au café pour déjeuner. Elle boit de l&apos;eau. Elle commande une salade.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">Marie vai ao café para almoçar. Ela bebe água. Ela pede uma salada.</span>
                  </p>
                )}
              </div>

              {/* Reading Text 4 */}
              <div className="bg-blue-50 p-6 rounded-2xl border-l-8 border-blue-500 cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Le soir, Marie va au restaurant. Elle boit du vin avec son ami. Elle boit du thé après le dîner. Marie aime boire du thé. Marie est heureuse.")}>
                <p className="text-gray-800 text-lg leading-relaxed">
                  🇫🇷 <span className="font-bold text-blue-600">Le soir, Marie va au restaurant. Elle boit du vin avec son ami. Elle boit du thé après le dîner. Marie aime boire du thé. Marie est heureuse.</span>
                </p>
                {openDrills.reading && (
                  <p className="text-gray-600 mt-4 pt-4 border-t border-blue-200 animate-fadeIn">
                    🇧🇷 <span className="font-semibold">À noite, Marie vai ao restaurante. Ela bebe vinho com seu amigo. Ela bebe chá depois do jantar. Marie gosta de beber chá. Marie está feliz.</span>
                  </p>
                )}
              </div>
            </div>

            {/* Questions & Answers */}
            <div className="mt-8 pt-6 border-t-2 border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-3 px-6 rounded-xl mb-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold">❓ Questions & Réponses</h3>
                    <p className="text-sm text-blue-100">Testez votre compréhension de l&apos;histoire de Marie</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={showAllCorrectAnswers} className="rounded-full bg-white text-blue-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
                      Montrer Toutes les Réponses
                    </button>
                    <button onClick={() => toggleDrill('questions')} className="rounded-full bg-white text-blue-600 px-4 py-1 text-sm font-semibold transition-all duration-300 hover:bg-blue-100">
                      {openDrills.questions ? 'Cacher les Traductions' : 'Montrer les Traductions'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                {questions.map((q) => (
                  <div key={q.id} className="bg-blue-50 p-5 rounded-xl border border-blue-200 transition-all duration-300 hover:bg-blue-100">
                    <div className="mb-3">
                      <p className="text-gray-800 font-bold text-lg">
                        {q.id}️⃣ <button onClick={() => playAudio(q.text)} className="text-blue-600 hover:underline">{q.text}</button>
                      </p>
                      {openDrills.questions && (
                        <p className="text-gray-500 text-sm mt-1">
                          🇧🇷 <span className="font-semibold">{q.translation}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 mb-3">
                      <input
                        type="text"
                        placeholder="Tapez votre réponse ici..."
                        value={selectedAnswers[q.id] || ''}
                        onChange={(e) => handleAnswerSelect(q.id, e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      />
                      <button
                        onClick={() => checkAnswer(q.id, q.correct)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-600 transition-all duration-300"
                      >
                        Vérifier ✓
                      </button>
                    </div>
                    
                    {(showAllAnswers || showAnswerFeedback[q.id]) && (
                      <div className="mt-3 p-3 bg-green-100 rounded-lg border-l-4 border-green-500 animate-fadeIn">
                        <p className="text-green-800 font-semibold">✅ Réponse Correcte:</p>
                        <p className="text-gray-700">{q.correct}</p>
                        {openDrills.questions && (
                          <p className="text-gray-500 mt-2 text-sm pt-2 border-t border-green-200">
                            🇧🇷 <span className="font-semibold">Resposta Correta:</span> {q.correct}
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

        {/* SECTION - VERBS "BOIRE" & "MANGER" */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔤</span>
              <div>
                <h2 className="text-2xl font-bold">Les Verbes Importants</h2>
                <p className="mt-1 text-blue-100 italic">BOIRE (bebr) & MANGER (comer) - Verbes réguliers et irréguliers</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Verbe BOIRE */}
              <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-300">
                <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">🍷 BOIRE (bebr)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Je bois")}>
                    <span className="font-semibold text-gray-700">Je bois</span>
                    <span className="text-gray-600">Eu bebo</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Tu bois")}>
                    <span className="font-semibold text-gray-700">Tu bois</span>
                    <span className="text-gray-600">Tu bebes</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Elle boit")}>
                    <span className="font-semibold text-gray-700">Elle boit</span>
                    <span className="text-gray-600">Ela bebe</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Nous buvons")}>
                    <span className="font-semibold text-gray-700">Nous buvons</span>
                    <span className="text-gray-600">Nós bebemos</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Vous buvez")}>
                    <span className="font-semibold text-gray-700">Vous buvez</span>
                    <span className="text-gray-600">Vós bebeis / Vocês bebem</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Elles boivent")}>
                    <span className="font-semibold text-gray-700">Elles boivent</span>
                    <span className="text-gray-600">Elas bebem</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">💡 <span className="font-bold">Exemple:</span> <span className="cursor-pointer hover:underline" onClick={() => playAudio("Marie boit du café.")}>Marie boit du café.</span></p>
                  <p className="text-xs text-gray-600 mt-1">📝 Marie bebe café.</p>
                </div>
              </div>

              {/* Verbe MANGER */}
              <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-300">
                <h3 className="text-2xl font-bold text-indigo-700 mb-4 text-center">🍽️ MANGER (comer)</h3>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Je mange")}>
                    <span className="font-semibold text-gray-700">Je mange</span>
                    <span className="text-gray-600">Eu como</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Tu manges")}>
                    <span className="font-semibold text-gray-700">Tu manges</span>
                    <span className="text-gray-600">Tu comes</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Elle mange")}>
                    <span className="font-semibold text-gray-700">Elle mange</span>
                    <span className="text-gray-600">Ela come</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Nous mangeons")}>
                    <span className="font-semibold text-gray-700">Nous mangeons</span>
                    <span className="text-gray-600">Nós comemos</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Vous mangez")}>
                    <span className="font-semibold text-gray-700">Vous mangez</span>
                    <span className="text-gray-600">Vós comeis / Vocês comem</span>
                  </div>
                  <div className="flex justify-between p-2 bg-white rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Elles mangent")}>
                    <span className="font-semibold text-gray-700">Elles mangent</span>
                    <span className="text-gray-600">Elas comem</span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-indigo-100 rounded-lg">
                  <p className="text-sm text-indigo-800">💡 <span className="font-bold">Exemple:</span> <span className="cursor-pointer hover:underline" onClick={() => playAudio("Marie mange des croissants.")}>Marie mange des croissants.</span></p>
                  <p className="text-xs text-gray-600 mt-1">📝 Marie come croissants.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - USEFUL EXPRESSIONS */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-4 px-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⭐</span>
              <div>
                <h2 className="text-2xl font-bold">Expressions Utiles</h2>
                <p className="mt-1 text-blue-100 italic">Phrases pour parler de nourriture et boissons</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Qu'est-ce que tu bois?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">Qu&apos;est-ce que tu bois?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 O que você bebe?</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Je bois du café.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-indigo-700">Je bois du café.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Eu bebo café.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("Qu'est-ce que tu manges?")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">Qu&apos;est-ce que tu manges?</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 O que você come?</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("Je mange des croissants.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-indigo-700">Je mange des croissants.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Eu como croissants.</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playAudio("J'aime le café.")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-blue-700">J&apos;aime le café.</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 Eu gosto de café.</p>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors" onClick={() => playAudio("C'est délicieux!")}>
                <p className="text-gray-800 font-semibold">🗣️ <span className="text-indigo-700">C&apos;est délicieux!</span></p>
                <p className="text-gray-600 text-sm">🇧🇷 É delicioso!</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION - WRAP UP */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden transition-all duration-500 hover:shadow-xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white py-4 px-8">
            <h2 className="text-3xl font-bold">🔹 RÉSUMÉ</h2>
            <p className="mt-2 text-blue-100 italic">Vocabulaire clé de l&apos;histoire de Marie</p>
          </div>
          
          <div className="flex flex-col md:flex-row">
            <div className="bg-blue-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">BOISSONS</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("le café")}>☕ le café</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("l'eau")}>💧 l&apos;eau</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("le vin")}>🍷 le vin</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("le thé")}>🍵 le thé</p>
            </div>
            
            <div className="bg-white flex-1 p-6 text-center border-x-2 border-blue-200">
              <p className="text-black font-bold text-lg">🍽️ NOURRITURE</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("les croissants")}>🥐 les croissants</p>
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("la salade")}>🥗 la salade</p>
                <p className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => playAudio("le restaurant")}>🍽️ le restaurant</p>
              </div>
            </div>
            
            <div className="bg-indigo-900 text-white flex-1 p-6 text-xl space-y-4">
              <p>✅ <span className="font-bold">VERBES</span></p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("boire")}>🍷 boire (bebr)</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("manger")}>🍽️ manger (comer)</p>
              <p className="text-sm cursor-pointer hover:text-yellow-200 transition-colors" onClick={() => playAudio("aimer")}>❤️ aimer (gostar)</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 text-center">
            <p className="text-gray-700">⭐ <span className="font-bold">À retenir:</span> Marie boit du café le matin et mange des croissants.</p>
            <p className="text-gray-600 text-sm">🇧🇷 Marie bebe café de manhã e come croissants.</p>
            <p className="text-sm text-gray-600 mt-1">🗣️ <span className="font-semibold">Prononciation:</span> Cliquez sur n&apos;importe quel mot ou phrase pour entendre la prononciation correcte!</p>
          </div>
        </div>

        {/* NEXT LESSON BUTTON */}
        <div className="text-center">
          <button
            onClick={() => router.push("/cursos/frances/lesson3-french")}
            className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-8 py-3 text-lg transition-all duration-300 hover:from-indigo-600 hover:to-blue-700"
          >
            Leçon Suivante
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