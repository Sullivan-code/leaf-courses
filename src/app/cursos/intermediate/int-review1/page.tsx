"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Save, Volume2 } from "lucide-react";

type SectionKey = 'pinpoint' | 'assessment';

interface ReviewLessonData {
  ratings: number[];
  activeSection: SectionKey;
  lastSaved: string | null;
}

// ============================================
// SPEECH SYSTEM (Imported from Lesson 66)
// ============================================
const getVoices = () => {
  if (typeof window === "undefined") return { female: null, male: null };
  const voices = window.speechSynthesis.getVoices();

  const femaleVoice =
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Microsoft Aria") ||
          v.name.includes("Microsoft Jenny") ||
          v.name.includes("Microsoft Michelle") ||
          v.name.includes("Samantha") ||
          v.name.includes("Google US English"))
    ) || voices.find((v) => v.lang === "en-US");

  const maleVoice =
    voices.find(
      (v) =>
        v.lang === "en-US" &&
        (v.name.includes("Microsoft Guy") ||
          v.name.includes("Microsoft Davis") ||
          v.name.includes("Alex") ||
          v.name.includes("Daniel"))
    ) || voices.find((v) => v.lang === "en-US" && v !== femaleVoice);

  return { female: femaleVoice, male: maleVoice };
};

const speakEnglish = (
  text: string,
  rate = 0.9,
  gender: "female" | "male" = "female"
) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = gender === "female" ? 1.05 : 0.95;

  const { female, male } = getVoices();
  const voice = gender === "female" ? female : male;
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
};

const SpeakSentence = ({
  text,
  children,
  className = "",
}: {
  text: string;
  children?: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={() => {
      const speechText =
        children && typeof children === "string" ? children : text;
      speakEnglish(speechText, 0.85, "female");
    }}
    className={`group cursor-pointer hover:bg-green-50 px-1 rounded transition-colors text-left inline-flex items-center gap-1 ${className}`}
  >
    {children || text}
    <Volume2
      size={14}
      className="opacity-0 group-hover:opacity-100 transition-opacity text-green-500 flex-shrink-0"
    />
  </button>
);


export default function ReviewLesson1() {
  const router = useRouter();
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeSection, setActiveSection] = useState<SectionKey>('pinpoint');
  // 6 itens no Assessment da imagem
  const [ratings, setRatings] = useState<number[]>([2, 2, 2, 2, 2, 2]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Função para salvar todos os dados
  const saveAllData = () => {
    try {
      const lessonData: ReviewLessonData = {
        ratings,
        activeSection,
        lastSaved: new Date().toLocaleString()
      };
      
      localStorage.setItem('reviewLesson1', JSON.stringify(lessonData));
      setLastSaved(new Date().toLocaleString());
      setSaveMessage("✅ Progresso salvo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
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
      const savedData = localStorage.getItem('reviewLesson1');
      if (savedData) {
        const parsedData: ReviewLessonData = JSON.parse(savedData);
        
        setRatings(parsedData.ratings || [2, 2, 2, 2, 2, 2]);
        setActiveSection(parsedData.activeSection || 'pinpoint');
        setLastSaved(parsedData.lastSaved || null);
        
        setSaveMessage("✅ Progresso carregado com sucesso!");
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000);
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
      localStorage.removeItem('reviewLesson1');
      
      setRatings([2, 2, 2, 2, 2, 2]);
      setActiveSection('pinpoint');
      setLastSaved(null);
      
      setSaveMessage("✅ Progresso limpo com sucesso!");
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

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

  // --- CONTEÚDO EXTRAÍDO DAS IMAGENS (NÍVEL B1) ---
  const sections = {
    pinpoint: {
      title: "📖 PINPOINT - Grammar & Structure",
      content: [
        // House & Furniture (A2/B1)
        { english: "There are two broken desks in the room.", portuguese: "Há duas escrivaninhas quebradas no quarto." },
        { english: "There aren't any carpets in my bedroom.", portuguese: "Não há nenhum tapete no meu quarto." },
        { english: "Is there an air fryer in the kitchen?", portuguese: "Tem uma air fryer na cozinha?" },
        { english: "Move the coffee table to the left, please.", portuguese: "Mova a mesa de centro para a esquerda, por favor." },
        { english: "Put the bed next to the closet.", portuguese: "Coloque a cama ao lado do armário." },
        { english: "My bedroom is very tidy. I don't like messy rooms!", portuguese: "Meu quarto é muito arrumado. Eu não gosto de quartos bagunçados!" },
        { english: "Everybody needs to own a house.", portuguese: "Todo mundo precisa ter sua própria casa." },
        { english: "Somebody is moving to their new apartment.", portuguese: "Alguém está se mudando para o novo apartamento deles." },
        { english: "Is there anybody looking for the doctor?", portuguese: "Tem alguém procurando o médico?" },
        { english: "Nobody is in the elevator.", portuguese: "Ninguém está no elevador." },
        { english: "We live in a tiny studio apartment. We want to move to a two-story house.", portuguese: "Nós moramos em um apartamento conjugado minúsculo. Queremos nos mudar para uma casa de dois andares." },
        { english: "There is a large detached house for rent near here.", portuguese: "Há uma grande casa isolada para alugar perto daqui." },
        { english: "There is plenty of space in my office. I need somebody to share it with.", portuguese: "Há muito espaço no meu escritório. Preciso de alguém para compartilhá-lo." },
        { english: "The cottage has a beautiful view of the lake.", portuguese: "O chalé tem uma bela vista do lago." },
        
        // Second half: Upgraded to B1 Level
        { english: "My brother is planning to start his own business next year.", portuguese: "Meu irmão está planejando abrir seu próprio negócio no ano que vem." },
        { english: "I've been searching for my ID everywhere, and it turns out it was right under those books.", portuguese: "Eu estive procurando meu documento por toda parte, e acabou que ele estava bem embaixo daqueles livros." },
        { english: "Despite the stressful situations he faces, my father never loses his temper, which I truly admire.", portuguese: "Apesar das situações estressantes que ele enfrenta, meu pai nunca perde a paciência, o que eu admiro de verdade." },
        { english: "Would you mind sharing your sandwich with me? I completely forgot to bring my lunch today.", portuguese: "Você se importaria de compartilhar seu sanduíche comigo? Eu esqueci completamente de trazer meu almoço hoje." },
        { english: "No matter how many times you get disappointed, you should never lose faith in people.", portuguese: "Não importa quantas vezes você se decepcione, você nunca deve perder a fé nas pessoas." },
        { english: "Do you always seem to get lost whenever you try to navigate downtown without a map?", portuguese: "Você sempre parece se perder quando tenta navegar pelo centro sem um mapa?" },
        { english: "Could you please put these t-shirts away in the closet before our guests arrive?", portuguese: "Você poderia, por favor, guardar essas camisetas no armário antes que nossos convidados cheguem?" },
        { english: "I need you to get these broken umbrellas out of the car right now so we can throw them away.", portuguese: "Eu preciso que você tire esses guarda-chuvas quebrados do carro agora mesmo para que possamos jogá-los fora." },
        { english: "I usually spend my Saturday mornings cleaning up my room and organizing my closet.", portuguese: "Eu geralmente passo minhas manhãs de sábado limpando meu quarto e organizando meu armário." },
        { english: "Since they both work from home now, they are looking for a place where they can have their own space to work.", portuguese: "Como ambos trabalham em casa agora, eles estão procurando um lugar onde possam ter seu próprio espaço para trabalhar." },
        { english: "They are saving money because they don't want to pay rent for the rest of their lives.", portuguese: "Eles estão economizando dinheiro porque não querem pagar aluguel pelo resto da vida." },
        { english: "Excuse me, could you tell me if there is a lost and found section around here?", portuguese: "Com licença, você poderia me dizer se há uma seção de achados e perdidos por aqui?" },
        { english: "I was wondering if you could let me know where the lost and found section is.", portuguese: "Eu queria saber se você poderia me avisar onde fica a seção de achados e perdidos." },
        { english: "I try to stay calm, but I always lose my temper when I have to discuss the same issues with them.", portuguese: "Eu tento ficar calmo, mas eu sempre perco a paciência quando tenho que discutir os mesmos problemas com eles." }
      ]
    },
    assessment: {
      title: "📊 Self-Assessment",
      content: [
        "...talk about the rooms in a house and some pieces of furniture. (L61)",
        "...describe the rooms in a house. (L61)",
        "...talk about the place I live. (L63)",
        "...talk about possible ways to have a house. (L63)",
        "...describe objects I may lose or find. (L65)",
        "...talk about my mood and reactions to events. (L65)"
      ]
    }
  };

  // Conversation questions (Imagem 2)
  const conversationQuestions = [
    "Do you want to move to another city?",
    "Where do you want to move to?",
    "Do you usually keep broken things? If so, why?",
    "Is your room tidy or messy?",
    "Who cleans up your bedroom?",
    "Are there carpets in your house?",
    "Do you live in a house or in an apartment? Is it large or tiny?",
    "Do you own your place or do you pay rent?",
    "What view do you have from your house?",
    "Do you prefer a gated community or a cottage in the countryside?",
    "Who do you usually lose your temper with?",
    "What makes you lose control?",
    "Do you like to share food with other people?",
    "Do you like languages? Do you find it easy to learn them?",
    "What do you do when you get lost?",
    "What makes you lose faith?",
    "How do you like to have your name on name tags?",
    "Do you have your charger in your backpack / bag?",
    "What is there in your living room?",
    "What is there behind your house?"
  ];

  // Self-assessment prompts (Imagem 2 - final)
  const selfAssessmentPrompts = [
    { question: "How do you say 'Mude para a esquerda' in English?", answer: "Move to the left" },
    { question: "How can you ask if there is a grocery store near where you are?", answer: "Is there a grocery store near here? / Can you tell me if there is a grocery store near here?" },
    { question: "Who cleans up the kitchen in your house?", answer: "My mother cleans up the kitchen. / I clean up the kitchen." },
    { question: "Are your drawers messy?", answer: "Yes, they are a bit messy. / No, my drawers are very tidy." },
    { question: "How do you say 'pegar elevador' in English?", answer: "Take the elevator" },
    { question: "What's your favorite view in your city?", answer: "My favorite view is the park downtown." },
    { question: "Are there plenty of buildings in your city?", answer: "Yes, there are plenty of tall buildings in my city." }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando lição...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      {/* Notificação de salvamento */}
      {showSaveNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {saveMessage}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        
        {/* Barra de controle de progresso */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-lg">
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
          <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-green-400 mb-6">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              📘 REVIEW 1 – MY HOUSE & MY ROUTINE
            </h1>
            <p className="text-2xl text-gray-600 mb-6">
              Grammar & Structure • Conversation • Self-Assessment
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => handleSectionChange(key as SectionKey)}
              className={`py-4 px-2 rounded-2xl font-bold text-lg transition-all duration-300 ${
                activeSection === key
                  ? 'bg-green-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-green-200'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-green-200">
          
          {/* PINPOINT Section */}
          {activeSection === 'pinpoint' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
                📖 Grammar & Structure
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.pinpoint.content.map((item, index) => (
                  <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl shadow-sm border border-green-200 flex items-start">
                    <div>
                      <SpeakSentence 
                        text={item.english} 
                        className="text-lg font-bold text-green-800 mb-1" 
                      />
                      <div className="text-sm text-gray-600">{item.portuguese}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assessment Section */}
          {activeSection === 'assessment' && (
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-green-600 mb-6 text-center">
                📊 Self-Assessment
              </h2>
              
              <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200">
                <p className="text-lg text-green-800 mb-6 text-center">
                  <strong>I can... (Eu consigo...)</strong>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {sections.assessment.content.map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                      <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <SpeakSentence 
                            text={item} 
                            className="text-gray-800 font-medium" 
                          />
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
                                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
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

                {/* Reflection Question from Image 3 */}
                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm mb-8">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Reflection:</h3>
                  <p className="text-gray-700 italic">
                    "How did Lessons 61 to 66 help you with your personal, professional, and academic needs and wishes for studying English?"
                  </p>
                  <textarea 
                    className="w-full mt-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                    rows={3}
                    placeholder="Type your answer here..."
                  ></textarea>
                </div>

                {/* Self Assessment Prompts from Image 2 */}
                <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Self-Assessment Prompts:</h3>
                  <div className="space-y-4">
                    {selfAssessmentPrompts.map((prompt, idx) => (
                      <div key={idx} className="border-l-4 border-green-400 pl-4 py-1">
                        <SpeakSentence 
                          text={prompt.question} 
                          className="font-medium text-gray-800" 
                        />
                        <p className="text-sm text-green-600 mt-1 italic">Expected: {prompt.answer}</p>
                      </div>
                    ))}
                  </div>
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
                      <span className="text-red-700 font-medium text-sm">Needs Practice (N)</span>
                    </div>
                    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-yellow-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-yellow-700 font-medium text-sm">Good (G)</span>
                    </div>
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3">
                      <div className="w-4 h-4 bg-green-400 rounded-full mx-auto mb-2"></div>
                      <span className="text-green-700 font-medium text-sm">Excellent (E)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conversation Practice Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-4 border-blue-300">
          <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
            🗣️ Conversation Practice
          </h2>
          <p className="text-center text-gray-600 mb-6">Responda em inglês com respostas completas:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversationQuestions.map((question, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-1">
                    {index + 1}
                  </div>
                  <SpeakSentence 
                    text={question} 
                    className="text-blue-900 font-medium" 
                  />
                </div>
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
                className="bg-green-500 h-4 rounded-full transition-all duration-500" 
                style={{ width: `${(ratings.filter(r => r > 1).length / ratings.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-600">
              {Math.round((ratings.filter(r => r > 1).length / ratings.length) * 100)}% Complete
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-green-300 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Mastery Level</h3>
            <div className="text-3xl font-bold text-green-600">
              {ratings.filter(r => r === 3).length > 3 ? 'Advanced' : 
               ratings.filter(r => r === 2).length > 2 ? 'Intermediate' : 'Beginner'}
            </div>
            <p className="text-gray-600">Keep practicing!</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border-4 border-blue-300 text-center">
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
              router.push("/cursos/lesson66");
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            ↞ Previous Lesson (66)
          </button>
          <button
            onClick={saveAllData}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Save Progress
          </button>
          <button
            onClick={() => {
              router.push("/cursos/lesson67");
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors text-lg"
          >
            Next Lesson (67) ↠
          </button>
        </div>

        {/* Indicador de último save */}
        <div className="text-center text-sm text-gray-500 mb-4">
          <p>{lastSaved ? `📅 Último save: ${lastSaved}` : '💾 Clique em "Save Progress" para guardar suas respostas'}</p>
        </div>

        {/* Celebration Message */}
        <div className="text-center">
          <div className="bg-green-100 border-4 border-green-400 rounded-3xl p-6 inline-block">
            <p className="text-2xl font-bold text-green-800">
              🎉 Excellent work! You're mastering house vocabulary and daily routines! 🎉
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