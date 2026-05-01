"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save } from "lucide-react";

type SectionKey = 'pinpoint' | 'assessment';

interface ReviewLessonData {
  ratings: number[];
  activeSection: SectionKey;
  lastSaved: string | null;
}

export default function ReviewLesson10() {
  const router = useRouter();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Função para salvar todos os dados
  const saveAllData = () => {
    try {
      const lessonData: ReviewLessonData = {
        ratings,
        activeSection,
        lastSaved: new Date().toLocaleString()
      };
      
      localStorage.setItem('reviewLesson10', JSON.stringify(lessonData));
      setLastSaved(new Date().toLocaleString());
      setSaveMessage("✅ Progresso salvo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      
      console.log("Dados salvos:", lessonData);
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setSaveMessage("❌ Erro ao salvar progresso");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  // Função para carregar todos os dados
  const loadAllData = () => {
    try {
      setIsLoading(true);
      const savedData = localStorage.getItem('reviewLesson10');
      if (savedData) {
        const parsedData: ReviewLessonData = JSON.parse(savedData);
        
        setRatings(parsedData.ratings || [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
        setActiveSection(parsedData.activeSection || 'pinpoint');
        setLastSaved(parsedData.lastSaved || null);
        
        setSaveMessage("✅ Progresso carregado com sucesso!");
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
        
        console.log("Dados carregados:", parsedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      setSaveMessage("❌ Erro ao carregar progresso");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      setIsLoading(false);
    }
  };

  // Função para limpar todos os dados
  const clearAllData = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o progresso?")) {
      localStorage.removeItem('reviewLesson10');
      
      // Resetar todos os estados
      setRatings([2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]);
      setActiveSection('pinpoint');
      setLastSaved(null);
      
      setSaveMessage("✅ Progresso limpo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  // Carregar dados ao iniciar
  useEffect(() => {
    loadAllData();
  }, []);

  const playAudio = (word: string) => {
    console.log("Tentando reproduzir áudio para:", word);
    
    const audioMap: { [key: string]: string } = {
      "I can run a marathon, what about you?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-can-run-a-marathon.mp3",
      "We can do the dishes in five minutes.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/we-can-do-the-dishes.mp3",
      "She can call you after the meeting.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-can-call-you.mp3",
      "You can't wear these shoes to play soccer.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/you-cant-wear-these-shoes.mp3",
      "They can't book a room at that hostel.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/they-cant-book-a-room.mp3",
      "I can't check out before 5:00 p.m.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-cant-check-out.mp3",
      "Can I call you in the morning?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/can-i-call-you.mp3",
      "Can you travel to that country?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/can-you-travel.mp3",
      "Can we pay for this package?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/can-we-pay.mp3",
      "There is free room service at the hotel.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there-is-free-room-service.mp3",
      "There is a travel agency near my house.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there-is-a-travel-agency.mp3",
      "There are many attractions in this city.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there-are-many-attractions.mp3",
      "There are some cabs in front of the hotel.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/there-are-some-cabs.mp3",
      "I can't play the drums.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/i-cant-play-the-drums.mp3",
      "Can you play the piano?": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/can-you-play-the-piano.mp3",
      "She can play soccer very well.": "https://raw.githubusercontent.com/Sullivan-code/english-audios/main/she-can-play-soccer.mp3"
    };

    const audioUrl = audioMap[word];
    
    if (audioUrl) {
      console.log("Usando áudio específico:", audioUrl);
      const uniqueUrl = audioUrl + '?t=' + Date.now();
      const audio = new Audio(uniqueUrl);
      audio.play().catch(e => console.error("Erro ao reproduzir áudio:", e));
      return;
    }

    const formattedWord = word
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w\s]/g, '');

    const defaultAudio = new Audio(`/audios/${formattedWord}.mp3?t=${Date.now()}`);
    defaultAudio.play().catch(e => console.error("Erro ao reproduzir áudio padrão:", e));
  };

  const handleRatingClick = (index: number, rating: number) => {
    const newRatings = [...ratings];
    newRatings[index] = rating;
    setRatings(newRatings);
  };

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
  };

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'bg-red-400';
      case 2: return 'bg-yellow-400';
      case 3: return 'bg-green-400';
      default: return 'bg-gray-300';
    }
  };

  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Grammar & Structure",
      content: [
        { english: "I can run a marathon, what about you?", portuguese: "Eu posso correr uma maratona, e você?" },
        { english: "We can do the dishes in five minutes.", portuguese: "Nós podemos lavar a louça em cinco minutos." },
        { english: "She can call you after the meeting.", portuguese: "Ela pode te ligar depois da reunião." },
        { english: "You can't wear these shoes to play soccer.", portuguese: "Você não pode usar esses sapatos para jogar futebol." },
        { english: "They can't book a room at that hostel.", portuguese: "Eles não podem reservar um quarto naquele hostel." },
        { english: "I can't check out before 5:00 p.m.", portuguese: "Eu não posso fazer o check-out antes das 17:00." },
        { english: "Can I call you in the morning?", portuguese: "Posso te ligar de manhã?" },
        { english: "Can you travel to that country?", portuguese: "Você pode viajar para aquele país?" },
        { english: "Can we pay for this package?", portuguese: "Nós podemos pagar por este pacote?" },
        { english: "There is free room service at the hotel.", portuguese: "Há serviço de quarto grátis no hotel." },
        { english: "There is a travel agency near my house.", portuguese: "Há uma agência de viagens perto da minha casa." },
        { english: "There are many attractions in this city.", portuguese: "Há muitas atrações nesta cidade." },
        { english: "There are some cabs in front of the hotel.", portuguese: "Há alguns táxis na frente do hotel." },
        { english: "I can't play the drums.", portuguese: "Eu não sei tocar bateria." },
        { english: "Can you play the piano?", portuguese: "Você sabe tocar piano?" },
        { english: "She can play soccer very well.", portuguese: "Ela sabe jogar futebol muito bem." },
        { english: "Do you prefer to ride a bike or to go running?", portuguese: "Você prefere andar de bicicleta ou correr?" },
        { english: "They always go sightseeing when they travel.", portuguese: "Eles sempre fazem turismo quando viajam." },
        { english: "I like to go running in the morning.", portuguese: "Eu gosto de correr de manhã." },
        { english: "We usually take a lot of pictures together.", portuguese: "Nós geralmente tiramos muitas fotos juntos." },
        { english: "I run on the treadmill every morning.", portuguese: "Eu corro na esteira toda manhã." },
        { english: "She does yoga at the gym.", portuguese: "Ela faz yoga na academia." },
        { english: "Do you want to go swimming? Actually, I can't. I'm busy today.", portuguese: "Você quer nadar? Na verdade, não posso. Estou ocupado hoje." },
        { english: "Do you want to go on a trip to Italy?", portuguese: "Você quer fazer uma viagem para a Itália?" },
        { english: "We prefer to travel by plane.", portuguese: "Nós preferimos viajar de avião." },
        { english: "What time do you have to arrive at the airport?", portuguese: "Que horas você tem que chegar no aeroporto?" },
        { english: "Please call me when you arrive at the resort.", portuguese: "Por favor, me ligue quando você chegar no resort." },
        { english: "How often do you travel for leisure?", portuguese: "Com que frequência você viaja por lazer?" },
        { english: "I only travel on business.", portuguese: "Eu só viajo a negócios." },
        { english: "We want to go on a cruise one day.", portuguese: "Nós queremos fazer um cruzeiro um dia." },
        { english: "What's the wi-fi password at the hostel?", portuguese: "Qual é a senha do wi-fi no hostel?" }
      ]
    },
    assessment: {
      title: "📊 Self-Assessment",
      content: [
        "Say the names of some musical instruments.",
        "Talk about hobbies and sports.",
        "Say what I can and can't do.",
        "Ask about what others can or can't do.",
        "Talk about traveling and destinations.",
        "Describe places using there is / there are.",
        "Say the names of some sports or hobbies.",
        "Name some things you find at an airport.",
        "Name some things you take on a trip.",
        "Name some hotel facilities.",
        "Give examples of nationalities.",
        "Give examples using there is / there are in your classroom."
      ]
    }
  };

  // Conversation questions
  const conversationQuestions = [
    "What time do you leave home to go to work or school?",
    "Do you stay in a hotel when you travel?",
    "What time do you have to arrive at the airport?",
    "What time do you usually have dinner?",
    "Do you prefer to travel in December?",
    "Do you prefer to travel by plane or by car?",
    "Do you know how to ride a bike?",
    "Do you usually travel on business or for leisure?",
    "Do your friends usually save money for vacations?",
    "Do you visit tourist attractions?",
    "Where do you put your luggage?",
    "Do you prefer a hotel or a hostel?",
    "What do you usually do in your free time?",
    "How often do you travel?",
    "Do you have free time on weekends?",
    "Can you play soccer well?",
    "What is your favorite hobby?",
    "Do you prefer to exercise at the gym or at the park?",
    "What is his/her nationality?"
  ];

  // Phrasal verbs for extra practice
  const phrasalVerbs = [
    { english: "I need to come up with a better itinerary.", portuguese: "Eu preciso criar um melhor itinerário." },
    { english: "The agent brought up a new destination.", portuguese: "O agente mencionou um novo destino." },
    { english: "I'm trying to figure out the cheapest option.", portuguese: "Estou tentando descobrir a opção mais barata." },
    { english: "He kept on talking about his trip.", portuguese: "Ele continuou falando sobre a viagem dele." },
    { english: "She pointed out the best hotel.", portuguese: "Ela apontou o melhor hotel." },
    { english: "The trip turned out amazing.", portuguese: "A viagem acabou sendo incrível." },
    { english: "Let's go over the details again.", portuguese: "Vamos revisar os detalhes novamente." },
    { english: "I will look into that hotel.", portuguese: "Vou pesquisar sobre aquele hotel." },
    { english: "I ran into a friend abroad.", portuguese: "Eu encontrei um amigo no exterior." },
    { english: "I need to catch up on my travel plans.", portuguese: "Preciso atualizar meus planos de viagem." }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando lição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      {/* Notificação de salvamento */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {saveMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Barra de controle de progresso */}
        <div className="mb-8 flex justify-between items-center bg-white p-4 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <h3 className="font-semibold text-gray-700">💾 Progresso:</h3>
            {lastSaved ? (
              <span className="text-sm text-gray-600">Último save: {lastSaved}</span>
            ) : (
              <span className="text-sm text-gray-600">Nenhum progresso salvo</span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveAllData}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Save size={18} />
              Salvar Agora
            </button>
            <button
              onClick={loadAllData}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              Carregar
            </button>
            <button
              onClick={clearAllData}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-purple-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📘 REVIEW 10 – DIGITAL VERSION
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Grammar & Structure • Conversation • Self-Assessment
            </p>
            <div className="w-48 h-48 mx-auto relative">
              <Image
                src="https://i.ibb.co/BHzD06DX/review-main.jpg"
                alt="Review 10 - Travel and Abilities"
                fill
                className="rounded-2xl object-cover shadow-lg"
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-purple-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                📖 Grammar & Structure
              </h2>
              
              {/* CAN / CAN'T Section */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">✅ CAN / CAN'T (Ability & Possibility)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.pinpoint.content.slice(0, 16).map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-2xl shadow-lg border-2 border-blue-200">
                      <div className="flex items-start space-x-4">
                        <button 
                          onClick={() => playAudio(item.english)}
                          className="flex-shrink-0 text-purple-600 hover:text-purple-800 transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <div className="text-lg font-bold text-blue-700 mb-1">{item.english}</div>
                          <div className="text-md text-gray-600">{item.portuguese}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel & Routine Expressions */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-green-600 mb-4">🚴‍♂️ Travel & Routine Expressions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.pinpoint.content.slice(16, 31).map((item, index) => (
                    <div key={index} className="bg-gradient-to-br from-green-100 to-teal-100 p-4 rounded-2xl shadow-lg border-2 border-green-200">
                      <div className="flex items-start space-x-4">
                        <button 
                          onClick={() => playAudio(item.english)}
                          className="flex-shrink-0 text-green-600 hover:text-green-800 transition-colors mt-1"
                          aria-label="Play audio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                        </button>
                        <div>
                          <div className="text-lg font-bold text-green-700 mb-1">{item.english}</div>
                          <div className="text-md text-gray-600">{item.portuguese}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Assessment Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
                📊 Self-Assessment
              </h2>
              
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-lg text-purple-700 mb-6 text-center">
                  <strong>I can... (Eu consigo...)</strong>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sections.assessment.content.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border-2 border-purple-100 shadow-sm">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <span className="text-purple-800 font-medium">{item}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {[1, 2, 3].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => handleRatingClick(index, rating)}
                                className={`w-8 h-8 rounded-full transition-all duration-200 ${
                                  ratings[index] === rating 
                                    ? getRatingColor(rating) + ' transform scale-110'
                                    : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                aria-label={`Rate ${rating} for "${item}"`}
                              >
                                {ratings[index] === rating && (
                                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                                    {rating === 1 ? 'N' : rating === 2 ? 'G' : 'E'}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          
                          <div className="text-sm text-gray-500 font-medium">
                            {ratings[index] === 1 && 'Needs Practice'}
                            {ratings[index] === 2 && 'Good'}
                            {ratings[index] === 3 && 'Excellent'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-xl p-6">
                  <div className="text-center mb-4">
                    <p className="text-yellow-800 font-bold text-lg">
                      🎯 Rating Guide
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-red-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-red-700 font-medium text-sm">Needs Practice</span>
                    </div>
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-yellow-700 font-medium text-sm">Good</span>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-green-700 font-medium text-sm">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Practice Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-teal-300">
          <h2 className="text-3xl font-bold text-teal-600 mb-6 text-center">
            🗣️ Conversation Practice
          </h2>
          <p className="text-center text-gray-600 mb-6">Responda em inglês com respostas completas:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversationQuestions.map((question, index) => (
              <div key={index} className="bg-teal-50 p-4 rounded-xl border border-teal-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <span className="text-teal-800 font-medium">{question}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Practice - Phrasal Verbs */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-orange-300">
          <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
            🚀 Extra Practice - Phrasal Verbs
          </h2>
          <p className="text-center text-gray-600 mb-6">Use in travel context:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {phrasalVerbs.map((item, index) => (
              <div key={index} className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                <div className="font-bold text-orange-700 mb-1">{item.english}</div>
                <div className="text-gray-600 text-sm">{item.portuguese}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-yellow-300 text-center">
            <div className="text-4xl mb-2">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Progress</h3>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
              <div 
                className="bg-green-500 h-4 rounded-full" 
                style={{ width: `${(ratings.filter(r => r > 1).length / ratings.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              {Math.round((ratings.filter(r => r > 1).length / ratings.length) * 100)}% Complete
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-purple-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-purple-600">
              {ratings.filter(r => r === 3).length > 8 ? 'Advanced' : 
               ratings.filter(r => r === 2).length > 6 ? 'Intermediate' : 'Beginner'}
            </div>
            <p className="text-gray-600">Keep practicing!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-teal-300 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Next Steps</h3>
            <p className="text-gray-600">
              {ratings.filter(r => r === 1).length > 0 
                ? 'Practice what needs work' 
                : 'Ready for next lesson!'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={() => {
              router.push("/cursos/lesson9");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Previous Lesson
          </button>
          <button
            onClick={saveAllData}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg flex items-center gap-2"
          >
            <Save size={20} />
            Save Progress
          </button>
          <button
            onClick={() => {
              router.push("/cursos/lesson11");
            }}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson ↠
          </button>
        </div>

        {/* Indicador de último save */}
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>{lastSaved ? `📅 Último save: ${lastSaved}` : '💾 Clique em "Save Progress" para guardar suas respostas'}</p>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-purple-100 border-4 border-purple-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-purple-700">
              🎉 Excellent work! You're mastering travel vocabulary and abilities! 🎉
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}