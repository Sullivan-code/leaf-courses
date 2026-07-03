"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Pause, Play, RotateCcw, ChevronDown, ChevronUp, Check, XCircle, ChevronLeft, ChevronRight, Volume2, Mic, Headphones, Sparkles, MessageCircle } from "lucide-react";

// ============================================
// LISTEN ITEMS - Imagem 1, 2, 3 (EMBARALHADAS NA TELA, MAS ORDEM CORRETA É 1,2,3)
// ============================================
const listenItemsOriginal = [
  {
    key: "image1",
    label: "1. pessoas sentadas em grupo conversando",
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=600",
    placeholder: "👥💬",
    description: "pessoas sentadas em grupo conversando e usando laptops",
    correctNumber: 1
  },
  {
    key: "image2",
    label: "2. pessoas tomando café ao fundo",
    image: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=600",
    placeholder: "☕👥",
    description: "pessoas em pé ao fundo tomando café e interagindo",
    correctNumber: 2
  },
  {
    key: "image3",
    label: "3. estudantes trabalhando em círculo",
    image: "https://images.pexels.com/photos/5428830/pexels-photo-5428830.jpeg?auto=compress&cs=tinysrgb&w=600",
    placeholder: "👨‍🎓🔄📚",
    description: "estudantes sentados em círculo trabalhando juntos",
    correctNumber: 3
  },
];

// Função para embaralhar array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// DRILLING PRACTICE I - Substitution Practice (FRASES MAIS LONGAS E COMPLEXAS)
// ============================================
const drillingExercises1 = [
  {
    id: 1,
    portuguese: "Você já está totalmente preparado para começar a nova jornada?",
    english: "Are you already completely prepared to start the new journey?",
    substitutions: [
      { word: "ir para a reunião", english: "to go to the meeting", phrase: "Are you already completely prepared to go to the meeting?" },
      { word: "viajar para o exterior", english: "to travel abroad", phrase: "Are you already completely prepared to travel abroad?" },
      { word: "assumir o projeto", english: "to take over the project", phrase: "Are you already completely prepared to take over the project?" }
    ]
  },
  {
    id: 2,
    portuguese: "Ele estava se sentindo muito cansado depois do longo dia de trabalho?",
    english: "Was he feeling very tired after the long day of work?",
    substitutions: [
      { word: "com muita fome", english: "very hungry", phrase: "Was he feeling very hungry after the long day of work?" },
      { word: "extremamente estressado", english: "extremely stressed", phrase: "Was he feeling extremely stressed after the long day of work?" },
      { word: "completamente exausto", english: "completely exhausted", phrase: "Was he feeling completely exhausted after the long day of work?" }
    ]
  },
  {
    id: 3,
    portuguese: "Você acha que eles vão conseguir terminar o relatório a tempo?",
    english: "Do you think they will be able to finish the report on time?",
    substitutions: [
      { word: "o projeto", english: "the project", phrase: "Do you think they will be able to finish the project on time?" },
      { word: "a apresentação", english: "the presentation", phrase: "Do you think they will be able to finish the presentation on time?" },
      { word: "todas as tarefas", english: "all the tasks", phrase: "Do you think they will be able to finish all the tasks on time?" }
    ]
  },
  {
    id: 4,
    portuguese: "Quem era aquele professor que estava dando aula ontem à noite?",
    english: "Who was that teacher who was giving class yesterday evening?",
    substitutions: [
      { word: "gerente", english: "manager", phrase: "Who was that manager who was giving class yesterday evening?" },
      { word: "vendedor", english: "salesperson", phrase: "Who was that salesperson who was giving class yesterday evening?" },
      { word: "consultor", english: "consultant", phrase: "Who was that consultant who was giving class yesterday evening?" }
    ]
  },
  {
    id: 5,
    portuguese: "Você poderia me dizer qual é o seu nome completo, por favor?",
    english: "Could you please tell me what your full name is?",
    substitutions: [
      { word: "o nome do seu chefe", english: "your boss's name", phrase: "Could you please tell me what your boss's name is?" },
      { word: "o endereço da empresa", english: "the company's address", phrase: "Could you please tell me what the company's address is?" },
      { word: "o número do telefone", english: "the phone number", phrase: "Could you please tell me what the phone number is?" }
    ]
  },
  {
    id: 6,
    portuguese: "Por que ela estava tão chateada com a situação ontem?",
    english: "Why was she so upset about the situation yesterday?",
    substitutions: [
      { word: "preocupada", english: "worried", phrase: "Why was she so worried about the situation yesterday?" },
      { word: "frustrada", english: "frustrated", phrase: "Why was she so frustrated about the situation yesterday?" },
      { word: "animada", english: "excited", phrase: "Why was she so excited about the situation yesterday?" }
    ]
  },
  {
    id: 7,
    portuguese: "O evento está marcado para o dia primeiro de julho, não está?",
    english: "The event is scheduled for July 1st, isn't it?",
    substitutions: [
      { word: "quatro", english: "4th", phrase: "The event is scheduled for July 4th, isn't it?" },
      { word: "20", english: "20th", phrase: "The event is scheduled for July 20th, isn't it?" },
      { word: "15", english: "15th", phrase: "The event is scheduled for July 15th, isn't it?" }
    ]
  }
];

// ============================================
// NEGATIVE EXERCISES - FRASES MAIS LONGAS
// ============================================
const negativeExercises = [
  { id: 1, affirmative: "I have been working on this project since December.", negative: "I haven't been working on this project since December.", userAnswer: "" },
  { id: 2, affirmative: "She had already finished her homework before the class started.", negative: "She hadn't already finished her homework before the class started.", userAnswer: "" },
  { id: 3, affirmative: "They will have completed the construction by next year.", negative: "They won't have completed the construction by next year.", userAnswer: "" },
  { id: 4, affirmative: "He used to take painkillers for his severe headaches.", negative: "He didn't use to take painkillers for his severe headaches.", userAnswer: "" },
  { id: 5, affirmative: "We are going to celebrate Christmas together as a family.", negative: "We aren't going to celebrate Christmas together as a family.", userAnswer: "" },
  { id: 6, affirmative: "I knew exactly what she was trying to explain to me.", negative: "I didn't know exactly what she was trying to explain to me.", userAnswer: "" },
];

// ============================================
// DRILLING PRACTICE II - Substitution Practice (MAIS COMPLEXO)
// ============================================
const drillingExercises2 = [
  {
    id: 1,
    portuguese: "Quantos anos você tinha quando se mudou para esta cidade?",
    english: "How old were you when you moved to this city?",
    substitutions: [
      { word: "ele", phrase: "How old was he when he moved to this city?" },
      { word: "ela", phrase: "How old was she when she moved to this city?" },
      { word: "eles", phrase: "How old were they when they moved to this city?" }
    ]
  },
  {
    id: 2,
    portuguese: "O vendedor já trabalhou aqui por mais de 24 anos.",
    english: "The salesperson has already worked here for over 24 years.",
    substitutions: [
      { word: "19", phrase: "The salesperson has already worked here for over 19 years." },
      { word: "33", phrase: "The salesperson has already worked here for over 33 years." },
      { word: "40", phrase: "The salesperson has already worked here for over 40 years." }
    ]
  },
  {
    id: 3,
    portuguese: "Nós não estávamos atrasados para a reunião importante.",
    english: "We weren't late for the important meeting.",
    substitutions: [
      { word: "ocupados", phrase: "We weren't busy for the important meeting." },
      { word: "tristes", phrase: "We weren't sad for the important meeting." },
      { word: "preocupados", phrase: "We weren't worried for the important meeting." }
    ]
  },
  {
    id: 4,
    portuguese: "Ela sempre foi uma enfermeira muito dedicada e atenciosa.",
    english: "She has always been a very dedicated and caring nurse.",
    substitutions: [
      { word: "gentil", phrase: "She has always been a very gentle and caring nurse." },
      { word: "feliz", phrase: "She has always been a very happy and caring nurse." },
      { word: "profissional", phrase: "She has always been a very professional and caring nurse." }
    ]
  },
  {
    id: 5,
    portuguese: "Você vai chegar atrasado para a aula de amanhã de manhã?",
    english: "Are you going to be late for tomorrow morning's class?",
    substitutions: [
      { word: "reunião", phrase: "Are you going to be late for tomorrow morning's meeting?" },
      { word: "compromisso", phrase: "Are you going to be late for tomorrow morning's appointment?" },
      { word: "entrevista", phrase: "Are you going to be late for tomorrow morning's interview?" }
    ]
  },
  {
    id: 6,
    portuguese: "Meu aniversário sempre foi comemorado no dia 14 de outubro.",
    english: "My birthday has always been celebrated on October 14th.",
    substitutions: [
      { word: "30", phrase: "My birthday has always been celebrated on October 30th." },
      { word: "18", phrase: "My birthday has always been celebrated on October 18th." },
      { word: "25", phrase: "My birthday has always been celebrated on October 25th." }
    ]
  }
];

// ============================================
// AFFIRMATIVE EXERCISES - FRASES MAIS LONGAS
// ============================================
const affirmativeExercises = [
  { id: 1, negative: "The designer hasn't been here for the entire week.", affirmative: "The designer has been here for the entire week.", userAnswer: "" },
  { id: 2, negative: "My brothers weren't young when they started their careers.", affirmative: "My brothers were young when they started their careers.", userAnswer: "" },
  { id: 3, negative: "My birthday isn't going to be in July this year.", affirmative: "My birthday is going to be in July this year.", userAnswer: "" },
  { id: 4, negative: "My sister wasn't ready to leave the house on time.", affirmative: "My sister was ready to leave the house on time.", userAnswer: "" },
  { id: 5, negative: "Her vacation hasn't been planned for January.", affirmative: "Her vacation has been planned for January.", userAnswer: "" },
  { id: 6, negative: "The sunglasses weren't as expensive as I thought they would be.", affirmative: "The sunglasses were as expensive as I thought they would be.", userAnswer: "" },
];

// ============================================
// INTERROGATIVE EXERCISES - FRASES MAIS LONGAS
// ============================================
const interrogativeExercises = [
  { id: 1, statement: "He has been working here for 38 years.", interrogative: "Has he been working here for 38 years?", userAnswer: "" },
  { id: 2, statement: "She was considered very pretty by everyone.", interrogative: "Was she considered very pretty by everyone?", userAnswer: "" },
  { id: 3, statement: "They were absolutely sure about the project's success.", interrogative: "Were they absolutely sure about the project's success?", userAnswer: "" },
  { id: 4, statement: "The meeting is going to be held in September.", interrogative: "Is the meeting going to be held in September?", userAnswer: "" },
  { id: 5, statement: "Those students have always been British citizens.", interrogative: "Have those students always been British citizens?", userAnswer: "" },
  { id: 6, statement: "The church used to be far from here.", interrogative: "Did the church use to be far from here?", userAnswer: "" },
];

// ============================================
// QUESTIONS CARDS - FRASES MAIS LONGAS
// ============================================
const questionCards = [
  {
    id: 1,
    question: "When exactly is your birthday going to be celebrated this year?",
    answer: "My birthday is going to be celebrated on [date] this year.",
    translation: "Quando exatamente seu aniversário vai ser comemorado este ano?",
    answerTranslation: "Meu aniversário vai ser comemorado no dia [data] este ano."
  },
  {
    id: 2,
    question: "How old were you when you had your first job experience?",
    answer: "I was [number] years old when I had my first job experience.",
    translation: "Quantos anos você tinha quando teve sua primeira experiência de trabalho?",
    answerTranslation: "Eu tinha [número] anos quando tive minha primeira experiência de trabalho."
  },
  {
    id: 3,
    question: "How old was your mother when she started her professional career?",
    answer: "My mother was [number] years old when she started her professional career.",
    translation: "Quantos anos sua mãe tinha quando começou sua carreira profissional?",
    answerTranslation: "Minha mãe tinha [número] anos quando começou sua carreira profissional."
  },
  {
    id: 4,
    question: "Have you always been a Brazilian citizen, or did you move from somewhere else?",
    answer: "I have always been a Brazilian citizen. / I moved from [country].",
    translation: "Você sempre foi cidadão brasileiro, ou se mudou de algum outro lugar?",
    answerTranslation: "Sempre fui cidadão brasileiro. / Eu me mudei de [país]."
  },
  {
    id: 5,
    question: "Did your father use to work as an engineer before he retired?",
    answer: "Yes, my father used to work as an engineer before he retired. / No, my father didn't use to work as an engineer.",
    translation: "Seu pai costumava trabalhar como engenheiro antes de se aposentar?",
    answerTranslation: "Sim, meu pai costumava trabalhar como engenheiro antes de se aposentar. / Não, meu pai não costumava trabalhar como engenheiro."
  },
  {
    id: 6,
    question: "Has your English teacher always been Brazilian, or did they come from another country?",
    answer: "My English teacher has always been Brazilian. / My English teacher came from [country].",
    translation: "Seu professor de inglês sempre foi brasileiro, ou ele veio de outro país?",
    answerTranslation: "Meu professor de inglês sempre foi brasileiro. / Meu professor de inglês veio de [país]."
  },
  {
    id: 7,
    question: "Has your boss always been kind and supportive to you throughout your career?",
    answer: "Yes, my boss has always been kind and supportive to me. / No, my boss hasn't always been kind.",
    translation: "Seu chefe sempre foi gentil e solidário com você ao longo da sua carreira?",
    answerTranslation: "Sim, meu chefe sempre foi gentil e solidário comigo. / Não, meu chefe nem sempre foi gentil."
  },
  {
    id: 8,
    question: "Are you feeling truly happy with how your life is going at the moment?",
    answer: "Yes, I am truly happy with how my life is going. / No, I am not truly happy.",
    translation: "Você está se sentindo verdadeiramente feliz com como sua vida está indo no momento?",
    answerTranslation: "Sim, estou verdadeiramente feliz com como minha vida está indo. / Não, não estou verdadeiramente feliz."
  },
  {
    id: 9,
    question: "Were your classmates feeling hungry after the long lecture yesterday?",
    answer: "Yes, my classmates were feeling hungry after the long lecture. / No, they weren't feeling hungry.",
    translation: "Seus colegas de classe estavam sentindo fome depois da longa palestra de ontem?",
    answerTranslation: "Sim, meus colegas estavam sentindo fome depois da longa palestra. / Não, eles não estavam sentindo fome."
  },
  {
    id: 10,
    question: "Are you already completely prepared to go back home after this long day?",
    answer: "Yes, I am already completely prepared to go back home. / No, I am not prepared yet.",
    translation: "Você já está completamente preparado para voltar para casa depois deste longo dia?",
    answerTranslation: "Sim, já estou completamente preparado para voltar para casa. / Não, ainda não estou preparado."
  },
];

// ============================================
// TUNE IN YOUR EARS - Video Section (Small Talk)
// ============================================
const tuneInYourEarsVideo = {
  title: "🎬 Small Talk: Starting Conversations in English",
  description: "Watch this video to learn how to start short conversations in different places like the gym, cafe, or government office. Practice your listening skills!",
  youtubeId: "w98U_C_9nVs",
  keyVocabulary: [
    { english: "anywhere", portuguese: "qualquer lugar" },
    { english: "clearly", portuguese: "de forma clara" },
    { english: "key ideas", portuguese: "ideias principais" },
    { english: "short chat", portuguese: "conversa curta" },
    { english: "let's get started", portuguese: "vamos começar" },
    { english: "short", portuguese: "curto" },
    { english: "lovely weather", portuguese: "clima perfeito" },
    { english: "simple way", portuguese: "de forma simples" },
    { english: "interest", portuguese: "interesse" },
    { english: "earlier", portuguese: "mais cedo" },
    { english: "I could use", portuguese: "me cairia muito bem (gíria)" },
    { english: "it expresses", portuguese: "isso mostra" },
    { english: "often", portuguese: "frequentemente" },
    { english: "line", portuguese: "fila" },
    { english: "busy place", portuguese: "lugar cheio/lotado" },
    { english: "government office", portuguese: "escritório do governo" }
  ],
  questions: [
    {
      id: 1,
      question: "What is small talk and why is it important in daily life?",
      correctAnswer: "Small talk is a short, light conversation about everyday topics like weather or interests. It's important because it helps break the ice and connect with people.",
      vocabulary: [
        { english: "small talk", portuguese: "conversa fiada / conversa curta" },
        { english: "light conversation", portuguese: "conversa leve" },
        { english: "everyday topics", portuguese: "assuntos do dia a dia" },
        { english: "break the ice", portuguese: "quebrar o gelo" }
      ]
    },
    {
      id: 2,
      question: "What kind of places are ideal for starting short conversations with strangers?",
      correctAnswer: "You can start short conversations at the gym, cafe, government office, bus stop, or any busy place where people are waiting or relaxing.",
      vocabulary: [
        { english: "gym", portuguese: "academia" },
        { english: "cafe", portuguese: "cafeteria" },
        { english: "government office", portuguese: "escritório do governo" },
        { english: "busy place", portuguese: "lugar cheio/lotado" },
        { english: "strangers", portuguese: "estranhos/desconhecidos" }
      ]
    },
    {
      id: 3,
      question: "How do you ask if a person's project is progressing well or not?",
      correctAnswer: "You can ask: 'How is your project going?' or 'Is everything on track with your project?' or 'Are you making good progress on your project?'",
      vocabulary: [
        { english: "project", portuguese: "projeto" },
        { english: "going", portuguese: "indo / andando" },
        { english: "on track", portuguese: "no caminho certo" },
        { english: "making progress", portuguese: "fazendo progresso" }
      ]
    },
    {
      id: 4,
      question: "How can you say that you would really appreciate something at that moment?",
      correctAnswer: "You can say: 'I could use a coffee right now.' or 'I could use some help with this.' or 'I could really use a break.'",
      vocabulary: [
        { english: "I could use", portuguese: "me cairia muito bem (gíria)" },
        { english: "right now", portuguese: "agora mesmo" },
        { english: "appreciate", portuguese: "apreciar" },
        { english: "break", portuguese: "pausa/descanso" }
      ]
    },
    {
      id: 5,
      question: "How would you naturally start a conversation at the gym or at a cafe? Give specific examples.",
      correctAnswer: "At the gym: 'Do you come here often?' or 'This machine is great, isn't it?' or 'How many sets do you have left?' At a cafe: 'Is this seat taken?' or 'What do you recommend here?' or 'Have you tried the coffee here before?'",
      vocabulary: [
        { english: "gym", portuguese: "academia" },
        { english: "often", portuguese: "frequentemente" },
        { english: "machine", portuguese: "máquina" },
        { english: "seat taken", portuguese: "lugar ocupado" },
        { english: "recommend", portuguese: "recomendar" },
        { english: "sets", portuguese: "séries (exercícios)" }
      ]
    }
  ]
};

// ============================================
// COMPONENTES AUXILIARES
// ============================================

interface AudioPlayerProps {
  src: string;
  compact?: boolean;
}

const AudioPlayer = ({ src, compact = false }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current || new Audio(src);
    if (!audioRef.current) audioRef.current = audio;
    else audio.src = src;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((err) => console.error("Audio error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setProgress(0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const width = rect.width;
    const percent = offsetX / width;
    audio.currentTime = percent * audio.duration;
    setProgress(percent * 100);
  };

  return (
    <div className={`flex items-center gap-2 ${compact ? "ml-2" : ""}`}>
      <button 
        onClick={togglePlayPause} 
        className={`${compact ? "p-1" : "p-2"} bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full hover:shadow-lg transition-all duration-300 hover:scale-105`}
      >
        {isPlaying ? <Pause size={compact ? 12 : 16} /> : <Play size={compact ? 12 : 16} />}
      </button>
      <button 
        onClick={resetAudio} 
        className={`${compact ? "p-1" : "p-2"} bg-gray-400 text-white rounded-full hover:bg-gray-500 transition-all duration-300`}
      >
        <RotateCcw size={compact ? 12 : 16} />
      </button>
      
      {!compact && (
        <div 
          ref={progressBarRef}
          className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-200" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      )}
      
      <audio ref={audioRef} src={src} preload="auto" />
    </div>
  );
};

interface AnswerResultProps {
  isCorrect: boolean;
  correctAnswer: string;
}

const AnswerResult = ({ isCorrect, correctAnswer }: AnswerResultProps) => {
  if (isCorrect) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
        <Check size={16} className="text-green-600" />
        <span className="text-sm text-green-700 font-medium">Correct! ✓</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
      <XCircle size={16} className="text-red-600" />
      <span className="text-sm text-red-700">
        <span className="font-medium">Expected:</span> {correctAnswer}
      </span>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL - LESSON 42
// ============================================

export default function Lesson42() {
  const router = useRouter();
  
  // Estados para as respostas do Listen
  const [listenAnswers, setListenAnswers] = useState<Record<string, number | null>>({});
  const [showListenResults, setShowListenResults] = useState<Record<string, boolean>>({});
  const [listenResults, setListenResults] = useState<Record<string, boolean>>({});
  
  // Estados para os exercícios de drilling 1
  const [drilling1Sentences, setDrilling1Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de drilling 2
  const [drilling2Sentences, setDrilling2Sentences] = useState<Record<number, string>>(
    Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english]))
  );
  
  // Estados para os exercícios de negativo
  const [negativeEx, setNegativeEx] = useState(negativeExercises);
  const [negativeResults, setNegativeResults] = useState<Record<number, boolean>>({});
  const [showNegativeResults, setShowNegativeResults] = useState<Record<number, boolean>>({});
  
  // Estados para os exercícios de afirmativo
  const [affirmativeEx, setAffirmativeEx] = useState(affirmativeExercises);
  const [affirmativeResults, setAffirmativeResults] = useState<Record<number, boolean>>({});
  const [showAffirmativeResults, setShowAffirmativeResults] = useState<Record<number, boolean>>({});
  
  // Estados para os exercícios de interrogativo
  const [interrogativeEx, setInterrogativeEx] = useState(interrogativeExercises);
  const [interrogativeResults, setInterrogativeResults] = useState<Record<number, boolean>>({});
  const [showInterrogativeResults, setShowInterrogativeResults] = useState<Record<number, boolean>>({});
  
  // Estado para o QUESTIONS section
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [questionsUserAnswer, setQuestionsUserAnswer] = useState("");
  const [showQuestionsResult, setShowQuestionsResult] = useState(false);
  const [questionsResult, setQuestionsResult] = useState<boolean>(false);
  
  // Estado para o Tune In Your Ears video answers
  const [videoAnswers, setVideoAnswers] = useState<Record<number, string>>({});
  const [showVideoResults, setShowVideoResults] = useState<Record<string, boolean>>({});
  const [videoResults, setVideoResults] = useState<Record<string, boolean>>({});
  
  // Estados para controle de expansão das seções
  const [sections, setSections] = useState({
    conversationTime: true,
    listen: true,
    drilling1: true,
    negative: true,
    drilling2: true,
    affirmative: true,
    interrogative: true,
    questions: true,
    tuneInYourEars: true
  });

  // Estado para armazenar a sequência de números que o aluno selecionou (ordem das imagens)
  const [imageSequence, setImageSequence] = useState<number[]>([]);
  const [showFinalSequenceResult, setShowFinalSequenceResult] = useState(false);
  const [isSequenceCorrect, setIsSequenceCorrect] = useState(false);
  
  // Estado para armazenar a lista de itens embaralhados (inicializado no cliente)
  const [shuffledListenItems, setShuffledListenItems] = useState(listenItemsOriginal);
  const [isHydrated, setIsHydrated] = useState(false);

  // Embaralhar as imagens para exibição APENAS no cliente para evitar erro de hidratação
  useEffect(() => {
    setShuffledListenItems(shuffleArray(listenItemsOriginal));
    setIsHydrated(true);
  }, []);

  // ==============================
  // PERSISTÊNCIA - CARREGAMENTO
  // ==============================
  useEffect(() => {
    const savedAnswers = localStorage.getItem("lesson42Answers");
    if (savedAnswers) {
      try {
        const data = JSON.parse(savedAnswers);
        
        if (data.listenAnswers) setListenAnswers(data.listenAnswers);
        if (data.showListenResults) setShowListenResults(data.showListenResults);
        if (data.listenResults) setListenResults(data.listenResults);
        if (data.drilling1Sentences) setDrilling1Sentences(data.drilling1Sentences);
        if (data.drilling2Sentences) setDrilling2Sentences(data.drilling2Sentences);
        if (data.negativeEx) setNegativeEx(data.negativeEx);
        if (data.negativeResults) setNegativeResults(data.negativeResults);
        if (data.showNegativeResults) setShowNegativeResults(data.showNegativeResults);
        if (data.affirmativeEx) setAffirmativeEx(data.affirmativeEx);
        if (data.affirmativeResults) setAffirmativeResults(data.affirmativeResults);
        if (data.showAffirmativeResults) setShowAffirmativeResults(data.showAffirmativeResults);
        if (data.interrogativeEx) setInterrogativeEx(data.interrogativeEx);
        if (data.interrogativeResults) setInterrogativeResults(data.interrogativeResults);
        if (data.showInterrogativeResults) setShowInterrogativeResults(data.showInterrogativeResults);
        if (data.currentCardIndex !== undefined) setCurrentCardIndex(data.currentCardIndex);
        if (data.questionsUserAnswer) setQuestionsUserAnswer(data.questionsUserAnswer);
        if (data.showQuestionsResult !== undefined) setShowQuestionsResult(data.showQuestionsResult);
        if (data.questionsResult !== undefined) setQuestionsResult(data.questionsResult);
        if (data.sections) setSections(data.sections);
        if (data.imageSequence) setImageSequence(data.imageSequence);
        if (data.videoAnswers) setVideoAnswers(data.videoAnswers);
        
        console.log("Dados carregados do localStorage para Lesson 42");
      } catch (error) {
        console.error("Erro ao carregar respostas salvas:", error);
      }
    }
  }, []);

  // ==============================
  // PERSISTÊNCIA - SALVAMENTO
  // ==============================
  const saveAllAnswers = async () => {
    const data = {
      listenAnswers,
      showListenResults,
      listenResults,
      drilling1Sentences,
      drilling2Sentences,
      negativeEx,
      negativeResults,
      showNegativeResults,
      affirmativeEx,
      affirmativeResults,
      showAffirmativeResults,
      interrogativeEx,
      interrogativeResults,
      showInterrogativeResults,
      currentCardIndex,
      questionsUserAnswer,
      showQuestionsResult,
      questionsResult,
      sections,
      imageSequence,
      videoAnswers,
      lastUpdated: new Date().toISOString(),
      lessonName: "Lesson 42 - Health, Feelings & Professions",
      version: "1.0"
    };
    
    try {
      localStorage.setItem("lesson42Answers", JSON.stringify(data));
      alert("✅ Todas as suas respostas foram salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      alert("❌ Erro ao salvar as respostas.");
    }
  };

  const clearAllAnswers = () => {
    if (confirm("Tem certeza que deseja limpar TODAS as suas respostas?")) {
      setListenAnswers({});
      setShowListenResults({});
      setListenResults({});
      setDrilling1Sentences(Object.fromEntries(drillingExercises1.map(ex => [ex.id, ex.english])));
      setDrilling2Sentences(Object.fromEntries(drillingExercises2.map(ex => [ex.id, ex.english])));
      setNegativeEx(negativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setNegativeResults({});
      setShowNegativeResults({});
      setAffirmativeEx(affirmativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setAffirmativeResults({});
      setShowAffirmativeResults({});
      setInterrogativeEx(interrogativeExercises.map(ex => ({ ...ex, userAnswer: "" })));
      setInterrogativeResults({});
      setShowInterrogativeResults({});
      setCurrentCardIndex(0);
      setQuestionsUserAnswer("");
      setShowQuestionsResult(false);
      setQuestionsResult(false);
      setImageSequence([]);
      setShowFinalSequenceResult(false);
      setVideoAnswers({});
      setShowVideoResults({});
      setVideoResults({});
      localStorage.removeItem("lesson42Answers");
      alert("Todas as respostas foram limpas.");
    }
  };

  // ==============================
  // FUNÇÕES DE MANIPULAÇÃO
  // ==============================
  
  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Função para adicionar número à sequência (quando o aluno clica na imagem)
  const handleImageClickForSequence = (correctNumber: number) => {
    if (imageSequence.includes(correctNumber)) {
      alert(`⚠️ O número ${correctNumber} já foi adicionado à sua sequência! Escolha uma imagem diferente.`);
      return;
    }
    
    setImageSequence(prev => [...prev, correctNumber]);
    setShowFinalSequenceResult(false);
  };

  // Função para resetar a sequência
  const resetSequence = () => {
    setImageSequence([]);
    setShowFinalSequenceResult(false);
    setIsSequenceCorrect(false);
  };

  // Função para verificar se a sequência está correta (1,2,3)
  const checkSequence = () => {
    const correctSequence = [1, 2, 3];
    
    if (imageSequence.length !== 3) {
      alert(`⚠️ Você precisa selecionar as 3 imagens na ordem correta! Você selecionou ${imageSequence.length} imagem(ns).`);
      return;
    }
    
    let isCorrect = true;
    for (let i = 0; i < 3; i++) {
      if (imageSequence[i] !== correctSequence[i]) {
        isCorrect = false;
        break;
      }
    }
    
    setIsSequenceCorrect(isCorrect);
    setShowFinalSequenceResult(true);
  };

  // Negative functions
  const handleNegativeChange = (id: number, value: string) => {
    setNegativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowNegativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleNegativeCheck = (id: number, correctNegative: string) => {
    const exercise = negativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctNegative.toLowerCase().trim();
      setNegativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowNegativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // Affirmative functions
  const handleAffirmativeChange = (id: number, value: string) => {
    setAffirmativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowAffirmativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleAffirmativeCheck = (id: number, correctAffirmative: string) => {
    const exercise = affirmativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctAffirmative.toLowerCase().trim();
      setAffirmativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowAffirmativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // Interrogative functions
  const handleInterrogativeChange = (id: number, value: string) => {
    setInterrogativeEx(prev => prev.map(ex => ex.id === id ? { ...ex, userAnswer: value } : ex));
    setShowInterrogativeResults(prev => ({ ...prev, [id]: false }));
  };

  const handleInterrogativeCheck = (id: number, correctInterrogative: string) => {
    const exercise = interrogativeEx.find(ex => ex.id === id);
    if (exercise) {
      const isCorrect = exercise.userAnswer.toLowerCase().trim() === correctInterrogative.toLowerCase().trim();
      setInterrogativeResults(prev => ({ ...prev, [id]: isCorrect }));
      setShowInterrogativeResults(prev => ({ ...prev, [id]: true }));
    }
  };

  // QUESTIONS functions
  const handleQuestionsCheck = () => {
    const currentCard = questionCards[currentCardIndex];
    const userLower = questionsUserAnswer.toLowerCase().trim();
    
    let isCorrect = false;
    
    if (currentCard.id === 1 && userLower.includes("birthday")) {
      isCorrect = true;
    } else if (currentCard.id === 2 && (userLower.includes("years old") || userLower.match(/\d+/))) {
      isCorrect = true;
    } else if (currentCard.id === 3 && (userLower.includes("years old") || userLower.match(/\d+/))) {
      isCorrect = true;
    } else if (currentCard.id >= 4 && currentCard.id <= 10 && (userLower.includes("yes") || userLower.includes("no"))) {
      isCorrect = true;
    }
    
    setQuestionsResult(isCorrect);
    setShowQuestionsResult(true);
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % questionCards.length);
    setQuestionsUserAnswer("");
    setShowQuestionsResult(false);
    setQuestionsResult(false);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + questionCards.length) % questionCards.length);
    setQuestionsUserAnswer("");
    setShowQuestionsResult(false);
    setQuestionsResult(false);
  };

  const currentCard = questionCards[currentCardIndex];

  // Video answer functions
  const handleVideoAnswerChange = (questionId: number, value: string) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: false }));
  };

  const checkVideoAnswer = (questionId: number, userAnswer: string, correctAnswer: string) => {
    const isCorrect = userAnswer.toLowerCase().trim().includes(correctAnswer.toLowerCase().replace(/[.,!?]/g, '').split(' ').slice(0, 5).join(' ')) ||
                      (userAnswer.length > 20 && correctAnswer.toLowerCase().split(' ').some(word => userAnswer.toLowerCase().includes(word)));
    setVideoResults(prev => ({ ...prev, [`video-${questionId}`]: isCorrect }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: true }));
  };

  const clearVideoAnswer = (questionId: number) => {
    setVideoAnswers(prev => ({ ...prev, [questionId]: "" }));
    setShowVideoResults(prev => ({ ...prev, [`video-${questionId}`]: false }));
  };

  // Se não estiver hidratado ainda, renderiza um placeholder ou nada
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen rounded-2xl py-16 px-6 bg-cover bg-center bg-fixed" style={{ backgroundImage: `url('/images/background.jpg')` }}>
      <div className="max-w-5xl mx-auto bg-white bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#0c4a6e] mb-6">📘 LESSON 42</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            🏥 HEALTH, FEELINGS & PROFESSIONS
          </p>
          <p className="text-md text-gray-500 mt-2">Talk to your friends about health, feelings, work, and appointments!</p>
        </div>

        {/* ============================================ */}
        {/* CONVERSATION TIME - Dialogue Section ESTILIZADO COM ÁUDIO NO TOPO */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageCircle size={28} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">💬 CONVERSATION TIME</h2>
              <button onClick={() => toggleSection('conversationTime')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.conversationTime ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full">
              <Headphones size={16} className="text-yellow-300" />
              <span className="text-sm font-medium">Audio Available</span>
            </div>
          </div>

          {sections.conversationTime && (
            <div className="p-8">
              {/* BOTÃO DE ÁUDIO NO TOPO DA SESSÃO - ESTILIZADO */}
              <div className="mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl p-4 border-2 border-indigo-200 shadow-md">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-full shadow-lg">
                      <Volume2 size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-indigo-800 text-sm">🎧 LISTEN TO THE CONVERSATION</p>
                      <p className="text-xs text-indigo-600">Click play to hear the full dialogue</p>
                    </div>
                  </div>
                  <AudioPlayer src="https://github.com/Sullivan-code/english-audios/raw/main/conversation-time-l41.mp3" compact={false} />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
                  <p className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">Hey, Donna, what&apos;s up?</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">I&apos;m tired and I still have to read these projects for next week.</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">Next week? That&apos;s a lot of work. Are you worried?</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">Yes, I am. I have to work extra hours until I finish it. What about you? Are you busy, too?</p>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border-2 border-indigo-200 shadow-md hover:shadow-lg transition-shadow">
                  <p className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">Yes, I am, but I&apos;m happy because I have a business lunch with Pam Wilson and Justin Davis tomorrow.</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">Who are they?</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">They work at an office abroad and they want to talk about the projects for next year and the deadlines.</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">I see. Do they speak English?</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">Yes, they speak English very well.</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">Good for you! Hey, Peter, I don&apos;t have a lot of time for lunch, but do you want to grab a bite to eat?</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">👤</span> Peter:
                  </p>
                  <p className="text-gray-700">Sure! Good idea.</p>
                  <p className="font-bold text-indigo-700 mt-3 mb-2 flex items-center gap-2">
                    <span className="bg-purple-100 p-1 rounded-full">👩</span> Donna:
                  </p>
                  <p className="text-gray-700">Let&apos;s go.</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-indigo-500" />
                  <p className="text-sm text-indigo-700 font-medium">💡 Practice this conversation with a partner! Try to use natural intonation and emotion.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* LISTEN AND NUMBER - Imagens 1, 2, 3 (EMBARALHADAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Headphones size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">🎧 LISTEN AND NUMBER</h2>
              <button onClick={() => toggleSection('listen')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.listen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.listen && (
            <div className="p-8">
              <p className="text-purple-700 mb-4 italic flex items-center gap-2 bg-white/60 p-3 rounded-xl border border-purple-200">
                <span className="text-2xl">👂</span> 
                The images below are <strong className="font-bold">SHUFFLED</strong>. 
                Click on the images <strong className="font-bold">IN THE ORDER YOU HEAR</strong> (1 → 2 → 3).
              </p>
              
              <p className="text-sm text-purple-600 mb-6 bg-purple-100 p-3 rounded-xl border border-purple-200">
                🎯 <strong>Correct sequence to find:</strong> 1. pessoas sentadas em grupo conversando → 2. pessoas tomando café ao fundo → 3. estudantes trabalhando em círculo
              </p>

              {/* Imagens embaralhadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {shuffledListenItems.map((item) => (
                  <div 
                    key={item.key} 
                    className="bg-white rounded-xl shadow-md border-2 border-purple-200 overflow-hidden cursor-pointer transition-all hover:shadow-2xl hover:scale-105 hover:border-purple-400"
                    onClick={() => handleImageClickForSequence(item.correctNumber)}
                  >
                    <div className="relative h-64 w-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.label}
                        className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement('div');
                            fallback.className = 'text-center p-4';
                            fallback.innerHTML = `
                              <div class="w-32 h-32 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <span class="text-5xl">${item.placeholder}</span>
                              </div>
                              <p class="text-sm text-gray-600">${item.label}</p>
                              <p class="text-xs text-gray-400 mt-1">${item.description}</p>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center shadow-lg border-2 border-purple-300 font-bold text-purple-600">
                        {imageSequence.includes(item.correctNumber) ? (
                          <Check size={16} className="text-green-500" />
                        ) : (
                          item.correctNumber
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 text-center">
                      <p className="text-md font-bold text-purple-700">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-1">Click to add to sequence</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Exibição da sequência */}
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-5 mb-6 border-2 border-purple-200">
                <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                  <span className="text-xl">📋</span> Sua sequência (ordem que você clicou):
                </h3>
                <div className="flex flex-wrap gap-3 items-center">
                  {imageSequence.length === 0 ? (
                    <span className="text-gray-500 italic">Nenhuma imagem selecionada ainda</span>
                  ) : (
                    imageSequence.map((num, idx) => {
                      const item = listenItemsOriginal.find(i => i.correctNumber === num);
                      return (
                        <span key={idx} className="bg-white px-4 py-2 rounded-full shadow-sm border-2 border-purple-300 font-medium">
                          <span className="font-bold text-purple-700">{idx + 1}º:</span> {item?.label}
                        </span>
                      );
                    })
                  )}
                </div>
                
                <div className="flex gap-3 mt-4 flex-wrap">
                  <button
                    onClick={checkSequence}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-2.5 rounded-lg hover:shadow-lg transition font-semibold flex items-center gap-2"
                  >
                    <Check size={18} /> Verificar Sequência Completa
                  </button>
                  <button
                    onClick={resetSequence}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2.5 rounded-lg transition font-semibold flex items-center gap-2"
                  >
                    <RotateCcw size={18} /> Resetar Sequência
                  </button>
                </div>

                {showFinalSequenceResult && (
                  <div className={`mt-4 p-4 rounded-xl border-2 ${isSequenceCorrect ? 'bg-green-100 border-green-400 text-green-800' : 'bg-red-100 border-red-400 text-red-800'}`}>
                    {isSequenceCorrect ? (
                      <div className="flex items-center gap-3">
                        <div className="bg-green-500 p-2 rounded-full">
                          <Check size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">✅ PARABÉNS! Você acertou a sequência correta!</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="bg-red-500 p-2 rounded-full">
                          <XCircle size={20} className="text-white" />
                        </div>
                        <span className="font-bold text-lg">❌ Sequência errada! A ordem correta é: 1 → 2 → 3</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE I - Substitution (FRASES MAIS LONGAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">🔹 Substitution Practice I</h2>
              <button onClick={() => toggleSection('drilling1')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.drilling1 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling1 && (
            <div className="p-8">
              <p className="text-blue-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-blue-200 flex items-center gap-2">
                <Sparkles size={18} /> Practice substituting words to create new sentences. Try to say them out loud!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises1.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border-2 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">#{exercise.id}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">🇵🇹 Portuguese:</p>
                        <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                        <p className="text-sm text-gray-500 mb-1">🇺🇸 English:</p>
                        <p className="text-lg font-bold text-blue-700 mb-4">{drilling1Sentences[exercise.id]}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: sub.phrase }))}
                          className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 hover:scale-105 transition-all duration-200 font-medium"
                        >
                          {sub.word}
                        </button>
                      ))}
                      <button
                        onClick={() => setDrilling1Sentences(prev => ({ ...prev, [exercise.id]: exercise.english }))}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO NEGATIVE (FRASES MAIS LONGAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <XCircle size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">🔹 Change into Negative</h2>
              <button onClick={() => toggleSection('negative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.negative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.negative && (
            <div className="p-8">
              <p className="text-red-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-red-200 flex items-center gap-2">
                <Sparkles size={18} /> Transform these affirmative sentences into negative ones. Pay attention to the verb tense!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {negativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border-2 border-red-200 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-green-600">✅</span> Affirmative:
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">{exercise.affirmative}</p>
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-red-600">❌</span> Negative (your answer):
                    </p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleNegativeChange(exercise.id, e.target.value)}
                      placeholder="Write the negative form here..."
                      className="w-full h-20 p-3 border-2 border-red-300 rounded-lg resize-none mb-3 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleNegativeCheck(exercise.id, exercise.negative)} className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white py-2 rounded-lg hover:shadow-lg transition font-medium">Check</button>
                      <button onClick={() => handleNegativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showNegativeResults[exercise.id] && <AnswerResult isCorrect={negativeResults[exercise.id] || false} correctAnswer={exercise.negative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* DRILLING PRACTICE II - Substitution (MAIS COMPLEXO) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mic size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">🔹 Substitution Practice II</h2>
              <button onClick={() => toggleSection('drilling2')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.drilling2 ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.drilling2 && (
            <div className="p-8">
              <p className="text-green-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-green-200 flex items-center gap-2">
                <Sparkles size={18} /> More complex substitutions! Practice with different verb tenses and structures.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {drillingExercises2.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-2">
                      <span className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">#{exercise.id}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 mb-1">🇵🇹 Portuguese:</p>
                        <p className="text-md text-gray-700 mb-3">{exercise.portuguese}</p>
                        <p className="text-sm text-gray-500 mb-1">🇺🇸 English:</p>
                        <p className="text-lg font-bold text-green-700 mb-4">{drilling2Sentences[exercise.id]}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exercise.substitutions.map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDrilling2Sentences(prev => ({ ...prev, [exercise.id]: sub.phrase }))}
                          className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 hover:scale-105 transition-all duration-200 font-medium"
                        >
                          {sub.word}
                        </button>
                      ))}
                      <button onClick={() => setDrilling2Sentences(prev => ({ ...prev, [exercise.id]: exercise.english }))} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition">Reset</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO AFFIRMATIVE (FRASES MAIS LONGAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-yellow-600 to-amber-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Check size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold">🔹 Change into Affirmative</h2>
              <button onClick={() => toggleSection('affirmative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.affirmative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.affirmative && (
            <div className="p-8">
              <p className="text-yellow-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-yellow-200 flex items-center gap-2">
                <Sparkles size={18} /> Turn these negative sentences into affirmative ones. Practice different verb tenses!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {affirmativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border-2 border-yellow-200 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-red-600">❌</span> Negative:
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">{exercise.negative}</p>
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-green-600">✅</span> Affirmative (your answer):
                    </p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleAffirmativeChange(exercise.id, e.target.value)}
                      placeholder="Write the affirmative form here..."
                      className="w-full h-20 p-3 border-2 border-yellow-300 rounded-lg resize-none mb-3 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleAffirmativeCheck(exercise.id, exercise.affirmative)} className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white py-2 rounded-lg hover:shadow-lg transition font-medium">Check</button>
                      <button onClick={() => handleAffirmativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showAffirmativeResults[exercise.id] && <AnswerResult isCorrect={affirmativeResults[exercise.id] || false} correctAnswer={exercise.affirmative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* CHANGE INTO INTERROGATIVE (FRASES MAIS LONGAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <h2 className="text-2xl font-bold">🔹 Change into Interrogative</h2>
              <button onClick={() => toggleSection('interrogative')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.interrogative ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.interrogative && (
            <div className="p-8">
              <p className="text-pink-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-pink-200 flex items-center gap-2">
                <Sparkles size={18} /> Transform these statements into questions. Practice question formation in different tenses!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {interrogativeEx.map((exercise) => (
                  <div key={exercise.id} className="bg-white p-6 rounded-xl border-2 border-pink-200 shadow-md hover:shadow-lg transition-shadow">
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-blue-600">📝</span> Statement:
                    </p>
                    <p className="text-lg font-bold text-gray-900 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">{exercise.statement}</p>
                    <p className="text-md font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <span className="text-pink-600">❓</span> Interrogative (your answer):
                    </p>
                    <textarea
                      value={exercise.userAnswer}
                      onChange={(e) => handleInterrogativeChange(exercise.id, e.target.value)}
                      placeholder="Write the interrogative form here..."
                      className="w-full h-20 p-3 border-2 border-pink-300 rounded-lg resize-none mb-3 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition"
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleInterrogativeCheck(exercise.id, exercise.interrogative)} className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg hover:shadow-lg transition font-medium">Check</button>
                      <button onClick={() => handleInterrogativeChange(exercise.id, "")} className="px-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Clear</button>
                    </div>
                    {showInterrogativeResults[exercise.id] && <AnswerResult isCorrect={interrogativeResults[exercise.id] || false} correctAnswer={exercise.interrogative} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* QUESTIONS (FRASES MAIS LONGAS) */}
        {/* ============================================ */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">❓</span>
              <h2 className="text-2xl font-bold">QUESTIONS</h2>
              <button onClick={() => toggleSection('questions')} className="ml-4 p-2 rounded-full hover:bg-white/20 transition">
                {sections.questions ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>
            </div>
          </div>

          {sections.questions && (
            <div className="p-8">
              <p className="text-teal-600 mb-4 italic bg-white/60 p-3 rounded-xl border border-teal-200 flex items-center gap-2">
                <Sparkles size={18} /> Answer these questions with complete sentences. Practice speaking out loud!
              </p>
              <div className="bg-white p-6 rounded-xl border-2 border-teal-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={prevCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 hover:scale-110 transition"><ChevronLeft size={24} /></button>
                  <span className="text-sm text-teal-600 bg-teal-50 px-4 py-1 rounded-full">Question {currentCardIndex + 1} of {questionCards.length}</span>
                  <button onClick={nextCard} className="p-2 bg-teal-100 text-teal-700 rounded-full hover:bg-teal-200 hover:scale-110 transition"><ChevronRight size={24} /></button>
                </div>
                
                <div className="mb-6 p-4 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl border border-teal-200">
                  <p className="text-sm text-teal-700 mb-1 flex items-center gap-2">
                    <span className="text-lg">❓</span> Question:
                  </p>
                  <p className="text-xl font-bold text-teal-800">{currentCard.question}</p>
                  <p className="text-sm text-teal-600 mt-1">🇵🇹 {currentCard.translation}</p>
                </div>
                
                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                    <span className="text-lg">💡</span> Example answer:
                  </p>
                  <p className="text-lg text-gray-800 italic">{currentCard.answer}</p>
                  <p className="text-xs text-gray-500 mt-1">🇵🇹 {currentCard.answerTranslation}</p>
                </div>
                
                <textarea
                  value={questionsUserAnswer}
                  onChange={(e) => setQuestionsUserAnswer(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-24 p-4 border-2 border-teal-300 rounded-lg resize-none mb-4 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition"
                />
                
                <div className="flex gap-3">
                  <button onClick={handleQuestionsCheck} className="flex-1 bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-lg text-white px-6 py-3 rounded-lg transition font-medium">Check Answer</button>
                  <button onClick={() => { setQuestionsUserAnswer(""); setShowQuestionsResult(false); setQuestionsResult(false); }} className="px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition">Clear</button>
                </div>
                
                {showQuestionsResult && (
                  <div className="mt-4">
                    <AnswerResult isCorrect={questionsResult} correctAnswer={currentCard.answer} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* TUNE IN YOUR EARS (VIDEO SECTION) - ESTILIZADO */}
        {/* ============================================ */}
        <div className="mb-10 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-3xl shadow-xl overflow-hidden">
          <div className="py-5 px-8 flex justify-between items-center bg-gradient-to-r from-cyan-500 to-blue-600">
            <div className="flex items-center gap-3">
              <Headphones size={24} className="text-yellow-300" />
              <h2 className="text-2xl font-bold text-white">🎧 TUNE IN YOUR EARS</h2>
            </div>
            <button 
              onClick={() => toggleSection('tuneInYourEars')}
              className="p-2 rounded-full hover:bg-white/20 transition"
            >
              {sections.tuneInYourEars ? <ChevronUp size={24} className="text-white" /> : <ChevronDown size={24} className="text-white" />}
            </button>
          </div>
          
          {sections.tuneInYourEars && (
            <div className="p-8">
              {/* Key Vocabulary Section */}
              <div className="mb-8 bg-white rounded-xl p-6 shadow-md border-2 border-cyan-200">
                <h3 className="text-xl font-bold text-cyan-700 mb-4 flex items-center gap-2">
                  <Volume2 size={20} /> 📚 KEY VOCABULARY FROM THE VIDEO
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {tuneInYourEarsVideo.keyVocabulary.map((vocab, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-cyan-50 to-blue-50 p-2 rounded-lg border border-cyan-200 hover:shadow-md transition">
                      <p className="font-bold text-cyan-800 text-sm">{vocab.english}</p>
                      <p className="text-xs text-cyan-600">→ {vocab.portuguese}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Video Player */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-cyan-700 mb-4">
                  {tuneInYourEarsVideo.title}
                </h3>
                <p className="text-cyan-600 mb-6">{tuneInYourEarsVideo.description}</p>
                
                <div className="bg-black rounded-2xl overflow-hidden shadow-2xl mx-auto max-w-4xl">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe
                      src={`https://www.youtube.com/embed/${tuneInYourEarsVideo.youtubeId}`}
                      title={tuneInYourEarsVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-[400px] md:h-[500px]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Questions from the video */}
              <div className="space-y-8">
                {tuneInYourEarsVideo.questions.map((q) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl border-2 border-cyan-200 shadow-md hover:shadow-lg transition">
                    <h4 className="text-lg font-bold mb-3 text-cyan-700 flex items-center gap-2">
                      <span className="bg-cyan-100 rounded-full w-7 h-7 flex items-center justify-center text-sm text-cyan-700">#{q.id}</span>
                      {q.question}
                    </h4>
                    
                    {q.vocabulary && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-200">
                        <p className="text-sm font-medium text-cyan-600 mb-2 flex items-center gap-2">
                          <Volume2 size={16} /> Vocabulary hints:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {q.vocabulary.map((word, idx) => (
                            <div key={idx} className="flex justify-between text-sm bg-white p-2 rounded-lg shadow-sm border border-cyan-100">
                              <span className="text-cyan-700 font-medium">{word.english}</span>
                              <span className="text-cyan-600">→ {word.portuguese}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <textarea
                      value={videoAnswers[q.id] || ""}
                      onChange={(e) => handleVideoAnswerChange(q.id, e.target.value)}
                      placeholder="Write your answer based on what you heard..."
                      className="w-full h-32 p-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition resize-none"
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => checkVideoAnswer(q.id, videoAnswers[q.id] || "", q.correctAnswer)}
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2.5 rounded-xl transition font-medium hover:shadow-lg"
                      >
                        Check Answer
                      </button>
                      <button
                        onClick={() => clearVideoAnswer(q.id)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-xl transition font-medium"
                      >
                        Clear
                      </button>
                    </div>

                    {showVideoResults[`video-${q.id}`] && (
                      <div className="mt-4">
                        <AnswerResult 
                          isCorrect={videoResults[`video-${q.id}`] || false} 
                          correctAnswer={q.correctAnswer}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-300 rounded-xl p-6">
                <h3 className="text-xl font-bold text-cyan-800 mb-4 flex items-center gap-2">
                  <Headphones size={20} /> 🎯 Listening Tips:
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">🎧 Listen first without looking at the questions</li>
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">👀 Watch a second time while reading the questions</li>
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">🔑 Pay attention to keywords and main ideas</li>
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">💡 Don&apos;t worry if you don&apos;t understand every word</li>
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">🔄 You can watch multiple times if needed</li>
                  <li className="flex items-center gap-2 bg-white/60 p-2 rounded-lg">🗣️ Try to repeat key phrases out loud</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ============================================ */}
        {/* LESSON SUMMARY */}
        {/* ============================================ */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-[30px] shadow-xl mb-10 overflow-hidden">
          <div className="text-white py-4 px-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Check size={28} /> LESSON SUMMARY
            </h2>
          </div>
          <div className="p-8 bg-white rounded-b-[30px]">
            <p className="font-bold text-gray-800 mb-3">You practiced:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Substitution Practice</span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Negative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Affirmative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Interrogative Sentences</span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Personal Questions</span>
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm text-center font-medium">✔ Listening & Speaking</span>
            </div>
            <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600">💡 <strong>Tip:</strong> Practice as if it were a real conversation — with emotion and natural speed! Try to use these structures in your daily life.</p>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* SAVE BUTTONS AND NAVIGATION */}
        {/* ============================================ */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
          <div className="flex gap-4 flex-wrap">
            <button onClick={saveAllAnswers} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-lg text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 flex items-center gap-2">
              <span>💾</span> Save All My Answers
            </button>
            <button onClick={clearAllAnswers} className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-sm transition duration-300">
              Clear All
            </button>
          </div>

          <div className="flex gap-4 flex-wrap">
            <button onClick={() => router.push("/cursos")} className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors">
              &larr; Back to Courses
            </button>
            <button onClick={() => router.push("/cursos/review7")} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg text-white font-semibold py-3 px-8 rounded-full transition-colors">
              Next Lesson &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}