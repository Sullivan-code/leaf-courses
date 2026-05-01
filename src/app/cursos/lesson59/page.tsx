"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type SectionKey = "verbs" | "vocabulary" | "usefulPhrases" | "grammar";

export default function Lesson59() {
  const router = useRouter();
  const [openDrills, setOpenDrills] = useState({
    verbs: false,
    vocabulary: false,
    usefulPhrases: false,
    grammar: false,
  });
  const [showNegativeExplanation, setShowNegativeExplanation] = useState(false);
  const [showQuestionsExplanation, setShowQuestionsExplanation] = useState(false);

  const toggleDrill = (section: SectionKey) => {
    setOpenDrills({
      ...openDrills,
      [section]: !openDrills[section],
    });
  };

  const playAudio = (text: string) => {
    const formattedText = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\s-]/g, "")
      .replace(/'/g, "")
      .trim();

    console.log("Trying to play audio:", `/audios/${formattedText}.mp3`);

    const audio = new Audio(`/audios/${formattedText}.mp3`);
    audio.play().catch((e) => console.error("Error playing audio:", e));
  };

  // Image URLs
  const mainImage =
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const verbsImage =
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const vocabularyImage =
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const phrasesImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";
  const grammarImage =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

  // Lesson 57 data
  const verbs = [
    { english: "to arrive", portuguese: "chegar" },
    { english: "to leave", portuguese: "deixar, partir, sair" },
  ];

  const newWords = [
    { english: "guest", portuguese: "hóspede" },
    { english: "foreigner", portuguese: "estrangeiro(a)" },
    { english: "nationality", portuguese: "nacionalidade" },
    { english: "ride", portuguese: "carona" },
    { english: "hostel", portuguese: "albergue" },
    { english: "hotel", portuguese: "hotel" },
    { english: "lobby", portuguese: "saguão" },
    { english: "room service", portuguese: "serviço de quarto" },
    { english: "fitness center", portuguese: "sala de ginástica" },
    { english: "cable TV", portuguese: "TV a cabo" },
    { english: "swimming pool", portuguese: "piscina" },
    { english: "parking lot", portuguese: "estacionamento" },
    { english: "reservation", portuguese: "reserva" },
    { english: "available", portuguese: "disponível" },
    { english: "comfortable", portuguese: "confortável" },
    { english: "convenient", portuguese: "conveniente" },
    { english: "nice", portuguese: "bom, legal" },
    { english: "free", portuguese: "de graça, gratuito" },
    { english: "cozy", portuguese: "aconchegante" },
    { english: "clean", portuguese: "limpo" },
    { english: "how", portuguese: "como" },
  ];

  const usefulPhrases = [
    { english: "My friends want to go on a trip to France.", portuguese: "Meus amigos querem fazer uma viagem para a França." },
    { english: "The hostel is in front of the museum.", portuguese: "O albergue fica em frente ao museu." },
    { english: "I still have to book a room.", portuguese: "Ainda tenho que reservar um quarto." },
    { english: "Actually, they are early.", portuguese: "Na verdade, eles estão adiantados." },
    { english: "I will check in at 3:00 p.m.", portuguese: "Vou fazer o check-in às 15h." },
    { english: "Could you help me with my luggage?", portuguese: "Você poderia me ajudar com minha bagagem?" },
    { english: "I would prefer a quieter room.", portuguese: "Eu preferiria um quarto mais silencioso." },
    { english: "We might stay here for two nights.", portuguese: "Podemos ficar aqui por duas noites." },
  ];

  const grammarExamples = [
    { english: "There is a big swimming pool in the hotel.", portuguese: "Tem uma piscina grande no hotel." },
    { english: "I'm sure there is cable TV in our room.", portuguese: "Tenho certeza que tem TV a cabo no nosso quarto." },
    { english: "There is a cab waiting for you.", portuguese: "Tem um táxi esperando por você." },
    { english: "There are usually a lot of young people in hostels.", portuguese: "Geralmente há muitos jovens em albergues." },
    { english: "There are a lot of tourists in the city this weekend.", portuguese: "Há muitos turistas na cidade neste fim de semana." },
    { english: "There will be a meeting in the lobby.", portuguese: "Haverá uma reunião no saguão." },
    { english: "There could be a problem with the reservation.", portuguese: "Poderia haver um problema com a reserva." },
    { english: "There would be more guests during the holidays.", portuguese: "Haveria mais hóspedes durante os feriados." },
  ];

  // Real Life Practice Sentences
  const realLifeSentences = [
    { english: "I will leave home very early tomorrow.", portuguese: "Eu sairei de casa muito cedo amanhã." },
    { english: "She usually leaves work at 6:00 p.m.", portuguese: "Ela geralmente sai do trabalho às 18h." },
    { english: "What time will you have to leave the hotel?", portuguese: "Que horas você terá que sair do hotel?" },
    { english: "I sometimes arrive home from work very late.", portuguese: "Às vezes chego em casa do trabalho muito tarde." },
    { english: "What time do they need to arrive at the airport?", portuguese: "Que horas eles precisam chegar ao aeroporto?" },
    { english: "Could we meet in the lobby at 8:00?", portuguese: "Poderíamos nos encontrar no saguão às 8h?" },
    { english: "There is a parking lot in front of the restaurant.", portuguese: "Há um estacionamento em frente ao restaurante." },
    { english: "There is a painkiller in my purse. You can take it.", portuguese: "Tem um analgésico na minha bolsa. Você pode tomar." },
    { english: "There is free wi-fi at the hotel.", portuguese: "Tem wi-fi grátis no hotel." },
    { english: "I think there are some free tours, too.", portuguese: "Acho que também há alguns passeios gratuitos." },
    { english: "There are great hostels in NYC.", portuguese: "Existem ótimos albergues em Nova York." },
    { english: "There are guests from different countries here.", portuguese: "Há hóspedes de diferentes países aqui." },
    { english: "I would recommend this hotel.", portuguese: "Eu recomendaria este hotel." },
    { english: "We could explore the city together.", portuguese: "Nós poderíamos explorar a cidade juntos." },
    { english: "This place will probably be crowded.", portuguese: "Este lugar provavelmente estará cheio." },
  ];

  const countriesNationalities = [
    { country: "Canada", nationality: "Canadian" },
    { country: "Argentina", nationality: "Argentinian" },
    { country: "Japan", nationality: "Japanese" },
    { country: "China", nationality: "Chinese" },
    { country: "Mexico", nationality: "Mexican" },
  ];

  return (
    <div
      className="min-h-screen rounded-2xl py-16 px-6 bg-fixed"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto bg-[#f0f8ff] bg-opacity-95 rounded-[40px] p-10 shadow-lg">
        {/* Centered title with image below */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#0c4a6e] mb-6">
            🔵 Lesson 59 - Hotel & Travel
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-8">
            Learn to talk about arriving, leaving, hotels, reservations, and
            using "there is / there are".
          </p>
          <div className="w-64 h-64 mx-auto">
            <img
              src={mainImage}
              alt="Hotel and travel"
              className="w-full h-full object-cover rounded-2xl shadow-md"
            />
          </div>
        </div>

        {/* Section 1 - Verbs with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🔹 VERBS</h2>
              <p className="mt-2 text-blue-100 italic">
                to arrive = chegar | to leave = deixar, partir, sair
              </p>
            </div>
            <button
              onClick={() => toggleDrill("verbs")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.verbs ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              {verbs.map((verb, index) => (
                <li key={index}>
                  <button
                    onClick={() => playAudio(verb.english)}
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors"
                  >
                    {verb.english}
                  </button>{" "}
                  = {verb.portuguese}
                </li>
              ))}
            </ul>

            {openDrills.verbs && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    1.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I arrive")}
                    >
                      Eu chego.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("We arrive")}
                    >
                      Nós chegamos.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They arrive")}
                    >
                      Eles chegam.
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 I arrive. / We arrive. / They arrive.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("She doesn't arrive")}
                    >
                      Ela não chega.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("He doesn't arrive")}
                    >
                      Ele não chega.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("You don't arrive")}
                    >
                      Você não chega.
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 She doesn't arrive. / He doesn't arrive. / You don't
                    arrive.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Do you arrive")}
                    >
                      Vocês chegam?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Do they arrive")}
                    >
                      Eles chegam?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Does he arrive")}
                    >
                      Ele chega?
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Do you arrive? / Do they arrive? / Does he arrive?
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will arrive home at 6:00 p.m.")}
                    >
                      I will arrive home at 6:00 p.m.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will arrive home at 5:00")}
                    >
                      5:00
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will arrive home at 7:00 p.m.")}
                    >
                      7:00
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Eu chegarei em casa às 18h. / 17h / 19h
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I leave")}
                    >
                      Eu saio.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("We leave")}
                    >
                      Nós partimos.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They leave")}
                    >
                      Eles deixam.
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 I leave. / We leave. / They leave.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("He doesn't leave")}
                    >
                      Ele não sai.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("She doesn't leave")}
                    >
                      Ela não sai.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("The plane doesn't leave")}
                    >
                      O avião não sai.
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 He doesn't leave. / She doesn't leave. / The plane
                    doesn't leave.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time does the bus leave")}
                    >
                      A que horas o ônibus parte?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time does the train leave")}
                    >
                      o trem
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time does the plane leave")}
                    >
                      o avião
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 What time does the bus leave? / the train / the plane
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time do you usually arrive")}
                    >
                      A que horas você geralmente chega?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time do you usually leave")}
                    >
                      sair
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("What time do you usually come")}
                    >
                      vem
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 What time do you usually arrive? / leave / come
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could we arrive at 3:00")}
                    >
                      Nós poderíamos chegar às 3:00?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could we leave at 3:00")}
                    >
                      partir
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could we go at 3:00")}
                    >
                      ir
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Could we arrive at 3:00? / leave / go
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    10.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are arriving now")}
                    >
                      Eles estão chegando agora.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are leaving now")}
                    >
                      saindo
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are traveling now")}
                    >
                      viajando
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 They are arriving now. / leaving / traveling
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    11.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will arrive earlier tomorrow")}
                    >
                      Eu chegarei mais cedo amanhã.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will leave earlier tomorrow")}
                    >
                      sair
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will come back earlier tomorrow")}
                    >
                      voltar
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 I will arrive earlier tomorrow. / leave / come back
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    12.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would you like to leave later")}
                    >
                      Você gostaria de sair mais tarde?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would you like to arrive later")}
                    >
                      chegar
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would you like to travel later")}
                    >
                      viajar
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Would you like to leave later? / arrive / travel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2 - Vocabulary with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟣 NEW WORDS</h2>
              <p className="mt-2 text-blue-100 italic">
                Hotel & travel vocabulary
              </p>
            </div>
            <button
              onClick={() => toggleDrill("vocabulary")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.vocabulary ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {newWords.map((word, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-3 rounded-lg border border-blue-200"
                >
                  <button
                    onClick={() => playAudio(word.english)}
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {word.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">
                    {word.portuguese}
                  </div>
                </div>
              ))}
            </div>

            {openDrills.vocabulary && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    1.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I want to take a trip")}
                    >
                      Eu quero fazer uma viagem.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I want to take a cruise")}
                    >
                      um cruzeiro
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I want to take a tour")}
                    >
                      um tour
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 I want to take a trip. / a cruise / a tour
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Do you want to take a trip to Italy")}
                    >
                      Você quer fazer uma viagem para a Itália?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Do you want to take a trip to Spain")}
                    >
                      Espanha
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Do you want to take a trip to the United States")}
                    >
                      Estados Unidos
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Do you want to take a trip to Italy? / Spain / the
                    United States
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will book a room at the hotel")}
                    >
                      Eu vou reservar um quarto no hotel.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will book a room at the hostel")}
                    >
                      albergue
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("I will book a room at the resort")}
                    >
                      resort
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 I will book a room at the hotel. / hostel / resort
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could you book a room for me")}
                    >
                      Você poderia reservar um quarto para mim?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could he book a room for me")}
                    >
                      Ele
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Could she book a room for me")}
                    >
                      Ela
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Could you book a room for me? / Could he / Could she
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Actually I can't")}
                    >
                      Na verdade, eu não posso.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Actually I can")}
                    >
                      eu posso
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Actually, I can't. / I can
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are in front of the hostel")}
                    >
                      Eles estão em frente ao albergue.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are in front of the hotel")}
                    >
                      hotel
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("They are in front of the mall")}
                    >
                      shopping
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 They are in front of the hostel. / hotel / mall
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Actually she would be in front of the park")}
                    >
                      Na verdade, ela estaria em frente ao parque.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Actually she would be in front of the movie theater")}
                    >
                      cinema
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Actually she would be in front of the school")}
                    >
                      escola
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Actually, she would be in front of the park. / movie
                    theater / school
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many shoes under your bed")}
                    >
                      Há muitos sapatos embaixo da sua cama.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many things under your bed")}
                    >
                      coisas
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many bags under your bed")}
                    >
                      bolsas
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There are many shoes under your bed. / things / bags
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many attractions in this city")}
                    >
                      Há muitas atrações nesta cidade.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many restaurants in this city")}
                    >
                      restaurantes
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many stores in this city")}
                    >
                      lojas
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There are many attractions in this city. / restaurants /
                    stores
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    10.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are some guests in the lobby")}
                    >
                      Tem alguns hóspedes no saguão.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are some guests at the pool")}
                    >
                      na piscina
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are some guests at the fitness center")}
                    >
                      na sala de ginástica
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There are some guests in the lobby. / at the pool / at
                    the fitness center
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    11.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Is the room available")}
                    >
                      O quarto está disponível?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Is the room comfortable")}
                    >
                      confortável
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Is the room clean")}
                    >
                      limpo
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Is the room available? / comfortable / clean
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    12.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would it be convenient to stay here")}
                    >
                      Seria conveniente ficar aqui?
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would it be convenient to book here")}
                    >
                      reservar
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("Would it be convenient to cancel here")}
                    >
                      cancelar
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 Would it be convenient to stay here? / book / cancel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 3 - Useful Phrases with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟢 USEFUL PHRASES</h2>
              <p className="mt-2 text-blue-100 italic">
                Common expressions for travel and hotels
              </p>
            </div>
            <button
              onClick={() => toggleDrill("usefulPhrases")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.usefulPhrases ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {usefulPhrases.map((phrase, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-4 rounded-lg border border-blue-200"
                >
                  <button
                    onClick={() => playAudio(phrase.english)}
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-lg mb-2"
                  >
                    {phrase.english}
                  </button>
                  <div className="text-gray-600">{phrase.portuguese}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4 - Grammar with Drill */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🟡 GRAMMAR — THERE IS / THERE ARE</h2>
              <p className="mt-2 text-blue-100 italic">
                Using "there is" and "there are" for existence
              </p>
            </div>
            <button
              onClick={() => toggleDrill("grammar")}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-full transition-colors"
            >
              {openDrills.grammar ? "Hide Practice" : "Show Practice"}
            </button>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 p-4 rounded-[20px] text-gray-800 space-y-3 mb-6">
              {grammarExamples.map((example, index) => (
                <div key={index} className="p-3 bg-white rounded-lg">
                  <button
                    onClick={() => playAudio(example.english)}
                    className="text-blue-600 font-bold cursor-pointer hover:text-blue-800 transition-colors text-left w-full"
                  >
                    {example.english}
                  </button>
                  <div className="text-gray-600 text-sm mt-1">
                    {example.portuguese}
                  </div>
                </div>
              ))}
            </div>

            {openDrills.grammar && (
              <div className="mt-4 bg-blue-50 rounded-2xl p-6 space-y-4 animate-fadeIn">
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    1.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a hotel near my house")}
                    >
                      Tem um hotel perto da minha casa.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a hostel near my house")}
                    >
                      albergue
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a parking lot near my house")}
                    >
                      estacionamento
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There is a hotel near my house. / hostel / parking lot
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    2.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is free room service here")}
                    >
                      Tem serviço de quarto grátis aqui.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is cable TV here")}
                    >
                      TV a cabo
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There is free room service here. / cable TV
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    3.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a receipt on the table")}
                    >
                      Há um recibo em cima da mesa.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a ticket on the table")}
                    >
                      um ingresso
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a passport on the table")}
                    >
                      um passaporte
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There is a receipt on the table. / a ticket / a
                    passport
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    4.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a restaurant in front of the hotel")}
                    >
                      Há um restaurante em frente ao hotel.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a bar in front of the hotel")}
                    >
                      um bar
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a snack bar in front of the hotel")}
                    >
                      uma lanchonete
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There is a restaurant in front of the hotel. / a bar / a
                    snack bar
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    5.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a park near here")}
                    >
                      Há um parque perto daqui.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is a museum near here")}
                    >
                      museu
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There is an outlet near here")}
                    >
                      outlet
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There is a park near here. / museum / outlet
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    6.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many guests at the hotel")}
                    >
                      Tem muitos hóspedes no hotel.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many foreigners at the hotel")}
                    >
                      estrangeiros
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many people at the hotel")}
                    >
                      pessoas
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There are many guests at the hotel. / foreigners / people
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    7.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many things in my bag")}
                    >
                      Tem muitas coisas na minha bolsa.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many things in my suitcase")}
                    >
                      mala
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There are many things in my luggage")}
                    >
                      bagagem
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There are many things in my bag. / suitcase / luggage
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    8.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There will be many tourists tomorrow")}
                    >
                      Haverá muitos turistas amanhã.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There will be many tourists today")}
                    >
                      hoje
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There will be many tourists this weekend")}
                    >
                      neste fim de semana
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There will be many tourists tomorrow. / today / this
                    weekend
                  </p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-blue-200">
                  <p className="text-lg font-medium text-gray-800">
                    9.{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There could be a problem here")}
                    >
                      Poderia haver um problema aqui.
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There could be a delay here")}
                    >
                      atraso
                    </span>{" "}
                    /{" "}
                    <span
                      className="text-blue-600 font-bold cursor-pointer hover:text-blue-800"
                      onClick={() => playAudio("There could be a mistake here")}
                    >
                      erro
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    🇧🇷 There could be a problem here. / delay / mistake
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 - Real Life Practice */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8">
            <h2 className="text-2xl font-bold">🔵 REAL LIFE</h2>
            <p className="mt-2 text-blue-100 italic">
              Practice real-life situations about travel, hotels, and daily routines
            </p>
          </div>

          <div className="p-8">
            <div className="bg-blue-50 rounded-[20px] p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sentences - 2/3 width on large */}
                <div className="lg:w-2/3 space-y-6">
                  {realLifeSentences.map((sentence, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start">
                        <button
                          onClick={() => playAudio(sentence.english)}
                          className="mr-3 mt-1 text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
                          aria-label="Play audio"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                        <div>
                          <p className="text-lg font-medium">
                            {index + 1}. {sentence.english}
                          </p>
                          <p className="text-sm text-gray-600">
                            {sentence.portuguese}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Image container - 1/3 width on large */}
                <div className="lg:w-1/3 flex flex-col gap-4">
                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={verbsImage}
                        alt="Travel and arrival"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Arriving and leaving
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={phrasesImage}
                        alt="Hotel lobby"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Hotel and accommodations
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl p-4 shadow-md h-full">
                    <div className="relative h-40 w-full">
                      <img
                        src={grammarImage}
                        alt="Travel planning"
                        className="rounded-xl object-cover w-full h-full"
                      />
                    </div>
                    <p className="text-center mt-2 text-gray-700 italic">
                      Making travel plans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 - Check It Out! */}
        <div className="bg-white border-2 border-blue-200 rounded-[30px] shadow-lg mb-10 overflow-hidden">
          <div className="bg-blue-500 text-white py-4 px-8 flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold">🟣 CHECK IT OUT!</h2>
              <p className="mt-2 text-blue-100 italic">
                Countries, Nationalities & Useful Expressions
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left column - Countries & Nationalities */}
            <div className="bg-green-800 text-white flex-1 p-6 space-y-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">
                    COUNTRIES & NATIONALITIES
                  </h3>
                  <button
                    onClick={() => setShowNegativeExplanation(!showNegativeExplanation)}
                    className="text-xs bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showNegativeExplanation ? "Hide" : "Show"}
                  </button>
                </div>
                {showNegativeExplanation && (
                  <div className="mb-4 p-4 bg-green-700 rounded-lg border border-green-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">
                      🌍 Países e Nacionalidades:
                    </p>
                    {countriesNationalities.map((item, idx) => (
                      <p key={idx} className="text-green-200 text-sm">
                        {item.country} → {item.nationality}
                      </p>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  {countriesNationalities.map((item, idx) => (
                    <div key={idx} className="p-3 bg-green-700 rounded-lg">
                      <p className="font-bold text-lg">{item.country}</p>
                      <p className="text-green-200 text-sm">
                        → {item.nationality}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column - Useful Expressions */}
            <div className="bg-red-800 text-white flex-1 p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-yellow-300">
                    USEFUL EXPRESSIONS
                  </h3>
                  <button
                    onClick={() => setShowQuestionsExplanation(!showQuestionsExplanation)}
                    className="text-xs bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded-full transition-colors"
                  >
                    {showQuestionsExplanation ? "Hide" : "Show"}
                  </button>
                </div>
                {showQuestionsExplanation && (
                  <div className="mb-4 p-4 bg-red-700 rounded-lg border border-red-600">
                    <p className="text-yellow-200 text-sm font-medium mb-2">
                      📝 Expressões úteis:
                    </p>
                    <ul className="text-red-200 text-sm list-disc pl-4 space-y-1">
                      <li>to arrive at = chegar a (um lugar específico)</li>
                      <li>to arrive from = chegar de (um lugar)</li>
                      <li>How do you like your room? = O que você achou do seu quarto?</li>
                      <li>to check in = fazer check-in</li>
                      <li>to check out = fazer check-out</li>
                      <li>free wi-fi = wi-fi grátis</li>
                      <li>Would you like a wake-up call? = Gostaria de um telefonema para acordar?</li>
                      <li>Could I have a late check-out? = Poderia ter um check-out tardio?</li>
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">to arrive at</p>
                    <p className="text-red-200 text-sm">chegar a (ex: the airport)</p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">to arrive from</p>
                    <p className="text-red-200 text-sm">chegar de (ex: New York)</p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">How do you like your room?</p>
                    <p className="text-red-200 text-sm">
                      → It's great. It's cozy and very clean.
                    </p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">to check in / to check out</p>
                    <p className="text-red-200 text-sm">fazer check-in / check-out</p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">free wi-fi</p>
                    <p className="text-red-200 text-sm">wi-fi grátis</p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">Would you like a wake-up call?</p>
                    <p className="text-red-200 text-sm">Gostaria de um telefonema para acordar?</p>
                  </div>
                  <div className="p-3 bg-red-700 rounded-lg">
                    <p className="font-bold text-lg">Could I have a late check-out?</p>
                    <p className="text-red-200 text-sm">Poderia ter um check-out tardio?</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next lesson buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => router.push("/cursos/lesson58")}
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            &larr; Previous Lesson (56)
          </button>
          <button
            onClick={() => router.push("/cursos/lesson60")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full transition-colors"
          >
            Next Lesson (58) &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}