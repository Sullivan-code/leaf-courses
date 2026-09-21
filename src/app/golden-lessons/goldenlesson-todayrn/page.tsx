"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Volume2,
  MessageCircle,
  Heart,
  Users,
  Baby,
  Briefcase,
  Plane,
  Globe,
  Utensils,
  Cake,
  Car,
  Star,
  Sun,
  Pencil,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ============================================
// SPEECH SYSTEM – AMERICAN FEMALE VOICE
// ============================================
interface SpeakTextProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const speakEnglish = (text: string, rate = 0.9) => {
  if (!text || typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = rate;
  utterance.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const americanFemaleVoices = voices.filter(
    (voice) =>
      (voice.lang === "en-US" || voice.lang.startsWith("en-US")) &&
      (voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("google us english") ||
        voice.name.toLowerCase().includes("siri") ||
        voice.name.toLowerCase().includes("female") ||
        voice.name === "Google US English" ||
        voice.name === "Samantha")
  );
  const americanVoices = voices.filter(
    (voice) => voice.lang === "en-US" || voice.lang.startsWith("en-US")
  );
  if (americanFemaleVoices.length > 0) {
    utterance.voice = americanFemaleVoices[0];
  } else if (americanVoices.length > 0) {
    utterance.voice = americanVoices[0];
  }
  window.speechSynthesis.speak(utterance);
};

const SpeakText = ({
  text,
  children,
  className = "",
  showIcon = true,
}: SpeakTextProps) => {
  return (
    <button
      onClick={() => speakEnglish(text, 0.9)}
      className={`inline-flex items-center gap-1 cursor-pointer hover:bg-orange-100 px-1 rounded transition-colors group ${className}`}
      title="Click to hear American pronunciation"
    >
      {children || text}
      {showIcon && (
        <Volume2
          size={12}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-orange-500"
        />
      )}
    </button>
  );
};

const SpeakSentence = ({ text, children, className = "" }: SpeakTextProps) => {
  return (
    <button
      onClick={() => {
        const speechText =
          children && typeof children === "string" ? children : text;
        speakEnglish(speechText, 0.85);
      }}
      className={`group cursor-pointer hover:bg-orange-50 px-1 rounded transition-colors text-left w-full ${className}`}
    >
      {children || text}
      <Volume2
        size={12}
        className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-orange-500"
      />
    </button>
  );
};

// ============================================
// NOTE MODAL
// ============================================
interface NoteModalState {
  isOpen: boolean;
  sectionTitle: string;
  noteContent: string;
}

function NoteModal({
  isOpen,
  onClose,
  sectionTitle,
  initialNote,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  sectionTitle: string;
  initialNote: string;
  onSave: (note: string) => void;
}) {
  const [note, setNote] = useState(initialNote);
  if (!isOpen) return null;
  const handleSave = () => {
    onSave(note);
    onClose();
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-6">
          <h3 className="text-xl font-bold">📝 Notes - {sectionTitle}</h3>
          <p className="text-sm text-orange-100 mt-1">
            Write your answers, doubts or translations
          </p>
        </div>
        <div className="p-6">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write your notes here..."
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-full hover:from-orange-600 hover:to-orange-800 transition-all duration-300"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="ml-3 text-white/60 hover:text-white transition-colors focus:outline-none"
      aria-label="Take notes"
      title="Click to take notes"
    >
      <Pencil className="h-5 w-5" />
    </button>
  );
}

// ============================================
// QUESTION CARD – open-ended questions
// ============================================
interface Question {
  en: string;
  pt: string;
}

function QuestionCard({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  const [showTranslation, setShowTranslation] = useState(true);

  return (
    <div className="bg-white rounded-xl border-2 border-orange-100 hover:border-orange-300 transition-colors p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold">
          {index}
        </span>
        <div className="flex-1">
          <SpeakSentence
            text={question.en}
            className="text-gray-800 font-medium text-sm md:text-base leading-relaxed"
          >
            {question.en}
          </SpeakSentence>
          <button
            onClick={() => setShowTranslation((p) => !p)}
            className="mt-2 text-[10px] md:text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200 transition-colors font-bold"
          >
            {showTranslation ? "🇧🇷 Hide translation" : "🇧🇷 Show translation"}
          </button>
          {showTranslation && (
            <p className="text-gray-600 text-xs md:text-sm mt-2 italic border-l-2 border-orange-300 pl-2">
              🇧🇷 {question.pt}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function LessonConversationClass() {
  const router = useRouter();
  const [noteModal, setNoteModal] = useState<NoteModalState>({
    isOpen: false,
    sectionTitle: "",
    noteContent: "",
  });
  const [savedNotes, setSavedNotes] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    routine: true,
    family: false,
    childhood: false,
    parenting: false,
    work: false,
    travel: false,
    countries: false,
    food: false,
    desserts: false,
    license: false,
    cars: false,
    favorites: false,
  });
  const [isMainImageModalOpen, setIsMainImageModalOpen] = useState(false);

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const openNoteModal = (sectionTitle: string) => {
    setNoteModal({
      isOpen: true,
      sectionTitle,
      noteContent: savedNotes[sectionTitle] || "",
    });
  };

  const saveNote = (note: string) => {
    setSavedNotes((prev) => ({ ...prev, [noteModal.sectionTitle]: note }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.getVoices();
    }
  }, []);

  // ===== IMAGE =====
  const mainImage =
    "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200";

  // ============================================================
  // SECTIONS DATA
  // ============================================================

  const routineQuestions: Question[] = [
    { en: "What time do you usually wake up?", pt: "A que horas você costuma acordar?" },
    { en: "What is the first thing you do when you wake up?", pt: "Qual é a primeira coisa que você faz quando acorda?" },
    { en: "Do you usually have breakfast? What do you eat?", pt: "Você costuma tomar café da manhã? O que você come?" },
    { en: "How do you usually get to work?", pt: "Como você costuma ir para o trabalho?" },
    { en: "What does a typical day look like for you?", pt: "Como é um dia típico para você?" },
    { en: "What time do you usually finish work?", pt: "A que horas você costuma terminar o trabalho?" },
    { en: "What do you usually do in the evening?", pt: "O que você costuma fazer à noite?" },
    { en: "Do you prefer mornings or evenings? Why?", pt: "Você prefere manhãs ou noites? Por quê?" },
    { en: "How many hours do you sleep on average?", pt: "Quantas horas você dorme em média?" },
    { en: "Do you have any hobbies during the week?", pt: "Você tem algum hobby durante a semana?" },
    { en: "What is your favorite day of the week? Why?", pt: "Qual é o seu dia favorito da semana? Por quê?" },
    { en: "How do you usually relax after work?", pt: "Como você costuma relaxar depois do trabalho?" },
    { en: "Do you cook at home or eat out more often?", pt: "Você cozinha em casa ou come fora com mais frequência?" },
    { en: "What is your daily routine like on weekends?", pt: "Como é sua rotina nos fins de semana?" },
    { en: "Do you have any habits you would like to change?", pt: "Você tem algum hábito que gostaria de mudar?" },
    { en: "How often do you exercise or play sports?", pt: "Com que frequência você se exercita ou pratica esportes?" },
    { en: "Do you watch TV or series before sleeping?", pt: "Você assiste TV ou séries antes de dormir?" },
    { en: "What time do you usually go to bed?", pt: "A que horas você costuma ir para a cama?" },
    { en: "Do you drink coffee during the day? How many cups?", pt: "Você toma café durante o dia? Quantas xícaras?" },
    { en: "What is one thing you do every single day without fail?", pt: "Qual é uma coisa que você faz todos os dias sem falta?" },
  ];

  const familyQuestions: Question[] = [
    { en: "Tell me about your family.", pt: "Fale-me sobre sua família." },
    { en: "How many children do you have?", pt: "Quantos filhos você tem?" },
    { en: "What are your daughters' names and ages?", pt: "Quais são os nomes e as idades das suas filhas?" },
    { en: "What do you love most about being a parent?", pt: "O que você mais ama em ser pai/mãe?" },
    { en: "How would you describe your daughters' personalities?", pt: "Como você descreveria a personalidade das suas filhas?" },
    { en: "What activities do you enjoy doing with your daughters?", pt: "Quais atividades você gosta de fazer com suas filhas?" },
    { en: "How do you balance work and family time?", pt: "Como você equilibra trabalho e tempo com a família?" },
    { en: "What values do you want to teach your daughters?", pt: "Que valores você quer ensinar às suas filhas?" },
    { en: "Do your daughters have any hobbies?", pt: "Suas filhas têm algum hobby?" },
    { en: "How has your life changed since becoming a parent?", pt: "Como sua vida mudou desde que se tornou pai/mãe?" },
    { en: "What is the funniest thing your daughter has ever said?", pt: "Qual é a coisa mais engraçada que sua filha já disse?" },
    { en: "Do you have family traditions?", pt: "Vocês têm tradições familiares?" },
    { en: "How do you usually celebrate birthdays in your family?", pt: "Como vocês costumam comemorar aniversários na sua família?" },
    { en: "What advice would you give to a new parent?", pt: "Que conselho você daria a um novo pai/mãe?" },
    { en: "Do you spend more time with your family on weekends?", pt: "Você passa mais tempo com sua família nos fins de semana?" },
    { en: "What is your favorite memory with your daughters?", pt: "Qual é sua memória favorita com suas filhas?" },
    { en: "How do you handle disagreements with your children?", pt: "Como você lida com desentendimentos com seus filhos?" },
    { en: "What do your daughters want to be when they grow up?", pt: "O que suas filhas querem ser quando crescerem?" },
    { en: "How important is education in your family?", pt: "Quão importante é a educação na sua família?" },
    { en: "What makes you proud as a parent?", pt: "O que te deixa orgulhoso(a) como pai/mãe?" },
  ];

  const childhoodQuestions: Question[] = [
    { en: "Where did you grow up?", pt: "Onde você cresceu?" },
    { en: "What was your childhood like?", pt: "Como foi sua infância?" },
    { en: "Who were you closest to in your family as a child?", pt: "Com quem você era mais próximo na família quando criança?" },
    { en: "What games did you play when you were a child?", pt: "Que jogos você jogava quando era criança?" },
    { en: "What was your favorite toy?", pt: "Qual era seu brinquedo favorito?" },
    { en: "Did you have a best friend in childhood?", pt: "Você teve um melhor amigo na infância?" },
    { en: "What is your earliest memory?", pt: "Qual é sua memória mais antiga?" },
    { en: "What did you want to be when you grew up?", pt: "O que você queria ser quando crescesse?" },
    { en: "What was your favorite subject in school?", pt: "Qual era sua matéria favorita na escola?" },
    { en: "Did you enjoy school?", pt: "Você gostava da escola?" },
    { en: "What did you do during summer vacations?", pt: "O que você fazia nas férias de verão?" },
    { en: "Did you have any pets as a child?", pt: "Você teve algum animal de estimação quando criança?" },
    { en: "What kind of food did your mother cook?", pt: "Que tipo de comida sua mãe cozinhava?" },
    { en: "What is your favorite childhood memory?", pt: "Qual é sua memória de infância favorita?" },
    { en: "Were you a shy or outgoing child?", pt: "Você era uma criança tímida ou extrovertida?" },
    { en: "What did you and your siblings fight about?", pt: "Sobre o que você e seus irmãos brigavam?" },
    { en: "Did you travel as a child?", pt: "Você viajou quando criança?" },
    { en: "What was the biggest trouble you got into as a kid?", pt: "Qual foi a maior travessura que você fez quando criança?" },
    { en: "What was your favorite cartoon or TV show?", pt: "Qual era seu desenho ou programa de TV favorito?" },
    { en: "How was discipline handled in your home?", pt: "Como a disciplina era tratada em sua casa?" },
  ];

  const parentingQuestions: Question[] = [
    { en: "How did you feel when you found out you were going to be a father/mother?", pt: "Como você se sentiu quando descobriu que seria pai/mãe?" },
    { en: "What was the day of the birth like?", pt: "Como foi o dia do nascimento?" },
    { en: "Were you in the delivery room?", pt: "Você estava na sala de parto?" },
    { en: "How did you choose your daughter's name?", pt: "Como você escolheu o nome da sua filha?" },
    { en: "What was the first night at home with the baby like?", pt: "Como foi a primeira noite em casa com o bebê?" },
    { en: "Did you feel prepared to be a parent?", pt: "Você se sentiu preparado(a) para ser pai/mãe?" },
    { en: "What surprised you most about becoming a parent?", pt: "O que mais te surpreendeu ao se tornar pai/mãe?" },
    { en: "How did your routine change after the baby was born?", pt: "Como sua rotina mudou depois que o bebê nasceu?" },
    { en: "Did you take parental leave?", pt: "Você tirou licença parental?" },
    { en: "What was the hardest part of the first year?", pt: "Qual foi a parte mais difícil do primeiro ano?" },
    { en: "What advice did your parents give you?", pt: "Que conselhos seus pais te deram?" },
    { en: "How did your relationship with your partner change?", pt: "Como seu relacionamento com seu parceiro(a) mudou?" },
    { en: "What did you learn about yourself as a parent?", pt: "O que você aprendeu sobre si mesmo como pai/mãe?" },
    { en: "Did you have any fears about becoming a parent?", pt: "Você tinha algum medo de se tornar pai/mãe?" },
    { en: "What was the most joyful moment in those first months?", pt: "Qual foi o momento mais alegre naqueles primeiros meses?" },
    { en: "How did your family support you?", pt: "Como sua família te apoiou?" },
    { en: "What traditions did you start with your new family?", pt: "Que tradições você começou com sua nova família?" },
    { en: "How has being a parent changed your priorities?", pt: "Como ser pai/mãe mudou suas prioridades?" },
    { en: "What do you want your daughters to remember about their childhood?", pt: "O que você quer que suas filhas lembrem sobre a infância delas?" },
    { en: "How do you show love to your children?", pt: "Como você demonstra amor aos seus filhos?" },
  ];

  const workQuestions: Question[] = [
    { en: "What do you do for a living?", pt: "O que você faz da vida?" },
    { en: "How long have you been working in your current job?", pt: "Há quanto tempo você trabalha no seu emprego atual?" },
    { en: "What made you choose this career?", pt: "O que te fez escolher essa carreira?" },
    { en: "What do you enjoy most about your job?", pt: "O que você mais gosta no seu trabalho?" },
    { en: "What is the most challenging part of your job?", pt: "Qual é a parte mais desafiadora do seu trabalho?" },
    { en: "Can you describe a typical day at work?", pt: "Você pode descrever um dia típico no trabalho?" },
    { en: "Have you ever worked abroad?", pt: "Você já trabalhou no exterior?" },
    { en: "What skills are essential for your job?", pt: "Que habilidades são essenciais para seu trabalho?" },
    { en: "How do you deal with stress at work?", pt: "Como você lida com o estresse no trabalho?" },
    { en: "Have you ever had a difficult coworker? How did you handle it?", pt: "Você já teve um colega difícil? Como lidou com isso?" },
    { en: "What is your biggest professional achievement?", pt: "Qual é sua maior conquista profissional?" },
    { en: "Where do you see yourself in five years?", pt: "Onde você se vê em cinco anos?" },
    { en: "Do you prefer working in a team or alone?", pt: "Você prefere trabalhar em equipe ou sozinho?" },
    { en: "How important is work-life balance to you?", pt: "Quão importante é o equilíbrio entre trabalho e vida pessoal para você?" },
    { en: "Have you ever changed careers?", pt: "Você já mudou de carreira?" },
    { en: "What did you learn from your worst job?", pt: "O que você aprendeu com seu pior emprego?" },
    { en: "Do you have any mentors?", pt: "Você tem algum mentor?" },
    { en: "What motivates you to go to work every day?", pt: "O que te motiva a ir trabalhar todos os dias?" },
    { en: "How do you handle criticism at work?", pt: "Como você lida com críticas no trabalho?" },
    { en: "What advice would you give someone starting in your field?", pt: "Que conselho você daria a alguém começando na sua área?" },
  ];

  const travelQuestions: Question[] = [
    { en: "Do you like to travel?", pt: "Você gosta de viajar?" },
    { en: "What is the most memorable trip you've ever taken?", pt: "Qual é a viagem mais memorável que você já fez?" },
    { en: "Where did you go on your last vacation?", pt: "Onde você foi na sua última viagem?" },
    { en: "Do you prefer beach or mountain trips?", pt: "Você prefere viagens de praia ou montanha?" },
    { en: "Have you ever traveled alone?", pt: "Você já viajou sozinho?" },
    { en: "What is your favorite city in the world?", pt: "Qual é sua cidade favorita no mundo?" },
    { en: "Do you prefer traveling by plane, car or ship?", pt: "Você prefere viajar de avião, carro ou navio?" },
    { en: "What do you always pack when you travel?", pt: "O que você sempre leva quando viaja?" },
    { en: "Have you ever had a problem during a trip?", pt: "Você já teve algum problema durante uma viagem?" },
    { en: "What is the best food you've had while traveling?", pt: "Qual foi a melhor comida que você comeu viajando?" },
    { en: "Do you prefer planned trips or spontaneous ones?", pt: "Você prefere viagens planejadas ou espontâneas?" },
    { en: "What country would you like to visit next?", pt: "Qual país você gostaria de visitar em seguida?" },
    { en: "Do you like to bring souvenirs home?", pt: "Você gosta de trazer lembranças para casa?" },
    { en: "Have you ever traveled with your children?", pt: "Você já viajou com seus filhos?" },
    { en: "What is the longest trip you've ever taken?", pt: "Qual foi a viagem mais longa que você já fez?" },
    { en: "Do you like camping or hotels?", pt: "Você gosta de acampar ou de hotéis?" },
    { en: "Have you ever been on a cruise?", pt: "Você já fez um cruzeiro?" },
    { en: "What do you usually do on the first day of a trip?", pt: "O que você costuma fazer no primeiro dia de uma viagem?" },
    { en: "Have you ever gotten lost while traveling?", pt: "Você já se perdeu viajando?" },
    { en: "What is your dream destination?", pt: "Qual é seu destino dos sonhos?" },
  ];

  const countriesQuestions: Question[] = [
    { en: "Which countries have you visited so far?", pt: "Quais países você já visitou até agora?" },
    { en: "What country would you like to live in? Why?", pt: "Em qual país você gostaria de morar? Por quê?" },
    { en: "Have you ever experienced culture shock?", pt: "Você já experimentou choque cultural?" },
    { en: "What is the most interesting culture you've encountered?", pt: "Qual é a cultura mais interessante que você já conheceu?" },
    { en: "Do you like to try local food when you travel?", pt: "Você gosta de experimentar comida local quando viaja?" },
    { en: "What language would you like to learn?", pt: "Que idioma você gostaria de aprender?" },
    { en: "Have you ever made friends with people from other countries?", pt: "Você já fez amizade com pessoas de outros países?" },
    { en: "What country has the friendliest people in your opinion?", pt: "Qual país tem as pessoas mais amigáveis na sua opinião?" },
    { en: "Would you like to work in another country?", pt: "Você gostaria de trabalhar em outro país?" },
    { en: "What is the most beautiful place you've ever seen?", pt: "Qual é o lugar mais bonito que você já viu?" },
    { en: "Do you follow international news?", pt: "Você acompanha notícias internacionais?" },
    { en: "What traditions from other countries do you find interesting?", pt: "Que tradições de outros países você acha interessantes?" },
    { en: "Have you ever celebrated a holiday in another country?", pt: "Você já celebrou um feriado em outro país?" },
    { en: "What do you miss most when you're abroad?", pt: "Do que você sente mais falta quando está no exterior?" },
    { en: "What surprises you most about other cultures?", pt: "O que mais te surpreende em outras culturas?" },
    { en: "Would you ever move abroad with your family?", pt: "Você se mudaria para o exterior com sua família?" },
    { en: "What country has the best food in your opinion?", pt: "Qual país tem a melhor comida na sua opinião?" },
    { en: "How do you prepare for a trip to a new country?", pt: "Como você se prepara para uma viagem a um novo país?" },
  ];

  const foodQuestions: Question[] = [
    { en: "What is your favorite meal of the day?", pt: "Qual é sua refeição favorita do dia?" },
    { en: "What did you have for breakfast today?", pt: "O que você tomou no café da manhã hoje?" },
    { en: "Do you like to cook?", pt: "Você gosta de cozinhar?" },
    { en: "What is your signature dish?", pt: "Qual é seu prato típico?" },
    { en: "What is your favorite Brazilian dish?", pt: "Qual é seu prato brasileiro favorito?" },
    { en: "Do you prefer salty or sweet food?", pt: "Você prefere comida salgada ou doce?" },
    { en: "What is the best restaurant you've ever been to?", pt: "Qual é o melhor restaurante em que você já esteve?" },
    { en: "Do you eat out often?", pt: "Você come fora com frequência?" },
    { en: "Have you ever tried food you didn't like?", pt: "Você já experimentou alguma comida de que não gostou?" },
    { en: "What food reminds you of your childhood?", pt: "Que comida te lembra sua infância?" },
    { en: "Do you have any food allergies?", pt: "Você tem alguma alergia alimentar?" },
    { en: "What would you eat if you could only eat one meal for the rest of your life?", pt: "O que você comeria se pudesse comer apenas uma refeição pelo resto da vida?" },
    { en: "Do you like spicy food?", pt: "Você gosta de comida picante?" },
    { en: "What is a typical Sunday lunch in your family?", pt: "Como é um almoço de domingo típico na sua família?" },
    { en: "Do you prefer home-cooked meals or restaurant food?", pt: "Você prefere comida caseira ou comida de restaurante?" },
    { en: "What is the strangest food you've ever tried?", pt: "Qual é a comida mais estranha que você já experimentou?" },
    { en: "Are you a picky eater?", pt: "Você é seletivo(a) para comer?" },
    { en: "What is your favorite snack?", pt: "Qual é seu lanche favorito?" },
    { en: "How often do you drink water during the day?", pt: "Com que frequência você bebe água durante o dia?" },
    { en: "What is your favorite fruit?", pt: "Qual é sua fruta favorita?" },
  ];

  const dessertQuestions: Question[] = [
    { en: "Do you have a sweet tooth?", pt: "Você é formiga (gosta de doces)?" },
    { en: "What is your favorite dessert?", pt: "Qual é sua sobremesa favorita?" },
    { en: "Do you prefer chocolate or fruit desserts?", pt: "Você prefere sobremesas de chocolate ou de fruta?" },
    { en: "Have you ever made a dessert yourself?", pt: "Você já fez uma sobremesa você mesmo?" },
    { en: "What is the best cake you've ever eaten?", pt: "Qual foi o melhor bolo que você já comeu?" },
    { en: "Do you eat dessert after every meal?", pt: "Você come sobremesa depois de todas as refeições?" },
    { en: "What is the most popular dessert in your hometown?", pt: "Qual é a sobremesa mais popular da sua cidade natal?" },
    { en: "Do you like ice cream? What flavor?", pt: "Você gosta de sorvete? De qual sabor?" },
    { en: "Have you ever tried a dessert from another country?", pt: "Você já experimentou uma sobremesa de outro país?" },
    { en: "What dessert reminds you of family gatherings?", pt: "Que sobremesa te lembra reuniões de família?" },
    { en: "Do you prefer homemade or store-bought desserts?", pt: "Você prefere sobremesas caseiras ou compradas?" },
    { en: "What is your favorite candy?", pt: "Qual é seu doce favorito?" },
    { en: "How often do you eat sweets?", pt: "Com que frequência você come doces?" },
    { en: "What dessert would you make for a special occasion?", pt: "Que sobremesa você faria para uma ocasião especial?" },
    { en: "Is there a dessert you dislike? Why?", pt: "Tem alguma sobremesa de que você não gosta? Por quê?" },
  ];

  const licenseQuestions: Question[] = [
    { en: "When did you get your driver's license?", pt: "Quando você tirou sua carteira de motorista?" },
    { en: "How old were you when you got it?", pt: "Quantos anos você tinha quando tirou?" },
    { en: "Was it difficult to pass the test?", pt: "Foi difícil passar no teste?" },
    { en: "Who taught you how to drive?", pt: "Quem te ensinou a dirigir?" },
    { en: "Were you nervous during your first driving lesson?", pt: "Você estava nervoso na sua primeira aula de direção?" },
    { en: "What was the first car you ever drove?", pt: "Qual foi o primeiro carro que você dirigiu?" },
    { en: "Do you remember your driving test?", pt: "Você se lembra do seu exame de direção?" },
    { en: "What advice would you give someone learning to drive?", pt: "Que conselho você daria a alguém aprendendo a dirigir?" },
    { en: "Did you fail your driving test the first time?", pt: "Você reprovou no exame de direção na primeira vez?" },
    { en: "Do you have any driving fears?", pt: "Você tem algum medo ao dirigir?" },
    { en: "Have you ever driven in another country?", pt: "Você já dirigiu em outro país?" },
    { en: "Is driving in your city difficult?", pt: "Dirigir na sua cidade é difícil?" },
    { en: "What was your first car like?", pt: "Como era seu primeiro carro?" },
    { en: "Do you drive every day?", pt: "Você dirige todos os dias?" },
    { en: "Do you prefer driving a manual or automatic car?", pt: "Você prefere dirigir um carro manual ou automático?" },
    { en: "What do you do when you get nervous while driving?", pt: "O que você faz quando fica nervoso ao dirigir?" },
    { en: "Would you like to ride a motorcycle too?", pt: "Você também gostaria de andar de moto?" },
    { en: "What rules of the road do you think are most important?", pt: "Quais regras de trânsito você considera mais importantes?" },
  ];

  const carQuestions: Question[] = [
    { en: "What kind of car do you drive?", pt: "Que tipo de carro você dirige?" },
    { en: "Do you have a favorite car brand?", pt: "Você tem uma marca de carro favorita?" },
    { en: "What is your dream car?", pt: "Qual é seu carro dos sonhos?" },
    { en: "Do you like old cars or modern cars?", pt: "Você gosta de carros antigos ou modernos?" },
    { en: "Do you usually listen to music while driving?", pt: "Você costuma ouvir música enquanto dirige?" },
    { en: "What is your favorite route to drive?", pt: "Qual é seu trajeto favorito de carro?" },
    { en: "Are you a calm or aggressive driver?", pt: "Você é um motorista calmo ou agressivo?" },
    { en: "Do you get road rage?", pt: "Você fica com raiva no trânsito?" },
    { en: "Do you like driving at night?", pt: "Você gosta de dirigir à noite?" },
    { en: "Have you ever been in a car accident?", pt: "Você já sofreu um acidente de carro?" },
    { en: "How often do you wash your car?", pt: "Com que frequência você lava seu carro?" },
    { en: "Do you like to keep your car clean?", pt: "Você gosta de manter seu carro limpo?" },
    { en: "Do you enjoy long drives?", pt: "Você gosta de viagens longas de carro?" },
    { en: "What is the longest distance you've ever driven?", pt: "Qual foi a maior distância que você já dirigiu?" },
    { en: "Do you prefer driving alone or with company?", pt: "Você prefere dirigir sozinho ou acompanhado?" },
    { en: "Have you ever driven in the rain or snow?", pt: "Você já dirigiu na chuva ou na neve?" },
    { en: "Do you use a GPS or do you prefer maps?", pt: "Você usa GPS ou prefere mapas?" },
    { en: "Do you like trucks or SUVs?", pt: "Você gosta de caminhonetes ou SUVs?" },
    { en: "What car would you recommend to a new driver?", pt: "Que carro você recomendaria a um novo motorista?" },
    { en: "Do you ever drive on weekends just for fun?", pt: "Você já dirige nos fins de semana apenas por diversão?" },
  ];

  const favoritesQuestions: Question[] = [
    { en: "What is your favorite time of the day?", pt: "Qual é sua hora favorita do dia?" },
    { en: "What is your favorite season of the year?", pt: "Qual é sua estação do ano favorita?" },
    { en: "What is your favorite movie?", pt: "Qual é seu filme favorito?" },
    { en: "What is your favorite song?", pt: "Qual é sua música favorita?" },
    { en: "What is your favorite color?", pt: "Qual é sua cor favorita?" },
    { en: "Who is your favorite person in the world?", pt: "Quem é sua pessoa favorita no mundo?" },
    { en: "What is your favorite place to relax?", pt: "Qual é seu lugar favorito para relaxar?" },
    { en: "What is your favorite holiday?", pt: "Qual é seu feriado favorito?" },
    { en: "What is your favorite thing to do with your family?", pt: "Qual é sua coisa favorita para fazer com sua família?" },
    { en: "What is your favorite childhood memory?", pt: "Qual é sua memória favorita de infância?" },
    { en: "What is your favorite smell?", pt: "Qual é seu cheiro favorito?" },
    { en: "What is your favorite sound?", pt: "Qual é seu som favorito?" },
    { en: "What is your favorite day of the week and why?", pt: "Qual é seu dia favorito da semana e por quê?" },
    { en: "What is your favorite book?", pt: "Qual é seu livro favorito?" },
    { en: "What is your favorite sport to watch?", pt: "Qual é seu esporte favorito para assistir?" },
    { en: "What is your favorite city in Brazil?", pt: "Qual é sua cidade favorita no Brasil?" },
    { en: "What is your favorite thing about yourself?", pt: "Qual é sua característica favorita em você mesmo?" },
    { en: "What is your favorite gift you've ever received?", pt: "Qual foi o melhor presente que você já recebeu?" },
    { en: "What is your favorite memory of your father or mother?", pt: "Qual é sua memória favorita do seu pai ou da sua mãe?" },
    { en: "What is your favorite thing about weekends?", pt: "Qual é sua coisa favorita nos fins de semana?" },
  ];

  // ===== KEYWORDS =====
  const keywords: { en: string; pt: string }[] = [
    { en: "routine", pt: "rotina" },
    { en: "daughter", pt: "filha" },
    { en: "son", pt: "filho" },
    { en: "childhood", pt: "infância" },
    { en: "to grow up", pt: "crescer" },
    { en: "memories", pt: "memórias / lembranças" },
    { en: "pregnancy", pt: "gravidez" },
    { en: "delivery room", pt: "sala de parto" },
    { en: "parenting", pt: "criação dos filhos" },
    { en: "work-life balance", pt: "equilíbrio entre trabalho e vida pessoal" },
    { en: "trip / journey", pt: "viagem" },
    { en: "abroad", pt: "no exterior" },
    { en: "souvenir", pt: "lembrança de viagem" },
    { en: "destination", pt: "destino" },
    { en: "meal", pt: "refeição" },
    { en: "dessert", pt: "sobremesa" },
    { en: "sweet tooth", pt: "gostar muito de doces" },
    { en: "driver's license", pt: "carteira de motorista" },
    { en: "driving habits", pt: "hábitos ao dirigir" },
    { en: "road trip", pt: "viagem de carro" },
    { en: "traffic jam", pt: "engarrafamento" },
    { en: "highway", pt: "rodovia" },
    { en: "gas station", pt: "posto de gasolina" },
    { en: "parking lot", pt: "estacionamento" },
    { en: "seat belt", pt: "cinto de segurança" },
    { en: "passenger", pt: "passageiro" },
    { en: "to drive safely", pt: "dirigir com segurança" },
    { en: "favorite", pt: "favorito" },
  ];

  const allSections = [
    {
      key: "routine",
      title: "Life & Daily Routine",
      emoji: "☀️",
      icon: Sun,
      color: "from-orange-500 to-orange-700",
      questions: routineQuestions,
    },
    {
      key: "family",
      title: "Family & Daughters",
      emoji: "👨‍👩‍👧",
      icon: Heart,
      color: "from-rose-500 to-rose-700",
      questions: familyQuestions,
    },
    {
      key: "childhood",
      title: "Childhood Memories",
      emoji: "🧸",
      icon: Users,
      color: "from-amber-500 to-amber-700",
      questions: childhoodQuestions,
    },
    {
      key: "parenting",
      title: "Becoming a Parent",
      emoji: "👶",
      icon: Baby,
      color: "from-pink-500 to-pink-700",
      questions: parentingQuestions,
    },
    {
      key: "work",
      title: "Work & Career",
      emoji: "💼",
      icon: Briefcase,
      color: "from-gray-700 to-gray-800",
      questions: workQuestions,
    },
    {
      key: "travel",
      title: "Travel & Trips",
      emoji: "✈️",
      icon: Plane,
      color: "from-sky-500 to-sky-700",
      questions: travelQuestions,
    },
    {
      key: "countries",
      title: "Countries & Cultures",
      emoji: "🌎",
      icon: Globe,
      color: "from-emerald-500 to-emerald-700",
      questions: countriesQuestions,
    },
    {
      key: "food",
      title: "Food & Meals",
      emoji: "🍽️",
      icon: Utensils,
      color: "from-red-500 to-red-700",
      questions: foodQuestions,
    },
    {
      key: "desserts",
      title: "Desserts & Sweets",
      emoji: "🍰",
      icon: Cake,
      color: "from-fuchsia-500 to-fuchsia-700",
      questions: dessertQuestions,
    },
    {
      key: "license",
      title: "Driver's License & Learning to Drive",
      emoji: "🪪",
      icon: Car,
      color: "from-indigo-500 to-indigo-700",
      questions: licenseQuestions,
    },
    {
      key: "cars",
      title: "Cars & Driving Habits",
      emoji: "🚗",
      icon: Car,
      color: "from-zinc-600 to-zinc-800",
      questions: carQuestions,
    },
    {
      key: "favorites",
      title: "Favorite Things",
      emoji: "⭐",
      icon: Star,
      color: "from-yellow-500 to-yellow-700",
      questions: favoritesQuestions,
    },
  ];

  const totalQuestions = allSections.reduce(
    (sum, s) => sum + s.questions.length,
    0
  );

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#faf6f0] bg-opacity-95 rounded-[40px] p-6 md:p-10 shadow-2xl">
        {/* ===================== HEADER ===================== */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-2 rounded-full mb-6 shadow-lg">
            <MessageCircle size={18} />
            <span className="font-bold tracking-wide text-sm uppercase">
              Conversation Class • B1–B2
            </span>
            <MessageCircle size={18} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            💬 Let's Talk About Life!
          </h1>
          <SpeakSentence
            text="A long conversation class with over 200 open-ended questions about life, family, travel, food, cars and much more."
            className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-6"
          >
            🗣️ A long conversation class with over 200 open-ended questions
            about life, family, travel, food, cars and much more.
          </SpeakSentence>
          <div className="inline-block bg-orange-100 text-orange-800 font-bold px-5 py-2 rounded-full text-sm mb-8">
            ✨ {totalQuestions} questions • {allSections.length} topics
          </div>
          <div className="max-w-2xl mx-auto">
            <img
              src={mainImage}
              alt="People having a conversation"
              onClick={() => setIsMainImageModalOpen(true)}
              className="w-full h-auto object-contain rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
            />
            <p className="text-center text-sm text-gray-500 mt-2">
              👆 Click the image to enlarge
            </p>
          </div>
        </div>

        {/* ===================== KEYWORDS SECTION ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                🔑 KEYWORDS
              </h2>
              <PencilIcon onClick={() => openNoteModal("Keywords")} />
            </div>
            <span className="text-sm text-orange-100">
              Click each word to hear it
            </span>
          </div>
          <div className="p-6 md:p-8">
            <SpeakSentence
              text="Learn these key words first. Click on each one to hear the pronunciation."
              className="text-md text-gray-600 mb-4 italic"
            >
              🎧 Learn these key words first. Click on each one to hear the
              pronunciation.
            </SpeakSentence>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {keywords.map((word, idx) => (
                <div
                  key={idx}
                  className="bg-orange-50 p-3 rounded-lg border border-orange-200 hover:border-orange-400 transition-colors"
                >
                  <SpeakText
                    text={word.en}
                    className="text-orange-700 font-bold cursor-pointer text-left w-full block"
                  >
                    {word.en}
                  </SpeakText>
                  <div className="text-gray-600 text-sm mt-1">{word.pt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===================== INSTRUCTIONS ===================== */}
        <div className="bg-gradient-to-r from-orange-100 to-amber-50 border-2 border-orange-200 rounded-[30px] p-6 md:p-8 mb-10">
          <h3 className="text-xl font-bold text-orange-800 mb-3 flex items-center gap-2">
            📢 How to use this class
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              • <strong>Click on any question</strong> to hear the American
              pronunciation.
            </li>
            <li>
              • Answer <strong>out loud</strong> with full sentences – not just
              one word.
            </li>
            <li>
              • Try to speak for <strong>at least 30 seconds</strong> on each
              question.
            </li>
            <li>
              • Use the <strong>pencil icon</strong> ✏️ in each section to save
              your own notes and answers.
            </li>
            <li>
              • All questions are <strong>open-ended</strong> – there is no
              "right" or "wrong" answer. Be honest and have fun!
            </li>
          </ul>
        </div>

        {/* ===================== QUESTION SECTIONS ===================== */}
        {allSections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections[section.key];
          return (
            <div
              key={section.key}
              className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-8 overflow-hidden"
            >
              <div
                className={`bg-gradient-to-r ${section.color} text-white py-4 px-6 md:px-8 flex justify-between items-center cursor-pointer`}
                onClick={() => toggleSection(section.key)}
              >
                <div className="flex items-center gap-3 flex-1">
                  <Icon size={22} />
                  <h2 className="text-lg md:text-2xl font-bold">
                    {section.emoji} {section.title}
                  </h2>
                  <span className="hidden md:inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {section.questions.length} questions
                  </span>
                  <div onClick={(e) => e.stopPropagation()}>
                    <PencilIcon onClick={() => openNoteModal(section.title)} />
                  </div>
                </div>
                <button
                  className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors flex-shrink-0"
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  {isOpen ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {isOpen && (
                <div
                  className="p-4 md:p-6 space-y-3 bg-orange-50/40"
                  style={{ animation: "fadeIn 0.3s ease-out" }}
                >
                  {section.questions.map((q, idx) => (
                    <QuestionCard key={idx} question={q} index={idx + 1} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* ===================== WRAP UP ===================== */}
        <div className="bg-white border-2 border-orange-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-6 px-8">
            <h2 className="text-3xl font-bold">🎯 WRAP UP!</h2>
            <SpeakSentence
              text="Keep the conversation going!"
              className="mt-2 text-orange-100 italic"
            >
              🗣️ Keep the conversation going!
            </SpeakSentence>
          </div>
          <div className="bg-orange-50 p-6 md:p-8">
            <h3 className="font-bold text-orange-800 text-lg mb-4">
              💡 Tips for a great conversation
            </h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>
                <strong>Answer with full sentences.</strong> Instead of "Yes,"
                say "Yes, I love traveling with my family."
              </li>
              <li>
                <strong>Give examples.</strong> When you say "I like Italian
                food," add: "Last year I went to a wonderful Italian restaurant
                in São Paulo."
              </li>
              <li>
                <strong>Use linking words:</strong> because, so, but, however,
                also, actually, honestly.
              </li>
              <li>
                <strong>Ask the question back</strong> to keep the conversation
                flowing.
              </li>
              <li>
                <strong>Don't worry about mistakes.</strong> Fluency comes with
                practice, not perfection.
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-orange-300">
              <p className="text-orange-800 italic">
                🌟 <strong>Challenge:</strong> Pick 10 questions from different
                sections and record yourself answering them. Listen and repeat
                – that is how you improve!
              </p>
            </div>
          </div>
        </div>

        {/* ===================== NAVIGATION ===================== */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson60")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            ← Previous Lesson
          </button>
          <button
            onClick={() => router.push("/cursos/lesson62")}
            className="bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson →
          </button>
        </div>
      </div>

      {/* ===== IMAGE MODAL ===== */}
      {isMainImageModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setIsMainImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-full p-4">
            <img
              src={mainImage}
              alt="Conversation class"
              className="max-w-full max-h-screen object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setIsMainImageModalOpen(false)}
              className="absolute top-4 right-6 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <NoteModal
        isOpen={noteModal.isOpen}
        onClose={() => setNoteModal((prev) => ({ ...prev, isOpen: false }))}
        sectionTitle={noteModal.sectionTitle}
        initialNote={noteModal.noteContent}
        onSave={saveNote}
      />

      <style jsx global>{`
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
      `}</style>
    </div>
  );
}